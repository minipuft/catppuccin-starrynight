/**
 * RealityBleedingGradientOrchestrator - Master System Integration
 * Part of the Year 3000 System visual pipeline
 * 
 * Orchestrates all Reality Bleeding Gradients components:
 * - FlowingLiquidConsciousnessSystem
 * - GradientDirectionalFlowSystem
 * - IridescentShimmerEffectsSystem
 * - DepthLayeredGradientSystem
 * - RealityBleedingPerformanceOptimizer
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { GradientDirectionalFlowSystem } from "@/audio/GradientDirectionalFlowSystem";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { RealityBleedingPerformanceOptimizer } from "@/core/performance/RealityBleedingPerformanceOptimizer";
import { Y3K } from "@/debug/SystemHealthMonitor";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import { DepthLayeredGradientSystem } from "../backgrounds/DepthLayeredGradientSystem";
import { FlowingLiquidConsciousnessSystem } from "../backgrounds/FlowingLiquidConsciousnessSystem";
import { IridescentShimmerEffectsSystem } from "../ui-effects/IridescentShimmerEffectsSystem";

interface RealityBleedingState {
  liquidConsciousness: boolean;
  directionalFlow: boolean;
  shimmerEffects: boolean;
  depthLayers: boolean;
  performanceOptimization: boolean;
}

interface SystemHealth {
  liquidConsciousness: { ok: boolean; details: string };
  directionalFlow: { ok: boolean; details: string };
  shimmerEffects: { ok: boolean; details: string };
  depthLayers: { ok: boolean; details: string };
  performanceOptimization: { ok: boolean; details: string };
}

interface RealityBleedingMetrics {
  totalSystemsActive: number;
  performanceScore: number;
  memoryUsage: number;
  renderTime: number;
  effectsQuality: string;
  musicSyncStrength: number;
  // Base system metrics
  initializationTime: number;
  updates: number;
  errors: number;
}

/**
 * RealityBleedingGradientOrchestrator manages all Reality Bleeding Gradients systems
 * - Coordinates initialization and lifecycle
 * - Manages system interactions and dependencies
 * - Handles performance optimization across all systems
 * - Provides unified health monitoring and metrics
 */
export class RealityBleedingGradientOrchestrator extends BaseVisualSystem {
  private liquidConsciousnessSystem: FlowingLiquidConsciousnessSystem | null = null;
  private directionalFlowSystem: GradientDirectionalFlowSystem | null = null;
  private shimmerEffectsSystem: IridescentShimmerEffectsSystem | null = null;
  private depthLayeredSystem: DepthLayeredGradientSystem | null = null;
  private performanceOptimizer: RealityBleedingPerformanceOptimizer | null = null;
  
  private cssVariableBatcher: CSSVariableBatcher;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private realityBleedingState: RealityBleedingState;
  private systemHealth: SystemHealth;
  protected override metrics: RealityBleedingMetrics;
  
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;
  private lastPerformanceUpdate = 0;
  
  private boundPerformanceHandler: ((event: Event) => void) | null = null;
  private boundMusicSyncHandler: ((event: Event) => void) | null = null;
  private boundColorHarmonyHandler: ((event: Event) => void) | null = null;
  
  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;
    this.cssVariableBatcher = new CSSVariableBatcher();
    
    // Initialize state
    this.realityBleedingState = {
      liquidConsciousness: true,
      directionalFlow: true,
      shimmerEffects: true,
      depthLayers: true,
      performanceOptimization: true
    };
    
    // Initialize health tracking
    this.systemHealth = {
      liquidConsciousness: { ok: false, details: "Not initialized" },
      directionalFlow: { ok: false, details: "Not initialized" },
      shimmerEffects: { ok: false, details: "Not initialized" },
      depthLayers: { ok: false, details: "Not initialized" },
      performanceOptimization: { ok: false, details: "Not initialized" }
    };
    
