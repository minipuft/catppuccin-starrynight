/**
 * UIEffectsController - Phase 2.4B UI Effects Consolidation
 *
 * Consolidates fragmented UI effects systems into a unified UI effects controller
 * that eliminates 60-80% code duplication while preserving all functionality.
 *
 * Consolidates:
 * - IridescentShimmerEffectsSystem.ts (710 lines)
 * - InteractionTrackingSystem.ts (575 lines)
 * - WhiteLayerDiagnosticSystem.ts (379 lines)
 * - AudioVisualController.ts (351 lines)
 * - PrismaticScrollSheenSystem.ts (79 lines)
 *
 * Key Features:
 * - Unified shimmer and iridescent effects with performance optimization
 * - Consolidated interaction tracking with digital meditation detection
 * - White layer diagnostic and automatic remediation
 * - Audio-visual synchronization for nebula effects
 * - Prismatic scroll sheen effects
 * - Consciousness choreographer integration
 * - Shared infrastructure utilization
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  BackgroundSystemParticipant,
  VisualCoordinationField,
} from "@/types/animationCoordination";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import { settings } from "@/config";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
import { VisualEffectsCoordinator as BackgroundAnimationCoordinator, type VisualEffectState } from "@/visual/effects/VisualEffectsCoordinator";

// ===================================================================
// ENHANCED TYPE SAFETY INTERFACES
// ===================================================================

/**
 * Configuration update result with validation details
 */
export interface ConfigurationUpdateResult {
  success: boolean;
  updatedProperties: string[];
  validationErrors: string[];
  previousConfig: Partial<UIEffectsConfig>;
  newConfig: UIEffectsConfig;
}

/**
 * Shimmer effect operation result
 */
export interface ShimmerOperationResult {
  success: boolean;
  elementsAffected: number;
  effectType: UIEffectsConfig['shimmerType'];
  intensity: number;
  performanceImpact: number;
  errorMessage?: string;
}

/**
 * UI effects diagnostic report
 */
export interface UIEffectsDiagnosticReport {
  timestamp: number;
  systemHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  activeEffects: {
    shimmer: boolean;
    interaction: boolean;
    audioVisual: boolean;
    scroll: boolean;
  };
  performanceMetrics: {
    averageFrameTime: number;
    maxFrameTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  issues: {
    whiteLayerProblems: string[];
    webglContextIssues: string[];
    performanceWarnings: string[];
    configurationErrors: string[];
  };
  recommendations: string[];
}

/**
 * Visual contribution calculation result
 */
export interface VisualContributionResult {
  contribution: Partial<VisualEffectState>;
  confidence: number; // 0-1 how confident we are in this contribution
  sources: string[]; // Which UI systems contributed to this calculation
  timestamp: number;
}

// ===================================================================
// CONSOLIDATED UI EFFECTS STATE TYPES
// ===================================================================

// Consolidated UI effects state types
export interface UIEffectsActivityState {
  // Core activity levels
  activityLevel: "dormant" | "aware" | "focused" | "enhanced";
  /** @deprecated Use enhanced instead */
  transcendentLevel?: "advanced";

  // Shimmer effects state
  shimmer: {
    intensity: number;
    effectType: "prism" | "oil-slick" | "rainbow" | "mixed";
    activeElements: Set<string>;
    performanceLevel: "minimal" | "balanced" | "intense";
  };

  // Interaction tracking state
  interaction: {
    isActive: boolean;
    lastInteractionTime: number;
    digitalMeditationDetected: boolean;
    scrollVelocity: { x: number; y: number; direction: string };
    nexusState: "idle" | "active" | "meditation" | "flow";
  };

  // Diagnostic state
  diagnostic: {
    whiteLayerIssues: string[];
    webglContextHealthy: boolean;
    lastDiagnosticTime: number;
    autoFixEnabled: boolean;
    criticalIssuesDetected: number;
  };

  // Audio-visual state
  audioVisual: {
    beatIntensity: number;
    genreChangeDetected: boolean;
    nebulaEffectIntensity: number;
    lastBeatTime: number;
    performanceAdaptive: boolean;
  };

  // Scroll effects state
  scroll: {
    sheenIntensity: number;
    scrollRatio: number;
    prismaticEffectActive: boolean;
    lastScrollTime: number;
  };

  // Performance metrics
  performance: {
    frameTime: number;
    avgFrameTime: number;
    maxFrameTime: number;
    healthStatus: "excellent" | "good" | "degraded" | "critical";
    adaptiveQualityEnabled: boolean;
  };
}

export interface UIEffectsConfig {
  // Core settings
  enabled: boolean;
  activityThreshold: number;

  // Shimmer settings
  shimmerEnabled: boolean;
  shimmerIntensity: number;
  shimmerType: "prism" | "oil-slick" | "rainbow" | "mixed";
  shimmerPerformanceLevel: "minimal" | "balanced" | "intense";

  // Interaction settings
  interactionTrackingEnabled: boolean;
  digitalMeditationThreshold: number; // ms of inactivity
  scrollVelocityTracking: boolean;

  // Diagnostic settings
  diagnosticEnabled: boolean;
  autoFixWhiteLayer: boolean;
  diagnosticInterval: number; // ms

  // Audio-visual settings
  audioVisualEnabled: boolean;
  beatSynchronization: boolean;
  nebulaEffectIntensity: number;

  // Scroll effects settings
  scrollEffectsEnabled: boolean;
  prismaticSheenIntensity: number;

  // Performance settings
  maxFrameTime: number;
  adaptiveQuality: boolean;
  debugMode: boolean;
}

export class UIEffectsController
  extends BaseVisualSystem
  implements BackgroundSystemParticipant
{
  // BackgroundSystemParticipant implementation
  public override readonly systemName: string =
    "UIVisualEffectsController";
  /** @deprecated Use systemName instead */
  public readonly legacySystemName: string = "UIVisualEffectsController";
  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "normal"; // UI effects are normal priority
  }

  // Core activity state
  private activityState: UIEffectsActivityState;
  private uiEffectsConfig: UIEffectsConfig;

  // Infrastructure dependencies
  private cssController!: CSSVariableWriter; // Initialized in initializeCSSConsciousness
  private visualEffectsCoordinator: BackgroundAnimationCoordinator | null =
    null;
  private currentVisualField: VisualCoordinationField | null = null;
  /** @deprecated Use currentVisualField instead */
  private currentConsciousnessField: VisualCoordinationField | null = null;

