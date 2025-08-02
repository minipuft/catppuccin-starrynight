/**
 * Consolidated Shader Library for Background Consciousness Systems
 * 
 * Shared shader components, utilities, and constants used across WebGL-based
 * consciousness systems, eliminating shader code duplication.
 * 
 * @architecture Phase 2.2C Shader Consolidation
 * @philosophy Organic shader consciousness through shared components
 */

// ===================================================================
// SHARED SHADER COMPONENTS
// ===================================================================

/**
 * Standard vertex shader used by all WebGL consciousness systems
 */
export const STANDARD_CONSCIOUSNESS_VERTEX_SHADER = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/**
 * Shared noise functions used across consciousness shaders
 * Eliminates duplicate noise implementations
 */
export const SHARED_NOISE_FUNCTIONS = `
// Shared simplex noise implementation for consciousness effects
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
}`;

/**
 * Shared consciousness modulation functions
 * Common consciousness-based parameter calculations
 */
export const CONSCIOUSNESS_MODULATION_FUNCTIONS = `
// Consciousness-aware breathing effect
float consciousnessBreathing(float time, float phase, float intensity) {
  return sin(time * 0.05 + phase) * intensity;
}

// Rhythmic pulse modulation from consciousness field
float rhythmicPulseModulation(float baseValue, float rhythmicPulse, float intensity) {
  return baseValue * (1.0 + rhythmicPulse * intensity);
}

// Musical flow direction calculation
vec2 calculateMusicalFlow(vec2 baseDirection, vec2 musicFlow, float sensitivity) {
  return baseDirection + musicFlow * sensitivity;
}

// Energy resonance modulation
float energyResonanceModulation(float baseValue, float energyResonance, float minMult, float maxMult) {
  return baseValue * (minMult + energyResonance * (maxMult - minMult));
}

// Membrane fluidity effect
float membraneFluidityEffect(float value, float fluidityIndex) {
  return mix(value, value * 1.2, fluidityIndex);
}`;

/**
 * Common uniform declarations for consciousness systems
 */
export const STANDARD_CONSCIOUSNESS_UNIFORMS = `
// Time and resolution (universal)
uniform float u_time;
uniform vec2 u_resolution;

// Consciousness field uniforms
uniform float u_rhythmicPulse;
uniform vec2 u_musicalFlow;
uniform float u_energyResonance;
uniform float u_breathingCycle;
uniform float u_membraneFluidityIndex;

// Music sync uniforms
uniform float u_musicEnergy;
uniform float u_musicValence;
uniform float u_beatIntensity;
uniform float u_bassResponse;`;

// ===================================================================
// SHADER TEMPLATE SYSTEM
// ===================================================================

/**
 * Shader template builder for consciousness systems
 * Eliminates duplicate shader construction patterns
 */
export class ConsciousnessShaderTemplate {
  /**
   * Build a complete fragment shader from components
   */
  public static buildFragmentShader(options: {
    precision?: string;
    additionalUniforms?: string;
    additionalFunctions?: string;
    mainShaderLogic: string;
    includeNoiseFunctions?: boolean;
    includeConsciousnessFunctions?: boolean;
  }): string {
    const {
      precision = 'precision mediump float;',
      additionalUniforms = '',
      additionalFunctions = '',
      mainShaderLogic,
      includeNoiseFunctions = true,
      includeConsciousnessFunctions = true
    } = options;

    let shader = `#version 300 es\n${precision}\n\n`;
    
    // Add standard consciousness uniforms
    shader += STANDARD_CONSCIOUSNESS_UNIFORMS + '\n\n';
    
    // Add additional uniforms if provided
    if (additionalUniforms) {
      shader += additionalUniforms + '\n\n';
    }
    
    // Add output declaration
    shader += 'out vec4 fragColor;\n\n';
    
    // Add shared noise functions if requested
    if (includeNoiseFunctions) {
      shader += SHARED_NOISE_FUNCTIONS + '\n\n';
    }
    
    // Add consciousness modulation functions if requested
    if (includeConsciousnessFunctions) {
      shader += CONSCIOUSNESS_MODULATION_FUNCTIONS + '\n\n';
    }
    
    // Add additional functions if provided
    if (additionalFunctions) {
      shader += additionalFunctions + '\n\n';
    }
    
    // Add main function
    shader += 'void main() {\n';
    shader += '  vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n\n';
    shader += mainShaderLogic;
    shader += '\n}';
    
    return shader;
  }

