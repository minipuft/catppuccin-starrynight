/**
 * Visual Effects Type Definitions
 * 
 * Type definitions for the Advanced Visual Effects System.
 * Technical interfaces for music-synchronized visual effects.
 */

// =========================================================================
// CORE VISUAL EFFECTS TYPES
// =========================================================================

/**
 * Visual effects state representing the system's current visual condition
 */
export interface VisualEffectsState {
  /** Current visual intensity level (0-1) */
  visualIntensity: number;
  
  /** Animation scale factor (1.0 = normal, >1.0 = enhanced) */
  animationScale: number;
  
  /** Animation phase in radians (0 to 2π) */
  animationPhase: number;
  
  /** Color temperature in Kelvin (1000K-20000K) */
  colorTemperature: number;
  
  /** Animation fluidity level (0-1) */
  animationFluidityLevel: number;
  
  /** Timestamp of last beat effect event */
  lastBeatTime: number;
  
  /** Current BPM for rhythm synchronization */
  currentBPM: number;
}

/**
 * Configuration for visual effects behavior
 */
export interface VisualEffectsConfig {
  /** Sensitivity to animation response (0-1) */
  animationResponseSensitivity: number;
  
  /** Intensity of rhythm effects (0-1) */
  rhythmIntensity: number;
  
  /** Range for color temperature mapping */
  colorTemperatureRange: {
    min: number; // Minimum temperature in Kelvin
    max: number; // Maximum temperature in Kelvin
  };
  
  /** Whether advanced animation effects are enabled */
  enableAdvancedEffects: boolean;
  
  /** Whether atmospheric particles are enabled */
  atmosphericParticlesEnabled: boolean;
  
  /** Whether cinematic effects are enabled */
  cinematicEffectsEnabled: boolean;
}

/**
 * Performance metrics for visual effects
 */
export interface VisualEffectsMetrics {
  /** Total number of visual effects updates */
  visualUpdates: number;
  
  /** Number of animation scale events */
  animationScaleEvents: number;
  
  /** Number of animation cycles completed */
  animationCycles: number;
  
  /** Number of color temperature shifts */
  colorTemperatureShifts: number;
  
  /** Average frame time in milliseconds */
  averageFrameTime: number;
  
  /** Current memory usage in bytes */
  memoryUsage: number;
}

// =========================================================================
// RHYTHMIC ANIMATION TYPES
// =========================================================================

/**
 * Rhythmic element representing music-synchronized animation
 */
export interface RhythmicElement {
  /** Unique identifier for the element */
  id: string;
  
  /** DOM element representing the animated element */
  element: HTMLElement;
  
  /** Current animation phase offset */
  phaseOffset: number;
  
  /** Current animation intensity (0-1) */
  animationIntensity: number;
  
  /** Position on screen */
  position: {
    x: number;
    y: number;
  };
  
  /** Whether the element is actively animating */
  isAnimating: boolean;
}

/**
 * Atmospheric particle for cinematic depth
 */
export interface AtmosphericParticle {
  /** Unique identifier for the particle */
  id: string;
  
  /** DOM element representing the particle */
  element: HTMLElement;
  
  /** Current scale factor */
  scale: number;
  
  /** Current opacity level (0-1) */
  opacity: number;
  
  /** Position on screen */
  position: {
    x: number;
    y: number;
  };
  
  /** Velocity for particle movement */
  velocity: {
    x: number;
    y: number;
  };
  
  /** Whether the particle is active */
  isActive: boolean;
}

// =========================================================================
// LEGACY EVENT TYPES (DEPRECATED)
// =========================================================================

/**
 * @deprecated - Moved to backwards compatibility section
 * Beat visual effects event payload (deprecated)
 */
export interface LegacyBeatConsciousnessEvent {
  /** Beat intensity (0-1) */
  intensity: number;
  
  /** Current BPM */
  bpm?: number;
  
  /** Music energy level (0-1) */
  energy?: number;
  
  /** Timestamp of the beat event */
  timestamp?: number;
  
