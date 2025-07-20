/**
 * Year3000IntegrationBridge - PHASE 6 Final Integration System
 * The Ultimate Coordinator for the Year 3000 Gradient Consciousness
 *
 * This is the master orchestrator that brings together all systems:
 * - FluxConsciousnessLayers (CSS gradients with emotional/genre intelligence)
 * - WebGLGradientBackgroundSystem (High-performance WebGL rendering)
 * - GradientTransitionOrchestrator (Seamless CSS ↔ WebGL transitions)
 * - AdaptivePerformanceSystem (Hardware detection and quality scaling)
 * - ColorHarmonyEngine (Musical color intelligence)
 * - EmotionalGradientMapper (Mood-responsive visuals)
 * - GenreGradientEvolution (Music style adaptation)
 *
 * Features:
 * - Unified lifecycle management for all visual systems
 * - Intelligent backend selection and seamless transitions
 * - Real-time performance monitoring and adaptive quality scaling
 * - State synchronization between all gradient systems
 * - Progressive enhancement with graceful degradation
 * - Comprehensive health monitoring and auto-recovery
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";

// System imports
import { FluxConsciousnessLayers } from "@/visual/backgrounds/FluxConsciousnessLayers";
import { WebGLGradientBackgroundSystem } from "@/visual/backgrounds/WebGLGradientBackgroundSystem";
import { GradientTransitionOrchestrator, GradientBackend } from "./GradientTransitionOrchestrator";
import { AdaptivePerformanceSystem, AdaptationEvent, QualitySettings } from "@/core/performance/AdaptivePerformanceSystem";

export type IntegrationMode = "progressive" | "performance-first" | "quality-first" | "battery-optimized";
export type SystemHealth = "excellent" | "good" | "degraded" | "critical";

export interface IntegrationConfig {
  mode: IntegrationMode;
  enableWebGL: boolean;
  enablePerformanceMonitoring: boolean;
  enableAdaptiveQuality: boolean;
  enableSeamlessTransitions: boolean;
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

export interface SystemMetrics {
  // Performance metrics
  currentFPS: number;
  averageFPS: number;
  frameTime: number;
  memoryUsageMB: number;
  cpuUsagePercent: number;
  gpuUsagePercent: number;
  
  // System state
  activeBackend: GradientBackend;
  currentQuality: QualitySettings;
  systemHealth: SystemHealth;
  
  // Feature status
  webglAvailable: boolean;
  webglActive: boolean;
  adaptiveScaling: boolean;
  performanceMonitoring: boolean;
  
  // Musical intelligence
  emotionalState: any;
  currentGenre: string;
  musicSyncActive: boolean;
  
  // Visual state
  consciousnessLevel: number;
  gradientComplexity: number;
  layerCount: number;
}

export interface HealthCheckResult {
  overall: SystemHealth;
  systems: {
    fluxConsciousness: { ok: boolean; details: string };
    webglSystem: { ok: boolean; details: string };
    performanceMonitor: { ok: boolean; details: string };
    musicSync: { ok: boolean; details: string };
    transitionOrchestrator: { ok: boolean; details: string };
  };
  recommendations: string[];
  timestamp: number;
}

export class Year3000IntegrationBridge {
  // Core systems
  private cssVariableBatcher: CSSVariableBatcher;
  private performanceAnalyzer: PerformanceAnalyzer;
  private deviceDetector: DeviceCapabilityDetector;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;

  // Visual systems
  private fluxConsciousnessLayers: FluxConsciousnessLayers | null = null;
  private webglBackgroundSystem: WebGLGradientBackgroundSystem | null = null;
  
  // Integration systems
  private transitionOrchestrator: GradientTransitionOrchestrator | null = null;
  private adaptivePerformanceSystem: AdaptivePerformanceSystem | null = null;

  // State management
  private isInitialized = false;
  private isActive = false;
  private config: IntegrationConfig;
  private currentMetrics: SystemMetrics;
  private lastHealthCheck: HealthCheckResult | null = null;

  // Monitoring and events
  private healthCheckInterval: number | null = null;
  private metricsUpdateInterval: number | null = null;
  private boundAdaptationHandler: ((event: AdaptationEvent) => void) | null = null;
  private boundSettingsHandler: ((event: Event) => void) | null = null;

  // Event callbacks
  private onSystemAdaptation: ((metrics: SystemMetrics) => void) | null = null;
  private onHealthChange: ((health: HealthCheckResult) => void) | null = null;
  private onBackendSwitch: ((oldBackend: GradientBackend, newBackend: GradientBackend) => void) | null = null;

  constructor(
    cssVariableBatcher: CSSVariableBatcher,
    performanceAnalyzer: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    colorHarmonyEngine: ColorHarmonyEngine | null = null
  ) {
    this.cssVariableBatcher = cssVariableBatcher;
    this.performanceAnalyzer = performanceAnalyzer;
    this.musicSyncService = musicSyncService;
    this.settingsManager = settingsManager;
    this.colorHarmonyEngine = colorHarmonyEngine;

    this.deviceDetector = new DeviceCapabilityDetector();

    // Default configuration
    this.config = {
      mode: "progressive",
      enableWebGL: true,
      enablePerformanceMonitoring: true,
      enableAdaptiveQuality: true,
      enableSeamlessTransitions: true,
      performanceThresholds: {
        minFPS: 45,
        maxMemoryMB: 50,
        thermalLimit: 70
      },
      qualityPreferences: {
        preferHighQuality: true,
        allowDynamicScaling: true,
        batteryConservation: false
      }
    };

    // Initialize metrics
    this.currentMetrics = this.createInitialMetrics();

    // Bind event handlers
    this.boundAdaptationHandler = this.handleAdaptationEvent.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);

    Y3K?.debug?.log("Year3000IntegrationBridge", "Integration bridge initialized");
  }

  public async initialize(
    fluxConsciousnessLayers: FluxConsciousnessLayers,
    webglBackgroundSystem?: WebGLGradientBackgroundSystem,
    config?: Partial<IntegrationConfig>
  ): Promise<void> {
    if (this.isInitialized) {
      Y3K?.debug?.warn("Year3000IntegrationBridge", "Already initialized");
      return;
    }

    try {
      // Update configuration
      this.config = { ...this.config, ...config };

      // Store system references
      this.fluxConsciousnessLayers = fluxConsciousnessLayers;
      this.webglBackgroundSystem = webglBackgroundSystem || null;

      // Initialize adaptive performance system
      if (this.config.enablePerformanceMonitoring) {
        this.adaptivePerformanceSystem = new AdaptivePerformanceSystem(
          this.deviceDetector,
          this.performanceAnalyzer
        );
        await this.adaptivePerformanceSystem.initialize();
        this.adaptivePerformanceSystem.addEventListener(this.boundAdaptationHandler!);
      }

      // Initialize transition orchestrator
      if (this.config.enableSeamlessTransitions) {
        this.transitionOrchestrator = new GradientTransitionOrchestrator(
          this.cssVariableBatcher,
          this.performanceAnalyzer,
          this.musicSyncService,
          this.settingsManager,
          this.colorHarmonyEngine
        );
        await this.transitionOrchestrator.initialize(
          this.fluxConsciousnessLayers,
          this.webglBackgroundSystem || undefined
        );
      }

      // Apply initial configuration
      await this.applyConfiguration();

      // Subscribe to events
      this.subscribeToEvents();

      // Start monitoring
      this.startMonitoring();

      // Perform initial health check
      await this.performHealthCheck();

      this.isInitialized = true;
      this.isActive = true;

      // Update CSS to indicate integration is active
      this.cssVariableBatcher.setProperty("--sn-integration-active", "1");
      this.cssVariableBatcher.setProperty("--sn-integration-mode", this.config.mode);

      Y3K?.debug?.log("Year3000IntegrationBridge", "Integration bridge fully initialized", {
        mode: this.config.mode,
        webglEnabled: this.config.enableWebGL,
        performanceMonitoring: this.config.enablePerformanceMonitoring
      });

    } catch (error) {
      Y3K?.debug?.error("Year3000IntegrationBridge", "Initialization failed:", error);
      
      // Cleanup on failure
      await this.cleanup();
      throw error;
    }
  }

  private createInitialMetrics(): SystemMetrics {
    return {
      currentFPS: 0,
      averageFPS: 0,
      frameTime: 0,
      memoryUsageMB: 0,
      cpuUsagePercent: 0,
      gpuUsagePercent: 0,
      activeBackend: "css",
      currentQuality: {
        gradientComplexity: 0.6,
        particleDensity: 0.6,
        shaderPrecision: "mediump",
        textureResolution: 1.0,
        animationFPS: 60,
        transitionQuality: "smooth",
        motionBlur: false,
        bloomEnabled: true,
        shadowQuality: "medium",
        antiAliasing: "fxaa",
        postProcessing: true
      },
      systemHealth: "good",
      webglAvailable: false,
      webglActive: false,
      adaptiveScaling: true,
      performanceMonitoring: true,
      emotionalState: null,
      currentGenre: "unknown",
      musicSyncActive: false,
      consciousnessLevel: 0.7,
      gradientComplexity: 0.6,
      layerCount: 5
    };
  }

  private async applyConfiguration(): Promise<void> {
    // Configure adaptive performance system
    if (this.adaptivePerformanceSystem) {
      const profile = this.adaptivePerformanceSystem.getCurrentProfile();
      profile.targetFPS = this.config.performanceThresholds.minFPS;
      profile.memoryBudgetMB = this.config.performanceThresholds.maxMemoryMB;
      profile.thermalLimit = this.config.performanceThresholds.thermalLimit;
      profile.adaptiveScaling = this.config.enableAdaptiveQuality;
      
      this.adaptivePerformanceSystem.setProfile(profile);
    }

    // Configure transition orchestrator
    if (this.transitionOrchestrator) {
      this.transitionOrchestrator.setPerformanceThresholds({
        minFPS: this.config.performanceThresholds.minFPS,
        maxMemoryMB: this.config.performanceThresholds.maxMemoryMB,
        maxCPUPercent: 15,
        maxGPUPercent: 30,
        stabilityWindow: 5000
      });

      // Set transition mode based on configuration
      const transitionMode = this.config.mode === "performance-first" ? "instant" :
                           this.config.mode === "quality-first" ? "progressive" : "crossfade";
      
      this.transitionOrchestrator.setTransitionConfig({
        mode: transitionMode,
        duration: 800,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        preserveState: true,
        fallbackDelay: 2000
      });
    }

    // Apply mode-specific optimizations
    switch (this.config.mode) {
      case "performance-first":
        await this.applyPerformanceFirstMode();
        break;
      case "quality-first":
        await this.applyQualityFirstMode();
        break;
      case "battery-optimized":
        await this.applyBatteryOptimizedMode();
        break;
      case "progressive":
      default:
        await this.applyProgressiveMode();
        break;
    }
  }

  private async applyPerformanceFirstMode(): Promise<void> {
    // Prioritize performance over visual quality
    if (this.adaptivePerformanceSystem) {
      const quality = this.adaptivePerformanceSystem.getCurrentQuality();
      quality.gradientComplexity = Math.min(0.5, quality.gradientComplexity);
      quality.particleDensity = Math.min(0.4, quality.particleDensity);
      quality.postProcessing = false;
      quality.antiAliasing = "none";
      this.adaptivePerformanceSystem.setQuality(quality);
    }

    this.cssVariableBatcher.setProperty("--sn-performance-mode", "1");
  }

  private async applyQualityFirstMode(): Promise<void> {
    // Prioritize visual quality, assume high-end hardware
    if (this.adaptivePerformanceSystem) {
      const quality = this.adaptivePerformanceSystem.getCurrentQuality();
      quality.gradientComplexity = 1.0;
      quality.particleDensity = 1.0;
      quality.postProcessing = true;
      quality.bloomEnabled = true;
      quality.antiAliasing = "msaa4x";
      quality.shadowQuality = "high";
      this.adaptivePerformanceSystem.setQuality(quality);
    }

    this.cssVariableBatcher.setProperty("--sn-quality-mode", "1");
  }

  private async applyBatteryOptimizedMode(): Promise<void> {
    // Minimal resource usage for battery conservation
    if (this.adaptivePerformanceSystem) {
      const quality = this.adaptivePerformanceSystem.getCurrentQuality();
      quality.gradientComplexity = 0.3;
      quality.particleDensity = 0.2;
      quality.animationFPS = 24;
      quality.postProcessing = false;
      quality.bloomEnabled = false;
      quality.antiAliasing = "none";
      quality.shadowQuality = "off";
      this.adaptivePerformanceSystem.setQuality(quality);
    }

    // Force CSS backend for battery conservation
    if (this.transitionOrchestrator) {
      await this.transitionOrchestrator.forceBackend("css");
    }

    this.cssVariableBatcher.setProperty("--sn-battery-mode", "1");
  }

  private async applyProgressiveMode(): Promise<void> {
    // Balanced approach with intelligent adaptation
    // Let the adaptive performance system determine optimal settings
    this.cssVariableBatcher.setProperty("--sn-progressive-mode", "1");
  }

  private subscribeToEvents(): void {
    if (this.settingsManager && this.boundSettingsHandler) {
      document.addEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }

    // Listen for WebGL context loss
    document.addEventListener("webglcontextlost", this.handleWebGLContextLoss.bind(this));
    document.addEventListener("webglcontextrestored", this.handleWebGLContextRestored.bind(this));
  }

  private startMonitoring(): void {
    // Start health monitoring
    this.healthCheckInterval = window.setInterval(async () => {
      await this.performHealthCheck();
    }, 10000); // Every 10 seconds

    // Start metrics updates
    this.metricsUpdateInterval = window.setInterval(() => {
      this.updateMetrics();
    }, 1000); // Every second
  }

  private async performHealthCheck(): Promise<HealthCheckResult> {
    const healthCheck: HealthCheckResult = {
      overall: "good",
      systems: {
        fluxConsciousness: { ok: true, details: "CSS gradient system operational" },
        webglSystem: { ok: true, details: "WebGL system operational" },
        performanceMonitor: { ok: true, details: "Performance monitoring active" },
        musicSync: { ok: true, details: "Music synchronization active" },
        transitionOrchestrator: { ok: true, details: "Transition system operational" }
      },
      recommendations: [],
      timestamp: performance.now()
    };

    let healthySystemCount = 0;
    let totalSystems = 0;

    // Check FluxConsciousnessLayers
    totalSystems++;
    try {
      if (this.fluxConsciousnessLayers?.initialized) {
        const metrics = this.fluxConsciousnessLayers.getConsciousnessMetrics();
        if (metrics) {
          healthySystemCount++;
        } else {
          healthCheck.systems.fluxConsciousness = { 
            ok: false, 
            details: "Consciousness metrics unavailable" 
          };
        }
      } else {
        healthCheck.systems.fluxConsciousness = { 
          ok: false, 
          details: "Flux consciousness system not initialized" 
        };
      }
    } catch (error) {
      healthCheck.systems.fluxConsciousness = { 
        ok: false, 
        details: `Flux consciousness error: ${error}` 
      };
    }

    // Check WebGL system
    totalSystems++;
    try {
      if (this.webglBackgroundSystem) {
        const webglHealth = await this.webglBackgroundSystem.healthCheck();
        healthCheck.systems.webglSystem = {
          ok: webglHealth.ok,
          details: webglHealth.details
        };
        if (webglHealth.ok) healthySystemCount++;
      } else {
        healthCheck.systems.webglSystem = { 
          ok: true, 
          details: "WebGL system not enabled" 
        };
        healthySystemCount++; // Not an error if intentionally disabled
      }
    } catch (error) {
      healthCheck.systems.webglSystem = { 
        ok: false, 
        details: `WebGL system error: ${error}` 
      };
    }

    // Check performance monitoring
    totalSystems++;
    try {
      if (this.adaptivePerformanceSystem) {
        const perfMetrics = this.adaptivePerformanceSystem.getPerformanceHistory();
        if (perfMetrics.length > 0) {
          healthySystemCount++;
        } else {
          healthCheck.systems.performanceMonitor = { 
            ok: false, 
            details: "No performance data available" 
          };
        }
      } else {
        healthCheck.systems.performanceMonitor = { 
          ok: false, 
          details: "Performance monitoring not initialized" 
        };
      }
    } catch (error) {
      healthCheck.systems.performanceMonitor = { 
        ok: false, 
        details: `Performance monitor error: ${error}` 
      };
    }

    // Check music sync
    totalSystems++;
    try {
      if (this.musicSyncService) {
        // Assume healthy if service exists and no errors
        healthySystemCount++;
      } else {
        healthCheck.systems.musicSync = { 
          ok: true, 
          details: "Music sync not enabled" 
        };
        healthySystemCount++; // Not an error if not needed
      }
    } catch (error) {
      healthCheck.systems.musicSync = { 
        ok: false, 
        details: `Music sync error: ${error}` 
      };
    }

    // Check transition orchestrator
    totalSystems++;
    try {
      if (this.transitionOrchestrator) {
        const currentBackend = this.transitionOrchestrator.getCurrentBackend();
        if (currentBackend) {
          healthySystemCount++;
        } else {
          healthCheck.systems.transitionOrchestrator = { 
            ok: false, 
            details: "No active backend" 
          };
        }
      } else {
        healthCheck.systems.transitionOrchestrator = { 
          ok: false, 
          details: "Transition orchestrator not initialized" 
        };
      }
    } catch (error) {
      healthCheck.systems.transitionOrchestrator = { 
        ok: false, 
        details: `Transition orchestrator error: ${error}` 
      };
    }

    // Determine overall health
    const healthPercentage = healthySystemCount / totalSystems;
    
    if (healthPercentage >= 0.9) {
      healthCheck.overall = "excellent";
    } else if (healthPercentage >= 0.7) {
      healthCheck.overall = "good";
    } else if (healthPercentage >= 0.5) {
      healthCheck.overall = "degraded";
      healthCheck.recommendations.push("Some systems are experiencing issues");
    } else {
      healthCheck.overall = "critical";
      healthCheck.recommendations.push("Multiple system failures detected");
      healthCheck.recommendations.push("Consider restarting the visual system");
    }

    // Add performance recommendations
    const perfMetrics = this.adaptivePerformanceSystem?.getPerformanceHistory();
    if (perfMetrics && perfMetrics.length > 0) {
      const recent = perfMetrics.slice(-5);
      const avgFPS = recent.reduce((sum, m) => sum + m.fps, 0) / recent.length;
      
      if (avgFPS < 30) {
        healthCheck.recommendations.push("Low FPS detected - consider reducing visual quality");
      } else if (avgFPS > 55 && healthCheck.overall === "excellent") {
        healthCheck.recommendations.push("Performance headroom available - quality can be increased");
      }
    }

    this.lastHealthCheck = healthCheck;

    // Emit health change event if callback is set
    if (this.onHealthChange) {
      this.onHealthChange(healthCheck);
    }

    // Update CSS variable for health status
    this.cssVariableBatcher.setProperty("--sn-system-health", healthCheck.overall);

    return healthCheck;
  }

  private updateMetrics(): void {
    // Update performance metrics
    this.currentMetrics.currentFPS = this.performanceAnalyzer.getMedianFPS() || 0;
    this.currentMetrics.frameTime = this.currentMetrics.currentFPS > 0 ? 1000 / this.currentMetrics.currentFPS : 1000;

    // Update memory usage
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      this.currentMetrics.memoryUsageMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
    }

    // Update adaptive performance metrics
    if (this.adaptivePerformanceSystem) {
      const perfHistory = this.adaptivePerformanceSystem.getPerformanceHistory();
      if (perfHistory.length > 0) {
        const recent = perfHistory.slice(-10);
        this.currentMetrics.averageFPS = recent.reduce((sum, m) => sum + m.fps, 0) / recent.length;
        this.currentMetrics.cpuUsagePercent = recent.reduce((sum, m) => sum + m.cpuUsage, 0) / recent.length;
        this.currentMetrics.gpuUsagePercent = recent.reduce((sum, m) => sum + m.gpuUsage, 0) / recent.length;
      }

      this.currentMetrics.currentQuality = this.adaptivePerformanceSystem.getCurrentQuality();
      this.currentMetrics.adaptiveScaling = this.adaptivePerformanceSystem.getCurrentProfile().adaptiveScaling;
    }

    // Update system state
    if (this.transitionOrchestrator) {
      this.currentMetrics.activeBackend = this.transitionOrchestrator.getCurrentBackend();
      this.currentMetrics.webglActive = this.currentMetrics.activeBackend === "webgl";
      this.currentMetrics.webglAvailable = this.transitionOrchestrator.getCapabilities().webglAvailable;
    }

    // Update consciousness metrics
    if (this.fluxConsciousnessLayers) {
      const consciousnessMetrics = this.fluxConsciousnessLayers.getConsciousnessMetrics();
      if (consciousnessMetrics) {
        this.currentMetrics.consciousnessLevel = consciousnessMetrics.consciousnessLevel;
        this.currentMetrics.emotionalState = consciousnessMetrics.emotionalProfile;
        this.currentMetrics.currentGenre = consciousnessMetrics.currentGenre || "unknown";
        this.currentMetrics.gradientComplexity = consciousnessMetrics.dimensionalDepth / 5; // Normalize to 0-1
        this.currentMetrics.layerCount = consciousnessMetrics.dimensionalDepth;
      }
    }

    // Update music sync status
    this.currentMetrics.musicSyncActive = !!this.musicSyncService;
    this.currentMetrics.performanceMonitoring = !!this.adaptivePerformanceSystem;

    // Determine system health based on metrics
    if (this.currentMetrics.currentFPS < 20) {
      this.currentMetrics.systemHealth = "critical";
    } else if (this.currentMetrics.currentFPS < 30) {
      this.currentMetrics.systemHealth = "degraded";
    } else if (this.currentMetrics.currentFPS > 55 && this.currentMetrics.memoryUsageMB < 40) {
      this.currentMetrics.systemHealth = "excellent";
    } else {
      this.currentMetrics.systemHealth = "good";
    }

    // Update CSS variables with current metrics
    this.cssVariableBatcher.setProperty("--sn-current-fps", this.currentMetrics.currentFPS.toString());
    this.cssVariableBatcher.setProperty("--sn-memory-usage", this.currentMetrics.memoryUsageMB.toFixed(1));
    this.cssVariableBatcher.setProperty("--sn-system-health-score", this.getHealthScore().toString());
  }

  private getHealthScore(): number {
    // Convert health to numeric score (0-100)
    switch (this.currentMetrics.systemHealth) {
      case "excellent": return 90;
      case "good": return 70;
      case "degraded": return 40;
      case "critical": return 20;
      default: return 50;
    }
  }

  private handleAdaptationEvent(event: AdaptationEvent): void {
    Y3K?.debug?.log("Year3000IntegrationBridge", `Adaptation event: ${event.type}`, event.reason);

    // Update metrics with new quality settings
    this.currentMetrics.currentQuality = event.newSettings;

    // Emit adaptation callback if set
    if (this.onSystemAdaptation) {
      this.onSystemAdaptation(this.currentMetrics);
    }

    // Update CSS variables to reflect changes
    this.cssVariableBatcher.setProperty("--sn-adaptive-quality", event.newSettings.gradientComplexity.toString());
    this.cssVariableBatcher.setProperty("--sn-adaptive-fps", event.newSettings.animationFPS.toString());
  }

  private handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key.startsWith("sn-integration-")) {
      // Handle integration-specific settings
      this.updateConfigurationFromSettings(key, value);
    }
  }

  private updateConfigurationFromSettings(key: string, value: any): void {
    switch (key) {
      case "sn-integration-mode":
        if (["progressive", "performance-first", "quality-first", "battery-optimized"].includes(value)) {
          this.config.mode = value;
          this.applyConfiguration();
        }
        break;
      case "sn-integration-webgl":
        this.config.enableWebGL = value === "true";
        break;
      case "sn-integration-adaptive":
        this.config.enableAdaptiveQuality = value === "true";
        break;
    }
  }

  private handleWebGLContextLoss(event: Event): void {
    Y3K?.debug?.warn("Year3000IntegrationBridge", "WebGL context lost");
    
    // Fallback to CSS backend immediately
    if (this.transitionOrchestrator) {
      this.transitionOrchestrator.forceBackend("css");
    }
  }

  private handleWebGLContextRestored(event: Event): void {
    Y3K?.debug?.log("Year3000IntegrationBridge", "WebGL context restored");
    
    // Attempt to restore WebGL backend if it was preferred
    if (this.config.enableWebGL && this.transitionOrchestrator) {
      setTimeout(() => {
        this.transitionOrchestrator?.forceBackend("webgl");
      }, 1000); // Wait a bit for context to stabilize
    }
  }

  // Public API methods
  public getMetrics(): SystemMetrics {
    return { ...this.currentMetrics };
  }

  public getLastHealthCheck(): HealthCheckResult | null {
    return this.lastHealthCheck;
  }

  public getConfiguration(): IntegrationConfig {
    return { ...this.config };
  }

  public async setConfiguration(config: Partial<IntegrationConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await this.applyConfiguration();
  }

  public setOnSystemAdaptation(callback: (metrics: SystemMetrics) => void): void {
    this.onSystemAdaptation = callback;
  }

  public setOnHealthChange(callback: (health: HealthCheckResult) => void): void {
    this.onHealthChange = callback;
  }

  public setOnBackendSwitch(callback: (oldBackend: GradientBackend, newBackend: GradientBackend) => void): void {
    this.onBackendSwitch = callback;
  }

  public async forceBackend(backend: GradientBackend): Promise<void> {
    if (this.transitionOrchestrator) {
      const oldBackend = this.transitionOrchestrator.getCurrentBackend();
      await this.transitionOrchestrator.forceBackend(backend);
      
      if (this.onBackendSwitch && oldBackend !== backend) {
        this.onBackendSwitch(oldBackend, backend);
      }
    }
  }

  public async forceQualityLevel(quality: Partial<QualitySettings>): Promise<void> {
    if (this.adaptivePerformanceSystem) {
      this.adaptivePerformanceSystem.setQuality(quality);
    }
  }

  public async performManualHealthCheck(): Promise<HealthCheckResult> {
    return await this.performHealthCheck();
  }

  public getSystemStatus(): { initialized: boolean; active: boolean; healthy: boolean } {
    return {
      initialized: this.isInitialized,
      active: this.isActive,
      healthy: this.currentMetrics.systemHealth === "excellent" || this.currentMetrics.systemHealth === "good"
    };
  }

  private async cleanup(): Promise<void> {
    this.isActive = false;

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
    if (this.boundSettingsHandler) {
      document.removeEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }

    document.removeEventListener("webglcontextlost", this.handleWebGLContextLoss);
    document.removeEventListener("webglcontextrestored", this.handleWebGLContextRestored);

    // Cleanup systems
    if (this.adaptivePerformanceSystem) {
      this.adaptivePerformanceSystem.removeEventListener(this.boundAdaptationHandler!);
      this.adaptivePerformanceSystem.destroy();
      this.adaptivePerformanceSystem = null;
    }

    if (this.transitionOrchestrator) {
      this.transitionOrchestrator.destroy();
      this.transitionOrchestrator = null;
    }

    // Reset CSS state
    this.cssVariableBatcher.setProperty("--sn-integration-active", "0");
    this.cssVariableBatcher.setProperty("--sn-system-health", "unknown");

    Y3K?.debug?.log("Year3000IntegrationBridge", "Integration bridge cleaned up");
  }

  public async destroy(): Promise<void> {
    await this.cleanup();
    this.isInitialized = false;
  }
}