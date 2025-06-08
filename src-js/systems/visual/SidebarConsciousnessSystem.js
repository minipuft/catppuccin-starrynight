import { HARMONIC_MODES } from "../../config/globalConfig.js";
import { Year3000Utilities } from "../../utils/Year3000Utilities.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";
// No Year3000Utilities needed for this specific class based on its original implementation

export class SidebarConsciousnessSystem extends BaseVisualSystem {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicSyncService,
    settingsManager,
    year3000System = null // PHASE 3: Added year3000System parameter for Master Animation Coordinator
  ) {
    super(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System
    );

    // === PHASE 3: MASTER ANIMATION COORDINATOR INTEGRATION ===
    this.year3000System = year3000System;
    this.masterAnimationRegistered = false;
    this.isUsingMasterAnimation = false;

    this.rootNavBar = null; // DOM element, will be queried in initialize
    this.consciousnessVisualizer = null;
    this.harmonicModeIndicator = null; // New: DOM element for harmonic mode display
    this.consciousnessAnimationFrame = null; // New: Animation frame ID for cleanup (fallback only)
    this.currentHarmonicModeClass = "";
    this.currentEnergyClass = "";
    this.currentHarmonicModeKey = "artist-vision"; // Default
    this.nexusVariables = {}; // Store relevant nexus variables for sidebar reflection

    // === PHASE 3: PERFORMANCE OPTIMIZATION ===
    this.performanceMetrics = {
      animationFrames: 0,
      maxFrameTime: 0,
      averageFrameTime: 0,
      frameTimeHistory: [],
      cssVariableUpdates: 0,
      elementUpdates: 0,
    };

    // === PHASE 3: DEVICE CAPABILITY DETECTION ===
    this.deviceCapabilities = {
      supportsCSSFilter: this._detectCSSFilterSupport(),
      supportsTransforms: this._detectTransformSupport(),
      performanceLevel: this._detectPerformanceLevel(),
      reducedMotion: this._detectReducedMotion(),
    };

    // === PHASE 3: ANIMATION STATE ===
    this.animationState = {
      lastPulse: 0,
      pulseDirection: 1,
      baseOpacity: 0.7,
      currentScale: 1.0,
      targetScale: 1.0,
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

    // Validate required DOM elements before proceeding
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

    // === PHASE 3: MASTER ANIMATION COORDINATOR REGISTRATION ===
    this._tryRegisterWithMasterAnimation();

    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Sidebar consciousness system initialized. Using ${
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
        // Register with Master Animation Coordinator
        this.year3000System.registerAnimationSystem(
          "SidebarConsciousnessSystem",
          this,
          "background", // Background priority - less critical than visual effects
          this.deviceCapabilities.performanceLevel === "high"
            ? 30
            : this.deviceCapabilities.performanceLevel === "medium"
            ? 20
            : 15 // Lower FPS for consciousness effects
        );

        this.masterAnimationRegistered = true;
        this.isUsingMasterAnimation = true;

        if (this.config?.enableDebug) {
          console.log(
            `🎬 [${
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

    // Fallback to original startConsciousnessLoop method
    this.startConsciousnessLoop();

    if (this.config?.enableDebug) {
      console.log(
        `🔄 [${this.systemName}] Started fallback consciousness loop`
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
      // Skip animation if reduced motion is preferred
      if (this.deviceCapabilities.reducedMotion) {
        return;
      }

      if (!this.consciousnessVisualizer || !this.rootNavBar) {
        return; // Stop animation if elements are missing
      }

      // === PHASE 3: OPTIMIZED CONSCIOUSNESS ANIMATION ===
      const time = timestamp * 0.001; // Convert to seconds
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;

      // Use CSS Variable batching if available
      const useBatching =
        this.year3000System && this.year3000System.queueCSSVariableUpdate;

      // Apply subtle breathing effect with smooth interpolation
      this.animationState.targetScale = pulse;
      this.animationState.currentScale =
        this.animationState.currentScale +
        (this.animationState.targetScale - this.animationState.currentScale) *
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

      // Apply to harmonic mode indicator if it exists
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

      // === PHASE 3: PERFORMANCE TRACKING ===
      const frameTime = performance.now() - frameStartTime;
      this.performanceMetrics.animationFrames++;
      this.performanceMetrics.maxFrameTime = Math.max(
        this.performanceMetrics.maxFrameTime,
        frameTime
      );

      // Update rolling average
      this.performanceMetrics.frameTimeHistory.push(frameTime);
      if (this.performanceMetrics.frameTimeHistory.length > 30) {
        this.performanceMetrics.frameTimeHistory.shift();
      }
      this.performanceMetrics.averageFrameTime =
        this.performanceMetrics.frameTimeHistory.reduce((a, b) => a + b, 0) /
        this.performanceMetrics.frameTimeHistory.length;
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
        `🎨 [${this.systemName}] Performance mode changed to: ${mode}`
      );
    }

    if (mode === "performance") {
      // Reduce animation quality for better performance
      this.animationState.smoothingFactor = 0.25; // Less smooth but faster
      this.animationState.baseOpacity = 0.6; // Slightly less opacity
    } else {
      // Restore quality
      this.animationState.smoothingFactor = 0.15; // Smooth animation
      this.animationState.baseOpacity = 0.7; // Full opacity
    }
  }

  // Override handleSettingsChange from BaseVisualSystem to also listen for harmonic mode changes
  handleSettingsChange(event) {
    super.handleSettingsChange(event); // Call base class method for performance profile

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
    // Defensive checks for safe DOM manipulation
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
    // Basic styling, detailed appearance via SCSS based on CSS variables
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
      this.rootNavBar.style.position = "relative"; // Ensure parent is positioned
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
      this.consciousnessVisualizer = null; // Clear reference if append failed
    }
  }

  createHarmonicModeDisplay() {
    // Create harmonic mode indicator element
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
    // Update consciousness visualizer colors based on current theme
    if (!this.consciousnessVisualizer) return;

    try {
      const root = document.documentElement;
      const style = getComputedStyle(root);

      // Get current theme colors
      const accentColor = style.getPropertyValue("--spice-accent") || "#ca9ee6";
      const buttonColor = style.getPropertyValue("--spice-button") || "#8caaee";
      const highlightColor =
        style.getPropertyValue("--spice-highlight") || "#babbf1";

      // Update consciousness visualizer gradient
      this.consciousnessVisualizer.style.background = `linear-gradient(90deg,
        rgba(var(--spice-rgb-accent, 202,158,230), 0.6),
        rgba(var(--spice-rgb-button, 140,170,238), 0.6)
      )`;

      // Update box shadow
      this.consciousnessVisualizer.style.boxShadow = `0 0 10px rgba(var(--spice-rgb-highlight, 186,187,241), 0.3)`;

      if (this.config?.enableDebug) {
        console.log(`[${this.systemName}] Colors updated successfully`);
      }
    } catch (error) {
      console.error(`[${this.systemName}] Failed to update colors:`, error);
    }
  }

  startConsciousnessLoop() {
    // Initialize consciousness animation loop
    if (this.consciousnessAnimationFrame) {
      cancelAnimationFrame(this.consciousnessAnimationFrame);
    }

    const animate = () => {
      if (!this.consciousnessVisualizer || !this.rootNavBar) {
        return; // Stop animation if elements are missing
      }

      try {
        // Simple pulsing animation based on time
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2) * 0.1 + 0.9;

        // Apply subtle breathing effect
        if (this.consciousnessVisualizer) {
          this.consciousnessVisualizer.style.transform = `translateX(-50%) scale(${pulse})`;
        }

        // Apply to harmonic mode indicator if it exists
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

    // Start the animation loop
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
      // TODO: The HARMONIC_MODES object does not contain colorProfile.
      // This logic needs to be revisited. For now, we'll use placeholder colors
      // to prevent a crash, which will not reflect the selected mode.
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

    // Reflect some aspects of DimensionalNexusSystem if those variables are available globally
    // This is a simplified example; direct communication or shared state might be better.
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

    // Modulate sidebar visuals based on music and nexus state
    const opacity = Year3000Utilities.lerpSmooth(
      parseFloat(
        this.rootNavBar.style.getPropertyValue("--sn-sidebar-opacity") || "0.7"
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
      0.25 // Height in px
    );
    const widthPercentage = Year3000Utilities.lerpSmooth(
      parseFloat(this.consciousnessVisualizer?.style.width.replace("%", "")) ||
        80,
      70 + valence * 20 + this.nexusVariables.coherence * 10,
      0.1,
      0.2
    ); // Width in %

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
      // Pulse effect could be tied to tempo or beats
      const pulseSpeed =
        (1 / (processedMusicData.tempo / 120 || 1)) * 0.5 + 0.5; // Faster for higher tempo
      this.consciousnessVisualizer.style.animationDuration = `${Math.max(
        0.5,
        Math.min(3, pulseSpeed)
      ).toFixed(2)}s`; // If there's a CSS animation
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
    super.updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri);
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
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    // Update system state based on mode features
    this.modeConfig = {
      systemEnabled: enabled !== false,
      consciousnessAnimationsEnabled: animations || false,
      intensityMultiplier: intensity || 1.0,
      harmonicSyncEnabled: modeConfig.harmonicSync || false,
    };

    // Update consciousness display based on mode
    this.updateConsciousnessForMode();

    // Setup harmonic sync listener if enabled
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

    const baseIntensity = this.modeConfig.intensityMultiplier || 1.0;

    // Update consciousness scaling and visibility
    this.consciousnessState.modeScaling = baseIntensity;
    this.consciousnessState.animationsEnabled =
      this.modeConfig.consciousnessAnimationsEnabled;

    // Apply immediate visual updates
    this.updateConsciousnessDisplay(this.consciousnessState);

    if (this.config?.enableDebug) {
      console.log(
        `🧠 [${this.systemName}] Updated consciousness for mode - Intensity: ${baseIntensity}`
      );
    }
  }

  /**
   * Setup listener for harmonic sync events
   */
  setupHarmonicSyncListener() {
    if (this.harmonicSyncListener) return; // Already setup

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
      console.log(`🎵 [${this.systemName}] Harmonic sync listener enabled`);
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
        console.log(`🎵 [${this.systemName}] Harmonic sync listener disabled`);
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
    const intensity = this.modeConfig?.intensityMultiplier || 1.0;

    // Apply harmonic modulation to consciousness
    const harmonicModulation = {
      opacity: 0.8 + composite.oscillation * 0.15 * intensity,
      scale: 1.0 + composite.pulse * 0.05 * intensity,
      rotation: composite.flow * 2.0 * intensity,
      glow: 0.3 + composite.oscillation * 0.2 * intensity,
    };

    // Update consciousness state with harmonic values
    this.consciousnessState.harmonicModulation = harmonicModulation;

    // Apply to visual elements
    this.applyHarmonicModulation(harmonicModulation);
  }

  /**
   * Apply harmonic modulation to consciousness elements
   * @param {Object} modulation - Harmonic modulation values
   */
  applyHarmonicModulation(modulation) {
    const root = document.documentElement;

    // Update CSS variables with harmonic consciousness values
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

    // Apply to sidebar consciousness elements
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
          this.harmonicModeIndicator && this.harmonicModeIndicator.parentNode,
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
    if (!checks.initialization.configValid) initIssues.push("config not valid");
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
    // === PHASE 3: MASTER ANIMATION COORDINATOR CLEANUP ===
    if (this.masterAnimationRegistered && this.year3000System) {
      try {
        this.year3000System.unregisterAnimationSystem(
          "SidebarConsciousnessSystem"
        );
        this.masterAnimationRegistered = false;
        this.isUsingMasterAnimation = false;

        if (this.config?.enableDebug) {
          console.log(
            `🎬 [${this.systemName}] Unregistered from Master Animation Coordinator`
          );
        }
      } catch (error) {
        console.warn(
          `[${this.systemName}] Failed to unregister from Master Animation Coordinator:`,
          error
        );
      }
    }

    // Stop consciousness animation loop (fallback only)
    if (this.consciousnessAnimationFrame) {
      cancelAnimationFrame(this.consciousnessAnimationFrame);
      this.consciousnessAnimationFrame = null;

      if (this.config?.enableDebug) {
        console.log(`🔄 [${this.systemName}] Stopped fallback animation loop`);
      }
    }

    // Remove harmonic sync listener
    this.removeHarmonicSyncListener();

    if (this.sidebarObserver) {
      this.sidebarObserver.disconnect();
      this.sidebarObserver = null;
    }

    // Clean up consciousness visualizer
    if (this.consciousnessVisualizer) {
      this.consciousnessVisualizer.remove();
      this.consciousnessVisualizer = null;
    }

    // Clean up harmonic mode indicator
    if (this.harmonicModeIndicator) {
      this.harmonicModeIndicator.remove();
      this.harmonicModeIndicator = null;
    }

    // Clean up consciousness field elements
    const consciousnessElements = document.querySelectorAll(
      ".sn-consciousness-field"
    );
    consciousnessElements.forEach((element) => element.remove());

    // Call parent destroy method
    super.destroy();

    if (this.config?.enableDebug) {
      console.log(`[${this.systemName}] Destroyed and cleaned up.`);
    }
  }
}
