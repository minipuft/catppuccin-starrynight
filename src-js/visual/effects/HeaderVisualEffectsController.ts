/**
 * HeaderVisualEffectsController - Music-Responsive Header Animation System
 *
 * Connects header visual effects to the music system for
 * dynamic, music-responsive header animations that synchronize with audio analysis.
 *
 * Technical Focus: Real-time header visual effects synchronized with music beat detection,
 * energy analysis, and harmonic color coordination for enhanced user experience.
 */

import { UnifiedSystemBase } from "@/core/base/UnifiedSystemBase";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";

interface HeaderEffectsState {
  // Music synchronization
  energy: number; // 0-1, current music energy
  valence: number; // 0-1, musical mood/emotion
  tempo: number; // BPM
  harmonyHue: number; // Hue rotation for musical harmony
  intensity: number; // Overall header effects intensity

  // Animation state
  lastUpdateTime: number;
  animationActive: boolean;
  preferredMotion: boolean;

  // Performance
  frameRate: number;
  lastFrameTime: number;
}

export class HeaderVisualEffectsController extends UnifiedSystemBase {
  protected override cssController!: OptimizedCSSVariableManager;
  private effectsState: HeaderEffectsState = {
    energy: 0.5,
    valence: 0.5,
    tempo: 120,
    harmonyHue: 0,
    intensity: 0.8,
    lastUpdateTime: 0,
    animationActive: true,
    preferredMotion: true,
    frameRate: 60,
    lastFrameTime: 0,
  };

  // ✅ RAF LOOP CONSOLIDATION: Removed animationFrameId (coordinator manages animation)
  private updateInterval: number = 0;

  // Performance optimization
  private eventDebounceTimers = {
    musicEnergy: 0,
    colorHarmony: 0,
    beatSync: 0,
    cssUpdate: 0,
  };
  private eventDebounceMs = 100; // Reduced from 33ms to 100ms for better performance
  private frameThrottleMs = 16; // 60fps target
  private lastCSSUpdateTime = 0;

  // Change detection for CSS variables
  private previousCSSValues = {
    energy: 0,
    valence: 0,
    harmonyHue: 0,
    intensity: 0,
    depth: 0,
  };
  private cssChangeThreshold = 0.01;

  constructor(config: AdvancedSystemConfig | Year3000Config) {
    super(config);
  }

  // =========================================================================
  // PERFORMANCE OPTIMIZATION HELPERS
  // =========================================================================

  /**
   * Debounced event handler to prevent excessive processing
   */
  private debouncedEventHandler(
    eventType: keyof typeof this.eventDebounceTimers,
    handler: () => void
  ): void {
    const now = performance.now();
    if (now - this.eventDebounceTimers[eventType] >= this.eventDebounceMs) {
      handler();
      this.eventDebounceTimers[eventType] = now;
    }
  }

  /**
   * Check if CSS values have changed significantly
   */
  private hasSignificantCSSChange(): boolean {
    const state = this.effectsState;
    const depthMultiplier = 1 + state.energy * 0.5;

    const currentValues = {
      energy: state.energy,
      valence: state.valence,
      harmonyHue: state.harmonyHue,
      intensity: state.intensity,
      depth: depthMultiplier,
    };

    for (const [key, value] of Object.entries(currentValues)) {
      const previous =
        this.previousCSSValues[key as keyof typeof this.previousCSSValues];
      if (Math.abs(value - previous) >= this.cssChangeThreshold) {
        return true;
      }
    }

    return false;
  }

  /**
   * Update previous CSS values for change detection
   */
  private updatePreviousCSSValues(): void {
    const state = this.effectsState;
    const depthMultiplier = 1 + state.energy * 0.5;

    this.previousCSSValues.energy = state.energy;
    this.previousCSSValues.valence = state.valence;
    this.previousCSSValues.harmonyHue = state.harmonyHue;
    this.previousCSSValues.intensity = state.intensity;
    this.previousCSSValues.depth = depthMultiplier;
  }

  /**
   * Batch apply CSS updates using coordination
   */
  private batchApplyCSSUpdates(
    updates: Array<[string, string]>, 
    priority: "low" | "normal" | "high" | "critical" = "normal",
    source: string = "header-effects"
  ): void {
    const variables: Record<string, string> = {};
    for (const [property, value] of updates) {
      variables[property] = value;
    }
    
    this.cssController.batchSetVariables(
      "HeaderVisualEffectsController",
      variables,
      priority,
      source
    );
  }

  /**
   * Schedule effects variable update with change detection
   */
  private scheduleEffectsUpdate(): void {
    this.debouncedEventHandler("cssUpdate", () => {
      if (this.hasSignificantCSSChange()) {
        this.updateHeaderEffectsVariables();
        this.updatePreviousCSSValues();
      }
    });
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    // Call parent's empty implementation
    await super._performSystemSpecificInitialization();

    try {
      // Initialize CSS coordination first - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController = year3000System?.cssVariableController || getGlobalOptimizedCSSController();

      // Check for reduced motion preference
      this.effectsState.preferredMotion = !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Setup music event listeners
      this.setupMusicEventListeners();

      // Setup color harmony listeners
      this.setupColorHarmonyListeners();

      // Initialize CSS variables
      this.updateHeaderEffectsVariables();

      // Start animation loop if motion is enabled
      if (this.effectsState.preferredMotion) {
        // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by coordinator
        // updateAnimation(deltaTime) will be called automatically
      }

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      Y3KDebug?.debug?.log(
        "HeaderVisualEffectsController",
        "Header visual effects initialization complete"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HeaderVisualEffectsController",
        "Initialization failed:",
        error
      );
    }
  }

