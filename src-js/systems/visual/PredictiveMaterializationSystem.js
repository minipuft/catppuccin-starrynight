import { Year3000Utilities } from "../../utils/Year3000Utilities.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

// YEAR 3000 PREDICTIVE MATERIALIZATION SYSTEM
export class PredictiveMaterializationSystem extends BaseVisualSystem {
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
      imminence: 0, // How close something is to "materializing"
      clarity: 0, // How clear the materialized element is
      targetElement: null, // Could be a predicted next track, UI element etc.
    };
    this.rootElement = Year3000Utilities.getRootStyle(); // document.documentElement

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
    // CSS might use these for effects like partial visibility, blur, or pre-animation states
  }

  updateFromMusicAnalysis(processedMusicData) {
    if (!this.isInitialized || !processedMusicData) return;
    super.updateFromMusicAnalysis(processedMusicData);

    const {
      segmentTransitionConfidence, // Confidence that a new major segment is approaching
      visualIntensity,
      energy,
      valence,
    } = processedMusicData;

    // Imminence increases if a segment transition is likely or energy is building
    let targetImminence =
      (segmentTransitionConfidence || 0) * 0.6 +
      energy * 0.3 +
      visualIntensity * 0.1;

    // Clarity increases with valence (positive mood = clearer future?) and sustained intensity
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

    // Clamp values
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
      // Reduce log frequency
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
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    // Update system state based on mode features
    this.modeConfig = {
      systemEnabled: enabled !== false,
      materializationAnimationsEnabled: animations || false,
      intensityMultiplier: intensity || 1.0,
    };

    // Update materialization behavior based on mode
    this.updateMaterializationForMode();
  }

  /**
   * Update materialization behavior based on current mode
   */
  updateMaterializationForMode() {
    if (!this.modeConfig) return;

    const baseIntensity = this.modeConfig.intensityMultiplier || 1.0;

    // Update materialization timing and intensity
    this.materializationIntensity = baseIntensity;
    this.materializationSpeed = this.modeConfig.materializationAnimationsEnabled
      ? baseIntensity * 1.3
      : baseIntensity * 0.8;

    if (this.config?.enableDebug) {
      console.log(
        `✨ [${this.systemName}] Updated materialization - Intensity: ${this.materializationIntensity}, Speed: ${this.materializationSpeed}`
      );
    }
  }

  destroy() {
    // Optionally reset CSS variables
    // this.rootElement.style.setProperty('--sn-materialize-imminence', '0');
    // this.rootElement.style.setProperty('--sn-materialize-clarity', '0');
    super.destroy();
    if (this.config?.enableDebug) {
      console.log(`[${this.systemName}] Destroyed and cleaned up.`);
    }
  }
}