  /**
   * Generate standard uniform names list for consciousness systems
   */
  public static getStandardUniformNames(): string[] {
    return [
      'u_time', 'u_resolution', 'u_rhythmicPulse', 'u_musicalFlow',
      'u_energyResonance', 'u_breathingCycle', 'u_membraneFluidityIndex',
      'u_musicEnergy', 'u_musicValence', 'u_beatIntensity', 'u_bassResponse'
    ];
  }

  /**
   * Generate WebGL-specific uniform names (for WebGL system)
   */
  public static getWebGLUniformNames(): string[] {
    return [
      ...this.getStandardUniformNames(),
      'u_gradientTex', 'u_flowStrength', 'u_noiseScale', 'u_colorIntensity',
      'u_patternScale', 'u_animationSpeed'
    ];
  }

  /**
   * Generate liquid-specific uniform names (for Liquid system)
   */
  public static getLiquidUniformNames(): string[] {
    return [
      ...this.getStandardUniformNames(),
      'u_gradientTex', 'u_flowStrength', 'u_noiseScale', 'u_liquidPhase',
      'u_breathingIntensity', 'u_auroraFlow', 'u_flowDirection',
      'u_liquidTurbulence', 'u_consciousnessDepth', 'u_waveY',
      'u_waveHeight', 'u_waveOffset', 'u_blurExp', 'u_blurMax'
    ];
  }
}

// ===================================================================
// SHARED SHADER LOGIC PATTERNS
// ===================================================================

/**
 * Common shader logic patterns used across consciousness systems
 */
export class ShaderLogicPatterns {
  /**
   * Standard consciousness-driven flow calculation
   */
  public static consciousnessFlowLogic(): string {
    return `
  // Calculate consciousness-driven flow
  vec2 flowDirection = calculateMusicalFlow(vec2(1.0, 0.5), u_musicalFlow, 0.5);
  float flowStrength = rhythmicPulseModulation(0.5, u_rhythmicPulse, 0.3);
  
  // Apply breathing modulation
  float breathingMod = consciousnessBreathing(u_time, 0.0, 0.2);
  flowStrength *= (1.0 + breathingMod);`;
  }

  /**
   * Standard noise-based texture sampling with consciousness
   */
  public static consciousnessNoiseSampling(): string {
    return `
  // Generate consciousness-modulated noise
  vec2 noiseUV = uv + flowDirection * u_time * 0.03;
  float noise1 = snoise(noiseUV * 2.0);
  float noise2 = snoise(noiseUV * 4.0) * 0.5;
  
  // Combine noise with consciousness influence
  float t = (noise1 + noise2) * energyResonanceModulation(1.0, u_energyResonance, 0.5, 1.5);
  t = clamp(t * 0.5 + 0.5, 0.0, 1.0);`;
  }

  /**
   * Standard consciousness-aware vignette effect
   */
  public static consciousnessVignette(): string {
    return `
  // Apply consciousness-aware vignette
  vec2 center = uv - 0.5;
  float breathing = consciousnessBreathing(u_time, u_breathingCycle, 0.1);
  float vignette = (0.9 + breathing) - dot(center, center) * 0.3;
  color.rgb *= vignette;`;
  }

  /**
   * Standard music-responsive alpha modulation
   */
  public static musicResponsiveAlpha(): string {
    return `
  // Music-responsive alpha modulation
  float musicAlpha = 0.8 + u_beatIntensity * 0.2 + u_bassResponse * 0.1;
  color.a *= musicAlpha;`;
  }

  /**
   * Standard shimmer/aurora effect
   */
  public static auroraShimmerEffect(): string {
    return `
  // Aurora shimmer overlay
  float shimmerPhase = u_time * 3.0 + uv.x * 15.0 + uv.y * 10.0;
  float shimmer = sin(shimmerPhase) * 0.03 + 0.97;
  color.rgb *= shimmer;`;
  }
}

// ===================================================================
// CONSCIOUSNESS-SPECIFIC SHADER FRAGMENTS
// ===================================================================

/**
 * Reusable shader fragments for different consciousness effects
 */
export class ConsciousnessShaderFragments {
  /**
   * WebGL gradient consciousness fragment
   * Optimized version of WebGL gradient shader logic
   */
  public static webglGradientFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // WebGL-specific gradient sampling
  ${ShaderLogicPatterns.consciousnessNoiseSampling()}
  
