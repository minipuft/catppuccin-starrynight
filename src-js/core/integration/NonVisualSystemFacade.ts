/**
 * NonVisualSystemFacade - Phase 3 Non-Visual Systems Facade
 * 
 * Extended facade for handling ALL non-visual systems through factory patterns.
 * Provides comprehensive factory methods, dependency injection, and performance optimization
 * for all non-visual systems in the Year3000 architecture.
 * 
 * Key Features:
 * - Factory pattern for all non-visual systems
 * - Automatic dependency injection
 * - Performance monitoring integration
 * - System lifecycle management
 * - Error handling and recovery
 * - Loose coupling through facade pattern
 * 
 * Integrates with:
 * - VisualSystemFacade (for visual systems)
 * - Year3000System (main system orchestrator)
 * - Performance monitoring systems
 * - Settings and configuration systems
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/Year3000Utilities";

// Performance System imports
import { EnhancedMasterAnimationCoordinator } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { TimerConsolidationSystem } from "@/core/performance/TimerConsolidationSystem";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { UnifiedPerformanceCoordinator } from "@/core/performance/UnifiedPerformanceCoordinator";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
// PerformanceOptimizationManager consolidated into UnifiedPerformanceCoordinator
import { PerformanceCSSIntegration } from "@/core/css/PerformanceCSSIntegration";

// Core Services imports
import UnifiedDebugManager from "@/debug/UnifiedDebugManager";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";

// UI Managers imports
import { GlassmorphismManager } from "@/ui/managers/GlassmorphismManager";
import { Card3DManager } from "@/ui/managers/Card3DManager";

// Integration Systems imports
import { SidebarSystemsIntegration } from "@/core/integration/SidebarSystemsIntegration";
import { UnifiedSystemIntegration } from "@/core/integration/UnifiedSystemIntegration";

// Strategy-based creation imports
import { globalFacadeAdapter } from "@/core/integration/FacadeAdapter";

// Interface imports
// import { IManagedSystem } from "@/types/systems"; // Unused for now

// Type definitions
export type NonVisualSystemKey = 
  // Performance Systems
  | 'EnhancedMasterAnimationCoordinator'
  | 'TimerConsolidationSystem'
  | 'CSSVariableBatcher'
  | 'UnifiedCSSVariableManager'
  | 'UnifiedPerformanceCoordinator'
  | 'DeviceCapabilityDetector'
  | 'PerformanceAnalyzer'
  | 'PerformanceCSSIntegration'
  
  // Core Services
  | 'UnifiedDebugManager'
  | 'SettingsManager'
  | 'ColorHarmonyEngine'
  | 'MusicSyncService'
  
  // UI Managers
  | 'GlassmorphismManager'
  | 'Card3DManager'
  
  // Integration Systems
  | 'SidebarSystemsIntegration'
  | 'UnifiedSystemIntegration';

export type SystemHealth = "excellent" | "good" | "degraded" | "critical";
export type IntegrationMode = "progressive" | "performance-first" | "quality-first" | "battery-optimized";

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
  private config: Year3000Config;
  private utils: typeof Utils;
  private year3000System: any; // Reference to main system
  
  // Core shared dependencies (will be injected from main system)
  private cssVariableBatcher: CSSVariableBatcher | null = null;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;
  private performanceCoordinator: UnifiedPerformanceCoordinator | null = null;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  // private colorHarmonyEngine: ColorHarmonyEngine | null = null; // Unused for now
  // private systemHealthMonitor: SystemHealthMonitor | null = null; // Unused for now
  
  // System registry and cache
  private systemRegistry: Map<NonVisualSystemKey, new(...args: any[]) => any>;
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
  private onSystemCreated: ((systemKey: NonVisualSystemKey, system: any) => void) | null = null;
  private onSystemFailed: ((systemKey: NonVisualSystemKey, error: Error) => void) | null = null;
  private onHealthChange: ((health: NonVisualSystemHealthCheck) => void) | null = null;
  
  // Strategy-based creation adapter
  private facadeAdapter = globalFacadeAdapter;

  constructor(
    config: Year3000Config,
    utils: typeof Utils,
    year3000System: any
  ) {
    this.config = config;
    this.utils = utils;
    this.year3000System = year3000System;
    
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
        maxCPUPercent: 15
      },
      systemPreferences: {
        lazyInitialization: true,
        aggressiveCaching: true,
        performanceOptimization: true
      }
    };
    
    this.currentMetrics = this.createInitialMetrics();
    
    // Register all non-visual systems
    this.registerNonVisualSystems();
    
    Y3K?.debug?.log("NonVisualSystemFacade", "Non-visual systems facade initialized");
  }

  private registerNonVisualSystems(): void {
    // Performance Systems
    this.systemRegistry.set('EnhancedMasterAnimationCoordinator', EnhancedMasterAnimationCoordinator);
    this.systemDependencies.set('EnhancedMasterAnimationCoordinator', ['performanceAnalyzer', 'cssVariableBatcher']);
    
    this.systemRegistry.set('TimerConsolidationSystem', TimerConsolidationSystem);
    this.systemDependencies.set('TimerConsolidationSystem', ['performanceAnalyzer']);
    
    this.systemRegistry.set('CSSVariableBatcher', CSSVariableBatcher);
    this.systemDependencies.set('CSSVariableBatcher', []);
    
    this.systemRegistry.set('UnifiedCSSVariableManager', UnifiedCSSVariableManager);
    this.systemDependencies.set('UnifiedCSSVariableManager', ['cssVariableBatcher']);
    
    this.systemRegistry.set('UnifiedPerformanceCoordinator', UnifiedPerformanceCoordinator);
    this.systemDependencies.set('UnifiedPerformanceCoordinator', []);
    
    this.systemRegistry.set('DeviceCapabilityDetector', DeviceCapabilityDetector);
    this.systemDependencies.set('DeviceCapabilityDetector', []);
    
    this.systemRegistry.set('PerformanceAnalyzer', PerformanceAnalyzer);
    this.systemDependencies.set('PerformanceAnalyzer', []);
    
    // PerformanceOptimizationManager consolidated into UnifiedPerformanceCoordinator
    
    this.systemRegistry.set('PerformanceCSSIntegration', PerformanceCSSIntegration);
    this.systemDependencies.set('PerformanceCSSIntegration', ['cssVariableBatcher', 'performanceAnalyzer']);
    
    // Core Services
    // Note: UnifiedDebugManager is a singleton handled as special case in createNonVisualSystem
    // Cannot register in systemRegistry due to private constructor - handled in createSystem special cases
    this.systemDependencies.set('UnifiedDebugManager', []);
    
    this.systemRegistry.set('SettingsManager', SettingsManager);
    this.systemDependencies.set('SettingsManager', []);
    
    this.systemRegistry.set('ColorHarmonyEngine', ColorHarmonyEngine);
    this.systemDependencies.set('ColorHarmonyEngine', ['musicSyncService']);
    
    this.systemRegistry.set('MusicSyncService', MusicSyncService);
    this.systemDependencies.set('MusicSyncService', []);
    
    // UI Managers
    this.systemRegistry.set('GlassmorphismManager', GlassmorphismManager);
    this.systemDependencies.set('GlassmorphismManager', ['cssVariableBatcher', 'performanceAnalyzer', 'settingsManager']);
    
    this.systemRegistry.set('Card3DManager', Card3DManager);
    this.systemDependencies.set('Card3DManager', ['performanceAnalyzer', 'settingsManager']);
    
    // Integration Systems
    this.systemRegistry.set('SidebarSystemsIntegration', SidebarSystemsIntegration);
    this.systemDependencies.set('SidebarSystemsIntegration', ['cssVariableBatcher']);
    
    this.systemRegistry.set('UnifiedSystemIntegration', UnifiedSystemIntegration);
    this.systemDependencies.set('UnifiedSystemIntegration', ['year3000System']);
  }

  public async initialize(config?: Partial<NonVisualSystemConfig>): Promise<void> {
    if (this.isInitialized) {
      Y3K?.debug?.warn("NonVisualSystemFacade", "Already initialized");
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
      
      Y3K?.debug?.log("NonVisualSystemFacade", "Non-visual systems facade fully initialized", {
        mode: this.facadeConfig.mode,
        systemsRegistered: this.systemRegistry.size,
        initTime: this.currentMetrics.systemInitializationTime
      });
      
    } catch (error) {
      Y3K?.debug?.error("NonVisualSystemFacade", "Initialization failed:", error);
      await this.cleanup();
      throw error;
    }
  }

  private async initializeSharedDependencies(): Promise<void> {
    // Initialize core systems first (these are needed by others)
    // CRITICAL: PerformanceAnalyzer MUST be created before UnifiedPerformanceCoordinator
    const coreSystemsOrder = [
      'PerformanceAnalyzer',
      'CSSVariableBatcher',
      'SettingsManager',
      'UnifiedDebugManager',
      'MusicSyncService',
      'UnifiedPerformanceCoordinator'
    ];

    for (const systemKey of coreSystemsOrder) {
      try {
        const system = await this.getSystem(systemKey as NonVisualSystemKey);
        if (system && typeof system.initialize === 'function') {
          await system.initialize();
        }
        
        // Store references to shared dependencies
        switch (systemKey) {
          case 'PerformanceAnalyzer':
            this.performanceAnalyzer = system;
            break;
          case 'CSSVariableBatcher':
            this.cssVariableBatcher = system;
            break;
          case 'SettingsManager':
            this.settingsManager = system;
            break;
          case 'UnifiedDebugManager':
            // this.systemHealthMonitor = system; // Unused for now
            break;
          case 'MusicSyncService':
            this.musicSyncService = system;
            break;
          case 'UnifiedPerformanceCoordinator':
            this.performanceCoordinator = system;
            break;
        }
        
      } catch (error) {
        Y3K?.debug?.error("NonVisualSystemFacade", `Failed to initialize ${systemKey}:`, error);
      }
    }
  }

  /**
   * Get system from cache (synchronous) - returns null if not cached
   * Use this for scenarios where the system should already be initialized
   */
  public getCachedSystem<T = any>(key: NonVisualSystemKey): T | null {
    return this.systemCache.get(key) as T || null;
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
      if (key === 'UnifiedDebugManager') {
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
          cssVariableBatcher: this.cssVariableBatcher,
          performanceCoordinator: this.performanceCoordinator
        },
        preferences: {
          lazyInit: false,
          validateDependencies: true,
          creationTimeout: 5000,
          monitorCreation: true
        },
        metadata: {
          timestamp: Date.now(),
          reason: 'startup',
          priority: 'medium',
          resourceConstraints: {
            maxMemoryMB: 50,
            maxInitTimeMs: 1000
          }
        },
        year3000System: this.year3000System
      };

      // Create system using strategy-based factory
      const result = await this.facadeAdapter.createSystemWithStrategy(key, SystemClass, context);
      
      if (!result.success) {
        // Fallback to legacy creation if strategy fails
        Y3K?.debug?.warn("NonVisualSystemFacade", 
          `Strategy creation failed for ${key}, falling back to legacy pattern`);
        
        const system = this.facadeAdapter.createSystemLegacy(key, SystemClass, context);
        
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
      
      Y3K?.debug?.log("NonVisualSystemFacade", `Created ${key} using strategy: ${result.strategy}`, {
        creationTime: result.creationTime,
        totalTime: endTime - startTime,
        injectedDependencies: result.injectedDependencies
      });
      
      return system;
      
    } catch (error) {
      this.currentMetrics.failedSystems++;
      this.currentMetrics.failedSystemsList.push(key);
      this.currentMetrics.systemErrors++;
      
      if (this.onSystemFailed) {
        this.onSystemFailed(key, error as Error);
      }
      
      Y3K?.debug?.error("NonVisualSystemFacade", `Failed to create system ${key}:`, error);
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
    if (dependencies.includes('performanceAnalyzer') && this.performanceAnalyzer && system.setPerformanceAnalyzer) {
      system.setPerformanceAnalyzer(this.performanceAnalyzer);
    }
    
    // Inject CSS variable batcher
    if (dependencies.includes('cssVariableBatcher') && this.cssVariableBatcher && system.setCSSVariableBatcher) {
      system.setCSSVariableBatcher(this.cssVariableBatcher);
    }
    
    // Inject music sync service
    if (dependencies.includes('musicSyncService') && this.musicSyncService && system.setMusicSyncService) {
      system.setMusicSyncService(this.musicSyncService);
    }
    
    // Inject settings manager
    if (dependencies.includes('settingsManager') && this.settingsManager && system.setSettingsManager) {
      system.setSettingsManager(this.settingsManager);
    }
    
    // Inject year3000System reference
    if (dependencies.includes('year3000System') && system.setYear3000System) {
      system.setYear3000System(this.year3000System);
    }
  }

  /**
   * Integrate performance monitoring for non-visual systems
   */
  private integratePerformanceMonitoring(system: any, key: NonVisualSystemKey): void {
    if (!this.facadeConfig.enablePerformanceMonitoring || !this.performanceAnalyzer) return;

    // Wrap initialize method with performance monitoring
    const originalInitialize = system.initialize;
    if (typeof originalInitialize === 'function') {
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
    if (typeof originalUpdateAnimation === 'function') {
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
    const initPromises = Array.from(this.systemCache.entries()).map(async ([key, system]) => {
      try {
        if (system && typeof system.initialize === 'function') {
          await system.initialize();
        }
        Y3K?.debug?.log("NonVisualSystemFacade", `Initialized system: ${key}`);
        return { key, success: true };
      } catch (error) {
        Y3K?.debug?.error("NonVisualSystemFacade", `Failed to initialize ${key}:`, error);
        return { key, success: false, error };
      }
    });
    
    const results = await Promise.allSettled(initPromises);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    
    Y3K?.debug?.log("NonVisualSystemFacade", `Non-visual systems initialized: ${successCount}/${results.length}`);
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
      metrics: { ...this.currentMetrics }
    };

    let healthyCount = 0;
    let totalCount = 0;

    // Check each cached system
    for (const [key, system] of this.systemCache) {
      totalCount++;
      
      try {
        const systemHealth = system.healthCheck ? 
          await system.healthCheck() : 
          { status: 'unknown', message: 'No health check available' };
        
        const isHealthy = systemHealth.status === 'healthy' || systemHealth.status === 'good';
        if (isHealthy) healthyCount++;
        
        healthCheck.systems.set(key, {
          ok: isHealthy,
          details: systemHealth.message || systemHealth.details || 'System operational'
        });
        
      } catch (error) {
        healthCheck.systems.set(key, {
          ok: false,
          details: `Health check failed: ${error}`
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
      healthCheck.recommendations.push("Some non-visual systems are experiencing issues");
    } else {
      healthCheck.overall = "critical";
      healthCheck.recommendations.push("Multiple non-visual system failures detected");
    }

    // Add performance recommendations
    if (this.currentMetrics.systemInitializationTime > 3000) {
      healthCheck.recommendations.push("High initialization time - consider optimizing system startup");
    }
    
    if (this.currentMetrics.memoryUsageMB > 80) {
      healthCheck.recommendations.push("High memory usage - consider optimizing system memory usage");
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
      systemErrors: 0
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
    this.currentMetrics.averageInitTime = this.currentMetrics.totalInitTime / Math.max(1, this.currentMetrics.initializedSystems);
    
    // Update memory usage
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      this.currentMetrics.memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
    }
    
    // Update system health
    const failureRate = this.currentMetrics.failedSystems / Math.max(1, this.currentMetrics.systemCount);
    
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
    this.cssVariableBatcher = null;
    this.performanceAnalyzer = null;
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

  public async setConfiguration(config: Partial<NonVisualSystemConfig>): Promise<void> {
    this.facadeConfig = { ...this.facadeConfig, ...config };
    await this.applyConfiguration();
  }

  public setOnSystemCreated(callback: (systemKey: NonVisualSystemKey, system: any) => void): void {
    this.onSystemCreated = callback;
  }

  public setOnSystemFailed(callback: (systemKey: NonVisualSystemKey, error: Error) => void): void {
    this.onSystemFailed = callback;
  }

  public setOnHealthChange(callback: (health: NonVisualSystemHealthCheck) => void): void {
    this.onHealthChange = callback;
  }

  public getSystemStatus(): { initialized: boolean; systemsActive: number; healthy: boolean } {
    return {
      initialized: this.isInitialized,
      systemsActive: this.systemCache.size,
      healthy: this.currentMetrics.systemHealth === "excellent" || this.currentMetrics.systemHealth === "good"
    };
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;
    
    // Clear system cache
    this.systemCache.clear();
    
    Y3K?.debug?.log("NonVisualSystemFacade", "Non-visual systems facade destroyed");
  }
}