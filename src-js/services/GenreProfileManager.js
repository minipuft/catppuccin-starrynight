import { YEAR3000_CONFIG } from "../config/globalConfig.js";

// Storing genre profiles separately for clarity and future expansion.
const GENRE_PROFILES = {
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

/**
 * Manages genre-specific profiles to apply different audio-visual
 * optimizations based on the style of music being played.
 */
export class GenreProfileManager {
  constructor(dependencies = {}) {
    this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
    // Caching could be added here in the future if genre detection becomes expensive.

    if (this.config.enableDebug) {
      console.log("🧬 [GenreProfileManager] Initialized");
    }
  }

  // A simple genre detection heuristic based on audio features.
  // This avoids needing extra API calls for artist/album genres for now.
  _getGenreFromAudioFeatures(features) {
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

  // Retrieve the appropriate profile for a given track's features.
  getProfileForTrack(audioFeatures) {
    const genre = this._getGenreFromAudioFeatures(audioFeatures);
    const profile = GENRE_PROFILES[genre] || GENRE_PROFILES.default;

    if (this.config.enableDebug) {
      console.log(
        `[GenreProfileManager] Detected genre: '${genre}'. Applying profile.`
      );
    }

    return profile;
  }
}
