import type {
  ArtisticMode,
  ArtisticModeProfile,
  ArtisticModeProfiles,
  ColorHarmonyModes,
  HarmonicModes,
  AdvancedSystemConfig,
} from "@/types/models";
import type { SystemMetrics } from "@/types/systems";
import { settings } from "@/config";

// Import modular configuration directly to avoid circular imports
import { COLOR_HARMONY_MODES as MODULAR_COLOR_HARMONY_MODES, HARMONIC_MODES as MODULAR_HARMONIC_MODES, MUSIC_VISUAL_SYNC, ENHANCED_BPM_CONFIG } from "./harmonicModes";
import { ARTISTIC_MODE_PROFILES as MODULAR_ARTISTIC_PROFILES } from "./artisticProfiles";
import { PERFORMANCE_PROFILES, DEFAULT_LOGGING_CONFIG } from "./performanceProfiles";

// Modern exports
export const COLOR_HARMONY_MODES: ColorHarmonyModes = MODULAR_COLOR_HARMONY_MODES;

// Re-export for backward compatibility
export const HARMONIC_MODES: HarmonicModes = MODULAR_HARMONIC_MODES;
export const ARTISTIC_MODE_PROFILES: ArtisticModeProfiles = MODULAR_ARTISTIC_PROFILES;

