import type { HarmonicMode } from "@/types/models";
import { HARMONIC_MODES } from "./harmonicModes";
import { ARTISTIC_MODE_PROFILES } from "./artisticProfiles";
import { CORE_THEME_VALIDATORS } from "./coreTheme";

/**
 * Type-safe settings schema with automatic validation and type conversion
 * Eliminates manual string parsing and provides compile-time safety
 */

// Base types for settings values
export type CatppuccinFlavor = "mocha" | "latte" | "frappe" | "macchiato";
export type AccentColor = 
  | "rosewater" | "flamingo" | "pink" | "mauve" | "red" | "maroon"
  | "peach" | "yellow" | "green" | "teal" | "sky" | "sapphire" 
  | "blue" | "lavender" | "text" | "none";
export type BrightnessMode = "bright" | "balanced" | "dark";
export type PaletteSystem = "catppuccin" | "year3000";
export type ArtisticMode = keyof typeof ARTISTIC_MODE_PROFILES;
export type HarmonicModeKey = keyof typeof HARMONIC_MODES;
export type IntensityLevel = "disabled" | "minimal" | "balanced" | "intense";
export type QualityLevel = "auto" | "low" | "high";
export type WebGLQuality = "low" | "medium" | "high";

/**
 * Complete typed settings interface
 * Maps setting keys to their actual TypeScript types
 */
export interface TypedSettings {
  // === CORE THEME SETTINGS ===
  "catppuccin-flavor": CatppuccinFlavor;
  "catppuccin-accentColor": AccentColor;
  "sn-brightness-mode": BrightnessMode;
  
  // === ADVANCED SYSTEMS ===
  "sn-palette-system": PaletteSystem;
  "sn-artistic-mode": ArtisticMode;
  "sn-current-harmonic-mode": HarmonicModeKey;
  "sn-harmonic-intensity": number;        // Auto-parsed from string
  "sn-harmonic-evolution": boolean;       // Auto-parsed from string
  
  // === VISUAL CONTROLS ===
  "sn-gradient-intensity": IntensityLevel;
  "sn-glassmorphism-level": IntensityLevel;
  
  // === PERFORMANCE SETTINGS ===
  "sn-webgl-enabled": boolean;            // Auto-parsed from string
  "sn-animation-quality": QualityLevel;
  "sn-webgl-quality": WebGLQuality;
}

/**
 * Setting metadata with validation and conversion functions
 */
export interface SettingMetadata<T> {
  defaultValue: T;
  validator: (value: unknown) => value is T;
  parser?: (value: string) => T | null;
  serializer?: (value: T) => string;
  description: string;
  category: "core" | "advanced" | "visual" | "performance";
}

/**
 * Complete settings metadata registry
 */
