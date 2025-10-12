/**
 * Rendering Mode System - Progressive Enhancement for Visual Effects
 *
 * Provides a four-tier rendering system with graceful fallback:
 * - Full: Liquid shader + corridor effects
 * - Enhanced: Liquid shader only
 * - Standard: Basic WebGL shader
 * - Basic: CSS gradients only
 */

/**
 * Rendering modes in order of capability (highest to lowest)
 */
export enum RenderingMode {
  Full = "full",           // Liquid shader + corridor effects
  Enhanced = "enhanced",   // Liquid shader only
  Standard = "standard",   // Basic WebGL shader
  Basic = "basic"          // CSS gradients
}

/**
 * User preference for corridor effects
 */
export type CorridorEffectsMode = "auto" | "enabled" | "disabled";

/**
 * User preference for rendering mode (advanced users)
 */
export type RenderingModePreference = "auto" | "basic" | "standard" | "enhanced" | "full";

/**
 * Device tier classification for capability detection
 */
export type DeviceTier = "low" | "medium" | "high";

/**
 * Rendering capabilities detected during initialization
 */
export interface RenderingCapabilities {
  /** WebGL 1 or 2 available */
  hasWebGL: boolean;

  /** Liquid shader compiled successfully */
  hasLiquidShader: boolean;

  /** Corridor shader compiled successfully */
  hasCorridorShader: boolean;

  /** Device performance tier */
  deviceTier: DeviceTier;

  /** WebGL version (1 or 2) */
  webglVersion?: number;

  /** GPU renderer info (if available) */
  gpuRenderer?: string;
}

/**
 * Mode selection result with reasoning
 */
export interface ModeSelectionResult {
  /** Selected rendering mode */
  mode: RenderingMode;

  /** Reason for mode selection */
  reason: string;

  /** Whether this is a fallback from user preference */
  isFallback: boolean;

  /** Capabilities that influenced decision */
  capabilities: RenderingCapabilities;
}

/**
 * Mode switching result
 */
export interface ModeSwitchResult {
  /** Whether switch was successful */
  success: boolean;

  /** Previous mode */
  previousMode: RenderingMode;

  /** New mode */
  newMode: RenderingMode;

  /** Error message if failed */
  error?: string;
}

/**
 * Get the hierarchy level of a rendering mode (higher = more capable)
 */
export function getRenderingModeLevel(mode: RenderingMode): number {
  const levels = {
    [RenderingMode.Basic]: 1,
    [RenderingMode.Standard]: 2,
    [RenderingMode.Enhanced]: 3,
    [RenderingMode.Full]: 4,
  };
  return levels[mode];
}

/**
 * Get the next lower rendering mode in the fallback chain
 */
export function getLowerMode(mode: RenderingMode): RenderingMode | null {
  switch (mode) {
    case RenderingMode.Full:
      return RenderingMode.Enhanced;
    case RenderingMode.Enhanced:
      return RenderingMode.Standard;
    case RenderingMode.Standard:
      return RenderingMode.Basic;
    case RenderingMode.Basic:
      return null; // No lower mode
  }
}

/**
 * Get the next higher rendering mode
 */
export function getHigherMode(mode: RenderingMode): RenderingMode | null {
  switch (mode) {
    case RenderingMode.Basic:
      return RenderingMode.Standard;
    case RenderingMode.Standard:
      return RenderingMode.Enhanced;
    case RenderingMode.Enhanced:
      return RenderingMode.Full;
    case RenderingMode.Full:
      return null; // No higher mode
  }
}

/**
 * Check if a mode requires WebGL
 */
export function requiresWebGL(mode: RenderingMode): boolean {
  return mode !== RenderingMode.Basic;
}

/**
 * Check if a mode requires liquid shader
 */
export function requiresLiquidShader(mode: RenderingMode): boolean {
  return mode === RenderingMode.Enhanced || mode === RenderingMode.Full;
}

/**
 * Check if a mode requires corridor shader
 */
export function requiresCorridorShader(mode: RenderingMode): boolean {
  return mode === RenderingMode.Full;
}

/**
 * Get human-readable description of a rendering mode
 */
export function getRenderingModeDescription(mode: RenderingMode): string {
  const descriptions = {
    [RenderingMode.Full]: "Full quality with liquid physics and corridor effects",
    [RenderingMode.Enhanced]: "Enhanced quality with liquid physics",
    [RenderingMode.Standard]: "Standard quality with basic WebGL",
    [RenderingMode.Basic]: "Basic quality with CSS gradients",
  };
  return descriptions[mode];
}
