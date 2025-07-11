export interface HealthCheckResult {
  ok: boolean;
  details?: string;
  issues?: string[];
}

export interface IManagedSystem {
  initialized: boolean;

  /**
   * Initializes the system, setting up any required resources or listeners.
   */
  initialize(): Promise<void>;

  /**
   * A periodic update tick, primarily for animations.
   * @param deltaTime - The time in milliseconds since the last frame.
   */
  updateAnimation(deltaTime: number): void;

  /**
   * Performs a health check on the system.
   * @returns A promise that resolves with the health check result.
   */
  healthCheck(): Promise<HealthCheckResult>;

  /**
   * Cleans up resources, listeners, and intervals.
   */
  destroy(): void;

  /**
   * Optional hint that a live-settings change occurred and the system should
   * immediately recalculate any internal colour caches or GPU resources. This
   * MUST be lightweight; heavy work should be deferred internally (e.g.
   * via requestIdleCallback).
   *
   * @param reason A short string describing why the repaint was requested.
   */
  forceRepaint?(reason?: string): void;
}

// Optional mix-in interface for runtime settings updates. Visual systems that
// need to react immediately to StarryNight/Year3000 settings changes can
// implement this. The Year3000System will invoke it whenever the
// `year3000SystemSettingsChanged` event is relayed via its internal handler.
export interface ISettingsResponsiveSystem {
  /**
   * Called by Year3000System each time a user or API mutates a theme setting.
   * @param key   The storage key that changed (e.g. "sn-enable-webgl")
   * @param value The new value (already validated by SettingsManager)
   */
  applyUpdatedSettings?(key: string, value: any): void;
}

// =============================================================================
// VISUAL BACKPLANE SYSTEM
// =============================================================================

/**
 * RGB color stop for gradient generation
 */
export interface RGBStop {
  r: number;
  g: number;
  b: number;
  position: number; // 0.0 to 1.0
}

/**
 * Music metrics for audio-visual synchronization
 */
export interface MusicMetrics {
  bpm: number;
  energy: number; // 0.0 to 1.0
  valence: number; // 0.0 to 1.0
  beatIntensity?: number; // 0.0 to 1.0
  rhythmPhase?: number; // 0 to 360 degrees
  breathingScale?: number; // 0.8 to 1.2
}

/**
 * Backend capability information
 */
export interface BackendCapabilities {
  webgl: boolean;
  webgl2: boolean;
  highPerformance: boolean;
  maxTextureSize: number;
  maxShaderComplexity: 'low' | 'medium' | 'high';
}

/**
 * Performance metrics and constraints
 */
export interface PerformanceConstraints {
  targetFPS: number;
  maxMemoryMB: number;
  cpuBudgetPercent: number;
  gpuBudgetPercent: number;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
}

/**
 * VisualBackplane - Unified interface for all visual rendering systems
 * 
 * This interface standardizes how CSS fallback and WebGL backgrounds
 * integrate with the Year 3000 System architecture. Every visual layer implements
 * this contract to ensure seamless orchestration by the GradientConductor.
 * 
 * @architecture Year3000System
 * @performance Target 60fps with graceful degradation
 * @accessibility Full support for prefers-reduced-motion
 */
export interface VisualBackplane extends IManagedSystem {
  /**
   * Unique identifier for this visual backend
   */
  readonly backendId: 'css' | 'webgl' | string;
  
  /**
   * Current readiness state of the backend
   */
  readonly isReady: boolean;
  
  /**
   * Backend capabilities and constraints
   */
  readonly capabilities: BackendCapabilities;
  
  /**
   * Initialize the visual backend with a target DOM element
   * 
   * @param root - Root element to attach visual effects to
   * @param constraints - Performance constraints and quality settings
   * @returns Promise that resolves when backend is ready for rendering
   */
  init(root: HTMLElement, constraints?: PerformanceConstraints): Promise<void>;
  
  /**
   * Update the color palette for gradient rendering
   * 
   * This method is called by the GradientConductor whenever the ColorHarmonyEngine
   * extracts new colors from album artwork or user settings change.
   * 
   * @param stops - Array of RGB color stops with positions (0.0-1.0)
   * @param transition - Optional transition duration in milliseconds
   */
  setPalette(stops: RGBStop[], transition?: number): void;
  
  /**
   * Update music synchronization metrics
   * 
   * Called by the MusicSyncService for real-time audio-visual synchronization.
   * Implementations should update visual effects based on these metrics.
   * 
   * @param metrics - Current music analysis data
   */
  setMusicMetrics(metrics: MusicMetrics): void;
  
  /**
   * Update performance constraints and quality settings
   * 
   * Called by the PerformanceAnalyzer when automatic quality scaling is triggered
   * or user manually changes performance settings.
   * 
   * @param constraints - New performance constraints
   */
  setPerformanceConstraints(constraints: PerformanceConstraints): void;
  
  /**
   * Enable or disable the visual backend
   * 
   * Used for progressive enhancement ladder - only one backend is active at a time.
   * Inactive backends should fade to opacity 0 and stop rendering.
   * 
   * @param enabled - Whether this backend should be active
   * @param fadeMs - Transition duration in milliseconds
   */
  setEnabled(enabled: boolean, fadeMs?: number): void;
  
  /**
   * Get current rendering statistics
   * 
   * Used by PerformanceAnalyzer for monitoring and automatic quality scaling.
   * 
   * @returns Current performance metrics
   */
  getPerformanceMetrics(): {
    fps: number;
    memoryUsageMB: number;
    cpuUsagePercent: number;
    gpuUsagePercent: number;
    frameTimeMs: number;
  };
  
  /**
   * Handle context loss and recovery
   * 
   * WebGL backends should implement proper context recovery.
   * CSS backends can use this for DOM cleanup and recreation.
   * 
   * @returns Promise that resolves when context is restored
   */
  handleContextLoss?(): Promise<void>;
  
  /**
   * Resize the visual backend to match container dimensions
   * 
   * Called when the root element is resized or orientation changes.
   * 
   * @param width - New width in pixels
   * @param height - New height in pixels
   */
  resize?(width: number, height: number): void;
  
  /**
   * Apply accessibility preferences
   * 
   * Called when prefers-reduced-motion or other accessibility settings change.
   * 
   * @param preferences - Accessibility preferences
   */
  applyAccessibilityPreferences?(preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    prefersTransparency: boolean;
  }): void;
}

/**
 * Extended interface for WebGL backends that support shader customization
 */
export interface ShaderBackplane extends VisualBackplane {
  /**
   * Load and compile custom shaders
   * 
   * @param vertexShader - Vertex shader source code
   * @param fragmentShader - Fragment shader source code
   * @param uniforms - Uniform variable definitions
   */
  loadShaders?(
    vertexShader: string, 
    fragmentShader: string, 
    uniforms?: Record<string, any>
  ): Promise<void>;
  
  /**
   * Update shader uniform variables
   * 
   * @param uniforms - Uniform variables to update
   */
  setUniforms?(uniforms: Record<string, any>): void;
  
  /**
   * Hot-reload shaders during development
   * 
   * @param shaderType - 'vertex' or 'fragment'
   * @param source - New shader source code
   */
  hotReloadShader?(shaderType: 'vertex' | 'fragment', source: string): Promise<void>;
}
