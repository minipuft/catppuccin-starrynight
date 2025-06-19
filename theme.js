"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src-js/utils/StorageManager.ts
  var LEGACY_KEY_MAPPINGS, VALID_KEY_PREFIXES, StorageManager;
  var init_StorageManager = __esm({
    "src-js/utils/StorageManager.ts"() {
      "use strict";
      LEGACY_KEY_MAPPINGS = {
        "sn-starDensity": "sn-star-density",
        "year3000-artistic-mode": "sn-artistic-mode",
        "MusicSyncService-prefs": "sn-music-sync-prefs"
      };
      VALID_KEY_PREFIXES = ["sn-", "catppuccin-"];
      StorageManager = class {
        /**
         * Check if Spicetify.LocalStorage is available
         */
        static isSpicetifyStorageAvailable() {
          if (this._spicetifyAvailable !== null) {
            return this._spicetifyAvailable;
          }
          try {
            this._spicetifyAvailable = typeof Spicetify !== "undefined" && typeof Spicetify.LocalStorage?.get === "function" && typeof Spicetify.LocalStorage?.set === "function";
            if (this._spicetifyAvailable) {
              Spicetify.LocalStorage.get("__test__");
            }
            return this._spicetifyAvailable;
          } catch (error) {
            console.warn(
              "[StorageManager] Spicetify.LocalStorage not available:",
              error
            );
            this._spicetifyAvailable = false;
            return false;
          }
        }
        /**
         * Validate storage key follows theme conventions
         */
        static validateKey(key) {
          if (!key || typeof key !== "string") return false;
          return VALID_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
        }
        /**
         * Get value from storage with fallback to native localStorage
         */
        static get(key) {
          try {
            if (this.isSpicetifyStorageAvailable()) {
              return Spicetify.LocalStorage.get(key);
            } else {
              console.warn(
                `[StorageManager] Using fallback localStorage for key: ${key}`
              );
              return localStorage.getItem(key);
            }
          } catch (error) {
            console.error(`[StorageManager] Error reading key ${key}:`, error);
            return null;
          }
        }
        /**
         * Set value in storage with fallback to native localStorage
         */
        static set(key, value) {
          try {
            if (this.isSpicetifyStorageAvailable()) {
              Spicetify.LocalStorage.set(key, value);
              return true;
            } else {
              console.warn(
                `[StorageManager] Using fallback localStorage for key: ${key}`
              );
              localStorage.setItem(key, value);
              return true;
            }
          } catch (error) {
            console.error(`[StorageManager] Error setting key ${key}:`, error);
            return false;
          }
        }
        /**
         * Remove value from storage
         */
        static remove(key) {
          try {
            if (this.isSpicetifyStorageAvailable()) {
              Spicetify.LocalStorage.remove?.(key) || Spicetify.LocalStorage.set(key, null);
              return true;
            } else {
              localStorage.removeItem(key);
              return true;
            }
          } catch (error) {
            console.error(`[StorageManager] Error removing key ${key}:`, error);
            return false;
          }
        }
        /**
         * Migrate values from native localStorage to Spicetify.LocalStorage
         */
        static migrateFromNativeLocalStorage(keyMappings) {
          if (!this.isSpicetifyStorageAvailable()) {
            console.warn(
              "[StorageManager] Cannot migrate - Spicetify.LocalStorage unavailable"
            );
            return;
          }
          let migratedCount = 0;
          for (const [oldKey, newKey] of Object.entries(keyMappings)) {
            try {
              const value = localStorage.getItem(oldKey);
              if (value !== null) {
                const existingValue = Spicetify.LocalStorage.get(newKey);
                if (existingValue === null) {
                  Spicetify.LocalStorage.set(newKey, value);
                  migratedCount++;
                  console.log(`[StorageManager] Migrated: ${oldKey} \u2192 ${newKey}`);
                }
              }
            } catch (error) {
              console.error(
                `[StorageManager] Migration failed for ${oldKey}:`,
                error
              );
            }
          }
          if (migratedCount > 0) {
            console.log(
              `[StorageManager] Migration completed: ${migratedCount} keys migrated`
            );
          }
        }
        /**
         * Migrate all known theme settings from localStorage
         */
        static migrateThemeSettings() {
          if (this._migrationCompleted) return;
          console.log("[StorageManager] Starting theme settings migration...");
          this.migrateFromNativeLocalStorage(LEGACY_KEY_MAPPINGS);
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith("sn-") && !Object.values(LEGACY_KEY_MAPPINGS).includes(key)) {
                const value = localStorage.getItem(key);
                if (value !== null && this.get(key) === null) {
                  this.set(key, value);
                  console.log(`[StorageManager] Auto-migrated legacy key: ${key}`);
                }
              }
            }
          } catch (error) {
            console.error("[StorageManager] Auto-migration error:", error);
          }
          this._migrationCompleted = true;
          console.log("[StorageManager] Theme settings migration completed");
        }
        /**
         * Get all keys with a specific prefix
         */
        static getKeysWithPrefix(prefix) {
          const keys = [];
          if (this.isSpicetifyStorageAvailable()) {
            const commonSuffixes = [
              "star-density",
              "gradient-intensity",
              "glassmorphism-level",
              "3d-effects-level",
              "artistic-mode",
              "current-harmonic-mode",
              "harmonic-intensity",
              "harmonic-evolution",
              "harmonic-manual-base-color"
            ];
            for (const suffix of commonSuffixes) {
              const key = `${prefix}${suffix}`;
              if (this.get(key) !== null) {
                keys.push(key);
              }
            }
          }
          return keys;
        }
        /**
         * Validate storage health and report issues
         */
        static validateStorageHealth() {
          const result = {
            isHealthy: true,
            issues: [],
            recommendations: []
          };
          if (!this.isSpicetifyStorageAvailable()) {
            result.isHealthy = false;
            result.issues.push("Spicetify.LocalStorage not available");
            result.recommendations.push(
              "Ensure theme is running in Spicetify environment"
            );
          }
          try {
            const orphanedKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (key.startsWith("sn-") || key.startsWith("catppuccin-"))) {
                orphanedKeys.push(key);
              }
            }
            if (orphanedKeys.length > 0) {
              result.issues.push(
                `Found ${orphanedKeys.length} orphaned localStorage keys`
              );
              result.recommendations.push(
                "Run StorageManager.migrateThemeSettings() to migrate them"
              );
            }
          } catch (error) {
            result.issues.push("Cannot access localStorage for health check");
          }
          return result;
        }
        /**
         * Run comprehensive integration tests
         */
        static runIntegrationTests() {
          const results = {
            storageAvailable: false,
            migrationWorking: false,
            settingsResponse: false,
            keyValidation: false,
            errorHandling: false,
            issues: [],
            summary: ""
          };
          console.log("[StorageManager] Running integration tests...");
          try {
            results.storageAvailable = this.isSpicetifyStorageAvailable();
            if (!results.storageAvailable) {
              results.issues.push("Spicetify.LocalStorage not available");
            }
          } catch (error) {
            results.issues.push(`Storage availability test failed: ${error}`);
          }
          try {
            const validKey = this.validateKey("sn-test-key");
            const invalidKey = this.validateKey("invalid-key");
            results.keyValidation = validKey && !invalidKey;
            if (!results.keyValidation) {
              results.issues.push("Key validation not working correctly");
            }
          } catch (error) {
            results.issues.push(`Key validation test failed: ${error}`);
          }
          try {
            const testKey = "sn-integration-test";
            const testValue = "test-value-" + Date.now();
            const setSuccess = this.set(testKey, testValue);
            const getValue = this.get(testKey);
            const removeSuccess = this.remove(testKey);
            results.settingsResponse = setSuccess && getValue === testValue && removeSuccess;
            if (!results.settingsResponse) {
              results.issues.push("Basic set/get/remove operations failed");
            }
          } catch (error) {
            results.issues.push(`Settings response test failed: ${error}`);
          }
          try {
            const legacyKey = "test-legacy-key";
            const newKey = "sn-migrated-key";
            const testValue = "migration-test-" + Date.now();
            localStorage.setItem(legacyKey, testValue);
            this.migrateFromNativeLocalStorage({ [legacyKey]: newKey });
            const migratedValue = this.get(newKey);
            results.migrationWorking = migratedValue === testValue;
            localStorage.removeItem(legacyKey);
            this.remove(newKey);
            if (!results.migrationWorking) {
              results.issues.push("Migration functionality not working");
            }
          } catch (error) {
            results.issues.push(`Migration test failed: ${error}`);
          }
          try {
            const nullResult = this.get("");
            const invalidSetResult = this.set("", "");
            results.errorHandling = nullResult === null && !invalidSetResult;
            if (!results.errorHandling) {
              results.issues.push("Error handling not working correctly");
            }
          } catch (error) {
            results.issues.push(`Error handling test failed: ${error}`);
          }
          const passedTests = [
            results.storageAvailable,
            results.migrationWorking,
            results.settingsResponse,
            results.keyValidation,
            results.errorHandling
          ].filter(Boolean).length;
          results.summary = `${passedTests}/5 tests passed. ${results.issues.length} issues found.`;
          console.log("[StorageManager] Integration test results:", results);
          return results;
        }
        /**
         * Get diagnostic information for debugging
         */
        static getDiagnosticInfo() {
          const legacyKeys = [];
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && Object.keys(LEGACY_KEY_MAPPINGS).includes(key)) {
                legacyKeys.push(key);
              }
            }
          } catch (error) {
          }
          return {
            spicetifyAvailable: this.isSpicetifyStorageAvailable(),
            migrationCompleted: this._migrationCompleted,
            knownKeys: this.getKeysWithPrefix("sn-"),
            legacyKeysFound: legacyKeys,
            storageHealth: this.validateStorageHealth()
          };
        }
      };
      StorageManager._migrationCompleted = false;
      StorageManager._spicetifyAvailable = null;
      if (typeof Spicetify !== "undefined") {
        setTimeout(() => {
          StorageManager.migrateThemeSettings();
        }, 100);
      }
    }
  });

  // src-js/config/globalConfig.ts
  var HARMONIC_MODES, ARTISTIC_MODE_PROFILES, YEAR3000_CONFIG;
  var init_globalConfig = __esm({
    "src-js/config/globalConfig.ts"() {
      "use strict";
      init_StorageManager();
      HARMONIC_MODES = {
        "analogous-flow": {
          rule: "analogous",
          angle: 30,
          description: "Gentle rivers of adjacent hues"
        },
        "triadic-trinity": {
          rule: "triadic",
          angle: 120,
          description: "Three-point stellar equilibrium"
        },
        "complementary-yin-yang": {
          rule: "complementary",
          angle: 180,
          description: "Opposing forces in harmony"
        },
        "tetradic-cosmic-cross": {
          rule: "tetradic",
          angle: 90,
          description: "Four-dimensional color matrix"
        },
        "split-complementary-aurora": {
          rule: "split-complementary",
          angle: 150,
          description: "Dancing polar opposites"
        },
        "monochromatic-meditation": {
          rule: "monochromatic",
          angle: 0,
          description: "Single-hue consciousness expansion"
        }
      };
      ARTISTIC_MODE_PROFILES = {
        "corporate-safe": {
          displayName: "Corporate Safe",
          description: "Elegant professional choreography with subtle Year 3000 enhancements",
          philosophy: "Refined efficiency that respects workspace harmony while providing gentle predictive assistance",
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
            visualIntensityBase: 0.8
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
            aestheticGravity: false
            // Disabled for professional environments
          },
          performance: {
            maxParticles: 0,
            animationThrottle: 32,
            // 30fps for efficiency
            enableGPUAcceleration: false,
            reducedMotion: true
          }
        },
        "artist-vision": {
          displayName: "Artist Vision",
          description: "Balanced creative expression that enhances musical experience without overwhelming",
          philosophy: "Harmonic amplification that honors artistic intent while providing musical visual synchronization",
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
            visualIntensityBase: 1
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
            aestheticGravity: true
            // Balanced gravitational effects
          },
          performance: {
            maxParticles: 20,
            animationThrottle: 16,
            // 60fps
            enableGPUAcceleration: true,
            reducedMotion: false
          }
        },
        "cosmic-maximum": {
          displayName: "Cosmic Maximum",
          description: "Full Year 3000 emergent systems choreography with kinetic beauty and aesthetic gravity",
          philosophy: "Gravitational optimism through aesthetic attractor fields that create quantum empathy and temporal play",
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
            visualIntensityBase: 1.4
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
            quantumEmpathy: true
            // Full prediction
          },
          performance: {
            maxParticles: 50,
            animationThrottle: 8,
            // 120fps for smoothness
            enableGPUAcceleration: true,
            reducedMotion: false
          }
        }
      };
      YEAR3000_CONFIG = {
        enableDebug: true,
        enableContextualIntelligence: true,
        performanceProfiles: {
          low: {
            maxParticles: 15,
            animationThrottle: 32,
            // ~30fps
            enableGPUAcceleration: false,
            enableAdvancedShaders: false,
            textureResolution: 0.5
          },
          balanced: {
            maxParticles: 40,
            animationThrottle: 16,
            // ~60fps
            enableGPUAcceleration: true,
            enableAdvancedShaders: false,
            textureResolution: 1
          },
          high: {
            maxParticles: 75,
            animationThrottle: 16,
            // ~60fps
            enableGPUAcceleration: true,
            enableAdvancedShaders: true,
            textureResolution: 1
          },
          ultra: {
            maxParticles: 150,
            animationThrottle: 8,
            // ~120fps
            enableGPUAcceleration: true,
            enableAdvancedShaders: true,
            textureResolution: 2
            // High-res textures
          }
        },
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
            enableAdaptiveDegradation: true
            // Auto-reduce quality when needed
          }
        },
        healthCheckInterval: 1e4,
        visual: {
          lightweightParticleSystem: { mode: "artist-vision" },
          dimensionalNexusSystem: { mode: "artist-vision" },
          dataGlyphSystem: { mode: "artist-vision" },
          beatSyncVisualSystem: { mode: "artist-vision" },
          behavioralPredictionEngine: { mode: "artist-vision" },
          predictiveMaterializationSystem: { mode: "artist-vision" },
          sidebarConsciousnessSystem: { mode: "artist-vision" }
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
          this.boundGetCurrentMultipliers = this.getCurrentMultipliers.bind(this);
          this.boundGetCurrentFeatures = this.getCurrentFeatures.bind(this);
          this.boundGetCurrentPerformanceSettings = this.getCurrentPerformanceSettings.bind(this);
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
        musicVisualSync: {
          energyScaling: {
            low: 0.6,
            medium: 1,
            high: 1.4
          },
          valenceScaling: {
            sad: 0.8,
            neutral: 1,
            happy: 1.3
          },
          danceabilityEffects: {
            enable: true,
            animationSpeedMultiplier: 1.5,
            blurVariation: 0.3
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
              lowDance: { value: 0.2 }
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
              loudnessRange: { min: -60, max: 0 }
              // Expected loudness range (dB)
            },
            // Enhanced BPM calculation parameters
            danceabilityThresholds: {
              high: 0.7,
              // High danceability - use full tempo
              low: 0.3
              // Low danceability - may reduce tempo
            },
            energyMultiplierRange: {
              min: 0.8,
              // Minimum energy multiplier
              max: 1.4
              // Maximum energy multiplier
            },
            tempoMultipliers: {
              highDance: 1,
              // Full tempo for danceable tracks
              mediumDance: 0.75,
              // Moderate reduction
              lowDance: 0.5
              // Significant reduction for smooth visuals
            },
            // Fallback values when audio data is unavailable
            fallbacks: {
              tempo: 120,
              loudness: -10,
              danceability: 0.5,
              energy: 0.5,
              key: 0,
              timeSignature: 4
            }
          }
        },
        // Enhanced: Get current mode profile with full Year3000 parameters
        getCurrentModeProfile() {
          const mode = this.artisticMode || "artist-vision";
          return ARTISTIC_MODE_PROFILES[mode] || ARTISTIC_MODE_PROFILES["artist-vision"];
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
            console.error("[YEAR3000_CONFIG] Error in getCurrentMultipliers:", error);
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
                colorHarmony: true
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
                colorHarmony: true
              };
            }
            return currentProfile.features;
          } catch (error) {
            console.error("[YEAR3000_CONFIG] Error in getCurrentFeatures:", error);
            return {
              enableAdvancedEffects: true,
              enableHarmony: true,
              beatSync: true,
              colorHarmony: true
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
                reducedMotion: false
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
                reducedMotion: false
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
              reducedMotion: false
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
            "getCurrentPerformanceSettings"
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
                    profile: this.getCurrentModeProfile()
                  }
                })
              );
            }
            if (typeof globalThis.year3000System !== "undefined" && globalThis.year3000System.setGradientParameters) {
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
              console.log(`\u{1F527} [YEAR3000_CONFIG] Logging level set to: ${level}`);
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
          console.log("\u{1F527} [YEAR3000_CONFIG] Performance warnings disabled");
        },
        // Enable performance warnings
        enablePerformanceWarnings() {
          this.logging.performance.enableFrameBudgetWarnings = true;
          console.log("\u{1F527} [YEAR3000_CONFIG] Performance warnings enabled");
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
          console.log("\u{1F527} [YEAR3000_CONFIG] Configured for production environment");
        },
        setupForDevelopment() {
          this.setLoggingLevel("debug");
          this.enablePerformanceWarnings();
          this.setPerformanceWarningThrottle(2e3);
          this.logging.performance.enableAdaptiveDegradation = true;
          console.log("\u{1F527} [YEAR3000_CONFIG] Configured for development environment");
        },
        setupForDebugging() {
          this.setLoggingLevel("verbose");
          this.enablePerformanceWarnings();
          this.setPerformanceWarningThrottle(500);
          this.logging.performance.enableAdaptiveDegradation = false;
          console.log("\u{1F527} [YEAR3000_CONFIG] Configured for debugging environment");
        },
        // Validate configuration health and functionality
        validateConfigHealth() {
          const healthReport = {
            overallStatus: "healthy",
            issues: [],
            dynamicChecks: {}
          };
          const configKeys = Object.keys(this).filter(
            (k) => typeof k === "string"
          );
          const functionProperties = configKeys.filter(
            (key) => typeof this[key] === "function"
          );
          for (const key of functionProperties) {
            if (!this.hasOwnProperty(key)) {
              healthReport.issues.push({
                key: String(key),
                severity: "warning",
                message: `Method ${key} is not an own property, may indicate prototype chain issues.`
              });
            }
          }
          const checkProfile = (mode) => {
            if (!ARTISTIC_MODE_PROFILES[mode]) {
              healthReport.issues.push({
                key: `artisticMode:${mode}`,
                severity: "critical",
                message: `Artistic mode profile for '${mode}' is missing.`
              });
              return;
            }
            healthReport.dynamicChecks[`${mode}Profile`] = "ok";
          };
          checkProfile(this.artisticMode);
          checkProfile("artist-vision");
          checkProfile("corporate-safe");
          if (healthReport.issues.length > 0) {
            healthReport.overallStatus = healthReport.issues.some(
              (i) => i.severity === "critical"
            ) ? "critical" : "unhealthy";
          }
          if (this.enableDebug) {
            console.log("[YEAR3000_CONFIG] Health Check Report:", healthReport);
          }
          return healthReport;
        },
        loadArtisticPreference() {
          const saved = StorageManager.get("sn-artistic-mode");
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
        }
      };
      if (typeof YEAR3000_CONFIG.init === "function") {
        YEAR3000_CONFIG.init();
      }
    }
  });

  // src-js/utils/Year3000Utilities.ts
  var Year3000Utilities_exports = {};
  __export(Year3000Utilities_exports, {
    adjustColor: () => adjustColor,
    bpmToAnimationFrameRate: () => bpmToAnimationFrameRate,
    bpmToInterval: () => bpmToInterval,
    calculateBreathingScale: () => calculateBreathingScale,
    calculateContrastRatio: () => calculateContrastRatio,
    calculateNavigationScale: () => calculateNavigationScale,
    calculateOklabDerivedProperties: () => calculateOklabDerivedProperties,
    calculateRhythmPhase: () => calculateRhythmPhase,
    colorDifference: () => colorDifference,
    easeBeatAnimation: () => easeBeatAnimation,
    findRequiredLuminance: () => findRequiredLuminance,
    generateHarmonicOklabColors: () => generateHarmonicOklabColors,
    getBeatPhase: () => getBeatPhase,
    getHealthMonitor: () => getHealthMonitor,
    getNextBeatTime: () => getNextBeatTime,
    getRootStyle: () => getRootStyle,
    hexToRgb: () => hexToRgb,
    hslToRgb: () => hslToRgb,
    intervalToBpm: () => intervalToBpm,
    isOnBeat: () => isOnBeat,
    lerp: () => lerp,
    lerpSmooth: () => lerpSmooth,
    oklabToRgb: () => oklabToRgb,
    processOklabColor: () => processOklabColor,
    rgbToHex: () => rgbToHex,
    rgbToHsl: () => rgbToHsl,
    rgbToOklab: () => rgbToOklab,
    sanitizeColorMap: () => sanitizeColorMap,
    sleep: () => sleep,
    throttle: () => throttle
  });
  function getRootStyle() {
    return document.documentElement;
  }
  function throttle(func, limit) {
    let inThrottle;
    return function throttled(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  function hexToRgb(hex) {
    if (typeof hex !== "string") {
      console.warn(
        "[StarryNight hexToRgb] Input is not a string. Using fallback color (black). Hex:",
        hex
      );
      return { r: 0, g: 0, b: 0 };
    }
    const sanitizedHex = hex.trim();
    let processedHex = sanitizedHex.startsWith("#") ? sanitizedHex : `#${sanitizedHex}`;
    processedHex = processedHex.replace(/##+/g, "#");
    if (processedHex.length === 4) {
      processedHex = `#${processedHex[1]}${processedHex[1]}${processedHex[2]}${processedHex[2]}${processedHex[3]}${processedHex[3]}`;
    }
    const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(processedHex);
    if (result) {
      try {
        const rgb = {
          r: parseInt(result[1] || "0", 16),
          g: parseInt(result[2] || "0", 16),
          b: parseInt(result[3] || "0", 16)
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
  }
  function sanitizeColorMap(input) {
    const validHex = /^#?[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
    const sanitized = {};
    if (!input || typeof input !== "object") {
      return sanitized;
    }
    Object.entries(input).forEach(([key, value]) => {
      if (typeof value !== "string") return;
      const trimmed = value.trim();
      if (!trimmed || trimmed === "undefined") return;
      if (!validHex.test(trimmed)) return;
      const normalised = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
      sanitized[key] = normalised;
    });
    if (YEAR3000_CONFIG?.enableDebug && Object.keys(input).length !== Object.keys(sanitized).length) {
      console.warn(
        `[StarryNight sanitizeColorMap] Dropped ${Object.keys(input).length - Object.keys(sanitized).length} invalid colour entries.`
      );
    }
    return sanitized;
  }
  function rgbToHsl(r, g2, b) {
    r /= 255;
    g2 /= 255;
    b /= 255;
    const max = Math.max(r, g2, b), min = Math.min(r, g2, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g2 - b) / d + (g2 < b ? 6 : 0);
          break;
        case g2:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g2) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
  function hslToRgb(h, s, l) {
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
      b: Math.round(b_val * 255)
    };
  }
  function rgbToHex(r, g2, b) {
    const normalize = (c) => {
      if (!Number.isFinite(c)) return 0;
      const scaled = c <= 1 ? c * 255 : c;
      return Math.min(255, Math.max(0, Math.round(scaled)));
    };
    const [nr, ng, nb] = [normalize(r), normalize(g2), normalize(b)];
    return "#" + [nr, ng, nb].map((channel) => channel.toString(16).padStart(2, "0")).join("");
  }
  function calculateContrastRatio(color1, color2) {
    const getLuminance = (rgb) => {
      const [r_val = 0, g_val = 0, b_val = 0] = [rgb.r, rgb.g, rgb.b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
    };
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }
  function lerpSmooth(current, target, deltaTime, halfLife) {
    const EPSILON = 1e-5;
    if (halfLife <= EPSILON || deltaTime <= 0) {
      if (YEAR3000_CONFIG?.enableDebug) {
        if (halfLife <= EPSILON) {
        }
      }
      return target;
    }
    const result = target + (current - target) * Math.pow(2, -deltaTime / halfLife);
    return result;
  }
  function bpmToInterval(bpm) {
    if (!bpm || bpm <= 0) return 500;
    return 6e4 / bpm;
  }
  function intervalToBpm(intervalMs) {
    if (!intervalMs || intervalMs <= 0) return 120;
    return 6e4 / intervalMs;
  }
  function bpmToAnimationFrameRate(bpm, framesPerBeat = 4) {
    const beatInterval = bpmToInterval(bpm);
    return beatInterval / framesPerBeat;
  }
  function isOnBeat(currentTime, trackStartTime, bpm, tolerance = 50) {
    const beatInterval = bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatPosition = timeSinceStart % beatInterval;
    return beatPosition <= tolerance || beatPosition >= beatInterval - tolerance;
  }
  function getBeatPhase(currentTime, trackStartTime, bpm) {
    const beatInterval = bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatPosition = timeSinceStart % beatInterval;
    return beatPosition / beatInterval;
  }
  function getNextBeatTime(currentTime, trackStartTime, bpm) {
    const beatInterval = bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatsElapsed = Math.floor(timeSinceStart / beatInterval);
    return trackStartTime + (beatsElapsed + 1) * beatInterval;
  }
  function easeBeatAnimation(beatPhase, easingType = "ease-out") {
    switch (easingType) {
      case "ease-in":
        return beatPhase * beatPhase;
      case "linear":
        return beatPhase;
      case "ease-out":
      default:
        return beatPhase * (2 - beatPhase);
    }
  }
  function calculateRhythmPhase(currentTime, animationSpeedFactor = 1) {
    const speed = 1e-3 * animationSpeedFactor;
    return currentTime * speed % (2 * Math.PI);
  }
  function calculateBreathingScale(rhythmPhase, processedEnergy = 0.5) {
    const baseScale = 1;
    const pulseAmount = 0.02 * processedEnergy;
    const breath = Math.sin(rhythmPhase) * pulseAmount;
    return baseScale + breath;
  }
  function calculateNavigationScale(visualIntensity = 0.5, moodIdentifier = "neutral") {
    const baseScale = 1;
    const moodFactor = moodIdentifier === "energetic" ? 1.2 : moodIdentifier === "calm" ? 0.8 : 1;
    return baseScale + 0.05 * visualIntensity * moodFactor;
  }
  function rgbToOklab(r_srgb, g_srgb, b_srgb) {
    const r = r_srgb / 255;
    const g2 = g_srgb / 255;
    const b = b_srgb / 255;
    const l = 0.4122214708 * r + 0.5363325363 * g2 + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g2 + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g2 + 0.6299787005 * b;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    return {
      L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
      a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
      b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_
    };
  }
  function oklabToRgb(L, a, b_oklab) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b_oklab;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b_oklab;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b_oklab;
    const l = l_ * l_ * l_;
    const m = m_ * m_ * m_;
    const s = s_ * s_ * s_;
    let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    let g2 = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    let b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
    r = Math.round(Math.max(0, Math.min(1, r)) * 255);
    g2 = Math.round(Math.max(0, Math.min(1, g2)) * 255);
    b = Math.round(Math.max(0, Math.min(1, b)) * 255);
    return { r, g: g2, b };
  }
  function processOklabColor(oklabColor, context = {}) {
    const { L, a, b } = oklabColor;
    const C = Math.sqrt(a * a + b * b);
    let h_rad = Math.atan2(b, a);
    if (h_rad < 0) {
      h_rad += 2 * Math.PI;
    }
    const h = h_rad * (180 / Math.PI);
    const {
      energy = 0.5,
      valence = 0.5,
      artisticMode = "artist-vision"
    } = context;
    const multipliers = YEAR3000_CONFIG.getCurrentMultipliers();
    let adjusted_L = L * (1 + (valence - 0.5) * 0.1);
    let adjusted_C = C * (1 + (energy - 0.5) * 0.2) * (multipliers?.saturation || 1);
    adjusted_L = Math.max(
      0,
      Math.min(1, adjusted_L * (multipliers?.brightness || 1))
    );
    return {
      L: adjusted_L,
      C: adjusted_C,
      h: C > 1e-3 ? h : null
      // Hue is meaningless if chroma is near zero
    };
  }
  function calculateOklabDerivedProperties(oklabColor) {
    const { L, C, h } = processOklabColor(oklabColor);
    const isWarm = h !== null ? h >= 0 && h < 90 || h >= 270 && h <= 360 : false;
    const isCool = h !== null ? h >= 90 && h < 270 : false;
    let mood = "neutral";
    if (L > 0.7 && C > 0.1) mood = "bright";
    else if (L < 0.4) mood = "dark";
    else if (isWarm && C > 0.1) mood = "warm";
    else if (isCool && C > 0.1) mood = "cool";
    return {
      lightness: L,
      chroma: C,
      hue: h,
      isWarm,
      isCool,
      mood
    };
  }
  function generateHarmonicOklabColors(baseOklabColor, rule = "analogous", angle = 30) {
    const baseLCH = processOklabColor(baseOklabColor);
    if (baseLCH.h === null) {
      return [baseOklabColor];
    }
    const getOklabFromLCH = (l_val, c_val, h_deg_val) => {
      const h_rad = h_deg_val * (Math.PI / 180);
      const a_val = c_val * Math.cos(h_rad);
      const b_val = c_val * Math.sin(h_rad);
      return { L: l_val, a: a_val, b: b_val };
    };
    const colors = [baseOklabColor];
    const { L, C, h } = baseLCH;
    switch (rule) {
      case "complementary":
        colors.push(getOklabFromLCH(L, C, (h + 180) % 360));
        break;
      case "analogous":
        colors.push(getOklabFromLCH(L, C, (h + angle) % 360));
        colors.push(getOklabFromLCH(L, C, (h - angle + 360) % 360));
        break;
      case "triadic":
        colors.push(getOklabFromLCH(L, C, (h + 120) % 360));
        colors.push(getOklabFromLCH(L, C, (h + 240) % 360));
        break;
      case "tetradic":
        colors.push(getOklabFromLCH(L, C, (h + 90) % 360));
        colors.push(getOklabFromLCH(L, C, (h + 180) % 360));
        colors.push(getOklabFromLCH(L, C, (h + 270) % 360));
        break;
      case "split-complementary":
        colors.push(getOklabFromLCH(L, C, (h + 180 - angle) % 360));
        colors.push(getOklabFromLCH(L, C, (h + 180 + angle) % 360));
        break;
      case "monochromatic":
        colors.push({
          L: Math.max(0, L - 0.2),
          a: baseOklabColor.a,
          b: baseOklabColor.b
        });
        colors.push({
          L: Math.min(1, L + 0.2),
          a: baseOklabColor.a,
          b: baseOklabColor.b
        });
        break;
    }
    return colors;
  }
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
  function colorDifference(rgb1, rgb2) {
    const lab1 = rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
    const lab2 = rgbToOklab(rgb2.r, rgb2.g, rgb2.b);
    const deltaL = lab1.L - lab2.L;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }
  function getHealthMonitor() {
    return healthMonitorInstance;
  }
  function findRequiredLuminance(color1, color2, ratio) {
    const getLuminance = (rgb) => {
      const [r_val = 0, g_val = 0, b_val = 0] = [rgb.r, rgb.g, rgb.b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
    };
    const lum2 = getLuminance(color2);
    let targetLuminance;
    targetLuminance = ratio * (lum2 + 0.05) - 0.05;
    const hsl = rgbToHsl(color1.r, color1.g, color1.b);
    const currentLuminance = getLuminance(color1);
    const luminanceRatio = targetLuminance / currentLuminance;
    return hsl.l;
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function adjustColor(rgb, {
    brightness = 1,
    saturation = 1,
    hue = 0
  }) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + hue) % 360;
    hsl.s = Math.max(0, Math.min(100, hsl.s * saturation));
    hsl.l = Math.max(0, Math.min(100, hsl.l * brightness));
    return hslToRgb(hsl.h, hsl.s, hsl.l);
  }
  var HealthMonitor, healthMonitorInstance;
  var init_Year3000Utilities = __esm({
    "src-js/utils/Year3000Utilities.ts"() {
      "use strict";
      init_globalConfig();
      HealthMonitor = class {
        registerSystem(name, instance2) {
        }
        updateSystemMetrics(name, metrics) {
        }
      };
      healthMonitorInstance = new HealthMonitor();
    }
  });

  // src-js/managers/SettingsManager.ts
  var SettingsManager;
  var init_SettingsManager = __esm({
    "src-js/managers/SettingsManager.ts"() {
      "use strict";
      init_globalConfig();
      init_Year3000Utilities();
      SettingsManager = class {
        constructor(config = YEAR3000_CONFIG, harmonicModes = HARMONIC_MODES, utils = Year3000Utilities_exports) {
          this.initialized = false;
          this.config = config;
          this.harmonicModes = harmonicModes;
          this.utils = utils;
          this.defaults = {
            "catppuccin-flavor": "mocha",
            "catppuccin-accentColor": "mauve",
            "sn-star-density": "balanced",
            "sn-gradient-intensity": "balanced",
            "sn-glassmorphism-level": "moderate",
            "sn-3d-effects-level": "full",
            "sn-nebula-intensity": "balanced",
            "sn-artistic-mode": "artist-vision",
            "sn-current-harmonic-mode": "analogous-flow",
            "sn-harmonic-intensity": "0.7",
            "sn-harmonic-evolution": "true",
            "sn-harmonic-manual-base-color": "",
            "sn-enable-webgpu": "true",
            "sn-enable-aberration": "true",
            "sn-nebula-aberration-strength": "0.4",
            "sn-echo-intensity": "2"
          };
          this.validationSchemas = {
            "catppuccin-flavor": {
              default: "mocha",
              allowedValues: ["latte", "frappe", "macchiato", "mocha"]
            },
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
                "none"
              ]
            },
            "sn-star-density": {
              default: "balanced",
              allowedValues: ["disabled", "minimal", "balanced", "intense"]
            },
            "sn-gradient-intensity": {
              default: "balanced",
              allowedValues: ["disabled", "minimal", "balanced", "intense"]
            },
            "sn-glassmorphism-level": {
              default: "moderate",
              allowedValues: ["disabled", "minimal", "moderate", "intense"]
            },
            "sn-3d-effects-level": {
              default: "full",
              allowedValues: ["full", "minimal", "disabled"]
            },
            "sn-nebula-intensity": {
              default: "balanced",
              allowedValues: ["disabled", "minimal", "balanced", "intense"]
            },
            "sn-artistic-mode": {
              default: "artist-vision",
              allowedValues: Object.keys(ARTISTIC_MODE_PROFILES)
            },
            "sn-current-harmonic-mode": {
              default: "analogous-flow",
              allowedValues: Object.keys(
                this.harmonicModes
              )
            },
            "sn-harmonic-intensity": { default: "0.7" },
            "sn-harmonic-evolution": {
              default: "true",
              allowedValues: ["true", "false"]
            },
            "sn-harmonic-manual-base-color": { default: "" },
            "sn-enable-webgpu": {
              default: "true",
              allowedValues: ["true", "false"]
            },
            "sn-enable-aberration": {
              default: "true",
              allowedValues: ["true", "false"]
            },
            "sn-nebula-aberration-strength": { default: "0.4" },
            "sn-echo-intensity": {
              default: "2",
              allowedValues: ["0", "1", "2", "3"]
            }
          };
          this.validateAndRepair();
          this.initialized = true;
        }
        async initialize() {
          this.initialized = true;
        }
        async healthCheck() {
          try {
            Spicetify.LocalStorage.get("spicetify-exp-features");
            return { ok: true, details: "LocalStorage is accessible." };
          } catch (e) {
            return {
              ok: false,
              details: "Failed to access Spicetify.LocalStorage.",
              issues: [e.message]
            };
          }
        }
        get(key) {
          try {
            const value = Spicetify.LocalStorage.get(key);
            const schema = this.validationSchemas[key];
            if (!schema) {
              console.warn(`StarryNight: No validation schema for key: ${key}.`);
              return value;
            }
            if (value === null || schema.allowedValues && !schema.allowedValues.includes(value)) {
              return schema.default;
            }
            return value;
          } catch (error) {
            console.error(`StarryNight: Error reading key ${key}:`, error);
            return this.validationSchemas[key]?.default;
          }
        }
        getAllowedValues(key) {
          return this.validationSchemas[key]?.allowedValues;
        }
        set(key, value) {
          try {
            const schema = this.validationSchemas[key];
            if (!schema) {
              Spicetify.LocalStorage.set(key, value);
              return true;
            }
            if (key === "sn-harmonic-manual-base-color") {
              if (value !== "" && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
                return false;
              }
            } else if (schema.allowedValues && !schema.allowedValues.includes(value)) {
              return false;
            }
            Spicetify.LocalStorage.set(key, value);
            document.dispatchEvent(
              new CustomEvent("year3000SystemSettingsChanged", {
                detail: { key, value }
              })
            );
            return true;
          } catch (error) {
            console.error(`StarryNight: Error setting key ${key}:`, error);
            return false;
          }
        }
        getAllSettings() {
          const settings = {};
          for (const key in this.validationSchemas) {
            settings[key] = this.get(key);
          }
          return settings;
        }
        validateAndRepair() {
          let repairedCount = 0;
          for (const key in this.validationSchemas) {
            const aKey = key;
            const currentValue = Spicetify.LocalStorage.get(aKey);
            const validatedValue = this.get(aKey);
            if (currentValue !== validatedValue) {
              this.set(aKey, validatedValue);
              repairedCount++;
            }
          }
          if (repairedCount > 0) {
            console.log(`StarryNight: Repaired ${repairedCount} invalid settings.`);
          }
        }
        resetAllToDefaults() {
          for (const key of Object.keys(this.defaults)) {
            this.set(
              key,
              this.defaults[key]
            );
          }
          console.log("StarryNight: All settings reset to defaults.");
        }
        // To satisfy the SystemHealthMonitor, which expects all registered systems
        // to have these lifecycle methods.
        updateAnimation() {
        }
        destroy() {
          console.log("StarryNight: SettingsManager destroyed (no-op).");
        }
        // === NEW: Harmonic mode helpers ===========================================
        /**
         * Return the full HarmonicMode object for the currently selected mode.
         * Falls back to the default entry ("analogous-flow") if the key is missing.
         */
        getCurrentHarmonicMode() {
          const key = this.get("sn-current-harmonic-mode");
          return this.harmonicModes[key] || this.harmonicModes["analogous-flow"];
        }
        /**
         * Retrieve a HarmonicMode definition by key, or undefined if not found.
         */
        getHarmonicMode(key) {
          return this.harmonicModes[key];
        }
      };
    }
  });

  // src-js/effects/starryNightEffects.ts
  function injectStarContainer() {
    const existingContainer = document.querySelector(
      ".sn-stars-container"
    );
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
  function applyStarryNightSettings(gradientIntensity, starDensity) {
    if (YEAR3000_CONFIG.enableDebug) {
      console.log("[StarryNightEffects] Applying settings:", {
        gradientIntensity,
        starDensity
      });
    }
    const body = document.body;
    const gradientClasses = [
      "sn-gradient-disabled",
      "sn-gradient-minimal",
      "sn-gradient-balanced",
      "sn-gradient-intense"
    ];
    const starClasses = [
      "sn-stars-disabled",
      "sn-stars-minimal",
      "sn-stars-balanced",
      "sn-stars-intense"
    ];
    body.classList.remove(...gradientClasses, ...starClasses);
    if (gradientIntensity !== "balanced") {
      body.classList.add(`sn-gradient-${gradientIntensity}`);
    }
    if (starDensity !== "balanced") {
      body.classList.add(`sn-stars-${starDensity}`);
    }
    const existingContainer = document.querySelector(".sn-stars-container");
    if (starDensity === "disabled") {
      existingContainer?.remove();
    } else {
      if (!existingContainer) {
        injectStarContainer();
      }
    }
  }
  var init_starryNightEffects = __esm({
    "src-js/effects/starryNightEffects.ts"() {
      "use strict";
      init_SettingsManager();
      init_globalConfig();
    }
  });

  // src-js/debug/DragCartographer.ts
  var DragCartographer_exports = {};
  __export(DragCartographer_exports, {
    enableDragCartography: () => enableDragCartography,
    getDragMap: () => getDragMap
  });
  function enableDragCartography() {
    const g2 = globalThis;
    if (g2.__SN_dragCartographer) return;
    g2.__SN_dragCartographer = new DragCartographer();
    console.info("\u{1F6F0}\uFE0F  DragCartographer enabled \u2013 logging dragstart events");
  }
  function getDragMap() {
    return DragCartographer.getDragMap();
  }
  var _DragCartographer, DragCartographer;
  var init_DragCartographer = __esm({
    "src-js/debug/DragCartographer.ts"() {
      "use strict";
      _DragCartographer = class _DragCartographer {
        constructor() {
          this.seen = /* @__PURE__ */ new WeakSet();
          this.handleDragStart = (event) => {
            const target = event.target;
            if (!target) return;
            if (this.seen.has(target)) return;
            this.seen.add(target);
            const selector = _DragCartographer.buildSelectorPath(target);
            const detail = {
              time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
              selector
            };
            try {
              const dt = event.dataTransfer;
              if (dt) {
                const uris = dt.getData("text/spotify") || dt.getData("text/uri-list");
                if (uris) {
                  detail.uris = uris.split(/\n|,/).filter(Boolean);
                }
                const label = dt.getData("text/plain");
                if (label) detail.label = label;
              }
            } catch {
            }
            const agg = _DragCartographer.aggregate;
            const entry = agg.get(selector);
            if (entry) {
              entry.count += 1;
              if (entry.samples.length < 3) entry.samples.push(detail);
            } else {
              agg.set(selector, { selector, count: 1, samples: [detail] });
            }
            console.groupCollapsed(
              `%c[DragCartographer] dragstart \u2192 ${selector}`,
              "color:#7dd3fc;font-weight:600"
            );
            console.table(detail);
            console.log("Event:", event);
            console.log("Target element snapshot:", target);
            console.groupEnd();
          };
          document.addEventListener("dragstart", this.handleDragStart, true);
        }
        static buildSelectorPath(el) {
          const path = [];
          let current = el;
          let depth = 0;
          while (current && depth < _DragCartographer.MAX_PATH_DEPTH) {
            const tag = current.tagName.toLowerCase();
            const id = current.id ? `#${current.id}` : "";
            const cls = current.className && typeof current.className === "string" ? "." + current.className.split(/\s+/).slice(0, 2).join(".") : "";
            path.push(`${tag}${id}${cls}`);
            current = current.parentElement;
            depth += 1;
          }
          return path.join(" > ");
        }
        // Public helper to fetch map
        static getDragMap() {
          return Array.from(_DragCartographer.aggregate.values()).sort(
            (a, b) => b.count - a.count
          );
        }
      };
      _DragCartographer.MAX_PATH_DEPTH = 4;
      _DragCartographer.aggregate = /* @__PURE__ */ new Map();
      DragCartographer = _DragCartographer;
    }
  });

  // src-js/utils/CanvasGhostBuilder.ts
  function buildDragGhostCanvas(label, imgSrc, opts = {}) {
    const key = `${label}|${imgSrc}|${opts.size}|${opts.dpr}`;
    const cached = cache.get(key);
    if (cached) return cached;
    const size = opts.size ?? 72;
    const dpr = opts.dpr ?? (window.devicePixelRatio || 1);
    const borderRadius = opts.borderRadius ?? 8;
    const canvas = document.createElement("canvas");
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "rgba(32,32,35,0.9)";
    ctx.roundRect(0, 0, size, size, borderRadius);
    ctx.fill();
    if (opts.shadow !== false) {
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 6;
    }
    const inner = size - 16;
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      const drawImage = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(8, 8, inner, inner, borderRadius - 2);
        ctx.clip();
        ctx.drawImage(img, 8, 8, inner, inner);
        ctx.restore();
        drawLabel();
      };
      if (img.complete) {
        drawImage();
      } else {
        img.onload = drawImage;
        img.onerror = drawLabel;
      }
    } else {
      drawLabel();
    }
    function drawLabel() {
      ctx.fillStyle = "#fff";
      ctx.font = `500 12px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const maxWidth = size - 10;
      let text = label;
      while (ctx.measureText(text).width > maxWidth && text.length > 4) {
        text = text.slice(0, -2);
      }
      if (text !== label) text = text.slice(0, -1) + "\u2026";
      ctx.fillText(text, size / 2, size - 10);
    }
    cache.set(key, canvas);
    return canvas;
  }
  var cache;
  var init_CanvasGhostBuilder = __esm({
    "src-js/utils/CanvasGhostBuilder.ts"() {
      "use strict";
      cache = /* @__PURE__ */ new Map();
    }
  });

  // src-js/effects/EnhancedDragPreview.ts
  var EnhancedDragPreview_exports = {};
  __export(EnhancedDragPreview_exports, {
    enableEnhancedDragPreview: () => enableEnhancedDragPreview
  });
  function createGhost(label, imgSrc) {
    try {
      return buildDragGhostCanvas(label, imgSrc);
    } catch {
      const div = document.createElement("div");
      div.textContent = label;
      div.style.padding = "4px 6px";
      div.style.fontSize = "12px";
      div.style.background = "rgba(32,32,35,0.9)";
      div.style.color = "#fff";
      return div;
    }
  }
  function extractImageSrc(el) {
    const img = el.querySelector("img[src]");
    if (img?.src) return img.src;
    const bg = getComputedStyle(el).backgroundImage;
    const match = bg && /url\("?([^\"]+)"?\)/.exec(bg);
    return match ? match[1] : void 0;
  }
  function findFallbackLabel(el) {
    const attrLabel = el.getAttribute("aria-label") || el.getAttribute("title");
    if (attrLabel) return attrLabel;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = node.textContent?.trim();
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const n = walker.nextNode();
    return (n?.textContent?.trim() || "").slice(0, 60);
  }
  function getPreviewData(target) {
    if (cache2.has(target)) return cache2.get(target);
    const label = findFallbackLabel(target);
    if (!label) return null;
    const img = extractImageSrc(target);
    const data = { label, img };
    cache2.set(target, data);
    return data;
  }
  function onDragStart(event) {
    try {
      if (!event.dataTransfer || typeof event.dataTransfer.setDragImage !== "function")
        return;
      const target = event.target;
      if (!target) return;
      let label = event.dataTransfer.getData("text/plain");
      let imgSrc;
      if (!label) {
        const data = getPreviewData(target);
        if (!data) return;
        label = data.label;
        imgSrc = data.img;
      } else {
        imgSrc = extractImageSrc(target);
      }
      const ghostEl = createGhost(label, imgSrc);
      document.body.appendChild(ghostEl);
      const offset = ghostEl.offsetWidth / 2;
      event.dataTransfer.setDragImage(ghostEl, offset, offset);
      const cleanup = () => {
        ghostEl.remove();
        window.removeEventListener("dragend", cleanup, true);
      };
      window.addEventListener("dragend", cleanup, true);
    } catch (err) {
      console.debug("[StarryNight] EnhancedDragPreview failed:", err);
    }
  }
  function enableEnhancedDragPreview(opts = {}) {
    const g2 = globalThis;
    if (g2.__SN_enhancedDragPreview) return;
    g2.__SN_enhancedDragPreview = true;
    Object.assign(DEFAULT_OPTS, opts);
    document.addEventListener("dragstart", onDragStart, true);
    console.info("\u{1F320} Enhanced drag preview enabled");
  }
  var DEFAULT_OPTS, cache2;
  var init_EnhancedDragPreview = __esm({
    "src-js/effects/EnhancedDragPreview.ts"() {
      "use strict";
      init_CanvasGhostBuilder();
      DEFAULT_OPTS = {
        size: 72,
        borderRadius: 8,
        fontSize: 12
      };
      cache2 = /* @__PURE__ */ new WeakMap();
    }
  });

  // src-js/utils/flipSpring.ts
  function spring(config) {
    const k = config.stiffness ?? 260;
    const d = config.damping ?? 24;
    const m = config.mass ?? 1;
    let current = {};
    let velocity = {};
    let target = {};
    let animId = null;
    function step() {
      let done = true;
      const dt = 1 / 60;
      for (const key in target) {
        const x = current[key] ?? 0;
        const v = velocity[key] ?? 0;
        const goal = target[key] ?? 0;
        const Fspring = -k * (x - goal);
        const Fdamp = -d * v;
        const a = (Fspring + Fdamp) / m;
        const newV = v + a * dt;
        const newX = x + newV * dt;
        velocity[key] = newV;
        current[key] = newX;
        if (Math.abs(newV) > 0.1 || Math.abs(newX - goal) > 0.1) done = false;
      }
      config.onUpdate(current);
      if (!done) animId = requestAnimationFrame(step);
    }
    return {
      to(newTarget) {
        target = newTarget;
        if (!animId) animId = requestAnimationFrame(step);
      }
    };
  }
  var init_flipSpring = __esm({
    "src-js/utils/flipSpring.ts"() {
      "use strict";
      window.snFlipSpringLoaded = true;
    }
  });

  // src-js/utils/sidebarDetector.ts
  function querySidebar() {
    const node = document.querySelector(SIDEBAR_SELECTOR);
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    return { node, rect };
  }
  function isSidebarCloneCapable() {
    const hasSidebar = !!querySidebar();
    const canClone = typeof Element.prototype.cloneNode === "function";
    const springReady = !!window.snFlipSpringLoaded;
    return hasSidebar && canClone && springReady;
  }
  var SIDEBAR_SELECTOR;
  var init_sidebarDetector = __esm({
    "src-js/utils/sidebarDetector.ts"() {
      "use strict";
      SIDEBAR_SELECTOR = '[data-testid="rootlist-container"]';
    }
  });

  // src-js/effects/SidebarCloneOverlay.ts
  var SidebarCloneOverlay_exports = {};
  __export(SidebarCloneOverlay_exports, {
    destroySidebarClone: () => destroySidebarClone,
    launchSidebarClone: () => launchSidebarClone
  });
  function launchSidebarClone(context) {
    if (activeClone) return;
    const sidebar = querySidebar();
    if (!sidebar) return;
    const clone = sidebar.node.cloneNode(true);
    clone.id = "";
    clone.setAttribute("aria-hidden", "true");
    clone.classList.add("sn-clone-overlay");
    clone.style.position = "fixed";
    clone.style.top = `${sidebar.rect.top}px`;
    clone.style.left = `${sidebar.rect.left}px`;
    clone.style.width = `${sidebar.rect.width}px`;
    clone.style.height = `${sidebar.rect.height}px`;
    clone.style.zIndex = "9999";
    clone.style.willChange = "transform, opacity";
    clone.style.contain = "paint";
    document.body.appendChild(clone);
    activeClone = clone;
    const firstX = 0;
    const firstY = 0;
    const firstS = 1;
    const lastX = context.cursorX - sidebar.rect.left - sidebar.rect.width * 0.2;
    const lastY = context.cursorY - sidebar.rect.top - sidebar.rect.height * 0.2;
    const lastS = 0.6;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      clone.style.transform = `translate(${lastX}px, ${lastY}px) scale(${lastS})`;
      pruneCloneItems(clone, context);
      return;
    }
    const anim = spring({
      stiffness: 220,
      damping: 20,
      onUpdate: (v) => {
        clone.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
      }
    });
    clone.style.transformOrigin = "top left";
    clone.style.transform = `translate(${firstX}px, ${firstY}px) scale(${firstS})`;
    requestAnimationFrame(() => anim.to({ x: lastX, y: lastY, s: lastS }));
    setTimeout(() => {
      if (activeClone) pruneCloneItems(activeClone, context);
    }, 400);
  }
  function destroySidebarClone() {
    cleanupFns.forEach((fn) => fn());
    cleanupFns.length = 0;
    if (activeClone) {
      activeClone.remove();
      activeClone = null;
    }
  }
  function addTracksToPlaylist(uri, trackUris) {
    try {
      const Cosmos = window.Spicetify?.CosmosAsync;
      if (!Cosmos) return;
      const endpoint = `/v1/playlists/${uri.split(":").pop()}/tracks`;
      Cosmos.post(endpoint, { uris: trackUris });
    } catch {
    }
  }
  function pruneCloneItems(root, context) {
    const all = Array.from(
      root.querySelectorAll('[data-uri^="spotify:playlist:"]')
    );
    if (!all.length) return;
    const keep = all.slice(0, 5);
    all.slice(5).forEach((el) => {
      el.classList.add("sn-prune-out");
      setTimeout(() => el.remove(), 180);
    });
    keep.forEach((el, idx) => {
      el.setAttribute("data-index", String(idx + 1));
      el.setAttribute("role", "button");
      el.tabIndex = 0;
      el.style.setProperty("--sn-glow-level", "0");
      el.style.backgroundImage = "paint(sn-aura)";
      el.addEventListener(
        "mouseenter",
        () => el.style.setProperty("--sn-glow-level", "1")
      );
      el.addEventListener(
        "mouseleave",
        () => el.style.setProperty("--sn-glow-level", "0")
      );
      const uriVal = el.getAttribute("data-uri");
      if (!uriVal) {
        return;
      }
      const trackUris = context.uris;
      const clickHandler = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const img = el.querySelector("img");
        pushRecentPlaylist(
          uriVal,
          img?.src || "",
          el.textContent?.trim() || "Playlist"
        );
        addTracksToPlaylist(uriVal, trackUris);
        announce("Track added to " + (el.textContent?.trim() || "playlist"));
        destroySidebarClone();
      };
      el.addEventListener("click", clickHandler);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          clickHandler(e);
        }
      });
    });
    const keyListener = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= keep.length) {
        keep[n - 1]?.click();
      }
    };
    window.addEventListener("keydown", keyListener, { capture: true });
    cleanupFns.push(
      () => window.removeEventListener("keydown", keyListener, { capture: true })
    );
  }
  function pushRecentPlaylist(uri, image, name) {
    try {
      const raw = localStorage.getItem(MRU_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const existing = list.findIndex((p) => p.uri === uri);
      if (existing !== -1) list.splice(existing, 1);
      list.unshift({ uri, image, name });
      localStorage.setItem(MRU_KEY, JSON.stringify(list.slice(0, 10)));
    } catch {
    }
  }
  function announce(message) {
    const live = document.getElementById("sn-live");
    if (live) live.textContent = message;
  }
  var activeClone, cleanupFns, MRU_KEY;
  var init_SidebarCloneOverlay = __esm({
    "src-js/effects/SidebarCloneOverlay.ts"() {
      "use strict";
      init_flipSpring();
      init_sidebarDetector();
      activeClone = null;
      cleanupFns = [];
      MRU_KEY = "sn-recent-playlists";
    }
  });

  // src-js/effects/QuickAddRadialMenu.ts
  var QuickAddRadialMenu_exports = {};
  __export(QuickAddRadialMenu_exports, {
    enableQuickAddRadialMenu: () => enableQuickAddRadialMenu
  });
  function ensureLiveRegion() {
    let live = document.getElementById(LIVE_ID);
    if (!live) {
      live = document.createElement("div");
      live.id = LIVE_ID;
      live.setAttribute("aria-live", "polite");
      live.style.position = "absolute";
      live.style.width = "1px";
      live.style.height = "1px";
      live.style.overflow = "hidden";
      live.style.clipPath = "inset(100%)";
      live.style.clip = "rect(1px,1px,1px,1px)";
      live.style.whiteSpace = "nowrap";
      document.body.appendChild(live);
    }
    return live;
  }
  function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function fetchRecentPlaylists() {
    try {
      const raw = localStorage.getItem("sn-recent-playlists");
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr.slice(0, MAX_PLAYLISTS_SHOWN) : [];
    } catch {
      return [];
    }
  }
  function addTracksToPlaylist2(playlistUri, trackUris) {
    try {
      const endpoint = `/v1/playlists/${playlistUri.split(":").pop()}/tracks`;
      window.Spicetify?.CosmosAsync.post(endpoint, {
        uris: trackUris
      });
    } catch (e) {
      console.warn("[StarryNight] QuickAddRadial failed to add tracks:", e);
    }
  }
  function pushRecentPlaylist2(pl) {
    try {
      const list = fetchRecentPlaylists();
      const existingIdx = list.findIndex((p) => p.uri === pl.uri);
      if (existingIdx !== -1) list.splice(existingIdx, 1);
      list.unshift(pl);
      const trimmed = list.slice(0, 10);
      localStorage.setItem("sn-recent-playlists", JSON.stringify(trimmed));
    } catch {
    }
  }
  function createOverlay(x, y, playlists) {
    if (!playlists.length) return;
    destroyOverlay();
    overlayEl = document.createElement("div");
    overlayEl.className = "sn-quick-add-overlay";
    overlayEl.style.position = "fixed";
    overlayEl.style.inset = "0";
    overlayEl.style.pointerEvents = "none";
    overlayEl.style.zIndex = "9999";
    const center = document.createElement("div");
    center.className = "sn-quick-add-center";
    center.style.position = "absolute";
    center.style.left = `${x}px`;
    center.style.top = `${y}px`;
    center.style.width = "0";
    center.style.height = "0";
    overlayEl.appendChild(center);
    document.body.appendChild(overlayEl);
    const radius = 90;
    const angleStep = Math.PI * 2 / playlists.length;
    playlists.forEach((pl, idx) => {
      const angle = angleStep * idx - Math.PI / 2;
      const btn = document.createElement("button");
      btn.className = "sn-quick-add-btn";
      btn.style.position = "absolute";
      btn.style.width = "64px";
      btn.style.height = "64px";
      btn.style.borderRadius = "50%";
      btn.style.border = "2px solid rgba(255,255,255,0.4)";
      btn.style.background = `url('${pl.image}') center/cover no-repeat`;
      btn.style.cursor = "pointer";
      btn.style.pointerEvents = "auto";
      const cx = radius * Math.cos(angle);
      const cy = radius * Math.sin(angle);
      btn.style.transform = `translate(${cx - 32}px, ${cy - 32}px)`;
      btn.style.transformOrigin = "center center";
      const firstX = 0;
      const firstY = 0;
      btn.style.transform = `translate(${firstX}px, ${firstY}px) scale(0.1)`;
      requestAnimationFrame(() => {
        const animator = spring({
          stiffness: 220,
          damping: 20,
          onUpdate: (v) => {
            btn.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.s})`;
          }
        });
        animator.to({ x: cx - 32, y: cy - 32, s: 1 });
      });
      btn.style.setProperty("--sn-glow-level", "0");
      btn.style.backgroundImage = `paint(sn-aura)`;
      btn.addEventListener(
        "mouseenter",
        () => btn.style.setProperty("--sn-glow-level", "1")
      );
      btn.addEventListener(
        "mouseleave",
        () => btn.style.setProperty("--sn-glow-level", "0")
      );
      btn.title = `Add to ${pl.name}`;
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (currentDragDataUris) addTracksToPlaylist2(pl.uri, currentDragDataUris);
        pushRecentPlaylist2(pl);
        destroyOverlay();
      });
      center.appendChild(btn);
    });
    const live = ensureLiveRegion();
    live.textContent = "Quick-add menu open. Press number keys 1 to 5 to pick a playlist or continue dragging.";
  }
  function destroyOverlay() {
    overlayEl?.remove();
    overlayEl = null;
    const live = document.getElementById(LIVE_ID);
    if (live) live.textContent = "";
  }
  function clearHoldTimer() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }
  function onDragStart2(e) {
    startX = e.clientX;
    startY = e.clientY;
    currentDragDataUris = (e.dataTransfer?.getData("text/spotify") || "").split(/[\n,]/).filter(Boolean);
    const cloneCapable = isSidebarCloneCapable();
    clearHoldTimer();
    holdTimer = window.setTimeout(async () => {
      if (cloneCapable) {
        const overlay = await Promise.resolve().then(() => (init_SidebarCloneOverlay(), SidebarCloneOverlay_exports));
        overlay.launchSidebarClone({
          cursorX: currentPointer.x,
          cursorY: currentPointer.y,
          uris: currentDragDataUris ?? []
        });
      } else {
        const playlists = await getRadialPlaylists();
        createOverlay(startX, startY, playlists);
      }
    }, HOLD_MS);
  }
  function onDragEnd() {
    clearHoldTimer();
    destroyOverlay();
    currentDragDataUris = null;
  }
  function onPointerMove(e) {
    currentPointer = { x: e.clientX, y: e.clientY };
    if (!holdTimer) return;
    if (distance(startX, startY, e.clientX, e.clientY) > MOVE_THRESHOLD) {
      clearHoldTimer();
    }
  }
  async function fetchPlaylistsFromAPI() {
    try {
      const Cosmos = window.Spicetify?.CosmosAsync;
      if (!Cosmos) return [];
      const resp = await Cosmos.get(
        "https://api.spotify.com/v1/me/playlists?limit=10"
      );
      if (!resp?.items) return [];
      return resp.items.slice(0, MAX_PLAYLISTS_SHOWN).map((pl) => ({
        uri: pl.uri,
        name: pl.name,
        image: pl.images?.[0]?.url || ""
      }));
    } catch {
      return [];
    }
  }
  function scrapeSidebarPlaylists() {
    try {
      const items = Array.from(
        document.querySelectorAll('[data-testid="rootlist-card"]')
      );
      const res = [];
      for (const el of items) {
        const uri = el.getAttribute("data-uri") || el.querySelector("a")?.getAttribute("href")?.replace("/playlist/", "spotify:playlist:");
        if (!uri) continue;
        const img = el.querySelector("img");
        const image = img?.src || "";
        const name = img?.alt || el.textContent?.trim() || "Playlist";
        res.push({ uri, image, name });
        if (res.length >= MAX_PLAYLISTS_SHOWN) break;
      }
      return res;
    } catch {
      return [];
    }
  }
  async function getRadialPlaylists() {
    const local = fetchRecentPlaylists();
    if (local.length) return local;
    const sidebar = scrapeSidebarPlaylists();
    if (sidebar.length) return sidebar;
    const api = await fetchPlaylistsFromAPI();
    return api;
  }
  function enableQuickAddRadialMenu() {
    const g2 = globalThis;
    if (g2.__SN_quickAddRadial) return;
    g2.__SN_quickAddRadial = true;
    window.addEventListener("dragstart", onDragStart2, true);
    window.addEventListener("dragend", onDragEnd, true);
    window.addEventListener("pointermove", onPointerMove, true);
    console.info("\u{1F30C} Quick-Add radial menu enabled");
    console.info(
      `[StarryNight] Sidebar clone capability: ${isSidebarCloneCapable()}`
    );
    const anyCSS = CSS;
    if (anyCSS && anyCSS.paintWorklet) {
      try {
        const auraUrl = "worklets/quickAddAura.js";
        if (!anyCSS._sn_aura_registered) {
          anyCSS.paintWorklet.addModule(auraUrl).then(() => {
            anyCSS._sn_aura_registered = true;
          }).catch(() => {
          });
        }
      } catch {
      }
    }
  }
  var HOLD_MS, MOVE_THRESHOLD, MAX_PLAYLISTS_SHOWN, holdTimer, startX, startY, overlayEl, currentDragDataUris, currentPointer, LIVE_ID;
  var init_QuickAddRadialMenu = __esm({
    "src-js/effects/QuickAddRadialMenu.ts"() {
      "use strict";
      init_flipSpring();
      init_sidebarDetector();
      HOLD_MS = 250;
      MOVE_THRESHOLD = 8;
      MAX_PLAYLISTS_SHOWN = 5;
      holdTimer = null;
      startX = 0;
      startY = 0;
      overlayEl = null;
      currentDragDataUris = null;
      currentPointer = { x: 0, y: 0 };
      LIVE_ID = "sn-live";
      document.addEventListener("keydown", (e) => {
        if (!overlayEl) return;
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= MAX_PLAYLISTS_SHOWN) {
          const btn = overlayEl.querySelectorAll(".sn-quick-add-btn")[num - 1];
          btn?.click();
        }
      });
    }
  });

  // src-js/utils/SettingsSection.tsx
  var import_react, import_react_dom, SettingsSection;
  var init_SettingsSection = __esm({
    "src-js/utils/SettingsSection.tsx"() {
      "use strict";
      import_react = __toESM(__require("react"));
      import_react_dom = __toESM(__require("react-dom"));
      SettingsSection = class {
        constructor(name, settingsId, initialSettingsFields = {}) {
          this.name = name;
          this.settingsId = settingsId;
          this.initialSettingsFields = initialSettingsFields;
          this.settingsFields = this.initialSettingsFields;
          this.setRerender = null;
          /** Mounts the section when the user visits the Spotify settings route */
          this.pushSettings = async () => {
            Object.entries(this.settingsFields).forEach(([nameId, field]) => {
              if (field.type !== "button" && this.getFieldValue(nameId) === void 0) {
                this.setFieldValue(nameId, field.defaultValue);
              }
            });
            while (!window.Spicetify?.Platform?.History?.listen) {
              await new Promise((r) => setTimeout(r, 100));
            }
            if (this.stopHistoryListener) this.stopHistoryListener();
            this.stopHistoryListener = window.Spicetify.Platform.History.listen((e) => {
              if (e.pathname === "/preferences") this.render();
            });
            if (window.Spicetify.Platform.History.location.pathname === "/preferences") {
              await this.render();
            }
          };
          this.rerender = () => {
            this.setRerender?.(Math.random());
          };
          /* ----------------------- field creators ---------------------------- */
          this.addDropDown = (nameId, description, options, defaultIndex, _onSelect, events) => {
            this.settingsFields[nameId] = {
              type: "dropdown",
              description,
              defaultValue: options[defaultIndex],
              options,
              events
            };
          };
          /** Toggle (checkbox) */
          this.addToggle = (nameId, description, defaultValue, events) => {
            this.settingsFields[nameId] = {
              type: "toggle",
              description,
              defaultValue,
              events
            };
          };
          /** Text / number / color input */
          this.addInput = (nameId, description, defaultValue, inputType = "text", events) => {
            this.settingsFields[nameId] = {
              type: "input",
              description,
              defaultValue,
              inputType,
              events
            };
          };
          this.getFieldValue = (nameId) => {
            return JSON.parse(
              window.Spicetify?.LocalStorage.get(this.storageKey(nameId)) || "null"
            )?.value;
          };
          /* ---------------------- React wrappers ----------------------------- */
          this.FieldsContainer = () => {
            const [nonce, setNonce] = (0, import_react.useState)(0);
            this.setRerender = setNonce;
            return /* @__PURE__ */ import_react.default.createElement("div", { className: "x-settings-section", key: nonce }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "TypeElement-cello-textBase-type" }, this.name), Object.entries(this.settingsFields).map(([nameId, field]) => /* @__PURE__ */ import_react.default.createElement(this.Field, { key: nameId, nameId, field })));
          };
          this.Field = ({
            nameId,
            field
          }) => {
            const id = `${this.settingsId}.${nameId}`;
            const initial = field.type === "button" ? field.value : this.getFieldValue(nameId) ?? field.defaultValue;
            const [value, setVal] = (0, import_react.useState)(initial);
            const setValue = (v) => {
              setVal(v);
              this.setFieldValue(nameId, v);
            };
            if (field.type === "hidden") return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
            const Label = /* @__PURE__ */ import_react.default.createElement("label", { className: "TypeElement-viola-textSubdued-type", htmlFor: id }, field.description || "");
            let Control = null;
            switch (field.type) {
              case "dropdown":
                Control = /* @__PURE__ */ import_react.default.createElement(
                  "select",
                  {
                    className: "main-dropDown-dropDown",
                    id,
                    ...field.events,
                    onChange: (e) => {
                      const idx = e.currentTarget.selectedIndex;
                      const newVal = field.options[idx];
                      setValue(newVal);
                      field.events?.onChange?.(e);
                    }
                  },
                  field.options.map((opt, i) => /* @__PURE__ */ import_react.default.createElement("option", { key: opt, value: opt, selected: opt === value }, opt))
                );
                break;
              case "toggle":
                Control = /* @__PURE__ */ import_react.default.createElement("label", { className: "x-settings-secondColumn x-toggle-wrapper" }, /* @__PURE__ */ import_react.default.createElement(
                  "input",
                  {
                    id,
                    className: "x-toggle-input",
                    type: "checkbox",
                    checked: !!value,
                    ...field.events,
                    onClick: (e) => {
                      const checked = e.currentTarget.checked;
                      setValue(checked);
                      field.events?.onClick?.(e);
                    }
                  }
                ), /* @__PURE__ */ import_react.default.createElement("span", { className: "x-toggle-indicatorWrapper" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "x-toggle-indicator" })));
                break;
              case "input":
                Control = /* @__PURE__ */ import_react.default.createElement(
                  "input",
                  {
                    className: "x-settings-input",
                    id,
                    dir: "ltr",
                    value,
                    type: field.inputType || "text",
                    ...field.events,
                    onChange: (e) => {
                      setValue(e.currentTarget.value);
                      field.events?.onChange?.(e);
                    }
                  }
                );
                break;
              case "button":
                Control = /* @__PURE__ */ import_react.default.createElement(
                  "button",
                  {
                    id,
                    className: "Button-sc-y0gtbx-0 Button-small-buttonSecondary-useBrowserDefaultFocusStyle x-settings-button",
                    ...field.events,
                    onClick: (e) => {
                      field.events?.onClick?.(e);
                    },
                    type: "button"
                  },
                  value
                );
                break;
              default:
                Control = null;
            }
            return /* @__PURE__ */ import_react.default.createElement("div", { className: "x-settings-row" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "x-settings-firstColumn" }, Label), /* @__PURE__ */ import_react.default.createElement("div", { className: "x-settings-secondColumn" }, Control));
          };
        }
        /* --------------------- internal render helpers --------------------- */
        async render() {
          while (!document.getElementById("desktop.settings.selectLanguage")) {
            if (window.Spicetify.Platform.History.location.pathname !== "/preferences")
              return;
            await new Promise((r) => setTimeout(r, 100));
          }
          const container = document.querySelector(
            ".main-view-container__scroll-node-child main div"
          );
          if (!container)
            return console.error("[StarryNight] settings container not found");
          let host = Array.from(container.children).find(
            (c) => c.id === this.settingsId
          );
          if (!host) {
            host = document.createElement("div");
            host.id = this.settingsId;
            container.appendChild(host);
          }
          import_react_dom.default.render(/* @__PURE__ */ import_react.default.createElement(this.FieldsContainer, null), host);
        }
        /* ----- generic storage helpers (use Spicetify.LocalStorage) -------- */
        storageKey(nameId) {
          return `${this.settingsId}.${nameId}`;
        }
        setFieldValue(nameId, newValue) {
          window.Spicetify?.LocalStorage.set(
            this.storageKey(nameId),
            JSON.stringify({ value: newValue })
          );
        }
      };
    }
  });

  // src-js/components/StarryNightSettings.ts
  var StarryNightSettings_exports = {};
  __export(StarryNightSettings_exports, {
    initializeStarryNightSettings: () => initializeStarryNightSettings
  });
  async function initializeStarryNightSettings() {
    const section = new SettingsSection(
      "StarryNight Theme",
      "starrynight-settings"
    );
    const accentOptions = [
      "dynamic",
      // 🎨 Album-based accent (Year 3000)
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
      "lavender"
    ];
    function getSettingsManager() {
      const existing = window.Y3K?.system?.settingsManager;
      if (existing) return existing;
      const cached = globalThis.__SN_settingsManager;
      if (cached) return cached;
      const manager = new SettingsManager();
      globalThis.__SN_settingsManager = manager;
      return manager;
    }
    const settingsManager = getSettingsManager();
    const currentAccent = settingsManager.get("catppuccin-accentColor");
    section.addDropDown(
      "catppuccin-accentColor",
      // settings key (nameId)
      "Accent colour",
      // user-visible label
      accentOptions,
      // option list
      Math.max(0, accentOptions.indexOf(currentAccent)),
      // default index
      void 0,
      // onSelect (unused – we use onChange)
      {
        onChange: (e) => {
          try {
            const idx = e?.currentTarget?.selectedIndex ?? 0;
            const newAccent = accentOptions[idx] ?? "mauve";
            settingsManager.set("catppuccin-accentColor", newAccent);
            const grad = settingsManager.get("sn-gradient-intensity");
            const stars = settingsManager.get("sn-star-density");
            applyStarryNightSettings(grad, stars);
            try {
              globalThis.Y3K?.system?.applyInitialSettings?.();
            } catch (applyErr) {
              console.warn(
                "[StarryNight] Unable to trigger Year3000System colour refresh",
                applyErr
              );
            }
          } catch (err) {
            console.error("[StarryNight] Failed to update accent colour", err);
          }
        }
      }
    );
    const intensityOptions = [
      "disabled",
      "minimal",
      "balanced",
      "intense"
    ];
    const currentGradient = settingsManager.get("sn-gradient-intensity");
    section.addDropDown(
      "sn-gradient-intensity",
      "Gradient intensity",
      intensityOptions,
      Math.max(0, intensityOptions.indexOf(currentGradient)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const newGrad = intensityOptions[idx] ?? "balanced";
          settingsManager.set("sn-gradient-intensity", newGrad);
          const stars = settingsManager.get("sn-star-density");
          applyStarryNightSettings(newGrad, stars);
        }
      }
    );
    const currentStars = settingsManager.get("sn-star-density");
    section.addDropDown(
      "sn-star-density",
      "Star density",
      intensityOptions,
      Math.max(0, intensityOptions.indexOf(currentStars)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const newStars = intensityOptions[idx] ?? "balanced";
          settingsManager.set("sn-star-density", newStars);
          const grad = settingsManager.get("sn-gradient-intensity");
          applyStarryNightSettings(grad, newStars);
        }
      }
    );
    const flavourOptions = ["latte", "frappe", "macchiato", "mocha"];
    const currentFlavor = settingsManager.get("catppuccin-flavor");
    section.addDropDown(
      "catppuccin-flavor",
      "Catppuccin flavour",
      flavourOptions,
      Math.max(0, flavourOptions.indexOf(currentFlavor)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          settingsManager.set("catppuccin-flavor", flavourOptions[idx]);
          globalThis.Y3K?.system?.applyInitialSettings?.();
        }
      }
    );
    const glassOptions = ["disabled", "minimal", "moderate", "intense"];
    const currentGlass = settingsManager.get("sn-glassmorphism-level");
    section.addDropDown(
      "sn-glassmorphism-level",
      "Glassmorphism",
      glassOptions,
      Math.max(0, glassOptions.indexOf(currentGlass)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          settingsManager.set("sn-glassmorphism-level", glassOptions[idx]);
        }
      }
    );
    const fx3dOptions = ["full", "minimal", "disabled"];
    const current3d = settingsManager.get("sn-3d-effects-level");
    section.addDropDown(
      "sn-3d-effects-level",
      "3D card effects",
      fx3dOptions,
      Math.max(0, fx3dOptions.indexOf(current3d)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          settingsManager.set("sn-3d-effects-level", fx3dOptions[idx]);
        }
      }
    );
    const artisticOptions = [
      "corporate-safe",
      "artist-vision",
      "cosmic-maximum"
    ];
    const currentArtistic = settingsManager.get("sn-artistic-mode");
    section.addDropDown(
      "sn-artistic-mode",
      "Artistic mode",
      artisticOptions,
      Math.max(0, artisticOptions.indexOf(currentArtistic)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const mode = artisticOptions[idx];
          settingsManager.set("sn-artistic-mode", mode);
          globalThis.year3000System?.YEAR3000_CONFIG?.safeSetArtisticMode?.(mode);
        }
      }
    );
    const harmonicModes = Object.keys(HARMONIC_MODES);
    const currentHarmMode = settingsManager.get("sn-current-harmonic-mode");
    if (harmonicModes.length) {
      section.addDropDown(
        "sn-current-harmonic-mode",
        "Harmonic colour mode",
        harmonicModes,
        Math.max(0, harmonicModes.indexOf(currentHarmMode)),
        void 0,
        {
          onChange: (e) => {
            const idx = e?.currentTarget?.selectedIndex ?? 0;
            const modeKey = harmonicModes[idx];
            settingsManager.set("sn-current-harmonic-mode", modeKey);
            globalThis.Y3K?.system?.evolveHarmonicSignature?.(modeKey);
          }
        }
      );
    }
    const currentHarmInt = settingsManager.get("sn-harmonic-intensity") || "0.7";
    section.addInput(
      "sn-harmonic-intensity",
      "Harmonic intensity (0-1)",
      currentHarmInt,
      "number",
      {
        onChange: (e) => {
          const val = e.currentTarget.value;
          settingsManager.set("sn-harmonic-intensity", val);
        }
      }
    );
    const currentEvolution = settingsManager.get("sn-harmonic-evolution") === "true";
    section.addToggle(
      "sn-harmonic-evolution",
      "Allow harmonic evolution",
      currentEvolution,
      {
        onClick: (e) => {
          const checked = e.currentTarget.checked;
          settingsManager.set(
            "sn-harmonic-evolution",
            checked ? "true" : "false"
          );
        }
      }
    );
    const currentManual = settingsManager.get("sn-harmonic-manual-base-color") || "#ffffff";
    section.addInput(
      "sn-harmonic-manual-base-color",
      "Manual base colour",
      currentManual,
      "color",
      {
        onChange: (e) => {
          const val = e.currentTarget.value;
          settingsManager.set("sn-harmonic-manual-base-color", val);
          globalThis.Y3K?.system?.updateHarmonicBaseColor?.(val);
        }
      }
    );
    const enableGpu = settingsManager.get("sn-enable-webgpu") === "true";
    section.addToggle(
      "sn-enable-webgpu",
      "Enable WebGPU acceleration (experimental)",
      enableGpu,
      {
        onClick: (e) => {
          const checked = e.currentTarget.checked;
          settingsManager.set(
            "sn-enable-webgpu",
            checked ? "true" : "false"
          );
          console.info("[StarryNight] WebGPU setting changed \u2013 reload required");
        }
      }
    );
    const enableAb = settingsManager.get("sn-enable-aberration") === "true";
    section.addToggle(
      "sn-enable-aberration",
      "Chromatic aberration effect",
      enableAb,
      {
        onClick: (e) => {
          const checked = e.currentTarget.checked;
          settingsManager.set(
            "sn-enable-aberration",
            checked ? "true" : "false"
          );
        }
      }
    );
    const echoOptions = ["Off", "Subtle", "Balanced", "Intense"];
    const currentEcho = settingsManager.get("sn-echo-intensity") ?? "2";
    section.addDropDown(
      "sn-echo-intensity",
      "Temporal Echo Intensity",
      echoOptions,
      Math.min(3, parseInt(currentEcho, 10)),
      void 0,
      {
        onChange: (e) => {
          const idx = e?.currentTarget?.selectedIndex ?? 2;
          settingsManager.set("sn-echo-intensity", `${idx}`);
        }
      }
    );
    await section.pushSettings();
    console.log("\u2728 [StarryNight] spcr-settings panel initialised");
    const rerender = () => section.rerender();
    const history = globalThis.Spicetify?.Platform?.History;
    try {
      if (history?.listen) {
        history.listen(({ location }) => {
          if (location?.pathname === "/settings") {
            setTimeout(rerender, 100);
          }
        });
      }
    } catch (err) {
      console.warn("[StarryNight] Could not hook navigation for settings", err);
    }
    if (window.location.pathname === "/settings") {
      setTimeout(rerender, 300);
    }
  }
  var init_StarryNightSettings = __esm({
    "src-js/components/StarryNightSettings.ts"() {
      "use strict";
      init_globalConfig();
      init_starryNightEffects();
      init_SettingsManager();
      init_SettingsSection();
    }
  });

  // src-js/theme.entry.ts
  init_globalConfig();

  // src-js/core/year3000System.ts
  init_globalConfig();

  // src-js/config/settingKeys.ts
  var GLASS_LEVEL_KEY = "sn-glassmorphism-level";
  var GLASS_LEVEL_OLD_KEY = "sn-glassmorphismIntensity";
  var CARD_3D_LEVEL_KEY = "sn-3d-effects-level";
  var ARTISTIC_MODE_KEY = "sn-artistic-mode";
  var HARMONIC_MODE_KEY = "sn-current-harmonic-mode";
  var HARMONIC_INTENSITY_KEY = "sn-harmonic-intensity";
  var HARMONIC_EVOLUTION_KEY = "sn-harmonic-evolution";
  var MANUAL_BASE_COLOR_KEY = "sn-harmonic-manual-base-color";
  var NEBULA_INTENSITY_KEY = "sn-nebula-intensity";

  // src-js/core/CSSVariableBatcher.ts
  var CSSVariableBatcher = class {
    constructor(config = {}) {
      this.config = {
        batchIntervalMs: config.batchIntervalMs ?? 16,
        // ~60 fps batch rate
        maxBatchSize: config.maxBatchSize ?? 50,
        enableDebug: config.enableDebug ?? false,
        useCssTextFastPath: config.useCssTextFastPath ?? false,
        ...config
      };
      this._cssVariableBatcher = {
        pendingUpdates: /* @__PURE__ */ new Map(),
        batchTimeout: null,
        batchIntervalMs: this.config.batchIntervalMs,
        maxBatchSize: this.config.maxBatchSize,
        totalUpdates: 0,
        batchCount: 0,
        enabled: true
      };
      this._performanceMetrics = {
        totalBatches: 0,
        totalUpdates: 0,
        totalBatchTime: 0,
        maxBatchTime: 0,
        averageBatchSize: 0,
        overBudgetBatches: 0
      };
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Initialized");
      }
    }
    queueCSSVariableUpdate(property, value, element = null) {
      const target = element || document.documentElement;
      if (!this._cssVariableBatcher.enabled) {
        target.style.setProperty(property, value);
        return;
      }
      const elementKey = element ? `element_${element.id || element.className || "unnamed"}` : "root";
      const updateKey = `${elementKey}:${property}`;
      this._cssVariableBatcher.pendingUpdates.set(updateKey, {
        element: target,
        property,
        value,
        timestamp: performance.now()
      });
      this._cssVariableBatcher.totalUpdates++;
      this._performanceMetrics.totalUpdates++;
      if (!this._cssVariableBatcher.batchTimeout) {
        this._cssVariableBatcher.batchTimeout = setTimeout(() => {
          this._processCSSVariableBatch();
        }, this._cssVariableBatcher.batchIntervalMs);
      }
      if (this._cssVariableBatcher.pendingUpdates.size >= this._cssVariableBatcher.maxBatchSize) {
        this.flushCSSVariableBatch();
      }
    }
    _processCSSVariableBatch() {
      if (this._cssVariableBatcher.pendingUpdates.size === 0) {
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
        for (const update of updates) {
          if (!updatesByElement.has(update.element)) {
            updatesByElement.set(update.element, []);
          }
          updatesByElement.get(update.element).push(update);
        }
        for (const [element, elementUpdates] of updatesByElement.entries()) {
          if (elementUpdates.length > 3 && this.config.useCssTextFastPath) {
            let cssText = element.style.cssText;
            for (const update of elementUpdates) {
              const propertyPattern = new RegExp(
                `${update.property.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                )}:[^;]*;?`,
                "g"
              );
              cssText = cssText.replace(propertyPattern, "");
              cssText += `${update.property}:${update.value};`;
            }
            element.style.cssText = cssText;
          } else {
            for (const update of elementUpdates) {
              element.style.setProperty(update.property, update.value);
            }
          }
        }
        this._cssVariableBatcher.batchCount++;
        this._performanceMetrics.totalBatches++;
        const batchTime = performance.now() - startTime;
        this._updatePerformanceMetrics(batchTime, updates.length);
        if (this.config.enableDebug && Math.random() < 0.1) {
          console.log(
            `\u{1F3A8} [CSSVariableBatcher] Processed CSS batch: ${updates.length} updates in ${batchTime.toFixed(2)}ms`
          );
        }
      } catch (error) {
        console.error(
          "[CSSVariableBatcher] Error processing CSS variable batch:",
          error
        );
        for (const update of updates) {
          try {
            update.element.style.setProperty(update.property, update.value);
          } catch (e) {
            console.warn(
              `[CSSVariableBatcher] Failed to apply CSS property ${update.property}:`,
              e
            );
          }
        }
      }
    }
    _updatePerformanceMetrics(batchTime, batchSize) {
      this._performanceMetrics.totalBatchTime += batchTime;
      this._performanceMetrics.maxBatchTime = Math.max(
        this._performanceMetrics.maxBatchTime,
        batchTime
      );
      this._performanceMetrics.averageBatchSize = (this._performanceMetrics.averageBatchSize * (this._performanceMetrics.totalBatches - 1) + batchSize) / this._performanceMetrics.totalBatches;
      if (batchTime > 8) {
        this._performanceMetrics.overBudgetBatches++;
        if (this.config.enableDebug) {
          console.warn(
            `[CSSVariableBatcher] CSS batch took ${batchTime.toFixed(
              2
            )}ms for ${batchSize} updates`
          );
        }
        if (batchTime > 16) {
          this.setBatchingEnabled(false);
          setTimeout(() => this.setBatchingEnabled(true), 5e3);
        }
      }
    }
    flushCSSVariableBatch() {
      if (this._cssVariableBatcher.batchTimeout) {
        clearTimeout(this._cssVariableBatcher.batchTimeout);
        this._cssVariableBatcher.batchTimeout = null;
      }
      this._processCSSVariableBatch();
    }
    setBatchingEnabled(enabled) {
      this._cssVariableBatcher.enabled = enabled;
      if (!enabled) {
        this.flushCSSVariableBatch();
      }
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3A8} [CSSVariableBatcher] Batching ${enabled ? "enabled" : "disabled"}`
        );
      }
    }
    updateConfig(newConfig) {
      this.config = { ...this.config, ...newConfig };
      if (newConfig.batchIntervalMs) {
        this._cssVariableBatcher.batchIntervalMs = newConfig.batchIntervalMs;
      }
      if (newConfig.maxBatchSize) {
        this._cssVariableBatcher.maxBatchSize = newConfig.maxBatchSize;
      }
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Configuration updated:", newConfig);
      }
    }
    getPerformanceReport() {
      const averageBatchTime = this._performanceMetrics.totalBatches > 0 ? this._performanceMetrics.totalBatchTime / this._performanceMetrics.totalBatches : 0;
      const estimatedSavings = this._performanceMetrics.totalUpdates > 0 ? Math.round(
        (this._performanceMetrics.totalUpdates - this._performanceMetrics.totalBatches) / this._performanceMetrics.totalUpdates * 100
      ) : 0;
      return {
        enabled: this._cssVariableBatcher.enabled,
        pendingUpdates: this._cssVariableBatcher.pendingUpdates.size,
        totalUpdates: this._performanceMetrics.totalUpdates,
        totalBatches: this._performanceMetrics.totalBatches,
        averageBatchSize: Math.round(this._performanceMetrics.averageBatchSize * 10) / 10,
        averageBatchTime: Math.round(averageBatchTime * 100) / 100,
        maxBatchTime: Math.round(this._performanceMetrics.maxBatchTime * 100) / 100,
        overBudgetBatches: this._performanceMetrics.overBudgetBatches,
        batchInterval: this._cssVariableBatcher.batchIntervalMs,
        maxBatchSize: this._cssVariableBatcher.maxBatchSize,
        performance: {
          estimatedDomManipulationReduction: `${estimatedSavings}%`,
          efficiency: this._calculateEfficiency()
        },
        recommendations: this._generateBatchingRecommendations()
      };
    }
    _calculateEfficiency() {
      if (this._performanceMetrics.totalBatches === 0) return "fair";
      const averageBatchSize = this._performanceMetrics.averageBatchSize;
      const overBudgetRate = this._performanceMetrics.overBudgetBatches / this._performanceMetrics.totalBatches;
      if (averageBatchSize > 10 && overBudgetRate < 0.1) return "excellent";
      if (averageBatchSize > 5 && overBudgetRate < 0.2) return "good";
      if (averageBatchSize > 2) return "fair";
      return "poor";
    }
    _generateBatchingRecommendations() {
      const recommendations = [];
      if (this._performanceMetrics.averageBatchSize < 2) {
        recommendations.push({
          type: "batch_size",
          priority: "low",
          message: "Average batch size is small - consider increasing batch interval",
          action: "Increase batchIntervalMs to collect more updates per batch"
        });
      }
      if (this._performanceMetrics.overBudgetBatches > this._performanceMetrics.totalBatches * 0.2) {
        recommendations.push({
          type: "performance",
          priority: "medium",
          message: "Frequent over-budget batches detected",
          action: "Reduce maxBatchSize or optimize CSS property updates"
        });
      }
      return recommendations;
    }
    resetMetrics() {
      this._performanceMetrics = {
        totalBatches: 0,
        totalUpdates: 0,
        totalBatchTime: 0,
        maxBatchTime: 0,
        averageBatchSize: 0,
        overBudgetBatches: 0
      };
      this._cssVariableBatcher.totalUpdates = 0;
      this._cssVariableBatcher.batchCount = 0;
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Performance metrics reset");
      }
    }
    destroy() {
      this.flushCSSVariableBatch();
      if (this._cssVariableBatcher.batchTimeout) {
        clearTimeout(this._cssVariableBatcher.batchTimeout);
      }
      if (this.config.enableDebug) {
        console.log("\u{1F3A8} [CSSVariableBatcher] Destroyed");
      }
    }
  };

  // src-js/core/DeviceCapabilityDetector.ts
  var DeviceCapabilityDetector = class {
    constructor(config = {}) {
      this.deviceCapabilities = null;
      this.isInitialized = false;
      this.config = {
        enableDebug: config.enableDebug || false,
        runStressTests: config.runStressTests !== false,
        ...config
      };
      if (this.config.enableDebug) {
        console.log("\u{1F50D} [DeviceCapabilityDetector] Initialized");
      }
    }
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
        memory: {
          total: navigator.deviceMemory || 4,
          level: this._detectMemoryLevel(),
          jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0,
          estimatedAvailable: this._estimateAvailableMemory()
        },
        cpu: {
          cores: navigator.hardwareConcurrency || 2,
          level: this._detectCPULevel(),
          estimatedScore: this._calculateCPUScore()
        },
        gpu: {
          supportsWebGL: this._detectWebGLSupport(),
          supportsWebGL2: this._detectWebGL2Support(),
          maxTextureSize: this._getMaxTextureSize(),
          level: this._detectGPULevel(),
          vendor: this._getGPUVendor(),
          renderer: this._getGPURenderer()
        },
        browser: {
          supportsOffscreenCanvas: this._detectOffscreenCanvasSupport(),
          supportsWorkers: this._detectWorkerSupport(),
          supportsSharedArrayBuffer: this._detectSharedArrayBufferSupport(),
          supportsWASM: this._detectWASMSupport(),
          supportsCSSHoudini: this._detectCSSHoudiniSupport()
        },
        display: {
          pixelRatio: window.devicePixelRatio || 1,
          refreshRate: await this._detectRefreshRate(),
          colorGamut: this._detectColorGamut(),
          contrastRatio: this._detectContrastCapability(),
          reducedMotion: this._detectReducedMotion()
        },
        network: {
          effectiveType: navigator.connection?.effectiveType || "unknown",
          downlink: navigator.connection?.downlink || 0,
          rtt: navigator.connection?.rtt || 0,
          saveData: navigator.connection?.saveData || false
        },
        overall: "detecting"
      };
      if (this.config.runStressTests) {
        await this._runCapabilityTests();
      }
      this.deviceCapabilities.overall = this._calculateOverallPerformanceLevel();
      this._applyAnticipatoryIntensity(this.deviceCapabilities.overall);
      this.isInitialized = true;
      if (this.config.enableDebug) {
        console.log(
          "\u{1F4CA} [DeviceCapabilityDetector] Capabilities detected:",
          this.deviceCapabilities
        );
      }
      return this.deviceCapabilities;
    }
    _detectMemoryLevel() {
      const memory = navigator.deviceMemory || 4;
      if (memory >= 8) return "high";
      if (memory >= 4) return "medium";
      return "low";
    }
    _estimateAvailableMemory() {
      if (performance.memory) {
        return performance.memory.jsHeapSizeLimit - performance.memory.usedJSHeapSize;
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
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
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
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 0;
      } catch (e) {
        return 0;
      }
    }
    _getGPUVendor() {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "unknown";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown";
      } catch (e) {
        return "unknown";
      }
    }
    _getGPURenderer() {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "unknown";
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown";
      } catch (e) {
        return "unknown";
      }
    }
    _detectGPULevel() {
      const renderer = this._getGPURenderer().toLowerCase();
      if (/rtx|radeon rx|gtx 16|gtx 20|apple m[1-9]/.test(renderer)) {
        return "high";
      }
      if (/gtx|radeon|intel iris|intel uhd/.test(renderer)) {
        return "medium";
      }
      return "low";
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
    async _runCapabilityTests() {
      if (this.deviceCapabilities) {
        this.deviceCapabilities.gpu.stressTestScore = await this._runGPUStressTest();
        this.deviceCapabilities.memory.stressTestScore = await this._runMemoryStressTest();
      }
      if (this.config.enableDebug) {
        console.log("\u26A1 [DeviceCapabilityDetector] Capability tests completed");
      }
    }
    async _runGPUStressTest() {
      return 0;
    }
    async _runMemoryStressTest() {
      return 0;
    }
    _calculateOverallPerformanceLevel() {
      if (!this.deviceCapabilities) return "low";
      const scores = {
        memory: this.deviceCapabilities.memory.level === "high" ? 3 : this.deviceCapabilities.memory.level === "medium" ? 2 : 1,
        cpu: this.deviceCapabilities.cpu.level === "high" ? 3 : this.deviceCapabilities.cpu.level === "medium" ? 2 : 1,
        gpu: this.deviceCapabilities.gpu.level === "high" ? 3 : this.deviceCapabilities.gpu.level === "medium" ? 2 : 1,
        browser: (this.deviceCapabilities.gpu.supportsWebGL ? 1 : 0) + (this.deviceCapabilities.browser.supportsWorkers ? 1 : 0) + (this.deviceCapabilities.browser.supportsOffscreenCanvas ? 1 : 0)
      };
      const totalScore = scores.memory + scores.cpu + scores.gpu + Math.min(scores.browser, 3);
      if (totalScore >= 10) return "high";
      if (totalScore >= 7) return "medium";
      return "low";
    }
    getCapabilities() {
      if (!this.isInitialized) {
        console.warn(
          "[DeviceCapabilityDetector] Not initialized - call initialize() first"
        );
        return null;
      }
      return this.deviceCapabilities;
    }
    destroy() {
      this.deviceCapabilities = null;
      this.isInitialized = false;
      if (this.config.enableDebug) {
        console.log("\u{1F50D} [DeviceCapabilityDetector] Destroyed");
      }
    }
    /**
     * Recommend a performance-quality label that callers (e.g., visual systems)
     * can use to pick an appropriate performance profile.
     * Returns one of `"low" | "balanced" | "high"`.
     */
    recommendPerformanceQuality() {
      if (!this.isInitialized || !this.deviceCapabilities) {
        return "balanced";
      }
      switch (this.deviceCapabilities.overall) {
        case "high":
          return "high";
        case "medium":
          return "balanced";
        case "low":
        default:
          return "low";
      }
    }
    _applyAnticipatoryIntensity(level) {
      const root = document.documentElement;
      const mapping = {
        high: 0.26,
        medium: 0.18,
        low: 0.1
      };
      const val = mapping[level] ?? 0.18;
      root.style.setProperty("--sn-anticipatory-intensity", val.toString());
      if (this.config.enableDebug) {
        console.log(
          `\u{1F50D} [DeviceCapabilityDetector] Applied --sn-anticipatory-intensity=${val} for performance level ${level}`
        );
      }
    }
  };

  // src-js/core/MasterAnimationCoordinator.ts
  var MasterAnimationCoordinator = class {
    constructor(config = {}) {
      this._animationSystemRegistry = /* @__PURE__ */ new Map();
      this._animationFrameId = null;
      this._animationPaused = false;
      this.config = {
        frameTimeBudget: config.frameTimeBudget || 16,
        // 16ms target for 60fps
        maxBatchSize: config.maxBatchSize || 50,
        enableDebug: config.enableDebug || false,
        ...config
      };
      this._frameTimeBudget = this.config.frameTimeBudget;
      this._performanceMetrics = {
        totalFrames: 0,
        droppedFrames: 0,
        averageFrameTime: 0,
        maxFrameTime: 0,
        systemStats: /* @__PURE__ */ new Map(),
        performanceMode: "auto",
        lastOptimization: 0
      };
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Initialized");
      }
    }
    initialize() {
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Master Animation Controller initialized"
        );
      }
    }
    registerAnimationSystem(systemName, system, priority = "normal", targetFPS = 60) {
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
        skippedFrames: 0
      };
      this._animationSystemRegistry.set(systemName, systemConfig);
      this._performanceMetrics.systemStats.set(systemName, {
        averageTime: 0,
        maxTime: 0,
        calls: 0
      });
      if (this.config.enableDebug) {
        console.log(
          `\u{1F3AC} [MasterAnimationCoordinator] Registered animation system: ${systemName} (${priority} priority, ${targetFPS}fps)`
        );
      }
      if (this._animationSystemRegistry.size === 1 && !this._animationFrameId) {
        this.startMasterAnimationLoop();
      }
    }
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
    startMasterAnimationLoop() {
      if (this._animationFrameId) return;
      const masterLoop = (timestamp) => {
        if (this._animationPaused) {
          this._animationFrameId = requestAnimationFrame(masterLoop);
          return;
        }
        const frameStartTime = performance.now();
        const lastFrameTime = this._performanceMetrics.lastOptimization || timestamp;
        const deltaTime = timestamp - lastFrameTime;
        try {
          this._executeMasterAnimationFrame(timestamp, deltaTime);
        } catch (error) {
          console.error(
            "[MasterAnimationCoordinator] Master animation loop error:",
            error
          );
          this._performanceMetrics.droppedFrames++;
        }
        const frameTime = performance.now() - frameStartTime;
        this._updatePerformanceMetrics(frameTime);
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
    stopMasterAnimationLoop() {
      if (this._animationFrameId) {
        cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
      }
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3AC} [MasterAnimationCoordinator] Master animation loop stopped"
        );
      }
    }
    _executeMasterAnimationFrame(timestamp, deltaTime) {
      let remainingBudget = this._frameTimeBudget;
      const systemsByPriority = Array.from(
        this._animationSystemRegistry.entries()
      ).sort(([, a], [, b]) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      for (const [systemName, config] of systemsByPriority) {
        if (!config.enabled || remainingBudget <= 0 && config.priority === "background") {
          if (remainingBudget <= 0) config.skippedFrames++;
          continue;
        }
        const timeSinceLastUpdate = timestamp - config.lastUpdate;
        if (timeSinceLastUpdate < config.frameInterval) {
          continue;
        }
        const systemStartTime = performance.now();
        try {
          const deltaMs = timeSinceLastUpdate;
          if (typeof config.system.onAnimate === "function") {
            config.system.onAnimate(deltaMs);
          } else if (typeof config.system.updateAnimation === "function") {
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
          if (systemExecutionTime > 5 && this.config.enableDebug) {
            console.warn(
              `\u{1F3AC} [MasterAnimationCoordinator] System ${systemName} took ${systemExecutionTime.toFixed(
                2
              )}ms`
            );
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
    _updatePerformanceMetrics(frameTime) {
      const metrics = this._performanceMetrics;
      metrics.maxFrameTime = Math.max(metrics.maxFrameTime, frameTime);
      metrics.averageFrameTime = (metrics.averageFrameTime * (metrics.totalFrames - 1) + frameTime) / metrics.totalFrames;
      if (frameTime > 16.67) {
        metrics.droppedFrames++;
      }
    }
    _applyPerformanceOptimizations() {
      const now = performance.now();
      if (now - this._performanceMetrics.lastOptimization < 5e3) {
        return;
      }
      const frameDropRate = this._performanceMetrics.droppedFrames / this._performanceMetrics.totalFrames;
      const avgFrameTime = this._performanceMetrics.averageFrameTime;
      if (frameDropRate > 0.1 || avgFrameTime > 20) {
        this._activatePerformanceMode();
      } else if (frameDropRate < 0.02 && avgFrameTime < 10) {
        this._activateQualityMode();
      }
      this._performanceMetrics.lastOptimization = now;
    }
    _activatePerformanceMode() {
      if (this._performanceMetrics.performanceMode === "performance") return;
      this._performanceMetrics.performanceMode = "performance";
      this._frameTimeBudget = 12;
      for (const [, config] of this._animationSystemRegistry) {
        if (config.priority === "background") {
          config.frameInterval = Math.max(config.frameInterval * 1.5, 33);
        }
      }
      this._notifyPerformanceModeChange("performance");
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Activated performance mode");
      }
    }
    _activateQualityMode() {
      if (this._performanceMetrics.performanceMode === "quality") return;
      this._performanceMetrics.performanceMode = "quality";
      this._frameTimeBudget = 16;
      for (const [, config] of this._animationSystemRegistry) {
        config.frameInterval = 1e3 / config.targetFPS;
      }
      this._notifyPerformanceModeChange("quality");
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Activated quality mode");
      }
    }
    _notifyPerformanceModeChange(mode) {
      for (const [systemName, config] of this._animationSystemRegistry) {
        if (config.system.onPerformanceModeChange) {
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
    destroy() {
      this.stopMasterAnimationLoop();
      this._animationSystemRegistry.clear();
      if (this.config.enableDebug) {
        console.log("\u{1F3AC} [MasterAnimationCoordinator] Destroyed");
      }
    }
  };

  // src-js/core/PerformanceAnalyzer.ts
  var FPSCounter = class {
    constructor() {
      this.frames = 0;
      this.lastTime = performance.now();
      this.rafHandle = null;
      this.currentFPS = 0;
      this.averageFPS = 0;
      this.minFPS = Infinity;
      this.maxFPS = 0;
      this.history = [];
      this.loop = () => {
        this.frames++;
        const time = performance.now();
        if (time >= this.lastTime + 1e3) {
          this.currentFPS = this.frames;
          this.history.push(this.currentFPS);
          if (this.history.length > 30) {
            this.history.shift();
          }
          this.averageFPS = Math.round(
            this.history.reduce((a, b) => a + b, 0) / this.history.length
          );
          this.minFPS = Math.min(this.minFPS, this.currentFPS);
          this.maxFPS = Math.max(this.maxFPS, this.currentFPS);
          this.frames = 0;
          this.lastTime = time;
        }
        this.rafHandle = requestAnimationFrame(this.loop);
      };
      this.stop = () => {
        if (this.rafHandle) {
          cancelAnimationFrame(this.rafHandle);
        }
      };
      this.loop();
    }
  };
  var PerformanceAnalyzer = class {
    constructor(config = {}) {
      this.initialized = false;
      this.performanceHistory = [];
      this.metricsBuffer = /* @__PURE__ */ new Map();
      this.isMonitoring = false;
      this.monitoringTimer = null;
      this._fpsCounter = null;
      this.timedOperations = /* @__PURE__ */ new Map();
      this._buckets = /* @__PURE__ */ new Map();
      this.config = {
        enableDebug: config.enableDebug || false,
        monitoringInterval: config.monitoringInterval || 5e3,
        retentionPeriod: config.retentionPeriod || 3e5,
        ...config
      };
      try {
        this._fpsCounter = new FPSCounter();
        this.initialized = true;
        if (this.config.enableDebug) {
          console.log("\u{1F4CA} [PerformanceAnalyzer] Initialized successfully.");
        }
      } catch (error) {
        this.initialized = false;
        console.error(
          "CRITICAL: PerformanceAnalyzer failed to initialize.",
          error
        );
      }
      this._buckets = /* @__PURE__ */ new Map();
    }
    startMonitoring() {
      if (this.isMonitoring) return;
      this.isMonitoring = true;
      this.monitoringTimer = setInterval(() => {
        this._collectPerformanceMetrics();
      }, this.config.monitoringInterval);
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Monitoring started");
      }
    }
    stopMonitoring() {
      if (!this.isMonitoring) return;
      this.isMonitoring = false;
      if (this.monitoringTimer) {
        clearInterval(this.monitoringTimer);
        this.monitoringTimer = null;
      }
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Monitoring stopped");
      }
    }
    _collectPerformanceMetrics() {
      const timestamp = performance.now();
      const metrics = {
        timestamp,
        memory: this._getMemoryMetrics(),
        timing: this._getTimingMetrics(),
        fps: this._getFPSMetrics(),
        dom: this._getDOMMetrics(),
        network: this._getNetworkMetrics()
      };
      this.performanceHistory.push(metrics);
      const cutoff = timestamp - this.config.retentionPeriod;
      this.performanceHistory = this.performanceHistory.filter(
        (m) => m.timestamp > cutoff
      );
      this.metricsBuffer.set(timestamp, metrics);
      for (const key of this.metricsBuffer.keys()) {
        if (key < cutoff) {
          this.metricsBuffer.delete(key);
        }
      }
    }
    _getMemoryMetrics() {
      const memoryInfo = performance.memory || {};
      return {
        used: memoryInfo.usedJSHeapSize || 0,
        total: memoryInfo.totalJSHeapSize || 0,
        limit: memoryInfo.jsHeapSizeLimit || 0,
        utilization: memoryInfo.totalJSHeapSize ? memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize * 100 : 0,
        available: memoryInfo.jsHeapSizeLimit ? memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize : 0
      };
    }
    _getTimingMetrics() {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0];
      return {
        domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
        loadComplete: navigation?.loadEventEnd || 0,
        firstPaint: this._getFirstPaint(),
        firstContentfulPaint: this._getFirstContentfulPaint(),
        largestContentfulPaint: this._getLargestContentfulPaint()
      };
    }
    _getFPSMetrics() {
      if (this._fpsCounter) {
        return {
          current: this._fpsCounter.currentFPS,
          average: this._fpsCounter.averageFPS,
          min: this._fpsCounter.minFPS,
          max: this._fpsCounter.maxFPS,
          isEstimate: false
        };
      }
      return { current: 60, average: 60, min: 60, max: 60, isEstimate: true };
    }
    _getDOMMetrics() {
      return {
        elements: document.querySelectorAll("*").length,
        styleSheets: document.styleSheets.length,
        images: document.images.length,
        scripts: document.scripts.length,
        links: document.links.length
      };
    }
    _getNetworkMetrics() {
      const connection = navigator.connection || {};
      return {
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }
    _getFirstPaint() {
      const firstPaint = performance.getEntriesByType("paint").find((entry) => entry.name === "first-paint");
      return firstPaint ? firstPaint.startTime : 0;
    }
    _getFirstContentfulPaint() {
      const fcp = performance.getEntriesByType("paint").find((entry) => entry.name === "first-contentful-paint");
      return fcp ? fcp.startTime : 0;
    }
    _getLargestContentfulPaint() {
      const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
      const lastEntry = lcpEntries[lcpEntries.length - 1];
      return lastEntry ? lastEntry.startTime : 0;
    }
    calculateHealthScore() {
      const latestMetrics = this.performanceHistory[this.performanceHistory.length - 1];
      if (!latestMetrics) return 100;
      let score = 100;
      if (latestMetrics.memory.utilization > 80) score -= 20;
      if (latestMetrics.fps.average < 30) score -= 25;
      if (latestMetrics.timing.largestContentfulPaint > 2500) score -= 15;
      return Math.max(0, score);
    }
    getHealthLevel(score) {
      if (score > 80) return "stable";
      if (score > 50) return "warning";
      return "critical";
    }
    // --- Start of methods migrated from PerformanceMonitor ---
    startTiming(operation) {
      return performance.now();
    }
    endTiming(operation, startTime) {
      const duration = performance.now() - startTime;
      if (!this.timedOperations.has(operation)) {
        this.timedOperations.set(operation, []);
      }
      const timings = this.timedOperations.get(operation);
      timings.push(duration);
      if (timings.length > 50) {
        timings.shift();
      }
    }
    getAverageTime(operation) {
      const timings = this.timedOperations.get(operation);
      if (!timings || timings.length === 0) {
        return 0;
      }
      return timings.reduce((a, b) => a + b, 0) / timings.length;
    }
    detectMemoryPressure() {
      const memory = performance.memory;
      if (memory) {
        const used = memory.usedJSHeapSize;
        const total = memory.totalJSHeapSize;
        return used / total > 0.8 ? "high" : "normal";
      }
      return "unknown";
    }
    shouldReduceQuality() {
      const score = this.calculateHealthScore();
      return score < 60;
    }
    /**
     * Emit a trace message when debug mode is enabled.  This method provides a
     * single, centralized entry-point so callers can avoid sprinkling
     * `console.log` statements around.  In the future we might widen this to
     * support different channels (performance panel, remote telemetry, etc.).
     */
    emitTrace(message, data) {
      if (!this.config.enableDebug) return;
      if (data !== void 0) {
        console.log(`\u{1F4CA} [PerformanceAnalyzer] ${message}`, data);
      } else {
        console.log(`\u{1F4CA} [PerformanceAnalyzer] ${message}`);
      }
    }
    /**
     * Throttle helper – returns true when the caller is allowed to perform an update
     * for the supplied bucket. Subsequent calls within `minIntervalMs` will return
     * false until the interval has elapsed. Useful for cheaply rate-limiting CSS
     * variable flushes, expensive observers, etc.
     *
     * @param bucket        Arbitrary string identifying the operation family
     * @param minIntervalMs Minimum time between allowed updates (default 16 ms)
     */
    shouldUpdate(bucket, minIntervalMs = 16) {
      const now = performance.now();
      const nextAllowed = this._buckets.get(bucket) ?? 0;
      if (now >= nextAllowed) {
        this._buckets.set(bucket, now + minIntervalMs);
        return true;
      }
      return false;
    }
    // --- End of migrated methods ---
    destroy() {
      this.stopMonitoring();
      if (this._fpsCounter) {
        this._fpsCounter.stop();
      }
      this.performanceHistory = [];
      this.metricsBuffer.clear();
      this.timedOperations.clear();
      if (this.config.enableDebug) {
        console.log("\u{1F4CA} [PerformanceAnalyzer] Destroyed and cleaned up.");
      }
    }
  };

  // src-js/core/TimerConsolidationSystem.ts
  var TimerConsolidationSystem = class {
    constructor(config = {}) {
      this._timerRegistry = /* @__PURE__ */ new Map();
      this._timerMasterInterval = null;
      this.config = {
        timerIntervalMs: config.timerIntervalMs || 50,
        maxTimerBudget: config.maxTimerBudget || 10,
        enableDebug: config.enableDebug || false,
        ...config
      };
      this._timerPerformanceMetrics = {
        totalExecutions: 0,
        totalTime: 0,
        maxExecutionTime: 0,
        averageExecutionTime: 0,
        skippedTimers: 0,
        timerCallbacks: /* @__PURE__ */ new Map()
      };
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Initialized");
      }
    }
    initialize() {
      if (this.config.enableDebug) {
        console.log(
          "\u23F1\uFE0F [TimerConsolidationSystem] Timer consolidation initialized"
        );
      }
    }
    registerConsolidatedTimer(timerId, callback, intervalMs, priority = "normal") {
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
        skippedExecutions: 0
      };
      this._timerRegistry.set(timerId, timerConfig);
      this._timerPerformanceMetrics.timerCallbacks.set(timerId, {
        calls: 0,
        totalTime: 0,
        maxTime: 0
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
    _startMasterTimer() {
      if (this._timerMasterInterval) return;
      this._timerMasterInterval = setInterval(() => {
        this._executeMasterTimerFrame();
      }, this.config.timerIntervalMs);
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Master timer started");
      }
    }
    _stopMasterTimer() {
      if (this._timerMasterInterval) {
        clearInterval(this._timerMasterInterval);
        this._timerMasterInterval = null;
      }
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Master timer stopped");
      }
    }
    _executeMasterTimerFrame() {
      const frameStartTime = performance.now();
      let remainingBudget = this.config.maxTimerBudget;
      const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
        ([, a], [, b]) => {
          const priorityOrder = { critical: 0, normal: 1, background: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
      );
      for (const [timerId, config] of timersByPriority) {
        if (!config.enabled || remainingBudget <= 0 && config.priority === "background") {
          if (remainingBudget <= 0) config.skippedExecutions++;
          continue;
        }
        const timeSinceLastExecution = frameStartTime - config.lastExecution;
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
          config.lastExecution = frameStartTime;
          const stats = this._timerPerformanceMetrics.timerCallbacks.get(timerId);
          if (stats) {
            stats.calls++;
            stats.totalTime += timerExecutionTime;
            stats.maxTime = Math.max(stats.maxTime, timerExecutionTime);
          }
          remainingBudget -= timerExecutionTime;
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
    }
    _updateTimerPerformanceMetrics(frameTime) {
      const metrics = this._timerPerformanceMetrics;
      metrics.totalExecutions++;
      metrics.totalTime += frameTime;
      metrics.maxExecutionTime = Math.max(metrics.maxExecutionTime, frameTime);
      metrics.averageExecutionTime = metrics.totalTime / metrics.totalExecutions;
      if (frameTime > this.config.maxTimerBudget) {
        metrics.skippedTimers++;
      }
    }
    destroy() {
      this._stopMasterTimer();
      this._timerRegistry.clear();
      if (this.config.enableDebug) {
        console.log("\u23F1\uFE0F [TimerConsolidationSystem] Destroyed");
      }
    }
  };

  // src-js/debug/SpotifyDOMSelectors.ts
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
    overlay: ".main-overlay-container"
  };
  var SELECTOR_MAPPINGS = Object.entries({
    // Migration mapping: legacy → modern
    ".main-nowPlayingWidget-nowPlaying": MODERN_SELECTORS.nowPlayingBar,
    ".main-navBar-navBar": MODERN_SELECTORS.leftSidebar,
    ".main-search-searchBar": MODERN_SELECTORS.searchInput,
    ".main-topBar-topBar": MODERN_SELECTORS.actionBar,
    ".main-queue-queue": MODERN_SELECTORS.queue,
    ".main-trackList-trackList": MODERN_SELECTORS.trackListContainer
  }).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      acc[key] = value;
    }
    return acc;
  }, {});
  var ORBITAL_ELEMENTS = {
    // Elements that can have orbital gravity effects
    trackRows: MODERN_SELECTORS.trackRow ?? "",
    libraryItems: MODERN_SELECTORS.libraryItems ?? "",
    cards: MODERN_SELECTORS.card ?? "",
    navLinks: ".main-navBar-navBarLink"
    // This one still works
  };
  var GRAVITY_WELL_TARGETS = {
    // Major UI elements that should have gravity wells
    primary: [
      MODERN_SELECTORS.nowPlayingBar,
      MODERN_SELECTORS.leftSidebar,
      MODERN_SELECTORS.entityHeader
    ].filter((s) => !!s),
    secondary: [
      MODERN_SELECTORS.actionBar,
      MODERN_SELECTORS.queue,
      MODERN_SELECTORS.searchInput
    ].filter((s) => !!s),
    tertiary: [
      MODERN_SELECTORS.playButton,
      MODERN_SELECTORS.trackListHeader
    ].filter((s) => !!s)
  };
  var ANTI_GRAVITY_ZONES = {
    // Areas where anti-gravity effects should be applied
    searchAreas: [
      MODERN_SELECTORS.searchInput,
      MODERN_SELECTORS.searchPage
    ].filter((s) => !!s),
    notifications: [
      "[data-testid='notification-bar']",
      ".main-topBar-notifications"
    ],
    dropdowns: [".main-dropdown-menu", "[role='menu']", "[role='listbox']"]
  };
  function elementExists(selector) {
    return document.querySelector(selector) !== null;
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
      details: {}
    };
    Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
      const exists = elementExists(selector);
      results.details[key] = {
        selector,
        exists,
        element: exists ? document.querySelector(selector) : null
      };
      if (exists) {
        results.found++;
        console.log(`\u2705 ${key}: ${selector}`);
      } else {
        results.missing++;
        console.warn(`\u274C ${key}: ${selector}`);
      }
    });
    console.log(`\u{1F4CA} Summary: ${results.found} found, ${results.missing} missing`);
    console.groupEnd();
    return results;
  }
  function testGravitySystemSelectors() {
    console.group("\u{1F30C} [Phase 1] Testing Gravity System Selectors");
    console.log("\u{1F3AF} Primary gravity well targets:");
    if (GRAVITY_WELL_TARGETS.primary) {
      GRAVITY_WELL_TARGETS.primary.forEach((selector) => {
        const element = document.querySelector(selector);
        console.log(`${element ? "\u2705" : "\u274C"} ${selector}`, element);
      });
    }
    console.log("\u{1F3AF} Secondary gravity well targets:");
    if (GRAVITY_WELL_TARGETS.secondary) {
      GRAVITY_WELL_TARGETS.secondary.forEach((selector) => {
        const element = document.querySelector(selector);
        console.log(`${element ? "\u2705" : "\u274C"} ${selector}`, element);
      });
    }
    console.log("\u{1F6F8} Orbital elements:");
    Object.entries(ORBITAL_ELEMENTS).forEach(([key, selector]) => {
      const elements = document.querySelectorAll(selector);
      console.log(
        `${elements.length > 0 ? "\u2705" : "\u274C"} ${key} (${selector}): ${elements.length} found`
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
      { name: "Now Playing Widget", selector: MODERN_SELECTORS.nowPlayingWidget },
      { name: "Now Playing Left", selector: MODERN_SELECTORS.nowPlayingLeft },
      { name: "Left Sidebar", selector: MODERN_SELECTORS.leftSidebar },
      { name: "Library Items", selector: ORBITAL_ELEMENTS.libraryItems }
    ];
    const results = {
      found: 0,
      missing: 0,
      details: {}
    };
    testSelectors.forEach(({ name, selector }) => {
      if (!selector) return;
      const elements = findElementsWithFallback(selector);
      const count = elements.length;
      results.details[name] = {
        selector,
        count,
        exists: count > 0
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
    console.group("\u{1F30C} [SpotifyDOMSelectors] Phase 2 - System Integration Test");
    const systemTests = {
      behavioralPrediction: validatePredictionTargets(),
      dimensionalNexus: {
        sidebarElement: MODERN_SELECTORS.leftSidebar ? elementExists(MODERN_SELECTORS.leftSidebar) : false
      },
      dataGlyph: {
        navLinks: MODERN_SELECTORS.navBarLink ? elementExists(MODERN_SELECTORS.navBarLink) : false,
        trackRows: ORBITAL_ELEMENTS.trackRows ? elementExists(ORBITAL_ELEMENTS.trackRows) : false,
        cards: ORBITAL_ELEMENTS.cards ? elementExists(ORBITAL_ELEMENTS.cards) : false
      }
    };
    let totalIssues = 0;
    Object.values(systemTests).forEach((tests) => {
      if (typeof tests === "object" && tests.missing) {
        totalIssues += tests.missing;
      }
    });
    console.log(
      `\u{1F3AF} Phase 2 Integration Health: ${totalIssues === 0 ? "\u2705 All systems operational" : `\u26A0\uFE0F ${totalIssues} issues detected`}`
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
      antiGravity: ANTI_GRAVITY_ZONES
    };
    console.log("\u{1F3AF} [SpotifyDOMSelectors] Debug functions available:");
    console.log("  window.SpotifyDOMSelectors.validate() - Test all selectors");
    console.log(
      "  window.SpotifyDOMSelectors.testGravity() - Test gravity selectors"
    );
  }

  // src-js/debug/SystemHealthMonitor.ts
  var SystemHealthMonitor = class _SystemHealthMonitor {
    constructor() {
      this.registeredSystems = /* @__PURE__ */ new Map();
      this.healthHistory = /* @__PURE__ */ new Map();
      this.alerts = [];
      this.monitoringActive = false;
      this.checkInterval = null;
      this.recoveryAttempts = /* @__PURE__ */ new Map();
      this.config = {
        checkIntervalMs: 1e4,
        healthRetentionHours: 24,
        maxRecoveryAttempts: 3,
        alertThreshold: 3
      };
    }
    static getStatusColor(status) {
      const statusColors = {
        HEALTHY: "var(--spice-green, #a6e3a1)",
        WARNING: "var(--spice-yellow, #f9e2af)",
        DEGRADED: "var(--spice-peach, #fab387)",
        FAILING: "var(--spice-red, #f38ba8)",
        ERROR: "var(--spice-red, #f38ba8)",
        UNKNOWN: "var(--spice-text, #cdd6f4)",
        CRITICAL: "var(--spice-red, #f38ba8)",
        REGISTERED: "var(--spice-blue, #89b4fa)"
      };
      return statusColors[status] || "var(--spice-text, #cdd6f4)";
    }
    // === SYSTEM REGISTRATION ===
    registerSystem(systemName, systemInstance, options = {}) {
      const systemData = {
        name: systemName,
        instance: systemInstance,
        registeredAt: Date.now(),
        options: {
          criticalLevel: options.criticalLevel || "MEDIUM",
          requiredSelectors: options.requiredSelectors || [],
          healthCheckMethod: options.healthCheckMethod || null,
          recoveryMethod: options.recoveryMethod || null
        },
        lastHealthCheck: null,
        consecutiveFailures: 0,
        totalFailures: 0,
        status: "REGISTERED"
      };
      this.registeredSystems.set(systemName, systemData);
      this.healthHistory.set(systemName, []);
      console.log(
        `\u{1F3E5} [SystemHealthMonitor] Registered ${systemName} (${systemData.options.criticalLevel} priority)`
      );
      if (this.registeredSystems.size === 1 && !this.monitoringActive) {
        this.startMonitoring();
      }
      return systemData;
    }
    unregisterSystem(systemName) {
      if (this.registeredSystems.has(systemName)) {
        this.registeredSystems.delete(systemName);
        this.healthHistory.delete(systemName);
        this.recoveryAttempts.delete(systemName);
        console.log(`\u{1F3E5} [SystemHealthMonitor] Unregistered ${systemName}`);
        if (this.registeredSystems.size === 0) {
          this.stopMonitoring();
        }
      }
    }
    // === MONITORING CONTROL ===
    startMonitoring() {
      if (this.monitoringActive) return;
      console.log("\u{1F3E5} [SystemHealthMonitor] Starting health monitoring...");
      this.monitoringActive = true;
      this.checkInterval = setInterval(() => {
        this.performHealthChecks();
      }, this.config.checkIntervalMs);
      this.performHealthChecks();
    }
    stopMonitoring() {
      if (!this.monitoringActive) return;
      console.log("\u{1F3E5} [SystemHealthMonitor] Stopping health monitoring...");
      this.monitoringActive = false;
      if (this.checkInterval) {
        clearInterval(this.checkInterval);
        this.checkInterval = null;
      }
    }
    // === HEALTH CHECKING ===
    async performHealthChecks() {
      const timestamp = Date.now();
      const results = /* @__PURE__ */ new Map();
      for (const [systemName, systemData] of this.registeredSystems) {
        try {
          const healthResult = await this.checkSystemHealth(
            systemName,
            systemData
          );
          results.set(systemName, healthResult);
          systemData.lastHealthCheck = timestamp;
          systemData.status = healthResult.status;
          if (healthResult.status === "FAILING" || healthResult.status === "ERROR") {
            systemData.consecutiveFailures++;
            systemData.totalFailures++;
          } else {
            systemData.consecutiveFailures = 0;
          }
          this.updateHealthHistory(systemName, healthResult);
          this.checkForAlerts(systemName, systemData, healthResult);
          if (healthResult.status === "FAILING" && systemData.options.recoveryMethod) {
            await this.attemptRecovery(systemName, systemData);
          }
        } catch (error) {
          console.error(
            `\u{1F3E5} [SystemHealthMonitor] Health check failed for ${systemName}:`,
            error
          );
          const errorResult = {
            systemName,
            status: "ERROR",
            timestamp,
            error: error.message,
            checks: {},
            issues: [],
            recommendations: [],
            score: 0
          };
          results.set(systemName, errorResult);
          this.updateHealthHistory(systemName, errorResult);
        }
      }
      this.cleanupHealthHistory();
      return results;
    }
    async checkSystemHealth(systemName, systemData) {
      const timestamp = Date.now();
      const healthResult = {
        systemName,
        timestamp,
        status: "UNKNOWN",
        score: 0,
        checks: {},
        issues: [],
        recommendations: []
      };
      const instance2 = systemData.instance;
      let totalChecks = 0;
      let passedChecks = 0;
      totalChecks++;
      if (instance2) {
        healthResult.checks.instanceAvailable = {
          status: "PASS",
          message: "System instance is available"
        };
        passedChecks++;
      } else {
        healthResult.checks.instanceAvailable = {
          status: "FAIL",
          message: "System instance not available"
        };
        healthResult.issues.push("System instance is null or undefined");
      }
      if (instance2) {
        totalChecks++;
        if (typeof instance2.initialize === "function") {
          if (instance2.initialized !== false) {
            healthResult.checks.initialization = {
              status: "PASS",
              message: "System appears to be initialized"
            };
            passedChecks++;
          } else {
            healthResult.checks.initialization = {
              status: "FAIL",
              message: "System not initialized"
            };
            healthResult.issues.push(
              "System initialize() method exists but system not initialized"
            );
          }
        } else {
          healthResult.checks.initialization = {
            status: "SKIP",
            message: "No initialize method found"
          };
        }
      }
      if (instance2) {
        const requiredMethods = ["updateAnimation", "destroy"];
        totalChecks++;
        const missingMethods = requiredMethods.filter(
          (method) => typeof instance2[method] !== "function"
        );
        if (missingMethods.length === 0) {
          healthResult.checks.requiredMethods = {
            status: "PASS",
            message: "All required methods present"
          };
          passedChecks++;
        } else {
          healthResult.checks.requiredMethods = {
            status: "FAIL",
            message: `Missing methods: ${missingMethods.join(", ")}`
          };
          healthResult.issues.push(
            `Missing required methods: ${missingMethods.join(", ")}`
          );
        }
      }
      if (systemData.options.requiredSelectors && systemData.options.requiredSelectors.length > 0) {
        totalChecks++;
        const missingSelectors = [];
        systemData.options.requiredSelectors.forEach((selector) => {
          if (!elementExists(selector)) {
            missingSelectors.push(selector);
          }
        });
        if (missingSelectors.length === 0) {
          healthResult.checks.requiredSelectors = {
            status: "PASS",
            message: "All required DOM elements found"
          };
          passedChecks++;
        } else {
          healthResult.checks.requiredSelectors = {
            status: "FAIL",
            message: `Missing DOM elements: ${missingSelectors.length}/${systemData.options.requiredSelectors.length}`
          };
          healthResult.issues.push(
            `Required DOM elements not found: ${missingSelectors.join(", ")}`
          );
          healthResult.recommendations.push(
            "Check if Spotify UI has changed or selectors need updating"
          );
        }
      }
      try {
        const customCheckResult = await systemData.instance.healthCheck();
        healthResult.checks["customHealthCheck"] = {
          passed: customCheckResult.ok,
          details: customCheckResult.details
        };
        if (!customCheckResult.ok) {
          healthResult.issues.push(
            `Custom health check failed: ${customCheckResult.details || "No details provided"}`
          );
        }
      } catch (error) {
        healthResult.checks["customHealthCheck"] = {
          passed: false,
          error: error.message
        };
        healthResult.issues.push(
          `Custom health check threw an error: ${error.message}`
        );
      }
      healthResult.score = totalChecks > 0 ? Math.round(passedChecks / totalChecks * 100) : 0;
      if (healthResult.score >= 90) {
        healthResult.status = "HEALTHY";
      } else if (healthResult.score >= 70) {
        healthResult.status = "WARNING";
      } else if (healthResult.score >= 50) {
        healthResult.status = "DEGRADED";
      } else if (healthResult.score > 0) {
        healthResult.status = "FAILING";
      } else {
        healthResult.status = "CRITICAL";
      }
      return healthResult;
    }
    // === HEALTH HISTORY MANAGEMENT ===
    updateHealthHistory(systemName, healthResult) {
      const history = this.healthHistory.get(systemName) || [];
      history.push(healthResult);
      const maxEntries = Math.ceil(
        this.config.healthRetentionHours * 60 * 60 * 1e3 / this.config.checkIntervalMs
      );
      if (history.length > maxEntries) {
        history.splice(0, history.length - maxEntries);
      }
      this.healthHistory.set(systemName, history);
    }
    cleanupHealthHistory() {
      const cutoffTime = Date.now() - this.config.healthRetentionHours * 60 * 60 * 1e3;
      this.healthHistory.forEach((history, systemName) => {
        const cleanedHistory = history.filter(
          (entry) => entry.timestamp > cutoffTime
        );
        this.healthHistory.set(systemName, cleanedHistory);
      });
    }
    // === ALERTING ===
    checkForAlerts(systemName, systemData, healthResult) {
      const criticalLevel = systemData.options.criticalLevel;
      const consecutiveFailures = systemData.consecutiveFailures;
      let alertThreshold = this.config.alertThreshold;
      if (criticalLevel === "CRITICAL") alertThreshold = 1;
      else if (criticalLevel === "HIGH") alertThreshold = 2;
      else if (criticalLevel === "LOW") alertThreshold = 5;
      if (consecutiveFailures >= alertThreshold) {
        this.createAlert({
          type: "SYSTEM_HEALTH_DEGRADED",
          systemName,
          severity: this.mapCriticalLevelToSeverity(criticalLevel),
          message: `${systemName} has failed ${consecutiveFailures} consecutive health checks`,
          timestamp: Date.now(),
          healthResult,
          systemData
        });
      }
      if (criticalLevel === "CRITICAL" && healthResult.status === "CRITICAL") {
        this.createAlert({
          type: "CRITICAL_SYSTEM_DOWN",
          systemName,
          severity: "CRITICAL",
          message: `Critical system ${systemName} is completely non-functional`,
          timestamp: Date.now(),
          healthResult,
          systemData
        });
      }
    }
    createAlert(alertData) {
      const existingAlert = this.alerts.find(
        (alert) => alert.type === alertData.type && alert.systemName === alertData.systemName && alert.timestamp > Date.now() - 5 * 60 * 1e3
      );
      if (existingAlert) return;
      this.alerts.push(alertData);
      const severityIcon = alertData.severity === "CRITICAL" ? "\u{1F6A8}" : alertData.severity === "HIGH" ? "\u26A0\uFE0F" : "\u{1F514}";
      console.warn(
        `${severityIcon} [SystemHealthMonitor] ALERT: ${alertData.message}`
      );
      if (this.alerts.length > 50) {
        this.alerts.splice(0, this.alerts.length - 50);
      }
    }
    mapCriticalLevelToSeverity(criticalLevel) {
      switch (criticalLevel) {
        case "CRITICAL":
          return "CRITICAL";
        case "HIGH":
          return "HIGH";
        case "MEDIUM":
          return "MEDIUM";
        case "LOW":
          return "LOW";
        default:
          return "MEDIUM";
      }
    }
    // === RECOVERY ===
    async attemptRecovery(systemName, systemData) {
      const recoveryMethodName = systemData.options.recoveryMethod;
      if (!recoveryMethodName) {
        return false;
      }
      const attempts = this.recoveryAttempts.get(systemName) || 0;
      if (attempts >= this.config.maxRecoveryAttempts) {
        console.warn(
          `\u{1F3E5} [SystemHealthMonitor] Max recovery attempts reached for ${systemName}.`
        );
        return false;
      }
      console.log(
        `\u{1F3E5} [SystemHealthMonitor] Attempting recovery for ${systemName} (Attempt ${attempts + 1})...`
      );
      this.recoveryAttempts.set(systemName, attempts + 1);
      try {
        const dynamicInstance = systemData.instance;
        if (typeof dynamicInstance[recoveryMethodName] === "function") {
          await dynamicInstance[recoveryMethodName]();
          console.log(
            `\u{1F3E5} [SystemHealthMonitor] Recovery successful for ${systemName}.`
          );
          systemData.consecutiveFailures = 0;
          return true;
        } else {
          console.error(
            `\u{1F3E5} [SystemHealthMonitor] Recovery failed: Method '${recoveryMethodName}' not found on ${systemName}.`
          );
          return false;
        }
      } catch (error) {
        console.error(
          `\u{1F3E5} [SystemHealthMonitor] Recovery failed for ${systemName}:`,
          error
        );
        return false;
      }
    }
    // === REPORTING ===
    getHealthReport() {
      const report = {
        timestamp: Date.now(),
        monitoringActive: this.monitoringActive,
        totalSystems: this.registeredSystems.size,
        systemsByStatus: {
          HEALTHY: 0,
          WARNING: 0,
          DEGRADED: 0,
          FAILING: 0,
          CRITICAL: 0,
          UNKNOWN: 0,
          REGISTERED: 0,
          ERROR: 0
        },
        recentAlerts: this.alerts.slice(-10),
        systemDetails: {}
      };
      this.registeredSystems.forEach((systemData, systemName) => {
        const status = systemData.status || "UNKNOWN";
        report.systemsByStatus[status]++;
        const history = this.healthHistory.get(systemName) || [];
        report.systemDetails[systemName] = {
          status,
          consecutiveFailures: systemData.consecutiveFailures,
          totalFailures: systemData.totalFailures,
          lastCheck: systemData.lastHealthCheck,
          criticalLevel: systemData.options.criticalLevel,
          recentHistory: history.slice(-10)
        };
      });
      return report;
    }
    logHealthReport() {
      const report = this.getHealthReport();
      console.groupCollapsed(
        `%c\u{1F3E5} [SystemHealthMonitor] Health Report - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`,
        "color: #cdd6f4; font-weight: bold;"
      );
      const summary = this.getHealthSummary();
      console.log(
        `%cOverall Status: ${summary.overallStatus}`,
        `color: ${_SystemHealthMonitor.getStatusColor(
          summary.overallStatus
        )}; font-weight: bold;`
      );
      console.log(
        `Summary: ${summary.healthy} Healthy, ${summary.warning} Warning, ${summary.failing} Failing`
      );
      this.registeredSystems.forEach((systemData, systemName) => {
        const latestResult = this.getLatestHealthResult(systemName);
        if (!latestResult) return;
        const statusColor = _SystemHealthMonitor.getStatusColor(
          latestResult.status
        );
        console.log(
          `%c\u25CF ${systemName} - ${latestResult.status}`,
          `color: ${statusColor}; font-weight: bold;`
        );
        console.log(
          `%c  Score: ${latestResult.score?.toFixed(0)}/100`,
          "color: #999"
        );
        if (systemData.consecutiveFailures > 0) {
          console.log(
            `%c  Consecutive Failures: ${systemData.consecutiveFailures}`,
            "color: #f9e2af"
          );
        }
        if (latestResult.issues && latestResult.issues.length > 0) {
          console.log("%c  Issues:", "color: #f38ba8; font-weight: bold;");
          latestResult.issues.forEach((issue) => {
            console.log(`%c    - ${issue}`, "color: #f38ba8");
          });
        }
        if (latestResult.recommendations && latestResult.recommendations.length > 0) {
          console.log(
            "%c  Recommendations:",
            "color: #89b4fa; font-weight: bold;"
          );
          latestResult.recommendations.forEach((rec) => {
            console.log(`%c    - ${rec}`, "color: #89b4fa");
          });
        }
      });
      console.groupEnd();
      return report;
    }
    getLatestHealthResult(systemName) {
      const history = this.healthHistory.get(systemName);
      return history && history.length > 0 ? history[history.length - 1] : void 0;
    }
    getHealthSummary() {
      let healthy = 0;
      let warning = 0;
      let failing = 0;
      this.registeredSystems.forEach((_, systemName) => {
        const latestResult = this.getLatestHealthResult(systemName);
        if (latestResult) {
          switch (latestResult.status) {
            case "HEALTHY":
              healthy++;
              break;
            case "WARNING":
            case "DEGRADED":
              warning++;
              break;
            case "FAILING":
            case "ERROR":
            case "CRITICAL":
              failing++;
              break;
          }
        }
      });
      const overallStatus = failing > 0 ? "FAILING" : warning > 0 ? "WARNING" : healthy > 0 ? "HEALTHY" : "UNKNOWN";
      return {
        healthy,
        warning,
        failing,
        overallStatus,
        total: this.registeredSystems.size
      };
    }
    // === CLEANUP ===
    destroy() {
      this.stopMonitoring();
      this.registeredSystems.clear();
      this.healthHistory.clear();
      this.alerts = [];
      this.recoveryAttempts.clear();
      console.log("\u{1F3E5} [SystemHealthMonitor] Destroyed and cleaned up");
    }
  };
  if (typeof window !== "undefined") {
    window.SystemHealthMonitor = new SystemHealthMonitor();
  }

  // src-js/core/year3000System.ts
  init_starryNightEffects();

  // src-js/managers/Card3DManager.ts
  var Card3DManager = class _Card3DManager {
    constructor(performanceMonitor, settingsManager, utils) {
      this.initialized = false;
      this.cardQuerySelector = ".main-card-card, .main-gridContainer-gridContainer.main-gridContainer-fixedWidth";
      this.config = {
        perspective: 1e3,
        maxRotation: 5,
        scale: 1.02,
        transitionSpeed: "200ms",
        glowOpacity: 0.8,
        selector: ".main-card-card, .main-grid-grid > *, .main-shelf-shelf > * > *"
      };
      this.performanceMonitor = performanceMonitor;
      this.settingsManager = settingsManager;
      this.utils = utils;
      this.isModernTheme = true;
      this.cards = document.querySelectorAll(this.config.selector);
      this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
    }
    static getInstance(performanceMonitor, settingsManager, utils) {
      if (!_Card3DManager.instance) {
        _Card3DManager.instance = new _Card3DManager(
          performanceMonitor,
          settingsManager,
          utils
        );
      }
      return _Card3DManager.instance;
    }
    async initialize() {
      const quality = this.performanceMonitor.shouldReduceQuality();
      if (quality) {
        if (this.settingsManager.get("sn-3d-effects-level") !== "disabled") {
          console.log(
            `[Card3DManager] Performance is low. 3D effects disabled. Current quality: ${quality}`
          );
          return;
        }
      }
      this.cards = document.querySelectorAll(this.config.selector);
      await this.applyEventListeners();
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
      this.initialized = true;
    }
    async healthCheck() {
      const elements = document.querySelectorAll(this.cardQuerySelector);
      if (elements.length > 0) {
        return { ok: true, details: `Found ${elements.length} cards to manage.` };
      }
      return {
        ok: false,
        details: "No card elements found with the configured selector."
      };
    }
    updateAnimation(deltaTime) {
    }
    apply3DMode(mode) {
      console.log(`[Card3DManager] Applying 3D mode: ${mode}`);
      if (mode === "disabled") {
        this.destroy();
      } else {
        this.initialize();
      }
    }
    get shouldEnable3DEffects() {
      const quality = this.performanceMonitor.shouldReduceQuality();
      const setting = this.settingsManager.get("sn-enable3dCards");
      return !quality && setting !== "disabled";
    }
    async applyEventListeners() {
      this.cards.forEach((card) => {
        card.addEventListener("mousemove", this.handleMouseMove.bind(this, card));
        card.addEventListener(
          "mouseleave",
          this.handleMouseLeave.bind(this, card)
        );
      });
    }
    handleMouseMove(card, e) {
      if (!this.shouldEnable3DEffects) return;
      const { clientX, clientY } = e;
      const { top, left, width, height } = card.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      const rotateX = this.config.maxRotation * (y - height / 2) / (height / 2);
      const rotateY = -this.config.maxRotation * (x - width / 2) / (width / 2);
      card.style.transform = `perspective(${this.config.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.config.scale}, ${this.config.scale}, ${this.config.scale})`;
      card.style.transition = `transform ${this.config.transitionSpeed} ease-out`;
      this.applyGlow(card, x, y, width, height);
    }
    handleMouseLeave(card) {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.transition = "transform 600ms ease-in-out";
      this.removeGlow(card);
    }
    applyGlow(card, x, y, width, height) {
      let glowElement = card.querySelector(".card-glow");
      if (!glowElement) {
        glowElement = document.createElement("div");
        glowElement.className = "card-glow";
        card.appendChild(glowElement);
      }
      glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--spice-rgb-button), ${this.config.glowOpacity}) 0%, transparent 40%)`;
    }
    removeGlow(card) {
      const glowElement = card.querySelector(".card-glow");
      if (glowElement) {
        glowElement.style.background = "transparent";
      }
    }
    destroy() {
      this.cards.forEach((card) => {
        card.removeEventListener(
          "mousemove",
          this.handleMouseMove.bind(this, card)
        );
        card.removeEventListener(
          "mouseleave",
          this.handleMouseLeave.bind(this, card)
        );
        this.removeGlow(card);
        card.style.transform = "";
        card.style.transition = "";
      });
      this.initialized = false;
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
    }
    handleSettingsChange(event) {
      const { key, value } = event.detail || {};
      if (key === CARD_3D_LEVEL_KEY) {
        this.apply3DMode(value);
      }
    }
  };

  // src-js/managers/GlassmorphismManager.ts
  init_globalConfig();
  init_Year3000Utilities();
  var GlassmorphismManager = class _GlassmorphismManager {
    constructor(config = YEAR3000_CONFIG, utils = Year3000Utilities_exports, cssBatcher = null, performanceAnalyzer = null, settingsManager) {
      this.initialized = false;
      this.cssBatcher = null;
      this.performanceAnalyzer = null;
      this.observers = [];
      this.config = config;
      this.utils = utils;
      this.cssBatcher = cssBatcher;
      this.performanceAnalyzer = performanceAnalyzer;
      this.settingsManager = settingsManager;
      this.isSupported = this.detectBackdropFilterSupport();
      this.currentIntensity = "balanced";
      this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
      this.initialize();
    }
    static getInstance() {
      if (!_GlassmorphismManager.instance) {
        throw new Error("GlassmorphismManager instance not initialized");
      }
      return _GlassmorphismManager.instance;
    }
    async initialize() {
      const initialIntensity = this.settingsManager.get("sn-glassmorphism-level");
      this.applyGlassmorphismSettings(initialIntensity);
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
      this.initialized = true;
    }
    async healthCheck() {
      return { ok: true, details: "GlassmorphismManager is operational." };
    }
    updateAnimation(deltaTime) {
    }
    destroy() {
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
      this.observers.forEach((observer) => observer.disconnect());
      this.observers = [];
      this.initialized = false;
    }
    handleSettingsChange(event) {
      const customEvent = event;
      const { key, value } = customEvent.detail || {};
      if (key === GLASS_LEVEL_KEY || key === GLASS_LEVEL_OLD_KEY) {
        this.applyGlassmorphismSettings(value);
      }
    }
    detectBackdropFilterSupport() {
      try {
        return CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)");
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
        "sn-glass-intense"
      );
      body.classList.add(`sn-glass-${intensity}`);
      this.currentIntensity = intensity;
      this.updateGlassVariables(intensity);
    }
    updateGlassVariables(intensity) {
      const root = document.documentElement;
      const shouldReduceQuality = this.performanceAnalyzer?.shouldReduceQuality() || false;
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
    }
    updateGlassColors(primaryColor, secondaryColor) {
      if (this.currentIntensity === "disabled") return;
      const root = document.documentElement;
      const glassPrimary = this.convertToGlassColor(primaryColor, 0.1);
      const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);
      root.style.setProperty("--glass-background", glassPrimary);
      root.style.setProperty("--glass-border", glassSecondary);
    }
    convertToGlassColor(color, opacity) {
      try {
        if (typeof color !== "string") return `rgba(255, 255, 255, ${opacity})`;
        if (color.startsWith("rgb")) {
          const values = color.match(/\d+/g);
          if (values && values.length >= 3) {
            return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
          }
        }
        if (color.startsWith("#")) {
          const hex = color.slice(1);
          const r = parseInt(hex.substring(0, 2), 16);
          const g2 = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if (!isNaN(r) && !isNaN(g2) && !isNaN(b)) {
            return `rgba(${r}, ${g2}, ${b}, ${opacity})`;
          }
        }
        return `rgba(255, 255, 255, ${opacity})`;
      } catch (error) {
        return `rgba(255, 255, 255, ${opacity})`;
      }
    }
    checkPerformanceAndAdjust() {
      if (this.performanceAnalyzer?.shouldReduceQuality() || false) {
        if (this.currentIntensity === "intense") {
          this.applyGlassmorphismSettings("balanced");
        } else if (this.currentIntensity === "balanced" || this.currentIntensity === "moderate") {
          this.applyGlassmorphismSettings("minimal");
        }
      }
    }
    applyGlassmorphism(level) {
      const glassConfig = this.config.glassmorphism[level];
      if (!this.cssBatcher) return;
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-display",
        level === "disabled" ? "none" : "block"
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-blur",
        `${glassConfig.blur}px`
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-saturation",
        `${glassConfig.saturation}`
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-brightness",
        `${glassConfig.brightness}`
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-noise-opacity",
        `${glassConfig.noiseOpacity}`
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-border-opacity",
        `${glassConfig.borderOpacity}`
      );
      this.cssBatcher.queueCSSVariableUpdate(
        "--sn-glass-shadow-opacity",
        `${glassConfig.shadowOpacity}`
      );
      this.cssBatcher.flushCSSVariableBatch();
      if (this.config.enableDebug) {
        console.log(`\u{1F48E} [GlassmorphismManager] Applied level: ${level}`);
      }
    }
    // --------------------------------------------------------------------
    // Year3000System central settings broadcast hook
    // --------------------------------------------------------------------
    applyUpdatedSettings(key, value) {
      if (key === "sn-glassmorphism-level") {
        this.applyGlassmorphismSettings(value);
      }
    }
  };

  // src-js/core/year3000System.ts
  init_SettingsManager();

  // src-js/core/EventBus.ts
  var EventBus = class {
    constructor() {
      this.subscribers = {};
    }
    subscribe(topic, callback) {
      if (!this.subscribers[topic]) {
        this.subscribers[topic] = /* @__PURE__ */ new Set();
      }
      this.subscribers[topic].add(callback);
      return () => {
        if (this.subscribers[topic]) {
          this.subscribers[topic].delete(callback);
          if (this.subscribers[topic].size === 0) {
            delete this.subscribers[topic];
          }
        }
      };
    }
    publish(topic, payload) {
      if (this.subscribers[topic]) {
        this.subscribers[topic].forEach((callback) => {
          try {
            callback(payload);
          } catch (error) {
            console.error(
              `[EventBus] Error in subscriber for topic "${topic}":`,
              error
            );
          }
        });
      }
    }
    unsubscribe(topic, callback) {
      if (this.subscribers[topic]) {
        this.subscribers[topic].delete(callback);
        if (this.subscribers[topic].size === 0) {
          delete this.subscribers[topic];
        }
      }
    }
    destroy() {
      this.subscribers = {};
    }
  };
  var GlobalEventBus = new EventBus();
  var g = globalThis;
  if (!g.GlobalEventBus) {
    g.GlobalEventBus = GlobalEventBus;
  }

  // src-js/services/MusicSyncService.ts
  init_globalConfig();

  // src-js/utils/SpicetifyCompat.ts
  var SpicetifyCompat = class {
    /**
     * Get audio data with fallback handling
     * Uses correct Spicetify.getAudioData() API with fallback to legacy patterns
     */
    static async getAudioData() {
      try {
        if (typeof Spicetify !== "undefined" && Spicetify.getAudioData) {
          return await Spicetify.getAudioData();
        } else {
          console.warn("[SpicetifyCompat] Spicetify.getAudioData not available");
          return null;
        }
      } catch (error) {
        console.error("[SpicetifyCompat] Error fetching audio data:", error);
        return null;
      }
    }
    /**
     * Check if Spicetify APIs are available
     */
    static isAvailable() {
      return typeof Spicetify !== "undefined" && !!Spicetify.getAudioData;
    }
    /**
     * Retry wrapper for audio data fetching
     */
    static async getAudioDataWithRetry(retryDelay = 200, maxRetries = 10) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const audioData = await this.getAudioData();
          if (audioData) {
            return audioData;
          }
        } catch (error) {
          if (attempt < maxRetries - 1) {
            console.log(
              `[SpicetifyCompat] Retrying audio data fetch (${attempt + 1}/${maxRetries})...`
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else {
            console.warn(
              `[SpicetifyCompat] Audio data fetch failed after ${maxRetries} attempts:`,
              error
            );
          }
        }
      }
      return null;
    }
  };

  // src-js/services/MusicSyncService.ts
  init_StorageManager();
  init_Year3000Utilities();

  // src-js/services/GenreProfileManager.ts
  init_globalConfig();
  var GENRE_PROFILES = {
    electronic: { energyBoost: 1.1, beatEmphasis: 1.2, precision: 0.9 },
    dance: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
    house: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
    techno: { energyBoost: 1.15, beatEmphasis: 1.3, precision: 1 },
    trance: { energyBoost: 1.15, beatEmphasis: 1.1, precision: 0.85 },
    rock: { energyBoost: 1.05, intensityMultiplier: 1.1, dynamicRange: 1.1 },
    metal: { energyBoost: 1.15, intensityMultiplier: 1.2, dynamicRange: 1.2 },
    punk: { energyBoost: 1.2, intensityMultiplier: 1.1, precision: 0.8 },
    hiphop: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },
    rap: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },
    jazz: { adaptiveVariation: true, complexity: 1.2, smoothingFactor: 1.3 },
    classical: {
      gentleMode: true,
      dynamicRange: 1.4,
      tempoVariationHandling: "adaptive"
    },
    ambient: { subtleMode: true, intensityReduction: 0.7, smoothingFactor: 1.5 },
    pop: { energyBoost: 1.05, beatEmphasis: 1.1, precision: 0.85 },
    rnb: { grooveFactor: 1.25, smoothingFactor: 1.1 },
    soul: { grooveFactor: 1.3, smoothingFactor: 1.15 },
    default: {
      balanced: true,
      energyBoost: 1,
      beatEmphasis: 1,
      precision: 1
    }
  };
  var GenreProfileManager = class {
    constructor(dependencies = {}) {
      this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
      if (this.config.enableDebug) {
        console.log("\u{1F9EC} [GenreProfileManager] Initialized");
      }
    }
    _getGenreFromAudioFeatures(features) {
      if (!features) return "default";
      const { danceability, energy, acousticness, instrumentalness, tempo } = features;
      if (instrumentalness > 0.6 && acousticness < 0.2 && energy > 0.6) {
        if (tempo > 120) return "techno";
        return "electronic";
      }
      if (danceability > 0.7 && energy > 0.7) return "dance";
      if (acousticness > 0.7 && energy < 0.4) return "classical";
      if (acousticness > 0.5 && instrumentalness < 0.1) return "jazz";
      if (energy > 0.7 && instrumentalness < 0.1 && danceability > 0.5)
        return "rock";
      if (danceability > 0.7 && instrumentalness < 0.2 && energy > 0.5 && tempo < 110)
        return "hiphop";
      return "default";
    }
    getProfileForTrack(audioFeatures) {
      const genre = this._getGenreFromAudioFeatures(audioFeatures);
      const profile = GENRE_PROFILES[genre];
      if (this.config.enableDebug) {
        console.log(
          `[GenreProfileManager] Detected genre: '${genre}'. Applying profile.`
        );
      }
      if (profile) {
        return profile;
      }
      const defaultProfile = GENRE_PROFILES.default;
      if (defaultProfile) {
        return defaultProfile;
      }
      throw new Error(
        "[GenreProfileManager] Critical: Default genre profile is missing."
      );
    }
    /**
     * Public helper that returns the genre string detected for the given audio-features without
     * allocating a full profile. Useful for colour/palette routing.
     */
    detectGenre(features) {
      return this._getGenreFromAudioFeatures(features);
    }
  };

  // src-js/services/MusicSyncService.ts
  var MUSIC_SYNC_CONFIG = {
    enableDebug: true,
    enableBeatSynchronization: true,
    enableGenreAnalysis: true,
    enableMoodAdaptation: true,
    bpmCalculation: {
      useEnhancedAlgorithm: true,
      danceabilityWeight: 0.9,
      energyWeight: 0.6,
      bpmWeight: 0.6,
      energyThreshold: 0.5,
      danceabilityThreshold: 0.5,
      bpmThreshold: 0.8,
      maxBPM: 180,
      minBPM: 60
    },
    performance: {
      cacheSize: 100,
      cacheTTL: 3e5,
      maxRetries: 10,
      retryDelay: 200,
      enableMetrics: true,
      processingTimeTarget: 50
    },
    synchronization: {
      beatAccuracyTarget: 50,
      maxSyncDelay: 1e3,
      adaptiveQuality: true,
      predictiveCaching: true,
      debounceRapidChanges: 200
    },
    genreProfiles: {
      electronic: { intensityMultiplier: 1.2, precisionBoost: 1.1 },
      jazz: { smoothingFactor: 1.3, adaptiveVariation: true },
      classical: { gentleMode: true, tempoVariationHandling: "adaptive" },
      rock: { energyBoost: 1.15, consistentTiming: true },
      ambient: { subtleMode: true, intensityReduction: 0.7 },
      hiphop: { beatEmphasis: 1.25, rhythmPrecision: "high" },
      default: { balanced: true }
    },
    musicVisualSync: {
      enhancedBPM: {
        fallbacks: {
          tempo: 120,
          loudness: -5,
          key: 0,
          timeSignature: 4
        },
        danceabilityEstimation: {
          highDance: { min: 125, max: 145, value: 0.8 },
          mediumDance: { min: 100, max: 124, value: 0.7 },
          lowMediumDance: { min: 80, max: 99, value: 0.6 },
          lowDance: { value: 0.5 }
        },
        energyEstimation: {
          tempoRange: { min: 80, max: 160 },
          loudnessRange: { min: -15, max: 0 },
          tempoWeight: 0.6,
          loudnessWeight: 0.4
        }
      }
    }
  };
  var MusicSyncService = class {
    constructor(dependencies = {}) {
      this.isInitialized = false;
      this.currentTrack = null;
      this.audioData = null;
      this.currentTrackUri = null;
      this.latestProcessedData = null;
      // High-precision beat scheduling
      this.beatSchedulerTimer = null;
      this.nextBeatIndex = 0;
      this.currentSongBeats = [];
      this.songStartTimestamp = 0;
      this.metrics = {
        bpmCalculations: 0,
        beatSyncs: 0,
        cacheHits: 0,
        cacheMisses: 0,
        avgProcessingTime: 0,
        performance: [],
        errors: 0,
        updates: 0
      };
      this.unifiedCache = /* @__PURE__ */ new Map();
      this.subscribers = /* @__PURE__ */ new Map();
      this.beatSync = {
        lastBeatTime: 0,
        nextBeatTime: 0,
        beatInterval: 0,
        confidence: 0,
        isActive: false
      };
      this.performanceInterval = null;
      this.cacheCleanupInterval = null;
      // Increment this prefix whenever cache schema changes to avoid stale data
      this.CACHE_KEY_VERSION_PREFIX = "v3";
      /** Current unit beat direction vector (updated each beat). */
      this.currentBeatVector = { x: 0, y: 0 };
      this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
      this.utils = dependencies.Year3000Utilities || Year3000Utilities_exports;
      this.colorHarmonyEngine = dependencies.colorHarmonyEngine;
      this.settingsManager = dependencies.settingsManager;
      this.year3000System = dependencies.year3000System;
      this.genreProfileManager = dependencies.genreProfileManager || new GenreProfileManager({ YEAR3000_CONFIG: this.config });
      this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;
      this.userPreferences = this.loadUserPreferences();
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
        if (!SpicetifyCompat.isAvailable()) {
          console.warn(
            "[MusicSyncService] Spicetify audio data API not available at initialization. Some features may be limited."
          );
        }
        this.setupCacheManagement();
        if (MUSIC_SYNC_CONFIG.performance.enableMetrics) {
          this.setupPerformanceMonitoring();
        }
        this.isInitialized = true;
        if (this.config.enableDebug) {
          console.log("\u{1F31F} MusicSyncService initialized successfully!");
        }
      } catch (error) {
        console.error("\u274C MusicSyncService initialization failed:", error);
        this.metrics.errors++;
      }
    }
    // === SUBSCRIBER MANAGEMENT ===
    subscribe(systemInstance, systemName) {
      if (!systemInstance || typeof systemInstance.updateFromMusicAnalysis !== "function") {
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
          console.log(`[MusicSyncService] System unsubscribed: ${systemName}`);
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
      for (const [name, system] of this.subscribers) {
        try {
          if (system.initialized && typeof system.updateFromMusicAnalysis === "function") {
            system.updateFromMusicAnalysis(processedData, rawFeatures, trackUri);
          }
        } catch (error) {
          console.error(
            `[MusicSyncService] Error notifying subscriber ${name}:`,
            error
          );
          this.metrics.errors++;
        }
      }
    }
    // === DATA FETCHING & CACHING ===
    async fetchAudioData(options = {}) {
      const {
        retryDelay = MUSIC_SYNC_CONFIG.performance.retryDelay,
        maxRetries = MUSIC_SYNC_CONFIG.performance.maxRetries
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
        if (this.isValidAudioData(cached.audioData)) {
          this.metrics.cacheHits++;
          if (this.config.enableDebug) {
            console.log(
              `[MusicSyncService] Cache hit for audioData: ${cacheKey}`
            );
          }
          return cached.audioData;
        }
        this.unifiedCache.delete(cacheKey);
      }
      this.metrics.cacheMisses++;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const audioData = await SpicetifyCompat.getAudioData();
          if (this.isValidAudioData(audioData)) {
            this.setInCache(cacheKey, { audioData });
            return audioData;
          }
          if (this.config.enableDebug) {
            console.log(
              `[MusicSyncService] Audio analysis unavailable (attempt ${attempt + 1}/${maxRetries}). Retrying\u2026`
            );
          }
        } catch (error) {
          if (attempt === maxRetries - 1) {
            if (this.config.enableDebug) {
              console.warn(
                `[MusicSyncService] Audio data fetch error on final attempt:`,
                error
              );
            }
            this.metrics.errors++;
            return null;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
      return null;
    }
    async getAudioFeatures() {
      try {
        const currentTrack = Spicetify.Player.data?.item;
        if (!currentTrack?.uri) return null;
        const trackId = currentTrack.uri.split(":")[2] || "fallback";
        const cacheKey = this.generateCacheKey(trackId, "features");
        const cached = this.getFromCache(
          cacheKey
        );
        if (cached?.audioFeatures) {
          this.metrics.cacheHits++;
          if (this.config.enableDebug) {
            console.log(
              `[MusicSyncService] Cache hit for audioFeatures: ${cacheKey}`
            );
          }
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
          tempo: response.tempo
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
    generateCacheKey(identifier, type = "default") {
      return `${this.CACHE_KEY_VERSION_PREFIX}-${identifier}-${type}`;
    }
    getFromCache(key) {
      const cached = this.unifiedCache.get(key);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
      if (cached) {
        this.unifiedCache.delete(key);
      }
      return null;
    }
    setInCache(key, data) {
      this.unifiedCache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
    // === ENHANCED BPM CALCULATION ===
    async calculateEnhancedBPM(audioData, options = {}) {
      const startTime = performance.now();
      try {
        if (!audioData?.tempo) {
          if (this.config.enableDebug) {
            console.warn("[MusicSyncService] No BPM data available for track");
          }
          return this.getFallbackBPM();
        }
        const trackBPM = audioData.tempo;
        const config = {
          ...MUSIC_SYNC_CONFIG.bpmCalculation,
          ...options
        };
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
        const profile = this.genreProfileManager.getProfileForTrack(
          audioFeatures || void 0
        );
        const detectedGenre = this.genreProfileManager.detectGenre(
          audioFeatures || void 0
        );
        const enhancedBPM = this.computeAdvancedBPM({
          trackBPM,
          danceability,
          energy,
          valence,
          config,
          profile
        });
        const currentTrack = Spicetify.Player.data?.item || Spicetify.Player.data;
        const uriParts = currentTrack?.uri?.split(":") ?? [];
        const trackId = uriParts.length > 2 && uriParts[2] ? uriParts[2] : "fallback";
        const cacheKey = this.generateCacheKey(trackId, "bpm");
        this.setInCache(cacheKey, {
          bpm: enhancedBPM,
          audioFeatures
        });
        this.metrics.bpmCalculations++;
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
    computeAdvancedBPM(params) {
      const { trackBPM, danceability, energy, valence, config, profile } = params;
      const {
        danceabilityWeight,
        energyWeight,
        bpmWeight,
        energyThreshold,
        danceabilityThreshold,
        bpmThreshold,
        maxBPM,
        minBPM
      } = config;
      const normalizedBPM = Math.min(trackBPM / 120, 2);
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
      let valenceInfluence = 1;
      if (valence > 0.6) {
        valenceInfluence = 1.05;
      } else if (valence < 0.4 && energy < 0.5) {
        valenceInfluence = 0.95;
      }
      const weightSum = adjustedDanceabilityWeight + adjustedEnergyWeight + adjustedBpmWeight;
      const weightedAverage = (danceability * adjustedDanceabilityWeight + energy * adjustedEnergyWeight + normalizedBPM * adjustedBpmWeight) / weightSum;
      let enhancedBPM = weightedAverage * 120 * valenceInfluence;
      if (profile.beatEmphasis) {
        enhancedBPM *= profile.beatEmphasis;
      }
      enhancedBPM = Math.max(minBPM, Math.min(maxBPM, enhancedBPM));
      return Math.round(enhancedBPM * 100) / 100;
    }
    validateBPM(bpm) {
      const { minBPM, maxBPM } = MUSIC_SYNC_CONFIG.bpmCalculation;
      return Math.max(minBPM, Math.min(maxBPM * 2, Math.round(bpm * 100) / 100));
    }
    getFallbackBPM() {
      return 75;
    }
    // === FEATURE ESTIMATION & FALLBACKS ===
    estimateDanceabilityFromTempo(tempo) {
      const config = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.danceabilityEstimation;
      if (tempo >= config.highDance.min && tempo <= config.highDance.max) {
        return config.highDance.value;
      }
      if (tempo >= config.mediumDance.min && tempo <= config.mediumDance.max) {
        return config.mediumDance.value;
      }
      if (tempo >= config.lowMediumDance.min && tempo <= config.lowMediumDance.max) {
        return config.lowMediumDance.value;
      }
      return config.lowDance.value;
    }
    estimateEnergyFromTempoLoudness(tempo, loudness) {
      const config = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.energyEstimation;
      const tempoFactor = Math.max(
        0,
        Math.min(
          1,
          (tempo - config.tempoRange.min) / (config.tempoRange.max - config.tempoRange.min)
        )
      );
      const loudnessFactor = Math.max(
        0,
        Math.min(
          1,
          (loudness - config.loudnessRange.min) / (config.loudnessRange.max - config.loudnessRange.min)
        )
      );
      return tempoFactor * config.tempoWeight + loudnessFactor * config.loudnessWeight;
    }
    estimateValenceFromKey(key) {
      const majorKeys = [0, 2, 4, 5, 7, 9, 11];
      return majorKeys.includes(key) ? 0.6 : 0.4;
    }
    getFallbackProcessedData(trackUri) {
      const fallbacks = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks;
      const fallbackBeatInterval = 6e4 / fallbacks.tempo;
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
        beatInterval: fallbackBeatInterval,
        bmpCalculationMethod: "fallback",
        dataSource: "fallback"
      };
    }
    // === MAIN PROCESSING PIPELINE ===
    async processAudioFeatures(rawSpicetifyAudioFeatures, trackUri, trackDurationMs) {
      if (!this.isInitialized) {
        console.warn("[MusicSyncService] Not initialized, skipping processing.");
        return;
      }
      this.stopBeatScheduler();
      this.currentTrackUri = trackUri;
      const cacheKey = this.generateCacheKey(trackUri, "processed");
      const cached = this.getFromCache(cacheKey);
      if (cached?.processedData) {
        this.notifySubscribers(cached.processedData, null, trackUri);
        return;
      }
      try {
        let audioAnalysisData = rawSpicetifyAudioFeatures;
        if (!audioAnalysisData) {
          audioAnalysisData = await this.fetchAudioData();
        }
        if (!audioAnalysisData) {
          throw new Error("Failed to fetch or receive audio data.");
        }
        if (audioAnalysisData.beats && audioAnalysisData.beats.length > 0) {
          this.currentSongBeats = audioAnalysisData.beats;
          this.songStartTimestamp = Date.now();
          this.nextBeatIndex = 0;
          this.scheduleNextBeatEvent();
        }
        const enhancedBPM = await this.calculateEnhancedBPM(audioAnalysisData);
        const beatInterval = enhancedBPM > 0 ? 6e4 / enhancedBPM : 0;
        const trackData = audioAnalysisData;
        const {
          tempo = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.tempo,
          loudness = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.loudness,
          key = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.key,
          time_signature: timeSignature = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.timeSignature
        } = trackData;
        const audioFeatures = await this.getAudioFeatures();
        const estimatedDanceability = audioFeatures?.danceability ?? this.estimateDanceabilityFromTempo(tempo);
        const estimatedEnergy = audioFeatures?.energy ?? this.estimateEnergyFromTempoLoudness(tempo, loudness);
        const estimatedValence = audioFeatures?.valence ?? this.estimateValenceFromKey(key);
        const artisticMultipliers = this.config.getCurrentMultipliers?.() || {
          musicEnergyBoost: 1,
          visualIntensityBase: 1
        };
        const processedEnergy = Math.max(
          0.1,
          Math.min(
            1,
            estimatedEnergy * (artisticMultipliers.musicEnergyBoost || 1)
          )
        );
        const baseIntensity = estimatedEnergy * 0.6 + estimatedDanceability * 0.4;
        const visualIntensity = baseIntensity * (artisticMultipliers.visualIntensityBase || 1);
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
        const animationSpeedFactor = Math.max(0.5, 0.8 + visualIntensity * 0.4);
        const genreTag = this.genreProfileManager.detectGenre(
          audioFeatures || void 0
        );
        const processedData = {
          trackUri,
          timestamp: Date.now(),
          tempo,
          loudness,
          key,
          timeSignature,
          duration: trackDurationMs,
          estimatedDanceability,
          estimatedEnergy,
          estimatedValence,
          energy: estimatedEnergy,
          valence: estimatedValence,
          processedEnergy,
          visualIntensity,
          moodIdentifier,
          baseBPM: tempo,
          enhancedBPM,
          beatInterval,
          bmpCalculationMethod: "unified-service",
          dataSource: "unified-music-sync-service",
          beatOccurred: false,
          animationSpeedFactor,
          genre: genreTag
        };
        this.setInCache(cacheKey, { processedData });
        this.latestProcessedData = processedData;
        if (this.config.enableDebug) {
          console.log("\u{1F3B5} [MusicSyncService] Processed music data:", {
            baseTempo: tempo,
            enhancedBPM,
            mood: moodIdentifier,
            energy: estimatedEnergy.toFixed(2),
            visualIntensity: visualIntensity.toFixed(2)
          });
        }
        this.notifySubscribers(
          processedData,
          rawSpicetifyAudioFeatures,
          trackUri
        );
        GlobalEventBus.publish("beat/frame", {
          timestamp: performance.now(),
          trackUri,
          processedData,
          rawData: rawSpicetifyAudioFeatures
        });
        GlobalEventBus.publish("beat/bpm", { bpm: processedData.enhancedBPM });
        GlobalEventBus.publish("beat/intensity", {
          intensity: processedData.visualIntensity
        });
        if (this.config.enableDebug) {
          console.log(
            "[MusicSyncService] Successfully processed audio features.",
            {
              baseTempo: tempo,
              enhancedBPM,
              mood: moodIdentifier,
              energy: estimatedEnergy.toFixed(2),
              visualIntensity: visualIntensity.toFixed(2)
            }
          );
        }
      } catch (error) {
        console.error("[MusicSyncService] Processing failed:", error);
        this.metrics.errors++;
        const fallbackData = this.getFallbackProcessedData(trackUri);
        this.latestProcessedData = fallbackData;
        this.notifySubscribers(fallbackData, null, trackUri);
      }
    }
    /**
     * Re-extract colours & (optionally) recompute beat analysis for the current
     * track.  When `force === true` the method runs even if the track URI hasn't
     * changed (used after live settings updates so gradients repaint instantly).
     */
    async processSongUpdate(force = false) {
      const trackUri = Spicetify.Player?.data?.item?.uri;
      if (!trackUri) return;
      if (!force && trackUri === this.currentTrackUri) {
        return;
      }
      this.invalidateTrackCaches(trackUri);
      try {
        const trackDuration = Spicetify.Player.data?.item?.duration?.milliseconds || 0;
        const [audioFeatures, rawColors] = await Promise.all([
          this.getAudioFeatures(),
          Spicetify.colorExtractor(trackUri)
        ]);
        const colors = this.utils.sanitizeColorMap(
          rawColors || {}
        );
        if (this.colorHarmonyEngine && this.year3000System && Object.keys(colors).length > 0) {
          const blendedColors = this.colorHarmonyEngine.blendWithCatppuccin(colors);
          this.year3000System.applyColorsToTheme(blendedColors);
        }
        if (audioFeatures) {
          const provisionalAudioData = this.convertFeaturesToAudioData(audioFeatures);
          await this.processAudioFeatures(
            provisionalAudioData,
            trackUri,
            trackDuration
          );
        }
        (async () => {
          const fullAnalysis = await this.fetchAudioData();
          if (this.isValidAudioData(fullAnalysis)) {
            await this.processAudioFeatures(
              fullAnalysis,
              trackUri,
              trackDuration
            );
          }
        })();
      } catch (error) {
        console.error(
          `[MusicSyncService] Error processing song update for ${trackUri}:`,
          error
        );
        this.metrics.errors++;
      }
    }
    // === LIFECYCLE & HELPERS ===
    setupCacheManagement() {
      this.cacheCleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, cacheEntry] of this.unifiedCache.entries()) {
          if (now - cacheEntry.timestamp > this.cacheTTL) {
            this.unifiedCache.delete(key);
          }
        }
      }, this.cacheTTL);
    }
    setupPerformanceMonitoring() {
      this.performanceInterval = setInterval(() => {
        if (this.metrics.performance.length > 0) {
          const avg = this.metrics.performance.reduce((a, b) => a + b, 0) / this.metrics.performance.length;
          this.metrics.avgProcessingTime = avg;
          this.metrics.performance = [];
        }
      }, 6e4);
    }
    loadUserPreferences() {
      try {
        const prefs = StorageManager.get("sn-music-sync-prefs");
        return prefs ? JSON.parse(prefs) : {};
      } catch (e) {
        return {};
      }
    }
    saveUserPreferences() {
      try {
        StorageManager.set(
          "sn-music-sync-prefs",
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
    updateConfiguration(newConfig) {
      const previousConfig = { ...MUSIC_SYNC_CONFIG };
      Object.assign(MUSIC_SYNC_CONFIG, newConfig);
      if (this.config.enableDebug) {
        console.log("\u{1F3B5} [MusicSyncService] Configuration updated", {
          from: previousConfig,
          to: MUSIC_SYNC_CONFIG
        });
      }
      this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;
      if (previousConfig.performance.enableMetrics !== MUSIC_SYNC_CONFIG.performance.enableMetrics) {
        if (MUSIC_SYNC_CONFIG.performance.enableMetrics) {
          this.setupPerformanceMonitoring();
        } else if (this.performanceInterval) {
          clearInterval(this.performanceInterval);
          this.performanceInterval = null;
        }
      }
    }
    destroy() {
      this.stopBeatScheduler();
      if (this.performanceInterval) clearInterval(this.performanceInterval);
      if (this.cacheCleanupInterval) clearInterval(this.cacheCleanupInterval);
      this.subscribers.clear();
      this.unifiedCache.clear();
      this.isInitialized = false;
      this.latestProcessedData = null;
      this.metrics = {
        bpmCalculations: 0,
        beatSyncs: 0,
        cacheHits: 0,
        cacheMisses: 0,
        avgProcessingTime: 0,
        performance: [],
        errors: 0,
        updates: 0
      };
      this.cacheCleanupInterval = null;
    }
    setColorHarmonyEngine(engine) {
      this.colorHarmonyEngine = engine;
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3B5} [MusicSyncService] ColorHarmonyEngine dependency injected."
        );
      }
    }
    getLatestProcessedData() {
      return this.latestProcessedData;
    }
    /**
     * Get the latest beat vector (unit direction) for visual systems that need
     * directional rhythm cues. Falls back to {0,0} when unavailable.
     */
    getCurrentBeatVector() {
      return this.currentBeatVector;
    }
    stopBeatScheduler() {
      if (this.beatSchedulerTimer) {
        clearTimeout(this.beatSchedulerTimer);
        this.beatSchedulerTimer = null;
      }
    }
    triggerBeatEvent() {
      const GOLDEN_RATIO = 0.61803398875;
      const angle = this.nextBeatIndex * GOLDEN_RATIO % 1 * Math.PI * 2;
      this.currentBeatVector = { x: Math.cos(angle), y: Math.sin(angle) };
      if (this.latestProcessedData) {
        const beatUpdate = {
          ...this.latestProcessedData,
          beatOccurred: true,
          beatVector: this.currentBeatVector
        };
        this.notifySubscribers(beatUpdate, null, this.currentTrackUri);
      }
      this.nextBeatIndex++;
      this.scheduleNextBeatEvent();
    }
    scheduleNextBeatEvent() {
      if (this.nextBeatIndex >= this.currentSongBeats.length) {
        return;
      }
      const nextBeat = this.currentSongBeats[this.nextBeatIndex];
      const timeSinceSongStart = Date.now() - this.songStartTimestamp;
      const delay = nextBeat.start * 1e3 - timeSinceSongStart;
      if (delay >= 0) {
        this.beatSchedulerTimer = setTimeout(
          () => this.triggerBeatEvent(),
          delay
        );
      } else {
        this.nextBeatIndex++;
        this.scheduleNextBeatEvent();
      }
    }
    /**
     * Validate that the returned audio analysis object actually contains usable
     * information (primarily tempo). Spotify may return an empty object when the
     * analysis is not ready yet – treating that as valid poisons the cache.
     */
    isValidAudioData(data) {
      return !!data && typeof data.tempo === "number" && data.tempo > 0;
    }
    /**
     * Remove any cached entries (audioData, features, bpm, processed) belonging
     * to the provided track URI. Useful when switching tracks to ensure we do
     * not reuse stale or invalid data cached under the previous song.
     */
    invalidateTrackCaches(trackUri) {
      if (!trackUri) return;
      for (const key of this.unifiedCache.keys()) {
        if (key.includes(trackUri)) {
          this.unifiedCache.delete(key);
        }
      }
    }
    /**
     * Convert the lightweight `audio-features` payload into a pseudo `AudioData`
     * object so the rest of the pipeline (which expects full analysis) can work
     * immediately. Missing properties are filled with sensible defaults.
     */
    convertFeaturesToAudioData(features) {
      const fb = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks;
      return {
        tempo: features.tempo,
        energy: features.energy,
        valence: features.valence,
        loudness: fb.loudness,
        key: fb.key,
        time_signature: fb.timeSignature,
        danceability: features.danceability,
        acousticness: features.acousticness,
        instrumentalness: features.instrumentalness,
        speechiness: 0,
        liveness: 0,
        mode: 0
        // Optional arrays left undefined – beat grid will arrive later
      };
    }
  };

  // src-js/utils/PaletteExtensionManager.ts
  var GENRE_PALETTE_HINTS = {
    jazz: { temperatureShift: 15, saturationBoost: 1.1, warmth: 0.8 },
    electronic: { temperatureShift: -10, saturationBoost: 1.2, warmth: 0.2 },
    classical: { temperatureShift: 5, saturationBoost: 0.9, warmth: 0.6 },
    rock: { temperatureShift: 0, saturationBoost: 1.15, warmth: 0.5 },
    ambient: { temperatureShift: -5, saturationBoost: 0.8, warmth: 0.3 },
    hiphop: { temperatureShift: 8, saturationBoost: 1.25, warmth: 0.7 },
    pop: { temperatureShift: 0, saturationBoost: 1, warmth: 0.5 },
    metal: { temperatureShift: -15, saturationBoost: 1.3, warmth: 0.1 },
    indie: { temperatureShift: 10, saturationBoost: 0.95, warmth: 0.6 },
    default: { temperatureShift: 0, saturationBoost: 1, warmth: 0.5 }
  };
  var PaletteExtensionManager = class {
    constructor(config, utils) {
      this.paletteCache = {};
      this.cacheTTL = 3e5;
      // 5 minutes
      this.maxCacheSize = 50;
      this.config = config;
      this.utils = utils;
    }
    // TODO: Phase 3 - Load custom palette from JSON with validation
    async loadCustomPalette(paletteId, source) {
      const cached = this.paletteCache[paletteId];
      if (cached && Date.now() - cached.timestamp < this.cacheTTL && cached.isValid) {
        if (this.config.enableDebug) {
          console.log(
            `[PaletteExtensionManager] Cache hit for palette: ${paletteId}`
          );
        }
        return cached.palette;
      }
      try {
        const fallbackPalette = this.generateFallbackPalette(paletteId);
        if (this.validatePalette(fallbackPalette)) {
          this.cachePalette(paletteId, fallbackPalette, true);
          return fallbackPalette;
        }
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            `[PaletteExtensionManager] Failed to load palette ${paletteId}:`,
            error
          );
        }
      }
      return null;
    }
    // TODO: Phase 3 - Generate fallback palette for unknown themes
    generateFallbackPalette(themeName) {
      const root = this.utils.getRootStyle();
      const computedStyle = getComputedStyle(root);
      const baseColor = computedStyle.getPropertyValue("--spice-main").trim() || computedStyle.getPropertyValue("--spice-base").trim() || "#1e1e2e";
      const accentColor = (
        // Prefer Year 3000 dynamic accent if it's already available, else fall back to spice button, then to dynamic accent fallback.
        computedStyle.getPropertyValue("--sn-gradient-accent").trim() || computedStyle.getPropertyValue("--spice-button").trim() || computedStyle.getPropertyValue("--sn-dynamic-accent").trim() || computedStyle.getPropertyValue("--spice-accent").trim() || "#8caaee"
      );
      const baseRgb = this.utils.hexToRgb(
        baseColor.startsWith("#") ? baseColor : `#${baseColor}`
      );
      const accentRgb = this.utils.hexToRgb(
        accentColor.startsWith("#") ? accentColor : `#${accentColor}`
      );
      if (!baseRgb || !accentRgb) {
        const dynamicAccent = computedStyle.getPropertyValue("--sn-dynamic-accent").trim();
        const dynamicBase = computedStyle.getPropertyValue("--spice-base").trim();
        return {
          name: themeName,
          version: "1.0.0",
          accents: {
            mauve: dynamicAccent || "#ca9ee6",
            pink: "#f4b8e4",
            blue: dynamicAccent || "#8caaee",
            sapphire: "#85c1dc",
            sky: "#99d1db",
            teal: "#81c8be",
            green: "#a6d189",
            yellow: "#e5c890",
            peach: "#ef9f76",
            red: "#e78284",
            lavender: "#babbf1"
          },
          neutrals: {
            base: dynamicBase || "#1e1e2e",
            surface0: "#313244",
            surface1: "#45475a",
            surface2: "#585b70",
            overlay0: "#6c7086",
            overlay1: "#7f849c",
            overlay2: "#9399b2",
            text: "#cdd6f4"
          },
          metadata: {
            author: "PaletteExtensionManager",
            description: `Generated fallback for ${themeName}`,
            temperature: "neutral"
          }
        };
      }
      const baseHsl = this.utils.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
      const accentHsl = this.utils.rgbToHsl(
        accentRgb.r,
        accentRgb.g,
        accentRgb.b
      );
      return {
        name: themeName,
        version: "1.0.0",
        accents: this.generateAccentVariations(accentHsl),
        neutrals: this.generateNeutralVariations(baseHsl),
        metadata: {
          author: "PaletteExtensionManager",
          description: `Generated palette for ${themeName}`,
          temperature: this.detectTemperature(baseHsl, accentHsl)
        }
      };
    }
    // TODO: Phase 3 - Apply genre-aware modifications to palette
    applyGenreAwareModifications(palette, genre) {
      const genreHints = GENRE_PALETTE_HINTS[genre] || GENRE_PALETTE_HINTS.default;
      if (this.config.enableDebug) {
        console.log(
          `[PaletteExtensionManager] Applying ${genre} hints to palette:`,
          genreHints
        );
      }
      const modifiedPalette = {
        ...palette,
        accents: {},
        neutrals: {},
        metadata: {
          ...palette.metadata,
          genre: [...palette.metadata?.genre || [], genre]
        }
      };
      for (const [key, color] of Object.entries(palette.accents)) {
        modifiedPalette.accents[key] = this.applyGenreColorModification(
          color,
          genreHints.temperatureShift,
          genreHints.saturationBoost
        );
      }
      for (const [key, color] of Object.entries(palette.neutrals)) {
        modifiedPalette.neutrals[key] = this.applyGenreColorModification(
          color,
          genreHints.temperatureShift * 0.3,
          // Less intense for neutrals
          genreHints.saturationBoost * 0.7
        );
      }
      return modifiedPalette;
    }
    // TODO: Phase 3 - Validate palette structure and required properties
    validatePalette(palette) {
      if (!palette || typeof palette !== "object") return false;
      if (!palette.name || typeof palette.name !== "string") return false;
      if (!palette.version || typeof palette.version !== "string") return false;
      if (!palette.accents || typeof palette.accents !== "object") return false;
      if (!palette.neutrals || typeof palette.neutrals !== "object") return false;
      const allColors = [
        ...Object.values(palette.accents),
        ...Object.values(palette.neutrals)
      ];
      for (const color of allColors) {
        if (typeof color !== "string" || !this.isValidHexColor(color)) {
          return false;
        }
      }
      return true;
    }
    // TODO: Phase 3 - Cache management
    cachePalette(paletteId, palette, isValid) {
      if (Object.keys(this.paletteCache).length >= this.maxCacheSize) {
        const oldestEntry = Object.entries(this.paletteCache).sort(
          ([, aVal], [, bVal]) => aVal.timestamp - bVal.timestamp
        )[0];
        const oldestKey = oldestEntry?.[0];
        if (oldestKey && this.paletteCache[oldestKey]) {
          delete this.paletteCache[oldestKey];
        }
      }
      this.paletteCache[paletteId] = {
        palette,
        timestamp: Date.now(),
        isValid
      };
    }
    // TODO: Phase 3 - Generate accent color variations
    generateAccentVariations(baseHsl) {
      const variations = {};
      const hueShifts = [0, 30, 60, 120, 180, 210, 240, 300, 330, 45, 90];
      const names = [
        "primary",
        "secondary",
        "tertiary",
        "complement",
        "opposite",
        "warm1",
        "cool1",
        "accent1",
        "accent2",
        "highlight",
        "emphasis"
      ];
      hueShifts.forEach((shift, index) => {
        const name = names[index] || `variant${index}`;
        const adjustedHue = (baseHsl.h + shift) % 360;
        const rgb = this.utils.hslToRgb(adjustedHue, baseHsl.s, baseHsl.l);
        if (rgb) {
          variations[name] = this.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
        }
      });
      return variations;
    }
    // TODO: Phase 3 - Generate neutral color variations
    generateNeutralVariations(baseHsl) {
      const neutrals = {};
      const lightnessLevels = [
        { name: "base", l: baseHsl.l },
        { name: "surface0", l: Math.min(95, baseHsl.l + 10) },
        { name: "surface1", l: Math.min(90, baseHsl.l + 20) },
        { name: "surface2", l: Math.min(85, baseHsl.l + 30) },
        { name: "overlay0", l: Math.min(80, baseHsl.l + 40) },
        { name: "overlay1", l: Math.min(75, baseHsl.l + 50) },
        { name: "text", l: Math.min(95, baseHsl.l + 60) }
      ];
      lightnessLevels.forEach((level) => {
        const rgb = this.utils.hslToRgb(
          baseHsl.h,
          Math.max(0, baseHsl.s - 20),
          level.l
        );
        if (rgb) {
          neutrals[level.name] = this.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
        }
      });
      return neutrals;
    }
    // TODO: Phase 3 - Detect color temperature
    detectTemperature(baseHsl, accentHsl) {
      const avgHue = (baseHsl.h + accentHsl.h) / 2;
      if (avgHue >= 0 && avgHue <= 60 || avgHue >= 300 && avgHue <= 360) {
        return "warm";
      } else if (avgHue >= 120 && avgHue <= 240) {
        return "cool";
      } else {
        return "neutral";
      }
    }
    // TODO: Phase 3 - Apply genre-specific color modifications
    applyGenreColorModification(hexColor, temperatureShift, saturationBoost) {
      const rgb = this.utils.hexToRgb(hexColor);
      if (!rgb) return hexColor;
      const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      const adjustedHue = (hsl.h + temperatureShift + 360) % 360;
      const adjustedSaturation = Math.max(
        0,
        Math.min(100, hsl.s * saturationBoost)
      );
      const modifiedRgb = this.utils.hslToRgb(
        adjustedHue,
        adjustedSaturation,
        hsl.l
      );
      if (modifiedRgb) {
        return this.utils.rgbToHex(modifiedRgb.r, modifiedRgb.g, modifiedRgb.b);
      }
      return hexColor;
    }
    // TODO: Phase 3 - Validate hex color format
    isValidHexColor(color) {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    }
    // TODO: Phase 3 - Public API for getting genre hints
    getGenreHints(genre) {
      return GENRE_PALETTE_HINTS[genre] || GENRE_PALETTE_HINTS.default;
    }
    // TODO: Phase 3 - Clear cache
    clearCache() {
      this.paletteCache = {};
      if (this.config.enableDebug) {
        console.log("[PaletteExtensionManager] Palette cache cleared");
      }
    }
  };

  // src-js/systems/ColorHarmonyEngine.ts
  init_Year3000Utilities();

  // src-js/systems/BaseVisualSystem.ts
  init_globalConfig();

  // src-js/utils/VisualCanvasFactory.ts
  function detectWebGPUSupport() {
    if (!navigator.gpu) {
      return false;
    }
    try {
      return typeof navigator.gpu.requestAdapter === "function";
    } catch (e) {
      return false;
    }
  }
  function detectWebGL2Support() {
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2");
      if (!gl) return false;
      const hasRequiredExtensions = gl.getExtension("EXT_color_buffer_float") !== null;
      return true;
    } catch (e) {
      return false;
    }
  }
  async function createWebGPUContext(canvas, options) {
    try {
      if (!navigator.gpu) return null;
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: "high-performance"
      });
      if (!adapter) return null;
      const device = await adapter.requestDevice();
      const context = canvas.getContext("webgpu");
      if (!context || !("configure" in context)) return null;
      const gpuContext = context;
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
      gpuContext.configure({
        device,
        format: canvasFormat,
        alphaMode: options.alpha ? "premultiplied" : "opaque"
      });
      return {
        canvas,
        ctx: gpuContext,
        type: "webgpu",
        capabilities: {
          supportsGPUAcceleration: true,
          supports3D: true,
          maxTextureSize: adapter.limits.maxTextureDimension2D || 8192,
          preferredFormat: canvasFormat
        }
      };
    } catch (error) {
      console.warn(
        "[VisualCanvasFactory] WebGPU context creation failed:",
        error
      );
      return null;
    }
  }
  function createWebGL2Context(canvas, options) {
    try {
      const contextOptions = {
        alpha: options.alpha ?? true,
        antialias: options.antialias ?? true,
        preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      };
      const gl = canvas.getContext(
        "webgl2",
        contextOptions
      );
      if (!gl) return null;
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      return {
        canvas,
        ctx: gl,
        type: "webgl2",
        capabilities: {
          supportsGPUAcceleration: true,
          supports3D: true,
          maxTextureSize
        }
      };
    } catch (error) {
      console.warn(
        "[VisualCanvasFactory] WebGL2 context creation failed:",
        error
      );
      return null;
    }
  }
  function create2DContext(canvas, options) {
    const contextOptions = {
      alpha: options.alpha ?? true,
      desynchronized: true
      // Optimize for animations
    };
    const ctx = canvas.getContext(
      "2d",
      contextOptions
    );
    return {
      canvas,
      ctx,
      type: "2d",
      capabilities: {
        supportsGPUAcceleration: false,
        supports3D: false
      }
    };
  }
  async function createOptimizedCanvas(options) {
    const canvas = document.createElement("canvas");
    canvas.id = options.id;
    canvas.width = options.width ?? window.innerWidth;
    canvas.height = options.height ?? window.innerHeight;
    const fallbackChain = options.fallbackChain ?? ["webgpu", "webgl2", "2d"];
    if (options.preferredType) {
      const chain = [
        options.preferredType,
        ...fallbackChain.filter((t) => t !== options.preferredType)
      ];
      fallbackChain.splice(0, fallbackChain.length, ...chain);
    }
    for (const contextType of fallbackChain) {
      let result = null;
      switch (contextType) {
        case "webgpu":
          if (detectWebGPUSupport()) {
            result = await createWebGPUContext(canvas, options);
          }
          break;
        case "webgl2":
          if (detectWebGL2Support()) {
            result = createWebGL2Context(canvas, options);
          }
          break;
        case "2d":
          result = create2DContext(canvas, options);
          break;
      }
      if (result) {
        return result;
      }
    }
    return create2DContext(canvas, options);
  }
  function detectRenderingCapabilities() {
    const webgpu = detectWebGPUSupport();
    const webgl2 = detectWebGL2Support();
    let recommendedType = "2d";
    if (webgpu) {
      recommendedType = "webgpu";
    } else if (webgl2) {
      recommendedType = "webgl2";
    }
    return { webgpu, webgl2, recommendedType };
  }

  // src-js/systems/BaseVisualSystem.ts
  init_Year3000Utilities();

  // src-js/utils/visualPerformance.ts
  function selectPerformanceProfile(quality, performanceProfiles, opts = {}) {
    const { trace } = opts;
    if (!performanceProfiles || typeof performanceProfiles !== "object") {
      trace?.(
        "[visualPerformance] No performanceProfiles provided \u2013 skipping selection"
      );
      return null;
    }
    let selected = performanceProfiles[quality];
    if (!selected) {
      trace?.(
        `[visualPerformance] Profile '${quality}' not found, falling back to 'balanced'`
      );
      selected = performanceProfiles["balanced"];
    }
    if (!selected) {
      const firstKey = Object.keys(
        performanceProfiles
      )[0];
      selected = performanceProfiles[firstKey];
      trace?.(
        `[visualPerformance] Using first available profile '${firstKey}' as fallback`
      );
    }
    return selected;
  }

  // src-js/systems/BaseVisualSystem.ts
  var BaseVisualSystem = class {
    constructor(config = YEAR3000_CONFIG, utils = Year3000Utilities_exports, performanceMonitor, musicSyncService, settingsManager) {
      this._initializationStartTime = null;
      // GPU-accelerated canvas support
      this.canvasCapabilities = null;
      this.activeCanvasResults = /* @__PURE__ */ new Map();
      this.config = config;
      this.utils = utils;
      this.performanceMonitor = performanceMonitor;
      this.musicSyncService = musicSyncService;
      this.settingsManager = settingsManager;
      this.systemName = this.constructor.name;
      this.initialized = false;
      this.isActive = false;
      this.currentPerformanceProfile = {};
      this.metrics = {
        initializationTime: 0,
        updates: 0,
        errors: 0
      };
      this._resizeHandler = null;
      this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Constructor`);
      }
    }
    // Replace the current skeletal `initialize` method with this complete, multi-phase version.
    async initialize() {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Initializing...`);
        this._initializationStartTime = this.performanceMonitor.startTiming(
          `initialize_${this.systemName}`
        );
      }
      if (this.settingsManager) {
        document.addEventListener(
          "year3000SystemSettingsChanged",
          this.boundHandleSettingsChange
        );
        try {
          const detectorInstance = globalThis.year3000System?.deviceCapabilityDetector;
          let quality = "balanced";
          if (detectorInstance?.isInitialized) {
            quality = detectorInstance.recommendPerformanceQuality();
          }
          this.performanceMonitor?.emitTrace?.(
            `[${this.systemName}] Auto-selected performance quality '${quality}' based on device capability.`
          );
          this._applyPerformanceProfile(quality);
        } catch (e) {
          this.performanceMonitor?.emitTrace?.(
            `[${this.systemName}] Device capability detection failed; defaulting to 'balanced'.`,
            e
          );
          this._applyPerformanceProfile("balanced");
        }
      }
      await this._performSystemSpecificInitialization();
      this.initialized = true;
      this.isActive = true;
      if (this.musicSyncService) {
        if (this._validateDependenciesForSubscription()) {
          this.musicSyncService.subscribe(this, this.systemName);
          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Subscribed to MusicSyncService.`);
          }
        } else {
          console.warn(
            `[${this.systemName}] Dependency validation failed; subscription skipped.`
          );
        }
      }
      if (this.config.enableDebug && this._initializationStartTime !== null) {
        this.performanceMonitor.endTiming(
          `initialize_${this.systemName}`,
          this._initializationStartTime
        );
        console.log(`[${this.systemName}] Initialization complete.`);
      }
    }
    // Add new virtual methods for subclass extension.
    // These provide safe hooks for custom initialization logic.
    async _performSystemSpecificInitialization() {
      this.canvasCapabilities = detectRenderingCapabilities();
      if (this.canvasCapabilities) {
        this.performanceMonitor?.emitTrace?.(
          `[${this.systemName}] Canvas capabilities detected: WebGPU=${this.canvasCapabilities.webgpu}, WebGL2=${this.canvasCapabilities.webgl2}, Recommended=${this.canvasCapabilities.recommendedType}`
        );
      }
    }
    _validateDependenciesForSubscription() {
      if (typeof this.updateFromMusicAnalysis !== "function") {
        console.error(
          `[${this.systemName}] Missing updateFromMusicAnalysis method.`
        );
        return false;
      }
      if (!this.initialized) {
        console.warn(`[${this.systemName}] System not initialized.`);
        return false;
      }
      return this._performAdditionalDependencyValidation();
    }
    _performAdditionalDependencyValidation() {
      return true;
    }
    // Replace the current skeletal `destroy` method with this complete version for proper cleanup.
    destroy() {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Destroying...`);
      }
      try {
        this.initialized = false;
        this.isActive = false;
        if (this.musicSyncService) {
          this.musicSyncService.unsubscribe(this.systemName);
        }
        if (this.settingsManager && this.boundHandleSettingsChange) {
          document.removeEventListener(
            "year3000SystemSettingsChanged",
            this.boundHandleSettingsChange
          );
        }
        if (this._resizeHandler) {
          window.removeEventListener("resize", this._resizeHandler);
          this._resizeHandler = null;
        }
        this._performSystemSpecificCleanup();
      } catch (error) {
        console.error(`[${this.systemName}] Error during destruction:`, error);
        this.metrics.errors++;
      }
    }
    // Add the virtual cleanup hook for subclasses.
    _performSystemSpecificCleanup() {
      for (const [id, canvasResult] of this.activeCanvasResults) {
        const canvas = canvasResult.canvas;
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        if (this.config.enableDebug) {
          console.log(
            `[${this.systemName}] Cleaned up canvas: ${id} (type: ${canvasResult.type})`
          );
        }
      }
      this.activeCanvasResults.clear();
    }
    updateFromMusicAnalysis(processedMusicData, ...args) {
    }
    /**
     * Unified animation hook called by MasterAnimationCoordinator.
     * Subclasses can override this method or implement updateAnimation for legacy support.
     *
     * @param deltaMs - Time in milliseconds since the last frame for this system
     */
    onAnimate(deltaMs) {
      if (typeof this.updateAnimation === "function") {
        this.updateAnimation(performance.now(), deltaMs);
      }
    }
    updateModeConfiguration(modeConfig) {
    }
    /**
     * Base implementation of the settings-change hook. It is intentionally empty
     * now that the legacy `sn-performanceQuality` key has been removed. Subclasses
     * should override this method if they need to respond to other settings keys
     * and are still encouraged to call `super.handleSettingsChange(event)`.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSettingsChange(event) {
    }
    _applyPerformanceProfile(quality) {
      if (!this.config?.performanceProfiles) {
        this.performanceMonitor?.emitTrace?.(
          `[${this.systemName}] Performance profiles not found in config.`
        );
        return;
      }
      const profile = selectPerformanceProfile(
        quality,
        this.config.performanceProfiles,
        {
          trace: (msg) => this.performanceMonitor?.emitTrace(msg)
        }
      );
      if (profile) {
        this.currentPerformanceProfile = profile;
        this.performanceMonitor?.emitTrace?.(
          `[BaseVisualSystem (${this.systemName})] Applied performance profile '${quality}'`,
          profile
        );
      } else {
        this.performanceMonitor?.emitTrace?.(
          `[${this.systemName}] Performance profile '${quality}' not found.`
        );
      }
    }
    getCosmicState() {
      if (typeof document === "undefined") return {};
      const root = document.documentElement;
      const style = getComputedStyle(root);
      return {
        energy: parseFloat(style.getPropertyValue("--sn-kinetic-energy")) || 0.5,
        valence: parseFloat(style.getPropertyValue("--sn-kinetic-valence")) || 0.5,
        bpm: parseFloat(style.getPropertyValue("--sn-kinetic-bpm")) || 120,
        tempoMultiplier: parseFloat(style.getPropertyValue("--sn-kinetic-tempo-multiplier")) || 1,
        beatPhase: parseFloat(style.getPropertyValue("--sn-kinetic-beat-phase")) || 0,
        beatPulse: parseFloat(style.getPropertyValue("--sn-kinetic-beat-pulse")) || 0
      };
    }
    /**
     * Create GPU-accelerated optimized canvas with kinetic styling.
     * This method prioritizes WebGPU > WebGL2 > 2D Canvas based on device capabilities.
     */
    async _createOptimizedKineticCanvas(id, zIndex = 5, blendMode = "screen", kineticMode = "pulse") {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
      let preferredType = "2d";
      if (this.canvasCapabilities && this.currentPerformanceProfile) {
        const quality = this.currentPerformanceProfile.quality || "balanced";
        let webgpuAllowed = false;
        try {
          if (this.settingsManager) {
            webgpuAllowed = this.settingsManager.get("sn-enable-webgpu") !== "false";
          }
        } catch (e) {
          webgpuAllowed = true;
        }
        if (webgpuAllowed && quality === "high" && this.canvasCapabilities.webgpu) {
          preferredType = "webgpu";
        } else if (quality !== "low" && this.canvasCapabilities.webgl2) {
          preferredType = "webgl2";
        }
      }
      const canvasResult = await createOptimizedCanvas({
        id,
        width: window.innerWidth,
        height: window.innerHeight,
        alpha: true,
        antialias: true,
        preferredType
      });
      const canvas = canvasResult.canvas;
      canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${zIndex};
      pointer-events: none;
      mix-blend-mode: ${blendMode};
    `;
      canvas.classList.add("year3000-kinetic-canvas");
      canvas.dataset.kineticMode = kineticMode;
      canvas.dataset.systemName = this.systemName;
      canvas.dataset.canvasType = canvasResult.type;
      const kineticStyles = this._getKineticStyles(kineticMode);
      Object.assign(canvas.style, kineticStyles);
      document.body.appendChild(canvas);
      this.activeCanvasResults.set(id, canvasResult);
      this._resizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (typeof this.handleResize === "function") {
          this.handleResize();
        }
      };
      window.addEventListener("resize", this._resizeHandler);
      this._resizeHandler();
      if (this.config.enableDebug) {
        console.log(
          `[BaseVisualSystem (${this.systemName})] Created optimized kinetic canvas: ${canvasResult.type} (mode: ${kineticMode})`
        );
      }
      return canvasResult;
    }
    /**
     * Get current canvas rendering capabilities.
     */
    getCanvasCapabilities() {
      return this.canvasCapabilities;
    }
    /**
     * Check if GPU acceleration is available and active.
     */
    hasGPUAcceleration() {
      return this.canvasCapabilities?.webgpu || this.canvasCapabilities?.webgl2 || false;
    }
    _createKineticCanvas(id, zIndex = 5, blendMode = "screen", kineticMode = "pulse") {
      const canvas = this._createCanvasElement(id, zIndex, blendMode);
      canvas.classList.add("year3000-kinetic-canvas");
      canvas.dataset.kineticMode = kineticMode;
      canvas.dataset.systemName = this.systemName;
      const kineticStyles = this._getKineticStyles(kineticMode);
      Object.assign(canvas.style, kineticStyles);
      if (this.config.enableDebug) {
        console.log(
          `[BaseVisualSystem (${this.systemName})] Created kinetic canvas with mode: ${kineticMode}`
        );
      }
      return canvas;
    }
    _getKineticStyles(kineticMode) {
      const baseStyles = {
        transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      };
      switch (kineticMode) {
        case "pulse":
          return {
            ...baseStyles,
            animation: "year3000-pulse calc(var(--sn-kinetic-tempo-multiplier, 1) * 1s) ease-in-out infinite"
          };
        case "breathe":
          return {
            ...baseStyles,
            animation: "year3000-breathe calc(var(--sn-kinetic-tempo-multiplier, 1) * 4s) ease-in-out infinite"
          };
        case "flow":
          return {
            ...baseStyles,
            animation: "year3000-flow calc(var(--sn-kinetic-tempo-multiplier, 1) * 8s) linear infinite"
          };
        default:
          return baseStyles;
      }
    }
    _createCanvasElement(id, zIndex, blendMode) {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
      const canvas = document.createElement("canvas");
      canvas.id = id;
      canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${zIndex};
      pointer-events: none;
      mix-blend-mode: ${blendMode};
    `;
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
    /**
     * Apply a fully-resolved PerformanceProfile coming from Year3000System.
     * Sub-systems may override this to adjust internal parameters (particle
     * counts, throttle values, etc.). The base implementation simply stores the
     * profile so dependants can query `currentPerformanceProfile`.
     */
    applyPerformanceSettings(profile) {
      this.currentPerformanceProfile = profile;
      if (profile.quality && typeof this._applyPerformanceProfile === "function") {
        this._applyPerformanceProfile?.(profile.quality);
      }
      if (this.config.enableDebug) {
        this.performanceMonitor?.emitTrace?.(
          `[BaseVisualSystem (${this.systemName})] Performance settings applied`,
          profile
        );
      }
    }
    /**
     * Centralised settings responder invoked by Year3000System.  The base
     * implementation simply adapts the parameters into a synthetic CustomEvent
     * so that legacy subclasses overriding `handleSettingsChange` continue to
     * work without modification.  Newer systems can override this directly for
     * efficiency.
     */
    applyUpdatedSettings(key, value) {
      const evt = new CustomEvent("year3000SystemSettingsChanged", {
        detail: { key, value }
      });
      try {
        this.handleSettingsChange(evt);
      } catch (err) {
        if (this.config.enableDebug) {
          console.warn(
            `[BaseVisualSystem] ${this.systemName} applyUpdatedSettings error`,
            err
          );
        }
      }
    }
    // ---------------------------------------------------------------------------
    // SETTINGS-AWARE REPAINT CONTRACT
    // ---------------------------------------------------------------------------
    /**
     * Default no-op implementation.  Subclasses that cache colours, shaders, or
     * other theme-dependent resources should override and perform a lightweight
     * refresh.
     */
    forceRepaint(_reason = "generic") {
    }
  };

  // src-js/systems/ColorHarmonyEngine.ts
  var ColorHarmonyEngine = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicAnalysisService, settingsManager) {
      super(
        config,
        utils || Year3000Utilities_exports,
        performanceMonitor,
        musicAnalysisService || null,
        settingsManager || null
      );
      this.emergentEngine = null;
      // User-specified harmonic intensity (0-1). Multiplies defaultBlendRatio.
      this.userIntensity = 0.7;
      this.evolutionEnabled = true;
      this._evolutionTimer = null;
      // Timer ref for debounce
      this._pendingPaletteRefresh = null;
      // Track last applied genre to avoid redundant palette refreshes
      this._lastGenre = null;
      this.systemName = "ColorHarmonyEngine";
      this.paletteExtensionManager = new PaletteExtensionManager(
        this.config,
        this.utils
      );
      this.currentTheme = this.detectCurrentTheme();
      if (config && typeof config.harmonicIntensity === "number" && Number.isFinite(config.harmonicIntensity)) {
        const clamped = Math.max(
          0,
          Math.min(1, config.harmonicIntensity)
        );
        this.userIntensity = clamped;
      }
      this.harmonyMetrics = {
        totalHarmonyCalculations: 0,
        musicInfluencedAdjustments: 0,
        temporalMemoryEvents: 0,
        performance: []
      };
      this.musicalMemory = {
        recentTracks: [],
        userColorPreferences: /* @__PURE__ */ new Map(),
        energyHistory: [],
        maxMemorySize: 50
      };
      this.kineticState = {
        currentPulse: 0,
        breathingPhase: 0,
        lastBeatTime: 0,
        visualMomentum: 0
      };
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
            lavender: "#babbf1"
          },
          neutrals: {
            base: "#303446",
            surface0: "#414559",
            surface1: "#51576d",
            surface2: "#626880"
          }
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
            lavender: "#7287fd"
          },
          neutrals: {
            base: "#eff1f5",
            surface0: "#e6e9ef",
            surface1: "#dce0e8",
            surface2: "#c5c9d1"
          }
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
            lavender: "#b7bdf8"
          },
          neutrals: {
            base: "#24273a",
            surface0: "#363a4f",
            surface1: "#494d64",
            surface2: "#5b6078"
          }
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
            lavender: "#b4befe"
          },
          neutrals: {
            base: "#1e1e2e",
            surface0: "#313244",
            surface1: "#45475a",
            surface2: "#585b70"
          }
        }
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
            "cosmic-maximum": 0.98
            // Maximum: 98% extracted!
          };
          return ratios[artisticMode] || this.defaultBlendRatio;
        }
      };
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3A8} [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy"
        );
      }
      if (config && typeof config.harmonicEvolution === "boolean") {
        this.evolutionEnabled = config.harmonicEvolution;
      }
      this._boundSettingsChangeHandler = this._handleSettingsChange.bind(this);
      this._boundArtisticModeHandler = this._handleArtisticModeChanged.bind(this);
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this._boundSettingsChangeHandler
      );
      document.addEventListener(
        "year3000ArtisticModeChanged",
        this._boundArtisticModeHandler
      );
      if (this.evolutionEnabled) {
        this._startEvolutionLoop();
      }
    }
    // TODO: Legacy interface method - delegates to new onAnimate
    updateAnimation(deltaTime) {
      this.onAnimate(deltaTime);
    }
    // TODO: Implement proper onAnimate method for Year 3000 per-frame updates
    onAnimate(deltaMs) {
      this._updateCSSVariables(deltaMs);
      this._calculateBeatPulse(deltaMs);
      GlobalEventBus.publish("colorharmony/frame", {
        timestamp: performance.now(),
        kineticState: this.kineticState
      });
    }
    // TODO: Private method for updating CSS variables with kinetic state
    _updateCSSVariables(deltaMs) {
      const root = this.utils.getRootStyle();
      if (!root) return;
      root.style.setProperty(
        "--sn-harmony-energy",
        this.kineticState.visualMomentum.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmony-pulse",
        this.kineticState.currentPulse.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmony-breathing-phase",
        (Math.sin(this.kineticState.breathingPhase) * 0.5 + 0.5).toFixed(3)
      );
      if (this.kineticState.musicIntensityMultiplier !== void 0) {
        root.style.setProperty(
          "--sn-harmony-intensity",
          this.kineticState.musicIntensityMultiplier.toFixed(3)
        );
      }
      if (this.kineticState.valenceGravity !== void 0) {
        root.style.setProperty(
          "--sn-harmony-valence",
          this.kineticState.valenceGravity.toFixed(3)
        );
      }
      if (this.kineticState.beatPhase !== void 0) {
        root.style.setProperty(
          "--sn-harmony-beat-phase",
          this.kineticState.beatPhase.toFixed(3)
        );
      }
      if (this.kineticState.hueShift !== void 0) {
        root.style.setProperty(
          "--sn-harmony-hue-shift",
          `${this.kineticState.hueShift.toFixed(1)}deg`
        );
      }
      const glow = Math.max(0, Math.min(1, this.kineticState.currentPulse * 1.2));
      root.style.setProperty("--sn-text-glow-intensity", glow.toFixed(3));
    }
    // TODO: Private method for calculating beat pulse effects
    _calculateBeatPulse(deltaMs) {
      this.kineticState.currentPulse *= Math.pow(0.95, deltaMs / 16.67);
      this.kineticState.breathingPhase += deltaMs / 1e3 * 0.5;
      if (this.kineticState.breathingPhase > 2 * Math.PI) {
        this.kineticState.breathingPhase -= 2 * Math.PI;
      }
    }
    async initialize() {
      await super.initialize();
      if (this.config.enableDebug) {
        console.log(
          "\u{1F3A8} [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy via BaseVisualSystem."
        );
      }
      this.initialized = true;
    }
    async healthCheck() {
      if (!this.catppuccinPalettes[this.currentTheme]) {
        return {
          ok: false,
          details: `Current theme '${this.currentTheme}' not found in palettes.`
        };
      }
      return { ok: true, details: "Palettes are loaded correctly." };
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
      const baseColorHex = computedRootStyle.getPropertyValue("--spice-main").trim();
      const normalizedBaseColor = baseColorHex.startsWith("#") ? baseColorHex.substring(1).toUpperCase() : baseColorHex.toUpperCase();
      const themeMap = {
        "303446": "frappe",
        EFF1F5: "latte",
        "24273A": "macchiato",
        "1E1E2E": "mocha"
      };
      const knownTheme = themeMap[normalizedBaseColor];
      if (knownTheme) {
        if (this.config.enableDebug) {
          console.log(
            `[ColorHarmonyEngine] Detected Catppuccin theme: ${knownTheme}`
          );
        }
        return knownTheme;
      }
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Unknown theme detected (${normalizedBaseColor}), attempting to generate fallback`
        );
      }
      const fallbackThemeName = `custom-${normalizedBaseColor.toLowerCase()}`;
      try {
        const fallbackPalette = this.paletteExtensionManager.generateFallbackPalette(fallbackThemeName);
        if (this.config.enableDebug) {
          console.log(
            `[ColorHarmonyEngine] Generated fallback palette for theme: ${fallbackThemeName}`,
            fallbackPalette
          );
        }
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            `[ColorHarmonyEngine] Failed to generate fallback palette:`,
            error
          );
        }
      }
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Falling back to mocha theme for unknown base color: ${normalizedBaseColor}`
        );
      }
      return "mocha";
    }
    // TODO: Phase 3 - New method to get genre-aware palette
    async _getGenreAwarePalette(genre) {
      const basePalette = this.catppuccinPalettes[this.currentTheme];
      if (!genre || !basePalette) {
        return basePalette;
      }
      try {
        const customPalette = {
          name: this.currentTheme,
          version: "1.0.0",
          accents: basePalette.accents,
          neutrals: basePalette.neutrals,
          metadata: {
            author: "Catppuccin",
            description: `${this.currentTheme} flavor`,
            temperature: "neutral"
          }
        };
        const modifiedPalette = this.paletteExtensionManager.applyGenreAwareModifications(
          customPalette,
          genre
        );
        return {
          accents: modifiedPalette.accents,
          neutrals: modifiedPalette.neutrals
        };
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            `[ColorHarmonyEngine] Failed to apply genre modifications for ${genre}:`,
            error
          );
        }
        return basePalette;
      }
    }
    getMusicIntensityMultiplier(energy = 0.5, valence = 0.5) {
      const baseMultiplier = this.config.getCurrentMultipliers().musicEnergyBoost;
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
          minHarmony: this.vibrancyConfig.harmonyTolerance
        },
        search: { minContrast: 2.8, minHarmony: 0.4 },
        navigation: { minContrast: 2.5, minHarmony: 0.45 },
        text: { minContrast: 4.5, minHarmony: 0.6 },
        accent: { minContrast: 1.5, minHarmony: 0.3 }
      };
      const requirements = contextRequirements[context] || contextRequirements.general;
      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      if (!currentPalette?.neutrals?.base) {
        const errorMsg = `[StarryNight] Catppuccin palette or base neutral not found for theme: ${this.currentTheme}`;
        console.error(errorMsg);
        return {
          isValid: false,
          error: "Palette configuration error.",
          contrastRatio: 0,
          harmonyScore: 0,
          meetsContrast: false,
          isHarmonious: false,
          artisticMode: this.config.artisticMode,
          adjustedRequirements: requirements,
          recommendations: []
        };
      }
      const backgroundColor = currentPalette.neutrals.base;
      const colorHex = this.utils.rgbToHex(color.r, color.g, color.b);
      const contrastRatio = this.utils.calculateContrastRatio(
        colorHex,
        backgroundColor
      );
      const harmonyScore = this.calculateHarmonyScore(color, currentPalette);
      const currentMode = this.config.artisticMode;
      let adjustedRequirements = { ...requirements };
      if (currentMode === "cosmic-maximum") {
        adjustedRequirements.minContrast *= 0.7;
        adjustedRequirements.minHarmony *= 0.6;
      } else if (currentMode === "artist-vision") {
        adjustedRequirements.minContrast *= 0.85;
        adjustedRequirements.minHarmony *= 0.8;
      }
      const meetsContrast = contrastRatio >= adjustedRequirements.minContrast;
      const isHarmonious = harmonyScore >= adjustedRequirements.minHarmony;
      const endTime = performance.now();
      this.harmonyMetrics.performance.push(endTime - startTime);
      return {
        isValid: meetsContrast && isHarmonious,
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
        )
      };
    }
    calculateHarmonyScore(color, palette) {
      const colorHsl = this.utils.rgbToHsl(color.r, color.g, color.b);
      let maxHarmony = 0;
      const accentColors = Object.values(palette.accents);
      for (const accentColor of accentColors) {
        const accentRgb = this.utils.hexToRgb(accentColor);
        if (!accentRgb) continue;
        const accentHsl = this.utils.rgbToHsl(
          accentRgb.r,
          accentRgb.g,
          accentRgb.b
        );
        const hueDiff = Math.abs(colorHsl.h - accentHsl.h);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
        const harmoniousAngles = [
          0,
          30,
          60,
          90,
          120,
          150,
          180,
          210,
          240,
          270,
          300,
          330
        ];
        const isHarmonious = harmoniousAngles.some(
          (angle) => Math.abs(normalizedHueDiff - angle) < 20
        );
        if (isHarmonious) {
          const harmonyStrength = 1 - Math.min(
            ...harmoniousAngles.map(
              (angle) => Math.abs(normalizedHueDiff - angle)
            )
          ) / 20;
          maxHarmony = Math.max(maxHarmony, harmonyStrength);
        }
      }
      return maxHarmony;
    }
    findBestHarmoniousAccent(rgb, palette) {
      let bestAccent = {
        name: "mauve",
        hex: this.utils.getRootStyle()?.style.getPropertyValue("--sn-dynamic-accent")?.trim() || this.utils.getRootStyle()?.style.getPropertyValue("--spice-accent")?.trim() || "#cba6f7",
        // Fallback to default mauve hex
        rgb: { r: 203, g: 166, b: 247 }
      };
      const accentPriority = [
        "mauve",
        "lavender",
        "blue",
        "sapphire",
        "sky",
        "pink",
        "peach",
        "teal"
      ];
      let bestScore = -1;
      const inputHsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
      for (const accentName of accentPriority) {
        const accentHex = palette.accents[accentName];
        if (accentHex) {
          const accentRgb = this.utils.hexToRgb(accentHex);
          if (!accentRgb) continue;
          const accentHsl = this.utils.rgbToHsl(
            accentRgb.r,
            accentRgb.g,
            accentRgb.b
          );
          const hueDiff = Math.abs(inputHsl.h - accentHsl.h);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const harmonyScore = 1 - normalizedHueDiff / 180;
          const saturationBonus = accentHsl.s * 0.3;
          const totalScore = harmonyScore + saturationBonus;
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestAccent = {
              name: accentName,
              hex: accentHex,
              rgb: accentRgb
            };
          }
        }
      }
      return bestAccent;
    }
    blendColors(rgb1, rgb2, ratio = this.vibrancyConfig.defaultBlendRatio) {
      const r = Math.max(0, Math.min(1, ratio));
      const oklab1 = this.utils.rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
      const oklab2 = this.utils.rgbToOklab(rgb2.r, rgb2.g, rgb2.b);
      const lerp2 = (a, b) => a * r + b * (1 - r);
      const blendedOklab = {
        L: lerp2(oklab1.L, oklab2.L),
        a: lerp2(oklab1.a, oklab2.a),
        b: lerp2(oklab1.b, oklab2.b)
      };
      const blendedRgb = this.utils.oklabToRgb(
        blendedOklab.L,
        blendedOklab.a,
        blendedOklab.b
      );
      const blendedHsl = this.utils.rgbToHsl(
        blendedRgb.r,
        blendedRgb.g,
        blendedRgb.b
      );
      const artisticMode = this.config?.artisticMode ?? "artist-vision";
      const emergentMultipliers = this.emergentEngine?.getCurrentMultipliers?.() || void 0;
      const shouldUseEmergent = artisticMode === "cosmic-maximum" && !!emergentMultipliers;
      const validMultipliers = emergentMultipliers || {};
      const saturationBoostFactor = shouldUseEmergent ? (validMultipliers.visualIntensityBase || 1) * 1.25 : this.vibrancyConfig.artisticSaturationBoost;
      const luminanceBoostFactor = shouldUseEmergent ? (validMultipliers.aestheticGravityStrength || 1) * 1.15 : this.vibrancyConfig.cosmicLuminanceBoost;
      blendedHsl.s = Math.max(
        blendedHsl.s,
        this.vibrancyConfig.minimumSaturation * 100
      );
      blendedHsl.s = Math.min(100, blendedHsl.s * saturationBoostFactor);
      if (artisticMode !== "corporate-safe") {
        blendedHsl.l = Math.min(95, blendedHsl.l * luminanceBoostFactor);
      }
      const finalRgb = this.utils.hslToRgb(
        blendedHsl.h,
        blendedHsl.s,
        blendedHsl.l
      );
      return { r: finalRgb.r, g: finalRgb.g, b: finalRgb.b };
    }
    blendWithCatppuccin(extractedColors, musicContext = null) {
      this.performanceMonitor?.emitTrace?.(
        "[ColorHarmonyEngine] Starting blendWithCatppuccin"
      );
      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      if (!currentPalette) {
        console.error(
          `[StarryNight] Catppuccin palette not found for theme: ${this.currentTheme}`
        );
        return extractedColors;
      }
      const harmonizedColors = {};
      for (const [role, color] of Object.entries(extractedColors)) {
        if (!color) continue;
        const extractedRgb = this.utils.hexToRgb(color);
        if (!extractedRgb) {
          harmonizedColors[role] = color;
          continue;
        }
        const bestAccent = this.findBestHarmoniousAccent(
          extractedRgb,
          currentPalette
        );
        if (!bestAccent?.rgb) {
          console.warn(
            `[StarryNight] Could not find a valid harmonious accent for role: ${role}. Using original color.`
          );
          harmonizedColors[role] = color;
          continue;
        }
        let blendRatio = this.vibrancyConfig.getBlendRatio(
          this.config.artisticMode
        );
        if (musicContext) {
          const musicIntensity = this.getMusicIntensityMultiplier(
            musicContext.energy,
            musicContext.valence
          );
          blendRatio *= musicIntensity * this.userIntensity;
          blendRatio = Math.max(0, Math.min(1, blendRatio));
        }
        const finalRgb = this.blendColors(
          extractedRgb,
          bestAccent.rgb,
          blendRatio
        );
        harmonizedColors[role] = this.utils.rgbToHex(
          finalRgb.r,
          finalRgb.g,
          finalRgb.b
        );
      }
      this.harmonyMetrics.musicInfluencedAdjustments++;
      this.performanceMonitor?.emitTrace?.(
        "[ColorHarmonyEngine] Completed blendWithCatppuccin"
      );
      return harmonizedColors;
    }
    generateRecommendations(color, contrastRatio, harmonyScore, requirements) {
      const recommendations = [];
      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      const baseRgb = this.utils.hexToRgb(currentPalette.neutrals.base);
      if (!baseRgb) {
        return [];
      }
      if (contrastRatio < requirements.minContrast) {
        const targetL = this.utils.findRequiredLuminance(
          color,
          baseRgb,
          requirements.minContrast
        );
        const currentHsl = this.utils.rgbToHsl(color.r, color.g, color.b);
        const adjustedRgbArr = this.utils.hslToRgb(
          currentHsl.h,
          currentHsl.s,
          targetL
        );
        const adjustedRgb = {
          r: adjustedRgbArr.r,
          g: adjustedRgbArr.g,
          b: adjustedRgbArr.b
        };
        recommendations.push({
          type: "contrast",
          suggestion: `Adjust luminance to meet contrast of ${requirements.minContrast}`,
          recommendedColor: this.utils.rgbToHex(
            adjustedRgb.r,
            adjustedRgb.g,
            adjustedRgb.b
          )
        });
      }
      if (harmonyScore < requirements.minHarmony) {
        const harmoniousAccent = this.findBestHarmoniousAccent(
          color,
          currentPalette
        );
        const blendedColor = this.blendColors(color, harmoniousAccent.rgb, 0.5);
        recommendations.push({
          type: "harmony",
          suggestion: `Blend with harmonious accent color to improve score to at least ${requirements.minHarmony}`,
          recommendedColor: this.utils.rgbToHex(
            blendedColor.r,
            blendedColor.g,
            blendedColor.b
          )
        });
      }
      return recommendations;
    }
    getPerformanceReport() {
      return {
        system: this.systemName,
        metrics: this.harmonyMetrics,
        kineticState: this.kineticState,
        musicalMemorySize: this.musicalMemory.recentTracks.length,
        currentTheme: this.currentTheme
      };
    }
    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!processedMusicData) return;
      const g2 = processedMusicData.genre;
      if (g2 && g2 !== this._lastGenre) {
        this._applyGenrePalette(g2).then(() => {
          this._lastGenre = g2;
          this._forcePaletteRepaint();
        });
      }
      this._updateMusicalMemory(processedMusicData, trackUri);
      this._updateKineticState(processedMusicData);
      this._applyAestheticGravity(processedMusicData);
      this._calculateMusicAwareDynamics(processedMusicData);
    }
    // TODO: Phase 2 - New method for music-aware dynamic calculations
    _calculateMusicAwareDynamics(musicData) {
      const {
        energy = 0.5,
        valence = 0.5,
        enhancedBPM = 120,
        beatOccurred = false
      } = musicData;
      const musicIntensityMultiplier = this._calculateMusicIntensityMultiplier(
        energy,
        valence
      );
      const beatPhase = this._calculateBeatPhase(enhancedBPM);
      const valenceGravity = (valence - 0.5) * 2;
      const hueShift = this._calculateHueShift(beatOccurred, energy, beatPhase);
      this.kineticState = {
        ...this.kineticState,
        musicIntensityMultiplier,
        beatPhase,
        valenceGravity,
        hueShift
      };
    }
    // TODO: Phase 2 - Calculate music intensity based on energy and valence
    _calculateMusicIntensityMultiplier(energy, valence) {
      const baseIntensity = energy * 0.7 + valence * 0.3;
      const contrastBoost = Math.abs(valence - 0.5) * 0.4;
      return Math.max(0.1, Math.min(2, baseIntensity + contrastBoost));
    }
    // TODO: Phase 2 - Calculate beat phase for cyclic effects
    _calculateBeatPhase(enhancedBPM) {
      const now = performance.now();
      const beatInterval = 6e4 / enhancedBPM;
      const timeSinceStart = now % beatInterval;
      return timeSinceStart / beatInterval;
    }
    // TODO: Phase 2 - Calculate dynamic hue shift for beat effects
    _calculateHueShift(beatOccurred, energy, beatPhase) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return 0;
      }
      const artisticMode = this.config.artisticMode;
      const baseAmplitude = artisticMode === "cosmic-maximum" ? 8 : 5;
      let hueShift = Math.sin(beatPhase * 2 * Math.PI) * baseAmplitude;
      if (beatOccurred) {
        const beatBoost = artisticMode === "cosmic-maximum" ? 12 : 10;
        hueShift += energy * beatBoost;
      }
      const clampRange = artisticMode === "cosmic-maximum" ? 25 : 15;
      return Math.max(-clampRange, Math.min(clampRange, hueShift));
    }
    _updateMusicalMemory(musicData, trackUri) {
      this.musicalMemory.recentTracks.unshift({
        trackUri,
        ...musicData,
        timestamp: Date.now()
      });
      if (this.musicalMemory.recentTracks.length > this.musicalMemory.maxMemorySize) {
        this.musicalMemory.recentTracks.pop();
      }
      this.musicalMemory.energyHistory.unshift(musicData.energy);
      if (this.musicalMemory.energyHistory.length > 20) {
        this.musicalMemory.energyHistory.pop();
      }
      this.harmonyMetrics.temporalMemoryEvents++;
    }
    _updateKineticState(musicData) {
      const { energy, enhancedBPM, beatOccurred } = musicData;
      const now = performance.now();
      if (beatOccurred) {
        this.kineticState.lastBeatTime = now;
        this.kineticState.currentPulse = 1;
      } else {
        this.kineticState.currentPulse *= 0.95;
      }
      const timeSinceLastBeat = now - this.kineticState.lastBeatTime;
      const beatInterval = 6e4 / (enhancedBPM || 120);
      this.kineticState.breathingPhase = timeSinceLastBeat % beatInterval / beatInterval * 2 * Math.PI;
      this.kineticState.visualMomentum = this.utils.lerp(
        this.kineticState.visualMomentum,
        energy,
        0.1
      );
    }
    _applyAestheticGravity(musicData) {
      const { visualIntensity, valence, energy } = musicData;
      const gravityX = (valence - 0.5) * 2;
      const gravityY = (energy - 0.5) * 2;
      const gravityStrength = visualIntensity;
      const root = this.utils.getRootStyle();
      if (root) {
        root.style.setProperty("--sn-gravity-x", gravityX.toFixed(3));
        root.style.setProperty("--sn-gravity-y", gravityY.toFixed(3));
        root.style.setProperty(
          "--sn-gravity-strength",
          gravityStrength.toFixed(3)
        );
      }
    }
    getQuantumEmpathyMetrics() {
      const avgEnergy = this.musicalMemory.energyHistory.reduce((a, b) => a + b, 0) / this.musicalMemory.energyHistory.length || 0;
      return {
        averageRecentEnergy: avgEnergy,
        systemMomentum: this.kineticState.visualMomentum,
        preferenceProfileSize: this.musicalMemory.userColorPreferences.size
      };
    }
    generateHarmonicVariations(baseRgb) {
      const oklab = this.utils.rgbToOklab(baseRgb.r, baseRgb.g, baseRgb.b);
      const darkOklabL = Math.max(0, Math.min(1, oklab.L * 0.75));
      const darkRgb = this.utils.oklabToRgb(darkOklabL, oklab.a, oklab.b);
      const lightOklabL = Math.max(0, Math.min(1, oklab.L * 1.25));
      const lightRgb = this.utils.oklabToRgb(lightOklabL, oklab.a, oklab.b);
      return {
        darkVibrantHex: this.utils.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
        lightVibrantHex: this.utils.rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b)
      };
    }
    // =========================
    // PUBLIC API – User Control
    // =========================
    /**
     * Update user-defined harmonic intensity (0–1). Values outside range are clamped.
     */
    setIntensity(value) {
      const clamped = Math.max(0, Math.min(1, value));
      this.userIntensity = clamped;
      if (this.config?.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] User harmonic intensity set to ${clamped}`
        );
      }
    }
    // ============================
    // Settings / Event Integration
    // ============================
    _handleSettingsChange(event) {
      const { key, value } = event.detail || {};
      switch (key) {
        case HARMONIC_INTENSITY_KEY: {
          const num = parseFloat(value);
          if (!Number.isNaN(num)) {
            this.setIntensity(num);
          }
          break;
        }
        case HARMONIC_EVOLUTION_KEY: {
          const enabled = value === "true" || value === true;
          this._setEvolutionEnabled(enabled);
          break;
        }
      }
    }
    _handleArtisticModeChanged() {
      this.currentTheme = this.detectCurrentTheme();
      if (!this._pendingPaletteRefresh) {
        this._pendingPaletteRefresh = setTimeout(() => {
          this._pendingPaletteRefresh = null;
          this.refreshPalette();
        }, 80);
      }
    }
    _forcePaletteRepaint() {
      this.kineticState.hueShift = (this.kineticState.hueShift || 0) + 0.01;
    }
    // Evolution helpers
    _startEvolutionLoop() {
      if (this._evolutionTimer) return;
      const basePeriod = 3e4;
      const period = basePeriod / Math.max(0.1, this.userIntensity);
      this._evolutionTimer = setInterval(() => {
        const step = 2 * this.userIntensity;
        const current = this.kineticState.hueShift ?? 0;
        this.kineticState.hueShift = (current + step + 360) % 360 - 180;
      }, period);
    }
    _stopEvolutionLoop() {
      if (this._evolutionTimer) {
        clearInterval(this._evolutionTimer);
        this._evolutionTimer = null;
      }
    }
    _setEvolutionEnabled(enabled) {
      if (this.evolutionEnabled === enabled) return;
      this.evolutionEnabled = enabled;
      if (enabled) this._startEvolutionLoop();
      else this._stopEvolutionLoop();
    }
    // Clean up listeners when destroyed
    destroy() {
      this._stopEvolutionLoop();
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this._boundSettingsChangeHandler
      );
      document.removeEventListener(
        "year3000ArtisticModeChanged",
        this._boundArtisticModeHandler
      );
      super.destroy?.();
    }
    /**
     * Public helper that triggers a colour rebake based on the current track.
     * Prefer calling the global Year3000System where available so the full
     * pipeline (extraction → harmonisation → CSS variable batch) is reused.
     */
    async refreshPalette() {
      try {
        const y3kSystem = globalThis.year3000System;
        if (y3kSystem?.updateColorsFromCurrentTrack) {
          await y3kSystem.updateColorsFromCurrentTrack();
          return;
        }
        const root = this.utils.getRootStyle();
        if (!root) return;
        const styles = getComputedStyle(root);
        const primary = styles.getPropertyValue("--sn-gradient-primary").trim();
        if (primary) {
          root.style.setProperty("--sn-gradient-primary", primary);
          const rgb = this.utils.hexToRgb(primary);
          if (rgb) {
            root.style.setProperty(
              "--sn-gradient-primary-rgb",
              `${rgb.r},${rgb.g},${rgb.b}`
            );
          }
        }
      } catch (err) {
        if (this.config.enableDebug) {
          console.warn("[ColorHarmonyEngine] refreshPalette failed", err);
        }
      }
    }
    /**
     * Swap Catppuccin palette accents & neutrals based on detected genre.
     * Executes asynchronously to avoid blocking audio thread.
     */
    async _applyGenrePalette(genre) {
      try {
        const palette = await this._getGenreAwarePalette(genre);
        if (!palette) return;
        this.catppuccinPalettes[this.currentTheme] = palette;
        await this.refreshPalette();
        try {
          GlobalEventBus.publish("music:genre-change", {
            genre,
            palette
          });
        } catch (_e) {
        }
      } catch (err) {
        if (this.config.enableDebug) {
          console.warn("[ColorHarmonyEngine] _applyGenrePalette failed", err);
        }
      }
    }
    setEmergentEngine(engine) {
      this.emergentEngine = engine;
    }
    // ---------------------------------------------------------------------------
    // 🔄 SETTINGS-AWARE REPAINT IMPLEMENTATION
    // ---------------------------------------------------------------------------
    /**
     * Re-apply the current palette immediately.  This is extremely lightweight
     * (just re-blends colours + sets CSS vars) so it can be called synchronously
     * from Year3000System after a relevant settings change.
     */
    forceRepaint(_reason = "settings-change") {
      this.refreshPalette?.();
    }
  };

  // src-js/types/signature.ts
  var createDefaultSignature = (userId) => ({
    version: "1.0.0",
    userId,
    createdAt: Date.now(),
    lastModified: Date.now(),
    colorMemories: /* @__PURE__ */ new Map(),
    rhythmicPreferences: /* @__PURE__ */ new Map(),
    emotionalResonanceProfile: {},
    evolutionaryTrajectory: {
      adaptability: 0.5,
      // Start balanced
      explorationFactor: 0.5,
      // Start balanced
      lastUpdate: Date.now()
    }
  });

  // node_modules/idb/build/index.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(this.request);
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
  var methodMap = {};
  var advanceResults = /* @__PURE__ */ new WeakMap();
  var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
  var cursorIteratorTraps = {
    get(target, prop) {
      if (!advanceMethodProps.includes(prop))
        return target[prop];
      let cachedFunc = methodMap[prop];
      if (!cachedFunc) {
        cachedFunc = methodMap[prop] = function(...args) {
          advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
        };
      }
      return cachedFunc;
    }
  };
  async function* iterate(...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  }
  function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
      if (isIteratorProp(target, prop))
        return iterate;
      return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
      return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    }
  }));

  // src-js/services/TemporalMemoryService.ts
  var DB_NAME = "Year3000-TemporalMemory";
  var DB_VERSION = 1;
  var SIGNATURE_STORE = "aestheticSignatures";
  var SIGNATURE_KEY = "currentUser";
  var TemporalMemoryService = class {
    constructor() {
      this.dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(SIGNATURE_STORE)) {
            db.createObjectStore(SIGNATURE_STORE);
          }
        }
      });
    }
    async getSignature(userId = "defaultUser") {
      try {
        const db = await this.dbPromise;
        const signature = await db.get(SIGNATURE_STORE, SIGNATURE_KEY);
        if (signature) {
          return signature;
        } else {
          const defaultSignature = createDefaultSignature(userId);
          await this.saveSignature(defaultSignature);
          return defaultSignature;
        }
      } catch (error) {
        console.error(
          "[TemporalMemoryService] Failed to get signature from IndexedDB. Returning default.",
          error
        );
        return createDefaultSignature(userId);
      }
    }
    async saveSignature(signature) {
      try {
        const db = await this.dbPromise;
        signature.lastModified = Date.now();
        await db.put(SIGNATURE_STORE, signature, SIGNATURE_KEY);
      } catch (error) {
        console.error(
          "[TemporalMemoryService] Failed to save signature to IndexedDB.",
          error
        );
      }
    }
    async resetSignature(userId = "defaultUser") {
      const defaultSignature = createDefaultSignature(userId);
      await this.saveSignature(defaultSignature);
      console.log("[TemporalMemoryService] Aesthetic signature has been reset.");
      return defaultSignature;
    }
    async getSignatureTrends(signature) {
      if (!signature) return null;
      const trends = {
        dominantColor: null,
        dominantRhythm: null,
        avgEnergy: 0,
        avgValence: 0
      };
      let dominantColor = null;
      signature.colorMemories.forEach((mem, hex) => {
        if (!dominantColor || mem.count > dominantColor.count) {
          dominantColor = { hex, count: mem.count };
        }
        trends.avgValence += mem.emotionalValence * mem.count;
      });
      let totalColorCount = 0;
      signature.colorMemories.forEach((mem) => totalColorCount += mem.count);
      if (totalColorCount > 0) {
        trends.avgValence /= totalColorCount;
      }
      trends.dominantColor = dominantColor;
      let dominantRhythm = null;
      signature.rhythmicPreferences.forEach((pattern, id) => {
        if (!dominantRhythm || pattern.count > dominantRhythm.count) {
          dominantRhythm = { id, count: pattern.count };
        }
        trends.avgEnergy += pattern.associatedEnergy * pattern.count;
      });
      let totalRhythmCount = 0;
      signature.rhythmicPreferences.forEach((p) => totalRhythmCount += p.count);
      if (totalRhythmCount > 0) {
        trends.avgEnergy /= totalRhythmCount;
      }
      trends.dominantRhythm = dominantRhythm;
      return trends;
    }
  };
  var temporalMemoryService = new TemporalMemoryService();

  // src-js/systems/EmergentChoreographyEngine.ts
  init_Year3000Utilities();
  var EmergentChoreographyEngine = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, settingsManager) {
      super(
        config,
        utils || Year3000Utilities_exports,
        performanceMonitor,
        null,
        settingsManager || null
      );
      this.eventSubscriptions = [];
      this.signature = null;
      this.saveInterval = null;
      this.currentBpm = 120;
      this.currentIntensity = 0.5;
      this.systemName = "EmergentChoreographyEngine";
      this.currentMultipliers = this.config.cosmicMultipliers;
    }
    async healthCheck() {
      if (!GlobalEventBus) {
        return { ok: false, details: "GlobalEventBus is not available." };
      }
      return {
        ok: true,
        details: "Emergent Choreography Engine is operational."
      };
    }
    async initialize() {
      await super.initialize();
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Initializing...`);
      }
      this.signature = await temporalMemoryService.getSignature();
      this.registerEventListeners();
      this.saveInterval = setInterval(() => {
        if (this.signature) {
          temporalMemoryService.saveSignature(this.signature);
        }
      }, 3e4);
      this.initialized = true;
    }
    registerEventListeners() {
      const beatFrameSub = GlobalEventBus.subscribe(
        "beat/frame",
        (payload) => this.handleBeatFrame(payload)
      );
      const harmonyFrameSub = GlobalEventBus.subscribe(
        "colorharmony/frame",
        (payload) => this.handleHarmonyFrame(payload)
      );
      const bpmSub = GlobalEventBus.subscribe(
        "beat/bpm",
        (payload) => {
          this.currentBpm = payload.bpm;
        }
      );
      const intensitySub = GlobalEventBus.subscribe(
        "beat/intensity",
        (payload) => {
          this.currentIntensity = payload.intensity;
        }
      );
      this.eventSubscriptions.push(
        beatFrameSub,
        harmonyFrameSub,
        bpmSub,
        intensitySub
      );
    }
    handleBeatFrame(payload) {
      if (!this.signature) return;
      this.signature.lastModified = Date.now();
    }
    handleHarmonyFrame(payload) {
      if (!this.signature) return;
      const { kineticState } = payload;
      this.signature.lastModified = Date.now();
    }
    async _updateEvolutionaryTrajectory() {
      if (!this.signature) return;
      const trends = await temporalMemoryService.getSignatureTrends(
        this.signature
      );
      if (!trends) return;
      const { avgEnergy, avgValence } = trends;
      const explorationFactor = 0.5 + (avgEnergy - 0.5) * 0.2;
      this.signature.evolutionaryTrajectory.explorationFactor = Math.max(
        0.1,
        Math.min(0.9, explorationFactor)
      );
      const adaptability = 0.5 + (Math.abs(avgValence) - 0.2) * 0.3;
      this.signature.evolutionaryTrajectory.adaptability = Math.max(
        0.1,
        Math.min(0.9, adaptability)
      );
      this.signature.evolutionaryTrajectory.lastUpdate = Date.now();
    }
    _calculateVisualPulse(deltaMs) {
      if (!this.initialized) return null;
      const beatInterval = 6e4 / this.currentBpm;
      const phase = performance.now() % beatInterval / beatInterval;
      const hueShift = Math.sin(phase * 2 * Math.PI + Math.PI / 2) * 15 * this.currentIntensity;
      return {
        timestamp: performance.now(),
        bpm: this.currentBpm,
        intensity: this.currentIntensity,
        phase,
        hueShift
      };
    }
    _calculateAdaptiveCoefficients() {
      if (!this.signature) return;
      const { adaptability, explorationFactor } = this.signature.evolutionaryTrajectory;
      const kineticIntensity = 0.5 + adaptability * 0.5;
      const visualIntensityBase = 0.8 + explorationFactor * 0.4;
      this.currentMultipliers = {
        ...this.config.cosmicMultipliers,
        kineticIntensity,
        visualIntensityBase
      };
      GlobalEventBus.publish(
        "emergent/multipliersUpdated",
        this.currentMultipliers
      );
    }
    getCurrentMultipliers() {
      return this.currentMultipliers;
    }
    updateAnimation(deltaTime) {
      this.onTick(deltaTime);
    }
    onTick(deltaMs) {
      if (!this.initialized) return;
      this._calculateAdaptiveCoefficients();
      if (this.signature && Date.now() - this.signature.evolutionaryTrajectory.lastUpdate > 6e4) {
        this._updateEvolutionaryTrajectory();
      }
      const visualPulse = this._calculateVisualPulse(deltaMs);
      if (visualPulse) {
        GlobalEventBus.publish("visual/pulse", visualPulse);
      }
      const emergentPayload = {
        timestamp: performance.now(),
        deltaMs
        // ...other emergent data to be calculated in later phases
      };
      GlobalEventBus.publish("emergent/frame", emergentPayload);
    }
    destroy() {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Destroying...`);
      }
      if (this.signature) {
        temporalMemoryService.saveSignature(this.signature);
      }
      if (this.saveInterval) {
        clearInterval(this.saveInterval);
      }
      this.eventSubscriptions.forEach((unsubscribe) => unsubscribe());
      this.eventSubscriptions = [];
      super.destroy?.();
    }
  };

  // src-js/utils/echoPool.ts
  var EchoPool = class {
    constructor() {
      this._maxSize = 32;
      this._pool = [];
    }
    /** Number of echo nodes currently in use (for debug / tests) */
    activeCount() {
      return document.querySelectorAll(
        ".sn-temporal-echo:not(.sn-temporal-echo--pooled)"
      ).length;
    }
    /**
     * Acquire an echo element from the pool or create a new one.
     */
    _acquire() {
      const el = this._pool.pop() || this._create();
      el.classList.remove("sn-temporal-echo--pooled");
      return el;
    }
    /**
     * Return an element back to the pool.
     */
    _release(el) {
      el.classList.add("sn-temporal-echo--pooled");
      el.style.opacity = "0";
      if (this._pool.length < this._maxSize) {
        this._pool.push(el);
      } else {
        el.remove();
      }
    }
    /**
     * Spawn an echo either at a given coordinate or centered on a target element.
     */
    spawn(target, opts = {}) {
      const el = this._acquire();
      let x, y;
      if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        x = target.x;
        y = target.y;
      }
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      if (opts.tintHue !== void 0) {
        el.style.setProperty("--sn-echo-hue", `${opts.tintHue}`);
      }
      if (opts.intensity !== void 0) {
        el.style.setProperty("--sn-kinetic-intensity", `${opts.intensity}`);
      }
      if (opts.radius !== void 0) {
        const scale = opts.radius / 16;
        el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
      }
      void el.offsetWidth;
      el.classList.add("sn-temporal-echo--active");
      const handleEnd = () => {
        el.removeEventListener("animationend", handleEnd);
        el.classList.remove("sn-temporal-echo--active");
        this._release(el);
      };
      el.addEventListener("animationend", handleEnd, { once: true });
      document.body.appendChild(el);
    }
    /**
     * Convenience wrapper: spawn echo underneath a target element inside its parent.
     */
    spawnBehind(target, opts = {}) {
      opts = { ...opts };
      const el = this._acquire();
      const rect = target.getBoundingClientRect();
      el.style.position = "absolute";
      el.style.left = `${rect.left + rect.width / 2}px`;
      el.style.top = `${rect.top + rect.height / 2}px`;
      if (opts.tintHue !== void 0) {
        el.style.setProperty("--sn-echo-hue", `${opts.tintHue}`);
      }
      if (opts.intensity !== void 0) {
        el.style.setProperty("--sn-kinetic-intensity", `${opts.intensity}`);
      }
      if (opts.radius !== void 0) {
        const scale = opts.radius / 16;
        el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
      }
      const parent = target.parentElement || document.body;
      parent.insertBefore(el, parent.firstChild);
      void el.offsetWidth;
      el.classList.add("sn-temporal-echo--active");
      const handleEnd = () => {
        el.removeEventListener("animationend", handleEnd);
        el.classList.remove("sn-temporal-echo--active");
        this._release(el);
      };
      el.addEventListener("animationend", handleEnd, { once: true });
    }
    /** Create a pristine echo DOM node */
    _create() {
      const el = document.createElement("div");
      el.className = "sn-temporal-echo sn-temporal-echo--pooled";
      el.style.position = "fixed";
      el.style.left = "0";
      el.style.top = "0";
      el.style.pointerEvents = "none";
      return el;
    }
  };
  var echoPool = new EchoPool();

  // src-js/systems/visual/BeatSyncVisualSystem.ts
  init_Year3000Utilities();
  var BeatSyncVisualSystem = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.beatFlashElement = null;
      this.crystallineOverlayElement = null;
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
      this.isAnimating = false;
      this.lastMemoryUsage = 0;
      this.frameCount = 0;
      this.performanceStartTime = Date.now();
      this.errorCount = 0;
      this._performanceMode = false;
      this._reducedQualityMode = false;
      this.currentEnergy = 0.5;
      this.modeConfig = null;
      this.harmonicSync = null;
      this.harmonicSyncInitialized = false;
      this.harmonicLoopId = null;
      this.currentHarmonicData = null;
      this.beatFlashIntensity = null;
      this.analysis = null;
      this.rafId = 0;
      this.smoothedLoudness = 0;
      this.SMOOTHING_FACTOR = 0.1;
      this.year3000System = year3000System2;
      this.performanceMetrics = {
        animationUpdates: 0,
        cssVariableUpdates: 0,
        memoryStartTime: performance.now(),
        memoryStartSize: this._getMemoryUsage()
      };
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("BeatSyncVisualSystem", this);
      }
      if (this.config.enableDebug) {
        console.log(
          `[${this.systemName} Constructor] Initialized with Master Animation Coordinator support.`
        );
      }
      this.onSongChange = this.onSongChange.bind(this);
      this.update = this.update.bind(this);
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
      this._createCrystallineOverlay();
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
    _createCrystallineOverlay() {
      this.crystallineOverlayElement = document.createElement("div");
      this.crystallineOverlayElement.className = "sn-crystalline-overlay";
      const crystals = ["a", "b", "c"];
      crystals.forEach((type) => {
        const crystalEl = document.createElement("div");
        crystalEl.className = `sn-crystal sn-crystal--${type}`;
        this.crystallineOverlayElement?.appendChild(crystalEl);
      });
      document.body.appendChild(this.crystallineOverlayElement);
    }
    _startAnimationLoop() {
      if (this.year3000System && typeof this.year3000System.registerAnimationSystem === "function") {
        const registered = this.year3000System.registerAnimationSystem(
          "BeatSyncVisualSystem",
          this,
          "critical",
          60
        );
        if (registered) {
          if (this.config?.enableDebug) {
            console.log(
              `\u{1F3AC} [${this.systemName}] Successfully registered with Master Animation Coordinator`
            );
          }
          return;
        }
      }
      console.warn(
        `[${this.systemName}] Master Animation Coordinator not available, using fallback loop`
      );
      this._startFallbackAnimationLoop();
    }
    _stopAnimationLoop() {
      if (this.year3000System && this.year3000System.unregisterAnimationSystem) {
        this.year3000System.unregisterAnimationSystem(
          "BeatSyncVisualSystem"
        );
        if (this.config?.enableDebug) {
          console.log(
            `\u{1F3AC} [${this.systemName}] Unregistered from Master Animation Coordinator`
          );
        }
      } else {
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      }
    }
    onAnimate(deltaMs) {
      this.updateAnimation(performance.now(), deltaMs);
    }
    updateAnimation(timestamp, deltaTime) {
      if (!this.isAnimating || !this.initialized) return;
      const frameStart = performance.now();
      this.frameCount++;
      try {
        const currentTime = performance.now();
        const actualDeltaTime = currentTime - this.lastAnimationTime;
        this.lastAnimationTime = currentTime;
        const latestMusicData = this.musicSyncService?.getLatestProcessedData();
        const processedEnergy = latestMusicData?.processedEnergy || 0.5;
        const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1;
        this.currentRhythmPhase = calculateRhythmPhase(
          currentTime,
          animationSpeedFactor
        );
        const breathingScale = calculateBreathingScale(
          this.currentRhythmPhase,
          processedEnergy
        );
        this._updateCSSVariables(
          breathingScale,
          this.currentRhythmPhase,
          actualDeltaTime,
          processedEnergy
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
          const rootStyle = getRootStyle();
          const accentRgb = rootStyle.style.getPropertyValue("--sn-gradient-accent-rgb").trim() || "140,170,238";
          this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${this.beatIntensity * 0.25})`;
          this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
        } else if (this.beatFlashElement) {
          this.beatFlashElement.style.opacity = "0";
        }
        this.updatePerformanceMetrics(performance.now() - frameStart);
      } catch (error) {
        console.error(`[${this.systemName}] Error in animation loop:`, error);
        this.errorCount++;
        if (this.errorCount > 100) {
          this._stopAnimationLoop();
          console.error(
            `[${this.systemName}] Too many errors, stopping animation.`
          );
        }
      }
    }
    onPerformanceModeChange(mode) {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Performance mode changed to:`, mode);
      }
      if (mode === "performance") {
        this._performanceMode = true;
        this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
      } else {
        this._performanceMode = false;
        this._startAnimationLoop();
      }
    }
    _startFallbackAnimationLoop() {
      const loop = () => {
        this.updateAnimation(performance.now(), 16.67);
        this.animationFrameId = requestAnimationFrame(loop);
      };
      this.animationFrameId = requestAnimationFrame(loop);
    }
    _animationLoop() {
      if (!this.isAnimating) return;
      const timestamp = performance.now();
      const deltaTime = timestamp - this.lastAnimationTime;
      this.lastAnimationTime = timestamp;
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const processedEnergy = latestMusicData?.processedEnergy || 0.5;
      const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1;
      this.currentRhythmPhase = calculateRhythmPhase(
        timestamp,
        animationSpeedFactor
      );
      const breathingScale = calculateBreathingScale(
        this.currentRhythmPhase,
        processedEnergy
      );
      this._updateCSSVariables(
        breathingScale,
        this.currentRhythmPhase,
        deltaTime,
        processedEnergy
      );
      this.animationFrameId = requestAnimationFrame(
        this._animationLoop.bind(this)
      );
    }
    _updateCSSVariables(breathingScale, rhythmPhase, deltaTime, processedEnergy) {
      if (deltaTime > 50) return;
      const root = getRootStyle();
      if (!root) return;
      const queueCSSUpdate = (property, value) => {
        if (this.year3000System?.queueCSSVariableUpdate && typeof this.year3000System.queueCSSVariableUpdate === "function") {
          this.year3000System.queueCSSVariableUpdate(property, value);
        } else {
          root.style.setProperty(property, value);
        }
      };
      queueCSSUpdate("--sn-breathing-scale", breathingScale.toFixed(4));
      queueCSSUpdate("--sn-rhythm-phase", rhythmPhase.toFixed(4));
      const beatPulseIntensity = this.beatIntensity;
      queueCSSUpdate("--sn-beat-pulse-intensity", beatPulseIntensity.toFixed(4));
      const bloomIntensity = processedEnergy * 0.4;
      queueCSSUpdate("--sn-feed-bloom-intensity", bloomIntensity.toFixed(3));
      this.performanceMetrics.cssVariableUpdates++;
    }
    getPerformanceReport() {
      const duration = (performance.now() - this.performanceStartTime) / 1e3;
      const currentMemory = this._getMemoryUsage();
      const memoryIncrease = Math.max(
        0,
        currentMemory - this.performanceMetrics.memoryStartSize
      );
      return {
        systemName: this.systemName,
        elapsedTime: duration.toFixed(1),
        animationUpdatesPerSecond: (this.performanceMetrics.animationUpdates / duration).toFixed(1),
        cssUpdatesPerSecond: (this.performanceMetrics.cssVariableUpdates / duration).toFixed(1),
        memoryIncreaseKB: (memoryIncrease / 1024).toFixed(1),
        currentRhythmPhase: this.currentRhythmPhase.toFixed(3),
        isSyncActive: this.isSyncActive
      };
    }
    _triggerBeat(timestamp) {
      if (!this.initialized) return;
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const energy = latestMusicData?.energy || 0.5;
      const visualIntensity = latestMusicData?.visualIntensity || 0.5;
      this.onBeatDetected(timestamp, energy, visualIntensity);
      try {
        const tintHue = (this.currentEnergy ?? 0.5) * 360;
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        if (typeof this.musicSyncService?.getCurrentBeatVector === "function") {
          const vec = this.musicSyncService.getCurrentBeatVector();
          x += (vec?.x ?? 0) * 80;
          y += (vec?.y ?? 0) * 80;
        }
        echoPool.spawn(
          { x, y },
          {
            tintHue,
            radius: 120,
            // Base radius for beat echo; may be tuned later
            intensity: 0.12
          }
        );
      } catch (e) {
        if (this.config?.enableDebug) {
          console.warn(`[BeatSyncVisualSystem] Echo spawn error:`, e);
        }
      }
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
          `\u{1F3B5} [${this.systemName}] Beat sync started - Enhanced BPM: ${bpm}, Interval: ${this.beatInterval.toFixed(1)}ms`
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
      if (!this.initialized || !processedMusicData || !this.isActive) return;
      super.updateFromMusicAnalysis(processedMusicData);
      const {
        enhancedBPM,
        baseBPM,
        tempo,
        bpmCalculationMethod,
        bpmMultiplier,
        estimatedEnergy,
        energy,
        visualIntensity,
        beats,
        beatOccurred
      } = processedMusicData;
      const newBPM = enhancedBPM || baseBPM || tempo || 120;
      this.currentEnergy = estimatedEnergy || energy || 0.5;
      if (newBPM !== this.currentBPM) {
        this.currentBPM = newBPM;
        this.beatInterval = this.utils.bpmToInterval(newBPM);
        this.lastBeatTime = performance.now();
        this.beatCount = 0;
        if (this.config.enableDebug) {
          const method = bpmCalculationMethod || "basic";
          const multiplier = bpmMultiplier || 1;
          console.log(
            `\u{1F3B5} [BeatSyncVisualSystem] BPM updated: ${baseBPM || tempo} \u2192 ${newBPM} (method: ${method}, mult: ${multiplier.toFixed(2)})`
          );
        }
      }
      if (enhancedBPM && enhancedBPM !== this.enhancedBPM) {
        this._startBeatSync(enhancedBPM);
      }
      if (beats && beats.length > 0) {
        this.usePreciseBeatTiming(beats);
      }
      this.updateVisualIntensity();
      if (beatOccurred) {
        this.onBeatDetected(performance.now(), energy, visualIntensity);
      }
    }
    onBeatDetected(currentTime, energy, visualIntensity) {
      this.lastBeatTime = currentTime;
      this.beatIntensity = Math.min(
        1,
        this.beatIntensity + (energy * 0.5 + visualIntensity * 0.5)
      );
      try {
        GlobalEventBus.publish("music:beat", {
          energy,
          bpm: this.currentBPM,
          valence: this.processedMusicData?.valence ?? 0
        });
      } catch (_e) {
      }
    }
    destroy() {
      this.disableHarmonicSync();
      this._stopBeatSync();
      this._stopAnimationLoop();
      if (this.crystallineOverlayElement && this.crystallineOverlayElement.parentElement) {
        this.crystallineOverlayElement.parentElement.removeChild(
          this.crystallineOverlayElement
        );
        this.crystallineOverlayElement = null;
      }
      const rootStyle = getRootStyle();
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
    usePreciseBeatTiming(beats) {
      if (!beats || beats.length === 0) return;
      const intervals = [];
      for (let i = 1; i < Math.min(beats.length, 20); i++) {
        intervals.push(beats[i].start - beats[i - 1].start);
      }
      if (intervals.length > 0) {
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
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
            animationComplexity
          });
        }
      }
    }
    calculateAnimationComplexity() {
      let complexity = 0;
      if (this.isAnimating) complexity += 10;
      if (this.processedMusicData && this.processedMusicData.visualIntensity > 0.7)
        complexity += 20;
      return complexity;
    }
    performCleanup() {
      this.errorCount = Math.max(0, this.errorCount - 1);
      if (this.frameCount > 1e4) {
        this.frameCount = Math.floor(this.frameCount / 2);
      }
    }
    updateModeConfiguration(modeConfig) {
      if (!modeConfig) return;
      const { enabled, animations, intensity, harmonicSync } = modeConfig;
      this.modeConfig = {
        systemEnabled: enabled !== false,
        harmonicSyncEnabled: harmonicSync || animations || false,
        oscillateEnabled: animations || false,
        intensityMultiplier: intensity || 1,
        temporalPlayEnabled: modeConfig.temporalPlay || false
      };
      if (this.modeConfig.harmonicSyncEnabled) {
        this.initializeHarmonicSync();
      } else {
        this.disableHarmonicSync();
      }
      this.updateBeatFlashIntensity();
    }
    initializeHarmonicSync() {
      if (this.harmonicSyncInitialized) return;
      this.harmonicSync = {
        masterFrequency: 1,
        harmonicLayers: [
          { frequency: 1, phase: 0, amplitude: 1, name: "fundamental" },
          { frequency: 0.5, phase: 0, amplitude: 0.7, name: "sub-harmonic" },
          {
            frequency: 2,
            phase: Math.PI / 4,
            amplitude: 0.5,
            name: "second-harmonic"
          },
          {
            frequency: 0.25,
            phase: Math.PI / 2,
            amplitude: 0.8,
            name: "deep-pulse"
          }
        ],
        subscribedSystems: /* @__PURE__ */ new Set(),
        syncEventChannel: "year3000HarmonicSync"
      };
      this.startHarmonicLoop();
      this.harmonicSyncInitialized = true;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F3B5} [${this.systemName}] Harmonic sync initialized with ${this.harmonicSync.harmonicLayers.length} layers`
        );
      }
    }
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
    startHarmonicLoop() {
      if (!this.harmonicSync) return;
      const harmonicLoop = (timestamp) => {
        if (!this.initialized || !this.harmonicSync || !this.modeConfig) return;
        this.updateHarmonicFrequencies();
        this.calculateHarmonicValues(timestamp);
        this.dispatchHarmonicSync(timestamp);
        this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
      };
      this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
    }
    updateHarmonicFrequencies() {
      if (!this.initialized || !this.harmonicSync || !this.modeConfig) return;
      const latestMusicData = this.musicSyncService?.getLatestProcessedData?.();
      if (!latestMusicData) return;
      const bpmFrequency = this.enhancedBPM / 60;
      this.harmonicSync.masterFrequency = bpmFrequency;
      const energy = latestMusicData?.processedEnergy || 0.5;
      const valence = latestMusicData?.valence || 0.5;
      this.harmonicSync.harmonicLayers.forEach((layer) => {
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
        if (this.modeConfig) {
          layer.amplitude *= this.modeConfig.intensityMultiplier || 1;
        }
      });
    }
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
          flow: 0
        }
      };
      this.harmonicSync.harmonicLayers.forEach((layer) => {
        const omega = 2 * Math.PI * layer.frequency * this.harmonicSync.masterFrequency;
        const value = layer.amplitude * Math.sin(omega * timeInSeconds + layer.phase);
        harmonicData.layers[layer.name] = {
          frequency: layer.frequency * this.harmonicSync.masterFrequency,
          amplitude: layer.amplitude,
          value,
          phase: layer.phase
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
      harmonicData.composite.flow = harmonicData.composite.oscillation * 0.6 + harmonicData.composite.pulse * 0.4;
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
      root.style.setProperty("--sn-harmonic-scale-pulse", scalePulse.toFixed(3));
      root.style.setProperty(
        "--sn-harmonic-rotation-flow",
        rotationFlow.toFixed(3)
      );
      root.style.setProperty(
        "--sn-harmonic-opacity-oscillation",
        opacityOscillation.toFixed(3)
      );
    }
    dispatchHarmonicSync(timestamp) {
      if (!this.currentHarmonicData || !this.harmonicSync) return;
      const syncEvent = new CustomEvent(this.harmonicSync.syncEventChannel, {
        detail: {
          ...this.currentHarmonicData,
          systemName: this.systemName,
          modeConfig: this.modeConfig
        }
      });
      document.dispatchEvent(syncEvent);
      if (typeof window !== "undefined") {
        window.Year3000HarmonicState = this.currentHarmonicData;
      }
    }
    clearHarmonicVariables() {
      const root = document.documentElement;
      const harmonicVars = [
        "--sn-harmonic-master-freq",
        "--sn-harmonic-oscillation",
        "--sn-harmonic-pulse",
        "--sn-harmonic-flow",
        "--sn-harmonic-scale-pulse",
        "--sn-harmonic-rotation-flow",
        "--sn-harmonic-opacity-oscillation"
      ];
      this.harmonicSync?.harmonicLayers?.forEach((layer) => {
        harmonicVars.push(`--sn-harmonic-${layer.name}`);
        harmonicVars.push(`--sn-harmonic-${layer.name}-freq`);
      });
      harmonicVars.forEach((varName) => {
        root.style.removeProperty(varName);
      });
    }
    updateBeatFlashIntensity() {
      if (!this.modeConfig) return;
      this.beatFlashIntensity = {
        base: 0.25 * (this.modeConfig.intensityMultiplier || 1),
        peak: 0.85 * (this.modeConfig.intensityMultiplier || 1),
        enabled: this.modeConfig.systemEnabled && this.modeConfig.oscillateEnabled
      };
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F525} [${this.systemName}] Updated beat flash intensity:`,
          this.beatFlashIntensity
        );
      }
    }
    getCurrentHarmonicData() {
      return this.currentHarmonicData || null;
    }
    updateVisualIntensity() {
    }
    start() {
      Spicetify.Player.addEventListener("songchange", this.onSongChange);
      this.onSongChange();
    }
    stop() {
      Spicetify.Player.removeEventListener("songchange", this.onSongChange);
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    }
    async onSongChange() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
      const currentTrack = Spicetify.Player.data?.item;
      if (!currentTrack || !currentTrack.uri) {
        return;
      }
      try {
        this.analysis = await Spicetify.getAudioData(currentTrack.uri);
        if (this.analysis && this.analysis.segments) {
          this.update();
        }
      } catch (error) {
        console.error("StarryNight: Failed to get audio data", error);
        this.analysis = null;
      }
    }
    update() {
      if (!this.analysis || !Spicetify.Player.isPlaying()) {
        this.smoothedLoudness = 0;
        document.documentElement.style.setProperty(
          "--sn-feed-bloom-intensity",
          "0"
        );
        this.rafId = requestAnimationFrame(this.update);
        return;
      }
      const progress = Spicetify.Player.getProgress() / 1e3;
      const segment = this.analysis.segments.find(
        (s) => progress >= s.start && progress < s.start + s.duration
      );
      let currentLoudness = 0;
      if (segment) {
        const normalizedLoudness = (segment.loudness_max + 60) / 60;
        currentLoudness = Math.max(0, Math.min(1, normalizedLoudness));
      }
      this.smoothedLoudness = currentLoudness * this.SMOOTHING_FACTOR + this.smoothedLoudness * (1 - this.SMOOTHING_FACTOR);
      const bloomIntensity = this.smoothedLoudness * 0.4;
      document.documentElement.style.setProperty(
        "--sn-feed-bloom-intensity",
        bloomIntensity.toFixed(3)
      );
      this.rafId = requestAnimationFrame(this.update);
    }
  };

  // src-js/systems/visual/BehavioralPredictionEngine.ts
  var BehavioralPredictionEngine = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.quantumEmpathyInitialized = false;
      this.predictionTimer = null;
      this.animationTimer = null;
      this.lastPredictionTime = 0;
      this.year3000System = year3000System2;
      this.modeConfig = {};
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
        patternDatabase: /* @__PURE__ */ new Map(),
        actionProbabilities: /* @__PURE__ */ new Map(),
        interactionHistory: [],
        maxHistoryLength: 50,
        learningThrottleMs: 1e3,
        predictionUpdateMs: 500,
        maxActiveAnimations: 5,
        maxWarmthIntensity: 0.8,
        currentActiveAnimations: 0
      };
      this._predictiveSystem = year3000System2 && year3000System2.getSystem ? year3000System2.getSystem("PredictiveMaterializationSystem") : null;
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F30C} [${this.systemName}] Optimized Quantum Empathy system initialized.`
        );
      }
    }
    // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
    onAnimate(deltaMs) {
    }
    async initialize() {
      await super.initialize();
      if (this.modeConfig?.quantumEmpathyEnabled) {
        this.initializeOptimizedQuantumEmpathy();
      }
      if (this.config?.enableDebug) {
        console.log(
          `\u{1F9E0} [${this.systemName}] Initialized with empathy status: ${this.modeConfig?.quantumEmpathyEnabled ? "COSMIC ACTIVE" : "DORMANT"}.`
        );
      }
    }
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
          handler
        });
      });
    }
    recordOptimizedInteraction(event) {
      if (!this.modeConfig?.quantumEmpathyEnabled) return;
      const interaction = {
        type: event.type,
        target: this.getElementSignature(event.target),
        timestamp: Date.now(),
        context: this.getCurrentMusicContext()
      };
      this.quantumEmpathy.interactionHistory.push(interaction);
      if (this.quantumEmpathy.interactionHistory.length > this.quantumEmpathy.maxHistoryLength) {
        this.quantumEmpathy.interactionHistory.shift();
      }
      this.learnFromInteractionOptimized(interaction);
    }
    getElementSignature(element) {
      if (!element) return "unknown";
      const signatures = [];
      if (element.className && typeof element.className === "string")
        signatures.push(`class:${element.className.split(" ")[0]}`);
      if (element.tagName)
        signatures.push(`tag:${element.tagName.toLowerCase()}`);
      return signatures.join("|") || "anonymous";
    }
    getCurrentMusicContext() {
      const latestMusicData = this.musicSyncService?.getLatestProcessedData?.() || {};
      return {
        energy: latestMusicData.processedEnergy || 0.5,
        valence: latestMusicData.valence || 0.5,
        timeSegment: Math.floor((/* @__PURE__ */ new Date()).getHours() / 6)
      };
    }
    learnFromInteractionOptimized(interaction) {
      const patternKey = `${interaction.target}:${interaction.type}`;
      if (!this.quantumEmpathy.patternDatabase.has(patternKey)) {
        this.quantumEmpathy.patternDatabase.set(patternKey, {
          frequency: 0,
          contexts: [],
          lastUsed: 0,
          confidence: 0.1
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
      pattern.confidence = Math.min(1, pattern.frequency / 5 * recencyFactor);
      if (this.quantumEmpathy.patternDatabase.size > 100) {
        this.cleanupOldPatterns();
      }
    }
    cleanupOldPatterns() {
      const cutoffTime = Date.now() - 3e5;
      for (const [
        key,
        pattern
      ] of this.quantumEmpathy.patternDatabase.entries()) {
        if (pattern.lastUsed < cutoffTime && pattern.confidence < 0.3) {
          this.quantumEmpathy.patternDatabase.delete(key);
        }
      }
    }
    startOptimizedPredictiveHighlighting() {
      if (this.predictionTimer) clearInterval(this.predictionTimer);
      this.predictionTimer = setInterval(() => {
        this.applySelectivePredictiveHighlighting();
      }, this.quantumEmpathy.predictionUpdateMs);
      this._activeTimers.push(this.predictionTimer);
    }
    calculateOptimizedPredictions() {
      const currentContext = this.getCurrentMusicContext();
      const predictions = [];
      if (!this.quantumEmpathy.patternDatabase) return predictions;
      for (const [
        key,
        pattern
      ] of this.quantumEmpathy.patternDatabase.entries()) {
        const confidence = pattern.confidence || 0;
        if (confidence < this.quantumEmpathy.confidenceThreshold) continue;
        const contextSimilarity = this.calculateSimplifiedContextSimilarity(
          pattern.contexts,
          currentContext
        );
        const finalConfidence = confidence * contextSimilarity;
        if (finalConfidence > this.predictionSensitivity) {
          const [target, type] = key.split(":");
          if (target && type) {
            predictions.push({
              target,
              type,
              confidence: finalConfidence
            });
          }
        }
      }
      return predictions.sort((a, b) => b.confidence - a.confidence);
    }
    calculateSimplifiedContextSimilarity(pastContexts, currentContext) {
      if (pastContexts.length === 0) return 0.5;
      let totalSimilarity = 0;
      for (const pContext of pastContexts) {
        const energyDiff = Math.abs(pContext.energy - currentContext.energy);
        const valenceDiff = Math.abs(pContext.valence - currentContext.valence);
        const timeDiff = pContext.timeSegment === currentContext.timeSegment ? 0 : 1;
        const similarity = 1 - (energyDiff + valenceDiff + timeDiff) / 3;
        totalSimilarity += similarity;
      }
      return totalSimilarity / pastContexts.length;
    }
    applySelectivePredictiveHighlighting() {
      const predictions = this.calculateOptimizedPredictions();
      const topPredictions = predictions.slice(0, 5);
      const elementsToHighlight = /* @__PURE__ */ new Map();
      for (const prediction of topPredictions) {
        const elements = this.findElementsBySignature(prediction.target);
        for (const element of elements) {
          if (!elementsToHighlight.has(element) || (elementsToHighlight.get(element) ?? 0) < prediction.confidence) {
            elementsToHighlight.set(element, prediction.confidence);
          }
        }
      }
      document.querySelectorAll(".sn-predictive-highlight").forEach((el) => {
        if (!elementsToHighlight.has(el)) {
          el.classList.remove("sn-predictive-highlight");
          el.classList.remove("sn-predictive-highlight-strong");
        }
      });
      for (const [element, confidence] of elementsToHighlight.entries()) {
        element.classList.add("sn-predictive-highlight");
        if (confidence > 0.75) {
          element.classList.add("sn-predictive-highlight-strong");
        }
      }
    }
    findElementsBySignature(signature) {
      if (!signature || typeof signature !== "string") return [];
      try {
        const parts = signature.split("|");
        let selector = "";
        parts.forEach((part) => {
          const [type, value] = part.split(":");
          if (type === "class" && value) {
            selector += `.${value}`;
          } else if (type === "tag" && value) {
            selector += `${value}`;
          }
        });
        if (selector) {
          return Array.from(document.querySelectorAll(selector));
        }
      } catch (error) {
        console.warn(
          `[${this.systemName}] Invalid selector signature:`,
          signature,
          error
        );
      }
      return [];
    }
    setupSelectiveAnticipatoryAnimations() {
      if (this.animationTimer) clearInterval(this.animationTimer);
      this.animationTimer = setInterval(() => {
        if (this.quantumEmpathy.currentActiveAnimations < this.quantumEmpathy.maxActiveAnimations) {
          const predictions = this.calculateOptimizedPredictions();
          const prediction = predictions[0];
          if (prediction) {
            const elements = this.findElementsBySignature(prediction.target);
            const firstElement = elements[0];
            if (firstElement && prediction.type) {
              this.triggerOptimizedAnticipatoryAnimation(
                firstElement,
                prediction.type,
                prediction.confidence
              );
            }
          }
        }
      }, this.quantumEmpathy.predictionUpdateMs * 2);
      this._activeTimers.push(this.animationTimer);
    }
    triggerOptimizedAnticipatoryAnimation(element, actionType, confidence) {
      if (this._predictiveSystem?.setTargetElement) {
        this._predictiveSystem.setTargetElement(element);
      }
      this.quantumEmpathy.currentActiveAnimations++;
      const intensity = Math.min(1, confidence * 1.2);
      element.classList.add("sn-anticipatory-warmth");
      const hueShift = (Math.random() * 40 - 20).toFixed(1);
      element.style.setProperty(
        "--sn-anticipatory-intensity",
        intensity.toFixed(3)
      );
      element.style.setProperty(
        "--sn-anticipatory-hue",
        `${hueShift}deg`
      );
      element.style.setProperty(
        "--sn-warmth-intensity",
        `${intensity}`
      );
      element.style.setProperty(
        "--sn-warmth-duration",
        `${1500 - intensity * 500}ms`
      );
      const animationEndHandler = () => {
        element.classList.remove("sn-anticipatory-warmth");
        this.quantumEmpathy.currentActiveAnimations--;
        element.removeEventListener("animationend", animationEndHandler);
      };
      element.addEventListener("animationend", animationEndHandler);
    }
    updateFromMusicAnalysis(processedMusicData, timestamp) {
      if (!this.initialized || !this.modeConfig?.quantumEmpathyEnabled) return;
      const now = Date.now();
      if (now - this.lastPredictionTime > this.quantumEmpathy.predictionUpdateMs) {
        this.predictUserInteractions(
          processedMusicData,
          now - this.lastPredictionTime
        );
        this.lastPredictionTime = now;
      }
    }
    generatePredictions(context) {
      const predictions = [];
      Object.keys(this.predictionModel).forEach((action) => {
        const actionModel = this.predictionModel[action];
        let score = actionModel.base;
        Object.keys(context).forEach((feature) => {
          if (actionModel[feature]) {
            score += actionModel[feature] * context[feature] / 100;
          }
        });
        if (score > (actionModel.threshold ?? this.predictionSensitivity)) {
          predictions.push({
            target: action,
            type: "highlight",
            confidence: score
          });
        }
      });
      return predictions;
    }
    applyHighlights(predictions) {
      const elementsToDeactivate = new Set(
        Object.keys(MODERN_SELECTORS).map((key) => key.toLowerCase())
      );
      predictions.forEach((prediction) => {
        const key = prediction.target.toLowerCase();
        const selector = MODERN_SELECTORS[key] || ORBITAL_ELEMENTS[key];
        if (selector) {
          elementsToDeactivate.delete(key);
          const elements = findElementsWithFallback(key);
          elements.forEach((element) => {
            const highlightClass = this.getHighlightClasses(
              prediction.confidence > 0.7 ? "strong" : "default"
            );
            if (!this.activeHighlights.has(element)) {
              element.classList.add(...highlightClass);
              this.activeHighlights.set(element, highlightClass.join(" "));
            }
          });
        }
      });
      elementsToDeactivate.forEach((key) => {
        const elements = findElementsWithFallback(key);
        elements.forEach((element) => {
          const classes = this.activeHighlights.get(element);
          if (classes) {
            element.classList.remove(...classes.split(" "));
            this.activeHighlights.delete(element);
          }
        });
      });
    }
    /**
     * Map confidence buckets to CSS classes defined in _sn_prediction_effects.scss.
     * The naming now aligns with the unified "sn-predict-" convention.
     */
    getHighlightClasses(type) {
      switch (type) {
        case "strong":
          return [
            "sn-predict-glow",
            // vivid static glow
            "sn-predict-pulse"
            // animated pulse
          ];
        default:
          return ["sn-predict-subtle-glow"];
      }
    }
    updateModeConfiguration(modeConfig) {
      super.updateModeConfiguration(modeConfig);
      this.updatePredictionBehaviorForMode();
      if (this.modeConfig?.quantumEmpathyEnabled) {
        this.initializeOptimizedQuantumEmpathy();
      } else {
        this.destroy();
      }
    }
    updatePredictionBehaviorForMode() {
      if (!this.modeConfig) return;
      const settings = this.modeConfig.predictionSettings;
      if (settings) {
        this.predictionSensitivity = settings.sensitivity ?? 0.5;
        this.highlightResponsiveness = settings.responsiveness ?? 0.8;
        this.quantumEmpathy.confidenceThreshold = settings.confidenceThreshold ?? 0.6;
      }
    }
    destroy() {
      super.destroy();
      this._activeTimers.forEach(clearInterval);
      this._eventListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this._activeTimers = [];
      this._eventListeners = [];
      this.quantumEmpathyInitialized = false;
      if (this.config?.enableDebug) {
        console.log(
          `[${this.systemName}] Destroyed. No longer predicting user behavior.`
        );
      }
    }
    testUpdatedSelectors() {
      console.log("===== BehavioralPredictionEngine: Selector Test =====");
      let allFound = true;
      Object.keys(MODERN_SELECTORS).forEach((key) => {
        const elements = findElementsWithFallback(key);
        if (elements.length > 0) {
          console.log(`\u2705 Found ${elements.length} for key: ${key}`);
        } else {
          console.error(`\u274C Missing element for key: ${key}`);
          allFound = false;
        }
      });
      console.log(
        allFound ? "\u2705 All primary selectors are valid." : "\u274C Some selectors failed."
      );
    }
    simulateHighlighting() {
      const mockPredictions = Object.keys(MODERN_SELECTORS).map((key) => ({
        target: key,
        type: "highlight",
        confidence: Math.random()
      })).slice(0, 3);
      console.log(
        "Simulating highlights for:",
        mockPredictions.map((p) => p.target)
      );
      this.applyHighlights(mockPredictions);
      setTimeout(() => {
        console.log("Clearing simulated highlights.");
        this.applyHighlights([]);
      }, 2e3);
    }
    initializePredictionModel() {
      return {
        playButton: { base: 60, energy: 20, tempo: -10, threshold: 65 },
        nextButton: { base: 40, energy: 15, valence: -15, threshold: 50 },
        progressBar: { base: 30, energy: -10, loudness: 10 },
        likeButton: { base: 50, valence: 30, energy: 10, threshold: 60 },
        sidebarPlaylists: { base: 25, acousticness: -15 }
      };
    }
    updateAnimation(timestamp, deltaTime) {
      if (!this.initialized || !this.modeConfig?.quantumEmpathyEnabled) return;
    }
    predictUserInteractions(musicData, deltaTime) {
      if (!musicData) return;
      const context = {
        energy: musicData.energy || 0,
        valence: musicData.valence || 0,
        tempo: musicData.tempo || 0,
        loudness: musicData.loudness || 0
      };
      const predictions = this.generatePredictions(context);
      if (predictions.length > 0) {
        this.applyHighlights(predictions);
      }
    }
  };

  // src-js/utils/NoiseField.ts
  var GRID_SIZE = 64;
  var vectors = new Array(GRID_SIZE * GRID_SIZE);
  (function init() {
    for (let i = 0; i < vectors.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      vectors[i] = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    }
  })();
  function sample(u, v) {
    const x = Math.max(0, Math.min(0.9999, u)) * (GRID_SIZE - 1);
    const y = Math.max(0, Math.min(0.9999, v)) * (GRID_SIZE - 1);
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const sx = x - x0;
    const sy = y - y0;
    const v00 = vectors[y0 * GRID_SIZE + x0];
    const v10 = vectors[y0 * GRID_SIZE + x1 % GRID_SIZE];
    const v01 = vectors[y1 % GRID_SIZE * GRID_SIZE + x0];
    const v11 = vectors[y1 % GRID_SIZE * GRID_SIZE + x1 % GRID_SIZE];
    const lerp2 = (a, b, t) => a + (b - a) * t;
    const ix0x = lerp2(v00.x, v10.x, sx);
    const ix0y = lerp2(v00.y, v10.y, sx);
    const ix1x = lerp2(v01.x, v11.x, sx);
    const ix1y = lerp2(v01.y, v11.y, sx);
    return {
      x: lerp2(ix0x, ix1x, sy),
      y: lerp2(ix0y, ix1y, sy)
    };
  }

  // src-js/systems/visual/DataGlyphSystem.ts
  var _DataGlyphSystem = class _DataGlyphSystem extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.masterAnimationRegistered = false;
      this.animationFrameId = null;
      this.isUsingMasterAnimation = false;
      this.itemObserver = null;
      this.hoverTimeouts = /* @__PURE__ */ new WeakMap();
      this.currentEchoCount = 0;
      // --- Phase4: recent echo timestamps per element for clustering -----------
      this.recentEchoes = /* @__PURE__ */ new WeakMap();
      // TODO[PHASE3-POOL]: Pool of detached .sn-temporal-echo elements reused to cut GC churn.
      this.echoPool = [];
      this.year3000System = year3000System2;
      this.observedItems = /* @__PURE__ */ new Map();
      this.glyphDataCache = /* @__PURE__ */ new WeakMap();
      this.itemInteractionData = /* @__PURE__ */ new Map();
      this.activeEchoTimers = /* @__PURE__ */ new WeakMap();
      this.glyphElements = /* @__PURE__ */ new Map();
      this.interactionHistory = [];
      this.modeIntensity = 0.5;
      this.lastHeavyUpdateTime = 0;
      this.heavyUpdateInterval = 1e3;
      this._eventListeners = [];
      this._domEventListeners = [];
      this.memoryOptimization = {
        maxCacheSize: 100,
        cleanupInterval: 3e4,
        lastCleanup: Date.now(),
        maxEchoTimers: 50,
        maxObservedItems: 200,
        staleItemThreshold: 3e5
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
        observedItemsCleanups: 0
      };
      this.deviceCapabilities = {
        maxParticles: this._detectMaxParticles(),
        supportsCSSFilter: this._detectCSSFilterSupport(),
        supportsWebGL: this._detectWebGLSupport(),
        performanceLevel: this._detectPerformanceLevel(),
        reducedMotion: this._detectReducedMotion()
      };
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("DataGlyphSystem", this);
      }
    }
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
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
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
    }
    _tryRegisterWithMasterAnimation() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        try {
          this.year3000System.registerAnimationSystem(
            "DataGlyphSystem",
            this,
            "normal",
            this.deviceCapabilities.performanceLevel === "high" ? 60 : 30
          );
          this.masterAnimationRegistered = true;
          this.isUsingMasterAnimation = true;
        } catch (error) {
          this._startFallbackAnimationLoop();
        }
      } else {
        this._startFallbackAnimationLoop();
      }
    }
    _startFallbackAnimationLoop() {
      this.isUsingMasterAnimation = false;
      const fallbackLoop = () => {
        if (!this.initialized) return;
        this.updateAnimation(performance.now(), 16.67);
        this.animationFrameId = requestAnimationFrame(fallbackLoop);
      };
      this.animationFrameId = requestAnimationFrame(fallbackLoop);
    }
    // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
    onAnimate(deltaMs) {
      this.updateAnimation(performance.now(), deltaMs);
    }
    updateAnimation(timestamp, deltaTime) {
      const frameStartTime = performance.now();
      try {
        const maxFrameTime = this.deviceCapabilities.performanceLevel === "high" ? 8 : this.deviceCapabilities.performanceLevel === "medium" ? 12 : 16;
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
        if (timestamp - this.memoryOptimization.lastCleanup > this.memoryOptimization.cleanupInterval) {
          this.performOptimizedCleanup();
        }
        const frameTime = performance.now() - frameStartTime;
        this.updatePerformanceMetrics(frameTime);
      } catch (error) {
        console.error(`[${this.systemName}] Animation update error:`, error);
      }
    }
    onPerformanceModeChange(mode) {
      if (mode === "performance") {
        this.heavyUpdateInterval = 1500;
        this.memoryOptimization.maxObservedItems = 100;
      } else {
        this.heavyUpdateInterval = 1e3;
        this.memoryOptimization.maxObservedItems = 200;
      }
    }
    /**
     * Optimized maintenance pass executed at a relatively low frequency (default 1 s).
     * Responsibilities:
     *   1. Detach glyphs whose host elements have been removed from the DOM.
     *   2. Ensure we respect the `maxObservedItems` cap.
     *   3. NO full-document `querySelectorAll` – MutationObserver already attaches new glyphs.
     *
     *  This change aligns with the Year 3000 "Kinetic Verbs" ethos—moving lightly through the
     *  DOM constellation instead of flooding it with scans every 50 ms.
     */
    _updateGlyphTargetsOptimized() {
      this.observedItems.forEach((_, itemElement) => {
        if (!document.contains(itemElement)) {
          const glyph = this.glyphElements.get(itemElement);
          if (glyph) {
            this.detachGlyph(itemElement, glyph);
          }
        }
      });
      if (this.observedItems.size > this.memoryOptimization.maxObservedItems) {
        const overflow = this.observedItems.size - this.memoryOptimization.maxObservedItems;
        const iterator = this.observedItems.keys();
        for (let i = 0; i < overflow; i++) {
          const elem = iterator.next().value;
          if (!elem) break;
          const glyph = this.glyphElements.get(elem);
          if (glyph) this.detachGlyph(elem, glyph);
        }
      }
    }
    _isElementInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }
    setupItemObserver() {
      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                this._scanAndAttachGlyphs(node);
              }
            });
            mutation.removedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                this._scanAndDetachGlyphs(node);
              }
            });
          }
        }
      };
      this.itemObserver = new MutationObserver(observerCallback);
      this.itemObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    _scanAndAttachGlyphs(rootElement) {
      const selector = Object.values(MODERN_SELECTORS).join(", ");
      if (!selector) return;
      const items = rootElement.matches(selector) ? [rootElement] : Array.from(rootElement.querySelectorAll(selector));
      items.forEach((item) => this.attachGlyph(item));
    }
    _scanAndDetachGlyphs(rootElement) {
      const selector = Object.values(MODERN_SELECTORS).join(", ");
      if (!selector) return;
      const items = rootElement.matches(selector) ? [rootElement] : Array.from(rootElement.querySelectorAll(selector));
      items.forEach((item) => {
        const glyph = this.glyphElements.get(item);
        if (glyph) this.detachGlyph(item, glyph);
      });
    }
    attachGlyph(itemElement) {
      if (this.glyphElements.has(itemElement) || this.observedItems.size >= this.memoryOptimization.maxObservedItems)
        return;
      const glyphElement = document.createElement("div");
      glyphElement.className = "sn-data-glyph";
      itemElement.appendChild(glyphElement);
      this.glyphElements.set(itemElement, glyphElement);
      const data = this.updateGlyphData(itemElement, {});
      this.glyphDataCache.set(itemElement, data);
      const boundHandleInteraction = (event) => this.handleItemInteraction(itemElement, event);
      itemElement.addEventListener("mouseenter", boundHandleInteraction);
      itemElement.addEventListener("mouseleave", boundHandleInteraction);
      const removeListeners = () => {
        itemElement.removeEventListener("mouseenter", boundHandleInteraction);
        itemElement.removeEventListener("mouseleave", boundHandleInteraction);
      };
      this.observedItems.set(itemElement, { removeListeners });
    }
    detachGlyph(itemElement, glyphElement) {
      if (glyphElement.parentElement) {
        glyphElement.parentElement.removeChild(glyphElement);
      }
      this.glyphElements.delete(itemElement);
      const observation = this.observedItems.get(itemElement);
      if (observation) {
        observation.removeListeners();
        this.observedItems.delete(itemElement);
      }
      this.glyphDataCache.delete(itemElement);
      this.itemInteractionData.delete(itemElement);
    }
    animateAllGlyphs() {
      this.observedItems.forEach((_, itemElement) => {
        const itemData = this.glyphDataCache.get(itemElement);
        if (itemData) {
          this.updateGlyphVisuals(itemElement, itemData);
        }
      });
    }
    updateGlyphVisuals(itemElement, itemData) {
      const glyphElement = this.glyphElements.get(itemElement);
      if (!glyphElement) return;
      const musicData = this.musicSyncService?.getLatestProcessedData();
      let intensity = 0;
      if (musicData) {
        intensity = musicData.energy * 0.5 + musicData.valence * 0.5;
      }
      intensity = (intensity + itemData.attentionScore) / 2;
      const applyCss = (prop, val, el) => {
        if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(prop, val, el);
        } else {
          el.style.setProperty(prop, val);
        }
      };
      applyCss("--glyph-intensity", `${intensity}`, glyphElement);
      glyphElement.style.opacity = `${intensity * 0.8}`;
    }
    updateGlyphData(itemElement, data) {
      let glyphData = this.glyphDataCache.get(itemElement);
      if (!glyphData) {
        glyphData = {
          id: itemElement.getAttribute("data-uri") || `glyph-${Date.now()}`,
          type: "track",
          lastInteracted: 0,
          intensity: 0,
          kineticState: { velocity: { x: 0, y: 0 }, rotation: 0, scale: 1 },
          musicContext: {},
          attentionScore: 0
        };
      }
      const updatedData = { ...glyphData, ...data };
      this.glyphDataCache.set(itemElement, updatedData);
      return updatedData;
    }
    handleItemInteraction(itemElement, event) {
      const glyphData = this.updateGlyphData(itemElement, {
        lastInteracted: Date.now(),
        attentionScore: event.type === "mouseenter" ? 1 : 0
      });
      if (event.type === "mouseenter") {
        const dwell = setTimeout(() => {
          this.addTemporalEcho(itemElement);
        }, 120);
        this.hoverTimeouts.set(itemElement, dwell);
      } else if (event.type === "mouseleave") {
        const t = this.hoverTimeouts.get(itemElement);
        if (t) clearTimeout(t);
        this.hoverTimeouts.delete(itemElement);
      }
    }
    updateActiveEchoesAndResonance() {
    }
    destroy() {
      super.destroy();
      if (this.itemObserver) this.itemObserver.disconnect();
      this.observedItems.forEach(
        (val, key) => this.detachGlyph(key, this.glyphElements.get(key))
      );
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
    performOptimizedCleanup() {
      const now = Date.now();
      for (const [element, data] of this.itemInteractionData.entries()) {
        if (now - data.lastInteraction > this.memoryOptimization.staleItemThreshold) {
          this.itemInteractionData.delete(element);
        }
      }
      if (this.observedItems.size > this.memoryOptimization.maxObservedItems) {
        for (const [element, data] of this.observedItems.entries()) {
          const glyphData = this.glyphDataCache.get(element);
          if (!glyphData || now - glyphData.lastInteracted > this.memoryOptimization.staleItemThreshold) {
            this.detachGlyph(element, this.glyphElements.get(element));
          }
          if (this.observedItems.size <= this.memoryOptimization.maxObservedItems)
            break;
        }
      }
      this.memoryOptimization.lastCleanup = now;
    }
    updatePerformanceMetrics(frameTime) {
      this.performanceMetrics.animationFrames++;
      this.performanceMetrics.frameTimeHistory.push(frameTime);
      if (this.performanceMetrics.frameTimeHistory.length > 100) {
        this.performanceMetrics.frameTimeHistory.shift();
      }
      this.performanceMetrics.maxFrameTime = Math.max(
        this.performanceMetrics.maxFrameTime,
        frameTime
      );
      this.performanceMetrics.averageFrameTime = this.performanceMetrics.frameTimeHistory.reduce((a, b) => a + b, 0) / this.performanceMetrics.frameTimeHistory.length;
    }
    calculateGlyphComplexity() {
      return this.observedItems.size;
    }
    estimateMemoryUsage() {
      return this.observedItems.size * 5 + this.itemInteractionData.size * 2;
    }
    updateModeConfiguration(modeConfig) {
      super.updateModeConfiguration(modeConfig);
      if (modeConfig.glyphIntensity) {
        this.modeIntensity = modeConfig.glyphIntensity;
      }
      this.applyModeToExistingGlyphs();
    }
    applyModeToExistingGlyphs() {
      this.observedItems.forEach((_, item) => {
        const glyph = this.glyphElements.get(item);
        if (glyph) {
          glyph.setAttribute(
            "data-glyph-mode",
            this.modeConfig.activeMode || "default"
          );
        }
      });
    }
    addTemporalEcho(element) {
      const now = Date.now();
      const bucket = this.recentEchoes.get(element) ?? [];
      const filtered = bucket.filter((t) => now - t < 300);
      filtered.push(now);
      this.recentEchoes.set(element, filtered);
      const spawnMega = filtered.length >= 3;
      if (spawnMega) {
        this.recentEchoes.set(element, []);
      }
      if (this.currentEchoCount >= this.dynamicMaxEchoes) return;
      if (this.echoIntensitySetting === 0) return;
      const echo = this.acquireEchoElement();
      const musicData = this.musicSyncService?.getLatestProcessedData();
      const energy = musicData?.energy ?? 0;
      const valence = musicData?.valence ?? 0.5;
      const intensityFactor = 0.2 * this.echoIntensitySetting;
      let radius = Math.min(1.6, 1 + energy * 0.4 + intensityFactor);
      const hueShift = ((valence - 0.5) * 40).toFixed(1);
      const beatVec = this.musicSyncService?.getCurrentBeatVector?.();
      let offsetX = 0, offsetY = 0, skewDeg = 0;
      try {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = Math.min(Math.max(centerX / window.innerWidth, 0), 1);
        const normY = Math.min(Math.max(centerY / window.innerHeight, 0), 1);
        const vec = sample(normX, normY);
        const intensityMult = this.echoIntensitySetting;
        const offsetMagnitude = 6 + energy * 6 + intensityMult * 2;
        offsetX = vec.x * offsetMagnitude;
        offsetY = vec.y * offsetMagnitude;
        if (beatVec) {
          offsetX += beatVec.x * 10;
          offsetY += beatVec.y * 10;
        }
        skewDeg = vec.x * 6;
      } catch (e) {
      }
      if (spawnMega) {
        radius = Math.min(radius * 1.6, 2.4);
        echo.style.setProperty("--sn-kinetic-intensity", "0.4");
      }
      const baseAngle = (Math.random() * 360).toFixed(1);
      echo.style.setProperty("--sn-echo-radius-multiplier", radius.toFixed(2));
      echo.style.setProperty("--sn-echo-hue-shift", `${hueShift}deg`);
      echo.style.setProperty("--sn-echo-offset-x", `${offsetX.toFixed(1)}px`);
      echo.style.setProperty("--sn-echo-offset-y", `${offsetY.toFixed(1)}px`);
      echo.style.setProperty("--sn-echo-skew", `${skewDeg.toFixed(2)}deg`);
      echo.style.setProperty("--sn-echo-rotate", `${baseAngle}deg`);
      element.appendChild(echo);
      this.currentEchoCount++;
      setTimeout(() => {
        if (echo.parentElement) echo.parentElement.removeChild(echo);
        this.currentEchoCount--;
        this.releaseEchoElement(echo);
      }, 1250);
    }
    get echoIntensitySetting() {
      const val = this.settingsManager?.get?.("sn-echo-intensity") ?? "2";
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 2 : parsed;
    }
    get dynamicMaxEchoes() {
      switch (this.echoIntensitySetting) {
        case 0:
          return 0;
        case 1:
          return Math.ceil(_DataGlyphSystem.BASE_MAX_ECHOES / 2);
        case 3:
          return _DataGlyphSystem.BASE_MAX_ECHOES * 2;
        default:
          return _DataGlyphSystem.BASE_MAX_ECHOES;
      }
    }
    // --- Phase3 helper methods ---------------------------------------
    /** Obtain an echo element from pool or create */
    acquireEchoElement() {
      let el = this.echoPool.pop();
      if (el) {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      } else {
        el = document.createElement("div");
        el.className = "sn-temporal-echo";
      }
      return el;
    }
    /** Return echo element to pool (bounded) */
    releaseEchoElement(el) {
      if (this.echoPool.length < 20) {
        this.echoPool.push(el);
      }
    }
  };
  _DataGlyphSystem.BASE_MAX_ECHOES = 6;
  var DataGlyphSystem = _DataGlyphSystem;

  // src-js/systems/visual/DimensionalNexusSystem.ts
  var DimensionalNexusSystem = class extends BaseVisualSystem {
    // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
    onAnimate(deltaMs) {
    }
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.year3000System = year3000System2;
      this.nexusState = {
        complexity: 0.1,
        coherence: 0.8,
        volatility: 0.05,
        timeDistortionFactor: 1,
        currentNavigationScale: 1,
        targetComplexity: 0.1,
        targetCoherence: 0.8,
        targetVolatility: 0.05,
        targetTimeDistortionFactor: 1,
        targetNavigationScale: 1,
        userInfluence: 0,
        lastEnergy: 0.5,
        lastValence: 0.5,
        lastVisualIntensity: 0.5,
        lastMoodIdentifier: "neutral",
        responsiveness: 1,
        temporalSensitivity: 1
      };
      this.biometricState = {
        isMeditating: false,
        lastUserInteractionTime: Date.now(),
        meditationGracePeriod: 5e3,
        interactionCooldown: 1e3,
        lastMeditationUpdateTime: null,
        desaturation: 0,
        slowdown: 1,
        targetDesaturation: 0,
        targetSlowdown: 1
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
        navigationScaleUpdates: 0
      };
      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.registerSystem("DimensionalNexusSystem", this);
      }
      this.rootElement = this.utils.getRootStyle();
      this.modalObserver = null;
      this._lastScrollTime = null;
      this._lastScrollTop = null;
    }
    async initialize() {
      await super.initialize();
      this.initializeOptimizedQuantumSpace();
      this.setupModalObserver();
      this.setupOptimizedInteractionListener();
      this._registerWithAnimationCoordinator();
    }
    _registerWithAnimationCoordinator() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        this.year3000System.registerAnimationSystem(
          "DimensionalNexusSystem",
          this,
          "normal",
          30
        );
        this._animationRegistered = true;
      } else {
        this._startFallbackAnimationLoops();
      }
    }
    initializeOptimizedQuantumSpace() {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const safeSetProperty = (name, value) => {
        try {
          root.style.setProperty(name, value);
        } catch (e) {
        }
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
    recordUserInteraction(event) {
      const eventType = event.type;
      if (eventType === "scroll") {
        const target = event.target;
        if (target) {
          const newTop = target.scrollTop;
          const now2 = performance.now();
          const velocity = this._lastScrollTime ? (newTop - (this._lastScrollTop ?? 0)) / (now2 - this._lastScrollTime) : 0;
          const direction = velocity < 0 ? "up" : "down";
          GlobalEventBus.publish("user:scroll", {
            velocity: velocity * 1e3,
            // pixels per second
            direction
          });
          this._lastScrollTop = newTop;
          this._lastScrollTime = now2;
        }
      }
      const now = performance.now();
      if (now - this.lastInteractionRecordTime < this.interactionRecordInterval) {
        return;
      }
      this.lastInteractionRecordTime = now;
      this.nexusState.userInfluence += 5e-3;
      this.nexusState.volatility = Math.min(1, this.nexusState.volatility + 0.01);
      this.nexusState.userInfluence = Math.min(
        0.5,
        this.nexusState.userInfluence
      );
      this.biometricState.lastUserInteractionTime = Date.now();
      this.biometricState.isMeditating = false;
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
          }
        }
      };
      this.modalObserver = new MutationObserver(observerCallback);
      this.modalObserver.observe(modalRoot, { childList: true });
    }
    setupOptimizedInteractionListener() {
      const interactionEvents = ["click", "mousemove", "scroll", "keydown"];
      const throttledHandler = this.utils.throttle(
        (event) => this.recordUserInteraction(event),
        100
      );
      interactionEvents.forEach((eventType) => {
        document.addEventListener(eventType, throttledHandler, { passive: true });
      });
    }
    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.initialized || !this.validateMusicData(processedMusicData)) {
        this.applySafeDefaults();
        return;
      }
      this.updateNexusTargets(processedMusicData);
    }
    updateNexusTargets(processedMusicData) {
      const {
        energy,
        valence,
        visualIntensity,
        animationSpeedFactor,
        moodIdentifier
      } = processedMusicData;
      this.nexusState.targetComplexity = (energy * 0.6 + visualIntensity * 0.4) * 0.9 + 0.1;
      this.nexusState.targetCoherence = 1 - (energy * 0.5 + visualIntensity * 0.5) * 0.6;
      this.nexusState.targetVolatility = (1 - valence) * 0.1 + (energy - 0.5) * 0.05;
      this.nexusState.targetTimeDistortionFactor = animationSpeedFactor;
      this.nexusState.targetNavigationScale = this.calculateOptimizedNavigationScale(visualIntensity, moodIdentifier);
    }
    updateDigitalMeditationState(processedMusicData) {
      const now = Date.now();
      if (now - this.lastBiometricCheckTime < this.biometricCheckInterval) {
        return;
      }
      this.lastBiometricCheckTime = now;
      const timeSinceLastInteraction = now - this.biometricState.lastUserInteractionTime;
      if (timeSinceLastInteraction > this.biometricState.meditationGracePeriod && processedMusicData.energy < 0.3 && processedMusicData.valence > 0.6) {
        this.biometricState.isMeditating = true;
        this.biometricState.targetDesaturation = 0.6;
        this.biometricState.targetSlowdown = 0.5;
      } else {
        this.biometricState.isMeditating = false;
        this.biometricState.targetDesaturation = 0;
        this.biometricState.targetSlowdown = 1;
      }
    }
    updateAnimation(timestamp, deltaTime) {
      if (!this.initialized) return;
      this._frameSkipCounter++;
      if (this._frameSkipCounter < this._maxFrameSkip) {
        return;
      }
      this._frameSkipCounter = 0;
      this.animateOptimizedNexusFrame(deltaTime);
      if (timestamp - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
        const latestMusicData = this.musicSyncService?.getLatestProcessedData();
        if (latestMusicData) this.updateDigitalMeditationState(latestMusicData);
        this.updateIntegrationMetrics();
        this.lastHeavyUpdateTime = timestamp;
      }
    }
    onPerformanceModeChange(mode) {
      this._performanceMode = mode;
      if (mode === "performance") {
        this.heavyUpdateInterval = 1e3 / 5;
        this._maxFrameSkip = 3;
        this.interactionRecordInterval = 500;
      } else {
        this.heavyUpdateInterval = 1e3 / 10;
        this._maxFrameSkip = 2;
        this.interactionRecordInterval = 200;
      }
    }
    _startFallbackAnimationLoops() {
      const loop = () => {
        this.updateAnimation(performance.now(), 16.67);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    animateOptimizedNexusFrame(deltaTimeMs) {
      const lerpFactor = Math.min((deltaTimeMs ?? 16.67) / 1e3 * 5, 1);
      this.nexusState.complexity = this.utils.lerp(
        this.nexusState.complexity,
        this.nexusState.targetComplexity,
        lerpFactor
      );
      this.nexusState.coherence = this.utils.lerp(
        this.nexusState.coherence,
        this.nexusState.targetCoherence,
        lerpFactor
      );
      this.nexusState.volatility = this.utils.lerp(
        this.nexusState.volatility,
        this.nexusState.targetVolatility,
        lerpFactor
      );
      this.nexusState.currentNavigationScale = this.utils.lerp(
        this.nexusState.currentNavigationScale,
        this.nexusState.targetNavigationScale,
        lerpFactor
      );
      this.biometricState.desaturation = this.utils.lerp(
        this.biometricState.desaturation,
        this.biometricState.targetDesaturation,
        lerpFactor
      );
      this.biometricState.slowdown = this.utils.lerp(
        this.biometricState.slowdown,
        this.biometricState.targetSlowdown,
        lerpFactor
      );
      this.applyOptimizedStateToCSS();
    }
    applyOptimizedStateToCSS() {
      const queueCSSUpdate = (property, value) => {
        if (this.year3000System?.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(
            property,
            value.toString()
          );
        } else {
          this.rootElement.style.setProperty(property, value.toString());
        }
      };
      queueCSSUpdate(
        "--sn-nexus-complexity",
        this.nexusState.complexity.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-nexus-coherence",
        this.nexusState.coherence.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-nexus-volatility",
        this.nexusState.volatility.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-nav-item-transform-scale",
        this.nexusState.currentNavigationScale.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-sidebar-meditation-desaturation",
        this.biometricState.desaturation.toFixed(3)
      );
      queueCSSUpdate(
        "--sn-sidebar-meditation-slowdown",
        this.biometricState.slowdown.toFixed(3)
      );
    }
    validateMusicData(data) {
      return data && typeof data.energy === "number" && typeof data.valence === "number" && typeof data.visualIntensity === "number";
    }
    applySafeDefaults() {
      const safeSetProperty = (name, value) => {
        if (this.rootElement) this.rootElement.style.setProperty(name, value);
      };
      safeSetProperty("--sn-nexus-complexity", "0.1");
      safeSetProperty("--sn-nexus-coherence", "0.8");
    }
    updateIntegrationMetrics() {
    }
    calculateIntegrationComplexity() {
      let complexity = 0;
      complexity += this.nexusState.complexity * 10;
      if (this.biometricState.isMeditating) complexity += 5;
      return complexity;
    }
    performCleanup() {
      if (this.nexusState.userInfluence > 0) {
        this.nexusState.userInfluence = Math.max(
          0,
          this.nexusState.userInfluence - 0.01
        );
      }
    }
    calculateOptimizedNavigationScale(visualIntensity = 0.5, moodIdentifier = "neutral") {
      let scale = 1;
      if (visualIntensity > 0.7) scale = 1.02;
      if (moodIdentifier === "energetic") scale *= 1.01;
      return scale;
    }
    getNavigationScalingReport() {
      return {
        target: this.nexusState.targetNavigationScale,
        current: this.nexusState.currentNavigationScale,
        intensity: this.nexusState.lastVisualIntensity,
        mood: this.nexusState.lastMoodIdentifier
      };
    }
    getMeditationReport() {
      return {
        isMeditating: this.biometricState.isMeditating,
        timeSinceInteraction: (Date.now() - this.biometricState.lastUserInteractionTime) / 1e3,
        desaturation: this.biometricState.desaturation,
        slowdown: this.biometricState.slowdown
      };
    }
  };

  // src-js/systems/visual/LightweightParticleSystem.ts
  init_Year3000Utilities();
  var LightweightParticleSystem = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.canvas = null;
      this.ctx = null;
      this.particlePool = [];
      this.lastSpawnTime = 0;
      this.spawnCooldown = 80;
      this.year3000System = year3000System2;
      this.maxParticles = this.currentPerformanceProfile?.maxParticles || 75;
    }
    async initialize() {
      await super.initialize();
      this.createCanvas();
      this.initializeParticlePool();
      this._updateParticleSettingsFromProfile();
      this.startRenderLoop();
    }
    _updateParticleSettingsFromProfile() {
      this.maxParticles = this.currentPerformanceProfile?.maxParticles || 75;
    }
    createCanvas() {
      this.canvas = this._createCanvasElement("sn-particle-canvas", 3, "screen");
      this.ctx = this.canvas.getContext("2d");
    }
    initializeParticlePool() {
      this.particlePool = [];
      for (let i = 0; i < this.maxParticles * 2; i++) {
        this.particlePool.push({ active: false });
      }
    }
    startRenderLoop() {
      if (this.config.enableDebug) {
        console.log(
          `[${this.systemName}] Render loop setup complete - using unified onAnimate hook`
        );
      }
    }
    spawnParticle(energy, intensity, speedFactor, mood) {
      const particle = this.particlePool.find((p) => !p.active);
      if (!particle || !this.canvas) return;
      const rootStyle = window.getComputedStyle(getRootStyle());
      const primaryRgbStr = rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() || "202,158,230";
      const accentRgbStr = rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() || "140,170,238";
      particle.active = true;
      particle.currentX = Math.random() * this.canvas.width;
      particle.currentY = this.canvas.height + Math.random() * 30 + 20;
      particle.vx = (Math.random() - 0.5) * 3 * (speedFactor || 1);
      particle.vy = -(1.5 + Math.random() * 2.5 + energy * 3) * (speedFactor || 1);
      particle.maxLife = 2500 + Math.random() * 3500 * intensity;
      particle.life = particle.maxLife;
      particle.baseSize = 1.5 + Math.random() * 2.5 + intensity * 2.5;
      particle.currentSize = 0;
      particle.targetSize = particle.baseSize;
      particle.baseOpacity = 0.4 + Math.random() * 0.5;
      particle.currentOpacity = 0;
      particle.targetOpacity = particle.baseOpacity;
      const baseColor = mood && mood.includes("happy") || Math.random() > 0.6 ? primaryRgbStr : accentRgbStr;
      particle.color = `rgba(${baseColor},1)`;
      particle.currentRotation = Math.random() * Math.PI * 2;
      particle.vr = (Math.random() - 0.5) * 0.08 * (speedFactor || 1);
    }
    // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
    onAnimate(deltaMs) {
      this.updateAnimation(performance.now(), deltaMs);
    }
    updateAnimation(timestamp, deltaTime) {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (const p of this.particlePool) {
        const particle = p;
        if (!particle.active) continue;
        particle.life -= deltaTime;
        if (particle.life <= 0) {
          particle.active = false;
          continue;
        }
        particle.currentX += particle.vx * (deltaTime / 16);
        particle.currentY += particle.vy * (deltaTime / 16);
        particle.currentRotation += particle.vr * (deltaTime / 16);
        const lifeRatio = particle.life / particle.maxLife;
        const fadeInDuration = 0.2;
        const fadeOutDuration = 0.5;
        let opacityFactor = 1;
        if (lifeRatio > 1 - fadeInDuration) {
          opacityFactor = (1 - lifeRatio) / fadeInDuration;
        } else if (lifeRatio < fadeOutDuration) {
          opacityFactor = lifeRatio / fadeOutDuration;
        }
        particle.currentOpacity = particle.targetOpacity * opacityFactor;
        particle.currentSize = particle.targetSize * opacityFactor;
        this.ctx.save();
        this.ctx.translate(particle.currentX, particle.currentY);
        this.ctx.rotate(particle.currentRotation);
        this.ctx.fillStyle = particle.color.replace(
          "1)",
          `${particle.currentOpacity})`
        );
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.currentSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }
    // --------------------------------------------------------------------
    // Central settings responder – adjust particle counts or reset pools
    // --------------------------------------------------------------------
    applyUpdatedSettings(key, value) {
      if (key === "sn-star-density") {
        const mapping = {
          disabled: 0,
          minimal: 40,
          balanced: 75,
          intense: 120
        };
        const desired = mapping[value] ?? this.maxParticles;
        if (desired !== this.maxParticles) {
          this.maxParticles = desired;
          this.initializeParticlePool();
        }
      }
    }
  };

  // src-js/systems/visual/ParticleFieldSystem.ts
  var ParticleFieldSystem = class {
    constructor(config, utils, performanceAnalyzer, musicSyncService, settingsManager, rootSystem) {
      this.config = config;
      this.utils = utils;
      this.performanceAnalyzer = performanceAnalyzer;
      this.musicSyncService = musicSyncService;
      this.settingsManager = settingsManager;
      this.rootSystem = rootSystem;
      this.initialized = false;
      this._canvas = null;
      this._ctx = null;
      this._particles = [];
      this._animationFrame = null;
      this._pulseStrength = 0;
    }
    // ───────────────────────────── IManagedSystem ──────────────────────────────
    async initialize() {
      if (this.config.artisticMode !== "cosmic-maximum") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && this.settingsManager.get("sn-3d-effects-level") === "disabled") {
        return;
      }
      this._setupCanvas();
      this._createParticles(300);
      this._startLoop();
      this.musicSyncService.subscribe(this, "ParticleFieldSystem");
      this.initialized = true;
    }
    updateAnimation(_delta) {
    }
    async healthCheck() {
      return { ok: this.initialized, details: "Particle field running" };
    }
    destroy() {
      if (this._animationFrame) cancelAnimationFrame(this._animationFrame);
      this.musicSyncService.unsubscribe("ParticleFieldSystem");
      if (this._canvas && this._canvas.parentElement) {
        this._canvas.parentElement.removeChild(this._canvas);
      }
      this._particles = [];
      this.initialized = false;
    }
    // ───────────────────────── MusicSyncSubscriber API ─────────────────────────
    updateFromMusicAnalysis(processedData) {
      if (processedData?.beatOccurred) {
        this._pulseStrength = Math.min(1, processedData.energy || 0.5) * 3;
      }
    }
    // ───────────────────────────────── helpers ─────────────────────────────────
    _setupCanvas() {
      const canvas = document.createElement("canvas");
      canvas.id = "sn-particle-field";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "-1";
      document.body.appendChild(canvas);
      this._canvas = canvas;
      this._ctx = canvas.getContext("2d");
      this._resize();
      window.addEventListener("resize", this._resize.bind(this));
    }
    _resize() {
      if (!this._canvas) return;
      const dpr = window.devicePixelRatio || 1;
      this._canvas.width = window.innerWidth * dpr;
      this._canvas.height = window.innerHeight * dpr;
      this._ctx?.scale(dpr, dpr);
    }
    _createParticles(count) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < count; i++) {
        this._particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseSize: Math.random() * 1.5 + 0.5,
          pulse: 0,
          speedX: (Math.random() - 0.5) * 0.1,
          speedY: (Math.random() - 0.5) * 0.1
        });
      }
    }
    _startLoop() {
      const tick = () => {
        this._step();
        this._animationFrame = requestAnimationFrame(tick);
      };
      this._animationFrame = requestAnimationFrame(tick);
    }
    _step() {
      const ctx = this._ctx;
      if (!ctx || !this._canvas) return;
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this._pulseStrength *= 0.93;
      for (const p of this._particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x += window.innerWidth;
        if (p.x > window.innerWidth) p.x -= window.innerWidth;
        if (p.y < 0) p.y += window.innerHeight;
        if (p.y > window.innerHeight) p.y -= window.innerHeight;
        const size = p.baseSize + p.pulse;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, "rgba(255,255,255,0.8)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        p.pulse *= 0.9;
        if (this._pulseStrength > 0.1) {
          p.pulse += this._pulseStrength * 0.1 * Math.random();
        }
      }
    }
  };

  // src-js/systems/visual/PredictiveMaterializationSystem.ts
  init_globalConfig();
  init_SettingsManager();
  var PredictiveMaterializationSystem = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(
        config,
        utils,
        performanceMonitor ?? new PerformanceAnalyzer(),
        musicSyncService ?? new MusicSyncService({
          YEAR3000_CONFIG: config,
          Year3000Utilities: utils,
          colorHarmonyEngine: null,
          settingsManager
        }),
        settingsManager ?? new SettingsManager(config, HARMONIC_MODES, utils)
      );
      // Time tracking for resonance triggers
      this._resonanceCooldownMs = 1200;
      this._timeSinceLastResonance = 0;
      this.materializationIntensity = 1;
      this.materializationSpeed = 1;
      this.systemName = "PredictiveMaterializationSystem";
      this.materializationState = {
        imminence: 0,
        clarity: 0,
        targetElement: null
      };
      this.rootElement = this.utils.getRootStyle();
      if (this.config?.enableDebug) {
        console.log(`[${this.systemName} Constructor] Initialized.`);
      }
    }
    // TODO[Y3K-PH3]: Allow external callers (e.g., Navigation system) to set the element that receives resonance
    setTargetElement(el) {
      this.materializationState.targetElement = el;
    }
    // Frame-level animation hook used by MasterAnimationCoordinator
    onAnimate(deltaMs) {
      if (!this.materializationState.targetElement) return;
      this._timeSinceLastResonance += deltaMs;
      const imminence = this.materializationState.imminence;
      const clarity = this.materializationState.clarity;
      const threshold = 0.6;
      if (imminence * 0.7 + clarity * 0.3 > threshold && this._timeSinceLastResonance >= this._resonanceCooldownMs) {
        this._maybeTriggerResonance();
        this._timeSinceLastResonance = 0;
      }
    }
    _maybeTriggerResonance() {
      const target = this.materializationState.targetElement;
      if (!target) return;
      if (target.classList.contains("sn-materialize-resonance")) return;
      target.classList.add(
        "sn-materialize-resonance",
        "sn-predict-materialize-glow"
      );
      const handleEnd = () => {
        target.classList.remove("sn-materialize-resonance");
        target.removeEventListener("animationend", handleEnd);
      };
      target.addEventListener("animationend", handleEnd, { once: true });
      if (this.materializationState.imminence >= 0.7 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const tintHue = (this.materializationState.clarity ?? 0.5) * 360;
        echoPool.spawn(target, {
          tintHue,
          radius: 160,
          // Mega ripple radius (2× base ~80)
          intensity: 0.4
        });
      }
      if (this.config?.enableDebug) {
        console.debug(
          `[${this.systemName}] Materialize resonance triggered on`,
          target,
          `imminence=${this.materializationState.imminence.toFixed(
            2
          )}, clarity=${this.materializationState.clarity.toFixed(2)}`
        );
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
      const applyCss = (prop, val) => {
        try {
          if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
            this.year3000System.queueCSSVariableUpdate(
              prop,
              val,
              this.rootElement
            );
          } else {
            this.rootElement.style.setProperty(prop, val);
          }
        } catch (e) {
          if (this.config?.enableDebug) {
            console.warn(
              `[${this.systemName}] Error setting CSS variable ${prop}:`,
              e.message
            );
          }
        }
      };
      applyCss("--sn-materialize-imminence", "0");
      applyCss("--sn-materialize-clarity", "0");
    }
    updateFromMusicAnalysis(processedMusicData) {
      if (!this.initialized || !processedMusicData) return;
      super.updateFromMusicAnalysis(processedMusicData);
      const { segmentTransitionConfidence, visualIntensity, energy, valence } = processedMusicData;
      let targetImminence = (segmentTransitionConfidence || 0) * 0.6 + energy * 0.3 + visualIntensity * 0.1;
      let targetClarity = valence * 0.5 + visualIntensity * 0.3 + energy * 0.2;
      this.materializationState.imminence = this.utils.lerpSmooth(
        this.materializationState.imminence,
        targetImminence,
        0.1,
        0.2
      );
      this.materializationState.clarity = this.utils.lerpSmooth(
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
      const applyCss = (prop, val) => {
        try {
          if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
            this.year3000System.queueCSSVariableUpdate(
              prop,
              val,
              this.rootElement
            );
          } else {
            this.rootElement.style.setProperty(prop, val);
          }
        } catch (e) {
          if (this.config?.enableDebug) {
            console.warn(
              `[${this.systemName}] Error setting CSS variable ${prop} during update:`,
              e.message
            );
          }
        }
      };
      applyCss(
        "--sn-materialize-imminence",
        `${this.materializationState.imminence.toFixed(3)}`
      );
      applyCss(
        "--sn-materialize-clarity",
        `${this.materializationState.clarity.toFixed(3)}`
      );
    }
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
        ...this.modeConfig,
        systemEnabled: enabled !== false,
        materializationAnimationsEnabled: !!animations,
        intensityMultiplier: intensity || 1
      };
      this.updateMaterializationForMode();
    }
    updateMaterializationForMode() {
      if (!this.modeConfig) return;
      const baseIntensity = this.modeConfig.intensityMultiplier || 1;
      this.materializationIntensity = baseIntensity;
      this.materializationSpeed = this.modeConfig.materializationAnimationsEnabled ? baseIntensity * 1.3 : baseIntensity * 0.8;
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
    // TODO[Y3K-PH2]: Public helper to trigger anticipatory shimmer on a target element.
    // This seeds two-way integration with BehavioralPredictionEngine while keeping
    // backward-compatibility (calling code can still add the CSS class directly).
    triggerAnticipatoryWarmth(target, {
      hue = 0,
      intensity = 0.18,
      durationMs = 1200
    } = {}) {
      if (!target) return;
      const clamped = Math.max(0, Math.min(0.3, intensity));
      target.style.setProperty("--sn-anticipatory-intensity", clamped.toFixed(3));
      target.style.setProperty("--sn-anticipatory-hue", `${hue.toFixed(1)}deg`);
      target.classList.add("sn-anticipatory-warmth");
      const handleEnd = () => {
        target.classList.remove("sn-anticipatory-warmth");
        target.removeEventListener("animationend", handleEnd);
      };
      target.addEventListener("animationend", handleEnd);
      if (this.config?.enableDebug) {
        console.debug(
          `[${this.systemName}] Anticipatory shimmer fired (hue=${hue}, intensity=${clamped}) on`,
          target
        );
      }
    }
  };

  // src-js/systems/visual/SidebarConsciousnessSystem.ts
  init_globalConfig();
  var SidebarConsciousnessSystem = class extends BaseVisualSystem {
    constructor(config, utils, performanceMonitor, musicSyncService, settingsManager, year3000System2 = null) {
      super(config, utils, performanceMonitor, musicSyncService, settingsManager);
      this.rootNavBar = null;
      this.overlayContainer = null;
      this.resizeObserver = null;
      this.consciousnessVisualizer = null;
      this.harmonicModeIndicator = null;
      this.consciousnessAnimationFrame = null;
      this.year3000System = year3000System2;
      this.masterAnimationRegistered = false;
      this.isUsingMasterAnimation = false;
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
        elementUpdates: 0
      };
      this.deviceCapabilities = {
        supportsCSSFilter: this._detectCSSFilterSupport(),
        supportsTransforms: this._detectTransformSupport(),
        performanceLevel: this._detectPerformanceLevel(),
        reducedMotion: this._detectReducedMotion()
      };
      this.animationState = {
        lastPulse: 0,
        pulseDirection: 1,
        baseOpacity: 0.7,
        currentScale: 1,
        targetScale: 1,
        smoothingFactor: 0.15
      };
    }
    // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
    onAnimate(deltaMs) {
    }
    _detectCSSFilterSupport() {
      const el = document.createElement("div");
      el.style.filter = "blur(1px)";
      return !!el.style.filter;
    }
    _detectTransformSupport() {
      const el = document.createElement("div");
      el.style.transform = "scale(1.1)";
      return !!el.style.transform;
    }
    _detectPerformanceLevel() {
      const memory = navigator.deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
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
        this.initialized = false;
        return;
      }
      this._createOverlayContainer();
      this._createConsciousnessVisualizer();
      this.createHarmonicModeDisplay();
      this.updateColors();
      this._tryRegisterWithMasterAnimation();
      this._setupResizeObserver();
    }
    _createOverlayContainer() {
      this.overlayContainer = document.createElement("div");
      this.overlayContainer.id = "sidebar-consciousness-overlay";
      this.overlayContainer.style.position = "absolute";
      this.overlayContainer.style.pointerEvents = "none";
      this.overlayContainer.style.zIndex = "1000";
      document.body.appendChild(this.overlayContainer);
    }
    _setupResizeObserver() {
      if (!this.rootNavBar || !this.overlayContainer) return;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { left, top, width, height } = entry.contentRect;
          if (this.overlayContainer) {
            this.overlayContainer.style.left = `${left}px`;
            this.overlayContainer.style.top = `${top}px`;
            this.overlayContainer.style.width = `${width}px`;
            this.overlayContainer.style.height = `${height}px`;
          }
        }
      });
      this.resizeObserver.observe(this.rootNavBar);
    }
    _tryRegisterWithMasterAnimation() {
      if (this.year3000System && this.year3000System.registerAnimationSystem) {
        try {
          this.year3000System.registerAnimationSystem(
            "SidebarConsciousnessSystem",
            this,
            "background",
            this.deviceCapabilities.performanceLevel === "high" ? 30 : 15
          );
          this.masterAnimationRegistered = true;
          this.isUsingMasterAnimation = true;
        } catch (error) {
          this._startFallbackConsciousnessLoop();
        }
      } else {
        this._startFallbackConsciousnessLoop();
      }
    }
    _startFallbackConsciousnessLoop() {
      this.isUsingMasterAnimation = false;
      this.startConsciousnessLoop();
    }
    updateAnimation(timestamp, deltaTime) {
      if (this.deviceCapabilities.reducedMotion || !this.consciousnessVisualizer || !this.rootNavBar)
        return;
      const time = timestamp * 1e-3;
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;
      this.animationState.targetScale = pulse;
      this.animationState.currentScale += (this.animationState.targetScale - this.animationState.currentScale) * this.animationState.smoothingFactor;
      this.consciousnessVisualizer.style.transform = `translateX(-50%) scale(${this.animationState.currentScale.toFixed(
        3
      )})`;
      if (this.harmonicModeIndicator) {
        const opacity = (Math.sin(time * 1.5) * 0.1 + 0.85).toFixed(2);
        this.harmonicModeIndicator.style.opacity = opacity;
      }
    }
    onPerformanceModeChange(mode) {
      if (mode === "low") {
        this.animationState.smoothingFactor = 0.3;
      } else {
        this.animationState.smoothingFactor = 0.15;
      }
    }
    handleSettingsChange(event) {
      super.handleSettingsChange(event);
      if (event.detail.key === "sn-harmonic-mode") {
        this.updateHarmonicModeDisplay(event.detail.value);
      }
    }
    _createConsciousnessVisualizer() {
      if (!this.overlayContainer) return;
      this.consciousnessVisualizer = document.createElement("div");
      this.consciousnessVisualizer.className = "sidebar-consciousness-visualizer";
      this.overlayContainer.appendChild(this.consciousnessVisualizer);
    }
    createHarmonicModeDisplay() {
      if (!this.overlayContainer) return;
      this.harmonicModeIndicator = document.createElement("div");
      this.harmonicModeIndicator.className = "harmonic-mode-indicator";
      this.overlayContainer.appendChild(this.harmonicModeIndicator);
    }
    updateColors() {
      if (!this.consciousnessVisualizer || !this.harmonicModeIndicator || !this.rootNavBar)
        return;
      const computedStyle = getComputedStyle(this.rootNavBar);
      const bgColor = computedStyle.getPropertyValue("--spice-sidebar");
      const textColor = computedStyle.getPropertyValue("--spice-text");
      this.consciousnessVisualizer.style.backgroundColor = bgColor;
      this.consciousnessVisualizer.style.borderColor = textColor;
      this.consciousnessVisualizer.style.borderWidth = "1px";
      this.consciousnessVisualizer.style.borderStyle = "solid";
      if (this.harmonicModeIndicator) {
        this.harmonicModeIndicator.style.backgroundColor = `rgba(${this.utils.hexToRgb(textColor)?.r}, ${this.utils.hexToRgb(textColor)?.g}, ${this.utils.hexToRgb(textColor)?.b}, 0.1)`;
        this.harmonicModeIndicator.style.color = textColor;
      }
    }
    startConsciousnessLoop() {
      if (this.consciousnessAnimationFrame)
        cancelAnimationFrame(this.consciousnessAnimationFrame);
      const animate = (timestamp) => {
        this.updateAnimation(timestamp, 16.67);
        this.consciousnessAnimationFrame = requestAnimationFrame(animate);
      };
      this.consciousnessAnimationFrame = requestAnimationFrame(animate);
    }
    updateHarmonicModeDisplay(newModeKey) {
      this.currentHarmonicModeKey = newModeKey;
      if (this.rootNavBar) {
        const classList = this.rootNavBar.classList;
        classList.forEach((className) => {
          if (className.startsWith("sn-harmonic-")) {
            classList.remove(className);
          }
        });
        const mode = HARMONIC_MODES[newModeKey];
        if (mode) {
          this.rootNavBar.classList.add(`sn-harmonic-${newModeKey}`);
        }
      }
    }
    _updateSidebarVariables(processedMusicData = {}) {
      if (!this.rootNavBar) return;
      const {
        visualIntensity = 0.5,
        moodIdentifier = "neutral",
        energyLevel = "low"
      } = processedMusicData;
      this.rootNavBar.classList.remove(
        "sn-music-low-energy",
        "sn-music-mid-energy",
        "sn-music-high-energy"
      );
      this.rootNavBar.classList.add(`sn-music-${energyLevel}-energy`);
      this.rootNavBar.setAttribute("data-mood", moodIdentifier);
      const glow = Math.max(0, Math.min(1, visualIntensity));
      const textOpacity = Math.min(0.5, glow * 0.6);
      const applyCss = (prop, val) => {
        if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(
            prop,
            val,
            this.rootNavBar
          );
        } else {
          this.rootNavBar.style.setProperty(prop, val);
        }
      };
      applyCss("--sn-nav-item-glow-intensity", `${glow}`);
      applyCss("--sn-nav-text-energy-opacity", `${textOpacity}`);
      applyCss("--sidebar-intensity", `${visualIntensity}`);
      if (!this.deviceCapabilities.reducedMotion) {
        const focused = this.rootNavBar.querySelector(
          '.main-navBar-navLink[aria-current="page"], .main-navBar-navLink:focus'
        );
        if (focused) {
          const hueVar = getComputedStyle(focused).getPropertyValue(
            "--sidebar-focus-hue"
          );
          const tintHue = parseFloat(hueVar) || glow * 360;
          echoPool.spawnBehind(focused, {
            tintHue,
            radius: 80,
            intensity: glow * 0.6
          });
        }
      }
    }
    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.initialized) return;
      super.updateFromMusicAnalysis(processedMusicData);
      this._updateSidebarVariables(processedMusicData);
    }
    updateModeConfiguration(modeConfig) {
      super.updateModeConfiguration(modeConfig);
      this.currentHarmonicModeKey = modeConfig.activeMode || "artist-vision";
      this.updateConsciousnessForMode();
      this.updateHarmonicModeDisplay(this.currentHarmonicModeKey);
    }
    updateConsciousnessForMode() {
      if (this.consciousnessVisualizer) {
        const intensity = this.modeConfig?.intensityMultiplier || 1;
        this.consciousnessVisualizer.style.opacity = `${0.1 * intensity}`;
      }
    }
    destroy() {
      if (this.consciousnessAnimationFrame) {
        cancelAnimationFrame(this.consciousnessAnimationFrame);
      }
      if (this.year3000System && this.year3000System.unregisterAnimationSystem) {
        this.year3000System.unregisterAnimationSystem(
          "SidebarConsciousnessSystem"
        );
      }
      if (this.resizeObserver && this.rootNavBar) {
        this.resizeObserver.unobserve(this.rootNavBar);
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.overlayContainer && this.overlayContainer.parentNode) {
        this.overlayContainer.parentNode.removeChild(this.overlayContainer);
        this.overlayContainer = null;
      }
      if (this.rootNavBar) {
        const classList = this.rootNavBar.classList;
        classList.forEach((className) => {
          if (className.startsWith("sn-")) {
            classList.remove(className);
          }
        });
      }
      super.destroy();
    }
  };

  // src-js/systems/visual/WebGPUBackgroundSystem.ts
  var WebGPUBackgroundSystem = class {
    constructor(config, utils, performanceAnalyzer, musicSyncService, settingsManager, rootSystem) {
      this.config = config;
      this.utils = utils;
      this.performanceAnalyzer = performanceAnalyzer;
      this.musicSyncService = musicSyncService;
      this.settingsManager = settingsManager;
      this.rootSystem = rootSystem;
      this.initialized = false;
      this._canvas = null;
      this._device = null;
      this._ctx = null;
      this._animationFrame = null;
      this._uniformBuffer = null;
      this._bindGroup = null;
      this._frame = 0;
      this._pipeline = null;
      // Helper caches
      this._primary = [0.5, 0.4, 0.9];
      this._secondary = [0.35, 0.35, 0.75];
      this._accent = [0.3, 0.55, 0.9];
      this._energy = 0.5;
      this._valence = 0.5;
    }
    // ---------------------------------------------------------------------------
    // IManagedSystem lifecycle
    // ---------------------------------------------------------------------------
    async initialize() {
      if (!this._shouldActivate()) {
        return;
      }
      try {
        await this._initWebGPU();
        this._startRenderLoop();
        this.initialized = true;
      } catch (err) {
        console.warn("[WebGPUBackgroundSystem] Initialization failed", err);
        this.initialized = false;
        this.destroy();
      }
    }
    updateAnimation(_deltaMs) {
    }
    async healthCheck() {
      return {
        ok: this.initialized,
        details: this.initialized ? "WebGPU canvas active" : "WebGPU background inactive or failed to initialise"
      };
    }
    destroy() {
      if (this._animationFrame !== null) {
        cancelAnimationFrame(this._animationFrame);
        this._animationFrame = null;
      }
      if (this._canvas && this._canvas.parentElement) {
        this._canvas.parentElement.removeChild(this._canvas);
      }
      this._device = null;
      this._ctx = null;
      this._canvas = null;
      this.initialized = false;
      if (this.config.enableDebug) {
        console.log("[WebGPUBackgroundSystem] Destroyed");
      }
    }
    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------
    _shouldActivate() {
      const webgpuSetting = this.settingsManager.get("sn-enable-webgpu");
      return webgpuSetting === "true" && typeof navigator !== "undefined" && navigator.gpu;
    }
    async _initWebGPU() {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error("GPU adapter unavailable");
      const device = await adapter.requestDevice();
      this._device = device;
      const canvas = document.createElement("canvas");
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "-1";
      canvas.id = "sn-webgpu-nebula";
      document.body.appendChild(canvas);
      this._canvas = canvas;
      const ctx = canvas.getContext("webgpu");
      if (!ctx) throw new Error("Failed to get WebGPU context");
      this._ctx = ctx;
      const format = navigator.gpu.getPreferredCanvasFormat();
      ctx.configure({
        device,
        format,
        alphaMode: "premultiplied"
      });
      const shaderModule = device.createShaderModule({
        code: `@fragment fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
        // Simple time-based RGB noise placeholder
        let r = fract(sin(dot(pos.xy, vec2<f32>(12.9898,78.233))) * 43758.5453);
        let g = fract(sin(dot(pos.xy, vec2<f32>(93.9898,67.345))) * 24634.6345);
        let b = fract(sin(dot(pos.xy, vec2<f32>(45.1131,98.245))) * 31415.9265);
        return vec4<f32>(r, g, b, 0.14);
      }
      @vertex fn vs_main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4<f32> {
        var pos = array<vec2<f32>, 3>(vec2<f32>(-1.0, -1.0), vec2<f32>(3.0, -1.0), vec2<f32>(-1.0, 3.0));
        return vec4<f32>(pos[idx], 0.0, 1.0);
      }`
      });
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shaderModule, entryPoint: "vs_main" },
        fragment: {
          module: shaderModule,
          entryPoint: "fs_main",
          targets: [{ format }]
        },
        primitive: { topology: "triangle-list" }
      });
      const uniformBuffer = device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      const bindGroupLayout = pipeline.getBindGroupLayout(0);
      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
      });
      this._pipeline = pipeline;
      this._uniformBuffer = uniformBuffer;
      this._bindGroup = bindGroup;
    }
    _startRenderLoop() {
      const render = (time) => {
        if (!this._device || !this._ctx || !this._pipeline) return;
        if (this._frame % 30 === 0) {
          this._refreshThemeColors();
        }
        this._frame++;
        const uni = new Float32Array(16);
        uni.set([this._primary[0], this._primary[1], this._primary[2], 1]);
        uni.set(
          [this._secondary[0], this._secondary[1], this._secondary[2], 1],
          4
        );
        uni.set([this._accent[0], this._accent[1], this._accent[2], 1], 8);
        uni.set([time * 1e-3, this._energy, this._valence, 0], 12);
        this._device.queue.writeBuffer(
          this._uniformBuffer,
          0,
          uni.buffer
        );
        const encoder = this._device.createCommandEncoder();
        const textureView = this._ctx.getCurrentTexture().createView();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: textureView,
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: "clear",
              storeOp: "store"
            }
          ]
        });
        pass.setPipeline(this._pipeline);
        pass.setBindGroup(0, this._bindGroup);
        pass.draw(3);
        pass.end();
        this._device.queue.submit([encoder.finish()]);
        this._animationFrame = requestAnimationFrame(render);
      };
      this._animationFrame = requestAnimationFrame(render);
    }
    _refreshThemeColors() {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const parseRgb = (v) => {
        const parts = v.trim().split(/\s*,\s*/).map(Number);
        if (parts.length === 3 && parts.every((n) => !isNaN(n))) {
          return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
        }
        return null;
      };
      const p = parseRgb(styles.getPropertyValue("--sn-gradient-primary-rgb"));
      const s = parseRgb(styles.getPropertyValue("--sn-gradient-secondary-rgb"));
      const a = parseRgb(styles.getPropertyValue("--sn-gradient-accent-rgb"));
      if (p) this._primary = p;
      if (s) this._secondary = s;
      if (a) this._accent = a;
      const energyVar = parseFloat(
        styles.getPropertyValue("--sn-harmony-energy") || "0.5"
      );
      const valenceVar = parseFloat(
        styles.getPropertyValue("--sn-harmony-valence") || "0.5"
      );
      if (!isNaN(energyVar)) this._energy = energyVar;
      if (!isNaN(valenceVar)) this._valence = valenceVar;
    }
  };

  // src-js/core/year3000System.ts
  init_Year3000Utilities();
  var Year3000System = class {
    constructor(config = YEAR3000_CONFIG, harmonicModes = HARMONIC_MODES) {
      // API availability tracking
      this.availableAPIs = null;
      this._songChangeHandler = null;
      // Stats
      this._lastInitializationTime = null;
      this._initializationRetryHistory = [];
      this._systemStartTime = null;
      /**
       * Indicates whether automatic harmonic evolution is permitted. This mirrors the
       * `sn-harmonic-evolution` setting and `YEAR3000_CONFIG.harmonicEvolution`.
       * Sub-systems can read this flag instead of accessing the config directly so
       * that future scheduling logic (e.g. TimerConsolidationSystem) can rely on a
       * guaranteed field.
       */
      this.allowHarmonicEvolution = true;
      this.YEAR3000_CONFIG = this._deepCloneConfig(config);
      if (typeof this.YEAR3000_CONFIG.init === "function") {
        this.YEAR3000_CONFIG.init();
      }
      this.HARMONIC_MODES = harmonicModes;
      this.utils = Year3000Utilities_exports;
      this.initialized = false;
      this._systemStartTime = Date.now();
      this.masterAnimationCoordinator = null;
      this.timerConsolidationSystem = null;
      this.cssVariableBatcher = null;
      this.deviceCapabilityDetector = null;
      this.performanceAnalyzer = null;
      this.systemHealthMonitor = null;
      this.settingsManager = null;
      this.colorHarmonyEngine = null;
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
      this.webGPUBackgroundSystem = null;
      this.particleFieldSystem = null;
      this.emergentChoreographyEngine = null;
      this.initializationResults = null;
      if (this.YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "\u{1F31F} [Year3000System] Constructor: Instance created with Master Animation Coordinator"
        );
      }
      this._boundExternalSettingsHandler = this._handleExternalSettingsChange.bind(this);
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this._boundExternalSettingsHandler
      );
      this._boundArtisticModeHandler = this._onArtisticModeChanged.bind(this);
      document.addEventListener(
        "year3000ArtisticModeChanged",
        this._boundArtisticModeHandler
      );
      this.allowHarmonicEvolution = this.YEAR3000_CONFIG.harmonicEvolution ?? true;
      setTimeout(() => {
        this._applyPerformanceProfile();
      }, 0);
    }
    _deepCloneConfig(config) {
      return config;
    }
    updateConfiguration(key, value) {
      if (!this.YEAR3000_CONFIG) {
        console.warn(
          "[Year3000System] Cannot update configuration - config not initialized"
        );
        return;
      }
      const keyPath = key.split(".").filter(Boolean);
      if (!keyPath.length) {
        return;
      }
      let current = this.YEAR3000_CONFIG;
      const finalKey = keyPath.pop();
      if (!finalKey) {
        return;
      }
      for (const pathKey of keyPath) {
        if (typeof current[pathKey] !== "object" || current[pathKey] === null) {
          current[pathKey] = {};
        }
        current = current[pathKey];
      }
      const oldValue = current[finalKey];
      current[finalKey] = value;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[Year3000System] Configuration updated: ${key} = ${value} (was: ${oldValue})`
        );
      }
      this._notifyConfigurationChange(key, value, oldValue);
    }
    _notifyConfigurationChange(key, newValue, oldValue) {
    }
    async initializeAllSystems() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F30C} [Year3000System] initializeAllSystems(): Starting full system initialization..."
        );
      }
      this._systemStartTime = Date.now();
      const startTime = performance.now();
      const initializationResults = {
        success: [],
        failed: [],
        skipped: []
      };
      this.systemHealthMonitor = new SystemHealthMonitor();
      const systemInitializers = [
        {
          name: "DeviceCapabilityDetector",
          init: () => {
            this.deviceCapabilityDetector = new DeviceCapabilityDetector();
            this.deviceCapabilityDetector.initialize();
          }
        },
        {
          name: "TimerConsolidationSystem",
          init: () => {
            this.timerConsolidationSystem = new TimerConsolidationSystem();
          }
        },
        {
          name: "CSSVariableBatcher",
          init: () => {
            this.cssVariableBatcher = new CSSVariableBatcher({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
          }
        },
        {
          name: "PerformanceAnalyzer",
          init: () => {
            this.performanceAnalyzer = new PerformanceAnalyzer({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
          }
        },
        {
          name: "SettingsManager",
          init: async () => {
            this.settingsManager = new SettingsManager();
            if (this.systemHealthMonitor) {
              this.systemHealthMonitor.registerSystem(
                "SettingsManager",
                this.settingsManager
              );
            }
          }
        },
        {
          name: "MasterAnimationCoordinator",
          init: () => {
            if (!this.performanceAnalyzer) {
              throw new Error(
                "PerformanceAnalyzer is required for MasterAnimationCoordinator."
              );
            }
            this.masterAnimationCoordinator = new MasterAnimationCoordinator({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
            this.masterAnimationCoordinator.startMasterAnimationLoop();
          }
        },
        {
          name: "MusicSyncService",
          init: async () => {
            this.musicSyncService = new MusicSyncService({
              YEAR3000_CONFIG: this.YEAR3000_CONFIG,
              Year3000Utilities: this.utils,
              settingsManager: this.settingsManager,
              year3000System: this
            });
            await this.musicSyncService.initialize();
            this.musicSyncService.subscribe(this, "Year3000System");
          }
        },
        {
          name: "ColorHarmonyEngine",
          init: async () => {
            if (!this.performanceAnalyzer || !this.settingsManager) {
              throw new Error(
                "PerformanceAnalyzer and SettingsManager are required for ColorHarmonyEngine."
              );
            }
            this.colorHarmonyEngine = new ColorHarmonyEngine(
              this.YEAR3000_CONFIG,
              this.utils,
              this.performanceAnalyzer,
              this.musicSyncService || void 0,
              this.settingsManager
            );
            await this.colorHarmonyEngine.initialize();
            if (this.musicSyncService) {
              this.musicSyncService.setColorHarmonyEngine(
                this.colorHarmonyEngine
              );
            }
            if (this.systemHealthMonitor) {
              this.systemHealthMonitor.registerSystem(
                "ColorHarmonyEngine",
                this.colorHarmonyEngine
              );
            }
          }
        },
        {
          name: "GlassmorphismManager",
          init: async () => {
            if (!this.performanceAnalyzer || !this.settingsManager) {
              throw new Error(
                "PerformanceAnalyzer and SettingsManager are required for GlassmorphismManager."
              );
            }
            this.glassmorphismManager = new GlassmorphismManager(
              this.YEAR3000_CONFIG,
              this.utils,
              this.cssVariableBatcher,
              this.performanceAnalyzer,
              this.settingsManager
            );
            await this.glassmorphismManager.initialize();
            if (this.systemHealthMonitor) {
              this.systemHealthMonitor.registerSystem(
                "GlassmorphismManager",
                this.glassmorphismManager
              );
            }
          }
        },
        {
          name: "Card3DManager",
          init: async () => {
            if (!this.performanceAnalyzer || !this.settingsManager) {
              throw new Error(
                "PerformanceAnalyzer and SettingsManager are required for Card3DManager."
              );
            }
            this.card3DManager = new Card3DManager(
              this.performanceAnalyzer,
              this.settingsManager,
              this.utils
            );
            await this.card3DManager.initialize();
            if (this.systemHealthMonitor && this.card3DManager) {
              this.systemHealthMonitor.registerSystem(
                "Card3DManager",
                this.card3DManager
              );
            }
          }
        }
      ];
      for (const { name, init: init2 } of systemInitializers) {
        try {
          await init2();
          initializationResults.success.push(name);
        } catch (error) {
          initializationResults.failed.push(name);
          console.error(`[Year3000System] Failed to initialize ${name}:`, error);
        }
      }
      await this._initializeVisualSystems(initializationResults);
      if (this.masterAnimationCoordinator) {
        await this._registerAnimationSystems();
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F3AC} [Year3000System] Animation system registration phase complete"
          );
        }
      } else {
        console.warn(
          "[Year3000System] MasterAnimationCoordinator not available for registration phase"
        );
      }
      this.initializationResults = initializationResults;
      this.initialized = true;
      const endTime = performance.now();
      this._lastInitializationTime = endTime - startTime;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[Year3000System] System initialization complete in ${this._lastInitializationTime.toFixed(
            2
          )}ms.`
        );
        console.log(
          `[Year3000System] Results: ${initializationResults.success.length} success, ${initializationResults.failed.length} failed.`
        );
        if (initializationResults.failed.length > 0) {
          console.warn(
            `[Year3000System] Failed systems: ${initializationResults.failed.join(
              ", "
            )}`
          );
        }
        if (initializationResults.skipped && initializationResults.skipped.length > 0) {
          console.info(
            `[Year3000System] Skipped systems: ${initializationResults.skipped.join(
              ", "
            )}`
          );
        }
        if (initializationResults.success.length > 0) {
          console.info(
            `[Year3000System] Successful systems: ${initializationResults.success.join(
              ", "
            )}`
          );
        }
        if (this.systemHealthMonitor) {
          this.systemHealthMonitor.logHealthReport();
        }
      }
    }
    async _initializeVisualSystems(results) {
      if (!this.performanceAnalyzer || !this.musicSyncService || !this.settingsManager) {
        console.error(
          "[Year3000System] Cannot initialize visual systems due to missing core dependencies (PerformanceAnalyzer, MusicSyncService, or SettingsManager)."
        );
        const visualSystems = [
          "LightweightParticleSystem",
          "DimensionalNexusSystem",
          "DataGlyphSystem",
          "BeatSyncVisualSystem",
          "BehavioralPredictionEngine",
          "PredictiveMaterializationSystem",
          "SidebarConsciousnessSystem",
          "WebGPUBackgroundSystem",
          "EmergentChoreographyEngine"
        ];
        visualSystems.forEach((s) => results.skipped.push(s));
        return;
      }
      const visualSystemConfigs = [
        {
          name: "LightweightParticleSystem",
          Class: LightweightParticleSystem,
          property: "lightweightParticleSystem"
        },
        {
          name: "DimensionalNexusSystem",
          Class: DimensionalNexusSystem,
          property: "dimensionalNexusSystem"
        },
        {
          name: "DataGlyphSystem",
          Class: DataGlyphSystem,
          property: "dataGlyphSystem"
        },
        {
          name: "BeatSyncVisualSystem",
          Class: BeatSyncVisualSystem,
          property: "beatSyncVisualSystem"
        },
        {
          name: "EmergentChoreographyEngine",
          Class: EmergentChoreographyEngine,
          property: "emergentChoreographyEngine"
        },
        {
          name: "BehavioralPredictionEngine",
          Class: BehavioralPredictionEngine,
          property: "behavioralPredictionEngine"
        },
        {
          name: "PredictiveMaterializationSystem",
          Class: PredictiveMaterializationSystem,
          property: "predictiveMaterializationSystem"
        },
        {
          name: "SidebarConsciousnessSystem",
          Class: SidebarConsciousnessSystem,
          property: "sidebarConsciousnessSystem"
        },
        {
          name: "WebGPUBackgroundSystem",
          Class: WebGPUBackgroundSystem,
          property: "webGPUBackgroundSystem"
        },
        {
          name: "ParticleFieldSystem",
          Class: ParticleFieldSystem,
          property: "particleFieldSystem"
        }
      ];
      for (const config of visualSystemConfigs) {
        const { name, Class, property } = config;
        try {
          const instance2 = new Class(
            this.YEAR3000_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService,
            this.settingsManager,
            this
          );
          await instance2.initialize();
          if (instance2.initialized) {
            this[property] = instance2;
            if (this.systemHealthMonitor) {
              this.systemHealthMonitor.registerSystem(name, instance2);
            }
            results.success.push(name);
          } else {
            results.skipped.push(name);
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.info(
                `[Year3000System] System ${name} opted out of activation (initialized=false). Marked as skipped.`
              );
            }
          }
        } catch (error) {
          results.failed.push(name);
          console.error(
            `[Year3000System] Failed to initialize visual system ${name}:`,
            error
          );
        }
      }
      if (this.colorHarmonyEngine && this.emergentChoreographyEngine) {
        this.colorHarmonyEngine.setEmergentEngine(
          this.emergentChoreographyEngine
        );
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F517} [Year3000System] EmergentChoreographyEngine linked to ColorHarmonyEngine."
          );
        }
      }
    }
    async destroyAllSystems() {
      if (this.masterAnimationCoordinator) {
        this.masterAnimationCoordinator.stopMasterAnimationLoop();
      }
      if (this.timerConsolidationSystem) {
        this.timerConsolidationSystem.destroy();
      }
      if (this.systemHealthMonitor) {
        this.systemHealthMonitor.destroy();
      }
      const allSystems = [
        this.lightweightParticleSystem,
        this.dimensionalNexusSystem,
        this.dataGlyphSystem,
        this.beatSyncVisualSystem,
        this.behavioralPredictionEngine,
        this.predictiveMaterializationSystem,
        this.glassmorphismManager,
        this.card3DManager,
        this.musicSyncService,
        this.colorHarmonyEngine,
        this.settingsManager,
        this.performanceAnalyzer,
        this.deviceCapabilityDetector,
        this.cssVariableBatcher,
        this.webGPUBackgroundSystem,
        this.particleFieldSystem,
        this.emergentChoreographyEngine
      ];
      for (const system of allSystems) {
        if (system && typeof system.destroy === "function") {
          try {
            await system.destroy();
          } catch (error) {
            console.error(`[Year3000System] Error destroying a system:`, error);
          }
        }
      }
      if (Spicetify.Player && this._songChangeHandler) {
        Spicetify.Player.removeEventListener(
          "songchange",
          this._songChangeHandler
        );
      }
      this.initialized = false;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("\u{1F525} [Year3000System] All systems have been destroyed.");
      }
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this._boundExternalSettingsHandler
      );
      document.removeEventListener(
        "year3000ArtisticModeChanged",
        this._boundArtisticModeHandler
      );
    }
    async applyInitialSettings() {
      if (!this.settingsManager) {
        console.warn(
          "[Year3000System] SettingsManager not ready, cannot apply initial settings."
        );
        return;
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A8} [Year3000System] Inside applyInitialSettings. SettingsManager valid:",
          !!this.settingsManager
        );
      }
      try {
        console.log(
          "\u{1F3A8} [Year3000System] applyInitialSettings: Getting initial settings..."
        );
        const accent = this.settingsManager.get("catppuccin-accentColor");
        const gradient = this.settingsManager.get("sn-gradient-intensity");
        const stars = this.settingsManager.get("sn-star-density");
        const intensityRaw = this.settingsManager.get("sn-harmonic-intensity");
        const evolutionRaw = this.settingsManager.get("sn-harmonic-evolution");
        const harmonicModeKey = this.settingsManager.get(
          "sn-current-harmonic-mode"
        );
        if (harmonicModeKey) {
          this.YEAR3000_CONFIG.currentHarmonicMode = String(harmonicModeKey);
        }
        console.log(
          `\u{1F3A8} [Year3000System] applyInitialSettings: Accent=${accent}, Gradient=${gradient}, Stars=${stars}`
        );
        if (accent !== "dynamic") {
          await this._applyCatppuccinAccent(accent);
        } else if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F3A8} [Year3000System] Skipping static accent application because 'dynamic' accent is selected."
          );
        }
        await this._applyStarryNightSettings(
          gradient,
          stars
        );
        const intensity = parseFloat(intensityRaw);
        if (!Number.isNaN(intensity)) {
          if (this.colorHarmonyEngine) {
            this.colorHarmonyEngine.setIntensity?.(intensity);
          }
          this.YEAR3000_CONFIG.harmonicIntensity = intensity;
        }
        const evolutionEnabled = evolutionRaw === "true";
        this.allowHarmonicEvolution = evolutionEnabled;
        this.YEAR3000_CONFIG.harmonicEvolution = evolutionEnabled;
        console.log(
          "\u{1F3A8} [Year3000System] applyInitialSettings: Successfully applied initial settings."
        );
      } catch (error) {
        console.error("[Year3000System] Error applying initial settings:", error);
      }
    }
    async _applyCatppuccinAccent(selectedAccent) {
      if (selectedAccent === "dynamic") {
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "\u{1F3A8} [Year3000System] _applyCatppuccinAccent: 'dynamic' accent selected \u2013 skipping static accent overrides."
          );
        }
        return;
      }
      console.log(
        `\u{1F3A8} [Year3000System] _applyCatppuccinAccent: Applying accent color '${selectedAccent}'`
      );
      const accent = selectedAccent === "none" ? "text" : selectedAccent;
      const colorScheme = Spicetify.Config.color_scheme || "mocha";
      const equalizerUrl = document.querySelector(
        "body > script.marketplaceScript"
      ) ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')` : `url('${colorScheme}/equalizer-animated-${accent}.gif')`;
      this.cssVariableBatcher?.queueCSSVariableUpdate(
        "--spice-text",
        `var(--spice-${accent})`
      );
      this.cssVariableBatcher?.queueCSSVariableUpdate(
        "--spice-button-active",
        `var(--spice-${accent})`
      );
      this.cssVariableBatcher?.queueCSSVariableUpdate(
        "--spice-equalizer",
        equalizerUrl
      );
      this.cssVariableBatcher?.flushCSSVariableBatch();
      console.log(
        `\u{1F3A8} [Year3000System] _applyCatppuccinAccent: Flushed CSS variables for accent color.`
      );
    }
    async _applyStarryNightSettings(gradientIntensity, starDensity) {
      try {
        applyStarryNightSettings(gradientIntensity, starDensity);
      } catch (error) {
        console.error("[Year3000System] Failed to apply starry night settings");
      }
    }
    applyColorsToTheme(extractedColors = {}) {
      let harmonizedColors = extractedColors;
      if (this.colorHarmonyEngine) {
        try {
          harmonizedColors = this.colorHarmonyEngine.blendWithCatppuccin(extractedColors);
        } catch (error) {
          console.error(
            "[Year3000System] ColorHarmonyEngine blend failed:",
            error
          );
        }
      }
      this._applyHarmonizedColorsToCss(harmonizedColors);
    }
    // =============================================
    // 🎨 INTERNAL – APPLY COLOR MAP TO CSS VARIABLES
    // =============================================
    _applyHarmonizedColorsToCss(colors = {}) {
      if (!colors || Object.keys(colors).length === 0) return;
      const primaryHex = colors.VIBRANT || colors.PROMINENT || colors.PRIMARY || Object.values(colors)[0];
      const secondaryHex = colors.DARK_VIBRANT || colors.DESATURATED || colors.SECONDARY || primaryHex;
      const accentHex = colors.VIBRANT_NON_ALARMING || colors.LIGHT_VIBRANT || primaryHex;
      const queueUpdate = (prop, value) => {
        if (this.cssVariableBatcher) {
          this.cssVariableBatcher.queueCSSVariableUpdate(prop, value);
        } else {
          document.documentElement.style.setProperty(prop, value);
        }
      };
      if (primaryHex) queueUpdate("--sn-gradient-primary", primaryHex);
      if (secondaryHex) queueUpdate("--sn-gradient-secondary", secondaryHex);
      if (accentHex) queueUpdate("--sn-gradient-accent", accentHex);
      if (accentHex) {
        queueUpdate("--spice-accent", accentHex);
        queueUpdate("--spice-button", accentHex);
        queueUpdate("--spice-button-active", accentHex);
      }
      const addRgb = (prop, hex) => {
        if (!hex) return;
        const rgb = this.utils.hexToRgb(hex);
        if (rgb) {
          queueUpdate(prop, `${rgb.r},${rgb.g},${rgb.b}`);
        }
      };
      addRgb("--sn-gradient-primary-rgb", primaryHex);
      addRgb("--sn-gradient-secondary-rgb", secondaryHex);
      addRgb("--sn-gradient-accent-rgb", accentHex);
      addRgb("--sn-dynamic-accent-rgb", accentHex);
      addRgb("--spice-rgb-accent", accentHex);
      addRgb("--spice-rgb-button", accentHex);
      const root = this.utils.getRootStyle();
      if (root) {
        const computedStyle = getComputedStyle(root);
        const addSpiceRgb = (rgbProp, hexProp, fallbackHex) => {
          const hexValue = computedStyle.getPropertyValue(hexProp).trim() || fallbackHex;
          addRgb(rgbProp, hexValue);
        };
        addSpiceRgb("--spice-rgb-main", "--spice-main", "#cdd6f4");
        addSpiceRgb("--spice-rgb-base", "--spice-base", "#1e1e2e");
        addSpiceRgb("--spice-rgb-player", "--spice-player", "#181825");
        addSpiceRgb("--spice-rgb-sidebar", "--spice-sidebar", "#313244");
        addSpiceRgb("--spice-rgb-surface0", "--spice-surface0", "#313244");
        addSpiceRgb("--spice-rgb-surface1", "--spice-surface1", "#45475a");
        addSpiceRgb("--spice-rgb-text", "--spice-text", "#cdd6f4");
      }
      if (this.cssVariableBatcher) {
        this.cssVariableBatcher.flushCSSVariableBatch();
      }
      try {
        if (this.glassmorphismManager && primaryHex && secondaryHex) {
          this.glassmorphismManager.updateGlassColors(primaryHex, secondaryHex);
        }
      } catch (e) {
        console.warn(
          "[Year3000System] GlassmorphismManager colour update failed:",
          e
        );
      }
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("\u{1F3A8} [Year3000System] Applied harmonized colours", {
          primaryHex,
          secondaryHex,
          accentHex
        });
      }
    }
    // =============================================
    // 🆕 PUBLIC WRAPPER – UNIFIED CSS VARIABLE BATCH API
    // =============================================
    /**
     * Queue a CSS variable update through the shared CSSVariableBatcher. Falls
     * back to an immediate style mutation when the batcher is unavailable
     * (degraded mode or very early boot).
     *
     * @param property  The CSS custom property name (e.g. "--sn-nav-intensity")
     * @param value     The value to assign (raw string, keep units if needed)
     * @param element   Optional specific HTMLElement target. When omitted the
     *                  root <html> element is used so variables cascade.
     */
    queueCSSVariableUpdate(property, value, element = null) {
      if (this.cssVariableBatcher) {
        this.cssVariableBatcher.queueCSSVariableUpdate(
          property,
          value,
          element || void 0
        );
      } else {
        const target = element || document.documentElement;
        target.style.setProperty(property, value);
      }
    }
    setGradientParameters() {
      if (this.colorHarmonyEngine) {
      }
    }
    async updateColorsFromCurrentTrack() {
      if (this.musicSyncService) {
        await this.musicSyncService.processSongUpdate();
      }
    }
    evolveHarmonicSignature(selectedModeKey, baseSourceHex) {
      if (this.colorHarmonyEngine) {
        const rgb = this.utils.hexToRgb(baseSourceHex);
        if (rgb) {
          const variations = this.colorHarmonyEngine.generateHarmonicVariations(rgb);
          return {
            derivedDarkVibrantHex: variations.darkVibrantHex,
            derivedLightVibrantHex: variations.lightVibrantHex
          };
        }
      }
      return null;
    }
    async waitForTrackData(maxRetries = 10, delayMs = 100) {
      for (let i = 0; i < maxRetries; i++) {
        if (Spicetify.Player.data?.track?.uri) {
          return Spicetify.Player.data;
        }
        await this.utils.sleep(delayMs);
      }
      return null;
    }
    _setSpiceRgbVariables() {
      if (this.colorHarmonyEngine) {
      }
    }
    _setGradientParameters() {
      if (this.colorHarmonyEngine) {
      }
    }
    updateHarmonicBaseColor(hexColor) {
      if (this.colorHarmonyEngine && this.cssVariableBatcher) {
        const rgb = this.utils.hexToRgb(hexColor);
        if (rgb) {
          const variations = this.colorHarmonyEngine.generateHarmonicVariations(rgb);
          this.cssVariableBatcher.queueCSSVariableUpdate(
            "--sn-harmonic-base-dark-vibrant",
            variations.darkVibrantHex
          );
          this.cssVariableBatcher.queueCSSVariableUpdate(
            "--sn-harmonic-base-light-vibrant",
            variations.lightVibrantHex
          );
          this.cssVariableBatcher.flushCSSVariableBatch();
        }
      }
    }
    setupMusicAnalysisAndColorExtraction() {
      if (!this.musicSyncService) {
        console.error(
          "[Year3000System] MusicSyncService is not available to set up song change handler."
        );
        return;
      }
      if (!window.Spicetify?.Player) {
        console.warn(
          "[Year3000System] Spicetify.Player not available - music analysis disabled"
        );
        return;
      }
      const processSongUpdate = async () => {
        if (this.musicSyncService) {
          await this.musicSyncService.processSongUpdate();
        }
      };
      this._songChangeHandler = processSongUpdate;
      try {
        window.Spicetify.Player.addEventListener(
          "songchange",
          this._songChangeHandler
        );
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[Year3000System] Music analysis and color extraction set up successfully"
          );
        }
        setTimeout(processSongUpdate, 1e3);
      } catch (error) {
        console.error("[Year3000System] Failed to set up music analysis:", error);
        this._songChangeHandler = null;
      }
    }
    updateFromMusicAnalysis(processedData, rawFeatures, trackUri) {
      if (!processedData) return;
      this._updateGlobalKinetics(processedData);
    }
    _updateGlobalKinetics(data) {
      const root = this.utils.getRootStyle();
      if (!root) return;
      const safe = (value, fallback = 0) => Number.isFinite(value) ? value : fallback;
      const processedEnergy = safe(data.processedEnergy);
      const valence = safe(data.valence);
      const enhancedBPM = safe(data.enhancedBPM);
      const beatInterval = safe(data.beatInterval);
      const animationSpeed = safe(data.animationSpeedFactor, 1);
      root.style.setProperty("--sn-kinetic-energy", processedEnergy.toFixed(3));
      root.style.setProperty("--sn-kinetic-valence", valence.toFixed(3));
      root.style.setProperty("--sn-kinetic-bpm", enhancedBPM.toFixed(2));
      root.style.setProperty(
        "--sn-kinetic-beat-interval",
        `${beatInterval.toFixed(0)}ms`
      );
      root.style.setProperty(
        "--sn-kinetic-animation-speed",
        animationSpeed.toFixed(3)
      );
    }
    // Animation System Registration Methods
    registerAnimationSystem(name, system, priority = "normal", targetFPS = 60) {
      if (!this.masterAnimationCoordinator) {
        console.warn(
          `[Year3000System] Cannot register ${name} - MasterAnimationCoordinator not ready`
        );
        return false;
      }
      this.masterAnimationCoordinator.registerAnimationSystem(
        name,
        system,
        priority,
        targetFPS
      );
      return true;
    }
    unregisterAnimationSystem(name) {
      if (!this.masterAnimationCoordinator) {
        return false;
      }
      this.masterAnimationCoordinator.unregisterAnimationSystem(name);
      return true;
    }
    async _registerAnimationSystems() {
      if (!this.masterAnimationCoordinator) {
        console.warn(
          "[Year3000System] MasterAnimationCoordinator not available for visual system registration"
        );
        return;
      }
      const visualSystems = [
        {
          name: "BeatSyncVisualSystem",
          system: this.beatSyncVisualSystem,
          priority: "critical"
        },
        {
          name: "EmergentChoreographyEngine",
          system: this.emergentChoreographyEngine,
          priority: "critical"
        },
        {
          name: "BehavioralPredictionEngine",
          system: this.behavioralPredictionEngine,
          priority: "normal"
        },
        {
          name: "PredictiveMaterializationSystem",
          system: this.predictiveMaterializationSystem,
          priority: "normal"
        },
        {
          name: "SidebarConsciousnessSystem",
          system: this.sidebarConsciousnessSystem,
          priority: "normal"
        },
        {
          name: "LightweightParticleSystem",
          system: this.lightweightParticleSystem,
          priority: "background"
        },
        {
          name: "DimensionalNexusSystem",
          system: this.dimensionalNexusSystem,
          priority: "background"
        },
        {
          name: "DataGlyphSystem",
          system: this.dataGlyphSystem,
          priority: "background"
        }
      ];
      for (const { name, system, priority } of visualSystems) {
        if (system && (typeof system.onAnimate === "function" || typeof system.updateAnimation === "function")) {
          let optimizedPriority = priority;
          let targetFPS = 60;
          const currentProfile = system.currentPerformanceProfile;
          if (currentProfile?.frameRate) {
            targetFPS = currentProfile.frameRate;
          } else if (currentProfile?.quality) {
            const quality = currentProfile.quality;
            targetFPS = quality === "high" ? 60 : quality === "low" ? 30 : 45;
          }
          if (name.includes("BeatSync")) {
            optimizedPriority = "critical";
          } else if (name.includes("Particle") || name.includes("DataGlyph")) {
            optimizedPriority = "background";
            targetFPS = Math.min(targetFPS, 30);
          }
          this.masterAnimationCoordinator.registerAnimationSystem(
            name,
            system,
            optimizedPriority,
            targetFPS
          );
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              `\u{1F3AC} [Year3000System] Registered ${name} with Master Animation Coordinator (${optimizedPriority} priority, ${targetFPS}fps) - using ${typeof system.onAnimate === "function" ? "onAnimate" : "updateAnimation"} hook`
            );
          }
        }
      }
    }
    // Progressive Loading Methods for Extension Support
    async initializeWithAvailableAPIs(availableAPIs) {
      this.availableAPIs = availableAPIs;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F31F} [Year3000System] Progressive initialization mode: ${availableAPIs.degradedMode ? "DEGRADED" : "FULL"}`
        );
        console.log(`\u{1F31F} [Year3000System] Available APIs:`, {
          player: !!availableAPIs.player,
          platform: !!availableAPIs.platform,
          config: !!availableAPIs.config
        });
      }
      if (availableAPIs.degradedMode) {
        console.log(
          "\u{1F31F} [Year3000System] Initializing in degraded mode (visual-only systems)"
        );
        await this.initializeVisualOnlySystems();
      } else {
        console.log(
          "\u{1F31F} [Year3000System] Initializing in full mode (all systems)"
        );
        await this.initializeAllSystems();
      }
      if (availableAPIs.degradedMode) {
        this.setupProgressiveEnhancement();
      }
    }
    async initializeVisualOnlySystems() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F31F} [Year3000System] Starting visual-only system initialization..."
        );
      }
      const startTime = performance.now();
      const initializationResults = {
        success: [],
        failed: [],
        skipped: []
      };
      const essentialSystems = [
        {
          name: "DeviceCapabilityDetector",
          init: () => {
            this.deviceCapabilityDetector = new DeviceCapabilityDetector();
            this.deviceCapabilityDetector.initialize();
          }
        },
        {
          name: "TimerConsolidationSystem",
          init: () => {
            this.timerConsolidationSystem = new TimerConsolidationSystem();
          }
        },
        {
          name: "CSSVariableBatcher",
          init: () => {
            this.cssVariableBatcher = new CSSVariableBatcher({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
          }
        },
        {
          name: "PerformanceAnalyzer",
          init: () => {
            this.performanceAnalyzer = new PerformanceAnalyzer({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
          }
        },
        {
          name: "MasterAnimationCoordinator",
          init: () => {
            if (!this.performanceAnalyzer) {
              throw new Error(
                "PerformanceAnalyzer is required for MasterAnimationCoordinator."
              );
            }
            this.masterAnimationCoordinator = new MasterAnimationCoordinator({
              enableDebug: this.YEAR3000_CONFIG.enableDebug
            });
            this.masterAnimationCoordinator.startMasterAnimationLoop();
          }
        }
      ];
      for (const { name, init: init2 } of essentialSystems) {
        try {
          await init2();
          initializationResults.success.push(name);
        } catch (error) {
          initializationResults.failed.push(name);
          console.error(`[Year3000System] Failed to initialize ${name}:`, error);
        }
      }
      const skippedSystems = [
        "SettingsManager",
        "MusicSyncService",
        "ColorHarmonyEngine",
        "GlassmorphismManager",
        "Card3DManager",
        "All Visual Systems"
      ];
      initializationResults.skipped.push(...skippedSystems);
      this.initializationResults = initializationResults;
      this.initialized = true;
      const endTime = performance.now();
      const initTime = endTime - startTime;
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `\u{1F31F} [Year3000System] Visual-only initialization complete in ${initTime.toFixed(
            2
          )}ms`
        );
        console.log(
          `\u{1F31F} [Year3000System] Results: ${initializationResults.success.length} success, ${initializationResults.failed.length} failed, ${initializationResults.skipped.length} skipped`
        );
      }
    }
    setupProgressiveEnhancement() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F31F} [Year3000System] Setting up progressive enhancement monitoring..."
        );
      }
      let enhancementAttempts = 0;
      const maxEnhancementAttempts = 30;
      const enhancementInterval = setInterval(() => {
        enhancementAttempts++;
        const playerAvailable = !!window.Spicetify?.Player;
        const platformAvailable = !!window.Spicetify?.Platform;
        if (playerAvailable && platformAvailable && this.availableAPIs?.degradedMode) {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "\u{1F31F} [Year3000System] APIs now available! Triggering upgrade to full mode..."
            );
          }
          clearInterval(enhancementInterval);
          this.upgradeToFullMode().catch((error) => {
            console.error("[Year3000System] Upgrade to full mode failed:", error);
          });
        }
        if (enhancementAttempts >= maxEnhancementAttempts) {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.log(
              "\u{1F31F} [Year3000System] Progressive enhancement monitoring stopped (timeout)"
            );
          }
          clearInterval(enhancementInterval);
        }
      }, 2e3);
    }
    async upgradeToFullMode() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F31F} [Year3000System] Upgrading from degraded mode to full mode..."
        );
      }
      this.availableAPIs = {
        player: window.Spicetify?.Player,
        platform: window.Spicetify?.Platform,
        config: window.Spicetify?.Config,
        degradedMode: false
      };
      try {
        const upgradeResults = {
          success: [],
          failed: [],
          skipped: []
        };
        try {
          this.settingsManager = new SettingsManager();
          if (this.systemHealthMonitor) {
            this.systemHealthMonitor.registerSystem(
              "SettingsManager",
              this.settingsManager
            );
          }
          upgradeResults.success.push("SettingsManager");
        } catch (error) {
          upgradeResults.failed.push("SettingsManager");
          console.error(
            `[Year3000System] Failed to upgrade SettingsManager:`,
            error
          );
        }
        if (this.settingsManager) {
          try {
            this.musicSyncService = new MusicSyncService({
              YEAR3000_CONFIG: this.YEAR3000_CONFIG,
              Year3000Utilities: this.utils,
              settingsManager: this.settingsManager,
              year3000System: this
            });
            await this.musicSyncService.initialize();
            this.musicSyncService.subscribe(this, "Year3000System");
            upgradeResults.success.push("MusicSyncService");
          } catch (error) {
            upgradeResults.failed.push("MusicSyncService");
            console.error(
              `[Year3000System] Failed to upgrade MusicSyncService:`,
              error
            );
          }
        }
        if (this.performanceAnalyzer && this.settingsManager) {
          try {
            this.colorHarmonyEngine = new ColorHarmonyEngine(
              this.YEAR3000_CONFIG,
              this.utils,
              this.performanceAnalyzer,
              this.musicSyncService || void 0,
              this.settingsManager
            );
            await this.colorHarmonyEngine.initialize();
            if (this.musicSyncService) {
              this.musicSyncService.setColorHarmonyEngine(
                this.colorHarmonyEngine
              );
            }
            if (this.systemHealthMonitor) {
              this.systemHealthMonitor.registerSystem(
                "ColorHarmonyEngine",
                this.colorHarmonyEngine
              );
            }
            upgradeResults.success.push("ColorHarmonyEngine");
          } catch (error) {
            upgradeResults.failed.push("ColorHarmonyEngine");
            console.error(
              `[Year3000System] Failed to upgrade ColorHarmonyEngine:`,
              error
            );
          }
          await this._initializeVisualSystems(upgradeResults);
          if (this.masterAnimationCoordinator) {
            await this._registerAnimationSystems();
          }
        }
        if (this.musicSyncService && this.availableAPIs.player) {
          this.setupMusicAnalysisAndColorExtraction();
        }
        if (this.settingsManager) {
          await this.applyInitialSettings();
        }
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `\u{1F31F} [Year3000System] Upgrade complete: ${upgradeResults.success.length} success, ${upgradeResults.failed.length} failed`
          );
          if (upgradeResults.failed.length > 0) {
            console.warn(
              `\u{1F31F} [Year3000System] Upgrade failed systems: ${upgradeResults.failed.join(
                ", "
              )}`
            );
          }
          if (upgradeResults.skipped && upgradeResults.skipped.length > 0) {
            console.info(
              `\u{1F31F} [Year3000System] Upgrade skipped systems: ${upgradeResults.skipped.join(
                ", "
              )}`
            );
          }
          if (upgradeResults.success.length > 0) {
            console.info(
              `\u{1F31F} [Year3000System] Upgrade successful systems: ${upgradeResults.success.join(
                ", "
              )}`
            );
          }
        }
      } catch (error) {
        console.error(
          "[Year3000System] Error during upgrade to full mode:",
          error
        );
      }
    }
    _handleExternalSettingsChange(event) {
      const { key, value } = event.detail || {};
      if (!key) return;
      switch (key) {
        case ARTISTIC_MODE_KEY: {
          try {
            if (typeof this.YEAR3000_CONFIG.safeSetArtisticMode === "function") {
              this.YEAR3000_CONFIG.safeSetArtisticMode(value);
            }
          } catch (e) {
            console.warn("[Year3000System] Failed to apply artistic mode", e);
          }
          break;
        }
        case HARMONIC_INTENSITY_KEY: {
          const num = parseFloat(value);
          if (!Number.isNaN(num)) {
            this.YEAR3000_CONFIG.harmonicIntensity = num;
            if (this.colorHarmonyEngine) {
              this.colorHarmonyEngine.setIntensity?.(num);
              this.updateColorsFromCurrentTrack?.();
            }
          }
          break;
        }
        case HARMONIC_EVOLUTION_KEY: {
          const enabled = value === "true" || value === true;
          this.allowHarmonicEvolution = enabled;
          this.YEAR3000_CONFIG.harmonicEvolution = enabled;
          break;
        }
        case MANUAL_BASE_COLOR_KEY: {
          if (typeof value === "string" && value.startsWith("#")) {
            this.updateHarmonicBaseColor(value);
          }
          break;
        }
        case HARMONIC_MODE_KEY: {
          if (value !== null && value !== void 0) {
            this.YEAR3000_CONFIG.currentHarmonicMode = String(value);
            this.updateColorsFromCurrentTrack?.();
          }
          break;
        }
        default:
          break;
      }
      this._broadcastSettingChange(key, value);
      this._refreshConditionalSystems();
    }
    /**
     * Notify all subsystems that implement applyUpdatedSettings so they can
     * adjust behaviour immediately after a SettingsManager change.
     */
    _broadcastSettingChange(key, value) {
      const systems = [
        this.colorHarmonyEngine,
        this.glassmorphismManager,
        this.card3DManager,
        this.lightweightParticleSystem,
        this.dimensionalNexusSystem,
        this.dataGlyphSystem,
        this.beatSyncVisualSystem,
        this.behavioralPredictionEngine,
        this.predictiveMaterializationSystem,
        this.sidebarConsciousnessSystem,
        this.particleFieldSystem,
        this.webGPUBackgroundSystem
      ];
      systems.forEach((sys) => {
        if (sys && typeof sys.applyUpdatedSettings === "function") {
          try {
            sys.applyUpdatedSettings(key, value);
          } catch (err) {
            console.warn(
              `[Year3000System] ${sys.systemName || sys.constructor.name} failed to handle settings change`,
              err
            );
          }
        }
        if (sys && typeof sys.forceRepaint === "function") {
          try {
            sys.forceRepaint(`settings:${key}`);
          } catch (err) {
            console.warn(
              `[Year3000System] ${sys.systemName || sys.constructor.name} failed to repaint after settings change`,
              err
            );
          }
        }
      });
    }
    /**
     * Respond to Artistic Mode changes coming from the shared YEAR3000_CONFIG.
     * We re-apply colors extracted from the current track so gradients and
     * other CSS variables update without needing a song-change or full reload.
     */
    async _onArtisticModeChanged() {
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "\u{1F3A8} [Year3000System] Artistic mode changed \u2013 refreshing colours"
        );
      }
      try {
        this._applyPerformanceProfile();
        await this._refreshConditionalSystems();
        await this.updateColorsFromCurrentTrack();
      } catch (err) {
        console.warn(
          "[Year3000System] Failed to refresh colours after artistic mode change:",
          err
        );
      }
    }
    /**
     * Push the current Artistic Mode's performance profile down into every
     * active visual system that exposes an `applyPerformanceSettings` method.
     */
    _applyPerformanceProfile() {
      const perf = this.YEAR3000_CONFIG.getCurrentPerformanceSettings?.();
      if (!perf) return;
      const systems = [
        this.lightweightParticleSystem,
        this.dimensionalNexusSystem,
        this.dataGlyphSystem,
        this.beatSyncVisualSystem,
        this.behavioralPredictionEngine,
        this.predictiveMaterializationSystem,
        this.sidebarConsciousnessSystem
      ];
      systems.forEach((s) => {
        if (s && typeof s.applyPerformanceSettings === "function") {
          try {
            s.applyPerformanceSettings(perf);
          } catch (e) {
            console.warn("[Year3000System] Failed to apply perf settings", e);
          }
        }
      });
    }
    // === NEW: helper to retrieve harmonic mode object ========================
    /**
     * Convenience wrapper that fetches the current harmonic mode from the
     * SettingsManager and stores the key on the shared configuration so that
     * all subsystems have easy access without reading localStorage directly.
     */
    _syncCurrentHarmonicMode() {
      if (!this.settingsManager) return;
      const key = this.settingsManager.get("sn-current-harmonic-mode");
      if (key && typeof key === "string") {
        this.YEAR3000_CONFIG.currentHarmonicMode = key;
      }
    }
    async _refreshConditionalSystems() {
      if (!this.performanceAnalyzer || !this.settingsManager) return;
      const mode = this.YEAR3000_CONFIG.artisticMode;
      const enableDebug = this.YEAR3000_CONFIG.enableDebug;
      const wantsParticle = mode === "cosmic-maximum";
      if (wantsParticle && !this.particleFieldSystem) {
        try {
          const sys = new ParticleFieldSystem(
            this.YEAR3000_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService,
            this.settingsManager,
            this
          );
          await sys.initialize();
          if (sys.initialized) {
            this.particleFieldSystem = sys;
            this.systemHealthMonitor?.registerSystem("ParticleFieldSystem", sys);
            this.registerAnimationSystem(
              "ParticleFieldSystem",
              sys,
              "background",
              30
            );
            if (enableDebug) {
              console.log(
                "\u{1F30C} [Year3000System] ParticleFieldSystem started (cosmic-maximum mode)"
              );
            }
          }
        } catch (err) {
          console.warn(
            "[Year3000System] Failed to start ParticleFieldSystem",
            err
          );
        }
      } else if (!wantsParticle && this.particleFieldSystem) {
        this.unregisterAnimationSystem("ParticleFieldSystem");
        this.particleFieldSystem.destroy();
        this.particleFieldSystem = null;
        if (enableDebug) {
          console.log(
            "\u{1F30C} [Year3000System] ParticleFieldSystem stopped (mode change)"
          );
        }
      }
      const gpuSupported = typeof navigator !== "undefined" && navigator.gpu;
      const webgpuEnabled = this.settingsManager.get("sn-enable-webgpu") === "true";
      const wantsWebGPU = gpuSupported && webgpuEnabled && mode === "cosmic-maximum";
      if (wantsWebGPU && !this.webGPUBackgroundSystem) {
        try {
          const sys = new WebGPUBackgroundSystem(
            this.YEAR3000_CONFIG,
            this.utils,
            this.performanceAnalyzer,
            this.musicSyncService,
            this.settingsManager,
            this
          );
          await sys.initialize();
          if (sys.initialized) {
            this.webGPUBackgroundSystem = sys;
            this.systemHealthMonitor?.registerSystem(
              "WebGPUBackgroundSystem",
              sys
            );
            this.registerAnimationSystem(
              "WebGPUBackgroundSystem",
              sys,
              "background",
              30
            );
            if (enableDebug) {
              console.log("\u{1F5A5}\uFE0F [Year3000System] WebGPUBackgroundSystem started");
            }
          }
        } catch (err) {
          console.warn(
            "[Year3000System] Failed to start WebGPUBackgroundSystem",
            err
          );
        }
      } else if (!wantsWebGPU && this.webGPUBackgroundSystem) {
        this.unregisterAnimationSystem("WebGPUBackgroundSystem");
        this.webGPUBackgroundSystem.destroy();
        this.webGPUBackgroundSystem = null;
        if (enableDebug) {
          console.log("\u{1F5A5}\uFE0F [Year3000System] WebGPUBackgroundSystem stopped");
        }
      }
    }
  };
  var year3000System = new Year3000System();
  if (typeof window !== "undefined") {
    window.HARMONIC_MODES = HARMONIC_MODES;
    window.year3000System = year3000System;
  }

  // src-js/debug/SystemIntegrationTester.ts
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
        console.log("\u{1F9EA} [StarryNight Debug] Testing gradient application...");
      }
      if (globalThis.year3000System?.updateColorsFromCurrentTrack) {
        globalThis.year3000System.updateColorsFromCurrentTrack();
      } else {
        console.warn(
          "[StarryNight Debug] year3000System.updateColorsFromCurrentTrack not available."
        );
      }
      const root = getRootStyle();
      if (!root) {
        console.warn(
          "[StarryNight Debug] Root element not found for testGradients."
        );
        return { gradientVars: {}, rgbValidation: {} };
      }
      const computedStyle = getComputedStyle(root);
      const gradientVars = {
        primary: computedStyle.getPropertyValue("--sn-gradient-primary").trim(),
        secondary: computedStyle.getPropertyValue("--sn-gradient-secondary").trim(),
        accent: computedStyle.getPropertyValue("--sn-gradient-accent").trim(),
        primaryRgb: computedStyle.getPropertyValue("--sn-gradient-primary-rgb").trim(),
        secondaryRgb: computedStyle.getPropertyValue("--sn-gradient-secondary-rgb").trim(),
        accentRgb: computedStyle.getPropertyValue("--sn-gradient-accent-rgb").trim(),
        opacity: computedStyle.getPropertyValue("--sn-gradient-opacity").trim(),
        blur: computedStyle.getPropertyValue("--sn-gradient-blur").trim()
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
        accentRgbValid: /^\d+,\d+,\d+$/.test(gradientVars.accentRgb)
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
      const rootStyle = getRootStyle();
      if (!rootStyle) {
        console.warn(
          "[StarryNight Debug] Root element style not found for logCurrentVariables."
        );
        return { hexVars: {}, rgbVars: {}, allVariables: {} };
      }
      const variables = {};
      const rootElement = document.documentElement;
      const computedRootStyle = getComputedStyle(rootElement);
      for (let i = 0; i < computedRootStyle.length; i++) {
        const propName = computedRootStyle[i];
        if (propName && (propName.startsWith("--spice-") || propName.startsWith("--sn-"))) {
          variables[propName] = computedRootStyle.getPropertyValue(propName).trim();
        }
      }
      const hexVars = Object.keys(variables).filter((key) => !key.includes("-rgb")).reduce((obj, key) => {
        obj[key] = variables[key];
        return obj;
      }, {});
      const rgbVars = Object.keys(variables).filter((key) => key.includes("-rgb")).reduce((obj, key) => {
        obj[key] = variables[key];
        return obj;
      }, {});
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log("\u{1F3A8} [StarryNight Debug] Hex Variables:", hexVars);
        console.log("\u{1F9EE} [StarryNight Debug] RGB Variables:", rgbVars);
      }
      return {
        hexVars,
        rgbVars,
        allVariables: variables
      };
    }
    testHexToRgb(hex) {
      const rgb = hexToRgb(hex);
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
        "--spice-rgb-surface0",
        "--spice-rgb-surface1",
        "--spice-rgb-text"
      ];
      const root = getRootStyle();
      if (!root) {
        console.warn(
          "[StarryNight Debug] Root element not found for validateRgbVariables."
        );
        return {};
      }
      const validation = {};
      const computedStyle = getComputedStyle(root);
      requiredRgbVars.forEach((varName) => {
        const value = computedStyle.getPropertyValue(varName).trim();
        validation[varName] = {
          present: !!value,
          value,
          validFormat: /^\d+,\d+,\d+$/.test(value)
        };
      });
      if (YEAR3000_CONFIG?.enableDebug) {
        console.table(validation);
      }
      return validation;
    }
    resetColors() {
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log("\u{1F504} [StarryNight Debug] Resetting colors to defaults...");
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
        console.log("\u{1F4CA} [StarryNight Debug] Generating system report...");
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
    getCssVariable(varName) {
      const rootElement = getRootStyle();
      if (!rootElement) {
        console.warn(
          `[StarryNight Debug] Root element style not found for getCssVariable: ${varName}.`
        );
        return null;
      }
      const value = getComputedStyle(rootElement).getPropertyValue(varName).trim();
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
        errors: []
      };
      try {
        console.log("\u{1F4CB} Step 1: Validating DOM structure...");
        this.testResults.domValidation = await this.validateDOMStructure();
        console.log("\u{1F3AF} Step 2: Testing individual systems...");
        this.testResults.systemTests = await this.testAllVisualSystems();
        console.log("\u{1F517} Step 3: Testing cross-system integration...");
        this.testResults.crossSystemTests = await this.testCrossSystemIntegration();
        console.log("\u26A1 Step 4: Performance testing...");
        this.testResults.performanceTests = await this.testSystemPerformance();
        console.log("\u{1F4CA} Step 5: Generating integration report...");
        const report = this.generateIntegrationReport();
        this.testResults.endTime = Date.now();
        this.testResults.duration = (this.testResults.endTime || 0) - (this.testResults.startTime || 0);
        console.log("\u2705 Integration test completed successfully!");
        console.groupEnd();
        return report;
      } catch (error) {
        this.testResults.errors.push({
          type: "FATAL_ERROR",
          message: error.message,
          stack: error.stack,
          timestamp: Date.now()
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
        recommendations: []
      };
      Object.entries(MODERN_SELECTORS).forEach(([key, selector]) => {
        if (elementExists(selector)) {
          domValidation.modernSelectorsFound++;
        } else {
          domValidation.modernSelectorsMissing++;
          if (GRAVITY_WELL_TARGETS.primary?.includes(selector) || GRAVITY_WELL_TARGETS.secondary?.includes(selector)) {
            domValidation.criticalElementsMissing.push({
              name: key,
              selector,
              impact: "HIGH"
            });
          }
        }
      });
      const legacySelectors = [
        ".main-nowPlayingWidget-nowPlaying",
        ".main-navBar-navBar",
        ".main-search-searchBar",
        ".main-topBar-topBar",
        ".main-queue-queue"
      ];
      legacySelectors.forEach((selector) => {
        if (elementExists(selector)) {
          domValidation.legacySelectorsStillPresent++;
          domValidation.recommendations.push({
            type: "LEGACY_SELECTOR_FOUND",
            selector,
            message: `Legacy selector ${selector} still exists - systems may have redundant targeting`
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
        "DataGlyphSystem"
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
        errors: []
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
          message: error.message
        });
      }
      return systemTest;
    }
    async testSystemSelectors(systemName) {
      const selectorTest = {
        found: 0,
        missing: 0,
        details: []
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
          importance
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
          selector: MODERN_SELECTORS.leftSidebar ?? "",
          importance: "HIGH"
        },
        {
          name: "Now Playing Bar",
          selector: MODERN_SELECTORS.nowPlayingBar ?? "",
          importance: "HIGH"
        },
        {
          name: "Track Rows",
          selector: ORBITAL_ELEMENTS.trackRows ?? "",
          importance: "MEDIUM"
        }
      ];
      const systemSpecificSelectors = {
        BehavioralPredictionEngine: [
          ...commonSelectors,
          {
            name: "Play Button",
            selector: MODERN_SELECTORS.playButton ?? "",
            importance: "HIGH"
          },
          {
            name: "Like Button",
            selector: MODERN_SELECTORS.likeButton ?? "",
            importance: "MEDIUM"
          }
        ],
        DimensionalNexusSystem: [
          {
            name: "Left Sidebar",
            selector: MODERN_SELECTORS.leftSidebar ?? "",
            importance: "CRITICAL"
          },
          {
            name: "Modal Container",
            selector: MODERN_SELECTORS.modal ?? "",
            importance: "MEDIUM"
          }
        ],
        DataGlyphSystem: [
          {
            name: "Nav Links",
            selector: ORBITAL_ELEMENTS.navLinks ?? "",
            importance: "HIGH"
          },
          {
            name: "Cards",
            selector: ORBITAL_ELEMENTS.cards ?? "",
            importance: "MEDIUM"
          }
        ]
      };
      return systemSpecificSelectors[systemName] || commonSelectors;
    }
    // === CROSS-SYSTEM INTEGRATION TESTING ===
    async testCrossSystemIntegration() {
      const crossSystemTests = {
        sharedElementConflicts: this.testSharedElementUsage(),
        performanceImpacts: []
      };
      return crossSystemTests;
    }
    testSharedElementUsage() {
      const conflicts = [];
      const criticalSelectors = [
        MODERN_SELECTORS.leftSidebar,
        MODERN_SELECTORS.nowPlayingBar,
        ORBITAL_ELEMENTS.trackRows
      ];
      criticalSelectors.forEach((selector) => {
        if (!selector) return;
        const element = document.querySelector(selector);
        if (element) {
          const classes = Array.from(element.classList);
          const systemPrefixes = classes.filter(
            (cls) => cls.startsWith("sn-") || cls.startsWith("year3000-") || cls.startsWith("gravity-")
          );
          if (systemPrefixes.length > 3) {
            conflicts.push({
              selector,
              element,
              systemClasses: systemPrefixes,
              severity: "POTENTIAL_CONFLICT",
              message: `Element has ${systemPrefixes.length} system-specific classes`
            });
          }
        }
      });
      return conflicts;
    }
    // === PERFORMANCE TESTING ===
    async testSystemPerformance() {
      return {
        domQuerySpeed: await this.testDOMQueryPerformance(),
        memoryUsage: this.testMemoryUsage()
      };
    }
    async testDOMQueryPerformance() {
      const tests = [];
      const selectors = Object.values(MODERN_SELECTORS);
      const iterations = 100;
      const startTime = performance.now();
      for (let i = 0; i < iterations; i++) {
        selectors.forEach((selector) => {
          if (selector) document.querySelectorAll(selector);
        });
      }
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;
      tests.push({
        test: "Modern Selectors Query Speed",
        iterations,
        totalTime: endTime - startTime,
        averageTime,
        status: averageTime < 5 ? "GOOD" : averageTime < 15 ? "ACCEPTABLE" : "SLOW"
      });
      return tests;
    }
    testMemoryUsage() {
      const memoryTests = [];
      const memory = performance.memory;
      if (memory) {
        memoryTests.push({
          test: "JavaScript Heap Usage",
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize * 100).toFixed(2),
          status: memory.usedJSHeapSize < memory.totalJSHeapSize * 0.8 ? "GOOD" : "HIGH"
        });
      }
      return memoryTests;
    }
    // === REPORTING ===
    generateIntegrationReport() {
      const report = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        duration: this.testResults.duration,
        summary: this.generateSummary(),
        recommendations: this.generateRecommendations(),
        fullResults: this.testResults
      };
      this.logFormattedReport(report);
      return report;
    }
    generateSummary() {
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      const healthySystems = Object.values(systemTests || {}).filter(
        (s) => s.status === "HEALTHY"
      ).length;
      const totalSystems = Object.keys(systemTests || {}).length;
      return {
        overallHealth: this.calculateOverallHealth(),
        modernSelectorsFound: domValidation?.modernSelectorsFound,
        modernSelectorsMissing: domValidation?.modernSelectorsMissing,
        systemsHealthy: healthySystems,
        systemsTotal: totalSystems,
        criticalIssues: domValidation?.criticalElementsMissing.length
      };
    }
    calculateOverallHealth() {
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      let score = 100;
      if (domValidation) {
        score -= domValidation.modernSelectorsMissing * 5;
        score -= domValidation.criticalElementsMissing.length * 15;
      }
      if (systemTests) {
        const unhealthySystems = Object.values(systemTests).filter(
          (s) => s.status === "FAILING" || s.status === "ERROR"
        ).length;
        score -= unhealthySystems * 20;
      }
      return Math.max(0, score);
    }
    generateRecommendations() {
      const recommendations = [];
      const domValidation = this.testResults.domValidation;
      const systemTests = this.testResults.systemTests;
      if (domValidation?.criticalElementsMissing.length > 0) {
        recommendations.push({
          priority: "HIGH",
          type: "CRITICAL_ELEMENTS",
          message: `${domValidation.criticalElementsMissing.length} critical elements are missing`,
          action: "Update Spotify or check for UI changes"
        });
      }
      if (systemTests) {
        Object.entries(systemTests).forEach(([systemName, test]) => {
          if (test.status === "FAILING" || test.status === "ERROR") {
            recommendations.push({
              priority: "HIGH",
              type: "SYSTEM_FAILURE",
              system: systemName,
              message: `${systemName} is not functioning properly`,
              action: "Check system initialization and selector updates"
            });
          }
        });
      }
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
            `${rec.priority === "HIGH" ? "\u{1F534}" : "\u{1F7E1}"} ${rec.type}: ${rec.message}`
          );
          console.log(`   Action: ${rec.action}`);
        });
        console.groupEnd();
      }
      console.groupEnd();
    }
  };
  var Year3000Debug = {
    testGradients: () => new SystemIntegrationTester().testGradients(),
    logCurrentVariables: () => new SystemIntegrationTester().logCurrentVariables(),
    testHexToRgb: (hex) => new SystemIntegrationTester().testHexToRgb(hex),
    validateRgbVariables: () => new SystemIntegrationTester().validateRgbVariables(),
    resetColors: () => new SystemIntegrationTester().resetColors(),
    extractColors: () => new SystemIntegrationTester().extractColors(),
    getReport: () => new SystemIntegrationTester().getReport(),
    getCssVariable: (varName) => new SystemIntegrationTester().getCssVariable(varName),
    runFullIntegrationTest: () => new SystemIntegrationTester().runFullIntegrationTest(),
    getInstance: () => new SystemIntegrationTester()
  };
  if (typeof window !== "undefined") {
    window.SystemIntegrationTester = new SystemIntegrationTester();
    window.Year3000Debug = Year3000Debug;
    window.runIntegrationTest = () => window.SystemIntegrationTester.runFullIntegrationTest();
  }

  // src-js/effects/Aberration/AberrationCanvas.ts
  var AberrationCanvas = class {
    constructor(parent, y3k = null) {
      this.parent = parent;
      this.y3k = y3k;
      this.gl = null;
      this.program = null;
      this.tex = null;
      this.strength = 0.4;
      // default; overridden via CSS var
      this.rafId = null;
      this.frameStart = 0;
      this._defaultSize = 256;
      // Bound handlers so we can remove them in destroy()
      this._boundContextLost = (e) => this._handleContextLost(e);
      this._boundContextRestored = () => this._handleContextRestored();
      this.canvas = document.createElement("canvas");
      this.canvas.width = this._defaultSize;
      this.canvas.height = this._defaultSize;
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      Object.assign(this.canvas.style, {
        position: "absolute",
        inset: "0",
        pointerEvents: "none",
        mixBlendMode: "screen",
        zIndex: "-1"
      });
      this.parent.appendChild(this.canvas);
      this.perf = y3k?.performanceAnalyzer ?? null;
      this.canvas.addEventListener(
        "webglcontextlost",
        this._boundContextLost,
        false
      );
      this.canvas.addEventListener(
        "webglcontextrestored",
        this._boundContextRestored,
        false
      );
      this._initGL();
    }
    _initGL() {
      const gl = this.canvas.getContext("webgl", {
        premultipliedAlpha: false,
        alpha: true,
        antialias: false
      });
      if (!gl) {
        console.warn("[AberrationCanvas] WebGL not available \u2013 effect disabled");
        return;
      }
      this.gl = gl;
      const vsSource = `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = (aPos+1.0)*0.5; gl_Position = vec4(aPos,0.0,1.0); }`;
      const fsSource = `precision mediump float; uniform sampler2D uTex; uniform float uStrength; uniform float uTime; varying vec2 vUv; void main(){ float freq = 8.0; vec2 offset = vec2(sin(vUv.y*freq+uTime)*uStrength, 0.0); vec4 c; c.r = texture2D(uTex, vUv + offset).r; c.g = texture2D(uTex, vUv).g; c.b = texture2D(uTex, vUv - offset).b; c.a = clamp(uStrength * 1.5, 0.0, 0.6); gl_FragColor = c; }`;
      const compile = (type, src) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        return sh;
      };
      const vs = compile(gl.VERTEX_SHADER, vsSource);
      const fs = compile(gl.FRAGMENT_SHADER, fsSource);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("[AberrationCanvas] Shader link failed");
        return;
      }
      this.program = prog;
      gl.useProgram(prog);
      const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255, 255])
      );
      this.tex = tex;
    }
    /** Public API: update strength via CSS variable (0–1) */
    setStrength(value) {
      this.strength = value;
    }
    /** Uploads a bitmap (e.g., gradient snapshot) into the shader texture. */
    updateSourceBitmap(bmp) {
      if (!this.gl || !this.tex) return;
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);
    }
    /**
     * Public render hook – called by AberrationVisualSystem.onAnimate().
     * All original rendering logic from the private _render loop lives here so
     * that the effect can be orchestrated by MasterAnimationCoordinator.
     */
    render(time) {
      if (!this.gl || !this.program) return;
      const gl = this.gl;
      if (this.perf) this.frameStart = performance.now();
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this.program);
      const uTexLoc = gl.getUniformLocation(this.program, "uTex");
      const uStrLoc = gl.getUniformLocation(this.program, "uStrength");
      const uTimeLoc = gl.getUniformLocation(this.program, "uTime");
      gl.uniform1i(uTexLoc, 0);
      gl.uniform1f(uStrLoc, this.strength);
      gl.uniform1f(uTimeLoc, time * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (this.perf) {
        const dur = performance.now() - this.frameStart;
        this.perf.shouldUpdate("aberration", 500) && this.perf.endTiming("AberrationCanvas", this.frameStart);
        if (dur > 0.5) {
          console.warn(
            `[AberrationCanvas] Frame ${dur.toFixed(2)} ms exceeds 0.5 ms budget`
          );
        }
      }
    }
    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.gl) {
        const lose = this.gl.getExtension("WEBGL_lose_context");
        lose?.loseContext();
      }
      this.canvas.removeEventListener("webglcontextlost", this._boundContextLost);
      this.canvas.removeEventListener(
        "webglcontextrestored",
        this._boundContextRestored
      );
      this.canvas.remove();
    }
    /**
     * Dynamically adjusts the off-screen buffer resolution. Caller should use
     * powers of two (64–256) to keep GPU happy. Safe to call every time
     * performance mode toggles – texture & buffers are reused.
     */
    setPixelSize(size) {
      if (size === this.canvas.width) return;
      this.canvas.width = size;
      this.canvas.height = size;
    }
    // ────────────────────────────────────────────────────────────────
    // Context-loss life-cycle helpers (Phase-5)
    // ────────────────────────────────────────────────────────────────
    _handleContextLost(e) {
      e.preventDefault();
      console.warn("[AberrationCanvas] WebGL context lost \u2013 waiting for restore");
      this.gl = null;
      this.program = null;
    }
    _handleContextRestored() {
      console.info(
        "[AberrationCanvas] WebGL context restored \u2013 re-initializing GL"
      );
      this._initGL();
    }
  };

  // src-js/effects/Aberration/AberrationVisualSystem.ts
  var AberrationVisualSystem = class {
    constructor(canvas, perf) {
      this.systemName = "AberrationCanvas";
      this._elapsed = 0;
      this._canvas = canvas;
      this._perf = perf;
    }
    /* --------------------------------------------------------------- */
    /* MasterAnimationCoordinator hooks                                */
    /* --------------------------------------------------------------- */
    /**
     * Called by the coordinator every frame (subject to frame budgeting).
     * @param deltaMs Time in milliseconds since last call.
     */
    onAnimate(deltaMs) {
      this._elapsed += deltaMs;
      let start = 0;
      if (this._perf) start = this._perf.startTiming("AberrationVisualSystem");
      this._canvas.render(this._elapsed);
      if (this._perf && start) {
        this._perf.endTiming("AberrationVisualSystem", start);
      }
    }
    /**
     * Optional hook – will be invoked when MAC toggles performance modes.
     * We keep it for future Phase-2 improvements (dynamic resolution scaling).
     */
    onPerformanceModeChange(mode) {
      if (mode === "performance") {
        this._canvas.setPixelSize(128);
        this._canvas.setStrength(0.25);
      } else {
        this._canvas.setPixelSize(256);
        this._canvas.setStrength(0.4);
      }
    }
    /* --------------------------------------------------------------- */
    /* Lifecycle helpers                                               */
    /* --------------------------------------------------------------- */
    destroy() {
      this._canvas.destroy();
    }
  };

  // src-js/utils/getScrollNode.ts
  var SCROLL_NODE_SELECTORS = [
    ".main-view-container__scroll-node",
    // 2023-era builds
    ".main-viewContainer-scrollNode",
    // 2024 dash variant
    ".main-viewContainer__scrollNode"
    // 2024 double-underscore variant
  ].join(", ");
  function getScrollNode() {
    return document.querySelector(SCROLL_NODE_SELECTORS);
  }

  // src-js/effects/Aberration/AberrationManager.ts
  var instance = null;
  var visualSystem = null;
  function isAberrationEnabled() {
    try {
      const val = window.Spicetify?.LocalStorage?.get?.(
        "sn-enable-aberration"
      );
      return val !== "false";
    } catch {
      return true;
    }
  }
  function attach(y3k) {
    if (!isAberrationEnabled()) {
      setNebulaNoiseEnabled(false, y3k);
      return;
    }
    const node = getScrollNode();
    if (!node) return;
    if (instance && instance.parent === node) return;
    instance?.destroy();
    instance = new AberrationCanvas(node, y3k);
    if (window.__SN_DEBUG_ABERRATION) {
      console.log("[AberrationManager] canvas attached", node);
    }
    setNebulaNoiseEnabled(true, y3k);
    if (y3k && instance) {
      visualSystem = new AberrationVisualSystem(
        instance,
        y3k.performanceAnalyzer || void 0
      );
      y3k.registerAnimationSystem(
        "AberrationCanvas",
        visualSystem,
        // satisfies minimal AnimationSystem
        "critical",
        60
      );
      y3k.performanceAnalyzer?.emitTrace("AberrationCanvasAttached");
    }
  }
  function setNebulaNoiseEnabled(enabled, y3k) {
    if (y3k) {
      y3k.queueCSSVariableUpdate(
        "--sn-nebula-noise-opacity",
        enabled ? "0.03" : "0"
      );
    } else {
      document.documentElement.style.setProperty(
        "--sn-nebula-noise-opacity",
        enabled ? "0.03" : "0"
      );
    }
  }
  function initializeAberrationManager(y3k = null) {
    attach(y3k);
    if (!instance) setNebulaNoiseEnabled(false, y3k);
    const history = window.Spicetify?.Platform?.History;
    if (history?.listen) {
      history.listen(() => setTimeout(() => attach(y3k), 0));
    }
    document.addEventListener("spicetify:appchange", () => attach(y3k));
    const observer = new MutationObserver(() => {
      if (!instance) {
        attach(y3k);
        if (!instance) setNebulaNoiseEnabled(false, y3k);
      } else {
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    document.addEventListener("year3000SystemSettingsChanged", (e) => {
      const { key, value } = e.detail || {};
      if (key === "sn-enable-aberration") {
        const enable = value === "true";
        if (enable && !instance) {
          attach(y3k);
        } else if (!enable && instance) {
          instance.destroy();
          instance = null;
          y3k?.unregisterAnimationSystem("AberrationCanvas");
          visualSystem?.destroy();
          visualSystem = null;
          y3k?.performanceAnalyzer?.emitTrace("AberrationCanvasDetached");
        }
        setNebulaNoiseEnabled(enable && !!instance, y3k);
      }
      if (key === "sn-nebula-aberration-strength") {
        const num = parseFloat(value);
        if (!Number.isNaN(num) && instance) {
          instance.setStrength(num);
        }
        y3k?.queueCSSVariableUpdate(
          "--sn-nebula-aberration-strength",
          String(value)
        );
      }
    });
  }

  // src-js/store/UserHistory.ts
  var LS_KEY = "sn_seen_genres_v1";
  var UserGenreHistory = class {
    constructor() {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEY) : null;
      this.seen = new Set(raw ? JSON.parse(raw) : []);
    }
    hasSeen(genre) {
      return this.seen.has(genre.toLowerCase());
    }
    markSeen(genre) {
      const key = genre.toLowerCase();
      if (!this.seen.has(key)) {
        this.seen.add(key);
        this._persist();
      }
    }
    _persist() {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(LS_KEY, JSON.stringify([...this.seen]));
        }
      } catch (_e) {
      }
    }
  };

  // src-js/effects/NebulaController.ts
  function median(values) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      return sorted[mid] ?? 0;
    }
    const lower = sorted[mid - 1] ?? 0;
    const upper = sorted[mid] ?? 0;
    return (lower + upper) / 2;
  }
  var _NebulaController = class _NebulaController {
    constructor(y3k = null, batcher, perf) {
      this.unsubscribers = [];
      this.frameDurations = [];
      // rolling window for medians
      this.enabled = true;
      this.intensitySetting = "balanced";
      this.intensityFactor = 1;
      this.genreHistory = new UserGenreHistory();
      this.activeGlowTimeout = null;
      this.interactionOffHandler = null;
      this.year3000System = y3k;
      if (batcher) {
        this.batcher = batcher;
      } else {
        const sharedBatcher = y3k?.cssVariableBatcher;
        if (sharedBatcher) {
          this.batcher = sharedBatcher;
        } else {
          this.batcher = new CSSVariableBatcher({
            batchIntervalMs: 16,
            maxBatchSize: 40
          });
        }
      }
      this.perf = perf ? perf : y3k?.performanceAnalyzer ?? null;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const capabilityOverall = y3k?.deviceCapabilityDetector?.deviceCapabilities?.overall;
      const settings = y3k?.settingsManager;
      if (settings) {
        this.intensitySetting = settings.get(NEBULA_INTENSITY_KEY) ?? "balanced";
      }
      switch (this.intensitySetting) {
        case "disabled":
          this.enabled = false;
          break;
        case "minimal":
          this.intensityFactor = 0.6;
          break;
        case "balanced":
          this.intensityFactor = 1;
          break;
        case "intense":
          this.intensityFactor = 1.4;
          break;
      }
      if (prefersReducedMotion || capabilityOverall === "low") {
        this.enabled = false;
      }
      if (this.enabled) {
        this._subscribe();
      } else {
        if (typeof document !== "undefined") {
          document.documentElement.style.setProperty(
            "--sn-nebula-beat-intensity",
            "0"
          );
        }
      }
    }
    _subscribe() {
      this.unsubscribers.push(
        GlobalEventBus.subscribe(
          "music:beat",
          (p) => this._handleBeat(p)
        ),
        GlobalEventBus.subscribe(
          "music:genre-change",
          (p) => this._handleGenreChange(p)
        ),
        GlobalEventBus.subscribe(
          "user:scroll",
          (p) => this._handleScroll(p)
        )
      );
    }
    // ---------------------------------------------------------------------------
    // Event Handlers – all lightweight calculations to stay under 2 ms median.
    // ---------------------------------------------------------------------------
    _handleBeat(payload) {
      const t0 = performance.now();
      const safeEnergy = typeof payload.energy === "number" ? payload.energy : 0.5;
      const intensity = (0.8 + Math.min(Math.max(safeEnergy, 0), 1) * 0.6) * this.intensityFactor;
      this._queueVar("--sn-nebula-beat-intensity", intensity.toFixed(3));
      const aberrationStrength = (safeEnergy * 0.6).toFixed(3);
      this._queueVar("--sn-nebula-aberration-strength", aberrationStrength);
      this._recordDuration(t0);
    }
    _handleGenreChange(payload) {
      const t0 = performance.now();
      if (this.genreHistory.hasSeen(payload.genre)) {
        return;
      }
      this.genreHistory.markSeen(payload.genre);
      const cueOpacity = 0.18 * this.intensityFactor;
      this._queueVar("--sn-nebula-layer-0-opacity", cueOpacity.toFixed(3));
      const clearCue = () => {
        if (this.activeGlowTimeout) {
          clearTimeout(this.activeGlowTimeout);
          this.activeGlowTimeout = null;
        }
        this._queueVar("--sn-nebula-layer-0-opacity", "0.05");
        if (this.interactionOffHandler) {
          document.removeEventListener("pointerdown", this.interactionOffHandler);
          document.removeEventListener("keydown", this.interactionOffHandler);
          this.interactionOffHandler = null;
        }
      };
      this.activeGlowTimeout = setTimeout(clearCue, 4e3);
      this.interactionOffHandler = () => clearCue();
      document.addEventListener("pointerdown", this.interactionOffHandler, {
        once: true
      });
      document.addEventListener("keydown", this.interactionOffHandler, {
        once: true
      });
      this._queueVar("--sn-nebula-ease-t", "1");
      this._recordDuration(t0);
    }
    _handleScroll(payload) {
      const t0 = performance.now();
      const safeVel = typeof payload.velocity === "number" ? payload.velocity : 0;
      const vel = Math.min(Math.abs(safeVel), 50);
      const blurBoost = vel / 50 * 2 * this.intensityFactor;
      this._queueVar(
        "--sn-nebula-layer-3-blur",
        `calc(var(--sn-depth-layer-3-blur) + ${blurBoost.toFixed(2)}px)`
      );
      const baseScaleY = 150;
      let clampedVel = Math.max(Math.min(payload.velocity ?? 0, 50), -50);
      const deltaScale = clampedVel / 50 * 50;
      const noiseScale = Math.max(140, Math.min(200, baseScaleY + deltaScale));
      this._queueVar("--sn-nebula-noise-scale-y", `${noiseScale.toFixed(1)}%`);
      this._recordDuration(t0);
    }
    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------
    _queueVar(prop, value) {
      if (!this.enabled) return;
      if (this.year3000System) {
        this.year3000System.queueCSSVariableUpdate(prop, value);
      } else {
        this.batcher.queueCSSVariableUpdate(prop, value);
      }
    }
    _recordDuration(start) {
      const duration = performance.now() - start;
      this.frameDurations.push(duration);
      if (this.frameDurations.length > _NebulaController.FRAME_HISTORY) {
        this.frameDurations.shift();
      }
      if (this.frameDurations.length === _NebulaController.FRAME_HISTORY) {
        const med = median(this.frameDurations);
        if (med > 2) {
          console.warn(
            `[NebulaController] Median scripting cost ${med.toFixed(
              2
            )} ms exceeds 2 ms budget.`
          );
          this._queueVar("--sn-nebula-blend-mode", "screen");
        }
      }
      this.perf?.shouldUpdate("nebulaCtr", 1e3) && this.perf?.endTiming("NebulaController", start);
    }
    destroy() {
      this.unsubscribers.forEach((u) => u());
      this.unsubscribers = [];
    }
  };
  _NebulaController.FRAME_HISTORY = 120;
  var NebulaController = _NebulaController;
  function initializeNebulaController(y3k = null) {
    const g2 = globalThis;
    if (g2.__SN_nebulaController)
      return g2.__SN_nebulaController;
    const instance2 = new NebulaController(y3k);
    g2.__SN_nebulaController = instance2;
    return instance2;
  }

  // src-js/utils/spicetifyReady.ts
  async function waitForSpicetifyReady(timeout = 1e4, checkInterval = 100) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const spicetify = window.Spicetify;
      if (spicetify?.showNotification && spicetify?.Platform) {
        return true;
      }
      await new Promise((res) => setTimeout(res, checkInterval));
    }
    return false;
  }

  // src-js/theme.entry.ts
  async function waitForAPI(apiPath, timeout = 5e3) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const api = apiPath.split(".").reduce((obj, prop) => obj?.[prop], window);
        if (api) return api;
      } catch (e) {
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return null;
  }
  function patchReactRequire() {
    const g2 = globalThis;
    if (g2.__STARLIGHT_REACT_SHIM__) return;
    const shim = (name) => {
      if (name === "react") return g2.Spicetify?.React;
      if (name === "react-dom") return g2.Spicetify?.ReactDOM;
      throw new Error(`[StarryNight shim] Module '${name}' not available`);
    };
    if (typeof g2.require === "function") {
      const original = g2.require.bind(g2);
      g2.require = (name) => {
        if (name === "react" || name === "react-dom") return shim(name);
        return original(name);
      };
    } else {
      g2.require = shim;
    }
    g2.__STARLIGHT_REACT_SHIM__ = true;
  }
  patchReactRequire();
  (async function catppuccinStarryNight() {
    const startTime = Date.now();
    console.log("\u{1F31F} [Catppuccin StarryNight] Theme entry point starting...");
    const spicetifyReady = await waitForSpicetifyReady(1e4);
    if (!spicetifyReady) {
      console.warn(
        "\u{1F31F} [StarryNight] Spicetify not fully ready after 10s \u2013 proceeding with degraded visual-only mode."
      );
    }
    const requiredAPIs = {
      player: await waitForAPI("Spicetify.Player", 3e3),
      platform: await waitForAPI("Spicetify.Platform", 3e3),
      menu: await waitForAPI("Spicetify.Menu", 2e3),
      react: await waitForAPI("Spicetify.React", 2e3),
      reactDOM: await waitForAPI("Spicetify.ReactDOM", 2e3)
    };
    const mainContainer = await waitForAPI(
      'document.querySelector(".main-viewContainer-scrollNode, .main-view-container__scroll-node-child")',
      1e4
    );
    const hasRequiredAPIs = requiredAPIs.player && requiredAPIs.platform && mainContainer;
    const degradedMode = !hasRequiredAPIs;
    if (degradedMode) {
      console.log(
        "\u{1F31F} [StarryNight] Initializing in DEGRADED MODE due to missing APIs"
      );
      console.log("\u{1F31F} [StarryNight] Available APIs:", {
        player: !!requiredAPIs.player,
        platform: !!requiredAPIs.platform,
        menu: !!requiredAPIs.menu,
        react: !!requiredAPIs.react,
        reactDOM: !!requiredAPIs.reactDOM,
        mainContainer: !!mainContainer
      });
    } else {
      console.log(
        "\u{1F31F} [StarryNight] All required APIs available - initializing in FULL MODE"
      );
    }
    const ENABLE_GLOBAL_DEBUGGING = true;
    if (ENABLE_GLOBAL_DEBUGGING) {
      YEAR3000_CONFIG.enableDebug = true;
      Promise.resolve().then(() => (init_DragCartographer(), DragCartographer_exports)).then((m) => {
        m.enableDragCartography?.();
        window.getDragMap = m.getDragMap;
      });
    }
    const year3000System2 = new Year3000System(YEAR3000_CONFIG, HARMONIC_MODES);
    initializeNebulaController(year3000System2);
    initializeAberrationManager(year3000System2);
    Promise.resolve().then(() => (init_EnhancedDragPreview(), EnhancedDragPreview_exports)).then(
      (m) => m.enableEnhancedDragPreview?.()
    );
    Promise.resolve().then(() => (init_QuickAddRadialMenu(), QuickAddRadialMenu_exports)).then(
      (m) => m.enableQuickAddRadialMenu?.()
    );
    try {
      if (degradedMode) {
        await year3000System2.initializeWithAvailableAPIs({
          player: requiredAPIs.player,
          platform: requiredAPIs.platform,
          config: window.Spicetify?.Config,
          degradedMode: true
        });
        console.log(
          "\u{1F31F} [StarryNight] Initialized in degraded mode - visual systems only"
        );
      } else {
        await year3000System2.initializeAllSystems();
        year3000System2.setupMusicAnalysisAndColorExtraction();
        console.log("\u{1F31F} [StarryNight] Full initialization complete");
      }
    } catch (error) {
      console.error("[StarryNight] System initialization failed:", error);
    }
    try {
      if (requiredAPIs.react && requiredAPIs.reactDOM) {
        const settingsUiModule = await Promise.resolve().then(() => (init_StarryNightSettings(), StarryNightSettings_exports));
        await settingsUiModule.initializeStarryNightSettings?.();
        console.log(
          "\u{1F31F} [StarryNight] Spicetify native settings with Year3000System integration initialized"
        );
      } else {
        console.warn(
          "\u{1F31F} [StarryNight] React APIs not available - continuing with CSS-only theme"
        );
      }
    } catch (e) {
      console.error("[StarryNight] Failed to initialize native settings:", e);
      console.warn(
        "\u{1F31F} [StarryNight] Continuing with CSS-only theme (no settings UI)"
      );
    }
    if (YEAR3000_CONFIG.enableDebug) {
      window.Y3K = {
        system: year3000System2,
        // Expose internal modules for easier debugging
        music: year3000System2.musicSyncService,
        settings: year3000System2.settingsManager,
        // Expose the superior, specialized debug tools directly
        debug: Year3000Debug,
        health: year3000System2.systemHealthMonitor,
        // Add degraded mode info
        mode: degradedMode ? "degraded" : "full",
        availableAPIs: requiredAPIs
      };
    }
    const initTime = Date.now() - startTime;
    console.log(
      `\u{1F30C} Catppuccin StarryNight Theme initialized in ${initTime}ms (${degradedMode ? "degraded" : "full"} mode). Welcome to the future of sound!`
    );
  })();
})();