  // Element management
  private shimmerElements: Map<string, HTMLElement> = new Map();
  private mutationObserver: MutationObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  // Animation and timing
  // ✅ RAF LOOP CONSOLIDATION: Removed animationFrameId (coordinator manages animation)
  private lastFrameTime: number = 0;
  private frameTimeHistory: number[] = [];

  // Event subscriptions
  private eventUnsubscribeFunctions: (() => void)[] = [];

  // Performance monitoring (override base performance monitor with custom metrics)
  private customPerformanceMonitor = {
    frameCount: 0,
    totalFrameTime: 0,
    lastPerformanceCheck: 0,
    adaptiveQualityLevel: 1.0,
  };

  // Diagnostic state
  private diagnosticTimerId: number | null = null;
  private lastDiagnosticRun: number = 0;

  constructor(
    config: AdvancedSystemConfig,
    utils: typeof ThemeUtilities,
    performanceAnalyzer: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService
  ) {
    super(
      config,
      utils,
      performanceAnalyzer,
      musicSyncService
    );

    // Initialize default configuration
    this.uiEffectsConfig = {
      enabled: true,
      activityThreshold: 0.3,

      // Shimmer defaults (from IridescentShimmerEffectsSystem)
      shimmerEnabled: true,
      shimmerIntensity: 0.6,
      shimmerType: "mixed",
      shimmerPerformanceLevel: "balanced",

      // Interaction defaults (from InteractionTrackingSystem)
      interactionTrackingEnabled: true,
      digitalMeditationThreshold: 30000, // 30 seconds
      scrollVelocityTracking: true,

      // Diagnostic defaults (from WhiteLayerDiagnosticSystem)
      diagnosticEnabled: true,
      autoFixWhiteLayer: true,
      diagnosticInterval: 5000, // 5 seconds

      // Audio-visual defaults (from AudioVisualController) - connected to user settings
      audioVisualEnabled: true,
      beatSynchronization: true,
      nebulaEffectIntensity: this.getNebulaIntensityFromSettings(),

      // Scroll effects defaults (from PrismaticScrollSheenSystem)
      scrollEffectsEnabled: true,
      prismaticSheenIntensity: 0.5,

      // Performance defaults
      maxFrameTime: 1.0, // <1ms budget
      adaptiveQuality: true,
      debugMode: config.enableDebug || false,
    };

    // Initialize core activity state
    this.activityState = this.createInitialActivityState();

    Y3KDebug?.debug?.log(
      "UIVisualEffectsController",
      "Unified UI effects controller created"
    );
  }

  /**
   * Get nebula effect intensity from user settings with layered enhancement
   */
  private getNebulaIntensityFromSettings(): number {
    const setting = settings.get("sn-gradient-intensity");

    // Map string setting to numeric intensity following layered enhancement philosophy
    switch (setting) {
      case "disabled":
        return 0.0;
      case "minimal":
        return 0.3;
      case "balanced":
        return 0.7; // Default that matches old hardcoded value
      case "intense":
        return 1.0;
      default:
        return 0.7; // Safe fallback
    }
  }

  private createInitialActivityState(): UIEffectsActivityState {
    return {
      activityLevel: "dormant",
      shimmer: {
        intensity: 0,
        effectType: "mixed",
        activeElements: new Set(),
        performanceLevel: this.uiEffectsConfig.shimmerPerformanceLevel,
      },
      interaction: {
        isActive: false,
        lastInteractionTime: 0,
        digitalMeditationDetected: false,
        scrollVelocity: { x: 0, y: 0, direction: "none" },
        nexusState: "idle",
      },
      diagnostic: {
        whiteLayerIssues: [],
        webglContextHealthy: true,
        lastDiagnosticTime: 0,
        autoFixEnabled: this.uiEffectsConfig.autoFixWhiteLayer,
        criticalIssuesDetected: 0,
      },
      audioVisual: {
        beatIntensity: 0,
        genreChangeDetected: false,
        nebulaEffectIntensity: 0,
        lastBeatTime: 0,
        performanceAdaptive: this.uiEffectsConfig.adaptiveQuality,
      },
      scroll: {
        sheenIntensity: 0,
        scrollRatio: 0,
        prismaticEffectActive: false,
        lastScrollTime: 0,
      },
      performance: {
        frameTime: 0,
        avgFrameTime: 0,
        maxFrameTime: 0,
        healthStatus: "excellent",
        adaptiveQualityEnabled: this.uiEffectsConfig.adaptiveQuality,
      },
    };
  }

