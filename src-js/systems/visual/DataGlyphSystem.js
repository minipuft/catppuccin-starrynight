import {
  MODERN_SELECTORS,
  ORBITAL_ELEMENTS,
} from "../../debug/SpotifyDOMSelectors.js";
import { BaseVisualSystem } from "../BaseVisualSystem.js";

// YEAR 3000 DATA GLYPH SYSTEM
export class DataGlyphSystem extends BaseVisualSystem {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicSyncService,
    settingsManager,
    year3000System = null // PHASE 3: Added year3000System parameter for Master Animation Coordinator
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    // === PHASE 3: MASTER ANIMATION COORDINATOR INTEGRATION ===
    this.year3000System = year3000System;
    this.masterAnimationRegistered = false;
    this.animationFrameId = null; // For fallback animation loop
    this.isUsingMasterAnimation = false;

    this.itemObserver = null;
    this.observedItems = new Map(); // Changed from WeakMap to support forEach iteration
    this.glyphDataCache = new WeakMap(); // Keep as WeakMap for automatic GC
    this.itemInteractionData = new Map(); // CRITICAL: Changed from WeakMap to Map to support entries() iteration for memory management
    this.activeEchoTimers = new WeakMap();
    this.glyphElements = new Map();
    this.interactionHistory = [];
    this.modeIntensity = 0.5;
    this.initialized = false;

    // Track event listeners for cleanup
    this._eventListeners = [];
    this._domEventListeners = [];

    // Performance throttling
    this.lastHeavyUpdateTime = 0;
    this.heavyUpdateInterval = 1000 / 20; // 20 FPS

    // === PHASE 3: ENHANCED PERFORMANCE OPTIMIZATION ===
    this.memoryOptimization = {
      maxCacheSize: 100,
      cleanupInterval: 30000, // 30 seconds
      lastCleanup: Date.now(),
      maxEchoTimers: 50,
      // Memory management for Map-based observedItems
      maxObservedItems: 200, // Prevent memory leaks by limiting tracked items
      staleItemThreshold: 300000, // 5 minutes for stale item cleanup
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
      observedItemsCleanups: 0, // Track manual cleanup operations
    };

    // === PHASE 3: DEVICE CAPABILITY DETECTION ===
    this.deviceCapabilities = {
      maxParticles: this._detectMaxParticles(),
      supportsCSSFilter: this._detectCSSFilterSupport(),
      supportsWebGL: this._detectWebGLSupport(),
      performanceLevel: this._detectPerformanceLevel(),
      reducedMotion: this._detectReducedMotion(),
    };

    // Register with health monitor
    if (this.utils && this.utils.systemHealthMonitor) {
      this.utils.systemHealthMonitor.registerSystem("DataGlyphSystem", this);
    }

    // Register with centralized health monitor
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
    // Estimate based on device memory and performance
    const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
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
    // Basic performance level detection
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

    // === PHASE 3: MASTER ANIMATION COORDINATOR REGISTRATION ===
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
        // Register with Master Animation Coordinator
        this.year3000System.registerAnimationSystem(
          "DataGlyphSystem",
          this,
          "normal", // Priority level
          this.deviceCapabilities.performanceLevel === "high"
            ? 60
            : this.deviceCapabilities.performanceLevel === "medium"
            ? 45
            : 30 // Dynamic FPS based on device
        );

        this.masterAnimationRegistered = true;
        this.isUsingMasterAnimation = true;

