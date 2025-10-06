/**
 * WebGLGradientStrategy - ColorOrchestrator Strategy Implementation
 *
 * Transforms the WebGLGradientBackgroundSystem into a proper IColorProcessor strategy
 * for the unified ColorOrchestrator architecture. Handles WebGL gradient rendering,
 * shader compilation, and hybrid CSS-WebGL coordination.
 *
 * Philosophy: "High-performance gradient processing through WebGL shaders,
 * with intelligent fallback to CSS and device-aware optimization."
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type {
  ColorContext,
  ColorResult,
  IColorProcessor,
} from "@/types/colorStrategy";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";
import type { WebGLSystemInterface } from "@/core/webgl/WebGLSystemInterface";
import type { WebGLQuality } from "@/core/webgl/UnifiedWebGLController";
import { WebGLQualityMapper } from "@/core/webgl/WebGLSystemInterface";
import { settings } from "@/config";
import {
  OKLABColorProcessor,
  type OKLABProcessingResult,
} from "@/utils/color/OKLABColorProcessor";
import { paletteSystemManager } from "@/utils/color/PaletteSystemManager";
import * as Utils from "@/utils/core/ThemeUtilities";
import {
  createGradientTexture,
  DEFAULT_VERTEX_SHADER,
  ShaderLoader,
} from "@/utils/graphics/ShaderLoader";

// WebGL Flow Gradient Shader
const FLOW_GRADIENT_SHADER = `#version 300 es
precision mediump float;

uniform float u_time;
uniform sampler2D u_gradientTex;
uniform vec2 u_resolution;
uniform float u_flowStrength;
uniform float u_noiseScale;

// Wave stack uniforms
uniform float u_waveY[2];
uniform float u_waveHeight[2];
uniform float u_waveOffset[2];
uniform float u_blurExp;
uniform float u_blurMax;

out vec4 fragColor;

// Simplex noise implementation
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

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

// Wave alpha calculation with smooth transitions
float wave_alpha(vec2 uv, int waveIndex) {
  float y = uv.y;
  float waveCenter = u_waveY[waveIndex];
  float waveHeight = u_waveHeight[waveIndex];

  float distance = abs(y - waveCenter);
  float alpha = 1.0 - smoothstep(0.0, waveHeight * 0.5, distance);

  return alpha;
}

// Dynamic blur calculation using power function
float calc_blur(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float distance = length(uv - center);

  float blur = pow(distance, u_blurExp);
  blur = clamp(blur, 0.0, u_blurMax);

  return blur;
}

// Background noise generator with time offset
float background_noise(vec2 uv, float timeOffset) {
  vec2 flowUV = uv;
  float adjustedTime = u_time + timeOffset;

  flowUV.x += adjustedTime * 0.02 * u_flowStrength;
  flowUV.y += sin(adjustedTime * 0.03 + uv.x * 3.14159) * 0.01 * u_flowStrength;

  float noise1 = octaveNoise(flowUV * u_noiseScale, 4.0, 0.5, 1.0);
  float noise2 = octaveNoise(flowUV * u_noiseScale * 2.0 + vec2(100.0), 3.0, 0.4, 1.0);

  return (noise1 + noise2 * 0.3) * 0.5 + 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Generate three distinct background noise fields with time offsets
  float noise1 = background_noise(uv, u_waveOffset[0]);
  float noise2 = background_noise(uv, u_waveOffset[1]);
  float noise3 = background_noise(uv, 0.0); // Base noise without offset

  // Calculate wave alphas for blending
  float alpha1 = wave_alpha(uv, 0);
  float alpha2 = wave_alpha(uv, 1);
  float alpha3 = 1.0 - alpha1 - alpha2; // Remaining area
  alpha3 = max(alpha3, 0.0); // Ensure non-negative

  // Normalize alphas to ensure they sum to 1.0
  float totalAlpha = alpha1 + alpha2 + alpha3;
  if (totalAlpha > 0.0) {
    alpha1 /= totalAlpha;
    alpha2 /= totalAlpha;
    alpha3 /= totalAlpha;
  }

  // Blend the three noise fields based on wave alphas
  float t = noise1 * alpha1 + noise2 * alpha2 + noise3 * alpha3;
  t = clamp(t, 0.0, 1.0);

  // Sample gradient texture
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));

  // Apply dynamic blur based on position
  float blurAmount = calc_blur(uv);

  // Apply subtle vignette with blur modulation
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * (0.3 + blurAmount * 0.2);
  color.rgb *= vignette;

  // Apply blur effect to alpha channel for depth
  color.a *= (1.0 - blurAmount * 0.3);

  fragColor = color;
}`;

interface WebGLGradientState {
  canvas: HTMLCanvasElement | null;
  wrapper: HTMLDivElement | null;
  gl: WebGL2RenderingContext | null;
  shaderProgram: WebGLProgram | null;
  gradientTexture: WebGLTexture | null;
  vertexBuffer: WebGLBuffer | null;
  vao: WebGLVertexArrayObject | null;
  isWebGLAvailable: boolean;
  webglReady: boolean;
  animationId: number | null;
  startTime: number;
  lastFrameTime: number;
  lastUpdateTime: number;

  // LERP smoothing properties for framerate-independent uniform transitions
  currentFlowStrength: number;
  targetFlowStrength: number;
  currentNoiseScale: number;
  targetNoiseScale: number;
  currentBlurExp: number;
  targetBlurExp: number;
  currentBlurMax: number;
  targetBlurMax: number;
  // Wave parameters arrays
  currentWaveY: [number, number];
  targetWaveY: [number, number];
  currentWaveHeight: [number, number];
  targetWaveHeight: [number, number];
  currentWaveOffset: [number, number];
  targetWaveOffset: [number, number];
}

interface WebGLShaderUniforms {
  u_time: WebGLUniformLocation | null;
  u_gradientTex: WebGLUniformLocation | null;
  u_resolution: WebGLUniformLocation | null;
  u_flowStrength: WebGLUniformLocation | null;
  u_noiseScale: WebGLUniformLocation | null;
  u_waveY: WebGLUniformLocation | null;
  u_waveHeight: WebGLUniformLocation | null;
  u_waveOffset: WebGLUniformLocation | null;
  u_blurExp: WebGLUniformLocation | null;
  u_blurMax: WebGLUniformLocation | null;
}

interface WebGLFlowSettings {
  enabled: boolean;
  intensity: "minimal" | "balanced" | "intense";
  flowStrength: number;
  noiseScale: number;
  waveY: [number, number];
  waveHeight: [number, number];
  waveOffset: [number, number];
  blurExp: number;
  blurMax: number;
  frameThrottleInterval: number; // Target FPS
  oklabProcessingEnabled: boolean;
  oklabPreset: string; // OKLAB enhancement preset name
  gradientTextureSize: number; // Size of gradient texture for OKLAB precision
}

/**
 * WebGLGradientStrategy - Triple-Interface System
 *
 * Implements three complementary interfaces for complete WebGL gradient integration:
 * 1. IColorProcessor - Color processing layer integration
 * 2. IManagedSystem - Visual system lifecycle management
 * 3. WebGLSystemInterface - Quality scaling and performance coordination
 *
 * This triple-interface approach enables:
 * - Color Processing Layer: ColorStrategySelector → WebGLGradientStrategy (IColorProcessor)
 * - Visual System Layer: VisualEffectsCoordinator → WebGLGradientStrategy (IManagedSystem)
 * - Quality Scaling Layer: UnifiedWebGLController → WebGLGradientStrategy (WebGLSystemInterface)
 *
 * Phase 2.2 optimization: Direct quality scaling communication eliminates event bus overhead.
 */
