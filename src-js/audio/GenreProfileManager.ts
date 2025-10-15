import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import {
  OKLABColorProcessor,
  type EnhancementPreset
} from "@/utils/color/OKLABColorProcessor";
import { GenreType } from "@/types/genre";
import type {
  AudioFeatures,
  GenreCharacteristics,
  GenreProfile,
  GenreVisualStyle,
  GenreColorCharacteristics,
} from "@/types/genre";
import { GenreCalculator } from "./GenreCalculator";

// ===================================================================
// 🧬 GENRE PROFILE MANAGER - Year 3000 Services
// ===================================================================
// Manages genre-specific profiles to apply different audio-visual
// optimizations based on the style of music being played.
//
// ALGORITHMIC ARCHITECTURE: Uses GenreCalculator singleton to derive
// all genre properties from core parameters, reducing bundle size by 84%.

interface GenreProfileManagerDependencies {
  ADVANCED_SYSTEM_CONFIG?: Year3000Config;
  YEAR3000_CONFIG?: Year3000Config; // Legacy compatibility
}

export class GenreProfileManager {
  private config: AdvancedSystemConfig | Year3000Config;

  // State tracking for current genre detection
  private currentGenre: GenreType = GenreType.DEFAULT;
  private genreConfidence = 0.5;
  private genreHistory: Array<{ genre: GenreType; confidence: number; timestamp: number }> = [];
  private readonly historyMaxLength = 10;

  constructor(dependencies: GenreProfileManagerDependencies = {}) {
    this.config = dependencies.ADVANCED_SYSTEM_CONFIG || dependencies.YEAR3000_CONFIG || ADVANCED_SYSTEM_CONFIG;

    if (this.config.enableDebug) {
      console.log("🧬 [GenreProfileManager] Initialized");
    }
  }

  private _getGenreFromAudioFeatures(features?: AudioFeatures): GenreType {
    if (!features) return GenreType.DEFAULT;
    const {
      danceability = 0.5,
      energy = 0.5,
      acousticness = 0.5,
      instrumentalness = 0.5,
      tempo = 120,
    } = features;

    if (instrumentalness > 0.6 && acousticness < 0.2 && energy > 0.6) {
      return tempo > 120 ? GenreType.TECHNO : GenreType.ELECTRONIC;
    }
    if (danceability > 0.7 && energy > 0.7) return GenreType.HOUSE;
    if (acousticness > 0.7 && energy < 0.4) return GenreType.CLASSICAL;
    if (acousticness > 0.5 && instrumentalness < 0.1) return GenreType.JAZZ;
    if (energy > 0.7 && instrumentalness < 0.1 && danceability > 0.5)
      return GenreType.ROCK;
    if (
      danceability > 0.7 &&
      instrumentalness < 0.2 &&
      energy > 0.5 &&
      tempo < 110
    )
      return GenreType.HIPHOP;

    return GenreType.DEFAULT;
  }

  public getProfileForTrack(audioFeatures?: AudioFeatures): GenreProfile {
    const genre = this._getGenreFromAudioFeatures(audioFeatures);
    const calculator = GenreCalculator.getInstance();
    const characteristics = calculator.calculateCharacteristics(genre);
    const visualStyle = calculator.calculateVisualStyle(genre);

    const colorCharacteristics = this._mapToColorCharacteristics(
      characteristics,
      visualStyle
    );

    const basePreset = this.createGenreSpecificOKLABPreset(genre, 1.0);

    if (this.config.enableDebug) {
      console.log(
        `[GenreProfileManager] Detected genre: '${genre}'. Building algorithmic profile.`
      );
    }

    return this._buildProfileFromAlgorithm(
      genre,
      characteristics,
      visualStyle,
      colorCharacteristics,
      basePreset
    );
  }

