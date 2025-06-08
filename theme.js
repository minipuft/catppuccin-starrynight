var catppuccinStarryNight = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) =>
    typeof require !== "undefined"
      ? require
      : typeof Proxy !== "undefined"
      ? new Proxy(x, {
          get: (a, b) => (typeof require !== "undefined" ? require : a)[b],
        })
      : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) =>
    function __init() {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res;
    };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if ((from && typeof from === "object") || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, {
            get: () => from[key],
            enumerable:
              !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
          });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (
    (target = mod != null ? __create(__getProtoOf(mod)) : {}),
    __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule
        ? __defProp(target, "default", { value: mod, enumerable: true })
        : target,
      mod
    )
  );

  // src-js/config/globalConfig.js
  var HARMONIC_MODES, ARTISTIC_MODE_PROFILES, YEAR3000_CONFIG;
  var init_globalConfig = __esm({
    "src-js/config/globalConfig.js"() {
      HARMONIC_MODES = {
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
      ARTISTIC_MODE_PROFILES = {
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
            predictiveHighlights: true,
            // Subtle only
            glassEffects: true,
            // Minimal
            dataGlyphs: true,
            // Professional styling
            beatSync: false,
            colorHarmony: false,
            dimensionalEffects: false,
            quantumEmpathy: false,
            // Disabled for professional environments
            aestheticGravity: false,
            // Disabled for professional environments
          },
          performance: {
            maxParticles: 0,
            animationThrottle: 32,
            // 30fps for efficiency
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
            musicEnergyBoost: 1,
            // Year 3000 Kinetic Parameters
            kineticIntensity: 0.7,
            temporalPlayFactor: 0.5,
            quantumEmpathyLevel: 0.6,
            aestheticGravityStrength: 0.4,
            emergentChoreography: true,
            visualIntensityBase: 1,
          },
          features: {
            rippleEffects: true,
            // Moderate intensity
            temporalEcho: true,
            // Subtle trails
            particleStreams: true,
            // Music-responsive
            predictiveHighlights: true,
            glassEffects: true,
            dataGlyphs: true,
            beatSync: true,
            // Musical harmony
            colorHarmony: true,
            // Respectful blending
            dimensionalEffects: true,
            // Moderate
            quantumEmpathy: true,
            // Balanced empathy assistance
            aestheticGravity: true,
            // Balanced gravitational effects
          },
          performance: {
            maxParticles: 20,
            animationThrottle: 16,
            // 60fps
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
            musicEnergyBoost: 2,
            // Year 3000 Kinetic Parameters
            kineticIntensity: 1.8,
            temporalPlayFactor: 2.5,
            quantumEmpathyLevel: 0.85,
            aestheticGravityStrength: 1.6,
            emergentChoreography: true,
            visualIntensityBase: 1.4,
          },
          features: {
            rippleEffects: true,
            // Full intensity
            temporalEcho: true,
            // Visible trails
            particleStreams: true,
            // Attention flow
            predictiveHighlights: true,
            // Advanced prediction
            glassEffects: true,
            // Intense
            dataGlyphs: true,
            // Full animation
            beatSync: true,
            // Full synchronization
            colorHarmony: true,
            // Dynamic evolution
            dimensionalEffects: true,
            // Full 3D
            aestheticGravity: true,
            // Visual magnetism
            quantumEmpathy: true,
            // Full prediction
            temporalPlay: true,
            // Time-folding effects
          },
          performance: {
            maxParticles: 50,
            animationThrottle: 8,
            // 120fps for smoothness
            enableGPUAcceleration: true,
            reducedMotion: false,
          },
        },
      };
      YEAR3000_CONFIG = {
        enableDebug: true,
        enableContextualIntelligence: true,
        // Enhanced logging configuration
        logging: {
          level: "info",
          // "off", "error", "warn", "info", "debug", "verbose"
          performance: {
            enableFrameBudgetWarnings: true,
            throttleWarnings: true,
            // Throttle frequent warnings
            throttleInterval: 5e3,
            // ms between repeated warnings
            enableAdaptiveDegradation: true,
            // Auto-reduce quality when needed
          },
        },
        enableColorExtraction: true,
        enableMusicAnalysis: true,
        enableCosmicSync: true,
        // NEW: Music-driven visual intensity
        musicModulationIntensity: 0.25,
        artisticMode: "artist-vision",
        // "corporate-safe" | "artist-vision" | "cosmic-maximum"
        // Context-bound method references for external calling
        boundGetCurrentMultipliers: null,
        boundGetCurrentFeatures: null,
        boundGetCurrentPerformanceSettings: null,
        // Pending artistic mode for deferred application
        _pendingArtisticMode: null,
        // Initialize bound methods to preserve context
        init() {
          this.boundGetCurrentMultipliers =
            this.getCurrentMultipliers.bind(this);
          this.boundGetCurrentFeatures = this.getCurrentFeatures.bind(this);
          this.boundGetCurrentPerformanceSettings =
            this.getCurrentPerformanceSettings.bind(this);
          if (this._pendingArtisticMode && this.isFullyInitialized()) {
            if (this.enableDebug) {
              console.log(
                `\u{1F3A8} [YEAR3000_CONFIG] Applying pending artistic mode: ${this._pendingArtisticMode}`
              );
            }
            this.setArtisticMode(this._pendingArtisticMode);
            this._pendingArtisticMode = null;
          }
          if (this.enableDebug) {
            console.log(
              "\u{1F527} [YEAR3000_CONFIG] Initialized with context-bound methods"
            );
          }
          return this;
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
          musicEnergyBoost: 1,
        },
        cosmicMultipliers: {
          opacity: 0.45,
          saturation: 1.75,
          brightness: 1.5,
          contrast: 1.6,
          musicEnergyBoost: 2,
        },
        musicVisualSync: {
          energyScaling: {
            low: 0.6,
            medium: 1,
            high: 1.4,
          },
          valenceScaling: {
            sad: 0.8,
            neutral: 1,
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
            useSmartCalculation: true,
            // Toggle for enhanced vs basic tempo
            useRealisticData: true,
            // Use actual Spicetify-available data only
            // Tempo-based danceability estimation ranges
            danceabilityEstimation: {
              highDance: { min: 120, max: 140, value: 0.8 },
              // House/Dance music
              mediumDance: { min: 100, max: 160, value: 0.6 },
              // Pop/Electronic
              lowMediumDance: { min: 80, max: 180, value: 0.4 },
              // General music
              lowDance: { value: 0.2 },
              // Very slow/fast
            },
            // Energy estimation from tempo + loudness
            energyEstimation: {
              tempoWeight: 0.6,
              // How much tempo affects energy estimate
              loudnessWeight: 0.4,
              // How much loudness affects energy estimate
              tempoRange: { min: 60, max: 180 },
              // Expected tempo range
              loudnessRange: { min: -60, max: 0 },
              // Expected loudness range (dB)
            },
            // Enhanced BPM calculation parameters
            danceabilityThresholds: {
              high: 0.7,
              // High danceability - use full tempo
              low: 0.3,
              // Low danceability - may reduce tempo
            },
            energyMultiplierRange: {
              min: 0.8,
              // Minimum energy multiplier
              max: 1.4,
              // Maximum energy multiplier
            },
            tempoMultipliers: {
              highDance: 1,
              // Full tempo for danceable tracks
              mediumDance: 0.75,
              // Moderate reduction
              lowDance: 0.5,
              // Significant reduction for smooth visuals
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
            const mode = this.artisticMode || "artist-vision";
            const profile =
              ARTISTIC_MODE_PROFILES[mode] ||
              ARTISTIC_MODE_PROFILES["artist-vision"];
            if (!profile) {
              console.warn(
                `[YEAR3000_CONFIG] No profile found for mode: ${mode}, using default`
              );
              return ARTISTIC_MODE_PROFILES["artist-vision"];
            }
            return profile;
          } catch (error) {
            console.error(
              `[YEAR3000_CONFIG] Error in getCurrentModeProfile:`,
              error
            );
            return ARTISTIC_MODE_PROFILES["artist-vision"];
          }
        },
        // Enhanced: Get current multipliers from active mode profile
        getCurrentMultipliers() {
          try {
            if (typeof this.getCurrentModeProfile !== "function") {
              console.warn(
                "[YEAR3000_CONFIG] getCurrentModeProfile method not available, using fallback multipliers"
              );
              return this.artisticMultipliers;
            }
            const currentProfile = this.getCurrentModeProfile();
            if (!currentProfile || !currentProfile.multipliers) {
              console.warn(
                "[YEAR3000_CONFIG] Invalid profile or missing multipliers, using fallback"
              );
              return this.artisticMultipliers;
            }
            return currentProfile.multipliers;
          } catch (error) {
            console.error(
              "[YEAR3000_CONFIG] Error in getCurrentMultipliers:",
              error
            );
            return this.artisticMultipliers;
          }
        },
        // Enhanced: Get current features from active mode profile
        getCurrentFeatures() {
          try {
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
            console.error(
              "[YEAR3000_CONFIG] Error in getCurrentFeatures:",
              error
            );
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
                `\u{1F3A8} [YEAR3000_CONFIG] Artistic mode changed: ${previousMode} \u2192 ${mode}`
              );
              console.log(
                `\u{1F3A8} [YEAR3000_CONFIG] New profile:`,
                this.getCurrentModeProfile()
              );
            }
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
          const validLevels = [
            "off",
            "error",
            "warn",
            "info",
            "debug",
            "verbose",
          ];
          if (validLevels.includes(level)) {
            this.logging.level = level;
            if (level !== "off") {
              console.log(
                `\u{1F527} [YEAR3000_CONFIG] Logging level set to: ${level}`
              );
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
          console.log(
            "\u{1F527} [YEAR3000_CONFIG] Performance warnings disabled"
          );
        },
        // Enable performance warnings
        enablePerformanceWarnings() {
          this.logging.performance.enableFrameBudgetWarnings = true;
          console.log(
            "\u{1F527} [YEAR3000_CONFIG] Performance warnings enabled"
          );
        },
        // Set performance warning throttle interval (ms)
        setPerformanceWarningThrottle(intervalMs) {
          if (typeof intervalMs === "number" && intervalMs >= 0) {
            this.logging.performance.throttleInterval = intervalMs;
            this.logging.performance.throttleWarnings = intervalMs > 0;
            console.log(
              `\u{1F527} [YEAR3000_CONFIG] Performance warning throttle set to: ${intervalMs}ms`
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
          console.log(
            "\u{1F527} [YEAR3000_CONFIG] Configured for production environment"
          );
        },
        setupForDevelopment() {
          this.setLoggingLevel("debug");
          this.enablePerformanceWarnings();
          this.setPerformanceWarningThrottle(2e3);
          this.logging.performance.enableAdaptiveDegradation = true;
          console.log(
            "\u{1F527} [YEAR3000_CONFIG] Configured for development environment"
          );
        },
        setupForDebugging() {
          this.setLoggingLevel("verbose");
          this.enablePerformanceWarnings();
          this.setPerformanceWarningThrottle(500);
          this.logging.performance.enableAdaptiveDegradation = false;
          console.log(
            "\u{1F527} [YEAR3000_CONFIG] Configured for debugging environment"
          );
        },
        // Validate configuration health and functionality
        validateConfigHealth() {
          const health = {
            methodsWorking: {},
            propertiesValid: {},
            issues: [],
            score: 100,
          };
          const methodsToTest = [
            "getCurrentModeProfile",
            "getCurrentMultipliers",
            "getCurrentFeatures",
            "setArtisticMode",
          ];
          methodsToTest.forEach((methodName) => {
            try {
              if (typeof this[methodName] === "function") {
                if (methodName === "setArtisticMode") {
                  health.methodsWorking[methodName] = true;
                } else {
                  const result = this[methodName]();
                  health.methodsWorking[methodName] = !!result;
                  if (!result) {
                    health.issues.push(
                      `Method ${methodName} returns falsy result`
                    );
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
          health.propertiesValid.artisticMode =
            !!this.artisticMode && typeof this.artisticMode === "string";
          health.propertiesValid.enableDebug =
            typeof this.enableDebug === "boolean";
          health.propertiesValid.boundMethods =
            !!this.boundGetCurrentMultipliers;
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
          health.healthy = health.score >= 80;
          return health;
        },
        loadArtisticPreference() {
          const saved = localStorage.getItem("year3000-artistic-mode");
          const validModes = Object.keys(ARTISTIC_MODE_PROFILES);
          if (saved && validModes.includes(saved)) {
            this.artisticMode = saved;
          } else {
            this.artisticMode = "artist-vision";
          }
          if (this.enableDebug) {
            console.log(
              `\u{1F3A8} [YEAR3000_CONFIG] Loaded artistic preference: ${this.artisticMode}`
            );
          }
        },
      };
      if (typeof YEAR3000_CONFIG.init === "function") {
        YEAR3000_CONFIG.init();
      }
    },
  });

  // src-js/utils/Year3000Utilities.js
  var Year3000Utilities, SystemHealthMonitor, Year3000UnifiedDebug;
  var init_Year3000Utilities = __esm({
    "src-js/utils/Year3000Utilities.js"() {
      init_globalConfig();
      Year3000Utilities = {
        _cachedRootStyle: null,
        _rootElement: null,
        // Centralized getRootStyle
        getRootStyle() {
          if (!this._rootElement) {
            this._rootElement = document.documentElement;
          }
          return this._rootElement;
        },
        // Centralized throttle function
        throttle(func, limit) {
          let inThrottle;
          return function throttled(...args) {
            const context = this;
            if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => (inThrottle = false), limit);
            }
          };
        },
        hexToRgb(hex) {
          if (typeof hex !== "string") {
            console.warn(
              "[StarryNight hexToRgb] Input is not a string. Using fallback color (black). Hex:",
              hex
            );
            return { r: 0, g: 0, b: 0 };
          }
          const sanitizedHex = hex.trim();
          let processedHex = sanitizedHex.startsWith("#")
            ? sanitizedHex
            : `#${sanitizedHex}`;
          processedHex = processedHex.replace(/##+/g, "#");
          if (processedHex.length === 4) {
            processedHex = `#${processedHex[1]}${processedHex[1]}${processedHex[2]}${processedHex[2]}${processedHex[3]}${processedHex[3]}`;
          }
          const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
            processedHex
          );
          if (result) {
            try {
              const rgb = {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
              };
              return rgb;
            } catch (e) {
              console.error(
                "[StarryNight hexToRgb] ERROR during parseInt:",
                e,
                "for hex:",
                processedHex,
                ". Using fallback color (black)."
              );
              return { r: 0, g: 0, b: 0 };
            }
          } else {
            console.warn(
              "[StarryNight hexToRgb] REGEX failed for hex:",
              processedHex,
              ". Using fallback color (black)."
            );
            return { r: 0, g: 0, b: 0 };
          }
        },
        rgbToHsl(r, g, b) {
          r /= 255;
          g /= 255;
          b /= 255;
          const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
          let h,
            s,
            l = (max + min) / 2;
          if (max === min) {
            h = s = 0;
          } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }
          return { h: h * 360, s: s * 100, l: l * 100 };
        },
        hslToRgb(h, s, l) {
          h /= 360;
          s /= 100;
          l /= 100;
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };
          let r_val, g_val, b_val;
          if (s === 0) {
            r_val = g_val = b_val = l;
          } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r_val = hue2rgb(p, q, h + 1 / 3);
            g_val = hue2rgb(p, q, h);
            b_val = hue2rgb(p, q, h - 1 / 3);
          }
          return {
            r: Math.round(r_val * 255),
            g: Math.round(g_val * 255),
            b: Math.round(b_val * 255),
          };
        },
        rgbToHex(r, g, b) {
          return (
            "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
          );
        },
        calculateContrastRatio(color1, color2) {
          const getLuminance = (rgb) => {
            const [r_val, g_val, b_val] = [rgb.r, rgb.g, rgb.b].map((c) => {
              c = c / 255;
              return c <= 0.03928
                ? c / 12.92
                : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
          };
          const rgb1 = this.hexToRgb(color1);
          const rgb2 = this.hexToRgb(color2);
          if (!rgb1 || !rgb2) return 1;
          const lum1 = getLuminance(rgb1);
          const lum2 = getLuminance(rgb2);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        },
        lerpSmooth(current, target, deltaTime, halfLife) {
          const EPSILON = 1e-5;
          if (halfLife <= EPSILON || deltaTime <= 0) {
            if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
              if (halfLife <= EPSILON) {
              }
            }
            return target;
          }
          const result =
            target + (current - target) * Math.pow(2, -deltaTime / halfLife);
          return result;
        },
        // NEW: BPM and timing utility methods (inspired by Cat Jam extension)
        /**
         * Convert BPM to milliseconds between beats
         * @param {number} bpm - Beats per minute
         * @returns {number} Milliseconds between beats
         */
        bpmToInterval(bpm) {
          if (!bpm || bpm <= 0) return 500;
          return 6e4 / bpm;
        },
        /**
         * Convert interval to BPM
         * @param {number} intervalMs - Milliseconds between beats
         * @returns {number} Beats per minute
         */
        intervalToBpm(intervalMs) {
          if (!intervalMs || intervalMs <= 0) return 120;
          return 6e4 / intervalMs;
        },
        /**
         * Calculate optimal animation frame rate for given BPM
         * @param {number} bpm - Beats per minute
         * @param {number} framesPerBeat - Desired animation frames per beat (default: 4)
         * @returns {number} Milliseconds between animation frames
         */
        bpmToAnimationFrameRate(bpm, framesPerBeat = 4) {
          const beatInterval = this.bpmToInterval(bpm);
          return beatInterval / framesPerBeat;
        },
        /**
         * Check if current time is on a beat boundary (within tolerance)
         * @param {number} currentTime - Current timestamp in milliseconds
         * @param {number} trackStartTime - Track start timestamp
         * @param {number} bpm - Beats per minute
         * @param {number} tolerance - Tolerance in milliseconds (default: 50ms)
         * @returns {boolean} True if current time is close to a beat
         */
        isOnBeat(currentTime, trackStartTime, bpm, tolerance = 50) {
          const beatInterval = this.bpmToInterval(bpm);
          const timeSinceStart = currentTime - trackStartTime;
          const beatPosition = timeSinceStart % beatInterval;
          return (
            beatPosition <= tolerance ||
            beatPosition >= beatInterval - tolerance
          );
        },
        /**
         * Calculate beat phase (0-1) within current beat interval
         * @param {number} currentTime - Current timestamp in milliseconds
         * @param {number} trackStartTime - Track start timestamp
         * @param {number} bpm - Beats per minute
         * @returns {number} Phase within beat (0-1, where 0 = beat start, 1 = next beat)
         */
        getBeatPhase(currentTime, trackStartTime, bpm) {
          const beatInterval = this.bpmToInterval(bpm);
          const timeSinceStart = currentTime - trackStartTime;
          const beatPosition = timeSinceStart % beatInterval;
          return beatPosition / beatInterval;
        },
        /**
         * Calculate next beat time
         * @param {number} currentTime - Current timestamp in milliseconds
         * @param {number} trackStartTime - Track start timestamp
         * @param {number} bpm - Beats per minute
         * @returns {number} Timestamp of next beat
         */
        getNextBeatTime(currentTime, trackStartTime, bpm) {
          const beatInterval = this.bpmToInterval(bpm);
          const timeSinceStart = currentTime - trackStartTime;
          const beatsSinceStart = Math.floor(timeSinceStart / beatInterval);
          return trackStartTime + (beatsSinceStart + 1) * beatInterval;
        },
        /**
         * Synchronize animation to BPM with easing functions
         * @param {number} beatPhase - Current beat phase (0-1)
         * @param {string} easingType - Type of easing ("linear", "ease-in", "ease-out", "bounce")
         * @returns {number} Eased value (0-1)
         */
        easeBeatAnimation(beatPhase, easingType = "ease-out") {
          switch (easingType) {
            case "ease-in":
              return beatPhase * beatPhase;
            case "ease-out":
              return 1 - Math.pow(1 - beatPhase, 2);
            case "bounce":
              return (
                Math.abs(Math.sin(beatPhase * Math.PI * 2)) *
                (1 - Math.abs(beatPhase - 0.5) * 2)
              );
            case "pulse":
              return Math.max(0, 1 - beatPhase * 4);
            case "linear":
            default:
              return beatPhase;
          }
        },
        /**
         * Calculate current rhythm phase for breathing animations
         * @param {number} currentTime - Current timestamp in milliseconds
         * @param {number} animationSpeedFactor - Speed multiplier from music analysis (default: 1)
         * @returns {number} Rhythm phase in radians (0 to 2π)
         */
        calculateRhythmPhase(currentTime, animationSpeedFactor = 1) {
          return (
            ((currentTime / 1e3) * animationSpeedFactor * Math.PI) %
            (Math.PI * 2)
          );
        },
        /**
         * Calculate breathing scale based on rhythm phase and energy
         * @param {number} rhythmPhase - Current rhythm phase (0 to 2π)
         * @param {number} processedEnergy - Music energy (0-1) from music analysis
         * @returns {number} Breathing scale factor (0.97-1.02)
         */
        calculateBreathingScale(rhythmPhase, processedEnergy = 0.5) {
          const baseBreathing = 0.99;
          const energyInfluence = 0.01 + processedEnergy * 0.02;
          const breathingIntensity =
            baseBreathing + Math.sin(rhythmPhase) * energyInfluence;
          return Math.max(0.97, Math.min(1.02, breathingIntensity));
        },
        /**
         * Calculate navigation item transform scale based on music analysis
         * @param {number} visualIntensity - Visual intensity from music analysis (0-1)
         * @param {string} moodIdentifier - Mood from music analysis ("energetic_happy", "danceable", etc.)
         * @returns {number} Transform scale factor (1.0-1.03)
         */
        calculateNavigationScale(
          visualIntensity = 0.5,
          moodIdentifier = "neutral"
        ) {
          let navItemTransformScale = 1 + visualIntensity * 0.025;
          if (
            moodIdentifier === "energetic_happy" ||
            moodIdentifier === "danceable"
          ) {
            navItemTransformScale += 5e-3;
          }
          return Math.max(1, Math.min(1.03, navItemTransformScale));
        },
        rgbToOklab(r_srgb, g_srgb, b_srgb) {
          const r = r_srgb / 255;
          const g = g_srgb / 255;
          const b = b_srgb / 255;
          const r_lin =
            r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
          const g_lin =
            g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
          const b_lin =
            b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
          const l_cone =
            0.4122214708 * r_lin + 0.5363325363 * g_lin + 0.0514459929 * b_lin;
          const m_cone =
            0.2119034982 * r_lin + 0.6806995451 * g_lin + 0.1073969566 * b_lin;
          const s_cone =
            0.0883024619 * r_lin + 0.2817188376 * g_lin + 0.6299787005 * b_lin;
          const l_ = Math.cbrt(l_cone);
          const m_ = Math.cbrt(m_cone);
          const s_ = Math.cbrt(s_cone);
          const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
          const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
          const b_oklab =
            0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
          return { L, a, b: b_oklab };
        },
        oklabToRgb(L, a, b_oklab) {
          const l_ = L + 0.3963377774 * a + 0.2158037573 * b_oklab;
          const m_ = L - 0.1055613458 * a - 0.0638541728 * b_oklab;
          const s_ = L - 0.0894841775 * a - 1.291485548 * b_oklab;
          const l_cone = l_ * l_ * l_;
          const m_cone = m_ * m_ * m_;
          const s_cone = s_ * s_ * s_;
          const r_lin =
            3.2409699419 * l_cone -
            1.5373831776 * m_cone -
            0.4986107603 * s_cone;
          const g_lin =
            -0.9692436363 * l_cone +
            1.8759675015 * m_cone +
            0.0415550574 * s_cone;
          const b_lin =
            0.0556300797 * l_cone -
            0.2039769589 * m_cone +
            1.0569715142 * s_cone;
          const r_srgb =
            r_lin <= 31308e-7
              ? 12.92 * r_lin
              : 1.055 * Math.pow(r_lin, 1 / 2.4) - 0.055;
          const g_srgb =
            g_lin <= 31308e-7
              ? 12.92 * g_lin
              : 1.055 * Math.pow(g_lin, 1 / 2.4) - 0.055;
          const b_srgb =
            b_lin <= 31308e-7
              ? 12.92 * b_lin
              : 1.055 * Math.pow(b_lin, 1 / 2.4) - 0.055;
          return {
            r: Math.max(0, Math.min(255, Math.round(r_srgb * 255))),
            g: Math.max(0, Math.min(255, Math.round(g_srgb * 255))),
            b: Math.max(0, Math.min(255, Math.round(b_srgb * 255))),
          };
        },
        // PHASE 2.1 - Implement initial OKLab color processing function.
        processOklabColor(oklabColor, context = {}) {
          let { L, a, b } = oklabColor;
          const {
            musicEnergy,
            moodIdentifier,
            visualIntensity,
            targetContrastRatio,
          } = context;
          const lightnessThresholdMin = 0.1;
          const lightnessThresholdMax = 0.9;
          let chromaScale = 1;
          if (L < lightnessThresholdMin) {
            chromaScale = L / lightnessThresholdMin;
          } else if (L > lightnessThresholdMax) {
            chromaScale = (1 - L) / (1 - lightnessThresholdMax);
          }
          chromaScale = Math.max(0, Math.min(1, Math.pow(chromaScale, 0.75)));
          a *= chromaScale;
          b *= chromaScale;
          if (targetContrastRatio && L > 0.05 && L < 0.95) {
          }
          if (musicEnergy && moodIdentifier && visualIntensity) {
            if (moodIdentifier === "energetic_happy" && visualIntensity > 0.5) {
              const boostFactor = 1 + (visualIntensity - 0.5) * 0.1;
              a *= boostFactor;
              b *= boostFactor;
            } else if (
              (moodIdentifier === "calm_sad" || moodIdentifier === "sad") &&
              visualIntensity < 0.5
            ) {
              const reductionFactor = 1 - (0.5 - visualIntensity) * 0.1;
              a *= reductionFactor;
              b *= reductionFactor;
            }
          }
          L = Math.max(0, Math.min(1, L));
          return { L, a, b };
        },
        // PHASE 4: Utility to calculate derived OKLab properties
        calculateOklabDerivedProperties(oklabColor) {
          if (
            !oklabColor ||
            typeof oklabColor.L !== "number" ||
            typeof oklabColor.a !== "number" ||
            typeof oklabColor.b !== "number"
          ) {
            console.warn(
              "[Year3000Utilities] Invalid oklabColor input for calculateOklabDerivedProperties. Using defaults.",
              oklabColor
            );
            return { L_star: 0.5, a_star: 0, b_star: 0, chroma: 0, hue: 0 };
          }
          const { L, a, b } = oklabColor;
          const chroma = Math.sqrt(a * a + b * b);
          let hue = Math.atan2(b, a) * (180 / Math.PI);
          if (hue < 0) {
            hue += 360;
          }
          return {
            L_star: L,
            // OKLab L is already L*
            a_star: a,
            // OKLab a is a*
            b_star: b,
            // OKLab b is b*
            chroma,
            hue,
          };
        },
        // PHASE 6: Generate Harmonic OKLab Colors
        generateHarmonicOklabColors(
          baseOklabColor,
          rule = "analogous",
          angle = 30
        ) {
          if (
            !baseOklabColor ||
            typeof baseOklabColor.L !== "number" ||
            typeof baseOklabColor.a !== "number" ||
            typeof baseOklabColor.b !== "number"
          ) {
            console.warn(
              "[Year3000Utilities] Invalid baseOklabColor input for generateHarmonicOklabColors. Required: { L, a, b }.",
              baseOklabColor
            );
            return [];
          }
          const { L, a, b } = baseOklabColor;
          const baseChroma = Math.sqrt(a * a + b * b);
          let baseHueDegrees = Math.atan2(b, a) * (180 / Math.PI);
          if (baseHueDegrees < 0) {
            baseHueDegrees += 360;
          }
          const harmonicColorsOklab = [];
          const getOklabFromLCH = (l_val, c_val, h_deg_val) => {
            const h_rad = (h_deg_val % 360) * (Math.PI / 180);
            return {
              L: Math.max(0, Math.min(1, l_val)),
              // Clamp L to 0-1
              a: c_val * Math.cos(h_rad),
              b: c_val * Math.sin(h_rad),
            };
          };
          if (rule === "analogous") {
            const angles = [angle, -angle];
            angles.forEach((hueShift) => {
              harmonicColorsOklab.push(
                getOklabFromLCH(L, baseChroma, baseHueDegrees + hueShift)
              );
            });
          } else if (rule === "monochromatic") {
            const L_darker = Math.max(0.05, L * (L > 0.5 ? 0.6 : 0.4));
            const L_lighter = Math.min(0.95, L * (L < 0.5 ? 1.6 : 1.2) + 0.1);
            harmonicColorsOklab.push(
              getOklabFromLCH(L_darker, baseChroma * 0.85, baseHueDegrees)
            );
            harmonicColorsOklab.push(
              getOklabFromLCH(L_lighter, baseChroma * 0.9, baseHueDegrees)
            );
          } else if (rule === "complementary") {
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + 180)
            );
          } else if (rule === "triadic") {
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + 120)
            );
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + 240)
            );
          } else if (rule === "split-complementary") {
            const splitAngle = 30;
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + 180 - splitAngle)
            );
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + 180 + splitAngle)
            );
          } else if (rule === "tetradic") {
            const stepAngle = angle || 90;
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle)
            );
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle * 2)
            );
            harmonicColorsOklab.push(
              getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle * 3)
            );
          } else {
            console.warn(
              `[Year3000Utilities] Harmony rule "${rule}" not fully implemented. Defaulting to analogous for now based on input angle.`
            );
            const angles = [angle, -angle];
            angles.forEach((hueShift) => {
              harmonicColorsOklab.push(
                getOklabFromLCH(L, baseChroma, baseHueDegrees + hueShift)
              );
            });
          }
          return harmonicColorsOklab;
        },
        pseudoRandom: function (seed) {
          let t = (seed += 1831565813);
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
        // === Phase 6: Global Health Monitor & Debug System Initialization ===
        initializeHealthMonitoring() {
          if (!this.systemHealthMonitor) {
            this.systemHealthMonitor = new SystemHealthMonitor();
          }
          if (!this.unifiedDebug) {
            this.unifiedDebug = new Year3000UnifiedDebug(
              this.systemHealthMonitor
            );
          }
          if (typeof window !== "undefined") {
            window.Year3000SystemHealth = this.systemHealthMonitor;
            window.Year3000Debug = this.unifiedDebug;
            console.log(
              "\u{1F527} Phase 6: System Health Monitoring initialized"
            );
            console.log(
              "\u{1F50D} Available globally: window.Year3000SystemHealth, window.Year3000Debug"
            );
          }
          return {
            healthMonitor: this.systemHealthMonitor,
            debug: this.unifiedDebug,
          };
        },
        getHealthMonitor() {
          if (!this.systemHealthMonitor) {
            return this.initializeHealthMonitoring().healthMonitor;
          }
          return this.systemHealthMonitor;
        },
        getUnifiedDebug() {
          if (!this.unifiedDebug) {
            return this.initializeHealthMonitoring().debug;
          }
          return this.unifiedDebug;
        },
        // === End Phase 6 Global Initialization ===
      };
      SystemHealthMonitor = class {
        constructor() {
          this.systemMetrics = /* @__PURE__ */ new Map();
          this.performanceBudget = {
            maxAnimationComplexity: 100,
            maxMemoryUsage: 50 * 1024 * 1024,
            // 50MB
            maxCPUUsage: 30,
            // 30% threshold
            maxFrameDrops: 5,
            // per second
          };
          this.lastCleanupTime = Date.now();
          this.cleanupInterval = 6e4;
          this.isMonitoringEnabled = true;
        }
        registerSystem(systemName, system) {
          this.systemMetrics.set(systemName, {
            system,
            lastUpdate: Date.now(),
            performanceData: {
              frameCount: 0,
              averageFrameTime: 0,
              memoryUsage: 0,
              errorCount: 0,
              animationComplexity: 0,
            },
            healthStatus: "healthy",
          });
        }
        updateSystemMetrics(systemName, metrics) {
          const systemData = this.systemMetrics.get(systemName);
          if (systemData) {
            systemData.lastUpdate = Date.now();
            Object.assign(systemData.performanceData, metrics);
            systemData.healthStatus = this.calculateHealthStatus(
              systemData.performanceData
            );
          }
        }
        calculateHealthStatus(performanceData) {
          if (performanceData.errorCount > 10) return "critical";
          if (
            performanceData.memoryUsage >
            this.performanceBudget.maxMemoryUsage * 0.8
          )
            return "warning";
          if (
            performanceData.animationComplexity >
            this.performanceBudget.maxAnimationComplexity * 0.9
          )
            return "warning";
          return "healthy";
        }
        shouldThrottleAnimations() {
          let totalComplexity = 0;
          for (const [name, data] of this.systemMetrics) {
            totalComplexity += data.performanceData.animationComplexity || 0;
          }
          return (
            totalComplexity > this.performanceBudget.maxAnimationComplexity
          );
        }
        performAutomaticCleanup() {
          const now = Date.now();
          if (now - this.lastCleanupTime > this.cleanupInterval) {
            for (const [name, data] of this.systemMetrics) {
              if (
                data.system &&
                typeof data.system.performCleanup === "function"
              ) {
                data.system.performCleanup();
              }
            }
            this.lastCleanupTime = now;
            return true;
          }
          return false;
        }
        getAllSystemsReport() {
          const report = {
            timestamp: /* @__PURE__ */ new Date().toISOString(),
            overallHealth: "healthy",
            performanceBudget: this.performanceBudget,
            systems: {},
          };
          let hasWarnings = false;
          let hasCritical = false;
          for (const [name, data] of this.systemMetrics) {
            report.systems[name] = {
              healthStatus: data.healthStatus,
              lastUpdate: new Date(data.lastUpdate).toISOString(),
              timeSinceUpdate: Date.now() - data.lastUpdate,
              performanceData: { ...data.performanceData },
            };
            if (data.healthStatus === "warning") hasWarnings = true;
            if (data.healthStatus === "critical") hasCritical = true;
          }
          report.overallHealth = hasCritical
            ? "critical"
            : hasWarnings
            ? "warning"
            : "healthy";
          return report;
        }
        getOptimizationRecommendations() {
          const recommendations = [];
          if (this.shouldThrottleAnimations()) {
            recommendations.push(
              "Reduce animation complexity - total complexity exceeds budget"
            );
          }
          for (const [name, data] of this.systemMetrics) {
            if (data.performanceData.errorCount > 5) {
              recommendations.push(
                `${name}: High error count (${data.performanceData.errorCount})`
              );
            }
            if (
              data.performanceData.memoryUsage >
              this.performanceBudget.maxMemoryUsage * 0.7
            ) {
              recommendations.push(
                `${name}: High memory usage (${Math.round(
                  data.performanceData.memoryUsage / 1024 / 1024
                )}MB)`
              );
            }
          }
          return recommendations;
        }
      };
      Year3000UnifiedDebug = class {
        constructor(systemHealthMonitor) {
          this.healthMonitor = systemHealthMonitor;
          this.debugHistory = [];
          this.maxHistorySize = 100;
        }
        getAllSystemsReport() {
          const report = this.healthMonitor.getAllSystemsReport();
          const recommendations =
            this.healthMonitor.getOptimizationRecommendations();
          const unifiedReport = {
            timestamp: report.timestamp,
            overallHealth: report.overallHealth,
            systems: report.systems,
            recommendations,
            performance: {
              shouldThrottleAnimations:
                this.healthMonitor.shouldThrottleAnimations(),
              totalSystems: Object.keys(report.systems).length,
              healthySystems: Object.values(report.systems).filter(
                (s) => s.healthStatus === "healthy"
              ).length,
              warningSystems: Object.values(report.systems).filter(
                (s) => s.healthStatus === "warning"
              ).length,
              criticalSystems: Object.values(report.systems).filter(
                (s) => s.healthStatus === "critical"
              ).length,
            },
            integration: this.getIntegrationStatus(),
          };
          this.addToHistory(unifiedReport);
          return unifiedReport;
        }
        getIntegrationStatus() {
          const systems = this.healthMonitor.systemMetrics;
          const integrationStatus = {
            crossSystemCommunication: "healthy",
            dataFlowIntegrity: "healthy",
            memoryEfficiency: "healthy",
            animationSynchronization: "healthy",
          };
          const now = Date.now();
          for (const [name, data] of systems) {
            if (now - data.lastUpdate > 3e4) {
              integrationStatus.crossSystemCommunication = "warning";
            }
          }
          let totalMemory = 0;
          for (const [name, data] of systems) {
            totalMemory += data.performanceData.memoryUsage || 0;
          }
          if (totalMemory > 100 * 1024 * 1024) {
            integrationStatus.memoryEfficiency = "critical";
          } else if (totalMemory > 75 * 1024 * 1024) {
            integrationStatus.memoryEfficiency = "warning";
          }
          return integrationStatus;
        }
        addToHistory(report) {
          this.debugHistory.push({
            timestamp: Date.now(),
            report: JSON.parse(JSON.stringify(report)),
            // Deep clone
          });
          if (this.debugHistory.length > this.maxHistorySize) {
            this.debugHistory.shift();
          }
        }
        getPerformanceTrends() {
          if (this.debugHistory.length < 2) {
            return { error: "Insufficient data for trend analysis" };
          }
          const recent = this.debugHistory.slice(-10);
          const trends = {};
          for (const systemName of Object.keys(recent[0].report.systems)) {
            const systemTrend = {
              healthTrend: "stable",
              memoryTrend: "stable",
              errorTrend: "stable",
            };
            const healthHistory = recent.map(
              (r) => r.report.systems[systemName]?.healthStatus
            );
            if (healthHistory.includes("critical"))
              systemTrend.healthTrend = "degrading";
            else if (healthHistory.includes("warning"))
              systemTrend.healthTrend = "concerning";
            trends[systemName] = systemTrend;
          }
          return trends;
        }
        runIntegrationTest() {
          console.log("\u{1F9EA} Running Year 3000 Integration Test...");
          const results = {
            passed: true,
            tests: {},
            summary: "",
          };
          const registeredSystems = Array.from(
            this.healthMonitor.systemMetrics.keys()
          );
          const expectedSystems = [
            "BeatSyncVisualSystem",
            "DimensionalNexusSystem",
            "DataGlyphSystem",
          ];
          results.tests.systemRegistration = {
            passed: expectedSystems.every((sys) =>
              registeredSystems.includes(sys)
            ),
            expected: expectedSystems,
            actual: registeredSystems,
          };
          const root = document.documentElement;
          const criticalVariables = [
            "--sn-breathing-scale",
            "--sn-rhythm-phase",
            "--sn-nav-item-transform-scale",
            "--sn-sidebar-meditation-desaturation",
          ];
          results.tests.cssVariables = {
            passed: true,
            variables: {},
          };
          for (const variable of criticalVariables) {
            const value = getComputedStyle(root).getPropertyValue(variable);
            results.tests.cssVariables.variables[variable] = value || "NOT_SET";
            if (!value) {
              results.tests.cssVariables.passed = false;
              results.passed = false;
            }
          }
          const systemsReport = this.getAllSystemsReport();
          results.tests.performance = {
            passed: systemsReport.overallHealth !== "critical",
            overallHealth: systemsReport.overallHealth,
            throttlingNeeded:
              systemsReport.performance.shouldThrottleAnimations,
          };
          if (systemsReport.overallHealth === "critical") {
            results.passed = false;
          }
          const passedTests = Object.values(results.tests).filter(
            (t) => t.passed
          ).length;
          const totalTests = Object.keys(results.tests).length;
          results.summary = `${passedTests}/${totalTests} tests passed. Overall: ${
            results.passed ? "PASS" : "FAIL"
          }`;
          console.log("\u{1F9EA} Integration Test Results:", results);
          return results;
        }
      };
    },
  });

  // src-js/systems/ColorHarmonyEngine.js
  var ColorHarmonyEngine_exports = {};
  __export(ColorHarmonyEngine_exports, {
    ColorHarmonyEngine: () => ColorHarmonyEngine,
  });
  var ColorHarmonyEngine;
  var init_ColorHarmonyEngine = __esm({
    "src-js/systems/ColorHarmonyEngine.js"() {
      init_globalConfig();
      init_Year3000Utilities();
      ColorHarmonyEngine = class {
        constructor(
          config,
          utils,
          performanceMonitor,
          musicAnalysisService,
          settingsManager
        ) {
          this.config = config || YEAR3000_CONFIG;
          this.utils = utils || Year3000Utilities;
          this.performanceMonitor = performanceMonitor;
          this.musicAnalysisService = musicAnalysisService;
          this.settingsManager = settingsManager;
          this.systemName = "ColorHarmonyEngine";
          this.currentTheme = this.detectCurrentTheme();
          this.harmonyMetrics = {
            totalHarmonyCalculations: 0,
            musicInfluencedAdjustments: 0,
            temporalMemoryEvents: 0,
          };
          this.musicalMemory = {
            recentTracks: [],
            userColorPreferences: /* @__PURE__ */ new Map(),
            energyHistory: [],
            maxMemorySize: 50,
          };
          this.kineticState = {
            currentPulse: 0,
            breathingPhase: 0,
            lastBeatTime: 0,
            visualMomentum: 0,
          };
          if (this.musicAnalysisService) {
            this.musicAnalysisService.subscribe(this, this.systemName);
            if (this.config.enableDebug) {
              console.log(
                "\u{1F3A8} [ColorHarmonyEngine] Subscribed to music analysis for Aesthetic Gravity"
              );
            }
          }
          if (this.config.enableDebug) {
            console.log(
              "\u{1F3A8} [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy"
            );
          }
          this.catppuccinPalettes = {
            frappe: {
              accents: {
                rosewater: "#f2d5cf",
                flamingo: "#eebebe",
                pink: "#f4b8e4",
                mauve: "#ca9ee6",
                red: "#e78284",
                maroon: "#ea999c",
                peach: "#ef9f76",
                yellow: "#e5c890",
                green: "#a6d189",
                teal: "#81c8be",
                sky: "#99d1db",
                sapphire: "#85c1dc",
                blue: "#8caaee",
                lavender: "#babbf1",
              },
              neutrals: {
                base: "#303446",
                surface0: "#414559",
                surface1: "#51576d",
                surface2: "#626880",
              },
            },
            latte: {
              accents: {
                rosewater: "#dc8a78",
                flamingo: "#dd7878",
                pink: "#ea76cb",
                mauve: "#8839ef",
                red: "#d20f39",
                maroon: "#e64553",
                peach: "#fe640b",
                yellow: "#df8e1d",
                green: "#40a02b",
                teal: "#179299",
                sky: "#04a5e5",
                sapphire: "#209fb5",
                blue: "#1e66f5",
                lavender: "#7287fd",
              },
              neutrals: {
                base: "#eff1f5",
                surface0: "#e6e9ef",
                surface1: "#dce0e8",
                surface2: "#c5c9d1",
              },
            },
            macchiato: {
              accents: {
                rosewater: "#f4dbd6",
                flamingo: "#f0c6c6",
                pink: "#f5bde6",
                mauve: "#c6a0f6",
                red: "#ed8796",
                maroon: "#ee99a0",
                peach: "#f5a97f",
                yellow: "#eed49f",
                green: "#a6da95",
                teal: "#8bd5ca",
                sky: "#91d7e3",
                sapphire: "#7dc4e4",
                blue: "#8aadf4",
                lavender: "#b7bdf8",
              },
              neutrals: {
                base: "#24273a",
                surface0: "#363a4f",
                surface1: "#494d64",
                surface2: "#5b6078",
              },
            },
            mocha: {
              accents: {
                rosewater: "#f5e0dc",
                flamingo: "#f2cdcd",
                pink: "#f5c2e7",
                mauve: "#cba6f7",
                red: "#f38ba8",
                maroon: "#eba0ac",
                peach: "#fab387",
                yellow: "#f9e2af",
                green: "#a6e3a1",
                teal: "#94e2d5",
                sky: "#89dceb",
                sapphire: "#74c7ec",
                blue: "#89b4fa",
                lavender: "#b4befe",
              },
              neutrals: {
                base: "#1e1e2e",
                surface0: "#313244",
                surface1: "#45475a",
                surface2: "#585b70",
              },
            },
          };
          this.vibrancyConfig = {
            defaultBlendRatio: 0.95,
            // BOLD! 95% extracted color dominance (was 0.85)
            minimumSaturation: 0.6,
            // DEMAND VIBRANCY! Up from pathetic 0.4
            maximumDesaturation: 0.05,
            // PREVENT COLOR DEATH! Down from 0.15
            contrastBoostIntensity: 2.2,
            // STRONGER CONTRAST! Up from 1.8
            harmonyTolerance: 0.35,
            // ARTISTIC FREEDOM! Down from restrictive 0.55
            // 🎨 NEW: Artistic Enhancement Factors
            artisticSaturationBoost: 1.2,
            // 20% saturation enhancement for extracted colors
            cosmicLuminanceBoost: 1.15,
            // 15% luminance boost for cosmic presence
            energyResponsiveness: 0.8,
            // How much music energy affects color intensity
            // 🌟 Dynamic Blending Based on Artistic Mode
            getBlendRatio(artisticMode = "artist-vision") {
              const ratios = {
                "corporate-safe": 0.75,
                // Conservative: 75% extracted
                "artist-vision": 0.95,
                // Bold: 95% extracted
                "cosmic-maximum": 0.98,
                // Maximum: 98% extracted!
              };
              return ratios[artisticMode] || this.defaultBlendRatio;
            },
            // Note: getMusicIntensityMultiplier moved to class method for proper context access
          };
        }
        detectCurrentTheme() {
          const rootElement = this.utils.getRootStyle();
          if (!rootElement) {
            console.warn(
              "[ColorHarmonyEngine detectCurrentTheme] Root element not found. Defaulting to mocha."
            );
            return "mocha";
          }
          const computedRootStyle = getComputedStyle(rootElement);
          const baseColorHex = computedRootStyle
            .getPropertyValue("--spice-main")
            .trim();
          const normalizedBaseColor = baseColorHex.startsWith("#")
            ? baseColorHex.substring(1).toUpperCase()
            : baseColorHex.toUpperCase();
          const themeMap = {
            303446: "frappe",
            // Mocha's base is 1E1E2E, Frappe's is 303446
            EFF1F5: "latte",
            "24273A": "macchiato",
            "1E1E2E": "mocha",
          };
          return themeMap[normalizedBaseColor] || "mocha";
        }
        // 🎵 Music-Driven Intensity Scaling
        getMusicIntensityMultiplier(energy = 0.5, valence = 0.5) {
          const baseMultiplier =
            this.config.getCurrentMultipliers().musicEnergyBoost;
          const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1 : 0.8;
          const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1;
          return baseMultiplier * energyBoost * valenceBoost;
        }
        validateColorHarmony(color, context = "general") {
          const startTime = performance.now();
          this.harmonyMetrics.totalHarmonyCalculations++;
          const contextRequirements = {
            general: {
              minContrast: 1.8,
              minHarmony: this.vibrancyConfig.harmonyTolerance,
            },
            search: {
              minContrast: 2.8,
              minHarmony: 0.4,
            },
            navigation: {
              minContrast: 2.5,
              minHarmony: 0.45,
            },
            text: {
              minContrast: 4.5,
              minHarmony: 0.6,
            },
            accent: {
              minContrast: 1.5,
              minHarmony: 0.3,
            },
          };
          const requirements =
            contextRequirements[context] || contextRequirements.general;
          const currentPalette = this.catppuccinPalettes[this.currentTheme];
          if (
            !currentPalette ||
            !currentPalette.neutrals ||
            !currentPalette.neutrals.base
          ) {
            console.error(
              "StarryNight Error: Catppuccin palette or base neutral not found for theme:",
              this.currentTheme,
              currentPalette
            );
            return { valid: false, error: "Palette configuration error." };
          }
          const backgroundColor = currentPalette.neutrals.base;
          const contrastRatio = Year3000Utilities.calculateContrastRatio(
            color,
            backgroundColor
          );
          const harmonyScore = this.calculateHarmonyScore(
            color,
            currentPalette
          );
          const currentMode = this.config.artisticMode;
          let adjustedRequirements = { ...requirements };
          if (currentMode === "cosmic-maximum") {
            adjustedRequirements.minContrast *= 0.7;
            adjustedRequirements.minHarmony *= 0.6;
          } else if (currentMode === "artist-vision") {
            adjustedRequirements.minContrast *= 0.85;
            adjustedRequirements.minHarmony *= 0.8;
          }
          const meetsContrast =
            contrastRatio >= adjustedRequirements.minContrast;
          const isHarmonious = harmonyScore >= adjustedRequirements.minHarmony;
          const endTime = performance.now();
          this.harmonyMetrics.performance.push(endTime - startTime);
          return {
            valid: meetsContrast && isHarmonious,
            contrastRatio,
            harmonyScore,
            meetsContrast,
            isHarmonious,
            artisticMode: currentMode,
            adjustedRequirements,
            recommendations: this.generateRecommendations(
              color,
              contrastRatio,
              harmonyScore,
              adjustedRequirements
            ),
          };
        }
        calculateHarmonyScore(color, palette) {
          const colorRgb = Year3000Utilities.hexToRgb(color);
          if (!colorRgb) return 0;
          const colorHsl = Year3000Utilities.rgbToHsl(
            colorRgb.r,
            colorRgb.g,
            colorRgb.b
          );
          let maxHarmony = 0;
          Object.values(palette.accents).forEach((accentColor) => {
            const accentRgb = Year3000Utilities.hexToRgb(accentColor);
            if (!accentRgb) return;
            const accentHsl = Year3000Utilities.rgbToHsl(
              accentRgb.r,
              accentRgb.g,
              accentRgb.b
            );
            const hueDiff = Math.abs(colorHsl.h - accentHsl.h);
            const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
            const harmoniousAngles = [
              0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
            ];
            const isHarmonious = harmoniousAngles.some(
              (angle) => Math.abs(normalizedHueDiff - angle) < 20
            );
            if (isHarmonious) {
              const harmonyStrength =
                1 -
                Math.min(
                  ...harmoniousAngles.map((angle) =>
                    Math.abs(normalizedHueDiff - angle)
                  )
                ) /
                  20;
              maxHarmony = Math.max(maxHarmony, harmonyStrength);
            }
          });
          return maxHarmony;
        }
        findBestHarmoniousAccent(rgb, palette) {
          const hsl = Year3000Utilities.rgbToHsl(rgb.r, rgb.g, rgb.b);
          const accentPriority = [
            "mauve",
            "lavender",
            "blue",
            "sapphire",
            "sky",
            "pink",
            "peach",
            "teal",
          ];
          let bestAccent = null;
          let bestScore = 0;
          accentPriority.forEach((accentName) => {
            if (palette.accents[accentName]) {
              const accentRgb = Year3000Utilities.hexToRgb(
                palette.accents[accentName]
              );
              if (!accentRgb) return;
              const accentHsl = Year3000Utilities.rgbToHsl(
                accentRgb.r,
                accentRgb.g,
                accentRgb.b
              );
              const hueDiff = Math.abs(hsl.h - accentHsl.h);
              const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
              const harmonyScore = 1 - normalizedHueDiff / 180;
              const saturationBonus = (accentHsl.s / 100) * 0.3;
              const totalScore = harmonyScore + saturationBonus;
              if (totalScore > bestScore) {
                bestScore = totalScore;
                bestAccent = {
                  name: accentName,
                  hex: palette.accents[accentName],
                  rgb: accentRgb,
                };
              }
            }
          });
          const fallbackAccentName = "mauve";
          const fallbackAccentHex =
            palette.accents[fallbackAccentName] ||
            Object.values(palette.accents)[0];
          const fallbackAccentRgb =
            Year3000Utilities.hexToRgb(fallbackAccentHex);
          return (
            bestAccent || {
              name: fallbackAccentName,
              hex: fallbackAccentHex,
              rgb: fallbackAccentRgb,
            }
          );
        }
        blendColors(rgb1, rgb2, ratio = this.vibrancyConfig.defaultBlendRatio) {
          const hsl1 = Year3000Utilities.rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
          const hsl2 = Year3000Utilities.rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
          const artisticMode = this.config.artisticMode;
          const dynamicRatio = this.vibrancyConfig.getBlendRatio(artisticMode);
          const blendedHsl = {
            h: hsl1.h * dynamicRatio + hsl2.h * (1 - dynamicRatio),
            s: Math.max(
              hsl1.s * dynamicRatio + hsl2.s * (1 - dynamicRatio),
              this.vibrancyConfig.minimumSaturation * 100
            ),
            l: hsl1.l * dynamicRatio + hsl2.l * (1 - dynamicRatio),
          };
          blendedHsl.s = Math.min(
            100,
            blendedHsl.s * this.vibrancyConfig.artisticSaturationBoost
          );
          if (artisticMode !== "corporate-safe") {
            blendedHsl.l = Math.min(
              95,
              // Capping luminance to prevent pure white
              blendedHsl.l * this.vibrancyConfig.cosmicLuminanceBoost
            );
          }
          if (this.config.enableCosmicSync && globalThis.currentMusicAnalysis) {
            const musicBoost = this.getMusicIntensityMultiplier(
              globalThis.currentMusicAnalysis.energy || 0.5,
              globalThis.currentMusicAnalysis.valence || 0.5
            );
            blendedHsl.s = Math.min(
              100,
              blendedHsl.s * (1 + (musicBoost - 1) * 0.3)
            );
          }
          const blendedRgb = Year3000Utilities.hslToRgb(
            blendedHsl.h,
            blendedHsl.s,
            blendedHsl.l
          );
          return Year3000Utilities.rgbToHex(
            blendedRgb.r,
            blendedRgb.g,
            blendedRgb.b
          );
        }
        blendWithCatppuccin(extractedColors, musicContext = null) {
          const startTime = performance.now();
          this.harmonyMetrics.blends++;
          const currentPalette = this.catppuccinPalettes[this.currentTheme];
          if (!currentPalette) {
            console.error(
              "StarryNight Error: Catppuccin palette not found for theme:",
              this.currentTheme
            );
            return extractedColors;
          }
          const harmonizedColors = {};
          Object.entries(extractedColors).forEach(([role, color]) => {
            if (!color) return;
            const extractedRgb = Year3000Utilities.hexToRgb(color);
            if (!extractedRgb) {
              harmonizedColors[role] = color;
              return;
            }
            const bestAccent = this.findBestHarmoniousAccent(
              extractedRgb,
              currentPalette
            );
            if (!bestAccent || !bestAccent.rgb) {
              console.warn(
                "StarryNight Warning: Could not find a best harmonious accent or its RGB value. Defaulting to extracted color for role:",
                role
              );
              harmonizedColors[role] = color;
              return;
            }
            let blendRatio = this.vibrancyConfig.defaultBlendRatio;
            if (musicContext) {
              if (musicContext.energy > 0.7) blendRatio = 0.9;
              if (musicContext.valence > 0.6) blendRatio += 0.05;
              blendRatio = Math.min(1, Math.max(0, blendRatio));
            }
            harmonizedColors[role] = this.blendColors(
              extractedRgb,
              bestAccent.rgb,
              // Ensure bestAccent.rgb is valid
              blendRatio
            );
          });
          const endTime = performance.now();
          this.harmonyMetrics.performance.push(endTime - startTime);
          return harmonizedColors;
        }
        generateRecommendations(
          color,
          contrastRatio,
          harmonyScore,
          requirements
        ) {
          const recommendations = [];
          if (contrastRatio < requirements.minContrast) {
            recommendations.push(
              "Increase contrast - consider blending with brighter Catppuccin accent"
            );
          }
          if (harmonyScore < requirements.minHarmony) {
            recommendations.push(
              "Improve harmony - blend with complementary Catppuccin colors"
            );
          }
          return recommendations;
        }
        getPerformanceReport() {
          const avgTime =
            this.harmonyMetrics.performance.length > 0
              ? this.harmonyMetrics.performance.reduce((a, b) => a + b, 0) /
                this.harmonyMetrics.performance.length
              : 0;
          return {
            totalHarmonyCalculations:
              this.harmonyMetrics.totalHarmonyCalculations,
            musicInfluencedAdjustments:
              this.harmonyMetrics.musicInfluencedAdjustments,
            temporalMemoryEvents: this.harmonyMetrics.temporalMemoryEvents,
            blends: this.harmonyMetrics.blends,
            averageProcessingTime: Math.round(avgTime * 100) / 100,
            // vibrancyConfig: this.vibrancyConfig, // Consider if this much detail is needed in report
          };
        }
        // 🌟 Year 3000 Method: Receive live music updates
        updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
          if (!processedMusicData) return;
          try {
            this._updateMusicalMemory(processedMusicData, trackUri);
            this._updateKineticState(processedMusicData);
            this._applyAestheticGravity(processedMusicData);
            this.harmonyMetrics.musicInfluencedAdjustments++;
            if (this.config.enableDebug && Math.random() < 0.1) {
              console.log(
                "\u{1F3A8} [ColorHarmonyEngine] Cosmic harmony update:",
                {
                  energy: processedMusicData.energy?.toFixed(2),
                  valence: processedMusicData.valence?.toFixed(2),
                  pulse: this.kineticState.currentPulse.toFixed(2),
                  momentum: this.kineticState.visualMomentum.toFixed(2),
                }
              );
            }
          } catch (error) {
            console.error(
              "\u{1F30C} [ColorHarmonyEngine] Error in cosmic harmony update:",
              error
            );
          }
        }
        // 🧠 Quantum Empathy: Learn from musical patterns
        _updateMusicalMemory(musicData, trackUri) {
          this.musicalMemory.recentTracks.unshift({
            uri: trackUri,
            energy: musicData.energy,
            valence: musicData.valence,
            enhancedBPM: musicData.enhancedBPM,
            timestamp: Date.now(),
          });
          if (
            this.musicalMemory.recentTracks.length >
            this.musicalMemory.maxMemorySize
          ) {
            this.musicalMemory.recentTracks.pop();
          }
          this.musicalMemory.energyHistory.unshift(musicData.energy || 0.5);
          if (this.musicalMemory.energyHistory.length > 10) {
            this.musicalMemory.energyHistory.pop();
          }
          this.harmonyMetrics.temporalMemoryEvents++;
        }
        // 🌊 Kinetic Verbs: Update visual motion state
        _updateKineticState(musicData) {
          const now = Date.now();
          const energy = musicData.energy || 0.5;
          const enhancedBPM = musicData.enhancedBPM || 120;
          const beatInterval = 6e4 / enhancedBPM;
          const timeSinceLastBeat =
            (now - this.kineticState.lastBeatTime) % beatInterval;
          this.kineticState.currentPulse = Math.sin(
            (timeSinceLastBeat / beatInterval) * Math.PI * 2
          );
          this.kineticState.breathingPhase += 0.02 * energy;
          if (this.kineticState.breathingPhase > Math.PI * 2) {
            this.kineticState.breathingPhase -= Math.PI * 2;
          }
          if (this.musicalMemory.energyHistory.length > 1) {
            const energyDelta =
              this.musicalMemory.energyHistory[0] -
              this.musicalMemory.energyHistory[1];
            this.kineticState.visualMomentum = Math.max(
              0,
              Math.min(
                1,
                this.kineticState.visualMomentum * 0.9 + energyDelta * 0.5
              )
            );
          }
          if (timeSinceLastBeat < 100) {
            this.kineticState.lastBeatTime = now;
          }
        }
        // 🎨 Aesthetic Gravity: Apply real-time color transformations
        _applyAestheticGravity(musicData) {
          if (typeof document === "undefined") return;
          const root = document.documentElement;
          const energy = musicData.energy || 0.5;
          const valence = musicData.valence || 0.5;
          const breathingIntensity =
            0.5 + Math.sin(this.kineticState.breathingPhase) * 0.3 * energy;
          const currentOpacity = parseFloat(
            getComputedStyle(root).getPropertyValue("--sn-gradient-opacity") ||
              "0.3"
          );
          const targetOpacity = currentOpacity * breathingIntensity;
          root.style.setProperty(
            "--sn-kinetic-opacity",
            targetOpacity.toFixed(3)
          );
          const pulseIntensity =
            1 + this.kineticState.currentPulse * 0.2 * energy;
          const currentSaturation = parseFloat(
            getComputedStyle(root).getPropertyValue(
              "--sn-gradient-saturation"
            ) || "1.0"
          );
          const targetSaturation = currentSaturation * pulseIntensity;
          root.style.setProperty(
            "--sn-kinetic-saturation",
            targetSaturation.toFixed(3)
          );
          const momentumBlur = 30 + this.kineticState.visualMomentum * 20;
          root.style.setProperty(
            "--sn-kinetic-blur",
            `${momentumBlur.toFixed(1)}px`
          );
          const hueShift = (valence - 0.5) * 20;
          root.style.setProperty(
            "--sn-kinetic-hue-shift",
            `${hueShift.toFixed(1)}deg`
          );
        }
        // 🧬 Quantum Empathy: Get current musical empathy metrics
        getQuantumEmpathyMetrics() {
          return {
            musicalMemorySize: this.musicalMemory.recentTracks.length,
            averageEnergy:
              this.musicalMemory.energyHistory.reduce((a, b) => a + b, 0) /
                this.musicalMemory.energyHistory.length || 0.5,
            visualMomentum: this.kineticState.visualMomentum,
            harmonicResonance: this.kineticState.currentPulse,
            temporalDepth: this.harmonyMetrics.temporalMemoryEvents,
          };
        }
      };
    },
  });

  // src-js/systems/BaseVisualSystem.js
  var BaseVisualSystem;
  var init_BaseVisualSystem = __esm({
    "src-js/systems/BaseVisualSystem.js"() {
      init_globalConfig();
      init_Year3000Utilities();
      BaseVisualSystem = class {
        constructor(
          config = {},
          utils,
          performanceMonitor,
          musicSyncService,
          settingsManager
        ) {
          this.config = config || YEAR3000_CONFIG;
          this.utils = utils || Year3000Utilities;
          this.performanceMonitor = performanceMonitor;
          this.musicSyncService = musicSyncService;
          this.settingsManager = settingsManager;
          this.systemName = this.constructor.name;
          this.initialized = false;
          this.performanceTimers = /* @__PURE__ */ new Map();
          this.metrics = {
            initializationTime: 0,
            updates: 0,
            errors: 0,
          };
          this._resizeHandler = null;
          this.currentPerformanceProfile = {};
          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Constructor`);
          }
          this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
        }
        async initialize() {
          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Initializing...`);
            this._startPerformanceTimer("initialize");
          }
          if (this.settingsManager) {
            document.addEventListener(
              "year3000SystemSettingsChanged",
              this.boundHandleSettingsChange
            );
            const initialQuality = this.settingsManager.get(
              "sn-performanceQuality"
            );
            if (initialQuality) {
              this._applyPerformanceProfile(initialQuality);
            }
          } else {
            console.warn(
              `[${this.systemName}] SettingsManager not provided or invalid. Performance profile will not be reactive.`
            );
          }
          await this._performSystemSpecificInitialization();
          this.initialized = true;
          if (this.musicSyncService) {
            if (this._validateDependenciesForSubscription()) {
              this.musicSyncService.subscribe(this, this.systemName);
              if (this.config.enableDebug) {
                console.log(
                  `[${this.systemName}] Successfully subscribed to MusicSyncService after initialization`
                );
              }
            } else {
              console.warn(
                `[${this.systemName}] Failed dependency validation - music sync subscription skipped`
              );
            }
          } else {
            if (this.config.enableDebug) {
              console.log(
                `[${this.systemName}] No MusicSyncService provided - skipping music sync subscription`
              );
            }
          }
          if (this.config.enableDebug) {
            this._endPerformanceTimer("initialize");
            const initTime = this.performanceTimers.get("initialize");
            console.log(`[${this.systemName}] Initialized in ${initTime}ms.`);
          }
        }
        // ✅ FIX #7: Virtual method for system-specific initialization (can be overridden)
        async _performSystemSpecificInitialization() {
          if (this.config.enableDebug) {
            console.log(
              `[${this.systemName}] Performing system-specific initialization (base implementation)`
            );
          }
        }
        // ✅ FIX #7: Validate that all required dependencies are available and ready
        _validateDependenciesForSubscription() {
          if (typeof this.updateFromMusicAnalysis !== "function") {
            console.error(
              `[${this.systemName}] Missing updateFromMusicAnalysis method - cannot subscribe to music analysis`
            );
            return false;
          }
          if (!this.initialized) {
            console.warn(
              `[${this.systemName}] System not initialized - subscription may cause race conditions`
            );
            return false;
          }
          if (!this.config) {
            console.warn(
              `[${this.systemName}] Missing configuration - subscription may fail`
            );
            return false;
          }
          return this._performAdditionalDependencyValidation();
        }
        // ✅ FIX #7: Virtual method for additional dependency validation (can be overridden)
        _performAdditionalDependencyValidation() {
          return true;
        }
        handleSettingsChange(event) {
          if (event.detail.key === "sn-performanceQuality") {
            if (this.config.enableDebug) {
              console.log(
                `[BaseVisualSystem (${this.systemName})] Performance quality setting changed to: ${event.detail.value}`
              );
            }
            this._applyPerformanceProfile(event.detail.value);
          }
        }
        _applyPerformanceProfile(quality) {
          if (!this.config || !this.config.performanceProfiles) {
            console.warn(
              `[${this.systemName}] Performance profiles not found in config.`
            );
            return;
          }
          const profile =
            this.config.performanceProfiles[quality] ||
            this.config.performanceProfiles.balanced;
          if (profile) {
            this.currentPerformanceProfile = profile;
            if (this.config.enableDebug) {
              console.log(
                `[BaseVisualSystem (${this.systemName})] Applied performance profile '${quality}':`,
                profile
              );
            }
          } else {
            console.warn(
              `[${this.systemName}] Performance profile '${quality}' not found. Using current or default.`
            );
          }
        }
        updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
          if (!this.initialized) return;
          this._startPerformanceTimer("update");
          this.metrics.updates++;
          if (processedMusicData) {
            this._applyCosmicBreathing(processedMusicData);
            this._updateGlobalKinetics(processedMusicData);
            if (this.config.enableDebug && Math.random() < 5e-3) {
              console.log(
                `\u{1F30A} [BaseVisualSystem (${
                  this.systemName
                })] Kinetic update - Energy: ${processedMusicData.energy?.toFixed(
                  2
                )}, BPM: ${processedMusicData.enhancedBPM}`
              );
            }
          }
          this._endPerformanceTimer("update");
        }
        // 🌊 Year 3000 Method: Apply cosmic breathing to visual elements
        _applyCosmicBreathing(musicData) {
          if (typeof document === "undefined") return;
          const energy = musicData.energy || 0.5;
          const enhancedBPM = musicData.enhancedBPM || 120;
          const breathingSpeed = (enhancedBPM / 120) * 0.02;
          const breathingPhase = (Date.now() * breathingSpeed) % (Math.PI * 2);
          const breathingIntensity =
            0.8 + Math.sin(breathingPhase) * 0.2 * energy;
          const canvas = document.getElementById(`${this.systemName}-canvas`);
          if (canvas) {
            canvas.style.opacity =
              (parseFloat(canvas.style.opacity) || 0.5) * breathingIntensity;
          }
        }
        // 🌟 Year 3000 Method: Update global kinetic CSS variables
        _updateGlobalKinetics(musicData) {
          if (typeof document === "undefined") return;
          const root = document.documentElement;
          const energy = musicData.energy || 0.5;
          const valence = musicData.valence || 0.5;
          const enhancedBPM = musicData.enhancedBPM || 120;
          root.style.setProperty("--sn-kinetic-energy", energy.toFixed(3));
          root.style.setProperty("--sn-kinetic-valence", valence.toFixed(3));
          root.style.setProperty("--sn-kinetic-bpm", enhancedBPM.toString());
          root.style.setProperty(
            "--sn-kinetic-tempo-multiplier",
            (enhancedBPM / 120).toFixed(3)
          );
          const beatInterval = 6e4 / enhancedBPM;
          const timeSinceLastBeat = Date.now() % beatInterval;
          const beatPhase = (timeSinceLastBeat / beatInterval) * Math.PI * 2;
          const beatPulse = Math.sin(beatPhase);
          root.style.setProperty(
            "--sn-kinetic-beat-phase",
            beatPhase.toFixed(3)
          );
          root.style.setProperty(
            "--sn-kinetic-beat-pulse",
            beatPulse.toFixed(3)
          );
        }
        // 🎨 Year 3000 Utility: Create kinetic canvas with cosmic properties
        _createKineticCanvas(
          id,
          zIndex = 5,
          blendMode = "screen",
          kineticMode = "pulse"
        ) {
          const canvas = this._createCanvasElement(id, zIndex, blendMode);
          canvas.classList.add("year3000-kinetic-canvas");
          canvas.dataset.kineticMode = kineticMode;
          canvas.dataset.systemName = this.systemName;
          const kineticStyles = this._getKineticStyles(kineticMode);
          Object.assign(canvas.style, kineticStyles);
          if (this.config.enableDebug) {
            console.log(
              `\u{1F30A} [BaseVisualSystem (${this.systemName})] Created kinetic canvas with mode: ${kineticMode}`
            );
          }
          return canvas;
        }
        // 🌈 Year 3000 Utility: Get kinetic CSS styles based on mode
        _getKineticStyles(kineticMode) {
          const baseStyles = {
            transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          };
          switch (kineticMode) {
            case "pulse":
              return {
                ...baseStyles,
                animation:
                  "year3000-pulse calc(var(--sn-kinetic-tempo-multiplier, 1) * 1s) ease-in-out infinite",
              };
            case "breathe":
              return {
                ...baseStyles,
                animation:
                  "year3000-breathe calc(var(--sn-kinetic-tempo-multiplier, 1) * 4s) ease-in-out infinite",
              };
            case "flow":
              return {
                ...baseStyles,
                animation:
                  "year3000-flow calc(var(--sn-kinetic-tempo-multiplier, 1) * 8s) linear infinite",
              };
            default:
              return baseStyles;
          }
        }
        // 🧬 Year 3000 Utility: Get current cosmic state for subclasses
        getCosmicState() {
          if (typeof document === "undefined") return {};
          const root = document.documentElement;
          const style = getComputedStyle(root);
          return {
            energy:
              parseFloat(style.getPropertyValue("--sn-kinetic-energy")) || 0.5,
            valence:
              parseFloat(style.getPropertyValue("--sn-kinetic-valence")) || 0.5,
            bpm: parseFloat(style.getPropertyValue("--sn-kinetic-bpm")) || 120,
            tempoMultiplier:
              parseFloat(
                style.getPropertyValue("--sn-kinetic-tempo-multiplier")
              ) || 1,
            beatPhase:
              parseFloat(style.getPropertyValue("--sn-kinetic-beat-phase")) ||
              0,
            beatPulse:
              parseFloat(style.getPropertyValue("--sn-kinetic-beat-pulse")) ||
              0,
          };
        }
        destroy() {
          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Destroying...`);
          }
          try {
            this.initialized = false;
            if (this.musicSyncService) {
              this.musicSyncService.unsubscribe(this.systemName);
              if (this.config.enableDebug) {
                console.log(
                  `[${this.systemName}] Unsubscribed from MusicSyncService`
                );
              }
            }
            if (this.settingsManager && this.boundHandleSettingsChange) {
              document.removeEventListener(
                "year3000SystemSettingsChanged",
                this.boundHandleSettingsChange
              );
              if (this.config.enableDebug) {
                console.log(
                  `[${this.systemName}] Removed settings event listener`
                );
              }
            }
            if (this._resizeHandler) {
              window.removeEventListener("resize", this._resizeHandler);
              this._resizeHandler = null;
              if (this.config.enableDebug) {
                console.log(
                  `[${this.systemName}] Removed resize event listener`
                );
              }
            }
            this._performSystemSpecificCleanup();
            if (this.config.enableDebug) {
              console.log(
                `[${this.systemName}] Destruction completed successfully`
              );
            }
          } catch (error) {
            console.error(
              `[${this.systemName}] Error during destruction:`,
              error
            );
          }
        }
        // ✅ FIX #7: Virtual method for system-specific cleanup (can be overridden)
        _performSystemSpecificCleanup() {
          if (this.config.enableDebug) {
            console.log(
              `[${this.systemName}] Performing system-specific cleanup (base implementation)`
            );
          }
        }
        _startPerformanceTimer(timerName) {
          if (performance && typeof performance.now === "function") {
            this.performanceTimers.set(timerName, performance.now());
          }
        }
        _endPerformanceTimer(timerName) {
          if (performance && typeof performance.now === "function") {
            const startTime = this.performanceTimers.get(timerName);
            if (startTime) {
              const duration = performance.now() - startTime;
              this.performanceTimers.set(`${timerName}_duration`, duration);
              return duration;
            }
          }
          return 0;
        }
        _createCanvasElement(
          id,
          zIndex = 5,
          blendMode = "screen",
          customCssText = ""
        ) {
          const existing = document.getElementById(id);
          if (existing) existing.remove();
          const canvas = document.createElement("canvas");
          canvas.id = id;
          let baseOpacity = 0.5;
          if (this.config && typeof this.config.opacity === "number") {
            baseOpacity = this.config.opacity;
          } else if (
            YEAR3000_CONFIG &&
            typeof YEAR3000_CONFIG.getCurrentMultipliers === "function"
          ) {
            const multipliers = YEAR3000_CONFIG.getCurrentMultipliers();
            if (multipliers && typeof multipliers.opacity === "number") {
              baseOpacity = multipliers.opacity * 0.5;
            }
          }
          let css = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: ${zIndex}; mix-blend-mode: ${blendMode};
      opacity: ${baseOpacity};
    `;
          if (customCssText) {
            css += customCssText;
          }
          canvas.style.cssText = css;
          document.body.appendChild(canvas);
          this._resizeHandler = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (typeof this.handleResize === "function") {
              this.handleResize();
            }
          };
          window.addEventListener("resize", this._resizeHandler);
          this._resizeHandler();
          return canvas;
        }
        _requestAnimationFrame(callback) {
          return requestAnimationFrame(callback);
        }
        _cancelAnimationFrame(frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    },
  });

  // src-js/systems/visual/SidebarConsciousnessSystem.js
  var SidebarConsciousnessSystem_exports = {};
  __export(SidebarConsciousnessSystem_exports, {
    SidebarConsciousnessSystem: () => SidebarConsciousnessSystem,
  });
  var SidebarConsciousnessSystem;
  var init_SidebarConsciousnessSystem = __esm({
    "src-js/systems/visual/SidebarConsciousnessSystem.js"() {
      init_globalConfig();
      init_Year3000Utilities();
      init_BaseVisualSystem();
      SidebarConsciousnessSystem = class extends BaseVisualSystem {
        constructor(
          config,
          utils,
          performanceMonitor,
          musicSyncService,
          settingsManager,
          year3000System = null
        ) {
          super(
            config,
            utils,
            performanceMonitor,
            musicSyncService,
            settingsManager,
            year3000System
          );
          this.year3000System = year3000System;
          this.masterAnimationRegistered = false;
          this.isUsingMasterAnimation = false;
          this.rootNavBar = null;
          this.consciousnessVisualizer = null;
          this.harmonicModeIndicator = null;
          this.consciousnessAnimationFrame = null;
          this.currentHarmonicModeClass = "";
          this.currentEnergyClass = "";
          this.currentHarmonicModeKey = "artist-vision";
          this.nexusVariables = {};
          this.performanceMetrics = {
            animationFrames: 0,
            maxFrameTime: 0,
            averageFrameTime: 0,
            frameTimeHistory: [],
            cssVariableUpdates: 0,
            elementUpdates: 0,
          };
          this.deviceCapabilities = {
            supportsCSSFilter: this._detectCSSFilterSupport(),
            supportsTransforms: this._detectTransformSupport(),
            performanceLevel: this._detectPerformanceLevel(),
            reducedMotion: this._detectReducedMotion(),
          };
          this.animationState = {
            lastPulse: 0,
            pulseDirection: 1,
            baseOpacity: 0.7,
            currentScale: 1,
            targetScale: 1,
            smoothingFactor: 0.15,
          };
          if (this.config?.enableDebug) {
            console.log(
              `[${this.systemName} Constructor] Initialized with device capabilities:`,
              this.deviceCapabilities
            );
          }
        }
        // === PHASE 3: DEVICE CAPABILITY DETECTION METHODS ===
        _detectCSSFilterSupport() {
          const testElement = document.createElement("div");
          testElement.style.filter = "blur(1px)";
          return testElement.style.filter === "blur(1px)";
        }
        _detectTransformSupport() {
          const testElement = document.createElement("div");
          testElement.style.transform = "scale(1.1)";
          return testElement.style.transform === "scale(1.1)";
        }
        _detectPerformanceLevel() {
          const memory = navigator.deviceMemory || 4;
          const cores = navigator.hardwareConcurrency || 2;
          if (memory >= 8 && cores >= 8) return "high";
          if (memory >= 4 && cores >= 4) return "medium";
          return "low";
        }
        _detectReducedMotion() {
          return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        async initialize() {
          await super.initialize();
          this.rootNavBar = document.querySelector(".Root__nav-bar");
          if (!this.rootNavBar) {
            console.warn(
              "[SidebarConsciousnessSystem] Required DOM element .Root__nav-bar not found. System will not function properly."
            );
            this.initialized = false;
            return;
          }
          if (this.config.enableDebug) {
            console.log(
              `[${this.systemName}] Sidebar consciousness system initializing...`
            );
          }
          this._createConsciousnessVisualizer();
          this.createHarmonicModeDisplay();
          this.updateColors();
          this._tryRegisterWithMasterAnimation();
          if (this.config.enableDebug) {
            console.log(
              `[${
                this.systemName
              }] Sidebar consciousness system initialized. Using ${
                this.isUsingMasterAnimation
                  ? "Master Animation Coordinator"
                  : "fallback animation loop"
              }.`
            );
          }
        }
        // === PHASE 3: MASTER ANIMATION COORDINATOR METHODS ===
        _tryRegisterWithMasterAnimation() {
          if (
            this.year3000System &&
            this.year3000System.registerAnimationSystem
          ) {
            try {
              this.year3000System.registerAnimationSystem(
                "SidebarConsciousnessSystem",
                this,
                "background",
                // Background priority - less critical than visual effects
                this.deviceCapabilities.performanceLevel === "high"
                  ? 30
                  : this.deviceCapabilities.performanceLevel === "medium"
                  ? 20
                  : 15
                // Lower FPS for consciousness effects
              );
              this.masterAnimationRegistered = true;
              this.isUsingMasterAnimation = true;
              if (this.config?.enableDebug) {
                console.log(
                  `\u{1F3AC} [${
                    this.systemName
                  }] Registered with Master Animation Coordinator at ${
                    this.deviceCapabilities.performanceLevel === "high"
                      ? 30
                      : this.deviceCapabilities.performanceLevel === "medium"
                      ? 20
                      : 15
                  }fps`
                );
              }
            } catch (error) {
              console.warn(
                `[${this.systemName}] Failed to register with Master Animation Coordinator:`,
                error
              );
              this._startFallbackConsciousnessLoop();
            }
          } else {
            console.warn(
              `[${this.systemName}] Master Animation Coordinator not available, using fallback`
            );
            this._startFallbackConsciousnessLoop();
          }
        }
        _startFallbackConsciousnessLoop() {
          this.isUsingMasterAnimation = false;
          this.startConsciousnessLoop();
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F504} [${this.systemName}] Started fallback consciousness loop`
            );
          }
        }
        /**
         * PHASE 3: Main animation update method called by Master Animation Coordinator or fallback loop
         * @param {number} timestamp - Current timestamp
         * @param {number} deltaTime - Time since last frame
         */
        updateAnimation(timestamp, deltaTime) {
          const frameStartTime = performance.now();
          try {
            if (this.deviceCapabilities.reducedMotion) {
              return;
            }
            if (!this.consciousnessVisualizer || !this.rootNavBar) {
              return;
            }
            const time = timestamp * 1e-3;
            const pulse = Math.sin(time * 2) * 0.1 + 0.9;
            const useBatching =
              this.year3000System && this.year3000System.queueCSSVariableUpdate;
            this.animationState.targetScale = pulse;
            this.animationState.currentScale =
              this.animationState.currentScale +
              (this.animationState.targetScale -
                this.animationState.currentScale) *
                this.animationState.smoothingFactor;
            if (this.consciousnessVisualizer) {
              const transform = `translateX(-50%) scale(${this.animationState.currentScale.toFixed(
                3
              )})`;
              if (useBatching) {
                this.year3000System.queueCSSVariableUpdate(
                  "transform",
                  transform,
                  this.consciousnessVisualizer
                );
              } else {
                this.consciousnessVisualizer.style.transform = transform;
              }
            }
            if (this.harmonicModeIndicator) {
              const opacity = (
                this.animationState.baseOpacity +
                pulse * 0.2
              ).toString();
              if (useBatching) {
                this.year3000System.queueCSSVariableUpdate(
                  "opacity",
                  opacity,
                  this.harmonicModeIndicator
                );
              } else {
                this.harmonicModeIndicator.style.opacity = opacity;
              }
            }
            const frameTime = performance.now() - frameStartTime;
            this.performanceMetrics.animationFrames++;
            this.performanceMetrics.maxFrameTime = Math.max(
              this.performanceMetrics.maxFrameTime,
              frameTime
            );
            this.performanceMetrics.frameTimeHistory.push(frameTime);
            if (this.performanceMetrics.frameTimeHistory.length > 30) {
              this.performanceMetrics.frameTimeHistory.shift();
            }
            this.performanceMetrics.averageFrameTime =
              this.performanceMetrics.frameTimeHistory.reduce(
                (a, b) => a + b,
                0
              ) / this.performanceMetrics.frameTimeHistory.length;
          } catch (error) {
            console.error(
              `[${this.systemName}] Error in consciousness animation:`,
              error
            );
          }
        }
        /**
         * PHASE 3: Performance mode change handler
         * @param {string} mode - 'performance' or 'quality'
         */
        onPerformanceModeChange(mode) {
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3A8} [${this.systemName}] Performance mode changed to: ${mode}`
            );
          }
          if (mode === "performance") {
            this.animationState.smoothingFactor = 0.25;
            this.animationState.baseOpacity = 0.6;
          } else {
            this.animationState.smoothingFactor = 0.15;
            this.animationState.baseOpacity = 0.7;
          }
        }
        // Override handleSettingsChange from BaseVisualSystem to also listen for harmonic mode changes
        handleSettingsChange(event) {
          super.handleSettingsChange(event);
          if (event.detail.key === "sn-currentHarmonicMode") {
            if (this.config?.enableDebug) {
              console.log(
                `[${this.systemName}] Harmonic mode setting changed to: ${event.detail.value}`
              );
            }
            this.updateHarmonicModeDisplay(event.detail.value);
          }
        }
        _createConsciousnessVisualizer() {
          if (!this.rootNavBar) {
            console.warn(
              `[${this.systemName}] Cannot create consciousness visualizer: rootNavBar not found`
            );
            return;
          }
          if (typeof document === "undefined") {
            console.warn(
              `[${this.systemName}] Cannot create consciousness visualizer: document not available`
            );
            return;
          }
          this.consciousnessVisualizer = document.createElement("div");
          this.consciousnessVisualizer.id = "sn-sidebar-consciousness";
          this.consciousnessVisualizer.style.cssText = `
        position: absolute;
        bottom: 10px; /* Adjust as needed */
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 5px; /* Example height */
        border-radius: 3px;
        background: linear-gradient(90deg,
            var(--sn-sidebar-accent1, rgba(var(--spice-rgb-accent),0.6)),
            var(--sn-sidebar-accent2, rgba(var(--spice-rgb-button),0.6))
        );
        opacity: var(--sn-sidebar-opacity, 0.7);
        transition: all 0.5s ease-in-out;
        box-shadow: 0 0 10px var(--sn-sidebar-glow, rgba(var(--spice-rgb-highlight),0.3));
    `;
          try {
            this.rootNavBar.style.position = "relative";
            this.rootNavBar.appendChild(this.consciousnessVisualizer);
            if (this.config?.enableDebug) {
              console.log(
                `[${this.systemName}] Consciousness visualizer created successfully`
              );
            }
          } catch (error) {
            console.error(
              `[${this.systemName}] Failed to append consciousness visualizer:`,
              error
            );
            this.consciousnessVisualizer = null;
          }
        }
        createHarmonicModeDisplay() {
          if (!this.rootNavBar) {
            console.warn(
              `[${this.systemName}] Cannot create harmonic mode display: rootNavBar not found`
            );
            return;
          }
          try {
            this.harmonicModeIndicator = document.createElement("div");
            this.harmonicModeIndicator.id = "sn-harmonic-mode-indicator";
            this.harmonicModeIndicator.className = "sn-harmonic-mode-indicator";
            this.harmonicModeIndicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sn-gradient-accent, var(--spice-accent));
        opacity: 0.6;
        transition: all 0.3s ease;
        box-shadow: 0 0 5px rgba(var(--sn-gradient-accent-rgb), 0.4);
      `;
            this.rootNavBar.appendChild(this.harmonicModeIndicator);
            if (this.config?.enableDebug) {
              console.log(
                `[${this.systemName}] Harmonic mode display created successfully`
              );
            }
          } catch (error) {
            console.error(
              `[${this.systemName}] Failed to create harmonic mode display:`,
              error
            );
          }
        }
        updateColors() {
          if (!this.consciousnessVisualizer) return;
          try {
            const root = document.documentElement;
            const style = getComputedStyle(root);
            const accentColor =
              style.getPropertyValue("--spice-accent") || "#ca9ee6";
            const buttonColor =
              style.getPropertyValue("--spice-button") || "#8caaee";
            const highlightColor =
              style.getPropertyValue("--spice-highlight") || "#babbf1";
            this.consciousnessVisualizer.style.background = `linear-gradient(90deg,
        rgba(var(--spice-rgb-accent, 202,158,230), 0.6),
        rgba(var(--spice-rgb-button, 140,170,238), 0.6)
      )`;
            this.consciousnessVisualizer.style.boxShadow = `0 0 10px rgba(var(--spice-rgb-highlight, 186,187,241), 0.3)`;
            if (this.config?.enableDebug) {
              console.log(`[${this.systemName}] Colors updated successfully`);
            }
          } catch (error) {
            console.error(
              `[${this.systemName}] Failed to update colors:`,
              error
            );
          }
        }
        startConsciousnessLoop() {
          if (this.consciousnessAnimationFrame) {
            cancelAnimationFrame(this.consciousnessAnimationFrame);
          }
          const animate = () => {
            if (!this.consciousnessVisualizer || !this.rootNavBar) {
              return;
            }
            try {
              const time = Date.now() * 1e-3;
              const pulse = Math.sin(time * 2) * 0.1 + 0.9;
              if (this.consciousnessVisualizer) {
                this.consciousnessVisualizer.style.transform = `translateX(-50%) scale(${pulse})`;
              }
              if (this.harmonicModeIndicator) {
                this.harmonicModeIndicator.style.opacity = (
                  0.6 +
                  pulse * 0.2
                ).toString();
              }
              this.consciousnessAnimationFrame = requestAnimationFrame(animate);
            } catch (error) {
              console.error(
                `[${this.systemName}] Error in consciousness loop:`,
                error
              );
            }
          };
          this.consciousnessAnimationFrame = requestAnimationFrame(animate);
          if (this.config?.enableDebug) {
            console.log(`[${this.systemName}] Consciousness loop started`);
          }
        }
        updateHarmonicModeDisplay(newModeKey) {
          this.currentHarmonicModeKey = newModeKey;
          const modeDetails =
            HARMONIC_MODES[newModeKey] || HARMONIC_MODES["analogous-flow"];
          if (this.consciousnessVisualizer) {
            const placeholderPrimary = "var(--spice-rgb-accent)";
            const placeholderSecondary = "var(--spice-rgb-button)";
            const placeholderGlow = "var(--spice-rgb-highlight)";
            this.rootNavBar.style.setProperty(
              "--sn-sidebar-accent1",
              `rgba(${placeholderPrimary}, 0.6)`
            );
            this.rootNavBar.style.setProperty(
              "--sn-sidebar-accent2",
              `rgba(${placeholderSecondary}, 0.6)`
            );
            this.rootNavBar.style.setProperty(
              "--sn-sidebar-glow",
              `rgba(${placeholderGlow}, 0.3)`
            );
          }
          if (this.config?.enableDebug) {
            const description = modeDetails?.description || "Unknown mode";
            console.log(
              `[${this.systemName}] Harmonic mode display updated to: ${newModeKey} (${description})`
            );
          }
        }
        _updateSidebarVariables(processedMusicData = {}) {
          if (!this.isInitialized || !this.rootNavBar) return;
          const {
            energy = 0.5,
            valence = 0.5,
            visualIntensity = 0.5,
            moodIdentifier = "neutral",
          } = processedMusicData;
          const rootStyle = Year3000Utilities.getRootStyle();
          this.nexusVariables.complexity = parseFloat(
            rootStyle.getPropertyValue("--sn-nexus-complexity") || "0.1"
          );
          this.nexusVariables.coherence = parseFloat(
            rootStyle.getPropertyValue("--sn-nexus-coherence") || "0.8"
          );
          this.nexusVariables.volatility = parseFloat(
            rootStyle.getPropertyValue("--sn-nexus-volatility") || "0.05"
          );
          const opacity = Year3000Utilities.lerpSmooth(
            parseFloat(
              this.rootNavBar.style.getPropertyValue("--sn-sidebar-opacity") ||
                "0.7"
            ),
            0.6 + visualIntensity * 0.4 - this.nexusVariables.volatility * 0.2,
            0.1,
            0.3
          );
          const height = Year3000Utilities.lerpSmooth(
            parseFloat(
              this.consciousnessVisualizer?.style.height.replace("px", "")
            ) || 5,
            3 + energy * 5 + this.nexusVariables.complexity * 5,
            0.1,
            0.25
            // Height in px
          );
          const widthPercentage = Year3000Utilities.lerpSmooth(
            parseFloat(
              this.consciousnessVisualizer?.style.width.replace("%", "")
            ) || 80,
            70 + valence * 20 + this.nexusVariables.coherence * 10,
            0.1,
            0.2
          );
          this.rootNavBar.style.setProperty(
            "--sn-sidebar-opacity",
            `${Math.max(0.3, Math.min(1, opacity)).toFixed(2)}`
          );
          if (this.consciousnessVisualizer) {
            this.consciousnessVisualizer.style.height = `${Math.max(
              2,
              Math.min(15, height)
            ).toFixed(0)}px`;
            this.consciousnessVisualizer.style.width = `${Math.max(
              50,
              Math.min(95, widthPercentage)
            ).toFixed(0)}%`;
            const pulseSpeed =
              (1 / (processedMusicData.tempo / 120 || 1)) * 0.5 + 0.5;
            this.consciousnessVisualizer.style.animationDuration = `${Math.max(
              0.5,
              Math.min(3, pulseSpeed)
            ).toFixed(2)}s`;
          }
          if (this.config?.enableDebug && Math.random() < 0.01) {
            console.log(
              `[${
                this.systemName
              }] Sidebar variables updated. Opacity: ${opacity.toFixed(
                2
              )}, Height: ${height.toFixed(0)}px, Mood: ${moodIdentifier}`
            );
          }
        }
        updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
          if (!this.isInitialized) return;
          super.updateFromMusicAnalysis(
            processedMusicData,
            rawFeatures,
            trackUri
          );
          this._updateSidebarVariables(processedMusicData);
        }
        // ===== YEAR 3000 MODE CONFIGURATION =====
        /**
         * Update system configuration based on current artistic mode
         * @param {Object} modeConfig - Configuration from artistic mode profile
         */
        updateModeConfiguration(modeConfig) {
          if (!modeConfig) return;
          const { enabled, animations, intensity } = modeConfig;
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3A8} [${this.systemName}] Updating mode configuration:`,
              modeConfig
            );
          }
          this.modeConfig = {
            systemEnabled: enabled !== false,
            consciousnessAnimationsEnabled: animations || false,
            intensityMultiplier: intensity || 1,
            harmonicSyncEnabled: modeConfig.harmonicSync || false,
          };
          this.updateConsciousnessForMode();
          if (this.modeConfig.harmonicSyncEnabled) {
            this.setupHarmonicSyncListener();
          } else {
            this.removeHarmonicSyncListener();
          }
        }
        /**
         * Update consciousness display behavior based on current mode
         */
        updateConsciousnessForMode() {
          if (!this.modeConfig) return;
          const baseIntensity = this.modeConfig.intensityMultiplier || 1;
          this.consciousnessState.modeScaling = baseIntensity;
          this.consciousnessState.animationsEnabled =
            this.modeConfig.consciousnessAnimationsEnabled;
          this.updateConsciousnessDisplay(this.consciousnessState);
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F9E0} [${this.systemName}] Updated consciousness for mode - Intensity: ${baseIntensity}`
            );
          }
        }
        /**
         * Setup listener for harmonic sync events
         */
        setupHarmonicSyncListener() {
          if (this.harmonicSyncListener) return;
          this.harmonicSyncListener = (event) => {
            if (!this.modeConfig?.harmonicSyncEnabled) return;
            const harmonicData = event.detail;
            this.syncConsciousnessToHarmonics(harmonicData);
          };
          document.addEventListener(
            "year3000HarmonicSync",
            this.harmonicSyncListener
          );
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3B5} [${this.systemName}] Harmonic sync listener enabled`
            );
          }
        }
        /**
         * Remove harmonic sync listener
         */
        removeHarmonicSyncListener() {
          if (this.harmonicSyncListener) {
            document.removeEventListener(
              "year3000HarmonicSync",
              this.harmonicSyncListener
            );
            this.harmonicSyncListener = null;
            if (this.config?.enableDebug) {
              console.log(
                `\u{1F3B5} [${this.systemName}] Harmonic sync listener disabled`
              );
            }
          }
        }
        /**
         * Sync consciousness display to harmonic data
         * @param {Object} harmonicData - Harmonic data from BeatSyncVisualSystem
         */
        syncConsciousnessToHarmonics(harmonicData) {
          if (!harmonicData || !this.consciousnessState) return;
          const { composite } = harmonicData;
          const intensity = this.modeConfig?.intensityMultiplier || 1;
          const harmonicModulation = {
            opacity: 0.8 + composite.oscillation * 0.15 * intensity,
            scale: 1 + composite.pulse * 0.05 * intensity,
            rotation: composite.flow * 2 * intensity,
            glow: 0.3 + composite.oscillation * 0.2 * intensity,
          };
          this.consciousnessState.harmonicModulation = harmonicModulation;
          this.applyHarmonicModulation(harmonicModulation);
        }
        /**
         * Apply harmonic modulation to consciousness elements
         * @param {Object} modulation - Harmonic modulation values
         */
        applyHarmonicModulation(modulation) {
          const root = document.documentElement;
          root.style.setProperty(
            "--sn-consciousness-harmonic-opacity",
            modulation.opacity.toFixed(3)
          );
          root.style.setProperty(
            "--sn-consciousness-harmonic-scale",
            modulation.scale.toFixed(3)
          );
          root.style.setProperty(
            "--sn-consciousness-harmonic-rotation",
            modulation.rotation.toFixed(2)
          );
          root.style.setProperty(
            "--sn-consciousness-harmonic-glow",
            modulation.glow.toFixed(3)
          );
          const sidebarElements = document.querySelectorAll(
            ".sn-consciousness-field, .sn-harmonic-mode-indicator"
          );
          sidebarElements.forEach((element) => {
            if (this.modeConfig?.consciousnessAnimationsEnabled) {
              element.style.opacity = modulation.opacity;
              element.style.transform = `scale(${modulation.scale}) rotate(${modulation.rotation}deg)`;
              element.style.filter = `drop-shadow(0 0 ${
                modulation.glow * 10
              }px rgba(var(--sn-gradient-accent-rgb), ${modulation.glow}))`;
            }
          });
        }
        /**
         * Check system health and identify any issues
         * @returns {Object} Health status with detailed checks
         */
        isHealthy() {
          const checks = {
            rootNavBar: !!this.rootNavBar,
            consciousnessVisualizer: !!this.consciousnessVisualizer,
            harmonicModeIndicator: !!this.harmonicModeIndicator,
            methodsExist: {
              createHarmonicModeDisplay:
                typeof this.createHarmonicModeDisplay === "function",
              updateColors: typeof this.updateColors === "function",
              startConsciousnessLoop:
                typeof this.startConsciousnessLoop === "function",
              _createConsciousnessVisualizer:
                typeof this._createConsciousnessVisualizer === "function",
            },
            domElements: {
              rootNavBarAccessible:
                this.rootNavBar &&
                document.contains &&
                document.contains(this.rootNavBar),
              visualizerAttached:
                this.consciousnessVisualizer &&
                this.consciousnessVisualizer.parentNode,
              indicatorAttached:
                this.harmonicModeIndicator &&
                this.harmonicModeIndicator.parentNode,
            },
            initialization: {
              initialized: this.initialized !== false,
              configValid: !!this.config,
              systemNameSet: !!this.systemName,
            },
          };
          const methodIssues = Object.entries(checks.methodsExist)
            .filter(([method, exists]) => !exists)
            .map(([method]) => `${method} method missing`);
          const domIssues = [];
          if (!checks.rootNavBar) domIssues.push("rootNavBar not found");
          if (!checks.consciousnessVisualizer)
            domIssues.push("consciousnessVisualizer not created");
          if (!checks.harmonicModeIndicator)
            domIssues.push("harmonicModeIndicator not created");
          if (!checks.domElements.rootNavBarAccessible)
            domIssues.push("rootNavBar not accessible in DOM");
          if (!checks.domElements.visualizerAttached)
            domIssues.push("consciousnessVisualizer not attached to DOM");
          if (!checks.domElements.indicatorAttached)
            domIssues.push("harmonicModeIndicator not attached to DOM");
          const initIssues = [];
          if (!checks.initialization.initialized)
            initIssues.push("system not initialized");
          if (!checks.initialization.configValid)
            initIssues.push("config not valid");
          if (!checks.initialization.systemNameSet)
            initIssues.push("systemName not set");
          const allIssues = [...methodIssues, ...domIssues, ...initIssues];
          const isHealthy = allIssues.length === 0;
          return {
            healthy: isHealthy,
            checks,
            issues: allIssues,
            score: isHealthy ? 100 : Math.max(0, 100 - allIssues.length * 12),
            categories: {
              methods: methodIssues,
              dom: domIssues,
              initialization: initIssues,
            },
          };
        }
        destroy() {
          if (this.masterAnimationRegistered && this.year3000System) {
            try {
              this.year3000System.unregisterAnimationSystem(
                "SidebarConsciousnessSystem"
              );
              this.masterAnimationRegistered = false;
              this.isUsingMasterAnimation = false;
              if (this.config?.enableDebug) {
                console.log(
                  `\u{1F3AC} [${this.systemName}] Unregistered from Master Animation Coordinator`
                );
              }
            } catch (error) {
              console.warn(
                `[${this.systemName}] Failed to unregister from Master Animation Coordinator:`,
                error
              );
            }
          }
          if (this.consciousnessAnimationFrame) {
            cancelAnimationFrame(this.consciousnessAnimationFrame);
            this.consciousnessAnimationFrame = null;
            if (this.config?.enableDebug) {
              console.log(
                `\u{1F504} [${this.systemName}] Stopped fallback animation loop`
              );
            }
          }
          this.removeHarmonicSyncListener();
          if (this.sidebarObserver) {
            this.sidebarObserver.disconnect();
            this.sidebarObserver = null;
          }
          if (this.consciousnessVisualizer) {
            this.consciousnessVisualizer.remove();
            this.consciousnessVisualizer = null;
          }
          if (this.harmonicModeIndicator) {
            this.harmonicModeIndicator.remove();
            this.harmonicModeIndicator = null;
          }
          const consciousnessElements = document.querySelectorAll(
            ".sn-consciousness-field"
          );
          consciousnessElements.forEach((element) => element.remove());
          super.destroy();
          if (this.config?.enableDebug) {
            console.log(`[${this.systemName}] Destroyed and cleaned up.`);
          }
        }
      };
    },
  });

  // src-js/services/GenreProfileManager.js
  var GENRE_PROFILES, GenreProfileManager;
  var init_GenreProfileManager = __esm({
    "src-js/services/GenreProfileManager.js"() {
      init_globalConfig();
      GENRE_PROFILES = {
        electronic: { energyBoost: 1.1, beatEmphasis: 1.2, precision: 0.9 },
        dance: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
        house: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
        techno: { energyBoost: 1.15, beatEmphasis: 1.3, precision: 1 },
        trance: { energyBoost: 1.15, beatEmphasis: 1.1, precision: 0.85 },
        rock: {
          energyBoost: 1.05,
          intensityMultiplier: 1.1,
          dynamicRange: 1.1,
        },
        metal: {
          energyBoost: 1.15,
          intensityMultiplier: 1.2,
          dynamicRange: 1.2,
        },
        punk: { energyBoost: 1.2, intensityMultiplier: 1.1, precision: 0.8 },
        hiphop: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },
        rap: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },
        jazz: {
          adaptiveVariation: true,
          complexity: 1.2,
          smoothingFactor: 1.3,
        },
        classical: {
          gentleMode: true,
          dynamicRange: 1.4,
          tempoVariationHandling: "adaptive",
        },
        ambient: {
          subtleMode: true,
          intensityReduction: 0.7,
          smoothingFactor: 1.5,
        },
        pop: { energyBoost: 1.05, beatEmphasis: 1.1, precision: 0.85 },
        rnb: { grooveFactor: 1.25, smoothingFactor: 1.1 },
        soul: { grooveFactor: 1.3, smoothingFactor: 1.15 },
        default: {
          balanced: true,
          energyBoost: 1,
          beatEmphasis: 1,
          precision: 1,
        },
      };
      GenreProfileManager = class {
        constructor(dependencies = {}) {
          this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
          if (this.config.enableDebug) {
            console.log("\u{1F9EC} [GenreProfileManager] Initialized");
          }
        }
        // A simple genre detection heuristic based on audio features.
        // This avoids needing extra API calls for artist/album genres for now.
        _getGenreFromAudioFeatures(features) {
          if (!features) return "default";
          const {
            danceability,
            energy,
            acousticness,
            instrumentalness,
            tempo,
          } = features;
          if (instrumentalness > 0.6 && acousticness < 0.2 && energy > 0.6) {
            if (tempo > 120) return "techno";
            return "electronic";
          }
          if (danceability > 0.7 && energy > 0.7) return "dance";
          if (acousticness > 0.7 && energy < 0.4) return "classical";
          if (acousticness > 0.5 && instrumentalness < 0.1) return "jazz";
          if (energy > 0.7 && instrumentalness < 0.1 && danceability > 0.5)
            return "rock";
          if (
            danceability > 0.7 &&
            instrumentalness < 0.2 &&
            energy > 0.5 &&
            tempo < 110
          )
            return "hiphop";
          return "default";
        }
        // Retrieve the appropriate profile for a given track's features.
        getProfileForTrack(audioFeatures) {
          const genre = this._getGenreFromAudioFeatures(audioFeatures);
          const profile = GENRE_PROFILES[genre] || GENRE_PROFILES.default;
          if (this.config.enableDebug) {
            console.log(
              `[GenreProfileManager] Detected genre: '${genre}'. Applying profile.`
            );
          }
          return profile;
        }
      };
    },
  });

  // src-js/services/MusicSyncService.js
  var MusicSyncService_exports = {};
  __export(MusicSyncService_exports, {
    MusicSyncService: () => MusicSyncService,
  });
  var MUSIC_SYNC_CONFIG, MusicSyncService;
  var init_MusicSyncService = __esm({
    "src-js/services/MusicSyncService.js"() {
      init_globalConfig();
      init_Year3000Utilities();
      init_GenreProfileManager();
      MUSIC_SYNC_CONFIG = {
        enableDebug: true,
        enableBeatSynchronization: true,
        enableGenreAnalysis: true,
        enableMoodAdaptation: true,
        // Core calculation settings (from BMPHarmonyEngine)
        bpmCalculation: {
          useEnhancedAlgorithm: true,
          danceabilityWeight: 0.9,
          energyWeight: 0.6,
          bpmWeight: 0.6,
          energyThreshold: 0.5,
          danceabilityThreshold: 0.5,
          bpmThreshold: 0.8,
          maxBPM: 100,
          minBPM: 70,
        },
        // Performance settings (unified from both services)
        performance: {
          cacheSize: 100,
          cacheTTL: 3e5,
          // 5 minutes
          maxRetries: 10,
          retryDelay: 200,
          enableMetrics: true,
          processingTimeTarget: 50,
        },
        // Simplified synchronization settings
        synchronization: {
          beatAccuracyTarget: 50,
          maxSyncDelay: 1e3,
          adaptiveQuality: true,
          predictiveCaching: true,
          debounceRapidChanges: 200,
        },
        // Genre profiles (will be moved to separate module in Phase 2)
        genreProfiles: {
          electronic: { intensityMultiplier: 1.2, precisionBoost: 1.1 },
          jazz: { smoothingFactor: 1.3, adaptiveVariation: true },
          classical: { gentleMode: true, tempoVariationHandling: "adaptive" },
          rock: { energyBoost: 1.15, consistentTiming: true },
          ambient: { subtleMode: true, intensityReduction: 0.7 },
          hiphop: { beatEmphasis: 1.25, rhythmPrecision: "high" },
          default: { balanced: true },
        },
      };
      MusicSyncService = class {
        constructor(dependencies = {}) {
          this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
          this.utils = dependencies.Year3000Utilities || Year3000Utilities;
          this.colorHarmonyEngine = dependencies.colorHarmonyEngine;
          this.settingsManager = dependencies.settingsManager;
          this.genreProfileManager =
            dependencies.genreProfileManager ||
            new GenreProfileManager({ YEAR3000_CONFIG: this.config });
          this.isInitialized = false;
          this.currentTrack = null;
          this.audioData = null;
          this.currentTrackUri = null;
          this.latestProcessedData = null;
          this.metrics = {
            bpmCalculations: 0,
            beatSyncs: 0,
            cacheHits: 0,
            cacheMisses: 0,
            avgProcessingTime: 0,
            performance: [],
            errors: 0,
            updates: 0,
          };
          this.unifiedCache = /* @__PURE__ */ new Map();
          this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;
          this.subscribers = /* @__PURE__ */ new Map();
          this.beatSync = {
            lastBeatTime: 0,
            nextBeatTime: 0,
            beatInterval: 0,
            confidence: 0,
            isActive: false,
          };
          this.userPreferences = this.loadUserPreferences();
          this.performanceInterval = null;
          this.cacheCleanupInterval = null;
          if (this.config.enableDebug) {
            console.log("\u{1F3B5} MusicSyncService constructor called");
            console.log(
              "\u{1F3B5} [MusicSyncService] Initialized with GenreProfileManager support"
            );
          }
        }
        async initialize() {
          try {
            if (this.config.enableDebug) {
              console.log("\u{1F3B5} Initializing unified MusicSyncService...");
            }
            if (!Spicetify?.Player?.getAudioData) {
              console.warn(
                "[MusicSyncService] Spicetify audio data API not available at initialization. Some features may be limited."
              );
            } else {
              if (this.config.enableDebug) {
                console.log(
                  "[MusicSyncService] Spicetify.Player.getAudioData is available."
                );
              }
            }
            this.setupCacheManagement();
            if (MUSIC_SYNC_CONFIG.performance.enableMetrics) {
              this.setupPerformanceMonitoring();
            }
            this.isInitialized = true;
            if (this.config.enableDebug) {
              console.log(
                "\u{1F31F} MusicSyncService initialized successfully!"
              );
            }
          } catch (error) {
            console.error(
              "\u274C MusicSyncService initialization failed:",
              error
            );
            this.metrics.errors++;
          }
        }
        // === SUBSCRIBER MANAGEMENT (Simplified from MusicAnalysisService) ===
        subscribe(systemInstance, systemName) {
          if (
            !systemInstance ||
            typeof systemInstance.updateFromMusicAnalysis !== "function"
          ) {
            console.warn(
              `[MusicSyncService] Invalid system or missing updateFromMusicAnalysis method: ${systemName}`
            );
            return;
          }
          if (this.subscribers.has(systemName)) {
            if (this.config.enableDebug) {
              console.warn(
                `[MusicSyncService] System ${systemName} already subscribed.`
              );
            }
            return;
          }
          this.subscribers.set(systemName, systemInstance);
          if (this.config.enableDebug) {
            console.log(`[MusicSyncService] System subscribed: ${systemName}`);
          }
          if (this.latestProcessedData && systemInstance.initialized) {
            try {
              systemInstance.updateFromMusicAnalysis(
                this.latestProcessedData,
                null,
                this.currentTrackUri
              );
            } catch (error) {
              console.error(
                `[MusicSyncService] Error notifying new subscriber ${systemName}:`,
                error
              );
            }
          }
        }
        unsubscribe(systemName) {
          if (this.subscribers.has(systemName)) {
            this.subscribers.delete(systemName);
            if (this.config.enableDebug) {
              console.log(
                `[MusicSyncService] System unsubscribed: ${systemName}`
              );
            }
          }
        }
        notifySubscribers(processedData, rawFeatures, trackUri) {
          if (!this.isInitialized) {
            console.warn(
              "[MusicSyncService] Not initialized, cannot notify subscribers."
            );
            return;
          }
          this.latestProcessedData = processedData;
          if (
            this.config.enableDebug &&
            this.subscribers.size > 0 &&
            Math.random() < 0.05
          ) {
            console.log(
              `[MusicSyncService] Notifying ${this.subscribers.size} subscribers for track ${trackUri}`
            );
          }
          let notified = 0;
          let errors = 0;
          for (const [name, system] of this.subscribers) {
            try {
              if (
                system.initialized &&
                typeof system.updateFromMusicAnalysis === "function"
              ) {
                system.updateFromMusicAnalysis(
                  processedData,
                  rawFeatures,
                  trackUri
                );
                notified++;
              }
            } catch (error) {
              console.error(
                `[MusicSyncService] Error updating system ${name}:`,
                error
              );
              errors++;
            }
          }
          if (this.config.enableDebug && errors > 0) {
            console.log(
              `[MusicSyncService] Notification result: ${notified} notified, ${errors} errors`
            );
          }
        }
        // === AUDIO DATA PROCESSING (From BMPHarmonyEngine) ===
        async fetchAudioData(options = {}) {
          const {
            retryDelay = MUSIC_SYNC_CONFIG.performance.retryDelay,
            maxRetries = MUSIC_SYNC_CONFIG.performance.maxRetries,
          } = options;
          const currentTrackUri = Spicetify.Player.data?.item?.uri;
          if (!currentTrackUri) {
            if (this.config.enableDebug) {
              console.warn(
                "[MusicSyncService] No current track URI to fetch audio data."
              );
            }
            return null;
          }
          const cacheKey = this.generateCacheKey(currentTrackUri, "audioData");
          const cached = this.getFromCache(cacheKey);
          if (cached?.audioData) {
            this.metrics.cacheHits++;
            return cached.audioData;
          }
          this.metrics.cacheMisses++;
          for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
              const audioData = await Spicetify.Player.getAudioData();
              this.setInCache(cacheKey, { audioData });
              return audioData;
            } catch (error) {
              if (attempt < maxRetries - 1) {
                if (this.config.enableDebug) {
                  console.log(
                    `[MusicSyncService] Retrying audio data fetch (${
                      attempt + 1
                    }/${maxRetries})...`
                  );
                }
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
              } else {
                if (this.config.enableDebug) {
                  console.warn(
                    `[MusicSyncService] Audio data fetch failed after ${maxRetries} attempts:`,
                    error
                  );
                }
                this.metrics.errors++;
                return null;
              }
            }
          }
          return null;
        }
        async getAudioFeatures() {
          try {
            const currentTrack = Spicetify.Player.data?.item;
            if (!currentTrack?.uri) return null;
            const trackId = currentTrack.uri.split(":")[2];
            const cacheKey = this.generateCacheKey(trackId, "features");
            const cached = this.getFromCache(cacheKey);
            if (cached?.audioFeatures) {
              this.metrics.cacheHits++;
              return cached.audioFeatures;
            }
            this.metrics.cacheMisses++;
            const response = await Spicetify.CosmosAsync.get(
              `https://api.spotify.com/v1/audio-features/${trackId}`
            );
            const features = {
              danceability: response.danceability,
              energy: response.energy,
              valence: response.valence,
              acousticness: response.acousticness,
              instrumentalness: response.instrumentalness,
              tempo: response.tempo,
            };
            this.setInCache(cacheKey, { audioFeatures: features });
            return features;
          } catch (error) {
            if (this.config.enableDebug) {
              console.warn(
                "[MusicSyncService] Could not fetch audio features:",
                error
              );
            }
            return null;
          }
        }
        // === ENHANCED BPM CALCULATION (Best of both services) ===
        async calculateEnhancedBPM(audioData, options = {}) {
          const startTime = performance.now();
          try {
            if (!audioData?.track?.tempo) {
              if (this.config.enableDebug) {
                console.warn(
                  "[MusicSyncService] No BPM data available for track"
                );
              }
              return this.getFallbackBPM();
            }
            const trackBPM = audioData.track.tempo;
            const config = { ...this.config.bpmCalculation, ...options };
            const audioFeatures = await this.getAudioFeatures();
            if (!audioFeatures) {
              if (this.config.enableDebug) {
                console.log("[MusicSyncService] Using basic BPM calculation");
              }
              return this.validateBPM(trackBPM);
            }
            const { danceability, energy, valence = 0.5 } = audioFeatures;
            if (this.config.enableDebug) {
              console.log(
                `[MusicSyncService] Audio features - Danceability: ${danceability}, Energy: ${energy}, Valence: ${valence}`
              );
            }
            const profile =
              this.genreProfileManager.getProfileForTrack(audioFeatures);
            const enhancedBPM = this.computeAdvancedBPM({
              trackBPM,
              danceability,
              energy,
              valence,
              config,
              profile,
            });
            const cacheKey = this.generateCacheKey(audioData.track.uri, "bpm");
            this.setInCache(cacheKey, {
              bpm: enhancedBPM,
              audioFeatures,
            });
            this.metrics.bpmCalculations++;
            this.trackPerformance(startTime);
            if (this.config.enableDebug) {
              console.log(
                `[MusicSyncService] Enhanced BPM: ${enhancedBPM} (original: ${trackBPM})`
              );
            }
            return enhancedBPM;
          } catch (error) {
            console.error("[MusicSyncService] BPM calculation failed:", error);
            this.metrics.errors++;
            return this.getFallbackBPM();
          }
        }
        computeAdvancedBPM({
          trackBPM,
          danceability,
          energy,
          valence,
          config,
          profile,
        }) {
          const {
            danceabilityWeight,
            energyWeight,
            bpmWeight,
            energyThreshold,
            danceabilityThreshold,
            bpmThreshold,
            maxBPM,
            minBPM,
          } = config;
          const normalizedBPM = Math.min(trackBPM / 100, 2);
          let adjustedDanceabilityWeight = danceabilityWeight;
          let adjustedEnergyWeight = energyWeight;
          let adjustedBpmWeight = bpmWeight;
          if (danceability < danceabilityThreshold) {
            adjustedDanceabilityWeight *= danceability;
          }
          if (energy < energyThreshold) {
            adjustedEnergyWeight *= energy;
          }
          if (normalizedBPM < bpmThreshold) {
            adjustedBpmWeight = 0.9;
          }
          const valenceInfluence =
            valence > 0.6 ? 1.1 : valence < 0.4 ? 0.9 : 1;
          const weightSum =
            adjustedDanceabilityWeight +
            adjustedEnergyWeight +
            adjustedBpmWeight;
          const weightedAverage =
            (danceability * adjustedDanceabilityWeight +
              energy * adjustedEnergyWeight +
              normalizedBPM * adjustedBpmWeight) /
            weightSum;
          let enhancedBPM = weightedAverage * maxBPM * valenceInfluence;
          if (enhancedBPM > trackBPM) {
            enhancedBPM = (enhancedBPM + trackBPM) / 2;
          }
          if (enhancedBPM < trackBPM) {
            enhancedBPM = Math.max(enhancedBPM, minBPM);
          }
          if (profile.beatEmphasis) {
            enhancedBPM *= profile.beatEmphasis;
          }
          return this.validateBPM(enhancedBPM);
        }
        // === AUDIO FEATURE ESTIMATION (From MusicAnalysisService) ===
        estimateDanceabilityFromTempo(tempo) {
          const config =
            this.config.musicVisualSync.enhancedBPM.danceabilityEstimation;
          if (tempo >= config.highDance.min && tempo <= config.highDance.max) {
            return config.highDance.value;
          }
          if (
            tempo >= config.mediumDance.min &&
            tempo <= config.mediumDance.max
          ) {
            return config.mediumDance.value;
          }
          if (
            tempo >= config.lowMediumDance.min &&
            tempo <= config.lowMediumDance.max
          ) {
            return config.lowMediumDance.value;
          }
          return config.lowDance.value;
        }
        estimateEnergyFromTempoLoudness(tempo, loudness) {
          const config =
            this.config.musicVisualSync.enhancedBPM.energyEstimation;
          const tempoFactor = Math.max(
            0,
            Math.min(
              1,
              (tempo - config.tempoRange.min) /
                (config.tempoRange.max - config.tempoRange.min)
            )
          );
          const loudnessFactor = Math.max(
            0,
            Math.min(
              1,
              (loudness - config.loudnessRange.min) /
                (config.loudnessRange.max - config.loudnessRange.min)
            )
          );
          return (
            tempoFactor * config.tempoWeight +
            loudnessFactor * config.loudnessWeight
          );
        }
        estimateValenceFromKey(key) {
          const majorKeys = [0, 2, 4, 5, 7, 9, 11];
          return majorKeys.includes(key) ? 0.6 : 0.4;
        }
        // === MAIN PROCESSING PIPELINE (From MusicAnalysisService) ===
        async processAudioFeatures(
          rawSpicetifyAudioFeatures,
          trackUri,
          trackDurationMs
        ) {
          if (!this.isInitialized) {
            console.warn(
              "[MusicSyncService] Not initialized, skipping processing."
            );
            return null;
          }
          this.currentTrackUri = trackUri;
          const cacheKey = this.generateCacheKey(trackUri, "processed");
          const cached = this.getFromCache(cacheKey);
          if (cached?.processedData) {
            this.notifySubscribers(cached.processedData);
            return cached.processedData;
          }
          try {
            let audioAnalysisData = rawSpicetifyAudioFeatures;
            if (!audioAnalysisData) {
              audioAnalysisData = await this.fetchAudioData();
            }
            let enhancedBPM;
            let tempo, loudness, key, timeSignature;
            let estimatedDanceability, estimatedEnergy, estimatedValence;
            if (audioAnalysisData) {
              enhancedBPM = await this.calculateEnhancedBPM(audioAnalysisData);
              const trackData = audioAnalysisData.track || {};
              tempo =
                trackData.tempo ||
                this.config.musicVisualSync.enhancedBPM.fallbacks.tempo;
              loudness =
                trackData.loudness ||
                this.config.musicVisualSync.enhancedBPM.fallbacks.loudness;
              key =
                trackData.key ||
                this.config.musicVisualSync.enhancedBPM.fallbacks.key;
              timeSignature =
                trackData.time_signature ||
                this.config.musicVisualSync.enhancedBPM.fallbacks.timeSignature;
              const audioFeatures = await this.getAudioFeatures();
              if (audioFeatures) {
                estimatedDanceability =
                  audioFeatures.danceability ||
                  this.estimateDanceabilityFromTempo(tempo);
                estimatedEnergy =
                  audioFeatures.energy ||
                  this.estimateEnergyFromTempoLoudness(tempo, loudness);
                estimatedValence =
                  audioFeatures.valence || this.estimateValenceFromKey(key);
              } else {
                estimatedDanceability =
                  this.estimateDanceabilityFromTempo(tempo);
                estimatedEnergy = this.estimateEnergyFromTempoLoudness(
                  tempo,
                  loudness
                );
                estimatedValence = this.estimateValenceFromKey(key);
              }
            } else {
              const fallbacks =
                this.config.musicVisualSync.enhancedBPM.fallbacks;
              tempo = fallbacks.tempo;
              loudness = fallbacks.loudness;
              key = fallbacks.key;
              timeSignature = fallbacks.timeSignature;
              enhancedBPM = tempo;
              estimatedDanceability = this.estimateDanceabilityFromTempo(tempo);
              estimatedEnergy = this.estimateEnergyFromTempoLoudness(
                tempo,
                loudness
              );
              estimatedValence = this.estimateValenceFromKey(key);
            }
            let artisticMultipliers;
            try {
              if (typeof this.config.getCurrentMultipliers === "function") {
                artisticMultipliers = this.config.getCurrentMultipliers();
              } else {
                artisticMultipliers = this.config.artisticMultipliers || {
                  musicEnergyBoost: 1,
                  visualIntensityBase: 1,
                };
              }
            } catch (error) {
              console.error(
                "[MusicSyncService] Error getting multipliers:",
                error
              );
              artisticMultipliers = {
                musicEnergyBoost: 1,
                visualIntensityBase: 1,
              };
            }
            let processedEnergy = estimatedEnergy;
            if (this.config.enableCosmicSync) {
              processedEnergy =
                estimatedEnergy * artisticMultipliers.musicEnergyBoost;
              processedEnergy = Math.max(0.1, Math.min(1, processedEnergy));
            }
            const baseIntensity =
              estimatedEnergy * 0.6 + estimatedDanceability * 0.4;
            const visualIntensity =
              baseIntensity * (artisticMultipliers.visualIntensityBase || 1);
            let moodIdentifier = "neutral";
            if (estimatedValence > 0.6 && estimatedEnergy > 0.6) {
              moodIdentifier = "energetic-happy";
            } else if (estimatedValence > 0.6 && estimatedEnergy <= 0.6) {
              moodIdentifier = "calm-happy";
            } else if (estimatedValence <= 0.4 && estimatedEnergy > 0.6) {
              moodIdentifier = "intense-moody";
            } else if (estimatedValence <= 0.4 && estimatedEnergy <= 0.4) {
              moodIdentifier = "calm-melancholy";
            }
            const processedData = {
              trackUri,
              timestamp: Date.now(),
              // Real audio data
              tempo,
              loudness,
              key,
              timeSignature,
              duration: trackDurationMs,
              // Estimated features
              estimatedDanceability,
              estimatedEnergy,
              estimatedValence,
              // Processed values
              energy: estimatedEnergy,
              valence: estimatedValence,
              processedEnergy,
              visualIntensity,
              moodIdentifier,
              // Enhanced BPM
              baseBPM: tempo,
              enhancedBPM,
              bmpCalculationMethod: "unified-service",
              // Metadata
              dataSource: "unified-music-sync-service",
            };
            this.setInCache(cacheKey, { processedData });
            this.latestProcessedData = processedData;
            if (this.config.enableDebug) {
              console.log(
                "\u{1F3B5} [MusicSyncService] Processed music data:",
                {
                  baseTempo: tempo,
                  enhancedBPM,
                  mood: moodIdentifier,
                  energy: estimatedEnergy.toFixed(2),
                  visualIntensity: visualIntensity.toFixed(2),
                }
              );
            }
            this.notifySubscribers(processedData);
            return processedData;
          } catch (error) {
            console.error("[MusicSyncService] Processing failed:", error);
            this.metrics.errors++;
            const fallbackData = this.getFallbackProcessedData(trackUri);
            this.latestProcessedData = fallbackData;
            this.notifySubscribers(fallbackData);
            return fallbackData;
          }
        }
        // === UTILITY METHODS ===
        validateBPM(bpm) {
          const { minBPM, maxBPM } = this.config.bpmCalculation;
          return Math.max(
            minBPM,
            Math.min(maxBPM * 2, Math.round(bpm * 100) / 100)
          );
        }
        getFallbackBPM() {
          return 75;
        }
        getFallbackProcessedData(trackUri) {
          const fallbacks = this.config.musicVisualSync.enhancedBPM.fallbacks;
          return {
            trackUri,
            timestamp: Date.now(),
            tempo: fallbacks.tempo,
            loudness: fallbacks.loudness,
            key: fallbacks.key,
            timeSignature: fallbacks.timeSignature,
            estimatedDanceability: this.estimateDanceabilityFromTempo(
              fallbacks.tempo
            ),
            estimatedEnergy: this.estimateEnergyFromTempoLoudness(
              fallbacks.tempo,
              fallbacks.loudness
            ),
            estimatedValence: 0.5,
            energy: 0.5,
            valence: 0.5,
            processedEnergy: 0.5,
            visualIntensity: 0.5,
            moodIdentifier: "neutral",
            baseBPM: fallbacks.tempo,
            enhancedBPM: fallbacks.tempo,
            bmpCalculationMethod: "fallback",
            dataSource: "fallback",
          };
        }
        // === CACHING SYSTEM (Unified) ===
        generateCacheKey(identifier, type = "default") {
          return `${type}_${
            identifier?.split?.(":").pop?.() || identifier || Date.now()
          }`;
        }
        getFromCache(key) {
          const cached = this.unifiedCache.get(key);
          if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached;
          }
          if (cached) {
            this.unifiedCache.delete(key);
          }
          return null;
        }
        setInCache(key, data) {
          this.unifiedCache.set(key, {
            ...data,
            timestamp: Date.now(),
          });
        }
        setupCacheManagement() {
          if (this.cacheCleanupInterval)
            clearInterval(this.cacheCleanupInterval);
          this.cacheCleanupInterval = setInterval(() => {
            const now = Date.now();
            let prunedCount = 0;
            for (const [key, data] of this.unifiedCache.entries()) {
              if (now - data.timestamp > this.cacheTTL) {
                this.unifiedCache.delete(key);
                prunedCount++;
              }
            }
            if (prunedCount > 0 && this.config.enableDebug) {
              console.log(
                `[MusicSyncService] Pruned ${prunedCount} expired cache entries`
              );
            }
            const maxSize = MUSIC_SYNC_CONFIG.performance.cacheSize;
            if (this.unifiedCache.size > maxSize) {
              const keysToDelete = Array.from(this.unifiedCache.keys()).slice(
                0,
                this.unifiedCache.size - maxSize
              );
              keysToDelete.forEach((key) => this.unifiedCache.delete(key));
              if (this.config.enableDebug) {
                console.log(
                  `[MusicSyncService] Evicted ${keysToDelete.length} cache entries to maintain size`
                );
              }
            }
          }, 6e4);
        }
        // === PERFORMANCE MONITORING ===
        setupPerformanceMonitoring() {
          if (this.performanceInterval) clearInterval(this.performanceInterval);
          this.performanceInterval = setInterval(() => {
            if (
              this.metrics.avgProcessingTime >
              this.config.performance.processingTimeTarget
            ) {
              if (this.config.enableDebug) {
                console.warn(
                  `[MusicSyncService] Performance warning: Avg processing time ${this.metrics.avgProcessingTime}ms exceeds target ${this.config.performance.processingTimeTarget}ms`
                );
              }
            }
          }, 3e4);
        }
        trackPerformance(startTime) {
          if (!this.config.performance.enableMetrics) return;
          const duration = performance.now() - startTime;
          this.metrics.performance.push(duration);
          if (this.metrics.performance.length > 100) {
            this.metrics.performance.shift();
          }
          this.metrics.avgProcessingTime =
            this.metrics.performance.reduce((a, b) => a + b, 0) /
            this.metrics.performance.length;
        }
        // === USER PREFERENCES ===
        loadUserPreferences() {
          try {
            const stored = Spicetify.LocalStorage.get("music-sync-preferences");
            return stored ? JSON.parse(stored) : {};
          } catch (error) {
            if (this.config.enableDebug) {
              console.warn(
                "[MusicSyncService] Could not load user preferences:",
                error
              );
            }
            return {};
          }
        }
        saveUserPreferences() {
          try {
            Spicetify.LocalStorage.set(
              "music-sync-preferences",
              JSON.stringify(this.userPreferences)
            );
          } catch (error) {
            if (this.config.enableDebug) {
              console.warn(
                "[MusicSyncService] Could not save user preferences:",
                error
              );
            }
          }
        }
        // === PUBLIC API METHODS ===
        getLatestProcessedData() {
          return this.latestProcessedData;
        }
        async getEnhancedBPMForCurrentTrack(options = {}) {
          if (!this.isInitialized) {
            if (this.config.enableDebug) {
              console.warn(
                "[MusicSyncService] Not initialized, cannot get BPM"
              );
            }
            return this.getFallbackBPM();
          }
          const audioData = await this.fetchAudioData();
          if (!audioData) return this.getFallbackBPM();
          return this.calculateEnhancedBPM(audioData, options);
        }
        async calculatePlaybackRate(videoDefaultBPM = 135.48, options = {}) {
          try {
            if (!this.audioData) {
              this.audioData = await this.fetchAudioData();
            }
            if (!this.audioData?.track?.tempo) {
              if (this.config.enableDebug) {
                console.warn(
                  "[MusicSyncService] No BPM data for playback rate, using default 1.0"
                );
              }
              return 1;
            }
            const enhancedBPM = await this.calculateEnhancedBPM(
              this.audioData,
              options
            );
            const playbackRate =
              videoDefaultBPM && videoDefaultBPM !== 0
                ? enhancedBPM / videoDefaultBPM
                : 1;
            const clampedRate = Math.max(0.5, Math.min(2, playbackRate));
            if (this.config.enableDebug) {
              console.log(
                `[MusicSyncService] Playback rate: ${clampedRate} (BPM: ${enhancedBPM}/${videoDefaultBPM})`
              );
            }
            return clampedRate;
          } catch (error) {
            console.error(
              "[MusicSyncService] Playback rate calculation failed:",
              error
            );
            this.metrics.errors++;
            return 1;
          }
        }
        clearCache() {
          this.unifiedCache.clear();
          if (this.config.enableDebug) {
            console.log("[MusicSyncService] Cache cleared");
          }
        }
        getReport() {
          return {
            isInitialized: this.isInitialized,
            subscriberCount: this.subscribers.size,
            cacheSize: this.unifiedCache.size,
            cacheTTL: this.cacheTTL,
            currentTrackUri: this.currentTrackUri,
            metrics: this.metrics,
            hasLatestData: !!this.latestProcessedData,
          };
        }
        destroy() {
          if (this.config.enableDebug) {
            console.log("[MusicSyncService] Destroying service...");
          }
          try {
            this.isInitialized = false;
            this.subscribers.clear();
            this.unifiedCache.clear();
            if (this.performanceInterval) {
              clearInterval(this.performanceInterval);
              this.performanceInterval = null;
            }
            if (this.cacheCleanupInterval) {
              clearInterval(this.cacheCleanupInterval);
              this.cacheCleanupInterval = null;
            }
            if (this.config.enableDebug) {
              console.log("[MusicSyncService] Destroyed successfully");
            }
          } catch (error) {
            console.error(
              "[MusicSyncService] Error during destruction:",
              error
            );
          }
        }
      };
    },
  });

  // src-js/theme.entry.js
  init_globalConfig();

  // src-js/core/year3000System.js
  init_globalConfig();

  // src-js/debug/PerformanceMonitor.js
  var PerformanceMonitor = class {
    constructor() {
      this.metrics = {
        colorExtractionTime: [],
        memoryUsage: [],
        // This seems aspirational in the original, detectMemoryPressure uses performance.memory
        frameRate: [],
        // This also seems aspirational, not directly calculated in the provided snippet
      };
      this.lastFrameTime = performance.now();
      this.frameCount = 0;
    }
    startTiming(operation) {
      return performance.now();
    }
    endTiming(operation, startTime) {
      const duration = performance.now() - startTime;
      if (this.metrics[operation]) {
        this.metrics[operation].push(duration);
        if (this.metrics[operation].length > 10) {
          this.metrics[operation].shift();
        }
      }
      return duration;
    }
    getAverageTime(operation) {
      const times = this.metrics[operation] || [];
      return times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
    }
    logMetrics() {
      console.log("StarryNight Performance Metrics:", {
        avgColorExtraction: `${this.getAverageTime(
          "colorExtractionTime"
        ).toFixed(2)}ms`,
        memoryPressure: this.detectMemoryPressure(),
        // avgFrameRate: this.getAverageTime("frameRate").toFixed(2) + "fps", // If frameRate was tracked
      });
    }
    detectMemoryPressure() {
      if (performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        return used / total > 0.8 ? "high" : "normal";
      }
      return "unknown";
    }
    shouldReduceQuality() {
      return (
        this.getAverageTime("colorExtractionTime") > 300 || // Example threshold
        this.detectMemoryPressure() === "high"
      );
    }
  };

  // src-js/effects/starryNightEffects.js
  var starryNightEffects_exports = {};
  __export(starryNightEffects_exports, {
    applyStarryNightSettings: () => applyStarryNightSettings,
    createShootingStar: () => createShootingStar,
    injectStarContainer: () => injectStarContainer,
    startShootingStars: () => startShootingStars,
  });
  init_globalConfig();
  function injectStarContainer() {
    const existingContainer = document.querySelector(".sn-stars-container");
    if (existingContainer) {
      return existingContainer;
    }
    const starContainer = document.createElement("div");
    starContainer.className = "sn-stars-container";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("div");
      star.className = "star";
      if (Math.random() > 0.7) star.classList.add("twinkle");
      starContainer.appendChild(star);
    }
    document.body.appendChild(starContainer);
    return starContainer;
  }
  function createShootingStar() {
    const shootingStar = document.createElement("div");
    shootingStar.className = "shootingstar";
    shootingStar.style.left = Math.random() * window.innerWidth + "px";
    shootingStar.style.top = "-10px";
    document.body.appendChild(shootingStar);
    setTimeout(() => {
      if (shootingStar.parentNode) {
        shootingStar.parentNode.removeChild(shootingStar);
      }
    }, 3e3);
  }
  function startShootingStars() {
    return setInterval(() => {
      const starSetting = localStorage.getItem("sn-starDensity") ?? "balanced";
      if (starSetting !== "disabled" && Math.random() < 0.3) {
        createShootingStar();
      }
    }, 5e3 + Math.random() * 1e4);
  }
  function applyStarryNightSettings(gradientIntensity, starDensity) {
    if (YEAR3000_CONFIG.enableDebug) {
      console.log(
        "[StarryNightEffects] applyStarryNightSettings CALLED with:",
        {
          gradientIntensity,
          starDensity,
        }
      );
    }
    const body = document.body;
    const configGradient =
      YEAR3000_CONFIG?.settings?.["sn-gradientIntensity"]?.options?.find(
        (o) => o.default
      )?.value || "balanced";
    const configStars =
      YEAR3000_CONFIG?.settings?.["sn-starDensity"]?.options?.find(
        (o) => o.default
      )?.value || "balanced";
    const currentGradient = gradientIntensity || configGradient;
    const currentStars = starDensity || configStars;
    const gradientClasses = [
      "sn-gradient-disabled",
      "sn-gradient-minimal",
      "sn-gradient-balanced",
      "sn-gradient-intense",
    ];
    const starClasses = [
      "sn-stars-disabled",
      "sn-stars-minimal",
      "sn-stars-balanced",
      "sn-stars-intense",
    ];
    body.classList.remove(...gradientClasses, ...starClasses);
    if (currentGradient !== "balanced") {
      body.classList.add(`sn-gradient-${currentGradient}`);
    }
    if (currentStars !== "balanced") {
      body.classList.add(`sn-stars-${currentStars}`);
    }
    if (YEAR3000_CONFIG.enableDebug) {
      console.log(
        "[StarryNightEffects] Body classes FINAL (gradient/star):",
        body.className
      );
    }
    const existingContainer = document.querySelector(".sn-stars-container");
    if (currentStars === "disabled") {
      if (existingContainer) existingContainer.remove();
    } else {
      if (!existingContainer) injectStarContainer();
    }
  }

  // src-js/managers/Card3DManager.js
  init_Year3000Utilities();
  var Card3DManager = class {
    constructor(performanceMonitor, settingsManager) {
      this.performanceMonitor = performanceMonitor;
      this.settingsManager = settingsManager;
      this.isSupported = this.detect3DSupport();
      this.currentMode = "balanced";
      this.mouseTrackingEnabled = true;
      this.activeCards = /* @__PURE__ */ new Set();
      this.lastFrameTime = 0;
      this.frameThrottle = 16;
      this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
    }
    detect3DSupport() {
      try {
        const testElement = document.createElement("div");
        testElement.style.transform = "perspective(1px) rotateX(1deg)";
        return testElement.style.transform !== "";
      } catch (error) {
        return false;
      }
    }
    initialize() {
      if (!this.isSupported) {
        return;
      }
      const initialMode = this.settingsManager.get(
        "sn-3dMorphingMode",
        "balanced"
      );
      this.apply3DMode(initialMode);
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
    }
    _internalSetup() {
      this.setupMouseTracking();
      this.setupCardObserver();
      this.setupPerformanceMonitoring();
    }
    _internalDestroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      if (this.performanceInterval) {
        clearInterval(this.performanceInterval);
        this.performanceInterval = null;
      }
      this.activeCards.forEach((cardData) => {
        if (cardData.element) {
          cardData.element.removeEventListener(
            "mouseenter",
            cardData.mouseEnterHandler
          );
          cardData.element.removeEventListener(
            "mousemove",
            cardData.mouseMoveHandler
          );
          cardData.element.removeEventListener(
            "mouseleave",
            cardData.mouseLeaveHandler
          );
        }
      });
      this.activeCards.clear();
      document.body.classList.remove("sn-performance-mode");
      const modes = [
        "disabled",
        "minimal",
        "balanced",
        "floating",
        "intense",
        "dynamic",
      ];
      modes.forEach((m) => document.body.classList.remove(`sn-3d-${m}`));
    }
    setupMouseTracking() {}
    setupCardObserver() {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches(".main-card-card")) {
                this.enhanceCard(node);
              }
              const cards =
                node.querySelectorAll &&
                node.querySelectorAll(".main-card-card");
              if (cards) {
                cards.forEach((card) => this.enhanceCard(card));
              }
            }
          });
        });
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
      document
        .querySelectorAll(".main-card-card")
        .forEach((card) => this.enhanceCard(card));
    }
    enhanceCard(cardElement) {
      if (this.activeCards.has(cardElement) || !this.isSupported) return;
      const cardData = {
        element: cardElement,
        mouseEnterHandler: (event) =>
          this.handleCardMouseEnter(event, cardElement),
        mouseMoveHandler: Year3000Utilities.throttle(
          (event) => this.handleCardMouseMove(event, cardElement),
          this.frameThrottle
        ),
        // Throttle per-card mouse move
        mouseLeaveHandler: (event) =>
          this.handleCardMouseLeave(event, cardElement),
      };
      this.activeCards.add(cardElement);
      cardElement.addEventListener("mouseenter", cardData.mouseEnterHandler);
      cardElement.addEventListener("mousemove", cardData.mouseMoveHandler);
      cardElement.addEventListener("mouseleave", cardData.mouseLeaveHandler);
    }
    handleCardMouseEnter(event, card) {
      card.style.transformStyle = "preserve-3d";
    }
    handleCardMouseMove(event, card) {
      if (
        !this.mouseTrackingEnabled ||
        this.performanceMonitor.shouldReduceQuality()
      ) {
        return;
      }
      const rect = card.getBoundingClientRect();
      const cardMouseX = event.clientX - rect.left;
      const cardMouseY = event.clientY - rect.top;
      const normalizedX = (cardMouseX / rect.width - 0.5) * 2;
      const normalizedY = (cardMouseY / rect.height - 0.5) * 2;
      const maxRotation =
        this.currentMode === "intense"
          ? 20
          : this.currentMode === "minimal"
          ? 10
          : 15;
      const rotateY = normalizedX * maxRotation;
      const rotateX = -normalizedY * maxRotation;
      card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    }
    handleCardMouseLeave(event, card) {
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
    }
    setupPerformanceMonitoring() {
      if (this.performanceInterval) clearInterval(this.performanceInterval);
      this.performanceInterval = setInterval(() => {
        if (this.performanceMonitor.shouldReduceQuality()) {
          this.enablePerformanceMode(true);
        }
      }, 5e3);
    }
    enablePerformanceMode(enable) {
      if (enable) {
        if (!document.body.classList.contains("sn-performance-mode")) {
          document.body.classList.add("sn-performance-mode");
          this.frameThrottle = 32;
        }
      } else {
        if (document.body.classList.contains("sn-performance-mode")) {
          document.body.classList.remove("sn-performance-mode");
          this.apply3DMode(this.currentMode, true);
        }
      }
    }
    apply3DMode(mode, skipSetup = false) {
      const body = document.body;
      const modes = [
        "disabled",
        "minimal",
        "balanced",
        "floating",
        "intense",
        "dynamic",
      ];
      modes.forEach((m) => body.classList.remove(`sn-3d-${m}`));
      if (mode && mode !== "default") {
        body.classList.add(`sn-3d-${mode}`);
      }
      this.currentMode = mode;
      if (mode === "disabled") {
        if (!skipSetup) this._internalDestroy();
        this.mouseTrackingEnabled = false;
        return;
      }
      if (!skipSetup) {
        this._internalDestroy();
        this._internalSetup();
      }
      this.mouseTrackingEnabled = true;
      switch (mode) {
        case "minimal":
          this.frameThrottle = 32;
          break;
        case "intense":
          this.frameThrottle = 8;
          break;
        case "floating":
        case "dynamic":
          this.frameThrottle = 16;
          break;
        case "balanced":
        default:
          this.frameThrottle = 16;
          break;
      }
    }
    getCurrentSettings() {
      return {
        mode: this.currentMode,
        isSupported: this.isSupported,
        mouseTrackingEnabled: this.mouseTrackingEnabled,
        performanceModeActive: document.body.classList.contains(
          "sn-performance-mode"
        ),
      };
    }
    destroy() {
      if (this.isSupported) {
        this._internalDestroy();
      }
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
    }
    handleSettingsChange(event) {
      if (event.detail.key === "sn-3dMorphingMode") {
        const enableDebug = globalThis.YEAR3000_CONFIG?.enableDebug;
        if (enableDebug) {
          console.log(
            `[Card3DManager] Detected setting change for ${event.detail.key}. New value: ${event.detail.value}`
          );
        }
        this.apply3DMode(event.detail.value);
      }
    }
  };

  // src-js/managers/GlassmorphismManager.js
  var GlassmorphismManager = class {
    constructor(performanceMonitor, settingsManager) {
      this.performanceMonitor = performanceMonitor;
      this.settingsManager = settingsManager;
      this.isSupported = this.detectBackdropFilterSupport();
      this.currentIntensity = "balanced";
      this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
    }
    // MODIFIED: Add initialize method
    initialize() {
      const initialIntensity = this.settingsManager.get(
        "sn-glassmorphismIntensity",
        "balanced"
      );
      this.applyGlassmorphismSettings(initialIntensity);
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
    }
    // MODIFIED: Add destroy method
    destroy() {
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
    }
    // MODIFIED: Add settings change handler
    handleSettingsChange(event) {
      if (event.detail.key === "sn-glassmorphismIntensity") {
        this.applyGlassmorphismSettings(event.detail.value);
      }
    }
    detectBackdropFilterSupport() {
      try {
        return (
          CSS.supports("backdrop-filter", "blur(1px)") ||
          CSS.supports("-webkit-backdrop-filter", "blur(1px)")
        );
      } catch (error) {
        console.warn(
          "StarryNight: CSS.supports not available, assuming no backdrop-filter support",
          error
        );
        return false;
      }
    }
    applyGlassmorphismSettings(intensity) {
      const body = document.body;
      body.classList.remove(
        "sn-glass-disabled",
        "sn-glass-minimal",
        "sn-glass-balanced",
        // Added balanced for explicit removal if set by other means
        "sn-glass-intense"
      );
      body.classList.add(`sn-glass-${intensity}`);
      this.currentIntensity = intensity;
      this.updateGlassVariables(intensity);
    }
    updateGlassVariables(intensity) {
      const root = document.documentElement;
      const shouldReduceQuality = this.performanceMonitor.shouldReduceQuality();
      let blurValue, opacityValue, saturationValue;
      switch (intensity) {
        case "disabled":
          root.style.removeProperty("--glass-blur");
          root.style.removeProperty("--glass-opacity");
          root.style.removeProperty("--glass-saturation");
          return;
        case "minimal":
          blurValue = shouldReduceQuality ? "8px" : "10px";
          opacityValue = "0.05";
          saturationValue = "1.05";
          break;
        case "intense":
          blurValue = shouldReduceQuality ? "20px" : "30px";
          opacityValue = "0.15";
          saturationValue = "1.4";
          break;
        case "balanced":
        default:
          blurValue = shouldReduceQuality ? "15px" : "20px";
          opacityValue = "0.1";
          saturationValue = "1.2";
          break;
      }
      root.style.setProperty("--glass-blur", blurValue);
      root.style.setProperty("--glass-opacity", opacityValue);
      root.style.setProperty("--glass-saturation", saturationValue);
      if (window.innerWidth <= 768) {
        const mobileBlur = parseInt(blurValue) * 0.75 + "px";
        const mobileOpacity = parseFloat(opacityValue) * 0.8;
        root.style.setProperty("--glass-blur", mobileBlur);
        root.style.setProperty("--glass-opacity", mobileOpacity.toString());
      }
    }
    updateGlassColors(primaryColor, secondaryColor) {
      if (!this.isSupported || this.currentIntensity === "disabled") {
        return;
      }
      const root = document.documentElement;
      const glassPrimary = this.convertToGlassColor(primaryColor, 0.1);
      const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);
      root.style.setProperty("--glass-background", glassPrimary);
      root.style.setProperty("--glass-border", glassSecondary);
    }
    convertToGlassColor(color, opacity) {
      try {
        if (typeof color !== "string") {
          return `rgba(255, 255, 255, ${opacity})`;
        }
        if (color.startsWith("rgb(")) {
          const values = color.match(/\d+/g);
          if (values && values.length >= 3) {
            return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
          }
        }
        if (color.startsWith("#")) {
          const hex = color.slice(1);
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
          }
        }
        return `rgba(255, 255, 255, ${opacity})`;
      } catch (error) {
        return `rgba(255, 255, 255, ${opacity})`;
      }
    }
    checkPerformanceAndAdjust() {
      const shouldReduce = this.performanceMonitor.shouldReduceQuality();
      if (shouldReduce && this.currentIntensity === "intense") {
        this.applyGlassmorphismSettings("balanced");
        return true;
      }
      return false;
    }
    getCurrentSettings() {
      return {
        intensity: this.currentIntensity,
        isSupported: this.isSupported,
        // Check if performanceMonitor is available before calling its method
        performanceReduced: this.performanceMonitor
          ? this.performanceMonitor.shouldReduceQuality()
          : false,
      };
    }
  };

  // src-js/managers/SettingsManager.js
  init_globalConfig();
  var SettingsManager = class {
    constructor(config, harmonicModes, utils) {
      this.config = config || YEAR3000_CONFIG;
      this.harmonicModes = harmonicModes || HARMONIC_MODES;
      this.utils = utils;
      this.settingsKey = "catppuccinStarryNightSettings";
      this.defaults = {
        "catppuccin-accentColor": "mauve",
        "sn-gradientIntensity": "balanced",
        "sn-starDensity": "balanced",
        "sn-performanceQuality": "auto",
        "sn-glassmorphismIntensity": "moderate",
        "sn-3dMorphingMode": "dynamic",
        "sn-artisticMode": "artist-vision",
        // NEW: Harmonic Defaults
        "sn-currentHarmonicMode": "analogous-flow",
        "sn-harmonicIntensity": "0.7",
        // Stored as string, parsed to float later
        "sn-harmonicEvolution": "true",
        // Stored as string, parsed to boolean later
        "sn-harmonicManualBaseColor": "",
        // NEW: Empty string means auto/album art
      };
      this.validationSchemas = {
        "catppuccin-accentColor": {
          default: "mauve",
          allowedValues: [
            "rosewater",
            "flamingo",
            "pink",
            "mauve",
            "red",
            "maroon",
            "peach",
            "yellow",
            "green",
            "teal",
            "sky",
            "sapphire",
            "blue",
            "lavender",
            "text",
            "none",
          ],
        },
        "sn-gradientIntensity": {
          default: "balanced",
          allowedValues: ["disabled", "minimal", "balanced", "intense"],
        },
        "sn-starDensity": {
          default: "balanced",
          allowedValues: ["disabled", "minimal", "balanced", "intense"],
        },
        "sn-performanceQuality": {
          default: "auto",
          allowedValues: ["auto", "optimized", "high-fidelity"],
        },
        "sn-glassmorphismIntensity": {
          default: "moderate",
          allowedValues: ["disabled", "minimal", "moderate", "intense"],
        },
        "sn-3dMorphingMode": {
          default: "dynamic",
          allowedValues: [
            "disabled",
            "minimal",
            "balanced",
            "floating",
            "intense",
            "dynamic",
          ],
        },
        "sn-artisticMode": {
          default: "artist-vision",
          // Use ARTISTIC_MODE_PROFILES for dynamic allowed values
          allowedValues: Object.keys(ARTISTIC_MODE_PROFILES),
        },
        // NEW: Harmonic Validation Schemas
        "sn-currentHarmonicMode": {
          default: "analogous-flow",
          allowedValues: Object.keys(this.harmonicModes),
          // Dynamically get allowed modes
        },
        "sn-harmonicIntensity": {
          default: "0.7",
          // For sliders, we validate range/type upon retrieval/use.
        },
        "sn-harmonicEvolution": {
          default: "true",
          allowedValues: ["true", "false"],
        },
        // NEW: Manual Base Color Validation
        "sn-harmonicManualBaseColor": {
          default: "",
          // Empty string for auto
          // Validation will be primarily by regex on input, here we just define it exists
          // Allowed values could be a regex, but for simplicity, direct validation on set/get is better.
        },
      };
      Object.keys(this.defaults).forEach((key) => {
        if (this.validationSchemas[key]) {
          if (this.validationSchemas[key].default !== this.defaults[key]) {
            console.warn(
              `StarryNight: SettingsManager constructor: Default for '${key}' mismatch. Schema: '${this.validationSchemas[key].default}', Defaults: '${this.defaults[key]}'. Using schema default.`
            );
            this.defaults[key] = this.validationSchemas[key].default;
          }
        } else {
          console.warn(
            `StarryNight: SettingsManager constructor: No validationSchema for default setting '${key}'.`
          );
        }
      });
      this.settings = this.loadSettings();
      this.validateAndRepair();
    }
    loadSettings() {
      const loadedSettings = {};
      Object.keys(this.validationSchemas).forEach((key) => {
        loadedSettings[key] = this.get(key);
      });
      if (this.config.enableDebug) {
        console.log(
          "[StarryNight SettingsManager] All settings loaded into memory cache (this.settings)."
        );
      }
      return loadedSettings;
    }
    get(key) {
      try {
        const value = Spicetify.LocalStorage.get(key);
        const schema = this.validationSchemas[key];
        if (!schema) {
          console.warn(
            `StarryNight: No validation schema for key: ${key}. Returning raw value or null.`
          );
          return value;
        }
        if (
          value === null ||
          (schema.allowedValues && !schema.allowedValues.includes(value))
        ) {
          if (value !== null && this.config.enableDebug) {
            console.warn(
              `StarryNight: Invalid or missing value '${value}' for ${key}, using default '${schema.default}'`
            );
          }
          return schema.default;
        }
        return value;
      } catch (error) {
        console.error(
          `StarryNight: Error reading localStorage key ${key}:`,
          error,
          `Using default '${this.validationSchemas[key]?.default}'.`
        );
        return this.validationSchemas[key]?.default || null;
      }
    }
    set(key, value, skipSave = false) {
      try {
        const schema = this.validationSchemas[key];
        if (!schema) {
          console.warn(
            `StarryNight: No validation schema for key: ${key}. Setting raw value.`
          );
          Spicetify.LocalStorage.set(key, value);
          return true;
        }
        if (key === "sn-harmonicManualBaseColor") {
          if (
            value !== "" &&
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
          ) {
            console.error(
              `StarryNight: Invalid hex color '${value}' for ${key}. Setting to default (empty string).`
            );
            Spicetify.LocalStorage.set(key, schema.default);
            return false;
          }
        } else if (
          schema.allowedValues &&
          !schema.allowedValues.includes(value)
        ) {
          console.error(
            `StarryNight: Cannot set invalid value '${value}' for ${key}. Allowed: ${schema.allowedValues.join(
              ", "
            )}.`
          );
          return false;
        }
        Spicetify.LocalStorage.set(key, value);
        if (this.config.enableDebug) {
        }
        document.dispatchEvent(
          new CustomEvent("year3000SystemSettingsChanged", {
            detail: { key, value },
          })
        );
        return true;
      } catch (error) {
        console.error(
          `StarryNight: Error setting localStorage key ${key}:`,
          error
        );
        return false;
      }
    }
    getAllSettings() {
      const settings = {};
      Object.keys(this.validationSchemas).forEach((key) => {
        settings[key] = this.get(key);
      });
      return settings;
    }
    validateAndRepair() {
      let repairedCount = 0;
      Object.keys(this.validationSchemas).forEach((key) => {
        const currentValue = Spicetify.LocalStorage.get(key);
        const validatedValue = this.get(key);
        if (currentValue !== validatedValue) {
          this.set(key, validatedValue);
          if (currentValue !== null) {
            if (this.config.enableDebug) {
              console.log(
                `StarryNight: Repaired setting for '${key}'. Was '${currentValue}', set to '${validatedValue}'.`
              );
            }
            repairedCount++;
          }
        }
      });
      if (repairedCount > 0 && this.config.enableDebug) {
        console.log(
          `StarryNight: Repaired ${repairedCount} invalid settings in total.`
        );
      }
      return repairedCount;
    }
    resetAllToDefaults() {
      if (this.config.enableDebug) {
        console.log(
          "[StarryNight SettingsManager] Resetting all settings to their defaults."
        );
      }
      let resetCount = 0;
      Object.keys(this.validationSchemas).forEach((key) => {
        const schema = this.validationSchemas[key];
        if (schema && typeof schema.default !== "undefined") {
          const oldValue = Spicetify.LocalStorage.get(key);
          if (oldValue !== schema.default) {
            this.set(key, schema.default);
            if (this.config.enableDebug) {
              console.log(
                `[StarryNight SettingsManager] Reset '${key}' from '${oldValue}' to default '${schema.default}'.`
              );
            }
            resetCount++;
          }
        }
      });
      if (this.config.enableDebug) {
        console.log(
          `[StarryNight SettingsManager] Reset ${resetCount} settings to default values.`
        );
      }
    }
  };

  // src-js/core/year3000System.js
  init_ColorHarmonyEngine();

  // src-js/systems/visual/BeatSyncVisualSystem.js
  init_Year3000Utilities();
  init_BaseVisualSystem();
  var BeatSyncVisualSystem = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager
      );
      this.year3000System = year3000System;
      this.beatFlashElement = null;
      this.animationFrameId = null;
      this.lastBeatTime = 0;
      this.beatIntensity = 0;
      this.currentBPM = 120;
      this.enhancedBPM = 120;
      this.beatInterval = 6e4 / 120;
      this.nextBeatTime = 0;
      this.beatTimer = null;
      this.trackStartTime = Date.now();
      this.isSyncActive = false;
      this.beatCount = 0;
      this.currentRhythmPhase = 0;
      this.lastAnimationTime = performance.now();
      this.performanceMetrics = {
        animationUpdates: 0,
        cssVariableUpdates: 0,
        memoryStartTime: performance.now(),
        memoryStartSize: this._getMemoryUsage(),
      };
      this.isAnimating = false;
      this.animationFrameId = null;
      this.lastMemoryUsage = 0;
      this.frameCount = 0;
      this.performanceStartTime = Date.now();
      this.errorCount = 0;
      this._performanceMode = false;
      this._reducedQualityMode = false;
      if (this.utils && this.utils.systemHealthMonitor) {
        this.utils.systemHealthMonitor.registerSystem(
          "BeatSyncVisualSystem",
          this
        );
      }
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("BeatSyncVisualSystem", this);
      }
      if (this.config.enableDebug) {
        console.log(
          `[${this.systemName} Constructor] Initialized with Master Animation Coordinator support.`
        );
      }
    }
    _getMemoryUsage() {
      if (typeof performance !== "undefined" && performance.memory) {
        return performance.memory.usedJSHeapSize || 0;
      }
      return 0;
    }
    async initialize() {
      await super.initialize();
      this._createBeatFlashElement();
      this._startAnimationLoop();
      if (this.config.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and animation loop started.`
        );
      }
    }
    _createBeatFlashElement() {
      this.beatFlashElement = document.createElement("div");
      this.beatFlashElement.id = "sn-beat-flash";
      this.beatFlashElement.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0);
      opacity: 0;
      z-index: 2;
      transition: background-color 150ms ease-out, opacity 250ms ease-out;
    `;
      document.body.appendChild(this.beatFlashElement);
    }
    _startAnimationLoop() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        this.year3000System.registerAnimationSystem(
          "BeatSyncVisualSystem",
          this,
          "critical",
          // Critical priority for music synchronization
          60
          // 60fps target
        );
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Registered with Master Animation Coordinator (critical priority)`
          );
        }
      } else {
        console.warn(
          `[${this.systemName}] Master Animation Coordinator not available, using fallback loop`
        );
        this._startFallbackAnimationLoop();
      }
    }
    _stopAnimationLoop() {
      if (
        this.year3000System &&
        this.year3000System.unregisterAnimationSystem
      ) {
        this.year3000System.unregisterAnimationSystem("BeatSyncVisualSystem");
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Unregistered from Master Animation Coordinator`
          );
        }
      } else {
        if (this.animationFrameId) {
          this._cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      }
    }
    /**
     * PERFORMANCE OPTIMIZATION: New method for Master Animation Coordinator
     * Replaces the self-managed _animationLoop with coordinated updates
     * @param {number} timestamp - Current timestamp from requestAnimationFrame
     * @param {number} deltaTime - Time since last frame
     */
    updateAnimation(timestamp, deltaTime) {
      if (!this.isAnimating || !this.isInitialized) return;
      const frameStart = performance.now();
      this.frameCount++;
      try {
        const currentTime = performance.now();
        const actualDeltaTime = currentTime - this.lastAnimationTime;
        this.lastAnimationTime = currentTime;
        const latestMusicData = this.musicSyncService?.getLatestProcessedData();
        const processedEnergy = latestMusicData?.processedEnergy || 0.5;
        const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1;
        this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
          currentTime,
          animationSpeedFactor
        );
        const breathingScale = Year3000Utilities.calculateBreathingScale(
          this.currentRhythmPhase,
          processedEnergy
        );
        this._updateCSSVariables(
          breathingScale,
          this.currentRhythmPhase,
          actualDeltaTime
        );
        if (this.isSyncActive && this.enhancedBPM > 0) {
          const now = Date.now();
          if (now >= this.nextBeatTime) {
            this._triggerBeat(now);
            this._scheduleNextBeat();
          }
        }
        if (this.beatIntensity > 0 && this.beatFlashElement) {
          this.beatIntensity -= 0.025;
          if (this.beatIntensity < 0) this.beatIntensity = 0;
          const rootStyle = Year3000Utilities.getRootStyle();
          const accentRgb =
            rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
            "140,170,238";
          this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${
            this.beatIntensity * 0.25
          })`;
          this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
        } else if (this.beatFlashElement) {
          this.beatFlashElement.style.opacity = "0";
        }
        this.performanceMetrics.animationUpdates++;
        const frameTime = performance.now() - frameStart;
        this.updatePerformanceMetrics(frameTime);
      } catch (error) {
        this.errorCount++;
        console.warn(`[${this.systemName}] Animation update error:`, error);
        if (this.errorCount > 5) {
          console.warn(
            `[${this.systemName}] High error count, requesting performance mode`
          );
          if (
            this.year3000System &&
            this.year3000System._activatePerformanceMode
          ) {
            this.year3000System._activatePerformanceMode();
          }
        }
      }
    }
    /**
     * Handle performance mode changes from Master Animation Coordinator
     * @param {string} mode - 'performance' or 'quality'
     */
    onPerformanceModeChange(mode) {
      if (mode === "performance") {
        this._performanceMode = true;
        this._reducedQualityMode = true;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Switched to performance mode - reducing quality`
          );
        }
      } else if (mode === "quality") {
        this._performanceMode = false;
        this._reducedQualityMode = false;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Switched to quality mode - full effects`
          );
        }
      }
    }
    /**
     * Fallback animation loop for backwards compatibility
     * Used when Master Animation Coordinator is not available
     */
    _startFallbackAnimationLoop() {
      if (this.animationFrameId) {
        this._cancelAnimationFrame(this.animationFrameId);
      }
      const loop = () => {
        this._animationLoop();
        this.animationFrameId = this._requestAnimationFrame(loop);
      };
      this.animationFrameId = this._requestAnimationFrame(loop);
    }
    _animationLoop() {
      if (!this.isAnimating || !this.isInitialized) return;
      const frameStart = performance.now();
      this.frameCount++;
      try {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastAnimationTime;
        this.lastAnimationTime = currentTime;
        const latestMusicData = this.musicSyncService?.getLatestProcessedData();
        const processedEnergy = latestMusicData?.processedEnergy || 0.5;
        const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1;
        this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
          currentTime,
          animationSpeedFactor
        );
        const breathingScale = Year3000Utilities.calculateBreathingScale(
          this.currentRhythmPhase,
          processedEnergy
        );
        this._updateCSSVariables(
          breathingScale,
          this.currentRhythmPhase,
          deltaTime
        );
        if (this.isSyncActive && this.enhancedBPM > 0) {
          const now = Date.now();
          if (now >= this.nextBeatTime) {
            this._triggerBeat(now);
            this._scheduleNextBeat();
          }
        }
        if (this.beatIntensity > 0 && this.beatFlashElement) {
          this.beatIntensity -= 0.025;
          if (this.beatIntensity < 0) this.beatIntensity = 0;
          const rootStyle = Year3000Utilities.getRootStyle();
          const accentRgb =
            rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
            "140,170,238";
          this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${
            this.beatIntensity * 0.25
          })`;
          this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
        } else if (this.beatFlashElement) {
          this.beatFlashElement.style.opacity = "0";
        }
        this.performanceMetrics.animationUpdates++;
        const frameTime = performance.now() - frameStart;
        this.updatePerformanceMetrics(frameTime);
      } catch (error) {
        this.errorCount++;
        console.warn(`[${this.systemName}] Animation loop error:`, error);
        if (this.errorCount > 5) {
          console.warn(
            `[${this.systemName}] High error count, throttling animations`
          );
          setTimeout(() => {
            if (this.isAnimating) {
              this.animationFrameId = requestAnimationFrame(() =>
                this._animationLoop()
              );
            }
          }, 100);
          return;
        }
      }
    }
    _updateCSSVariables(breathingScale, rhythmPhase, deltaTime) {
      if (deltaTime > 50) return;
      const rootStyle = Year3000Utilities.getRootStyle();
      if (!rootStyle) return;
      try {
        const queueCSSUpdate = (property, value) => {
          if (
            this.year3000System &&
            this.year3000System.queueCSSVariableUpdate
          ) {
            this.year3000System.queueCSSVariableUpdate(property, value);
          } else {
            rootStyle.style.setProperty(property, value);
          }
        };
        const clampedBreathingScale = Math.max(
          0.97,
          Math.min(1.02, breathingScale)
        );
        queueCSSUpdate(
          "--sn-breathing-scale",
          clampedBreathingScale.toFixed(4)
        );
        const normalizedPhase = rhythmPhase % (Math.PI * 2);
        queueCSSUpdate("--sn-rhythm-phase", normalizedPhase.toFixed(4));
        this.performanceMetrics.cssVariableUpdates++;
        if (this.config.enableDebug && Math.random() < 5e-3) {
          console.log(
            `\u{1F30A} [${
              this.systemName
            }] Breathing: ${clampedBreathingScale.toFixed(
              3
            )}, Phase: ${normalizedPhase.toFixed(
              3
            )}, Delta: ${deltaTime.toFixed(1)}ms`
          );
        }
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            `[${this.systemName}] CSS variable update failed:`,
            error
          );
        }
      }
    }
    getPerformanceReport() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - this.performanceMetrics.memoryStartTime;
      const currentMemory = this._getMemoryUsage();
      const memoryIncrease = Math.max(
        0,
        currentMemory - this.performanceMetrics.memoryStartSize
      );
      return {
        systemName: this.systemName,
        elapsedTime: elapsedTime.toFixed(1),
        animationUpdatesPerSecond: (
          this.performanceMetrics.animationUpdates /
          (elapsedTime / 1e3)
        ).toFixed(1),
        cssUpdatesPerSecond: (
          this.performanceMetrics.cssVariableUpdates /
          (elapsedTime / 1e3)
        ).toFixed(1),
        memoryIncreaseKB: (memoryIncrease / 1024).toFixed(1),
        currentRhythmPhase: this.currentRhythmPhase.toFixed(3),
        isSyncActive: this.isSyncActive,
      };
    }
    // NEW: Enhanced BPM-based beat synchronization (inspired by Cat Jam)
    _triggerBeat(timestamp) {
      if (!this.isInitialized) return;
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const energy = latestMusicData?.energy || 0.5;
      const visualIntensity = latestMusicData?.visualIntensity || 0.5;
      this.onBeatDetected(timestamp, energy, visualIntensity);
    }
    _scheduleNextBeat() {
      this.beatInterval = 6e4 / this.enhancedBPM;
      this.nextBeatTime += this.beatInterval;
    }
    _startBeatSync(bpm) {
      this.enhancedBPM = bpm;
      this.beatInterval = 6e4 / bpm;
      this.trackStartTime = Date.now();
      this.nextBeatTime = this.trackStartTime + this.beatInterval;
      this.beatCount = 0;
      this.isSyncActive = true;
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3B5} [${
            this.systemName
          }] Beat sync started - Enhanced BPM: ${bpm}, Interval: ${this.beatInterval.toFixed(
            1
          )}ms`
        );
      }
    }
    _stopBeatSync() {
      this.isSyncActive = false;
      if (this.beatTimer) {
        clearTimeout(this.beatTimer);
        this.beatTimer = null;
      }
      if (this.config.enableDebug) {
        console.log(`\u{1F6D1} [${this.systemName}] Beat sync stopped`);
      }
    }
    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      super.updateFromMusicAnalysis(processedMusicData);
      const {
        enhancedBPM,
        baseBPM,
        bpmCalculationMethod,
        energy,
        visualIntensity,
      } = processedMusicData;
      if (enhancedBPM && enhancedBPM !== this.enhancedBPM) {
        if (this.config.enableDebug) {
          console.log(
            `\u{1F3B5} [${this.systemName}] BPM updated: ${baseBPM} \u2192 ${enhancedBPM} (method: ${bpmCalculationMethod})`
          );
        }
        this._startBeatSync(enhancedBPM);
      }
      if (processedMusicData.beatOccurred) {
        this.onBeatDetected(performance.now(), energy, visualIntensity);
      }
    }
    onBeatDetected(currentTime, energy, visualIntensity) {
      this.lastBeatTime = currentTime;
      this.beatIntensity = Math.min(
        1,
        this.beatIntensity + (energy * 0.5 + visualIntensity * 0.5)
      );
      if (this.config.enableDebug && Math.random() < 0.2) {
        console.log(
          `[${this.systemName}] Beat detected. Energy: ${energy.toFixed(
            2
          )}, Visual Intensity: ${visualIntensity.toFixed(
            2
          )}. New beatIntensity: ${this.beatIntensity.toFixed(2)}`
        );
      }
    }
    destroy() {
      this._stopBeatSync();
      this._stopAnimationLoop();
      const rootStyle = Year3000Utilities.getRootStyle();
      if (rootStyle) {
        rootStyle.style.setProperty("--sn-breathing-scale", "1");
        rootStyle.style.setProperty("--sn-rhythm-phase", "0");
      }
      if (this.beatFlashElement && this.beatFlashElement.parentElement) {
        this.beatFlashElement.parentElement.removeChild(this.beatFlashElement);
        this.beatFlashElement = null;
      }
      if (this.config.enableDebug) {
        const report = this.getPerformanceReport();
        console.log(`[${this.systemName}] Performance Report:`, report);
        console.log(`[${this.systemName}] Destroyed.`);
      }
      super.destroy();
    }
    // ENHANCED: Handle music data updates with realistic BPM calculation
    handleMusicDataUpdate(musicData) {
      if (!musicData || !this.isActive) return;
      const newBPM =
        musicData.enhancedBPM || musicData.baseBPM || musicData.tempo || 120;
      const method = musicData.bpmCalculationMethod || "basic";
      const multiplier = musicData.bpmMultiplier || 1;
      this.currentEnergy = musicData.estimatedEnergy || musicData.energy || 0.5;
      if (newBPM !== this.currentBPM) {
        this.currentBPM = newBPM;
        this.beatInterval = this.utils.bpmToInterval(newBPM);
        this.lastBeatTime = performance.now();
        this.beatCount = 0;
        if (this.config.enableDebug) {
          console.log(
            `\u{1F3B5} [BeatSyncVisualSystem] BPM updated: ${
              musicData.baseBPM || musicData.tempo
            } \u2192 ${newBPM} (method: ${method}, mult: ${multiplier.toFixed(
              2
            )})`
          );
        }
      }
      if (musicData.beats && musicData.beats.length > 0) {
        this.usePreciseBeatTiming(musicData.beats);
      }
      if (musicData.estimatedDanceability !== void 0) {
        this.danceabilityFactor = musicData.estimatedDanceability;
      }
      this.updateVisualIntensity();
    }
    // NEW: Use precise beat timing from audio analysis if available
    usePreciseBeatTiming(beats) {
      if (!beats || beats.length === 0) return;
      const intervals = [];
      for (let i = 1; i < Math.min(beats.length, 20); i++) {
        intervals.push(beats[i].start - beats[i - 1].start);
      }
      if (intervals.length > 0) {
        const avgInterval =
          intervals.reduce((a, b) => a + b) / intervals.length;
        const preciseBPM = Math.round(60 / avgInterval);
        if (Math.abs(preciseBPM - this.currentBPM) > 2) {
          this.currentBPM = preciseBPM;
          this.beatInterval = avgInterval * 1e3;
          if (this.config.enableDebug) {
            console.log(
              `\u{1F3B5} [BeatSyncVisualSystem] Using precise beat timing: ${preciseBPM} BPM`
            );
          }
        }
      }
    }
    updatePerformanceMetrics(frameTime) {
      if (this.frameCount % 60 === 0) {
        const memoryUsage = this._getMemoryUsage();
        const animationComplexity = this.calculateAnimationComplexity();
        const healthMonitor = this.utils.getHealthMonitor();
        if (healthMonitor) {
          healthMonitor.updateSystemMetrics("BeatSyncVisualSystem", {
            frameCount: this.frameCount,
            averageFrameTime: frameTime,
            memoryUsage,
            errorCount: this.errorCount,
            animationComplexity,
          });
        }
      }
    }
    calculateAnimationComplexity() {
      let complexity = 0;
      if (this.isAnimating) complexity += 10;
      if (
        this.processedMusicData &&
        this.processedMusicData.visualIntensity > 0.7
      )
        complexity += 20;
      return complexity;
    }
    performCleanup() {
      this.errorCount = Math.max(0, this.errorCount - 1);
      if (this.frameCount > 1e4) {
        this.frameCount = Math.floor(this.frameCount / 2);
      }
    }
    // ===== YEAR 3000 MODE CONFIGURATION =====
    /**
     * Update system configuration based on current artistic mode
     * @param {Object} modeConfig - Configuration from artistic mode profile
     */
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, animations, intensity, harmonicSync } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Updating mode configuration:`,
          modeConfig
        );
      }
      this.modeConfig = {
        systemEnabled: enabled !== false,
        harmonicSyncEnabled: harmonicSync || animations || false,
        oscillateEnabled: animations || false,
        intensityMultiplier: intensity || 1,
        temporalPlayEnabled: modeConfig.temporalPlay || false,
      };
      if (this.modeConfig.harmonicSyncEnabled) {
        this.initializeHarmonicSync();
      } else {
        this.disableHarmonicSync();
      }
      this.updateBeatFlashIntensity();
    }
    // ===== HARMONIC OSCILLATION SYNC SYSTEM =====
    /**
     * Initialize harmonic oscillation sync across all visual systems
     */
    initializeHarmonicSync() {
      if (this.harmonicSyncInitialized) return;
      this.harmonicSync = {
        masterFrequency: 1,
        // Base frequency (1 = BPM/60)
        harmonicLayers: [
          { frequency: 1, phase: 0, amplitude: 1, name: "fundamental" },
          { frequency: 0.5, phase: 0, amplitude: 0.7, name: "sub-harmonic" },
          {
            frequency: 2,
            phase: Math.PI / 4,
            amplitude: 0.5,
            name: "second-harmonic",
          },
          {
            frequency: 0.25,
            phase: Math.PI / 2,
            amplitude: 0.8,
            name: "deep-pulse",
          },
        ],
        subscribedSystems: /* @__PURE__ */ new Set(),
        syncEventChannel: "year3000HarmonicSync",
      };
      this.startHarmonicLoop();
      this.harmonicSyncInitialized = true;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3B5} [${this.systemName}] Harmonic sync initialized with ${this.harmonicSync.harmonicLayers.length} layers`
        );
      }
    }
    /**
     * Disable harmonic sync and cleanup
     */
    disableHarmonicSync() {
      if (!this.harmonicSyncInitialized) return;
      if (this.harmonicLoopId) {
        cancelAnimationFrame(this.harmonicLoopId);
        this.harmonicLoopId = null;
      }
      this.clearHarmonicVariables();
      this.harmonicSync = null;
      this.harmonicSyncInitialized = false;
      if (this.config?.enableDebug) {
        console.log(`\u{1F3B5} [${this.systemName}] Harmonic sync disabled`);
      }
    }
    /**
     * Start the harmonic oscillation calculation loop
     */
    startHarmonicLoop() {
      if (!this.harmonicSync) return;
      const harmonicLoop = (timestamp) => {
        if (!this.harmonicSync || !this.modeConfig?.harmonicSyncEnabled) return;
        this.updateHarmonicFrequencies();
        this.calculateHarmonicValues(timestamp);
        this.dispatchHarmonicSync(timestamp);
        this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
      };
      this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
    }
    /**
     * Update harmonic frequencies based on current BPM and music data
     */
    updateHarmonicFrequencies() {
      if (!this.isInitialized) return;
      const latestMusicData = this.musicSyncService?.getLatestProcessedData?.();
      if (!latestMusicData) return;
      const bpmFrequency = this.enhancedBPM / 60;
      this.harmonicSync.masterFrequency = bpmFrequency;
      const energy = latestMusicData?.processedEnergy || 0.5;
      const valence = latestMusicData?.valence || 0.5;
      this.harmonicSync.harmonicLayers.forEach((layer, index) => {
        switch (layer.name) {
          case "fundamental":
            layer.amplitude = 0.8 + energy * 0.4;
            break;
          case "sub-harmonic":
            layer.amplitude = 0.5 + valence * 0.3;
            break;
          case "second-harmonic":
            layer.amplitude = 0.3 + energy * valence * 0.4;
            break;
          case "deep-pulse":
            layer.amplitude = 0.6 + (1 - valence) * 0.3;
            break;
        }
        layer.amplitude *= this.modeConfig?.intensityMultiplier || 1;
      });
    }
    /**
     * Calculate harmonic values for current timestamp
     * @param {number} timestamp - Current animation timestamp
     */
    calculateHarmonicValues(timestamp) {
      if (!this.harmonicSync) return;
      const timeInSeconds = timestamp / 1e3;
      const harmonicData = {
        timestamp,
        masterFrequency: this.harmonicSync.masterFrequency,
        layers: {},
        composite: {
          oscillation: 0,
          pulse: 0,
          flow: 0,
        },
      };
      this.harmonicSync.harmonicLayers.forEach((layer) => {
        const omega =
          2 * Math.PI * layer.frequency * this.harmonicSync.masterFrequency;
        const value =
          layer.amplitude * Math.sin(omega * timeInSeconds + layer.phase);
        harmonicData.layers[layer.name] = {
          frequency: layer.frequency * this.harmonicSync.masterFrequency,
          amplitude: layer.amplitude,
          value,
          phase: layer.phase,
        };
        switch (layer.name) {
          case "fundamental":
          case "second-harmonic":
            harmonicData.composite.oscillation += value * 0.5;
            break;
          case "sub-harmonic":
          case "deep-pulse":
            harmonicData.composite.pulse += value * 0.3;
            break;
        }
      });
      harmonicData.composite.flow =
        harmonicData.composite.oscillation * 0.6 +
        harmonicData.composite.pulse * 0.4;
      harmonicData.composite.oscillation = Math.max(
        -1,
        Math.min(1, harmonicData.composite.oscillation)
      );
      harmonicData.composite.pulse = Math.max(
        -1,
        Math.min(1, harmonicData.composite.pulse)
      );
      harmonicData.composite.flow = Math.max(
        -1,
        Math.min(1, harmonicData.composite.flow)
      );
      this.currentHarmonicData = harmonicData;
      this.updateHarmonicCSSVariables(harmonicData);
    }
    /**
     * Update CSS variables with harmonic data
     * @param {Object} harmonicData - Current harmonic data
     */
    updateHarmonicCSSVariables(harmonicData) {
      const root = document.documentElement;
      root.style.setProperty(
        "--sn-harmonic-master-freq",
        harmonicData.masterFrequency.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-oscillation",
        harmonicData.composite.oscillation.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-pulse",
        harmonicData.composite.pulse.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-flow",
        harmonicData.composite.flow.toFixed(3)
      );
      Object.entries(harmonicData.layers).forEach(([layerName, layerData]) => {
        root.style.setProperty(
          `--sn-harmonic-${layerName}`,
          layerData.value.toFixed(3)
        );
        root.style.setProperty(
          `--sn-harmonic-${layerName}-freq`,
          layerData.frequency.toFixed(3)
        );
      });
      const scalePulse = 1 + harmonicData.composite.pulse * 0.02;
      const rotationFlow = harmonicData.composite.flow * 0.5;
      const opacityOscillation = 0.8 + harmonicData.composite.oscillation * 0.1;
      root.style.setProperty(
        "--sn-harmonic-scale-pulse",
        scalePulse.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-rotation-flow",
        rotationFlow.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-opacity-oscillation",
        opacityOscillation.toFixed(3)
      );
    }
    /**
     * Dispatch harmonic sync event to other systems
     * @param {number} timestamp - Current timestamp
     */
    dispatchHarmonicSync(timestamp) {
      if (!this.currentHarmonicData) return;
      const syncEvent = new CustomEvent(this.harmonicSync.syncEventChannel, {
        detail: {
          ...this.currentHarmonicData,
          systemName: this.systemName,
          modeConfig: this.modeConfig,
        },
      });
      document.dispatchEvent(syncEvent);
      if (typeof window !== "undefined") {
        window.Year3000HarmonicState = this.currentHarmonicData;
      }
    }
    /**
     * Clear all harmonic CSS variables
     */
    clearHarmonicVariables() {
      const root = document.documentElement;
      const harmonicVars = [
        "--sn-harmonic-master-freq",
        "--sn-harmonic-oscillation",
        "--sn-harmonic-pulse",
        "--sn-harmonic-flow",
        "--sn-harmonic-scale-pulse",
        "--sn-harmonic-rotation-flow",
        "--sn-harmonic-opacity-oscillation",
      ];
      this.harmonicSync?.harmonicLayers?.forEach((layer) => {
        harmonicVars.push(`--sn-harmonic-${layer.name}`);
        harmonicVars.push(`--sn-harmonic-${layer.name}-freq`);
      });
      harmonicVars.forEach((varName) => {
        root.style.removeProperty(varName);
      });
    }
    /**
     * Update beat flash intensity based on current mode
     */
    updateBeatFlashIntensity() {
      if (!this.modeConfig) return;
      this.beatFlashIntensity = {
        base: 0.25 * (this.modeConfig.intensityMultiplier || 1),
        peak: 0.85 * (this.modeConfig.intensityMultiplier || 1),
        enabled:
          this.modeConfig.systemEnabled && this.modeConfig.oscillateEnabled,
      };
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F525} [${this.systemName}] Updated beat flash intensity:`,
          this.beatFlashIntensity
        );
      }
    }
    /**
     * Get current harmonic data for external access
     * @returns {Object|null} - Current harmonic data
     */
    getCurrentHarmonicData() {
      return this.currentHarmonicData || null;
    }
  };

  // src-js/debug/SpotifyDOMSelectors.js
  var MODERN_SELECTORS = {
    // Main Layout Structure
    nowPlayingBar: ".Root__now-playing-bar",
    leftSidebar: ".Root__nav-bar",
    mainView: ".Root__main-view",
    rightSidebar: ".Root__right-sidebar",
    // Now Playing Components
    nowPlayingWidget: "[data-testid='now-playing-widget']",
    nowPlayingLeft: ".main-nowPlayingBar-left",
    nowPlayingCenter: ".main-nowPlayingBar-center",
    nowPlayingRight: ".main-nowPlayingBar-right",
    coverArt: ".main-coverSlotCollapsed-container",
    trackInfo: ".main-trackInfo-container",
    // Navigation & Library
    navMain: "nav[aria-label='Main']",
    yourLibrary: ".main-yourLibraryX-libraryContainer",
    libraryItems: ".main-yourLibraryX-listItem",
    libraryHeader: ".main-yourLibraryX-header",
    playlistList: ".main-rootlist-wrapper",
    // Track Lists & Content
    trackListContainer: "[role='grid'][aria-label*='tracks']",
    trackRow: ".main-trackList-trackListRow",
    trackListHeader: ".main-trackList-trackListHeaderRow",
    trackNumber: ".main-trackList-rowSectionIndex",
    trackTitle: ".main-trackList-rowTitle",
    trackArtist: ".main-trackList-rowSubTitle",
    // Entity Headers (Playlist/Album/Artist Pages)
    entityHeader: ".main-entityHeader-container",
    entityTitle: ".main-entityHeader-title",
    entityMetadata: ".main-entityHeader-metaData",
    entityImage: ".main-entityHeader-imageContainer",
    // Action Bar & Controls
    actionBar: ".main-actionBar-ActionBarRow",
    actionBarInner: ".main-actionBar-ActionBar",
    playButton: "[data-testid='play-button']",
    pauseButton: "[data-testid='pause-button']",
    shuffleButton: "[data-testid='shuffle-button']",
    likeButton: ".control-button-heart",
    // Queue & Right Sidebar
    queue: ".main-queue-trackList",
    queueContainer: "[aria-label='Next in queue']",
    aboutArtist: "[aria-label='About the artist']",
    credits: "[aria-label='Credits']",
    // Search & Filtering
    searchInput: "[data-testid='search-input']",
    searchPage: "[data-testid='search-container']",
    filterPills: ".main-genre-chip",
    sortButton: "[data-testid='sort-button']",
    // Cards & Media
    card: ".main-card-card",
    cardImage: ".main-cardImage-image",
    albumArt: ".main-trackList-albumArt",
    // Modal & Overlay
    modal: ".main-modal-container",
    overlay: ".main-overlay-container",
  };
  var SELECTOR_MAPPINGS = {
    // Migration mapping: legacy → modern
    ".main-nowPlayingWidget-nowPlaying": MODERN_SELECTORS.nowPlayingBar,
    ".main-navBar-navBar": MODERN_SELECTORS.leftSidebar,
    ".main-search-searchBar": MODERN_SELECTORS.searchInput,
    ".main-topBar-topBar": MODERN_SELECTORS.actionBar,
    ".main-queue-queue": MODERN_SELECTORS.queue,
    ".main-trackList-trackList": MODERN_SELECTORS.trackListContainer,
  };
  var ORBITAL_ELEMENTS = {
    // Elements that can have orbital gravity effects
    trackRows: MODERN_SELECTORS.trackRow,
    libraryItems: MODERN_SELECTORS.libraryItems,
    cards: MODERN_SELECTORS.card,
    navLinks: ".main-navBar-navBarLink",
    // This one still works
  };
  var GRAVITY_WELL_TARGETS = {
    // Major UI elements that should have gravity wells
    primary: [
      MODERN_SELECTORS.nowPlayingBar,
      MODERN_SELECTORS.leftSidebar,
      MODERN_SELECTORS.entityHeader,
    ],
    secondary: [
      MODERN_SELECTORS.actionBar,
      MODERN_SELECTORS.queue,
      MODERN_SELECTORS.searchInput,
    ],
    tertiary: [MODERN_SELECTORS.playButton, MODERN_SELECTORS.trackListHeader],
  };
  var ANTI_GRAVITY_ZONES = {
    // Areas where anti-gravity effects should be applied
    searchAreas: [MODERN_SELECTORS.searchInput, MODERN_SELECTORS.searchPage],
    notifications: [
      "[data-testid='notification-bar']",
      ".main-topBar-notifications",
    ],
    dropdowns: [".main-dropdown-menu", "[role='menu']", "[role='listbox']"],
  };
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }
  function findElementWithFallback(modernSelector, legacySelector) {
    let element = document.querySelector(modernSelector);
    if (!element && legacySelector) {
      element = document.querySelector(legacySelector);
      if (element) {
        console.warn(
          `\u{1F30C} [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
        );
      }
    }
    return element;
  }
  function findElementsWithFallback(modernSelector, legacySelector) {
    let elements = document.querySelectorAll(modernSelector);
    if (elements.length === 0 && legacySelector) {
      elements = document.querySelectorAll(legacySelector);
      if (elements.length > 0) {
        console.warn(
          `\u{1F30C} [SpotifyDOMSelectors] Using legacy selector: ${legacySelector}. Consider updating to: ${modernSelector}`
        );
      }
    }
    return elements;
  }
  function validateSpotifyDOM() {
    console.group("\u{1F30C} [SpotifyDOMSelectors] DOM Validation");
    const results = {
      found: 0,
      missing: 0,
      details: {},
    };
    Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
      const exists = elementExists(selector);
      results.details[key] = {
        selector,
        exists,
        element: exists ? document.querySelector(selector) : null,
      };
      if (exists) {
        results.found++;
        console.log(`\u2705 ${key}: ${selector}`);
      } else {
        results.missing++;
        console.warn(`\u274C ${key}: ${selector}`);
      }
    });
    console.log(
      `\u{1F4CA} Summary: ${results.found} found, ${results.missing} missing`
    );
    console.groupEnd();
    return results;
  }
  function testGravitySystemSelectors() {
    console.group("\u{1F30C} [Phase 1] Testing Gravity System Selectors");
    console.log("\u{1F3AF} Primary gravity well targets:");
    GRAVITY_WELL_TARGETS.primary.forEach((selector) => {
      const element = document.querySelector(selector);
      console.log(`${element ? "\u2705" : "\u274C"} ${selector}`, element);
    });
    console.log("\u{1F3AF} Secondary gravity well targets:");
    GRAVITY_WELL_TARGETS.secondary.forEach((selector) => {
      const element = document.querySelector(selector);
      console.log(`${element ? "\u2705" : "\u274C"} ${selector}`, element);
    });
    console.log("\u{1F6F8} Orbital elements:");
    Object.entries(ORBITAL_ELEMENTS).forEach(([key, selector]) => {
      const elements = document.querySelectorAll(selector);
      console.log(
        `${elements.length > 0 ? "\u2705" : "\u274C"} ${key} (${selector}): ${
          elements.length
        } found`
      );
    });
    console.groupEnd();
  }
  function validatePredictionTargets() {
    console.group(
      "\u{1F52E} [SpotifyDOMSelectors] Phase 2 - Prediction Target Validation"
    );
    const testSelectors = [
      { name: "Track Rows", selector: ORBITAL_ELEMENTS.trackRows },
      { name: "Progress Bar", selector: MODERN_SELECTORS.progressBar },
      { name: "Play Button", selector: MODERN_SELECTORS.playButton },
      { name: "Heart Button", selector: MODERN_SELECTORS.heartButton },
      { name: "Album Cover", selector: MODERN_SELECTORS.albumCover },
      {
        name: "Now Playing Widget",
        selector: MODERN_SELECTORS.nowPlayingWidget,
      },
      { name: "Now Playing Left", selector: MODERN_SELECTORS.nowPlayingLeft },
      { name: "Left Sidebar", selector: MODERN_SELECTORS.leftSidebar },
      { name: "Library Items", selector: ORBITAL_ELEMENTS.libraryItems },
    ];
    const results = {
      found: 0,
      missing: 0,
      details: {},
    };
    testSelectors.forEach(({ name, selector }) => {
      const elements = findElementsWithFallback(selector);
      const count = elements.length;
      results.details[name] = {
        selector,
        count,
        exists: count > 0,
      };
      if (count > 0) {
        results.found++;
        console.log(`\u2705 ${name}: ${count} elements found (${selector})`);
      } else {
        results.missing++;
        console.warn(`\u274C ${name}: No elements found (${selector})`);
      }
    });
    console.log(
      `\u{1F4CA} Prediction Targets Summary: ${results.found} types found, ${results.missing} missing`
    );
    console.groupEnd();
    return results;
  }
  function testPhase2Systems() {
    console.group(
      "\u{1F30C} [SpotifyDOMSelectors] Phase 2 - System Integration Test"
    );
    const systemTests = {
      behavioralPrediction: validatePredictionTargets(),
      dimensionalNexus: {
        sidebarElement: elementExists(MODERN_SELECTORS.leftSidebar),
      },
      dataGlyph: {
        navLinks: elementExists(MODERN_SELECTORS.navBarLink),
        trackRows: elementExists(ORBITAL_ELEMENTS.trackRows),
        cards: elementExists(ORBITAL_ELEMENTS.cards),
      },
    };
    let totalIssues = 0;
    Object.entries(systemTests).forEach(([system, tests]) => {
      if (typeof tests === "object" && tests.missing) {
        totalIssues += tests.missing;
      }
    });
    console.log(
      `\u{1F3AF} Phase 2 Integration Health: ${
        totalIssues === 0
          ? "\u2705 All systems operational"
          : `\u26A0\uFE0F ${totalIssues} issues detected`
      }`
    );
    console.groupEnd();
    return systemTests;
  }
  if (typeof window !== "undefined") {
    window.SpotifyDOMSelectors = {
      validate: validateSpotifyDOM,
      testGravity: testGravitySystemSelectors,
      validatePredictionTargets,
      testPhase2Systems,
      selectors: MODERN_SELECTORS,
      targets: GRAVITY_WELL_TARGETS,
      orbital: ORBITAL_ELEMENTS,
      antiGravity: ANTI_GRAVITY_ZONES,
    };
    console.log("\u{1F3AF} [SpotifyDOMSelectors] Debug functions available:");
    console.log("  window.SpotifyDOMSelectors.validate() - Test all selectors");
    console.log(
      "  window.SpotifyDOMSelectors.testGravity() - Test gravity selectors"
    );
  }

  // src-js/systems/visual/BehavioralPredictionEngine.js
  init_BaseVisualSystem();
  var BehavioralPredictionEngine = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager,
        year3000System
      );
      this.predictionModel = this.initializePredictionModel();
      this.activeHighlights = /* @__PURE__ */ new WeakMap();
      this.predictionSensitivity = 0.5;
      this.highlightResponsiveness = 0.8;
      this._activeTimers = [];
      this._eventListeners = [];
      this.quantumEmpathy = {
        enabled: false,
        empathyScore: 0.5,
        confidenceThreshold: 0.6,
        learningCurve: 0.8,
        // Core learning systems (KEEP)
        patternDatabase: /* @__PURE__ */ new Map(),
        actionProbabilities: /* @__PURE__ */ new Map(),
        interactionHistory: [],
        maxHistoryLength: 50,
        // Reduced from 100 for performance
        // Performance-optimized settings
        learningThrottleMs: 1e3,
        // Learn patterns every 1 second instead of constantly
        predictionUpdateMs: 500,
        // Update predictions every 500ms instead of 200ms
        maxActiveAnimations: 5,
        // Limit concurrent animations
        // Empathy responsiveness
        maxWarmthIntensity: 0.8,
        currentActiveAnimations: 0,
      };
      this.modeConfig = null;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Optimized Quantum Empathy system initialized.`
        );
      }
    }
    async initialize() {
      await super.initialize();
      if (this.modeConfig?.quantumEmpathyEnabled) {
        this.initializeOptimizedQuantumEmpathy();
      }
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F9E0} [${this.systemName}] Initialized with empathy status: ${
            this.modeConfig?.quantumEmpathyEnabled ? "COSMIC ACTIVE" : "DORMANT"
          }.`
        );
      }
    }
    // ===== OPTIMIZED QUANTUM EMPATHY CORE =====
    /**
     * Initialize performance-optimized quantum empathy
     */
    initializeOptimizedQuantumEmpathy() {
      if (this.quantumEmpathyInitialized) return;
      this.setupOptimizedInteractionTracking();
      this.startOptimizedPredictiveHighlighting();
      this.setupSelectiveAnticipatoryAnimations();
      this.quantumEmpathyInitialized = true;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F31F} [${this.systemName}] Optimized Quantum Empathy online - sensing with cosmic efficiency...`
        );
      }
    }
    /**
     * Setup performance-optimized interaction tracking
     */
    setupOptimizedInteractionTracking() {
      const keyInteractionEvents = ["click", "focus"];
      let lastLearningTime = 0;
      keyInteractionEvents.forEach((eventType) => {
        const handler = (event) => {
          const now = Date.now();
          if (now - lastLearningTime > this.quantumEmpathy.learningThrottleMs) {
            this.recordOptimizedInteraction(event);
            lastLearningTime = now;
          }
        };
        document.addEventListener(eventType, handler, { passive: true });
        this._eventListeners.push({
          element: document,
          event: eventType,
          handler,
        });
      });
    }
    /**
     * Record and analyze user interactions (OPTIMIZED)
     */
    recordOptimizedInteraction(event) {
      if (!this.modeConfig?.quantumEmpathyEnabled) return;
      const interaction = {
        type: event.type,
        target: this.getElementSignature(event.target),
        timestamp: Date.now(),
        context: this.getCurrentMusicContext(),
        // Simplified context
      };
      this.quantumEmpathy.interactionHistory.push(interaction);
      if (
        this.quantumEmpathy.interactionHistory.length >
        this.quantumEmpathy.maxHistoryLength
      ) {
        this.quantumEmpathy.interactionHistory.shift();
      }
      this.learnFromInteractionOptimized(interaction);
    }
    /**
     * Generate a lightweight element signature
     */
    getElementSignature(element) {
      if (!element) return "unknown";
      const signatures = [];
      if (element.className)
        signatures.push(`class:${element.className.split(" ")[0]}`);
      if (element.tagName)
        signatures.push(`tag:${element.tagName.toLowerCase()}`);
      return signatures.join("|") || "anonymous";
    }
    /**
     * Get simplified music context for performance
     */
    getCurrentMusicContext() {
      const latestMusicData =
        this.musicSyncService?.getLatestProcessedData?.() || {};
      return {
        energy: latestMusicData.processedEnergy || 0.5,
        valence: latestMusicData.valence || 0.5,
        timeSegment: Math.floor(/* @__PURE__ */ new Date().getHours() / 6),
        // 4 time segments instead of 24 hours
      };
    }
    /**
     * Optimized pattern learning
     */
    learnFromInteractionOptimized(interaction) {
      const patternKey = `${interaction.target}:${interaction.type}`;
      if (!this.quantumEmpathy.patternDatabase.has(patternKey)) {
        this.quantumEmpathy.patternDatabase.set(patternKey, {
          frequency: 0,
          contexts: [],
          lastUsed: 0,
          confidence: 0.1,
        });
      }
      const pattern = this.quantumEmpathy.patternDatabase.get(patternKey);
      pattern.frequency += 1;
      pattern.lastUsed = Date.now();
      pattern.contexts.push(interaction.context);
      if (pattern.contexts.length > 3) {
        pattern.contexts.shift();
      }
      const recencyFactor = Math.exp(-(Date.now() - pattern.lastUsed) / 6e4);
      pattern.confidence = Math.min(1, (pattern.frequency / 5) * recencyFactor);
      if (this.quantumEmpathy.patternDatabase.size > 100) {
        this.cleanupOldPatterns();
      }
    }
    /**
     * Cleanup old patterns for memory efficiency
     */
    cleanupOldPatterns() {
      const cutoffTime = Date.now() - 3e5;
      for (const [key, pattern] of this.quantumEmpathy.patternDatabase) {
        if (pattern.lastUsed < cutoffTime && pattern.confidence < 0.3) {
          this.quantumEmpathy.patternDatabase.delete(key);
        }
      }
    }
    /**
     * Start optimized predictive highlighting
     */
    startOptimizedPredictiveHighlighting() {
      const interval = setInterval(() => {
        if (!this.modeConfig?.quantumEmpathyEnabled) return;
        this.calculateOptimizedPredictions();
        this.applySelectivePredictiveHighlighting();
      }, this.quantumEmpathy.predictionUpdateMs);
      this._activeTimers.push(interval);
    }
    /**
     * Calculate predictions with performance focus
     */
    calculateOptimizedPredictions() {
      const currentContext = this.getCurrentMusicContext();
      const predictions = [];
      const sortedPatterns = Array.from(
        this.quantumEmpathy.patternDatabase.entries()
      )
        .sort(([, a], [, b]) => b.confidence - a.confidence)
        .slice(0, 10);
      sortedPatterns.forEach(([key, pattern]) => {
        const [target, action] = key.split(":");
        const contextSimilarity = this.calculateSimplifiedContextSimilarity(
          pattern.contexts,
          currentContext
        );
        const probability = pattern.confidence * 0.6 + contextSimilarity * 0.4;
        if (probability > this.quantumEmpathy.confidenceThreshold) {
          predictions.push({
            target,
            action,
            probability,
            confidence: pattern.confidence,
          });
        }
      });
      this.quantumEmpathy.actionProbabilities = new Map(
        predictions.slice(0, 3).map((p) => [`${p.target}:${p.action}`, p])
      );
    }
    /**
     * Simplified context similarity for performance
     */
    calculateSimplifiedContextSimilarity(pastContexts, currentContext) {
      if (!pastContexts.length) return 0;
      const recentContext = pastContexts[pastContexts.length - 1];
      let similarity = 0;
      let factors = 0;
      if (recentContext.energy !== void 0 && currentContext.energy !== void 0) {
        similarity +=
          1 - Math.abs(recentContext.energy - currentContext.energy);
        factors++;
      }
      if (
        recentContext.valence !== void 0 &&
        currentContext.valence !== void 0
      ) {
        similarity +=
          1 - Math.abs(recentContext.valence - currentContext.valence);
        factors++;
      }
      return factors > 0 ? similarity / factors : 0;
    }
    /**
     * Apply selective predictive highlighting
     */
    applySelectivePredictiveHighlighting() {
      if (
        this.quantumEmpathy.currentActiveAnimations >=
        this.quantumEmpathy.maxActiveAnimations
      ) {
        return;
      }
      this.quantumEmpathy.actionProbabilities.forEach((prediction, key) => {
        const elements = this.findElementsBySignature(prediction.target);
        const element = elements[0];
        if (element && prediction.probability > 0.7) {
          this.triggerOptimizedAnticipatoryAnimation(
            element,
            prediction.action,
            prediction.probability
          );
        }
      });
    }
    /**
     * Find elements by signature (optimized)
     */
    findElementsBySignature(signature) {
      if (!signature || signature === "unknown" || signature === "anonymous")
        return [];
      const parts = signature.split("|");
      let selector = "";
      parts.forEach((part) => {
        const [type, value] = part.split(":");
        switch (type) {
          case "class":
            selector += `.${value}`;
            break;
          case "tag":
            selector += value;
            break;
        }
      });
      try {
        return Array.from(document.querySelectorAll(selector)).slice(0, 2);
      } catch (e) {
        return [];
      }
    }
    /**
     * Setup selective anticipatory animations
     */
    setupSelectiveAnticipatoryAnimations() {
      if (this.config?.enableDebug) {
        console.log(
          `\u2728 [${this.systemName}] Selective anticipatory animations ready`
        );
      }
    }
    /**
     * Optimized anticipatory animation
     */
    triggerOptimizedAnticipatoryAnimation(element, actionType, confidence) {
      if (!element || !this.modeConfig?.quantumEmpathyEnabled) return;
      if (
        this.quantumEmpathy.currentActiveAnimations >=
        this.quantumEmpathy.maxActiveAnimations
      ) {
        return;
      }
      const intensity =
        confidence * (this.modeConfig?.intensityMultiplier || 1);
      element.style.setProperty(
        "--sn-anticipatory-intensity",
        intensity.toString()
      );
      element.style.setProperty(
        "--sn-anticipatory-confidence",
        confidence.toString()
      );
      let animationClass = "sn-anticipatory-generic";
      if (actionType === "click") animationClass = "sn-anticipatory-click";
      element.classList.add(animationClass);
      this.quantumEmpathy.currentActiveAnimations++;
      setTimeout(() => {
        element.classList.remove(animationClass);
        element.style.removeProperty("--sn-anticipatory-intensity");
        element.style.removeProperty("--sn-anticipatory-confidence");
        this.quantumEmpathy.currentActiveAnimations--;
      }, 800);
      if (this.config?.enableDebug && Math.random() < 0.2) {
        console.log(
          `\u{1F31F} [${
            this.systemName
          }] Cosmic anticipation: ${actionType} (confidence: ${confidence.toFixed(
            2
          )})`
        );
      }
    }
    // ===== PRESERVED CORE SYSTEMS =====
    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.initialized) return;
      super.updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri);
      const currentContext = {
        ...this.getCurrentMusicContext(),
        trackUri,
        musicData: processedMusicData,
      };
      const predictions = this.generatePredictions(currentContext);
      this.applyHighlights(predictions);
      if (this.modeConfig?.quantumEmpathyEnabled) {
        this.quantumEmpathy.learningCurve =
          0.8 + (processedMusicData.valence || 0.5) * 0.4;
      }
    }
    generatePredictions(context) {
      let predictionKey = "default";
      if (context.energy > 0.6) {
        predictionKey =
          context.valence > 0.5
            ? "highEnergyHighValence"
            : "highEnergyLowValence";
      } else {
        predictionKey =
          context.valence > 0.5
            ? "lowEnergyHighValence"
            : "lowEnergyLowValence";
      }
      const predictedBehavior =
        this.predictionModel[predictionKey] || this.predictionModel.default;
      if (this.config?.enableDebug && Math.random() < 0.05) {
        console.log(
          `\u{1F52E} [${this.systemName}] Context: E=${context.energy.toFixed(
            2
          )}, V=${context.valence.toFixed(2)} \u2192 ${predictionKey}`
        );
      }
      return {
        ...predictedBehavior,
        dynamicIntensity: context.visualIntensity,
      };
    }
    applyHighlights(predictions) {
      if (!predictions || !predictions.targetElements) return;
      let appliedHighlights = 0;
      let missedSelectors = [];
      predictions.targetElements.forEach((selector) => {
        const elements = findElementsWithFallback(selector);
        if (elements.length === 0) {
          missedSelectors.push(selector);
          return;
        }
        appliedHighlights += elements.length;
        elements.forEach((el) => {
          const highlightClass = this.getHighlightClasses(
            predictions.highlightType
          );
          if (this.activeHighlights.has(el)) {
            clearTimeout(this.activeHighlights.get(el).timeoutId);
            (this.activeHighlights.get(el).classes || []).forEach((cls) =>
              el.classList.remove(cls)
            );
          }
          el.classList.add(...highlightClass);
          const timeoutId = setTimeout(() => {
            highlightClass.forEach((cls) => el.classList.remove(cls));
            this.activeHighlights.delete(el);
          }, predictions.duration * (1 / (predictions.dynamicIntensity || 1)));
          this.activeHighlights.set(el, { timeoutId, classes: highlightClass });
        });
      });
      if (
        this.config?.enableDebug &&
        (missedSelectors.length > 0 || appliedHighlights > 0)
      ) {
        console.log(
          `\u{1F31F} [${
            this.systemName
          }] Applied ${appliedHighlights} cosmic highlights. ${
            missedSelectors.length > 0
              ? `Missing elements: ${missedSelectors.join(", ")}`
              : "All elements found!"
          }`
        );
      }
    }
    getHighlightClasses(type) {
      switch (type) {
        case "intense-glow":
          return ["highlight-effect", "highlight-intense-glow"];
        case "vibrant-pulse":
          return ["highlight-effect", "highlight-vibrant-pulse"];
        case "soft-aura":
          return ["highlight-effect", "highlight-soft-aura"];
        case "subtle-sheen":
          return ["highlight-effect", "highlight-subtle-sheen"];
        case "gentle-flow":
          return ["highlight-effect", "highlight-gentle-flow"];
        default:
          return ["highlight-effect"];
      }
    }
    // ===== MODE CONFIGURATION =====
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, quantumEmpathy, intensity } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Updating cosmic mode configuration:`,
          modeConfig
        );
      }
      this.modeConfig = {
        systemEnabled: enabled !== false,
        quantumEmpathyEnabled: quantumEmpathy || false,
        predictiveHighlightingEnabled: quantumEmpathy || false,
        intensityMultiplier: intensity || 1,
      };
      this.updatePredictionBehaviorForMode();
    }
    updatePredictionBehaviorForMode() {
      if (!this.modeConfig) return;
      const baseIntensity = this.modeConfig.intensityMultiplier || 1;
      this.predictionSensitivity = this.modeConfig.quantumEmpathyEnabled
        ? baseIntensity * 1.5
        : baseIntensity * 0.7;
      this.highlightResponsiveness = this.modeConfig
        .predictiveHighlightingEnabled
        ? baseIntensity * 1.2
        : baseIntensity * 0.5;
      if (this.config?.enableDebug) {
        console.log(
          `\u2728 [${this.systemName}] Updated cosmic sensitivity: ${this.predictionSensitivity}, responsiveness: ${this.highlightResponsiveness}`
        );
      }
    }
    destroy() {
      for (const timer of this._activeTimers) {
        clearInterval(timer);
      }
      this._activeTimers.length = 0;
      for (const listener of this._eventListeners) {
        try {
          listener.element.removeEventListener(
            listener.event,
            listener.handler
          );
        } catch (error) {
          console.error(
            `[${this.systemName}] Failed to remove event listener:`,
            error
          );
        }
      }
      this._eventListeners.length = 0;
      this.activeHighlights.forEach((highlight) => {
        clearTimeout(highlight.timeoutId);
      });
      this.activeHighlights.clear();
      super.destroy();
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Cosmic systems powered down and cleaned up.`
        );
      }
    }
    // === TESTING METHODS ===
    testUpdatedSelectors() {
      console.group(`\u{1F52E} [${this.systemName}] Cosmic Selector Testing`);
      const testPredictions = this.initializePredictionModel();
      let totalFound = 0;
      let totalMissed = 0;
      Object.entries(testPredictions).forEach(([mood, prediction]) => {
        console.log(`\u{1F3AD} Testing ${mood} prediction targets:`);
        prediction.targetElements.forEach((selector) => {
          const elements = findElementsWithFallback(selector);
          const count = elements.length;
          if (count > 0) {
            totalFound += count;
            console.log(`  \u2705 ${selector}: ${count} elements`);
          } else {
            totalMissed++;
            console.warn(`  \u274C ${selector}: No elements found`);
          }
        });
      });
      console.log(
        `\u{1F4CA} Cosmic Results: ${totalFound} elements found, ${totalMissed} selectors failed`
      );
      console.groupEnd();
      return { found: totalFound, missed: totalMissed };
    }
    simulateHighlighting() {
      console.log(
        `\u{1F52E} [${this.systemName}] Simulating cosmic behavioral prediction highlighting...`
      );
      const testContext = {
        energy: 0.8,
        valence: 0.7,
        visualIntensity: 0.6,
        moodIdentifier: "energetic",
      };
      const predictions = this.generatePredictions(testContext);
      this.applyHighlights(predictions);
      console.log(
        `\u{1F31F} Cosmic simulation complete - Check for highlights on UI elements!`
      );
    }
    initializePredictionModel() {
      return {
        highEnergyLowValence: {
          targetElements: [
            ORBITAL_ELEMENTS.trackRows,
            MODERN_SELECTORS.progressBar,
          ],
          highlightType: "intense-glow",
          duration: 1500,
        },
        highEnergyHighValence: {
          targetElements: [
            MODERN_SELECTORS.playButton,
            MODERN_SELECTORS.heartButton,
            ORBITAL_ELEMENTS.trackRows + "[aria-current='true']",
          ],
          highlightType: "vibrant-pulse",
          duration: 1e3,
        },
        lowEnergyHighValence: {
          targetElements: [
            MODERN_SELECTORS.albumCover,
            MODERN_SELECTORS.nowPlayingWidget,
          ],
          highlightType: "soft-aura",
          duration: 2500,
        },
        lowEnergyLowValence: {
          targetElements: [
            MODERN_SELECTORS.nowPlayingLeft,
            MODERN_SELECTORS.leftSidebar,
          ],
          highlightType: "subtle-sheen",
          duration: 3e3,
        },
        default: {
          targetElements: [ORBITAL_ELEMENTS.libraryItems],
          highlightType: "gentle-flow",
          duration: 2e3,
        },
      };
    }
    _performAdditionalDependencyValidation() {
      if (!this.year3000System?.masterAnimationCoordinator) {
        console.warn(
          `[${this.systemName}] Master Animation Coordinator not available, using fallback`
        );
      }
      return true;
    }
    updateAnimation(timestamp, deltaTime) {
      if (!this.isInitialized) return;
      this.performanceMetrics.animationFrames++;
      const frameStartTime = performance.now();
      const musicData = this.musicSyncService?.getLatestProcessedData?.() || {};
      this.predictUserInteractions(musicData, deltaTime);
      this.updateBehavioralParameters(musicData, deltaTime);
      this.applyBehavioralEffects();
      const frameTime = performance.now() - frameStartTime;
      this.performanceMetrics.frameTimeHistory.push(frameTime);
      if (this.performanceMetrics.frameTimeHistory.length > 100) {
        this.performanceMetrics.frameTimeHistory.shift();
      }
    }
    predictUserInteractions(musicData, deltaTime) {
      if (this.behavioralState.isInteracting) return;
    }
  };

  // src-js/systems/visual/DataGlyphSystem.js
  init_BaseVisualSystem();
  var DataGlyphSystem = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager
      );
      this.year3000System = year3000System;
      this.masterAnimationRegistered = false;
      this.animationFrameId = null;
      this.isUsingMasterAnimation = false;
      this.itemObserver = null;
      this.observedItems = /* @__PURE__ */ new Map();
      this.glyphDataCache = /* @__PURE__ */ new WeakMap();
      this.itemInteractionData = /* @__PURE__ */ new Map();
      this.activeEchoTimers = /* @__PURE__ */ new WeakMap();
      this.glyphElements = /* @__PURE__ */ new Map();
      this.interactionHistory = [];
      this.modeIntensity = 0.5;
      this.initialized = false;
      this._eventListeners = [];
      this._domEventListeners = [];
      this.lastHeavyUpdateTime = 0;
      this.heavyUpdateInterval = 1e3 / 20;
      this.memoryOptimization = {
        maxCacheSize: 100,
        cleanupInterval: 3e4,
        // 30 seconds
        lastCleanup: Date.now(),
        maxEchoTimers: 50,
        // Memory management for Map-based observedItems
        maxObservedItems: 200,
        // Prevent memory leaks by limiting tracked items
        staleItemThreshold: 3e5,
        // 5 minutes for stale item cleanup
      };
      this.performanceMetrics = {
        glyphUpdates: 0,
        echoEffects: 0,
        memoryCleanups: 0,
        cacheHits: 0,
        cacheMisses: 0,
        animationFrames: 0,
        maxFrameTime: 0,
        averageFrameTime: 0,
        frameTimeHistory: [],
        observedItemsCleanups: 0,
        // Track manual cleanup operations
      };
      this.deviceCapabilities = {
        maxParticles: this._detectMaxParticles(),
        supportsCSSFilter: this._detectCSSFilterSupport(),
        supportsWebGL: this._detectWebGLSupport(),
        performanceLevel: this._detectPerformanceLevel(),
        reducedMotion: this._detectReducedMotion(),
      };
      if (this.utils && this.utils.systemHealthMonitor) {
        this.utils.systemHealthMonitor.registerSystem("DataGlyphSystem", this);
      }
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("DataGlyphSystem", this);
      }
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName} Constructor] Initialized with device capabilities and Map-based observedItems for forEach support:`,
          this.deviceCapabilities
        );
      }
    }
    // === PHASE 3: DEVICE CAPABILITY DETECTION METHODS ===
    _detectMaxParticles() {
      const memory = navigator.deviceMemory || 4;
      const baseParticles = 50;
      return Math.min(200, Math.max(20, baseParticles * (memory / 4)));
    }
    _detectCSSFilterSupport() {
      const testElement = document.createElement("div");
      testElement.style.filter = "blur(1px)";
      return testElement.style.filter === "blur(1px)";
    }
    _detectWebGLSupport() {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
      } catch (e) {
        return false;
      }
    }
    _detectPerformanceLevel() {
      const memory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 2;
      if (memory >= 8 && cores >= 8) return "high";
      if (memory >= 4 && cores >= 4) return "medium";
      return "low";
    }
    _detectReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    async initialize() {
      await super.initialize();
      this._tryRegisterWithMasterAnimation();
      this.setupItemObserver();
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and item observer started. Using ${
            this.isUsingMasterAnimation
              ? "Master Animation Coordinator"
              : "fallback animation loop"
          }.`
        );
      }
    }
    // === PHASE 3: MASTER ANIMATION COORDINATOR METHODS ===
    _tryRegisterWithMasterAnimation() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        try {
          this.year3000System.registerAnimationSystem(
            "DataGlyphSystem",
            this,
            "normal",
            // Priority level
            this.deviceCapabilities.performanceLevel === "high"
              ? 60
              : this.deviceCapabilities.performanceLevel === "medium"
              ? 45
              : 30
            // Dynamic FPS based on device
          );
          this.masterAnimationRegistered = true;
          this.isUsingMasterAnimation = true;
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3AC} [${
                this.systemName
              }] Registered with Master Animation Coordinator at ${
                this.deviceCapabilities.performanceLevel === "high"
                  ? 60
                  : this.deviceCapabilities.performanceLevel === "medium"
                  ? 45
                  : 30
              }fps`
            );
          }
        } catch (error) {
          console.warn(
            `[${this.systemName}] Failed to register with Master Animation Coordinator:`,
            error
          );
          this._startFallbackAnimationLoop();
        }
      } else {
        console.warn(
          `[${this.systemName}] Master Animation Coordinator not available, using fallback`
        );
        this._startFallbackAnimationLoop();
      }
    }
    _startFallbackAnimationLoop() {
      this.isUsingMasterAnimation = false;
      const fallbackLoop = () => {
        if (!this.isInitialized) return;
        try {
          this.updateAnimation(performance.now(), 16.67);
        } catch (error) {
          console.warn(`[${this.systemName}] Fallback animation error:`, error);
        }
        this.animationFrameId = requestAnimationFrame(fallbackLoop);
      };
      this.animationFrameId = requestAnimationFrame(fallbackLoop);
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F504} [${this.systemName}] Started fallback animation loop`
        );
      }
    }
    /**
     * PHASE 3: Main animation update method called by Master Animation Coordinator or fallback loop
     * @param {number} timestamp - Current timestamp
     * @param {number} deltaTime - Time since last frame
     */
    updateAnimation(timestamp, deltaTime) {
      const frameStartTime = performance.now();
      try {
        const maxFrameTime =
          this.deviceCapabilities.performanceLevel === "high"
            ? 8
            : this.deviceCapabilities.performanceLevel === "medium"
            ? 12
            : 16;
        if (deltaTime > maxFrameTime * 2) {
          this.performanceMetrics.animationFrames++;
          return;
        }
        if (timestamp - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
          this.lastHeavyUpdateTime = timestamp;
          this._updateGlyphTargetsOptimized();
        }
        this.animateAllGlyphs();
        this.updateActiveEchoesAndResonance();
        const frameTime = performance.now() - frameStartTime;
        this.performanceMetrics.animationFrames++;
        this.performanceMetrics.maxFrameTime = Math.max(
          this.performanceMetrics.maxFrameTime,
          frameTime
        );
        this.performanceMetrics.frameTimeHistory.push(frameTime);
        if (this.performanceMetrics.frameTimeHistory.length > 60) {
          this.performanceMetrics.frameTimeHistory.shift();
        }
        this.performanceMetrics.averageFrameTime =
          this.performanceMetrics.frameTimeHistory.reduce((a, b) => a + b, 0) /
          this.performanceMetrics.frameTimeHistory.length;
      } catch (error) {
        console.warn(`[${this.systemName}] Animation update error:`, error);
      }
    }
    /**
     * PHASE 3: Performance mode change handler
     * @param {string} mode - 'performance' or 'quality'
     */
    onPerformanceModeChange(mode) {
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Performance mode changed to: ${mode}`
        );
      }
      if (mode === "performance") {
        this.heavyUpdateInterval = 1e3 / 15;
        this.memoryOptimization.maxCacheSize = 50;
        this.memoryOptimization.cleanupInterval = 15e3;
      } else {
        this.heavyUpdateInterval = 1e3 / 20;
        this.memoryOptimization.maxCacheSize = 100;
        this.memoryOptimization.cleanupInterval = 3e4;
      }
    }
    // === PHASE 3: OPTIMIZED UPDATE METHODS ===
    _updateGlyphTargetsOptimized() {
      if (!this.initialized) return;
      const musicData = this.musicSyncService?.getLatestProcessedData() || {};
      const { energy = 0.5, valence = 0.5, enhancedBPM = 120 } = musicData;
      const useBatching =
        this.year3000System && this.year3000System.queueCSSVariableUpdate;
      const globalIntensity = musicData.visualIntensity || 0;
      if (useBatching) {
        this.year3000System.queueCSSVariableUpdate(
          "--sn-glyph-global-intensity-factor",
          globalIntensity.toFixed(2)
        );
      } else {
        document.documentElement.style.setProperty(
          "--sn-glyph-global-intensity-factor",
          globalIntensity.toFixed(2)
        );
      }
      const visibleGlyphs = [];
      this.observedItems.forEach((itemData, itemElement) => {
        if (
          itemElement.offsetParent &&
          this._isElementInViewport(itemElement)
        ) {
          visibleGlyphs.push({ itemElement, itemData });
        }
      });
      visibleGlyphs.forEach(({ itemElement, itemData }) => {
        const intensity = musicData.visualIntensity || 0;
        itemData.targetOpacity = 0.3 + intensity * 0.7;
        itemData.targetScale = 1 + energy * 0.5;
        itemData.targetRotation = intensity * 360;
        itemData.pulseIntensity = intensity;
        itemData.shimmerOpacity = 0.3 + energy * 0.7;
        itemData.pulseAnimationState = intensity > 0.1 ? "running" : "paused";
      });
      this.performOptimizedCleanup();
    }
    _isElementInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= -100 && // Small buffer for elements just outside viewport
        rect.left >= -100 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) + 100 &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth) + 100
      );
    }
    setupItemObserver() {
      const targetNodes = [
        ".main-cardImage-imageWrapper",
        // Cards
        ".main-trackList-row",
        // Tracklist items
        // Potential future targets: playlist entries, artist circles
      ];
      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                targetNodes.forEach((selector) => {
                  if (node.matches(selector)) {
                    this.attachGlyph(node);
                  }
                  node
                    .querySelectorAll(selector)
                    .forEach((item) => this.attachGlyph(item));
                });
              }
            });
            mutation.removedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (this.observedItems.has(node)) {
                  const glyphElement = node.querySelector(
                    ".data-glyph-visualization"
                  );
                  if (glyphElement) glyphElement.remove();
                  this.observedItems.delete(node);
                  if (this.glyphDataCache.has(node)) {
                    this.glyphDataCache.delete(node);
                  }
                  if (this.itemInteractionData.has(node)) {
                    this.itemInteractionData.delete(node);
                  }
                  if (this.config?.enableDebug) {
                    console.log(
                      `\u{1F5D1}\uFE0F [${this.systemName}] Cleaned up removed DOM node from observedItems`
                    );
                  }
                }
              }
            });
          }
        }
      };
      this.itemObserver = new MutationObserver(observerCallback);
      const mainAppContainer = document.querySelector(
        ".main-view-container__scroll-node-child"
      );
      if (mainAppContainer) {
        this.itemObserver.observe(mainAppContainer, {
          childList: true,
          subtree: true,
        });
      } else {
        console.warn(
          `[${this.systemName}] Main app container not found for observer.`
        );
        this.itemObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    }
    attachGlyph(itemElement) {
      if (this.observedItems.has(itemElement) || !itemElement.offsetParent)
        return;
      const glyphElement = document.createElement("div");
      glyphElement.className = "data-glyph-visualization";
      glyphElement.style.cssText = `
        position: absolute;
        top: 5px; right: 5px;
        width: 10px; height: 10px;
        border-radius: 50%;
        background-color: rgba(var(--sn-glyph-color-rgb, 140,170,238), var(--sn-glyph-opacity, 0.3));
        opacity: var(--sn-glyph-opacity, 0);
        transform: scale(var(--sn-glyph-scale, 1)) rotate(var(--sn-glyph-rotation, 0deg));
        transition: all 0.3s ease;
        pointer-events: none;
        z-index: 10;
    `;
      glyphElement.style.setProperty("--sn-glyph-opacity", "0.3");
      glyphElement.style.setProperty("--sn-glyph-scale", "1");
      glyphElement.style.setProperty("--sn-glyph-pulse-intensity", "0");
      glyphElement.style.setProperty("--sn-glyph-shimmer-opacity", "0.3");
      glyphElement.style.setProperty("--sn-glyph-rotation", "0deg");
      glyphElement.style.setProperty("--sn-glyph-color-rgb", "140,170,238");
      glyphElement.style.setProperty(
        "--sn-glyph-pulse-animation-state",
        "paused"
      );
      glyphElement.style.setProperty("--sn-glyph-resonance-intensity", "0");
      itemElement.style.position = "relative";
      itemElement.appendChild(glyphElement);
      this.observedItems.set(itemElement, {
        glyphElement,
        lastInteraction: Date.now(),
        // MEMORY MANAGEMENT: Track creation time for Map-based cleanup
        resonanceFactor: 0,
        relatedTrackUri: itemElement.dataset.uri || null,
        // Animation properties
        currentOpacity: 0,
        currentScale: 1,
        currentRotation: 0,
        targetOpacity: 0.3,
        targetScale: 1,
        targetRotation: 0,
        // Other properties not lerped per frame
        pulseIntensity: 0,
        shimmerOpacity: 0.3,
        colorRgb: "140,170,238",
        pulseAnimationState: "paused",
      });
      this.itemInteractionData.set(itemElement, {
        lastInteraction: Date.now(),
        // MEMORY MANAGEMENT: Track creation time for Map-based cleanup
        lastInteractionTime: Date.now(),
        interactionScore: 0,
        resonanceIntensity: 0,
        echoActiveUntil: 0,
      });
      const boundHandleInteraction = (event) =>
        this.handleItemInteraction(itemElement, event);
      glyphElement._boundHandleInteraction = boundHandleInteraction;
      itemElement.addEventListener("click", boundHandleInteraction);
      itemElement.addEventListener("mouseenter", boundHandleInteraction);
      if (this.config?.enableDebug && Math.random() < 0.01) {
        console.log(
          `[${this.systemName}] Attached enhanced glyph to:`,
          itemElement
        );
      }
    }
    /**
     * (Per-frame) Lightweight animation loop for all glyphs.
     */
    animateAllGlyphs() {
      const lerpSpeed = 0.1;
      this.observedItems.forEach((itemData, itemElement) => {
        if (itemElement.offsetParent) {
          itemData.currentOpacity = this.utils.lerpSmooth(
            itemData.currentOpacity,
            itemData.targetOpacity,
            lerpSpeed,
            0.8
          );
          itemData.currentScale = this.utils.lerpSmooth(
            itemData.currentScale,
            itemData.targetScale,
            lerpSpeed,
            0.8
          );
          itemData.currentRotation = this.utils.lerpSmooth(
            itemData.currentRotation,
            itemData.targetRotation,
            lerpSpeed,
            0.8
          );
          this.updateGlyphVisuals(itemElement, itemData);
        }
      });
    }
    /**
     * (Per-frame) Applies the current (lerped) state to the glyph's CSS.
     * @param {HTMLElement} itemElement The parent element of the glyph.
     * @param {object} itemData The current data object for the glyph from observedItems.
     */
    updateGlyphVisuals(itemElement, itemData) {
      const glyphElement = itemData.glyphElement;
      if (!glyphElement) return;
      glyphElement.style.setProperty(
        "--sn-glyph-opacity",
        itemData.currentOpacity.toFixed(2)
      );
      glyphElement.style.setProperty(
        "--sn-glyph-scale",
        itemData.currentScale.toFixed(2)
      );
      glyphElement.style.setProperty(
        "--sn-glyph-rotation",
        `${itemData.currentRotation.toFixed(1)}deg`
      );
      glyphElement.style.setProperty(
        "--sn-glyph-pulse-intensity",
        itemData.pulseIntensity.toFixed(2)
      );
      glyphElement.style.setProperty(
        "--sn-glyph-shimmer-opacity",
        itemData.shimmerOpacity.toFixed(2)
      );
      glyphElement.style.setProperty("--sn-glyph-color-rgb", itemData.colorRgb);
      glyphElement.style.setProperty(
        "--sn-glyph-pulse-animation-state",
        itemData.pulseAnimationState
      );
    }
    updateGlyphData(itemElement, data) {
      if (!this.observedItems.has(itemElement)) return;
      this.performanceMetrics.glyphUpdates++;
      const itemData = this.observedItems.get(itemElement);
      const glyphElement = itemData.glyphElement;
      const cachedData = this.glyphDataCache.get(itemElement);
      if (cachedData && JSON.stringify(cachedData) === JSON.stringify(data)) {
        this.performanceMetrics.cacheHits++;
        return;
      }
      this.performanceMetrics.cacheMisses++;
      this.glyphDataCache.set(itemElement, data);
      let opacity = 0.3 + (data.intensity || 0) * 0.7;
      let scale = 1 + (data.sizeFactor || 0) * 0.5;
      let pulseIntensity = data.pulseIntensity || 0;
      let shimmerOpacity = 0.3 + (data.shimmerFactor || 0) * 0.7;
      let rotation = data.rotationAngle || 0;
      let colorRgb =
        data.colorRgb ||
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sn-glyph-color-rgb")
          .trim() ||
        "140,170,238";
      let pulseAnimationState =
        data.pulseIntensity > 0.1 ? "running" : "paused";
      glyphElement.style.setProperty("--sn-glyph-opacity", opacity.toFixed(2));
      glyphElement.style.setProperty("--sn-glyph-scale", scale.toFixed(2));
      glyphElement.style.setProperty(
        "--sn-glyph-pulse-intensity",
        pulseIntensity.toFixed(2)
      );
      glyphElement.style.setProperty(
        "--sn-glyph-shimmer-opacity",
        shimmerOpacity.toFixed(2)
      );
      glyphElement.style.setProperty("--sn-glyph-rotation", `${rotation}deg`);
      glyphElement.style.setProperty("--sn-glyph-color-rgb", colorRgb);
      glyphElement.style.setProperty(
        "--sn-glyph-pulse-animation-state",
        pulseAnimationState
      );
      itemData.resonanceFactor =
        (itemData.resonanceFactor + (data.intensity || 0)) / 2;
      if (this.performanceMetrics.glyphUpdates % 100 === 0) {
        this.performOptimizedCleanup();
      }
      if (this.config?.enableDebug && Math.random() < 5e-3) {
      }
    }
    handleItemInteraction(itemElement, event) {
      if (!itemElement || !this.itemInteractionData.has(itemElement)) return;
      const interactionType = event.type;
      const data = this.itemInteractionData.get(itemElement);
      const glyphElement = this.observedItems.get(itemElement)?.glyphElement;
      if (!glyphElement) return;
      data.lastInteraction = Date.now();
      data.lastInteractionTime = Date.now();
      let scoreIncrement = 0;
      if (interactionType === "click") {
        scoreIncrement = 5;
        data.echoActiveUntil = Date.now() + 750;
        glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0.3");
        glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1.15");
        glyphElement.classList.add("sn-nav-item-echoing");
      } else if (interactionType === "mouseenter") {
        scoreIncrement = 1;
        const rootStyle = getComputedStyle(document.documentElement);
        const primaryRGB =
          rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
          "202,158,230";
        glyphElement.style.opacity = "0.9";
        glyphElement.style.transform = "scale(1.5)";
        glyphElement.style.backgroundColor = `rgba(${primaryRGB}, 0.7)`;
      }
      data.interactionScore += scoreIncrement;
      data.resonanceIntensity = Math.min(0.25, data.interactionScore * 5e-3);
      glyphElement.style.setProperty(
        "--sn-glyph-resonance-intensity",
        data.resonanceIntensity.toFixed(3)
      );
      this.itemInteractionData.set(itemElement, data);
      if (this.config?.enableDebug) {
      }
    }
    updateActiveEchoesAndResonance() {
      const now = Date.now();
      this.observedItems.forEach((itemData, itemElement) => {
        if (this.itemInteractionData.has(itemElement)) {
          const data = this.itemInteractionData.get(itemElement);
          const glyphElement = itemData.glyphElement;
          if (data.echoActiveUntil > 0 && now > data.echoActiveUntil) {
            glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0");
            glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1");
            glyphElement.classList.remove("sn-nav-item-echoing");
            data.echoActiveUntil = 0;
            this.itemInteractionData.set(itemElement, data);
          }
          if (
            now - data.lastInteractionTime > 6e4 &&
            data.interactionScore > 0
          ) {
            data.interactionScore = Math.max(0, data.interactionScore - 0.1);
            data.resonanceIntensity = Math.min(
              0.25,
              data.interactionScore * 5e-3
            );
            glyphElement.style.setProperty(
              "--sn-glyph-resonance-intensity",
              data.resonanceIntensity.toFixed(3)
            );
            this.itemInteractionData.set(itemElement, data);
          }
        }
      });
    }
    destroy() {
      if (this.masterAnimationRegistered && this.year3000System) {
        try {
          this.year3000System.unregisterAnimationSystem("DataGlyphSystem");
          this.masterAnimationRegistered = false;
          this.isUsingMasterAnimation = false;
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3AC} [${this.systemName}] Unregistered from Master Animation Coordinator`
            );
          }
        } catch (error) {
          console.warn(
            `[${this.systemName}] Failed to unregister from Master Animation Coordinator:`,
            error
          );
        }
      }
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F504} [${this.systemName}] Stopped fallback animation loop`
          );
        }
      }
      for (const listener of this._domEventListeners) {
        try {
          listener.element.removeEventListener(
            listener.event,
            listener.handler
          );
        } catch (error) {
          console.error(
            `[${this.systemName}] Failed to remove event listener:`,
            error
          );
        }
      }
      this._domEventListeners.length = 0;
      if (this.itemObserver) {
        this.itemObserver.disconnect();
        this.itemObserver = null;
      }
      this.observedItems.forEach((itemData, itemElement) => {
        const glyphElement = itemData.glyphElement;
        if (itemElement && itemElement.contains(glyphElement)) {
          if (glyphElement._boundHandleInteraction) {
            itemElement.removeEventListener(
              "click",
              glyphElement._boundHandleInteraction
            );
            itemElement.removeEventListener(
              "mouseenter",
              glyphElement._boundHandleInteraction
            );
          }
          glyphElement.style.removeProperty("--sn-nav-item-echo-opacity");
          glyphElement.style.removeProperty("--sn-nav-item-echo-scale");
          glyphElement.style.removeProperty("--sn-glyph-resonance-intensity");
          glyphElement.classList.remove("sn-nav-item-echoing");
          itemElement.removeChild(glyphElement);
        }
      });
      if (this.bloomSystem) {
        for (const timer of this.bloomSystem.bloomTimers.values()) {
          clearTimeout(timer);
        }
        this.bloomSystem.bloomTimers.clear();
        this.bloomSystem.activeBloomElements.clear();
        this.bloomSystem.refractElements.clear();
        this.bloomSystem = null;
      }
      this.observedItems.clear();
      this.itemInteractionData.clear();
      this.glyphDataCache = /* @__PURE__ */ new WeakMap();
      this.activeEchoTimers.clear();
      super.destroy();
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Enhanced destroy completed - all glyphs and interactions cleaned up.`
        );
      }
    }
    // NEW: Phase 6 Optimized memory cleanup and performance monitoring
    performOptimizedCleanup() {
      const now = Date.now();
      if (
        now - this.memoryOptimization.lastCleanup >
        this.memoryOptimization.cleanupInterval
      ) {
        this.performanceMetrics.memoryCleanups++;
        const itemsToDelete = [];
        this.observedItems.forEach((itemData, itemElement) => {
          if (!itemElement.isConnected) {
            itemsToDelete.push(itemElement);
          } else if (
            itemData.lastInteraction &&
            now - itemData.lastInteraction >
              this.memoryOptimization.staleItemThreshold
          ) {
            itemsToDelete.push(itemElement);
          }
        });
        const interactionItemsToDelete = [];
        this.itemInteractionData.forEach((interactionData, itemElement) => {
          if (!itemElement.isConnected) {
            interactionItemsToDelete.push(itemElement);
          } else if (
            interactionData.lastInteraction &&
            now - interactionData.lastInteraction >
              this.memoryOptimization.staleItemThreshold
          ) {
            interactionItemsToDelete.push(itemElement);
          }
        });
        const allItemsToDelete = [
          .../* @__PURE__ */ new Set([
            ...itemsToDelete,
            ...interactionItemsToDelete,
          ]),
        ];
        allItemsToDelete.forEach((element) => {
          const itemData = this.observedItems.get(element);
          if (itemData?.glyphElement) {
            try {
              itemData.glyphElement.remove();
            } catch (e) {}
          }
          this.observedItems.delete(element);
          if (this.glyphDataCache.has(element)) {
            this.glyphDataCache.delete(element);
          }
          if (this.itemInteractionData.has(element)) {
            this.itemInteractionData.delete(element);
          }
        });
        if (allItemsToDelete.length > 0) {
          this.performanceMetrics.observedItemsCleanups++;
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F5D1}\uFE0F [${this.systemName}] Cleaned up ${allItemsToDelete.length} stale/disconnected items (${itemsToDelete.length} observed, ${interactionItemsToDelete.length} interaction)`
            );
          }
        }
        if (
          this.observedItems.size > this.memoryOptimization.maxObservedItems
        ) {
          const itemsArray = Array.from(this.observedItems.entries());
          const sortedItems = itemsArray.sort((a, b) => {
            const aTime = a[1].lastInteraction || 0;
            const bTime = b[1].lastInteraction || 0;
            return aTime - bTime;
          });
          const excessCount =
            this.observedItems.size - this.memoryOptimization.maxObservedItems;
          const itemsToRemove = sortedItems.slice(0, excessCount);
          itemsToRemove.forEach(([element, itemData]) => {
            if (itemData?.glyphElement) {
              try {
                itemData.glyphElement.remove();
              } catch (e) {}
            }
            this.observedItems.delete(element);
            if (this.glyphDataCache.has(element)) {
              this.glyphDataCache.delete(element);
            }
            if (this.itemInteractionData.has(element)) {
              this.itemInteractionData.delete(element);
            }
          });
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F5D1}\uFE0F [${this.systemName}] Enforced max items limit, removed ${excessCount} oldest entries`
            );
          }
        }
        if (
          this.itemInteractionData.size >
          this.memoryOptimization.maxObservedItems
        ) {
          const interactionArray = Array.from(
            this.itemInteractionData.entries()
          );
          const sortedInteractions = interactionArray.sort((a, b) => {
            const aTime = a[1].lastInteraction || 0;
            const bTime = b[1].lastInteraction || 0;
            return aTime - bTime;
          });
          const excessCount =
            this.itemInteractionData.size -
            this.memoryOptimization.maxObservedItems;
          const interactionsToRemove = sortedInteractions.slice(0, excessCount);
          interactionsToRemove.forEach(([element, interactionData]) => {
            this.itemInteractionData.delete(element);
            if (this.observedItems.has(element)) {
              const itemData = this.observedItems.get(element);
              if (itemData?.glyphElement) {
                try {
                  itemData.glyphElement.remove();
                } catch (e) {}
              }
              this.observedItems.delete(element);
            }
            if (this.glyphDataCache.has(element)) {
              this.glyphDataCache.delete(element);
            }
          });
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F5D1}\uFE0F [${this.systemName}] Enforced max interaction data limit, removed ${excessCount} oldest entries`
            );
          }
        }
        if (this.glyphDataCache.size > this.memoryOptimization.maxCacheSize) {
          const entries = Array.from(this.glyphDataCache.entries());
          const oldEntries = entries.slice(
            0,
            entries.length - this.memoryOptimization.maxCacheSize
          );
          for (const [element] of oldEntries) {
            this.glyphDataCache.delete(element);
          }
        }
        this.memoryOptimization.lastCleanup = now;
        this.updatePerformanceMetrics();
      }
    }
    updatePerformanceMetrics() {
      const animationComplexity = this.calculateGlyphComplexity();
      const memoryUsage = this.estimateMemoryUsage();
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.updateSystemMetrics("DataGlyphSystem", {
          glyphUpdates: this.performanceMetrics.glyphUpdates,
          echoEffects: this.performanceMetrics.echoEffects,
          memoryUsage,
          animationComplexity,
          cacheEfficiency:
            this.performanceMetrics.cacheHits /
              (this.performanceMetrics.cacheHits +
                this.performanceMetrics.cacheMisses) || 0,
        });
      }
    }
    calculateGlyphComplexity() {
      let complexity = 0;
      complexity += this.glyphDataCache.size * 2;
      complexity += this.itemInteractionData.size * 3;
      complexity += this.performanceMetrics.echoEffects * 5;
      return Math.min(complexity, 100);
    }
    estimateMemoryUsage() {
      const cacheMemory = this.glyphDataCache.size * 1e3;
      const interactionMemory = this.itemInteractionData.size * 500;
      return cacheMemory + interactionMemory;
    }
    performCleanup() {
      this.performOptimizedCleanup();
      if (this.performanceMetrics.glyphUpdates > 1e4) {
        this.performanceMetrics.glyphUpdates = Math.floor(
          this.performanceMetrics.glyphUpdates / 2
        );
        this.performanceMetrics.echoEffects = Math.floor(
          this.performanceMetrics.echoEffects / 2
        );
      }
    }
    // ===== YEAR 3000 MODE CONFIGURATION =====
    /**
     * Update system configuration based on current artistic mode
     * @param {Object} modeConfig - Configuration from artistic mode profile
     */
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, animations, intensity } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Updating mode configuration:`,
          modeConfig
        );
      }
      this.modeConfig = {
        systemEnabled: enabled !== false,
        bloomAnimationsEnabled: animations || false,
        temporalEchoEnabled: modeConfig.temporalEcho || false,
        intensityMultiplier: intensity || 1,
        refractEffectsEnabled: animations || false,
      };
      this.applyModeToExistingGlyphs();
      if (this.modeConfig.bloomAnimationsEnabled) {
        this.initializeBloomEffects();
      } else {
        this.disableBloomEffects();
      }
    }
    // ===== KINETIC BLOOM AND REFRACT SYSTEM =====
    /**
     * Initialize bloom and refract effects for UI elements
     */
    initializeBloomEffects() {
      if (this.bloomInitialized) return;
      this.bloomSystem = {
        activeBloomElements: /* @__PURE__ */ new WeakMap(),
        bloomTimers: /* @__PURE__ */ new WeakMap(),
        refractElements: /* @__PURE__ */ new WeakSet(),
        attentionTracker: /* @__PURE__ */ new WeakMap(),
      };
      this.setupAttentionTracking();
      this.bloomInitialized = true;
      if (this.config?.enableDebug) {
        console.log(`\u{1F338} [${this.systemName}] Bloom effects initialized`);
      }
    }
    /**
     * Disable bloom effects and cleanup
     */
    disableBloomEffects() {
      if (!this.bloomInitialized) return;
      if (this.bloomSystem?.bloomTimers) {
        this.bloomSystem.bloomTimers = /* @__PURE__ */ new WeakMap();
      }
      document
        .querySelectorAll(".sn-bloom-active, .sn-refract-active")
        .forEach((el) => {
          el.classList.remove("sn-bloom-active", "sn-refract-active");
        });
      this.bloomSystem = null;
      this.bloomInitialized = false;
      if (this.config?.enableDebug) {
        console.log(`\u{1F338} [${this.systemName}] Bloom effects disabled`);
      }
    }
    /**
     * Setup attention tracking for UI elements
     */
    setupAttentionTracking() {
      const focusInHandler = (event) => {
        this.handleElementAttention(event.target, "focus");
      };
      const focusOutHandler = (event) => {
        this.handleElementAttention(event.target, "blur");
      };
      const mouseOverHandler = (event) => {
        this.handleElementAttention(event.target, "hover");
      };
      const mouseOutHandler = (event) => {
        this.handleElementAttention(event.target, "unhover");
      };
      this._domEventListeners.push(
        { element: document, event: "focusin", handler: focusInHandler },
        { element: document, event: "focusout", handler: focusOutHandler },
        { element: document, event: "mouseover", handler: mouseOverHandler },
        { element: document, event: "mouseout", handler: mouseOutHandler }
      );
      document.addEventListener("focusin", focusInHandler);
      document.addEventListener("focusout", focusOutHandler);
      document.addEventListener("mouseover", mouseOverHandler);
      document.addEventListener("mouseout", mouseOutHandler);
    }
    /**
     * Handle element attention events for kinetic effects
     * @param {Element} element - The element receiving attention
     * @param {string} type - Type of attention (focus, blur, hover, unhover)
     */
    handleElementAttention(element, type) {
      if (
        !this.modeConfig?.bloomAnimationsEnabled &&
        !this.modeConfig?.refractEffectsEnabled
      )
        return;
      const relevantElement = this.findRelevantElement(element);
      if (!relevantElement) return;
      const intensity = this.modeConfig?.intensityMultiplier || 1;
      switch (type) {
        case "focus":
          if (this.modeConfig.bloomAnimationsEnabled) {
            this.bloomElement(relevantElement, intensity * 1.2);
          }
          break;
        case "hover":
          if (this.modeConfig.refractEffectsEnabled) {
            this.applyRefractEffect(relevantElement, intensity);
          }
          break;
        case "blur":
        case "unhover":
          this.removeKineticEffects(relevantElement);
          break;
      }
    }
    /**
     * Find the relevant element for kinetic effects
     * @param {Element} element - The initial element
     * @returns {Element|null} - The relevant element or null
     */
    findRelevantElement(element) {
      if (this.observedItems.has(element)) {
        return element;
      }
      let parent = element.parentElement;
      while (parent) {
        if (this.observedItems.has(parent)) {
          return parent;
        }
        parent = parent.parentElement;
      }
      const relevantSelectors = [
        ORBITAL_ELEMENTS.trackRows,
        ORBITAL_ELEMENTS.cards,
        MODERN_SELECTORS.playButton,
        MODERN_SELECTORS.navBarLink,
        // Enhanced fallbacks for broader compatibility
        MODERN_SELECTORS.albumCover,
        MODERN_SELECTORS.heartButton,
      ];
      for (const selector of relevantSelectors) {
        if (element.matches(selector)) {
          return element;
        }
        const closestMatch = element.closest(selector);
        if (closestMatch) {
          return closestMatch;
        }
      }
      if (this.config?.enableDebug && Math.random() < 0.02) {
        console.log(
          `\u{1F338} [${this.systemName}] Element attention event on non-relevant element:`,
          element
        );
      }
      return null;
    }
    /**
     * Apply bloom animation to an element
     * @param {Element} element - Element to bloom
     * @param {number} intensity - Bloom intensity
     */
    bloomElement(element, intensity = 1) {
      if (!this.bloomSystem || !element) return;
      const existingTimer = this.bloomSystem.bloomTimers.get(element);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      element.classList.add("sn-bloom-active");
      element.style.setProperty("--sn-bloom-intensity", intensity.toString());
      element.style.setProperty(
        "--sn-bloom-scale",
        (1 + intensity * 0.1).toString()
      );
      const root = document.documentElement;
      const accentRgb =
        getComputedStyle(root)
          .getPropertyValue("--sn-gradient-accent-rgb")
          .trim() || "140,170,238";
      element.style.setProperty("--sn-bloom-glow-color", accentRgb);
      this.bloomSystem.activeBloomElements.set(element, {
        startTime: Date.now(),
        intensity,
      });
      const bloomDuration = 1500 * intensity;
      const timer = setTimeout(() => {
        this.removeBloomEffect(element);
      }, bloomDuration);
      this.bloomSystem.bloomTimers.set(element, timer);
      if (this.modeConfig?.temporalEchoEnabled) {
        this.addTemporalEcho(element, intensity);
      }
      if (this.config?.enableDebug && Math.random() < 0.1) {
        console.log(
          `\u{1F338} [${this.systemName}] Bloomed element with intensity ${intensity}`
        );
      }
    }
    /**
     * Apply refract light-bending effect to an element
     * @param {Element} element - Element to apply refraction
     * @param {number} intensity - Refract intensity
     */
    applyRefractEffect(element, intensity = 1) {
      if (!this.bloomSystem || !element) return;
      element.classList.add("sn-refract-active");
      element.style.setProperty("--sn-refract-intensity", intensity.toString());
      element.style.setProperty(
        "--sn-refract-blur",
        (intensity * 0.5).toString()
      );
      element.style.setProperty(
        "--sn-refract-hue-shift",
        (intensity * 15).toString()
      );
      this.bloomSystem.refractElements.add(element);
      if (this.config?.enableDebug && Math.random() < 0.05) {
        console.log(
          `\u2728 [${this.systemName}] Applied refract effect with intensity ${intensity}`
        );
      }
    }
    /**
     * Add temporal echo trail effect
     * @param {Element} element - Element to add echo
     * @param {number} intensity - Echo intensity
     */
    addTemporalEcho(element, intensity = 1) {
      if (!element) return;
      const echo = element.cloneNode(true);
      echo.classList.add("sn-temporal-echo");
      echo.style.position = "absolute";
      echo.style.pointerEvents = "none";
      echo.style.zIndex = "-1";
      echo.style.opacity = (0.3 * intensity).toString();
      echo.style.transform = "scale(1.05)";
      echo.style.filter = `blur(${intensity}px)`;
      const rect = element.getBoundingClientRect();
      echo.style.left = rect.left + "px";
      echo.style.top = rect.top + "px";
      echo.style.width = rect.width + "px";
      echo.style.height = rect.height + "px";
      document.body.appendChild(echo);
      setTimeout(() => {
        echo.style.transition = "all 800ms ease-out";
        echo.style.opacity = "0";
        echo.style.transform = "scale(1.15)";
        setTimeout(() => {
          echo.remove();
        }, 800);
      }, 50);
    }
    /**
     * Remove bloom effect from an element
     * @param {Element} element - Element to remove bloom from
     */
    removeBloomEffect(element) {
      if (!element) return;
      element.classList.remove("sn-bloom-active");
      if (this.bloomSystem) {
        this.bloomSystem.activeBloomElements.delete(element);
        const timer = this.bloomSystem.bloomTimers.get(element);
        if (timer) {
          clearTimeout(timer);
          this.bloomSystem.bloomTimers.delete(element);
        }
      }
    }
    /**
     * Remove all kinetic effects from an element
     * @param {Element} element - Element to clean up
     */
    removeKineticEffects(element) {
      if (!element) return;
      element.classList.remove("sn-refract-active");
      this.removeBloomEffect(element);
      if (this.bloomSystem?.refractElements) {
        this.bloomSystem.refractElements.delete(element);
      }
    }
    /**
     * Apply current mode configuration to existing glyphs
     */
    applyModeToExistingGlyphs() {
      if (!this.modeConfig) return;
      const intensity = this.modeConfig.intensityMultiplier || 1;
      try {
        this.observedItems.forEach((itemData, itemElement) => {
          if (itemData && itemData.glyphElement) {
            const baseOpacity = this.modeConfig.systemEnabled ? 0.3 : 0.1;
            itemData.targetOpacity = baseOpacity * intensity;
            itemData.targetScale = 1 * intensity;
            itemData.glyphElement.style.setProperty(
              "--sn-glyph-mode-intensity",
              intensity.toString()
            );
          }
        });
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3A8} [${this.systemName}] Applied mode configuration to ${this.observedItems.size} glyphs`
          );
        }
      } catch (error) {
        if (this.config?.enableDebug) {
          console.error(
            `\u{1F3A8} [${this.systemName}] Error in applyModeToExistingGlyphs:`,
            error
          );
        }
        this.observedItems.clear();
      }
    }
    /**
     * DEBUGGING: Test method to verify Map forEach functionality
     * This method ensures the WeakMap to Map conversion works correctly
     */
    testForEachFunctionality() {
      console.log(
        "\u{1F9EA} [DataGlyphSystem] Testing Map-based forEach functionality:"
      );
      console.log(
        `\u{1F4CA} observedItems: ${this.observedItems.size} entries`
      );
      let observedCount = 0;
      try {
        this.observedItems.forEach((value, key) => {
          observedCount++;
        });
        console.log(
          `\u2705 observedItems.forEach() works: iterated ${observedCount} entries`
        );
      } catch (error) {
        console.log(`\u274C observedItems.forEach() failed:`, error.message);
      }
      console.log(
        `\u{1F4CA} itemInteractionData: ${this.itemInteractionData.size} entries`
      );
      let interactionCount = 0;
      try {
        this.itemInteractionData.forEach((value, key) => {
          interactionCount++;
        });
        console.log(
          `\u2705 itemInteractionData.forEach() works: iterated ${interactionCount} entries`
        );
      } catch (error) {
        console.log(
          `\u274C itemInteractionData.forEach() failed:`,
          error.message
        );
      }
      try {
        const entriesArray = Array.from(this.itemInteractionData.entries());
        console.log(
          `\u2705 itemInteractionData.entries() works: ${entriesArray.length} entries converted to array`
        );
      } catch (error) {
        console.log(
          `\u274C itemInteractionData.entries() failed:`,
          error.message
        );
      }
      return {
        observedItemsCount: observedCount,
        interactionDataCount: interactionCount,
        entriesMethodWorks: true,
        mapBased: true,
        fixApplied: true,
      };
    }
  };

  // src-js/systems/visual/DimensionalNexusSystem.js
  init_BaseVisualSystem();
  var DimensionalNexusSystem = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager,
        year3000System
      );
      this.year3000System = year3000System;
      this.nexusState = {
        // Current animated values
        complexity: 0.1,
        coherence: 0.8,
        volatility: 0.05,
        timeDistortionFactor: 1,
        currentNavigationScale: 1,
        // Target values for animation
        targetComplexity: 0.1,
        targetCoherence: 0.8,
        targetVolatility: 0.05,
        targetTimeDistortionFactor: 1,
        targetNavigationScale: 1,
        // Other state
        userInfluence: 0,
        lastEnergy: 0.5,
        lastValence: 0.5,
        lastVisualIntensity: 0.5,
        lastMoodIdentifier: "neutral",
        // Responsiveness settings
        responsiveness: 1,
        temporalSensitivity: 1,
      };
      this.biometricState = {
        isMeditating: false,
        lastUserInteractionTime: Date.now(),
        meditationGracePeriod: 5e3,
        // 5 seconds
        interactionCooldown: 1e3,
        lastMeditationUpdateTime: null,
        desaturation: 0,
        slowdown: 1,
        targetDesaturation: 0,
        targetSlowdown: 1,
      };
      this.lastHeavyUpdateTime = 0;
      this.heavyUpdateInterval = 1e3 / 10;
      this.lastBiometricCheckTime = 0;
      this.biometricCheckInterval = 1e3;
      this.lastInteractionRecordTime = 0;
      this.interactionRecordInterval = 200;
      this._animationRegistered = false;
      this._performanceMode = "auto";
      this._frameSkipCounter = 0;
      this._maxFrameSkip = 2;
      this.systemIntegrationMetrics = {
        lastSystemsCheck: Date.now(),
        integrationHealth: "healthy",
        crossSystemErrors: 0,
        meditationTransitions: 0,
        navigationScaleUpdates: 0,
      };
      if (this.utils && this.utils.systemHealthMonitor) {
        this.utils.systemHealthMonitor.registerSystem(
          "DimensionalNexusSystem",
          this
        );
      }
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("DimensionalNexusSystem", this);
      }
      this.rootElement = this.utils.getRootStyle();
      this.modalObserver = null;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Optimized Dimensional Nexus initialized with performance focus.`
        );
      }
    }
    async initialize() {
      await super.initialize();
      this.initializeOptimizedQuantumSpace();
      this.setupModalObserver();
      this.setupOptimizedInteractionListener();
      this._registerWithAnimationCoordinator();
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F9E0} [${this.systemName}] Optimized quantum space and biometric monitoring initialized.`
        );
      }
    }
    /**
     * Register with Master Animation Coordinator
     */
    _registerWithAnimationCoordinator() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        this.year3000System.registerAnimationSystem(
          "DimensionalNexusSystem",
          this,
          "normal",
          30
          // Reduced from 45fps to 30fps for better performance
        );
        this._animationRegistered = true;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Registered with Master Animation Coordinator (30fps)`
          );
        }
      } else {
        this._startFallbackAnimationLoops();
      }
    }
    /**
     * Optimized quantum space initialization
     */
    initializeOptimizedQuantumSpace() {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const safeSetProperty = (name, value) => {
        try {
          root.style.setProperty(name, value);
        } catch (e) {}
      };
      safeSetProperty("--sn-nexus-complexity", this.nexusState.complexity);
      safeSetProperty("--sn-nexus-coherence", this.nexusState.coherence);
      safeSetProperty("--sn-nexus-volatility", this.nexusState.volatility);
      safeSetProperty(
        "--sn-nexus-time-distortion",
        this.nexusState.timeDistortionFactor
      );
      safeSetProperty("--sn-nav-item-transform-scale", "1.0");
      safeSetProperty("--sn-sidebar-meditation-desaturation", "0");
      safeSetProperty("--sn-sidebar-meditation-slowdown", "1");
      safeSetProperty("--sn-nexus-pattern-complexity", "0.5");
      safeSetProperty("--sn-nexus-pattern-rotation", "0deg");
    }
    /**
     * Optimized interaction tracking (reduced frequency)
     */
    recordUserInteraction(event) {
      const eventType = event.type;
      const now = performance.now();
      if (
        now - this.lastInteractionRecordTime <
        this.interactionRecordInterval
      ) {
        return;
      }
      this.lastInteractionRecordTime = now;
      this.nexusState.userInfluence += 5e-3;
      this.nexusState.volatility = Math.min(
        1,
        this.nexusState.volatility + 0.01
      );
      this.nexusState.userInfluence = Math.min(
        0.5,
        this.nexusState.userInfluence
      );
      this.biometricState.lastUserInteractionTime = Date.now();
      const wasMeditating = this.biometricState.isMeditating;
      this.biometricState.isMeditating = false;
      if (this.config?.enableDebug && wasMeditating) {
        console.log(
          `\u{1F30C} [${this.systemName}] User interaction recorded (${eventType}), exiting meditation.`
        );
      }
    }
    setupModalObserver() {
      const modalRoot = document.querySelector(".main-modal-container");
      if (!modalRoot) return;
      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            const hasModal = modalRoot.children.length > 0;
            this.nexusState.timeDistortionFactor = hasModal ? 0.2 : 1;
            this.nexusState.coherence = hasModal ? 0.2 : 0.8;
            if (this.config?.enableDebug) {
              console.log(
                `\u{1F30C} [${this.systemName}] Modal state changed. Distortion: ${this.nexusState.timeDistortionFactor}`
              );
            }
          }
        }
      };
      this.modalObserver = new MutationObserver(observerCallback);
      this.modalObserver.observe(modalRoot, { childList: true });
    }
    /**
     * Optimized interaction listener (fewer events, more throttling)
     */
    setupOptimizedInteractionListener() {
      this.boundInteractionHandler = (event) =>
        this.recordUserInteraction(event);
      const interactionEvents = ["click", "keypress"];
      interactionEvents.forEach((eventType) => {
        document.addEventListener(eventType, this.boundInteractionHandler, {
          passive: true,
        });
      });
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Optimized interaction listener set up.`
        );
      }
    }
    /**
     * Main update entry point
     */
    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.isInitialized) return;
      super.updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri);
      const now = performance.now();
      if (now - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
        this.lastHeavyUpdateTime = now;
        this.updateNexusTargets(processedMusicData);
      }
      if (now - this.lastBiometricCheckTime > this.biometricCheckInterval) {
        this.lastBiometricCheckTime = now;
        this.updateDigitalMeditationState(processedMusicData);
      }
    }
    /**
     * Optimized nexus targets update (simplified calculations)
     */
    updateNexusTargets(processedMusicData) {
      try {
        if (!this.validateMusicData(processedMusicData)) {
          if (this.config?.enableDebug)
            console.warn(
              `\u{1F30C} [${this.systemName}] Invalid music data, using defaults.`
            );
          this.systemIntegrationMetrics.crossSystemErrors++;
          processedMusicData = {};
        }
        const {
          visualIntensity = 0.5,
          moodIdentifier = "neutral",
          rawEnergy = 0.5,
          rawValence = 0.5,
          animationSpeedFactor = 1,
        } = processedMusicData;
        const energyDelta = Math.abs(rawEnergy - this.nexusState.lastEnergy);
        const valenceDelta = Math.abs(rawValence - this.nexusState.lastValence);
        this.nexusState.lastEnergy = rawEnergy;
        this.nexusState.lastValence = rawValence;
        this.nexusState.lastVisualIntensity = visualIntensity;
        this.nexusState.lastMoodIdentifier = moodIdentifier;
        this.nexusState.targetComplexity = visualIntensity * 0.6 + 0.2;
        this.nexusState.targetCoherence = rawValence * 0.5 + 0.4;
        this.nexusState.targetVolatility = (energyDelta + valenceDelta) * 1.5;
        this.nexusState.targetTimeDistortionFactor = animationSpeedFactor;
        this.nexusState.targetNavigationScale =
          this.calculateOptimizedNavigationScale(
            visualIntensity,
            moodIdentifier
          );
        const root = this.utils.getRootStyle();
        if (!root) return;
        const hueShift = (1 - rawValence) * 30 - 15;
        const saturationBoost = 1 + rawEnergy * 0.2;
        const brightnessFactor = 1 + visualIntensity * 0.05;
        const queueCSSUpdate = (property, value) => {
          if (
            this.year3000System &&
            this.year3000System.queueCSSVariableUpdate
          ) {
            this.year3000System.queueCSSVariableUpdate(property, value);
          } else {
            try {
              root.style.setProperty(property, value);
            } catch (e) {}
          }
        };
        queueCSSUpdate("--sn-nexus-hue-shift", `${hueShift.toFixed(1)}deg`);
        queueCSSUpdate(
          "--sn-nexus-saturation-boost",
          `${saturationBoost.toFixed(2)}`
        );
        queueCSSUpdate(
          "--sn-nexus-brightness-factor",
          `${brightnessFactor.toFixed(2)}`
        );
        const patternRotation = (visualIntensity * 360 + Date.now() / 50) % 360;
        queueCSSUpdate(
          "--sn-nexus-pattern-rotation",
          `${patternRotation.toFixed(1)}deg`
        );
        queueCSSUpdate(
          "--sn-nexus-pattern-complexity",
          visualIntensity.toFixed(2)
        );
        this.updateIntegrationMetrics();
      } catch (error) {
        this.systemIntegrationMetrics.crossSystemErrors++;
        console.warn(
          `\u{1F30C} [${this.systemName}] Error in updateNexusTargets:`,
          error
        );
        this.applySafeDefaults();
      }
    }
    /**
     * Digital meditation state update (preserved - core Year 3000 feature)
     */
    updateDigitalMeditationState(processedMusicData) {
      const { visualIntensity = 0.5, moodIdentifier = "neutral" } =
        processedMusicData || {};
      const now = Date.now();
      const timeSinceLastInteraction =
        now - this.biometricState.lastUserInteractionTime;
      const isCalmMusic =
        visualIntensity < 0.25 &&
        (moodIdentifier.includes("calm") ||
          moodIdentifier.includes("sad") ||
          moodIdentifier === "neutral");
      if (this.biometricState.isMeditating) {
        if (
          !isCalmMusic ||
          timeSinceLastInteraction < this.biometricState.meditationGracePeriod
        ) {
          this.biometricState.isMeditating = false;
          this.systemIntegrationMetrics.meditationTransitions++;
        }
      } else {
        if (
          isCalmMusic &&
          timeSinceLastInteraction >
            this.biometricState.meditationGracePeriod +
              this.biometricState.interactionCooldown
        ) {
          this.biometricState.isMeditating = true;
          this.systemIntegrationMetrics.meditationTransitions++;
        }
      }
      if (this.biometricState.isMeditating) {
        this.biometricState.targetDesaturation = 0.45;
        this.biometricState.targetSlowdown = 0.6;
      } else {
        this.biometricState.targetDesaturation = 0;
        this.biometricState.targetSlowdown = 1;
      }
    }
    /**
     * PERFORMANCE OPTIMIZATION: Unified animation update for Master Animation Coordinator
     */
    updateAnimation(timestamp, deltaTime) {
      if (!this.isInitialized) return;
      this.frameCount++;
      const frameStart = performance.now();
      const musicData = this.musicSyncService?.getLatestProcessedData() || {};
      if (this.config.enableNexusMotion) {
        this.updateNexusMotion(musicData, deltaTime);
      }
      if (frameStart - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
        this.lastHeavyUpdateTime = frameStart;
        this.updateNexusTargets(musicData);
      }
      if (
        frameStart - this.lastBiometricCheckTime >
        this.biometricCheckInterval
      ) {
        this.lastBiometricCheckTime = frameStart;
        this.updateDigitalMeditationState(musicData);
      }
    }
    /**
     * Handle performance mode changes
     */
    onPerformanceModeChange(mode) {
      this._performanceMode = mode;
      if (mode === "performance") {
        this._maxFrameSkip = 3;
        this.heavyUpdateInterval = 1e3 / 5;
      } else {
        this._maxFrameSkip = 2;
        this.heavyUpdateInterval = 1e3 / 10;
      }
      if (this.config?.enableDebug) {
        console.log(`\u26A1 [${this.systemName}] Performance mode: ${mode}`);
      }
    }
    /**
     * Fallback animation loops
     */
    _startFallbackAnimationLoops() {
      if (
        this.year3000System &&
        this.year3000System.registerConsolidatedTimer
      ) {
        this.year3000System.registerConsolidatedTimer(
          "DimensionalNexusFrameUpdate",
          () => this.animateOptimizedNexusFrame(),
          1e3 / 30,
          // 30fps
          "normal"
        );
      }
    }
    /**
     * Optimized nexus frame animation (reduced complexity)
     */
    animateOptimizedNexusFrame(deltaTimeMs = null) {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const lerpSpeed = 0.15;
      this.nexusState.complexity = this.utils.lerpSmooth(
        this.nexusState.complexity,
        this.nexusState.targetComplexity,
        lerpSpeed,
        0.5
      );
      this.nexusState.coherence = this.utils.lerpSmooth(
        this.nexusState.coherence,
        this.nexusState.targetCoherence,
        lerpSpeed,
        0.8
      );
      this.nexusState.volatility = this.utils.lerpSmooth(
        this.nexusState.volatility,
        this.nexusState.targetVolatility,
        lerpSpeed,
        1
      );
      this.nexusState.timeDistortionFactor = this.utils.lerpSmooth(
        this.nexusState.timeDistortionFactor,
        this.nexusState.targetTimeDistortionFactor,
        lerpSpeed,
        0.4
      );
      this.nexusState.currentNavigationScale = this.utils.lerpSmooth(
        this.nexusState.currentNavigationScale,
        this.nexusState.targetNavigationScale,
        lerpSpeed,
        0.8
      );
      this.nexusState.userInfluence *= 0.99;
      const now = Date.now();
      const lerpDeltaTime =
        (now - (this.biometricState.lastMeditationUpdateTime || now)) / 1e3;
      this.biometricState.lastMeditationUpdateTime = now;
      this.biometricState.desaturation = this.utils.lerpSmooth(
        this.biometricState.desaturation,
        this.biometricState.targetDesaturation,
        lerpDeltaTime,
        0.8
      );
      this.biometricState.slowdown = this.utils.lerpSmooth(
        this.biometricState.slowdown,
        this.biometricState.targetSlowdown,
        lerpDeltaTime,
        0.8
      );
      this.applyOptimizedStateToCSS();
      if (this.config?.enableDebug && Math.random() < 5e-3) {
        console.log(`\u{1F30C} [${this.systemName}] Nexus frame animated.`, {
          complexity: this.nexusState.complexity.toFixed(3),
          meditation: this.biometricState.desaturation.toFixed(3),
        });
      }
    }
    /**
     * Optimized CSS state application (batched updates)
     */
    applyOptimizedStateToCSS() {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const queueCSSUpdate = (property, value) => {
        if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(property, value);
        } else {
          try {
            if (isFinite(value)) {
              root.style.setProperty(property, value.toString());
            }
          } catch (e) {}
        }
      };
      queueCSSUpdate(
        "--sn-nexus-complexity",
        this.nexusState.complexity.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-nexus-coherence",
        this.nexusState.coherence.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-nexus-volatility",
        this.nexusState.volatility.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-nexus-time-distortion",
        this.nexusState.timeDistortionFactor.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-nexus-user-influence",
        this.nexusState.userInfluence.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-nav-item-transform-scale",
        this.nexusState.currentNavigationScale.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-sidebar-meditation-desaturation",
        this.biometricState.desaturation.toFixed(2)
      );
      queueCSSUpdate(
        "--sn-sidebar-meditation-slowdown",
        this.biometricState.slowdown.toFixed(2)
      );
      const adjustedNeuralSpeed = (2 / this.biometricState.slowdown).toFixed(1);
      const adjustedTemporalSpeed = (
        1.5 / this.biometricState.slowdown
      ).toFixed(1);
      queueCSSUpdate("--sn-neural-flow-speed", `${adjustedNeuralSpeed}s`);
      queueCSSUpdate(
        "--sn-temporal-animation-speed",
        `${adjustedTemporalSpeed}s`
      );
      const sidebarElement = findElementWithFallback(
        MODERN_SELECTORS.leftSidebar
      );
      if (sidebarElement) {
        const isMeditating =
          this.biometricState.isMeditating &&
          this.biometricState.desaturation > 0.1;
        sidebarElement.classList.toggle("sn-digital-meditation", isMeditating);
      }
    }
    validateMusicData(data) {
      if (!data) return false;
      const requiredFields = [
        "visualIntensity",
        "moodIdentifier",
        "rawEnergy",
        "rawValence",
      ];
      return requiredFields.every((field) => data.hasOwnProperty(field));
    }
    applySafeDefaults() {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const safeSetProperty = (name, value) => {
        try {
          root.style.setProperty(name, value);
        } catch (e) {}
      };
      safeSetProperty("--sn-nav-item-transform-scale", "1.0");
      safeSetProperty("--sn-sidebar-meditation-desaturation", "0");
      safeSetProperty("--sn-sidebar-meditation-slowdown", "1");
    }
    updateIntegrationMetrics() {
      const now = Date.now();
      if (now - this.systemIntegrationMetrics.lastSystemsCheck > 1e4) {
        this.systemIntegrationMetrics.lastSystemsCheck = now;
        const memoryUsage = this._getMemoryUsage();
        const animationComplexity = this.calculateIntegrationComplexity();
        const healthMonitor = this.utils.getHealthMonitor();
        if (healthMonitor) {
          healthMonitor.updateSystemMetrics("DimensionalNexusSystem", {
            memoryUsage,
            errorCount: this.systemIntegrationMetrics.crossSystemErrors,
            animationComplexity,
            meditationTransitions:
              this.systemIntegrationMetrics.meditationTransitions,
            navigationUpdates:
              this.systemIntegrationMetrics.navigationScaleUpdates,
          });
        }
      }
    }
    calculateIntegrationComplexity() {
      let complexity = 0;
      if (this.biometricState.isMeditating) complexity += 10;
      if (this.nexusState.currentNavigationScale > 1.01) complexity += 5;
      if (this.nexusState.volatility > 0.5) complexity += 10;
      return complexity;
    }
    performCleanup() {
      this.systemIntegrationMetrics.crossSystemErrors = Math.max(
        0,
        this.systemIntegrationMetrics.crossSystemErrors - 1
      );
      const now = Date.now();
      if (now - this.biometricState.lastUserInteractionTime > 3e5) {
        this.biometricState.lastUserInteractionTime = now - 3e4;
      }
    }
    /**
     * Optimized navigation scale calculation (simplified)
     */
    calculateOptimizedNavigationScale(
      visualIntensity = 0.5,
      moodIdentifier = "neutral"
    ) {
      const baseScale = 1 + visualIntensity * 0.02;
      let moodModifier = 0;
      if (
        moodIdentifier.includes("energetic") ||
        moodIdentifier.includes("danceable")
      ) {
        moodModifier = 3e-3;
      }
      return Math.max(1, Math.min(1.025, baseScale + moodModifier));
    }
    getNavigationScalingReport() {
      return {
        currentScale: this.nexusState.currentNavigationScale.toFixed(4),
        targetScale: this.nexusState.targetNavigationScale.toFixed(4),
        lastVisualIntensity: this.nexusState.lastVisualIntensity.toFixed(3),
        lastMood: this.nexusState.lastMoodIdentifier,
        isResponsive:
          Math.abs(
            this.nexusState.currentNavigationScale -
              this.nexusState.targetNavigationScale
          ) < 1e-3,
      };
    }
    getMeditationReport() {
      const timeSinceLastInteraction =
        Date.now() - this.biometricState.lastUserInteractionTime;
      const currentDesaturation = this.biometricState.desaturation;
      const currentSlowdown = this.biometricState.slowdown;
      return {
        isMeditating: this.biometricState.isMeditating,
        timeSinceLastInteraction: Math.round(timeSinceLastInteraction / 1e3),
        meditationGracePeriod: this.biometricState.meditationGracePeriod / 1e3,
        currentDesaturation: currentDesaturation.toFixed(3),
        currentSlowdown: currentSlowdown.toFixed(3),
        meditationDepth: this.biometricState.isMeditating
          ? ((currentDesaturation / 0.45) * 100).toFixed(1) + "%"
          : "0%",
      };
    }
    // ===== YEAR 3000 MODE CONFIGURATION =====
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const {
        enabled,
        temporalEcho,
        aestheticGravity,
        quantumEmpathy,
        intensity,
      } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Optimized dimensional nexus destroyed and cleaned up.`
        );
      }
    }
  };

  // src-js/systems/visual/LightweightParticleSystem.js
  init_Year3000Utilities();
  init_BaseVisualSystem();
  var LightweightParticleSystem = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager,
        year3000System
      );
      this.year3000System = year3000System;
      this.canvas = null;
      this.ctx = null;
      this.particlePool = [];
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName} Constructor] Config after super():`,
          JSON.parse(JSON.stringify(this.config))
        );
      }
      this.maxParticles =
        this.config?.performanceProfiles?.balanced?.maxParticles || 75;
      this.animationId = null;
      this.lastSpawnTime = 0;
      this.spawnCooldown = 80;
      this.lastFrameTime = performance.now();
      this.particleHalfLife = 0.08;
      this.boundResizeCanvas = this.resizeCanvas.bind(this);
      this._animationRegistered = false;
      this._performanceMode = "auto";
      this._frameSkipCounter = 0;
      this._maxFrameSkip = 2;
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Constructor called with Master Animation Coordinator support. Initial max particles (from balanced profile or default): ${this.maxParticles}`
        );
      }
    }
    async initialize() {
      await super.initialize();
      this.createCanvas();
      this.initializeParticlePool();
      this._updateParticleSettingsFromProfile();
      this.lastFrameTime = performance.now();
      this.startRenderLoop();
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and render loop started.`
        );
      }
    }
    _applyPerformanceProfile(quality) {
      super._applyPerformanceProfile(quality);
      this._updateParticleSettingsFromProfile();
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Overridden _applyPerformanceProfile. Max particles now: ${this.maxParticles}`
        );
      }
    }
    _updateParticleSettingsFromProfile() {
      if (
        this.currentPerformanceProfile &&
        this.currentPerformanceProfile.maxParticles
      ) {
        this.maxParticles = this.currentPerformanceProfile.maxParticles;
      } else {
        this.maxParticles =
          this.config?.performanceProfiles?.balanced?.maxParticles || 75;
      }
    }
    createCanvas() {
      this.canvas = this._createCanvasElement(
        "sn-particle-canvas",
        3,
        "screen"
      );
      this.ctx = this.canvas.getContext("2d");
    }
    resizeCanvas() {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    }
    initializeParticlePool() {
      this.particlePool = [];
      for (let i = 0; i < this.maxParticles * 2; i++) {
        this.particlePool.push({
          active: false,
          targetX: 0,
          targetY: 0,
          vx: 0,
          vy: 0,
          targetRotation: 0,
          vr: 0,
          currentX: 0,
          currentY: 0,
          currentSize: 0,
          currentOpacity: 0,
          currentRotation: 0,
          targetSize: 1,
          targetOpacity: 0,
          baseSize: 1,
          baseOpacity: 0.5,
          life: 0,
          maxLife: 1e3,
          color: "rgba(255,255,255,0.5)",
        });
      }
    }
    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      const currentTime = performance.now();
      const {
        processedEnergy,
        visualIntensity,
        animationSpeedFactor,
        moodIdentifier,
      } = processedMusicData;
      const dynamicSpawnCooldown = Math.max(
        50,
        this.spawnCooldown / (animationSpeedFactor || 1)
      );
      if (
        processedEnergy > 0.45 &&
        visualIntensity > 0.3 &&
        currentTime - this.lastSpawnTime > dynamicSpawnCooldown
      ) {
        const numToSpawn = Math.max(
          1,
          Math.floor(visualIntensity * 5 + processedEnergy * 3)
        );
        for (let i = 0; i < numToSpawn; i++) {
          if (
            this.particlePool.filter((p) => p.active).length < this.maxParticles
          ) {
            this.spawnParticle(
              processedEnergy,
              visualIntensity,
              animationSpeedFactor,
              moodIdentifier
            );
          } else {
            if (
              this.config.YEAR3000_CONFIG.enableDebug &&
              Math.random() < 0.1
            ) {
            }
            break;
          }
        }
        this.lastSpawnTime = currentTime;
      }
    }
    spawnParticle(energy, intensity, speedFactor, mood) {
      const particle = this.particlePool.find((p) => !p.active);
      if (!particle) return;
      const rootStyle = Year3000Utilities.getRootStyle();
      const primaryRgbStr =
        rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
        "202,158,230";
      const accentRgbStr =
        rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
        "140,170,238";
      particle.active = true;
      particle.currentX = Math.random() * this.canvas.width;
      particle.currentY = this.canvas.height + Math.random() * 30 + 20;
      particle.targetX = particle.currentX;
      particle.targetY = particle.currentY;
      particle.vx = (Math.random() - 0.5) * 3 * (speedFactor || 1);
      particle.vy =
        -(1.5 + Math.random() * 2.5 + energy * 3) * (speedFactor || 1);
      particle.maxLife = 2500 + Math.random() * 3500 * intensity;
      particle.life = particle.maxLife;
      particle.baseSize = 1.5 + Math.random() * 2.5 + intensity * 2.5;
      particle.currentSize = 0;
      particle.targetSize = particle.baseSize;
      particle.baseOpacity = 0.4 + Math.random() * 0.5;
      particle.currentOpacity = 0;
      particle.targetOpacity = particle.baseOpacity;
      const baseColor =
        (mood && mood.includes("happy")) || Math.random() > 0.6
          ? primaryRgbStr
          : accentRgbStr;
      particle.color = `rgba(${baseColor},1)`;
      particle.currentRotation = Math.random() * Math.PI * 2;
      particle.targetRotation = particle.currentRotation;
      particle.vr = (Math.random() - 0.5) * 0.08 * (speedFactor || 1);
    }
    startRenderLoop() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        this.year3000System.registerAnimationSystem(
          "LightweightParticleSystem",
          this,
          "background",
          // Background priority for particle effects
          30
          // 30fps target for particles (lower than critical systems)
        );
        this._animationRegistered = true;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Registered with Master Animation Coordinator (background priority, 30fps)`
          );
        }
      } else {
        this._startSelfManagedLoop();
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Using fallback self-managed animation loop`
          );
        }
      }
    }
    /**
     * PERFORMANCE OPTIMIZATION: Animation update method for Master Animation Coordinator
     * Called by the master coordinator with controlled timing
     * @param {number} timestamp - Current timestamp
     * @param {number} deltaTime - Time since last frame
     */
    updateAnimation(timestamp, deltaTime) {
      if (!this.isInitialized || !this.canvas || !this.ctx) {
        return;
      }
      if (this._performanceMode === "performance") {
        this._frameSkipCounter++;
        if (this._frameSkipCounter < this._maxFrameSkip) {
          return;
        }
        this._frameSkipCounter = 0;
      }
      const deltaSeconds = deltaTime / 1e3;
      this.lastFrameTime = timestamp;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let activeParticleCount = 0;
      this.particlePool.forEach((p) => {
        if (p.active) {
          activeParticleCount++;
          p.life -= deltaSeconds * 1e3;
          if (p.life <= 0) {
            p.active = false;
            p.currentOpacity = 0;
            return;
          }
          p.targetX += p.vx * deltaSeconds * 60;
          p.targetY += p.vy * deltaSeconds * 60;
          p.vy += 0.035 * (p.baseSize / 2) * deltaSeconds * 60;
          p.targetRotation += p.vr * deltaSeconds * 60;
          p.currentX = Year3000Utilities.lerpSmooth(
            p.currentX,
            p.targetX,
            deltaSeconds,
            this.particleHalfLife
          );
          p.currentY = Year3000Utilities.lerpSmooth(
            p.currentY,
            p.targetY,
            deltaSeconds,
            this.particleHalfLife
          );
          p.currentRotation = Year3000Utilities.lerpSmooth(
            p.currentRotation,
            p.targetRotation,
            deltaSeconds,
            this.particleHalfLife
          );
          const lifeRatio = Math.max(0, p.life / p.maxLife);
          p.targetSize = p.baseSize * (lifeRatio * 0.8 + 0.2);
          p.targetOpacity = p.baseOpacity * lifeRatio;
          p.currentSize = Year3000Utilities.lerpSmooth(
            p.currentSize,
            p.targetSize,
            deltaSeconds,
            this.particleHalfLife * 0.8
          );
          p.currentOpacity = Year3000Utilities.lerpSmooth(
            p.currentOpacity,
            p.targetOpacity,
            deltaSeconds,
            this.particleHalfLife * 0.8
          );
          if (p.currentOpacity > 0.01 && p.currentSize > 0.1) {
            this.ctx.save();
            this.ctx.translate(p.currentX, p.currentY);
            this.ctx.rotate(p.currentRotation);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, Math.max(0, p.currentSize / 2), 0, Math.PI * 2);
            this.ctx.fillStyle = p.color.replace(
              /,\s*\d+(\.\d+)?\)/,
              `,${Math.max(0, Math.min(1, p.currentOpacity)).toFixed(3)})`
            );
            this.ctx.fill();
            this.ctx.restore();
          }
        }
      });
      if (
        this.config?.enableDebug &&
        activeParticleCount > this.maxParticles * 0.8 &&
        Math.random() < 0.01
      ) {
        console.log(
          `\u2728 [${this.systemName}] High particle load: ${activeParticleCount}/${this.maxParticles}`
        );
      }
    }
    /**
     * PERFORMANCE OPTIMIZATION: Handle performance mode changes from Master Animation Coordinator
     * @param {string} mode - Performance mode: 'performance' or 'quality'
     */
    onPerformanceModeChange(mode) {
      this._performanceMode = mode;
      if (mode === "performance") {
        this.maxParticles = Math.floor(this.maxParticles * 0.6);
        this.spawnCooldown = Math.max(this.spawnCooldown * 1.5, 120);
        this._maxFrameSkip = 3;
      } else {
        this._updateParticleSettingsFromProfile();
        this._maxFrameSkip = 2;
      }
      if (this.config?.enableDebug) {
        console.log(
          `\u26A1 [${this.systemName}] Performance mode changed to: ${mode}, max particles: ${this.maxParticles}`
        );
      }
    }
    /**
     * Fallback self-managed animation loop for backward compatibility
     */
    _startSelfManagedLoop() {
      if (this.animationId) {
        this._cancelAnimationFrame(this.animationId);
      }
      const render = (timestamp) => {
        if (!this.isInitialized || !this.canvas || !this.ctx) {
          if (this.animationId) this._cancelAnimationFrame(this.animationId);
          this.animationId = null;
          return;
        }
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.updateAnimation(timestamp, deltaTime);
        if (this.isInitialized) {
          this.animationId = this._requestAnimationFrame(render);
        }
      };
      this.animationId = this._requestAnimationFrame(render);
    }
    // ===== YEAR 3000 MODE CONFIGURATION =====
    /**
     * Update system configuration based on current artistic mode
     * @param {Object} modeConfig - Configuration from artistic mode profile
     */
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, animations, intensity } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Updating mode configuration:`,
          modeConfig
        );
      }
      this.modeConfig = {
        systemEnabled: enabled !== false,
        particleAnimationsEnabled: animations || false,
        intensityMultiplier: intensity || 1,
      };
      this.updateParticleSystemForMode();
    }
    /**
     * Update particle system behavior based on current mode
     */
    updateParticleSystemForMode() {
      if (!this.modeConfig) return;
      const baseMultiplier = this.modeConfig.intensityMultiplier || 1;
      if (this.modeConfig.systemEnabled) {
        const modeParticleCount = Math.floor(
          this.maxParticles * baseMultiplier
        );
        this.maxParticles = Math.min(modeParticleCount, this.maxParticles * 2);
      } else {
        this.maxParticles = Math.floor(this.maxParticles * 0.3);
      }
      this.spawnCooldown = this.modeConfig.particleAnimationsEnabled
        ? Math.max(30, 80 / baseMultiplier)
        : 150;
      this.particleHalfLife = this.modeConfig.particleAnimationsEnabled
        ? 0.08 * baseMultiplier
        : 0.04;
      if (this.config?.enableDebug) {
        console.log(
          `\u2728 [${this.systemName}] Updated for mode - Max particles: ${this.maxParticles}, Spawn cooldown: ${this.spawnCooldown}`
        );
      }
    }
    destroy() {
      if (
        this._animationRegistered &&
        this.year3000System &&
        this.year3000System.unregisterAnimationSystem
      ) {
        this.year3000System.unregisterAnimationSystem(
          "LightweightParticleSystem"
        );
        this._animationRegistered = false;
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Unregistered from Master Animation Coordinator`
          );
        }
      }
      if (this.animationId) {
        this._cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
      }
      this.ctx = null;
      this.particlePool = [];
      if (this.config?.enableDebug) {
        console.log(`[${this.systemName}] Destroyed and cleaned up.`);
      }
    }
  };

  // src-js/systems/visual/PredictiveMaterializationSystem.js
  init_Year3000Utilities();
  init_BaseVisualSystem();
  var PredictiveMaterializationSystem = class extends BaseVisualSystem {
    constructor(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System = null
    ) {
      super(
        config,
        utils,
        performanceMonitor,
        musicSyncService,
        settingsManager,
        year3000System
      );
      this.materializationState = {
        imminence: 0,
        // How close something is to "materializing"
        clarity: 0,
        // How clear the materialized element is
        targetElement: null,
        // Could be a predicted next track, UI element etc.
      };
      this.rootElement = Year3000Utilities.getRootStyle();
      if (this.config?.enableDebug) {
        console.log(`[${this.systemName} Constructor] Initialized.`);
      }
    }
    async initialize() {
      await super.initialize();
      this._setInitialMaterializationCSS();
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and initial CSS variables set.`
        );
      }
    }
    _setInitialMaterializationCSS() {
      const safeSetProperty = (name, value) => {
        try {
          this.rootElement.style.setProperty(name, value);
        } catch (e) {
          if (this.config?.enableDebug) {
            console.warn(
              `[${this.systemName}] Error setting CSS variable ${name}:`,
              e.message
            );
          }
        }
      };
      safeSetProperty("--sn-materialize-imminence", "0");
      safeSetProperty("--sn-materialize-clarity", "0");
    }
    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      super.updateFromMusicAnalysis(processedMusicData);
      const {
        segmentTransitionConfidence,
        // Confidence that a new major segment is approaching
        visualIntensity,
        energy,
        valence,
      } = processedMusicData;
      let targetImminence =
        (segmentTransitionConfidence || 0) * 0.6 +
        energy * 0.3 +
        visualIntensity * 0.1;
      let targetClarity = valence * 0.5 + visualIntensity * 0.3 + energy * 0.2;
      this.materializationState.imminence = Year3000Utilities.lerpSmooth(
        this.materializationState.imminence,
        targetImminence,
        0.1,
        0.2
      );
      this.materializationState.clarity = Year3000Utilities.lerpSmooth(
        this.materializationState.clarity,
        targetClarity,
        0.1,
        0.25
      );
      this.materializationState.imminence = Math.max(
        0,
        Math.min(1, this.materializationState.imminence)
      );
      this.materializationState.clarity = Math.max(
        0,
        Math.min(1, this.materializationState.clarity)
      );
      const safeSetProperty = (name, value) => {
        try {
          this.rootElement.style.setProperty(name, value);
        } catch (e) {
          if (this.config?.enableDebug) {
            console.warn(
              `[${this.systemName}] Error setting CSS variable ${name} during update:`,
              e.message
            );
          }
        }
      };
      safeSetProperty(
        "--sn-materialize-imminence",
        `${this.materializationState.imminence.toFixed(3)}`
      );
      safeSetProperty(
        "--sn-materialize-clarity",
        `${this.materializationState.clarity.toFixed(3)}`
      );
      if (this.config?.enableDebug && Math.random() < 0.01) {
        console.log(
          `[${
            this.systemName
          }] Materialization state updated: Imminence=${this.materializationState.imminence.toFixed(
            2
          )}, Clarity=${this.materializationState.clarity.toFixed(2)}`
        );
      }
    }
    // ===== YEAR 3000 MODE CONFIGURATION =====
    /**
     * Update system configuration based on current artistic mode
     * @param {Object} modeConfig - Configuration from artistic mode profile
     */
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, animations, intensity } = modeConfig;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3A8} [${this.systemName}] Updating mode configuration:`,
          modeConfig
        );
      }
      this.modeConfig = {
        systemEnabled: enabled !== false,
        materializationAnimationsEnabled: animations || false,
        intensityMultiplier: intensity || 1,
      };
      this.updateMaterializationForMode();
    }
    /**
     * Update materialization behavior based on current mode
     */
    updateMaterializationForMode() {
      if (!this.modeConfig) return;
      const baseIntensity = this.modeConfig.intensityMultiplier || 1;
      this.materializationIntensity = baseIntensity;
      this.materializationSpeed = this.modeConfig
        .materializationAnimationsEnabled
        ? baseIntensity * 1.3
        : baseIntensity * 0.8;
      if (this.config?.enableDebug) {
        console.log(
          `\u2728 [${this.systemName}] Updated materialization - Intensity: ${this.materializationIntensity}, Speed: ${this.materializationSpeed}`
        );
      }
    }
    destroy() {
      super.destroy();
      if (this.config?.enableDebug) {
        console.log(`[${this.systemName}] Destroyed and cleaned up.`);
      }
    }
  };

  // src-js/core/year3000System.js
  init_SidebarConsciousnessSystem();
  init_Year3000Utilities();

  // src-js/core/CSSVariableBatcher.js
  var CSSVariableBatcher = class {
    constructor(config = {}) {
      this.config = {
        batchIntervalMs: config.batchIntervalMs || 16,
        // ~60fps batch rate
        maxBatchSize: config.maxBatchSize || 50,
        enableDebug: config.enableDebug || false,
        ...config,
      };
      this._cssVariableBatcher = {
        pendingUpdates: /* @__PURE__ */ new Map(),
        batchTimeout: null,
        batchIntervalMs: this.config.batchIntervalMs,
        maxBatchSize: this.config.maxBatchSize,
        totalUpdates: 0,
        batchCount: 0,
        enabled: true,
      };
      this._performanceMetrics = {
        totalBatches: 0,
        totalUpdates: 0,
        totalBatchTime: 0,
        maxBatchTime: 0,
        averageBatchSize: 0,
        overBudgetBatches: 0,
      };
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Initialized");
      }
    }
    /**
     * Queue a CSS variable update for batched application
     * @param {string} property - CSS property name
     * @param {string} value - CSS property value
     * @param {Element} element - Target element (defaults to document root)
     */
    queueCSSVariableUpdate(property, value, element = null) {
      if (!this._cssVariableBatcher.enabled) {
        const target2 = element || document.documentElement;
        target2.style.setProperty(property, value);
        return;
      }
      const target = element || document.documentElement;
      const elementKey = element
        ? `element_${element.id || element.className || "unnamed"}`
        : "root";
      const updateKey = `${elementKey}:${property}`;
      this._cssVariableBatcher.pendingUpdates.set(updateKey, {
        element: target,
        property,
        value,
        timestamp: performance.now(),
      });
      this._cssVariableBatcher.totalUpdates++;
      this._performanceMetrics.totalUpdates++;
      if (!this._cssVariableBatcher.batchTimeout) {
        this._cssVariableBatcher.batchTimeout = setTimeout(() => {
          this._processCSSVariableBatch();
        }, this._cssVariableBatcher.batchIntervalMs);
      }
      if (
        this._cssVariableBatcher.pendingUpdates.size >=
        this._cssVariableBatcher.maxBatchSize
      ) {
        this._processCSSVariableBatch();
      }
    }
    /**
     * Process pending CSS variable updates in batch
     */
    _processCSSVariableBatch() {
      if (
        !this._cssVariableBatcher ||
        this._cssVariableBatcher.pendingUpdates.size === 0
      ) {
        return;
      }
      const startTime = performance.now();
      const updates = Array.from(
        this._cssVariableBatcher.pendingUpdates.values()
      );
      this._cssVariableBatcher.pendingUpdates.clear();
      if (this._cssVariableBatcher.batchTimeout) {
        clearTimeout(this._cssVariableBatcher.batchTimeout);
        this._cssVariableBatcher.batchTimeout = null;
      }
      try {
        const updatesByElement = /* @__PURE__ */ new Map();
        updates.forEach((update) => {
          const elementKey =
            update.element === document.documentElement
              ? "root"
              : update.element;
          if (!updatesByElement.has(elementKey)) {
            updatesByElement.set(elementKey, []);
          }
          updatesByElement.get(elementKey).push(update);
        });
        updatesByElement.forEach((elementUpdates, elementKey) => {
          const element = elementUpdates[0].element;
          if (elementUpdates.length > 3) {
            let cssText = element.style.cssText;
            elementUpdates.forEach((update) => {
              const propertyPattern = new RegExp(
                `${update.property.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                )}:[^;]*;?`,
                "g"
              );
              cssText = cssText.replace(propertyPattern, "");
              cssText += `${update.property}:${update.value};`;
            });
            element.style.cssText = cssText;
          } else {
            elementUpdates.forEach((update) => {
              element.style.setProperty(update.property, update.value);
            });
          }
        });
        this._cssVariableBatcher.batchCount++;
        this._performanceMetrics.totalBatches++;
        const batchTime = performance.now() - startTime;
        this._performanceMetrics.totalBatchTime += batchTime;
        this._performanceMetrics.maxBatchTime = Math.max(
          this._performanceMetrics.maxBatchTime,
          batchTime
        );
        this._performanceMetrics.averageBatchSize =
          this._performanceMetrics.totalUpdates /
          this._performanceMetrics.totalBatches;
        if (batchTime > 8) {
          this._performanceMetrics.overBudgetBatches++;
          if (this.config.enableDebug) {
            console.warn(
              `[CSSVariableBatcher] CSS batch took ${batchTime.toFixed(
                2
              )}ms for ${updates.length} updates`
            );
          }
          if (batchTime > 16) {
            this._cssVariableBatcher.enabled = false;
            setTimeout(() => {
              if (this._cssVariableBatcher) {
                this._cssVariableBatcher.enabled = true;
              }
            }, 5e3);
          }
        }
        if (this.config.enableDebug && Math.random() < 0.1) {
          console.log(
            `\u{1F3A8} [CSSVariableBatcher] Processed CSS batch: ${
              updates.length
            } updates in ${batchTime.toFixed(2)}ms`
          );
        }
      } catch (error) {
        console.error(
          "[CSSVariableBatcher] Error processing CSS variable batch:",
          error
        );
        updates.forEach((update) => {
          try {
            update.element.style.setProperty(update.property, update.value);
          } catch (e) {
            console.warn(
              `[CSSVariableBatcher] Failed to apply CSS property ${update.property}:`,
              e
            );
          }
        });
      }
    }
    /**
     * Force immediate processing of all pending CSS variable updates
     */
    flushCSSVariableBatch() {
      if (this._cssVariableBatcher?.batchTimeout) {
        clearTimeout(this._cssVariableBatcher.batchTimeout);
        this._cssVariableBatcher.batchTimeout = null;
      }
      this._processCSSVariableBatch();
    }
    /**
     * Enable or disable CSS variable batching
     * @param {boolean} enabled - Whether to enable batching
     */
    setBatchingEnabled(enabled) {
      this._cssVariableBatcher.enabled = enabled;
      if (!enabled) {
        this.flushCSSVariableBatch();
      }
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3A8} [CSSVariableBatcher] Batching ${
            enabled ? "enabled" : "disabled"
          }`
        );
      }
    }
    /**
     * Update batching configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      if (newConfig.batchIntervalMs) {
        this._cssVariableBatcher.batchIntervalMs = newConfig.batchIntervalMs;
      }
      if (newConfig.maxBatchSize) {
        this._cssVariableBatcher.maxBatchSize = newConfig.maxBatchSize;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3A8} [CSSVariableBatcher] Configuration updated:",
          newConfig
        );
      }
    }
    /**
     * Get CSS variable batching performance report
     * @returns {Object} Batching system metrics
     */
    getPerformanceReport() {
      if (!this._cssVariableBatcher) {
        return { enabled: false, reason: "CSS batching not initialized" };
      }
      const averageBatchTime =
        this._performanceMetrics.totalBatches > 0
          ? this._performanceMetrics.totalBatchTime /
            this._performanceMetrics.totalBatches
          : 0;
      const estimatedSavings =
        this._performanceMetrics.totalBatches > 0
          ? Math.round(
              ((this._performanceMetrics.totalUpdates -
                this._performanceMetrics.totalBatches) /
                this._performanceMetrics.totalUpdates) *
                100
            )
          : 0;
      return {
        enabled: this._cssVariableBatcher.enabled,
        pendingUpdates: this._cssVariableBatcher.pendingUpdates.size,
        totalUpdates: this._performanceMetrics.totalUpdates,
        totalBatches: this._performanceMetrics.totalBatches,
        averageBatchSize:
          Math.round(this._performanceMetrics.averageBatchSize * 10) / 10,
        averageBatchTime: Math.round(averageBatchTime * 100) / 100,
        maxBatchTime:
          Math.round(this._performanceMetrics.maxBatchTime * 100) / 100,
        overBudgetBatches: this._performanceMetrics.overBudgetBatches,
        batchInterval: this._cssVariableBatcher.batchIntervalMs,
        maxBatchSize: this._cssVariableBatcher.maxBatchSize,
        performance: {
          estimatedDomManipulationReduction: estimatedSavings,
          efficiency: this._calculateEfficiency(),
        },
        recommendations: this._generateBatchingRecommendations(),
      };
    }
    /**
     * Calculate batching efficiency
     * @returns {string} Efficiency rating
     */
    _calculateEfficiency() {
      if (this._performanceMetrics.totalBatches === 0) return "unknown";
      const averageBatchSize = this._performanceMetrics.averageBatchSize;
      const overBudgetRate =
        this._performanceMetrics.overBudgetBatches /
        this._performanceMetrics.totalBatches;
      if (averageBatchSize > 10 && overBudgetRate < 0.1) return "excellent";
      if (averageBatchSize > 5 && overBudgetRate < 0.2) return "good";
      if (averageBatchSize > 2 && overBudgetRate < 0.3) return "fair";
      return "poor";
    }
    /**
     * Generate batching optimization recommendations
     * @returns {Array} Array of recommendations
     */
    _generateBatchingRecommendations() {
      const recommendations = [];
      if (this._performanceMetrics.averageBatchSize < 2) {
        recommendations.push({
          type: "batch_size",
          priority: "low",
          message:
            "Average batch size is small - consider increasing batch interval",
          action: "Increase batchIntervalMs to collect more updates per batch",
        });
      }
      if (
        this._performanceMetrics.overBudgetBatches >
        this._performanceMetrics.totalBatches * 0.2
      ) {
        recommendations.push({
          type: "performance",
          priority: "medium",
          message: "Frequent over-budget batches detected",
          action: "Reduce maxBatchSize or optimize CSS property updates",
        });
      }
      if (this._performanceMetrics.maxBatchTime > 16) {
        recommendations.push({
          type: "performance",
          priority: "high",
          message: `Maximum batch time is high (${this._performanceMetrics.maxBatchTime.toFixed(
            2
          )}ms)`,
          action: "Consider reducing batch size or optimizing CSS updates",
        });
      }
      if (
        this._performanceMetrics.totalUpdates > 1e3 &&
        this._performanceMetrics.averageBatchSize < 5
      ) {
        recommendations.push({
          type: "efficiency",
          priority: "medium",
          message: "High update volume with small batches",
          action: "Tune batching parameters for better efficiency",
        });
      }
      return recommendations;
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
      this._performanceMetrics = {
        totalBatches: 0,
        totalUpdates: 0,
        totalBatchTime: 0,
        maxBatchTime: 0,
        averageBatchSize: 0,
        overBudgetBatches: 0,
      };
      this._cssVariableBatcher.totalUpdates = 0;
      this._cssVariableBatcher.batchCount = 0;
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Performance metrics reset");
      }
    }
    /**
     * Clean up and destroy the batcher
     */
    destroy() {
      this.flushCSSVariableBatch();
      if (this._cssVariableBatcher?.batchTimeout) {
        clearTimeout(this._cssVariableBatcher.batchTimeout);
      }
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Destroyed");
      }
    }
  };

  // src-js/core/DeviceCapabilityDetector.js
  var DeviceCapabilityDetector = class {
    constructor(config = {}) {
      this.config = {
        enableDebug: config.enableDebug || false,
        runStressTests: config.runStressTests !== false,
        // Default true
        ...config,
      };
      this.deviceCapabilities = null;
      this.isInitialized = false;
      this._capabilityTestResults = /* @__PURE__ */ new Map();
      if (this.config.enableDebug) {
        console.log("\u{1F50D} [DeviceCapabilityDetector] Initialized");
      }
    }
    /**
     * Initialize device capability detection
     */
    async initialize() {
      if (this.isInitialized) {
        return this.deviceCapabilities;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u{1F50D} [DeviceCapabilityDetector] Starting capability detection..."
        );
      }
      this.deviceCapabilities = {
        // Memory analysis
        memory: {
          total: navigator.deviceMemory || 4,
          level: this._detectMemoryLevel(),
          jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
          estimatedAvailable: this._estimateAvailableMemory(),
        },
        // CPU analysis
        cpu: {
          cores: navigator.hardwareConcurrency || 2,
          level: this._detectCPULevel(),
          estimatedScore: this._calculateCPUScore(),
        },
        // GPU analysis
        gpu: {
          supportsWebGL: this._detectWebGLSupport(),
          supportsWebGL2: this._detectWebGL2Support(),
          maxTextureSize: this._getMaxTextureSize(),
          level: this._detectGPULevel(),
          vendor: this._getGPUVendor(),
          renderer: this._getGPURenderer(),
        },
        // Browser capabilities
        browser: {
          supportsOffscreenCanvas: this._detectOffscreenCanvasSupport(),
          supportsWorkers: this._detectWorkerSupport(),
          supportsSharedArrayBuffer: this._detectSharedArrayBufferSupport(),
          supportsWASM: this._detectWASMSupport(),
          supportsCSSHoudini: this._detectCSSHoudiniSupport(),
        },
        // Display capabilities
        display: {
          pixelRatio: window.devicePixelRatio || 1,
          refreshRate: await this._detectRefreshRate(),
          colorGamut: this._detectColorGamut(),
          contrastRatio: this._detectContrastCapability(),
          reducedMotion: this._detectReducedMotion(),
        },
        // Network capabilities
        network: {
          effectiveType: navigator.connection?.effectiveType || "unknown",
          downlink: navigator.connection?.downlink || 0,
          rtt: navigator.connection?.rtt || 0,
          saveData: navigator.connection?.saveData || false,
        },
        // Overall performance level
        overall: "detecting",
        // Will be calculated after all tests
      };
      if (this.config.runStressTests) {
        await this._runCapabilityTests();
      }
      this.deviceCapabilities.overall =
        this._calculateOverallPerformanceLevel();
      this.isInitialized = true;
      if (this.config.enableDebug) {
        console.log(
          "\u{1F4CA} [DeviceCapabilityDetector] Capabilities detected:",
          this.deviceCapabilities
        );
      }
      return this.deviceCapabilities;
    }
    // === DEVICE CAPABILITY DETECTION METHODS ===
    _detectMemoryLevel() {
      const memory = navigator.deviceMemory || 4;
      if (memory >= 8) return "high";
      if (memory >= 4) return "medium";
      return "low";
    }
    _estimateAvailableMemory() {
      if (performance.memory) {
        return (
          performance.memory.jsHeapSizeLimit - performance.memory.usedJSHeapSize
        );
      }
      return (navigator.deviceMemory || 4) * 1024 * 1024 * 1024 * 0.7;
    }
    _detectCPULevel() {
      const cores = navigator.hardwareConcurrency || 2;
      if (cores >= 8) return "high";
      if (cores >= 4) return "medium";
      return "low";
    }
    _calculateCPUScore() {
      const start = performance.now();
      let result = 0;
      for (let i = 0; i < 1e5; i++) {
        result += Math.sin(i) * Math.cos(i);
      }
      const duration = performance.now() - start;
      if (duration < 10) return "high";
      if (duration < 25) return "medium";
      return "low";
    }
    _detectWebGLSupport() {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        );
      } catch (e) {
        return false;
      }
    }
    _detectWebGL2Support() {
      try {
        const canvas = document.createElement("canvas");
        return !!canvas.getContext("webgl2");
      } catch (e) {
        return false;
      }
    }
    _getMaxTextureSize() {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
      } catch (e) {
        return 0;
      }
    }
    _detectGPULevel() {
      const renderer = this._getGPURenderer().toLowerCase();
      if (
        renderer.includes("rtx") ||
        renderer.includes("radeon rx") ||
        renderer.includes("gtx 16") ||
        renderer.includes("gtx 20") ||
        renderer.includes("apple m1") ||
        renderer.includes("apple m2")
      ) {
        return "high";
      }
      if (
        renderer.includes("gtx") ||
        renderer.includes("radeon") ||
        renderer.includes("intel iris") ||
        renderer.includes("intel uhd")
      ) {
        return "medium";
      }
      return "low";
    }
    _getGPUVendor() {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "unknown";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          : "unknown";
      } catch (e) {
        return "unknown";
      }
    }
    _getGPURenderer() {
      try {
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "unknown";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "unknown";
      } catch (e) {
        return "unknown";
      }
    }
    _detectOffscreenCanvasSupport() {
      return typeof OffscreenCanvas !== "undefined";
    }
    _detectWorkerSupport() {
      return typeof Worker !== "undefined";
    }
    _detectSharedArrayBufferSupport() {
      return typeof SharedArrayBuffer !== "undefined";
    }
    _detectWASMSupport() {
      return typeof WebAssembly !== "undefined";
    }
    _detectCSSHoudiniSupport() {
      return typeof CSS !== "undefined" && CSS.paintWorklet !== void 0;
    }
    async _detectRefreshRate() {
      return new Promise((resolve) => {
        let lastTime = performance.now();
        let frameCount = 0;
        const samples = [];
        const measure = () => {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;
          samples.push(1e3 / delta);
          lastTime = currentTime;
          frameCount++;
          if (frameCount < 10) {
            requestAnimationFrame(measure);
          } else {
            const avgFPS = samples.reduce((a, b) => a + b, 0) / samples.length;
            resolve(Math.round(avgFPS));
          }
        };
        requestAnimationFrame(measure);
      });
    }
    _detectColorGamut() {
      if (window.matchMedia("(color-gamut: p3)").matches) return "p3";
      if (window.matchMedia("(color-gamut: srgb)").matches) return "srgb";
      return "limited";
    }
    _detectContrastCapability() {
      if (window.matchMedia("(dynamic-range: high)").matches) return "high";
      if (window.matchMedia("(contrast: high)").matches) return "high";
      return "standard";
    }
    _detectReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    // === DYNAMIC CAPABILITY TESTS ===
    async _runCapabilityTests() {
      this.deviceCapabilities.gpu.stressTestScore =
        await this._runGPUStressTest();
      this.deviceCapabilities.memory.stressTestScore =
        await this._runMemoryStressTest();
      if (this.config.enableDebug) {
        console.log(
          "\u26A1 [DeviceCapabilityDetector] Capability tests completed"
        );
      }
    }
    async _runGPUStressTest() {
      return new Promise((resolve) => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 512;
          canvas.height = 512;
          const gl =
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
          if (!gl) {
            resolve(0);
            return;
          }
          const startTime = performance.now();
          const vertexShader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(
            vertexShader,
            `
          attribute vec2 position;
          void main() {
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `
          );
          gl.compileShader(vertexShader);
          const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(
            fragmentShader,
            `
          precision mediump float;
          void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
          }
        `
          );
          gl.compileShader(fragmentShader);
          const program = gl.createProgram();
          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);
          gl.linkProgram(program);
          gl.useProgram(program);
          let frameCount = 0;
          const testFrames = 60;
          const renderFrame = () => {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            frameCount++;
            if (frameCount < testFrames) {
              requestAnimationFrame(renderFrame);
            } else {
              const duration = performance.now() - startTime;
              const score = (testFrames / duration) * 1e3;
              resolve(Math.min(score, 60));
            }
          };
          renderFrame();
        } catch (e) {
          resolve(0);
        }
      });
    }
    async _runMemoryStressTest() {
      return new Promise((resolve) => {
        try {
          const startMemory = performance.memory
            ? performance.memory.usedJSHeapSize
            : 0;
          const arrays = [];
          const startTime = performance.now();
          for (let i = 0; i < 100; i++) {
            arrays.push(new Array(1e4).fill(Math.random()));
          }
          arrays.length = 0;
          setTimeout(() => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            const endMemory = performance.memory
              ? performance.memory.usedJSHeapSize
              : 0;
            const timeScore = Math.max(0, 100 - duration);
            const memoryScore =
              startMemory > 0
                ? Math.max(0, 100 - (endMemory - startMemory) / 1024 / 1024)
                : 50;
            resolve((timeScore + memoryScore) / 2);
          }, 100);
        } catch (e) {
          resolve(0);
        }
      });
    }
    _calculateOverallPerformanceLevel() {
      const scores = {
        memory:
          this.deviceCapabilities.memory.level === "high"
            ? 3
            : this.deviceCapabilities.memory.level === "medium"
            ? 2
            : 1,
        cpu:
          this.deviceCapabilities.cpu.level === "high"
            ? 3
            : this.deviceCapabilities.cpu.level === "medium"
            ? 2
            : 1,
        gpu:
          this.deviceCapabilities.gpu.level === "high"
            ? 3
            : this.deviceCapabilities.gpu.level === "medium"
            ? 2
            : 1,
        browser:
          (this.deviceCapabilities.browser.supportsWebGL ? 1 : 0) +
          (this.deviceCapabilities.browser.supportsWorkers ? 1 : 0) +
          (this.deviceCapabilities.browser.supportsOffscreenCanvas ? 1 : 0),
      };
      const totalScore =
        scores.memory + scores.cpu + scores.gpu + Math.min(scores.browser, 3);
      if (totalScore >= 10) return "high";
      if (totalScore >= 7) return "medium";
      return "low";
    }
    /**
     * Get device capabilities report
     * @returns {Object} Complete device capabilities
     */
    getCapabilities() {
      if (!this.isInitialized) {
        console.warn(
          "[DeviceCapabilityDetector] Not initialized - call initialize() first"
        );
        return null;
      }
      return this.deviceCapabilities;
    }
    /**
     * Get recommendations based on device capabilities
     * @returns {Array} Array of optimization recommendations
     */
    getRecommendations() {
      if (!this.deviceCapabilities) {
        return ["Initialize device capability detection first"];
      }
      const recommendations = [];
      if (this.deviceCapabilities.overall === "low") {
        recommendations.push("Consider enabling performance mode");
        recommendations.push("Reduce visual effect intensity");
        recommendations.push("Disable GPU-intensive features");
      }
      if (this.deviceCapabilities.memory.level === "low") {
        recommendations.push("Enable aggressive memory cleanup");
        recommendations.push("Reduce animation history length");
      }
      if (!this.deviceCapabilities.gpu.supportsWebGL) {
        recommendations.push("Disable WebGL-dependent features");
        recommendations.push("Use CSS-only animations");
      }
      if (this.deviceCapabilities.display.reducedMotion) {
        recommendations.push("Respect reduced motion preference");
        recommendations.push("Use static or minimal animations");
      }
      if (this.deviceCapabilities.network.saveData) {
        recommendations.push("Enable data-saving mode");
        recommendations.push("Reduce resource-intensive operations");
      }
      return recommendations.length > 0
        ? recommendations
        : ["Device capabilities are optimal"];
    }
    /**
     * Check if a specific capability is supported
     * @param {string} capability - Capability to check (e.g., 'webgl', 'workers', 'offscreenCanvas')
     * @returns {boolean} Whether the capability is supported
     */
    supportsCapability(capability) {
      if (!this.deviceCapabilities) return false;
      const capabilityMap = {
        webgl: this.deviceCapabilities.gpu.supportsWebGL,
        webgl2: this.deviceCapabilities.gpu.supportsWebGL2,
        workers: this.deviceCapabilities.browser.supportsWorkers,
        offscreenCanvas:
          this.deviceCapabilities.browser.supportsOffscreenCanvas,
        sharedArrayBuffer:
          this.deviceCapabilities.browser.supportsSharedArrayBuffer,
        wasm: this.deviceCapabilities.browser.supportsWASM,
        cssHoudini: this.deviceCapabilities.browser.supportsCSSHoudini,
        highMemory: this.deviceCapabilities.memory.level === "high",
        highCPU: this.deviceCapabilities.cpu.level === "high",
        highGPU: this.deviceCapabilities.gpu.level === "high",
        reducedMotion: this.deviceCapabilities.display.reducedMotion,
        saveData: this.deviceCapabilities.network.saveData,
      };
      return capabilityMap[capability] || false;
    }
    /**
     * Get optimal settings based on device capabilities
     * @returns {Object} Recommended settings for optimal performance
     */
    getOptimalSettings() {
      if (!this.deviceCapabilities) return {};
      const settings = {
        performanceMode: "auto",
        maxParticles: 100,
        animationQuality: "high",
        enableGPUAcceleration: true,
        batchUpdates: true,
        frameBudget: 16,
      };
      if (this.deviceCapabilities.overall === "low") {
        settings.performanceMode = "performance";
        settings.maxParticles = 20;
        settings.animationQuality = "low";
        settings.frameBudget = 32;
      } else if (this.deviceCapabilities.overall === "medium") {
        settings.maxParticles = 50;
        settings.animationQuality = "medium";
        settings.frameBudget = 20;
      }
      if (!this.deviceCapabilities.gpu.supportsWebGL) {
        settings.enableGPUAcceleration = false;
        settings.animationQuality = "low";
      }
      if (this.deviceCapabilities.memory.level === "low") {
        settings.maxParticles = Math.min(settings.maxParticles, 30);
        settings.batchUpdates = true;
      }
      if (this.deviceCapabilities.display.reducedMotion) {
        settings.animationQuality = "minimal";
        settings.maxParticles = 0;
      }
      if (this.deviceCapabilities.network.saveData) {
        settings.performanceMode = "performance";
        settings.animationQuality = "low";
      }
      return settings;
    }
    /**
     * Clean up and destroy the detector
     */
    destroy() {
      this._capabilityTestResults.clear();
      this.deviceCapabilities = null;
      this.isInitialized = false;
      if (this.config.enableDebug) {
        console.log("\u{1F50D} [DeviceCapabilityDetector] Destroyed");
      }
    }
  };

  // src-js/core/MasterAnimationCoordinator.js
  var MasterAnimationCoordinator = class {
    constructor(config = {}) {
      this.config = {
        frameTimeBudget: config.frameTimeBudget || 16,
        // 16ms target for 60fps
        maxBatchSize: config.maxBatchSize || 50,
        enableDebug: config.enableDebug || false,
        ...config,
      };
      this.masterAnimationController = null;
      this._animationSystemRegistry = /* @__PURE__ */ new Map();
      this._animationFrameId = null;
      this._animationPaused = false;
      this._frameStartTime = 0;
      this._currentFrameTime = 0;
      this._frameTimeBudget = this.config.frameTimeBudget;
      this._performanceMetrics = {
        totalFrames: 0,
        droppedFrames: 0,
        averageFrameTime: 0,
        maxFrameTime: 0,
        systemStats: /* @__PURE__ */ new Map(),
        performanceMode: "auto",
        lastOptimization: 0,
      };
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Initialized");
      }
    }
    /**
     * Initialize the master animation controller
     */
    initialize() {
      if (this.masterAnimationController) {
        console.warn("[MasterAnimationCoordinator] Already initialized");
        return;
      }
      this.masterAnimationController = {
        isRunning: false,
        registeredSystems: /* @__PURE__ */ new Map(),
        frameStartTime: 0,
        lastFrameTime: 0,
        performanceMode: "auto",
        // auto, performance, quality
      };
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Master Animation Controller initialized"
        );
      }
    }
    /**
     * Register an animation system with the master coordinator
     * @param {string} systemName - Unique system identifier
     * @param {Object} system - System instance with updateAnimation method
     * @param {string} priority - Priority level: 'critical', 'normal', 'background'
     * @param {number} targetFPS - Target frame rate (optional, defaults to 60)
     */
    registerAnimationSystem(
      systemName,
      system,
      priority = "normal",
      targetFPS = 60
    ) {
      if (!this.masterAnimationController) {
        this.initialize();
      }
      const systemConfig = {
        system,
        priority,
        targetFPS,
        lastUpdate: 0,
        frameInterval: 1e3 / targetFPS,
        enabled: true,
        frameCount: 0,
        totalTime: 0,
        maxFrameTime: 0,
        skippedFrames: 0,
      };
      this._animationSystemRegistry.set(systemName, systemConfig);
      this._performanceMetrics.systemStats.set(systemName, {
        averageTime: 0,
        maxTime: 0,
        calls: 0,
      });
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3AC} [MasterAnimationCoordinator] Registered animation system: ${systemName} (${priority} priority, ${targetFPS}fps)`
        );
      }
      if (
        this._animationSystemRegistry.size === 1 &&
        !this.masterAnimationController.isRunning
      ) {
        this.startMasterAnimationLoop();
      }
    }
    /**
     * Unregister an animation system
     * @param {string} systemName - System identifier to unregister
     */
    unregisterAnimationSystem(systemName) {
      if (this._animationSystemRegistry.has(systemName)) {
        this._animationSystemRegistry.delete(systemName);
        this._performanceMetrics.systemStats.delete(systemName);
        if (this.config.enableDebug) {
          console.log(
            `\u{1F3AC} [MasterAnimationCoordinator] Unregistered animation system: ${systemName}`
          );
        }
        if (this._animationSystemRegistry.size === 0) {
          this.stopMasterAnimationLoop();
        }
      }
    }
    /**
     * Start the master animation loop
     * Single requestAnimationFrame loop that coordinates all visual systems
     */
    startMasterAnimationLoop() {
      if (this.masterAnimationController?.isRunning) return;
      this.masterAnimationController.isRunning = true;
      this._animationPaused = false;
      const masterLoop = (timestamp) => {
        if (this._animationPaused || !this.masterAnimationController?.isRunning)
          return;
        this._frameStartTime = performance.now();
        const deltaTime =
          timestamp -
          (this.masterAnimationController.lastFrameTime || timestamp);
        this.masterAnimationController.lastFrameTime = timestamp;
        try {
          this._executeMasterAnimationFrame(timestamp, deltaTime);
        } catch (error) {
          console.error(
            "[MasterAnimationCoordinator] Master animation loop error:",
            error
          );
          this._performanceMetrics.droppedFrames++;
        }
        this._currentFrameTime = performance.now() - this._frameStartTime;
        this._updatePerformanceMetrics(this._currentFrameTime);
        this._applyPerformanceOptimizations();
        this._animationFrameId = requestAnimationFrame(masterLoop);
      };
      this._animationFrameId = requestAnimationFrame(masterLoop);
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Master animation loop started"
        );
      }
    }
    /**
     * Stop the master animation loop
     */
    stopMasterAnimationLoop() {
      if (this._animationFrameId) {
        cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
      }
      if (this.masterAnimationController) {
        this.masterAnimationController.isRunning = false;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Master animation loop stopped"
        );
      }
    }
    /**
     * Execute animation updates for all registered systems with frame budgeting
     * @param {number} timestamp - Current timestamp
     * @param {number} deltaTime - Time since last frame
     */
    _executeMasterAnimationFrame(timestamp, deltaTime) {
      const frameStartTime = performance.now();
      let remainingBudget = this._frameTimeBudget;
      const systemsByPriority = Array.from(
        this._animationSystemRegistry.entries()
      ).sort(([, a], [, b]) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      for (const [systemName, config] of systemsByPriority) {
        if (!config.enabled || remainingBudget <= 0) {
          if (remainingBudget <= 0 && config.priority === "background") {
            config.skippedFrames++;
            continue;
          }
        }
        const timeSinceLastUpdate = timestamp - config.lastUpdate;
        if (timeSinceLastUpdate < config.frameInterval) {
          continue;
        }
        const systemStartTime = performance.now();
        try {
          if (
            config.system &&
            typeof config.system.updateAnimation === "function"
          ) {
            config.system.updateAnimation(timestamp, deltaTime);
          }
          const systemExecutionTime = performance.now() - systemStartTime;
          config.frameCount++;
          config.totalTime += systemExecutionTime;
          config.maxFrameTime = Math.max(
            config.maxFrameTime,
            systemExecutionTime
          );
          config.lastUpdate = timestamp;
          const stats = this._performanceMetrics.systemStats.get(systemName);
          if (stats) {
            stats.calls++;
            stats.maxTime = Math.max(stats.maxTime, systemExecutionTime);
            stats.averageTime = config.totalTime / config.frameCount;
          }
          remainingBudget -= systemExecutionTime;
          if (systemExecutionTime > 5) {
            if (this.config.enableDebug) {
              console.warn(
                `\u{1F3AC} [MasterAnimationCoordinator] System ${systemName} took ${systemExecutionTime.toFixed(
                  2
                )}ms`
              );
            }
          }
        } catch (error) {
          console.error(
            `[MasterAnimationCoordinator] Error in system ${systemName}:`,
            error
          );
          config.enabled = false;
        }
      }
      this._performanceMetrics.totalFrames++;
    }
    /**
     * Update performance metrics based on frame timing
     * @param {number} frameTime - Time taken for current frame
     */
    _updatePerformanceMetrics(frameTime) {
      const metrics = this._performanceMetrics;
      metrics.maxFrameTime = Math.max(metrics.maxFrameTime, frameTime);
      metrics.averageFrameTime =
        (metrics.averageFrameTime * (metrics.totalFrames - 1) + frameTime) /
        metrics.totalFrames;
      if (frameTime > 16.67) {
        metrics.droppedFrames++;
      }
    }
    /**
     * Apply automatic performance optimizations based on frame timing
     */
    _applyPerformanceOptimizations() {
      const now = performance.now();
      if (now - this._performanceMetrics.lastOptimization < 5e3) {
        return;
      }
      const frameDropRate =
        this._performanceMetrics.droppedFrames /
        this._performanceMetrics.totalFrames;
      const avgFrameTime = this._performanceMetrics.averageFrameTime;
      if (frameDropRate > 0.1 || avgFrameTime > 20) {
        this._activatePerformanceMode();
      } else if (frameDropRate < 0.02 && avgFrameTime < 10) {
        this._activateQualityMode();
      }
      this._performanceMetrics.lastOptimization = now;
    }
    /**
     * Activate performance mode - reduce quality for better frame rate
     */
    _activatePerformanceMode() {
      if (this._performanceMetrics.performanceMode === "performance") return;
      this._performanceMetrics.performanceMode = "performance";
      this._frameTimeBudget = 12;
      for (const [systemName, config] of this._animationSystemRegistry) {
        if (config.priority === "background") {
          config.frameInterval = Math.max(config.frameInterval * 1.5, 33);
        }
      }
      this._notifyPerformanceModeChange("performance");
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Activated performance mode"
        );
      }
    }
    /**
     * Activate quality mode - prioritize visual quality
     */
    _activateQualityMode() {
      if (this._performanceMetrics.performanceMode === "quality") return;
      this._performanceMetrics.performanceMode = "quality";
      this._frameTimeBudget = 16;
      for (const [systemName, config] of this._animationSystemRegistry) {
        config.frameInterval = 1e3 / config.targetFPS;
      }
      this._notifyPerformanceModeChange("quality");
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Activated quality mode"
        );
      }
    }
    /**
     * Notify systems of performance mode changes
     * @param {string} mode - New performance mode
     */
    _notifyPerformanceModeChange(mode) {
      for (const [systemName, config] of this._animationSystemRegistry) {
        if (
          config.system &&
          typeof config.system.onPerformanceModeChange === "function"
        ) {
          try {
            config.system.onPerformanceModeChange(mode);
          } catch (error) {
            console.error(
              `[MasterAnimationCoordinator] Error notifying ${systemName} of mode change:`,
              error
            );
          }
        }
      }
    }
    /**
     * Get performance report for the master animation coordinator
     * @returns {Object} Performance metrics and recommendations
     */
    getPerformanceReport() {
      const metrics = this._performanceMetrics;
      const frameDropRate =
        metrics.totalFrames > 0
          ? metrics.droppedFrames / metrics.totalFrames
          : 0;
      const systemReports = {};
      for (const [systemName, config] of this._animationSystemRegistry) {
        systemReports[systemName] = {
          priority: config.priority,
          targetFPS: config.targetFPS,
          frameCount: config.frameCount,
          averageTime:
            config.frameCount > 0 ? config.totalTime / config.frameCount : 0,
          maxFrameTime: config.maxFrameTime,
          skippedFrames: config.skippedFrames,
          enabled: config.enabled,
        };
      }
      return {
        isRunning: this.masterAnimationController?.isRunning || false,
        performanceMode: metrics.performanceMode,
        totalFrames: metrics.totalFrames,
        droppedFrames: metrics.droppedFrames,
        frameDropRate: Math.round(frameDropRate * 1e3) / 10,
        // Percentage with 1 decimal
        averageFrameTime: Math.round(metrics.averageFrameTime * 100) / 100,
        maxFrameTime: Math.round(metrics.maxFrameTime * 100) / 100,
        frameTimeBudget: this._frameTimeBudget,
        registeredSystems: this._animationSystemRegistry.size,
        systemReports,
        recommendations: this._generatePerformanceRecommendations(),
      };
    }
    /**
     * Generate performance optimization recommendations
     * @returns {Array} Array of recommendations
     */
    _generatePerformanceRecommendations() {
      const recommendations = [];
      const metrics = this._performanceMetrics;
      const frameDropRate =
        metrics.totalFrames > 0
          ? metrics.droppedFrames / metrics.totalFrames
          : 0;
      if (frameDropRate > 0.1) {
        recommendations.push({
          type: "performance",
          priority: "high",
          message: `High frame drop rate (${(frameDropRate * 100).toFixed(
            1
          )}%)`,
          action:
            "Consider reducing visual effects or enabling performance mode",
        });
      }
      if (metrics.averageFrameTime > 20) {
        recommendations.push({
          type: "performance",
          priority: "medium",
          message: `High average frame time (${metrics.averageFrameTime.toFixed(
            2
          )}ms)`,
          action: "Optimize animation systems or reduce frame time budget",
        });
      }
      for (const [systemName, config] of this._animationSystemRegistry) {
        const avgTime =
          config.frameCount > 0 ? config.totalTime / config.frameCount : 0;
        if (avgTime > 8) {
          recommendations.push({
            type: "system",
            priority: "medium",
            message: `System ${systemName} has high execution time (${avgTime.toFixed(
              2
            )}ms)`,
            action: `Optimize ${systemName} or reduce its update frequency`,
          });
        }
        if (config.skippedFrames > config.frameCount * 0.2) {
          recommendations.push({
            type: "system",
            priority: "low",
            message: `System ${systemName} frequently skips frames`,
            action:
              "Consider increasing frame time budget or optimizing other systems",
          });
        }
      }
      if (this._animationSystemRegistry.size > 10) {
        recommendations.push({
          type: "architecture",
          priority: "low",
          message: `Many animation systems registered (${this._animationSystemRegistry.size})`,
          action: "Consider consolidating or merging similar animation systems",
        });
      }
      return recommendations;
    }
    /**
     * Pause all animations
     */
    pauseAnimations() {
      this._animationPaused = true;
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Animations paused");
      }
    }
    /**
     * Resume all animations
     */
    resumeAnimations() {
      this._animationPaused = false;
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Animations resumed"
        );
      }
    }
    /**
     * Enable or disable a specific animation system
     * @param {string} systemName - System to enable/disable
     * @param {boolean} enabled - Whether to enable the system
     */
    setSystemEnabled(systemName, enabled) {
      const config = this._animationSystemRegistry.get(systemName);
      if (config) {
        config.enabled = enabled;
        if (this.config.enableDebug) {
          console.log(
            `\u{1F3AC} [MasterAnimationCoordinator] System ${systemName} ${
              enabled ? "enabled" : "disabled"
            }`
          );
        }
      }
    }
    /**
     * Update frame time budget
     * @param {number} budget - New frame time budget in milliseconds
     */
    setFrameTimeBudget(budget) {
      this._frameTimeBudget = Math.max(8, Math.min(33, budget));
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3AC} [MasterAnimationCoordinator] Frame time budget set to ${this._frameTimeBudget}ms`
        );
      }
    }
    /**
     * Reset performance metrics
     */
    resetMetrics() {
      this._performanceMetrics = {
        totalFrames: 0,
        droppedFrames: 0,
        averageFrameTime: 0,
        maxFrameTime: 0,
        systemStats: /* @__PURE__ */ new Map(),
        performanceMode: "auto",
        lastOptimization: 0,
      };
      for (const [systemName, config] of this._animationSystemRegistry) {
        config.frameCount = 0;
        config.totalTime = 0;
        config.maxFrameTime = 0;
        config.skippedFrames = 0;
        this._performanceMetrics.systemStats.set(systemName, {
          averageTime: 0,
          maxTime: 0,
          calls: 0,
        });
      }
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Performance metrics reset"
        );
      }
    }
    /**
     * Clean up and destroy the coordinator
     */
    destroy() {
      this.stopMasterAnimationLoop();
      this._animationSystemRegistry.clear();
      this._performanceMetrics.systemStats.clear();
      this.masterAnimationController = null;
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Destroyed");
      }
    }
  };

  // src-js/core/PerformanceAnalyzer.js
  var PerformanceAnalyzer = class {
    constructor(config = {}) {
      this.config = {
        enableDebug: config.enableDebug || false,
        monitoringInterval: config.monitoringInterval || 5e3,
        // 5 seconds
        retentionPeriod: config.retentionPeriod || 3e5,
        // 5 minutes
        ...config,
      };
      this.performanceHistory = [];
      this.metricsBuffer = /* @__PURE__ */ new Map();
      this.isMonitoring = false;
      this.monitoringTimer = null;
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Initialized");
      }
    }
    /**
     * Start performance monitoring
     */
    startMonitoring() {
      if (this.isMonitoring) {
        return;
      }
      this.isMonitoring = true;
      this.monitoringTimer = setInterval(() => {
        this._collectPerformanceMetrics();
      }, this.config.monitoringInterval);
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Monitoring started");
      }
    }
    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
      if (!this.isMonitoring) {
        return;
      }
      this.isMonitoring = false;
      if (this.monitoringTimer) {
        clearInterval(this.monitoringTimer);
        this.monitoringTimer = null;
      }
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Monitoring stopped");
      }
    }
    /**
     * Collect current performance metrics
     */
    _collectPerformanceMetrics() {
      const timestamp = performance.now();
      const metrics = {
        timestamp,
        memory: this._getMemoryMetrics(),
        timing: this._getTimingMetrics(),
        fps: this._getFPSMetrics(),
        dom: this._getDOMMetrics(),
        network: this._getNetworkMetrics(),
      };
      this.performanceHistory.push(metrics);
      const cutoff = timestamp - this.config.retentionPeriod;
      this.performanceHistory = this.performanceHistory.filter(
        (metric) => metric.timestamp > cutoff
      );
      this.metricsBuffer.set(timestamp, metrics);
      for (const [key] of this.metricsBuffer) {
        if (key < cutoff) {
          this.metricsBuffer.delete(key);
        }
      }
    }
    /**
     * Get memory performance metrics
     */
    _getMemoryMetrics() {
      const memoryInfo = performance.memory || {};
      return {
        used: memoryInfo.usedJSHeapSize || 0,
        total: memoryInfo.totalJSHeapSize || 0,
        limit: memoryInfo.jsHeapSizeLimit || 0,
        utilization: memoryInfo.totalJSHeapSize
          ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
          : 0,
        available: memoryInfo.jsHeapSizeLimit
          ? memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize
          : 0,
      };
    }
    /**
     * Get timing performance metrics
     */
    _getTimingMetrics() {
      const navigation = performance.getEntriesByType("navigation")[0] || {};
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd || 0,
        loadComplete: navigation.loadEventEnd || 0,
        firstPaint: this._getFirstPaint(),
        firstContentfulPaint: this._getFirstContentfulPaint(),
        largestContentfulPaint: this._getLargestContentfulPaint(),
      };
    }
    /**
     * Get FPS metrics using requestAnimationFrame
     */
    _getFPSMetrics() {
      if (this._fpsCounter) {
        return {
          current: this._fpsCounter.currentFPS,
          average: this._fpsCounter.averageFPS,
          min: this._fpsCounter.minFPS,
          max: this._fpsCounter.maxFPS,
        };
      }
      return {
        current: 0,
        average: 0,
        min: 0,
        max: 0,
      };
    }
    /**
     * Get DOM performance metrics
     */
    _getDOMMetrics() {
      return {
        elements: document.querySelectorAll("*").length,
        styleSheets: document.styleSheets.length,
        images: document.images.length,
        scripts: document.scripts.length,
        links: document.links.length,
      };
    }
    /**
     * Get network performance metrics
     */
    _getNetworkMetrics() {
      const connection = navigator.connection || {};
      return {
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };
    }
    /**
     * Get First Paint timing
     */
    _getFirstPaint() {
      const paintEntries = performance.getEntriesByType("paint");
      const firstPaint = paintEntries.find(
        (entry) => entry.name === "first-paint"
      );
      return firstPaint ? firstPaint.startTime : 0;
    }
    /**
     * Get First Contentful Paint timing
     */
    _getFirstContentfulPaint() {
      const paintEntries = performance.getEntriesByType("paint");
      const fcp = paintEntries.find(
        (entry) => entry.name === "first-contentful-paint"
      );
      return fcp ? fcp.startTime : 0;
    }
    /**
     * Get Largest Contentful Paint timing
     */
    _getLargestContentfulPaint() {
      const lcpEntries = performance.getEntriesByType(
        "largest-contentful-paint"
      );
      return lcpEntries.length > 0
        ? lcpEntries[lcpEntries.length - 1].startTime
        : 0;
    }
    /**
     * Analyze component performance
     * @param {string} componentName - Name of the component to analyze
     * @param {Object} component - Component instance
     * @returns {Object} Performance analysis result
     */
    analyzeComponent(componentName, component) {
      const analysis = {
        name: componentName,
        status: "unknown",
        performance: "unknown",
        memory: "unknown",
        recommendations: [],
        metrics: {},
      };
      try {
        if (!component) {
          analysis.status = "missing";
          analysis.recommendations.push("Component not initialized");
          return analysis;
        }
        analysis.status = "active";
        if (component.getPerformanceReport) {
          const report = component.getPerformanceReport();
          analysis.metrics = report;
          analysis.performance = this._analyzeComponentPerformance(report);
          analysis.memory = this._analyzeComponentMemory(report);
          analysis.recommendations =
            this._generateComponentRecommendations(report);
        } else if (component.getMemoryUsage) {
          const memoryUsage = component.getMemoryUsage();
          analysis.memory = memoryUsage > 50 * 1024 * 1024 ? "high" : "normal";
        }
        const hasUpdate = typeof component.update === "function";
        const hasDestroy = typeof component.destroy === "function";
        const hasReset = typeof component.reset === "function";
        analysis.capabilities = {
          updatable: hasUpdate,
          destroyable: hasDestroy,
          resettable: hasReset,
        };
        if (!hasUpdate && !hasDestroy) {
          analysis.recommendations.push(
            "Consider implementing update() and destroy() methods"
          );
        }
      } catch (error) {
        analysis.status = "error";
        analysis.error = error.message;
        analysis.recommendations.push("Component threw error during analysis");
      }
      return analysis;
    }
    /**
     * Analyze component performance from report
     */
    _analyzeComponentPerformance(report) {
      if (report.averageExecutionTime) {
        if (report.averageExecutionTime > 16) return "poor";
        if (report.averageExecutionTime > 8) return "fair";
        return "good";
      }
      if (report.performance) {
        return report.performance.rating || "unknown";
      }
      return "unknown";
    }
    /**
     * Analyze component memory usage from report
     */
    _analyzeComponentMemory(report) {
      if (report.memoryUsage) {
        const usage = report.memoryUsage;
        if (usage > 100 * 1024 * 1024) return "high";
        if (usage > 50 * 1024 * 1024) return "medium";
        return "low";
      }
      if (report.memory) {
        return report.memory.level || "unknown";
      }
      return "unknown";
    }
    /**
     * Generate recommendations for component optimization
     */
    _generateComponentRecommendations(report) {
      const recommendations = [];
      if (report.averageExecutionTime > 16) {
        recommendations.push(
          "Optimize component update cycle - execution time too high"
        );
      }
      if (report.memoryUsage > 50 * 1024 * 1024) {
        recommendations.push(
          "Consider memory optimization - high memory usage detected"
        );
      }
      if (report.errorCount > 0) {
        recommendations.push(
          `Fix component errors - ${report.errorCount} errors detected`
        );
      }
      if (report.performance?.efficiency === "poor") {
        recommendations.push(
          "Review component efficiency - poor performance detected"
        );
      }
      if (report.recommendations) {
        recommendations.push(
          ...report.recommendations.map((rec) => rec.message || rec)
        );
      }
      return recommendations;
    }
    /**
     * Generate comprehensive health report
     * @param {Object} systems - Object containing all system components
     * @returns {Object} Complete health analysis
     */
    generateHealthReport(systems = {}) {
      const report = {
        timestamp: Date.now(),
        overall: "unknown",
        performance: this._getOverallPerformance(),
        memory: this._getMemoryAnalysis(),
        components: {},
        recommendations: [],
        metrics: this._getSystemMetrics(),
      };
      Object.entries(systems).forEach(([name, component]) => {
        if (component && name !== "config") {
          report.components[name] = this.analyzeComponent(name, component);
        }
      });
      report.overall = this._calculateOverallHealth(report.components);
      report.recommendations = this._generateSystemRecommendations(report);
      return report;
    }
    /**
     * Get overall performance analysis
     */
    _getOverallPerformance() {
      if (this.performanceHistory.length < 2) {
        return {
          status: "insufficient_data",
          message: "Need more performance data",
        };
      }
      const recent = this.performanceHistory.slice(-5);
      const averageMemoryUsage =
        recent.reduce((sum, m) => sum + m.memory.utilization, 0) /
        recent.length;
      const averageFPS =
        recent.reduce((sum, m) => sum + (m.fps.current || 0), 0) /
        recent.length;
      let status = "good";
      const issues = [];
      if (averageMemoryUsage > 80) {
        status = "poor";
        issues.push("High memory usage");
      } else if (averageMemoryUsage > 60) {
        status = "fair";
        issues.push("Elevated memory usage");
      }
      if (averageFPS > 0 && averageFPS < 30) {
        status = "poor";
        issues.push("Low frame rate");
      } else if (averageFPS > 0 && averageFPS < 45) {
        status = status === "good" ? "fair" : status;
        issues.push("Reduced frame rate");
      }
      return {
        status,
        averageMemoryUsage: Math.round(averageMemoryUsage),
        averageFPS: Math.round(averageFPS),
        issues,
      };
    }
    /**
     * Get memory analysis
     */
    _getMemoryAnalysis() {
      if (this.performanceHistory.length === 0) {
        return { status: "no_data" };
      }
      const latest =
        this.performanceHistory[this.performanceHistory.length - 1];
      const memory = latest.memory;
      return {
        current: {
          used: Math.round(memory.used / 1024 / 1024),
          // MB
          total: Math.round(memory.total / 1024 / 1024),
          // MB
          utilization: Math.round(memory.utilization),
        },
        trend: this._getMemoryTrend(),
        status:
          memory.utilization > 80
            ? "critical"
            : memory.utilization > 60
            ? "warning"
            : "good",
      };
    }
    /**
     * Get memory usage trend
     */
    _getMemoryTrend() {
      if (this.performanceHistory.length < 3) {
        return "unknown";
      }
      const recent = this.performanceHistory.slice(-3);
      const utilizationTrend = recent.map((m) => m.memory.utilization);
      const isIncreasing =
        utilizationTrend[2] > utilizationTrend[1] &&
        utilizationTrend[1] > utilizationTrend[0];
      const isDecreasing =
        utilizationTrend[2] < utilizationTrend[1] &&
        utilizationTrend[1] < utilizationTrend[0];
      if (isIncreasing) return "increasing";
      if (isDecreasing) return "decreasing";
      return "stable";
    }
    /**
     * Get system-wide metrics
     */
    _getSystemMetrics() {
      const latest =
        this.performanceHistory[this.performanceHistory.length - 1];
      if (!latest) {
        return { status: "no_data" };
      }
      return {
        performance: {
          fps: latest.fps,
          timing: latest.timing,
        },
        memory: latest.memory,
        dom: latest.dom,
        network: latest.network,
        timestamp: latest.timestamp,
      };
    }
    /**
     * Calculate overall system health
     */
    _calculateOverallHealth(components) {
      const componentStates = Object.values(components);
      if (componentStates.length === 0) {
        return "unknown";
      }
      const errorComponents = componentStates.filter(
        (c) => c.status === "error"
      ).length;
      const missingComponents = componentStates.filter(
        (c) => c.status === "missing"
      ).length;
      const poorPerformance = componentStates.filter(
        (c) => c.performance === "poor"
      ).length;
      const totalComponents = componentStates.length;
      const healthyRatio =
        (totalComponents - errorComponents - missingComponents) /
        totalComponents;
      if (errorComponents > 0 || missingComponents > totalComponents * 0.3) {
        return "critical";
      }
      if (poorPerformance > totalComponents * 0.5 || healthyRatio < 0.7) {
        return "warning";
      }
      if (healthyRatio > 0.9 && poorPerformance === 0) {
        return "excellent";
      }
      return "good";
    }
    /**
     * Generate system-wide recommendations
     */
    _generateSystemRecommendations(report) {
      const recommendations = [];
      if (report.performance.status === "poor") {
        recommendations.push({
          type: "performance",
          priority: "high",
          message: "System performance is poor",
          actions: [
            "Consider enabling performance mode",
            "Reduce visual effect intensity",
          ],
        });
      }
      if (report.memory.status === "critical") {
        recommendations.push({
          type: "memory",
          priority: "critical",
          message: "Critical memory usage detected",
          actions: [
            "Enable aggressive cleanup",
            "Restart components",
            "Reduce memory-intensive features",
          ],
        });
      }
      const errorComponents = Object.entries(report.components)
        .filter(([, component]) => component.status === "error")
        .map(([name]) => name);
      if (errorComponents.length > 0) {
        recommendations.push({
          type: "components",
          priority: "high",
          message: `Component errors detected: ${errorComponents.join(", ")}`,
          actions: ["Review component logs", "Restart affected components"],
        });
      }
      return recommendations;
    }
    /**
     * Get performance history
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} Performance history
     */
    getPerformanceHistory(limit = 100) {
      return this.performanceHistory.slice(-limit);
    }
    /**
     * Clear performance history
     */
    clearHistory() {
      this.performanceHistory = [];
      this.metricsBuffer.clear();
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] History cleared");
      }
    }
    /**
     * Initialize FPS counter
     */
    initializeFPSCounter() {
      this._fpsCounter = {
        frames: 0,
        startTime: performance.now(),
        lastFrameTime: performance.now(),
        currentFPS: 0,
        averageFPS: 0,
        minFPS: Infinity,
        maxFPS: 0,
        frameHistory: [],
      };
      const updateFPS = () => {
        const now = performance.now();
        const deltaTime = now - this._fpsCounter.lastFrameTime;
        this._fpsCounter.lastFrameTime = now;
        this._fpsCounter.frames++;
        if (deltaTime > 0) {
          this._fpsCounter.currentFPS = 1e3 / deltaTime;
          this._fpsCounter.frameHistory.push(this._fpsCounter.currentFPS);
          if (this._fpsCounter.frameHistory.length > 60) {
            this._fpsCounter.frameHistory =
              this._fpsCounter.frameHistory.slice(-60);
          }
          this._fpsCounter.averageFPS =
            this._fpsCounter.frameHistory.reduce((a, b) => a + b, 0) /
            this._fpsCounter.frameHistory.length;
          this._fpsCounter.minFPS = Math.min(
            this._fpsCounter.minFPS,
            this._fpsCounter.currentFPS
          );
          this._fpsCounter.maxFPS = Math.max(
            this._fpsCounter.maxFPS,
            this._fpsCounter.currentFPS
          );
        }
        requestAnimationFrame(updateFPS);
      };
      requestAnimationFrame(updateFPS);
    }
    /**
     * Clean up and destroy the analyzer
     */
    destroy() {
      this.stopMonitoring();
      this.clearHistory();
      this._fpsCounter = null;
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Destroyed");
      }
    }
  };

  // src-js/core/TimerConsolidationSystem.js
  var TimerConsolidationSystem = class {
    constructor(config = {}) {
      this.config = {
        timerIntervalMs: config.timerIntervalMs || 50,
        // 20Hz base frequency
        maxTimerBudget: config.maxTimerBudget || 10,
        // 10ms budget for timer operations
        enableDebug: config.enableDebug || false,
        ...config,
      };
      this._timerRegistry = /* @__PURE__ */ new Map();
      this._timerMasterInterval = null;
      this._timerLastExecution = 0;
      this._timerExecutionCount = 0;
      this._timerPerformanceMetrics = {
        totalExecutions: 0,
        totalTime: 0,
        maxExecutionTime: 0,
        averageExecutionTime: 0,
        skippedTimers: 0,
        timerCallbacks: /* @__PURE__ */ new Map(),
        // timerId -> { calls: 0, totalTime: 0, maxTime: 0 }
      };
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Initialized");
      }
    }
    /**
     * Initialize the timer consolidation system
     */
    initialize() {
      if (this._timerMasterInterval) {
        console.warn("[TimerConsolidationSystem] Already initialized");
        return;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u23F1\uFE0F [TimerConsolidationSystem] Timer consolidation initialized"
        );
      }
    }
    /**
     * Register a consolidated timer with the system
     * @param {string} timerId - Unique timer identifier
     * @param {Function} callback - Timer callback function
     * @param {number} intervalMs - Timer interval in milliseconds
     * @param {string} priority - Priority level: 'critical', 'normal', 'background'
     */
    registerConsolidatedTimer(
      timerId,
      callback,
      intervalMs,
      priority = "normal"
    ) {
      if (this._timerRegistry.has(timerId)) {
        console.warn(
          `[TimerConsolidationSystem] Timer ${timerId} already registered`
        );
        return;
      }
      const timerConfig = {
        callback,
        intervalMs,
        priority,
        lastExecution: 0,
        enabled: true,
        executionCount: 0,
        totalExecutionTime: 0,
        maxExecutionTime: 0,
        skippedExecutions: 0,
      };
      this._timerRegistry.set(timerId, timerConfig);
      this._timerPerformanceMetrics.timerCallbacks.set(timerId, {
        calls: 0,
        totalTime: 0,
        maxTime: 0,
      });
      if (this.config.enableDebug) {
        console.log(
          `\u23F1\uFE0F [TimerConsolidationSystem] Registered timer: ${timerId} (${intervalMs}ms, ${priority} priority)`
        );
      }
      if (this._timerRegistry.size === 1 && !this._timerMasterInterval) {
        this._startMasterTimer();
      }
    }
    /**
     * Unregister a timer from the consolidation system
     * @param {string} timerId - Timer identifier to unregister
     */
    unregisterConsolidatedTimer(timerId) {
      if (this._timerRegistry.has(timerId)) {
        this._timerRegistry.delete(timerId);
        this._timerPerformanceMetrics.timerCallbacks.delete(timerId);
        if (this.config.enableDebug) {
          console.log(
            `\u23F1\uFE0F [TimerConsolidationSystem] Unregistered timer: ${timerId}`
          );
        }
        if (this._timerRegistry.size === 0) {
          this._stopMasterTimer();
        }
      }
    }
    /**
     * Start the master timer loop
     */
    _startMasterTimer() {
      if (this._timerMasterInterval) return;
      this._timerMasterInterval = setInterval(() => {
        this._executeMasterTimerFrame();
      }, this.config.timerIntervalMs);
      if (this.config.enableDebug) {
        console.log(
          "\u23F1\uFE0F [TimerConsolidationSystem] Master timer started"
        );
      }
    }
    /**
     * Stop the master timer loop
     */
    _stopMasterTimer() {
      if (this._timerMasterInterval) {
        clearInterval(this._timerMasterInterval);
        this._timerMasterInterval = null;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u23F1\uFE0F [TimerConsolidationSystem] Master timer stopped"
        );
      }
    }
    /**
     * Execute timer callbacks with budget management
     */
    _executeMasterTimerFrame() {
      const frameStartTime = performance.now();
      const currentTime = frameStartTime;
      let remainingBudget = this.config.maxTimerBudget;
      const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
        ([, a], [, b]) => {
          const priorityOrder = { critical: 0, normal: 1, background: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
      );
      for (const [timerId, config] of timersByPriority) {
        if (!config.enabled || remainingBudget <= 0) {
          if (remainingBudget <= 0 && config.priority === "background") {
            config.skippedExecutions++;
            continue;
          }
        }
        const timeSinceLastExecution = currentTime - config.lastExecution;
        if (timeSinceLastExecution < config.intervalMs) {
          continue;
        }
        const timerStartTime = performance.now();
        try {
          config.callback();
          const timerExecutionTime = performance.now() - timerStartTime;
          config.executionCount++;
          config.totalExecutionTime += timerExecutionTime;
          config.maxExecutionTime = Math.max(
            config.maxExecutionTime,
            timerExecutionTime
          );
          config.lastExecution = currentTime;
          const stats =
            this._timerPerformanceMetrics.timerCallbacks.get(timerId);
          if (stats) {
            stats.calls++;
            stats.totalTime += timerExecutionTime;
            stats.maxTime = Math.max(stats.maxTime, timerExecutionTime);
          }
          remainingBudget -= timerExecutionTime;
          if (timerExecutionTime > 5) {
            if (this.config.enableDebug) {
              console.warn(
                `\u23F1\uFE0F [TimerConsolidationSystem] Timer ${timerId} took ${timerExecutionTime.toFixed(
                  2
                )}ms`
              );
            }
          }
        } catch (error) {
          console.error(
            `[TimerConsolidationSystem] Error in timer ${timerId}:`,
            error
          );
          config.enabled = false;
        }
      }
      const totalFrameTime = performance.now() - frameStartTime;
      this._updateTimerPerformanceMetrics(totalFrameTime);
      this._timerExecutionCount++;
    }
    /**
     * Update timer performance metrics
     * @param {number} frameTime - Time taken for current timer frame
     */
    _updateTimerPerformanceMetrics(frameTime) {
      const metrics = this._timerPerformanceMetrics;
      metrics.totalExecutions++;
      metrics.totalTime += frameTime;
      metrics.maxExecutionTime = Math.max(metrics.maxExecutionTime, frameTime);
      metrics.averageExecutionTime =
        metrics.totalTime / metrics.totalExecutions;
      if (frameTime > this.config.maxTimerBudget) {
        metrics.skippedTimers++;
      }
    }
    /**
     * Get timer consolidation performance report
     * @returns {Object} Timer performance metrics and recommendations
     */
    getPerformanceReport() {
      const metrics = this._timerPerformanceMetrics;
      const overBudgetRate =
        metrics.totalExecutions > 0
          ? metrics.skippedTimers / metrics.totalExecutions
          : 0;
      const timerReports = {};
      for (const [timerId, config] of this._timerRegistry) {
        timerReports[timerId] = {
          priority: config.priority,
          intervalMs: config.intervalMs,
          executionCount: config.executionCount,
          averageTime:
            config.executionCount > 0
              ? config.totalExecutionTime / config.executionCount
              : 0,
          maxExecutionTime: config.maxExecutionTime,
          skippedExecutions: config.skippedExecutions,
          enabled: config.enabled,
        };
      }
      return {
        isRunning: this._timerMasterInterval !== null,
        masterInterval: this.config.timerIntervalMs,
        timeBudget: this.config.maxTimerBudget,
        registeredTimers: this._timerRegistry.size,
        totalExecutions: metrics.totalExecutions,
        averageExecutionTime:
          Math.round(metrics.averageExecutionTime * 100) / 100,
        maxExecutionTime: Math.round(metrics.maxExecutionTime * 100) / 100,
        overBudgetRate: Math.round(overBudgetRate * 1e3) / 10,
        // Percentage with 1 decimal
        timerReports,
        recommendations: this._generateTimerRecommendations(),
      };
    }
    /**
     * Generate timer optimization recommendations
     * @returns {Array} Array of recommendations
     */
    _generateTimerRecommendations() {
      const recommendations = [];
      const metrics = this._timerPerformanceMetrics;
      const overBudgetRate =
        metrics.totalExecutions > 0
          ? metrics.skippedTimers / metrics.totalExecutions
          : 0;
      if (overBudgetRate > 0.1) {
        recommendations.push({
          type: "performance",
          priority: "high",
          message: `Frequent timer budget overruns (${(
            overBudgetRate * 100
          ).toFixed(1)}%)`,
          action:
            "Consider reducing timer frequency or optimizing timer callbacks",
        });
      }
      if (metrics.averageExecutionTime > this.config.maxTimerBudget * 0.8) {
        recommendations.push({
          type: "performance",
          priority: "medium",
          message: `High average timer execution time (${metrics.averageExecutionTime.toFixed(
            2
          )}ms)`,
          action: "Optimize timer callbacks or increase timer budget",
        });
      }
      for (const [timerId, config] of this._timerRegistry) {
        const avgTime =
          config.executionCount > 0
            ? config.totalExecutionTime / config.executionCount
            : 0;
        if (avgTime > 3) {
          recommendations.push({
            type: "timer",
            priority: "medium",
            message: `Timer ${timerId} has high execution time (${avgTime.toFixed(
              2
            )}ms)`,
            action: `Optimize timer ${timerId} callback or increase its interval`,
          });
        }
        if (config.skippedExecutions > config.executionCount * 0.2) {
          recommendations.push({
            type: "timer",
            priority: "low",
            message: `Timer ${timerId} frequently skips executions`,
            action:
              "Consider increasing timer budget or optimizing other timers",
          });
        }
      }
      if (this._timerRegistry.size > 20) {
        recommendations.push({
          type: "architecture",
          priority: "low",
          message: `Many timers registered (${this._timerRegistry.size})`,
          action: "Consider consolidating or merging similar timer operations",
        });
      }
      const shortIntervalTimers = Array.from(
        this._timerRegistry.entries()
      ).filter(([, config]) => config.intervalMs < 100);
      if (shortIntervalTimers.length > 5) {
        recommendations.push({
          type: "efficiency",
          priority: "medium",
          message: `Many high-frequency timers (${shortIntervalTimers.length} under 100ms)`,
          action: "Consider increasing intervals or merging timer operations",
        });
      }
      return recommendations;
    }
    /**
     * Enable or disable a specific timer
     * @param {string} timerId - Timer to enable/disable
     * @param {boolean} enabled - Whether to enable the timer
     */
    setTimerEnabled(timerId, enabled) {
      const config = this._timerRegistry.get(timerId);
      if (config) {
        config.enabled = enabled;
        if (this.config.enableDebug) {
          console.log(
            `\u23F1\uFE0F [TimerConsolidationSystem] Timer ${timerId} ${
              enabled ? "enabled" : "disabled"
            }`
          );
        }
      }
    }
    /**
     * Update timer interval
     * @param {string} timerId - Timer to update
     * @param {number} newIntervalMs - New interval in milliseconds
     */
    updateTimerInterval(timerId, newIntervalMs) {
      const config = this._timerRegistry.get(timerId);
      if (config) {
        config.intervalMs = Math.max(10, newIntervalMs);
        if (this.config.enableDebug) {
          console.log(
            `\u23F1\uFE0F [TimerConsolidationSystem] Timer ${timerId} interval updated to ${newIntervalMs}ms`
          );
        }
      }
    }
    /**
     * Update timer budget
     * @param {number} budget - New timer budget in milliseconds
     */
    setTimerBudget(budget) {
      this.config.maxTimerBudget = Math.max(5, Math.min(50, budget));
      if (this.config.enableDebug) {
        console.log(
          `\u23F1\uFE0F [TimerConsolidationSystem] Timer budget set to ${this.config.maxTimerBudget}ms`
        );
      }
    }
    /**
     * Update master timer interval
     * @param {number} intervalMs - New master timer interval in milliseconds
     */
    setMasterInterval(intervalMs) {
      this.config.timerIntervalMs = Math.max(10, Math.min(1e3, intervalMs));
      if (this._timerMasterInterval) {
        this._stopMasterTimer();
        this._startMasterTimer();
      }
      if (this.config.enableDebug) {
        console.log(
          `\u23F1\uFE0F [TimerConsolidationSystem] Master interval set to ${this.config.timerIntervalMs}ms`
        );
      }
    }
    /**
     * Force execution of a specific timer
     * @param {string} timerId - Timer to execute immediately
     */
    executeTimer(timerId) {
      const config = this._timerRegistry.get(timerId);
      if (config && config.enabled) {
        try {
          const startTime = performance.now();
          config.callback();
          const executionTime = performance.now() - startTime;
          config.executionCount++;
          config.totalExecutionTime += executionTime;
          config.maxExecutionTime = Math.max(
            config.maxExecutionTime,
            executionTime
          );
          config.lastExecution = performance.now();
          if (this.config.enableDebug) {
            console.log(
              `\u23F1\uFE0F [TimerConsolidationSystem] Executed timer ${timerId} (${executionTime.toFixed(
                2
              )}ms)`
            );
          }
        } catch (error) {
          console.error(
            `[TimerConsolidationSystem] Error executing timer ${timerId}:`,
            error
          );
        }
      }
    }
    /**
     * Reset timer performance metrics
     */
    resetMetrics() {
      this._timerPerformanceMetrics = {
        totalExecutions: 0,
        totalTime: 0,
        maxExecutionTime: 0,
        averageExecutionTime: 0,
        skippedTimers: 0,
        timerCallbacks: /* @__PURE__ */ new Map(),
      };
      for (const [timerId, config] of this._timerRegistry) {
        config.executionCount = 0;
        config.totalExecutionTime = 0;
        config.maxExecutionTime = 0;
        config.skippedExecutions = 0;
        config.lastExecution = 0;
        this._timerPerformanceMetrics.timerCallbacks.set(timerId, {
          calls: 0,
          totalTime: 0,
          maxTime: 0,
        });
      }
      this._timerExecutionCount = 0;
      if (this.config.enableDebug) {
        console.log(
          "\u23F1\uFE0F [TimerConsolidationSystem] Performance metrics reset"
        );
      }
    }
    /**
     * Get list of all registered timers
     * @returns {Array} Array of timer information
     */
    getTimerList() {
      return Array.from(this._timerRegistry.entries()).map(
        ([timerId, config]) => ({
          id: timerId,
          intervalMs: config.intervalMs,
          priority: config.priority,
          enabled: config.enabled,
          executionCount: config.executionCount,
          lastExecution: config.lastExecution,
        })
      );
    }
    /**
     * Check if a timer is registered
     * @param {string} timerId - Timer ID to check
     * @returns {boolean} Whether the timer is registered
     */
    hasTimer(timerId) {
      return this._timerRegistry.has(timerId);
    }
    /**
     * Get timer configuration
     * @param {string} timerId - Timer ID to get configuration for
     * @returns {Object|null} Timer configuration or null if not found
     */
    getTimerConfig(timerId) {
      const config = this._timerRegistry.get(timerId);
      if (!config) return null;
      return {
        intervalMs: config.intervalMs,
        priority: config.priority,
        enabled: config.enabled,
        executionCount: config.executionCount,
        averageTime:
          config.executionCount > 0
            ? config.totalExecutionTime / config.executionCount
            : 0,
        maxExecutionTime: config.maxExecutionTime,
        skippedExecutions: config.skippedExecutions,
        lastExecution: config.lastExecution,
      };
    }
    /**
     * Clean up and destroy the timer consolidation system
     */
    destroy() {
      this._stopMasterTimer();
      this._timerRegistry.clear();
      this._timerPerformanceMetrics.timerCallbacks.clear();
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Destroyed");
      }
    }
  };

  // src-js/core/year3000System.js
  init_GenreProfileManager();
  init_MusicSyncService();
  var Year3000System = class {
    constructor(config = YEAR3000_CONFIG, harmonicModes = HARMONIC_MODES) {
      this.YEAR3000_CONFIG = this._deepCloneConfig(config);
      if (typeof this.YEAR3000_CONFIG.init === "function") {
        this.YEAR3000_CONFIG.init();
      }
      this.HARMONIC_MODES = harmonicModes;
      this.utils = Year3000Utilities;
      this.initialized = false;
      this.masterAnimationCoordinator = null;
      this.timerConsolidationSystem = null;
      this.cssVariableBatcher = null;
      this.deviceCapabilityDetector = null;
      this.performanceAnalyzer = null;
      this.performanceMonitor = null;
      this.settingsManager = null;
      this.colorHarmonyEngine = null;
      this.genreProfileManager = null;
      this.musicSyncService = null;
      this.glassmorphismManager = null;
      this.card3DManager = null;
      this.lightweightParticleSystem = null;
      this.dimensionalNexusSystem = null;
      this.dataGlyphSystem = null;
      this.beatSyncVisualSystem = null;
      this.behavioralPredictionEngine = null;
      this.predictiveMaterializationSystem = null;
      this.sidebarConsciousnessSystem = null;
      this.initializationResults = null;
      if (this.YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F31F} [Year3000System] Constructor: Instance created with Master Animation Coordinator"
        );
      }
    }
    /**
     * Deep clone configuration to prevent shared state mutations
     * @param {Object} config - Configuration object to clone
     * @returns {Object} Deep cloned configuration
     */
    _deepCloneConfig(config) {
      if (!config || typeof config !== "object") return {};
      try {
        const cloned = JSON.parse(JSON.stringify(config));
        const methodsToRestore = [
          "init",
          "getCurrentModeProfile",
          "getCurrentMultipliers",
          "getCurrentFeatures",
          "getCurrentPerformanceSettings",
          "setArtisticMode",
          "loadArtisticPreference",
        ];
        methodsToRestore.forEach((methodName) => {
          if (typeof config[methodName] === "function") {
            cloned[methodName] = config[methodName].bind(cloned);
          }
        });
        if (config.enableDebug) {
          console.log(
            "\u{1F527} [Year3000System] Configuration cloned with all methods restored"
          );
        }
        return cloned;
      } catch (error) {
        console.error("[Year3000System] Failed to clone configuration:", error);
        return { ...config };
      }
    }
    /**
     * Safe configuration update method that doesn't mutate the original
     * @param {string} key - Configuration key to update
     * @param {any} value - New value
     */
    updateConfiguration(key, value) {
      if (!this.YEAR3000_CONFIG) {
        console.warn(
          "[Year3000System] Cannot update configuration - config not initialized"
        );
        return;
      }
      const keyPath = key.split(".");
      let current = this.YEAR3000_CONFIG;
      for (let i = 0; i < keyPath.length - 1; i++) {
        const pathKey = keyPath[i];
        if (!(pathKey in current)) {
          current[pathKey] = {};
        }
        current = current[pathKey];
      }
      const finalKey = keyPath[keyPath.length - 1];
      const oldValue = current[finalKey];
      current[finalKey] = value;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[Year3000System] Configuration updated: ${key} = ${value} (was: ${oldValue})`
        );
      }
      this._notifyConfigurationChange(key, value, oldValue);
    }
    /**
     * Notify systems of configuration changes
     * @param {string} key - Configuration key that changed
     * @param {any} newValue - New value
     * @param {any} oldValue - Previous value
     */
    _notifyConfigurationChange(key, newValue, oldValue) {
      if (key.startsWith("harmonic") || key.includes("HarmonicMode")) {
        if (
          this.sidebarConsciousnessSystem &&
          typeof this.sidebarConsciousnessSystem.updateHarmonicModeDisplay ===
            "function"
        ) {
          this.sidebarConsciousnessSystem.updateHarmonicModeDisplay(newValue);
        }
      }
    }
    async initializeAllSystems() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F30C} [Year3000System] initializeAllSystems(): Starting full system initialization..."
        );
      }
      const startTime = performance.now();
      const initializationResults = {
        success: [],
        failed: [],
        skipped: [],
      };
      try {
        this.masterAnimationCoordinator = new MasterAnimationCoordinator(
          this.YEAR3000_CONFIG
        );
        await this.masterAnimationCoordinator.initialize();
        initializationResults.success.push("MasterAnimationCoordinator");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F3AC} [Year3000System] MasterAnimationCoordinator initialized"
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize MasterAnimationCoordinator:",
          error
        );
        initializationResults.failed.push("MasterAnimationCoordinator");
      }
      try {
        this.timerConsolidationSystem = new TimerConsolidationSystem(
          this.YEAR3000_CONFIG
        );
        await this.timerConsolidationSystem.initialize();
        initializationResults.success.push("TimerConsolidationSystem");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u23F1\uFE0F [Year3000System] TimerConsolidationSystem initialized"
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize TimerConsolidationSystem:",
          error
        );
        initializationResults.failed.push("TimerConsolidationSystem");
      }
      try {
        this.cssVariableBatcher = new CSSVariableBatcher(this.YEAR3000_CONFIG);
        initializationResults.success.push("CSSVariableBatcher");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F3A8} [Year3000System] CSSVariableBatcher initialized"
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize CSSVariableBatcher:",
          error
        );
        initializationResults.failed.push("CSSVariableBatcher");
      }
      try {
        this.deviceCapabilityDetector = new DeviceCapabilityDetector(
          this.YEAR3000_CONFIG
        );
        await this.deviceCapabilityDetector.initialize();
        initializationResults.success.push("DeviceCapabilityDetector");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F50D} [Year3000System] DeviceCapabilityDetector initialized"
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize DeviceCapabilityDetector:",
          error
        );
        initializationResults.failed.push("DeviceCapabilityDetector");
      }
      try {
        this.performanceAnalyzer = new PerformanceAnalyzer(
          this.YEAR3000_CONFIG
        );
        initializationResults.success.push("PerformanceAnalyzer");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F4CA} [Year3000System] PerformanceAnalyzer initialized"
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize PerformanceAnalyzer:",
          error
        );
        initializationResults.failed.push("PerformanceAnalyzer");
      }
      try {
        this.performanceMonitor = new PerformanceMonitor();
        initializationResults.success.push("PerformanceMonitor");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F30C} [Year3000System] PerformanceMonitor instantiated."
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize PerformanceMonitor:",
          error
        );
        initializationResults.failed.push("PerformanceMonitor");
      }
      try {
        this.settingsManager = new SettingsManager(
          this.YEAR3000_CONFIG,
          this.HARMONIC_MODES,
          this.utils
        );
        initializationResults.success.push("SettingsManager");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F30C} [Year3000System] SettingsManager instantiated."
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize SettingsManager:",
          error
        );
        initializationResults.failed.push("SettingsManager");
      }
      try {
        this.genreProfileManager = new GenreProfileManager({
          YEAR3000_CONFIG: this.YEAR3000_CONFIG,
        });
        initializationResults.success.push("GenreProfileManager");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F30C} [Year3000System] GenreProfileManager instantiated."
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize GenreProfileManager:",
          error
        );
        initializationResults.failed.push("GenreProfileManager");
      }
      try {
        this.colorHarmonyEngine = new ColorHarmonyEngine(
          this.YEAR3000_CONFIG,
          this.utils
        );
        initializationResults.success.push("ColorHarmonyEngine");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F30C} [Year3000System] ColorHarmonyEngine instantiated."
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize ColorHarmonyEngine:",
          error
        );
        initializationResults.failed.push("ColorHarmonyEngine");
      }
      if (this.performanceMonitor && this.settingsManager) {
        try {
          this.glassmorphismManager = new GlassmorphismManager(
            this.performanceMonitor,
            this.settingsManager
          );
          if (
            this.glassmorphismManager &&
            typeof this.glassmorphismManager.initialize === "function"
          ) {
            this.glassmorphismManager.initialize();
          }
          initializationResults.success.push("GlassmorphismManager");
          if (this.YEAR3000_CONFIG.enableDebug)
            console.log(
              "\u{1F30C} [Year3000System] GlassmorphismManager instantiated and initialized."
            );
        } catch (error) {
          console.error(
            "\u274C [Year3000System] Failed to initialize GlassmorphismManager:",
            error
          );
          initializationResults.failed.push("GlassmorphismManager");
        }
        try {
          this.card3DManager = new Card3DManager(
            this.performanceMonitor,
            this.settingsManager,
            this.utils
          );
          await this.card3DManager.initialize();
          initializationResults.success.push("Card3DManager");
          if (this.YEAR3000_CONFIG.enableDebug)
            console.log(
              "\u{1F30C} [Year3000System] Card3DManager initialized."
            );
        } catch (error) {
          console.error(
            "\u274C [Year3000System] Failed to initialize Card3DManager:",
            error
          );
          initializationResults.failed.push("Card3DManager");
        }
      } else {
        console.error(
          "\u{1F30C} [Year3000System] Critical dependency missing for GlassmorphismManager or Card3DManager (PerformanceMonitor or SettingsManager)."
        );
        initializationResults.skipped.push(
          "GlassmorphismManager",
          "Card3DManager"
        );
      }
      try {
        this.musicSyncService = new MusicSyncService({
          YEAR3000_CONFIG: this.YEAR3000_CONFIG,
          Year3000Utilities: this.utils,
          colorHarmonyEngine: this.colorHarmonyEngine,
          settingsManager: this.settingsManager,
          genreProfileManager: this.genreProfileManager,
        });
        await this.musicSyncService.initialize();
        initializationResults.success.push("MusicSyncService");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log(
            "\u{1F30C} [Year3000System] MusicSyncService initialized (consolidated music functionality)."
          );
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to initialize MusicSyncService:",
          error
        );
        initializationResults.failed.push("MusicSyncService");
      }
      const visualSystemDependencies = [
        this.YEAR3000_CONFIG,
        this.utils,
        this.performanceMonitor,
        this.musicSyncService,
        // Updated to use unified MusicSyncService
        this.settingsManager,
        // Correctly pass the settingsManager instance
        this,
        // Pass year3000System instance for Master Animation Coordinator access
      ];
      const visualSystems = [
        {
          name: "LightweightParticleSystem",
          Class: LightweightParticleSystem,
          property: "lightweightParticleSystem",
        },
        {
          name: "DimensionalNexusSystem",
          Class: DimensionalNexusSystem,
          property: "dimensionalNexusSystem",
        },
        {
          name: "DataGlyphSystem",
          Class: DataGlyphSystem,
          property: "dataGlyphSystem",
        },
        {
          name: "BeatSyncVisualSystem",
          Class: BeatSyncVisualSystem,
          property: "beatSyncVisualSystem",
        },
        {
          name: "BehavioralPredictionEngine",
          Class: BehavioralPredictionEngine,
          property: "behavioralPredictionEngine",
        },
        {
          name: "PredictiveMaterializationSystem",
          Class: PredictiveMaterializationSystem,
          property: "predictiveMaterializationSystem",
        },
        {
          name: "SidebarConsciousnessSystem",
          Class: SidebarConsciousnessSystem,
          property: "sidebarConsciousnessSystem",
        },
      ];
      for (const systemConfig of visualSystems) {
        try {
          if (!this.YEAR3000_CONFIG || !this.utils) {
            console.warn(
              `\u26A0\uFE0F [Year3000System] Skipping ${systemConfig.name} - missing core dependencies`
            );
            initializationResults.skipped.push(systemConfig.name);
            continue;
          }
          if (
            systemConfig.name === "SidebarConsciousnessSystem" &&
            !document.querySelector(".Root__nav-bar")
          ) {
            console.warn(
              `\u26A0\uFE0F [Year3000System] Skipping ${systemConfig.name} - required DOM element .Root__nav-bar not found`
            );
            initializationResults.skipped.push(systemConfig.name);
            continue;
          }
          this[systemConfig.property] = new systemConfig.Class(
            ...visualSystemDependencies
          );
          await this[systemConfig.property].initialize();
          initializationResults.success.push(systemConfig.name);
          if (this.YEAR3000_CONFIG.enableDebug)
            console.log(
              `\u{1F30C} [Year3000System] ${systemConfig.name} initialized.`
            );
        } catch (error) {
          console.error(
            `\u274C [Year3000System] Failed to initialize ${systemConfig.name}:`,
            error
          );
          initializationResults.failed.push(systemConfig.name);
          this[systemConfig.property] = null;
        }
      }
      const totalSystems =
        initializationResults.success.length +
        initializationResults.failed.length +
        initializationResults.skipped.length;
      const successRate = (
        (initializationResults.success.length / totalSystems) *
        100
      ).toFixed(1);
      if (this.YEAR3000_CONFIG.enableDebug) {
        const endTime = performance.now();
        console.log(
          `\u{1F30C} [Year3000System] initializeAllSystems() completed in ${(
            endTime - startTime
          ).toFixed(2)}ms.`
        );
        console.log(`\u{1F4CA} [Year3000System] Initialization Results:`);
        console.log(
          `  \u2705 Success: ${initializationResults.success.length} (${successRate}%)`
        );
        console.log(`  \u274C Failed: ${initializationResults.failed.length}`);
        console.log(
          `  \u23ED\uFE0F Skipped: ${initializationResults.skipped.length}`
        );
        if (initializationResults.failed.length > 0) {
          console.log(
            `  Failed systems: ${initializationResults.failed.join(", ")}`
          );
        }
        if (initializationResults.skipped.length > 0) {
          console.log(
            `  Skipped systems: ${initializationResults.skipped.join(", ")}`
          );
        }
      }
      this.initializationResults = initializationResults;
      try {
        const healthReport = await this._validateSystemHealth();
        if (healthReport.criticalErrors.length > 0) {
          console.error(
            "\u{1F6A8} [Year3000System] Critical system health issues detected:",
            healthReport.criticalErrors
          );
          for (const systemName of healthReport.unhealthySystems) {
            const retrySuccess = await this._retryFailedSystemInitialization(
              systemName
            );
            if (retrySuccess) {
              const index = initializationResults.failed.indexOf(systemName);
              if (index > -1) {
                initializationResults.failed.splice(index, 1);
                initializationResults.success.push(`${systemName} (retry)`);
              }
            }
          }
          const finalSuccessRate2 =
            (initializationResults.success.length /
              (initializationResults.success.length +
                initializationResults.failed.length)) *
            100;
          console.log(
            `\u{1F4CA} [Year3000System] Final initialization success rate: ${finalSuccessRate2.toFixed(
              1
            )}%`
          );
          if (finalSuccessRate2 < 95) {
            console.warn(
              "\u26A0\uFE0F [Year3000System] Success rate below target (95%), investigation recommended"
            );
          }
        } else {
          console.log(
            `\u{1F49A} [Year3000System] All systems healthy - ${healthReport.healthySystems}/${healthReport.totalSystems} systems operational`
          );
        }
        this.initializationResults = initializationResults;
        this._addPerformanceMonitoring();
      } catch (healthError) {
        console.error(
          "\u274C [Year3000System] Error during health validation:",
          healthError
        );
      }
      if (this.settingsManager) {
        try {
          await this.applyInitialSettings();
        } catch (error) {
          console.error(
            "\u274C [Year3000System] Failed to apply initial settings:",
            error
          );
        }
      } else {
        console.warn(
          "\u26A0\uFE0F [Year3000System] SettingsManager not available - skipping initial settings application"
        );
      }
      const finalSuccessRate =
        (initializationResults.success.length /
          (initializationResults.success.length +
            initializationResults.failed.length)) *
        100;
      if (initializationResults.success.length > 0 && finalSuccessRate >= 95) {
        this.startProactiveHealthMonitoring();
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u{1F504} [Year3000System] Phase 5 monitoring activated for system maintenance (${finalSuccessRate.toFixed(
              1
            )}% success rate)`
          );
        }
      } else if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u26A0\uFE0F [Year3000System] Phase 5 monitoring not activated - success rate ${finalSuccessRate.toFixed(
            1
          )}% below 95% threshold`
        );
      }
    }
    /**
     * Validate system health after initialization
     * @returns {Object} Health report with system status and issues
     */
    async _validateSystemHealth() {
      const healthReport = {
        totalSystems: 0,
        healthySystems: 0,
        unhealthySystems: [],
        criticalErrors: [],
        warnings: [],
      };
      const systemsToCheck = [
        {
          name: "sidebarConsciousnessSystem",
          critical: false,
          property: "sidebarConsciousnessSystem",
        },
        {
          name: "colorHarmonyEngine",
          critical: true,
          property: "colorHarmonyEngine",
        },
        {
          name: "musicSyncService",
          critical: true,
          property: "musicSyncService",
        },
        {
          name: "settingsManager",
          critical: true,
          property: "settingsManager",
        },
        {
          name: "performanceMonitor",
          critical: false,
          property: "performanceMonitor",
        },
        {
          name: "glassmorphismManager",
          critical: false,
          property: "glassmorphismManager",
        },
        { name: "card3DManager", critical: false, property: "card3DManager" },
        {
          name: "beatSyncVisualSystem",
          critical: false,
          property: "beatSyncVisualSystem",
        },
        {
          name: "lightweightParticleSystem",
          critical: false,
          property: "lightweightParticleSystem",
        },
      ];
      for (const { name, critical, property } of systemsToCheck) {
        healthReport.totalSystems++;
        const systemInstance = this[property];
        const isHealthy =
          systemInstance &&
          systemInstance.initialized !== false &&
          (typeof systemInstance.destroy !== "function" ||
            systemInstance.initialized !== false);
        if (isHealthy) {
          healthReport.healthySystems++;
          if (name === "sidebarConsciousnessSystem" && systemInstance) {
            if (typeof systemInstance.isHealthy === "function") {
              const systemHealth = systemInstance.isHealthy();
              if (!systemHealth.healthy) {
                healthReport.warnings.push(
                  `${name} has health issues: ${systemHealth.issues.join(", ")}`
                );
              }
            }
          }
        } else {
          healthReport.unhealthySystems.push(name);
          const message = `${name} not properly initialized or missing`;
          if (critical) {
            healthReport.criticalErrors.push(message);
          } else {
            healthReport.warnings.push(message);
          }
        }
      }
      if (this.YEAR3000_CONFIG?.enableDebug) {
        console.log("\u{1F50D} [Year3000System] Health validation completed:", {
          healthy: `${healthReport.healthySystems}/${healthReport.totalSystems}`,
          issues:
            healthReport.criticalErrors.length + healthReport.warnings.length,
        });
      }
      return healthReport;
    }
    /**
     * Retry failed system initialization
     * @param {string} failedSystemName - Name of the system to retry
     * @param {number} maxRetries - Maximum number of retry attempts
     * @returns {boolean} True if retry succeeded
     */
    async _retryFailedSystemInitialization(failedSystemName, maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(
            `\u{1F504} [Year3000System] Retry attempt ${attempt}/${maxRetries} for ${failedSystemName}`
          );
          switch (failedSystemName) {
            case "sidebarConsciousnessSystem":
              if (!this.sidebarConsciousnessSystem) {
                const SidebarConsciousnessSystem_IMPORTED = (
                  await Promise.resolve().then(
                    () => (
                      init_SidebarConsciousnessSystem(),
                      SidebarConsciousnessSystem_exports
                    )
                  )
                ).SidebarConsciousnessSystem;
                this.sidebarConsciousnessSystem =
                  new SidebarConsciousnessSystem_IMPORTED(
                    this.YEAR3000_CONFIG,
                    this.utils,
                    this.performanceMonitor,
                    this.musicAnalysisService,
                    this.settingsManager
                  );
                await this.sidebarConsciousnessSystem.initialize();
              }
              break;
            case "colorHarmonyEngine":
              if (!this.colorHarmonyEngine) {
                const ColorHarmonyEngine_IMPORTED = (
                  await Promise.resolve().then(
                    () => (
                      init_ColorHarmonyEngine(), ColorHarmonyEngine_exports
                    )
                  )
                ).ColorHarmonyEngine;
                this.colorHarmonyEngine = new ColorHarmonyEngine_IMPORTED(
                  this.YEAR3000_CONFIG,
                  this.utils,
                  this.performanceMonitor,
                  this.musicAnalysisService,
                  this.settingsManager
                );
              }
              break;
            case "musicAnalysisService":
              if (!this.musicAnalysisService) {
                const MusicAnalysisService_IMPORTED = (
                  await import("../services/MusicAnalysisService.js")
                ).MusicAnalysisService;
                this.musicAnalysisService = new MusicAnalysisService_IMPORTED({
                  YEAR3000_CONFIG: this.YEAR3000_CONFIG,
                  utils: this.utils,
                  performanceMonitor: this.performanceMonitor,
                });
                await this.musicAnalysisService.initialize();
              }
              break;
            case "musicSyncService":
              if (!this.musicSyncService) {
                const { MusicSyncService: MusicSyncService2 } =
                  await Promise.resolve().then(
                    () => (init_MusicSyncService(), MusicSyncService_exports)
                  );
                this.musicSyncService = new MusicSyncService2({
                  YEAR3000_CONFIG: this.YEAR3000_CONFIG,
                  Year3000Utilities: this.utils,
                  colorHarmonyEngine: this.colorHarmonyEngine,
                  settingsManager: this.settingsManager,
                  genreProfileManager: this.genreProfileManager,
                });
                await this.musicSyncService.initialize();
              }
              break;
            default:
              console.warn(
                `\u{1F504} [Year3000System] No retry logic defined for ${failedSystemName}`
              );
              return false;
          }
          console.log(
            `\u2705 [Year3000System] Successfully retried ${failedSystemName}`
          );
          return true;
        } catch (error) {
          console.warn(
            `\u26A0\uFE0F [Year3000System] Retry ${attempt} failed for ${failedSystemName}:`,
            error
          );
          if (attempt === maxRetries) {
            console.error(
              `\u274C [Year3000System] All retries exhausted for ${failedSystemName}`
            );
            return false;
          }
          await new Promise((resolve) => setTimeout(resolve, attempt * 100));
        }
      }
      return false;
    }
    /**
     * Add performance monitoring for critical method calls
     */
    _addPerformanceMonitoring() {
      if (!this.YEAR3000_CONFIG) return;
      const methodsToMonitor = [
        "getCurrentModeProfile",
        "getCurrentMultipliers",
        "setArtisticMode",
        "getCurrentFeatures",
      ];
      methodsToMonitor.forEach((methodName) => {
        if (typeof this.YEAR3000_CONFIG[methodName] === "function") {
          const originalMethod = this.YEAR3000_CONFIG[methodName];
          this.YEAR3000_CONFIG[methodName] = (...args) => {
            const startTime = performance.now();
            try {
              const result = originalMethod.apply(this.YEAR3000_CONFIG, args);
              const duration = performance.now() - startTime;
              if (duration > 10 && this.YEAR3000_CONFIG.enableDebug) {
                console.warn(
                  `\u26A0\uFE0F [PerformanceMonitor] ${methodName} took ${duration.toFixed(
                    2
                  )}ms`
                );
              }
              return result;
            } catch (error) {
              const duration = performance.now() - startTime;
              console.error(
                `\u274C [PerformanceMonitor] ${methodName} failed after ${duration.toFixed(
                  2
                )}ms:`,
                error
              );
              throw error;
            }
          };
        }
      });
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F4CA} [Year3000System] Performance monitoring enabled for YEAR3000_CONFIG methods"
        );
      }
    }
    /**
     * Apply all saved settings immediately when the theme loads
     * This prevents settings from only being applied when users visit the settings page
     */
    async applyInitialSettings() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F527} [Year3000System] applyInitialSettings(): Applying saved theme settings..."
        );
      }
      if (!this.settingsManager) {
        console.warn(
          "[Year3000System] applyInitialSettings(): SettingsManager not available"
        );
        return;
      }
      try {
        const selectedAccent =
          this.settingsManager.get("catppuccin-accentColor") || "mauve";
        await this._applyCatppuccinAccent(selectedAccent);
        const gradientIntensity =
          this.settingsManager.get("sn-gradientIntensity") || "balanced";
        const starDensity =
          this.settingsManager.get("sn-starDensity") || "balanced";
        await this._applyStarryNightSettings(gradientIntensity, starDensity);
        const glassmorphismIntensity =
          this.settingsManager.get("sn-glassmorphismIntensity") || "moderate";
        if (
          this.glassmorphismManager &&
          this.glassmorphismManager.applyGlassmorphismSettings
        ) {
          this.glassmorphismManager.applyGlassmorphismSettings(
            glassmorphismIntensity
          );
        }
        const morphing3DMode =
          this.settingsManager.get("sn-3dMorphingMode") || "dynamic";
        if (this.card3DManager && this.card3DManager.apply3DMode) {
          this.card3DManager.apply3DMode(morphing3DMode);
        }
        const artisticMode =
          this.settingsManager.get("sn-artisticMode") || "artist-vision";
        if (!this._validateConfigInitialization()) {
          console.warn(
            "\u{1F3A8} [Year3000System] Skipping artistic mode initialization due to config issues"
          );
          this.YEAR3000_CONFIG.artisticMode = artisticMode;
        } else {
          await this.initializeArtisticMode(artisticMode);
        }
        if (this.updateColorsFromCurrentTrack) {
          this.updateColorsFromCurrentTrack();
        }
        const currentHarmonicMode =
          this.settingsManager.get("sn-currentHarmonicMode") ||
          "analogous-flow";
        const harmonicIntensity = parseFloat(
          this.settingsManager.get("sn-harmonicIntensity") || "0.7"
        );
        const harmonicEvolution =
          (this.settingsManager.get("sn-harmonicEvolution") || "true") ===
          "true";
        this.updateConfiguration("currentHarmonicMode", currentHarmonicMode);
        this.updateConfiguration("harmonicIntensity", harmonicIntensity);
        this.updateConfiguration("harmonicEvolution", harmonicEvolution);
        const manualBaseColor =
          this.settingsManager.get("sn-harmonicManualBaseColor") || "";
        if (manualBaseColor && this.updateHarmonicBaseColor) {
          this.updateHarmonicBaseColor(manualBaseColor);
        }
        if (
          this.sidebarConsciousnessSystem &&
          this.sidebarConsciousnessSystem.updateHarmonicModeDisplay
        ) {
          this.sidebarConsciousnessSystem.updateHarmonicModeDisplay(
            currentHarmonicMode
          );
        }
        const performanceQuality =
          this.settingsManager.get("sn-performanceQuality") || "auto";
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u{1F527} [Year3000System] Performance quality loaded: ${performanceQuality}`
          );
        }
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u2705 [Year3000System] applyInitialSettings(): All saved settings applied successfully"
          );
        }
      } catch (error) {
        console.error(
          "\u274C [Year3000System] applyInitialSettings(): Error applying settings:",
          error
        );
      }
    }
    /**
     * Apply Catppuccin accent color setting
     */
    async _applyCatppuccinAccent(selectedAccent) {
      try {
        const colorScheme = Spicetify.Config?.color_scheme || "mocha";
        const accent = selectedAccent === "none" ? "text" : selectedAccent;
        const properties = {
          "--spice-text":
            selectedAccent === "none"
              ? void 0
              : `var(--spice-${selectedAccent})`,
          "--spice-button-active":
            selectedAccent === "none"
              ? void 0
              : `var(--spice-${selectedAccent})`,
          "--spice-equalizer": document.querySelector(
            "body > script.marketplaceScript"
          )
            ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')`
            : `url('${colorScheme}/equalizer-animated-${accent}.gif')`,
        };
        Object.entries(properties).forEach(([property, value]) => {
          if (value === void 0 || value.includes("none")) {
            document.documentElement.style.removeProperty(property);
          } else {
            document.documentElement.style.setProperty(property, value);
          }
        });
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u{1F3A8} [Year3000System] Applied Catppuccin accent: ${selectedAccent}`
          );
        }
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Error applying Catppuccin accent:",
          error
        );
      }
    }
    /**
     * Apply StarryNight gradient and star settings
     */
    async _applyStarryNightSettings(gradientIntensity, starDensity) {
      try {
        applyStarryNightSettings(gradientIntensity, starDensity);
        if (starDensity !== "disabled") {
          setTimeout(() => {
            startShootingStars();
          }, 500);
        }
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u{1F31F} [Year3000System] Applied StarryNight settings - Gradient: ${gradientIntensity}, Stars: ${starDensity}`
          );
        }
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Error applying StarryNight settings:",
          error
        );
        this._manuallyApplyStarryNightSettings(gradientIntensity, starDensity);
      }
    }
    /**
     * Manual application of starry night settings if the main function isn't available
     */
    _manuallyApplyStarryNightSettings(gradientIntensity, starDensity) {
      const gradientSettings = {
        disabled: { opacity: 0 },
        minimal: { opacity: 0.05 },
        balanced: { opacity: 0.15 },
        intense: { opacity: 0.25 },
      };
      const gradient =
        gradientSettings[gradientIntensity] || gradientSettings["balanced"];
      document.documentElement.style.setProperty(
        "--sn-gradient-opacity",
        gradient.opacity.toString()
      );
      const starSettings = {
        disabled: { display: "none" },
        minimal: { display: "block", animationDuration: "8s" },
        balanced: { display: "block", animationDuration: "6s" },
        intense: { display: "block", animationDuration: "4s" },
      };
      const stars = starSettings[starDensity] || starSettings["balanced"];
      const starContainer = document.querySelector(".star-container");
      if (starContainer) {
        starContainer.style.display = stars.display;
        if (stars.animationDuration) {
          starContainer.style.setProperty(
            "--star-animation-duration",
            stars.animationDuration
          );
        }
      }
    }
    // MODIFIED: Add destroyAllSystems method for cleanup
    async destroyAllSystems() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F30C} [Year3000System] destroyAllSystems(): Cleaning up..."
        );
      }
      this.stopProactiveHealthMonitoring();
      const performanceSystems = [
        {
          name: "MasterAnimationCoordinator",
          instance: this.masterAnimationCoordinator,
        },
        {
          name: "TimerConsolidationSystem",
          instance: this.timerConsolidationSystem,
        },
        { name: "CSSVariableBatcher", instance: this.cssVariableBatcher },
        {
          name: "DeviceCapabilityDetector",
          instance: this.deviceCapabilityDetector,
        },
        { name: "PerformanceAnalyzer", instance: this.performanceAnalyzer },
      ];
      for (const system of performanceSystems) {
        try {
          if (
            system.instance &&
            typeof system.instance.destroy === "function"
          ) {
            await system.instance.destroy();
            destroyResults.success.push(system.name);
            if (this.YEAR3000_CONFIG.enableDebug)
              console.log(
                `\u{1F30C} [Year3000System] ${system.name} destroyed.`
              );
          } else {
            destroyResults.skipped.push(system.name);
          }
        } catch (error) {
          console.error(
            `\u274C [Year3000System] Failed to destroy ${system.name}:`,
            error
          );
          destroyResults.failed.push(system.name);
        }
      }
      this.masterAnimationCoordinator = null;
      this.timerConsolidationSystem = null;
      this.cssVariableBatcher = null;
      this.deviceCapabilityDetector = null;
      this.performanceAnalyzer = null;
      const destroyResults = {
        success: [],
        failed: [],
        skipped: [],
      };
      try {
        if (
          this._songChangeHandler &&
          typeof Spicetify !== "undefined" &&
          Spicetify.Player
        ) {
          Spicetify.Player.removeEventListener(
            "songchange",
            this._songChangeHandler
          );
          this._songChangeHandler = null;
          destroyResults.success.push("Spicetify songchange listener");
        }
      } catch (error) {
        console.error(
          "\u274C [Year3000System] Failed to remove Spicetify event listeners:",
          error
        );
        destroyResults.failed.push("Spicetify songchange listener");
      }
      const visualSystems = [
        {
          name: "SidebarConsciousnessSystem",
          instance: this.sidebarConsciousnessSystem,
        },
        {
          name: "PredictiveMaterializationSystem",
          instance: this.predictiveMaterializationSystem,
        },
        {
          name: "BehavioralPredictionEngine",
          instance: this.behavioralPredictionEngine,
        },
        { name: "BeatSyncVisualSystem", instance: this.beatSyncVisualSystem },
        { name: "DataGlyphSystem", instance: this.dataGlyphSystem },
        {
          name: "DimensionalNexusSystem",
          instance: this.dimensionalNexusSystem,
        },
        {
          name: "LightweightParticleSystem",
          instance: this.lightweightParticleSystem,
        },
      ];
      for (const system of visualSystems) {
        try {
          if (
            system.instance &&
            typeof system.instance.destroy === "function"
          ) {
            system.instance.destroy();
            destroyResults.success.push(system.name);
            if (this.YEAR3000_CONFIG.enableDebug)
              console.log(
                `\u{1F30C} [Year3000System] ${system.name} destroyed.`
              );
          } else {
            destroyResults.skipped.push(system.name);
          }
        } catch (error) {
          console.error(
            `\u274C [Year3000System] Failed to destroy ${system.name}:`,
            error
          );
          destroyResults.failed.push(system.name);
        }
      }
      const managers = [
        { name: "Card3DManager", instance: this.card3DManager },
        { name: "GlassmorphismManager", instance: this.glassmorphismManager },
        { name: "MusicAnalysisService", instance: this.musicAnalysisService },
        { name: "BMPHarmonyEngine", instance: this.bmpHarmonyEngine },
        { name: "ColorHarmonyEngine", instance: this.colorHarmonyEngine },
        { name: "PerformanceMonitor", instance: this.performanceMonitor },
      ];
      for (const manager of managers) {
        try {
          if (
            manager.instance &&
            typeof manager.instance.destroy === "function"
          ) {
            manager.instance.destroy();
            destroyResults.success.push(manager.name);
            if (this.YEAR3000_CONFIG.enableDebug)
              console.log(
                `\u{1F30C} [Year3000System] ${manager.name} destroyed.`
              );
          } else {
            destroyResults.skipped.push(manager.name);
          }
        } catch (error) {
          console.error(
            `\u274C [Year3000System] Failed to destroy ${manager.name}:`,
            error
          );
          destroyResults.failed.push(manager.name);
        }
      }
      this.lightweightParticleSystem = null;
      this.dimensionalNexusSystem = null;
      this.dataGlyphSystem = null;
      this.beatSyncVisualSystem = null;
      this.behavioralPredictionEngine = null;
      this.predictiveMaterializationSystem = null;
      this.sidebarConsciousnessSystem = null;
      this.card3DManager = null;
      this.glassmorphismManager = null;
      this.musicAnalysisService = null;
      this.bmpHarmonyEngine = null;
      this.colorHarmonyEngine = null;
      this.performanceMonitor = null;
      this.settingsManager = null;
      this.initialized = false;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(`\u{1F4CA} [Year3000System] Destruction Results:`);
        console.log(`  \u2705 Success: ${destroyResults.success.length}`);
        console.log(`  \u274C Failed: ${destroyResults.failed.length}`);
        console.log(`  \u23ED\uFE0F Skipped: ${destroyResults.skipped.length}`);
        if (destroyResults.failed.length > 0) {
          console.log(
            `  Failed components: ${destroyResults.failed.join(", ")}`
          );
        }
        console.log("\u{1F30C} [Year3000System] All systems destroyed.");
      }
    }
    // --- Placeholder for Core System Methods ---
    applyColorsToTheme(extractedColors = {}) {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A8} [Year3000System] applyColorsToTheme() called with extracted colors:",
          extractedColors
        );
      }
      const rootElement = this.utils.getRootStyle();
      if (!rootElement) {
        console.warn(
          "[Year3000System applyColorsToTheme] Root element not found."
        );
        return;
      }
      const defaults = this.YEAR3000_CONFIG.catppuccinDefaults || {};
      const primaryColorHex =
        extractedColors.VIBRANT ||
        extractedColors.PROMINENT ||
        defaults.mauve ||
        "#ca9ee6";
      const secondaryColorHex =
        extractedColors.DARK_VIBRANT ||
        extractedColors.DESATURATED ||
        defaults.lavender ||
        "#babbf1";
      const accentColorHex =
        extractedColors.VIBRANT_NON_ALARMING ||
        extractedColors.LIGHT_VIBRANT ||
        defaults.blue ||
        "#8caaee";
      const primaryRgbSource = this.utils.hexToRgb(primaryColorHex);
      const secondaryRgbSource = this.utils.hexToRgb(secondaryColorHex);
      const accentRgbSource = this.utils.hexToRgb(accentColorHex);
      const defaultRgb = { r: 0, g: 0, b: 0 };
      const primaryOklab = this.utils.rgbToOklab(
        primaryRgbSource?.r ?? defaultRgb.r,
        primaryRgbSource?.g ?? defaultRgb.g,
        primaryRgbSource?.b ?? defaultRgb.b
      );
      const secondaryOklab = this.utils.rgbToOklab(
        secondaryRgbSource?.r ?? defaultRgb.r,
        secondaryRgbSource?.g ?? defaultRgb.g,
        secondaryRgbSource?.b ?? defaultRgb.b
      );
      const accentOklab = this.utils.rgbToOklab(
        accentRgbSource?.r ?? defaultRgb.r,
        accentRgbSource?.g ?? defaultRgb.g,
        accentRgbSource?.b ?? defaultRgb.b
      );
      let musicContext = {};
      const latestMusicData =
        this.musicAnalysisService?.getLatestProcessedData();
      if (this.YEAR3000_CONFIG.enableMusicAnalysis && latestMusicData) {
        musicContext = {
          musicEnergy: latestMusicData.processedEnergy,
          // Ensure field names match service output
          moodIdentifier: latestMusicData.moodIdentifier,
          // Ensure field names match service output
          visualIntensity: latestMusicData.visualIntensity,
          // Ensure field names match service output
        };
      }
      const processedPrimaryOklab = this.utils.processOklabColor(
        primaryOklab,
        musicContext
      );
      const processedSecondaryOklab = this.utils.processOklabColor(
        secondaryOklab,
        musicContext
      );
      const processedAccentOklab = this.utils.processOklabColor(
        accentOklab,
        musicContext
      );
      const finalPrimaryRgb = this.utils.oklabToRgb(
        processedPrimaryOklab.L,
        processedPrimaryOklab.a,
        processedPrimaryOklab.b
      );
      const finalSecondaryRgb = this.utils.oklabToRgb(
        processedSecondaryOklab.L,
        processedSecondaryOklab.a,
        processedSecondaryOklab.b
      );
      const finalAccentRgb = this.utils.oklabToRgb(
        processedAccentOklab.L,
        processedAccentOklab.a,
        processedAccentOklab.b
      );
      const finalPrimaryHex = this.utils.rgbToHex(
        finalPrimaryRgb.r,
        finalPrimaryRgb.g,
        finalPrimaryRgb.b
      );
      const finalSecondaryHex = this.utils.rgbToHex(
        finalSecondaryRgb.r,
        finalSecondaryRgb.g,
        finalSecondaryRgb.b
      );
      const finalAccentHex = this.utils.rgbToHex(
        finalAccentRgb.r,
        finalAccentRgb.g,
        finalAccentRgb.b
      );
      rootElement.style.setProperty("--sn-gradient-primary", finalPrimaryHex);
      rootElement.style.setProperty(
        "--sn-gradient-secondary",
        finalSecondaryHex
      );
      rootElement.style.setProperty("--sn-gradient-accent", finalAccentHex);
      rootElement.style.setProperty(
        "--sn-gradient-primary-rgb",
        `${finalPrimaryRgb.r},${finalPrimaryRgb.g},${finalPrimaryRgb.b}`
      );
      rootElement.style.setProperty(
        "--sn-gradient-secondary-rgb",
        `${finalSecondaryRgb.r},${finalSecondaryRgb.g},${finalSecondaryRgb.b}`
      );
      rootElement.style.setProperty(
        "--sn-gradient-accent-rgb",
        `${finalAccentRgb.r},${finalAccentRgb.g},${finalAccentRgb.b}`
      );
      const oklabColors = {
        primary: processedPrimaryOklab,
        secondary: processedSecondaryOklab,
        accent: processedAccentOklab,
      };
      const finalRgbs = {
        primary: finalPrimaryRgb,
        secondary: finalSecondaryRgb,
        accent: finalAccentRgb,
      };
      for (const key of ["primary", "secondary", "accent"]) {
        const derivedProps = this.utils.calculateOklabDerivedProperties(
          oklabColors[key]
        );
        rootElement.style.setProperty(
          `--sn-oklab-${key}-l`,
          derivedProps.L_star.toFixed(4)
        );
        rootElement.style.setProperty(
          `--sn-oklab-${key}-a`,
          derivedProps.a_star.toFixed(4)
        );
        rootElement.style.setProperty(
          `--sn-oklab-${key}-b`,
          derivedProps.b_star.toFixed(4)
        );
        rootElement.style.setProperty(
          `--sn-oklab-${key}-chroma`,
          derivedProps.chroma.toFixed(4)
        );
        rootElement.style.setProperty(
          `--sn-oklab-${key}-hue`,
          derivedProps.hue.toFixed(2)
        );
        rootElement.style.setProperty(
          `--sn-oklab-processed-${key}-rgb-r`,
          finalRgbs[key].r.toString()
        );
        rootElement.style.setProperty(
          `--sn-oklab-processed-${key}-rgb-g`,
          finalRgbs[key].g.toString()
        );
        rootElement.style.setProperty(
          `--sn-oklab-processed-${key}-rgb-b`,
          finalRgbs[key].b.toString()
        );
      }
      this._setSpiceRgbVariables();
      this._setGradientParameters();
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A8} [Year3000System applyColorsToTheme] Completed applying colors and parameters."
        );
      }
    }
    async updateColorsFromCurrentTrack() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F504} [Year3000System] updateColorsFromCurrentTrack() called."
        );
      }
      let originalExtractedColors = null;
      try {
        const track = await this.waitForTrackData(5, 50);
        if (!track?.uri) {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "[Year3000System updateColorsFromCurrentTrack] No track URI after retry attempts, applying defaults via applyColorsToTheme."
            );
          }
          this.applyColorsToTheme({});
          return;
        }
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[Year3000System updateColorsFromCurrentTrack] Attempting Spicetify.colorExtractor for track URI:",
            track.uri
          );
        }
        originalExtractedColors = await Spicetify.colorExtractor(track.uri);
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[Year3000System updateColorsFromCurrentTrack] Original extracted colors:",
            JSON.stringify(originalExtractedColors)
          );
        }
      } catch (error) {
        console.warn(
          "[Year3000System updateColorsFromCurrentTrack] Color extraction failed:",
          error
        );
        originalExtractedColors = {};
      }
      let colorsToApply = {
        ...(originalExtractedColors || {}),
      };
      const harmonicMode = this.YEAR3000_CONFIG.currentHarmonicMode;
      const evolveHarmonies = this.YEAR3000_CONFIG.harmonicEvolution;
      const manualBaseOverride = this.YEAR3000_CONFIG.harmonicBaseColor;
      const defaults = this.YEAR3000_CONFIG.catppuccinDefaults || {};
      if (harmonicMode && harmonicMode !== "none") {
        let baseHexForHarmonics;
        if (manualBaseOverride) {
          baseHexForHarmonics = manualBaseOverride;
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "[Year3000System updateColors] Using manual base for harmonics:",
              baseHexForHarmonics
            );
          }
        } else if (evolveHarmonies) {
          baseHexForHarmonics =
            originalExtractedColors?.VIBRANT ||
            originalExtractedColors?.PROMINENT ||
            defaults.mauve || // Fallback to Catppuccin default
            "#ca9ee6";
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "[Year3000System updateColors] Using auto base for harmonics:",
              baseHexForHarmonics
            );
          }
        } else {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "[Year3000System updateColors] Harmonic evolution disabled and no manual base. Applying original/default colors directly."
            );
          }
        }
        if (baseHexForHarmonics) {
          const harmonicSet = this.evolveHarmonicSignature(
            harmonicMode,
            baseHexForHarmonics
          );
          if (harmonicSet) {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(
                "[Year3000System updateColors] Generated harmonic set:",
                JSON.stringify(harmonicSet)
              );
            }
            colorsToApply = {
              ...colorsToApply,
              VIBRANT: baseHexForHarmonics,
              DARK_VIBRANT: harmonicSet.derivedDarkVibrantHex,
              LIGHT_VIBRANT: harmonicSet.derivedLightVibrantHex,
            };
          } else {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.warn(
                "[Year3000System updateColors] evolveHarmonicSignature returned null. Using original/default colors."
              );
            }
          }
        }
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "[Year3000System updateColors] Final colors to apply to theme:",
          JSON.stringify(colorsToApply)
        );
      }
      this.applyColorsToTheme(colorsToApply || {});
    }
    evolveHarmonicSignature(selectedModeKey, baseSourceHex) {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3B6} [Year3000System] evolveHarmonicSignature(${selectedModeKey}, ${baseSourceHex}) called.`
        );
      }
      if (
        !selectedModeKey ||
        !baseSourceHex ||
        !this.HARMONIC_MODES[selectedModeKey]
      ) {
        console.warn(
          "[Year3000System evolveHarmonicSignature] Invalid mode key or base hex. Mode:",
          selectedModeKey,
          "BaseHex:",
          baseSourceHex
        );
        return null;
      }
      const modeDetails = this.HARMONIC_MODES[selectedModeKey];
      const intensity = this.YEAR3000_CONFIG.harmonicIntensity;
      const baseRgb = this.utils.hexToRgb(baseSourceHex);
      if (!baseRgb) {
        console.warn(
          "[Year3000System evolveHarmonicSignature] Could not convert base hex to RGB:",
          baseSourceHex
        );
        return null;
      }
      const baseOklab = this.utils.rgbToOklab(baseRgb.r, baseRgb.g, baseRgb.b);
      const rawHarmonicOklabs = this.utils.generateHarmonicOklabColors(
        baseOklab,
        modeDetails.rule,
        modeDetails.angle
      );
      let derivedOklab1, derivedOklab2;
      if (rawHarmonicOklabs && rawHarmonicOklabs.length > 0) {
        derivedOklab1 = rawHarmonicOklabs[0];
        derivedOklab2 =
          rawHarmonicOklabs.length > 1
            ? rawHarmonicOklabs[1]
            : {
                ...rawHarmonicOklabs[0],
                L: Math.max(
                  0.1,
                  Math.min(
                    0.9,
                    rawHarmonicOklabs[0].L *
                      (rawHarmonicOklabs[0].L > 0.5 ? 0.8 : 1.2)
                  )
                ),
              };
      } else {
        derivedOklab1 = {
          ...baseOklab,
          L: Math.max(0.1, Math.min(0.9, baseOklab.L * 0.75)),
        };
        derivedOklab2 = {
          ...baseOklab,
          L: Math.max(0.1, Math.min(0.9, baseOklab.L * 1.25)),
        };
      }
      const blendWithIntensity = (targetOklab) => ({
        L: baseOklab.L + (targetOklab.L - baseOklab.L) * intensity,
        a: baseOklab.a + (targetOklab.a - baseOklab.a) * intensity,
        b: baseOklab.b + (targetOklab.b - baseOklab.b) * intensity,
      });
      const finalOklab1 = blendWithIntensity(derivedOklab1);
      const finalOklab2 = blendWithIntensity(derivedOklab2);
      const finalRgb1 = this.utils.oklabToRgb(
        finalOklab1.L,
        finalOklab1.a,
        finalOklab1.b
      );
      const finalHex1 = this.utils.rgbToHex(
        finalRgb1.r,
        finalRgb1.g,
        finalRgb1.b
      );
      const finalRgb2 = this.utils.oklabToRgb(
        finalOklab2.L,
        finalOklab2.a,
        finalOklab2.b
      );
      const finalHex2 = this.utils.rgbToHex(
        finalRgb2.r,
        finalRgb2.g,
        finalRgb2.b
      );
      let darkVibrantHex, lightVibrantHex;
      if (finalOklab1.L < finalOklab2.L) {
        darkVibrantHex = finalHex1;
        lightVibrantHex = finalHex2;
      } else {
        darkVibrantHex = finalHex2;
        lightVibrantHex = finalHex1;
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3B6} [Year3000System] evolveHarmonicSignature() produced:",
          {
            derivedDarkVibrantHex: darkVibrantHex,
            derivedLightVibrantHex: lightVibrantHex,
          }
        );
      }
      return {
        derivedDarkVibrantHex: darkVibrantHex,
        derivedLightVibrantHex: lightVibrantHex,
      };
    }
    // Enhanced helper method inspired by Cat Jam extension for reliable track data retrieval
    async waitForTrackData(maxRetries = 10, delayMs = 100) {
      for (let i = 0; i < maxRetries; i++) {
        const track =
          Spicetify.Player.data?.item ||
          Spicetify.Player.data?.track ||
          Spicetify.Player.state?.track ||
          Spicetify.Queue?.track;
        if (track?.uri) {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              `\u{1F3A7} [Year3000System] Track data retrieved on attempt ${
                i + 1
              }:`,
              track.uri
            );
          }
          return track;
        }
        if (i < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * Math.pow(1.5, i))
          );
        }
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.warn(
          `\u{1F3A7} [Year3000System] Failed to retrieve track data after ${maxRetries} attempts`
        );
      }
      return null;
    }
    // Helper method to set :root CSS variables for spice-rgb values
    _setSpiceRgbVariables() {
      const rootElement = this.utils.getRootStyle();
      if (!rootElement) {
        console.warn(
          "[Year3000System _setSpiceRgbVariables] Root element not found."
        );
        return;
      }
      const computedRootStyle = getComputedStyle(rootElement);
      const getColorVal = (varName) =>
        computedRootStyle.getPropertyValue(varName).trim();
      const hexVariables = {
        main: getColorVal("--spice-main"),
        player: getColorVal("--spice-player"),
        sidebar: getColorVal("--spice-sidebar"),
        card: getColorVal("--spice-card"),
        surface0: getColorVal("--spice-surface0") || getColorVal("--surface0"),
        // Catppuccin standard with fallback
        surface1: getColorVal("--spice-surface1") || getColorVal("--surface1"),
        // Catppuccin standard with fallback
        text: getColorVal("--spice-text"),
      };
      const rgbMappings = {
        main: ["--spice-rgb-main", "--spice-rgb-base"],
        player: ["--spice-rgb-player"],
        sidebar: ["--spice-rgb-sidebar"],
        card: ["--spice-rgb-card"],
        surface0: ["--spice-rgb-surface0"],
        surface1: ["--spice-rgb-surface1"],
        text: ["--spice-rgb-text"],
      };
      for (const key in hexVariables) {
        if (hexVariables[key]) {
          const rgb = this.utils.hexToRgb(
            hexVariables[key].startsWith("#")
              ? hexVariables[key]
              : `#${hexVariables[key]}`
          );
          if (rgb && rgbMappings[key]) {
            rgbMappings[key].forEach((cssVar) => {
              rootElement.style.setProperty(
                cssVar,
                `${rgb.r},${rgb.g},${rgb.b}`
              );
            });
          }
        } else {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.warn(
              `[Year3000System _setSpiceRgbVariables] CSS variable for '${key}' not found or empty.`
            );
          }
        }
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A8} [Year3000System _setSpiceRgbVariables] Completed setting spice RGB variables."
        );
      }
    }
    // Public method for external calls (e.g., from SettingsSection.js)
    setGradientParameters() {
      return this._setGradientParameters();
    }
    // Helper method to set :root CSS variables for gradient parameters
    _setGradientParameters() {
      const rootElement = this.utils.getRootStyle();
      if (!rootElement) {
        console.warn(
          "[Year3000System _setGradientParameters] Root element not found."
        );
        return;
      }
      const multipliers = this.YEAR3000_CONFIG.getCurrentMultipliers();
      let effectiveOpacity = multipliers.opacity;
      const artisticMode = this.YEAR3000_CONFIG.artisticMode;
      const musicData = this.musicAnalysisService?.getLatestProcessedData();
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[Year3000System _setGradientParameters] Initial artistic mode: ${artisticMode}, Base opacity for mode: ${effectiveOpacity}`
        );
        console.log(
          `[Year3000System _setGradientParameters] CosmicSync enabled: ${this.YEAR3000_CONFIG.enableCosmicSync}, musicData from service:`,
          musicData
        );
      }
      if (
        this.YEAR3000_CONFIG.enableCosmicSync &&
        musicData &&
        typeof musicData.energy !== "undefined" &&
        typeof musicData.valence !== "undefined"
      ) {
        let musicMultiplier = 1;
        try {
          if (
            this.colorHarmonyEngine?.getMusicIntensityMultiplier &&
            typeof this.colorHarmonyEngine.getMusicIntensityMultiplier ===
              "function"
          ) {
            musicMultiplier =
              this.colorHarmonyEngine.getMusicIntensityMultiplier(
                musicData.energy || 0.5,
                musicData.valence || 0.5
              );
          } else {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.warn(
                "[Year3000System _setGradientParameters] getMusicIntensityMultiplier not available on colorHarmonyEngine. Using fallback logic."
              );
            }
            const baseBoost = multipliers.musicEnergyBoost || 1;
            musicMultiplier = baseBoost * (1 + (musicData.energy - 0.5) * 0.5);
            musicMultiplier = Math.max(0.5, Math.min(2, musicMultiplier));
          }
          effectiveOpacity *= musicMultiplier;
          effectiveOpacity = Math.max(0.02, Math.min(0.8, effectiveOpacity));
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              `[Year3000System _setGradientParameters] Music sync ACTIVE. Energy: ${musicData.energy.toFixed(
                2
              )}, Valence: ${musicData.valence.toFixed(
                2
              )}, MusicMultiplier: ${musicMultiplier.toFixed(
                2
              )}, Final Opacity: ${effectiveOpacity.toFixed(2)}`
            );
          }
        } catch (e) {
          console.error(
            "[Year3000System _setGradientParameters] Error calculating music intensity multiplier:",
            e
          );
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              `[Year3000System _setGradientParameters] Music sync error. Using base opacity: ${effectiveOpacity.toFixed(
                2
              )}`
            );
          }
        }
      } else {
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `[Year3000System _setGradientParameters] Music sync NOT active or no data. Using base opacity: ${effectiveOpacity.toFixed(
              2
            )}`
          );
        }
      }
      rootElement.style.setProperty(
        "--sn-gradient-opacity",
        effectiveOpacity.toString()
      );
      rootElement.style.setProperty(
        "--sn-gradient-saturation",
        multipliers.saturation.toString()
      );
      rootElement.style.setProperty(
        "--sn-gradient-brightness",
        multipliers.brightness.toString()
      );
      rootElement.style.setProperty(
        "--sn-gradient-contrast",
        multipliers.contrast.toString()
      );
      const blurIntensity =
        artisticMode === "cosmic-maximum"
          ? "40px"
          : artisticMode === "artist-vision"
          ? "35px"
          : "30px";
      rootElement.style.setProperty("--sn-gradient-blur", blurIntensity);
      rootElement.style.setProperty(
        "--sn-gradient-transition",
        "2400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      );
      if (this.YEAR3000_CONFIG.enableCosmicSync && musicData) {
        rootElement.style.setProperty(
          "--sn-music-energy",
          musicData.energy?.toString() || "0.5"
        );
        rootElement.style.setProperty(
          "--sn-music-valence",
          musicData.valence?.toString() || "0.5"
        );
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System _setGradientParameters] Applied ${artisticMode.toUpperCase()} gradient parameters:`,
          {
            opacity: effectiveOpacity,
            saturation: multipliers.saturation,
            brightness: multipliers.brightness,
            contrast: multipliers.contrast,
            blur: blurIntensity,
          }
        );
      }
    }
    updateHarmonicBaseColor(hexColor) {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System] updateHarmonicBaseColor("${hexColor}") called.`
        );
      }
      if (this.YEAR3000_CONFIG) {
        this.YEAR3000_CONFIG.harmonicBaseColor = hexColor;
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[Year3000System updateHarmonicBaseColor] Manual base color set to:",
            hexColor
          );
        }
        this.updateColorsFromCurrentTrack();
      } else {
        console.warn(
          "[Year3000System updateHarmonicBaseColor] YEAR3000_CONFIG not available."
        );
      }
    }
    // Example of a helper that might be part of this system or remain in utils
    // For now, assuming methods like setSpiceRgbVariables, setGradientParameters are part of applyColorsToTheme
    // or called by it.
    setupMusicAnalysisAndColorExtraction() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A7} [Year3000System setupMusicAnalysisAndColorExtraction] Setting up music analysis and color extraction..."
        );
      }
      const processSongUpdate = async () => {
        if (this.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
          console.log(
            "\u{1F3A7} [Year3000System processSongUpdate] Processing song update..."
          );
        }
        const track = await this.waitForTrackData();
        const currentTrackUri = track?.uri;
        const trackDurationMs = track?.duration?.milliseconds || 0;
        if (this.YEAR3000_CONFIG.enableColorExtraction) {
          try {
            await this.updateColorsFromCurrentTrack();
          } catch (e) {
            console.error(
              `\u{1F3A8} [Year3000System processSongUpdate] Error during color update: ${
                e.message || e
              }`,
              e
            );
          }
        } else {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "[Year3000System processSongUpdate] Color extraction disabled."
            );
          }
        }
        if (currentTrackUri && this.YEAR3000_CONFIG.enableMusicAnalysis) {
          if (!this.musicAnalysisService) {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.warn(
                "[Year3000System processSongUpdate] MusicAnalysisService not available. Skipping analysis."
              );
            }
          } else if (
            !Spicetify.getAudioData ||
            typeof Spicetify.getAudioData !== "function"
          ) {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.warn(
                "[Year3000System processSongUpdate] Spicetify.getAudioData is not available. Skipping music feature fetching."
              );
            }
          } else {
            try {
              if (this.YEAR3000_CONFIG.enableDebug) {
                console.log(
                  "[Year3000System processSongUpdate] Attempting to fetch realistic audio data for URI:",
                  currentTrackUri
                );
              }
              const audioAnalysisData = await Spicetify.getAudioData(
                currentTrackUri
              );
              if (this.YEAR3000_CONFIG.enableDebug) {
                const trackInfo = audioAnalysisData?.track;
                if (trackInfo && typeof trackInfo.tempo !== "undefined") {
                  console.log(
                    `\u{1F3B5} [Year3000System] Audio analysis retrieved - Tempo: ${trackInfo.tempo}BPM, Loudness: ${trackInfo.loudness}dB`
                  );
                } else {
                  console.warn(
                    `\u{1F3B5} [Year3000System] Audio analysis data not available or incomplete for track URI: ${currentTrackUri}. This can happen for new or less popular songs. The system will use fallbacks.`
                  );
                }
              }
              await this.musicAnalysisService.processAudioFeatures(
                audioAnalysisData,
                currentTrackUri,
                trackDurationMs
              );
            } catch (e) {
              console.error(
                `\u{1F3A7} [Year3000System processSongUpdate] Error fetching/processing realistic audio data: ${
                  e.message || e
                }`,
                e
              );
              try {
                await this.musicAnalysisService.processAudioFeatures(
                  null,
                  currentTrackUri,
                  trackDurationMs
                );
              } catch (fallbackError) {
                console.error(
                  "[Year3000System processSongUpdate] Fallback processing also failed:",
                  fallbackError
                );
              }
            }
          }
        } else {
          if (this.YEAR3000_CONFIG.enableDebug) {
            if (!currentTrackUri) {
              console.log(
                "[Year3000System processSongUpdate] Music analysis skipped: No track URI available after retry attempts."
              );
            } else if (!this.YEAR3000_CONFIG.enableMusicAnalysis) {
              console.log(
                "[Year3000System processSongUpdate] Music analysis disabled by config."
              );
            }
          }
        }
      };
      if (Spicetify.Player) {
        this._songChangeHandler = processSongUpdate;
        Spicetify.Player.addEventListener(
          "songchange",
          this._songChangeHandler
        );
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F3A7} [Year3000System setupMusicAnalysisAndColorExtraction] Added songchange listener."
          );
        }
        setTimeout(processSongUpdate, 500);
      } else {
        console.error(
          "\u{1F3A7} [Year3000System setupMusicAnalysisAndColorExtraction] Spicetify.Player not available. Cannot set up song change listener."
        );
      }
    }
    // ===== YEAR 3000 ARTISTIC MODE MANAGEMENT =====
    /**
     * Validate that YEAR3000_CONFIG is properly initialized with all required methods
     * @returns {boolean} True if config is fully initialized
     */
    _validateConfigInitialization() {
      const requiredMethods = [
        "setArtisticMode",
        "getCurrentModeProfile",
        "getCurrentMultipliers",
        "getCurrentFeatures",
        "getCurrentPerformanceSettings",
      ];
      const missingMethods = requiredMethods.filter(
        (method) => typeof this.YEAR3000_CONFIG[method] !== "function"
      );
      if (missingMethods.length > 0) {
        console.error(
          `[Year3000System] Missing YEAR3000_CONFIG methods: ${missingMethods.join(
            ", "
          )}`
        );
        return false;
      }
      return true;
    }
    /**
     * Initialize the current artistic mode with full Year 3000 system configuration
     * @param {string} mode - Optional mode to initialize, defaults to current settings
     */
    async initializeArtisticMode(mode = null) {
      const targetMode =
        mode ||
        this.settingsManager?.get("sn-artisticMode") ||
        this.YEAR3000_CONFIG.artisticMode;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System] Initializing artistic mode: ${targetMode}`
        );
      }
      if (!this._validateConfigInitialization()) {
        console.warn(
          `\u{1F3A8} [Year3000System] Config not properly initialized - using fallback for mode: ${targetMode}`
        );
        this.YEAR3000_CONFIG.artisticMode = targetMode;
        return false;
      }
      if (!ARTISTIC_MODE_PROFILES[targetMode]) {
        console.warn(
          `\u{1F3A8} [Year3000System] Invalid artistic mode: ${targetMode}. Falling back to artist-vision`
        );
        await this.initializeArtisticMode("artist-vision");
        return;
      }
      const modeProfile = ARTISTIC_MODE_PROFILES[targetMode];
      try {
        const result = this.YEAR3000_CONFIG.setArtisticMode(targetMode);
        if (!result) {
          console.warn(
            `\u{1F3A8} [Year3000System] setArtisticMode returned false for mode: ${targetMode}`
          );
        }
      } catch (error) {
        console.error(
          `\u{1F3A8} [Year3000System] Error calling setArtisticMode for ${targetMode}:`,
          error
        );
        this.YEAR3000_CONFIG.artisticMode = targetMode;
      }
      await this.applyModeToAllSystems(modeProfile);
      this.setModeSpecificCSSVariables(modeProfile);
      if (typeof document !== "undefined") {
        document.dispatchEvent(
          new CustomEvent("year3000ArtisticModeInitialized", {
            detail: { mode: targetMode, profile: modeProfile },
          })
        );
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u2705 [Year3000System] Artistic mode initialized: ${targetMode}`
        );
      }
    }
    /**
     * Switch to a new artistic mode with smooth transition
     * @param {string} newMode - The artistic mode to switch to
     */
    async switchArtisticMode(newMode) {
      if (!ARTISTIC_MODE_PROFILES[newMode]) {
        console.error(
          `\u{1F3A8} [Year3000System] Cannot switch to invalid mode: ${newMode}`
        );
        return false;
      }
      const previousMode = this.YEAR3000_CONFIG.artisticMode;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System] Switching artistic mode: ${previousMode} \u2192 ${newMode}`
        );
      }
      try {
        const previousProfile = this.getCurrentModeProfile();
        if (this.settingsManager) {
          this.settingsManager.set("sn-artisticMode", newMode);
        }
        await this.initializeArtisticMode(newMode);
        if (this.updateColorsFromCurrentTrack) {
          await this.updateColorsFromCurrentTrack();
        }
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u2705 [Year3000System] Successfully switched to: ${newMode}`
          );
        }
        return true;
      } catch (error) {
        console.error(
          `\u274C [Year3000System] Error switching to mode ${newMode}:`,
          error
        );
        try {
          await this.initializeArtisticMode(previousMode);
        } catch (rollbackError) {
          console.error(
            `\u274C [Year3000System] Failed to rollback to ${previousMode}:`,
            rollbackError
          );
        }
        return false;
      }
    }
    /**
     * Get the current artistic mode profile with all Year 3000 parameters
     * @returns {Object} Current mode profile including multipliers, features, and performance settings
     */
    getCurrentModeProfile() {
      return (
        ARTISTIC_MODE_PROFILES[this.YEAR3000_CONFIG.artisticMode] ||
        ARTISTIC_MODE_PROFILES["artist-vision"]
      );
    }
    /**
     * Apply mode configuration to all visual systems
     * @param {Object} modeProfile - The artistic mode profile to apply
     */
    async applyModeToAllSystems(modeProfile) {
      const { features, performance: performance2, multipliers } = modeProfile;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System] Applying mode to all systems:`,
          features
        );
      }
      try {
        if (this.glassmorphismManager && features.glassEffects) {
          const glassIntensity =
            features.glassEffects === true ? "moderate" : "disabled";
          this.glassmorphismManager.applyGlassmorphismSettings(glassIntensity);
        }
        if (this.card3DManager && features.dimensionalEffects) {
          const morphingMode =
            features.dimensionalEffects === true ? "balanced" : "disabled";
          this.card3DManager.apply3DMode(morphingMode);
        }
        if (this.lightweightParticleSystem) {
          if (this.lightweightParticleSystem.updateModeConfiguration) {
            this.lightweightParticleSystem.updateModeConfiguration({
              maxParticles: performance2.maxParticles,
              enabled: features.particleStreams,
              intensity: multipliers.kineticIntensity,
            });
          }
        }
        if (this.beatSyncVisualSystem) {
          if (this.beatSyncVisualSystem.updateModeConfiguration) {
            this.beatSyncVisualSystem.updateModeConfiguration({
              enabled: features.beatSync,
              intensity: multipliers.musicEnergyBoost,
              throttle: performance2.animationThrottle,
            });
          }
        }
        if (this.dataGlyphSystem) {
          if (this.dataGlyphSystem.updateModeConfiguration) {
            this.dataGlyphSystem.updateModeConfiguration({
              enabled: features.dataGlyphs,
              animations: features.temporalEcho,
              intensity: multipliers.kineticIntensity,
            });
          }
        }
        if (this.behavioralPredictionEngine) {
          if (this.behavioralPredictionEngine.updateModeConfiguration) {
            this.behavioralPredictionEngine.updateModeConfiguration({
              enabled: features.predictiveHighlights,
              empathyLevel: multipliers.quantumEmpathyLevel,
              intensity: multipliers.temporalPlayFactor,
            });
          }
        }
        if (this.dimensionalNexusSystem) {
          if (this.dimensionalNexusSystem.updateModeConfiguration) {
            this.dimensionalNexusSystem.updateModeConfiguration({
              rippleEffects: features.rippleEffects,
              temporalEcho: features.temporalEcho,
              aestheticGravity: features.aestheticGravity || false,
              intensity: multipliers.aestheticGravityStrength,
            });
          }
        }
        this._setGradientParameters();
      } catch (error) {
        console.error(
          `\u274C [Year3000System] Error applying mode to systems:`,
          error
        );
      }
    }
    /**
     * Set CSS variables for mode-specific Year 3000 parameters
     * @param {Object} modeProfile - The artistic mode profile
     */
    setModeSpecificCSSVariables(modeProfile) {
      const { multipliers, features } = modeProfile;
      const root = document.documentElement;
      root.style.setProperty(
        "--sn-kinetic-intensity",
        multipliers.kineticIntensity.toString()
      );
      root.style.setProperty(
        "--sn-temporal-play-factor",
        multipliers.temporalPlayFactor.toString()
      );
      root.style.setProperty(
        "--sn-quantum-empathy-level",
        multipliers.quantumEmpathyLevel.toString()
      );
      root.style.setProperty(
        "--sn-aesthetic-gravity-strength",
        multipliers.aestheticGravityStrength.toString()
      );
      root.style.setProperty(
        "--sn-visual-intensity-base",
        multipliers.visualIntensityBase.toString()
      );
      root.style.setProperty(
        "--sn-ripple-effects",
        features.rippleEffects ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-temporal-echo",
        features.temporalEcho ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-particle-streams",
        features.particleStreams ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-aesthetic-gravity",
        features.aestheticGravity ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-quantum-empathy",
        features.quantumEmpathy ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-temporal-play",
        features.temporalPlay ? "1" : "0"
      );
      root.style.setProperty(
        "--sn-emergent-choreography",
        multipliers.emergentChoreography ? "1" : "0"
      );
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F3A8} [Year3000System] Mode-specific CSS variables set for:`,
          this.YEAR3000_CONFIG.artisticMode
        );
      }
    }
    setupEventListeners() {}
    getSystemReport() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F4CA} [Year3000System] Generating comprehensive system report..."
        );
      }
      const reportTimestamp = /* @__PURE__ */ new Date().toISOString();
      const report = {
        // === SYSTEM IDENTIFICATION ===
        timestamp: reportTimestamp,
        version: "3000.5.0",
        // Phase 5 version
        systemId: "year3000-starrynight-enhanced",
        // === CORE CONFIGURATION ===
        config: {
          artisticMode: this.YEAR3000_CONFIG.artisticMode,
          enableDebug: this.YEAR3000_CONFIG.enableDebug,
          enableCosmicSync: this.YEAR3000_CONFIG.enableCosmicSync,
          features: this.YEAR3000_CONFIG.getCurrentFeatures?.() || {},
          multipliers: this.YEAR3000_CONFIG.getCurrentMultipliers?.() || {},
          modeProfile: this.getCurrentModeProfile(),
        },
        // === SYSTEM HEALTH METRICS ===
        health: this._generateHealthMetrics(),
        // === INITIALIZATION STATUS ===
        initialization: {
          results: this.initializationResults || {},
          lastInitTime: this._lastInitializationTime || 0,
          totalSystems: this._getTotalSystemCount(),
          successRate: this._calculateCurrentSuccessRate(),
          retryHistory: this._initializationRetryHistory || [],
        },
        // === PERFORMANCE METRICS ===
        performance: this._generatePerformanceMetrics(),
        // === ERROR ANALYSIS ===
        errors: this._generateErrorAnalysis(),
        // === SYSTEM COMPONENTS STATUS ===
        components: this._generateComponentStatus(),
        // === MUSIC ANALYSIS INTEGRATION ===
        musicAnalysis: this._generateMusicAnalysisReport(),
        // === SETTINGS & CONFIGURATION ===
        settings: {
          current: this.settingsManager?.getAllSettings?.() || {},
          schema: this.settingsManager?.getSettingsSchema?.() || {},
          validation: this._validateCurrentSettings(),
        },
        // === ADVANCED TELEMETRY ===
        telemetry: this._generateTelemetryData(),
        // === FUTURE-PROOFING STATUS ===
        compatibility: this._generateCompatibilityReport(),
        // === RECOMMENDATIONS ===
        recommendations: this._generateSystemRecommendations(),
      };
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("\u{1F4CA} [Year3000System] System report generated:", {
          healthScore: report.health.overallScore,
          successRate: report.initialization.successRate,
          performanceScore: report.performance.overallScore,
          recommendations: report.recommendations.length,
        });
      }
      return report;
    }
    // ✅ PHASE 5: Health Metrics Generation
    _generateHealthMetrics() {
      const startTime = performance.now();
      const systemChecks = {
        coreConfig: this.YEAR3000_CONFIG ? 100 : 0,
        settingsManager: this.settingsManager?.isHealthy?.()
          ? 100
          : this.settingsManager
          ? 75
          : 0,
        musicAnalysis: this.musicAnalysisService?.isHealthy?.()
          ? 100
          : this.musicAnalysisService
          ? 75
          : 0,
        colorHarmony: this.colorHarmonyEngine?.isHealthy?.()
          ? 100
          : this.colorHarmonyEngine
          ? 75
          : 0,
        visualSystems: this._checkVisualSystemsHealth(),
        performance: this.performanceMonitor?.getHealthScore?.() || 85,
      };
      const overallScore =
        Object.values(systemChecks).reduce((sum, score) => sum + score, 0) /
        Object.keys(systemChecks).length;
      const healthLevel =
        overallScore >= 95
          ? "excellent"
          : overallScore >= 85
          ? "good"
          : overallScore >= 70
          ? "fair"
          : "poor";
      return {
        overallScore: Math.round(overallScore),
        healthLevel,
        systemChecks,
        lastChecked: /* @__PURE__ */ new Date().toISOString(),
        checkDuration: performance.now() - startTime,
        issues: this._identifyHealthIssues(systemChecks),
        trends: this._getHealthTrends(),
      };
    }
    // ✅ PHASE 5: Performance Metrics Collection
    _generatePerformanceMetrics() {
      const metrics = {
        initialization: {
          lastDuration: this._lastInitializationTime || 0,
          averageDuration: this._getAverageInitTime(),
          trend: this._getInitTimeTrend(),
        },
        memory: {
          usage: this._estimateMemoryUsage(),
          leakDetection: this._detectMemoryLeaks(),
          optimization: this._getMemoryOptimizations(),
        },
        rendering: {
          frameRate: this._estimateFrameRate(),
          gpuUtilization: this._checkGPUUtilization(),
          renderingOptimizations: this._getRenderingOptimizations(),
        },
        responsiveness: {
          uiLatency: this._measureUILatency(),
          colorExtractionTime: this._getColorExtractionMetrics(),
          settingsResponseTime: this._getSettingsResponseMetrics(),
        },
        overallScore: 0,
        // Will be calculated
      };
      const scores = [
        this._scoreInitialization(metrics.initialization),
        this._scoreMemory(metrics.memory),
        this._scoreRendering(metrics.rendering),
        this._scoreResponsiveness(metrics.responsiveness),
      ];
      metrics.overallScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );
      return metrics;
    }
    // ✅ PHASE 5: Error Pattern Analysis
    _generateErrorAnalysis() {
      return {
        recentErrors: this._getRecentErrors(),
        errorPatterns: this._analyzeErrorPatterns(),
        criticalErrors: this._getCriticalErrors(),
        recoveryActions: this._getRecoveryActions(),
        errorTrends: this._getErrorTrends(),
        preventiveActions: this._getPreventiveActions(),
      };
    }
    // ✅ PHASE 5: Component Status Analysis
    _generateComponentStatus() {
      const components = {
        sidebarConsciousness: this._analyzeComponent(
          "sidebarConsciousnessSystem"
        ),
        colorHarmony: this._analyzeComponent("colorHarmonyEngine"),
        musicAnalysis: this._analyzeComponent("musicAnalysisService"),
        beatSync: this._analyzeComponent("beatSyncVisualSystem"),
        particles: this._analyzeComponent("lightweightParticleSystem"),
        glassmorphism: this._analyzeComponent("glassmorphismManager"),
        card3D: this._analyzeComponent("card3DManager"),
        dataGlyphs: this._analyzeComponent("dataGlyphSystem"),
        behavioralPrediction: this._analyzeComponent(
          "behavioralPredictionEngine"
        ),
        dimensionalNexus: this._analyzeComponent("dimensionalNexusSystem"),
      };
      const activeComponents = Object.values(components).filter(
        (c) => c.status !== "not_available"
      ).length;
      const healthyComponents = Object.values(components).filter(
        (c) => c.status === "healthy"
      ).length;
      return {
        components,
        summary: {
          total: Object.keys(components).length,
          active: activeComponents,
          healthy: healthyComponents,
          healthRate:
            Math.round((healthyComponents / activeComponents) * 100) || 0,
        },
      };
    }
    // ✅ PHASE 5: Music Analysis Integration Report
    _generateMusicAnalysisReport() {
      if (!this.musicAnalysisService) {
        return { available: false, reason: "Service not initialized" };
      }
      return {
        available: true,
        currentTrack: this.musicAnalysisService.getCurrentTrack?.() || null,
        analysisMetrics: this.musicAnalysisService.getMetrics?.() || {},
        colorExtraction:
          this.musicAnalysisService.getColorExtractionStatus?.() || {},
        performance: this.musicAnalysisService.getPerformanceMetrics?.() || {},
        subscribers: this.musicAnalysisService.getSubscriberCount?.() || 0,
      };
    }
    // ✅ PHASE 5: Settings Validation
    _validateCurrentSettings() {
      if (!this.settingsManager) {
        return { valid: false, reason: "Settings manager not available" };
      }
      try {
        const validation = this.settingsManager.validateAllSettings?.() || {
          valid: true,
          issues: [],
        };
        return {
          ...validation,
          timestamp: /* @__PURE__ */ new Date().toISOString(),
        };
      } catch (error) {
        return {
          valid: false,
          error: error.message,
          timestamp: /* @__PURE__ */ new Date().toISOString(),
        };
      }
    }
    // ✅ PHASE 5: Telemetry Data Collection
    _generateTelemetryData() {
      return {
        uptime: Date.now() - (this._systemStartTime || Date.now()),
        interactions: this._getInteractionMetrics(),
        features: this._getFeatureUsageMetrics(),
        errors: this._getErrorStatistics(),
        performance: this._getPerformanceStatistics(),
        compatibility: this._getCompatibilityMetrics(),
      };
    }
    // ✅ PHASE 5: Compatibility Assessment
    _generateCompatibilityReport() {
      return {
        spicetifyVersion: Spicetify?.version || "unknown",
        spotifyVersion: Spicetify?.Platform?.version || "unknown",
        browserVersion: navigator?.userAgent || "unknown",
        features: this._checkFeatureCompatibility(),
        apis: this._checkAPICompatibility(),
        deprecations: this._checkDeprecatedFeatures(),
        recommendations: this._getCompatibilityRecommendations(),
      };
    }
    // ✅ PHASE 5: System Recommendations Engine
    _generateSystemRecommendations() {
      const recommendations = [];
      const perfMetrics = this._generatePerformanceMetrics();
      if (perfMetrics.overallScore < 80) {
        recommendations.push({
          type: "performance",
          priority: "high",
          title: "Performance Optimization Needed",
          description: "System performance is below optimal levels",
          actions: this._getPerformanceOptimizationActions(perfMetrics),
        });
      }
      const healthMetrics = this._generateHealthMetrics();
      if (healthMetrics.overallScore < 90) {
        recommendations.push({
          type: "health",
          priority: "medium",
          title: "System Health Improvement",
          description: "Some system components could be optimized",
          actions: this._getHealthImprovementActions(healthMetrics),
        });
      }
      const errorAnalysis = this._generateErrorAnalysis();
      if (errorAnalysis.criticalErrors.length > 0) {
        recommendations.push({
          type: "stability",
          priority: "high",
          title: "Critical Error Resolution",
          description: "Critical errors detected that need attention",
          actions: errorAnalysis.preventiveActions,
        });
      }
      const featureRecommendations = this._getFeatureRecommendations();
      recommendations.push(...featureRecommendations);
      return recommendations;
    }
    // ✅ PHASE 5: Helper Methods for Health Analysis
    _checkVisualSystemsHealth() {
      const systems = [
        "sidebarConsciousnessSystem",
        "beatSyncVisualSystem",
        "lightweightParticleSystem",
        "dataGlyphSystem",
        "dimensionalNexusSystem",
      ];
      let healthyCount = 0;
      let totalCount = 0;
      systems.forEach((systemName) => {
        if (this[systemName]) {
          totalCount++;
          if (
            this[systemName].isHealthy?.() ||
            this[systemName].initialized !== false
          ) {
            healthyCount++;
          }
        }
      });
      return totalCount > 0
        ? Math.round((healthyCount / totalCount) * 100)
        : 100;
    }
    _identifyHealthIssues(systemChecks) {
      const issues = [];
      Object.entries(systemChecks).forEach(([system, score]) => {
        if (score < 70) {
          issues.push({
            system,
            score,
            severity: score < 50 ? "critical" : "warning",
            description: `${system} health score is ${score}%`,
          });
        }
      });
      return issues;
    }
    _getHealthTrends() {
      return {
        trend: "stable",
        change: 0,
        period: "24h",
      };
    }
    _analyzeComponent(componentName) {
      const component = this[componentName];
      if (!component) {
        return {
          name: componentName,
          status: "not_available",
          health: 0,
          lastUpdate: null,
          issues: ["Component not initialized"],
        };
      }
      const isHealthy = component.isHealthy?.() || {
        healthy: component.initialized !== false,
      };
      const status = isHealthy.healthy ? "healthy" : "degraded";
      return {
        name: componentName,
        status,
        health: isHealthy.score || (isHealthy.healthy ? 100 : 50),
        lastUpdate: component.lastUpdate || Date.now(),
        issues: isHealthy.issues || [],
        features: component.getFeatureStatus?.() || {},
      };
    }
    // ✅ PHASE 5: Placeholder implementations for advanced metrics
    // These would be fully implemented based on specific monitoring needs
    _getTotalSystemCount() {
      return 16;
    }
    _calculateCurrentSuccessRate() {
      const results = this.initializationResults;
      if (!results) return 100;
      const total =
        results.success?.length +
        results.failed?.length +
        results.skipped?.length;
      return total > 0
        ? Math.round((results.success?.length / total) * 100)
        : 100;
    }
    _getAverageInitTime() {
      return this._lastInitializationTime || 20;
    }
    _getInitTimeTrend() {
      return "stable";
    }
    _estimateMemoryUsage() {
      return { current: "~15MB", trend: "stable" };
    }
    _detectMemoryLeaks() {
      return { detected: false, details: [] };
    }
    _getMemoryOptimizations() {
      return [];
    }
    _estimateFrameRate() {
      return 60;
    }
    _checkGPUUtilization() {
      return { available: true, utilization: "moderate" };
    }
    _getRenderingOptimizations() {
      return [];
    }
    _measureUILatency() {
      return { average: "< 16ms", p95: "< 32ms" };
    }
    _getColorExtractionMetrics() {
      return { averageTime: "< 100ms" };
    }
    _getSettingsResponseMetrics() {
      return { averageTime: "< 50ms" };
    }
    _scoreInitialization(metrics) {
      return 90;
    }
    _scoreMemory(metrics) {
      return 85;
    }
    _scoreRendering(metrics) {
      return 90;
    }
    _scoreResponsiveness(metrics) {
      return 88;
    }
    _getRecentErrors() {
      return [];
    }
    _analyzeErrorPatterns() {
      return [];
    }
    _getCriticalErrors() {
      return [];
    }
    _getRecoveryActions() {
      return [];
    }
    _getErrorTrends() {
      return { trend: "stable", count: 0 };
    }
    _getPreventiveActions() {
      return [];
    }
    _getInteractionMetrics() {
      return {};
    }
    _getFeatureUsageMetrics() {
      return {};
    }
    _getErrorStatistics() {
      return { total: 0, resolved: 0 };
    }
    _getPerformanceStatistics() {
      return {};
    }
    _getCompatibilityMetrics() {
      return {};
    }
    _checkFeatureCompatibility() {
      return { supported: true, details: [] };
    }
    _checkAPICompatibility() {
      return { compatible: true, details: [] };
    }
    _checkDeprecatedFeatures() {
      return [];
    }
    _getCompatibilityRecommendations() {
      return [];
    }
    _getPerformanceOptimizationActions(metrics) {
      return [];
    }
    _getHealthImprovementActions(metrics) {
      return [];
    }
    _getFeatureRecommendations() {
      return [];
    }
    resetToDefaults() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("\u{1F504} [Year3000System] resetToDefaults() called.");
      }
      if (
        this.settingsManager &&
        typeof this.settingsManager.resetAllToDefaults === "function"
      ) {
        this.settingsManager.resetAllToDefaults();
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F504} [Year3000System] All settings have been reset to defaults by SettingsManager."
          );
        }
      } else {
        console.warn(
          "\u{1F504} [Year3000System] settingsManager.resetAllToDefaults() not available."
        );
      }
      const defaultColors = this.YEAR3000_CONFIG.catppuccinDefaults || {};
      this.applyColorsToTheme(defaultColors);
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F504} [Year3000System] Default Catppuccin colors applied."
        );
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F504} [Year3000System] TODO: Implement reset logic for individual visual systems if needed."
        );
      }
    }
    // ✅ PHASE 5: Proactive Health Monitoring System
    startProactiveHealthMonitoring() {
      if (this._healthMonitorInterval) {
        return;
      }
      const monitoringConfig = {
        interval: 3e5,
        // 5 minutes
        criticalInterval: 6e4,
        // 1 minute for critical issues
        maxConsecutiveFailures: 3,
        autoRecoveryEnabled: true,
      };
      this._healthMonitoringData = {
        consecutiveFailures: 0,
        lastHealthScore: 100,
        healthHistory: [],
        recoveryAttempts: 0,
        maxRecoveryAttempts: 5,
      };
      this._healthMonitorInterval = setInterval(async () => {
        try {
          await this._performBackgroundHealthCheck();
        } catch (error) {
          console.error(
            "\u274C [Year3000System] Background health check failed:",
            error
          );
        }
      }, monitoringConfig.interval);
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F504} [Year3000System] Proactive health monitoring started"
        );
      }
    }
    stopProactiveHealthMonitoring() {
      if (this._healthMonitorInterval) {
        clearInterval(this._healthMonitorInterval);
        this._healthMonitorInterval = null;
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F504} [Year3000System] Proactive health monitoring stopped"
          );
        }
      }
    }
    async _performBackgroundHealthCheck() {
      const healthMetrics = this._generateHealthMetrics();
      const currentScore = healthMetrics.overallScore;
      this._healthMonitoringData.healthHistory.push({
        timestamp: Date.now(),
        score: currentScore,
        level: healthMetrics.healthLevel,
      });
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1e3;
      this._healthMonitoringData.healthHistory =
        this._healthMonitoringData.healthHistory.filter(
          (entry) => entry.timestamp > twentyFourHoursAgo
        );
      const scoreDrop =
        this._healthMonitoringData.lastHealthScore - currentScore;
      if (scoreDrop > 10) {
        console.warn(
          "\u26A0\uFE0F [Year3000System] Health degradation detected:",
          {
            previous: this._healthMonitoringData.lastHealthScore,
            current: currentScore,
            drop: scoreDrop,
          }
        );
      }
      if (currentScore < 70) {
        this._healthMonitoringData.consecutiveFailures++;
        if (this._healthMonitoringData.consecutiveFailures >= 3) {
          await this._handleCriticalHealthIssue(healthMetrics);
        }
      } else {
        this._healthMonitoringData.consecutiveFailures = 0;
      }
      this._healthMonitoringData.lastHealthScore = currentScore;
      if (this.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
        console.log("\u{1F49A} [Year3000System] Health check completed:", {
          score: currentScore,
          level: healthMetrics.healthLevel,
          trend: this._calculateHealthTrend(),
        });
      }
    }
    async _handleCriticalHealthIssue(healthMetrics) {
      if (
        this._healthMonitoringData.recoveryAttempts >=
        this._healthMonitoringData.maxRecoveryAttempts
      ) {
        console.error(
          "\u{1F6A8} [Year3000System] Maximum recovery attempts reached - entering safe mode"
        );
        await this._enterSafeMode();
        return;
      }
      this._healthMonitoringData.recoveryAttempts++;
      console.warn(
        "\u{1F527} [Year3000System] Attempting automatic recovery:",
        {
          attempt: this._healthMonitoringData.recoveryAttempts,
          issues: healthMetrics.issues,
        }
      );
      for (const issue of healthMetrics.issues) {
        if (issue.severity === "critical") {
          await this._attemptSystemRecovery(issue.system);
        }
      }
      setTimeout(() => {
        const newHealth = this._generateHealthMetrics();
        if (newHealth.overallScore > 80) {
          console.log("\u2705 [Year3000System] Recovery successful:", {
            newScore: newHealth.overallScore,
            attempt: this._healthMonitoringData.recoveryAttempts,
          });
          this._healthMonitoringData.recoveryAttempts = 0;
        }
      }, 5e3);
    }
    async _attemptSystemRecovery(systemName) {
      const recoveryStrategies = {
        sidebarConsciousnessSystem: async () => {
          if (this.sidebarConsciousnessSystem) {
            await this.sidebarConsciousnessSystem.destroy();
            await this._initializeSidebarConsciousnessSystem();
          }
        },
        colorHarmonyEngine: async () => {
          if (this.colorHarmonyEngine) {
            this.colorHarmonyEngine = null;
            await this._initializeColorHarmonyEngine();
          }
        },
        musicAnalysisService: async () => {
          if (this.musicAnalysisService) {
            this.setupMusicAnalysisAndColorExtraction();
          }
        },
        default: async () => {
          console.warn(
            `\u26A0\uFE0F [Year3000System] No recovery strategy for ${systemName}`
          );
        },
      };
      const strategy =
        recoveryStrategies[systemName] || recoveryStrategies.default;
      try {
        await strategy();
        console.log(
          `\u{1F527} [Year3000System] Recovery attempted for ${systemName}`
        );
      } catch (error) {
        console.error(
          `\u274C [Year3000System] Recovery failed for ${systemName}:`,
          error
        );
      }
    }
    async _enterSafeMode() {
      console.warn(
        "\u{1F6E1}\uFE0F [Year3000System] Entering safe mode - disabling non-critical systems"
      );
      const safeConfig = {
        artisticMode: "corporate-safe",
        enableCosmicSync: false,
        musicModulationIntensity: 0.1,
      };
      Object.assign(this.YEAR3000_CONFIG, safeConfig);
      const nonCriticalSystems = [
        "lightweightParticleSystem",
        "beatSyncVisualSystem",
        "dataGlyphSystem",
        "dimensionalNexusSystem",
        "aestheticGravitySystem",
      ];
      for (const systemName of nonCriticalSystems) {
        if (
          this[systemName] &&
          typeof this[systemName].destroy === "function"
        ) {
          try {
            await this[systemName].destroy();
            this[systemName] = null;
            console.log(
              `\u{1F6E1}\uFE0F [Year3000System] Disabled ${systemName} for safe mode`
            );
          } catch (error) {
            console.error(
              `\u274C [Year3000System] Error disabling ${systemName}:`,
              error
            );
          }
        }
      }
      this._inSafeMode = true;
      const root = document.documentElement;
      root.style.setProperty("--sn-safe-mode", "1");
      root.classList.add("year3000-safe-mode");
      console.warn(
        "\u{1F6E1}\uFE0F [Year3000System] Safe mode activated - basic functionality maintained"
      );
    }
    exitSafeMode() {
      if (!this._inSafeMode) return;
      console.log(
        "\u{1F31F} [Year3000System] Exiting safe mode - reinitializing systems"
      );
      this._inSafeMode = false;
      const root = document.documentElement;
      root.style.removeProperty("--sn-safe-mode");
      root.classList.remove("year3000-safe-mode");
      this._healthMonitoringData.recoveryAttempts = 0;
      this._healthMonitoringData.consecutiveFailures = 0;
      this.initializeAllSystems()
        .then(() => {
          console.log("\u2705 [Year3000System] Safe mode exit completed");
        })
        .catch((error) => {
          console.error(
            "\u274C [Year3000System] Error exiting safe mode:",
            error
          );
        });
    }
    _calculateHealthTrend() {
      const history = this._healthMonitoringData.healthHistory;
      if (history.length < 2) return "insufficient_data";
      const recent = history.slice(-5);
      const trend = recent[recent.length - 1].score - recent[0].score;
      if (trend > 5) return "improving";
      if (trend < -5) return "declining";
      return "stable";
    }
    // ✅ PHASE 5: Enhanced Debug Interface
    getAdvancedDiagnostics() {
      return {
        systemReport: this.getSystemReport(),
        healthMonitoring: {
          active: !!this._healthMonitorInterval,
          data: this._healthMonitoringData,
          trend: this._calculateHealthTrend(),
          safeMode: this._inSafeMode || false,
        },
        performanceProfile: {
          initialization: this.initializationResults,
          memoryEstimate: this._estimateMemoryUsage(),
          renderingMetrics: this._estimateFrameRate(),
        },
        systemIntelligence: {
          predictiveRecommendations: this._generateSystemRecommendations(),
          errorPatterns: this._analyzeErrorPatterns(),
          optimizationOpportunities: this._identifyOptimizationOpportunities(),
        },
      };
    }
    _identifyOptimizationOpportunities() {
      const opportunities = [];
      const memoryUsage = this._estimateMemoryUsage();
      if (
        memoryUsage.current &&
        memoryUsage.current.includes("MB") &&
        parseInt(memoryUsage.current) > 20
      ) {
        opportunities.push({
          type: "memory",
          priority: "medium",
          description:
            "Memory usage is high - consider reducing particle count or disabling intensive effects",
          action: "Reduce performance quality setting",
        });
      }
      const frameRate = this._estimateFrameRate();
      if (frameRate < 45) {
        opportunities.push({
          type: "performance",
          priority: "high",
          description:
            "Frame rate is below target - disable resource-intensive features",
          action: "Switch to corporate-safe mode or disable particle effects",
        });
      }
      const initTime = this._lastInitializationTime || 0;
      if (initTime > 50) {
        opportunities.push({
          type: "startup",
          priority: "low",
          description:
            "Initialization is slow - consider lazy loading some systems",
          action: "Review system initialization order",
        });
      }
      return opportunities;
    }
    // === DELEGATED ANIMATION METHODS ===
    /**
     * Register an animation system - delegates to MasterAnimationCoordinator
     */
    registerAnimationSystem(
      systemName,
      system,
      priority = "normal",
      targetFPS = 60
    ) {
      if (this.masterAnimationCoordinator) {
        return this.masterAnimationCoordinator.registerAnimationSystem(
          systemName,
          system,
          priority,
          targetFPS
        );
      }
      console.warn(
        "[Year3000System] MasterAnimationCoordinator not available for registerAnimationSystem"
      );
    }
    /**
     * Unregister an animation system - delegates to MasterAnimationCoordinator
     */
    unregisterAnimationSystem(systemName) {
      if (this.masterAnimationCoordinator) {
        return this.masterAnimationCoordinator.unregisterAnimationSystem(
          systemName
        );
      }
      console.warn(
        "[Year3000System] MasterAnimationCoordinator not available for unregisterAnimationSystem"
      );
    }
    /**
     * Get animation performance report - delegates to MasterAnimationCoordinator
     */
    getMasterAnimationPerformanceReport() {
      if (this.masterAnimationCoordinator) {
        return this.masterAnimationCoordinator.getPerformanceReport();
      }
      return {
        error: "MasterAnimationCoordinator not available",
        isRunning: false,
        registeredSystems: 0,
      };
    }
    // === DELEGATED TIMER METHODS ===
    /**
     * Register a timer - delegates to TimerConsolidationSystem
     */
    registerConsolidatedTimer(
      timerId,
      callback,
      intervalMs,
      priority = "normal"
    ) {
      if (this.timerConsolidationSystem) {
        return this.timerConsolidationSystem.registerTimer(
          timerId,
          callback,
          intervalMs,
          priority
        );
      }
      console.warn(
        "[Year3000System] TimerConsolidationSystem not available for registerConsolidatedTimer"
      );
    }
    /**
     * Unregister a timer - delegates to TimerConsolidationSystem
     */
    unregisterConsolidatedTimer(timerId) {
      if (this.timerConsolidationSystem) {
        return this.timerConsolidationSystem.unregisterTimer(timerId);
      }
      console.warn(
        "[Year3000System] TimerConsolidationSystem not available for unregisterConsolidatedTimer"
      );
    }
    /**
     * Get timer performance report - delegates to TimerConsolidationSystem
     */
    getTimerConsolidationReport() {
      if (this.timerConsolidationSystem) {
        return this.timerConsolidationSystem.getPerformanceReport();
      }
      return {
        error: "TimerConsolidationSystem not available",
        enabled: false,
        activeTimers: 0,
      };
    }
    /**
     * Generate performance optimization recommendations
     * @returns {Array} Array of recommendation objects
     */
    _generatePerformanceRecommendations() {
      const recommendations = [];
      const avgFrameTime = this._performanceMetrics.averageFrameTime;
      if (avgFrameTime > 16.67) {
        recommendations.push({
          type: "performance",
          priority: "high",
          message: "Frame rate below 60fps - consider reducing visual effects",
          action: "Switch to performance mode or disable background animations",
        });
      }
      if (
        this._performanceMetrics.droppedFrames >
        this._performanceMetrics.frameCount * 0.05
      ) {
        recommendations.push({
          type: "stability",
          priority: "medium",
          message: "High frame drop rate detected",
          action: "Check for expensive operations in animation loops",
        });
      }
      this._performanceMetrics.systemStats.forEach((stats, systemName) => {
        if (stats.maxTime > 10) {
          recommendations.push({
            type: "system",
            priority: "medium",
            message: `System ${systemName} has expensive frames (${stats.maxTime.toFixed(
              2
            )}ms max)`,
            action: "Consider optimizing or reducing update frequency",
          });
        }
      });
      return recommendations;
    }
    /**
     * Execute timer callbacks based on their intervals and priorities
     */
    _executeMasterTimerFrame() {
      const now = performance.now();
      const frameStartTime = now;
      let frameBudget = 10;
      const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
        ([, a], [, b]) => {
          const priorityOrder = { critical: 0, normal: 1, background: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
      );
      for (const [timerId, config] of timersByPriority) {
        if (!config.enabled || frameBudget <= 0) {
          if (frameBudget <= 0 && config.priority === "background") {
            continue;
          }
        }
        const timeSinceLastExecution = now - config.lastExecution;
        if (timeSinceLastExecution < config.intervalMs) {
          continue;
        }
        const callbackStartTime = performance.now();
        try {
          config.callback();
          config.lastExecution = now;
          config.executionCount++;
        } catch (error) {
          config.errorCount++;
          console.warn(
            `[Year3000System] Timer callback failed for ${timerId}:`,
            error
          );
          if (config.errorCount > 3) {
            config.enabled = false;
            setTimeout(() => {
              if (this._timerRegistry.has(timerId)) {
                this._timerRegistry.get(timerId).enabled = true;
              }
            }, 3e4);
          }
        }
        const callbackTime = performance.now() - callbackStartTime;
        config.totalTime += callbackTime;
        config.maxTime = Math.max(config.maxTime, callbackTime);
        frameBudget -= callbackTime;
        if (callbackTime > 5) {
          console.warn(
            `[Year3000System] Timer ${timerId} taking too long: ${callbackTime.toFixed(
              2
            )}ms`
          );
          if (config.priority === "background") {
            config.intervalMs = Math.min(config.intervalMs * 1.5, 5e3);
          }
        }
      }
      const totalFrameTime = performance.now() - frameStartTime;
      if (totalFrameTime > 8) {
        console.warn(
          `[Year3000System] Timer system frame took ${totalFrameTime.toFixed(
            2
          )}ms - consider optimization`
        );
      }
    }
    /**
     * Generate timer optimization recommendations
     * @returns {Array} Array of timer-specific recommendations
     */
    _generateTimerRecommendations() {
      const recommendations = [];
      if (!this._timerRegistry) return recommendations;
      this._timerRegistry.forEach((config, timerId) => {
        if (config.errorCount > 2) {
          recommendations.push({
            type: "timer_errors",
            priority: "medium",
            message: `Timer ${timerId} has ${config.errorCount} errors`,
            action: "Review timer callback for error handling",
          });
        }
        if (config.maxTime > 8) {
          recommendations.push({
            type: "timer_performance",
            priority: "medium",
            message: `Timer ${timerId} has expensive execution (${config.maxTime.toFixed(
              2
            )}ms max)`,
            action: "Optimize timer callback or reduce frequency",
          });
        }
        if (config.intervalMs < 100 && config.priority === "background") {
          recommendations.push({
            type: "timer_frequency",
            priority: "low",
            message: `Background timer ${timerId} has high frequency (${config.intervalMs}ms)`,
            action:
              "Consider reducing update frequency for background operations",
          });
        }
      });
      return recommendations;
    }
    // === DELEGATED CSS VARIABLE METHODS ===
    /**
     * Queue CSS variable update - delegates to CSSVariableBatcher
     */
    queueCSSVariableUpdate(property, value, element = null) {
      if (!this.cssVariableBatcher) {
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.warn(
            `[Year3000System] CSSVariableBatcher not available. Update for ${property} applied directly.`
          );
        }
        const target = element || document.documentElement;
        target.style.setProperty(property, value);
        return;
      }
      this.cssVariableBatcher.queueCSSVariableUpdate(property, value, element);
    }
    /**
     * Flush CSS variable batch - delegates to CSSVariableBatcher
     */
    flushCSSVariableBatch() {
      if (this.cssVariableBatcher) {
        this.cssVariableBatcher.flushCSSVariableBatch();
      }
    }
    /**
     * Get CSS variable batching report - delegates to CSSVariableBatcher
     */
    getCSSVariableBatchingReport() {
      if (this.cssVariableBatcher) {
        return this.cssVariableBatcher.getPerformanceReport();
      }
      return {
        error: "CSSVariableBatcher not available",
        enabled: false,
        totalUpdates: 0,
      };
    }
    // === DELEGATED DEVICE CAPABILITY METHODS ===
    /**
     * Initialize device capabilities - delegates to DeviceCapabilityDetector
     */
    initializeAdvancedCapabilities() {
      if (this.deviceCapabilityDetector) {
        return this.deviceCapabilityDetector.initialize();
      }
      console.warn(
        "[Year3000System] DeviceCapabilityDetector not available for initializeAdvancedCapabilities"
      );
    }
    /**
     * Get device capabilities report - delegates to DeviceCapabilityDetector
     */
    getDeviceCapabilitiesReport() {
      if (this.deviceCapabilityDetector) {
        return this.deviceCapabilityDetector.getCapabilitiesReport();
      }
      return {
        error: "DeviceCapabilityDetector not available",
        overall: "unknown",
      };
    }
    /**
     * Get performance analytics - delegates to PerformanceAnalyzer
     */
    getPerformanceAnalytics() {
      if (this.performanceAnalyzer) {
        return this.performanceAnalyzer.getAnalytics();
      }
      return {
        error: "PerformanceAnalyzer not available",
        overall: "unknown",
      };
    }
    // === REMAINING DELEGATED METHODS ===
    /**
     * Enable GPU acceleration - delegates to DeviceCapabilityDetector
     */
    enableGPUAcceleration(element, type = "standard") {
      if (this.deviceCapabilityDetector) {
        return this.deviceCapabilityDetector.enableGPUAcceleration(
          element,
          type
        );
      }
      if (element && element.style) {
        element.style.transform = "translateZ(0)";
        element.style.willChange = "transform";
      }
    }
    /**
     * Disable GPU acceleration - delegates to DeviceCapabilityDetector
     */
    disableGPUAcceleration(element) {
      if (this.deviceCapabilityDetector) {
        return this.deviceCapabilityDetector.disableGPUAcceleration(element);
      }
      if (element && element.style) {
        element.style.transform = "";
        element.style.willChange = "";
      }
    }
  };

  // src-js/components/SettingsSection.js
  init_globalConfig();
  var RawSectionComponent = () => {
    const settingsManager = globalThis.year3000System?.settingsManager;
    const glassmorphismManager =
      globalThis.year3000System?.glassmorphismManager;
    const card3DManager = globalThis.year3000System?.card3DManager;
    const year3000System = globalThis.year3000System;
    if (
      !settingsManager ||
      !glassmorphismManager ||
      !card3DManager ||
      !year3000System ||
      !YEAR3000_CONFIG ||
      !HARMONIC_MODES
    ) {
      if (YEAR3000_CONFIG?.enableDebug || !settingsManager) {
        console.warn(
          "[StarryNight Section] Essential managers/configs not yet available on globalThis.year3000System. UI will be minimal or delayed."
        );
      }
      return Spicetify.React.createElement("div", null, "Loading settings...");
    }
    const accents =
      settingsManager.validationSchemas?.["catppuccin-accentColor"]
        ?.allowedValues || [];
    const gradientIntensityOptions =
      settingsManager.validationSchemas?.[
        "sn-gradientIntensity"
      ]?.allowedValues.map((val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1),
      })) || [];
    const starDensityOptions =
      settingsManager.validationSchemas?.["sn-starDensity"]?.allowedValues.map(
        (val) => ({
          value: val,
          label: val.charAt(0).toUpperCase() + val.slice(1),
        })
      ) || [];
    const performanceOptions =
      settingsManager.validationSchemas?.[
        "sn-performanceQuality"
      ]?.allowedValues.map((val) => ({
        value: val,
        label:
          val === "auto"
            ? "Auto-Adjust"
            : val === "optimized"
            ? "Optimized Quality"
            : "High Fidelity",
      })) || [];
    const glassmorphismOptions =
      settingsManager.validationSchemas?.[
        "sn-glassmorphismIntensity"
      ]?.allowedValues.map((val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1),
      })) || [];
    const artisticModeOptions =
      settingsManager.validationSchemas?.["sn-artisticMode"]?.allowedValues.map(
        (val) => ({
          value: val,
          label:
            ARTISTIC_MODE_PROFILES[val]?.displayName ||
            val
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          profile: ARTISTIC_MODE_PROFILES[val],
        })
      ) || [];
    const morphing3DOptions =
      settingsManager.validationSchemas?.[
        "sn-3dMorphingMode"
      ]?.allowedValues.map((val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1),
      })) || [];
    const colorScheme = Spicetify.Config.color_scheme || "mocha";
    const initialAccent =
      settingsManager.get("catppuccin-accentColor") || accents[0];
    const [selectedAccent, setSelectedAccent] =
      Spicetify.React.useState(initialAccent);
    const initialGradient =
      settingsManager.get("sn-gradientIntensity") ||
      gradientIntensityOptions[0]?.value;
    const initialStars =
      settingsManager.get("sn-starDensity") || starDensityOptions[0]?.value;
    const initialPerformance =
      settingsManager.get("sn-performanceQuality") ||
      performanceOptions[0]?.value;
    const [gradientIntensity, setGradientIntensity] =
      Spicetify.React.useState(initialGradient);
    const [starDensity, setStarDensity] =
      Spicetify.React.useState(initialStars);
    const [performanceQuality, setPerformanceQuality] =
      Spicetify.React.useState(initialPerformance);
    const initialGlass =
      settingsManager.get("sn-glassmorphismIntensity") ||
      glassmorphismOptions[0]?.value;
    const [glassmorphismIntensity, setGlassmorphismIntensity] =
      Spicetify.React.useState(initialGlass);
    const initial3DMode =
      settingsManager.get("sn-3dMorphingMode") || morphing3DOptions[0]?.value;
    const [morphing3DMode, setMorphing3DMode] =
      Spicetify.React.useState(initial3DMode);
    const initialArtisticMode =
      settingsManager.get(
        "sn-artisticMode",
        YEAR3000_CONFIG?.artisticMode || "artist-vision"
      ) || artisticModeOptions[0]?.value;
    const [artisticMode, setArtisticModeState] =
      Spicetify.React.useState(initialArtisticMode);
    const initialHarmonicModeKey = Object.keys(HARMONIC_MODES)[0];
    const initialHarmonicMode =
      settingsManager.get("sn-currentHarmonicMode") || initialHarmonicModeKey;
    const [currentHarmonicMode, setCurrentHarmonicMode] =
      Spicetify.React.useState(initialHarmonicMode);
    const initialHarmonicIntensity = parseFloat(
      settingsManager.get("sn-harmonicIntensity") || "0.5"
    );
    const [harmonicIntensity, setHarmonicIntensity] = Spicetify.React.useState(
      initialHarmonicIntensity
    );
    const initialHarmonicEvolution =
      (settingsManager.get("sn-harmonicEvolution") || "true") === "true";
    const [harmonicEvolution, setHarmonicEvolution] = Spicetify.React.useState(
      initialHarmonicEvolution
    );
    const initialManualBaseColor =
      settingsManager.get("sn-harmonicManualBaseColor") || "";
    const [manualBaseColor, setManualBaseColor] = Spicetify.React.useState(
      initialManualBaseColor
    );
    Spicetify.React.useEffect(() => {
      if (!settingsManager) return;
      try {
        const accent = selectedAccent === "none" ? "text" : selectedAccent;
        const properties = {
          "--spice-text": `var(--spice-${selectedAccent})`,
          "--spice-button-active": `var(--spice-${selectedAccent})`,
          "--spice-equalizer": document.querySelector(
            "body > script.marketplaceScript"
          )
            ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')`
            : `url('${colorScheme}/equalizer-animated-${accent}.gif')`,
        };
        Object.entries(properties).forEach(([property, value]) => {
          if (value.includes("none")) {
            document.documentElement.style.removeProperty(property);
          } else {
            document.documentElement.style.setProperty(property, value);
          }
        });
        settingsManager.set("catppuccin-accentColor", selectedAccent);
      } catch (error) {
        console.error("StarryNight: Error applying accent color:", error);
      }
    }, [selectedAccent, colorScheme, settingsManager]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager) return;
      try {
        applyStarryNightSettings(gradientIntensity, starDensity);
        settingsManager.set("sn-gradientIntensity", gradientIntensity);
        settingsManager.set("sn-starDensity", starDensity);
      } catch (error) {
        console.error(
          "StarryNight: Error applying StarryNight settings:",
          error
        );
      }
    }, [gradientIntensity, starDensity, settingsManager]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager) return;
      try {
        settingsManager.set("sn-performanceQuality", performanceQuality);
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            `StarryNight: Performance quality set to ${performanceQuality}. (Note: old colorAnalyzer throttle logic removed)`
          );
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying performance settings:",
          error
        );
      }
    }, [performanceQuality, settingsManager, YEAR3000_CONFIG]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager || !YEAR3000_CONFIG || !year3000System) return;
      try {
        if (year3000System.switchArtisticMode) {
          year3000System.switchArtisticMode(artisticMode);
        } else {
          if (typeof YEAR3000_CONFIG.setArtisticMode === "function") {
            YEAR3000_CONFIG.setArtisticMode(artisticMode);
          }
          settingsManager.set("sn-artisticMode", artisticMode);
          if (year3000System.setGradientParameters) {
            year3000System.setGradientParameters(document.documentElement);
          }
        }
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            `\u{1F3A8} [SettingsSection] Artistic mode changed to: ${artisticMode}`
          );
        }
      } catch (error) {
        console.error(
          "\u274C [SettingsSection] Error applying artistic mode:",
          error
        );
      }
    }, [artisticMode, settingsManager, YEAR3000_CONFIG, year3000System]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager || !YEAR3000_CONFIG) return;
      try {
        settingsManager.set("sn-currentHarmonicMode", currentHarmonicMode);
        settingsManager.set(
          "sn-harmonicIntensity",
          harmonicIntensity.toString()
        );
        settingsManager.set(
          "sn-harmonicEvolution",
          harmonicEvolution.toString()
        );
        if (
          globalThis.year3000System &&
          typeof globalThis.year3000System.updateConfiguration === "function"
        ) {
          globalThis.year3000System.updateConfiguration(
            "currentHarmonicMode",
            currentHarmonicMode
          );
          globalThis.year3000System.updateConfiguration(
            "harmonicIntensity",
            harmonicIntensity
          );
          globalThis.year3000System.updateConfiguration(
            "harmonicEvolution",
            harmonicEvolution
          );
        } else {
          console.warn(
            "[SettingsSection] Year3000System not available for safe configuration updates"
          );
          YEAR3000_CONFIG.currentHarmonicMode = currentHarmonicMode;
          YEAR3000_CONFIG.harmonicIntensity = harmonicIntensity;
          YEAR3000_CONFIG.harmonicEvolution = harmonicEvolution;
        }
        if (year3000System && year3000System.updateColorsFromCurrentTrack) {
          year3000System.updateColorsFromCurrentTrack();
        }
        if (
          year3000System &&
          year3000System.sidebarConsciousnessSystem &&
          year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay
        ) {
          year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay(
            currentHarmonicMode
          );
          if (YEAR3000_CONFIG?.enableDebug) {
            console.log(
              `[StarryNight Section UI] SidebarConsciousnessSystem updated with mode: ${currentHarmonicMode}`
            );
          }
        }
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            `StarryNight: Harmonic settings updated - Mode: ${currentHarmonicMode}, Intensity: ${harmonicIntensity}, Evolution: ${harmonicEvolution}`
          );
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying Harmonic System settings from UI:",
          error
        );
      }
    }, [
      currentHarmonicMode,
      harmonicIntensity,
      harmonicEvolution,
      settingsManager,
      YEAR3000_CONFIG,
      year3000System,
    ]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager || !YEAR3000_CONFIG) return;
      try {
        const hexRegex = /^(#?([0-9a-fA-F]{3}){1,2})$/i;
        let validatedColor = manualBaseColor.trim();
        let isValid = false;
        if (validatedColor === "") {
          isValid = true;
        } else if (hexRegex.test(validatedColor)) {
          isValid = true;
          if (!validatedColor.startsWith("#")) {
            validatedColor = "#" + validatedColor;
          }
          if (validatedColor.length === 4) {
            validatedColor = `#${validatedColor[1]}${validatedColor[1]}${validatedColor[2]}${validatedColor[2]}${validatedColor[3]}${validatedColor[3]}`;
          }
        }
        if (isValid) {
          settingsManager.set("sn-harmonicManualBaseColor", validatedColor);
          if (year3000System && year3000System.updateHarmonicBaseColor) {
            year3000System.updateHarmonicBaseColor(validatedColor);
          }
          if (
            YEAR3000_CONFIG.enableDebug ||
            manualBaseColor !== validatedColor
          ) {
            console.log(
              `StarryNight: Manual Harmonic Base Color processing. Input: "${manualBaseColor}", Applied: "${validatedColor}"`
            );
          }
        } else {
          if (YEAR3000_CONFIG.enableDebug) {
            console.warn(
              `StarryNight: Invalid manual base color input: "${manualBaseColor}". Not applied. Previous valid setting remains.`
            );
          }
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying Manual Harmonic Base Color from UI:",
          error
        );
      }
    }, [manualBaseColor, settingsManager, YEAR3000_CONFIG, year3000System]);
    Spicetify.React.useEffect(() => {
      if (
        !settingsManager ||
        !glassmorphismManager ||
        !card3DManager ||
        !YEAR3000_CONFIG
      )
        return;
      try {
        glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);
        settingsManager.set(
          "sn-glassmorphismIntensity",
          glassmorphismIntensity
        );
        card3DManager.initialize();
        card3DManager.apply3DMode(morphing3DMode);
        glassmorphismManager.checkPerformanceAndAdjust();
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            `StarryNight: Glassmorphism intensity set to ${glassmorphismIntensity}`
          );
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying glassmorphism settings:",
          error
        );
      }
    }, [
      glassmorphismIntensity,
      morphing3DMode,
      settingsManager,
      glassmorphismManager,
      card3DManager,
      YEAR3000_CONFIG,
    ]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager || !card3DManager || !YEAR3000_CONFIG) return;
      try {
        card3DManager.apply3DMode(morphing3DMode);
        settingsManager.set("sn-3dMorphingMode", morphing3DMode);
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(`StarryNight: 3D morphing mode set to ${morphing3DMode}`);
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying 3D morphing settings:",
          error
        );
      }
    }, [morphing3DMode, settingsManager, card3DManager, YEAR3000_CONFIG]);
    Spicetify.React.useEffect(() => {
      if (!settingsManager || !glassmorphismManager || !YEAR3000_CONFIG) return;
      let shootingStarsIntervalId = null;
      try {
        applyStarryNightSettings(gradientIntensity, starDensity);
        glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);
        if (settingsManager.get("sn-starDensity") !== "disabled") {
          setTimeout(() => {
            shootingStarsIntervalId = startShootingStars();
          }, 2e3);
        }
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            "StarryNight: Section component effects initialized (color extraction delegated to global Year 3000 system)"
          );
        }
      } catch (error) {
        console.error(
          "StarryNight: Error during Section component initialization:",
          error
        );
      }
      return () => {
        try {
          if (shootingStarsIntervalId) {
            clearInterval(shootingStarsIntervalId);
          }
          if (YEAR3000_CONFIG?.enableDebug) {
            console.log("StarryNight: Section component cleanup completed");
          }
        } catch (error) {
          console.warn(
            "StarryNight: Error during Section component cleanup:",
            error
          );
        }
      };
    }, [
      gradientIntensity,
      starDensity,
      glassmorphismIntensity,
      settingsManager,
      glassmorphismManager,
      YEAR3000_CONFIG,
    ]);
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "[StarryNight SettingsSection] Component rendering (placeholder)"
      );
    }
    return Spicetify.React.createElement(
      "div",
      { className: "x-settings-section" },
      [
        Spicetify.React.createElement(
          "h2",
          {
            "data-encore-id": "type",
            className:
              "TextElement-bodyMediumBold-textBase-text encore-text-body-medium-bold",
          },
          "Catppuccin StarryNight"
        ),
        // Accent Color Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Accent Color"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: selectedAccent,
                    onChange: (event) => setSelectedAccent(event.target.value),
                  },
                  accents.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option, value: option },
                      option
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // Gradient Intensity Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Dynamic Gradient"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: gradientIntensity,
                    onChange: (event) =>
                      setGradientIntensity(event.target.value),
                  },
                  gradientIntensityOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // Star Density Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Star Animation"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: starDensity,
                    onChange: (event) => setStarDensity(event.target.value),
                  },
                  starDensityOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // Performance Quality Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Performance Quality"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: performanceQuality,
                    onChange: (event) =>
                      setPerformanceQuality(event.target.value),
                  },
                  performanceOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // PHASE 1: Glassmorphism Intensity Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Glass Effects"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: glassmorphismIntensity,
                    onChange: (event) =>
                      setGlassmorphismIntensity(event.target.value),
                  },
                  glassmorphismOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // ADDED: Artistic Mode Setting (before 3D Morphing Mode) - Enhanced with Year 3000 descriptions
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Artistic Mode"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: artisticMode,
                    onChange: (event) =>
                      setArtisticModeState(event.target.value),
                  },
                  artisticModeOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // NEW: Artistic Mode Description - Year 3000 Philosophy Display
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            {
              className: "x-settings-description",
              style: {
                padding: "8px 12px",
                marginTop: "-8px",
                marginBottom: "8px",
                backgroundColor:
                  "rgba(var(--spice-rgb-accent, 202,158,230), 0.06)",
                borderRadius: "6px",
                borderLeft: "3px solid var(--spice-accent, #ca9ee6)",
                fontSize: "0.8em",
                lineHeight: "1.4",
                gridColumn: "1 / -1",
              },
            },
            [
              // Current mode description
              Spicetify.React.createElement(
                "div",
                {
                  style: {
                    fontWeight: "500",
                    color: "var(--spice-text)",
                    marginBottom: "4px",
                  },
                },
                ARTISTIC_MODE_PROFILES[artisticMode]?.description ||
                  "Standard artistic expression mode"
              ),
              // Current mode philosophy
              Spicetify.React.createElement(
                "div",
                {
                  style: {
                    fontStyle: "italic",
                    color: "var(--spice-subtext)",
                    fontSize: "0.9em",
                  },
                },
                ARTISTIC_MODE_PROFILES[artisticMode]?.philosophy ||
                  "Enhances your listening experience with visual harmony."
              ),
            ]
          ),
        ]),
        // PHASE 3: 3D morphing mode setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "3D Morphing Mode"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: morphing3DMode,
                    onChange: (event) => setMorphing3DMode(event.target.value),
                  },
                  morphing3DOptions.map((option) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: option.value, value: option.value },
                      option.label
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // NEW: Chromatic Harmony Weaver Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                },
                "Chromatic Harmony Mode"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("span", null, [
                Spicetify.React.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    value: currentHarmonicMode,
                    onChange: (event) =>
                      setCurrentHarmonicMode(event.target.value),
                  },
                  Object.keys(HARMONIC_MODES).map((modeKey) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: modeKey, value: modeKey },
                      HARMONIC_MODES[modeKey].description
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),
        // NEW: Harmonic Intensity Setting
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                  htmlFor: "sn-harmonic-intensity-slider",
                },
                `Harmonic Intensity: ${harmonicIntensity.toFixed(2)}`
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("input", {
                type: "range",
                id: "sn-harmonic-intensity-slider",
                className: "x-settings-slider sn-slider",
                min: "0",
                max: "1",
                step: "0.05",
                value: harmonicIntensity,
                onChange: (event) =>
                  setHarmonicIntensity(parseFloat(event.target.value)),
              }),
            ]
          ),
        ]),
        // NEW: Harmonic Evolution Toggle
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                  htmlFor: "sn-harmonic-evolution-toggle",
                },
                "Evolve Harmonies with Music"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("input", {
                type: "checkbox",
                id: "sn-harmonic-evolution-toggle",
                className: "x-settings-checkbox sn-toggle",
                checked: harmonicEvolution,
                onChange: (event) => setHarmonicEvolution(event.target.checked),
              }),
            ]
          ),
        ]),
        // NEW: Manual Harmonic Base Color Input
        Spicetify.React.createElement("div", { className: "x-settings-row" }, [
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-firstColumn" },
            [
              Spicetify.React.createElement(
                "label",
                {
                  className:
                    "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                  "data-encore-id": "type",
                  htmlFor: "sn-manual-base-color-input",
                },
                "Harmonic Base Color Seed (Hex, empty for auto)"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("input", {
                type: "text",
                id: "sn-manual-base-color-input",
                className: "x-settings-input sn-text-input",
                placeholder: "#RRGGBB or RRGGBB",
                value: manualBaseColor,
                onChange: (event) => setManualBaseColor(event.target.value),
              }),
            ]
          ),
        ]),
      ]
    );
  };
  var checkHeaderInterval = null;
  var mountedContainer = null;
  function cleanupSettings() {
    if (checkHeaderInterval) {
      clearInterval(checkHeaderInterval);
      checkHeaderInterval = null;
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "[StarryNight Settings] Cleared settings polling interval."
        );
      }
    }
    if (mountedContainer) {
      try {
        Spicetify.ReactDOM.unmountComponentAtNode(mountedContainer);
        mountedContainer.remove();
        mountedContainer = null;
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            "[StarryNight Settings] Unmounted React component and removed container."
          );
        }
      } catch (error) {
        console.warn("[StarryNight Settings] Error during cleanup:", error);
      }
    }
  }
  function insertOption(name) {
    if (name?.pathname !== "/preferences") {
      cleanupSettings();
      return;
    }
    const containerId = "spicetify-starry-night-settings-container";
    let container = document.getElementById(containerId);
    if (container) {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "[StarryNight Settings] Settings container already exists. Aborting re-render."
        );
      }
      return;
    }
    if (checkHeaderInterval) {
      clearInterval(checkHeaderInterval);
    }
    checkHeaderInterval = setInterval(() => {
      const settingsPage = document.querySelector(
        "[data-testid='settings-page'] > div:first-of-type, .x-settings-headerContainer"
      );
      if (settingsPage) {
        clearInterval(checkHeaderInterval);
        checkHeaderInterval = null;
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            "[StarryNight Settings] Settings page found, mounting component."
          );
        }
        container = document.createElement("div");
        container.id = containerId;
        container.classList.add("starry-night-settings-section");
        mountedContainer = container;
        settingsPage.parentNode.insertBefore(
          container,
          settingsPage.nextSibling
        );
        try {
          Spicetify.ReactDOM.render(
            Spicetify.React.createElement(RawSectionComponent),
            container
          );
          if (YEAR3000_CONFIG?.enableDebug) {
            console.log(
              "[StarryNight Settings] Successfully rendered settings UI."
            );
          }
        } catch (error) {
          console.error(
            "[StarryNight Settings] Failed to render React component:",
            error
          );
          container.textContent = "Error loading StarryNight settings.";
        }
      }
    }, 1);
  }

  // src-js/debug/SystemIntegrationTester.js
  init_globalConfig();
  init_Year3000Utilities();
  var SystemIntegrationTester = class {
    constructor() {
      this.testResults = {};
      this.performanceMetrics = {};
      this.systemStatus = {};
      this.domObserver = null;
      this.testInProgress = false;
    }
    // ===================================================================
    // 🎨 QUICK DEBUG UTILITIES (from Year3000Debug)
    // ===================================================================
    testGradients() {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F9EA} [StarryNight Debug] Testing gradient application..."
        );
      }
      if (globalThis.year3000System?.updateColorsFromCurrentTrack) {
        globalThis.year3000System.updateColorsFromCurrentTrack();
      } else {
        console.warn(
          "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
        );
      }
      const root = Year3000Utilities.getRootStyle();
      if (!root) {
        console.warn(
          "[StarryNight Debug] Root element not found for testGradients."
        );
        return { gradientVars: {}, rgbValidation: {} };
      }
      const gradientVars = {
        primary: root.getPropertyValue("--sn-gradient-primary").trim(),
        secondary: root.getPropertyValue("--sn-gradient-secondary").trim(),
        accent: root.getPropertyValue("--sn-gradient-accent").trim(),
        primaryRgb: root.getPropertyValue("--sn-gradient-primary-rgb").trim(),
        secondaryRgb: root
          .getPropertyValue("--sn-gradient-secondary-rgb")
          .trim(),
        accentRgb: root.getPropertyValue("--sn-gradient-accent-rgb").trim(),
        opacity: root.getPropertyValue("--sn-gradient-opacity").trim(),
        blur: root.getPropertyValue("--sn-gradient-blur").trim(),
      };
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F3A8} [StarryNight Debug] Current gradient variables:",
          gradientVars
        );
      }
      const rgbValidation = {
        primaryRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.primaryRgb),
        secondaryRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.secondaryRgb),
        accentRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.accentRgb),
      };
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u2705 [StarryNight Debug] RGB Format Validation:",
          rgbValidation
        );
      }
      return { gradientVars, rgbValidation };
    }
    logCurrentVariables() {
      const rootStyle = Year3000Utilities.getRootStyle();
      if (!rootStyle) {
        console.warn(
          "[StarryNight Debug] Root element style not found for logCurrentVariables."
        );
        return { hexVars: {}, rgbVars: {}, allVariables: {} };
      }
      const variables = {};
      const allCssRules = [];
      try {
        for (const styleSheet of document.styleSheets) {
          if (
            styleSheet.href &&
            !styleSheet.href.startsWith(window.location.origin)
          ) {
            if (YEAR3000_CONFIG?.enableDebug) {
            }
            continue;
          }
          try {
            if (styleSheet.cssRules) {
              for (const rule of styleSheet.cssRules) {
                if (rule.style) {
                  allCssRules.push(rule);
                }
              }
            }
          } catch (e) {
            if (YEAR3000_CONFIG?.enableDebug) {
            }
          }
        }
      } catch (e) {
        console.error("[StarryNight Debug] Error iterating stylesheets:", e);
      }
      const rootElement = document.documentElement;
      const computedRootStyle = getComputedStyle(rootElement);
      for (let i = 0; i < computedRootStyle.length; i++) {
        const propName = computedRootStyle[i];
        if (propName.startsWith("--spice-") || propName.startsWith("--sn-")) {
          variables[propName] = computedRootStyle
            .getPropertyValue(propName)
            .trim();
        }
      }
      const hexVars = Object.keys(variables).filter(
        (key) => !key.includes("-rgb")
      );
      const rgbVars = Object.keys(variables).filter((key) =>
        key.includes("-rgb")
      );
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F3A8} [StarryNight Debug] Hex Variables:",
          hexVars.reduce((obj, key) => {
            obj[key] = variables[key];
            return obj;
          }, {})
        );
        console.log(
          "\u{1F9EE} [StarryNight Debug] RGB Variables:",
          rgbVars.reduce((obj, key) => {
            obj[key] = variables[key];
            return obj;
          }, {})
        );
      }
      return {
        hexVars: hexVars.reduce((obj, key) => {
          obj[key] = variables[key];
          return obj;
        }, {}),
        rgbVars: rgbVars.reduce((obj, key) => {
          obj[key] = variables[key];
          return obj;
        }, {}),
        allVariables: variables,
      };
    }
    testHexToRgb(hex) {
      const rgb = Year3000Utilities.hexToRgb(hex);
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          `\u{1F504} [StarryNight Debug] ${hex} \u2192 RGB(${rgb?.r}, ${rgb?.g}, ${rgb?.b}) \u2192 "${rgb?.r},${rgb?.g},${rgb?.b}"`
        );
      }
      return rgb;
    }
    validateRgbVariables() {
      const requiredRgbVars = [
        "--sn-gradient-primary-rgb",
        "--sn-gradient-secondary-rgb",
        "--sn-gradient-accent-rgb",
        "--spice-rgb-main",
        "--spice-rgb-base",
        "--spice-rgb-player",
        "--spice-rgb-sidebar",
        "--spice-rgb-accent",
        "--spice-rgb-button",
        // Added from notes
        "--spice-rgb-surface0",
        "--spice-rgb-surface1",
        "--spice-rgb-text",
        // Added from notes
      ];
      const root = Year3000Utilities.getRootStyle();
      if (!root) {
        console.warn(
          "[StarryNight Debug] Root element not found for validateRgbVariables."
        );
        return {};
      }
      const validation = {};
      requiredRgbVars.forEach((varName) => {
        const value = root.getPropertyValue(varName).trim();
        validation[varName] = {
          present: !!value,
          value,
          validFormat: /^\d+,\d+,\d+$/.test(value),
        };
      });
      if (YEAR3000_CONFIG?.enableDebug) {
        console.table(validation);
      }
      return validation;
    }
    resetColors() {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F504} [StarryNight Debug] Resetting colors to defaults..."
        );
      }
      if (globalThis.year3000System?.resetToDefaults) {
        globalThis.year3000System.resetToDefaults();
      } else {
        console.warn(
          "[StarryNight Debug] year3000System.resetToDefaults not available."
        );
      }
    }
    extractColors() {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F3A8} [StarryNight Debug] Extracting colors from current track..."
        );
      }
      if (globalThis.year3000System?.updateColorsFromCurrentTrack) {
        globalThis.year3000System.updateColorsFromCurrentTrack();
      } else {
        console.warn(
          "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
        );
      }
    }
    getReport() {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F4CA} [StarryNight Debug] Generating system report..."
        );
      }
      if (globalThis.year3000System?.getSystemReport) {
        return globalThis.year3000System.getSystemReport();
      } else {
        console.warn(
          "[StarryNight Debug] year3000System.getSystemReport not available."
        );
        return { error: "getSystemReport not available" };
      }
    }
    // Add a helper to get a specific CSS variable's value directly
    getCssVariable(varName) {
      const rootStyle = Year3000Utilities.getRootStyle();
      if (!rootStyle) {
        console.warn(
          `[StarryNight Debug] Root element style not found for getCssVariable: ${varName}.`
        );
        return null;
      }
      const value = rootStyle.getPropertyValue(varName).trim();
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(`[StarryNight Debug] CSS Variable ${varName}: '${value}'`);
      }
      return value;
    }
    // ===================================================================
    // 🧪 COMPREHENSIVE INTEGRATION TESTING
    // ===================================================================
    async runFullIntegrationTest() {
      console.group(
        "\u{1F9EA} [SystemIntegrationTester] Phase 3 - Full Integration Test"
      );
      this.testInProgress = true;
      this.testResults = {
        startTime: Date.now(),
        domValidation: null,
        systemTests: {},
        crossSystemTests: {},
        performanceTests: {},
        errors: [],
      };
      try {
        console.log("\u{1F4CB} Step 1: Validating DOM structure...");
        this.testResults.domValidation = await this.validateDOMStructure();
        console.log("\u{1F3AF} Step 2: Testing individual systems...");
        this.testResults.systemTests = await this.testAllVisualSystems();
        console.log("\u{1F517} Step 3: Testing cross-system integration...");
        this.testResults.crossSystemTests =
          await this.testCrossSystemIntegration();
        console.log("\u26A1 Step 4: Performance testing...");
        this.testResults.performanceTests = await this.testSystemPerformance();
        console.log("\u{1F4CA} Step 5: Generating integration report...");
        const report = this.generateIntegrationReport();
        this.testResults.endTime = Date.now();
        this.testResults.duration =
          this.testResults.endTime - this.testResults.startTime;
        console.log("\u2705 Integration test completed successfully!");
        console.groupEnd();
        return report;
      } catch (error) {
        this.testResults.errors.push({
          type: "FATAL_ERROR",
          message: error.message,
          stack: error.stack,
          timestamp: Date.now(),
        });
        console.error("\u274C Integration test failed:", error);
        console.groupEnd();
        throw error;
      } finally {
        this.testInProgress = false;
      }
    }
    // === DOM STRUCTURE VALIDATION ===
    async validateDOMStructure() {
      const domValidation = {
        modernSelectorsFound: 0,
        modernSelectorsMissing: 0,
        legacySelectorsStillPresent: 0,
        criticalElementsMissing: [],
        recommendations: [],
      };
      Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
        if (elementExists(selector)) {
          domValidation.modernSelectorsFound++;
        } else {
          domValidation.modernSelectorsMissing++;
          const isCritical =
            GRAVITY_WELL_TARGETS.primary.includes(selector) ||
            GRAVITY_WELL_TARGETS.secondary.includes(selector);
          if (isCritical) {
            domValidation.criticalElementsMissing.push({
              name: key,
              selector,
              impact: "HIGH",
            });
          }
        }
      });
      const legacySelectors = [
        ".main-nowPlayingWidget-nowPlaying",
        ".main-navBar-navBar",
        ".main-search-searchBar",
        ".main-topBar-topBar",
        ".main-queue-queue",
      ];
      legacySelectors.forEach((selector) => {
        if (elementExists(selector)) {
          domValidation.legacySelectorsStillPresent++;
          domValidation.recommendations.push({
            type: "LEGACY_SELECTOR_FOUND",
            selector,
            message: `Legacy selector ${selector} still exists - systems may have redundant targeting`,
          });
        }
      });
      return domValidation;
    }
    // === SYSTEM TESTING ===
    async testAllVisualSystems() {
      const systemTests = {};
      const systemsToTest = [
        "BehavioralPredictionEngine",
        "DimensionalNexusSystem",
        "DataGlyphSystem",
      ];
      for (const systemName of systemsToTest) {
        systemTests[systemName] = await this.testIndividualSystem(systemName);
      }
      return systemTests;
    }
    async testIndividualSystem(systemName) {
      const systemTest = {
        name: systemName,
        status: "UNKNOWN",
        targetsFound: 0,
        targetsMissing: 0,
        selectors: [],
        errors: [],
      };
      try {
        const selectorTest = await this.testSystemSelectors(systemName);
        systemTest.targetsFound = selectorTest.found;
        systemTest.targetsMissing = selectorTest.missing;
        systemTest.selectors = selectorTest.details;
        if (systemTest.targetsMissing === 0) {
          systemTest.status = "HEALTHY";
        } else if (systemTest.targetsFound > systemTest.targetsMissing) {
          systemTest.status = "DEGRADED";
        } else {
          systemTest.status = "FAILING";
        }
      } catch (error) {
        systemTest.status = "ERROR";
        systemTest.errors.push({
          type: "TEST_ERROR",
          message: error.message,
        });
      }
      return systemTest;
    }
    async testSystemSelectors(systemName) {
      const selectorTest = {
        found: 0,
        missing: 0,
        details: [],
      };
      const systemSelectors = this.getExpectedSelectorsForSystem(systemName);
      systemSelectors.forEach(({ name, selector, importance }) => {
        const elements = findElementsWithFallback(selector);
        const found = elements.length > 0;
        selectorTest.details.push({
          name,
          selector,
          found,
          count: elements.length,
          importance,
        });
        if (found) {
          selectorTest.found++;
        } else {
          selectorTest.missing++;
        }
      });
      return selectorTest;
    }
    getExpectedSelectorsForSystem(systemName) {
      const commonSelectors = [
        {
          name: "Left Sidebar",
          selector: MODERN_SELECTORS.leftSidebar,
          importance: "HIGH",
        },
        {
          name: "Now Playing Bar",
          selector: MODERN_SELECTORS.nowPlayingBar,
          importance: "HIGH",
        },
        {
          name: "Track Rows",
          selector: ORBITAL_ELEMENTS.trackRows,
          importance: "MEDIUM",
        },
      ];
      const systemSpecificSelectors = {
        BehavioralPredictionEngine: [
          ...commonSelectors,
          {
            name: "Play Button",
            selector: MODERN_SELECTORS.playButton,
            importance: "HIGH",
          },
          {
            name: "Like Button",
            selector: MODERN_SELECTORS.likeButton,
            importance: "MEDIUM",
          },
        ],
        DimensionalNexusSystem: [
          {
            name: "Left Sidebar",
            selector: MODERN_SELECTORS.leftSidebar,
            importance: "CRITICAL",
          },
          {
            name: "Modal Container",
            selector: MODERN_SELECTORS.modal,
            importance: "MEDIUM",
          },
        ],
        DataGlyphSystem: [
          {
            name: "Nav Links",
            selector: ORBITAL_ELEMENTS.navLinks,
            importance: "HIGH",
          },
          {
            name: "Cards",
            selector: ORBITAL_ELEMENTS.cards,
            importance: "MEDIUM",
          },
        ],
      };
      return systemSpecificSelectors[systemName] || commonSelectors;
    }
    // === CROSS-SYSTEM INTEGRATION TESTING ===
    async testCrossSystemIntegration() {
      const crossSystemTests = {
        sharedElementConflicts: [],
        performanceImpacts: [],
      };
      crossSystemTests.sharedElementConflicts = this.testSharedElementUsage();
      return crossSystemTests;
    }
    testSharedElementUsage() {
      const conflicts = [];
      const criticalSelectors = [
        MODERN_SELECTORS.leftSidebar,
        MODERN_SELECTORS.nowPlayingBar,
        ORBITAL_ELEMENTS.trackRows,
      ];
      criticalSelectors.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          const classes = Array.from(element.classList);
          const systemPrefixes = classes.filter(
            (cls) =>
              cls.startsWith("sn-") ||
              cls.startsWith("year3000-") ||
              cls.startsWith("gravity-")
          );
          if (systemPrefixes.length > 3) {
            conflicts.push({
              selector,
              element,
              systemClasses: systemPrefixes,
              severity: "POTENTIAL_CONFLICT",
              message: `Element has ${systemPrefixes.length} system-specific classes`,
            });
          }
        }
      });
      return conflicts;
    }
    // === PERFORMANCE TESTING ===
    async testSystemPerformance() {
      const performanceTests = {
        domQuerySpeed: await this.testDOMQueryPerformance(),
        memoryUsage: this.testMemoryUsage(),
      };
      return performanceTests;
    }
    async testDOMQueryPerformance() {
      const tests = [];
      const selectors = Object.values(MODERN_SELECTORS);
      const iterations = 100;
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        selectors.forEach((selector) => {
          document.querySelectorAll(selector);
        });
      }
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;
      tests.push({
        test: "Modern Selectors Query Speed",
        iterations,
        totalTime: endTime - startTime,
        averageTime,
        status:
          averageTime < 5 ? "GOOD" : averageTime < 15 ? "ACCEPTABLE" : "SLOW",
      });
      return tests;
    }
    testMemoryUsage() {
      const memoryTests = [];
      if (performance.memory) {
        memoryTests.push({
          test: "JavaScript Heap Usage",
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          percentage: (
            (performance.memory.usedJSHeapSize /
              performance.memory.totalJSHeapSize) *
            100
          ).toFixed(2),
          status:
            performance.memory.usedJSHeapSize <
            performance.memory.totalJSHeapSize * 0.8
              ? "GOOD"
              : "HIGH",
        });
      }
      return memoryTests;
    }
    // === REPORTING ===
    generateIntegrationReport() {
      const report = {
        timestamp: /* @__PURE__ */ new Date().toISOString(),
        duration: this.testResults.duration,
        summary: this.generateSummary(),
        recommendations: this.generateRecommendations(),
        fullResults: this.testResults,
      };
      this.logFormattedReport(report);
      return report;
    }
    generateSummary() {
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      const healthySystems = Object.values(systemTests).filter(
        (s) => s.status === "HEALTHY"
      ).length;
      const totalSystems = Object.keys(systemTests).length;
      return {
        overallHealth: this.calculateOverallHealth(),
        modernSelectorsFound: domValidation.modernSelectorsFound,
        modernSelectorsMissing: domValidation.modernSelectorsMissing,
        systemsHealthy: healthySystems,
        systemsTotal: totalSystems,
        criticalIssues: domValidation.criticalElementsMissing.length,
      };
    }
    calculateOverallHealth() {
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      let score = 100;
      score -= domValidation.modernSelectorsMissing * 5;
      score -= domValidation.criticalElementsMissing.length * 15;
      const unhealthySystems = Object.values(systemTests).filter(
        (s) => s.status === "FAILING" || s.status === "ERROR"
      ).length;
      score -= unhealthySystems * 20;
      return Math.max(0, score);
    }
    generateRecommendations() {
      const recommendations = [];
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      if (domValidation.criticalElementsMissing.length > 0) {
        recommendations.push({
          priority: "HIGH",
          type: "CRITICAL_ELEMENTS",
          message: `${domValidation.criticalElementsMissing.length} critical elements are missing`,
          action: "Update Spotify or check for UI changes",
        });
      }
      Object.entries(systemTests).forEach(([systemName, test]) => {
        if (test.status === "FAILING" || test.status === "ERROR") {
          recommendations.push({
            priority: "HIGH",
            type: "SYSTEM_FAILURE",
            system: systemName,
            message: `${systemName} is not functioning properly`,
            action: "Check system initialization and selector updates",
          });
        }
      });
      return recommendations;
    }
    logFormattedReport(report) {
      console.group("\u{1F4CA} System Integration Test Report");
      console.log(`\u{1F552} Test Duration: ${report.duration}ms`);
      console.log(`\u{1F4C8} Overall Health: ${report.summary.overallHealth}%`);
      console.log(
        `\u{1F3AF} Systems Healthy: ${report.summary.systemsHealthy}/${report.summary.systemsTotal}`
      );
      console.log(
        `\u{1F50D} Modern Selectors: ${report.summary.modernSelectorsFound} found, ${report.summary.modernSelectorsMissing} missing`
      );
      if (report.recommendations.length > 0) {
        console.group("\u{1F6A8} Recommendations");
        report.recommendations.forEach((rec) => {
          console.log(
            `${rec.priority === "HIGH" ? "\u{1F534}" : "\u{1F7E1}"} ${
              rec.type
            }: ${rec.message}`
          );
          console.log(`   Action: ${rec.action}`);
        });
        console.groupEnd();
      }
      console.groupEnd();
    }
  };
  var Year3000Debug = {
    // Quick debug utilities (direct methods for console convenience)
    testGradients: () => new SystemIntegrationTester().testGradients(),
    logCurrentVariables: () =>
      new SystemIntegrationTester().logCurrentVariables(),
    testHexToRgb: (hex) => new SystemIntegrationTester().testHexToRgb(hex),
    validateRgbVariables: () =>
      new SystemIntegrationTester().validateRgbVariables(),
    resetColors: () => new SystemIntegrationTester().resetColors(),
    extractColors: () => new SystemIntegrationTester().extractColors(),
    getReport: () => new SystemIntegrationTester().getReport(),
    getCssVariable: (varName) =>
      new SystemIntegrationTester().getCssVariable(varName),
    // Comprehensive testing
    runFullIntegrationTest: () =>
      new SystemIntegrationTester().runFullIntegrationTest(),
    // Get instance for advanced usage
    getInstance: () => new SystemIntegrationTester(),
  };
  if (typeof window !== "undefined") {
    window.SystemIntegrationTester = new SystemIntegrationTester();
    window.Year3000Debug = Year3000Debug;
    window.runIntegrationTest = () =>
      window.SystemIntegrationTester.runFullIntegrationTest();
  }

  // src-js/core/mainInitialization.js
  async function main() {
    try {
      console.log(
        "\u{1F31F} [StarryNight] Starting YEAR 3000 main initialization..."
      );
      if (
        globalThis.year3000System &&
        typeof globalThis.year3000System.initializeAllSystems === "function"
      ) {
        await globalThis.year3000System.initializeAllSystems();
        console.log(
          "\u{1F31F} [StarryNight] year3000System.initializeAllSystems() completed successfully"
        );
      } else {
        console.error(
          "\u{1F525} [StarryNight] year3000System.initializeAllSystems not available!"
        );
      }
      if (
        globalThis.year3000System &&
        globalThis.year3000System.setupMusicAnalysisAndColorExtraction
      ) {
        globalThis.year3000System.setupMusicAnalysisAndColorExtraction();
        console.log(
          "\u{1F31F} [StarryNight] Music analysis and color extraction set up"
        );
      }
      console.log(
        "\u{1F31F} [StarryNight] YEAR 3000 main initialization completed successfully!"
      );
    } catch (error) {
      console.error(
        "\u{1F525} [StarryNight] Error during main initialization:",
        error
      );
    }
  }

  // src-js/theme.entry.js
  var ENABLE_GLOBAL_DEBUGGING = true;
  if (!globalThis.HARMONIC_MODES) {
    globalThis.HARMONIC_MODES = HARMONIC_MODES;
  }
  if (!globalThis.YEAR3000_CONFIG) {
    globalThis.YEAR3000_CONFIG = YEAR3000_CONFIG;
    if (typeof ENABLE_GLOBAL_DEBUGGING === "boolean") {
      console.log(
        `[StarryNight Theme] MASTER DEBUG SWITCH is ${
          ENABLE_GLOBAL_DEBUGGING ? "ON" : "OFF"
        }. Overriding config debug flags.`
      );
      globalThis.YEAR3000_CONFIG.enableDebug = ENABLE_GLOBAL_DEBUGGING;
      globalThis.YEAR3000_CONFIG.enableArtisticModeLogging =
        ENABLE_GLOBAL_DEBUGGING;
      globalThis.YEAR3000_CONFIG.enableDebugMode = ENABLE_GLOBAL_DEBUGGING;
    } else {
      console.warn(
        "[StarryNight Theme] Master debug switch (ENABLE_GLOBAL_DEBUGGING) is not a boolean. Using individual config flags."
      );
    }
    if (
      typeof globalThis.YEAR3000_CONFIG.loadArtisticPreference === "function"
    ) {
      globalThis.YEAR3000_CONFIG.loadArtisticPreference();
    } else {
      console.warn(
        "[StarryNight Theme] YEAR3000_CONFIG.loadArtisticPreference() not found. Artistic preferences may not load correctly."
      );
    }
  }
  (async function catppuccinStarryNight() {
    console.log(
      "\u{1F31F} Catppuccin StarryNight Theme: Main IIFE executing v2"
    );
    if (
      !Spicetify ||
      !Spicetify.React ||
      !Spicetify.ReactDOM ||
      !Spicetify.Player ||
      !Spicetify.Platform
    ) {
      console.warn(
        "[StarryNight Theme] Spicetify APIs not fully available yet. Retrying in 100ms..."
      );
      setTimeout(catppuccinStarryNight, 100);
      return;
    }
    console.log("[StarryNight Theme] Spicetify APIs ready.");
    console.log(
      "\u{1F31F} [StarryNight Theme] Initializing Year3000 System Core..."
    );
    const year3000SystemInstance = new Year3000System(
      globalThis.YEAR3000_CONFIG,
      globalThis.HARMONIC_MODES
    );
    globalThis.year3000System = year3000SystemInstance;
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "\u{1F31F} [StarryNight Theme] Year3000 System Core instance created:",
        globalThis.year3000System
      );
    }
    globalThis.StarryNightEffects = starryNightEffects_exports;
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "\u{1F320} [StarryNight Theme] StarryNightEffects exposed on globalThis:",
        globalThis.StarryNightEffects
      );
    }
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "\u{1F680} [StarryNight Theme] Calling runMainInitialization (which calls year3000System.initializeAllSystems & setup listeners)..."
      );
    }
    await main();
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "\u2705 [StarryNight Theme] runMainInitialization completed. All systems should be go."
      );
    }
    if (Spicetify.Platform && Spicetify.Platform.History) {
      Spicetify.Platform.History.listen(insertOption);
      insertOption(Spicetify.Platform.History.location.pathname);
      if (globalThis.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "[StarryNight Theme] Settings UI initialized and history listener attached."
        );
      }
    } else {
      console.error(
        "[StarryNight Theme] Spicetify.Platform.History not available. Settings UI cannot be initialized."
      );
    }
    if (globalThis.YEAR3000_CONFIG.enableDebugMode) {
      globalThis.Year3000Debug = Year3000Debug;
      if (globalThis.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F6E0}\uFE0F [StarryNight Theme] Year3000Debug interface exposed on globalThis.Year3000Debug."
        );
      }
    } else if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "[StarryNight Theme] Debug mode UI not explicitly enabled (YEAR3000_CONFIG.enableDebugMode), but debug logging is on. Debug object not exposed globally."
      );
    }
    console.log(
      "\u{1F30C} Catppuccin StarryNight Theme fully initialized and operational. Welcome to the future of sound!"
    );
    if (globalThis.YEAR3000_CONFIG.enableArtisticModeLogging) {
      console.log(
        `\u{1F3A8} Current Artistic Mode: ${globalThis.YEAR3000_CONFIG.artisticMode}`
      );
    }
  })();
})();
