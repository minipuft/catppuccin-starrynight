#version 300 es
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
}