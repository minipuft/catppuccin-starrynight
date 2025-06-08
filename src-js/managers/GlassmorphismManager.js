export class GlassmorphismManager {
  constructor(performanceMonitor, settingsManager) {
    this.performanceMonitor = performanceMonitor;
    this.settingsManager = settingsManager;
    this.isSupported = this.detectBackdropFilterSupport();
    this.currentIntensity = "balanced"; // Default, will be updated by settings via applyGlassmorphismSettings

    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this); // MODIFIED: Bind handler

    // Conditional logging based on injected performanceMonitor or settingsManager can be added if needed.
    // For example, if settingsManager.get('enableDebug') or a similar global config via YEAR3000_CONFIG is preferred.
    // For now, using a direct console.log as in the original.
    // console.log(
    //   `StarryNight: Glassmorphism ${
    //     this.isSupported ? "supported" : "not supported - using fallbacks"
    //   }`
    // );
  }

  // MODIFIED: Add initialize method
  initialize() {
    const initialIntensity = this.settingsManager.get(
      "sn-glassmorphismIntensity",
      "balanced"
    );
    this.applyGlassmorphismSettings(initialIntensity);
    document.addEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
    // if (globalThis.YEAR3000_CONFIG?.enableDebug) {
    //   console.log("[GlassmorphismManager] Initialized and event listener added.");
    // }
  }

  // MODIFIED: Add destroy method
  destroy() {
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
    // if (globalThis.YEAR3000_CONFIG?.enableDebug) {
    //   console.log("[GlassmorphismManager] Event listener removed.");
    // }
  }

  // MODIFIED: Add settings change handler
  handleSettingsChange(event) {
    if (event.detail.key === "sn-glassmorphismIntensity") {
      // const enableDebug = globalThis.YEAR3000_CONFIG?.enableDebug;
      // if (enableDebug) {
      //   console.log(`[GlassmorphismManager] Detected setting change for ${event.detail.key}. New value: ${event.detail.value}`);
      // }
      this.applyGlassmorphismSettings(event.detail.value);
    }
  }

  detectBackdropFilterSupport() {
    try {
      return (
        CSS.supports("backdrop-filter", "blur(1px)") ||
        CSS.supports("-webkit-backdrop-filter", "blur(1px)")
      );
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
      "sn-glass-balanced", // Added balanced for explicit removal if set by other means
      "sn-glass-intense"
    );

    // Apply new intensity class
    body.classList.add(`sn-glass-${intensity}`);
    this.currentIntensity = intensity;
    this.updateGlassVariables(intensity);

    // Conditional log
    // if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
    //   console.log(`StarryNight: Glassmorphism intensity set to ${intensity}`);
    // }
  }

  updateGlassVariables(intensity) {
    const root = document.documentElement;
    const shouldReduceQuality = this.performanceMonitor.shouldReduceQuality();

    let blurValue, opacityValue, saturationValue;

    switch (intensity) {
      case "disabled":
        // CSS class handles this primarily, but ensure variables are also neutral if needed.
        // Or, ensure the sn-glass-disabled class fully overrides these.
        // For safety, let's set them to non-effect values or rely on CSS to clear them.
        // Assuming CSS class sn-glass-disabled sets backdrop-filter to none.
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

    if (window.innerWidth <= 768) {
      const mobileBlur = parseInt(blurValue) * 0.75 + "px";
      const mobileOpacity = parseFloat(opacityValue) * 0.8;
      root.style.setProperty("--glass-blur", mobileBlur);
      root.style.setProperty("--glass-opacity", mobileOpacity.toString());
    }
  }

  updateGlassColors(primaryColor, secondaryColor) {
    if (!this.isSupported || this.currentIntensity === "disabled") {
      return;
    }
    const root = document.documentElement;
    const glassPrimary = this.convertToGlassColor(primaryColor, 0.1); // Opacity can be dynamic too
    const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);

    root.style.setProperty("--glass-background", glassPrimary);
    root.style.setProperty("--glass-border", glassSecondary);

    // Conditional log
    // if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
    //  console.log(
    //    `StarryNight: Glass colors updated - Primary: ${glassPrimary}, Border: ${glassSecondary}`
    //   );
    // }
  }

  convertToGlassColor(color, opacity) {
    try {
      if (typeof color !== "string") {
        // console.warn('StarryNight: Invalid color input for convertToGlassColor, not a string.');
        return `rgba(255, 255, 255, ${opacity})`; // Fallback
      }
      if (color.startsWith("rgb(")) {
        const values = color.match(/\d+/g);
        if (values && values.length >= 3) {
          return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
        }
      }
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      }
      // console.warn(`StarryNight: Could not parse color '${color}' for glass. Using fallback.`);
      return `rgba(255, 255, 255, ${opacity})`;
    } catch (error) {
      // console.warn("StarryNight: Error converting color to glass format:", error);
      return `rgba(255, 255, 255, ${opacity})`;
    }
  }

  checkPerformanceAndAdjust() {
    const shouldReduce = this.performanceMonitor.shouldReduceQuality();
    if (shouldReduce && this.currentIntensity === "intense") {
      // console.log(
      //   "StarryNight: Reducing glassmorphism intensity due to performance"
      // );
      this.applyGlassmorphismSettings("balanced"); // Switch to a less demanding setting
      return true;
    }
    return false;
  }

  getCurrentSettings() {
    return {
      intensity: this.currentIntensity,
      isSupported: this.isSupported,
      // Check if performanceMonitor is available before calling its method
      performanceReduced: this.performanceMonitor
        ? this.performanceMonitor.shouldReduceQuality()
        : false,
    };
  }
}
