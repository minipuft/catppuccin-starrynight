/**
 * WebGLGradientBackgroundSystem - Flowing WebGL gradient background
 * Part of the Year 3000 System visual pipeline
 * 
 * Implements Alex Harri's flowing gradient technique with Catppuccin color integration
 */

import { BaseVisualSystem } from '@/systems/BaseVisualSystem';
import { ShaderLoader, createGradientTexture, DEFAULT_VERTEX_SHADER } from '@/utils/ShaderLoader';
import { ColorHarmonyEngine } from '@/systems/ColorHarmonyEngine';
import { DeviceCapabilityDetector } from '@/core/DeviceCapabilityDetector';
import { CSSVariableBatcher } from '@/core/CSSVariableBatcher';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import { PerformanceAnalyzer } from '@/core/PerformanceAnalyzer';
import { SettingsManager } from '@/managers/SettingsManager';
import { MusicSyncService } from '@/services/MusicSyncService';
import type { Year3000Config } from '@/types/models';
import { Y3K } from '@/debug/SystemHealthMonitor';

// Import raw shader source
// Note: esbuild with --loader:.fs=text will handle this import
const flowGradientShader = `#version 300 es
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

interface FlowGradientSettings {
  enabled: boolean;
  intensity: 'minimal' | 'balanced' | 'intense';
  flowStrength: number;
  noiseScale: number;
  waveY: [number, number];
  waveHeight: [number, number];
  waveOffset: [number, number];
  blurExp: number;
  blurMax: number;
}

interface FlowGradientUniforms {
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

export class WebGLGradientBackgroundSystem extends BaseVisualSystem {
  private canvas: HTMLCanvasElement | null = null;
  private wrapper: HTMLDivElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private shaderProgram: WebGLProgram | null = null;
  private uniforms: FlowGradientUniforms = {
    u_time: null,
    u_gradientTex: null,
    u_resolution: null,
    u_flowStrength: null,
    u_noiseScale: null,
    u_waveY: null,
    u_waveHeight: null,
    u_waveOffset: null,
    u_blurExp: null,
    u_blurMax: null
  };
  
  private gradientTexture: WebGLTexture | null = null;
  private vertexBuffer: WebGLBuffer | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  
  private settings: FlowGradientSettings = {
    enabled: true,
    intensity: 'balanced',
    flowStrength: 0.7,
    noiseScale: 1.2,
    waveY: [0.25, 0.75], // Wave positions from theme metrics
    waveHeight: [0.4, 0.3], // Wave heights for smooth blending
    waveOffset: [2.5, -1.8], // Time offsets for wave independence
    blurExp: 1.2, // Blur power function exponent
    blurMax: 0.6 // Maximum blur amount
  };
  
  private isWebGLAvailable = false;
  private animationId: number | null = null;
  private startTime = 0;
  private lastFrameTime = 0;
  private frameThrottleInterval = 1000 / 45; // 45 FPS target
  
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private cssVariableBatcher: CSSVariableBatcher | null = null;
  private boundColorHarmonyHandler: ((event: Event) => void) | null = null;
  private prefersReducedMotion = false;

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import('@/utils/Year3000Utilities'),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    // Get ColorHarmonyEngine from year3000System if available
    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;
    this.cssVariableBatcher = new CSSVariableBatcher();
    
    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Bind event handlers
    this.boundColorHarmonyHandler = this.handleColorHarmonyChange.bind(this);
  }

  async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    // Check WebGL2 capability
    this.isWebGLAvailable = this.checkWebGL2Support();
    
    if (!this.isWebGLAvailable) {
      this.fallbackToCSSGradient();
      return;
    }

    // Check device capabilities
    const deviceDetector = new DeviceCapabilityDetector();
    if (deviceDetector.recommendPerformanceQuality() === 'low') {
      Y3K?.debug?.log('WebGLGradientBackgroundSystem', 'Low performance device detected, falling back to CSS gradient');
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
      this.startAnimation();
      
      Y3K?.debug?.log('WebGLGradientBackgroundSystem', 'WebGL gradient system initialized successfully');
    } catch (error) {
      Y3K?.debug?.error('WebGLGradientBackgroundSystem', 'Failed to initialize WebGL gradient:', error);
      this.fallbackToCSSGradient();
    }
  }

  private checkWebGL2Support(): boolean {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl !== null;
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      const intensitySetting = this.settingsManager.get('sn-flow-gradient' as any);
      
      if (intensitySetting === 'disabled') {
        this.settings.enabled = false;
        return;
      }

      this.settings.intensity = (intensitySetting as any) || 'balanced';
      
      // Map intensity to parameters
      switch (this.settings.intensity) {
        case 'minimal':
          this.settings.flowStrength = 0.4;
          this.settings.noiseScale = 0.8;
          this.settings.waveHeight = [0.3, 0.2];
          this.settings.waveOffset = [1.5, -1.0];
          this.settings.blurExp = 1.0;
          this.settings.blurMax = 0.4;
          break;
        case 'balanced':
          this.settings.flowStrength = 0.7;
          this.settings.noiseScale = 1.2;
          this.settings.waveHeight = [0.4, 0.3];
          this.settings.waveOffset = [2.5, -1.8];
          this.settings.blurExp = 1.2;
          this.settings.blurMax = 0.6;
          break;
        case 'intense':
          this.settings.flowStrength = 1.0;
          this.settings.noiseScale = 1.6;
          this.settings.waveHeight = [0.5, 0.4];
          this.settings.waveOffset = [3.5, -2.5];
          this.settings.blurExp = 1.4;
          this.settings.blurMax = 0.8;
          break;
      }
    } catch (error) {
      Y3K?.debug?.warn('WebGLGradientBackgroundSystem', 'Failed to load settings, using defaults:', error);
    }
  }

  private async initializeWebGL(): Promise<void> {
    // Create wrapper div for skew transforms
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'sn-flow-gradient-wrapper';
    this.wrapper.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -11;
      pointer-events: none;
      overflow: hidden;
    `;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sn-webgl-gradient';
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
    
    // Get WebGL2 context
    this.gl = this.canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'default'
    });

    if (!this.gl) {
      throw new Error('Failed to get WebGL2 context');
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
    
    // Add wrapper to DOM
    document.body.appendChild(this.wrapper);
    
    // Set up resize handler
    window.addEventListener('resize', this.resize.bind(this));
  }

  private async compileShaders(): Promise<void> {
    if (!this.gl) throw new Error('WebGL context not available');

    const vertexShader = ShaderLoader.loadVertex(this.gl, DEFAULT_VERTEX_SHADER);
    const fragmentShader = ShaderLoader.loadFragment(this.gl, flowGradientShader);

    if (!vertexShader || !fragmentShader) {
      throw new Error('Failed to compile shaders');
    }

    this.shaderProgram = ShaderLoader.createProgram(this.gl, vertexShader, fragmentShader);
    
    if (!this.shaderProgram) {
      throw new Error('Failed to create shader program');
    }
  }

  private createGeometry(): void {
    if (!this.gl || !this.shaderProgram) return;

    // Full-screen triangle vertices
    const vertices = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]);

    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    // Create VAO
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    const positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindVertexArray(null);
  }

  private setupUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;

    this.uniforms.u_time = this.gl.getUniformLocation(this.shaderProgram, 'u_time');
    this.uniforms.u_gradientTex = this.gl.getUniformLocation(this.shaderProgram, 'u_gradientTex');
    this.uniforms.u_resolution = this.gl.getUniformLocation(this.shaderProgram, 'u_resolution');
    this.uniforms.u_flowStrength = this.gl.getUniformLocation(this.shaderProgram, 'u_flowStrength');
    this.uniforms.u_noiseScale = this.gl.getUniformLocation(this.shaderProgram, 'u_noiseScale');
    this.uniforms.u_waveY = this.gl.getUniformLocation(this.shaderProgram, 'u_waveY');
    this.uniforms.u_waveHeight = this.gl.getUniformLocation(this.shaderProgram, 'u_waveHeight');
    this.uniforms.u_waveOffset = this.gl.getUniformLocation(this.shaderProgram, 'u_waveOffset');
    this.uniforms.u_blurExp = this.gl.getUniformLocation(this.shaderProgram, 'u_blurExp');
    this.uniforms.u_blurMax = this.gl.getUniformLocation(this.shaderProgram, 'u_blurMax');
  }

  private async updateGradientTexture(): Promise<void> {
    if (!this.gl) return;

    // Get current gradient from ColorHarmonyEngine
    let colorStops = this.getDefaultGradientStops();
    
    if (this.colorHarmonyEngine) {
      try {
        const currentGradient = this.colorHarmonyEngine.getCurrentGradient(5);
        if (currentGradient && currentGradient.length > 0) {
          colorStops = currentGradient.map((color, index) => ({
            r: color.r / 255,
            g: color.g / 255,
            b: color.b / 255,
            a: 1.0,
            position: index / (currentGradient.length - 1)
          }));
          
          Y3K?.debug?.log('WebGLGradientBackgroundSystem', `Updated gradient texture with ${colorStops.length} stops from ColorHarmonyEngine`);
        }
      } catch (error) {
        Y3K?.debug?.warn('WebGLGradientBackgroundSystem', 'Failed to get gradient from ColorHarmonyEngine:', error);
      }
    }

    // Clean up old texture
    if (this.gradientTexture) {
      this.gl.deleteTexture(this.gradientTexture);
    }

    // Create new gradient texture
    this.gradientTexture = createGradientTexture(this.gl, colorStops);
    
    if (!this.gradientTexture) {
      throw new Error('Failed to create gradient texture');
    }
  }

  private getDefaultGradientStops() {
    // Catppuccin Mocha default gradient
    return [
      { r: 0.196, g: 0.165, b: 0.282, a: 1.0, position: 0.0 }, // Base
      { r: 0.549, g: 0.408, b: 0.878, a: 1.0, position: 0.3 }, // Mauve
      { r: 0.788, g: 0.557, b: 0.902, a: 1.0, position: 0.6 }, // Pink
      { r: 0.957, g: 0.761, b: 0.494, a: 1.0, position: 1.0 }  // Peach
    ];
  }

  private subscribeToEvents(): void {
    if (this.colorHarmonyEngine && this.boundColorHarmonyHandler) {
      document.addEventListener('color-harmony:gradient-changed', this.boundColorHarmonyHandler);
    }
  }

  private handleColorHarmonyChange(event: Event): void {
    // Update gradient texture with new colors
    this.updateGradientTexture().catch(error => {
      Y3K?.debug?.error('WebGLGradientBackgroundSystem', 'Failed to update gradient texture:', error);
    });
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
    if (!this.gl || !this.shaderProgram || !this.vao || !this.gradientTexture) return;

    // Clear canvas
    this.gl.viewport(0, 0, this.canvas!.width, this.canvas!.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use shader program
    this.gl.useProgram(this.shaderProgram);

    // Bind VAO
    this.gl.bindVertexArray(this.vao);

    // Update uniforms
    const time = this.prefersReducedMotion ? 0 : (currentTime - this.startTime) / 1000;
    
    if (this.uniforms.u_time) {
      this.gl.uniform1f(this.uniforms.u_time, time);
    }
    
    if (this.uniforms.u_resolution) {
      this.gl.uniform2f(this.uniforms.u_resolution, this.canvas!.width, this.canvas!.height);
    }
    
    if (this.uniforms.u_flowStrength) {
      // BeatSync ↔ Flow Gradient Adapter: Read flow strength from CSS variable
      const rootStyle = document.documentElement;
      const flowStrengthValue = rootStyle.style.getPropertyValue('--sn-flow-strength').trim();
      const flowStrength = flowStrengthValue ? parseFloat(flowStrengthValue) : this.settings.flowStrength;
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
    this.canvas.style.width = displayWidth + 'px';
    this.canvas.style.height = displayHeight + 'px';
  };

  private fallbackToCSSGradient(): void {
    // Update CSS variables for fallback gradient animation
    if (this.cssVariableBatcher) {
      this.startCSSFallbackAnimation();
    }
    
    Y3K?.debug?.log('WebGLGradientBackgroundSystem', 'Using CSS gradient fallback');
  }

  private startCSSFallbackAnimation(): void {
    if (!this.cssVariableBatcher) return;

    // Animate CSS variables to simulate flow
    const animateCSS = () => {
      if (!this.isActive) return;

      const time = performance.now() / 1000;
      const flowX = Math.sin(time * 0.02) * 25; // -25% to +25%
      const flowY = Math.cos(time * 0.03) * 25;
      const scale = 1 + Math.sin(time * 0.01) * 0.15; // 1 to 1.3

      this.cssVariableBatcher.updateVariable('--sn-gradient-flow-x', `${flowX}%`);
      this.cssVariableBatcher.updateVariable('--sn-gradient-flow-y', `${flowY}%`);
      this.cssVariableBatcher.updateVariable('--sn-gradient-flow-scale', scale.toString());

      setTimeout(animateCSS, this.frameThrottleInterval);
    };

    animateCSS();
  }

  public handleSettingsChange(event: Event): void {
    super.handleSettingsChange(event);
    
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key === 'sn-flow-gradient') {
      const wasEnabled = this.settings.enabled;
      this.settings.intensity = value;
      this.loadSettings();
      
      if (value === 'disabled' && wasEnabled) {
        this.settings.enabled = false;
        this.destroy();
        this.fallbackToCSSGradient();
      } else if (this.settings.enabled && !wasEnabled && this.isWebGLAvailable) {
        // Re-initialize if going from disabled to enabled
        this.initialize();
      }
    }
  }

  _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

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

    // Remove event listeners
    if (this.boundColorHarmonyHandler) {
      document.removeEventListener('color-harmony:gradient-changed', this.boundColorHarmonyHandler);
      this.boundColorHarmonyHandler = null;
    }

    window.removeEventListener('resize', this.resize);

    this.gl = null;
  }

  public forceRepaint(reason: string = "settings-change"): void {
    if (this.isActive && this.gradientTexture) {
      this.updateGradientTexture().catch(error => {
        Y3K?.debug?.error('WebGLGradientBackgroundSystem', 'Failed to repaint gradient:', error);
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
      fps: this.performanceMonitor?.getAverageFPS() || 0,
      compileErrors: 0, // TODO: Track compilation errors
      isActive: this.isActive,
      settings: { ...this.settings }
    };
  }
}