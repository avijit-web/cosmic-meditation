// import React, { useState, useEffect, useRef } from "react";
// import {
//   Sparkles,
//   Settings,
//   RotateCcw,
//   Volume2,
//   VolumeX,
//   Play,
//   Pause,
//   Clock,
//   User,
//   Music,
//   CheckCircle2,
// } from "lucide-react";
// import { UniverseConfig } from "../types";
// import {
//   getMeditationScript,
//   MEDITATION_TYPES,
// } from "../data/meditationScripts";
// import { MUSIC_TRACKS } from "../audio/musicTracks";
// import { musicController } from "../audio/musicController";

// interface ThoughtMeditationGameProps {
//   config: UniverseConfig;
//   onOpenCustomize: () => void;
//   onConfigChange: (updates: Partial<UniverseConfig>) => void;
// }

// export const ThoughtMeditationGame: React.FC<ThoughtMeditationGameProps> = ({
//   config,
//   onOpenCustomize,
//   onConfigChange,
// }) => {
//   const [thoughtInput, setThoughtInput] = useState<string>("");
//   const [activeThought, setActiveThought] = useState<string>("");
//   const [isMeditating, setIsMeditating] = useState<boolean>(false);
//   const [isCompleted, setIsCompleted] = useState<boolean>(false);
//   const [isCompletionVisible, setIsCompletionVisible] =
//     useState<boolean>(false);
//   const [isPaused, setIsPaused] = useState<boolean>(false);
//   const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

//   // High-frequency continuous progress (0.0 to 1.0)
//   const [continuousProgress, setContinuousProgress] = useState<number>(0);

//   // Smooth text cross-fade state
//   const [displayPrompt, setDisplayPrompt] = useState<{
//     text: string;
//     subText?: string;
//   }>({
//     text: "",
//     subText: "",
//   });
//   const [textFade, setTextFade] = useState<"in" | "out">("in");

//   const totalDuration = config.meditationDuration;
//   const script = getMeditationScript(
//     config.meditationType,
//     config.meditationDuration,
//   );

//   // Animation & timing refs
//   const startTimeRef = useRef<number>(0);
//   const pausedAccumRef = useRef<number>(0);
//   const pauseStartRef = useRef<number>(0);
//   const animFrameIdRef = useRef<number>(0);
//   const lastStepIndexRef = useRef<number>(-1);
//   const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const fadeOutTriggeredRef = useRef<boolean>(false);

//   // Direct DOM refs for 60/120fps fluid GPU-accelerated scaling with zero layout overhead
//   const orbContainerRef = useRef<HTMLDivElement>(null);
//   const orbSphereRef = useRef<HTMLDivElement>(null);
//   const orbCoronaRef = useRef<HTMLDivElement>(null);
//   const thoughtTextRef = useRef<HTMLDivElement>(null);
//   const starSparkleRef = useRef<HTMLDivElement>(null);

//   // Audio Playback lifecycle
//   useEffect(() => {
//     if (isMeditating && !isCompleted && !isAudioMuted && !isPaused) {
//       fadeOutTriggeredRef.current = false;
//       musicController.play(config.selectedMusicTrack, config.soundVolume);
//     } else if (!isMeditating || isAudioMuted || isPaused) {
//       musicController.stop();
//     }

//     return () => {
//       musicController.stop();
//     };
//   }, [
//     isMeditating,
//     isCompleted,
//     isAudioMuted,
//     isPaused,
//     config.selectedMusicTrack,
//     config.soundVolume,
//   ]);

//   // Handle Pause / Resume timer accumulation
//   useEffect(() => {
//     if (isPaused) {
//       pauseStartRef.current = performance.now();
//     } else if (pauseStartRef.current > 0) {
//       pausedAccumRef.current += performance.now() - pauseStartRef.current;
//       pauseStartRef.current = 0;
//     }
//   }, [isPaused]);

//   // High-frequency GPU animation loop syncing orb size, text dissolution, and upward background drift
//   useEffect(() => {
//     if (!isMeditating || isCompleted) {
//       if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
//       return;
//     }

//     const tick = () => {
//       if (!isPaused) {
//         const now = performance.now();
//         const effectiveElapsedMs = Math.max(
//           0,
//           now - startTimeRef.current - pausedAccumRef.current,
//         );
//         const durationMs = totalDuration * 1000;
//         const progress = Math.min(1.0, effectiveElapsedMs / durationMs);

//         setContinuousProgress(progress);

//         // Music Fadeout Trigger: Start gentle 4-second fadeout during final 8% of meditation
//         if (progress >= 0.9 && !fadeOutTriggeredRef.current && !isAudioMuted) {
//           fadeOutTriggeredRef.current = true;
//           musicController.fadeOut(4.5);
//         }

//         // 1. Organic celestial contraction curve:
//         // Starts at 1.0 (260px) and contracts smoothly down to a pinpoint star (~3px)
//         const contraction = Math.pow(Math.max(0, 1 - progress), 2.0);
//         // Minimum scale ~0.012 (approx 3px diameter, perfectly matching real background stars)
//         const scale = Math.max(0.012, contraction);

