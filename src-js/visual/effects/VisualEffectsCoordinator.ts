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
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { ChoreographyEventType, OrganicTransitionConfig } from "@/types/animationCoordination";

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
 * Background system participant interface
 */
export interface BackgroundSystemParticipant {
  systemName: string;
  onVisualStateUpdate(state: VisualEffectState): void;
  onVisualEffectEvent(eventType: string, payload: any): void;
  getVisualContribution(): Partial<VisualEffectState>;
}

/**
 * Visual effect event types for coordination
 */
export type VisualEffectEventType =
  | "visual:state-updated"
  | "visual:rhythm-shift"
  | "visual:color-shift"
  | "visual:energy-surge"
  | "visual:pulse-cycle"
  | "visual:transition-fluid"
  | "visual:scaling-change"
  | "visual:performance-adapt";

/**
 * Smooth transition configuration
 */
export interface SmoothTransitionConfig {
  enabled: boolean;
  transitionDuration: number; // milliseconds
  easingFunction: "smooth" | "harmonic" | "exponential" | "cubic";
  intensityFactor: number; // 0-2 transition intensity
  coherenceThreshold: number; // 0-1 minimum coherence for transitions
}

// ===================================================================
// VISUAL EFFECTS COORDINATOR
// ===================================================================

/**
 * VisualEffectsCoordinator - Coordinates background visual effects through shared state
 *
 * This system establishes shared visual effect state that background systems use for coordination,
 * allowing them to synchronize effects smoothly based on music analysis and performance metrics.
 */
export class VisualEffectsCoordinator implements IManagedSystem {
  private static instance: VisualEffectsCoordinator | null = null;
  public initialized: boolean = false;

  // Core dependencies
  private config: Year3000Config;
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

  // Smooth transition management
  private transitionConfig: SmoothTransitionConfig = {
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
    config: Year3000Config,
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

      // Create initial consciousness field
      this.currentVisualState = this.createInitialVisualState();

      // Start consciousness field updates
      this.startConsciousnessFieldUpdates();

      // Subscribe to relevant events
      this.subscribeToEvents();

      this.initialized = true;
      this.isActive = true;

      if (this.config.enableDebug) {
        Y3KDebug?.debug?.log(
          "BackgroundAnimationCoordinator",
          "Consciousness choreographer initialized"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "BackgroundAnimationCoordinator",
        "Failed to initialize:",
        error
      );
      throw error;
    }
  }

