import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { 
  OKLABColorProcessor, 
  type EnhancementPreset 
} from "@/utils/color/OKLABColorProcessor";

// ===================================================================
// 🧬 GENRE PROFILE MANAGER - Year 3000 Services
// ===================================================================
// Manages genre-specific profiles to apply different audio-visual
// optimizations based on the style of music being played.

interface GenreProfile {
  energyBoost?: number;
  beatEmphasis?: number;
  precision?: number;
  intensityMultiplier?: number;
  dynamicRange?: number;
  grooveFactor?: number;
  tempoMultiplier?: number;
  adaptiveVariation?: boolean;
  complexity?: number;
  smoothingFactor?: number;
  gentleMode?: boolean;
  tempoVariationHandling?: "adaptive" | string;
  subtleMode?: boolean;
  intensityReduction?: number;
  balanced?: boolean;
  // OKLAB integration for genre-specific color processing
  oklabPreset?: string; // OKLAB preset name (SUBTLE, STANDARD, VIBRANT, COSMIC)
  colorCharacteristics?: {
    vibrancyLevel: 'subtle' | 'standard' | 'vibrant' | 'cosmic';
    emotionalRange: 'narrow' | 'moderate' | 'wide' | 'extreme';
    colorTemperature: 'cool' | 'neutral' | 'warm' | 'dynamic';
  };
}

interface AudioFeatures {
  danceability?: number;
  energy?: number;
  acousticness?: number;
  instrumentalness?: number;
  tempo?: number;
}

const GENRE_PROFILES: Record<string, GenreProfile> = {
  // Electronic genres - high energy, vibrant colors with dynamic range
  electronic: { 
    energyBoost: 1.1, beatEmphasis: 1.2, precision: 0.9,
    oklabPreset: 'VIBRANT',
    colorCharacteristics: {
      vibrancyLevel: 'vibrant',
      emotionalRange: 'wide',
      colorTemperature: 'dynamic'
    }
  },
  dance: { 
    energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95,
    oklabPreset: 'COSMIC',
    colorCharacteristics: {
      vibrancyLevel: 'cosmic',
      emotionalRange: 'extreme',
      colorTemperature: 'dynamic'
    }
  },
  house: { 
    energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95,
    oklabPreset: 'VIBRANT',
    colorCharacteristics: {
      vibrancyLevel: 'vibrant',
      emotionalRange: 'wide',
      colorTemperature: 'warm'
    }
  },
  techno: { 
    energyBoost: 1.15, beatEmphasis: 1.3, precision: 1.0,
    oklabPreset: 'COSMIC',
    colorCharacteristics: {
      vibrancyLevel: 'cosmic',
      emotionalRange: 'extreme',
      colorTemperature: 'cool'
    }
  },
  trance: { 
    energyBoost: 1.15, beatEmphasis: 1.1, precision: 0.85,
    oklabPreset: 'VIBRANT',
    colorCharacteristics: {
      vibrancyLevel: 'vibrant',
      emotionalRange: 'wide',
      colorTemperature: 'dynamic'
    }
  },

  // Rock genres - intense but controlled vibrancy
  rock: { 
    energyBoost: 1.05, intensityMultiplier: 1.1, dynamicRange: 1.1,
    oklabPreset: 'VIBRANT',
    colorCharacteristics: {
      vibrancyLevel: 'vibrant',
      emotionalRange: 'wide',
      colorTemperature: 'warm'
    }
  },
  metal: { 
    energyBoost: 1.15, intensityMultiplier: 1.2, dynamicRange: 1.2,
    oklabPreset: 'COSMIC',
    colorCharacteristics: {
      vibrancyLevel: 'cosmic',
      emotionalRange: 'extreme',
      colorTemperature: 'cool'
    }
  },
  punk: { 
    energyBoost: 1.2, intensityMultiplier: 1.1, precision: 0.8,
    oklabPreset: 'VIBRANT',
    colorCharacteristics: {
      vibrancyLevel: 'vibrant',
      emotionalRange: 'wide',
      colorTemperature: 'dynamic'
    }
  },

  // Urban genres - rhythmic emphasis with moderate vibrancy
  hiphop: { 
    beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'warm'
    }
  },
  rap: { 
    beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'neutral'
    }
  },

  // Sophisticated genres - subtle, refined enhancement
  jazz: { 
    adaptiveVariation: true, complexity: 1.2, smoothingFactor: 1.3,
    oklabPreset: 'SUBTLE',
    colorCharacteristics: {
      vibrancyLevel: 'subtle',
      emotionalRange: 'wide',
      colorTemperature: 'warm'
    }
  },
  classical: {
    gentleMode: true, dynamicRange: 1.4, tempoVariationHandling: "adaptive",
    oklabPreset: 'SUBTLE',
    colorCharacteristics: {
      vibrancyLevel: 'subtle',
      emotionalRange: 'extreme',
      colorTemperature: 'neutral'
    }
  },
  ambient: { 
    subtleMode: true, intensityReduction: 0.7, smoothingFactor: 1.5,
    oklabPreset: 'SUBTLE',
    colorCharacteristics: {
      vibrancyLevel: 'subtle',
      emotionalRange: 'narrow',
      colorTemperature: 'cool'
    }
  },

  // Popular genres - balanced enhancement
  pop: { 
    energyBoost: 1.05, beatEmphasis: 1.1, precision: 0.85,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'warm'
    }
  },
  rnb: { 
    grooveFactor: 1.25, smoothingFactor: 1.1,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'warm'
    }
  },
  soul: { 
    grooveFactor: 1.3, smoothingFactor: 1.15,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'wide',
      colorTemperature: 'warm'
    }
  },

  // Default fallback - safe, balanced enhancement
  default: {
    balanced: true, energyBoost: 1.0, beatEmphasis: 1.0, precision: 1.0,
    oklabPreset: 'STANDARD',
    colorCharacteristics: {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'neutral'
    }
  },
};

