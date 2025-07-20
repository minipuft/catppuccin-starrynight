/**
 * RealityBleedingPerformanceOptimizer - Performance Strategy for Complex Gradient Animations
 * Part of the Year 3000 System performance pipeline
 * 
 * Optimizes performance for Reality Bleeding Gradients system:
 * - GPU acceleration with thermal throttling detection
 * - Adaptive quality scaling based on performance metrics
 * - Memory leak prevention for long sessions
 * - Frame rate optimization with intelligent degradation
 */

import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  renderTime: number;
  frameDrops: number;
  thermalState: "normal" | "fair" | "serious" | "critical";
}

interface QualitySettings {
  level: "ultra-low" | "low" | "medium" | "high" | "ultra-high";
  liquidConsciousness: boolean;
  shimmerEffects: boolean;
  depthLayers: number;
  musicSync: boolean;
  parallaxStrength: number;
  animationSpeed: number;
  blurQuality: "low" | "medium" | "high";
  webglEnabled: boolean;
}

interface AdaptiveThresholds {
  fpsWarning: number;
  fpsError: number;
  memoryWarning: number;
  memoryError: number;
  cpuWarning: number;
  cpuError: number;
  renderTimeWarning: number;
  renderTimeError: number;
}

interface PerformanceAction {
  type: "disable" | "reduce" | "optimize" | "fallback";
  system: string;
  reason: string;
  priority: number;
  timestamp: number;
}

/**
 * RealityBleedingPerformanceOptimizer manages performance for complex gradient systems
 * - Monitors performance metrics continuously
 * - Adapts quality settings based on device capabilities
 * - Prevents memory leaks and performance degradation
 * - Provides intelligent fallback strategies
 */
export class RealityBleedingPerformanceOptimizer {
  private performanceAnalyzer: PerformanceAnalyzer;
  private deviceCapabilities: DeviceCapabilityDetector;
  private cssVariableBatcher: CSSVariableBatcher;
  
  private currentMetrics: PerformanceMetrics;
  private qualitySettings: QualitySettings;
  private adaptiveThresholds: AdaptiveThresholds;
  private performanceActions: PerformanceAction[];
  
  private monitoringInterval: number | null = null;
  private lastOptimizationCheck = 0;
  private consecutiveFrameDrops = 0;
  private memoryLeakDetected = false;
  private thermalThrottling = false;
  
  private optimizationCallbacks: Map<string, (quality: QualitySettings) => void> = new Map();
  
  constructor(
    config: Year3000Config,
    performanceAnalyzer: PerformanceAnalyzer
  ) {
    this.performanceAnalyzer = performanceAnalyzer;
    this.deviceCapabilities = new DeviceCapabilityDetector();
    this.cssVariableBatcher = new CSSVariableBatcher();
    
    // Initialize performance metrics
    this.currentMetrics = {
      fps: 60,
      memoryUsage: 0,
      cpuUsage: 0,
      gpuUsage: 0,
      renderTime: 0,
      frameDrops: 0,
      thermalState: "normal"
    };
    
    // Initialize quality settings based on device
    this.qualitySettings = this.initializeQualitySettings();
    
    // Initialize adaptive thresholds
    this.adaptiveThresholds = {
      fpsWarning: 45,
      fpsError: 30,
      memoryWarning: 40, // MB
      memoryError: 60, // MB
      cpuWarning: 70, // %
      cpuError: 85, // %
      renderTimeWarning: 16, // ms (60fps)
      renderTimeError: 33 // ms (30fps)
    };
    
    // Initialize performance actions log
    this.performanceActions = [];
    
    // Start monitoring
    this.startPerformanceMonitoring();
    
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", "Performance optimizer initialized");
  }
  
