"use client";
import React, { useState, useCallback } from "react";
import { CosmicCanvas } from "./components/CosmicCanvas";
import { ThoughtMeditationGame } from "./components/ThoughtMeditationGame";
import { CustomizeModal } from "./components/CustomizeModal";
import { CelestialStats, UniverseConfig } from "./types";

export default function Page() {
  const [config, setConfig] = useState<UniverseConfig>({
    driftSpeed: 80,
    driftDirection: "up",
    theme: "deep_indigo",
    density: {
      stars: 1.0,
      glowingOrbs: 0,
      nebulae: false,
      galaxies: true,
      planets: false,
      shootingStars: true,
      constellations: false,
    },
    mouseInfluence: 0.8,
    orbGlowIntensity: 0.5,
    soundEnabled: true,
    soundVolume: 0.4,
    soundPreset: "celestial_shimmer",
    breathingGuide: false,
    breathingPace: "calm_4_7_8",
    zenMode: false,

    // Custom Meditation Game Settings
    meditationDuration: 60,
    meditationType: "observer",
    selectedMusicTrack: "stardust",
  });

  const [stats, setStats] = useState<CelestialStats>({
    lightYearsTraveled: 0,
    speedKmS: 99200,
    starsEncountered: 380,
    orbsDiscovered: 42,
    currentSector: "Andromeda Rift",
  });

  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  const handleConfigChange = useCallback((updates: Partial<UniverseConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleStatsUpdate = useCallback((newStats: CelestialStats) => {
    setStats(newStats);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#010206] text-slate-100 font-sans">
      {/* 1. Underlying Dynamic Cosmic Starfield & Celestial Canvas */}
      <CosmicCanvas config={config} onStatsUpdate={handleStatsUpdate} />

      {/* 2. Pixel Thoughts Style Meditation Game UI */}
      <ThoughtMeditationGame
        config={config}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onConfigChange={handleConfigChange}
      />

      {/* 3. Customize Your Meditation Modal (Length, Type, Music, Theme, Drift, Objects) */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onChange={handleConfigChange}
      />
    </main>
  );
}