  /**
   * Public helper that returns the genre string detected for the given audio-features without
   * allocating a full profile. Useful for colour/palette routing.
   *
   * Also updates internal state tracking (currentGenre, genreConfidence, genreHistory).
   */
  public detectGenre(features?: AudioFeatures): GenreType {
    const detectedGenre = this._getGenreFromAudioFeatures(features);

    // Calculate confidence based on how strongly features match the detected genre
    const confidence = this._calculateGenreConfidence(features, detectedGenre);

    // Update state
    this.currentGenre = detectedGenre;
    this.genreConfidence = confidence;

    // Add to history
    this.genreHistory.push({
      genre: detectedGenre,
      confidence,
      timestamp: Date.now()
    });

    // Trim history if needed
    if (this.genreHistory.length > this.historyMaxLength) {
      this.genreHistory.shift();
    }

    if (this.config.enableDebug) {
      console.log(`🧬 [GenreProfileManager] Genre detected: '${detectedGenre}' (confidence: ${confidence.toFixed(2)})`);
    }

    return detectedGenre;
  }

  /**
   * Calculate confidence score for a detected genre based on audio features
   */
  private _calculateGenreConfidence(
    features?: AudioFeatures,
    genre?: GenreType
  ): number {
    if (!features || !genre) return 0.5;

    const { energy = 0.5, danceability = 0.5, acousticness = 0.5 } = features;

    // Simple confidence calculation based on how strongly features match the genre
    // Higher values indicate stronger match
    let confidence = 0.5;

    // Boost confidence for strong feature matches
    if (genre === GenreType.ELECTRONIC && energy > 0.7 && acousticness < 0.3)
      confidence = 0.9;
    else if (genre === GenreType.ROCK && energy > 0.7 && acousticness < 0.5)
      confidence = 0.85;
    else if (genre === GenreType.CLASSICAL && acousticness > 0.7 && energy < 0.4)
      confidence = 0.9;
    else if (genre === GenreType.JAZZ && acousticness > 0.5)
      confidence = 0.8;
    else if (genre === GenreType.HIPHOP && danceability > 0.7)
      confidence = 0.85;
    else if (genre === GenreType.AMBIENT && energy < 0.3)
      confidence = 0.8;
    else confidence = 0.6; // Moderate confidence for other matches

    return Math.min(1.0, Math.max(0.0, confidence));
  }

  /**
   * Get the currently detected genre
   */
  public getCurrentGenre(): GenreType {
    return this.currentGenre;
  }

  /**
   * Get confidence score for the current genre detection (0-1)
   */
  public getGenreConfidence(): number {
    return this.genreConfidence;
  }

  /**
   * Get history of recent genre detections
   */
  public getGenreHistory(): Array<{
    genre: GenreType;
    confidence: number;
    timestamp: number;
  }> {
    return [...this.genreHistory];
  }

  // === OKLAB INTEGRATION METHODS ===

  /**
   * Get OKLAB enhancement preset for a specific genre
   * Returns the appropriate OKLAB preset based on genre characteristics
   */
  public getOKLABPresetForGenre(genre: GenreType): EnhancementPreset {
    // Use algorithmic mapping with dynamic adjustments
    return this.createGenreSpecificOKLABPreset(genre, 1.0);
  }

  /**
   * Get OKLAB enhancement preset for a track based on its audio features
   * Automatically detects genre and returns appropriate OKLAB preset
   */
  public getOKLABPresetForTrack(audioFeatures?: AudioFeatures): EnhancementPreset {
    const detectedGenre = this.detectGenre(audioFeatures);
    return this.getOKLABPresetForGenre(detectedGenre);
  }

  /**
   * Get color characteristics for a specific genre
   * Returns detailed color processing guidance for visual systems
   */
  public getColorCharacteristicsForGenre(
    genre: GenreType
  ): NonNullable<GenreProfile['colorCharacteristics']> {
    const calculator = GenreCalculator.getInstance();
    const characteristicsData = calculator.calculateCharacteristics(genre);
    const visualStyle = calculator.calculateVisualStyle(genre);
    const characteristics = this._mapToColorCharacteristics(characteristicsData, visualStyle);

    if (this.config.enableDebug) {
      console.log(`🧬 [GenreProfileManager] Color characteristics for genre '${genre}':`, characteristics);
    }

    return characteristics;
  }

