/**
 * WebGLBackplaneAdapter - Adapter for WebGLGradientBackgroundSystem
 *
 * Adapts the existing WebGLGradientBackgroundSystem to implement the
 * VisualBackplane interface for progressive enhancement integration.
 *
 * @architecture Year3000System VisualBackplane
 * @performance GPU-accelerated with automatic quality scaling
 * @accessibility Supports reduced motion and high contrast
 */

import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import {
  BackendCapabilities,
  HealthCheckResult,
  MusicMetrics,
  PerformanceConstraints,
  RGBStop,
  ShaderBackplane,
} from "@/types/systems";
import { WebGLGradientBackgroundSystem } from "./WebGLGradientBackgroundSystem";

/**
 * Adapter to make WebGLGradientBackgroundSystem compatible with VisualBackplane
 */
export class WebGLBackplaneAdapter implements ShaderBackplane {
  public readonly backendId = "webgl" as const;
  public initialized = false;

  private webglSystem: WebGLGradientBackgroundSystem;
  private cssConsciousnessController: UnifiedCSSConsciousnessController;
  private deviceDetector: DeviceCapabilityDetector;

  private _isReady = false;
  private _capabilities: BackendCapabilities;
  private _enabled = false;
  private currentConstraints: PerformanceConstraints;

  // Performance tracking
  private performanceMetrics = {
    fps: 0,
    memoryUsageMB: 0,
    cpuUsagePercent: 0,
    gpuUsagePercent: 0,
    frameTimeMs: 0,
  };

  private frameCount = 0;
  private lastFrameTime = performance.now();
  private fpsUpdateInterval = 1000; // Update FPS every second
  private lastFpsUpdate = 0;

  constructor(
    webglSystem: WebGLGradientBackgroundSystem,
    cssConsciousnessController: UnifiedCSSConsciousnessController
  ) {
    this.webglSystem = webglSystem;
    this.cssConsciousnessController = cssConsciousnessController;
    this.deviceDetector = new DeviceCapabilityDetector();

    this._capabilities = this.detectCapabilities();

    this.currentConstraints = {
      targetFPS: 60,
      maxMemoryMB: 50,
      cpuBudgetPercent: 10,
      gpuBudgetPercent: 25,
      qualityLevel: "high",
    };
  }

  // ========================================================================
  // VISUAL BACKPLANE INTERFACE
  // ========================================================================

  get isReady(): boolean {
    return this._isReady && this.webglSystem.initialized;
  }

  get capabilities(): BackendCapabilities {
    return this._capabilities;
  }

  /**
   * Initialize the WebGL system
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.webglSystem.initialize();
      this._isReady = this.webglSystem.initialized;
      this.initialized = true;

      // Update CSS variable to indicate WebGL readiness
      this.cssConsciousnessController.setProperty(
        "--sn.bg.webgl.ready",
        this._isReady ? "1" : "0"
      );

      console.log("[WebGLBackplaneAdapter] Initialized", {
        ready: this._isReady,
        capabilities: this._capabilities,
      });
    } catch (error) {
      console.error("[WebGLBackplaneAdapter] Initialization failed:", error);
      this._isReady = false;
      this.cssConsciousnessController.setProperty("--sn.bg.webgl.ready", "0");
      throw error;
    }
  }

  /**
   * Initialize with DOM element
   */
  async init(
    root: HTMLElement,
    constraints?: PerformanceConstraints
  ): Promise<void> {
    if (constraints) {
      this.currentConstraints = { ...constraints };
    }

    await this.initialize();

    // The existing WebGL system handles its own DOM setup
    // We just need to ensure it's properly initialized
    console.log(
      "[WebGLBackplaneAdapter] Backend initialized with root element"
    );
  }