//         // 2. Text and Orb are strictly synchronized:
//         // Text is inside the orb and scales down naturally with it.
//         // As the orb contracts to star size (scale < 0.18, ~46px), the text softly fades out,
//         // leaving the glowing star intact.
//         let textOpacity = 1.0;
//         if (scale < 0.3) {
//           textOpacity = Math.max(0, (scale - 0.08) / 0.22);
//         }

//         // 3. Upward Star Drift:
//         // As it becomes a star (progress > 0.60), it begins gently drifting upward
//         // at the same velocity as the cosmic background starfield.
//         let driftY = 0;
//         if (progress > 0.6) {
//           const driftPhase = (progress - 0.6) / 0.4;
//           // Drift upward by up to -140px smoothly
//           driftY = -140 * Math.pow(driftPhase, 1.4);
//         }

//         // 4. Subtle star twinkling flare as it reaches star size and blends with the cosmos
//         const isStarPinpoint = scale <= 0.035;
//         const twinklePulse = isStarPinpoint
//           ? 0.75 + 0.25 * Math.sin(now * 0.007)
//           : 1.0;

//         // 5. Apply hardware-accelerated transforms directly (no reflow)
//         if (orbContainerRef.current) {
//           orbContainerRef.current.style.transform = `translate3d(0, ${driftY}px, 0) scale(${scale})`;
//           orbContainerRef.current.style.opacity = `${twinklePulse}`;
//         }

//         if (thoughtTextRef.current) {
//           thoughtTextRef.current.style.opacity = `${textOpacity}`;
//         }

//         if (starSparkleRef.current) {
//           starSparkleRef.current.style.opacity = isStarPinpoint ? "1" : "0";
//         }

//         // Check active step in script
//         const elapsedSec = progress * totalDuration;
//         const matchingIndex = script.steps.findIndex((step, idx) => {
//           const nextStep = script.steps[idx + 1];
//           return (
//             elapsedSec >= step.atSecond &&
//             (!nextStep || elapsedSec < nextStep.atSecond)
//           );
//         });

//         const activeIndex = matchingIndex >= 0 ? matchingIndex : 0;
//         const targetStep = script.steps[activeIndex] || script.steps[0];

//         // Trigger gentle slow cross-fade when step changes
//         if (activeIndex !== lastStepIndexRef.current && targetStep) {
//           lastStepIndexRef.current = activeIndex;

//           if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);

//           // Fade out current text
//           setTextFade("out");

//           // Switch content and fade in after smooth transition
//           textTimeoutRef.current = setTimeout(() => {
//             setDisplayPrompt({
//               text: targetStep.text,
//               subText: targetStep.subText,
//             });
//             setTextFade("in");
//           }, 700);
//         }

//         // Gentle, Serene Completion Transition
//         if (progress >= 1.0) {
//           if (!fadeOutTriggeredRef.current) {
//             fadeOutTriggeredRef.current = true;
//             musicController.fadeOut(3.5);
//           }

//           // 1. Gently fade out the final guided prompt
//           setTextFade("out");

//           // 2. Pause in quiet cosmic stillness, then smoothly reveal the completion screen
//           if (completionTimeoutRef.current)
//             clearTimeout(completionTimeoutRef.current);
//           completionTimeoutRef.current = setTimeout(() => {
//             setIsCompleted(true);
//             // Trigger slow fade-in transition
//             setTimeout(() => {
//               setIsCompletionVisible(true);
//             }, 60);
//           }, 800);

//           return;
//         }
//       }

//       animFrameIdRef.current = requestAnimationFrame(tick);
//     };

//     animFrameIdRef.current = requestAnimationFrame(tick);

//     return () => {
//       if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
//       if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
//       if (completionTimeoutRef.current)
//         clearTimeout(completionTimeoutRef.current);
//     };
//   }, [
//     isMeditating,
//     isCompleted,
//     isPaused,
//     totalDuration,
//     script.steps,
//     isAudioMuted,
//   ]);

//   const handleStartMeditation = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();
//     const cleanText = thoughtInput.trim() || "stress";
//     setActiveThought(cleanText);
//     setIsMeditating(true);
//     setIsCompleted(false);
//     setIsCompletionVisible(false);
//     setIsPaused(false);
//     setContinuousProgress(0);
//     startTimeRef.current = performance.now();
//     pausedAccumRef.current = 0;
//     pauseStartRef.current = 0;
//     lastStepIndexRef.current = 0;
//     fadeOutTriggeredRef.current = false;

//     const firstStep = script.steps[0];
//     setDisplayPrompt({
//       text: firstStep.text,
//       subText: firstStep.subText,
//     });
//     setTextFade("in");

//     // Reset container scale
//     if (orbContainerRef.current) {
//       orbContainerRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
//       orbContainerRef.current.style.opacity = "1";
//     }
//     if (thoughtTextRef.current) {
//       thoughtTextRef.current.style.opacity = "1";
//     }
//   };

