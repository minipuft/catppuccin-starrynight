/**
 * SystemIntegrationCoordinator - Main System Integration Coordinator
 *
 * 🔧 PHASE 2.2: Coordinates interaction between VisualEffectsCoordinator and InfrastructureSystemCoordinator
 * to provide unified system management with shared dependencies and cross-facade communication.
 *
 * ═══ THREE-LAYER ARCHITECTURE VALUE ═══
 *
 * LAYER 1 (SystemIntegrationCoordinator):
 * • Manages initialization phases (core → services → visual → integration)
 * • Aggregates health metrics from both facades for systematic troubleshooting
 * • Coordinates shared dependencies (CSS, performance, music sync services)
 * • Provides unified error recovery across visual and non-visual systems
 *
 * LAYER 2 (VisualEffectsCoordinator) - PHASE 2.2 CONSOLIDATED:
 * • Factory for visual systems (particles, backgrounds, effects)
 * • Music-aware quality adaptation and performance scaling
 * • Visual-specific dependency injection and event coordination
 * • Consolidated: GradientEffectsCoordinator, TransitionCoordinator, VisualSystemCoordinator ✅
 *
 * LAYER 3 (InfrastructureSystemCoordinator):
 * • Factory for infrastructure systems (CSS, performance, settings)
 * • Infrastructure health monitoring and configuration management
 * • Core service coordination and dependency resolution
 *
 * ═══ DIAGNOSTIC VALUE ═══
 * Each layer enables systematic issue isolation:
 * - Layer 1 problems: "Systems won't start" → Check initialization phases
 * - Layer 2 problems: "Visual effects broken" → Check music sync/visual systems
 * - Layer 3 problems: "Settings not saving" → Check infrastructure systems
 *
 * Key Features:
 * - Shared dependency management between facades
 * - Cross-facade event coordination for music-visual synchronization
 * - Multi-granular performance monitoring (system, facade, overall)
 * - Coordinated health monitoring with layer-specific diagnostics
 * - Resource optimization across facades
 * - Systematic error coordination and recovery
 *
 * Technical Architecture:
 * - Manages both visual and non-visual system facades
 * - Provides unified interface for AdvancedSystem
 * - Optimizes shared resources (PerformanceCoordinator, CSSVariableManager)
 * - Coordinates system lifecycle across facades with dependency resolution
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { CSSVariableWriter, setGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import {
  InfrastructureSystemCoordinator,
  InfrastructureSystemKey,
} from "@/core/integration/InfrastructureSystemCoordinator";
// Simplified performance system imports (replacing complex monitoring)
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { SimpleTierBasedPerformanceSystem } from "@/core/performance/SimpleTierBasedPerformanceSystem";
import { EnhancedDeviceTierDetector } from "@/core/performance/EnhancedDeviceTierDetector";
import { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";
// Legacy imports for backward compatibility (will be deprecated)
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { PerformanceBudgetManager } from "@/core/performance/PerformanceBudgetManager";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { getSettings } from "@/config";
import * as Utils from "@/utils/core/ThemeUtilities";
import { SpicetifyColorBridge } from "@/utils/spicetify/SpicetifyColorBridge";
// 🔧 PHASE 2.2: Migrated from VisualSystemCoordinator to VisualEffectsCoordinator
import {
  VisualEffectsCoordinator,
  VisualSystemKey,
} from "@/visual/effects/VisualEffectsCoordinator";
import {
  DefaultServiceFactory,
  DefaultPerformanceProfileService,
  DefaultMusicSyncLifecycleService,
  DefaultSettingsService,
  DefaultThemeLifecycleService,
  DefaultThemingStateService,
  DefaultVisualCoordinatorService
} from "@/core/services/CoreServiceProviders";

// High-energy visual effects imports for integration
import { RedEnergyBurstSystem } from "@/visual/effects/HighEnergyEffectsController";
import { MusicGlowEffectsManager } from "@/visual/effects/GlowEffectsController";
import { AnimationEffectsController } from "@/visual/effects/AnimationEffectsController";

export type SystemType = "visual" | "non-visual";
export type CoordinationMode =
  | "unified"
  | "independent"
  | "performance-optimized";

// System coordination types for enhanced management
export type InitializationPhase =
  | "core"
  | "services"
  | "visual-systems"
  | "integration"
  | "completed";

export type SystemState =
  | "uninitialized"
  | "initializing"
  | "ready"
  | "failed"
  | "destroyed";

export interface CoordinationConfig {
  enforceSequentialInitialization: boolean;
  dependencyValidation: boolean;
  enableInitializationGates: boolean;
  systemReadinessTimeout: number;
  phaseTransitionTimeout: number;
}

export interface FacadeCoordinationConfig {
  mode: CoordinationMode;
  enableSharedDependencies: boolean;
  enableCrossFacadeCommunication: boolean;
  enableUnifiedPerformanceMonitoring: boolean;
  enableResourceOptimization: boolean;
  coordination: CoordinationConfig;
  performanceThresholds: {
    maxTotalMemoryMB: number;
    maxTotalInitTime: number;
    maxCrossCommLatency: number;
  };
  coordinationPreferences: {
    preferSharedResources: boolean;
    enableEventPropagation: boolean;
    enableHealthCoordination: boolean;
  };
}

export interface UnifiedSystemMetrics {
  // Combined metrics from both facades
  totalSystems: number;
  visualSystems: number;
  nonVisualSystems: number;
  activeSystems: number;
  failedSystems: number;

  // Performance metrics
  totalMemoryMB: number;
  totalInitTime: number;
  averageSystemInitTime: number;
  crossFacadeLatency: number;

  // Health metrics
  overallHealth: "excellent" | "good" | "degraded" | "critical";
  visualHealth: "excellent" | "good" | "degraded" | "critical";
  nonVisualHealth: "excellent" | "good" | "degraded" | "critical";

  // Coordination metrics
  sharedDependencies: number;
  crossFacadeEvents: number;
  resourceOptimization: number;
}

export interface FacadeHealthCheck {
  overall: "excellent" | "good" | "degraded" | "critical";
  facades: {
    visual: { ok: boolean; details: string; systemCount: number };
    nonVisual: { ok: boolean; details: string; systemCount: number };
  };
  sharedResources: {
    simplePerformanceCoordinator: { ok: boolean; details: string };
    cssVariableController: { ok: boolean; details: string };
    musicSyncService: { ok: boolean; details: string };
    semanticColorManager?: { ok: boolean; details: string };
    // Legacy systems (will be removed after migration)
    performanceAnalyzer?: { ok: boolean; details: string };
  };
  recommendations: string[];
  timestamp: number;
}

export class SystemIntegrationCoordinator {
  // Core configuration
  private config: Year3000Config;
  private utils: typeof Utils;
  private year3000System: any;

  // Facade instances (renamed for clarity)
  // 🔧 PHASE 2.2: Migrated to VisualEffectsCoordinator for consolidated visual system management
  private visualSystemCoordinator: VisualEffectsCoordinator | null = null;
  private infrastructureSystemFacade: InfrastructureSystemCoordinator | null = null;

  // Shared dependencies (centrally managed)
  private sharedCSSVariableWriter: CSSVariableWriter | null =
    null;
  // Performance system (simplified tier-based coordination)
  private performanceCoordinator: SimplePerformanceCoordinator | null = null;
  private sharedWebGLSystemsIntegration: WebGLSystemsIntegration | null = null;
  private sharedEnhancedDeviceTierDetector: EnhancedDeviceTierDetector | null = null;
  // Device detection (for WebGL capabilities only)
  private deviceDetector: DeviceCapabilityDetector | null = null;
  private sharedMusicSyncService: MusicSyncService | null = null;
  // REMOVED: private sharedSettingsManager: SettingsManager | null = null; // Migrated to TypedSettingsManager singleton via typed settings
  private sharedColorHarmonyEngine: ColorHarmonyEngine | null = null;
  private sharedColorProcessor: any | null = null; // 🔧 PHASE 7: ColorProcessor facade integration - type is ColorProcessor but avoiding circular import
  private sharedSpicetifyColorBridge: SpicetifyColorBridge | null = null;
  private performanceProfileService: DefaultPerformanceProfileService | null = null;
  private musicSyncLifecycleService: DefaultMusicSyncLifecycleService | null = null;
  private themingStateService: DefaultThemingStateService | null = null;
  private settingsService: DefaultSettingsService | null = null;
  private themeLifecycleService: DefaultThemeLifecycleService | null = null;

  // State management
  private isInitialized = false;
  private coordinationConfig: FacadeCoordinationConfig;
  private currentMetrics: UnifiedSystemMetrics;
  private lastHealthCheck: FacadeHealthCheck | null = null;

  // Color system coordination
  private colorDependentSystems: Set<string> = new Set();
  private colorSystemRefreshCallbacks: Map<
    string,
    (trigger: string) => Promise<void>
  > = new Map();

  // Orchestration state
  private currentPhase: InitializationPhase = "core";
  private systemStates: Map<string, SystemState> = new Map();
  private phaseCompletionPromises: Map<InitializationPhase, Promise<void>> =
    new Map();
  private systemDependencies: Map<string, string[]> = new Map();
  private initializationOrder: Map<InitializationPhase, string[]> = new Map();

  // Event coordination
  private eventBus: any = null;
  private crossFacadeEventListeners: Map<string, Function[]> = new Map();

  // Monitoring
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;

  // Event callbacks
  private onSystemCreated:
    | ((type: SystemType, key: string, system: any) => void)
    | null = null;
  private onHealthChange: ((health: FacadeHealthCheck) => void) | null = null;
  private onPerformanceChange:
    | ((metrics: UnifiedSystemMetrics) => void)
    | null = null;

  constructor(
    config: Year3000Config,
    utils: typeof Utils,
    year3000System: any
  ) {
    this.config = config;
    this.utils = utils;
    this.year3000System = year3000System;

    // Initialize default coordination configuration
    this.coordinationConfig = {
      mode: "unified",
      enableSharedDependencies: true,
      enableCrossFacadeCommunication: true,
      enableUnifiedPerformanceMonitoring: true,
      enableResourceOptimization: true,
      coordination: {
        enforceSequentialInitialization: true,
        dependencyValidation: true,
        enableInitializationGates: true,
        systemReadinessTimeout: 10000, // Increased from 5000ms to allow for async initialization
        phaseTransitionTimeout: 15000, // Increased from 10000ms for better stability
      },
      performanceThresholds: {
        maxTotalMemoryMB: 150,
        maxTotalInitTime: 8000,
        maxCrossCommLatency: 10,
      },
      coordinationPreferences: {
        preferSharedResources: true,
        enableEventPropagation: true,
        enableHealthCoordination: true,
      },
    };

    // Initialize coordination system dependencies and phases
    this.setupCoordinationPhases();

    this.currentMetrics = this.createInitialMetrics();

    Y3KDebug?.debug?.log("SystemIntegrationCoordinator", "System coordinator initialized");
  }

  public async initialize(
    config?: Partial<FacadeCoordinationConfig>
  ): Promise<void> {
    if (this.isInitialized) {
      Y3KDebug?.debug?.warn("SystemIntegrationCoordinator", "Already initialized");
      return;
    }

    try {
      const startTime = performance.now();

      // Update configuration
      this.coordinationConfig = { ...this.coordinationConfig, ...config };

      if (
        this.coordinationConfig.coordination.enforceSequentialInitialization
      ) {
        Y3KDebug?.debug?.log(
          "SystemIntegrationCoordinator",
          "Starting coordinated initialization"
        );
        await this.executeCoordinatedInitialization();
      } else {
        Y3KDebug?.debug?.log(
          "SystemIntegrationCoordinator",
          "Starting legacy initialization"
        );
        await this.executeLegacyInitialization();
      }

      const endTime = performance.now();
      this.currentMetrics.totalInitTime = endTime - startTime;

      this.isInitialized = true;

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "System coordination fully initialized",
        {
          mode: this.coordinationConfig.mode,
          coordinationEnabled:
            this.coordinationConfig.coordination
              .enforceSequentialInitialization,
          currentPhase: this.currentPhase,
          visualSystems: this.currentMetrics.visualSystems,
          nonVisualSystems: this.currentMetrics.nonVisualSystems,
          initTime: this.currentMetrics.totalInitTime,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Initialization failed:",
        error
      );
      await this.cleanup();
      throw error;
    }
  }

  private async initializeSharedDependencies(): Promise<void> {
    if (!this.coordinationConfig.enableSharedDependencies) return;

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "Initializing simplified shared dependencies"
    );

    // Initialize shared dependencies in correct order
    try {
      // New simplified performance system initialization

      // Initialize device capability detector for WebGL integration
      this.deviceDetector = new DeviceCapabilityDetector({
        enableDebug: this.config.enableDebug || false,
        runStressTests: false
      });
      await this.deviceDetector.initialize();

      // Initialize enhanced device tier detector for simplified performance system
      this.sharedEnhancedDeviceTierDetector = new EnhancedDeviceTierDetector();

      // Initialize WebGL systems integration with proper DeviceCapabilityDetector
      this.sharedWebGLSystemsIntegration = new WebGLSystemsIntegration(
        this.deviceDetector
      );
      await this.sharedWebGLSystemsIntegration.initialize();

      // Initialize SimplePerformanceCoordinator with correct parameters
      this.performanceCoordinator = new SimplePerformanceCoordinator(
        this.sharedEnhancedDeviceTierDetector,
        this.sharedWebGLSystemsIntegration
      );
      await this.performanceCoordinator.initialize();

      // Initialize shared services backed by the simplified performance system
      this.performanceProfileService = new DefaultPerformanceProfileService(
        this.config,
        this.performanceCoordinator as any
      );
      this.performanceProfileService.setDependencies(
        this.config,
        this.performanceCoordinator as any
      );
      this.musicSyncLifecycleService = new DefaultMusicSyncLifecycleService();
      this.themingStateService = new DefaultThemingStateService();
      const typedSettingsManager = getSettings();
      this.settingsService = new DefaultSettingsService(typedSettingsManager);
      this.themeLifecycleService = new DefaultThemeLifecycleService(
        this.year3000System,
        this
      );

      DefaultServiceFactory.registerOverrides({
        performanceProfile: this.performanceProfileService,
        musicSyncLifecycle: this.musicSyncLifecycleService,
        themingState: this.themingStateService,
        settings: this.settingsService,
        themeLifecycle: this.themeLifecycleService
      });

      // Initialize shared CSS variable controller with simplified performance features
      try {
        // Use the new simplified performance coordinator for CSS controller
        // SimplePerformanceCoordinator provides necessary interface methods
        const performanceCoordinatorCompat = this.performanceCoordinator as any;
        
        this.sharedCSSVariableWriter = new CSSVariableWriter(
          this.config,
          performanceCoordinatorCompat
        );

        // Set global instance for systems that need global access
        setGlobalCSSVariableWriter(this.sharedCSSVariableWriter);
        
        await this.sharedCSSVariableWriter.initialize();
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "SystemIntegrationCoordinator",
          "Failed to initialize CSSVariableWriter:",
          error
        );
        this.sharedCSSVariableWriter = null;
      }

      // Core services (migrated to typed settings)
      // NOTE: SettingsManager no longer initialized - using TypedSettingsManager singleton

      this.sharedMusicSyncService = new MusicSyncService();
      await this.sharedMusicSyncService.initialize();
      this.musicSyncLifecycleService?.attach(this.sharedMusicSyncService);

      // NOTE: ColorHarmonyEngine initialization moved to initializeColorHarmonyEngine()
      // to ensure SpicetifyColorBridge is available for dependency injection

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "Shared dependencies initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to initialize shared dependencies:",
        error
      );
      throw error;
    }
  }

  private async initializeFacades(): Promise<void> {
    Y3KDebug?.debug?.log("SystemIntegrationCoordinator", "Initializing facades");

    try {
      // Get AnimationFrameCoordinator from InfrastructureSystemCoordinator for animation integration
      // Phase 3.2: Use getSystem({ cacheOnly: true }) instead of getCachedSystem()
      const animationCoordinator = (await this.infrastructureSystemFacade?.getSystem("AnimationFrameCoordinator", { cacheOnly: true })) || null;

      // 🔧 PHASE 2.2: Initialize VisualEffectsCoordinator (consolidated visual system management)
      this.visualSystemCoordinator = new VisualEffectsCoordinator(
        this.config,
        this.sharedCSSVariableWriter!,
        this.performanceCoordinator as any,
        this.sharedMusicSyncService!,
        this.sharedColorHarmonyEngine!,
        this.utils,
        this.year3000System,
        animationCoordinator
      );

      await this.visualSystemCoordinator.initialize({
        mode:
          this.coordinationConfig.mode === "performance-optimized"
            ? "performance-first"
            : "progressive",
        enablePerformanceMonitoring:
          this.coordinationConfig.enableUnifiedPerformanceMonitoring,
        enableEventCoordination:
          this.coordinationConfig.enableCrossFacadeCommunication,
      });

      const services = DefaultServiceFactory.getServices();
      const visualCoordinatorService = services.visualCoordinator as DefaultVisualCoordinatorService | undefined;
      visualCoordinatorService?.setCoordinator(this.visualSystemCoordinator);

      // Phase 3: Wire VisualSystemCoordinator to WebGLSystemsIntegration for quality scaling
      if (this.sharedWebGLSystemsIntegration) {
        this.sharedWebGLSystemsIntegration.setVisualSystemCoordinator(this.visualSystemCoordinator);
      }

      // Set up visual bridge callbacks
      this.visualSystemCoordinator.setOnSystemCreated((key, system) => {
        this.handleSystemCreated("visual", key, system);
      });

      // Initialize Non-Visual System Facade
      this.infrastructureSystemFacade = new InfrastructureSystemCoordinator(
        this.config,
        this.utils,
        this.year3000System
      );

      await this.infrastructureSystemFacade.initialize({
        mode:
          this.coordinationConfig.mode === "performance-optimized"
            ? "performance-first"
            : "progressive",
        enablePerformanceMonitoring:
          this.coordinationConfig.enableUnifiedPerformanceMonitoring,
        enableDependencyInjection:
          this.coordinationConfig.enableSharedDependencies,
      });

      // Set up non-visual facade callbacks
      this.infrastructureSystemFacade.setOnSystemCreated((key, system) => {
        this.handleSystemCreated("non-visual", key, system);
      });

      // Inject shared dependencies into non-visual facade
      this.injectSharedDependencies();

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "Facades initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to initialize facades:",
        error
      );
      throw error;
    }
  }

  private injectSharedDependencies(): void {
    if (
      !this.coordinationConfig.enableSharedDependencies ||
      !this.infrastructureSystemFacade
    )
      return;

    // Inject shared dependencies into non-visual facade
    // This ensures both facades use the same instances
    
    // New simplified performance system injection
    if (this.performanceCoordinator) {
      (this.infrastructureSystemFacade as any).simplePerformanceCoordinator =
        this.performanceCoordinator;
    }

    if (this.sharedWebGLSystemsIntegration) {
      (this.infrastructureSystemFacade as any).webglSystemsIntegration =
        this.sharedWebGLSystemsIntegration;
    }

    if (this.sharedEnhancedDeviceTierDetector) {
      (this.infrastructureSystemFacade as any).enhancedDeviceTierDetector =
        this.sharedEnhancedDeviceTierDetector;
    }

    // Legacy system injection (for backward compatibility)
    if (this.performanceCoordinator) {
      (this.infrastructureSystemFacade as any).performanceAnalyzer =
        this.performanceCoordinator;
    }

    if (this.sharedCSSVariableWriter) {
      (this.infrastructureSystemFacade as any).cssVariableController =
        this.sharedCSSVariableWriter;
    }

    if (this.sharedMusicSyncService) {
      (this.infrastructureSystemFacade as any).musicSyncService =
        this.sharedMusicSyncService;
    }

    // NOTE: SettingsManager no longer managed - using TypedSettingsManager singleton

    if (this.sharedColorHarmonyEngine) {
      (this.infrastructureSystemFacade as any).colorHarmonyEngine =
        this.sharedColorHarmonyEngine;
    }

    if (this.sharedSpicetifyColorBridge) {
      (this.infrastructureSystemFacade as any).semanticColorManager =
        this.sharedSpicetifyColorBridge;
    }
  }

  private setupSystemEventBus(): void {
    if (!this.coordinationConfig.enableCrossFacadeCommunication) return;

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "Setting up cross-facade communication"
    );

    // Set up event propagation between facades
    this.addEventListener("visual-event", (event: any) => {
      if (this.visualSystemCoordinator) {
        this.visualSystemCoordinator.propagateVisualEvent(event);
      }
    });

    this.addEventListener("performance-event", (event: any) => {
      // Propagate performance events to both facades
      if (this.visualSystemCoordinator) {
        this.visualSystemCoordinator.handleAdaptationEvent(event);
      }
      // Non-visual facade performance events would be handled here
    });

    // Set up health coordination
    if (
      this.coordinationConfig.coordinationPreferences.enableHealthCoordination
    ) {
      this.addEventListener("health-degradation", (event: any) => {
        this.handleHealthDegradation(event);
      });
    }
  }

  private async handleSystemCreated(
    type: SystemType,
    key: string,
    system: any
  ): Promise<void> {
    // Update metrics
    if (type === "visual") {
      this.currentMetrics.visualSystems++;
    } else {
      this.currentMetrics.nonVisualSystems++;
    }
    this.currentMetrics.activeSystems++;

    // ✅ ANIMATION LOOP CONSOLIDATION: Register visual systems with AnimationFrameCoordinator
    if (type === "visual" && system && typeof system.updateAnimation === "function") {
      // Phase 3.2: Use getSystem({ cacheOnly: true }) instead of getCachedSystem()
      const animationCoordinator = await this.infrastructureSystemFacade?.getSystem("AnimationFrameCoordinator", { cacheOnly: true });

      if (animationCoordinator) {
        // Determine priority based on system type
        let priority: 'critical' | 'normal' | 'background' = 'normal';

        if (key === "WebGLGradientBackground" || key.includes("WebGL")) {
          priority = 'critical'; // Background rendering is critical
        } else if (key.includes("Interaction") || key.includes("Tracking")) {
          priority = 'background'; // Tracking systems are background priority
        }

        // Register system with coordinator
        try {
          animationCoordinator.registerAnimation(
            key,
            system,
            priority
          );

          Y3KDebug?.debug?.log(
            "SystemIntegrationCoordinator",
            `Registered ${key} with AnimationFrameCoordinator (priority: ${priority})`
          );
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "SystemIntegrationCoordinator",
            `Failed to register ${key} with animation coordinator:`,
            error
          );
        }
      } else {
        Y3KDebug?.debug?.warn(
          "SystemIntegrationCoordinator",
          `Animation coordinator not available for ${key} registration`
        );
      }
    }

    // Emit system created event
    if (this.onSystemCreated) {
      this.onSystemCreated(type, key, system);
    }

    Y3KDebug?.debug?.log("SystemIntegrationCoordinator", `System created: ${type}/${key}`);
  }

  private handleHealthDegradation(event: any): void {
    Y3KDebug?.debug?.warn(
      "SystemIntegrationCoordinator",
      "Health degradation detected:",
      event
    );

    // Implement health degradation response
    // This could involve reducing system quality, disabling non-essential systems, etc.

    if (this.coordinationConfig.mode === "performance-optimized") {
      // Aggressive performance optimization
      this.applyPerformanceOptimizations();
    }
  }

  private applyPerformanceOptimizations(): void {
    // Implement performance optimization strategies
    if (this.visualSystemCoordinator) {
      this.visualSystemCoordinator.setConfiguration({
        mode: "performance-first",
        enableAdaptiveQuality: true,
        qualityPreferences: {
          preferHighQuality: false,
          allowDynamicScaling: true,
          batteryConservation: true,
        },
      });
    }

    if (this.infrastructureSystemFacade) {
      this.infrastructureSystemFacade.setConfiguration({
        mode: "performance-first",
        systemPreferences: {
          lazyInitialization: true,
          aggressiveCaching: true,
          performanceOptimization: true,
        },
      });
    }
  }

  // Public API for facade access
  // 🔧 PHASE 2.2: Use synchronous cache accessor for backward compatibility
  public getVisualSystem<T = any>(key: VisualSystemKey): T | null {
    if (!this.visualSystemCoordinator) return null;
    return this.visualSystemCoordinator.getCachedVisualSystem<T>(key);
  }

  public getCachedNonVisualSystem<T = any>(key: InfrastructureSystemKey): T | null {
    if (!this.infrastructureSystemFacade) return null;
    // Phase 3.2: Use synchronous cache accessor for backward compatibility
    return this.infrastructureSystemFacade.getCachedSystemSync<T>(key);
  }

  public async getNonVisualSystem<T = any>(
    key: InfrastructureSystemKey
  ): Promise<T | null> {
    if (!this.infrastructureSystemFacade) return null;
    return await this.infrastructureSystemFacade.getSystem<T>(key);
  }

  public async getSystem<T = any>(
    key: VisualSystemKey | InfrastructureSystemKey
  ): Promise<T | null> {
    // Try visual systems first
    if (this.visualSystemCoordinator) {
      try {
        // 🔧 PHASE 2.2: Use async getVisualSystem for on-demand creation
        return await this.visualSystemCoordinator.getVisualSystem<T>(key as VisualSystemKey);
      } catch (error) {
        // Not a visual system, try non-visual
      }
    }

    // Try non-visual systems
    if (this.infrastructureSystemFacade) {
      try {
        return await this.infrastructureSystemFacade.getSystem<T>(
          key as InfrastructureSystemKey
        );
      } catch (error) {
        // Not a non-visual system either
      }
    }

    return null;
  }

  // Cross-facade event system
  public addEventListener(eventType: string, listener: Function): void {
    if (!this.crossFacadeEventListeners.has(eventType)) {
      this.crossFacadeEventListeners.set(eventType, []);
    }
    this.crossFacadeEventListeners.get(eventType)!.push(listener);
  }

  public removeEventListener(eventType: string, listener: Function): void {
    const listeners = this.crossFacadeEventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public emitEvent(eventType: string, event: any): void {
    const listeners = this.crossFacadeEventListeners.get(eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          Y3KDebug?.debug?.error(
            "SystemIntegrationCoordinator",
            `Error in event listener for ${eventType}:`,
            error
          );
        }
      });
    }

    // Update cross-facade event metrics
    this.currentMetrics.crossFacadeEvents++;
  }

  // Health monitoring
  public async performHealthCheck(): Promise<FacadeHealthCheck> {
    const healthCheck: FacadeHealthCheck = {
      overall: "good",
      facades: {
        visual: {
          ok: true,
          details: "Visual systems operational",
          systemCount: 0,
        },
        nonVisual: {
          ok: true,
          details: "Non-visual systems operational",
          systemCount: 0,
        },
      },
      sharedResources: {
        simplePerformanceCoordinator: {
          ok: true,
          details: "Simple performance coordinator operational",
        },
        cssVariableController: {
          ok: true,
          details: "CSS variable batcher operational",
        },
        musicSyncService: {
          ok: true,
          details: "Music sync service operational",
        },
        // Legacy systems (optional for backward compatibility)
        performanceAnalyzer: {
          ok: true,
          details: "Legacy performance analyzer operational",
        },
      },
      recommendations: [],
      timestamp: performance.now(),
    };

    // Check visual facade
    if (this.visualSystemCoordinator) {
      try {
        const visualHealth = await this.visualSystemCoordinator.performVisualHealthCheck();
        healthCheck.facades.visual.ok =
          visualHealth.overall === "excellent" ||
          visualHealth.overall === "good";
        healthCheck.facades.visual.details = `Visual systems: ${visualHealth.overall}`;
        healthCheck.facades.visual.systemCount = visualHealth.systems.size;
      } catch (error) {
        healthCheck.facades.visual.ok = false;
        healthCheck.facades.visual.details = `Visual facade error: ${error}`;
      }
    }

    // Check non-visual facade
    if (this.infrastructureSystemFacade) {
      try {
        const nonVisualHealth = await this.infrastructureSystemFacade.performHealthCheck();
        healthCheck.facades.nonVisual.ok =
          nonVisualHealth.overall === "excellent" ||
          nonVisualHealth.overall === "good";
        healthCheck.facades.nonVisual.details = `Non-visual systems: ${nonVisualHealth.overall}`;
        healthCheck.facades.nonVisual.systemCount =
          nonVisualHealth.systems.size;
      } catch (error) {
        healthCheck.facades.nonVisual.ok = false;
        healthCheck.facades.nonVisual.details = `Non-visual facade error: ${error}`;
      }
    }

    // Check shared resources
    // New simplified performance system health check
    if (this.performanceCoordinator) {
      try {
        const performanceHealth = await this.performanceCoordinator.healthCheck();
        healthCheck.sharedResources.simplePerformanceCoordinator.ok = performanceHealth.healthy;
        healthCheck.sharedResources.simplePerformanceCoordinator.details = performanceHealth.details || "Simple performance coordinator operational";
      } catch (error) {
        healthCheck.sharedResources.simplePerformanceCoordinator.ok = false;
        healthCheck.sharedResources.simplePerformanceCoordinator.details = `Simple performance coordinator error: ${error}`;
      }
    }

    // Simple performance coordinator health check 
    if (this.performanceCoordinator) {
      try {
        const performanceHealth = await this.performanceCoordinator.healthCheck();
        healthCheck.sharedResources.performanceAnalyzer = {
          ok: performanceHealth.healthy,
          details: performanceHealth.details || "Simple performance coordinator operational"
        };
      } catch (error) {
        healthCheck.sharedResources.performanceAnalyzer = {
          ok: false,
          details: `Simple performance coordinator error: ${error}`
        };
      }
    }

    // Check shared CSS variable controller
    if (this.sharedCSSVariableWriter) {
      try {
        const cssHealth =
          await this.sharedCSSVariableWriter.healthCheck();
        healthCheck.sharedResources.cssVariableController.ok =
          cssHealth.healthy || cssHealth.ok || false;
        healthCheck.sharedResources.cssVariableController.details =
          cssHealth.details || "CSS variable controller operational";
      } catch (error) {
        healthCheck.sharedResources.cssVariableController.ok = false;
        healthCheck.sharedResources.cssVariableController.details = `CSS variable controller error: ${error}`;
      }
    }

    // Check shared music sync service
    if (this.sharedMusicSyncService) {
      try {
        const musicHealth = await this.sharedMusicSyncService.healthCheck();
        healthCheck.sharedResources.musicSyncService.ok =
          musicHealth.status === "healthy";
        healthCheck.sharedResources.musicSyncService.details =
          musicHealth.message || "Music sync service operational";
      } catch (error) {
        healthCheck.sharedResources.musicSyncService.ok = false;
        healthCheck.sharedResources.musicSyncService.details = `Music sync service error: ${error}`;
      }
    }

    // Check SpicetifyColorBridge
    if (this.sharedSpicetifyColorBridge) {
      try {
        const semanticColorHealth =
          await this.sharedSpicetifyColorBridge.healthCheck();
        const semanticColorOk = semanticColorHealth.healthy;

        // Add SpicetifyColorBridge to shared resources check
        healthCheck.sharedResources.semanticColorManager = {
          ok: semanticColorOk,
          details:
            semanticColorHealth.details || "Semantic color manager operational",
        };
      } catch (error) {
        healthCheck.sharedResources.semanticColorManager = {
          ok: false,
          details: `Semantic color manager error: ${error}`,
        };
      }
    }

    // Determine overall health
    const facadeHealthy =
      healthCheck.facades.visual.ok && healthCheck.facades.nonVisual.ok;
    const resourcesHealthy =
      healthCheck.sharedResources.simplePerformanceCoordinator.ok &&
      healthCheck.sharedResources.cssVariableController.ok &&
      healthCheck.sharedResources.musicSyncService.ok &&
      healthCheck.sharedResources.semanticColorManager?.ok !== false &&
      healthCheck.sharedResources.performanceAnalyzer?.ok !== false;

    if (facadeHealthy && resourcesHealthy) {
      healthCheck.overall = "excellent";
    } else if (facadeHealthy || resourcesHealthy) {
      healthCheck.overall = "good";
    } else {
      healthCheck.overall = "critical";
      healthCheck.recommendations.push(
        "Multiple system failures detected - consider system restart"
      );
    }

    // Add performance recommendations
    if (this.currentMetrics.totalMemoryMB > 120) {
      healthCheck.recommendations.push(
        "High memory usage - consider optimizing system memory"
      );
    }

    if (this.currentMetrics.totalInitTime > 6000) {
      healthCheck.recommendations.push(
        "High initialization time - consider optimizing system startup"
      );
    }

    this.lastHealthCheck = healthCheck;

    // Emit health change event
    if (this.onHealthChange) {
      this.onHealthChange(healthCheck);
    }

    return healthCheck;
  }

  // Utility methods
  private createInitialMetrics(): UnifiedSystemMetrics {
    return {
      totalSystems: 0,
      visualSystems: 0,
      nonVisualSystems: 0,
      activeSystems: 0,
      failedSystems: 0,
      totalMemoryMB: 0,
      totalInitTime: 0,
      averageSystemInitTime: 0,
      crossFacadeLatency: 0,
      overallHealth: "good",
      visualHealth: "good",
      nonVisualHealth: "good",
      sharedDependencies: 6, // Number of shared dependencies
      crossFacadeEvents: 0,
      resourceOptimization: 0,
    };
  }

  private startMonitoring(): void {
    if (this.coordinationConfig.enableUnifiedPerformanceMonitoring) {
      this.healthCheckInterval = window.setInterval(async () => {
        await this.performHealthCheck();
      }, 20000); // Every 20 seconds

      this.metricsUpdateInterval = window.setInterval(() => {
        this.updateMetrics();
      }, 2000); // Every 2 seconds
    }
  }

  private updateMetrics(): void {
    // Update combined metrics from both facades
    if (this.visualSystemCoordinator) {
      const visualMetrics = this.visualSystemCoordinator.getMetrics();
      this.currentMetrics.visualHealth = visualMetrics.systemHealth;
    }

    if (this.infrastructureSystemFacade) {
      const nonVisualMetrics = this.infrastructureSystemFacade.getMetrics();
      this.currentMetrics.nonVisualHealth = nonVisualMetrics.systemHealth;
    }

    // Update memory usage
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      this.currentMetrics.totalMemoryMB =
        memoryInfo.usedJSHeapSize / (1024 * 1024);
    }

    // Update overall health
    if (
      this.currentMetrics.visualHealth === "excellent" &&
      this.currentMetrics.nonVisualHealth === "excellent"
    ) {
      this.currentMetrics.overallHealth = "excellent";
    } else if (
      this.currentMetrics.visualHealth === "critical" ||
      this.currentMetrics.nonVisualHealth === "critical"
    ) {
      this.currentMetrics.overallHealth = "critical";
    } else if (
      this.currentMetrics.visualHealth === "degraded" ||
      this.currentMetrics.nonVisualHealth === "degraded"
    ) {
      this.currentMetrics.overallHealth = "degraded";
    } else {
      this.currentMetrics.overallHealth = "good";
    }

    // Emit performance change event
    if (this.onPerformanceChange) {
      this.onPerformanceChange(this.currentMetrics);
    }
  }

  // ============================================================================
  // Orchestration Methods - Enhanced Coordination Logic
  // ============================================================================

  private setupCoordinationPhases(): void {
    // Define system dependencies for proper coordination
    this.systemDependencies.set("MusicSyncService", []);
    this.systemDependencies.set("ColorProcessor", []); // 🔧 CRITICAL: ColorProcessor needs no dependencies, must init BEFORE MusicSyncService emits events
    this.systemDependencies.set("ColorHarmonyEngine", [
      "MusicSyncService",
      "SpicetifyColorBridge",
    ]);
    this.systemDependencies.set("PerformanceAnalyzer", []);
    this.systemDependencies.set("CSSVariableWriter", [
      "PerformanceAnalyzer",
    ]);
    // NOTE: SettingsManager removed - using TypedSettingsManager singleton
    this.systemDependencies.set("SpicetifyColorBridge", [
      "CSSVariableWriter",
    ]);

    // Define initialization order by phase
    this.initializationOrder.set("core", [
      "PerformanceAnalyzer",
      "CSSVariableWriter",
    ]);
    this.initializationOrder.set("services", [
      // NOTE: SettingsManager removed - using TypedSettingsManager singleton
      "ColorProcessor", // 🔧 PHASE 7: Added to facade coordination - MUST init FIRST to subscribe to colors:extracted BEFORE MusicSyncService emits
      "MusicSyncService",
      "SpicetifyColorBridge",
    ]);
    this.initializationOrder.set("visual-systems", ["ColorHarmonyEngine"]);
    this.initializationOrder.set("integration", [
      "VisualSystemCoordinator",
      "InfrastructureSystemCoordinator",
    ]);

    // Initialize all systems as uninitialized
    for (const [phase, systems] of this.initializationOrder.entries()) {
      for (const system of systems) {
        this.systemStates.set(system, "uninitialized");
      }
    }

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "Coordination phases configured",
      {
        phases: Array.from(this.initializationOrder.keys()),
        totalSystems: this.systemStates.size,
        dependencies: Object.fromEntries(this.systemDependencies),
      }
    );
  }

  private async executeCoordinatedInitialization(): Promise<void> {
    const phases: InitializationPhase[] = [
      "core",
      "services",
      "visual-systems",
      "integration",
    ];

    for (const phase of phases) {
      Y3KDebug?.debug?.log("SystemIntegrationCoordinator", `Starting phase: ${phase}`);
      this.currentPhase = phase;

      try {
        await this.executePhase(phase);
        Y3KDebug?.debug?.log(
          "SystemIntegrationCoordinator",
          `Phase ${phase} completed successfully`
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "SystemIntegrationCoordinator",
          `Phase ${phase} failed:`,
          error
        );
        throw new Error(`Orchestration failed at phase ${phase}: ${error}`);
      }
    }

    this.currentPhase = "completed";

    // Set up cross-facade communication
    this.setupSystemEventBus();

    // Setup gradient system coordination
    await this.setupGradientSystemCoordination();

    // Setup default color-dependent systems
    this.setupDefaultColorDependentSystems();

    // Start monitoring
    this.startMonitoring();

    // Perform initial health check
    await this.performHealthCheck();
  }

  private async executePhase(phase: InitializationPhase): Promise<void> {
    const systems = this.initializationOrder.get(phase);
    if (!systems) {
      throw new Error(`Unknown phase: ${phase}`);
    }

    const initPromises: Promise<void>[] = [];

    for (const systemName of systems) {
      initPromises.push(this.initializeSystemWithDependencies(systemName));
    }

    // Wait for all systems in this phase to complete
    await Promise.all(initPromises);

    // Validate all systems in this phase are ready
    for (const systemName of systems) {
      const state = this.systemStates.get(systemName);
      if (state !== "ready") {
        throw new Error(
          `System ${systemName} not ready after phase ${phase} (state: ${state})`
        );
      }
    }
  }

  private async initializeSystemWithDependencies(
    systemName: string
  ): Promise<void> {
    // Check if system is already initialized
    if (this.systemStates.get(systemName) === "ready") {
      return;
    }

    // Mark as initializing
    this.systemStates.set(systemName, "initializing");

    try {
      // Wait for dependencies first
      const dependencies = this.systemDependencies.get(systemName) || [];
      for (const dependency of dependencies) {
        await this.waitForSystemReady(dependency);
      }

      // Initialize the system
      switch (systemName) {
        case "PerformanceAnalyzer":
          await this.initializePerformanceAnalyzer();
          break;
        case "CSSVariableWriter":
          await this.initializeUnifiedCSSController();
          break;
        // NOTE: SettingsManager case removed - using TypedSettingsManager singleton
        case "ColorProcessor":
          await this.initializeColorProcessor();
          break;
        case "MusicSyncService":
          await this.initializeMusicSyncService();
          break;
        case "ColorHarmonyEngine":
          await this.initializeColorHarmonyEngine();
          break;
        case "SpicetifyColorBridge":
          await this.initializeSpicetifyColorBridge();
          break;
        case "VisualSystemCoordinator":
          await this.initializeVisualFacade();
          break;
        case "InfrastructureSystemCoordinator":
          await this.initializeNonVisualFacade();
          break;
        default:
          throw new Error(`Unknown system: ${systemName}`);
      }

      this.systemStates.set(systemName, "ready");
      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        `System ${systemName} initialized successfully`
      );
    } catch (error) {
      this.systemStates.set(systemName, "failed");
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        `System ${systemName} initialization failed:`,
        error
      );
      throw error;
    }
  }

  private async waitForSystemReady(systemName: string): Promise<void> {
    const timeout =
      this.coordinationConfig.coordination.systemReadinessTimeout;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const state = this.systemStates.get(systemName);
      if (state === "ready") {
        return;
      }
      if (state === "failed") {
        throw new Error(`Dependency ${systemName} failed to initialize`);
      }
      // Wait 50ms before checking again
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    throw new Error(`Timeout waiting for dependency ${systemName} to be ready`);
  }

  // Individual system initialization methods
  private async initializePerformanceAnalyzer(): Promise<void> {
    // Initialize both new simplified and legacy performance systems
    
    // Create DeviceCapabilityDetector for WebGL if not exists
    if (!this.deviceDetector) {
      this.deviceDetector = new DeviceCapabilityDetector({
        enableDebug: true, // Enable debug for troubleshooting
        spicetifyContext: true
      });
      await this.deviceDetector.initialize();
    }
    
    // Create enhanced tier detector for simplified performance system
    this.sharedEnhancedDeviceTierDetector = new EnhancedDeviceTierDetector();
    
    // Initialize WebGL with proper DeviceCapabilityDetector
    this.sharedWebGLSystemsIntegration = new WebGLSystemsIntegration(
      this.deviceDetector
    );
    await this.sharedWebGLSystemsIntegration.initialize();
    
    this.performanceCoordinator = new SimplePerformanceCoordinator(
      this.sharedEnhancedDeviceTierDetector,
      this.sharedWebGLSystemsIntegration
    );
    await this.performanceCoordinator.initialize();

    // Legacy system removed - using SimplePerformanceCoordinator instead
    // this.performanceCoordinator = new PerformanceAnalyzer(); // REMOVED: Complex monitoring replaced with tier-based system
  }

  private async initializeUnifiedCSSController(): Promise<void> {
    if (!this.performanceCoordinator) {
      throw new Error("SimplePerformanceCoordinator dependency not available");
    }

    try {
      // Use the already-initialized performanceCoordinator from initializePerformanceAnalyzer()
      // No need to recreate DeviceCapabilityDetector - it's already initialized

      this.sharedCSSVariableWriter = new CSSVariableWriter(
        this.config,
        this.performanceCoordinator as any
      );

      // Set global instance for systems that need global access
      setGlobalCSSVariableWriter(this.sharedCSSVariableWriter);

      await this.sharedCSSVariableWriter.initialize();

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "CSSVariableWriter initialized successfully with SimplePerformanceCoordinator"
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "SystemIntegrationCoordinator",
        "Failed to initialize CSSVariableWriter:",
        error
      );
      this.sharedCSSVariableWriter = null;
      throw error;
    }
  }

  // NOTE: initializeSettingsManager() removed - using TypedSettingsManager singleton
  // All systems now use typed settings directly via: import { settings } from "@/config";

  private async initializeColorProcessor(): Promise<void> {
    try {
      // 🔧 PHASE 7: ColorProcessor facade integration
      // Dynamic import to avoid circular dependencies
      const { globalColorProcessor } = await import("@/core/color/ColorProcessor");

      console.log("🎨 [SystemIntegrationCoordinator] Initializing ColorProcessor...");
      await globalColorProcessor.initialize();

      this.sharedColorProcessor = globalColorProcessor;

      console.log("🎨 [SystemIntegrationCoordinator] ✅ ColorProcessor initialized successfully");

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "ColorProcessor initialized and ready to receive colors:extracted events"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to initialize ColorProcessor:",
        error
      );
      throw error;
    }
  }

  private async initializeMusicSyncService(): Promise<void> {
    this.sharedMusicSyncService = new MusicSyncService({
      ADVANCED_SYSTEM_CONFIG: this.config,
      ThemeUtilities: this.utils,
      performanceMonitor: this.performanceCoordinator as any,
      // NOTE: settingsManager removed - using typed settings directly
      year3000System: this.year3000System,
    });
    await this.sharedMusicSyncService.initialize();
  }

  private async initializeSpicetifyColorBridge(): Promise<void> {
    if (!this.sharedCSSVariableWriter) {
      throw new Error(
        "CSSVariableWriter dependency not available"
      );
    }

    this.sharedSpicetifyColorBridge = new SpicetifyColorBridge({
      enableDebug: this.config.enableDebug || false,
      fallbackToSpiceColors: true,
      cacheDuration: 5000,
    });

    await this.sharedSpicetifyColorBridge.initialize(
      this.sharedCSSVariableWriter
    );

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "SpicetifyColorBridge initialized successfully",
      {
        systemMetrics: this.sharedSpicetifyColorBridge.getSystemMetrics(),
      }
    );
  }

  private async initializeColorHarmonyEngine(): Promise<void> {
    if (!this.sharedMusicSyncService) {
      throw new Error("MusicSyncService dependency not available");
    }

    if (!this.sharedSpicetifyColorBridge) {
      throw new Error("SpicetifyColorBridge dependency not available");
    }

    // Pass shared SpicetifyColorBridge instance to ColorHarmonyEngine
    this.sharedColorHarmonyEngine = new ColorHarmonyEngine(
      this.config,
      this.utils,
      (this.performanceCoordinator as any) || undefined,
      this.sharedSpicetifyColorBridge // Dependency injection - single shared instance
      // NOTE: settingsManager parameter removed - using typed settings directly
    );

    // SpicetifyColorBridge now integrated via dependency injection (single instance)
    // in ColorHarmonyEngine's constructor or through the AdvancedSystem bridge

    await this.sharedColorHarmonyEngine.initialize();
  }

  private async initializeVisualFacade(): Promise<void> {
    // 🔧 PHASE 2.2: Initialize VisualEffectsCoordinator (consolidated visual system management)
    this.visualSystemCoordinator = new VisualEffectsCoordinator(
      this.config,
      this.sharedCSSVariableWriter!,
      this.performanceCoordinator as any,
      this.sharedMusicSyncService!,
      this.sharedColorHarmonyEngine || undefined, // optional
      this.sharedColorProcessor || undefined, // 🔧 PHASE 7: ColorProcessor dependency injection
      this.utils,
      this, // year3000System
      undefined // animationCoordinator (not available yet in this initialization path)
    );

    // Note: SpicetifyColorBridge can be accessed through SystemIntegrationCoordinator shared dependencies
    // Visual systems that need it can get it via getSharedSpicetifyColorBridge()

    await this.visualSystemCoordinator.initialize();

    // Phase 3: Wire VisualEffectsCoordinator to WebGLSystemsIntegration for quality scaling
    if (this.sharedWebGLSystemsIntegration) {
      this.sharedWebGLSystemsIntegration.setVisualSystemCoordinator(this.visualSystemCoordinator);
    }
  }

  private async initializeNonVisualFacade(): Promise<void> {
    this.infrastructureSystemFacade = new InfrastructureSystemCoordinator(this.config, this.utils, {
      performanceAnalyzer: this.performanceCoordinator as any,
      unifiedCSSConsciousnessController:
        this.sharedCSSVariableWriter,
      musicSyncService: this.sharedMusicSyncService,
      // NOTE: settingsManager removed - using typed settings directly
      colorHarmonyEngine: this.sharedColorHarmonyEngine,
      performanceOrchestrator: this.performanceCoordinator,
      semanticColorManager: this.sharedSpicetifyColorBridge,
    });
    await this.infrastructureSystemFacade.initialize();
  }

  private async executeLegacyInitialization(): Promise<void> {
    // Original initialization logic for backward compatibility
    await this.initializeSharedDependencies();
    await this.initializeFacades();
    this.setupSystemEventBus();
    await this.setupGradientSystemCoordination();
    this.setupDefaultColorDependentSystems();
    this.startMonitoring();
    await this.performHealthCheck();
  }

  // Public coordination API
  public getCurrentPhase(): InitializationPhase {
    return this.currentPhase;
  }

  public getSystemState(systemName: string): SystemState | undefined {
    return this.systemStates.get(systemName);
  }

  public getAllSystemStates(): Map<string, SystemState> {
    return new Map(this.systemStates);
  }

  public isOrchestrationEnabled(): boolean {
    return this.coordinationConfig.coordination
      .enforceSequentialInitialization;
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

    // Cleanup facades
    if (this.visualSystemCoordinator) {
      await this.visualSystemCoordinator.destroy();
      this.visualSystemCoordinator = null;
    }

    const services = DefaultServiceFactory.getServices();
    const visualCoordinatorService = services.visualCoordinator as DefaultVisualCoordinatorService | undefined;
    visualCoordinatorService?.setCoordinator(null);

    if (this.infrastructureSystemFacade) {
      await this.infrastructureSystemFacade.destroy();
      this.infrastructureSystemFacade = null;
    }

    // Cleanup shared dependencies
    
    // Clean up new simplified performance systems first
    if (this.performanceCoordinator) {
      this.performanceCoordinator.destroy();
      this.performanceCoordinator = null;
    }

    if (this.sharedWebGLSystemsIntegration) {
      this.sharedWebGLSystemsIntegration.destroy();
      this.sharedWebGLSystemsIntegration = null;
    }

    if (this.sharedEnhancedDeviceTierDetector) {
      // EnhancedDeviceTierDetector doesn't have a destroy method (simple object)
      this.sharedEnhancedDeviceTierDetector = null;
    }

    if (this.sharedSpicetifyColorBridge) {
      this.sharedSpicetifyColorBridge.destroy();
      this.sharedSpicetifyColorBridge = null;
    }

    if (this.sharedColorHarmonyEngine) {
      // ColorHarmonyEngine has destroy method
      this.sharedColorHarmonyEngine.destroy();
      this.sharedColorHarmonyEngine = null;
    }

    if (this.sharedMusicSyncService) {
      // MusicSyncService has destroy method
      this.sharedMusicSyncService.destroy();
      this.sharedMusicSyncService = null;
    }

    if (this.performanceProfileService) {
      this.performanceProfileService.destroy();
      this.performanceProfileService = null;
    }

    this.musicSyncLifecycleService = null;
    this.themingStateService = null;
    this.settingsService = null;
    this.themeLifecycleService = null;

    // NOTE: SettingsManager destroy removed - using TypedSettingsManager singleton (no cleanup needed)

    if (this.sharedCSSVariableWriter) {
      // CSSVariableWriter has destroy method
      this.sharedCSSVariableWriter.destroy();
      this.sharedCSSVariableWriter = null;
    }

    // Clean up legacy performance systems
    if (this.performanceCoordinator) {
      // SimplePerformanceCoordinator has destroy method
      (this.performanceCoordinator as any).destroy();
      this.performanceCoordinator = null;
    }

    if (this.deviceDetector) {
      // DeviceCapabilityDetector has destroy method
      this.deviceDetector.destroy();
      this.deviceDetector = null;
    }

    // Clear event listeners
    this.crossFacadeEventListeners.clear();
  }

  // Public API
  public getMetrics(): UnifiedSystemMetrics {
    return { ...this.currentMetrics };
  }

  public getLastHealthCheck(): FacadeHealthCheck | null {
    return this.lastHealthCheck;
  }

  public getConfiguration(): FacadeCoordinationConfig {
    return { ...this.coordinationConfig };
  }

  public async setConfiguration(
    config: Partial<FacadeCoordinationConfig>
  ): Promise<void> {
    this.coordinationConfig = { ...this.coordinationConfig, ...config };
    // Apply configuration changes to facades
    // Implementation would update facade configurations
  }

  public setOnSystemCreated(
    callback: (type: SystemType, key: string, system: any) => void
  ): void {
    this.onSystemCreated = callback;
  }

  public setOnHealthChange(
    callback: (health: FacadeHealthCheck) => void
  ): void {
    this.onHealthChange = callback;
  }

  public setOnPerformanceChange(
    callback: (metrics: UnifiedSystemMetrics) => void
  ): void {
    this.onPerformanceChange = callback;
  }

  public getSystemStatus(): {
    initialized: boolean;
    visualSystems: number;
    nonVisualSystems: number;
    healthy: boolean;
  } {
    return {
      initialized: this.isInitialized,
      visualSystems: this.visualSystemCoordinator?.getSystemStatus()?.systemsActive || 0,
      nonVisualSystems:
        this.infrastructureSystemFacade?.getSystemStatus()?.systemsActive || 0,
      healthy:
        this.currentMetrics.overallHealth === "excellent" ||
        this.currentMetrics.overallHealth === "good",
    };
  }

  // ============================================================================
  // Gradient System Coordination Methods
  // ============================================================================

  /**
   * Setup comprehensive gradient system coordination
   * This method coordinates all gradient-related systems after facades are initialized
   */
  private async setupGradientSystemCoordination(): Promise<void> {
    if (!this.visualSystemCoordinator) {
      Y3KDebug?.debug?.warn(
        "SystemIntegrationCoordinator",
        "VisualSystemCoordinator not available - skipping gradient system coordination"
      );
      return;
    }

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "Setting up gradient system coordination"
    );

    const gradientCoordinationStartTime = performance.now();
    let coordinatedSystems = 0;

    try {
      // 1. Initialize GradientConductor through facade and register coordination
      await this.coordinateGradientConductor();
      coordinatedSystems++;

      // 2. Coordinate WebGL gradient system
      await this.coordinateWebGLGradientSystem();
      coordinatedSystems++;

      // 3. Register gradient system refresh callbacks
      this.setupGradientSystemRefreshCallbacks();

      // 4. Setup cross-gradient system communication
      this.setupGradientSystemCommunication();

      const coordinationDuration =
        performance.now() - gradientCoordinationStartTime;

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "Gradient system coordination completed",
        {
          coordinatedSystems,
          duration: `${coordinationDuration.toFixed(2)}ms`,
          systems: [
            "GradientConductor",
            "WebGLGradientBackgroundSystem",
            "GradientTransitionOrchestrator",
          ],
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to setup gradient system coordination:",
        error
      );
      throw error;
    }
  }

  /**
   * Coordinate GradientConductor system through VisualSystemCoordinator
   */
  private async coordinateGradientConductor(): Promise<void> {
    try {
      // 🔧 PHASE 2.2: Get GradientConductor through VisualEffectsCoordinator factory pattern
      const gradientConductor =
        await this.visualSystemCoordinator!.getVisualSystem("GradientConductor");

      if (!gradientConductor) {
        Y3KDebug?.debug?.warn(
          "SystemIntegrationCoordinator",
          "GradientConductor not available via VisualEffectsCoordinator"
        );
        return;
      }

      // Register for cross-system communication
      this.addEventListener("gradient-conductor-event", (event: any) => {
        if (
          gradientConductor &&
          typeof (gradientConductor as any).handleSystemEvent === "function"
        ) {
          (gradientConductor as any).handleSystemEvent(event);
        }
      });

      // Register color refresh callback
      this.registerColorDependentSystem(
        "GradientConductor",
        async (trigger: string) => {
          if (
            gradientConductor &&
            typeof (gradientConductor as any).refreshColorState === "function"
          ) {
            await (gradientConductor as any).refreshColorState(trigger);
          } else if (
            gradientConductor &&
            typeof (gradientConductor as any).setPalette === "function"
          ) {
            // Fallback to setPalette if refreshColorState not available
            const colorHarmonyEngine = this.sharedColorHarmonyEngine;
            if (colorHarmonyEngine) {
              try {
                const currentGradient =
                  await colorHarmonyEngine.getCurrentGradient();
                if (currentGradient) {
                  (gradientConductor as any).setPalette(currentGradient);
                }
              } catch (error) {
                Y3KDebug?.debug?.warn(
                  "SystemIntegrationCoordinator",
                  "Failed to refresh GradientConductor colors:",
                  error
                );
              }
            }
          }
        }
      );

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "GradientConductor coordination established"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to coordinate GradientConductor:",
        error
      );
    }
  }

  /**
   * Coordinate WebGL gradient background system
   */
  private async coordinateWebGLGradientSystem(): Promise<void> {
    try {
      // 🔧 PHASE 2.2: Get WebGL system through VisualEffectsCoordinator with await
      const webglSystem = await this.visualSystemCoordinator!.getVisualSystem("WebGLBackground");

      if (!webglSystem) {
        Y3KDebug?.debug?.warn(
          "SystemIntegrationCoordinator",
          "WebGLGradientBackgroundSystem not available via VisualEffectsCoordinator"
        );
        return;
      }

      // Register cross-system event handling
      this.addEventListener("webgl-gradient-event", (event: any) => {
        if (
          webglSystem &&
          typeof (webglSystem as any).handleSystemEvent === "function"
        ) {
          (webglSystem as any).handleSystemEvent(event);
        }
      });

      // Register color refresh callback
      this.registerColorDependentSystem(
        "WebGLGradientBackgroundSystem",
        async (trigger: string) => {
          if (
            webglSystem &&
            typeof (webglSystem as any).refreshColorState === "function"
          ) {
            await (webglSystem as any).refreshColorState(trigger);
          } else if (
            webglSystem &&
            typeof (webglSystem as any).updateGradientTexture === "function"
          ) {
            // Fallback to updateGradientTexture if refreshColorState not available
            await (webglSystem as any).updateGradientTexture();
          }
        }
      );

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "WebGLGradientBackgroundSystem coordination established"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "SystemIntegrationCoordinator",
        "Failed to coordinate WebGLGradientBackgroundSystem:",
        error
      );
    }
  }

  /**
   * Setup refresh callbacks for all gradient systems
   */
  private setupGradientSystemRefreshCallbacks(): void {
    // Register GradientTransitionOrchestrator (if available via existing system)
    try {
      // GradientTransitionOrchestrator is typically managed by existing Year3000 system initialization
      // Register it for color-dependent updates without facade access
      this.registerColorDependentSystem("GradientTransitionOrchestrator");

      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "GradientTransitionOrchestrator registered for color updates"
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "SystemIntegrationCoordinator",
        "Failed to register GradientTransitionOrchestrator:",
        error
      );
    }
  }

  /**
   * Setup communication between gradient systems
   */
  private setupGradientSystemCommunication(): void {
    // Listen for color harmony updates and propagate to gradient systems
    this.addEventListener("color-harmony-updated", async (event: any) => {
      try {
        // Refresh all gradient systems when colors change
        await this.refreshColorDependentSystems("color-harmony-update");

        // Emit gradient coordination event
        this.emitEvent("gradient-systems-updated", {
          trigger: "color-harmony-update",
          timestamp: Date.now(),
          systems: [
            "GradientConductor",
            "WebGLGradientBackgroundSystem",
            "GradientTransitionOrchestrator",
          ],
        });
      } catch (error) {
        Y3KDebug?.debug?.error(
          "SystemIntegrationCoordinator",
          "Failed to propagate color harmony update to gradient systems:",
          error
        );
      }
    });

    // Listen for performance changes and coordinate gradient quality scaling
    this.addEventListener("performance-event", (event: any) => {
      try {
        // Propagate performance events to gradient systems for quality scaling
        this.emitEvent("gradient-performance-event", {
          ...event,
          timestamp: Date.now(),
        });
      } catch (error) {
        Y3KDebug?.debug?.error(
          "SystemIntegrationCoordinator",
          "Failed to propagate performance event to gradient systems:",
          error
        );
      }
    });

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      "Gradient system communication established"
    );
  }

  /**
   * Get gradient system coordination status
   */
  public getGradientSystemStatus(): {
    coordinatedSystems: string[];
    colorDependentGradientSystems: string[];
    communicationActive: boolean;
  } {
    const gradientSystems = [
      "GradientConductor",
      "WebGLGradientBackgroundSystem",
      "GradientTransitionOrchestrator",
    ];
    const colorDependentGradientSystems = gradientSystems.filter((system) =>
      this.colorDependentSystems.has(system)
    );

    return {
      coordinatedSystems: gradientSystems,
      colorDependentGradientSystems,
      communicationActive: this.crossFacadeEventListeners.size > 0,
    };
  }

  // ============================================================================
  // Color System Coordination Methods
  // ============================================================================

  /**
   * Register a system as color-dependent for targeted updates
   */
  public registerColorDependentSystem(
    systemKey: string,
    refreshCallback?: (trigger: string) => Promise<void>
  ): void {
    this.colorDependentSystems.add(systemKey);
    if (refreshCallback) {
      this.colorSystemRefreshCallbacks.set(systemKey, refreshCallback);
    }
    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      `Registered color-dependent system: ${systemKey}`
    );
  }

  /**
   * Unregister a color-dependent system
   */
  public unregisterColorDependentSystem(systemKey: string): void {
    this.colorDependentSystems.delete(systemKey);
    this.colorSystemRefreshCallbacks.delete(systemKey);
    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      `Unregistered color-dependent system: ${systemKey}`
    );
  }

  /**
   * Get list of color-dependent systems
   */
  public getColorDependentSystems(): string[] {
    return Array.from(this.colorDependentSystems);
  }

  /**
   * Refresh only color-dependent systems efficiently
   */
  public async refreshColorDependentSystems(trigger: string): Promise<void> {
    if (this.colorDependentSystems.size === 0) {
      Y3KDebug?.debug?.log(
        "SystemIntegrationCoordinator",
        "No color-dependent systems to refresh"
      );
      return;
    }

    const startTime = performance.now();
    const refreshPromises: Promise<void>[] = [];
    let successCount = 0;
    let failureCount = 0;

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      `Refreshing ${this.colorDependentSystems.size} color-dependent systems for trigger: ${trigger}`
    );

    for (const systemKey of this.colorDependentSystems) {
      const refreshCallback = this.colorSystemRefreshCallbacks.get(systemKey);

      if (refreshCallback) {
        // Use registered callback
        refreshPromises.push(
          refreshCallback(trigger)
            .then(() => {
              successCount++;
              Y3KDebug?.debug?.log(
                "SystemIntegrationCoordinator",
                `Successfully refreshed color system: ${systemKey}`
              );
            })
            .catch((error) => {
              failureCount++;
              Y3KDebug?.debug?.warn(
                "SystemIntegrationCoordinator",
                `Failed to refresh color system ${systemKey}:`,
                error
              );
            })
        );
      } else {
        // Try to get system and call refreshColorState if available
        refreshPromises.push(
          this.getSystemAndRefresh(systemKey, trigger)
            .then(() => {
              successCount++;
            })
            .catch((error) => {
              failureCount++;
              Y3KDebug?.debug?.warn(
                "SystemIntegrationCoordinator",
                `Failed to refresh color system ${systemKey}:`,
                error
              );
            })
        );
      }
    }

    await Promise.all(refreshPromises);

    const endTime = performance.now();
    const duration = endTime - startTime;

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      `Color system refresh completed`,
      {
        trigger,
        duration: `${duration.toFixed(2)}ms`,
        success: successCount,
        failures: failureCount,
        totalSystems: this.colorDependentSystems.size,
      }
    );

    // Emit refresh completion event
    this.emitEvent("color-systems-refreshed", {
      trigger,
      duration,
      successCount,
      failureCount,
      totalSystems: this.colorDependentSystems.size,
      timestamp: Date.now(),
    });
  }

  /**
   * Helper method to get system and call refresh method
   */
  private async getSystemAndRefresh(
    systemKey: string,
    trigger: string
  ): Promise<void> {
    // Try visual systems first
    if (this.visualSystemCoordinator) {
      try {
        // 🔧 PHASE 2.2: Use async getVisualSystem with await
        const system = await this.visualSystemCoordinator.getVisualSystem(systemKey as any);
        if (system && typeof (system as any).refreshColorState === "function") {
          await (system as any).refreshColorState(trigger);
          return;
        }
      } catch (error) {
        // Not a visual system or doesn't have refresh method
      }
    }

    // Try non-visual systems
    if (this.infrastructureSystemFacade) {
      try {
        const system = await this.infrastructureSystemFacade.getSystem(systemKey as any);
        if (system && typeof system.refreshColorState === "function") {
          await system.refreshColorState(trigger);
          return;
        }
      } catch (error) {
        // Not a non-visual system or doesn't have refresh method
      }
    }

    // System not found or doesn't support color refresh
    Y3KDebug?.debug?.warn(
      "SystemIntegrationCoordinator",
      `System ${systemKey} not found or doesn't support color refresh`
    );
  }

  /**
   * Auto-register common color-dependent systems
   */
  private setupDefaultColorDependentSystems(): void {
    // Register common visual systems that depend on colors
    const defaultColorSystems = [
      "CinematicDrama",
      "EtherealBeauty",  
      "NaturalHarmony",
      "FluidGradientBackgroundSystem",
      "WebGLGradientBackgroundSystem",
      "IridescentShimmerEffectsSystem",
      "ColorHarmonyEngine",
      "GradientTransitionOrchestrator",
      "GradientConductor",
      "SpicetifyColorBridge",
      // UI Managers with system integration
      "Card3DManager",
      "GlassmorphismManager",
    ];

    for (const systemKey of defaultColorSystems) {
      this.registerColorDependentSystem(systemKey);
    }

    Y3KDebug?.debug?.log(
      "SystemIntegrationCoordinator",
      `Auto-registered ${defaultColorSystems.length} default color-dependent systems`
    );
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;

    Y3KDebug?.debug?.log("SystemIntegrationCoordinator", "System coordinator destroyed");
  }

  // Shared service getter methods for testing and integration
  public getSharedMusicSyncService(): MusicSyncService | undefined {
    return this.sharedMusicSyncService || undefined;
  }

  public getSharedColorHarmonyEngine(): ColorHarmonyEngine | undefined {
    return this.sharedColorHarmonyEngine || undefined;
  }

  public getSharedColorProcessor(): any | undefined {
    return this.sharedColorProcessor || undefined;
  }

  // NOTE: getSharedSettingsManager() removed - use typed settings directly: import { settings } from "@/config"

  public getSharedSpicetifyColorBridge(): SpicetifyColorBridge | undefined {
    return this.sharedSpicetifyColorBridge || undefined;
  }

  // Performance system getter methods (simplified naming)
  public getSharedSimplePerformanceCoordinator(): SimplePerformanceCoordinator | undefined {
    return this.performanceCoordinator || undefined;
  }

  public getSharedWebGLSystemsIntegration(): WebGLSystemsIntegration | undefined {
    return this.sharedWebGLSystemsIntegration || undefined;
  }

  public getSharedEnhancedDeviceTierDetector(): EnhancedDeviceTierDetector | undefined {
    return this.sharedEnhancedDeviceTierDetector || undefined;
  }

  // Device detection getter (for WebGL capabilities only)
  public getDeviceDetector(): DeviceCapabilityDetector | undefined {
    return this.deviceDetector || undefined;
  }

  /**
   * Get shared dependency by name
   * Single source of truth for all shared system instances
   * Phase 3.1: Simplified dependency resolution
   */
  public getSharedDependency<T = any>(key: string): T | null {
    switch (key) {
      case "performanceCoordinator":
      case "performanceAnalyzer":
      case "simplePerformanceCoordinator":
        return (this.performanceCoordinator as T) || null;

      case "cssVariableManager":
      case "cssVariableController":
      case "cssConsciousnessController":
        return (this.sharedCSSVariableWriter as T) || null;

      case "musicSyncService":
        return (this.sharedMusicSyncService as T) || null;

      case "colorHarmonyEngine":
        return (this.sharedColorHarmonyEngine as T) || null;

      case "deviceDetector":
      case "deviceCapabilityDetector":
        return (this.deviceDetector as T) || null;

      case "webglSystemsIntegration":
        return (this.sharedWebGLSystemsIntegration as T) || null;

      case "enhancedDeviceTierDetector":
        return (this.sharedEnhancedDeviceTierDetector as T) || null;

      case "spicetifyColorBridge":
        return (this.sharedSpicetifyColorBridge as T) || null;

      default:
        return null;
    }
  }
}