  /**
   * Update color palette
   */
  setPalette(stops: RGBStop[], transition: number = 500): void {
    if (!this.isReady || stops.length === 0) return;

    try {
      // Convert RGBStops to the format expected by ColorHarmonyEngine
      const colors = stops.map((stop) => ({
        r: Math.round(stop.r),
        g: Math.round(stop.g),
        b: Math.round(stop.b),
      }));

      // The WebGL system listens to ColorHarmonyEngine events
      // We can trigger an update through the system's color harmony handler
      if (this.webglSystem["colorHarmonyEngine"]) {
        // Update the color harmony engine with new colors
        this.webglSystem["colorHarmonyEngine"].updatePalette?.(colors);
      }

      console.log("[WebGLBackplaneAdapter] Palette updated", {
        stops: stops.length,
        transition,
      });
    } catch (error) {
      console.error("[WebGLBackplaneAdapter] Failed to set palette:", error);
    }
  }

  /**
   * Update music synchronization metrics
   */
  setMusicMetrics(metrics: MusicMetrics): void {
    if (!this.isReady) return;

    try {
      // Update CSS variables that the WebGL system reads
      if (metrics.beatIntensity !== undefined) {
        this.cssConsciousnessController.setProperty(
          "--sn.music.beat.pulse.intensity",
          metrics.beatIntensity.toString()
        );
      }

      if (metrics.rhythmPhase !== undefined) {
        this.cssConsciousnessController.setProperty(
          "--sn.music.rhythm.phase",
          `${metrics.rhythmPhase}deg`
        );
      }

      if (metrics.breathingScale !== undefined) {
        this.cssConsciousnessController.setProperty(
          "--sn.music.breathing.scale",
          metrics.breathingScale.toString()
        );
      }

      // Update music sync service if available
      if (this.webglSystem["musicSyncService"]) {
        this.webglSystem["musicSyncService"].updateMetrics?.(metrics);
      }
    } catch (error) {
      console.error(
        "[WebGLBackplaneAdapter] Failed to set music metrics:",
        error
      );
    }
  }

  /**
   * Update performance constraints
   */
  setPerformanceConstraints(constraints: PerformanceConstraints): void {
    this.currentConstraints = { ...constraints };

    if (!this.isReady) return;

    try {
      // Map quality level to WebGL system settings
      const qualityMapping: Record<string, "minimal" | "balanced" | "intense"> =
        {
          low: "minimal",
          medium: "balanced",
          high: "intense",
          ultra: "intense",
        } as const;

      const webglQuality =
        qualityMapping[constraints.qualityLevel] || "balanced";

      // Update the WebGL system's performance settings
      // This is a simplified approach - in practice you'd want to access
      // the system's internal settings and update them
      if (this.webglSystem["settings"]) {
        (this.webglSystem["settings"] as any).intensity = webglQuality;

        // Adjust frame rate target
        if (constraints.targetFPS < 60) {
          this.webglSystem["frameThrottleInterval"] =
            1000 / constraints.targetFPS;
        }
      }

      console.log("[WebGLBackplaneAdapter] Performance constraints updated", {
        quality: constraints.qualityLevel,
        targetFPS: constraints.targetFPS,
      });
    } catch (error) {
      console.error(
        "[WebGLBackplaneAdapter] Failed to set performance constraints:",
        error
      );
    }
  }

