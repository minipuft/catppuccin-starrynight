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
    const rgb = hexToRgbObject(hexColor);
    if (!rgb) return hexColor;

    // Simple darkening by reducing RGB values
    const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
    const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
    const b = Math.max(0, Math.round(rgb.b * (1 - factor)));

    return rgbToHex(r, g, b);
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
    const rgb = hexToRgbObject(hexColor);
    if (!rgb) return hexColor;

    // Simple lightening by moving RGB values toward white
    const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
    const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
    const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));

    return rgbToHex(r, g, b);
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
    const rgb = hexToRgbObject(hexColor);
    if (!rgb) return hexColor;

    // Convert RGB to HSL for hue rotation
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Rotate hue (wrap around 360 degrees)
    hsl.h = (hsl.h + hueDegrees) % 360;
    if (hsl.h < 0) hsl.h += 360;

    // Convert back to RGB
    const rotatedRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(rotatedRgb.r, rotatedRgb.g, rotatedRgb.b);
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#FF0000'; // Fallback

    // Create dramatic red with base color influence
    // Boost red channel significantly while maintaining base color warmth
    const dramaticRed = Math.min(255, rgb.r + 100);
    const warmGreen = Math.max(0, Math.min(rgb.g * 0.3, 100));
    const warmBlue = Math.max(0, Math.min(rgb.b * 0.2, 80));

    return rgbToHex(dramaticRed, warmGreen, warmBlue);
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#00FFFF'; // Fallback

    // Create dramatic cyan complementary to base color
    // High blue and green channels with base color influence
    const dramaticGreen = Math.min(255, rgb.g + 120);
    const dramaticBlue = Math.min(255, rgb.b + 140);
    const coolRed = Math.max(0, Math.min(rgb.r * 0.2, 60));

    return rgbToHex(coolRed, dramaticGreen, dramaticBlue);
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
    const rgb = hexToRgbObject(highlightColor);
    if (!rgb) return '#FFFF00'; // Fallback

    // Create bright yellow with highlight color characteristics
    const brightRed = Math.min(255, rgb.r + 80);
    const brightGreen = Math.min(255, rgb.g + 100);
    const subtleBlue = Math.max(0, Math.min(rgb.b * 0.3, 120));

    return rgbToHex(brightRed, brightGreen, subtleBlue);
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#8A2BE2'; // Fallback to violet

    // Create luminous holographic color with prismatic characteristics
    // Boost saturation and add prismatic shimmer
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Increase saturation for holographic effect
    const enhancedSaturation = Math.min(100, hsl.s + 30);
    // Adjust lightness for luminous glow
    const luminousLightness = Math.min(80, Math.max(40, hsl.l + 10));

    const enhancedRgb = hslToRgb(hsl.h, enhancedSaturation, luminousLightness);
    return rgbToHex(enhancedRgb.r, enhancedRgb.g, enhancedRgb.b);
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
    const rgb = hexToRgbObject(highlightColor);
    if (!rgb) return '#E0E0FF'; // Fallback to soft blue-white

    // Create soft, luminous glow by increasing all channels proportionally
    const glowIntensity = 0.7;
    const glowRed = Math.min(255, rgb.r + (255 - rgb.r) * glowIntensity);
    const glowGreen = Math.min(255, rgb.g + (255 - rgb.g) * glowIntensity);
    const glowBlue = Math.min(255, rgb.b + (255 - rgb.b) * glowIntensity);

    return rgbToHex(glowRed, glowGreen, glowBlue);
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#CAD3F5'; // Fallback to Catppuccin text

    // Calculate luminance to determine if background is light or dark
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5) {
      // Light background - use dark text
      return '#24273A'; // Catppuccin base (dark)
    } else {
      // Dark background - use light text
      return '#CAD3F5'; // Catppuccin text (light)
    }
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#A5ADCB'; // Fallback to Catppuccin subtext

    // Calculate luminance to determine background brightness
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5) {
      // Light background - use medium dark text
      return '#5B6078'; // Catppuccin overlay2 (medium dark)
    } else {
      // Dark background - use medium light text
      return '#A5ADCB'; // Catppuccin subtext (medium light)
    }
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return `rgba(88,91,112,${opacity})`; // Fallback to Catppuccin overlay

    // Calculate luminance to determine lightening strategy
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5) {
      // Light background - darken for overlay
      const factor = 1 - (opacity * 2); // Progressive darkening
      const overlayRed = Math.max(0, Math.round(rgb.r * factor));
      const overlayGreen = Math.max(0, Math.round(rgb.g * factor));
      const overlayBlue = Math.max(0, Math.round(rgb.b * factor));
      return rgbToHex(overlayRed, overlayGreen, overlayBlue);
    } else {
      // Dark background - lighten for overlay
      const factor = opacity * 255; // Progressive lightening
      const overlayRed = Math.min(255, Math.round(rgb.r + factor));
      const overlayGreen = Math.min(255, Math.round(rgb.g + factor));
      const overlayBlue = Math.min(255, Math.round(rgb.b + factor));
      return rgbToHex(overlayRed, overlayGreen, overlayBlue);
    }
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#232634'; // Fallback to Catppuccin crust

    // Calculate luminance to determine border strategy
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5) {
      // Light background - darker border
      const crustRed = Math.max(0, Math.round(rgb.r * 0.8));
      const crustGreen = Math.max(0, Math.round(rgb.g * 0.8));
      const crustBlue = Math.max(0, Math.round(rgb.b * 0.8));
      return rgbToHex(crustRed, crustGreen, crustBlue);
    } else {
      // Dark background - slightly lighter border
      const crustRed = Math.min(255, Math.round(rgb.r + 20));
      const crustGreen = Math.min(255, Math.round(rgb.g + 20));
      const crustBlue = Math.min(255, Math.round(rgb.b + 20));
      return rgbToHex(crustRed, crustGreen, crustBlue);
    }
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) return '#1e2030'; // Fallback to Catppuccin mantle

    // Calculate luminance for color strategy
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    if (luminance > 0.5) {
      // Light background - slightly darker mantle
      const mantleRed = Math.max(0, Math.round(rgb.r * 0.95));
      const mantleGreen = Math.max(0, Math.round(rgb.g * 0.95));
      const mantleBlue = Math.max(0, Math.round(rgb.b * 0.95));
      return rgbToHex(mantleRed, mantleGreen, mantleBlue);
    } else {
      // Dark background - slightly lighter mantle
      const mantleRed = Math.min(255, Math.round(rgb.r + 10));
      const mantleGreen = Math.min(255, Math.round(rgb.g + 10));
      const mantleBlue = Math.min(255, Math.round(rgb.b + 10));
      return rgbToHex(mantleRed, mantleGreen, mantleBlue);
    }
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) {
      console.warn(`[SpicetifyColorGenerators] Failed to parse RGB from ${baseColor}`);
      return baseColor;
    }

    // Zone-specific RGB adjustments for context-aware coloring
    const zoneAdjustments: Record<ZoneColorType, { rAdjust: number; gAdjust: number; bAdjust: number }> = {
      flamingo: { rAdjust: 20, gAdjust: -10, bAdjust: -5 }, // Warm pink for home comfort
      lavender: { rAdjust: 10, gAdjust: -5, bAdjust: 15 }, // Cool purple for focus/playlist
      peach: { rAdjust: 25, gAdjust: 10, bAdjust: -15 }, // Warm orange for artist discovery
      rosewater: { rAdjust: 15, gAdjust: -8, bAdjust: 0 }, // Subtle pink for secondary elements
      sapphire: { rAdjust: -20, gAdjust: -10, bAdjust: 25 } // Deep blue for search precision
    };

    const config = zoneAdjustments[zoneType];

    // Apply zone-specific RGB adjustments
    const adjustedR = Math.max(0, Math.min(255, rgb.r + config.rAdjust));
    const adjustedG = Math.max(0, Math.min(255, rgb.g + config.gAdjust));
    const adjustedB = Math.max(0, Math.min(255, rgb.b + config.bAdjust));

    return rgbToHex(adjustedR, adjustedG, adjustedB);
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
    const rgb = hexToRgbObject(baseColor);
    if (!rgb) {
      console.warn(`[SpicetifyColorGenerators] Failed to parse RGB from ${baseColor}`);
      return baseColor;
    }

    // Palette-specific RGB adjustments for context-aware color mapping
    const paletteAdjustments: Record<PaletteColorType, { rAdjust: number; gAdjust: number; bAdjust: number }> = {
      pink: { rAdjust: 30, gAdjust: -20, bAdjust: -10 }, // Soft pink for decorative elements
      sky: { rAdjust: -30, gAdjust: 10, bAdjust: 30 }, // Bright sky blue for information
      red: { rAdjust: 35, gAdjust: -25, bAdjust: -15 }, // Vibrant red for errors/warnings
      maroon: { rAdjust: 25, gAdjust: -15, bAdjust: -10 }, // Deep maroon for emphasis
      yellow: { rAdjust: 30, gAdjust: 25, bAdjust: -30 }, // Bright yellow for warnings
      green: { rAdjust: -25, gAdjust: 30, bAdjust: -20 } // Natural green for success
    };

    const config = paletteAdjustments[paletteType];

    // Apply palette-specific RGB adjustments
    const adjustedR = Math.max(0, Math.min(255, rgb.r + config.rAdjust));
    const adjustedG = Math.max(0, Math.min(255, rgb.g + config.gAdjust));
    const adjustedB = Math.max(0, Math.min(255, rgb.b + config.bAdjust));

    return rgbToHex(adjustedR, adjustedG, adjustedB);
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
