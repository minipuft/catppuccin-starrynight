/**
 * SystemCoordinator - Phase 3 Integration Coordinator
 *
 * Coordinates interaction between VisualSystemFacade and NonVisualSystemFacade
 * to provide unified system management with shared dependencies and cross-facade communication.
 *
 * Key Features:
 * - Shared dependency management between facades
 * - Cross-facade event coordination
 * - Unified performance monitoring
 * - Coordinated health monitoring
 * - Resource optimization across facades
 * - Error coordination and recovery
 *
 * Architecture:
 * - Manages both visual and non-visual system facades
 * - Provides unified interface for year3000System
 * - Optimizes shared resources (PerformanceAnalyzer, UnifiedCSSConsciousnessController)
 * - Coordinates system lifecycle across facades
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import {
  NonVisualSystemFacade,
  NonVisualSystemKey,
} from "@/core/integration/NonVisualSystemFacade";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { UnifiedPerformanceCoordinator } from "@/core/performance/UnifiedPerformanceCoordinator";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import * as Utils from "@/utils/core/Year3000Utilities";
import { SemanticColorManager } from "@/utils/spicetify/SemanticColorManager";
import {
  VisualSystemFacade,
  VisualSystemKey,
} from "@/visual/integration/VisualSystemFacade";

export type SystemType = "visual" | "non-visual";
export type CoordinationMode =
  | "unified"
  | "independent"
  | "performance-optimized";

// New orchestration types for enhanced coordination
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

export interface OrchestrationConfig {
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
  orchestration: OrchestrationConfig;
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
    performanceAnalyzer: { ok: boolean; details: string };
    cssConsciousnessController: { ok: boolean; details: string };
    musicSyncService: { ok: boolean; details: string };
    semanticColorManager?: { ok: boolean; details: string };
  };
  recommendations: string[];
  timestamp: number;
}

export class SystemCoordinator {
  // Core configuration
  private config: Year3000Config;
  private utils: typeof Utils;
  private year3000System: any;

  // Facade instances
  private visualBridge: VisualSystemFacade | null = null;
  private nonVisualFacade: NonVisualSystemFacade | null = null;

  // Shared dependencies (centrally managed)
  private sharedUnifiedCSSConsciousnessController: UnifiedCSSConsciousnessController | null =
    null;
  private sharedUnifiedPerformanceCoordinator: UnifiedPerformanceCoordinator | null =
    null;
  private sharedPerformanceAnalyzer: PerformanceAnalyzer | null = null;
  private sharedMusicSyncService: MusicSyncService | null = null;
  private sharedSettingsManager: SettingsManager | null = null;
  private sharedColorHarmonyEngine: ColorHarmonyEngine | null = null;
  private sharedSemanticColorManager: SemanticColorManager | null = null;

  // State management
  private isInitialized = false;
  private coordinationConfig: FacadeCoordinationConfig;
  private currentMetrics: UnifiedSystemMetrics;
  private lastHealthCheck: FacadeHealthCheck | null = null;

  // Color system coordination
  private colorDependentSystems: Set<string> = new Set();
  private colorSystemRefreshCallbacks: Map<string, (trigger: string) => Promise<void>> = new Map();

  // Orchestration state
  private currentPhase: InitializationPhase = "core";
  private systemStates: Map<string, SystemState> = new Map();
  private phaseCompletionPromises: Map<InitializationPhase, Promise<void>> = new Map();
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
      orchestration: {
        enforceSequentialInitialization: true,
        dependencyValidation: true,
        enableInitializationGates: true,
        systemReadinessTimeout: 5000,
        phaseTransitionTimeout: 10000,
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

    // Initialize orchestration system dependencies and phases
    this.setupOrchestrationPhases();

    this.currentMetrics = this.createInitialMetrics();

    Y3K?.debug?.log("SystemCoordinator", "System coordinator initialized");
  }

  public async initialize(
    config?: Partial<FacadeCoordinationConfig>
  ): Promise<void> {
    if (this.isInitialized) {
      Y3K?.debug?.warn("SystemCoordinator", "Already initialized");
      return;
    }

    try {
      const startTime = performance.now();

      // Update configuration
      this.coordinationConfig = { ...this.coordinationConfig, ...config };

      if (this.coordinationConfig.orchestration.enforceSequentialInitialization) {
        Y3K?.debug?.log("SystemCoordinator", "Starting orchestrated initialization");
        await this.executeOrchestredInitialization();
      } else {
        Y3K?.debug?.log("SystemCoordinator", "Starting legacy initialization");
        await this.executeLegacyInitialization();
      }

      const endTime = performance.now();
      this.currentMetrics.totalInitTime = endTime - startTime;

      this.isInitialized = true;

      Y3K?.debug?.log(
        "SystemCoordinator",
        "System coordination fully initialized",
        {
          mode: this.coordinationConfig.mode,
          orchestrationEnabled: this.coordinationConfig.orchestration.enforceSequentialInitialization,
          currentPhase: this.currentPhase,
          visualSystems: this.currentMetrics.visualSystems,
          nonVisualSystems: this.currentMetrics.nonVisualSystems,
          initTime: this.currentMetrics.totalInitTime,
        }
      );
    } catch (error) {
      Y3K?.debug?.error("SystemCoordinator", "Initialization failed:", error);
      await this.cleanup();
      throw error;
    }
  }

  private async initializeSharedDependencies(): Promise<void> {
    if (!this.coordinationConfig.enableSharedDependencies) return;

    Y3K?.debug?.log("SystemCoordinator", "Initializing shared dependencies");

    // Initialize shared dependencies in correct order
    try {
      // Core performance systems
      this.sharedPerformanceAnalyzer = new PerformanceAnalyzer();
      // PerformanceAnalyzer doesn't have initialize method

      // Initialize UnifiedPerformanceCoordinator
      this.sharedUnifiedPerformanceCoordinator =
        new UnifiedPerformanceCoordinator(
          this.config,
          this.sharedPerformanceAnalyzer
        );

      // Initialize shared CSS consciousness controller with required dependencies
      try {
        this.sharedUnifiedCSSConsciousnessController =
          UnifiedCSSConsciousnessController.getInstance(
            this.config,
            this.sharedUnifiedPerformanceCoordinator
          );
        if (this.sharedUnifiedCSSConsciousnessController) {
          await this.sharedUnifiedCSSConsciousnessController.initialize();
        }
      } catch (error) {
        Y3K?.debug?.warn(
          "SystemCoordinator",
          "Failed to initialize UnifiedCSSConsciousnessController:",
          error
        );
        this.sharedUnifiedCSSConsciousnessController = null;
      }

      // Core services
      this.sharedSettingsManager = new SettingsManager();
      await this.sharedSettingsManager.initialize();

      this.sharedMusicSyncService = new MusicSyncService();
      await this.sharedMusicSyncService.initialize();

      // Color harmony engine (depends on music sync)
      this.sharedColorHarmonyEngine = new ColorHarmonyEngine();
      // ColorHarmonyEngine doesn't have setMusicSyncService method
      await this.sharedColorHarmonyEngine.initialize();

      Y3K?.debug?.log(
        "SystemCoordinator",
        "Shared dependencies initialized successfully"
      );
    } catch (error) {
      Y3K?.debug?.error(
        "SystemCoordinator",
        "Failed to initialize shared dependencies:",
        error
      );
      throw error;
    }
  }

  private async initializeFacades(): Promise<void> {
    Y3K?.debug?.log("SystemCoordinator", "Initializing facades");

    try {
      // Initialize Visual System Facade
      this.visualBridge = new VisualSystemFacade(
        this.config,
        this.utils,
        this.year3000System,
        this.sharedUnifiedCSSConsciousnessController!,
        this.sharedPerformanceAnalyzer!,
        this.sharedMusicSyncService!,
        this.sharedSettingsManager!,
        this.sharedColorHarmonyEngine!,
        this.eventBus
      );

      await this.visualBridge.initialize({
        mode:
          this.coordinationConfig.mode === "performance-optimized"
            ? "performance-first"
            : "progressive",
        enablePerformanceMonitoring:
          this.coordinationConfig.enableUnifiedPerformanceMonitoring,
        enableEventCoordination:
          this.coordinationConfig.enableCrossFacadeCommunication,
      });

      // Set up visual bridge callbacks
      this.visualBridge.setOnSystemCreated((key, system) => {
        this.handleSystemCreated("visual", key, system);
      });

      // Initialize Non-Visual System Facade
      this.nonVisualFacade = new NonVisualSystemFacade(
        this.config,
        this.utils,
        this.year3000System
      );

      await this.nonVisualFacade.initialize({
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
      this.nonVisualFacade.setOnSystemCreated((key, system) => {
        this.handleSystemCreated("non-visual", key, system);
      });

      // Inject shared dependencies into non-visual facade
      this.injectSharedDependencies();

      Y3K?.debug?.log("SystemCoordinator", "Facades initialized successfully");
    } catch (error) {
      Y3K?.debug?.error(
        "SystemCoordinator",
        "Failed to initialize facades:",
        error
      );
      throw error;
    }
  }

  private injectSharedDependencies(): void {
    if (
      !this.coordinationConfig.enableSharedDependencies ||
      !this.nonVisualFacade
    )
      return;

    // Inject shared dependencies into non-visual facade
    // This ensures both facades use the same instances
    if (this.sharedPerformanceAnalyzer) {
      (this.nonVisualFacade as any).performanceAnalyzer =
        this.sharedPerformanceAnalyzer;
    }

    if (this.sharedUnifiedCSSConsciousnessController) {
      (this.nonVisualFacade as any).cssConsciousnessController =
        this.sharedUnifiedCSSConsciousnessController;
    }

    if (this.sharedMusicSyncService) {
      (this.nonVisualFacade as any).musicSyncService =
        this.sharedMusicSyncService;
    }

    if (this.sharedSettingsManager) {
      (this.nonVisualFacade as any).settingsManager =
        this.sharedSettingsManager;
    }

    if (this.sharedColorHarmonyEngine) {
      (this.nonVisualFacade as any).colorHarmonyEngine =
        this.sharedColorHarmonyEngine;
    }
    
    if (this.sharedSemanticColorManager) {
      (this.nonVisualFacade as any).semanticColorManager =
        this.sharedSemanticColorManager;
    }
  }

  private setupCrossFacadeCommunication(): void {
    if (!this.coordinationConfig.enableCrossFacadeCommunication) return;

    Y3K?.debug?.log(
      "SystemCoordinator",
      "Setting up cross-facade communication"
    );

    // Set up event propagation between facades
    this.addEventListener("visual-event", (event: any) => {
      if (this.visualBridge) {
        this.visualBridge.propagateVisualEvent(event);
      }
    });

    this.addEventListener("performance-event", (event: any) => {
      // Propagate performance events to both facades
      if (this.visualBridge) {
        this.visualBridge.handleAdaptationEvent(event);
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

  private handleSystemCreated(
    type: SystemType,
    key: string,
    system: any
  ): void {
    // Update metrics
    if (type === "visual") {
      this.currentMetrics.visualSystems++;
    } else {
      this.currentMetrics.nonVisualSystems++;
    }
    this.currentMetrics.activeSystems++;

    // Emit system created event
    if (this.onSystemCreated) {
      this.onSystemCreated(type, key, system);
    }

    Y3K?.debug?.log("SystemCoordinator", `System created: ${type}/${key}`);
  }

  private handleHealthDegradation(event: any): void {
    Y3K?.debug?.warn(
      "SystemCoordinator",
      "Health degradation detected:",
      event
    );

    // Implement health degradation response
    // This could involve reducing system quality, disabling non-essential systems, etc.

    if (this.coordinationConfig.mode === "performance-optimized") {
      // Aggressive performance optimization
      this.optimizeForPerformance();
    }
  }

  private optimizeForPerformance(): void {
    // Implement performance optimization strategies
    if (this.visualBridge) {
      this.visualBridge.setConfiguration({
        mode: "performance-first",
        enableAdaptiveQuality: true,
        qualityPreferences: {
          preferHighQuality: false,
          allowDynamicScaling: true,
          batteryConservation: true,
        },
      });
    }

    if (this.nonVisualFacade) {
      this.nonVisualFacade.setConfiguration({
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
  public getVisualSystem<T = any>(key: VisualSystemKey): T | null {
    if (!this.visualBridge) return null;
    return this.visualBridge.getVisualSystem<T>(key);
  }

  public getCachedNonVisualSystem<T = any>(key: NonVisualSystemKey): T | null {
    if (!this.nonVisualFacade) return null;
    return this.nonVisualFacade.getCachedSystem<T>(key);
  }

  public async getNonVisualSystem<T = any>(
    key: NonVisualSystemKey
  ): Promise<T | null> {
    if (!this.nonVisualFacade) return null;
    return await this.nonVisualFacade.getSystem<T>(key);
  }

  public async getSystem<T = any>(
    key: VisualSystemKey | NonVisualSystemKey
  ): Promise<T | null> {
    // Try visual systems first
    if (this.visualBridge) {
      try {
        return this.visualBridge.getVisualSystem<T>(key as VisualSystemKey);
      } catch (error) {
        // Not a visual system, try non-visual
      }
    }

    // Try non-visual systems
    if (this.nonVisualFacade) {
      try {
        return await this.nonVisualFacade.getSystem<T>(
          key as NonVisualSystemKey
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
          Y3K?.debug?.error(
            "SystemCoordinator",
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
        performanceAnalyzer: {
          ok: true,
          details: "Performance analyzer operational",
        },
        cssConsciousnessController: {
          ok: true,
          details: "CSS variable batcher operational",
        },
        musicSyncService: {
          ok: true,
          details: "Music sync service operational",
        },
      },
      recommendations: [],
      timestamp: performance.now(),
    };

    // Check visual facade
    if (this.visualBridge) {
      try {
        const visualHealth = await this.visualBridge.performVisualHealthCheck();
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
    if (this.nonVisualFacade) {
      try {
        const nonVisualHealth = await this.nonVisualFacade.performHealthCheck();
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
    if (this.sharedPerformanceAnalyzer) {
      try {
        // PerformanceAnalyzer doesn't have healthCheck method
        healthCheck.sharedResources.performanceAnalyzer.ok = true;
        healthCheck.sharedResources.performanceAnalyzer.details =
          "Performance analyzer operational";
      } catch (error) {
        healthCheck.sharedResources.performanceAnalyzer.ok = false;
        healthCheck.sharedResources.performanceAnalyzer.details = `Performance analyzer error: ${error}`;
      }
    }

    // Check shared CSS consciousness controller
    if (this.sharedUnifiedCSSConsciousnessController) {
      try {
        const cssHealth = await this.sharedUnifiedCSSConsciousnessController.healthCheck();
        healthCheck.sharedResources.cssConsciousnessController.ok = cssHealth.healthy || cssHealth.ok || false;
        healthCheck.sharedResources.cssConsciousnessController.details = cssHealth.details || "CSS consciousness controller operational";
      } catch (error) {
        healthCheck.sharedResources.cssConsciousnessController.ok = false;
        healthCheck.sharedResources.cssConsciousnessController.details = `CSS consciousness controller error: ${error}`;
      }
    }

    // Check shared music sync service
    if (this.sharedMusicSyncService) {
      try {
        const musicHealth = await this.sharedMusicSyncService.healthCheck();
        healthCheck.sharedResources.musicSyncService.ok = musicHealth.status === 'healthy';
        healthCheck.sharedResources.musicSyncService.details = musicHealth.message || "Music sync service operational";
      } catch (error) {
        healthCheck.sharedResources.musicSyncService.ok = false;
        healthCheck.sharedResources.musicSyncService.details = `Music sync service error: ${error}`;
      }
    }
    
    // Check SemanticColorManager
    if (this.sharedSemanticColorManager) {
      try {
        const semanticColorHealth = await this.sharedSemanticColorManager.healthCheck();
        const semanticColorOk = semanticColorHealth.healthy;
        
        // Add SemanticColorManager to shared resources check
        healthCheck.sharedResources.semanticColorManager = {
          ok: semanticColorOk,
          details: semanticColorHealth.details || "Semantic color manager operational"
        };
      } catch (error) {
        healthCheck.sharedResources.semanticColorManager = {
          ok: false,
          details: `Semantic color manager error: ${error}`
        };
      }
    }

    // Determine overall health
    const facadeHealthy =
      healthCheck.facades.visual.ok && healthCheck.facades.nonVisual.ok;
    const resourcesHealthy =
      healthCheck.sharedResources.performanceAnalyzer.ok &&
      healthCheck.sharedResources.cssConsciousnessController.ok &&
      healthCheck.sharedResources.musicSyncService.ok &&
      (healthCheck.sharedResources.semanticColorManager?.ok !== false);

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
    if (this.visualBridge) {
      const visualMetrics = this.visualBridge.getMetrics();
      this.currentMetrics.visualHealth = visualMetrics.systemHealth;
    }

    if (this.nonVisualFacade) {
      const nonVisualMetrics = this.nonVisualFacade.getMetrics();
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

  private setupOrchestrationPhases(): void {
    // Define system dependencies for proper orchestration
    this.systemDependencies.set("MusicSyncService", []);
    this.systemDependencies.set("ColorHarmonyEngine", ["MusicSyncService", "SemanticColorManager"]);
    this.systemDependencies.set("PerformanceAnalyzer", []);
    this.systemDependencies.set("UnifiedCSSConsciousnessController", ["PerformanceAnalyzer"]);
    this.systemDependencies.set("SettingsManager", []);
    this.systemDependencies.set("SemanticColorManager", ["UnifiedCSSConsciousnessController"]);
    
    
    // Define initialization order by phase
    this.initializationOrder.set("core", [
      "PerformanceAnalyzer",
      "UnifiedCSSConsciousnessController",
    ]);
    this.initializationOrder.set("services", [
      "SettingsManager",
      "MusicSyncService",
      "SemanticColorManager",
    ]);
    this.initializationOrder.set("visual-systems", [
      "ColorHarmonyEngine",
    ]);
    this.initializationOrder.set("integration", [
      "VisualSystemFacade",
      "NonVisualSystemFacade",
    ]);
    
    // Initialize all systems as uninitialized
    for (const [phase, systems] of this.initializationOrder.entries()) {
      for (const system of systems) {
        this.systemStates.set(system, "uninitialized");
      }
    }

    Y3K?.debug?.log("SystemCoordinator", "Orchestration phases configured", {
      phases: Array.from(this.initializationOrder.keys()),
      totalSystems: this.systemStates.size,
      dependencies: Object.fromEntries(this.systemDependencies)
    });
  }

  private async executeOrchestredInitialization(): Promise<void> {
    const phases: InitializationPhase[] = ["core", "services", "visual-systems", "integration"];
    
    for (const phase of phases) {
      Y3K?.debug?.log("SystemCoordinator", `Starting phase: ${phase}`);
      this.currentPhase = phase;
      
      try {
        await this.executePhase(phase);
        Y3K?.debug?.log("SystemCoordinator", `Phase ${phase} completed successfully`);
      } catch (error) {
        Y3K?.debug?.error("SystemCoordinator", `Phase ${phase} failed:`, error);
        throw new Error(`Orchestration failed at phase ${phase}: ${error}`);
      }
    }
    
    this.currentPhase = "completed";
    
    // Set up cross-facade communication
    this.setupCrossFacadeCommunication();
    
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
        throw new Error(`System ${systemName} not ready after phase ${phase} (state: ${state})`);
      }
    }
  }

  private async initializeSystemWithDependencies(systemName: string): Promise<void> {
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
        case "UnifiedCSSConsciousnessController": 
          await this.initializeUnifiedCSSController();
          break;
        case "SettingsManager":
          await this.initializeSettingsManager();
          break;
        case "MusicSyncService":
          await this.initializeMusicSyncService();
          break;
        case "ColorHarmonyEngine":
          await this.initializeColorHarmonyEngine();
          break;
        case "SemanticColorManager":
          await this.initializeSemanticColorManager();
          break;
        case "VisualSystemFacade":
          await this.initializeVisualFacade();
          break;
        case "NonVisualSystemFacade":
          await this.initializeNonVisualFacade();
          break;
        default:
          throw new Error(`Unknown system: ${systemName}`);
      }

      this.systemStates.set(systemName, "ready");
      Y3K?.debug?.log("SystemCoordinator", `System ${systemName} initialized successfully`);

    } catch (error) {
      this.systemStates.set(systemName, "failed");
      Y3K?.debug?.error("SystemCoordinator", `System ${systemName} initialization failed:`, error);
      throw error;
    }
  }

  private async waitForSystemReady(systemName: string): Promise<void> {
    const timeout = this.coordinationConfig.orchestration.systemReadinessTimeout;
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
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    throw new Error(`Timeout waiting for dependency ${systemName} to be ready`);
  }

  // Individual system initialization methods
  private async initializePerformanceAnalyzer(): Promise<void> {
    this.sharedPerformanceAnalyzer = new PerformanceAnalyzer();
    // PerformanceAnalyzer doesn't require async initialization
  }

  private async initializeUnifiedCSSController(): Promise<void> {
    if (!this.sharedPerformanceAnalyzer) {
      throw new Error("PerformanceAnalyzer dependency not available");
    }

    try {
      this.sharedUnifiedPerformanceCoordinator = new UnifiedPerformanceCoordinator(
        this.config,
        this.sharedPerformanceAnalyzer
      );

      this.sharedUnifiedCSSConsciousnessController = UnifiedCSSConsciousnessController.getInstance(
        this.config,
        this.sharedUnifiedPerformanceCoordinator
      );
      
      if (this.sharedUnifiedCSSConsciousnessController) {
        await this.sharedUnifiedCSSConsciousnessController.initialize();
      }
    } catch (error) {
      Y3K?.debug?.warn("SystemCoordinator", "Failed to initialize UnifiedCSSController:", error);
      this.sharedUnifiedCSSConsciousnessController = null;
    }
  }

  private async initializeSettingsManager(): Promise<void> {
    this.sharedSettingsManager = new SettingsManager();
    await this.sharedSettingsManager.initialize();
  }

  private async initializeMusicSyncService(): Promise<void> {
    this.sharedMusicSyncService = new MusicSyncService({
      YEAR3000_CONFIG: this.config,
      Year3000Utilities: this.utils,
      performanceMonitor: this.sharedPerformanceAnalyzer,
      settingsManager: this.sharedSettingsManager,
      year3000System: this.year3000System
    });
    await this.sharedMusicSyncService.initialize();
  }

  private async initializeSemanticColorManager(): Promise<void> {
    if (!this.sharedUnifiedCSSConsciousnessController) {
      throw new Error("UnifiedCSSConsciousnessController dependency not available");
    }

    this.sharedSemanticColorManager = new SemanticColorManager({
      enableDebug: this.config.enableDebug || false,
      fallbackToSpiceColors: true,
      cacheDuration: 5000
    });
    
    await this.sharedSemanticColorManager.initialize(this.sharedUnifiedCSSConsciousnessController);
    
    Y3K?.debug?.log("SystemCoordinator", "SemanticColorManager initialized successfully", {
      systemMetrics: this.sharedSemanticColorManager.getSystemMetrics()
    });
  }
  
  private async initializeColorHarmonyEngine(): Promise<void> {
    if (!this.sharedMusicSyncService) {
      throw new Error("MusicSyncService dependency not available");
    }
    
    if (!this.sharedSemanticColorManager) {
      throw new Error("SemanticColorManager dependency not available");
    }

    this.sharedColorHarmonyEngine = new ColorHarmonyEngine(
      this.config,
      this.utils,
      this.sharedPerformanceAnalyzer || undefined,
      this.sharedSettingsManager || undefined
    );
    
    // Note: SemanticColorManager integration will be handled through dependency injection
    // in ColorHarmonyEngine's constructor or through the Year3000System bridge
    
    await this.sharedColorHarmonyEngine.initialize();
  }

  private async initializeVisualFacade(): Promise<void> {
    this.visualBridge = new VisualSystemFacade(
      this.config,
      this.utils,
      this, // year3000System
      this.sharedUnifiedCSSConsciousnessController!, // cssConsciousnessController
      this.sharedPerformanceAnalyzer!,
      this.sharedMusicSyncService!,
      this.sharedSettingsManager!,
      this.sharedColorHarmonyEngine || undefined, // optional
      this.eventBus // optional
    );
    
    // Note: SemanticColorManager can be accessed through SystemCoordinator shared dependencies
    // Visual systems that need it can get it via getSharedSemanticColorManager()
    
    await this.visualBridge.initialize();
  }

  private async initializeNonVisualFacade(): Promise<void> {
    this.nonVisualFacade = new NonVisualSystemFacade(
      this.config,
      this.utils,
      {
        performanceAnalyzer: this.sharedPerformanceAnalyzer,
        unifiedCSSConsciousnessController: this.sharedUnifiedCSSConsciousnessController,
        musicSyncService: this.sharedMusicSyncService,
        settingsManager: this.sharedSettingsManager,
        colorHarmonyEngine: this.sharedColorHarmonyEngine,
        unifiedPerformanceCoordinator: this.sharedUnifiedPerformanceCoordinator,
        semanticColorManager: this.sharedSemanticColorManager,
      }
    );
    await this.nonVisualFacade.initialize();
  }


  private async executeLegacyInitialization(): Promise<void> {
    // Original initialization logic for backward compatibility
    await this.initializeSharedDependencies();
    await this.initializeFacades();
    this.setupCrossFacadeCommunication();
    await this.setupGradientSystemCoordination();
    this.setupDefaultColorDependentSystems();
    this.startMonitoring();
    await this.performHealthCheck();
  }

  // Public orchestration API
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
    return this.coordinationConfig.orchestration.enforceSequentialInitialization;
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
    if (this.visualBridge) {
      await this.visualBridge.destroy();
      this.visualBridge = null;
    }

    if (this.nonVisualFacade) {
      await this.nonVisualFacade.destroy();
      this.nonVisualFacade = null;
    }

    // Cleanup shared dependencies
    if (this.sharedSemanticColorManager) {
      this.sharedSemanticColorManager.destroy();
      this.sharedSemanticColorManager = null;
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
    
    if (this.sharedSettingsManager) {
      // SettingsManager has destroy method
      this.sharedSettingsManager.destroy();
      this.sharedSettingsManager = null;
    }

    if (this.sharedPerformanceAnalyzer) {
      // PerformanceAnalyzer has destroy method
      this.sharedPerformanceAnalyzer.destroy();
      this.sharedPerformanceAnalyzer = null;
    }

    if (this.sharedUnifiedCSSConsciousnessController) {
      // UnifiedCSSConsciousnessController has destroy method
      this.sharedUnifiedCSSConsciousnessController.destroy();
      this.sharedUnifiedCSSConsciousnessController = null;
    }

    if (this.sharedUnifiedPerformanceCoordinator) {
      // UnifiedPerformanceCoordinator has destroy method
      this.sharedUnifiedPerformanceCoordinator.destroy();
      this.sharedUnifiedPerformanceCoordinator = null;
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
      visualSystems: this.visualBridge?.getSystemStatus().systemsActive || 0,
      nonVisualSystems:
        this.nonVisualFacade?.getSystemStatus().systemsActive || 0,
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
    if (!this.visualBridge) {
      Y3K?.debug?.warn("SystemCoordinator", "VisualSystemFacade not available - skipping gradient system coordination");
      return;
    }

    Y3K?.debug?.log("SystemCoordinator", "Setting up gradient system coordination");

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

      const coordinationDuration = performance.now() - gradientCoordinationStartTime;
      
      Y3K?.debug?.log("SystemCoordinator", "Gradient system coordination completed", {
        coordinatedSystems,
        duration: `${coordinationDuration.toFixed(2)}ms`,
        systems: ['GradientConductor', 'WebGLGradientBackgroundSystem', 'GradientTransitionOrchestrator']
      });

    } catch (error) {
      Y3K?.debug?.error("SystemCoordinator", "Failed to setup gradient system coordination:", error);
      throw error;
    }
  }

  /**
   * Coordinate GradientConductor system through VisualSystemFacade
   */
  private async coordinateGradientConductor(): Promise<void> {
    try {
      // Get GradientConductor through VisualSystemFacade factory pattern
      const gradientConductor = this.visualBridge!.getVisualSystem('GradientConductor');
      
      if (!gradientConductor) {
        Y3K?.debug?.warn("SystemCoordinator", "GradientConductor not available via VisualSystemFacade");
        return;
      }

      // Register with SystemCoordinator for cross-system communication
      this.addEventListener('gradient-conductor-event', (event: any) => {
        if (gradientConductor && typeof gradientConductor.handleSystemEvent === 'function') {
          gradientConductor.handleSystemEvent(event);
        }
      });

      // Register color refresh callback
      this.registerColorDependentSystem('GradientConductor', async (trigger: string) => {
        if (gradientConductor && typeof gradientConductor.refreshColorState === 'function') {
          await gradientConductor.refreshColorState(trigger);
        } else if (gradientConductor && typeof gradientConductor.setPalette === 'function') {
          // Fallback to setPalette if refreshColorState not available
          const colorHarmonyEngine = this.sharedColorHarmonyEngine;
          if (colorHarmonyEngine) {
            try {
              const currentGradient = await colorHarmonyEngine.getCurrentGradient();
              if (currentGradient) {
                gradientConductor.setPalette(currentGradient);
              }
            } catch (error) {
              Y3K?.debug?.warn("SystemCoordinator", "Failed to refresh GradientConductor colors:", error);
            }
          }
        }
      });

      Y3K?.debug?.log("SystemCoordinator", "GradientConductor coordination established");
    } catch (error) {
      Y3K?.debug?.error("SystemCoordinator", "Failed to coordinate GradientConductor:", error);
    }
  }

  /**
   * Coordinate WebGL gradient background system
   */
  private async coordinateWebGLGradientSystem(): Promise<void> {
    try {
      // Get WebGL system through VisualSystemFacade
      const webglSystem = this.visualBridge!.getVisualSystem('WebGLBackground');
      
      if (!webglSystem) {
        Y3K?.debug?.warn("SystemCoordinator", "WebGLGradientBackgroundSystem not available via VisualSystemFacade");
        return;
      }

      // Register cross-system event handling
      this.addEventListener('webgl-gradient-event', (event: any) => {
        if (webglSystem && typeof webglSystem.handleSystemEvent === 'function') {
          webglSystem.handleSystemEvent(event);
        }
      });

      // Register color refresh callback
      this.registerColorDependentSystem('WebGLGradientBackgroundSystem', async (trigger: string) => {
        if (webglSystem && typeof webglSystem.refreshColorState === 'function') {
          await webglSystem.refreshColorState(trigger);
        } else if (webglSystem && typeof webglSystem.updateGradientTexture === 'function') {
          // Fallback to updateGradientTexture if refreshColorState not available
          await webglSystem.updateGradientTexture();
        }
      });

      Y3K?.debug?.log("SystemCoordinator", "WebGLGradientBackgroundSystem coordination established");
    } catch (error) {
      Y3K?.debug?.error("SystemCoordinator", "Failed to coordinate WebGLGradientBackgroundSystem:", error);
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
      this.registerColorDependentSystem('GradientTransitionOrchestrator');
      
      Y3K?.debug?.log("SystemCoordinator", "GradientTransitionOrchestrator registered for color updates");
    } catch (error) {
      Y3K?.debug?.warn("SystemCoordinator", "Failed to register GradientTransitionOrchestrator:", error);
    }
  }

  /**
   * Setup communication between gradient systems
   */
  private setupGradientSystemCommunication(): void {
    // Listen for color harmony updates and propagate to gradient systems
    this.addEventListener('color-harmony-updated', async (event: any) => {
      try {
        // Refresh all gradient systems when colors change
        await this.refreshColorDependentSystems('color-harmony-update');
        
        // Emit gradient coordination event
        this.emitEvent('gradient-systems-updated', {
          trigger: 'color-harmony-update',
          timestamp: Date.now(),
          systems: ['GradientConductor', 'WebGLGradientBackgroundSystem', 'GradientTransitionOrchestrator']
        });
      } catch (error) {
        Y3K?.debug?.error("SystemCoordinator", "Failed to propagate color harmony update to gradient systems:", error);
      }
    });

    // Listen for performance changes and coordinate gradient quality scaling
    this.addEventListener('performance-event', (event: any) => {
      try {
        // Propagate performance events to gradient systems for quality scaling
        this.emitEvent('gradient-performance-event', {
          ...event,
          timestamp: Date.now()
        });
      } catch (error) {
        Y3K?.debug?.error("SystemCoordinator", "Failed to propagate performance event to gradient systems:", error);
      }
    });

    Y3K?.debug?.log("SystemCoordinator", "Gradient system communication established");
  }

  /**
   * Get gradient system coordination status
   */
  public getGradientSystemStatus(): {
    coordinatedSystems: string[];
    colorDependentGradientSystems: string[];
    communicationActive: boolean;
  } {
    const gradientSystems = ['GradientConductor', 'WebGLGradientBackgroundSystem', 'GradientTransitionOrchestrator'];
    const colorDependentGradientSystems = gradientSystems.filter(system => 
      this.colorDependentSystems.has(system)
    );

    return {
      coordinatedSystems: gradientSystems,
      colorDependentGradientSystems,
      communicationActive: this.crossFacadeEventListeners.size > 0
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
    Y3K?.debug?.log("SystemCoordinator", `Registered color-dependent system: ${systemKey}`);
  }

  /**
   * Unregister a color-dependent system
   */
  public unregisterColorDependentSystem(systemKey: string): void {
    this.colorDependentSystems.delete(systemKey);
    this.colorSystemRefreshCallbacks.delete(systemKey);
    Y3K?.debug?.log("SystemCoordinator", `Unregistered color-dependent system: ${systemKey}`);
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
      Y3K?.debug?.log("SystemCoordinator", "No color-dependent systems to refresh");
      return;
    }

    const startTime = performance.now();
    const refreshPromises: Promise<void>[] = [];
    let successCount = 0;
    let failureCount = 0;

    Y3K?.debug?.log("SystemCoordinator", `Refreshing ${this.colorDependentSystems.size} color-dependent systems for trigger: ${trigger}`);

    for (const systemKey of this.colorDependentSystems) {
      const refreshCallback = this.colorSystemRefreshCallbacks.get(systemKey);
      
      if (refreshCallback) {
        // Use registered callback
        refreshPromises.push(
          refreshCallback(trigger)
            .then(() => {
              successCount++;
              Y3K?.debug?.log("SystemCoordinator", `Successfully refreshed color system: ${systemKey}`);
            })
            .catch((error) => {
              failureCount++;
              Y3K?.debug?.warn("SystemCoordinator", `Failed to refresh color system ${systemKey}:`, error);
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
              Y3K?.debug?.warn("SystemCoordinator", `Failed to refresh color system ${systemKey}:`, error);
            })
        );
      }
    }

    await Promise.all(refreshPromises);

    const endTime = performance.now();
    const duration = endTime - startTime;

    Y3K?.debug?.log("SystemCoordinator", `Color system refresh completed`, {
      trigger,
      duration: `${duration.toFixed(2)}ms`,
      success: successCount,
      failures: failureCount,
      totalSystems: this.colorDependentSystems.size
    });

    // Emit refresh completion event
    this.emitEvent('color-systems-refreshed', {
      trigger,
      duration,
      successCount,
      failureCount,
      totalSystems: this.colorDependentSystems.size,
      timestamp: Date.now()
    });
  }

  /**
   * Helper method to get system and call refresh method
   */
  private async getSystemAndRefresh(systemKey: string, trigger: string): Promise<void> {
    // Try visual systems first
    if (this.visualBridge) {
      try {
        const system = this.visualBridge.getVisualSystem(systemKey as any);
        if (system && typeof system.refreshColorState === 'function') {
          await system.refreshColorState(trigger);
          return;
        }
      } catch (error) {
        // Not a visual system or doesn't have refresh method
      }
    }

    // Try non-visual systems
    if (this.nonVisualFacade) {
      try {
        const system = await this.nonVisualFacade.getSystem(systemKey as any);
        if (system && typeof system.refreshColorState === 'function') {
          await system.refreshColorState(trigger);
          return;
        }
      } catch (error) {
        // Not a non-visual system or doesn't have refresh method
      }
    }

    // System not found or doesn't support color refresh
    Y3K?.debug?.warn("SystemCoordinator", `System ${systemKey} not found or doesn't support color refresh`);
  }

  /**
   * Auto-register common color-dependent systems
   */
  private setupDefaultColorDependentSystems(): void {
    // Register common visual systems that depend on colors
    const defaultColorSystems = [
      'CinematicDramaEngine',
      'EtherealBeautyEngine', 
      'NaturalHarmonyEngine',
      'FlowingLiquidConsciousnessSystem',
      'WebGLGradientBackgroundSystem',
      'IridescentShimmerEffectsSystem',
      'ColorHarmonyEngine',
      'GradientTransitionOrchestrator',
      'GradientConductor',
      'SemanticColorManager',
      // UI Managers with consciousness integration
      'Card3DManager',
      'GlassmorphismManager'
    ];

    for (const systemKey of defaultColorSystems) {
      this.registerColorDependentSystem(systemKey);
    }

    Y3K?.debug?.log("SystemCoordinator", `Auto-registered ${defaultColorSystems.length} default color-dependent systems`);
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;

    Y3K?.debug?.log("SystemCoordinator", "System coordinator destroyed");
  }

  // Shared service getter methods for testing and integration
  public getSharedMusicSyncService(): MusicSyncService | undefined {
    return this.sharedMusicSyncService || undefined;
  }

  public getSharedColorHarmonyEngine(): ColorHarmonyEngine | undefined {
    return this.sharedColorHarmonyEngine || undefined;
  }

  public getSharedPerformanceAnalyzer(): PerformanceAnalyzer | undefined {
    return this.sharedPerformanceAnalyzer || undefined;
  }

  public getSharedSettingsManager(): SettingsManager | undefined {
    return this.sharedSettingsManager || undefined;
  }
  
  public getSharedSemanticColorManager(): SemanticColorManager | undefined {
    return this.sharedSemanticColorManager || undefined;
  }
}
