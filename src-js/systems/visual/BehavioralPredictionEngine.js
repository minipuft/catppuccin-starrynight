import {
  MODERN_SELECTORS,
  ORBITAL_ELEMENTS,
  findElementsWithFallback,
} from "../../debug/SpotifyDOMSelectors.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

// YEAR 3000 BEHAVIORAL PREDICTION ENGINE - Performance Optimized
export class BehavioralPredictionEngine extends BaseVisualSystem {
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

    // Initialize prediction model (mapping from music context to predicted behavior)
    this.predictionModel = this.initializePredictionModel();

    // Active highlights tracking
    this.activeHighlights = new WeakMap();

    // Prediction configuration
    this.predictionSensitivity = 0.5;
    this.highlightResponsiveness = 0.8;

    // Track timers for cleanup
    this._activeTimers = [];
    this._eventListeners = [];

    // ===== OPTIMIZED QUANTUM EMPATHY (Year 3000 Core) =====
    this.quantumEmpathy = {
      enabled: false,
      empathyScore: 0.5,
      confidenceThreshold: 0.6,
      learningCurve: 0.8,

      // Core learning systems (KEEP)
      patternDatabase: new Map(),
      actionProbabilities: new Map(),
      interactionHistory: [],
      maxHistoryLength: 50, // Reduced from 100 for performance

      // Performance-optimized settings
      learningThrottleMs: 1000, // Learn patterns every 1 second instead of constantly
      predictionUpdateMs: 500, // Update predictions every 500ms instead of 200ms
      maxActiveAnimations: 5, // Limit concurrent animations

      // Empathy responsiveness
      maxWarmthIntensity: 0.8,
      currentActiveAnimations: 0,
    };

    // Mode configuration (set by updateModeConfiguration)
    this.modeConfig = null;

