/**
 * ShaderHotReload - Development-time shader hot-reloading system
 * 
 * Enables real-time shader editing by watching for file changes and
 * automatically recompiling and updating WebGL programs without
 * requiring page refresh.
 * 
 * @architecture Year3000System
 * @performance Development-only feature, disabled in production
 * @security File watching requires local development environment
 */

export interface ShaderSource {
  vertex: string;
  fragment: string;
  uniforms?: Record<string, any>;
}

export interface ShaderProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  attributes: Record<string, number>;
}

export interface HotReloadConfig {
  enabled: boolean;
  watchInterval: number; // ms
  autoRecompile: boolean;
  preserveUniforms: boolean;
  debugLogging: boolean;
}

/**
 * Hot-reload manager for WebGL shaders during development
 */
export class ShaderHotReload {
  private gl: WebGL2RenderingContext;
  private config: HotReloadConfig;
  private watchedShaders: Map<string, {
    source: ShaderSource;
    program: ShaderProgram | null;
    lastModified: number;
    callbacks: ((program: ShaderProgram | null) => void)[];
    uniformValues: Record<string, any>;
  }> = new Map();
  
  private watchInterval: number | null = null;
  private isWatching = false;
  
  constructor(
    gl: WebGL2RenderingContext,
    config: Partial<HotReloadConfig> = {}
  ) {
    this.gl = gl;
    
    this.config = {
      enabled: process.env.NODE_ENV === 'development',
      watchInterval: 1000, // Check for changes every second
      autoRecompile: true,
      preserveUniforms: true,
      debugLogging: true,
      ...config
    };
    
    if (!this.config.enabled) {
      console.log('[ShaderHotReload] Disabled (not in development mode)');
      return;
    }
    
    if (this.config.debugLogging) {
      console.log('[ShaderHotReload] Initialized', this.config);
    }
  }
  
  /**
   * Register a shader for hot-reloading
   * 
   * @param shaderId - Unique identifier for this shader
   * @param vertexSource - Vertex shader source code
   * @param fragmentSource - Fragment shader source code
   * @param callback - Function called when shader is recompiled
   * @returns Initial compiled shader program
   */
  registerShader(
    shaderId: string,
    vertexSource: string,
    fragmentSource: string,
    callback: (program: ShaderProgram | null) => void
  ): ShaderProgram | null {
    if (!this.config.enabled) {
      // In production, just compile once and return
      const program = this.compileShaderProgram(vertexSource, fragmentSource);
      if (program) {
        callback(program);
      }
      return program;
    }
    
    const source: ShaderSource = {
      vertex: vertexSource,
      fragment: fragmentSource
    };
    
    // Compile initial program
    const program = this.compileShaderProgram(vertexSource, fragmentSource);
    
    // Register for watching
    this.watchedShaders.set(shaderId, {
      source,
      program,
      lastModified: Date.now(),
      callbacks: [callback],
      uniformValues: {}
    });
    
    // Start watching if not already
    if (!this.isWatching) {
      this.startWatching();
    }
    
    if (this.config.debugLogging) {
      console.log(`[ShaderHotReload] Registered shader: ${shaderId}`);
    }
    
    // Call initial callback
    if (program) {
      callback(program);
    }
    
    return program;
  }
  
  /**
   * Update shader source and trigger recompilation
   * Simulates file change in development environment
   * 
   * @param shaderId - Shader identifier
   * @param vertexSource - New vertex shader source (optional)
   * @param fragmentSource - New fragment shader source (optional)
   */
  updateShaderSource(
    shaderId: string,
    vertexSource?: string,
    fragmentSource?: string
  ): void {
    if (!this.config.enabled) return;
    
    const watched = this.watchedShaders.get(shaderId);
    if (!watched) {
      console.warn(`[ShaderHotReload] Shader not registered: ${shaderId}`);
      return;
    }
    
    // Update source
    if (vertexSource !== undefined) {
      watched.source.vertex = vertexSource;
    }
    if (fragmentSource !== undefined) {
      watched.source.fragment = fragmentSource;
    }
    
    watched.lastModified = Date.now();
    
    if (this.config.autoRecompile) {
      this.recompileShader(shaderId);
    }
    
    if (this.config.debugLogging) {
      console.log(`[ShaderHotReload] Updated shader source: ${shaderId}`);
    }
  }
  
  /**
   * Store uniform values for preservation across recompiles
   * 
   * @param shaderId - Shader identifier
   * @param uniforms - Current uniform values
   */
  preserveUniforms(shaderId: string, uniforms: Record<string, any>): void {
    if (!this.config.enabled || !this.config.preserveUniforms) return;
    
    const watched = this.watchedShaders.get(shaderId);
    if (watched) {
      watched.uniformValues = { ...uniforms };
    }
  }
  
  /**
   * Get preserved uniform values for a shader
   * 
   * @param shaderId - Shader identifier
   * @returns Preserved uniform values
   */
  getPreservedUniforms(shaderId: string): Record<string, any> {
    if (!this.config.enabled) return {};
    
    const watched = this.watchedShaders.get(shaderId);
    return watched ? { ...watched.uniformValues } : {};
  }
  
