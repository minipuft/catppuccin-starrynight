// ===================================================================
// 🎯 ADVANCED SYSTEM SHARED TYPE DEFINITIONS
// ===================================================================
// Centralized type definitions for the Advanced system architecture.
// All shared interfaces and types used across multiple modules.

// Represents the structure for a single color harmony rule.
export interface ColorHarmonyMode {
  rule:
    | "analogous"
    | "triadic"
    | "complementary"
    | "tetradic"
    | "split-complementary"
    | "monochromatic";
  angle: number;
  description: string;
}

// A map of all available color harmony modes.
export interface ColorHarmonyModes {
  [key: string]: ColorHarmonyMode;
}

/**
 * @deprecated Use ColorHarmonyMode instead
 * @since v1.0.0
 */
export type HarmonicMode = ColorHarmonyMode;

/**
 * @deprecated Use ColorHarmonyModes instead
 * @since v1.0.0
 */
export type HarmonicModes = ColorHarmonyModes;

// Defines the performance profile for an artistic mode.
export interface PerformanceProfile {
  maxParticles: number;
  animationThrottle: number; // ms
  enableGPUAcceleration: boolean;
  reducedMotion: boolean;
}

// Defines the feature set for an artistic mode.
export interface FeatureProfile {
  rippleEffects: boolean;
  timeBasedEcho?: boolean;
  particleStreams: boolean;
  predictiveHighlights: boolean;
  glassEffects: boolean;
  beatSync: boolean;
  colorHarmony: boolean;
  userInteractions: boolean;
  timeBasedEffects?: boolean; // Optional for advanced-maximum
  blur?: string;
  transition?: string;
  
  // Legacy property aliases for backward compatibility
  /** @deprecated Use userInteractions instead */
  aestheticGravity?: boolean;
  /** @deprecated Use timeBasedEffects instead */
  timeBasedPlay?: boolean;
}

// Defines the parameter multipliers for an artistic mode.
export interface MultiplierProfile {
  opacity: number;
  saturation: number;
  brightness: number;
  contrast: number;
  musicEnergyBoost: number;
  animationIntensity: number;
  timeBasedEffectFactor: number;
  interactionStrength: number;
  
  advancedAnimations: boolean;
  visualIntensityBase: number;
  
  // Legacy property aliases for backward compatibility
  /** @deprecated Use animationIntensity instead */
  kineticIntensity?: number;
  /** @deprecated Use timeBasedEffectFactor instead */ 
  timeBasedPlayFactor?: number;
  /** @deprecated Use interactionStrength instead */
  aestheticGravityStrength?: number;
  /** @deprecated Use advancedAnimations instead */
  emergentChoreography?: boolean;
}

// Defines the complete profile for a single artistic mode.
export interface ArtisticModeProfile {
  displayName: string;
  description: string;
  philosophy: string;
  multipliers: MultiplierProfile;
  features: FeatureProfile;
  performance: PerformanceProfile;
}

// A map of all available artistic mode profiles.
export interface ArtisticModeProfiles {
  [key: string]: ArtisticModeProfile;
}

// A type alias for the available artistic modes.
export type ArtisticMode =
  | "corporate-safe"
  | "artist-vision"
  | "advanced-maximum"
  | "cosmic-maximum"; // Legacy compatibility

/**
 * @deprecated Use advanced-maximum instead
 * @since v1.0.0
 */
export type LegacyCosmicMaximum = "cosmic-maximum";

// Palette system types for aesthetic switching
export type PaletteSystem = 'catppuccin' | 'year3000';

// Core theme type definitions for type-safe settings
export type CatppuccinFlavor = "mocha" | "latte" | "frappe" | "macchiato";
export type AccentColor = 
  | "rosewater" | "flamingo" | "pink" | "mauve" | "red" | "maroon"
  | "peach" | "yellow" | "green" | "teal" | "sky" | "sapphire" 
  | "blue" | "lavender" | "text" | "none";
export type BrightnessMode = "bright" | "balanced" | "dark";
export type IntensityLevel = "disabled" | "minimal" | "balanced" | "intense";
export type QualityLevel = "auto" | "low" | "high";
export type WebGLQuality = "low" | "medium" | "high";

// The main configuration object for the Advanced system architecture.
export interface AdvancedSystemConfig {
  [key: string]: any; // Index signature for dynamic access
  enableDebug: boolean;
  enableContextualIntelligence: boolean;
  paletteSystem: PaletteSystem;
  logging: {
    level: "off" | "error" | "warn" | "info" | "debug" | "verbose";
    performance: {
      enableFrameBudgetWarnings: boolean;
      throttleWarnings: boolean;
      throttleInterval: number;
      enableAdaptiveDegradation: boolean;
    };
  };
  healthCheckInterval?: number;
  visual?: {
    [key: string]: {
      mode: string;
    };
  };
  enableColorExtraction: boolean;
  enableMusicAnalysis: boolean;
  enableAdvancedSync: boolean;
  musicModulationIntensity: number;
  artisticMode: ArtisticMode;
  boundGetCurrentMultipliers: (() => MultiplierProfile) | null;
  boundGetCurrentFeatures: (() => FeatureProfile) | null;
  boundGetCurrentPerformanceSettings: (() => PerformanceProfile) | null;
  _pendingArtisticMode: ArtisticMode | null;
  init(): AdvancedSystemConfig;
  currentColorHarmonyMode: string;
  colorHarmonyBaseColor: string | null;
  colorHarmonyIntensity: number;
  colorHarmonyEvolution: boolean;
  musicVisualSync: any; // Can be typed more strictly if needed
  getCurrentModeProfile(): ArtisticModeProfile;
  getCurrentMultipliers(): MultiplierProfile;
  getCurrentFeatures(): FeatureProfile;
  getCurrentPerformanceSettings(): PerformanceProfile;
  isFullyInitialized(): boolean;
  safeSetArtisticMode(mode: ArtisticMode): boolean;
  setArtisticMode(mode: ArtisticMode): boolean;
  setLoggingLevel(
    level: "off" | "error" | "warn" | "info" | "debug" | "verbose"
  ): boolean;
  disablePerformanceWarnings(): void;
  enablePerformanceWarnings(): void;
  setPerformanceWarningThrottle(intervalMs: number): boolean;
  setupForProduction(): void;
  setupForDevelopment(): void;
  setupForDebugging(): void;
  validateConfigHealth(): any;
  loadArtisticPreference(): void;
}

/**
 * @deprecated Use AdvancedSystemConfig instead
 * @since v1.0.0
 */
export interface Year3000Config extends AdvancedSystemConfig {
  // Legacy property aliases for backward compatibility
  /** @deprecated Use enableAdvancedSync instead */
  enableCosmicSync?: boolean;
  /** @deprecated Use currentColorHarmonyMode instead */
  currentHarmonicMode?: string;
  /** @deprecated Use colorHarmonyBaseColor instead */
  harmonicBaseColor?: string | null;
  /** @deprecated Use colorHarmonyIntensity instead */
  harmonicIntensity?: number;
  /** @deprecated Use colorHarmonyEvolution instead */
  harmonicEvolution?: boolean;
  
  init(): Year3000Config;
}
