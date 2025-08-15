import type { ColorHarmonyMode, ColorHarmonyModes, HarmonicMode, HarmonicModes } from "@/types/models";

/**
 * Color harmony configurations for musical synchronization
 * Defines how colors relate to each other in gradient flows
 */

export const COLOR_HARMONY_MODES: ColorHarmonyModes = {
  "analogous-flow": {
    rule: "analogous",
    angle: 30,
    description: "Flowing cinematic gradients with adjacent hues",
  },
  "triadic-trinity": {
    rule: "triadic", 
    angle: 120,
    description: "Dramatic three-color gradient dynamics",
  },
  "complementary-yin-yang": {
    rule: "complementary",
    angle: 180,
    description: "Electric contrast gradients with opposing forces",
  },
  "tetradic-advanced-cross": {
    rule: "tetradic",
    angle: 90, 
    description: "Complex four-color gradient matrix",
  },
  "split-complementary-spectrum": {
    rule: "split-complementary",
    angle: 150,
    description: "Spectrum-like gradient flows with polar contrasts", 
  },
  "monochromatic-calm": {
    rule: "monochromatic",
    angle: 0,
    description: "Intense single-hue gradient depth",
  },
};

/**
 * Default color harmony settings
 */
export const COLOR_HARMONY_DEFAULTS = {
  mode: "analogous-flow" as keyof typeof COLOR_HARMONY_MODES,
  baseColor: null,
  intensity: 0.85,
  evolution: true,
} as const;

/**
 * Music-to-visual synchronization scaling factors
 */
export const MUSIC_VISUAL_SYNC = {
  energyScaling: {
    low: 0.8,      // Enhanced low energy for subtle gradients
    medium: 1.2,   // Increased medium energy for dynamic gradients  
    high: 1.8,     // Maximum high energy for intense gradient flows
  },
  valenceScaling: {
    sad: 1.0,      // Enhanced sad scaling for dramatic gradients
    neutral: 1.2,  // Increased neutral for balanced gradients
    happy: 1.6,    // Maximum happy scaling for vibrant gradients
  },
  danceabilityEffects: {
    enable: true,
    animationSpeedMultiplier: 1.5,
    blurVariation: 0.3,
  },
} as const;

/**
 * Enhanced BPM calculation parameters
 * Inspired by Cat Jam extension for realistic tempo handling
 */
export const ENHANCED_BPM_CONFIG = {
  enable: true,
  useSmartCalculation: true,
  useRealisticData: true,
  
  // Tempo-based danceability estimation ranges
  danceabilityEstimation: {
    highDance: { min: 120, max: 140, value: 0.8 },    // House/Dance music
    mediumDance: { min: 100, max: 160, value: 0.6 },  // Pop/Electronic
    lowMediumDance: { min: 80, max: 180, value: 0.4 }, // General music
    lowDance: { value: 0.2 },                         // Very slow/fast
  },
  
  // Energy estimation from tempo + loudness  
  energyEstimation: {
    tempoWeight: 0.6,
    loudnessWeight: 0.4,
    tempoRange: { min: 60, max: 180 },
    loudnessRange: { min: -60, max: 0 },
  },
  
  // Enhanced BPM calculation parameters
  danceabilityThresholds: {
    high: 0.7,  // High danceability - use full tempo
    low: 0.3,   // Low danceability - may reduce tempo
  },
  
  energyMultiplierRange: {
    min: 0.8,   // Minimum energy multiplier
    max: 1.4,   // Maximum energy multiplier  
  },
  
  tempoMultipliers: {
    highDance: 1.0,   // Full tempo for danceable tracks
    mediumDance: 0.75, // Moderate reduction
    lowDance: 0.5,     // Significant reduction for smooth visuals
  },
  
  // Fallback values when audio data is unavailable
  fallbacks: {
    tempo: 120,
    loudness: -10,
    danceability: 0.5,
    energy: 0.5,
    key: 0,
    timeSignature: 4,
  },
} as const;

/**
 * Get color harmony mode configuration by key
 */
