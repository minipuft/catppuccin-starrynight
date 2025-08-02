/**
 * WebGLGradientBackgroundSystem - Flowing WebGL gradient background
 * Part of the Year 3000 System visual pipeline
 *
 * Implements Alex Harri's flowing gradient technique with Catppuccin color integration
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { unifiedEventBus, type EventData } from "@/core/events/UnifiedEventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import type {
  PerformanceMetrics,
  QualityCapability,
  QualityLevel,
  QualityScalingCapable,
} from "@/core/performance/PerformanceOrchestrator";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import {
  createGradientTexture,
  DEFAULT_VERTEX_SHADER,
  ShaderLoader,
} from "@/utils/graphics/ShaderLoader";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type {
  BackgroundConsciousnessChoreographer,
  BackgroundSystemParticipant,
  ConsciousnessField,
} from "../consciousness/BackgroundConsciousnessChoreographer";

// Import shared consciousness utilities
import {
  CONSCIOUSNESS_SHADER_LIBRARY,
  ConsciousnessShaderTemplate,
} from "../consciousness/ConsolidatedShaderLibrary";

// WebGL-specific shader using shared consciousness library
const webglConsciousnessShader =
  ConsciousnessShaderTemplate.buildFragmentShader({
    additionalUniforms: `
// WebGL-specific uniforms
uniform sampler2D u_gradientTex;
uniform float u_flowStrength;
uniform float u_noiseScale;
uniform float u_colorIntensity;
uniform float u_patternScale;
uniform float u_animationSpeed;

// Wave stack uniforms
uniform float u_waveY[2];
uniform float u_waveHeight[2];
uniform float u_waveOffset[2];
uniform float u_blurExp;
uniform float u_blurMax;`,

    additionalFunctions: `
// Octave noise for richer detail
float octaveNoise(vec2 uv, float octaves, float persistence, float scale) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = scale;
  float maxValue = 0.0;

  for(float i = 0.0; i < octaves; i++) {
    value += snoise(uv * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2.0;
  }

  return value / maxValue;
}

// Wave alpha calculation
float waveAlpha(vec2 uv, int waveIndex) {
  float y = uv.y;
  float waveCenter = u_waveY[waveIndex];
  float waveHeight = u_waveHeight[waveIndex];

  float distance = abs(y - waveCenter);
  return 1.0 - smoothstep(0.0, waveHeight * 0.5, distance);
}

// Dynamic blur calculation
float calculateBlur(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float distance = length(uv - center);
  float blur = pow(distance, u_blurExp);
  return clamp(blur, 0.0, u_blurMax);
}`,

    mainShaderLogic:
      CONSCIOUSNESS_SHADER_LIBRARY.Fragments.webglGradientFragment(),
  });

interface FlowGradientSettings {
  enabled: boolean;
  intensity: "minimal" | "balanced" | "intense";
  flowStrength: number;
  noiseScale: number;
  waveY: [number, number];
  waveHeight: [number, number];
  waveOffset: [number, number];
  blurExp: number;
  blurMax: number;
}

// Using shared consciousness shader management - no need for duplicate uniform interface

export class WebGLGradientBackgroundSystem
  extends BaseVisualSystem
  implements BackgroundSystemParticipant, QualityScalingCapable
{
  private canvas: HTMLCanvasElement | null = null;
  private wrapper: HTMLDivElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private shaderProgram: WebGLProgram | null = null;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};

  private gradientTexture: WebGLTexture | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private vao: WebGLVertexArrayObject | null = null;

  private settings: FlowGradientSettings = {
    enabled: true,
    intensity: "balanced",
    flowStrength: 0.7,
    noiseScale: 1.2,
    waveY: [0.25, 0.75], // Wave positions from theme metrics
    waveHeight: [0.4, 0.3], // Wave heights for smooth blending
    waveOffset: [2.5, -1.8], // Time offsets for wave independence
    blurExp: 1.2, // Blur power function exponent
    blurMax: 0.6, // Maximum blur amount
  };

  private isWebGLAvailable = false;
  private animationId: number | null = null;
  private startTime = 0;
  private lastFrameTime = 0;
  private frameThrottleInterval = 1000 / 45; // 45 FPS target

  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private cssConsciousnessController: UnifiedCSSConsciousnessController | null =
    null;
  private eventSubscriptionIds: string[] = [];
  private prefersReducedMotion = false;

  // Consciousness choreographer integration
  private consciousnessChoreographer: BackgroundConsciousnessChoreographer | null =
    null;
  private currentConsciousnessField: ConsciousnessField | null = null;

  private webglReady = false;

  // Texture creation throttling and debouncing
  private textureUpdatePending = false;
  private lastTextureUpdate = 0;
  private textureUpdateDebounceTimer: number | null = null;
  private readonly textureUpdateThrottleMs = 50; // Minimum time between texture updates
  private readonly textureUpdateDebounceMs = 300; // Debounce time for rapid events
  private textureCreationInProgress = false;

  // WebGL context management
  private contextLost = false;
  private pendingContextRestore = false;

  // Quality scaling properties
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [
    { name: "webgl-rendering", impact: "high", enabled: true, canToggle: true },
    {
      name: "shader-complexity",
      impact: "high",
      enabled: true,
      canToggle: true,
    },
    { name: "noise-octaves", impact: "medium", enabled: true, canToggle: true },
    { name: "wave-layers", impact: "medium", enabled: true, canToggle: true },
    { name: "blur-effects", impact: "low", enabled: true, canToggle: true },
    { name: "flow-strength", impact: "low", enabled: true, canToggle: true },
  ];
  private qualityAdjustments: { [key: string]: number } = {};

  // Required BackgroundSystemParticipant implementation
  public override readonly systemName: string = "WebGLGradientBackgroundSystem";
  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // WebGL is high priority for performance
  }

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    // Get ColorHarmonyEngine from year3000System if available
    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;

    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer =
      year3000System?.backgroundConsciousnessChoreographer || null;

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Event subscriptions will be set up during initialization
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Check WebGL2 capability
    this.isWebGLAvailable = this.checkWebGL2Support();

    if (!this.isWebGLAvailable) {
      this.fallbackToCSSGradient();
      return;
    }

    // Check device capabilities
    const deviceDetector = new DeviceCapabilityDetector();
    if (deviceDetector.recommendPerformanceQuality() === "low") {
      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Low performance device detected, falling back to CSS gradient"
      );
      this.fallbackToCSSGradient();
      return;
    }

    // Load settings
    this.loadSettings();

    if (!this.settings.enabled) {
      this.fallbackToCSSGradient();
      return;
    }

    try {
      await this.initializeWebGL();
      this.subscribeToEvents();
      this.registerWithConsciousnessChoreographer();
      this.startAnimation();

      // WebGL initialised; enable hybrid coordination for dynamic and living feel
      document.documentElement.style.setProperty("--sn-webgl-ready", "1");
      document.documentElement.style.setProperty("--sn-webgl-enabled", "1");
      document.documentElement.style.setProperty(
        "--sn-current-backend",
        "hybrid"
      );
      document.documentElement.style.setProperty(
        "--sn-gradient-crossfade-opacity",
        "0.5"
      ); // 50% blend

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL gradient system initialized successfully"
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Failed to initialize WebGL gradient:",
        error
      );
      this.fallbackToCSSGradient();
    }
  }

  private checkWebGL2Support(): boolean {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");

      if (!gl) {
        Y3K?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "WebGL2 context creation failed"
        );
        return false;
      }

      // Additional checks for critical WebGL2 features
      const requiredExtensions = ["EXT_color_buffer_float"];
      const missingExtensions: string[] = [];

      for (const ext of requiredExtensions) {
        if (!gl.getExtension(ext)) {
          missingExtensions.push(ext);
        }
      }

      if (missingExtensions.length > 0) {
        Y3K?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "Missing WebGL2 extensions:",
          missingExtensions
        );
      }

      // Check for basic WebGL functionality
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL2 capability check:",
        {
          maxTextureSize,
          maxRenderbufferSize,
          missingExtensions:
            missingExtensions.length > 0 ? missingExtensions : "none",
        }
      );

      return true;
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "WebGL2 support check failed:",
        error
      );
      return false;
    }
  }

  private findSpotifyContainer(): HTMLElement {
    // Try to find the best container in order of preference
    const containers = [
      ".Root__main-view",
      ".main-view-container",
      ".main-gridContainer-gridContainer",
      ".Root__top-container",
      "body",
    ];

    for (const selector of containers) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          `Found container: ${selector}`
        );
        return element;
      }
    }

    Y3K?.debug?.warn(
      "WebGLGradientBackgroundSystem",
      "No Spotify container found, falling back to body"
    );
    return document.body;
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      const intensitySetting = this.settingsManager.get(
        "sn-flow-gradient" as any
      );

      if (intensitySetting === "disabled") {
        this.settings.enabled = false;
        return;
      }

      this.settings.intensity = (intensitySetting as any) || "balanced";

      // Map intensity to parameters
      switch (this.settings.intensity) {
        case "minimal":
          this.settings.flowStrength = 0.4;
          this.settings.noiseScale = 0.8;
          this.settings.waveHeight = [0.3, 0.2];
          this.settings.waveOffset = [1.5, -1.0];
          this.settings.blurExp = 1.0;
          this.settings.blurMax = 0.4;
          break;
        case "balanced":
          this.settings.flowStrength = 0.7;
          this.settings.noiseScale = 1.2;
          this.settings.waveHeight = [0.4, 0.3];
          this.settings.waveOffset = [2.5, -1.8];
          this.settings.blurExp = 1.2;
          this.settings.blurMax = 0.6;
          break;
        case "intense":
          this.settings.flowStrength = 1.0;
          this.settings.noiseScale = 1.6;
          this.settings.waveHeight = [0.5, 0.4];
          this.settings.waveOffset = [3.5, -2.5];
          this.settings.blurExp = 1.4;
          this.settings.blurMax = 0.8;
          break;
      }
    } catch (error) {
      Y3K?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to load settings, using defaults:",
        error
      );
    }
  }

  private async initializeWebGL(): Promise<void> {
    // Create wrapper div for skew transforms
    this.wrapper = document.createElement("div");
    this.wrapper.className = "sn-flow-gradient-wrapper";
    this.wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -11;
      pointer-events: none;
      overflow: hidden;
    `;

    // Create canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "sn-webgl-gradient";
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;

    // Wrap canvas in the wrapper
    this.wrapper.appendChild(this.canvas);

    // Get WebGL2 context with enhanced error handling
    try {
      this.gl = this.canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "default",
      });

      if (!this.gl) {
        throw new Error(
          "WebGL2 context creation returned null - likely unsupported"
        );
      }

      // Setup context loss and restore handlers
      this.setupContextLossHandlers();

      // Verify context is functional
      const testResult = this.gl.getParameter(this.gl.VERSION);
      if (!testResult) {
        throw new Error(
          "WebGL2 context appears non-functional - getParameter failed"
        );
      }

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL2 context created successfully:",
        {
          version: testResult,
          renderer: this.gl.getParameter(this.gl.RENDERER),
          vendor: this.gl.getParameter(this.gl.VENDOR),
        }
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "WebGL2 context creation failed:",
        error
      );
      throw new Error(
        `Failed to create WebGL2 context: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // Compile shaders
    await this.compileShaders();

    // Create geometry
    this.createGeometry();

    // Create gradient texture
    await this.updateGradientTexture();

    // Set up uniforms
    this.setupUniforms();

    // Configure canvas size
    this.resize();

    // Add wrapper to DOM - target proper Spotify container
    const targetContainer = this.findSpotifyContainer();
    targetContainer.appendChild(this.wrapper);

    // Set up resize handler
    window.addEventListener("resize", this.resize.bind(this));
  }

  private async compileShaders(): Promise<void> {
    if (!this.gl) throw new Error("WebGL context not available");

    const vertexShader = ShaderLoader.loadVertex(
      this.gl,
      DEFAULT_VERTEX_SHADER
    );
    const fragmentShader = ShaderLoader.loadFragment(
      this.gl,
      webglConsciousnessShader
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to compile shaders");
    }

    this.shaderProgram = ShaderLoader.createProgram(
      this.gl,
      vertexShader,
      fragmentShader
    );

    if (!this.shaderProgram) {
      throw new Error("Failed to create shader program");
    }
  }

  private createGeometry(): void {
    if (!this.gl || !this.shaderProgram) return;

    // Full-screen triangle vertices
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);

    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Create VAO
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    const positionLocation = this.gl.getAttribLocation(
      this.shaderProgram,
      "a_position"
    );
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.bindVertexArray(null);
  }

  private setupUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;

    this.uniforms.u_time = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_time"
    );
    this.uniforms.u_gradientTex = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_gradientTex"
    );
    this.uniforms.u_resolution = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_resolution"
    );
    this.uniforms.u_flowStrength = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_flowStrength"
    );
    this.uniforms.u_noiseScale = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_noiseScale"
    );
    this.uniforms.u_waveY = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_waveY"
    );
    this.uniforms.u_waveHeight = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_waveHeight"
    );
    this.uniforms.u_waveOffset = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_waveOffset"
    );
    this.uniforms.u_blurExp = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_blurExp"
    );
    this.uniforms.u_blurMax = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_blurMax"
    );
  }

  private async updateGradientTexture(): Promise<void> {
    if (!this.gl) {
      Y3K?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "No WebGL context available"
      );
      return;
    }

    // Enhanced WebGL context validation
    if (!this.isContextValid()) {
      Y3K?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "WebGL context invalid, attempting recovery"
      );

      // Try to recover context if possible
      if (this.contextLost && !this.pendingContextRestore) {
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "Attempting WebGL context recovery"
        );
        this.fallbackToCSSGradient();
      }
      return;
    }

    // Check for WebGL errors before starting
    const preError = this.gl.getError();
    if (preError !== this.gl.NO_ERROR) {
      Y3K?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        `WebGL error detected before texture update: ${preError}`
      );
      // Clear the error and continue - some errors are recoverable
      while (this.gl.getError() !== this.gl.NO_ERROR) {
        // Clear all pending errors
      }
    }

    // Prevent overlapping texture creation operations
    if (this.textureCreationInProgress) {
      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Texture creation already in progress, skipping update"
      );
      return;
    }

    this.textureCreationInProgress = true;

    try {
      // Enhanced color acquisition with fallback chain:
      // 1. ColorHarmonyEngine (primary source)
      // 2. CSS variables (fallback when engine fails)
      // 3. Default gradient (final fallback)
      let colorStops = this.getDefaultGradientStops();
      let colorSource = "default";

      // Try ColorHarmonyEngine first
      if (this.colorHarmonyEngine) {
        try {
          const currentGradient = this.colorHarmonyEngine.getCurrentGradient(5);
          if (currentGradient && currentGradient.length > 0) {
            colorStops = currentGradient.map((color, index) => ({
              r: color.r / 255,
              g: color.g / 255,
              b: color.b / 255,
              a: 1.0,
              position: index / (currentGradient.length - 1),
            }));
            colorSource = "ColorHarmonyEngine";

            Y3K?.debug?.log(
              "WebGLGradientBackgroundSystem",
              `Updated gradient texture with ${colorStops.length} stops from ColorHarmonyEngine`
            );
          } else {
            // ColorHarmonyEngine available but returned empty - try CSS fallback
            const cssColorStops = this.getCSSGradientStops();
            if (cssColorStops && cssColorStops.length > 0) {
              colorStops = cssColorStops;
              colorSource = "CSS variables";
              Y3K?.debug?.log(
                "WebGLGradientBackgroundSystem",
                `ColorHarmonyEngine returned empty, using CSS gradient fallback with ${colorStops.length} stops`
              );
            }
          }
        } catch (error) {
          Y3K?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Failed to get gradient from ColorHarmonyEngine, trying CSS fallback:",
            error
          );

          // ColorHarmonyEngine failed - try CSS variables fallback
          const cssColorStops = this.getCSSGradientStops();
          if (cssColorStops && cssColorStops.length > 0) {
            colorStops = cssColorStops;
            colorSource = "CSS variables (engine failed)";
            Y3K?.debug?.log(
              "WebGLGradientBackgroundSystem",
              `Using CSS gradient fallback after ColorHarmonyEngine error with ${colorStops.length} stops`
            );
          }
        }
      } else {
        // No ColorHarmonyEngine available - try CSS fallback
        const cssColorStops = this.getCSSGradientStops();
        if (cssColorStops && cssColorStops.length > 0) {
          colorStops = cssColorStops;
          colorSource = "CSS variables (no engine)";
          Y3K?.debug?.log(
            "WebGLGradientBackgroundSystem",
            `No ColorHarmonyEngine available, using CSS gradient fallback with ${colorStops.length} stops`
          );
        }
      }

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Final color source: ${colorSource}, stops: ${colorStops.length}`
      );

      // Validate WebGL context is still valid before texture operations
      if (this.gl.isContextLost()) {
        throw new Error("WebGL context was lost during gradient preparation");
      }

      // Clean up old texture with error checking
      if (this.gradientTexture) {
        try {
          this.gl.deleteTexture(this.gradientTexture);
        } catch (error) {
          Y3K?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Error deleting old texture:",
            error
          );
        }
        this.gradientTexture = null as any; // Clear reference
      }

      // Validate color stops before proceeding
      if (!colorStops || colorStops.length === 0) {
        Y3K?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "No valid color stops, using defaults"
        );
        colorStops = this.getDefaultGradientStops();
      }

      // Create new gradient texture with enhanced error handling and retry logic
      let newTexture = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (!newTexture && attempts < maxAttempts) {
        attempts++;

        try {
          // Check context validity before each attempt
          if (this.gl.isContextLost()) {
            throw new Error(
              "WebGL context lost during texture creation attempt"
            );
          }

          newTexture = createGradientTexture(this.gl, colorStops);

          if (newTexture) {
            Y3K?.debug?.log(
              "WebGLGradientBackgroundSystem",
              `Gradient texture created successfully on attempt ${attempts}`
            );
            break;
          }
        } catch (error) {
          Y3K?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            `Texture creation attempt ${attempts} failed:`,
            error
          );

          // Wait a bit before retrying (progressive backoff)
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, attempts * 10));
          }
        }
      }

      if (!newTexture) {
        Y3K?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Failed to create gradient texture after all attempts - trying default colors"
        );

        // Final fallback: try with default gradient
        try {
          const defaultStops = this.getDefaultGradientStops();
          const fallbackTexture = createGradientTexture(this.gl, defaultStops);

          if (!fallbackTexture) {
            throw new Error(
              "Failed to create gradient texture even with default colors"
            );
          }

          this.gradientTexture = fallbackTexture;
          colorStops = defaultStops;

          Y3K?.debug?.log(
            "WebGLGradientBackgroundSystem",
            "Using default gradient fallback after all attempts failed"
          );
        } catch (fallbackError) {
          Y3K?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "Default gradient fallback failed:",
            fallbackError
          );
          throw new Error(
            `Gradient texture creation completely failed: ${fallbackError}`
          );
        }
      } else {
        this.gradientTexture = newTexture;
      }

      // Update last texture update timestamp
      this.lastTextureUpdate = performance.now();

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Gradient texture updated successfully using ${colorSource}`,
        {
          colorStops: colorStops.length,
          source: colorSource,
          firstColor: colorStops[0]
            ? `rgb(${Math.round(colorStops[0].r * 255)},${Math.round(
                colorStops[0].g * 255
              )},${Math.round(colorStops[0].b * 255)})`
            : "none",
        }
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Critical error in updateGradientTexture:",
        error
      );

      // Attempt to recover by falling back to CSS gradient
      if (error instanceof Error && error.message.includes("context")) {
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "WebGL context-related error detected, switching to CSS fallback"
        );
        this.fallbackToCSSGradient();
      } else {
        // For non-context errors, try a simple recovery
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "Attempting simple texture recovery with default colors"
        );

        try {
          // Clear any invalid state
          this.gradientTexture = null as any;

          // Try once more with default colors
          const defaultStops = this.getDefaultGradientStops();
          if (this.gl && !this.gl.isContextLost()) {
            this.gradientTexture = createGradientTexture(this.gl, defaultStops);

            if (this.gradientTexture) {
              Y3K?.debug?.log(
                "WebGLGradientBackgroundSystem",
                "Successfully recovered with default gradient"
              );
            } else {
              throw new Error("Recovery attempt failed");
            }
          } else {
            throw new Error("WebGL context unavailable for recovery");
          }
        } catch (recoveryError) {
          Y3K?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "Recovery attempt failed, falling back to CSS:",
            recoveryError
          );
          this.fallbackToCSSGradient();
        }
      }
    } finally {
      this.textureCreationInProgress = false;
    }
  }

  /**
   * Throttled texture update to prevent rapid-fire texture creation
   */
  private async updateGradientTextureThrottled(): Promise<void> {
    const now = performance.now();

    // Check if we're within throttle window
    if (now - this.lastTextureUpdate < this.textureUpdateThrottleMs) {
      // Schedule update for later if not already pending
      if (!this.textureUpdatePending) {
        this.textureUpdatePending = true;

        const timeToWait =
          this.textureUpdateThrottleMs - (now - this.lastTextureUpdate);
        setTimeout(() => {
          this.textureUpdatePending = false;
          this.updateGradientTexture().catch((error) => {
            Y3K?.debug?.error(
              "WebGLGradientBackgroundSystem",
              "Throttled texture update failed:",
              error
            );
          });
        }, timeToWait);
      }
      return;
    }

    // Update immediately if not within throttle window
    await this.updateGradientTexture();
  }

  /**
   * Debounced texture update to handle rapid event sequences
   */
  private debouncedUpdateGradientTexture(): void {
    // Clear existing debounce timer
    if (this.textureUpdateDebounceTimer) {
      clearTimeout(this.textureUpdateDebounceTimer);
    }

    // Set new debounce timer
    this.textureUpdateDebounceTimer = window.setTimeout(() => {
      this.textureUpdateDebounceTimer = null;
      this.updateGradientTextureThrottled().catch((error) => {
        Y3K?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Debounced texture update failed:",
          error
        );
      });
    }, this.textureUpdateDebounceMs);
  }

  /**
   * Setup WebGL context loss and restore event handlers
   */
  private setupContextLossHandlers(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener(
      "webglcontextlost",
      async (event) => {
        Y3K?.debug?.warn("WebGLGradientBackgroundSystem", "WebGL context lost");
        event.preventDefault(); // Prevent default context loss behavior

        this.contextLost = true;
        this.textureCreationInProgress = false;

        // Clear shader cache immediately when context is lost
        if (this.gl) {
          try {
            const { ShaderLoader } = await import(
              "../../utils/graphics/ShaderLoader"
            );
            ShaderLoader.clearContextCache(this.gl);
          } catch (e) {
            // Import might fail during shutdown, ignore
          }
        }

        // Clear any pending texture updates
        if (this.textureUpdateDebounceTimer) {
          clearTimeout(this.textureUpdateDebounceTimer);
          this.textureUpdateDebounceTimer = null;
        }
        this.textureUpdatePending = false;

        // Stop animation loop
        if (this.animationId) {
          cancelAnimationFrame(this.animationId);
          this.animationId = null;
        }
      },
      false
    );

    this.canvas.addEventListener(
      "webglcontextrestored",
      async () => {
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "WebGL context restored, reinitializing"
        );

        this.contextLost = false;
        this.pendingContextRestore = true;

        try {
          // Re-verify context functionality
          if (!this.gl || this.gl.isContextLost()) {
            throw new Error("Context is still lost after restore event");
          }

          // Reinitialize WebGL resources
          await this.reinitializeWebGLResources();

          // Restart animation
          this.startAnimation();

          this.pendingContextRestore = false;

          Y3K?.debug?.log(
            "WebGLGradientBackgroundSystem",
            "WebGL context restore completed successfully"
          );
        } catch (error) {
          Y3K?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "Failed to restore WebGL context:",
            error
          );
          this.pendingContextRestore = false;
          this.fallbackToCSSGradient();
        }
      },
      false
    );
  }

  /**
   * Reinitialize WebGL resources after context restore
   */
  private async reinitializeWebGLResources(): Promise<void> {
    if (!this.gl) throw new Error("WebGL context not available");

    // Clear any existing resources (they're invalid after context loss)
    this.shaderProgram = null as any;
    this.vertexBuffer = null as any;
    this.vao = null as any;
    this.gradientTexture = null as any;

    // CRITICAL: Clear shader cache to prevent reusing invalid shader objects
    const { ShaderLoader } = await import("../../utils/graphics/ShaderLoader");
    ShaderLoader.clearContextCache(this.gl);

    // Recompile shaders (now will create fresh shader objects)
    await this.compileShaders();

    // Recreate geometry
    this.createGeometry();

    // Recreate gradient texture
    await this.updateGradientTexture();

    // Setup uniforms again
    this.setupUniforms();

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "WebGL resources reinitialized after context restore"
    );
  }

  /**
   * Check if WebGL context is available and functional
   */
  private isContextValid(): boolean {
    if (!this.gl) return false;
    if (this.contextLost) return false;
    if (this.gl.isContextLost()) {
      this.contextLost = true;
      return false;
    }
    return true;
  }

  private getDefaultGradientStops() {
    // Catppuccin Mocha default gradient
    return [
      { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 0.0 }, // Base
      { r: 0.549, g: 0.408, b: 0.878, a: 1.0, position: 0.3 }, // Mauve
      { r: 0.788, g: 0.557, b: 0.902, a: 1.0, position: 0.6 }, // Pink
      { r: 0.957, g: 0.761, b: 0.494, a: 1.0, position: 1.0 }, // Peach
    ];
  }

  /**
   * Get gradient color stops from CSS variables that inherit from ColorHarmonyEngine
   * These variables are set by OKLAB processing and represent the actual background gradient colors
   */
  private getCSSGradientStops(): Array<{
    r: number;
    g: number;
    b: number;
    a: number;
    position: number;
  }> | null {
    try {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      // Read the actual background gradient variables that inherit from ColorHarmonyEngine
      const gradientVariables = [
        "--sn-bg-gradient-primary-rgb",
        "--sn-bg-gradient-secondary-rgb",
        "--sn-bg-gradient-tertiary-rgb",
      ];

      const colorStops: Array<{
        r: number;
        g: number;
        b: number;
        a: number;
        position: number;
      }> = [];

      for (let i = 0; i < gradientVariables.length; i++) {
        const variableName =
          gradientVariables[i] || "--sn-bg-gradient-primary-rgb";
        const rgbStr = computedStyle.getPropertyValue(variableName).trim();

        if (!rgbStr) {
          Y3K?.debug?.log(
            "WebGLGradientBackgroundSystem",
            `CSS variable ${variableName} not set, trying without CSS fallback`
          );
          continue;
        }

        // Parse RGB string like "203,166,247" or "203, 166, 247"
        const rgbValues = rgbStr.split(",").map((v) => parseInt(v.trim(), 10));
        if (
          rgbValues.length !== 3 ||
          rgbValues.some((v) => isNaN(v) || v < 0 || v > 255)
        ) {
          Y3K?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            `Invalid RGB values in ${variableName}: ${rgbStr}, skipping this color`
          );
          continue;
        }

        colorStops.push({
          r: (rgbValues[0] ?? 0) / 255,
          g: (rgbValues[1] ?? 0) / 255,
          b: (rgbValues[2] ?? 0) / 255,
          a: 1.0,
          position: i / (gradientVariables.length - 1),
        });
      }

      // Need at least 2 colors for a valid gradient
      if (colorStops.length < 2) {
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          `Only ${colorStops.length} valid CSS colors found, need at least 2 for gradient`
        );
        return null;
      }

      // Add additional background settings if available
      const opacityStr = computedStyle
        .getPropertyValue("--sn-bg-gradient-opacity")
        .trim();
      const opacity = opacityStr ? parseFloat(opacityStr) : 1.0;

      // Apply opacity to all color stops
      if (opacity !== 1.0 && opacity > 0 && opacity <= 1.0) {
        colorStops.forEach((stop) => {
          stop.a = opacity;
        });
      }

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Successfully parsed ${colorStops.length} CSS background gradient stops from OKLAB inheritance`,
        {
          colors: colorStops.map(
            (stop) =>
              `rgba(${Math.round(stop.r * 255)},${Math.round(
                stop.g * 255
              )},${Math.round(stop.b * 255)},${stop.a})`
          ),
          opacity: opacity !== 1.0 ? opacity : "default",
        }
      );

      return colorStops;
    } catch (error) {
      Y3K?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to parse CSS background gradient variables:",
        error
      );
      return null;
    }
  }

  private subscribeToEvents(): void {
    // Subscribe to color harmonization events
    const colorHarmonizedSub = unifiedEventBus.subscribe(
      "colors:harmonized",
      this.handleColorHarmonized.bind(this),
      "WebGLGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(colorHarmonizedSub);

    // Subscribe to color application events for coordination
    const colorAppliedSub = unifiedEventBus.subscribe(
      "colors:applied",
      this.handleColorApplied.bind(this),
      "WebGLGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(colorAppliedSub);

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Subscribed to unified events",
      {
        subscriptionCount: this.eventSubscriptionIds.length,
      }
    );
  }

  // Event deduplication tracking
  private lastColorHarmonizedData: string | null = null;
  private lastColorHarmonizedTime = 0;

  private handleColorHarmonized(data: EventData<"colors:harmonized">): void {
    // Event deduplication - skip if same data received recently
    const currentTime = performance.now();
    const dataHash = `${data.accentHex}-${
      data.processingTime
    }-${data.strategies.join(",")}`;

    if (
      this.lastColorHarmonizedData === dataHash &&
      currentTime - this.lastColorHarmonizedTime < 100
    ) {
      // 100ms deduplication window
      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Duplicate color harmonization event detected, skipping"
      );
      return;
    }

    this.lastColorHarmonizedData = dataHash;
    this.lastColorHarmonizedTime = currentTime;

    // Update gradient texture with new harmonized colors using debounced method
    this.debouncedUpdateGradientTexture();

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Color harmonization processed",
      {
        strategies: data.strategies,
        processingTime: data.processingTime,
        accentHex: data.accentHex,
        deduplicationHash: dataHash.substring(0, 16) + "...",
      }
    );
  }

  private handleColorApplied(data: EventData<"colors:applied">): void {
    // Coordinate with CSS variables for hybrid rendering
    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Color application coordinated",
      {
        accentHex: data.accentHex,
        appliedAt: data.appliedAt,
      }
    );
  }

  private startAnimation(): void {
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.animate();
  }

  private animate = (): void => {
    if (!this.isActive || !this.gl || !this.canvas) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Throttle to target FPS
    if (deltaTime < this.frameThrottleInterval) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }

    this.lastFrameTime = currentTime;
    this.render(currentTime);

    this.animationId = requestAnimationFrame(this.animate);
  };

  private render(currentTime: number): void {
    if (!this.gl || !this.shaderProgram || !this.vao || !this.gradientTexture)
      return;

    // Clear canvas
    this.gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use shader program
    this.gl.useProgram(this.shaderProgram);

    // Bind VAO
    this.gl.bindVertexArray(this.vao);

    // First successful draw → establish hybrid coordination (only once)
    if (!this.webglReady) {
      this.webglReady = true;
      document.documentElement.style.setProperty("--sn-webgl-ready", "1");
      document.documentElement.style.setProperty("--sn-webgl-enabled", "1");
      document.documentElement.style.setProperty(
        "--sn-current-backend",
        "hybrid"
      );
      document.documentElement.style.setProperty(
        "--sn-gradient-crossfade-opacity",
        "0.5"
      ); // Balanced hybrid blend
    }

    // Update uniforms
    const time = this.prefersReducedMotion
      ? 0
      : (currentTime - this.startTime) / 1000;

    if (this.uniforms.u_time) {
      this.gl.uniform1f(this.uniforms.u_time, time);
    }

    if (this.uniforms.u_resolution) {
      this.gl.uniform2f(
        this.uniforms.u_resolution,
        this.canvas!.width,
        this.canvas!.height
      );
    }

    if (this.uniforms.u_flowStrength) {
      // BeatSync ↔ Flow Gradient Adapter: Read flow strength from CSS variable
      const rootStyle = document.documentElement;
      const flowStrengthValue = rootStyle.style
        .getPropertyValue("--sn-flow-strength")
        .trim();
      const flowStrength = flowStrengthValue
        ? parseFloat(flowStrengthValue)
        : this.settings.flowStrength;
      this.gl.uniform1f(this.uniforms.u_flowStrength, flowStrength);
    }

    if (this.uniforms.u_noiseScale) {
      this.gl.uniform1f(this.uniforms.u_noiseScale, this.settings.noiseScale);
    }

    // Update wave stack uniforms
    if (this.uniforms.u_waveY) {
      this.gl.uniform1fv(this.uniforms.u_waveY, this.settings.waveY);
    }

    if (this.uniforms.u_waveHeight) {
      this.gl.uniform1fv(this.uniforms.u_waveHeight, this.settings.waveHeight);
    }

    if (this.uniforms.u_waveOffset) {
      this.gl.uniform1fv(this.uniforms.u_waveOffset, this.settings.waveOffset);
    }

    if (this.uniforms.u_blurExp) {
      this.gl.uniform1f(this.uniforms.u_blurExp, this.settings.blurExp);
    }

    if (this.uniforms.u_blurMax) {
      this.gl.uniform1f(this.uniforms.u_blurMax, this.settings.blurMax);
    }

    // Bind gradient texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.gradientTexture);

    if (this.uniforms.u_gradientTex) {
      this.gl.uniform1i(this.uniforms.u_gradientTex, 0);
    }

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

    // Cleanup
    this.gl.bindVertexArray(null);
  }

  private resize = (): void => {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    this.canvas.style.width = displayWidth + "px";
    this.canvas.style.height = displayHeight + "px";
  };

  private fallbackToCSSGradient(): void {
    // Switch to pure CSS mode - gradients take full control for complete fallback
    document.documentElement.style.setProperty("--sn-webgl-ready", "0");
    document.documentElement.style.setProperty("--sn-webgl-enabled", "0");
    document.documentElement.style.setProperty("--sn-current-backend", "css");
    document.documentElement.style.setProperty(
      "--sn-gradient-crossfade-opacity",
      "0"
    ); // Full CSS opacity
    // Update CSS variables for fallback gradient animation
    if (this.cssConsciousnessController) {
      this.startCSSFallbackAnimation();
    }

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Using CSS gradient fallback"
    );
  }

  private startCSSFallbackAnimation(): void {
    if (!this.cssConsciousnessController) return;

    // Animate CSS variables to simulate flow
    const animateCSS = () => {
      if (!this.isActive) return;

      const time = performance.now() / 1000;
      const flowX = Math.sin(time * 0.04) * 20 + Math.sin(time * 0.07) * 8; // More organic movement
      const flowY = Math.cos(time * 0.05) * 20 + Math.cos(time * 0.09) * 6;
      const scale = 1.15 + Math.sin(time * 0.03) * 0.2; // Enhanced base scale with more variation

      const batcher = this.cssConsciousnessController;
      if (!batcher) return;
      batcher.queueCSSVariableUpdate("--sn-gradient-flow-x", `${flowX}%`);
      batcher.queueCSSVariableUpdate("--sn-gradient-flow-y", `${flowY}%`);
      batcher.queueCSSVariableUpdate(
        "--sn-gradient-flow-scale",
        scale.toString()
      );

      setTimeout(animateCSS, this.frameThrottleInterval);
    };

    animateCSS();
  }

  public override handleSettingsChange(event: Event): void {
    super.handleSettingsChange(event);

    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key === "sn-flow-gradient") {
      const wasEnabled = this.settings.enabled;
      this.settings.intensity = value;
      this.loadSettings();

      if (value === "disabled" && wasEnabled) {
        this.settings.enabled = false;
        this.destroy();
        this.fallbackToCSSGradient();
      } else if (
        this.settings.enabled &&
        !wasEnabled &&
        this.isWebGLAvailable
      ) {
        // Re-initialize if going from disabled to enabled
        this.initialize();
      }
    }
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant(
          "WebGLGradientBackgroundSystem"
        );
        Y3K?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "Unregistered from consciousness choreographer"
        );
      } catch (error) {
        Y3K?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Error unregistering from consciousness choreographer:",
          error
        );
      }
    }

    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Clean up texture update timers
    if (this.textureUpdateDebounceTimer) {
      clearTimeout(this.textureUpdateDebounceTimer);
      this.textureUpdateDebounceTimer = null;
    }

    // Reset texture update state
    this.textureUpdatePending = false;
    this.textureCreationInProgress = false;
    this.lastColorHarmonizedData = null;

    // Clean up WebGL resources
    if (this.gl) {
      if (this.gradientTexture) {
        this.gl.deleteTexture(this.gradientTexture);
        this.gradientTexture = null;
      }

      if (this.vertexBuffer) {
        this.gl.deleteBuffer(this.vertexBuffer);
        this.vertexBuffer = null;
      }

      if (this.vao) {
        this.gl.deleteVertexArray(this.vao);
        this.vao = null;
      }

      if (this.shaderProgram) {
        this.gl.deleteProgram(this.shaderProgram);
        this.shaderProgram = null;
      }

      // Clear shader cache
      ShaderLoader.clearCache(this.gl);
    }

    // Remove wrapper (which contains the canvas)
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
    }
    this.canvas = null;

    // Clean up unified event subscriptions
    this.eventSubscriptionIds.forEach((subscriptionId) => {
      unifiedEventBus.unsubscribe(subscriptionId);
    });
    this.eventSubscriptionIds = [];

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Unified event subscriptions cleaned up"
    );

    window.removeEventListener("resize", this.resize);

    this.gl = null;

    // Reset all hybrid coordination flags so CSS regains full control
    document.documentElement.style.setProperty("--sn-webgl-ready", "0");
    document.documentElement.style.setProperty("--sn-webgl-enabled", "0");
    document.documentElement.style.setProperty("--sn-current-backend", "css");
    document.documentElement.style.setProperty(
      "--sn-gradient-crossfade-opacity",
      "0"
    );
  }

  public override forceRepaint(_reason: string = "settings-change"): void {
    if (this.isActive && this.gradientTexture) {
      this.updateGradientTexture().catch((error) => {
        Y3K?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Failed to repaint gradient:",
          error
        );
      });
    }
  }

  // Public setters for wave parameters
  public setWaveY(waveY: [number, number]): void {
    this.settings.waveY = waveY;
  }

  public setWaveHeight(waveHeight: [number, number]): void {
    this.settings.waveHeight = waveHeight;
  }

  public setWaveOffset(waveOffset: [number, number]): void {
    this.settings.waveOffset = waveOffset;
  }

  public setBlurSettings(blurExp: number, blurMax: number): void {
    this.settings.blurExp = blurExp;
    this.settings.blurMax = blurMax;
  }

  public getMetrics(): {
    fps: number;
    compileErrors: number;
    isActive: boolean;
    settings: FlowGradientSettings;
  } {
    return {
      fps: this.performanceMonitor?.getMedianFPS?.() || 0,
      compileErrors: 0, // TODO: Track compilation errors
      isActive: this.isActive,
      settings: { ...this.settings },
    };
  }

  /**
   * Gracefully stop the animation loop.  Exposed for backplane adapters.
   */
  public stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Lightweight health check used by adapters; returns OK if WebGL is ready.
   */
  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    return {
      ok: this.webglReady,
      details: this.webglReady
        ? "WebGL system nominal"
        : "WebGL not initialized",
    };
  }

  /**
   * Alternative resize helper that allows explicit dimensions while leaving
   * the original `resize` listener (no-arg) intact.
   */
  public resizeTo(width: number, height: number): void {
    if (!this.canvas) return;
    this.canvas.width = width;
    this.canvas.height = height;
    // Trigger any additional resize handling logic via existing arrow fn.
    (this as any).resize?.();
  }

  // ===================================================================
  // CONSCIOUSNESS CHOREOGRAPHER INTEGRATION
  // ===================================================================

  /**
   * Register this WebGL system as a consciousness participant
   */
  private registerWithConsciousnessChoreographer(): void {
    if (!this.consciousnessChoreographer) {
      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Consciousness choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Successfully registered with consciousness choreographer"
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Failed to register with consciousness choreographer:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  // SystemName and systemPriority already declared above

  public getConsciousnessContribution(): any {
    return {
      webglLuminosity: this.settings.flowStrength || 0.5,
      shaderComplexity: this.isWebGLAvailable ? 0.8 : 0,
      gpuUtilization: this.isWebGLAvailable ? 0.6 : 0,
      renderingPipeline: "forward",
      textureResolution: 1.0,
    };
  }

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    if (!this.isWebGLAvailable || !this.webglReady) return;

    try {
      this.currentConsciousnessField = field;

      // Update shader uniforms based on consciousness field
      this.updateShaderFromConsciousness(field);

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Updated from consciousness field:",
        {
          rhythmicPulse: field.rhythmicPulse,
          webglLuminosity: field.webglLuminosity,
          emotionalTemperature: field.emotionalTemperature,
        }
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Error updating from consciousness field:",
        error
      );
    }
  }

  public onChoreographyEvent(eventType: string, payload: any): void {
    if (!this.isWebGLAvailable || !this.webglReady) return;

    try {
      switch (eventType) {
        case "choreography:rhythm-shift":
          // Adjust animation timing based on rhythm changes
          this.frameThrottleInterval =
            1000 / Math.max(30, Math.min(60, payload.newRhythm?.bpm / 2 || 45));
          break;

        case "choreography:energy-surge":
          // Boost visual intensity during energy surges
          if (this.cssConsciousnessController) {
            const surgeIntensity = payload.intensity || 1.0;
            this.cssConsciousnessController.queueCSSVariableUpdate(
              "--sn-webgl-energy-surge",
              surgeIntensity.toString()
            );
          }
          break;

        case "consciousness:breathing-cycle":
          // Synchronize with breathing patterns
          const breathingPhase = payload.phase || 0;
          if (this.cssConsciousnessController) {
            this.cssConsciousnessController.queueCSSVariableUpdate(
              "--sn-webgl-breathing-sync",
              breathingPhase.toString()
            );
          }
          break;
      }

      Y3K?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3K?.debug?.error(
        "WebGLGradientBackgroundSystem",
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  /**
   * Update WebGL shader parameters based on consciousness field
   */
  private updateShaderFromConsciousness(field: ConsciousnessField): void {
    if (!this.gl || !this.shaderProgram) return;

    // Modulate flow strength with rhythmic pulse
    const consciousFlowStrength =
      this.settings.flowStrength * (0.5 + field.rhythmicPulse * 0.5);
    const flowStrengthLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_flowStrength"
    );
    if (flowStrengthLocation) {
      this.gl.uniform1f(flowStrengthLocation, consciousFlowStrength);
    }

    // Modulate noise scale with musical flow
    const consciousNoiseScale =
      this.settings.noiseScale * (0.8 + field.musicalFlow.x * 0.4);
    const noiseScaleLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_noiseScale"
    );
    if (noiseScaleLocation) {
      this.gl.uniform1f(noiseScaleLocation, consciousNoiseScale);
    }

    // Update wave parameters with breathing cycle
    const breathingModulation =
      Math.sin(Date.now() * 0.001 * field.breathingCycle) * 0.1;
    const waveYLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_waveY"
    );
    if (waveYLocation) {
      const modulatedWaveY = [
        this.settings.waveY[0] + breathingModulation,
        this.settings.waveY[1] - breathingModulation,
      ];
      this.gl.uniform1fv(waveYLocation, modulatedWaveY);
    }

    // Apply consciousness-aware CSS variables for hybrid coordination
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-webgl-consciousness-flow",
        consciousFlowStrength.toString()
      );
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-webgl-consciousness-noise",
        consciousNoiseScale.toString()
      );
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-webgl-breathing-phase",
        breathingModulation.toString()
      );
    }
  }

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  /**
   * Set quality level for WebGL rendering
   */
  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;

    // Adjust WebGL settings based on quality level
    switch (level.level) {
      case "minimal":
        this.settings.flowStrength = 0.3;
        this.settings.noiseScale = 0.8;
        this.settings.waveHeight = [0.2, 0.15];
        this.settings.blurExp = 0.8;
        this.settings.blurMax = 0.3;
        this.frameThrottleInterval = 1000 / 20; // 20 FPS
        // Disable WebGL if necessary
        if (!level.features.webgl) {
          this.fallbackToCSSGradient();
          return;
        }
        break;

      case "low":
        this.settings.flowStrength = 0.5;
        this.settings.noiseScale = 1.0;
        this.settings.waveHeight = [0.3, 0.2];
        this.settings.blurExp = 1.0;
        this.settings.blurMax = 0.4;
        this.frameThrottleInterval = 1000 / 30; // 30 FPS
        break;

      case "medium":
        this.settings.flowStrength = 0.7;
        this.settings.noiseScale = 1.2;
        this.settings.waveHeight = [0.4, 0.3];
        this.settings.blurExp = 1.2;
        this.settings.blurMax = 0.6;
        this.frameThrottleInterval = 1000 / 45; // 45 FPS
        break;

      case "high":
        this.settings.flowStrength = 0.9;
        this.settings.noiseScale = 1.4;
        this.settings.waveHeight = [0.5, 0.4];
        this.settings.blurExp = 1.3;
        this.settings.blurMax = 0.7;
        this.frameThrottleInterval = 1000 / 60; // 60 FPS
        break;

      case "ultra":
        this.settings.flowStrength = 1.0;
        this.settings.noiseScale = 1.6;
        this.settings.waveHeight = [0.6, 0.5];
        this.settings.blurExp = 1.4;
        this.settings.blurMax = 0.8;
        this.frameThrottleInterval = 1000 / 60; // 60 FPS
        break;
    }

    // Update quality capabilities based on current level
    this.updateQualityCapabilities(level);

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Quality level set to: ${level.level}`,
      {
        flowStrength: this.settings.flowStrength,
        frameRate: 1000 / this.frameThrottleInterval,
      }
    );
  }

  /**
   * Get current performance impact metrics
   */
  public getPerformanceImpact(): PerformanceMetrics {
    const currentFPS = this.lastFrameTime > 0 ? 1000 / this.lastFrameTime : 60;
    const memoryUsage = this.estimateMemoryUsage();

    return {
      fps: currentFPS,
      frameTime: this.lastFrameTime,
      memoryUsageMB: memoryUsage,
      cpuUsagePercent: this.estimateCPUUsage(),
      gpuUsagePercent: this.isWebGLAvailable ? 25 : 5,
      renderTime: this.lastFrameTime,
      timestamp: performance.now(),
    };
  }

  /**
   * Reduce quality by specified amount
   */
  public reduceQuality(amount: number): void {
    // Apply quality reduction adjustments
    this.qualityAdjustments["flow-reduction"] =
      (this.qualityAdjustments["flow-reduction"] || 0) + amount;
    this.qualityAdjustments["noise-reduction"] =
      (this.qualityAdjustments["noise-reduction"] || 0) + amount * 0.8;
    this.qualityAdjustments["wave-reduction"] =
      (this.qualityAdjustments["wave-reduction"] || 0) + amount * 0.6;

    // Apply reductions to current settings
    this.settings.flowStrength = Math.max(
      0.1,
      this.settings.flowStrength * (1 - amount)
    );
    this.settings.noiseScale = Math.max(
      0.5,
      this.settings.noiseScale * (1 - amount * 0.8)
    );
    this.settings.waveHeight = [
      Math.max(0.1, this.settings.waveHeight[0] * (1 - amount * 0.6)),
      Math.max(0.1, this.settings.waveHeight[1] * (1 - amount * 0.6)),
    ];

    // Reduce frame rate if necessary
    if (amount > 0.5) {
      this.frameThrottleInterval = Math.min(
        1000 / 15,
        this.frameThrottleInterval * (1 + amount)
      );
    }

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Quality reduced by ${amount}`,
      this.settings
    );
  }

  /**
   * Increase quality by specified amount
   */
  public increaseQuality(amount: number): void {
    // Remove previous reductions first
    Object.keys(this.qualityAdjustments).forEach((key) => {
      this.qualityAdjustments[key] = Math.max(
        0,
        (this.qualityAdjustments[key] || 0) - amount
      );
    });

    // Restore quality settings based on current level
    if (this.currentQualityLevel) {
      const baseSettings =
        this.getBaseSettingsForLevel(this.currentQualityLevel.level) ||
        this.settings;

      // Gradually restore towards base settings
      this.settings.flowStrength = Math.min(
        baseSettings.flowStrength,
        this.settings.flowStrength * (1 + amount * 0.5)
      );
      this.settings.noiseScale = Math.min(
        baseSettings.noiseScale,
        this.settings.noiseScale * (1 + amount * 0.3)
      );

      // Restore frame rate
      this.frameThrottleInterval = Math.max(
        1000 / this.currentQualityLevel.targetFPS,
        this.frameThrottleInterval * (1 - amount * 0.3)
      );
    }

    Y3K?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Quality increased by ${amount}`,
      this.settings
    );
  }

  /**
   * Get quality capabilities for this system
   */
  public getQualityCapabilities(): QualityCapability[] {
    return [...this.qualityCapabilities];
  }

  // ========================================================================
  // QUALITY SCALING HELPER METHODS
  // ========================================================================

  private updateQualityCapabilities(level: QualityLevel): void {
    // Update capability states based on quality level
    this.qualityCapabilities.forEach((capability) => {
      switch (capability.name) {
        case "webgl-rendering":
          capability.enabled = level.features.webgl;
          break;
        case "shader-complexity":
          capability.enabled = level.features.shaders;
          break;
        case "blur-effects":
          capability.enabled = level.features.blur;
          break;
        default:
          capability.enabled = level.level !== "minimal";
      }
    });
  }

  private getBaseSettingsForLevel(level: string): FlowGradientSettings {
    const baseSettings = { ...this.settings };

    switch (level) {
      case "minimal":
        return { ...baseSettings, flowStrength: 0.3, noiseScale: 0.8 };
      case "low":
        return { ...baseSettings, flowStrength: 0.5, noiseScale: 1.0 };
      case "medium":
        return { ...baseSettings, flowStrength: 0.7, noiseScale: 1.2 };
      case "high":
        return { ...baseSettings, flowStrength: 0.9, noiseScale: 1.4 };
      case "ultra":
        return { ...baseSettings, flowStrength: 1.0, noiseScale: 1.6 };
      default:
        return baseSettings;
    }
  }

  private estimateMemoryUsage(): number {
    let usage = 5; // Base WebGL context memory

    if (this.canvas && this.gl) {
      const pixels = this.canvas.width * this.canvas.height;
      usage += (pixels * 4) / (1024 * 1024); // RGBA texture memory

      if (this.gradientTexture) usage += 1; // Gradient texture
      if (this.vertexBuffer) usage += 0.1; // Vertex buffer
    }

    return usage;
  }

  private estimateCPUUsage(): number {
    const baseUsage = this.isWebGLAvailable ? 5 : 15; // WebGL vs CSS
    const qualityMultiplier =
      this.settings.flowStrength + this.settings.noiseScale / 2;

    return Math.min(50, baseUsage * qualityMultiplier);
  }
}