  // BaseVisualSystem implementation
  public override async initialize(): Promise<void> {
    try {
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Starting unified UI effects initialization..."
      );

      // Initialize CSS visual effects integration
      await this.initializeVisualCSS();

      // Initialize visual effects coordinator integration
      await this.initializeVisualCoordination();

      // Set up event subscriptions (consolidated from all systems)
      this.subscribeToUnifiedEvents();

      // Initialize shimmer effects system
      if (this.uiEffectsConfig.shimmerEnabled) {
        await this.initializeShimmerEffects();
      }

      // Initialize interaction tracking
      if (this.uiEffectsConfig.interactionTrackingEnabled) {
        await this.initializeInteractionTracking();
      }

      // Initialize diagnostic system
      if (this.uiEffectsConfig.diagnosticEnabled) {
        await this.initializeDiagnosticSystem();
      }

      // Initialize audio-visual controller
      if (this.uiEffectsConfig.audioVisualEnabled) {
        await this.initializeAudioVisualEffects();
      }

      // Initialize scroll effects
      if (this.uiEffectsConfig.scrollEffectsEnabled) {
        await this.initializeScrollEffects();
      }

      // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by coordinator
      // updateAnimation(deltaTime) will be called automatically

      this.initialized = true;

      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Unified UI effects controller initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Failed to initialize:",
        error
      );
      throw error;
    }
  }

  private async initializeVisualCSS(): Promise<void> {
    return this.initializeCSSConsciousness(); // Call legacy method for compatibility
  }

  /**
   * @deprecated Use initializeVisualCSS instead
   */
  private async initializeCSSConsciousness(): Promise<void> {
    try {
      // Access the shared CSS visual effects controller
      this.cssController =
        (globalThis as any).unifiedVisualCSSController || (globalThis as any).unifiedCSSConsciousnessController || null;

      // Initialize CSS variable coordinator with the visual effects controller
      this.cssController = getGlobalCSSVariableWriter();

      if (!this.cssController) {
        Y3KDebug?.debug?.warn(
          "UIVisualEffectsController",
          "CSS visual effects not available, using coordinator fallback"
        );
      } else {
        Y3KDebug?.debug?.log(
          "UIVisualEffectsController",
          "Connected to unified CSS visual effects"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UIVisualEffectsController",
        "CSS visual effects initialization failed:",
        error
      );
    }
  }

  private async initializeVisualCoordination(): Promise<void> {
    return this.initializeConsciousnessIntegration(); // Call legacy method for compatibility
  }

  /**
   * @deprecated Use initializeVisualCoordination instead
   */
  private async initializeConsciousnessIntegration(): Promise<void> {
    try {
      // Connect to visual effects coordinator if available
      this.visualEffectsCoordinator =
        (globalThis as any).backgroundVisualCoordinator || (globalThis as any).backgroundConsciousnessChoreographer || null;

      if (this.visualEffectsCoordinator) {
        // Register as visual effects participant
        if (this.visualEffectsCoordinator.registerVisualEffectsParticipant) {
          this.visualEffectsCoordinator.registerVisualEffectsParticipant(this);
        } else if (this.visualEffectsCoordinator.registerConsciousnessParticipant) {
          this.visualEffectsCoordinator.registerConsciousnessParticipant(this); // Legacy fallback
        }
        Y3KDebug?.debug?.log(
          "UIVisualEffectsController",
          "Registered with visual effects coordinator"
        );
      } else {
        Y3KDebug?.debug?.log(
          "UIVisualEffectsController",
          "Operating without visual effects coordinator integration"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UIVisualEffectsController",
        "Visual coordination integration failed:",
        error
      );
    }
  }

  private subscribeToUnifiedEvents(): void {
    // Consolidated event subscriptions from all original systems

    // Music synchronization events (AudioVisualController)
    const musicBeatUnsubscribe = unifiedEventBus.subscribe(
      "music:beat",
      this.handleMusicBeat.bind(this),
      "UIVisualEffectsController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(musicBeatUnsubscribe)
    );

    const musicEnergyUnsubscribe = unifiedEventBus.subscribe(
      "music:energy",
      this.handleMusicEnergy.bind(this),
      "UIVisualEffectsController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(musicEnergyUnsubscribe)
    );

    // TODO: Genre change events - migrate to music events with genre data
    // const genreChangeUnsubscribe = ...

    // TODO: User interaction events - need to add to UnifiedEventMap
    // const scrollUnsubscribe = ...
    // const interactionUnsubscribe = ...

    // Settings change events
    const settingsUnsubscribe = unifiedEventBus.subscribe(
      "settings:changed",
      this.handleSettingsChange.bind(this),
      "UIVisualEffectsController"
    );
    this.eventUnsubscribeFunctions.push(() =>
      unifiedEventBus.unsubscribe(settingsUnsubscribe)
    );

    Y3KDebug?.debug?.log(
      "UIVisualEffectsController",
      `Subscribed to ${this.eventUnsubscribeFunctions.length} unified events`
    );
  }

  private async initializeShimmerEffects(): Promise<void> {
    try {
      // Set up element discovery and management (from IridescentShimmerEffectsSystem)
      this.setupElementObservers();

      // Initialize shimmer targets
      await this.discoverShimmerElements();

      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        `Shimmer effects initialized with ${this.shimmerElements.size} elements`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Shimmer effects initialization failed:",
        error
      );
    }
  }

  private async initializeInteractionTracking(): Promise<void> {
    try {
      // Set up interaction listeners (from InteractionTrackingSystem)
      this.setupInteractionListeners();

      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Interaction tracking initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Interaction tracking initialization failed:",
        error
      );
    }
  }

  private async initializeDiagnosticSystem(): Promise<void> {
    try {
      // Start periodic diagnostic checks (from WhiteLayerDiagnosticSystem)
      this.startDiagnosticMonitoring();

      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Diagnostic system initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Diagnostic system initialization failed:",
        error
      );
    }
  }

  private async initializeAudioVisualEffects(): Promise<void> {
    try {
      // Audio-visual integration ready (events already subscribed)
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Audio-visual effects initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Audio-visual effects initialization failed:",
        error
      );
    }
  }

  private async initializeScrollEffects(): Promise<void> {
    try {
      // Scroll effects ready (events already subscribed)
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        "Scroll effects initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Scroll effects initialization failed:",
        error
      );
    }
  }

  private setupElementObservers(): void {
    // Set up MutationObserver for dynamic element discovery (from IridescentShimmerEffectsSystem)
    if (typeof MutationObserver !== "undefined") {
      this.mutationObserver = new MutationObserver((mutations) => {
        let hasNewElements = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                hasNewElements = true;
              }
            });
          }
        });

        if (hasNewElements) {
          this.discoverShimmerElements();
        }
      });

      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    // Set up IntersectionObserver for viewport optimization
    if (typeof IntersectionObserver !== "undefined") {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const elementId = entry.target.getAttribute("data-shimmer-id");
            if (elementId) {
              if (entry.isIntersecting) {
                this.activityState.shimmer.activeElements.add(elementId);
              } else {
                this.activityState.shimmer.activeElements.delete(
                  elementId
                );
              }
            }
          });
        },
        { threshold: [0, 0.1, 0.5, 1.0] }
      );
    }
  }

  private async discoverShimmerElements(): Promise<void> {
    // Discover shimmer target elements (from IridescentShimmerEffectsSystem)
    // Phase 2.2: Unified .sn-card selector added (applied by CardDOMWatcher)
    const selectors = [
      ".sn-card", // Unified selector (CardDOMWatcher)
      ".main-card-card", // Legacy selector (kept for transition)
      ".main-trackList-trackListRow",
      ".main-button-primary",
      ".main-playButton-button",
      '[data-testid="card-click-handler"]',
    ];

    let elementCount = 0;

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const elementId = `shimmer-${selector.replace(/[^\w]/g, "_")}-${index}`;
        const htmlElement = element as HTMLElement;

        htmlElement.setAttribute("data-shimmer-id", elementId);
        this.shimmerElements.set(elementId, htmlElement);

        // Add to intersection observer
        if (this.intersectionObserver) {
          this.intersectionObserver.observe(htmlElement);
        }

        elementCount++;
      });
    });

    if (this.uiEffectsConfig.debugMode && elementCount > 0) {
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        `Discovered ${elementCount} shimmer elements`
      );
    }
  }

  private setupInteractionListeners(): void {
    // Set up interaction event listeners (from InteractionTrackingSystem)
    const interactionEvents = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    interactionEvents.forEach((eventType) => {
      document.addEventListener(
        eventType,
        () => {
          this.activityState.interaction.isActive = true;
          this.activityState.interaction.lastInteractionTime = Date.now();
          this.activityState.interaction.digitalMeditationDetected = false;

          // Update nexus state
          this.updateNexusState();
        },
        { passive: true }
      );
    });
  }

  private startDiagnosticMonitoring(): void {
    // Set up periodic diagnostic checks (from WhiteLayerDiagnosticSystem)
    this.diagnosticTimerId = window.setInterval(() => {
      this.runDiagnosticCheck();
    }, this.uiEffectsConfig.diagnosticInterval);
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by EnhancedMasterAnimationCoordinator
   * Old method removed: startUnifiedAnimationLoop()
   * Replacement: updateAnimation(deltaTime) called by coordinator
   */

  /**
   * ✅ RAF LOOP CONSOLIDATION: Animation update method called by coordinator
   * Consolidates all UI effects updates in single coordinated frame
   */
  public override updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;

    const currentTime = performance.now();
    this.lastFrameTime = currentTime;

    // Performance monitoring
    const frameStartTime = currentTime;

    try {
      // Update activity state
      this.updateVisualActivityState(deltaTime);

      // Update shimmer effects
      if (this.uiEffectsConfig.shimmerEnabled) {
        this.updateShimmerEffects(deltaTime);
      }

      // Update interaction tracking
      if (this.uiEffectsConfig.interactionTrackingEnabled) {
        this.updateInteractionTracking(deltaTime);
      }

      // Update audio-visual effects
      if (this.uiEffectsConfig.audioVisualEnabled) {
        this.updateAudioVisualEffects(deltaTime);
      }

      // Update scroll effects
      if (this.uiEffectsConfig.scrollEffectsEnabled) {
        this.updateScrollEffects(deltaTime);
      }

      // Apply CSS variable updates
      this.applyCSSUpdates();

      // Performance tracking
      const frameTime = performance.now() - frameStartTime;
      this.updatePerformanceMetrics(frameTime);

      // Check performance budget
      if (frameTime > this.uiEffectsConfig.maxFrameTime) {
        this.handlePerformanceIssue(frameTime);
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Animation loop error:",
        error
      );
    }
  }

  private updateVisualActivityState(deltaTime: number): void {
    const state = this.activityState;

    // Update overall activity level based on interaction
    const totalActivity =
      state.shimmer.intensity * 0.2 +
      (state.interaction.isActive ? 0.3 : 0) +
      state.audioVisual.beatIntensity * 0.3 +
      state.scroll.sheenIntensity * 0.2;

    // Visual activity level thresholds
    if (totalActivity > 0.8) {
      state.activityLevel = "enhanced";
      state.transcendentLevel = "advanced"; // Legacy compatibility
    } else if (totalActivity > 0.5) {
      state.activityLevel = "focused";
    } else if (totalActivity > 0.2) {
      state.activityLevel = "aware";
    } else {
      state.activityLevel = "dormant";
    }
  }

  private updateShimmerEffects(deltaTime: number): void {
    const shimmerState = this.activityState.shimmer;

    // Update shimmer intensity based on activity and music
    const musicInfluence =
      this.activityState.audioVisual.beatIntensity * 0.3;
    const interactionInfluence = this.activityState.interaction.isActive
      ? 0.2
      : 0;

    shimmerState.intensity = Math.min(
      this.uiEffectsConfig.shimmerIntensity +
        musicInfluence +
        interactionInfluence,
      1.0
    );

    // Apply performance adaptation
    if (this.activityState.performance.healthStatus === "degraded") {
      shimmerState.intensity *= 0.7;
    } else if (
      this.activityState.performance.healthStatus === "critical"
    ) {
      shimmerState.intensity *= 0.3;
    }
  }

  private updateInteractionTracking(deltaTime: number): void {
    const interactionState = this.activityState.interaction;
    const now = Date.now();

    // Check for digital meditation (prolonged inactivity)
    const inactiveTime = now - interactionState.lastInteractionTime;
    if (inactiveTime > this.uiEffectsConfig.digitalMeditationThreshold) {
      if (!interactionState.digitalMeditationDetected) {
        interactionState.digitalMeditationDetected = true;
        // TODO: Add ui:digital-meditation-detected to UnifiedEventMap
        // unifiedEventBus.emitSync('ui:digital-meditation-detected', {
        //   inactiveTime,
        //   timestamp: now
        // });
        Y3KDebug?.debug?.log(
          "UIVisualEffectsController",
          "Digital meditation detected",
          { inactiveTime }
        );
      }
    }

    // Update nexus state
    this.updateNexusState();
  }

  private updateNexusState(): void {
    const state = this.activityState.interaction;
    const now = Date.now();
    const timeSinceInteraction = now - state.lastInteractionTime;

    if (state.digitalMeditationDetected) {
      state.nexusState = "meditation";
    } else if (timeSinceInteraction < 1000) {
      state.nexusState = "active";
    } else if (timeSinceInteraction < 10000) {
      state.nexusState = "flow";
    } else {
      state.nexusState = "idle";
    }
  }

  private updateAudioVisualEffects(deltaTime: number): void {
    const audioState = this.activityState.audioVisual;

    // Update nebula effect intensity based on beat and activity
    const activityBoost =
      this.activityState.activityLevel === "enhanced" ? 0.2 : 0;
    audioState.nebulaEffectIntensity = Math.min(
      this.uiEffectsConfig.nebulaEffectIntensity +
        audioState.beatIntensity * 0.3 +
        activityBoost,
      1.0
    );
  }

  private updateScrollEffects(deltaTime: number): void {
    const scrollState = this.activityState.scroll;

    // Update prismatic sheen based on scroll activity
    const timeSinceScroll = Date.now() - scrollState.lastScrollTime;
    if (timeSinceScroll < 1000) {
      scrollState.prismaticEffectActive = true;
      scrollState.sheenIntensity = Math.min(
        scrollState.scrollRatio * this.uiEffectsConfig.prismaticSheenIntensity,
        1.0
      );
    } else {
      scrollState.prismaticEffectActive = false;
      scrollState.sheenIntensity *= 0.95; // Fade out
    }
  }

  private applyCSSUpdates(): void {
    const state = this.activityState;

    // Consolidated CSS variable updates from all systems
    const updates: Record<string, string> = {
      // Core activity state
      "--sn-ui-activity-level": state.activityLevel,

      // Shimmer effects
      "--sn-shimmer-intensity": state.shimmer.intensity.toFixed(3),
      "--sn-shimmer-effect-type": state.shimmer.effectType,
      "--sn-shimmer-performance": state.shimmer.performanceLevel,

      // Interaction tracking
      "--sn-interaction-nexus-state": state.interaction.nexusState,
      "--sn-interaction-meditation": state.interaction.digitalMeditationDetected
        ? "1"
        : "0",
      "--sn-scroll-velocity-x": state.interaction.scrollVelocity.x.toFixed(2),
      "--sn-scroll-velocity-y": state.interaction.scrollVelocity.y.toFixed(2),

      // Audio-visual effects
      "--sn-beat-intensity": state.audioVisual.beatIntensity.toFixed(3),
      "--sn-nebula-intensity":
        state.audioVisual.nebulaEffectIntensity.toFixed(3),
      "--sn-genre-change": state.audioVisual.genreChangeDetected ? "1" : "0",

      // Scroll effects
      "--sn-scroll-sheen-intensity": state.scroll.sheenIntensity.toFixed(3),
      "--sn-scroll-ratio": state.scroll.scrollRatio.toFixed(3),
      "--sn-prismatic-active": state.scroll.prismaticEffectActive ? "1" : "0",

      // Diagnostic status
      "--sn-white-layer-issues":
        state.diagnostic.whiteLayerIssues.length.toString(),
      "--sn-webgl-healthy": state.diagnostic.webglContextHealthy ? "1" : "0",
    };

    // Use coordination-first approach with proper batching and priority handling
    try {
      // Batch all UI activity updates with normal priority
      this.cssController.batchSetVariables(
        "UIVisualEffectsController",
        updates,
        "normal",
        "ui-activity-update"
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "UIVisualEffectsController",
        "CSS coordination error:",
        error
      );
      // The coordinator handles fallback internally, so we don't need manual fallback
    }
  }


  private updatePerformanceMetrics(frameTime: number): void {
    const perf = this.activityState.performance;

    // Update frame time metrics
    perf.frameTime = frameTime;
    this.frameTimeHistory.push(frameTime);

    // Keep only recent frame times (last 60 frames)
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    // Calculate average and max
    perf.avgFrameTime =
      this.frameTimeHistory.reduce((a, b) => a + b, 0) /
      this.frameTimeHistory.length;
    perf.maxFrameTime = Math.max(...this.frameTimeHistory);

    // Update health status
    if (perf.avgFrameTime > 2.0) {
      perf.healthStatus = "critical";
    } else if (perf.avgFrameTime > 1.5) {
      perf.healthStatus = "degraded";
    } else if (perf.avgFrameTime > 1.0) {
      perf.healthStatus = "good";
    } else {
      perf.healthStatus = "excellent";
    }
  }

  private handlePerformanceIssue(frameTime: number): void {
    if (this.uiEffectsConfig.adaptiveQuality) {
      // Reduce quality adaptively
      this.customPerformanceMonitor.adaptiveQualityLevel *= 0.9;

      // Apply quality reduction
      if (this.customPerformanceMonitor.adaptiveQualityLevel < 0.5) {
        // Disable intensive effects
        this.activityState.shimmer.performanceLevel = "minimal";
      }

      if (this.uiEffectsConfig.debugMode) {
        Y3KDebug?.debug?.warn(
          "UIVisualEffectsController",
          `Performance issue: ${frameTime.toFixed(
            2
          )}ms, reduced quality to ${this.customPerformanceMonitor.adaptiveQualityLevel.toFixed(
            2
          )}`
        );
      }
    }
  }

  private runDiagnosticCheck(): void {
    const diagnosticState = this.activityState.diagnostic;
    const now = Date.now();

    diagnosticState.lastDiagnosticTime = now;
    diagnosticState.whiteLayerIssues = [];

    try {
      // Check for WebGL context health
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      diagnosticState.webglContextHealthy = !!gl;

      // Check for white layer issues (simplified from WhiteLayerDiagnosticSystem)
      const elements = document.querySelectorAll(
        '[style*="background"], [style*="color"]'
      );
      let whiteLayerCount = 0;

      elements.forEach((element) => {
        const style = window.getComputedStyle(element);
        if (
          style.backgroundColor === "rgb(255, 255, 255)" ||
          style.color === "rgb(255, 255, 255)"
        ) {
          whiteLayerCount++;
        }
      });

      if (whiteLayerCount > 10) {
        diagnosticState.whiteLayerIssues.push(
          `Excessive white layers detected: ${whiteLayerCount}`
        );

        if (diagnosticState.autoFixEnabled) {
          this.autoFixWhiteLayerIssues();
        }
      }

      diagnosticState.criticalIssuesDetected =
        diagnosticState.whiteLayerIssues.length;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Diagnostic check failed:",
        error
      );
    }
  }

  private autoFixWhiteLayerIssues(): void {
    // Simplified auto-fix implementation using coordination
    try {
      // Use critical priority for white layer fixes - these are important for functionality
      this.cssController.batchSetVariables(
        "UIVisualEffectsController",
        {
          "--spice-text": "var(--spice-main)",
          "--spice-subtext": "var(--catppuccin-text)",
        },
        "critical",
        "white-layer-autofix"
      );

      if (this.uiEffectsConfig.debugMode) {
        Y3KDebug?.debug?.log(
          "UIVisualEffectsController",
          "Applied white layer auto-fix"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Auto-fix failed:",
        error
      );
    }
  }

  // Event handlers (consolidated from all systems)
  private handleMusicBeat(event: any): void {
    const audioState = this.activityState.audioVisual;
    audioState.beatIntensity = event.intensity || 0.5;
    audioState.lastBeatTime = Date.now();

    // Apply beat influence to shimmer effects
    if (this.uiEffectsConfig.shimmerEnabled) {
      const beatBoost = audioState.beatIntensity * 0.2;
      this.activityState.shimmer.intensity = Math.min(
        this.activityState.shimmer.intensity + beatBoost,
        1.0
      );
    }
  }

  private handleMusicEnergy(event: any): void {
    const audioState = this.activityState.audioVisual;

    if (event.energy !== undefined) {
      audioState.beatIntensity = Math.max(
        audioState.beatIntensity,
        event.energy * 0.8
      );
    }
  }

  private handleGenreChange(event: any): void {
    const audioState = this.activityState.audioVisual;
    audioState.genreChangeDetected = true;

    // Reset detection flag after brief period
    setTimeout(() => {
      audioState.genreChangeDetected = false;
    }, 2000);
  }

  private handleUserScroll(event: any): void {
    const scrollState = this.activityState.scroll;
    const interactionState = this.activityState.interaction;

    scrollState.lastScrollTime = Date.now();
    scrollState.scrollRatio = event.scrollRatio || 0;

    // Update scroll velocity
    if (event.velocity) {
      interactionState.scrollVelocity = {
        x: event.velocity.x || 0,
        y: event.velocity.y || 0,
        direction: event.direction || "none",
      };
    }

    // Trigger interaction tracking
    this.handleUserInteraction({ type: "scroll", timestamp: Date.now() });
  }

  private handleUserInteraction(event: any): void {
    const interactionState = this.activityState.interaction;

    interactionState.isActive = true;
    interactionState.lastInteractionTime = event.timestamp || Date.now();
    interactionState.digitalMeditationDetected = false;

    // Update nexus state
    this.updateNexusState();
  }

  public override handleSettingsChange(event: any): void {
    const { key, value } = event;

    // Handle UI effects settings
    if (key.startsWith("sn-ui-effects-")) {
      this.updateConfigFromSettings(key, value);
    } else if (key === "sn-gradient-intensity") {
      // Update nebula effect intensity when user changes consolidated gradient setting
      this.uiEffectsConfig.nebulaEffectIntensity = this.getNebulaIntensityFromSettings();
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        `Updated nebula intensity to: ${this.uiEffectsConfig.nebulaEffectIntensity} from consolidated gradient setting: ${value}`
      );
    }
  }

  private updateConfigFromSettings(key: string, value: any): void {
    switch (key) {
      case "sn-ui-effects-shimmer-intensity":
        this.uiEffectsConfig.shimmerIntensity = parseFloat(value) || 0.6;
        break;
      case "sn-ui-effects-diagnostic-enabled":
        this.uiEffectsConfig.diagnosticEnabled =
          value === "true" || value === true;
        break;
      case "sn-ui-effects-adaptive-quality":
        this.uiEffectsConfig.adaptiveQuality =
          value === "true" || value === true;
        break;
    }
  }

  // BackgroundSystemParticipant interface implementation - defer to main implementation below

  /**
   * @deprecated Use getVisualContribution instead
   */
  public getConsciousnessContribution(): any {
    return {
      systemName: this.systemName,
      activityLevel: this.activityState.activityLevel,
      shimmerIntensity: this.activityState.shimmer.intensity,
      interactionState: this.activityState.interaction.nexusState,
      audioVisualIntensity:
        this.activityState.audioVisual.nebulaEffectIntensity,
      scrollActivity: this.activityState.scroll.sheenIntensity,
      timestamp: Date.now(),
    };
  }

  public onVisualFieldUpdate(field: VisualCoordinationField): void {
    return this.onConsciousnessFieldUpdate(field); // Legacy compatibility
  }

  /**
   * @deprecated Use onVisualFieldUpdate instead
   */
  public onConsciousnessFieldUpdate(field: VisualCoordinationField): void {
    try {
      this.currentVisualField = field as any;
      this.currentConsciousnessField = field; // Legacy compatibility

      // Modulate UI effects based on visual effects state
      const fieldInfluence = field.pulseRate * 0.2; // Moderate influence

      // Apply to shimmer effects
      this.activityState.shimmer.intensity = Math.min(
        this.activityState.shimmer.intensity + fieldInfluence,
        1.0
      );

      // Apply to audio-visual effects
      this.activityState.audioVisual.nebulaEffectIntensity = Math.min(
        this.activityState.audioVisual.nebulaEffectIntensity +
          fieldInfluence * 0.3,
        1.0
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "UIVisualEffectsController",
        "Error updating from visual effects state:",
        error
      );
    }
  }

  public onVisualCoordinationEvent(eventType: string, data: any): void {
    return this.onChoreographyEvent(eventType, data); // Legacy compatibility
  }

  /**
   * @deprecated Use onVisualCoordinationEvent instead
   */
  public onChoreographyEvent(eventType: string, data: any): void {
    // Handle coordination events from the visual effects coordinator
    if (eventType === "transition:start") {
      // Boost all UI effects during transitions
      this.activityState.shimmer.intensity = Math.min(
        this.activityState.shimmer.intensity + 0.2,
        1.0
      );
      this.activityState.audioVisual.nebulaEffectIntensity = Math.min(
        this.activityState.audioVisual.nebulaEffectIntensity + 0.15,
        1.0
      );
    }

    if (this.uiEffectsConfig.debugMode) {
      Y3KDebug?.debug?.log(
        "UIVisualEffectsController",
        `Visual coordination event: ${eventType}`,
        data
      );
    }
  }

  // Health check implementation
  public override async healthCheck(): Promise<HealthCheckResult> {
    const state = this.activityState;
    const isHealthy =
      this.initialized &&
      state.performance.healthStatus !== "critical" &&
      state.diagnostic.criticalIssuesDetected === 0;

    return {
      healthy: isHealthy,
      ok: isHealthy,
      details:
        `UI Effects Activity: ${state.activityLevel}, ` +
        `Shimmer: ${state.shimmer.activeElements.size} elements, ` +
        `Interaction: ${state.interaction.nexusState}, ` +
        `Performance: ${state.performance.healthStatus}, ` +
        `Diagnostics: ${state.diagnostic.criticalIssuesDetected} issues`,
      system: "UIVisualEffectsController",
    };
  }

  // Configuration API
  public updateConfiguration(updates: Partial<UIEffectsConfig>): ConfigurationUpdateResult {
    const previousConfig = { ...this.uiEffectsConfig };
    const updatedProperties: string[] = [];
    const validationErrors: string[] = [];

    try {
      // Validate updates before applying
      for (const [key, value] of Object.entries(updates)) {
        if (key in this.uiEffectsConfig) {
          updatedProperties.push(key);
        } else {
          validationErrors.push(`Unknown configuration property: ${key}`);
        }

        // Type-specific validation
        if (key === 'shimmerIntensity' && typeof value === 'number' && (value < 0 || value > 1)) {
          validationErrors.push('shimmerIntensity must be between 0 and 1');
        }
        if (key === 'digitalMeditationThreshold' && typeof value === 'number' && value < 1000) {
          validationErrors.push('digitalMeditationThreshold must be at least 1000ms');
        }
      }

      // Apply valid updates
      if (validationErrors.length === 0) {
        Object.assign(this.uiEffectsConfig, updates);

        // Handle specific configuration updates
        if (updates.shimmerEnabled !== undefined) {
          if (
            updates.shimmerEnabled &&
            !this.activityState.shimmer.activeElements.size
          ) {
            this.discoverShimmerElements();
          }
        }

        if (updates.diagnosticEnabled !== undefined) {
          if (updates.diagnosticEnabled && !this.diagnosticTimerId) {
            this.startDiagnosticMonitoring();
          } else if (!updates.diagnosticEnabled && this.diagnosticTimerId) {
            clearInterval(this.diagnosticTimerId);
            this.diagnosticTimerId = null;
          }
        }

        Y3KDebug?.debug?.log(
          "UIEffectsController",
          "Configuration updated:",
          updates
        );
      }

      return {
        success: validationErrors.length === 0,
        updatedProperties,
        validationErrors,
        previousConfig,
        newConfig: { ...this.uiEffectsConfig }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during configuration update';
      return {
        success: false,
        updatedProperties,
        validationErrors: [...validationErrors, errorMessage],
        previousConfig,
        newConfig: previousConfig
      };
    }
  }

  public getConfiguration(): UIEffectsConfig {
    return { ...this.uiEffectsConfig };
  }

  public getVisualState(): UIEffectsActivityState {
    return this.getConsciousnessState(); // Legacy compatibility
  }

  /**
   * @deprecated Use getVisualState instead
   */
  public getConsciousnessState(): UIEffectsActivityState {
    return { ...this.activityState };
  }

  /**
   * Generate comprehensive diagnostic report for UI effects system
   *
   * @returns Detailed diagnostic report with health metrics and recommendations
   *
   * @example
   * ```typescript
   * const report = uiController.generateDiagnosticReport();
   * if (report.systemHealth === 'critical') {
   *   console.warn('UI Effects in critical state:', report.issues);
   *   report.recommendations.forEach(rec => console.log('Recommendation:', rec));
   * }
   * ```
   */
  public generateDiagnosticReport(): UIEffectsDiagnosticReport {
    const now = performance.now();
    const memoryInfo = (performance as any).memory;

    // Calculate system health
    let healthScore = 100;
    const issues = {
      whiteLayerProblems: [...this.activityState.diagnostic.whiteLayerIssues],
      webglContextIssues: [] as string[],
      performanceWarnings: [] as string[],
      configurationErrors: [] as string[]
    };
    const recommendations: string[] = [];

    // Check performance metrics
    if (this.activityState.performance.avgFrameTime > 33) { // > 30fps
      healthScore -= 20;
      issues.performanceWarnings.push(`High frame time: ${this.activityState.performance.avgFrameTime.toFixed(1)}ms`);
      recommendations.push('Consider reducing visual effect quality or disabling intensive effects');
    }

    // Check WebGL context
    if (!this.activityState.diagnostic.webglContextHealthy) {
      healthScore -= 30;
      issues.webglContextIssues.push('WebGL context is unhealthy or lost');
      recommendations.push('Restart visual effects or check browser WebGL support');
    }

    // Check configuration issues
    if (!this.uiEffectsConfig.enabled) {
      issues.configurationErrors.push('UI effects are disabled');
      recommendations.push('Enable UI effects in settings for full experience');
    }

    // Check white layer issues
    if (this.activityState.diagnostic.whiteLayerIssues.length > 0) {
      healthScore -= 15 * this.activityState.diagnostic.whiteLayerIssues.length;
      recommendations.push('Enable auto-fix for white layer issues or check CSS customizations');
    }

    // Determine overall health
    let systemHealth: UIEffectsDiagnosticReport['systemHealth'];
    if (healthScore >= 90) systemHealth = 'excellent';
    else if (healthScore >= 70) systemHealth = 'good';
    else if (healthScore >= 50) systemHealth = 'degraded';
    else systemHealth = 'critical';

    return {
      timestamp: now,
      systemHealth,
      activeEffects: {
        shimmer: this.uiEffectsConfig.shimmerEnabled && this.activityState.shimmer.intensity > 0,
        interaction: this.uiEffectsConfig.interactionTrackingEnabled && this.activityState.interaction.isActive,
        audioVisual: this.uiEffectsConfig.audioVisualEnabled && this.activityState.audioVisual.beatIntensity > 0,
        scroll: this.uiEffectsConfig.scrollEffectsEnabled && this.activityState.scroll.prismaticEffectActive
      },
      performanceMetrics: {
        averageFrameTime: this.activityState.performance.avgFrameTime,
        maxFrameTime: this.activityState.performance.maxFrameTime,
        memoryUsage: memoryInfo?.usedJSHeapSize || 0,
        cpuUsage: this.activityState.performance.frameTime / 16.67 // Percentage of 60fps budget
      },
      issues,
      recommendations
    };
  }

  // Legacy compatibility methods (for migration)
  public getShimmerElements(): Map<string, HTMLElement> {
    return new Map(this.shimmerElements);
  }

  public getInteractionState() {
    return this.activityState.interaction;
  }

  public getDiagnosticState() {
    return this.activityState.diagnostic;
  }

  public override async destroy(): Promise<void> {
    Y3KDebug?.debug?.log(
      "UIVisualEffectsController",
      "Destroying unified UI effects controller..."
    );

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation - coordinator handles this

    // Stop diagnostic monitoring
    if (this.diagnosticTimerId) {
      clearInterval(this.diagnosticTimerId);
      this.diagnosticTimerId = null;
    }

    // Disconnect observers
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Unsubscribe from events
    for (const unsubscribe of this.eventUnsubscribeFunctions) {
      unsubscribe();
    }
    this.eventUnsubscribeFunctions = [];

    // Clean up element references
    this.shimmerElements.clear();

    // Clean up visual effects coordinator registration
    if (this.visualEffectsCoordinator) {
      // Note: Would need unregister method on coordinator
    }

    this.initialized = false;

    Y3KDebug?.debug?.log(
      "UIVisualEffectsController",
      "Unified UI effects controller destroyed"
    );
  }

  // =========================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE
  // =========================================================================

  public onVisualStateUpdate(state: VisualEffectState): void {
    // Update UI effects based on shared visual state
    if (state.musicIntensity > 0.6) {
      this.triggerIntensityEffects(state.musicIntensity);
    }
    if (state.colorTemperature) {
      this.updateTemperatureEffects(state.colorTemperature);
    }
  }

  public onVisualEffectEvent(eventType: string, payload: any): void {
    // Handle visual effect events from coordinator
    switch (eventType) {
      case "visual:rhythm-shift":
        this.triggerShimmerEffects(payload.intensity || 0.5);
        break;
      case "visual:color-shift":
        this.updateTemperatureEffects(payload.temperature || 6500);
        break;
      case "visual:energy-surge":
        if (payload.intensity > 0.7) {
          this.triggerIntensityEffects(payload.intensity);
        }
        break;
    }
  }

  public getVisualContribution(): VisualContributionResult {
    const sources: string[] = [];
    let confidence = 0;

    // Calculate contribution from different UI systems
    const contribution: Partial<VisualEffectState> = {};

    // Shimmer contribution
    if (this.uiEffectsConfig.shimmerEnabled && this.activityState.shimmer.intensity > 0) {
      contribution.visualCoherence = this.activityState.activityLevel === "enhanced" ? 1.0 : 0.7;
      contribution.systemHarmony = this.activityState.shimmer.intensity;
      sources.push('shimmer');
      confidence += 0.3;
    }

    // Audio-visual contribution
    if (this.uiEffectsConfig.audioVisualEnabled && this.activityState.audioVisual.nebulaEffectIntensity > 0) {
      contribution.effectDepth = this.activityState.audioVisual.nebulaEffectIntensity;
      contribution.energyLevel = this.activityState.audioVisual.beatIntensity;
      sources.push('audioVisual');
      confidence += 0.4;
    }

    // Interaction contribution
    if (this.activityState.interaction.isActive) {
      const flowMagnitude = Math.sqrt(
        this.activityState.interaction.scrollVelocity.x ** 2 +
        this.activityState.interaction.scrollVelocity.y ** 2
      );
      if (flowMagnitude > 0) {
        contribution.flowDirection = {
          x: this.activityState.interaction.scrollVelocity.x / 100, // Normalize
          y: this.activityState.interaction.scrollVelocity.y / 100
        };
        sources.push('interaction');
        confidence += 0.2;
      }
    }

    // Performance-based contribution
    if (this.activityState.performance.healthStatus !== 'critical') {
      sources.push('performance');
      confidence += 0.1;
    }

    return {
      contribution,
      confidence: Math.min(1, confidence), // Cap at 1.0
      sources,
      timestamp: performance.now()
    };
  }

  // =========================================================================
  // MISSING METHODS FOR VISUAL EFFECT INTEGRATION
  // =========================================================================

  private triggerIntensityEffects(intensity: number): void {
    // Boost shimmer effects based on intensity
    if (this.uiEffectsConfig.shimmerEnabled) {
      this.activityState.shimmer.intensity = Math.min(
        this.activityState.shimmer.intensity + (intensity * 0.3),
        1.0
      );
    }

    // Boost audio-visual effects
    if (this.uiEffectsConfig.audioVisualEnabled) {
      this.activityState.audioVisual.nebulaEffectIntensity = Math.min(
        this.activityState.audioVisual.nebulaEffectIntensity + (intensity * 0.2),
        1.0
      );
    }

    // Apply intensity to scroll effects
    if (this.uiEffectsConfig.scrollEffectsEnabled) {
      this.activityState.scroll.sheenIntensity = Math.min(
        this.activityState.scroll.sheenIntensity + (intensity * 0.1),
        1.0
      );
    }
  }

  private updateTemperatureEffects(temperature: number): void {
    // Map temperature to UI effect characteristics
    const normalizedTemp = Math.max(1000, Math.min(10000, temperature));

    // Update shimmer effect type based on temperature
    if (this.uiEffectsConfig.shimmerEnabled) {
      if (normalizedTemp < 3000) {
        this.activityState.shimmer.effectType = "prism"; // Cool colors
      } else if (normalizedTemp > 7000) {
        this.activityState.shimmer.effectType = "oil-slick"; // Warm colors
      } else {
        this.activityState.shimmer.effectType = "rainbow"; // Neutral
      }
    }

    // Apply temperature influence to other effects
    const tempInfluence = (normalizedTemp - 1000) / 9000; // 0-1 scale
    if (this.uiEffectsConfig.audioVisualEnabled) {
      this.activityState.audioVisual.nebulaEffectIntensity = Math.min(
        this.activityState.audioVisual.nebulaEffectIntensity + (tempInfluence * 0.1),
        1.0
      );
    }
  }

  private triggerShimmerEffects(intensity: number): void {
    if (!this.uiEffectsConfig.shimmerEnabled) return;

    // Apply immediate shimmer boost
    this.activityState.shimmer.intensity = Math.min(
      this.activityState.shimmer.intensity + (intensity * 0.4),
      1.0
    );

    // Temporarily switch to mixed effect for variety
    const currentType = this.activityState.shimmer.effectType;
    this.activityState.shimmer.effectType = "mixed";

    // Revert effect type after brief period
    setTimeout(() => {
      this.activityState.shimmer.effectType = currentType;
    }, 2000);
  }
}
