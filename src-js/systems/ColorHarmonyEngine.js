import { YEAR3000_CONFIG } from "../config/globalConfig.js";
import { Year3000Utilities } from "../utils/Year3000Utilities.js";

// =============================================================================
// YEAR 3000 COLOR HARMONY ENGINE - Enhanced Vibrancy Edition
// =============================================================================

export class ColorHarmonyEngine {
  constructor(
    config,
    utils,
    performanceMonitor,
    musicAnalysisService,
    settingsManager
  ) {
    this.config = config || YEAR3000_CONFIG;
    this.utils = utils || Year3000Utilities;
    this.performanceMonitor = performanceMonitor;
    this.musicAnalysisService = musicAnalysisService;
    this.settingsManager = settingsManager;
    this.systemName = "ColorHarmonyEngine";

    this.currentTheme = this.detectCurrentTheme();
    this.harmonyMetrics = {
      totalHarmonyCalculations: 0,
      musicInfluencedAdjustments: 0,
      temporalMemoryEvents: 0,
    };

    // 🌌 Year 3000 Quantum Empathy - Musical Memory System
    this.musicalMemory = {
      recentTracks: [],
      userColorPreferences: new Map(),
      energyHistory: [],
      maxMemorySize: 50,
    };

    // 🌊 Kinetic State for Visual Transformations
    this.kineticState = {
      currentPulse: 0,
      breathingPhase: 0,
      lastBeatTime: 0,
      visualMomentum: 0,
    };

    // Subscribe to music updates for real-time harmony
    if (this.musicAnalysisService) {
      this.musicAnalysisService.subscribe(this, this.systemName);
      if (this.config.enableDebug) {
        console.log(
          "🎨 [ColorHarmonyEngine] Subscribed to music analysis for Aesthetic Gravity"
        );
      }
    }

    if (this.config.enableDebug) {
      console.log(
        "🎨 [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy"
      );
    }

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
        // YEAR3000_CONFIG is not in scope here, this might be an issue.
        // However, the original theme.js had this.vibrancyConfig.getBlendRatio directly called
        // or YEAR3000_CONFIG.artisticMode passed in.
        // For now, keeping original structure assuming direct call or parameter passing.
        return ratios[artisticMode] || this.defaultBlendRatio;
      },

