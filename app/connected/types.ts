/**
 * Connected Breath — a globe-based *group* meditation experience.
 *
 * This route is intentionally driven by STATIC data (see ./data/participants.ts).
 * Nothing here talks to a server yet — the whole session is a deterministic,
 * time-based script so the choreography can be tuned visually before any
 * realtime/multiplayer layer is introduced.
 */

/** A single beat of the guided session. */
export type BreathPhase =
  | "intro" // globe idling with its halo, waiting for the user to begin
  | "welcome" // big orb, greeting
  | "connecting" // big orb, "joining the group"
  | "reveal" // orb collapses into a star while the globe blooms open
  | "you" // your star + your country are highlighted
  | "everyone" // the whole circle is shown at once, globe turning
  | "settle" // "settle in, let's take N slow breaths"
  | "inhale" // globe swells
  | "exhale" // globe relaxes
  | "together" // everyone breathing as one
  | "converge" // globe folds back to a star, everyone gathers at the centre
  | "complete"; // the tally

/**
 * What the globe should be pointing at and lighting up on a given beat.
 *
 * - `none`        no markers, the globe just turns on its own
 * - `self`        your country and your star
 * - `all`         every country in the circle so far, all stars lit, globe turning
 * - `participant` one country and one group of stars
 */
export type FocusMode = "none" | "self" | "all" | "participant";

/** Whose stars a beat brings into the orbit. */
export type Introduces = "self" | "cohort" | "participant";

/** A group of people from one place. */
export interface Participant {
  /** Stable id, also used as the orbiting-star group key. */
  id: string;
  /** Human-facing country name, e.g. "United States". */
  label: string;
  /**
   * Name exactly as it appears in `world-atlas` countries-110m properties.name,
   * used to look up the polygon we highlight on the globe.
   */
  atlasName: string;
  lat: number;
  lng: number;
  /** How many people from this place are represented. */
  count: number;
  /** True for the local user's own star. */
  isYou?: boolean;
}

/** One entry of the session timeline. */
export interface ScriptStep {
  id: string;
  phase: BreathPhase;
  /** Seconds this beat occupies. The last step may be `Infinity`. */
  duration: number;

  /** Small all-caps line above the headline (e.g. "CONNECTING."). */
  eyebrow?: string;
  /** The headline. */
  text?: string;
  /** A quieter line under the headline. */
  subText?: string;

  /** What the globe points at and lights up. Defaults to `none`. */
  focusMode?: FocusMode;
  /** Participant this beat is about, for `focusMode: "participant"`. */
  participantId?: string;
  /** Whose stars join the orbit on this beat. */
  introduces?: Introduces;

  /**
   * Globe scale at the end of the beat (1 = the largest a full inhale reaches).
   * The start is always wherever the previous beat left off, so the globe never
   * jumps between beats.
   */
  globeTo: number;

  /** Easing used to interpolate the globe scale across the beat. */
  ease?: "linear" | "in" | "out" | "inOut";

  /** One-shot breath drone to cue at the top of the beat. */
  breathCue?: "inhale" | "exhale";
}

/** A country to light up, with the pill that rides on it. */
export interface CountryMarker {
  atlasName: string;
  lat: number;
  lng: number;
  label: string;
}
