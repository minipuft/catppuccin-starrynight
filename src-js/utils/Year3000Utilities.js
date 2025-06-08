import { YEAR3000_CONFIG } from "../config/globalConfig.js"; // MODIFIED: Import real config

export const Year3000Utilities = {
  _cachedRootStyle: null,
  _rootElement: null,

  // Centralized getRootStyle
  getRootStyle() {
    if (!this._rootElement) {
      this._rootElement = document.documentElement;
    }
    // Remove caching of computed style as this function should return the element for setting styles
    return this._rootElement;
  },

  // Centralized throttle function
  throttle(func, limit) {
    let inThrottle;
    return function throttled(...args) {
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

    let r_val, g_val, b_val;
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
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  },

  calculateContrastRatio(color1, color2) {
    const getLuminance = (rgb) => {
      const [r_val, g_val, b_val] = [rgb.r, rgb.g, rgb.b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r_val + 0.7152 * g_val + 0.0722 * b_val;
    };

    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  lerpSmooth(current, target, deltaTime, halfLife) {
    const EPSILON = 0.00001;
    if (halfLife <= EPSILON || deltaTime <= 0) {
      if (YEAR3000_CONFIG && YEAR3000_CONFIG.enableDebug) {
        if (halfLife <= EPSILON) {
          // console.warn(
          //   "[StarryNight lerpSmooth] halfLife is near zero or negative. Snapping to target. halfLife:",
          //   halfLife
          // );
        }
      }
      return target;
    }
    const result =
      target + (current - target) * Math.pow(2, -deltaTime / halfLife);
    return result;
  },

  // NEW: BPM and timing utility methods (inspired by Cat Jam extension)

  /**
   * Convert BPM to milliseconds between beats
   * @param {number} bpm - Beats per minute
   * @returns {number} Milliseconds between beats
   */
  bpmToInterval(bpm) {
    if (!bpm || bpm <= 0) return 500; // Default to 120 BPM (500ms interval)
    return 60000 / bpm;
  },

  /**
   * Convert interval to BPM
   * @param {number} intervalMs - Milliseconds between beats
   * @returns {number} Beats per minute
   */
  intervalToBpm(intervalMs) {
    if (!intervalMs || intervalMs <= 0) return 120; // Default BPM
    return 60000 / intervalMs;
  },

  /**
   * Calculate optimal animation frame rate for given BPM
   * @param {number} bpm - Beats per minute
   * @param {number} framesPerBeat - Desired animation frames per beat (default: 4)
   * @returns {number} Milliseconds between animation frames
   */
  bpmToAnimationFrameRate(bpm, framesPerBeat = 4) {
    const beatInterval = this.bpmToInterval(bpm);
    return beatInterval / framesPerBeat;
  },

  /**
   * Check if current time is on a beat boundary (within tolerance)
   * @param {number} currentTime - Current timestamp in milliseconds
   * @param {number} trackStartTime - Track start timestamp
   * @param {number} bpm - Beats per minute
   * @param {number} tolerance - Tolerance in milliseconds (default: 50ms)
   * @returns {boolean} True if current time is close to a beat
   */
  isOnBeat(currentTime, trackStartTime, bpm, tolerance = 50) {
    const beatInterval = this.bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatPosition = timeSinceStart % beatInterval;

    // Check if we're close to a beat (start or end of interval)
    return (
      beatPosition <= tolerance || beatPosition >= beatInterval - tolerance
    );
  },

  /**
   * Calculate beat phase (0-1) within current beat interval
   * @param {number} currentTime - Current timestamp in milliseconds
   * @param {number} trackStartTime - Track start timestamp
   * @param {number} bpm - Beats per minute
   * @returns {number} Phase within beat (0-1, where 0 = beat start, 1 = next beat)
   */
  getBeatPhase(currentTime, trackStartTime, bpm) {
    const beatInterval = this.bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatPosition = timeSinceStart % beatInterval;
    return beatPosition / beatInterval;
  },

  /**
   * Calculate next beat time
   * @param {number} currentTime - Current timestamp in milliseconds
   * @param {number} trackStartTime - Track start timestamp
   * @param {number} bpm - Beats per minute
   * @returns {number} Timestamp of next beat
   */
  getNextBeatTime(currentTime, trackStartTime, bpm) {
    const beatInterval = this.bpmToInterval(bpm);
    const timeSinceStart = currentTime - trackStartTime;
    const beatsSinceStart = Math.floor(timeSinceStart / beatInterval);
    return trackStartTime + (beatsSinceStart + 1) * beatInterval;
  },

  /**
   * Synchronize animation to BPM with easing functions
   * @param {number} beatPhase - Current beat phase (0-1)
   * @param {string} easingType - Type of easing ("linear", "ease-in", "ease-out", "bounce")
   * @returns {number} Eased value (0-1)
   */
  easeBeatAnimation(beatPhase, easingType = "ease-out") {
    switch (easingType) {
      case "ease-in":
        return beatPhase * beatPhase;
      case "ease-out":
        return 1 - Math.pow(1 - beatPhase, 2);
      case "bounce":
        // Simple bounce effect - peaks at 0.25 and 0.75
        return (
          Math.abs(Math.sin(beatPhase * Math.PI * 2)) *
          (1 - Math.abs(beatPhase - 0.5) * 2)
        );
      case "pulse":
        // Sharp pulse at beat start, fades quickly
        return Math.max(0, 1 - beatPhase * 4);
      case "linear":
      default:
        return beatPhase;
    }
  },

  /**
   * Calculate current rhythm phase for breathing animations
   * @param {number} currentTime - Current timestamp in milliseconds
   * @param {number} animationSpeedFactor - Speed multiplier from music analysis (default: 1)
   * @returns {number} Rhythm phase in radians (0 to 2π)
   */
  calculateRhythmPhase(currentTime, animationSpeedFactor = 1) {
    return (
      ((currentTime / 1000) * animationSpeedFactor * Math.PI) % (Math.PI * 2)
    );
  },

  /**
   * Calculate breathing scale based on rhythm phase and energy
   * @param {number} rhythmPhase - Current rhythm phase (0 to 2π)
   * @param {number} processedEnergy - Music energy (0-1) from music analysis
   * @returns {number} Breathing scale factor (0.97-1.02)
   */
  calculateBreathingScale(rhythmPhase, processedEnergy = 0.5) {
    const baseBreathing = 0.99; // Base scale for subtle breathing
    const energyInfluence = 0.01 + processedEnergy * 0.02; // Energy affects amplitude
    const breathingIntensity =
      baseBreathing + Math.sin(rhythmPhase) * energyInfluence;

    // Clamp to safe range to prevent jarring visual effects
    return Math.max(0.97, Math.min(1.02, breathingIntensity));
  },

  /**
   * Calculate navigation item transform scale based on music analysis
   * @param {number} visualIntensity - Visual intensity from music analysis (0-1)
   * @param {string} moodIdentifier - Mood from music analysis ("energetic_happy", "danceable", etc.)
   * @returns {number} Transform scale factor (1.0-1.03)
   */
  calculateNavigationScale(visualIntensity = 0.5, moodIdentifier = "neutral") {
    let navItemTransformScale = 1 + visualIntensity * 0.025;

    // Add bonus scaling for energetic moods
    if (
      moodIdentifier === "energetic_happy" ||
      moodIdentifier === "danceable"
    ) {
      navItemTransformScale += 0.005;
    }

    // Clamp to safe range (1.0 to 1.03)
    return Math.max(1.0, Math.min(1.03, navItemTransformScale));
  },

  rgbToOklab(r_srgb, g_srgb, b_srgb) {
    const r = r_srgb / 255.0;
    const g = g_srgb / 255.0;
    const b = b_srgb / 255.0;

    const r_lin = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const g_lin = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const b_lin = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    const l_cone =
      0.4122214708 * r_lin + 0.5363325363 * g_lin + 0.0514459929 * b_lin;
    const m_cone =
      0.2119034982 * r_lin + 0.6806995451 * g_lin + 0.1073969566 * b_lin;
    const s_cone =
      0.0883024619 * r_lin + 0.2817188376 * g_lin + 0.6299787005 * b_lin;

    const l_ = Math.cbrt(l_cone);
    const m_ = Math.cbrt(m_cone);
    const s_ = Math.cbrt(s_cone);

    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b_oklab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

    return { L: L, a: a, b: b_oklab };
  },

  oklabToRgb(L, a, b_oklab) {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b_oklab;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b_oklab;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b_oklab;

    const l_cone = l_ * l_ * l_;
    const m_cone = m_ * m_ * m_;
    const s_cone = s_ * s_ * s_;

    const r_lin =
      3.2409699419 * l_cone - 1.5373831776 * m_cone - 0.4986107603 * s_cone;
    const g_lin =
      -0.9692436363 * l_cone + 1.8759675015 * m_cone + 0.0415550574 * s_cone;
    const b_lin =
      0.0556300797 * l_cone - 0.2039769589 * m_cone + 1.0569715142 * s_cone;

    const r_srgb =
      r_lin <= 0.0031308
        ? 12.92 * r_lin
        : 1.055 * Math.pow(r_lin, 1 / 2.4) - 0.055;
    const g_srgb =
      g_lin <= 0.0031308
        ? 12.92 * g_lin
        : 1.055 * Math.pow(g_lin, 1 / 2.4) - 0.055;
    const b_srgb =
      b_lin <= 0.0031308
        ? 12.92 * b_lin
        : 1.055 * Math.pow(b_lin, 1 / 2.4) - 0.055;

    return {
      r: Math.max(0, Math.min(255, Math.round(r_srgb * 255))),
      g: Math.max(0, Math.min(255, Math.round(g_srgb * 255))),
      b: Math.max(0, Math.min(255, Math.round(b_srgb * 255))),
    };
  },

  // PHASE 2.1 - Implement initial OKLab color processing function.
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

  pseudoRandom: function (seed) {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  },

  // === Phase 6: Global Health Monitor & Debug System Initialization ===

  initializeHealthMonitoring() {
    if (!this.systemHealthMonitor) {
      this.systemHealthMonitor = new SystemHealthMonitor();
    }

    if (!this.unifiedDebug) {
      this.unifiedDebug = new Year3000UnifiedDebug(this.systemHealthMonitor);
    }

    // Make available globally for debugging
    if (typeof window !== "undefined") {
      window.Year3000SystemHealth = this.systemHealthMonitor;
      window.Year3000Debug = this.unifiedDebug;

      console.log("🔧 Phase 6: System Health Monitoring initialized");
      console.log(
        "🔍 Available globally: window.Year3000SystemHealth, window.Year3000Debug"
      );
    }

    return {
      healthMonitor: this.systemHealthMonitor,
      debug: this.unifiedDebug,
    };
  },

  getHealthMonitor() {
    if (!this.systemHealthMonitor) {
      return this.initializeHealthMonitoring().healthMonitor;
    }
    return this.systemHealthMonitor;
  },

  getUnifiedDebug() {
    if (!this.unifiedDebug) {
      return this.initializeHealthMonitoring().debug;
    }
    return this.unifiedDebug;
  },

  // === End Phase 6 Global Initialization ===
};

// === Phase 6: System Integration & Performance Optimization ===

export class SystemHealthMonitor {
  constructor() {
    this.systemMetrics = new Map();
    this.performanceBudget = {
      maxAnimationComplexity: 100,
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      maxCPUUsage: 30, // 30% threshold
      maxFrameDrops: 5, // per second
    };
    this.lastCleanupTime = Date.now();
    this.cleanupInterval = 60000; // 1 minute
    this.isMonitoringEnabled = true;
  }

  registerSystem(systemName, system) {
    this.systemMetrics.set(systemName, {
      system: system,
      lastUpdate: Date.now(),
      performanceData: {
        frameCount: 0,
        averageFrameTime: 0,
        memoryUsage: 0,
        errorCount: 0,
        animationComplexity: 0,
      },
      healthStatus: "healthy",
    });
  }

  updateSystemMetrics(systemName, metrics) {
    const systemData = this.systemMetrics.get(systemName);
    if (systemData) {
      systemData.lastUpdate = Date.now();
      Object.assign(systemData.performanceData, metrics);
      systemData.healthStatus = this.calculateHealthStatus(
        systemData.performanceData
      );
    }
  }

  calculateHealthStatus(performanceData) {
    if (performanceData.errorCount > 10) return "critical";
    if (
      performanceData.memoryUsage >
      this.performanceBudget.maxMemoryUsage * 0.8
    )
      return "warning";
    if (
      performanceData.animationComplexity >
      this.performanceBudget.maxAnimationComplexity * 0.9
    )
      return "warning";
    return "healthy";
  }

  shouldThrottleAnimations() {
    let totalComplexity = 0;
    for (const [name, data] of this.systemMetrics) {
      totalComplexity += data.performanceData.animationComplexity || 0;
    }
    return totalComplexity > this.performanceBudget.maxAnimationComplexity;
  }

  performAutomaticCleanup() {
    const now = Date.now();
    if (now - this.lastCleanupTime > this.cleanupInterval) {
      for (const [name, data] of this.systemMetrics) {
        if (data.system && typeof data.system.performCleanup === "function") {
          data.system.performCleanup();
        }
      }
      this.lastCleanupTime = now;
      return true;
    }
    return false;
  }

  getAllSystemsReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overallHealth: "healthy",
      performanceBudget: this.performanceBudget,
      systems: {},
    };

    let hasWarnings = false;
    let hasCritical = false;

    for (const [name, data] of this.systemMetrics) {
      report.systems[name] = {
        healthStatus: data.healthStatus,
        lastUpdate: new Date(data.lastUpdate).toISOString(),
        timeSinceUpdate: Date.now() - data.lastUpdate,
        performanceData: { ...data.performanceData },
      };

      if (data.healthStatus === "warning") hasWarnings = true;
      if (data.healthStatus === "critical") hasCritical = true;
    }

    report.overallHealth = hasCritical
      ? "critical"
      : hasWarnings
      ? "warning"
      : "healthy";
    return report;
  }

  getOptimizationRecommendations() {
    const recommendations = [];

    if (this.shouldThrottleAnimations()) {
      recommendations.push(
        "Reduce animation complexity - total complexity exceeds budget"
      );
    }

    for (const [name, data] of this.systemMetrics) {
      if (data.performanceData.errorCount > 5) {
        recommendations.push(
          `${name}: High error count (${data.performanceData.errorCount})`
        );
      }
      if (
        data.performanceData.memoryUsage >
        this.performanceBudget.maxMemoryUsage * 0.7
      ) {
        recommendations.push(
          `${name}: High memory usage (${Math.round(
            data.performanceData.memoryUsage / 1024 / 1024
          )}MB)`
        );
      }
    }

    return recommendations;
  }
}

export class Year3000UnifiedDebug {
  constructor(systemHealthMonitor) {
    this.healthMonitor = systemHealthMonitor;
    this.debugHistory = [];
    this.maxHistorySize = 100;
  }

  getAllSystemsReport() {
    const report = this.healthMonitor.getAllSystemsReport();
    const recommendations = this.healthMonitor.getOptimizationRecommendations();

    const unifiedReport = {
      timestamp: report.timestamp,
      overallHealth: report.overallHealth,
      systems: report.systems,
      recommendations: recommendations,
      performance: {
        shouldThrottleAnimations: this.healthMonitor.shouldThrottleAnimations(),
        totalSystems: Object.keys(report.systems).length,
        healthySystems: Object.values(report.systems).filter(
          (s) => s.healthStatus === "healthy"
        ).length,
        warningSystems: Object.values(report.systems).filter(
          (s) => s.healthStatus === "warning"
        ).length,
        criticalSystems: Object.values(report.systems).filter(
          (s) => s.healthStatus === "critical"
        ).length,
      },
      integration: this.getIntegrationStatus(),
    };

    this.addToHistory(unifiedReport);
    return unifiedReport;
  }

  getIntegrationStatus() {
    const systems = this.healthMonitor.systemMetrics;
    const integrationStatus = {
      crossSystemCommunication: "healthy",
      dataFlowIntegrity: "healthy",
      memoryEfficiency: "healthy",
      animationSynchronization: "healthy",
    };

    // Check for systems that haven't updated recently
    const now = Date.now();
    for (const [name, data] of systems) {
      if (now - data.lastUpdate > 30000) {
        // 30 seconds
        integrationStatus.crossSystemCommunication = "warning";
      }
    }

    // Check memory usage across systems
    let totalMemory = 0;
    for (const [name, data] of systems) {
      totalMemory += data.performanceData.memoryUsage || 0;
    }

    if (totalMemory > 100 * 1024 * 1024) {
      // 100MB
      integrationStatus.memoryEfficiency = "critical";
    } else if (totalMemory > 75 * 1024 * 1024) {
      // 75MB
      integrationStatus.memoryEfficiency = "warning";
    }

    return integrationStatus;
  }

  addToHistory(report) {
    this.debugHistory.push({
      timestamp: Date.now(),
      report: JSON.parse(JSON.stringify(report)), // Deep clone
    });

    // Limit history size
    if (this.debugHistory.length > this.maxHistorySize) {
      this.debugHistory.shift();
    }
  }

  getPerformanceTrends() {
    if (this.debugHistory.length < 2) {
      return { error: "Insufficient data for trend analysis" };
    }

    const recent = this.debugHistory.slice(-10); // Last 10 reports
    const trends = {};

    for (const systemName of Object.keys(recent[0].report.systems)) {
      const systemTrend = {
        healthTrend: "stable",
        memoryTrend: "stable",
        errorTrend: "stable",
      };

      // Analyze health trend
      const healthHistory = recent.map(
        (r) => r.report.systems[systemName]?.healthStatus
      );
      if (healthHistory.includes("critical"))
        systemTrend.healthTrend = "degrading";
      else if (healthHistory.includes("warning"))
        systemTrend.healthTrend = "concerning";

      trends[systemName] = systemTrend;
    }

    return trends;
  }

  runIntegrationTest() {
    console.log("🧪 Running Year 3000 Integration Test...");

    const results = {
      passed: true,
      tests: {},
      summary: "",
    };

    // Test 1: All systems registered
    const registeredSystems = Array.from(
      this.healthMonitor.systemMetrics.keys()
    );
    const expectedSystems = [
      "BeatSyncVisualSystem",
      "DimensionalNexusSystem",
      "DataGlyphSystem",
    ];

    results.tests.systemRegistration = {
      passed: expectedSystems.every((sys) => registeredSystems.includes(sys)),
      expected: expectedSystems,
      actual: registeredSystems,
    };

    // Test 2: CSS variables are set
    const root = document.documentElement;
    const criticalVariables = [
      "--sn-breathing-scale",
      "--sn-rhythm-phase",
      "--sn-nav-item-transform-scale",
      "--sn-sidebar-meditation-desaturation",
    ];

    results.tests.cssVariables = {
      passed: true,
      variables: {},
    };

    for (const variable of criticalVariables) {
      const value = getComputedStyle(root).getPropertyValue(variable);
      results.tests.cssVariables.variables[variable] = value || "NOT_SET";
      if (!value) {
        results.tests.cssVariables.passed = false;
        results.passed = false;
      }
    }

    // Test 3: Performance within budget
    const systemsReport = this.getAllSystemsReport();
    results.tests.performance = {
      passed: systemsReport.overallHealth !== "critical",
      overallHealth: systemsReport.overallHealth,
      throttlingNeeded: systemsReport.performance.shouldThrottleAnimations,
    };

    if (systemsReport.overallHealth === "critical") {
      results.passed = false;
    }

    // Generate summary
    const passedTests = Object.values(results.tests).filter(
      (t) => t.passed
    ).length;
    const totalTests = Object.keys(results.tests).length;
    results.summary = `${passedTests}/${totalTests} tests passed. Overall: ${
      results.passed ? "PASS" : "FAIL"
    }`;

    console.log("🧪 Integration Test Results:", results);
    return results;
  }
}

// === End Phase 6 Implementation ===