  /**
   * Get color characteristics for a track based on its audio features
   */
  public getColorCharacteristicsForTrack(audioFeatures?: AudioFeatures): NonNullable<GenreProfile['colorCharacteristics']> {
    const detectedGenre = this.detectGenre(audioFeatures);
    return this.getColorCharacteristicsForGenre(detectedGenre);
  }

  /**
   * Create contextual OKLAB preset based on genre and additional factors
   * Allows for dynamic preset customization based on runtime conditions
   */
  public createContextualOKLABPreset(
    audioFeatures: AudioFeatures, 
    intensityMultiplier: number = 1.0,
    customSuffix: string = 'contextual'
  ): EnhancementPreset {
    const detectedGenre = this.detectGenre(audioFeatures);
    const basePreset = this.getOKLABPresetForGenre(detectedGenre);
    const characteristics = this.getColorCharacteristicsForGenre(detectedGenre);
    
    // Apply intensity multiplier based on audio features
    const energyInfluence = audioFeatures.energy || 0.5;
    const danceabilityInfluence = audioFeatures.danceability || 0.5;
    const combinedIntensity = (energyInfluence + danceabilityInfluence) / 2 * intensityMultiplier;
    
    // Adjust preset parameters based on context
    const contextualChromaBoost = basePreset.chromaBoost * (0.8 + combinedIntensity * 0.4);
    const contextualLightnessBoost = basePreset.lightnessBoost * (0.9 + combinedIntensity * 0.2);
    
    const contextualPreset = OKLABColorProcessor.createCustomPreset(
      `${detectedGenre}-${customSuffix}`,
      `Contextual ${basePreset.description} for ${detectedGenre}`,
      contextualLightnessBoost,
      contextualChromaBoost,
      basePreset.shadowReduction,
      basePreset.vibrantThreshold
    );

    if (this.config.enableDebug) {
      console.log(`🧬 [GenreProfileManager] Created contextual OKLAB preset:`, {
        genre: detectedGenre,
        basePreset: basePreset.name,
        contextualPreset: contextualPreset.name,
        adjustments: {
          chromaBoost: `${basePreset.chromaBoost} → ${contextualChromaBoost}`,
          lightnessBoost: `${basePreset.lightnessBoost} → ${contextualLightnessBoost}`,
          intensityMultiplier,
          combinedIntensity
        }
      });
    }

    return contextualPreset;
  }

  /**
   * Get all available genre-OKLAB preset mappings
   * Useful for system initialization and debugging
   */
  public getAllGenreOKLABMappings(): Record<string, { preset: string; characteristics: GenreProfile['colorCharacteristics'] }> {
    const mappings: Record<string, { preset: string; characteristics: GenreProfile['colorCharacteristics'] }> = {};
    const calculator = GenreCalculator.getInstance();

    Object.values(GenreType).forEach((g) => {
      const genre = g as GenreType;
      if (typeof genre !== 'string') return;
      const ch = calculator.calculateCharacteristics(genre);
      const vs = calculator.calculateVisualStyle(genre);
      const cc = this._mapToColorCharacteristics(ch, vs);
      const preset = this.createGenreSpecificOKLABPreset(genre, 1.0);
      mappings[genre] = {
        preset: preset.name,
        characteristics: cc,
      };
    });

    if (this.config.enableDebug) {
      console.log('🧬 [GenreProfileManager] All genre-OKLAB mappings (algorithmic):', mappings);
    }

    return mappings;
  }

  // ===================================================================
  // GENRE CHARACTERISTICS & VISUAL STYLE ACCESSORS
  // ===================================================================
  // Algorithmically calculated genre properties using GenreCalculator

  /**
   * Get audio characteristics for a specific genre
   * Returns algorithmically calculated sonic signature data
   */
  public getCharacteristics(genre: GenreType): GenreCharacteristics {
    const calculator = GenreCalculator.getInstance();
    const characteristics = calculator.calculateCharacteristics(genre);

    if (this.config.enableDebug) {
      console.log(`🧬 [GenreProfileManager] Characteristics for genre '${genre}':`, characteristics);
    }

    return characteristics;
  }

  /**
   * Get audio characteristics for a track based on detected genre
   */
  public getCharacteristicsForTrack(audioFeatures?: AudioFeatures): GenreCharacteristics {
    const detectedGenre = this.detectGenre(audioFeatures);
    return this.getCharacteristics(detectedGenre);
  }

