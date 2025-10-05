import type { WebGLUniformValue } from './visualRenderer';

// =========================================================================
// SYSTEM METRICS AND HEALTH TYPES
// =========================================================================

/**
 * Type-safe setting values for system configuration
 * Replaces unknown with concrete union of all possible setting types
 * Based on TypedSettings interface and actual usage patterns
 */
export type SettingValue = 
  // String-based settings (enums, flavors, modes)
  | string
  // Numeric settings (intensities, percentages)  
  | number
  // Boolean settings (enabled/disabled flags)
  | boolean
  // Array settings (multiple selections)
  | string[]
  // Complex settings (configuration objects)
  | {
      [key: string]: string | number | boolean;
    };

/**
 * Type-safe system metrics interface with backward compatibility
 * Provides common metric patterns while allowing flexibility for system-specific metrics
 * Replaces Record<string, unknown> with structured, extensible type safety
 */
export interface SystemMetrics {
  // === COMMON PERFORMANCE METRICS ===
  /** Frame processing time in milliseconds */
  frameTime?: number;
  /** Frame rate (frames per second) */
  fps?: number;
  /** Memory usage in megabytes */
  memoryUsageMB?: number;
  /** CPU usage percentage (0-100) */
  cpuUsagePercent?: number;
  /** Timestamp of last metric update */
  lastUpdate?: number;
  
  // === COMMON SYSTEM STATE METRICS ===
  /** System initialization status */
  initialized?: boolean;
  /** System enabled/disabled status */
  enabled?: boolean;
  /** System activity status */
  isActive?: boolean;
  /** WebGL readiness status */
  webglReady?: boolean;
  
  // === COMMON PROCESSING METRICS ===
  /** Total operations performed */
  totalOperations?: number;
  /** Average processing time in milliseconds */
  averageProcessingTime?: number;
  /** Number of errors encountered */
  errorCount?: number;
  /** Success rate percentage (0-100) */
  successRate?: number;
  /** Queue size for processing systems */
  queueSize?: number;
  
  // === COMMON HEALTH METRICS ===
  /** Overall system health status (compatible with all SystemHealth types) */
  systemHealth?: string;
  /** Overall system status (compatible with all status types) */
  overall?: string;
  /** Error message if system has issues */
  error?: string;
  
  // === SYSTEM-SPECIFIC METRICS (Extensible) ===
  /** 
   * Custom metrics - supports primitives and complex objects for system-specific data
   * Provides backward compatibility with existing metric collection patterns
   * Profile validation results use pattern: [profileName]Profile: 'ok' | 'error' | 'warning'
   */
  [metricName: string]: string | number | boolean | object | undefined;
}

export interface HealthCheckResult {
  system?: string;
  healthy: boolean;
  ok?: boolean;
  details?: string;
  issues?: string[];
  metrics?: SystemMetrics;
}

// =========================================================================
// SPICETIFY PLAYER DATA TYPES - PHASE 1 FIX
// =========================================================================

/**
 * Spicetify Player data interface for type-safe property access
 * Fixes Player data object property access errors (uri, duration)
 * Based on Spicetify Player API documentation and runtime behavior
 */
export interface SpicetifyPlayerData {
  /** Track URI identifier */
  uri: string;
  /** Track duration in milliseconds */
  duration: number;
  /** Track name/title */
  name?: string;
  /** Artist information */
  artists?: Array<{
    name: string;
    uri: string;
  }>;
  /** Album information */
  album?: {
    name: string;
    uri: string;
  };
  /** Track metadata */
  metadata?: {
    [key: string]: string;
  };
  /** Whether track is playable */
  is_playable?: boolean;
  /** Track ID */
  id?: string;
  /** Track popularity (0-100) */
  popularity?: number;
  /** Additional properties for extensibility */
  [key: string]: any;
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
    parameters?: Record<string, unknown>;
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

/**
 * Phase 3.3: Optional mix-in interface for systems that opt into performance monitoring
 *
 * Systems implementing this interface explicitly signal that they want their
 * initialize() and updateAnimation() methods wrapped with performance tracking.
 *
 * This replaces automatic wrapping of all systems (which adds overhead) with an
 * opt-in pattern where only systems that need monitoring pay the performance cost.
 *
 * @example
 * class MySystem implements IManagedSystem, IMonitorableSystem {
 *   enablePerformanceMonitoring = true;
 *
 *   async initialize() { ... }
 *   updateAnimation(deltaTime: number) { ... }
 *   // Performance tracking will be automatically integrated
 * }
 */
export interface IMonitorableSystem {
  /**
   * When true, the system's initialize() and updateAnimation() methods will be
   * wrapped with performance monitoring that records execution time metrics.
   *
   * Set to false or omit this property to opt out of monitoring overhead.
   */
  enablePerformanceMonitoring: boolean;
}

// Optional mix-in interface for runtime settings updates. Visual systems that
// need to react immediately to StarryNight/Year3000 settings changes can
// implement this. The ThemeLifecycleCoordinator will invoke it whenever the
// `year3000SystemSettingsChanged` event is relayed via its internal handler.
export interface ISettingsResponsiveSystem {
  /**
   * Called by ThemeLifecycleCoordinator each time a user or API mutates a theme setting.
   * @param key   The storage key that changed (e.g. "sn-enable-webgl")
   * @param value The new value (already validated by SettingsManager)
   */
  applyUpdatedSettings?(key: string, value: SettingValue): void;
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
    uniforms?: Record<string, WebGLUniformValue>
  ): Promise<void>;
  
