/**
 * VisualEffectsCoordinator - Background Visual Effects Coordination System
 *
 * Coordinates visual effects across background systems, synchronizing animations
 * and effects based on music analysis and device performance characteristics.
 *
 * Architecture:
 * - Creates VisualEffectState - shared state for background visual systems
 * - Broadcasts visual effect events through GlobalEventBus for coordination
 * - Provides smooth transitions and performance-aware effect scaling
 * - Integrates music analysis, color harmony, and performance monitoring
 *
 * @architecture Phase 2.2 Background Visual Effects Coordination
 * @performance Target: Efficient coordination while maintaining <1MB bundle
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { EmotionalGradientMapper } from "@/audio/EmotionalGradientMapper";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import {
  UnifiedPerformanceCoordinator,
  type DeviceCapabilities,
  type PerformanceMode,
} from "@/core/performance/UnifiedPerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { ChoreographyEventType, DynamicTransitionConfig } from "@/types/animationCoordination";

// ===================================================================
// CSS VARIABLE NAMING STANDARDS
// ===================================================================

/**
 * Standard CSS variable prefixes for visual effects
 * 
 * @example
 * ```typescript
 * // Use these constants for consistent naming
 * const visualEffectVars = {
 *   [CSS_VAR_PREFIXES.VISUAL_EFFECTS + 'intensity']: '0.8',
 *   [CSS_VAR_PREFIXES.VISUAL_STATE + 'energy']: '0.6'
 * };
 * ```
 */
export const CSS_VAR_PREFIXES = {
  /** Main visual effects variables: --sn-visual-effects-* */
  VISUAL_EFFECTS: '--sn-visual-effects-',
  /** Visual state variables: --sn-visual-state-* */
  VISUAL_STATE: '--sn-visual-state-',
  /** Visual coordination variables: --sn-visual-coordination-* */
  VISUAL_COORDINATION: '--sn-visual-coordination-',
  /** Visual performance variables: --sn-visual-performance-* */
  VISUAL_PERFORMANCE: '--sn-visual-performance-',
} as const;

/**
 * Standard visual effects CSS variable names
 */
export const VISUAL_EFFECT_CSS_VARS = {
  // Core visual effect state
  ENERGY_LEVEL: CSS_VAR_PREFIXES.VISUAL_STATE + 'energy-level',
  FLOW_DIRECTION_X: CSS_VAR_PREFIXES.VISUAL_STATE + 'flow-direction-x',
  FLOW_DIRECTION_Y: CSS_VAR_PREFIXES.VISUAL_STATE + 'flow-direction-y',
  COLOR_TEMPERATURE: CSS_VAR_PREFIXES.VISUAL_STATE + 'color-temperature',
  
  // Performance and coordination
  ADAPTIVE_QUALITY: CSS_VAR_PREFIXES.VISUAL_PERFORMANCE + 'adaptive-quality',
  PARTICIPANT_COUNT: CSS_VAR_PREFIXES.VISUAL_COORDINATION + 'participant-count',
  UPDATE_RATE: CSS_VAR_PREFIXES.VISUAL_PERFORMANCE + 'update-rate',
  
  // Animation parameters
  PULSE_RATE: CSS_VAR_PREFIXES.VISUAL_EFFECTS + 'pulse-rate',
  TRANSITION_FLUIDITY: CSS_VAR_PREFIXES.VISUAL_EFFECTS + 'transition-fluidity',
  SYSTEM_HARMONY: CSS_VAR_PREFIXES.VISUAL_EFFECTS + 'system-harmony',
} as const;

// ===================================================================
// VISUAL EFFECT STATE INTERFACES
// ===================================================================

/**
 * Vector2D for directional flow patterns
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * VisualEffectState - Shared state that background visual systems use for coordination
 *
 * Contains music analysis data, visual parameters, and performance metrics that
 * allow visual systems to coordinate their effects smoothly.
 * 
 * @example
 * ```typescript
 * // Access visual state for coordination
 * const state = coordinator.getCurrentVisualEffectsState();
 * if (state) {
 *   // Use music data
 *   const beatStrength = state.musicIntensity; // 0-1
 *   const flowX = state.flowDirection.x; // -1 to 1
 *   const warmth = state.colorTemperature; // 1000K-20000K
 *   
 *   // Use performance data
 *   const quality = state.adaptiveQuality; // 0-1
 *   const isLowEnd = state.deviceCapabilities.performanceTier === 'low';
 *   
 *   // Apply to your visual system
 *   this.updateVisualIntensity(beatStrength * quality);
 * }
 * ```
 * 
 * @see {@link BackgroundSystemParticipant} for implementing systems that use this state
 * @see {@link VisualEffectsCoordinator.registerVisualEffectsParticipant} for registration
 */
export interface VisualEffectState {
  // === MUSIC INTEGRATION ===
  musicIntensity: number; // 0-1 beat intensity from music analysis
  flowDirection: Vector2D; // Flow direction derived from music characteristics
  energyLevel: number; // 0-1 overall music energy level
  colorTemperature: number; // Color temperature (1000K-20000K) from music emotion
  tempoModulation: number; // 0-2 tempo-driven scaling factor
  harmonicComplexity: number; // 0-1 musical complexity for system sophistication

  // === VISUAL PARAMETERS ===
  fluidIntensity: number; // 0-2 fluid dynamics intensity
  depthPerception: number; // 0-1 3D space illusion strength
  luminosity: number; // 0-2 hardware acceleration intensity
  colorHarmony: number; // 0-1 color harmony synchronization
  visualCoherence: number; // 0-1 how unified the visual systems appear

  // === ANIMATION PARAMETERS ===
  pulseRate: number; // 0.5-4.0 seconds - synchronized pulse rhythm
  transitionFluidity: number; // 0-1 transition smoothness between systems
  scalingFactor: number; // 0.1-2.0 animation scaling factor
  effectDepth: number; // 0-1 depth of effect integration
  systemHarmony: number; // 0-1 how well systems coordinate together

  // === PERFORMANCE AWARENESS ===
  deviceCapabilities: DeviceCapabilities;
  performanceMode: PerformanceMode;
  adaptiveQuality: number; // 0-1 current quality level
  thermalState: number; // 0-1 thermal throttling level
  batteryConservation: number; // 0-1 battery optimization level