export const ADVANCED_SYSTEM_CONFIG: AdvancedSystemConfig = {
  enableDebug: true,
  enableContextualIntelligence: true,
  paletteSystem: 'catppuccin', // Default to maintain compatibility

  performanceProfiles: PERFORMANCE_PROFILES,

  // Enhanced logging configuration
  logging: DEFAULT_LOGGING_CONFIG,
  healthCheckInterval: 10000,
  visual: {
    lightweightParticleSystem: { mode: "artist-vision" },
    spatialNexusSystem: { mode: "artist-vision" },
    dataGlyphSystem: { mode: "artist-vision" },
    beatSyncVisualSystem: { mode: "artist-vision" },
    behavioralPredictionEngine: { mode: "artist-vision" },
    predictiveMaterializationSystem: { mode: "artist-vision" },
    sidebarVisualStateSystem: { mode: "artist-vision" },
  },
  enableColorExtraction: true,
  enableMusicAnalysis: true,
  enableAdvancedSync: true, // NEW: Music-driven visual intensity
  musicModulationIntensity: 0.4, // Increased for dynamic gradient responsiveness

  // Active artistic mode for UX / visual presets
  artisticMode: "artist-vision", // "corporate-safe" | "artist-vision" | "advanced-maximum"

  // Context-bound method references for external calling
  boundGetCurrentMultipliers: null,
  boundGetCurrentFeatures: null,
  boundGetCurrentPerformanceSettings: null,

  // Pending artistic mode for deferred application
  _pendingArtisticMode: null,

  // Initialize bound methods to preserve context
  init() {
    this.boundGetCurrentMultipliers = this.getCurrentMultipliers.bind(this);
    this.boundGetCurrentFeatures = this.getCurrentFeatures.bind(this);
    this.boundGetCurrentPerformanceSettings =
      this.getCurrentPerformanceSettings.bind(this);

    // Only load artistic preferences on first initialization or if values are missing
    const needsPreferenceLoad = 
      !this.artisticMode || 
      !this.paletteSystem;
      
    if (needsPreferenceLoad) {
      if (this.enableDebug) {
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] Loading preferences (current: artistic=${this.artisticMode}, palette=${this.paletteSystem})`
        );
      }
      this.loadArtisticPreference();
    } else if (this.enableDebug) {
      console.log(
        `🎨 [ADVANCED_SYSTEM_CONFIG] Skipping preference load (current: artistic=${this.artisticMode}, palette=${this.paletteSystem})`
      );
    }

    // Apply any pending artistic mode changes
    if (this._pendingArtisticMode && this.isFullyInitialized()) {
      if (this.enableDebug) {
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] Applying pending artistic mode: ${this._pendingArtisticMode}`
        );
      }
      this.setArtisticMode(this._pendingArtisticMode);
      this._pendingArtisticMode = null;
    }

    if (this.enableDebug) {
      console.log(
        "🔧 [ADVANCED_SYSTEM_CONFIG] Initialized with context-bound methods"
      );
    }

    return this; // Allow chaining
  },

  currentColorHarmonyMode: "analogous-flow",
  colorHarmonyBaseColor: null,
  colorHarmonyIntensity: 0.85, // Enhanced for cinematic gradient harmonies
  colorHarmonyEvolution: true,

  // Music sync configuration imported from modular harmonic modes
  musicVisualSync: {
    ...MUSIC_VISUAL_SYNC,
    enhancedBPM: ENHANCED_BPM_CONFIG,
  },

  // Enhanced: Get current mode profile with full Year3000 parameters
  getCurrentModeProfile(): ArtisticModeProfile {
    const mode = this.artisticMode || "artist-vision";
    return (
      ARTISTIC_MODE_PROFILES[mode] || ARTISTIC_MODE_PROFILES["artist-vision"]!
    );
  },

  // Enhanced: Get current multipliers from active mode profile
  getCurrentMultipliers() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] getCurrentModeProfile method not available, using fallback multipliers"
        );
        return this["artisticMultipliers"] as any; // Fallback to legacy multipliers
      }

      const currentProfile = this.getCurrentModeProfile();

      // Defensive check for profile structure
      if (!currentProfile || !currentProfile.multipliers) {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] Invalid profile or missing multipliers, using fallback"
        );
        return this["artisticMultipliers"] as any;
      }

      return currentProfile.multipliers;
    } catch (error) {
      console.error("[ADVANCED_SYSTEM_CONFIG] Error in getCurrentMultipliers:", error);
      return this["artisticMultipliers"] as any; // Safe fallback
    }
  },

  // Enhanced: Get current features from active mode profile
  getCurrentFeatures() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] getCurrentModeProfile method not available, using fallback features"
        );
        return {
          enableAdvancedEffects: true,
          enableHarmony: true,
          beatSync: true,
          colorHarmony: true,
        } as any;
      }

      const currentProfile = this.getCurrentModeProfile();

      // Defensive check for profile structure
      if (!currentProfile || !currentProfile.features) {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] Invalid profile or missing features, using fallback"
        );
        return {
          enableAdvancedEffects: true,
          enableHarmony: true,
          beatSync: true,
          colorHarmony: true,
        } as any;
      }

      return currentProfile.features;
    } catch (error) {
      console.error("[ADVANCED_SYSTEM_CONFIG] Error in getCurrentFeatures:", error);
      return {
        enableAdvancedEffects: true,
        enableHarmony: true,
        beatSync: true,
        colorHarmony: true,
      } as any;
    }
  },

  // Enhanced: Get current performance settings from active mode profile
  getCurrentPerformanceSettings() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] getCurrentModeProfile method not available, using fallback performance settings"
        );
        return {
          maxParticles: 20,
          animationThrottle: 16,
          enableGPUAcceleration: true,
          reducedMotion: false,
        };
      }

      const currentProfile = this.getCurrentModeProfile();

      // Defensive check for profile structure
      if (!currentProfile || !currentProfile.performance) {
        console.warn(
          "[ADVANCED_SYSTEM_CONFIG] Invalid profile or missing performance settings, using fallback"
        );
        return {
          maxParticles: 20,
          animationThrottle: 16,
          enableGPUAcceleration: true,
          reducedMotion: false,
        };
      }

      return currentProfile.performance;
    } catch (error) {
      console.error(
        "[ADVANCED_SYSTEM_CONFIG] Error in getCurrentPerformanceSettings:",
        error
      );
      return {
        maxParticles: 20,
        animationThrottle: 16,
        enableGPUAcceleration: true,
        reducedMotion: false,
      };
    }
  },

  // Check if ADVANCED_SYSTEM_CONFIG is fully initialized with all required methods
  isFullyInitialized() {
    const requiredMethods = [
      "setArtisticMode",
      "getCurrentModeProfile",
      "getCurrentMultipliers",
      "getCurrentFeatures",
      "getCurrentPerformanceSettings",
    ];
    return requiredMethods.every(
      (method) => typeof this[method] === "function"
    );
  },

  // Safe setArtisticMode wrapper that validates state
  safeSetArtisticMode(mode) {
    if (!this.isFullyInitialized()) {
      console.warn(
        "[ADVANCED_SYSTEM_CONFIG] Not fully initialized, deferring artistic mode change"
      );
      // Store for later application
      this._pendingArtisticMode = mode;
      return false;
    }

    return this.setArtisticMode(mode);
  },

  setArtisticMode(mode) {
    const validModes = Object.keys(ARTISTIC_MODE_PROFILES);
    if (validModes.includes(mode)) {
      const previousMode = this.artisticMode;
      this.artisticMode = mode;

      if (this.enableDebug) {
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] Artistic mode changed: ${previousMode} → ${mode}`
        );
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] New profile:`,
          this.getCurrentModeProfile()
        );
      }

      // Dispatch event for systems to respond to mode changes
      if (typeof document !== "undefined") {
        document.dispatchEvent(
          new CustomEvent("year3000ArtisticModeChanged", {
            detail: {
              previousMode,
              newMode: mode,
              profile: this.getCurrentModeProfile(),
            },
          })
        );
      }

      // TODO: Refactor this dependency. year3000System might not be globally available here.
      // It should ideally be accessed via a callback, event, or dependency injection.
      if (
        typeof globalThis.year3000System !== "undefined" &&
        (globalThis.year3000System as any).setGradientParameters
      ) {
        (globalThis.year3000System as any).setGradientParameters(
          document.documentElement
        );
      }
      return true;
    }
    console.warn(
      `[ADVANCED_SYSTEM_CONFIG] Invalid artistic mode: ${mode}. Valid modes:`,
      validModes
    );
    return false;
  },

  // ===========================================
  // 🔧 LOGGING & PERFORMANCE CONFIGURATION HELPERS
  // ===========================================

  // Set logging level for all Year 3000 systems
  setLoggingLevel(level) {
    const validLevels = ["off", "error", "warn", "info", "debug", "verbose"];
    if (validLevels.includes(level)) {
      this.logging.level = level;
      if (level !== "off") {
        console.log(`🔧 [ADVANCED_SYSTEM_CONFIG] Logging level set to: ${level}`);
      }
      return true;
    }
    console.warn(
      `[ADVANCED_SYSTEM_CONFIG] Invalid logging level: ${level}. Valid levels:`,
      validLevels
    );
    return false;
  },

  // Disable performance warnings (useful for production or when performance is acceptable)
  disablePerformanceWarnings() {
    this.logging.performance.enableFrameBudgetWarnings = false;
    console.log("🔧 [ADVANCED_SYSTEM_CONFIG] Performance warnings disabled");
  },

  // Enable performance warnings
  enablePerformanceWarnings() {
    this.logging.performance.enableFrameBudgetWarnings = true;
    console.log("🔧 [ADVANCED_SYSTEM_CONFIG] Performance warnings enabled");
  },

  // Set performance warning throttle interval (ms)
  setPerformanceWarningThrottle(intervalMs: number) {
    if (typeof intervalMs === "number" && intervalMs >= 0) {
      this.logging.performance.throttleInterval = intervalMs;
      this.logging.performance.throttleWarnings = intervalMs > 0;
      console.log(
        `🔧 [ADVANCED_SYSTEM_CONFIG] Performance warning throttle set to: ${intervalMs}ms`
      );
      return true;
    }
    console.warn(
      "[ADVANCED_SYSTEM_CONFIG] Invalid throttle interval. Must be a non-negative number."
    );
    return false;
  },

  // Quick setup for different environments
  setupForProduction() {
    this.setLoggingLevel("warn");
    this.disablePerformanceWarnings();
    this.logging.performance.enableAdaptiveDegradation = true;
    console.log("🔧 [ADVANCED_SYSTEM_CONFIG] Configured for production environment");
  },

  setupForDevelopment() {
    this.setLoggingLevel("debug");
    this.enablePerformanceWarnings();
    this.setPerformanceWarningThrottle(2000); // 2 second throttle
    this.logging.performance.enableAdaptiveDegradation = true;
    console.log("🔧 [ADVANCED_SYSTEM_CONFIG] Configured for development environment");
  },

  setupForDebugging() {
    this.setLoggingLevel("verbose");
    this.enablePerformanceWarnings();
    this.setPerformanceWarningThrottle(500); // 0.5 second throttle for detailed debugging
    this.logging.performance.enableAdaptiveDegradation = false; // Don't degrade during debugging
    console.log("🔧 [ADVANCED_SYSTEM_CONFIG] Configured for debugging environment");
  },

  // Validate configuration health and functionality
  validateConfigHealth() {
    const detailedIssues: {
      key: string;
      severity: "critical" | "warning";
      message: string;
    }[] = [];
    
    const healthReport = {
      healthy: true,
      system: "AdvancedSystemConfig",
      details: "Configuration health validation",
      issues: [] as string[],
      metrics: {} as SystemMetrics,
    };

    const configKeys = Object.keys(this) as (keyof AdvancedSystemConfig)[];

    // Check for function properties being bound
    const functionProperties = configKeys.filter(
      (key) => typeof this[key] === "function"
    );

    for (const key of functionProperties) {
      if (!this.hasOwnProperty(key)) {
        detailedIssues.push({
          key: String(key),
          severity: "warning",
          message: `Method ${key} is not an own property, may indicate prototype chain issues.`,
        });
      }
    }

    // Dynamic checks for artistic mode properties
    const checkProfile = (mode: string) => {
      if (!ARTISTIC_MODE_PROFILES[mode]) {
        detailedIssues.push({
          key: `artisticMode:${mode}`,
          severity: "critical",
          message: `Artistic mode profile for '${mode}' is missing.`,
        });
        return;
      }
      (healthReport.metrics as any)[`${mode}Profile`] = "ok";
    };

    checkProfile(this.artisticMode);
    checkProfile("artist-vision");
    checkProfile("corporate-safe");

    // Convert detailed issues to string array and update health status
    if (detailedIssues.length > 0) {
      healthReport.healthy = false;
      healthReport.issues = detailedIssues.map(issue => 
        `[${issue.severity.toUpperCase()}] ${issue.key}: ${issue.message}`
      );
      healthReport.details = detailedIssues.some((i) => i.severity === "critical")
        ? "Critical configuration issues detected"
        : "Configuration issues detected";
    }

    if (this.enableDebug) {
      console.log("[ADVANCED_SYSTEM_CONFIG] Health Check Report:", healthReport);
    }

    return healthReport;
  },

  loadArtisticPreference() {
    try {
      // Load artistic mode preference using new typed settings system
      const saved = settings.get("sn-artistic-mode");
      const validModes = Object.keys(ARTISTIC_MODE_PROFILES);
      
      // Only update if the loaded value is different to avoid unnecessary resets
      if (saved && validModes.includes(String(saved)) && this.artisticMode !== saved) {
        this.artisticMode = String(saved) as ArtisticMode;
        if (this.enableDebug) {
          console.log(`🎨 [ADVANCED_SYSTEM_CONFIG] Updated artistic mode from storage: ${saved}`);
        }
      } else if (!saved && this.artisticMode !== "artist-vision") {
        this.artisticMode = "artist-vision"; // Default
        if (this.enableDebug) {
          console.log(`🎨 [ADVANCED_SYSTEM_CONFIG] Reset artistic mode to default: artist-vision`);
        }
      }

      // Load palette system preference from appropriate setting
      const savedPalette = settings.get("sn-palette-system");
      const validPaletteSystems = ['catppuccin', 'year3000'];
      
      // Only update if the loaded value is different to avoid unnecessary resets
      if (savedPalette && validPaletteSystems.includes(String(savedPalette)) && this.paletteSystem !== savedPalette) {
        this.paletteSystem = String(savedPalette) as any;
        if (this.enableDebug) {
          console.log(`🎨 [ADVANCED_SYSTEM_CONFIG] Updated palette system from storage: ${savedPalette}`);
        }
      } else if (!savedPalette && this.paletteSystem !== 'catppuccin') {
        this.paletteSystem = 'catppuccin'; // Default for compatibility
        if (this.enableDebug) {
          console.log(`🎨 [ADVANCED_SYSTEM_CONFIG] Reset palette system to default: catppuccin`);
        }
      }

      if (this.enableDebug) {
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] Current artistic preference: ${this.artisticMode}`
        );
        console.log(
          `🎨 [ADVANCED_SYSTEM_CONFIG] Current palette system: ${this.paletteSystem}`
        );
      }
    } catch (error) {
      if (this.enableDebug) {
        console.warn(`🎨 [ADVANCED_SYSTEM_CONFIG] Failed to load preferences:`, error);
      }
      // Use fallback defaults
      this.artisticMode = "artist-vision";
      this.paletteSystem = 'catppuccin';
    }
  },
};

// =========================================================================
// BACKWARD COMPATIBILITY ALIASES - REMOVED
// =========================================================================

// ADVANCED_SYSTEM_CONFIG has been removed. Use ADVANCED_SYSTEM_CONFIG instead.

// Initialize configuration with bound methods immediately for external usage
if (typeof ADVANCED_SYSTEM_CONFIG.init === "function") {
  ADVANCED_SYSTEM_CONFIG.init();
}
