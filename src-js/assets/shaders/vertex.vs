#version 300 es
precision mediump float;

// Attributes
in vec2 a_position;
in vec2 a_texCoord;

// Varyings
out vec2 v_texCoord;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // Pass texture coordinates to fragment shader
  v_texCoord = a_texCoord;
  
  // Convert from pixel coordinates to clip space
  vec2 clipSpace = ((a_position / u_resolution) * 2.0) - 1.0;
  
  // Flip Y coordinate (WebGL Y axis is inverted)
  clipSpace.y *= -1.0;
  
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}