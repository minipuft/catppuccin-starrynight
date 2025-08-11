/**
 * BackgroundAnimationCoordinator - Year 3000 Organic Coordination System
 *
 * Creates a shared "consciousness field" that allows background systems to dance together
 * organically, like musicians in a jazz ensemble responding to the same rhythm.
 *
 * Core Philosophy:
 * - "Interfaces are not built—they are grown"
 * - "Every pixel breathes, every element grows, every interaction ripples through a living digital organism"
 * - Choreography over Orchestration: Systems coordinate through shared awareness, not commands
 *
 * Architecture:
 * - Creates ConsciousnessField - shared awareness space for background systems
 * - Broadcasts choreography events through GlobalEventBus for organic coordination
 * - Enables emergent behavior through biological-inspired state transitions
 * - Integrates music consciousness, aesthetic harmony, and performance awareness
 *
 * @architecture Phase 2.2 Background Consciousness Choreography
 * @performance Target: Enables organic coordination while reducing 60-80KB bundle
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

// ===================================================================
// CONSCIOUSNESS FIELD INTERFACES
// ===================================================================

/**
 * Vector2D for directional flow patterns
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * ConsciousnessField - Shared awareness space that background systems tune into
 *
 * This represents the "musical DNA" that flows through all systems, allowing them
 * to respond organically while maintaining beautiful coordination.
 */
export interface ConsciousnessField {
  // === MUSICAL CONSCIOUSNESS ===
  rhythmicPulse: number; // 0-1 beat intensity from music analysis
  musicalFlow: Vector2D; // Flow direction derived from music characteristics
  energyResonance: number; // 0-1 overall music energy level
  emotionalTemperature: number; // Color temperature (1000K-20000K) from music emotion
  tempoModulation: number; // 0-2 tempo-driven scaling factor
  harmonicComplexity: number; // 0-1 musical complexity for system sophistication

  // === VISUAL CONSCIOUSNESS ===
  liquidDensity: number; // 0-2 fluid dynamics intensity
  depthPerception: number; // 0-1 3D space illusion strength
  webglLuminosity: number; // 0-2 hardware acceleration intensity
  chromaticResonance: number; // 0-1 color harmony synchronization
  visualCoherence: number; // 0-1 how unified the visual systems appear

  // === ORGANIC TRANSITIONS ===
  breathingCycle: number; // 0.5-4.0 seconds - synchronized breathing rhythm
  membraneFluidityIndex: number; // 0-1 boundary fluidity between systems
  cellularGrowthRate: number; // 0.1-2.0 organic scaling factor
  consciousnessDepth: number; // 0-1 depth of consciousness integration
  symbioticResonance: number; // 0-1 how well systems resonate together

  // === PERFORMANCE AWARENESS ===
  deviceCapabilities: DeviceCapabilities;
  performanceMode: PerformanceMode;
  adaptiveQuality: number; // 0-1 current quality level
  thermalState: number; // 0-1 thermal throttling level
  batteryConservation: number; // 0-1 battery optimization level

  // === TEMPORAL CONSCIOUSNESS ===
  timestamp: number; // When this field was created
  evolutionPhase: number; // 0-1 how the consciousness has evolved
  continuityIndex: number; // 0-1 temporal continuity with previous state
}

/**
 * Background system participant interface
 */
export interface BackgroundSystemParticipant {
  systemName: string;
  onConsciousnessFieldUpdate(field: ConsciousnessField): void;
  onChoreographyEvent(eventType: string, payload: any): void;
  getConsciousnessContribution(): Partial<ConsciousnessField>;
}

/**
 * Choreography event types for organic coordination
 */
export type ChoreographyEventType =
  | "consciousness:field-updated"
  | "choreography:rhythm-shift"
  | "choreography:emotional-shift"
  | "choreography:energy-surge"
  | "consciousness:breathing-cycle"
  | "consciousness:membrane-fluid"
  | "consciousness:cellular-growth"
  | "consciousness:performance-adapt";

