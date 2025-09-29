/**
 * MusicalOKLABProcessor - Unified Music-to-OKLAB Color Processing Pipeline
 *
 * Processes the complete flow from music analysis through emotional mapping
 * to OKLAB color processing, providing a unified, perceptually consistent
 * color experience that responds intelligently to musical content.
 *
 * Technical Approach: Music becomes color through systematic audio-visual processing -
 * every note, every beat, every emotion transformed into perceptually accurate
 * visual harmony through OKLAB color science implementation.
 */

import { GenreProfileManager } from "@/audio/GenreProfileManager";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { ColorResult } from "@/types/colorStrategy";
import {
  EmotionalTemperatureMapper,
  type EmotionalTemperatureResult,
  type MusicAnalysisData,
} from "./EmotionalTemperatureMapper";
import {
  OKLABColorProcessor,
  type EnhancementPreset,
  type OKLABProcessingResult,
} from "./OKLABColorProcessor";

export interface MusicalColorContext {
  musicData: MusicAnalysisData;
  rawColors: Record<string, string>;
  trackUri: string;
  timestamp: number;
  harmonicMode?: string;
}

export interface MusicalOKLABResult {
  // Enhanced color palette
  enhancedColors: Record<string, string>;
  accentHex: string;
  accentRgb: string;

  // OKLAB processing metadata
  oklabPreset: EnhancementPreset;
  oklabResults: Record<string, OKLABProcessingResult>;

  // Musical context
  detectedGenre: string;
  emotionalResult: EmotionalTemperatureResult;
  genreCharacteristics: any;

  // Processing metadata
  processingTime: number;
  musicInfluenceStrength: number;
  processingStrategy:
    | "genre-primary"
    | "emotion-primary"
    | "balanced"
    | "fallback";

  // CSS variables for visual systems
  cssVariables: Record<string, string>;
}

export interface ProcessingOptions {
  preferGenreOverEmotion?: boolean;
  intensityMultiplier?: number;
  enableAdvancedBlending?: boolean;
  enableDebugLogging?: boolean;
}


export class MusicalOKLABProcessor {
  private oklabProcessor: OKLABColorProcessor;
  private emotionalMapper: EmotionalTemperatureMapper;
  private genreManager: GenreProfileManager;

  private enableDebug: boolean;
  private coordinationCache = new Map<string, MusicalOKLABResult>();
  private cacheMaxSize = 20;
  private cacheTimeoutMs = 300000; // 5 minutes

  constructor(enableDebug: boolean = ADVANCED_SYSTEM_CONFIG.enableDebug) {
    this.enableDebug = enableDebug;

    // Initialize integrated processors
    this.oklabProcessor = new OKLABColorProcessor(enableDebug);
    this.emotionalMapper = new EmotionalTemperatureMapper(enableDebug);
    this.genreManager = new GenreProfileManager({ ADVANCED_SYSTEM_CONFIG });

    if (this.enableDebug) {
      Y3KDebug?.debug?.log(
        "MusicalOKLABProcessor",
        "Unified music-to-OKLAB coordinator initialized"
      );
    }
  }

