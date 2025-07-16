/**
 * GradientTransitionOrchestrator - Seamless WebGL ↔ CSS Transition System
 * Part of the Year 3000 PHASE 6 Final Integration
 *
 * Orchestrates intelligent transitions between CSS gradients and WebGL-powered visuals
 * based on hardware capabilities, performance metrics, and user preferences.
 * 
 * Features:
 * - Automatic capability detection and quality scaling
 * - Real-time performance monitoring with fallback triggers
 * - Smooth visual transitions during backend switches
 * - State synchronization between CSS and WebGL systems
 * - Progressive enhancement with graceful degradation
 * - User preference and accessibility consideration
 */

import { Y3K } from "@/debug/SystemHealthMonitor";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { WebGLGradientBackgroundSystem } from "@/visual/backgrounds/WebGLGradientBackgroundSystem";
import { FluxConsciousnessLayers } from "@/visual/backgrounds/FluxConsciousnessLayers";
import { WebGLBackplaneAdapter } from "@/visual/backgrounds/WebGLBackplaneAdapter";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";

export type GradientBackend = "css" | "webgl" | "hybrid";
export type TransitionMode = "instant" | "crossfade" | "progressive";
export type QualityLevel = "auto" | "low" | "balanced" | "high" | "ultra";

export interface TransitionConfig {
  mode: TransitionMode;
  duration: number;          // Transition duration in ms
  easing: string;           // CSS easing function
  preserveState: boolean;   // Whether to preserve gradient state during transition
  fallbackDelay: number;    // Delay before falling back on performance issues (ms)
}

export interface PerformanceThresholds {
  minFPS: number;           // Minimum FPS to maintain WebGL
  maxMemoryMB: number;      // Maximum memory usage for WebGL
  maxCPUPercent: number;    // Maximum CPU usage
  maxGPUPercent: number;    // Maximum GPU usage
  stabilityWindow: number;  // Time window for performance stability check (ms)
}

export interface BackendCapabilities {
  webglAvailable: boolean;
  webgl2Supported: boolean;
  maxTextureSize: number;
  shaderComplexity: "low" | "medium" | "high";
  deviceTier: "low" | "medium" | "high";
  memoryEstimateMB: number;
}

export interface GradientState {
  colors: Array<{ r: number; g: number; b: number; a: number; position: number }>;
  emotionalProfile: any;
  genreInfo: any;
  musicMetrics: any;
  consciousnessLevel: number;
  timestamp: number;
}

export class GradientTransitionOrchestrator {
  private cssVariableBatcher: CSSVariableBatcher;
  private deviceDetector: DeviceCapabilityDetector;
  private performanceAnalyzer: PerformanceAnalyzer;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;

  // System components
  private fluxConsciousnessLayers: FluxConsciousnessLayers | null = null;
  private webglBackgroundSystem: WebGLGradientBackgroundSystem | null = null;
  private webglAdapter: WebGLBackplaneAdapter | null = null;

  // State management
  private currentBackend: GradientBackend = "css";
  private targetBackend: GradientBackend = "css";
  private transitionInProgress = false;
  private lastGradientState: GradientState | null = null;
  private capabilities: BackendCapabilities;

  // Configuration
  private transitionConfig: TransitionConfig = {
    mode: "crossfade",
    duration: 800,
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    preserveState: true,
    fallbackDelay: 2000
  };

  private performanceThresholds: PerformanceThresholds = {
    minFPS: 45,
    maxMemoryMB: 50,
    maxCPUPercent: 15,
    maxGPUPercent: 30,
    stabilityWindow: 5000
  };

  // Performance tracking
  private performanceHistory: Array<{
    timestamp: number;
    fps: number;
    memoryMB: number;
    cpuPercent: number;
    gpuPercent: number;
  }> = [];
  private performanceCheckInterval: number | null = null;
  private fallbackTimer: number | null = null;

  // Event listeners
  private boundPerformanceCheck: (() => void) | null = null;
  private boundSettingsChange: ((event: Event) => void) | null = null;
  private boundVisibilityChange: (() => void) | null = null;

