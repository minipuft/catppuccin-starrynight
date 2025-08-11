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
 * Enhanced consciousness modulation functions
 * Advanced consciousness-based parameter calculations with Year 3000 effects
 */
export const CONSCIOUSNESS_MODULATION_FUNCTIONS = `
// Enhanced consciousness-aware breathing effect with multi-phase patterns
float consciousnessBreathing(float time, float phase, float intensity) {
  return sin(time * 0.05 + phase) * intensity;
}

// Deep consciousness breathing with emotional resonance
float deepConsciousnessBreathing(float time, float phase, float emotionalIntensity) {
  float primaryBreath = sin(time * 0.04 + phase) * 0.6;
  float secondaryBreath = sin(time * 0.07 + phase * 1.3) * 0.3;
  float emotionalBreath = sin(time * 0.02 + phase * 0.7) * 0.2;
  return (primaryBreath + secondaryBreath + emotionalBreath) * emotionalIntensity;
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
}

// === ADVANCED CONSCIOUSNESS FIELD PATTERNS ===

// Multi-dimensional consciousness field intensity calculation
float consciousnessFieldIntensity(vec2 position, float time, float musicEnergy) {
  // Primary consciousness wave
  float primaryField = snoise(position * 2.0 + time * 0.1) * 0.6;
  
  // Secondary awareness resonance
  float secondaryField = snoise(position * 4.0 + time * 0.05) * 0.3;
  
  // Musical consciousness enhancement
  float musicalField = snoise(position * 6.0 + time * 0.15) * 0.2;
  
  // Combine consciousness layers
  float combinedField = primaryField + secondaryField + (musicalField * musicEnergy);
  return clamp(combinedField * 0.5 + 0.5, 0.0, 1.0);
}

// Multi-dimensional awareness patterns for color modulation
vec3 awarenessResonance(vec3 baseColor, float consciousnessLevel, float musicIntensity) {
  // Consciousness-aware color temperature shift
  float temperatureShift = consciousnessLevel * 0.3;
  vec3 warmShift = vec3(1.0 + temperatureShift, 1.0 + temperatureShift * 0.5, 1.0);
  vec3 coolShift = vec3(1.0, 1.0 + temperatureShift * 0.3, 1.0 + temperatureShift);
  
  // Musical intensity affects color saturation
  float saturationBoost = 1.0 + musicIntensity * 0.4;
  
  // Apply consciousness-aware color modulation
  vec3 temperatureColor = mix(coolShift, warmShift, consciousnessLevel);
  return baseColor * temperatureColor * saturationBoost;
}

// Temporal flow patterns for Year 3000 streaming effects
vec2 temporalFlowDirection(vec2 position, float time, vec2 musicFlow) {
  // Primary temporal stream
  vec2 primaryFlow = vec2(
    sin(time * 0.08 + position.x * 3.0),
    cos(time * 0.06 + position.y * 2.5)
  ) * 0.02;
  
  // Secondary consciousness flow
  vec2 consciousnessFlow = vec2(
    sin(time * 0.05 + position.y * 4.0),
    cos(time * 0.04 + position.x * 3.5)
  ) * 0.015;
  
  // Musical synchronization flow
  vec2 musicalSync = musicFlow * 0.01;
  
  return primaryFlow + consciousnessFlow + musicalSync;
}

// Membrane consciousness dynamics for organic boundaries
float membraneConsciousnessFlow(vec2 position, float fluidityIndex, float awarenessLevel) {
  // Base membrane oscillation
  float membraneBase = sin(position.x * 8.0 + position.y * 6.0) * 0.1;
  
  // Consciousness-driven membrane flexibility
  float consciousnessFlex = awarenessLevel * fluidityIndex * 0.2;
  
  // Organic membrane breathing
  float membraneBreath = sin(position.x * 3.0 + position.y * 4.0) * 0.05;
  
  return membraneBase + consciousnessFlex + membraneBreath;
}

// Advanced consciousness breathing patterns
float consciousnessMemoryBreathing(float time, float phase, float memoryIntensity) {
  // Primary consciousness rhythm
  float primaryRhythm = sin(time * 0.03 + phase) * 0.5;
  
  // Memory echo patterns
  float memoryEcho = sin(time * 0.08 + phase * 1.7) * 0.3 * memoryIntensity;
  
  // Deep awareness pulse
  float awarenessePulse = sin(time * 0.015 + phase * 0.5) * 0.2;
  
  return primaryRhythm + memoryEcho + awarenessePulse;
}`;

/**
 * Corridor bubble SDF functions for inward-flowing effects
 * Provides geometric primitives for corridor and bubble visualization
 */