  /**
   * Main processing method - transforms musical context through complete OKLAB pipeline
   */
  public async processMusicalColors(
    context: MusicalColorContext,
    options: ProcessingOptions = {}
  ): Promise<MusicalOKLABResult> {
    const startTime = performance.now();

    // Check cache first
    const cacheKey = this.generateCacheKey(context);
    const cachedResult = this.coordinationCache.get(cacheKey);
    if (cachedResult) {
      if (this.enableDebug) {
        Y3KDebug?.debug?.log(
          "MusicalOKLABProcessor",
          "Using cached processing result",
          { cacheKey }
        );
      }
      return cachedResult;
    }

    try {
      // Step 1: Analyze music and determine processing strategy
      const processingStrategy = this.determineProcessingStrategy(
        context,
        options
      );

      // Step 2: Get optimal OKLAB preset through genre and emotional analysis
      const oklabPreset = await this.getOptimalOKLABPreset(
        context,
        processingStrategy,
        options
      );

      // Step 3: Process all colors through unified OKLAB pipeline
      const colorProcessingResult = await this.processColorsWithMusicalContext(
        context.rawColors,
        context.musicData,
        oklabPreset
      );

      // Step 4: Generate emotional temperature mapping
      const emotionalResult =
        this.emotionalMapper.mapMusicToEmotionalTemperature(context.musicData);

      // Step 5: Get genre characteristics
      const detectedGenre = this.genreManager.detectGenre(context.musicData);
      const genreCharacteristics =
        this.genreManager.getColorCharacteristicsForGenre(detectedGenre);

      // Step 6: Calculate music influence strength
      const musicInfluenceStrength = this.calculateMusicInfluenceStrength(
        context.musicData,
        emotionalResult
      );

      // Step 7: Generate comprehensive CSS variables
      const cssVariables = this.generateUnifiedCSSVariables(
        colorProcessingResult,
        emotionalResult,
        genreCharacteristics,
        oklabPreset
      );

      // Step 8: Determine accent color from enhanced palette
      const { accentHex, accentRgb } = this.selectOptimalAccentColor(
        colorProcessingResult
      );

      const processingTime = performance.now() - startTime;

      const result: MusicalOKLABResult = {
        enhancedColors: Object.fromEntries(
          Object.entries(colorProcessingResult).map(([key, oklabResult]) => [
            key,
            oklabResult.enhancedHex,
          ])
        ),
        accentHex,
        accentRgb,
        oklabPreset,
        oklabResults: colorProcessingResult,
        detectedGenre,
        emotionalResult,
        genreCharacteristics,
        processingTime,
        musicInfluenceStrength,
        processingStrategy,
        cssVariables,
      };

      // Cache the result
      this.cacheResult(cacheKey, result);

      if (this.enableDebug) {
        Y3KDebug?.debug?.log(
          "MusicalOKLABProcessor",
          "Musical OKLAB processing completed",
          {
            genre: detectedGenre,
            emotion: emotionalResult.primaryEmotion,
            strategy: processingStrategy,
            preset: oklabPreset.name,
            processingTime,
            colorCount: Object.keys(colorProcessingResult).length,
          }
        );
      }

      return result;
    } catch (error) {
      if (this.enableDebug) {
        Y3KDebug?.debug?.error(
          "MusicalOKLABProcessor",
          "Musical processing failed:",
          error
        );
      }

      // Return fallback result
      return this.createFallbackResult(context, performance.now() - startTime);
    }
  }


  /**
   * Determine the optimal processing strategy based on musical context
   */
  private determineProcessingStrategy(
    context: MusicalColorContext,
    options: ProcessingOptions
  ): "genre-primary" | "emotion-primary" | "balanced" | "fallback" {
    const { musicData } = context;

    // Check if we have sufficient music data
    if (
      !musicData ||
      typeof musicData.energy !== "number" ||
      typeof musicData.valence !== "number"
    ) {
      return "fallback";
    }

    // Check user preferences
    if (options.preferGenreOverEmotion === true) {
      return "genre-primary";
    } else if (options.preferGenreOverEmotion === false) {
      return "emotion-primary";
    }

    // Intelligent strategy selection based on music characteristics
    const energyExtremity = Math.abs(musicData.energy - 0.5) * 2; // 0-1 scale
    const valenceExtremity = Math.abs(musicData.valence - 0.5) * 2; // 0-1 scale
    const emotionalExtremity = (energyExtremity + valenceExtremity) / 2;

    // If music has strong emotional characteristics, prefer emotion-based processing
    if (emotionalExtremity > 0.6) {
      return "emotion-primary";
    }

    // If we have a clear genre detection, prefer genre-based processing
    const detectedGenre = this.genreManager.detectGenre(musicData);
    if (detectedGenre !== "default") {
      return "genre-primary";
    }

    // Default to balanced approach
    return "balanced";
  }


