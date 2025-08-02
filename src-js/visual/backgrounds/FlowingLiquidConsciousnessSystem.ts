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
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ShaderLoader } from "@/utils/graphics/ShaderLoader";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import { WebGLGradientBackgroundSystem } from "./WebGLGradientBackgroundSystem";
import type { BackgroundConsciousnessChoreographer } from "../consciousness/BackgroundConsciousnessChoreographer";
import type { ConsciousnessField, BackgroundSystemParticipant } from "../consciousness/BackgroundConsciousnessChoreographer";
import { unifiedEventBus, type EventData } from "@/core/events/UnifiedEventBus";
import type { QualityScalingCapable, QualityLevel, QualityCapability, PerformanceMetrics } from "@/core/performance/PerformanceOrchestrator";

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
  
  // Quality scaling properties
  flowIntensity: number;
  turbulenceScale: number;
  colorMixingStrength: number;
  animationSpeed: number;
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
export class FlowingLiquidConsciousnessSystem extends BaseVisualSystem implements BackgroundSystemParticipant, QualityScalingCapable {
  private webglGradientSystem: WebGLGradientBackgroundSystem;
  private liquidUniforms: LiquidConsciousnessUniforms;
  private liquidSettings: LiquidConsciousnessSettings;
  private shaderProgram: WebGLProgram | null = null;
  private gl: WebGL2RenderingContext | null = null;
  
  // Unified event subscriptions
  private eventSubscriptionIds: string[] = [];
  private animationPhase = 0;
  private lastMusicUpdate = 0;
  
  // Consciousness choreographer integration
  private consciousnessChoreographer: BackgroundConsciousnessChoreographer | null = null;
  private currentConsciousnessField: ConsciousnessField | null = null;
  
  // Make systemName publicly accessible for the interface
  public override readonly systemName: string = 'FlowingLiquidConsciousnessSystem';
  
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
    
    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer = year3000System?.backgroundConsciousnessChoreographer || null;
    
