/**
 * ShaderLoader - Lightweight WebGL shader compilation utility
 * Part of the Year 3000 System WebGL pipeline
 */

import { Y3K } from '@/debug/SystemHealthMonitor';

// Raw shader loading for esbuild
declare module '*.fs' {
  const content: string;
  export default content;
}

interface ShaderCache {
  [key: string]: WebGLShader;
}

export class ShaderLoader {
  private static cache: Map<WebGL2RenderingContext, ShaderCache> = new Map();

  /**
   * Load and compile a fragment shader from source
   * @param gl WebGL2 rendering context
   * @param source GLSL fragment shader source code
   * @param cacheKey Optional cache key (defaults to hash of source)
   * @returns Compiled WebGL shader or null on failure
   */
  static loadFragment(
    gl: WebGL2RenderingContext, 
    source: string, 
    cacheKey?: string
  ): WebGLShader | null {
    const key = cacheKey || this.hashSource(source);
    
    // Check cache first
    const contextCache = this.getContextCache(gl);
    if (contextCache[key]) {
      return contextCache[key];
    }

    try {
      const shader = this.compileShader(gl, gl.FRAGMENT_SHADER, source);
      if (shader) {
        contextCache[key] = shader;
        Y3K?.debug?.log('ShaderLoader', `Fragment shader compiled: ${key.substring(0, 8)}...`);
      }
      return shader;
    } catch (error) {
      Y3K?.debug?.error('ShaderLoader', `Fragment shader compilation failed: ${error}`);
      return null;
    }
  }

  /**
   * Load and compile a vertex shader from source
   * @param gl WebGL2 rendering context
   * @param source GLSL vertex shader source code
   * @param cacheKey Optional cache key
   * @returns Compiled WebGL shader or null on failure
   */
  static loadVertex(
    gl: WebGL2RenderingContext, 
    source: string, 
    cacheKey?: string
  ): WebGLShader | null {
    const key = cacheKey || this.hashSource(source);
    
    const contextCache = this.getContextCache(gl);
    if (contextCache[key]) {
      return contextCache[key];
    }

    try {
      const shader = this.compileShader(gl, gl.VERTEX_SHADER, source);
      if (shader) {
        contextCache[key] = shader;
        Y3K?.debug?.log('ShaderLoader', `Vertex shader compiled: ${key.substring(0, 8)}...`);
      }
      return shader;
    } catch (error) {
      Y3K?.debug?.error('ShaderLoader', `Vertex shader compilation failed: ${error}`);
      return null;
    }
  }

  /**
   * Create a shader program from vertex and fragment shaders
   * @param gl WebGL2 rendering context
   * @param vertexShader Compiled vertex shader
   * @param fragmentShader Compiled fragment shader
   * @returns WebGL program or null on failure
   */
  static createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    try {
      const program = gl.createProgram();
      if (!program) return null;

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`Program linking failed: ${info}`);
      }

      return program;
    } catch (error) {
      Y3K?.debug?.error('ShaderLoader', `Program creation failed: ${error}`);
      return null;
    }
  }

  /**
   * Clear shader cache for a specific WebGL context
   * @param gl WebGL2 rendering context
   */
  static clearCache(gl: WebGL2RenderingContext): void {
    const contextCache = this.cache.get(gl);
    if (contextCache) {
      // Clean up WebGL resources
      Object.values(contextCache).forEach(shader => {
        gl.deleteShader(shader);
      });
      this.cache.delete(gl);
    }
  }

  /**
   * Clear all shader caches (use on theme hot-reload)
   */
  static clearAllCaches(): void {
    this.cache.clear();
  }

  private static compileShader(
    gl: WebGL2RenderingContext, 
    type: number, 
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation failed: ${info}`);
    }

    return shader;
  }

  private static getContextCache(gl: WebGL2RenderingContext): ShaderCache {
    if (!this.cache.has(gl)) {
      this.cache.set(gl, {});
    }
    return this.cache.get(gl)!;
  }

  private static hashSource(source: string): string {
    // Simple hash for caching - not cryptographic
    let hash = 0;
    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}

/**
 * Default vertex shader for full-screen quad rendering
 */
export const DEFAULT_VERTEX_SHADER = `#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

/**
 * Create gradient texture from color stops
 * @param gl WebGL2 rendering context
 * @param stops Array of color stops [r, g, b, a, position]
 * @param width Texture width (default 256)
 * @returns WebGL texture or null on failure
 */
export function createGradientTexture(
  gl: WebGL2RenderingContext,
  stops: Array<{r: number, g: number, b: number, a: number, position: number}>,
  width: number = 256
): WebGLTexture | null {
  try {
    // Create canvas for gradient generation
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    stops.forEach(stop => {
      const color = `rgba(${Math.round(stop.r * 255)}, ${Math.round(stop.g * 255)}, ${Math.round(stop.b * 255)}, ${stop.a})`;
      gradient.addColorStop(stop.position, color);
    });

    // Fill canvas
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, 1);

    // Create WebGL texture
    const texture = gl.createTexture();
    if (!texture) return null;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
  } catch (error) {
    Y3K?.debug?.error('ShaderLoader', `Gradient texture creation failed: ${error}`);
    return null;
  }
}