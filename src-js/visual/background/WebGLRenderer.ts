/**
 * WebGLGradientBackgroundSystem - Flowing WebGL gradient background
 * Part of the Year 3000 System visual pipeline
 *
 * Implements Alex Harri's flowing gradient technique with Catppuccin color integration
 *
 * @deprecated This system is being phased out in favor of WebGLGradientStrategy.
 * WebGLGradientStrategy provides:
 * - OKLAB perceptual color processing for better color harmony
 * - Progressive fallback system (WebGL → CSS → Solid Color)
 * - Better error handling and device detection
 * - Integration with ColorStrategySelector
 *
 * Migration: Use ColorStrategySelector with "webgl" strategy mode instead.
 * This class will be removed in a future release after migration is complete.
 *
 * Location: src-js/visual/strategies/WebGLGradientStrategy.ts
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { unifiedEventBus, type EventData, type UnifiedEventMap } from "@/core/events/EventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator, type QualityLevel, type QualityScalingCapable, type PerformanceMetrics, type QualityCapability } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import { ServiceVisualSystemBase } from "@/core/services/SystemServiceBridge";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { settings } from "@/config";
import {
  createGradientTexture,
  DEFAULT_VERTEX_SHADER,
  ShaderLoader,
} from "@/utils/graphics/ShaderLoader";
import type {
  VisualEffectsCoordinator,
  BackgroundSystemParticipant,
  VisualEffectState,
} from "../effects/VisualEffectsCoordinator";

// Import shared visualEffects utilities
import {
  VISUAL_EFFECTS_SHADER_LIBRARY,
  ShaderTemplate,
} from "../effects/ConsolidatedShaderLibrary";

// WebGL-specific shader using shared visualEffects library
const webglVisualEffectsShader =
  ShaderTemplate.buildFragmentShader({
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
      VISUAL_EFFECTS_SHADER_LIBRARY.Fragments.webglGradientFragment(),
  });

// Corridor bubble shader with enhanced visualEffects integration
const corridorBubbleShader =
  ShaderTemplate.buildFragmentShader({
    additionalUniforms: `
// WebGL-specific uniforms
uniform sampler2D u_gradientTex;
uniform float u_flowStrength;
uniform float u_noiseScale;`,

    includeCorridorFunctions: true,

    mainShaderLogic:
      VISUAL_EFFECTS_SHADER_LIBRARY.Fragments.corridorBubbleFragment(),
  });

interface FlowGradientSettings {
  enabled: boolean;
  intensity: "minimal" | "balanced" | "intense";
  webglPersistenceMode: "adaptive" | "persistent" | "fallback";
  flowStrength: number;
  noiseScale: number;
  waveY: [number, number];
  waveHeight: [number, number];
  waveOffset: [number, number];
  blurExp: number;
  blurMax: number;
  // Corridor bubble settings
  corridorEnabled: boolean;
  corridorIntensity: number;
  corridorFlowStrength: number;
  corridorDepthEffect: number;
  corridorBubbleScale: number;
}

// Using shared visualEffects shader management - no need for duplicate uniform interface

export class WebGLGradientBackgroundSystem
  extends ServiceVisualSystemBase
  implements BackgroundSystemParticipant, QualityScalingCapable
{
  private canvas: HTMLCanvasElement | null = null;
  private wrapper: HTMLDivElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private shaderProgram: WebGLProgram | null = null;
  private corridorShaderProgram: WebGLProgram | null = null;
  private uniforms: { [key: string]: WebGLUniformLocation | null } = {};
  private corridorUniforms: { [key: string]: WebGLUniformLocation | null } = {};

  private gradientTexture: WebGLTexture | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private vao: WebGLVertexArrayObject | null = null;

  private settings: FlowGradientSettings = {
    enabled: true,
    intensity: "balanced",
    webglPersistenceMode: "adaptive", // Default to current behavior, user can change to "persistent"
    flowStrength: 0.7,
    noiseScale: 1.2,
    waveY: [0.25, 0.75], // Wave positions from theme metrics
    waveHeight: [0.4, 0.3], // Wave heights for smooth blending
    waveOffset: [2.5, -1.8], // Time offsets for wave independence
    blurExp: 1.2, // Blur power function exponent
    blurMax: 0.6, // Maximum blur amount
    // Corridor bubble settings
    corridorEnabled: false, // Start disabled for smooth transition
    corridorIntensity: 0.8,
    corridorFlowStrength: 1.2,
    corridorDepthEffect: 0.6,
    corridorBubbleScale: 1.0,
  };

  private isWebGLAvailable = false;
  // ✅ RAF LOOP CONSOLIDATION: Removed animationId (coordinator manages animation)
  private startTime = 0;
  private lastFrameTime = 0;
  private frameThrottleInterval = 1000 / 60; // ✅ Increased to 60 FPS (coordinator target)

  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private cssVisualEffectsController: CSSVariableWriter | null =
    null;
  private cssController!: CSSVariableWriter;
  private eventSubscriptionIds: string[] = [];
  private prefersReducedMotion = false;

  // VisualEffects choreographer integration
  private visualEffectsChoreographer: VisualEffectsCoordinator | null =
    null;
  private currentVisualEffectsField: VisualEffectState | null = null;

  private webglReady = false;

  // Texture creation throttling and debouncing
  private textureUpdatePending = false;
  private lastTextureUpdate = 0;
  private textureUpdateDebounceTimer: number | null = null;
  private textureUpdateThrottleMs = 50; // Minimum time between texture updates (made mutable for quality scaling)
  private readonly textureUpdateDebounceMs = 300; // Debounce time for rapid events
  private textureCreationInProgress = false;

  // WebGL context management (Enhanced Context Recovery with Exponential Backoff)
  private contextLost = false;
  private pendingContextRestore = false;
  private contextLossCount = 0; // Track consecutive context losses
  private maxContextLossRetries = 10; // Allow up to 10 attempts over 30 seconds
  private lastSuccessfulRender = 0; // Track successful renders for context loss reset
  private contextRecoveryTimeouts: number[] = [100, 200, 400, 800, 1600, 3200, 5000, 5000, 5000, 5000]; // Exponential backoff in ms
  private currentRecoveryAttempt = 0;

  // Quality scaling properties
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [
    { name: "webgl-rendering", enabled: true, qualityLevel: 'high' },
    {
      name: "shader-complexity",
      enabled: true,
      qualityLevel: 'high'
    },
    { name: "noise-octaves", enabled: true, qualityLevel: 'medium' },
    { name: "wave-layers", enabled: true, qualityLevel: 'medium' },
    { name: "blur-effects", enabled: true, qualityLevel: 'low' },
    { name: "flow-strength", enabled: true, qualityLevel: 'low' },
    // Corridor-specific quality capabilities
    { name: "corridor-effects", enabled: true, qualityLevel: 'high' },
    { name: "corridor-sdf-complexity", enabled: true, qualityLevel: 'medium' },
    { name: "corridor-bubble-layers", enabled: true, qualityLevel: 'medium' },
    { name: "corridor-depth-effects", enabled: true, qualityLevel: 'low' },
  ];
  private qualityAdjustments: { [key: string]: number } = {};

  // Required BackgroundSystemParticipant implementation
  public override readonly systemName: string = "WebGLGradientBackgroundSystem";
  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // WebGL is high priority for performance
  }

  constructor(
    config: Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService);

    // ⚠️ DEPRECATION WARNING - This system will be removed in a future release
    if (config.enableDebug) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "⚠️ DEPRECATED: WebGLGradientBackgroundSystem is being phased out. " +
        "Please migrate to WebGLGradientStrategy (src-js/visual/strategies/WebGLGradientStrategy.ts) " +
        "which provides OKLAB color processing, progressive fallbacks, and better error handling. " +
        "This class will be removed after migration is complete."
      );
    }

    // Get ColorHarmonyEngine from year3000System if available
    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;

    // Get visualEffects choreographer from year3000System if available
    this.visualEffectsChoreographer =
      year3000System?.backgroundVisualEffectsChoreographer || null;

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Event subscriptions will be set up during initialization
  }

  protected override async performVisualSystemInitialization(): Promise<void> {

    // Initialize CSS coordination first - use globalThis to access Year3000System
    const year3000System = (globalThis as any).year3000System;
    this.cssController = year3000System?.cssVisualEffectsController || getGlobalCSSVariableWriter();

    // Check WebGL2 capability
    this.isWebGLAvailable = this.checkWebGL2Support();

    if (!this.isWebGLAvailable) {
      // Check if we should attempt WebGL recovery or fallback to CSS
      if (this.shouldAttemptWebGLRecovery()) {
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "WebGL2 not available but persistence mode enabled - attempting WebGL1 compatibility mode"
        );
        // Try to force WebGL1 compatibility mode
        this.isWebGLAvailable = this.checkWebGL1Support();
        if (!this.isWebGLAvailable) {
          Y3KDebug?.debug?.error(
            "WebGLGradientBackgroundSystem", 
            "Neither WebGL2 nor WebGL1 available despite persistence mode"
          );
          this.fallbackToCSSGradient();
          return;
        }
      } else {
        this.fallbackToCSSGradient();
        return;
      }
    }

    // Check device capabilities with improved scoring (High Priority Fix)
    const deviceDetector = new DeviceCapabilityDetector();
    await deviceDetector.initialize(); // Ensure proper initialization
    
    const performanceQuality = deviceDetector.recommendPerformanceQuality();
    const capabilities = deviceDetector.getCapabilities();
    
    // Enhanced device capability logic - more progressive approach
    if (performanceQuality === "low") {
      // Instead of immediate fallback, try WebGL with minimal quality first
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Low performance device detected - trying minimal WebGL quality",
        {
          performanceQuality,
          deviceCapabilities: capabilities?.overall,
          memoryLevel: capabilities?.memory.level,
          gpuLevel: capabilities?.gpu.level,
        }
      );
      
      // Set initial low quality settings
      this.frameThrottleInterval = 1000 / 20; // 20 FPS instead of 60
      this.textureUpdateThrottleMs = 1000; // 1 FPS texture updates
      
      // Disable complex features initially
      this.settings.corridorEnabled = false;
      this.settings.intensity = "minimal"; // Use existing intensity setting
      this.settings.flowStrength = 0.3; // Reduce flow strength instead of animationSpeed
      
      // Continue with WebGL initialization but monitor performance
    } else {
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Device capabilities acceptable for WebGL",
        {
          performanceQuality,
          deviceCapabilities: capabilities?.overall,
        }
      );
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
      this.registerWithVisualEffectsChoreographer();
      // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by AnimationFrameCoordinator
      // The coordinator will call updateAnimation(deltaTime) automatically

      // WebGL initialised; enable hybrid coordination for dynamic and living feel using coordination
      const webglInitVariables = {
        "--sn.bg.webgl.ready": "1",
        "--sn.bg.webgl.enabled": "1",
        "--sn.bg.active-backend": "hybrid",
        "--sn-gradient-crossfade-opacity": "0.5", // 50% blend
      };

      this.cssController.batchSetVariables(
        "WebGLGradientBackgroundSystem",
        webglInitVariables,
        "high", // High priority for WebGL initialization
        "webgl-initialization"
      );

      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL gradient system initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
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
        Y3KDebug?.debug?.warn(
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
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "Missing WebGL2 extensions:",
          missingExtensions
        );
      }

      // Check for basic WebGL functionality
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

      Y3KDebug?.debug?.log(
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
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "WebGL2 support check failed:",
        error
      );
      return false;
    }
  }

  private checkWebGL1Support(): boolean {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;

      if (!gl) {
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "WebGL1 context creation failed"
        );
        return false;
      }

      // Check basic WebGL1 functionality
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL1 fallback capability check:",
        {
          maxTextureSize,
          maxRenderbufferSize,
        }
      );

      return true;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "WebGL1 support check failed:",
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
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          `Found container: ${selector}`
        );
        return element;
      }
    }

    Y3KDebug?.debug?.warn(
      "WebGLGradientBackgroundSystem",
      "No Spotify container found, falling back to body"
    );
    return document.body;
  }

  private loadSettings(): void {
    try {
      // Load WebGL enabled/disabled state from typed settings
      const webglEnabled = settings.get("sn-webgl-enabled");
      const intensitySetting = settings.get("sn-gradient-intensity");

      // Apply WebGL enabled state
      if (!webglEnabled) {
        this.settings.enabled = false;
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "WebGL disabled by user setting"
        );
        return;
      }

      // NOTE: webglForceEnabled and persistenceMode settings removed
      // Persistence mode now defaults to "adaptive"
      this.settings.webglPersistenceMode = "adaptive";

      // Apply flow gradient intensity
      if (intensitySetting === "disabled") {
        this.settings.enabled = false;
        return;
      }

      this.settings.intensity = intensitySetting || "balanced";

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

      // Log loaded settings for debugging
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Settings loaded:",
        {
          webglEnabled,
          persistenceMode: this.settings.webglPersistenceMode,
          intensity: this.settings.intensity,
          enabled: this.settings.enabled,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to load settings, using defaults:",
        error
      );
    }
  }

  /**
   * Handle runtime setting changes (implements ISettingsResponsiveSystem pattern)
   */
  public applyUpdatedSettings(key: string, value: any): void {
    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Runtime setting changed: ${key} = ${value}`
    );

    try {
      switch (key) {
        case "sn-webgl-enabled":
          // Handle WebGL enabled/disabled at runtime (boolean value from typed settings)
          if (!value) {
            this.settings.enabled = false;
            this.destroy(); // Clean up WebGL resources
          } else if (value && !this.settings.enabled) {
            this.settings.enabled = true;
            // Re-initialize if not already running
            if (!this.gl && this.canvas) {
              this.initialize();
            }
          }
          break;

        case "sn-gradient-intensity":
          // Handle flow gradient intensity changes (IntensityLevel from typed settings)
          if (value === "disabled") {
            this.settings.enabled = false;
          } else {
            this.settings.enabled = true;
            this.settings.intensity = value || "balanced";
            
            // Re-apply intensity mapping
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
          }
          break;

        default:
          // Ignore other settings
          return;
      }

      // Force repaint to apply changes immediately
      this.forceRepaint?.(`setting-change:${key}`);

    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        `Failed to apply runtime setting ${key}:`,
        error
      );
    }
  }

  private async initializeWebGL(): Promise<void> {
    // Create wrapper div for skew transforms
    this.wrapper = document.createElement("div");
    this.wrapper.className = "sn-gradient-effects-wrapper";
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

      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "WebGL2 context created successfully:",
        {
          version: testResult,
          renderer: this.gl.getParameter(this.gl.RENDERER),
          vendor: this.gl.getParameter(this.gl.VENDOR),
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
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

    // Enhanced Shader Compilation with Fallback Variants
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let shaderVariant = "full";

    // Try to compile vertex shader
    vertexShader = ShaderLoader.loadVertex(this.gl, DEFAULT_VERTEX_SHADER);
    if (!vertexShader) {
      throw new Error("Failed to compile vertex shader - even basic vertex shader failed");
    }

    // Try fragment shader variants in order of complexity (4-tier system)
    const fragmentShaderVariants = [
      { 
        name: "full", 
        shader: webglVisualEffectsShader,
        description: "Full visualEffects shader with all features"
      },
      { 
        name: "simplified", 
        shader: this.getSimplifiedFragmentShader(),
        description: "Simplified shader without complex noise functions"
      },
      { 
        name: "basic", 
        shader: this.getBasicFragmentShader(),
        description: "Basic gradient shader with minimal features"
      },
      { 
        name: "emergency", 
        shader: this.getEmergencyFragmentShader(),
        description: "Emergency shader for maximum hardware compatibility"
      }
    ];

    for (const variant of fragmentShaderVariants) {
      try {
        fragmentShader = ShaderLoader.loadFragment(this.gl, variant.shader);
        if (fragmentShader) {
          shaderVariant = variant.name;
          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            `Successfully compiled shader variant: ${variant.name}`,
            { description: variant.description }
          );
          break;
        }
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          `Failed to compile ${variant.name} shader variant:`,
          error
        );
        continue;
      }
    }

    if (!fragmentShader) {
      throw new Error("Failed to compile any fragment shader variant");
    }

    this.shaderProgram = ShaderLoader.createProgram(
      this.gl,
      vertexShader,
      fragmentShader
    );

    if (!this.shaderProgram) {
      throw new Error("Failed to create shader program");
    }

    // Compile corridor shader program
    const corridorFragmentShader = ShaderLoader.loadFragment(
      this.gl,
      corridorBubbleShader
    );

    if (!corridorFragmentShader) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to compile corridor shader - corridor effects disabled"
      );
      this.settings.corridorEnabled = false;
      return;
    }

    this.corridorShaderProgram = ShaderLoader.createProgram(
      this.gl,
      vertexShader, // Reuse vertex shader
      corridorFragmentShader
    );

    if (!this.corridorShaderProgram) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to create corridor shader program - corridor effects disabled"
      );
      this.settings.corridorEnabled = false;
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

    // Standard WebGL uniforms
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

    // Set up corridor uniforms if corridor shader is available
    if (this.corridorShaderProgram) {
      this.setupCorridorUniforms();
    }
  }

  private setupCorridorUniforms(): void {
    if (!this.gl || !this.corridorShaderProgram) return;

    // Get corridor uniform locations using original corridor bubble uniform names
    const corridorUniformNames = ShaderTemplate.getCorridorUniformNames();
    
    for (const uniformName of corridorUniformNames) {
      this.corridorUniforms[uniformName] = this.gl.getUniformLocation(
        this.corridorShaderProgram,
        uniformName
      );
    }
  }

  private updateVisualEffectsUniforms(uniforms: { [key: string]: WebGLUniformLocation | null }, time: number): void {
    if (!this.gl) return;

    // Get visualEffects field values from the choreographer or defaults
    const visualEffectsField = this.currentVisualEffectsField;
    
    // Rhythmic pulse from visualEffects
    const rhythmicPulse = visualEffectsField?.pulseRate ?? 0.5;
    if (uniforms.u_rhythmicPulse) {
      this.gl.uniform1f(uniforms.u_rhythmicPulse, rhythmicPulse);
    }

    // Musical flow direction
    const musicalFlow = visualEffectsField?.flowDirection ?? { x: 0.0, y: 0.0 };
    if (uniforms.u_musicalFlow && musicalFlow) {
      this.gl.uniform2f(uniforms.u_musicalFlow, musicalFlow.x ?? 0.0, musicalFlow.y ?? 0.0);
    }

    // Energy resonance for visualEffects modulation
    const energyResonance = visualEffectsField?.energyLevel ?? 0.5;
    if (uniforms.u_energyResonance) {
      this.gl.uniform1f(uniforms.u_energyResonance, energyResonance);
    }

    // Breathing cycle for smooth visualEffects
    const pulsingCycle = Math.sin(time * 0.05) * 0.5 + 0.5;
    if (uniforms.u_pulsingCycle) {
      this.gl.uniform1f(uniforms.u_pulsingCycle, pulsingCycle);
    }

    // Surface fluidity for smooth effects
    const surfaceFluidityIndex = visualEffectsField?.fluidIntensity ?? 0.3;
    if (uniforms.u_surfaceFluidityIndex) {
      this.gl.uniform1f(uniforms.u_surfaceFluidityIndex, surfaceFluidityIndex);
    }

    // Music sync uniforms from MusicSyncService if available
    if (this.musicSyncService) {
      const musicState = this.musicSyncService.getCurrentMusicState();
      
      if (musicState) {
        const musicEnergy = musicState.beat?.energy ?? 0.5;
        const musicValence = musicState.emotion?.valence ?? 0.5;
        const beatIntensity = musicState.intensity ?? 0.0;
        const bassResponse = musicState.beat?.energy ?? 0.0; // Use energy as bass proxy

        if (uniforms.u_musicEnergy) {
          this.gl.uniform1f(uniforms.u_musicEnergy, musicEnergy);
        }
        if (uniforms.u_musicValence) {
          this.gl.uniform1f(uniforms.u_musicValence, musicValence);
        }
        if (uniforms.u_beatIntensity) {
          this.gl.uniform1f(uniforms.u_beatIntensity, beatIntensity);
        }
        if (uniforms.u_bassResponse) {
          this.gl.uniform1f(uniforms.u_bassResponse, bassResponse);
        }
      }
    }
  }

  private async updateGradientTexture(): Promise<void> {
    if (!this.gl) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "No WebGL context available"
      );
      return;
    }

    // Enhanced WebGL context validation
    if (!this.isContextValid()) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "WebGL context invalid, attempting recovery"
      );

      // Try to recover context if possible
      if (this.contextLost && !this.pendingContextRestore) {
        Y3KDebug?.debug?.log(
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
      Y3KDebug?.debug?.warn(
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
      Y3KDebug?.debug?.log(
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

            Y3KDebug?.debug?.log(
              "WebGLGradientBackgroundSystem",
              `Updated gradient texture with ${colorStops.length} stops from ColorHarmonyEngine`
            );
          } else {
            // ColorHarmonyEngine available but returned empty - try CSS fallback
            const cssColorStops = this.getCSSGradientStops();
            if (cssColorStops && cssColorStops.length > 0) {
              colorStops = cssColorStops;
              colorSource = "CSS variables";
              Y3KDebug?.debug?.log(
                "WebGLGradientBackgroundSystem",
                `ColorHarmonyEngine returned empty, using CSS gradient fallback with ${colorStops.length} stops`
              );
            }
          }
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Failed to get gradient from ColorHarmonyEngine, trying CSS fallback:",
            error
          );

          // ColorHarmonyEngine failed - try CSS variables fallback
          const cssColorStops = this.getCSSGradientStops();
          if (cssColorStops && cssColorStops.length > 0) {
            colorStops = cssColorStops;
            colorSource = "CSS variables (engine failed)";
            Y3KDebug?.debug?.log(
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
          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            `No ColorHarmonyEngine available, using CSS gradient fallback with ${colorStops.length} stops`
          );
        }
      }

      Y3KDebug?.debug?.log(
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
          Y3KDebug?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Error deleting old texture:",
            error
          );
        }
        this.gradientTexture = null as any; // Clear reference
      }

      // Validate color stops before proceeding
      if (!colorStops || colorStops.length === 0) {
        Y3KDebug?.debug?.warn(
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
            Y3KDebug?.debug?.log(
              "WebGLGradientBackgroundSystem",
              `Gradient texture created successfully on attempt ${attempts}`
            );
            break;
          }
        } catch (error) {
          Y3KDebug?.debug?.warn(
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
        Y3KDebug?.debug?.error(
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

          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            "Using default gradient fallback after all attempts failed"
          );
        } catch (fallbackError) {
          Y3KDebug?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "Default gradient fallback failed, attempting emergency solid color:",
            fallbackError
          );

          // Ultimate fallback: solid color texture
          try {
            const emergencySolidStops = [
              { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 0.0 }, // Catppuccin base
              { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 1.0 }, // Same color
            ];
            const emergencyTexture = createGradientTexture(this.gl, emergencySolidStops);
            
            if (emergencyTexture) {
              this.gradientTexture = emergencyTexture;
              colorStops = emergencySolidStops;
              Y3KDebug?.debug?.warn(
                "WebGLGradientBackgroundSystem",
                "Using emergency solid color texture as final fallback"
              );
            } else {
              throw new Error("Emergency solid color texture creation failed");
            }
          } catch (emergencyError) {
            Y3KDebug?.debug?.error(
              "WebGLGradientBackgroundSystem",
              "Emergency solid color texture failed:",
              emergencyError
            );
            throw new Error(
              `All gradient texture creation methods failed: ${emergencyError}`
            );
          }
        }
      } else {
        this.gradientTexture = newTexture;
      }

      // Update last texture update timestamp
      this.lastTextureUpdate = performance.now();

      Y3KDebug?.debug?.log(
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
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Critical error in updateGradientTexture:",
        error
      );

      // Attempt to recover by falling back to CSS gradient
      if (error instanceof Error && error.message.includes("context")) {
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "WebGL context-related error detected, switching to CSS fallback"
        );
        this.fallbackToCSSGradient();
      } else {
        // For non-context errors, try a simple recovery
        Y3KDebug?.debug?.log(
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
              Y3KDebug?.debug?.log(
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
          Y3KDebug?.debug?.error(
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
            Y3KDebug?.debug?.error(
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
        Y3KDebug?.debug?.error(
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
        this.contextLossCount++;
        
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "WebGL context lost - Enhanced Recovery",
          {
            lossCount: this.contextLossCount,
            maxRetries: this.maxContextLossRetries,
          }
        );
        
        event.preventDefault(); // Prevent default context loss behavior

        this.contextLost = true;
        this.textureCreationInProgress = false;

        // Exponential backoff context recovery with persistence mode support
        if (this.contextLossCount <= this.maxContextLossRetries) {
          const attemptIndex = Math.min(this.contextLossCount - 1, this.contextRecoveryTimeouts.length - 1);
          const backoffDelay = this.contextRecoveryTimeouts[attemptIndex] || 5000;
          
          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            `Preparing for context recovery attempt ${this.contextLossCount}/${this.maxContextLossRetries} with ${backoffDelay}ms backoff`,
            { shouldPersist: this.shouldPersistWebGL() }
          );
          
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

          // ✅ RAF LOOP CONSOLIDATION: No need to stop animation - coordinator handles this
        } else {
          // Respect persistence mode - only fallback if not in persistent mode
          if (this.shouldPersistWebGL()) {
            Y3KDebug?.debug?.warn(
              "WebGLGradientBackgroundSystem",
              `Context lost ${this.contextLossCount} times but persistence mode enabled - resetting retry count and continuing`
            );
            // Reset retry count and continue attempting recovery in persistent mode
            this.contextLossCount = Math.max(1, this.maxContextLossRetries - 3); // Give it a few more tries
            this.currentRecoveryAttempt = 0;
          } else {
            // Too many context losses and not in persistent mode - fall back to CSS
            Y3KDebug?.debug?.error(
              "WebGLGradientBackgroundSystem",
              `Context lost ${this.contextLossCount} times - falling back to CSS gradient`
            );
            this.fallbackToCSSGradient();
          }
        }
      },
      false
    );

    /**
     * Implement exponential backoff context recovery
     */
    const attemptContextRecovery = async () => {
      if (!this.contextLost || this.pendingContextRestore) {
        return; // Context already restored or recovery in progress
      }

      const attemptIndex = Math.min(this.currentRecoveryAttempt, this.contextRecoveryTimeouts.length - 1);
      const backoffDelay = this.contextRecoveryTimeouts[attemptIndex] || 5000;
      
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem", 
        `Attempting context recovery in ${backoffDelay}ms (attempt ${this.currentRecoveryAttempt + 1})`
      );

      setTimeout(async () => {
        if (!this.contextLost) {
          return; // Context was restored while waiting
        }

        this.currentRecoveryAttempt++;
        
        // Try to trigger context restore by recreating canvas if needed
        try {
          if (this.gl && this.gl.isContextLost()) {
            // Context is still lost, try to trigger restore
            this.gl.getError(); // This can sometimes trigger restore
          }
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Error during context recovery attempt:",
            error
          );
        }

        // If still lost and within retry limits, schedule another attempt
        if (this.contextLost && this.currentRecoveryAttempt < this.maxContextLossRetries) {
          attemptContextRecovery();
        }
      }, backoffDelay);
    };

    // Start exponential backoff recovery when context is lost
    this.canvas.addEventListener("webglcontextlost", () => {
      this.currentRecoveryAttempt = 0;
      attemptContextRecovery();
    });

    this.canvas.addEventListener(
      "webglcontextrestored",
      async () => {
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "WebGL context restored - Enhanced Recovery",
          {
            lossCount: this.contextLossCount,
            maxRetries: this.maxContextLossRetries,
          }
        );

        this.contextLost = false;
        this.pendingContextRestore = true;

        try {
          // Re-verify context functionality
          if (!this.gl || this.gl.isContextLost()) {
            throw new Error("Context is still lost after restore event");
          }

          // Reinitialize WebGL resources with progressive quality reduction
          await this.reinitializeWebGLResources();

          // Reduce quality after context loss to prevent repeated losses
          if (this.contextLossCount >= 2) {
            Y3KDebug?.debug?.log(
              "WebGLGradientBackgroundSystem",
              "Reducing quality after multiple context losses"
            );
            this.adjustQualityForTier("low");
          } else if (this.contextLossCount >= 1) {
            Y3KDebug?.debug?.log(
              "WebGLGradientBackgroundSystem",
              "Reducing quality after context loss"
            );
            this.adjustQualityForTier("medium");
          }

          // ✅ RAF LOOP CONSOLIDATION: No need to restart animation - coordinator handles this

          this.pendingContextRestore = false;

          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            "WebGL context restore completed successfully",
            {
              lossCount: this.contextLossCount,
              qualityReduced: this.contextLossCount > 0,
            }
          );
        } catch (error) {
          Y3KDebug?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "Failed to restore WebGL context:",
            error
          );
          this.pendingContextRestore = false;
          
          // Increment context loss count for failed restoration
          this.contextLossCount++;
          
          if (this.contextLossCount > this.maxContextLossRetries) {
            Y3KDebug?.debug?.error(
              "WebGLGradientBackgroundSystem",
              "Context restoration failed too many times - falling back to CSS"
            );
            this.fallbackToCSSGradient();
          }
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

    Y3KDebug?.debug?.log(
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
          Y3KDebug?.debug?.log(
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
          Y3KDebug?.debug?.warn(
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
        Y3KDebug?.debug?.log(
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

      Y3KDebug?.debug?.log(
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
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "Failed to parse CSS background gradient variables:",
        error
      );
      return null;
    }
  }

  private registerEventSubscription<K extends keyof UnifiedEventMap>(
    eventName: K,
    handler: (data: UnifiedEventMap[K]) => void
  ): void {
    if (this.services.events) {
      this.services.events.subscribe(this.systemName, eventName, handler);
    } else {
      const subscriptionId = unifiedEventBus.subscribe(
        eventName,
        handler,
        "WebGLGradientBackgroundSystem"
      );
      this.eventSubscriptionIds.push(subscriptionId);
    }
  }

  private subscribeToEvents(): void {
    this.registerEventSubscription(
      "colors:harmonized",
      this.handleColorHarmonized.bind(this)
    );

    this.registerEventSubscription(
      "colors:applied",
      this.handleColorApplied.bind(this)
    );

    this.registerEventSubscription(
      "performance:tier-changed",
      this.handlePerformanceTierChanged.bind(this)
    );

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Subscribed to visual coordination events",
      {
        events: [
          "colors:harmonized",
          "colors:applied",
          "performance:tier-changed",
        ],
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
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Duplicate color harmonization event detected, skipping"
      );
      return;
    }

    this.lastColorHarmonizedData = dataHash;
    this.lastColorHarmonizedTime = currentTime;

    // Update gradient texture with new harmonized colors using debounced method
    this.debouncedUpdateGradientTexture();

    Y3KDebug?.debug?.log(
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
    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Color application coordinated",
      {
        accentHex: data.accentHex,
        appliedAt: data.appliedAt,
      }
    );
  }

  /**
   * Handle performance tier changes for quality scaling (High Priority Fix)
   * Implements progressive quality reduction instead of immediate fallback
   */
  private handlePerformanceTierChanged(data: EventData<"performance:tier-changed">): void {
    if (!this.isActive || !this.gl) {
      return; // Not active or WebGL not available
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Performance tier changed",
      {
        previousTier: data.previousTier,
        newTier: data.tier,
        timestamp: data.timestamp,
      }
    );

    // Progressive quality scaling based on performance tier
    switch (data.tier) {
      case "excellent":
        // Full quality - enable all features
        this.adjustQualityForTier("high");
        break;

      case "good":
        // Balanced quality - maintain WebGL but reduce complexity
        this.adjustQualityForTier("medium");
        break;

      case "degraded":
        // Low quality - simplify shaders and reduce frame rate
        this.adjustQualityForTier("low");
        
        // Warning that we're in degraded mode
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "Performance degraded - reducing WebGL quality instead of fallback"
        );
        break;

      case "critical":
        // Critical performance - respect persistence mode
        if (data.previousTier === "degraded") {
          // Already tried degraded quality
          if (this.shouldPersistWebGL()) {
            Y3KDebug?.debug?.warn(
              "WebGLGradientBackgroundSystem",
              "Critical performance but persistence mode enabled - reducing to absolute minimum WebGL quality"
            );
            // Try emergency mode with 1x1 textures and minimal shader
            this.adjustQualityForTier("emergency");
          } else {
            // Not in persistent mode - fallback to CSS
            Y3KDebug?.debug?.warn(
              "WebGLGradientBackgroundSystem",
              "Critical performance detected - falling back to CSS gradient"
            );
            this.fallbackToCSSGradient();
          }
        } else {
          // First time in critical - try minimal WebGL quality
          this.adjustQualityForTier("minimal");
          Y3KDebug?.debug?.warn(
            "WebGLGradientBackgroundSystem",
            "Critical performance - using minimal WebGL quality"
          );
        }
        break;
    }
  }

  /**
   * Adjust WebGL quality based on performance tier
   */
  private adjustQualityForTier(qualityTier: "high" | "medium" | "low" | "minimal" | "emergency"): void {
    if (!this.gl || !this.canvas) return;

    // Adjust frame rate throttling
    switch (qualityTier) {
      case "high":
        this.frameThrottleInterval = 1000 / 60; // 60 FPS
        break;
      case "medium":
        this.frameThrottleInterval = 1000 / 45; // 45 FPS
        break;
      case "low":
        this.frameThrottleInterval = 1000 / 30; // 30 FPS
        break;
      case "minimal":
        this.frameThrottleInterval = 1000 / 15; // 15 FPS
        break;
      case "emergency":
        this.frameThrottleInterval = 1000 / 10; // 10 FPS - absolute minimum
        break;
    }

    // Adjust texture update frequency
    switch (qualityTier) {
      case "high":
        this.textureUpdateThrottleMs = 100; // 10 FPS texture updates
        break;
      case "medium":
        this.textureUpdateThrottleMs = 200; // 5 FPS texture updates
        break;
      case "low":
        this.textureUpdateThrottleMs = 500; // 2 FPS texture updates
        break;
      case "minimal":
        this.textureUpdateThrottleMs = 1000; // 1 FPS texture updates
        break;
      case "emergency":
        this.textureUpdateThrottleMs = 2000; // 0.5 FPS texture updates - static gradient
        break;
    }

    // Adjust canvas resolution for performance (maintain aspect ratio)
    const container = this.findSpotifyContainer();
    if (container) {
      const containerRect = container.getBoundingClientRect();
      let scaleFactor = 1.0;

      switch (qualityTier) {
        case "high":
          scaleFactor = 1.0; // Full resolution
          break;
        case "medium":
          scaleFactor = 0.8; // 80% resolution
          break;
        case "low":
          scaleFactor = 0.6; // 60% resolution
          break;
        case "minimal":
          scaleFactor = 0.4; // 40% resolution
          break;
        case "emergency":
          scaleFactor = 0.1; // 10% resolution - absolute minimum (1x1 effective rendering)
          break;
      }

      const newWidth = Math.floor(containerRect.width * scaleFactor);
      const newHeight = Math.floor(containerRect.height * scaleFactor);
      
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      
      if (this.gl) {
        this.gl.viewport(0, 0, newWidth, newHeight);
      }
    }

    // Update settings for shader complexity (if applicable)
    const wasCorridorEnabled = this.settings.corridorEnabled;
    switch (qualityTier) {
      case "high":
        // Keep all features enabled
        this.settings.intensity = "intense";
        this.settings.flowStrength = Math.max(this.settings.flowStrength, 0.7);
        break;
      case "medium":
        // Reduce some visual complexity
        this.settings.intensity = "balanced";
        this.settings.flowStrength = Math.min(this.settings.flowStrength, 0.6);
        break;
      case "low":
        // Disable corridor shader for performance
        this.settings.corridorEnabled = false;
        this.settings.intensity = "minimal";
        this.settings.flowStrength = Math.min(this.settings.flowStrength, 0.4);
        break;
      case "minimal":
        // Minimal visual effects
        this.settings.corridorEnabled = false;
        this.settings.intensity = "minimal";
        this.settings.flowStrength = 0.2;
        break;
    }

    // If corridor setting changed, log it
    if (wasCorridorEnabled !== this.settings.corridorEnabled) {
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Corridor shader ${this.settings.corridorEnabled ? "enabled" : "disabled"} for ${qualityTier} quality`
      );
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Quality adjusted for ${qualityTier} performance tier`,
      {
        frameFPS: Math.round(1000 / this.frameThrottleInterval),
        textureFPS: Math.round(1000 / this.textureUpdateThrottleMs),
        canvasResolution: `${this.canvas.width}x${this.canvas.height}`,
        corridorEnabled: this.settings.corridorEnabled,
      }
    );
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by AnimationFrameCoordinator
   *
   * Benefits:
   * - Single RAF loop for all systems (not 5-8 independent loops)
   * - Shared deltaTime calculation (eliminates redundant performance.now() calls)
   * - Coordinated frame budget management
   * - Priority-based execution order
   * - Increased from 45 FPS to 60 FPS target (coordinator manages this)
   *
   * Old methods removed: startAnimation(), animate()
   * Replacement: updateAnimation(deltaTime) called by coordinator
   */

  private render(currentTime: number): void {
    if (!this.gl || !this.vao) return;

    // Emergency texture creation if gradientTexture is null (Fix for white background)
    if (!this.gradientTexture) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackgroundSystem",
        "No gradient texture during render - creating emergency texture"
      );

      try {
        // Try progressively simpler textures
        const emergencyTextures = [
          () => {
            // Try current CSS gradient colors
            const cssStops = this.getCSSGradientStops();
            return cssStops ? createGradientTexture(this.gl!, cssStops) : null;
          },
          () => {
            // Try default Catppuccin gradient
            const defaultStops = this.getDefaultGradientStops();
            return createGradientTexture(this.gl!, defaultStops);
          },
          () => {
            // Try solid color emergency texture
            const solidStops = [
              { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 0.0 }, // Catppuccin base
              { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 1.0 }, // Same color
            ];
            return createGradientTexture(this.gl!, solidStops);
          }
        ];

        for (let i = 0; i < emergencyTextures.length; i++) {
          try {
            this.gradientTexture = emergencyTextures[i]!();
            if (this.gradientTexture) {
              Y3KDebug?.debug?.log(
                "WebGLGradientBackgroundSystem",
                `Emergency texture created using method ${i + 1}`
              );
              break;
            }
          } catch (error) {
            Y3KDebug?.debug?.warn(
              "WebGLGradientBackgroundSystem",
              `Emergency texture method ${i + 1} failed:`,
              error
            );
          }
        }

        // Absolute last resort - if all emergency textures failed, return but don't crash
        if (!this.gradientTexture) {
          Y3KDebug?.debug?.error(
            "WebGLGradientBackgroundSystem",
            "All emergency texture creation methods failed - skipping render"
          );
          return;
        }
      } catch (error) {
        Y3KDebug?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Emergency texture creation failed completely:",
          error
        );
        return;
      }
    }

    // Enhanced Context Recovery - Track successful renders
    this.lastSuccessfulRender = currentTime;
    
    // Reset context loss count if we've been rendering successfully for 30 seconds
    if (this.contextLossCount > 0 && (currentTime - this.lastSuccessfulRender > 30000)) {
      const oldCount = this.contextLossCount;
      this.contextLossCount = Math.max(0, this.contextLossCount - 1);
      
      if (oldCount !== this.contextLossCount) {
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "Context loss count reduced due to successful renders",
          {
            oldCount,
            newCount: this.contextLossCount,
          }
        );
      }
    }

    // Determine which shader to use based on corridor settings
    const useCorridorShader = this.settings.corridorEnabled && 
                              this.corridorShaderProgram && 
                              this.currentQualityLevel !== 'low';
    
    const currentShaderProgram = useCorridorShader ? 
                                this.corridorShaderProgram : 
                                this.shaderProgram;
    
    const currentUniforms = useCorridorShader ? 
                           this.corridorUniforms : 
                           this.uniforms;

    if (!currentShaderProgram) return;

    // Clear canvas
    this.gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use appropriate shader program
    this.gl.useProgram(currentShaderProgram);

    // Bind VAO
    this.gl.bindVertexArray(this.vao);

    // First successful draw → establish hybrid coordination (only once)
    if (!this.webglReady) {
      this.webglReady = true;
      
      const webglReadyVariables = {
        "--sn.bg.webgl.ready": "1",
        "--sn.bg.webgl.enabled": "1", 
        "--sn.bg.active-backend": "hybrid",
        "--sn-gradient-crossfade-opacity": "0.5", // Balanced hybrid blend
      };

      this.cssController.batchSetVariables(
        "WebGLGradientBackgroundSystem",
        webglReadyVariables,
        "critical", // Critical priority for first draw
        "webgl-first-draw"
      );
    }

    // Update uniforms
    const time = this.prefersReducedMotion
      ? 0
      : (currentTime - this.startTime) / 1000;

    if (currentUniforms.u_time) {
      this.gl.uniform1f(currentUniforms.u_time, time);
    }

    if (currentUniforms.u_resolution) {
      this.gl.uniform2f(
        currentUniforms.u_resolution,
        this.canvas!.width,
        this.canvas!.height
      );
    }

    if (currentUniforms.u_flowStrength) {
      // BeatSync ↔ Flow Gradient Adapter: Read flow strength from CSS variable using coordination
      let flowStrength = this.settings.flowStrength;
      
      // Try to get flow strength from CSS variables through coordination
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        const flowStrengthValue = computedStyle.getPropertyValue("--sn-flow-strength").trim();
        if (flowStrengthValue) {
          flowStrength = parseFloat(flowStrengthValue);
        }
      } catch (error) {
        // Fallback to settings value if CSS variable access fails
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem", 
          "Failed to read flow strength CSS variable, using settings value"
        );
      }
      
      this.gl.uniform1f(currentUniforms.u_flowStrength, flowStrength);
    }

    if (currentUniforms.u_noiseScale) {
      this.gl.uniform1f(currentUniforms.u_noiseScale, this.settings.noiseScale);
    }

    // Update wave stack uniforms (standard shader only)
    if (!useCorridorShader) {
      if (currentUniforms.u_waveY) {
        this.gl.uniform1fv(currentUniforms.u_waveY, this.settings.waveY);
      }

      if (currentUniforms.u_waveHeight) {
        this.gl.uniform1fv(currentUniforms.u_waveHeight, this.settings.waveHeight);
      }

      if (currentUniforms.u_waveOffset) {
        this.gl.uniform1fv(currentUniforms.u_waveOffset, this.settings.waveOffset);
      }

      if (currentUniforms.u_blurExp) {
        this.gl.uniform1f(currentUniforms.u_blurExp, this.settings.blurExp);
      }

      if (currentUniforms.u_blurMax) {
        this.gl.uniform1f(currentUniforms.u_blurMax, this.settings.blurMax);
      }
    }

    // Update corridor-specific uniforms
    if (useCorridorShader) {
      if (currentUniforms.u_corridorIntensity) {
        this.gl.uniform1f(currentUniforms.u_corridorIntensity, this.settings.corridorIntensity);
      }
      
      if (currentUniforms.u_corridorFlowStrength) {
        this.gl.uniform1f(currentUniforms.u_corridorFlowStrength, this.settings.corridorFlowStrength);
      }
      
      if (currentUniforms.u_corridorDepthEffect) {
        this.gl.uniform1f(currentUniforms.u_corridorDepthEffect, this.settings.corridorDepthEffect);
      }
      
      if (currentUniforms.u_corridorBubbleScale) {
        this.gl.uniform1f(currentUniforms.u_corridorBubbleScale, this.settings.corridorBubbleScale);
      }

      // ===== CORRIDOR BUBBLE UNIFORMS =====
      // Set visualEffects uniforms for enhanced corridor bubble effects
      this.updateVisualEffectsUniforms(currentUniforms, time);

    }

    // Bind gradient texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.gradientTexture);

    if (currentUniforms.u_gradientTex) {
      this.gl.uniform1i(currentUniforms.u_gradientTex, 0);
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
    // Switch to pure CSS mode - gradients take full control for complete fallback using coordination
    const cssFallbackVariables = {
      "--sn.bg.webgl.ready": "0",
      "--sn.bg.webgl.enabled": "0",
      "--sn.bg.active-backend": "css",
      "--sn-gradient-crossfade-opacity": "0", // Full CSS opacity
    };

    this.cssController.batchSetVariables(
      "WebGLGradientBackgroundSystem",
      cssFallbackVariables,
      "critical", // Critical priority for fallback
      "webgl-css-fallback"
    );

    // Update CSS variables for fallback gradient animation
    if (this.cssVisualEffectsController) {
      this.startCSSFallbackAnimation();
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Using CSS gradient fallback"
    );
  }

  private startCSSFallbackAnimation(): void {
    if (!this.cssVisualEffectsController) return;

    // Animate CSS variables to simulate flow using coordination
    const animateCSS = () => {
      if (!this.isActive) return;

      const time = performance.now() / 1000;
      const flowX = Math.sin(time * 0.04) * 20 + Math.sin(time * 0.07) * 8; // More smooth movement
      const flowY = Math.cos(time * 0.05) * 20 + Math.cos(time * 0.09) * 6;
      const scale = 1.15 + Math.sin(time * 0.03) * 0.2; // Enhanced base scale with more variation

      // Use batch coordination for CSS fallback animation
      const fallbackAnimationVariables = {
        "--sn-gradient-flow-x": `${flowX}%`,
        "--sn-gradient-flow-y": `${flowY}%`,
        "--sn-gradient-flow-scale": scale.toString(),
      };

      this.cssController.batchSetVariables(
        "WebGLGradientBackgroundSystem",
        fallbackAnimationVariables,
        "normal", // Normal priority for animation
        "css-fallback-animation"
      );

      setTimeout(animateCSS, this.frameThrottleInterval);
    };

    animateCSS();
  }

  public override handleSettingsChange(event: Event): void {
    super.handleSettingsChange(event);

    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key === "sn-gradient-intensity") {
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

  protected override performVisualSystemCleanup(): void {

    // Unregister from visualEffects choreographer
    if (this.visualEffectsChoreographer) {
      try {
        this.visualEffectsChoreographer.unregisterVisualEffectsParticipant(
          "WebGLGradientBackgroundSystem"
        );
        Y3KDebug?.debug?.log(
          "WebGLGradientBackgroundSystem",
          "Unregistered from visualEffects choreographer"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "WebGLGradientBackgroundSystem",
          "Error unregistering from visualEffects choreographer:",
          error
        );
      }
    }

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation - coordinator handles this

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

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Unified event subscriptions cleaned up"
    );

    window.removeEventListener("resize", this.resize);

    this.gl = null;

    // Reset all hybrid coordination flags so CSS regains full control using coordination
    const cleanupVariables = {
      "--sn.bg.webgl.ready": "0",
      "--sn.bg.webgl.enabled": "0", 
      "--sn.bg.active-backend": "css",
      "--sn-gradient-crossfade-opacity": "0",
    };

    this.cssController.batchSetVariables(
      "WebGLGradientBackgroundSystem",
      cleanupVariables,
      "critical", // Critical priority for system cleanup
      "webgl-system-cleanup"
    );
  }

  public override forceRepaint(_reason: string = "settings-change"): void {
    if (this.isActive && this.gradientTexture) {
      this.updateGradientTexture().catch((error) => {
        Y3KDebug?.debug?.error(
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
      fps: this.performanceAnalyzer?.getMedianFPS?.() || 0,
      compileErrors: 0, // TODO: Track compilation errors
      isActive: this.isActive,
      settings: { ...this.settings },
    };
  }

  /**
   * ✅ RAF LOOP CONSOLIDATION: Animation loop managed by coordinator
   * No need to stop animation - coordinator handles this
   * Kept for API compatibility with backplane adapters (no-op)
   */
  public stopAnimation(): void {
    // No-op: Animation loop managed by AnimationFrameCoordinator
    // System will automatically stop receiving updateAnimation() calls when destroyed
  }

  /**
   * Animation update method called by the master animation coordinator
   * This is the missing method that was causing the white background issue
   */
  public override updateAnimation(deltaTime: number): void {
    if (!this.isActive || !this.gl || !this.isWebGLAvailable) {
      return;
    }

    const timestamp = performance.now();

    // Skip frames for quality scaling (emergency and minimal modes)
    if (this.shouldSkipFrame(timestamp)) {
      return;
    }

    // Update texture if needed (throttled based on quality)
    if (this.shouldUpdateTexture()) {
      // In low quality mode, skip texture updates entirely to save performance
      if (this.currentQualityLevel !== 'low') {
        this.updateGradientTextureThrottled();
      }
    }

    // Render the current frame if WebGL is ready
    if (this.webglReady) {
      this.render(timestamp);
    } else {
      // WebGL not ready yet - ensure we have basic resources
      this.ensureBasicResources();
    }
  }

  /**
   * Check if we should skip this frame based on quality settings
   */
  private shouldSkipFrame(timestamp: number): boolean {
    if (!this.frameThrottleInterval) return false;

    const timeSinceLastFrame = timestamp - (this.lastFrameTime || 0);
    const shouldSkip = timeSinceLastFrame < this.frameThrottleInterval;

    if (!shouldSkip) {
      this.lastFrameTime = timestamp;
    }

    return shouldSkip;
  }

  /**
   * Check if texture should be updated based on throttling settings
   */
  private shouldUpdateTexture(): boolean {
    const currentTime = performance.now();
    return currentTime - this.lastTextureUpdate >= this.textureUpdateThrottleMs;
  }

  /**
   * Ensure basic WebGL resources exist for rendering
   */
  private ensureBasicResources(): void {
    if (!this.gl || this.contextLost) return;

    // If we don't have a gradient texture, try to create a basic one
    if (!this.gradientTexture) {
      try {
        const defaultStops = this.getDefaultGradientStops();
        this.gradientTexture = createGradientTexture(this.gl, defaultStops);
        
        if (this.gradientTexture) {
          Y3KDebug?.debug?.log(
            "WebGLGradientBackgroundSystem",
            "Emergency gradient texture created during animation update"
          );
        }
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "WebGLGradientBackgroundSystem",
          "Failed to create emergency gradient texture:",
          error
        );
      }
    }
  }

  /**
   * IManagedSystem health check - returns health status using standard interface
   */
  protected override async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const healthy = this.webglReady && this.initialized && this.isActive;
    const issues: string[] = [];

    if (!this.webglReady) {
      issues.push("WebGL not ready");
    }

    if (!this.initialized) {
      issues.push("System not initialized");
    }

    if (!this.isActive) {
      issues.push("System not active");
    }

    if (this.contextLost) {
      issues.push("WebGL context lost");
    }

    return {
      healthy,
      details: "WebGLGradientBackgroundSystem health snapshot",
      issues,
      metrics: {
        webglReady: this.webglReady,
        initialized: this.initialized,
        active: this.isActive,
        contextLost: this.contextLost,
        canvasExists: Boolean(this.canvas),
      },
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
   * Register this WebGL system as a visualEffects participant
   */
  private registerWithVisualEffectsChoreographer(): void {
    if (!this.visualEffectsChoreographer) {
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "VisualEffects choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.visualEffectsChoreographer.registerVisualEffectsParticipant(this);
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Successfully registered with visualEffects choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Failed to register with visualEffects choreographer:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  // SystemName and systemPriority already declared above

  public getVisualEffectsContribution(): any {
    return {
      webglLuminosity: this.settings.flowStrength || 0.5,
      shaderComplexity: this.isWebGLAvailable ? 0.8 : 0,
      gpuUtilization: this.isWebGLAvailable ? 0.6 : 0,
      renderingPipeline: "forward",
      textureResolution: 1.0,
    };
  }

  public onVisualEffectsFieldUpdate(field: VisualEffectState): void {
    if (!this.isWebGLAvailable || !this.webglReady) return;

    try {
      this.currentVisualEffectsField = field;

      // Update shader uniforms based on visualEffects field
      this.updateShaderFromVisualEffects(field);

      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        "Updated from visualEffects field:",
        {
          rhythmicPulse: field.pulseRate,
          webglLuminosity: field.luminosity,
          emotionalTemperature: field.colorTemperature,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Error updating from visualEffects field:",
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
          // Boost visual intensity during energy surges using coordination
          const surgeIntensity = payload.intensity || 1.0;
          this.cssController.setVariable(
            "WebGLGradientBackgroundSystem",
            "--sn-webgl-energy-surge",
            surgeIntensity.toString(),
            "high", // High priority for energy surges
            "choreography-energy-surge"
          );
          break;

        case "visualEffects:pulsing-cycle":
          // Synchronize with pulsing patterns using coordination
          const pulsingPhase = payload.phase || 0;
          this.cssController.setVariable(
            "WebGLGradientBackgroundSystem",
            "--sn-webgl-pulsing-sync",
            pulsingPhase.toString(),
            "normal", // Normal priority for pulsing sync
            "visualEffects-pulsing-cycle"
          );
          break;
      }

      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  /**
   * Update WebGL shader parameters based on visualEffects field
   */
  private updateShaderFromVisualEffects(field: VisualEffectState): void {
    if (!this.gl || !this.shaderProgram) return;

    // Modulate flow strength with rhythmic pulse
    const consciousFlowStrength =
      this.settings.flowStrength * (0.5 + field.pulseRate * 0.5);
    const flowStrengthLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_flowStrength"
    );
    if (flowStrengthLocation) {
      this.gl.uniform1f(flowStrengthLocation, consciousFlowStrength);
    }

    // Modulate noise scale with musical flow
    const consciousNoiseScale =
      this.settings.noiseScale * (0.8 + field.flowDirection.x * 0.4);
    const noiseScaleLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_noiseScale"
    );
    if (noiseScaleLocation) {
      this.gl.uniform1f(noiseScaleLocation, consciousNoiseScale);
    }

    // Update wave parameters with pulsing cycle
    const pulsingModulation =
      Math.sin(Date.now() * 0.001 * field.pulseRate) * 0.1;
    const waveYLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_waveY"
    );
    if (waveYLocation) {
      const modulatedWaveY = [
        this.settings.waveY[0] + pulsingModulation,
        this.settings.waveY[1] - pulsingModulation,
      ];
      this.gl.uniform1fv(waveYLocation, modulatedWaveY);
    }

    // Apply visualEffects-aware CSS variables for hybrid coordination using coordination
    const visualEffectsWebglVariables = {
      "--sn-webgl-visualEffects-flow": consciousFlowStrength.toString(),
      "--sn-webgl-visualEffects-noise": consciousNoiseScale.toString(),
      "--sn-webgl-pulsing-phase": pulsingModulation.toString(),
    };

    this.cssController.batchSetVariables(
      "WebGLGradientBackgroundSystem",
      visualEffectsWebglVariables,
      "normal", // Normal priority for visualEffects coordination
      "visualEffects-shader-update"
    );
  }

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  /**
   * Set quality level for WebGL rendering
   */
  /**
   * Adjust quality level (QualityScalingCapable interface)
   */
  public adjustQuality(level: QualityLevel): void {
    this.setQualityLevel(level);
  }

  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;

    // Adjust WebGL settings based on quality level
    switch (level) {
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

      default:
        // Default to medium quality
        this.settings.flowStrength = 0.7;
        this.settings.noiseScale = 1.2;
        this.settings.waveHeight = [0.4, 0.3];
        this.settings.blurExp = 1.2;
        this.settings.blurMax = 0.6;
        this.frameThrottleInterval = 1000 / 45; // 45 FPS
        break;
    }

    // Update quality capabilities based on current level
    this.updateQualityCapabilities(level);

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Quality level set to: ${level}`,
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
      memoryUsage: memoryUsage,
      cpuUsage: this.estimateCPUUsage(),
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

    Y3KDebug?.debug?.log(
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
        this.getBaseSettingsForLevel(this.currentQualityLevel) ||
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
      const targetFPS = this.currentQualityLevel === 'high' ? 60 : 
                        this.currentQualityLevel === 'medium' ? 45 : 30;
      this.frameThrottleInterval = Math.max(
        1000 / targetFPS,
        this.frameThrottleInterval * (1 - amount * 0.3)
      );
    }

    Y3KDebug?.debug?.log(
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
          capability.enabled = true; // WebGL always available in simplified system
          break;
        case "shader-complexity":
          capability.enabled = level === 'high' || level === 'medium';
          break;
        case "blur-effects":
          capability.enabled = level !== 'low';
          break;
        case "corridor-effects":
          capability.enabled = level !== "low";
          // Disable corridor effects at lower quality levels
          if (level === 'low' && this.settings.corridorEnabled) {
            this.settings.corridorEnabled = false;
          }
          break;
        case "corridor-sdf-complexity":
          const sdfAdjustment = level === "high" ? 1.0 : 
                               level === "medium" ? 0.8 : 0.6;
          this.settings.corridorBubbleScale = Math.max(0.5, 1.0 * sdfAdjustment);
          capability.enabled = level !== "low";
          break;
        case "corridor-bubble-layers":
          const layerAdjustment = level === "high" ? 1.0 : 
                                 level === "medium" ? 0.8 : 0.6;
          this.settings.corridorIntensity = Math.max(0.3, 0.8 * layerAdjustment);
          capability.enabled = level === "high" || level === "medium";
          break;
        case "corridor-depth-effects":
          const depthAdjustment = level === "high" ? 1.0 : 
                                 level === "medium" ? 0.7 : 0.4;
          this.settings.corridorDepthEffect = Math.max(0.1, 0.6 * depthAdjustment);
          capability.enabled = level !== "low";
          break;
        default:
          capability.enabled = level !== "low";
      }
    });
  }

  private getBaseSettingsForLevel(level: string): FlowGradientSettings {
    const baseSettings = { ...this.settings };

    switch (level) {
      case "minimal":
        return { 
          ...baseSettings, 
          flowStrength: 0.3, 
          noiseScale: 0.8,
          corridorEnabled: false,
          corridorIntensity: 0.3,
          corridorFlowStrength: 0.5,
          corridorDepthEffect: 0.2,
          corridorBubbleScale: 0.5
        };
      case "low":
        return { 
          ...baseSettings, 
          flowStrength: 0.5, 
          noiseScale: 1.0,
          corridorEnabled: false,
          corridorIntensity: 0.4,
          corridorFlowStrength: 0.8,
          corridorDepthEffect: 0.3,
          corridorBubbleScale: 0.6
        };
      case "medium":
        return { 
          ...baseSettings, 
          flowStrength: 0.7, 
          noiseScale: 1.2,
          corridorEnabled: true,
          corridorIntensity: 0.6,
          corridorFlowStrength: 1.0,
          corridorDepthEffect: 0.5,
          corridorBubbleScale: 0.8
        };
      case "high":
        return { 
          ...baseSettings, 
          flowStrength: 0.9, 
          noiseScale: 1.4,
          corridorEnabled: true,
          corridorIntensity: 0.8,
          corridorFlowStrength: 1.2,
          corridorDepthEffect: 0.6,
          corridorBubbleScale: 1.0
        };
      case "ultra":
        return { 
          ...baseSettings, 
          flowStrength: 1.0, 
          noiseScale: 1.6,
          corridorEnabled: true,
          corridorIntensity: 1.0,
          corridorFlowStrength: 1.4,
          corridorDepthEffect: 0.8,
          corridorBubbleScale: 1.2
        };
      default:
        return baseSettings;
    }
  }

  // ========================================================================
  // PUBLIC CORRIDOR CONTROL METHODS
  // ========================================================================

  /**
   * Enable or disable corridor bubble effects
   * @param enabled Whether to enable corridor effects
   */
  public setCorridorEffectsEnabled(enabled: boolean): void {
    this.settings.corridorEnabled = enabled && this.corridorShaderProgram !== null;
    
    // Update CSS variable for coordination with other systems using coordination
    this.cssController.setVariable(
      "WebGLGradientBackgroundSystem",
      "--sn-corridor-enabled",
      enabled ? "1" : "0",
      "normal", // Normal priority for corridor settings
      "corridor-settings-update"
    );

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      `Corridor effects ${enabled ? 'enabled' : 'disabled'}`
    );
  }

  /**
   * Update corridor settings for runtime adjustment
   * @param settings Partial corridor settings to update
   */
  public updateCorridorSettings(settings: Partial<Pick<FlowGradientSettings, 
    'corridorIntensity' | 'corridorFlowStrength' | 'corridorDepthEffect' | 'corridorBubbleScale'>>): void {
    
    if (settings.corridorIntensity !== undefined) {
      this.settings.corridorIntensity = Math.max(0.0, Math.min(1.0, settings.corridorIntensity));
    }
    if (settings.corridorFlowStrength !== undefined) {
      this.settings.corridorFlowStrength = Math.max(0.0, Math.min(2.0, settings.corridorFlowStrength));
    }
    if (settings.corridorDepthEffect !== undefined) {
      this.settings.corridorDepthEffect = Math.max(0.0, Math.min(1.0, settings.corridorDepthEffect));
    }
    if (settings.corridorBubbleScale !== undefined) {
      this.settings.corridorBubbleScale = Math.max(0.1, Math.min(2.0, settings.corridorBubbleScale));
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientBackgroundSystem",
      "Corridor settings updated", settings
    );
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

  /**
   * Get simplified fragment shader without complex noise functions
   * Falls back to simpler gradient calculations for better compatibility
   */
  private getSimplifiedFragmentShader(): string {
    return `#version 300 es
      precision highp float;

      in vec2 vTextureCoords;
      out vec4 fragColor;

      uniform sampler2D u_gradientTexture;
      uniform float u_time;
      uniform float u_intensity;
      uniform float u_flowStrength;
      uniform vec2 u_resolution;

      // Simplified noise function - uses basic sin/cos instead of complex noise
      float simpleNoise(vec2 st) {
        return sin(st.x * 12.9898 + st.y * 78.233) * 43758.5453;
      }

      void main() {
        vec2 uv = vTextureCoords;
        
        // Simple flow effect without complex noise
        vec2 flow = vec2(
          sin(u_time * 0.5 + uv.y * 3.0) * 0.1,
          cos(u_time * 0.3 + uv.x * 2.0) * 0.1
        ) * u_flowStrength;
        
        // Apply flow offset
        vec2 flowUV = uv + flow;
        
        // Simple gradient lookup with basic distortion
        vec4 gradientColor = texture(u_gradientTexture, flowUV);
        
        // Simple intensity modulation
        float intensity = u_intensity * (0.8 + 0.2 * sin(u_time + uv.x + uv.y));
        
        fragColor = vec4(gradientColor.rgb * intensity, gradientColor.a);
      }`;
  }

  /**
   * Get basic fragment shader with minimal features
   * Fallback for very limited GPU capabilities
   */
  private getBasicFragmentShader(): string {
    return `#version 300 es
      precision mediump float;

      in vec2 vTextureCoords;
      out vec4 fragColor;

      uniform sampler2D u_gradientTexture;
      uniform float u_intensity;

      void main() {
        vec2 uv = vTextureCoords;
        
        // Basic gradient lookup without any effects
        vec4 gradientColor = texture(u_gradientTexture, uv);
        
        // Simple intensity scaling
        fragColor = vec4(gradientColor.rgb * u_intensity, gradientColor.a);
      }`;
  }

  /**
   * Get emergency fragment shader - absolute minimum for hardware compatibility
   * Ultra-basic solid color with minimal gradient interpolation
   */
  private getEmergencyFragmentShader(): string {
    return `#version 300 es
      precision lowp float;

      in vec2 vTextureCoords;
      out vec4 fragColor;

      uniform sampler2D u_gradientTexture;

      void main() {
        // Ultra-simple gradient lookup with minimal processing
        // Use lowp precision for maximum compatibility
        vec2 uv = vTextureCoords;
        
        // Simple gradient sample - no effects, no animations
        vec4 color = texture(u_gradientTexture, uv);
        
        // Emergency mode: ensure we always output something visible
        // Fallback to magenta if texture fails (indicates shader compilation success)
        if (color.a < 0.01) {
          fragColor = vec4(0.2, 0.1, 0.3, 1.0); // Dark purple fallback
        } else {
          fragColor = color;
        }
      }`;
  }

  /**
   * Check if WebGL should persist based on settings and never fallback to CSS
   */
  private shouldPersistWebGL(): boolean {
    // Always persist if user explicitly wants persistent WebGL
    if (this.settings.webglPersistenceMode === "persistent") {
      return true;
    }
    
    // Never persist in fallback mode
    if (this.settings.webglPersistenceMode === "fallback") {
      return false;
    }
    
    // Adaptive mode: persist if settings are enabled and WebGL was available initially
    return this.settings.webglPersistenceMode === "adaptive" && 
           this.settings.enabled && 
           this.isWebGLAvailable;
  }

  /**
   * Determine if we should attempt WebGL recovery vs CSS fallback
   */
  private shouldAttemptWebGLRecovery(): boolean {
    return this.shouldPersistWebGL();
  }

  // ============================================================================
  // CONTINUOUS QUALITY SCALING IMPLEMENTATION
  // ============================================================================

  /**
   * Apply continuous quality level (0-100) to WebGL system
   * Implements ContinuousQualityScalingCapable interface
   */
  public applyContinuousQuality(qualityLevel: QualityLevel): void {
    try {
      const level = qualityLevel;
      
      Y3KDebug?.debug?.log(
        "WebGLGradientBackgroundSystem",
        `Applying simplified quality level: ${level}`
      );
      
      // Apply settings based on tier-based quality level
      this.setQualityLevel(level);
      
      // Update CSS variables for system coordination
      this.cssController.batchSetVariables(
        "WebGLGradientBackgroundSystem",
        {
          "--sn-webgl-quality-level": level,
          "--sn-webgl-corridor-enabled": this.settings.corridorEnabled ? "1" : "0",
        },
        "high",
        "continuous-quality-update"
      );
      
      // Force repaint if settings changed significantly
      if (this.initialized && this.gl) {
        this.forceRepaint("quality-level-changed");
      }
      
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackgroundSystem",
        "Failed to apply continuous quality:",
        error
      );
    }
  }

  /**
   * Get current performance impact of the WebGL system
   * Implements ContinuousQualityScalingCapable interface
   */
  public getCurrentQualityImpact() {
    const isWebGLActive = this.gl !== null && this.isWebGLAvailable;
    const hasCorridorEffects = this.settings.corridorEnabled && this.corridorShaderProgram !== null;
    
    // Estimate performance impact based on current settings
    const baseCPU = isWebGLActive ? 0.15 : 0.05; // WebGL has higher CPU overhead
    const baseMemory = isWebGLActive ? 0.1 : 0.03; // WebGL uses more memory
    const baseGPU = isWebGLActive ? 0.2 : 0.0; // GPU usage only with WebGL
    
    // Additional impact from corridor effects
    const corridorCPU = hasCorridorEffects ? 0.1 : 0;
    const corridorMemory = hasCorridorEffects ? 0.05 : 0;
    const corridorGPU = hasCorridorEffects ? 0.15 : 0;
    
    // Flow strength and animation impact
    const animationMultiplier = Math.max(0.5, this.settings.flowStrength / 2);
    
    // Calculate estimated FPS impact
    let estimatedFPS = 60;
    if (hasCorridorEffects) estimatedFPS -= 10;
    if (this.settings.intensity === "intense") estimatedFPS -= 5;
    estimatedFPS = Math.max(30, estimatedFPS);
    
    return {
      cpu: Math.min(1, (baseCPU + corridorCPU) * animationMultiplier),
      memory: Math.min(1, (baseMemory + corridorMemory) * animationMultiplier),
      gpu: Math.min(1, (baseGPU + corridorGPU) * animationMultiplier),
      estimatedFPS,
    };
  }

  // =========================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE
  // =========================================================================

  public onVisualStateUpdate(state: VisualEffectState): void {
    // Update visual effects based on shared state
    this.onVisualEffectsFieldUpdate(state);
  }

  public onVisualEffectEvent(eventType: string, payload: any): void {
    // Handle visual effect events from coordinator
    switch (eventType) {
      case "visual:rhythm-shift":
        if (payload.intensity) {
          this.settings.flowStrength = Math.min(5, payload.intensity * 3);
        }
        break;
      case "visual:color-shift":
        this.forceRepaint("color-shift");
        break;
      case "visual:energy-surge":
        if (payload.intensity > 0.7) {
          this.forceRepaint("energy-surge");
        }
        break;
    }
  }

  public getVisualContribution(): Partial<VisualEffectState> {
    return {
      luminosity: this.settings.intensity === "intense" ? 0.8 : 0.5,
      fluidIntensity: this.settings.flowStrength / 5,
      effectDepth: this.getCurrentQualityImpact().cpu
    };
  }
}
