/**
 * GradientTransitionOrchestrator - Seamless WebGL ↔ CSS Transition System

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

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { unifiedEventBus, type EventData } from "@/core/events/UnifiedEventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { WebGLGradientBackgroundSystem } from "@/visual/background/WebGLRenderer";
import type {
  BackendCapabilities,
  HealthCheckResult,
  IManagedSystem,
  MusicMetrics,
  PerformanceConstraints,
  RGBStop,
} from "@/types/systems";

export type GradientBackend = "css" | "webgl" | "hybrid";
export type TransitionMode = "instant" | "crossfade" | "progressive";
export type QualityLevel = "auto" | "low" | "balanced" | "high" | "ultra";

export interface TransitionConfig {
  mode: TransitionMode;
  duration: number; // Transition duration in ms
  easing: string; // CSS easing function
  preserveState: boolean; // Whether to preserve gradient state during transition
  fallbackDelay: number; // Delay before falling back on performance issues (ms)
}

export interface PerformanceThresholds {
  minFPS: number; // Minimum FPS to maintain WebGL
  maxMemoryMB: number; // Maximum memory usage for WebGL
  maxCPUPercent: number; // Maximum CPU usage
  maxGPUPercent: number; // Maximum GPU usage
  stabilityWindow: number; // Time window for performance stability check (ms)
}

// BackendCapabilities is imported from @/types/systems

export interface GradientState {
  colors: Array<{
    r: number;
    g: number;
    b: number;
    a: number;
    position: number;
  }>;
  emotionalProfile: any;
  genreInfo: any;
  musicMetrics: any;
  visualEffectsLevel: number;
  timestamp: number;
}

export class TransitionCoordinator implements IManagedSystem {
  public readonly systemName = "TransitionCoordinator";
  public initialized = false;
  private cssController: UnifiedCSSVariableManager;
  private deviceDetector: DeviceCapabilityDetector;
  private performanceAnalyzer: SimplePerformanceCoordinator;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;

  // System components
  private webglBackgroundSystem: WebGLGradientBackgroundSystem | null = null;

  // Inlined WebGL adapter state
  private webglReady = false;
  private webglCapabilities: BackendCapabilities;
  private webglEnabled = false;
  private webglConstraints: PerformanceConstraints;

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
    fallbackDelay: 2000,
  };

  private performanceThresholds: PerformanceThresholds = {
    minFPS: 45,
    maxMemoryMB: 50,
    maxCPUPercent: 15,
    maxGPUPercent: 30,
    stabilityWindow: 5000,
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

  // Event listeners (legacy DOM events - being phased out)
  private boundPerformanceCheck: (() => void) | null = null;
  private boundSettingsChange: ((event: Event) => void) | null = null;
  private boundVisibilityChange: (() => void) | null = null;

  // Unified Event Bus subscriptions
  private eventSubscriptionIds: string[] = [];

  // User preferences
  private userPreferences = {
    preferredBackend: "auto" as GradientBackend | "auto",
    qualityLevel: "auto" as QualityLevel,
    reducedMotion: false,
    batteryConservation: false,
    accessibilityMode: false,
  };

  constructor(
    cssController: UnifiedCSSVariableManager,
    performanceAnalyzer: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    colorHarmonyEngine: ColorHarmonyEngine | null = null
  ) {
    this.cssController = cssController;
    this.performanceAnalyzer = performanceAnalyzer;
    this.musicSyncService = musicSyncService;
    this.settingsManager = settingsManager;
    this.colorHarmonyEngine = colorHarmonyEngine;

    this.deviceDetector = new DeviceCapabilityDetector();
    this.capabilities = this.detectCapabilities();

    // Initialize inlined WebGL adapter state
    this.webglCapabilities = this.detectWebGLCapabilities();
    this.webglConstraints = {
      targetFPS: 60,
      maxMemoryMB: 50,
      cpuBudgetPercent: 10,
      gpuBudgetPercent: 25,
      qualityLevel: "high",
    };

    this.boundPerformanceCheck = this.performanceCheck.bind(this);
    this.boundSettingsChange = this.handleSettingsChange.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Initialized with capabilities:",
      this.capabilities
    );
  }

  public async initialize(
    webglBackgroundSystem?: WebGLGradientBackgroundSystem
  ): Promise<void> {
    this.webglBackgroundSystem = webglBackgroundSystem || null;

    // Initialize WebGL system if available (inlined adapter functionality)
    if (this.webglBackgroundSystem) {
      try {
        await this.webglBackgroundSystem.initialize();
        this.webglReady = this.webglBackgroundSystem.initialized;

        // Update CSS variable to indicate WebGL readiness
        this.cssController.setProperty(
          "--sn.bg.webgl.ready",
          this.webglReady ? "1" : "0"
        );

        Y3KDebug?.debug?.log(
          "GradientTransitionOrchestrator",
          "WebGL system initialized:",
          { ready: this.webglReady, capabilities: this.webglCapabilities }
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "GradientTransitionOrchestrator", 
          "WebGL initialization failed:",
          error
        );
        this.webglReady = false;
        this.cssController.setProperty("--sn.bg.webgl.ready", "0");
      }
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

    this.initialized = true;

    Y3KDebug?.debug?.log(
      "TransitionCoordinator",
      `Initialized with backend: ${this.targetBackend}`
    );
  }

  private detectCapabilities(): BackendCapabilities {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    const webglAvailable = !!gl;
    const webgl2Supported = gl instanceof WebGL2RenderingContext;
    const deviceTier = this.deviceDetector.recommendPerformanceQuality() as
      | "low"
      | "medium"
      | "high";

    let maxTextureSize = 0;
    let memoryEstimateMB = 16; // Conservative fallback

    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

      // Estimate available GPU memory (rough approximation)
      const renderer = gl.getParameter(gl.RENDERER) || "";
      if (renderer.toLowerCase().includes("intel")) {
        memoryEstimateMB = deviceTier === "high" ? 64 : 32;
      } else if (
        renderer.toLowerCase().includes("nvidia") ||
        renderer.toLowerCase().includes("amd")
      ) {
        memoryEstimateMB =
          deviceTier === "high" ? 128 : deviceTier === "medium" ? 64 : 32;
      }
    }

    const shaderComplexity: "low" | "medium" | "high" =
      deviceTier === "high"
        ? "high"
        : deviceTier === "medium"
        ? "medium"
        : "low";

    return {
      webgl: webglAvailable,
      webgl2: webgl2Supported,
      highPerformance: deviceTier === "high",
      maxTextureSize,
      maxShaderComplexity: shaderComplexity,
    };
  }

  private loadUserPreferences(): void {
    if (!this.settingsManager) return;

    try {
      // Check for reduced motion preference
      this.userPreferences.reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Check battery conservation (if supported)
      if ("getBattery" in navigator) {
        (navigator as any)
          .getBattery()
          .then((battery: any) => {
            this.userPreferences.batteryConservation =
              !battery.charging && battery.level < 0.3;
          })
          .catch(() => {
            // Battery API not available or permission denied
          });
      }

      // Load user-specific settings
      const preferredBackend = this.settingsManager.get(
        "sn-gradient-backend" as any
      );
      if (preferredBackend) {
        this.userPreferences.preferredBackend = preferredBackend as any;
      }

      const qualityLevel = this.settingsManager.get(
        "sn-gradient-quality" as any
      );
      if (qualityLevel) {
        this.userPreferences.qualityLevel = qualityLevel as any;
      }

      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        "User preferences loaded:",
        this.userPreferences
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "GradientTransitionOrchestrator",
        "Failed to load user preferences:",
        error
      );
    }
  }

  private determineOptimalBackend(): GradientBackend {
    // User has explicit preference
    if (this.userPreferences.preferredBackend !== "auto") {
      if (
        this.userPreferences.preferredBackend === "webgl" &&
        !this.capabilities.webgl
      ) {
        Y3KDebug?.debug?.warn(
          "GradientTransitionOrchestrator",
          "User prefers WebGL but it's not available, falling back to CSS"
        );
        return "css";
      }
      return this.userPreferences.preferredBackend;
    }

    // Accessibility considerations
    if (
      this.userPreferences.reducedMotion ||
      this.userPreferences.accessibilityMode
    ) {
      return "css";
    }

    // Battery conservation mode
    if (this.userPreferences.batteryConservation) {
      return "css";
    }

    // Device capability assessment
    if (!this.capabilities.webgl) {
      return "css";
    }

    if (!this.capabilities.highPerformance) {
      return "css";
    }

    // For high performance devices, default to hybrid mode for best compatibility
    return "hybrid";
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
      Y3KDebug?.debug?.error(
        "GradientTransitionOrchestrator",
        `Failed to initialize ${backend} backend:`,
        error
      );

      // Fallback to CSS if WebGL initialization fails
      if (backend !== "css") {
        await this.initializeCSSBackend();
        this.currentBackend = "css";
      }
    }
  }

  private async initializeCSSBackend(): Promise<void> {
    // CSS backend is always available through DepthLayeredGradientSystem
    this.cssController.setProperty("--sn-gradient-backend", "css");
    this.cssController.setProperty("--sn-webgl-ready", "0");
    this.cssController.setProperty(
      "--sn-gradient-transition-active",
      "0"
    );

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "CSS backend initialized"
    );
  }

  private async initializeWebGLBackend(): Promise<void> {
    if (!this.webglReady) {
      throw new Error("WebGL system not ready");
    }

    this.cssController.setProperty(
      "--sn-gradient-backend",
      "webgl"
    );
    this.cssController.setProperty("--sn-webgl-ready", "1");
    this.cssController.setProperty(
      "--sn-gradient-transition-active",
      "0"
    );

    // Sync current gradient state
    await this.syncGradientState("css", "webgl");

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "WebGL backend initialized"
    );
  }

  private async initializeHybridBackend(): Promise<void> {
    // Initialize both backends for hybrid mode
    await this.initializeCSSBackend();

    if (this.webglReady) {
      try {
        this.cssController.setProperty(
          "--sn-gradient-backend",
          "hybrid"
        );
        this.cssController.setProperty("--sn-webgl-ready", "1");
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "GradientTransitionOrchestrator",
          "WebGL failed in hybrid mode, using CSS only:",
          error
        );
        this.cssController.setProperty(
          "--sn-gradient-backend",
          "css"
        );
        this.cssController.setProperty("--sn-webgl-ready", "0");
      }
    }

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Hybrid backend initialized"
    );
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

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      `Transitioning from ${this.currentBackend} to ${targetBackend}`
    );

    try {
      // Update CSS to indicate transition in progress
      this.cssController.setProperty(
        "--sn-gradient-transition-active",
        "1"
      );
      this.cssController.setProperty(
        "--sn-gradient-transition-duration",
        `${transitionConfig.duration}ms`
      );
      this.cssController.setProperty(
        "--sn-gradient-transition-easing",
        transitionConfig.easing
      );

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
      Y3KDebug?.debug?.error(
        "GradientTransitionOrchestrator",
        "Transition failed:",
        error
      );

      // Fallback to CSS on transition failure
      if (targetBackend !== "css") {
        await this.initializeCSSBackend();
        this.currentBackend = "css";
      }
    } finally {
      this.transitionInProgress = false;
      this.cssController.setProperty(
        "--sn-gradient-transition-active",
        "0"
      );
      this.updateCSSTransitionState();
    }
  }

  private async instantTransition(
    targetBackend: GradientBackend
  ): Promise<void> {
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
    this.cssController.setProperty(
      "--sn-gradient-crossfade-opacity",
      "0"
    );

    // Trigger crossfade
    requestAnimationFrame(() => {
      tempElement.style.opacity = "1";
      this.cssController.setProperty(
        "--sn-gradient-crossfade-opacity",
        "1"
      );
    });

    // Wait for transition to complete
    await new Promise((resolve) => setTimeout(resolve, config.duration));

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
      this.cssController.setProperty(
        "--sn-gradient-transition-progress",
        progress.toString()
      );

      if (i === Math.floor(steps / 2)) {
        // Initialize new backend at midpoint
        await this.initializeBackend(targetBackend);
      }

      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
  }

  private async captureGradientState(): Promise<GradientState> {
    const colors: Array<{
      r: number;
      g: number;
      b: number;
      a: number;
      position: number;
    }> = [];

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
              position: index / (currentGradient.length - 1),
            });
          });
        }
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "GradientTransitionOrchestrator",
          "Failed to capture gradient colors:",
          error
        );
      }
    }

    // Capture other state from DepthLayeredGradientSystem (via CSS visual effects controller)
    // TODO: Implement state capture from DepthLayeredGradientSystem
    // For now, use default values since FluxConsciousnessLayers has been removed

    return {
      colors,
      emotionalProfile: null,
      genreInfo: {
        genre: "unknown",
        confidence: 0,
      },
      musicMetrics: null,
      visualEffectsLevel: 0.7,
      timestamp: performance.now(),
    };
  }

  private async restoreGradientState(state: GradientState): Promise<void> {
    // Restore state to active backend
    if (this.currentBackend === "webgl" && this.webglReady) {
      try {
        // Update WebGL system with captured state
        this.setWebGLPalette(state.colors);

        if (state.musicMetrics) {
          this.setWebGLMusicMetrics(state.musicMetrics);
        }
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "GradientTransitionOrchestrator",
          "Failed to restore WebGL state:",
          error
        );
      }
    }

    // Update CSS variables for state continuity
    if (state.colors.length > 0) {
      state.colors.forEach((color, index) => {
        this.cssController.setProperty(
          `--sn-transition-color-${index}`,
          `${color.r}, ${color.g}, ${color.b}`
        );
      });
    }
  }

  private async syncGradientState(
    fromBackend: GradientBackend,
    toBackend: GradientBackend
  ): Promise<void> {
    try {
      const state = await this.captureGradientState();
      await this.restoreGradientState(state);

      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        `Synced gradient state from ${fromBackend} to ${toBackend}`
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "GradientTransitionOrchestrator",
        "Failed to sync gradient state:",
        error
      );
    }
  }

  private startPerformanceMonitoring(): void {
    if (this.performanceCheckInterval) {
      clearInterval(this.performanceCheckInterval);
      this.performanceCheckInterval = null;
    }

    this.performanceCheckInterval = window.setInterval(
      this.boundPerformanceCheck!,
      1000
    );
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
      gpuPercent,
    });

    // Keep only recent history
    const cutoff =
      performance.now() - this.performanceThresholds.stabilityWindow;
    this.performanceHistory = this.performanceHistory.filter(
      (entry) => entry.timestamp > cutoff
    );

    // Check if performance degradation requires fallback
    this.checkPerformanceFallback();
  }

  private checkPerformanceFallback(): void {
    if (this.currentBackend === "css" || this.performanceHistory.length < 3) {
      return;
    }

    const recentMetrics = this.performanceHistory.slice(-3);
    const avgFPS =
      recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const avgMemory =
      recentMetrics.reduce((sum, m) => sum + m.memoryMB, 0) /
      recentMetrics.length;

    const shouldFallback =
      avgFPS < this.performanceThresholds.minFPS ||
      avgMemory > this.performanceThresholds.maxMemoryMB;

    if (shouldFallback && !this.fallbackTimer) {
      Y3KDebug?.debug?.warn(
        "GradientTransitionOrchestrator",
        `Performance degradation detected - FPS: ${avgFPS.toFixed(
          1
        )}, Memory: ${avgMemory.toFixed(1)}MB`
      );

      // Start fallback timer
      this.fallbackTimer = window.setTimeout(() => {
        this.performanceFallback();
        this.fallbackTimer = null;
      }, this.transitionConfig.fallbackDelay);
    } else if (!shouldFallback && this.fallbackTimer) {
      // Cancel fallback if performance recovers
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        "Performance recovered, fallback cancelled"
      );
    }
  }

  private performanceFallback(): void {
    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Executing performance fallback to CSS"
    );

    this.transitionToBackend("css", {
      mode: "crossfade",
      duration: 600,
      preserveState: true,
    });
  }

  private subscribeToEvents(): void {
    // Subscribe to unified event bus events for better coordination
    const settingsChangedSub = unifiedEventBus.subscribe(
      "settings:changed",
      this.handleUnifiedSettingsChange.bind(this),
      "GradientTransitionOrchestrator"
    );
    this.eventSubscriptionIds.push(settingsChangedSub);

    // Subscribe to color events for gradient state coordination
    const colorsHarmonizedSub = unifiedEventBus.subscribe(
      "colors:harmonized",
      this.handleColorsHarmonized.bind(this),
      "GradientTransitionOrchestrator"
    );
    this.eventSubscriptionIds.push(colorsHarmonizedSub);

    const colorsAppliedSub = unifiedEventBus.subscribe(
      "colors:applied",
      this.handleColorsApplied.bind(this),
      "GradientTransitionOrchestrator"
    );
    this.eventSubscriptionIds.push(colorsAppliedSub);

    // Subscribe to performance events for automatic backend switching
    const performanceFrameSub = unifiedEventBus.subscribe(
      "performance:frame",
      this.handlePerformanceFrame.bind(this),
      "GradientTransitionOrchestrator"
    );
    this.eventSubscriptionIds.push(performanceFrameSub);

    // Subscribe to music events for enhanced gradient coordination
    const musicTrackChangedSub = unifiedEventBus.subscribe(
      "music:track-changed",
      this.handleMusicTrackChanged.bind(this),
      "GradientTransitionOrchestrator"
    );
    this.eventSubscriptionIds.push(musicTrackChangedSub);

    // Keep some legacy DOM event listeners for system-level events
    if (this.boundVisibilityChange) {
      document.addEventListener("visibilitychange", this.boundVisibilityChange);
    }

    // Listen for battery changes
    if ("getBattery" in navigator) {
      (navigator as any)
        .getBattery()
        .then((battery: any) => {
          battery.addEventListener("chargingchange", () => {
            this.userPreferences.batteryConservation =
              !battery.charging && battery.level < 0.3;
            this.adaptToUserPreferences();
          });

          battery.addEventListener("levelchange", () => {
            this.userPreferences.batteryConservation =
              !battery.charging && battery.level < 0.3;
            this.adaptToUserPreferences();
          });
        })
        .catch(() => {
          // Battery API not available
        });
    }

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Subscribed to unified events",
      {
        subscriptionCount: this.eventSubscriptionIds.length,
      }
    );
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

  // Unified Event Bus handlers for enhanced coordination
  private handleUnifiedSettingsChange(
    data: EventData<"settings:changed">
  ): void {
    const { settingKey, newValue } = data;

    if (settingKey === "sn-gradient-backend") {
      this.userPreferences.preferredBackend = newValue as "auto" | GradientBackend;
      this.adaptToUserPreferences();
      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        `Backend preference changed to: ${newValue}`
      );
    } else if (settingKey === "sn-gradient-quality") {
      this.userPreferences.qualityLevel = newValue as QualityLevel;
      this.adaptToUserPreferences();
      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        `Quality preference changed to: ${newValue}`
      );
    }
  }

  private handleColorsHarmonized(data: EventData<"colors:harmonized">): void {
    // Update gradient state when colors are harmonized
    this.lastGradientState = {
      colors: [], // Will be filled by the system
      emotionalProfile: data.coordinationMetrics?.emotionalState || null,
      genreInfo: data.coordinationMetrics?.detectedGenre || null,
      musicMetrics: {
        energy: data.coordinationMetrics?.musicInfluenceStrength || 0,
        genre: data.coordinationMetrics?.detectedGenre,
        processingMode: data.processingMode,
      },
      visualEffectsLevel: data.coordinationMetrics?.musicInfluenceStrength || 0,
      timestamp: data.processingTime,
    };

    // Emit gradient crossfade update
    unifiedEventBus.emit("gradient:crossfade-changed", {
      opacity:
        this.currentBackend === "hybrid"
          ? 0.5
          : this.currentBackend === "webgl"
          ? 1.0
          : 0.0,
      sourceStrategy: data.strategies.join(", "),
      webglEnabled: this.currentBackend !== "css",
      timestamp: Date.now(),
    });

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Processed color harmonization event",
      {
        strategies: data.strategies,
        backend: this.currentBackend,
        processingTime: data.processingTime,
      }
    );
  }

  private handleColorsApplied(data: EventData<"colors:applied">): void {
    // Coordinate gradient updates when colors are applied to CSS
    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Colors applied, coordinating gradient updates",
      {
        backend: this.currentBackend,
        accentHex: data.accentHex,
      }
    );
  }

  private handlePerformanceFrame(data: EventData<"performance:frame">): void {
    // Monitor performance for automatic backend switching
    if (
      data.fps < this.performanceThresholds.minFPS &&
      this.currentBackend === "webgl"
    ) {
      // Performance is below threshold - consider fallback
      this.performanceHistory.push({
        timestamp: data.timestamp,
        fps: data.fps,
        memoryMB: data.memoryUsage,
        cpuPercent: 0, // Not available in this event
        gpuPercent: 0, // Not available in this event
      });

      // Keep only recent history
      const cutoffTime =
        data.timestamp - this.performanceThresholds.stabilityWindow;
      this.performanceHistory = this.performanceHistory.filter(
        (entry) => entry.timestamp > cutoffTime
      );

      // Check if we need to fallback
      const recentLowPerformance = this.performanceHistory.filter(
        (entry) => entry.fps < this.performanceThresholds.minFPS
      );

      if (recentLowPerformance.length > this.performanceHistory.length * 0.7) {
        Y3KDebug?.debug?.warn(
          "GradientTransitionOrchestrator",
          "Consistent low performance detected, switching to CSS fallback",
          {
            avgFPS:
              recentLowPerformance.reduce((sum, entry) => sum + entry.fps, 0) /
              recentLowPerformance.length,
            threshold: this.performanceThresholds.minFPS,
          }
        );
        this.transitionToBackend("css", {
          mode: "instant",
          duration: 0,
          easing: "linear",
          preserveState: true,
          fallbackDelay: 0,
        });
      }
    }
  }

  private handleMusicTrackChanged(
    data: EventData<"music:track-changed">
  ): void {
    // Reset gradient state for new track
    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Track changed, preparing gradient for new colors",
      {
        trackUri: data.trackUri,
        artist: data.artist,
        title: data.title,
      }
    );

    // Clear old gradient state to allow fresh color extraction
    this.lastGradientState = null;
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Reduce performance when tab is hidden
      if (this.currentBackend === "webgl") {
        this.setWebGLEnabled(false);
      }
    } else {
      // Restore performance when tab becomes visible
      if (this.currentBackend === "webgl") {
        this.setWebGLEnabled(true);
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
    this.cssController.setProperty(
      "--sn-current-backend",
      this.currentBackend
    );
    this.cssController.setProperty(
      "--sn-webgl-enabled",
      this.currentBackend === "webgl" ? "1" : "0"
    );
    this.cssController.setProperty(
      "--sn-hybrid-mode",
      this.currentBackend === "hybrid" ? "1" : "0"
    );
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

  public setPerformanceThresholds(
    thresholds: Partial<PerformanceThresholds>
  ): void {
    this.performanceThresholds = {
      ...this.performanceThresholds,
      ...thresholds,
    };
  }

  /**
   * Update animation - required by IManagedSystem interface
   * Updates transition animations and performance monitoring
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;

    // Update any ongoing transition animations
    if (this.transitionInProgress) {
      this.updateTransitionAnimation(deltaTime);
    }

    // Check for performance-based backend switches
    // Performance monitoring handled elsewhere
  }

  /**
   * Health check - required by IManagedSystem interface
   * Reports system health and performance status
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      const isHealthy = this.initialized && !this.transitionInProgress;
      const issues: string[] = [];

      // Check backend health
      if (this.currentBackend !== this.targetBackend) {
        issues.push(`Backend transition in progress: ${this.currentBackend} → ${this.targetBackend}`);
      }

      // Check WebGL system health if applicable
      if (this.currentBackend !== "css" && this.webglBackgroundSystem) {
        try {
          const webglHealth = await this.webglBackgroundSystem.healthCheck();
          if (!webglHealth.ok) {
            issues.push("WebGL backend unhealthy");
          }
        } catch (e) {
          issues.push("WebGL health check failed");
        }
      }

      // Check performance status
      try {
        const medianFPS = this.performanceAnalyzer.getMedianFPS();
        if (medianFPS && medianFPS < 30) { // <30fps threshold
          issues.push(`Performance degraded: ${medianFPS.toFixed(1)} FPS`);
        }
      } catch (e) {
        // Performance analyzer might not have getMetrics method
        issues.push("Performance metrics unavailable");
      }

      return {
        healthy: isHealthy && issues.length === 0,
        ok: isHealthy,
        details: `TransitionCoordinator: ${this.currentBackend} backend active, ` +
                `${this.webglReady ? 'WebGL ready' : 'CSS only'}, ` +
                `${issues.length === 0 ? 'all systems nominal' : issues.length + ' issues'}`,
        issues: issues,
        system: this.systemName,
      };
    } catch (error) {
      return {
        healthy: false,
        ok: false,
        details: "TransitionCoordinator health check failed",
        issues: [error instanceof Error ? error.message : "Unknown error"],
        system: this.systemName,
      };
    }
  }

  /**
   * Force repaint - optional IManagedSystem method
   * Forces a visual refresh of the current backend
   */
  public forceRepaint(reason?: string): void {
    if (!this.initialized) return;

    Y3KDebug?.debug?.log("TransitionCoordinator", `Force repaint: ${reason || "manual trigger"}`);

    // Force repaint on current backend
    if (this.currentBackend !== "css" && this.webglBackgroundSystem?.forceRepaint) {
      this.webglBackgroundSystem.forceRepaint(reason);
    }

    // Update CSS variables to trigger CSS-based repaints
    this.updateCSSTransitionState();
  }

  /**
   * Update transition animation progress
   */
  private updateTransitionAnimation(deltaTime: number): void {
    // Implementation for smooth transition animations
    // This would handle crossfade timing, progressive transitions, etc.
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

    // Remove unified event bus subscriptions
    this.eventSubscriptionIds.forEach((subscriptionId) => {
      unifiedEventBus.unsubscribe(subscriptionId);
    });
    this.eventSubscriptionIds = [];

    Y3KDebug?.debug?.log(
      "GradientTransitionOrchestrator",
      "Unified event subscriptions cleaned up"
    );

    // Remove legacy event listeners
    if (this.boundSettingsChange) {
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundSettingsChange
      );
    }

    if (this.boundVisibilityChange) {
      document.removeEventListener(
        "visibilitychange",
        this.boundVisibilityChange
      );
    }

    // Clean up systems
    if (this.webglBackgroundSystem) {
      this.webglBackgroundSystem.destroy();
    }

    // Reset CSS state
    this.cssController.setProperty("--sn-gradient-backend", "css");
    this.cssController.setProperty("--sn-webgl-ready", "0");
    this.cssController.setProperty(
      "--sn-gradient-transition-active",
      "0"
    );

    this.initialized = false;

    Y3KDebug?.debug?.log("TransitionCoordinator", "Destroyed");
  }

  // ========================================================================
  // INLINED WEBGL ADAPTER METHODS
  // ========================================================================

  /**
   * Detect WebGL capabilities (inlined from WebGLBackplaneAdapter)
   */
  private detectWebGLCapabilities(): BackendCapabilities {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

    if (!gl) {
      return {
        webgl: false,
        webgl2: false,
        highPerformance: false,
        maxTextureSize: 0,
        maxShaderComplexity: "low",
      };
    }

    const isWebGL2 = gl instanceof WebGL2RenderingContext;
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const deviceQuality = this.deviceDetector.recommendPerformanceQuality();

    return {
      webgl: true,
      webgl2: isWebGL2,
      highPerformance: deviceQuality === "high",
      maxTextureSize,
      maxShaderComplexity:
        deviceQuality === "high"
          ? "high"
          : deviceQuality === "balanced"
          ? "medium"
          : "low",
    };
  }

  /**
   * Set WebGL palette (inlined from WebGLBackplaneAdapter)
   */
  private setWebGLPalette(stops: RGBStop[], transition: number = 500): void {
    if (!this.webglReady || !this.webglBackgroundSystem || stops.length === 0) return;

    try {
      // Convert RGBStops to the format expected by ColorHarmonyEngine
      const colors = stops.map((stop) => ({
        r: Math.round(stop.r),
        g: Math.round(stop.g),
        b: Math.round(stop.b),
      }));

      // Update the color harmony engine with new colors
      if (this.webglBackgroundSystem["colorHarmonyEngine"]) {
        this.webglBackgroundSystem["colorHarmonyEngine"].updatePalette?.(colors);
      }

      Y3KDebug?.debug?.log(
        "GradientTransitionOrchestrator",
        "WebGL palette updated",
        { stops: stops.length, transition }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "GradientTransitionOrchestrator",
        "Failed to set WebGL palette:",
        error
      );
    }
  }

  /**
   * Set WebGL music metrics (inlined from WebGLBackplaneAdapter) 
   */
  private setWebGLMusicMetrics(metrics: MusicMetrics): void {
    if (!this.webglReady || !this.webglBackgroundSystem) return;

    try {
      // Update CSS variables that the WebGL system reads
      if (metrics.beatIntensity !== undefined) {
        this.cssController.setProperty(
          "--sn.music.beat.pulse.intensity",
          metrics.beatIntensity.toString()
        );
      }

      if (metrics.rhythmPhase !== undefined) {
        this.cssController.setProperty(
          "--sn.music.rhythm.phase",
          `${metrics.rhythmPhase}deg`
        );
      }

      if (metrics.pulsingScale !== undefined) {
        this.cssController.setProperty(
          "--sn.music.pulsing.scale",
          metrics.pulsingScale.toString()
        );
      }

      // Update music sync service if available
      if (this.webglBackgroundSystem["musicSyncService"]) {
        this.webglBackgroundSystem["musicSyncService"].updateMetrics?.(metrics);
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "GradientTransitionOrchestrator",
        "Failed to set WebGL music metrics:",
        error
      );
    }
  }

  /**
   * Enable/disable WebGL backend (inlined from WebGLBackplaneAdapter)
   */
  private setWebGLEnabled(enabled: boolean, fadeMs: number = 500): void {
    if (this.webglEnabled === enabled) return;

    this.webglEnabled = enabled;

    if (!this.webglReady || !this.webglBackgroundSystem) {
      Y3KDebug?.debug?.warn(
        "GradientTransitionOrchestrator",
        "Cannot enable WebGL - system not ready"
      );
      return;
    }

    try {
      if (enabled) {
        // Enable WebGL rendering
        this.cssController.setProperty("--sn.bg.webgl.enabled", "1");

        // Start WebGL animation if not already running
        if (!this.webglBackgroundSystem["animationId"]) {
          this.webglBackgroundSystem["startAnimation"]?.();
        }

        Y3KDebug?.debug?.log(
          "GradientTransitionOrchestrator", 
          "Enabled WebGL backend"
        );
      } else {
        // Disable WebGL rendering
        this.cssController.setProperty("--sn.bg.webgl.enabled", "0");

        // Stop WebGL animation
        if (this.webglBackgroundSystem["animationId"]) {
          this.webglBackgroundSystem["stopAnimation"]?.();
        }

        Y3KDebug?.debug?.log(
          "GradientTransitionOrchestrator",
          "Disabled WebGL backend"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "GradientTransitionOrchestrator",
        "Failed to set WebGL enabled state:",
        error
      );
    }
  }
}