  /**
   * Update shader uniform variables
   * 
   * @deprecated Use ShaderRenderer interface for new implementations
   * @param uniforms - Uniform variables to update
   */
  setUniforms?(uniforms: Record<string, WebGLUniformValue>): void;
  
  /**
   * Hot-reload shaders during development
   * 
   * @deprecated Use ShaderRenderer interface for new implementations
   * @param shaderType - 'vertex' or 'fragment'
   * @param source - New shader source code
   */
  hotReloadShader?(shaderType: 'vertex' | 'fragment', source: string): Promise<void>;
}

// =============================================================================
// SPICETIFY AUDIO PROCESSING INTERFACES - PHASE 2.5.1c
// =============================================================================

/**
 * Comprehensive Spicetify Audio Features Interface
 * 
 * Unifies all audio feature properties from Spicetify API calls.
 * Replaces unknown/any types with concrete, type-safe audio processing interfaces.
 * 
 * Based on Spotify Web API Audio Features:
 * https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 * 
 * @phase 2.5.1c Audio Processing Type Safety
 */
export interface SpicetifyAudioFeatures {
  // === CORE AUDIO CHARACTERISTICS ===
  /** A confidence measure from 0.0 to 1.0 of whether the track is acoustic */
  acousticness: number;
  
  /** Danceability describes how suitable a track is for dancing (0.0 to 1.0) */
  danceability: number;
  
  /** Energy is a measure from 0.0 to 1.0 representing intensity and power */
  energy: number;
  
  /** Predicts whether a track contains no vocals (0.0 to 1.0) */
  instrumentalness: number;
  
  /** Detects the presence of an audience in the recording (0.0 to 1.0) */
  liveness: number;
  
  /** The overall loudness of a track in decibels (dB) */
  loudness: number;
  
  /** Speechiness detects spoken words in a track (0.0 to 1.0) */
  speechiness: number;
  
  /** Musical positiveness conveyed by a track (0.0 to 1.0) */
  valence: number;
  
  // === MUSICAL ANALYSIS ===
  /** The estimated overall tempo of a track in beats per minute (BPM) */
  tempo: number;
  
  /** The key the track is in. Uses standard Pitch Class notation */
  key: number;
  
  /** Mode indicates the modality (major or minor) of a track */
  mode: number;
  
  /** An estimated time signature (3 to 7 indicating time signature) */
  timeSignature: number;
  
  /** Alternative name for timeSignature (backward compatibility) */
  time_signature?: number;
  
  // === METADATA ===
  /** The duration of the track in milliseconds */
  duration_ms: number;
  
  /** The Spotify ID for the track */
  id: string;
  
  /** The Spotify URI for the track */
  uri: string;
  
  /** A link to the Web API endpoint providing full details of the track */
  track_href: string;
  
  /** A link to a 30 second preview (MP3 format) of the track */
  analysis_url: string;
  
  /** The object type: "audio_features" */
  type: 'audio_features';
}

/**
 * Spicetify Audio Analysis Data Interface
 * 
 * Represents detailed audio analysis data from Spicetify.getAudioData()
 * Contains time-series analysis of beats, bars, sections, segments, and tatums.
 * 
 * @phase 2.5.1c Audio Processing Type Safety
 */
export interface SpicetifyAudioAnalysis {
  // === TIME-SERIES ANALYSIS ===
  /** Beats - detected beats in the track */
  beats: SpicetifyAudioBeat[];
  
  /** Bars - detected bars/measures in the track */
  bars: SpicetifyAudioBar[];
  
  /** Sections - large variations in rhythm or timbre */
  sections: SpicetifyAudioSection[];
  
  /** Segments - short sections with consistent characteristics */
  segments: SpicetifyAudioSegment[];
  
  /** Tatums - smallest time intervals (subdivisions of beats) */
  tatums: SpicetifyAudioTatum[];
  