  private initializeQualitySettings(): QualitySettings {
    const deviceQuality = this.deviceCapabilities.recommendPerformanceQuality();
    
    switch (deviceQuality) {
      case "low":
        return {
          level: "low",
          liquidConsciousness: false,
          shimmerEffects: false,
          depthLayers: 2,
          musicSync: true,
          parallaxStrength: 0.2,
          animationSpeed: 0.5,
          blurQuality: "low",
          webglEnabled: false
        };
        
      case "balanced":
        return {
          level: "medium",
          liquidConsciousness: true,
          shimmerEffects: true,
          depthLayers: 4,
          musicSync: true,
          parallaxStrength: 0.5,
          animationSpeed: 0.7,
          blurQuality: "medium",
          webglEnabled: true
        };
        
      case "high":
        return {
          level: "high",
          liquidConsciousness: true,
          shimmerEffects: true,
          depthLayers: 6,
          musicSync: true,
          parallaxStrength: 0.8,
          animationSpeed: 1.0,
          blurQuality: "high",
          webglEnabled: true
        };
        
      default:
        return {
          level: "medium",
          liquidConsciousness: true,
          shimmerEffects: true,
          depthLayers: 4,
          musicSync: true,
          parallaxStrength: 0.5,
          animationSpeed: 0.7,
          blurQuality: "medium",
          webglEnabled: true
        };
    }
  }
  
  private startPerformanceMonitoring(): void {
    // Monitor performance every 2 seconds
    this.monitoringInterval = window.setInterval(() => {
      this.updatePerformanceMetrics();
      this.analyzePerformance();
    }, 2000);
  }
  
  private updatePerformanceMetrics(): void {
    // Update FPS
    this.currentMetrics.fps = this.performanceAnalyzer.getMedianFPS?.() || 60;
    
    // Update memory usage
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.currentMetrics.memoryUsage = memInfo.usedJSHeapSize / (1024 * 1024); // MB
    }
    
    // Update render time
    this.currentMetrics.renderTime = this.performanceAnalyzer.getAverageTime?.('render') || 0;
    
    // Update frame drops
    const currentFrameDrops = this.performanceAnalyzer.getMedianFPS?.() < 30 ? 1 : 0; // Estimate frame drops based on FPS
    this.currentMetrics.frameDrops = currentFrameDrops;
    
    // Detect thermal throttling
    this.detectThermalThrottling();
    
