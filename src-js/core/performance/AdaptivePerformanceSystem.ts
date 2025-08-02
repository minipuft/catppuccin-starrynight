/**
 * AdaptivePerformanceSystem - PHASE 5 Hardware Detection & Performance Scaling
 * Part of the Year 3000 Integration System
 *
 * Intelligent performance monitoring and adaptation system that:
 * - Continuously monitors system performance metrics
 * - Detects hardware capabilities and limitations
 * - Automatically adjusts visual quality and backend selection
 * - Provides performance budgeting and thermal management
 * - Implements intelligent quality scaling algorithms
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { DeviceCapabilityDetector } from "./DeviceCapabilityDetector";
import { PerformanceAnalyzer } from "./PerformanceAnalyzer";

export interface PerformanceProfile {
  tier: "ultra" | "high" | "medium" | "low" | "minimal";
  targetFPS: number;
  memoryBudgetMB: number;
  cpuBudgetPercent: number;
  gpuBudgetPercent: number;
  thermalLimit: number;
  adaptiveScaling: boolean;
}

export interface HardwareMetrics {
  // CPU metrics
  cpuCores: number;
  cpuFrequency: number;
  cpuArchitecture: string;
  
  // Memory metrics
  totalMemoryGB: number;
  availableMemoryMB: number;
  memoryPressure: "low" | "medium" | "high";
  
  // GPU metrics
  gpuVendor: string;
  gpuRenderer: string;
  maxTextureSize: number;
  webglVersion: "1.0" | "2.0" | "none";
  
  // System metrics
  devicePixelRatio: number;
  screenResolution: { width: number; height: number };
  powerLevel: "high" | "balanced" | "battery-saver";
  thermalState: "nominal" | "warm" | "hot" | "critical";
}

export interface PerformanceBudget {
  frameTimeMs: number;        // Maximum frame time (16.67ms for 60fps)
  memoryLimitMB: number;      // Memory usage limit
  cpuTimeSliceMs: number;     // CPU time budget per frame
  gpuUtilizationPercent: number; // Maximum GPU utilization
  networkBandwidthKBps: number; // Network budget for assets
}

export interface QualitySettings {
  // Visual quality
  gradientComplexity: number;     // 0-1 complexity level
  particleDensity: number;        // 0-1 particle system density
  shaderPrecision: "lowp" | "mediump" | "highp";
  textureResolution: number;      // Texture size multiplier
  
  // Animation quality
  animationFPS: number;           // Target animation frame rate
  transitionQuality: "instant" | "basic" | "smooth" | "cinematic";
  motionBlur: boolean;
  
  // Effect quality
  bloomEnabled: boolean;
  shadowQuality: "off" | "low" | "medium" | "high";
  antiAliasing: "none" | "fxaa" | "msaa2x" | "msaa4x";
  postProcessing: boolean;
}

export interface AdaptationEvent {
  type: "quality-change" | "backend-switch" | "thermal-throttle" | "performance-warning";
  reason: string;
  oldSettings: QualitySettings;
  newSettings: QualitySettings;
  timestamp: number;
}

export class AdaptivePerformanceSystem {
  private deviceDetector: DeviceCapabilityDetector;
  private performanceAnalyzer: PerformanceAnalyzer;
  
  private hardwareMetrics: HardwareMetrics;
  private currentProfile: PerformanceProfile;
  private currentBudget: PerformanceBudget;
  private currentQuality: QualitySettings;
  
  // Performance monitoring
  private performanceHistory: Array<{
    timestamp: number;
    fps: number;
    frameTime: number;
    memoryUsage: number;
    cpuUsage: number;
    gpuUsage: number;
    thermalState: string;
  }> = [];
  
  private monitoringInterval: number | null = null;
  private adaptationTimer: number | null = null;
  private lastAdaptation: number = 0;
  private adaptationCooldown = 5000; // 5 seconds between adaptations
  
  // Thermal and power management
  private thermalHistory: number[] = [];
  private powerObserver: any = null;
  private batteryAPI: any = null;
  
  // Event handling
  private eventListeners: Array<(event: AdaptationEvent) => void> = [];
  private boundPerformanceCheck: (() => void) | null = null;
  private boundThermalCheck: (() => void) | null = null;
  
  // Circuit breaker for dependency validation
  private dependencyCircuitBreaker = {
    failures: 0,
    lastFailure: 0,
    isOpen: false,
    openDuration: 30000, // 30 seconds
    maxFailures: 5
  };
  
  // Quality scaling algorithms
  private qualityScales = {
    ultra: { complexity: 1.0, particles: 1.0, fps: 60, precision: "highp" as const },
    high: { complexity: 0.8, particles: 0.8, fps: 60, precision: "highp" as const },
    medium: { complexity: 0.6, particles: 0.6, fps: 45, precision: "mediump" as const },
    low: { complexity: 0.4, particles: 0.4, fps: 30, precision: "mediump" as const },
    minimal: { complexity: 0.2, particles: 0.2, fps: 24, precision: "lowp" as const }
  };

  constructor(
    deviceDetector?: DeviceCapabilityDetector,
    performanceAnalyzer?: PerformanceAnalyzer
  ) {
    this.deviceDetector = deviceDetector || new DeviceCapabilityDetector();
    this.performanceAnalyzer = performanceAnalyzer || new PerformanceAnalyzer();
    
    this.hardwareMetrics = this.detectHardware();
    this.currentProfile = this.determineOptimalProfile();
    this.currentBudget = this.calculatePerformanceBudget();
    this.currentQuality = this.deriveQualitySettings();
    
    this.boundPerformanceCheck = this.performanceCheck.bind(this);
    this.boundThermalCheck = this.thermalCheck.bind(this);
    
    Y3K?.debug?.log("AdaptivePerformanceSystem", "Initialized with profile:", this.currentProfile.tier);
  }

  public async initialize(): Promise<void> {
    // Initialize hardware detection
    await this.initializeHardwareMonitoring();
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
    
    // Initialize power management
    await this.initializePowerManagement();
    
    // Set up thermal monitoring
    this.initializeThermalMonitoring();
    
    Y3K?.debug?.log("AdaptivePerformanceSystem", "Performance monitoring started");
  }

  private detectHardware(): HardwareMetrics {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    
    // CPU detection
    const cpuCores = navigator.hardwareConcurrency || 4;
    const cpuArchitecture = this.detectCPUArchitecture();
    
    // Memory detection
    const memoryInfo = (performance as any).memory;
    const totalMemoryGB = memoryInfo ? memoryInfo.jsHeapSizeLimit / (1024 * 1024 * 1024) : 4;
    const availableMemoryMB = memoryInfo ? (memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize) / (1024 * 1024) : 1024;
    
    // GPU detection
    let gpuVendor = "unknown";
    let gpuRenderer = "unknown";
    let maxTextureSize = 2048;
    let webglVersion: "1.0" | "2.0" | "none" = "none";
    
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "unknown";
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "unknown";
      }
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      webglVersion = gl instanceof WebGL2RenderingContext ? "2.0" : "1.0";
    }
    
    // System metrics
    const devicePixelRatio = window.devicePixelRatio || 1;
    const screenResolution = {
      width: screen.width * devicePixelRatio,
      height: screen.height * devicePixelRatio
    };
    
    return {
      cpuCores,
      cpuFrequency: 0, // Not directly detectable
      cpuArchitecture,
      totalMemoryGB,
      availableMemoryMB,
      memoryPressure: availableMemoryMB < 512 ? "high" : availableMemoryMB < 1024 ? "medium" : "low",
      gpuVendor,
      gpuRenderer,
      maxTextureSize,
      webglVersion,
      devicePixelRatio,
      screenResolution,
      powerLevel: "balanced", // Will be updated by power management
      thermalState: "nominal"
    };
  }

  private detectCPUArchitecture(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes("arm64") || userAgent.includes("aarch64")) {
      return "arm64";
    } else if (userAgent.includes("arm")) {
      return "arm32";
    } else if (userAgent.includes("x86_64") || userAgent.includes("amd64")) {
      return "x64";
    } else if (userAgent.includes("x86")) {
      return "x86";
    }
    
    return "unknown";
  }

  private determineOptimalProfile(): PerformanceProfile {
    const deviceTier = this.deviceDetector.recommendPerformanceQuality();
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const isLowMemory = this.hardwareMetrics.memoryPressure === "high";
    const hasWebGL2 = this.hardwareMetrics.webglVersion === "2.0";
    
    // Determine performance tier
    let tier: PerformanceProfile["tier"];
    
    if (isLowMemory || !hasWebGL2) {
      tier = "minimal";
    } else if (isMobile) {
      tier = deviceTier === "high" ? "medium" : "low";
    } else {
      switch (deviceTier) {
        case "high":
          tier = this.hardwareMetrics.cpuCores >= 8 ? "ultra" : "high";
          break;
        case "balanced":
          tier = "medium";
          break;
        default:
          tier = "low";
      }
    }
    
    // Define profile based on tier
    const profiles: Record<PerformanceProfile["tier"], PerformanceProfile> = {
      ultra: {
        tier: "ultra",
        targetFPS: 60,
        memoryBudgetMB: 100,
        cpuBudgetPercent: 20,
        gpuBudgetPercent: 40,
        thermalLimit: 75,
        adaptiveScaling: true
      },
      high: {
        tier: "high",
        targetFPS: 60,
        memoryBudgetMB: 75,
        cpuBudgetPercent: 15,
        gpuBudgetPercent: 30,
        thermalLimit: 70,
        adaptiveScaling: true
      },
      medium: {
        tier: "medium",
        targetFPS: 45,
        memoryBudgetMB: 50,
        cpuBudgetPercent: 10,
        gpuBudgetPercent: 20,
        thermalLimit: 65,
        adaptiveScaling: true
      },
      low: {
        tier: "low",
        targetFPS: 30,
        memoryBudgetMB: 32,
        cpuBudgetPercent: 8,
        gpuBudgetPercent: 15,
        thermalLimit: 60,
        adaptiveScaling: false
      },
      minimal: {
        tier: "minimal",
        targetFPS: 24,
        memoryBudgetMB: 20,
        cpuBudgetPercent: 5,
        gpuBudgetPercent: 10,
        thermalLimit: 55,
        adaptiveScaling: false
      }
    };
    
    return profiles[tier];
  }

  private calculatePerformanceBudget(): PerformanceBudget {
    const frameTimeMs = 1000 / this.currentProfile.targetFPS;
    
    return {
      frameTimeMs,
      memoryLimitMB: this.currentProfile.memoryBudgetMB,
      cpuTimeSliceMs: frameTimeMs * 0.8, // 80% of frame time for CPU
      gpuUtilizationPercent: this.currentProfile.gpuBudgetPercent,
      networkBandwidthKBps: 100 // Conservative network budget
    };
  }

  private deriveQualitySettings(): QualitySettings {
    const scale = this.qualityScales[this.currentProfile.tier];
    
    return {
      gradientComplexity: scale.complexity,
      particleDensity: scale.particles,
      shaderPrecision: scale.precision,
      textureResolution: scale.complexity,
      animationFPS: scale.fps,
      transitionQuality: this.currentProfile.tier === "ultra" ? "cinematic" :
                        this.currentProfile.tier === "high" ? "smooth" :
                        this.currentProfile.tier === "medium" ? "basic" : "instant",
      motionBlur: this.currentProfile.tier === "ultra",
      bloomEnabled: scale.complexity > 0.6,
      shadowQuality: this.currentProfile.tier === "ultra" ? "high" :
                    this.currentProfile.tier === "high" ? "medium" :
                    this.currentProfile.tier === "medium" ? "low" : "off",
      antiAliasing: this.currentProfile.tier === "ultra" ? "msaa4x" :
                   this.currentProfile.tier === "high" ? "msaa2x" :
                   this.currentProfile.tier === "medium" ? "fxaa" : "none",
      postProcessing: scale.complexity > 0.5
    };
  }

  private async initializeHardwareMonitoring(): Promise<void> {
    // Monitor memory pressure
    if ("memory" in performance) {
      // Already handled in detectHardware
    }
    
    // Monitor connection quality
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener("change", () => {
          // Adapt quality based on connection speed
          this.adaptToConnectionSpeed(connection.effectiveType);
        });
      }
    }
  }

  private startPerformanceMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.monitoringInterval = window.setInterval(this.boundPerformanceCheck!, 1000);
  }

  private performanceCheck(): void {
    const fps = this.performanceAnalyzer.getMedianFPS() || 0;
    const frameTime = fps > 0 ? 1000 / fps : 1000;
    
    // Estimate memory usage
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;
    
    // Estimate CPU/GPU usage based on performance
    const cpuUsage = this.estimateCPUUsage(fps, frameTime);
    const gpuUsage = this.estimateGPUUsage(fps, frameTime);
    
    // Store performance data
    this.performanceHistory.push({
      timestamp: performance.now(),
      fps,
      frameTime,
      memoryUsage,
      cpuUsage,
      gpuUsage,
      thermalState: this.hardwareMetrics.thermalState
    });
    
    // Keep only recent history (last 30 seconds)
    const cutoff = performance.now() - 30000;
    this.performanceHistory = this.performanceHistory.filter(entry => entry.timestamp > cutoff);
    
    // Check if adaptation is needed
    this.checkAdaptationNeeded();
  }

  private estimateCPUUsage(fps: number, frameTime: number): number {
    // Estimate CPU usage based on frame time and target
    const targetFrameTime = this.currentBudget.frameTimeMs;
    const usage = Math.min((frameTime / targetFrameTime) * 100, 100);
    return Math.max(usage, 5); // Minimum 5% for basic operation
  }

  private estimateGPUUsage(fps: number, frameTime: number): number {
    // Estimate GPU usage based on visual complexity and frame rate
    const complexity = this.currentQuality.gradientComplexity;
    const baseUsage = complexity * 20; // Base usage for current quality
    const frameTimeImpact = frameTime > this.currentBudget.frameTimeMs ? 10 : 0;
    return Math.min(baseUsage + frameTimeImpact, 100);
  }

  private checkAdaptationNeeded(): void {
    if (!this.currentProfile.adaptiveScaling) return;
    if (performance.now() - this.lastAdaptation < this.adaptationCooldown) return;
    if (this.performanceHistory.length < 5) return;
    
    // Dependency validation: Don't adapt if core systems aren't ready
    if (!this.validateCoreDependencies()) {
      Y3K?.debug?.log("AdaptivePerformanceSystem", "Skipping adaptation - core dependencies not ready");
      return;
    }
    
    const recent = this.performanceHistory.slice(-5);
    const avgFPS = recent.reduce((sum, entry) => sum + entry.fps, 0) / recent.length;
    const avgMemory = recent.reduce((sum, entry) => sum + entry.memoryUsage, 0) / recent.length;
    const avgFrameTime = recent.reduce((sum, entry) => sum + entry.frameTime, 0) / recent.length;
    
    // Enhanced validation: Skip adaptation if we're in a degraded state
    if (this.isInDegradedState(avgFPS, avgFrameTime)) {
      Y3K?.debug?.log("AdaptivePerformanceSystem", "Skipping adaptation - system in degraded state");
      return;
    }
    
    // Check for performance issues
    const fpsIssue = avgFPS < this.currentProfile.targetFPS * 0.8;
    const memoryIssue = avgMemory > this.currentBudget.memoryLimitMB;
    const frameTimeIssue = avgFrameTime > this.currentBudget.frameTimeMs * 1.2;
    const thermalIssue = this.hardwareMetrics.thermalState !== "nominal";
    
    if (fpsIssue || memoryIssue || frameTimeIssue || thermalIssue) {
      this.adaptPerformanceDown();
    } else if (this.canScaleUp(avgFPS, avgMemory, avgFrameTime)) {
      this.adaptPerformanceUp();
    }
  }

  private canScaleUp(fps: number, memory: number, frameTime: number): boolean {
    // Only scale up if we have significant headroom
    const fpsHeadroom = fps > this.currentProfile.targetFPS * 1.1;
    const memoryHeadroom = memory < this.currentBudget.memoryLimitMB * 0.7;
    const frameTimeHeadroom = frameTime < this.currentBudget.frameTimeMs * 0.8;
    const noThermalIssues = this.hardwareMetrics.thermalState === "nominal";
    
    return fpsHeadroom && memoryHeadroom && frameTimeHeadroom && noThermalIssues;
  }

  /**
   * Check if circuit breaker is open (preventing dependency checks)
   */
  private isCircuitBreakerOpen(): boolean {
    const now = performance.now();
    
    if (this.dependencyCircuitBreaker.isOpen) {
      // Check if enough time has passed to try again
      if (now - this.dependencyCircuitBreaker.lastFailure > this.dependencyCircuitBreaker.openDuration) {
        this.dependencyCircuitBreaker.isOpen = false;
        this.dependencyCircuitBreaker.failures = 0;
        Y3K?.debug?.log("AdaptivePerformanceSystem", "Circuit breaker reset - attempting dependency validation");
        return false;
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Record dependency validation failure
   */
  private recordDependencyFailure(): void {
    this.dependencyCircuitBreaker.failures++;
    this.dependencyCircuitBreaker.lastFailure = performance.now();
    
    if (this.dependencyCircuitBreaker.failures >= this.dependencyCircuitBreaker.maxFailures) {
      this.dependencyCircuitBreaker.isOpen = true;
      Y3K?.debug?.warn("AdaptivePerformanceSystem", `Circuit breaker opened after ${this.dependencyCircuitBreaker.failures} failures`);
    }
  }
  
  /**
   * Validate that core dependencies are properly initialized before making performance adaptations
   * Prevents cascade loops when systems report as "loaded" but not fully initialized
   */
  private validateCoreDependencies(): boolean {
    // Check circuit breaker first
    if (this.isCircuitBreakerOpen()) {
      return false;
    }
    
    try {
      const year3000System = (globalThis as any).year3000System;
      if (!year3000System) {
        this.recordDependencyFailure();
        return false;
      }

      // Check if facade coordinator is available and initialized
      const facadeCoordinator = year3000System.facadeCoordinator;
      if (!facadeCoordinator) {
        this.recordDependencyFailure();
        return false;
      }

      // Check critical systems that affect performance measurements
      const criticalSystems = [
        'MusicSyncService',
        'ColorHarmonyEngine', 
        'UnifiedCSSConsciousnessController',
        'PerformanceAnalyzer'
      ];

      for (const systemName of criticalSystems) {
        try {
          // Check if system is available via facade
          let system = null;
          try {
            system = facadeCoordinator.getCachedNonVisualSystem?.(systemName);
          } catch (e) {
            // If facade method fails, try alternative access
            const camelCaseName = systemName.charAt(0).toLowerCase() + systemName.slice(1);
            system = year3000System[camelCaseName];
          }

          if (!system) {
            this.recordDependencyFailure();
            return false;
          }

          // Check if system is actually initialized (not just loaded)
          if (typeof system.initialized === 'boolean' && !system.initialized) {
            this.recordDependencyFailure();
            return false;
          }
        } catch (error) {
          this.recordDependencyFailure();
          return false;
        }
      }

      // Reset circuit breaker on success
      this.dependencyCircuitBreaker.failures = 0;
      return true;
    } catch (error) {
      Y3K?.debug?.error("AdaptivePerformanceSystem", "Dependency validation failed:", error);
      this.recordDependencyFailure();
      return false;
    }
  }

  /**
   * Check if system is in a degraded state that should prevent performance adaptations
   * Prevents endless downgrading when performance data is unreliable
   */
  private isInDegradedState(avgFPS: number, avgFrameTime: number): boolean {
    // If we're already at minimum quality settings, don't keep adapting down
    const isMinimalQuality = this.currentQuality.gradientComplexity <= 0.15 &&
                            this.currentQuality.particleDensity <= 0.15 &&
                            this.currentQuality.animationFPS <= 20;

    // If performance is extremely poor, this might indicate system issues rather than load
    const isExtremelyPoor = avgFPS < 10 || avgFrameTime > 100;

    // Circuit breaker: if we've adapted down too many times recently, stop
    const recentAdaptations = this.performanceHistory.filter(entry => 
      entry.timestamp > performance.now() - 30000 // Last 30 seconds
    ).length;
    const tooManyAdaptations = recentAdaptations > 10;

    return isMinimalQuality || isExtremelyPoor || tooManyAdaptations;
  }

  private adaptPerformanceDown(): void {
    const oldQuality = { ...this.currentQuality };
    
    // Circuit breaker: if we're already at minimum settings, stop adapting down
    if (this.isInDegradedState(0, 0)) {
      Y3K?.debug?.warn("AdaptivePerformanceSystem", "Circuit breaker activated - preventing further quality reduction");
      return;
    }
    
    // Reduce quality settings
    this.currentQuality.gradientComplexity = Math.max(0.1, this.currentQuality.gradientComplexity * 0.8);
    this.currentQuality.particleDensity = Math.max(0.1, this.currentQuality.particleDensity * 0.8);
    
    if (this.currentQuality.animationFPS > 24) {
      this.currentQuality.animationFPS = Math.max(15, this.currentQuality.animationFPS - 15);
    }
    
    // Disable expensive effects
    if (this.currentQuality.postProcessing) {
      this.currentQuality.postProcessing = false;
    } else if (this.currentQuality.bloomEnabled) {
      this.currentQuality.bloomEnabled = false;
    } else if (this.currentQuality.antiAliasing !== "none") {
      this.currentQuality.antiAliasing = this.currentQuality.antiAliasing === "msaa4x" ? "msaa2x" :
                                       this.currentQuality.antiAliasing === "msaa2x" ? "fxaa" : "none";
    }
    
    this.lastAdaptation = performance.now();
    
    this.emitAdaptationEvent({
      type: "quality-change",
      reason: "Performance optimization",
      oldSettings: oldQuality,
      newSettings: { ...this.currentQuality },
      timestamp: performance.now()
    });
    
    Y3K?.debug?.log("AdaptivePerformanceSystem", "Adapted performance down", {
      complexity: this.currentQuality.gradientComplexity,
      fps: this.currentQuality.animationFPS
    });
  }

  private adaptPerformanceUp(): void {
    const oldQuality = { ...this.currentQuality };
    
    // Enhanced recovery conditions: Only scale up if systems are stable
    if (!this.canRecoverQuality()) {
      Y3K?.debug?.log("AdaptivePerformanceSystem", "Skipping quality recovery - conditions not met");
      return;
    }
    
    // Increase quality settings gradually
    this.currentQuality.gradientComplexity = Math.min(1.0, this.currentQuality.gradientComplexity * 1.1);
    this.currentQuality.particleDensity = Math.min(1.0, this.currentQuality.particleDensity * 1.1);
    
    if (this.currentQuality.animationFPS < this.currentProfile.targetFPS) {
      this.currentQuality.animationFPS = Math.min(this.currentProfile.targetFPS, this.currentQuality.animationFPS + 15);
    }
    
    // Enable effects if performance allows
    if (!this.currentQuality.bloomEnabled && this.currentQuality.gradientComplexity > 0.6) {
      this.currentQuality.bloomEnabled = true;
    } else if (!this.currentQuality.postProcessing && this.currentQuality.gradientComplexity > 0.7) {
      this.currentQuality.postProcessing = true;
    }
    
    this.lastAdaptation = performance.now();
    
    this.emitAdaptationEvent({
      type: "quality-change",
      reason: "Performance headroom available",
      oldSettings: oldQuality,
      newSettings: { ...this.currentQuality },
      timestamp: performance.now()
    });
    
    Y3K?.debug?.log("AdaptivePerformanceSystem", "Adapted performance up", {
      complexity: this.currentQuality.gradientComplexity,
      fps: this.currentQuality.animationFPS
    });
  }

  /**
   * Determine if quality can be recovered safely
   * Prevents premature scaling up when system is still unstable
   */
  private canRecoverQuality(): boolean {
    // Require longer stability period before recovering quality
    const stableHistoryRequired = 10; // 10 seconds of good performance
    const stabilityWindow = performance.now() - 10000;
    
    const stableHistory = this.performanceHistory.filter(entry => 
      entry.timestamp > stabilityWindow && 
      entry.fps >= this.currentProfile.targetFPS * 0.9 &&
      entry.frameTime <= this.currentBudget.frameTimeMs
    );
    
    const hasStableHistory = stableHistory.length >= stableHistoryRequired;
    
    // Don't recover if we just adapted down recently
    const recentAdaptationDown = performance.now() - this.lastAdaptation < 20000; // 20 second cooldown
    
    // Ensure dependencies are still valid
    const dependenciesValid = this.validateCoreDependencies();
    
    return hasStableHistory && !recentAdaptationDown && dependenciesValid;
  }

  private async initializePowerManagement(): Promise<void> {
    // Initialize battery API
    if ("getBattery" in navigator) {
      try {
        this.batteryAPI = await (navigator as any).getBattery();
        
        this.batteryAPI.addEventListener("chargingchange", () => this.updatePowerLevel());
        this.batteryAPI.addEventListener("levelchange", () => this.updatePowerLevel());
        
        this.updatePowerLevel();
      } catch (error) {
        Y3K?.debug?.warn("AdaptivePerformanceSystem", "Battery API not available:", error);
      }
    }
  }

  private updatePowerLevel(): void {
    if (!this.batteryAPI) return;
    
    const charging = this.batteryAPI.charging;
    const level = this.batteryAPI.level;
    
    if (charging) {
      this.hardwareMetrics.powerLevel = "high";
    } else if (level > 0.5) {
      this.hardwareMetrics.powerLevel = "balanced";
    } else {
      this.hardwareMetrics.powerLevel = "battery-saver";
      
      // Aggressive power saving below 20%
      if (level < 0.2) {
        this.adaptToBatterySaver();
      }
    }
  }

  private adaptToBatterySaver(): void {
    const oldQuality = { ...this.currentQuality };
    
    // Minimal quality for battery saving
    this.currentQuality.gradientComplexity = 0.2;
    this.currentQuality.particleDensity = 0.1;
    this.currentQuality.animationFPS = 24;
    this.currentQuality.postProcessing = false;
    this.currentQuality.bloomEnabled = false;
    this.currentQuality.antiAliasing = "none";
    this.currentQuality.shadowQuality = "off";
    
    this.emitAdaptationEvent({
      type: "quality-change",
      reason: "Battery conservation mode",
      oldSettings: oldQuality,
      newSettings: { ...this.currentQuality },
      timestamp: performance.now()
    });
  }

  private initializeThermalMonitoring(): void {
    // Estimate thermal state based on performance degradation
    setInterval(this.boundThermalCheck!, 10000); // Check every 10 seconds
  }

  private thermalCheck(): void {
    if (this.performanceHistory.length < 10) return;
    
    const recent = this.performanceHistory.slice(-10);
    const avgFPS = recent.reduce((sum, entry) => sum + entry.fps, 0) / recent.length;
    const fpsDecline = this.performanceHistory.length > 20 ? 
      this.performanceHistory.slice(-20, -10).reduce((sum, entry) => sum + entry.fps, 0) / 10 - avgFPS : 0;
    
    // Estimate thermal state based on performance trends
    let newThermalState: HardwareMetrics["thermalState"] = "nominal";
    
    if (fpsDecline > 10) {
      newThermalState = "critical";
    } else if (fpsDecline > 5) {
      newThermalState = "hot";
    } else if (fpsDecline > 2) {
      newThermalState = "warm";
    }
    
    if (newThermalState !== this.hardwareMetrics.thermalState) {
      this.hardwareMetrics.thermalState = newThermalState;
      
      if (newThermalState !== "nominal") {
        this.handleThermalThrottling(newThermalState);
      }
    }
    
    // Store thermal history
    this.thermalHistory.push(avgFPS);
    if (this.thermalHistory.length > 20) {
      this.thermalHistory.shift();
    }
  }

  private handleThermalThrottling(thermalState: HardwareMetrics["thermalState"]): void {
    const oldQuality = { ...this.currentQuality };
    
    switch (thermalState) {
      case "warm":
        this.currentQuality.animationFPS = Math.max(30, this.currentQuality.animationFPS);
        this.currentQuality.postProcessing = false;
        break;
      case "hot":
        this.currentQuality.animationFPS = 24;
        this.currentQuality.gradientComplexity *= 0.7;
        this.currentQuality.particleDensity *= 0.5;
        break;
      case "critical":
        this.currentQuality.animationFPS = 15;
        this.currentQuality.gradientComplexity = 0.2;
        this.currentQuality.particleDensity = 0.1;
        this.currentQuality.postProcessing = false;
        this.currentQuality.bloomEnabled = false;
        break;
    }
    
    this.emitAdaptationEvent({
      type: "thermal-throttle",
      reason: `Thermal throttling: ${thermalState}`,
      oldSettings: oldQuality,
      newSettings: { ...this.currentQuality },
      timestamp: performance.now()
    });
    
    Y3K?.debug?.warn("AdaptivePerformanceSystem", `Thermal throttling activated: ${thermalState}`);
  }

  private adaptToConnectionSpeed(effectiveType: string): void {
    // Adapt based on network connection speed
    const isSlowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
    
    if (isSlowConnection) {
      this.currentBudget.networkBandwidthKBps = 20; // Very conservative
    } else if (effectiveType === "3g") {
      this.currentBudget.networkBandwidthKBps = 50;
    } else {
      this.currentBudget.networkBandwidthKBps = 100;
    }
  }

  private emitAdaptationEvent(event: AdaptationEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        Y3K?.debug?.error("AdaptivePerformanceSystem", "Event listener error:", error);
      }
    });
  }

  // Public API
  public getHardwareMetrics(): HardwareMetrics {
    return { ...this.hardwareMetrics };
  }

  public getCurrentProfile(): PerformanceProfile {
    return { ...this.currentProfile };
  }

  public getCurrentBudget(): PerformanceBudget {
    return { ...this.currentBudget };
  }

  public getCurrentQuality(): QualitySettings {
    return { ...this.currentQuality };
  }

  public getPerformanceHistory(): typeof this.performanceHistory {
    return [...this.performanceHistory];
  }

  public addEventListener(listener: (event: AdaptationEvent) => void): void {
    this.eventListeners.push(listener);
  }

  public removeEventListener(listener: (event: AdaptationEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  public setProfile(profile: Partial<PerformanceProfile>): void {
    this.currentProfile = { ...this.currentProfile, ...profile };
    this.currentBudget = this.calculatePerformanceBudget();
    this.currentQuality = this.deriveQualitySettings();
  }

  public setQuality(quality: Partial<QualitySettings>): void {
    const oldQuality = { ...this.currentQuality };
    this.currentQuality = { ...this.currentQuality, ...quality };
    
    this.emitAdaptationEvent({
      type: "quality-change",
      reason: "Manual quality adjustment",
      oldSettings: oldQuality,
      newSettings: { ...this.currentQuality },
      timestamp: performance.now()
    });
  }

  public forceAdaptation(): void {
    this.lastAdaptation = 0; // Reset cooldown
    this.checkAdaptationNeeded();
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.adaptationTimer) {
      clearTimeout(this.adaptationTimer);
      this.adaptationTimer = null;
    }
    
    // Clean up power management
    if (this.batteryAPI) {
      this.batteryAPI.removeEventListener("chargingchange", this.updatePowerLevel);
      this.batteryAPI.removeEventListener("levelchange", this.updatePowerLevel);
    }
    
    this.eventListeners = [];
    this.performanceHistory = [];
    this.thermalHistory = [];
    
    Y3K?.debug?.log("AdaptivePerformanceSystem", "Destroyed");
  }
}