//   const handleReset = () => {
//     if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
//     if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
//     if (completionTimeoutRef.current)
//       clearTimeout(completionTimeoutRef.current);
//     setIsMeditating(false);
//     setIsCompleted(false);
//     setIsCompletionVisible(false);
//     setIsPaused(false);
//     setContinuousProgress(0);
//     setThoughtInput("");
//     setActiveThought("");
//     fadeOutTriggeredRef.current = false;
//     musicController.stop();

//     if (orbContainerRef.current) {
//       orbContainerRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
//       orbContainerRef.current.style.opacity = "1";
//     }
//     if (thoughtTextRef.current) {
//       thoughtTextRef.current.style.opacity = "1";
//     }
//   };

//   const toggleMute = () => {
//     setIsAudioMuted((prev) => !prev);
//   };

//   return (
//     <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden">
//       {/* 1. TOP HEADER NAVIGATION (Pinned cleanly to top edge) */}
//       <header className="absolute top-0 left-0 right-0 px-6 sm:px-10 py-6 flex items-center justify-between pointer-events-auto z-40">
//         <button
//           onClick={handleReset}
//           className="flex items-center gap-2.5 text-slate-200 hover:text-white transition-all group"
//           title="Return to Home"
//         >
//           <span className="text-amber-400 group-hover:scale-110 transition-transform">
//             ✦
//           </span>
//           <span className="font-cinzel text-sm sm:text-base font-semibold tracking-widest text-slate-100 group-hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
//             Pixel Stillness
//           </span>
//         </button>

//         <div className="flex items-center gap-3 sm:gap-4 text-xs font-display">
//           {isMeditating && (
//             <button
//               onClick={() => setIsPaused((prev) => !prev)}
//               className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all shadow-md font-medium tracking-wide"
//               title={isPaused ? "Resume meditation" : "Pause meditation"}
//             >
//               {isPaused ? (
//                 <Play className="w-3.5 h-3.5 text-cyan-300" />
//               ) : (
//                 <Pause className="w-3.5 h-3.5 text-slate-200" />
//               )}
//               <span>{isPaused ? "Resume" : "Pause"}</span>
//             </button>
//           )}

//           {isMeditating && (
//             <button
//               onClick={toggleMute}
//               className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all shadow-md"
//               title={isAudioMuted ? "Unmute audio" : "Mute audio"}
//             >
//               {isAudioMuted ? (
//                 <VolumeX className="w-3.5 h-3.5 text-slate-400" />
//               ) : (
//                 <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
//               )}
//             </button>
//           )}

//           <button
//             onClick={onOpenCustomize}
//             className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white transition-all shadow-md font-medium tracking-wide"
//             title="Customize your meditation"
//           >
//             <Settings className="w-3.5 h-3.5 text-cyan-300" />
//             <span className="hidden sm:inline">Settings</span>
//           </button>
//         </div>
//       </header>

//       {/* 2. PROMPT / GUIDANCE HEADING (Fixed Top Anchor - Zero Layout Shift) */}
//       <div className="absolute top-[13%] sm:top-[16%] left-0 right-0 h-[120px] flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-auto">
//         {!isMeditating && !isCompleted && (
//           <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-slate-100 font-medium tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl leading-relaxed">
//             Put a stressful thought in the star
//           </h1>
//         )}

//         {isMeditating && !isCompleted && (
//           <div
//             className={`flex flex-col items-center justify-center max-w-2xl transition-all duration-700 ease-out transform ${
//               textFade === "in"
//                 ? "opacity-100 translate-y-0 blur-none"
//                 : "opacity-0 -translate-y-2 blur-[3px]"
//             }`}
//           >
//             <p className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-wide drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-relaxed">
//               {displayPrompt.text}
//             </p>
//             {displayPrompt.subText && (
//               <p className="mt-2 font-display text-xs sm:text-sm text-cyan-200/90 font-light tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
//                 {displayPrompt.subText}
//               </p>
//             )}
//           </div>
//         )}

//         {isCompleted && (
//           <div
//             className={`flex flex-col items-center justify-center max-w-2xl space-y-2 transition-all duration-1000 ease-out transform ${
//               isCompletionVisible
//                 ? "opacity-100 translate-y-0 blur-none"
//                 : "opacity-0 translate-y-4 blur-[3px]"
//             }`}
//           >
//             <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-display font-medium tracking-wider mb-1 shadow-sm">
//               <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
//               <span>Thought Dissolved</span>
//             </div>
//             <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-wide drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
//               Life is much bigger than this moment.
//             </h2>
//             <p className="font-display text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
//               Your thought has dissolved into the infinite cosmos. Take a deep
//               breath and carry this quiet peace with you.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* 3. THE LUMINOUS STAR ORB (Permanently Centered at 50vw / 50vh with GPU hardware scaling) */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-20 w-[260px] h-[260px]">
//         <div
//           ref={orbContainerRef}
//           className="relative w-[260px] h-[260px] flex items-center justify-center pointer-events-none will-change-transform"
//           style={{
//             transformOrigin: "center center",
//             transform: "translate3d(0, 0, 0) scale(1)",
//           }}
//         >
//           {/* Ethereal Soft Corona Halo (No borders, pure atmospheric radial falloff) */}
//           <div
//             ref={orbCoronaRef}
//             className="absolute -inset-10 rounded-full pointer-events-none"
//             style={{
//               background:
//                 "radial-gradient(circle at 50% 50%, rgba(255, 210, 150, 0.42) 0%, rgba(255, 160, 90, 0.18) 45%, rgba(255, 120, 50, 0.05) 65%, transparent 75%)",
//             }}
//           />

