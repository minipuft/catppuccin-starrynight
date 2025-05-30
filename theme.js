(async function catppuccinStarryNight() {
  if (
    !(
      Spicetify.Platform &&
      Spicetify.React &&
      Spicetify.ReactDOM &&
      Spicetify.Config &&
      Spicetify.Platform.History
    )
  ) {
    setTimeout(catppuccinStarryNight, 100);
    return;
  }

  // =============================================================================
  // PHASE 1: PERFORMANCE MONITORING & OPTIMIZATION MODULE
  // =============================================================================
  class PerformanceMonitor {
    constructor() {
      this.metrics = {
        colorExtractionTime: [],
        memoryUsage: [],
        frameRate: [],
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
        // Keep only last 10 measurements
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
      });
    }

    detectMemoryPressure() {
      // Simple memory pressure detection
      if (performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        return used / total > 0.8 ? "high" : "normal";
      }
      return "unknown";
    }

    shouldReduceQuality() {
      // Auto-reduce quality if performance is poor
      return (
        this.getAverageTime("colorExtractionTime") > 300 ||
        this.detectMemoryPressure() === "high"
      );
    }
  }

  // =============================================================================
  // PHASE 1: ENHANCED COLOR SCIENCE MODULE
  // =============================================================================
  class ColorAnalyzer {
    constructor() {
      this.performanceMonitor = new PerformanceMonitor();
      this.lastExtraction = 0;
      this.throttleDelay = 500; // Prevent extraction spam
    }

    // Convert RGB to LAB color space for perceptual accuracy
    rgbToLab(r, g, b) {
      // Normalize RGB values
      r = r / 255;
      g = g / 255;
      b = b / 255;

      // Apply gamma correction
      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

      // Convert to XYZ
      let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
      let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
      let z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

      // Convert to LAB
      x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

      return [
        116 * y - 16, // L
        500 * (x - y), // A
        200 * (y - z), // B
      ];
    }

    // Calculate perceptual color distance using deltaE
    calculateDeltaE(lab1, lab2) {
      const deltaL = lab1[0] - lab2[0];
      const deltaA = lab1[1] - lab2[1];
      const deltaB = lab1[2] - lab2[2];
      return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
    }

    // Enhanced color extraction with performance optimization
    extractDominantColorsAdvanced(imageData) {
      const startTime = this.performanceMonitor.startTiming(
        "colorExtractionTime"
      );

      // Adaptive sampling based on performance
      const quality = this.performanceMonitor.shouldReduceQuality()
        ? "low"
        : "high";
      const step = quality === "low" ? 8 : 4;
      const maxSamples = quality === "low" ? 5000 : 10000;

      const colorClusters = new Map();
      let sampleCount = 0;

      // Sample pixels with improved algorithm
      for (
        let i = 0;
        i < imageData.length && sampleCount < maxSamples;
        i += step * 4
      ) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Enhanced filtering for better color selection
        if (a < 128) continue; // Skip transparent
        if (r + g + b < 60 || r + g + b > 600) continue; // Skip too dark/light

        // Skip colors that are too desaturated
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max - min < 30) continue; // Skip grayscale colors

        const lab = this.rgbToLab(r, g, b);
        let clustered = false;

        // Find similar color cluster using LAB distance
        for (const [clusterLab, cluster] of colorClusters) {
          if (this.calculateDeltaE(lab, clusterLab) < 15) {
            cluster.count++;
            cluster.totalR += r;
            cluster.totalG += g;
            cluster.totalB += b;
            clustered = true;
            break;
          }
        }

        // Create new cluster if no similar color found
        if (!clustered) {
          colorClusters.set(lab, {
            count: 1,
            totalR: r,
            totalG: g,
            totalB: b,
            lab: lab,
          });
        }

        sampleCount++;
      }

      // Sort clusters by frequency and get top colors
      const sortedClusters = Array.from(colorClusters.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const processingTime = this.performanceMonitor.endTiming(
        "colorExtractionTime",
        startTime
      );

      if (sortedClusters.length === 0) {
        return {
          primary: "#1e1e2e", // fallback to catppuccin base
          secondary: "#313244", // fallback to catppuccin surface0
        };
      }

      // Calculate average colors for each cluster
      const primary = sortedClusters[0];
      const secondary = sortedClusters[1] || primary;

      const primaryColor = `rgb(${Math.round(
        primary.totalR / primary.count
      )}, ${Math.round(primary.totalG / primary.count)}, ${Math.round(
        primary.totalB / primary.count
      )})`;
      const secondaryColor = `rgb(${Math.round(
        secondary.totalR / secondary.count
      )}, ${Math.round(secondary.totalG / secondary.count)}, ${Math.round(
        secondary.totalB / secondary.count
      )})`;

      console.log(
        `StarryNight: Enhanced color extraction completed in ${processingTime.toFixed(
          2
        )}ms`
      );

      return {
        primary: primaryColor,
        secondary: secondaryColor,
        quality: quality,
        processingTime: processingTime,
      };
    }

    // Smart throttling to prevent extraction spam
    shouldExtract() {
      const now = Date.now();
      if (now - this.lastExtraction < this.throttleDelay) {
        return false;
      }
      this.lastExtraction = now;
      return true;
    }
  }

  // =============================================================================
  // PHASE 1: GLASSMORPHISM MANAGEMENT & INTEGRATION
  // =============================================================================
  class GlassmorphismManager {
    constructor(performanceMonitor, settingsManager) {
      this.performanceMonitor = performanceMonitor;
      this.settingsManager = settingsManager;
      this.isSupported = this.detectBackdropFilterSupport();
      this.currentIntensity = "balanced";

      console.log(
        `StarryNight: Glassmorphism ${
          this.isSupported ? "supported" : "not supported - using fallbacks"
        }`
      );
    }

    // Detect browser support for backdrop-filter
    detectBackdropFilterSupport() {
      try {
        return (
          CSS.supports("backdrop-filter", "blur(1px)") ||
          CSS.supports("-webkit-backdrop-filter", "blur(1px)")
        );
      } catch (error) {
        console.warn(
          "StarryNight: CSS.supports not available, assuming no backdrop-filter support"
        );
        return false;
      }
    }

    // Apply glassmorphism settings with performance consideration
    applyGlassmorphismSettings(intensity) {
      const body = document.body;

      // Remove existing glassmorphism classes
      body.classList.remove(
        "sn-glass-disabled",
        "sn-glass-minimal",
        "sn-glass-intense"
      );

      // Apply new intensity class if not balanced (default)
      if (intensity !== "balanced") {
        body.classList.add(`sn-glass-${intensity}`);
      }

      this.currentIntensity = intensity;

      // Update CSS variables based on performance and intensity
      this.updateGlassVariables(intensity);

      console.log(`StarryNight: Glassmorphism intensity set to ${intensity}`);
    }

    // Update CSS variables dynamically based on intensity and performance
    updateGlassVariables(intensity) {
      const root = document.documentElement;

      // Performance-aware variable adjustment
      const shouldReduceQuality = this.performanceMonitor.shouldReduceQuality();

      let blurValue, opacityValue, saturationValue;

      switch (intensity) {
        case "disabled":
          // Variables handled by CSS class, no need to set here
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

      // Apply performance-optimized values
      root.style.setProperty("--glass-blur", blurValue);
      root.style.setProperty("--glass-opacity", opacityValue);
      root.style.setProperty("--glass-saturation", saturationValue);

      // Adjust for mobile devices
      if (window.innerWidth <= 768) {
        const mobileBlur = parseInt(blurValue) * 0.75 + "px";
        const mobileOpacity = parseFloat(opacityValue) * 0.8;
        root.style.setProperty("--glass-blur", mobileBlur);
        root.style.setProperty("--glass-opacity", mobileOpacity.toString());
      }
    }

    // Integrate glassmorphism with dynamic color extraction
    updateGlassColors(primaryColor, secondaryColor) {
      if (!this.isSupported || this.currentIntensity === "disabled") {
        return;
      }

      const root = document.documentElement;

      // Convert RGB colors to glass background colors
      const glassPrimary = this.convertToGlassColor(primaryColor, 0.1);
      const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);

      // Update glass color variables
      root.style.setProperty("--glass-background", glassPrimary);
      root.style.setProperty("--glass-border", glassSecondary);

      console.log(
        `StarryNight: Glass colors updated - Primary: ${glassPrimary}, Border: ${glassSecondary}`
      );
    }

    // Convert RGB color to glass-compatible RGBA
    convertToGlassColor(color, opacity) {
      try {
        // Handle rgb() format
        if (color.startsWith("rgb(")) {
          const values = color.match(/\d+/g);
          if (values && values.length >= 3) {
            return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
          }
        }

        // Handle hex format
        if (color.startsWith("#")) {
          const hex = color.slice(1);
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }

        // Fallback to white glass
        return `rgba(255, 255, 255, ${opacity})`;
      } catch (error) {
        console.warn(
          "StarryNight: Error converting color to glass format:",
          error
        );
        return `rgba(255, 255, 255, ${opacity})`;
      }
    }

    // Performance monitoring integration
    checkPerformanceAndAdjust() {
      const shouldReduce = this.performanceMonitor.shouldReduceQuality();

      if (shouldReduce && this.currentIntensity === "intense") {
        console.log(
          "StarryNight: Reducing glassmorphism intensity due to performance"
        );
        this.applyGlassmorphismSettings("balanced");
        return true;
      }

      return false;
    }

    // Get current settings for React component
    getCurrentSettings() {
      return {
        intensity: this.currentIntensity,
        isSupported: this.isSupported,
        performanceReduced: this.performanceMonitor.shouldReduceQuality(),
      };
    }
  }

  // =============================================================================
  // PHASE 2: ENHANCED SETTINGS MANAGEMENT & VALIDATION
  // =============================================================================
  class SettingsManager {
    constructor() {
      this.prefix = "catppuccin-starrynight";
      this.validationSchemas = {
        "catppuccin-accentColor": {
          type: "string",
          allowedValues: accents,
          default: "none",
        },
        "sn-gradientIntensity": {
          type: "string",
          allowedValues: gradientIntensityOptions.map((opt) => opt.value),
          default: "balanced",
        },
        "sn-starDensity": {
          type: "string",
          allowedValues: starDensityOptions.map((opt) => opt.value),
          default: "balanced",
        },
        "sn-performanceQuality": {
          type: "string",
          allowedValues: performanceOptions.map((opt) => opt.value),
          default: "auto",
        },
        // PHASE 1: Glassmorphism settings validation
        "sn-glassmorphismIntensity": {
          type: "string",
          allowedValues: ["disabled", "minimal", "balanced", "intense"],
          default: "balanced",
        },
        // PHASE 3: 3D card morphing settings validation
        "sn-3dMorphingMode": {
          type: "string",
          allowedValues: [
            "disabled",
            "minimal",
            "balanced",
            "intense",
            "floating",
          ],
          default: "balanced",
        },
      };
    }

    // Safe localStorage getter with validation
    get(key) {
      try {
        const value = localStorage.getItem(key);
        const schema = this.validationSchemas[key];

        if (!schema) {
          console.warn(`StarryNight: No validation schema for key: ${key}`);
          return value;
        }

        // Validate against schema
        if (
          value &&
          schema.allowedValues &&
          !schema.allowedValues.includes(value)
        ) {
          console.warn(
            `StarryNight: Invalid value '${value}' for ${key}, using default`
          );
          return schema.default;
        }

        return value || schema.default;
      } catch (error) {
        console.error(
          `StarryNight: Error reading localStorage key ${key}:`,
          error
        );
        return this.validationSchemas[key]?.default || null;
      }
    }

    // Safe localStorage setter with validation
    set(key, value) {
      try {
        const schema = this.validationSchemas[key];

        if (
          schema &&
          schema.allowedValues &&
          !schema.allowedValues.includes(value)
        ) {
          console.error(
            `StarryNight: Cannot set invalid value '${value}' for ${key}`
          );
          return false;
        }

        localStorage.setItem(key, value);
        console.log(`StarryNight: Settings updated - ${key}: ${value}`);
        return true;
      } catch (error) {
        console.error(
          `StarryNight: Error setting localStorage key ${key}:`,
          error
        );
        return false;
      }
    }

    // Get all settings with validation
    getAllSettings() {
      const settings = {};
      Object.keys(this.validationSchemas).forEach((key) => {
        settings[key] = this.get(key);
      });
      return settings;
    }

    // Validate current localStorage state and fix issues
    validateAndRepair() {
      let repaired = 0;
      Object.keys(this.validationSchemas).forEach((key) => {
        const currentValue = localStorage.getItem(key);
        const validValue = this.get(key); // This will auto-validate

        if (currentValue !== validValue) {
          this.set(key, validValue);
          repaired++;
        }
      });

      if (repaired > 0) {
        console.log(`StarryNight: Repaired ${repaired} invalid settings`);
      }

      return repaired;
    }
  }

  // =============================================================================
  // EXISTING CODE WITH ENHANCED INTEGRATION
  // =============================================================================

  // Initialize settings manager
  const settingsManager = new SettingsManager();

  // Initialize our new modules
  const colorAnalyzer = new ColorAnalyzer();

  // PHASE 1: Initialize glassmorphism manager
  const glassmorphismManager = new GlassmorphismManager(
    colorAnalyzer.performanceMonitor,
    settingsManager
  );

  // =============================================================================
  // PHASE 3: 3D CARD INTERACTION & MOUSE TRACKING SYSTEM
  // =============================================================================
  class Card3DManager {
    constructor(performanceMonitor, settingsManager) {
      this.performanceMonitor = performanceMonitor;
      this.settingsManager = settingsManager;
      this.isSupported = this.detect3DSupport();
      this.currentMode = "balanced";
      this.mouseTrackingEnabled = true;
      this.activeCards = new Set();

      // Mouse tracking state
      this.mouseX = 0;
      this.mouseY = 0;
      this.isMouseInside = false;

      // Performance throttling
      this.lastFrameTime = 0;
      this.frameThrottle = 16; // ~60fps

      console.log(
        `StarryNight: 3D Cards ${
          this.isSupported ? "supported" : "not supported - using fallbacks"
        }`
      );
    }

    // Detect browser support for 3D transforms
    detect3DSupport() {
      try {
        const testElement = document.createElement("div");
        testElement.style.transform = "perspective(1px) rotateX(1deg)";
        return testElement.style.transform !== "";
      } catch (error) {
        console.warn("StarryNight: 3D transform support detection failed");
        return false;
      }
    }

    // Initialize 3D card system
    initialize() {
      if (!this.isSupported) {
        console.log("StarryNight: Using 2D fallback mode for cards");
        return;
      }

      this.setupMouseTracking();
      this.setupCardObserver();
      this.setupPerformanceMonitoring();

      console.log("StarryNight: 3D card system initialized");
    }

    // Setup mouse tracking for 3D interactions
    setupMouseTracking() {
      const throttledMouseMove = this.throttle((event) => {
        this.updateMousePosition(event);
      }, this.frameThrottle);

      document.addEventListener("mousemove", throttledMouseMove);

      // Track mouse enter/leave for cards
      document.addEventListener("mouseenter", () => {
        this.isMouseInside = true;
      });

      document.addEventListener("mouseleave", () => {
        this.isMouseInside = false;
        this.resetMousePosition();
      });
    }

    // Update mouse position and apply 3D transforms
    updateMousePosition(event) {
      if (!this.mouseTrackingEnabled || !this.isSupported) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized mouse position (-1 to 1)
      this.mouseX = (event.clientX - centerX) / (rect.width / 2);
      this.mouseY = (event.clientY - centerY) / (rect.height / 2);

      // Clamp values
      this.mouseX = Math.max(-1, Math.min(1, this.mouseX));
      this.mouseY = Math.max(-1, Math.min(1, this.mouseY));

      // Update CSS variables for real-time 3D effects
      this.updateCSSVariables();
    }

    // Reset mouse position
    resetMousePosition() {
      this.mouseX = 0;
      this.mouseY = 0;
      this.updateCSSVariables();
    }

    // Update CSS custom properties for 3D transforms
    updateCSSVariables() {
      const root = document.documentElement;

      // Performance-aware updates
      const now = performance.now();
      if (now - this.lastFrameTime < this.frameThrottle) {
        return;
      }
      this.lastFrameTime = now;

      root.style.setProperty("--mouse-x", this.mouseX.toString());
      root.style.setProperty("--mouse-y", this.mouseY.toString());
      root.style.setProperty("--mouse-inside", this.isMouseInside ? "1" : "0");
    }

    // Setup card observer for dynamic card handling
    setupCardObserver() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
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

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Enhance existing cards
      document.querySelectorAll(".main-card-card").forEach((card) => {
        this.enhanceCard(card);
      });
    }

    // Enhance individual card with 3D interactions
    enhanceCard(card) {
      if (this.activeCards.has(card) || !this.isSupported) return;

      this.activeCards.add(card);

      // Add mouse tracking for individual cards
      card.addEventListener("mouseenter", (event) => {
        this.handleCardMouseEnter(event, card);
      });

      card.addEventListener("mousemove", (event) => {
        this.handleCardMouseMove(event, card);
      });

      card.addEventListener("mouseleave", (event) => {
        this.handleCardMouseLeave(event, card);
      });
    }

    // Handle card mouse enter
    handleCardMouseEnter(event, card) {
      card.style.transformStyle = "preserve-3d";
    }

    // Handle card mouse move for individual 3D rotation
    handleCardMouseMove(event, card) {
      if (
        !this.mouseTrackingEnabled ||
        this.performanceMonitor.shouldReduceQuality()
      ) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = (event.clientX - centerX) / (rect.width / 2);
      const mouseY = (event.clientY - centerY) / (rect.height / 2);

      // Apply individual card rotation
      const maxRotation = this.currentMode === "intense" ? 20 : 15;
      const rotateY = mouseX * maxRotation;
      const rotateX = -mouseY * maxRotation;

      card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
    }

    // Handle card mouse leave
    handleCardMouseLeave(event, card) {
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
    }

    // Setup performance monitoring for 3D effects
    setupPerformanceMonitoring() {
      setInterval(() => {
        if (this.performanceMonitor.shouldReduceQuality()) {
          this.enablePerformanceMode();
        }
      }, 5000);
    }

    // Enable performance mode for 3D effects
    enablePerformanceMode() {
      document.body.classList.add("sn-performance-mode");
      this.frameThrottle = 32; // Reduce to ~30fps
      this.mouseTrackingEnabled = false;

      console.log("StarryNight: 3D performance mode enabled");
    }

    // Apply 3D mode settings
    apply3DMode(mode) {
      const body = document.body;

      // Remove existing 3D mode classes
      body.classList.remove(
        "sn-3d-disabled",
        "sn-3d-minimal",
        "sn-3d-floating",
        "sn-3d-intense"
      );

      // Apply new mode
      if (mode !== "balanced") {
        body.classList.add(`sn-3d-${mode}`);
      }

      this.currentMode = mode;

      // Update performance settings based on mode
      switch (mode) {
        case "disabled":
          this.mouseTrackingEnabled = false;
          break;
        case "minimal":
          this.frameThrottle = 32;
          break;
        case "intense":
          this.frameThrottle = 8; // High refresh rate for smooth 3D
          break;
        case "floating":
          this.mouseTrackingEnabled = false; // Use CSS animations instead
          break;
        default: // balanced
          this.frameThrottle = 16;
          this.mouseTrackingEnabled = true;
          break;
      }

      console.log(`StarryNight: 3D mode set to ${mode}`);
    }

    // Utility: Throttle function for performance
    throttle(func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }

    // Get current 3D settings for React component
    getCurrentSettings() {
      return {
        mode: this.currentMode,
        isSupported: this.isSupported,
        mouseTrackingEnabled: this.mouseTrackingEnabled,
        performanceMode: this.performanceMonitor.shouldReduceQuality(),
      };
    }
  }

  // PHASE 3: Initialize 3D card manager
  const card3DManager = new Card3DManager(
    colorAnalyzer.performanceMonitor,
    settingsManager
  );

  // Accent colors
  const accents = [
    "none",
    "rosewater",
    "flamingo",
    "pink",
    "maroon",
    "red",
    "peach",
    "yellow",
    "green",
    "teal",
    "sapphire",
    "blue",
    "sky",
    "mauve",
    "lavender",
  ];

  // StarryNight settings options
  const gradientIntensityOptions = [
    { value: "disabled", label: "Disabled" },
    { value: "minimal", label: "Minimal" },
    { value: "balanced", label: "Balanced" },
    { value: "intense", label: "Intense" },
  ];

  const starDensityOptions = [
    { value: "disabled", label: "Disabled" },
    { value: "minimal", label: "Minimal" },
    { value: "balanced", label: "Balanced" },
    { value: "intense", label: "Intense" },
  ];

  // Phase 1: Performance quality options
  const performanceOptions = [
    { value: "auto", label: "Auto (Recommended)" },
    { value: "quality", label: "High Quality" },
    { value: "balanced", label: "Balanced" },
    { value: "performance", label: "Performance Mode" },
  ];

  // PHASE 1: Glassmorphism intensity options
  const glassmorphismOptions = [
    { value: "disabled", label: "Disabled" },
    { value: "minimal", label: "Minimal" },
    { value: "balanced", label: "Balanced" },
    { value: "intense", label: "Intense" },
  ];

  // PHASE 3: 3D morphing mode options
  const morphing3DOptions = [
    { value: "disabled", label: "Disabled" },
    { value: "minimal", label: "Minimal" },
    { value: "balanced", label: "Balanced" },
    { value: "intense", label: "Intense" },
    { value: "floating", label: "Floating Animation" },
  ];

  // Dynamic color extraction variables
  let currentTrackUri = null;
  let colorExtractionEnabled = true;

  // Function to extract colors from album cover art (StarryNight functionality)
  async function extractColorsFromCoverArt() {
    try {
      // Smart throttling to prevent extraction spam
      if (!colorAnalyzer.shouldExtract()) {
        console.log("StarryNight: Color extraction throttled");
        return;
      }

      const coverArt = document.querySelector(
        '.main-nowPlayingWidget-coverArt img, .main-image, [data-testid="cover-art-image"]'
      );
      if (!coverArt || !coverArt.src) {
        console.warn("StarryNight: Cover art not found");
        return;
      }

      // Get current track to avoid duplicate color extraction
      const currentTrack = Spicetify.Player.data?.track?.uri;
      if (currentTrack === currentTrackUri) {
        return; // Same track, don't re-extract
      }
      currentTrackUri = currentTrack;

      // Create a temporary canvas to extract colors
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = function () {
        try {
          // Optimize canvas size based on performance
          const maxSize = colorAnalyzer.performanceMonitor.shouldReduceQuality()
            ? 150
            : 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);

          canvas.width = Math.floor(img.width * scale);
          canvas.height = Math.floor(img.height * scale);

          // Use high-quality scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colors = colorAnalyzer.extractDominantColorsAdvanced(
            imageData.data
          );
          updateGradientColors(colors.primary, colors.secondary);

          // Log performance metrics periodically
          if (Math.random() < 0.1) {
            // 10% of the time
            colorAnalyzer.performanceMonitor.logMetrics();
          }
        } catch (error) {
          console.warn(
            "StarryNight: Error extracting colors from cover art:",
            error
          );
          // Fallback to catppuccin colors
          updateGradientColors(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--spice-base"
            ),
            getComputedStyle(document.documentElement).getPropertyValue(
              "--spice-surface0"
            )
          );
        }
      };

      img.onerror = function () {
        console.warn("StarryNight: Failed to load cover art image");
      };

      img.src = coverArt.src;
    } catch (error) {
      console.error("StarryNight: Error in color extraction:", error);
    }
  }

  // Update CSS gradient variables with extracted colors
  function updateGradientColors(primary, secondary) {
    const root = document.documentElement;

    // Update the CSS variables that control the StarryNight gradient
    root.style.setProperty("--gradient-main", primary);
    root.style.setProperty("--gradient-secondary", secondary);

    // Also update hover backgrounds to match the color scheme
    root.style.setProperty("--dynamic-card-hover-bg", `${secondary}20`);
    root.style.setProperty("--dynamic-track-hover-bg", `${secondary}15`);

    // PHASE 1: Update glassmorphism colors with extracted colors
    glassmorphismManager.updateGlassColors(primary, secondary);

    console.log(
      `StarryNight: Updated gradient colors - Primary: ${primary}, Secondary: ${secondary}`
    );
  }

  // Function to inject star container into DOM
  function injectStarContainer() {
    const existingContainer = document.querySelector(".sn-stars-container");
    if (existingContainer) {
      existingContainer.remove();
    }

    const starContainer = document.createElement("div");
    starContainer.className = "sn-stars-container";

    // Create stars
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("div");
      star.className = "star";
      if (Math.random() > 0.7) star.classList.add("twinkle");
      starContainer.appendChild(star);
    }

    document.body.appendChild(starContainer);
  }

  // Function to create shooting stars (StarryNight effect)
  function createShootingStar() {
    const shootingStar = document.createElement("div");
    shootingStar.className = "shootingstar";

    // Random position along the top edge
    shootingStar.style.left = Math.random() * window.innerWidth + "px";
    shootingStar.style.top = "-10px";

    document.body.appendChild(shootingStar);

    // Remove shooting star after animation completes
    setTimeout(() => {
      if (shootingStar.parentNode) {
        shootingStar.parentNode.removeChild(shootingStar);
      }
    }, 3000);
  }

  // Create shooting stars periodically
  function startShootingStars() {
    return setInterval(() => {
      // Only create shooting stars if they're not disabled
      const starSetting = localStorage.getItem("sn-starDensity") ?? "balanced";
      if (starSetting !== "disabled" && Math.random() < 0.3) {
        createShootingStar();
      }
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
  }

  // Function to apply StarryNight settings
  function applyStarryNightSettings(gradientIntensity, starDensity) {
    const body = document.body;

    // Remove existing StarryNight classes
    body.classList.remove(
      "sn-gradient-disabled",
      "sn-gradient-minimal",
      "sn-gradient-intense"
    );
    body.classList.remove(
      "sn-stars-disabled",
      "sn-stars-minimal",
      "sn-stars-intense"
    );

    // Apply gradient classes
    if (gradientIntensity !== "balanced") {
      body.classList.add(`sn-gradient-${gradientIntensity}`);
    }

    // Apply star classes
    if (starDensity !== "balanced") {
      body.classList.add(`sn-stars-${starDensity}`);
    }

    // Inject or remove star container based on setting
    if (starDensity === "disabled") {
      const container = document.querySelector(".sn-stars-container");
      if (container) container.remove();
    } else {
      injectStarContainer();
    }
  }

  // Create our enhanced section with both Catppuccin and StarryNight controls
  const Section = Spicetify.React.memo(() => {
    const colorScheme = Spicetify.Config.color_scheme || "mocha";

    // Catppuccin settings with validation
    const initialAccent = settingsManager.get("catppuccin-accentColor");
    const [selectedAccent, setSelectedAccent] =
      Spicetify.React.useState(initialAccent);

    // StarryNight settings with validation
    const initialGradient = settingsManager.get("sn-gradientIntensity");
    const initialStars = settingsManager.get("sn-starDensity");
    const initialPerformance = settingsManager.get("sn-performanceQuality");
    const [gradientIntensity, setGradientIntensity] =
      Spicetify.React.useState(initialGradient);
    const [starDensity, setStarDensity] =
      Spicetify.React.useState(initialStars);
    const [performanceQuality, setPerformanceQuality] =
      Spicetify.React.useState(initialPerformance);

    // PHASE 1: Glassmorphism settings with validation
    const initialGlass = settingsManager.get("sn-glassmorphismIntensity");
    const [glassmorphismIntensity, setGlassmorphismIntensity] =
      Spicetify.React.useState(initialGlass);

    // PHASE 3: 3D morphing settings with validation
    const initial3DMode = settingsManager.get("sn-3dMorphingMode");
    const [morphing3DMode, setMorphing3DMode] =
      Spicetify.React.useState(initial3DMode);

    // Apply Catppuccin accent colors with validation
    Spicetify.React.useEffect(() => {
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
    }, [selectedAccent, colorScheme]);

    // Apply StarryNight settings with validation
    Spicetify.React.useEffect(() => {
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
    }, [gradientIntensity, starDensity]);

    // Apply performance quality settings with validation
    Spicetify.React.useEffect(() => {
      try {
        settingsManager.set("sn-performanceQuality", performanceQuality);

        // Update colorAnalyzer throttle delay based on performance setting
        switch (performanceQuality) {
          case "performance":
            colorAnalyzer.throttleDelay = 1000; // More aggressive throttling
            break;
          case "quality":
            colorAnalyzer.throttleDelay = 200; // Less throttling for quality
            break;
          case "balanced":
            colorAnalyzer.throttleDelay = 500; // Default
            break;
          case "auto":
          default:
            // Auto mode adjusts based on detected performance
            colorAnalyzer.throttleDelay =
              colorAnalyzer.performanceMonitor.shouldReduceQuality()
                ? 800
                : 300;
            break;
        }

        console.log(
          `StarryNight: Performance quality set to ${performanceQuality} (throttle: ${colorAnalyzer.throttleDelay}ms)`
        );
      } catch (error) {
        console.error(
          "StarryNight: Error applying performance settings:",
          error
        );
      }
    }, [performanceQuality]);

    // PHASE 1: Apply glassmorphism settings with validation
    Spicetify.React.useEffect(() => {
      try {
        glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);
        settingsManager.set(
          "sn-glassmorphismIntensity",
          glassmorphismIntensity
        );

        // PHASE 3: Initialize 3D card system
        card3DManager.initialize();
        card3DManager.apply3DMode(morphing3DMode);

        // Performance monitoring integration
        glassmorphismManager.checkPerformanceAndAdjust();

        console.log(
          `StarryNight: Glassmorphism intensity set to ${glassmorphismIntensity}`
        );
      } catch (error) {
        console.error(
          "StarryNight: Error applying glassmorphism settings:",
          error
        );
      }
    }, [glassmorphismIntensity, morphing3DMode]);

    // PHASE 3: Apply 3D morphing settings with validation
    Spicetify.React.useEffect(() => {
      try {
        card3DManager.apply3DMode(morphing3DMode);
        settingsManager.set("sn-3dMorphingMode", morphing3DMode);

        console.log(`StarryNight: 3D morphing mode set to ${morphing3DMode}`);
      } catch (error) {
        console.error(
          "StarryNight: Error applying 3D morphing settings:",
          error
        );
      }
    }, [morphing3DMode]);

    // Initialize StarryNight effects on component mount with proper cleanup and validation
    Spicetify.React.useEffect(() => {
      let playerCleanup = null;
      let shootingStarsInterval = null;
      let fallbackInterval = null;

      try {
        // Validate and repair settings on initialization
        settingsManager.validateAndRepair();

        // Initialize StarryNight settings
        applyStarryNightSettings(gradientIntensity, starDensity);

        // PHASE 1: Initialize glassmorphism settings
        glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);

        // PHASE 3: Initialize 3D card system
        card3DManager.initialize();
        card3DManager.apply3DMode(morphing3DMode);

        // Setup player listeners with cleanup
        playerCleanup = setupMusicPlayerListeners();

        // Start shooting stars
        setTimeout(() => {
          shootingStarsInterval = startShootingStars();
        }, 2000);

        // Fallback color extraction interval
        fallbackInterval = setInterval(() => {
          if (
            colorExtractionEnabled &&
            Spicetify.Player?.data?.track?.uri !== currentTrackUri
          ) {
            extractColorsFromCoverArt();
          }
        }, 3000);

        console.log(
          "StarryNight: Component effects initialized with validated settings"
        );
      } catch (error) {
        console.error(
          "StarryNight: Error during component initialization:",
          error
        );
      }

      // Cleanup function
      return () => {
        try {
          // Clean up player listeners
          if (playerCleanup && typeof playerCleanup === "function") {
            playerCleanup();
          }

          // Clear intervals
          if (shootingStarsInterval) {
            clearInterval(shootingStarsInterval);
          }
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
          }

          console.log("StarryNight: Component cleanup completed");
        } catch (error) {
          console.warn("StarryNight: Error during component cleanup:", error);
        }
      };
    }, []);

    return Spicetify.React.createElement(
      "div",
      { className: "x-settings-section" },
      [
        // Section Title
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
      ]
    );
  });

  // Function to insert our section into the settings page
  function insertOption(name) {
    if (name !== "/preferences") return;

    const checkHeaderInterval = setInterval(() => {
      const header = document.querySelector(
        "[data-testid='settings-page'] > div:first-of-type, .x-settings-headerContainer"
      );

      if (header) {
        clearInterval(checkHeaderInterval);

        const sectionContainer = document.createElement("div");
        Spicetify.ReactDOM.render(
          Spicetify.React.createElement(Section),
          sectionContainer
        );
        header.parentNode.insertBefore(sectionContainer, header.nextSibling);
      }
    }, 1);
  }

  // Hotload useEffect - CRITICAL for proper initialization
  Spicetify.ReactDOM.render(
    Spicetify.React.createElement(Section),
    document.createElement("div")
  );

  // Initialize + Listener for settings page detection
  insertOption(Spicetify.Platform.History.location?.pathname);
  Spicetify.Platform.History.listen((event) => {
    insertOption(event.pathname);
  });

  // StarryNight: Setup music player event listeners for dynamic color extraction
  function setupMusicPlayerListeners() {
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500;

    const initializeListeners = () => {
      if (!Spicetify.Player) {
        retryCount++;
        if (retryCount < maxRetries) {
          console.log(
            `StarryNight: Spicetify.Player not ready, retrying ${retryCount}/${maxRetries}...`
          );
          setTimeout(initializeListeners, retryDelay * retryCount); // Exponential backoff
          return null;
        } else {
          console.error("StarryNight: Failed to initialize after max retries");
          return null;
        }
      }

      try {
        // Song change listener
        const songChangeHandler = () => {
          console.log("StarryNight: Song changed, extracting colors...");
          setTimeout(extractColorsFromCoverArt, 500); // Delay to ensure cover art loads
        };

        // Player state change listener
        const playPauseHandler = () => {
          if (Spicetify.Player.data?.track?.uri !== currentTrackUri) {
            setTimeout(extractColorsFromCoverArt, 300);
          }
        };

        // Add event listeners
        Spicetify.Player.addEventListener("songchange", songChangeHandler);
        Spicetify.Player.addEventListener("onplaypause", playPauseHandler);

        // Initial color extraction
        if (Spicetify.Player.data?.track) {
          console.log("StarryNight: Initial color extraction...");
          setTimeout(extractColorsFromCoverArt, 1000);
        }

        console.log("StarryNight: Player listeners initialized successfully");

        // Return cleanup function
        return () => {
          try {
            if (Spicetify.Player && Spicetify.Player.removeEventListener) {
              Spicetify.Player.removeEventListener(
                "songchange",
                songChangeHandler
              );
              Spicetify.Player.removeEventListener(
                "onplaypause",
                playPauseHandler
              );
              console.log("StarryNight: Player listeners cleaned up");
            }
          } catch (error) {
            console.warn("StarryNight: Error during cleanup:", error);
          }
        };
      } catch (error) {
        console.error("StarryNight: Error setting up player listeners:", error);
        return null;
      }
    };

    return initializeListeners();
  }
})();
