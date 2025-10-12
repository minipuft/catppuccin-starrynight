/**
 * FluidGradientBackgroundSystem - Reality Bleeding Gradients System
 * Part of the Year 3000 System visual pipeline
 *
 * Transforms gradients into flowing liquid visuals - animated, pulsing aurora
 * that responds to music with directional flow patterns.
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { unifiedEventBus, type EventData, type UnifiedEventMap } from "@/core/events/EventBus";
import { SimplePerformanceCoordinator, type QualityLevel, type QualityScalingCapable, type PerformanceMetrics, type QualityCapability } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import { ServiceVisualSystemBase } from "@/core/services/SystemServiceBridge";
import type { VisualCoordinatorService } from "@/core/services/SystemServices";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
// NOTE: SettingsManager import removed - using TypedSettingsManager singleton via typed settings
import { ShaderLoader } from "@/utils/graphics/ShaderLoader";
import type {
  VisualEffectsCoordinator,
  BackgroundSystemParticipant,
  VisualEffectState,
} from "../effects/VisualEffectsCoordinator";
import { WebGLGradientBackgroundSystem } from "../background/WebGLRenderer";
import { RenderingModeSelector } from "./RenderingModeSelector";
import {
  RenderingMode,
  type ModeSelectionResult,
} from "@/types/renderingModes";

// Enhanced shader with advanced liquid visual effects flow patterns
const liquidVisualEffectsShader = `#version 300 es
precision mediump float;

uniform float u_time;
uniform sampler2D u_gradientTex;
uniform vec2 u_resolution;
uniform float u_flowStrength;
uniform float u_noiseScale;

// Enhanced liquid visual effects uniforms
uniform float u_liquidPhase;
uniform float u_animationIntensity;
uniform float u_auroraFlow;
uniform vec2 u_flowDirection;
uniform float u_liquidTurbulence;
uniform float u_visualEffectsDepth;

// Advanced liquid physics uniforms
uniform float u_surfaceTension;
uniform float u_viscosity;
uniform float u_liquidGravity;
uniform float u_particleDensity;
uniform float u_fluidDynamics;
uniform float u_surfaceElasticity;
uniform vec2 u_liquidVelocity;
uniform float u_visualEffectsTemperature;

// Music sync uniforms
uniform float u_musicEnergy;
uniform float u_musicValence;
uniform float u_beatIntensity;
uniform float u_bassResponse;
uniform float u_genreInfluence;
uniform float u_emotionalTemperature;

// Multi-layer visual effects uniforms
uniform float u_visualEffectsLevel;
uniform float u_activityLevel;
uniform float u_memoryIntensity;
uniform float u_temporalFlowStrength;

// Wave stack uniforms
uniform float u_waveY[3];
uniform float u_waveHeight[3];
uniform float u_waveOffset[3];
uniform float u_blurExp;
uniform float u_blurMax;

out vec4 fragColor;

// Improved simplex noise with liquid visualEffects modifications
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
  // Viscosity affects flow resistance and creates more dynamic movement
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

// Enhanced liquid visual effects noise with advanced physics
float liquidVisualEffectsNoise(vec2 uv, float timeOffset) {
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

  // Enhanced animation effect with visualEffects depth
  float animationPhase = sin(adjustedTime * 0.05 + u_liquidPhase) * u_animationIntensity;
  float visualEffectsWave = sin(adjustedTime * 0.02 + u_visualEffectsDepth) * 0.3;
  
  // VisualEffects memory patterns
  float memoryPattern = sin(adjustedTime * 0.008 + u_memoryIntensity * 5.0) * 0.15;
  
  // Temporal flow effects
  float temporalDistortion = sin(adjustedTime * 0.12 + u_temporalFlowStrength * 3.0) * 0.1;

  // Aurora flow patterns with enhanced physics
  flowUV += viscousFlow * adjustedTime * 0.03 * u_auroraFlow;
  flowUV += vec2(
    sin(adjustedTime * 0.04 + uv.y * 6.28) * (animationPhase + memoryPattern),
    cos(adjustedTime * 0.03 + uv.x * 6.28) * (animationPhase + temporalDistortion)
  ) * 0.02;

  // Enhanced turbulence with particle density
  vec2 turbulenceUV = flowUV * u_liquidTurbulence;
  float particleInfluence = u_particleDensity * 0.3;
  float turbulence1 = snoise(turbulenceUV + adjustedTime * 0.01) * (1.0 + particleInfluence);
  float turbulence2 = snoise(turbulenceUV * 2.0 + adjustedTime * 0.02) * (1.0 + particleInfluence * 0.5);
  
  // Fluid dynamics creates more complex flow patterns
  float fluidDynamicsEffect = snoise(flowUV * 3.0 + adjustedTime * 0.005) * u_fluidDynamics;

  // Multi-octave liquid noise with visualEffects layers
  float noise1 = snoise(flowUV * u_noiseScale + turbulence1 * 0.1) * u_visualEffectsLevel;
  float noise2 = snoise(flowUV * u_noiseScale * 2.0 + turbulence2 * 0.05) * u_activityLevel;
  float noise3 = snoise(flowUV * u_noiseScale * 0.5 + visualEffectsWave) * (1.0 - u_visualEffectsLevel * 0.3);
  float memoryNoise = snoise(flowUV * u_noiseScale * 1.5 + memoryPattern) * u_memoryIntensity * 0.3;

  // Apply surface tension effects
  float surfaceTensionEffect = calculateSurfaceTension(uv, 1.0);
  
  // Apply gravity settling
  float gravityEffect = simulateGravityEffect(uv, 1.0);

  // Blend with enhanced music and visualEffects responsiveness
  float baseNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.2 + memoryNoise * 0.1) * surfaceTensionEffect * gravityEffect;
  baseNoise += fluidDynamicsEffect * 0.1;
  
  // Enhanced musical modulation with genre influence
  float musicModulation = u_beatIntensity * 0.2 + u_bassResponse * 0.1 + u_genreInfluence * 0.05;
  
  // Emotional temperature affects liquid characteristics
  float temperatureEffect = mix(0.8, 1.2, u_emotionalTemperature);

  return clamp((baseNoise + musicModulation) * temperatureEffect * 0.5 + 0.5, 0.0, 1.0);
}

// Advanced liquid wave physics with surface elasticity
float liquidWaveAlpha(vec2 uv, int waveIndex) {
  float y = uv.y;
  float waveCenter = u_waveY[waveIndex];
  float waveHeight = u_waveHeight[waveIndex];

  // Enhanced animation modulation with visualEffects memory
  float animationMod = sin(u_time * 0.1 + float(waveIndex) * 2.0) * u_animationIntensity * 0.2;
  float visualEffectsBreathing = sin(u_time * 0.06 + u_visualEffectsLevel * 3.0) * 0.15;
  float memoryBreathing = sin(u_time * 0.04 + u_memoryIntensity * 2.0) * 0.1;
  
  float totalBreathing = animationMod + visualEffectsBreathing + memoryBreathing;
  float adjustedWaveHeight = waveHeight * (1.0 + totalBreathing);

  // Enhanced liquid distortion with surface elasticity
  float surfaceElastic = snoise(vec2(uv.x * 6.0 + u_time * 0.3, uv.y * 4.0)) * u_surfaceElasticity * 0.08;
  float liquidDistortion = snoise(vec2(uv.x * 8.0, u_time * 0.5)) * 0.05 * u_liquidTurbulence;
  float fluidDeformation = sin(uv.x * 10.0 + u_time * 0.7) * u_fluidDynamics * 0.03;
  
  float totalDistortion = liquidDistortion + surfaceElastic + fluidDeformation;
  float adjustedWaveCenter = waveCenter + totalDistortion;

  // Surface tension creates natural wave boundaries
  float distance = abs(y - adjustedWaveCenter);
  float tensionSmoothness = mix(0.3, 0.7, u_surfaceTension);
  float alpha = 1.0 - smoothstep(0.0, adjustedWaveHeight * tensionSmoothness, distance);

  // Enhanced shimmer with visualEffects and emotional temperature
  float baseShimmer = sin(u_time * 2.0 + uv.x * 20.0) * 0.1 + 0.9;
  float visualEffectsShimmer = sin(u_time * 1.5 + uv.y * 15.0 + u_visualEffectsLevel * 5.0) * 0.05 + 0.975;
  float temperatureShimmer = mix(0.95, 1.05, u_emotionalTemperature);
  
  alpha *= baseShimmer * visualEffectsShimmer * temperatureShimmer;

  // Viscosity affects wave edge softness
  alpha = mix(alpha, smoothstep(0.2, 0.8, alpha), u_viscosity);

  return clamp(alpha, 0.0, 1.0);
}

// Dynamic blur with visualEffects depth
float liquidBlur(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float distance = length(uv - center);

  // VisualEffects depth affects blur
  float depthModulation = sin(u_time * 0.08 + u_visualEffectsDepth) * 0.2 + 0.8;
  float adjustedBlurExp = u_blurExp * depthModulation;

  float blur = pow(distance, adjustedBlurExp);
  blur = clamp(blur, 0.0, u_blurMax);

  return blur;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Generate enhanced liquid visualEffects noise fields with physics
  float liquidNoise1 = liquidVisualEffectsNoise(uv, u_waveOffset[0]);
  float liquidNoise2 = liquidVisualEffectsNoise(uv, u_waveOffset[1]);
  float liquidNoise3 = liquidVisualEffectsNoise(uv, u_waveOffset[2]);

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

  // Blend liquid visualEffects noise fields with physics
  float t = liquidNoise1 * alpha1 + liquidNoise2 * alpha2 + liquidNoise3 * alpha3;
  
  // Apply visualEffects temperature modulation
  t = mix(t * 0.8, t * 1.2, u_visualEffectsTemperature);
  t = clamp(t, 0.0, 1.0);

  // Sample gradient texture with enhanced visualEffects modulation
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));

  // Apply dynamic blur with visualEffects awareness
  float blurAmount = liquidBlur(uv);
  float visualEffectsBlur = mix(blurAmount, blurAmount * 0.5, u_visualEffectsLevel);

  // Enhanced vignette with visualEffects memory patterns
  vec2 center = uv - 0.5;
  float animationVignette = sin(u_time * 0.06 + u_liquidPhase) * 0.1 + 0.9;
  float visualEffectsVignette = sin(u_time * 0.04 + u_visualEffectsLevel * 3.0) * 0.05 + 0.975;
  float memoryVignette = sin(u_time * 0.03 + u_memoryIntensity * 2.0) * 0.03 + 0.985;
  
  float combinedVignette = animationVignette * visualEffectsVignette * memoryVignette;
  float vignette = combinedVignette - dot(center, center) * (0.3 + visualEffectsBlur * 0.2);
  color.rgb *= vignette;

  // Enhanced shimmer overlay with visualEffects patterns
  float shimmerPhase = u_time * 3.0 + uv.x * 15.0 + uv.y * 10.0;
  float baseShimmer = sin(shimmerPhase) * 0.03 + 0.97;
  float awarenessShimmer = sin(u_time * 2.5 + uv.x * 12.0 + u_activityLevel * 8.0) * 0.02 + 0.98;
  float temporalShimmer = sin(u_time * 1.8 + u_temporalFlowStrength * 6.0) * 0.015 + 0.985;
  
  color.rgb *= baseShimmer * awarenessShimmer * temporalShimmer;

  // Enhanced music-responsive alpha with visualEffects integration
  float musicAlpha = 0.8 + u_beatIntensity * 0.2 + u_bassResponse * 0.1 + u_genreInfluence * 0.05;
  float visualEffectsAlpha = 0.9 + u_visualEffectsLevel * 0.1 - u_activityLevel * 0.05;
  
  color.a *= musicAlpha * visualEffectsAlpha * (1.0 - visualEffectsBlur * 0.3);

  // Apply emotional temperature to final color
  color.rgb = mix(
    color.rgb * vec3(0.9, 0.95, 1.1),  // Cool temperature
    color.rgb * vec3(1.1, 1.05, 0.9),  // Warm temperature
    u_emotionalTemperature
  );

  fragColor = color;
}`;

interface LiquidVisualEffectsSettings {
  enabled: boolean;
  liquidPhase: number;
  animationIntensity: number;
  auroraFlow: number;
  flowDirection: [number, number];
  liquidTurbulence: number;
  visualEffectsDepth: number;

  // Enhanced liquid physics properties
  surfaceTension: number;      // 0-1 surface tension strength
  viscosity: number;           // 0-1 liquid viscosity
  liquidGravity: number;       // 0-1 gravitational effect
  particleDensity: number;     // 0-1 particle concentration
  smoothDynamics: number;       // 0-1 complex smooth behavior
  surfaceElasticity: number;   // 0-1 surface flexibility
  liquidVelocity: [number, number]; // liquid momentum vector
  visualEffectsTemperature: number; // 0-1 visualEffects heat

  // Enhanced visualEffects properties  
  visualEffectsLevel: number;   // 0-1 visualEffects intensity
  awarenessLevel: number;       // 0-1 awareness depth
  memoryIntensity: number;      // 0-1 visualEffects memory strength
  temporalFlowStrength: number; // 0-1 temporal distortion
  
  // Enhanced musical visualEffects
  genreInfluence: number;       // 0-1 genre-specific adaptations
  emotionalTemperature: number; // 0-1 warm/cool emotional range

  // Quality scaling properties
  flowIntensity: number;
  turbulenceScale: number;
  colorMixingStrength: number;
  animationSpeed: number;
}

interface LiquidVisualEffectsUniforms {
  // Base uniforms from WebGL system
  u_time: WebGLUniformLocation | null;
  u_gradientTex: WebGLUniformLocation | null;
  u_resolution: WebGLUniformLocation | null;
  u_flowStrength: WebGLUniformLocation | null;
  u_noiseScale: WebGLUniformLocation | null;

  // Enhanced liquid visualEffects uniforms
  u_liquidPhase: WebGLUniformLocation | null;
  u_animationIntensity: WebGLUniformLocation | null;
  u_auroraFlow: WebGLUniformLocation | null;
  u_flowDirection: WebGLUniformLocation | null;
  u_liquidTurbulence: WebGLUniformLocation | null;
  u_visualEffectsDepth: WebGLUniformLocation | null;

  // Advanced liquid physics uniforms
  u_surfaceTension: WebGLUniformLocation | null;
  u_viscosity: WebGLUniformLocation | null;
  u_liquidGravity: WebGLUniformLocation | null;
  u_particleDensity: WebGLUniformLocation | null;
  u_smoothDynamics: WebGLUniformLocation | null;
  u_surfaceElasticity: WebGLUniformLocation | null;
  u_liquidVelocity: WebGLUniformLocation | null;
  u_visualEffectsTemperature: WebGLUniformLocation | null;

  // Enhanced music sync uniforms
  u_musicEnergy: WebGLUniformLocation | null;
  u_musicValence: WebGLUniformLocation | null;
  u_beatIntensity: WebGLUniformLocation | null;
  u_bassResponse: WebGLUniformLocation | null;
  u_genreInfluence: WebGLUniformLocation | null;
  u_emotionalTemperature: WebGLUniformLocation | null;

  // Multi-layer visualEffects uniforms
  u_visualEffectsLevel: WebGLUniformLocation | null;
  u_activityLevel: WebGLUniformLocation | null;
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
 * FluidGradientBackgroundSystem extends WebGL gradients with liquid visualEffects
 * - Breathing, pulsing aurora effects
 * - Music-responsive directional flow
 * - Liquid turbulence and visualEffects depth
 * - Performance-optimized with CSS fallback
 */
