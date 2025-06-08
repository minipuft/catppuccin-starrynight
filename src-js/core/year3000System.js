import {
  ARTISTIC_MODE_PROFILES,
  HARMONIC_MODES as HARMONIC_MODES_IMPORTED,
  YEAR3000_CONFIG as YEAR3000_CONFIG_IMPORTED,
} from "../config/globalConfig.js";
import { PerformanceMonitor as PerformanceMonitor_IMPORTED } from "../debug/PerformanceMonitor.js";
import {
  applyStarryNightSettings,
  startShootingStars,
} from "../effects/starryNightEffects.js";
import { Card3DManager as Card3DManager_IMPORTED } from "../managers/Card3DManager.js";
import { GlassmorphismManager as GlassmorphismManager_IMPORTED } from "../managers/GlassmorphismManager.js";
import { SettingsManager as SettingsManager_IMPORTED } from "../managers/SettingsManager.js";
import { ColorHarmonyEngine as ColorHarmonyEngine_IMPORTED } from "../systems/ColorHarmonyEngine.js";
import { BeatSyncVisualSystem as BeatSyncVisualSystem_IMPORTED } from "../systems/visual/BeatSyncVisualSystem.js";
import { BehavioralPredictionEngine as BehavioralPredictionEngine_IMPORTED } from "../systems/visual/BehavioralPredictionEngine.js";
import { DataGlyphSystem as DataGlyphSystem_IMPORTED } from "../systems/visual/DataGlyphSystem.js";
import { DimensionalNexusSystem as DimensionalNexusSystem_IMPORTED } from "../systems/visual/DimensionalNexusSystem.js";
import { LightweightParticleSystem as LightweightParticleSystem_IMPORTED } from "../systems/visual/LightweightParticleSystem.js";
import { PredictiveMaterializationSystem as PredictiveMaterializationSystem_IMPORTED } from "../systems/visual/PredictiveMaterializationSystem.js";
import { SidebarConsciousnessSystem as SidebarConsciousnessSystem_IMPORTED } from "../systems/visual/SidebarConsciousnessSystem.js";
import { Year3000Utilities as Year3000Utilities_IMPORTED } from "../utils/Year3000Utilities.js";

// === NEW MODULAR PERFORMANCE SYSTEMS ===
import { CSSVariableBatcher } from "./CSSVariableBatcher.js";
import { DeviceCapabilityDetector } from "./DeviceCapabilityDetector.js";
import { MasterAnimationCoordinator } from "./MasterAnimationCoordinator.js";
import { PerformanceAnalyzer } from "./PerformanceAnalyzer.js";
import { TimerConsolidationSystem } from "./TimerConsolidationSystem.js";

// BaseVisualSystem might not be directly instantiated but used as a base class.
// import { BaseVisualSystem } from '../systems/BaseVisualSystem.js';

import { GenreProfileManager as GenreProfileManager_IMPORTED } from "../services/GenreProfileManager.js";
import { MusicSyncService as MusicSyncService_IMPORTED } from "../services/MusicSyncService.js";

export class Year3000System {
  constructor(
    config = YEAR3000_CONFIG_IMPORTED,
    harmonicModes = HARMONIC_MODES_IMPORTED
  ) {
    // Create deep clone of configuration to prevent shared state mutation
    this.YEAR3000_CONFIG = this._deepCloneConfig(config);

    // Initialize YEAR3000_CONFIG with bound methods for context preservation
    if (typeof this.YEAR3000_CONFIG.init === "function") {
      this.YEAR3000_CONFIG.init();
    }

    this.HARMONIC_MODES = harmonicModes;
    this.utils = Year3000Utilities_IMPORTED;
    this.initialized = false;

    // === MODULAR PERFORMANCE SYSTEMS ===
    this.masterAnimationCoordinator = null;
    this.timerConsolidationSystem = null;
    this.cssVariableBatcher = null;
    this.deviceCapabilityDetector = null;
    this.performanceAnalyzer = null;

    // Initialize component instances to null
    this.performanceMonitor = null;
    this.settingsManager = null;
    this.colorHarmonyEngine = null;
    this.genreProfileManager = null;
    this.musicSyncService = null;
    this.glassmorphismManager = null;
    this.card3DManager = null;

    // Initialize visual systems to null
    this.lightweightParticleSystem = null;
    this.dimensionalNexusSystem = null;
    this.dataGlyphSystem = null;
    this.beatSyncVisualSystem = null;
    this.behavioralPredictionEngine = null;
    this.predictiveMaterializationSystem = null;
    this.sidebarConsciousnessSystem = null;

    // Store initialization results for debugging
    this.initializationResults = null;

    if (this.YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "🌟 [Year3000System] Constructor: Instance created with Master Animation Coordinator"
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
      // Use JSON parse/stringify for deep cloning (handles most cases)
      const cloned = JSON.parse(JSON.stringify(config));

      // Restore ALL functions that were lost in JSON serialization
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
          "🔧 [Year3000System] Configuration cloned with all methods restored"
        );
      }