  // === TRACK METADATA ===
  /** Track information and metadata */
  track: {
    /** Number of samples per second of the track's audio analysis */
    num_samples: number;
    
    /** Duration of the track in seconds */
    duration: number;
    
    /** Sonic fingerprint unique to track */
    sample_md5: string;
    
    /** Offset seconds (usually 0) */
    offset_seconds: number;
    
    /** Window seconds for analysis */
    window_seconds: number;
    
    /** Analysis sample rate */
    analysis_sample_rate: number;
    
    /** Analysis channels (1 = mono, 2 = stereo) */
    analysis_channels: number;
    
    /** End of fade in, in seconds */
    end_of_fade_in: number;
    
    /** Start of fade out, in seconds */
    start_of_fade_out: number;
    
    /** Overall loudness in decibels */
    loudness: number;
    
    /** Overall tempo estimation in BPM */
    tempo: number;
    
    /** Confidence of tempo estimation (0.0 to 1.0) */
    tempo_confidence: number;
    
    /** Overall time signature */
    time_signature: number;
    
    /** Confidence of time signature (0.0 to 1.0) */
    time_signature_confidence: number;
    
    /** Overall key estimation */
    key: number;
    
    /** Confidence of key estimation (0.0 to 1.0) */
    key_confidence: number;
    
    /** Overall mode estimation (0 = minor, 1 = major) */
    mode: number;
    
    /** Confidence of mode estimation (0.0 to 1.0) */
    mode_confidence: number;
  };
  
  /** Meta information about the analysis process */
  meta: {
    /** The platform used for analysis */
    analyzer_version: string;
    
    /** The platform that requested the analysis */
    platform: string;
    
    /** The detailed status of the analysis */
    detailed_status: string;
    
    /** The time of analysis */
    timestamp: number;
    
    /** Analysis time in seconds */
    analysis_time: number;
    
    /** Input total time in seconds */
    input_total_time: number;
  };
}

/**
 * Individual beat detection data
 */
export interface SpicetifyAudioBeat {
  /** The starting point (in seconds) of the beat */
  start: number;
  
  /** The duration (in seconds) of the beat */
  duration: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the beat */
  confidence: number;
}

/**
 * Individual bar/measure detection data
 */
export interface SpicetifyAudioBar {
  /** The starting point (in seconds) of the bar */
  start: number;
  
  /** The duration (in seconds) of the bar */
  duration: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the bar */
  confidence: number;
}

/**
 * Audio section with musical characteristics
 */
export interface SpicetifyAudioSection {
  /** The starting point (in seconds) of the section */
  start: number;
  
  /** The duration (in seconds) of the section */
  duration: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the section */
  confidence: number;
  
  /** The overall loudness of the section in decibels (dB) */
  loudness: number;
  
  /** The overall estimated tempo of the section in beats per minute (BPM) */
  tempo: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the tempo */
  tempo_confidence: number;
  
  /** The estimated overall key of the section */
  key: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the key */
  key_confidence: number;
  
  /** The estimated overall mode of the section */
  mode: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the mode */
  mode_confidence: number;
  
  /** The estimated overall time signature of the section */
  time_signature: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the time signature */
  time_signature_confidence: number;
}

/**
 * Audio segment with detailed timbre and pitch information
 */
export interface SpicetifyAudioSegment {
  /** The starting point (in seconds) of the segment */
  start: number;
  
  /** The duration (in seconds) of the segment */
  duration: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the segment */
  confidence: number;
  
  /** The onset loudness of the segment in decibels (dB) */
  loudness_start: number;
  
  /** The time, in seconds, at which the segment's maximum loudness is reached */
  loudness_max_time: number;
  
  /** The peak loudness of the segment in decibels (dB) */
  loudness_max: number;
  
  /** The offset loudness of the segment in decibels (dB) */
  loudness_end: number;
  
  /** Pitch content is given by a "chroma" vector (12 values representing the 12 pitch classes) */
  pitches: number[];
  
  /** Timbre is the quality of a musical note or sound (12 values representing timbre vectors) */
  timbre: number[];
}

/**
 * Individual tatum (sub-beat) detection data
 */
export interface SpicetifyAudioTatum {
  /** The starting point (in seconds) of the tatum */
  start: number;
  
  /** The duration (in seconds) of the tatum */
  duration: number;
  
  /** The confidence, from 0.0 to 1.0, of the reliability of the tatum */
  confidence: number;
}

/**
 * Type-safe union for all possible Spicetify audio data responses
 * Replaces Promise<any> in audio processing APIs
 * 
 * @phase 2.5.1c Audio Processing Type Safety
 */
export type SpicetifyAudioData = SpicetifyAudioFeatures | SpicetifyAudioAnalysis;

/**
 * Backward compatibility type alias for existing AudioFeatures interfaces
 * Provides optional properties for gradual migration
 * 
 * @deprecated Use SpicetifyAudioFeatures for new code
 * @phase 2.5.1c Audio Processing Type Safety
 */
export interface AudioFeatures {
  acousticness?: number;
  danceability?: number;
  energy?: number;
  instrumentalness?: number;
  liveness?: number;
  loudness?: number;
  speechiness?: number;
  valence?: number;
  tempo?: number;
  key?: number;
  mode?: number;
  timeSignature?: number;
  duration_ms?: number;
  id?: string;
  uri?: string;
}
