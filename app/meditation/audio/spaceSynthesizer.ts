// class SpaceSynthesizer {
//   private ctx: AudioContext | null = null;
//   private masterGain: GainNode | null = null;
//   private isPlaying: boolean = false;
//   private volume: number = 0.4;
//   private currentPreset: string = "deep_drone";

//   // Synth nodes
//   private oscillators: OscillatorNode[] = [];
//   private filterNodes: BiquadFilterNode[] = [];
//   private lfoNodes: OscillatorNode[] = [];
//   private noiseNode: AudioBufferSourceNode | null = null;
//   private noiseGain: GainNode | null = null;

//   private initContext(): AudioContext | null {
//     try {
//       if (!this.ctx || this.ctx.state === "closed") {
//         const AudioCtx =
//           window.AudioContext ||
//           (window as unknown as { webkitAudioContext: typeof AudioContext })
//             .webkitAudioContext;
//         if (!AudioCtx) return null;
//         this.ctx = new AudioCtx();
//       }
//       if (this.ctx && this.ctx.state === "suspended") {
//         this.ctx.resume().catch(() => {});
//       }
//       return this.ctx;
//     } catch {
//       return null;
//     }
//   }

//   public start(
//     preset:
//       | "deep_drone"
//       | "theta_waves"
//       | "celestial_shimmer"
//       | "pink_cosmos" = "deep_drone",
//     volume: number = 0.4,
//   ): void {
//     const ctx = this.initContext();
//     if (!ctx || ctx.state === "closed") return;
//     this.stop();

//     this.currentPreset = preset;
//     this.volume = volume;

//     try {
//       this.masterGain = ctx.createGain();
//       this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
//       this.masterGain.gain.exponentialRampToValueAtTime(
//         Math.max(0.001, this.volume),
//         ctx.currentTime + 3,
//       );
//       this.masterGain.connect(ctx.destination);

//       this.buildSoundscape(preset);
//       this.isPlaying = true;
//     } catch {
//       this.isPlaying = false;
//     }
//   }

//   private buildSoundscape(preset: string): void {
//     if (!this.ctx || !this.masterGain) return;
//     const ctx = this.ctx;

//     // Common soft lowpass filter
//     const mainFilter = ctx.createBiquadFilter();
//     mainFilter.type = "lowpass";
//     mainFilter.frequency.setValueAtTime(
//       preset === "celestial_shimmer" ? 1200 : 350,
//       ctx.currentTime,
//     );
//     mainFilter.Q.setValueAtTime(2.5, ctx.currentTime);
//     mainFilter.connect(this.masterGain);
//     this.filterNodes.push(mainFilter);

//     // Slow Filter LFO for breathing sensation
//     const filterLfo = ctx.createOscillator();
//     filterLfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10 second cycle
//     const filterLfoGain = ctx.createGain();
//     filterLfoGain.gain.setValueAtTime(120, ctx.currentTime);
//     filterLfo.connect(filterLfoGain);
//     filterLfoGain.connect(mainFilter.frequency);
//     filterLfo.start();
//     this.lfoNodes.push(filterLfo);

//     if (preset === "deep_drone") {
//       // 432Hz harmonic root and fourths/fifths (Om / Sacred drone)
//       const freqs = [54.0, 108.0, 162.0, 216.0, 324.0];
//       freqs.forEach((freq, idx) => {
//         const osc = ctx.createOscillator();
//         osc.type = idx % 2 === 0 ? "sine" : "triangle";
//         osc.frequency.setValueAtTime(freq, ctx.currentTime);

//         // Micro detune for celestial chorusing
//         osc.detune.setValueAtTime((idx - 2) * 4, ctx.currentTime);

//         const oscGain = ctx.createGain();
//         oscGain.gain.setValueAtTime(0.18 / (idx + 1), ctx.currentTime);

//         osc.connect(oscGain);
//         oscGain.connect(mainFilter);
//         osc.start();
//         this.oscillators.push(osc);
//       });

//       this.addCosmicNoise(0.04);
//     } else if (preset === "theta_waves") {
//       // 6Hz Theta binaural beat for deep calm & meditation
//       const baseFreq = 110; // A2
//       const thetaBeat = 5.5; // 5.5 Hz Theta wave

//       // Left Channel
//       const oscL = ctx.createOscillator();
//       oscL.type = "sine";
//       oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);
//       const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
//       if (panL) panL.pan.setValueAtTime(-0.8, ctx.currentTime);