export const SETTINGS_METADATA: {
  [K in keyof TypedSettings]: SettingMetadata<TypedSettings[K]>
} = {
  // === CORE THEME SETTINGS ===
  "catppuccin-flavor": {
    defaultValue: "mocha",
    validator: CORE_THEME_VALIDATORS.flavor,
    description: "Catppuccin color theme variant",
    category: "core",
  },
  
  "catppuccin-accentColor": {
    defaultValue: "mauve",
    validator: CORE_THEME_VALIDATORS.accentColor,
    description: "Primary accent color for UI elements",
    category: "core",
  },
  
  "sn-brightness-mode": {
    defaultValue: "bright",
    validator: CORE_THEME_VALIDATORS.brightnessMode,
    description: "Overall theme brightness level",
    category: "core",
  },
  
  // === ADVANCED SYSTEMS ===
  "sn-palette-system": {
    defaultValue: "catppuccin",
    validator: CORE_THEME_VALIDATORS.paletteSystem,
    description: "Color palette system (Catppuccin or Year 3000)",
    category: "advanced",
  },
  
  "sn-artistic-mode": {
    defaultValue: "artist-vision",
    validator: (value): value is ArtisticMode => 
      typeof value === "string" && value in ARTISTIC_MODE_PROFILES,
    description: "Visual intensity and behavior preset",
    category: "advanced",
  },
  
  "sn-current-harmonic-mode": {
    defaultValue: "analogous-flow",
    validator: (value): value is HarmonicModeKey =>
      typeof value === "string" && value in HARMONIC_MODES,
    description: "Color harmony rule for music synchronization",
    category: "advanced",
  },
  
  "sn-harmonic-intensity": {
    defaultValue: 0.7,
    validator: (value): value is number =>
      typeof value === "number" && value >= 0 && value <= 1,
    parser: (value: string) => {
      const parsed = parseFloat(value);
      return !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : null;
    },
    serializer: (value: number) => value.toString(),
    description: "Intensity of color harmony effects (0-1)",
    category: "advanced",
  },
  
  "sn-harmonic-evolution": {
    defaultValue: true,
    validator: (value): value is boolean => typeof value === "boolean",
    parser: (value: string) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return null;
    },
    serializer: (value: boolean) => value.toString(),
    description: "Enable dynamic color harmony evolution",
    category: "advanced",
  },
  
  // === VISUAL CONTROLS ===
  "sn-gradient-intensity": {
    defaultValue: "balanced",
    validator: (value): value is IntensityLevel =>
      typeof value === "string" && ["disabled", "minimal", "balanced", "intense"].includes(value),
    description: "Master control for all gradient background effects",
    category: "visual",
  },
  
  "sn-glassmorphism-level": {
    defaultValue: "balanced" as IntensityLevel,
    validator: (value): value is IntensityLevel =>
      typeof value === "string" && ["disabled", "minimal", "balanced", "intense"].includes(value),
    description: "Glass-like transparency effects intensity",
    category: "visual",
  },
  
  // === PERFORMANCE SETTINGS ===
  "sn-webgl-enabled": {
    defaultValue: true,
    validator: (value): value is boolean => typeof value === "boolean",
    parser: (value: string) => {
      if (value === "true") return true;
      if (value === "false") return false;
      return null;
    },
    serializer: (value: boolean) => value.toString(),
    description: "Enable WebGL-accelerated visual effects",
    category: "performance",
  },
  
  "sn-animation-quality": {
    defaultValue: "auto",
    validator: (value): value is QualityLevel =>
      typeof value === "string" && ["auto", "low", "high"].includes(value),
    description: "Animation performance vs quality balance",
    category: "performance",
  },
  
  "sn-webgl-quality": {
    defaultValue: "medium",
    validator: (value): value is WebGLQuality =>
      typeof value === "string" && ["low", "medium", "high"].includes(value),
    description: "WebGL rendering quality level",
    category: "performance",
  },
};

/**
 * Get all setting keys by category
 */
export function getSettingsByCategory(category: SettingMetadata<any>["category"]): (keyof TypedSettings)[] {
  return Object.entries(SETTINGS_METADATA)
    .filter(([_, metadata]) => metadata.category === category)
    .map(([key, _]) => key as keyof TypedSettings);
}

/**
 * Get setting metadata by key
 */
export function getSettingMetadata<K extends keyof TypedSettings>(
  key: K
): SettingMetadata<TypedSettings[K]> {
  return SETTINGS_METADATA[key];
}

/**
 * Validate a setting value against its schema
 */
export function validateSetting<K extends keyof TypedSettings>(
  key: K,
  value: unknown
): value is TypedSettings[K] {
  const metadata = SETTINGS_METADATA[key];
  return metadata.validator(value);
}

/**
 * Parse a string value to the appropriate type
 */
export function parseSetting<K extends keyof TypedSettings>(
  key: K,
  value: string
): TypedSettings[K] | null {
  const metadata = SETTINGS_METADATA[key];
  
  if (metadata.parser) {
    return metadata.parser(value) as TypedSettings[K] | null;
  }
  
  // For non-parsed types, validate the string directly
  if (metadata.validator(value)) {
    return value as TypedSettings[K];
  }
  
  return null;
}

/**
 * Serialize a typed value to string for storage
 */
export function serializeSetting<K extends keyof TypedSettings>(
  key: K,
  value: TypedSettings[K]
): string {
  const metadata = SETTINGS_METADATA[key];
  
  if (metadata.serializer) {
    return metadata.serializer(value);
  }
  
  // Default serialization
  return String(value);
}

/**
 * Get default value for a setting
 */
export function getDefaultValue<K extends keyof TypedSettings>(
  key: K
): TypedSettings[K] {
  return SETTINGS_METADATA[key].defaultValue;
}

/**
 * Get all setting keys
 */
export function getAllSettingKeys(): (keyof TypedSettings)[] {
  return Object.keys(SETTINGS_METADATA) as (keyof TypedSettings)[];
}

/**
 * Type guard to check if a string is a valid setting key
 */
export function isValidSettingKey(key: string): key is keyof TypedSettings {
  return key in SETTINGS_METADATA;
}