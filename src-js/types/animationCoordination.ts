/**
 * Animation Coordination Type Definitions
 * 
 * Type definitions for the Background Animation Coordinator system,
 * including event types, interfaces, and coordination patterns.
 * 
 * @architecture Phase 2.2 Background Animation Coordination
 * @philosophy Technical coordination through shared visual effect state
 */

// Import base types for extension and re-export
import type { 
  VisualEffectState,
  BackgroundSystemParticipant,
  Vector2D
} from '@/visual/effects/VisualEffectsCoordinator';

// Define choreography event types locally since they may not exist yet
export type ChoreographyEventType = 'rhythm-shift' | 'intensity-peak' | 'genre-transition' | 'emotional-shift';
export type DynamicTransitionConfig = {
  duration: number;
  easing: 'smooth' | 'harmonic' | 'exponential' | 'cubic';
  intensity: number;
};


// Re-export core types for convenience
export type {
  VisualEffectState,
  BackgroundSystemParticipant,
  Vector2D
};

// Modern API - use VisualEffectState directly
// Legacy alias moved to backwards compatibility section below

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
  transitionType: 'smooth' | 'immediate' | 'fadeOut' | 'pulsing';
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
  falloffCurve: 'linear' | 'exponential' | 'smooth' | 'harmonic';
}

/**
 * Animation cycle event payload
 */
export interface AnimationCycleEventPayload {
  phase: number; // 0-1 current phase in animation cycle
  intensity: number; // 0-1 animation intensity
  cycleLength: number; // Total cycle length in seconds
  animationPattern: 'regular' | 'deep' | 'excited' | 'calm' | 'synchronized';
}

/**
 * Surface fluid event payload
 */
export interface FluidMotionEventPayload {
  fluidityIndex: number; // 0-1 how fluid the boundaries are
  affectedBoundaries: string[]; // Which system boundaries are affected
  fluidType: 'liquid' | 'gaseous' | 'plasma' | 'crystalline';
  viscosity: number; // 0-1 how thick/thin the fluid is
}

/**
 * Scale change event payload  
 */
export interface ScaleChangeEventPayload {
  growthRate: number; // 0.1-2.0 scale change multiplier
  targetSystems: string[] | 'all';
  scalePattern: 'uniform' | 'smooth' | 'fractal' | 'spiral' | 'radial';
  scalingFactors: { // Scale factors
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
  adaptationType: 'smooth' | 'immediate' | 'gradual';
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
  'visual-effects:state-updated': VisualEffectState;
  'choreography:rhythm-shift': RhythmShiftEventPayload;
  'choreography:emotional-shift': EmotionalShiftEventPayload;
  'choreography:energy-surge': EnergySurgeEventPayload;
  'visual-effects:animation-cycle': AnimationCycleEventPayload;
  'visual-effects:fluid-motion': FluidMotionEventPayload;
  'visual-effects:scale-change': ScaleChangeEventPayload;
  'visual-effects:performance-adapt': PerformanceAdaptEventPayload;
}

// ===================================================================
// SYSTEM PARTICIPANT INTERFACES
// ===================================================================

/**
 * Enhanced background system participant with choreography-specific methods
 */
export interface EnhancedBackgroundSystemParticipant extends BackgroundSystemParticipant {
  // Choreography response capabilities
  supportsSmoothTransitions: boolean;
  supportedChoreographyEvents: (keyof ChoreographyEventPayloadMap)[];
  participantPriority: 'low' | 'normal' | 'high' | 'critical';
  
  // Extended choreography methods
  onRhythmShift?(payload: RhythmShiftEventPayload): void;
  onEmotionalShift?(payload: EmotionalShiftEventPayload): void;
  onEnergySurge?(payload: EnergySurgeEventPayload): void;
  onAnimationCycle?(payload: AnimationCycleEventPayload): void;
  onFluidMotion?(payload: FluidMotionEventPayload): void;
  onScaleChange?(payload: ScaleChangeEventPayload): void;
  onPerformanceAdapt?(payload: PerformanceAdaptEventPayload): void;
  
  // Contribution methods
  getMusicalContribution?(): {
    rhythmicResponse: number;
    harmonicContribution: number;
    energyAbsorption: number;
  };
  
  getVisualContribution(): Partial<VisualEffectState>;
  
  getSmoothContribution?(): {
    pulsingInfluence: number;
    surfaceContribution: number;
    scaleContribution: number;
  };
}

// ===================================================================
// CONSCIOUSNESS FIELD EXTENSIONS
// ===================================================================


// ===================================================================
// ORGANIC TRANSITION PATTERNS
// ===================================================================

// Legacy interface removed - use AnimationTransitionPattern instead

/**
 * Predefined animation transition patterns
 */
export const ANIMATION_TRANSITION_PATTERNS: { [key: string]: AnimationTransitionPattern } = {
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
    visualInspiration: 'Cardiac rhythm and blood flow patterns'
  },
  
  pulsing: {
    name: 'pulsing',
    description: 'Rhythmic cycle-inspired smooth transitions',
    easingFunction: (t: number) => {
      // Sine wave with longer exhale (like natural pulsing)
      const phase = t * Math.PI;
      return t < 0.4 ? Math.sin(phase / 0.4) : Math.sin((phase - 0.4 * Math.PI) / 0.6) * 0.7;
    },
    duration: 3000,
    intensityModifier: 0.8,
    visualInspiration: 'Rhythmic pulsing and smooth oscillation'
  },
  