export class WebGLGradientStrategy implements IColorProcessor, IManagedSystem, WebGLSystemInterface {
  // IManagedSystem property
  public initialized = false;

  private utils = Utils;
  private config = ADVANCED_SYSTEM_CONFIG;
  private deviceDetector: DeviceCapabilityDetector;
  private cssController: CSSVariableWriter;
  private oklabProcessor: OKLABColorProcessor;

  private webglState: WebGLGradientState = {
    canvas: null,
    wrapper: null,
    gl: null,
    shaderProgram: null,
    gradientTexture: null,
    vertexBuffer: null,
    vao: null,
    isWebGLAvailable: false,
    webglReady: false,
    animationId: null,
    startTime: 0,
    lastFrameTime: 0,
    lastUpdateTime: 0,

    // Initialize LERP smoothing properties (current = target initially)
    currentFlowStrength: 0.3,
    targetFlowStrength: 0.3,
    currentNoiseScale: 1.0,
    targetNoiseScale: 1.0,
    currentBlurExp: 1.2,
    targetBlurExp: 1.2,
    currentBlurMax: 0.5,
    targetBlurMax: 0.5,
    currentWaveY: [0.3, 0.7],
    targetWaveY: [0.3, 0.7],
    currentWaveHeight: [0.4, 0.3],
    targetWaveHeight: [0.4, 0.3],
    currentWaveOffset: [0.1, 0.6],
    targetWaveOffset: [0.1, 0.6],
  };

  private uniforms: WebGLShaderUniforms = {
    u_time: null,
    u_gradientTex: null,
    u_resolution: null,
    u_flowStrength: null,
    u_noiseScale: null,
    u_waveY: null,
    u_waveHeight: null,
    u_waveOffset: null,
    u_blurExp: null,
    u_blurMax: null,
  };

  private flowSettings: WebGLFlowSettings = {
    enabled: true,
    intensity: "balanced",
    flowStrength: 0.7,
    noiseScale: 1.2,
    waveY: [0.25, 0.75],
    waveHeight: [0.4, 0.3],
    waveOffset: [2.5, -1.8],
    blurExp: 1.2,
    blurMax: 0.6,
    frameThrottleInterval: 1000 / 45, // 45 FPS target
    oklabProcessingEnabled: true,
    oklabPreset: "VIBRANT", // Use vibrant preset for WebGL gradients
    gradientTextureSize: 512, // High precision for OKLAB gradients
  };

  private prefersReducedMotion = false;

  constructor(
    cssController?: CSSVariableWriter
  ) {
    this.deviceDetector = new DeviceCapabilityDetector();
    this.cssController = cssController || getGlobalCSSVariableWriter();
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);

    // Get CSS visual effects controller
    this.cssController = getGlobalCSSVariableWriter();

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check WebGL2 availability
    this.webglState.isWebGLAvailable = this.checkWebGL2Support();