      // Note: getMusicIntensityMultiplier moved to class method for proper context access
    };
  }

  detectCurrentTheme() {
    const rootElement = this.utils.getRootStyle();
    if (!rootElement) {
      console.warn(
        "[ColorHarmonyEngine detectCurrentTheme] Root element not found. Defaulting to mocha."
      );
      return "mocha";
    }
    const computedRootStyle = getComputedStyle(rootElement);
    const baseColorHex = computedRootStyle
      .getPropertyValue("--spice-main")
      .trim();

    // Normalize to uppercase and remove # if present for map lookup
    const normalizedBaseColor = baseColorHex.startsWith("#")
      ? baseColorHex.substring(1).toUpperCase()
      : baseColorHex.toUpperCase();

    const themeMap = {
      303446: "frappe", // Mocha's base is 1E1E2E, Frappe's is 303446
      EFF1F5: "latte",
      "24273A": "macchiato",
      "1E1E2E": "mocha",
    };

    return themeMap[normalizedBaseColor] || "mocha"; // Default to mocha if not found
  }

  // 🎵 Music-Driven Intensity Scaling
  getMusicIntensityMultiplier(energy = 0.5, valence = 0.5) {
    const baseMultiplier = this.config.getCurrentMultipliers().musicEnergyBoost;
    const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1.0 : 0.8;
    const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1.0;
    return baseMultiplier * energyBoost * valenceBoost;
  }

  validateColorHarmony(color, context = "general") {
    const startTime = performance.now();
    this.harmonyMetrics.totalHarmonyCalculations++;

    const contextRequirements = {
      general: {
        minContrast: 1.8,
        minHarmony: this.vibrancyConfig.harmonyTolerance,
      },
      search: {
        minContrast: 2.8,
        minHarmony: 0.4,
      },
      navigation: {
        minContrast: 2.5,
        minHarmony: 0.45,
      },
      text: {
        minContrast: 4.5,
        minHarmony: 0.6,
      },
      accent: {
        minContrast: 1.5,
        minHarmony: 0.3,
      },
    };

    const requirements =
      contextRequirements[context] || contextRequirements.general;
    const currentPalette = this.catppuccinPalettes[this.currentTheme];
    if (
      !currentPalette ||
      !currentPalette.neutrals ||
      !currentPalette.neutrals.base
    ) {
      console.error(
        "StarryNight Error: Catppuccin palette or base neutral not found for theme:",
        this.currentTheme,
        currentPalette
      );
      return { valid: false, error: "Palette configuration error." };
    }
    const backgroundColor = currentPalette.neutrals.base;

    const contrastRatio = Year3000Utilities.calculateContrastRatio(
      color,
      backgroundColor
    );
    const harmonyScore = this.calculateHarmonyScore(color, currentPalette);

    const currentMode = this.config.artisticMode;
    let adjustedRequirements = { ...requirements };

    if (currentMode === "cosmic-maximum") {
      adjustedRequirements.minContrast *= 0.7;
      adjustedRequirements.minHarmony *= 0.6;
    } else if (currentMode === "artist-vision") {
      adjustedRequirements.minContrast *= 0.85;
      adjustedRequirements.minHarmony *= 0.8;
    }

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

      const harmoniousAngles = [
        0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
      ];
      const isHarmonious = harmoniousAngles.some(
        (angle) => Math.abs(normalizedHueDiff - angle) < 20
      );

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

        const harmonyScore = 1 - normalizedHueDiff / 180;
        const saturationBonus = (accentHsl.s / 100) * 0.3;
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

    // Fallback accent if none found (should be rare)
    const fallbackAccentName = "mauve";
    const fallbackAccentHex =
      palette.accents[fallbackAccentName] || Object.values(palette.accents)[0]; // First accent if mauve not found
    const fallbackAccentRgb = Year3000Utilities.hexToRgb(fallbackAccentHex);

    return (
      bestAccent || {
        name: fallbackAccentName,
        hex: fallbackAccentHex,
        rgb: fallbackAccentRgb,
      }
    );
  }

  blendColors(rgb1, rgb2, ratio = this.vibrancyConfig.defaultBlendRatio) {
    const hsl1 = Year3000Utilities.rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
    const hsl2 = Year3000Utilities.rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

    const artisticMode = this.config.artisticMode;
    // Use `this.vibrancyConfig.getBlendRatio` if `this` context is correct,
    // or pass artisticMode if it's a static-like call pattern.
    // Assuming `this.vibrancyConfig.getBlendRatio` is intended to be called on the instance.
    const dynamicRatio = this.vibrancyConfig.getBlendRatio(artisticMode);

    const blendedHsl = {
      h: hsl1.h * dynamicRatio + hsl2.h * (1 - dynamicRatio),
      s: Math.max(
        hsl1.s * dynamicRatio + hsl2.s * (1 - dynamicRatio),
        this.vibrancyConfig.minimumSaturation * 100
      ),
      l: hsl1.l * dynamicRatio + hsl2.l * (1 - dynamicRatio),
    };

    // Apply artistic saturation boost
    blendedHsl.s = Math.min(
      100,
      blendedHsl.s * this.vibrancyConfig.artisticSaturationBoost
    );

    if (artisticMode !== "corporate-safe") {
      blendedHsl.l = Math.min(
        95, // Capping luminance to prevent pure white
        blendedHsl.l * this.vibrancyConfig.cosmicLuminanceBoost
      );
    }

    if (this.config.enableCosmicSync && globalThis.currentMusicAnalysis) {
      // Use globalThis for currentMusicAnalysis
      const musicBoost = this.getMusicIntensityMultiplier(
        globalThis.currentMusicAnalysis.energy || 0.5,
        globalThis.currentMusicAnalysis.valence || 0.5
      );
      blendedHsl.s = Math.min(100, blendedHsl.s * (1 + (musicBoost - 1) * 0.3));
    }

    const blendedRgb = Year3000Utilities.hslToRgb(
      blendedHsl.h,
      blendedHsl.s,
      blendedHsl.l
    );
    return Year3000Utilities.rgbToHex(blendedRgb.r, blendedRgb.g, blendedRgb.b);
  }

  blendWithCatppuccin(extractedColors, musicContext = null) {
    const startTime = performance.now();
    this.harmonyMetrics.blends++;

    const currentPalette = this.catppuccinPalettes[this.currentTheme];
    if (!currentPalette) {
      console.error(
        "StarryNight Error: Catppuccin palette not found for theme:",
        this.currentTheme
      );
      return extractedColors; // Return original colors if palette is missing
    }
    const harmonizedColors = {};

    Object.entries(extractedColors).forEach(([role, color]) => {
      if (!color) return;

      const extractedRgb = Year3000Utilities.hexToRgb(color);
      if (!extractedRgb) {
        harmonizedColors[role] = color; // Keep original if unparsable
        return;
      }

      const bestAccent = this.findBestHarmoniousAccent(
        extractedRgb,
        currentPalette
      );

      // Check if bestAccent or bestAccent.rgb is null (which can happen if findBestHarmoniousAccent's fallback fails)
      if (!bestAccent || !bestAccent.rgb) {
        console.warn(
          "StarryNight Warning: Could not find a best harmonious accent or its RGB value. Defaulting to extracted color for role:",
          role
        );
        harmonizedColors[role] = color; // Use original extracted color as a safe fallback
        return;
      }

      let blendRatio = this.vibrancyConfig.defaultBlendRatio; // Use instance's defaultBlendRatio
      if (musicContext) {
        if (musicContext.energy > 0.7) blendRatio = 0.9;
        if (musicContext.valence > 0.6) blendRatio += 0.05;
        blendRatio = Math.min(1, Math.max(0, blendRatio)); // Clamp ratio
      }

      harmonizedColors[role] = this.blendColors(
        extractedRgb,
        bestAccent.rgb, // Ensure bestAccent.rgb is valid
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
      totalHarmonyCalculations: this.harmonyMetrics.totalHarmonyCalculations,
      musicInfluencedAdjustments:
        this.harmonyMetrics.musicInfluencedAdjustments,
      temporalMemoryEvents: this.harmonyMetrics.temporalMemoryEvents,
      blends: this.harmonyMetrics.blends,
      averageProcessingTime: Math.round(avgTime * 100) / 100,
      // vibrancyConfig: this.vibrancyConfig, // Consider if this much detail is needed in report
    };
  }

  // 🌟 Year 3000 Method: Receive live music updates
  updateFromMusicAnalysis(processedMusicData, rawFeatures, trackUri) {
    if (!processedMusicData) return;

    try {
      // 🎵 Update Musical Memory (Temporal Play)
      this._updateMusicalMemory(processedMusicData, trackUri);

      // 🌊 Update Kinetic State (Kinetic Verbs)
      this._updateKineticState(processedMusicData);

      // 🎨 Apply Aesthetic Gravity transformations
      this._applyAestheticGravity(processedMusicData);

      this.harmonyMetrics.musicInfluencedAdjustments++;

      if (this.config.enableDebug && Math.random() < 0.1) {
        console.log("🎨 [ColorHarmonyEngine] Cosmic harmony update:", {
          energy: processedMusicData.energy?.toFixed(2),
          valence: processedMusicData.valence?.toFixed(2),
          pulse: this.kineticState.currentPulse.toFixed(2),
          momentum: this.kineticState.visualMomentum.toFixed(2),
        });
      }
    } catch (error) {
      console.error(
        "🌌 [ColorHarmonyEngine] Error in cosmic harmony update:",
        error
      );
    }
  }

  // 🧠 Quantum Empathy: Learn from musical patterns
  _updateMusicalMemory(musicData, trackUri) {
    // Store recent track data for temporal analysis
    this.musicalMemory.recentTracks.unshift({
      uri: trackUri,
      energy: musicData.energy,
      valence: musicData.valence,
      enhancedBPM: musicData.enhancedBPM,
      timestamp: Date.now(),
    });

    // Maintain memory size
    if (
      this.musicalMemory.recentTracks.length > this.musicalMemory.maxMemorySize
    ) {
      this.musicalMemory.recentTracks.pop();
    }

    // Update energy history for momentum calculations
    this.musicalMemory.energyHistory.unshift(musicData.energy || 0.5);
    if (this.musicalMemory.energyHistory.length > 10) {
      this.musicalMemory.energyHistory.pop();
    }

    this.harmonyMetrics.temporalMemoryEvents++;
  }

  // 🌊 Kinetic Verbs: Update visual motion state
  _updateKineticState(musicData) {
    const now = Date.now();
    const energy = musicData.energy || 0.5;
    const enhancedBPM = musicData.enhancedBPM || 120;

    // Calculate pulse based on BPM
    const beatInterval = 60000 / enhancedBPM; // ms per beat
    const timeSinceLastBeat =
      (now - this.kineticState.lastBeatTime) % beatInterval;
    this.kineticState.currentPulse = Math.sin(
      (timeSinceLastBeat / beatInterval) * Math.PI * 2
    );

    // Update breathing phase (slower than beat)
    this.kineticState.breathingPhase += 0.02 * energy;
    if (this.kineticState.breathingPhase > Math.PI * 2) {
      this.kineticState.breathingPhase -= Math.PI * 2;
    }

    // Calculate visual momentum from energy history
    if (this.musicalMemory.energyHistory.length > 1) {
      const energyDelta =
        this.musicalMemory.energyHistory[0] -
        this.musicalMemory.energyHistory[1];
      this.kineticState.visualMomentum = Math.max(
        0,
        Math.min(1, this.kineticState.visualMomentum * 0.9 + energyDelta * 0.5)
      );
    }

    // Update beat tracking
    if (timeSinceLastBeat < 100) {
      // Near a beat
      this.kineticState.lastBeatTime = now;
    }
  }

  // 🎨 Aesthetic Gravity: Apply real-time color transformations
  _applyAestheticGravity(musicData) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const energy = musicData.energy || 0.5;
    const valence = musicData.valence || 0.5;

    // 🌊 Breathing opacity based on energy
    const breathingIntensity =
      0.5 + Math.sin(this.kineticState.breathingPhase) * 0.3 * energy;
    const currentOpacity = parseFloat(
      getComputedStyle(root).getPropertyValue("--sn-gradient-opacity") || "0.3"
    );
    const targetOpacity = currentOpacity * breathingIntensity;

    root.style.setProperty("--sn-kinetic-opacity", targetOpacity.toFixed(3));

    // 🌈 Pulse saturation with beat
    const pulseIntensity = 1.0 + this.kineticState.currentPulse * 0.2 * energy;
    const currentSaturation = parseFloat(
      getComputedStyle(root).getPropertyValue("--sn-gradient-saturation") ||
        "1.0"
    );
    const targetSaturation = currentSaturation * pulseIntensity;

    root.style.setProperty(
      "--sn-kinetic-saturation",
      targetSaturation.toFixed(3)
    );

    // 🌟 Momentum-based blur
    const momentumBlur = 30 + this.kineticState.visualMomentum * 20;
    root.style.setProperty("--sn-kinetic-blur", `${momentumBlur.toFixed(1)}px`);

    // 🎭 Valence-based hue shift
    const hueShift = (valence - 0.5) * 20; // ±10 degree shift
    root.style.setProperty(
      "--sn-kinetic-hue-shift",
      `${hueShift.toFixed(1)}deg`
    );
  }

  // 🧬 Quantum Empathy: Get current musical empathy metrics
  getQuantumEmpathyMetrics() {
    return {
      musicalMemorySize: this.musicalMemory.recentTracks.length,
      averageEnergy:
        this.musicalMemory.energyHistory.reduce((a, b) => a + b, 0) /
          this.musicalMemory.energyHistory.length || 0.5,
      visualMomentum: this.kineticState.visualMomentum,
      harmonicResonance: this.kineticState.currentPulse,
      temporalDepth: this.harmonyMetrics.temporalMemoryEvents,
    };
  }
}