//           {/* Seamless Luminous Celestial Star Sphere (Border-Free Radiant Core) */}
//           <div
//             ref={orbSphereRef}
//             className="relative w-full h-full rounded-full flex items-center justify-center select-none"
//             style={{
//               background:
//                 "radial-gradient(circle at 38% 38%, #ffffff 0%, #fffcf5 32%, #f8e5c8 62%, #f0a754 88%, #d97828 100%)",
//               filter:
//                 "drop-shadow(0 0 25px rgba(255, 180, 90, 0.85)) drop-shadow(0 0 60px rgba(255, 130, 40, 0.45))",
//             }}
//           >
//             {/* Star Core Shimmer Highlight */}
//             <div
//               className="absolute inset-0 rounded-full pointer-events-none"
//               style={{
//                 background:
//                   "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.3) 35%, transparent 60%)",
//               }}
//             />

//             {/* Pinpoint Celestial Star Twinkle Flare (Visible when reaching distant star size) */}
//             <div
//               ref={starSparkleRef}
//               className="absolute -inset-4 rounded-full pointer-events-none opacity-0 transition-opacity duration-300"
//               style={{
//                 background:
//                   "radial-gradient(circle, #ffffff 0%, rgba(255, 230, 180, 0.9) 25%, transparent 70%)",
//                 boxShadow: "0 0 15px #ffffff, 0 0 30px #ffb347",
//               }}
//             />

//             {/* Active Thought Text Centered Inside Star */}
//             <div
//               ref={thoughtTextRef}
//               className="relative z-10 px-6 text-center select-none transition-opacity duration-200"
//               style={{ opacity: 1 }}
//             >
//               <span className="font-display font-bold text-neutral-950 tracking-tight leading-snug block drop-shadow-sm break-words max-w-[210px] text-lg sm:text-xl">
//                 {isMeditating ? activeThought : thoughtInput || ""}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 4. BOTTOM ACTION & CONTROLS AREA (Fixed Bottom Anchor - Zero Layout Shift) */}
//       <div className="absolute bottom-[11%] sm:bottom-[14%] left-0 right-0 min-h-[130px] flex flex-col items-center justify-center gap-3 z-30 pointer-events-auto px-6">
//         {/* Preset Configuration Pill Badge */}
//         {!isMeditating && !isCompleted && (
//           <button
//             onClick={onOpenCustomize}
//             className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0a0c14]/85 hover:bg-[#131724] border border-white/15 text-slate-200 hover:text-white text-xs font-display font-medium tracking-wide transition-all shadow-[0_8px_25px_rgba(0,0,0,0.7)] group"
//           >
//             <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
//               <Clock className="w-3.5 h-3.5" />
//               {config.meditationDuration === 60 ? "1 min" : "2 min"}
//             </span>
//             <span className="text-white/25">•</span>
//             <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
//               <User className="w-3.5 h-3.5" />
//               {MEDITATION_TYPES[config.meditationType]?.name}
//             </span>
//             <span className="text-white/25">•</span>
//             <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
//               <Music className="w-3.5 h-3.5" />
//               {MUSIC_TRACKS[config.selectedMusicTrack]?.name}
//             </span>
//           </button>
//         )}

//         {/* Thought Input Form */}
//         {!isMeditating && !isCompleted && (
//           <form
//             onSubmit={handleStartMeditation}
//             className="w-full max-w-sm flex flex-col items-center gap-3 animate-fade-in mt-1"
//           >
//             <input
//               type="text"
//               placeholder="What's bothering you?..."
//               value={thoughtInput}
//               onChange={(e) => setThoughtInput(e.target.value)}
//               maxLength={60}
//               className="w-full px-5 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-display font-medium shadow-[0_6px_30px_rgba(0,0,0,0.75)] focus:outline-none focus:ring-2 focus:ring-amber-500/90 transition-all text-center"
//               autoFocus
//             />

//             <button
//               type="submit"
//               className="px-9 py-2.5 rounded-xl bg-[#a85832] hover:bg-[#ba6339] active:scale-95 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)] border border-amber-400/30"
//             >
//               Done
//             </button>
//           </form>
//         )}

//         {/* Completion Action Buttons */}
//         {isCompleted && (
//           <div
//             className={`flex flex-wrap items-center justify-center gap-3 pt-2 transition-all duration-1000 delay-300 ease-out transform ${
//               isCompletionVisible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-3"
//             }`}
//           >
//             <button
//               onClick={handleReset}
//               className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#a85832] hover:bg-[#ba6339] text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)]"
//             >
//               <RotateCcw className="w-3.5 h-3.5" />
//               <span>Release Another Thought</span>
//             </button>

