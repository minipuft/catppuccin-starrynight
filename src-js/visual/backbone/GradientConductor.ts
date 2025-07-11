/**
 * GradientConductor - Unified Visual System Orchestrator
 *
 * Central service responsible for coordinating all visual rendering systems
 * in the Year 3000 System architecture. Removes duplicated color-stop logic
 * and provides a single source of truth for gradient management.
 *
 * @architecture Year3000System
 * @performance Optimized for 60fps with CSSVariableBatcher integration
 * @accessibility Full support for prefers-reduced-motion and quality scaling
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { GlobalEventBus } from "@/core/events/EventBus";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import {
  BackendCapabilities,
  HealthCheckResult,
  IManagedSystem,
  MusicMetrics,
  PerformanceConstraints,
  RGBStop,
  VisualBackplane,
} from "@/types/systems";

export interface GradientConductorConfig {
  enabledBackends: ("css" | "webgl")[];
  defaultQuality: "low" | "medium" | "high" | "ultra";
  transitionDuration: number;
  performanceMonitoring: boolean;
  autoQualityScaling: boolean;
}

export interface BackendRegistration {
  backend: VisualBackplane;
  priority: number; // Higher number = higher priority
  capabilities: BackendCapabilities;
  lastHealthCheck: Date;
  isActive: boolean;
}

/**
 * Progressive enhancement decision tree for backend selection
 */
export class BackendSelector {
  static selectOptimalBackend(
    registrations: BackendRegistration[]
  ): VisualBackplane | null {
    // Sort by priority (WebGL > CSS)
    const sorted = registrations
      .filter((reg) => reg.backend.isReady && reg.backend.capabilities)
      .sort((a, b) => b.priority - a.priority);

    for (const registration of sorted) {
      const caps = registration.capabilities;

      // WebGL2 - highest priority
      if (caps.webgl2 && caps.maxTextureSize >= 2048) {
        return registration.backend;
      }

      // WebGL1 - third priority
      if (caps.webgl && caps.maxTextureSize >= 1024) {
        return registration.backend;
      }

      // CSS fallback - always available
      if (registration.backend.backendId === "css") {
        return registration.backend;
      }
    }

    return null;
  }
}

/**
 * GradientConductor - Single source of truth for visual system coordination
 */
export class GradientConductor implements IManagedSystem {
  public initialized: boolean = false;

  private eventBus: typeof GlobalEventBus;
  private cssVariableBatcher: CSSVariableBatcher;
  private colorHarmonyEngine: ColorHarmonyEngine;
  private musicSyncService: MusicSyncService;
  private performanceAnalyzer: PerformanceAnalyzer;

  private registeredBackends: Map<string, BackendRegistration> = new Map();
  private activeBackend: VisualBackplane | null = null;
  private rootElement: HTMLElement | null = null;

  private config: GradientConductorConfig;
  private currentPalette: RGBStop[] = [];
  private currentMusicMetrics: MusicMetrics | null = null;
  private currentConstraints: PerformanceConstraints;

  // Performance monitoring
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private performanceCheckInterval: number | null = null;

  constructor(
    eventBus: typeof GlobalEventBus,
    cssVariableBatcher: CSSVariableBatcher,
    colorHarmonyEngine: ColorHarmonyEngine,
    musicSyncService: MusicSyncService,
    performanceAnalyzer: PerformanceAnalyzer,
    config: Partial<GradientConductorConfig> = {}
  ) {
    this.eventBus = eventBus || GlobalEventBus;
    this.cssVariableBatcher = cssVariableBatcher;
    this.colorHarmonyEngine = colorHarmonyEngine;
    this.musicSyncService = musicSyncService;
    this.performanceAnalyzer = performanceAnalyzer;

    this.config = {
      enabledBackends: ["webgl", "css"],
      defaultQuality: "high",
      transitionDuration: 500,
      performanceMonitoring: true,
      autoQualityScaling: true,
      ...config,
    };

    this.currentConstraints = {
      targetFPS: 60,
      maxMemoryMB: 50,
      cpuBudgetPercent: 10,
      gpuBudgetPercent: 25,
      qualityLevel: this.config.defaultQuality,
    };
  }