  /**
   * Get optimal OKLAB preset considering both genre and emotional context
   */
  private async getOptimalOKLABPreset(
    context: MusicalColorContext,
    strategy: string,
    options: ProcessingOptions
  ): Promise<EnhancementPreset> {
    const { musicData } = context;

    try {
      let preset: EnhancementPreset;

      switch (strategy) {
        case "genre-primary":
          preset = this.genreManager.getOKLABPresetForTrack(musicData);
          break;

        case "emotion-primary":
          const emotionalResult =
            this.emotionalMapper.mapMusicToEmotionalTemperature(musicData);
          preset = emotionalResult.oklabPreset;
          break;

        case "balanced":
          // Blend genre and emotional recommendations
          const genrePreset =
            this.genreManager.getOKLABPresetForTrack(musicData);
          const emotionalResult2 =
            this.emotionalMapper.mapMusicToEmotionalTemperature(musicData);
          preset = this.processBlendedPresets(
            genrePreset,
            emotionalResult2.oklabPreset,
            options.intensityMultiplier || 1.0
          );
          break;

        default: // fallback
          preset = OKLABColorProcessor.getPreset("STANDARD");
      }

      return preset;
    } catch (error) {
      if (this.enableDebug) {
        Y3KDebug?.debug?.warn(
          "MusicalOKLABProcessor",
          "Failed to get optimal preset, using STANDARD:",
          error
        );
      }
      return OKLABColorProcessor.getPreset("STANDARD");
    }
  }

  /**
   * Process two OKLAB presets for balanced processing strategy
   */
  private processBlendedPresets(
    genrePreset: EnhancementPreset,
    emotionalPreset: EnhancementPreset,
    intensityMultiplier: number
  ): EnhancementPreset {
    const blendedChromaBoost =
      ((genrePreset.chromaBoost + emotionalPreset.chromaBoost) / 2) *
      intensityMultiplier;
    const blendedLightnessBoost =
      (genrePreset.lightnessBoost + emotionalPreset.lightnessBoost) / 2;
    const blendedShadowReduction =
      (genrePreset.shadowReduction + emotionalPreset.shadowReduction) / 2;
    const blendedVibrantThreshold =
      (genrePreset.vibrantThreshold + emotionalPreset.vibrantThreshold) / 2;

    return OKLABColorProcessor.createCustomPreset(
      "blended-genre-emotion",
      `Blended ${genrePreset.name} + ${emotionalPreset.name}`,
      blendedLightnessBoost,
      blendedChromaBoost,
      blendedShadowReduction,
      blendedVibrantThreshold
    );
  }

  /**
   * Process all colors through OKLAB with musical context
   */
  private async processColorsWithMusicalContext(
    rawColors: Record<string, string>,
    musicData: MusicAnalysisData,
    preset: EnhancementPreset
  ): Promise<Record<string, OKLABProcessingResult>> {
    const results: Record<string, OKLABProcessingResult> = {};

    for (const [key, color] of Object.entries(rawColors)) {
      if (!color || typeof color !== "string" || !color.startsWith("#")) {
        continue;
      }

      try {
        const oklabResult = this.oklabProcessor.processColor(color, preset);
        results[key] = oklabResult;
      } catch (error) {
        if (this.enableDebug) {
          Y3KDebug?.debug?.warn(
            "MusicalOKLABProcessor",
            `Failed to process color ${key}:`,
            error
          );
        }
      }
    }

    return results;
  }