  // User preferences
  private userPreferences = {
    preferredBackend: "auto" as GradientBackend | "auto",
    qualityLevel: "auto" as QualityLevel,
    reducedMotion: false,
    batteryConservation: false,
    accessibilityMode: false
  };

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
    this.capabilities = this.detectCapabilities();

    this.boundPerformanceCheck = this.performanceCheck.bind(this);
    this.boundSettingsChange = this.handleSettingsChange.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);

    Y3K?.debug?.log("GradientTransitionOrchestrator", "Initialized with capabilities:", this.capabilities);
  }

  public async initialize(
    fluxConsciousnessLayers: FluxConsciousnessLayers,
    webglBackgroundSystem?: WebGLGradientBackgroundSystem
  ): Promise<void> {
    this.fluxConsciousnessLayers = fluxConsciousnessLayers;
    this.webglBackgroundSystem = webglBackgroundSystem || null;

    // Create WebGL adapter if WebGL system is available
    if (this.webglBackgroundSystem) {
      this.webglAdapter = new WebGLBackplaneAdapter(
        this.webglBackgroundSystem,
        this.cssVariableBatcher
      );
    }

    // Load user preferences
    this.loadUserPreferences();

    // Determine initial backend based on capabilities and preferences
    this.targetBackend = this.determineOptimalBackend();

    // Initialize systems
    await this.initializeBackend(this.targetBackend);

    // Set up monitoring
    this.startPerformanceMonitoring();
    this.subscribeToEvents();

    // Update CSS variables to reflect current state
    this.updateCSSTransitionState();

    Y3K?.debug?.log("GradientTransitionOrchestrator", `Initialized with backend: ${this.targetBackend}`);
  }

  private detectCapabilities(): BackendCapabilities {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    
    const webglAvailable = !!gl;
    const webgl2Supported = gl instanceof WebGL2RenderingContext;
    const deviceTier = this.deviceDetector.recommendPerformanceQuality() as "low" | "medium" | "high";

    let maxTextureSize = 0;
    let memoryEstimateMB = 16; // Conservative fallback

    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      
      // Estimate available GPU memory (rough approximation)
      const renderer = gl.getParameter(gl.RENDERER) || "";
      if (renderer.toLowerCase().includes("intel")) {
        memoryEstimateMB = deviceTier === "high" ? 64 : 32;
      } else if (renderer.toLowerCase().includes("nvidia") || renderer.toLowerCase().includes("amd")) {
        memoryEstimateMB = deviceTier === "high" ? 128 : deviceTier === "medium" ? 64 : 32;
      }
    }

    const shaderComplexity: "low" | "medium" | "high" = 
      deviceTier === "high" ? "high" : 
      deviceTier === "medium" ? "medium" : "low";

    return {
      webglAvailable,
      webgl2Supported,
      maxTextureSize,
      shaderComplexity,
      deviceTier,
      memoryEstimateMB
    };
  }

  private loadUserPreferences(): void {
    if (!this.settingsManager) return;

    try {
      // Check for reduced motion preference
      this.userPreferences.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      // Check battery conservation (if supported)
      if ("getBattery" in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          this.userPreferences.batteryConservation = !battery.charging && battery.level < 0.3;
        }).catch(() => {
          // Battery API not available or permission denied
        });
      }

      // Load user-specific settings
      const preferredBackend = this.settingsManager.get("sn-gradient-backend" as any);
      if (preferredBackend) {
        this.userPreferences.preferredBackend = preferredBackend as any;
      }

      const qualityLevel = this.settingsManager.get("sn-gradient-quality" as any);
      if (qualityLevel) {
        this.userPreferences.qualityLevel = qualityLevel as any;
      }

      Y3K?.debug?.log("GradientTransitionOrchestrator", "User preferences loaded:", this.userPreferences);
    } catch (error) {
      Y3K?.debug?.warn("GradientTransitionOrchestrator", "Failed to load user preferences:", error);
    }
  }

  private determineOptimalBackend(): GradientBackend {
    // User has explicit preference
    if (this.userPreferences.preferredBackend !== "auto") {
      if (this.userPreferences.preferredBackend === "webgl" && !this.capabilities.webglAvailable) {
        Y3K?.debug?.warn("GradientTransitionOrchestrator", "User prefers WebGL but it's not available, falling back to CSS");
        return "css";
      }
      return this.userPreferences.preferredBackend;
    }

    // Accessibility considerations
    if (this.userPreferences.reducedMotion || this.userPreferences.accessibilityMode) {
      return "css";
    }

    // Battery conservation mode
    if (this.userPreferences.batteryConservation) {
      return "css";
    }

    // Device capability assessment
    if (!this.capabilities.webglAvailable) {
      return "css";
    }

    if (this.capabilities.deviceTier === "low") {
      return "css";
    }

    if (this.capabilities.deviceTier === "medium") {
      // Use hybrid mode for medium devices - WebGL for complex scenes, CSS for simple ones
      return "hybrid";
    }

    // High-end devices get WebGL by default
    return "webgl";
  }

  private async initializeBackend(backend: GradientBackend): Promise<void> {
    try {
      switch (backend) {
        case "css":
          await this.initializeCSSBackend();
          break;
        case "webgl":
          await this.initializeWebGLBackend();
          break;
        case "hybrid":
          await this.initializeHybridBackend();
          break;
      }
      this.currentBackend = backend;
    } catch (error) {
      Y3K?.debug?.error("GradientTransitionOrchestrator", `Failed to initialize ${backend} backend:`, error);
      
      // Fallback to CSS if WebGL initialization fails
      if (backend !== "css") {
        await this.initializeCSSBackend();
        this.currentBackend = "css";
      }
    }
  }

  private async initializeCSSBackend(): Promise<void> {
    // CSS backend is always available through FluxConsciousnessLayers
    this.cssVariableBatcher.setProperty("--sn-gradient-backend", "css");
    this.cssVariableBatcher.setProperty("--sn-webgl-ready", "0");
    this.cssVariableBatcher.setProperty("--sn-gradient-transition-active", "0");

    Y3K?.debug?.log("GradientTransitionOrchestrator", "CSS backend initialized");
  }

  private async initializeWebGLBackend(): Promise<void> {
    if (!this.webglAdapter) {
      throw new Error("WebGL adapter not available");
    }

    await this.webglAdapter.initialize();
    
    this.cssVariableBatcher.setProperty("--sn-gradient-backend", "webgl");
    this.cssVariableBatcher.setProperty("--sn-webgl-ready", "1");
    this.cssVariableBatcher.setProperty("--sn-gradient-transition-active", "0");

    // Sync current gradient state
    await this.syncGradientState("css", "webgl");

    Y3K?.debug?.log("GradientTransitionOrchestrator", "WebGL backend initialized");
  }

  private async initializeHybridBackend(): Promise<void> {
    // Initialize both backends for hybrid mode
    await this.initializeCSSBackend();
    
    if (this.webglAdapter) {
      try {
        await this.webglAdapter.initialize();
        this.cssVariableBatcher.setProperty("--sn-gradient-backend", "hybrid");
        this.cssVariableBatcher.setProperty("--sn-webgl-ready", "1");
      } catch (error) {
        Y3K?.debug?.warn("GradientTransitionOrchestrator", "WebGL failed in hybrid mode, using CSS only:", error);
        this.cssVariableBatcher.setProperty("--sn-gradient-backend", "css");
        this.cssVariableBatcher.setProperty("--sn-webgl-ready", "0");
      }
    }

    Y3K?.debug?.log("GradientTransitionOrchestrator", "Hybrid backend initialized");
  }

  public async transitionToBackend(
    targetBackend: GradientBackend,
    config?: Partial<TransitionConfig>
  ): Promise<void> {
    if (this.transitionInProgress || this.currentBackend === targetBackend) {
      return;
    }

    const transitionConfig = { ...this.transitionConfig, ...config };
    this.transitionInProgress = true;
    this.targetBackend = targetBackend;

    Y3K?.debug?.log("GradientTransitionOrchestrator", `Transitioning from ${this.currentBackend} to ${targetBackend}`);

    try {
      // Update CSS to indicate transition in progress
      this.cssVariableBatcher.setProperty("--sn-gradient-transition-active", "1");
      this.cssVariableBatcher.setProperty("--sn-gradient-transition-duration", `${transitionConfig.duration}ms`);
      this.cssVariableBatcher.setProperty("--sn-gradient-transition-easing", transitionConfig.easing);

      // Capture current state if preserving
      if (transitionConfig.preserveState) {
        this.lastGradientState = await this.captureGradientState();
      }

      switch (transitionConfig.mode) {
        case "instant":
          await this.instantTransition(targetBackend);
          break;
        case "crossfade":
          await this.crossfadeTransition(targetBackend, transitionConfig);
          break;
        case "progressive":
          await this.progressiveTransition(targetBackend, transitionConfig);
          break;
      }

      this.currentBackend = targetBackend;
      
      // Sync state to new backend
      if (transitionConfig.preserveState && this.lastGradientState) {
        await this.restoreGradientState(this.lastGradientState);
      }

    } catch (error) {
      Y3K?.debug?.error("GradientTransitionOrchestrator", "Transition failed:", error);
      
      // Fallback to CSS on transition failure
      if (targetBackend !== "css") {
        await this.initializeCSSBackend();
        this.currentBackend = "css";
      }
    } finally {
      this.transitionInProgress = false;
      this.cssVariableBatcher.setProperty("--sn-gradient-transition-active", "0");
      this.updateCSSTransitionState();
    }
  }

  private async instantTransition(targetBackend: GradientBackend): Promise<void> {
    await this.initializeBackend(targetBackend);
  }

  private async crossfadeTransition(
    targetBackend: GradientBackend,
    config: TransitionConfig
  ): Promise<void> {
    // Initialize target backend while keeping current one active
    const tempElement = document.createElement("div");
    tempElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -9;
      opacity: 0;
      transition: opacity ${config.duration}ms ${config.easing};
      pointer-events: none;
    `;

    document.body.appendChild(tempElement);

    // Initialize new backend
    await this.initializeBackend(targetBackend);

    // Crossfade by adjusting opacity
    this.cssVariableBatcher.setProperty("--sn-gradient-crossfade-opacity", "0");
    
    // Trigger crossfade
    requestAnimationFrame(() => {
      tempElement.style.opacity = "1";
      this.cssVariableBatcher.setProperty("--sn-gradient-crossfade-opacity", "1");
    });

    // Wait for transition to complete
    await new Promise(resolve => setTimeout(resolve, config.duration));

    // Clean up
    document.body.removeChild(tempElement);
  }

  private async progressiveTransition(
    targetBackend: GradientBackend,
    config: TransitionConfig
  ): Promise<void> {
    // Progressive transition gradually shifts rendering responsibility
    const steps = 10;
    const stepDuration = config.duration / steps;

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      
      // Update transition progress
      this.cssVariableBatcher.setProperty("--sn-gradient-transition-progress", progress.toString());
      
      if (i === Math.floor(steps / 2)) {
        // Initialize new backend at midpoint
        await this.initializeBackend(targetBackend);
      }
      
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  private async captureGradientState(): Promise<GradientState> {
    const colors: Array<{ r: number; g: number; b: number; a: number; position: number }> = [];
    
    // Extract current gradient colors from ColorHarmonyEngine
    if (this.colorHarmonyEngine) {
      try {
        const currentGradient = this.colorHarmonyEngine.getCurrentGradient(5);
        if (currentGradient && currentGradient.length > 0) {
          currentGradient.forEach((color, index) => {
            colors.push({
              r: color.r,
              g: color.g,
              b: color.b,
              a: 1.0,
              position: index / (currentGradient.length - 1)
            });
          });
        }
      } catch (error) {
        Y3K?.debug?.warn("GradientTransitionOrchestrator", "Failed to capture gradient colors:", error);
      }
    }

    // Capture other state from FluxConsciousnessLayers
    const consciousnessMetrics = this.fluxConsciousnessLayers?.getConsciousnessMetrics();

    return {
      colors,
      emotionalProfile: consciousnessMetrics?.emotionalProfile || null,
      genreInfo: {
        genre: consciousnessMetrics?.currentGenre || "unknown",
        confidence: consciousnessMetrics?.genreConfidence || 0
      },
      musicMetrics: consciousnessMetrics?.spectralData || null,
      consciousnessLevel: consciousnessMetrics?.consciousnessLevel || 0.7,
      timestamp: performance.now()
    };
  }

  private async restoreGradientState(state: GradientState): Promise<void> {
    // Restore state to active backend
    if (this.currentBackend === "webgl" && this.webglAdapter) {
      try {
        // Update WebGL system with captured state
        this.webglAdapter.setPalette(state.colors);
        
        if (state.musicMetrics) {
          this.webglAdapter.setMusicMetrics(state.musicMetrics);
        }
      } catch (error) {
        Y3K?.debug?.warn("GradientTransitionOrchestrator", "Failed to restore WebGL state:", error);
      }
    }

    // Update CSS variables for state continuity
    if (state.colors.length > 0) {
      state.colors.forEach((color, index) => {
        this.cssVariableBatcher.setProperty(
          `--sn-transition-color-${index}`,
          `${color.r}, ${color.g}, ${color.b}`
        );
      });
    }
  }

  private async syncGradientState(fromBackend: GradientBackend, toBackend: GradientBackend): Promise<void> {
    try {
      const state = await this.captureGradientState();
      await this.restoreGradientState(state);
      
      Y3K?.debug?.log("GradientTransitionOrchestrator", `Synced gradient state from ${fromBackend} to ${toBackend}`);
    } catch (error) {
      Y3K?.debug?.warn("GradientTransitionOrchestrator", "Failed to sync gradient state:", error);
    }
  }

  private startPerformanceMonitoring(): void {
    if (this.performanceCheckInterval) {
      clearInterval(this.performanceCheckInterval);
      this.performanceCheckInterval = null;
    }

    this.performanceCheckInterval = window.setInterval(this.boundPerformanceCheck!, 1000);
  }

  private performanceCheck(): void {
    if (!this.performanceAnalyzer) return;

    const fps = this.performanceAnalyzer.getMedianFPS() || 0;
    const memoryInfo = (performance as any).memory;
    const memoryMB = memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;

    // Estimate CPU/GPU usage (simplified)
    const cpuPercent = fps < this.performanceThresholds.minFPS ? 20 : 5;
    const gpuPercent = this.currentBackend === "webgl" ? 15 : 2;

    // Store performance data
    this.performanceHistory.push({
      timestamp: performance.now(),
      fps,
      memoryMB,
      cpuPercent,
      gpuPercent
    });

    // Keep only recent history
    const cutoff = performance.now() - this.performanceThresholds.stabilityWindow;
    this.performanceHistory = this.performanceHistory.filter(entry => entry.timestamp > cutoff);

    // Check if performance degradation requires fallback
    this.checkPerformanceFallback();
  }

  private checkPerformanceFallback(): void {
    if (this.currentBackend === "css" || this.performanceHistory.length < 3) {
      return;
    }

    const recentMetrics = this.performanceHistory.slice(-3);
    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memoryMB, 0) / recentMetrics.length;

    const shouldFallback = 
      avgFPS < this.performanceThresholds.minFPS ||
      avgMemory > this.performanceThresholds.maxMemoryMB;

    if (shouldFallback && !this.fallbackTimer) {
      Y3K?.debug?.warn("GradientTransitionOrchestrator", 
        `Performance degradation detected - FPS: ${avgFPS.toFixed(1)}, Memory: ${avgMemory.toFixed(1)}MB`);
      
      // Start fallback timer
      this.fallbackTimer = window.setTimeout(() => {
        this.performanceFallback();
        this.fallbackTimer = null;
      }, this.transitionConfig.fallbackDelay);
    } else if (!shouldFallback && this.fallbackTimer) {
      // Cancel fallback if performance recovers
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
      Y3K?.debug?.log("GradientTransitionOrchestrator", "Performance recovered, fallback cancelled");
    }
  }

  private performanceFallback(): void {
    Y3K?.debug?.log("GradientTransitionOrchestrator", "Executing performance fallback to CSS");
    
    this.transitionToBackend("css", {
      mode: "crossfade",
      duration: 600,
      preserveState: true
    });
  }

  private subscribeToEvents(): void {
    if (this.settingsManager && this.boundSettingsChange) {
      document.addEventListener("year3000SystemSettingsChanged", this.boundSettingsChange);
    }

    if (this.boundVisibilityChange) {
      document.addEventListener("visibilitychange", this.boundVisibilityChange);
    }

    // Listen for battery changes
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        battery.addEventListener("chargingchange", () => {
          this.userPreferences.batteryConservation = !battery.charging && battery.level < 0.3;
          this.adaptToUserPreferences();
        });
        
        battery.addEventListener("levelchange", () => {
          this.userPreferences.batteryConservation = !battery.charging && battery.level < 0.3;
          this.adaptToUserPreferences();
        });
      }).catch(() => {
        // Battery API not available
      });
    }
  }

  private handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key === "sn-gradient-backend") {
      this.userPreferences.preferredBackend = value;
      this.adaptToUserPreferences();
    } else if (key === "sn-gradient-quality") {
      this.userPreferences.qualityLevel = value;
      this.adaptToUserPreferences();
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Reduce performance when tab is hidden
      if (this.currentBackend === "webgl") {
        this.webglAdapter?.setEnabled(false);
      }
    } else {
      // Restore performance when tab becomes visible
      if (this.currentBackend === "webgl") {
        this.webglAdapter?.setEnabled(true);
      }
    }
  }

  private adaptToUserPreferences(): void {
    const optimalBackend = this.determineOptimalBackend();
    
    if (optimalBackend !== this.currentBackend && !this.transitionInProgress) {
      this.transitionToBackend(optimalBackend);
    }
  }

  private updateCSSTransitionState(): void {
    this.cssVariableBatcher.setProperty("--sn-current-backend", this.currentBackend);
    this.cssVariableBatcher.setProperty("--sn-webgl-enabled", this.currentBackend === "webgl" ? "1" : "0");
    this.cssVariableBatcher.setProperty("--sn-hybrid-mode", this.currentBackend === "hybrid" ? "1" : "0");
  }

  // Public API methods
  public getCurrentBackend(): GradientBackend {
    return this.currentBackend;
  }

  public getCapabilities(): BackendCapabilities {
    return { ...this.capabilities };
  }

  public getPerformanceMetrics() {
    if (this.performanceHistory.length === 0) {
      return null;
    }

    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    return { ...latest };
  }

  public async forceBackend(backend: GradientBackend): Promise<void> {
    this.userPreferences.preferredBackend = backend;
    await this.transitionToBackend(backend);
  }

  public setTransitionConfig(config: Partial<TransitionConfig>): void {
    this.transitionConfig = { ...this.transitionConfig, ...config };
  }

  public setPerformanceThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.performanceThresholds = { ...this.performanceThresholds, ...thresholds };
  }

  public destroy(): void {
    // Stop monitoring
    if (this.performanceCheckInterval) {
      clearInterval(this.performanceCheckInterval);
      this.performanceCheckInterval = null;
    }

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    // Remove event listeners
    if (this.boundSettingsChange) {
      document.removeEventListener("year3000SystemSettingsChanged", this.boundSettingsChange);
    }

    if (this.boundVisibilityChange) {
      document.removeEventListener("visibilitychange", this.boundVisibilityChange);
    }

    // Clean up systems
    this.webglAdapter?.destroy();

    // Reset CSS state
    this.cssVariableBatcher.setProperty("--sn-gradient-backend", "css");
    this.cssVariableBatcher.setProperty("--sn-webgl-ready", "0");
    this.cssVariableBatcher.setProperty("--sn-gradient-transition-active", "0");

    Y3K?.debug?.log("GradientTransitionOrchestrator", "Destroyed");
  }
}