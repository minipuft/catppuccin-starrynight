export const HARMONIC_MODES = {
  "analogous-flow": {
    rule: "analogous",
    angle: 30,
    description: "Gentle rivers of adjacent hues",
  },
  "triadic-trinity": {
    rule: "triadic",
    angle: 120,
    description: "Three-point stellar equilibrium",
  },
  "complementary-yin-yang": {
    rule: "complementary",
    angle: 180,
    description: "Opposing forces in harmony",
  },
  "tetradic-cosmic-cross": {
    rule: "tetradic",
    angle: 90,
    description: "Four-dimensional color matrix",
  },
  "split-complementary-aurora": {
    rule: "split-complementary",
    angle: 150,
    description: "Dancing polar opposites",
  },
  "monochromatic-meditation": {
    rule: "monochromatic",
    angle: 0,
    description: "Single-hue consciousness expansion",
  },
};

// Year 3000 Artistic Mode Profiles - Complete system definitions
export const ARTISTIC_MODE_PROFILES = {
  "corporate-safe": {
    displayName: "Corporate Safe",
    description:
      "Elegant professional choreography with subtle Year 3000 enhancements",
    philosophy:
      "Refined efficiency that respects workspace harmony while providing gentle predictive assistance",
    multipliers: {
      opacity: 0.15,
      saturation: 1.05,
      brightness: 1.02,
      contrast: 1.01,
      musicEnergyBoost: 0.3,
      // Year 3000 Kinetic Parameters
      kineticIntensity: 0.2,
      temporalPlayFactor: 0.1,
      quantumEmpathyLevel: 0.3,
      aestheticGravityStrength: 0.1,
      emergentChoreography: false,
      visualIntensityBase: 0.8,
    },
    features: {
      rippleEffects: false,
      temporalEcho: false,
      particleStreams: false,
      predictiveHighlights: true, // Subtle only
      glassEffects: true, // Minimal
      dataGlyphs: true, // Professional styling
      beatSync: false,
      colorHarmony: false,
      dimensionalEffects: false,
      quantumEmpathy: false, // Disabled for professional environments
      aestheticGravity: false, // Disabled for professional environments
    },
    performance: {
      maxParticles: 0,
      animationThrottle: 32, // 30fps for efficiency
      enableGPUAcceleration: false,
      reducedMotion: true,
    },
  },
  "artist-vision": {
    displayName: "Artist Vision",
    description:
      "Balanced creative expression that enhances musical experience without overwhelming",
    philosophy:
      "Harmonic amplification that honors artistic intent while providing musical visual synchronization",
    multipliers: {
      opacity: 0.25,
      saturation: 1.25,
      brightness: 1.15,
      contrast: 1.2,
      musicEnergyBoost: 1.0,
      // Year 3000 Kinetic Parameters
      kineticIntensity: 0.7,
      temporalPlayFactor: 0.5,
      quantumEmpathyLevel: 0.6,
      aestheticGravityStrength: 0.4,
      emergentChoreography: true,
      visualIntensityBase: 1.0,
    },
    features: {
      rippleEffects: true, // Moderate intensity
      temporalEcho: true, // Subtle trails
      particleStreams: true, // Music-responsive
      predictiveHighlights: true,
      glassEffects: true,
      dataGlyphs: true,
      beatSync: true, // Musical harmony
      colorHarmony: true, // Respectful blending
      dimensionalEffects: true, // Moderate
      quantumEmpathy: true, // Balanced empathy assistance
      aestheticGravity: true, // Balanced gravitational effects
    },
    performance: {
      maxParticles: 20,
      animationThrottle: 16, // 60fps
      enableGPUAcceleration: true,
      reducedMotion: false,
    },
  },
  "cosmic-maximum": {
    displayName: "Cosmic Maximum",
    description:
      "Full Year 3000 emergent systems choreography with kinetic beauty and aesthetic gravity",
    philosophy:
      "Gravitational optimism through aesthetic attractor fields that create quantum empathy and temporal play",
    multipliers: {
      opacity: 0.45,
      saturation: 1.75,
      brightness: 1.5,
      contrast: 1.6,
      musicEnergyBoost: 2.0,
      // Year 3000 Kinetic Parameters
      kineticIntensity: 1.8,
      temporalPlayFactor: 2.5,
      quantumEmpathyLevel: 0.85,
      aestheticGravityStrength: 1.6,
      emergentChoreography: true,
      visualIntensityBase: 1.4,
    },
    features: {
      rippleEffects: true, // Full intensity
      temporalEcho: true, // Visible trails
      particleStreams: true, // Attention flow
      predictiveHighlights: true, // Advanced prediction
      glassEffects: true, // Intense
      dataGlyphs: true, // Full animation
      beatSync: true, // Full synchronization
      colorHarmony: true, // Dynamic evolution
      dimensionalEffects: true, // Full 3D
      aestheticGravity: true, // Visual magnetism
      quantumEmpathy: true, // Full prediction
      temporalPlay: true, // Time-folding effects
    },
    performance: {
      maxParticles: 50,
      animationThrottle: 8, // 120fps for smoothness
      enableGPUAcceleration: true,
      reducedMotion: false,
    },
  },
};