    // Initialize liquid consciousness settings
    this.liquidSettings = {
      enabled: true,
      liquidPhase: 0,
      breathingIntensity: 0.8,
      auroraFlow: 0.6,
      flowDirection: [1.0, 0.5],
      liquidTurbulence: 1.2,
      consciousnessDepth: 0.7,
      
      // Quality scaling properties (defaults to medium quality)
      flowIntensity: 0.7,
      turbulenceScale: 0.9,
      colorMixingStrength: 0.8,
      animationSpeed: 1.0
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
    
    // Event subscriptions will be set up during initialization
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
      
      // Subscribe to unified events
      this.subscribeToUnifiedEvents();
      
      // Register with consciousness choreographer
      this.registerWithConsciousnessChoreographer();
      
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
  
  private subscribeToUnifiedEvents(): void {
    // Subscribe to music beat events
    const beatSubscription = unifiedEventBus.subscribe(
      'music:beat',
      this.handleMusicBeat.bind(this),
      'FlowingLiquidConsciousnessSystem'
    );
    this.eventSubscriptionIds.push(beatSubscription);
    
    // Subscribe to music energy events
    const energySubscription = unifiedEventBus.subscribe(
      'music:energy',
      this.handleMusicEnergy.bind(this),
      'FlowingLiquidConsciousnessSystem'
    );
    this.eventSubscriptionIds.push(energySubscription);
    
    // Subscribe to music state changes
    const stateSubscription = unifiedEventBus.subscribe(
      'music:state-changed',
      this.handleMusicStateChange.bind(this),
      'FlowingLiquidConsciousnessSystem'
    );
    this.eventSubscriptionIds.push(stateSubscription);
    
    // Subscribe to color events for coordination
    const colorSubscription = unifiedEventBus.subscribe(
      'colors:harmonized',
      this.handleColorHarmonized.bind(this),
      'FlowingLiquidConsciousnessSystem'
    );
    this.eventSubscriptionIds.push(colorSubscription);
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Subscribed to unified events', {
      subscriptionCount: this.eventSubscriptionIds.length
    });
  }
  
  private handleMusicBeat(data: EventData<'music:beat'>): void {
    const currentTime = performance.now();
    
    // Throttle music updates to 30fps
    if (currentTime - this.lastMusicUpdate < 33) return;
    this.lastMusicUpdate = currentTime;
    
    this.animationPhase += 0.1;
    this.updateFlowDirection(data.intensity);
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Music beat processed', {
      bpm: data.bpm,
      intensity: data.intensity,
      confidence: data.confidence
    });
  }
  
  private handleMusicEnergy(data: EventData<'music:energy'>): void {
    this.liquidSettings.breathingIntensity = 0.5 + data.energy * 0.5;
    this.liquidSettings.auroraFlow = 0.4 + data.valence * 0.6;
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Music energy processed', {
      energy: data.energy,
      valence: data.valence,
      tempo: data.tempo
    });
  }
  
  private handleMusicStateChange(data: EventData<'music:state-changed'>): void {
    // Adjust liquid consciousness based on playback state
    if (data.isPlaying) {
      this.liquidSettings.consciousnessDepth = Math.max(0.7, this.liquidSettings.consciousnessDepth);
    } else {
      this.liquidSettings.consciousnessDepth = Math.min(0.3, this.liquidSettings.consciousnessDepth);
    }
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Music state change processed', {
      isPlaying: data.isPlaying,
      position: data.position,
      duration: data.duration
    });
  }
  
  private handleColorHarmonized(data: EventData<'colors:harmonized'>): void {
    // Coordinate liquid consciousness with color processing
    // Adjust turbulence based on processing complexity
    const strategyCount = data.strategies.length;
    this.liquidSettings.liquidTurbulence = Math.max(0.8, Math.min(1.5, strategyCount * 0.3));
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Color harmonization processed', {
      strategies: data.strategies,
      processingTime: data.processingTime,
      turbulenceAdjustment: this.liquidSettings.liquidTurbulence
    });
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

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  public setQualityLevel(level: QualityLevel): void {
    // Update liquid consciousness quality settings based on performance level
    switch (level.level) {
      case 'minimal':
        this.liquidSettings.flowIntensity = 0.3;
        this.liquidSettings.turbulenceScale = 0.5;
        this.liquidSettings.colorMixingStrength = 0.4;
        this.liquidSettings.animationSpeed = 0.6;
        break;
      case 'low':
        this.liquidSettings.flowIntensity = 0.5;
        this.liquidSettings.turbulenceScale = 0.7;
        this.liquidSettings.colorMixingStrength = 0.6;
        this.liquidSettings.animationSpeed = 0.8;
        break;
      case 'medium':
        this.liquidSettings.flowIntensity = 0.7;
        this.liquidSettings.turbulenceScale = 0.9;
        this.liquidSettings.colorMixingStrength = 0.8;
        this.liquidSettings.animationSpeed = 1.0;
        break;
      case 'high':
        this.liquidSettings.flowIntensity = 0.9;
        this.liquidSettings.turbulenceScale = 1.1;
        this.liquidSettings.colorMixingStrength = 1.0;
        this.liquidSettings.animationSpeed = 1.2;
        break;
      case 'ultra':
        this.liquidSettings.flowIntensity = 1.0;
        this.liquidSettings.turbulenceScale = 1.3;
        this.liquidSettings.colorMixingStrength = 1.2;
        this.liquidSettings.animationSpeed = 1.4;
        break;
    }

    // Apply settings to WebGL system
    this.webglGradientSystem.setQualityLevel(level);
    
    if (YEAR3000_CONFIG.enableDebug) {
      Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', `Quality level set to: ${level.level}`, this.liquidSettings);
    }
  }

  public getPerformanceImpact(): PerformanceMetrics {
    const baseMetrics = this.webglGradientSystem.getPerformanceImpact();
    
    // Add liquid consciousness overhead
    return {
      ...baseMetrics,
      memoryUsageMB: baseMetrics.memoryUsageMB + 5, // Additional shader complexity
      cpuUsagePercent: baseMetrics.cpuUsagePercent + 3, // Additional uniforms processing
      renderTime: baseMetrics.renderTime + 1.2 // Additional render complexity
    };
  }

  public reduceQuality(amount: number): void {
    // Reduce liquid consciousness quality proportionally
    this.liquidSettings.flowIntensity = Math.max(0.1, this.liquidSettings.flowIntensity - (amount * 0.3));
    this.liquidSettings.turbulenceScale = Math.max(0.2, this.liquidSettings.turbulenceScale - (amount * 0.4));
    this.liquidSettings.colorMixingStrength = Math.max(0.2, this.liquidSettings.colorMixingStrength - (amount * 0.3));
    this.liquidSettings.animationSpeed = Math.max(0.3, this.liquidSettings.animationSpeed - (amount * 0.5));
    
    // Forward to WebGL system
    this.webglGradientSystem.reduceQuality(amount);
  }

  public increaseQuality(amount: number): void {
    // Increase liquid consciousness quality proportionally
    this.liquidSettings.flowIntensity = Math.min(1.0, this.liquidSettings.flowIntensity + (amount * 0.2));
    this.liquidSettings.turbulenceScale = Math.min(1.5, this.liquidSettings.turbulenceScale + (amount * 0.3));
    this.liquidSettings.colorMixingStrength = Math.min(1.2, this.liquidSettings.colorMixingStrength + (amount * 0.2));
    this.liquidSettings.animationSpeed = Math.min(1.6, this.liquidSettings.animationSpeed + (amount * 0.3));
    
    // Forward to WebGL system
    this.webglGradientSystem.increaseQuality(amount);
  }

  public getQualityCapabilities(): QualityCapability[] {
    return [
      {
        name: 'liquid-flow-intensity',
        impact: 'medium',
        enabled: this.liquidSettings.flowIntensity > 0.5,
        canToggle: true
      },
      {
        name: 'turbulence-complexity',
        impact: 'high',
        enabled: this.liquidSettings.turbulenceScale > 0.8,
        canToggle: true
      },
      {
        name: 'color-mixing-quality',
        impact: 'low',
        enabled: this.liquidSettings.colorMixingStrength > 0.7,
        canToggle: true
      },
      {
        name: 'animation-smoothness',
        impact: 'medium',
        enabled: this.liquidSettings.animationSpeed > 1.0,
        canToggle: true
      }
    ];
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant('FlowingLiquidConsciousnessSystem');
        Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Unregistered from consciousness choreographer');
      } catch (error) {
        Y3K?.debug?.error('FlowingLiquidConsciousnessSystem', 'Error unregistering from consciousness choreographer:', error);
      }
    }
    
    // Clean up unified event subscriptions
    this.eventSubscriptionIds.forEach(subscriptionId => {
      unifiedEventBus.unsubscribe(subscriptionId);
    });
    this.eventSubscriptionIds = [];
    
    Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Unified event subscriptions cleaned up');
    
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
  
  // ===================================================================
  // CONSCIOUSNESS CHOREOGRAPHER INTEGRATION
  // ===================================================================
  
  /**
   * Register this liquid system as a consciousness participant
   */
  private registerWithConsciousnessChoreographer(): void {
    if (!this.consciousnessChoreographer) {
      Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Consciousness choreographer not available, skipping registration');
      return;
    }
    
    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Successfully registered with consciousness choreographer');
    } catch (error) {
      Y3K?.debug?.error('FlowingLiquidConsciousnessSystem', 'Failed to register with consciousness choreographer:', error);
    }
  }
  
  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================
  
  public get systemPriority(): 'low' | 'normal' | 'high' | 'critical' {
    return 'high'; // Liquid consciousness is high priority for organic effects
  }
  
  public getConsciousnessContribution(): any {
    return {
      liquidDensity: this.liquidSettings.liquidTurbulence || 0.5,
      fluidDynamics: this.liquidSettings.auroraFlow || 0.6,
      membraneFluidityIndex: this.liquidSettings.breathingIntensity || 0.8,
      turbulenceLevel: this.liquidSettings.liquidTurbulence || 0.5,
      viscosityIndex: 1.0,
      flowPatterns: ['aurora', 'liquid', 'consciousness']
    };
  }
  
  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    if (!this.gl || !this.shaderProgram) return;
    
    try {
      this.currentConsciousnessField = field;
      
      // Update liquid shader parameters based on consciousness field
      this.updateLiquidFromConsciousness(field);
      
      Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', 'Updated from consciousness field:', {
        rhythmicPulse: field.rhythmicPulse,
        liquidDensity: field.liquidDensity,
        membraneFluidityIndex: field.membraneFluidityIndex
      });
    } catch (error) {
      Y3K?.debug?.error('FlowingLiquidConsciousnessSystem', 'Error updating from consciousness field:', error);
    }
  }
  
  public onChoreographyEvent(eventType: string, payload: any): void {
    if (!this.gl || !this.shaderProgram) return;
    
    try {
      switch (eventType) {
        case 'choreography:rhythm-shift':
          // Adjust liquid flow patterns based on rhythm changes
          const newRhythm = payload.newRhythm?.bpm || 120;
          this.liquidSettings.auroraFlow = Math.max(0.2, Math.min(1.0, newRhythm / 120));
          break;
          
        case 'choreography:energy-surge':
          // Intensify liquid turbulence during energy surges
          const surgeIntensity = payload.intensity || 1.0;
          this.liquidSettings.liquidTurbulence = Math.min(1.0, this.liquidSettings.liquidTurbulence * (1.0 + surgeIntensity * 0.5));
          break;
          
        case 'consciousness:breathing-cycle':
          // Synchronize liquid breathing with consciousness breathing
          const breathingPhase = payload.phase || 0;
          this.liquidSettings.breathingIntensity = 0.5 + (Math.sin(breathingPhase * Math.PI * 2) * 0.3);
          break;
          
        case 'consciousness:membrane-fluid':
          // Adjust membrane fluidity
          const fluidityIndex = payload.fluidityIndex || 0.5;
          this.liquidSettings.consciousnessDepth = fluidityIndex;
          break;
      }
      
      // Apply changes to shader
      if (this.currentConsciousnessField) {
        this.updateLiquidFromConsciousness(this.currentConsciousnessField);
      }
      
      Y3K?.debug?.log('FlowingLiquidConsciousnessSystem', `Handled choreography event: ${eventType}`, payload);
    } catch (error) {
      Y3K?.debug?.error('FlowingLiquidConsciousnessSystem', `Error handling choreography event ${eventType}:`, error);
    }
  }
  
  /**
   * Update liquid shader parameters based on consciousness field
   */
  private updateLiquidFromConsciousness(field: ConsciousnessField): void {
    if (!this.gl || !this.shaderProgram) return;
    
    // Modulate liquid phase with rhythmic pulse
    const consciousLiquidPhase = this.liquidSettings.liquidPhase + field.rhythmicPulse * 0.5;
    const liquidPhaseLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_liquidPhase');
    if (liquidPhaseLocation) {
      this.gl.uniform1f(liquidPhaseLocation, consciousLiquidPhase);
    }
    
    // Modulate breathing intensity with consciousness breathing cycle
    const consciousBreathing = this.liquidSettings.breathingIntensity * (0.7 + field.breathingCycle * 0.3);
    const breathingLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_breathingIntensity');
    if (breathingLocation) {
      this.gl.uniform1f(breathingLocation, consciousBreathing);
    }
    
    // Update aurora flow with musical flow direction
    const auroraFlowLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_auroraFlow');
    if (auroraFlowLocation) {
      this.gl.uniform1f(auroraFlowLocation, this.liquidSettings.auroraFlow * (0.8 + field.musicalFlow.x * 0.4));
    }
    
    // Update flow direction based on musical flow
    const flowDirectionLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_flowDirection');
    if (flowDirectionLocation) {
      this.gl.uniform2f(flowDirectionLocation, field.musicalFlow.x, field.musicalFlow.y);
    }
    
    // Update liquid turbulence with energy resonance
    const turbulenceLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_liquidTurbulence');
    if (turbulenceLocation) {
      const consciousTurbulence = this.liquidSettings.liquidTurbulence * (0.5 + field.energyResonance * 0.5);
      this.gl.uniform1f(turbulenceLocation, consciousTurbulence);
    }
    
    // Update consciousness depth with membrane fluidity
    const depthLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_consciousnessDepth');
    if (depthLocation) {
      this.gl.uniform1f(depthLocation, field.membraneFluidityIndex);
    }
    
    // Apply consciousness-aware CSS variables for hybrid coordination
    const cssController = UnifiedCSSConsciousnessController.getInstance();
    if (cssController) {
      cssController.queueCSSVariableUpdate('--sn-liquid-consciousness-phase', consciousLiquidPhase.toString());
      cssController.queueCSSVariableUpdate('--sn-liquid-breathing-intensity', consciousBreathing.toString());
      cssController.queueCSSVariableUpdate('--sn-liquid-aurora-flow', this.liquidSettings.auroraFlow.toString());
      cssController.queueCSSVariableUpdate('--sn-liquid-turbulence', this.liquidSettings.liquidTurbulence.toString());
    }
  }
}