    // Initialize metrics
    this.metrics = {
      totalSystemsActive: 0,
      performanceScore: 0,
      memoryUsage: 0,
      renderTime: 0,
      effectsQuality: "medium",
      musicSyncStrength: 0,
      // Base system metrics
      initializationTime: 0,
      updates: 0,
      errors: 0
    };
    
    // Bind event handlers
    this.boundPerformanceHandler = this.handlePerformanceChange.bind(this);
    this.boundMusicSyncHandler = this.handleMusicSync.bind(this);
    this.boundColorHarmonyHandler = this.handleColorHarmony.bind(this);
  }
  
  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    try {
      // Initialize performance optimizer first
      await this.initializePerformanceOptimizer();
      
      // Initialize core systems
      await this.initializeLiquidConsciousness();
      await this.initializeDirectionalFlow();
      await this.initializeShimmerEffects();
      await this.initializeDepthLayers();
      
      // Setup system interactions
      this.setupSystemInteractions();
      
      // Start monitoring
      this.startHealthMonitoring();
      this.startMetricsUpdates();
      
      // Setup event listeners
      this.setupEventListeners();
      
      Y3K?.debug?.log("RealityBleedingGradientOrchestrator", "Reality Bleeding Gradients orchestrator initialized successfully");
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize Reality Bleeding Gradients:", error);
      throw error;
    }
  }
  
  private async initializePerformanceOptimizer(): Promise<void> {
    if (!this.realityBleedingState.performanceOptimization) return;
    
    try {
      this.performanceOptimizer = new RealityBleedingPerformanceOptimizer(
        this.config,
        this.performanceMonitor
      );
      
      // Register for performance callbacks
      this.performanceOptimizer.registerOptimizationCallback(
        'reality-bleeding-orchestrator',
        this.handlePerformanceOptimization.bind(this)
      );
      
      this.systemHealth.performanceOptimization = { ok: true, details: "Performance optimizer active" };
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize performance optimizer:", error);
      this.systemHealth.performanceOptimization = { ok: false, details: `Error: ${error}` };
    }
  }
  
  private async initializeLiquidConsciousness(): Promise<void> {
    if (!this.realityBleedingState.liquidConsciousness) return;
    
    try {
      this.liquidConsciousnessSystem = new FlowingLiquidConsciousnessSystem(
        this.config,
        this.utils,
        this.performanceMonitor,
        this.musicSyncService,
        this.settingsManager,
        { colorHarmonyEngine: this.colorHarmonyEngine }
      );
      
      await this.liquidConsciousnessSystem.initialize();
      this.systemHealth.liquidConsciousness = await this.liquidConsciousnessSystem.healthCheck();
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize liquid consciousness:", error);
      this.systemHealth.liquidConsciousness = { ok: false, details: `Error: ${error}` };
    }
  }
  
  private async initializeDirectionalFlow(): Promise<void> {
    if (!this.realityBleedingState.directionalFlow) return;
    
    try {
      this.directionalFlowSystem = new GradientDirectionalFlowSystem(
        this.config,
        this.utils,
        this.performanceMonitor,
        this.musicSyncService,
        this.settingsManager
      );
      
      await this.directionalFlowSystem.initialize();
      this.systemHealth.directionalFlow = await this.directionalFlowSystem.healthCheck();
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize directional flow:", error);
      this.systemHealth.directionalFlow = { ok: false, details: `Error: ${error}` };
    }
  }
  
  private async initializeShimmerEffects(): Promise<void> {
    if (!this.realityBleedingState.shimmerEffects) return;
    
    try {
      this.shimmerEffectsSystem = new IridescentShimmerEffectsSystem(
        this.config,
        this.utils,
        this.performanceMonitor,
        this.settingsManager
      );
      
      await this.shimmerEffectsSystem.initialize();
      this.systemHealth.shimmerEffects = await this.shimmerEffectsSystem.healthCheck();
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize shimmer effects:", error);
      this.systemHealth.shimmerEffects = { ok: false, details: `Error: ${error}` };
    }
  }
  
  private async initializeDepthLayers(): Promise<void> {
    if (!this.realityBleedingState.depthLayers) return;
    
    try {
      this.depthLayeredSystem = new DepthLayeredGradientSystem(
        this.config,
        this.utils,
        this.performanceMonitor,
        this.musicSyncService,
        this.settingsManager,
        { colorHarmonyEngine: this.colorHarmonyEngine }
      );
      
      await this.depthLayeredSystem.initialize();
      this.systemHealth.depthLayers = await this.depthLayeredSystem.healthCheck();
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Failed to initialize depth layers:", error);
      this.systemHealth.depthLayers = { ok: false, details: `Error: ${error}` };
    }
  }
  
  private setupSystemInteractions(): void {
    // Connect directional flow to liquid consciousness
    if (this.directionalFlowSystem && this.liquidConsciousnessSystem) {
      document.addEventListener('gradient-flow:direction-changed', (event) => {
        const customEvent = event as CustomEvent;
        const { flowDirection, intensity } = customEvent.detail;
        
        this.liquidConsciousnessSystem?.setFlowDirection(flowDirection.x, flowDirection.y);
        this.liquidConsciousnessSystem?.setBreathingIntensity(intensity);
      });
    }
    
    // Connect performance optimizer to all systems
    if (this.performanceOptimizer) {
      this.performanceOptimizer.registerOptimizationCallback('liquid-consciousness', (quality) => {
        this.liquidConsciousnessSystem?.setBreathingIntensity(quality.animationSpeed);
      });
      
      this.performanceOptimizer.registerOptimizationCallback('shimmer-effects', (quality) => {
        this.shimmerEffectsSystem?.setShimmerEnabled(quality.shimmerEffects);
      });
      
      this.performanceOptimizer.registerOptimizationCallback('depth-layers', (quality) => {
        this.depthLayeredSystem?.setDepthEnabled(quality.depthLayers > 0);
      });
    }
  }
  
  private setupEventListeners(): void {
    if (this.boundPerformanceHandler) {
      document.addEventListener('performance:quality-changed', this.boundPerformanceHandler);
    }
    
    if (this.boundMusicSyncHandler) {
      document.addEventListener('music-sync:beat', this.boundMusicSyncHandler);
      document.addEventListener('music-sync:energy-changed', this.boundMusicSyncHandler);
    }
    
    if (this.boundColorHarmonyHandler) {
      document.addEventListener('color-harmony:gradient-changed', this.boundColorHarmonyHandler);
    }
  }
  
  private handlePerformanceChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { qualitySettings, metrics } = customEvent.detail;
    
    // Update internal metrics
    this.metrics.performanceScore = this.calculatePerformanceScore(metrics);
    this.metrics.effectsQuality = qualitySettings.level;
    
    // Update CSS variables
    this.updatePerformanceVariables();
    
    Y3K?.debug?.log("RealityBleedingGradientOrchestrator", `Performance adjusted: ${qualitySettings.level}`);
  }
  
  private handleMusicSync(event: Event): void {
    const customEvent = event as CustomEvent;
    const { type, detail } = customEvent;
    
    switch (type) {
      case 'music-sync:beat':
        this.metrics.musicSyncStrength = detail.intensity || 0;
        break;
        
      case 'music-sync:energy-changed':
        // Coordinate energy changes across all systems
        this.coordinateEnergyChange(detail.energy || 0);
        break;
    }
  }
  
  private handleColorHarmony(event: Event): void {
    // Color harmony changes affect all visual systems
    this.forceRepaintAllSystems();
  }
  
  private handlePerformanceOptimization(qualitySettings: any): void {
    // Apply performance optimizations to all systems
    this.applyQualitySettings(qualitySettings);
  }
  
  private coordinateEnergyChange(energy: number): void {
    // Coordinate energy changes across all systems
    this.liquidConsciousnessSystem?.setBreathingIntensity(0.5 + energy * 0.5);
    this.depthLayeredSystem?.setParallaxStrength(0.3 + energy * 0.5);
    
    // Update shimmer intensity based on energy
    if (this.shimmerEffectsSystem) {
      const shimmerIntensity = energy > 0.7 ? "intense" : energy > 0.3 ? "balanced" : "minimal";
      this.shimmerEffectsSystem.setShimmerIntensity(shimmerIntensity);
    }
  }
  
  private applyQualitySettings(qualitySettings: any): void {
    // Apply quality settings to all systems
    if (this.liquidConsciousnessSystem) {
      this.liquidConsciousnessSystem.setBreathingIntensity(qualitySettings.animationSpeed);
    }
    
    if (this.shimmerEffectsSystem) {
      this.shimmerEffectsSystem.setShimmerEnabled(qualitySettings.shimmerEffects);
    }
    
    if (this.depthLayeredSystem) {
      this.depthLayeredSystem.setDepthEnabled(qualitySettings.depthLayers > 0);
    }
  }
  
  private forceRepaintAllSystems(): void {
    this.liquidConsciousnessSystem?.forceRepaint("color-harmony-change");
    this.depthLayeredSystem?.forceRepaint("color-harmony-change");
  }
  
  private startHealthMonitoring(): void {
    this.healthCheckInterval = window.setInterval(async () => {
      await this.updateSystemHealth();
    }, 10000); // Check every 10 seconds
  }
  
  private startMetricsUpdates(): void {
    this.metricsUpdateInterval = window.setInterval(() => {
      this.updateMetrics();
    }, 2000); // Update every 2 seconds
  }
  
  private async updateSystemHealth(): Promise<void> {
    try {
      if (this.liquidConsciousnessSystem) {
        this.systemHealth.liquidConsciousness = await this.liquidConsciousnessSystem.healthCheck();
      }
      
      if (this.directionalFlowSystem) {
        this.systemHealth.directionalFlow = await this.directionalFlowSystem.healthCheck();
      }
      
      if (this.shimmerEffectsSystem) {
        this.systemHealth.shimmerEffects = await this.shimmerEffectsSystem.healthCheck();
      }
      
      if (this.depthLayeredSystem) {
        this.systemHealth.depthLayers = await this.depthLayeredSystem.healthCheck();
      }
      
      if (this.performanceOptimizer) {
        const metrics = this.performanceOptimizer.getPerformanceMetrics();
        this.systemHealth.performanceOptimization = {
          ok: this.performanceOptimizer.isPerformanceOptimal(),
          details: `FPS: ${metrics.fps.toFixed(1)}, Memory: ${metrics.memoryUsage.toFixed(1)}MB`
        };
      }
      
    } catch (error) {
      Y3K?.debug?.error("RealityBleedingGradientOrchestrator", "Error updating system health:", error);
    }
  }
  
  private updateMetrics(): void {
    // Count active systems
    this.metrics.totalSystemsActive = Object.values(this.systemHealth).filter(h => h.ok).length;
    
    // Update performance metrics
    if (this.performanceOptimizer) {
      const perfMetrics = this.performanceOptimizer.getPerformanceMetrics();
      this.metrics.performanceScore = this.calculatePerformanceScore(perfMetrics);
      this.metrics.memoryUsage = perfMetrics.memoryUsage;
      this.metrics.renderTime = perfMetrics.renderTime;
    }
    
    // Update CSS variables
    this.updateMetricsVariables();
  }
  
  private calculatePerformanceScore(metrics: any): number {
    const fpsScore = Math.min(metrics.fps / 60, 1);
    const memoryScore = Math.max(1 - (metrics.memoryUsage / 100), 0);
    const renderScore = Math.max(1 - (metrics.renderTime / 33), 0);
    
    return Math.round((fpsScore + memoryScore + renderScore) * 100 / 3);
  }
  
  private updatePerformanceVariables(): void {
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-performance-score',
      this.metrics.performanceScore.toString()
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-quality',
      this.metrics.effectsQuality
    );
  }
  
  private updateMetricsVariables(): void {
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-systems-active',
      this.metrics.totalSystemsActive.toString()
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-memory-usage',
      this.metrics.memoryUsage.toFixed(1)
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-render-time',
      this.metrics.renderTime.toFixed(1)
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-reality-bleeding-music-sync',
      this.metrics.musicSyncStrength.toFixed(2)
    );
  }
  
  public override updateAnimation(deltaTime: number): void {
    // Update all active systems
    this.liquidConsciousnessSystem?.updateAnimation(deltaTime);
    this.directionalFlowSystem?.updateAnimation(deltaTime);
    this.shimmerEffectsSystem?.updateAnimation(deltaTime);
    this.depthLayeredSystem?.updateAnimation(deltaTime);
  }
  
  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    const healthySystems = Object.values(this.systemHealth).filter(h => h.ok).length;
    const totalSystems = Object.values(this.systemHealth).length;
    
    return {
      ok: healthySystems >= totalSystems * 0.6, // At least 60% systems healthy
      details: `${healthySystems}/${totalSystems} systems healthy`
    };
  }
  
  public override forceRepaint(reason: string = "orchestrator-update"): void {
    this.forceRepaintAllSystems();
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Stop monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    if (this.metricsUpdateInterval) {
      clearInterval(this.metricsUpdateInterval);
      this.metricsUpdateInterval = null;
    }
    
    // Remove event listeners
    if (this.boundPerformanceHandler) {
      document.removeEventListener('performance:quality-changed', this.boundPerformanceHandler);
    }
    
    if (this.boundMusicSyncHandler) {
      document.removeEventListener('music-sync:beat', this.boundMusicSyncHandler);
      document.removeEventListener('music-sync:energy-changed', this.boundMusicSyncHandler);
    }
    
    if (this.boundColorHarmonyHandler) {
      document.removeEventListener('color-harmony:gradient-changed', this.boundColorHarmonyHandler);
    }
    
    // Cleanup systems
    this.liquidConsciousnessSystem?.destroy();
    this.directionalFlowSystem?.destroy();
    this.shimmerEffectsSystem?.destroy();
    this.depthLayeredSystem?.destroy();
    this.performanceOptimizer?.destroy();
    
    // Clear references
    this.liquidConsciousnessSystem = null;
    this.directionalFlowSystem = null;
    this.shimmerEffectsSystem = null;
    this.depthLayeredSystem = null;
    this.performanceOptimizer = null;
    
    // Clear bound handlers
    this.boundPerformanceHandler = null;
    this.boundMusicSyncHandler = null;
    this.boundColorHarmonyHandler = null;
  }
  
  // Public API
  public setSystemEnabled(system: keyof RealityBleedingState, enabled: boolean): void {
    this.realityBleedingState[system] = enabled;
    
    switch (system) {
      case "liquidConsciousness":
        if (enabled && !this.liquidConsciousnessSystem) {
          this.initializeLiquidConsciousness();
        } else if (!enabled && this.liquidConsciousnessSystem) {
          this.liquidConsciousnessSystem.destroy();
          this.liquidConsciousnessSystem = null;
        }
        break;
        
      case "shimmerEffects":
        if (this.shimmerEffectsSystem) {
          this.shimmerEffectsSystem.setShimmerEnabled(enabled);
        }
        break;
        
      case "depthLayers":
        if (this.depthLayeredSystem) {
          this.depthLayeredSystem.setDepthEnabled(enabled);
        }
        break;
    }
  }
  
  public getRealityBleedingState(): RealityBleedingState {
    return { ...this.realityBleedingState };
  }
  
  public getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }
  
  public getMetrics(): RealityBleedingMetrics {
    return { ...this.metrics };
  }
  
  public getPerformanceMetrics(): any {
    return this.performanceOptimizer?.getPerformanceMetrics() || {};
  }
  
  public forceQualityLevel(level: "ultra-low" | "low" | "medium" | "high" | "ultra-high"): void {
    this.performanceOptimizer?.forceQualityLevel(level);
  }
  
  public enableEmergencyMode(): void {
    this.performanceOptimizer?.enableEmergencyMode();
  }
  
  public restoreDefaults(): void {
    this.performanceOptimizer?.restoreDefaults();
  }
}