export const YEAR3000_CONFIG = {
  enableDebug: true,
  enableContextualIntelligence: true,

  // Enhanced logging configuration
  logging: {
    level: "info", // "off", "error", "warn", "info", "debug", "verbose"
    performance: {
      enableFrameBudgetWarnings: true,
      throttleWarnings: true, // Throttle frequent warnings
      throttleInterval: 5000, // ms between repeated warnings
      enableAdaptiveDegradation: true, // Auto-reduce quality when needed
    },
  },
  enableColorExtraction: true,
  enableMusicAnalysis: true,
  enableCosmicSync: true, // NEW: Music-driven visual intensity
  musicModulationIntensity: 0.25,

  artisticMode: "artist-vision", // "corporate-safe" | "artist-vision" | "cosmic-maximum"

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

    // Apply any pending artistic mode changes
    if (this._pendingArtisticMode && this.isFullyInitialized()) {
      if (this.enableDebug) {
        console.log(
          `🎨 [YEAR3000_CONFIG] Applying pending artistic mode: ${this._pendingArtisticMode}`
        );
      }
      this.setArtisticMode(this._pendingArtisticMode);
      this._pendingArtisticMode = null;
    }

    if (this.enableDebug) {
      console.log(
        "🔧 [YEAR3000_CONFIG] Initialized with context-bound methods"
      );
    }

    return this; // Allow chaining
  },

  currentHarmonicMode: "analogous-flow",
  harmonicBaseColor: null,
  harmonicIntensity: 0.7,
  harmonicEvolution: true,

  // Legacy multipliers - kept for backward compatibility but deprecated
  artisticMultipliers: {
    opacity: 0.28,
    saturation: 1.45,
    brightness: 1.25,
    contrast: 1.35,
    musicEnergyBoost: 1.6,
  },

  corporateMultipliers: {
    opacity: 0.08,
    saturation: 1.05,
    brightness: 1.02,
    contrast: 1.01,
    musicEnergyBoost: 1.0,
  },

  cosmicMultipliers: {
    opacity: 0.45,
    saturation: 1.75,
    brightness: 1.5,
    contrast: 1.6,
    musicEnergyBoost: 2.0,
  },

  musicVisualSync: {
    energyScaling: {
      low: 0.6,
      medium: 1.0,
      high: 1.4,
    },
    valenceScaling: {
      sad: 0.8,
      neutral: 1.0,
      happy: 1.3,
    },
    danceabilityEffects: {
      enable: true,
      animationSpeedMultiplier: 1.5,
      blurVariation: 0.3,
    },
    // NEW: Enhanced BPM calculation (inspired by Cat Jam extension)
    enhancedBPM: {
      enable: true,
      useSmartCalculation: true, // Toggle for enhanced vs basic tempo
      useRealisticData: true, // Use actual Spicetify-available data only

      // Tempo-based danceability estimation ranges
      danceabilityEstimation: {
        highDance: { min: 120, max: 140, value: 0.8 }, // House/Dance music
        mediumDance: { min: 100, max: 160, value: 0.6 }, // Pop/Electronic
        lowMediumDance: { min: 80, max: 180, value: 0.4 }, // General music
        lowDance: { value: 0.2 }, // Very slow/fast
      },

      // Energy estimation from tempo + loudness
      energyEstimation: {
        tempoWeight: 0.6, // How much tempo affects energy estimate
        loudnessWeight: 0.4, // How much loudness affects energy estimate
        tempoRange: { min: 60, max: 180 }, // Expected tempo range
        loudnessRange: { min: -60, max: 0 }, // Expected loudness range (dB)
      },

      // Enhanced BPM calculation parameters
      danceabilityThresholds: {
        high: 0.7, // High danceability - use full tempo
        low: 0.3, // Low danceability - may reduce tempo
      },
      energyMultiplierRange: {
        min: 0.8, // Minimum energy multiplier
        max: 1.4, // Maximum energy multiplier
      },
      tempoMultipliers: {
        highDance: 1.0, // Full tempo for danceable tracks
        mediumDance: 0.75, // Moderate reduction
        lowDance: 0.5, // Significant reduction for smooth visuals
      },

      // Fallback values when audio data is unavailable
      fallbacks: {
        tempo: 120,
        loudness: -10,
        danceability: 0.5,
        energy: 0.5,
        key: 0,
        timeSignature: 4,
      },
    },
  },

  // Enhanced: Get current mode profile with full Year 3000 parameters
  getCurrentModeProfile() {
    try {
      // Defensive check for artisticMode property
      const mode = this.artisticMode || "artist-vision";
      const profile =
        ARTISTIC_MODE_PROFILES[mode] || ARTISTIC_MODE_PROFILES["artist-vision"];

      if (!profile) {
        console.warn(
          `[YEAR3000_CONFIG] No profile found for mode: ${mode}, using default`
        );
        return ARTISTIC_MODE_PROFILES["artist-vision"];
      }

      return profile;
    } catch (error) {
      console.error(`[YEAR3000_CONFIG] Error in getCurrentModeProfile:`, error);
      return ARTISTIC_MODE_PROFILES["artist-vision"];
    }
  },

  // Enhanced: Get current multipliers from active mode profile
  getCurrentMultipliers() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[YEAR3000_CONFIG] getCurrentModeProfile method not available, using fallback multipliers"
        );
        return this.artisticMultipliers; // Fallback to legacy multipliers
      }

      const currentProfile = this.getCurrentModeProfile();

      // Defensive check for profile structure
      if (!currentProfile || !currentProfile.multipliers) {
        console.warn(
          "[YEAR3000_CONFIG] Invalid profile or missing multipliers, using fallback"
        );
        return this.artisticMultipliers;
      }

      return currentProfile.multipliers;
    } catch (error) {
      console.error("[YEAR3000_CONFIG] Error in getCurrentMultipliers:", error);
      return this.artisticMultipliers; // Safe fallback
    }
  },

  // Enhanced: Get current features from active mode profile
  getCurrentFeatures() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[YEAR3000_CONFIG] getCurrentModeProfile method not available, using fallback features"
        );
        return {
          enableAdvancedEffects: true,
          enableHarmony: true,
          beatSync: true,
          colorHarmony: true,
        };
      }

      const currentProfile = this.getCurrentModeProfile();

      // Defensive check for profile structure
      if (!currentProfile || !currentProfile.features) {
        console.warn(
          "[YEAR3000_CONFIG] Invalid profile or missing features, using fallback"
        );
        return {
          enableAdvancedEffects: true,
          enableHarmony: true,
          beatSync: true,
          colorHarmony: true,
        };
      }

      return currentProfile.features;
    } catch (error) {
      console.error("[YEAR3000_CONFIG] Error in getCurrentFeatures:", error);
      return {
        enableAdvancedEffects: true,
        enableHarmony: true,
        beatSync: true,
        colorHarmony: true,
      };
    }
  },

  // Enhanced: Get current performance settings from active mode profile
  getCurrentPerformanceSettings() {
    try {
      // Defensive check for method existence
      if (typeof this.getCurrentModeProfile !== "function") {
        console.warn(
          "[YEAR3000_CONFIG] getCurrentModeProfile method not available, using fallback performance settings"
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
          "[YEAR3000_CONFIG] Invalid profile or missing performance settings, using fallback"
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
        "[YEAR3000_CONFIG] Error in getCurrentPerformanceSettings:",
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

  // Check if YEAR3000_CONFIG is fully initialized with all required methods
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
        "[YEAR3000_CONFIG] Not fully initialized, deferring artistic mode change"
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
          `🎨 [YEAR3000_CONFIG] Artistic mode changed: ${previousMode} → ${mode}`
        );
        console.log(
          `🎨 [YEAR3000_CONFIG] New profile:`,
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
        globalThis.year3000System.setGradientParameters
      ) {
        globalThis.year3000System.setGradientParameters(
          document.documentElement
        );
      }
      return true;
    }
    console.warn(
      `[YEAR3000_CONFIG] Invalid artistic mode: ${mode}. Valid modes:`,
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
        console.log(`🔧 [YEAR3000_CONFIG] Logging level set to: ${level}`);
      }
      return true;
    }
    console.warn(
      `[YEAR3000_CONFIG] Invalid logging level: ${level}. Valid levels:`,
      validLevels
    );
    return false;
  },

  // Disable performance warnings (useful for production or when performance is acceptable)
  disablePerformanceWarnings() {
    this.logging.performance.enableFrameBudgetWarnings = false;
    console.log("🔧 [YEAR3000_CONFIG] Performance warnings disabled");
  },

  // Enable performance warnings
  enablePerformanceWarnings() {
    this.logging.performance.enableFrameBudgetWarnings = true;
    console.log("🔧 [YEAR3000_CONFIG] Performance warnings enabled");
  },

  // Set performance warning throttle interval (ms)
  setPerformanceWarningThrottle(intervalMs) {
    if (typeof intervalMs === "number" && intervalMs >= 0) {
      this.logging.performance.throttleInterval = intervalMs;
      this.logging.performance.throttleWarnings = intervalMs > 0;
      console.log(
        `🔧 [YEAR3000_CONFIG] Performance warning throttle set to: ${intervalMs}ms`
      );
      return true;
    }
    console.warn(
      "[YEAR3000_CONFIG] Invalid throttle interval. Must be a non-negative number."
    );
    return false;
  },

  // Quick setup for different environments
  setupForProduction() {
    this.setLoggingLevel("warn");
    this.disablePerformanceWarnings();
    this.logging.performance.enableAdaptiveDegradation = true;
    console.log("🔧 [YEAR3000_CONFIG] Configured for production environment");
  },

  setupForDevelopment() {
    this.setLoggingLevel("debug");
    this.enablePerformanceWarnings();
    this.setPerformanceWarningThrottle(2000); // 2 second throttle
    this.logging.performance.enableAdaptiveDegradation = true;
    console.log("🔧 [YEAR3000_CONFIG] Configured for development environment");
  },

  setupForDebugging() {
    this.setLoggingLevel("verbose");
    this.enablePerformanceWarnings();
    this.setPerformanceWarningThrottle(500); // 0.5 second throttle for detailed debugging
    this.logging.performance.enableAdaptiveDegradation = false; // Don't degrade during debugging
    console.log("🔧 [YEAR3000_CONFIG] Configured for debugging environment");
  },

  // Validate configuration health and functionality
  validateConfigHealth() {
    const health = {
      methodsWorking: {},
      propertiesValid: {},
      issues: [],
      score: 100,
    };

    // Test each method to ensure it works
    const methodsToTest = [
      "getCurrentModeProfile",
      "getCurrentMultipliers",
      "getCurrentFeatures",
      "setArtisticMode",
    ];

    methodsToTest.forEach((methodName) => {
      try {
        if (typeof this[methodName] === "function") {
          // Test method call (safe operations only)
          if (methodName === "setArtisticMode") {
            // Don't actually change mode, just validate method exists and is callable
            health.methodsWorking[methodName] = true;
          } else {
            const result = this[methodName]();
            health.methodsWorking[methodName] = !!result;
            if (!result) {
              health.issues.push(`Method ${methodName} returns falsy result`);
              health.score -= 15;
            }
          }
        } else {
          health.methodsWorking[methodName] = false;
          health.issues.push(`Method ${methodName} not available`);
          health.score -= 20;
        }
      } catch (error) {
        health.methodsWorking[methodName] = false;
        health.issues.push(
          `Method ${methodName} throws error: ${error.message}`
        );
        health.score -= 25;
      }
    });

    // Validate key properties
    health.propertiesValid.artisticMode =
      !!this.artisticMode && typeof this.artisticMode === "string";
    health.propertiesValid.enableDebug = typeof this.enableDebug === "boolean";
    health.propertiesValid.boundMethods = !!this.boundGetCurrentMultipliers;

    if (!health.propertiesValid.artisticMode) {
      health.issues.push("artisticMode property invalid");
      health.score -= 10;
    }
    if (!health.propertiesValid.enableDebug) {
      health.issues.push("enableDebug property invalid");
      health.score -= 5;
    }
    if (!health.propertiesValid.boundMethods) {
      health.issues.push("bound methods not initialized");
      health.score -= 10;
    }

    // Test that ARTISTIC_MODE_PROFILES are accessible
    try {
      const profiles = ARTISTIC_MODE_PROFILES;
      const currentProfile = profiles[this.artisticMode];
      if (!currentProfile) {
        health.issues.push(
          `Current artistic mode '${this.artisticMode}' has no profile`
        );
        health.score -= 15;
      }
    } catch (error) {
      health.issues.push("ARTISTIC_MODE_PROFILES not accessible");
      health.score -= 30;
    }

    health.score = Math.max(0, health.score);
    health.healthy = health.score >= 80; // Consider healthy if score >= 80

    return health;
  },

  loadArtisticPreference() {
    // SettingsManager will be the primary source of truth after full initialization.
    // This localStorage access can serve as an initial default before SettingsManager loads.
    const saved = localStorage.getItem("year3000-artistic-mode");
    const validModes = Object.keys(ARTISTIC_MODE_PROFILES);
    if (saved && validModes.includes(saved)) {
      this.artisticMode = saved;
    } else {
      this.artisticMode = "artist-vision"; // Default
    }

    if (this.enableDebug) {
      console.log(
        `🎨 [YEAR3000_CONFIG] Loaded artistic preference: ${this.artisticMode}`
      );
    }
  },
};

// Initialize YEAR3000_CONFIG with bound methods immediately for external usage
if (typeof YEAR3000_CONFIG.init === "function") {
  YEAR3000_CONFIG.init();
}
