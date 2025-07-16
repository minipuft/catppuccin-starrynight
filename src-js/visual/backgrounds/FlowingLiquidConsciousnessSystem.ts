/**
 * FlowingLiquidConsciousnessSystem - Reality Bleeding Gradients System
 * Part of the Year 3000 System visual pipeline
 * 
 * Transforms gradients into flowing liquid consciousness - breathing, pulsing aurora
 * that responds to music with directional flow patterns.
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Y3K } from "@/debug/SystemHealthMonitor";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ShaderLoader } from "@/utils/graphics/ShaderLoader";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import { WebGLGradientBackgroundSystem } from "./WebGLGradientBackgroundSystem";

// Enhanced shader with liquid consciousness flow patterns
const liquidConsciousnessShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform sampler2D u_gradientTex;
uniform vec2 u_resolution;
uniform float u_flowStrength;
uniform float u_noiseScale;

// Liquid consciousness uniforms
uniform float u_liquidPhase;
uniform float u_breathingIntensity;
uniform float u_auroraFlow;
uniform vec2 u_flowDirection;
uniform float u_liquidTurbulence;
uniform float u_consciousnessDepth;

// Music sync uniforms
uniform float u_musicEnergy;
uniform float u_musicValence;
uniform float u_beatIntensity;
uniform float u_bassResponse;

// Wave stack uniforms
uniform float u_waveY[3];
uniform float u_waveHeight[3];
uniform float u_waveOffset[3];
uniform float u_blurExp;
uniform float u_blurMax;

out vec4 fragColor;

// Improved simplex noise with liquid consciousness modifications
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
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Liquid consciousness noise with directional flow
float liquidConsciousnessNoise(vec2 uv, float timeOffset) {
  vec2 flowUV = uv;
  float adjustedTime = u_time + timeOffset;
  
  // Primary liquid flow with music-driven direction
  vec2 musicFlowDirection = normalize(u_flowDirection + vec2(
    sin(adjustedTime * 0.1 + u_musicEnergy * 2.0) * u_musicValence,
    cos(adjustedTime * 0.15 + u_musicEnergy * 1.5) * u_musicValence
  ));
  
  // Breathing effect based on consciousness depth
  float breathingPhase = sin(adjustedTime * 0.05 + u_liquidPhase) * u_breathingIntensity;
  float consciousnessWave = sin(adjustedTime * 0.02 + u_consciousnessDepth) * 0.3;
  
  // Aurora flow patterns
  flowUV += musicFlowDirection * adjustedTime * 0.03 * u_auroraFlow;
  flowUV += vec2(
    sin(adjustedTime * 0.04 + uv.y * 6.28) * breathingPhase,
    cos(adjustedTime * 0.03 + uv.x * 6.28) * breathingPhase
  ) * 0.02;
  
  // Turbulence layers for liquid consciousness
  vec2 turbulenceUV = flowUV * u_liquidTurbulence;
  float turbulence1 = snoise(turbulenceUV + adjustedTime * 0.01);
  float turbulence2 = snoise(turbulenceUV * 2.0 + adjustedTime * 0.02);
  
  // Multi-octave liquid noise
  float noise1 = snoise(flowUV * u_noiseScale + turbulence1 * 0.1);
  float noise2 = snoise(flowUV * u_noiseScale * 2.0 + turbulence2 * 0.05);
  float noise3 = snoise(flowUV * u_noiseScale * 0.5 + consciousnessWave);
  
  // Blend with music responsiveness
  float baseNoise = noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1;
  float musicModulation = u_beatIntensity * 0.2 + u_bassResponse * 0.1;
  
  return (baseNoise + musicModulation) * 0.5 + 0.5;
}

// Enhanced wave alpha with liquid consciousness breathing
float liquidWaveAlpha(vec2 uv, int waveIndex) {
  float y = uv.y;
  float waveCenter = u_waveY[waveIndex];
  float waveHeight = u_waveHeight[waveIndex];
  
  // Breathing modulation
  float breathingMod = sin(u_time * 0.1 + float(waveIndex) * 2.0) * u_breathingIntensity * 0.2;
  float adjustedWaveHeight = waveHeight * (1.0 + breathingMod);
  
  // Liquid consciousness wave distortion
  float liquidDistortion = snoise(vec2(uv.x * 8.0, u_time * 0.5)) * 0.05 * u_liquidTurbulence;
  float adjustedWaveCenter = waveCenter + liquidDistortion;
  
  float distance = abs(y - adjustedWaveCenter);
  float alpha = 1.0 - smoothstep(0.0, adjustedWaveHeight * 0.5, distance);
  
  // Aurora shimmer effect
  float shimmer = sin(u_time * 2.0 + uv.x * 20.0) * 0.1 + 0.9;
  alpha *= shimmer;
  
  return alpha;
}

// Dynamic blur with consciousness depth
float liquidBlur(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float distance = length(uv - center);
  
  // Consciousness depth affects blur
  float depthModulation = sin(u_time * 0.08 + u_consciousnessDepth) * 0.2 + 0.8;
  float adjustedBlurExp = u_blurExp * depthModulation;
  
  float blur = pow(distance, adjustedBlurExp);
  blur = clamp(blur, 0.0, u_blurMax);
  
  return blur;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  
  // Generate three liquid consciousness noise fields
  float liquidNoise1 = liquidConsciousnessNoise(uv, u_waveOffset[0]);
  float liquidNoise2 = liquidConsciousnessNoise(uv, u_waveOffset[1]);
  float liquidNoise3 = liquidConsciousnessNoise(uv, u_waveOffset[2]);
  
  // Calculate liquid wave alphas
  float alpha1 = liquidWaveAlpha(uv, 0);
  float alpha2 = liquidWaveAlpha(uv, 1);
  float alpha3 = liquidWaveAlpha(uv, 2);
  
  // Normalize alphas
  float totalAlpha = alpha1 + alpha2 + alpha3;
  if (totalAlpha > 0.0) {
    alpha1 /= totalAlpha;
    alpha2 /= totalAlpha;
    alpha3 /= totalAlpha;
  }
  
  // Blend liquid consciousness noise fields
  float t = liquidNoise1 * alpha1 + liquidNoise2 * alpha2 + liquidNoise3 * alpha3;
  t = clamp(t, 0.0, 1.0);
  
  // Sample gradient texture with liquid consciousness modulation
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));
  
  // Apply dynamic blur
  float blurAmount = liquidBlur(uv);
  
  // Liquid consciousness vignette with aurora breathing
  vec2 center = uv - 0.5;
  float breathingVignette = sin(u_time * 0.06 + u_liquidPhase) * 0.1 + 0.9;
  float vignette = breathingVignette - dot(center, center) * (0.3 + blurAmount * 0.2);
  color.rgb *= vignette;
  
  // Aurora shimmer overlay
  float shimmerPhase = u_time * 3.0 + uv.x * 15.0 + uv.y * 10.0;
  float shimmer = sin(shimmerPhase) * 0.03 + 0.97;
  color.rgb *= shimmer;
  
  // Music-responsive alpha modulation
  float musicAlpha = 0.8 + u_beatIntensity * 0.2 + u_bassResponse * 0.1;
  color.a *= musicAlpha * (1.0 - blurAmount * 0.3);
  
  fragColor = color;
}`;

interface LiquidConsciousnessSettings {
  enabled: boolean;
  liquidPhase: number;
  breathingIntensity: number;
  auroraFlow: number;
  flowDirection: [number, number];
  liquidTurbulence: number;
  consciousnessDepth: number;
}

interface LiquidConsciousnessUniforms {
  // Base uniforms from WebGL system
  u_time: WebGLUniformLocation | null;
  u_gradientTex: WebGLUniformLocation | null;
  u_resolution: WebGLUniformLocation | null;
  u_flowStrength: WebGLUniformLocation | null;
  u_noiseScale: WebGLUniformLocation | null;
  
  // Liquid consciousness uniforms
  u_liquidPhase: WebGLUniformLocation | null;
  u_breathingIntensity: WebGLUniformLocation | null;
  u_auroraFlow: WebGLUniformLocation | null;
  u_flowDirection: WebGLUniformLocation | null;
  u_liquidTurbulence: WebGLUniformLocation | null;
  u_consciousnessDepth: WebGLUniformLocation | null;
  
  // Music sync uniforms
  u_musicEnergy: WebGLUniformLocation | null;
  u_musicValence: WebGLUniformLocation | null;
  u_beatIntensity: WebGLUniformLocation | null;
  u_bassResponse: WebGLUniformLocation | null;
  
  // Wave stack uniforms (enhanced)
  u_waveY: WebGLUniformLocation | null;
  u_waveHeight: WebGLUniformLocation | null;
  u_waveOffset: WebGLUniformLocation | null;
  u_blurExp: WebGLUniformLocation | null;
  u_blurMax: WebGLUniformLocation | null;
}

/**
 * FlowingLiquidConsciousnessSystem extends WebGL gradients with liquid consciousness
 * - Breathing, pulsing aurora effects
 * - Music-responsive directional flow
 * - Liquid turbulence and consciousness depth
 * - Performance-optimized with CSS fallback
 */
