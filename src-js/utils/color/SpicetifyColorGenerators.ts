/**
 * SpicetifyColorGenerators - Pure Color Generation Utilities
 *
 * EXTRACTION RATIONALE:
 * Extracted from SpicetifyColorBridge (2025-10-05) to eliminate code duplication and
 * create reusable color generation utilities. Originally ~600 lines embedded in
 * SpicetifyColorBridge, now isolated for better maintainability and testability.
 *
 * PURPOSE:
 * Pure color generation functions for creating Spicetify-compatible color variations:
 * - Core color distribution (surface progression, harmony colors)
 * - Color variants (darker, lighter, hue-rotated)
 * - Effect-specific colors (cinematic, holographic)
 * - UI-specific colors (text, overlay, zone, palette)
 *
 * DESIGN PRINCIPLES:
 * - Pure functions (no side effects)
 * - No dependencies on Spicetify runtime
 * - Type-safe with comprehensive JSDoc
 * - 100% unit testable in isolation
 * - Exact behavioral parity with original implementation
 *
 * USAGE:
 * ```typescript
 * import * as SpicetifyColorGen from '@/utils/color/SpicetifyColorGenerators';
 *
 * const distribution = SpicetifyColorGen.generateIntelligentColorDistribution(
 *   '#c6a0f6', // primary
 *   '#8aadf4', // accent
 *   '#24273a', // shadow
 *   '#cad3f5'  // highlight
 * );
 * ```
 *
 * @see SpicetifyColorBridge - Primary consumer of these utilities
 * @see docs/architecture/adr/ADR-001-rename-semantic-color-manager.md
 */
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
import type { OKLCHColor } from "@/utils/color/OKLABColorProcessor";

/**
 * RGB Color object
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL Color object
 */
export interface HSLColor {
  h: number; // 0-360 degrees
  s: number; // 0-100 percent
  l: number; // 0-100 percent
}

/**
 * Intelligent color distribution result
 */
export interface ColorDistribution {
  primary: string;
  surface0: string;
  surface1: string;
  surface2: string;
  base: string;
  shadow: string;
  highlight: string;
  harmonyPrimary: string;
  harmonySecondary: string;
  harmonyTertiary: string;
}

/**
 * Zone color types for UI context awareness
 */
export type ZoneColorType = 'flamingo' | 'lavender' | 'peach' | 'rosewater' | 'sapphire';

/**
 * Palette color types for Catppuccin compatibility
 */
export type PaletteColorType = 'pink' | 'sky' | 'red' | 'maroon' | 'yellow' | 'green';

const MIN_LIGHTNESS = 0.02;
const MAX_LIGHTNESS = 0.98;
const MAX_CHROMA = 0.35;

type LightnessDirection = 'lighter' | 'darker';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function wrapHue(degrees: number): number {
  const wrapped = ((degrees % 360) + 360) % 360;
  return wrapped === 360 ? 0 : wrapped;
}

function blendHue(source: number, target: number, mix: number): number {
  const clampedMix = clamp(mix, 0, 1);
  const sourceRad = (wrapHue(source) * Math.PI) / 180;
  const targetRad = (wrapHue(target) * Math.PI) / 180;

  const x = Math.cos(sourceRad) * (1 - clampedMix) + Math.cos(targetRad) * clampedMix;
  const y = Math.sin(sourceRad) * (1 - clampedMix) + Math.sin(targetRad) * clampedMix;

  if (x === 0 && y === 0) {
    return wrapHue(target);
  }

  return wrapHue((Math.atan2(y, x) * 180) / Math.PI);
}

function sanitizeOklch(oklch: OKLCHColor): OKLCHColor {
  return {
    L: clamp(oklch.L, MIN_LIGHTNESS, MAX_LIGHTNESS),
    C: clamp(oklch.C, 0, MAX_CHROMA),
    H: wrapHue(oklch.H),
  };
}

function toOklch(hex: string): OKLCHColor | null {
  if (!ThemeUtilities.isValidHexColor(hex)) {
    return null;
  }

  return ThemeUtilities.hexToOklch(hex);
}

function fromOklch(oklch: OKLCHColor): string {
  return ThemeUtilities.oklchToHex(sanitizeOklch(oklch));
}

