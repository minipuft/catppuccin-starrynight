export interface HealthCheckResult {
  system?: string;
  healthy: boolean;
  ok?: boolean;
  details?: string;
  issues?: string[];
  metrics?: Record<string, any>;
}

/**
 * Interface for processed color data from color harmony engines
 * Separates hex color values from metadata and processing parameters
 */
export interface ProcessedColorsData {
  /** Valid hex color values that can be converted to RGB */
  colors: Record<string, string>;
  /** Metadata and processing parameters (not color values) */
  metadata?: {
    strategy?: string;
    processingTime?: number;
    parameters?: Record<string, any>;
  };
}

/**
 * Event data structure for color harmonization events
 */
export interface ColorHarmonizedEventData {
  /** Processed color palette containing only hex color values */
  processedColors: Record<string, string>;
  /** Primary accent color in hex format */
  accentHex: string;
  /** Primary accent color in RGB format (r,g,b) */
  accentRgb: string;
  /** Color processing strategies used */
  strategies?: string[];
  /** Time taken to process colors in milliseconds */
  processingTime?: number;
}

export interface BeatPayload {
  energy?: number; // 0-1
  bpm?: number;
  valence?: number;
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
// VISUAL BACKPLANE SYSTEM - PHASE 3 DECOMPOSED ARCHITECTURE
// =============================================================================

import type { VisualRenderer, ShaderRenderer } from './visualRenderer';
import type { PerformanceAware } from './performanceAware';
import type { AccessibilitySupport } from './accessibilitySupport';
import type { MusicSynchronized } from './musicSynchronized';

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
  pulsingScale?: number; // 0.8 to 1.2
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
 * VisualBackplane - Composite Interface for Visual Rendering Systems
 * 
 * PHASE 3 DECOMPOSED ARCHITECTURE:
 * This interface now composes four focused interfaces following single responsibility principle:
 * - VisualRenderer: Core rendering operations
 * - PerformanceAware: Performance monitoring and optimization
 * - AccessibilitySupport: Accessibility features and WCAG compliance
 * - MusicSynchronized: Audio-visual synchronization
 * 
 * @deprecated The monolithic VisualBackplane is being decomposed. Consider implementing
 *             the focused interfaces directly for new code:
 *             - VisualRenderer for core rendering
 *             - PerformanceAware for performance features
 *             - AccessibilitySupport for accessibility features
 *             - MusicSynchronized for audio-visual sync
 * 
 * @architecture Phase 3 Interface Decomposition - Composite Pattern
 * @performance Target 60fps with graceful degradation
 * @accessibility Full WCAG 2.1 AA compliance with enhanced support
 */
export interface VisualBackplane extends 
  VisualRenderer,
  PerformanceAware,
  AccessibilitySupport,
  MusicSynchronized {
  
  /**
   * Initialize the visual backend with performance constraints
   * 
   * @deprecated Use init(root) from VisualRenderer and setPerformanceConstraints() separately
   * @param root - Root element to attach visual effects to
   * @param constraints - Performance constraints and quality settings
   * @returns Promise that resolves when backend is ready for rendering
   */
  init(root: HTMLElement, constraints?: PerformanceConstraints): Promise<void>;
}

/**
 * Extended interface for WebGL backends that support shader customization
 * 
 * @deprecated Use ShaderRenderer from visualRenderer.ts for new shader-based backends
 */
export interface ShaderBackplane extends VisualBackplane {
  /**
   * Load and compile custom shaders
   * 
   * @deprecated Use ShaderRenderer interface for new implementations
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
   * @deprecated Use ShaderRenderer interface for new implementations
   * @param uniforms - Uniform variables to update
   */
  setUniforms?(uniforms: Record<string, any>): void;
  
  /**
   * Hot-reload shaders during development
   * 
   * @deprecated Use ShaderRenderer interface for new implementations
   * @param shaderType - 'vertex' or 'fragment'
   * @param source - New shader source code
   */
  hotReloadShader?(shaderType: 'vertex' | 'fragment', source: string): Promise<void>;
}
