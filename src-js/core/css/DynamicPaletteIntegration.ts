/**
 * DynamicPaletteIntegration - Service Class for Dynamic OKLCH Palette Generation
 *
 * Wraps DynamicOKLCHPaletteGenerator to provide integration layer for:
 * - Palette generation with CSS variables (for ColorStateManager)
 * - Palette color-only generation (for color strategies)
 * - Performance metrics and caching
 * - Feature flag management
 */

import { DynamicOKLCHPaletteGenerator } from "@/utils/color/DynamicOKLCHPaletteGenerator";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";

export interface PaletteGenerationRequest {
  baseColor: string;
  accentColor: string;
  brightnessMode: "dark" | "light";
  paletteSystem: string;
}

export interface PaletteGenerationResult {
  palette: Record<string, string>;
  cssVariables: Record<string, string>;
  generationTimeMs: number;
  cacheHit: boolean;
}

export class DynamicPaletteIntegration {
  private generator: DynamicOKLCHPaletteGenerator;
  private lastGenerationTime: number = 0;
  private lastCacheHit: boolean = false;
  private enableDebug: boolean;

  constructor(enableDebug: boolean = false) {
    this.enableDebug = enableDebug || ADVANCED_SYSTEM_CONFIG.enableDebug;
    this.generator = new DynamicOKLCHPaletteGenerator(this.enableDebug);

    if (this.enableDebug) {
      console.log("[DynamicPaletteIntegration] Initialized with debug logging");
    }
  }

  /**
   * Generate full palette with CSS variables (for ColorStateManager CSS writes)
   */
  generatePalette(request: PaletteGenerationRequest): PaletteGenerationResult {
    const startTime = performance.now();
    const aestheticProfile = request.paletteSystem === "year3000" ? "year3000" : "catppuccin";

    if (this.enableDebug) {
      console.log("[DynamicPaletteIntegration] Generating palette:", {
        baseColor: request.baseColor,
        accentColor: request.accentColor,
        brightnessMode: request.brightnessMode,
        aestheticProfile,
      });
    }

    const cacheKeyBefore = this.getCacheKey(request);
    const wasCached = this.isCached(cacheKeyBefore);

    const palette = this.generator.generatePalette({
      base: request.baseColor,
      accent: request.accentColor,
      brightnessMode: request.brightnessMode,
      aestheticProfile,
    });

    const cssVariables = this.generator.generateCSSVariables(palette);

    const endTime = performance.now();
    const generationTimeMs = endTime - startTime;

    this.lastGenerationTime = generationTimeMs;
    this.lastCacheHit = wasCached;

    if (this.enableDebug) {
      console.log("[DynamicPaletteIntegration] Palette generated:", {
        generationTimeMs: generationTimeMs.toFixed(2),
        cacheHit: wasCached,
        colorCount: Object.keys(palette).length,
        cssVariableCount: Object.keys(cssVariables).length,
      });

      console.log("[DynamicPaletteIntegration] Sample colors:", {
        base: palette.base,
        accent: palette.blue,
        text: palette.text,
      });
    }

    return {
      palette,
      cssVariables,
      generationTimeMs,
      cacheHit: wasCached,
    };
  }

  /**
   * PHASE 4A: Get palette colors only (for strategy processing)
   *
   * Generates or retrieves cached palette without CSS variable generation.
   * Intended for color strategies that need access to OKLCH-generated colors
   * for gradient/visual processing but don't write CSS directly.
   *
   * @param request - Palette generation request
   * @returns Generated palette object (26 colors: 14 semantic + 12 surface)
   * @since Phase 4A - Strategy-Level Palette Integration
   */
  getPaletteColorsOnly(request: PaletteGenerationRequest): Record<string, string> {
    const aestheticProfile = request.paletteSystem === "year3000" ? "year3000" : "catppuccin";

    const palette = this.generator.generatePalette({
      base: request.baseColor,
      accent: request.accentColor,
      brightnessMode: request.brightnessMode,
      aestheticProfile,
    });

    if (this.enableDebug) {
      console.log("[DynamicPaletteIntegration] Palette colors retrieved for strategy processing:", {
        colorCount: Object.keys(palette).length,
        cacheHit: this.isCached(this.getCacheKey(request)),
      });
    }

    return palette;
  }

  shouldUseDynamicGeneration(): boolean {
    const featureFlagEnabled = ADVANCED_SYSTEM_CONFIG.useDynamicPalettes === true;

    if (this.enableDebug && featureFlagEnabled) {
      console.log("[DynamicPaletteIntegration] Dynamic palette generation ENABLED");
    }

    return featureFlagEnabled;
  }

  clearCache(): void {
    if (this.enableDebug) {
      console.log("[DynamicPaletteIntegration] Clearing palette cache");
    }
    this.generator.clearCache();
  }

  getLastGenerationMetrics() {
    return {
      generationTimeMs: this.lastGenerationTime,
      cacheHit: this.lastCacheHit,
    };
  }

  private getCacheKey(request: PaletteGenerationRequest): string {
    const aestheticProfile = request.paletteSystem === "year3000" ? "year3000" : "catppuccin";
    return `${request.baseColor}-${request.accentColor}-${request.brightnessMode}-${aestheticProfile}`;
  }

  private isCached(cacheKey: string): boolean {
    return this.generator.paletteCache?.has(cacheKey) ?? false;
  }
}
