import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { OKLCHColor } from "@/utils/color/OKLABColorProcessor";
import { GenreType } from "@/types/genre";
import * as ThemeUtilities from "./ThemeUtilities";

const DEFAULT_BASE_COLOR = "#1e1e2e";
const DEFAULT_ACCENT_COLOR = "#8caaee";
const DEFAULT_ACCENTS = {
  mauve: "#ca9ee6",
  pink: "#f4b8e4",
  blue: "#8caaee",
  sapphire: "#85c1dc",
  sky: "#99d1db",
  teal: "#81c8be",
  green: "#a6d189",
  yellow: "#e5c890",
  peach: "#ef9f76",
  red: "#e78284",
  lavender: "#babbf1",
} as const;
const DEFAULT_NEUTRALS = {
  base: DEFAULT_BASE_COLOR,
  surface0: "#313244",
  surface1: "#45475a",
  surface2: "#585b70",
  overlay0: "#6c7086",
  overlay1: "#7f849c",
  overlay2: "#9399b2",
  text: "#cdd6f4",
} as const;

type AccentVariationConfig = {
  name: string;
  hueShift: number;
  chromaScale: number;
  lightnessDelta: number;
};

const ACCENT_VARIATION_CONFIGS: readonly AccentVariationConfig[] = [
  { name: "primary", hueShift: 0, chromaScale: 1, lightnessDelta: 0 },
  { name: "secondary", hueShift: 25, chromaScale: 1.05, lightnessDelta: 0.03 },
  { name: "tertiary", hueShift: -25, chromaScale: 0.95, lightnessDelta: -0.02 },
  { name: "complement", hueShift: 180, chromaScale: 1, lightnessDelta: 0 },
  { name: "opposite", hueShift: 210, chromaScale: 0.9, lightnessDelta: 0.02 },
  { name: "warm1", hueShift: 35, chromaScale: 1.08, lightnessDelta: 0.015 },
  { name: "cool1", hueShift: -55, chromaScale: 0.92, lightnessDelta: 0.025 },
  { name: "accent1", hueShift: 60, chromaScale: 1.15, lightnessDelta: 0.05 },
  { name: "accent2", hueShift: -60, chromaScale: 1.15, lightnessDelta: -0.045 },
  { name: "highlight", hueShift: 15, chromaScale: 1.1, lightnessDelta: 0.08 },
  { name: "emphasis", hueShift: -15, chromaScale: 1.05, lightnessDelta: -0.07 },
];

const NEUTRAL_LEVELS: readonly { name: string; lightnessDelta: number }[] = [
  { name: "base", lightnessDelta: 0 },
  { name: "surface0", lightnessDelta: 0.04 },
  { name: "surface1", lightnessDelta: 0.08 },
  { name: "surface2", lightnessDelta: 0.12 },
  { name: "overlay0", lightnessDelta: 0.16 },
  { name: "overlay1", lightnessDelta: 0.2 },
  { name: "overlay2", lightnessDelta: 0.24 },
  { name: "text", lightnessDelta: 0.3 },
];

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