//             <button
//               onClick={onOpenCustomize}
//               className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white text-xs font-display font-medium tracking-wide transition-all shadow-md"
//             >
//               Customize Meditation
//             </button>
//           </div>
//         )}
//       </div>

//       {/* 5. FOOTER (Pinned to bottom edge) */}
//       <footer className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 py-5 flex items-center justify-between text-xs text-slate-400 font-display font-light pointer-events-auto z-40">
//         <div className="flex items-center gap-2">
//           <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/90 shadow-[0_0_8px_#00f0ff]" />
//           <span className="tracking-wider">
//             Cosmic Stillness • Pixel Thoughts Edition
//           </span>
//         </div>

//         <div className="flex items-center gap-4">
//           <span className="tracking-wide">
//             {config.meditationDuration === 60 ? "60s" : "120s"} •{" "}
//             {MEDITATION_TYPES[config.meditationType]?.name}
//           </span>
//         </div>
//       </footer>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Settings,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  User,
  Music,
  CheckCircle2,
} from "lucide-react";
import { UniverseConfig } from "../types";
import {
  getMeditationScript,
  MEDITATION_TYPES,
} from "../data/meditationScripts";
import { MUSIC_TRACKS } from "../audio/musicTracks";
import { musicController } from "../audio/musicController";

interface ThoughtMeditationGameProps {
  config: UniverseConfig;
  onOpenCustomize: () => void;
  onConfigChange: (updates: Partial<UniverseConfig>) => void;
}