/**
 * Organic transition configuration
 */
export interface OrganicTransitionConfig {
  enabled: boolean;
  transitionDuration: number; // milliseconds
  easingFunction: "biological" | "harmonic" | "cellular" | "liquid";
  intensityFactor: number; // 0-2 transition intensity
  coherenceThreshold: number; // 0-1 minimum coherence for transitions
}

// ===================================================================
// BACKGROUND CONSCIOUSNESS CHOREOGRAPHER
// ===================================================================

/**
 * BackgroundAnimationCoordinator - Creates organic coordination through consciousness fields
 *
 * This system establishes a shared consciousness field that background systems can tune into,
 * allowing them to coordinate organically like a jazz ensemble rather than being mechanically controlled.
 */
export class BackgroundAnimationCoordinator implements IManagedSystem {
  private static instance: BackgroundAnimationCoordinator | null = null;
  public initialized: boolean = false;

  // Core dependencies
  private config: Year3000Config;
  private eventBus: typeof unifiedEventBus;
  private cssConsciousnessController: OptimizedCSSVariableManager | null =
    null;
  private performanceCoordinator: UnifiedPerformanceCoordinator | null = null;
  private musicSyncService: MusicSyncService | null = null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private emotionalGradientMapper: EmotionalGradientMapper | null = null;

  // Consciousness field management
  private currentConsciousnessField: ConsciousnessField | null = null;
  private previousConsciousnessField: ConsciousnessField | null = null;
  private fieldUpdateTimer: NodeJS.Timeout | null = null;
  private lastFieldUpdate: number = 0;

  // System participants
  private registeredParticipants: Map<string, BackgroundSystemParticipant> =
    new Map();
  private participantContributions: Map<string, Partial<ConsciousnessField>> =
    new Map();

  // Organic transition management
  private transitionConfig: OrganicTransitionConfig = {
    enabled: true,
    transitionDuration: 1000,
    easingFunction: "biological",
    intensityFactor: 1.0,
    coherenceThreshold: 0.3,
  };

  // Performance and monitoring
  private isActive: boolean = false;
  private updateInterval: number = 16; // 60fps consciousness updates
  private performanceMetrics = {
    fieldUpdates: 0,
    choreographyEvents: 0,
    animationTransitions: 0,
    lastUpdate: 0,
    averageUpdateTime: 0,
  };

  constructor(
    config: Year3000Config,
    cssConsciousnessController?: OptimizedCSSVariableManager,
    performanceCoordinator?: UnifiedPerformanceCoordinator,
    musicSyncService?: MusicSyncService,
    colorHarmonyEngine?: ColorHarmonyEngine
  ) {
    this.config = config;
    this.eventBus = unifiedEventBus;
    this.cssConsciousnessController = cssConsciousnessController || null;
    this.performanceCoordinator = performanceCoordinator || null;
    this.musicSyncService = musicSyncService || null;
    this.colorHarmonyEngine = colorHarmonyEngine || null;

    // Initialize emotional gradient mapper if we have the required dependencies
    if (this.cssConsciousnessController && this.musicSyncService) {
      this.emotionalGradientMapper = new EmotionalGradientMapper(
        this.cssConsciousnessController,
        this.musicSyncService
      );
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        "Consciousness choreographer created"
      );
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(
    config?: Year3000Config,
    cssConsciousnessController?: OptimizedCSSVariableManager,
    performanceCoordinator?: UnifiedPerformanceCoordinator,
    musicSyncService?: MusicSyncService,
    colorHarmonyEngine?: ColorHarmonyEngine
  ): BackgroundAnimationCoordinator {
    if (!BackgroundAnimationCoordinator.instance) {
      if (!config) {
        throw new Error(
          "BackgroundAnimationCoordinator requires configuration for first initialization"
        );
      }
      BackgroundAnimationCoordinator.instance =
        new BackgroundAnimationCoordinator(
          config,
          cssConsciousnessController,
          performanceCoordinator,
          musicSyncService,
          colorHarmonyEngine
        );
    }
    return BackgroundAnimationCoordinator.instance;
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
      this.currentConsciousnessField = this.createInitialConsciousnessField();

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
    const fieldAge = this.currentConsciousnessField
      ? performance.now() - this.currentConsciousnessField.timestamp
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
        fieldUpdates: this.performanceMetrics.fieldUpdates,
        choreographyEvents: this.performanceMetrics.choreographyEvents,
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
    this.currentConsciousnessField = null;
    this.previousConsciousnessField = null;
    this.isActive = false;
    this.initialized = false;

    // Reset singleton
    if (BackgroundAnimationCoordinator.instance === this) {
      BackgroundAnimationCoordinator.instance = null;
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        "Consciousness choreographer destroyed"
      );
    }
  }

