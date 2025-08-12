/**
 * FluidGradientBackgroundSystem - Reality Bleeding Gradients System
 * Part of the Year 3000 System visual pipeline
 *
 * Transforms gradients into flowing liquid consciousness - breathing, pulsing aurora
 * that responds to music with directional flow patterns.
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { unifiedEventBus, type EventData } from "@/core/events/UnifiedEventBus";
import { SimplePerformanceCoordinator, type QualityLevel, type QualityScalingCapable, type PerformanceMetrics, type QualityCapability } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { ShaderLoader } from "@/utils/graphics/ShaderLoader";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type {
  BackgroundAnimationCoordinator,
  BackgroundSystemParticipant,
  ConsciousnessField,
} from "../effects/BackgroundAnimationCoordinator";
import { WebGLGradientBackgroundSystem } from "../background/WebGLRenderer";

// Enhanced shader with advanced liquid consciousness flow patterns
const liquidConsciousnessShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform sampler2D u_gradientTex;
uniform vec2 u_resolution;
uniform float u_flowStrength;
uniform float u_noiseScale;

// Enhanced liquid consciousness uniforms
uniform float u_liquidPhase;
uniform float u_breathingIntensity;
uniform float u_auroraFlow;
uniform vec2 u_flowDirection;
uniform float u_liquidTurbulence;
uniform float u_consciousnessDepth;

// Advanced liquid physics uniforms
uniform float u_surfaceTension;
uniform float u_viscosity;
uniform float u_liquidGravity;
uniform float u_particleDensity;
uniform float u_fluidDynamics;
uniform float u_membraneElasticity;
uniform vec2 u_liquidVelocity;
uniform float u_consciousnessTemperature;

// Music sync uniforms
uniform float u_musicEnergy;
uniform float u_musicValence;
uniform float u_beatIntensity;
uniform float u_bassResponse;
uniform float u_genreInfluence;
uniform float u_emotionalTemperature;

// Multi-layer consciousness uniforms
uniform float u_consciousnessLevel;
uniform float u_awarenessLevel;
uniform float u_memoryIntensity;
uniform float u_temporalFlowStrength;

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

// Advanced liquid physics simulation functions
float calculateSurfaceTension(vec2 uv, float baseValue) {
  // Surface tension creates natural droplet boundaries
  float distance = length(uv - 0.5);
  float tensionEffect = smoothstep(0.3, 0.7, distance) * u_surfaceTension;
  return baseValue * (1.0 + tensionEffect * 0.3);
}

vec2 calculateViscosityFlow(vec2 uv, vec2 baseFlow, float timeOffset) {
  // Viscosity affects flow resistance and creates more organic movement
  float viscosityResistance = 1.0 - u_viscosity * 0.8;
  vec2 viscousFlow = baseFlow * viscosityResistance;
  
  // Add viscous swirl patterns
  float swirl = sin(u_time * 0.1 + timeOffset + length(uv - 0.5) * 10.0) * u_viscosity * 0.2;
  viscousFlow += vec2(-swirl * (uv.y - 0.5), swirl * (uv.x - 0.5));
  
  return viscousFlow;
}

float simulateGravityEffect(vec2 uv, float baseIntensity) {
  // Gravity creates natural settling patterns
  float gravityInfluence = (1.0 - uv.y) * u_liquidGravity;
  float settlingPattern = sin(u_time * 0.05 + uv.x * 5.0) * gravityInfluence * 0.1;
  return baseIntensity + settlingPattern;
}

// Enhanced liquid consciousness noise with advanced physics
float liquidConsciousnessNoise(vec2 uv, float timeOffset) {
  vec2 flowUV = uv;
  float adjustedTime = u_time + timeOffset;

  // Enhanced liquid flow with physics simulation
  vec2 musicFlowDirection = normalize(u_flowDirection + vec2(
    sin(adjustedTime * 0.1 + u_musicEnergy * 2.0) * u_musicValence,
    cos(adjustedTime * 0.15 + u_musicEnergy * 1.5) * u_musicValence
  ));
  
  // Apply viscosity to flow
  vec2 viscousFlow = calculateViscosityFlow(uv, musicFlowDirection, timeOffset);
  
  // Add liquid velocity for momentum
  viscousFlow += u_liquidVelocity * 0.5;

  // Enhanced breathing effect with consciousness depth
  float breathingPhase = sin(adjustedTime * 0.05 + u_liquidPhase) * u_breathingIntensity;
  float consciousnessWave = sin(adjustedTime * 0.02 + u_consciousnessDepth) * 0.3;
  
  // Consciousness memory patterns
  float memoryPattern = sin(adjustedTime * 0.008 + u_memoryIntensity * 5.0) * 0.15;
  
  // Temporal flow effects
  float temporalDistortion = sin(adjustedTime * 0.12 + u_temporalFlowStrength * 3.0) * 0.1;

  // Aurora flow patterns with enhanced physics
  flowUV += viscousFlow * adjustedTime * 0.03 * u_auroraFlow;
  flowUV += vec2(
    sin(adjustedTime * 0.04 + uv.y * 6.28) * (breathingPhase + memoryPattern),
    cos(adjustedTime * 0.03 + uv.x * 6.28) * (breathingPhase + temporalDistortion)
  ) * 0.02;

  // Enhanced turbulence with particle density
  vec2 turbulenceUV = flowUV * u_liquidTurbulence;
  float particleInfluence = u_particleDensity * 0.3;
  float turbulence1 = snoise(turbulenceUV + adjustedTime * 0.01) * (1.0 + particleInfluence);
  float turbulence2 = snoise(turbulenceUV * 2.0 + adjustedTime * 0.02) * (1.0 + particleInfluence * 0.5);
  
  // Fluid dynamics creates more complex flow patterns
  float fluidDynamicsEffect = snoise(flowUV * 3.0 + adjustedTime * 0.005) * u_fluidDynamics;

  // Multi-octave liquid noise with consciousness layers
  float noise1 = snoise(flowUV * u_noiseScale + turbulence1 * 0.1) * u_consciousnessLevel;
  float noise2 = snoise(flowUV * u_noiseScale * 2.0 + turbulence2 * 0.05) * u_awarenessLevel;
  float noise3 = snoise(flowUV * u_noiseScale * 0.5 + consciousnessWave) * (1.0 - u_consciousnessLevel * 0.3);
  float memoryNoise = snoise(flowUV * u_noiseScale * 1.5 + memoryPattern) * u_memoryIntensity * 0.3;

  // Apply surface tension effects
  float surfaceTensionEffect = calculateSurfaceTension(uv, 1.0);
  
  // Apply gravity settling
  float gravityEffect = simulateGravityEffect(uv, 1.0);

  // Blend with enhanced music and consciousness responsiveness
  float baseNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.2 + memoryNoise * 0.1) * surfaceTensionEffect * gravityEffect;
  baseNoise += fluidDynamicsEffect * 0.1;
  
  // Enhanced musical modulation with genre influence
  float musicModulation = u_beatIntensity * 0.2 + u_bassResponse * 0.1 + u_genreInfluence * 0.05;
  
  // Emotional temperature affects liquid characteristics
  float temperatureEffect = mix(0.8, 1.2, u_emotionalTemperature);

  return clamp((baseNoise + musicModulation) * temperatureEffect * 0.5 + 0.5, 0.0, 1.0);
}

// Advanced liquid wave physics with membrane elasticity
float liquidWaveAlpha(vec2 uv, int waveIndex) {
  float y = uv.y;
  float waveCenter = u_waveY[waveIndex];
  float waveHeight = u_waveHeight[waveIndex];

  // Enhanced breathing modulation with consciousness memory
  float breathingMod = sin(u_time * 0.1 + float(waveIndex) * 2.0) * u_breathingIntensity * 0.2;
  float consciousnessBreathing = sin(u_time * 0.06 + u_consciousnessLevel * 3.0) * 0.15;
  float memoryBreathing = sin(u_time * 0.04 + u_memoryIntensity * 2.0) * 0.1;
  
  float totalBreathing = breathingMod + consciousnessBreathing + memoryBreathing;
  float adjustedWaveHeight = waveHeight * (1.0 + totalBreathing);

  // Enhanced liquid distortion with membrane elasticity
  float membraneElastic = snoise(vec2(uv.x * 6.0 + u_time * 0.3, uv.y * 4.0)) * u_membraneElasticity * 0.08;
  float liquidDistortion = snoise(vec2(uv.x * 8.0, u_time * 0.5)) * 0.05 * u_liquidTurbulence;
  float fluidDeformation = sin(uv.x * 10.0 + u_time * 0.7) * u_fluidDynamics * 0.03;
  
  float totalDistortion = liquidDistortion + membraneElastic + fluidDeformation;
  float adjustedWaveCenter = waveCenter + totalDistortion;

  // Surface tension creates natural wave boundaries
  float distance = abs(y - adjustedWaveCenter);
  float tensionSmoothness = mix(0.3, 0.7, u_surfaceTension);
  float alpha = 1.0 - smoothstep(0.0, adjustedWaveHeight * tensionSmoothness, distance);

  // Enhanced shimmer with consciousness and emotional temperature
  float baseShimmer = sin(u_time * 2.0 + uv.x * 20.0) * 0.1 + 0.9;
  float consciousnessShimmer = sin(u_time * 1.5 + uv.y * 15.0 + u_consciousnessLevel * 5.0) * 0.05 + 0.975;
  float temperatureShimmer = mix(0.95, 1.05, u_emotionalTemperature);
  
  alpha *= baseShimmer * consciousnessShimmer * temperatureShimmer;

  // Viscosity affects wave edge softness
  alpha = mix(alpha, smoothstep(0.2, 0.8, alpha), u_viscosity);

  return clamp(alpha, 0.0, 1.0);
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

  // Generate enhanced liquid consciousness noise fields with physics
  float liquidNoise1 = liquidConsciousnessNoise(uv, u_waveOffset[0]);
  float liquidNoise2 = liquidConsciousnessNoise(uv, u_waveOffset[1]);
  float liquidNoise3 = liquidConsciousnessNoise(uv, u_waveOffset[2]);

  // Calculate advanced liquid wave alphas with physics simulation
  float alpha1 = liquidWaveAlpha(uv, 0);
  float alpha2 = liquidWaveAlpha(uv, 1);
  float alpha3 = liquidWaveAlpha(uv, 2);

  // Enhanced normalization with particle density influence
  float totalAlpha = alpha1 + alpha2 + alpha3;
  float particleWeight = 1.0 + u_particleDensity * 0.3;
  if (totalAlpha > 0.0) {
    alpha1 = (alpha1 / totalAlpha) * particleWeight;
    alpha2 = (alpha2 / totalAlpha) * particleWeight;
    alpha3 = (alpha3 / totalAlpha) * particleWeight;
  }

  // Blend liquid consciousness noise fields with physics
  float t = liquidNoise1 * alpha1 + liquidNoise2 * alpha2 + liquidNoise3 * alpha3;
  
  // Apply consciousness temperature modulation
  t = mix(t * 0.8, t * 1.2, u_consciousnessTemperature);
  t = clamp(t, 0.0, 1.0);

  // Sample gradient texture with enhanced consciousness modulation
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));

  // Apply dynamic blur with consciousness awareness
  float blurAmount = liquidBlur(uv);
  float consciousnessBlur = mix(blurAmount, blurAmount * 0.5, u_consciousnessLevel);

  // Enhanced vignette with consciousness memory patterns
  vec2 center = uv - 0.5;
  float breathingVignette = sin(u_time * 0.06 + u_liquidPhase) * 0.1 + 0.9;
  float consciousnessVignette = sin(u_time * 0.04 + u_consciousnessLevel * 3.0) * 0.05 + 0.975;
  float memoryVignette = sin(u_time * 0.03 + u_memoryIntensity * 2.0) * 0.03 + 0.985;
  
  float combinedVignette = breathingVignette * consciousnessVignette * memoryVignette;
  float vignette = combinedVignette - dot(center, center) * (0.3 + consciousnessBlur * 0.2);
  color.rgb *= vignette;

  // Enhanced shimmer overlay with consciousness patterns
  float shimmerPhase = u_time * 3.0 + uv.x * 15.0 + uv.y * 10.0;
  float baseShimmer = sin(shimmerPhase) * 0.03 + 0.97;
  float awarenessShimmer = sin(u_time * 2.5 + uv.x * 12.0 + u_awarenessLevel * 8.0) * 0.02 + 0.98;
  float temporalShimmer = sin(u_time * 1.8 + u_temporalFlowStrength * 6.0) * 0.015 + 0.985;
  
  color.rgb *= baseShimmer * awarenessShimmer * temporalShimmer;

  // Enhanced music-responsive alpha with consciousness integration
  float musicAlpha = 0.8 + u_beatIntensity * 0.2 + u_bassResponse * 0.1 + u_genreInfluence * 0.05;
  float consciousnessAlpha = 0.9 + u_consciousnessLevel * 0.1 - u_awarenessLevel * 0.05;
  
  color.a *= musicAlpha * consciousnessAlpha * (1.0 - consciousnessBlur * 0.3);

  // Apply emotional temperature to final color
  color.rgb = mix(
    color.rgb * vec3(0.9, 0.95, 1.1),  // Cool temperature
    color.rgb * vec3(1.1, 1.05, 0.9),  // Warm temperature
    u_emotionalTemperature
  );

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

  // Enhanced liquid physics properties
  surfaceTension: number;      // 0-1 surface tension strength
  viscosity: number;           // 0-1 liquid viscosity
  liquidGravity: number;       // 0-1 gravitational effect
  particleDensity: number;     // 0-1 particle concentration
  fluidDynamics: number;       // 0-1 complex fluid behavior
  membraneElasticity: number;  // 0-1 membrane flexibility
  liquidVelocity: [number, number]; // liquid momentum vector
  consciousnessTemperature: number; // 0-1 consciousness heat

  // Enhanced consciousness properties  
  consciousnessLevel: number;   // 0-1 consciousness intensity
  awarenessLevel: number;       // 0-1 awareness depth
  memoryIntensity: number;      // 0-1 consciousness memory strength
  temporalFlowStrength: number; // 0-1 temporal distortion
  
  // Enhanced musical consciousness
  genreInfluence: number;       // 0-1 genre-specific adaptations
  emotionalTemperature: number; // 0-1 warm/cool emotional range

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

  // Enhanced liquid consciousness uniforms
  u_liquidPhase: WebGLUniformLocation | null;
  u_breathingIntensity: WebGLUniformLocation | null;
  u_auroraFlow: WebGLUniformLocation | null;
  u_flowDirection: WebGLUniformLocation | null;
  u_liquidTurbulence: WebGLUniformLocation | null;
  u_consciousnessDepth: WebGLUniformLocation | null;

  // Advanced liquid physics uniforms
  u_surfaceTension: WebGLUniformLocation | null;
  u_viscosity: WebGLUniformLocation | null;
  u_liquidGravity: WebGLUniformLocation | null;
  u_particleDensity: WebGLUniformLocation | null;
  u_fluidDynamics: WebGLUniformLocation | null;
  u_membraneElasticity: WebGLUniformLocation | null;
  u_liquidVelocity: WebGLUniformLocation | null;
  u_consciousnessTemperature: WebGLUniformLocation | null;

  // Enhanced music sync uniforms
  u_musicEnergy: WebGLUniformLocation | null;
  u_musicValence: WebGLUniformLocation | null;
  u_beatIntensity: WebGLUniformLocation | null;
  u_bassResponse: WebGLUniformLocation | null;
  u_genreInfluence: WebGLUniformLocation | null;
  u_emotionalTemperature: WebGLUniformLocation | null;

  // Multi-layer consciousness uniforms
  u_consciousnessLevel: WebGLUniformLocation | null;
  u_awarenessLevel: WebGLUniformLocation | null;
  u_memoryIntensity: WebGLUniformLocation | null;
  u_temporalFlowStrength: WebGLUniformLocation | null;

  // Wave stack uniforms (enhanced)
  u_waveY: WebGLUniformLocation | null;
  u_waveHeight: WebGLUniformLocation | null;
  u_waveOffset: WebGLUniformLocation | null;
  u_blurExp: WebGLUniformLocation | null;
  u_blurMax: WebGLUniformLocation | null;
}

/**
 * FluidGradientBackgroundSystem extends WebGL gradients with liquid consciousness
 * - Breathing, pulsing aurora effects
 * - Music-responsive directional flow
 * - Liquid turbulence and consciousness depth
 * - Performance-optimized with CSS fallback
 */
