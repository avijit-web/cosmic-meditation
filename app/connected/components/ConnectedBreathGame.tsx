"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RotateCcw, Globe2 } from "lucide-react";
import { breathAudio } from "../audio/breathAudio";
import { LAYER_VOLUMES } from "../audio/layers";
import { toCountryMarkers } from "../data/participants";
import { buildSession, type BreathSession } from "../data/session";
import { BreathPhase, Participant, ScriptStep } from "../types";
import {
  clamp01,
  ease,
  easeInOutSine,
  easeOutCubic,
  lerp,
  makeOrbitSeed,
  orbitAt,
  orientForArrival,
  widenOrbit,
  type OrbitSeed,
} from "../lib/orbit";
import { GlobeStage } from "./GlobeStage";
import type { GlobeView } from "./GlobeInner";
import { OrbitStars, type StarView } from "./OrbitStars";
import { BreathOrb } from "./BreathOrb";
import { useCountry } from "./CountryProvider";
import { LiveCount } from "./LiveCount";

/**
 * Fraction of the globe canvas actually filled by the sphere at our resting
 * camera altitude — used to sit the star orbits right against the halo.
 */
const GLOBE_RADIUS_RATIO = 0.357;
/** Globe scale on the idle screen: present, but not yet the whole world. */
const GLOBE_IDLE_SCALE = 0.5;
/** Orb diameter as a fraction of the stage. */
const ORB_RATIO = 0.33;
/** How long a star takes to bloom in after it joins. */
const STAR_APPEAR_SECONDS = 1.0;
/** Gap between two people from the same place arriving. */
const STAR_STAGGER_SECONDS = 0.34;
/** Auto-rotation rate for the beats that show the whole circle. */
const SWEEP_SPIN_SPEED = 3.2;
/** Below this width the stage is allowed to fill the whole viewport. */
const PHONE_BREAKPOINT = 640;

const EMPTY_VIEW: GlobeView = { focus: null, markers: [], spinSpeed: 0.5 };

/**
 * True when two globe views are visually identical.
 *
 * Consecutive beats often ask for the same highlight (an arrival holds its
 * country through both the inhale and the exhale). Handing three-globe a fresh
 * array each time would make it tear the pills down and re-animate them, so we
 * keep the previous object whenever nothing actually changed.
 */
function sameView(a: GlobeView, b: GlobeView): boolean {
  if ((a.spinSpeed ?? 0.5) !== (b.spinSpeed ?? 0.5)) return false;

  const af = a.focus;
  const bf = b.focus;
  if (Boolean(af) !== Boolean(bf)) return false;
  if (af && bf && (af.lat !== bf.lat || af.lng !== bf.lng)) return false;

  if (a.markers.length !== b.markers.length) return false;
  return a.markers.every((m, i) => {
    const o = b.markers[i];
    return m.atlasName === o.atlasName && m.label === o.label;
  });
}

type Status = "idle" | "running" | "complete";

interface StarMeta {
  key: string;
  seed: OrbitSeed;
  bornAt: number;
  isYou: boolean;
  size: number;
  lastZ: string;
}

interface DisplayText {
  eyebrow?: string;
  text?: string;
  subText?: string;
}