// Phase 3: Genre-specific color temperature mappings
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
  private config: AdvancedSystemConfig | Year3000Config;
  private utils: typeof ThemeUtilities;
  private paletteCache: PaletteCache = {};
  private cacheTTL: number = 300000; // 5 minutes
  private maxCacheSize: number = 50;
  private computedStyleCache: {
    style: CSSStyleDeclaration;
    timestamp: number;
  } | null = null;
  private readonly computedStyleCacheTTL = 250; // ms

  constructor(config: AdvancedSystemConfig | Year3000Config, utils: typeof ThemeUtilities) {
    this.config = config;
    this.utils = utils;
  }

  private getTimestamp(): number {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
      return performance.now();
    }
    return Date.now();
  }

  private getComputedRootStyle(): CSSStyleDeclaration | null {
    const root = this.utils.getRootStyle();
    if (!root) {
      return null;
    }

    const now = this.getTimestamp();
    if (
      this.computedStyleCache &&
      now - this.computedStyleCache.timestamp < this.computedStyleCacheTTL
    ) {
      return this.computedStyleCache.style;
    }

    const style = getComputedStyle(root);
    this.computedStyleCache = { style, timestamp: now };
    return style;
  }

  private normalizeHexColor(value: string | null | undefined): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    const candidate = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    const sixDigit = candidate.slice(0, 7);
    if (this.isValidHexColor(sixDigit)) {
      return sixDigit;
    }
    const threeDigit = candidate.slice(0, 4);
    if (this.isValidHexColor(threeDigit)) {
      return threeDigit;
    }
    return null;
  }

  private getStyleContext(): {
    baseColor: string;
    accentColor: string;
    dynamicBase?: string;
    dynamicAccent?: string;
  } {
    const computed = this.getComputedRootStyle();
    if (!computed) {
      return {
        baseColor: DEFAULT_BASE_COLOR,
        accentColor: DEFAULT_ACCENT_COLOR,
      };
    }

    const baseCandidates = [
      this.normalizeHexColor(computed.getPropertyValue("--spice-main")),
      this.normalizeHexColor(computed.getPropertyValue("--spice-base")),
      this.normalizeHexColor(computed.getPropertyValue("--sn-dynamic-base")),
    ];

    const accentCandidates = [
      this.normalizeHexColor(computed.getPropertyValue("--sn-gradient-accent")),
      this.normalizeHexColor(computed.getPropertyValue("--sn-dynamic-accent")),
      this.normalizeHexColor(computed.getPropertyValue("--spice-button")),
      this.normalizeHexColor(computed.getPropertyValue("--spice-accent")),
    ];

    const dynamicBase =
      this.normalizeHexColor(computed.getPropertyValue("--spice-base")) ||
      this.normalizeHexColor(computed.getPropertyValue("--sn-dynamic-base")) ||
      undefined;

    const dynamicAccent =
      this.normalizeHexColor(computed.getPropertyValue("--sn-dynamic-accent")) ||
      this.normalizeHexColor(computed.getPropertyValue("--spice-accent")) ||
      undefined;

    const context: {
      baseColor: string;
      accentColor: string;
      dynamicBase?: string;
      dynamicAccent?: string;
    } = {
      baseColor: baseCandidates.find(Boolean) || DEFAULT_BASE_COLOR,
      accentColor: accentCandidates.find(Boolean) || DEFAULT_ACCENT_COLOR,
    };

    if (dynamicBase) {
      context.dynamicBase = dynamicBase;
    }

    if (dynamicAccent) {
      context.dynamicAccent = dynamicAccent;
    }

    return context;
  }

  private hexToOklch(hex: string | null | undefined): OKLCHColor | null {
    const normalized = this.normalizeHexColor(hex ?? undefined);
    if (!normalized) {
      return null;
    }

    const rgb = this.utils.hexToRgb(normalized);
    if (!rgb) {
      return null;
    }

    const oklab = this.utils.rgbToOklab(rgb.r, rgb.g, rgb.b);
    const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
    const h = this.normalizeHue((Math.atan2(oklab.b, oklab.a) * 180) / Math.PI);

    return {
      L: this.clampLightness(oklab.L),
      C: this.clampChroma(c),
      H: h,
    };
  }

  private oklchToHex(color: OKLCHColor): string {
    const hueRadians = (this.normalizeHue(color.H) * Math.PI) / 180;
    const a = this.clampChroma(color.C) * Math.cos(hueRadians);
    const b = this.clampChroma(color.C) * Math.sin(hueRadians);
    const rgb = this.utils.oklabToRgb(this.clampLightness(color.L), a, b);
    return this.utils.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  private clampLightness(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(1, Math.max(0, value));
  }

  private clampChroma(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(0.4, Math.max(0, value));
  }

  private normalizeHue(value: number): number {
    if (!Number.isFinite(value)) return 0;
    const normalized = value % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  private averageHue(h1: number, h2: number): number {
    const h1Rad = (this.normalizeHue(h1) * Math.PI) / 180;
    const h2Rad = (this.normalizeHue(h2) * Math.PI) / 180;
    const avgX = Math.cos(h1Rad) + Math.cos(h2Rad);
    const avgY = Math.sin(h1Rad) + Math.sin(h2Rad);
    if (avgX === 0 && avgY === 0) {
      return this.normalizeHue(h1);
    }
    return this.normalizeHue((Math.atan2(avgY, avgX) * 180) / Math.PI);
  }

  private adjustAccentColor(base: OKLCHColor, config: AccentVariationConfig): string {
    const adjusted: OKLCHColor = {
      L: this.clampLightness(base.L + config.lightnessDelta),
      C: this.clampChroma(base.C * config.chromaScale),
      H: this.normalizeHue(base.H + config.hueShift),
    };
    return this.oklchToHex(adjusted);
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

  // Phase 3: Generate fallback palette for unknown themes using OKLAB adjustments
  public generateFallbackPalette(themeName: string): CustomPalette {
    const { baseColor, accentColor, dynamicBase, dynamicAccent } =
      this.getStyleContext();

    const baseOklch =
      this.hexToOklch(baseColor) ||
      (dynamicBase ? this.hexToOklch(dynamicBase) : null);
    const accentOklch =
      this.hexToOklch(accentColor) ||
      (dynamicAccent ? this.hexToOklch(dynamicAccent) : null);

    if (!baseOklch || !accentOklch) {
      return this.buildDefaultFallbackPalette(
        themeName,
        dynamicBase,
        dynamicAccent
      );
    }

    const accents = this.generateAccentVariations(accentOklch);
    const neutrals = this.generateNeutralVariations(baseOklch);

    return {
      name: themeName,
      version: "1.0.0",
      accents,
      neutrals,
      metadata: {
        author: "PaletteExtensionManager",
        description: `Generated palette for ${themeName}`,
        temperature: this.detectTemperature(baseOklch, accentOklch),
      },
    };
  }

  private buildDefaultFallbackPalette(
    themeName: string,
    dynamicBase?: string,
    dynamicAccent?: string
  ): CustomPalette {
    const accentFallback = dynamicAccent || undefined;
    const baseFallback = dynamicBase || undefined;

    return {
      name: themeName,
      version: "1.0.0",
      accents: {
        mauve: accentFallback || DEFAULT_ACCENTS.mauve,
        pink: DEFAULT_ACCENTS.pink,
        blue: accentFallback || DEFAULT_ACCENTS.blue,
        sapphire: DEFAULT_ACCENTS.sapphire,
        sky: DEFAULT_ACCENTS.sky,
        teal: DEFAULT_ACCENTS.teal,
        green: DEFAULT_ACCENTS.green,
        yellow: DEFAULT_ACCENTS.yellow,
        peach: DEFAULT_ACCENTS.peach,
        red: DEFAULT_ACCENTS.red,
        lavender: DEFAULT_ACCENTS.lavender,
      },
      neutrals: {
        base: baseFallback || DEFAULT_NEUTRALS.base,
        surface0: DEFAULT_NEUTRALS.surface0,
        surface1: DEFAULT_NEUTRALS.surface1,
        surface2: DEFAULT_NEUTRALS.surface2,
        overlay0: DEFAULT_NEUTRALS.overlay0,
        overlay1: DEFAULT_NEUTRALS.overlay1,
        overlay2: DEFAULT_NEUTRALS.overlay2,
        text: DEFAULT_NEUTRALS.text,
      },
      metadata: {
        author: "PaletteExtensionManager",
        description: `Generated fallback for ${themeName}`,
        temperature: "neutral",
      },
    };
  }

  // Phase 3: Apply genre-aware modifications to palette using OKLAB blending
  public applyGenreAwareModifications(
    palette: CustomPalette,
    genre: GenreType
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

  // Phase 3: Validate palette structure and required properties
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

  // Phase 3: Cache management
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

  private generateAccentVariations(base: OKLCHColor): { [key: string]: string } {
    const variations: { [key: string]: string } = {};

    ACCENT_VARIATION_CONFIGS.forEach((config) => {
      variations[config.name] = this.adjustAccentColor(base, config);
    });

    return variations;
  }

  private generateNeutralVariations(base: OKLCHColor): { [key: string]: string } {
    const neutrals: { [key: string]: string } = {};
    const baseChroma = this.clampChroma(base.C * 0.2);

    NEUTRAL_LEVELS.forEach((level, index) => {
      const chromaScale = Math.max(0, 1 - index * 0.12);
      const adjusted: OKLCHColor = {
        L: this.clampLightness(base.L + level.lightnessDelta),
        C: this.clampChroma(baseChroma * chromaScale),
        H: base.H,
      };
      neutrals[level.name] = this.oklchToHex(adjusted);
    });

    return neutrals;
  }

  private detectTemperature(
    base: OKLCHColor,
    accent: OKLCHColor
  ): "warm" | "cool" | "neutral" {
    const avgHue = this.averageHue(base.H, accent.H);

    if ((avgHue >= 0 && avgHue <= 60) || (avgHue >= 300 && avgHue < 360)) {
      return "warm";
    }
    if (avgHue >= 120 && avgHue <= 240) {
      return "cool";
    }
    return "neutral";
  }

  private applyGenreColorModification(
    hexColor: string,
    temperatureShift: number,
    saturationBoost: number
  ): string {
    const color = this.hexToOklch(hexColor);
    if (!color) {
      return hexColor;
    }

    const adjusted: OKLCHColor = {
      L: this.clampLightness(color.L),
      C: this.clampChroma(color.C * saturationBoost),
      H: this.normalizeHue(color.H + temperatureShift),
    };

    return this.oklchToHex(adjusted);
  }

  // TODO: Phase 3 - Validate hex color format
  private isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  // Phase 3: Public API for getting genre hints
  public getGenreHints(genre: GenreType) {
    return (
      GENRE_PALETTE_HINTS[genre as keyof typeof GENRE_PALETTE_HINTS] ||
      GENRE_PALETTE_HINTS.default
    );
  }

  // Phase 3: Clear cache
  public clearCache(): void {
    this.paletteCache = {};
    this.computedStyleCache = null;
    if (this.config.enableDebug) {
      console.log("[PaletteExtensionManager] Palette cache cleared");
    }
  }
}
