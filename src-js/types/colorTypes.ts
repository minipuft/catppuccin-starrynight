/**
 * Minimal stub types for visual effects color systems
 * These replace the removed redundant color modules
 */

// =========================================================================
// COLOR TYPE STUBS
// =========================================================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface OKLAB {
  L: number;
  a: number;
  b: number;
}

export interface ColorValue {
  rgb: RGB;
  oklab: OKLAB;
  colorSpace: 'rgb' | 'oklab';
}

// =========================================================================
// AUDIO ANALYSIS INTERFACES
// =========================================================================

/**
 * Audio analysis data structure for music processing
 * @since v3.0.0 - Replaces generic 'any' audio data
 */
export interface AudioAnalysisData {
  /** Audio feature data from Spicetify */
  features?: {
    energy?: number;
    valence?: number;
    danceability?: number;
    acousticness?: number;
    instrumentalness?: number;
    speechiness?: number;
    tempo?: number;
  };
  
  /** Raw audio buffer data */
  audioBuffer?: {
    samples: Float32Array;
    sampleRate: number;
    channels: number;
    duration: number;
  };
  
  /** Frequency analysis data */
  frequencyData?: {
    lowFreq: number;    // 0-250 Hz
    midFreq: number;    // 250-4000 Hz  
    highFreq: number;   // 4000+ Hz
    amplitude: number;  // Overall amplitude
  };
  
  /** Beat detection data */
  beatData?: {
    detected: boolean;
    intensity: number;
    confidence: number;
    tempo: number;
  };
}

/**
 * Music metrics for synchronized visual effects
 * @since v3.0.0 - Replaces generic music data
 */
export interface MusicMetrics {
  /** Current energy level (0-1) */
  energy: number;
  
  /** Emotional valence (0-1, sad to happy) */
  valence: number;
  
  /** Beats per minute */
  bpm: number;
  
  /** Beat intensity for current frame (0-1) */
  beatIntensity: number;
  
  /** Rhythm phase in degrees (0-360) */
  rhythmPhase: number;
  
  /** Breathing scale factor (0.8-1.2) */
  pulsingScale: number;
}

/**
 * Visual effects state update structure
 * @since v3.0.0 - Replaces generic effects data
 */
export interface VisualEffectsState {
  /** Visual intensity level (0-1) */
  intensity: number;
  
  /** Color temperature in Kelvin */
  colorTemperature: number;
  
  /** Animation scale factor */
  animationScale: number;
  
  /** Current dominant emotion */
  dominantEmotion: string;
  
  /** Resonance strength (0-1) */
  resonance: number;
  
  // Legacy compatibility properties (non-optional for backward compatibility)
  /** @deprecated Use resonance instead */
  symbioticResonance: number;
  
  /** @deprecated Use animationScale instead */
  surfaceFluidityIndex: number;
  
  /** @deprecated Use intensity instead */
  animationScaleRate: number;
  
  /** @deprecated Use colorTemperature instead */
  emotionalTemperature: number;
  
  /** @deprecated Use animationScale instead */
  pulsingCycle: number;
  
  /** @deprecated Use intensity instead */
  cinematicIntensity: number;
}

// =========================================================================
// BIOLOGICAL CONSCIOUSNESS STUBS
// =========================================================================

export interface MusicEmotion {
  intensity: number;
  valence: number;
  arousal?: number;
  energy?: number;
  type?: string;        // For test compatibility
  confidence?: number;  // For test compatibility
}

export interface BeatData {
  strength: number;
  bpm?: number;
  tempo?: number;      // Alternative BPM property
  timestamp?: number;
  timing?: number;     // Beat timing property
  confidence?: number; // For test compatibility
  phase?: number;      // For test compatibility
}

export interface CinematicPalette {
  primary: RGB;
  secondary: RGB;
  accent: RGB;
  atmosphere: RGB;
  depth: RGB;
  highlight: RGB;
}

// =========================================================================
// CELLULAR STUBS
// =========================================================================


export interface BreathingRhythmEngine {
  updateBreathing(intensity: number): void;
  getBreathingPhase(): number;
  initialize?(): void;
  updateBreathingCycle?(cycle: number): void;
  calculateBreathingCycle?(bpm: number): number;
  adjustRhythm?(intensity: number): void;
  synchronizeWithBeat?(beatData: BeatData): void;
}