export class FluidGradientBackgroundSystem
  extends BaseVisualSystem
  implements BackgroundSystemParticipant, QualityScalingCapable
{
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
  private consciousnessChoreographer: BackgroundAnimationCoordinator | null =
    null;
  private currentConsciousnessField: ConsciousnessField | null = null;

  // Make systemName publicly accessible for the interface
  public override readonly systemName: string =
    "FluidGradientBackgroundSystem";

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    // Initialize base WebGL gradient system
    this.webglGradientSystem = new WebGLGradientBackgroundSystem(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System
    );

    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer =
      year3000System?.backgroundConsciousnessChoreographer || null;

    // Initialize enhanced liquid consciousness settings
    this.liquidSettings = {
      enabled: true,
      liquidPhase: 0,
      breathingIntensity: 0.8,
      auroraFlow: 0.6,
      flowDirection: [1.0, 0.5],
      liquidTurbulence: 1.2,
      consciousnessDepth: 0.7,

      // Enhanced liquid physics properties
      surfaceTension: 0.6,           // Moderate surface tension for natural boundaries
      viscosity: 0.4,                // Medium viscosity for smooth flow
      liquidGravity: 0.3,            // Light gravitational settling
      particleDensity: 0.5,          // Balanced particle concentration
      fluidDynamics: 0.7,            // Rich fluid behavior patterns
      membraneElasticity: 0.5,       // Flexible membrane boundaries
      liquidVelocity: [0.0, 0.0],    // Initial velocity state
      consciousnessTemperature: 0.5,  // Neutral consciousness temperature

      // Enhanced consciousness properties  
      consciousnessLevel: 0.7,       // High consciousness integration
      awarenessLevel: 0.6,           // Good awareness depth
      memoryIntensity: 0.4,          // Moderate consciousness memory
      temporalFlowStrength: 0.5,     // Balanced temporal effects
      
      // Enhanced musical consciousness
      genreInfluence: 0.3,           // Moderate genre-specific adaptations
      emotionalTemperature: 0.5,     // Neutral emotional temperature

      // Quality scaling properties (defaults to medium quality)
      flowIntensity: 0.7,
      turbulenceScale: 0.9,
      colorMixingStrength: 0.8,
      animationSpeed: 1.0,
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
      u_surfaceTension: null,
      u_viscosity: null,
      u_liquidGravity: null,
      u_particleDensity: null,
      u_fluidDynamics: null,
      u_membraneElasticity: null,
      u_liquidVelocity: null,
      u_consciousnessTemperature: null,
      u_musicEnergy: null,
      u_musicValence: null,
      u_beatIntensity: null,
      u_bassResponse: null,
      u_genreInfluence: null,
      u_emotionalTemperature: null,
      u_consciousnessLevel: null,
      u_awarenessLevel: null,
      u_memoryIntensity: null,
      u_temporalFlowStrength: null,
      u_waveY: null,
      u_waveHeight: null,
      u_waveOffset: null,
      u_blurExp: null,
      u_blurMax: null,
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
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "WebGL not available, using base system"
      );
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

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Liquid consciousness system initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Failed to initialize liquid consciousness:",
        error
      );
      // Fallback to base WebGL system
    }
  }

  private async compileLiquidShader(): Promise<void> {
    if (!this.gl) throw new Error("WebGL context not available");

    const vertexShader = ShaderLoader.loadVertex(
      this.gl,
      `#version 300 es
      in vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `
    );

    const fragmentShader = ShaderLoader.loadFragment(
      this.gl,
      liquidConsciousnessShader
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to compile liquid consciousness shaders");
    }

    this.shaderProgram = ShaderLoader.createProgram(
      this.gl,
      vertexShader,
      fragmentShader
    );

    if (!this.shaderProgram) {
      throw new Error("Failed to create liquid consciousness shader program");
    }
  }

  private setupLiquidUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;

    // Get all uniform locations including new advanced physics properties
    const uniformNames = [
      "u_time",
      "u_gradientTex",
      "u_resolution",
      "u_flowStrength",
      "u_noiseScale",
      "u_liquidPhase",
      "u_breathingIntensity",
      "u_auroraFlow",
      "u_flowDirection",
      "u_liquidTurbulence",
      "u_consciousnessDepth",
      "u_musicEnergy",
      "u_musicValence",
      "u_beatIntensity",
      "u_bassResponse",
      "u_waveY",
      "u_waveHeight",
      "u_waveOffset",
      "u_blurExp",
      "u_blurMax",
      // Advanced liquid physics properties
      "u_surfaceTension",
      "u_viscosity",
      "u_liquidGravity",
      "u_particleDensity",
      "u_membraneElasticity",
      "u_fluidDynamics",
      "u_consciousnessLevel",
      "u_consciousnessTemperature",
      "u_memoryIntensity",
      "u_emotionalTemperature",
      "u_genreInfluence",
    ];

    uniformNames.forEach((name) => {
      (this.liquidUniforms as any)[name] = this.gl!.getUniformLocation(
        this.shaderProgram!,
        name
      );
    });
  }

  private subscribeToUnifiedEvents(): void {
    // Subscribe to music beat events
    const beatSubscription = unifiedEventBus.subscribe(
      "music:beat",
      this.handleMusicBeat.bind(this),
      "FluidGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(beatSubscription);

    // Subscribe to music energy events
    const energySubscription = unifiedEventBus.subscribe(
      "music:energy",
      this.handleMusicEnergy.bind(this),
      "FluidGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(energySubscription);

    // Subscribe to music state changes
    const stateSubscription = unifiedEventBus.subscribe(
      "music:state-changed",
      this.handleMusicStateChange.bind(this),
      "FluidGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(stateSubscription);

    // Subscribe to color events for coordination
    const colorSubscription = unifiedEventBus.subscribe(
      "colors:harmonized",
      this.handleColorHarmonized.bind(this),
      "FluidGradientBackgroundSystem"
    );
    this.eventSubscriptionIds.push(colorSubscription);

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Subscribed to unified events",
      {
        subscriptionCount: this.eventSubscriptionIds.length,
      }
    );
  }

  private handleMusicBeat(data: EventData<"music:beat">): void {
    const currentTime = performance.now();

    // Throttle music updates to 30fps
    if (currentTime - this.lastMusicUpdate < 33) return;
    this.lastMusicUpdate = currentTime;

    this.animationPhase += 0.1;
    this.updateFlowDirection(data.intensity);

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Music beat processed",
      {
        bpm: data.bpm,
        intensity: data.intensity,
        confidence: data.confidence,
      }
    );
  }

  private handleMusicEnergy(data: EventData<"music:energy">): void {
    this.liquidSettings.breathingIntensity = 0.5 + data.energy * 0.5;
    this.liquidSettings.auroraFlow = 0.4 + data.valence * 0.6;

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Music energy processed",
      {
        energy: data.energy,
        valence: data.valence,
        tempo: data.tempo,
      }
    );
  }

  private handleMusicStateChange(data: EventData<"music:state-changed">): void {
    // Adjust liquid consciousness based on playback state
    if (data.isPlaying) {
      this.liquidSettings.consciousnessDepth = Math.max(
        0.7,
        this.liquidSettings.consciousnessDepth
      );
    } else {
      this.liquidSettings.consciousnessDepth = Math.min(
        0.3,
        this.liquidSettings.consciousnessDepth
      );
    }

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Music state change processed",
      {
        isPlaying: data.isPlaying,
        position: data.position,
        duration: data.duration,
      }
    );
  }

  private handleColorHarmonized(data: EventData<"colors:harmonized">): void {
    // Coordinate liquid consciousness with color processing
    // Adjust turbulence based on processing complexity
    const strategyCount = data.strategies.length;
    this.liquidSettings.liquidTurbulence = Math.max(
      0.8,
      Math.min(1.5, strategyCount * 0.3)
    );

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Color harmonization processed",
      {
        strategies: data.strategies,
        processingTime: data.processingTime,
        turbulenceAdjustment: this.liquidSettings.liquidTurbulence,
      }
    );
  }

  private updateFlowDirection(intensity: number): void {
    // Create flowing directional patterns based on music
    const phase = this.animationPhase;
    this.liquidSettings.flowDirection = [
      Math.sin(phase * 0.3) * intensity,
      Math.cos(phase * 0.2) * intensity,
    ];
  }

  public override updateAnimation(deltaTime: number): void {
    // Update base WebGL system
    this.webglGradientSystem?.updateAnimation?.(performance.now(), deltaTime);

    // Update liquid consciousness phase
    this.liquidSettings.liquidPhase += deltaTime * 0.001;
    this.liquidSettings.consciousnessDepth =
      0.5 + Math.sin(this.liquidSettings.liquidPhase * 0.5) * 0.3;

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
      this.gl.uniform1f(
        this.liquidUniforms.u_liquidPhase,
        this.liquidSettings.liquidPhase
      );
    }

    if (this.liquidUniforms.u_breathingIntensity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_breathingIntensity,
        this.liquidSettings.breathingIntensity
      );
    }

    if (this.liquidUniforms.u_auroraFlow) {
      this.gl.uniform1f(
        this.liquidUniforms.u_auroraFlow,
        this.liquidSettings.auroraFlow
      );
    }

    if (this.liquidUniforms.u_flowDirection) {
      this.gl.uniform2fv(
        this.liquidUniforms.u_flowDirection,
        this.liquidSettings.flowDirection
      );
    }

    if (this.liquidUniforms.u_liquidTurbulence) {
      this.gl.uniform1f(
        this.liquidUniforms.u_liquidTurbulence,
        this.liquidSettings.liquidTurbulence
      );
    }

    if (this.liquidUniforms.u_consciousnessDepth) {
      this.gl.uniform1f(
        this.liquidUniforms.u_consciousnessDepth,
        this.liquidSettings.consciousnessDepth
      );
    }

    // Update advanced liquid physics properties
    if (this.liquidUniforms.u_surfaceTension) {
      this.gl.uniform1f(
        this.liquidUniforms.u_surfaceTension,
        this.liquidSettings.surfaceTension
      );
    }

    if (this.liquidUniforms.u_viscosity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_viscosity,
        this.liquidSettings.viscosity
      );
    }

    if (this.liquidUniforms.u_liquidGravity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_liquidGravity,
        this.liquidSettings.liquidGravity
      );
    }

    if (this.liquidUniforms.u_particleDensity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_particleDensity,
        this.liquidSettings.particleDensity
      );
    }

    if (this.liquidUniforms.u_membraneElasticity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_membraneElasticity,
        this.liquidSettings.membraneElasticity
      );
    }

    if (this.liquidUniforms.u_fluidDynamics) {
      this.gl.uniform1f(
        this.liquidUniforms.u_fluidDynamics,
        this.liquidSettings.fluidDynamics
      );
    }

    if (this.liquidUniforms.u_consciousnessLevel) {
      this.gl.uniform1f(
        this.liquidUniforms.u_consciousnessLevel,
        this.liquidSettings.consciousnessLevel
      );
    }

    if (this.liquidUniforms.u_consciousnessTemperature) {
      this.gl.uniform1f(
        this.liquidUniforms.u_consciousnessTemperature,
        this.liquidSettings.consciousnessTemperature
      );
    }

    if (this.liquidUniforms.u_memoryIntensity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_memoryIntensity,
        this.liquidSettings.memoryIntensity
      );
    }

    if (this.liquidUniforms.u_emotionalTemperature) {
      this.gl.uniform1f(
        this.liquidUniforms.u_emotionalTemperature,
        this.liquidSettings.emotionalTemperature
      );
    }

    if (this.liquidUniforms.u_genreInfluence) {
      this.gl.uniform1f(
        this.liquidUniforms.u_genreInfluence,
        this.liquidSettings.genreInfluence
      );
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
    const baseHealth = (await this.webglGradientSystem?.healthCheck?.()) || {
      ok: true,
      details: "WebGL system not initialized",
    };

    if (!baseHealth.ok) {
      return baseHealth;
    }

    return {
      ok: this.liquidSettings.enabled && this.shaderProgram !== null,
      details: this.liquidSettings.enabled
        ? "Liquid consciousness active"
        : "Liquid consciousness disabled",
    };
  }

  public override forceRepaint(
    reason: string = "liquid-consciousness-update"
  ): void {
    this.webglGradientSystem.forceRepaint(reason);
  }

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  /**
   * Adjust quality level (QualityScalingCapable interface)
   */
  public adjustQuality(level: QualityLevel): void {
    this.setQualityLevel(level);
  }

  public setQualityLevel(level: QualityLevel): void {
    // Update liquid consciousness quality settings based on performance level
    switch (level) {
      case "low":
        this.liquidSettings.flowIntensity = 0.5;
        this.liquidSettings.turbulenceScale = 0.7;
        this.liquidSettings.colorMixingStrength = 0.6;
        this.liquidSettings.animationSpeed = 0.8;
        break;
      case "medium":
        this.liquidSettings.flowIntensity = 0.7;
        this.liquidSettings.turbulenceScale = 0.9;
        this.liquidSettings.colorMixingStrength = 0.8;
        this.liquidSettings.animationSpeed = 1.0;
        break;
      case "high":
        this.liquidSettings.flowIntensity = 0.9;
        this.liquidSettings.turbulenceScale = 1.1;
        this.liquidSettings.colorMixingStrength = 1.0;
        this.liquidSettings.animationSpeed = 1.2;
        break;
      default:
        // Default to medium quality for unknown levels
        this.liquidSettings.flowIntensity = 0.7;
        this.liquidSettings.turbulenceScale = 0.9;
        this.liquidSettings.colorMixingStrength = 0.8;
        this.liquidSettings.animationSpeed = 1.0;
        break;
    }

    // Apply settings to WebGL system
    this.webglGradientSystem.setQualityLevel(level);

    if (YEAR3000_CONFIG.enableDebug) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        `Quality level set to: ${level}`,
        this.liquidSettings
      );
    }
  }

  public getPerformanceImpact(): PerformanceMetrics {
    const baseMetrics = this.webglGradientSystem.getPerformanceImpact();

    // Add liquid consciousness overhead
    return {
      fps: baseMetrics.fps,
      frameTime: baseMetrics.frameTime + 1.2, // Additional render complexity
      memoryUsage: baseMetrics.memoryUsage + 5, // Additional shader complexity (MB)
      cpuUsage: baseMetrics.cpuUsage + 3, // Additional uniforms processing
    };
  }

  public reduceQuality(amount: number): void {
    // Reduce liquid consciousness quality proportionally
    this.liquidSettings.flowIntensity = Math.max(
      0.1,
      this.liquidSettings.flowIntensity - amount * 0.3
    );
    this.liquidSettings.turbulenceScale = Math.max(
      0.2,
      this.liquidSettings.turbulenceScale - amount * 0.4
    );
    this.liquidSettings.colorMixingStrength = Math.max(
      0.2,
      this.liquidSettings.colorMixingStrength - amount * 0.3
    );
    this.liquidSettings.animationSpeed = Math.max(
      0.3,
      this.liquidSettings.animationSpeed - amount * 0.5
    );

    // Forward to WebGL system
    this.webglGradientSystem.reduceQuality(amount);
  }

  public increaseQuality(amount: number): void {
    // Increase liquid consciousness quality proportionally
    this.liquidSettings.flowIntensity = Math.min(
      1.0,
      this.liquidSettings.flowIntensity + amount * 0.2
    );
    this.liquidSettings.turbulenceScale = Math.min(
      1.5,
      this.liquidSettings.turbulenceScale + amount * 0.3
    );
    this.liquidSettings.colorMixingStrength = Math.min(
      1.2,
      this.liquidSettings.colorMixingStrength + amount * 0.2
    );
    this.liquidSettings.animationSpeed = Math.min(
      1.6,
      this.liquidSettings.animationSpeed + amount * 0.3
    );

    // Forward to WebGL system
    this.webglGradientSystem.increaseQuality(amount);
  }

  public getQualityCapabilities(): QualityCapability[] {
    return [
      {
        name: "liquid-flow-intensity",
        enabled: this.liquidSettings.flowIntensity > 0.5,
        qualityLevel: 'medium'
      },
      {
        name: "turbulence-complexity",
        enabled: this.liquidSettings.turbulenceScale > 0.8,
        qualityLevel: 'high'
      },
      {
        name: "color-mixing-quality",
        enabled: this.liquidSettings.colorMixingStrength > 0.7,
        qualityLevel: 'low'
      },
      {
        name: "animation-smoothness",
        enabled: this.liquidSettings.animationSpeed > 1.0,
        qualityLevel: 'medium'
      },
    ];
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant(
          "FluidGradientBackgroundSystem"
        );
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Unregistered from consciousness choreographer"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "FluidGradientBackgroundSystem",
          "Error unregistering from consciousness choreographer:",
          error
        );
      }
    }

    // Clean up unified event subscriptions
    this.eventSubscriptionIds.forEach((subscriptionId) => {
      unifiedEventBus.unsubscribe(subscriptionId);
    });
    this.eventSubscriptionIds = [];

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Unified event subscriptions cleaned up"
    );

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
    this.liquidSettings.breathingIntensity = Math.max(
      0,
      Math.min(1, intensity)
    );
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

  // Advanced liquid physics control methods
  public setSurfaceTension(tension: number): void {
    this.liquidSettings.surfaceTension = Math.max(0, Math.min(1, tension));
  }

  public setViscosity(viscosity: number): void {
    this.liquidSettings.viscosity = Math.max(0, Math.min(1, viscosity));
  }

  public setLiquidGravity(gravity: number): void {
    this.liquidSettings.liquidGravity = Math.max(0, Math.min(1, gravity));
  }

  public setParticleDensity(density: number): void {
    this.liquidSettings.particleDensity = Math.max(0, Math.min(2, density));
  }

  public setMembraneElasticity(elasticity: number): void {
    this.liquidSettings.membraneElasticity = Math.max(0, Math.min(1, elasticity));
  }

  public setFluidDynamics(dynamics: number): void {
    this.liquidSettings.fluidDynamics = Math.max(0, Math.min(1, dynamics));
  }

  public setConsciousnessLevel(level: number): void {
    this.liquidSettings.consciousnessLevel = Math.max(0, Math.min(1, level));
  }

  public setConsciousnessTemperature(temperature: number): void {
    this.liquidSettings.consciousnessTemperature = Math.max(0, Math.min(1, temperature));
  }

  public setMemoryIntensity(intensity: number): void {
    this.liquidSettings.memoryIntensity = Math.max(0, Math.min(1, intensity));
  }

  public setEmotionalTemperature(temperature: number): void {
    this.liquidSettings.emotionalTemperature = Math.max(0, Math.min(1, temperature));
  }

  public setGenreInfluence(influence: number): void {
    this.liquidSettings.genreInfluence = Math.max(0, Math.min(1, influence));
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
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Consciousness choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Successfully registered with consciousness choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Failed to register with consciousness choreographer:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // Liquid consciousness is high priority for organic effects
  }

  public getConsciousnessContribution(): any {
    return {
      liquidDensity: this.liquidSettings.liquidTurbulence || 0.5,
      fluidDynamics: this.liquidSettings.auroraFlow || 0.6,
      membraneFluidityIndex: this.liquidSettings.breathingIntensity || 0.8,
      turbulenceLevel: this.liquidSettings.liquidTurbulence || 0.5,
      viscosityIndex: 1.0,
      flowPatterns: ["aurora", "liquid", "consciousness"],
    };
  }

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    if (!this.gl || !this.shaderProgram) return;

    try {
      this.currentConsciousnessField = field;

      // Update liquid shader parameters based on consciousness field
      this.updateLiquidFromConsciousness(field);

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Updated from consciousness field:",
        {
          rhythmicPulse: field.rhythmicPulse,
          liquidDensity: field.liquidDensity,
          membraneFluidityIndex: field.membraneFluidityIndex,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Error updating from consciousness field:",
        error
      );
    }
  }

  public onChoreographyEvent(eventType: string, payload: any): void {
    if (!this.gl || !this.shaderProgram) return;

    try {
      switch (eventType) {
        case "choreography:rhythm-shift":
          // Adjust liquid flow patterns based on rhythm changes
          const newRhythm = payload.newRhythm?.bpm || 120;
          this.liquidSettings.auroraFlow = Math.max(
            0.2,
            Math.min(1.0, newRhythm / 120)
          );
          break;

        case "choreography:energy-surge":
          // Intensify liquid turbulence during energy surges
          const surgeIntensity = payload.intensity || 1.0;
          this.liquidSettings.liquidTurbulence = Math.min(
            1.0,
            this.liquidSettings.liquidTurbulence * (1.0 + surgeIntensity * 0.5)
          );
          break;

        case "consciousness:breathing-cycle":
          // Synchronize liquid breathing with consciousness breathing
          const breathingPhase = payload.phase || 0;
          this.liquidSettings.breathingIntensity =
            0.5 + Math.sin(breathingPhase * Math.PI * 2) * 0.3;
          break;

        case "consciousness:membrane-fluid":
          // Adjust membrane fluidity
          const fluidityIndex = payload.fluidityIndex || 0.5;
          this.liquidSettings.consciousnessDepth = fluidityIndex;
          break;
      }

      // Apply changes to shader
      if (this.currentConsciousnessField) {
        this.updateLiquidFromConsciousness(this.currentConsciousnessField);
      }

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  /**
   * Update liquid shader parameters based on consciousness field
   */
  private updateLiquidFromConsciousness(field: ConsciousnessField): void {
    if (!this.gl || !this.shaderProgram) return;

    // Modulate liquid phase with rhythmic pulse
    const consciousLiquidPhase =
      this.liquidSettings.liquidPhase + field.rhythmicPulse * 0.5;
    const liquidPhaseLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_liquidPhase"
    );
    if (liquidPhaseLocation) {
      this.gl.uniform1f(liquidPhaseLocation, consciousLiquidPhase);
    }

    // Modulate breathing intensity with consciousness breathing cycle
    const consciousBreathing =
      this.liquidSettings.breathingIntensity *
      (0.7 + field.breathingCycle * 0.3);
    const breathingLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_breathingIntensity"
    );
    if (breathingLocation) {
      this.gl.uniform1f(breathingLocation, consciousBreathing);
    }

    // Update aurora flow with musical flow direction
    const auroraFlowLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_auroraFlow"
    );
    if (auroraFlowLocation) {
      this.gl.uniform1f(
        auroraFlowLocation,
        this.liquidSettings.auroraFlow * (0.8 + field.musicalFlow.x * 0.4)
      );
    }

    // Update flow direction based on musical flow
    const flowDirectionLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_flowDirection"
    );
    if (flowDirectionLocation) {
      this.gl.uniform2f(
        flowDirectionLocation,
        field.musicalFlow.x,
        field.musicalFlow.y
      );
    }

    // Update liquid turbulence with energy resonance
    const turbulenceLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_liquidTurbulence"
    );
    if (turbulenceLocation) {
      const consciousTurbulence =
        this.liquidSettings.liquidTurbulence *
        (0.5 + field.energyResonance * 0.5);
      this.gl.uniform1f(turbulenceLocation, consciousTurbulence);
    }

    // Update consciousness depth with membrane fluidity
    const depthLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_consciousnessDepth"
    );
    if (depthLocation) {
      this.gl.uniform1f(depthLocation, field.membraneFluidityIndex);
    }

    // Apply consciousness-aware CSS variables for hybrid coordination
    // Use existing consciousness variables instead of creating liquid-specific ones
    try {
      const cssController = getGlobalOptimizedCSSController();
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-flow-direction",
        consciousLiquidPhase.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-breathing-intensity",
        consciousBreathing.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-aurora-flow",
        this.liquidSettings.auroraFlow.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-viscosity",
        this.liquidSettings.liquidTurbulence.toString()
      );
      
      // Update physics-related consciousness variables
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-surface-tension",
        this.liquidSettings.surfaceTension.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-membrane-elasticity", 
        this.liquidSettings.membraneElasticity.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-consciousness-cellular-growth",
        this.liquidSettings.particleDensity.toString()
      );
    } catch (error) {
      // Global CSS controller not available, skip CSS variable updates
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        "Global CSS controller not available:",
        error
      );
    }
  }
}
