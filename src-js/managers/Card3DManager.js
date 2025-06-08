import { Year3000Utilities } from "../utils/Year3000Utilities.js";

export class Card3DManager {
  constructor(performanceMonitor, settingsManager) {
    this.performanceMonitor = performanceMonitor;
    this.settingsManager = settingsManager;
    this.isSupported = this.detect3DSupport();
    this.currentMode = "balanced"; // Default, will be updated by settingsManager
    this.mouseTrackingEnabled = true;
    this.activeCards = new Set();

    this.lastFrameTime = 0;
    this.frameThrottle = 16; // ~60fps, can be adjusted by apply3DMode

    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);

    // console.log(
    //   `StarryNight: 3D Cards ${
    //     this.isSupported ? "supported" : "not supported - using fallbacks"
    //   }`
    // );
  }

  detect3DSupport() {
    try {
      const testElement = document.createElement("div");
      testElement.style.transform = "perspective(1px) rotateX(1deg)";
      return testElement.style.transform !== "";
    } catch (error) {
      // console.warn("StarryNight: 3D transform support detection failed", error);
      return false;
    }
  }

  initialize() {
    if (!this.isSupported) {
      // console.log("StarryNight: Using 2D fallback mode for cards because 3D is not supported.");
      return;
    }
    // Initial mode set from settings
    const initialMode = this.settingsManager.get(
      "sn-3dMorphingMode",
      "balanced"
    );
    this.apply3DMode(initialMode);
    // apply3DMode itself might call setupMouseTracking etc. if mode is not 'disabled'

    document.addEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );

    // console.log("StarryNight: 3D card system initialized with mode:", this.currentMode);
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
    // Remove all 3D mode classes
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

  setupMouseTracking() {
    // Only card-specific mouse tracking - no global mouse tracking
  }

  setupCardObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches(".main-card-card")) {
              this.enhanceCard(node);
            }
            const cards =
              node.querySelectorAll && node.querySelectorAll(".main-card-card");
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
      ), // Throttle per-card mouse move
      mouseLeaveHandler: (event) =>
        this.handleCardMouseLeave(event, cardElement),
    };

    this.activeCards.add(cardElement); // Store element itself as key if cardData is not needed elsewhere by key

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
      // else {
      //  this.enablePerformanceMode(false); // Optionally disable perf mode if quality improves
      // }
    }, 5000);
  }

  enablePerformanceMode(enable) {
    if (enable) {
      if (!document.body.classList.contains("sn-performance-mode")) {
        document.body.classList.add("sn-performance-mode");
        this.frameThrottle = 32; // Reduce to ~30fps for global mouse
        // this.mouseTrackingEnabled = false; // Disabling this entirely might be too drastic for some modes
        // console.log("StarryNight: 3D card performance mode enabled");
      }
    } else {
      if (document.body.classList.contains("sn-performance-mode")) {
        document.body.classList.remove("sn-performance-mode");
        // Restore throttle based on currentMode
        this.apply3DMode(this.currentMode, true); // Pass true to skip re-setup
        // console.log("StarryNight: 3D card performance mode disabled");
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
      // Assuming 'default' or 'balanced' might be CSS only
      body.classList.add(`sn-3d-${mode}`);
    }

    this.currentMode = mode;

    if (mode === "disabled") {
      if (!skipSetup) this._internalDestroy();
      this.mouseTrackingEnabled = false;
      return;
    }

    // If previously disabled, or first time, setup internal systems
    if (!skipSetup) {
      this._internalDestroy(); // Clear previous state before setting up new one
      this._internalSetup();
    }

    this.mouseTrackingEnabled = true; // Generally enable unless mode specifically disables

    switch (mode) {
      case "minimal":
        this.frameThrottle = 32;
        break;
      case "intense":
        this.frameThrottle = 8;
        break;
      case "floating": // 'floating' and 'dynamic' might rely more on CSS animations
      case "dynamic":
        // this.mouseTrackingEnabled = false; // Re-evaluate if these modes need direct mouse tracking
        this.frameThrottle = 16;
        break;
      case "balanced":
      default:
        this.frameThrottle = 16;
        break;
    }
    // console.log(`StarryNight: 3D mode set to ${mode}, throttle ${this.frameThrottle}ms`);
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
    // console.log("StarryNight: 3D card system destroyed.");
  }

  handleSettingsChange(event) {
    if (event.detail.key === "sn-3dMorphingMode") {
      // YEAR3000_CONFIG might not be directly available here unless passed to constructor or imported.
      // For now, let's assume debug logging might need adjustment or rely on global YEAR3000_CONFIG if available.
      // It's better if SettingsManager/dependent services get a direct config reference for debugging purposes.
      const enableDebug = globalThis.YEAR3000_CONFIG?.enableDebug;
      if (enableDebug) {
        console.log(
          `[Card3DManager] Detected setting change for ${event.detail.key}. New value: ${event.detail.value}`
        );
      }
      this.apply3DMode(event.detail.value);
    }
  }
}
