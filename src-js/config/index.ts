/**
 * Unified Configuration API
 * Clean public interface for all theme configuration modules
 */

// Core theme configuration
export {
  CORE_THEME_DEFAULTS,
  CATPPUCCIN_FLAVORS,
  ACCENT_COLORS,
  CORE_THEME_VALIDATORS,
  getFlavorBrightness,
  getThemeContrast,
  type CoreThemeDefaults,
} from "./coreTheme";

// Harmonic color modes
export {
  HARMONIC_MODES,
  HARMONIC_DEFAULTS,
  MUSIC_VISUAL_SYNC,
  ENHANCED_BPM_CONFIG,
  getHarmonicMode,
  getHarmonicModeKeys,
  isValidHarmonicMode,
  calculateHarmonicAngle,
  getEnergyColorMultiplier,
} from "./harmonicModes";

// Artistic visual profiles
export {
  ARTISTIC_MODE_PROFILES,
  DEFAULT_ARTISTIC_MODE,
  getArtisticProfile,
  getArtisticModeKeys,
  isValidArtisticMode,
  getArtisticPerformanceTier,
  getArtisticDeviceRequirements,
  getEffectiveMultiplier,
  getArtisticColorTemperature,
} from "./artisticProfiles";

// Performance profiles
export {
  PERFORMANCE_PROFILES,
  DEFAULT_LOGGING_CONFIG,
  PERFORMANCE_THRESHOLDS,
  DEVICE_DETECTION_CONFIG,
  getPerformanceProfile,
  getPerformanceProfileKeys,
  isValidPerformanceProfile,
  detectOptimalPerformanceProfile,
  calculateFrameBudget,
  isPerformanceMeetingTargets,
  getQualityScalingRecommendations,
  type PerformanceProfile,
  type LoggingConfig,
} from "./performanceProfiles";

// Settings keys (unchanged)
export * from "./settingKeys";

// Type-safe settings system
export type { TypedSettings, SettingsChangeEvent, StorageInterface } from "./typedSettingsManager";
export { TypedSettingsManager } from "./typedSettingsManager";
export type { 
  CatppuccinFlavor, 
  AccentColor, 
  BrightnessMode, 
  PaletteSystem,
  ArtisticMode,
  HarmonicModeKey,
  IntensityLevel,
  QualityLevel,
  WebGLQuality,
  SettingMetadata 
} from "./settingsSchema";
export {
  SETTINGS_METADATA,
  validateSetting,
  parseSetting,
  serializeSetting,
  getDefaultValue,
  getAllSettingKeys,
  isValidSettingKey,
  getSettingsByCategory,
  getSettingMetadata,
} from "./settingsSchema";

// Settings provider and storage
export { SettingsProvider, getSettingsProvider, setSettingsProvider, getSettings, settings } from "./settingsProvider";
export { SpicetifyStorageAdapter, createSpicetifyStorage } from "./storage/spicetifyStorage";
export { BrowserStorageAdapter, createBrowserStorage } from "./storage/browserStorage";

// Legacy compatibility layer - deprecated, use TypedSettingsManager directly
// export { LegacySettingsManager, createLegacySettingsManager, type ThemeSettings } from "./legacyCompat";

// Backward compatibility exports
export {
  // Legacy exports for existing code
  HARMONIC_MODES as HARMONIC_MODES_LEGACY,
  ARTISTIC_MODE_PROFILES as ARTISTIC_MODE_PROFILES_LEGACY,
  PERFORMANCE_PROFILES as PERFORMANCE_PROFILES_LEGACY,
} from "./index";

/**
 * Configuration health check
 * Validates all configuration modules are properly loaded
 */
export function validateConfigurationHealth(): {
  isHealthy: boolean;
  loadedModules: string[];
  issues: string[];
} {
  const issues: string[] = [];
  const modules: string[] = [];
  
  // Import modules to access their exports
  const { CORE_THEME_DEFAULTS } = require("./coreTheme");
  const { HARMONIC_MODES } = require("./harmonicModes");
  const { ARTISTIC_MODE_PROFILES } = require("./artisticProfiles");
  const { PERFORMANCE_PROFILES } = require("./performanceProfiles");
  
  // Check core theme
  try {
    if (Object.keys(CORE_THEME_DEFAULTS).length > 0) {
      modules.push("coreTheme");
    } else {
      issues.push("Core theme defaults not loaded");
    }
  } catch (e) {
    issues.push("Core theme module error: " + e);
  }
  
  // Check harmonic modes
  try {
    if (Object.keys(HARMONIC_MODES).length > 0) {
      modules.push("harmonicModes");
    } else {
      issues.push("Harmonic modes not loaded");
    }
  } catch (e) {
    issues.push("Harmonic modes module error: " + e);
  }
  
  // Check artistic profiles
  try {
    if (Object.keys(ARTISTIC_MODE_PROFILES).length > 0) {
      modules.push("artisticProfiles");
    } else {
      issues.push("Artistic profiles not loaded");
    }
  } catch (e) {
    issues.push("Artistic profiles module error: " + e);
  }
  
  // Check performance profiles
  try {
    if (Object.keys(PERFORMANCE_PROFILES).length > 0) {
      modules.push("performanceProfiles");
    } else {
      issues.push("Performance profiles not loaded");
    }
  } catch (e) {
    issues.push("Performance profiles module error: " + e);
  }
  
  return {
    isHealthy: issues.length === 0,
    loadedModules: modules,
    issues,
  };
}

/**
 * Get configuration summary for debugging
 */
export function getConfigurationSummary(): {
  coreTheme: {
    defaultFlavor: string;
    availableAccents: number;
    supportedBrightnessModes: number;
  };
  harmonicModes: {
    available: number;
    defaultMode: string;
    musicSyncEnabled: boolean;
  };
  artisticProfiles: {
    available: number;
    defaultProfile: string;
    performanceTiers: string[];
  };
  performanceProfiles: {
    available: number;
    defaultProfile: string;
    loggingEnabled: boolean;
  };
} {
  // Import modules to access their exports
  const { CORE_THEME_DEFAULTS, ACCENT_COLORS } = require("./coreTheme");
  const { HARMONIC_MODES, HARMONIC_DEFAULTS, MUSIC_VISUAL_SYNC } = require("./harmonicModes");
  const { ARTISTIC_MODE_PROFILES, DEFAULT_ARTISTIC_MODE } = require("./artisticProfiles");
  const { PERFORMANCE_PROFILES, DEFAULT_LOGGING_CONFIG } = require("./performanceProfiles");

  return {
    coreTheme: {
      defaultFlavor: CORE_THEME_DEFAULTS.flavor,
      availableAccents: ACCENT_COLORS.length,
      supportedBrightnessModes: 3, // bright, balanced, dark
    },
    harmonicModes: {
      available: Object.keys(HARMONIC_MODES).length,
      defaultMode: HARMONIC_DEFAULTS.mode,
      musicSyncEnabled: MUSIC_VISUAL_SYNC.danceabilityEffects.enable,
    },
    artisticProfiles: {
      available: Object.keys(ARTISTIC_MODE_PROFILES).length,
      defaultProfile: DEFAULT_ARTISTIC_MODE,
      performanceTiers: ["low", "medium", "high"],
    },
    performanceProfiles: {
      available: Object.keys(PERFORMANCE_PROFILES).length,
      defaultProfile: "balanced",
      loggingEnabled: DEFAULT_LOGGING_CONFIG.performance.enableFrameBudgetWarnings,
    },
  };
}