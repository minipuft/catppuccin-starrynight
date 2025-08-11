/**
 * Minimal stub types for organic consciousness color systems
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

export interface SymbioticListeningCore {
  processAudioData(data: any): void;
  getEmotionalState(): MusicEmotion;
  initialize?(): void;
  updateSymbioticResonance?(resonance: number): void;
  calculateResonance?(musicData: any): number;
  updateSymbioticEffects?(effects: any): void;
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
  private breathingEngine: BreathingRhythmEngine;
  private symbioticCore: SymbioticListeningCore;
  
  constructor() {
    this.breathingEngine = new StubBreathingEngine();
    this.symbioticCore = new StubSymbioticCore();
  }
  
  public getConsciousnessState(): any {
    return {
      cellularGrowthRate: 1.0,
      breathingCycle: 2.0,
      emotionalTemperature: 6000,
      membraneFluidityIndex: 0.5,
      symbioticResonance: 0.5,
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

class StubSymbioticCore implements SymbioticListeningCore {
  processAudioData(data: any): void { /* stub */ }
  getEmotionalState(): MusicEmotion { 
    return { intensity: 0.5, valence: 0.5, arousal: 0.5, energy: 0.5 };
  }
  initialize?(): void { /* stub */ }
  updateSymbioticResonance?(resonance: number): void { /* stub */ }
  calculateResonance?(musicData: any): number { return 0.5; }
  updateSymbioticEffects?(effects: any): void { /* stub */ }
}


// Export consolidated types for compatibility
export type { ColorValue as PaletteColor };
export type { CinematicPalette as GeneratedPalette };