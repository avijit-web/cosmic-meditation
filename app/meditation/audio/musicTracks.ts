import { MusicTrack, MusicTrackId } from "../types";

/**
 * 2 Background Music Options with customizable test MP3 sources.
 * You can replace the `mp3Url` fields below with your own MP3 file paths or hosted URLs!
 */
export const MUSIC_TRACKS: Record<MusicTrackId, MusicTrack> = {
  stardust: {
    id: "stardust",
    name: "Stardust",
    description: "Ethereal high-register ambient chimes & celestial shimmer",
    // High-quality test ambient MP3 URL (royalty-free space ambient soundscape)
    mp3Url: "/solarflex-space-ambient-569588.mp3",
    synthPreset: "celestial_shimmer",
  },
  deep_space: {
    id: "deep_space",
    name: "Deep Space",
    description: "Deep resonant theta-wave drones & infinite cosmic lull",
    // High-quality test ambient MP3 URL (royalty-free deep drone soundscape)
    mp3Url: "/delosound-space-ambient-351305.mp3",
    synthPreset: "theta_waves",
  },
};

export const MUSIC_TRACK_LIST: MusicTrack[] = Object.values(MUSIC_TRACKS);
