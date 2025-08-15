/**
 * VisualRenderer - Core Visual Rendering Interface
 * 
 * This interface defines the essential visual rendering operations that all
 * visual backend systems must implement. It focuses purely on rendering
 * functionality without mixing in performance, accessibility, or music sync concerns.
 * 
 * @architecture Phase 3 Interface Decomposition
 * @responsibility Core visual rendering operations only
 * @performance Target 60fps with graceful degradation
 */

import type { IManagedSystem, BackendCapabilities, RGBStop } from './systems';

/**
 * Core visual rendering interface for all visual backend systems
 * 
 * This interface standardizes how CSS fallback and WebGL backgrounds
 * handle essential rendering operations within the Year 3000 System architecture.
 */
export interface VisualRenderer extends IManagedSystem {
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
   * @returns Promise that resolves when backend is ready for rendering
   */
  init(root: HTMLElement): Promise<void>;
  
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
}

/**
 * Extended interface for WebGL backends that support shader customization
 */
export interface ShaderRenderer extends VisualRenderer {
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