  /**
   * Calculate music influence strength for processing
   */
  private calculateMusicInfluenceStrength(
    musicData: MusicAnalysisData,
    emotionalResult: EmotionalTemperatureResult
  ): number {
    const energyInfluence = musicData.energy || 0.5;
    const valenceExtremity = Math.abs((musicData.valence || 0.5) - 0.5) * 2;
    const emotionalIntensity = emotionalResult.intensity;

    // Combine factors to determine overall music influence
    const baseInfluence =
      (energyInfluence + valenceExtremity + emotionalIntensity) / 3;

    // Boost influence if we have additional musical context
    let contextBoost = 1.0;
    if (musicData.tempo && musicData.tempo > 0) contextBoost += 0.1;
    if (musicData.danceability && musicData.danceability > 0.7)
      contextBoost += 0.1;
    if (musicData.genre && musicData.genre !== "default") contextBoost += 0.1;

    return Math.min(1.0, baseInfluence * contextBoost);
  }

  /**
   * Generate comprehensive CSS variables for all visual systems
   */
  private generateUnifiedCSSVariables(
    oklabResults: Record<string, OKLABProcessingResult>,
    emotionalResult: EmotionalTemperatureResult,
    genreCharacteristics: any,
    preset: EnhancementPreset
  ): Record<string, string> {
    const variables: Record<string, string> = {};

    // OKLAB color variables
    Object.entries(oklabResults).forEach(([key, result]) => {
      variables[`--sn-${key.toLowerCase()}-enhanced`] = result.enhancedHex;
      variables[`--sn-${key.toLowerCase()}-oklab-l`] =
        result.oklabEnhanced.L.toFixed(3);
      variables[`--sn-${key.toLowerCase()}-oklab-a`] =
        result.oklabEnhanced.a.toFixed(3);
      variables[`--sn-${key.toLowerCase()}-oklab-b`] =
        result.oklabEnhanced.b.toFixed(3);
      variables[`--sn-${key.toLowerCase()}-oklch-c`] =
        result.oklchEnhanced.C.toFixed(3);
      variables[`--sn-${key.toLowerCase()}-oklch-h`] =
        result.oklchEnhanced.H.toFixed(1);
      variables[`--sn-${key.toLowerCase()}-shadow`] = result.shadowHex;
    });

    // Emotional temperature variables from EmotionalTemperatureMapper
    Object.entries(emotionalResult.cssVariables).forEach(([key, value]) => {
      variables[key] = value;
    });

    // Genre-specific variables
    variables["--sn-detected-genre"] = genreCharacteristics
      ? genreCharacteristics.vibrancyLevel
      : "standard";
    variables["--sn-color-temperature"] = genreCharacteristics
      ? genreCharacteristics.colorTemperature
      : "neutral";
    variables["--sn-emotional-range"] = genreCharacteristics
      ? genreCharacteristics.emotionalRange
      : "moderate";

    // OKLAB preset metadata
    variables["--sn-oklab-preset-name"] = preset.name;
    variables["--sn-oklab-chroma-boost"] = preset.chromaBoost.toString();
    variables["--sn-oklab-lightness-boost"] = preset.lightnessBoost.toString();

    // Processing metadata
    variables["--sn-musical-oklab-processing"] = "enabled";
    variables["--sn-color-processing-mode"] = "unified-musical-oklab";

    return variables;
  }

  /**
   * Select optimal accent color from enhanced palette
   */
  private selectOptimalAccentColor(
    oklabResults: Record<string, OKLABProcessingResult>
  ): { accentHex: string; accentRgb: string } {
    // Priority order for accent color selection
    const priorityKeys = [
      "VIBRANT",
      "PROMINENT",
      "DARK_VIBRANT",
      "LIGHT_VIBRANT",
    ];

    for (const key of priorityKeys) {
      if (oklabResults[key]) {
        const result = oklabResults[key];
        return {
          accentHex: result.enhancedHex,
          accentRgb: `${result.enhancedRgb.r},${result.enhancedRgb.g},${result.enhancedRgb.b}`,
        };
      }
    }

    // Fallback to first available color
    const firstResult = Object.values(oklabResults)[0];
    if (firstResult) {
      return {
        accentHex: firstResult.enhancedHex,
        accentRgb: `${firstResult.enhancedRgb.r},${firstResult.enhancedRgb.g},${firstResult.enhancedRgb.b}`,
      };
    }

    // Ultimate fallback
    return {
      accentHex: "#cba6f7", // Catppuccin mauve
      accentRgb: "203,166,247",
    };
  }

