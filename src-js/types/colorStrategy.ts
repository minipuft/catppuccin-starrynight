/**
 * Color Processing Strategy Interfaces
 * 
 * Implements Strategy Pattern for color processing with event-driven coordination.
 * This replaces circular dependencies between MusicSyncService and ColorHarmonyEngine
 * with clean separation of concerns via Observer + Strategy patterns.
 */

// ============================================================================
// Color Processing Strategy Pattern
// ============================================================================

/**
 * Context data for color processing strategies
 */
export interface ColorContext {
  /** Raw colors extracted from album art */
  rawColors: Record<string, string>;
  
  /** Current track URI for caching and context */
  trackUri: string;
  
  /** Processing timestamp */
  timestamp: number;
  
  /** Current harmonic mode setting */
  harmonicMode?: string;
  
  /** Music analysis data for context-aware processing */
  musicData?: {
    energy?: number;
    valence?: number;
    tempo?: number;
    genre?: string;
  } | undefined;
  
  /** Performance hints for strategy selection */
  performanceHints?: {
    preferLightweight?: boolean;
    enableAdvancedBlending?: boolean;
    maxProcessingTime?: number;
  };
}

/**
 * Result of color processing strategy
 */
export interface ColorResult {
  /** Processed/harmonized colors */
  processedColors: Record<string, string>;
  
  /** Primary accent color (hex) */
  accentHex: string;
  
  /** RGB values for transparency support */
  accentRgb: string;
  
  /** Processing metadata */
  metadata: {
    strategy: string;
    processingTime: number;
    cacheKey?: string;
    harmonicIntensity?: number;
    error?: string;
    // Strategy-specific metadata
    [key: string]: any;
  };
  
  /** Original context for reference */
  context: ColorContext;
}

/**
 * Strategy interface for color processing
 * 
 * Implementations provide different algorithms for color processing:
 * - CatppuccinHarmonyStrategy: Blends with Catppuccin palette
 * - PassthroughStrategy: Minimal processing for performance
 * - CustomHarmonyStrategy: User-defined color harmonies
 */
export interface IColorProcessor {
  /**
   * Process colors according to strategy implementation
   */
  processColors(context: ColorContext): Promise<ColorResult>;
  
  /**
   * Get strategy name for debugging and metrics
   */
  getStrategyName(): string;
  
  /**
   * Check if strategy can handle the given context
   */
  canProcess(context: ColorContext): boolean;
  
  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number;
}

// ============================================================================
// Event-Driven Color Coordination Types
// ============================================================================

/**
 * Event payload for color extraction completion
 */
export interface ColorExtractedEvent {
  type: 'colors/extracted';
  payload: ColorContext;
}

/**
 * Event payload for color processing completion
 */
export interface ColorProcessedEvent {
  type: 'colors/processed';
  payload: ColorResult;
}

/**
 * Event payload for color harmony completion
 */
export interface ColorHarmonizedEvent {
  type: 'colors/harmonized';
  payload: ColorResult & {
    /** CSS variables to apply */
    cssVariables: Record<string, string>;
  };
}

/**
 * Union type for all color-related events
 */
export type ColorEvent = ColorExtractedEvent | ColorProcessedEvent | ColorHarmonizedEvent;

// ============================================================================
// Strategy Selection & Orchestration
// ============================================================================

/**
 * Strategy selection criteria
 */
export interface StrategySelectionCriteria {
  /** Performance requirements */
  performance: 'low' | 'medium' | 'high';
  
  /** Quality requirements */
  quality: 'basic' | 'enhanced' | 'premium';
  
  /** Device capabilities */
  deviceCapabilities?: {
    hasWebGL?: boolean;
    memoryMB?: number;
    isMobile?: boolean;
  };
  
  /** User preferences */
  userPreferences?: {
    harmonicMode?: string;
    intensity?: number;
    enableAdvancedBlending?: boolean;
  };
}

/**
 * Strategy registry for runtime strategy selection
 */
export interface IColorStrategyRegistry {
  /**
   * Register a color processing strategy
   */
  register(strategy: IColorProcessor): void;
  
  /**
   * Select best strategy for given criteria
   */
  selectStrategy(criteria: StrategySelectionCriteria): IColorProcessor | null;
  
  /**
   * Get all registered strategies
   */
  getStrategies(): IColorProcessor[];
  
  /**
   * Get strategy by name
   */
  getStrategy(name: string): IColorProcessor | null;
}

/**
 * Color orchestrator for coordinating event-driven color processing
 */
export interface IColorOrchestrator {
  /**
   * Initialize orchestrator with event bus and strategy registry
   */
  initialize(): Promise<void>;
  
  /**
   * Process color extraction event
   */
  handleColorExtraction(context: ColorContext): Promise<void>;
  
  /**
   * Get current processing status
   */
  getStatus(): {
    isProcessing: boolean;
    currentStrategy?: string;
    queueSize: number;
  };
  
  /**
   * Set strategy selection criteria
   */
  setSelectionCriteria(criteria: StrategySelectionCriteria): void;
}

// ============================================================================
// Legacy Compatibility Types
// ============================================================================

/**
 * Legacy color format for backward compatibility
 */
export interface LegacyExtractedColors {
  VIBRANT?: string;
  DARK_VIBRANT?: string;
  LIGHT_VIBRANT?: string;
  PROMINENT?: string;
  DESATURATED?: string;
  PRIMARY?: string;
  SECONDARY?: string;
  VIBRANT_NON_ALARMING?: string;
}

/**
 * Utility function types for color conversion
 */
export interface ColorUtils {
  sanitizeColorMap(colors: Record<string, string>): Record<string, string>;
  hexToRgb(hex: string): { r: number; g: number; b: number } | null;
  rgbToHex(r: number, g: number, b: number): string;
  convertLegacyColors(legacy: LegacyExtractedColors): Record<string, string>;
}