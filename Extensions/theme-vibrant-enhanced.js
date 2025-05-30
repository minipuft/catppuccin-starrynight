// Enhanced Theme Vibrant - Modern Spicetify colorExtractor() Implementation
// Uses native API instead of canvas to avoid CORS issues
(function () {
  "use strict";

  if (!Spicetify?.Platform) {
    setTimeout(arguments.callee, 100);
    return;
  }

  let currentTrackUri = null;

  // Configuration
  const CONFIG = {
    updateInterval: 500,
    transitionDuration: "0.8s",
    enableDebug: false, // Set to true for testing
  };

  // Utility functions
  function log(...args) {
    if (CONFIG.enableDebug) {
      console.log("[Catppuccin StarryNight Enhanced]", ...args);
    }
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Enhanced color adjustment with better vibrant preservation
  function adjustColor(hex, saturation = 1, brightness = 1) {
    if (!hex) return "#8839ef"; // Fallback to Catppuccin mauve

    const rgb = hexToRgb(hex);
    if (!rgb) return "#8839ef";

    // Convert to HSL for better color manipulation
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    // Apply adjustments with improved bounds
    s = Math.min(1, Math.max(0.3, s * saturation)); // Minimum 30% saturation
    l = Math.min(0.8, Math.max(0.2, l * brightness)); // Keep within visible range

    // Convert back to RGB
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return (
      "#" +
      [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  // Extract colors using Spicetify's native colorExtractor API
  async function extractColorsNative(trackUri) {
    if (!trackUri) return null;

    try {
      log("🎨 Using native colorExtractor for:", trackUri);
      const colors = await Spicetify.colorExtractor(trackUri);

      if (!colors) {
        log("⚠️ No colors returned from native API");
        return null;
      }

      log("🌈 Extracted colors:", colors);

      return {
        vibrant: colors.VIBRANT,
        darkVibrant: colors.DARK_VIBRANT,
        lightVibrant: colors.LIGHT_VIBRANT,
        prominent: colors.PROMINENT,
        desaturated: colors.DESATURATED,
        vibrantNonAlarming: colors.VIBRANT_NON_ALARMING,
      };
    } catch (error) {
      log("❌ Native color extraction failed:", error);
      return null;
    }
  }

  // Apply colors to both spice variables and StarryNight variables
  function applyColorsToTheme(colors) {
    if (!colors) {
      log("No colors to apply, resetting to defaults");
      resetToDefaults();
      return;
    }

    const root = document.documentElement;

    try {
      // Select best colors with fallbacks
      const primaryColor =
        colors.vibrant || colors.lightVibrant || colors.prominent || "#8839ef"; // Catppuccin mauve fallback

      const secondaryColor =
        colors.darkVibrant || colors.desaturated || colors.vibrant || "#cba6f7"; // Catppuccin mauve light fallback

      const accentColor =
        colors.vibrantNonAlarming ||
        colors.lightVibrant ||
        colors.vibrant ||
        "#b4befe"; // Catppuccin lavender fallback

      // Enhanced color adjustments for better theming
      const enhancedPrimary = adjustColor(primaryColor, 1.4, 1.1);
      const enhancedSecondary = adjustColor(secondaryColor, 1.2, 0.9);
      const enhancedAccent = adjustColor(accentColor, 1.6, 1.2);

      // Apply to StarryNight gradient variables (legacy support)
      root.style.setProperty("--sn-gradient-primary", enhancedPrimary);
      root.style.setProperty("--sn-gradient-secondary", enhancedSecondary);
      root.style.setProperty("--sn-gradient-accent", enhancedAccent);

      // Apply to modern spice variables for better integration
      root.style.setProperty("--spice-button", enhancedPrimary);
      root.style.setProperty("--spice-button-active", enhancedAccent);
      root.style.setProperty("--spice-highlight", enhancedSecondary);

      // Calculate and apply RGB variants for transparency
      const primaryRgb = hexToRgb(enhancedPrimary);
      const secondaryRgb = hexToRgb(enhancedSecondary);
      const accentRgb = hexToRgb(enhancedAccent);

      if (primaryRgb) {
        root.style.setProperty(
          "--spice-rgb-button",
          `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
        );
      }

      // Star color matching the theme
      const starColor = adjustColor(primaryColor, 0.8, 1.5);
      root.style.setProperty("--sn-star-color", starColor);

      // Enhanced gradient properties for better visibility
      root.style.setProperty("--sn-gradient-opacity", "0.4");
      root.style.setProperty("--sn-gradient-blur", "30px");
      root.style.setProperty("--sn-gradient-saturation", "1.5");

      log("✅ Applied enhanced colors:", {
        primary: enhancedPrimary,
        secondary: enhancedSecondary,
        accent: enhancedAccent,
        star: starColor,
      });
    } catch (error) {
      log("❌ Error applying colors:", error);
      resetToDefaults();
    }
  }

  // Reset to default Catppuccin colors
  function resetToDefaults() {
    const root = document.documentElement;

    // Remove custom properties to use theme defaults
    const customProps = [
      "--sn-gradient-primary",
      "--sn-gradient-secondary",
      "--sn-gradient-accent",
      "--sn-star-color",
      "--sn-gradient-opacity",
      "--sn-gradient-blur",
      "--sn-gradient-saturation",
      "--spice-button",
      "--spice-button-active",
      "--spice-highlight",
      "--spice-rgb-button",
    ];

    customProps.forEach((prop) => root.style.removeProperty(prop));

    log("🔄 Reset to default theme colors");
  }

  // Main color update function
  async function updateColorsFromCurrentTrack() {
    try {
      const trackData = Spicetify.Player.data || Spicetify.Player.state;
      const newTrackUri = trackData?.item?.uri || trackData?.track?.uri;

      // Skip if same track
      if (newTrackUri === currentTrackUri) return;

      currentTrackUri = newTrackUri;
      log("🎵 Track changed:", newTrackUri);

      if (!newTrackUri) {
        resetToDefaults();
        return;
      }

      // Use native color extraction
      const colors = await extractColorsNative(newTrackUri);

      if (colors) {
        applyColorsToTheme(colors);
      } else {
        log("⚠️ No colors extracted, using defaults");
        resetToDefaults();
      }
    } catch (error) {
      log("❌ Error in updateColorsFromCurrentTrack:", error);
      resetToDefaults();
    }
  }

  // Event listeners setup
  function setupEventListeners() {
    // Primary event listener for track changes
    Spicetify.Player.addEventListener(
      "songchange",
      updateColorsFromCurrentTrack
    );

    // Additional listener for player state updates
    if (Spicetify.Platform?.PlayerAPI) {
      Spicetify.Platform.PlayerAPI.addEventListener(
        "update",
        updateColorsFromCurrentTrack
      );
    }

    // Fallback periodic check (less frequent since native API is more reliable)
    setInterval(updateColorsFromCurrentTrack, CONFIG.updateInterval * 2);

    log("✅ Event listeners configured");
  }

  // Cleanup function
  function cleanup() {
    resetToDefaults();
    // Event listeners are automatically cleaned up by Spicetify
  }

  // Check API availability
  function checkAPIAvailability() {
    const apis = {
      colorExtractor: !!Spicetify.colorExtractor,
      Player: !!Spicetify.Player,
      Platform: !!Spicetify.Platform,
    };

    log("🔍 API Availability:", apis);

    if (!apis.colorExtractor) {
      console.warn(
        "[Catppuccin StarryNight] Native colorExtractor API not available"
      );
      return false;
    }

    return true;
  }

  // Initialize the extension
  function init() {
    log("🚀 Initializing Enhanced Theme Vibrant extension");

    // Check if APIs are available
    if (!checkAPIAvailability()) {
      console.error(
        "[Catppuccin StarryNight] Required APIs not available, extension disabled"
      );
      return;
    }

    // Check if gradient feature is enabled
    const gradientSetting = localStorage.getItem("sn-gradientIntensity");
    if (gradientSetting === "disabled") {
      log("🚫 Gradient disabled in settings, extension inactive");
      return;
    }

    setupEventListeners();

    // Initial color extraction with delay for proper initialization
    setTimeout(updateColorsFromCurrentTrack, 1500);

    log("✅ Enhanced Theme Vibrant extension initialized successfully");
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", cleanup);

  // Debug helper for development
  if (CONFIG.enableDebug) {
    window.CatppuccinStarryNightDebug = {
      extractColors: () => updateColorsFromCurrentTrack(),
      resetColors: resetToDefaults,
      checkAPI: checkAPIAvailability,
      getCurrentTrack: () => currentTrackUri,
    };
  }

  // Start the extension
  init();
})();