  /**
   * Create fallback result when coordination fails
   */
  private createFallbackResult(
    context: MusicalColorContext,
    processingTime: number
  ): MusicalOKLABResult {
    const fallbackPreset = OKLABColorProcessor.getPreset("STANDARD");

    return {
      enhancedColors: context.rawColors,
      accentHex: "#cba6f7",
      accentRgb: "203,166,247",
      oklabPreset: fallbackPreset,
      oklabResults: {},
      detectedGenre: "default",
      emotionalResult: {
        primaryEmotion: "calm",
        intensity: 0.5,
        temperature: 3500,
        blendRatio: 1.0,
        cssClass: "smooth-emotion-calm",
        cssVariables: {},
        oklabPreset: fallbackPreset,
      } as EmotionalTemperatureResult,
      genreCharacteristics: {
        vibrancyLevel: "standard",
        emotionalRange: "moderate",
        colorTemperature: "neutral",
      },
      processingTime,
      musicInfluenceStrength: 0.5,
      processingStrategy: "fallback",
      cssVariables: {
        "--sn-musical-oklab-processing": "fallback",
        "--sn-oklab-preset-name": "STANDARD",
      },
    };
  }

  // Utility methods
  private generateCacheKey(context: MusicalColorContext): string {
    return `${context.trackUri}-${context.timestamp}-${JSON.stringify(
      context.musicData
    )}`;
  }

  private cacheResult(cacheKey: string, result: MusicalOKLABResult): void {
    // Implement LRU cache
    if (this.coordinationCache.size >= this.cacheMaxSize) {
      const firstKey = this.coordinationCache.keys().next().value;
      if (firstKey) this.coordinationCache.delete(firstKey);
    }

    this.coordinationCache.set(cacheKey, result);

    // Set cache timeout
    setTimeout(() => {
      this.coordinationCache.delete(cacheKey);
    }, this.cacheTimeoutMs);
  }

  /**
   * Convert MusicalOKLABResult to ColorResult for integration with existing systems
   */
  public convertToColorResult(
    musicalResult: MusicalOKLABResult,
    context: MusicalColorContext
  ): ColorResult {
    return {
      processedColors: {
        ...musicalResult.enhancedColors,
        ...musicalResult.cssVariables,
      },
      accentHex: musicalResult.accentHex,
      accentRgb: musicalResult.accentRgb,
      metadata: {
        strategy: "musical-oklab-processor",
        processingTime: musicalResult.processingTime,
        detectedGenre: musicalResult.detectedGenre,
        emotionalState: musicalResult.emotionalResult.primaryEmotion,
        oklabPreset: musicalResult.oklabPreset.name,
        processingStrategy: musicalResult.processingStrategy,
        musicInfluenceStrength: musicalResult.musicInfluenceStrength,
      },
      context: {
        rawColors: context.rawColors,
        trackUri: context.trackUri,
        timestamp: context.timestamp,
        harmonicMode: context.harmonicMode || "musical-oklab-processing",
        musicData: context.musicData,
      },
    };
  }

  /**
   * Clear processing cache
   */
  public clearProcessingCache(): void {
    this.coordinationCache.clear();
    if (this.enableDebug) {
      Y3KDebug?.debug?.log(
        "MusicalOKLABProcessor",
        "Processing cache cleared"
      );
    }
  }

  /**
   * Get processing metrics for monitoring
   */
  public getProcessingMetrics(): any {
    return {
      cacheSize: this.coordinationCache.size,
      maxCacheSize: this.cacheMaxSize,
      cacheTimeoutMs: this.cacheTimeoutMs,
      enableDebug: this.enableDebug,
    };
  }
}

// Backward compatibility alias
export const MusicalOKLABCoordinator = MusicalOKLABProcessor;