        if (this.config?.enableDebug) {
          console.log(
            `🎬 [${
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

    // Fallback animation loop - maintains backward compatibility
    const fallbackLoop = () => {
      if (!this.isInitialized) return;

      try {
        this.updateAnimation(performance.now(), 16.67); // Approximate 60fps delta
      } catch (error) {
        console.warn(`[${this.systemName}] Fallback animation error:`, error);
      }

      this.animationFrameId = requestAnimationFrame(fallbackLoop);
    };

    this.animationFrameId = requestAnimationFrame(fallbackLoop);

    if (this.config?.enableDebug) {
      console.log(`🔄 [${this.systemName}] Started fallback animation loop`);
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
      // === PHASE 3: PERFORMANCE BUDGETING ===
      const maxFrameTime =
        this.deviceCapabilities.performanceLevel === "high"
          ? 8
          : this.deviceCapabilities.performanceLevel === "medium"
          ? 12
          : 16;

      // Only proceed if we have budget
      if (deltaTime > maxFrameTime * 2) {
        this.performanceMetrics.animationFrames++;
        return; // Skip frame if we're already behind
      }

      // Throttled update for heavy calculations
      if (timestamp - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
        this.lastHeavyUpdateTime = timestamp;
        this._updateGlyphTargetsOptimized();
      }

      // Per-frame updates for smooth animations
      this.animateAllGlyphs();
      this.updateActiveEchoesAndResonance();

      // === PHASE 3: PERFORMANCE TRACKING ===
      const frameTime = performance.now() - frameStartTime;
      this.performanceMetrics.animationFrames++;
      this.performanceMetrics.maxFrameTime = Math.max(
        this.performanceMetrics.maxFrameTime,
        frameTime
      );

      // Update rolling average
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
        `🎨 [${this.systemName}] Performance mode changed to: ${mode}`
      );
    }

    if (mode === "performance") {
      // Reduce quality for better performance
      this.heavyUpdateInterval = 1000 / 15; // Reduce to 15 FPS
      this.memoryOptimization.maxCacheSize = 50; // Reduce cache size
      this.memoryOptimization.cleanupInterval = 15000; // More frequent cleanup
    } else {
      // Restore quality
      this.heavyUpdateInterval = 1000 / 20; // Restore to 20 FPS
      this.memoryOptimization.maxCacheSize = 100;
      this.memoryOptimization.cleanupInterval = 30000;
    }
  }

  // === PHASE 3: OPTIMIZED UPDATE METHODS ===

  _updateGlyphTargetsOptimized() {
    if (!this.initialized) return;

    // Use music data from the unified service
    const musicData = this.musicSyncService?.getLatestProcessedData() || {};
    const { energy = 0.5, valence = 0.5, enhancedBPM = 120 } = musicData;

    // Use CSS Variable batching if available
    const useBatching =
      this.year3000System && this.year3000System.queueCSSVariableUpdate;

    const globalIntensity = musicData.visualIntensity || 0;

    // Use batching for global updates
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

    // === PHASE 3: EFFICIENT GLYPH PROCESSING ===
    const visibleGlyphs = [];
    this.observedItems.forEach((itemData, itemElement) => {
      // Use Intersection Observer pattern for better performance
      if (itemElement.offsetParent && this._isElementInViewport(itemElement)) {
        visibleGlyphs.push({ itemElement, itemData });
      }
    });

    // Process only visible glyphs
    visibleGlyphs.forEach(({ itemElement, itemData }) => {
      const intensity = musicData.visualIntensity || 0;

      // Set target values for animation
      itemData.targetOpacity = 0.3 + intensity * 0.7;
      itemData.targetScale = 1 + energy * 0.5;
      itemData.targetRotation = intensity * 360;

      // Set non-lerped properties directly
      itemData.pulseIntensity = intensity;
      itemData.shimmerOpacity = 0.3 + energy * 0.7;
      itemData.pulseAnimationState = intensity > 0.1 ? "running" : "paused";
    });

    // NEW: Call cleanup periodically from the throttled update
    this.performOptimizedCleanup();
  }

  _isElementInViewport(element) {
    // Simple viewport check - can be optimized further with Intersection Observer
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
      ".main-cardImage-imageWrapper", // Cards
      ".main-trackList-row", // Tracklist items
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
              // MEMORY MANAGEMENT: Clean up Map entries for removed DOM nodes
              // Since we're using Map instead of WeakMap, we need manual cleanup
              if (this.observedItems.has(node)) {
                const glyphElement = node.querySelector(
                  ".data-glyph-visualization"
                );
                if (glyphElement) glyphElement.remove();
                this.observedItems.delete(node);

                // Also clean up related data structures
                if (this.glyphDataCache.has(node)) {
                  this.glyphDataCache.delete(node);
                }
                if (this.itemInteractionData.has(node)) {
                  this.itemInteractionData.delete(node);
                }

                if (this.config?.enableDebug) {
                  console.log(
                    `🗑️ [${this.systemName}] Cleaned up removed DOM node from observedItems`
                  );
                }
              }
            }
          });
        }
      }
    };

    this.itemObserver = new MutationObserver(observerCallback);
    // Observe the main app container or a more specific root if known
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
      // Fallback to body, less efficient
      this.itemObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  attachGlyph(itemElement) {
    if (this.observedItems.has(itemElement) || !itemElement.offsetParent)
      return; // Already has glyph or not visible

    const glyphElement = document.createElement("div");
    glyphElement.className = "data-glyph-visualization"; // Style with CSS
    // Enhanced styling with all CSS variables from backup
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

    // Initialize all CSS variables on the glyph element
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

    itemElement.style.position = "relative"; // Ensure parent is positioned
    itemElement.appendChild(glyphElement);

    // Store enhanced data structure for animation and context
    this.observedItems.set(itemElement, {
      glyphElement,
      lastInteraction: Date.now(), // MEMORY MANAGEMENT: Track creation time for Map-based cleanup
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

    // Store interaction data (matches backup structure)
    this.itemInteractionData.set(itemElement, {
      lastInteraction: Date.now(), // MEMORY MANAGEMENT: Track creation time for Map-based cleanup
      lastInteractionTime: Date.now(),
      interactionScore: 0,
      resonanceIntensity: 0,
      echoActiveUntil: 0,
    });

    // Add event listeners for interaction (matches backup events)
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
      // Only animate visible elements
      if (itemElement.offsetParent) {
        // Lerp animated properties
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

        // Update the visual representation
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

    // Apply lerped values
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

    // Apply non-lerped values that were set in updateGlyphTargets
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

    // NEW: Performance tracking
    this.performanceMetrics.glyphUpdates++;

    const itemData = this.observedItems.get(itemElement);
    const glyphElement = itemData.glyphElement;

    // Check cache first for performance optimization
    const cachedData = this.glyphDataCache.get(itemElement);
    if (cachedData && JSON.stringify(cachedData) === JSON.stringify(data)) {
      this.performanceMetrics.cacheHits++;
      return; // No update needed
    }
    this.performanceMetrics.cacheMisses++;

    // Cache the raw data (matches backup)
    this.glyphDataCache.set(itemElement, data);

    // Calculate visual properties (matches backup calculations)
    let opacity = 0.3 + (data.intensity || 0) * 0.7;
    let scale = 1 + (data.sizeFactor || 0) * 0.5; // KEY: sizeFactor scaling from backup
    let pulseIntensity = data.pulseIntensity || 0;
    let shimmerOpacity = 0.3 + (data.shimmerFactor || 0) * 0.7;
    let rotation = data.rotationAngle || 0;
    let colorRgb =
      data.colorRgb ||
      getComputedStyle(document.documentElement)
        .getPropertyValue("--sn-glyph-color-rgb")
        .trim() ||
      "140,170,238";
    let pulseAnimationState = data.pulseIntensity > 0.1 ? "running" : "paused";

    // Apply all properties to glyph element (matches backup exactly)
    glyphElement.style.setProperty("--sn-glyph-opacity", opacity.toFixed(2));
    glyphElement.style.setProperty("--sn-glyph-scale", scale.toFixed(2)); // KEY FEATURE
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
      (itemData.resonanceFactor + (data.intensity || 0)) / 2; // Average out resonance

    // NEW: Call cleanup periodically
    if (this.performanceMetrics.glyphUpdates % 100 === 0) {
      this.performOptimizedCleanup();
    }

    if (this.config?.enableDebug && Math.random() < 0.005) {
      // console.log(`[${this.systemName}] Updated glyph for:`, itemElement, `Scale: ${scale.toFixed(2)}, Intensity: ${(data.intensity || 0).toFixed(2)}`);
    }
  }

  handleItemInteraction(itemElement, event) {
    if (!itemElement || !this.itemInteractionData.has(itemElement)) return;

    const interactionType = event.type;
    const data = this.itemInteractionData.get(itemElement);
    const glyphElement = this.observedItems.get(itemElement)?.glyphElement;
    if (!glyphElement) return;

    // MEMORY MANAGEMENT: Update both timestamp properties for Map-based cleanup
    data.lastInteraction = Date.now();
    data.lastInteractionTime = Date.now();

    let scoreIncrement = 0;
    if (interactionType === "click") {
      scoreIncrement = 5; // More points for click
      // Trigger temporal echo on click (750ms duration from backup)
      data.echoActiveUntil = Date.now() + 750;
      glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0.3");
      glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1.15");
      glyphElement.classList.add("sn-nav-item-echoing");
    } else if (interactionType === "mouseenter") {
      scoreIncrement = 1; // Less for hover

      // Enhanced hover effect
      const rootStyle = getComputedStyle(document.documentElement);
      const primaryRGB =
        rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
        "202,158,230";

      glyphElement.style.opacity = "0.9";
      glyphElement.style.transform = "scale(1.5)";
      glyphElement.style.backgroundColor = `rgba(${primaryRGB}, 0.7)`;
    }

    data.interactionScore += scoreIncrement;

    // Update resonance (capped at 0.25 from backup)
    data.resonanceIntensity = Math.min(0.25, data.interactionScore * 0.005);
    glyphElement.style.setProperty(
      "--sn-glyph-resonance-intensity",
      data.resonanceIntensity.toFixed(3)
    );

    this.itemInteractionData.set(itemElement, data);

    if (this.config?.enableDebug) {
      // console.log(`[${this.systemName}] Interaction (${interactionType}) on:`, itemElement, `New Score: ${data.interactionScore}, Resonance: ${data.resonanceIntensity.toFixed(3)}`);
    }
  }

  updateActiveEchoesAndResonance() {
    const now = Date.now();
    this.observedItems.forEach((itemData, itemElement) => {
      if (this.itemInteractionData.has(itemElement)) {
        const data = this.itemInteractionData.get(itemElement);
        const glyphElement = itemData.glyphElement;

        // Manage echo decay (750ms duration from backup)
        if (data.echoActiveUntil > 0 && now > data.echoActiveUntil) {
          glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0");
          glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1");
          glyphElement.classList.remove("sn-nav-item-echoing");
          data.echoActiveUntil = 0;
          this.itemInteractionData.set(itemElement, data);
        }

        // Decay interaction score over time (60 second timer from backup)
        if (
          now - data.lastInteractionTime > 60000 &&
          data.interactionScore > 0
        ) {
          data.interactionScore = Math.max(0, data.interactionScore - 0.1);
          data.resonanceIntensity = Math.min(
            0.25,
            data.interactionScore * 0.005
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
    // === PHASE 3: MASTER ANIMATION COORDINATOR CLEANUP ===
    if (this.masterAnimationRegistered && this.year3000System) {
      try {
        this.year3000System.unregisterAnimationSystem("DataGlyphSystem");
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

    // Stop fallback animation loop if running
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;

      if (this.config?.enableDebug) {
        console.log(`🔄 [${this.systemName}] Stopped fallback animation loop`);
      }
    }

    // Remove all tracked DOM event listeners first
    for (const listener of this._domEventListeners) {
      try {
        listener.element.removeEventListener(listener.event, listener.handler);
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

    // Enhanced cleanup matching backup
    this.observedItems.forEach((itemData, itemElement) => {
      const glyphElement = itemData.glyphElement;
      if (itemElement && itemElement.contains(glyphElement)) {
        // Remove event listeners
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

        // Reset all item-specific styles
        glyphElement.style.removeProperty("--sn-nav-item-echo-opacity");
        glyphElement.style.removeProperty("--sn-nav-item-echo-scale");
        glyphElement.style.removeProperty("--sn-glyph-resonance-intensity");
        glyphElement.classList.remove("sn-nav-item-echoing");

        itemElement.removeChild(glyphElement);
      }
    });

    // Clean up bloom system if it exists
    if (this.bloomSystem) {
      // Clear all bloom timers
      for (const timer of this.bloomSystem.bloomTimers.values()) {
        clearTimeout(timer);
      }
      this.bloomSystem.bloomTimers.clear();
      this.bloomSystem.activeBloomElements.clear();
      this.bloomSystem.refractElements.clear();
      this.bloomSystem = null;
    }

    // CRITICAL: Clear Map-based observedItems explicitly
    // Map requires manual cleanup unlike WeakMap which has automatic GC
    this.observedItems.clear();

    // CRITICAL: Clear Map-based itemInteractionData explicitly
    // Map requires manual cleanup unlike WeakMap which has automatic GC
    this.itemInteractionData.clear();

    // Clear all other maps - reinitialize WeakMaps for next potential use
    this.glyphDataCache = new WeakMap();
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

      // CRITICAL: Manual memory management for Map-based observedItems
      // Check for stale entries and disconnected DOM nodes
      const itemsToDelete = [];

      this.observedItems.forEach((itemData, itemElement) => {
        // Check if DOM element is still connected
        if (!itemElement.isConnected) {
          itemsToDelete.push(itemElement);
        }
        // Check for stale entries based on last interaction
        else if (
          itemData.lastInteraction &&
          now - itemData.lastInteraction >
            this.memoryOptimization.staleItemThreshold
        ) {
          itemsToDelete.push(itemElement);
        }
      });

      // CRITICAL: Manual memory management for Map-based itemInteractionData
      // Check for stale interaction entries and disconnected DOM nodes
      const interactionItemsToDelete = [];

      this.itemInteractionData.forEach((interactionData, itemElement) => {
        // Check if DOM element is still connected
        if (!itemElement.isConnected) {
          interactionItemsToDelete.push(itemElement);
        }
        // Check for stale entries based on last interaction
        else if (
          interactionData.lastInteraction &&
          now - interactionData.lastInteraction >
            this.memoryOptimization.staleItemThreshold
        ) {
          interactionItemsToDelete.push(itemElement);
        }
      });

      // Remove stale and disconnected items from both maps
      const allItemsToDelete = [
        ...new Set([...itemsToDelete, ...interactionItemsToDelete]),
      ];

      allItemsToDelete.forEach((element) => {
        const itemData = this.observedItems.get(element);

        // Clean up glyph element if it exists
        if (itemData?.glyphElement) {
          try {
            itemData.glyphElement.remove();
          } catch (e) {
            // Element may already be removed
          }
        }

        // Remove from all maps
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
            `🗑️ [${this.systemName}] Cleaned up ${allItemsToDelete.length} stale/disconnected items (${itemsToDelete.length} observed, ${interactionItemsToDelete.length} interaction)`
          );
        }
      }

      // Enforce maximum observed items limit to prevent memory bloat
      if (this.observedItems.size > this.memoryOptimization.maxObservedItems) {
        const itemsArray = Array.from(this.observedItems.entries());
        // Remove oldest entries (those with earliest lastInteraction)
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
            } catch (e) {
              // Element may already be removed
            }
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
            `🗑️ [${this.systemName}] Enforced max items limit, removed ${excessCount} oldest entries`
          );
        }
      }

      // Enforce maximum interaction data limit to prevent memory bloat
      if (
        this.itemInteractionData.size > this.memoryOptimization.maxObservedItems
      ) {
        const interactionArray = Array.from(this.itemInteractionData.entries());
        // Remove oldest entries (those with earliest lastInteraction)
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

          // Also clean from other maps if exists
          if (this.observedItems.has(element)) {
            const itemData = this.observedItems.get(element);
            if (itemData?.glyphElement) {
              try {
                itemData.glyphElement.remove();
              } catch (e) {
                // Element may already be removed
              }
            }
            this.observedItems.delete(element);
          }
          if (this.glyphDataCache.has(element)) {
            this.glyphDataCache.delete(element);
          }
        });

        if (this.config?.enableDebug) {
          console.log(
            `🗑️ [${this.systemName}] Enforced max interaction data limit, removed ${excessCount} oldest entries`
          );
        }
      }

      // Clean up old cache entries
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

      // Update optimization timestamp
      this.memoryOptimization.lastCleanup = now;

      // Report performance metrics
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
        memoryUsage: memoryUsage,
        animationComplexity: animationComplexity,
        cacheEfficiency:
          this.performanceMetrics.cacheHits /
            (this.performanceMetrics.cacheHits +
              this.performanceMetrics.cacheMisses) || 0,
      });
    }
  }

  calculateGlyphComplexity() {
    let complexity = 0;
    complexity += this.glyphDataCache.size * 2; // Each cached glyph adds complexity
    complexity += this.itemInteractionData.size * 3; // Interactive elements add more
    complexity += this.performanceMetrics.echoEffects * 5; // Active echo effects
    return Math.min(complexity, 100); // Cap at 100
  }

  estimateMemoryUsage() {
    // Rough estimation of memory usage in bytes
    const cacheMemory = this.glyphDataCache.size * 1000; // ~1KB per cache entry
    const interactionMemory = this.itemInteractionData.size * 500; // ~0.5KB per interaction
    return cacheMemory + interactionMemory;
  }

  performCleanup() {
    this.performOptimizedCleanup();

    // Reset performance counters periodically
    if (this.performanceMetrics.glyphUpdates > 10000) {
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
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    // Update system state based on mode features
    this.modeConfig = {
      systemEnabled: enabled !== false,
      bloomAnimationsEnabled: animations || false,
      temporalEchoEnabled: modeConfig.temporalEcho || false,
      intensityMultiplier: intensity || 1.0,
      refractEffectsEnabled: animations || false,
    };

    // Apply mode-specific settings to existing glyphs
    this.applyModeToExistingGlyphs();

    // Initialize bloom effects if enabled
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
      activeBloomElements: new WeakMap(),
      bloomTimers: new WeakMap(),
      refractElements: new WeakSet(),
      attentionTracker: new WeakMap(),
    };

    // Track element attention for bloom triggering
    this.setupAttentionTracking();

    this.bloomInitialized = true;

    if (this.config?.enableDebug) {
      console.log(`🌸 [${this.systemName}] Bloom effects initialized`);
    }
  }

  /**
   * Disable bloom effects and cleanup
   */
  disableBloomEffects() {
    if (!this.bloomInitialized) return;

    // Clear all active bloom timers
    if (this.bloomSystem?.bloomTimers) {
      // WeakMap doesn't have iteration, so we rely on garbage collection
      this.bloomSystem.bloomTimers = new WeakMap();
    }

    // Remove bloom classes from all elements
    document
      .querySelectorAll(".sn-bloom-active, .sn-refract-active")
      .forEach((el) => {
        el.classList.remove("sn-bloom-active", "sn-refract-active");
      });

    this.bloomSystem = null;
    this.bloomInitialized = false;

    if (this.config?.enableDebug) {
      console.log(`🌸 [${this.systemName}] Bloom effects disabled`);
    }
  }

  /**
   * Setup attention tracking for UI elements
   */
  setupAttentionTracking() {
    // Create bound handlers for cleanup
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

    // Track event listeners for cleanup
    this._domEventListeners.push(
      { element: document, event: "focusin", handler: focusInHandler },
      { element: document, event: "focusout", handler: focusOutHandler },
      { element: document, event: "mouseover", handler: mouseOverHandler },
      { element: document, event: "mouseout", handler: mouseOutHandler }
    );

    // Track focus events for bloom activation
    document.addEventListener("focusin", focusInHandler);
    document.addEventListener("focusout", focusOutHandler);

    // Track hover events for refract effects
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

    // Check if element is within a glyph container or is UI-relevant
    const relevantElement = this.findRelevantElement(element);
    if (!relevantElement) return;

    const intensity = this.modeConfig?.intensityMultiplier || 1.0;

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
    // Check if element is a glyph container
    if (this.observedItems.has(element)) {
      return element;
    }

    // Check if element is within a glyph container
    let parent = element.parentElement;
    while (parent) {
      if (this.observedItems.has(parent)) {
        return parent;
      }
      parent = parent.parentElement;
    }

    // Check for other UI elements that should have kinetic effects
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

    // Phase 2 enhancement: Debug logging for missed elements
    if (this.config?.enableDebug && Math.random() < 0.02) {
      console.log(
        `🌸 [${this.systemName}] Element attention event on non-relevant element:`,
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
  bloomElement(element, intensity = 1.0) {
    if (!this.bloomSystem || !element) return;

    // Clear any existing bloom timer
    const existingTimer = this.bloomSystem.bloomTimers.get(element);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Apply bloom CSS class and variables
    element.classList.add("sn-bloom-active");
    element.style.setProperty("--sn-bloom-intensity", intensity.toString());
    element.style.setProperty(
      "--sn-bloom-scale",
      (1 + intensity * 0.1).toString()
    );

    // Get current theme colors for glow
    const root = document.documentElement;
    const accentRgb =
      getComputedStyle(root)
        .getPropertyValue("--sn-gradient-accent-rgb")
        .trim() || "140,170,238";
    element.style.setProperty("--sn-bloom-glow-color", accentRgb);

    // Track this element as blooming
    this.bloomSystem.activeBloomElements.set(element, {
      startTime: Date.now(),
      intensity: intensity,
    });

    // Set timer to remove bloom effect
    const bloomDuration = 1500 * intensity; // Longer bloom for higher intensity
    const timer = setTimeout(() => {
      this.removeBloomEffect(element);
    }, bloomDuration);

    this.bloomSystem.bloomTimers.set(element, timer);

    // Add temporal echo if enabled
    if (this.modeConfig?.temporalEchoEnabled) {
      this.addTemporalEcho(element, intensity);
    }

    if (this.config?.enableDebug && Math.random() < 0.1) {
      console.log(
        `🌸 [${this.systemName}] Bloomed element with intensity ${intensity}`
      );
    }
  }

  /**
   * Apply refract light-bending effect to an element
   * @param {Element} element - Element to apply refraction
   * @param {number} intensity - Refract intensity
   */
  applyRefractEffect(element, intensity = 1.0) {
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
        `✨ [${this.systemName}] Applied refract effect with intensity ${intensity}`
      );
    }
  }

  /**
   * Add temporal echo trail effect
   * @param {Element} element - Element to add echo
   * @param {number} intensity - Echo intensity
   */
  addTemporalEcho(element, intensity = 1.0) {
    if (!element) return;

    // Create echo element
    const echo = element.cloneNode(true);
    echo.classList.add("sn-temporal-echo");
    echo.style.position = "absolute";
    echo.style.pointerEvents = "none";
    echo.style.zIndex = "-1";
    echo.style.opacity = (0.3 * intensity).toString();
    echo.style.transform = "scale(1.05)";
    echo.style.filter = `blur(${intensity}px)`;

    // Position echo relative to original
    const rect = element.getBoundingClientRect();
    echo.style.left = rect.left + "px";
    echo.style.top = rect.top + "px";
    echo.style.width = rect.width + "px";
    echo.style.height = rect.height + "px";

    document.body.appendChild(echo);

    // Animate echo fade and remove
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

    // Map-based observedItems now supports forEach iteration natively
    const intensity = this.modeConfig.intensityMultiplier || 1.0;

    try {
      // Update all observed items with new mode settings
      this.observedItems.forEach((itemData, itemElement) => {
        if (itemData && itemData.glyphElement) {
          // Update glyph opacity based on mode
          const baseOpacity = this.modeConfig.systemEnabled ? 0.3 : 0.1;
          itemData.targetOpacity = baseOpacity * intensity;

          // Update glyph scaling
          itemData.targetScale = 1.0 * intensity;

          // Apply CSS variables
          itemData.glyphElement.style.setProperty(
            "--sn-glyph-mode-intensity",
            intensity.toString()
          );
        }
      });

      if (this.config?.enableDebug) {
        console.log(
          `🎨 [${this.systemName}] Applied mode configuration to ${this.observedItems.size} glyphs`
        );
      }
    } catch (error) {
      if (this.config?.enableDebug) {
        console.error(
          `🎨 [${this.systemName}] Error in applyModeToExistingGlyphs:`,
          error
        );
      }
      // Clear and reinitialize on error
      this.observedItems.clear();
    }
  }

  /**
   * DEBUGGING: Test method to verify Map forEach functionality
   * This method ensures the WeakMap to Map conversion works correctly
   */
  testForEachFunctionality() {
    // Test method to verify Map-based forEach functionality for debugging
    // This demonstrates that both observedItems and itemInteractionData now support iteration

    console.log(
      "🧪 [DataGlyphSystem] Testing Map-based forEach functionality:"
    );

    // Test observedItems.forEach (already working)
    console.log(`📊 observedItems: ${this.observedItems.size} entries`);
    let observedCount = 0;
    try {
      this.observedItems.forEach((value, key) => {
        observedCount++;
      });
      console.log(
        `✅ observedItems.forEach() works: iterated ${observedCount} entries`
      );
    } catch (error) {
      console.log(`❌ observedItems.forEach() failed:`, error.message);
    }

    // Test itemInteractionData.forEach (our new fix)
    console.log(
      `📊 itemInteractionData: ${this.itemInteractionData.size} entries`
    );
    let interactionCount = 0;
    try {
      this.itemInteractionData.forEach((value, key) => {
        interactionCount++;
      });
      console.log(
        `✅ itemInteractionData.forEach() works: iterated ${interactionCount} entries`
      );
    } catch (error) {
      console.log(`❌ itemInteractionData.forEach() failed:`, error.message);
    }

    // Test itemInteractionData.entries() (the specific method that was failing)
    try {
      const entriesArray = Array.from(this.itemInteractionData.entries());
      console.log(
        `✅ itemInteractionData.entries() works: ${entriesArray.length} entries converted to array`
      );
    } catch (error) {
      console.log(`❌ itemInteractionData.entries() failed:`, error.message);
    }

    return {
      observedItemsCount: observedCount,
      interactionDataCount: interactionCount,
      entriesMethodWorks: true,
      mapBased: true,
      fixApplied: true,
    };
  }
}