      return cloned;
    } catch (error) {
      console.error("[Year3000System] Failed to clone configuration:", error);
      return { ...config }; // Fallback to shallow clone
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

    // Update our instance's configuration safely
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

    // Notify systems of configuration change if needed
    this._notifyConfigurationChange(key, value, oldValue);
  }

  /**
   * Notify systems of configuration changes
   * @param {string} key - Configuration key that changed
   * @param {any} newValue - New value
   * @param {any} oldValue - Previous value
   */
  _notifyConfigurationChange(key, newValue, oldValue) {
    // Example: if harmonic settings change, update relevant systems
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
        "🌌 [Year3000System] initializeAllSystems(): Starting full system initialization..."
      );
    }
    const startTime = performance.now();
    const initializationResults = {
      success: [],
      failed: [],
      skipped: [],
    };

    // === MODULAR PERFORMANCE SYSTEMS INITIALIZATION ===
    try {
      this.masterAnimationCoordinator = new MasterAnimationCoordinator(
        this.YEAR3000_CONFIG
      );
      await this.masterAnimationCoordinator.initialize();
      initializationResults.success.push("MasterAnimationCoordinator");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log(
          "🎬 [Year3000System] MasterAnimationCoordinator initialized"
        );
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize MasterAnimationCoordinator:",
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
        console.log("⏱️ [Year3000System] TimerConsolidationSystem initialized");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize TimerConsolidationSystem:",
        error
      );
      initializationResults.failed.push("TimerConsolidationSystem");
    }

    try {
      this.cssVariableBatcher = new CSSVariableBatcher(this.YEAR3000_CONFIG);
      initializationResults.success.push("CSSVariableBatcher");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("🎨 [Year3000System] CSSVariableBatcher initialized");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize CSSVariableBatcher:",
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
        console.log("🔍 [Year3000System] DeviceCapabilityDetector initialized");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize DeviceCapabilityDetector:",
        error
      );
      initializationResults.failed.push("DeviceCapabilityDetector");
    }

    try {
      this.performanceAnalyzer = new PerformanceAnalyzer(this.YEAR3000_CONFIG);
      initializationResults.success.push("PerformanceAnalyzer");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("📊 [Year3000System] PerformanceAnalyzer initialized");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize PerformanceAnalyzer:",
        error
      );
      initializationResults.failed.push("PerformanceAnalyzer");
    }

    // Tier 1: Core managers (few to no dependencies on other custom classes yet)
    try {
      this.performanceMonitor = new PerformanceMonitor_IMPORTED();
      initializationResults.success.push("PerformanceMonitor");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("🌌 [Year3000System] PerformanceMonitor instantiated.");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize PerformanceMonitor:",
        error
      );
      initializationResults.failed.push("PerformanceMonitor");
    }

    try {
      this.settingsManager = new SettingsManager_IMPORTED(
        this.YEAR3000_CONFIG,
        this.HARMONIC_MODES,
        this.utils
      );
      // await this.settingsManager.loadSettings(); // Load settings early if others depend on them immediately
      initializationResults.success.push("SettingsManager");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("🌌 [Year3000System] SettingsManager instantiated.");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize SettingsManager:",
        error
      );
      initializationResults.failed.push("SettingsManager");
    }

    try {
      this.genreProfileManager = new GenreProfileManager_IMPORTED({
        YEAR3000_CONFIG: this.YEAR3000_CONFIG,
      });
      initializationResults.success.push("GenreProfileManager");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("🌌 [Year3000System] GenreProfileManager instantiated.");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize GenreProfileManager:",
        error
      );
      initializationResults.failed.push("GenreProfileManager");
    }

    try {
      this.colorHarmonyEngine = new ColorHarmonyEngine_IMPORTED(
        this.YEAR3000_CONFIG,
        this.utils
      );
      initializationResults.success.push("ColorHarmonyEngine");
      if (this.YEAR3000_CONFIG.enableDebug)
        console.log("🌌 [Year3000System] ColorHarmonyEngine instantiated.");
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize ColorHarmonyEngine:",
        error
      );
      initializationResults.failed.push("ColorHarmonyEngine");
    }

    // BMPHarmonyEngine functionality now consolidated into MusicSyncService
    // Will be initialized in Tier 3

    // Tier 2: Managers dependent on Tier 1
    if (this.performanceMonitor && this.settingsManager) {
      try {
        this.glassmorphismManager = new GlassmorphismManager_IMPORTED(
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
            "🌌 [Year3000System] GlassmorphismManager instantiated and initialized."
          );
      } catch (error) {
        console.error(
          "❌ [Year3000System] Failed to initialize GlassmorphismManager:",
          error
        );
        initializationResults.failed.push("GlassmorphismManager");
      }

      try {
        this.card3DManager = new Card3DManager_IMPORTED(
          this.performanceMonitor,
          this.settingsManager,
          this.utils
        );
        await this.card3DManager.initialize();
        initializationResults.success.push("Card3DManager");
        if (this.YEAR3000_CONFIG.enableDebug)
          console.log("🌌 [Year3000System] Card3DManager initialized.");
      } catch (error) {
        console.error(
          "❌ [Year3000System] Failed to initialize Card3DManager:",
          error
        );
        initializationResults.failed.push("Card3DManager");
      }
    } else {
      console.error(
        "🌌 [Year3000System] Critical dependency missing for GlassmorphismManager or Card3DManager (PerformanceMonitor or SettingsManager)."
      );
      initializationResults.skipped.push(
        "GlassmorphismManager",
        "Card3DManager"
      );
    }

    // Tier 3: Unified Music Sync Service
    // MusicSyncService consolidates BMPHarmonyEngine and MusicAnalysisService functionality
    try {
      this.musicSyncService = new MusicSyncService_IMPORTED({
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
          "🌌 [Year3000System] MusicSyncService initialized (consolidated music functionality)."
        );
    } catch (error) {
      console.error(
        "❌ [Year3000System] Failed to initialize MusicSyncService:",
        error
      );
      initializationResults.failed.push("MusicSyncService");
    }

    // Tier 4: Visual Systems
    // These systems often depend on config, utils, and might subscribe to MusicAnalysisService.
    // They extend BaseVisualSystem, which handles some common setup.
    // BaseVisualSystem itself is not instantiated directly here but used as a superclass.

    // Consolidate dependencies for all visual systems for clarity and consistency
    const visualSystemDependencies = [
      this.YEAR3000_CONFIG,
      this.utils,
      this.performanceMonitor,
      this.musicSyncService, // Updated to use unified MusicSyncService
      this.settingsManager, // Correctly pass the settingsManager instance
      this, // Pass year3000System instance for Master Animation Coordinator access
    ];

    // Initialize each visual system with error isolation
    const visualSystems = [
      {
        name: "LightweightParticleSystem",
        Class: LightweightParticleSystem_IMPORTED,
        property: "lightweightParticleSystem",
      },
      {
        name: "DimensionalNexusSystem",
        Class: DimensionalNexusSystem_IMPORTED,
        property: "dimensionalNexusSystem",
      },
      {
        name: "DataGlyphSystem",
        Class: DataGlyphSystem_IMPORTED,
        property: "dataGlyphSystem",
      },
      {
        name: "BeatSyncVisualSystem",
        Class: BeatSyncVisualSystem_IMPORTED,
        property: "beatSyncVisualSystem",
      },
      {
        name: "BehavioralPredictionEngine",
        Class: BehavioralPredictionEngine_IMPORTED,
        property: "behavioralPredictionEngine",
      },
      {
        name: "PredictiveMaterializationSystem",
        Class: PredictiveMaterializationSystem_IMPORTED,
        property: "predictiveMaterializationSystem",
      },
      {
        name: "SidebarConsciousnessSystem",
        Class: SidebarConsciousnessSystem_IMPORTED,
        property: "sidebarConsciousnessSystem",
      },
    ];

    for (const systemConfig of visualSystems) {
      try {
        // Check if required dependencies are available
        if (!this.YEAR3000_CONFIG || !this.utils) {
          console.warn(
            `⚠️ [Year3000System] Skipping ${systemConfig.name} - missing core dependencies`
          );
          initializationResults.skipped.push(systemConfig.name);
          continue;
        }

        // Validate DOM elements that systems might need
        if (
          systemConfig.name === "SidebarConsciousnessSystem" &&
          !document.querySelector(".Root__nav-bar")
        ) {
          console.warn(
            `⚠️ [Year3000System] Skipping ${systemConfig.name} - required DOM element .Root__nav-bar not found`
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
          console.log(`🌌 [Year3000System] ${systemConfig.name} initialized.`);
      } catch (error) {
        console.error(
          `❌ [Year3000System] Failed to initialize ${systemConfig.name}:`,
          error
        );
        initializationResults.failed.push(systemConfig.name);
        // Set property to null to indicate failed initialization
        this[systemConfig.property] = null;
      }
    }

    // Report initialization results
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
        `🌌 [Year3000System] initializeAllSystems() completed in ${(
          endTime - startTime
        ).toFixed(2)}ms.`
      );
      console.log(`📊 [Year3000System] Initialization Results:`);
      console.log(
        `  ✅ Success: ${initializationResults.success.length} (${successRate}%)`
      );
      console.log(`  ❌ Failed: ${initializationResults.failed.length}`);
      console.log(`  ⏭️ Skipped: ${initializationResults.skipped.length}`);

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

    // Store initialization results for debugging
    this.initializationResults = initializationResults;

    // Phase 4: System Health Validation & Recovery
    try {
      const healthReport = await this._validateSystemHealth();

      if (healthReport.criticalErrors.length > 0) {
        console.error(
          "🚨 [Year3000System] Critical system health issues detected:",
          healthReport.criticalErrors
        );

        // Attempt to retry failed critical systems
        for (const systemName of healthReport.unhealthySystems) {
          const retrySuccess = await this._retryFailedSystemInitialization(
            systemName
          );
          if (retrySuccess) {
            // Update results
            const index = initializationResults.failed.indexOf(systemName);
            if (index > -1) {
              initializationResults.failed.splice(index, 1);
              initializationResults.success.push(`${systemName} (retry)`);
            }
          }
        }

        // Re-calculate final success rate
        const finalSuccessRate =
          (initializationResults.success.length /
            (initializationResults.success.length +
              initializationResults.failed.length)) *
          100;
        console.log(
          `📊 [Year3000System] Final initialization success rate: ${finalSuccessRate.toFixed(
            1
          )}%`
        );

        if (finalSuccessRate < 95) {
          console.warn(
            "⚠️ [Year3000System] Success rate below target (95%), investigation recommended"
          );
        }
      } else {
        console.log(
          `💚 [Year3000System] All systems healthy - ${healthReport.healthySystems}/${healthReport.totalSystems} systems operational`
        );
      }

      // Update stored results after health validation
      this.initializationResults = initializationResults;

      // Phase 5: Performance Monitoring Setup
      this._addPerformanceMonitoring();
    } catch (healthError) {
      console.error(
        "❌ [Year3000System] Error during health validation:",
        healthError
      );
    }

    // Apply saved settings only if we have a settings manager
    if (this.settingsManager) {
      try {
        await this.applyInitialSettings();
      } catch (error) {
        console.error(
          "❌ [Year3000System] Failed to apply initial settings:",
          error
        );
      }
    } else {
      console.warn(
        "⚠️ [Year3000System] SettingsManager not available - skipping initial settings application"
      );
    }

    // ✅ PHASE 5: Calculate final success rate for monitoring activation
    const finalSuccessRate =
      (initializationResults.success.length /
        (initializationResults.success.length +
          initializationResults.failed.length)) *
      100;

    // ✅ PHASE 5: Start proactive health monitoring after successful initialization
    if (initializationResults.success.length > 0 && finalSuccessRate >= 95) {
      this.startProactiveHealthMonitoring();

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `🔄 [Year3000System] Phase 5 monitoring activated for system maintenance (${finalSuccessRate.toFixed(
            1
          )}% success rate)`
        );
      }
    } else if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        `⚠️ [Year3000System] Phase 5 monitoring not activated - success rate ${finalSuccessRate.toFixed(
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

    // Define systems to check with their criticality
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
      { name: "settingsManager", critical: true, property: "settingsManager" },
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

        // Additional health checks for specific systems
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
      console.log("🔍 [Year3000System] Health validation completed:", {
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
          `🔄 [Year3000System] Retry attempt ${attempt}/${maxRetries} for ${failedSystemName}`
        );

        // System-specific retry logic
        switch (failedSystemName) {
          case "sidebarConsciousnessSystem":
            if (!this.sidebarConsciousnessSystem) {
              const SidebarConsciousnessSystem_IMPORTED = (
                await import("../systems/visual/SidebarConsciousnessSystem.js")
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
                await import("../systems/ColorHarmonyEngine.js")
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
              const { MusicSyncService } = await import(
                "../services/MusicSyncService.js"
              );
              this.musicSyncService = new MusicSyncService({
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
              `🔄 [Year3000System] No retry logic defined for ${failedSystemName}`
            );
            return false;
        }

        console.log(
          `✅ [Year3000System] Successfully retried ${failedSystemName}`
        );
        return true;
      } catch (error) {
        console.warn(
          `⚠️ [Year3000System] Retry ${attempt} failed for ${failedSystemName}:`,
          error
        );
        if (attempt === maxRetries) {
          console.error(
            `❌ [Year3000System] All retries exhausted for ${failedSystemName}`
          );
          return false;
        }

        // Wait before next retry (exponential backoff)
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

    // Monitor YEAR3000_CONFIG method calls
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

            // Log if method takes >10ms (potential performance issue)
            if (duration > 10 && this.YEAR3000_CONFIG.enableDebug) {
              console.warn(
                `⚠️ [PerformanceMonitor] ${methodName} took ${duration.toFixed(
                  2
                )}ms`
              );
            }

            return result;
          } catch (error) {
            const duration = performance.now() - startTime;
            console.error(
              `❌ [PerformanceMonitor] ${methodName} failed after ${duration.toFixed(
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
        "📊 [Year3000System] Performance monitoring enabled for YEAR3000_CONFIG methods"
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
        "🔧 [Year3000System] applyInitialSettings(): Applying saved theme settings..."
      );
    }

    if (!this.settingsManager) {
      console.warn(
        "[Year3000System] applyInitialSettings(): SettingsManager not available"
      );
      return;
    }

    try {
      // 1. Apply Catppuccin accent color
      const selectedAccent =
        this.settingsManager.get("catppuccin-accentColor") || "mauve";
      await this._applyCatppuccinAccent(selectedAccent);

      // 2. Apply StarryNight gradient and star settings
      const gradientIntensity =
        this.settingsManager.get("sn-gradientIntensity") || "balanced";
      const starDensity =
        this.settingsManager.get("sn-starDensity") || "balanced";
      await this._applyStarryNightSettings(gradientIntensity, starDensity);

      // 3. Apply glassmorphism settings
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

      // 4. Apply 3D morphing settings
      const morphing3DMode =
        this.settingsManager.get("sn-3dMorphingMode") || "dynamic";
      if (this.card3DManager && this.card3DManager.apply3DMode) {
        this.card3DManager.apply3DMode(morphing3DMode);
      }

      // 5. Initialize artistic mode with full Year 3000 system configuration
      const artisticMode =
        this.settingsManager.get("sn-artisticMode") || "artist-vision";

      // Validate config before attempting artistic mode initialization
      if (!this._validateConfigInitialization()) {
        console.warn(
          "🎨 [Year3000System] Skipping artistic mode initialization due to config issues"
        );
        // Set mode directly as fallback
        this.YEAR3000_CONFIG.artisticMode = artisticMode;
      } else {
        await this.initializeArtisticMode(artisticMode);
      }

      // Also trigger color update like the UI does
      if (this.updateColorsFromCurrentTrack) {
        this.updateColorsFromCurrentTrack();
      }

      // 6. Apply harmonic system settings
      const currentHarmonicMode =
        this.settingsManager.get("sn-currentHarmonicMode") || "analogous-flow";
      const harmonicIntensity = parseFloat(
        this.settingsManager.get("sn-harmonicIntensity") || "0.7"
      );
      const harmonicEvolution =
        (this.settingsManager.get("sn-harmonicEvolution") || "true") === "true";

      // Use safe configuration update method instead of direct mutation
      this.updateConfiguration("currentHarmonicMode", currentHarmonicMode);
      this.updateConfiguration("harmonicIntensity", harmonicIntensity);
      this.updateConfiguration("harmonicEvolution", harmonicEvolution);

      // 7. Apply manual base color if set
      const manualBaseColor =
        this.settingsManager.get("sn-harmonicManualBaseColor") || "";
      if (manualBaseColor && this.updateHarmonicBaseColor) {
        this.updateHarmonicBaseColor(manualBaseColor);
      }

      // 8. Update harmonic mode display in sidebar if available
      if (
        this.sidebarConsciousnessSystem &&
        this.sidebarConsciousnessSystem.updateHarmonicModeDisplay
      ) {
        this.sidebarConsciousnessSystem.updateHarmonicModeDisplay(
          currentHarmonicMode
        );
      }

      // 9. Initialize performance quality setting
      const performanceQuality =
        this.settingsManager.get("sn-performanceQuality") || "auto";
      // Performance quality is mainly for future use, just log it for now
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `🔧 [Year3000System] Performance quality loaded: ${performanceQuality}`
        );
      }

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "✅ [Year3000System] applyInitialSettings(): All saved settings applied successfully"
        );
      }
    } catch (error) {
      console.error(
        "❌ [Year3000System] applyInitialSettings(): Error applying settings:",
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
            ? undefined
            : `var(--spice-${selectedAccent})`,
        "--spice-button-active":
          selectedAccent === "none"
            ? undefined
            : `var(--spice-${selectedAccent})`,
        "--spice-equalizer": document.querySelector(
          "body > script.marketplaceScript"
        )
          ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')`
          : `url('${colorScheme}/equalizer-animated-${accent}.gif')`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        if (value === undefined || value.includes("none")) {
          document.documentElement.style.removeProperty(property);
        } else {
          document.documentElement.style.setProperty(property, value);
        }
      });

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `🎨 [Year3000System] Applied Catppuccin accent: ${selectedAccent}`
        );
      }
    } catch (error) {
      console.error(
        "❌ [Year3000System] Error applying Catppuccin accent:",
        error
      );
    }
  }

  /**
   * Apply StarryNight gradient and star settings
   */
  async _applyStarryNightSettings(gradientIntensity, starDensity) {
    try {
      // Use the directly imported function
      applyStarryNightSettings(gradientIntensity, starDensity);

      // Also start shooting stars if star density is not disabled
      if (starDensity !== "disabled") {
        // Delay shooting stars start to ensure container is ready
        setTimeout(() => {
          startShootingStars();
        }, 500);
      }

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          `🌟 [Year3000System] Applied StarryNight settings - Gradient: ${gradientIntensity}, Stars: ${starDensity}`
        );
      }
    } catch (error) {
      console.error(
        "❌ [Year3000System] Error applying StarryNight settings:",
        error
      );
      // Fallback to manual application
      this._manuallyApplyStarryNightSettings(gradientIntensity, starDensity);
    }
  }

  /**
   * Manual application of starry night settings if the main function isn't available
   */
  _manuallyApplyStarryNightSettings(gradientIntensity, starDensity) {
    // Apply gradient intensity
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

    // Apply star density (simplified)
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
      console.log("🌌 [Year3000System] destroyAllSystems(): Cleaning up...");
    }

    // ✅ PHASE 5: Stop proactive health monitoring
    this.stopProactiveHealthMonitoring();

    // === DESTROY MODULAR PERFORMANCE SYSTEMS ===
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
        if (system.instance && typeof system.instance.destroy === "function") {
          await system.instance.destroy();
          destroyResults.success.push(system.name);
          if (this.YEAR3000_CONFIG.enableDebug)
            console.log(`🌌 [Year3000System] ${system.name} destroyed.`);
        } else {
          destroyResults.skipped.push(system.name);
        }
      } catch (error) {
        console.error(
          `❌ [Year3000System] Failed to destroy ${system.name}:`,
          error
        );
        destroyResults.failed.push(system.name);
      }
    }

    // Clear references
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

    // Remove event listeners first to prevent memory leaks
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
        "❌ [Year3000System] Failed to remove Spicetify event listeners:",
        error
      );
      destroyResults.failed.push("Spicetify songchange listener");
    }

    // Destroy all visual systems
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
      { name: "DimensionalNexusSystem", instance: this.dimensionalNexusSystem },
      {
        name: "LightweightParticleSystem",
        instance: this.lightweightParticleSystem,
      },
    ];

    for (const system of visualSystems) {
      try {
        if (system.instance && typeof system.instance.destroy === "function") {
          system.instance.destroy();
          destroyResults.success.push(system.name);
          if (this.YEAR3000_CONFIG.enableDebug)
            console.log(`🌌 [Year3000System] ${system.name} destroyed.`);
        } else {
          destroyResults.skipped.push(system.name);
        }
      } catch (error) {
        console.error(
          `❌ [Year3000System] Failed to destroy ${system.name}:`,
          error
        );
        destroyResults.failed.push(system.name);
      }
    }

    // Destroy managers and services
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
            console.log(`🌌 [Year3000System] ${manager.name} destroyed.`);
        } else {
          destroyResults.skipped.push(manager.name);
        }
      } catch (error) {
        console.error(
          `❌ [Year3000System] Failed to destroy ${manager.name}:`,
          error
        );
        destroyResults.failed.push(manager.name);
      }
    }

    // Clear all references
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
      console.log(`📊 [Year3000System] Destruction Results:`);
      console.log(`  ✅ Success: ${destroyResults.success.length}`);
      console.log(`  ❌ Failed: ${destroyResults.failed.length}`);
      console.log(`  ⏭️ Skipped: ${destroyResults.skipped.length}`);

      if (destroyResults.failed.length > 0) {
        console.log(`  Failed components: ${destroyResults.failed.join(", ")}`);
      }

      console.log("🌌 [Year3000System] All systems destroyed.");
    }
  }

  // --- Placeholder for Core System Methods ---

  applyColorsToTheme(extractedColors = {}) {
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "🎨 [Year3000System] applyColorsToTheme() called with extracted colors:",
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
    const defaultRgb = { r: 0, g: 0, b: 0 }; // Fallback for oklab conversion if hexToRgb fails

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

    // Get music context from MusicAnalysisService
    let musicContext = {};
    const latestMusicData = this.musicAnalysisService?.getLatestProcessedData();
    if (this.YEAR3000_CONFIG.enableMusicAnalysis && latestMusicData) {
      musicContext = {
        musicEnergy: latestMusicData.processedEnergy, // Ensure field names match service output
        moodIdentifier: latestMusicData.moodIdentifier, // Ensure field names match service output
        visualIntensity: latestMusicData.visualIntensity, // Ensure field names match service output
      };
      // Optional: Log the retrieved music context for debugging
      // if (this.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) { // Sparse log
      //     console.log('[Year3000System applyColorsToTheme] Using music context from service:', musicContext);
      // }
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

    // Set main gradient colors (hex and RGB)
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
    rootElement.style.setProperty("--sn-gradient-secondary", finalSecondaryHex);
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

    // Set derived OKLab properties and processed RGB as CSS variables
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

    // Call helper methods to set other essential CSS variables
    this._setSpiceRgbVariables(); // Sets base theme --spice-rgb-* variables
    this._setGradientParameters(); // Sets --sn-gradient-opacity, saturation, etc.

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "🎨 [Year3000System applyColorsToTheme] Completed applying colors and parameters."
      );
    }
  }

  async updateColorsFromCurrentTrack() {
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🔄 [Year3000System] updateColorsFromCurrentTrack() called.");
    }
    let originalExtractedColors = null;
    try {
      // Use our enhanced track data retrieval with retry logic
      const track = await this.waitForTrackData(5, 50); // Shorter retry for color extraction
      if (!track?.uri) {
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[Year3000System updateColorsFromCurrentTrack] No track URI after retry attempts, applying defaults via applyColorsToTheme."
          );
        }
        this.applyColorsToTheme({}); // Apply defaults or Catppuccin base
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
      originalExtractedColors = {}; // Ensure it's an object for fallback logic
    }

    let colorsToApply = {
      ...(originalExtractedColors || {}),
    };

    const harmonicMode = this.YEAR3000_CONFIG.currentHarmonicMode;
    const evolveHarmonies = this.YEAR3000_CONFIG.harmonicEvolution;
    const manualBaseOverride = this.YEAR3000_CONFIG.harmonicBaseColor;
    const defaults = this.YEAR3000_CONFIG.catppuccinDefaults || {};

    if (harmonicMode && harmonicMode !== "none") {
      // Assuming 'none' or similar means skip evolution
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
        `🎶 [Year3000System] evolveHarmonicSignature(${selectedModeKey}, ${baseSourceHex}) called.`
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
      return null; // Cannot proceed
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
      console.log("🎶 [Year3000System] evolveHarmonicSignature() produced:", {
        derivedDarkVibrantHex: darkVibrantHex,
        derivedLightVibrantHex: lightVibrantHex,
      });
    }

    return {
      derivedDarkVibrantHex: darkVibrantHex,
      derivedLightVibrantHex: lightVibrantHex,
    };
  }

  // Enhanced helper method inspired by Cat Jam extension for reliable track data retrieval
  async waitForTrackData(maxRetries = 10, delayMs = 100) {
    for (let i = 0; i < maxRetries; i++) {
      // Check multiple data sources like successful extensions do
      const track =
        Spicetify.Player.data?.item ||
        Spicetify.Player.data?.track ||
        Spicetify.Player.state?.track ||
        Spicetify.Queue?.track;

      if (track?.uri) {
        if (this.YEAR3000_CONFIG.enableDebug) {
          console.log(
            `🎧 [Year3000System] Track data retrieved on attempt ${i + 1}:`,
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
        `🎧 [Year3000System] Failed to retrieve track data after ${maxRetries} attempts`
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
      surface0: getColorVal("--spice-surface0") || getColorVal("--surface0"), // Catppuccin standard with fallback
      surface1: getColorVal("--spice-surface1") || getColorVal("--surface1"), // Catppuccin standard with fallback
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
            rootElement.style.setProperty(cssVar, `${rgb.r},${rgb.g},${rgb.b}`);
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
        "🎨 [Year3000System _setSpiceRgbVariables] Completed setting spice RGB variables."
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

    // Get latest music data from the service
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
      let musicMultiplier = 1.0;
      try {
        // Fixed path to getMusicIntensityMultiplier (now a class method)
        if (
          this.colorHarmonyEngine?.getMusicIntensityMultiplier &&
          typeof this.colorHarmonyEngine.getMusicIntensityMultiplier ===
            "function"
        ) {
          musicMultiplier = this.colorHarmonyEngine.getMusicIntensityMultiplier(
            musicData.energy || 0.5,
            musicData.valence || 0.5
          );
        } else {
          if (this.YEAR3000_CONFIG.enableDebug) {
            console.warn(
              "[Year3000System _setGradientParameters] getMusicIntensityMultiplier not available on colorHarmonyEngine. Using fallback logic."
            );
          }
          const baseBoost = multipliers.musicEnergyBoost || 1.0;
          musicMultiplier = baseBoost * (1 + (musicData.energy - 0.5) * 0.5);
          musicMultiplier = Math.max(0.5, Math.min(2.0, musicMultiplier));
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
        `🎨 [Year3000System _setGradientParameters] Applied ${artisticMode.toUpperCase()} gradient parameters:`,
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
        `🎨 [Year3000System] updateHarmonicBaseColor("${hexColor}") called.`
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
      // Trigger an update to re-evaluate colors with the new base
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
        "🎧 [Year3000System setupMusicAnalysisAndColorExtraction] Setting up music analysis and color extraction..."
      );
    }

    // Enhanced track-based processing function (inspired by Cat Jam's approach)
    const processSongUpdate = async () => {
      if (this.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
        // Sparse logging to reduce console flooding
        console.log(
          "🎧 [Year3000System processSongUpdate] Processing song update..."
        );
      }

      // Enhanced track data retrieval with retry logic (inspired by Cat Jam)
      const track = await this.waitForTrackData();
      const currentTrackUri = track?.uri;
      const trackDurationMs = track?.duration?.milliseconds || 0;

      // 1. Always attempt to update colors if enabled.
      if (this.YEAR3000_CONFIG.enableColorExtraction) {
        try {
          await this.updateColorsFromCurrentTrack();
        } catch (e) {
          console.error(
            `🎨 [Year3000System processSongUpdate] Error during color update: ${
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

      // 2. Process music analysis ONLY if a track URI is available and other conditions are met.
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
          // All clear to attempt fetching realistic audio data
          try {
            if (this.YEAR3000_CONFIG.enableDebug) {
              console.log(
                "[Year3000System processSongUpdate] Attempting to fetch realistic audio data for URI:",
                currentTrackUri
              );
            }

            // Get audio analysis data (this is what Spicetify actually provides)
            const audioAnalysisData = await Spicetify.getAudioData(
              currentTrackUri
            );

            if (this.YEAR3000_CONFIG.enableDebug) {
              const trackInfo = audioAnalysisData?.track;
              if (trackInfo && typeof trackInfo.tempo !== "undefined") {
                console.log(
                  `🎵 [Year3000System] Audio analysis retrieved - Tempo: ${trackInfo.tempo}BPM, Loudness: ${trackInfo.loudness}dB`
                );
              } else {
                console.warn(
                  `🎵 [Year3000System] Audio analysis data not available or incomplete for track URI: ${currentTrackUri}. This can happen for new or less popular songs. The system will use fallbacks.`
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
              `🎧 [Year3000System processSongUpdate] Error fetching/processing realistic audio data: ${
                e.message || e
              }`,
              e
            );

            // Try fallback processing with no audio data
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
      // Store handler reference for cleanup
      this._songChangeHandler = processSongUpdate;
      Spicetify.Player.addEventListener("songchange", this._songChangeHandler);
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "🎧 [Year3000System setupMusicAnalysisAndColorExtraction] Added songchange listener."
        );
      }
      // Initial call with delay to allow Spotify to initialize
      setTimeout(processSongUpdate, 500);
    } else {
      console.error(
        "🎧 [Year3000System setupMusicAnalysisAndColorExtraction] Spicetify.Player not available. Cannot set up song change listener."
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
        `🎨 [Year3000System] Initializing artistic mode: ${targetMode}`
      );
    }

    // Validate config before attempting operations
    if (!this._validateConfigInitialization()) {
      console.warn(
        `🎨 [Year3000System] Config not properly initialized - using fallback for mode: ${targetMode}`
      );
      // Fallback: directly set mode without method call
      this.YEAR3000_CONFIG.artisticMode = targetMode;
      return false;
    }

    // Validate mode exists in profiles
    if (!ARTISTIC_MODE_PROFILES[targetMode]) {
      console.warn(
        `🎨 [Year3000System] Invalid artistic mode: ${targetMode}. Falling back to artist-vision`
      );
      await this.initializeArtisticMode("artist-vision");
      return;
    }

    const modeProfile = ARTISTIC_MODE_PROFILES[targetMode];

    // Update config with new mode - add error handling
    try {
      const result = this.YEAR3000_CONFIG.setArtisticMode(targetMode);
      if (!result) {
        console.warn(
          `🎨 [Year3000System] setArtisticMode returned false for mode: ${targetMode}`
        );
        // Still continue with the rest of the initialization
      }
    } catch (error) {
      console.error(
        `🎨 [Year3000System] Error calling setArtisticMode for ${targetMode}:`,
        error
      );
      // Fallback: directly set mode
      this.YEAR3000_CONFIG.artisticMode = targetMode;
    }

    // Apply mode to all systems
    await this.applyModeToAllSystems(modeProfile);

    // Set CSS variables for mode-specific parameters
    this.setModeSpecificCSSVariables(modeProfile);

    // Dispatch event for systems to respond
    if (typeof document !== "undefined") {
      document.dispatchEvent(
        new CustomEvent("year3000ArtisticModeInitialized", {
          detail: { mode: targetMode, profile: modeProfile },
        })
      );
    }

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        `✅ [Year3000System] Artistic mode initialized: ${targetMode}`
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
        `🎨 [Year3000System] Cannot switch to invalid mode: ${newMode}`
      );
      return false;
    }

    const previousMode = this.YEAR3000_CONFIG.artisticMode;

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        `🎨 [Year3000System] Switching artistic mode: ${previousMode} → ${newMode}`
      );
    }

    try {
      // Store previous mode for potential rollback
      const previousProfile = this.getCurrentModeProfile();

      // Update settings manager
      if (this.settingsManager) {
        this.settingsManager.set("sn-artisticMode", newMode);
      }

      // Initialize new mode
      await this.initializeArtisticMode(newMode);

      // Trigger color update to reflect new mode
      if (this.updateColorsFromCurrentTrack) {
        await this.updateColorsFromCurrentTrack();
      }

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(`✅ [Year3000System] Successfully switched to: ${newMode}`);
      }

      return true;
    } catch (error) {
      console.error(
        `❌ [Year3000System] Error switching to mode ${newMode}:`,
        error
      );

      // Attempt to rollback to previous mode
      try {
        await this.initializeArtisticMode(previousMode);
      } catch (rollbackError) {
        console.error(
          `❌ [Year3000System] Failed to rollback to ${previousMode}:`,
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
    const { features, performance, multipliers } = modeProfile;

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        `🎨 [Year3000System] Applying mode to all systems:`,
        features
      );
    }

    try {
      // Configure glassmorphism manager
      if (this.glassmorphismManager && features.glassEffects) {
        const glassIntensity =
          features.glassEffects === true ? "moderate" : "disabled";
        this.glassmorphismManager.applyGlassmorphismSettings(glassIntensity);
      }

      // Configure 3D card manager
      if (this.card3DManager && features.dimensionalEffects) {
        const morphingMode =
          features.dimensionalEffects === true ? "balanced" : "disabled";
        this.card3DManager.apply3DMode(morphingMode);
      }

      // Configure particle system
      if (this.lightweightParticleSystem) {
        if (this.lightweightParticleSystem.updateModeConfiguration) {
          this.lightweightParticleSystem.updateModeConfiguration({
            maxParticles: performance.maxParticles,
            enabled: features.particleStreams,
            intensity: multipliers.kineticIntensity,
          });
        }
      }

      // Configure beat sync system
      if (this.beatSyncVisualSystem) {
        if (this.beatSyncVisualSystem.updateModeConfiguration) {
          this.beatSyncVisualSystem.updateModeConfiguration({
            enabled: features.beatSync,
            intensity: multipliers.musicEnergyBoost,
            throttle: performance.animationThrottle,
          });
        }
      }

      // Configure data glyph system
      if (this.dataGlyphSystem) {
        if (this.dataGlyphSystem.updateModeConfiguration) {
          this.dataGlyphSystem.updateModeConfiguration({
            enabled: features.dataGlyphs,
            animations: features.temporalEcho,
            intensity: multipliers.kineticIntensity,
          });
        }
      }

      // Configure behavioral prediction engine
      if (this.behavioralPredictionEngine) {
        if (this.behavioralPredictionEngine.updateModeConfiguration) {
          this.behavioralPredictionEngine.updateModeConfiguration({
            enabled: features.predictiveHighlights,
            empathyLevel: multipliers.quantumEmpathyLevel,
            intensity: multipliers.temporalPlayFactor,
          });
        }
      }

      // Configure dimensional nexus system
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

      // Update gradient parameters with new multipliers
      this._setGradientParameters();
    } catch (error) {
      console.error(
        `❌ [Year3000System] Error applying mode to systems:`,
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

    // Set Year 3000 kinetic CSS variables
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

    // Set feature flags as CSS variables (0 or 1)
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

    // Set emergent choreography flag
    root.style.setProperty(
      "--sn-emergent-choreography",
      multipliers.emergentChoreography ? "1" : "0"
    );

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        `🎨 [Year3000System] Mode-specific CSS variables set for:`,
        this.YEAR3000_CONFIG.artisticMode
      );
    }
  }

  setupEventListeners() {}

  getSystemReport() {
    // ✅ PHASE 5: Comprehensive System Intelligence Dashboard
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "📊 [Year3000System] Generating comprehensive system report..."
      );
    }

    const reportTimestamp = new Date().toISOString();
    const report = {
      // === SYSTEM IDENTIFICATION ===
      timestamp: reportTimestamp,
      version: "3000.5.0", // Phase 5 version
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
      console.log("📊 [Year3000System] System report generated:", {
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
      lastChecked: new Date().toISOString(),
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
      overallScore: 0, // Will be calculated
    };

    // Calculate overall performance score
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
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        timestamp: new Date().toISOString(),
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

    // Performance recommendations
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

    // Health recommendations
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

    // Error pattern recommendations
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

    // Feature recommendations
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

    return totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 100;
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
    // Implementation would track health over time
    // For now, return placeholder
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
      console.log("🔄 [Year3000System] resetToDefaults() called.");
    }

    // 1. Reset all settings to their schema defaults
    if (
      this.settingsManager &&
      typeof this.settingsManager.resetAllToDefaults === "function"
    ) {
      this.settingsManager.resetAllToDefaults();
      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log(
          "🔄 [Year3000System] All settings have been reset to defaults by SettingsManager."
        );
      }
    } else {
      console.warn(
        "🔄 [Year3000System] settingsManager.resetAllToDefaults() not available."
      );
    }

    // 2. Apply the base Catppuccin theme colors
    // Assuming catppuccinDefaults is part of YEAR3000_CONFIG and contains the color structure expected by applyColorsToTheme
    // e.g., { VIBRANT: '#hex', DARK_VIBRANT: '#hex', ... } or just an empty object to trigger internal fallbacks
    const defaultColors = this.YEAR3000_CONFIG.catppuccinDefaults || {};
    this.applyColorsToTheme(defaultColors);
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🔄 [Year3000System] Default Catppuccin colors applied.");
    }

    // 3. TODO: Reset visual systems
    // This might involve calling destroy() then initialize() on each, or specific reset() methods.
    // For now, just logging a todo. Consider if settings changes + color reset is enough.
    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "🔄 [Year3000System] TODO: Implement reset logic for individual visual systems if needed."
      );
    }
    // Example for one system:
    // if (this.lightweightParticleSystem && typeof this.lightweightParticleSystem.destroy === 'function') {
    //     this.lightweightParticleSystem.destroy();
    //     this.lightweightParticleSystem.initialize(); // or a dedicated reset method
    // }

    // After resetting, it might be good to re-apply current song data if music analysis is on
    // However, settings reset might have turned it off. The next song change will handle it.
    // Or, we could call setupMusicAnalysisAndColorExtraction() again, but that might add duplicate listeners if not careful.
    // For now, relying on next song change or manual toggle of features seems safest.
  }

  // ✅ PHASE 5: Proactive Health Monitoring System
  startProactiveHealthMonitoring() {
    if (this._healthMonitorInterval) {
      return; // Already running
    }

    const monitoringConfig = {
      interval: 300000, // 5 minutes
      criticalInterval: 60000, // 1 minute for critical issues
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
          "❌ [Year3000System] Background health check failed:",
          error
        );
      }
    }, monitoringConfig.interval);

    if (this.YEAR3000_CONFIG.enableDebug) {
      console.log("🔄 [Year3000System] Proactive health monitoring started");
    }
  }

  stopProactiveHealthMonitoring() {
    if (this._healthMonitorInterval) {
      clearInterval(this._healthMonitorInterval);
      this._healthMonitorInterval = null;

      if (this.YEAR3000_CONFIG.enableDebug) {
        console.log("🔄 [Year3000System] Proactive health monitoring stopped");
      }
    }
  }

  async _performBackgroundHealthCheck() {
    const healthMetrics = this._generateHealthMetrics();
    const currentScore = healthMetrics.overallScore;

    // Record health history
    this._healthMonitoringData.healthHistory.push({
      timestamp: Date.now(),
      score: currentScore,
      level: healthMetrics.healthLevel,
    });

    // Keep only last 24 hours of history
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    this._healthMonitoringData.healthHistory =
      this._healthMonitoringData.healthHistory.filter(
        (entry) => entry.timestamp > twentyFourHoursAgo
      );

    // Check for health degradation
    const scoreDrop = this._healthMonitoringData.lastHealthScore - currentScore;
    if (scoreDrop > 10) {
      console.warn("⚠️ [Year3000System] Health degradation detected:", {
        previous: this._healthMonitoringData.lastHealthScore,
        current: currentScore,
        drop: scoreDrop,
      });
    }

    // Handle critical health issues
    if (currentScore < 70) {
      this._healthMonitoringData.consecutiveFailures++;

      if (this._healthMonitoringData.consecutiveFailures >= 3) {
        await this._handleCriticalHealthIssue(healthMetrics);
      }
    } else {
      this._healthMonitoringData.consecutiveFailures = 0;
    }

    // Update last known score
    this._healthMonitoringData.lastHealthScore = currentScore;

    // Log health status periodically
    if (this.YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
      console.log("💚 [Year3000System] Health check completed:", {
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
        "🚨 [Year3000System] Maximum recovery attempts reached - entering safe mode"
      );
      await this._enterSafeMode();
      return;
    }

    this._healthMonitoringData.recoveryAttempts++;

    console.warn("🔧 [Year3000System] Attempting automatic recovery:", {
      attempt: this._healthMonitoringData.recoveryAttempts,
      issues: healthMetrics.issues,
    });

    // Identify and attempt to fix critical issues
    for (const issue of healthMetrics.issues) {
      if (issue.severity === "critical") {
        await this._attemptSystemRecovery(issue.system);
      }
    }

    // Force health re-evaluation
    setTimeout(() => {
      const newHealth = this._generateHealthMetrics();
      if (newHealth.overallScore > 80) {
        console.log("✅ [Year3000System] Recovery successful:", {
          newScore: newHealth.overallScore,
          attempt: this._healthMonitoringData.recoveryAttempts,
        });
        this._healthMonitoringData.recoveryAttempts = 0;
      }
    }, 5000);
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
          // Reinitialize color harmony
          this.colorHarmonyEngine = null;
          await this._initializeColorHarmonyEngine();
        }
      },
      musicAnalysisService: async () => {
        if (this.musicAnalysisService) {
          // Restart music analysis
          this.setupMusicAnalysisAndColorExtraction();
        }
      },
      default: async () => {
        console.warn(
          `⚠️ [Year3000System] No recovery strategy for ${systemName}`
        );
      },
    };

    const strategy =
      recoveryStrategies[systemName] || recoveryStrategies.default;

    try {
      await strategy();
      console.log(`🔧 [Year3000System] Recovery attempted for ${systemName}`);
    } catch (error) {
      console.error(
        `❌ [Year3000System] Recovery failed for ${systemName}:`,
        error
      );
    }
  }

  async _enterSafeMode() {
    console.warn(
      "🛡️ [Year3000System] Entering safe mode - disabling non-critical systems"
    );

    // Disable resource-intensive features
    const safeConfig = {
      artisticMode: "corporate-safe",
      enableCosmicSync: false,
      musicModulationIntensity: 0.1,
    };

    // Apply safe configuration
    Object.assign(this.YEAR3000_CONFIG, safeConfig);

    // Destroy non-critical systems
    const nonCriticalSystems = [
      "lightweightParticleSystem",
      "beatSyncVisualSystem",
      "dataGlyphSystem",
      "dimensionalNexusSystem",
      "aestheticGravitySystem",
    ];

    for (const systemName of nonCriticalSystems) {
      if (this[systemName] && typeof this[systemName].destroy === "function") {
        try {
          await this[systemName].destroy();
          this[systemName] = null;
          console.log(
            `🛡️ [Year3000System] Disabled ${systemName} for safe mode`
          );
        } catch (error) {
          console.error(
            `❌ [Year3000System] Error disabling ${systemName}:`,
            error
          );
        }
      }
    }

    // Set safe mode flag
    this._inSafeMode = true;

    // Update UI to indicate safe mode
    const root = document.documentElement;
    root.style.setProperty("--sn-safe-mode", "1");
    root.classList.add("year3000-safe-mode");

    console.warn(
      "🛡️ [Year3000System] Safe mode activated - basic functionality maintained"
    );
  }

  exitSafeMode() {
    if (!this._inSafeMode) return;

    console.log(
      "🌟 [Year3000System] Exiting safe mode - reinitializing systems"
    );

    this._inSafeMode = false;

    // Remove safe mode indicators
    const root = document.documentElement;
    root.style.removeProperty("--sn-safe-mode");
    root.classList.remove("year3000-safe-mode");

    // Reset recovery counters
    this._healthMonitoringData.recoveryAttempts = 0;
    this._healthMonitoringData.consecutiveFailures = 0;

    // Reinitialize all systems
    this.initializeAllSystems()
      .then(() => {
        console.log("✅ [Year3000System] Safe mode exit completed");
      })
      .catch((error) => {
        console.error("❌ [Year3000System] Error exiting safe mode:", error);
      });
  }

  _calculateHealthTrend() {
    const history = this._healthMonitoringData.healthHistory;
    if (history.length < 2) return "insufficient_data";

    const recent = history.slice(-5); // Last 5 readings
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

    // Check for high memory usage
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

    // Check for low frame rate
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

    // Check for initialization time
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

    // Check for problematic systems
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
    let frameBudget = 10; // 10ms budget for timer operations

    // Sort timers by priority
    const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
      ([, a], [, b]) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    );

    for (const [timerId, config] of timersByPriority) {
      if (!config.enabled || frameBudget <= 0) {
        if (frameBudget <= 0 && config.priority === "background") {
          continue; // Skip background timers when budget exhausted
        }
      }

      // Check if timer should execute
      const timeSinceLastExecution = now - config.lastExecution;
      if (timeSinceLastExecution < config.intervalMs) {
        continue; // Not time for this timer yet
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

        // Disable problematic timers temporarily
        if (config.errorCount > 3) {
          config.enabled = false;
          setTimeout(() => {
            if (this._timerRegistry.has(timerId)) {
              this._timerRegistry.get(timerId).enabled = true;
            }
          }, 30000); // Re-enable after 30 seconds
        }
      }

      const callbackTime = performance.now() - callbackStartTime;
      config.totalTime += callbackTime;
      config.maxTime = Math.max(config.maxTime, callbackTime);

      frameBudget -= callbackTime;

      // Emergency brake for expensive timers
      if (callbackTime > 5) {
        // More than 5ms
        console.warn(
          `[Year3000System] Timer ${timerId} taking too long: ${callbackTime.toFixed(
            2
          )}ms`
        );

        if (config.priority === "background") {
          // Reduce frequency for expensive background timers
          config.intervalMs = Math.min(config.intervalMs * 1.5, 5000); // Max 5 second interval
        }
      }
    }

    // Track timer system performance
    const totalFrameTime = performance.now() - frameStartTime;
    if (totalFrameTime > 8) {
      // Timer frame taking too long
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
      return this.deviceCapabilityDetector.enableGPUAcceleration(element, type);
    }
    // Fallback: apply basic GPU acceleration
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
    // Fallback: remove GPU acceleration
    if (element && element.style) {
      element.style.transform = "";
      element.style.willChange = "";
    }
  }
}