  /** Additional beat data */
  [key: string]: unknown;
}

/**
 * @deprecated - Moved to backwards compatibility section
 * Energy visual effects event payload (deprecated)
 */
export interface LegacyEnergyConsciousnessEvent {
  /** Energy level (0-1) */
  energy: number;
  
  /** Valence level (0-1) - pleasantness */
  valence?: number;
  
  /** Arousal level (0-1) - activation */
  arousal?: number;
  
  /** Timestamp of the energy event */
  timestamp?: number;
}

/**
 * @deprecated - Moved to backwards compatibility section
 * Emotional visual effects event payload (deprecated)
 */
export interface LegacyEmotionalConsciousnessEvent {
  /** Detected emotion type */
  emotion: string;
  
  /** Valence level (0-1) - pleasantness */
  valence: number;
  
  /** Energy level (0-1) - intensity */
  energy: number;
  
  /** Arousal level (0-1) - activation */
  arousal?: number;
  
  /** Confidence of emotion detection (0-1) */
  confidence?: number;
  
  /** Timestamp of the emotional event */
  timestamp?: number;
}

/**
 * @deprecated - Moved to backwards compatibility section
 * Tempo visual effects event payload (deprecated)
 */
export interface LegacyTempoConsciousnessEvent {
  /** Base BPM */
  bpm: number;
  
  /** Enhanced BPM with analysis */
  enhancedBPM?: number;
  
  /** Tempo classification */
  tempo?: 'slow' | 'medium' | 'fast';
  
  /** Timestamp of the tempo event */
  timestamp?: number;
}

// =========================================================================
// CINEMATIC EFFECTS TYPES
// =========================================================================

/**
 * Color temperature mapping for emotional visual effects
 */
export interface EmotionalColorTemperature {
  /** Temperature in Kelvin (1000K-20000K) */
  temperature: number;
  
  /** RGB color values derived from temperature */
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  
  /** Hex color representation */
  hex: string;
  
  /** Emotional association */
  emotion: string;
  
  /** Intensity of the color effect (0-1) */
  intensity: number;
}

/**
 * Cinematic effect configuration
 */
export interface CinematicEffectConfig {
  /** Blade Runner neon-noir effects */
  bladeRunnerEffects: {
    /** Atmospheric fog intensity (0-1) */
    atmosphericFog: number;
    
    /** Neon reflection intensity (0-1) */
    neonReflections: number;
    
    /** Layered overlay intensity (0-1) */
    layeredOverlay: number;
    
    /** Urban decay effect intensity (0-1) */
    urbanDecay: number;
  };
  
  /** Star Wars smooth-tech effects */
  starWarsEffects: {
    /** Lens flare intensity (0-1) */
    lensFlare: number;
    
    /** Material effects intensity (0-1) */
    materialEffects: number;
    
    /** Smooth curve intensity (0-1) */
    smoothCurves: number;
    
    /** Energy field intensity (0-1) */
    energyFields: number;
  };
}

// =========================================================================
// SYSTEM INTEGRATION TYPES
// =========================================================================

/**
 * Visual effects system configuration
 */
export interface VisualEffectsSystemConfig {
  /** System identifier */
  systemId: string;
  
  /** System name */
  systemName: string;
  
  /** Whether the system is enabled */
  enabled: boolean;
  
  /** Visual effects configuration */
  visualConfig: VisualEffectsConfig;
  
  /** Performance targets */
  performanceTargets: {
    /** Target frame rate */
    targetFPS: number;
    
    /** Maximum memory usage in MB */
    maxMemoryUsage: number;
    
    /** Maximum CPU usage percentage */
    maxCPUUsage: number;
  };
  
  /** Debug configuration */
  debug: {
    /** Whether debug mode is enabled */
    enabled: boolean;
    
    /** Debug log level */
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    
    /** Whether to show performance metrics */
    showMetrics: boolean;
  };
}

/**
 * Integration with Advanced System Architecture
 */
