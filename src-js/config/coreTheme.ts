import type { CatppuccinFlavor, AccentColor, BrightnessMode, PaletteSystem } from "@/types/models";

/**
 * Core theme configuration and defaults
 * Contains essential theme settings without complex runtime behavior
 */

export interface CoreThemeDefaults {
  flavor: CatppuccinFlavor;
  accentColor: AccentColor;
  brightnessMode: BrightnessMode;
  paletteSystem: PaletteSystem;
  
  // Visual intensity controls
  gradientIntensity: "disabled" | "minimal" | "balanced" | "intense";
  glassmorphismLevel: "disabled" | "minimal" | "moderate" | "intense";
  
  // Performance defaults
  webglEnabled: boolean;
  animationQuality: "auto" | "low" | "high";
  webglQuality: "low" | "medium" | "high";
}

export const CORE_THEME_DEFAULTS: CoreThemeDefaults = {
  // Core Catppuccin settings
  flavor: "mocha",
  accentColor: "mauve", 
  brightnessMode: "bright",
  paletteSystem: "catppuccin",
  
  // Visual controls
  gradientIntensity: "balanced",
  glassmorphismLevel: "moderate",
  
  // Performance settings
  webglEnabled: true,
  animationQuality: "auto", 
  webglQuality: "medium",
};

/**
 * Catppuccin flavor definitions with their color properties
 */
export const CATPPUCCIN_FLAVORS = {
  latte: {
    name: "Latte",
    base: "#eff1f5",
    text: "#4c4f69",
    isDark: false,
  },
  frappe: {
    name: "Frappé", 
    base: "#303446",
    text: "#c6d0f5",
    isDark: true,
  },
  macchiato: {
    name: "Macchiato",
    base: "#24273a", 
    text: "#cad3f5",
    isDark: true,
  },
  mocha: {
    name: "Mocha",
    base: "#1e1e2e",
    text: "#cdd6f4", 
    isDark: true,
  },
} as const;

/**
 * Available accent colors for all Catppuccin flavors
 */
export const ACCENT_COLORS = [
  "rosewater", "flamingo", "pink", "mauve", "red", "maroon",
  "peach", "yellow", "green", "teal", "sky", "sapphire", 
  "blue", "lavender", "text", "none"
] as const;

/**
 * Validate core theme setting values
 */
export const CORE_THEME_VALIDATORS = {
  flavor: (value: unknown): value is CatppuccinFlavor => 
    typeof value === "string" && value in CATPPUCCIN_FLAVORS,
    
  accentColor: (value: unknown): value is AccentColor =>
    typeof value === "string" && ACCENT_COLORS.includes(value as AccentColor),
    
  brightnessMode: (value: unknown): value is BrightnessMode =>
    typeof value === "string" && ["bright", "balanced", "dark"].includes(value),
    
  paletteSystem: (value: unknown): value is PaletteSystem =>
    typeof value === "string" && ["catppuccin", "year3000"].includes(value),
    
  gradientIntensity: (value: unknown): boolean =>
    typeof value === "string" && ["disabled", "minimal", "balanced", "intense"].includes(value),
    
  glassmorphismLevel: (value: unknown): boolean =>
    typeof value === "string" && ["disabled", "minimal", "moderate", "intense"].includes(value),
    
  webglEnabled: (value: unknown): value is boolean =>
    typeof value === "boolean" || (typeof value === "string" && ["true", "false"].includes(value)),
    
  animationQuality: (value: unknown): boolean =>
    typeof value === "string" && ["auto", "low", "high"].includes(value),
    
  webglQuality: (value: unknown): boolean =>
    typeof value === "string" && ["low", "medium", "high"].includes(value),
};

/**
 * Get the appropriate brightness level for a flavor
 */
export function getFlavorBrightness(flavor: CatppuccinFlavor): "light" | "dark" {
  return CATPPUCCIN_FLAVORS[flavor].isDark ? "dark" : "light";
}

/**
 * Get theme contrast ratio for accessibility
 */
export function getThemeContrast(flavor: CatppuccinFlavor, brightnessMode: BrightnessMode): number {
  const baseContrast = CATPPUCCIN_FLAVORS[flavor].isDark ? 4.5 : 7.0;
  
  switch (brightnessMode) {
    case "bright": return baseContrast * 1.2;
    case "balanced": return baseContrast;
    case "dark": return baseContrast * 0.8;
    default: return baseContrast;
  }
}