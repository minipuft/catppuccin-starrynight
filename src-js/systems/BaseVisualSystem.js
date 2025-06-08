import { YEAR3000_CONFIG } from "../config/globalConfig.js";
import { Year3000Utilities } from "../utils/Year3000Utilities.js";

// YEAR 3000 BASE VISUAL SYSTEM - Foundation for all visual engines
export class BaseVisualSystem {
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
    this.musicSyncService = musicSyncService; // Updated from musicAnalysisService
    this.settingsManager = settingsManager;
    this.systemName = this.constructor.name;
    this.initialized = false;
    this.performanceTimers = new Map();
    this.metrics = {
      initializationTime: 0,
      updates: 0,
      errors: 0,
    };
    this._resizeHandler = null; // To store resize handler for cleanup
    this.currentPerformanceProfile = {}; // Store the applied profile details

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

    // ✅ FIX #7: Defer music service subscription until after other initialization
    // This prevents race conditions where systems subscribe before being ready

    // Phase 1: Set up settings manager and performance profile
    if (this.settingsManager) {
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
      const initialQuality = this.settingsManager.get("sn-performanceQuality");
      if (initialQuality) {
        this._applyPerformanceProfile(initialQuality);
      }
    } else {
      console.warn(
        `[${this.systemName}] SettingsManager not provided or invalid. Performance profile will not be reactive.`
      );
    }

    // Phase 2: System-specific initialization (subclasses can override this)
    await this._performSystemSpecificInitialization();

    // Phase 3: Mark as initialized BEFORE subscribing to prevent race conditions
    this.initialized = true;