export class FluidGradientBackgroundSystem
  extends ServiceVisualSystemBase
  implements BackgroundSystemParticipant, QualityScalingCapable
{
  private webglGradientSystem: WebGLGradientBackgroundSystem;
  private liquidUniforms: LiquidVisualEffectsUniforms;
  private liquidSettings: LiquidVisualEffectsSettings;
  private shaderProgram: WebGLProgram | null = null;
  private gl: WebGL2RenderingContext | null = null;

  // Unified event subscriptions
  private eventSubscriptionIds: string[] = [];
  private animationPhase = 0;
  private lastMusicUpdate = 0;

  // VisualEffects choreographer integration
  private visualCoordinatorService: VisualCoordinatorService | null = null;
  private visualEffectsChoreographer: VisualEffectsCoordinator | null =
    null;
  private currentVisualEffectsField: VisualEffectState | null = null;

  // Rendering mode selection and management
  private modeSelector: RenderingModeSelector | null = null;
  private currentRenderingMode: RenderingMode = RenderingMode.Basic;
  private modeSelectionResult: ModeSelectionResult | null = null;

  // Performance-based mode switching state
  private lastModeSwitch = 0;
  private modeSwitchCooldown = 5000; // 5 seconds cooldown between mode switches
  private performanceCheckInterval = 1000; // Check performance every 1 second
  private lastPerformanceCheck = 0;
  private consecutiveLowFPSFrames = 0;
  private consecutiveHighFPSFrames = 0;
  private readonly lowFPSThreshold = 3; // Require 3 consecutive low FPS readings before downgrade
  private readonly highFPSThreshold = 5; // Require 5 consecutive high FPS readings before upgrade

  // Make systemName publicly accessible for the interface
  public override readonly systemName: string =
    "FluidGradientBackgroundSystem";

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService);

    // Initialize base WebGL gradient system
    this.webglGradientSystem = new WebGLGradientBackgroundSystem(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      null
    );

    // Initialize rendering mode selector for capability detection
    this.modeSelector = new RenderingModeSelector(
      this.webglGradientSystem,
      performanceMonitor
    );

    this.visualCoordinatorService =
      this.services.visualCoordinator || null;
    this.visualEffectsChoreographer =
      this.visualCoordinatorService?.getCoordinatorInstance?.() ||
      null;

    // Initialize enhanced liquid visualEffects settings
    this.liquidSettings = {
      enabled: true,
      liquidPhase: 0,
      animationIntensity: 0.8,
      auroraFlow: 0.6,
      flowDirection: [1.0, 0.5],
      liquidTurbulence: 1.2,
      visualEffectsDepth: 0.7,

      // Enhanced liquid physics properties
      surfaceTension: 0.6,           // Moderate surface tension for natural boundaries
      viscosity: 0.4,                // Medium viscosity for smooth flow
      liquidGravity: 0.3,            // Light gravitational settling
      particleDensity: 0.5,          // Balanced particle concentration
      smoothDynamics: 0.7,            // Rich smooth behavior patterns
      surfaceElasticity: 0.5,        // Flexible surface boundaries
      liquidVelocity: [0.0, 0.0],    // Initial velocity state
      visualEffectsTemperature: 0.5,  // Neutral visualEffects temperature

      // Enhanced visualEffects properties  
      visualEffectsLevel: 0.7,       // High visualEffects integration
      awarenessLevel: 0.6,           // Good awareness depth
      memoryIntensity: 0.4,          // Moderate visualEffects memory
      temporalFlowStrength: 0.5,     // Balanced temporal effects
      
      // Enhanced musical visualEffects
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
      u_animationIntensity: null,
      u_auroraFlow: null,
      u_flowDirection: null,
      u_liquidTurbulence: null,
      u_visualEffectsDepth: null,
      u_surfaceTension: null,
      u_viscosity: null,
      u_liquidGravity: null,
      u_particleDensity: null,
      u_smoothDynamics: null,
      u_surfaceElasticity: null,
      u_liquidVelocity: null,
      u_visualEffectsTemperature: null,
      u_musicEnergy: null,
      u_musicValence: null,
      u_beatIntensity: null,
      u_bassResponse: null,
      u_genreInfluence: null,
      u_emotionalTemperature: null,
      u_visualEffectsLevel: null,
      u_activityLevel: null,
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

  /**
   * Get current rendering mode
   */
  public getCurrentRenderingMode(): RenderingMode {
    return this.currentRenderingMode;
  }

  /**
   * Get mode selection result with capabilities and fallback information
   */
  public getModeSelectionResult(): ModeSelectionResult | null {
    return this.modeSelectionResult;
  }

  /**
   * Switch to a different rendering mode at runtime
   * Validates mode is supported by capabilities before switching
   *
   * @param newMode - Target rendering mode to switch to
   * @returns Promise<boolean> - True if switch successful, false otherwise
   */
  public async switchRenderingMode(newMode: RenderingMode): Promise<boolean> {
    if (newMode === this.currentRenderingMode) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        `Already in ${newMode} mode, no action needed`
      );
      return true;
    }

    if (!this.modeSelector) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Cannot switch modes: mode selector not initialized"
      );
      return false;
    }

    // Validate mode is supported by capabilities
    if (!this.canSupportMode(newMode)) {
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        `Cannot switch to ${newMode}: capability requirements not met`,
        { currentCapabilities: this.modeSelectionResult?.capabilities }
      );
      return false;
    }

    const oldMode = this.currentRenderingMode;
    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      `Attempting mode switch: ${oldMode} → ${newMode}`
    );

    try {
      // Clean up current mode resources
      await this.cleanupCurrentMode();

      // Update current mode
      this.currentRenderingMode = newMode;

      // Initialize new mode resources
      await this.initializeModeResources(newMode);

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        `Successfully switched from ${oldMode} to ${newMode}`
      );
      return true;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        `Failed to switch to ${newMode}, attempting rollback:`,
        error
      );

      // Rollback to old mode
      this.currentRenderingMode = oldMode;
      try {
        await this.initializeModeResources(oldMode);
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          `Successfully rolled back to ${oldMode} after failed switch`
        );
      } catch (rollbackError) {
        Y3KDebug?.debug?.error(
          "FluidGradientBackgroundSystem",
          `Rollback failed, system may be in inconsistent state:`,
          rollbackError
        );
      }
      return false;
    }
  }

  /**
   * Check if a rendering mode is supported by current capabilities
   */
  private canSupportMode(mode: RenderingMode): boolean {
    if (!this.modeSelectionResult?.capabilities) {
      return mode === RenderingMode.Basic;
    }

    const caps = this.modeSelectionResult.capabilities;

    switch (mode) {
      case RenderingMode.Basic:
        return true; // Always supported

      case RenderingMode.Standard:
        return caps.hasWebGL;

      case RenderingMode.Enhanced:
        return caps.hasWebGL && caps.hasLiquidShader;

      case RenderingMode.Full:
        return caps.hasWebGL && caps.hasLiquidShader && caps.hasCorridorShader;

      default:
        return false;
    }
  }

  /**
   * Clean up resources from current rendering mode
   */
  private async cleanupCurrentMode(): Promise<void> {
    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      `Cleaning up ${this.currentRenderingMode} mode resources`
    );

    // Clean up shader program if using Enhanced or Full mode
    if (
      (this.currentRenderingMode === RenderingMode.Enhanced ||
        this.currentRenderingMode === RenderingMode.Full) &&
      this.gl &&
      this.shaderProgram
    ) {
      this.gl.deleteProgram(this.shaderProgram);
      this.shaderProgram = null;
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Liquid shader program deleted"
      );
    }

    // Disable corridor effects if leaving Full mode
    if (this.currentRenderingMode === RenderingMode.Full) {
      (this.webglGradientSystem as any).setCorridorEffectsEnabled?.(false);
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Corridor effects disabled"
      );
    }

    // Unsubscribe from events if leaving Standard/Enhanced/Full mode
    if (this.currentRenderingMode !== RenderingMode.Basic) {
      if (!this.services.events) {
        this.eventSubscriptionIds.forEach((subscriptionId) => {
          unifiedEventBus.unsubscribe(subscriptionId);
        });
        this.eventSubscriptionIds = [];
      }
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Event subscriptions cleaned up"
      );
    }

    // Unregister from visual effects choreographer if applicable
    if (
      this.currentRenderingMode === RenderingMode.Enhanced ||
      this.currentRenderingMode === RenderingMode.Full
    ) {
      if (this.visualCoordinatorService?.unregisterVisualEffectsParticipant) {
        this.visualCoordinatorService.unregisterVisualEffectsParticipant(
          this.systemName
        );
      } else if (this.visualEffectsChoreographer) {
        try {
          this.visualEffectsChoreographer.unregisterVisualEffectsParticipant(
            this.systemName
          );
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "FluidGradientBackgroundSystem",
            "Failed to unregister from choreographer:",
            error
          );
        }
      }
    }
  }

  /**
   * Initialize resources for a specific rendering mode
   */
  private async initializeModeResources(mode: RenderingMode): Promise<void> {
    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      `Initializing ${mode} mode resources`
    );

    switch (mode) {
      case RenderingMode.Basic:
        // CSS-only mode, no initialization needed
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Basic mode active (CSS gradients only)"
        );
        break;

      case RenderingMode.Standard:
        // Basic WebGL mode
        if (!this.gl) {
          throw new Error("WebGL context not available for Standard mode");
        }
        this.subscribeToUnifiedEvents();
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Standard mode initialized (basic WebGL)"
        );
        break;

      case RenderingMode.Enhanced:
        // Liquid shader without corridor
        if (!this.gl) {
          throw new Error("WebGL context not available for Enhanced mode");
        }
        await this.compileLiquidShader();
        this.setupLiquidUniforms();
        this.subscribeToUnifiedEvents();
        this.registerWithVisualEffectsChoreographer();
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Enhanced mode initialized (liquid shader)"
        );
        break;

      case RenderingMode.Full:
        // Liquid shader + corridor effects
        if (!this.gl) {
          throw new Error("WebGL context not available for Full mode");
        }
        await this.compileLiquidShader();
        this.setupLiquidUniforms();
        (this.webglGradientSystem as any).setCorridorEffectsEnabled?.(true);
        this.subscribeToUnifiedEvents();
        this.registerWithVisualEffectsChoreographer();
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Full mode initialized (liquid + corridor)"
        );
        break;

      default:
        throw new Error(`Unknown rendering mode: ${mode}`);
    }
  }

  /**
   * Get FPS thresholds based on performance mode setting
   * Returns { downgrade: fps, upgrade: fps }
   */
  private getPerformanceThresholds(): { downgrade: number; upgrade: number } {
    // Default thresholds for auto mode
    return {
      downgrade: 45, // Downgrade if below 45 FPS
      upgrade: 55,   // Upgrade if above 55 FPS
    };
  }

  /**
   * Check if current mode can be downgraded
   */
  private canDowngradeMode(): boolean {
    // Basic mode cannot be downgraded further
    if (this.currentRenderingMode === RenderingMode.Basic) {
      return false;
    }

    // Check cooldown period
    const now = performance.now();
    if (now - this.lastModeSwitch < this.modeSwitchCooldown) {
      return false;
    }

    return true;
  }

  /**
   * Check if current mode can be upgraded
   */
  private canUpgradeMode(): boolean {
    // Full mode cannot be upgraded further
    if (this.currentRenderingMode === RenderingMode.Full) {
      return false;
    }

    // Check cooldown period
    const now = performance.now();
    if (now - this.lastModeSwitch < this.modeSwitchCooldown) {
      return false;
    }

    // Check if higher mode is supported by capabilities
    const nextMode = this.getNextHigherMode();
    return nextMode !== null && this.canSupportMode(nextMode);
  }

  /**
   * Get the next lower rendering mode
   */
  private getNextLowerMode(): RenderingMode | null {
    switch (this.currentRenderingMode) {
      case RenderingMode.Full:
        return RenderingMode.Enhanced;
      case RenderingMode.Enhanced:
        return RenderingMode.Standard;
      case RenderingMode.Standard:
        return RenderingMode.Basic;
      case RenderingMode.Basic:
        return null; // Cannot downgrade further
      default:
        return null;
    }
  }

  /**
   * Get the next higher rendering mode
   */
  private getNextHigherMode(): RenderingMode | null {
    switch (this.currentRenderingMode) {
      case RenderingMode.Basic:
        return RenderingMode.Standard;
      case RenderingMode.Standard:
        return RenderingMode.Enhanced;
      case RenderingMode.Enhanced:
        return RenderingMode.Full;
      case RenderingMode.Full:
        return null; // Cannot upgrade further
      default:
        return null;
    }
  }

  /**
   * Downgrade to lower quality rendering mode due to performance issues
   */
  private async downgradeMode(): Promise<void> {
    const nextMode = this.getNextLowerMode();
    if (!nextMode) {
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        "Cannot downgrade: already at lowest mode"
      );
      return;
    }

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      `Performance-based downgrade: ${this.currentRenderingMode} → ${nextMode}`
    );

    const success = await this.switchRenderingMode(nextMode);
    if (success) {
      this.lastModeSwitch = performance.now();
      this.consecutiveLowFPSFrames = 0; // Reset counter after successful switch
      this.consecutiveHighFPSFrames = 0;
    }
  }

  /**
   * Upgrade to higher quality rendering mode when performance allows
   */
  private async upgradeMode(): Promise<void> {
    const nextMode = this.getNextHigherMode();
    if (!nextMode) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Cannot upgrade: already at highest supported mode"
      );
      return;
    }

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      `Performance-based upgrade: ${this.currentRenderingMode} → ${nextMode}`
    );

    const success = await this.switchRenderingMode(nextMode);
    if (success) {
      this.lastModeSwitch = performance.now();
      this.consecutiveHighFPSFrames = 0; // Reset counter after successful switch
      this.consecutiveLowFPSFrames = 0;
    }
  }

  protected override async performVisualSystemInitialization(): Promise<void> {
    // Initialize base WebGL system first
    await this.webglGradientSystem.initialize();

    // Get WebGL context from base system
    this.gl = (this.webglGradientSystem as any).gl;

    // Select rendering mode based on capabilities and user preferences
    if (!this.modeSelector) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Mode selector not initialized, falling back to Basic mode"
      );
      this.currentRenderingMode = RenderingMode.Basic;
      return;
    }

    // Perform mode selection with capability detection
    // Pass 'this' so selector can check if liquid shader will compile
    this.modeSelectionResult = this.modeSelector.selectMode(this);
    this.currentRenderingMode = this.modeSelectionResult.mode;

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Rendering mode selected",
      {
        selectedMode: this.currentRenderingMode,
        reason: this.modeSelectionResult.reason,
        isFallback: this.modeSelectionResult.isFallback,
        capabilities: this.modeSelectionResult.capabilities,
      }
    );

    // Mode-specific initialization paths
    switch (this.currentRenderingMode) {
      case RenderingMode.Basic:
        // CSS-only mode, no WebGL initialization needed
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Using Basic mode (CSS gradients only)"
        );
        return;

      case RenderingMode.Standard:
        // Basic WebGL mode, no liquid or corridor shaders
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Using Standard mode (basic WebGL only)"
        );
        // Subscribe to events even in Standard mode
        this.subscribeToUnifiedEvents();
        return;

      case RenderingMode.Enhanced:
        // Liquid shader mode, no corridor effects
        if (!this.gl) {
          Y3KDebug?.debug?.warn(
            "FluidGradientBackgroundSystem",
            "WebGL not available for Enhanced mode, falling back to Basic"
          );
          this.currentRenderingMode = RenderingMode.Basic;
          return;
        }

        try {
          await this.compileLiquidShader();
          this.setupLiquidUniforms();
          this.subscribeToUnifiedEvents();
          this.registerWithVisualEffectsChoreographer();

          Y3KDebug?.debug?.log(
            "FluidGradientBackgroundSystem",
            "Enhanced mode initialized (liquid shader without corridor)"
          );
        } catch (error) {
          Y3KDebug?.debug?.error(
            "FluidGradientBackgroundSystem",
            "Failed to initialize Enhanced mode, falling back to Standard:",
            error
          );
          this.currentRenderingMode = RenderingMode.Standard;
          this.subscribeToUnifiedEvents();
        }
        break;

      case RenderingMode.Full:
        // Full mode: liquid shader + corridor effects
        if (!this.gl) {
          Y3KDebug?.debug?.warn(
            "FluidGradientBackgroundSystem",
            "WebGL not available for Full mode, falling back to Basic"
          );
          this.currentRenderingMode = RenderingMode.Basic;
          return;
        }

        try {
          // Compile liquid shader
          await this.compileLiquidShader();
          this.setupLiquidUniforms();

          // Enable corridor effects on wrapped system
          (this.webglGradientSystem as any).setCorridorEffectsEnabled?.(true);

          Y3KDebug?.debug?.log(
            "FluidGradientBackgroundSystem",
            "Corridor effects enabled for Full mode"
          );

          this.subscribeToUnifiedEvents();
          this.registerWithVisualEffectsChoreographer();

          Y3KDebug?.debug?.log(
            "FluidGradientBackgroundSystem",
            "Full mode initialized (liquid shader + corridor effects)"
          );
        } catch (error) {
          Y3KDebug?.debug?.error(
            "FluidGradientBackgroundSystem",
            "Failed to initialize Full mode:",
            error
          );

          // Try to fall back to Enhanced mode (liquid without corridor)
          try {
            await this.compileLiquidShader();
            this.setupLiquidUniforms();
            this.subscribeToUnifiedEvents();
            this.registerWithVisualEffectsChoreographer();

            this.currentRenderingMode = RenderingMode.Enhanced;
            Y3KDebug?.debug?.log(
              "FluidGradientBackgroundSystem",
              "Fell back to Enhanced mode after Full mode failure"
            );
          } catch (fallbackError) {
            Y3KDebug?.debug?.error(
              "FluidGradientBackgroundSystem",
              "Fallback to Enhanced failed, using Standard mode:",
              fallbackError
            );
            this.currentRenderingMode = RenderingMode.Standard;
            this.subscribeToUnifiedEvents();
          }
        }
        break;

      default:
        Y3KDebug?.debug?.warn(
          "FluidGradientBackgroundSystem",
          `Unknown rendering mode: ${this.currentRenderingMode}, using Basic`
        );
        this.currentRenderingMode = RenderingMode.Basic;
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
      liquidVisualEffectsShader
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to compile liquid visualEffects shaders");
    }

    this.shaderProgram = ShaderLoader.createProgram(
      this.gl,
      vertexShader,
      fragmentShader
    );

    if (!this.shaderProgram) {
      throw new Error("Failed to create liquid visualEffects shader program");
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
      "u_animationIntensity",
      "u_auroraFlow",
      "u_flowDirection",
      "u_liquidTurbulence",
      "u_visualEffectsDepth",
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
      "u_surfaceElasticity",
      "u_smoothDynamics",
      "u_visualEffectsLevel",
      "u_visualEffectsTemperature",
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
        "FluidGradientBackgroundSystem"
      );
      this.eventSubscriptionIds.push(subscriptionId);
    }

    this.visualCoordinatorService = null;
  }

  private subscribeToUnifiedEvents(): void {
    this.registerEventSubscription(
      "music:beat",
      this.handleMusicBeat.bind(this)
    );

    this.registerEventSubscription(
      "music:energy",
      this.handleMusicEnergy.bind(this)
    );

    this.registerEventSubscription(
      "music:state-changed",
      this.handleMusicStateChange.bind(this)
    );

    this.registerEventSubscription(
      "colors:harmonized",
      this.handleColorHarmonized.bind(this)
    );

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Subscribed to unified events",
      {
        events: [
          "music:beat",
          "music:energy",
          "music:state-changed",
          "colors:harmonized",
        ],
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
    this.liquidSettings.animationIntensity = 0.5 + data.energy * 0.5;
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
    // Adjust liquid visualEffects based on playback state
    if (data.isPlaying) {
      this.liquidSettings.visualEffectsDepth = Math.max(
        0.7,
        this.liquidSettings.visualEffectsDepth
      );
    } else {
      this.liquidSettings.visualEffectsDepth = Math.min(
        0.3,
        this.liquidSettings.visualEffectsDepth
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
    // Coordinate liquid visualEffects with color processing
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

  /**
   * Read directional flow vectors from CSS variables written by GradientDirectionalFlowSystem
   */
  private readFlowDirectionFromCSS(): { x: number; y: number } {
    try {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const flowX = parseFloat(computedStyle.getPropertyValue('--sn-flow-direction-x') || '0');
      const flowY = parseFloat(computedStyle.getPropertyValue('--sn-flow-direction-y') || '0');
      return { x: flowX, y: flowY };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        "Failed to read flow direction from CSS:",
        error
      );
      return { x: 0, y: 0 };
    }
  }

  /**
   * Read corridor flow (radial/inward) vectors from CSS variables
   */
  private readCorridorFlowFromCSS(): { intensity: number; centerX: number; centerY: number } {
    try {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const intensity = parseFloat(computedStyle.getPropertyValue('--sn-corridor-flow-intensity') || '0');
      const centerX = parseFloat(computedStyle.getPropertyValue('--sn-corridor-flow-center-x') || '0.5');
      const centerY = parseFloat(computedStyle.getPropertyValue('--sn-corridor-flow-center-y') || '0.5');
      return { intensity, centerX, centerY };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        "Failed to read corridor flow from CSS:",
        error
      );
      return { intensity: 0, centerX: 0.5, centerY: 0.5 };
    }
  }

  private updateFlowDirection(intensity: number): void {
    // Read beat-based flow direction from GradientDirectionalFlowSystem
    const cssFlow = this.readFlowDirectionFromCSS();

    // Read corridor flow for radial/inward effects
    const corridorFlow = this.readCorridorFlowFromCSS();

    // Calculate phase-based flow for smooth animation
    const phase = this.animationPhase;
    const phaseFlowX = Math.sin(phase * 0.3) * intensity;
    const phaseFlowY = Math.cos(phase * 0.2) * intensity;

    // Apply corridor flow (radial/inward) if present
    let finalFlowX = cssFlow.x * 0.7 + phaseFlowX * 0.3;
    let finalFlowY = cssFlow.y * 0.7 + phaseFlowY * 0.3;

    if (corridorFlow.intensity > 0.1) {
      // Calculate inward vector from normalized position to center
      // This creates radial flow pulling toward the corridor center point
      const dx = corridorFlow.centerX - 0.5; // Offset from screen center
      const dy = corridorFlow.centerY - 0.5;

      // Apply radial flow with intensity weighting
      finalFlowX += dx * corridorFlow.intensity * 0.5;
      finalFlowY += dy * corridorFlow.intensity * 0.5;
    }

    // Blend DirectionalFlow's beat-based vectors (70%) with phase-based flow (30%)
    // Plus optional corridor flow for radial effects
    // This combines genre-aware beat detection with smooth liquid animation
    this.liquidSettings.flowDirection = [finalFlowX, finalFlowY];

    Y3KDebug?.debug?.log(
      "FluidGradientBackgroundSystem",
      "Flow direction updated",
      {
        cssFlow,
        corridorFlow,
        phaseFlow: { x: phaseFlowX, y: phaseFlowY },
        blendedFlow: this.liquidSettings.flowDirection,
      }
    );
  }

  public override updateAnimation(deltaTime: number): void {
    // Performance-based mode switching (Phase F)
    const now = performance.now();
    if (now - this.lastPerformanceCheck > this.performanceCheckInterval) {
      this.lastPerformanceCheck = now;

      // Get current FPS from performance monitor
      if (this.performanceAnalyzer) {
        const fps = this.performanceAnalyzer.getMedianFPS();
        const thresholds = this.getPerformanceThresholds();

        // Check for low FPS (performance degradation)
        if (fps > 0 && fps < thresholds.downgrade) {
          this.consecutiveLowFPSFrames++;
          this.consecutiveHighFPSFrames = 0;

          // Downgrade if sustained low FPS
          if (this.consecutiveLowFPSFrames >= this.lowFPSThreshold && this.canDowngradeMode()) {
            Y3KDebug?.debug?.warn(
              "FluidGradientBackgroundSystem",
              `Sustained low FPS detected: ${fps.toFixed(1)} FPS (threshold: ${thresholds.downgrade}), initiating downgrade`
            );
            void this.downgradeMode();
          }
        }
        // Check for high FPS (can upgrade)
        else if (fps > thresholds.upgrade) {
          this.consecutiveHighFPSFrames++;
          this.consecutiveLowFPSFrames = 0;

          // Upgrade if sustained high FPS
          if (this.consecutiveHighFPSFrames >= this.highFPSThreshold && this.canUpgradeMode()) {
            Y3KDebug?.debug?.log(
              "FluidGradientBackgroundSystem",
              `Sustained high FPS detected: ${fps.toFixed(1)} FPS (threshold: ${thresholds.upgrade}), initiating upgrade`
            );
            void this.upgradeMode();
          }
        }
        // FPS in acceptable range, reset counters
        else {
          this.consecutiveLowFPSFrames = 0;
          this.consecutiveHighFPSFrames = 0;
        }
      }
    }

    // Check current rendering mode
    if (this.currentRenderingMode === RenderingMode.Basic) {
      // Basic mode: No animation needed (CSS-only)
      return;
    }

    if (this.currentRenderingMode === RenderingMode.Standard) {
      // Standard mode: Use base WebGL system's standard rendering
      this.webglGradientSystem?.updateAnimation?.(deltaTime);
      return;
    }

    // Enhanced and Full modes: Use liquid shader
    if (!this.gl || !this.shaderProgram) {
      // Fallback to base system if liquid shader not available
      this.webglGradientSystem?.updateAnimation?.(deltaTime);
      return;
    }

    // Update liquid visualEffects phase
    this.liquidSettings.liquidPhase += deltaTime * 0.001;
    this.liquidSettings.visualEffectsDepth =
      0.5 + Math.sin(this.liquidSettings.liquidPhase * 0.5) * 0.3;

    // Render with liquid shader
    this.renderLiquidShader();
  }

  private renderLiquidShader(): void {
    if (!this.gl || !this.shaderProgram) return;

    // Get base system resources
    const canvas = (this.webglGradientSystem as any).canvas as HTMLCanvasElement | null;
    const vao = (this.webglGradientSystem as any).vao as WebGLVertexArrayObject | null;
    const gradientTexture = (this.webglGradientSystem as any).gradientTexture as WebGLTexture | null;
    const startTime = (this.webglGradientSystem as any).startTime as number;
    const prefersReducedMotion = (this.webglGradientSystem as any).prefersReducedMotion as boolean;

    if (!canvas || !vao || !gradientTexture) {
      Y3KDebug?.debug?.warn(
        "FluidGradientBackgroundSystem",
        "Base system resources not available for rendering"
      );
      return;
    }

    // Clear and setup viewport
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Use liquid shader program
    this.gl.useProgram(this.shaderProgram);

    // Bind VAO
    this.gl.bindVertexArray(vao);

    // Calculate time
    const currentTime = performance.now();
    const time = prefersReducedMotion ? 0 : (currentTime - startTime) / 1000;

    // Update all liquid uniforms
    this.updateAllLiquidUniforms(time, canvas);

    // Bind gradient texture
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, gradientTexture);

    if (this.liquidUniforms.u_gradientTex) {
      this.gl.uniform1i(this.liquidUniforms.u_gradientTex, 0);
    }

    // Draw with liquid shader
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);

    // Cleanup
    this.gl.bindVertexArray(null);
  }

  private updateAllLiquidUniforms(time: number, canvas: HTMLCanvasElement): void {
    if (!this.gl || !this.shaderProgram) return;

    // Base uniforms
    if (this.liquidUniforms.u_time) {
      this.gl.uniform1f(this.liquidUniforms.u_time, time);
    }

    if (this.liquidUniforms.u_resolution) {
      this.gl.uniform2f(this.liquidUniforms.u_resolution, canvas.width, canvas.height);
    }

    if (this.liquidUniforms.u_flowStrength) {
      this.gl.uniform1f(this.liquidUniforms.u_flowStrength, this.liquidSettings.flowIntensity);
    }

    if (this.liquidUniforms.u_noiseScale) {
      this.gl.uniform1f(this.liquidUniforms.u_noiseScale, 2.0);
    }

    // Wave stack uniforms (reuse base system defaults)
    if (this.liquidUniforms.u_waveY) {
      this.gl.uniform1fv(this.liquidUniforms.u_waveY, [0.25, 0.5, 0.75]);
    }

    if (this.liquidUniforms.u_waveHeight) {
      this.gl.uniform1fv(this.liquidUniforms.u_waveHeight, [0.3, 0.3, 0.3]);
    }

    if (this.liquidUniforms.u_waveOffset) {
      this.gl.uniform1fv(this.liquidUniforms.u_waveOffset, [0.0, 1.0, 2.0]);
    }

    if (this.liquidUniforms.u_blurExp) {
      this.gl.uniform1f(this.liquidUniforms.u_blurExp, 2.0);
    }

    if (this.liquidUniforms.u_blurMax) {
      this.gl.uniform1f(this.liquidUniforms.u_blurMax, 0.5);
    }

    // Update liquid-specific uniforms (existing method)
    this.updateLiquidUniforms();
  }

  private updateLiquidUniforms(): void {
    if (!this.gl || !this.shaderProgram) return;

    // Note: shader program already bound by renderLiquidShader
    // Update liquid visualEffects uniforms
    if (this.liquidUniforms.u_liquidPhase) {
      this.gl.uniform1f(
        this.liquidUniforms.u_liquidPhase,
        this.liquidSettings.liquidPhase
      );
    }

    if (this.liquidUniforms.u_animationIntensity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_animationIntensity,
        this.liquidSettings.animationIntensity
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

    if (this.liquidUniforms.u_visualEffectsDepth) {
      this.gl.uniform1f(
        this.liquidUniforms.u_visualEffectsDepth,
        this.liquidSettings.visualEffectsDepth
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

    if (this.liquidUniforms.u_surfaceElasticity) {
      this.gl.uniform1f(
        this.liquidUniforms.u_surfaceElasticity,
        this.liquidSettings.surfaceElasticity
      );
    }

    if (this.liquidUniforms.u_smoothDynamics) {
      this.gl.uniform1f(
        this.liquidUniforms.u_smoothDynamics,
        this.liquidSettings.smoothDynamics
      );
    }

    if (this.liquidUniforms.u_visualEffectsLevel) {
      this.gl.uniform1f(
        this.liquidUniforms.u_visualEffectsLevel,
        this.liquidSettings.visualEffectsLevel
      );
    }

    if (this.liquidUniforms.u_visualEffectsTemperature) {
      this.gl.uniform1f(
        this.liquidUniforms.u_visualEffectsTemperature,
        this.liquidSettings.visualEffectsTemperature
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

  protected override async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const healthy = this.liquidSettings.enabled && this.shaderProgram !== null;

    const issues: string[] = [];

    if (!this.liquidSettings.enabled) {
      issues.push("System disabled");
    }

    if (!this.shaderProgram) {
      issues.push("Shader program not initialized");
    }

    return {
      healthy,
      details: "FluidGradientBackgroundSystem health snapshot",
      issues,
      metrics: {
        enabled: this.liquidSettings.enabled,
        hasShaderProgram: Boolean(this.shaderProgram),
        initialized: this.initialized,
        flowIntensity: this.liquidSettings.flowIntensity,
      },
    };
  }

  public override forceRepaint(
    reason: string = "liquid-visualEffects-update"
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
    // Update liquid visualEffects quality settings based on performance level
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

    if (ADVANCED_SYSTEM_CONFIG.enableDebug) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        `Quality level set to: ${level}`,
        this.liquidSettings
      );
    }
  }

  public getPerformanceImpact(): PerformanceMetrics {
    const baseMetrics = this.webglGradientSystem.getPerformanceImpact();

    // Add liquid visualEffects overhead
    return {
      fps: baseMetrics.fps,
      frameTime: baseMetrics.frameTime + 1.2, // Additional render complexity
      memoryUsage: baseMetrics.memoryUsage + 5, // Additional shader complexity (MB)
      cpuUsage: baseMetrics.cpuUsage + 3, // Additional uniforms processing
    };
  }

  public reduceQuality(amount: number): void {
    // Reduce liquid visualEffects quality proportionally
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
    // Increase liquid visualEffects quality proportionally
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

  protected override performVisualSystemCleanup(): void {

    // Unregister from visualEffects choreographer
    if (this.visualCoordinatorService?.unregisterVisualEffectsParticipant) {
      this.visualCoordinatorService.unregisterVisualEffectsParticipant(
        this.systemName
      );
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Unregistered from visual effects coordinator via service"
      );
    } else if (this.visualEffectsChoreographer) {
      try {
        this.visualEffectsChoreographer.unregisterVisualEffectsParticipant(
          "FluidGradientBackgroundSystem"
        );
        Y3KDebug?.debug?.log(
          "FluidGradientBackgroundSystem",
          "Unregistered from visualEffects choreographer"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "FluidGradientBackgroundSystem",
          "Error unregistering from visualEffects choreographer:",
          error
        );
      }
    }

    // Clean up unified event subscriptions
    if (!this.services.events) {
      this.eventSubscriptionIds.forEach((subscriptionId) => {
        unifiedEventBus.unsubscribe(subscriptionId);
      });

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Unified event subscriptions cleaned up"
      );
    }

    this.eventSubscriptionIds = [];

    // Clean up liquid visualEffects shader
    if (this.gl && this.shaderProgram) {
      this.gl.deleteProgram(this.shaderProgram);
      this.shaderProgram = null;
    }

    // Clean up base WebGL system
    this.webglGradientSystem.destroy();
  }

  // Public API for liquid visualEffects control
  public setLiquidPhase(phase: number): void {
    this.liquidSettings.liquidPhase = phase;
  }

  public setAnimationIntensity(intensity: number): void {
    this.liquidSettings.animationIntensity = Math.max(
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

  public setVisualEffectsDepth(depth: number): void {
    this.liquidSettings.visualEffectsDepth = Math.max(0, Math.min(1, depth));
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

  public setSurfaceElasticity(elasticity: number): void {
    this.liquidSettings.surfaceElasticity = Math.max(0, Math.min(1, elasticity));
  }

  public setSmoothDynamics(dynamics: number): void {
    this.liquidSettings.smoothDynamics = Math.max(0, Math.min(1, dynamics));
  }

  public setVisualEffectsLevel(level: number): void {
    this.liquidSettings.visualEffectsLevel = Math.max(0, Math.min(1, level));
  }

  public setVisualEffectsTemperature(temperature: number): void {
    this.liquidSettings.visualEffectsTemperature = Math.max(0, Math.min(1, temperature));
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

  public getLiquidSettings(): LiquidVisualEffectsSettings {
    return { ...this.liquidSettings };
  }

  // ===================================================================
  // CONSCIOUSNESS CHOREOGRAPHER INTEGRATION
  // ===================================================================

  /**
   * Register this liquid system as a visualEffects participant
   */
  private registerWithVisualEffectsChoreographer(): void {
    this.visualEffectsChoreographer =
      this.visualCoordinatorService?.getCoordinatorInstance?.() ||
      this.visualEffectsChoreographer;

    if (
      this.visualCoordinatorService?.registerVisualEffectsParticipant?.(this)
    ) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Successfully registered with visual effects coordinator"
      );
      return;
    }

    if (!this.visualEffectsChoreographer) {
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "VisualEffects choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.visualEffectsChoreographer.registerVisualEffectsParticipant(this);
      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Successfully registered with visualEffects choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Failed to register with visualEffects choreographer:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // Liquid visualEffects is high priority for dynamic effects
  }

  public getVisualEffectsContribution(): any {
    return {
      liquidDensity: this.liquidSettings.liquidTurbulence || 0.5,
      smoothDynamics: this.liquidSettings.auroraFlow || 0.6,
      surfaceFluidityIndex: this.liquidSettings.animationIntensity || 0.8,
      turbulenceLevel: this.liquidSettings.liquidTurbulence || 0.5,
      viscosityIndex: 1.0,
      flowPatterns: ["aurora", "liquid", "visualEffects"],
    };
  }

  public onVisualEffectsFieldUpdate(field: VisualEffectState): void {
    if (!this.gl || !this.shaderProgram) return;

    try {
      this.currentVisualEffectsField = field;

      // Update liquid shader parameters based on visualEffects field
      this.updateLiquidFromVisualEffects(field);

      Y3KDebug?.debug?.log(
        "FluidGradientBackgroundSystem",
        "Updated from visualEffects field:",
        {
          rhythmicPulse: field.pulseRate,
          liquidDensity: field.fluidIntensity,
          surfaceFluidityIndex: field.fluidIntensity,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "FluidGradientBackgroundSystem",
        "Error updating from visualEffects field:",
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

        case "visualEffects:animation-cycle":
          // Synchronize liquid animation with visualEffects animation
          const animationPhase = payload.phase || 0;
          this.liquidSettings.animationIntensity =
            0.5 + Math.sin(animationPhase * Math.PI * 2) * 0.3;
          break;

        case "visualEffects:surface-fluid":
          // Adjust surface fluidity
          const fluidityIndex = payload.fluidityIndex || 0.5;
          this.liquidSettings.visualEffectsDepth = fluidityIndex;
          break;
      }

      // Apply changes to shader
      if (this.currentVisualEffectsField) {
        this.updateLiquidFromVisualEffects(this.currentVisualEffectsField);
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
   * Update liquid shader parameters based on visualEffects field
   */
  private updateLiquidFromVisualEffects(field: VisualEffectState): void {
    if (!this.gl || !this.shaderProgram) return;

    // Modulate liquid phase with rhythmic pulse
    const consciousLiquidPhase =
      this.liquidSettings.liquidPhase + field.pulseRate * 0.5;
    const liquidPhaseLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_liquidPhase"
    );
    if (liquidPhaseLocation) {
      this.gl.uniform1f(liquidPhaseLocation, consciousLiquidPhase);
    }

    // Modulate animation intensity with visualEffects animation cycle
    const smoothAnimation =
      this.liquidSettings.animationIntensity *
      (0.7 + field.pulseRate * 0.3);
    const animationLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_animationIntensity"
    );
    if (animationLocation) {
      this.gl.uniform1f(animationLocation, smoothAnimation);
    }

    // Update aurora flow with musical flow direction
    const auroraFlowLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_auroraFlow"
    );
    if (auroraFlowLocation) {
      this.gl.uniform1f(
        auroraFlowLocation,
        this.liquidSettings.auroraFlow * (0.8 + field.flowDirection.x * 0.4)
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
        field.flowDirection.x,
        field.flowDirection.y
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
        (0.5 + field.energyLevel * 0.5);
      this.gl.uniform1f(turbulenceLocation, consciousTurbulence);
    }

    // Update visualEffects depth with surface fluidity
    const depthLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_visualEffectsDepth"
    );
    if (depthLocation) {
      this.gl.uniform1f(depthLocation, field.fluidIntensity);
    }

    // Apply visualEffects-aware CSS variables for hybrid coordination
    // Use existing visualEffects variables instead of creating liquid-specific ones
    try {
      const cssController = getGlobalCSSVariableWriter();
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-flow-direction",
        consciousLiquidPhase.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-animation-intensity",
        smoothAnimation.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-aurora-flow",
        this.liquidSettings.auroraFlow.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-viscosity",
        this.liquidSettings.liquidTurbulence.toString()
      );
      
      // Update physics-related visualEffects variables
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-surface-tension",
        this.liquidSettings.surfaceTension.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-surface-elasticity", 
        this.liquidSettings.surfaceElasticity.toString()
      );
      cssController.queueCSSVariableUpdate(
        "--sn-visualEffects-animation-scale",
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
          this.liquidSettings.liquidTurbulence = Math.min(1, payload.intensity * 0.8);
        }
        break;
      case "visual:color-shift":
        this.forceRepaint("color-shift");
        break;
      case "visual:energy-surge":
        if (payload.intensity > 0.5) {
          this.liquidSettings.particleDensity = Math.min(1, payload.intensity);
        }
        break;
    }
  }

  public getVisualContribution(): Partial<VisualEffectState> {
    return {
      fluidIntensity: this.liquidSettings.liquidTurbulence,
      effectDepth: this.liquidSettings.particleDensity,
      systemHarmony: this.liquidSettings.surfaceTension
    };
  }

  // ===================================================================
  // SETTINGS INTEGRATION
  // ===================================================================

  /**
   * 🔧 CRITICAL FIX: Forward settings changes to internal WebGLRenderer
   * Enables settings propagation through wrapper system
   */
  public applyUpdatedSettings(key: string, value: any): void {
    // Forward to internal WebGL renderer if it implements the method
    if (
      this.webglGradientSystem &&
      typeof this.webglGradientSystem.applyUpdatedSettings === "function"
    ) {
      this.webglGradientSystem.applyUpdatedSettings(key, value);
    }
  }

  // ===================================================================
  // BACKWARD COMPATIBILITY ALIASES
  // ===================================================================

  /** @deprecated Use onVisualEffectsFieldUpdate */
  public onConsciousnessFieldUpdate(field: VisualEffectState): void {
    return this.onVisualEffectsFieldUpdate(field);
  }
}