  public updateAnimation(deltaTime: number): void {
    // Update performance metrics
    this.performanceMetrics.lastUpdate = performance.now();

    // Consciousness field updates are handled by timer for organic rhythm
    // This keeps the system lightweight in animation loops
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const participantCount = this.registeredParticipants.size;
    const fieldAge = this.currentVisualState
      ? performance.now() - this.currentVisualState.timestamp
      : 0;
    const isHealthy = this.isActive && fieldAge < 1000 && participantCount > 0;

    return {
      system: "BackgroundAnimationCoordinator",
      healthy: isHealthy,
      ok: isHealthy,
      details: isHealthy
        ? "Consciousness choreography active"
        : "Consciousness field inactive or stale",
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
    // Stop consciousness field updates
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
        "BackgroundAnimationCoordinator",
        "Consciousness choreographer destroyed"
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
   * Update consciousness field with organic evolution
   */
  private updateConsciousnessField(): void {
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

    // Apply smooth transitions if enabled
    if (this.transitionConfig.enabled) {
      this.currentVisualState = this.applySmoothTransition(
        this.currentVisualState,
        newState
      );
    } else {
      this.currentVisualState = newState;
    }

    // Broadcast consciousness field update
    this.choreographConsciousnessUpdate();

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
        "BackgroundAnimationCoordinator",
        `Consciousness field evolved - Update #${
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
      // Apply participant contributions with organic blending
      for (const contribution of contributions) {
        if (contribution.fluidIntensity !== undefined) {
          state.fluidIntensity = this.organicBlend(
            state.fluidIntensity,
            contribution.fluidIntensity,
            0.1
          );
        }
        if (contribution.depthPerception !== undefined) {
          state.depthPerception = this.organicBlend(
            state.depthPerception,
            contribution.depthPerception,
            0.1
          );
        }
        if (contribution.luminosity !== undefined) {
          state.luminosity = this.organicBlend(
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
   * Apply smooth transition between visual effect states
   */
  private applySmoothTransition(
    current: VisualEffectState,
    target: VisualEffectState
  ): VisualEffectState {
    // Determine transition speed based on continuity and coherence
    const transitionSpeed = this.calculateSmoothTransitionSpeed(
      current,
      target
    );

    // Apply smooth easing function
    const easedProgress = this.applySmoothEasing(transitionSpeed);

    // Blend states smoothly
    return this.blendVisualStates(current, target, easedProgress);
  }

  /**
   * Calculate smooth transition speed based on state characteristics
   */
  private calculateSmoothTransitionSpeed(
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
   * Apply smooth easing function for visual transitions
   */
  private applySmoothEasing(progress: number): number {
    switch (this.transitionConfig.easingFunction) {
      case "smooth":
        // Smooth cubic bezier transition
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
   * Blend two visual effect states smoothly
   */
  private blendVisualStates(
    current: VisualEffectState,
    target: VisualEffectState,
    progress: number
  ): VisualEffectState {
    const blended: VisualEffectState = { ...current };

    // Blend numeric values
    blended.pulseRate = this.organicBlend(
      current.pulseRate,
      target.pulseRate,
      progress
    );
    blended.energyLevel = this.organicBlend(
      current.energyLevel,
      target.energyLevel,
      progress
    );
    blended.colorTemperature = this.organicBlend(
      current.colorTemperature,
      target.colorTemperature,
      progress
    );
    blended.fluidIntensity = this.organicBlend(
      current.fluidIntensity,
      target.fluidIntensity,
      progress
    );
    blended.depthPerception = this.organicBlend(
      current.depthPerception,
      target.depthPerception,
      progress
    );
    blended.luminosity = this.organicBlend(
      current.luminosity,
      target.luminosity,
      progress
    );
    blended.colorHarmony = this.organicBlend(
      current.colorHarmony,
      target.colorHarmony,
      progress
    );
    blended.visualCoherence = this.organicBlend(
      current.visualCoherence,
      target.visualCoherence,
      progress
    );
    // Keep pulseRate blending (already done above)
    blended.transitionFluidity = this.organicBlend(
      current.transitionFluidity,
      target.transitionFluidity,
      progress
    );
    blended.scalingFactor = this.organicBlend(
      current.scalingFactor,
      target.scalingFactor,
      progress
    );
    blended.effectDepth = this.organicBlend(
      current.effectDepth,
      target.effectDepth,
      progress
    );
    blended.systemHarmony = this.organicBlend(
      current.systemHarmony,
      target.systemHarmony,
      progress
    );
    blended.tempoModulation = this.organicBlend(
      current.tempoModulation,
      target.tempoModulation,
      progress
    );
    blended.harmonicComplexity = this.organicBlend(
      current.harmonicComplexity,
      target.harmonicComplexity,
      progress
    );
    blended.adaptiveQuality = this.organicBlend(
      current.adaptiveQuality,
      target.adaptiveQuality,
      progress
    );

    // Blend vectors
    blended.flowDirection = {
      x: this.organicBlend(
        current.flowDirection.x,
        target.flowDirection.x,
        progress
      ),
      y: this.organicBlend(
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
   * Organic blend function for smooth value transitions
   */
  private organicBlend(
    current: number,
    target: number,
    progress: number
  ): number {
    return current + (target - current) * progress;
  }

  // ===================================================================
  // PARTICIPANT MANAGEMENT
  // ===================================================================

  /**
   * Register a background system as a consciousness participant
   */
  public registerConsciousnessParticipant(
    participant: BackgroundSystemParticipant
  ): void {
    this.registeredParticipants.set(participant.systemName, participant);

    // Get initial contribution from participant
    const contribution = participant.getVisualContribution();
    this.participantContributions.set(participant.systemName, contribution);

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Registered participant: ${participant.systemName}`
      );
    }
  }