function computeLightnessVariant(
  base: OKLCHColor,
  factor: number,
  direction: LightnessDirection
): OKLCHColor {
  const clampedFactor = clamp(factor, 0, 1);
  if (clampedFactor === 0) {
    return sanitizeOklch(base);
  }

  const available = direction === 'darker' ? base.L - MIN_LIGHTNESS : MAX_LIGHTNESS - base.L;
  const lightnessShift = available * clampedFactor;
  const L = direction === 'darker' ? base.L - lightnessShift : base.L + lightnessShift;
  const chromaScale = direction === 'darker' ? 1 - 0.35 * clampedFactor : 1 - 0.18 * clampedFactor;

  return sanitizeOklch({
    L,
    C: clamp(base.C * chromaScale, 0, MAX_CHROMA),
    H: base.H,
  });
}

function applyOklchAdjustment(
  baseHex: string,
  adjustment: {
    hueShift?: number;
    hueTarget?: number;
    hueMix?: number;
    chromaScale?: number;
    chromaAdd?: number;
    lightnessShift?: number;
    lightnessScale?: number;
  },
  fallback?: string
): string {
  const oklch = toOklch(baseHex);
  if (!oklch) {
    return fallback ?? baseHex;
  }

  const lightnessScale = adjustment.lightnessScale ?? 1;
  const lightnessShift = adjustment.lightnessShift ?? 0;
  const targetLightness = clamp(
    oklch.L * lightnessScale + lightnessShift,
    MIN_LIGHTNESS,
    MAX_LIGHTNESS
  );

  const chromaScale = adjustment.chromaScale ?? 1;
  const chromaAdd = adjustment.chromaAdd ?? 0;
  const targetChroma = clamp(oklch.C * chromaScale + chromaAdd, 0, MAX_CHROMA);

  let targetHue = oklch.H;
  if (typeof adjustment.hueTarget === 'number') {
    const hueMix = adjustment.hueMix ?? 0.5;
    targetHue = blendHue(oklch.H, adjustment.hueTarget, hueMix);
  } else if (typeof adjustment.hueShift === 'number') {
    targetHue = wrapHue(oklch.H + adjustment.hueShift);
  }

  return fromOklch({
    L: targetLightness,
    C: targetChroma,
    H: targetHue,
  });
}

// ============================================================================
// CORE COLOR DISTRIBUTION
// ============================================================================

/**
 * Generate intelligent color distribution for comprehensive Spicetify variable coverage
 * Uses OKLAB-inspired color science for perceptually uniform depth progression
 *
 * @param primaryColor - Base color from OKLAB processing
 * @param accentColor - Optional accent color (uses primary if not provided)
 * @param shadowColor - Optional shadow color (generated if not provided)
 * @param highlightColor - Optional highlight color (generated if not provided)
 * @returns ColorDistribution object with all color variants
 *
 * @example
 * const distribution = generateIntelligentColorDistribution('#c6a0f6');
 * // Returns: { primary, surface0-2, base, shadow, highlight, harmony colors }
 */
export function generateIntelligentColorDistribution(
  primaryColor: string,
  accentColor?: string,
  shadowColor?: string,
  highlightColor?: string
): ColorDistribution {
  // Use provided colors or generate intelligent fallbacks
  const primary = primaryColor;
  const accent = accentColor || primaryColor;
  const shadow = shadowColor || generateDarkerVariant(primaryColor, 0.3);
  const highlight = highlightColor || generateLighterVariant(primaryColor, 0.2);

  // Generate depth progression (base → surface0 → surface1 → surface2)
  // Each step becomes lighter for depth illusion
  const base = generateDarkerVariant(primaryColor, 0.6); // Deepest background
  const surface0 = generateDarkerVariant(primaryColor, 0.4); // Middle depth
  const surface1 = accent; // Use accent for surface1 (existing logic)
  const surface2 = generateLighterVariant(accent, 0.15); // Elevated surface

  // Generate harmony color variations using hue rotation
  // Create harmonious but distinct colors for visual systems
  const harmonyPrimary = generateHueRotatedColor(primaryColor, 120); // Blue-ish shift
  const harmonySecondary = generateHueRotatedColor(primaryColor, -60); // Mauve-ish shift
  const harmonyTertiary = generateHueRotatedColor(primaryColor, 180); // Teal-ish shift

  return {
    primary,
    surface0,
    surface1,
    surface2,
    base,
    shadow,
    highlight,
    harmonyPrimary,
    harmonySecondary,
    harmonyTertiary,
  };
}