interface GenreProfileManagerDependencies {
  ADVANCED_SYSTEM_CONFIG?: Year3000Config;
  YEAR3000_CONFIG?: Year3000Config; // Legacy compatibility
}

export class GenreProfileManager {
  private config: AdvancedSystemConfig | Year3000Config;

  constructor(dependencies: GenreProfileManagerDependencies = {}) {
    this.config = dependencies.ADVANCED_SYSTEM_CONFIG || dependencies.YEAR3000_CONFIG || ADVANCED_SYSTEM_CONFIG;

    if (this.config.enableDebug) {
      console.log("🧬 [GenreProfileManager] Initialized");
    }
  }

  private _getGenreFromAudioFeatures(features?: AudioFeatures): string {
    if (!features) return "default";
    const { 
      danceability = 0.5, 
      energy = 0.5, 
      acousticness = 0.5, 
      instrumentalness = 0.5, 
      tempo = 120 
    } = features;

    if (instrumentalness > 0.6 && acousticness < 0.2 && energy > 0.6) {
      if (tempo > 120) return "techno";
      return "electronic";
    }
    if (danceability > 0.7 && energy > 0.7) return "dance";
    if (acousticness > 0.7 && energy < 0.4) return "classical";
    if (acousticness > 0.5 && instrumentalness < 0.1) return "jazz"; // Simplified
    if (energy > 0.7 && instrumentalness < 0.1 && danceability > 0.5)
      return "rock";
    if (
      danceability > 0.7 &&
      instrumentalness < 0.2 &&
      energy > 0.5 &&
      tempo < 110
    )
      return "hiphop";

    return "default";
  }

  public getProfileForTrack(audioFeatures?: AudioFeatures): GenreProfile {
    const genre = this._getGenreFromAudioFeatures(audioFeatures);
    const profile = GENRE_PROFILES[genre];

    if (this.config.enableDebug) {
      console.log(
        `[GenreProfileManager] Detected genre: '${genre}'. Applying profile.`
      );
    }

    if (profile) {
      return profile;
    }

    const defaultProfile = GENRE_PROFILES.default;
    if (defaultProfile) {
      return defaultProfile;
    }

    // This should be unreachable
    throw new Error(
      "[GenreProfileManager] Critical: Default genre profile is missing."
    );
  }

  /**
   * Public helper that returns the genre string detected for the given audio-features without
   * allocating a full profile. Useful for colour/palette routing.
   */
  public detectGenre(features?: AudioFeatures): string {
    return this._getGenreFromAudioFeatures(features);
  }

  // === OKLAB INTEGRATION METHODS ===

  /**
   * Get OKLAB enhancement preset for a specific genre
   * Returns the appropriate OKLAB preset based on genre characteristics
   */
  public getOKLABPresetForGenre(genre: string): EnhancementPreset {
    const profile = GENRE_PROFILES[genre] || GENRE_PROFILES.default!;
    const presetName = profile.oklabPreset || 'STANDARD';
    
    try {
      const preset = OKLABColorProcessor.getPreset(presetName);
      
      if (this.config.enableDebug) {
        console.log(`🧬 [GenreProfileManager] OKLAB preset for genre '${genre}':`, {
          genre,
          preset: presetName,
          colorCharacteristics: profile.colorCharacteristics
        });
      }
      
      return preset;
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`🧬 [GenreProfileManager] Failed to get OKLAB preset '${presetName}' for genre '${genre}', using STANDARD:`, error);
      }
      return OKLABColorProcessor.getPreset('STANDARD');
    }
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
  public getColorCharacteristicsForGenre(genre: string): NonNullable<GenreProfile['colorCharacteristics']> {
    const profile = GENRE_PROFILES[genre] || GENRE_PROFILES.default!;
    const characteristics = profile.colorCharacteristics || {
      vibrancyLevel: 'standard',
      emotionalRange: 'moderate',
      colorTemperature: 'neutral'
    };

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
    
    Object.entries(GENRE_PROFILES).forEach(([genre, profile]) => {
      mappings[genre] = {
        preset: profile.oklabPreset || 'STANDARD',
        characteristics: profile.colorCharacteristics
      };
    });

    if (this.config.enableDebug) {
      console.log('🧬 [GenreProfileManager] All genre-OKLAB mappings:', mappings);
    }

    return mappings;
  }
}