//       const gainL = ctx.createGain();
//       gainL.gain.setValueAtTime(0.2, ctx.currentTime);

//       oscL.connect(gainL);
//       if (panL) {
//         gainL.connect(panL);
//         panL.connect(mainFilter);
//       } else {
//         gainL.connect(mainFilter);
//       }
//       oscL.start();
//       this.oscillators.push(oscL);

//       // Right Channel
//       const oscR = ctx.createOscillator();
//       oscR.type = "sine";
//       oscR.frequency.setValueAtTime(baseFreq + thetaBeat, ctx.currentTime);
//       const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
//       if (panR) panR.pan.setValueAtTime(0.8, ctx.currentTime);

//       const gainR = ctx.createGain();
//       gainR.gain.setValueAtTime(0.2, ctx.currentTime);

//       oscR.connect(gainR);
//       if (panR) {
//         gainR.connect(panR);
//         panR.connect(mainFilter);
//       } else {
//         gainR.connect(mainFilter);
//       }
//       oscR.start();
//       this.oscillators.push(oscR);

//       // Sub-bass warm foundation
//       const subOsc = ctx.createOscillator();
//       subOsc.type = "sine";
//       subOsc.frequency.setValueAtTime(55, ctx.currentTime);
//       const subGain = ctx.createGain();
//       subGain.gain.setValueAtTime(0.25, ctx.currentTime);
//       subOsc.connect(subGain);
//       subGain.connect(mainFilter);
//       subOsc.start();
//       this.oscillators.push(subOsc);

//       this.addCosmicNoise(0.03);
//     } else if (preset === "celestial_shimmer") {
//       // Ethereal crystal pad chords
//       const chordFreqs = [174, 285, 396, 528, 639]; // Solfeggio healing frequencies
//       chordFreqs.forEach((freq, idx) => {
//         const osc = ctx.createOscillator();
//         osc.type = "sine";
//         osc.frequency.setValueAtTime(freq, ctx.currentTime);

//         // Shimmer LFO amplitude tremolo
//         const tremolo = ctx.createOscillator();
//         tremolo.frequency.setValueAtTime(0.2 + idx * 0.15, ctx.currentTime);
//         const tremGain = ctx.createGain();
//         tremGain.gain.setValueAtTime(0.04, ctx.currentTime);
//         tremolo.connect(tremGain.gain);
//         tremolo.start();
//         this.lfoNodes.push(tremolo);

//         const oscGain = ctx.createGain();
//         oscGain.gain.setValueAtTime(0.12, ctx.currentTime);

//         osc.connect(oscGain);
//         oscGain.connect(mainFilter);
//         osc.start();
//         this.oscillators.push(osc);
//       });
//       this.addCosmicNoise(0.05);
//     } else if (preset === "pink_cosmos") {
//       // Deep soothing cosmic solar wind
//       this.addCosmicNoise(0.18);

//       const drone = ctx.createOscillator();
//       drone.type = "sine";
//       drone.frequency.setValueAtTime(65.4, ctx.currentTime); // C2
//       const droneGain = ctx.createGain();
//       droneGain.gain.setValueAtTime(0.18, ctx.currentTime);
//       drone.connect(droneGain);
//       droneGain.connect(mainFilter);
//       drone.start();
//       this.oscillators.push(drone);
//     }
//   }

//   private addCosmicNoise(gainLevel: number): void {
//     if (!this.ctx || !this.masterGain) return;
//     const ctx = this.ctx;

//     // Generate 5-second loop of filtered pink/brown noise
//     const bufferSize = ctx.sampleRate * 5;
//     const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
//     const output = noiseBuffer.getChannelData(0);

//     let b0 = 0,
//       b1 = 0,
//       b2 = 0,
//       b3 = 0,
//       b4 = 0,
//       b5 = 0,
//       b6 = 0;
//     for (let i = 0; i < bufferSize; i++) {
//       const white = Math.random() * 2 - 1;
//       b0 = 0.99886 * b0 + white * 0.0555179;
//       b1 = 0.99332 * b1 + white * 0.0750759;
//       b2 = 0.969 * b2 + white * 0.153852;
//       b3 = 0.8665 * b3 + white * 0.3104856;
//       b4 = 0.55 * b4 + white * 0.5329522;
//       b5 = -0.7616 * b5 - white * 0.016898;
//       output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
//       b6 = white * 0.115926;
//     }