  // ===================================================================
  // CONSCIOUSNESS FIELD MANAGEMENT
  // ===================================================================

  /**
   * Create initial consciousness field with default organic values
   */
  private createInitialConsciousnessField(): ConsciousnessField {
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
      // Musical consciousness - neutral starting values
      rhythmicPulse: 0.5,
      musicalFlow: { x: 0, y: 0 },
      energyResonance: 0.5,
      emotionalTemperature: 6500, // Neutral white
      tempoModulation: 1.0,
      harmonicComplexity: 0.5,

      // Visual consciousness - balanced starting values
      liquidDensity: 1.0,
      depthPerception: 0.7,
      webglLuminosity: deviceCapabilities.gpuAcceleration ? 1.2 : 0.8,
      chromaticResonance: 0.6,
      visualCoherence: 0.8,

      // Organic transitions - gentle breathing rhythm
      breathingCycle: 2.0, // 2 second breathing cycle
      membraneFluidityIndex: 0.5,
      cellularGrowthRate: 1.0,
      consciousnessDepth: 0.6,
      symbioticResonance: 0.7,

      // Performance awareness
      deviceCapabilities,
      performanceMode,
      adaptiveQuality: performanceMode.qualityLevel,
      thermalState: 0.0, // Cool
      batteryConservation: 0.0, // Not conserving

      // Temporal consciousness
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

    if (!this.currentConsciousnessField) {
      this.currentConsciousnessField = this.createInitialConsciousnessField();
      return;
    }

    // Store previous field for continuity
    this.previousConsciousnessField = { ...this.currentConsciousnessField };

    // Create new field based on current state + participant contributions + music analysis
    const newField = this.evolveConsciousnessField(
      this.currentConsciousnessField
    );

    // Apply organic transitions if enabled
    if (this.transitionConfig.enabled) {
      this.currentConsciousnessField = this.applyOrganicTransition(
        this.currentConsciousnessField,
        newField
      );
    } else {
      this.currentConsciousnessField = newField;
    }

    // Broadcast consciousness field update
    this.choreographConsciousnessUpdate();

    // Update performance metrics
    const updateTime = performance.now() - startTime;
    this.performanceMetrics.fieldUpdates++;
    this.performanceMetrics.averageUpdateTime =
      (this.performanceMetrics.averageUpdateTime + updateTime) / 2;

    if (
      this.config.enableDebug &&
      this.performanceMetrics.fieldUpdates % 60 === 0
    ) {
      Y3KDebug?.debug?.log(
        "BackgroundAnimationCoordinator",
        `Consciousness field evolved - Update #${
          this.performanceMetrics.fieldUpdates
        }, avg time: ${this.performanceMetrics.averageUpdateTime.toFixed(2)}ms`
      );
    }
  }