export class FlowingLiquidConsciousnessSystem extends BaseVisualSystem {
  private webglGradientSystem: WebGLGradientBackgroundSystem;
  private liquidUniforms: LiquidConsciousnessUniforms;
  private liquidSettings: LiquidConsciousnessSettings;
  private shaderProgram: WebGLProgram | null = null;
  private gl: WebGL2RenderingContext | null = null;
  
  private musicSyncBound: ((event: Event) => void) | null = null;
  private animationPhase = 0;
  private lastMusicUpdate = 0;
  
  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    // Initialize base WebGL gradient system
    this.webglGradientSystem = new WebGLGradientBackgroundSystem(
      config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System
    );
    
    // Initialize liquid consciousness settings
    this.liquidSettings = {
      enabled: true,
      liquidPhase: 0,
      breathingIntensity: 0.8,
      auroraFlow: 0.6,
      flowDirection: [1.0, 0.5],
      liquidTurbulence: 1.2,
      consciousnessDepth: 0.7
    };
    
    // Initialize uniform locations
    this.liquidUniforms = {
      u_time: null,
      u_gradientTex: null,
      u_resolution: null,
      u_flowStrength: null,
      u_noiseScale: null,
      u_liquidPhase: null,
      u_breathingIntensity: null,
      u_auroraFlow: null,
      u_flowDirection: null,
      u_liquidTurbulence: null,
      u_consciousnessDepth: null,
      u_musicEnergy: null,
      u_musicValence: null,
      u_beatIntensity: null,
      u_bassResponse: null,
      u_waveY: null,
      u_waveHeight: null,
      u_waveOffset: null,
      u_blurExp: null,
      u_blurMax: null
    };
    