  private setupMusicEventListeners(): void {
    // Listen for music energy changes (debounced)
    unifiedEventBus.subscribe(
      "music:energy",
      (data) => {
        this.debouncedEventHandler("musicEnergy", () => {
          if (typeof data.energy === "number") {
            this.effectsState.energy = Math.max(
              0,
              Math.min(1, data.energy)
            );
            this.scheduleEffectsUpdate();
          }
          if (typeof data.tempo === "number") {
            this.effectsState.tempo = Math.max(
              60,
              Math.min(200, data.tempo)
            );
            this.updateAnimationSpeed();
          }
          if (typeof data.valence === "number") {
            this.effectsState.valence = Math.max(
              0,
              Math.min(1, data.valence)
            );
            this.scheduleEffectsUpdate();
          }
        });
      },
      "HeaderVisualEffectsController"
    );

    // Listen for music beat sync events (debounced)
    unifiedEventBus.subscribe(
      "music:beat",
      (data) => {
        this.debouncedEventHandler("beatSync", () => {
          if (this.effectsState.animationActive) {
            const intensity = data.intensity || 0.8;
            this.onBeatDetected(intensity);
          }
        });
      },
      "HeaderVisualEffectsController"
    );

    // Listen for music energy changes - alternative event (debounced)
    unifiedEventBus.subscribe(
      "music:energy-changed",
      (data) => {
        this.debouncedEventHandler("musicEnergy", () => {
          if (typeof data.energy === "number") {
            this.effectsState.energy = Math.max(
              0,
              Math.min(1, data.energy)
            );
            this.scheduleEffectsUpdate();
          }
        });
      },
      "HeaderVisualEffectsController"
    );
  }

  private setupColorHarmonyListeners(): void {
    // Listen for color harmony changes from ColorHarmonyEngine (debounced)
    unifiedEventBus.subscribe(
      "colors:harmonized",
      (data) => {
        this.debouncedEventHandler("colorHarmony", () => {
          if (data.coordinationMetrics?.coordinationStrategy) {
            this.updateHarmonyHue(
              data.coordinationMetrics.coordinationStrategy
            );
          }
        });
      },
      "HeaderVisualEffectsController"
    );

    // Listen for album color extractions (debounced)
    unifiedEventBus.subscribe(
      "colors:extracted",
      (data) => {
        this.debouncedEventHandler("colorHarmony", () => {
          // Calculate hue from RGB values if musicData available
          if (data.musicData && typeof data.musicData.energy === "number") {
            const hue = data.musicData.energy * 360; // Map energy to hue
            this.effectsState.harmonyHue = hue;
            this.scheduleEffectsUpdate();
          }
        });
      },
      "HeaderVisualEffectsController"
    );
  }

  private updateHarmonyHue(harmonicMode: string): void {
    // Map harmonic modes to hue rotations for header effects
    const harmonyHueMap: Record<string, number> = {
      monochromatic: 0,
      complementary: 180,
      triadic: 120,
      analogous: 30,
      tetradic: 90,
      "split-complementary": 150,
    };

    const baseHue = harmonyHueMap[harmonicMode] || 0;
    this.effectsState.harmonyHue = baseHue;
    this.scheduleEffectsUpdate();
  }

  private onBeatDetected(intensity: number): void {
    // Create temporary energy boost for beat-synchronized effects
    const beatEnergy = Math.min(
      1,
      this.effectsState.energy + intensity * 0.3
    );

    // Apply beat effect through batched CSS update with high priority for musical sync
    this.batchApplyCSSUpdates([
      ["--header-effects-energy", beatEnergy.toString()],
    ], "high", "beat-sync");

    // Schedule reset after beat effect duration using frame-based timing
    const resetTime = performance.now() + 150; // 150ms beat flash
    const resetBeatEffect = () => {
      if (performance.now() >= resetTime && this.initialized) {
        this.batchApplyCSSUpdates([
          [
            "--header-effects-energy",
            this.effectsState.energy.toString(),
          ],
        ], "normal", "beat-reset");
      } else if (this.initialized) {
        requestAnimationFrame(resetBeatEffect);
      }
    };
    requestAnimationFrame(resetBeatEffect);
  }

  private updateAnimationSpeed(): void {
    // Adjust animation speed based on tempo
    const tempoMultiplier = this.effectsState.tempo / 120; // 120 BPM as baseline
    const baseSpeed = 8; // 8 seconds baseline
    const newSpeed = baseSpeed / tempoMultiplier;

    this.batchApplyCSSUpdates([
      [
        "--header-effects-flow-speed",
        `${Math.max(2, Math.min(16, newSpeed))}s`,
      ],
    ], "high", "tempo-sync");
  }

