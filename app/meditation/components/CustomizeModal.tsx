import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  Music,
  Palette,
  Sliders,
  Layers,
  ChevronUp,
  ChevronDown,
  Pause,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  CosmicThemeId,
  MeditationDuration,
  MeditationTypeId,
  MusicTrackId,
  UniverseConfig,
} from '../types';
import { MEDITATION_TYPES } from '../data/meditationScripts';
import { MUSIC_TRACKS, MUSIC_TRACK_LIST } from '../audio/musicTracks';
import { COSMIC_THEMES } from '../game/themes';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UniverseConfig;
  onChange: (updates: Partial<UniverseConfig>) => void;
}

type TabType = 'meditation' | 'theme' | 'drift' | 'objects';

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('meditation');

  if (!isOpen) return null;

  const currentMeditationType = MEDITATION_TYPES[config.meditationType];
  const themeList = Object.values(COSMIC_THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Dark Ambient Backdrop with Backdrop Blur */}
      <div
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container (Styled cleanly like the screenshots) */}
      <div className="relative w-full max-w-xl bg-[#090a0f] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden text-slate-200 z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-cinzel text-lg md:text-xl font-semibold tracking-wider text-white">
            Customize Your Meditation
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Meditation, Theme, Drift, Objects) */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('meditation')}
            className={`pb-2.5 px-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'meditation'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Meditation</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`pb-2.5 px-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'theme'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>
          <button
            onClick={() => setActiveTab('drift')}
            className={`pb-2.5 px-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'drift'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Drift</span>
          </button>
          <button
            onClick={() => setActiveTab('objects')}
            className={`pb-2.5 px-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'objects'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Objects</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'meditation' && (
            <>
              {/* 1. LENGTH SECTION */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Length</span>
                </div>
                <div className="inline-flex p-1 bg-white/5 rounded-full border border-white/5 gap-1">
                  <button
                    onClick={() => onChange({ meditationDuration: 60 })}
                    className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      config.meditationDuration === 60
                        ? 'bg-white/20 text-white shadow-sm border border-white/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1 min
                  </button>
                  <button
                    onClick={() => onChange({ meditationDuration: 120 })}
                    className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      config.meditationDuration === 120
                        ? 'bg-white/20 text-white shadow-sm border border-white/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2 min
                  </button>
                </div>
              </div>

              {/* 2. MEDITATION TYPE SECTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Meditation Type</span>
                </div>

                {/* 2 Type Pill Options */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onChange({ meditationType: 'observer' })}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      config.meditationType === 'observer'
                        ? 'bg-white/20 text-white border-white/40 shadow-sm'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Observer
                  </button>
                  <button
                    onClick={() => onChange({ meditationType: 'cosmic' })}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      config.meditationType === 'cosmic'
                        ? 'bg-white/20 text-white border-white/40 shadow-sm'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Cosmic
                  </button>
                </div>

                {/* Thoughtful Description Box matching the screenshot */}
                {currentMeditationType && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-300/90 leading-relaxed font-light">
                    <p>{currentMeditationType.description}</p>
                  </div>
                )}
              </div>

              {/* 3. MUSIC SECTION */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400">
                    <Music className="w-3.5 h-3.5 text-slate-500" />
                    <span>Music</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Customizable Test MP3</span>
                </div>

                {/* 2 Music Track Pills */}
                <div className="flex flex-wrap gap-2">
                  {MUSIC_TRACK_LIST.map(track => {
                    const isSelected = config.selectedMusicTrack === track.id;
                    return (
                      <button
                        key={track.id}
                        onClick={() => onChange({ selectedMusicTrack: track.id as MusicTrackId })}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          isSelected
                            ? 'bg-white/20 text-white border-white/40 shadow-sm'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {track.name}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Track Description & MP3 Info */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 flex items-start gap-2.5">
                  <Volume2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <div className="text-slate-200 font-medium">
                      {MUSIC_TRACKS[config.selectedMusicTrack]?.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {MUSIC_TRACKS[config.selectedMusicTrack]?.description}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Cosmic Color Harmonies
                </h3>
                <p className="text-xs text-slate-400">
                  Select a serene celestial color palette for the universe background and nebulae.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {themeList.map(th => {
                  const isSelected = config.theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => onChange({ theme: th.id as CosmicThemeId })}
                      className={`flex items-center gap-3 p-3 rounded-xl text-xs transition-all border text-left ${
                        isSelected
                          ? 'bg-white/15 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-white'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: th.accentColor }}
                      />
                      <div className="truncate">
                        <div className="font-medium text-slate-200">{th.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{th.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'drift' && (
            <div className="space-y-5">
              {/* Drift Direction */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Drift Direction
                </label>
                <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => onChange({ driftDirection: 'up' })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${
                      config.driftDirection === 'up'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ChevronUp className="w-3.5 h-3.5" /> Ascend
                  </button>
                  <button
                    onClick={() => onChange({ driftDirection: 'still' })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${
                      config.driftDirection === 'still'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Pause className="w-3 h-3" /> Still
                  </button>
                  <button
                    onClick={() => onChange({ driftDirection: 'down' })}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all ${
                      config.driftDirection === 'down'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" /> Descend
                  </button>
                </div>
              </div>

              {/* Ambient Speed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Ambient Drift Speed</span>
                  <span className="font-mono text-cyan-300 font-medium">{config.driftSpeed} px/s</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  step="5"
                  value={Math.max(80, Math.min(200, config.driftSpeed))}
                  onChange={e => onChange({ driftSpeed: parseInt(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>80 px/s (Start / Default)</span>
                  <span>200 px/s (Max)</span>
                </div>

                {/* Quick Velocity Presets */}
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {[
                    { label: '80', speed: 80, desc: 'Default' },
                    { label: '120', speed: 120, desc: 'Cruise' },
                    { label: '160', speed: 160, desc: 'Brisk' },
                    { label: '200', speed: 200, desc: 'Warp' },
                  ].map(preset => (
                    <button
                      key={preset.speed}
                      onClick={() => onChange({ driftSpeed: preset.speed })}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-mono transition-all border ${
                        config.driftSpeed === preset.speed
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="block font-semibold">{preset.label} px/s</span>
                      <span className="block text-[9px] text-slate-500 font-sans">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mouse 3D Parallax */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
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
            <div className="space-y-4">
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
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

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
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

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
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

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
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

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
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
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/5 bg-white/[0.01]">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