/**
 * Convert color distribution object to RGB strings for CSS variables
 *
 * @param colorDistribution - Color distribution object with hex colors
 * @returns Object with RGB string values for CSS variables
 *
 * @example
 * const rgbDist = convertColorsToRgb(distribution);
 * // Returns: { primary: "198, 160, 246", ... }
 */
export function convertColorsToRgb(colorDistribution: ColorDistribution): Record<string, string> {
  const rgbDistribution: Record<string, string> = {};

  Object.entries(colorDistribution).forEach(([key, hexColor]) => {
    rgbDistribution[key] = hexToRgb(hexColor);
  });

  return rgbDistribution;
}

// ============================================================================
// COLOR VARIANTS (Darker, Lighter, Hue Rotation)
// ============================================================================

/**
 * Generate a darker variant of a color by reducing RGB values
 *
 * @param hexColor - Hex color string (#RRGGBB)
 * @param factor - Darkening factor (0-1, where 0=no change, 1=black)
 * @returns Darkened hex color string
 *
 * @example
 * generateDarkerVariant('#c6a0f6', 0.3); // Returns darker purple
 */
export function generateDarkerVariant(hexColor: string, factor: number): string {
  try {
    const clampedFactor = clamp(factor, 0, 1);
    if (clampedFactor === 0) {
      return hexColor;
    }
    if (clampedFactor >= 1) {
      return '#000000';
    }

    const oklch = toOklch(hexColor);
    if (!oklch) {
      return hexColor;
    }

    const darkerVariant = computeLightnessVariant(oklch, clampedFactor, 'darker');
    return fromOklch(darkerVariant);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate darker variant:', error);
    return hexColor;
  }
}

/**
 * Generate a lighter variant of a color by moving RGB values toward white
 *
 * @param hexColor - Hex color string (#RRGGBB)
 * @param factor - Lightening factor (0-1, where 0=no change, 1=white)
 * @returns Lightened hex color string
 *
 * @example
 * generateLighterVariant('#c6a0f6', 0.2); // Returns lighter purple
 */
export function generateLighterVariant(hexColor: string, factor: number): string {
  try {
    const clampedFactor = clamp(factor, 0, 1);
    if (clampedFactor === 0) {
      return hexColor;
    }
    if (clampedFactor >= 1) {
      return '#ffffff';
    }

    const oklch = toOklch(hexColor);
    if (!oklch) {
      return hexColor;
    }

    const lighterVariant = computeLightnessVariant(oklch, clampedFactor, 'lighter');
    return fromOklch(lighterVariant);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate lighter variant:', error);
    return hexColor;
  }
}

/**
 * Generate a hue-rotated variant of a color for visual harmony systems
 *
 * @param hexColor - Hex color string (#RRGGBB)
 * @param hueDegrees - Hue rotation in degrees (-360 to 360)
 * @returns Hue-rotated hex color string
 *
 * @example
 * generateHueRotatedColor('#c6a0f6', 120); // Returns blue-ish variant
 */
export function generateHueRotatedColor(hexColor: string, hueDegrees: number): string {
  try {
    const oklch = toOklch(hexColor);
    if (!oklch) {
      return hexColor;
    }

    const rotated: OKLCHColor = {
      ...oklch,
      H: wrapHue(oklch.H + hueDegrees),
    };

    return fromOklch(rotated);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate hue-rotated color:', error);
    return hexColor;
  }
}

// ============================================================================
// EFFECT-SPECIFIC COLOR GENERATORS
// ============================================================================

/**
 * Generate cinematic red color with high contrast characteristics
 * Based on album color psychology for dramatic effects
 *
 * @param baseColor - Base hex color
 * @returns Dramatic red hex color
 */