  // === TEMPORAL TRACKING ===
  timestamp: number; // When this state was created
  evolutionPhase: number; // 0-1 how the visual state has evolved
  continuityIndex: number; // 0-1 temporal continuity with previous state
}

/**
 * Background system participant interface with enhanced type safety
 * 
 * @example
 * ```typescript
 * class MyVisualSystem implements BackgroundSystemParticipant {
 *   systemName = 'my-visual-system';
 *   
 *   onVisualStateUpdate(state: VisualEffectState): void {
 *     // Handle visual state updates with full type safety
 *     this.updateEffects(state.energyLevel, state.colorTemperature);
 *   }
 *   
 *   onVisualEffectEvent(eventType: VisualEffectEventType, payload: VisualEffectEventPayload): void {
 *     // Type-safe event handling
 *   }
 *   
 *   getVisualContribution(): Partial<VisualEffectState> {
 *     return { fluidIntensity: 0.8, depthPerception: 0.6 };
 *   }
 * }
 * ```
 */
export interface BackgroundSystemParticipant {
  systemName: string;
  onVisualStateUpdate(state: VisualEffectState): void;
  onVisualEffectEvent(eventType: VisualEffectEventType, payload: VisualEffectEventPayload): void;
  getVisualContribution(): Partial<VisualEffectState>;
}

/**
 * Visual effect event types for coordination
 * 
 * @example
 * ```typescript
 * // Type-safe event handling
 * coordinator.choreographEvent('visual:energy-surge', {
 *   intensity: 0.8,
 *   duration: 1000
 * });
 * ```
 */
export type VisualEffectEventType =
  | "visual:state-updated"
  | "visual:rhythm-shift"
  | "visual:color-shift"
  | "visual:energy-surge"
  | "visual:pulse-cycle"
  | "visual:transition-fluid"
  | "visual:scaling-change"
  | "visual:performance-adapt"
  | "visual:coordination";

/**
 * Participant registration result with detailed information
 */
export interface ParticipantRegistrationResult {
  success: boolean;
  participantName: string;
  contributionReceived: boolean;
  errorMessage?: string;
}

/**
 * Visual state update result with performance metrics
 */
export interface VisualStateUpdateResult {
  success: boolean;
  participantsNotified: number;
  updateDuration: number;
  continuityIndex: number;
  errorCount: number;
}

/**
 * Type-safe payload for visual effect events
 */
export interface VisualEffectEventPayload {
  intensity?: number;
  duration?: number;
  affectedSystems?: string[];
  transitionType?: 'smooth' | 'harmonic' | 'exponential' | 'cubic';
  reason?: 'automatic' | 'user-action' | 'music-sync' | 'performance';
  metadata?: Record<string, unknown>;
  
  // Legacy event payload properties for backwards compatibility
  newTrack?: any;
  surgeType?: string;
  newMode?: any;
  adaptationType?: string;
  falloffCurve?: string;
  originalEventType?: string;
}

/**
 * Dynamic transition configuration for visual effect state changes
 * 
 * Controls how visual effects transition between different states to maintain
 * smooth, natural-feeling animations without jarring changes.
 */
export interface VisualDynamicTransitionConfig {
  /** Enable/disable dynamic transitions between visual states */
  enabled: boolean;
  /** Duration of transitions in milliseconds (100-5000ms recommended) */
  transitionDuration: number;
  /** Easing function type - 'smooth' for general use, 'harmonic' for music sync */
  easingFunction: "smooth" | "harmonic" | "exponential" | "cubic";
  /** Transition intensity multiplier (0.1-2.0, where 1.0 is normal) */
  intensityFactor: number;
  /** Minimum coherence required to trigger transition (0-1, lower = more transitions) */
  coherenceThreshold: number;
}

/**
 * @deprecated Use VisualDynamicTransitionConfig instead  
 * @since v1.0.0
 */
export type SmoothTransitionConfig = VisualDynamicTransitionConfig;

// ===================================================================
// VISUAL EFFECTS COORDINATOR
// ===================================================================

/**
 * VisualEffectsCoordinator - Coordinates background visual effects through shared state
 *
 * This system establishes shared visual effect state that background systems use for coordination,
 * allowing them to synchronize effects smoothly based on music analysis and performance metrics.
 * 
 * **Architecture Pattern:** Singleton with participant registration
 * **Performance:** 60fps updates with adaptive quality scaling
 * **Integration:** Unified event bus communication and CSS variable management
 * 
 * @example
 * ```typescript
 * // Initialize coordinator
 * const coordinator = VisualEffectsCoordinator.getInstance(config, cssController);
 * await coordinator.initialize();
 * 
 * // Register a visual system
 * class MyVisualSystem implements BackgroundSystemParticipant {
 *   systemName = 'my-background-effects';
 *   
 *   onVisualStateUpdate(state: VisualEffectState): void {
 *     // Respond to coordinated visual state
 *     this.setBrightness(state.energyLevel);
 *     this.setFlowDirection(state.flowDirection);
 *   }
 *   
 *   onVisualEffectEvent(eventType: VisualEffectEventType, payload: VisualEffectEventPayload): void {
 *     if (eventType === 'visual:energy-surge') {
 *       this.triggerEnergyEffect(payload.intensity || 0.5);
 *     }
 *   }
 *   
 *   getVisualContribution(): Partial<VisualEffectState> {
 *     return { fluidIntensity: this.getCurrentFluidLevel() };
 *   }
 * }
 * 
 * const result = coordinator.registerVisualEffectsParticipant(new MyVisualSystem());
 * if (result.success) {
 *   console.log('Visual system registered successfully');
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Advanced usage - custom events and performance monitoring
 * coordinator.choreographEvent('visual:energy-surge', {
 *   intensity: 0.9,
 *   duration: 2000,
 *   affectedSystems: ['gradient-system', 'particle-system'],
 *   reason: 'music-sync'
 * });
 * 
 * // Monitor performance
 * const metrics = coordinator.getPerformanceMetrics();
 * console.log(`State updates: ${metrics.stateUpdates}, avg time: ${metrics.averageUpdateTime}ms`);
 * 
 * // Health check
 * const health = await coordinator.healthCheck();
 * if (!health.healthy) {
 *   console.warn('Visual effects coordination issues detected');
 * }
 * ```
 * 
 * @see {@link BackgroundSystemParticipant} for participant interface
 * @see {@link VisualEffectState} for shared state structure
 * @see {@link VISUAL_EFFECT_CSS_VARS} for standardized CSS variable names
 */