export const CORRIDOR_SDF_FUNCTIONS = `
// Convert screen coordinates to polar coordinates for radial flow
vec2 toPolar(vec2 uv) {
  vec2 centered = uv - 0.5;
  float angle = atan(centered.y, centered.x);
  float radius = length(centered);
  return vec2(angle, radius);
}

// Convert polar coordinates back to cartesian
vec2 fromPolar(vec2 polar) {
  float angle = polar.x;
  float radius = polar.y;
  return vec2(cos(angle) * radius, sin(angle) * radius) + 0.5;
}

// Signed distance field for a circle
float circleSDF(vec2 uv, vec2 center, float radius) {
  return length(uv - center) - radius;
}

// Smooth minimum for blending SDFs
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Enhanced multiple bubble corridors with organic consciousness-aware animations
float bubbleCorridors(vec2 uv, float time, float intensity) {
  // ===== ENHANCED PRIMARY BUBBLE APERTURES =====
  // Create 6 main circular apertures arranged in a ring with dynamic bubble count
  float baseBubbleCount = 6.0;
  float dynamicBubbleCount = baseBubbleCount + floor(intensity * 2.0); // 6-8 bubbles based on intensity
  float ringRadius = 0.28 + sin(time * 0.15) * 0.08; // Breathing ring radius (0.20-0.36)
  
  float minBubbleDistance = 2.0; // Track closest bubble distance
  
  // Calculate distance to each bubble position with enhanced organic movement
  for(float i = 0.0; i < dynamicBubbleCount; i += 1.0) {
    // Enhanced organic rotation with breathing rhythm
    float bubbleAngle = (i / dynamicBubbleCount) * 2.0 * 3.14159 + time * 0.08;
    
    // Add organic spiral motion for consciousness effect
    float spiralOffset = sin(time * 0.25 + i * 0.6) * 0.15;
    float dynamicRingRadius = ringRadius + spiralOffset;
    
    // Bubble center position with enhanced organic movement
    vec2 bubbleCenter = vec2(0.5) + vec2(
      cos(bubbleAngle) * dynamicRingRadius,
      sin(bubbleAngle) * dynamicRingRadius
    );
    
    // Enhanced breathing/pulsing animation with multi-frequency modulation
    float breathingPhase = sin(time * 0.6 + i * 0.8) * 0.04;
    float organicPhase = sin(time * 0.35 + i * 1.2) * 0.03;
    float consciousnessPhase = sin(time * 0.18 + i * 0.5) * 0.025;
    
    vec2 organicMovement = vec2(
      sin(time * 0.3 + i * 0.7) * (breathingPhase + organicPhase),
      cos(time * 0.4 + i * 0.9) * (breathingPhase + consciousnessPhase)
    );
    
    vec2 animatedCenter = bubbleCenter + organicMovement;
    
    // Calculate distance from current pixel to this bubble center
    float distanceToBubble = length(uv - animatedCenter);
    minBubbleDistance = min(minBubbleDistance, distanceToBubble);
  }
  
  // ===== ENHANCED BUBBLE APERTURE SIZING =====
  // Enhanced bubble size with multi-wave expansion patterns
  float baseBubbleSize = 0.08 * intensity;
  float primaryPulse = sin(time * 1.5) * 0.35;
  float organicPulse = sin(time * 0.8) * 0.25;
  float consciousnessPulse = sin(time * 2.2) * 0.15;
  
  float expandedBubbleSize = baseBubbleSize * (1.0 + primaryPulse + organicPulse + consciousnessPulse);
  
  // Create clean circular apertures with enhanced soft edges
  float primaryBubbleMask = 1.0 - smoothstep(expandedBubbleSize * 0.6, expandedBubbleSize * 1.1, minBubbleDistance);
  
  // ===== ENHANCED SECONDARY BUBBLE LAYER =====
  // Add smaller secondary bubbles with organic movement
  float secondaryBubbleCount = 4.0 + floor(intensity * 1.0); // 4-5 secondary bubbles
  float baseSecondaryRadius = 0.15;
  float secondaryRingRadius = baseSecondaryRadius * (1.0 + sin(time * 0.12) * 0.3);
  float minSecondaryDistance = 2.0;
  
  for(float i = 0.0; i < secondaryBubbleCount; i += 1.0) {
    // Counter-rotating secondary bubbles with organic offset
    float secondaryAngle = (i / secondaryBubbleCount) * 2.0 * 3.14159 - time * 0.15 + 1.57;
    
    // Add organic wobble to secondary bubble positions
    float wobbleX = sin(time * 0.45 + i * 1.1) * 0.02;
    float wobbleY = cos(time * 0.55 + i * 0.8) * 0.02;
    
    vec2 secondaryCenter = vec2(0.5) + vec2(
      cos(secondaryAngle) * secondaryRingRadius + wobbleX,
      sin(secondaryAngle) * secondaryRingRadius + wobbleY
    );
    
    float distanceToSecondary = length(uv - secondaryCenter);
    minSecondaryDistance = min(minSecondaryDistance, distanceToSecondary);
  }
  
  float secondaryBubbleSize = baseBubbleSize * 0.5 * (1.0 + sin(time * 1.8) * 0.3);
  float secondaryBubbleMask = 1.0 - smoothstep(secondaryBubbleSize * 0.6, secondaryBubbleSize * 1.0, minSecondaryDistance);
  secondaryBubbleMask *= 0.75; // Make secondary bubbles dimmer for depth
  
  // ===== ENHANCED CENTER SPOTLIGHT BUBBLE =====
  // Enhanced central bubble with complex pulsing patterns
  float centerDistance = length(uv - vec2(0.5));
  float centerPrimaryPulse = sin(time * 2.0) * 0.4;
  float centerSecondaryPulse = sin(time * 3.5) * 0.2;
  float centerBreathingPulse = sin(time * 0.6) * 0.3;
  
  float centerBubbleSize = 0.06 * intensity * (1.0 + centerPrimaryPulse + centerSecondaryPulse + centerBreathingPulse);
  float centerBubbleMask = 1.0 - smoothstep(centerBubbleSize * 0.4, centerBubbleSize * 0.9, centerDistance);
  
  // ===== ENHANCED COMBINATION AND BLENDING =====
  // Use smooth maximum for organic blending instead of hard max
  float corridorMask = primaryBubbleMask;
  corridorMask = max(corridorMask, secondaryBubbleMask * 0.9);
  corridorMask = max(corridorMask, centerBubbleMask * 1.1); // Center bubble slightly stronger
  
  // Enhanced radial falloff with organic variation
  vec2 center = uv - vec2(0.5);
  float radialDistance = length(center);
  float organicVariation = sin(time * 0.3 + radialDistance * 8.0) * 0.05;
  float radialFalloff = 1.0 - smoothstep(0.0, 0.65 + organicVariation, radialDistance);
  corridorMask *= radialFalloff;
  
  // Enhanced organic breathing pattern with consciousness harmonics
  float primaryBreathing = sin(time * 0.4) * 0.15;
  float secondaryBreathing = sin(time * 0.25) * 0.08;
  float consciousnessBreathing = sin(time * 0.6) * 0.05;
  float breathingCycle = 0.85 + primaryBreathing + secondaryBreathing + consciousnessBreathing;
  corridorMask *= breathingCycle;
  
  // Add subtle noise variation for organic consciousness texture
  float noisePattern = sin(radialDistance * 12.0 + time * 0.5) * cos(radialDistance * 8.0 - time * 0.3) * 0.03;
  corridorMask += noisePattern * intensity * 0.5;
  
  return clamp(corridorMask, 0.0, 1.0);
}

// Perspective depth calculation for inward flow
float calculatePerspectiveDepth(vec2 uv, float time, float flowStrength) {
  vec2 polar = toPolar(uv);
  float radius = polar.y;
  
  // Create perspective tunnel effect
  float depth = 1.0 - radius;
  depth = pow(depth, 2.2); // Gamma correction for natural falloff
  
  // Add inward flow animation
  float flowPhase = time * flowStrength + radius * 8.0;
  depth += sin(flowPhase) * 0.05 * (1.0 - radius);
  
  return clamp(depth, 0.0, 1.0);
}

// Dynamic aperture sizing based on music response
float musicResponsiveAperture(float baseMask, float beatIntensity, float bassResponse) {
  // Beat response expands apertures
  float beatExpansion = 1.0 + beatIntensity * 0.3;
  
  // Bass response adds pulsing
  float bassPulse = sin(bassResponse * 10.0) * 0.1;
  
  // Apply modulations
  float responsiveMask = baseMask * beatExpansion + bassPulse;
  
  return clamp(responsiveMask, 0.0, 1.0);
}

// ===================================================================
// DUNGEON CORRIDOR TUNNEL FUNCTIONS
// ===================================================================

// Signed distance field for rounded rectangle (corridor tunnel shape)
float roundedRectangleSDF(vec2 uv, vec2 center, vec2 size, float radius) {
  vec2 d = abs(uv - center) - size;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

// Apply perspective transformation for 3D tunnel illusion
vec2 perspectiveTunnelTransform(vec2 uv, float depth, float focalLength) {
  // Transform to centered coordinates
  vec2 centered = uv - 0.5;
  
  // Apply perspective projection with vanishing point at center
  float perspectiveFactor = focalLength / (focalLength + depth);
  vec2 perspective = centered * perspectiveFactor;
  
  // Return to UV space
  return perspective + 0.5;
}

// Calculate surface normal from SDF for lighting
vec2 tunnelNormalFromSDF(vec2 uv, vec2 center, vec2 size, float radius) {
  const float epsilon = 0.001;
  
  float centerSDF = roundedRectangleSDF(uv, center, size, radius);
  float rightSDF = roundedRectangleSDF(uv + vec2(epsilon, 0.0), center, size, radius);
  float upSDF = roundedRectangleSDF(uv + vec2(0.0, epsilon), center, size, radius);
  
  return normalize(vec2(rightSDF - centerSDF, upSDF - centerSDF));
}

// Advanced lighting system for dungeon corridors
vec3 calculateTunnelLighting(vec2 uv, float tunnelMask, vec2 normal, float depth, float time, float intensity) {
  // ===== AMBIENT SHADOW LAYER =====
  // Create dark base for corridor walls
  float ambientShadow = 0.15; // Base darkness level
  vec3 shadowColor = vec3(0.05, 0.08, 0.12); // Cool blue-gray shadows
  
  // ===== EDGE HIGHLIGHT LAYER =====
  // Bright rim lighting along corridor edges using surface normals
  float edgeIntensity = 1.0 - smoothstep(0.0, 0.3, tunnelMask);
  float edgeHighlight = pow(edgeIntensity, 2.0) * 0.8;
  
  // Edge lighting color shifts with music (warmer for high energy)
  vec3 edgeLightColor = mix(
    vec3(0.4, 0.5, 0.8), // Cool blue edge light
    vec3(0.8, 0.6, 0.3), // Warm orange edge light
    intensity * 0.7
  );
  
  // ===== END LIGHT SOURCE =====
  // Dynamic light at tunnel end that pulses with music
  float distanceFromCenter = length(uv - vec2(0.5));
  float endLightFalloff = 1.0 / (1.0 + distanceFromCenter * 4.0); // Inverse square falloff
  
  // Music-responsive light intensity with breathing effect
  float lightPulse = sin(time * 2.0) * 0.3 + 0.7;
  float endLightIntensity = intensity * lightPulse * endLightFalloff;
  
  // End light color temperature (cooler when distant, warmer when close)
  vec3 endLightColor = mix(
    vec3(0.3, 0.4, 0.9), // Cool distant light
    vec3(0.9, 0.7, 0.4), // Warm close light  
    endLightIntensity
  );
  
  // ===== FRESNEL EFFECT =====
  // Edge lighting intensity based on viewing angle
  vec2 viewDirection = normalize(uv - vec2(0.5));
  float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 2.0);
  
  // ===== COMBINE LIGHTING LAYERS =====
  vec3 ambientLayer = shadowColor * ambientShadow;
  vec3 edgeLayer = edgeLightColor * edgeHighlight * fresnel;
  vec3 endLayer = endLightColor * endLightIntensity * tunnelMask;
  
  // Apply depth-based attenuation
  float depthAttenuation = 1.0 - smoothstep(0.0, 1.0, depth);
  
  return (ambientLayer + edgeLayer + endLayer) * depthAttenuation;
}

// Create multiple dungeon corridor tunnels with realistic lighting
float dungeonCorridorTunnels(vec2 uv, float time, float intensity) {
  // ===== MAIN CORRIDOR TUNNELS =====
  float corridorCount = 4.0;
  float minCorridorDistance = 2.0;
  
  for(float i = 0.0; i < corridorCount; i += 1.0) {
    float corridorAngle = (i / corridorCount) * 2.0 * 3.14159 + time * 0.05;
    
    // Corridor center position with slight offset for organic feel
    vec2 corridorOffset = vec2(
      cos(corridorAngle) * 0.25,
      sin(corridorAngle) * 0.25
    );
    vec2 corridorCenter = vec2(0.5) + corridorOffset;
    
    // Apply perspective transformation for depth illusion
    float depth = 0.3 + sin(time * 0.3 + i) * 0.1;
    vec2 perspectiveUV = perspectiveTunnelTransform(uv, depth, 2.0);
    
    // Create elongated corridor tunnel shape
    vec2 corridorSize = vec2(0.15, 0.04) * (1.0 + intensity * 0.3); // Width varies with music
    float cornerRadius = 0.01;
    
    // Calculate distance to this corridor tunnel
    float corridorDistance = roundedRectangleSDF(perspectiveUV, corridorCenter, corridorSize, cornerRadius);
    minCorridorDistance = min(minCorridorDistance, corridorDistance);
  }
  
  // ===== SECONDARY TUNNEL LAYER =====
  // Add smaller secondary tunnels for depth complexity
  float secondaryCount = 2.0;
  float minSecondaryDistance = 2.0;
  
  for(float i = 0.0; i < secondaryCount; i += 1.0) {
    float secondaryAngle = (i / secondaryCount) * 2.0 * 3.14159 + time * 0.08 + 1.57;
    
    vec2 secondaryOffset = vec2(
      cos(secondaryAngle) * 0.15,
      sin(secondaryAngle) * 0.15  
    );
    vec2 secondaryCenter = vec2(0.5) + secondaryOffset;
    
    // Deeper perspective for secondary tunnels
    float secondaryDepth = 0.5 + sin(time * 0.2 + i) * 0.1;
    vec2 secondaryPerspectiveUV = perspectiveTunnelTransform(uv, secondaryDepth, 2.5);
    
    vec2 secondarySize = vec2(0.08, 0.025) * (1.0 + intensity * 0.2);
    float secondaryDistance = roundedRectangleSDF(secondaryPerspectiveUV, secondaryCenter, secondarySize, 0.005);
    minSecondaryDistance = min(minSecondaryDistance, secondaryDistance);
  }
  
  // ===== COMBINE TUNNEL LAYERS =====
  float primaryMask = 1.0 - smoothstep(0.0, 0.02, minCorridorDistance);
  float secondaryMask = 1.0 - smoothstep(0.0, 0.015, minSecondaryDistance);
  secondaryMask *= 0.7; // Dimmer secondary tunnels
  
  float combinedMask = max(primaryMask, secondaryMask);
  
  // ===== RADIAL FALLOFF FOR FOCUS =====
  vec2 center = uv - vec2(0.5);
  float radialDistance = length(center);
  float radialFalloff = 1.0 - smoothstep(0.2, 0.8, radialDistance);
  
  // ===== ORGANIC BREATHING PATTERN =====
  float breathingCycle = 0.9 + sin(time * 0.4) * 0.1;
  
  return clamp(combinedMask * radialFalloff * breathingCycle, 0.0, 1.0);
}

// Enhanced corridor gradient reveal with advanced dual-layer blending
vec4 corridorGradientReveal(vec2 uv, sampler2D gradientTex, float corridorMask, float time, float intensity) {
  // ===== ENHANCED BASE LAYER: Musical flow with consciousness awareness =====
  vec2 baseFlowUV = uv;
  vec2 flowDirection = normalize(vec2(1.0, 0.0));
  
  // Enhanced musical flow with multi-frequency modulation
  #ifdef HAS_FLOW_UNIFORMS
    flowDirection = normalize(u_musicalFlow.xy + vec2(0.001, 0.0));
  #endif
  
  // Multi-layered flow animation with consciousness patterns
  float primaryFlow = sin(time * 0.1) * 0.02;
  float organicFlow = sin(time * 0.07) * 0.015;
  float consciousnessFlow = sin(time * 0.13) * 0.008;
  
  baseFlowUV += flowDirection * (primaryFlow + organicFlow + consciousnessFlow);
  vec4 baseGradient = texture(gradientTex, vec2(baseFlowUV.x, 0.5));
  
  // Enhanced base layer with depth awareness
  vec2 polar = toPolar(uv);
  float baseDepthModulation = 1.0 + polar.y * 0.2; // Subtle depth variation
  baseGradient.rgb *= baseDepthModulation;
  
  // ===== ENHANCED CORRIDOR LAYER: Multi-dimensional inward flow =====
  float angle = polar.x;
  float radius = polar.y;
  
  // Advanced inward flow with multi-phase animation
  float primaryInwardPhase = time * 0.15 + radius * 6.0;
  float secondaryInwardPhase = time * 0.08 + radius * 4.5;
  float consciousnessInwardPhase = time * 0.22 + radius * 8.0;
  
  // Multi-layered inward flow combining multiple patterns
  float primaryInwardFlow = radius - (sin(primaryInwardPhase) * 0.1);
  float secondaryInwardFlow = radius - (cos(secondaryInwardPhase) * 0.06);
  float consciousnessInwardFlow = radius - (sin(consciousnessInwardPhase) * 0.04);
  
  float combinedInwardFlow = mix(
    mix(primaryInwardFlow, secondaryInwardFlow, 0.3),
    consciousnessInwardFlow, 0.2
  );
  
  // Enhanced gradient sampling with dual-layer coordination
  vec2 corridorFlowUV = vec2(
    fract(angle / (2.0 * 3.14159) + time * 0.02), // Slow rotation for organic feel
    clamp(combinedInwardFlow, 0.0, 1.0)
  );
  vec4 corridorGradient = texture(gradientTex, corridorFlowUV);
  
  // ===== ADVANCED DEPTH AND PERSPECTIVE =====
  float depth = calculatePerspectiveDepth(uv, time, intensity);
  
  // Enhanced tunnel brightness with organic variation
  float organicBrightnessVariation = sin(angle * 3.0 + time * 0.3) * 0.1;
  float tunnelBrightness = 1.0 + depth * 0.9 + organicBrightnessVariation;
  corridorGradient.rgb *= tunnelBrightness;
  
  // Advanced color shift with consciousness-aware color temperature
  vec3 warmShift = vec3(1.15, 1.05, 0.85); // Warm center
  vec3 coolShift = vec3(0.9, 1.0, 1.1);    // Cool edges
  vec3 colorTemperature = mix(coolShift, warmShift, depth);
  corridorGradient.rgb = mix(corridorGradient.rgb, corridorGradient.rgb * colorTemperature, depth * 0.4);
  
  // ===== ENHANCED DUAL-LAYER BLENDING =====
  // Multi-stage aperture masking for organic blending
  float softApertureMask = smoothstep(0.2, 0.8, corridorMask);
  float sharpApertureMask = smoothstep(0.4, 0.6, corridorMask);
  float organicApertureMask = mix(softApertureMask, sharpApertureMask, 0.6);
  
  // Enhanced blending with consciousness-aware mixing
  float consciousnessBlendFactor = 0.7 + sin(time * 0.4 + radius * 4.0) * 0.2;
  float dynamicIntensity = intensity * consciousnessBlendFactor;
  
  // Primary blend: base and corridor layers
  vec4 primaryBlend = mix(baseGradient, corridorGradient, organicApertureMask * dynamicIntensity);
  
  // ===== ADVANCED APERTURE EFFECTS =====
  // Enhanced rim lighting with organic variation 
  float rimLightBase = corridorMask * (1.0 - organicApertureMask);
  float rimLightVariation = sin(angle * 4.0 + time * 0.5) * 0.3 + 0.7;
  float enhancedRimLight = rimLightBase * rimLightVariation * 0.6;
  
  // Aperture glow effect for depth illusion
  float apertureGlow = softApertureMask * (1.0 - sharpApertureMask) * 0.4;
  vec3 glowColor = corridorGradient.rgb * 1.2;
  
  // ===== CONSCIOUSNESS-AWARE COLOR HARMONIZATION =====
  // Harmonize colors between layers for organic consciousness effect
  vec3 harmonizedColor = mix(
    primaryBlend.rgb,
    (primaryBlend.rgb + corridorGradient.rgb) * 0.5,
    organicApertureMask * 0.3
  );
  
  // Final composition with enhanced rim and glow effects
  vec4 finalColor = vec4(harmonizedColor, primaryBlend.a);
  finalColor.rgb += vec3(enhancedRimLight) * dynamicIntensity;
  finalColor.rgb += glowColor * apertureGlow * dynamicIntensity;
  
  // Organic breathing effect for consciousness integration
  float breathingCycle = 0.95 + sin(time * 0.3) * 0.05;
  finalColor.rgb *= breathingCycle;
  
  return finalColor;
}

// Advanced dungeon corridor gradient reveal with realistic lighting
vec4 dungeonCorridorGradientReveal(vec2 uv, sampler2D gradientTex, float corridorMask, float time, float intensity) {
  // ===== BASE LAYER: Dark stone/metal corridor walls =====
  vec4 baseWallColor = vec4(0.1, 0.12, 0.15, 1.0); // Dark stone base
  
  // ===== CORRIDOR TUNNEL CALCULATION =====
  // Use dungeon corridor tunnels instead of simple bubbles
  float tunnelMask = dungeonCorridorTunnels(uv, time, intensity);
  
  // ===== LIGHTING CALCULATION =====
  // Calculate lighting for tunnel areas
  vec2 tunnelCenter = vec2(0.5); // Simplified center for normal calculation
  vec2 tunnelSize = vec2(0.15, 0.04);
  vec2 surfaceNormal = tunnelNormalFromSDF(uv, tunnelCenter, tunnelSize, 0.01);
  
  float depth = length(uv - vec2(0.5)) * 0.5; // Distance-based depth
  vec3 tunnelLighting = calculateTunnelLighting(uv, tunnelMask, surfaceNormal, depth, time, intensity);
  
  // ===== CORRIDOR LAYER: Inward flowing magical light =====
  // Convert to polar coordinates for inward flow calculation
  vec2 polar = toPolar(uv);
  float angle = polar.x;
  float radius = polar.y;
  
  // Create magical inward flow animation - light streams toward center
  float magicalFlowPhase = time * 0.2 + radius * 8.0; // Faster flow for magical effect
  float inwardFlow = radius - (sin(magicalFlowPhase) * 0.15); // More dramatic flow
  
  // Sample gradient using inward flow for magical light colors
  vec2 corridorFlowUV = vec2(
    angle / (2.0 * 3.14159), // Normalize angle for gradient sampling
    clamp(inwardFlow, 0.0, 1.0) // Use inward flow for magical color variation
  );
  vec4 magicalLightGradient = texture(gradientTex, corridorFlowUV);
  
  // ===== ENHANCE MAGICAL LIGHT WITH MUSIC RESPONSIVENESS =====
  // Enhance magical light colors based on music intensity
  magicalLightGradient.rgb *= 1.5 + intensity * 0.8; // Brighter with music
  
  // Add magical shimmer effect
  float shimmerPhase = time * 4.0 + uv.x * 10.0 + uv.y * 8.0;
  float shimmer = sin(shimmerPhase) * 0.1 + 0.9;
  magicalLightGradient.rgb *= shimmer;
  
  // ===== DEPTH AND PERSPECTIVE EFFECTS =====
  float perspectiveDepth = calculatePerspectiveDepth(uv, time, intensity * 1.2);
  
  // Enhance magical light with depth - brighter toward tunnel end
  float tunnelEndBrightness = 1.0 + perspectiveDepth * 1.5;
  magicalLightGradient.rgb *= tunnelEndBrightness;
  
  // ===== CORRIDOR WALL TEXTURING =====
  // Add stone/metal texture to walls using noise-like patterns
  float wallTexturePhase = uv.x * 20.0 + uv.y * 15.0;
  float wallTexture = sin(wallTexturePhase) * 0.1 + 0.9;
  baseWallColor.rgb *= wallTexture;
  
  // ===== ADVANCED APERTURE BLENDING =====
  // Smooth tunnel aperture with realistic falloff
  float apertureMask = smoothstep(0.1, 0.8, tunnelMask);
  
  // ===== LIGHTING INTEGRATION =====
  // Apply calculated lighting to both wall and magical light
  vec4 litWallColor = baseWallColor;
  litWallColor.rgb += tunnelLighting; // Add ambient shadows, edge highlights, end illumination
  
  // Blend wall color with magical light streaming through tunnels
  vec4 finalColor = mix(litWallColor, magicalLightGradient, apertureMask * intensity);
  
  // ===== RIM LIGHTING FOR DEPTH ILLUSION =====
  // Enhanced rim lighting around tunnel apertures
  float rimIntensity = tunnelMask * (1.0 - apertureMask) * 0.8;
  vec3 rimColor = mix(
    vec3(0.3, 0.4, 0.8), // Cool rim light
    vec3(0.8, 0.5, 0.2), // Warm rim light
    intensity
  );
  finalColor.rgb += rimColor * rimIntensity;
  
  // ===== ATMOSPHERIC PERSPECTIVE =====
  // Add slight fog/haze effect for distance illusion
  float atmosphericHaze = depth * 0.2;
  vec3 hazeColor = vec3(0.15, 0.18, 0.25);
  finalColor.rgb = mix(finalColor.rgb, hazeColor, atmosphericHaze);
  
  return finalColor;
}`;