export const ThoughtMeditationGame: React.FC<ThoughtMeditationGameProps> = ({
  config,
  onOpenCustomize,
  onConfigChange,
}) => {
  const [thoughtInput, setThoughtInput] = useState<string>("");
  const [activeThought, setActiveThought] = useState<string>("");
  const [isMeditating, setIsMeditating] = useState<boolean>(false);
  const [isStartingMeditation, setIsStartingMeditation] =
    useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCompletionVisible, setIsCompletionVisible] =
    useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // High-frequency continuous progress (0.0 to 1.0)
  const [continuousProgress, setContinuousProgress] = useState<number>(0);

  // Smooth text cross-fade state
  const [displayPrompt, setDisplayPrompt] = useState<{
    text: string;
    subText?: string;
  }>({
    text: "",
    subText: "",
  });
  const [textFade, setTextFade] = useState<"in" | "out">("in");

  const totalDuration = config.meditationDuration;
  const script = getMeditationScript(
    config.meditationType,
    config.meditationDuration,
  );

  // Animation & timing refs
  const startTimeRef = useRef<number>(0);
  const pausedAccumRef = useRef<number>(0);
  const pauseStartRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const lastStepIndexRef = useRef<number>(-1);
  const textTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTransitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTriggeredRef = useRef<boolean>(false);

  // Direct DOM refs for 60/120fps fluid GPU-accelerated scaling with zero layout overhead
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const orbSphereRef = useRef<HTMLDivElement>(null);
  const orbCoronaRef = useRef<HTMLDivElement>(null);
  const thoughtTextRef = useRef<HTMLDivElement>(null);
  const starSparkleRef = useRef<HTMLDivElement>(null);

  // Audio Playback lifecycle
  useEffect(() => {
    if (isMeditating && !isCompleted && !isAudioMuted && !isPaused) {
      if (!musicController.getIsPlaying()) {
        fadeOutTriggeredRef.current = false;
        musicController.play(
          config.selectedMusicTrack,
          config.soundVolume,
          3.0,
        );
      }
    } else if (!isMeditating && !isStartingMeditation) {
      musicController.stop();
    }

    return () => {
      if (!isStartingMeditation && !isMeditating) {
        musicController.stop();
      }
    };
  }, [
    isMeditating,
    isStartingMeditation,
    isCompleted,
    isAudioMuted,
    isPaused,
    config.selectedMusicTrack,
    config.soundVolume,
  ]);

  // Handle Pause / Resume timer accumulation
  useEffect(() => {
    if (isPaused) {
      pauseStartRef.current = performance.now();
    } else if (pauseStartRef.current > 0) {
      pausedAccumRef.current += performance.now() - pauseStartRef.current;
      pauseStartRef.current = 0;
    }
  }, [isPaused]);

  // High-frequency GPU animation loop syncing orb size, text dissolution, and upward background drift
  useEffect(() => {
    if (!isMeditating || isCompleted) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const tick = () => {
      if (!isPaused) {
        const now = performance.now();
        const effectiveElapsedMs = Math.max(
          0,
          now - startTimeRef.current - pausedAccumRef.current,
        );
        const durationMs = totalDuration * 1000;
        const progress = Math.min(1.0, effectiveElapsedMs / durationMs);

        setContinuousProgress(progress);

        // Music Fadeout Trigger: Start gentle 4-second fadeout during final 8% of meditation
        if (progress >= 0.9 && !fadeOutTriggeredRef.current && !isAudioMuted) {
          fadeOutTriggeredRef.current = true;
          musicController.fadeOut(4.5);
        }

        // 1. Organic celestial contraction curve:
        // Starts at 1.0 (260px) and contracts smoothly down to a pinpoint star (~3px)
        const contraction = Math.pow(Math.max(0, 1 - progress), 2.0);
        // Minimum scale ~0.012 (approx 3px diameter, perfectly matching real background stars)
        const scale = Math.max(0.012, contraction);

        // 2. Text and Orb are strictly synchronized:
        // Text is inside the orb and scales down naturally with it.
        // As the orb contracts to star size (scale < 0.18, ~46px), the text softly fades out,
        // leaving the glowing star intact.
        let textOpacity = 1.0;
        if (scale < 0.3) {
          textOpacity = Math.max(0, (scale - 0.08) / 0.22);
        }

        // 3. Upward Star Drift:
        // As it becomes a star (progress > 0.60), it begins gently drifting upward
        // at the same velocity as the cosmic background starfield.
        let driftY = 0;
        if (progress > 0.6) {
          const driftPhase = (progress - 0.6) / 0.4;
          // Drift upward by up to -140px smoothly
          driftY = -140 * Math.pow(driftPhase, 1.4);
        }

        // 4. Subtle star twinkling flare as it reaches star size and blends with the cosmos
        const isStarPinpoint = scale <= 0.035;
        const twinklePulse = isStarPinpoint
          ? 0.75 + 0.25 * Math.sin(now * 0.007)
          : 1.0;

        // 5. Apply hardware-accelerated transforms directly (no reflow)
        if (orbContainerRef.current) {
          orbContainerRef.current.style.transform = `translate3d(0, ${driftY}px, 0) scale(${scale})`;
          orbContainerRef.current.style.opacity = `${twinklePulse}`;
        }

        if (thoughtTextRef.current) {
          thoughtTextRef.current.style.opacity = `${textOpacity}`;
        }

        if (starSparkleRef.current) {
          starSparkleRef.current.style.opacity = isStarPinpoint ? "1" : "0";
        }

        // Check active step in script
        const elapsedSec = progress * totalDuration;
        const matchingIndex = script.steps.findIndex((step, idx) => {
          const nextStep = script.steps[idx + 1];
          return (
            elapsedSec >= step.atSecond &&
            (!nextStep || elapsedSec < nextStep.atSecond)
          );
        });

        const activeIndex = matchingIndex >= 0 ? matchingIndex : 0;
        const targetStep = script.steps[activeIndex] || script.steps[0];

        // Trigger gentle slow cross-fade when step changes
        if (activeIndex !== lastStepIndexRef.current && targetStep) {
          lastStepIndexRef.current = activeIndex;

          if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);

          // Fade out current text
          setTextFade("out");

          // Switch content and fade in after smooth transition
          textTimeoutRef.current = setTimeout(() => {
            setDisplayPrompt({
              text: targetStep.text,
              subText: targetStep.subText,
            });
            setTextFade("in");
          }, 700);
        }

        // Gentle, Serene Completion Transition
        if (progress >= 1.0) {
          if (!fadeOutTriggeredRef.current) {
            fadeOutTriggeredRef.current = true;
            musicController.fadeOut(3.5);
          }

          // 1. Gently fade out the final guided prompt
          setTextFade("out");

          // 2. Pause in quiet cosmic stillness, then smoothly reveal the completion screen
          if (completionTimeoutRef.current)
            clearTimeout(completionTimeoutRef.current);
          completionTimeoutRef.current = setTimeout(() => {
            setIsCompleted(true);
            // Trigger slow fade-in transition
            setTimeout(() => {
              setIsCompletionVisible(true);
            }, 60);
          }, 800);

          return;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
      if (completionTimeoutRef.current)
        clearTimeout(completionTimeoutRef.current);
      if (startTransitionTimeoutRef.current)
        clearTimeout(startTransitionTimeoutRef.current);
    };
  }, [
    isMeditating,
    isCompleted,
    isPaused,
    totalDuration,
    script.steps,
    isAudioMuted,
  ]);

  const handleStartMeditation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStartingMeditation || isMeditating) return;

    const cleanText = thoughtInput.trim() || "stress";
    setActiveThought(cleanText);
    setIsStartingMeditation(true);

    // Fade in music smoothly with gentle volume ramp-up over 4.5s
    if (!isAudioMuted) {
      musicController.play(config.selectedMusicTrack, config.soundVolume, 4.5);
    }

    if (startTransitionTimeoutRef.current)
      clearTimeout(startTransitionTimeoutRef.current);
    startTransitionTimeoutRef.current = setTimeout(() => {
      setIsMeditating(true);
      setIsStartingMeditation(false);
      setIsCompleted(false);
      setIsCompletionVisible(false);
      setIsPaused(false);
      setContinuousProgress(0);
      startTimeRef.current = performance.now();
      pausedAccumRef.current = 0;
      pauseStartRef.current = 0;
      lastStepIndexRef.current = 0;
      fadeOutTriggeredRef.current = false;

      const firstStep = script.steps[0];
      setDisplayPrompt({
        text: firstStep.text,
        subText: firstStep.subText,
      });
      setTextFade("in");

      // Reset container scale
      if (orbContainerRef.current) {
        orbContainerRef.current.style.transform =
          "translate3d(0, 0, 0) scale(1)";
        orbContainerRef.current.style.opacity = "1";
      }
      if (thoughtTextRef.current) {
        thoughtTextRef.current.style.opacity = "1";
      }
    }, 700);
  };

  const handleReset = () => {
    if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    if (textTimeoutRef.current) clearTimeout(textTimeoutRef.current);
    if (completionTimeoutRef.current)
      clearTimeout(completionTimeoutRef.current);
    if (startTransitionTimeoutRef.current)
      clearTimeout(startTransitionTimeoutRef.current);
    setIsMeditating(false);
    setIsStartingMeditation(false);
    setIsCompleted(false);
    setIsCompletionVisible(false);
    setIsPaused(false);
    setContinuousProgress(0);
    setThoughtInput("");
    setActiveThought("");
    fadeOutTriggeredRef.current = false;
    musicController.stop();

    if (orbContainerRef.current) {
      orbContainerRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
      orbContainerRef.current.style.opacity = "1";
    }
    if (thoughtTextRef.current) {
      thoughtTextRef.current.style.opacity = "1";
    }
  };

  const toggleMute = () => {
    setIsAudioMuted((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none overflow-hidden">
      {/* 1. TOP HEADER NAVIGATION (Pinned cleanly to top edge) */}
      <header className="absolute top-0 left-0 right-0 px-6 sm:px-10 py-6 flex items-center justify-between pointer-events-auto z-40">
        <button
          onClick={handleReset}
          className="flex items-center gap-2.5 text-slate-200 hover:text-white transition-all group"
          title="Return to Home"
        >
          <span className="text-amber-400 group-hover:scale-110 transition-transform">
            ✦
          </span>
        </button>

        {!isMeditating && (
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-display">
            {isMeditating && (
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all shadow-md font-medium tracking-wide"
                title={isPaused ? "Resume meditation" : "Pause meditation"}
              >
                {isPaused ? (
                  <Play className="w-3.5 h-3.5 text-cyan-300" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-slate-200" />
                )}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </button>
            )}

            {isMeditating && (
              <button
                onClick={toggleMute}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all shadow-md"
                title={isAudioMuted ? "Unmute audio" : "Mute audio"}
              >
                {isAudioMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                )}
              </button>
            )}

            <button
              onClick={onOpenCustomize}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white transition-all shadow-md font-medium tracking-wide"
              title="Customize your meditation"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        )}
      </header>

      {/* 2. PROMPT / GUIDANCE HEADING (Fixed Top Anchor - Zero Layout Shift) */}
      <div className="absolute top-[13%] sm:top-[16%] left-0 right-0 h-[120px] flex flex-col items-center justify-center text-center px-6 z-30 pointer-events-auto">
        {!isMeditating && !isCompleted && (
          <h1
            className={`font-cinzel text-2xl md:text-4xl lg:text-6xl text-slate-100 font-medium tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-2xl leading-tight lg:leading-20 transition-all duration-700 ease-out transform ${
              isStartingMeditation
                ? "opacity-0 -translate-y-3 blur-[2px]"
                : "opacity-100 translate-y-0 blur-none"
            }`}
          >
            Put a stressful thought in the star
          </h1>
        )}

        {isMeditating && !isCompleted && (
          <div
            className={`flex flex-col items-center justify-center max-w-2xl transition-all duration-700 ease-out transform ${
              textFade === "in"
                ? "opacity-100 translate-y-0 blur-none"
                : "opacity-0 -translate-y-2 blur-[3px]"
            }`}
          >
            <p className="font-cinzel text-3xl md:text-4xl lg:text-6xl text-white font-normal tracking-wide drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-tight lg:leading-20">
              {displayPrompt.text}
            </p>
            {displayPrompt.subText && (
              <p className="mt-2   text-cyan-200/90 font-light tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] text-lg  lg:text-4xl">
                {displayPrompt.subText}
              </p>
            )}
          </div>
        )}

        {isCompleted && (
          <div
            className={`flex flex-col items-center justify-center max-w-2xl space-y-2 transition-all duration-1000 ease-out transform ${
              isCompletionVisible
                ? "opacity-100 translate-y-0 blur-none"
                : "opacity-0 translate-y-4 blur-[3px]"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-display font-medium tracking-wider mb-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Thought Dissolved</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-wide drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
              Life is much bigger than this moment.
            </h2>
            <p className="font-display text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Your thought has dissolved into the infinite cosmos. Take a deep
              breath and carry this quiet peace with you.
            </p>
          </div>
        )}
      </div>

      {/* 3. THE LUMINOUS STAR ORB (Permanently Centered at 50vw / 50vh with GPU hardware scaling) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-20 w-[260px] h-[260px]">
        <div
          ref={orbContainerRef}
          className="relative w-[260px] h-[260px] flex items-center justify-center pointer-events-none will-change-transform"
          style={{
            transformOrigin: "center center",
            transform: "translate3d(0, 0, 0) scale(1)",
          }}
        >
          {/* Ethereal Soft Corona Halo (No borders, pure atmospheric radial falloff) */}
          <div
            ref={orbCoronaRef}
            className="absolute -inset-10 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255, 210, 150, 0.42) 0%, rgba(255, 160, 90, 0.18) 45%, rgba(255, 120, 50, 0.05) 65%, transparent 75%)",
            }}
          />

          {/* Seamless Luminous Celestial Star Sphere (Border-Free Radiant Core) */}
          <div
            ref={orbSphereRef}
            className="relative w-full h-full rounded-full flex items-center justify-center select-none"
            style={{
              background:
                "radial-gradient(circle at 38% 38%, #ffffff 0%, #fffcf5 32%, #f8e5c8 62%, #f0a754 88%, #d97828 100%)",
              filter:
                "drop-shadow(0 0 25px rgba(255, 180, 90, 0.85)) drop-shadow(0 0 60px rgba(255, 130, 40, 0.45))",
            }}
          >
            {/* Star Core Shimmer Highlight */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.3) 35%, transparent 60%)",
              }}
            />

            {/* Pinpoint Celestial Star Twinkle Flare (Visible when reaching distant star size) */}
            <div
              ref={starSparkleRef}
              className="absolute -inset-4 rounded-full pointer-events-none opacity-0 transition-opacity duration-300"
              style={{
                background:
                  "radial-gradient(circle, #ffffff 0%, rgba(255, 230, 180, 0.9) 25%, transparent 70%)",
                boxShadow: "0 0 15px #ffffff, 0 0 30px #ffb347",
              }}
            />

            {/* Active Thought Text Centered Inside Star */}
            <div
              ref={thoughtTextRef}
              className="relative z-10 px-6 text-center select-none transition-opacity duration-200"
              style={{ opacity: 1 }}
            >
              <span className="font-display font-normal text-neutral-950 tracking-tight leading-snug block drop-shadow-sm break-words max-w-[210px] text-2xl">
                {isMeditating ? activeThought : thoughtInput || ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ACTION & CONTROLS AREA (Fixed Bottom Anchor - Zero Layout Shift) */}
      <div className="absolute bottom-[11%] sm:bottom-[14%] left-0 right-0 min-h-[130px] flex flex-col items-center justify-center gap-3 z-30 pointer-events-auto px-6">
        {/* Preset Configuration Pill Badge & Input Form Container */}
        {!isMeditating && !isCompleted && (
          <div
            className={`w-full max-w-sm flex flex-col items-center gap-3 transition-all duration-700 ease-out transform ${
              isStartingMeditation
                ? "opacity-0 translate-y-4 pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
          >
            <button
              onClick={onOpenCustomize}
              disabled={isStartingMeditation}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0a0c14]/85 hover:bg-[#131724] border border-white/15 text-slate-200 hover:text-white text-xs font-display font-medium tracking-wide transition-all shadow-[0_8px_25px_rgba(0,0,0,0.7)] group"
            >
              <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                {config.meditationDuration === 60 ? "1 min" : "2 min"}
              </span>
              <span className="text-white/25">•</span>
              <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
                <User className="w-3.5 h-3.5" />
                {MEDITATION_TYPES[config.meditationType]?.name}
              </span>
              <span className="text-white/25">•</span>
              <span className="flex items-center gap-1.5 text-slate-300 group-hover:text-cyan-300">
                <Music className="w-3.5 h-3.5" />
                {MUSIC_TRACKS[config.selectedMusicTrack]?.name}
              </span>
            </button>

            {/* Thought Input Form */}
            <form
              onSubmit={handleStartMeditation}
              className="w-full flex flex-col items-center gap-3 mt-1"
            >
              <input
                type="text"
                placeholder="What's bothering you?..."
                value={thoughtInput}
                onChange={(e) => setThoughtInput(e.target.value)}
                maxLength={60}
                disabled={isStartingMeditation}
                className="w-full px-5 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-display font-medium shadow-[0_6px_30px_rgba(0,0,0,0.75)] focus:outline-none focus:ring-2 focus:ring-amber-500/90 transition-all text-center"
                autoFocus
              />

              <button
                type="submit"
                disabled={isStartingMeditation}
                className="px-9 py-2.5 rounded-xl bg-[#a85832] hover:bg-[#ba6339] active:scale-95 text-white font-display font-semibold text-xs tracking-widest uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)] border border-amber-400/30 disabled:opacity-70"
              >
                Done
              </button>
            </form>
          </div>
        )}

        {/* Completion Action Buttons */}
        {isCompleted && (
          <div
            className={`flex flex-wrap items-center justify-center gap-3 pt-2 transition-all duration-1000 delay-300 ease-out transform ${
              isCompletionVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3"
            }`}
          >
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#a85832] hover:bg-[#ba6339] text-white text-xs font-display font-semibold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(168,88,50,0.5)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Release Another Thought</span>
            </button>

            <button
              onClick={onOpenCustomize}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-100 hover:text-white text-xs font-display font-medium tracking-wide transition-all shadow-md"
            >
              Customize Meditation
            </button>
          </div>
        )}
      </div>

      {/* 5. FOOTER (Pinned to bottom edge) */}
    </div>
  );
};