export function generateCinematicRed(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#FF0000';

    const dramatic: OKLCHColor = sanitizeOklch({
      L: clamp(oklch.L * 0.7, MIN_LIGHTNESS, 0.7),
      C: clamp(oklch.C * 1.6 + 0.06, 0.12, MAX_CHROMA),
      H: blendHue(oklch.H, 25, 0.7),
    });

    return fromOklch(dramatic);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate cinematic red:', error);
    return '#FF0000';
  }
}

/**
 * Generate cinematic cyan color complementary to the base color
 * Creates high contrast cyan for dramatic visual effects
 *
 * @param baseColor - Base hex color
 * @returns Dramatic cyan hex color
 */
export function generateCinematicCyan(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#00FFFF';

    const dramatic: OKLCHColor = sanitizeOklch({
      L: clamp(oklch.L * 0.85 + 0.1, 0.4, 0.88),
      C: clamp(oklch.C * 1.45 + 0.04, 0.15, MAX_CHROMA),
      H: blendHue(oklch.H, 200, 0.6),
    });

    return fromOklch(dramatic);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate cinematic cyan:', error);
    return '#00FFFF';
  }
}

/**
 * Generate cinematic yellow for accent dramatic effects
 * Bright, attention-grabbing yellow based on highlight color
 *
 * @param highlightColor - Highlight hex color
 * @returns Bright yellow hex color
 */
export function generateCinematicYellow(highlightColor: string): string {
  try {
    const oklch = toOklch(highlightColor);
    if (!oklch) return '#FFFF00';

    const dramatic: OKLCHColor = sanitizeOklch({
      L: clamp(oklch.L + 0.18, 0.55, MAX_LIGHTNESS),
      C: clamp(oklch.C * 1.3 + 0.02, 0.12, MAX_CHROMA),
      H: blendHue(oklch.H, 95, 0.65),
    });

    return fromOklch(dramatic);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate cinematic yellow:', error);
    return '#FFFF00';
  }
}

/**
 * Generate holographic primary color with luminous characteristics
 * Creates iridescent, enhanced color based on album primary
 *
 * @param baseColor - Base hex color
 * @returns Holographic primary hex color
 */
export function generateHolographicPrimary(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#8A2BE2';

    const luminous: OKLCHColor = sanitizeOklch({
      L: clamp(oklch.L + 0.12, 0.45, MAX_LIGHTNESS),
      C: clamp(oklch.C * 1.35 + 0.03, 0.1, MAX_CHROMA),
      H: blendHue(oklch.H, wrapHue(oklch.H + 12), 0.4),
    });

    return fromOklch(luminous);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate holographic primary:', error);
    return '#8A2BE2';
  }
}

/**
 * Generate holographic accent color with prismatic shift
 * Creates complementary holographic color for accent effects
 *
 * @param harmonyColor - Harmony hex color
 * @returns Holographic accent hex color
 */
export function generateHolographicAccent(harmonyColor: string): string {
  try {
    // Apply prismatic hue shift for holographic spectrum effect
    return generateHueRotatedColor(harmonyColor, 45);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate holographic accent:', error);
    return '#FF00FF';
  }
}

/**
 * Generate holographic glow color for luminous lighting effects
 * Creates soft, luminous glow based on highlight color
 *
 * @param highlightColor - Highlight hex color
 * @returns Holographic glow hex color
 */
export function generateHolographicGlow(highlightColor: string): string {
  try {
    const oklch = toOklch(highlightColor);
    if (!oklch) return '#E0E0FF';

    const glow: OKLCHColor = sanitizeOklch({
      L: clamp(oklch.L + 0.25, 0.6, MAX_LIGHTNESS),
      C: clamp(oklch.C * 0.45, 0, MAX_CHROMA),
      H: oklch.H,
    });

    return fromOklch(glow);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate holographic glow:', error);
    return '#E0E0FF';
  }
}

// ============================================================================
// UI-SPECIFIC COLOR GENERATORS
// ============================================================================

/**
 * Generate high contrast text color based on background color
 * Creates optimal text readability for context-aware design
 *
 * @param baseColor - Background hex color
 * @returns Text hex color (light or dark based on background)
 */
