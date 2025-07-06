import { MusicSyncService } from "@/audio/MusicSyncService";
import {
  HARMONIC_EVOLUTION_KEY,
  HARMONIC_INTENSITY_KEY,
} from "@/config/settingKeys";
import type { EmergentChoreographyEngine } from "@/core/animation/EmergentChoreographyEngine";
import { GlobalEventBus } from "@/core/events/EventBus";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { PaletteExtensionManager } from "@/utils/core/PaletteExtensionManager";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
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
  /**
   * Canonical accent CSS custom property names.
   *  – `--sn-accent-hex`  : Hex string (e.g. "#cba6f7")
   *  – `--sn-accent-rgb`  : Comma-separated R,G,B channels (e.g. "203,166,247")
   *
   * These are written by the Year3000System colour pipeline and are considered
   * the single source-of-truth accent accessed by SCSS and visual systems.
   */
  public static readonly CANONICAL_HEX_VAR = "--sn-accent-hex";
  public static readonly CANONICAL_RGB_VAR = "--sn-accent-rgb";

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
  private emergentEngine: EmergentChoreographyEngine | null = null;

  // User-specified harmonic intensity (0-1). Multiplies defaultBlendRatio.
  private userIntensity: number = 0.7;
  private evolutionEnabled: boolean = true;
  private _boundSettingsChangeHandler: (e: Event) => void;
  private _boundArtisticModeHandler: (e: Event) => void;

  private _evolutionTimer: NodeJS.Timeout | null = null;

  // Timer ref for debounce
  private _pendingPaletteRefresh: NodeJS.Timeout | null = null;

  // Track last applied genre to avoid redundant palette refreshes
  private _lastGenre: string | null = null;

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

    // ------------------------------------------------------------------
    // Sync initial harmonic intensity from shared config so that user
    // preferences are respected as soon as the engine is instantiated.
    // ------------------------------------------------------------------
    if (
      config &&
      typeof (config as any).harmonicIntensity === "number" &&
      Number.isFinite((config as any).harmonicIntensity)
    ) {
      const clamped = Math.max(
        0,
        Math.min(1, (config as any).harmonicIntensity)
      );
      this.userIntensity = clamped;
    }

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

    // Sync evolution flag from config
    if (config && typeof (config as any).harmonicEvolution === "boolean") {
      this.evolutionEnabled = (config as any).harmonicEvolution;
    }

    // Bind handlers once
    this._boundSettingsChangeHandler = this._handleSettingsChange.bind(this);
    this._boundArtisticModeHandler = this._handleArtisticModeChanged.bind(this);

    document.addEventListener(
      "year3000SystemSettingsChanged",
      this._boundSettingsChangeHandler
    );
    document.addEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );

    // Start evolution loop if allowed
    if (this.evolutionEnabled) {
      this._startEvolutionLoop();
    }
  }
  // TODO: Legacy interface method - delegates to new onAnimate
  // Overload signature for IManagedSystem (single-parameter)
  override updateAnimation(deltaTime: number): void;
  // Overload signature for BaseVisualSystem (two-parameter)
  override updateAnimation(timestamp: number, deltaTime: number): void;
  // Unified implementation
  override updateAnimation(
    timestampOrDelta: number,
    maybeDelta?: number
  ): void {
    const delta = maybeDelta ?? timestampOrDelta;
    this.onAnimate(delta);
  }

  // TODO: Implement proper onAnimate method for Year 3000 per-frame updates
  public override onAnimate(deltaMs: number): void {
    this._updateCSSVariables(deltaMs);
    this._calculateBeatPulse(deltaMs);

    // Publish event for EmergentChoreographyEngine
    GlobalEventBus.publish("colorharmony/frame", {
      timestamp: performance.now(),
      kineticState: this.kineticState,
    });
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

    // === Year 3000: Dynamic text glow intensity ===
    // Map beat pulse (0–1) to a soft clamp between 0 and 1 for CSS consumers
    const glow = Math.max(0, Math.min(1, this.kineticState.currentPulse * 1.2));
    root.style.setProperty("--sn-text-glow-intensity", glow.toFixed(3));
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

  public override async initialize(): Promise<void> {
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
      contextRequirements[context] || contextRequirements["general"];
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
    let bestAccent: HarmoniousAccent = {
      name: "mauve",
      hex:
        this.utils
          .getRootStyle()
          ?.style.getPropertyValue("--sn-dynamic-accent")
          ?.trim() ||
        this.utils
          .getRootStyle()
          ?.style.getPropertyValue("--spice-accent")
          ?.trim() ||
        "#cba6f7", // Fallback to default mauve hex
      rgb: { r: 203, g: 166, b: 247 },
    };

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

    return bestAccent;
  }

  blendColors(
    rgb1: RGBColor,
    rgb2: RGBColor,
    ratio: number = this.vibrancyConfig.defaultBlendRatio
  ): RGBColor {
    // =============================
    // NEW  – Perceptual interpolation using Oklab
    // =============================
    // `ratio` expresses the dominance of `rgb1` (extracted colour).
    // We interpolate towards the Catppuccin accent in OKLab then convert
    // back to sRGB for downstream HSL-based aesthetic boosts.

    // Guard & clamp ratio to [0,1]
    const r = Math.max(0, Math.min(1, ratio));

    const oklab1 = this.utils.rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
    const oklab2 = this.utils.rgbToOklab(rgb2.r, rgb2.g, rgb2.b);

    const lerp = (a: number, b: number): number => a * r + b * (1 - r);

    const blendedOklab = {
      L: lerp(oklab1.L, oklab2.L),
      a: lerp(oklab1.a, oklab2.a),
      b: lerp(oklab1.b, oklab2.b),
    } as const;

    const blendedRgb = this.utils.oklabToRgb(
      blendedOklab.L,
      blendedOklab.a,
      blendedOklab.b
    );

    // Convert to HSL **after** perceptual interpolation so we can apply
    // artistic saturation & luminance boosts in a familiar space.
    const blendedHsl = this.utils.rgbToHsl(
      blendedRgb.r,
      blendedRgb.g,
      blendedRgb.b
    );

    // Preserve previous boost behaviour
    const artisticMode = this.config?.artisticMode ?? "artist-vision";
    const emergentMultipliers =
      this.emergentEngine?.getCurrentMultipliers?.() || undefined;

    const shouldUseEmergent =
      artisticMode === "cosmic-maximum" && !!emergentMultipliers;

    const validMultipliers: any = emergentMultipliers || {};

    const saturationBoostFactor = shouldUseEmergent
      ? (validMultipliers.visualIntensityBase || 1) * 1.25 // Align with previous behaviour
      : this.vibrancyConfig.artisticSaturationBoost;

    const luminanceBoostFactor = shouldUseEmergent
      ? (validMultipliers.aestheticGravityStrength || 1) * 1.15
      : this.vibrancyConfig.cosmicLuminanceBoost;

    // Minimum saturation guard (uses configured threshold)
    blendedHsl.s = Math.max(
      blendedHsl.s,
      this.vibrancyConfig.minimumSaturation * 100
    );

    // Apply artistic boosts (mode-aware)
    blendedHsl.s = Math.min(100, blendedHsl.s * saturationBoostFactor);
    if (artisticMode !== "corporate-safe") {
      blendedHsl.l = Math.min(95, blendedHsl.l * luminanceBoostFactor);
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
        blendRatio *= musicIntensity * this.userIntensity;
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

  public override updateFromMusicAnalysis(
    processedMusicData: any,
    rawFeatures: any,
    trackUri: string
  ): void {
    if (!processedMusicData) return;

    // Phase 3 – genre-aware palette morphing
    const g = processedMusicData.genre as string | undefined;
    if (g && g !== this._lastGenre) {
      this._applyGenrePalette(g).then(() => {
        this._lastGenre = g;
        // Nudge CSS variables repaint
        this._forcePaletteRepaint();
      });
    }

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

    const artisticMode = this.config.artisticMode;
    const baseAmplitude = artisticMode === "cosmic-maximum" ? 8 : 5; // stronger base swing in cosmic mode
    let hueShift = Math.sin(beatPhase * 2 * Math.PI) * baseAmplitude;

    // Boost on actual beats
    if (beatOccurred) {
      const beatBoost = artisticMode === "cosmic-maximum" ? 12 : 10;
      hueShift += energy * beatBoost; // larger boost for cosmic mode
    }

    const clampRange = artisticMode === "cosmic-maximum" ? 25 : 15;
    return Math.max(-clampRange, Math.min(clampRange, hueShift)); // Clamp depending on mode
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
    // =============================
    // NEW  – OKLab-based light/dark variants
    // =============================
    const oklab = this.utils.rgbToOklab(baseRgb.r, baseRgb.g, baseRgb.b);

    // Dark variant – reduce lightness perceptually
    const darkOklabL = Math.max(0, Math.min(1, oklab.L * 0.75));
    const darkRgb = this.utils.oklabToRgb(darkOklabL, oklab.a, oklab.b);

    // Light variant – increase lightness perceptually
    const lightOklabL = Math.max(0, Math.min(1, oklab.L * 1.25));
    const lightRgb = this.utils.oklabToRgb(lightOklabL, oklab.a, oklab.b);

    return {
      darkVibrantHex: this.utils.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
      lightVibrantHex: this.utils.rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
    };
  }

  /**
   * Get current gradient colors optimized for WebGL texture creation
   * @param stopCount Number of gradient stops to generate (default: 5)
   * @returns Array of RGB color objects or null if unavailable
   */
  public getCurrentGradient(
    stopCount: number = 5
  ): Array<{ r: number; g: number; b: number }> | null {
    try {
      const currentPalette = this.catppuccinPalettes[this.currentTheme];
      if (!currentPalette) {
        return null;
      }

      // Get current accent color from CSS variables
      const rootEl = this.utils.getRootStyle();
      const accentHex = rootEl
        ? getComputedStyle(rootEl)
            .getPropertyValue(ColorHarmonyEngine.CANONICAL_HEX_VAR)
            .trim()
        : "";

      let primaryColor: RGBColor;

      if (accentHex) {
        const rgb = this.utils.hexToRgb(accentHex);
        if (rgb) {
          primaryColor = rgb;
        } else {
          // Malformed accent value – fallback to theme default accent
          const defaultAccent = currentPalette.accents.mauve || "#cba6f7";
          primaryColor = this.utils.hexToRgb(defaultAccent)!;
        }
      } else {
        // Fallback to theme default accent when CSS variable is missing
        const defaultAccent = currentPalette.accents.mauve || "#cba6f7";
        primaryColor = this.utils.hexToRgb(defaultAccent)!;
      }

      // Generate harmonious color variations
      const gradientColors: Array<{ r: number; g: number; b: number }> = [];

      // Apply kinetic state for music-responsive dynamics
      const musicInfluence = this.kineticState.musicIntensityMultiplier || 1.0;
      const hueShift = this.kineticState.hueShift || 0;
      const valenceGravity = this.kineticState.valenceGravity || 0.5;

      // Generate gradient stops
      for (let i = 0; i < stopCount; i++) {
        const position = i / (stopCount - 1); // 0 to 1

        // Create color variation based on position
        let variantColor: RGBColor;

        if (position === 0) {
          // Start with darker base color
          variantColor = this._createVariant(
            primaryColor,
            -0.3,
            valenceGravity,
            hueShift
          );
        } else if (position === 1) {
          // End with lighter accent color
          variantColor = this._createVariant(
            primaryColor,
            0.2,
            valenceGravity,
            hueShift
          );
        } else {
          // Intermediate colors with smooth transitions
          const lightnessFactor = (position - 0.5) * 0.4;
          variantColor = this._createVariant(
            primaryColor,
            lightnessFactor,
            valenceGravity,
            hueShift
          );
        }

        // Apply music intensity scaling
        variantColor = this._applyMusicInfluence(
          variantColor,
          musicInfluence,
          position
        );

        gradientColors.push({
          r: Math.round(Math.max(0, Math.min(255, variantColor.r))),
          g: Math.round(Math.max(0, Math.min(255, variantColor.g))),
          b: Math.round(Math.max(0, Math.min(255, variantColor.b))),
        });
      }

      if (this.config?.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Generated gradient with ${stopCount} stops:`,
          gradientColors
        );
      }

      return gradientColors;
    } catch (error) {
      if (this.config?.enableDebug) {
        console.error(
          "[ColorHarmonyEngine] Failed to generate gradient:",
          error
        );
      }
      return null;
    }
  }

  /**
   * Create a color variant with lightness, saturation, and hue adjustments
   */
  private _createVariant(
    baseColor: RGBColor,
    lightnessFactor: number,
    valenceGravity: number,
    hueShift: number
  ): RGBColor {
    // Convert to OKLab for perceptual adjustments
    const oklab = this.utils.rgbToOklab(baseColor.r, baseColor.g, baseColor.b);

    // Adjust lightness (-1 to 1 range)
    const newL = Math.max(0, Math.min(1, oklab.L + lightnessFactor * 0.2));

    // Apply music valence to chroma (saturation)
    const chromaScale = 0.8 + valenceGravity * 0.4; // 0.8 to 1.2 range
    const newA = oklab.a * chromaScale;
    const newB = oklab.b * chromaScale;

    // Apply subtle hue shift from music
    const hueAdjustment = hueShift * 0.1; // Subtle shift
    const adjustedA =
      newA * Math.cos(hueAdjustment) - newB * Math.sin(hueAdjustment);
    const adjustedB =
      newA * Math.sin(hueAdjustment) + newB * Math.cos(hueAdjustment);

    // Convert back to RGB
    return this.utils.oklabToRgb(newL, adjustedA, adjustedB);
  }

  /**
   * Apply music intensity influence to color
   */
  private _applyMusicInfluence(
    color: RGBColor,
    intensity: number,
    position: number
  ): RGBColor {
    // Scale intensity effect based on gradient position
    const positionEffect = 1 + Math.sin(position * Math.PI) * 0.2; // Boost middle colors
    const effectiveIntensity = Math.max(
      0.7,
      Math.min(1.3, intensity * positionEffect)
    );

    return {
      r: color.r * effectiveIntensity,
      g: color.g * effectiveIntensity,
      b: color.b * effectiveIntensity,
    };
  }

  // =========================
  // PUBLIC API – User Control
  // =========================
  /**
   * Update user-defined harmonic intensity (0–1). Values outside range are clamped.
   */
  public setIntensity(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.userIntensity = clamped;
    if (this.config?.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] User harmonic intensity set to ${clamped}`
      );
    }
  }

  /**
   * External systems can push a pre-computed RGB palette to the engine.
   * Currently this simply triggers a palette refresh so all CSS variables
   * are recalculated.  Future phases may blend these colours directly.
   *
   * @param colors – Array of RGB objects ({ r,g,b }) representing the new palette
   */
  public updatePalette(
    colors: Array<{ r: number; g: number; b: number }>
  ): void {
    if (!colors?.length) return;
    // TODO: Phase-4 – incorporate provided colours into harmony pipeline
    if (this.config?.enableDebug) {
      console.log("[ColorHarmonyEngine] updatePalette invoked", {
        count: colors.length,
      });
    }
    // For now, simply force a repaint so downstream CSS vars refresh.
    this.forceRepaint("external-palette");
  }

  // ============================
  // Settings / Event Integration
  // ============================

  private _handleSettingsChange(event: Event): void {
    const { key, value } = (event as CustomEvent).detail || {};
    switch (key) {
      case HARMONIC_INTENSITY_KEY: {
        const num = parseFloat(value);
        if (!Number.isNaN(num)) {
          this.setIntensity(num);
        }
        break;
      }
      case HARMONIC_EVOLUTION_KEY: {
        const enabled = value === "true" || value === true;
        this._setEvolutionEnabled(enabled);
        break;
      }
    }
  }

  private _handleArtisticModeChanged(): void {
    // Artistic mode influences multipliers & contrast. Force a full palette
    // refresh so gradients & other CSS vars update instantly.
    this.currentTheme = this.detectCurrentTheme();
    // Debounced to avoid thrashing if multiple settings change quickly.
    if (!this._pendingPaletteRefresh) {
      this._pendingPaletteRefresh = setTimeout(() => {
        this._pendingPaletteRefresh = null;
        this.refreshPalette();
      }, 80); // ~1 animation frame
    }
  }

  private _forcePaletteRepaint(): void {
    // Simply bump kinetic hue shift to trigger _updateCSSVariables logic.
    this.kineticState.hueShift = (this.kineticState.hueShift || 0) + 0.01;
  }

  // Evolution helpers
  private _startEvolutionLoop(): void {
    if (this._evolutionTimer) return;
    // Period depends on intensity: stronger intensity → faster evolution
    const basePeriod = 30000; // 30s full cycle at intensity 1
    const period = basePeriod / Math.max(0.1, this.userIntensity);
    this._evolutionTimer = setInterval(() => {
      // Rotate hue slowly; we piggy-back on kineticState hueShift
      const step = 2 * this.userIntensity; // degrees per tick
      const current = this.kineticState.hueShift ?? 0;
      this.kineticState.hueShift = ((current + step + 360) % 360) - 180;
    }, period);
  }

  private _stopEvolutionLoop(): void {
    if (this._evolutionTimer) {
      clearInterval(this._evolutionTimer);
      this._evolutionTimer = null;
    }
  }

  private _setEvolutionEnabled(enabled: boolean): void {
    if (this.evolutionEnabled === enabled) return;
    this.evolutionEnabled = enabled;
    if (enabled) this._startEvolutionLoop();
    else this._stopEvolutionLoop();
  }

  // Clean up listeners when destroyed
  public override destroy(): void {
    this._stopEvolutionLoop();
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this._boundSettingsChangeHandler
    );
    document.removeEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );
    super.destroy?.();
  }

  /**
   * Public helper that triggers a colour rebake based on the current track.
   * Prefer calling the global Year3000System where available so the full
   * pipeline (extraction → harmonisation → CSS variable batch) is reused.
   */
  public async refreshPalette(): Promise<void> {
    try {
      const y3kSystem = (globalThis as any).year3000System;
      if (y3kSystem?.updateColorsFromCurrentTrack) {
        await y3kSystem.updateColorsFromCurrentTrack();
        return;
      }

      // Fallback: If Year3000System unavailable, attempt to re-apply CSS vars
      // using whatever colours are currently set on --sn-gradient-primary.
      const root = this.utils.getRootStyle();
      if (!root) return;
      const styles = getComputedStyle(root);
      const primary = styles.getPropertyValue("--sn-gradient-primary").trim();
      if (primary) {
        root.style.setProperty("--sn-gradient-primary", primary);
        // Recompute RGB variant
        const rgb = this.utils.hexToRgb(primary);
        if (rgb) {
          root.style.setProperty(
            "--sn-gradient-primary-rgb",
            `${rgb.r},${rgb.g},${rgb.b}`
          );
        }
      }
    } catch (err) {
      if (this.config.enableDebug) {
        console.warn("[ColorHarmonyEngine] refreshPalette failed", err);
      }
    }
  }

  /**
   * Swap Catppuccin palette accents & neutrals based on detected genre.
   * Executes asynchronously to avoid blocking audio thread.
   */
  private async _applyGenrePalette(genre: string): Promise<void> {
    try {
      const palette = await this._getGenreAwarePalette(genre);
      if (!palette) return;

      // Replace current flavour palette in-memory then refresh CSS vars
      (this.catppuccinPalettes as any)[this.currentTheme] = palette;
      await this.refreshPalette();

      // Phase 3 – Broadcast genre change so AudioVisualController can respond.
      try {
        GlobalEventBus.publish("music:genre-change", {
          genre,
          palette,
        });
      } catch (_e) {
        /* ignore publish errors */
      }
    } catch (err) {
      if (this.config.enableDebug) {
        console.warn("[ColorHarmonyEngine] _applyGenrePalette failed", err);
      }
    }
  }

  public setEmergentEngine(engine: EmergentChoreographyEngine): void {
    this.emergentEngine = engine;
  }

  // ---------------------------------------------------------------------------
  // 🔄 SETTINGS-AWARE REPAINT IMPLEMENTATION
  // ---------------------------------------------------------------------------
  /**
   * Re-apply the current palette immediately.  This is extremely lightweight
   * (just re-blends colours + sets CSS vars) so it can be called synchronously
   * from Year3000System after a relevant settings change.
   */
  public override forceRepaint(_reason: string = "settings-change"): void {
    // Debounced palette refresh is intentionally bypassed here—we want an
    // immediate update so UI responds in the same frame.
    this.refreshPalette?.();
  }
}
