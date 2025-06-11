import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import { PaletteExtensionManager } from "@/utils/PaletteExtensionManager";
import * as Year3000Utilities from "@/utils/Year3000Utilities";
import { BaseVisualSystem } from "./BaseVisualSystem";
// TODO: Phase 4 - Import WebGL and Worker support for performance

// Type definitions for color structures
type RGBColor = { r: number; g: number; b: number };
type HSLColor = { h: number; s: number; l: number };
type HarmoniousAccent = {
  name: string;
  hex: string;
  rgb: RGBColor;
};
type AccentPalette = { [key: string]: string };
type NeutralPalette = { [key: string]: string };
type CatppuccinPalette = {
  accents: AccentPalette;
  neutrals: NeutralPalette;
};
type CatppuccinFlavors = {
  frappe: CatppuccinPalette;
  latte: CatppuccinPalette;
  macchiato: CatppuccinPalette;
  mocha: CatppuccinPalette;
};

type CatppuccinFlavor = keyof CatppuccinFlavors;

type ValidationResult = {
  isValid: boolean;
  contrastRatio: number;
  harmonyScore: number;
  meetsContrast: boolean;
  isHarmonious: boolean;
  artisticMode: string;
  adjustedRequirements: any;
  recommendations: any[];
  error?: string;
};

// =============================================================================
// YEAR 3000 COLOR HARMONY ENGINE - Enhanced Vibrancy Edition
// =============================================================================

