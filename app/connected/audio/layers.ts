/**
 * Audio sources for the three layers of the session. Files live in
 * `/public/audios`; the paths are URI-encoded because two of the names carry
 * spaces.
 */
const audio = (file: string) => encodeURI(`/audios/${file}`);

export const AUDIO_SOURCES = {
  /** Layer 1 — the bed. Runs from the idle screen onwards, never stops. */
  ambient: audio("meditation Session 1_mixdown.mp3"),
  /** Layer 2 — joins on top of the bed once the meditation starts. */
  space: audio("Meditation Session 2_mixdown.mp3"),
  /** Layer 3a — one-shot, rises with each inhale. */
  inhale: audio("inhale.mp3"),
  /** Layer 3b — one-shot, falls with each exhale. */
  exhale: audio("exhale.mp3"),
} as const;

export type AudioLayerId = keyof typeof AUDIO_SOURCES;

/**
 * Resting volume of each layer. The two mixdowns sit lower than the breath
 * cues so a cue always reads over the bed rather than under it — tune here if
 * either mix comes in hotter than expected.
 */
export const LAYER_VOLUMES: Record<AudioLayerId, number> = {
  ambient: 0.32,
  space: 0.4,
  inhale: 0.55,
  exhale: 0.55,
};