  /**
   * Manually trigger recompilation of a shader
   * 
   * @param shaderId - Shader identifier
   */
  recompileShader(shaderId: string): void {
    if (!this.config.enabled) return;
    
    const watched = this.watchedShaders.get(shaderId);
    if (!watched) return;
    
    if (this.config.debugLogging) {
      console.log(`[ShaderHotReload] Recompiling shader: ${shaderId}`);
    }
    
    // Preserve current uniform values
    const preservedUniforms = { ...watched.uniformValues };
    
    // Clean up old program
    if (watched.program) {
      this.gl.deleteProgram(watched.program.program);
    }
    
    // Compile new program
    const newProgram = this.compileShaderProgram(
      watched.source.vertex,
      watched.source.fragment
    );
    
    watched.program = newProgram;
    
    // Notify all callbacks
    watched.callbacks.forEach(callback => {
      try {
        callback(newProgram);
      } catch (error) {
        console.error(`[ShaderHotReload] Callback error for ${shaderId}:`, error);
      }
    });
    
    // Restore preserved uniform values if requested
    if (this.config.preserveUniforms && newProgram) {
      watched.uniformValues = preservedUniforms;
    }
    
    if (this.config.debugLogging) {
      if (newProgram) {
        console.log(`[ShaderHotReload] Successfully recompiled: ${shaderId}`);
      } else {
        console.error(`[ShaderHotReload] Failed to recompile: ${shaderId}`);
      }
    }
  }
  
  /**
   * Add callback for shader recompilation
   * 
   * @param shaderId - Shader identifier
   * @param callback - Function to call when shader is recompiled
   */
  addRecompileCallback(
    shaderId: string,
    callback: (program: ShaderProgram | null) => void
  ): void {
    const watched = this.watchedShaders.get(shaderId);
    if (watched) {
      watched.callbacks.push(callback);
    }
  }
  
  /**
   * Start watching for shader changes
   */
  startWatching(): void {
    if (!this.config.enabled || this.isWatching) return;
    
    this.isWatching = true;
    
    // In a real development environment, this would watch actual files
    // For now, we'll create a polling system that can be triggered manually
    this.watchInterval = window.setInterval(() => {
      // Check if any shaders have been marked for recompilation
      // This is a placeholder - in a real implementation, you'd watch the filesystem
      this.checkForShaderChanges();
    }, this.config.watchInterval);
    
    if (this.config.debugLogging) {
      console.log('[ShaderHotReload] Started watching for shader changes');
    }
  }
  
  /**
   * Stop watching for shader changes
   */
  stopWatching(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
    }
    
    this.isWatching = false;
    
    if (this.config.debugLogging) {
      console.log('[ShaderHotReload] Stopped watching for shader changes');
    }
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopWatching();
    
    // Clean up all shader programs
    for (const [shaderId, watched] of this.watchedShaders) {
      if (watched.program) {
        this.gl.deleteProgram(watched.program.program);
      }
    }
    
    this.watchedShaders.clear();
    
    if (this.config.debugLogging) {
      console.log('[ShaderHotReload] Destroyed');
    }
  }
  
  /**
   * Get list of registered shaders
   */
  getRegisteredShaders(): string[] {
    return Array.from(this.watchedShaders.keys());
  }
  
  /**
   * Get shader info for debugging
   */
  getShaderInfo(shaderId: string): {
    hasProgram: boolean;
    lastModified: number;
    callbackCount: number;
    preservedUniformCount: number;
  } | null {
    const watched = this.watchedShaders.get(shaderId);
    if (!watched) return null;
    
    return {
      hasProgram: watched.program !== null,
      lastModified: watched.lastModified,
      callbackCount: watched.callbacks.length,
      preservedUniformCount: Object.keys(watched.uniformValues).length
    };
  }
  
  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================
  
  private compileShaderProgram(
    vertexSource: string,
    fragmentSource: string
  ): ShaderProgram | null {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
    if (!vertexShader) return null;
    
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    if (!fragmentShader) {
      this.gl.deleteShader(vertexShader);
      return null;
    }
    
    const program = this.gl.createProgram();
    if (!program) {
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);
      return null;
    }
    
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    // Clean up shaders (they're linked into the program now)
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      console.error('[ShaderHotReload] Program linking failed:', error);
      this.gl.deleteProgram(program);
      return null;
    }
    
    // Extract uniform and attribute locations
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const attributes: Record<string, number> = {};
    
    const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const uniformInfo = this.gl.getActiveUniform(program, i);
      if (uniformInfo) {
        uniforms[uniformInfo.name] = this.gl.getUniformLocation(program, uniformInfo.name);
      }
    }
    
    const numAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttributes; i++) {
      const attributeInfo = this.gl.getActiveAttrib(program, i);
      if (attributeInfo) {
        attributes[attributeInfo.name] = this.gl.getAttribLocation(program, attributeInfo.name);
      }
    }
    
    return {
      program,
      uniforms,
      attributes
    };
  }
  
  private compileShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      const shaderType = type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment';
      console.error(`[ShaderHotReload] ${shaderType} shader compilation failed:`, error);
      console.error('Shader source:', source);
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  private checkForShaderChanges(): void {
    // Placeholder for file system watching
    // In a real implementation, this would check file modification times
    // or use a file watcher API
    
    // For development purposes, you can manually trigger recompilation
    // by calling updateShaderSource() or recompileShader()
  }
}

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Load shader source from external files (development utility)
 * In production, shaders should be bundled with the application
 */
export async function loadShaderFromFile(path: string): Promise<string> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('loadShaderFromFile is only available in development mode');
  }
  
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`[ShaderHotReload] Failed to load shader from ${path}:`, error);
    throw error;
  }
}

/**
 * Global shader hot-reload instance for debugging
 */
export let globalShaderHotReload: ShaderHotReload | null = null;

/**
 * Initialize global shader hot-reload for debugging
 */
export function initGlobalShaderHotReload(gl: WebGL2RenderingContext): void {
  if (process.env.NODE_ENV === 'development') {
    globalShaderHotReload = new ShaderHotReload(gl, {
      debugLogging: true
    });
    
    // Expose to global scope for debugging
    if (typeof window !== 'undefined') {
      (window as any).shaderHotReload = globalShaderHotReload;
    }
  }
}