import { AUDIO_SOURCES, AudioLayerId, LAYER_VOLUMES } from "./layers";

/**
 * Three-layer soundscape for Connected Breath.
 *
 *  1. `ambient` — wind / room tone, running from the idle screen onwards
 *  2. `space`   — a pad that fades in on top when the meditation starts
 *  3. `inhale` / `exhale` — one-shot drones cued on each breath
 *
 * Every layer is best-effort: a missing or blocked file is treated as silence,
 * so the session never depends on audio loading. That matters here because the
 * URLs in `layers.ts` ship as placeholders.
 */

const FADE_TICK_MS = 50;

interface Loop {
  el: HTMLAudioElement;
  target: number;
  timer: ReturnType<typeof setInterval> | null;
  wanted: boolean;
  failed: boolean;
}

class BreathAudio {
  private loops = new Map<AudioLayerId, Loop>();
  private oneShots = new Map<AudioLayerId, HTMLAudioElement>();
  private muted = false;
  /** Set once a user gesture has unblocked playback. */
  private unlocked = false;
  private unlockHandler: (() => void) | null = null;

  // ---------------------------------------------------------------- looping

  /** Fades a looping layer towards `volume` (0 pauses it once silent). */
  setLayer(id: AudioLayerId, volume: number, fadeSeconds = 2.5): void {
    if (typeof window === "undefined") return;

    const loop = this.ensureLoop(id);
    if (!loop || loop.failed) return;

    loop.wanted = volume > 0;
    loop.target = volume;

    if (loop.wanted) this.tryPlay(loop.el);
    this.fade(loop, fadeSeconds);
  }

  /** Plays a single breath drone. Overlapping cues are fine. */
  cue(id: AudioLayerId): void {
    if (typeof window === "undefined" || this.muted) return;

    let el = this.oneShots.get(id);
    if (!el) {
      el = new Audio(AUDIO_SOURCES[id]);
      el.preload = "auto";
      el.addEventListener("error", () => this.oneShots.delete(id));
      this.oneShots.set(id, el);
    }

    el.volume = LAYER_VOLUMES[id];
    try {
      el.currentTime = 0;
    } catch {
      // Not seekable yet; playing from wherever it is beats throwing.
    }
    this.tryPlay(el);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    for (const loop of this.loops.values()) {
      this.fade(loop, 0.6);
    }
  }

  /** Hard stop. Safe to call on unmount. */
  stopAll(): void {
    for (const loop of this.loops.values()) {
      if (loop.timer) clearInterval(loop.timer);
      loop.timer = null;
      loop.wanted = false;
      loop.target = 0;
      loop.el.pause();
      loop.el.volume = 0;
    }
    for (const el of this.oneShots.values()) el.pause();

    this.teardownUnlockListener();
  }

  // ---------------------------------------------------------------- internals

  private ensureLoop(id: AudioLayerId): Loop | null {
    const existing = this.loops.get(id);
    if (existing) return existing;

    const el = new Audio(AUDIO_SOURCES[id]);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;

    const loop: Loop = {
      el,
      target: 0,
      timer: null,
      wanted: false,
      failed: false,
    };

    // A placeholder URL 404s here. Mark the layer dead so we stop retrying.
    el.addEventListener("error", () => {
      loop.failed = true;
      if (loop.timer) clearInterval(loop.timer);
      loop.timer = null;
    });

    this.loops.set(id, loop);
    return loop;
  }

  private fade(loop: Loop, seconds: number): void {
    if (loop.timer) clearInterval(loop.timer);

    const target = this.muted ? 0 : loop.target;
    const steps = Math.max(1, Math.round((seconds * 1000) / FADE_TICK_MS));
    const stepSize = (target - loop.el.volume) / steps;

    loop.timer = setInterval(() => {
      const next = loop.el.volume + stepSize;
      const done =
        stepSize === 0 ||
        (stepSize > 0 ? next >= target : next <= target) ||
        loop.failed;

      loop.el.volume = clampVolume(done ? target : next);

      if (done) {
        if (loop.timer) clearInterval(loop.timer);
        loop.timer = null;
        // Only actually stop when nobody wants this layer any more — a mute is
        // temporary and should leave the loop running silently underneath.
        if (target === 0 && !loop.wanted) loop.el.pause();
      }
    }, FADE_TICK_MS);
  }

  /**
   * Attempts playback, and if the browser's autoplay policy refuses, retries
   * once on the next user gesture.
   */
  private tryPlay(el: HTMLAudioElement): void {
    const promise = el.play();
    if (!promise) return;

    promise.then(
      () => {
        this.unlocked = true;
      },
      () => {
        if (!this.unlocked) this.waitForGesture();
      },
    );
  }

  private waitForGesture(): void {
    if (this.unlockHandler || typeof window === "undefined") return;

    const handler = () => {
      this.unlocked = true;
      this.teardownUnlockListener();
      for (const loop of this.loops.values()) {
        if (loop.wanted && !loop.failed) void loop.el.play().catch(() => {});
      }
    };

    this.unlockHandler = handler;
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
  }

  private teardownUnlockListener(): void {
    if (!this.unlockHandler || typeof window === "undefined") return;
    window.removeEventListener("pointerdown", this.unlockHandler);
    window.removeEventListener("keydown", this.unlockHandler);
    this.unlockHandler = null;
  }
}

function clampVolume(v: number): number {
  if (Number.isNaN(v)) return 0;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export const breathAudio = new BreathAudio();
