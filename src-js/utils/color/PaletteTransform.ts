/**
 * PaletteTransform - Post-Processing Transform Utility
 *
 * Applies aesthetic profile transformations to color palettes as the final
 * step in color processing. Handles chroma, lightness, and hue adjustments
 * based on palette system (Catppuccin vs Year3000) with role-aware processing
 * for surface, text, and semantic colors.
 *
 * Phase 4B Implementation - Single source of truth for aesthetic transforms
 */

import { hexToOklch, oklchToHex } from "@/utils/core/ThemeUtilities";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";

export interface PaletteTransformConfig {
  chromaMultiplier: number;
  lightnessRange: [number, number];
  hueBias: number;
  surfaceDesaturation: number;
  preserveSemantics?: boolean;
}

export type PaletteSurfaceRole = "surface" | "text" | "semantic";

export interface OKLCHColor {
  L: number;
  C: number;
  H: number;
}

export class PaletteTransform {
  private static debugEnabled = ADVANCED_SYSTEM_CONFIG.enableDebug;
  private static transformCache = new Map<string, string>();
  private static readonly CACHE_SIZE_LIMIT = 500;

  /**
   * Apply aesthetic profile transform to a single color
   *
   * @param color - Input color (hex, rgb, or oklch format)
   * @param config - Transform configuration from aesthetic profile
   * @param colorRole - Optional role hint for role-specific adjustments
   * @returns Transformed color in hex format
   */
  static applyTransform(
    color: string,
    config: PaletteTransformConfig,
    colorRole?: PaletteSurfaceRole
  ): string {
    if (!color || typeof color !== "string") {
      console.warn("[PaletteTransform] Invalid color input:", color);
      return color;
    }

    const cacheKey = this.getCacheKey(color, config, colorRole);
    if (this.transformCache.has(cacheKey)) {
      return this.transformCache.get(cacheKey)!;
    }

    const oklch = hexToOklch(color);
    if (!oklch) {
      console.warn("[PaletteTransform] Failed to parse color:", color);
      return color;
    }

    const role = colorRole || this.detectColorRole(color);
    const transformedOklch = this.transformOKLCH(oklch, config, role);
    const transformedHex = oklchToHex(transformedOklch);

    this.cacheTransform(cacheKey, transformedHex);

    if (this.debugEnabled) {
      console.log("[PaletteTransform] Color transformed:", {
        original: color,
        transformed: transformedHex,
        role,
        oklchBefore: oklch,
        oklchAfter: transformedOklch,
      });
    }

    return transformedHex;
  }

  /**
   * Apply transform to entire color map (batch processing)
   *
   * @param colors - Map of color names to color values
   * @param config - Transform configuration
   * @returns Transformed color map with same keys
   */
  static applyToColorMap(
    colors: Record<string, string>,
    config: PaletteTransformConfig
  ): Record<string, string> {
    const startTime = performance.now();
    const transformed: Record<string, string> = {};

    for (const [key, value] of Object.entries(colors)) {
      if (!value || typeof value !== "string") {
        transformed[key] = value;
        continue;
      }

      const role = this.detectColorRoleFromKey(key);
      transformed[key] = this.applyTransform(value, config, role);
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    if (this.debugEnabled) {
      console.log("[PaletteTransform] Batch transform completed:", {
        colorCount: Object.keys(colors).length,
        processingTimeMs: processingTime.toFixed(2),
        cacheHitRate: this.getCacheHitRate(),
      });
    }

    return transformed;
  }

  /**
   * Transform OKLCH color with aesthetic profile adjustments
   */
  private static transformOKLCH(
    oklch: OKLCHColor,
    config: PaletteTransformConfig,
    role: PaletteSurfaceRole
  ): OKLCHColor {
    const transformed = { ...oklch };

    if (role === "surface" && config.surfaceDesaturation !== undefined) {
      transformed.C = oklch.C * config.surfaceDesaturation;
    } else if (role !== "text" || !config.preserveSemantics) {
      transformed.C = oklch.C * config.chromaMultiplier;
    }

    if (role !== "text" || !config.preserveSemantics) {
      transformed.H = (oklch.H + config.hueBias + 360) % 360;
    }

    const [minL, maxL] = config.lightnessRange;
    transformed.L = Math.max(minL, Math.min(maxL, oklch.L));

    transformed.C = Math.max(0, Math.min(0.4, transformed.C));
    transformed.L = Math.max(0, Math.min(1, transformed.L));
    transformed.H = (transformed.H + 360) % 360;

    return transformed;
  }

  /**
   * Detect color role from key name for intelligent transform application
   */
  private static detectColorRoleFromKey(key: string): PaletteSurfaceRole {
    const lowerKey = key.toLowerCase();

    if (
      lowerKey.includes("surface") ||
      lowerKey.includes("base") ||
      lowerKey === "mantle" ||
      lowerKey === "crust" ||
      lowerKey.includes("background") ||
      lowerKey.includes("bg")
    ) {
      return "surface";
    }

    if (
      lowerKey.includes("text") ||
      lowerKey.includes("subtext") ||
      lowerKey.includes("overlay") ||
      lowerKey.includes("fg") ||
      lowerKey.includes("foreground")
    ) {
      return "text";
    }

    return "semantic";
  }

  /**
   * Detect color role from color value (fallback heuristic)
   */
  private static detectColorRole(color: string): PaletteSurfaceRole {
    const oklch = hexToOklch(color);
    if (!oklch) return "semantic";

    if (oklch.C < 0.05) {
      if (oklch.L < 0.3) return "surface";
      if (oklch.L > 0.7) return "text";
    }

    return "semantic";
  }

  /**
   * Generate cache key for transform result
   */
  private static getCacheKey(
    color: string,
    config: PaletteTransformConfig,
    role?: PaletteSurfaceRole
  ): string {
    return `${color}-${config.chromaMultiplier}-${config.hueBias}-${config.lightnessRange[0]}-${config.lightnessRange[1]}-${role || "auto"}`;
  }

  /**
   * Cache transform result with size limit enforcement
   */
  private static cacheTransform(key: string, value: string): void {
    if (this.transformCache.size >= this.CACHE_SIZE_LIMIT) {
      const entriesToRemove = Math.floor(this.CACHE_SIZE_LIMIT * 0.25);
      const entries = Array.from(this.transformCache.entries());
      entries.slice(0, entriesToRemove).forEach(([k]) => this.transformCache.delete(k));
    }

    this.transformCache.set(key, value);
  }

  /**
   * Get cache hit rate for performance monitoring
   */
  private static getCacheHitRate(): string {
    const size = this.transformCache.size;
    const limit = this.CACHE_SIZE_LIMIT;
    return `${size}/${limit} (${((size / limit) * 100).toFixed(1)}%)`;
  }

  /**
   * Clear transform cache (for testing or settings changes)
   */
  static clearCache(): void {
    this.transformCache.clear();

    if (this.debugEnabled) {
      console.log("[PaletteTransform] Cache cleared");
    }
  }

  /**
   * Get detailed transform metadata for debugging
   */
  static getTransformMetadata(
    color: string,
    config: PaletteTransformConfig,
    colorRole?: PaletteSurfaceRole
  ) {
    const oklchBefore = hexToOklch(color);
    if (!oklchBefore) return null;

    const role = colorRole || this.detectColorRoleFromKey(color);
    const oklchAfter = this.transformOKLCH(oklchBefore, config, role);
    const transformedColor = oklchToHex(oklchAfter);

    return {
      originalColor: color,
      transformedColor,
      role,
      oklchBefore,
      oklchAfter,
      config,
    };
  }
}