//     const whiteNoise = ctx.createBufferSource();
//     whiteNoise.buffer = noiseBuffer;
//     whiteNoise.loop = true;

//     // Filter noise to sound like gentle intergalactic vacuum
//     const noiseFilter = ctx.createBiquadFilter();
//     noiseFilter.type = "bandpass";
//     noiseFilter.frequency.setValueAtTime(220, ctx.currentTime);
//     noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime);

//     this.noiseGain = ctx.createGain();
//     this.noiseGain.gain.setValueAtTime(gainLevel, ctx.currentTime);

//     whiteNoise.connect(noiseFilter);
//     noiseFilter.connect(this.noiseGain);
//     this.noiseGain.connect(this.masterGain);

//     whiteNoise.start();
//     this.noiseNode = whiteNoise;
//   }

//   public playOrbChime(frequency: number = 440): void {
//     if (
//       !this.ctx ||
//       this.ctx.state === "closed" ||
//       !this.isPlaying ||
//       !this.masterGain
//     )
//       return;
//     const ctx = this.ctx;

//     try {
//       const chimeOsc = ctx.createOscillator();
//       const chimeGain = ctx.createGain();

//       chimeOsc.type = "sine";
//       // Harmonic pentatonic tuning
//       chimeOsc.frequency.setValueAtTime(frequency, ctx.currentTime);

//       chimeGain.gain.setValueAtTime(0.001, ctx.currentTime);
//       chimeGain.gain.exponentialRampToValueAtTime(
//         0.12 * this.volume,
//         ctx.currentTime + 0.05,
//       );
//       chimeGain.gain.exponentialRampToValueAtTime(
//         0.0001,
//         ctx.currentTime + 3.0,
//       );

//       chimeOsc.connect(chimeGain);
//       chimeGain.connect(this.masterGain);

//       chimeOsc.start();
//       chimeOsc.stop(ctx.currentTime + 3.1);
//     } catch {
//       // Ignore audio interruptions
//     }
//   }

//   public setVolume(vol: number): void {
//     this.volume = Math.max(0, Math.min(1, vol));
//     if (this.ctx && this.ctx.state !== "closed" && this.masterGain) {
//       try {
//         this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
//         this.masterGain.gain.linearRampToValueAtTime(
//           this.volume,
//           this.ctx.currentTime + 0.1,
//         );
//       } catch {}
//     }
//   }

//   public setPreset(
//     preset: "deep_drone" | "theta_waves" | "celestial_shimmer" | "pink_cosmos",
//   ): void {
//     if (this.isPlaying) {
//       this.start(preset, this.volume);
//     } else {
//       this.currentPreset = preset;
//     }
//   }

//   public fadeOut(durationSeconds: number = 3.5, onComplete?: () => void): void {
//     if (
//       !this.isPlaying ||
//       !this.ctx ||
//       this.ctx.state === "closed" ||
//       !this.masterGain
//     ) {
//       if (onComplete) onComplete();
//       return;
//     }

//     try {
//       const currentTime = this.ctx.currentTime;
//       this.masterGain.gain.cancelScheduledValues(currentTime);
//       this.masterGain.gain.setValueAtTime(
//         Math.max(0.0001, this.masterGain.gain.value),
//         currentTime,
//       );
//       this.masterGain.gain.exponentialRampToValueAtTime(
//         0.0001,
//         currentTime + durationSeconds,
//       );
//     } catch {}

//     setTimeout(
//       () => {
//         this.stop();
//         if (onComplete) onComplete();
//       },
//       durationSeconds * 1000 + 50,
//     );
//   }

//   public stop(): void {
//     if (this.ctx && this.ctx.state !== "closed" && this.masterGain) {
//       try {
//         this.masterGain.gain.setValueAtTime(
//           this.masterGain.gain.value,
//           this.ctx.currentTime,
//         );
//         this.masterGain.gain.exponentialRampToValueAtTime(
//           0.0001,
//           this.ctx.currentTime + 0.5,
//         );
//       } catch {}
//     }

//     setTimeout(() => {
//       this.oscillators.forEach((osc) => {
//         try {
//           osc.stop();
//           osc.disconnect();
//         } catch {}
//       });
//       this.oscillators = [];

