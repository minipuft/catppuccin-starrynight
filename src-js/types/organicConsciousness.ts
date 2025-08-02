/**
 * Organic Consciousness Type Definitions
 * 
 * Type definitions for the Year 3000 Organic Consciousness System.
 * Replaces mechanical BeatSync types with organic, cellular consciousness patterns.
 */

// =========================================================================
// CORE ORGANIC CONSCIOUSNESS TYPES
// =========================================================================

/**
 * Organic consciousness state representing the living system's current condition
 */
export interface OrganicConsciousnessState {
  /** Current organic intensity level (0-1) */
  organicIntensity: number;
  
  /** Cellular growth scale factor (1.0 = normal, >1.0 = growth) */
  cellularGrowth: number;
  
  /** Breathing phase in radians (0 to 2π) */
  breathingPhase: number;
  
  /** Emotional temperature in Kelvin (1000K-20000K) */
  emotionalTemperature: number;
  
  /** Membrane fluidity level (0-1) */
  membraneFluidityLevel: number;
  
  /** Timestamp of last beat consciousness event */
  lastBeatTime: number;
  
  /** Current BPM for breathing rhythm synchronization */
  currentBPM: number;
}

/**
 * Configuration for organic consciousness behavior
 */
export interface OrganicConsciousnessConfig {
  /** Sensitivity to cellular response (0-1) */
  cellularResponseSensitivity: number;
  
  /** Intensity of breathing rhythm effects (0-1) */
  breathingRhythmIntensity: number;
  
  /** Range for emotional temperature mapping */
  emotionalTemperatureRange: {
    min: number; // Minimum temperature in Kelvin
    max: number; // Maximum temperature in Kelvin
  };
  
  /** Whether membrane fluidity effects are enabled */
  membraneFluidityEnabled: boolean;
  
  /** Whether atmospheric particles are enabled */
  atmosphericParticlesEnabled: boolean;
  
  /** Whether cinematic effects are enabled */
  cinematicEffectsEnabled: boolean;
}

/**
 * Performance metrics for organic consciousness
 */
export interface OrganicConsciousnessMetrics {
  /** Total number of organic consciousness updates */
  organicUpdates: number;
  
  /** Number of cellular growth events */
  cellularGrowthEvents: number;
  
  /** Number of breathing cycles completed */
  breathingCycles: number;
  
  /** Number of emotional temperature shifts */
  emotionalShifts: number;
  
  /** Average frame time in milliseconds */
  averageFrameTime: number;
  
  /** Current memory usage in bytes */
  memoryUsage: number;
}

// =========================================================================
// CELLULAR CONSCIOUSNESS TYPES
// =========================================================================


/**
 * Breathing organism representing rhythmic consciousness
 */
export interface BreathingOrganism {
  /** Unique identifier for the organism */
  id: string;
  
  /** DOM element representing the organism */
  element: HTMLElement;
  
  /** Current breathing phase offset */
  phaseOffset: number;
  
  /** Current breathing intensity (0-1) */
  breathingIntensity: number;
  
  /** Position on screen */
  position: {
    x: number;
    y: number;
  };
  
  /** Whether the organism is actively breathing */
  isBreathing: boolean;
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
// CONSCIOUSNESS EVENT TYPES
// =========================================================================

/**
 * Beat consciousness event payload
 */
export interface BeatConsciousnessEvent {
  /** Beat intensity (0-1) */
  intensity: number;
  
  /** Current BPM */
  bpm?: number;
  
  /** Music energy level (0-1) */
  energy?: number;
  
  /** Timestamp of the beat event */
  timestamp?: number;
  
  /** Additional beat data */
  [key: string]: any;
}

/**
 * Energy consciousness event payload
 */
export interface EnergyConsciousnessEvent {
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
 * Emotional consciousness event payload
 */
export interface EmotionalConsciousnessEvent {
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
 * Tempo consciousness event payload
 */
export interface TempoConsciousnessEvent {
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
// CINEMATIC CONSCIOUSNESS TYPES
// =========================================================================

/**
 * Color temperature mapping for emotional consciousness
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
    
    /** Holographic overlay intensity (0-1) */
    holographicOverlay: number;
    
    /** Urban decay effect intensity (0-1) */
    urbanDecay: number;
  };
  
  /** Star Wars organic-tech effects */
  starWarsEffects: {
    /** Lens flare intensity (0-1) */
    lensFlare: number;
    
    /** Material consciousness intensity (0-1) */
    materialConsciousness: number;
    
    /** Organic curve intensity (0-1) */
    organicCurves: number;
    
    /** Energy field intensity (0-1) */
    energyFields: number;
  };
}

// =========================================================================
// SYSTEM INTEGRATION TYPES
// =========================================================================

/**
 * Organic consciousness system configuration
 */
export interface OrganicConsciousnessSystemConfig {
  /** System identifier */
  systemId: string;
  
  /** System name */
  systemName: string;
  
  /** Whether the system is enabled */
  enabled: boolean;
  
  /** Organic consciousness configuration */
  organicConfig: OrganicConsciousnessConfig;
  
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
 * Integration with Year 3000 System
 */
export interface Year3000OrganicIntegration {
  /** Whether integration is active */
  isActive: boolean;
  
  /** Integration version */
  version: string;
  
  /** Registered organic consciousness systems */
  registeredSystems: Map<string, OrganicConsciousnessSystemConfig>;
  
  /** Shared event bus reference */
  eventBus: any;
  
  /** Shared performance analyzer reference */
  performanceAnalyzer: any;
  
  /** Shared CSS variable manager reference */
  cssVariableManager: any;
}

// =========================================================================
// LEGACY COMPATIBILITY TYPES
// =========================================================================

/**
 * Legacy beat sync compatibility interface
 * @deprecated Use OrganicConsciousnessState instead
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
export interface OrganicConsciousnessMigration {
  /** Convert legacy beat sync to organic consciousness */
  convertLegacyBeatSync(legacy: LegacyBeatSyncCompat): OrganicConsciousnessState;
  
  /** Convert legacy configuration to organic config */
  convertLegacyConfig(legacy: any): OrganicConsciousnessConfig;
  
  /** Migrate legacy event handlers */
  migrateLegacyEventHandlers(legacy: any): void;
}