  /**
   * Unregister a consciousness participant
   */
  public unregisterConsciousnessParticipant(systemName: string): void {
    this.registeredParticipants.delete(systemName);
    this.participantContributions.delete(systemName);

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Unregistered participant: ${systemName}`
      );
    }
  }

  /**
   * Update participant contribution to consciousness field
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
   * Choreograph consciousness field update - broadcast to all participants
   */
  private choreographConsciousnessUpdate(): void {
    if (!this.currentVisualState) return;

    // Broadcast consciousness field update
    this.eventBus.emit(
      "consciousness:field-updated",
      {
        rhythmicPulse: this.currentVisualState.pulseRate,
        musicalFlow: this.currentVisualState.flowDirection,
        energyResonance: this.currentVisualState.energyLevel,
        depthPerception: this.currentVisualState.depthPerception,
        breathingCycle: this.currentVisualState.pulseRate
      }
    );

    // Notify registered participants directly
    for (const participant of this.registeredParticipants.values()) {
      try {
        participant.onVisualStateUpdate(this.currentVisualState);
      } catch (error) {
        Y3KDebug?.debug?.error(
          "BackgroundAnimationCoordinator",
          `Error updating participant ${participant.systemName}:`,
          error
        );
      }
    }

    this.performanceMetrics.coordinationEvents++;
  }

  /**
   * Choreograph specific event type
   */
  public choreographEvent(
    eventType: ChoreographyEventType,
    payload: any
  ): void {
    // Map to valid unified event names
    const mappedEvent = this.mapChoreographyEventToUnified(eventType);
    if (mappedEvent) {
      (this.eventBus as any).emit(mappedEvent.eventName, mappedEvent.payload);
    }

    // Notify participants
    for (const participant of this.registeredParticipants.values()) {
      try {
        participant.onVisualEffectEvent(eventType, payload);
      } catch (error) {
        Y3KDebug?.debug?.error(
          "BackgroundAnimationCoordinator",
          `Error sending choreography event to ${participant.systemName}:`,
          error
        );
      }
    }

    this.performanceMetrics.coordinationEvents++;

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Choreographed event: ${eventType}`,
        payload
      );
    }
  }

  // ===================================================================
  // CONSCIOUSNESS FIELD LIFECYCLE
  // ===================================================================

  /**
   * Start consciousness field updates
   */
  private startConsciousnessFieldUpdates(): void {
    if (this.fieldUpdateTimer) return;

    const updateLoop = () => {
      if (this.isActive) {
        this.updateConsciousnessField();
        this.fieldUpdateTimer = setTimeout(updateLoop, this.updateInterval);
      }
    };

    updateLoop();

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Started consciousness field updates (${this.updateInterval}ms interval)`
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
          transitionType: "organic",
        });
      }, "BackgroundAnimationCoordinator");

      this.eventBus.subscribe("emotion:analyzed", (payload: any) => {
        this.choreographEvent("intensity-peak", {
          intensity: payload?.energy || 0.5,
          affectedSystems: ["all"],
          surgeType: "full-spectrum",
          duration: 1000,
          falloffCurve: "organic",
        });
      }, "BackgroundAnimationCoordinator");
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
          adaptationType: "organic",
          reason: "automatic",
          affectedSystems: ["all"],
        });
      }, "BackgroundAnimationCoordinator");
    }

    // Subscribe to settings changes
    this.eventBus.subscribe("settings:visual-guide-changed", (payload: any) => {
      if (
        payload?.key?.includes("consciousness") ||
        payload?.key?.includes("choreography")
      ) {
        this.updateOrganicTransitionConfig(payload);
      }
    }, "BackgroundAnimationCoordinator");
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
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: "rhythm-shift" } };
      case "intensity-peak":
        return { eventName: "consciousness:intensity-changed", payload: { intensity: 0.8, userEngagement: 0.6, timestamp: Date.now() } };
      case "genre-transition":
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: "genre-transition" } };
      case "emotional-shift":
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: "emotional-shift" } };
      default:
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: eventType } };
    }
  }

  /**
   * Update organic transition configuration
   */
  private updateOrganicTransitionConfig(settingsPayload: any): void {
    // Handle settings that affect organic transitions
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
    } else if (key.includes("breathing-cycle")) {
      // This would update the breathing cycle if the user has control over it
      const newCycle = Math.max(0.5, Math.min(4.0, parseFloat(value) || 2.0));
      if (this.currentVisualState) {
        this.currentVisualState.pulseRate = newCycle;
      }
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Updated organic transition config: ${key} = ${value}`
      );
    }
  }

  // ===================================================================
  // PUBLIC API
  // ===================================================================

  /**
   * Get current consciousness field (read-only copy)
   */
  public getCurrentConsciousnessField(): VisualEffectState | null {
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
   * Update organic transition configuration
   */
  public updateOrganicTransitionConfiguration(
    config: Partial<OrganicTransitionConfig>
  ): void {
    this.transitionConfig = { ...this.transitionConfig, ...config };

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        "Updated organic transition configuration:",
        config
      );
    }
  }

  /**
   * Force consciousness field update (for debugging/testing)
   */
  public forceConsciousnessFieldUpdate(): void {
    this.updateConsciousnessField();
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }
}
