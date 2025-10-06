/**
 * ShaderLoader - Lightweight WebGL shader compilation utility
 * Part of the Year 3000 System WebGL pipeline
 */

import { Y3KDebug } from "@/debug/DebugCoordinator";

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
        Y3KDebug?.debug?.log(
          "ShaderLoader",
          `Fragment shader compiled: ${key.substring(0, 8)}...`
        );
      }
      return shader;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        `Fragment shader compilation failed: ${error}`
      );
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
        Y3KDebug?.debug?.log(
          "ShaderLoader",
          `Vertex shader compiled: ${key.substring(0, 8)}...`
        );
      }
      return shader;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        `Vertex shader compilation failed: ${error}`
      );
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
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        `Program creation failed: ${error}`
      );
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
      Object.values(contextCache).forEach((shader) => {
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

  /**
   * Clear shader cache for a specific WebGL context
   * This should be called when the WebGL context is lost to prevent
   * reusing invalid shader objects after context restoration
   */
  static clearContextCache(gl: WebGL2RenderingContext): void {
    if (this.cache.has(gl)) {
      const contextCache = this.cache.get(gl)!;

      // Clean up any existing shader objects (though they're invalid after context loss)
      Object.values(contextCache).forEach((shader) => {
        if (shader && gl && !gl.isContextLost()) {
          try {
            gl.deleteShader(shader);
          } catch (e) {
            // Ignore errors for invalid shaders
          }
        }
      });

      // Clear the cache for this context
      this.cache.set(gl, {});

      Y3KDebug?.debug?.log(
        "ShaderLoader",
        "Context cache cleared due to WebGL context loss/restore"
      );
    }
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
      hash = (hash << 5) - hash + char;
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
  stops: Array<{
    r: number;
    g: number;
    b: number;
    a: number;
    position: number;
  }>,
  width: number = 256
): WebGLTexture | null {
  try {
    // Validate inputs
    if (!gl) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "WebGL context is null or undefined"
      );
      return null;
    }

    if (!stops || stops.length === 0) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Invalid or empty color stops array"
      );
      return null;
    }

    if (width <= 0 || width > 8192) {
      // Reasonable texture size limit
      Y3KDebug?.debug?.error("ShaderLoader", `Invalid texture width: ${width}`);
      return null;
    }

    // Check WebGL context state
    const glError = gl.getError();
    if (glError !== gl.NO_ERROR) {
      Y3KDebug?.debug?.warn(
        "ShaderLoader",
        `WebGL context has pending error: ${glError}`
      );
    }

    // Validate WebGL context is not lost
    if (gl.isContextLost()) {
      Y3KDebug?.debug?.error("ShaderLoader", "WebGL context is lost");
      return null;
    }

    // Create canvas for gradient generation with enhanced error handling
    const canvas = document.createElement("canvas");
    if (!canvas) {
      Y3KDebug?.debug?.error("ShaderLoader", "Failed to create canvas element");
      return null;
    }

    canvas.width = width;
    canvas.height = 1;

    // Get 2D context with error handling
    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) {
      Y3KDebug?.debug?.error("ShaderLoader", "Failed to get 2D canvas context");
      return null;
    }

    // Validate color stops
    const validStops = stops.filter((stop) => {
      if (
        typeof stop.r !== "number" ||
        typeof stop.g !== "number" ||
        typeof stop.b !== "number" ||
        typeof stop.a !== "number" ||
        typeof stop.position !== "number"
      ) {
        Y3KDebug?.debug?.warn(
          "ShaderLoader",
          "Invalid color stop found, skipping"
        );
        return false;
      }

      if (stop.position < 0 || stop.position > 1) {
        Y3KDebug?.debug?.warn(
          "ShaderLoader",
          `Invalid color stop position: ${stop.position}, clamping`
        );
        stop.position = Math.max(0, Math.min(1, stop.position));
      }

      return true;
    });

    if (validStops.length === 0) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "No valid color stops after validation"
      );
      return null;
    }

    // Sort stops by position to ensure proper gradient
    validStops.sort((a, b) => a.position - b.position);

    // Create gradient with error handling
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    if (!gradient) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Failed to create linear gradient"
      );
      return null;
    }

    // Add color stops with validation
    try {
      validStops.forEach((stop, index) => {
        const r = Math.max(0, Math.min(255, Math.round(stop.r * 255)));
        const g = Math.max(0, Math.min(255, Math.round(stop.g * 255)));
        const b = Math.max(0, Math.min(255, Math.round(stop.b * 255)));
        const a = Math.max(0, Math.min(1, stop.a));

        const color = `rgba(${r}, ${g}, ${b}, ${a})`;
        gradient.addColorStop(stop.position, color);
      });
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Failed to add color stops to gradient:",
        error
      );
      return null;
    }

    // Fill canvas with error handling
    try {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, 1);
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Failed to fill canvas with gradient:",
        error
      );
      return null;
    }

    // Create WebGL texture with enhanced validation
    const texture = gl.createTexture();
    if (!texture) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Failed to create WebGL texture - gl.createTexture() returned null"
      );
      return null;
    }

    // Bind texture with error checking
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Check for WebGL errors after binding
      const bindError = gl.getError();
      if (bindError !== gl.NO_ERROR) {
        Y3KDebug?.debug?.error(
          "ShaderLoader",
          `WebGL error after texture binding: ${bindError}`
        );
        gl.deleteTexture(texture);
        return null;
      }

      // Upload texture data with error checking
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        canvas
      );

      const uploadError = gl.getError();
      if (uploadError !== gl.NO_ERROR) {
        Y3KDebug?.debug?.error(
          "ShaderLoader",
          `WebGL error after texture upload: ${uploadError}`
        );
        gl.deleteTexture(texture);
        return null;
      }

      // Set texture parameters with error checking
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const paramError = gl.getError();
      if (paramError !== gl.NO_ERROR) {
        Y3KDebug?.debug?.error(
          "ShaderLoader",
          `WebGL error after setting texture parameters: ${paramError}`
        );
        gl.deleteTexture(texture);
        return null;
      }

      // Unbind texture to clean up state
      gl.bindTexture(gl.TEXTURE_2D, null);

      Y3KDebug?.debug?.log(
        "ShaderLoader",
        `Gradient texture created successfully: ${width}x1, ${validStops.length} stops`
      );
      return texture;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ShaderLoader",
        "Exception during WebGL texture operations:",
        error
      );
      if (texture) {
        gl.deleteTexture(texture);
      }
      return null;
    }
  } catch (error) {
    Y3KDebug?.debug?.error(
      "ShaderLoader",
      `Gradient texture creation failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return null;
  }
}