    // Load settings
    this.loadFlowSettings();

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "🌊 WebGL gradient strategy initialized - Flow Gradient Recovery Debug",
      {
        webglAvailable: this.webglState.isWebGLAvailable,
        deviceCapability: this.deviceDetector.recommendPerformanceQuality(),
        oklabProcessing: this.flowSettings.oklabProcessingEnabled,
        flowSettings: {
          enabled: this.flowSettings.enabled,
          intensity: this.flowSettings.intensity,
          flowStrength: this.flowSettings.flowStrength,
          noiseScale: this.flowSettings.noiseScale,
        },
        prefersReducedMotion: this.prefersReducedMotion,
        webgl2ContextTest: this.checkWebGL2Support(),
      }
    );
  }

  /**
   * IColorProcessor interface implementation
   */
  getStrategyName(): string {
    return "webgl-gradient";
  }

  /**
   * Check if strategy can handle the given context
   * Updated to respect force WebGL settings and remove hard-coded device restrictions
   */
  canProcess(context: ColorContext): boolean {
    // Enhanced logging for WebGL gradient debugging
    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "🔍 canProcess() - WebGL Gradient Capability Check",
      {
        isWebGLAvailable: this.webglState.isWebGLAvailable,
        flowSettingsEnabled: this.flowSettings.enabled,
        webglReady: this.webglState.webglReady,
        contextTrackUri: context.trackUri,
        contextColorCount: Object.keys(context.rawColors).length,
      }
    );

    // WebGL support is required
    if (!this.webglState.isWebGLAvailable) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy",
        "❌ canProcess: WebGL not available - failed WebGL2 context check"
      );
      return false;
    }

    // Strategy must be enabled
    if (!this.flowSettings.enabled) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy", 
        "❌ canProcess: WebGL strategy disabled in settings"
      );
      return false;
    }

    // Check for force WebGL setting - bypass device performance restrictions
    // WebGL is enabled by default unless disabled in settings
    const webglEnabled = settings.get("sn-webgl-enabled");
    
    if (webglEnabled) {
      Y3KDebug?.debug?.log(
        "WebGLGradientStrategy",
        "canProcess: WebGL force enabled - bypassing device restrictions"
      );
      return true;
    }

    // Normal device capability check (no longer hard-excludes "low" devices)
    const performanceLevel = this.deviceDetector.recommendPerformanceQuality();
    
    // Allow WebGL on medium and high devices, log decision for low devices
    if (performanceLevel === "low") {
      Y3KDebug?.debug?.log(
        "WebGLGradientStrategy",
        `canProcess: Low performance device detected, allowing based on strategy selection (not force mode)`
      );
      // Strategy selector should handle degraded vs full WebGL - don't block here
      return true;
    }

    return true;
  }

  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number {
    // WebGL processing - variable based on complexity
    const baseTime = 12; // ~12ms for WebGL setup and rendering
    const shaderComplexity =
      this.flowSettings.intensity === "intense" ? 1.3 : 1.0;
    return Math.round(baseTime * shaderComplexity);
  }

  /**
   * Process colors using WebGL Gradient strategy with OKLAB enhancement
   */
  async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();
    let oklabResults: Record<string, OKLABProcessingResult> = {};

    try {
      // Initialize WebGL if not already done
      if (!this.webglState.webglReady) {
        await this.initializeWebGLGradient();
      }

      // Process colors through OKLAB if enabled
      let processedColors = context.rawColors;
      if (this.flowSettings.oklabProcessingEnabled) {
        const preset = OKLABColorProcessor.getPreset(
          this.flowSettings.oklabPreset
        );
        oklabResults = this.oklabProcessor.processColorPalette(
          context.rawColors,
          preset
        );

        // Create processed colors map using enhanced colors
        processedColors = Object.fromEntries(
          Object.entries(oklabResults).map(([key, result]) => [
            key,
            result.enhancedHex,
          ])
        );

        Y3KDebug?.debug?.log(
          "WebGLGradientStrategy",
          "OKLAB color enhancement applied:",
          {
            originalColors: Object.keys(context.rawColors).length,
            processedColors: Object.keys(processedColors).length,
            preset: preset.name,
          }
        );
      }

      // Create gradient from processed color context
      const gradientStops = this.createGradientStops(
        processedColors,
        oklabResults
      );
      await this.updateGradientTexture(gradientStops);

      // Setup hybrid coordination
      await this.enableHybridCoordination();

      // Start animation if not running
      if (!this.webglState.animationId) {
        this.startWebGLAnimation();
      }

      // Update flow parameters based on music data
      if (context.musicData?.energy !== undefined) {
        await this.updateFlowWithMusicEnergy(context.musicData.energy);
      }

      // Update state
      this.webglState.lastUpdateTime = Date.now();

      const processingTime = performance.now() - startTime;

      const primaryColor =
        this.selectPrimaryColor(processedColors) || paletteSystemManager.getDefaultAccentColor().hex;

      const result: ColorResult = {
        processedColors: {
          webgl: "active",
          gradientStops: gradientStops.length.toString(),
          ...processedColors,
          ...(Object.keys(context.rawColors).length > 0 && {
            originalColors: JSON.stringify(context.rawColors),
          }),
        },
        accentHex: primaryColor,
        accentRgb: this.convertToRgbString(primaryColor),
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          cacheKey: `webgl-gradient-${context.trackUri}`,
          harmonicIntensity: this.flowSettings.flowStrength,
          webglReady: this.webglState.webglReady,
          oklabProcessing: this.flowSettings.oklabProcessingEnabled,
          oklabPreset: this.flowSettings.oklabPreset,
          gradientTextureSize: this.flowSettings.gradientTextureSize,
          oklabResultsCount: Object.keys(oklabResults).length,
        },
        context,
      };

      Y3KDebug?.debug?.log(
        "WebGLGradientStrategy",
        "WebGL gradient processing completed",
        {
          gradientStops: gradientStops.length,
          processingTime,
          trackUri: context.trackUri,
        }
      );

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;

      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "WebGL gradient processing failed:",
        error
      );

      // Progressive fallback chain: WebGL → CSS Gradients → Solid Color
      const fallbackResult = await this.executeProgressiveFallback(context, error);
      
      return {
        ...fallbackResult,
        metadata: {
          ...fallbackResult.metadata,
          strategy: this.getStrategyName(),
          processingTime,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        context,
      };
    }
  }

  // ===========================================================================
  // IManagedSystem Interface Implementation
  // ===========================================================================

  /**
   * Initialize the WebGL gradient system (IManagedSystem)
   *
   * This method provides the standard IManagedSystem initialization interface
   * for use by VisualEffectsCoordinator. It wraps the internal initialization
   * logic and manages the initialized state.
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy",
        "Already initialized, skipping"
      );
      return;
    }

    try {
      // Initialize device detector
      await this.deviceDetector.initialize();

      // Initialize WebGL if supported
      if (this.webglState.isWebGLAvailable) {
        await this.initializeWebGLGradient();
      } else {
        Y3KDebug?.debug?.warn(
          "WebGLGradientStrategy",
          "WebGL2 not available, will use CSS fallback when processColors is called"
        );
      }

      this.initialized = true;

      Y3KDebug?.debug?.log(
        "WebGLGradientStrategy",
        "System initialized successfully",
        {
          webglAvailable: this.webglState.isWebGLAvailable,
          webglReady: this.webglState.webglReady,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "Initialization failed:",
        error
      );
      // Don't throw - allow fallback to CSS
      this.initialized = true; // Mark as initialized even if WebGL failed
    }
  }

  /**
   * Update animation frame (IManagedSystem)
   *
   * Provides external coordination point for animation updates.
   * The internal animation loop (animateWebGL) runs independently via
   * requestAnimationFrame, but this method allows external systems to
   * synchronize or trigger updates as needed.
   *
   * @param deltaTime - Time since last frame in milliseconds
   */
  public updateAnimation(deltaTime: number): void {
    // WebGL animation runs independently via requestAnimationFrame
    // This method is provided for IManagedSystem compatibility and
    // can be used for future coordination with external animation systems

    // For now, just ensure animation is running if WebGL is ready
    if (this.webglState.webglReady && !this.webglState.animationId) {
      this.startWebGLAnimation();
    }
  }

  /**
   * Check WebGL2 support
   */
  private checkWebGL2Support(): boolean {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    return gl !== null;
  }

  /**
   * Load flow settings from settings manager
   */
  private loadFlowSettings(): void {
    try {
      const intensitySetting = settings.get(
        "sn-gradient-intensity"
      );

      if (intensitySetting === "disabled") {
        this.flowSettings.enabled = false;
        return;
      }

      this.flowSettings.intensity = (intensitySetting as any) || "balanced";

      // Map intensity to parameters
      switch (this.flowSettings.intensity) {
        case "minimal":
          this.flowSettings.flowStrength = 0.4;
          this.flowSettings.noiseScale = 0.8;
          this.flowSettings.waveHeight = [0.3, 0.2];
          this.flowSettings.waveOffset = [1.5, -1.0];
          this.flowSettings.blurExp = 1.0;
          this.flowSettings.blurMax = 0.4;
          break;
        case "balanced":
          this.flowSettings.flowStrength = 0.7;
          this.flowSettings.noiseScale = 1.2;
          this.flowSettings.waveHeight = [0.4, 0.3];
          this.flowSettings.waveOffset = [2.5, -1.8];
          this.flowSettings.blurExp = 1.2;
          this.flowSettings.blurMax = 0.6;
          break;
        case "intense":
          this.flowSettings.flowStrength = 1.0;
          this.flowSettings.noiseScale = 1.6;
          this.flowSettings.waveHeight = [0.5, 0.4];
          this.flowSettings.waveOffset = [3.5, -2.5];
          this.flowSettings.blurExp = 1.4;
          this.flowSettings.blurMax = 0.8;
          break;
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy",
        "Failed to load settings, using defaults:",
        error
      );
    }
  }

  /**
   * Initialize WebGL gradient system
   */
  private async initializeWebGLGradient(): Promise<void> {
    if (!this.webglState.isWebGLAvailable) {
      throw new Error("WebGL2 not available");
    }

    // Create wrapper and canvas
    await this.createWebGLCanvas();

    // Initialize WebGL context
    await this.initializeWebGLContext();

    // Compile shaders
    await this.compileWebGLShaders();

    // Create geometry
    this.createWebGLGeometry();

    // Setup uniforms
    this.setupWebGLUniforms();

    // Configure canvas size
    this.resizeWebGLCanvas();

    // Add to DOM
    this.attachWebGLToDom();

    // Setup resize handler
    window.addEventListener("resize", this.resizeWebGLCanvas.bind(this));

    this.webglState.webglReady = true;

    // Announce WebGL readiness to CSS visual effects system
    try {
      const cssController = getGlobalCSSVariableWriter();
      cssController.setPerformanceTokens({
        webglReady: true,
        activeBackend: "webgl-strategy",
        qualityLevel: "high",
        gpuAcceleration: true
      });
      
      Y3KDebug?.debug?.log(
        "WebGLGradientStrategy",
        "🎨 WebGL readiness announced to CSS visual effects system - CSS Variables Set",
        {
          webglReady: true,
          activeBackend: "webgl-strategy",
          qualityLevel: "high", 
          gpuAcceleration: true,
          cssControllerReady: !!cssController,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy",
        "❌ Failed to announce WebGL readiness - CSS Variables NOT Set:",
        error
      );
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "WebGL gradient system initialized successfully"
    );
  }

  /**
   * Create WebGL canvas and wrapper
   */
  private async createWebGLCanvas(): Promise<void> {
    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "🎨 Creating WebGL canvas and wrapper elements"
    );

    // Create wrapper div
    this.webglState.wrapper = document.createElement("div");
    this.webglState.wrapper.className = "sn-webgl-gradient-wrapper";
    this.webglState.wrapper.style.cssText = `
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
    this.webglState.canvas = document.createElement("canvas");
    this.webglState.canvas.id = "sn-webgl-gradient-strategy";
    this.webglState.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;

    // Wrap canvas
    this.webglState.wrapper.appendChild(this.webglState.canvas);

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "✅ WebGL canvas and wrapper created successfully",
      {
        wrapperId: this.webglState.wrapper.className,
        canvasId: this.webglState.canvas.id,
        wrapperStyle: this.webglState.wrapper.style.cssText.replace(/\s+/g, " ").trim(),
      }
    );
  }

  /**
   * Initialize WebGL context
   */
  private async initializeWebGLContext(): Promise<void> {
    if (!this.webglState.canvas) {
      throw new Error("Canvas not created");
    }

    // Get WebGL2 context
    this.webglState.gl = this.webglState.canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
    });

    if (!this.webglState.gl) {
      throw new Error("Failed to get WebGL2 context");
    }
  }

  /**
   * Compile WebGL shaders
   */
  private async compileWebGLShaders(): Promise<void> {
    if (!this.webglState.gl) {
      throw new Error("WebGL context not available");
    }

    const vertexShader = ShaderLoader.loadVertex(
      this.webglState.gl,
      DEFAULT_VERTEX_SHADER
    );
    const fragmentShader = ShaderLoader.loadFragment(
      this.webglState.gl,
      FLOW_GRADIENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to compile shaders");
    }

    this.webglState.shaderProgram = ShaderLoader.createProgram(
      this.webglState.gl,
      vertexShader,
      fragmentShader
    );

    if (!this.webglState.shaderProgram) {
      throw new Error("Failed to create shader program");
    }
  }

  /**
   * Create WebGL geometry
   */
  private createWebGLGeometry(): void {
    if (!this.webglState.gl || !this.webglState.shaderProgram) return;

    // Full-screen triangle vertices
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);

    this.webglState.vertexBuffer = this.webglState.gl.createBuffer();
    this.webglState.gl.bindBuffer(
      this.webglState.gl.ARRAY_BUFFER,
      this.webglState.vertexBuffer
    );
    this.webglState.gl.bufferData(
      this.webglState.gl.ARRAY_BUFFER,
      vertices,
      this.webglState.gl.STATIC_DRAW
    );

    // Create VAO
    this.webglState.vao = this.webglState.gl.createVertexArray();
    this.webglState.gl.bindVertexArray(this.webglState.vao);

    const positionLocation = this.webglState.gl.getAttribLocation(
      this.webglState.shaderProgram,
      "a_position"
    );
    this.webglState.gl.enableVertexAttribArray(positionLocation);
    this.webglState.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.webglState.gl.FLOAT,
      false,
      0,
      0
    );

    this.webglState.gl.bindVertexArray(null);
  }

  /**
   * Setup WebGL uniforms
   */
  private setupWebGLUniforms(): void {
    if (!this.webglState.gl || !this.webglState.shaderProgram) return;

    this.uniforms.u_time = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_time"
    );
    this.uniforms.u_gradientTex = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_gradientTex"
    );
    this.uniforms.u_resolution = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_resolution"
    );
    this.uniforms.u_flowStrength = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_flowStrength"
    );
    this.uniforms.u_noiseScale = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_noiseScale"
    );
    this.uniforms.u_waveY = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_waveY"
    );
    this.uniforms.u_waveHeight = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_waveHeight"
    );
    this.uniforms.u_waveOffset = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_waveOffset"
    );
    this.uniforms.u_blurExp = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_blurExp"
    );
    this.uniforms.u_blurMax = this.webglState.gl.getUniformLocation(
      this.webglState.shaderProgram,
      "u_blurMax"
    );
  }

  /**
   * Create gradient stops from extracted colors with OKLAB enhancement
   */
  private createGradientStops(
    colors: Record<string, string>,
    oklabResults: Record<string, OKLABProcessingResult> = {}
  ) {
    const priorities = [
      "PRIMARY",
      "VIBRANT",
      "VIBRANT_NON_ALARMING",
      "LIGHT_VIBRANT",
      "DARK_VIBRANT",
      "PROMINENT",
    ];

    const stops = [];
    const usedColors = new Set<string>();

    // Add primary colors first, using OKLAB-enhanced colors when available
    let position = 0;
    for (const key of priorities) {
      const color = colors[key];
      if (color && !usedColors.has(color)) {
        // Use OKLAB result if available for enhanced color accuracy
        const oklabResult = oklabResults[key];
        const finalColor = oklabResult ? oklabResult.enhancedHex : color;

        const rgb = this.utils.hexToRgb(finalColor);
        if (rgb) {
          stops.push({
            r: rgb.r / 255,
            g: rgb.g / 255,
            b: rgb.b / 255,
            a: 1.0,
            position: position / (Math.min(priorities.length, 4) - 1),
            // Include OKLAB metadata for debugging
            ...(oklabResult && {
              oklabOriginal: oklabResult.originalHex,
              oklabEnhanced: oklabResult.enhancedHex,
            }),
          });
          usedColors.add(color);
          position++;

          if (stops.length >= 4) break; // Limit to 4 stops for performance
        }
      }
    }

    // Fallback to default Catppuccin gradient if no colors found
    if (stops.length === 0) {
      return this.getDefaultGradientStops();
    }

    return stops;
  }

  /**
   * Get default gradient stops
   */
  private getDefaultGradientStops() {
    return [
      { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 0.0 }, // Base
      { r: 0.549, g: 0.408, b: 0.878, a: 1.0, position: 0.3 }, // Mauve
      { r: 0.788, g: 0.557, b: 0.902, a: 1.0, position: 0.6 }, // Pink
      { r: 0.957, g: 0.761, b: 0.494, a: 1.0, position: 1.0 }, // Peach
    ];
  }

  /**
   * Update gradient texture with new color stops
   */
  private async updateGradientTexture(colorStops: any[]): Promise<void> {
    if (!this.webglState.gl) return;

    // Clean up old texture
    if (this.webglState.gradientTexture) {
      this.webglState.gl.deleteTexture(this.webglState.gradientTexture);
    }

    // Create new gradient texture
    this.webglState.gradientTexture = createGradientTexture(
      this.webglState.gl,
      colorStops
    );

    if (!this.webglState.gradientTexture) {
      throw new Error("Failed to create gradient texture");
    }

    // Update CSS fallback variables
    await this.updateCSSFallbackVariables(colorStops);
  }

  /**
   * Update CSS fallback variables for hybrid coordination using coordinated updates
   */
  private async updateCSSFallbackVariables(colorStops: any[]): Promise<void> {
    const maxStops = Math.min(8, colorStops.length);

    // Build variables object for coordinated batch update
    const gradientStopVariables: Record<string, string> = {
      "--sn-grad-stop-count": String(maxStops),
    };

    for (let i = 0; i < maxStops; i++) {
      const c = colorStops[i];
      if (c) {
        gradientStopVariables[`--sn-grad-stop-${i}-rgb`] = `${Math.round(
          c.r * 255
        )},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
      }
    }

    // Apply all gradient stop updates in a coordinated batch
    await this.cssController.batchSetVariables(
      "WebGLGradientStrategy",
      gradientStopVariables,
      "normal", // Normal priority for gradient configuration
      "gradient-stops-configuration"
    );
  }

  /**
   * Enable hybrid coordination between WebGL and CSS using coordinated updates
   */
  private async enableHybridCoordination(): Promise<void> {
    // Set hybrid WebGL coordination flags
    const hybridCoordinationVariables: Record<string, string> = {
      "--sn-webgl-ready": "1",
      "--sn-webgl-enabled": "1",
      "--sn-current-backend": "hybrid",
      "--sn-gradient-crossfade-opacity": "0.5", // 50% blend
    };

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "🔗 Setting hybrid coordination CSS variables - WebGL Gradient Activation",
      {
        variables: hybridCoordinationVariables,
        cssControllerReady: !!this.cssController,
      }
    );

    await this.cssController.batchSetVariables(
      "WebGLGradientStrategy",
      hybridCoordinationVariables,
      "high", // High priority for WebGL coordination
      "hybrid-coordination-enable"
    );

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "✅ Hybrid coordination CSS variables set successfully"
    );
  }

  /**
   * Start WebGL animation loop
   */
  private startWebGLAnimation(): void {
    this.webglState.startTime = performance.now();
    this.webglState.lastFrameTime = this.webglState.startTime;
    this.animateWebGL();
  }

  /**
   * WebGL animation loop
   */
  private animateWebGL = (): void => {
    if (
      !this.webglState.webglReady ||
      !this.webglState.gl ||
      !this.webglState.canvas
    )
      return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.webglState.lastFrameTime;

    // Throttle to target FPS
    if (deltaTime < this.flowSettings.frameThrottleInterval) {
      this.webglState.animationId = requestAnimationFrame(this.animateWebGL);
      return;
    }

    this.webglState.lastFrameTime = currentTime;
    this.renderWebGLFrame(currentTime);

    this.webglState.animationId = requestAnimationFrame(this.animateWebGL);
  };

  // LERP smoothing half-life values (in seconds) for WebGL uniform transitions
  private lerpHalfLifeValues = {
    flowStrength: 0.25, // Fast flow response
    noiseScale: 0.3, // Moderate noise transitions
    blur: 0.2, // Quick blur transitions
    wave: 0.35, // Gentle wave movements
  };

  /**
   * Update WebGL uniform values with LERP smoothing for framerate-independent transitions
   */
  private updateUniformsWithLERP(deltaTimeSeconds: number): void {
    // Update target values from current flow settings
    this.webglState.targetFlowStrength = this.flowSettings.flowStrength;
    this.webglState.targetNoiseScale = this.flowSettings.noiseScale;
    this.webglState.targetBlurExp = this.flowSettings.blurExp;
    this.webglState.targetBlurMax = this.flowSettings.blurMax;
    this.webglState.targetWaveY = [
      this.flowSettings.waveY[0],
      this.flowSettings.waveY[1],
    ];
    this.webglState.targetWaveHeight = [
      this.flowSettings.waveHeight[0],
      this.flowSettings.waveHeight[1],
    ];
    this.webglState.targetWaveOffset = [
      this.flowSettings.waveOffset[0],
      this.flowSettings.waveOffset[1],
    ];

    // Apply LERP smoothing to uniform values
    this.webglState.currentFlowStrength = Utils.lerpSmooth(
      this.webglState.currentFlowStrength,
      this.webglState.targetFlowStrength,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.flowStrength
    );

    this.webglState.currentNoiseScale = Utils.lerpSmooth(
      this.webglState.currentNoiseScale,
      this.webglState.targetNoiseScale,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.noiseScale
    );

    this.webglState.currentBlurExp = Utils.lerpSmooth(
      this.webglState.currentBlurExp,
      this.webglState.targetBlurExp,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.blur
    );

    this.webglState.currentBlurMax = Utils.lerpSmooth(
      this.webglState.currentBlurMax,
      this.webglState.targetBlurMax,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.blur
    );

    // Smooth wave arrays (explicit type handling for TypeScript)
    const waveIndex0 = 0 as const;
    const waveIndex1 = 1 as const;

    this.webglState.currentWaveY[waveIndex0] = Utils.lerpSmooth(
      this.webglState.currentWaveY[waveIndex0],
      this.webglState.targetWaveY[waveIndex0],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );

    this.webglState.currentWaveY[waveIndex1] = Utils.lerpSmooth(
      this.webglState.currentWaveY[waveIndex1],
      this.webglState.targetWaveY[waveIndex1],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );

    this.webglState.currentWaveHeight[waveIndex0] = Utils.lerpSmooth(
      this.webglState.currentWaveHeight[waveIndex0],
      this.webglState.targetWaveHeight[waveIndex0],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );

    this.webglState.currentWaveHeight[waveIndex1] = Utils.lerpSmooth(
      this.webglState.currentWaveHeight[waveIndex1],
      this.webglState.targetWaveHeight[waveIndex1],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );

    this.webglState.currentWaveOffset[waveIndex0] = Utils.lerpSmooth(
      this.webglState.currentWaveOffset[waveIndex0],
      this.webglState.targetWaveOffset[waveIndex0],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );

    this.webglState.currentWaveOffset[waveIndex1] = Utils.lerpSmooth(
      this.webglState.currentWaveOffset[waveIndex1],
      this.webglState.targetWaveOffset[waveIndex1],
      deltaTimeSeconds,
      this.lerpHalfLifeValues.wave
    );
  }

  /**
   * Render WebGL frame
   */
  private renderWebGLFrame(currentTime: number): void {
    if (
      !this.webglState.gl ||
      !this.webglState.shaderProgram ||
      !this.webglState.vao ||
      !this.webglState.gradientTexture
    ) {
      return;
    }

    // Update uniform values with LERP smoothing
    const deltaTimeSeconds =
      (currentTime - this.webglState.lastFrameTime) / 1000;
    this.updateUniformsWithLERP(deltaTimeSeconds);

    // Clear canvas
    this.webglState.gl.viewport(
      0,
      0,
      this.webglState.canvas!.width,
      this.webglState.canvas!.height
    );
    this.webglState.gl.clearColor(0, 0, 0, 0);
    this.webglState.gl.clear(this.webglState.gl.COLOR_BUFFER_BIT);

    // Use shader program
    this.webglState.gl.useProgram(this.webglState.shaderProgram);

    // Bind VAO
    this.webglState.gl.bindVertexArray(this.webglState.vao);

    // Update uniforms with smoothed values
    const time = this.prefersReducedMotion
      ? 0
      : (currentTime - this.webglState.startTime) / 1000;

    if (this.uniforms.u_time) {
      this.webglState.gl.uniform1f(this.uniforms.u_time, time);
    }

    if (this.uniforms.u_resolution) {
      this.webglState.gl.uniform2f(
        this.uniforms.u_resolution,
        this.webglState.canvas!.width,
        this.webglState.canvas!.height
      );
    }

    if (this.uniforms.u_flowStrength) {
      this.webglState.gl.uniform1f(
        this.uniforms.u_flowStrength,
        this.webglState.currentFlowStrength // Use smoothed value
      );
    }

    if (this.uniforms.u_noiseScale) {
      this.webglState.gl.uniform1f(
        this.uniforms.u_noiseScale,
        this.webglState.currentNoiseScale // Use smoothed value
      );
    }

    if (this.uniforms.u_waveY) {
      this.webglState.gl.uniform1fv(
        this.uniforms.u_waveY,
        this.webglState.currentWaveY // Use smoothed values
      );
    }

    if (this.uniforms.u_waveHeight) {
      this.webglState.gl.uniform1fv(
        this.uniforms.u_waveHeight,
        this.webglState.currentWaveHeight // Use smoothed values
      );
    }

    if (this.uniforms.u_waveOffset) {
      this.webglState.gl.uniform1fv(
        this.uniforms.u_waveOffset,
        this.webglState.currentWaveOffset // Use smoothed values
      );
    }

    if (this.uniforms.u_blurExp) {
      this.webglState.gl.uniform1f(
        this.uniforms.u_blurExp,
        this.webglState.currentBlurExp // Use smoothed value
      );
    }

    if (this.uniforms.u_blurMax) {
      this.webglState.gl.uniform1f(
        this.uniforms.u_blurMax,
        this.webglState.currentBlurMax // Use smoothed value
      );
    }

    // Bind gradient texture
    this.webglState.gl.activeTexture(this.webglState.gl.TEXTURE0);
    this.webglState.gl.bindTexture(
      this.webglState.gl.TEXTURE_2D,
      this.webglState.gradientTexture
    );

    if (this.uniforms.u_gradientTex) {
      this.webglState.gl.uniform1i(this.uniforms.u_gradientTex, 0);
    }

    // Draw
    this.webglState.gl.drawArrays(this.webglState.gl.TRIANGLES, 0, 3);

    // Cleanup
    this.webglState.gl.bindVertexArray(null);
  }

  /**
   * Update flow with music energy using coordinated updates
   */
  private async updateFlowWithMusicEnergy(energy: number): Promise<void> {
    // Adjust flow strength based on music energy
    const baseStrength = this.flowSettings.flowStrength;
    const energyMultiplier = 1 + energy * 0.5; // Up to 50% increase
    const adjustedStrength = baseStrength * energyMultiplier;

    // Update CSS variable for real-time flow coordination using coordinated update
    await this.cssController.setVariable(
      "WebGLGradientStrategy",
      "--sn-flow-strength",
      adjustedStrength.toString(),
      "high", // High priority for real-time music responsiveness
      "music-energy-flow-strength"
    );
  }

  /**
   * Resize WebGL canvas
   */
  private resizeWebGLCanvas = (): void => {
    if (!this.webglState.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    this.webglState.canvas.width = displayWidth * dpr;
    this.webglState.canvas.height = displayHeight * dpr;
    this.webglState.canvas.style.width = displayWidth + "px";
    this.webglState.canvas.style.height = displayHeight + "px";
  };

  /**
   * Attach WebGL canvas to DOM
   */
  private attachWebGLToDom(): void {
    if (!this.webglState.wrapper) {
      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "❌ Cannot attach to DOM - wrapper element not created"
      );
      return;
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "🔗 Attaching WebGL canvas to DOM - Searching for container"
    );

    // Find target container
    const containers = [
      ".Root__main-view",
      ".main-view-container",
      ".main-gridContainer-gridContainer",
      ".Root__top-container",
      "body",
    ];

    let targetContainer: HTMLElement | null = null;
    const containerResults: {selector: string, found: boolean}[] = [];
    
    for (const selector of containers) {
      targetContainer = document.querySelector(selector) as HTMLElement;
      containerResults.push({selector, found: !!targetContainer});
      if (targetContainer) break;
    }

    if (!targetContainer) {
      targetContainer = document.body;
    }

    targetContainer.appendChild(this.webglState.wrapper);

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "✅ WebGL canvas attached to DOM successfully",
      {
        containerSearch: containerResults,
        selectedContainer: targetContainer?.tagName || "unknown",
        containerClass: targetContainer?.className || "none",
        wrapperId: this.webglState.wrapper.className,
        canvasId: this.webglState.canvas?.id || "not-created",
      }
    );
  }

  /**
   * Execute progressive fallback chain: WebGL → CSS Gradients → Solid Color
   */
  private async executeProgressiveFallback(context: ColorContext, originalError: any): Promise<ColorResult> {
    const primaryColor = this.selectPrimaryColor(context.rawColors) || paletteSystemManager.getDefaultAccentColor().hex;
    
    try {
      // Level 1: Try CSS Gradients fallback
      Y3KDebug?.debug?.warn(
        "WebGLGradientStrategy", 
        "Attempting CSS gradient fallback"
      );
      
      await this.fallbackToCSSGradient();
      
      return {
        processedColors: {
          ...context.rawColors,
          fallbackMethod: "css-gradient",
        },
        accentHex: primaryColor,
        accentRgb: this.convertToRgbString(primaryColor),
        metadata: {
          strategy: this.getStrategyName(),
          processingTime: 0, // Will be updated in processColors
          fallbackMode: "css-gradient",
          fallbackReason: "webgl-failed",
          gradientStops: Object.keys(context.rawColors).length,
        },
        context,
      };
    } catch (cssError) {
      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "CSS gradient fallback failed, using solid color:",
        cssError
      );
      
      // Level 2: Fall back to solid color
      return await this.fallbackToSolidColor(context, primaryColor, originalError, cssError);
    }
  }

  /**
   * Final fallback to solid color when all gradient methods fail
   */
  private async fallbackToSolidColor(
    context: ColorContext, 
    primaryColor: string, 
    webglError: any, 
    cssError: any
  ): Promise<ColorResult> {
    try {
      // Apply solid color using CSS visual effects controller
      await this.cssController?.queueUpdate(
        "--sn-accent-color",
        primaryColor,
        "critical",
        "solid-color-fallback"
      );
      
      return {
        processedColors: {
          accentColor: primaryColor,
          fallbackMethod: "solid-color",
          originalColors: JSON.stringify(context.rawColors),
        },
        accentHex: primaryColor,
        accentRgb: this.convertToRgbString(primaryColor),
        metadata: {
          strategy: this.getStrategyName(),
          processingTime: 0, // Will be updated in processColors
          fallbackMode: "solid-color",
          fallbackReason: "all-gradients-failed",
          webglError: webglError instanceof Error ? webglError.message : "Unknown WebGL error",
          cssError: cssError instanceof Error ? cssError.message : "Unknown CSS error",
          emergencyMode: true,
        },
        context,
      };
    } catch (solidColorError) {
      // Absolute emergency fallback - return basic result
      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "All fallback methods failed, using emergency mode:",
        solidColorError
      );
      
      return {
        processedColors: { emergencyMode: "true" },
        accentHex: "#ff6b9d", // Catppuccin pink fallback
        accentRgb: "rgb(255, 107, 157)",
        metadata: {
          strategy: this.getStrategyName(),
          processingTime: 0, // Will be updated in processColors
          fallbackMode: "emergency",
          fallbackReason: "complete-system-failure",
          criticalError: true,
        },
        context,
      };
    }
  }

  /**
   * Fallback to CSS gradient rendering when WebGL fails
   */
  private async fallbackToCSSGradient(): Promise<void> {
    // Switch to pure CSS mode using coordinated batch update
    const cssGradientFallbackVariables: Record<string, string> = {
      "--sn-webgl-ready": "0",
      "--sn-webgl-enabled": "0",
      "--sn-current-backend": "css",
      "--sn-gradient-crossfade-opacity": "0",
    };

    await this.cssController.batchSetVariables(
      "WebGLGradientStrategy",
      cssGradientFallbackVariables,
      "critical", // Critical priority for fallback scenarios
      "css-gradient-fallback"
    );

    // Start CSS fallback animation
    if (this.cssController) {
      this.startCSSFallbackAnimation();
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "Using CSS gradient fallback"
    );
  }

  /**
   * Start CSS fallback animation
   */
  private startCSSFallbackAnimation(): void {
    if (!this.cssController) return;

    const animateCSS = () => {
      if (!this.webglState.webglReady) return;

      const time = performance.now() / 1000;
      const flowX = Math.sin(time * 0.04) * 20 + Math.sin(time * 0.07) * 8;
      const flowY = Math.cos(time * 0.05) * 20 + Math.cos(time * 0.09) * 6;
      const scale = 1.15 + Math.sin(time * 0.03) * 0.2;

      this.cssController!.queueCSSVariableUpdate(
        "--sn-gradient-flow-x",
        `${flowX}%`
      );
      this.cssController!.queueCSSVariableUpdate(
        "--sn-gradient-flow-y",
        `${flowY}%`
      );
      this.cssController!.queueCSSVariableUpdate(
        "--sn-gradient-flow-scale",
        scale.toString()
      );

      setTimeout(animateCSS, this.flowSettings.frameThrottleInterval);
    };

    animateCSS();
  }

  /**
   * Select primary color from extracted colors
   */
  private selectPrimaryColor(colors: Record<string, string>): string | null {
    const priorities = [
      "PRIMARY",
      "VIBRANT",
      "PROMINENT",
      "VIBRANT_NON_ALARMING",
      "LIGHT_VIBRANT",
    ];

    for (const key of priorities) {
      const color = colors[key];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }

    return null;
  }

  /**
   * Convert hex color to RGB string
   */
  private convertToRgbString(hex: string): string {
    const rgb = this.utils.hexToRgb(hex);
    return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "203,166,247";
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<WebGLFlowSettings>): void {
    this.flowSettings = { ...this.flowSettings, ...newConfig };

    // Update OKLAB processor debug setting if configuration changed
    if ("oklabProcessingEnabled" in newConfig || "oklabPreset" in newConfig) {
      this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    }

    Y3KDebug?.debug?.log("WebGLGradientStrategy", "Configuration updated:", {
      ...newConfig,
      oklabProcessing: this.flowSettings.oklabProcessingEnabled,
      oklabPreset: this.flowSettings.oklabPreset,
      gradientTextureSize: this.flowSettings.gradientTextureSize,
    });
  }

  /**
   * Health check for strategy status (IManagedSystem)
   *
   * Returns comprehensive health information about the WebGL gradient system,
   * including WebGL readiness, configuration status, and performance metrics.
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const hasRecentUpdate = Date.now() - this.webglState.lastUpdateTime < 30000; // 30s
    const isHealthy = this.webglState.webglReady && this.flowSettings.enabled;

    const issues: string[] = [];
    if (!this.webglState.webglReady) {
      issues.push("WebGL system not ready");
    }
    if (!this.flowSettings.enabled) {
      issues.push("WebGL gradient disabled in settings");
    }

    const result: HealthCheckResult = {
      system: "WebGLGradientStrategy",
      healthy: isHealthy,
      details: isHealthy
        ? "WebGL gradient rendering active"
        : issues.join("; "),
      metrics: {
        // Core status
        webglAvailable: this.webglState.isWebGLAvailable,
        webglReady: this.webglState.webglReady,
        flowEnabled: this.flowSettings.enabled,
        initialized: this.initialized,

        // Configuration
        intensity: this.flowSettings.intensity,
        deviceCapability: this.deviceDetector.recommendPerformanceQuality(),

        // Runtime status
        hasRecentUpdate,
        animationActive: this.webglState.animationId !== null,

        // OKLAB processing
        oklabProcessing: this.flowSettings.oklabProcessingEnabled,
        oklabPreset: this.flowSettings.oklabPreset,
        gradientTextureSize: this.flowSettings.gradientTextureSize,

        // Canvas status
        ...(this.webglState.canvas && {
          canvasSize: {
            width: this.webglState.canvas.width,
            height: this.webglState.canvas.height,
          },
        }),

        // IColorProcessor compatibility flag
        canProcess: this.canProcess({} as ColorContext),
      },
    };

    // Add issues property only if there are issues (exactOptionalPropertyTypes strict mode)
    if (issues.length > 0) {
      result.issues = issues;
    }

    return result;
  }

  /**
   * Cleanup WebGL resources
   */
  public destroy(): void {
    // Stop animation
    if (this.webglState.animationId) {
      cancelAnimationFrame(this.webglState.animationId);
      this.webglState.animationId = null;
    }

    // Clean up WebGL resources
    if (this.webglState.gl) {
      if (this.webglState.gradientTexture) {
        this.webglState.gl.deleteTexture(this.webglState.gradientTexture);
        this.webglState.gradientTexture = null;
      }

      if (this.webglState.vertexBuffer) {
        this.webglState.gl.deleteBuffer(this.webglState.vertexBuffer);
        this.webglState.vertexBuffer = null;
      }

      if (this.webglState.vao) {
        this.webglState.gl.deleteVertexArray(this.webglState.vao);
        this.webglState.vao = null;
      }

      if (this.webglState.shaderProgram) {
        this.webglState.gl.deleteProgram(this.webglState.shaderProgram);
        this.webglState.shaderProgram = null;
      }

      // Clear shader cache
      ShaderLoader.clearCache(this.webglState.gl);
    }

    // Remove wrapper from DOM
    if (this.webglState.wrapper && this.webglState.wrapper.parentNode) {
      this.webglState.wrapper.parentNode.removeChild(this.webglState.wrapper);
      this.webglState.wrapper = null;
    }

    this.webglState.canvas = null;
    this.webglState.gl = null;
    this.webglState.webglReady = false;

    // Remove resize handler
    window.removeEventListener("resize", this.resizeWebGLCanvas);

    // Reset CSS variables using coordinated updates
    const resetVariables: Record<string, string> = {
      "--sn-webgl-ready": "0",
      "--sn-webgl-enabled": "0",
      "--sn-current-backend": "css",
      "--sn-gradient-crossfade-opacity": "0",
    };

    try {
      this.cssController.batchSetVariables(
        "WebGLGradientStrategy",
        resetVariables,
        "critical", // Critical priority for cleanup
        "strategy-destroy-cleanup"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientStrategy",
        "Error during destroy cleanup:",
        error
      );
    }

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      "WebGL gradient strategy destroyed"
    );
  }

  // ===========================================================================
  // WebGLSystemInterface Implementation (Phase 3 Optimization)
  // ===========================================================================

  /**
   * Enable or disable WebGL rendering (WebGLSystemInterface)
   *
   * When disabled, system falls back to CSS gradients. When enabled, resumes
   * WebGL animation if device supports it.
   *
   * @param enabled - Whether WebGL rendering should be active
   */
  public setEnabled(enabled: boolean): void {
    if (enabled && this.isCapable()) {
      // Enable WebGL rendering
      if (!this.webglState.webglReady) {
        // WebGL not initialized yet, try to initialize
        this.initializeWebGLGradient().then(() => {
          if (this.webglState.webglReady) {
            this.startWebGLAnimation();
            Y3KDebug?.debug?.log("WebGLGradientStrategy", "WebGL enabled and animation started");
          }
        }).catch(error => {
          Y3KDebug?.debug?.warn("WebGLGradientStrategy", "Failed to enable WebGL:", error);
        });
      } else if (!this.webglState.animationId) {
        // WebGL ready but animation not running
        this.startWebGLAnimation();
        Y3KDebug?.debug?.log("WebGLGradientStrategy", "WebGL animation resumed");
      }

      // Update flow settings
      this.flowSettings.enabled = true;

      // Update backend indicator (WebGL takes over)
      this.cssController.setVariable(
        "--sn-current-backend",
        "webgl",
        "critical",
        "webgl-enable"
      );

    } else {
      // Disable WebGL, switch to CSS fallback
      if (this.webglState.animationId) {
        cancelAnimationFrame(this.webglState.animationId);
        this.webglState.animationId = null;
      }

      this.flowSettings.enabled = false;

      // Apply CSS gradient fallback
      this.cssController.setVariable(
        "--sn-current-backend",
        "css",
        "critical",
        "webgl-disable"
      );

      Y3KDebug?.debug?.log("WebGLGradientStrategy", "WebGL disabled, using CSS fallback");
    }
  }

  /**
   * Set quality level for WebGL rendering (WebGLSystemInterface)
   *
   * Maps quality levels to flow settings parameters:
   * - low: Reduced flow intensity, 30fps target
   * - medium: Balanced flow effects, 45fps target
   * - high: Maximum flow intensity, 60fps target
   *
   * @param quality - Quality tier (low, medium, high)
   */
  public setQuality(quality: WebGLQuality): void {
    // Map quality to flow settings intensity
    let newIntensity: "minimal" | "balanced" | "intense";
    let frameThrottleInterval: number;

    switch (quality) {
      case 'low':
        newIntensity = "minimal";
        frameThrottleInterval = WebGLQualityMapper.getFrameThrottling(quality); // ~30fps
        break;
      case 'medium':
        newIntensity = "balanced";
        frameThrottleInterval = WebGLQualityMapper.getFrameThrottling(quality); // ~45fps
        break;
      case 'high':
        newIntensity = "intense";
        frameThrottleInterval = WebGLQualityMapper.getFrameThrottling(quality); // ~60fps
        break;
    }

    // Update flow settings
    const oldIntensity = this.flowSettings.intensity;
    this.flowSettings.intensity = newIntensity;
    this.flowSettings.frameThrottleInterval = frameThrottleInterval;

    // Load intensity-specific parameters
    this.loadFlowSettings();

    Y3KDebug?.debug?.log(
      "WebGLGradientStrategy",
      `Quality changed: ${quality} (${oldIntensity} → ${newIntensity}, ${frameThrottleInterval.toFixed(1)}ms frame target)`
    );
  }

  /**
   * Check if WebGL rendering is currently enabled (WebGLSystemInterface)
   *
   * @returns True if WebGL animation is running
   */
  public isEnabled(): boolean {
    return this.flowSettings.enabled &&
           this.webglState.webglReady &&
           this.webglState.animationId !== null;
  }

  /**
   * Check if device is capable of WebGL rendering (WebGLSystemInterface)
   *
   * @returns True if WebGL2 is available on this device
   */
  public isCapable(): boolean {
    return this.webglState.isWebGLAvailable;
  }

  /**
   * Get current quality level (WebGLSystemInterface)
   *
   * Maps flowSettings.intensity back to quality tier:
   * - minimal → low
   * - balanced → medium
   * - intense → high
   *
   * @returns Current quality tier
   */
  public getQuality(): WebGLQuality {
    switch (this.flowSettings.intensity) {
      case "minimal":
        return "low";
      case "balanced":
        return "medium";
      case "intense":
        return "high";
      default:
        return "medium"; // Safe fallback
    }
  }

  /**
   * Get system name for debugging (WebGLSystemInterface)
   *
   * @returns System identifier
   */
  public getSystemName(): string {
    return "WebGLGradientStrategy";
  }
}
