import {
  MODERN_SELECTORS,
  findElementWithFallback,
} from "../../debug/SpotifyDOMSelectors.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

// YEAR 3000 DIMENSIONAL NEXUS SYSTEM - Performance Optimized
export class DimensionalNexusSystem extends BaseVisualSystem {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicSyncService,
    settingsManager,
    year3000System = null // Master Animation Coordinator access
  ) {
    super(
      config,
      utils,
      performanceMonitor,
      musicSyncService,
      settingsManager,
      year3000System
    );

    // Store reference to Year3000System
    this.year3000System = year3000System;

    this.nexusState = {
      // Current animated values
      complexity: 0.1,
      coherence: 0.8,
      volatility: 0.05,
      timeDistortionFactor: 1.0,
      currentNavigationScale: 1.0,

      // Target values for animation
      targetComplexity: 0.1,
      targetCoherence: 0.8,
      targetVolatility: 0.05,
      targetTimeDistortionFactor: 1.0,
      targetNavigationScale: 1.0,

      // Other state
      userInfluence: 0,
      lastEnergy: 0.5,
      lastValence: 0.5,
      lastVisualIntensity: 0.5,
      lastMoodIdentifier: "neutral",

      // Responsiveness settings
      responsiveness: 1.0,
      temporalSensitivity: 1.0,
    };

    // ===== OPTIMIZED BIOMETRIC MEDITATION SYSTEM =====
    this.biometricState = {
      isMeditating: false,
      lastUserInteractionTime: Date.now(),
      meditationGracePeriod: 5000, // 5 seconds
      interactionCooldown: 1000,
      lastMeditationUpdateTime: null,
      desaturation: 0,
      slowdown: 1,
      targetDesaturation: 0,
      targetSlowdown: 1,
    };

    // ===== PERFORMANCE OPTIMIZATION: Reduced update frequencies =====
    this.lastHeavyUpdateTime = 0;
    this.heavyUpdateInterval = 1000 / 10; // 10 FPS for heavy calculations (reduced from 20)
    this.lastBiometricCheckTime = 0;
    this.biometricCheckInterval = 1000; // 1 FPS for meditation check (reduced from 2)
    this.lastInteractionRecordTime = 0;
    this.interactionRecordInterval = 200; // 5fps for interaction tracking (reduced from 10)

    // Master Animation Coordinator support
    this._animationRegistered = false;
    this._performanceMode = "auto";
    this._frameSkipCounter = 0;
    this._maxFrameSkip = 2; // Increased frame skipping for better performance

    // ===== PERFORMANCE MONITORING =====
    this.systemIntegrationMetrics = {
      lastSystemsCheck: Date.now(),
      integrationHealth: "healthy",
      crossSystemErrors: 0,
      meditationTransitions: 0,
      navigationScaleUpdates: 0,
    };

    // Register with health monitors
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
        `🌌 [${this.systemName}] Optimized Dimensional Nexus initialized with performance focus.`
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
        `🧠 [${this.systemName}] Optimized quantum space and biometric monitoring initialized.`
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
        30 // Reduced from 45fps to 30fps for better performance
      );

      this._animationRegistered = true;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Registered with Master Animation Coordinator (30fps)`
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
      } catch (e) {
        // Silent error handling
      }
    };

    // Initialize core nexus variables
    safeSetProperty("--sn-nexus-complexity", this.nexusState.complexity);
    safeSetProperty("--sn-nexus-coherence", this.nexusState.coherence);
    safeSetProperty("--sn-nexus-volatility", this.nexusState.volatility);
    safeSetProperty(
      "--sn-nexus-time-distortion",
      this.nexusState.timeDistortionFactor
    );

    // Initialize navigation scaling
    safeSetProperty("--sn-nav-item-transform-scale", "1.0");

    // Initialize biometric feedback variables
    safeSetProperty("--sn-sidebar-meditation-desaturation", "0");
    safeSetProperty("--sn-sidebar-meditation-slowdown", "1");

    // ===== SIMPLIFIED DIMENSIONAL PATTERN (No complex biomorphic shapes) =====
    // Use CSS-only patterns instead of JavaScript-generated complex shapes
    safeSetProperty("--sn-nexus-pattern-complexity", "0.5");
    safeSetProperty("--sn-nexus-pattern-rotation", "0deg");
  }

  /**
   * Optimized interaction tracking (reduced frequency)
   */
  recordUserInteraction(event) {
    const eventType = event.type;
    const now = performance.now();

    // More aggressive throttling for performance
    if (now - this.lastInteractionRecordTime < this.interactionRecordInterval) {
      return;
    }
    this.lastInteractionRecordTime = now;

    // Simplified interaction response
    this.nexusState.userInfluence += 0.005; // Reduced from 0.01
    this.nexusState.volatility = Math.min(1, this.nexusState.volatility + 0.01); // Reduced from 0.02

    // Clamp user influence
    this.nexusState.userInfluence = Math.min(
      0.5,
      this.nexusState.userInfluence
    ); // Reduced max from 1.0

    // Biometric feedback - record interaction time for meditation detection
    this.biometricState.lastUserInteractionTime = Date.now();
    const wasMeditating = this.biometricState.isMeditating;
    this.biometricState.isMeditating = false;

    if (this.config?.enableDebug && wasMeditating) {
      console.log(
        `🌌 [${this.systemName}] User interaction recorded (${eventType}), exiting meditation.`
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
          this.nexusState.timeDistortionFactor = hasModal ? 0.2 : 1.0;
          this.nexusState.coherence = hasModal ? 0.2 : 0.8;

          if (this.config?.enableDebug) {
            console.log(
              `🌌 [${this.systemName}] Modal state changed. Distortion: ${this.nexusState.timeDistortionFactor}`
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
    this.boundInteractionHandler = (event) => this.recordUserInteraction(event);

    // Reduced interaction events for performance
    const interactionEvents = ["click", "keypress"]; // Removed scroll and mousemove
    interactionEvents.forEach((eventType) => {
      document.addEventListener(eventType, this.boundInteractionHandler, {
        passive: true,
      });
    });

    if (this.config?.enableDebug) {
      console.log(
        `🌌 [${this.systemName}] Optimized interaction listener set up.`
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

    // Throttled updates with increased intervals for performance
    if (now - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
      this.lastHeavyUpdateTime = now;
      this.updateNexusTargets(processedMusicData);
    }

    if (now - this.lastBiometricCheckTime > this.biometricCheckInterval) {
      this.lastBiometricCheckTime = now;
      this.updateDigitalMeditationState(processedMusicData);
    }

    // Per-frame updates handled by animation coordinator
  }

  /**
   * Optimized nexus targets update (simplified calculations)
   */
  updateNexusTargets(processedMusicData) {
    try {
      if (!this.validateMusicData(processedMusicData)) {
        if (this.config?.enableDebug)
          console.warn(
            `🌌 [${this.systemName}] Invalid music data, using defaults.`
          );
        this.systemIntegrationMetrics.crossSystemErrors++;
        processedMusicData = {};
      }

      const {
        visualIntensity = 0.5,
        moodIdentifier = "neutral",
        rawEnergy = 0.5,
        rawValence = 0.5,
        animationSpeedFactor = 1.0,
      } = processedMusicData;

      // Simplified delta calculations
      const energyDelta = Math.abs(rawEnergy - this.nexusState.lastEnergy);
      const valenceDelta = Math.abs(rawValence - this.nexusState.lastValence);

      // Update last values
      this.nexusState.lastEnergy = rawEnergy;
      this.nexusState.lastValence = rawValence;
      this.nexusState.lastVisualIntensity = visualIntensity;
      this.nexusState.lastMoodIdentifier = moodIdentifier;

      // Update target values for lerping (simplified calculations)
      this.nexusState.targetComplexity = visualIntensity * 0.6 + 0.2; // Reduced range
      this.nexusState.targetCoherence = rawValence * 0.5 + 0.4; // Reduced range
      this.nexusState.targetVolatility = (energyDelta + valenceDelta) * 1.5; // Reduced multiplier
      this.nexusState.targetTimeDistortionFactor = animationSpeedFactor;
      this.nexusState.targetNavigationScale =
        this.calculateOptimizedNavigationScale(visualIntensity, moodIdentifier);

      // ===== SIMPLIFIED VISUAL EFFECTS (No heavy shape calculations) =====
      const root = this.utils.getRootStyle();
      if (!root) return;

      // Simplified color adjustments
      const hueShift = (1 - rawValence) * 30 - 15; // Reduced range: -15 to 15 degrees
      const saturationBoost = 1 + rawEnergy * 0.2; // Reduced range: 1.0 to 1.2
      const brightnessFactor = 1 + visualIntensity * 0.05; // Reduced range

      // Use CSS variable batching if available
      const queueCSSUpdate = (property, value) => {
        if (this.year3000System && this.year3000System.queueCSSVariableUpdate) {
          this.year3000System.queueCSSVariableUpdate(property, value);
        } else {
          try {
            root.style.setProperty(property, value);
          } catch (e) {
            /* Silent catch */
          }
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

      // ===== SIMPLIFIED PATTERN EVOLUTION (CSS-only) =====
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
        `🌌 [${this.systemName}] Error in updateNexusTargets:`,
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

    // Set targets for lerping
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

    // Use unified service
    const musicData = this.musicSyncService?.getLatestProcessedData() || {};

    if (this.config.enableNexusMotion) {
      this.updateNexusMotion(musicData, deltaTime);
    }

    // Throttled updates with increased intervals for performance
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

    // Per-frame updates handled by animation coordinator
  }

  /**
   * Handle performance mode changes
   */
  onPerformanceModeChange(mode) {
    this._performanceMode = mode;

    if (mode === "performance") {
      this._maxFrameSkip = 3; // More aggressive frame skipping
      this.heavyUpdateInterval = 1000 / 5; // Reduce to 5fps for heavy updates
    } else {
      this._maxFrameSkip = 2; // Standard frame skipping
      this.heavyUpdateInterval = 1000 / 10; // Back to 10fps
    }

    if (this.config?.enableDebug) {
      console.log(`⚡ [${this.systemName}] Performance mode: ${mode}`);
    }
  }

  /**
   * Fallback animation loops
   */
  _startFallbackAnimationLoops() {
    if (this.year3000System && this.year3000System.registerConsolidatedTimer) {
      this.year3000System.registerConsolidatedTimer(
        "DimensionalNexusFrameUpdate",
        () => this.animateOptimizedNexusFrame(),
        1000 / 30, // 30fps
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

    // Simplified lerp with faster convergence
    const lerpSpeed = 0.15; // Increased from 0.1 for faster response

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
      1.0
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

    // Simplified user influence decay
    this.nexusState.userInfluence *= 0.99; // Faster decay for performance

    // Biometric state lerping
    const now = Date.now();
    const lerpDeltaTime =
      (now - (this.biometricState.lastMeditationUpdateTime || now)) / 1000;
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

    // Apply state to CSS (batched)
    this.applyOptimizedStateToCSS();

    if (this.config?.enableDebug && Math.random() < 0.005) {
      // Reduced debug frequency
      console.log(`🌌 [${this.systemName}] Nexus frame animated.`, {
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
        } catch (e) {
          /* Silent catch */
        }
      }
    };

    // Apply nexus state (reduced precision for performance)
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

    // Apply biometric state
    queueCSSUpdate(
      "--sn-sidebar-meditation-desaturation",
      this.biometricState.desaturation.toFixed(2)
    );
    queueCSSUpdate(
      "--sn-sidebar-meditation-slowdown",
      this.biometricState.slowdown.toFixed(2)
    );

    // Apply animation speed adjustments
    const adjustedNeuralSpeed = (2.0 / this.biometricState.slowdown).toFixed(1);
    const adjustedTemporalSpeed = (1.5 / this.biometricState.slowdown).toFixed(
      1
    );
    queueCSSUpdate("--sn-neural-flow-speed", `${adjustedNeuralSpeed}s`);
    queueCSSUpdate(
      "--sn-temporal-animation-speed",
      `${adjustedTemporalSpeed}s`
    );

    // Manage meditation class (immediate DOM operation)
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
      } catch (e) {
        /* Silent catch */
      }
    };

    safeSetProperty("--sn-nav-item-transform-scale", "1.0");
    safeSetProperty("--sn-sidebar-meditation-desaturation", "0");
    safeSetProperty("--sn-sidebar-meditation-slowdown", "1");
  }

  updateIntegrationMetrics() {
    const now = Date.now();

    if (now - this.systemIntegrationMetrics.lastSystemsCheck > 10000) {
      // Reduced frequency
      this.systemIntegrationMetrics.lastSystemsCheck = now;

      const memoryUsage = this._getMemoryUsage();
      const animationComplexity = this.calculateIntegrationComplexity();

      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.updateSystemMetrics("DimensionalNexusSystem", {
          memoryUsage: memoryUsage,
          errorCount: this.systemIntegrationMetrics.crossSystemErrors,
          animationComplexity: animationComplexity,
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

    // Simplified complexity calculation
    if (this.biometricState.isMeditating) complexity += 10;
    if (this.nexusState.currentNavigationScale > 1.01) complexity += 5;
    if (this.nexusState.volatility > 0.5) complexity += 10;

    return complexity;
  }

  performCleanup() {
    // Reset error counts
    this.systemIntegrationMetrics.crossSystemErrors = Math.max(
      0,
      this.systemIntegrationMetrics.crossSystemErrors - 1
    );

    // Clean up old interaction data
    const now = Date.now();
    if (now - this.biometricState.lastUserInteractionTime > 300000) {
      this.biometricState.lastUserInteractionTime = now - 30000;
    }
  }

  /**
   * Optimized navigation scale calculation (simplified)
   */
  calculateOptimizedNavigationScale(
    visualIntensity = 0.5,
    moodIdentifier = "neutral"
  ) {
    // Simplified calculation for performance
    const baseScale = 1.0 + visualIntensity * 0.02; // Reduced from 0.025

    // Simplified mood modifier
    let moodModifier = 0;
    if (
      moodIdentifier.includes("energetic") ||
      moodIdentifier.includes("danceable")
    ) {
      moodModifier = 0.003; // Reduced from 0.005
    }

    return Math.max(1.0, Math.min(1.025, baseScale + moodModifier)); // Reduced max from 1.03
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
        ) < 0.001,
    };
  }

  getMeditationReport() {
    const timeSinceLastInteraction =
      Date.now() - this.biometricState.lastUserInteractionTime;
    const currentDesaturation = this.biometricState.desaturation;
    const currentSlowdown = this.biometricState.slowdown;

    return {
      isMeditating: this.biometricState.isMeditating,
      timeSinceLastInteraction: Math.round(timeSinceLastInteraction / 1000),
      meditationGracePeriod: this.biometricState.meditationGracePeriod / 1000,
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
        `🌌 [${this.systemName}] Optimized dimensional nexus destroyed and cleaned up.`
      );
    }
  }
}