    // Bind event handlers
    this.musicSyncBound = this.handleMusicSync.bind(this);
  }
  
  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    // Initialize base WebGL system first
    await this.webglGradientSystem.initialize();
    
    // Get WebGL context from base system
    this.gl = (this.webglGradientSystem as any).gl;
    
    if (!this.gl) {
      Y3K?.debug?.log("FlowingLiquidConsciousnessSystem", "WebGL not available, using base system");
      return;
    }
    
    try {
      // Compile liquid consciousness shader
      await this.compileLiquidShader();
      
      // Setup liquid consciousness uniforms
      this.setupLiquidUniforms();
      
      // Subscribe to music sync events
      this.subscribeToMusicSync();
      
      Y3K?.debug?.log("FlowingLiquidConsciousnessSystem", "Liquid consciousness system initialized");
      
    } catch (error) {
      Y3K?.debug?.error("FlowingLiquidConsciousnessSystem", "Failed to initialize liquid consciousness:", error);
      // Fallback to base WebGL system
    }
  }
  
  private async compileLiquidShader(): Promise<void> {
    if (!this.gl) throw new Error("WebGL context not available");
    
    const vertexShader = ShaderLoader.loadVertex(this.gl, `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `);
    
    const fragmentShader = ShaderLoader.loadFragment(this.gl, liquidConsciousnessShader);
    
    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to compile liquid consciousness shaders");
    }
    
    this.shaderProgram = ShaderLoader.createProgram(this.gl, vertexShader, fragmentShader);
    
    if (!this.shaderProgram) {
      throw new Error("Failed to create liquid consciousness shader program");
    }
  }
  
  private setupLiquidUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;
    
    // Get all uniform locations
    const uniformNames = [
      'u_time', 'u_gradientTex', 'u_resolution', 'u_flowStrength', 'u_noiseScale',
      'u_liquidPhase', 'u_breathingIntensity', 'u_auroraFlow', 'u_flowDirection',
      'u_liquidTurbulence', 'u_consciousnessDepth', 'u_musicEnergy', 'u_musicValence',
      'u_beatIntensity', 'u_bassResponse', 'u_waveY', 'u_waveHeight', 'u_waveOffset',
      'u_blurExp', 'u_blurMax'
    ];
    
    uniformNames.forEach(name => {
      (this.liquidUniforms as any)[name] = this.gl!.getUniformLocation(this.shaderProgram!, name);
    });
  }
  
  private subscribeToMusicSync(): void {
    if (this.musicSyncBound) {
      document.addEventListener('music-sync:beat', this.musicSyncBound);
      document.addEventListener('music-sync:energy-changed', this.musicSyncBound);
      document.addEventListener('music-sync:valence-changed', this.musicSyncBound);
    }
  }
  
  private handleMusicSync(event: Event): void {
    const currentTime = performance.now();
    
    // Throttle music updates to 30fps
    if (currentTime - this.lastMusicUpdate < 33) return;
    this.lastMusicUpdate = currentTime;
    
    const customEvent = event as CustomEvent;
    const { type, detail } = customEvent;
    
    switch (type) {
      case 'music-sync:beat':
        this.animationPhase += 0.1;
        this.updateFlowDirection(detail.intensity || 0.5);
        break;
        
      case 'music-sync:energy-changed':
        this.liquidSettings.breathingIntensity = 0.5 + (detail.energy || 0) * 0.5;
        break;
        
      case 'music-sync:valence-changed':
        this.liquidSettings.auroraFlow = 0.4 + (detail.valence || 0) * 0.6;
        break;
    }
  }
  
  private updateFlowDirection(intensity: number): void {
    // Create flowing directional patterns based on music
    const phase = this.animationPhase;
    this.liquidSettings.flowDirection = [
      Math.sin(phase * 0.3) * intensity,
      Math.cos(phase * 0.2) * intensity
    ];
  }
  
  public override updateAnimation(deltaTime: number): void {
    // Update base WebGL system
    this.webglGradientSystem?.updateAnimation?.(performance.now(), deltaTime);
    
    // Update liquid consciousness phase
    this.liquidSettings.liquidPhase += deltaTime * 0.001;
    this.liquidSettings.consciousnessDepth = 0.5 + Math.sin(this.liquidSettings.liquidPhase * 0.5) * 0.3;
    
    // Update liquid consciousness uniforms if shader is active
    if (this.gl && this.shaderProgram) {
      this.updateLiquidUniforms();
    }
  }
  
  private updateLiquidUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;
    
    this.gl.useProgram(this.shaderProgram);
    
    // Update liquid consciousness uniforms
    if (this.liquidUniforms.u_liquidPhase) {
      this.gl.uniform1f(this.liquidUniforms.u_liquidPhase, this.liquidSettings.liquidPhase);
    }
    
    if (this.liquidUniforms.u_breathingIntensity) {
      this.gl.uniform1f(this.liquidUniforms.u_breathingIntensity, this.liquidSettings.breathingIntensity);
    }
    
    if (this.liquidUniforms.u_auroraFlow) {
      this.gl.uniform1f(this.liquidUniforms.u_auroraFlow, this.liquidSettings.auroraFlow);
    }
    
    if (this.liquidUniforms.u_flowDirection) {
      this.gl.uniform2fv(this.liquidUniforms.u_flowDirection, this.liquidSettings.flowDirection);
    }
    
    if (this.liquidUniforms.u_liquidTurbulence) {
      this.gl.uniform1f(this.liquidUniforms.u_liquidTurbulence, this.liquidSettings.liquidTurbulence);
    }
    
    if (this.liquidUniforms.u_consciousnessDepth) {
      this.gl.uniform1f(this.liquidUniforms.u_consciousnessDepth, this.liquidSettings.consciousnessDepth);
    }
    
    // Update music sync uniforms
    this.updateMusicUniforms();
  }
  
  private updateMusicUniforms(): void {
    if (!this.gl || !this.musicSyncService) return;
    
    // Get current music state from latest processed data
    const latestData = this.musicSyncService.getLatestProcessedData?.() || {};
    const musicEnergy = latestData.energy || 0;
    const musicValence = latestData.valence || 0;
    const beatIntensity = latestData.beatIntensity || 0;
    const bassResponse = latestData.bassResponse || 0;
    
    if (this.liquidUniforms.u_musicEnergy) {
      this.gl.uniform1f(this.liquidUniforms.u_musicEnergy, musicEnergy);
    }
    
    if (this.liquidUniforms.u_musicValence) {
      this.gl.uniform1f(this.liquidUniforms.u_musicValence, musicValence);
    }
    
    if (this.liquidUniforms.u_beatIntensity) {
      this.gl.uniform1f(this.liquidUniforms.u_beatIntensity, beatIntensity);
    }
    
    if (this.liquidUniforms.u_bassResponse) {
      this.gl.uniform1f(this.liquidUniforms.u_bassResponse, bassResponse);
    }
  }
  
  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    const baseHealth = await this.webglGradientSystem?.healthCheck?.() || { ok: true, details: 'WebGL system not initialized' };
    
    if (!baseHealth.ok) {
      return baseHealth;
    }
    
    return {
      ok: this.liquidSettings.enabled && this.shaderProgram !== null,
      details: this.liquidSettings.enabled ? "Liquid consciousness active" : "Liquid consciousness disabled"
    };
  }
  
  public override forceRepaint(reason: string = "liquid-consciousness-update"): void {
    this.webglGradientSystem.forceRepaint(reason);
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Clean up music sync event listeners
    if (this.musicSyncBound) {
      document.removeEventListener('music-sync:beat', this.musicSyncBound);
      document.removeEventListener('music-sync:energy-changed', this.musicSyncBound);
      document.removeEventListener('music-sync:valence-changed', this.musicSyncBound);
      this.musicSyncBound = null;
    }
    
    // Clean up liquid consciousness shader
    if (this.gl && this.shaderProgram) {
      this.gl.deleteProgram(this.shaderProgram);
      this.shaderProgram = null;
    }
    
    // Clean up base WebGL system
    this.webglGradientSystem.destroy();
  }
  
  // Public API for liquid consciousness control
  public setLiquidPhase(phase: number): void {
    this.liquidSettings.liquidPhase = phase;
  }
  
  public setBreathingIntensity(intensity: number): void {
    this.liquidSettings.breathingIntensity = Math.max(0, Math.min(1, intensity));
  }
  
  public setAuroraFlow(flow: number): void {
    this.liquidSettings.auroraFlow = Math.max(0, Math.min(1, flow));
  }
  
  public setFlowDirection(x: number, y: number): void {
    this.liquidSettings.flowDirection = [x, y];
  }
  
  public setLiquidTurbulence(turbulence: number): void {
    this.liquidSettings.liquidTurbulence = Math.max(0, Math.min(2, turbulence));
  }
  
  public setConsciousnessDepth(depth: number): void {
    this.liquidSettings.consciousnessDepth = Math.max(0, Math.min(1, depth));
  }
  
  public getLiquidSettings(): LiquidConsciousnessSettings {
    return { ...this.liquidSettings };
  }
}