  /**
   * Get visual style parameters for a specific genre
   * Returns algorithmically calculated gradient, animation, and rendering parameters
   */
  public getVisualStyle(genre: GenreType): GenreVisualStyle {
    const calculator = GenreCalculator.getInstance();
    const visualStyle = calculator.calculateVisualStyle(genre);

    if (this.config.enableDebug) {
      console.log(`🧬 [GenreProfileManager] Visual style for genre '${genre}':`, visualStyle);
    }

    return visualStyle;
  }

  /**
   * Get visual style for a track based on detected genre
   */
  public getVisualStyleForTrack(audioFeatures?: AudioFeatures): GenreVisualStyle {
    const detectedGenre = this.detectGenre(audioFeatures);
    return this.getVisualStyle(detectedGenre);
  }

  /**
   * Get complete genre data (profile + characteristics + visual style)
   * Consolidates all genre information for comprehensive system integration
   */
  public getFullGenreData(genre: GenreType): {
    profile: GenreProfile;
    characteristics: GenreCharacteristics;
    visualStyle: GenreVisualStyle;
  } {
    const calculator = GenreCalculator.getInstance();
    const characteristics = calculator.calculateCharacteristics(genre);
    const visualStyle = calculator.calculateVisualStyle(genre);
    const profile = this._buildProfileFromAlgorithm(
      genre,
      characteristics,
      visualStyle,
      this._mapToColorCharacteristics(characteristics, visualStyle),
      this.createGenreSpecificOKLABPreset(genre, 1.0)
    );

    return { profile, characteristics, visualStyle };
  }

  // ==============================
  // Phase 2.2 - OKLAB enhancements
  // ==============================
  public createGenreSpecificOKLABPreset(genre: GenreType, intensity: number): EnhancementPreset {
    const calculator = GenreCalculator.getInstance();
    const ch = calculator.calculateCharacteristics(genre);
    const vs = calculator.calculateVisualStyle(genre);

    // Select base preset
    const baseName = this._selectBasePreset(ch, vs);
    const base = OKLABColorProcessor.getPreset(baseName);

    // Dynamic adjustments
    const influence = Math.max(0, Math.min(1, intensity));
    const adjusted = {
      ...base,
      name: `${base.name}-${genre}`,
      description: `${base.description} (${genre})`,
      chromaBoost: this._clamp(
        base.chromaBoost + (ch.saturation - 0.5) * 0.5 * influence,
        0.5,
        2.0
      ),
      lightnessBoost: this._clamp(
        base.lightnessBoost + (vs.contrastLevel - 0.5) * 0.3 * influence,
        0.5,
        1.5
      ),
      shadowReduction: this._clamp(
        base.shadowReduction + (ch.smoothness > 0.6 ? 0.05 : -0.05) * influence,
        0.1,
        0.5
      ),
      vibrantThreshold: this._clamp(
        base.vibrantThreshold + (ch.musicalComplexity > 0.7 ? -0.02 : 0.02) * influence,
        0.05,
        0.2
      ),
    } as EnhancementPreset;

    return adjusted;
  }

  public applyGenreColorModifications(colors: Record<string, string>, genre: GenreType): Record<string, string> {
    const calculator = GenreCalculator.getInstance();
    const ch = calculator.calculateCharacteristics(genre);

    const result: Record<string, string> = { ...colors };
    const boost = ch.saturation; // 0-1

    const adjustHex = (hex?: string, factor = 1): string | undefined => {
      if (!hex) return undefined;
      try {
        const rgb = (OKLABColorProcessor as any).prototype.utils.hexToRgb(hex);
        if (!rgb) return hex;
        const hsl = (OKLABColorProcessor as any).prototype.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        // Increase saturation slightly for high-energy genres
        const s = Math.max(0, Math.min(100, hsl.s * (1 + (boost - 0.5) * 0.4 * factor)));
        const l = Math.max(0, Math.min(100, hsl.l));
        const out = (OKLABColorProcessor as any).prototype.utils.hslToRgb(hsl.h, s, l);
        const outHex = (OKLABColorProcessor as any).prototype.utils.rgbToHex(out.r, out.g, out.b);
        return outHex;
      } catch {
        return hex;
      }
    };

    for (const k of Object.keys(result)) {
      const adjusted = adjustHex(result[k], 1);
      if (adjusted) result[k] = adjusted;
    }

    return result;
  }

