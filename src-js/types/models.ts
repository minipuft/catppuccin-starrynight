// ===================================================================
// 🎯 YEAR 3000 SHARED TYPE DEFINITIONS
// ===================================================================
// Centralized type definitions for the Year 3000 system.
// All shared interfaces and types used across multiple modules.

// Represents the structure for a single harmonic rule.
export interface HarmonicMode {
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

// A map of all available harmonic modes.
export interface HarmonicModes {
  [key: string]: HarmonicMode;
}

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
  temporalEcho: boolean;
  particleStreams: boolean;
  predictiveHighlights: boolean;
  glassEffects: boolean;
  beatSync: boolean;
  colorHarmony: boolean;
  aestheticGravity: boolean;
  temporalPlay?: boolean; // Optional for cosmic-maximum
  blur?: string;
  transition?: string;
}

// Defines the parameter multipliers for an artistic mode.
export interface MultiplierProfile {
  opacity: number;
  saturation: number;
  brightness: number;
  contrast: number;
  musicEnergyBoost: number;
  kineticIntensity: number;
  temporalPlayFactor: number;
  aestheticGravityStrength: number;
  emergentChoreography: boolean;
  visualIntensityBase: number;
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
  | "cosmic-maximum";

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

// The main configuration object for the Year 3000 system.
export interface Year3000Config {
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
  enableCosmicSync: boolean;
  musicModulationIntensity: number;
  artisticMode: ArtisticMode;
  boundGetCurrentMultipliers: (() => MultiplierProfile) | null;
  boundGetCurrentFeatures: (() => FeatureProfile) | null;
  boundGetCurrentPerformanceSettings: (() => PerformanceProfile) | null;
  _pendingArtisticMode: ArtisticMode | null;
  init(): Year3000Config;
  currentHarmonicMode: string;
  harmonicBaseColor: string | null;
  harmonicIntensity: number;
  harmonicEvolution: boolean;
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
  validateConfigHealth(): any; // Can be typed more strictly
  loadArtisticPreference(): void;
}
