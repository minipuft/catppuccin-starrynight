/**
 * Palette Constants - Catppuccin Color System
 *
 * Defines semantic hues, surface lightness offsets, and aesthetic profiles
 * for the dynamic OKLCH palette generation system.
 */

/**
 * Semantic color hues for Catppuccin palette (in degrees, 0-360)
 */
export const SEMANTIC_HUES = {
  rosewater: 10,
  flamingo: 0,
  red: 343,
  maroon: 350,
  peach: 23,
  yellow: 41,
  green: 115,
  teal: 174,
  sky: 189,
  sapphire: 199,
  blue: 217,
  lavender: 232,
  mauve: 267,
  pink: 316,
} as const;

/**
 * Surface color lightness offsets relative to base (0.0 to 1.0)
 */
export const SURFACE_LIGHTNESS_OFFSETS = {
  crust: -0.08,
  mantle: -0.04,
  base: 0,
  surface0: 0.04,
  surface1: 0.08,
  surface2: 0.12,
  overlay0: 0.16,
  overlay1: 0.2,
  overlay2: 0.24,
  subtext0: 0.28,
  subtext1: 0.32,
  text: 0.36,
} as const;

/**
 * Aesthetic profile configurations for palette transformation
 */
export interface AestheticProfile {
  name: string;
  chromaMultiplier: number;
  lightnessRange: [number, number];
  surfaceDesaturation: number;
  hueBias: number;
}

export const AESTHETIC_PROFILES: Record<string, AestheticProfile> = {
  catppuccin: {
    name: "Catppuccin",
    chromaMultiplier: 0.9,
    lightnessRange: [0.6, 0.9],
    surfaceDesaturation: 0.7,
    hueBias: 5,
  },
  year3000: {
    name: "Year3000",
    chromaMultiplier: 1.3,
    lightnessRange: [0.55, 0.95],
    surfaceDesaturation: 0.6,
    hueBias: -5,
  },
} as const;