    if (this.config?.enableDebug) {
      console.log(
        `🌌 [${this.systemName}] Optimized Quantum Empathy system initialized.`
      );
    }
  }

  async initialize() {
    await super.initialize();

    // Initialize quantum empathy systems
    if (this.modeConfig?.quantumEmpathyEnabled) {
      this.initializeOptimizedQuantumEmpathy();
    }

    if (this.config?.enableDebug) {
      console.log(
        `🧠 [${this.systemName}] Initialized with empathy status: ${
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

    // Setup throttled interaction tracking (PERFORMANCE OPTIMIZED)
    this.setupOptimizedInteractionTracking();

    // Start efficient predictive highlighting
    this.startOptimizedPredictiveHighlighting();

    // Initialize selective anticipatory animations
    this.setupSelectiveAnticipatoryAnimations();

    this.quantumEmpathyInitialized = true;

    if (this.config?.enableDebug) {
      console.log(
        `🌟 [${this.systemName}] Optimized Quantum Empathy online - sensing with cosmic efficiency...`
      );
    }
  }

  /**
   * Setup performance-optimized interaction tracking
   */
  setupOptimizedInteractionTracking() {
    // Track only key interaction events with throttling
    const keyInteractionEvents = ["click", "focus"]; // Reduced from all events
    let lastLearningTime = 0;

    keyInteractionEvents.forEach((eventType) => {
      const handler = (event) => {
        const now = Date.now();

        // Throttle learning to every 1 second for performance
        if (now - lastLearningTime > this.quantumEmpathy.learningThrottleMs) {
          this.recordOptimizedInteraction(event);
          lastLearningTime = now;
        }
      };

      document.addEventListener(eventType, handler, { passive: true });

      // Track for cleanup
      this._eventListeners.push({
        element: document,
        event: eventType,
        handler: handler,
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
      context: this.getCurrentMusicContext(), // Simplified context
    };

    // Add to interaction history with size limit
    this.quantumEmpathy.interactionHistory.push(interaction);
    if (
      this.quantumEmpathy.interactionHistory.length >
      this.quantumEmpathy.maxHistoryLength
    ) {
      this.quantumEmpathy.interactionHistory.shift();
    }

    // Learn from pattern (optimized)
    this.learnFromInteractionOptimized(interaction);
  }

  /**
   * Generate a lightweight element signature
   */
  getElementSignature(element) {
    if (!element) return "unknown";

    // Simplified signature for performance
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
      timeSegment: Math.floor(new Date().getHours() / 6), // 4 time segments instead of 24 hours
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

    // Limit context history for memory efficiency
    if (pattern.contexts.length > 3) {
      // Reduced from 10
      pattern.contexts.shift();
    }

    // Simplified confidence calculation
    const recencyFactor = Math.exp(-(Date.now() - pattern.lastUsed) / 60000); // 1 minute decay
    pattern.confidence = Math.min(1.0, (pattern.frequency / 5) * recencyFactor);

    // Cleanup old patterns for memory management
    if (this.quantumEmpathy.patternDatabase.size > 100) {
      this.cleanupOldPatterns();
    }
  }

  /**
   * Cleanup old patterns for memory efficiency
   */
  cleanupOldPatterns() {
    const cutoffTime = Date.now() - 300000; // 5 minutes
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

    // Only analyze top patterns for performance
    const sortedPatterns = Array.from(
      this.quantumEmpathy.patternDatabase.entries()
    )
      .sort(([, a], [, b]) => b.confidence - a.confidence)
      .slice(0, 10); // Top 10 patterns only

    sortedPatterns.forEach(([key, pattern]) => {
      const [target, action] = key.split(":");

      // Simplified context similarity
      const contextSimilarity = this.calculateSimplifiedContextSimilarity(
        pattern.contexts,
        currentContext
      );

      // Combined probability
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

    // Store top 3 predictions only
    this.quantumEmpathy.actionProbabilities = new Map(
      predictions.slice(0, 3).map((p) => [`${p.target}:${p.action}`, p])
    );
  }

  /**
   * Simplified context similarity for performance
   */
  calculateSimplifiedContextSimilarity(pastContexts, currentContext) {
    if (!pastContexts.length) return 0;

    // Only use most recent context for performance
    const recentContext = pastContexts[pastContexts.length - 1];
    let similarity = 0;
    let factors = 0;

    // Energy similarity
    if (
      recentContext.energy !== undefined &&
      currentContext.energy !== undefined
    ) {
      similarity += 1 - Math.abs(recentContext.energy - currentContext.energy);
      factors++;
    }

    // Valence similarity
    if (
      recentContext.valence !== undefined &&
      currentContext.valence !== undefined
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
    // Only apply if we haven't hit the animation limit
    if (
      this.quantumEmpathy.currentActiveAnimations >=
      this.quantumEmpathy.maxActiveAnimations
    ) {
      return;
    }

    this.quantumEmpathy.actionProbabilities.forEach((prediction, key) => {
      const elements = this.findElementsBySignature(prediction.target);

      // Only animate the first matching element for performance
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
      return Array.from(document.querySelectorAll(selector)).slice(0, 2); // Limit to 2 elements
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
        `✨ [${this.systemName}] Selective anticipatory animations ready`
      );
    }
  }

  /**
   * Optimized anticipatory animation
   */
  triggerOptimizedAnticipatoryAnimation(element, actionType, confidence) {
    if (!element || !this.modeConfig?.quantumEmpathyEnabled) return;

    // Check animation limit
    if (
      this.quantumEmpathy.currentActiveAnimations >=
      this.quantumEmpathy.maxActiveAnimations
    ) {
      return;
    }

    const intensity =
      confidence * (this.modeConfig?.intensityMultiplier || 1.0);

    // Set animation variables
    element.style.setProperty(
      "--sn-anticipatory-intensity",
      intensity.toString()
    );
    element.style.setProperty(
      "--sn-anticipatory-confidence",
      confidence.toString()
    );

    // Simplified animation classes
    let animationClass = "sn-anticipatory-generic";
    if (actionType === "click") animationClass = "sn-anticipatory-click";

    element.classList.add(animationClass);
    this.quantumEmpathy.currentActiveAnimations++;

    // Remove animation after completion
    setTimeout(() => {
      element.classList.remove(animationClass);
      element.style.removeProperty("--sn-anticipatory-intensity");
      element.style.removeProperty("--sn-anticipatory-confidence");
      this.quantumEmpathy.currentActiveAnimations--;
    }, 800);

    if (this.config?.enableDebug && Math.random() < 0.2) {
      console.log(
        `🌟 [${
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

    // Enhanced context analysis with optimized quantum empathy
    const currentContext = {
      ...this.getCurrentMusicContext(),
      trackUri,
      musicData: processedMusicData,
    };

    // Traditional prediction system (preserved for backward compatibility)
    const predictions = this.generatePredictions(currentContext);
    this.applyHighlights(predictions);

    // Quantum empathy integration (optimized)
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
        context.valence > 0.5 ? "lowEnergyHighValence" : "lowEnergyLowValence";
    }

    const predictedBehavior =
      this.predictionModel[predictionKey] || this.predictionModel.default;

    if (this.config?.enableDebug && Math.random() < 0.05) {
      console.log(
        `🔮 [${this.systemName}] Context: E=${context.energy.toFixed(
          2
        )}, V=${context.valence.toFixed(2)} → ${predictionKey}`
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
        `🌟 [${
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
        `🎨 [${this.systemName}] Updating cosmic mode configuration:`,
        modeConfig
      );
    }

    this.modeConfig = {
      systemEnabled: enabled !== false,
      quantumEmpathyEnabled: quantumEmpathy || false,
      predictiveHighlightingEnabled: quantumEmpathy || false,
      intensityMultiplier: intensity || 1.0,
    };

    this.updatePredictionBehaviorForMode();
  }

  updatePredictionBehaviorForMode() {
    if (!this.modeConfig) return;

    const baseIntensity = this.modeConfig.intensityMultiplier || 1.0;

    this.predictionSensitivity = this.modeConfig.quantumEmpathyEnabled
      ? baseIntensity * 1.5
      : baseIntensity * 0.7;

    this.highlightResponsiveness = this.modeConfig.predictiveHighlightingEnabled
      ? baseIntensity * 1.2
      : baseIntensity * 0.5;

    if (this.config?.enableDebug) {
      console.log(
        `✨ [${this.systemName}] Updated cosmic sensitivity: ${this.predictionSensitivity}, responsiveness: ${this.highlightResponsiveness}`
      );
    }
  }

  destroy() {
    // Clear all active timers
    for (const timer of this._activeTimers) {
      clearInterval(timer);
    }
    this._activeTimers.length = 0;

    // Clean up event listeners
    for (const listener of this._eventListeners) {
      try {
        listener.element.removeEventListener(listener.event, listener.handler);
      } catch (error) {
        console.error(
          `[${this.systemName}] Failed to remove event listener:`,
          error
        );
      }
    }
    this._eventListeners.length = 0;

    // Clear highlights
    this.activeHighlights.forEach((highlight) => {
      clearTimeout(highlight.timeoutId);
    });
    this.activeHighlights.clear();

    super.destroy();
    if (this.config?.enableDebug) {
      console.log(
        `🌌 [${this.systemName}] Cosmic systems powered down and cleaned up.`
      );
    }
  }

  // === TESTING METHODS ===

  testUpdatedSelectors() {
    console.group(`🔮 [${this.systemName}] Cosmic Selector Testing`);

    const testPredictions = this.initializePredictionModel();
    let totalFound = 0;
    let totalMissed = 0;

    Object.entries(testPredictions).forEach(([mood, prediction]) => {
      console.log(`🎭 Testing ${mood} prediction targets:`);

      prediction.targetElements.forEach((selector) => {
        const elements = findElementsWithFallback(selector);
        const count = elements.length;

        if (count > 0) {
          totalFound += count;
          console.log(`  ✅ ${selector}: ${count} elements`);
        } else {
          totalMissed++;
          console.warn(`  ❌ ${selector}: No elements found`);
        }
      });
    });

    console.log(
      `📊 Cosmic Results: ${totalFound} elements found, ${totalMissed} selectors failed`
    );
    console.groupEnd();

    return { found: totalFound, missed: totalMissed };
  }

  simulateHighlighting() {
    console.log(
      `🔮 [${this.systemName}] Simulating cosmic behavioral prediction highlighting...`
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
      `🌟 Cosmic simulation complete - Check for highlights on UI elements!`
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
        duration: 1000,
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
        duration: 3000,
      },
      default: {
        targetElements: [ORBITAL_ELEMENTS.libraryItems],
        highlightType: "gentle-flow",
        duration: 2000,
      },
    };
  }

  _performAdditionalDependencyValidation() {
    // This system depends on the Master Animation Coordinator
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

    // Use latest music data from unified service
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
    // ... existing code ...
  }
}