  animationScale: {
    name: 'animationScale', 
    description: 'Progressive scaling-inspired growth transitions',
    easingFunction: (t: number) => {
      // S-curve with acceleration phases like animation scaling
      if (t < 0.3) return t * t / 0.09; // Slow start (setup phase)
      if (t < 0.7) return 0.1 + (t - 0.3) * 2.25; // Rapid growth (scaling phase)  
      return 0.1 + 0.9 + (t - 0.7) * 0.3 / 0.3; // Slow finish (completion phase)
    },
    duration: 2000,
    intensityModifier: 1.5,
    visualInspiration: 'Progressive scaling and smooth growth patterns'
  },
  
  visualHarmonyFiring: {
    name: 'visualHarmonyFiring',
    description: 'Neural action potential-inspired rapid transitions',
    easingFunction: (t: number) => {
      // Sharp spike followed by gradual recovery like neuron firing
      if (t < 0.1) return t * 10; // Rapid depolarization
      if (t < 0.3) return 1 - (t - 0.1) * 2; // Repolarization  
      return Math.max(0, 0.6 - (t - 0.3) * 0.86); // Hyperpolarization recovery
    },
    duration: 400,
    intensityModifier: 2.0,
    visualInspiration: 'Visual harmony transitions and effect coordination'
  },
  
  plantGrowth: {
    name: 'plantGrowth',
    description: 'Phototropic plant growth-inspired smooth transitions',
    easingFunction: (t: number) => {
      // Exponential growth curve with periodic growth spurts
      const baseGrowth = 1 - Math.exp(-t * 3);
      const growthSpurts = Math.sin(t * Math.PI * 4) * 0.1 * t;
      return Math.min(1, baseGrowth + growthSpurts);
    },
    duration: 4000,
    intensityModifier: 0.6,
    visualInspiration: 'Phototropism and circadian growth rhythms'
  }
};

// ===================================================================
// CONSCIOUSNESS FIELD ANALYSIS
// ===================================================================


// ===================================================================
// CHOREOGRAPHY PERFORMANCE METRICS
// ===================================================================

/**
 * Performance metrics for animation coordination
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
  smoothRealism: number; // 0-1 how smooth the behavior feels
  userPerceptionScore: number; // 0-1 estimated user satisfaction
}

// ===================================================================
// HELPER TYPES
// ===================================================================


/**
 * Choreography configuration for different modes
 */
export interface ChoreographyModeConfig {
  mode: 'performance' | 'quality' | 'battery' | 'accessibility' | 'custom';
  fieldUpdateInterval: number; // ms between field updates
  transitionIntensity: number; // 0-2 transition intensity multiplier
  smoothComplexity: number; // 0-1 how complex smooth behaviors are
  eventProcessingPriority: 'immediate' | 'batched' | 'deferred';
  enabledTransitionPatterns: string[]; // Which animation patterns are enabled
  performanceThresholds: {
    maxCpuUsage: number;
    maxMemoryUsage: number;
    maxEventQueueLength: number;
  };
}

// =========================================================================
// MODERN TYPE DEFINITIONS (RECOMMENDED)
// =========================================================================

/**
 * Animation transition pattern definitions
 * @since v3.0.0 - Replaces OrganicTransitionPattern
 */
export interface AnimationTransitionPattern {
  name: string;
  description: string;
  easingFunction: (t: number) => number;
  duration: number; // Base duration in ms
  intensityModifier: number; // How much the pattern responds to intensity
  visualInspiration: string; // What visual effect this creates
}

/**
 * Extended animation field interface
 * @since v3.0.0 - Replaces ExtendedConsciousnessField
 */
export interface ExtendedAnimationField {
  // Includes all ConsciousnessField properties
  // Extended properties for animation coordination
  transitionState: 'idle' | 'transitioning' | 'stable' | 'adapting';
  priority: 'low' | 'normal' | 'high' | 'critical';
  lastFieldUpdate: number;
  
  // Animation-specific coordination
  activeAnimationPatterns: string[];
  animationCoordination: {
    leadSystem: string;
    followingSystems: string[];
    coordinationStrength: number; // 0-1
  };
  
  // Performance tracking
  performanceImpact: {
    cpu: number;
    memory: number;
    gpu: number;
  };
}

/**
 * Animation field analysis
 * @since v3.0.0 - Replaces ConsciousnessFieldAnalysis
 */
export interface AnimationFieldAnalysis {
  // Field stability analysis
  stabilityMetrics: {
    varianceOverTime: number;
    trendDirection: 'increasing' | 'decreasing' | 'stable';
    predictability: number; // 0-1 how predictable the field is
  };
  
  // Performance analysis
  performanceAnalysis: {
    averageUpdateTime: number;
    maxUpdateTime: number;
    updateFrequency: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      gpu: number;
    };
  };
  
  // System health
  systemHealth: {
    responsiveness: number; // 0-1
    errorRate: number; // errors per second
    recoveryTime: number; // average ms to recover from issues
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  };
  
  // Animation quality metrics
  animationQuality: {
    smoothness: number; // 0-1
    consistency: number; // 0-1
    visualAppeal: number; // 0-1
    userSatisfaction: number; // 0-1
  };
}

/**
 * Animation field snapshot for debugging/analysis
 * @since v3.0.0 - Replaces ConsciousnessFieldSnapshot
 */
export interface AnimationFieldSnapshot {
  timestamp: number;
  field: VisualEffectState;
  participants: string[];
  activeEvents: string[];
  performanceMetrics: Partial<ChoreographyPerformanceMetrics>;
  analysis: Partial<AnimationFieldAnalysis>;
}

// =========================================================================
// BACKWARDS COMPATIBILITY ALIASES (DEPRECATED)
// =========================================================================


/**
 * Modern visual coordination field type
 * @since v3.0.0
 */
export type VisualCoordinationField = VisualEffectState;

// Duplicate interface removed - using the first AnimationTransitionPattern definition




