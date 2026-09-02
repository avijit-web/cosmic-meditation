/**
 * Audio sources for the three layers of the session.
 *
 * ⚠️ PLACEHOLDERS — replace the URLs below with your own files.
 *
 * Heads up: Pexels only hosts photos and video, not audio, so these URLs will
 * 404. That is deliberate and harmless — `breathAudio` treats a failed layer as
 * silence and the session runs exactly the same without it. Drop local files in
 * `/public` (e.g. "/ambient-wind.mp3") or point these at your own CDN.
 *
 * Free audio that does work out of the box: Pixabay, Freesound, or the two
 * ambient tracks already sitting in `/public` from the single-player route.
 */
export const AUDIO_SOURCES = {
  /** Layer 1 — soft wind / room tone. Runs from the idle screen onwards. */
  ambient: "https://www.pexels.com/download/audio/ambient-wind-loop.mp3",
  /** Layer 2 — space pad. Fades in on top once the meditation starts. */
  space: "https://www.pexels.com/download/audio/deep-space-ambient-pad.mp3",
  /** Layer 3a — a one-shot drone that rises with each inhale. */
  inhale: "https://www.pexels.com/download/audio/breath-in-drone.mp3",
  /** Layer 3b — a one-shot drone that falls with each exhale. */
  exhale: "https://www.pexels.com/download/audio/breath-out-drone.mp3",
} as const;

export type AudioLayerId = keyof typeof AUDIO_SOURCES;

/** Resting volume of each layer, before the master mute is applied. */
export const LAYER_VOLUMES: Record<AudioLayerId, number> = {
  ambient: 0.3,
  space: 0.42,
  inhale: 0.5,
  exhale: 0.5,
};