  /**
   * Enable/disable the WebGL backend
   */
  setEnabled(enabled: boolean, fadeMs: number = 500): void {
    if (this._enabled === enabled) return;

    this._enabled = enabled;

    if (!this.isReady) {
      console.warn("[WebGLBackplaneAdapter] Cannot enable - WebGL not ready");
      return;
    }

    try {
      if (enabled) {
        // Enable WebGL rendering
        this.cssConsciousnessController.setProperty("--sn.bg.webgl.enabled", "1");

        // Start WebGL animation if not already running
        if (!this.webglSystem["animationId"]) {
          this.webglSystem["startAnimation"]?.();
        }

        console.log("[WebGLBackplaneAdapter] Enabled WebGL backend");
      } else {
        // Disable WebGL rendering
        this.cssConsciousnessController.setProperty("--sn.bg.webgl.enabled", "0");

        // Stop WebGL animation
        if (this.webglSystem["animationId"]) {
          this.webglSystem["stopAnimation"]?.();
        }

        console.log("[WebGLBackplaneAdapter] Disabled WebGL backend");
      }
    } catch (error) {
      console.error(
        "[WebGLBackplaneAdapter] Failed to set enabled state:",
        error
      );
    }
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics() {
    this.updatePerformanceMetrics();
    return { ...this.performanceMetrics };
  }

  /**
   * Handle WebGL context loss
   */
  async handleContextLoss(): Promise<void> {
    console.warn("[WebGLBackplaneAdapter] Handling WebGL context loss");

    try {
      // Reinitialize the WebGL system
      this._isReady = false;
      await this.webglSystem.initialize();
      this._isReady = this.webglSystem.initialized;

      if (this._isReady && this._enabled) {
        this.setEnabled(true);
      }

      console.log("[WebGLBackplaneAdapter] WebGL context recovered");
    } catch (error) {
      console.error(
        "[WebGLBackplaneAdapter] Failed to recover WebGL context:",
        error
      );
      this._isReady = false;
    }
  }

  /**
   * Resize handling
   */
  resize(width: number, height: number): void {
    if (!this.isReady) return;

    try {
      // The WebGL system should handle its own resize logic
      // We just need to trigger it if there's a resize method
      if (typeof (this.webglSystem as any).resizeTo === "function") {
        (this.webglSystem as any).resizeTo(width, height);
      } else if (this.webglSystem["canvas"]) {
        // Manual canvas resize
        const canvas = this.webglSystem["canvas"];
        canvas.width = width;
        canvas.height = height;

        // Update WebGL viewport
        const gl = this.webglSystem["gl"];
        if (gl) {
          gl.viewport(0, 0, width, height);
        }
      }
    } catch (error) {
      console.error("[WebGLBackplaneAdapter] Resize failed:", error);
    }
  }

  /**
   * Apply accessibility preferences
   */
  applyAccessibilityPreferences(preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    prefersTransparency: boolean;
  }): void {
    if (!this.isReady) return;

    try {
      if (preferences.reducedMotion) {
        // Disable or reduce WebGL animations
        this.cssConsciousnessController.setProperty(
          "--sn.bg.webgl.reduced-motion",
          "1"
        );

        // Reduce animation intensity
        if (this.webglSystem["settings"]) {
          this.webglSystem["settings"].flowStrength *= 0.3;
          this.webglSystem["settings"].noiseScale *= 0.5;
        }
      } else {
        this.cssConsciousnessController.setProperty(
          "--sn.bg.webgl.reduced-motion",
          "0"
        );
      }

      if (preferences.highContrast) {
        // Increase contrast in shaders
        this.cssConsciousnessController.setProperty("--sn.bg.webgl.high-contrast", "1");
      } else {
        this.cssConsciousnessController.setProperty("--sn.bg.webgl.high-contrast", "0");
      }
    } catch (error) {
      console.error(
        "[WebGLBackplaneAdapter] Failed to apply accessibility preferences:",
        error
      );
    }
  }

  /**
   * Animation update
   */
  updateAnimation(deltaTime: number): void {
    this.frameCount++;

    // Update FPS calculation
    const now = performance.now();
    if (now - this.lastFpsUpdate > this.fpsUpdateInterval) {
      this.performanceMetrics.fps = Math.round(
        (this.frameCount * 1000) / (now - this.lastFpsUpdate)
      );
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    this.performanceMetrics.frameTimeMs = deltaTime;

    // The WebGL system handles its own animation loop
    // We just track performance here
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];

    // Check WebGL system health
    try {
      const systemHealth = await this.webglSystem.healthCheck();
      if (!systemHealth.ok) {
        issues.push(`WebGL system health: ${systemHealth.details}`);
      }
    } catch (error) {
      issues.push(`WebGL system health check failed: ${error}`);
    }

    // Check WebGL context
    if (this.webglSystem["gl"]) {
      const gl = this.webglSystem["gl"];
      if (gl.isContextLost()) {
        issues.push("WebGL context is lost");
      }
    } else {
      issues.push("WebGL context not available");
    }

    // Check performance
    if (this.performanceMetrics.fps < this.currentConstraints.targetFPS * 0.7) {
      issues.push(
        `Low FPS: ${this.performanceMetrics.fps}/${this.currentConstraints.targetFPS}`
      );
    }

    if (
      this.performanceMetrics.memoryUsageMB >
      this.currentConstraints.maxMemoryMB
    ) {
      issues.push(
        `High memory usage: ${this.performanceMetrics.memoryUsageMB}MB`
      );
    }

    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details:
        issues.length > 0
          ? `${issues.length} WebGL issues detected`
          : "WebGL backend healthy",
      issues,
      system: 'WebGLBackplaneAdapter',
    };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.setEnabled(false);
    this.webglSystem.destroy();
    this._isReady = false;
    this.initialized = false;

