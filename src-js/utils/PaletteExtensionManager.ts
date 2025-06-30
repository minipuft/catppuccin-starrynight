import type { Year3000Config } from "@/types/models";
import * as Year3000Utilities from "./Year3000Utilities";

// TODO: Phase 3 - Types for extensible palette system
interface CustomPalette {
  name: string;
  version: string;
  accents: { [key: string]: string };
  neutrals: { [key: string]: string };
  metadata?: {
    author?: string;
    description?: string;
    genre?: string[];
    temperature?: "warm" | "cool" | "neutral";
  };
}

interface PaletteCache {
  [key: string]: {
    palette: CustomPalette;
    timestamp: number;
    isValid: boolean;
  };
}

// TODO: Phase 3 - Genre-specific color temperature mappings
const GENRE_PALETTE_HINTS = {
  jazz: { temperatureShift: 15, saturationBoost: 1.1, warmth: 0.8 },
  electronic: { temperatureShift: -10, saturationBoost: 1.2, warmth: 0.2 },
  classical: { temperatureShift: 5, saturationBoost: 0.9, warmth: 0.6 },
  rock: { temperatureShift: 0, saturationBoost: 1.15, warmth: 0.5 },
  ambient: { temperatureShift: -5, saturationBoost: 0.8, warmth: 0.3 },
  hiphop: { temperatureShift: 8, saturationBoost: 1.25, warmth: 0.7 },
  pop: { temperatureShift: 0, saturationBoost: 1.0, warmth: 0.5 },
  metal: { temperatureShift: -15, saturationBoost: 1.3, warmth: 0.1 },
  indie: { temperatureShift: 10, saturationBoost: 0.95, warmth: 0.6 },
  default: { temperatureShift: 0, saturationBoost: 1.0, warmth: 0.5 },
};

export class PaletteExtensionManager {
  private config: Year3000Config;
  private utils: typeof Year3000Utilities;
  private paletteCache: PaletteCache = {};
  private cacheTTL: number = 300000; // 5 minutes
  private maxCacheSize: number = 50;

  constructor(config: Year3000Config, utils: typeof Year3000Utilities) {
    this.config = config;
    this.utils = utils;
  }