export function generateTextColor(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#CAD3F5';

    return oklch.L > 0.62 ? '#24273A' : '#CAD3F5';
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate text color:', error);
    return '#CAD3F5';
  }
}

/**
 * Generate medium contrast subdued text color
 * Creates secondary text with reduced contrast for hierarchy
 *
 * @param baseColor - Background hex color
 * @returns Subtext hex color
 */
export function generateSubtextColor(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#A5ADCB';

    return oklch.L > 0.62 ? '#5B6078' : '#A5ADCB';
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate subtext color:', error);
    return '#A5ADCB';
  }
}

/**
 * Generate progressive overlay colors for background depth hierarchy
 * Creates Catppuccin-style overlay colors with OKLAB-enhanced base
 *
 * @param baseColor - Base hex color
 * @param opacity - Opacity factor (0-1)
 * @returns Overlay hex color
 */
export function generateOverlayColor(baseColor: string, opacity: number): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return `rgba(88,91,112,${opacity})`;

    const clampedOpacity = clamp(opacity, 0, 1);
    if (clampedOpacity === 0) {
      return fromOklch(sanitizeOklch(oklch));
    }

    const sanitized = sanitizeOklch(oklch);
    const adjustmentFactor = clamp(0.15 + clampedOpacity * 0.55, 0, 1);
    const direction: LightnessDirection = sanitized.L > 0.6 ? 'darker' : 'lighter';

    let overlayVariant = computeLightnessVariant(sanitized, adjustmentFactor, direction);
    overlayVariant = sanitizeOklch({
      ...overlayVariant,
      C: clamp(overlayVariant.C * (1 - clampedOpacity * 0.25), 0, MAX_CHROMA),
    });

    return fromOklch(overlayVariant);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate overlay color:', error);
    return `rgba(88,91,112,${opacity})`;
  }
}

/**
 * Generate window frame/border crust color
 * Creates subtle border color for window chrome elements
 *
 * @param baseColor - Base hex color
 * @returns Crust hex color
 */
export function generateCrustColor(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#232634';

    const sanitized = sanitizeOklch(oklch);
    const direction: LightnessDirection = sanitized.L > 0.6 ? 'darker' : 'lighter';
    const variant = computeLightnessVariant(sanitized, direction === 'darker' ? 0.3 : 0.18, direction);
    const bordered = sanitizeOklch({
      ...variant,
      C: clamp(variant.C * 0.85, 0, MAX_CHROMA),
    });

    return fromOklch(bordered);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate crust color:', error);
    return '#232634';
  }
}

/**
 * Generate window background mantle color
 * Creates intermediate color between base and overlay0 for window backgrounds
 *
 * @param baseColor - Base hex color
 * @returns Mantle hex color
 */
export function generateMantleColor(baseColor: string): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) return '#1e2030';

    const sanitized = sanitizeOklch(oklch);
    const direction: LightnessDirection = sanitized.L > 0.6 ? 'darker' : 'lighter';
    const variant = computeLightnessVariant(sanitized, direction === 'darker' ? 0.18 : 0.12, direction);
    const softened = sanitizeOklch({
      ...variant,
      C: clamp(variant.C * 0.9, 0, MAX_CHROMA),
    });

    return fromOklch(softened);
  } catch (error) {
    console.warn('[SpicetifyColorGenerators] Failed to generate mantle color:', error);
    return '#1e2030';
  }
}

/**
 * Generate zone-specific colors with context-aware hue shifts
 * Creates contextual color variations for different UI zones
 *
 * @param baseColor - Base hex color
 * @param zoneType - Zone type identifier
 * @returns Zone-specific hex color
 */
