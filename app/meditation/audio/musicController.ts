// import { MusicTrackId } from "../types";
// import { MUSIC_TRACKS } from "./musicTracks";
// import { spaceSynth } from "./spaceSynthesizer";

// class MusicController {
//   private audioElement: HTMLAudioElement | null = null;
//   private currentTrackId: MusicTrackId | null = null;
//   private isPlaying: boolean = false;
//   private currentVolume: number = 0.4;
//   private synthFallbackActive: boolean = false;

//   public play(trackId: MusicTrackId, volume: number = 0.4): void {
//     this.currentTrackId = trackId;
//     this.currentVolume = volume;
//     this.isPlaying = true;

//     const track = MUSIC_TRACKS[trackId];
//     if (!track) return;

//     // Stop synth fallback if running
//     if (this.synthFallbackActive) {
//       spaceSynth.stop();
//       this.synthFallbackActive = false;
//     }

//     if (!this.audioElement) {
//       this.audioElement = new Audio();
//       this.audioElement.loop = true;
//       this.audioElement.preload = "auto";

//       this.audioElement.addEventListener("error", () => {
//         // Fallback to web audio synthesizer if test MP3 URL fails to load or is offline
//         if (this.isPlaying && this.currentTrackId) {
//           const t = MUSIC_TRACKS[this.currentTrackId];
//           if (t) {
//             spaceSynth.start(t.synthPreset, this.currentVolume);
//             this.synthFallbackActive = true;
//           }
//         }
//       });
//     }

//     if (this.audioElement.src !== track.mp3Url) {
//       this.audioElement.src = track.mp3Url;
//     }

//     this.audioElement.volume = Math.max(0, Math.min(1, volume));

//     const playPromise = this.audioElement.play();
//     if (playPromise !== undefined) {
//       playPromise.catch(() => {
//         // Autoplay policy or fetch error -> trigger Web Audio synthesizer fallback gracefully
//         if (this.isPlaying) {
//           spaceSynth.start(track.synthPreset, volume);
//           this.synthFallbackActive = true;
//         }
//       });
//     }
//   }

//   private fadeInterval: NodeJS.Timeout | null = null;

//   public fadeOut(durationSeconds: number = 3.5, onComplete?: () => void): void {
//     if (!this.isPlaying) {
//       if (onComplete) onComplete();
//       return;
//     }

//     if (this.fadeInterval) {
//       clearInterval(this.fadeInterval);
//       this.fadeInterval = null;
//     }

//     if (this.synthFallbackActive) {
//       spaceSynth.fadeOut(durationSeconds, () => {
//         this.isPlaying = false;
//         this.synthFallbackActive = false;
//         if (onComplete) onComplete();
//       });
//       return;
//     }

//     if (!this.audioElement) {
//       this.isPlaying = false;
//       if (onComplete) onComplete();
//       return;
//     }

//     const startVolume = this.audioElement.volume;
//     const steps = 30;
//     const stepDuration = (durationSeconds * 1000) / steps;
//     let stepCount = 0;

//     this.fadeInterval = setInterval(() => {
//       stepCount++;
//       const factor = Math.max(0, 1 - stepCount / steps);
//       if (this.audioElement) {
//         this.audioElement.volume = startVolume * factor;
//       }

//       if (stepCount >= steps) {
//         if (this.fadeInterval) {
//           clearInterval(this.fadeInterval);
//           this.fadeInterval = null;
//         }
//         this.stop();
//         if (onComplete) onComplete();
//       }
//     }, stepDuration);
//   }

//   public stop(): void {
//     if (this.fadeInterval) {
//       clearInterval(this.fadeInterval);
//       this.fadeInterval = null;
//     }
//     this.isPlaying = false;
//     if (this.audioElement) {
//       this.audioElement.pause();
//       this.audioElement.currentTime = 0;
//     }
//     if (this.synthFallbackActive) {
//       spaceSynth.stop();
//       this.synthFallbackActive = false;
//     }
//   }

//   public setVolume(volume: number): void {
//     this.currentVolume = volume;
//     if (this.audioElement) {
//       this.audioElement.volume = Math.max(0, Math.min(1, volume));
//     }
//     if (this.synthFallbackActive) {
//       spaceSynth.setVolume(volume);
//     }
//   }

//   public getTrackId(): MusicTrackId | null {
//     return this.currentTrackId;
//   }