export interface PulsingRhythmEngine {
  updatePulsing(intensity: number): void;
  getPulsingPhase(): number;
  initialize?(): void;
  updatePulsingCycle?(cycle: number): void;
  calculatePulsingCycle?(bpm: number): number;
  adjustPulsingRhythm?(intensity: number): void;
  synchronizeWithBeat?(beatData: BeatData): void;
}

export interface SymbioticListeningCore {
  processAudioData(data: AudioAnalysisData): void;
  getEmotionalState(): MusicEmotion;
  initialize?(): void;
  updateSymbioticResonance?(resonance: number): void;
  calculateResonance?(musicData: AudioAnalysisData): number;
  updateSymbioticEffects?(effects: VisualEffectsState): void;
}

// =========================================================================
// STUB ENGINE CLASSES - Minimal implementations
// =========================================================================

export class ColorTransitionEngine {
  public transition(from: ColorValue, to: ColorValue, duration: number): Promise<void> {
    return Promise.resolve();
  }
  
  public setTransitionMode(mode: string): void {
    // Stub implementation
  }
}

export class CinematicPaletteGenerator {
  public generatePalette(emotion: MusicEmotion): CinematicPalette {
    // Return basic Catppuccin-based palette
    return {
      primary: { r: 203, g: 166, b: 247 }, // mauve
      secondary: { r: 137, g: 180, b: 250 }, // blue
      accent: { r: 148, g: 226, b: 213 }, // teal
      atmosphere: { r: 49, g: 50, b: 68 }, // surface0
      depth: { r: 30, g: 30, b: 46 }, // base
      highlight: { r: 249, g: 226, b: 175 } // yellow
    };
  }
}

export class VisualEffectsManager {
  private pulsingEngine: PulsingRhythmEngine;
  private symbioticCore: SymbioticListeningCore;
  
  constructor() {
    this.pulsingEngine = new StubPulsingEngine();
    this.symbioticCore = new StubSymbioticCore();
  }
  
  public getConsciousnessState(): VisualEffectsState {
    return {
      intensity: 0.5,
      colorTemperature: 6000,
      animationScale: 1.0,
      dominantEmotion: 'neutral',
      resonance: 0.5,
      // Legacy compatibility values
      symbioticResonance: 0.5,
      surfaceFluidityIndex: 0.5,
      animationScaleRate: 1.0,
      emotionalTemperature: 6000,
      pulsingCycle: 2.0,
      cinematicIntensity: 0.5
    };
  }
}

class StubBreathingEngine implements BreathingRhythmEngine {
  updateBreathing(intensity: number): void { /* stub */ }
  getBreathingPhase(): number { return 0.5; }
  initialize?(): void { /* stub */ }
  updateBreathingCycle?(cycle: number): void { /* stub */ }
  calculateBreathingCycle?(bpm: number): number { return 2.0; }
  adjustRhythm?(intensity: number): void { /* stub */ }
  synchronizeWithBeat?(beatData: BeatData): void { /* stub */ }
}

class StubPulsingEngine implements PulsingRhythmEngine {
  updatePulsing(intensity: number): void { /* stub */ }
  getPulsingPhase(): number { return 0.5; }
  initialize?(): void { /* stub */ }
  updatePulsingCycle?(cycle: number): void { /* stub */ }
  calculatePulsingCycle?(bpm: number): number { return 2.0; }
  adjustPulsingRhythm?(intensity: number): void { /* stub */ }
  synchronizeWithBeat?(beatData: BeatData): void { /* stub */ }
}

class StubSymbioticCore implements SymbioticListeningCore {
  processAudioData(data: AudioAnalysisData): void { /* stub */ }
  getEmotionalState(): MusicEmotion { 
    return { intensity: 0.5, valence: 0.5, arousal: 0.5, energy: 0.5 };
  }
  initialize?(): void { /* stub */ }
  updateSymbioticResonance?(resonance: number): void { /* stub */ }
  calculateResonance?(musicData: AudioAnalysisData): number { return 0.5; }
  updateSymbioticEffects?(effects: VisualEffectsState): void { /* stub */ }
}


// Export consolidated types for compatibility
export type { ColorValue as PaletteColor };
export type { CinematicPalette as GeneratedPalette };