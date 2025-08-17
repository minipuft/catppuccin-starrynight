/**
 * VisualSystemCoordinator - Visual Effects Factory & Coordination Layer
 * 
 * 🚨 DEPRECATED: This coordinator has been consolidated into VisualEffectsCoordinator
 * 🔧 PHASE 2.2: Use VisualEffectsCoordinator.createVisualSystem() instead
 * 
 * @deprecated Use VisualEffectsCoordinator instead - provides all factory functionality
 * @see VisualEffectsCoordinator.createVisualSystem()
 * @see VisualEffectsCoordinator.orchestrateGradientEffects()
 *
 * Layer 2 of the three-layer facade architecture - handles ALL visual systems through factory patterns.
 * Provides comprehensive factory methods, dependency injection, and performance optimization
 * for music-synchronized visual effects in the Spicetify theme.
 *
 * ═══ LAYER 2 RESPONSIBILITIES ═══
 * 
 * VISUAL SYSTEM FACTORY:
 * • Creates and manages visual effects (particles, backgrounds, gradients, glow effects)
 * • Provides cached system instances with proper dependency injection
 * • Handles visual system lifecycle (initialize, update, destroy)
 *
 * MUSIC-VISUAL COORDINATION:
 * • Synchronizes visual effects with music beat detection and energy analysis
 * • Provides music-aware quality adaptation based on performance constraints
 * • Coordinates cross-visual-system communication for unified effects
 *
 * PERFORMANCE OPTIMIZATION:
 * • Monitors visual system performance and adapts quality dynamically
 * • Manages WebGL vs CSS fallback strategies based on device capabilities
 * • Implements adaptive scaling to maintain 60fps target
 *
 * ═══ DIAGNOSTIC VALUE ═══
 * Visual-specific troubleshooting capabilities:
 * - "Particles not showing" → Check particle system factory and WebGL capabilities
 * - "Effects lag during music" → Check music sync integration and performance scaling
 * - "Background gradients broken" → Check gradient system health and CSS injection
 * - "Colors not changing" → Check ColorHarmonyEngine integration and CSS variables
 *
 * Key Features:
 * - Factory pattern for all visual systems with dependency injection
 * - Music synchronization with beat detection and energy-based adaptation
 * - Performance monitoring integration with quality scaling
 * - Event coordination and propagation across visual effects
 * - Adaptive quality control based on device capabilities
 * - Health monitoring and auto-recovery for visual systems
 * - Loose coupling through facade pattern for maintainability
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { CSSAnimationManager } from "@/core/animation/CSSAnimationManager";
import { EnhancedMasterAnimationCoordinator } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { OptimizedCSSVariableManager } from "@/core/performance/OptimizedCSSVariableManager";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { VisualEffectsManager } from "@/types/colorStubs";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import * as Utils from "@/utils/core/ThemeUtilities";

// Visual System imports
// import "@/visual/effects/ParticleConsciousnessModule"; // Disabled - converted to CSS-only
import { WebGLGradientBackgroundSystem } from "@/visual/background/WebGLRenderer";
import { CSSBlobFallbackSystem } from "@/visual/css-fallbacks/CSSBlobFallbackSystem";
import { UIEffectsController } from "@/visual/effects/UIVisualEffectsController";
import { HeaderVisualEffectsController } from "@/visual/effects/HeaderVisualEffectsController";
import { SidebarVisualEffectsSystem } from "@/visual/ui/SidebarVisualEffectsSystem";
import { GradientConductor } from "@/visual/backbone/GradientConductor";
import { MusicBeatSynchronizer } from "@/visual/music/MusicSyncVisualEffects";
import { HolographicUISystem } from "@/visual/music/ui/HolographicUISystem";
import { InteractionTrackingSystem } from "@/visual/ui/InteractionTrackingSystem";
import { SpotifyUIApplicationSystem } from "@/visual/ui/SpotifyUIApplicationSystem";
// EmergentChoreographyEngine consolidated into EnhancedMasterAnimationCoordinator

// Consciousness engine imports for integration
import { RedEnergyBurstSystem } from "@/visual/effects/HighEnergyEffectsController";
import { MusicGlowEffectsManager } from "@/visual/effects/GlowEffectsController";
import { AnimationEffectsController } from "@/visual/effects/BreathingEffectsController";

// Interface imports
import { IManagedSystem, HealthCheckResult } from "@/types/systems";
// AdaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
// Using consolidated types for backward compatibility
interface AdaptationEvent {
  type: "quality-change" | "thermal-change" | "performance-change";
  data: any;
  reason?: string;
  newSettings?: QualitySettings;
}

interface QualitySettings {
  level?: "minimal" | "low" | "medium" | "high" | "ultra";
  gradientComplexity?: number;
  particleDensity?: number;
  animationFPS?: number;
  postProcessing?: boolean;
  bloomEnabled?: boolean;
  antiAliasing?: "none" | "fxaa" | "msaa4x";
  shadowQuality?: "off" | "medium" | "high";
  shaderPrecision?: "low" | "medium" | "high";
  textureResolution?: number;
  transitionQuality?: "smooth" | "fast";
  motionBlur?: boolean;
  features?: {
    webgl: boolean;
    particles: boolean;
    shaders: boolean;
    blur: boolean;
    shadows: boolean;
    animations: boolean;
  };
}

// Type definitions
export type VisualSystemKey =
  | "Particle"
  | "SidebarVisualEffects"
  | "UIVisualEffects"
  | "HeaderVisualEffects"
  | "WebGLBackground"
  | "CSSBlobFallback"
  | "MusicBeatSync"
  | "OrganicBreathing"
  | "InteractionTracking"
  | "SpotifyUIApplication"
  | "CinematicDrama"
  | "EtherealBeauty"
  | "NaturalHarmony"
  | "GradientConductor"
  | "CSSAnimationManager"
  | "GlowEffects"
  | "UnifiedParticle"
  | "DepthLayeredGradient"
  | "FluidGradientBackground";
// ParticleField consolidated into Particle (ParticleConsciousnessModule)
// EmergentChoreography consolidated into EnhancedMasterAnimationCoordinator
// Sidebar systems consolidated into Sidebar Effects (UnifiedSidebarEffectsController)

export type SystemHealth = "excellent" | "good" | "degraded" | "critical";
export type IntegrationMode =
  | "progressive"
  | "performance-first"
  | "quality-first"
  | "battery-optimized";

export interface VisualSystemConfig {
  mode: IntegrationMode;
  enablePerformanceMonitoring: boolean;
  enableAdaptiveQuality: boolean;
  enableEventCoordination: boolean;
  performanceThresholds: {
    minFPS: number;
    maxMemoryMB: number;
    thermalLimit: number;
  };
  qualityPreferences: {
    preferHighQuality: boolean;
    allowDynamicScaling: boolean;
    batteryConservation: boolean;
  };
}

export interface VisualSystemMetrics {
  // Performance metrics
  currentFPS: number;
  averageFPS: number;
  frameTime: number;
  memoryUsageMB: number;

  // System state
  systemHealth: SystemHealth;
  activeVisualSystems: string[];

  // Quality settings
  currentQuality: QualitySettings;
  adaptiveScaling: boolean;
  performanceMonitoring: boolean;

  // Event coordination
  eventCoordination: boolean;
  lastEventTime: number;
  eventCount: number;
}

export interface VisualSystemHealthCheck {
  overall: SystemHealth;
  systems: Map<string, { ok: boolean; details: string }>;
  recommendations: string[];
  timestamp: number;
}

export class VisualSystemCoordinator implements IManagedSystem {
  public readonly systemName = "VisualSystemCoordinator";
  public initialized = false;
  // Core dependencies
  private config: AdvancedSystemConfig | Year3000Config;
  private utils: typeof Utils;
  private year3000System: any; // Reference to main system

  // Injected dependencies
  private cssVariableController: OptimizedCSSVariableManager;
  private performanceAnalyzer: SimplePerformanceCoordinator;
  private musicSyncService: MusicSyncService;
  private settingsManager: SettingsManager;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private eventBus: any = null; // EventBus when available
  private animationCoordinator: EnhancedMasterAnimationCoordinator | null = null;

  // Performance and monitoring
  private deviceDetector: DeviceCapabilityDetector;
  // adaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
  // private adaptivePerformanceSystem: AdaptivePerformanceSystem | null = null;

  // System registry and cache
  private systemRegistry: Map<VisualSystemKey, new (...args: any[]) => any>;
  private systemCache: Map<VisualSystemKey, any>;
  private systemDependencies: Map<VisualSystemKey, string[]>;

  // State management
  private isInitialized = false;
  private bridgeConfig: VisualSystemConfig;
  private currentMetrics: VisualSystemMetrics;
  private lastHealthCheck: VisualSystemHealthCheck | null = null;

  // Event handlers
  private boundAdaptationHandler: ((event: AdaptationEvent) => void) | null =
    null;
  private boundSettingsHandler: ((event: Event) => void) | null = null;

  // Monitoring intervals
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;

  // Performance tracking
  private fpsHistory: number[] = [];

  // Event callbacks
  private onSystemAdaptation: ((metrics: VisualSystemMetrics) => void) | null =
    null;
  private onHealthChange: ((health: VisualSystemHealthCheck) => void) | null =
    null;
  private onSystemCreated:
    | ((systemKey: VisualSystemKey, system: IManagedSystem) => void)
    | null = null;

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    utils: typeof Utils,
    year3000System: any,
    cssVariableController: OptimizedCSSVariableManager,
    performanceAnalyzer: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService,
    settingsManager: SettingsManager,
    colorHarmonyEngine?: ColorHarmonyEngine,
    eventBus?: any,
    animationCoordinator?: EnhancedMasterAnimationCoordinator
  ) {
    this.config = config;
    this.utils = utils;
    this.year3000System = year3000System;
    this.cssVariableController = cssVariableController;
    this.performanceAnalyzer = performanceAnalyzer;
    this.musicSyncService = musicSyncService;
    this.settingsManager = settingsManager;
    this.colorHarmonyEngine = colorHarmonyEngine || null;
    this.eventBus = eventBus || null;
    this.animationCoordinator = animationCoordinator || null;

    this.deviceDetector = new DeviceCapabilityDetector();
    this.systemRegistry = new Map();
    this.systemCache = new Map();
    this.systemDependencies = new Map();

    // Initialize default configuration
    this.bridgeConfig = {
      mode: "progressive",
      enablePerformanceMonitoring: true,
      enableAdaptiveQuality: true,
      enableEventCoordination: true,
      performanceThresholds: {
        minFPS: 45,
        maxMemoryMB: 50,
        thermalLimit: 70,
      },
      qualityPreferences: {
        preferHighQuality: true,
        allowDynamicScaling: true,
        batteryConservation: false,
      },
    };

    this.currentMetrics = this.createInitialMetrics();

    // Bind event handlers
    this.boundAdaptationHandler = this.handleAdaptationEvent.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);

    // Register visual systems
    this.registerVisualSystems();

    Y3KDebug?.debug?.log(
      "VisualSystemFacade",
      "Factory facade initialized with visual systems"
    );
  }

  private registerVisualSystems(): void {
    // Register all visual systems with their dependencies
    // this.systemRegistry.set('Particle', ParticleConsciousnessModule); // Disabled - converted to CSS-only
    // this.systemDependencies.set('Particle', ['performanceAnalyzer', 'cssConsciousnessController', 'eventBus', 'musicSyncService', 'colorHarmonyEngine']); // Disabled - converted to CSS-only

    this.systemRegistry.set(
      "SidebarVisualEffects",
      SidebarVisualEffectsSystem
    );
    this.systemDependencies.set("SidebarVisualEffects", [
      "eventBus",
      "musicSyncService",
    ]);

    this.systemRegistry.set(
      "UIVisualEffects",
      UIEffectsController
    );
    this.systemDependencies.set("UIVisualEffects", [
      "eventBus",
      "musicSyncService",
      "cssVariableController",
    ]);

    this.systemRegistry.set(
      "HeaderVisualEffects",
      HeaderVisualEffectsController
    );
    this.systemDependencies.set("HeaderVisualEffects", [
      "eventBus",
      "musicSyncService",
      "colorHarmonyEngine",
    ]);

    this.systemRegistry.set("WebGLBackground", WebGLGradientBackgroundSystem);
    this.systemDependencies.set("WebGLBackground", [
      "performanceAnalyzer",
      "eventBus",
    ]);

    this.systemRegistry.set("CSSBlobFallback", CSSBlobFallbackSystem);
    this.systemDependencies.set("CSSBlobFallback", [
      "performanceAnalyzer",
      "musicSyncService",
      "settingsManager",
    ]);


    this.systemRegistry.set("MusicBeatSync", MusicBeatSynchronizer);
    this.systemDependencies.set("MusicBeatSync", [
      "performanceAnalyzer",
      "cssVariableController",
      "eventBus",
      "musicSyncService",
      "colorHarmonyEngine",
    ]);

    this.systemRegistry.set("InteractionTracking", InteractionTrackingSystem);
    this.systemDependencies.set("InteractionTracking", [
      "performanceAnalyzer",
      "cssVariableController",
    ]);

    this.systemRegistry.set("SpotifyUIApplication", SpotifyUIApplicationSystem);
    this.systemDependencies.set("SpotifyUIApplication", ["year3000System"]); // Special case

    // Consciousness engines for enhanced aesthetic experiences
    this.systemRegistry.set("CinematicDrama", RedEnergyBurstSystem);
    this.systemDependencies.set("CinematicDrama", [
      "performanceAnalyzer",
      "cssVariableController",
      "musicSyncService",
      "colorHarmonyEngine",
      "eventBus",
    ]);

    this.systemRegistry.set("EtherealBeauty", MusicGlowEffectsManager);
    this.systemDependencies.set("EtherealBeauty", [
      "performanceAnalyzer",
      "cssVariableController",
      "musicSyncService",
      "colorHarmonyEngine",
      "eventBus",
    ]);

    this.systemRegistry.set("NaturalHarmony", AnimationEffectsController);
    this.systemDependencies.set("NaturalHarmony", [
      "performanceAnalyzer",
      "cssVariableController",
      "musicSyncService",
      "colorHarmonyEngine",
      "eventBus",
    ]);

    this.systemRegistry.set("GradientConductor", GradientConductor);
    this.systemDependencies.set("GradientConductor", [
      "cssVariableController",
      "colorHarmonyEngine",
      "musicSyncService",
      "performanceAnalyzer",
      "eventBus",
    ]);

    this.systemRegistry.set("CSSAnimationManager", CSSAnimationManager);
    this.systemDependencies.set("CSSAnimationManager", [
      "cssVariableController",
      "animationCoordinator",
    ]);

    // EmergentChoreography consolidated into EnhancedMasterAnimationCoordinator
    // ParticleField consolidated into Particle (ParticleConsciousnessModule)

    // Test compatibility aliases
    this.systemRegistry.set("GlowEffects", MusicGlowEffectsManager);
    this.systemDependencies.set("GlowEffects", [
      "performanceAnalyzer",
      "cssVariableController",
      "musicSyncService",
      "colorHarmonyEngine",
      "eventBus",
    ]);

    this.systemRegistry.set("UnifiedParticle", SidebarVisualEffectsSystem); // Particle system consolidated into sidebar
    this.systemDependencies.set("UnifiedParticle", [
      "eventBus",
      "musicSyncService",
    ]);

    this.systemRegistry.set("DepthLayeredGradient", GradientConductor);
    this.systemDependencies.set("DepthLayeredGradient", [
      "cssVariableController",
      "colorHarmonyEngine",
      "musicSyncService",
      "performanceAnalyzer",
      "eventBus",
    ]);

    this.systemRegistry.set("FluidGradientBackground", WebGLGradientBackgroundSystem);
    this.systemDependencies.set("FluidGradientBackground", [
      "performanceAnalyzer",
      "eventBus",
    ]);
  }

  public async initialize(config?: Partial<VisualSystemConfig>): Promise<void> {
    if (this.isInitialized) {
      Y3KDebug?.debug?.warn("VisualSystemFacade", "Already initialized");
      return;
    }

    try {
      // Update configuration
      this.bridgeConfig = { ...this.bridgeConfig, ...config };

      // Initialize device detector
      await this.deviceDetector.initialize();

      // AdaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
      // Initialize adaptive performance system
      // if (this.bridgeConfig.enablePerformanceMonitoring) {
      //   this.adaptivePerformanceSystem = new AdaptivePerformanceSystem(
      //     this.deviceDetector,
      //     this.performanceAnalyzer
      //   );
      //   await this.adaptivePerformanceSystem.initialize();
      //   this.adaptivePerformanceSystem.addEventListener(this.boundAdaptationHandler!);
      // }

      // Apply configuration
      await this.applyConfiguration();

      // Subscribe to events
      this.subscribeToEvents();

      // Start monitoring
      this.startMonitoring();

      // Perform initial health check
      await this.performVisualHealthCheck();

      this.isInitialized = true;
      this.initialized = true;

      // Update CSS to indicate bridge is active
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-visual-bridge-active",
        "1"
      );
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-visual-bridge-mode",
        this.bridgeConfig.mode
      );

      Y3KDebug?.debug?.log("VisualSystemFacade", "Facade fully initialized", {
        mode: this.bridgeConfig.mode,
        systemsRegistered: this.systemRegistry.size,
        performanceMonitoring: this.bridgeConfig.enablePerformanceMonitoring,
      });
    } catch (error) {
      Y3KDebug?.debug?.error(
        "VisualSystemFacade",
        "Initialization failed:",
        error
      );
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Factory method to create and return visual systems
   * This is the main interface for the facade pattern
   */
  public getVisualSystem<T = any>(key: VisualSystemKey): T {
    // Check cache first
    if (this.systemCache.has(key)) {
      return this.systemCache.get(key) as T;
    }

    // Create new system instance
    const system = this.createVisualSystem<T>(key);

    // Cache the system
    this.systemCache.set(key, system);

    // Update metrics
    this.currentMetrics.activeVisualSystems.push(key);

    // Emit creation event
    if (this.onSystemCreated) {
      this.onSystemCreated(key, system as IManagedSystem);
    }

    return system;
  }

  /**
   * Create a new visual system instance with proper dependency injection
   */
  public createVisualSystem<T = any>(key: VisualSystemKey): T {
    const SystemClass = this.systemRegistry.get(key);
    if (!SystemClass) {
      throw new Error(`Visual system '${key}' not found in registry`);
    }

    // Special handling for UnifiedSystemBase-derived systems
    // Check if system extends UnifiedSystemBase by looking for _baseInitialize method
    const testInstance = new SystemClass(this.config);
    if (typeof testInstance._baseInitialize === "function") {
      // UnifiedSystemBase systems expect only config parameter
      const system = testInstance as T;
      this.injectUnifiedSystemDependencies(system, key);
      return system;
    }

    // Special handling for SpotifyUIApplicationSystem
    if (key === "SpotifyUIApplication") {
      const system = new SystemClass(this.year3000System) as T;
      this.injectDependencies(system, key);
      return system;
    }

    // Special handling for GradientConductor with custom dependency injection
    if (key === "GradientConductor") {
      const system = new SystemClass(
        this.eventBus,
        this.cssVariableController,
        this.colorHarmonyEngine,
        this.musicSyncService,
        this.performanceAnalyzer,
        {} // Default config
      ) as T;
      this.injectDependencies(system, key);
      return system;
    }

    // Special handling for CSSAnimationManager with direct dependency injection
    if (key === "CSSAnimationManager") {
      const system = new SystemClass(
        this.config,
        this.cssVariableController,
        this.animationCoordinator
      ) as T;
      this.injectDependencies(system, key);
      return system;
    }

    // Special handling for visual effects systems with holographic UI integration
    if (
      key === "CinematicDrama" ||
      key === "EtherealBeauty" ||
      key === "NaturalHarmony"
    ) {
      // Create visual effects manager for holographic UI system
      const biologicalManager = new VisualEffectsManager();
      
      // Create holographic UI system for visual effects integration
      const holographicSystem = new HolographicUISystem(
        biologicalManager,
        this.settingsManager,
        this.musicSyncService
      );
      
      const system = new SystemClass(
        holographicSystem,
        this.cssVariableController,
        this.musicSyncService
      ) as T;
      this.injectDependencies(system, key);
      return system;
    }

    // Standard 6-parameter constructor for legacy systems
    const system = new SystemClass(
      this.config,
      this.utils,
      this.performanceAnalyzer,
      this.musicSyncService,
      this.settingsManager,
      this.year3000System
    ) as T;

    // Inject additional dependencies
    this.injectDependencies(system, key);

    return system;
  }

  /**
   * Inject dependencies into visual systems
   */
  private injectDependencies(system: any, key: VisualSystemKey): void {
    const dependencies = this.systemDependencies.get(key) || [];

    // Inject performance analyzer
    if (
      dependencies.includes("performanceAnalyzer") &&
      (system as any).setPerformanceAnalyzer
    ) {
      (system as any).setPerformanceAnalyzer(this.performanceAnalyzer);
    }

    // Inject CSS variable batcher
    if (
      dependencies.includes("cssVariableController") &&
      (system as any).setOptimizedCSSVariableManager
    ) {
      (system as any).setOptimizedCSSVariableManager(
        this.cssVariableController
      );
    }

    // Inject event bus
    if (
      dependencies.includes("eventBus") &&
      this.eventBus &&
      (system as any).setEventBus
    ) {
      (system as any).setEventBus(this.eventBus);
    }

    // Inject color harmony engine
    if (this.colorHarmonyEngine && (system as any).setColorHarmonyEngine) {
      (system as any).setColorHarmonyEngine(this.colorHarmonyEngine);
    }

    // Inject music sync service
    if (
      dependencies.includes("musicSyncService") &&
      (system as any).setMusicSyncService
    ) {
      (system as any).setMusicSyncService(this.musicSyncService);
    }

    // Inject animation coordinator (for CSSAnimationManager)
    if (
      dependencies.includes("animationCoordinator") &&
      this.animationCoordinator &&
      (system as any).setAnimationCoordinator
    ) {
      (system as any).setAnimationCoordinator(this.animationCoordinator);
    }

    // Integrate performance monitoring
    this.integratePerformanceMonitoring(system, key);
  }

  /**
   * Inject dependencies into UnifiedSystemBase-derived systems
   */
  private injectUnifiedSystemDependencies(
    system: any,
    key: VisualSystemKey
  ): void {
    // Set up shared utilities directly on the system (before _baseInitialize)
    // This ensures the system has access to CSS variable management
    if (this.cssVariableController) {
      system.cssVariableController = this.cssVariableController;
    }

    if (this.performanceAnalyzer) {
      system.performanceAnalyzer = this.performanceAnalyzer;
    }

    if (this.year3000System) {
      // Set global reference so UnifiedSystemBase._baseInitialize can find shared systems
      (globalThis as any).year3000System = this.year3000System;
    }

    // Integrate performance monitoring for UnifiedSystemBase systems
    this.integratePerformanceMonitoring(system, key);
  }

  /**
   * Integrate performance monitoring for visual systems
   */
  private integratePerformanceMonitoring(
    system: any,
    key: VisualSystemKey
  ): void {
    if (!this.bridgeConfig.enablePerformanceMonitoring) return;

    // Wrap updateAnimation method with performance monitoring
    const originalUpdateAnimation = (system as any).updateAnimation;
    if (typeof originalUpdateAnimation === "function") {
      (system as any).updateAnimation = (deltaTime: number) => {
        const startTime = performance.now();
        originalUpdateAnimation.call(system, deltaTime);
        const endTime = performance.now();

        // Record performance metrics
        this.performanceAnalyzer.recordMetric(
          `Visual_${key}`,
          endTime - startTime
        );
      };
    }

    // Wrap onAnimate method if it exists
    const originalOnAnimate = (system as any).onAnimate;
    if (typeof originalOnAnimate === "function") {
      (system as any).onAnimate = (deltaTime: number) => {
        const startTime = performance.now();
        originalOnAnimate.call(system, deltaTime);
        const endTime = performance.now();

        // Record performance metrics
        this.performanceAnalyzer.recordMetric(
          `Visual_${key}_Animate`,
          endTime - startTime
        );
      };
    }

    // AdaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
    // Integrate with adaptive quality control
    // if (this.adaptivePerformanceSystem) {
    //   this.adaptiveQualityControl(system, key);
    // }
  }

  /**
   * Apply adaptive quality control to visual systems
   */
  private adaptiveQualityControl(system: any, key: VisualSystemKey): void {
    if (!this.eventBus) return;

    // Listen for performance events and adjust quality
    this.eventBus.subscribe("performance:degradation", (event: any) => {
      if ((system as any).reduceQuality) {
        (system as any).reduceQuality(event.reductionLevel);
      }
    });

    this.eventBus.subscribe("performance:improvement", (event: any) => {
      if ((system as any).increaseQuality) {
        (system as any).increaseQuality(event.improvementLevel);
      }
    });
  }

  /**
   * Handle adaptation events from the performance system
   */
  public handleAdaptationEvent(event: AdaptationEvent): void {
    Y3KDebug?.debug?.log(
      "VisualSystemFacade",
      `Adaptation event: ${event.type}`,
      event.reason
    );

    // Update metrics
    this.currentMetrics.currentQuality = event.newSettings!;

    // Propagate to all cached visual systems
    this.systemCache.forEach((system, key) => {
      if ((system as any).handleAdaptationEvent) {
        (system as any).handleAdaptationEvent(event);
      }
    });

    // Emit adaptation callback
    if (this.onSystemAdaptation) {
      this.onSystemAdaptation(this.currentMetrics);
    }

    // Update CSS variables
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-adaptive-quality",
      (event.newSettings!.gradientComplexity || 0).toString()
    );
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-adaptive-fps",
      (event.newSettings!.animationFPS || 60).toString()
    );
  }

  /**
   * Propagate visual events to all systems
   */
  public propagateVisualEvent(event: any): void {
    if (!this.bridgeConfig.enableEventCoordination) return;

    this.systemCache.forEach((system, key) => {
      if ((system as any).handleVisualEvent) {
        try {
          (system as any).handleVisualEvent(event);
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "VisualSystemFacade",
            `Error propagating event to ${key}:`,
            error
          );
        }
      }
    });

    // Update event metrics
    this.currentMetrics.eventCount++;
    this.currentMetrics.lastEventTime = performance.now();
  }

  /**
   * Initialize all visual systems at once
   */
  public async initializeVisualSystems(): Promise<void> {
    const initPromises = Array.from(this.systemCache.entries()).map(
      async ([key, system]) => {
        try {
          // Use _baseInitialize for UnifiedSystemBase systems, regular initialize for others
          if (typeof (system as any)._baseInitialize === "function") {
            await (system as any)._baseInitialize();
          } else {
            await system.initialize();
          }
          Y3KDebug?.debug?.log(
            "VisualSystemFacade",
            `Initialized visual system: ${key}`
          );
          return { key, success: true };
        } catch (error) {
          Y3KDebug?.debug?.error(
            "VisualSystemFacade",
            `Failed to initialize ${key}:`,
            error
          );
          return { key, success: false, error };
        }
      }
    );

    const results = await Promise.allSettled(initPromises);
    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;

    Y3KDebug?.debug?.log(
      "VisualSystemFacade",
      `Visual systems initialized: ${successCount}/${results.length}`
    );

    // Register quality scaling capable systems with SimplePerformanceCoordinator
    await this.registerQualityScalingSystems();
  }

  /**
   * Register QualityScalingCapable systems with SimplePerformanceCoordinator
   */
  private async registerQualityScalingSystems(): Promise<void> {
    try {
      // Get SimplePerformanceCoordinator and QualityScalingManager from the year3000System
      const performanceOrchestrator =
        this.year3000System?.getCachedNonVisualSystem?.(
          "SimplePerformanceCoordinator"
        );
      const qualityScalingManager =
        this.year3000System?.getCachedNonVisualSystem?.(
          "QualityScalingManager"
        );

      if (!performanceOrchestrator) {
        Y3KDebug?.debug?.warn(
          "VisualSystemFacade",
          "SimplePerformanceCoordinator not available for quality scaling registration"
        );
        return;
      }

      if (!qualityScalingManager) {
        Y3KDebug?.debug?.warn(
          "VisualSystemFacade",
          "QualityScalingManager not available for quality scaling registration"
        );
        return;
      }

      // Register each quality scaling capable system
      for (const [key, system] of this.systemCache.entries()) {
        try {
          // Check if system implements QualityScalingCapable
          const qualityScalingSystem = system as any;
          if (
            typeof qualityScalingSystem.setQualityLevel === "function" &&
            typeof qualityScalingSystem.getPerformanceImpact === "function" &&
            typeof qualityScalingSystem.getQualityCapabilities === "function"
          ) {
            // Register with both systems for comprehensive quality management
            performanceOrchestrator.registerSystem(key, qualityScalingSystem);
            qualityScalingManager.registerSystem(key, qualityScalingSystem);
            Y3KDebug?.debug?.log(
              "VisualSystemFacade",
              `Registered ${key} for quality scaling and performance coordination`
            );
          }
        } catch (error) {
          Y3KDebug?.debug?.error(
            "VisualSystemFacade",
            `Failed to register ${key} for quality scaling:`,
            error
          );
        }
      }

      // Initialize music-aware quality adaptation
      await this.initializeConsciousnessAwareAdaptation(qualityScalingManager);
    } catch (error) {
      Y3KDebug?.debug?.error(
        "VisualSystemFacade",
        "Failed to register quality scaling systems:",
        error
      );
    }
  }

  /**
   * Initialize music-aware quality adaptation with music sync integration
   */
  private async initializeConsciousnessAwareAdaptation(
    qualityScalingManager: any
  ): Promise<void> {
    try {
      const musicSyncService =
        this.year3000System?.getCachedNonVisualSystem?.("MusicSyncService");

      if (!musicSyncService) {
        Y3KDebug?.debug?.warn(
          "VisualSystemFacade",
          "MusicSyncService not available for music-aware adaptation"
        );
        return;
      }

      // Setup music-aware adaptation interval
      const adaptationInterval = setInterval(() => {
        try {
          // Get current music intensity metrics
          const musicIntensity =
            musicSyncService.getOverallIntensity?.() || 0.5;
          const musicEnergy = musicSyncService.getBeatStrength?.() || 0.5;

          // Apply music-aware quality adaptation
          qualityScalingManager.adaptToMusicIntensity(
            musicIntensity,
            musicEnergy
          );
        } catch (error) {
          Y3KDebug?.debug?.error(
            "VisualSystemFacade",
            "Error in music-aware adaptation:",
            error
          );
        }
      }, 2000); // Run every 2 seconds

      // Store interval for cleanup
      (this as any)._musicAdaptationInterval = adaptationInterval;

      Y3KDebug?.debug?.log(
        "VisualSystemFacade",
        "Consciousness-aware quality adaptation initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "VisualSystemFacade",
        "Failed to initialize music-aware adaptation:",
        error
      );
    }
  }

  /**
   * Perform health check on all visual systems
   */
  public async performVisualHealthCheck(): Promise<VisualSystemHealthCheck> {
    const healthCheck: VisualSystemHealthCheck = {
      overall: "good",
      systems: new Map(),
      recommendations: [],
      timestamp: performance.now(),
    };

    let healthyCount = 0;
    let totalCount = 0;

    // Check each cached system
    for (const [key, system] of this.systemCache) {
      totalCount++;

      try {
        const systemHealth = (system as any).healthCheck
          ? await (system as any).healthCheck()
          : { status: "unknown", message: "No health check available" };

        const isHealthy =
          systemHealth.status === "healthy" || systemHealth.status === "good";
        if (isHealthy) healthyCount++;

        healthCheck.systems.set(key, {
          ok: isHealthy,
          details:
            systemHealth.message ||
            systemHealth.details ||
            "System operational",
        });
      } catch (error) {
        healthCheck.systems.set(key, {
          ok: false,
          details: `Health check failed: ${error}`,
        });
      }
    }

    // Determine overall health
    const healthPercentage = totalCount > 0 ? healthyCount / totalCount : 1;

    if (healthPercentage >= 0.9) {
      healthCheck.overall = "excellent";
    } else if (healthPercentage >= 0.7) {
      healthCheck.overall = "good";
    } else if (healthPercentage >= 0.5) {
      healthCheck.overall = "degraded";
      healthCheck.recommendations.push(
        "Some visual systems are experiencing issues"
      );
    } else {
      healthCheck.overall = "critical";
      healthCheck.recommendations.push(
        "Multiple visual system failures detected"
      );
    }

    // Add performance recommendations
    if (this.currentMetrics.currentFPS < 30) {
      healthCheck.recommendations.push(
        "Low FPS detected - consider reducing visual quality"
      );
    }

    if (this.currentMetrics.memoryUsageMB > 40) {
      healthCheck.recommendations.push(
        "High memory usage - consider optimizing visual systems"
      );
    }

    this.lastHealthCheck = healthCheck;

    // Update CSS health indicator
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-visual-health",
      healthCheck.overall
    );

    return healthCheck;
  }

  // Utility methods

  private async applyConfiguration(): Promise<void> {
    // AdaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
    // Apply configuration to adaptive performance system
    // if (this.adaptivePerformanceSystem) {
    //   const profile = this.adaptivePerformanceSystem.getCurrentProfile();
    //   profile.targetFPS = this.bridgeConfig.performanceThresholds.minFPS;
    //   profile.memoryBudgetMB = this.bridgeConfig.performanceThresholds.maxMemoryMB;
    //   profile.adaptiveScaling = this.bridgeConfig.enableAdaptiveQuality;
    //
    //   this.adaptivePerformanceSystem.setProfile(profile);
    // }
  }

  private subscribeToEvents(): void {
    if (this.settingsManager && this.boundSettingsHandler) {
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundSettingsHandler
      );
    }
  }

  private startMonitoring(): void {
    if (this.bridgeConfig.enablePerformanceMonitoring) {
      this.healthCheckInterval = window.setInterval(async () => {
        await this.performVisualHealthCheck();
      }, 10000); // Every 10 seconds

      this.metricsUpdateInterval = window.setInterval(() => {
        this.updateMetrics();
      }, 1000); // Every second
    }
  }

  /**
   * Create initial metrics with enhanced performance monitoring
   */
  private createInitialMetrics(): VisualSystemMetrics {
    return {
      currentFPS: 60,
      averageFPS: 60,
      frameTime: 16.67,
      memoryUsageMB: 0,
      systemHealth: "excellent",
      activeVisualSystems: [],
      currentQuality: {
        level: "medium",
        gradientComplexity: 0.7,
        particleDensity: 100,
        animationFPS: 60,
        postProcessing: true,
        bloomEnabled: true,
        antiAliasing: "fxaa",
        shadowQuality: "medium",
        shaderPrecision: "medium",
      },
      adaptiveScaling: true,
      performanceMonitoring: true,
      eventCoordination: true,
      lastEventTime: 0,
      eventCount: 0,
    };
  }

  /**
   * Enhanced metrics update with comprehensive performance monitoring
   */
  private updateMetrics(): void {
    const startTime = performance.now();

    // Update FPS metrics with rolling average
    const currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    this.currentMetrics.currentFPS = currentFPS;
    
    // Calculate rolling average FPS (last 10 readings)
    if (!this.fpsHistory) {
      this.fpsHistory = [];
    }
    this.fpsHistory.push(currentFPS);
    if (this.fpsHistory.length > 10) {
      this.fpsHistory.shift();
    }
    this.currentMetrics.averageFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

    // Update frame time
    this.currentMetrics.frameTime =
      this.currentMetrics.currentFPS > 0
        ? 1000 / this.currentMetrics.currentFPS
        : 1000;

    // Update memory usage with more detailed tracking
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      this.currentMetrics.memoryUsageMB =
        memoryInfo.usedJSHeapSize / (1024 * 1024);
    }

    // Update active visual systems count
    this.currentMetrics.activeVisualSystems = Array.from(this.systemCache.keys()).filter(key => {
      const system = this.systemCache.get(key);
      return system && system.initialized;
    });

    // Enhanced system health determination
    this.currentMetrics.systemHealth = this.calculateSystemHealth();

    // Trigger adaptive quality adjustments if needed
    if (this.bridgeConfig.enableAdaptiveQuality) {
      this.checkAdaptiveQualityTriggers();
    }

    // Track update performance
    const updateTime = performance.now() - startTime;
    if (updateTime > 5) { // More than 5ms for metrics update is concerning
      Y3KDebug?.debug?.warn(
        "VisualSystemCoordinator",
        `Metrics update took ${updateTime.toFixed(2)}ms - performance concern`
      );
    }

    // Notify listeners if system adaptation callback is set
    if (this.onSystemAdaptation) {
      this.onSystemAdaptation(this.currentMetrics);
    }
  }

  /**
   * Calculate comprehensive system health based on multiple factors
   */
  private calculateSystemHealth(): SystemHealth {
    const { currentFPS, averageFPS, memoryUsageMB } = this.currentMetrics;
    let healthScore = 100;

    // FPS-based health scoring
    if (currentFPS < 20) healthScore -= 40;
    else if (currentFPS < 30) healthScore -= 25;
    else if (currentFPS < 45) healthScore -= 10;

    // Average FPS stability
    if (Math.abs(currentFPS - averageFPS) > 10) healthScore -= 15; // High variance

    // Memory usage impact
    if (memoryUsageMB > this.bridgeConfig.performanceThresholds.maxMemoryMB) {
      healthScore -= 20;
    } else if (memoryUsageMB > this.bridgeConfig.performanceThresholds.maxMemoryMB * 0.8) {
      healthScore -= 10;
    }

    // Active systems load
    if (this.currentMetrics.activeVisualSystems.length > 8) {
      healthScore -= 10; // Too many active systems
    }

    // Determine health category
    if (healthScore >= 90) return "excellent";
    if (healthScore >= 70) return "good";
    if (healthScore >= 50) return "degraded";
    return "critical";
  }

  /**
   * Check if adaptive quality adjustments should be triggered
   */
  private checkAdaptiveQualityTriggers(): void {
    const { systemHealth, currentFPS, memoryUsageMB } = this.currentMetrics;
    
    // Performance degradation triggers
    if (systemHealth === "critical" || currentFPS < this.bridgeConfig.performanceThresholds.minFPS) {
      this.triggerQualityReduction();
    }
    
    // Performance improvement opportunities
    else if (systemHealth === "excellent" && currentFPS > 58 && memoryUsageMB < this.bridgeConfig.performanceThresholds.maxMemoryMB * 0.5) {
      this.triggerQualityImprovement();
    }
  }

  /**
   * Trigger quality reduction for better performance
   */
  private triggerQualityReduction(): void {
    if (this.currentMetrics.currentQuality.level === "minimal") return;

    const newLevel = this.currentMetrics.currentQuality.level === "high" ? "medium" : "minimal";
    this.updateQualitySettings(newLevel);
    
    Y3KDebug?.debug?.log(
      "VisualSystemCoordinator",
      `Adaptive quality reduced to ${newLevel} due to performance constraints`
    );
  }

  /**
   * Trigger quality improvement when performance allows
   */
  private triggerQualityImprovement(): void {
    if (this.currentMetrics.currentQuality.level === "high") return;

    const newLevel = this.currentMetrics.currentQuality.level === "minimal" ? "medium" : "high";
    this.updateQualitySettings(newLevel);
    
    Y3KDebug?.debug?.log(
      "VisualSystemCoordinator",
      `Adaptive quality improved to ${newLevel} due to excellent performance`
    );
  }

  /**
   * Update quality settings across all visual systems
   */
  private updateQualitySettings(level: QualitySettings['level']): void {
    const qualityMap = {
      minimal: { gradientComplexity: 0.3, particleDensity: 25, animationFPS: 30, postProcessing: false, bloomEnabled: false, antiAliasing: "none" as const, shadowQuality: "off" as const },
      low: { gradientComplexity: 0.4, particleDensity: 40, animationFPS: 45, postProcessing: false, bloomEnabled: false, antiAliasing: "fxaa" as const, shadowQuality: "medium" as const },
      medium: { gradientComplexity: 0.6, particleDensity: 60, animationFPS: 60, postProcessing: true, bloomEnabled: true, antiAliasing: "fxaa" as const, shadowQuality: "medium" as const },
      high: { gradientComplexity: 1.0, particleDensity: 100, animationFPS: 60, postProcessing: true, bloomEnabled: true, antiAliasing: "msaa4x" as const, shadowQuality: "high" as const },
      ultra: { gradientComplexity: 1.2, particleDensity: 150, animationFPS: 60, postProcessing: true, bloomEnabled: true, antiAliasing: "msaa4x" as const, shadowQuality: "high" as const }
    } as const;

    if (level && qualityMap[level]) {
      this.currentMetrics.currentQuality = {
        level,
        ...qualityMap[level]
      };
    }

    // Apply quality settings to all active systems
    for (const [key, system] of this.systemCache.entries()) {
      if (system && system.initialized && typeof system.updateQuality === 'function') {
        try {
          system.updateQuality(this.currentMetrics.currentQuality);
        } catch (error) {
          Y3KDebug?.debug?.error(
            "VisualSystemCoordinator",
            `Failed to update quality for ${key}:`,
            error
          );
        }
      }
    }
  }

  private handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    // Handle visual system settings
    if (key.startsWith("sn-visual-")) {
      this.updateConfigurationFromSettings(key, value);
    }
  }

  private updateConfigurationFromSettings(key: string, value: any): void {
    // Update bridge configuration based on settings
    switch (key) {
      case "sn-visual-quality":
        this.bridgeConfig.qualityPreferences.preferHighQuality =
          value === "high";
        break;
      case "sn-visual-performance":
        this.bridgeConfig.enableAdaptiveQuality = value === "adaptive";
        break;
    }
  }

  private async cleanup(): Promise<void> {
    // Stop monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }

    // Clean up music adaptation interval
    if ((this as any)._musicAdaptationInterval) {
      clearInterval((this as any)._musicAdaptationInterval);
      (this as any)._musicAdaptationInterval = null;
    }

    // Remove event listeners
    if (this.boundSettingsHandler) {
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundSettingsHandler
      );
    }

    // AdaptivePerformanceSystem functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
    // Cleanup adaptive performance system
    // if (this.adaptivePerformanceSystem) {
    //   this.adaptivePerformanceSystem.removeEventListener(this.boundAdaptationHandler!);
    //   this.adaptivePerformanceSystem.destroy();
    //   this.adaptivePerformanceSystem = null;
    // }

    // Reset CSS state
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-visual-bridge-active",
      "0"
    );
  }

  // Public API
  public getMetrics(): VisualSystemMetrics {
    return { ...this.currentMetrics };
  }

  public getLastHealthCheck(): VisualSystemHealthCheck | null {
    return this.lastHealthCheck;
  }

  public getConfiguration(): VisualSystemConfig {
    return { ...this.bridgeConfig };
  }

  public async setConfiguration(
    config: Partial<VisualSystemConfig>
  ): Promise<void> {
    this.bridgeConfig = { ...this.bridgeConfig, ...config };
    await this.applyConfiguration();
  }

  public setOnSystemAdaptation(
    callback: (metrics: VisualSystemMetrics) => void
  ): void {
    this.onSystemAdaptation = callback;
  }

  public setOnHealthChange(
    callback: (health: VisualSystemHealthCheck) => void
  ): void {
    this.onHealthChange = callback;
  }

  public setOnSystemCreated(
    callback: (systemKey: VisualSystemKey, system: IManagedSystem) => void
  ): void {
    this.onSystemCreated = callback;
  }

  public getSystemStatus(): {
    initialized: boolean;
    systemsActive: number;
    healthy: boolean;
  } {
    return {
      initialized: this.isInitialized,
      systemsActive: this.systemCache.size,
      healthy:
        this.currentMetrics.systemHealth === "excellent" ||
        this.currentMetrics.systemHealth === "good",
    };
  }

  /**
   * IManagedSystem - Update animation loop (delegates to all systems)
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;

    // Update all cached visual systems
    this.systemCache.forEach((system, key) => {
      try {
        if (typeof (system as any).updateAnimation === "function") {
          (system as any).updateAnimation(deltaTime);
        } else if (typeof (system as any).onAnimate === "function") {
          (system as any).onAnimate(deltaTime);
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "VisualSystemCoordinator",
          `Error updating ${key}:`,
          error
        );
      }
    });
  }

  /**
   * IManagedSystem - Health check for all systems
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      const healthCheckResult = await this.performVisualHealthCheck();
      
      let status: "healthy" | "degraded" | "critical";
      switch (healthCheckResult.overall) {
        case "excellent":
        case "good":
          status = "healthy";
          break;
        case "degraded":
          status = "degraded";
          break;
        case "critical":
          status = "critical";
          break;
        default:
          status = "healthy";
      }

      return {
        healthy: status === "healthy",
        ok: status !== "critical",
        details: `Visual system coordinator health: ${healthCheckResult.overall} (${healthCheckResult.systems.size} systems)`,
        system: "VisualSystemCoordinator",
        issues: healthCheckResult.recommendations,
        metrics: {
          overall: healthCheckResult.overall,
          systemCount: healthCheckResult.systems.size,
          recommendations: healthCheckResult.recommendations,
          currentMetrics: this.currentMetrics,
          status
        }
      };
    } catch (error) {
      return {
        healthy: false,
        ok: false,
        details: `Health check failed: ${error}`,
        system: "VisualSystemCoordinator",
        issues: ["Health check exception"],
        metrics: { error: String(error) }
      };
    }
  }

  /**
   * IManagedSystem - Force repaint for all systems
   */
  public forceRepaint(reason?: string): void {
    Y3KDebug?.debug?.log(
      "VisualSystemCoordinator",
      `Force repaint requested${reason ? `: ${reason}` : ""}`
    );

    // Force repaint on all cached systems
    this.systemCache.forEach((system, key) => {
      try {
        if (typeof (system as any).forceRepaint === "function") {
          (system as any).forceRepaint(reason);
        } else if (typeof (system as any).refresh === "function") {
          (system as any).refresh();
        }
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "VisualSystemCoordinator",
          `Error force repainting ${key}:`,
          error
        );
      }
    });

    // Force CSS variable flush if method exists
    if (this.cssVariableController && 'flushPendingUpdates' in this.cssVariableController) {
      (this.cssVariableController as any).flushPendingUpdates();
    }
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;
    this.initialized = false;

    // Clear system cache
    this.systemCache.clear();

    Y3KDebug?.debug?.log("VisualSystemCoordinator", "Facade destroyed");
  }
}