  // TODO: Phase 3 - Load custom palette from JSON with validation
  public async loadCustomPalette(
    paletteId: string,
    source?: string
  ): Promise<CustomPalette | null> {
    // Check cache first
    const cached = this.paletteCache[paletteId];
    if (
      cached &&
      Date.now() - cached.timestamp < this.cacheTTL &&
      cached.isValid
    ) {
      if (this.config.enableDebug) {
        console.log(
          `[PaletteExtensionManager] Cache hit for palette: ${paletteId}`
        );
      }
      return cached.palette;
    }

    try {
      // TODO: In a real implementation, this would load from JSON files or API
      // For now, we'll generate a fallback palette
      const fallbackPalette = this.generateFallbackPalette(paletteId);

      if (this.validatePalette(fallbackPalette)) {
        this.cachePalette(paletteId, fallbackPalette, true);
        return fallbackPalette;
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[PaletteExtensionManager] Failed to load palette ${paletteId}:`,
          error
        );
      }
    }

    return null;
  }

  // TODO: Phase 3 - Generate fallback palette for unknown themes
  public generateFallbackPalette(themeName: string): CustomPalette {
    // Extract potential color information from theme name or CSS
    const root = this.utils.getRootStyle();
    const computedStyle = getComputedStyle(root);

    const baseColor =
      computedStyle.getPropertyValue("--spice-main").trim() ||
      computedStyle.getPropertyValue("--spice-base").trim() ||
      "#1e1e2e";
    const accentColor =
      // Prefer Year 3000 dynamic accent if it's already available, else fall back to spice button, then to dynamic accent fallback.
      computedStyle.getPropertyValue("--sn-gradient-accent").trim() ||
      computedStyle.getPropertyValue("--spice-button").trim() ||
      computedStyle.getPropertyValue("--sn-dynamic-accent").trim() ||
      computedStyle.getPropertyValue("--spice-accent").trim() ||
      "#8caaee";

    // Generate complementary colors based on base colors
    const baseRgb = this.utils.hexToRgb(
      baseColor.startsWith("#") ? baseColor : `#${baseColor}`
    );
    const accentRgb = this.utils.hexToRgb(
      accentColor.startsWith("#") ? accentColor : `#${accentColor}`
    );

    if (!baseRgb || !accentRgb) {
      // Ultimate fallback - Use dynamic variables if available, otherwise Catppuccin Mocha-like colors
      const dynamicAccent = computedStyle
        .getPropertyValue("--sn-dynamic-accent")
        .trim();
      const dynamicBase = computedStyle.getPropertyValue("--spice-base").trim();

      return {
        name: themeName,
        version: "1.0.0",
        accents: {
          mauve: dynamicAccent || "#ca9ee6",
          pink: "#f4b8e4",
          blue: dynamicAccent || "#8caaee",
          sapphire: "#85c1dc",
          sky: "#99d1db",
          teal: "#81c8be",
          green: "#a6d189",
          yellow: "#e5c890",
          peach: "#ef9f76",
          red: "#e78284",
          lavender: "#babbf1",
        },
        neutrals: {
          base: dynamicBase || "#1e1e2e",
          surface0: "#313244",
          surface1: "#45475a",
          surface2: "#585b70",
          overlay0: "#6c7086",
          overlay1: "#7f849c",
          overlay2: "#9399b2",
          text: "#cdd6f4",
        },
        metadata: {
          author: "PaletteExtensionManager",
          description: `Generated fallback for ${themeName}`,
          temperature: "neutral",
        },
      };
    }

    // Generate palette variations based on detected colors
    const baseHsl = this.utils.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const accentHsl = this.utils.rgbToHsl(
      accentRgb.r,
      accentRgb.g,
      accentRgb.b
    );

    return {
      name: themeName,
      version: "1.0.0",
      accents: this.generateAccentVariations(accentHsl),
      neutrals: this.generateNeutralVariations(baseHsl),
      metadata: {
        author: "PaletteExtensionManager",
        description: `Generated palette for ${themeName}`,
        temperature: this.detectTemperature(baseHsl, accentHsl),
      },
    };
  }

  // TODO: Phase 3 - Apply genre-aware modifications to palette
  public applyGenreAwareModifications(
    palette: CustomPalette,
    genre: string
  ): CustomPalette {
    const genreHints =
      GENRE_PALETTE_HINTS[genre as keyof typeof GENRE_PALETTE_HINTS] ||
      GENRE_PALETTE_HINTS.default;

    if (this.config.enableDebug) {
      console.log(
        `[PaletteExtensionManager] Applying ${genre} hints to palette:`,
        genreHints
      );
    }

    const modifiedPalette: CustomPalette = {
      ...palette,
      accents: {},
      neutrals: {},
      metadata: {
        ...palette.metadata,
        genre: [...(palette.metadata?.genre || []), genre],
      },
    };

    // Apply genre modifications to accent colors
    for (const [key, color] of Object.entries(palette.accents)) {
      modifiedPalette.accents[key] = this.applyGenreColorModification(
        color,
        genreHints.temperatureShift,
        genreHints.saturationBoost
      );
    }

    // Apply genre modifications to neutral colors (more subtle)
    for (const [key, color] of Object.entries(palette.neutrals)) {
      modifiedPalette.neutrals[key] = this.applyGenreColorModification(
        color,
        genreHints.temperatureShift * 0.3, // Less intense for neutrals
        genreHints.saturationBoost * 0.7
      );
    }

    return modifiedPalette;
  }

  // TODO: Phase 3 - Validate palette structure and required properties
  private validatePalette(palette: any): palette is CustomPalette {
    if (!palette || typeof palette !== "object") return false;
    if (!palette.name || typeof palette.name !== "string") return false;
    if (!palette.version || typeof palette.version !== "string") return false;
    if (!palette.accents || typeof palette.accents !== "object") return false;
    if (!palette.neutrals || typeof palette.neutrals !== "object") return false;

    // Validate that colors are valid hex strings
    const allColors = [
      ...Object.values(palette.accents),
      ...Object.values(palette.neutrals),
    ];
    for (const color of allColors) {
      if (typeof color !== "string" || !this.isValidHexColor(color)) {
        return false;
      }
    }

    return true;
  }

  // TODO: Phase 3 - Cache management
  private cachePalette(
    paletteId: string,
    palette: CustomPalette,
    isValid: boolean
  ): void {
    // Cleanup old entries if cache is too large
    if (Object.keys(this.paletteCache).length >= this.maxCacheSize) {
      // Safely find the oldest cache entry using Object.entries to avoid undefined issues
      const oldestEntry = Object.entries(this.paletteCache).sort(
        ([, aVal], [, bVal]) => aVal.timestamp - bVal.timestamp
      )[0];

      const oldestKey = oldestEntry?.[0];
      if (oldestKey && this.paletteCache[oldestKey]) {
        delete this.paletteCache[oldestKey];
      }
    }

    this.paletteCache[paletteId] = {
      palette,
      timestamp: Date.now(),
      isValid,
    };
  }

  // TODO: Phase 3 - Generate accent color variations
  private generateAccentVariations(baseHsl: {
    h: number;
    s: number;
    l: number;
  }): { [key: string]: string } {
    const variations: { [key: string]: string } = {};

    // Generate hue-shifted variants
    const hueShifts = [0, 30, 60, 120, 180, 210, 240, 300, 330, 45, 90];
    const names = [
      "primary",
      "secondary",
      "tertiary",
      "complement",
      "opposite",
      "warm1",
      "cool1",
      "accent1",
      "accent2",
      "highlight",
      "emphasis",
    ];

    hueShifts.forEach((shift, index) => {
      const name = names[index] || `variant${index}`;
      const adjustedHue = (baseHsl.h + shift) % 360;
      const rgb = this.utils.hslToRgb(adjustedHue, baseHsl.s, baseHsl.l);
      if (rgb) {
        variations[name] = this.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      }
    });

    return variations;
  }

  // TODO: Phase 3 - Generate neutral color variations
  private generateNeutralVariations(baseHsl: {
    h: number;
    s: number;
    l: number;
  }): { [key: string]: string } {
    const neutrals: { [key: string]: string } = {};

    // Generate lightness variants while maintaining hue and slight desaturation
    const lightnessLevels = [
      { name: "base", l: baseHsl.l },
      { name: "surface0", l: Math.min(95, baseHsl.l + 10) },
      { name: "surface1", l: Math.min(90, baseHsl.l + 20) },
      { name: "surface2", l: Math.min(85, baseHsl.l + 30) },
      { name: "overlay0", l: Math.min(80, baseHsl.l + 40) },
      { name: "overlay1", l: Math.min(75, baseHsl.l + 50) },
      { name: "text", l: Math.min(95, baseHsl.l + 60) },
    ];

    lightnessLevels.forEach((level) => {
      const rgb = this.utils.hslToRgb(
        baseHsl.h,
        Math.max(0, baseHsl.s - 20),
        level.l
      );
      if (rgb) {
        neutrals[level.name] = this.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
      }
    });

    return neutrals;
  }

  // TODO: Phase 3 - Detect color temperature
  private detectTemperature(
    baseHsl: any,
    accentHsl: any
  ): "warm" | "cool" | "neutral" {
    const avgHue = (baseHsl.h + accentHsl.h) / 2;

    // Warm: reds, oranges, yellows (0-60, 300-360)
    if ((avgHue >= 0 && avgHue <= 60) || (avgHue >= 300 && avgHue <= 360)) {
      return "warm";
    }
    // Cool: blues, greens, cyans (120-240)
    else if (avgHue >= 120 && avgHue <= 240) {
      return "cool";
    }
    // Neutral: magentas, purples (60-120, 240-300)
    else {
      return "neutral";
    }
  }

  // TODO: Phase 3 - Apply genre-specific color modifications
  private applyGenreColorModification(
    hexColor: string,
    temperatureShift: number,
    saturationBoost: number
  ): string {
    const rgb = this.utils.hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Apply temperature shift (hue adjustment)
    const adjustedHue = (hsl.h + temperatureShift + 360) % 360;

    // Apply saturation boost
    const adjustedSaturation = Math.max(
      0,
      Math.min(100, hsl.s * saturationBoost)
    );

    const modifiedRgb = this.utils.hslToRgb(
      adjustedHue,
      adjustedSaturation,
      hsl.l
    );
    if (modifiedRgb) {
      return this.utils.rgbToHex(modifiedRgb.r, modifiedRgb.g, modifiedRgb.b);
    }
    return hexColor;
  }

  // TODO: Phase 3 - Validate hex color format
  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // TODO: Phase 3 - Public API for getting genre hints
  public getGenreHints(genre: string) {
    return (
      GENRE_PALETTE_HINTS[genre as keyof typeof GENRE_PALETTE_HINTS] ||
      GENRE_PALETTE_HINTS.default
    );
  }

  // TODO: Phase 3 - Clear cache
  public clearCache(): void {
    this.paletteCache = {};
    if (this.config.enableDebug) {
      console.log("[PaletteExtensionManager] Palette cache cleared");
    }
  }
}