  // ==============================
  // Internal helpers
  // ==============================
  private _mapToColorCharacteristics(
    ch: GenreCharacteristics,
    vs: GenreVisualStyle
  ): GenreColorCharacteristics {
    // Vibrancy level
    const vibrancyLevel: GenreColorCharacteristics['vibrancyLevel'] =
      ch.artificialProcessing > 0.8 || vs.particleInfluence > 0.7
        ? 'cosmic'
        : ch.saturation > 0.7
        ? 'vibrant'
        : ch.saturation < 0.35
        ? 'subtle'
        : 'standard';

    // Emotional range mapping
    const er = ch.emotionalRange;
    const emotionalRange: GenreColorCharacteristics['emotionalRange'] =
      er >= 0.85 ? 'extreme' : er >= 0.65 ? 'wide' : er >= 0.4 ? 'moderate' : 'narrow';

    // Color temperature from primary hue range and dynamics
    const [h1, h2] = vs.primaryHueRange;
    const avgHue = ((h1 + h2) / 2 + 360) % 360;
    const warm = (avgHue >= 15 && avgHue <= 60) || (avgHue >= 300 && avgHue <= 345);
    const cool = avgHue >= 180 && avgHue <= 270;
    const colorTemperature: GenreColorCharacteristics['colorTemperature'] =
      ch.dynamicRange > 0.7 && vs.animationStyle !== 'minimal'
        ? 'dynamic'
        : warm
        ? 'warm'
        : cool
        ? 'cool'
        : 'neutral';

    return { vibrancyLevel, emotionalRange, colorTemperature };
  }

  private _selectBasePreset(ch: GenreCharacteristics, vs: GenreVisualStyle): 'SUBTLE' | 'STANDARD' | 'VIBRANT' | 'COSMIC' {
    if (ch.artificialProcessing > 0.8 || (vs.contrastLevel > 0.75 && vs.gradientComplexity > 0.6)) return 'COSMIC';
    if (ch.saturation > 0.65) return 'VIBRANT';
    if (ch.smoothness > 0.6 && ch.emotionalRange < 0.5) return 'SUBTLE';
    return 'STANDARD';
  }

  private _buildProfileFromAlgorithm(
    genre: GenreType,
    ch: GenreCharacteristics,
    vs: GenreVisualStyle,
    cc: GenreColorCharacteristics,
    preset: EnhancementPreset
  ): GenreProfile {
    const clamp = this._clamp;
    const energyBoost = clamp(0.9 + ch.saturation * 0.5, 0.8, 1.5);
    const beatEmphasis = clamp(1.0 + (ch.rhythmComplexity * 0.5 + ch.syncopation * 0.5) * 0.3, 0.9, 1.4);
    const precision = clamp(0.8 + ch.artificialProcessing * 0.3, 0.7, 1.2);
    const intensityMultiplier = clamp(1.0 + ch.saturation * 0.2, 0.8, 1.4);
    const grooveFactor = clamp(1.0 + ch.grooveWeight * 0.3, 0.9, 1.4);
    const tempoMultiplier = clamp(1.0 + (ch.tempoVariability > 0.6 ? 0.05 : 0) + (ch.rhythmComplexity > 0.6 ? 0.05 : 0), 0.9, 1.2);

    return {
      energyBoost,
      beatEmphasis,
      precision,
      intensityMultiplier,
      dynamicRange: ch.dynamicRange,
      grooveFactor,
      tempoMultiplier,
      oklabPreset: preset.name,
      colorCharacteristics: cc,
      characteristics: ch,
      visualStyle: vs,
      balanced: ch.accessibility > 0.65 && ch.saturation < 0.7,
      subtleMode: ch.saturation < 0.35,
      gentleMode: ch.smoothness > 0.65,
    };
  }

  private _clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }
}
