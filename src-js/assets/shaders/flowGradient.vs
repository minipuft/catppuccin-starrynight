#version 300 es
precision mediump float;

// Attributes for fullscreen quad
in vec2 a_position;

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  // Create fullscreen quad from vertex positions (-1 to 1)
  gl_Position = vec4(a_position, 0.0, 1.0);
}