    // Update CSS variables for monitoring
    this.updatePerformanceVariables();
  }
  
  private detectThermalThrottling(): void {
    const previousThermalState = this.currentMetrics.thermalState;
    
    // Detect thermal throttling based on performance degradation
    if (this.currentMetrics.fps < 30 && this.currentMetrics.renderTime > 50) {
      this.currentMetrics.thermalState = "critical";
    } else if (this.currentMetrics.fps < 40 && this.currentMetrics.renderTime > 30) {
      this.currentMetrics.thermalState = "serious";
    } else if (this.currentMetrics.fps < 50 && this.currentMetrics.renderTime > 20) {
      this.currentMetrics.thermalState = "fair";
    } else {
      this.currentMetrics.thermalState = "normal";
    }
    
    // React to thermal state changes
    if (previousThermalState !== this.currentMetrics.thermalState) {
      this.handleThermalStateChange();
    }
  }
  
  private handleThermalStateChange(): void {
    const thermalState = this.currentMetrics.thermalState;
    
    switch (thermalState) {
      case "critical":
        this.emergencyPerformanceMode();
        break;
        
      case "serious":
        this.reduceQualitySettings();
        break;
        
      case "fair":
        this.optimizeForBattery();
        break;
        
      case "normal":
        this.restoreOptimalSettings();
        break;
    }
    
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", `Thermal state changed to: ${thermalState}`);
  }
  
  private analyzePerformance(): void {
    const currentTime = performance.now();
    
    // Don't optimize too frequently
    if (currentTime - this.lastOptimizationCheck < 5000) return;
    this.lastOptimizationCheck = currentTime;
    
    const actions: PerformanceAction[] = [];
    
    // Check FPS performance
    if (this.currentMetrics.fps < this.adaptiveThresholds.fpsError) {
      actions.push({
        type: "disable",
        system: "liquid-consciousness",
        reason: `FPS critically low: ${this.currentMetrics.fps.toFixed(1)}`,
        priority: 1,
        timestamp: currentTime
      });
    } else if (this.currentMetrics.fps < this.adaptiveThresholds.fpsWarning) {
      actions.push({
        type: "reduce",
        system: "shimmer-effects",
        reason: `FPS below warning threshold: ${this.currentMetrics.fps.toFixed(1)}`,
        priority: 2,
        timestamp: currentTime
      });
    }
    
    // Check memory usage
    if (this.currentMetrics.memoryUsage > this.adaptiveThresholds.memoryError) {
      actions.push({
        type: "fallback",
        system: "webgl-gradients",
        reason: `Memory usage critical: ${this.currentMetrics.memoryUsage.toFixed(1)}MB`,
        priority: 1,
        timestamp: currentTime
      });
    } else if (this.currentMetrics.memoryUsage > this.adaptiveThresholds.memoryWarning) {
      actions.push({
        type: "optimize",
        system: "depth-layers",
        reason: `Memory usage warning: ${this.currentMetrics.memoryUsage.toFixed(1)}MB`,
        priority: 2,
        timestamp: currentTime
      });
    }
    
    // Check render time
    if (this.currentMetrics.renderTime > this.adaptiveThresholds.renderTimeError) {
      actions.push({
        type: "reduce",
        system: "animation-speed",
        reason: `Render time critical: ${this.currentMetrics.renderTime.toFixed(1)}ms`,
        priority: 1,
        timestamp: currentTime
      });
    }
    
    // Execute performance actions
    this.executePerformanceActions(actions);
  }
  
  private executePerformanceActions(actions: PerformanceAction[]): void {
    // Sort actions by priority (lower number = higher priority)
    actions.sort((a, b) => a.priority - b.priority);
    
    actions.forEach(action => {
      this.performanceActions.push(action);
      
      switch (action.type) {
        case "disable":
          this.disableSystem(action.system);
          break;
          
        case "reduce":
          this.reduceSystemQuality(action.system);
          break;
          
        case "optimize":
          this.optimizeSystem(action.system);
          break;
          
        case "fallback":
          this.fallbackSystem(action.system);
          break;
      }
      
      Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", `Performance action: ${action.type} ${action.system} - ${action.reason}`);
    });
    
    // Notify systems of quality changes
    if (actions.length > 0) {
      this.notifyQualityChange();
    }
  }
  
  private disableSystem(systemName: string): void {
    switch (systemName) {
      case "liquid-consciousness":
        this.qualitySettings.liquidConsciousness = false;
        break;
        
      case "shimmer-effects":
        this.qualitySettings.shimmerEffects = false;
        break;
        
      case "depth-layers":
        this.qualitySettings.depthLayers = 0;
        break;
        
      case "music-sync":
        this.qualitySettings.musicSync = false;
        break;
        
      case "webgl-gradients":
        this.qualitySettings.webglEnabled = false;
        break;
    }
  }
  
  private reduceSystemQuality(systemName: string): void {
    switch (systemName) {
      case "shimmer-effects":
        this.qualitySettings.shimmerEffects = false;
        break;
        
      case "depth-layers":
        this.qualitySettings.depthLayers = Math.max(1, this.qualitySettings.depthLayers - 1);
        break;
        
      case "animation-speed":
        this.qualitySettings.animationSpeed = Math.max(0.2, this.qualitySettings.animationSpeed - 0.1);
        break;
        
      case "parallax-strength":
        this.qualitySettings.parallaxStrength = Math.max(0.1, this.qualitySettings.parallaxStrength - 0.1);
        break;
        
      case "blur-quality":
        if (this.qualitySettings.blurQuality === "high") {
          this.qualitySettings.blurQuality = "medium";
        } else if (this.qualitySettings.blurQuality === "medium") {
          this.qualitySettings.blurQuality = "low";
        }
        break;
    }
  }
  
  private optimizeSystem(systemName: string): void {
    switch (systemName) {
      case "depth-layers":
        this.qualitySettings.depthLayers = Math.max(2, this.qualitySettings.depthLayers - 1);
        break;
        
      case "liquid-consciousness":
        this.qualitySettings.animationSpeed = Math.max(0.3, this.qualitySettings.animationSpeed - 0.2);
        break;
        
      case "shimmer-effects":
        this.qualitySettings.animationSpeed = Math.max(0.4, this.qualitySettings.animationSpeed - 0.1);
        break;
    }
  }
  
  private fallbackSystem(systemName: string): void {
    switch (systemName) {
      case "webgl-gradients":
        this.qualitySettings.webglEnabled = false;
        this.qualitySettings.liquidConsciousness = false;
        break;
        
      case "all-effects":
        this.qualitySettings.liquidConsciousness = false;
        this.qualitySettings.shimmerEffects = false;
        this.qualitySettings.depthLayers = 1;
        this.qualitySettings.webglEnabled = false;
        break;
    }
  }
  
  private emergencyPerformanceMode(): void {
    Y3K?.debug?.warn("RealityBleedingPerformanceOptimizer", "Emergency performance mode activated");
    
    // Disable all non-essential effects
    this.qualitySettings.liquidConsciousness = false;
    this.qualitySettings.shimmerEffects = false;
    this.qualitySettings.depthLayers = 0;
    this.qualitySettings.webglEnabled = false;
    this.qualitySettings.animationSpeed = 0.2;
    this.qualitySettings.parallaxStrength = 0.1;
    this.qualitySettings.blurQuality = "low";
    this.qualitySettings.level = "ultra-low";
    
    this.notifyQualityChange();
  }
  
  private reduceQualitySettings(): void {
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", "Reducing quality settings");
    
    // Reduce quality one level
    const currentLevel = this.qualitySettings.level;
    const qualityLevels = ["ultra-low", "low", "medium", "high", "ultra-high"];
    const currentIndex = qualityLevels.indexOf(currentLevel);
    
    if (currentIndex > 0) {
      const newLevel = qualityLevels[currentIndex - 1] as QualitySettings["level"];
      this.setQualityLevel(newLevel);
    }
  }
  
  private optimizeForBattery(): void {
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", "Optimizing for battery");
    
    // Reduce animation speed and effects
    this.qualitySettings.animationSpeed = Math.max(0.3, this.qualitySettings.animationSpeed - 0.2);
    this.qualitySettings.parallaxStrength = Math.max(0.2, this.qualitySettings.parallaxStrength - 0.1);
    
    if (this.qualitySettings.depthLayers > 3) {
      this.qualitySettings.depthLayers = 3;
    }
    
    this.notifyQualityChange();
  }
  
  private restoreOptimalSettings(): void {
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", "Restoring optimal settings");
    
    // Gradually restore settings
    const deviceQuality = this.deviceCapabilities.recommendPerformanceQuality();
    const optimalSettings = this.initializeQualitySettings();
    
    // Restore settings gradually to avoid sudden performance spikes
    setTimeout(() => {
      this.qualitySettings = optimalSettings;
      this.notifyQualityChange();
    }, 2000);
  }
  
  private updatePerformanceVariables(): void {
    // Update CSS variables for performance monitoring
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-performance-fps',
      this.currentMetrics.fps.toFixed(1)
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-performance-memory',
      this.currentMetrics.memoryUsage.toFixed(1)
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-performance-render-time',
      this.currentMetrics.renderTime.toFixed(1)
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-performance-thermal-state',
      this.currentMetrics.thermalState
    );
    
    this.cssVariableBatcher.queueCSSVariableUpdate(
      '--sn-performance-quality-level',
      this.qualitySettings.level
    );
  }
  
  private notifyQualityChange(): void {
    // Notify all registered systems about quality changes
    this.optimizationCallbacks.forEach((callback, systemName) => {
      try {
        callback(this.qualitySettings);
      } catch (error) {
        Y3K?.debug?.error("RealityBleedingPerformanceOptimizer", `Error notifying ${systemName}:`, error);
      }
    });
    
    // Dispatch global event
    document.dispatchEvent(new CustomEvent('performance:quality-changed', {
      detail: {
        qualitySettings: this.qualitySettings,
        metrics: this.currentMetrics,
        timestamp: performance.now()
      }
    }));
  }
  
  private setQualityLevel(level: QualitySettings["level"]): void {
    this.qualitySettings.level = level;
    
    // Adjust settings based on quality level
    switch (level) {
      case "ultra-low":
        this.qualitySettings.liquidConsciousness = false;
        this.qualitySettings.shimmerEffects = false;
        this.qualitySettings.depthLayers = 0;
        this.qualitySettings.webglEnabled = false;
        this.qualitySettings.animationSpeed = 0.2;
        this.qualitySettings.parallaxStrength = 0.1;
        this.qualitySettings.blurQuality = "low";
        break;
        
      case "low":
        this.qualitySettings.liquidConsciousness = false;
        this.qualitySettings.shimmerEffects = false;
        this.qualitySettings.depthLayers = 2;
        this.qualitySettings.webglEnabled = false;
        this.qualitySettings.animationSpeed = 0.5;
        this.qualitySettings.parallaxStrength = 0.2;
        this.qualitySettings.blurQuality = "low";
        break;
        
      case "medium":
        this.qualitySettings.liquidConsciousness = true;
        this.qualitySettings.shimmerEffects = true;
        this.qualitySettings.depthLayers = 4;
        this.qualitySettings.webglEnabled = true;
        this.qualitySettings.animationSpeed = 0.7;
        this.qualitySettings.parallaxStrength = 0.5;
        this.qualitySettings.blurQuality = "medium";
        break;
        
      case "high":
        this.qualitySettings.liquidConsciousness = true;
        this.qualitySettings.shimmerEffects = true;
        this.qualitySettings.depthLayers = 6;
        this.qualitySettings.webglEnabled = true;
        this.qualitySettings.animationSpeed = 1.0;
        this.qualitySettings.parallaxStrength = 0.8;
        this.qualitySettings.blurQuality = "high";
        break;
        
      case "ultra-high":
        this.qualitySettings.liquidConsciousness = true;
        this.qualitySettings.shimmerEffects = true;
        this.qualitySettings.depthLayers = 9;
        this.qualitySettings.webglEnabled = true;
        this.qualitySettings.animationSpeed = 1.2;
        this.qualitySettings.parallaxStrength = 1.0;
        this.qualitySettings.blurQuality = "high";
        break;
    }
    
    this.notifyQualityChange();
  }
  
  // Public API
  public registerOptimizationCallback(systemName: string, callback: (quality: QualitySettings) => void): void {
    this.optimizationCallbacks.set(systemName, callback);
  }
  
  public unregisterOptimizationCallback(systemName: string): void {
    this.optimizationCallbacks.delete(systemName);
  }
  
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.currentMetrics };
  }
  
  public getQualitySettings(): QualitySettings {
    return { ...this.qualitySettings };
  }
  
  public getPerformanceActions(): PerformanceAction[] {
    return [...this.performanceActions];
  }
  
  public forceQualityLevel(level: QualitySettings["level"]): void {
    this.setQualityLevel(level);
  }
  
  public enableEmergencyMode(): void {
    this.emergencyPerformanceMode();
  }
  
  public restoreDefaults(): void {
    this.qualitySettings = this.initializeQualitySettings();
    this.notifyQualityChange();
  }
  
  public isPerformanceOptimal(): boolean {
    return this.currentMetrics.fps >= this.adaptiveThresholds.fpsWarning &&
           this.currentMetrics.memoryUsage <= this.adaptiveThresholds.memoryWarning &&
           this.currentMetrics.renderTime <= this.adaptiveThresholds.renderTimeWarning;
  }
  
  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.optimizationCallbacks.clear();
    this.performanceActions.length = 0;
    
    Y3K?.debug?.log("RealityBleedingPerformanceOptimizer", "Performance optimizer destroyed");
  }
}