//       this.lfoNodes.forEach((lfo) => {
//         try {
//           lfo.stop();
//           lfo.disconnect();
//         } catch {}
//       });
//       this.lfoNodes = [];

//       this.filterNodes.forEach((f) => {
//         try {
//           f.disconnect();
//         } catch {}
//       });
//       this.filterNodes = [];

//       if (this.noiseNode) {
//         try {
//           this.noiseNode.stop();
//           this.noiseNode.disconnect();
//         } catch {}
//         this.noiseNode = null;
//       }

//       this.isPlaying = false;
//     }, 500);
//   }

//   public getIsPlaying(): boolean {
//     return this.isPlaying;
//   }
// }

// export const spaceSynth = new SpaceSynthesizer();

/**
 * Pure Web Audio API Generative Cosmic & Meditation Soundscape Synthesizer
 */

class SpaceSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.4;
  private currentPreset: string = "deep_drone";

  // Synth nodes
  private oscillators: OscillatorNode[] = [];
  private filterNodes: BiquadFilterNode[] = [];
  private lfoNodes: OscillatorNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    try {
      if (!this.ctx || this.ctx.state === "closed") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public start(
    preset:
      | "deep_drone"
      | "theta_waves"
      | "celestial_shimmer"
      | "pink_cosmos" = "deep_drone",
    volume: number = 0.4,
    fadeInDuration: number = 4.0,
  ): void {
    const ctx = this.initContext();
    if (!ctx || ctx.state === "closed") return;
    this.stop();

    this.currentPreset = preset;
    this.volume = volume;

    try {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, this.volume),
        ctx.currentTime + Math.max(0.5, fadeInDuration),
      );
      this.masterGain.connect(ctx.destination);

      this.buildSoundscape(preset);
      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  private buildSoundscape(preset: string): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Common soft lowpass filter
    const mainFilter = ctx.createBiquadFilter();
    mainFilter.type = "lowpass";
    mainFilter.frequency.setValueAtTime(
      preset === "celestial_shimmer" ? 1200 : 350,
      ctx.currentTime,
    );
    mainFilter.Q.setValueAtTime(2.5, ctx.currentTime);
    mainFilter.connect(this.masterGain);
    this.filterNodes.push(mainFilter);

    // Slow Filter LFO for breathing sensation
    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10 second cycle
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.setValueAtTime(120, ctx.currentTime);
    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(mainFilter.frequency);
    filterLfo.start();
    this.lfoNodes.push(filterLfo);

    if (preset === "deep_drone") {
      // 432Hz harmonic root and fourths/fifths (Om / Sacred drone)
      const freqs = [54.0, 108.0, 162.0, 216.0, 324.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Micro detune for celestial chorusing
        osc.detune.setValueAtTime((idx - 2) * 4, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.18 / (idx + 1), ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(mainFilter);
        osc.start();
        this.oscillators.push(osc);
      });

      this.addCosmicNoise(0.04);
    } else if (preset === "theta_waves") {
      // 6Hz Theta binaural beat for deep calm & meditation
      const baseFreq = 110; // A2
      const thetaBeat = 5.5; // 5.5 Hz Theta wave

      // Left Channel
      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panL) panL.pan.setValueAtTime(-0.8, ctx.currentTime);

      const gainL = ctx.createGain();
      gainL.gain.setValueAtTime(0.2, ctx.currentTime);

      oscL.connect(gainL);
      if (panL) {
        gainL.connect(panL);
        panL.connect(mainFilter);
      } else {
        gainL.connect(mainFilter);
      }
      oscL.start();
      this.oscillators.push(oscL);

      // Right Channel
      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.setValueAtTime(baseFreq + thetaBeat, ctx.currentTime);
      const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panR) panR.pan.setValueAtTime(0.8, ctx.currentTime);

      const gainR = ctx.createGain();
      gainR.gain.setValueAtTime(0.2, ctx.currentTime);

      oscR.connect(gainR);
      if (panR) {
        gainR.connect(panR);
        panR.connect(mainFilter);
      } else {
        gainR.connect(mainFilter);
      }
      oscR.start();
      this.oscillators.push(oscR);

      // Sub-bass warm foundation
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(55, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.25, ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(mainFilter);
      subOsc.start();
      this.oscillators.push(subOsc);

      this.addCosmicNoise(0.03);
    } else if (preset === "celestial_shimmer") {
      // Ethereal crystal pad chords
      const chordFreqs = [174, 285, 396, 528, 639]; // Solfeggio healing frequencies
      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Shimmer LFO amplitude tremolo
        const tremolo = ctx.createOscillator();
        tremolo.frequency.setValueAtTime(0.2 + idx * 0.15, ctx.currentTime);
        const tremGain = ctx.createGain();
        tremGain.gain.setValueAtTime(0.04, ctx.currentTime);
        tremolo.connect(tremGain.gain);
        tremolo.start();
        this.lfoNodes.push(tremolo);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(mainFilter);
        osc.start();
        this.oscillators.push(osc);
      });
      this.addCosmicNoise(0.05);
    } else if (preset === "pink_cosmos") {
      // Deep soothing cosmic solar wind
      this.addCosmicNoise(0.18);

      const drone = ctx.createOscillator();
      drone.type = "sine";
      drone.frequency.setValueAtTime(65.4, ctx.currentTime); // C2
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.18, ctx.currentTime);
      drone.connect(droneGain);
      droneGain.connect(mainFilter);
      drone.start();
      this.oscillators.push(drone);
    }
  }

  private addCosmicNoise(gainLevel: number): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Generate 5-second loop of filtered pink/brown noise
    const bufferSize = ctx.sampleRate * 5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter noise to sound like gentle intergalactic vacuum
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(220, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.8, ctx.currentTime);

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(gainLevel, ctx.currentTime);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
  }

  public playOrbChime(frequency: number = 440): void {
    if (
      !this.ctx ||
      this.ctx.state === "closed" ||
      !this.isPlaying ||
      !this.masterGain
    )
      return;
    const ctx = this.ctx;

    try {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = "sine";
      // Harmonic pentatonic tuning
      chimeOsc.frequency.setValueAtTime(frequency, ctx.currentTime);

      chimeGain.gain.setValueAtTime(0.001, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(
        0.12 * this.volume,
        ctx.currentTime + 0.05,
      );
      chimeGain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 3.0,
      );

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chimeOsc.start();
      chimeOsc.stop(ctx.currentTime + 3.1);
    } catch {
      // Ignore audio interruptions
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.ctx.state !== "closed" && this.masterGain) {
      try {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(
          this.volume,
          this.ctx.currentTime + 0.1,
        );
      } catch {}
    }
  }

  public setPreset(
    preset: "deep_drone" | "theta_waves" | "celestial_shimmer" | "pink_cosmos",
  ): void {
    if (this.isPlaying) {
      this.start(preset, this.volume);
    } else {
      this.currentPreset = preset;
    }
  }

  public fadeOut(durationSeconds: number = 3.5, onComplete?: () => void): void {
    if (
      !this.isPlaying ||
      !this.ctx ||
      this.ctx.state === "closed" ||
      !this.masterGain
    ) {
      if (onComplete) onComplete();
      return;
    }

    try {
      const currentTime = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(currentTime);
      this.masterGain.gain.setValueAtTime(
        Math.max(0.0001, this.masterGain.gain.value),
        currentTime,
      );
      this.masterGain.gain.exponentialRampToValueAtTime(
        0.0001,
        currentTime + durationSeconds,
      );
    } catch {}

    setTimeout(
      () => {
        this.stop();
        if (onComplete) onComplete();
      },
      durationSeconds * 1000 + 50,
    );
  }

  public stop(): void {
    if (this.ctx && this.ctx.state !== "closed" && this.masterGain) {
      try {
        this.masterGain.gain.setValueAtTime(
          this.masterGain.gain.value,
          this.ctx.currentTime,
        );
        this.masterGain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.ctx.currentTime + 0.5,
        );
      } catch {}
    }

    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.oscillators = [];

      this.lfoNodes.forEach((lfo) => {
        try {
          lfo.stop();
          lfo.disconnect();
        } catch {}
      });
      this.lfoNodes = [];

      this.filterNodes.forEach((f) => {
        try {
          f.disconnect();
        } catch {}
      });
      this.filterNodes = [];

      if (this.noiseNode) {
        try {
          this.noiseNode.stop();
          this.noiseNode.disconnect();
        } catch {}
        this.noiseNode = null;
      }

      this.isPlaying = false;
    }, 500);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const spaceSynth = new SpaceSynthesizer();