export function ConnectedBreathGame() {
  const visitorCountry = useCountry();

  const [stageSize, setStageSize] = useState(460);
  const [status, setStatus] = useState<Status>("idle");
  const [globeReady, setGlobeReady] = useState(false);
  const [session, setSession] = useState<BreathSession | null>(null);

  const [display, setDisplay] = useState<DisplayText>({});
  const [textFade, setTextFade] = useState<"in" | "out">("in");
  const [view, setView] = useState<GlobeView>(EMPTY_VIEW);
  const [starViews, setStarViews] = useState<StarView[]>([]);
  const [spotlight, setSpotlight] = useState<Set<string>>(new Set());
  const [tally, setTally] = useState(0);
  const [phase, setPhase] = useState<BreathPhase | null>(null);

  // --- refs driven by the animation loop ------------------------------------
  const globeWrapRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const starNodes = useRef<Map<string, HTMLDivElement>>(new Map());

  /** The loop reads the session from here so it never closes over stale state. */
  const sessionRef = useRef<BreathSession | null>(null);
  const starsRef = useRef<StarMeta[]>([]);
  /** Everyone who has joined the circle so far, for the "all" beats. */
  const joinedRef = useRef<Participant[]>([]);
  const seedCounter = useRef(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef(0);
  const stepIndexRef = useRef(-1);
  const textTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const musicFadedRef = useRef(false);

  const orbSize = stageSize * ORB_RATIO;

  /** Keeps the previous view object when the new one looks the same. */
  const applyView = useCallback((next: GlobeView) => {
    setView((prev) => (sameView(prev, next) ? prev : next));
  }, []);

  // The rAF loop reads status from a ref so it can bail out cleanly the frame
  // after the session ends, without re-subscribing.
  const statusRef = useRef<Status>(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // --- the circle for this visit --------------------------------------------
  // Drawn once the visitor's country is known (or known to be unknown), so the
  // idle screen's headcount and "This is you" agree. Redrawn on every restart.
  useEffect(() => {
    if (visitorCountry === undefined) return;
    if (statusRef.current !== "idle") return;
    const next = buildSession(visitorCountry);
    sessionRef.current = next;
    setSession(next);
  }, [visitorCountry]);

  // --- responsive stage ------------------------------------------------------
  useEffect(() => {
    const measure = () => {
      const phone = window.innerWidth < PHONE_BREAKPOINT;
      // On a phone the globe is the whole show, so let the stage run edge to
      // edge; the sphere itself only fills ~72% of it.
      const byWidth = window.innerWidth * (phone ? 1.0 : 0.85);
      const byHeight = window.innerHeight * (phone ? 0.62 : 0.7);
      setStageSize(Math.max(260, Math.min(620, byWidth, byHeight)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // --- text cross-fade -------------------------------------------------------
  const swapText = useCallback((next: DisplayText) => {
    if (textTimerRef.current) clearTimeout(textTimerRef.current);
    setTextFade("out");
    textTimerRef.current = setTimeout(() => {
      setDisplay(next);
      setTextFade("in");
    }, 520);
  }, []);

  // --- star bookkeeping ------------------------------------------------------
  /** Adds a group's stars to the orbit and returns their keys. */
  const addStars = useCallback(
    (participant: Participant, bornAt: number): string[] => {
      const added: StarMeta[] = [];

      for (let i = 0; i < participant.count; i++) {
        const index = seedCounter.current++;
        const arrivesAt = bornAt + i * STAR_STAGGER_SECONDS;

        let seed = orientForArrival(makeOrbitSeed(index), arrivesAt, index);
        if (participant.isYou) seed = widenOrbit(seed, 1.5);

        added.push({
          key: `${participant.id}-${i}`,
          seed,
          bornAt: arrivesAt,
          isYou: Boolean(participant.isYou),
          size: participant.isYou ? 13 : 7 + (index % 3),
          lastZ: "",
        });
      }

      starsRef.current = [...starsRef.current, ...added];
      joinedRef.current = [...joinedRef.current, participant];

      setStarViews(
        starsRef.current.map((s) => ({
          key: s.key,
          bornAt: s.bornAt,
          isYou: s.isYou,
          size: s.size,
        })),
      );

      return added.map((s) => s.key);
    },
    [],
  );

  // --- per-step side effects -------------------------------------------------
  const enterStep = useCallback(
    (step: ScriptStep, index: number) => {
      const current = sessionRef.current;
      if (!current) return;

      setPhase(step.phase);
      swapText({
        eyebrow: step.eyebrow,
        text: step.text,
        subText: step.subText,
      });

      if (step.breathCue) breathAudio.cue(step.breathCue);

      const stepStart = current.stepStartTimes[index];
      const participant = step.participantId
        ? current.byId[step.participantId]
        : undefined;

      // 1. Bring in whoever this beat introduces, before we work out what to
      //    light up — the "all" view needs to include them.
      let introducedKeys: string[] = [];

      if (step.introduces === "self") {
        // Your star materialises late in `reveal`, exactly as the orb dims.
        introducedKeys = addStars(
          current.you,
          stepStart + step.duration - STAR_APPEAR_SECONDS,
        );
      } else if (step.introduces === "cohort") {
        // Everyone already here arrives together, fanned out over the beat.
        introducedKeys = current.cohort.flatMap((p, i) =>
          addStars(p, stepStart + 0.5 + i * 0.45),
        );
      } else if (step.introduces === "participant" && participant) {
        introducedKeys = addStars(participant, stepStart + 0.4);
      }

      // 2. Point the camera and light up the map.
      const mode = step.focusMode ?? "none";
      const you = current.you;

      if (mode === "all") {
        applyView({
          focus: null,
          markers: toCountryMarkers(joinedRef.current),
          spinSpeed: SWEEP_SPIN_SPEED,
        });
      } else if (mode === "self") {
        applyView({
          focus: { lat: you.lat, lng: you.lng },
          // `reveal` flies the camera over with no highlight; `you` names it.
          markers: step.phase === "reveal" ? [] : toCountryMarkers([you]),
        });
      } else if (mode === "participant" && participant) {
        applyView({
          focus: { lat: participant.lat, lng: participant.lng },
          markers: toCountryMarkers([participant]),
        });
      } else {
        applyView(EMPTY_VIEW);
      }

      // 3. Ring the stars this beat is about.
      if (mode === "all") {
        setSpotlight(new Set(starsRef.current.map((s) => s.key)));
      } else if (mode === "self") {
        setSpotlight(
          new Set(starsRef.current.filter((s) => s.isYou).map((s) => s.key)),
        );
      } else if (mode === "participant" && participant) {
        const keys = introducedKeys.length
          ? introducedKeys
          : starsRef.current
              .filter((s) => s.key.startsWith(`${participant.id}-`))
              .map((s) => s.key);
        setSpotlight(new Set(keys));
      } else {
        setSpotlight(new Set());
      }

      // 4. Sound: let the pad go with the closing sequence; the wind stays.
      if (step.phase === "converge" && !musicFadedRef.current) {
        musicFadedRef.current = true;
        breathAudio.setLayer("space", 0, 7);
      }

      if (step.phase === "complete") setStatus("complete");
    },
    [addStars, applyView, swapText],
  );

  // --- the animation loop ----------------------------------------------------
  useEffect(() => {
    if (status !== "running") return;

    const renderOrb = (
      step: ScriptStep,
      progress: number,
      elapsed: number,
      globeRadius: number,
    ) => {
      const node = orbRef.current;
      if (!node) return;

      if (step.phase === "welcome" || step.phase === "connecting") {
        // A slow idle swell, so the orb feels alive while we wait.
        const pulse = 1 + Math.sin(elapsed * 0.9) * 0.025;
        node.style.transform = `translate3d(0,0,0) scale(${pulse})`;
        node.style.opacity = "1";
        return;
      }

      if (step.phase === "reveal") {
        const you = starsRef.current.find((s) => s.isYou);
        // Front-loaded so the orb has all but collapsed by the time the globe
        // starts blooming — otherwise the two read as one object briefly.
        const k = easeOutCubic(progress);
        let targetX = 0;
        let targetY = 0;
        let targetScale = 0.04;

        if (you) {
          const point = orbitAt(you.seed, elapsed, globeRadius);
          targetX = point.x;
          targetY = point.y;
          targetScale = (you.size * point.scale) / orbSize;
        }

        node.style.transform =
          `translate3d(${lerp(0, targetX, k)}px, ${lerp(0, targetY, k)}px, 0) ` +
          `scale(${lerp(1, targetScale, k)})`;
        node.style.opacity = `${1 - clamp01((progress - 0.72) / 0.28)}`;
        return;
      }

      node.style.opacity = "0";
    };

    const renderStars = (
      step: ScriptStep,
      progress: number,
      elapsed: number,
      globeRadius: number,
    ) => {
      // `complete` never reaches here — the loop stops the moment we enter it,
      // and the cluster is dissolved with a CSS fade instead.
      const gather = step.phase === "converge" ? easeInOutSine(progress) : 0;

      for (const star of starsRef.current) {
        const node = starNodes.current.get(star.key);
        if (!node) continue;

        const age = elapsed - star.bornAt;
        if (age <= 0) {
          node.style.opacity = "0";
          continue;
        }

        const appear = easeOutCubic(clamp01(age / STAR_APPEAR_SECONDS));
        const point = orbitAt(star.seed, elapsed, globeRadius);

        const x = lerp(point.x, 0, gather);
        const y = lerp(point.y, 0, gather);
        const scale = lerp(point.scale * (0.35 + 0.65 * appear), 0.9, gather);
        // Everyone brightens as they come home.
        const opacity = lerp(point.opacity * appear, 1, gather);

        node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        node.style.opacity = `${opacity}`;

        const z = point.depth >= 0 || gather > 0.15 ? "30" : "5";
        if (z !== star.lastZ) {
          node.style.zIndex = z;
          star.lastZ = z;
        }
      }
    };

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (statusRef.current !== "running") return;

      const current = sessionRef.current;
      if (!current) return;
      const { script, stepStartTimes, stepGlobeFrom, total } = current;

      const now = performance.now();
      const elapsed = Math.max(0, (now - startTimeRef.current) / 1000);

      // Which beat are we on? Walk through every step we have passed rather
      // than jumping straight to the current one — a backgrounded tab starves
      // rAF, and skipping beats would silently drop the people who joined
      // during them.
      let index = Math.max(0, stepIndexRef.current);
      while (
        index + 1 < script.length &&
        elapsed >= stepStartTimes[index + 1]
      ) {
        index++;
      }

      while (stepIndexRef.current < index) {
        const next = stepIndexRef.current + 1;
        stepIndexRef.current = next;
        enterStep(script[next], next);
      }

      const step = script[index];
      const local = elapsed - stepStartTimes[index];
      const progress = Number.isFinite(step.duration)
        ? clamp01(local / step.duration)
        : clamp01(local / 2);

      // --- globe -------------------------------------------------------------
      // Every beat starts where the last one ended, so the scale is continuous
      // across the whole session — no jumps at beat boundaries.
      const globeScale = lerp(
        stepGlobeFrom[index],
        step.globeTo,
        ease(step.ease ?? "inOut", progress),
      );
      if (globeWrapRef.current) {
        globeWrapRef.current.style.transform = `scale(${globeScale})`;
      }

      const globeRadius = stageSize * GLOBE_RADIUS_RATIO * globeScale;

      renderOrb(step, progress, elapsed, globeRadius);
      renderStars(step, progress, elapsed, globeRadius);

      // --- closing tally -----------------------------------------------------
      if (step.phase === "converge") {
        // Starts once the stars are visibly on their way in, and lands on the
        // full count before the beat ends.
        const counted = Math.round(total * clamp01((progress - 0.15) / 0.6));
        setTally((prev) => (prev === counted ? prev : counted));
      } else if (step.phase === "complete") {
        setTally((prev) => (prev === total ? prev : total));
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, stageSize, orbSize, enterStep]);

  // --- audio -----------------------------------------------------------------
  // Layer 1: the wind is there from the moment the page opens (browsers block
  // this until the first gesture; `breathAudio` retries then).
  useEffect(() => {
    breathAudio.setLayer("ambient", LAYER_VOLUMES.ambient, 4);
    return () => breathAudio.stopAll();
  }, []);

  // Layer 2: the space pad joins once the meditation itself starts.
  useEffect(() => {
    if (status === "running") {
      breathAudio.setLayer("space", LAYER_VOLUMES.space, 6);
    } else {
      breathAudio.setLayer("space", 0, 3);
    }
  }, [status]);

  // --- controls ---------------------------------------------------------------
  const handleStart = useCallback(() => {
    // Use the circle the idle screen already promised ("15 people are
    // breathing right now"), so the headcount doesn't change on the way in.
    // Restarts re-roll it — see handleReset / handleRestart.
    const next = sessionRef.current ?? buildSession(visitorCountry);
    sessionRef.current = next;
    setSession(next);

    starsRef.current = [];
    joinedRef.current = [];
    starNodes.current.clear();
    seedCounter.current = 0;
    stepIndexRef.current = -1;
    musicFadedRef.current = false;
    startTimeRef.current = performance.now();

    setStarViews([]);
    setSpotlight(new Set());
    setTally(0);
    setPhase(null);
    setDisplay({});
    setTextFade("in");
    setView(EMPTY_VIEW);
    setStatus("running");
  }, [visitorCountry]);

  const handleReset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (textTimerRef.current) clearTimeout(textTimerRef.current);

    starsRef.current = [];
    joinedRef.current = [];
    starNodes.current.clear();
    stepIndexRef.current = -1;
    musicFadedRef.current = false;

    setStarViews([]);
    setSpotlight(new Set());
    setTally(0);
    setPhase(null);
    setDisplay({});
    setView(EMPTY_VIEW);
    setStatus("idle");

    // Back on the idle screen a different group of people has "shown up".
    const next = buildSession(visitorCountry);
    sessionRef.current = next;
    setSession(next);

    // The wind carries on underneath; only the meditation layers stop.
    breathAudio.setLayer("ambient", LAYER_VOLUMES.ambient, 3);

    if (orbRef.current) orbRef.current.style.opacity = "0";
    if (globeWrapRef.current) {
      globeWrapRef.current.style.transform = `scale(${GLOBE_IDLE_SCALE})`;
    }
  }, [visitorCountry]);

  /** "Breathe again": a new circle, straight into the session. */
  const handleRestart = useCallback(() => {
    sessionRef.current = buildSession(visitorCountry);
    handleStart();
  }, [handleStart, visitorCountry]);

  // Park the globe at its idle size before (and after) a session.
  useEffect(() => {
    if (status !== "idle") return;
    if (globeWrapRef.current) {
      globeWrapRef.current.style.transform = `scale(${GLOBE_IDLE_SCALE})`;
    }
  }, [status, stageSize, globeReady]);

  useEffect(
    () => () => {
      if (textTimerRef.current) clearTimeout(textTimerRef.current);
    },
    [],
  );

  const onGlobeReady = useCallback(() => setGlobeReady(true), []);

  const fadeClass =
    textFade === "in"
      ? "opacity-100 translate-y-0 blur-none"
      : "opacity-0 -translate-y-2 blur-[3px]";

  const inSession = status === "running";
  const showTally = status === "complete";
  const canStart = globeReady && session !== null;

  const subtitle = useMemo(() => {
    const seconds = session?.sessionSeconds ?? 110;
    const minutes = Math.round((seconds / 60) * 2) / 2;
    return `A ${minutes}-minute group meditation where we breathe as one`;
  }, [session]);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden select-none">
      {/* ---- The stage: globe, orbiting stars, and the orb -------------------- */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: stageSize, height: stageSize }}
      >
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: globeReady ? 1 : 0, zIndex: 20 }}
        >
          <GlobeStage
            size={stageSize}
            view={view}
            onReady={onGlobeReady}
            wrapperRef={globeWrapRef}
          />
        </div>

        <OrbitStars
          stars={starViews}
          nodeRefs={starNodes}
          spotlightKeys={spotlight}
          fadeOut={phase === "complete"}
        />

        <div className="absolute inset-0" style={{ zIndex: 40 }}>
          <BreathOrb size={orbSize} orbRef={orbRef} />
        </div>
      </div>

      {/* ---- Wordmark (idle only — the session itself is just sky) -------- */}
      {status === "idle" && (
        <header className="absolute top-0 left-0 right-0 px-6 sm:px-10 py-5 flex items-center z-50 pointer-events-none">
          <span className="flex items-center gap-2 text-amber-300/90 text-sm font-display tracking-wide">
            <Globe2 className="w-4 h-4" />
            <span className="hidden sm:inline">Connected Breath</span>
          </span>
        </header>
      )}

      {/* ---- Guidance copy (fixed box, so nothing ever reflows) --------------- */}
      {inSession && !showTally && (
        <div className="absolute left-0 right-0 top-[7%] h-[16%] flex flex-col items-center justify-end text-center px-6 z-40 pointer-events-none">
          <div
            className={`flex flex-col items-center max-w-3xl transition-all duration-[900ms] ease-out transform ${fadeClass}`}
          >
            {display.eyebrow && (
              <p className="mb-3 text-[11px] sm:text-xs uppercase tracking-[0.42em] text-slate-400 font-display drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {display.eyebrow}
              </p>
            )}
            {display.text && (
              <h2 className="font-display text-2xl sm:text-3xl lg:text-5xl text-white font-semibold tracking-tight leading-snug drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
                {display.text}
              </h2>
            )}
            {phase === "converge" && tally > 0 ? (
              <p className="mt-3 text-xl sm:text-2xl font-display font-semibold tracking-tight">
                <span className="text-emerald-300 drop-shadow-[0_0_22px_rgba(52,211,153,0.55)] tabular-nums">
                  {tally}
                </span>{" "}
                <span className="text-slate-200 font-light">
                  {tally === 1 ? "person" : "people"}
                </span>
              </p>
            ) : (
              display.subText && (
                <p className="mt-2 text-base sm:text-lg text-cyan-200/90 font-light tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {display.subText}
                </p>
              )
            )}
          </div>
        </div>
      )}

      {/* ---- Idle / invitation screen ----------------------------------------- */}
      {status === "idle" && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute left-0 right-0 top-[9%] h-[17%] flex flex-col items-center justify-end text-center px-6">
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl text-white font-medium tracking-wide drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              Connected Breath
              <span className="text-amber-300">.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm sm:text-base text-slate-300 font-display font-light leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {subtitle}
            </p>
          </div>

          <div className="absolute left-0 right-0 bottom-[9%] flex flex-col items-center gap-4 px-6 pointer-events-auto">
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="px-10 py-3.5 rounded-xl bg-[#a85832] hover:bg-[#ba6339] active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-white font-display font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all shadow-[0_6px_30px_rgba(168,88,50,0.55)] border border-amber-400/30"
            >
              {canStart ? "Start web experience" : "Preparing the world…"}
            </button>
            <div className="min-h-[30px] flex items-center">
              {session && (
                <LiveCount key={session.cohortSize} base={session.cohortSize} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- Closing tally ------------------------------------------------------ */}
      {showTally && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="flex flex-col items-center animate-fade-up">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-semibold tracking-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
              You just shared breath with…
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight">
              <span className="text-emerald-300 drop-shadow-[0_0_28px_rgba(52,211,153,0.6)]">
                {tally}
              </span>{" "}
              <span className="text-white">
                {tally === 1 ? "person" : "people"}
              </span>
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#a85832] hover:bg-[#ba6339] text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Breathe again</span>
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white text-xs font-display font-medium tracking-wide transition-all shadow-md"
              >
                Back to the globe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