export class VisualEffectsCoordinator implements IManagedSystem {
  private static instance: VisualEffectsCoordinator | null = null;
  public initialized: boolean = false;

  // Core dependencies
  private config: AdvancedSystemConfig | Year3000Config;
  private eventBus: typeof unifiedEventBus;
  private cssController: OptimizedCSSVariableManager | null = null;
  private performanceCoordinator: UnifiedPerformanceCoordinator | null = null;
  private musicSyncService: MusicSyncService | null = null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private emotionalGradientMapper: EmotionalGradientMapper | null = null;

  // Visual effect state management
  private currentVisualState: VisualEffectState | null = null;
  private previousVisualState: VisualEffectState | null = null;
  private fieldUpdateTimer: NodeJS.Timeout | null = null;
  private lastFieldUpdate: number = 0;

  // System participants
  private registeredParticipants: Map<string, BackgroundSystemParticipant> =
    new Map();
  private participantContributions: Map<string, Partial<VisualEffectState>> = new Map();

  // Dynamic transition management
  private transitionConfig: VisualDynamicTransitionConfig = {
    enabled: true,
    transitionDuration: 1000,
    easingFunction: "smooth",
    intensityFactor: 1.0,
    coherenceThreshold: 0.3,
  };

  // Performance and monitoring
  private isActive: boolean = false;
  private updateInterval: number = 16; // 60fps visual state updates
  private performanceMetrics = {
    stateUpdates: 0,
    coordinationEvents: 0,
    animationTransitions: 0,
    lastUpdate: 0,
    averageUpdateTime: 0,
  };

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    cssController?: OptimizedCSSVariableManager,
    performanceCoordinator?: UnifiedPerformanceCoordinator,
    musicSyncService?: MusicSyncService,
    colorHarmonyEngine?: ColorHarmonyEngine
  ) {
    this.config = config;
    this.eventBus = unifiedEventBus;
    this.cssController = cssController || null;
    this.performanceCoordinator = performanceCoordinator || null;
    this.musicSyncService = musicSyncService || null;
    this.colorHarmonyEngine = colorHarmonyEngine || null;

    // Initialize emotional gradient mapper if we have the required dependencies
    if (this.cssController && this.musicSyncService) {
      this.emotionalGradientMapper = new EmotionalGradientMapper(
        this.cssController,
        this.musicSyncService
      );
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        "Visual effects coordinator created"
      );
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(
    config?: Year3000Config,
    cssController?: OptimizedCSSVariableManager,
    performanceCoordinator?: UnifiedPerformanceCoordinator,
    musicSyncService?: MusicSyncService,
    colorHarmonyEngine?: ColorHarmonyEngine
  ): VisualEffectsCoordinator {
    if (!VisualEffectsCoordinator.instance) {
      if (!config) {
        throw new Error(
          "VisualEffectsCoordinator requires configuration for first initialization"
        );
      }
      VisualEffectsCoordinator.instance =
        new VisualEffectsCoordinator(
          config,
          cssController,
          performanceCoordinator,
          musicSyncService,
          colorHarmonyEngine
        );
    }
    return VisualEffectsCoordinator.instance;
  }

  // ===================================================================
  // IMANAGEDYSTEM INTERFACE IMPLEMENTATION
  // ===================================================================

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize emotional gradient mapper if available
      if (this.emotionalGradientMapper) {
        await this.emotionalGradientMapper.initialize();
      }

      // Create initial visual effects state
      this.currentVisualState = this.createInitialVisualState();

      // Start visual effects updates
      this.startVisualEffectsUpdates();

      // Subscribe to relevant events
      this.subscribeToEvents();

      this.initialized = true;
      this.isActive = true;

      if (this.config.enableDebug) {
        Y3KDebug?.debug?.log(
          "VisualEffectsCoordinator",
          "Visual effects coordinator initialized"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "VisualEffectsCoordinator",
        "Failed to initialize:",
        error
      );
      throw error;
    }
  }

  public updateAnimation(deltaTime: number): void {
    // Update performance metrics
    this.performanceMetrics.lastUpdate = performance.now();

    // Visual state updates are handled by timer for smooth transitions
    // This keeps the system lightweight in animation loops
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const participantCount = this.registeredParticipants.size;
    const fieldAge = this.currentVisualState
      ? performance.now() - this.currentVisualState.timestamp
      : 0;
    const isHealthy = this.isActive && fieldAge < 1000 && participantCount > 0;

    return {
      system: "VisualEffectsCoordinator",
      healthy: isHealthy,
      ok: isHealthy,
      details: isHealthy
        ? "Visual effects coordination active"
        : "Visual effects state inactive or stale",
      metrics: {
        isActive: this.isActive,
        participantCount,
        fieldAge,
        stateUpdates: this.performanceMetrics.stateUpdates,
        coordinationEvents: this.performanceMetrics.coordinationEvents,
        animationTransitions: this.performanceMetrics.animationTransitions,
        averageUpdateTime: this.performanceMetrics.averageUpdateTime,
      },
    };
  }

  public destroy(): void {
    // Stop visual effects updates
    if (this.fieldUpdateTimer) {
      clearTimeout(this.fieldUpdateTimer);
      this.fieldUpdateTimer = null;
    }

    // Unsubscribe from events
    this.unsubscribeFromEvents();

    // Destroy emotional gradient mapper
    if (this.emotionalGradientMapper) {
      this.emotionalGradientMapper.destroy();
      this.emotionalGradientMapper = null;
    }

    // Clear participants
    this.registeredParticipants.clear();
    this.participantContributions.clear();

    // Reset state
    this.currentVisualState = null;
    this.previousVisualState = null;
    this.isActive = false;
    this.initialized = false;

    // Reset singleton
    if (VisualEffectsCoordinator.instance === this) {
      VisualEffectsCoordinator.instance = null;
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        "Visual effects coordinator destroyed"
      );
    }
  }

  // ===================================================================
  // VISUAL EFFECT STATE MANAGEMENT
  // ===================================================================

  /**
   * Create initial visual effect state with default values
   */
  private createInitialVisualState(): VisualEffectState {
    const deviceCapabilities =
      this.performanceCoordinator?.getDeviceCapabilities() || {
        performanceTier: "medium" as const,
        memoryGB: 4,
        cpuCores: 2,
        gpuAcceleration: false,
        isMobile: false,
        supportsWebGL: false,
        supportsBackdropFilter: false,
        maxTextureSize: 2048,
        devicePixelRatio: 1,
      };

    const performanceMode =
      this.performanceCoordinator?.getCurrentPerformanceMode() || {
        name: "balanced" as const,
        qualityLevel: 0.7,
        animationQuality: 0.7,
        effectQuality: 0.7,
        blurQuality: 0.7,
        shadowQuality: 0.7,
        frameRate: 60,
        optimizationLevel: 1,
      };

    return {
      // === MUSIC INTEGRATION ===
      musicIntensity: 0.5,
      flowDirection: { x: 0, y: 0 },
      energyLevel: 0.5,
      colorTemperature: 6500, // Neutral white
      tempoModulation: 1.0,
      harmonicComplexity: 0.5,

      // === VISUAL PARAMETERS ===
      fluidIntensity: 1.0,
      depthPerception: 0.7,
      luminosity: deviceCapabilities.gpuAcceleration ? 1.2 : 0.8,
      colorHarmony: 0.6,
      visualCoherence: 0.8,

      // === ANIMATION PARAMETERS ===
      pulseRate: 2.0, // 2 second pulse cycle
      transitionFluidity: 0.5,
      scalingFactor: 1.0,
      effectDepth: 0.6,
      systemHarmony: 0.7,

      // === PERFORMANCE AWARENESS ===
      deviceCapabilities,
      performanceMode,
      adaptiveQuality: performanceMode.qualityLevel,
      thermalState: 0.0, // Cool
      batteryConservation: 0.0, // Not conserving

      // === TEMPORAL TRACKING ===
      timestamp: performance.now(),
      evolutionPhase: 0.0,
      continuityIndex: 1.0, // Perfect continuity at start
    };
  }

  /**
   * Update visual effects state with smooth evolution
   */
  private updateVisualEffectsState(): void {
    const startTime = performance.now();

    if (!this.currentVisualState) {
      this.currentVisualState = this.createInitialVisualState();
      return;
    }

    // Store previous field for continuity
    this.previousVisualState = { ...this.currentVisualState };

    // Create new state based on current state + participant contributions + music analysis
    const newState = this.evolveVisualState(
      this.currentVisualState
    );

    // Apply dynamic transitions if enabled
    if (this.transitionConfig.enabled) {
      this.currentVisualState = this.applyDynamicTransition(
        this.currentVisualState,
        newState
      );
    } else {
      this.currentVisualState = newState;
    }

    // Apply standardized CSS variables (fire and forget)
    this.applyStandardizedVisualVariables().catch(error => {
      Y3KDebug?.debug?.error("VisualEffectsCoordinator", "Failed to apply CSS variables:", error);
    });

    // Broadcast visual effects state update
    const updateResult = this.choreographVisualEffectsUpdate();
    
    // Log coordination errors if any occurred
    if (!updateResult.success && this.config.enableDebug) {
      Y3KDebug?.debug?.warn(
        "VisualEffectsCoordinator",
        `Visual effects update had ${updateResult.errorCount} errors, notified ${updateResult.participantsNotified} participants`
      );
    }

    // Update performance metrics
    const updateTime = performance.now() - startTime;
    this.performanceMetrics.stateUpdates++;
    this.performanceMetrics.averageUpdateTime =
      (this.performanceMetrics.averageUpdateTime + updateTime) / 2;

    if (
      this.config.enableDebug &&
      this.performanceMetrics.stateUpdates % 60 === 0
    ) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Visual effects state evolved - Update #${
          this.performanceMetrics.stateUpdates
        }, avg time: ${this.performanceMetrics.averageUpdateTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * Evolve visual effect state based on music, participants, and performance
   */
  private evolveVisualState(
    currentState: VisualEffectState
  ): VisualEffectState {
    // Start with current state
    const evolvedState: VisualEffectState = { ...currentState };

    // Update temporal tracking
    evolvedState.timestamp = performance.now();
    evolvedState.evolutionPhase = Math.min(
      1.0,
      evolvedState.evolutionPhase + 0.001
    ); // Slow evolution

    // Update from music analysis if available
    this.updateFromMusicAnalysis(evolvedState);

    // Integrate participant contributions
    this.integrateParticipantContributions(evolvedState);

    // Apply animation transitions
    this.applyAnimationTransitions(evolvedState);

    // Update performance awareness
    this.updatePerformanceAwareness(evolvedState);

    // Calculate continuity with previous state
    if (this.previousVisualState) {
      evolvedState.continuityIndex = this.calculateContinuityIndex(
        this.previousVisualState,
        evolvedState
      );
    }

    return evolvedState;
  }

  /**
   * Update visual state from music analysis
   */
  private updateFromMusicAnalysis(state: VisualEffectState): void {
    // Update from emotional gradient mapper if available
    if (this.emotionalGradientMapper) {
      const emotionalProfile =
        this.emotionalGradientMapper.getCurrentEmotionalProfile();
      if (emotionalProfile) {
        state.pulseRate = emotionalProfile.energy;
        state.energyLevel = emotionalProfile.arousal;
        state.colorTemperature = 3000 + emotionalProfile.valence * 10000; // 3000K-13000K
        state.harmonicComplexity = emotionalProfile.complexity;

        // Update musical flow based on mood
        const moodFlowMap: { [key: string]: Vector2D } = {
          euphoric: { x: 1, y: 1 },
          aggressive: { x: -1, y: 1 },
          peaceful: { x: 0, y: -0.5 },
          melancholic: { x: -0.5, y: -1 },
          mysterious: { x: 0.7, y: 0 },
          contemplative: { x: 0, y: 0.3 },
        };

        state.flowDirection = moodFlowMap[emotionalProfile.mood] || {
          x: 0,
          y: 0,
        };
        state.tempoModulation = 0.5 + emotionalProfile.energy * 1.5;
      }
    }

    // Additional music sync service integration
    if (this.musicSyncService) {
      // This would integrate with any additional music analysis
      // For now, we rely on the emotional gradient mapper
    }
  }

  /**
   * Integrate contributions from registered participants
   */
  private integrateParticipantContributions(state: VisualEffectState): void {
    if (this.participantContributions.size === 0) return;

    // Collect contributions and apply weighted average
    let totalWeight = 0;
    const contributions: Partial<VisualEffectState>[] = [];

    for (const [participantId, contribution] of this.participantContributions) {
      contributions.push(contribution);
      totalWeight += 1; // Equal weight for now
    }

    if (totalWeight > 0) {
      // Apply participant contributions with dynamic blending
      for (const contribution of contributions) {
        if (contribution.fluidIntensity !== undefined) {
          state.fluidIntensity = this.dynamicBlend(
            state.fluidIntensity,
            contribution.fluidIntensity,
            0.1
          );
        }
        if (contribution.depthPerception !== undefined) {
          state.depthPerception = this.dynamicBlend(
            state.depthPerception,
            contribution.depthPerception,
            0.1
          );
        }
        if (contribution.luminosity !== undefined) {
          state.luminosity = this.dynamicBlend(
            state.luminosity,
            contribution.luminosity,
            0.1
          );
        }
        // Add more field integrations as needed
      }
    }
  }

  /**
   * Apply animation transitions to visual effect state
   */
  private applyAnimationTransitions(state: VisualEffectState): void {
    const time = performance.now() / 1000; // Convert to seconds

    // Apply pulse cycle modulation
    const pulsePhase = (time % state.pulseRate) / state.pulseRate;
    const pulseInfluence = Math.sin(pulsePhase * Math.PI * 2) * 0.1;

    state.scalingFactor += pulseInfluence;
    state.transitionFluidity = Math.max(
      0,
      Math.min(1, state.transitionFluidity + pulseInfluence * 0.5)
    );

    // Apply animation evolution
    state.effectDepth = Math.max(
      0,
      Math.min(1, state.effectDepth + state.evolutionPhase * 0.001)
    );

    // Update system harmony based on visual coherence
    state.systemHarmony = Math.max(
      0,
      Math.min(1, (state.visualCoherence + state.continuityIndex) / 2)
    );
  }

  /**
   * Update performance awareness in visual effect state
   */
  private updatePerformanceAwareness(state: VisualEffectState): void {
    if (this.performanceCoordinator) {
      // Update device capabilities and performance mode
      state.deviceCapabilities =
        this.performanceCoordinator.getDeviceCapabilities();
      state.performanceMode =
        this.performanceCoordinator.getCurrentPerformanceMode();
      state.adaptiveQuality = state.performanceMode.qualityLevel;

      // Update thermal and battery state
      const thermalState = this.performanceCoordinator.getThermalState();
      const batteryState = this.performanceCoordinator.getBatteryState();

      state.thermalState = thermalState.throttleLevel || 0;
      state.batteryConservation =
        batteryState && !batteryState.charging
          ? (1 - batteryState.level) * 0.5
          : 0;
    }
  }

  /**
   * Calculate continuity index between visual effect states
   */
  private calculateContinuityIndex(
    previous: VisualEffectState,
    current: VisualEffectState
  ): number {
    // Calculate how similar the new state is to the previous one
    const metrics = [
      Math.abs(previous.pulseRate - current.pulseRate),
      Math.abs(previous.energyLevel - current.energyLevel),
      Math.abs(previous.fluidIntensity - current.fluidIntensity),
      Math.abs(previous.depthPerception - current.depthPerception),
      Math.abs(previous.luminosity - current.luminosity),
    ];

    const averageDifference =
      metrics.reduce((sum, diff) => sum + diff, 0) / metrics.length;
    return Math.max(0, Math.min(1, 1 - averageDifference));
  }

  /**
   * Apply dynamic transition between visual effect states
   */
  private applyDynamicTransition(
    current: VisualEffectState,
    target: VisualEffectState
  ): VisualEffectState {
    // Determine transition speed based on continuity and coherence
    const transitionSpeed = this.calculateDynamicTransitionSpeed(
      current,
      target
    );

    // Apply dynamic easing function
    const easedProgress = this.applyDynamicEasing(transitionSpeed);

    // Blend states dynamically
    return this.blendVisualStates(current, target, easedProgress);
  }

  /**
   * @deprecated Use applyDynamicTransition instead
   * @since v1.0.0
   */
  private applySmoothTransition(
    current: VisualEffectState,
    target: VisualEffectState
  ): VisualEffectState {
    return this.applyDynamicTransition(current, target);
  }

  /**
   * Calculate dynamic transition speed based on state characteristics
   */
  private calculateDynamicTransitionSpeed(
    current: VisualEffectState,
    target: VisualEffectState
  ): number {
    const baseBeat = 1.0 / 60.0; // 60fps base rate
    const pulseModulation =
      1.0 +
      Math.sin(
        (performance.now() / 1000 / current.pulseRate) * Math.PI * 2
      ) *
        0.2;
    const energyModulation = 0.5 + current.energyLevel * 1.5;

    return (
      baseBeat *
      pulseModulation *
      energyModulation *
      this.transitionConfig.intensityFactor
    );
  }

  /**
   * @deprecated Use calculateDynamicTransitionSpeed instead
   * @since v1.0.0
   */
  private calculateSmoothTransitionSpeed(
    current: VisualEffectState,
    target: VisualEffectState
  ): number {
    return this.calculateDynamicTransitionSpeed(current, target);
  }

  /**
   * Apply dynamic easing function for visual transitions
   */
  private applyDynamicEasing(progress: number): number {
    switch (this.transitionConfig.easingFunction) {
      case "smooth":
        // Dynamic cubic bezier transition
        return progress * progress * (3 - 2 * progress);
      case "harmonic":
        // Sine wave for harmonic transitions
        return (Math.sin((progress - 0.5) * Math.PI) + 1) / 2;
      case "exponential":
        // Exponential growth curve
        return progress * progress;
      case "cubic":
        // Cubic easing
        return progress * progress * progress;
      default:
        return progress;
    }
  }

  /**
   * @deprecated Use applyDynamicEasing instead
   * @since v1.0.0
   */
  private applySmoothEasing(progress: number): number {
    return this.applyDynamicEasing(progress);
  }

  /**
   * Blend two visual effect states dynamically
   */
  private blendVisualStates(
    current: VisualEffectState,
    target: VisualEffectState,
    progress: number
  ): VisualEffectState {
    const blended: VisualEffectState = { ...current };

    // Blend numeric values
    blended.pulseRate = this.dynamicBlend(
      current.pulseRate,
      target.pulseRate,
      progress
    );
    blended.energyLevel = this.dynamicBlend(
      current.energyLevel,
      target.energyLevel,
      progress
    );
    blended.colorTemperature = this.dynamicBlend(
      current.colorTemperature,
      target.colorTemperature,
      progress
    );
    blended.fluidIntensity = this.dynamicBlend(
      current.fluidIntensity,
      target.fluidIntensity,
      progress
    );
    blended.depthPerception = this.dynamicBlend(
      current.depthPerception,
      target.depthPerception,
      progress
    );
    blended.luminosity = this.dynamicBlend(
      current.luminosity,
      target.luminosity,
      progress
    );
    blended.colorHarmony = this.dynamicBlend(
      current.colorHarmony,
      target.colorHarmony,
      progress
    );
    blended.visualCoherence = this.dynamicBlend(
      current.visualCoherence,
      target.visualCoherence,
      progress
    );
    // Keep pulseRate blending (already done above)
    blended.transitionFluidity = this.dynamicBlend(
      current.transitionFluidity,
      target.transitionFluidity,
      progress
    );
    blended.scalingFactor = this.dynamicBlend(
      current.scalingFactor,
      target.scalingFactor,
      progress
    );
    blended.effectDepth = this.dynamicBlend(
      current.effectDepth,
      target.effectDepth,
      progress
    );
    blended.systemHarmony = this.dynamicBlend(
      current.systemHarmony,
      target.systemHarmony,
      progress
    );
    blended.tempoModulation = this.dynamicBlend(
      current.tempoModulation,
      target.tempoModulation,
      progress
    );
    blended.harmonicComplexity = this.dynamicBlend(
      current.harmonicComplexity,
      target.harmonicComplexity,
      progress
    );
    blended.adaptiveQuality = this.dynamicBlend(
      current.adaptiveQuality,
      target.adaptiveQuality,
      progress
    );

    // Blend vectors
    blended.flowDirection = {
      x: this.dynamicBlend(
        current.flowDirection.x,
        target.flowDirection.x,
        progress
      ),
      y: this.dynamicBlend(
        current.flowDirection.y,
        target.flowDirection.y,
        progress
      ),
    };

    // Update timestamp and continuity
    blended.timestamp = performance.now();
    blended.continuityIndex = current.continuityIndex;

    return blended;
  }

  /**
   * Dynamic blend function for seamless value transitions
   */
  private dynamicBlend(
    current: number,
    target: number,
    progress: number
  ): number {
    return current + (target - current) * progress;
  }

  /**
   * @deprecated Use dynamicBlend instead
   * @since v1.0.0
   */
  private smoothBlend(
    current: number,
    target: number,
    progress: number
  ): number {
    return this.dynamicBlend(current, target, progress);
  }

  // ===================================================================
  // PARTICIPANT MANAGEMENT
  // ===================================================================

  /**
   * Register a background system as a visual effects participant
   * 
   * @param participant - The background system to register
   * @returns Registration result with success status and details
   * 
   * @example
   * ```typescript
   * const result = coordinator.registerVisualEffectsParticipant(mySystem);
   * if (result.success) {
   *   console.log(`${result.participantName} registered successfully`);
   * }
   * ```
   */
  public registerVisualEffectsParticipant(
    participant: BackgroundSystemParticipant
  ): ParticipantRegistrationResult {
    try {
      // Check for duplicate registration
      if (this.registeredParticipants.has(participant.systemName)) {
        return {
          success: false,
          participantName: participant.systemName,
          contributionReceived: false,
          errorMessage: `Participant '${participant.systemName}' is already registered`
        };
      }

      this.registeredParticipants.set(participant.systemName, participant);

      // Get initial contribution from participant with error handling
      let contributionReceived = false;
      try {
        const contribution = participant.getVisualContribution();
        this.participantContributions.set(participant.systemName, contribution);
        contributionReceived = true;
      } catch (contributionError) {
        Y3KDebug?.debug?.warn(
          "VisualEffectsCoordinator",
          `Failed to get initial contribution from ${participant.systemName}:`,
          contributionError
        );
      }

      if (this.config.enableDebug) {
        Y3KDebug?.debug?.log(
          "VisualEffectsCoordinator",
          `Registered participant: ${participant.systemName}`
        );
      }

      return {
        success: true,
        participantName: participant.systemName,
        contributionReceived
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown registration error';
      Y3KDebug?.debug?.error(
        "VisualEffectsCoordinator",
        `Failed to register participant ${participant.systemName}:`,
        error
      );
      
      return {
        success: false,
        participantName: participant.systemName,
        contributionReceived: false,
        errorMessage
      };
    }
  }

  /**
   * Unregister a visual effects participant
   */
  public unregisterVisualEffectsParticipant(systemName: string): void {
    this.registeredParticipants.delete(systemName);
    this.participantContributions.delete(systemName);

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Unregistered participant: ${systemName}`
      );
    }
  }

  /**
   * Update participant contribution to visual effects state
   */
  public updateParticipantContribution(
    systemName: string,
    contribution: Partial<VisualEffectState>
  ): void {
    if (this.registeredParticipants.has(systemName)) {
      this.participantContributions.set(systemName, contribution);
    }
  }

  // ===================================================================
  // CHOREOGRAPHY EVENT COORDINATION
  // ===================================================================

  /**
   * Choreograph visual effects state update - broadcast to all participants
   * 
   * @returns Update result with performance metrics and error information
   */
  private choreographVisualEffectsUpdate(): VisualStateUpdateResult {
    const updateStartTime = performance.now();
    let participantsNotified = 0;
    let errorCount = 0;

    if (!this.currentVisualState) {
      return {
        success: false,
        participantsNotified: 0,
        updateDuration: 0,
        continuityIndex: 0,
        errorCount: 1
      };
    }

    // Broadcast visual effects state update
    try {
      this.eventBus.emit(
        "visual-effects:field-updated",
        {
          rhythmicPulse: this.currentVisualState.pulseRate,
          musicalFlow: this.currentVisualState.flowDirection,
          energyResonance: this.currentVisualState.energyLevel,
          depthPerception: this.currentVisualState.depthPerception,
          pulsingCycle: this.currentVisualState.pulseRate
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "VisualEffectsCoordinator",
        "Error broadcasting visual effects state update:",
        error
      );
      errorCount++;
    }

    // Notify registered participants directly with error tracking
    for (const participant of this.registeredParticipants.values()) {
      try {
        participant.onVisualStateUpdate(this.currentVisualState);
        participantsNotified++;
      } catch (error) {
        Y3KDebug?.debug?.error(
          "VisualEffectsCoordinator",
          `Error updating participant ${participant.systemName}:`,
          error
        );
        errorCount++;
      }
    }

    this.performanceMetrics.coordinationEvents++;
    const updateDuration = performance.now() - updateStartTime;

    return {
      success: errorCount === 0,
      participantsNotified,
      updateDuration,
      continuityIndex: this.currentVisualState.continuityIndex,
      errorCount
    };
  }

  /**
   * Choreograph specific event type with enhanced type safety
   * 
   * @param eventType - The type of visual effect event to choreograph
   * @param payload - Type-safe event payload
   * 
   * @example
   * ```typescript
   * coordinator.choreographEvent('visual:energy-surge', {
   *   intensity: 0.8,
   *   duration: 1000,
   *   affectedSystems: ['gradient-system', 'particle-system']
   * });
   * ```
   */
  public choreographEvent(
    eventType: string,
    payload: VisualEffectEventPayload
  ): void {
    // Map to valid unified event names (for backwards compatibility with ChoreographyEventType)
    if (eventType && typeof eventType === 'string') {
      try {
        const mappedEvent = this.mapChoreographyEventToUnified(eventType as any);
        if (mappedEvent) {
          (this.eventBus as any).emit(mappedEvent.eventName, mappedEvent.payload);
        }
      } catch (error) {
        // Fallback for non-choreography events
        (this.eventBus as any).emit(`visual-effects:${eventType}`, payload);
      }
    }

    // Notify participants
    for (const participant of this.registeredParticipants.values()) {
      try {
        if (eventType.startsWith('visual:')) {
          participant.onVisualEffectEvent(eventType as VisualEffectEventType, payload);
        } else {
          // Handle as legacy choreography event
          participant.onVisualEffectEvent('visual:coordination' as VisualEffectEventType, { ...payload, originalEventType: eventType });
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "VisualEffectsCoordinator",
          `Error sending choreography event to ${participant.systemName}:`,
          error
        );
      }
    }

    this.performanceMetrics.coordinationEvents++;

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Choreographed event: ${eventType}`,
        payload
      );
    }
  }

  // ===================================================================
  // VISUAL EFFECTS STATE LIFECYCLE
  // ===================================================================

  /**
   * Start visual effects state updates
   */
  private startVisualEffectsUpdates(): void {
    if (this.fieldUpdateTimer) return;

    const updateLoop = () => {
      if (this.isActive) {
        this.updateVisualEffectsState();
        this.fieldUpdateTimer = setTimeout(updateLoop, this.updateInterval);
      }
    };

    updateLoop();

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Started visual effects state updates (${this.updateInterval}ms interval)`
      );
    }
  }

  /**
   * Subscribe to relevant events
   */
  private subscribeToEvents(): void {
    // Subscribe to music sync events
    if (this.musicSyncService) {
      this.eventBus.subscribe("music:track-changed", (payload) => {
        this.choreographEvent("rhythm-shift", {
          newTrack: payload,
          transitionType: "smooth",
        });
      }, "VisualEffectsCoordinator");

      this.eventBus.subscribe("music:emotion-analyzed", (payload: any) => {
        this.choreographEvent("intensity-peak", {
          intensity: payload?.energy || 0.5,
          affectedSystems: ["all"],
          surgeType: "full-spectrum",
          duration: 1000,
          falloffCurve: "smooth",
        });
      }, "VisualEffectsCoordinator");
    }

    // Subscribe to performance events
    if (this.performanceCoordinator) {
      this.eventBus.subscribe("performance:tier-changed", (payload: any) => {
        this.choreographEvent("genre-transition", {
          newMode: payload || {
            name: "auto",
            qualityLevel: 0.8,
            frameRate: 60,
            optimizationLevel: 0.5,
          },
          adaptationType: "smooth",
          reason: "automatic",
          affectedSystems: ["all"],
        });
      }, "VisualEffectsCoordinator");
    }

    // Subscribe to settings changes
    this.eventBus.subscribe("settings:visual-guide-changed", (payload: any) => {
      if (
        payload?.key?.includes("visual-effects") ||
        payload?.key?.includes("choreography")
      ) {
        this.updateDynamicTransitionConfig(payload);
      }
    }, "VisualEffectsCoordinator");
  }

  /**
   * Unsubscribe from events
   */
  private unsubscribeFromEvents(): void {
    // Event bus handles cleanup automatically when the system is destroyed
  }

  /**
   * Map choreography events to unified event names
   */
  private mapChoreographyEventToUnified(eventType: ChoreographyEventType): { eventName: string; payload: any } | null {
    switch (eventType) {
      case "rhythm-shift":
        return { eventName: "visual-effects:coordination", payload: { source: "choreographer", type: "rhythm-shift" } };
      case "intensity-peak":
        return { eventName: "visual-effects:intensity-changed", payload: { intensity: 0.8, userEngagement: 0.6, timestamp: Date.now() } };
      case "genre-transition":
        return { eventName: "visual-effects:coordination", payload: { source: "choreographer", type: "genre-transition" } };
      case "emotional-shift":
        return { eventName: "visual-effects:coordination", payload: { source: "choreographer", type: "emotional-shift" } };
      default:
        return { eventName: "visual-effects:coordination", payload: { source: "choreographer", type: eventType } };
    }
  }

  /**
   * Update dynamic transition configuration
   */
  private updateDynamicTransitionConfig(settingsPayload: any): void {
    // Handle settings that affect dynamic transitions
    const { key, value } = settingsPayload;

    if (key.includes("transition-intensity")) {
      this.transitionConfig.intensityFactor = Math.max(
        0,
        Math.min(2, parseFloat(value) || 1.0)
      );
    } else if (key.includes("transition-duration")) {
      this.transitionConfig.transitionDuration = Math.max(
        100,
        Math.min(5000, parseInt(value) || 1000)
      );
    } else if (key.includes("animation-cycle")) {
      // This would update the animation cycle if the user has control over it
      const newCycle = Math.max(0.5, Math.min(4.0, parseFloat(value) || 2.0));
      if (this.currentVisualState) {
        this.currentVisualState.pulseRate = newCycle;
      }
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Updated dynamic transition config: ${key} = ${value}`
      );
    }
  }

  /**
   * @deprecated Use updateDynamicTransitionConfig instead
   * @since v1.0.0
   */
  private updateSmoothTransitionConfig(settingsPayload: any): void {
    return this.updateDynamicTransitionConfig(settingsPayload);
  }

  /**
   * Apply standardized visual effects CSS variables to DOM
   * 
   * @param targetElement - Element to apply variables to (defaults to document.documentElement)
   * 
   * @example
   * ```typescript
   * coordinator.applyStandardizedVisualVariables();
   * // Sets standardized --sn-visual-* CSS variables on :root
   * ```
   */
  public async applyStandardizedVisualVariables(targetElement?: HTMLElement): Promise<void> {
    if (!this.currentVisualState) return;

    const element = targetElement || document.documentElement;
    const state = this.currentVisualState;

    // Apply standardized CSS variables using the naming constants
    const standardizedVars: Record<string, string> = {
      [VISUAL_EFFECT_CSS_VARS.ENERGY_LEVEL]: state.energyLevel.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.FLOW_DIRECTION_X]: state.flowDirection.x.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.FLOW_DIRECTION_Y]: state.flowDirection.y.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.COLOR_TEMPERATURE]: state.colorTemperature.toString(),
      [VISUAL_EFFECT_CSS_VARS.ADAPTIVE_QUALITY]: state.adaptiveQuality.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.PARTICIPANT_COUNT]: this.registeredParticipants.size.toString(),
      [VISUAL_EFFECT_CSS_VARS.UPDATE_RATE]: (1000 / this.updateInterval).toString(),
      [VISUAL_EFFECT_CSS_VARS.PULSE_RATE]: state.pulseRate.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.TRANSITION_FLUIDITY]: state.transitionFluidity.toFixed(3),
      [VISUAL_EFFECT_CSS_VARS.SYSTEM_HARMONY]: state.systemHarmony.toFixed(3),
    };

    // Apply variables efficiently
    if (this.cssController) {
      for (const [varName, value] of Object.entries(standardizedVars)) {
        await this.cssController.setVariable("VisualEffectsCoordinator", varName, value, "normal", "standardized-vars");
      }
    } else {
      // Fallback to direct DOM manipulation
      for (const [varName, value] of Object.entries(standardizedVars)) {
        element.style.setProperty(varName, value);
      }
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        `Applied ${Object.keys(standardizedVars).length} standardized visual effect CSS variables`
      );
    }
  }

  // ===================================================================
  // PUBLIC API
  // ===================================================================

  /**
   * Get current visual effects state (read-only copy)
   */
  public getCurrentVisualEffectsState(): VisualEffectState | null {
    return this.currentVisualState
      ? { ...this.currentVisualState }
      : null;
  }

  /**
   * Get registered participants
   */
  public getRegisteredParticipants(): string[] {
    return Array.from(this.registeredParticipants.keys());
  }

  /**
   * Update dynamic transition configuration
   */
  public updateDynamicTransitionConfiguration(
    config: Partial<VisualDynamicTransitionConfig>
  ): void {
    this.transitionConfig = { ...this.transitionConfig, ...config };

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "VisualEffectsCoordinator",
        "Updated dynamic transition configuration:",
        config
      );
    }
  }

  /**
   * @deprecated Use updateDynamicTransitionConfiguration instead
   * @since v1.0.0
   */
  public updateSmoothTransitionConfiguration(
    config: Partial<VisualDynamicTransitionConfig>
  ): void {
    return this.updateDynamicTransitionConfiguration(config);
  }

  /**
   * Force visual effects state update (for debugging/testing)
   */
  public forceVisualEffectsStateUpdate(): void {
    this.updateVisualEffectsState();
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  // ===================================================================
  // BACKWARD COMPATIBILITY ALIASES
  // ===================================================================

  // ===================================================================
  // BACKWARD COMPATIBILITY ALIASES
  // ===================================================================

  /** @deprecated Use registerVisualEffectsParticipant instead */
  public registerConsciousnessParticipant(participant: BackgroundSystemParticipant): ParticipantRegistrationResult {
    return this.registerVisualEffectsParticipant(participant);
  }

  /** @deprecated Use unregisterVisualEffectsParticipant instead */
  public unregisterConsciousnessParticipant(systemName: string): void {
    this.unregisterVisualEffectsParticipant(systemName);
  }

  /** @deprecated Use getCurrentVisualEffectsState instead */
  public getCurrentConsciousnessField(): VisualEffectState | null {
    return this.getCurrentVisualEffectsState();
  }

  /** @deprecated Use forceVisualEffectsStateUpdate instead */
  public forceConsciousnessFieldUpdate(): void {
    this.forceVisualEffectsStateUpdate();
  }

  /** @deprecated Use registerVisualEffectsParticipant instead */
  public registerBackgroundSystemParticipant(participant: BackgroundSystemParticipant): ParticipantRegistrationResult {
    return this.registerVisualEffectsParticipant(participant);
  }

  /** @deprecated Use unregisterVisualEffectsParticipant instead */  
  public unregisterBackgroundSystemParticipant(systemName: string): void {
    this.unregisterVisualEffectsParticipant(systemName);
  }

  /** @deprecated Use getCurrentVisualEffectsState instead */
  public getCurrentBackgroundState(): VisualEffectState | null {
    return this.getCurrentVisualEffectsState();
  }

  /** @deprecated Use choreographEvent instead */
  public choreographBackgroundEvent(eventType: string, payload: VisualEffectEventPayload): void {
    return this.choreographEvent(eventType, payload);
  }
}
