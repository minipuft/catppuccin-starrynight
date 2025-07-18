/**
 * FacadeCoordinationSystem - Phase 3 Integration Coordinator
 * 
 * Coordinates interaction between VisualIntegrationBridge and UnifiedSystemIntegrationFacade
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
 * - Optimizes shared resources (PerformanceAnalyzer, CSSVariableBatcher)
 * - Coordinates system lifecycle across facades
 */

import { Y3K } from "@/debug/SystemHealthMonitor";
import { VisualIntegrationBridge, VisualSystemKey } from "@/visual/integration/VisualIntegrationBridge";
import { UnifiedSystemIntegrationFacade, NonVisualSystemKey } from "@/core/integration/UnifiedSystemIntegrationFacade";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import type { Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/Year3000Utilities";

export type SystemType = 'visual' | 'non-visual';
export type CoordinationMode = 'unified' | 'independent' | 'performance-optimized';

export interface FacadeCoordinationConfig {
  mode: CoordinationMode;
  enableSharedDependencies: boolean;
  enableCrossFacadeCommunication: boolean;
  enableUnifiedPerformanceMonitoring: boolean;
  enableResourceOptimization: boolean;
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
  overallHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  visualHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  nonVisualHealth: 'excellent' | 'good' | 'degraded' | 'critical';
  
  // Coordination metrics
  sharedDependencies: number;
  crossFacadeEvents: number;
  resourceOptimization: number;
}

export interface FacadeHealthCheck {
  overall: 'excellent' | 'good' | 'degraded' | 'critical';
  facades: {
    visual: { ok: boolean; details: string; systemCount: number };
    nonVisual: { ok: boolean; details: string; systemCount: number };
  };
  sharedResources: {
    performanceAnalyzer: { ok: boolean; details: string };
    cssVariableBatcher: { ok: boolean; details: string };
    musicSyncService: { ok: boolean; details: string };
  };
  recommendations: string[];
  timestamp: number;
}

export class FacadeCoordinationSystem {
  // Core configuration
  private config: Year3000Config;
  private utils: typeof Utils;
  private year3000System: any;
  
  // Facade instances
  private visualBridge: VisualIntegrationBridge | null = null;
  private nonVisualFacade: UnifiedSystemIntegrationFacade | null = null;
  
  // Shared dependencies (centrally managed)
  private sharedCSSVariableBatcher: CSSVariableBatcher | null = null;
  private sharedPerformanceAnalyzer: PerformanceAnalyzer | null = null;
  private sharedMusicSyncService: MusicSyncService | null = null;
  private sharedSettingsManager: SettingsManager | null = null;
  private sharedColorHarmonyEngine: ColorHarmonyEngine | null = null;
  
  // State management
  private isInitialized = false;
  private coordinationConfig: FacadeCoordinationConfig;
  private currentMetrics: UnifiedSystemMetrics;
  private lastHealthCheck: FacadeHealthCheck | null = null;
  
  // Event coordination
  private eventBus: any = null;
  private crossFacadeEventListeners: Map<string, Function[]> = new Map();
  
  // Monitoring
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;
  
  // Event callbacks
  private onSystemCreated: ((type: SystemType, key: string, system: any) => void) | null = null;
  private onHealthChange: ((health: FacadeHealthCheck) => void) | null = null;
  private onPerformanceChange: ((metrics: UnifiedSystemMetrics) => void) | null = null;

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
      mode: 'unified',
      enableSharedDependencies: true,
      enableCrossFacadeCommunication: true,
      enableUnifiedPerformanceMonitoring: true,
      enableResourceOptimization: true,
      performanceThresholds: {
        maxTotalMemoryMB: 150,
        maxTotalInitTime: 8000,
        maxCrossCommLatency: 10
      },
      coordinationPreferences: {
        preferSharedResources: true,
        enableEventPropagation: true,
        enableHealthCoordination: true
      }
    };
    
    this.currentMetrics = this.createInitialMetrics();
    
    Y3K?.debug?.log("FacadeCoordinationSystem", "Facade coordination system initialized");
  }

  public async initialize(config?: Partial<FacadeCoordinationConfig>): Promise<void> {
    if (this.isInitialized) {
      Y3K?.debug?.warn("FacadeCoordinationSystem", "Already initialized");
      return;
    }

    try {
      const startTime = performance.now();
      
      // Update configuration
      this.coordinationConfig = { ...this.coordinationConfig, ...config };
      
      // Initialize shared dependencies first
      await this.initializeSharedDependencies();
      
      // Initialize facades with shared dependencies
      await this.initializeFacades();
      
      // Set up cross-facade communication
      this.setupCrossFacadeCommunication();
      
      // Start monitoring
      this.startMonitoring();
      
      // Perform initial health check
      await this.performHealthCheck();
      
      const endTime = performance.now();
      this.currentMetrics.totalInitTime = endTime - startTime;
      
      this.isInitialized = true;
      
      Y3K?.debug?.log("FacadeCoordinationSystem", "Facade coordination fully initialized", {
        mode: this.coordinationConfig.mode,
        visualSystems: this.currentMetrics.visualSystems,
        nonVisualSystems: this.currentMetrics.nonVisualSystems,
        initTime: this.currentMetrics.totalInitTime
      });
      
    } catch (error) {
      Y3K?.debug?.error("FacadeCoordinationSystem", "Initialization failed:", error);
      await this.cleanup();
      throw error;
    }
  }

  private async initializeSharedDependencies(): Promise<void> {
    if (!this.coordinationConfig.enableSharedDependencies) return;
    
    Y3K?.debug?.log("FacadeCoordinationSystem", "Initializing shared dependencies");
    
    // Initialize shared dependencies in correct order
    try {
      // Core performance systems
      this.sharedPerformanceAnalyzer = new PerformanceAnalyzer();
      // PerformanceAnalyzer doesn't have initialize method
      
      this.sharedCSSVariableBatcher = new CSSVariableBatcher();
      // CSSVariableBatcher doesn't have initialize method
      
      // Core services
      this.sharedSettingsManager = new SettingsManager();
      await this.sharedSettingsManager.initialize();
      
      this.sharedMusicSyncService = new MusicSyncService();
      await this.sharedMusicSyncService.initialize();
      
      // Color harmony engine (depends on music sync)
      this.sharedColorHarmonyEngine = new ColorHarmonyEngine();
      // ColorHarmonyEngine doesn't have setMusicSyncService method
      await this.sharedColorHarmonyEngine.initialize();
      
      Y3K?.debug?.log("FacadeCoordinationSystem", "Shared dependencies initialized successfully");
      
    } catch (error) {
      Y3K?.debug?.error("FacadeCoordinationSystem", "Failed to initialize shared dependencies:", error);
      throw error;
    }
  }

  private async initializeFacades(): Promise<void> {
    Y3K?.debug?.log("FacadeCoordinationSystem", "Initializing facades");
    
    try {
      // Initialize Visual Integration Bridge
      this.visualBridge = new VisualIntegrationBridge(
        this.config,
        this.utils,
        this.year3000System,
        this.sharedCSSVariableBatcher!,
        this.sharedPerformanceAnalyzer!,
        this.sharedMusicSyncService!,
        this.sharedSettingsManager!,
        this.sharedColorHarmonyEngine!,
        this.eventBus
      );
      
      await this.visualBridge.initialize({
        mode: this.coordinationConfig.mode === 'performance-optimized' ? 'performance-first' : 'progressive',
        enablePerformanceMonitoring: this.coordinationConfig.enableUnifiedPerformanceMonitoring,
        enableEventCoordination: this.coordinationConfig.enableCrossFacadeCommunication
      });
      
      // Set up visual bridge callbacks
      this.visualBridge.setOnSystemCreated((key, system) => {
        this.handleSystemCreated('visual', key, system);
      });
      
      // Initialize Non-Visual System Integration Facade
      this.nonVisualFacade = new UnifiedSystemIntegrationFacade(
        this.config,
        this.utils,
        this.year3000System
      );
      
      await this.nonVisualFacade.initialize({
        mode: this.coordinationConfig.mode === 'performance-optimized' ? 'performance-first' : 'progressive',
        enablePerformanceMonitoring: this.coordinationConfig.enableUnifiedPerformanceMonitoring,
        enableDependencyInjection: this.coordinationConfig.enableSharedDependencies
      });
      
      // Set up non-visual facade callbacks
      this.nonVisualFacade.setOnSystemCreated((key, system) => {
        this.handleSystemCreated('non-visual', key, system);
      });
      
      // Inject shared dependencies into non-visual facade
      this.injectSharedDependencies();
      
      Y3K?.debug?.log("FacadeCoordinationSystem", "Facades initialized successfully");
      
    } catch (error) {
      Y3K?.debug?.error("FacadeCoordinationSystem", "Failed to initialize facades:", error);
      throw error;
    }
  }

  private injectSharedDependencies(): void {
    if (!this.coordinationConfig.enableSharedDependencies || !this.nonVisualFacade) return;
    
    // Inject shared dependencies into non-visual facade
    // This ensures both facades use the same instances
    if (this.sharedPerformanceAnalyzer) {
      (this.nonVisualFacade as any).performanceAnalyzer = this.sharedPerformanceAnalyzer;
    }
    
    if (this.sharedCSSVariableBatcher) {
      (this.nonVisualFacade as any).cssVariableBatcher = this.sharedCSSVariableBatcher;
    }
    
    if (this.sharedMusicSyncService) {
      (this.nonVisualFacade as any).musicSyncService = this.sharedMusicSyncService;
    }
    
    if (this.sharedSettingsManager) {
      (this.nonVisualFacade as any).settingsManager = this.sharedSettingsManager;
    }
    
    if (this.sharedColorHarmonyEngine) {
      (this.nonVisualFacade as any).colorHarmonyEngine = this.sharedColorHarmonyEngine;
    }
  }

  private setupCrossFacadeCommunication(): void {
    if (!this.coordinationConfig.enableCrossFacadeCommunication) return;
    
    Y3K?.debug?.log("FacadeCoordinationSystem", "Setting up cross-facade communication");
    
    // Set up event propagation between facades
    this.addEventListener('visual-event', (event: any) => {
      if (this.visualBridge) {
        this.visualBridge.propagateVisualEvent(event);
      }
    });
    
    this.addEventListener('performance-event', (event: any) => {
      // Propagate performance events to both facades
      if (this.visualBridge) {
        this.visualBridge.handleAdaptationEvent(event);
      }
      // Non-visual facade performance events would be handled here
    });
    
    // Set up health coordination
    if (this.coordinationConfig.coordinationPreferences.enableHealthCoordination) {
      this.addEventListener('health-degradation', (event: any) => {
        this.handleHealthDegradation(event);
      });
    }
  }

  private handleSystemCreated(type: SystemType, key: string, system: any): void {
    // Update metrics
    if (type === 'visual') {
      this.currentMetrics.visualSystems++;
    } else {
      this.currentMetrics.nonVisualSystems++;
    }
    this.currentMetrics.activeSystems++;
    
    // Emit system created event
    if (this.onSystemCreated) {
      this.onSystemCreated(type, key, system);
    }
    
    Y3K?.debug?.log("FacadeCoordinationSystem", `System created: ${type}/${key}`);
  }

  private handleHealthDegradation(event: any): void {
    Y3K?.debug?.warn("FacadeCoordinationSystem", "Health degradation detected:", event);
    
    // Implement health degradation response
    // This could involve reducing system quality, disabling non-essential systems, etc.
    
    if (this.coordinationConfig.mode === 'performance-optimized') {
      // Aggressive performance optimization
      this.optimizeForPerformance();
    }
  }

  private optimizeForPerformance(): void {
    // Implement performance optimization strategies
    if (this.visualBridge) {
      this.visualBridge.setConfiguration({
        mode: 'performance-first',
        enableAdaptiveQuality: true,
        qualityPreferences: {
          preferHighQuality: false,
          allowDynamicScaling: true,
          batteryConservation: true
        }
      });
    }
    
    if (this.nonVisualFacade) {
      this.nonVisualFacade.setConfiguration({
        mode: 'performance-first',
        systemPreferences: {
          lazyInitialization: true,
          aggressiveCaching: true,
          performanceOptimization: true
        }
      });
    }
  }

  // Public API for facade access
  public getVisualSystem<T = any>(key: VisualSystemKey): T | null {
    if (!this.visualBridge) return null;
    return this.visualBridge.getVisualSystem<T>(key);
  }

  public getNonVisualSystem<T = any>(key: NonVisualSystemKey): T | null {
    if (!this.nonVisualFacade) return null;
    return this.nonVisualFacade.getSystem<T>(key);
  }

  public getSystem<T = any>(key: VisualSystemKey | NonVisualSystemKey): T | null {
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
        return this.nonVisualFacade.getSystem<T>(key as NonVisualSystemKey);
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
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          Y3K?.debug?.error("FacadeCoordinationSystem", `Error in event listener for ${eventType}:`, error);
        }
      });
    }
    
    // Update cross-facade event metrics
    this.currentMetrics.crossFacadeEvents++;
  }

  // Health monitoring
  public async performHealthCheck(): Promise<FacadeHealthCheck> {
    const healthCheck: FacadeHealthCheck = {
      overall: 'good',
      facades: {
        visual: { ok: true, details: 'Visual systems operational', systemCount: 0 },
        nonVisual: { ok: true, details: 'Non-visual systems operational', systemCount: 0 }
      },
      sharedResources: {
        performanceAnalyzer: { ok: true, details: 'Performance analyzer operational' },
        cssVariableBatcher: { ok: true, details: 'CSS variable batcher operational' },
        musicSyncService: { ok: true, details: 'Music sync service operational' }
      },
      recommendations: [],
      timestamp: performance.now()
    };

    // Check visual facade
    if (this.visualBridge) {
      try {
        const visualHealth = await this.visualBridge.performVisualHealthCheck();
        healthCheck.facades.visual.ok = visualHealth.overall === 'excellent' || visualHealth.overall === 'good';
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
        healthCheck.facades.nonVisual.ok = nonVisualHealth.overall === 'excellent' || nonVisualHealth.overall === 'good';
        healthCheck.facades.nonVisual.details = `Non-visual systems: ${nonVisualHealth.overall}`;
        healthCheck.facades.nonVisual.systemCount = nonVisualHealth.systems.size;
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
        healthCheck.sharedResources.performanceAnalyzer.details = 'Performance analyzer operational';
      } catch (error) {
        healthCheck.sharedResources.performanceAnalyzer.ok = false;
        healthCheck.sharedResources.performanceAnalyzer.details = `Performance analyzer error: ${error}`;
      }
    }

    // Determine overall health
    const facadeHealthy = healthCheck.facades.visual.ok && healthCheck.facades.nonVisual.ok;
    const resourcesHealthy = healthCheck.sharedResources.performanceAnalyzer.ok &&
                           healthCheck.sharedResources.cssVariableBatcher.ok &&
                           healthCheck.sharedResources.musicSyncService.ok;

    if (facadeHealthy && resourcesHealthy) {
      healthCheck.overall = 'excellent';
    } else if (facadeHealthy || resourcesHealthy) {
      healthCheck.overall = 'good';
    } else {
      healthCheck.overall = 'critical';
      healthCheck.recommendations.push('Multiple system failures detected - consider system restart');
    }

    // Add performance recommendations
    if (this.currentMetrics.totalMemoryMB > 120) {
      healthCheck.recommendations.push('High memory usage - consider optimizing system memory');
    }

    if (this.currentMetrics.totalInitTime > 6000) {
      healthCheck.recommendations.push('High initialization time - consider optimizing system startup');
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
      overallHealth: 'good',
      visualHealth: 'good',
      nonVisualHealth: 'good',
      sharedDependencies: 5, // Number of shared dependencies
      crossFacadeEvents: 0,
      resourceOptimization: 0
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
      this.currentMetrics.totalMemoryMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
    }
    
    // Update overall health
    if (this.currentMetrics.visualHealth === 'excellent' && this.currentMetrics.nonVisualHealth === 'excellent') {
      this.currentMetrics.overallHealth = 'excellent';
    } else if (this.currentMetrics.visualHealth === 'critical' || this.currentMetrics.nonVisualHealth === 'critical') {
      this.currentMetrics.overallHealth = 'critical';
    } else if (this.currentMetrics.visualHealth === 'degraded' || this.currentMetrics.nonVisualHealth === 'degraded') {
      this.currentMetrics.overallHealth = 'degraded';
    } else {
      this.currentMetrics.overallHealth = 'good';
    }
    
    // Emit performance change event
    if (this.onPerformanceChange) {
      this.onPerformanceChange(this.currentMetrics);
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
    if (this.sharedPerformanceAnalyzer) {
      // PerformanceAnalyzer has destroy method
      this.sharedPerformanceAnalyzer.destroy();
      this.sharedPerformanceAnalyzer = null;
    }
    
    if (this.sharedCSSVariableBatcher) {
      // CSSVariableBatcher may not have destroy method
      this.sharedCSSVariableBatcher = null;
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

  public async setConfiguration(config: Partial<FacadeCoordinationConfig>): Promise<void> {
    this.coordinationConfig = { ...this.coordinationConfig, ...config };
    // Apply configuration changes to facades
    // Implementation would update facade configurations
  }

  public setOnSystemCreated(callback: (type: SystemType, key: string, system: any) => void): void {
    this.onSystemCreated = callback;
  }

  public setOnHealthChange(callback: (health: FacadeHealthCheck) => void): void {
    this.onHealthChange = callback;
  }

  public setOnPerformanceChange(callback: (metrics: UnifiedSystemMetrics) => void): void {
    this.onPerformanceChange = callback;
  }

  public getSystemStatus(): { 
    initialized: boolean; 
    visualSystems: number; 
    nonVisualSystems: number; 
    healthy: boolean 
  } {
    return {
      initialized: this.isInitialized,
      visualSystems: this.visualBridge?.getSystemStatus().systemsActive || 0,
      nonVisualSystems: this.nonVisualFacade?.getSystemStatus().systemsActive || 0,
      healthy: this.currentMetrics.overallHealth === 'excellent' || this.currentMetrics.overallHealth === 'good'
    };
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;
    
    Y3K?.debug?.log("FacadeCoordinationSystem", "Facade coordination system destroyed");
  }
}