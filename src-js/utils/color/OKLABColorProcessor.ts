/**
 * OKLABColorProcessor - Shared OKLAB Color Science Utilities
 *
 * Provides perceptually uniform color processing for visual strategies using
 * OKLAB color space. Enables enhanced vibrancy, smooth transitions, and
 * superior color harmony across all strategy implementations.
 *
 * Philosophy: "Perceptual color processing creates natural, harmonious color
 * transitions that respect human visual perception and enhance aesthetic visual-effects."
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import * as Utils from "@/utils/core/ThemeUtilities";

export interface OKLABColor {
  L: number; // Lightness (0-1)
  a: number; // Green-Red axis
  b: number; // Blue-Yellow axis
}

export interface OKLCHColor {
  L: number; // Lightness (0-1)
  C: number; // Chroma (0-0.4 typical)
  H: number; // Hue (0-360 degrees)
}

export interface RGBColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

export interface EnhancementPreset {
  name: string;
  description: string;
  lightnessBoost: number; // Multiplier (0.5-1.5)
  chromaBoost: number; // Multiplier (0.5-2.0)
  shadowReduction: number; // Factor for shadow generation (0.1-0.5)
  vibrantThreshold: number; // Minimum chroma for vibrant colors (0.05-0.2)
}

export interface OKLABProcessingResult {
  originalHex: string;
  originalRgb: RGBColor;
  enhancedHex: string;
  enhancedRgb: RGBColor;
  shadowHex: string;
  shadowRgb: RGBColor;
  oklabOriginal: OKLABColor;
  oklabEnhanced: OKLABColor;
  oklabShadow: OKLABColor;
  oklchEnhanced: OKLCHColor;
  processingTime: number;
}

export class OKLABColorProcessor {
  private utils = Utils;
  private debugEnabled: boolean;

  // Built-in enhancement presets
  public static readonly PRESETS: Record<string, EnhancementPreset> = {
    SUBTLE: {
      name: "Subtle Enhancement",
      description: "Minimal color enhancement for conservative aesthetics",
      lightnessBoost: 1.05,
      chromaBoost: 1.1,
      shadowReduction: 0.4,
      vibrantThreshold: 0.08,
    },
    STANDARD: {
      name: "Standard Enhancement",
      description: "Balanced color enhancement for general use",
      lightnessBoost: 1.1,
      chromaBoost: 1.15,
      shadowReduction: 0.3,
      vibrantThreshold: 0.1,
    },
    VIBRANT: {
      name: "Vibrant Enhancement",
      description: "Enhanced vibrancy for dynamic color experiences",
      lightnessBoost: 1.15,
      chromaBoost: 1.25,
      shadowReduction: 0.25,
      vibrantThreshold: 0.12,
    },
    COSMIC: {
      name: "Cosmic Enhancement",
      description:
        "Maximum enhancement for Year 3000 visual-effects experiences",
      lightnessBoost: 1.1, // Reduced from 1.2
      chromaBoost: 1.2,    // Reduced from 1.35
      shadowReduction: 0.2,
      vibrantThreshold: 0.15,
    },
  };

  constructor(enableDebug: boolean = false) {
    this.debugEnabled = enableDebug;
  }

  /**
   * Process a color through OKLAB space with enhancement preset
   */
  public processColor(
    hexColor: string,
    preset: EnhancementPreset = OKLABColorProcessor.PRESETS.STANDARD!!
  ): OKLABProcessingResult {
    const startTime = performance.now();
    let originalRgb: { r: number; g: number; b: number } | null = null;

    try {
      // Parse input color
      originalRgb = this.utils.hexToRgb(hexColor);
      if (!originalRgb) {
        throw new Error(`Invalid hex color: ${hexColor}`);
      }

      // Convert to OKLAB space
      const oklabOriginal = this.utils.rgbToOklab(
        originalRgb.r,
        originalRgb.g,
        originalRgb.b
      );

      // Apply enhancement in OKLAB space
      const oklabEnhanced = this.enhanceOKLABColor(oklabOriginal, preset);

      // Generate shadow variant
      const oklabShadow = this.generateShadowColor(oklabOriginal, preset);

      // Convert back to RGB
      const enhancedRgb = this.utils.oklabToRgb(
        oklabEnhanced.L,
        oklabEnhanced.a,
        oklabEnhanced.b
      );
      const shadowRgb = this.utils.oklabToRgb(
        oklabShadow.L,
        oklabShadow.a,
        oklabShadow.b
      );

      // Convert to hex
      const enhancedHex = this.utils.rgbToHex(
        enhancedRgb.r,
        enhancedRgb.g,
        enhancedRgb.b
      );
      const shadowHex = this.utils.rgbToHex(
        shadowRgb.r,
        shadowRgb.g,
        shadowRgb.b
      );

      // Generate OKLCH representation
      const oklchEnhanced = this.convertOklabToOklch(oklabEnhanced);

      const processingTime = performance.now() - startTime;

      const result: OKLABProcessingResult = {
        originalHex: hexColor,
        originalRgb,
        enhancedHex,
        enhancedRgb,
        shadowHex,
        shadowRgb,
        oklabOriginal,
        oklabEnhanced,
        oklabShadow,
        oklchEnhanced,
        processingTime,
      };

      if (this.debugEnabled) {
        Y3KDebug?.debug?.log("OKLABColorProcessor", "Color processed:", {
          input: hexColor,
          enhanced: enhancedHex,
          shadow: shadowHex,
          preset: preset.name,
          processingTime: `${processingTime.toFixed(2)}ms`,
        });
      }

      return result;
    } catch (error) {
      if (this.debugEnabled) {
        Y3KDebug?.debug?.error(
          "OKLABColorProcessor",
          "Color processing failed:",
          error
        );
      }

      // Return fallback result
      const fallbackRgb = originalRgb || { r: 124, g: 58, b: 237 };
      return this.createFallbackResult(hexColor, fallbackRgb);
    }
  }

  /**
   * Process multiple colors with consistent enhancement
   */
  public processColorPalette(
    colors: Record<string, string>,
    preset: EnhancementPreset = OKLABColorProcessor.PRESETS.STANDARD!!
  ): Record<string, OKLABProcessingResult> {
    const results: Record<string, OKLABProcessingResult> = {};

    Object.entries(colors).forEach(([key, hex]) => {
      if (hex && this.utils.hexToRgb(hex)) {
        results[key] = this.processColor(hex, preset);
      }
    });

    return results;
  }

  /**
   * Generate CSS variables from processed color
   */
  public generateCSSVariables(
    processed: OKLABProcessingResult,
    prefix: string = "sn-oklab"
  ): Record<string, string> {
    const cssVars: Record<string, string> = {};

    // Enhanced color variables
    cssVars[`--${prefix}-enhanced-hex`] = processed.enhancedHex;
    cssVars[
      `--${prefix}-enhanced-rgb`
    ] = `${processed.enhancedRgb.r},${processed.enhancedRgb.g},${processed.enhancedRgb.b}`;
    cssVars[`--${prefix}-enhanced-r`] = Math.round(
      processed.enhancedRgb.r
    ).toString();
    cssVars[`--${prefix}-enhanced-g`] = Math.round(
      processed.enhancedRgb.g
    ).toString();
    cssVars[`--${prefix}-enhanced-b`] = Math.round(
      processed.enhancedRgb.b
    ).toString();

    // Shadow color variables
    cssVars[`--${prefix}-shadow-hex`] = processed.shadowHex;
    cssVars[
      `--${prefix}-shadow-rgb`
    ] = `${processed.shadowRgb.r},${processed.shadowRgb.g},${processed.shadowRgb.b}`;

    // OKLAB space variables
    cssVars[`--${prefix}-lightness`] = processed.oklabEnhanced.L.toFixed(3);
    cssVars[`--${prefix}-chroma-a`] = processed.oklabEnhanced.a.toFixed(3);
    cssVars[`--${prefix}-chroma-b`] = processed.oklabEnhanced.b.toFixed(3);

    // OKLCH space variables
    cssVars[`--${prefix}-oklch-l`] = processed.oklchEnhanced.L.toFixed(3);
    cssVars[`--${prefix}-oklch-c`] = processed.oklchEnhanced.C.toFixed(3);
    cssVars[`--${prefix}-oklch-h`] = processed.oklchEnhanced.H.toFixed(1);

    return cssVars;
  }

  /**
   * Interpolate between two colors in OKLAB space
   */
  public interpolateOKLAB(
    color1Hex: string,
    color2Hex: string,
    factor: number,
    preset: EnhancementPreset = OKLABColorProcessor.PRESETS.STANDARD!
  ): OKLABProcessingResult {
    const rgb1 = this.utils.hexToRgb(color1Hex);
    const rgb2 = this.utils.hexToRgb(color2Hex);

    if (!rgb1 || !rgb2) {
      throw new Error("Invalid hex colors for interpolation");
    }

    const oklab1 = this.utils.rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
    const oklab2 = this.utils.rgbToOklab(rgb2.r, rgb2.g, rgb2.b);

    // Interpolate in OKLAB space
    const interpolatedOklab: OKLABColor = {
      L: oklab1.L + (oklab2.L - oklab1.L) * factor,
      a: oklab1.a + (oklab2.a - oklab1.a) * factor,
      b: oklab1.b + (oklab2.b - oklab1.b) * factor,
    };

    // Convert back to RGB and hex
    const interpolatedRgb = this.utils.oklabToRgb(
      interpolatedOklab.L,
      interpolatedOklab.a,
      interpolatedOklab.b
    );
    const interpolatedHex = this.utils.rgbToHex(
      interpolatedRgb.r,
      interpolatedRgb.g,
      interpolatedRgb.b
    );

    // Process the interpolated color through enhancement
    return this.processColor(interpolatedHex, preset);
  }

  /**
   * Generate gradient stops in OKLAB space
   */
  public generateOKLABGradient(
    startHex: string,
    endHex: string,
    stopCount: number = 5,
    preset: EnhancementPreset = OKLABColorProcessor.PRESETS.STANDARD!
  ): OKLABProcessingResult[] {
    const gradientStops: OKLABProcessingResult[] = [];

    for (let i = 0; i < stopCount; i++) {
      const factor = i / (stopCount - 1);
      const interpolated = this.interpolateOKLAB(
        startHex,
        endHex,
        factor,
        preset
      );
      gradientStops.push(interpolated);
    }

    return gradientStops;
  }

  /**
   * Enhance color in OKLAB space
   */
  private enhanceOKLABColor(
    oklab: OKLABColor,
    preset: EnhancementPreset
  ): OKLABColor {
    // Calculate chroma (distance from neutral axis)
    const currentChroma = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);

    // Apply enhancement based on preset
    const enhancedL = Math.min(1, Math.max(0, oklab.L * preset.lightnessBoost));

    // Only enhance chroma if color is above vibrant threshold
    const chromaMultiplier =
      currentChroma > preset.vibrantThreshold ? preset.chromaBoost : 1.0;
    const enhancedA = oklab.a * chromaMultiplier;
    const enhancedB = oklab.b * chromaMultiplier;

    return { L: enhancedL, a: enhancedA, b: enhancedB };
  }

  /**
   * Generate shadow color by reducing lightness while preserving hue
   */
  private generateShadowColor(
    oklab: OKLABColor,
    preset: EnhancementPreset
  ): OKLABColor {
    return {
      L: Math.max(0.02, oklab.L * preset.shadowReduction),
      a: oklab.a * 0.8, // Slightly desaturate shadows
      b: oklab.b * 0.8,
    };
  }

  /**
   * Convert OKLAB to OKLCH (cylindrical representation)
   */
  private convertOklabToOklch(oklab: OKLABColor): OKLCHColor {
    const L = oklab.L;
    const C = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
    let H = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI);

    // Normalize hue to 0-360 range
    if (H < 0) H += 360;

    return { L, C, H };
  }

  /**
   * Create fallback result for error cases
   */
  private createFallbackResult(
    hexColor: string,
    fallbackRgb: RGBColor
  ): OKLABProcessingResult {
    const fallbackOklab = this.utils.rgbToOklab(
      fallbackRgb.r,
      fallbackRgb.g,
      fallbackRgb.b
    );

    return {
      originalHex: hexColor,
      originalRgb: fallbackRgb,
      enhancedHex: hexColor,
      enhancedRgb: fallbackRgb,
      shadowHex: "#000000",
      shadowRgb: { r: 0, g: 0, b: 0 },
      oklabOriginal: fallbackOklab,
      oklabEnhanced: fallbackOklab,
      oklabShadow: { L: 0.05, a: 0, b: 0 },
      oklchEnhanced: this.convertOklabToOklch(fallbackOklab),
      processingTime: 0,
    };
  }

  /**
   * Get preset by name with fallback
   */
  public static getPreset(name: string): EnhancementPreset {
    return (
      OKLABColorProcessor.PRESETS[name.toUpperCase()] ||
      OKLABColorProcessor.PRESETS.STANDARD!
    );
  }

  /**
   * Create custom preset
   */
  public static createCustomPreset(
    name: string,
    description: string,
    lightnessBoost: number,
    chromaBoost: number,
    shadowReduction: number = 0.3,
    vibrantThreshold: number = 0.1
  ): EnhancementPreset {
    return {
      name,
      description,
      lightnessBoost: Math.max(0.5, Math.min(1.5, lightnessBoost)),
      chromaBoost: Math.max(0.5, Math.min(2.0, chromaBoost)),
      shadowReduction: Math.max(0.1, Math.min(0.5, shadowReduction)),
      vibrantThreshold: Math.max(0.05, Math.min(0.2, vibrantThreshold)),
    };
  }
}