/**
 * Common uniform declarations for consciousness systems
 */
export const STANDARD_CONSCIOUSNESS_UNIFORMS = `
// Time and resolution (universal)
uniform float u_time;
uniform vec2 u_resolution;

// Enhanced consciousness field uniforms
uniform float u_rhythmicPulse;
uniform vec2 u_musicalFlow;
uniform float u_energyResonance;
uniform float u_breathingCycle;
uniform float u_membraneFluidityIndex;

// Advanced consciousness control uniforms
uniform float u_consciousnessLevel;        // 0-1 current consciousness intensity
uniform float u_awarenessLevel;           // 0-1 current awareness depth
uniform float u_emotionalIntensity;       // 0-1 emotional resonance strength
uniform float u_memoryIntensity;          // 0-1 consciousness memory patterns
uniform vec2 u_temporalFlowDirection;     // Year 3000 temporal stream direction
uniform float u_consciousnessTemperature; // Color temperature shift from consciousness

// Enhanced music sync uniforms
uniform float u_musicEnergy;
uniform float u_musicValence;
uniform float u_beatIntensity;
uniform float u_bassResponse;
uniform float u_musicalConsciousnessSync; // Music-consciousness synchronization level
uniform float u_genreConsciousnessShift;  // Genre-specific consciousness adjustments

// Corridor-specific uniforms
uniform float u_corridorIntensity;
uniform float u_corridorFlowStrength;
uniform float u_corridorDepthEffect;
uniform float u_corridorBubbleScale;

// Dungeon corridor uniforms
uniform float u_dungeonEnabled;
uniform float u_tunnelWidth;
uniform float u_lightingIntensity;
uniform float u_atmosphericHaze;
uniform vec3 u_wallColor;`;

