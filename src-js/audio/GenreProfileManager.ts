import { YEAR3000_CONFIG } from "@/config/globalConfig";
import type { Year3000Config } from "@/types/models";

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
}

interface AudioFeatures {
  danceability: number;
  energy: number;
  acousticness: number;
  instrumentalness: number;
  tempo: number;
}

const GENRE_PROFILES: Record<string, GenreProfile> = {
  electronic: { energyBoost: 1.1, beatEmphasis: 1.2, precision: 0.9 },
  dance: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
  house: { energyBoost: 1.2, beatEmphasis: 1.25, precision: 0.95 },
  techno: { energyBoost: 1.15, beatEmphasis: 1.3, precision: 1.0 },
  trance: { energyBoost: 1.15, beatEmphasis: 1.1, precision: 0.85 },

  rock: { energyBoost: 1.05, intensityMultiplier: 1.1, dynamicRange: 1.1 },
  metal: { energyBoost: 1.15, intensityMultiplier: 1.2, dynamicRange: 1.2 },
  punk: { energyBoost: 1.2, intensityMultiplier: 1.1, precision: 0.8 },

  hiphop: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },
  rap: { beatEmphasis: 1.3, grooveFactor: 1.2, tempoMultiplier: 0.95 },

  jazz: { adaptiveVariation: true, complexity: 1.2, smoothingFactor: 1.3 },
  classical: {
    gentleMode: true,
    dynamicRange: 1.4,
    tempoVariationHandling: "adaptive",
  },
  ambient: { subtleMode: true, intensityReduction: 0.7, smoothingFactor: 1.5 },

  pop: { energyBoost: 1.05, beatEmphasis: 1.1, precision: 0.85 },
  rnb: { grooveFactor: 1.25, smoothingFactor: 1.1 },
  soul: { grooveFactor: 1.3, smoothingFactor: 1.15 },

  default: {
    balanced: true,
    energyBoost: 1.0,
    beatEmphasis: 1.0,
    precision: 1.0,
  },
};

interface GenreProfileManagerDependencies {
  YEAR3000_CONFIG?: Year3000Config;
}

export class GenreProfileManager {
  private config: Year3000Config;

  constructor(dependencies: GenreProfileManagerDependencies = {}) {
    this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;

    if (this.config.enableDebug) {
      console.log("🧬 [GenreProfileManager] Initialized");
    }
  }

  private _getGenreFromAudioFeatures(features?: AudioFeatures): string {
    if (!features) return "default";
    const { danceability, energy, acousticness, instrumentalness, tempo } =
      features;

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
}
