import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  EyeOff,
  Wind,
  Volume2,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Pause,
  Layers,
  Palette,
  Info,
  Navigation,
  Activity,
  Compass,
} from 'lucide-react';
import { COSMIC_THEMES } from '../game/themes';
import { CelestialStats, CosmicThemeId, UniverseConfig } from '../types';
import { AudioPlayerHUD } from './AudioPlayerHUD';

interface MeditationControlsProps {
  config: UniverseConfig;
  stats: CelestialStats;
  onChange: (updates: Partial<UniverseConfig>) => void;
  onTriggerRipple: () => void;
}

export const MeditationControls: React.FC<MeditationControlsProps> = ({
  config,
  stats,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'speed' | 'objects' | 'audio' | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const themeList = Object.values(COSMIC_THEMES);

  return (
    <>
      {/* Center Meditation Contemplation (Subtle and non-intrusive) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center max-w-sm px-6 opacity-30 hover:opacity-80 transition-opacity duration-700">
        <p className="font-serif italic text-base md:text-lg text-slate-200 font-light tracking-wide leading-relaxed">
          "The cosmos is within us. We are made of star-stuff. We are a way for the cosmos to know itself."
        </p>
        <div className="h-[1px] w-8 bg-white/20 mx-auto my-3" />
        <span className="text-[9px] tracking-[0.3em] uppercase text-slate-400 font-mono">
          Carl Sagan • Deep Drift
        </span>
      </div>

      {/* Top Center Telemetry & Traversal Status */}
      <div
        id="top-telemetry-bar"
        className="fixed top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 md:gap-5 bg-[#020205]/75 backdrop-blur-2xl border border-white/10 px-4 md:px-5 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-xs text-slate-300"
      >
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="font-medium text-white tracking-wide">{stats.currentSector}</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3 bg-white/15" />

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-500">Traversed:</span>
          <span className="text-cyan-300 font-medium">{stats.lightYearsTraveled} LY</span>
        </div>

        <div className="hidden md:block w-[1px] h-3 bg-white/15" />

        <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-500">Velocity:</span>
          <span className="text-purple-300 font-medium">{stats.speedKmS.toLocaleString()} km/s</span>
        </div>

        <div className="hidden sm:block w-[1px] h-3 bg-white/15" />

        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          title="Cosmic Navigation Guide"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Info Guide Card */}
      {showInfo && (
        <div
          id="cosmic-info-card"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-80 md:w-96 bg-[#020205]/90 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-xs text-slate-300 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Meditation Cosmos Navigation
            </span>
            <button
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-400 leading-relaxed font-light">
            Designed as an infinite, calm cosmic canvas for relaxation, deep focus, and breathing meditation.
          </p>

          <div className="space-y-2 pt-1 font-light">
            <div className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-mono">✦</span>
              <div>
                <strong className="text-slate-200 font-medium">Scroll Up / Down:</strong> Smoothly accelerate or glide through the celestial starfield.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-purple-400 font-mono">✦</span>
              <div>
                <strong className="text-slate-200 font-medium">Mouse Movement:</strong> Multi-layer 3D parallax tilt & neon orb glow amplification.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-emerald-400 font-mono">✦</span>
              <div>
                <strong className="text-slate-200 font-medium">Click Anywhere:</strong> Trigger radiant starlight ripple waves with harmonic chimes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Control Center */}
      <div
        id="bottom-floating-dock"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 pointer-events-auto"
      >
        {/* Expanded Floating Popover Panels */}
        {activeTab === 'themes' && (
          <div className="bg-[#020205]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-white w-80 space-y-3 mb-1 animate-fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Cosmic Color Harmonies
              </span>
              <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themeList.map(th => {
                const isSelected = config.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onChange({ theme: th.id as CosmicThemeId })}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all border ${
                      isSelected
                        ? 'bg-white/15 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                      style={{ backgroundColor: th.accentColor }}
                    />
                    <span className="truncate">{th.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'speed' && (
          <div className="bg-[#020205]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-white w-72 space-y-4 mb-1">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Drift & Velocity Dynamics
              </span>
              <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            {/* Direction Selection */}
            <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => onChange({ driftDirection: 'up' })}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all ${
                  config.driftDirection === 'up'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5" /> Ascend
              </button>
              <button
                onClick={() => onChange({ driftDirection: 'still' })}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all ${
                  config.driftDirection === 'still'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Pause className="w-3 h-3" /> Still
              </button>
              <button
                onClick={() => onChange({ driftDirection: 'down' })}
                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs transition-all ${
                  config.driftDirection === 'down'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5" /> Descend
              </button>
            </div>

            {/* Ambient Speed */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Ambient Drift Speed</span>
                <span className="font-mono text-cyan-300 font-medium">{config.driftSpeed} px/s</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={config.driftSpeed}
                onChange={e => onChange({ driftSpeed: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0 px/s</span>
                <span>80 px/s (Default)</span>
                <span>200 px/s</span>
              </div>

              {/* Quick Velocity Presets */}
              <div className="grid grid-cols-4 gap-1 mt-2.5">
                {[
                  { label: '30', speed: 30, desc: 'Calm' },
                  { label: '80', speed: 80, desc: 'Default' },
                  { label: '140', speed: 140, desc: 'Brisk' },
                  { label: '200', speed: 200, desc: 'Warp' },
                ].map(preset => (
                  <button
                    key={preset.speed}
                    onClick={() => onChange({ driftSpeed: preset.speed })}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-mono transition-all border ${
                      config.driftSpeed === preset.speed
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="block font-semibold">{preset.label}</span>
                    <span className="block text-[9px] text-slate-500 font-sans">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mouse Parallax sensitivity */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Mouse 3D Parallax Depth</span>
                <span className="font-mono text-slate-200">{Math.round(config.mouseInfluence * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.0"
                step="0.1"
                value={config.mouseInfluence}
                onChange={e => onChange({ mouseInfluence: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        )}

        {activeTab === 'objects' && (
          <div className="bg-[#020205]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-white w-72 space-y-3 mb-1">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Celestial Objects
              </span>
              <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Glowing Neon Orbs</span>
                <input
                  type="checkbox"
                  checked={config.density.glowingOrbs > 0}
                  onChange={e =>
                    onChange({
                      density: {
                        ...config.density,
                        glowingOrbs: e.target.checked ? 1.0 : 0,
                      },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Spiral Galaxies</span>
                <input
                  type="checkbox"
                  checked={config.density.galaxies}
                  onChange={e =>
                    onChange({
                      density: { ...config.density, galaxies: e.target.checked },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Ringed Planets & Moons</span>
                <input
                  type="checkbox"
                  checked={config.density.planets}
                  onChange={e =>
                    onChange({
                      density: { ...config.density, planets: e.target.checked },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Constellation Lines</span>
                <input
                  type="checkbox"
                  checked={config.density.constellations}
                  onChange={e =>
                    onChange({
                      density: { ...config.density, constellations: e.target.checked },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Shooting Stars & Comets</span>
                <input
                  type="checkbox"
                  checked={config.density.shootingStars}
                  onChange={e =>
                    onChange({
                      density: { ...config.density, shootingStars: e.target.checked },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
                <span>Nebula Cosmic Veils</span>
                <input
                  type="checkbox"
                  checked={config.density.nebulae}
                  onChange={e =>
                    onChange({
                      density: { ...config.density, nebulae: e.target.checked },
                    })
                  }
                  className="rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            {/* Starfield Density Slider */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Starfield Density</span>
                <span className="font-mono text-slate-200">{Math.round(config.density.stars * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={config.density.stars}
                onChange={e =>
                  onChange({
                    density: { ...config.density, stars: parseFloat(e.target.value) },
                  })
                }
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Orb Glow Intensity */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span>Orb Glow Intensity</span>
                <span className="font-mono text-slate-200">{Math.round(config.orbGlowIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={config.orbGlowIntensity}
                onChange={e => onChange({ orbGlowIntensity: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="mb-1">
            <AudioPlayerHUD config={config} onChange={onChange} />
          </div>
        )}

        {/* Primary Floating Toolbar Dock */}
        <div className="flex items-center gap-1.5 md:gap-2 bg-[#020205]/80 backdrop-blur-2xl border border-white/10 p-1.5 md:p-2 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          {/* Themes Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'themes' ? null : 'themes')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'themes'
                ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Cosmic Themes"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Speed & Drift Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'speed' ? null : 'speed')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'speed'
                ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Motion & Drift Controls"
          >
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Drift</span>
          </button>

          {/* Objects & Density Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'objects' ? null : 'objects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'objects'
                ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Celestial Objects Filter"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Objects</span>
          </button>

          <div className="w-[1px] h-4 bg-white/15 my-auto" />

          {/* Breathing Guide Button */}
          <button
            onClick={() => onChange({ breathingGuide: !config.breathingGuide })}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              config.breathingGuide
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Breathing Meditation Guide"
          >
            <Wind className="w-4 h-4 text-cyan-300" />
            <span className="hidden md:inline">Breathe</span>
          </button>

          {/* Audio Synthesizer Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'audio' ? null : 'audio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              config.soundEnabled
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(191,0,255,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="Cosmic Soundscape"
          >
            <Volume2 className="w-4 h-4 text-purple-300" />
            <span className="hidden md:inline">Sound</span>
          </button>

          <div className="w-[1px] h-4 bg-white/15 my-auto" />

          {/* Zen Mode Button (Hides HUD) */}
          <button
            onClick={() => onChange({ zenMode: true })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            title="Zen Mode (Hide UI for Pure View)"
          >
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline">Zen</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );
};