export function getColorHarmonyMode(key: string): ColorHarmonyMode | null {
  return COLOR_HARMONY_MODES[key as keyof typeof COLOR_HARMONY_MODES] || null;
}

/**
 * Get all available color harmony mode keys
 */
export function getColorHarmonyModeKeys(): string[] {
  return Object.keys(COLOR_HARMONY_MODES);
}

/**
 * Validate color harmony mode key
 */
export function isValidColorHarmonyMode(key: string | number): key is keyof typeof COLOR_HARMONY_MODES {
  return key in COLOR_HARMONY_MODES;
}

/**
 * Calculate color angle based on color harmony rule and base color
 */
export function calculateColorHarmonyAngle(mode: ColorHarmonyMode, baseHue: number): number[] {
  switch (mode.rule) {
    case "analogous":
      return [baseHue, baseHue + mode.angle, baseHue - mode.angle];
    case "complementary":
      return [baseHue, baseHue + mode.angle];
    case "triadic":
      return [baseHue, baseHue + mode.angle, baseHue + (mode.angle * 2)];
    case "tetradic":
      return [baseHue, baseHue + mode.angle, baseHue + (mode.angle * 2), baseHue + (mode.angle * 3)];
    case "split-complementary":
      return [baseHue, baseHue + mode.angle, baseHue - mode.angle];
    case "monochromatic":
      return [baseHue];
    default:
      return [baseHue];
  }
}

/**
 * Get energy-based color intensity multiplier
 */
export function getEnergyColorMultiplier(energy: number, valence: number): number {
  const energyFactor = energy <= 0.3 ? MUSIC_VISUAL_SYNC.energyScaling.low :
                      energy <= 0.7 ? MUSIC_VISUAL_SYNC.energyScaling.medium :
                      MUSIC_VISUAL_SYNC.energyScaling.high;
                      
  const valenceFactor = valence <= 0.3 ? MUSIC_VISUAL_SYNC.valenceScaling.sad :
                       valence <= 0.7 ? MUSIC_VISUAL_SYNC.valenceScaling.neutral :
                       MUSIC_VISUAL_SYNC.valenceScaling.happy;
                       
  return energyFactor * valenceFactor;
}

// =========================================================================
// BACKWARD COMPATIBILITY ALIASES
// =========================================================================

/**
 * @deprecated Use COLOR_HARMONY_MODES instead
 * @since v1.0.0
 */
export const HARMONIC_MODES: HarmonicModes = {
  ...COLOR_HARMONY_MODES,
  // Legacy key mappings
  "tetradic-cosmic-cross": COLOR_HARMONY_MODES["tetradic-advanced-cross"]!,
  "split-complementary-aurora": COLOR_HARMONY_MODES["split-complementary-spectrum"]!,
  "monochromatic-meditation": COLOR_HARMONY_MODES["monochromatic-calm"]!,
};

/**
 * @deprecated Use COLOR_HARMONY_DEFAULTS instead
 * @since v1.0.0
 */
export const HARMONIC_DEFAULTS = COLOR_HARMONY_DEFAULTS;

/**
 * @deprecated Use getColorHarmonyMode instead
 * @since v1.0.0
 */
export function getHarmonicMode(key: string): HarmonicMode | null {
  return getColorHarmonyMode(key);
}

/**
 * @deprecated Use getColorHarmonyModeKeys instead
 * @since v1.0.0
 */
export function getHarmonicModeKeys(): string[] {
  return getColorHarmonyModeKeys();
}

/**
 * @deprecated Use isValidColorHarmonyMode instead
 * @since v1.0.0
 */
export function isValidHarmonicMode(key: string | number): key is keyof typeof HARMONIC_MODES {
  return isValidColorHarmonyMode(key);
}

/**
 * @deprecated Use calculateColorHarmonyAngle instead
 * @since v1.0.0
 */
export function calculateHarmonicAngle(mode: HarmonicMode, baseHue: number): number[] {
  return calculateColorHarmonyAngle(mode, baseHue);
}