// ===================================================================
// SHADER TEMPLATE SYSTEM
// ===================================================================

/**
 * Shader template builder for consciousness systems
 * Eliminates duplicate shader construction patterns
 */
export class ShaderTemplate {
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
    includeCorridorFunctions?: boolean;
  }): string {
    const {
      precision = 'precision mediump float;',
      additionalUniforms = '',
      additionalFunctions = '',
      mainShaderLogic,
      includeNoiseFunctions = true,
      includeConsciousnessFunctions = true,
      includeCorridorFunctions = false
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
    
    // Add corridor SDF functions if requested
    if (includeCorridorFunctions) {
      shader += CORRIDOR_SDF_FUNCTIONS + '\n\n';
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
   * Generate enhanced standard uniform names list for consciousness systems
   */
  public static getStandardUniformNames(): string[] {
    return [
      'u_time', 'u_resolution', 'u_rhythmicPulse', 'u_musicalFlow',
      'u_energyResonance', 'u_breathingCycle', 'u_membraneFluidityIndex',
      'u_consciousnessLevel', 'u_awarenessLevel', 'u_emotionalIntensity', 'u_memoryIntensity',
      'u_temporalFlowDirection', 'u_consciousnessTemperature',
      'u_musicEnergy', 'u_musicValence', 'u_beatIntensity', 'u_bassResponse',
      'u_musicalConsciousnessSync', 'u_genreConsciousnessShift'
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

  /**
   * Get corridor-specific uniform names for system coordination
   * @returns Array of uniform names used in corridor shaders
   */
  public static getCorridorUniformNames(): string[] {
    return [
      // Standard consciousness uniforms
      'u_time', 'u_resolution', 'u_gradientTex',
      'u_rhythmicPulse', 'u_musicalFlow', 'u_energyResonance', 'u_breathingCycle', 'u_membraneFluidityIndex',
      'u_musicEnergy', 'u_musicValence', 'u_beatIntensity', 'u_bassResponse',
      // Corridor-specific uniforms
      'u_corridorIntensity', 'u_corridorFlowStrength', 'u_corridorDepthEffect', 'u_corridorBubbleScale'
    ];
  }

  /**
   * Get dungeon corridor-specific uniform names for advanced tunnel effects
   * @returns Array of uniform names used in dungeon corridor shaders
   */
  public static getDungeonCorridorUniformNames(): string[] {
    return [
      // Include all corridor uniforms
      ...this.getCorridorUniformNames(),
      // Dungeon-specific uniforms
      'u_dungeonEnabled', 'u_tunnelWidth', 'u_lightingIntensity', 'u_atmosphericHaze', 'u_wallColor'
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
   * Enhanced consciousness-driven flow calculation with Year 3000 patterns
   */
  public static consciousnessFlowLogic(): string {
    return `
  // Calculate enhanced consciousness-driven flow
  vec2 flowDirection = calculateMusicalFlow(vec2(1.0, 0.5), u_musicalFlow, 0.5);
  float flowStrength = rhythmicPulseModulation(0.5, u_rhythmicPulse, 0.3);
  
  // Add temporal flow patterns for Year 3000 effects
  vec2 temporalFlow = temporalFlowDirection(uv, u_time, u_temporalFlowDirection);
  flowDirection += temporalFlow;
  
  // Apply enhanced breathing modulation with emotional resonance
  float breathingMod = deepConsciousnessBreathing(u_time, 0.0, u_emotionalIntensity);
  flowStrength *= (1.0 + breathingMod);
  
  // Apply consciousness field intensity
  float fieldIntensity = consciousnessFieldIntensity(uv, u_time, u_musicEnergy);
  flowStrength *= (0.5 + fieldIntensity * 0.5);`;
  }

  /**
   * Enhanced noise-based texture sampling with advanced consciousness patterns
   */
  public static consciousnessNoiseSampling(): string {
    return `
  // Generate enhanced consciousness-modulated noise
  vec2 noiseUV = uv + flowDirection * u_time * 0.03;
  
  // Multi-layered consciousness noise patterns
  float noise1 = snoise(noiseUV * 2.0);
  float noise2 = snoise(noiseUV * 4.0) * 0.5;
  float memoryNoise = snoise(noiseUV * 1.5 + u_time * 0.01) * u_memoryIntensity * 0.3;
  
  // Apply consciousness field modulation
  float consciousnessModulation = consciousnessFieldIntensity(noiseUV, u_time, u_musicEnergy);
  
  // Combine noise with enhanced consciousness influence
  float t = (noise1 + noise2 + memoryNoise) * energyResonanceModulation(1.0, u_energyResonance, 0.5, 1.5);
  t *= consciousnessModulation;
  t = clamp(t * 0.5 + 0.5, 0.0, 1.0);`;
  }

  /**
   * Enhanced consciousness-aware vignette with membrane dynamics
   */
  public static consciousnessVignette(): string {
    return `
  // Apply enhanced consciousness-aware vignette
  vec2 center = uv - 0.5;
  float breathing = deepConsciousnessBreathing(u_time, u_breathingCycle, u_emotionalIntensity);
  
  // Add membrane consciousness flow for organic boundaries
  float membraneFlow = membraneConsciousnessFlow(uv, u_membraneFluidityIndex, u_awarenessLevel);
  
  // Calculate consciousness-aware vignette with membrane dynamics
  float vignette = (0.9 + breathing + membraneFlow) - dot(center, center) * 0.3;
  
  // Apply awareness resonance to color
  color.rgb = awarenessResonance(color.rgb, u_consciousnessLevel, u_musicEnergy);
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

  /**
   * Corridor bubble consciousness fragment
   * Inward-flowing corridor effect with bubble apertures
   */
  public static corridorBubbleFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // Calculate corridor bubble mask
  float corridorMask = bubbleCorridors(uv, u_time, u_corridorIntensity * u_corridorBubbleScale);
  
  // Apply music-responsive aperture modulation
  corridorMask = musicResponsiveAperture(corridorMask, u_beatIntensity, u_bassResponse);
  
  // Generate corridor gradient reveal effect
  vec4 color = corridorGradientReveal(uv, u_gradientTex, corridorMask, u_time, u_corridorIntensity);
  
  // Apply consciousness effects
  ${ShaderLogicPatterns.consciousnessVignette()}
  
  // Enhanced music responsiveness for corridor effects
  float corridorMusicAlpha = 0.85 + u_beatIntensity * 0.15 + u_bassResponse * 0.05;
  color.a *= corridorMusicAlpha;
  
  // Apply corridor depth effect for enhanced dimensionality
  float depth = calculatePerspectiveDepth(uv, u_time, u_corridorFlowStrength);
  color.rgb = mix(color.rgb, color.rgb * (1.0 + depth * 0.3), u_corridorDepthEffect);
  
  fragColor = color;`;
  }

  /**
   * Dungeon corridor consciousness fragment
   * Advanced tunnel corridors with realistic lighting and magical light sources  
   */
  public static dungeonCorridorFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // Calculate dungeon corridor tunnel mask
  float corridorMask = dungeonCorridorTunnels(uv, u_time, u_corridorIntensity * u_corridorBubbleScale);
  
  // Apply music-responsive corridor modulation  
  corridorMask = musicResponsiveAperture(corridorMask, u_beatIntensity, u_bassResponse);
  
  // Generate advanced dungeon corridor gradient reveal effect with realistic lighting
  vec4 color = dungeonCorridorGradientReveal(uv, u_gradientTex, corridorMask, u_time, u_corridorIntensity);
  
  // Apply consciousness effects for organic integration
  ${ShaderLogicPatterns.consciousnessVignette()}
  
  // Enhanced music responsiveness for dungeon atmosphere
  float dungeonMusicAlpha = 0.9 + u_beatIntensity * 0.1 + u_bassResponse * 0.05;
  color.a *= dungeonMusicAlpha;
  
  // Apply corridor depth effect for enhanced dimensionality
  float depth = calculatePerspectiveDepth(uv, u_time, u_corridorFlowStrength);
  color.rgb = mix(color.rgb, color.rgb * (1.0 + depth * 0.4), u_corridorDepthEffect);
  
  // Add subtle magical shimmer for mystical atmosphere
  float magicalShimmer = sin(u_time * 5.0 + uv.x * 12.0 + uv.y * 8.0) * 0.05 + 0.95;
  color.rgb *= magicalShimmer;
  
  fragColor = color;`;
  }

  /**
   * Advanced consciousness field fragment
   * Multi-dimensional consciousness patterns with Year 3000 temporal effects
   */
  public static advancedConsciousnessFieldFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // Calculate multi-dimensional consciousness field
  float consciousnessField = consciousnessFieldIntensity(uv, u_time, u_musicEnergy);
  
  // Apply temporal flow effects for Year 3000 streaming
  vec2 temporalUV = uv + temporalFlowDirection(uv, u_time, u_temporalFlowDirection);
  
  // Enhanced consciousness noise sampling with memory patterns
  ${ShaderLogicPatterns.consciousnessNoiseSampling()}
  
  // Sample gradient with consciousness field modulation
  vec4 color = texture(u_gradientTex, vec2(t * consciousnessField, 0.5));
  
  // Apply awareness resonance for consciousness-aware color
  color.rgb = awarenessResonance(color.rgb, u_consciousnessLevel, u_musicEnergy);
  
  // Enhanced membrane consciousness effects
  float membraneEffect = membraneConsciousnessFlow(temporalUV, u_membraneFluidityIndex, u_awarenessLevel);
  color.rgb *= (1.0 + membraneEffect * 0.3);
  
  // Apply consciousness memory breathing
  float memoryBreathing = consciousnessMemoryBreathing(u_time, u_breathingCycle, u_memoryIntensity);
  color.a *= (0.8 + memoryBreathing * 0.2 + u_beatIntensity * 0.1);
  
  // Enhanced consciousness vignette
  ${ShaderLogicPatterns.consciousnessVignette()}
  
  fragColor = color;`;
  }

  /**
   * Membrane consciousness dynamics fragment
   * Organic boundary system with consciousness-aware membrane behavior
   */
  public static membraneConsciousnessDynamicsFragment(): string {
    return `
  ${ShaderLogicPatterns.consciousnessFlowLogic()}
  
  // Calculate membrane consciousness position with flow
  vec2 membraneUV = uv;
  membraneUV += temporalFlowDirection(uv, u_time, u_temporalFlowDirection);
  
  // Apply membrane consciousness flow for organic boundaries
  float membraneFlow = membraneConsciousnessFlow(membraneUV, u_membraneFluidityIndex, u_awarenessLevel);
  membraneUV += vec2(membraneFlow * 0.02);
  
  // Enhanced noise sampling with membrane distortion
  vec2 noiseUV = membraneUV + flowDirection * u_time * 0.03;
  float membraneNoise = snoise(noiseUV * 3.0 + membraneFlow);
  float consciousnessNoise = snoise(noiseUV * 1.5) * u_consciousnessLevel;
  
  // Combine membrane and consciousness noise
  float t = (membraneNoise * 0.6 + consciousnessNoise * 0.4) * 0.5 + 0.5;
  t = clamp(t, 0.0, 1.0);
  
  // Sample gradient with membrane consciousness modulation
  vec4 color = texture(u_gradientTex, vec2(t, 0.5));
  
  // Apply consciousness field influence to membrane
  float fieldInfluence = consciousnessFieldIntensity(membraneUV, u_time, u_musicEnergy);
  color.rgb = awarenessResonance(color.rgb, fieldInfluence, u_musicEnergy);
  
  // Enhanced membrane breathing with emotional resonance
  float membraneBreathing = deepConsciousnessBreathing(u_time, u_breathingCycle, u_emotionalIntensity);
  color.rgb *= (0.9 + membraneBreathing * 0.2 + membraneFlow * 0.1);
  
  // Musical consciousness synchronization
  color.a *= (0.85 + u_musicalConsciousnessSync * 0.15 + u_beatIntensity * 0.1);
  
  // Apply enhanced vignette with membrane dynamics
  ${ShaderLogicPatterns.consciousnessVignette()}
  
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
    return ShaderTemplate.buildFragmentShader({
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
/**
 * Enhanced shader library with advanced consciousness patterns
 */
export const CONSCIOUSNESS_SHADER_LIBRARY = {
  // Templates and builders
  Template: ShaderTemplate,
  
  // Shared components
  VERTEX_SHADER: STANDARD_CONSCIOUSNESS_VERTEX_SHADER,
  NOISE_FUNCTIONS: SHARED_NOISE_FUNCTIONS,
  CONSCIOUSNESS_FUNCTIONS: CONSCIOUSNESS_MODULATION_FUNCTIONS,
  CORRIDOR_FUNCTIONS: CORRIDOR_SDF_FUNCTIONS,
  STANDARD_UNIFORMS: STANDARD_CONSCIOUSNESS_UNIFORMS,
  
  // Logic patterns
  LogicPatterns: ShaderLogicPatterns,
  
  // Enhanced consciousness fragments
  Fragments: ConsciousnessShaderFragments,
  
  // Optimization utilities
  Optimization: ShaderOptimizationUtils,
  
  // Advanced consciousness effects
  AdvancedEffects: {
    CONSCIOUSNESS_FIELD_PATTERNS: [
      'consciousnessFieldIntensity',
      'awarenessResonance', 
      'temporalFlowDirection',
      'membraneConsciousnessFlow',
      'consciousnessMemoryBreathing'
    ],
    YEAR_3000_PATTERNS: [
      'temporalFlowDirection',
      'consciousnessMemoryBreathing',
      'deepConsciousnessBreathing'
    ],
    MEMBRANE_DYNAMICS: [
      'membraneConsciousnessFlow',
      'membraneFluidityEffect'
    ]
  }
};

// Classes and utilities are already exported above as part of their declarations