export interface AdvancedVisualIntegration {
  /** Whether integration is active */
  isActive: boolean;
  
  /** Integration version */
  version: string;
  
  /** Registered visual effects systems */
  registeredSystems: Map<string, VisualEffectsSystemConfig>;
  
  /** Shared event bus reference */
  eventBus: unknown;
  
  /** Shared performance analyzer reference */
  performanceAnalyzer: unknown;
  
  /** Shared CSS variable manager reference */
  cssVariableManager: unknown;
}

// =========================================================================
// LEGACY COMPATIBILITY TYPES
// =========================================================================

/**
 * Legacy beat sync compatibility interface
 * @deprecated Use VisualEffectsState instead
 */
export interface LegacyBeatSyncCompat {
  /** Legacy beat intensity */
  beatIntensity: number;
  
  /** Legacy BPM */
  bpm: number;
  
  /** Legacy energy level */
  energy: number;
  
  /** Legacy visual intensity */
  visualIntensity: number;
}

/**
 * Migration helper for converting legacy types
 */
export interface VisualEffectsMigration {
  /** Convert legacy beat sync to visual effects */
  convertLegacyBeatSync(legacy: LegacyBeatSyncCompat): VisualEffectsState;
  
  /** Convert legacy configuration to visual config */
  convertLegacyConfig(legacy: unknown): VisualEffectsConfig;
  
  /** Migrate legacy event handlers */
  migrateLegacyEventHandlers(legacy: unknown): void;
}

// =========================================================================
// MODERN EVENT DEFINITIONS (RECOMMENDED)
// =========================================================================

/**
 * Beat event for visual effects
 * @since v3.0.0 - Replaces BeatConsciousnessEvent
 */
export interface BeatEffectEvent {
  /** Beat timestamp */
  timestamp: number;
  
  /** Beat intensity (0-1) */
  intensity: number;
  
  /** Beat frequency in Hz */
  frequency: number;
  
  /** Expected next beat time */
  nextBeatTime?: number;
  
  /** Beat confidence level (0-1) */
  confidence: number;
}

/**
 * Energy event for visual effects
 * @since v3.0.0 - Replaces EnergyConsciousnessEvent
 */
export interface EnergyEffectEvent {
  /** Energy level (0-1) */
  energyLevel: number;
  
  /** Energy change rate */
  energyChangeRate: number;
  
  /** Energy type classification */
  energyType: 'low' | 'medium' | 'high' | 'extreme';
  
  /** Event timestamp */
  timestamp: number;
  
  /** Duration of energy change */
  duration: number;
}

/**
 * Emotional event for visual effects
 * @since v3.0.0 - Replaces EmotionalConsciousnessEvent
 */
export interface EmotionalEffectEvent {
  /** Emotional valence (-1 to 1, negative to positive) */
  valence: number;
  
  /** Emotional arousal (0-1, calm to excited) */
  arousal: number;
  
  /** Emotional category */
  category: 'calm' | 'happy' | 'sad' | 'excited' | 'angry' | 'neutral';
  
  /** Confidence in emotional detection (0-1) */
  confidence: number;
  
  /** Event timestamp */
  timestamp: number;
}

/**
 * Tempo event for visual effects
 * @since v3.0.0 - Replaces TempoConsciousnessEvent
 */
export interface TempoEffectEvent {
  /** Current BPM */
  bpm: number;
  
  /** Tempo change from previous */
  tempoChange: number;
  
  /** Tempo stability (0-1) */
  stability: number;
  
  /** Time signature */
  timeSignature: string;
  
  /** Event timestamp */
  timestamp: number;
}

// =========================================================================
// BACKWARDS COMPATIBILITY ALIASES (DEPRECATED)
// =========================================================================

/**
 * @deprecated Use VisualEffectsState instead
 * @since v1.0.0
 * 
 * Maintains backwards compatibility by mapping old property names to new ones
 */
export interface DynamicVisualEffectsState {
  /** @deprecated Use visualIntensity instead */
  smoothIntensity: number;
  