//   public getIsPlaying(): boolean {
//     return this.isPlaying;
//   }
// }

// export const musicController = new MusicController();

import { MusicTrackId } from "../types";
import { MUSIC_TRACKS } from "./musicTracks";
import { spaceSynth } from "./spaceSynthesizer";

class MusicController {
  private audioElement: HTMLAudioElement | null = null;
  private currentTrackId: MusicTrackId | null = null;
  private isPlaying: boolean = false;
  private currentVolume: number = 0.4;
  private synthFallbackActive: boolean = false;

  private fadeInterval: NodeJS.Timeout | null = null;

  public play(
    trackId: MusicTrackId,
    volume: number = 0.4,
    fadeInDuration: number = 4.0,
  ): void {
    this.currentTrackId = trackId;
    this.currentVolume = volume;
    this.isPlaying = true;

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const track = MUSIC_TRACKS[trackId];
    if (!track) return;

    // Stop synth fallback if running
    if (this.synthFallbackActive) {
      spaceSynth.stop();
      this.synthFallbackActive = false;
    }

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = "auto";

      this.audioElement.addEventListener("error", () => {
        // Fallback to web audio synthesizer if test MP3 URL fails to load or is offline
        if (this.isPlaying && this.currentTrackId) {
          const t = MUSIC_TRACKS[this.currentTrackId];
          if (t) {
            spaceSynth.start(t.synthPreset, this.currentVolume, fadeInDuration);
            this.synthFallbackActive = true;
          }
        }
      });
    }

    if (this.audioElement.src !== track.mp3Url) {
      this.audioElement.src = track.mp3Url;
    }

    const targetVol = Math.max(0, Math.min(1, volume));

    if (fadeInDuration > 0) {
      this.audioElement.volume = 0;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Smooth volume ramp up
            const steps = 30;
            const stepDuration = (fadeInDuration * 1000) / steps;
            let step = 0;
            this.fadeInterval = setInterval(() => {
              step++;
              const progress = Math.min(1, step / steps);
              if (this.audioElement && this.isPlaying) {
                this.audioElement.volume = targetVol * progress;
              }
              if (step >= steps || !this.isPlaying) {
                if (this.fadeInterval) {
                  clearInterval(this.fadeInterval);
                  this.fadeInterval = null;
                }
              }
            }, stepDuration);
          })
          .catch(() => {
            // Autoplay policy or fetch error -> trigger Web Audio synthesizer fallback gracefully
            if (this.isPlaying) {
              spaceSynth.start(track.synthPreset, volume, fadeInDuration);
              this.synthFallbackActive = true;
            }
          });
      }
    } else {
      this.audioElement.volume = targetVol;
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (this.isPlaying) {
            spaceSynth.start(track.synthPreset, volume, 0);
            this.synthFallbackActive = true;
          }
        });
      }
    }
  }

  public fadeOut(durationSeconds: number = 3.5, onComplete?: () => void): void {
    if (!this.isPlaying) {
      if (onComplete) onComplete();
      return;
    }

    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    if (this.synthFallbackActive) {
      spaceSynth.fadeOut(durationSeconds, () => {
        this.isPlaying = false;
        this.synthFallbackActive = false;
        if (onComplete) onComplete();
      });
      return;
    }

    if (!this.audioElement) {
      this.isPlaying = false;
      if (onComplete) onComplete();
      return;
    }

    const startVolume = this.audioElement.volume;
    const steps = 30;
    const stepDuration = (durationSeconds * 1000) / steps;
    let stepCount = 0;

    this.fadeInterval = setInterval(() => {
      stepCount++;
      const factor = Math.max(0, 1 - stepCount / steps);
      if (this.audioElement) {
        this.audioElement.volume = startVolume * factor;
      }

      if (stepCount >= steps) {
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        this.stop();
        if (onComplete) onComplete();
      }
    }, stepDuration);
  }

  public stop(): void {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.synthFallbackActive) {
      spaceSynth.stop();
      this.synthFallbackActive = false;
    }
  }

  public setVolume(volume: number): void {
    this.currentVolume = volume;
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
    if (this.synthFallbackActive) {
      spaceSynth.setVolume(volume);
    }
  }

  public getTrackId(): MusicTrackId | null {
    return this.currentTrackId;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const musicController = new MusicController();
