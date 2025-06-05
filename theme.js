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
  // ======================================
  // YEAR 3000 ARTISTIC CONFIGURATION - Multiple Intensity Modes

  // NEW: Harmonic Mode Constellation
  const HARMONIC_MODES = {
    "analogous-flow": {
      rule: "analogous",
      angle: 30,
      description: "Gentle rivers of adjacent hues",
    },
    "triadic-trinity": {
      rule: "triadic",
      angle: 120,
      description: "Three-point stellar equilibrium",
    },
    "complementary-yin-yang": {
      rule: "complementary",
      angle: 180,
      description: "Opposing forces in harmony",
    },
    "tetradic-cosmic-cross": {
      rule: "tetradic",
      angle: 90,
      description: "Four-dimensional color matrix",
    },
    "split-complementary-aurora": {
      rule: "split-complementary",
      angle: 150,
      description: "Dancing polar opposites",
    },
    "monochromatic-meditation": {
      rule: "monochromatic",
      angle: 0,
      description: "Single-hue consciousness expansion",
    },
  };

  const YEAR3000_CONFIG = {
    enableDebug: true,
    enableContextualIntelligence: true,
    enableMusicAnalysis: true,
    enableCosmicSync: true, // NEW: Music-driven visual intensity
    musicModulationIntensity: 0.25,

    // 🎨 ARTISTIC MODE SELECTION - User Choice Between Safety and Beauty
    artisticMode: "artist-vision", // "corporate-safe" | "artist-vision" | "cosmic-maximum"

    // NEW: Harmonic Configuration
    currentHarmonicMode: "analogous-flow", // Default harmonic mode
    harmonicBaseColor: null, // Auto-extracted from album art or manually set
    harmonicIntensity: 0.7, // How pronounced the harmonics are (0-1)
    harmonicEvolution: true, // Whether harmonics evolve with music changes

    // 🌟 BOLD ARTISTIC MULTIPLIERS - No More Timid Whispers!
    artisticMultipliers: {
      opacity: 0.28, // BOLD! Up from pathetic 0.12
      saturation: 1.45, // VIBRANT! Up from timid 1.25
      brightness: 1.25, // LUMINOUS! Up from invisible 1.08
      contrast: 1.35, // IMPACTFUL! Up from weak 1.15
      musicEnergyBoost: 1.6, // NEW: Music energy amplification
    },

    // 🏢 Corporate Safe Mode (For The Timid)
    corporateMultipliers: {
      opacity: 0.08, // Original safe values
      saturation: 1.05,
      brightness: 1.02,
      contrast: 1.01,
      musicEnergyBoost: 1.0,
    },

    // 🌌 COSMIC MAXIMUM MODE - For True Artists Who Dare!
    cosmicMultipliers: {
      opacity: 0.45, // MAXIMUM COSMIC PRESENCE!
      saturation: 1.75, // STELLAR SATURATION!
      brightness: 1.5, // SOLAR LUMINANCE!
      contrast: 1.6, // GRAVITATIONAL CONTRAST!
      musicEnergyBoost: 2.0, // MUSIC-DRIVEN INTENSITY EXPLOSION!
    },

    // 🎵 Music-Visual Sync Configuration
    musicVisualSync: {
      energyScaling: {
        low: 0.6, // Calm music: reduce intensity
        medium: 1.0, // Normal music: baseline intensity
        high: 1.4, // Energetic music: boost intensity
      },
      valenceScaling: {
        sad: 0.8, // Melancholy: subdued but still artistic
        neutral: 1.0, // Balanced expression
        happy: 1.3, // Joyful: enhanced vibrancy
      },
      danceabilityEffects: {
        enable: true,
        animationSpeedMultiplier: 1.5, // Dance music = faster animations
        blurVariation: 0.3, // Dance music = dynamic blur
      },
    },

    // 🎛️ Dynamic Intensity Calculation
    getCurrentMultipliers() {
      const modes = {
        "corporate-safe": this.corporateMultipliers,
        "artist-vision": this.artisticMultipliers,
        "cosmic-maximum": this.cosmicMultipliers,
      };
      const selectedMode = modes[this.artisticMode] || this.artisticMultipliers;
      // console.log(`[YEAR3000_CONFIG] Current artistic mode: ${this.artisticMode}, Multipliers:`, selectedMode); // Optional debug log
      return selectedMode;
    },

    // 🌟 Artistic Mode Switching
    setArtisticMode(mode) {
      const validModes = ["corporate-safe", "artist-vision", "cosmic-maximum"];
      if (validModes.includes(mode)) {
        this.artisticMode = mode;
        // Note: Saving to localStorage will be handled by SettingsManager via the UI interaction.
        // This function primarily updates the internal state of YEAR3000_CONFIG.
        console.log(
          `[YEAR3000_CONFIG] Artistic mode state set to: ${mode.toUpperCase()}`
        );

        // Trigger visual updates that depend on these multipliers
        if (
          typeof year3000System !== "undefined" &&
          year3000System.setGradientParameters
        ) {
          year3000System.setGradientParameters(document.documentElement);
        }
        // If color selection itself changes with artistic mode, that would also need a trigger.
        // if (typeof year3000System !== 'undefined' && year3000System.updateColorsFromCurrentTrack) {
        //   year3000System.updateColorsFromCurrentTrack();
        // }
        return true;
      }
      console.warn(
        `[YEAR3000_CONFIG] Invalid artistic mode: ${mode}. Valid modes:`,
        validModes
      );
      return false;
    },

    // 🔄 Load Saved Artistic Preference
    loadArtisticPreference() {
      // This will be primarily driven by SettingsManager.get("sn-artisticMode")
      // For initial load before settings UI might be fully ready, or as a direct internal default mechanism:
      const saved = localStorage.getItem("year3000-artistic-mode"); // Keep this for direct load if needed
      // but SettingsManager will be the source of truth via UI.
      if (
        saved &&
        ["corporate-safe", "artist-vision", "cosmic-maximum"].includes(saved)
      ) {
        this.artisticMode = saved;
      } else {
        this.artisticMode = "artist-vision"; // Default
      }
      console.log(
        `[YEAR3000_CONFIG] Loaded/Defaulted internal artistic preference: ${this.artisticMode}`
      );
    },
  };

  // Initialize artistic preference when YEAR3000_CONFIG is defined
  YEAR3000_CONFIG.loadArtisticPreference();

  // =============================================================================
  // YEAR 3000 BASE VISUAL SYSTEM - Foundation for all visual engines
  // =============================================================================
  class BaseVisualSystem {
    constructor(config = {}) {
      this.config = config;
      this.isInitialized = false;
      this.performanceTimers = new Map(); // Keep if used, or simplify
      this.metrics = {
        // Basic metrics example
        initializationTime: 0,
        updates: 0,
        errors: 0,
      };
      this.systemName = config.systemName || this.constructor.name;

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[BaseVisualSystem (${this.systemName})] Constructor`);
      }
    }

    async initialize() {
      this._startPerformanceTimer("initialization");
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[BaseVisualSystem (${this.systemName})] Initializing...`);
      }

      if (
        year3000System.musicAnalysisService &&
        typeof year3000System.musicAnalysisService.subscribe === "function"
      ) {
        year3000System.musicAnalysisService.subscribe(this, this.systemName);
      } else {
        console.warn(
          `[${this.systemName}] MusicAnalysisService not available for subscription during BaseVisualSystem init.`
        );
      }

      this.isInitialized = true;
      this._endPerformanceTimer("initialization");
      this.metrics.initializationTime = this.performanceTimers.get(
        "initialization_duration"
      );
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[BaseVisualSystem (${this.systemName})] Initialized in ${
            this.metrics.initializationTime || 0
          }ms.`
        );
      }
    }

    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.isInitialized) return;
      this._startPerformanceTimer("update"); // Assumes performance timer methods are part of BaseVisualSystem
      this.metrics.updates++;
      // Base class can log or handle common update logic. Subclasses will override.
      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.005) {
        // Very, very sparse logging
        // console.log(`[BaseVisualSystem (${this.systemName})] Received music update for ${trackUri}.`);
      }
      // Subclasses will implement their specific logic using processedMusicData
      this._endPerformanceTimer("update");
      // this._updateAverageRenderTime(this.performanceTimers.get("update_duration")); // If using average render time
    }

    destroy() {
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[BaseVisualSystem (${this.systemName})] Destroying...`);
      }
      if (
        year3000System.musicAnalysisService &&
        typeof year3000System.musicAnalysisService.unsubscribe === "function"
      ) {
        year3000System.musicAnalysisService.unsubscribe(this.systemName);
      }
      this.isInitialized = false;
      // TODO: Add any other common cleanup logic for all visual systems.
    }

    // Performance Utilities (keep if used by base or subclasses directly)
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

    // Common DOM/animation utilities (already present, ensure they are part of this class or accessible)
    _createCanvasElement(id, zIndex = -1, blendMode = "screen") {
      // from existing code
      const existing = document.getElementById(id);
      if (existing) existing.remove();

      const canvas = document.createElement("canvas");
      canvas.id = id;
      // Ensure width/height are set before appending, or on resize
      canvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        pointer-events: none; z-index: ${zIndex}; mix-blend-mode: ${blendMode};
        opacity: ${
          this.config?.opacity ||
          YEAR3000_CONFIG.getCurrentMultipliers().opacity * 0.5 ||
          0.5
        };
      `; // Added default opacity config
      document.body.appendChild(canvas);

      const resizeHandler = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (typeof this.handleResize === "function") {
          this.handleResize();
        }
      };
      window.addEventListener("resize", resizeHandler);
      // Store resize handler for potential removal in destroy() if systems are dynamically added/removed
      this._resizeHandler = resizeHandler;
      resizeHandler(); // Initial size set

      return canvas;
    }

    _requestAnimationFrame(callback) {
      // from existing code
      return requestAnimationFrame(callback);
    }

    _cancelAnimationFrame(frameId) {
      // from existing code
      cancelAnimationFrame(frameId);
    }
  }

  // =============================================================================
  // YEAR 3000 UTILITIES - Centralized Helper Functions
  // =============================================================================
  const Year3000Utilities = {
    _cachedRoot: null,
    _cachedRootStyle: null,

    getRootStyle() {
      const currentRoot = document.documentElement;
      if (this._cachedRoot !== currentRoot || !this._cachedRootStyle) {
        this._cachedRoot = currentRoot;
        this._cachedRootStyle = getComputedStyle(currentRoot);
      }
      return this._cachedRootStyle;
    },

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
    },

    hexToRgb(hex) {
      if (typeof hex !== "string") {
        console.warn(
          "[StarryNight hexToRgb] Input is not a string. Using fallback color (black). Hex:",
          hex
        );
        return { r: 0, g: 0, b: 0 }; // Fallback to black
      }

      const sanitizedHex = hex.trim();
      let processedHex = sanitizedHex.startsWith("#")
        ? sanitizedHex
        : `#${sanitizedHex}`;
      processedHex = processedHex.replace(/##+/g, "#"); // Handle cases like "##123456"

      // Expand 3-digit hex to 6-digit hex
      if (processedHex.length === 4) {
        // #RGB
        processedHex = `#${processedHex[1]}${processedHex[1]}${processedHex[2]}${processedHex[2]}${processedHex[3]}${processedHex[3]}`;
      }

      const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        processedHex
      );

      if (result) {
        try {
          const rgb = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          };
          // console.log('[StarryNight hexToRgb] SUCCESS, returning:', rgb, 'for hex:', processedHex); // Optional: reduce logging
          return rgb;
        } catch (e) {
          console.error(
            "[StarryNight hexToRgb] ERROR during parseInt:",
            e,
            "for hex:",
            processedHex,
            ". Using fallback color (black)."
          );
          return { r: 0, g: 0, b: 0 }; // Fallback to black
        }
      } else {
        console.warn(
          "[StarryNight hexToRgb] REGEX failed for hex:",
          processedHex,
          ". Using fallback color (black)."
        );
        return { r: 0, g: 0, b: 0 }; // Fallback to black
      }
    },

    rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
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
      return { h: h * 360, s: s * 100, l: l * 100 };
    },

    hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      let r_val, g_val, b_val; // Renamed to avoid conflict with global r, g, b
      if (s === 0) {
        r_val = g_val = b_val = l;
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r_val = hue2rgb(p, q, h + 1 / 3);
        g_val = hue2rgb(p, q, h);
        b_val = hue2rgb(p, q, h - 1 / 3);
      }
      return {
        r: Math.round(r_val * 255),
        g: Math.round(g_val * 255),
        b: Math.round(b_val * 255),
      };
    },

    rgbToHex(r, g, b) {
      return (
        "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
      );
    },

    calculateContrastRatio(color1, color2) {
      const getLuminance = (rgb) => {
        const [r_val, g_val, b_val] = [rgb.r, rgb.g, rgb.b].map((c) => {
          // Renamed to avoid conflict
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
      };

      const rgb1 = this.hexToRgb(color1); // Changed to this.hexToRgb for clarity, will resolve to Year3000Utilities.hexToRgb
      const rgb2 = this.hexToRgb(color2); // Changed to this.hexToRgb for clarity
      if (!rgb1 || !rgb2) return 1;

      const lum1 = getLuminance(rgb1);
      const lum2 = getLuminance(rgb2);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);

      return (brightest + 0.05) / (darkest + 0.05);
    },

    /**
     * Framerate-independent lerp smoothing.
     * Calculates the new current value based on a target, elapsed time, and a half-life.
     * The half-life is the time it takes for the value to reach halfway to its target.
     * Formula from: https://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/
     *
     * @param {number} current - The current value of the property being smoothed.
     * @param {number} target - The target value the property should move towards.
     * @param {number} deltaTime - The time elapsed since the last frame, in seconds.
     * @param {number} halfLife - The time (in seconds) it should take for the value to reach halfway to its target.
     *                            A smaller halfLife means faster smoothing. Must be positive.
     * @returns {number} The new smoothed value.
     */
    lerpSmooth(current, target, deltaTime, halfLife) {
      // Handle edge cases for halfLife.
      // If halfLife is zero or negative, or deltaTime is non-positive, snap to target.
      // A very small positive epsilon is used for halfLife to prevent division by zero if it's extremely small but positive.
      const EPSILON = 0.00001;
      if (halfLife <= EPSILON || deltaTime <= 0) {
        if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
          if (halfLife <= EPSILON) {
            console.warn(
              "[StarryNight lerpSmooth] halfLife is near zero or negative. Snapping to target. halfLife:",
              halfLife
            );
          }
          if (deltaTime <= 0) {
            // This can happen if time doesn't advance, e.g. on the first frame of an animation loop
            // console.log('[StarryNight lerpSmooth] deltaTime is zero or negative. Snapping to target. deltaTime:', deltaTime);
          }
        }
        return target;
      }

      const result =
        target + (current - target) * Math.pow(2, -deltaTime / halfLife);

      if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
        // Optional: Log only if values are significantly different or for specific debugging sessions
        // To avoid flooding the console, consider adding a condition like:
        // if (Math.abs(current - target) > 0.01 && Math.random() < 0.1) { // Log ~10% of significant changes
        //   console.log(`[StarryNight lerpSmooth] current: ${current.toFixed(4)}, target: ${target.toFixed(4)}, dt: ${deltaTime.toFixed(4)}, hl: ${halfLife.toFixed(4)}, result: ${result.toFixed(4)}`);
        // }
      }
      return result;
    },

    // PHASE 1.1 - Implement rgbToOklab conversion.
    // Converts sRGB (0-255 per channel) to OKLab.
    // L: 0-1 (lightness), a,b: approx -0.4 to 0.4 (chroma axes).
    // Reference: Björn Ottosson's work (https://bottosson.github.io/posts/oklab/)
    rgbToOklab(r_srgb, g_srgb, b_srgb) {
      // 1. Ensure input r, g, b are in the 0-1 range
      const r = r_srgb / 255.0;
      const g = g_srgb / 255.0;
      const b = b_srgb / 255.0;

      // 2. Convert sRGB to Linear RGB
      const r_lin =
        r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      const g_lin =
        g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      const b_lin =
        b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

      // 3. Apply LMS matrix (M1 from Ottosson's post, for sRGB illuminant D65)
      const l_cone =
        0.4122214708 * r_lin + 0.5363325363 * g_lin + 0.0514459929 * b_lin;
      const m_cone =
        0.2119034982 * r_lin + 0.6806995451 * g_lin + 0.1073969566 * b_lin;
      const s_cone =
        0.0883024619 * r_lin + 0.2817188376 * g_lin + 0.6299787005 * b_lin;

      // 4. Apply non-linearity (cube root for LMS cone responses)
      const l_ = Math.cbrt(l_cone);
      const m_ = Math.cbrt(m_cone);
      const s_ = Math.cbrt(s_cone);

      // 5. Apply OKLab transformation matrix (M2 from Ottosson's post)
      const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
      const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
      const b_oklab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_; // Renamed to avoid conflict with input 'b'

      return { L: L, a: a, b: b_oklab };
    },

    // PHASE 1.2 - Implement oklabToRgb conversion.
    // Converts OKLab to sRGB (0-255 per channel).
    // Initial implementation: simple clipping for out-of-gamut colors.
    oklabToRgb(L, a, b_oklab) {
      // Renamed b_oklab to avoid conflict
      // 1. Apply inverse OKLab transformation matrix (inverse of M2)
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b_oklab;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b_oklab;
      const s_ = L - 0.0894841775 * a - 1.291485548 * b_oklab;

      // 2. Apply inverse non-linearity (cube for LMS_ cone responses)
      const l_cone = l_ * l_ * l_;
      const m_cone = m_ * m_ * m_;
      const s_cone = s_ * s_ * s_;

      // 3. Apply inverse LMS matrix (inverse of M1)
      let r_lin_original =
        4.0767416621 * l_cone - 3.3077115913 * m_cone + 0.2309699292 * s_cone;
      let g_lin_original =
        -1.2681437731 * l_cone + 2.6097574011 * m_cone - 0.341613628 * s_cone;
      let b_lin_original =
        -0.0041960863 * l_cone - 0.7034186147 * m_cone + 1.707614701 * s_cone;

      // PHASE 3.1 - Basic Gamut Clipping/Handling Placeholder in oklabToRgb.
      // Clip linear RGB values to the 0-1 range before sRGB non-linearity.
      let r_lin = Math.max(0, Math.min(1, r_lin_original));
      let g_lin = Math.max(0, Math.min(1, g_lin_original));
      let b_lin = Math.max(0, Math.min(1, b_lin_original));

      // PHASE 3.1.1 - Consider logging when clipping occurs.
      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.01) {
        // Sparse logging for performance
        if (
          r_lin_original !== r_lin ||
          g_lin_original !== g_lin ||
          b_lin_original !== b_lin
        ) {
          // console.warn(`[OKLab->RGB] Gamut clipping occurred for L,a,b: ${L.toFixed(3)},${a.toFixed(3)},${b_oklab.toFixed(3)}. Original RGB_lin: ${r_lin_original.toFixed(3)},${g_lin_original.toFixed(3)},${b_lin_original.toFixed(3)}`);
        }
      }

      // 4. Convert Linear RGB to sRGB (non-linearity)
      const r_srgb_norm =
        r_lin <= 0.0031308
          ? r_lin * 12.92
          : 1.055 * Math.pow(r_lin, 1.0 / 2.4) - 0.055;
      const g_srgb_norm =
        g_lin <= 0.0031308
          ? g_lin * 12.92
          : 1.055 * Math.pow(g_lin, 1.0 / 2.4) - 0.055;
      const b_srgb_norm =
        b_lin <= 0.0031308
          ? b_lin * 12.92
          : 1.055 * Math.pow(b_lin, 1.0 / 2.4) - 0.055;

      // 5. Scale sRGB channels to 0-255, clip to [0, 255] (final clipping after sRGB conversion), and round.
      const r = Math.max(0, Math.min(255, Math.round(r_srgb_norm * 255)));
      const g = Math.max(0, Math.min(255, Math.round(g_srgb_norm * 255)));
      const b = Math.max(0, Math.min(255, Math.round(b_srgb_norm * 255)));

      return { r: r, g: g, b: b };
    },

    // TODO: PHASE 2.1 - Implement initial OKLab color processing function.
    // This function will take an OKLab color object and optional context (e.g., music analysis).
    // It will apply perceptual adjustments and context-aware shifts.
    // For now, it can be a stub or apply very simple L* scaling.
    // Example: L_perceived = L ^ 0.8 (compressive non-linearity for lightness)
    // Example: Simple chroma compression if L is very high or low.
    processOklabColor(oklabColor, context = {}) {
      let { L, a, b } = oklabColor; // L:0-1, a,b: approx -0.4 to 0.4
      const {
        musicEnergy,
        moodIdentifier,
        visualIntensity,
        targetContrastRatio,
      } = context;

      // PHASE 3.2 - Refine Perceptual Lightness Adjustment (Placeholder)
      // OKLab's L is generally perceptually uniform. Further adjustment might be for artistic effect.
      // L_original = L;
      // L = L_original > 0.5 ? 1 - Math.pow(1 - L_original, 1.5) : Math.pow(L_original, 1.5); // Example S-curve

      // PHASE 3.3 - Implement Chroma Scaling based on Lightness.
      // Reduce chroma (a,b components) at very high or very low lightness to prevent overly vivid or muddy colors near black/white.
      const lightnessThresholdMin = 0.1; // Below this, start reducing chroma
      const lightnessThresholdMax = 0.9; // Above this, start reducing chroma
      let chromaScale = 1.0;

      if (L < lightnessThresholdMin) {
        chromaScale = L / lightnessThresholdMin; // Scale down linearly from 1 to 0 as L approaches 0
      } else if (L > lightnessThresholdMax) {
        chromaScale = (1 - L) / (1 - lightnessThresholdMax); // Scale down linearly from 1 to 0 as L approaches 1
      }
      chromaScale = Math.max(0, Math.min(1, Math.pow(chromaScale, 0.75))); // Clamp and apply a curve to make the transition smoother

      a *= chromaScale;
      b *= chromaScale;

      // PHASE 3.4 - Basic Color Harmony & Accessibility Placeholder.
      // This is a very complex topic. For Phase 3, we'll introduce a placeholder for future logic.
      // For example, if a target contrast ratio is provided, we might adjust L.
      // (This is a simplification; true contrast adjustment in OKLab is non-trivial).
      if (targetContrastRatio && L > 0.05 && L < 0.95) {
        // Avoid extremes
        // Placeholder: if context demands higher contrast, slightly increase L separation from mid-gray (0.5)
        // This is NOT a proper contrast adjustment method but a conceptual placeholder.
        // if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.05) console.log(`[ProcessOKLab] Context includes targetContrastRatio: ${targetContrastRatio}`);
        // if (targetContrastRatio > 4.5 && L < 0.6) L *= 0.95; // Darken if too light for high contrast
        // if (targetContrastRatio > 4.5 && L > 0.4) L *= 1.05; // Lighten if too dark for high contrast
        // L = Math.max(0, Math.min(1, L)); // Clamp L
      }

      // PHASE 3.5 - Context-Aware Shifts (Refinement from Phase 2).
      // Refine subtle adjustments based on music energy, mood, etc.
      if (musicEnergy && moodIdentifier && visualIntensity) {
        if (moodIdentifier === "energetic_happy" && visualIntensity > 0.5) {
          // More pronounced chroma boost for very energetic/happy music
          const boostFactor = 1 + (visualIntensity - 0.5) * 0.1; // Max 5% chroma boost
          a *= boostFactor;
          b *= boostFactor;
        } else if (
          (moodIdentifier === "calm_sad" || moodIdentifier === "sad") &&
          visualIntensity < 0.5
        ) {
          // More pronounced chroma reduction for sad/calm music
          const reductionFactor = 1 - (0.5 - visualIntensity) * 0.1; // Max 5% chroma reduction
          a *= reductionFactor;
          b *= reductionFactor;
        }
      }

      // PHASE 3.6 - Final clamping of L, a, b if necessary.
      L = Math.max(0, Math.min(1.0, L));
      // Clamping 'a' and 'b' might be overly restrictive if not done carefully,
      // as their valid range can vary slightly. oklabToRgb's clipping is primary.
      // a = Math.max(-0.4, Math.min(0.4, a)); // Example conservative clamp
      // b = Math.max(-0.4, Math.min(0.4, b)); // Example conservative clamp

      return { L, a, b };
    },

    // PHASE 4: Utility to calculate derived OKLab properties
    calculateOklabDerivedProperties(oklabColor) {
      if (
        !oklabColor ||
        typeof oklabColor.L !== "number" ||
        typeof oklabColor.a !== "number" ||
        typeof oklabColor.b !== "number"
      ) {
        console.warn(
          "[Year3000Utilities] Invalid oklabColor input for calculateOklabDerivedProperties. Using defaults.",
          oklabColor
        );
        return { L_star: 0.5, a_star: 0, b_star: 0, chroma: 0, hue: 0 };
      }
      const { L, a, b } = oklabColor;
      const chroma = Math.sqrt(a * a + b * b);
      let hue = Math.atan2(b, a) * (180 / Math.PI); // Convert radians to degrees
      if (hue < 0) {
        hue += 360; // Normalize hue to 0-360 range
      }
      return {
        L_star: L, // OKLab L is already L*
        a_star: a, // OKLab a is a*
        b_star: b, // OKLab b is b*
        chroma: chroma,
        hue: hue,
      };
    },

    // PHASE 6: Generate Harmonic OKLab Colors
    generateHarmonicOklabColors(
      baseOklabColor,
      rule = "analogous",
      angle = 30 // Angle in degrees, interpretation depends on the rule
    ) {
      if (
        !baseOklabColor ||
        typeof baseOklabColor.L !== "number" ||
        typeof baseOklabColor.a !== "number" ||
        typeof baseOklabColor.b !== "number"
      ) {
        console.warn(
          "[Year3000Utilities] Invalid baseOklabColor input for generateHarmonicOklabColors. Required: { L, a, b }.",
          baseOklabColor
        );
        return [];
      }

      const { L, a, b } = baseOklabColor;
      const baseChroma = Math.sqrt(a * a + b * b);
      let baseHueDegrees = Math.atan2(b, a) * (180 / Math.PI);
      if (baseHueDegrees < 0) {
        baseHueDegrees += 360;
      }

      const harmonicColorsOklab = [];

      const getOklabFromLCH = (l_val, c_val, h_deg_val) => {
        const h_rad = (h_deg_val % 360) * (Math.PI / 180);
        return {
          L: Math.max(0, Math.min(1, l_val)), // Clamp L to 0-1
          a: c_val * Math.cos(h_rad),
          b: c_val * Math.sin(h_rad),
        };
      };

      if (rule === "analogous") {
        const angles = [angle, -angle];
        angles.forEach((hueShift) => {
          harmonicColorsOklab.push(
            getOklabFromLCH(L, baseChroma, baseHueDegrees + hueShift)
          );
        });
      } else if (rule === "monochromatic") {
        // Generate a darker and a lighter version
        const L_darker = Math.max(0.05, L * (L > 0.5 ? 0.6 : 0.4)); // Ensure not too dark
        const L_lighter = Math.min(0.95, L * (L < 0.5 ? 1.6 : 1.2) + 0.1); // Ensure not too light, boost if dark
        harmonicColorsOklab.push(
          getOklabFromLCH(L_darker, baseChroma * 0.85, baseHueDegrees)
        ); // Slightly reduce chroma for darker
        harmonicColorsOklab.push(
          getOklabFromLCH(L_lighter, baseChroma * 0.9, baseHueDegrees)
        ); // Slightly reduce chroma for lighter
      } else if (rule === "complementary") {
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + 180)
        );
      } else if (rule === "triadic") {
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + 120)
        );
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + 240)
        );
      } else if (rule === "split-complementary") {
        // The `angle` parameter in HARMONIC_MODES for split-complementary (e.g., 150 for aurora) might be interpreted as the total spread.
        // A common split is Comp +/- 30. So, baseHue + 180 - 30 and baseHue + 180 + 30.
        // Let's use a fixed small angle for the split from complementary for now.
        const splitAngle = 30; // Degrees from complementary
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + 180 - splitAngle)
        );
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + 180 + splitAngle)
        );
      } else if (rule === "tetradic") {
        // Square tetradic
        const stepAngle = angle || 90; // Use provided angle or default to 90 for square
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle)
        );
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle * 2)
        );
        harmonicColorsOklab.push(
          getOklabFromLCH(L, baseChroma, baseHueDegrees + stepAngle * 3)
        );
      } else {
        console.warn(
          `[Year3000Utilities] Harmony rule "${rule}" not fully implemented. Defaulting to analogous for now based on input angle.`
        );
        // Defaulting to analogous-like behavior if rule is unknown but angle might be meaningful
        const angles = [angle, -angle];
        angles.forEach((hueShift) => {
          harmonicColorsOklab.push(
            getOklabFromLCH(L, baseChroma, baseHueDegrees + hueShift)
          );
        });
      }

      // TODO: [Phase 6 Enhancement] - Already noted, keeping for consistency
      // 1. Consider L* adjustments for harmonic colors to maintain or achieve specific contrast goals.
      // 2. Explore using OKLab for more direct contrast calculations against a base/background color.

      return harmonicColorsOklab;
    },
  };

  // =============================================================================
  // YEAR 3000 COLOR HARMONY ENGINE - Enhanced Vibrancy Edition
  // =============================================================================

  class ColorHarmonyEngine {
    constructor() {
      this.currentTheme = this.detectCurrentTheme();
      this.harmonyMetrics = {
        validations: 0,
        harmonizations: 0,
        blends: 0,
        performance: [],
      };

      // Enhanced Catppuccin palette definitions with higher saturation targets
      this.catppuccinPalettes = {
        frappe: {
          accents: {
            rosewater: "#f2d5cf",
            flamingo: "#eebebe",
            pink: "#f4b8e4",
            mauve: "#ca9ee6",
            red: "#e78284",
            maroon: "#ea999c",
            peach: "#ef9f76",
            yellow: "#e5c890",
            green: "#a6d189",
            teal: "#81c8be",
            sky: "#99d1db",
            sapphire: "#85c1dc",
            blue: "#8caaee",
            lavender: "#babbf1",
          },
          neutrals: {
            base: "#303446",
            surface0: "#414559",
            surface1: "#51576d",
            surface2: "#626880",
          },
        },
        latte: {
          accents: {
            rosewater: "#dc8a78",
            flamingo: "#dd7878",
            pink: "#ea76cb",
            mauve: "#8839ef",
            red: "#d20f39",
            maroon: "#e64553",
            peach: "#fe640b",
            yellow: "#df8e1d",
            green: "#40a02b",
            teal: "#179299",
            sky: "#04a5e5",
            sapphire: "#209fb5",
            blue: "#1e66f5",
            lavender: "#7287fd",
          },
          neutrals: {
            base: "#eff1f5",
            surface0: "#e6e9ef",
            surface1: "#dce0e8",
            surface2: "#c5c9d1",
          },
        },
        macchiato: {
          accents: {
            rosewater: "#f4dbd6",
            flamingo: "#f0c6c6",
            pink: "#f5bde6",
            mauve: "#c6a0f6",
            red: "#ed8796",
            maroon: "#ee99a0",
            peach: "#f5a97f",
            yellow: "#eed49f",
            green: "#a6da95",
            teal: "#8bd5ca",
            sky: "#91d7e3",
            sapphire: "#7dc4e4",
            blue: "#8aadf4",
            lavender: "#b7bdf8",
          },
          neutrals: {
            base: "#24273a",
            surface0: "#363a4f",
            surface1: "#494d64",
            surface2: "#5b6078",
          },
        },
        mocha: {
          accents: {
            rosewater: "#f5e0dc",
            flamingo: "#f2cdcd",
            pink: "#f5c2e7",
            mauve: "#cba6f7",
            red: "#f38ba8",
            maroon: "#eba0ac",
            peach: "#fab387",
            yellow: "#f9e2af",
            green: "#a6e3a1",
            teal: "#94e2d5",
            sky: "#89dceb",
            sapphire: "#74c7ec",
            blue: "#89b4fa",
            lavender: "#b4befe",
          },
          neutrals: {
            base: "#1e1e2e",
            surface0: "#313244",
            surface1: "#45475a",
            surface2: "#585b70",
          },
        },
      };

      // 🌌 REVOLUTIONARY BLENDING CONFIGURATION - Year 3000 Artistic Boldness
      this.vibrancyConfig = {
        defaultBlendRatio: 0.95, // BOLD! 95% extracted color dominance (was 0.85)
        minimumSaturation: 0.6, // DEMAND VIBRANCY! Up from pathetic 0.4
        maximumDesaturation: 0.05, // PREVENT COLOR DEATH! Down from 0.15
        contrastBoostIntensity: 2.2, // STRONGER CONTRAST! Up from 1.8
        harmonyTolerance: 0.35, // ARTISTIC FREEDOM! Down from restrictive 0.55

        // 🎨 NEW: Artistic Enhancement Factors
        artisticSaturationBoost: 1.2, // 20% saturation enhancement for extracted colors
        cosmicLuminanceBoost: 1.15, // 15% luminance boost for cosmic presence
        energyResponsiveness: 0.8, // How much music energy affects color intensity

        // 🌟 Dynamic Blending Based on Artistic Mode
        getBlendRatio(artisticMode = "artist-vision") {
          const ratios = {
            "corporate-safe": 0.75, // Conservative: 75% extracted
            "artist-vision": 0.95, // Bold: 95% extracted
            "cosmic-maximum": 0.98, // Maximum: 98% extracted!
          };
          return ratios[artisticMode] || this.defaultBlendRatio;
        },

        // 🎵 Music-Driven Intensity Scaling
        getMusicIntensityMultiplier(energy = 0.5, valence = 0.5) {
          const baseMultiplier =
            YEAR3000_CONFIG.getCurrentMultipliers().musicEnergyBoost;
          const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1.0 : 0.8;
          const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1.0;
          return baseMultiplier * energyBoost * valenceBoost;
        },
      };
    }

    detectCurrentTheme() {
      const rootStyle = getComputedStyle(document.documentElement);
      const baseColor = rootStyle.getPropertyValue("--spice-main").trim();

      const themeMap = {
        303446: "frappe",
        EFF1F5: "latte",
        "24273A": "macchiato",
        "1e1e2e": "mocha",
      };

      return themeMap[baseColor] || "mocha";
    }

    validateColorHarmony(color, context = "general") {
      const startTime = performance.now();
      this.harmonyMetrics.validations++;

      // 🎨 ARTISTIC REQUIREMENTS - Bold Expression Over Corporate Safety
      const contextRequirements = {
        general: {
          minContrast: 1.8, // BOLD! Down from paranoid 2.5
          minHarmony: this.vibrancyConfig.harmonyTolerance, // Uses artistic 0.35
        },
        search: {
          minContrast: 2.8, // ARTISTIC! Down from paranoid 3.5
          minHarmony: 0.4, // PERMISSIVE! Down from restrictive 0.6
        },
        navigation: {
          minContrast: 2.5, // EXPRESSIVE! Down from 3.5
          minHarmony: 0.45, // FREEDOM! Down from 0.65
        },
        text: {
          minContrast: 4.5, // READABLE! Down from excessive 6.0
          minHarmony: 0.6, // BALANCED! Down from 0.8
        },
        accent: {
          minContrast: 1.5, // VIBRANT! Down from 2.5
          minHarmony: 0.3, // ARTISTIC! Down from 0.5
        },
      };

      const requirements =
        contextRequirements[context] || contextRequirements.general;
      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      const backgroundColor = currentPalette.neutrals.base;

      const contrastRatio = Year3000Utilities.calculateContrastRatio(
        color,
        backgroundColor
      );
      const harmonyScore = this.calculateHarmonyScore(color, currentPalette);

      // 🌟 ARTISTIC MODE OVERRIDE - Let Artists Choose Bold Expression
      const currentMode = YEAR3000_CONFIG.artisticMode;
      let adjustedRequirements = { ...requirements };

      if (currentMode === "cosmic-maximum") {
        // Cosmic mode: Minimal restrictions, maximum artistic freedom
        adjustedRequirements.minContrast *= 0.7; // 30% more permissive
        adjustedRequirements.minHarmony *= 0.6; // 40% more permissive
      } else if (currentMode === "artist-vision") {
        // Artist mode: Reduced restrictions for creative expression
        adjustedRequirements.minContrast *= 0.85; // 15% more permissive
        adjustedRequirements.minHarmony *= 0.8; // 20% more permissive
      }
      // Corporate mode keeps original requirements (the cowards!)

      const meetsContrast = contrastRatio >= adjustedRequirements.minContrast;
      const isHarmonious = harmonyScore >= adjustedRequirements.minHarmony;

      const endTime = performance.now();
      this.harmonyMetrics.performance.push(endTime - startTime);

      return {
        valid: meetsContrast && isHarmonious,
        contrastRatio,
        harmonyScore,
        meetsContrast,
        isHarmonious,
        artisticMode: currentMode,
        adjustedRequirements,
        recommendations: this.generateRecommendations(
          color,
          contrastRatio,
          harmonyScore,
          adjustedRequirements
        ),
      };
    }

    calculateHarmonyScore(color, palette) {
      const colorRgb = Year3000Utilities.hexToRgb(color);
      if (!colorRgb) return 0;

      const colorHsl = Year3000Utilities.rgbToHsl(
        colorRgb.r,
        colorRgb.g,
        colorRgb.b
      );

      let maxHarmony = 0;
      Object.values(palette.accents).forEach((accentColor) => {
        const accentRgb = Year3000Utilities.hexToRgb(accentColor);
        if (!accentRgb) return;

        const accentHsl = Year3000Utilities.rgbToHsl(
          accentRgb.r,
          accentRgb.g,
          accentRgb.b
        );
        const hueDiff = Math.abs(colorHsl.h - accentHsl.h);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

        // Relaxed harmony angles for more vibrancy
        const harmoniousAngles = [
          0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
        ];
        const isHarmonious = harmoniousAngles.some(
          (angle) => Math.abs(normalizedHueDiff - angle) < 20
        ); // Increased tolerance

        if (isHarmonious) {
          const harmonyStrength =
            1 -
            Math.min(
              ...harmoniousAngles.map((angle) =>
                Math.abs(normalizedHueDiff - angle)
              )
            ) /
              20;
          maxHarmony = Math.max(maxHarmony, harmonyStrength);
        }
      });

      return maxHarmony;
    }

    findBestHarmoniousAccent(rgb, palette) {
      const hsl = Year3000Utilities.rgbToHsl(rgb.r, rgb.g, rgb.b);
      const accentPriority = [
        "mauve",
        "lavender",
        "blue",
        "sapphire",
        "sky",
        "pink",
        "peach",
        "teal",
      ];

      let bestAccent = null;
      let bestScore = 0;

      accentPriority.forEach((accentName) => {
        if (palette.accents[accentName]) {
          const accentRgb = Year3000Utilities.hexToRgb(
            palette.accents[accentName]
          );
          if (!accentRgb) return;

          const accentHsl = Year3000Utilities.rgbToHsl(
            accentRgb.r,
            accentRgb.g,
            accentRgb.b
          );
          const hueDiff = Math.abs(hsl.h - accentHsl.h);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

          // Enhanced scoring that favors vibrant accents
          const harmonyScore = 1 - normalizedHueDiff / 180;
          const saturationBonus = (accentHsl.s / 100) * 0.3; // Bonus for more saturated colors
          const totalScore = harmonyScore + saturationBonus;

          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestAccent = {
              name: accentName,
              hex: palette.accents[accentName],
              rgb: accentRgb,
            };
          }
        }
      });

      return (
        bestAccent || {
          name: "mauve",
          hex: palette.accents.mauve,
          rgb: Year3000Utilities.hexToRgb(palette.accents.mauve),
        }
      );
    }

    blendColors(rgb1, rgb2, ratio = this.vibrancyConfig.defaultBlendRatio) {
      // 🌟 ENHANCED ARTISTIC BLENDING - Preserve and Boost Vibrancy
      const hsl1 = Year3000Utilities.rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
      const hsl2 = Year3000Utilities.rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

      // 🎨 Dynamic ratio based on artistic mode
      const artisticMode = YEAR3000_CONFIG.artisticMode;
      const dynamicRatio = this.vibrancyConfig.getBlendRatio(artisticMode);

      // Blend with artistic saturation preservation and enhancement
      const blendedHsl = {
        h: hsl1.h * dynamicRatio + hsl2.h * (1 - dynamicRatio),
        s: Math.max(
          hsl1.s * dynamicRatio + hsl2.s * (1 - dynamicRatio),
          this.vibrancyConfig.minimumSaturation * 100 // Enforces minimum 60% saturation
        ),
        l: hsl1.l * dynamicRatio + hsl2.l * (1 - dynamicRatio),
      };

      // 🌟 ARTISTIC ENHANCEMENT BASED ON MODE
      const multipliers = YEAR3000_CONFIG.getCurrentMultipliers();

      // Apply artistic saturation boost
      blendedHsl.s = Math.min(
        100,
        blendedHsl.s * this.vibrancyConfig.artisticSaturationBoost
      );

      // Apply cosmic luminance boost for presence
      if (artisticMode !== "corporate-safe") {
        blendedHsl.l = Math.min(
          95,
          blendedHsl.l * this.vibrancyConfig.cosmicLuminanceBoost
        );
      }

      // 🎵 Additional saturation boost from music energy (if available)
      if (YEAR3000_CONFIG.enableCosmicSync && window.currentMusicAnalysis) {
        const musicBoost = this.vibrancyConfig.getMusicIntensityMultiplier(
          window.currentMusicAnalysis.energy || 0.5,
          window.currentMusicAnalysis.valence || 0.5
        );
        blendedHsl.s = Math.min(
          100,
          blendedHsl.s * (1 + (musicBoost - 1) * 0.3)
        ); // 30% of music boost applied to saturation
      }

      const blendedRgb = Year3000Utilities.hslToRgb(
        blendedHsl.h,
        blendedHsl.s,
        blendedHsl.l
      );
      return Year3000Utilities.rgbToHex(
        blendedRgb.r,
        blendedRgb.g,
        blendedRgb.b
      );
    }

    blendWithCatppuccin(extractedColors, musicContext = null) {
      const startTime = performance.now();
      this.harmonyMetrics.blends++;

      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      const harmonizedColors = {};

      Object.entries(extractedColors).forEach(([role, color]) => {
        if (!color) return;

        const extractedRgb = Year3000Utilities.hexToRgb(color);
        if (!extractedRgb) return;

        const bestAccent = this.findBestHarmoniousAccent(
          extractedRgb,
          currentPalette
        );

        // Dynamic blend ratio based on music context and vibrancy settings
        let blendRatio = this.vibrancyConfig.defaultBlendRatio;
        if (musicContext) {
          if (musicContext.energy > 0.7) blendRatio = 0.9; // More extracted color for high energy
          if (musicContext.valence > 0.6) blendRatio += 0.05; // Slight boost for positive music
        }

        harmonizedColors[role] = this.blendColors(
          extractedRgb,
          bestAccent.rgb,
          blendRatio
        );
      });

      const endTime = performance.now();
      this.harmonyMetrics.performance.push(endTime - startTime);

      return harmonizedColors;
    }

    generateRecommendations(color, contrastRatio, harmonyScore, requirements) {
      const recommendations = [];

      if (contrastRatio < requirements.minContrast) {
        recommendations.push(
          "Increase contrast - consider blending with brighter Catppuccin accent"
        );
      }
      if (harmonyScore < requirements.minHarmony) {
        recommendations.push(
          "Improve harmony - blend with complementary Catppuccin colors"
        );
      }

      return recommendations;
    }

    getPerformanceReport() {
      const avgTime =
        this.harmonyMetrics.performance.length > 0
          ? this.harmonyMetrics.performance.reduce((a, b) => a + b, 0) /
            this.harmonyMetrics.performance.length
          : 0;

      return {
        validations: this.harmonyMetrics.validations,
        harmonizations: this.harmonyMetrics.harmonizations,
        blends: this.harmonyMetrics.blends,
        averageProcessingTime: Math.round(avgTime * 100) / 100,
        vibrancyConfig: this.vibrancyConfig,
      };
    }
  }

  // =============================================================================
  // YEAR 3000 BMP HARMONY ENGINE - Intelligent Music Synchronization System
  // =============================================================================

  // BMP Harmony Engine Configuration
  const BMP_HARMONY_CONFIG = {
    enableDebug: true,
    enableBeatSynchronization: true,
    enableGenreAnalysis: true,
    enableMoodAdaptation: true,

    // Core calculation settings
    bpmCalculation: {
      useEnhancedAlgorithm: true,
      danceabilityWeight: 0.9,
      energyWeight: 0.6,
      bpmWeight: 0.6,
      energyThreshold: 0.5,
      danceabilityThreshold: 0.5,
      bpmThreshold: 0.8, // 80 BPM threshold for slow songs
      maxBPM: 100,
      minBPM: 70,
    },

    // Synchronization settings
    synchronization: {
      beatAccuracyTarget: 50, // milliseconds
      maxSyncDelay: 1000, // milliseconds
      adaptiveQuality: true,
      predictiveCaching: true,
      debounceRapidChanges: 200, // milliseconds
    },

    // Performance settings
    performance: {
      cacheSize: 100,
      cacheTTL: 300000, // 5 minutes
      maxRetries: 10,
      retryDelay: 200,
      enableMetrics: true,
      processingTimeTarget: 50, // milliseconds
    },

    // Genre-specific optimization profiles
    genreProfiles: {
      electronic: { intensityMultiplier: 1.2, precisionBoost: 1.1 },
      jazz: { smoothingFactor: 1.3, adaptiveVariation: true },
      classical: { gentleMode: true, tempoVariationHandling: "adaptive" },
      rock: { energyBoost: 1.15, consistentTiming: true },
      ambient: { subtleMode: true, intensityReduction: 0.7 },
      hiphop: { beatEmphasis: 1.25, rhythmPrecision: "high" },
      default: { balanced: true },
    },
  };

  /**
   * BMP Harmony Engine - Centralized music synchronization intelligence
   *
   * Provides intelligent BPM calculation, beat synchronization, and animation
   * target management for creating perfectly timed visual effects that respond
   * to music in real-time.
   */
  class BMPHarmonyEngine {
    constructor() {
      this.isInitialized = false;
      this.currentTrack = null;
      this.audioData = null;

      // Performance and metrics tracking
      this.harmonyMetrics = {
        bpmCalculations: 0,
        beatSyncs: 0,
        cacheHits: 0,
        cacheMisses: 0,
        avgProcessingTime: 0,
        performance: [],
        errors: 0,
      };

      // Caching system for audio analysis data
      this.audioCache = new Map();
      this.genreCache = new Map();

      // Animation targets registry
      this.animationTargets = new Map();
      this.synchronizationGroups = new Map();

      // Beat synchronization state
      this.beatSync = {
        lastBeatTime: 0,
        nextBeatTime: 0,
        beatInterval: 0,
        confidence: 0,
        isActive: false,
      };

      // User preferences and learning
      this.userPreferences = this.loadUserPreferences();

      this.initialize();
    }

    /**
     * Initialize the BMP Harmony Engine
     */
    async initialize() {
      try {
        console.log("🎵 Initializing BMP Harmony Engine...");

        // Verify required APIs are available
        if (!Spicetify?.getAudioData) {
          throw new Error("Spicetify audio data API not available");
        }

        // Initialize caching system
        this.setupCacheManagement();

        // Initialize performance monitoring
        this.setupPerformanceMonitoring();

        this.isInitialized = true;
        console.log("🌟 BMP Harmony Engine initialized successfully!");
      } catch (error) {
        console.error("❌ BMP Harmony Engine initialization failed:", error);
        this.harmonyMetrics.errors++;
      }
    }

    /**
     * Enhanced BPM calculation using audio features analysis
     * Centralizes the Cat-Jam BPM calculation logic with improvements
     */
    async calculateEnhancedBPM(audioData, options = {}) {
      const startTime = performance.now();

      try {
        if (!audioData?.track?.tempo) {
          console.warn("[BMP-HARMONY] No BPM data available for track");
          return this.getFallbackBPM();
        }

        const trackBPM = audioData.track.tempo;
        const config = { ...BMP_HARMONY_CONFIG.bpmCalculation, ...options };

        // Get enhanced audio features if available
        const audioFeatures = await this.getAudioFeatures();

        if (!audioFeatures) {
          console.log("[BMP-HARMONY] Using basic BPM calculation");
          return this.validateBPM(trackBPM);
        }

        // Enhanced calculation using danceability, energy, and valence
        const danceability = audioFeatures.danceability;
        const energy = audioFeatures.energy;
        const valence = audioFeatures.valence || 0.5; // happiness/positivity

        console.log(
          `[BMP-HARMONY] Audio features - Danceability: ${danceability}, Energy: ${energy}, Valence: ${valence}`
        );

        const enhancedBPM = this.computeAdvancedBPM({
          trackBPM,
          danceability,
          energy,
          valence,
          config,
        });

        // Cache the result
        const cacheKey = this.generateCacheKey(audioData.track.uri);
        this.audioCache.set(cacheKey, {
          bpm: enhancedBPM,
          timestamp: Date.now(),
          audioFeatures,
        });

        // Update metrics
        this.harmonyMetrics.bpmCalculations++;
        this.trackPerformance(startTime);

        console.log(
          `[BMP-HARMONY] Enhanced BPM calculated: ${enhancedBPM} (original: ${trackBPM})`
        );
        return enhancedBPM;
      } catch (error) {
        console.error("[BMP-HARMONY] BPM calculation failed:", error);
        this.harmonyMetrics.errors++;
        return this.getFallbackBPM();
      }
    }

    /**
     * Advanced BPM computation algorithm
     * Improved version of the Cat-Jam calculateBetterBPM function
     */
    computeAdvancedBPM({ trackBPM, danceability, energy, valence, config }) {
      const {
        danceabilityWeight,
        energyWeight,
        bpmWeight,
        energyThreshold,
        danceabilityThreshold,
        bpmThreshold,
        maxBPM,
        minBPM,
      } = config;

      // Normalize values
      const normalizedBPM = Math.min(trackBPM / 100, 2.0); // Cap at 200 BPM = 2.0
      const normalizedDanceability = danceability;
      const normalizedEnergy = energy;

      // Dynamic weight adjustment based on thresholds
      let adjustedDanceabilityWeight = danceabilityWeight;
      let adjustedEnergyWeight = energyWeight;
      let adjustedBpmWeight = bpmWeight;

      // Reduce danceability influence for non-danceable tracks
      if (normalizedDanceability < danceabilityThreshold) {
        adjustedDanceabilityWeight *= normalizedDanceability;
      }

      // Reduce energy influence for low-energy tracks
      if (normalizedEnergy < energyThreshold) {
        adjustedEnergyWeight *= normalizedEnergy;
      }

      // Increase BPM weight for slow songs to prevent over-correction
      if (normalizedBPM < bpmThreshold) {
        adjustedBpmWeight = 0.9;
      }

      // Add valence influence for mood-based adjustments
      const valenceInfluence = valence > 0.6 ? 1.1 : valence < 0.4 ? 0.9 : 1.0;

      // Calculate weighted average
      const weightSum =
        adjustedDanceabilityWeight + adjustedEnergyWeight + adjustedBpmWeight;
      const weightedAverage =
        (normalizedDanceability * adjustedDanceabilityWeight +
          normalizedEnergy * adjustedEnergyWeight +
          normalizedBPM * adjustedBpmWeight) /
        weightSum;

      let enhancedBPM = weightedAverage * maxBPM * valenceInfluence;

      // Smart limiting to prevent extreme values
      if (enhancedBPM > trackBPM) {
        // For faster results, blend with original
        enhancedBPM = (enhancedBPM + trackBPM) / 2;
      }

      if (enhancedBPM < trackBPM) {
        // Ensure minimum BPM for slow songs
        enhancedBPM = Math.max(enhancedBPM, minBPM);
      }

      // Final validation
      return this.validateBPM(enhancedBPM);
    }

    /**
     * Get audio features from Spotify API with caching
     */
    async getAudioFeatures() {
      try {
        const currentTrack = Spicetify.Player.data?.item;
        if (!currentTrack?.uri) return null;

        const trackId = currentTrack.uri.split(":")[2];
        const cacheKey = `features_${trackId}`;

        // Check cache first
        if (this.audioCache.has(cacheKey)) {
          this.harmonyMetrics.cacheHits++;
          return this.audioCache.get(cacheKey).audioFeatures;
        }

        this.harmonyMetrics.cacheMisses++;

        // Fetch from Spotify API
        const response = await Spicetify.CosmosAsync.get(
          `https://api.spotify.com/v1/audio-features/${trackId}`
        );

        const features = {
          danceability: response.danceability,
          energy: response.energy,
          valence: response.valence,
          acousticness: response.acousticness,
          instrumentalness: response.instrumentalness,
          tempo: response.tempo,
        };

        // Cache the result
        this.audioCache.set(cacheKey, {
          audioFeatures: features,
          timestamp: Date.now(),
        });

        return features;
      } catch (error) {
        console.warn("[BMP-HARMONY] Could not fetch audio features:", error);
        return null;
      }
    }

    /**
     * Fetch audio data with intelligent retry handling
     * Improved version of the Cat-Jam fetchAudioData function
     */
    async fetchAudioData(options = {}) {
      const {
        retryDelay = BMP_HARMONY_CONFIG.performance.retryDelay,
        maxRetries = BMP_HARMONY_CONFIG.performance.maxRetries,
      } = options;

      const cacheKey = this.generateCacheKey(Spicetify.Player.data?.item?.uri);

      // Check cache first
      if (this.audioCache.has(cacheKey)) {
        const cached = this.audioCache.get(cacheKey);
        const cacheAge = Date.now() - cached.timestamp;

        if (cacheAge < BMP_HARMONY_CONFIG.performance.cacheTTL) {
          this.harmonyMetrics.cacheHits++;
          return cached.audioData;
        }
      }

      this.harmonyMetrics.cacheMisses++;

      // Fetch fresh data with retries
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const audioData = await Spicetify.getAudioData();

          // Cache successful result
          this.audioCache.set(cacheKey, {
            audioData,
            timestamp: Date.now(),
          });

          return audioData;
        } catch (error) {
          if (
            error?.message?.includes("Cannot read properties of undefined") &&
            attempt < maxRetries - 1
          ) {
            console.log(
              `[BMP-HARMONY] Retrying audio data fetch (attempt ${
                attempt + 1
              }/${maxRetries})...`
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            continue;
          }

          console.warn(
            `[BMP-HARMONY] Audio data fetch failed after ${
              attempt + 1
            } attempts:`,
            error
          );
          this.harmonyMetrics.errors++;
          return null;
        }
      }

      return null;
    }

    /**
     * Calculate optimal playback rate for synchronized content
     * Enhanced version of the Cat-Jam getPlaybackRate function
     */
    async calculatePlaybackRate(videoDefaultBPM = 135.48, options = {}) {
      try {
        if (!this.audioData) {
          this.audioData = await this.fetchAudioData();
        }

        if (!this.audioData?.track?.tempo) {
          console.warn(
            "[BMP-HARMONY] No BPM data available, using default rate"
          );
          return 1.0;
        }

        const enhancedBPM = await this.calculateEnhancedBPM(
          this.audioData,
          options
        );
        const playbackRate = enhancedBPM / videoDefaultBPM;

        // Reasonable limits to prevent jarring playback
        const clampedRate = Math.max(0.5, Math.min(2.0, playbackRate));

        console.log(
          `[BMP-HARMONY] Playback rate calculated: ${clampedRate} (BPM: ${enhancedBPM}/${videoDefaultBPM})`
        );
        return clampedRate;
      } catch (error) {
        console.error("[BMP-HARMONY] Playback rate calculation failed:", error);
        this.harmonyMetrics.errors++;
        return 1.0;
      }
    }

    // Helper methods
    validateBPM(bpm) {
      const { minBPM, maxBPM } = BMP_HARMONY_CONFIG.bpmCalculation;
      return Math.max(
        minBPM,
        Math.min(maxBPM * 2, Math.round(bpm * 100) / 100)
      );
    }

    getFallbackBPM() {
      return 75; // Safe default BPM for when calculation fails
    }

    generateCacheKey(uri) {
      return uri ? `bmp_${uri.split(":")[2]}` : `bmp_${Date.now()}`;
    }

    setupCacheManagement() {
      // Periodic cache cleanup
      setInterval(() => {
        const now = Date.now();
        const ttl = BMP_HARMONY_CONFIG.performance.cacheTTL;

        for (const [key, data] of this.audioCache.entries()) {
          if (now - data.timestamp > ttl) {
            this.audioCache.delete(key);
          }
        }

        // Limit cache size
        const maxSize = BMP_HARMONY_CONFIG.performance.cacheSize;
        if (this.audioCache.size > maxSize) {
          const keysToDelete = Array.from(this.audioCache.keys()).slice(
            0,
            this.audioCache.size - maxSize
          );
          keysToDelete.forEach((key) => this.audioCache.delete(key));
        }
      }, 60000); // Check every minute
    }

    setupPerformanceMonitoring() {
      if (!BMP_HARMONY_CONFIG.performance.enableMetrics) return;

      // Performance tracking
      this.performanceInterval = setInterval(() => {
        const report = this.getPerformanceReport();

        if (
          report.avgProcessingTime >
          BMP_HARMONY_CONFIG.performance.processingTimeTarget
        ) {
          console.warn(
            `[BMP-HARMONY] Performance warning: Average processing time ${report.avgProcessingTime}ms exceeds target`
          );
        }
      }, 30000); // Check every 30 seconds
    }

    trackPerformance(startTime) {
      const duration = performance.now() - startTime;
      this.harmonyMetrics.performance.push(duration);

      // Keep only recent measurements
      if (this.harmonyMetrics.performance.length > 100) {
        this.harmonyMetrics.performance.shift();
      }

      // Update average
      this.harmonyMetrics.avgProcessingTime =
        this.harmonyMetrics.performance.reduce((a, b) => a + b, 0) /
        this.harmonyMetrics.performance.length;
    }

    loadUserPreferences() {
      try {
        const stored = localStorage.getItem("bmp-harmony-preferences");
        return stored ? JSON.parse(stored) : {};
      } catch (error) {
        console.warn("[BMP-HARMONY] Could not load user preferences:", error);
        return {};
      }
    }

    saveUserPreferences() {
      try {
        localStorage.setItem(
          "bmp-harmony-preferences",
          JSON.stringify(this.userPreferences)
        );
      } catch (error) {
        console.warn("[BMP-HARMONY] Could not save user preferences:", error);
      }
    }

    getPerformanceReport() {
      return {
        ...this.harmonyMetrics,
        cacheSize: this.audioCache.size,
        cacheHitRate:
          this.harmonyMetrics.cacheHits /
            (this.harmonyMetrics.cacheHits + this.harmonyMetrics.cacheMisses) ||
          0,
        isInitialized: this.isInitialized,
        config: BMP_HARMONY_CONFIG,
      };
    }

    // Public API for external integration
    async updateFromCurrentTrack() {
      try {
        this.currentTrack = Spicetify.Player.data?.item;
        if (!this.currentTrack?.uri) return null;

        this.audioData = await this.fetchAudioData();
        return this.audioData;
      } catch (error) {
        console.error("[BMP-HARMONY] Track update failed:", error);
        this.harmonyMetrics.errors++;
        return null;
      }
    }

    async getEnhancedBPMForCurrentTrack(options = {}) {
      await this.updateFromCurrentTrack();
      return this.calculateEnhancedBPM(this.audioData, options);
    }

    async getPlaybackRateForVideo(videoDefaultBPM) {
      return this.calculatePlaybackRate(videoDefaultBPM);
    }
  }

  // =============================================================================
  // YEAR 3000 MUSIC ANALYSIS SERVICE - Centralized Music Feature Processing
  // =============================================================================
  class MusicAnalysisService {
    constructor() {
      this.subscribers = new Map(); // Stores { systemName: systemInstance }
      this.processedDataCache = new Map();
      this.cacheTTL = 5 * 60 * 1000; // 5 minutes
      this.isInitialized = false;
      this.currentTrackUri = null;

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[MusicAnalysisService] Constructor`);
      }
      this.initialize();
    }

    initialize() {
      this.isInitialized = true;
      if (YEAR3000_CONFIG.enableDebug) {
        console.log("[MusicAnalysisService] Initialized successfully!");
      }
    }

    subscribe(systemInstance, systemName) {
      if (
        !systemInstance ||
        typeof systemInstance.updateFromMusicAnalysis !== "function"
      ) {
        console.warn(
          `[MusicAnalysisService] Attempted to subscribe invalid system or system without updateFromMusicAnalysis method: ${systemName}`
        );
        return;
      }
      if (this.subscribers.has(systemName)) {
        console.warn(
          `[MusicAnalysisService] System ${systemName} is already subscribed.`
        );
        return;
      }
      this.subscribers.set(systemName, systemInstance);
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[MusicAnalysisService] System subscribed: ${systemName}`);
      }
    }

    unsubscribe(systemName) {
      if (this.subscribers.has(systemName)) {
        this.subscribers.delete(systemName);
        if (YEAR3000_CONFIG.enableDebug) {
          console.log(
            `[MusicAnalysisService] System unsubscribed: ${systemName}`
          );
        }
      } else {
        if (YEAR3000_CONFIG.enableDebug) {
          console.warn(
            `[MusicAnalysisService] Attempted to unsubscribe non-existent system: ${systemName}`
          );
        }
      }
    }

    notifySubscribers(processedData, rawFeatures, trackUri) {
      if (!this.isInitialized) {
        console.warn(
          "[MusicAnalysisService] Not initialized, cannot notify subscribers."
        );
        return;
      }
      if (
        YEAR3000_CONFIG.enableDebug &&
        this.subscribers.size > 0 &&
        Math.random() < 0.02
      ) {
        // Sparse log
        // console.log(`[MusicAnalysisService] Notifying ${this.subscribers.size} subscribers for track ${trackUri}`);
      }
      for (const [name, system] of this.subscribers) {
        try {
          if (
            system.isInitialized &&
            typeof system.updateFromMusicAnalysis === "function"
          ) {
            system.updateFromMusicAnalysis(
              processedData,
              rawFeatures,
              trackUri
            );
          } else {
            if (YEAR3000_CONFIG.enableDebug) {
              // console.warn(`[MusicAnalysisService] Subscriber ${name} is not initialized or lacks updateFromMusicAnalysis method.`);
            }
          }
        } catch (error) {
          console.error(
            `[MusicAnalysisService] Error updating system ${name}:`,
            error
          );
          if (system.metrics && typeof system.metrics.errors !== "undefined") {
            system.metrics.errors++;
          }
        }
      }
    }

    async processAudioFeatures(
      rawSpicetifyAudioFeatures,
      trackUri,
      trackDurationMs
    ) {
      if (!this.isInitialized) {
        console.warn(
          "[MusicAnalysisService] Not initialized, skipping processing."
        );
        return null;
      }
      this.currentTrackUri = trackUri;

      const cacheKey = trackUri;
      if (this.processedDataCache.has(cacheKey)) {
        const cached = this.processedDataCache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTTL) {
          // console.log("[MusicAnalysisService] Returning cached processed data for:", trackUri); // Reduce noise
          // Ensure subscribers are notified even when serving from cache
          this.notifySubscribers(
            cached.data,
            rawSpicetifyAudioFeatures,
            trackUri
          );
          return cached.data;
        }
      }

      // Fallback values & Feature Extraction (simplified from existing for brevity, ensure robust in actual impl)
      let energy = 0.5,
        valence = 0.5,
        danceability = 0.5,
        tempo = 120;
      const playerDataItem = Spicetify.Player.data?.item;

      if (rawSpicetifyAudioFeatures) {
        // Spotify API audio_features
        energy = rawSpicetifyAudioFeatures.energy ?? energy;
        valence = rawSpicetifyAudioFeatures.valence ?? valence;
        danceability = rawSpicetifyAudioFeatures.danceability ?? danceability;
        tempo = rawSpicetifyAudioFeatures.tempo ?? tempo;
      } else if (
        playerDataItem?.audio_features &&
        playerDataItem?.uri === trackUri
      ) {
        // Fallback to Spicetify.Player.data
        energy = playerDataItem.audio_features.energy ?? energy;
        valence = playerDataItem.audio_features.valence ?? valence;
        danceability =
          playerDataItem.audio_features.danceability ?? danceability;
        tempo = playerDataItem.audio_features.tempo ?? tempo;
      } else if (
        playerDataItem?.uri === trackUri &&
        typeof playerDataItem.energy === "number"
      ) {
        // Fallback for basic track objects
        energy = playerDataItem.energy ?? energy;
        valence = playerDataItem.valence ?? valence;
        danceability = playerDataItem.danceability ?? danceability; // May not exist
        tempo = playerDataItem.tempo ?? tempo; // May not exist
        if (YEAR3000_CONFIG.enableDebug)
          console.warn(
            `[MusicAnalysisService] Using basic track properties for ${trackUri}. Full features preferred.`
          );
      } else {
        if (YEAR3000_CONFIG.enableDebug)
          console.warn(
            `[MusicAnalysisService] Audio features for ${trackUri} not fully available. Using defaults.`
          );
      }

      const syncConfig = YEAR3000_CONFIG.musicVisualSync;
      const artisticMultipliers = YEAR3000_CONFIG.getCurrentMultipliers();

      let processedEnergy = energy;
      if (energy < 0.4) processedEnergy *= syncConfig.energyScaling.low;
      else if (energy > 0.7) processedEnergy *= syncConfig.energyScaling.high;
      else processedEnergy *= syncConfig.energyScaling.medium;

      let processedValence = valence;
      if (valence < 0.4) processedValence *= syncConfig.valenceScaling.sad;
      else if (valence > 0.6)
        processedValence *= syncConfig.valenceScaling.happy;
      else processedValence *= syncConfig.valenceScaling.neutral;

      let animationSpeedMultiplier = 1.0;
      let blurVariation = 0.0;
      if (syncConfig.danceabilityEffects.enable && danceability > 0.6) {
        animationSpeedMultiplier =
          syncConfig.danceabilityEffects.animationSpeedMultiplier;
        blurVariation =
          syncConfig.danceabilityEffects.blurVariation *
          (danceability - 0.6) *
          2.5;
      }

      const visualIntensity = Math.max(
        0,
        Math.min(1, (processedEnergy + danceability) / 2)
      ); // Ensure clamped 0-1
      const finalVisualIntensity = Math.min(
        1.0,
        visualIntensity * artisticMultipliers.musicEnergyBoost
      );

      let mood = "neutral";
      if (processedEnergy > 0.7 && processedValence > 0.6)
        mood = "energetic_happy";
      else if (processedEnergy < 0.4 && processedValence < 0.4)
        mood = "calm_sad";
      else if (processedEnergy > 0.65) mood = "energetic"; // Adjusted threshold
      else if (processedValence > 0.6) mood = "happy";
      else if (processedValence < 0.4) mood = "sad";
      else if (danceability > 0.7) mood = "danceable";

      const processedData = {
        rawEnergy: energy,
        rawValence: valence,
        rawDanceability: danceability,
        rawTempo: tempo,
        processedEnergy: Math.max(0, Math.min(1, processedEnergy)),
        processedValence: Math.max(0, Math.min(1, processedValence)),
        visualIntensity: Math.max(0, Math.min(1, finalVisualIntensity)),
        animationSpeedFactor: animationSpeedMultiplier,
        dynamicBlurFactor: blurVariation,
        moodIdentifier: mood,
        trackUri: trackUri,
        trackDurationMs: trackDurationMs,
        timestamp: Date.now(),
      };

      this.processedDataCache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now(),
      });
      this.notifySubscribers(
        processedData,
        rawSpicetifyAudioFeatures,
        trackUri
      );
      return processedData;
    }

    clearCache() {
      this.processedDataCache.clear();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log("[MusicAnalysisService] Cache cleared.");
      }
    }

    getReport() {
      return {
        isInitialized: this.isInitialized,
        subscribersCount: this.subscribers.size,
        cachedTracks: this.processedDataCache.size,
        currentTrackUri: this.currentTrackUri,
      };
    }
  }

  // Core Color Application System with RGB Support
  const year3000System = {
    // Initialize harmony engines (existing)
    colorExtractor: {
      harmonyEngine: new ColorHarmonyEngine(),
    },
    bmpSynchronizer: {
      // Existing
      harmonyEngine: new BMPHarmonyEngine(),
    },

    // Instantiate MusicAnalysisService
    musicAnalysisService: new MusicAnalysisService(),

    // Visual & Interaction Systems (instantiated in initializeAllSystems)
    lightweightParticleSystem: null,
    dimensionalNexusSystem: null,
    dataGlyphSystem: null,
    beatSyncVisualSystem: null,
    behavioralPredictionEngine: null,
    predictiveMaterializationSystem: null,
    sidebarConsciousnessSystem: null, // NEW
    // Managers (instantiated in initializeAllSystems or main)
    card3DManagerInstance: null,
    glassmorphismManagerInstance: null,
    quantumMouseTrackerInstance: null,
    performanceMonitorInstance: null,

    async initializeAllSystems() {
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[StarryNight year3000System] Initializing all core systems...`
        );
      }
      const startTime = performance.now();

      // Performance Monitor first
      if (!this.performanceMonitorInstance) {
        this.performanceMonitorInstance = new PerformanceMonitor();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] PerformanceMonitor instantiated."
          );
      }
      // Settings Manager (settingsManagerInstance) should be initialized in main, before this method is called.

      // Instantiate and initialize visual/interactive systems
      if (!this.lightweightParticleSystem) {
        this.lightweightParticleSystem = new LightweightParticleSystem();
        await this.lightweightParticleSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] LightweightParticleSystem initialized."
          );
      }
      if (!this.dimensionalNexusSystem) {
        this.dimensionalNexusSystem = new DimensionalNexusSystem();
        await this.dimensionalNexusSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] DimensionalNexusSystem initialized."
          );
      }
      if (!this.dataGlyphSystem) {
        this.dataGlyphSystem = new DataGlyphSystem();
        await this.dataGlyphSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] DataGlyphSystem initialized."
          );
      }
      if (!this.beatSyncVisualSystem) {
        this.beatSyncVisualSystem = new BeatSyncVisualSystem();
        await this.beatSyncVisualSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] BeatSyncVisualSystem initialized."
          );
      }
      if (!this.behavioralPredictionEngine) {
        this.behavioralPredictionEngine = new BehavioralPredictionEngine();
        await this.behavioralPredictionEngine.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] BehavioralPredictionEngine initialized."
          );
      }
      if (!this.predictiveMaterializationSystem) {
        this.predictiveMaterializationSystem =
          new PredictiveMaterializationSystem();
        await this.predictiveMaterializationSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] PredictiveMaterializationSystem initialized."
          );
      }
      if (!this.sidebarConsciousnessSystem) {
        // NEW
        this.sidebarConsciousnessSystem = new SidebarConsciousnessSystem();
        await this.sidebarConsciousnessSystem.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] SidebarConsciousnessSystem initialized."
          );
      }

      // Instantiate Managers (ensure dependencies like settingsManagerInstance are available)
      // Assuming settingsManagerInstance is initialized in main() and accessible (e.g., window.settingsManagerInstance)
      if (
        !this.glassmorphismManagerInstance &&
        window.settingsManagerInstance
      ) {
        this.glassmorphismManagerInstance = new GlassmorphismManager(
          this.performanceMonitorInstance,
          window.settingsManagerInstance
        );
        // GlassmorphismManager typically initializes its settings internally or on first use.
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] GlassmorphismManager instantiated."
          );
      }
      if (!this.card3DManagerInstance && window.settingsManagerInstance) {
        this.card3DManagerInstance = new Card3DManager(
          this.performanceMonitorInstance,
          window.settingsManagerInstance
        );
        await this.card3DManagerInstance.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] Card3DManager initialized."
          );
      }
      if (!this.quantumMouseTrackerInstance) {
        this.quantumMouseTrackerInstance = new QuantumMouseTracker(
          this.performanceMonitorInstance
        );
        this.quantumMouseTrackerInstance.initialize();
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] QuantumMouseTracker initialized."
          );
      }

      // Initialize MusicAnalysisService (subscribes systems)
      // This should happen after all systems that need music data are instantiated and have potentially subscribed themselves
      // or if MusicAnalysisService's initialize method handles iterating over year3000System properties.
      // For now, assuming individual systems subscribe themselves upon their own initialization.
      if (
        this.musicAnalysisService &&
        !this.musicAnalysisService.isInitialized
      ) {
        // isInitialized might be a custom flag needed in MusicAnalysisService
        await this.musicAnalysisService.initialize(); // Ensure this is idempotent or safe to call
        if (YEAR3000_CONFIG.enableDebug)
          console.log(
            "[StarryNight year3000System] MusicAnalysisService initialized/re-checked."
          );
      }

      if (YEAR3000_CONFIG.enableDebug) {
        const endTime = performance.now();
        console.log(
          `[StarryNight year3000System] All core systems initialized in ${(
            endTime - startTime
          ).toFixed(2)}ms.`
        );
      }
    },

    // NEW: Phase 2 - Harmonic Signature Evolution Engine
    evolveHarmonicSignature: function (selectedModeKey, baseSourceHex) {
      if (
        !selectedModeKey ||
        !baseSourceHex ||
        !HARMONIC_MODES[selectedModeKey]
      ) {
        console.warn(
          "[StarryNight evolveHarmonicSignature] Invalid mode key or base hex. Mode:",
          selectedModeKey,
          "BaseHex:",
          baseSourceHex
        );
        return null; // Cannot proceed
      }

      const modeDetails = HARMONIC_MODES[selectedModeKey];
      const intensity = YEAR3000_CONFIG.harmonicIntensity;

      const baseRgb = Year3000Utilities.hexToRgb(baseSourceHex);
      if (!baseRgb) {
        console.warn(
          "[StarryNight evolveHarmonicSignature] Could not convert base hex to RGB:",
          baseSourceHex
        );
        return null;
      }
      const baseOklab = Year3000Utilities.rgbToOklab(
        baseRgb.r,
        baseRgb.g,
        baseRgb.b
      );

      const rawHarmonicOklabs = Year3000Utilities.generateHarmonicOklabColors(
        baseOklab,
        modeDetails.rule,
        modeDetails.angle
      );

      let derivedOklab1, derivedOklab2;

      if (rawHarmonicOklabs && rawHarmonicOklabs.length > 0) {
        derivedOklab1 = rawHarmonicOklabs[0];
        derivedOklab2 =
          rawHarmonicOklabs.length > 1
            ? rawHarmonicOklabs[1]
            : {
                ...rawHarmonicOklabs[0],
                L: Math.max(
                  0.1,
                  Math.min(
                    0.9,
                    rawHarmonicOklabs[0].L *
                      (rawHarmonicOklabs[0].L > 0.5 ? 0.8 : 1.2)
                  )
                ),
              };
      } else {
        derivedOklab1 = {
          ...baseOklab,
          L: Math.max(0.1, Math.min(0.9, baseOklab.L * 0.75)),
        };
        derivedOklab2 = {
          ...baseOklab,
          L: Math.max(0.1, Math.min(0.9, baseOklab.L * 1.25)),
        };
      }

      const blendWithIntensity = (targetOklab) => ({
        L: baseOklab.L + (targetOklab.L - baseOklab.L) * intensity,
        a: baseOklab.a + (targetOklab.a - baseOklab.a) * intensity,
        b: baseOklab.b + (targetOklab.b - baseOklab.b) * intensity,
      });

      const finalOklab1 = blendWithIntensity(derivedOklab1);
      const finalOklab2 = blendWithIntensity(derivedOklab2);

      const finalRgb1 = Year3000Utilities.oklabToRgb(
        finalOklab1.L,
        finalOklab1.a,
        finalOklab1.b
      );
      const finalHex1 = Year3000Utilities.rgbToHex(
        finalRgb1.r,
        finalRgb1.g,
        finalRgb1.b
      );

      const finalRgb2 = Year3000Utilities.oklabToRgb(
        finalOklab2.L,
        finalOklab2.a,
        finalOklab2.b
      );
      const finalHex2 = Year3000Utilities.rgbToHex(
        finalRgb2.r,
        finalRgb2.g,
        finalRgb2.b
      );

      let darkVibrantHex, lightVibrantHex;
      if (finalOklab1.L < finalOklab2.L) {
        darkVibrantHex = finalHex1;
        lightVibrantHex = finalHex2;
      } else {
        darkVibrantHex = finalHex2;
        lightVibrantHex = finalHex1;
      }

      return {
        derivedDarkVibrantHex: darkVibrantHex,
        derivedLightVibrantHex: lightVibrantHex,
      };
    },

    // NEW: Phase 3 Stub - Manual Harmonic Base Color Override
    updateHarmonicBaseColor: function (hexColor) {
      if (typeof YEAR3000_CONFIG !== "undefined") {
        YEAR3000_CONFIG.harmonicBaseColor = hexColor;
        console.log(
          "[StarryNight updateHarmonicBaseColor] Manual base color set to:",
          hexColor
        );
        if (this.updateColorsFromCurrentTrack) {
          this.updateColorsFromCurrentTrack();
        }
      } else {
        console.warn(
          "[StarryNight updateHarmonicBaseColor] YEAR3000_CONFIG not available."
        );
      }
    },

    // NEW: Enhanced Gradient System for Phase 1
    enhancedGradients: {
      applyCosmicHeaderGradients: (primaryRgb, secondaryRgb, accentRgb) => {
        const root = document.documentElement;
        if (!primaryRgb || !secondaryRgb || !accentRgb) {
          console.warn(
            "[StarryNight enhancedGradients] Missing RGB colors for header gradients."
          );
          // Optionally set fallback colors or do nothing
          root.style.removeProperty("--sn-header-primary-rgb");
          root.style.removeProperty("--sn-header-secondary-rgb");
          root.style.removeProperty("--sn-header-accent-rgb");
          root.style.setProperty("--sn-header-intensity", "0.1"); // Default low intensity
          return;
        }

        root.style.setProperty(
          "--sn-header-primary-rgb",
          `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
        );
        root.style.setProperty(
          "--sn-header-secondary-rgb",
          `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`
        );
        root.style.setProperty(
          "--sn-header-accent-rgb",
          `${accentRgb.r},${accentRgb.g},${accentRgb.b}`
        );

        // Apply dynamic intensity based on music energy
        const musicEnergy = window.currentMusicAnalysis?.processedEnergy || 0.5; // Use processedEnergy for better scaling
        const intensity = 0.1 + musicEnergy * 0.3; // Scale 0.1 to 0.4
        root.style.setProperty("--sn-header-intensity", intensity.toFixed(3));
        console.log(
          `[StarryNight enhancedGradients] Header intensity set to: ${intensity.toFixed(
            3
          )} based on energy: ${musicEnergy.toFixed(3)}`
        );
      },
    },

    // Apply colors with harmony validation and Catppuccin blending
    updateColorsFromCurrentTrack: async () => {
      let originalExtractedColors = null;
      try {
        const track =
          Spicetify.Player.data?.item || Spicetify.Player.state?.track;
        if (!track?.uri) {
          console.log(
            "[StarryNight updateColorsFromCurrentTrack] No track URI, applying defaults via applyColorsToTheme."
          );
          year3000System.applyColorsToTheme({}); // Apply defaults or Catppuccin base
          return;
        }

        if (YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[StarryNight updateColorsFromCurrentTrack] Attempting Spicetify.colorExtractor for track URI:",
            track.uri
          );
        }
        originalExtractedColors = await Spicetify.colorExtractor(track.uri);
        if (YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[StarryNight updateColorsFromCurrentTrack] Original extracted colors:",
            JSON.stringify(originalExtractedColors)
          );
        }
      } catch (error) {
        console.warn(
          "[StarryNight updateColorsFromCurrentTrack] Color extraction failed:",
          error
        );
        originalExtractedColors = {}; // Ensure it's an object for fallback logic
      }

      let colorsToApply = {
        ...(originalExtractedColors || {}), // Start with all original colors, or empty if extraction failed
      };

      // Phase 2: Harmonic Transmutation Logic
      const harmonicMode = YEAR3000_CONFIG.currentHarmonicMode;
      const evolveHarmonies = YEAR3000_CONFIG.harmonicEvolution;
      const manualBaseOverride = YEAR3000_CONFIG.harmonicBaseColor;

      // Condition to activate harmonic generation: a mode is selected (not 'none' or similar) AND (evolution is on OR a manual base is set)
      // For now, let's assume any selected harmonicMode implies generation if possible.
      // A specific mode like 'direct-album' could be added to HARMONIC_MODES to bypass this.
      if (harmonicMode && year3000System.evolveHarmonicSignature) {
        let baseHexForHarmonics;
        if (manualBaseOverride) {
          baseHexForHarmonics = manualBaseOverride;
          if (YEAR3000_CONFIG.enableDebug)
            console.log(
              "[StarryNight updateColors] Using manual base for harmonics:",
              baseHexForHarmonics
            );
        } else if (evolveHarmonies) {
          // Use original extracted colors as base only if evolution is on and no manual override
          baseHexForHarmonics =
            originalExtractedColors?.VIBRANT ||
            originalExtractedColors?.PROMINENT ||
            YEAR3000_CONFIG.catppuccinDefaults?.mauve ||
            "#ca9ee6"; // Absolute fallback
          if (YEAR3000_CONFIG.enableDebug)
            console.log(
              "[StarryNight updateColors] Using auto base for harmonics:",
              baseHexForHarmonics
            );
        } else {
          if (YEAR3000_CONFIG.enableDebug)
            console.log(
              "[StarryNight updateColors] Harmonic evolution disabled and no manual base. Applying original/default colors."
            );
          // When evolution is off and no manual base, we just use originalExtractedColors further down.
          // No special harmonic processing needed here, colorsToApply is already originalExtractedColors.
        }

        // Proceed only if we have a baseHex determined from override or auto-extraction for evolution
        if (baseHexForHarmonics) {
          const harmonicSet = year3000System.evolveHarmonicSignature(
            harmonicMode,
            baseHexForHarmonics
          );

          if (harmonicSet) {
            if (YEAR3000_CONFIG.enableDebug) {
              console.log(
                "[StarryNight updateColors] Generated harmonic set:",
                JSON.stringify(harmonicSet)
              );
            }
            // The primary gradient color will be the original baseHexForHarmonics (the anchor).
            // The derived colors become secondary and accent.
            colorsToApply = {
              ...colorsToApply, // Preserve other non-gradient colors from original extraction if any
              VIBRANT: baseHexForHarmonics, // Main anchor color for the theme
              DARK_VIBRANT: harmonicSet.derivedDarkVibrantHex, // First derived harmonic
              LIGHT_VIBRANT: harmonicSet.derivedLightVibrantHex, // Second derived harmonic
            };
          } else {
            if (YEAR3000_CONFIG.enableDebug)
              console.warn(
                "[StarryNight updateColors] evolveHarmonicSignature returned null. Using original/default colors."
              );
          }
        }
      }

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          "[StarryNight updateColors] Final colors to apply to theme:",
          JSON.stringify(colorsToApply)
        );
      }
      year3000System.applyColorsToTheme(colorsToApply || {}); // Ensure an object is always passed
    },

    // Apply harmonized colors with enhanced safety for search components
    applyHarmonizedColorsToTheme: (harmonizedColors, originalColors) => {
      // THIS IS THE OLDER VERSION
      const root = document.documentElement;
      const harmonyEngine = year3000System.colorExtractor.harmonyEngine;

      // Use harmonized colors with search-specific validation
      const primaryColor =
        harmonizedColors.VIBRANT || harmonizedColors.PROMINENT || "#ca9ee6";
      const secondaryColor =
        harmonizedColors.DARK_VIBRANT ||
        harmonizedColors.DESATURATED ||
        "#babbf1";
      const accentColor =
        harmonizedColors.VIBRANT_NON_ALARMING ||
        harmonizedColors.LIGHT_VIBRANT ||
        "#8caaee";

      // CRITICAL: Validate colors for search context
      const searchValidation = harmonyEngine.validateColorHarmony(
        primaryColor,
        "search"
      );
      const finalPrimary = searchValidation.valid
        ? primaryColor
        : searchValidation.recommendations.length > 0
        ? harmonyEngine.catppuccinPalettes[harmonyEngine.currentTheme].accents
            .mauve
        : primaryColor;

      // Convert to RGB and apply
      const primaryRgb = Year3000Utilities.hexToRgb(finalPrimary);
      const secondaryRgb = Year3000Utilities.hexToRgb(secondaryColor);
      const accentRgb = Year3000Utilities.hexToRgb(accentColor);

      // Apply hex versions for gradient colors
      root.style.setProperty("--sn-gradient-primary", finalPrimary);
      root.style.setProperty("--sn-gradient-secondary", secondaryColor);
      root.style.setProperty("--sn-gradient-accent", accentColor);

      // Apply RGB versions for gradients with enhanced safety
      if (primaryRgb) {
        root.style.setProperty(
          "--sn-gradient-primary-rgb",
          `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
        );
        root.style.setProperty(
          "--spice-rgb-accent",
          `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
        );
        root.style.setProperty(
          "--spice-rgb-button",
          `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
        );
      }
      if (secondaryRgb) {
        root.style.setProperty(
          "--sn-gradient-secondary-rgb",
          `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`
        );
      }
      if (accentRgb) {
        root.style.setProperty(
          "--sn-gradient-accent-rgb",
          `${accentRgb.r},${accentRgb.g},${accentRgb.b}`
        );
      }

      // Enhanced search-specific variables for guaranteed visibility
      root.style.setProperty(
        "--sn-search-contrast-boost",
        searchValidation.contrastRatio < 3.5 ? "1.3" : "1.0"
      );
      root.style.setProperty(
        "--sn-search-fallback-primary",
        harmonyEngine.catppuccinPalettes[harmonyEngine.currentTheme].accents
          .mauve
      );

      // Set RGB variables for existing spice compatibility
      year3000System.setSpiceRgbVariables(root);

      // Apply gradient parameters
      year3000System.setGradientParameters(root);

      console.log("🎨 Applied harmonized colors with Catppuccin blending:", {
        primary: finalPrimary,
        secondary: secondaryColor,
        accent: accentColor,
        harmonyValidation: searchValidation,
        theme: harmonyEngine.currentTheme,
      });
    },

    // Enhanced fallback system with Catppuccin harmony
    applyFallbackColors: () => {
      const root = document.documentElement;
      const harmonyEngine = year3000System.colorExtractor.harmonyEngine;
      const palette =
        harmonyEngine.catppuccinPalettes[harmonyEngine.currentTheme];

      // Use Catppuccin accent colors as intelligent fallbacks
      const fallbackColors = {
        primary: palette.accents.mauve,
        secondary: palette.accents.lavender,
        accent: palette.accents.blue,
      };

      Object.entries(fallbackColors).forEach(([role, color]) => {
        const rgb = Year3000Utilities.hexToRgb(color);
        root.style.setProperty(`--sn-gradient-${role}`, color);
        if (rgb) {
          root.style.setProperty(
            `--sn-gradient-${role}-rgb`,
            `${rgb.r},${rgb.g},${rgb.b}`
          );
        }
      });

      year3000System.setSpiceRgbVariables(root);
      year3000System.setGradientParameters(root);

      console.log(
        "🎨 Applied Catppuccin fallback colors for theme:",
        harmonyEngine.currentTheme
      );
    },

    // Helper methods
    setSpiceRgbVariables: (root) => {
      const getColorVal = (varName) =>
        getComputedStyle(root).getPropertyValue(varName).trim();

      const mainHex = getColorVal("--spice-main");
      const playerHex = getColorVal("--spice-player");
      const sidebarHex = getColorVal("--spice-sidebar");
      const cardHex = getColorVal("--spice-card");
      // Standard Catppuccin variables for surfaces, assuming they are set in the base theme's color.ini
      // and made available as CSS custom properties by Spicetify.
      const surface0Hex = getColorVal("--surface0");
      const surface1Hex = getColorVal("--surface1");
      // Consider --spice-text for --spice-rgb-text if required by color.ini and SCSS.
      const textHex = getColorVal("--spice-text"); // Added line

      const mainRgb = Year3000Utilities.hexToRgb("#" + mainHex);
      const playerRgb = Year3000Utilities.hexToRgb("#" + playerHex);
      const sidebarRgb = Year3000Utilities.hexToRgb("#" + sidebarHex);
      const cardRgb = Year3000Utilities.hexToRgb("#" + cardHex);
      const surface0Rgb = Year3000Utilities.hexToRgb("#" + surface0Hex);
      const surface1Rgb = Year3000Utilities.hexToRgb("#" + surface1Hex);
      const textRgb = Year3000Utilities.hexToRgb("#" + textHex); // Added line

      if (mainRgb) {
        root.style.setProperty(
          "--spice-rgb-main",
          `${mainRgb.r},${mainRgb.g},${mainRgb.b}`
        );
        // Base color is often derived from main background
        root.style.setProperty(
          "--spice-rgb-base",
          `${mainRgb.r},${mainRgb.g},${mainRgb.b}`
        );
      }
      if (playerRgb) {
        root.style.setProperty(
          "--spice-rgb-player",
          `${playerRgb.r},${playerRgb.g},${playerRgb.b}`
        );
      }
      if (sidebarRgb) {
        root.style.setProperty(
          "--spice-rgb-sidebar",
          `${sidebarRgb.r},${sidebarRgb.g},${sidebarRgb.b}`
        );
      }
      if (cardRgb) {
        // This was in the previous setSpiceRgbVariables, kept for consistency
        root.style.setProperty(
          "--spice-rgb-card",
          `${cardRgb.r},${cardRgb.g},${cardRgb.b}`
        );
      }
      if (surface0Rgb) {
        root.style.setProperty(
          "--spice-rgb-surface0",
          `${surface0Rgb.r},${surface0Rgb.g},${surface0Rgb.b}`
        );
      }
      if (surface1Rgb) {
        root.style.setProperty(
          "--spice-rgb-surface1",
          `${surface1Rgb.r},${surface1Rgb.g},${surface1Rgb.b}`
        );
      }
      if (textRgb) {
        // Added block
        root.style.setProperty(
          "--spice-rgb-text",
          `${textRgb.r},${textRgb.g},${textRgb.b}`
        );
      }
    },

    setGradientParameters: (root) => {
      // 🎨 DYNAMIC ARTISTIC PARAMETERS - Responsive to User's Bold Vision
      const multipliers = YEAR3000_CONFIG.getCurrentMultipliers();
      let effectiveOpacity = multipliers.opacity; // Start with base artistic opacity
      const artisticMode = YEAR3000_CONFIG.artisticMode; // Get current mode

      // Log current state before music sync modifications
      console.log(
        `StarryNight: setGradientParameters - Initial artistic mode: ${artisticMode}, Base opacity for mode: ${effectiveOpacity}`
      );
      console.log(
        `StarryNight: setGradientParameters - CosmicSync enabled: ${YEAR3000_CONFIG.enableCosmicSync}, value of window.currentMusicAnalysis:`,
        window.currentMusicAnalysis
      );

      if (
        YEAR3000_CONFIG.enableCosmicSync &&
        window.currentMusicAnalysis &&
        typeof window.currentMusicAnalysis.energy !== "undefined" &&
        typeof window.currentMusicAnalysis.valence !== "undefined"
      ) {
        const musicContext = window.currentMusicAnalysis;
        let musicMultiplier = 1.0; // Default if calculation path fails

        try {
          if (
            year3000System.colorExtractor?.harmonyEngine?.vibrancyConfig
              ?.getMusicIntensityMultiplier
          ) {
            musicMultiplier =
              year3000System.colorExtractor.harmonyEngine.vibrancyConfig.getMusicIntensityMultiplier(
                musicContext.energy || 0.5,
                musicContext.valence || 0.5
              );
          } else {
            console.warn(
              "StarryNight: vibrancyConfig.getMusicIntensityMultiplier not available. Using fallback music multiplier logic."
            );
            // Fallback simplified logic (example)
            const baseBoost = multipliers.musicEnergyBoost || 1.0; // Ensure fallback
            musicMultiplier =
              baseBoost * (1 + (musicContext.energy - 0.5) * 0.5);
            musicMultiplier = Math.max(0.5, Math.min(2.0, musicMultiplier)); // Clamp
          }

          effectiveOpacity *= musicMultiplier;
          effectiveOpacity = Math.max(0.02, Math.min(0.8, effectiveOpacity)); // Ensure opacity is within reasonable bounds

          console.log(
            `StarryNight: setGradientParameters - Music sync ACTIVE. Energy: ${musicContext.energy.toFixed(
              2
            )}, Valence: ${musicContext.valence.toFixed(
              2
            )}, Calculated MusicMultiplier: ${musicMultiplier.toFixed(
              2
            )}, Final EffectiveOpacity: ${effectiveOpacity.toFixed(2)}`
          );
        } catch (e) {
          console.error(
            "StarryNight: Error calculating music intensity multiplier:",
            e
          );
          // Keep base effectiveOpacity if error in music sync
          console.log(
            `StarryNight: setGradientParameters - Music sync error. Using base opacity: ${effectiveOpacity.toFixed(
              2
            )}`
          );
        }
      } else {
        console.log(
          `StarryNight: setGradientParameters - Music sync NOT active or no data. Using base opacity: ${effectiveOpacity.toFixed(
            2
          )}`
        );
      }

      root.style.setProperty(
        "--sn-gradient-opacity",
        effectiveOpacity.toString()
      );
      root.style.setProperty(
        "--sn-gradient-saturation",
        multipliers.saturation.toString()
      );
      root.style.setProperty(
        "--sn-gradient-brightness",
        multipliers.brightness.toString()
      );
      root.style.setProperty(
        "--sn-gradient-contrast",
        multipliers.contrast.toString()
      );

      // 🌟 Enhanced blur and transition for artistic presence
      const blurIntensity =
        artisticMode === "cosmic-maximum"
          ? "40px"
          : artisticMode === "artist-vision"
          ? "35px"
          : "30px";

      root.style.setProperty("--sn-gradient-blur", blurIntensity);
      root.style.setProperty(
        "--sn-gradient-transition",
        "2400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      );

      // 🎵 Music-responsive visual parameters (if music analysis available)
      if (YEAR3000_CONFIG.enableCosmicSync && window.currentMusicAnalysis) {
        // This part seems redundant if effectiveOpacity already considers musicMultiplier
        // However, these variables might be used by other SCSS directly.
        root.style.setProperty(
          "--sn-music-energy",
          window.currentMusicAnalysis.energy || "0.5"
        );
        root.style.setProperty(
          "--sn-music-valence",
          window.currentMusicAnalysis.valence || "0.5"
        );
      }

      console.log(
        `🎨 Applied ${artisticMode.toUpperCase()} gradient parameters:`,
        {
          opacity: effectiveOpacity, // Log the final effective opacity
          saturation: multipliers.saturation,
          brightness: multipliers.brightness,
          contrast: multipliers.contrast,
          blur: blurIntensity,
        }
      );
    },

    // Apply colors with proper RGB variable support for gradients
    applyColorsToTheme: (colors) => {
      const root = document.documentElement;

      const primaryColorHex =
        colors.VIBRANT ||
        colors.PROMINENT ||
        YEAR3000_CONFIG.catppuccinDefaults?.mauve ||
        "#ca9ee6";
      const secondaryColorHex =
        colors.DARK_VIBRANT ||
        colors.DESATURATED ||
        YEAR3000_CONFIG.catppuccinDefaults?.lavender ||
        "#babbf1";
      const accentColorHex =
        colors.VIBRANT_NON_ALARMING ||
        colors.LIGHT_VIBRANT ||
        YEAR3000_CONFIG.catppuccinDefaults?.blue ||
        "#8caaee";

      const primaryRgbSource = Year3000Utilities.hexToRgb(primaryColorHex);
      const secondaryRgbSource = Year3000Utilities.hexToRgb(secondaryColorHex);
      const accentRgbSource = Year3000Utilities.hexToRgb(accentColorHex);

      const defaultRgb = { r: 0, g: 0, b: 0 };

      const primaryOklab = Year3000Utilities.rgbToOklab(
        primaryRgbSource?.r ?? defaultRgb.r,
        primaryRgbSource?.g ?? defaultRgb.g,
        primaryRgbSource?.b ?? defaultRgb.b
      );
      const secondaryOklab = Year3000Utilities.rgbToOklab(
        secondaryRgbSource?.r ?? defaultRgb.r,
        secondaryRgbSource?.g ?? defaultRgb.g,
        secondaryRgbSource?.b ?? defaultRgb.b
      );
      const accentOklab = Year3000Utilities.rgbToOklab(
        accentRgbSource?.r ?? defaultRgb.r,
        accentRgbSource?.g ?? defaultRgb.g,
        accentRgbSource?.b ?? defaultRgb.b
      );

      // PHASE 2.2 - Integrate processOklabColor into applyColorsToTheme.
      // Fetch current music analysis context (if available).
      // Pass this context to Year3000Utilities.processOklabColor for each color.
      let musicContext = {}; // Default empty context
      if (
        YEAR3000_CONFIG.enableMusicAnalysis &&
        typeof window.currentMusicAnalysis !== "undefined"
      ) {
        musicContext = {
          musicEnergy: window.currentMusicAnalysis.processedEnergy,
          moodIdentifier: window.currentMusicAnalysis.moodIdentifier,
          visualIntensity: window.currentMusicAnalysis.visualIntensity,
          // Add other relevant fields from currentMusicAnalysis as needed by processOklabColor
        };
      }

      // PHASE 2.2.1 - Process each OKLab color using the new utility.
      const processedPrimaryOklab = Year3000Utilities.processOklabColor(
        primaryOklab,
        musicContext
      );
      const processedSecondaryOklab = Year3000Utilities.processOklabColor(
        secondaryOklab,
        musicContext
      );
      const processedAccentOklab = Year3000Utilities.processOklabColor(
        accentOklab,
        musicContext
      );

      const finalPrimaryRgb = Year3000Utilities.oklabToRgb(
        processedPrimaryOklab.L,
        processedPrimaryOklab.a,
        processedPrimaryOklab.b
      );
      const finalSecondaryRgb = Year3000Utilities.oklabToRgb(
        processedSecondaryOklab.L,
        processedSecondaryOklab.a,
        processedSecondaryOklab.b
      );
      const finalAccentRgb = Year3000Utilities.oklabToRgb(
        processedAccentOklab.L,
        processedAccentOklab.a,
        processedAccentOklab.b
      );

      // ... rest of applyColorsToTheme (setting CSS variables using final___Rgb objects) remains the same ...
      // PHASE 2.3 - Verification & Debugging.
      // After implementation, verify:
      // 1. Colors still change with album art.
      // 2. No obvious visual regressions or errors in console.
      // 3. (Optional) Add console logs inside processOklabColor to see input/output values during song changes.
      // 4. (Optional) Create a debug function in Year3000Debug to test processOklabColor with various inputs.

      // PHASE 4: Calculate and set derived OKLab properties and processed RGB as CSS variables
      const primaryOklabDerived =
        Year3000Utilities.calculateOklabDerivedProperties(
          processedPrimaryOklab
        );
      const secondaryOklabDerived =
        Year3000Utilities.calculateOklabDerivedProperties(
          processedSecondaryOklab
        );
      const accentOklabDerived =
        Year3000Utilities.calculateOklabDerivedProperties(processedAccentOklab);

      // Set L*, a*, b*, Chroma, Hue for Primary
      root.style.setProperty(
        "--sn-oklab-primary-l",
        primaryOklabDerived.L_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-primary-a",
        primaryOklabDerived.a_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-primary-b",
        primaryOklabDerived.b_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-primary-chroma",
        primaryOklabDerived.chroma.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-primary-hue",
        primaryOklabDerived.hue.toFixed(2)
      );

      // Set OKLab-processed RGB for Primary
      root.style.setProperty(
        "--sn-oklab-processed-primary-rgb-r",
        finalPrimaryRgb.r.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-primary-rgb-g",
        finalPrimaryRgb.g.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-primary-rgb-b",
        finalPrimaryRgb.b.toString()
      );

      // Set L*, a*, b*, Chroma, Hue for Secondary
      root.style.setProperty(
        "--sn-oklab-secondary-l",
        secondaryOklabDerived.L_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-secondary-a",
        secondaryOklabDerived.a_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-secondary-b",
        secondaryOklabDerived.b_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-secondary-chroma",
        secondaryOklabDerived.chroma.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-secondary-hue",
        secondaryOklabDerived.hue.toFixed(2)
      );

      // Set OKLab-processed RGB for Secondary
      root.style.setProperty(
        "--sn-oklab-processed-secondary-rgb-r",
        finalSecondaryRgb.r.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-secondary-rgb-g",
        finalSecondaryRgb.g.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-secondary-rgb-b",
        finalSecondaryRgb.b.toString()
      );

      // Set L*, a*, b*, Chroma, Hue for Accent
      root.style.setProperty(
        "--sn-oklab-accent-l",
        accentOklabDerived.L_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-accent-a",
        accentOklabDerived.a_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-accent-b",
        accentOklabDerived.b_star.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-accent-chroma",
        accentOklabDerived.chroma.toFixed(4)
      );
      root.style.setProperty(
        "--sn-oklab-accent-hue",
        accentOklabDerived.hue.toFixed(2)
      );

      // Set OKLab-processed RGB for Accent
      root.style.setProperty(
        "--sn-oklab-processed-accent-rgb-r",
        finalAccentRgb.r.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-accent-rgb-g",
        finalAccentRgb.g.toString()
      );
      root.style.setProperty(
        "--sn-oklab-processed-accent-rgb-b",
        finalAccentRgb.b.toString()
      );

      // The existing CSS variable setting logic follows, no changes needed there for this phase.
      const setCssRgb = (varName, rgbObj, fallbackRgbStr = "0,0,0") => {
        if (rgbObj && typeof rgbObj.r === "number") {
          root.style.setProperty(
            varName,
            `${rgbObj.r},${rgbObj.g},${rgbObj.b}`
          );
        } else {
          root.style.setProperty(varName, fallbackRgbStr);
        }
      };

      root.style.setProperty(
        "--sn-gradient-primary",
        Year3000Utilities.rgbToHex(
          finalPrimaryRgb.r,
          finalPrimaryRgb.g,
          finalPrimaryRgb.b
        )
      );
      root.style.setProperty(
        "--sn-gradient-secondary",
        Year3000Utilities.rgbToHex(
          finalSecondaryRgb.r,
          finalSecondaryRgb.g,
          finalSecondaryRgb.b
        )
      );
      root.style.setProperty(
        "--sn-gradient-accent",
        Year3000Utilities.rgbToHex(
          finalAccentRgb.r,
          finalAccentRgb.g,
          finalAccentRgb.b
        )
      );

      setCssRgb("--sn-gradient-primary-rgb", finalPrimaryRgb, "202,158,230");
      setCssRgb(
        "--sn-gradient-secondary-rgb",
        finalSecondaryRgb,
        "186,187,241"
      );
      setCssRgb("--sn-gradient-accent-rgb", finalAccentRgb, "140,170,238");

      if (year3000System.enhancedGradients?.applyCosmicHeaderGradients) {
        year3000System.enhancedGradients.applyCosmicHeaderGradients(
          finalPrimaryRgb,
          finalSecondaryRgb,
          finalAccentRgb
        );
      }

      setCssRgb("--spice-rgb-button", finalPrimaryRgb, "202,158,230");
      setCssRgb("--spice-rgb-accent", finalAccentRgb, "140,170,238");

      const getAndSetBaseRgb = (
        spiceVarName,
        spiceRgbVarName,
        fallbackHex = "#000000"
      ) => {
        let hexColor = getComputedStyle(root)
          .getPropertyValue(spiceVarName)
          .trim();
        const rgb = Year3000Utilities.hexToRgb(hexColor || fallbackHex);
        const safeRgb = rgb || { r: 0, g: 0, b: 0 };
        setCssRgb(
          spiceRgbVarName,
          safeRgb,
          Year3000Utilities.hexToRgb(fallbackHex)
            ? `${Year3000Utilities.hexToRgb(fallbackHex).r},${
                Year3000Utilities.hexToRgb(fallbackHex).g
              },${Year3000Utilities.hexToRgb(fallbackHex).b}`
            : "0,0,0"
        );
      };

      getAndSetBaseRgb(
        "--spice-main",
        "--spice-rgb-main",
        YEAR3000_CONFIG.catppuccinDefaults?.base || "#1e1e2e"
      );
      getAndSetBaseRgb(
        "--spice-base",
        "--spice-rgb-base",
        YEAR3000_CONFIG.catppuccinDefaults?.base || "#1e1e2e"
      );
      getAndSetBaseRgb(
        "--spice-player",
        "--spice-rgb-player",
        YEAR3000_CONFIG.catppuccinDefaults?.surface0 || "#313244"
      );
      getAndSetBaseRgb(
        "--spice-sidebar",
        "--spice-rgb-sidebar",
        YEAR3000_CONFIG.catppuccinDefaults?.surface0 || "#313244"
      );
      getAndSetBaseRgb(
        "--spice-card",
        "--spice-rgb-card",
        YEAR3000_CONFIG.catppuccinDefaults?.surface1 || "#45475a"
      );
      getAndSetBaseRgb(
        "--surface0",
        "--spice-rgb-surface0",
        YEAR3000_CONFIG.catppuccinDefaults?.surface0 || "#313244"
      );
      getAndSetBaseRgb(
        "--surface1",
        "--spice-rgb-surface1",
        YEAR3000_CONFIG.catppuccinDefaults?.surface1 || "#45475a"
      );
      getAndSetBaseRgb(
        "--spice-text",
        "--spice-rgb-text",
        YEAR3000_CONFIG.catppuccinDefaults?.text || "#cdd6f4"
      );

      root.style.setProperty(
        "--spice-button",
        Year3000Utilities.rgbToHex(
          finalPrimaryRgb.r,
          finalPrimaryRgb.g,
          finalPrimaryRgb.b
        )
      );
      root.style.setProperty(
        "--spice-button-active",
        Year3000Utilities.rgbToHex(
          finalAccentRgb.r,
          finalAccentRgb.g,
          finalAccentRgb.b
        )
      );
      root.style.setProperty(
        "--spice-highlight",
        Year3000Utilities.rgbToHex(
          finalSecondaryRgb.r,
          finalSecondaryRgb.g,
          finalSecondaryRgb.b
        )
      );

      year3000System.setGradientParameters(root);

      if (window.sidebarConsciousnessSystem?.updateAccentColors) {
        window.sidebarConsciousnessSystem.updateAccentColors(
          finalPrimaryRgb,
          finalSecondaryRgb,
          finalAccentRgb
        );
      }
      // console.log("🎨 Applied colors via OKLab round-trip with Phase 2 processing.");
      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.02) {
        // Very sparse logging
        console.log(
          "🎨 [Phase 4] OKLab derived CSS vars set. Primary L*:",
          primaryOklabDerived.L_star.toFixed(3)
        );
      }

      // PHASE 1 (AUDIT): Calculate and set --sn-oklab-processed-bright-highlight-rgb
      // Based on the processed Accent color for a subtle thematic link
      const brightHighlightOklab = {
        L: 0.97, // Very light
        a: processedAccentOklab.a * 0.05, // Very low chroma
        b: processedAccentOklab.b * 0.05, // Very low chroma
      };
      const brightHighlightRgb = Year3000Utilities.oklabToRgb(
        brightHighlightOklab.L,
        brightHighlightOklab.a,
        brightHighlightOklab.b
      );
      if (brightHighlightRgb) {
        root.style.setProperty(
          "--sn-oklab-processed-bright-highlight-rgb",
          `${brightHighlightRgb.r},${brightHighlightRgb.g},${brightHighlightRgb.b}`
        );
      }

      // PHASE 1 (AUDIT): Calculate and set --sn-oklab-processed-dynamic-shadow-rgb
      // Based on the main background color for thematic harmony
      const mainBgHexForShadow = getComputedStyle(root)
        .getPropertyValue("--spice-main")
        .trim();
      const mainBgRgbForShadow = Year3000Utilities.hexToRgb(
        "#" + mainBgHexForShadow
      );
      if (mainBgRgbForShadow) {
        const mainBgOklabForShadow = Year3000Utilities.rgbToOklab(
          mainBgRgbForShadow.r,
          mainBgRgbForShadow.g,
          mainBgRgbForShadow.b
        );
        const dynamicShadowOklab = {
          L: Math.max(0.05, mainBgOklabForShadow.L * 0.3), // Significantly darker
          a: mainBgOklabForShadow.a * 0.4, // Reduced chroma, retains some tint
          b: mainBgOklabForShadow.b * 0.4, // Reduced chroma, retains some tint
        };
        const dynamicShadowRgb = Year3000Utilities.oklabToRgb(
          dynamicShadowOklab.L,
          dynamicShadowOklab.a,
          dynamicShadowOklab.b
        );
        if (dynamicShadowRgb) {
          root.style.setProperty(
            "--sn-oklab-processed-dynamic-shadow-rgb",
            `${dynamicShadowRgb.r},${dynamicShadowRgb.g},${dynamicShadowRgb.b}`
          );
        }
      }
    },

    resetToDefaults: () => {
      const root = document.documentElement;

      // Remove gradient hex variables
      root.style.removeProperty("--sn-gradient-primary");
      root.style.removeProperty("--sn-gradient-secondary");
      root.style.removeProperty("--sn-gradient-accent");

      // Remove gradient RGB variables
      root.style.removeProperty("--sn-gradient-primary-rgb");
      root.style.removeProperty("--sn-gradient-secondary-rgb");
      root.style.removeProperty("--sn-gradient-accent-rgb");

      // Remove spice RGB overrides (let theme defaults take over)
      root.style.removeProperty("--spice-rgb-accent");
      root.style.removeProperty("--spice-rgb-main");
      root.style.removeProperty("--spice-rgb-base");
      root.style.removeProperty("--spice-rgb-player");
      root.style.removeProperty("--spice-rgb-sidebar");
      root.style.removeProperty("--spice-rgb-card");
      root.style.removeProperty("--spice-rgb-surface0");
      root.style.removeProperty("--spice-rgb-surface1");
      root.style.removeProperty("--spice-rgb-button");
      root.style.removeProperty("--spice-rgb-text"); // Added line

      // Remove gradient parameters (let SCSS defaults take over)
      root.style.removeProperty("--sn-gradient-opacity");
      root.style.removeProperty("--sn-gradient-saturation");
      root.style.removeProperty("--sn-gradient-brightness");
      root.style.removeProperty("--sn-gradient-contrast");
      root.style.removeProperty("--sn-gradient-blur");
      root.style.removeProperty("--sn-gradient-transition");

      // PHASE 4: Remove OKLab specific CSS variables on reset
      const oklabPrefixes = [
        "--sn-oklab-primary-",
        "--sn-oklab-secondary-",
        "--sn-oklab-accent-",
        "--sn-oklab-processed-primary-",
        "--sn-oklab-processed-secondary-",
        "--sn-oklab-processed-accent-",
      ];
      const oklabSuffixes = [
        "l",
        "a",
        "b",
        "chroma",
        "hue",
        "rgb-r",
        "rgb-g",
        "rgb-b",
      ];
      oklabPrefixes.forEach((prefix) => {
        oklabSuffixes.forEach((suffix) => {
          if (suffix.startsWith("rgb-") && !prefix.includes("-processed-"))
            return; // only processed have rgb-r/g/b directly
          if (!suffix.startsWith("rgb-") && prefix.includes("-processed-"))
            return; // processed only has rgb-r/g/b, not l,a,b etc directly

          // Handle simple cases for l,a,b,chroma,hue
          if (
            ["l", "a", "b", "chroma", "hue"].includes(suffix) &&
            !prefix.includes("-processed-")
          ) {
            root.style.removeProperty(`${prefix}${suffix}`);
          }
          // Handle processed rgb cases
          if (suffix.startsWith("rgb-") && prefix.includes("-processed-")) {
            root.style.removeProperty(`${prefix}${suffix}`);
          }
        });
      });
      // Simpler way for the variables we definitely set:
      const varsToRemove = [
        "--sn-oklab-primary-l",
        "--sn-oklab-primary-a",
        "--sn-oklab-primary-b",
        "--sn-oklab-primary-chroma",
        "--sn-oklab-primary-hue",
        "--sn-oklab-processed-primary-rgb-r",
        "--sn-oklab-processed-primary-rgb-g",
        "--sn-oklab-processed-primary-rgb-b",
        "--sn-oklab-secondary-l",
        "--sn-oklab-secondary-a",
        "--sn-oklab-secondary-b",
        "--sn-oklab-secondary-chroma",
        "--sn-oklab-secondary-hue",
        "--sn-oklab-processed-secondary-rgb-r",
        "--sn-oklab-processed-secondary-rgb-g",
        "--sn-oklab-processed-secondary-rgb-b",
        "--sn-oklab-accent-l",
        "--sn-oklab-accent-a",
        "--sn-oklab-accent-b",
        "--sn-oklab-accent-chroma",
        "--sn-oklab-accent-hue",
        "--sn-oklab-processed-accent-rgb-r",
        "--sn-oklab-processed-accent-rgb-g",
        "--sn-oklab-processed-accent-rgb-b",
      ];
      varsToRemove.forEach((varName) => root.style.removeProperty(varName));

      // PHASE 1 (AUDIT): Remove newly added OKLab variables
      root.style.removeProperty("--sn-oklab-processed-bright-highlight-rgb");
      root.style.removeProperty("--sn-oklab-processed-dynamic-shadow-rgb");

      console.log("🧹 Reset all dynamic color variables to theme defaults");
    },

    getSystemReport: () => ({
      status: "Year 3000 Color Harmony System Active",
      currentColors: {
        primary: getComputedStyle(document.documentElement).getPropertyValue(
          "--sn-gradient-primary"
        ),
        secondary: getComputedStyle(document.documentElement).getPropertyValue(
          "--sn-gradient-secondary"
        ),
        accent: getComputedStyle(document.documentElement).getPropertyValue(
          "--sn-gradient-accent"
        ),
      },
    }),
  };

  // Initialize system and event listeners
  (function () {
    if (!Spicetify?.colorExtractor) {
      console.warn("Spicetify colorExtractor not available");
      return;
    }

    // Listen for song changes with harmony system
    Spicetify.Player.addEventListener("songchange", async () => {
      // Delay to allow Spicetify.Player.data to update
      setTimeout(async () => {
        await year3000System.updateColorsFromCurrentTrack(); // Existing color update, await it

        // New: Process and distribute music analysis
        const track =
          Spicetify.Player.data?.item || Spicetify.Player.state?.track;
        if (track?.uri) {
          let audioFeatures = null;
          if (Spicetify.Player.data?.item?.audio_features) {
            audioFeatures = Spicetify.Player.data.item.audio_features;
          } else if (year3000System.bmpSynchronizer?.harmonyEngine) {
            audioFeatures =
              await year3000System.bmpSynchronizer.harmonyEngine.getAudioFeatures();
          }

          let processedData = null;
          if (audioFeatures || (track.energy && track.valence)) {
            processedData =
              await year3000System.musicAnalysisService.processAudioFeatures(
                audioFeatures || track,
                track.uri,
                track.duration_ms
              );
          } else {
            console.warn(
              `[year3000System] Could not retrieve detailed audio features for ${track.uri}. Visuals might be less responsive.`
            );
            processedData =
              await year3000System.musicAnalysisService.processAudioFeatures(
                { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 120 }, // Default data
                track.uri,
                track.duration_ms
              );
          }

          // Ensure window.currentMusicAnalysis is set and then update gradient parameters
          if (processedData) {
            window.currentMusicAnalysis = processedData;
            year3000System.setGradientParameters(document.documentElement);
            console.log(
              "[StarryNight songchange] Updated window.currentMusicAnalysis and called setGradientParameters."
            );
          }
        }
      }, 100);
    });

    // Initial color extraction and music analysis
    setTimeout(async () => {
      await year3000System.updateColorsFromCurrentTrack(); // Existing, await it

      const track =
        Spicetify.Player.data?.item || Spicetify.Player.state?.track;
      if (track?.uri) {
        let audioFeatures = null;
        if (Spicetify.Player.data?.item?.audio_features) {
          audioFeatures = Spicetify.Player.data.item.audio_features;
        } else if (year3000System.bmpSynchronizer?.harmonyEngine) {
          audioFeatures =
            await year3000System.bmpSynchronizer.harmonyEngine.getAudioFeatures();
        }

        let processedData = null;
        if (audioFeatures || (track.energy && track.valence)) {
          processedData =
            await year3000System.musicAnalysisService.processAudioFeatures(
              audioFeatures || track,
              track.uri,
              track.duration_ms
            );
        } else {
          console.warn(
            `[year3000System] Initial audio features for ${track.uri} not found. Using defaults.`
          );
          processedData =
            await year3000System.musicAnalysisService.processAudioFeatures(
              { energy: 0.5, valence: 0.5, danceability: 0.5, tempo: 120 }, // Default data
              track.uri,
              track.duration_ms
            );
        }

        // Ensure window.currentMusicAnalysis is set and then update gradient parameters
        if (processedData) {
          window.currentMusicAnalysis = processedData;
          year3000System.setGradientParameters(document.documentElement);
          console.log(
            "[StarryNight initialLoad] Updated window.currentMusicAnalysis and called setGradientParameters."
          );
        }
      }
    }, 500);

    console.log(
      "🌟 Year 3000 Color Harmony System initialized with Catppuccin blending"
    );
  })();
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
  // SETTINGS MANAGEMENT - REMAINS LARGELY UNCHANGED
  // =============================================================================
  class SettingsManager {
    constructor() {
      this.settingsKey = "catppuccinStarryNightSettings"; // Potentially unused if individual keys are preferred

      this.defaults = {
        "catppuccin-accentColor": "mauve",
        "sn-gradientIntensity": "balanced",
        "sn-starDensity": "balanced",
        "sn-performanceQuality": "auto",
        "sn-glassmorphismIntensity": "moderate",
        "sn-3dMorphingMode": "dynamic",
        "sn-artisticMode": "artist-vision",
        // NEW: Harmonic Defaults
        "sn-currentHarmonicMode": "analogous-flow",
        "sn-harmonicIntensity": "0.7", // Stored as string, parsed to float later
        "sn-harmonicEvolution": "true", // Stored as string, parsed to boolean later
        "sn-harmonicManualBaseColor": "", // NEW: Empty string means auto/album art
      };

      this.validationSchemas = {
        "catppuccin-accentColor": {
          default: "mauve",
          allowedValues: [
            "rosewater",
            "flamingo",
            "pink",
            "mauve",
            "red",
            "maroon",
            "peach",
            "yellow",
            "green",
            "teal",
            "sky",
            "sapphire",
            "blue",
            "lavender",
            "text",
            "none",
          ],
        },
        "sn-gradientIntensity": {
          default: "balanced",
          allowedValues: ["disabled", "minimal", "balanced", "intense"],
        },
        "sn-starDensity": {
          default: "balanced",
          allowedValues: ["disabled", "minimal", "balanced", "intense"],
        },
        "sn-performanceQuality": {
          default: "auto",
          allowedValues: ["auto", "optimized", "high-fidelity"],
        },
        "sn-glassmorphismIntensity": {
          default: "moderate",
          allowedValues: ["disabled", "minimal", "moderate", "intense"],
        },
        "sn-3dMorphingMode": {
          default: "dynamic",
          allowedValues: [
            "disabled",
            "minimal",
            "balanced",
            "floating",
            "intense",
            "dynamic",
          ],
        },
        "sn-artisticMode": {
          default: "artist-vision",
          allowedValues: ["corporate-safe", "artist-vision", "cosmic-maximum"],
        },
        // NEW: Harmonic Validation Schemas
        "sn-currentHarmonicMode": {
          default: "analogous-flow",
          allowedValues: Object.keys(HARMONIC_MODES), // Dynamically get allowed modes
        },
        "sn-harmonicIntensity": {
          default: "0.7",
          // For sliders, we validate range/type upon retrieval/use.
        },
        "sn-harmonicEvolution": {
          default: "true",
          allowedValues: ["true", "false"],
        },
        // NEW: Manual Base Color Validation
        "sn-harmonicManualBaseColor": {
          default: "", // Empty string for auto
          // Validation will be primarily by regex on input, here we just define it exists
          // Allowed values could be a regex, but for simplicity, direct validation on set/get is better.
        },
      };

      Object.keys(this.defaults).forEach((key) => {
        if (this.validationSchemas[key]) {
          if (this.validationSchemas[key].default !== this.defaults[key]) {
            console.warn(
              `StarryNight: SettingsManager constructor: Default for '${key}' mismatch. Schema: '${this.validationSchemas[key].default}', Defaults: '${this.defaults[key]}'. Using schema default.`
            );
            this.defaults[key] = this.validationSchemas[key].default;
          }
        } else {
          console.warn(
            `StarryNight: SettingsManager constructor: No validationSchema for default setting '${key}'.`
          );
        }
      });

      this.settings = this.loadSettings(); // settings property might be unused if get/set directly use localStorage
      this.validateAndRepair();
    }

    loadSettings() {
      // This method seems less relevant if get/set directly use localStorage and validationSchemas.
      // However, it can be used to populate an in-memory `this.settings` object if desired.
      const loadedSettings = {};
      Object.keys(this.validationSchemas).forEach((key) => {
        loadedSettings[key] = this.get(key); // Populate from validated localStorage
      });
      return loadedSettings;
    }

    get(key) {
      try {
        const value = localStorage.getItem(key);
        const schema = this.validationSchemas[key];

        if (!schema) {
          console.warn(
            `StarryNight: No validation schema for key: ${key}. Returning raw value or null.`
          );
          return value; // Return raw value if no schema, or null if not found
        }

        if (
          value === null ||
          (schema.allowedValues && !schema.allowedValues.includes(value))
        ) {
          if (value !== null) {
            // Log only if there was an invalid value, not if it was missing
            console.warn(
              `StarryNight: Invalid or missing value '${value}' for ${key}, using default '${schema.default}'`
            );
          }
          return schema.default;
        }
        return value;
      } catch (error) {
        console.error(
          `StarryNight: Error reading localStorage key ${key}:`,
          error,
          `Using default '${this.validationSchemas[key]?.default}'.`
        );
        return this.validationSchemas[key]?.default || null;
      }
    }

    set(key, value) {
      try {
        const schema = this.validationSchemas[key];

        if (!schema) {
          console.warn(
            `StarryNight: No validation schema for key: ${key}. Setting raw value.`
          );
          localStorage.setItem(key, value);
          return true;
        }

        if (schema.allowedValues && !schema.allowedValues.includes(value)) {
          console.error(
            `StarryNight: Cannot set invalid value '${value}' for ${key}. Allowed: ${schema.allowedValues.join(
              ", "
            )}.`
          );
          return false;
        }

        localStorage.setItem(key, value);
        // console.log(`StarryNight: Settings updated - ${key}: ${value}`); // Optional: reduce logging
        return true;
      } catch (error) {
        console.error(
          `StarryNight: Error setting localStorage key ${key}:`,
          error
        );
        return false;
      }
    }

    getAllSettings() {
      const settings = {};
      Object.keys(this.validationSchemas).forEach((key) => {
        settings[key] = this.get(key);
      });
      return settings;
    }

    validateAndRepair() {
      let repairedCount = 0;
      Object.keys(this.validationSchemas).forEach((key) => {
        const currentValue = localStorage.getItem(key);
        const schema = this.validationSchemas[key];
        // Use this.get() to leverage its validation and default fallback logic
        const validatedValue = this.get(key);

        if (currentValue !== validatedValue) {
          // If currentValue was null (and default applied by get) or if it was invalid.
          this.set(key, validatedValue); // Set the validated (or default) value back to localStorage.
          if (currentValue !== null) {
            // Only count as repaired if there was an actual invalid value being corrected.
            console.log(
              `StarryNight: Repaired setting for '${key}'. Was '${currentValue}', set to '${validatedValue}'.`
            );
            repairedCount++;
          }
        }
      });

      if (repairedCount > 0) {
        console.log(
          `StarryNight: Repaired ${repairedCount} invalid settings in total.`
        );
      }
      return repairedCount;
    }
  }

  // =============================================================================
  // 3D CARD EFFECT SYSTEM - REMAINS LARGELY UNCHANGED
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

      // Use viewport dimensions since we're tracking document-level mouse events
      const rect = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

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

  // =============================================================================
  // QUANTUM MOUSE TRACKER - REMAINS LARGELY UNCHANGED
  // =============================================================================
  class QuantumMouseTracker {
    constructor(performanceMonitor) {
      this.performanceMonitor = performanceMonitor;
      this.isActive = false;
      this.mouseX = 0;
      this.mouseY = 0;
      this.lastUpdateTime = 0;
      this.updateThrottle = 16; // ~60fps
    }

    // Initialize quantum mouse tracking for search pages
    initialize() {
      this.setupSearchPageTracking();
      console.log("StarryNight: Quantum mouse tracking initialized");
    }

    // Setup mouse tracking specifically for search pages
    setupSearchPageTracking() {
      const throttledMouseMove = this.throttle((event) => {
        this.updateQuantumMousePosition(event);
      }, this.updateThrottle);

      // Track mouse movement on search containers
      document.addEventListener("mousemove", (event) => {
        const searchContainer = event.target.closest(
          ".main-searchPage-content"
        );
        if (searchContainer) {
          this.isActive = true;
          throttledMouseMove(event);
        } else {
          this.isActive = false;
          this.resetQuantumVariables();
        }
      });

      // Reset on mouse leave
      document.addEventListener("mouseleave", () => {
        this.isActive = false;
        this.resetQuantumVariables();
      });
    }

    // Update quantum mouse position for holographic effects
    updateQuantumMousePosition(event) {
      if (!this.isActive || this.performanceMonitor.shouldReduceQuality()) {
        return;
      }

      const now = performance.now();
      if (now - this.lastUpdateTime < this.updateThrottle) {
        return;
      }
      this.lastUpdateTime = now;

      // Get search container bounds
      const searchContainer = document.querySelector(
        ".main-searchPage-content"
      );
      if (!searchContainer) return;

      const rect = searchContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized position (-1 to 1)
      this.mouseX = (event.clientX - centerX) / (rect.width / 2);
      this.mouseY = (event.clientY - centerY) / (rect.height / 2);

      // Clamp values
      this.mouseX = Math.max(-1, Math.min(1, this.mouseX));
      this.mouseY = Math.max(-1, Math.min(1, this.mouseY));

      // Update CSS variables for quantum effects
      this.updateQuantumVariables();
    }

    // Update CSS custom properties for quantum holographic effects
    updateQuantumVariables() {
      const root = document.documentElement;
      root.style.setProperty("--mouse-x", this.mouseX.toString());
      root.style.setProperty("--mouse-y", this.mouseY.toString());
      root.style.setProperty("--quantum-active", this.isActive ? "1" : "0");
    }

    // Reset quantum variables
    resetQuantumVariables() {
      this.mouseX = 0;
      this.mouseY = 0;
      this.updateQuantumVariables();
    }

    // Utility: Throttle function
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
  }

  // Instantiate managers (ColorAnalyzer is removed)
  const performanceMonitor = new PerformanceMonitor();
  const settingsManager = new SettingsManager();
  const glassmorphismManager = new GlassmorphismManager(
    performanceMonitor,
    settingsManager
  );
  const card3DManager = new Card3DManager(performanceMonitor, settingsManager);
  const quantumMouseTracker = new QuantumMouseTracker(performanceMonitor);

  // Define option arrays for the settings UI, derived from validationSchemas or sensible defaults
  const accents =
    settingsManager.validationSchemas["catppuccin-accentColor"].allowedValues;

  const gradientIntensityOptions = settingsManager.validationSchemas[
    "sn-gradientIntensity"
  ].allowedValues.map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1), // Simple title case
  }));

  const starDensityOptions = settingsManager.validationSchemas[
    "sn-starDensity"
  ].allowedValues.map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1),
  }));

  const performanceOptions = settingsManager.validationSchemas[
    "sn-performanceQuality"
  ].allowedValues.map((val) => ({
    value: val,
    // Custom labels for performance options for better readability
    label:
      val === "auto"
        ? "Auto-Adjust"
        : val === "optimized"
        ? "Optimized Quality"
        : "High Fidelity",
  }));

  const glassmorphismOptions = settingsManager.validationSchemas[
    "sn-glassmorphismIntensity"
  ].allowedValues.map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1),
  }));

  const artisticModeOptions = settingsManager.validationSchemas[
    "sn-artisticMode"
  ].allowedValues.map((val) => ({
    value: val,
    // Custom labels for artistic modes for better readability
    label: val
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  const morphing3DOptions = settingsManager.validationSchemas[
    "sn-3dMorphingMode"
  ].allowedValues.map((val) => ({
    value: val,
    label: val.charAt(0).toUpperCase() + val.slice(1),
  }));

  // =============================================================================
  // PHASE 2: BeatSyncVisualSystem Class Definition
  // =============================================================================
  class BeatSyncVisualSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "BeatSyncVisualSystem" }); // Pass config to BaseVisualSystem
      this.lastBeatTime = 0;
      this._animationFrameId = null; // Renamed from animationFrame to avoid confusion, and underscore for private
      this.lastFrameTime = performance.now(); // For deltaTime calculation

      // Smoothed pulse properties
      this.currentPulseIntensity = 0;
      this.targetPulseIntensity = 0;
      this.pulseHalfLifeAttack = 0.025; // Time in seconds for attack - reduced for faster response
      this.pulseHalfLifeDecay = 0.075; // Time in seconds for decay - reduced for faster response
      this.pulseResetThreshold = 0.005; // Threshold to reset targetPulseIntensity to 0

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Constructor called`);
      }
    }

    // Ensure initialize is called and sets isInitialized
    async initialize() {
      await super.initialize(); // Calls BaseVisualSystem's initialize
      this.lastFrameTime = performance.now(); // Reset lastFrameTime on init
      this._startAnimationLoop(); // Start the animation loop
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized via BaseVisualSystem and animation loop started.`
        );
      }
    }

    _startAnimationLoop() {
      if (this._animationFrameId) {
        this._cancelAnimationFrame(this._animationFrameId); // Use BaseVisualSystem's cancel
      }
      // Bind the _animationLoop to `this` context
      const loop = () => {
        this._animationLoop();
        if (this.isInitialized) {
          // Continue loop only if initialized
          this._animationFrameId = this._requestAnimationFrame(loop); // Use BaseVisualSystem's request
        }
      };
      this._animationFrameId = this._requestAnimationFrame(loop);
    }

    _stopAnimationLoop() {
      if (this._animationFrameId) {
        this._cancelAnimationFrame(this._animationFrameId); // Use BaseVisualSystem's cancel
        this._animationFrameId = null;
      }
    }

    _animationLoop() {
      if (!this.isInitialized) {
        this._stopAnimationLoop(); // Ensure loop stops if system is no longer initialized
        return;
      }

      const currentTime = performance.now();
      const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
      this.lastFrameTime = currentTime;

      const root = document.documentElement;

      // Determine which halfLife to use (attack or decay)
      const halfLife =
        this.targetPulseIntensity > this.currentPulseIntensity
          ? this.pulseHalfLifeAttack
          : this.pulseHalfLifeDecay;

      // Smooth the pulse intensity
      this.currentPulseIntensity = Year3000Utilities.lerpSmooth(
        this.currentPulseIntensity,
        this.targetPulseIntensity,
        deltaTime,
        halfLife
      );

      // If the pulse is decaying and very close to zero, and the target was positive,
      // snap current to 0 and reset targetPulseIntensity to 0 to ensure it fully stops.
      // This prevents it from lingering at a very small value or re-triggering if targetPulseIntensity was briefly non-zero.
      if (
        this.targetPulseIntensity > 0 &&
        this.currentPulseIntensity < this.pulseResetThreshold &&
        halfLife === this.pulseHalfLifeDecay
      ) {
        this.currentPulseIntensity = 0;
        this.targetPulseIntensity = 0; // Reset target to allow for new beats to set it
      } else if (
        this.targetPulseIntensity === 0 &&
        this.currentPulseIntensity < this.pulseResetThreshold
      ) {
        // If target is already 0 and current is small, ensure it's snapped to 0.
        this.currentPulseIntensity = 0;
      }

      // Apply the smoothed intensity to the CSS variable
      root.style.setProperty(
        "--sn-beat-pulse-intensity",
        this.currentPulseIntensity.toFixed(3)
      );
    }

    updateFromMusicAnalysis(processedMusicData /*, rawFeatures, trackUri */) {
      if (!this.isInitialized || !processedMusicData) {
        return;
      }

      const { processedEnergy, animationSpeedFactor, visualIntensity } =
        processedMusicData;
      const root = document.documentElement;
      const currentTime = performance.now(); // Use the more consistent performance.now()

      const timeSinceLastBeat = currentTime - this.lastBeatTime;
      const estimatedBPM = 120 * (animationSpeedFactor || 1); // Default to 120 if animationSpeedFactor is undefined
      const minBeatInterval = 60000 / (estimatedBPM * 1.5); // *1.5 makes it more lenient

      if (
        processedEnergy > 0.65 &&
        timeSinceLastBeat > Math.max(150, minBeatInterval) // Ensure a minimum reasonable interval
      ) {
        this.onBeatDetected(currentTime, processedEnergy, visualIntensity); // Pass currentTime
        this.lastBeatTime = currentTime;
      }

      // Continuous rhythm-based variables
      const rhythmPhase =
        (currentTime / 1000) * (animationSpeedFactor || 1) * Math.PI;
      const baseBreathing = 0.99; // Base scale for breathing
      const energyInfluence = 0.01 + processedEnergy * 0.02; // How much energy affects breathing amplitude
      const breathingIntensity =
        baseBreathing + Math.sin(rhythmPhase) * energyInfluence;

      root.style.setProperty(
        "--sn-rhythm-phase",
        (rhythmPhase % (Math.PI * 2)).toFixed(3)
      );
      root.style.setProperty(
        "--sn-breathing-scale",
        breathingIntensity.toFixed(3)
      );
    }

    onBeatDetected(currentTime, energy, visualIntensity) {
      // currentTime is now passed
      if (!this.isInitialized) return;

      this.targetPulseIntensity = visualIntensity; // Set the target for the lerp

      if (YEAR3000_CONFIG.enableDebug) {
        // console.log(`[${this.systemName}] Beat detected! Target Intensity: ${visualIntensity.toFixed(3)}, Current Smoothed: ${this.currentPulseIntensity.toFixed(3)}`); // Reduce logging noise
      }
    }

    destroy() {
      this._stopAnimationLoop(); // Stop the animation loop
      // Reset CSS variable on destroy to ensure it doesn't stick
      const root = document.documentElement;
      root.style.setProperty("--sn-beat-pulse-intensity", "0");
      root.style.setProperty("--sn-rhythm-phase", "0");
      root.style.setProperty("--sn-breathing-scale", "1");
      super.destroy(); // Call base class destroy, which handles unsubscribe
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Destroyed and animation loop stopped.`
        );
      }
    }
  }
  // END OF PHASE 2: BeatSyncVisualSystem Class Definition
  // =============================================================================

  // =============================================================================
  // PHASE 4: LightweightParticleSystem Class Definition
  // =============================================================================
  class LightweightParticleSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "LightweightParticleSystem" });
      this.canvas = null;
      this.ctx = null;
      this.particlePool = []; // Pool of reusable particle objects
      this.maxParticles =
        YEAR3000_CONFIG.performanceProfiles?.balanced?.maxParticles || 75; // Increased default
      this.animationId = null;
      this.lastSpawnTime = 0;
      this.spawnCooldown = 80; // ms between spawns, slightly reduced
      this.lastFrameTime = performance.now(); // For deltaTime calculation in render loop
      this.particleHalfLife = 0.08; // Time in seconds for particle property smoothing

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Constructor called. Max particles: ${this.maxParticles}`
        );
      }
    }

    async initialize() {
      await super.initialize();
      this.createCanvas();
      this.initializeParticlePool();
      this.lastFrameTime = performance.now(); // Reset lastFrameTime before starting loop
      this.startRenderLoop();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and render loop started.`
        );
      }
    }

    createCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.id = "sn-particle-canvas";
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 3; // ELEVATED from -1
        opacity: ${
          YEAR3000_CONFIG.artisticMultipliers?.opacity * 0.65 || 0.25 // INCREASED VISIBILITY
        };
        mix-blend-mode: screen; // screen or additive often look good for particles
      `;
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
      if (this.canvas) {
        // Check if canvas exists before accessing properties
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    }

    initializeParticlePool() {
      this.particlePool = []; // Clear pool if re-initializing
      for (let i = 0; i < this.maxParticles * 2; i++) {
        this.particlePool.push({
          active: false,
          // Core physics properties (target values for lerp or direct use)
          targetX: 0,
          targetY: 0,
          vx: 0, // Velocity in x
          vy: 0, // Velocity in y
          targetRotation: 0,
          vr: 0, // Rotational velocity

          // Smoothed current state properties
          currentX: 0,
          currentY: 0,
          currentSize: 0,
          currentOpacity: 0,
          currentRotation: 0,

          // Target visual properties (driven by lifetime, music etc.)
          targetSize: 1,
          targetOpacity: 0,

          // Base properties set at spawn
          baseSize: 1,
          baseOpacity: 0.5,
          life: 0,
          maxLife: 1000,
          color: "rgba(255,255,255,0.5)",
        });
      }
    }

    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      const currentTime = performance.now();
      const {
        processedEnergy,
        visualIntensity,
        animationSpeedFactor,
        moodIdentifier,
      } = processedMusicData;

      const dynamicSpawnCooldown = Math.max(
        50,
        this.spawnCooldown / (animationSpeedFactor || 1)
      );

      if (
        processedEnergy > 0.45 && // Lowered threshold
        visualIntensity > 0.3 && // Lowered threshold
        currentTime - this.lastSpawnTime > dynamicSpawnCooldown
      ) {
        const numToSpawn = Math.max(
          1,
          Math.floor(visualIntensity * 5 + processedEnergy * 3)
        ); // More responsive spawn count
        for (let i = 0; i < numToSpawn; i++) {
          if (
            this.particlePool.filter((p) => p.active).length < this.maxParticles
          ) {
            this.spawnParticle(
              processedEnergy,
              visualIntensity,
              animationSpeedFactor,
              moodIdentifier
            );
          } else {
            if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
              // Log sparsely
              // console.log(`[${this.systemName}] Max particles reached, skipping spawn.`);
            }
            break;
          }
        }
        this.lastSpawnTime = currentTime;
      }
    }

    spawnParticle(energy, intensity, speedFactor, mood) {
      const particle = this.particlePool.find((p) => !p.active);
      if (!particle) return;

      const rootStyle = getComputedStyle(document.documentElement);
      const primaryRgbStr =
        rootStyle.getPropertyValue("--sn-gradient-primary-rgb").trim() ||
        "202,158,230";
      const accentRgbStr =
        rootStyle.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
        "140,170,238";

      particle.active = true;

      // Initial position (current and target are the same at spawn)
      particle.currentX = Math.random() * this.canvas.width;
      particle.currentY = this.canvas.height + Math.random() * 30 + 20; // Start further below
      particle.targetX = particle.currentX;
      particle.targetY = particle.currentY;

      particle.vx = (Math.random() - 0.5) * 3 * (speedFactor || 1); // Increased base velocity
      particle.vy =
        -(1.5 + Math.random() * 2.5 + energy * 3) * (speedFactor || 1); // Stronger upward velocity

      particle.maxLife = 2500 + Math.random() * 3500 * intensity;
      particle.life = particle.maxLife;

      particle.baseSize = 1.5 + Math.random() * 2.5 + intensity * 2.5; // Slightly larger base
      particle.currentSize = 0; // Start small, grow in
      particle.targetSize = particle.baseSize;

      particle.baseOpacity = 0.4 + Math.random() * 0.5; // Higher base opacity
      particle.currentOpacity = 0; // Start transparent, fade in
      particle.targetOpacity = particle.baseOpacity;

      const baseColor =
        (mood && mood.includes("happy")) || Math.random() > 0.6 // Higher chance for primary on happy
          ? primaryRgbStr
          : accentRgbStr;
      particle.color = `rgba(${baseColor},1)`; // Opacity will be handled by currentOpacity

      particle.currentRotation = Math.random() * Math.PI * 2;
      particle.targetRotation = particle.currentRotation;
      particle.vr = (Math.random() - 0.5) * 0.08 * (speedFactor || 1); // Faster rotation
    }

    startRenderLoop() {
      if (this.animationId) {
        // Prevent multiple loops
        this._cancelAnimationFrame(this.animationId);
      }
      const render = (timestamp) => {
        // timestamp is passed by rAF
        if (!this.isInitialized || !this.canvas || !this.ctx) {
          // Added checks for canvas and ctx
          if (this.animationId) this._cancelAnimationFrame(this.animationId); // Stop if not initialized
          this.animationId = null;
          return;
        }

        const currentTime = performance.now(); // Use performance.now() for consistency
        const deltaTime = (currentTime - this.lastFrameTime) / 1000; // Convert to seconds
        this.lastFrameTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particlePool.forEach((p) => {
          if (p.active) {
            p.life -= deltaTime * 1000; // Life decreases based on actual elapsed time
            if (p.life <= 0) {
              p.active = false;
              p.currentOpacity = 0; // Ensure it's visually gone
              return;
            }

            // Update target positions based on velocity (physics update)
            p.targetX += p.vx * deltaTime * 60; // Multiply by 60 for typical frame-based velocity
            p.targetY += p.vy * deltaTime * 60;
            p.vy += 0.035 * (p.baseSize / 2) * deltaTime * 60; // Adjusted gravity, scaled by deltaTime
            p.targetRotation += p.vr * deltaTime * 60;

            // Lerp current values towards targets
            p.currentX = Year3000Utilities.lerpSmooth(
              p.currentX,
              p.targetX,
              deltaTime,
              this.particleHalfLife
            );
            p.currentY = Year3000Utilities.lerpSmooth(
              p.currentY,
              p.targetY,
              deltaTime,
              this.particleHalfLife
            );
            p.currentRotation = Year3000Utilities.lerpSmooth(
              p.currentRotation,
              p.targetRotation,
              deltaTime,
              this.particleHalfLife
            );

            // Update target visual properties (e.g., fade out, shrink over life)
            const lifeRatio = Math.max(0, p.life / p.maxLife);
            p.targetSize = p.baseSize * (lifeRatio * 0.8 + 0.2); // Shrink a bit but not to zero
            p.targetOpacity = p.baseOpacity * lifeRatio;

            // Lerp current visual properties
            p.currentSize = Year3000Utilities.lerpSmooth(
              p.currentSize,
              p.targetSize,
              deltaTime,
              this.particleHalfLife * 0.8 // Faster smoothing for visuals
            );
            p.currentOpacity = Year3000Utilities.lerpSmooth(
              p.currentOpacity,
              p.targetOpacity,
              deltaTime,
              this.particleHalfLife * 0.8
            );

            if (p.currentOpacity > 0.01 && p.currentSize > 0.1) {
              // Only draw if visible
              this.ctx.save();
              this.ctx.translate(p.currentX, p.currentY);
              this.ctx.rotate(p.currentRotation);

              this.ctx.beginPath();
              // Simple circle, could be an image or more complex shape
              this.ctx.arc(
                0,
                0,
                Math.max(0, p.currentSize / 2),
                0,
                Math.PI * 2
              );

              // Apply opacity to the particle's base color string
              this.ctx.fillStyle = p.color.replace(
                /,\s*\d+(\.\d+)?\)/, // Match existing opacity or end of RGB
                `,${Math.max(0, Math.min(1, p.currentOpacity)).toFixed(3)})` // Clamp and set new opacity
              );
              this.ctx.fill();
              this.ctx.restore();
            }
          } // Closes if (p.active)
        }); // Closes this.particlePool.forEach
        if (this.isInitialized) {
          // Check again before queuing next frame
          this.animationId = this._requestAnimationFrame(render);
        }
      };
      this.animationId = this._requestAnimationFrame(render);
    }

    destroy() {
      if (this.animationId) {
        this._cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
        this.ctx = null;
      }
      this.particlePool = []; // Clear the pool
      super.destroy();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Destroyed.`);
      }
    }
  }
  // END OF PHASE 4: LightweightParticleSystem Class Definition
  // =============================================================================

  // =============================================================================
  // PHASE 5: BehavioralPredictionEngine Class Definition
  // =============================================================================
  class BehavioralPredictionEngine extends BaseVisualSystem {
    constructor() {
      super({ systemName: "BehavioralPredictionEngine" });
      this.predictionRules = [
        // Example Rules: selector, condition (function), confidence, highlightType, description
        {
          selector:
            '[data-testid="shuffle-button"], .main-shuffleButton-button',
          condition: (ctx) => ctx.energy > 0.7 && ctx.valence > 0.5, // High energy, positive mood
          confidence: 0.6,
          highlightType: "glow-pulse",
          description:
            "High energy/positive music often leads to shuffle/exploration.",
        },
        {
          selector:
            '.control-button-heart, [data-testid*="like"], [aria-label*="Save to Your Library"]',
          condition: (ctx) =>
            ctx.valence < 0.4 && ctx.energy < 0.5 && ctx.timeOfDay > 18, // Melancholy evening
          confidence: 0.5,
          highlightType: "subtle-glow",
          description: "Melancholic evening music might lead to saving/liking.",
        },
        {
          selector:
            '[data-testid="control-button-repeat"], [aria-label*="Enable repeat"]',
          condition: (ctx) =>
            ctx.energy > 0.6 &&
            ctx.danceability > 0.6 &&
            ctx.isNewTrackForUser === false, // High energy, danceable, familiar track
          confidence: 0.4,
          highlightType: "static-glow",
          description:
            "Familiar, danceable high-energy tracks are often repeated.",
        },
        {
          selector:
            '[data-testid="context-menu-button"], [data-testid="more-button"], [aria-label*="More options"]',
          condition: (ctx) =>
            ctx.isNewTrackForUser === true && ctx.energy > 0.5, // New track with moderate energy
          confidence: 0.45,
          highlightType: "subtle-pulse",
          description: "Exploring options for new tracks.",
        },
      ];
      this.activeHighlights = new Map(); // Stores {element, highlightType}
      this.lastTrackUriForNewnessCheck = null;

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Constructor called.`);
      }
    }

    async initialize() {
      await super.initialize();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Initialized.`);
      }
    }

    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      if (!this.isInitialized || !processedMusicData) return;

      const isNewTrack = trackUri !== this.lastTrackUriForNewnessCheck;
      if (isNewTrack) this.lastTrackUriForNewnessCheck = trackUri;

      const context = {
        energy: processedMusicData.processedEnergy,
        valence: processedMusicData.processedValence,
        danceability: rawFeatures?.danceability || 0.5, // Use raw if available
        mood: processedMusicData.moodIdentifier,
        timeOfDay: new Date().getHours(),
        isNewTrackForUser: isNewTrack, // Simple check, not true "newness"
        visualIntensity: processedMusicData.visualIntensity,
      };

      const newPredictions = this.generatePredictions(context);
      this.applyHighlights(newPredictions);
    }

    generatePredictions(context) {
      const predictions = [];
      this.predictionRules.forEach((rule) => {
        try {
          if (rule.condition(context)) {
            predictions.push({
              selector: rule.selector,
              confidence: rule.confidence * context.visualIntensity, // Modulate by overall visual intensity
              highlightType: rule.highlightType,
              description: rule.description,
            });
          }
        } catch (e) {
          if (YEAR3000_CONFIG.enableDebug) {
            console.warn(
              `[${this.systemName}] Error evaluating rule for selector ${rule.selector}:`,
              e
            );
          }
        }
      });
      if (
        YEAR3000_CONFIG.enableDebug &&
        predictions.length > 0 &&
        Math.random() < 0.05
      ) {
        // Log sparsely
        // console.log(`[${this.systemName}] Generated predictions:`, predictions.map(p=>`${p.selector} (${p.highlightType} @ ${p.confidence.toFixed(2)})`));
      }
      return predictions;
    }

    applyHighlights(predictions) {
      const elementsToHighlightThisCycle = new Set();

      // Clear previous highlights that are not in the current predictions
      this.activeHighlights.forEach((highlightDetails, element) => {
        if (
          !predictions.some((p) =>
            Array.from(document.querySelectorAll(p.selector)).includes(element)
          )
        ) {
          element.classList.remove(
            "sn-predicted-active",
            ...this.getHighlightClasses(highlightDetails.type)
          );
          element.style.setProperty("--sn-prediction-confidence", "0");
          this.activeHighlights.delete(element);
        }
      });

      predictions.forEach((prediction) => {
        try {
          document.querySelectorAll(prediction.selector).forEach((element) => {
            elementsToHighlightThisCycle.add(element);
            const currentHighlight = this.activeHighlights.get(element);

            if (
              !currentHighlight ||
              currentHighlight.type !== prediction.highlightType
            ) {
              if (currentHighlight) {
                element.classList.remove(
                  ...this.getHighlightClasses(currentHighlight.type)
                );
              }
              element.classList.add(
                "sn-predicted-active",
                ...this.getHighlightClasses(prediction.highlightType)
              );
              this.activeHighlights.set(element, {
                type: prediction.highlightType,
              });
            }
            element.style.setProperty(
              "--sn-prediction-confidence",
              prediction.confidence.toFixed(3)
            );
          });
        } catch (e) {
          if (YEAR3000_CONFIG.enableDebug) {
            console.warn(
              `[${this.systemName}] Error applying highlight for selector ${prediction.selector}:`,
              e
            );
          }
        }
      });

      // Final cleanup for elements that were highlighted but are no longer in any prediction
      this.activeHighlights.forEach((highlightDetails, element) => {
        if (!elementsToHighlightThisCycle.has(element)) {
          element.classList.remove(
            "sn-predicted-active",
            ...this.getHighlightClasses(highlightDetails.type)
          );
          element.style.setProperty("--sn-prediction-confidence", "0");
          this.activeHighlights.delete(element);
        }
      });
    }

    getHighlightClasses(type) {
      const baseClass = "sn-predict";
      switch (type) {
        case "glow-pulse":
          return [baseClass, `${baseClass}-glow`, `${baseClass}-pulse`];
        case "subtle-glow":
          return [baseClass, `${baseClass}-subtle-glow`];
        case "static-glow":
          return [baseClass, `${baseClass}-static-glow`];
        case "subtle-pulse":
          return [baseClass, `${baseClass}-subtle-pulse`];
        default:
          return [baseClass];
      }
    }

    destroy() {
      this.activeHighlights.forEach((highlightDetails, element) => {
        element.classList.remove(
          "sn-predicted-active",
          ...this.getHighlightClasses(highlightDetails.type)
        );
        element.style.setProperty("--sn-prediction-confidence", "0");
      });
      this.activeHighlights.clear();
      super.destroy();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Destroyed, highlights cleared.`);
      }
    }
  }
  // END OF PHASE 5: BehavioralPredictionEngine Class Definition
  // =============================================================================

  // =============================================================================
  // PHASE 5 (Sidebar Glyphs): DataGlyphSystem Class Definition
  // =============================================================================
  class DataGlyphSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "DataGlyphSystem" });
      this.itemObserver = null;
      this.observedItems = new WeakMap(); // To store glyph elements associated with observed items
      this.glyphDataCache = new WeakMap(); // To store data for each glyph
      this.itemInteractionData = new WeakMap(); // Phase 6: { lastInteractionTime, interactionScore, echoActiveUntil, resonanceIntensity }

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Constructor called.`);
      }
    }

    async initialize() {
      await super.initialize();
      this.setupItemObserver();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized and item observer set up.`
        );
      }
    }

    setupItemObserver() {
      const itemSelectors = [
        'nav[aria-label="Main"] a',
        ".main-yourLibraryX-listItem > div:first-child", // Target the inner div for better positioning context
        '.main-yourLibraryX-navLink[href="/collection"]', // Home, Search, Library top items
        '.main-yourLibraryX-navLink[href="/search"]',
      ].join(", ");

      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.matches(itemSelectors)) {
                  this.attachGlyph(node);
                }
                node
                  .querySelectorAll(itemSelectors)
                  .forEach((item) => this.attachGlyph(item));
              }
            });
          }
        }
      };

      this.itemObserver = new MutationObserver(observerCallback);
      this.itemObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Initial scan for existing items
      document
        .querySelectorAll(itemSelectors)
        .forEach((item) => this.attachGlyph(item));

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] ItemObserver watching for: ${itemSelectors}`
        );
      }
    }

    attachGlyph(itemElement) {
      if (!itemElement || this.observedItems.has(itemElement)) {
        return;
      }

      const glyphElement = document.createElement("div");
      glyphElement.className = "sn-data-glyph";
      // Ensure the parent item can act as a positioning context
      if (getComputedStyle(itemElement).position === "static") {
        itemElement.style.position = "relative";
      }
      itemElement.appendChild(glyphElement);
      this.observedItems.set(itemElement, glyphElement);

      // Initialize with some default/placeholder data
      this.updateGlyphData(itemElement, { type: "default", intensity: 0.1 });

      // Phase 6: Initialize interaction data and attach listeners
      this.itemInteractionData.set(itemElement, {
        lastInteractionTime: 0,
        interactionScore: 0,
        echoActiveUntil: 0,
        resonanceIntensity: 0,
      });

      // Store bound event handlers for easy removal
      const boundHandleInteraction = this.handleItemInteraction.bind(
        this,
        itemElement
      );
      this.observedItems.get(itemElement)._boundHandleInteraction =
        boundHandleInteraction; // Store on glyphElement for removal

      itemElement.addEventListener("click", boundHandleInteraction);
      // Optional: Add hover for less significant interaction tracking if needed later
      // itemElement.addEventListener("mouseenter", boundHandleInteraction);

      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.1) {
        // Sparse logging
        // console.log(`[${this.systemName}] Glyph attached to:`, itemElement);
      }
    }

    updateGlyphData(itemElement, data) {
      const glyphElement = this.observedItems.get(itemElement);
      if (!glyphElement) return;

      this.glyphDataCache.set(itemElement, data); // Store the raw data

      // Example: Translate data to visual properties
      let opacity = 0.3 + (data.intensity || 0) * 0.7;
      let scale = 1 + (data.sizeFactor || 0) * 0.5;
      let pulseIntensity = data.pulseIntensity || 0;
      let shimmerOpacity = 0.3 + (data.shimmerFactor || 0) * 0.7;
      let rotation = data.rotationAngle || 0;
      let colorRgb =
        data.colorRgb ||
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sn-glyph-color-rgb")
          .trim() ||
        "140,170,238";
      let pulseAnimationState =
        data.pulseIntensity > 0.1 ? "running" : "paused";

      // Apply these to the glyphElement directly or via its CSS variables if defined on :root
      // For simplicity here, we'll assume the CSS variables for glyphs are on :root
      // and this system is responsible for updating them PER GLYPH if glyphs have unique states.
      // However, the current SCSS uses global --sn-glyph-* vars.
      // For individual glyph control, each .sn-data-glyph would need its own vars or direct style overrides.

      // Let's assume for now we are controlling a *single* representative glyph state or global glyph properties.
      // For per-item glyphs, this logic needs to set styles on glyphElement.
      // Example for direct styling (if SCSS vars were not global):
      glyphElement.style.setProperty("--sn-glyph-opacity", opacity.toFixed(2));
      glyphElement.style.setProperty("--sn-glyph-scale", scale.toFixed(2));
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

      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.05) {
        // Sparse logging
        // console.log(`[${this.systemName}] Glyph data updated for:`, itemElement, data);
      }
    }

    // This method will be called by MusicAnalysisService if general music affects all glyphs
    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      super.updateFromMusicAnalysis(processedMusicData); // Call BaseVisualSystem's common logic
      // Example: Make all glyphs subtly react to global music intensity
      const globalIntensity = processedMusicData.visualIntensity || 0;
      document.documentElement.style.setProperty(
        "--sn-glyph-global-intensity-factor",
        globalIntensity.toFixed(2)
      );

      // Phase 6: Check for active echoes and update resonance globally if needed (or per item)
      this.updateActiveEchoesAndResonance();

      // Potentially iterate over all known glyphs and update them if needed
      // For now, we'll keep it simple. Individual glyph updates would be data-driven from other sources.
    }

    // Phase 6: New methods for interaction, echo, and resonance
    handleItemInteraction(itemElement, event) {
      // event is now the actual event object
      if (!itemElement || !this.itemInteractionData.has(itemElement)) return;

      const interactionType = event.type; // 'click' or 'mouseenter' etc.
      const data = this.itemInteractionData.get(itemElement);
      const glyphElement = this.observedItems.get(itemElement);
      if (!glyphElement) return;

      data.lastInteractionTime = Date.now();

      let scoreIncrement = 0;
      if (interactionType === "click") {
        scoreIncrement = 5; // More points for a click
        // Trigger temporal echo on click
        data.echoActiveUntil = Date.now() + 750; // Echo lasts 750ms
        glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0.3");
        glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1.15");
        glyphElement.classList.add("sn-nav-item-echoing"); // Add class to trigger SCSS animation
      } else if (interactionType === "mouseenter") {
        scoreIncrement = 1; // Less for hover
      }
      data.interactionScore += scoreIncrement;

      // Update resonance
      data.resonanceIntensity = Math.min(0.25, data.interactionScore * 0.005); // Cap resonance
      glyphElement.style.setProperty(
        "--sn-glyph-resonance-intensity",
        data.resonanceIntensity.toFixed(3)
      );

      this.itemInteractionData.set(itemElement, data);

      if (YEAR3000_CONFIG.enableDebug) {
        // console.log(`[${this.systemName}] Interaction (${interactionType}) on:`, itemElement, `New Score: ${data.interactionScore}, Resonance: ${data.resonanceIntensity.toFixed(3)}`);
      }
    }

    updateActiveEchoesAndResonance() {
      const now = Date.now();
      this.observedItems.forEach((glyphElement, itemElement) => {
        if (this.itemInteractionData.has(itemElement)) {
          const data = this.itemInteractionData.get(itemElement);
          // Manage echo decay
          if (data.echoActiveUntil > 0 && now > data.echoActiveUntil) {
            glyphElement.style.setProperty("--sn-nav-item-echo-opacity", "0");
            glyphElement.style.setProperty("--sn-nav-item-echo-scale", "1");
            glyphElement.classList.remove("sn-nav-item-echoing");
            data.echoActiveUntil = 0;
            this.itemInteractionData.set(itemElement, data); // Update map
          }

          // Example: Decay interactionScore slowly over time if not interacted with
          if (
            now - data.lastInteractionTime > 60000 &&
            data.interactionScore > 0
          ) {
            // 1 minute
            data.interactionScore = Math.max(0, data.interactionScore - 0.1); // Slow decay
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
      if (this.itemObserver) {
        this.itemObserver.disconnect();
        this.itemObserver = null;
      }
      // Remove glyphs - iterate observedItems and remove glyphElement from itemElement
      this.observedItems.forEach((glyphElement, itemElement) => {
        if (itemElement && itemElement.contains(glyphElement)) {
          // Phase 6: Remove event listeners
          if (glyphElement._boundHandleInteraction) {
            itemElement.removeEventListener(
              "click",
              glyphElement._boundHandleInteraction
            );
            // itemElement.removeEventListener("mouseenter", glyphElement._boundHandleInteraction);
          }
          // Reset item-specific styles
          glyphElement.style.removeProperty("--sn-nav-item-echo-opacity");
          glyphElement.style.removeProperty("--sn-nav-item-echo-scale");
          glyphElement.style.removeProperty("--sn-glyph-resonance-intensity");
          glyphElement.classList.remove("sn-nav-item-echoing");

          itemElement.removeChild(glyphElement);
        }
      });
      this.observedItems = new WeakMap(); // Clear the map
      this.glyphDataCache = new WeakMap();
      this.itemInteractionData = new WeakMap(); // Phase 6: Clear interaction data

      super.destroy();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Destroyed, observer disconnected, glyphs removed.`
        );
      }
    }
  }
  // END OF PHASE 5 (Sidebar Glyphs): DataGlyphSystem Class Definition
  // =============================================================================

  // =============================================================================
  // PHASE 1 (Sidebar): DimensionalNexusSystem Class Definition
  // =============================================================================
  class DimensionalNexusSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "DimensionalNexusSystem" });
      // Phase 5: Biometric Feedback properties
      this.lastUserInteractionTime = Date.now();
      this.isMeditating = false;
      this.meditationGracePeriod = 5000; // 5 seconds before meditation can start
      this.interactionCooldown = 1000; // 1 second cooldown after interaction before checking meditation

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Constructor called.`);
      }
    }

    async initialize() {
      await super.initialize(); // Call BaseVisualSystem's initialize
      this.initializeQuantumSpace();
      this.setupModalObserver();
      // Phase 5: Listener for generic user interaction (very basic example)
      // A more robust solution would involve specific event listeners on interactable elements.
      this._boundRecordUserInteraction = this.recordUserInteraction.bind(this);
      document.addEventListener("mousemove", this._boundRecordUserInteraction, {
        passive: true,
        capture: true,
      });
      document.addEventListener("click", this._boundRecordUserInteraction, {
        passive: true,
        capture: true,
      });

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Initialized, quantum space prepared, modal observer, and interaction listeners set up.`
        );
      }
    }

    initializeQuantumSpace() {
      const root = document.documentElement;
      // Set initial values for the CSS variables defined in SCSS for sidebar background
      root.style.setProperty("--sn-consciousness-opacity", "0.15");
      root.style.setProperty("--sn-neural-flow-speed", "20s");
      root.style.setProperty("--sn-neural-opacity", "0.1");
      root.style.setProperty("--sn-quantum-foam-opacity", "0.03");
      root.style.setProperty("--sn-temporal-shift-progress", "0");
      root.style.setProperty("--sn-temporal-animation-speed", "30s");
      root.style.setProperty("--sn-sidebar-clip-path", "inset(0)");

      // Initialize Phase 3 Navigation Item Variables
      root.style.setProperty("--sn-nav-item-base-opacity", "0.85");
      root.style.setProperty("--sn-nav-item-hover-bg-opacity", "0.1");
      root.style.setProperty("--sn-nav-item-active-bg-opacity", "0.15");
      root.style.setProperty("--sn-nav-item-glow-color-rgb", "202,158,230");
      root.style.setProperty("--sn-nav-item-glow-intensity", "0.3");
      root.style.setProperty("--sn-nav-text-energy-color-rgb", "140,170,238");
      root.style.setProperty("--sn-nav-text-energy-opacity", "0.2");
      root.style.setProperty("--sn-nav-item-transform-scale", "1");
      root.style.setProperty("--sn-nav-item-transition-duration", "0.3s");

      // Initialize Phase 4 Modal/Popup Variables
      root.style.setProperty("--sn-modal-bg-opacity", "0.10");
      root.style.setProperty("--sn-modal-blur-intensity", "10px");
      root.style.setProperty("--sn-modal-border-color-rgb", "186,187,241");
      root.style.setProperty("--sn-modal-border-opacity", "0.3");
      root.style.setProperty("--sn-modal-glow-intensity", "0.24");
      root.style.setProperty("--sn-modal-text-energy-opacity", "0.14");
      root.style.setProperty("--sn-modal-glow-color-rgb", "202,158,230");
      root.style.setProperty("--sn-modal-text-energy-color-rgb", "140,170,238");

      // Phase 5: Initialize Biometric Feedback CSS Variables
      root.style.setProperty("--sn-sidebar-meditation-desaturation", "0");
      root.style.setProperty("--sn-sidebar-meditation-slowdown", "1");
      root.style.setProperty("--sn-item-energy-absorption-scale", "1");
      // Store original animation speeds if needed for slowdown calculations
      // For simplicity, SCSS will use these directly, assuming original speeds are set there or are static.
      // root.style.setProperty("--original-neural-flow-speed", root.style.getPropertyValue("--sn-neural-flow-speed").trim() || "20s");

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(
          `[${this.systemName}] Initial CSS variables for quantum space, nav, modals, and biometrics set.`
        );
      }
    }

    // Phase 5: Method to record user interaction
    recordUserInteraction() {
      const now = Date.now();
      // Only update if not in cooldown to prevent spamming updates
      if (now - this.lastUserInteractionTime > this.interactionCooldown / 2) {
        this.lastUserInteractionTime = now;
        if (this.isMeditating) {
          this.isMeditating = false; // Exit meditation on any interaction
          if (YEAR3000_CONFIG.enableDebug) {
            // console.log(`[${this.systemName}] User interaction recorded, exiting meditation.`);
          }
        }
      }
    }

    setupModalObserver() {
      // ... (modal observer setup remains the same) ...
      if (!this.isInitialized) return;

      const modalSelectors = [
        ".GenericModal__content",
        ".encore-context-menu",
        ".encore-dropdown-menu",
        ".encore-popover__content",
        'body > .ReactModalPortal div[role="dialog"]',
        'body > div[data-encore-id="tooltip"] > div[role="tooltip"]',
      ];

      const observerCallback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                modalSelectors.forEach((selector) => {
                  const elements = [];
                  if (node.matches(selector)) {
                    elements.push(node);
                  }
                  if (typeof node.querySelectorAll === "function") {
                    node
                      .querySelectorAll(selector)
                      .forEach((el) => elements.push(el));
                  }

                  elements.forEach((modalElement) => {
                    if (
                      !modalElement.classList.contains(
                        "sn-dimensional-modal-emerging"
                      ) &&
                      !modalElement.classList.contains("sn-modal-processed")
                    ) {
                      modalElement.classList.add(
                        "sn-dimensional-modal-emerging"
                      );
                      modalElement.classList.add("sn-modal-processed");
                      if (YEAR3000_CONFIG.enableDebug) {
                        // console.log(
                        //   `[${this.systemName}] Modal detected and emergence class applied:`,
                        //   modalElement
                        // );
                      }
                    }
                  });
                });
              }
            });
          }
        }
      };

      const observer = new MutationObserver(observerCallback);
      observer.observe(document.body, { childList: true, subtree: true });

      if (YEAR3000_CONFIG.enableDebug) {
        // console.log(
        //   `[${this.systemName}] MutationObserver for modals initialized.`
        // );
      }
      this.modalObserver = observer;
    }

    updateConsciousnessField(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;

      const root = document.documentElement;
      const sidebarElement = document.querySelector(
        'div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar'
      );
      const {
        visualIntensity,
        processedEnergy,
        moodIdentifier,
        animationSpeedFactor,
      } = processedMusicData;

      // --- Existing Phase 1 & 2 Modulations for Sidebar Background ---
      // ... (This part remains largely the same) ...
      const baseNeuralFlowSpeed = 20;
      const baseTemporalAnimationSpeed = 30;
      const currentAnimationSpeedFactor = animationSpeedFactor || 1;

      let neuralFlowSpeedTarget = Math.max(
        5,
        baseNeuralFlowSpeed / currentAnimationSpeedFactor
      );
      let temporalAnimationSpeedTarget = Math.max(
        7.5,
        baseTemporalAnimationSpeed / currentAnimationSpeedFactor
      );

      let newNeuralOpacity = 0.05 + visualIntensity * 0.2;
      let newConsciousnessOpacity = 0.1 + visualIntensity * 0.25;
      let newQuantumFoamOpacity = 0.02 + visualIntensity * 0.03;
      let newTemporalShift = processedEnergy * 0.4 + visualIntensity * 0.6;

      if (
        moodIdentifier === "energetic_happy" ||
        moodIdentifier === "energetic"
      ) {
        newNeuralOpacity *= 1.2;
        newConsciousnessOpacity *= 1.1;
        newQuantumFoamOpacity *= 1.3;
      } else if (moodIdentifier === "calm_sad" || moodIdentifier === "sad") {
        newNeuralOpacity *= 0.8;
        newConsciousnessOpacity *= 0.9;
        newQuantumFoamOpacity *= 0.7;
      }

      const finalNeuralOpacity = Math.max(
        0.02,
        Math.min(0.35, newNeuralOpacity)
      ).toFixed(3);
      const mainConsciousnessOpacity = Math.max(
        0.05,
        Math.min(0.45, newConsciousnessOpacity)
      );
      const finalQuantumFoamOpacity = Math.max(
        0.01,
        Math.min(0.08, newQuantumFoamOpacity)
      ).toFixed(3);
      const finalTemporalShift = Math.max(
        0,
        Math.min(1, newTemporalShift)
      ).toFixed(3);

      // --- Phase 5: Digital Meditation Logic ---
      const now = Date.now();
      const timeSinceLastInteraction = now - this.lastUserInteractionTime;
      const isCalmMusic =
        visualIntensity < 0.25 &&
        (moodIdentifier.includes("calm") ||
          moodIdentifier.includes("sad") ||
          moodIdentifier === "neutral");

      let targetDesaturation = 0;
      let targetSlowdown = 1;

      if (this.isMeditating) {
        if (
          !isCalmMusic ||
          timeSinceLastInteraction < this.meditationGracePeriod
        ) {
          // Exit meditation
          this.isMeditating = false;
        } else {
          // Continue meditating
          targetDesaturation = 0.45; // Target desaturation level
          targetSlowdown = 0.6; // Target slowdown factor
        }
      } else {
        // Not currently meditating
        if (
          isCalmMusic &&
          timeSinceLastInteraction >
            this.meditationGracePeriod + this.interactionCooldown
        ) {
          this.isMeditating = true; // Enter meditation
          targetDesaturation = 0.45;
          targetSlowdown = 0.6;
        }
      }

      // Get current desaturation and slowdown for lerping
      let currentDesaturation =
        parseFloat(
          root.style.getPropertyValue("--sn-sidebar-meditation-desaturation")
        ) || 0;
      let currentSlowdown =
        parseFloat(
          root.style.getPropertyValue("--sn-sidebar-meditation-slowdown")
        ) || 1;

      const lerpDeltaTime =
        (now - (this.lastMeditationUpdateTime || now)) / 1000;
      this.lastMeditationUpdateTime = now;

      const smoothedDesaturation = Year3000Utilities.lerpSmooth(
        currentDesaturation,
        targetDesaturation,
        lerpDeltaTime,
        0.8
      ); // Slower lerp for smooth transition
      const smoothedSlowdown = Year3000Utilities.lerpSmooth(
        currentSlowdown,
        targetSlowdown,
        lerpDeltaTime,
        0.8
      );

      root.style.setProperty(
        "--sn-sidebar-meditation-desaturation",
        smoothedDesaturation.toFixed(3)
      );
      root.style.setProperty(
        "--sn-sidebar-meditation-slowdown",
        smoothedSlowdown.toFixed(3)
      );

      if (sidebarElement) {
        if (this.isMeditating && smoothedDesaturation > 0.1) {
          // Add class if actually meditating
          sidebarElement.classList.add("sn-digital-meditation");
        } else if (!this.isMeditating && smoothedDesaturation < 0.05) {
          // Remove class if fully reset
          sidebarElement.classList.remove("sn-digital-meditation");
        }
      }

      // Apply slowdown to animation speeds
      neuralFlowSpeedTarget /= smoothedSlowdown;
      temporalAnimationSpeedTarget /= smoothedSlowdown;

      root.style.setProperty(
        "--sn-neural-flow-speed",
        `${neuralFlowSpeedTarget.toFixed(1)}s`
      );
      root.style.setProperty(
        "--sn-temporal-animation-speed",
        `${temporalAnimationSpeedTarget.toFixed(1)}s`
      );
      // --- End Digital Meditation ---

      root.style.setProperty("--sn-neural-opacity", finalNeuralOpacity);
      root.style.setProperty(
        "--sn-consciousness-opacity",
        mainConsciousnessOpacity.toFixed(3)
      );
      root.style.setProperty(
        "--sn-quantum-foam-opacity",
        finalQuantumFoamOpacity
      );
      root.style.setProperty(
        "--sn-temporal-shift-progress",
        finalTemporalShift
      );

      this.evolveBiomorphicShape(
        visualIntensity,
        moodIdentifier,
        processedEnergy
      );
      // --- End Sidebar Background Updates ---

      // --- Phase 3 Modulations for Navigation Items ---
      // ... (nav item updates remain the same as Phase 4) ...
      let navGlowIntensity = 0.3 + visualIntensity * 0.7;
      let navTextEnergyOpacity = 0.1 + processedEnergy * 0.4;
      let navItemTransformScale = 1 + visualIntensity * 0.025;

      if (
        moodIdentifier === "energetic_happy" ||
        moodIdentifier === "danceable"
      ) {
        navGlowIntensity *= 1.1;
        navTextEnergyOpacity *= 1.2;
        navItemTransformScale += 0.005;
      } else if (moodIdentifier === "calm_sad" || moodIdentifier === "sad") {
        navGlowIntensity *= 0.8;
        navTextEnergyOpacity *= 0.7;
      }

      const finalNavItemGlowIntensity = Math.max(
        0,
        Math.min(1, navGlowIntensity)
      ).toFixed(3);
      const finalNavTextEnergyOpacity = Math.max(
        0,
        Math.min(0.6, navTextEnergyOpacity)
      ).toFixed(3);
      const finalNavItemTransformScale = Math.max(
        1,
        Math.min(1.03, navItemTransformScale)
      ).toFixed(4);

      root.style.setProperty(
        "--sn-nav-item-glow-intensity",
        finalNavItemGlowIntensity
      );
      root.style.setProperty(
        "--sn-nav-text-energy-opacity",
        finalNavTextEnergyOpacity
      );
      root.style.setProperty(
        "--sn-nav-item-transform-scale",
        finalNavItemTransformScale
      );

      try {
        const primaryRgbStr = getComputedStyle(root)
          .getPropertyValue("--sn-gradient-primary-rgb")
          .trim();
        if (primaryRgbStr) {
          const [pr, pg, pb] = primaryRgbStr.split(",").map(Number);
          const primaryOklab = Year3000Utilities.rgbToOklab(pr, pg, pb);
          const harmonicNavColors =
            Year3000Utilities.generateHarmonicOklabColors(
              primaryOklab,
              "analogous",
              30
            );
          if (harmonicNavColors.length > 0) {
            const glowRgb = Year3000Utilities.oklabToRgb(
              harmonicNavColors[0].L,
              harmonicNavColors[0].a,
              harmonicNavColors[0].b
            );
            const textEnergyRgb = Year3000Utilities.oklabToRgb(
              harmonicNavColors[1].L,
              harmonicNavColors[1].a,
              harmonicNavColors[1].b
            );
            root.style.setProperty(
              "--sn-nav-item-glow-color-rgb",
              `${glowRgb.r},${glowRgb.g},${glowRgb.b}`
            );
            root.style.setProperty(
              "--sn-nav-text-energy-color-rgb",
              `${textEnergyRgb.r},${textEnergyRgb.g},${textEnergyRgb.b}`
            );
          }
        }
      } catch (e) {
        console.warn(
          `[${this.systemName}] Error generating harmonic colors for nav:`,
          e
        );
      }
      // --- End Nav Item Updates ---

      // --- Phase 4 Modulations for Modals & Popups ---
      // ... (modal updates remain the same as Phase 4) ...
      root.style.setProperty(
        "--sn-modal-bg-opacity",
        (mainConsciousnessOpacity * 0.7).toFixed(3)
      );
      root.style.setProperty(
        "--sn-modal-glow-intensity",
        (parseFloat(finalNavItemGlowIntensity) * 0.8).toFixed(3)
      );
      root.style.setProperty(
        "--sn-modal-text-energy-opacity",
        (parseFloat(finalNavTextEnergyOpacity) * 0.7).toFixed(3)
      );

      try {
        const secondaryRgbStr = getComputedStyle(root)
          .getPropertyValue("--sn-gradient-secondary-rgb")
          .trim();
        if (secondaryRgbStr) {
          const [sr, sg, sb] = secondaryRgbStr.split(",").map(Number);
          const secondaryOklab = Year3000Utilities.rgbToOklab(sr, sg, sb);
          const harmonicModalColors =
            Year3000Utilities.generateHarmonicOklabColors(
              secondaryOklab,
              "analogous",
              -20
            );
          if (harmonicModalColors.length > 0) {
            const modalBorderRgb = Year3000Utilities.oklabToRgb(
              harmonicModalColors[0].L,
              harmonicModalColors[0].a,
              harmonicModalColors[0].b
            );
            root.style.setProperty(
              "--sn-modal-border-color-rgb",
              `${modalBorderRgb.r},${modalBorderRgb.g},${modalBorderRgb.b}`
            );
          }
        }
      } catch (e) {
        console.warn(
          `[${this.systemName}] Error generating harmonic colors for modal border:`,
          e
        );
      }
      // --- End Modal & Popup Updates ---

      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.02) {
        // Very sparse logging
        // console.log(`[${this.systemName}] Consciousness, Nav, Modal, and Biometric fields updated.`);
      }
    }

    evolveBiomorphicShape(visualIntensity, moodIdentifier, energy) {
      // ... (this method remains the same as in Phase 2, 3 & 4) ...
      if (!this.isInitialized) return;
      const root = document.documentElement;
      let clipPath = "inset(0)";

      const intensityFactor = Math.max(0, Math.min(1, visualIntensity));
      const energyFactor = Math.max(0, Math.min(1, energy));
      const vMax = 100;

      const pt = (baseX, baseY, xVariance = 5, yVariance = 5) => {
        const x = baseX + (Math.random() - 0.5) * xVariance * intensityFactor;
        const y = baseY + (Math.random() - 0.5) * yVariance * intensityFactor;
        return `${Math.max(0, Math.min(vMax, x)).toFixed(1)}% ${Math.max(
          0,
          Math.min(vMax, y)
        ).toFixed(1)}%`;
      };

      if (moodIdentifier === "calm_sad" || moodIdentifier === "sad") {
        const topPull = 5 + 10 * energyFactor;
        const bottomSway = 5 + 15 * intensityFactor;
        clipPath = `polygon(${pt(0, 0, 2, 2)}, ${pt(vMax, 0, 2, 2)}, ${pt(
          vMax,
          vMax - bottomSway,
          10,
          5
        )}, ${pt(vMax * 0.5, vMax, 20, 5)}, ${pt(
          0,
          vMax - bottomSway,
          10,
          5
        )})`;
      } else if (
        moodIdentifier === "energetic_happy" ||
        moodIdentifier === "energetic" ||
        moodIdentifier === "danceable"
      ) {
        const spikeFactor = 10 + 20 * energyFactor;
        clipPath = `polygon(${pt(0, spikeFactor, 10, 5)}, ${pt(
          vMax * 0.8,
          0,
          15,
          spikeFactor / 2
        )}, ${pt(vMax, vMax * 0.7, spikeFactor, 10)}, ${pt(
          vMax * 0.3,
          vMax,
          20,
          spikeFactor
        )}, ${pt(0, vMax * 0.9, 10, 5)})`;
      } else {
        // Neutral or other moods
        const curveTop = 5 + 10 * intensityFactor;
        const curveSide = 5 + 15 * energyFactor;
        const curveBottom = 10 + 5 * intensityFactor;
        clipPath = `polygon(${pt(0, curveTop, 5, 3)}, ${pt(
          vMax - curveSide,
          0,
          8,
          5
        )}, ${pt(vMax, vMax - curveBottom, 5, 8)}, ${pt(
          curveSide,
          vMax,
          10,
          5
        )}, ${pt(0, vMax * 0.8, 3, 5)})`;
      }
      root.style.setProperty("--sn-sidebar-clip-path", clipPath);
    }

    updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
      // ... (this method remains the same) ...
      if (!this.isInitialized) return;
      super.updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri); // Call BaseVisualSystem's common logic
      this.updateConsciousnessField(processedMusicData); // Then call our specific logic
    }

    destroy() {
      // ... (modal observer cleanup remains same, add biometric listener cleanup) ...
      document.removeEventListener(
        "mousemove",
        this._boundRecordUserInteraction
      ); // Might need bound function if not arrow
      document.removeEventListener("click", this._boundRecordUserInteraction);

      if (this.modalObserver) {
        this.modalObserver.disconnect();
        this.modalObserver = null;
      }
      // Reset meditation class if active
      const sidebarElement = document.querySelector(
        'div[data-testid="Desktop_LeftSidebar_Id"].Root__nav-bar'
      );
      if (sidebarElement) {
        sidebarElement.classList.remove("sn-digital-meditation");
      }
      // Reset biometric CSS variables
      const root = document.documentElement;
      root.style.setProperty("--sn-sidebar-meditation-desaturation", "0");
      root.style.setProperty("--sn-sidebar-meditation-slowdown", "1");

      super.destroy();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Destroyed.`);
      }
    }
  } // Closes DimensionalNexusSystem class

  // =============================================================================
  // PHASE 6: PredictiveMaterializationSystem Class Definition
  // =============================================================================
  class PredictiveMaterializationSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "PredictiveMaterializationSystem" });
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Constructor called.`);
      }
    }

    async initialize() {
      await super.initialize();
      const root = document.documentElement;
      root.style.setProperty("--sn-predictive-echo-opacity", "0");
      root.style.setProperty("--sn-predictive-echo-scale", "1");
      root.style.setProperty("--sn-dimensional-rift-intensity", "0");
      root.style.setProperty("--sn-dimensional-rift-color-rgb", "140,170,238"); // Default accent

      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Initialized and CSS variables set.`);
      }
    }

    updateFromMusicAnalysis(processedMusicData) {
      if (!this.isInitialized || !processedMusicData) return;
      super.updateFromMusicAnalysis(processedMusicData); // Call base if it has common logic

      const root = document.documentElement;
      const { visualIntensity } = processedMusicData;

      // Placeholder logic for predictive effects
      if (visualIntensity > 0.7) {
        root.style.setProperty("--sn-predictive-echo-opacity", "0.05");
        root.style.setProperty("--sn-dimensional-rift-intensity", "0.3");
        // Example: derive rift color from current accent
        const accentRgb =
          getComputedStyle(root)
            .getPropertyValue("--sn-gradient-accent-rgb")
            .trim() || "140,170,238";
        root.style.setProperty("--sn-dimensional-rift-color-rgb", accentRgb);
      } else {
        root.style.setProperty("--sn-predictive-echo-opacity", "0");
        root.style.setProperty("--sn-dimensional-rift-intensity", "0");
      }

      if (YEAR3000_CONFIG.enableDebug && Math.random() < 0.05) {
        // console.log(`[${this.systemName}] Updated predictive variables based on visual intensity: ${visualIntensity.toFixed(2)}`);
      }
    }

    destroy() {
      const root = document.documentElement;
      root.style.removeProperty("--sn-predictive-echo-opacity");
      root.style.removeProperty("--sn-predictive-echo-scale");
      root.style.removeProperty("--sn-dimensional-rift-intensity");
      root.style.removeProperty("--sn-dimensional-rift-color-rgb");
      super.destroy();
      if (YEAR3000_CONFIG.enableDebug) {
        console.log(`[${this.systemName}] Destroyed and CSS variables reset.`);
      }
    }
  }
  // END OF PHASE 6: PredictiveMaterializationSystem Class Definition
  // =============================================================================

  // =============================================================================
  // YEAR 3000 SIDEBAR CONSCIOUSNESS SYSTEM - Dynamic Sidebar Visuals
  // =============================================================================
  class SidebarConsciousnessSystem extends BaseVisualSystem {
    constructor() {
      super({ systemName: "SidebarConsciousnessSystem" });
      this.rootNavBar = null;
      this.currentHarmonicModeClass = "";
      this.currentEnergyClass = "";
      if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
        console.log("[SidebarConsciousnessSystem] Constructor");
      }
    }

    async initialize() {
      await super.initialize(); // Subscribes to MusicAnalysisService
      console.log("🌟 [SidebarConsciousnessSystem] INITIALIZING 🌟"); // DEBUG LOG

      this.rootNavBar = document.querySelector(".Root__nav-bar");

      if (this.rootNavBar) {
        console.log(
          "🌟 [SidebarConsciousnessSystem] Found .Root__nav-bar element:",
          this.rootNavBar
        ); // DEBUG LOG
        // Initial setup based on current config
        if (YEAR3000_CONFIG) {
          this.updateHarmonicModeDisplay(YEAR3000_CONFIG.currentHarmonicMode);
        } else {
          console.warn(
            "[SidebarConsciousnessSystem] YEAR3000_CONFIG not available at init for harmonic mode."
          );
        }
        // Attempt initial energy setup if music analysis data is already available
        if (window.currentMusicAnalysis) {
          this.updateFromMusicAnalysis(window.currentMusicAnalysis);
        } else {
          // Fallback to a default or low-energy state if no initial data
          this.updateFromMusicAnalysis({
            processedEnergy: 0.1,
            moodIdentifier: "calm_neutral",
            overallLoudness: -20,
          });
        }
      } else {
        console.error(
          "🔥 [SidebarConsciousnessSystem] .Root__nav-bar element NOT FOUND during init!"
        ); // DEBUG LOG
      }

      if (
        YEAR3000_CONFIG &&
        YEAR3000_CONFIG.enableDebug &&
        this.isInitialized
      ) {
        console.log(
          `[SidebarConsciousnessSystem] Initialized successfully. Found nav bar: ${!!this
            .rootNavBar}`
        );
      }
    }

    updateHarmonicModeDisplay(newModeKey) {
      console.log(
        `🎨 [SidebarConsciousnessSystem] updateHarmonicModeDisplay called with: ${newModeKey}`
      ); // DEBUG LOG
      if (!this.rootNavBar || !this.isInitialized) {
        if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[SidebarConsciousnessSystem] updateHarmonicModeDisplay: Not ready (no nav bar or not initialized)."
          );
        }
        return;
      }

      // Remove previous harmonic mode class
      if (this.currentHarmonicModeClass) {
        this.rootNavBar.classList.remove(this.currentHarmonicModeClass);
      }

      // Apply new harmonic mode class (corresponds to SCSS selectors like .sn-harmonic-analogous-flow)
      if (newModeKey && HARMONIC_MODES[newModeKey]) {
        this.currentHarmonicModeClass = `sn-harmonic-${newModeKey
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")}`;
        this.rootNavBar.classList.add(this.currentHarmonicModeClass);
        if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
          console.log(
            `[SidebarConsciousnessSystem] Applied harmonic mode class: ${this.currentHarmonicModeClass}`
          );
        }
      } else {
        this.currentHarmonicModeClass = ""; // Reset if mode is invalid or 'none'
        if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
          console.log(
            `[SidebarConsciousnessSystem] No valid harmonic mode key, cleared mode class. Key: ${newModeKey}`
          );
        }
      }
    }

    updateFromMusicAnalysis(processedMusicData) {
      super.updateFromMusicAnalysis(processedMusicData); // Call base class method

      // Ensure processedMusicData and processedEnergy are defined
      const energy =
        processedMusicData &&
        typeof processedMusicData.processedEnergy === "number"
          ? processedMusicData.processedEnergy
          : 0.1; // Default to low energy if undefined

      console.log(
        `🎵 [SidebarConsciousnessSystem] updateFromMusicAnalysis called. Energy: ${energy}`
      ); // DEBUG LOG

      if (!this.rootNavBar || !this.isInitialized) {
        if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
          console.log(
            "[SidebarConsciousnessSystem] updateFromMusicAnalysis: Not ready (no nav bar or not initialized)."
          );
        }
        return;
      }

      // Remove previous energy class
      if (this.currentEnergyClass) {
        this.rootNavBar.classList.remove(this.currentEnergyClass);
      }

      // Determine and apply new energy class
      if (energy > 0.75) {
        this.currentEnergyClass = "sn-music-high-energy";
      } else if (energy > 0.4) {
        this.currentEnergyClass = "sn-music-mid-energy";
      } else {
        this.currentEnergyClass = "sn-music-low-energy";
      }
      this.rootNavBar.classList.add(this.currentEnergyClass);

      // Update CSS variable for temporal shift (example, scales with energy)
      // Max shift of -2s for high energy, 0s for low energy
      const temporalShift = -2 * Math.pow(energy, 2); // Exponential scaling for more pronounced effect at high energy
      this.rootNavBar.style.setProperty(
        "--sn-sidebar-current-temporal-shift",
        `${temporalShift.toFixed(2)}s`
      );

      // Update item bloom intensity and energy glow opacity
      const bloomIntensity = energy * 0.8; // Max bloom at high energy
      const glowOpacity = energy * 0.7; // Max glow at high energy

      this.rootNavBar.style.setProperty(
        "--sn-sidebar-item-bloom-intensity",
        `${bloomIntensity.toFixed(2)}`
      );
      this.rootNavBar.style.setProperty(
        "--sn-sidebar-energy-glow-opacity",
        `${glowOpacity.toFixed(2)}`
      );

      if (
        YEAR3000_CONFIG &&
        YEAR3000_CONFIG.enableDebug &&
        Math.random() < 0.1
      ) {
        // Log occasionally
        console.log(
          `[SidebarConsciousnessSystem] Applied energy class: ${
            this.currentEnergyClass
          }, temporal shift: ${temporalShift.toFixed(
            2
          )}s, bloom: ${bloomIntensity.toFixed(2)}, glow: ${glowOpacity.toFixed(
            2
          )}`
        );
      }
    }

    destroy() {
      if (this.rootNavBar) {
        if (this.currentHarmonicModeClass) {
          this.rootNavBar.classList.remove(this.currentHarmonicModeClass);
        }
        if (this.currentEnergyClass) {
          this.rootNavBar.classList.remove(this.currentEnergyClass);
        }
        this.rootNavBar.style.removeProperty(
          "--sn-sidebar-current-temporal-shift"
        );
        this.rootNavBar.style.removeProperty(
          "--sn-sidebar-item-bloom-intensity"
        );
        this.rootNavBar.style.removeProperty(
          "--sn-sidebar-energy-glow-opacity"
        );
      }
      super.destroy(); // Unsubscribes from MusicAnalysisService
      if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
        console.log(
          "[SidebarConsciousnessSystem] Destroyed and classes/styles removed."
        );
      }
    }
  }
  // END OF SidebarConsciousnessSystem Class Definition
  // =============================================================================

  // =============================================================================
  // EXISTING CODE WITH ENHANCED INTEGRATION
  // =============================================================================

  // Dynamic color extraction variables
  let currentTrackUri = null;
  let colorExtractionEnabled = true;

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
    console.log("[StarryNight] applyStarryNightSettings CALLED with:", {
      gradientIntensity,
      starDensity,
    });
    const body = document.body;

    // Remove existing StarryNight classes
    console.log(
      "[StarryNight] Body classes BEFORE removal (gradient/star):",
      body.className
    );
    body.classList.remove(
      "sn-gradient-disabled",
      "sn-gradient-minimal",
      "sn-gradient-intense" // Missing balanced, as it's the default (no class)
    );
    body.classList.remove(
      "sn-stars-disabled",
      "sn-stars-minimal",
      "sn-stars-intense" // Missing balanced
    );
    console.log(
      "[StarryNight] Body classes AFTER removal (gradient/star):",
      body.className
    );

    // Apply gradient classes
    if (gradientIntensity !== "balanced") {
      console.log(
        `[StarryNight] ADDING gradient class: sn-gradient-${gradientIntensity}`
      );
      body.classList.add(`sn-gradient-${gradientIntensity}`);
    } else {
      console.log(
        "[StarryNight] Gradient intensity is balanced, no class added."
      );
    }

    // Apply star classes
    if (starDensity !== "balanced") {
      console.log(`[StarryNight] ADDING star class: sn-stars-${starDensity}`);
      body.classList.add(`sn-stars-${starDensity}`);
    } else {
      console.log("[StarryNight] Star density is balanced, no class added.");
    }
    console.log(
      "[StarryNight] Body classes FINAL (gradient/star):",
      body.className
    );

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

    // ADDED: State for Artistic Mode
    const initialArtisticMode = settingsManager.get(
      "sn-artisticMode",
      typeof YEAR3000_CONFIG !== "undefined"
        ? YEAR3000_CONFIG.artisticMode
        : "artist-vision"
    );
    const [artisticMode, setArtisticModeState] =
      Spicetify.React.useState(initialArtisticMode);

    // NEW: Harmonic System States
    const initialHarmonicMode = settingsManager.get("sn-currentHarmonicMode");
    const [currentHarmonicMode, setCurrentHarmonicMode] =
      Spicetify.React.useState(initialHarmonicMode);

    const initialHarmonicIntensity = parseFloat(
      settingsManager.get("sn-harmonicIntensity")
    );
    const [harmonicIntensity, setHarmonicIntensity] = Spicetify.React.useState(
      initialHarmonicIntensity
    );

    const initialHarmonicEvolution =
      settingsManager.get("sn-harmonicEvolution") === "true";
    const [harmonicEvolution, setHarmonicEvolution] = Spicetify.React.useState(
      initialHarmonicEvolution
    );

    // NEW: Manual Harmonic Base Color State
    const initialManualBaseColor = settingsManager.get(
      "sn-harmonicManualBaseColor"
    );
    const [manualBaseColor, setManualBaseColor] = Spicetify.React.useState(
      initialManualBaseColor
    );

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
        console.log(
          `StarryNight: Performance quality set to ${performanceQuality}. (Note: old colorAnalyzer throttle logic removed)`
        );
      } catch (error) {
        console.error(
          "StarryNight: Error applying performance settings:",
          error
        );
      }
    }, [performanceQuality]);

    // ADDED: useEffect for Artistic Mode
    Spicetify.React.useEffect(() => {
      try {
        if (
          typeof YEAR3000_CONFIG !== "undefined" &&
          typeof YEAR3000_CONFIG.setArtisticMode === "function"
        ) {
          YEAR3000_CONFIG.setArtisticMode(artisticMode);
        }
        settingsManager.set("sn-artisticMode", artisticMode);
        if (
          typeof year3000System !== "undefined" &&
          year3000System.setGradientParameters
        ) {
          year3000System.setGradientParameters(document.documentElement);
        }
        // Optional: Force color re-application if artistic mode changes color logic fundamentally
        // if (typeof year3000System !== 'undefined' && year3000System.updateColorsFromCurrentTrack) {
        //   year3000System.updateColorsFromCurrentTrack();
        // }
        console.log(
          `StarryNight: Artistic Mode UI changed to ${artisticMode}, settings applied.`
        );
      } catch (error) {
        console.error(
          "StarryNight: Error applying Artistic Mode from UI:",
          error
        );
      }
    }, [artisticMode]);

    // NEW: useEffect for Harmonic System Settings
    Spicetify.React.useEffect(() => {
      try {
        settingsManager.set("sn-currentHarmonicMode", currentHarmonicMode);
        settingsManager.set(
          "sn-harmonicIntensity",
          harmonicIntensity.toString()
        );
        settingsManager.set(
          "sn-harmonicEvolution",
          harmonicEvolution.toString()
        );

        if (typeof YEAR3000_CONFIG !== "undefined") {
          YEAR3000_CONFIG.currentHarmonicMode = currentHarmonicMode;
          YEAR3000_CONFIG.harmonicIntensity = harmonicIntensity;
          YEAR3000_CONFIG.harmonicEvolution = harmonicEvolution;
        }

        if (
          typeof year3000System !== "undefined" &&
          year3000System.updateColorsFromCurrentTrack
        ) {
          year3000System.updateColorsFromCurrentTrack();
        }

        // Integrate SidebarConsciousnessSystem update
        if (
          year3000System &&
          year3000System.sidebarConsciousnessSystem &&
          year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay
        ) {
          year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay(
            currentHarmonicMode
          );
          if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
            console.log(
              `[StarryNight Section UI] SidebarConsciousnessSystem updated with mode: ${currentHarmonicMode}`
            );
          }
        }

        console.log(
          `StarryNight: Harmonic settings updated - Mode: ${currentHarmonicMode}, Intensity: ${harmonicIntensity}, Evolution: ${harmonicEvolution}`
        );
      } catch (error) {
        console.error(
          "StarryNight: Error applying Harmonic System settings from UI:",
          error
        );
      }
    }, [currentHarmonicMode, harmonicIntensity, harmonicEvolution]);

    // NEW: useEffect for Manual Harmonic Base Color
    Spicetify.React.useEffect(() => {
      try {
        const hexRegex = /^(#?([0-9a-fA-F]{3}){1,2})$/;
        let validatedColor = manualBaseColor.trim();
        let isValid = false;

        if (validatedColor === "") {
          isValid = true;
        } else if (hexRegex.test(validatedColor)) {
          isValid = true;
          if (!validatedColor.startsWith("#")) {
            validatedColor = "#" + validatedColor;
          }
          if (validatedColor.length === 4) {
            // #RGB e.g. #123
            validatedColor = `#${validatedColor[1]}${validatedColor[1]}${validatedColor[2]}${validatedColor[2]}${validatedColor[3]}${validatedColor[3]}`;
          }
        }

        if (isValid) {
          settingsManager.set("sn-harmonicManualBaseColor", validatedColor);
          if (
            typeof year3000System !== "undefined" &&
            year3000System.updateHarmonicBaseColor
          ) {
            year3000System.updateHarmonicBaseColor(validatedColor);
          }
          if (
            YEAR3000_CONFIG.enableDebug ||
            manualBaseColor !== validatedColor
          ) {
            // Log if debug or if value was auto-corrected
            console.log(
              `StarryNight: Manual Harmonic Base Color processing. Input: "${manualBaseColor}", Applied: "${validatedColor}"`
            );
          }
        } else {
          if (YEAR3000_CONFIG.enableDebug) {
            console.warn(
              `StarryNight: Invalid manual base color input: "${manualBaseColor}". Not applied. Previous valid setting remains.`
            );
          }
        }
      } catch (error) {
        console.error(
          "StarryNight: Error applying Manual Harmonic Base Color from UI:",
          error
        );
      }
    }, [manualBaseColor]);

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

        // YEAR 3000: Initialize quantum mouse tracking
        quantumMouseTracker.initialize();

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
      let shootingStarsInterval = null;

      try {
        // Validate and repair settings on initialization (already done by SettingsManager constructor)
        // settingsManager.validateAndRepair();

        // Initialize StarryNight settings
        applyStarryNightSettings(gradientIntensity, starDensity);

        // PHASE 1: Initialize glassmorphism settings
        glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);

        // PHASE 3: Initialize 3D card system
        // card3DManager.initialize(); // This is already called in glassmorphismIntensity effect or end of IIFE
        // card3DManager.apply3DMode(morphing3DMode);

        // quantumMouseTracker.initialize(); // Also called in glassmorphismIntensity effect or end of IIFE

        // Player listeners for color extraction are now handled by the global Year 3000 system
        // The old updateColors function and its listener are removed from this useEffect.

        // Start shooting stars if not disabled
        if (settingsManager.get("sn-starDensity") !== "disabled") {
          setTimeout(() => {
            shootingStarsInterval = startShootingStars();
          }, 2000);
        }

        console.log(
          "StarryNight: Section component effects initialized (color extraction delegated to global Year 3000 system)"
        );
      } catch (error) {
        console.error(
          "StarryNight: Error during Section component initialization:",
          error
        );
      }

      // Cleanup function
      return () => {
        try {
          if (shootingStarsInterval) {
            clearInterval(shootingStarsInterval);
          }
          console.log("StarryNight: Section component cleanup completed");
        } catch (error) {
          console.warn(
            "StarryNight: Error during Section component cleanup:",
            error
          );
        }
      };
      // Dependencies: Include settings that re-trigger this effect if they change how initial setup is done.
      // For now, only fundamental settings that influence non-player-event-driven visuals.
    }, [
      gradientIntensity,
      starDensity,
      glassmorphismIntensity,
      morphing3DMode,
    ]);

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

        // ADDED: Artistic Mode Setting (before 3D Morphing Mode)
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
                "Artistic Mode"
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
                    value: artisticMode,
                    onChange: (event) =>
                      setArtisticModeState(event.target.value),
                  },
                  artisticModeOptions.map((option) =>
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

        // NEW: Chromatic Harmony Weaver Setting
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
                "Chromatic Harmony Mode"
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
                    value: currentHarmonicMode,
                    onChange: (event) =>
                      setCurrentHarmonicMode(event.target.value),
                  },
                  Object.keys(HARMONIC_MODES).map((modeKey) =>
                    Spicetify.React.createElement(
                      "option",
                      { key: modeKey, value: modeKey },
                      HARMONIC_MODES[modeKey].description // Show poetic description
                    )
                  )
                ),
              ]),
            ]
          ),
        ]),

        // NEW: Harmonic Intensity Setting
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
                  htmlFor: "sn-harmonic-intensity-slider",
                },
                `Harmonic Intensity: ${harmonicIntensity.toFixed(2)}`
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("input", {
                type: "range",
                id: "sn-harmonic-intensity-slider",
                className: "x-settings-slider sn-slider", // Add a class for styling
                min: "0",
                max: "1",
                step: "0.05",
                value: harmonicIntensity,
                onChange: (event) =>
                  setHarmonicIntensity(parseFloat(event.target.value)),
              }),
            ]
          ),
        ]),

        // NEW: Harmonic Evolution Toggle
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
                  htmlFor: "sn-harmonic-evolution-toggle",
                },
                "Evolve Harmonies with Music"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" }, // Consider specific styling for toggles
            [
              Spicetify.React.createElement("input", {
                type: "checkbox",
                id: "sn-harmonic-evolution-toggle",
                className: "x-settings-checkbox sn-toggle", // Add a class for styling
                checked: harmonicEvolution,
                onChange: (event) => setHarmonicEvolution(event.target.checked),
              }),
            ]
          ),
        ]),

        // NEW: Manual Harmonic Base Color Input
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
                  htmlFor: "sn-manual-base-color-input",
                },
                "Harmonic Base Color Seed (Hex, empty for auto)"
              ),
            ]
          ),
          Spicetify.React.createElement(
            "div",
            { className: "x-settings-secondColumn" },
            [
              Spicetify.React.createElement("input", {
                type: "text",
                id: "sn-manual-base-color-input",
                className: "x-settings-input sn-text-input",
                placeholder: "#RRGGBB or RRGGBB",
                value: manualBaseColor,
                onChange: (event) => setManualBaseColor(event.target.value),
              }),
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

  // === YEAR 3000 SYSTEM INITIALIZATION ===
  // Main initialization function
  async function main() {
    try {
      console.log("🌟 [StarryNight] Starting YEAR 3000 main initialization...");

      // Initialize the year3000System which includes all core systems
      if (
        year3000System &&
        typeof year3000System.initializeAllSystems === "function"
      ) {
        await year3000System.initializeAllSystems();
        console.log(
          "🌟 [StarryNight] year3000System.initializeAllSystems() completed successfully"
        );
      } else {
        console.error(
          "🔥 [StarryNight] year3000System.initializeAllSystems not available!"
        );
      }

      // Set up music analysis and color extraction
      if (
        year3000System &&
        year3000System.setupMusicAnalysisAndColorExtraction
      ) {
        year3000System.setupMusicAnalysisAndColorExtraction();
        console.log(
          "🌟 [StarryNight] Music analysis and color extraction set up"
        );
      }

      console.log(
        "🌟 [StarryNight] YEAR 3000 main initialization completed successfully!"
      );
    } catch (error) {
      console.error(
        "🔥 [StarryNight] Error during main initialization:",
        error
      );
    }
  }

  // Start the main initialization
  main();
})();