    // Phase 4: Now that system is fully initialized, subscribe to music sync service
    // ✅ FIX #7: This timing ensures the system is ready to receive notifications
    if (this.musicSyncService) {
      // ✅ FIX #7: Add dependency validation before subscription
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
    // Base implementation does nothing
    // Subclasses can override this for their specific setup needs
    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Performing system-specific initialization (base implementation)`
      );
    }
  }

  // ✅ FIX #7: Validate that all required dependencies are available and ready
  _validateDependenciesForSubscription() {
    // Check that updateFromMusicAnalysis method exists (required for subscription)
    if (typeof this.updateFromMusicAnalysis !== "function") {
      console.error(
        `[${this.systemName}] Missing updateFromMusicAnalysis method - cannot subscribe to music analysis`
      );
      return false;
    }

    // Check that system is marked as initialized
    if (!this.initialized) {
      console.warn(
        `[${this.systemName}] System not initialized - subscription may cause race conditions`
      );
      return false;
    }

    // Check that config is available
    if (!this.config) {
      console.warn(
        `[${this.systemName}] Missing configuration - subscription may fail`
      );
      return false;
    }

    // Additional validation can be added by subclasses by overriding this method
    return this._performAdditionalDependencyValidation();
  }

  // ✅ FIX #7: Virtual method for additional dependency validation (can be overridden)
  _performAdditionalDependencyValidation() {
    // Base implementation always returns true
    // Subclasses can override this for their specific validation needs
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
      this.config.performanceProfiles.balanced; // Fallback to balanced
    if (profile) {
      this.currentPerformanceProfile = profile;
      if (this.config.enableDebug) {
        console.log(
          `[BaseVisualSystem (${this.systemName})] Applied performance profile '${quality}':`,
          profile
        );
      }
      // Subclasses should override this or use this.currentPerformanceProfile to adjust their behavior
      // e.g., this.particleCount = this.currentPerformanceProfile.particleCount;
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

    // 🌌 Year 3000 Base Implementation: Kinetic foundation
    if (processedMusicData) {
      // Apply cosmic breathing to canvas if it exists
      this._applyCosmicBreathing(processedMusicData);

      // Update global kinetic variables for subclasses
      this._updateGlobalKinetics(processedMusicData);

      if (this.config.enableDebug && Math.random() < 0.005) {
        console.log(
          `🌊 [BaseVisualSystem (${
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

    // Calculate breathing phase
    const breathingSpeed = (enhancedBPM / 120) * 0.02; // Adjust speed based on BPM
    const breathingPhase = (Date.now() * breathingSpeed) % (Math.PI * 2);
    const breathingIntensity = 0.8 + Math.sin(breathingPhase) * 0.2 * energy;

    // Apply to canvas if this system has one
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

    // Set kinetic variables that all visual systems can use
    root.style.setProperty("--sn-kinetic-energy", energy.toFixed(3));
    root.style.setProperty("--sn-kinetic-valence", valence.toFixed(3));
    root.style.setProperty("--sn-kinetic-bpm", enhancedBPM.toString());
    root.style.setProperty(
      "--sn-kinetic-tempo-multiplier",
      (enhancedBPM / 120).toFixed(3)
    );

    // Cosmic timing variables
    const beatInterval = 60000 / enhancedBPM;
    const timeSinceLastBeat = Date.now() % beatInterval;
    const beatPhase = (timeSinceLastBeat / beatInterval) * Math.PI * 2;
    const beatPulse = Math.sin(beatPhase);

    root.style.setProperty("--sn-kinetic-beat-phase", beatPhase.toFixed(3));
    root.style.setProperty("--sn-kinetic-beat-pulse", beatPulse.toFixed(3));
  }

  // 🎨 Year 3000 Utility: Create kinetic canvas with cosmic properties
  _createKineticCanvas(
    id,
    zIndex = 5, // ✅ Changed from -1 to +5 to bring effects forward
    blendMode = "screen",
    kineticMode = "pulse"
  ) {
    const canvas = this._createCanvasElement(id, zIndex, blendMode);

    // Add kinetic CSS classes and data attributes
    canvas.classList.add("year3000-kinetic-canvas");
    canvas.dataset.kineticMode = kineticMode;
    canvas.dataset.systemName = this.systemName;

    // Apply cosmic CSS animations
    const kineticStyles = this._getKineticStyles(kineticMode);
    Object.assign(canvas.style, kineticStyles);

    if (this.config.enableDebug) {
      console.log(
        `🌊 [BaseVisualSystem (${this.systemName})] Created kinetic canvas with mode: ${kineticMode}`
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
      energy: parseFloat(style.getPropertyValue("--sn-kinetic-energy")) || 0.5,
      valence:
        parseFloat(style.getPropertyValue("--sn-kinetic-valence")) || 0.5,
      bpm: parseFloat(style.getPropertyValue("--sn-kinetic-bpm")) || 120,
      tempoMultiplier:
        parseFloat(style.getPropertyValue("--sn-kinetic-tempo-multiplier")) ||
        1.0,
      beatPhase:
        parseFloat(style.getPropertyValue("--sn-kinetic-beat-phase")) || 0,
      beatPulse:
        parseFloat(style.getPropertyValue("--sn-kinetic-beat-pulse")) || 0,
    };
  }

  destroy() {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying...`);
    }

    // ✅ FIX #7: Enhanced cleanup with error handling
    try {
      // Mark as not initialized first to prevent new operations
      this.initialized = false;

      // Unsubscribe from music sync service
      if (this.musicSyncService) {
        this.musicSyncService.unsubscribe(this.systemName);
        if (this.config.enableDebug) {
          console.log(
            `[${this.systemName}] Unsubscribed from MusicSyncService`
          );
        }
      }

      // Remove settings event listener
      if (this.settingsManager && this.boundHandleSettingsChange) {
        document.removeEventListener(
          "year3000SystemSettingsChanged",
          this.boundHandleSettingsChange
        );
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Removed settings event listener`);
        }
      }

      // Remove resize handler
      if (this._resizeHandler) {
        window.removeEventListener("resize", this._resizeHandler);
        this._resizeHandler = null;
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Removed resize event listener`);
        }
      }

      // System-specific cleanup (subclasses can override)
      this._performSystemSpecificCleanup();

      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Destruction completed successfully`);
      }
    } catch (error) {
      console.error(`[${this.systemName}] Error during destruction:`, error);
    }
  }

  // ✅ FIX #7: Virtual method for system-specific cleanup (can be overridden)
  _performSystemSpecificCleanup() {
    // Base implementation does nothing
    // Subclasses can override this for their specific cleanup needs
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
    zIndex = 5, // ✅ Changed from -1 to +5 to bring effects forward
    blendMode = "screen",
    customCssText = ""
  ) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const canvas = document.createElement("canvas");
    canvas.id = id;

    let baseOpacity = 0.5; // Default base opacity
    if (this.config && typeof this.config.opacity === "number") {
      baseOpacity = this.config.opacity;
    } else if (
      YEAR3000_CONFIG &&
      typeof YEAR3000_CONFIG.getCurrentMultipliers === "function"
    ) {
      const multipliers = YEAR3000_CONFIG.getCurrentMultipliers();
      if (multipliers && typeof multipliers.opacity === "number") {
        baseOpacity = multipliers.opacity * 0.5; // As per original logic
      }
    }

    let css = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none; z-index: ${zIndex}; mix-blend-mode: ${blendMode};
      opacity: ${baseOpacity};
    `;
    if (customCssText) {
      // Simple concatenation; for more complex merging, a CSS object approach might be better.
      // This assumes customCssText is a string of valid CSS rules ending with semicolons if needed.
      css += customCssText;
    }
    canvas.style.cssText = css;
    document.body.appendChild(canvas);

    // Storing the handler bound to 'this' context if it needs 'this'
    this._resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (typeof this.handleResize === "function") {
        this.handleResize();
      }
    };
    window.addEventListener("resize", this._resizeHandler);
    this._resizeHandler(); // Initial size set

    return canvas;
  }

  _requestAnimationFrame(callback) {
    return requestAnimationFrame(callback);
  }

  _cancelAnimationFrame(frameId) {
    cancelAnimationFrame(frameId);
  }
}
