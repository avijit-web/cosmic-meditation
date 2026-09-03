import { Participant, ScriptStep } from "../types";
import { joinExhaleLine, joinHeadline } from "./participants";

/**
 * Globe scale keyframes. 1.0 is the top of a full inhale.
 *
 * The globe never jumps between beats: a step only declares where it *ends*,
 * and the runner interpolates from wherever the previous beat left off.
 */
export const GLOBE_STAR = 0.014; // pretending to be a distant star
export const GLOBE_REST = 0.76;
export const GLOBE_INHALE_PEAK = 0.94;
export const GLOBE_EXHALE_TROUGH = 0.6;

const INHALE_SECONDS = 4.4;
const EXHALE_SECONDS = 5.4;
/** Announcement breaths run a little longer — there is more to read. */
const JOIN_INHALE_SECONDS = 5.2;
const JOIN_EXHALE_SECONDS = 5.8;

function inhale(n: number): ScriptStep {
  return {
    id: `inhale-${n}`,
    phase: "inhale",
    duration: INHALE_SECONDS,
    text: "Breathe in",
    globeTo: GLOBE_INHALE_PEAK,
    ease: "inOut",
    breathCue: "inhale",
  };
}

function exhale(n: number): ScriptStep {
  return {
    id: `exhale-${n}`,
    phase: "exhale",
    duration: EXHALE_SECONDS,
    text: "Let it go",
    globeTo: GLOBE_EXHALE_TROUGH,
    ease: "inOut",
    breathCue: "exhale",
  };
}

/**
 * An arrival, told across a whole breath.
 *
 * The announcement lands on the inhale and the following exhale acknowledges it
 * ("now you both let it go"), so a new person joining never interrupts the
 * rhythm — they just fold into it.
 */
function arrival(p: Participant): ScriptStep[] {
  return [
    {
      id: `join-in-${p.id}`,
      phase: "inhale",
      duration: JOIN_INHALE_SECONDS,
      text: joinHeadline(p),
      focusMode: "participant",
      participantId: p.id,
      introduces: "participant",
      globeTo: GLOBE_INHALE_PEAK,
      ease: "inOut",
      breathCue: "inhale",
    },
    {
      id: `join-out-${p.id}`,
      phase: "exhale",
      duration: JOIN_EXHALE_SECONDS,
      text: joinExhaleLine(p),
      // Hold the highlight through the exhale, then let it go with the breath.
      focusMode: "participant",
      participantId: p.id,
      globeTo: GLOBE_EXHALE_TROUGH,
      ease: "inOut",
      breathCue: "exhale",
    },
  ];
}

/**
 * The whole session, beat by beat, for a given circle.
 *
 * `cohortSize` is everyone already here when you arrive (you included);
 * `arrivals` are the people who turn up mid-session, one per breath.
 */
export function buildScript(
  cohortSize: number,
  arrivals: Participant[],
): ScriptStep[] {
  const [first, second] = arrivals;

  return [
    {
      id: "welcome",
      phase: "welcome",
      duration: 4.2,
      text: "Welcome to Connected Breath",
      globeTo: GLOBE_STAR,
    },
    {
      id: "connecting",
      phase: "connecting",
      duration: 4.8,
      eyebrow: "Connecting.",
      text: "Let's join the group meditation",
      globeTo: GLOBE_STAR,
    },
    {
      // The hand-off: the orb collapses into a star, the star blooms into a world.
      id: "reveal",
      phase: "reveal",
      duration: 3.8,
      focusMode: "self",
      introduces: "self",
      globeTo: GLOBE_REST,
      // Hold small at first so the orb finishes collapsing before the world opens.
      ease: "in",
    },
    {
      id: "you",
      phase: "you",
      duration: 4.6,
      text: "This is you",
      focusMode: "self",
      globeTo: GLOBE_REST,
    },
    {
      // Everyone already here, revealed together: all countries pinned, all
      // stars lit, globe turning so you can see the whole circle.
      id: "everyone",
      phase: "everyone",
      duration: 7.4,
      text: `You're breathing with ${cohortSize} people around the world`,
      focusMode: "all",
      introduces: "cohort",
      globeTo: GLOBE_REST,
    },
    {
      id: "settle",
      phase: "settle",
      duration: 5.0,
      text: "Settle in. Let's breathe together.",
      globeTo: GLOBE_EXHALE_TROUGH,
      ease: "inOut",
    },

    inhale(1),
    exhale(1),
    inhale(2),
    exhale(2),

    ...(first ? arrival(first) : [inhale(6), exhale(6)]),

    inhale(3),
    exhale(3),

    ...(second ? arrival(second) : [inhale(7), exhale(7)]),

    inhale(4),
    exhale(4),
    inhale(5),
    exhale(5),

    {
      id: "together",
      phase: "together",
      duration: 6.2,
      text: "We are all breathing together",
      // One last look at the full circle before it folds up.
      focusMode: "all",
      globeTo: GLOBE_REST,
      ease: "inOut",
    },
    {
      id: "converge",
      phase: "converge",
      duration: 7.0,
      text: "Bringing everyone home",
      globeTo: GLOBE_STAR,
      ease: "in",
    },
    {
      id: "complete",
      phase: "complete",
      duration: Infinity,
      globeTo: GLOBE_STAR,
    },
  ];
}
