/**
 * Consciousness Choreography Type Definitions
 * 
 * Type definitions for the Background Consciousness Choreographer system,
 * including event types, interfaces, and choreography patterns.
 * 
 * @architecture Phase 2.2 Background Consciousness Choreography
 * @philosophy Organic coordination through shared consciousness fields
 */

// Import base types for extension and re-export
import type { 
  ConsciousnessField,
  BackgroundSystemParticipant,
  ChoreographyEventType,
  OrganicTransitionConfig,
  Vector2D
} from '@/visual/consciousness/BackgroundConsciousnessChoreographer';

// Re-export core types for convenience
export type {
  ConsciousnessField,
  BackgroundSystemParticipant,
  ChoreographyEventType,
  OrganicTransitionConfig,
  Vector2D
};

// ===================================================================
// CHOREOGRAPHY EVENT PAYLOADS
// ===================================================================

/**
 * Rhythm shift event payload
 */
export interface RhythmShiftEventPayload {
  newRhythm: {
    bpm: number;
    timeSignature: number;
    intensity: number;
  };
  transitionType: 'organic' | 'immediate' | 'fadeOut' | 'breathe';
  duration?: number; // Transition duration in ms
}

/**
 * Emotional shift event payload
 */
export interface EmotionalShiftEventPayload {
  newTemperature: number; // Color temperature in Kelvin
  flowDirection: { x: number; y: number };
  emotionalIntensity: number; // 0-1
  mood: string; // Mood classification
  valence: number; // 0-1 sad to happy
  arousal: number; // 0-1 calm to exciting
}

/**
 * Energy surge event payload
 */
export interface EnergySurgeEventPayload {
  intensity: number; // 0-2 energy surge intensity
  affectedSystems: string[] | 'all';
  surgeType: 'beat' | 'bass' | 'treble' | 'harmonic' | 'full-spectrum';
  duration: number; // How long the surge lasts in ms
  falloffCurve: 'linear' | 'exponential' | 'organic' | 'harmonic';
}

/**
 * Breathing cycle event payload
 */
export interface BreathingCycleEventPayload {
  phase: number; // 0-1 current phase in breathing cycle
  intensity: number; // 0-1 breathing intensity
  cycleLength: number; // Total cycle length in seconds
  breathingPattern: 'regular' | 'deep' | 'excited' | 'meditative' | 'synchronized';
}

/**
 * Membrane fluid event payload
 */
export interface MembraneFluidEventPayload {
  fluidityIndex: number; // 0-1 how fluid the boundaries are
  affectedBoundaries: string[]; // Which system boundaries are affected
  fluidType: 'liquid' | 'gaseous' | 'plasma' | 'crystalline';
  viscosity: number; // 0-1 how thick/thin the fluid is
}

/**
 * Cellular growth event payload  
 */
export interface CellularGrowthEventPayload {
  growthRate: number; // 0.1-2.0 cellular growth multiplier
  targetSystems: string[] | 'all';
  growthPattern: 'uniform' | 'organic' | 'fractal' | 'spiral' | 'radial';
  nutrients: { // Growth factors
    energy: number;
    harmony: number;
    complexity: number;
  };
}

/**
 * Performance adaptation event payload
 */
export interface PerformanceAdaptEventPayload {
  newMode: {
    name: string;
    qualityLevel: number;
    frameRate: number;
    optimizationLevel: number;
  };
  adaptationType: 'organic' | 'immediate' | 'gradual';
  reason: 'thermal' | 'battery' | 'performance' | 'user' | 'automatic';
  affectedSystems: string[];
}

// ===================================================================
// CHOREOGRAPHY EVENT MAP
// ===================================================================

/**
 * Complete event payload type map for type-safe event handling
 */
export interface ChoreographyEventPayloadMap {
  'consciousness:field-updated': import('@/visual/consciousness/BackgroundConsciousnessChoreographer').ConsciousnessField;
  'choreography:rhythm-shift': RhythmShiftEventPayload;
  'choreography:emotional-shift': EmotionalShiftEventPayload;
  'choreography:energy-surge': EnergySurgeEventPayload;
  'consciousness:breathing-cycle': BreathingCycleEventPayload;
  'consciousness:membrane-fluid': MembraneFluidEventPayload;
  'consciousness:cellular-growth': CellularGrowthEventPayload;
  'consciousness:performance-adapt': PerformanceAdaptEventPayload;
}

// ===================================================================
// SYSTEM PARTICIPANT INTERFACES
// ===================================================================

/**
 * Enhanced background system participant with choreography-specific methods
 */