  /** @deprecated Use animationScale instead */
  animationScaleGrowth: number;
  
  /** @deprecated Use animationPhase instead */
  pulsingPhase: number;
  
  /** @deprecated Use colorTemperature instead */
  emotionalTemperature: number;
  
  /** @deprecated Use animationFluidityLevel instead */
  surfaceFluidityLevel: number;
  
  lastBeatTime: number;
  currentBPM: number;
}

/**
 * @deprecated Use VisualEffectsConfig instead
 * @since v1.0.0
 */
export interface DynamicVisualEffectsConfig {
  /** @deprecated Use animationResponseSensitivity instead */
  animationScaleResponseSensitivity: number;
  
  /** @deprecated Use rhythmIntensity instead */
  pulsingRhythmIntensity: number;
  
  /** @deprecated Use colorTemperatureRange instead */
  emotionalTemperatureRange: {
    min: number;
    max: number;
  };
  
  /** @deprecated Use animationTransitionSpeed instead */
  smoothTransitionSpeed: number;
  
  /** @deprecated Use enableAdvancedEffects instead */
  enableCellularGrowth: boolean;
}

/**
 * @deprecated Use VisualEffectsMetrics instead
 * @since v1.0.0
 */
export interface DynamicVisualEffectsMetrics {
  /** @deprecated Use animationCycles instead */
  pulsingCycles: number;
  
  /** @deprecated Use effectsPerSecond instead */
  animationScaleResponsesPerSecond: number;
  
  averageResponseTime: number;
  
  /** @deprecated Use effectsMemoryUsage instead */
  smoothMemoryUsage: number;
  
  lastPerformanceCheck: number;
}

// Event types maintain backwards compatibility with the legacy interfaces
/**
 * @deprecated Use BeatEffectEvent instead
 * @since v1.0.0
 */
export type BeatConsciousnessEvent = LegacyBeatConsciousnessEvent;

/**
 * @deprecated Use EnergyEffectEvent instead
 * @since v1.0.0
 */
export type EnergyConsciousnessEvent = LegacyEnergyConsciousnessEvent;

/**
 * @deprecated Use EmotionalEffectEvent instead
 * @since v1.0.0
 */
export type EmotionalConsciousnessEvent = LegacyEmotionalConsciousnessEvent;

/**
 * @deprecated Use TempoEffectEvent instead
 * @since v1.0.0
 */
export type TempoConsciousnessEvent = LegacyTempoConsciousnessEvent;

// =========================================================================
// INTERFACE COMPATIBILITY ALIASES
// =========================================================================

/**
 * @deprecated Use DynamicVisualEffectsState instead
 * @since v1.0.0
 */
export type SmoothVisualEffectsState = DynamicVisualEffectsState;

/**
 * @deprecated Use DynamicVisualEffectsState instead
 * @since v1.0.0
 */
export type OrganicConsciousnessState = DynamicVisualEffectsState;

/**
 * @deprecated Use DynamicVisualEffectsConfig instead  
 * @since v1.0.0
 */
export type SmoothVisualEffectsConfig = DynamicVisualEffectsConfig;

/**
 * @deprecated Use DynamicVisualEffectsConfig instead  
 * @since v1.0.0
 */
export type OrganicConsciousnessConfig = DynamicVisualEffectsConfig;

/**
 * @deprecated Use DynamicVisualEffectsMetrics instead
 * @since v1.0.0
 */
export type SmoothVisualEffectsMetrics = DynamicVisualEffectsMetrics;

/**
 * @deprecated Use DynamicVisualEffectsMetrics instead
 * @since v1.0.0
 */
export type OrganicConsciousnessMetrics = DynamicVisualEffectsMetrics;

// =========================================================================
// LEGACY YEAR 3000 COMPATIBILITY ALIASES
// =========================================================================

/**
 * @deprecated Use AdvancedVisualIntegration instead
 * @since v1.0.0
 */
export type Year3000VisualIntegration = AdvancedVisualIntegration;