export function generateZoneColor(baseColor: string, zoneType: ZoneColorType): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) {
      console.warn(`[SpicetifyColorGenerators] Failed to parse RGB from ${baseColor}`);
      return baseColor;
    }

    const zoneAdjustments: Record<ZoneColorType, Parameters<typeof applyOklchAdjustment>[1]> = {
      flamingo: {
        hueTarget: 25,
        hueMix: 0.65,
        chromaScale: 1.2,
        lightnessShift: 0.04,
      },
      lavender: {
        hueTarget: 275,
        hueMix: 0.55,
        chromaScale: 1.1,
        lightnessShift: 0.02,
      },
      peach: {
        hueTarget: 40,
        hueMix: 0.7,
        chromaScale: 1.15,
        lightnessShift: 0.03,
      },
      rosewater: {
        hueTarget: 10,
        hueMix: 0.6,
        chromaScale: 1.05,
        lightnessShift: 0.05,
      },
      sapphire: {
        hueTarget: 210,
        hueMix: 0.7,
        chromaScale: 1.2,
        lightnessScale: 0.92,
        lightnessShift: -0.02,
      },
    };

    const sanitizedHex = fromOklch(sanitizeOklch(oklch));
    return applyOklchAdjustment(sanitizedHex, zoneAdjustments[zoneType], baseColor);
  } catch (error) {
    console.warn(`[SpicetifyColorGenerators] Failed to generate ${zoneType} color:`, error);
    return baseColor;
  }
}

/**
 * Generate palette-specific colors with context-aware variations
 * Creates color variations for Catppuccin palette colors
 *
 * @param baseColor - Base hex color
 * @param paletteType - Palette color type
 * @returns Palette-specific hex color
 */
export function generatePaletteColor(baseColor: string, paletteType: PaletteColorType): string {
  try {
    const oklch = toOklch(baseColor);
    if (!oklch) {
      console.warn(`[SpicetifyColorGenerators] Failed to parse RGB from ${baseColor}`);
      return baseColor;
    }

    const paletteAdjustments: Record<PaletteColorType, Parameters<typeof applyOklchAdjustment>[1]> = {
      pink: {
        hueTarget: 330,
        hueMix: 0.6,
        chromaScale: 1.18,
        lightnessShift: 0.03,
      },
      sky: {
        hueTarget: 205,
        hueMix: 0.65,
        chromaScale: 1.15,
        lightnessShift: 0.04,
      },
      red: {
        hueTarget: 20,
        hueMix: 0.7,
        chromaScale: 1.25,
        lightnessScale: 0.95,
      },
      maroon: {
        hueTarget: 350,
        hueMix: 0.6,
        chromaScale: 1.1,
        lightnessScale: 0.92,
      },
      yellow: {
        hueTarget: 95,
        hueMix: 0.65,
        chromaScale: 1.12,
        lightnessShift: 0.06,
      },
      green: {
        hueTarget: 145,
        hueMix: 0.65,
        chromaScale: 1.15,
        lightnessShift: 0.02,
      },
    };

    const sanitizedHex = fromOklch(sanitizeOklch(oklch));
    return applyOklchAdjustment(sanitizedHex, paletteAdjustments[paletteType], baseColor);
  } catch (error) {
    console.warn(`[SpicetifyColorGenerators] Failed to generate ${paletteType} color:`, error);
    return baseColor;
  }
}

// ============================================================================
// COLOR CONVERSION UTILITIES
// ============================================================================

/**
 * Convert hex color to RGB object
 *
 * @param hex - Hex color string (#RRGGBB or #RGB)
 * @returns RGB object or null if invalid
 */
export function hexToRgbObject(hex: string): RGBColor | null {
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length !== 6 && cleanHex.length !== 3) return null;

  let r: number, g: number, b: number;

  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    // Handle 3-character hex codes
    r = parseInt(cleanHex[0]! + cleanHex[0], 16);
    g = parseInt(cleanHex[1]! + cleanHex[1], 16);
    b = parseInt(cleanHex[2]! + cleanHex[2], 16);
  }

  return { r, g, b };
}

/**
 * Convert RGB values to hex string
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string (#RRGGBB)
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert RGB to HSL for hue manipulation
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL object
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL back to RGB
 *
 * @param h - Hue value (0-360 degrees)
 * @param s - Saturation value (0-100 percent)
 * @param l - Lightness value (0-100 percent)
 * @returns RGB object
 */
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert hex color to RGB string for CSS variables
 *
 * @param hex - Hex color string (#RRGGBB)
 * @returns RGB string for CSS (e.g., "198, 160, 246")
 */
export function hexToRgb(hex: string): string {
  const rgb = hexToRgbObject(hex);
  if (!rgb) return '0, 0, 0';

  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}