export interface EnhancedBackgroundSystemParticipant extends BackgroundSystemParticipant {
  // Choreography response capabilities
  supportsOrganicTransitions: boolean;
  supportedChoreographyEvents: (keyof ChoreographyEventPayloadMap)[];
  participantPriority: 'low' | 'normal' | 'high' | 'critical';
  
  // Extended choreography methods
  onRhythmShift?(payload: RhythmShiftEventPayload): void;
  onEmotionalShift?(payload: EmotionalShiftEventPayload): void;
  onEnergySurge?(payload: EnergySurgeEventPayload): void;
  onBreathingCycle?(payload: BreathingCycleEventPayload): void;
  onMembraneFluid?(payload: MembraneFluidEventPayload): void;
  onCellularGrowth?(payload: CellularGrowthEventPayload): void;
  onPerformanceAdapt?(payload: PerformanceAdaptEventPayload): void;
  
  // Contribution methods
  getMusicalContribution?(): {
    rhythmicResponse: number;
    harmonicContribution: number;
    energyAbsorption: number;
  };
  
  getVisualContribution?(): {
    luminosityContribution: number;
    chromaticInfluence: number;
    depthContribution: number;
  };
  
  getOrganicContribution?(): {
    breathingInfluence: number;
    membraneContribution: number;
    growthContribution: number;
  };
}

// ===================================================================
// CONSCIOUSNESS FIELD EXTENSIONS
// ===================================================================

/**
 * Extended consciousness field with system-specific sections
 */
export interface ExtendedConsciousnessField extends ConsciousnessField {
  // System-specific consciousness sections
  webglConsciousness: {
    shaderComplexity: number;
    textureResolution: number;
    renderingPipeline: 'forward' | 'deferred' | 'hybrid';
    gpuUtilization: number;
  };
  
  liquidConsciousness: {
    fluidDynamics: number;
    turbulenceLevel: number;
    viscosityIndex: number;
    flowPatterns: string[];
  };
  
  depthConsciousness: {
    layerCount: number;
    parallaxStrength: number;
    fogDensity: number;
    infinityPerception: number;
  };
  
  // Inter-system consciousness
  systemHarmony: {
    webglLiquidResonance: number;
    liquidDepthCoherence: number;
    depthWebglAlignment: number;
  };
}

// ===================================================================
// ORGANIC TRANSITION PATTERNS
// ===================================================================

/**
 * Organic transition pattern definitions
 */
export interface OrganicTransitionPattern {
  name: string;
  description: string;
  easingFunction: (t: number) => number;
  duration: number; // Base duration in ms
  intensityModifier: number; // How much the pattern responds to intensity
  biologicalInspiration: string; // What biological process this mimics
}

/**
 * Predefined organic transition patterns
 */
export const ORGANIC_TRANSITION_PATTERNS: { [key: string]: OrganicTransitionPattern } = {
  heartbeat: {
    name: 'heartbeat',
    description: 'Cardiac rhythm-inspired pulsing transitions',
    easingFunction: (t: number) => {
      // Double beat pattern like a heartbeat
      const phase = t * 2 * Math.PI;
      return (Math.sin(phase) + Math.sin(phase * 2) * 0.3 + 1) / 2;
    },
    duration: 800,
    intensityModifier: 1.2,
    biologicalInspiration: 'Cardiac rhythm and blood flow patterns'
  },
  
  breathing: {
    name: 'breathing',
    description: 'Respiratory cycle-inspired smooth transitions',
    easingFunction: (t: number) => {
      // Sine wave with longer exhale (like natural breathing)
      const phase = t * Math.PI;
      return t < 0.4 ? Math.sin(phase / 0.4) : Math.sin((phase - 0.4 * Math.PI) / 0.6) * 0.7;
    },
    duration: 3000,
    intensityModifier: 0.8,
    biologicalInspiration: 'Diaphragmatic breathing and oxygen exchange'
  },
  
  cellDivision: {
    name: 'cellDivision', 
    description: 'Mitotic cell division-inspired growth transitions',
    easingFunction: (t: number) => {
      // S-curve with acceleration phases like cell division
      if (t < 0.3) return t * t / 0.09; // Slow start (G1 phase)
      if (t < 0.7) return 0.1 + (t - 0.3) * 2.25; // Rapid growth (S phase)  
      return 0.1 + 0.9 + (t - 0.7) * 0.3 / 0.3; // Slow finish (G2 phase)
    },
    duration: 2000,
    intensityModifier: 1.5,
    biologicalInspiration: 'Cellular mitosis and organic growth patterns'
  },
  
  neuralFiring: {
    name: 'neuralFiring',
    description: 'Neural action potential-inspired rapid transitions',
    easingFunction: (t: number) => {
      // Sharp spike followed by gradual recovery like neuron firing
      if (t < 0.1) return t * 10; // Rapid depolarization
      if (t < 0.3) return 1 - (t - 0.1) * 2; // Repolarization  
      return Math.max(0, 0.6 - (t - 0.3) * 0.86); // Hyperpolarization recovery
    },
    duration: 400,
    intensityModifier: 2.0,
    biologicalInspiration: 'Neural action potentials and synaptic transmission'
  },
  
  plantGrowth: {
    name: 'plantGrowth',
    description: 'Phototropic plant growth-inspired organic transitions',
    easingFunction: (t: number) => {
      // Exponential growth curve with periodic growth spurts
      const baseGrowth = 1 - Math.exp(-t * 3);
      const growthSpurts = Math.sin(t * Math.PI * 4) * 0.1 * t;
      return Math.min(1, baseGrowth + growthSpurts);
    },
    duration: 4000,
    intensityModifier: 0.6,
    biologicalInspiration: 'Phototropism and circadian growth rhythms'
  }
};

