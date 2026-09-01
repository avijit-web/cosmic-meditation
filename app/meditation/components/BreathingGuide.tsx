import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, X } from 'lucide-react';
import { UniverseConfig } from '../types';

interface BreathingGuideProps {
  config: UniverseConfig;
  onClose: () => void;
  onPaceChange: (pace: UniverseConfig['breathingPace']) => void;
}

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ config, onClose, onPaceChange }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [timer, setTimer] = useState<number>(4);

  useEffect(() => {
    let currentPhaseIdx = 0;
    let secondsLeft = 4;

    // Pattern timing definitions in seconds
    const patterns: Record<UniverseConfig['breathingPace'], { phase: 'Inhale' | 'Hold' | 'Exhale' | 'Rest'; duration: number }[]> = {
      calm_4_7_8: [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 7 },
        { phase: 'Exhale', duration: 8 },
      ],
      box_4_4_4_4: [
        { phase: 'Inhale', duration: 4 },
        { phase: 'Hold', duration: 4 },
        { phase: 'Exhale', duration: 4 },
        { phase: 'Rest', duration: 4 },
      ],
      gentle_5_5: [
        { phase: 'Inhale', duration: 5 },
        { phase: 'Exhale', duration: 5 },
      ],
    };

    const currentPattern = patterns[config.breathingPace] || patterns.calm_4_7_8;
    secondsLeft = currentPattern[0].duration;
    setPhase(currentPattern[0].phase);
    setTimer(secondsLeft);

    const interval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        currentPhaseIdx = (currentPhaseIdx + 1) % currentPattern.length;
        const next = currentPattern[currentPhaseIdx];
        setPhase(next.phase);
        secondsLeft = next.duration;
      }
      setTimer(secondsLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [config.breathingPace]);

  const getScale = () => {
    if (phase === 'Inhale') return 1.45;
    if (phase === 'Hold') return 1.45;
    if (phase === 'Exhale') return 0.9;
    return 0.9;
  };

  const getDuration = () => {
    if (config.breathingPace === 'calm_4_7_8') {
      if (phase === 'Inhale') return 4;
      if (phase === 'Hold') return 7;
      if (phase === 'Exhale') return 8;
    }
    if (config.breathingPace === 'box_4_4_4_4') return 4;
    return 5;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="breathing-guide-overlay"
        className="fixed inset-0 pointer-events-none flex items-center justify-center z-30"
      >
        {/* Central visual breathing concentric rings */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Subtle Outer Geometric Diamond Grid */}
          <div className="absolute w-72 h-72 border border-white/5 rotate-45 pointer-events-none" />
          <div className="absolute w-80 h-80 border border-white/5 -rotate-12 pointer-events-none" />

          {/* Pulsing concentric rings */}
          <motion.div
            animate={{
              scale: getScale(),
              opacity: phase === 'Hold' ? 0.9 : 0.6,
            }}
            transition={{
              duration: getDuration(),
              ease: 'easeInOut',
            }}
            className="w-60 h-60 rounded-full border border-cyan-400/30 bg-cyan-950/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_90px_rgba(0,240,255,0.2)]"
          >
            {/* Inner secondary orb */}
            <motion.div
              animate={{
                scale: getScale() * 0.75,
              }}
              transition={{
                duration: getDuration(),
                ease: 'easeInOut',
              }}
              className="w-40 h-40 rounded-full border border-purple-400/30 bg-purple-950/15 flex items-center justify-center shadow-[0_0_50px_rgba(191,0,255,0.25)]"
            >
              {/* Inner core */}
              <div className="text-center select-none pointer-events-auto">
                <span className="block text-2xl font-serif italic tracking-wide text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.9)]">
                  {phase}
                </span>
                <span className="text-xs font-mono text-cyan-300/90 mt-1 block">
                  {timer}s
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Pattern selector controls under the breathing ring */}
          <div className="mt-8 pointer-events-auto flex items-center gap-2 bg-[#020205]/80 backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <button
              onClick={() => onPaceChange('calm_4_7_8')}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                config.breathingPace === 'calm_4_7_8'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4-7-8 Deep Sleep
            </button>
            <button
              onClick={() => onPaceChange('box_4_4_4_4')}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                config.breathingPace === 'box_4_4_4_4'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4-4-4 Box
            </button>
            <button
              onClick={() => onPaceChange('gentle_5_5')}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                config.breathingPace === 'gentle_5_5'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5-5 Coherence
            </button>
            <button
              onClick={onClose}
              className="ml-2 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Close breathing guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