  private updateHeaderEffectsVariables(): void {
    if (!this.initialized) return;

    const state = this.effectsState;

    // Calculate dynamic intensity based on valence and energy
    const dynamicIntensity =
      state.intensity *
      (0.6 + state.valence * 0.4) *
      (0.8 + state.energy * 0.2);
    const depthMultiplier = 1 + state.energy * 0.5;

    // Batch all CSS updates to minimize DOM layout thrashing
    this.batchApplyCSSUpdates([
      ["--header-effects-energy", state.energy.toString()],
      ["--header-effects-harmony", `${state.harmonyHue}deg`],
      ["--header-effects-intensity", dynamicIntensity.toString()],
      ["--header-effects-depth", depthMultiplier.toString()],
    ], "normal", "effects-update");

    this.effectsState.lastUpdateTime = Date.now();
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by EnhancedMasterAnimationCoordinator
   * Old method removed: startAnimationLoop()
   * Replacement: updateAnimation(deltaTime) called by coordinator
   */

  /**
   * ✅ RAF LOOP CONSOLIDATION: Animation update method called by coordinator
   * Replaces internal RAF loop with coordinator-managed updates
   */
  public override updateAnimation(deltaTime: number): void {
    if (!this.initialized || !this.effectsState.animationActive) return;
    if (!this.effectsState.preferredMotion) return;

    const currentTime = performance.now();

    // Throttle to target framerate
    if (currentTime - this.lastCSSUpdateTime < this.frameThrottleMs) {
      return;
    }

    // Calculate frame rate
    this.effectsState.frameRate = 1000 / deltaTime;
    this.effectsState.lastFrameTime = currentTime;

    // Update variables only if values have changed significantly
    if (currentTime - this.effectsState.lastUpdateTime > 100) {
      // 10fps for variable updates
      if (this.hasSignificantCSSChange()) {
        this.updateHeaderEffectsVariables();
        this.updatePreviousCSSValues();
      }
    }

    this.lastCSSUpdateTime = currentTime;
  }

  private setupPerformanceMonitoring(): void {
    // Monitor performance and adjust if needed
    this.updateInterval = window.setInterval(() => {
      if (!this.initialized) return;

      // If frame rate drops below threshold, reduce update frequency
      if (this.effectsState.frameRate < 30) {
        Y3KDebug?.debug?.warn(
          "HeaderVisualEffectsController",
          "Performance degradation detected, reducing update frequency"
        );
        // Could implement performance reduction logic here
      }

      // Update performance-related CSS variables using coordination
      this.cssController.setVariable(
        "HeaderVisualEffectsController",
        "--header-effects-performance",
        this.effectsState.frameRate > 50 ? "1" : "0.5",
        "low", // Low priority for performance monitoring updates
        "performance-monitor"
      );
    }, 2000); // Check every 2 seconds
  }

  /**
   * Manually update header effects intensity
   */
  public setEffectsIntensity(intensity: number): void {
    this.effectsState.intensity = Math.max(0, Math.min(1, intensity));
    this.updateHeaderEffectsVariables();
  }

  /**
   * Enable or disable header effects animations
   */
  public setAnimationActive(active: boolean): void {
    this.effectsState.animationActive = active;
    // ✅ RAF LOOP CONSOLIDATION: Coordinator manages animation lifecycle
    // Animation automatically controlled via effectsState.animationActive flag
  }

  /**
   * Get current effects state for debugging
   */
  public getEffectsState(): HeaderEffectsState {
    return { ...this.effectsState };
  }

  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy =
      this.initialized &&
      this.effectsState.frameRate > 20 &&
      Date.now() - this.effectsState.lastUpdateTime < 5000;

    return {
      healthy: isHealthy,
      issues: isHealthy
        ? []
        : [
            this.effectsState.frameRate <= 20
              ? "Low frame rate detected"
              : "",
            Date.now() - this.effectsState.lastUpdateTime >= 5000
              ? "No recent updates"
              : "",
          ].filter((issue) => issue),
      metrics: {
        frameRate: this.effectsState.frameRate,
        energy: this.effectsState.energy,
        intensity: this.effectsState.intensity,
        animationActive: this.effectsState.animationActive,
        lastUpdate: this.effectsState.lastUpdateTime,
      },
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation - coordinator handles this

    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = 0;
    }

    // Unsubscribe from events
    unifiedEventBus.unsubscribeAll("HeaderVisualEffectsController");

    Y3KDebug?.debug?.log(
      "HeaderVisualEffectsController",
      "Header visual effects system cleaned up"
    );
  }

  // Required abstract method implementations
  public async initialize(): Promise<void> {
    await this._baseInitialize();
  }

  public async destroy(): Promise<void> {
    this._performSystemSpecificCleanup();
  }

  public onAnimate(deltaTime: number): void {
    // Animation handled through CSS and event system
    // Update effects state if needed
    if (this.effectsState.animationActive) {
      this.updateHeaderEffectsVariables();
    }
  }
}
