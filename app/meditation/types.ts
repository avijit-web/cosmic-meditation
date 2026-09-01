export type CosmicThemeId = 'aurora' | 'deep_indigo' | 'nebula_rose' | 'bioluminescent' | 'solar_fire' | 'monochrome';

export interface CosmicTheme {
  id: CosmicThemeId;
  name: string;
  description: string;
  bgGradient: [string, string, string]; // Top, Middle, Bottom
  orbColors: number[];
  nebulaColors: number[];
  starColors: number[];
  accentColor: string;
  glowHex: string;
}

export type DriftDirection = 'up' | 'down' | 'still';

export type MeditationDuration = 60 | 120; // 60s (1 min) or 120s (2 min)
export type MeditationTypeId = 'observer' | 'cosmic';
export type MusicTrackId = 'stardust' | 'deep_space';

export interface MeditationScriptStep {
  atSecond: number; // When this prompt should start showing (seconds elapsed)
  text: string;     // Guided prompt line (e.g., "Take a deep breath in....")
  subText?: string;
  breathPhase?: 'inhale' | 'exhale' | 'hold' | 'reflect';
  orbScale: number; // 1.0 (start) down to 0.0 (end)
  orbAlpha: number; // 1.0 down to 0.0
}

export interface MeditationScript {
  typeId: MeditationTypeId;
  duration: MeditationDuration;
  title: string;
  steps: MeditationScriptStep[];
}

export interface MusicTrack {
  id: MusicTrackId;
  name: string;
  description: string;
  mp3Url: string; // Test MP3 source URL (can be customized by user)
  synthPreset: 'theta_waves' | 'celestial_shimmer' | 'deep_drone' | 'pink_cosmos';
}

export interface UniverseConfig {
  driftSpeed: number; // base ambient speed (pixels per second)
  driftDirection: DriftDirection;
  theme: CosmicThemeId;
  density: {
    stars: number;       // multiplier 0.2 - 2.0
    glowingOrbs: number; // multiplier 0.5 - 2.0
    nebulae: boolean;
    galaxies: boolean;
    planets: boolean;
    shootingStars: boolean;
    constellations: boolean;
  };
  mouseInfluence: number; // 0.0 - 2.0
  orbGlowIntensity: number; // 0.5 - 2.0
  soundEnabled: boolean;
  soundVolume: number;
  soundPreset: 'deep_drone' | 'theta_waves' | 'celestial_shimmer' | 'pink_cosmos';
  breathingGuide: boolean;
  breathingPace: 'calm_4_7_8' | 'box_4_4_4_4' | 'gentle_5_5';
  zenMode: boolean;
  
  // Custom Meditation Game Settings
  meditationDuration: MeditationDuration;
  meditationType: MeditationTypeId;
  selectedMusicTrack: MusicTrackId;
}

export interface CelestialStats {
  lightYearsTraveled: number;
  speedKmS: number;
  starsEncountered: number;
  orbsDiscovered: number;
  currentSector: string;
}