export class ColorHarmonyEngine
  extends BaseVisualSystem
  implements IManagedSystem
{
  private currentTheme: CatppuccinFlavor;
  private harmonyMetrics: {
    totalHarmonyCalculations: number;
    musicInfluencedAdjustments: number;
    temporalMemoryEvents: number;
    performance: number[];
  };

  private musicalMemory: {
    recentTracks: any[];
    userColorPreferences: Map<any, any>;
    energyHistory: any[];
    maxMemorySize: number;
  };

  private kineticState: {
    currentPulse: number;
    breathingPhase: number;
    lastBeatTime: number;
    visualMomentum: number;
    // TODO: Phase 2 - Extended properties for music-aware dynamics
    musicIntensityMultiplier?: number;
    beatPhase?: number;
    valenceGravity?: number;
    hueShift?: number;
  };

  private catppuccinPalettes: CatppuccinFlavors;
  private vibrancyConfig: any;
  private paletteExtensionManager: PaletteExtensionManager;

  constructor(
    config?: Year3000Config,
    utils?: typeof Year3000Utilities,
    performanceMonitor?: PerformanceAnalyzer,
    musicAnalysisService?: MusicSyncService,
    settingsManager?: SettingsManager
  ) {
    super(
      config,
      utils || Year3000Utilities,
      performanceMonitor!,
      musicAnalysisService || null,
      settingsManager || null
    );
    this.systemName = "ColorHarmonyEngine";

    this.paletteExtensionManager = new PaletteExtensionManager(
      this.config,
      this.utils
    );

    this.currentTheme = this.detectCurrentTheme();
    this.harmonyMetrics = {
      totalHarmonyCalculations: 0,
      musicInfluencedAdjustments: 0,
      temporalMemoryEvents: 0,
      performance: [],
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
      getBlendRatio(artisticMode: string = "artist-vision") {
        const ratios: { [key: string]: number } = {
          "corporate-safe": 0.75, // Conservative: 75% extracted
          "artist-vision": 0.95, // Bold: 95% extracted
          "cosmic-maximum": 0.98, // Maximum: 98% extracted!
        };
        return ratios[artisticMode] || this.defaultBlendRatio;
      },
    };

    if (this.config.enableDebug) {
      console.log(
        "🎨 [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy"
      );
    }
  }
  // TODO: Legacy interface method - delegates to new onAnimate
  updateAnimation(deltaTime: number): void {
    this.onAnimate(deltaTime);
  }

  // TODO: Implement proper onAnimate method for Year 3000 per-frame updates
  public onAnimate(deltaMs: number): void {
    this._updateCSSVariables(deltaMs);
    this._calculateBeatPulse(deltaMs);
  }

  // TODO: Private method for updating CSS variables with kinetic state
  private _updateCSSVariables(deltaMs: number): void {
    const root = this.utils.getRootStyle();
    if (!root) return;

    // Phase 1 - Original harmony variables
    root.style.setProperty(
      "--sn-harmony-energy",
      this.kineticState.visualMomentum.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmony-pulse",
      this.kineticState.currentPulse.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmony-breathing-phase",
      (Math.sin(this.kineticState.breathingPhase) * 0.5 + 0.5).toFixed(3)
    );

    // TODO: Phase 2 - Music-aware dynamic variables
    if (this.kineticState.musicIntensityMultiplier !== undefined) {
      root.style.setProperty(
        "--sn-harmony-intensity",
        this.kineticState.musicIntensityMultiplier.toFixed(3)
      );
    }

    if (this.kineticState.valenceGravity !== undefined) {
      root.style.setProperty(
        "--sn-harmony-valence",
        this.kineticState.valenceGravity.toFixed(3)
      );
    }

    if (this.kineticState.beatPhase !== undefined) {
      root.style.setProperty(
        "--sn-harmony-beat-phase",
        this.kineticState.beatPhase.toFixed(3)
      );
    }

    if (this.kineticState.hueShift !== undefined) {
      root.style.setProperty(
        "--sn-harmony-hue-shift",
        `${this.kineticState.hueShift.toFixed(1)}deg`
      );
    }
  }

  // TODO: Private method for calculating beat pulse effects
  private _calculateBeatPulse(deltaMs: number): void {
    // Decay current pulse
    this.kineticState.currentPulse *= Math.pow(0.95, deltaMs / 16.67); // Normalized to 60fps decay

    // Update breathing phase
    this.kineticState.breathingPhase += (deltaMs / 1000) * 0.5; // Slow breathing cycle
    if (this.kineticState.breathingPhase > 2 * Math.PI) {
      this.kineticState.breathingPhase -= 2 * Math.PI;
    }
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    if (this.config.enableDebug) {
      console.log(
        "🎨 [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy via BaseVisualSystem."
      );
    }
    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.catppuccinPalettes[this.currentTheme]) {
      return {
        ok: false,
        details: `Current theme '${this.currentTheme}' not found in palettes.`,
      };
    }
    return { ok: true, details: "Palettes are loaded correctly." };
  }

  detectCurrentTheme(): CatppuccinFlavor {
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

    const normalizedBaseColor = baseColorHex.startsWith("#")
      ? baseColorHex.substring(1).toUpperCase()
      : baseColorHex.toUpperCase();

    const themeMap: { [key: string]: CatppuccinFlavor } = {
      "303446": "frappe",
      EFF1F5: "latte",
      "24273A": "macchiato",
      "1E1E2E": "mocha",
    };

    // TODO: Phase 3 - Check for known Catppuccin themes first
    const knownTheme = themeMap[normalizedBaseColor];
    if (knownTheme) {
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Detected Catppuccin theme: ${knownTheme}`
        );
      }
      return knownTheme;
    }

    // TODO: Phase 3 - For unknown themes, attempt to generate fallback palette
    if (this.config.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] Unknown theme detected (${normalizedBaseColor}), attempting to generate fallback`
      );
    }

    // Generate a fallback palette name based on the base color
    const fallbackThemeName = `custom-${normalizedBaseColor.toLowerCase()}`;

    // Use PaletteExtensionManager to generate a fallback palette
    // This doesn't block the current method since we still return a valid CatppuccinFlavor
    try {
      const fallbackPalette =
        this.paletteExtensionManager.generateFallbackPalette(fallbackThemeName);
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Generated fallback palette for theme: ${fallbackThemeName}`,
          fallbackPalette
        );
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[ColorHarmonyEngine] Failed to generate fallback palette:`,
          error
        );
      }
    }

    // Default to mocha for now, but log the attempt
    if (this.config.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] Falling back to mocha theme for unknown base color: ${normalizedBaseColor}`
      );
    }

    return "mocha";
  }

  // TODO: Phase 3 - New method to get genre-aware palette
  private async _getGenreAwarePalette(
    genre?: string
  ): Promise<CatppuccinPalette> {
    const basePalette = (this.catppuccinPalettes as any)[this.currentTheme];

    if (!genre || !basePalette) {
      return basePalette;
    }

    try {
      // Convert CatppuccinPalette to CustomPalette format for processing
      const customPalette = {
        name: this.currentTheme,
        version: "1.0.0",
        accents: basePalette.accents,
        neutrals: basePalette.neutrals,
        metadata: {
          author: "Catppuccin",
          description: `${this.currentTheme} flavor`,
          temperature: "neutral" as const,
        },
      };

      // Apply genre-aware modifications
      const modifiedPalette =
        this.paletteExtensionManager.applyGenreAwareModifications(
          customPalette,
          genre
        );

      // Convert back to CatppuccinPalette format
      return {
        accents: modifiedPalette.accents,
        neutrals: modifiedPalette.neutrals,
      };
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[ColorHarmonyEngine] Failed to apply genre modifications for ${genre}:`,
          error
        );
      }
      return basePalette;
    }
  }

  getMusicIntensityMultiplier(
    energy: number = 0.5,
    valence: number = 0.5
  ): number {
    const baseMultiplier = (this.config.getCurrentMultipliers as any)()
      .musicEnergyBoost;
    const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1.0 : 0.8;
    const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1.0;
    return baseMultiplier * energyBoost * valenceBoost;
  }

  validateColorHarmony(
    color: RGBColor,
    context: string = "general"
  ): ValidationResult {
    const startTime = performance.now();
    this.harmonyMetrics.totalHarmonyCalculations++;

    const contextRequirements: { [key: string]: any } = {
      general: {
        minContrast: 1.8,
        minHarmony: this.vibrancyConfig.harmonyTolerance,
      },
      search: { minContrast: 2.8, minHarmony: 0.4 },
      navigation: { minContrast: 2.5, minHarmony: 0.45 },
      text: { minContrast: 4.5, minHarmony: 0.6 },
      accent: { minContrast: 1.5, minHarmony: 0.3 },
    };

    const requirements =
      contextRequirements[context] || contextRequirements.general;
    const currentPalette = (this.catppuccinPalettes as any)[this.currentTheme];

    if (!currentPalette?.neutrals?.base) {
      const errorMsg = `[StarryNight] Catppuccin palette or base neutral not found for theme: ${this.currentTheme}`;
      console.error(errorMsg);
      return {
        isValid: false,
        error: "Palette configuration error.",
        contrastRatio: 0,
        harmonyScore: 0,
        meetsContrast: false,
        isHarmonious: false,
        artisticMode: this.config.artisticMode,
        adjustedRequirements: requirements,
        recommendations: [],
      };
    }

    const backgroundColor = currentPalette.neutrals.base;
    const colorHex = this.utils.rgbToHex(color.r, color.g, color.b);

    const contrastRatio = this.utils.calculateContrastRatio(
      colorHex,
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
      isValid: meetsContrast && isHarmonious,
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

  calculateHarmonyScore(color: RGBColor, palette: CatppuccinPalette): number {
    const colorHsl = this.utils.rgbToHsl(color.r, color.g, color.b);

    let maxHarmony = 0;
    const accentColors = Object.values(palette.accents);
    for (const accentColor of accentColors) {
      const accentRgb = this.utils.hexToRgb(accentColor);
      if (!accentRgb) continue;

      const accentHsl = this.utils.rgbToHsl(
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
    }

    return maxHarmony;
  }

  findBestHarmoniousAccent(
    rgb: RGBColor,
    palette: CatppuccinPalette
  ): HarmoniousAccent {
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

    let bestAccent: HarmoniousAccent | null = null;
    let bestScore = -1;

    const inputHsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);

    for (const accentName of accentPriority) {
      const accentHex = palette.accents[accentName];
      if (accentHex) {
        const accentRgb = this.utils.hexToRgb(accentHex);
        if (!accentRgb) continue;

        const accentHsl = this.utils.rgbToHsl(
          accentRgb.r,
          accentRgb.g,
          accentRgb.b
        );

        const hueDiff = Math.abs(inputHsl.h - accentHsl.h);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

        const harmonyScore = 1 - normalizedHueDiff / 180;
        const saturationBonus = accentHsl.s * 0.3;
        const totalScore = harmonyScore + saturationBonus;

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestAccent = {
            name: accentName,
            hex: accentHex,
            rgb: accentRgb,
          };
        }
      }
    }

    if (bestAccent) {
      return bestAccent;
    }

    // Fallback logic
    const fallbackAccentName = "mauve";
    const fallbackAccentHex =
      palette.accents[fallbackAccentName] ||
      Object.values(palette.accents)[0] ||
      "#cba6f7"; // Default mauve hex
    const fallbackAccentRgb = this.utils.hexToRgb(fallbackAccentHex);

    return {
      name: fallbackAccentName,
      hex: fallbackAccentHex,
      rgb: fallbackAccentRgb || { r: 198, g: 160, b: 246 }, // Default mauve
    };
  }

  blendColors(
    rgb1: RGBColor,
    rgb2: RGBColor,
    ratio: number = this.vibrancyConfig.defaultBlendRatio
  ): RGBColor {
    const hsl1 = this.utils.rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
    const hsl2 = this.utils.rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

    const artisticMode = this.config.artisticMode;

    const blendedHsl: HSLColor = {
      h: this.utils.lerp(hsl1.h, hsl2.h, 1 - ratio),
      s: Math.max(
        this.utils.lerp(hsl1.s, hsl2.s, 1 - ratio),
        this.vibrancyConfig.minimumSaturation * 100
      ),
      l: this.utils.lerp(hsl1.l, hsl2.l, 1 - ratio),
    };

    // Apply artistic saturation boost
    blendedHsl.s = Math.min(
      100,
      blendedHsl.s * this.vibrancyConfig.artisticSaturationBoost
    );

    // Apply cosmic luminance boost only in non-conservative modes
    if (artisticMode !== "corporate-safe") {
      blendedHsl.l = Math.min(
        95,
        blendedHsl.l * this.vibrancyConfig.cosmicLuminanceBoost
      );
    }

    const finalRgb = this.utils.hslToRgb(
      blendedHsl.h,
      blendedHsl.s,
      blendedHsl.l
    );
    return { r: finalRgb.r, g: finalRgb.g, b: finalRgb.b };
  }

  blendWithCatppuccin(
    extractedColors: { [key: string]: string },
    musicContext: any = null
  ): { [key: string]: string } {
    this.performanceMonitor?.emitTrace?.(
      "[ColorHarmonyEngine] Starting blendWithCatppuccin"
    );

    const currentPalette = (this.catppuccinPalettes as any)[this.currentTheme];
    if (!currentPalette) {
      console.error(
        `[StarryNight] Catppuccin palette not found for theme: ${this.currentTheme}`
      );
      return extractedColors;
    }

    const harmonizedColors: { [key: string]: string } = {};

    for (const [role, color] of Object.entries(extractedColors)) {
      if (!color) continue;

      const extractedRgb = this.utils.hexToRgb(color);
      if (!extractedRgb) {
        harmonizedColors[role] = color;
        continue;
      }

      const bestAccent = this.findBestHarmoniousAccent(
        extractedRgb,
        currentPalette
      );
      if (!bestAccent?.rgb) {
        console.warn(
          `[StarryNight] Could not find a valid harmonious accent for role: ${role}. Using original color.`
        );
        harmonizedColors[role] = color;
        continue;
      }

      let blendRatio = this.vibrancyConfig.getBlendRatio(
        this.config.artisticMode
      );
      if (musicContext) {
        const musicIntensity = this.getMusicIntensityMultiplier(
          musicContext.energy,
          musicContext.valence
        );
        blendRatio *= musicIntensity;
        // Clamp ratio to prevent inverse effects
        blendRatio = Math.max(0, Math.min(1, blendRatio));
      }

      const finalRgb = this.blendColors(
        extractedRgb,
        bestAccent.rgb,
        blendRatio
      );
      harmonizedColors[role] = this.utils.rgbToHex(
        finalRgb.r,
        finalRgb.g,
        finalRgb.b
      );
    }

    this.harmonyMetrics.musicInfluencedAdjustments++;

    this.performanceMonitor?.emitTrace?.(
      "[ColorHarmonyEngine] Completed blendWithCatppuccin"
    );

    return harmonizedColors;
  }

  generateRecommendations(
    color: RGBColor,
    contrastRatio: number,
    harmonyScore: number,
    requirements: any
  ): any[] {
    const recommendations = [];
    const currentPalette = (this.catppuccinPalettes as any)[this.currentTheme];
    const baseRgb = this.utils.hexToRgb(currentPalette.neutrals.base)!;

    if (!baseRgb) {
      return [];
    }

    if (contrastRatio < requirements.minContrast) {
      const targetL = this.utils.findRequiredLuminance(
        color,
        baseRgb,
        requirements.minContrast
      );
      const currentHsl = this.utils.rgbToHsl(color.r, color.g, color.b);
      const adjustedRgbArr = this.utils.hslToRgb(
        currentHsl.h,
        currentHsl.s,
        targetL
      );
      const adjustedRgb = {
        r: adjustedRgbArr.r,
        g: adjustedRgbArr.g,
        b: adjustedRgbArr.b,
      };
      recommendations.push({
        type: "contrast",
        suggestion: `Adjust luminance to meet contrast of ${requirements.minContrast}`,
        recommendedColor: this.utils.rgbToHex(
          adjustedRgb.r,
          adjustedRgb.g,
          adjustedRgb.b
        ),
      });
    }

    if (harmonyScore < requirements.minHarmony) {
      const harmoniousAccent = this.findBestHarmoniousAccent(
        color,
        currentPalette
      );
      const blendedColor = this.blendColors(color, harmoniousAccent.rgb, 0.5);
      recommendations.push({
        type: "harmony",
        suggestion: `Blend with harmonious accent color to improve score to at least ${requirements.minHarmony}`,
        recommendedColor: this.utils.rgbToHex(
          blendedColor.r,
          blendedColor.g,
          blendedColor.b
        ),
      });
    }

    return recommendations;
  }

  getPerformanceReport(): any {
    return {
      system: this.systemName,
      metrics: this.harmonyMetrics,
      kineticState: this.kineticState,
      musicalMemorySize: this.musicalMemory.recentTracks.length,
      currentTheme: this.currentTheme,
    };
  }

  updateFromMusicAnalysis(
    processedMusicData: any,
    rawFeatures: any,
    trackUri: string
  ): void {
    if (!processedMusicData) return;
    this._updateMusicalMemory(processedMusicData, trackUri);
    this._updateKineticState(processedMusicData);
    this._applyAestheticGravity(processedMusicData);

    // TODO: Phase 2 - Calculate music-aware dynamic values
    this._calculateMusicAwareDynamics(processedMusicData);
  }

  // TODO: Phase 2 - New method for music-aware dynamic calculations
  private _calculateMusicAwareDynamics(musicData: any): void {
    const {
      energy = 0.5,
      valence = 0.5,
      enhancedBPM = 120,
      beatOccurred = false,
    } = musicData;

    // Calculate music intensity multiplier (combines energy + valence)
    const musicIntensityMultiplier = this._calculateMusicIntensityMultiplier(
      energy,
      valence
    );

    // Calculate beat phase (0-1 cycle based on beat timing)
    const beatPhase = this._calculateBeatPhase(enhancedBPM);

    // Calculate valence gravity (-1 to 1 for emotional color shifting)
    const valenceGravity = (valence - 0.5) * 2;

    // Calculate dynamic hue shift for beat-synchronized effects
    const hueShift = this._calculateHueShift(beatOccurred, energy, beatPhase);

    // Store these values for use in _updateCSSVariables
    this.kineticState = {
      ...this.kineticState,
      musicIntensityMultiplier,
      beatPhase,
      valenceGravity,
      hueShift,
    };
  }

  // TODO: Phase 2 - Calculate music intensity based on energy and valence
  private _calculateMusicIntensityMultiplier(
    energy: number,
    valence: number
  ): number {
    // Combine energy and valence into a single intensity metric
    // High energy + positive valence = maximum intensity
    // Low energy + negative valence = minimum intensity
    const baseIntensity = energy * 0.7 + valence * 0.3;
    const contrastBoost = Math.abs(valence - 0.5) * 0.4; // Boost for emotional extremes
    return Math.max(0.1, Math.min(2.0, baseIntensity + contrastBoost));
  }

  // TODO: Phase 2 - Calculate beat phase for cyclic effects
  private _calculateBeatPhase(enhancedBPM: number): number {
    const now = performance.now();
    const beatInterval = 60000 / enhancedBPM; // ms per beat
    const timeSinceStart = now % beatInterval;
    return timeSinceStart / beatInterval; // 0-1 cycle
  }

  // TODO: Phase 2 - Calculate dynamic hue shift for beat effects
  private _calculateHueShift(
    beatOccurred: boolean,
    energy: number,
    beatPhase: number
  ): number {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return 0;
    }

    // Base hue shift from beat phase (subtle cycling)
    let hueShift = Math.sin(beatPhase * 2 * Math.PI) * 5; // ±5 degrees base

    // Boost on actual beats
    if (beatOccurred) {
      hueShift += energy * 10; // Up to 10 degrees on high-energy beats
    }

    return Math.max(-15, Math.min(15, hueShift)); // Clamp to ±15 degrees
  }

  private _updateMusicalMemory(musicData: any, trackUri: string): void {
    this.musicalMemory.recentTracks.unshift({
      trackUri,
      ...musicData,
      timestamp: Date.now(),
    });
    if (
      this.musicalMemory.recentTracks.length > this.musicalMemory.maxMemorySize
    ) {
      this.musicalMemory.recentTracks.pop();
    }

    this.musicalMemory.energyHistory.unshift(musicData.energy);
    if (this.musicalMemory.energyHistory.length > 20) {
      this.musicalMemory.energyHistory.pop();
    }
    this.harmonyMetrics.temporalMemoryEvents++;
  }

  private _updateKineticState(musicData: any): void {
    const { energy, enhancedBPM, beatOccurred } = musicData;
    const now = performance.now();

    if (beatOccurred) {
      this.kineticState.lastBeatTime = now;
      this.kineticState.currentPulse = 1.0;
    } else {
      this.kineticState.currentPulse *= 0.95;
    }

    const timeSinceLastBeat = now - this.kineticState.lastBeatTime;
    const beatInterval = 60000 / (enhancedBPM || 120);
    this.kineticState.breathingPhase =
      ((timeSinceLastBeat % beatInterval) / beatInterval) * 2 * Math.PI;

    this.kineticState.visualMomentum = this.utils.lerp(
      this.kineticState.visualMomentum,
      energy,
      0.1
    );
  }

  private _applyAestheticGravity(musicData: any): void {
    const { visualIntensity, valence, energy } = musicData;

    const gravityX = (valence - 0.5) * 2; // -1 to 1
    const gravityY = (energy - 0.5) * 2; // -1 to 1
    const gravityStrength = visualIntensity;

    const root = this.utils.getRootStyle();
    if (root) {
      root.style.setProperty("--sn-gravity-x", gravityX.toFixed(3));
      root.style.setProperty("--sn-gravity-y", gravityY.toFixed(3));
      root.style.setProperty(
        "--sn-gravity-strength",
        gravityStrength.toFixed(3)
      );
    }
  }

  getQuantumEmpathyMetrics(): any {
    const avgEnergy =
      this.musicalMemory.energyHistory.reduce((a, b) => a + b, 0) /
        this.musicalMemory.energyHistory.length || 0;

    return {
      averageRecentEnergy: avgEnergy,
      systemMomentum: this.kineticState.visualMomentum,
      preferenceProfileSize: this.musicalMemory.userColorPreferences.size,
    };
  }

  public generateHarmonicVariations(baseRgb: RGBColor): {
    darkVibrantHex: string;
    lightVibrantHex: string;
  } {
    const currentPalette = (this.catppuccinPalettes as any)[this.currentTheme];
    if (!currentPalette) {
      return {
        darkVibrantHex: this.utils.rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b),
        lightVibrantHex: this.utils.rgbToHex(baseRgb.r, baseRgb.g, baseRgb.b),
      };
    }

    const harmoniousAccent = this.findBestHarmoniousAccent(
      baseRgb,
      currentPalette
    );
    const baseHsl = this.utils.rgbToHsl(
      harmoniousAccent.rgb.r,
      harmoniousAccent.rgb.g,
      harmoniousAccent.rgb.b
    );

    // Create Dark Vibrant
    const darkHsl = { ...baseHsl };
    darkHsl.s = Math.min(100, baseHsl.s * 1.1); // Increase saturation
    darkHsl.l = Math.max(10, baseHsl.l * 0.75); // Decrease lightness

    // Create Light Vibrant
    const lightHsl = { ...baseHsl };
    lightHsl.s = Math.min(100, baseHsl.s * 1.05); // Slightly increase saturation
    lightHsl.l = Math.min(90, baseHsl.l * 1.25); // Increase lightness

    const darkRgb = this.utils.hslToRgb(darkHsl.h, darkHsl.s, darkHsl.l);
    const lightRgb = this.utils.hslToRgb(lightHsl.h, lightHsl.s, lightHsl.l);

    return {
      darkVibrantHex: this.utils.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
      lightVibrantHex: this.utils.rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
    };
  }
}
