/**
 * DynamicOKLCHPaletteGenerator - OKLCH-Based Palette Generation
 *
 * Generates full 26-color Catppuccin palettes from base and accent colors
 * using OKLCH color space for perceptually uniform color derivation.
 *
 * Phase 4B Update: Removed duplicate aesthetic adjustments - now handles
 * pure color derivation only. Aesthetic profiles (chroma/lightness/hue)
 * are applied as a post-processing step by PaletteTransform.
 */

import { hexToOklch, oklchToHex, oklchToRgb } from "@/utils/core/ThemeUtilities";
import {
  SEMANTIC_HUES,
  SURFACE_LIGHTNESS_OFFSETS,
  AESTHETIC_PROFILES,
  type AestheticProfile,
} from "./PaletteConstants";

export interface PaletteDefinition {
  base: string;
  accent: string;
  brightnessMode: "dark" | "light";
  aestheticProfile: string;
}

export interface OKLCHColor {
  L: number;
  C: number;
  H: number;
}

export class DynamicOKLCHPaletteGenerator {
  public paletteCache = new Map<string, Record<string, string>>();
  private enableDebug: boolean;

  constructor(enableDebug: boolean = false) {
    this.enableDebug = enableDebug;
  }

  generatePalette(definition: PaletteDefinition): Record<string, string> {
    const cacheKey = this.getCacheKey(definition);

    if (this.paletteCache.has(cacheKey)) {
      if (this.enableDebug) {
        console.log("[DynamicOKLCHPaletteGenerator] Cache hit for:", cacheKey);
      }
      return this.paletteCache.get(cacheKey)!;
    }

    if (this.enableDebug) {
      console.log("[DynamicOKLCHPaletteGenerator] Generating new palette for:", definition);
    }

    const palette = this.generatePaletteInternal(definition);
    this.paletteCache.set(cacheKey, palette);

    return palette;
  }

  generateCSSVariables(palette: Record<string, string>): Record<string, string> {
    const cssVars: Record<string, string> = {};

    Object.entries(palette).forEach(([name, hex]) => {
      const oklch = hexToOklch(hex);
      if (!oklch) return;

      const rgbColor = oklchToRgb(oklch);

      cssVars[`--spice-${name}`] = hex;
      cssVars[`--spice-rgb-${name}`] = `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`;
    });

    return cssVars;
  }

  clearCache(): void {
    this.paletteCache.clear();

    if (this.enableDebug) {
      console.log("[DynamicOKLCHPaletteGenerator] Cache cleared");
    }
  }

  private generatePaletteInternal(definition: PaletteDefinition): Record<string, string> {
    const { base, accent, brightnessMode, aestheticProfile } = definition;
    const profile = AESTHETIC_PROFILES[aestheticProfile];

    if (!profile) {
      throw new Error(`Unknown aesthetic profile: ${aestheticProfile}`);
    }

    const baseOklch = hexToOklch(base);
    const accentOklch = hexToOklch(accent);

    if (!baseOklch || !accentOklch) {
      throw new Error("Invalid color values in palette definition");
    }

    const semanticColors = this.generateSemanticColors(accentOklch, profile);
    const surfaceColors = this.generateSurfaceColors(baseOklch, profile, brightnessMode);

    return {
      ...semanticColors,
      ...surfaceColors,
    };
  }

  /**
   * PHASE 4B: Generate semantic colors WITHOUT aesthetic adjustments
   *
   * Pure color derivation from accent - aesthetic profile will be applied
   * as a post-processing transform by PaletteTransform in ColorProcessor.
   *
   * This removes duplicate aesthetic application and ensures all colors
   * (palette, OKLAB, strategies) get uniform aesthetic treatment.
   */
  private generateSemanticColors(accentOklch: OKLCHColor, profile: AestheticProfile): Record<string, string> {
    const colors: Record<string, string> = {};

    Object.entries(SEMANTIC_HUES).forEach(([name, targetHue]) => {
      const semanticColor: OKLCHColor = {
        L: accentOklch.L,
        C: accentOklch.C, // ← No chromaMultiplier here
        H: targetHue, // ← No hueBias here
      };

      colors[name] = oklchToHex(semanticColor);
    });

    return colors;
  }

  /**
   * PHASE 4B: Generate surface colors WITHOUT aesthetic adjustments
   *
   * Pure color derivation from base with lightness offsets only.
   * Aesthetic desaturation will be applied by PaletteTransform.
   */
  private generateSurfaceColors(
    baseOklch: OKLCHColor,
    profile: AestheticProfile,
    brightnessMode: "dark" | "light"
  ): Record<string, string> {
    const colors: Record<string, string> = {};

    Object.entries(SURFACE_LIGHTNESS_OFFSETS).forEach(([name, offset]) => {
      const adjustedOffset = brightnessMode === "dark" ? offset : -offset;

      const surfaceColor: OKLCHColor = {
        L: Math.max(0, Math.min(1, baseOklch.L + adjustedOffset)),
        C: baseOklch.C, // ← No surfaceDesaturation here
        H: baseOklch.H,
      };

      colors[name] = oklchToHex(surfaceColor);
    });

    return colors;
  }

  private getCacheKey(definition: PaletteDefinition): string {
    return `${definition.base}-${definition.accent}-${definition.brightnessMode}-${definition.aestheticProfile}`;
  }
}