    console.log("[WebGLBackplaneAdapter] Destroyed");
  }

  // ========================================================================
  // SHADER BACKPLANE INTERFACE
  // ========================================================================

  /**
   * Load custom shaders
   */
  async loadShaders(
    vertexShader: string,
    fragmentShader: string,
    uniforms?: Record<string, any>
  ): Promise<void> {
    if (!this.isReady) {
      throw new Error("WebGL backend not ready");
    }

    try {
      // This would require modifying the WebGL system to support dynamic shader loading
      console.warn(
        "[WebGLBackplaneAdapter] Dynamic shader loading not yet implemented"
      );

      // TODO: Implement shader compilation and program creation
      // This would involve:
      // 1. Compiling vertex and fragment shaders
      // 2. Creating a new WebGL program
      // 3. Linking the program
      // 4. Setting up uniform locations
      // 5. Switching to the new program
    } catch (error) {
      console.error("[WebGLBackplaneAdapter] Failed to load shaders:", error);
      throw error;
    }
  }

  /**
   * Update shader uniforms
   */
  setUniforms(uniforms: Record<string, any>): void {
    if (!this.isReady) return;

    try {
      // Update uniforms in the current WebGL program
      // This would require access to the uniform locations
      console.warn(
        "[WebGLBackplaneAdapter] Dynamic uniform updates not yet implemented"
      );

      // TODO: Implement uniform updates
      // This would involve accessing the WebGL system's uniform locations
      // and updating them with the provided values
    } catch (error) {
      console.error("[WebGLBackplaneAdapter] Failed to set uniforms:", error);
    }
  }

  /**
   * Hot-reload shaders during development
   */
  async hotReloadShader(
    shaderType: "vertex" | "fragment",
    source: string
  ): Promise<void> {
    if (!this.isReady) {
      throw new Error("WebGL backend not ready");
    }

    try {
      console.log(`[WebGLBackplaneAdapter] Hot-reloading ${shaderType} shader`);

      // TODO: Implement hot-reload functionality
      // This would involve:
      // 1. Compiling the new shader
      // 2. Creating a new program with the updated shader
      // 3. Switching to the new program seamlessly
      // 4. Preserving current uniform values
    } catch (error) {
      console.error(
        `[WebGLBackplaneAdapter] Failed to hot-reload ${shaderType} shader:`,
        error
      );
      throw error;
    }
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  private detectCapabilities(): BackendCapabilities {
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

  private updatePerformanceMetrics(): void {
    // Estimate memory usage based on texture size and buffers
    const textureMemory =
      (Math.pow(this._capabilities.maxTextureSize / 4, 2) * 4) / (1024 * 1024); // Rough estimate
    this.performanceMetrics.memoryUsageMB = Math.min(textureMemory, 10); // Cap at 10MB

    // Estimate GPU usage based on enabled state and performance
    if (this._enabled && this.isReady) {
      this.performanceMetrics.gpuUsagePercent = Math.min(
        20 + (this.performanceMetrics.fps < 45 ? 15 : 0), // Higher usage if struggling
        this.currentConstraints.gpuBudgetPercent
      );
      this.performanceMetrics.cpuUsagePercent = 5; // WebGL is mostly GPU
    } else {
      this.performanceMetrics.gpuUsagePercent = 0;
      this.performanceMetrics.cpuUsagePercent = 0;
    }
  }
}
