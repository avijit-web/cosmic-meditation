"use client";

import React, { useCallback, useMemo, useState } from "react";
import { CosmicCanvas } from "../meditation/components/CosmicCanvas";
import { ConnectedBreathGame } from "./components/ConnectedBreathGame";
import type { CelestialStats, UniverseConfig } from "../meditation/types";

/**
 * Connected Breath — the group meditation.
 *
 * Shares the Phaser starfield with the single-player route so both experiences
 * sit in the same universe; everything above it (globe, orbiting participants,
 * the guided script) lives in `./components`.
 */
export default function ConnectedBreathPage() {
  // Static: the starfield never changes on this route, so it never re-mounts.
  const config = useMemo<UniverseConfig>(
    () => ({
      driftSpeed: 40,
      driftDirection: "up",
      theme: "deep_indigo",
      density: {
        stars: 1.1,
        glowingOrbs: 0,
        nebulae: false,
        galaxies: true,
        planets: false,
        shootingStars: true,
        constellations: false,
      },
      mouseInfluence: 0.5,
      orbGlowIntensity: 0.5,
      soundEnabled: false,
      soundVolume: 0.3,
      soundPreset: "celestial_shimmer",
      breathingGuide: false,
      breathingPace: "calm_4_7_8",
      zenMode: true,
      meditationDuration: 60,
      meditationType: "observer",
      selectedMusicTrack: "deep_space",
    }),
    [],
  );

  const [, setStats] = useState<CelestialStats | null>(null);
  const handleStatsUpdate = useCallback(
    (next: CelestialStats) => setStats(next),
    [],
  );

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#010206] text-slate-100 font-sans">
      <CosmicCanvas config={config} onStatsUpdate={handleStatsUpdate} />
      <ConnectedBreathGame />
    </main>
  );
}