  /**
   * Evolve consciousness field based on music, participants, and organic growth
   */
  private evolveConsciousnessField(
    currentField: ConsciousnessField
  ): ConsciousnessField {
    // Start with current field
    const evolvedField: ConsciousnessField = { ...currentField };

    // Update temporal consciousness
    evolvedField.timestamp = performance.now();
    evolvedField.evolutionPhase = Math.min(
      1.0,
      evolvedField.evolutionPhase + 0.001
    ); // Slow evolution

    // Update from music consciousness if available
    this.updateFromMusicConsciousness(evolvedField);

    // Integrate participant contributions
    this.integrateParticipantContributions(evolvedField);

    // Apply organic growth patterns
    this.applyOrganicGrowthPatterns(evolvedField);

    // Update performance awareness
    this.updatePerformanceAwareness(evolvedField);

    // Calculate continuity with previous field
    if (this.previousConsciousnessField) {
      evolvedField.continuityIndex = this.calculateContinuityIndex(
        this.previousConsciousnessField,
        evolvedField
      );
    }

    return evolvedField;
  }

  /**
   * Update consciousness field from music analysis
   */
  private updateFromMusicConsciousness(field: ConsciousnessField): void {
    // Update from emotional gradient mapper if available
    if (this.emotionalGradientMapper) {
      const emotionalProfile =
        this.emotionalGradientMapper.getCurrentEmotionalProfile();
      if (emotionalProfile) {
        field.rhythmicPulse = emotionalProfile.energy;
        field.energyResonance = emotionalProfile.arousal;
        field.emotionalTemperature = 3000 + emotionalProfile.valence * 10000; // 3000K-13000K
        field.harmonicComplexity = emotionalProfile.complexity;

        // Update musical flow based on mood
        const moodFlowMap: { [key: string]: Vector2D } = {
          euphoric: { x: 1, y: 1 },
          aggressive: { x: -1, y: 1 },
          peaceful: { x: 0, y: -0.5 },
          melancholic: { x: -0.5, y: -1 },
          mysterious: { x: 0.7, y: 0 },
          contemplative: { x: 0, y: 0.3 },
        };

        field.musicalFlow = moodFlowMap[emotionalProfile.mood] || {
          x: 0,
          y: 0,
        };
        field.tempoModulation = 0.5 + emotionalProfile.energy * 1.5;
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
  private integrateParticipantContributions(field: ConsciousnessField): void {
    if (this.participantContributions.size === 0) return;

    // Collect contributions and apply weighted average
    let totalWeight = 0;
    const contributions: Partial<ConsciousnessField>[] = [];

    for (const [participantId, contribution] of this.participantContributions) {
      contributions.push(contribution);
      totalWeight += 1; // Equal weight for now
    }

    if (totalWeight > 0) {
      // Apply participant contributions with organic blending
      for (const contribution of contributions) {
        if (contribution.liquidDensity !== undefined) {
          field.liquidDensity = this.organicBlend(
            field.liquidDensity,
            contribution.liquidDensity,
            0.1
          );
        }
        if (contribution.depthPerception !== undefined) {
          field.depthPerception = this.organicBlend(
            field.depthPerception,
            contribution.depthPerception,
            0.1
          );
        }
        if (contribution.webglLuminosity !== undefined) {
          field.webglLuminosity = this.organicBlend(
            field.webglLuminosity,
            contribution.webglLuminosity,
            0.1
          );
        }
        // Add more field integrations as needed
      }
    }
  }

  /**
   * Apply organic growth patterns to consciousness field
   */
  private applyOrganicGrowthPatterns(field: ConsciousnessField): void {
    const time = performance.now() / 1000; // Convert to seconds

    // Apply breathing cycle modulation
    const breathingPhase = (time % field.breathingCycle) / field.breathingCycle;
    const breathingInfluence = Math.sin(breathingPhase * Math.PI * 2) * 0.1;

    field.cellularGrowthRate += breathingInfluence;
    field.membraneFluidityIndex = Math.max(
      0,
      Math.min(1, field.membraneFluidityIndex + breathingInfluence * 0.5)
    );

    // Apply organic evolution
    field.consciousnessDepth = Math.max(
      0,
      Math.min(1, field.consciousnessDepth + field.evolutionPhase * 0.001)
    );

    // Update symbiotic resonance based on system harmony
    field.symbioticResonance = Math.max(
      0,
      Math.min(1, (field.visualCoherence + field.continuityIndex) / 2)
    );
  }

  /**
   * Update performance awareness in consciousness field
   */
  private updatePerformanceAwareness(field: ConsciousnessField): void {
    if (this.performanceCoordinator) {
      // Update device capabilities and performance mode
      field.deviceCapabilities =
        this.performanceCoordinator.getDeviceCapabilities();
      field.performanceMode =
        this.performanceCoordinator.getCurrentPerformanceMode();
      field.adaptiveQuality = field.performanceMode.qualityLevel;

      // Update thermal and battery state
      const thermalState = this.performanceCoordinator.getThermalState();
      const batteryState = this.performanceCoordinator.getBatteryState();

      field.thermalState = thermalState.throttleLevel || 0;
      field.batteryConservation =
        batteryState && !batteryState.charging
          ? (1 - batteryState.level) * 0.5
          : 0;
    }
  }

  /**
   * Calculate continuity index between consciousness fields
   */
  private calculateContinuityIndex(
    previous: ConsciousnessField,
    current: ConsciousnessField
  ): number {
    // Calculate how similar the new field is to the previous one
    const metrics = [
      Math.abs(previous.rhythmicPulse - current.rhythmicPulse),
      Math.abs(previous.energyResonance - current.energyResonance),
      Math.abs(previous.liquidDensity - current.liquidDensity),
      Math.abs(previous.depthPerception - current.depthPerception),
      Math.abs(previous.webglLuminosity - current.webglLuminosity),
    ];

    const averageDifference =
      metrics.reduce((sum, diff) => sum + diff, 0) / metrics.length;
    return Math.max(0, Math.min(1, 1 - averageDifference));
  }

  /**
   * Apply organic transition between consciousness fields
   */
  private applyOrganicTransition(
    current: ConsciousnessField,
    target: ConsciousnessField
  ): ConsciousnessField {
    // Determine transition speed based on continuity and coherence
    const transitionSpeed = this.calculateOrganicTransitionSpeed(
      current,
      target
    );

    // Apply biological easing function
    const easedProgress = this.applyBiologicalEasing(transitionSpeed);

    // Blend fields organically
    return this.blendConsciousnessFields(current, target, easedProgress);
  }

  /**
   * Calculate organic transition speed based on field characteristics
   */
  private calculateOrganicTransitionSpeed(
    current: ConsciousnessField,
    target: ConsciousnessField
  ): number {
    const baseBeat = 1.0 / 60.0; // 60fps base rate
    const breathingModulation =
      1.0 +
      Math.sin(
        (performance.now() / 1000 / current.breathingCycle) * Math.PI * 2
      ) *
        0.2;
    const energyModulation = 0.5 + current.energyResonance * 1.5;

    return (
      baseBeat *
      breathingModulation *
      energyModulation *
      this.transitionConfig.intensityFactor
    );
  }

  /**
   * Apply biological easing function for organic transitions
   */
  private applyBiologicalEasing(progress: number): number {
    switch (this.transitionConfig.easingFunction) {
      case "biological":
        // Sigmoid curve mimicking biological growth
        return 1 / (1 + Math.exp(-10 * (progress - 0.5)));
      case "harmonic":
        // Sine wave for harmonic transitions
        return (Math.sin((progress - 0.5) * Math.PI) + 1) / 2;
      case "cellular":
        // Exponential growth curve
        return progress * progress;
      case "liquid":
        // Cubic bezier for liquid-like motion
        return progress * progress * (3 - 2 * progress);
      default:
        return progress;
    }
  }

  /**
   * Blend two consciousness fields organically
   */
  private blendConsciousnessFields(
    current: ConsciousnessField,
    target: ConsciousnessField,
    progress: number
  ): ConsciousnessField {
    const blended: ConsciousnessField = { ...current };

    // Blend numeric values
    blended.rhythmicPulse = this.organicBlend(
      current.rhythmicPulse,
      target.rhythmicPulse,
      progress
    );
    blended.energyResonance = this.organicBlend(
      current.energyResonance,
      target.energyResonance,
      progress
    );
    blended.emotionalTemperature = this.organicBlend(
      current.emotionalTemperature,
      target.emotionalTemperature,
      progress
    );
    blended.liquidDensity = this.organicBlend(
      current.liquidDensity,
      target.liquidDensity,
      progress
    );
    blended.depthPerception = this.organicBlend(
      current.depthPerception,
      target.depthPerception,
      progress
    );
    blended.webglLuminosity = this.organicBlend(
      current.webglLuminosity,
      target.webglLuminosity,
      progress
    );
    blended.chromaticResonance = this.organicBlend(
      current.chromaticResonance,
      target.chromaticResonance,
      progress
    );
    blended.visualCoherence = this.organicBlend(
      current.visualCoherence,
      target.visualCoherence,
      progress
    );
    blended.breathingCycle = this.organicBlend(
      current.breathingCycle,
      target.breathingCycle,
      progress
    );
    blended.membraneFluidityIndex = this.organicBlend(
      current.membraneFluidityIndex,
      target.membraneFluidityIndex,
      progress
    );
    blended.cellularGrowthRate = this.organicBlend(
      current.cellularGrowthRate,
      target.cellularGrowthRate,
      progress
    );
    blended.consciousnessDepth = this.organicBlend(
      current.consciousnessDepth,
      target.consciousnessDepth,
      progress
    );
    blended.symbioticResonance = this.organicBlend(
      current.symbioticResonance,
      target.symbioticResonance,
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
    blended.musicalFlow = {
      x: this.organicBlend(
        current.musicalFlow.x,
        target.musicalFlow.x,
        progress
      ),
      y: this.organicBlend(
        current.musicalFlow.y,
        target.musicalFlow.y,
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
    const contribution = participant.getConsciousnessContribution();
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
    contribution: Partial<ConsciousnessField>
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
    if (!this.currentConsciousnessField) return;

    // Broadcast consciousness field update
    this.eventBus.emit(
      "consciousness:field-updated",
      this.currentConsciousnessField
    );

    // Notify registered participants directly
    for (const participant of this.registeredParticipants.values()) {
      try {
        participant.onConsciousnessFieldUpdate(this.currentConsciousnessField);
      } catch (error) {
        Y3KDebug?.debug?.error(
          "BackgroundAnimationCoordinator",
          `Error updating participant ${participant.systemName}:`,
          error
        );
      }
    }

    this.performanceMetrics.choreographyEvents++;
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
        participant.onChoreographyEvent(eventType, payload);
      } catch (error) {
        Y3KDebug?.debug?.error(
          "BackgroundAnimationCoordinator",
          `Error sending choreography event to ${participant.systemName}:`,
          error
        );
      }
    }

    this.performanceMetrics.choreographyEvents++;

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
        this.choreographEvent("choreography:rhythm-shift", {
          newTrack: payload,
          transitionType: "organic",
        });
      }, "BackgroundAnimationCoordinator");

      this.eventBus.subscribe("emotion:analyzed", (payload: any) => {
        this.choreographEvent("choreography:energy-surge", {
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
        this.choreographEvent("consciousness:performance-adapt", {
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
      case "choreography:rhythm-shift":
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: "rhythm-shift" } };
      case "choreography:energy-surge":
        return { eventName: "consciousness:intensity-changed", payload: { intensity: 0.8, userEngagement: 0.6, timestamp: Date.now() } };
      case "consciousness:performance-adapt":
        return { eventName: "consciousness:coordination", payload: { source: "choreographer", type: "performance-adapt" } };
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
      if (this.currentConsciousnessField) {
        this.currentConsciousnessField.breathingCycle = newCycle;
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
  public getCurrentConsciousnessField(): ConsciousnessField | null {
    return this.currentConsciousnessField
      ? { ...this.currentConsciousnessField }
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