  // Sample gradient texture
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));
  
  // Apply consciousness effects
  ${ShaderLogicPatterns.consciousnessVignette()}
  ${ShaderLogicPatterns.musicResponsiveAlpha()}
  
  fragColor = color;`;
  }

  /**
   * Liquid consciousness fragment
   * Core liquid effects with consciousness integration
   */
  public static liquidConsciousnessFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // Liquid-specific turbulence and phase
  float liquidPhase = u_liquidPhase + u_rhythmicPulse * 0.5;
  vec2 turbulenceUV = uv * u_liquidTurbulence;
  float turbulence = snoise(turbulenceUV + u_time * 0.01);
  
  // Liquid consciousness noise
  vec2 liquidUV = uv + flowDirection * u_time * 0.03;
  liquidUV += vec2(sin(u_time * 0.04 + liquidPhase), cos(u_time * 0.03 + liquidPhase)) * 0.02;
  float liquidNoise = snoise(liquidUV * 2.0 + turbulence * 0.1);
  
  float t = clamp(liquidNoise * 0.5 + 0.5, 0.0, 1.0);
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));
  
  ${ShaderLogicPatterns.consciousnessVignette()}
  ${ShaderLogicPatterns.auroraShimmerEffect()}
  ${ShaderLogicPatterns.musicResponsiveAlpha()}
  
  fragColor = color;`;
  }
}

// ===================================================================
// SHADER OPTIMIZATION UTILITIES
// ===================================================================

/**
 * Shader optimization and performance utilities
 */
export class ShaderOptimizationUtils {
  /**
   * Generate optimized shader based on performance level
   */
  public static generateOptimizedShader(
    baseShaderLogic: string,
    performanceLevel: 'high' | 'medium' | 'low'
  ): string {
    switch (performanceLevel) {
      case 'high':
        // Full quality with all effects
        return baseShaderLogic;
        
      case 'medium':
        // Reduced noise octaves, simplified calculations
        return baseShaderLogic
          .replace(/snoise\(.*?\)/g, 'snoise($1)') // Simplified noise calls
          .replace(/\* 0\.0[1-9]/g, '* 0.02'); // Reduce animation frequencies
        
      case 'low':
        // Minimal effects, basic consciousness response
        return baseShaderLogic
          .replace(/snoise\(.*?\) \* 0\.[0-9]+/g, '0.5') // Replace noise with constants
          .replace(/sin\(.*?\) \* 0\.[0-9]+/g, '0.0'); // Remove sine calculations
        
      default:
        return baseShaderLogic;
    }
  }

  /**
   * Calculate shader complexity score for performance monitoring
   */
  public static calculateShaderComplexity(shaderSource: string): number {
    let complexity = 0;
    
    // Count expensive operations
    complexity += (shaderSource.match(/snoise/g) || []).length * 10; // Noise is expensive
    complexity += (shaderSource.match(/sin|cos|tan/g) || []).length * 2; // Trig functions
    complexity += (shaderSource.match(/texture/g) || []).length * 3; // Texture samples
    complexity += (shaderSource.match(/mix|smoothstep/g) || []).length * 1; // Interpolations
    
    return complexity;
  }

  /**
   * Generate fallback shader for low-performance situations
   */
  public static generateFallbackShader(): string {
    return ConsciousnessShaderTemplate.buildFragmentShader({
      includeNoiseFunctions: false,
      includeConsciousnessFunctions: false,
      additionalUniforms: 'uniform sampler2D u_gradientTex;',
      mainShaderLogic: `
  // Minimal fallback consciousness shader
  float t = uv.x + sin(u_time * 0.5 + u_rhythmicPulse) * 0.1;
  t = clamp(t, 0.0, 1.0);
  
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));
  color.a *= 0.8 + u_beatIntensity * 0.2;
  
  fragColor = color;`
    });
  }
}

// ===================================================================
// EXPORT CONSOLIDATION
// ===================================================================

/**
 * Complete shader library export for consciousness systems
 */
export const CONSCIOUSNESS_SHADER_LIBRARY = {
  // Templates and builders
  Template: ConsciousnessShaderTemplate,
  
  // Shared components
  VERTEX_SHADER: STANDARD_CONSCIOUSNESS_VERTEX_SHADER,
  NOISE_FUNCTIONS: SHARED_NOISE_FUNCTIONS,
  CONSCIOUSNESS_FUNCTIONS: CONSCIOUSNESS_MODULATION_FUNCTIONS,
  STANDARD_UNIFORMS: STANDARD_CONSCIOUSNESS_UNIFORMS,
  
  // Logic patterns
  LogicPatterns: ShaderLogicPatterns,
  
  // Consciousness fragments
  Fragments: ConsciousnessShaderFragments,
  
  // Optimization utilities
  Optimization: ShaderOptimizationUtils
};