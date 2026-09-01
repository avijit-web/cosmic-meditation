import React from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';
import { spaceSynth } from '../audio/spaceSynthesizer';
import { UniverseConfig } from '../types';

interface AudioPlayerHUDProps {
  config: UniverseConfig;
  onChange: (updates: Partial<UniverseConfig>) => void;
}

export const AudioPlayerHUD: React.FC<AudioPlayerHUDProps> = ({ config, onChange }) => {
  const toggleSound = () => {
    const nextState = !config.soundEnabled;
    onChange({ soundEnabled: nextState });

    if (nextState) {
      spaceSynth.start(config.soundPreset, config.soundVolume);
    } else {
      spaceSynth.stop();
    }
  };

  const handlePresetChange = (preset: UniverseConfig['soundPreset']) => {
    onChange({ soundPreset: preset });
    if (config.soundEnabled) {
      spaceSynth.setPreset(preset);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    onChange({ soundVolume: vol });
    if (config.soundEnabled) {
      spaceSynth.setVolume(vol);
    }
  };

  const presets = [
    { id: 'deep_drone', label: '432Hz Sacred Om', desc: 'Harmonic deep drone' },
    { id: 'theta_waves', label: 'Theta Meditation', desc: '6Hz binaural flow' },
    { id: 'celestial_shimmer', label: 'Solfeggio Crystal', desc: 'High frequency chime pad' },
    { id: 'pink_cosmos', label: 'Solar Wind', desc: 'Filtered cosmic space noise' },
  ] as const;

  return (
    <div
      id="audio-player-hud"
      className="bg-[#020205]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-white w-72"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">Cosmic Audio</span>
        </div>

        <button
          onClick={toggleSound}
          className={`p-1.5 rounded-xl border transition-all ${
            config.soundEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
          }`}
          title={config.soundEnabled ? 'Mute Soundscape' : 'Enable Generative Audio'}
        >
          {config.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-1.5 mb-3">
        {presets.map(p => (
          <button
            key={p.id}
            onClick={() => handlePresetChange(p.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
              config.soundPreset === p.id && config.soundEnabled
                ? 'bg-white/15 text-white font-medium border border-cyan-400/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div>
              <div className="text-slate-200">{p.label}</div>
              <div className="text-[10px] text-slate-500">{p.desc}</div>
            </div>
            {config.soundPreset === p.id && config.soundEnabled && (
              <Sparkles className="w-3 h-3 text-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Volume Slider */}
      <div className="pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>Synthesizer Volume</span>
          <span className="font-mono text-slate-200">{Math.round(config.soundVolume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.05"
          max="1.0"
          step="0.05"
          value={config.soundVolume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>
    </div>
  );
};
