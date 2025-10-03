/**
 * NonVisualSystemFacade - Infrastructure Systems Factory & Management Layer
 *
 * Layer 3 of the three-layer facade architecture - handles ALL infrastructure and non-visual systems.
 * Provides comprehensive factory methods, dependency injection, and lifecycle management
 * for core services that support the music-synchronized visual effects.
 *
 * ═══ LAYER 3 RESPONSIBILITIES ═══
 * 
 * INFRASTRUCTURE SYSTEM FACTORY:
 * • Creates and manages core systems (CSS variables, performance monitoring, settings)
 * • Provides dependency injection for infrastructure services
 * • Handles service lifecycle and configuration management
 *
 * PERFORMANCE & HEALTH MONITORING:
 * • Monitors infrastructure system health and performance metrics
 * • Provides systematic diagnostics for core service failures
 * • Manages performance budgets and resource optimization
 *
 * CONFIGURATION & SETTINGS:
 * • Manages user settings and theme configuration
 * • Provides color processing and harmony engine coordination
 * • Handles music sync service integration and audio analysis
 *
 * ═══ DIAGNOSTIC VALUE ═══
 * Infrastructure-specific troubleshooting capabilities:
 * - "Settings not saving" → Check SettingsManager health and storage adapters
 * - "Colors not updating" → Check CSS variable batching and injection systems
 * - "Performance issues" → Check performance monitoring and device detection
 * - "Music not syncing" → Check MusicSyncService and audio API integration
 *
 * Key Features:
 * - Factory pattern for all infrastructure systems with dependency injection
 * - Performance monitoring integration with health diagnostics
 * - System lifecycle management with error recovery
 * - Configuration management for theme settings and user preferences
 * - Resource optimization and performance budgeting
 * - Loose coupling through facade pattern for maintainability
 *
 * Integrates with:
 * - VisualSystemCoordinator (provides infrastructure for visual systems)
 * - Year3000System (main system coordinator)
 * - Performance monitoring systems (device detection, resource management)
 * - Settings and configuration systems (user preferences, theme config)
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/ThemeUtilities";

// Performance System imports
import { EnhancedMasterAnimationCoordinator } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { OptimizedCSSVariableManager } from "@/core/performance/OptimizedCSSVariableManager";
import { TimerConsolidationSystem } from "@/core/performance/TimerConsolidationSystem";
// PerformanceAwareLerpCoordinator consolidated into EnhancedMasterAnimationCoordinator

// New simplified performance system imports (replacing complex monitoring)
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { SimpleTierBasedPerformanceSystem } from "@/core/performance/SimpleTierBasedPerformanceSystem";
import { EnhancedDeviceTierDetector } from "@/core/performance/EnhancedDeviceTierDetector";
import { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";

// Legacy performance imports (deprecated, for backward compatibility)
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { PerformanceAnalyzer } from "@/core/performance/UnifiedPerformanceCoordinator";
import { PerformanceBudgetManager } from "@/core/performance/PerformanceBudgetManager";
// CSS systems consolidated into OptimizedCSSVariableManager:
// - OptimizedCSSVariableManager (batching layer)
// - OptimizedCSSVariableManager (management layer)
// - OptimizedCSSVariableManager (performance layer)

// Core Services imports
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import UnifiedDebugManager from "@/debug/UnifiedDebugManager";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { LoadingStateService } from "@/core/services/LoadingStateService";

// Consciousness Systems imports
import { VisualEffectsCoordinator } from "@/visual/effects/VisualEffectsCoordinator";
import { MusicEmotionAnalyzer } from "@/visual/music/integration/MusicEmotionAnalyzer";

// Color Strategy imports
import { UnifiedColorProcessingEngine, globalUnifiedColorProcessingEngine } from "@/core/color/UnifiedColorProcessingEngine";

// UI Managers imports
import { Card3DManager } from "@/ui/managers/Card3DManager";
import { GlassmorphismManager } from "@/ui/managers/GlassmorphismManager";
import { GenreUIBridge } from "@/visual/ui/GenreUIBridge";

// Integration Systems imports
import { SidebarSystemsIntegration } from "@/core/integration/SidebarSystemsIntegration";

// Strategy-based creation imports
import { globalFacadeAdapter } from "@/core/integration/FacadeAdapter";

// Interface imports
// import { IManagedSystem } from "@/types/systems"; // Unused for now

// Type definitions
export type NonVisualSystemKey =
  // Performance Systems
  | "EnhancedMasterAnimationCoordinator"
  | "TimerConsolidationSystem"
  | "OptimizedCSSVariableManager"
  | "UnifiedCSSVariableManager" // Alias for OptimizedCSSVariableManager
  // PerformanceAwareLerpCoordinator consolidated into EnhancedMasterAnimationCoordinator
  
  // New simplified performance systems (replacing complex monitoring)
  | "SimplePerformanceCoordinator"
  | "SimpleTierBasedPerformanceSystem"
  | "EnhancedDeviceTierDetector"
  | "WebGLSystemsIntegration"
  
  // Legacy performance systems (deprecated, for backward compatibility)
  | "UnifiedPerformanceCoordinator" // Backward compatibility alias for PerformanceAnalyzer
  | "PerformanceAnalyzer"
  | "DeviceCapabilityDetector"
  | "PerformanceBudgetManager"

  // Core Services
  | "UnifiedDebugManager"
  | "SettingsManager"
  | "ColorHarmonyEngine"
  | "MusicSyncService"
  | "ColorOrchestrator"
  | "UnifiedColorProcessingEngine"
  | "LoadingStateService"

  // Consciousness Systems
  | "MusicEmotionAnalyzer"
  | "VisualEffectsCoordinator"

  // UI Managers
  | "GlassmorphismManager"
  | "Card3DManager"
  | "GenreUIBridge"

  // Integration Systems
  | "SidebarSystemsIntegration"
  | "CSSVariableBatcher"
  | "SystemHealthMonitor"
  | "UnifiedSystemIntegration";

export type SystemHealth = "excellent" | "good" | "degraded" | "critical";
export type IntegrationMode =
  | "progressive"
  | "performance-first"
  | "quality-first"
  | "battery-optimized";

export interface NonVisualSystemConfig {
  mode: IntegrationMode;
  enablePerformanceMonitoring: boolean;
  enableDependencyInjection: boolean;
  enableSystemHealthMonitoring: boolean;
  performanceThresholds: {
    maxInitTime: number;
    maxMemoryMB: number;
    maxCPUPercent: number;
  };
  systemPreferences: {
    lazyInitialization: boolean;
    aggressiveCaching: boolean;
    performanceOptimization: boolean;
  };
}

export interface NonVisualSystemMetrics {
  // Performance metrics
  systemCount: number;
  initializedSystems: number;
  failedSystems: number;
  totalInitTime: number;
  averageInitTime: number;
  memoryUsageMB: number;

  // System state
  systemHealth: SystemHealth;
  activeSystems: string[];
  failedSystemsList: string[];

  // Feature status
  dependencyInjection: boolean;
  performanceMonitoring: boolean;
  healthMonitoring: boolean;

  // Performance state
  systemInitializationTime: number;
  dependencyResolutionTime: number;
  lastHealthCheckTime: number;
  systemErrors: number;
}

export interface NonVisualSystemHealthCheck {
  overall: SystemHealth;
  systems: Map<string, { ok: boolean; details: string }>;
  recommendations: string[];
  timestamp: number;
  metrics: NonVisualSystemMetrics;
}

export class NonVisualSystemFacade {
  // Core dependencies
  private config: AdvancedSystemConfig | Year3000Config;
  private utils: typeof Utils;
  private year3000System: any; // Reference to main system

  // Core shared dependencies (will be injected from main system)
  private cssVariableManager: OptimizedCSSVariableManager | null =
    null;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  private loadingStateService: LoadingStateService | null = null; // Phase 8.5: Active loading state management

  // New simplified performance system dependencies
  private simplePerformanceCoordinator: SimplePerformanceCoordinator | null = null;
  private webglSystemsIntegration: WebGLSystemsIntegration | null = null;
  private enhancedDeviceTierDetector: EnhancedDeviceTierDetector | null = null;
  
  // Legacy performance system dependencies (deprecated, for backward compatibility)
  private performanceAnalyzer: SimplePerformanceCoordinator | null = null;
  private performanceCoordinator: PerformanceAnalyzer | null = null;
  private performanceOrchestrator: SimplePerformanceCoordinator | null = null;
  // private colorHarmonyEngine: ColorHarmonyEngine | null = null; // Unused for now
  // private systemHealthMonitor: SystemHealthMonitor | null = null; // Unused for now

  // System registry and cache
  private systemRegistry: Map<NonVisualSystemKey, new (...args: any[]) => any>;
  private systemCache: Map<NonVisualSystemKey, any>;
  private systemDependencies: Map<NonVisualSystemKey, string[]>;

  // State management
  private isInitialized = false;
  private facadeConfig: NonVisualSystemConfig;
  private currentMetrics: NonVisualSystemMetrics;
  private lastHealthCheck: NonVisualSystemHealthCheck | null = null;

  // Monitoring intervals
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;

  // Event callbacks
  private onSystemCreated:
    | ((systemKey: NonVisualSystemKey, system: any) => void)
    | null = null;
  private onSystemFailed:
    | ((systemKey: NonVisualSystemKey, error: Error) => void)
    | null = null;
  private onHealthChange:
    | ((health: NonVisualSystemHealthCheck) => void)
    | null = null;

  // Strategy-based creation adapter
  private facadeAdapter = globalFacadeAdapter;

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    utils: typeof Utils,
    year3000System: any
  ) {
    this.config = config;
    this.utils = utils;
    this.year3000System = year3000System;

    // Check if shared dependencies are being injected via year3000System parameter
    if (year3000System && typeof year3000System === 'object' && 'performanceAnalyzer' in year3000System) {
      // Extract shared dependencies from SystemCoordinator
      this.performanceAnalyzer = year3000System.performanceAnalyzer || null;
      this.cssVariableManager = year3000System.unifiedCSSConsciousnessController || null;
      this.performanceCoordinator = year3000System.unifiedPerformanceCoordinator || null;
      this.performanceOrchestrator = year3000System.performanceOrchestrator || null;
      this.musicSyncService = year3000System.musicSyncService || null;
      this.settingsManager = year3000System.settingsManager || null;

      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Shared dependencies injected from SystemCoordinator",
        {
          performanceAnalyzer: !!this.performanceAnalyzer,
          cssVariableManager: !!this.cssVariableManager,
          performanceOrchestrator: !!this.performanceOrchestrator,
          musicSyncService: !!this.musicSyncService,
          settingsManager: !!this.settingsManager,
        }
      );
    }

    this.systemRegistry = new Map();
    this.systemCache = new Map();
    this.systemDependencies = new Map();

    // Initialize default configuration
    this.facadeConfig = {
      mode: "progressive",
      enablePerformanceMonitoring: true,
      enableDependencyInjection: true,
      enableSystemHealthMonitoring: true,
      performanceThresholds: {
        maxInitTime: 5000, // 5 seconds
        maxMemoryMB: 100,
        maxCPUPercent: 15,
      },
      systemPreferences: {
        lazyInitialization: true,
        aggressiveCaching: true,
        performanceOptimization: true,
      },
    };

    this.currentMetrics = this.createInitialMetrics();

    // Register all non-visual systems
    this.registerNonVisualSystems();

    Y3KDebug?.debug?.log(
      "NonVisualSystemFacade",
      "Non-visual systems facade initialized"
    );
  }

  private registerNonVisualSystems(): void {
    // Performance Systems
    this.systemRegistry.set(
      "EnhancedMasterAnimationCoordinator",
      EnhancedMasterAnimationCoordinator
    );
    this.systemDependencies.set("EnhancedMasterAnimationCoordinator", [
      "performanceAnalyzer",
      "cssVariableManager",
    ]);

    this.systemRegistry.set(
      "TimerConsolidationSystem",
      TimerConsolidationSystem
    );
    this.systemDependencies.set("TimerConsolidationSystem", [
      "performanceAnalyzer",
    ]);

    this.systemRegistry.set(
      "OptimizedCSSVariableManager",
      OptimizedCSSVariableManager
    );
    this.systemDependencies.set("OptimizedCSSVariableManager", [
      "performanceCoordinator",
    ]);

    // Alias registration for backwards compatibility
    this.systemRegistry.set(
      "UnifiedCSSVariableManager",
      OptimizedCSSVariableManager
    );
    this.systemDependencies.set("UnifiedCSSVariableManager", [
      "performanceCoordinator",
    ]);

    this.systemRegistry.set(
      "PerformanceAnalyzer",
      PerformanceAnalyzer
    );
    this.systemDependencies.set("PerformanceAnalyzer", []);

    this.systemRegistry.set(
      "DeviceCapabilityDetector",
      DeviceCapabilityDetector
    );
    this.systemDependencies.set("DeviceCapabilityDetector", []);

    // PerformanceAnalyzer - alias for SimplePerformanceCoordinator (backward compatibility)
    this.systemRegistry.set("PerformanceAnalyzer", SimplePerformanceCoordinator);
    this.systemDependencies.set("PerformanceAnalyzer", []);

    // CSSVariableBatcher - alias for OptimizedCSSVariableManager (backward compatibility)
    this.systemRegistry.set("CSSVariableBatcher", OptimizedCSSVariableManager);
    this.systemDependencies.set("CSSVariableBatcher", []);

    // SystemHealthMonitor - alias for SimplePerformanceCoordinator (backward compatibility)
    this.systemRegistry.set("SystemHealthMonitor", SimplePerformanceCoordinator);
    this.systemDependencies.set("SystemHealthMonitor", []);

    // UnifiedSystemIntegration - alias for SidebarSystemsIntegration (backward compatibility)
    this.systemRegistry.set("UnifiedSystemIntegration", SidebarSystemsIntegration);
    this.systemDependencies.set("UnifiedSystemIntegration", []);

    this.systemRegistry.set(
      "PerformanceBudgetManager",
      PerformanceBudgetManager
    );
    this.systemDependencies.set("PerformanceBudgetManager", [
      "performanceAnalyzer",
    ]);

    this.systemRegistry.set("SimplePerformanceCoordinator", SimplePerformanceCoordinator);
    this.systemDependencies.set("SimplePerformanceCoordinator", [
      "performanceAnalyzer",
      "performanceCoordinator",
      "deviceCapabilityDetector",
      "performanceBudgetManager",
    ]);

    // QualityScalingManager functionality absorbed into SimplePerformanceCoordinator (Phase 3 consolidation)
    // this.systemRegistry.set('QualityScalingManager', QualityScalingManager);
    // this.systemDependencies.set('QualityScalingManager', ['performanceAnalyzer', 'deviceCapabilityDetector']);

    // PerformanceAwareLerpCoordinator consolidated into EnhancedMasterAnimationCoordinator
    // Use EnhancedMasterAnimationCoordinator for musical LERP functionality

    // New simplified performance systems (replacing complex monitoring)
    this.systemRegistry.set("SimplePerformanceCoordinator", SimplePerformanceCoordinator);
    this.systemDependencies.set("SimplePerformanceCoordinator", [
      "enhancedDeviceTierDetector",
      "webglSystemsIntegration",
    ]);

    this.systemRegistry.set("SimpleTierBasedPerformanceSystem", SimpleTierBasedPerformanceSystem);
    this.systemDependencies.set("SimpleTierBasedPerformanceSystem", [
      "enhancedDeviceTierDetector",
    ]);

    this.systemRegistry.set("EnhancedDeviceTierDetector", EnhancedDeviceTierDetector);
    this.systemDependencies.set("EnhancedDeviceTierDetector", []);

    this.systemRegistry.set("WebGLSystemsIntegration", WebGLSystemsIntegration);
    this.systemDependencies.set("WebGLSystemsIntegration", [
      "deviceCapabilityDetector", // WebGLSystemsIntegration needs DeviceCapabilityDetector, not EnhancedDeviceTierDetector
    ]);

    // CSS systems consolidated into OptimizedCSSVariableManager:
    // - OptimizedCSSVariableManager → batching layer
    // - OptimizedCSSVariableManager → management layer
    // - OptimizedCSSVariableManager → performance layer

    // Core Services
    // Note: UnifiedDebugManager is a singleton handled as special case in createNonVisualSystem
    // Cannot register in systemRegistry due to private constructor - handled in createSystem special cases
    this.systemDependencies.set("UnifiedDebugManager", []);

    this.systemRegistry.set("SettingsManager", SettingsManager);
    this.systemDependencies.set("SettingsManager", []);

    this.systemRegistry.set("ColorHarmonyEngine", ColorHarmonyEngine);
    this.systemDependencies.set("ColorHarmonyEngine", ["musicSyncService"]);

    this.systemRegistry.set("MusicSyncService", MusicSyncService);
    this.systemDependencies.set("MusicSyncService", []);

    // Loading State Service - Phase 8.5 active loading state management
    this.systemRegistry.set("LoadingStateService", LoadingStateService);
    this.systemDependencies.set("LoadingStateService", ["performanceAnalyzer", "settingsManager"]);

    // 🔧 PHASE 2.1: UnifiedColorProcessingEngine - Enhanced consolidated color processor (PREFERRED)
    this.systemRegistry.set(
      "UnifiedColorProcessingEngine",
      UnifiedColorProcessingEngine
    );
    this.systemDependencies.set("UnifiedColorProcessingEngine", [
      "settingsManager",
      "performanceAnalyzer",
    ]);

    // ColorOrchestrator - Legacy strategy pattern coordinator (now delegates to UnifiedColorProcessingEngine)
    // Note: Uses globalUnifiedColorProcessingEngine singleton, handled as special case in createSystem
    // 🔧 PHASE 2.1: Now delegates to UnifiedColorProcessingEngine for enhanced processing
    this.systemDependencies.set("ColorOrchestrator", []);

    // Consciousness Systems
    // GenreGradientEvolution removed - functionality consolidated into GenreProfileManager

    this.systemRegistry.set("MusicEmotionAnalyzer", MusicEmotionAnalyzer);
    this.systemDependencies.set("MusicEmotionAnalyzer", [
      "musicSyncService",
      "settingsManager",
    ]);

    // 🔧 PHASE 4: VisualEffectsCoordinator - Consolidates ColorConsciousnessState and DynamicCatppuccinBridge
    this.systemRegistry.set(
      "VisualEffectsCoordinator",
      VisualEffectsCoordinator
    );
    this.systemDependencies.set("VisualEffectsCoordinator", [
      "settingsManager",
    ]);

    // UI Managers
    this.systemRegistry.set("GlassmorphismManager", GlassmorphismManager);
    this.systemDependencies.set("GlassmorphismManager", [
      "cssVariableManager",
      "performanceAnalyzer",
      "settingsManager",
    ]);

    this.systemRegistry.set("Card3DManager", Card3DManager);
    this.systemDependencies.set("Card3DManager", [
      "performanceAnalyzer",
      "settingsManager",
    ]);

    this.systemRegistry.set("GenreUIBridge", GenreUIBridge);
    this.systemDependencies.set("GenreUIBridge", [
      "GenreProfileManager",
      "MusicSyncService",
    ]);

    // Integration Systems
    this.systemRegistry.set(
      "SidebarSystemsIntegration",
      SidebarSystemsIntegration
    );
    this.systemDependencies.set("SidebarSystemsIntegration", [
      "cssVariableManager",
    ]);
  }

  public async initialize(
    config?: Partial<NonVisualSystemConfig>
  ): Promise<void> {
    if (this.isInitialized) {
      Y3KDebug?.debug?.warn("NonVisualSystemFacade", "Already initialized");
      return;
    }

    try {
      const startTime = performance.now();

      // Update configuration
      this.facadeConfig = { ...this.facadeConfig, ...config };

      // Initialize shared dependencies first
      await this.initializeSharedDependencies();

      // Apply configuration
      await this.applyConfiguration();

      // Start monitoring
      this.startMonitoring();

      // Perform initial health check
      await this.performHealthCheck();

      const endTime = performance.now();
      this.currentMetrics.systemInitializationTime = endTime - startTime;

      this.isInitialized = true;

      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Non-visual systems facade fully initialized",
        {
          mode: this.facadeConfig.mode,
          systemsRegistered: this.systemRegistry.size,
          initTime: this.currentMetrics.systemInitializationTime,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "NonVisualSystemFacade",
        "Initialization failed:",
        error
      );
      await this.cleanup();
      throw error;
    }
  }

  private async initializeSharedDependencies(): Promise<void> {
    // Initialize core systems first (these are needed by others)
    // NEW: Simplified performance systems first, then legacy systems for backward compatibility
    const coreSystemsOrder = [
      // Core dependency systems first
      "DeviceCapabilityDetector", // Needed by WebGL integration
      "EnhancedDeviceTierDetector", // Needed by simplified performance systems
      
      // New simplified performance systems (primary) - order matters for dependencies
      "WebGLSystemsIntegration", // Depends on DeviceCapabilityDetector
      "SimplePerformanceCoordinator", // Depends on EnhancedDeviceTierDetector and WebGLSystemsIntegration
      
      // Legacy performance systems (for backward compatibility)
      "PerformanceAnalyzer",
      "PerformanceAnalyzer",
      "SimplePerformanceCoordinator",
      
      // Shared systems
      "OptimizedCSSVariableManager",
      "SettingsManager",
      "UnifiedDebugManager",
      "MusicSyncService",
      "LoadingStateService", // Phase 8.5: Active loading state management (depends on performanceAnalyzer, settingsManager)
    ];

    for (const systemKey of coreSystemsOrder) {
      try {
        const system = await this.getSystem(systemKey as NonVisualSystemKey);
        if (system && typeof system.initialize === "function") {
          await system.initialize();
        }

        // Store references to shared dependencies
        switch (systemKey) {
          // Core dependency systems
          case "DeviceCapabilityDetector":
            // Store DeviceCapabilityDetector in year3000System for WebGL integration
            if (this.year3000System) {
              this.year3000System.deviceCapabilityDetector = system;
            }
            break;
          case "EnhancedDeviceTierDetector":
            this.enhancedDeviceTierDetector = system;
            break;
          
          // New simplified performance systems
          case "WebGLSystemsIntegration":
            this.webglSystemsIntegration = system;
            break;
          case "SimplePerformanceCoordinator":
            this.simplePerformanceCoordinator = system;
            // Also set as performance coordinator for backward compatibility
            this.performanceOrchestrator = system;
            break;
          
          // Legacy performance systems (for backward compatibility)
          case "PerformanceAnalyzer":
            this.performanceAnalyzer = system;
            this.performanceCoordinator = system; // Also set coordinator for backward compatibility
            break;
          
          // Shared systems
          case "OptimizedCSSVariableManager":
            this.cssVariableManager = system;
            break;
          case "SettingsManager":
            this.settingsManager = system;
            break;
          case "UnifiedDebugManager":
            // this.systemHealthMonitor = system; // Unused for now
            break;
          case "MusicSyncService":
            this.musicSyncService = system;
            break;
          case "LoadingStateService":
            this.loadingStateService = system;
            break;
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "NonVisualSystemFacade",
          `Failed to initialize ${systemKey}:`,
          error
        );
      }
    }
  }

  /**
   * Get system from cache (synchronous) - returns null if not cached
   * Use this for scenarios where the system should already be initialized
   */
  public getCachedSystem<T = any>(key: NonVisualSystemKey): T | null {
    // Check cache first
    const cached = this.systemCache.get(key);
    if (cached) {
      return cached as T;
    }

    // Check for shared instances (injected from SystemCoordinator)
    
    // Core dependency systems
    if (key === "DeviceCapabilityDetector" && this.year3000System?.deviceCapabilityDetector) {
      const deviceCapabilityDetector = this.year3000System.deviceCapabilityDetector;
      this.systemCache.set(key, deviceCapabilityDetector);
      return deviceCapabilityDetector as T;
    }

    if (key === "EnhancedDeviceTierDetector" && this.enhancedDeviceTierDetector) {
      this.systemCache.set(key, this.enhancedDeviceTierDetector);
      return this.enhancedDeviceTierDetector as T;
    }
    
    // New simplified performance systems
    if (key === "WebGLSystemsIntegration" && this.webglSystemsIntegration) {
      this.systemCache.set(key, this.webglSystemsIntegration);
      return this.webglSystemsIntegration as T;
    }

    if (key === "SimplePerformanceCoordinator" && this.simplePerformanceCoordinator) {
      this.systemCache.set(key, this.simplePerformanceCoordinator);
      return this.simplePerformanceCoordinator as T;
    }

    // Legacy performance systems (for backward compatibility)
    if (key === "PerformanceAnalyzer" && this.performanceAnalyzer) {
      this.systemCache.set(key, this.performanceAnalyzer);
      return this.performanceAnalyzer as T;
    }

    if (key === "SimplePerformanceCoordinator" && this.performanceOrchestrator) {
      this.systemCache.set(key, this.performanceOrchestrator);
      return this.performanceOrchestrator as T;
    }

    // Shared systems
    if ((key === "OptimizedCSSVariableManager" || key === "UnifiedCSSVariableManager") && this.cssVariableManager) {
      this.systemCache.set(key, this.cssVariableManager);
      return this.cssVariableManager as T;
    }

    if (key === "MusicSyncService" && this.musicSyncService) {
      this.systemCache.set(key, this.musicSyncService);
      return this.musicSyncService as T;
    }

    if (key === "SettingsManager" && this.settingsManager) {
      this.systemCache.set(key, this.settingsManager);
      return this.settingsManager as T;
    }

    if (key === "LoadingStateService" && this.loadingStateService) {
      this.systemCache.set(key, this.loadingStateService);
      return this.loadingStateService as T;
    }

    return null;
  }

  /**
   * Factory method to create and return non-visual systems
   * This is the main interface for the facade pattern
   */
  public async getSystem<T = any>(key: NonVisualSystemKey): Promise<T> {
    // Check cache first
    if (this.systemCache.has(key)) {
      return this.systemCache.get(key) as T;
    }

    // Check for shared instances first (injected from SystemCoordinator)
    
    // Core dependency systems
    if (key === "DeviceCapabilityDetector" && this.year3000System?.deviceCapabilityDetector) {
      const deviceCapabilityDetector = this.year3000System.deviceCapabilityDetector;
      this.systemCache.set(key, deviceCapabilityDetector);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared DeviceCapabilityDetector instance from SystemCoordinator"
      );
      return deviceCapabilityDetector as T;
    }

    if (key === "EnhancedDeviceTierDetector" && this.enhancedDeviceTierDetector) {
      this.systemCache.set(key, this.enhancedDeviceTierDetector);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared EnhancedDeviceTierDetector instance from SystemCoordinator"
      );
      return this.enhancedDeviceTierDetector as T;
    }
    
    // New simplified performance systems (priority)
    if (key === "WebGLSystemsIntegration" && this.webglSystemsIntegration) {
      this.systemCache.set(key, this.webglSystemsIntegration);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared WebGLSystemsIntegration instance from SystemCoordinator"
      );
      return this.webglSystemsIntegration as T;
    }

    if (key === "SimplePerformanceCoordinator" && this.simplePerformanceCoordinator) {
      this.systemCache.set(key, this.simplePerformanceCoordinator);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared SimplePerformanceCoordinator instance from SystemCoordinator"
      );
      return this.simplePerformanceCoordinator as T;
    }

    // Legacy performance systems (for backward compatibility)
    if (key === "PerformanceAnalyzer" && this.performanceAnalyzer) {
      this.systemCache.set(key, this.performanceAnalyzer);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared PerformanceAnalyzer instance from SystemCoordinator"
      );
      return this.performanceAnalyzer as T;
    }

    if ((key === "OptimizedCSSVariableManager" || key === "UnifiedCSSVariableManager") && this.cssVariableManager) {
      this.systemCache.set(key, this.cssVariableManager);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        `Using shared OptimizedCSSVariableManager instance from SystemCoordinator (requested as ${key})`
      );
      return this.cssVariableManager as T;
    }

    if (key === "SimplePerformanceCoordinator" && this.performanceOrchestrator) {
      this.systemCache.set(key, this.performanceOrchestrator);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared SimplePerformanceCoordinator instance from SystemCoordinator"
      );
      return this.performanceOrchestrator as T;
    }

    if (key === "MusicSyncService" && this.musicSyncService) {
      this.systemCache.set(key, this.musicSyncService);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared MusicSyncService instance from SystemCoordinator"
      );
      return this.musicSyncService as T;
    }

    if (key === "SettingsManager" && this.settingsManager) {
      this.systemCache.set(key, this.settingsManager);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared SettingsManager instance from SystemCoordinator"
      );
      return this.settingsManager as T;
    }

    if (key === "LoadingStateService" && this.loadingStateService) {
      this.systemCache.set(key, this.loadingStateService);
      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        "Using shared LoadingStateService instance"
      );
      return this.loadingStateService as T;
    }

    // Create new system instance using strategy-based creation
    const system = await this.createSystem<T>(key);

    // Cache the system
    this.systemCache.set(key, system);

    // Update metrics
    this.currentMetrics.activeSystems.push(key);
    this.currentMetrics.initializedSystems++;

    // Emit creation event
    if (this.onSystemCreated) {
      this.onSystemCreated(key, system);
    }

    return system;
  }

  /**
   * Create a new non-visual system instance with strategy-based dependency injection
   */
  public async createSystem<T = any>(key: NonVisualSystemKey): Promise<T> {
    const startTime = performance.now();

    try {
      // Handle special cases that require singleton pattern
      if (key === "UnifiedDebugManager") {
        // UnifiedDebugManager is a singleton - handle directly
        const system = UnifiedDebugManager.getInstance() as T;

        // Inject additional dependencies
        this.injectDependencies(system, key);

        // Integrate performance monitoring
        this.integratePerformanceMonitoring(system, key);

        const endTime = performance.now();
        this.currentMetrics.dependencyResolutionTime += endTime - startTime;

        return system;
      }

      if (key === "ColorOrchestrator") {
        // ColorOrchestrator is a singleton - use globalUnifiedColorProcessingEngine
        const system = globalUnifiedColorProcessingEngine as T;

        // Inject additional dependencies
        this.injectDependencies(system, key);

        // Integrate performance monitoring
        this.integratePerformanceMonitoring(system, key);

        const endTime = performance.now();
        this.currentMetrics.dependencyResolutionTime += endTime - startTime;

        return system;
      }

      // Use strategy-based creation for all other systems
      const SystemClass = this.systemRegistry.get(key);
      if (!SystemClass) {
        throw new Error(`Non-visual system '${key}' not found in registry`);
      }

      // Prepare context for strategy-based creation
      const context = {
        systemKey: key,
        config: this.config,
        utils: this.utils,
        dependencies: {
          config: this.config,
          utils: this.utils,
          performanceAnalyzer: this.performanceAnalyzer,
          settingsManager: this.settingsManager,
          musicSyncService: this.musicSyncService,
          year3000System: this.year3000System,
          cssVariableManager: this.cssVariableManager,
          performanceCoordinator: this.performanceCoordinator,
          performanceOrchestrator: this.performanceOrchestrator,
          // New simplified performance system dependencies
          enhancedDeviceTierDetector: this.enhancedDeviceTierDetector,
          webglSystemsIntegration: this.webglSystemsIntegration,
          simplePerformanceCoordinator: this.simplePerformanceCoordinator,
          // Need DeviceCapabilityDetector from SystemCoordinator for WebGL integration
          deviceCapabilityDetector: this.year3000System?.deviceCapabilityDetector || null,
        },
        preferences: {
          lazyInit: false,
          validateDependencies: true,
          creationTimeout: 5000,
          monitorCreation: true,
        },
        metadata: {
          timestamp: Date.now(),
          reason: "startup",
          priority: "medium",
          resourceConstraints: {
            maxMemoryMB: 50,
            maxInitTimeMs: 1000,
          },
        },
        year3000System: this.year3000System,
      };

      // Create system using strategy-based factory
      const result = await this.facadeAdapter.createSystemWithStrategy(
        key,
        SystemClass,
        context
      );

      if (!result.success) {
        // Fallback to legacy creation if strategy fails
        Y3KDebug?.debug?.warn(
          "NonVisualSystemFacade",
          `Strategy creation failed for ${key}, falling back to legacy pattern`
        );

        const system = this.facadeAdapter.createSystemLegacy(
          key,
          SystemClass,
          context
        );

        // Inject additional dependencies
        this.injectDependencies(system, key);

        // Integrate performance monitoring
        this.integratePerformanceMonitoring(system, key);

        const endTime = performance.now();
        this.currentMetrics.dependencyResolutionTime += endTime - startTime;

        return system;
      }

      // Strategy creation succeeded
      const system = result.system;

      // Inject additional dependencies (for compatibility)
      this.injectDependencies(system, key);

      // Integrate performance monitoring
      this.integratePerformanceMonitoring(system, key);

      const endTime = performance.now();
      this.currentMetrics.dependencyResolutionTime += endTime - startTime;

      Y3KDebug?.debug?.log(
        "NonVisualSystemFacade",
        `Created ${key} using strategy: ${result.strategy}`,
        {
          creationTime: result.creationTime,
          totalTime: endTime - startTime,
          injectedDependencies: result.injectedDependencies,
        }
      );

      return system;
    } catch (error) {
      this.currentMetrics.failedSystems++;
      this.currentMetrics.failedSystemsList.push(key);
      this.currentMetrics.systemErrors++;

      if (this.onSystemFailed) {
        this.onSystemFailed(key, error as Error);
      }

      Y3KDebug?.debug?.error(
        "NonVisualSystemFacade",
        `Failed to create system ${key}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Inject dependencies into non-visual systems
   */
  private injectDependencies(system: any, key: NonVisualSystemKey): void {
    if (!this.facadeConfig.enableDependencyInjection) return;

    const dependencies = this.systemDependencies.get(key) || [];

    // Inject performance analyzer
    if (
      dependencies.includes("performanceAnalyzer") &&
      this.performanceAnalyzer &&
      system.setPerformanceAnalyzer
    ) {
      system.setPerformanceAnalyzer(this.performanceAnalyzer);
    }

    // Inject CSS variable manager
    if (
      dependencies.includes("cssVariableManager") &&
      this.cssVariableManager &&
      system.setCSSVariableManager
    ) {
      system.setCSSVariableManager(this.cssVariableManager);
    }

    // Backwards compatibility - inject CSS variable manager via old method name
    if (
      dependencies.includes("cssConsciousnessController") &&
      this.cssVariableManager &&
      system.setCSSConsciousnessController
    ) {
      system.setCSSConsciousnessController(this.cssVariableManager);
    }

    // Inject music sync service
    if (
      dependencies.includes("musicSyncService") &&
      this.musicSyncService &&
      system.setMusicSyncService
    ) {
      system.setMusicSyncService(this.musicSyncService);
    }

    // Inject settings manager
    if (
      dependencies.includes("settingsManager") &&
      this.settingsManager &&
      system.setSettingsManager
    ) {
      system.setSettingsManager(this.settingsManager);
    }

    // Inject year3000System reference
    if (dependencies.includes("year3000System") && system.setYear3000System) {
      system.setYear3000System(this.year3000System);
    }

    // Inject SimplePerformanceCoordinator for LERP coordination
    if (
      dependencies.includes("performanceOrchestrator") &&
      this.performanceOrchestrator &&
      system.setSimplePerformanceCoordinator
    ) {
      system.setSimplePerformanceCoordinator(this.performanceOrchestrator);
    }
  }

  /**
   * Integrate performance monitoring for non-visual systems
   */
  private integratePerformanceMonitoring(
    system: any,
    key: NonVisualSystemKey
  ): void {
    if (
      !this.facadeConfig.enablePerformanceMonitoring ||
      !this.performanceAnalyzer
    )
      return;

    // Wrap initialize method with performance monitoring
    const originalInitialize = system.initialize;
    if (typeof originalInitialize === "function") {
      system.initialize = async (...args: any[]) => {
        const startTime = performance.now();
        const result = await originalInitialize.call(system, ...args);
        const endTime = performance.now();

        // Record initialization performance
        this.performanceAnalyzer?.recordMetric(
          `NonVisual_${key}_Initialize`,
          endTime - startTime
        );

        return result;
      };
    }

    // Wrap updateAnimation method if it exists
    const originalUpdateAnimation = system.updateAnimation;
    if (typeof originalUpdateAnimation === "function") {
      system.updateAnimation = (deltaTime: number) => {
        const startTime = performance.now();
        originalUpdateAnimation.call(system, deltaTime);
        const endTime = performance.now();

        // Record animation performance
        this.performanceAnalyzer?.recordMetric(
          `NonVisual_${key}_Animation`,
          endTime - startTime
        );
      };
    }
  }

  /**
   * Initialize all cached non-visual systems
   */
  public async initializeAllSystems(): Promise<void> {
    const initPromises = Array.from(this.systemCache.entries()).map(
      async ([key, system]) => {
        try {
          if (system && typeof system.initialize === "function") {
            await system.initialize();
          }
          Y3KDebug?.debug?.log(
            "NonVisualSystemFacade",
            `Initialized system: ${key}`
          );
          return { key, success: true };
        } catch (error) {
          Y3KDebug?.debug?.error(
            "NonVisualSystemFacade",
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
      "NonVisualSystemFacade",
      `Non-visual systems initialized: ${successCount}/${results.length}`
    );
  }

  /**
   * Perform health check on all non-visual systems
   */
  public async performHealthCheck(): Promise<NonVisualSystemHealthCheck> {
    const healthCheck: NonVisualSystemHealthCheck = {
      overall: "good",
      systems: new Map(),
      recommendations: [],
      timestamp: performance.now(),
      metrics: { ...this.currentMetrics },
    };

    let healthyCount = 0;
    let totalCount = 0;

    // Check each cached system
    for (const [key, system] of this.systemCache) {
      totalCount++;

      try {
        const systemHealth = system.healthCheck
          ? await system.healthCheck()
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
        "Some non-visual systems are experiencing issues"
      );
    } else {
      healthCheck.overall = "critical";
      healthCheck.recommendations.push(
        "Multiple non-visual system failures detected"
      );
    }

    // Add performance recommendations
    if (this.currentMetrics.systemInitializationTime > 3000) {
      healthCheck.recommendations.push(
        "High initialization time - consider optimizing system startup"
      );
    }

    if (this.currentMetrics.memoryUsageMB > 80) {
      healthCheck.recommendations.push(
        "High memory usage - consider optimizing system memory usage"
      );
    }

    this.lastHealthCheck = healthCheck;
    this.currentMetrics.lastHealthCheckTime = performance.now();

    // Emit health change event
    if (this.onHealthChange) {
      this.onHealthChange(healthCheck);
    }

    return healthCheck;
  }

  // Utility methods
  private createInitialMetrics(): NonVisualSystemMetrics {
    return {
      systemCount: this.systemRegistry.size,
      initializedSystems: 0,
      failedSystems: 0,
      totalInitTime: 0,
      averageInitTime: 0,
      memoryUsageMB: 0,
      systemHealth: "good",
      activeSystems: [],
      failedSystemsList: [],
      dependencyInjection: this.facadeConfig.enableDependencyInjection,
      performanceMonitoring: this.facadeConfig.enablePerformanceMonitoring,
      healthMonitoring: this.facadeConfig.enableSystemHealthMonitoring,
      systemInitializationTime: 0,
      dependencyResolutionTime: 0,
      lastHealthCheckTime: 0,
      systemErrors: 0,
    };
  }

  private async applyConfiguration(): Promise<void> {
    // Apply mode-specific optimizations
    switch (this.facadeConfig.mode) {
      case "performance-first":
        this.facadeConfig.systemPreferences.lazyInitialization = true;
        this.facadeConfig.systemPreferences.aggressiveCaching = true;
        break;
      case "quality-first":
        this.facadeConfig.systemPreferences.lazyInitialization = false;
        this.facadeConfig.systemPreferences.performanceOptimization = true;
        break;
      case "battery-optimized":
        this.facadeConfig.performanceThresholds.maxCPUPercent = 5;
        this.facadeConfig.systemPreferences.lazyInitialization = true;
        break;
    }
  }

  private startMonitoring(): void {
    if (this.facadeConfig.enableSystemHealthMonitoring) {
      this.healthCheckInterval = window.setInterval(async () => {
        await this.performHealthCheck();
      }, 30000); // Every 30 seconds

      this.metricsUpdateInterval = window.setInterval(() => {
        this.updateMetrics();
      }, 5000); // Every 5 seconds
    }
  }

  private updateMetrics(): void {
    // Update system metrics
    this.currentMetrics.systemCount = this.systemRegistry.size;
    this.currentMetrics.initializedSystems = this.systemCache.size;
    this.currentMetrics.averageInitTime =
      this.currentMetrics.totalInitTime /
      Math.max(1, this.currentMetrics.initializedSystems);

    // Update memory usage
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      this.currentMetrics.memoryUsageMB =
        memoryInfo.usedJSHeapSize / (1024 * 1024);
    }

    // Update system health
    const failureRate =
      this.currentMetrics.failedSystems /
      Math.max(1, this.currentMetrics.systemCount);

    if (failureRate === 0) {
      this.currentMetrics.systemHealth = "excellent";
    } else if (failureRate < 0.1) {
      this.currentMetrics.systemHealth = "good";
    } else if (failureRate < 0.3) {
      this.currentMetrics.systemHealth = "degraded";
    } else {
      this.currentMetrics.systemHealth = "critical";
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

    // Clear references
    this.cssVariableManager = null;
    this.performanceAnalyzer = null;
    this.performanceOrchestrator = null;
    this.musicSyncService = null;
    this.settingsManager = null;
    // this.colorHarmonyEngine = null; // Unused for now
    // this.systemHealthMonitor = null; // Unused for now
  }

  // Public API
  public getMetrics(): NonVisualSystemMetrics {
    return { ...this.currentMetrics };
  }

  public getLastHealthCheck(): NonVisualSystemHealthCheck | null {
    return this.lastHealthCheck;
  }

  public getConfiguration(): NonVisualSystemConfig {
    return { ...this.facadeConfig };
  }

  public async setConfiguration(
    config: Partial<NonVisualSystemConfig>
  ): Promise<void> {
    this.facadeConfig = { ...this.facadeConfig, ...config };
    await this.applyConfiguration();
  }

  public setOnSystemCreated(
    callback: (systemKey: NonVisualSystemKey, system: any) => void
  ): void {
    this.onSystemCreated = callback;
  }

  public setOnSystemFailed(
    callback: (systemKey: NonVisualSystemKey, error: Error) => void
  ): void {
    this.onSystemFailed = callback;
  }

  public setOnHealthChange(
    callback: (health: NonVisualSystemHealthCheck) => void
  ): void {
    this.onHealthChange = callback;
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

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;

    // Clear system cache
    this.systemCache.clear();

    Y3KDebug?.debug?.log(
      "NonVisualSystemFacade",
      "Non-visual systems facade destroyed"
    );
  }
}