  /**
   * Initialize the GradientConductor and set up event listeners
   */
  async initialize(): Promise<void> {
    try {
      // Set up event listeners for color and music changes
      this.setupEventListeners();

      // Initialize CSS variable monitoring
      this.setupCSSVariableUpdates();

      // Start performance monitoring if enabled
      if (this.config.performanceMonitoring) {
        this.startPerformanceMonitoring();
      }

      // Update global backend status
      this.updateGlobalStatus();

      this.initialized = true;

      console.log("[GradientConductor] Initialized successfully", {
        enabledBackends: this.config.enabledBackends,
        registeredBackends: Array.from(this.registeredBackends.keys()),
      });
    } catch (error) {
      console.error("[GradientConductor] Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Register a visual backend with the conductor
   */
  registerBackend(backend: VisualBackplane, priority: number = 0): void {
    const registration: BackendRegistration = {
      backend,
      priority,
      capabilities: backend.capabilities,
      lastHealthCheck: new Date(),
      isActive: false,
    };

    this.registeredBackends.set(backend.backendId, registration);

    console.log(
      `[GradientConductor] Registered backend: ${backend.backendId}`,
      {
        priority,
        capabilities: backend.capabilities,
      }
    );

    // Immediately evaluate if this should be the active backend
    this.evaluateActiveBackend();
  }

  /**
   * Unregister a visual backend
   */
  unregisterBackend(backendId: string): void {
    const registration = this.registeredBackends.get(backendId);
    if (registration) {
      // Disable the backend before removing
      registration.backend.setEnabled(false);
      this.registeredBackends.delete(backendId);

      // If this was the active backend, find a new one
      if (this.activeBackend?.backendId === backendId) {
        this.activeBackend = null;
        this.evaluateActiveBackend();
      }

      console.log(`[GradientConductor] Unregistered backend: ${backendId}`);
    }
  }

  /**
   * Initialize all backends with the root element
   */
  async initializeBackends(rootElement: HTMLElement): Promise<void> {
    this.rootElement = rootElement;

    // Initialize all registered backends
    const initPromises = Array.from(this.registeredBackends.values()).map(
      async (registration) => {
        try {
          await registration.backend.init(rootElement, this.currentConstraints);
          console.log(
            `[GradientConductor] Backend ${registration.backend.backendId} initialized`
          );
        } catch (error) {
          console.error(
            `[GradientConductor] Failed to initialize backend ${registration.backend.backendId}:`,
            error
          );
        }
      }
    );

    await Promise.allSettled(initPromises);

    // Select and activate the optimal backend
    this.evaluateActiveBackend();

    // Apply current palette and music metrics to the active backend
    if (this.activeBackend) {
      if (this.currentPalette.length > 0) {
        this.activeBackend.setPalette(this.currentPalette);
      }
      if (this.currentMusicMetrics) {
        this.activeBackend.setMusicMetrics(this.currentMusicMetrics);
      }
    }
  }

  /**
   * Update the color palette across all systems
   */
  setPalette(
    stops: RGBStop[],
    transition: number = this.config.transitionDuration
  ): void {
    this.currentPalette = [...stops];

    // Update CSS variables for fallback and other systems
    this.updateCSSGradientVariables(stops);

    // Update active backend
    if (this.activeBackend) {
      this.activeBackend.setPalette(stops, transition);
    }

    // Update global status
    this.updateGlobalStatus();

    console.log("[GradientConductor] Palette updated", {
      stops: stops.length,
      activeBackend: this.activeBackend?.backendId,
      transition,
    });
  }

  /**
   * Update music synchronization metrics
   */
  setMusicMetrics(metrics: MusicMetrics): void {
    this.currentMusicMetrics = metrics;

    // Update CSS variables for music synchronization
    this.updateCSSMusicVariables(metrics);

    // Update active backend
    if (this.activeBackend) {
      this.activeBackend.setMusicMetrics(metrics);
    }

    // Emit event for other systems
    this.eventBus.emit("musicMetricsUpdated", metrics);
  }

  /**
   * Update performance constraints and trigger quality scaling
   */
  setPerformanceConstraints(constraints: PerformanceConstraints): void {
    this.currentConstraints = { ...constraints };

    // Update all backends
    for (const registration of this.registeredBackends.values()) {
      registration.backend.setPerformanceConstraints(constraints);
    }

    // Re-evaluate active backend if quality level changed significantly
    if (constraints.qualityLevel !== this.currentConstraints.qualityLevel) {
      this.evaluateActiveBackend();
    }

    console.log(
      "[GradientConductor] Performance constraints updated",
      constraints
    );
  }

  /**
   * Get the currently active backend
   */
  getActiveBackend(): VisualBackplane | null {
    return this.activeBackend;
  }

  /**
   * Get all registered backends
   */
  getRegisteredBackends(): BackendRegistration[] {
    return Array.from(this.registeredBackends.values());
  }

  /**
   * Force a specific backend to be active (for testing/debugging)
   */
  setActiveBackend(backendId: string): boolean {
    const registration = this.registeredBackends.get(backendId);
    if (!registration || !registration.backend.isReady) {
      return false;
    }

    // Disable current active backend
    if (this.activeBackend) {
      this.activeBackend.setEnabled(false);
      const currentReg = this.registeredBackends.get(
        this.activeBackend.backendId
      );
      if (currentReg) currentReg.isActive = false;
    }

    // Enable new backend
    this.activeBackend = registration.backend;
    registration.isActive = true;
    registration.backend.setEnabled(true, this.config.transitionDuration);

    this.updateGlobalStatus();

    console.log(`[GradientConductor] Forced backend switch to: ${backendId}`);
    return true;
  }

  /**
   * Perform health checks on all backends
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];

    for (const [backendId, registration] of this.registeredBackends) {
      try {
        const result = await registration.backend.healthCheck();
        registration.lastHealthCheck = new Date();

        if (!result.ok) {
          issues.push(
            `Backend ${backendId}: ${result.details || "Health check failed"}`
          );
        }
      } catch (error) {
        issues.push(`Backend ${backendId}: Health check error - ${error}`);
      }
    }

    return {
      ok: issues.length === 0,
      details:
        issues.length > 0
          ? `${issues.length} backend issues detected`
          : "All backends healthy",
      issues,
    };
  }

  /**
   * Animation update tick for performance monitoring
   */
  updateAnimation(deltaTime: number): void {
    this.frameCount++;
    this.lastFrameTime = deltaTime;

    // Update active backend animation
    if (this.activeBackend) {
      this.activeBackend.updateAnimation(deltaTime);
    }
  }

  /**
   * Clean up resources and event listeners
   */
  destroy(): void {
    // Stop performance monitoring
    if (this.performanceCheckInterval) {
      clearInterval(this.performanceCheckInterval);
      this.performanceCheckInterval = null;
    }

    // Destroy all registered backends
    for (const registration of this.registeredBackends.values()) {
      registration.backend.destroy();
    }

    this.registeredBackends.clear();
    this.activeBackend = null;
    this.initialized = false;

    console.log("[GradientConductor] Destroyed");
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  private setupEventListeners(): void {
    // Listen for color harmony updates
    this.eventBus.on<RGBStop[]>("colorHarmonyUpdated", (palette: RGBStop[]) => {
      if (palette && palette.length > 0) {
        const stops: RGBStop[] = palette.map((color: any, index: number) => ({
          r: color.r,
          g: color.g,
          b: color.b,
          position: index / (palette.length - 1),
        }));
        this.setPalette(stops);
      }
    });

    // Listen for music sync updates
    this.eventBus.on<MusicMetrics>(
      "musicSyncUpdated",
      (metrics: MusicMetrics) => {
        this.setMusicMetrics(metrics);
      }
    );

    // Listen for performance constraint changes
    this.eventBus.on<PerformanceConstraints>(
      "performanceConstraintsChanged",
      (constraints: PerformanceConstraints) => {
        this.setPerformanceConstraints(constraints);
      }
    );

    // Listen for accessibility preference changes
    this.eventBus.on<any>(
      "accessibilityPreferencesChanged",
      (preferences: any) => {
        for (const registration of this.registeredBackends.values()) {
          registration.backend.applyAccessibilityPreferences?.(preferences);
        }
      }
    );
  }

  private setupCSSVariableUpdates(): void {
    // Set up fast-path variables for critical updates
    const criticalVariables = [
      "--sn.music.beat.pulse.intensity",
      "--sn.music.rhythm.phase",
      "--sn.music.breathing.scale",
      "--sn.bg.webgl.ready",
      "--sn.bg.active-backend",
    ];

    // Add critical variables to CSSVariableBatcher fast-path
    criticalVariables.forEach((variable) => {
      this.cssVariableBatcher.addCriticalVariable(variable);
    });
  }

  private updateCSSGradientVariables(stops: RGBStop[]): void {
    if (stops.length === 0) return;

    // Update primary gradient colors
    const primary = stops[0]!;
    const secondary = stops[Math.floor(stops.length / 2)]!;
    const accent = stops[stops.length - 1]!;

    this.cssVariableBatcher.setProperty(
      "--sn.bg.gradient.primary.rgb",
      `${primary.r}, ${primary.g}, ${primary.b}`
    );
    this.cssVariableBatcher.setProperty(
      "--sn.bg.gradient.secondary.rgb",
      `${secondary.r}, ${secondary.g}, ${secondary.b}`
    );
    this.cssVariableBatcher.setProperty(
      "--sn.bg.gradient.accent.rgb",
      `${accent.r}, ${accent.g}, ${accent.b}`
    );

    // Update color system variables
    this.cssVariableBatcher.setProperty(
      "--sn.color.accent.rgb",
      `${accent.r}, ${accent.g}, ${accent.b}`
    );
    this.cssVariableBatcher.setProperty(
      "--sn.color.accent.hex",
      `#${Math.round(accent.r).toString(16).padStart(2, "0")}${Math.round(
        accent.g
      )
        .toString(16)
        .padStart(2, "0")}${Math.round(accent.b).toString(16).padStart(2, "0")}`
    );
  }

  private updateCSSMusicVariables(metrics: MusicMetrics): void {
    // Critical real-time variables (fast-path)
    if (metrics.beatIntensity !== undefined) {
      this.cssVariableBatcher.setProperty(
        "--sn.music.beat.pulse.intensity",
        metrics.beatIntensity.toString()
      );
    }

    if (metrics.rhythmPhase !== undefined) {
      this.cssVariableBatcher.setProperty(
        "--sn.music.rhythm.phase",
        `${metrics.rhythmPhase}deg`
      );
    }

    if (metrics.breathingScale !== undefined) {
      this.cssVariableBatcher.setProperty(
        "--sn.music.breathing.scale",
        metrics.breathingScale.toString()
      );
    }

    // Non-critical variables (batched)
    this.cssVariableBatcher.setProperty(
      "--sn.music.energy.level",
      metrics.energy.toString()
    );
    this.cssVariableBatcher.setProperty(
      "--sn.music.valence",
      metrics.valence.toString()
    );
    this.cssVariableBatcher.setProperty(
      "--sn.music.tempo.bpm",
      metrics.bpm.toString()
    );
  }

  private updateGlobalStatus(): void {
    // Update backend status variables
    this.cssVariableBatcher.setProperty(
      "--sn.bg.webgl.ready",
      this.registeredBackends.has("webgl") ? "1" : "0"
    );
    this.cssVariableBatcher.setProperty(
      "--sn.bg.active-backend",
      this.activeBackend?.backendId || "none"
    );

    // Update window global for debugging
    if (typeof window !== "undefined") {
      (window as any).snActiveBackend = this.activeBackend?.backendId || "none";
    }
  }

  private evaluateActiveBackend(): void {
    const optimal = BackendSelector.selectOptimalBackend(
      Array.from(this.registeredBackends.values())
    );

    if (optimal && optimal !== this.activeBackend) {
      // Disable current backend
      if (this.activeBackend) {
        this.activeBackend.setEnabled(false, this.config.transitionDuration);
        const currentReg = this.registeredBackends.get(
          this.activeBackend.backendId
        );
        if (currentReg) currentReg.isActive = false;
      }

      // Enable new backend
      this.activeBackend = optimal;
      const newReg = this.registeredBackends.get(optimal.backendId);
      if (newReg) {
        newReg.isActive = true;
        optimal.setEnabled(true, this.config.transitionDuration);
      }

      this.updateGlobalStatus();

      console.log(
        `[GradientConductor] Switched to backend: ${optimal.backendId}`
      );

      // Emit event for other systems
      this.eventBus.emit("activeBackendChanged", {
        previousBackend: this.activeBackend?.backendId,
        newBackend: optimal.backendId,
        capabilities: optimal.capabilities,
      });
    }
  }

  private startPerformanceMonitoring(): void {
    this.performanceCheckInterval = window.setInterval(() => {
      if (!this.activeBackend) return;

      try {
        const metrics = this.activeBackend.getPerformanceMetrics();

        // Check if we need to scale quality down
        if (this.config.autoQualityScaling) {
          this.evaluateQualityScaling(metrics);
        }

        // Update performance analyzer
        this.performanceAnalyzer.recordMetric(
          "gradientConductor.fps",
          metrics.fps
        );
        this.performanceAnalyzer.recordMetric(
          "gradientConductor.memory",
          metrics.memoryUsageMB
        );
      } catch (error) {
        console.warn(
          "[GradientConductor] Performance monitoring error:",
          error
        );
      }
    }, 2000); // Check every 2 seconds
  }

  private evaluateQualityScaling(metrics: any): void {
    const constraints = this.currentConstraints;

    // Scale down if performance is poor
    if (
      metrics.fps < constraints.targetFPS * 0.8 ||
      metrics.memoryUsageMB > constraints.maxMemoryMB * 1.2
    ) {
      let newQuality = constraints.qualityLevel;

      switch (constraints.qualityLevel) {
        case "ultra":
          newQuality = "high";
          break;
        case "high":
          newQuality = "medium";
          break;
        case "medium":
          newQuality = "low";
          break;
        case "low":
          // Try switching to a more basic backend
          this.evaluateActiveBackend();
          return;
      }

      console.log(
        `[GradientConductor] Auto-scaling quality: ${constraints.qualityLevel} → ${newQuality}`
      );

      this.setPerformanceConstraints({
        ...constraints,
        qualityLevel: newQuality,
      });
    }
  }
}