// ===================================================================
// CONSCIOUSNESS FIELD ANALYSIS
// ===================================================================

/**
 * Consciousness field analyzer utilities
 */
export interface ConsciousnessFieldAnalysis {
  overallCoherence: number; // 0-1 how coherent the field is
  energyDistribution: {
    musical: number;
    visual: number; 
    organic: number;
    performance: number;
  };
  dominantCharacteristics: string[]; // Which aspects are most prominent
  stabilityIndex: number; // 0-1 how stable the field is over time
  evolutionTrend: 'growing' | 'stabilizing' | 'declining' | 'oscillating';
  harmonicResonances: { [systemName: string]: number }; // How well each system resonates
  organicHealth: {
    breathingRhythm: 'healthy' | 'shallow' | 'irregular' | 'synchronized';
    membraneIntegrity: 'intact' | 'permeable' | 'dissolved' | 'crystallized';
    cellularVitality: 'thriving' | 'stable' | 'declining' | 'dormant';
  };
}

// ===================================================================
// CHOREOGRAPHY PERFORMANCE METRICS
// ===================================================================

/**
 * Performance metrics for consciousness choreography
 */
export interface ChoreographyPerformanceMetrics {
  // Field update metrics
  fieldUpdateRate: number; // Updates per second
  averageFieldUpdateTime: number; // Average time to update field in ms
  fieldEvolutionRate: number; // How quickly the field evolves
  
  // Event coordination metrics  
  eventsPerSecond: number;
  eventProcessingTime: number; // Average time to process events in ms
  eventQueueLength: number; // Number of pending events
  
  // Participant coordination metrics
  participantCount: number;
  participantResponseTime: number; // Average response time to field updates
  participantCoherence: number; // 0-1 how well participants coordinate
  
  // Organic transition metrics
  transitionsPerSecond: number;
  averageTransitionDuration: number; // How long transitions take
  transitionSmoothness: number; // 0-1 how smooth transitions are
  biologicalAccuracy: number; // 0-1 how biologically-inspired transitions are
  
  // Resource utilization
  cpuUsage: number; // CPU usage percentage
  memoryUsage: number; // Memory usage in MB
  eventBusLoad: number; // Event bus utilization
  
  // Quality metrics
  visualHarmony: number; // 0-1 visual coherence across systems
  musicalSynchronization: number; // 0-1 how well systems sync to music
  organicRealism: number; // 0-1 how organic the behavior feels
  userPerceptionScore: number; // 0-1 estimated user satisfaction
}

// ===================================================================
// HELPER TYPES
// ===================================================================

/**
 * Consciousness field snapshot for debugging/analysis
 */
export interface ConsciousnessFieldSnapshot {
  timestamp: number;
  field: import('@/visual/consciousness/BackgroundConsciousnessChoreographer').ConsciousnessField;
  participants: string[];
  activeEvents: string[];
  performanceMetrics: Partial<ChoreographyPerformanceMetrics>;
  analysis: Partial<ConsciousnessFieldAnalysis>;
}

/**
 * Choreography configuration for different modes
 */
export interface ChoreographyModeConfig {
  mode: 'performance' | 'quality' | 'battery' | 'accessibility' | 'custom';
  fieldUpdateInterval: number; // ms between field updates
  transitionIntensity: number; // 0-2 transition intensity multiplier
  organicComplexity: number; // 0-1 how complex organic behaviors are
  eventProcessingPriority: 'immediate' | 'batched' | 'deferred';
  enabledTransitionPatterns: string[]; // Which organic patterns are enabled
  performanceThresholds: {
    maxCpuUsage: number;
    maxMemoryUsage: number;
    maxEventQueueLength: number;
  };
}