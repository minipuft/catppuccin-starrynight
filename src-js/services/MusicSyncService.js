import { YEAR3000_CONFIG } from "../config/globalConfig.js";
import { Year3000Utilities } from "../utils/Year3000Utilities.js";
import { GenreProfileManager } from "./GenreProfileManager.js";

// Unified configuration combining both original services
const MUSIC_SYNC_CONFIG = {
  enableDebug: true,
  enableBeatSynchronization: true,
  enableGenreAnalysis: true,
  enableMoodAdaptation: true,

  // Core calculation settings (from BMPHarmonyEngine)
  bpmCalculation: {
    useEnhancedAlgorithm: true,
    danceabilityWeight: 0.9,
    energyWeight: 0.6,
    bpmWeight: 0.6,
    energyThreshold: 0.5,
    danceabilityThreshold: 0.5,
    bpmThreshold: 0.8,
    maxBPM: 100,
    minBPM: 70,
  },

  // Performance settings (unified from both services)
  performance: {
    cacheSize: 100,
    cacheTTL: 300000, // 5 minutes
    maxRetries: 10,
    retryDelay: 200,
    enableMetrics: true,
    processingTimeTarget: 50,
  },

  // Simplified synchronization settings
  synchronization: {
    beatAccuracyTarget: 50,
    maxSyncDelay: 1000,
    adaptiveQuality: true,
    predictiveCaching: true,
    debounceRapidChanges: 200,
  },

  // Genre profiles (will be moved to separate module in Phase 2)
  genreProfiles: {
    electronic: { intensityMultiplier: 1.2, precisionBoost: 1.1 },
    jazz: { smoothingFactor: 1.3, adaptiveVariation: true },
    classical: { gentleMode: true, tempoVariationHandling: "adaptive" },
    rock: { energyBoost: 1.15, consistentTiming: true },
    ambient: { subtleMode: true, intensityReduction: 0.7 },
    hiphop: { beatEmphasis: 1.25, rhythmPrecision: "high" },
    default: { balanced: true },
  },
};

/**
 * Unified Music Sync Service
 *
 * Consolidates functionality from BMPHarmonyEngine and MusicAnalysisService
 * into a single, simplified service that handles:
 * - Enhanced BPM calculation
 * - Audio feature processing
 * - Subscriber management for visual systems
 * - Unified caching system
 * - Music data processing pipeline
 */
export class MusicSyncService {
  constructor(dependencies = {}) {
    // Core dependencies
    this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
    this.utils = dependencies.Year3000Utilities || Year3000Utilities;
    this.colorHarmonyEngine = dependencies.colorHarmonyEngine;
    this.settingsManager = dependencies.settingsManager;

    this.genreProfileManager =
      dependencies.genreProfileManager ||
      new GenreProfileManager({ YEAR3000_CONFIG: this.config });

    // Initialization state
    this.isInitialized = false;
    this.currentTrack = null;
    this.audioData = null;
    this.currentTrackUri = null;
    this.latestProcessedData = null;

    // Unified metrics (combining both original services)
    this.metrics = {
      bpmCalculations: 0,
      beatSyncs: 0,
      cacheHits: 0,
      cacheMisses: 0,
      avgProcessingTime: 0,
      performance: [],
      errors: 0,
      updates: 0,
    };

    // Unified caching system (single cache instead of separate ones)
    this.unifiedCache = new Map();
    this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;

    // Simplified subscriber management (removing complex race condition handling)
    this.subscribers = new Map();

    // Beat synchronization state
    this.beatSync = {
      lastBeatTime: 0,
      nextBeatTime: 0,
      beatInterval: 0,
      confidence: 0,
      isActive: false,
    };

    // User preferences and performance monitoring
    this.userPreferences = this.loadUserPreferences();
    this.performanceInterval = null;
    this.cacheCleanupInterval = null;

    if (this.config.enableDebug) {
      console.log("🎵 MusicSyncService constructor called");
      console.log(
        "🎵 [MusicSyncService] Initialized with GenreProfileManager support"
      );
    }
  }

  async initialize() {
    try {
      if (this.config.enableDebug) {
        console.log("🎵 Initializing unified MusicSyncService...");
      }

      // Check Spicetify API availability
      if (!Spicetify?.Player?.getAudioData) {
        console.warn(
          "[MusicSyncService] Spicetify audio data API not available at initialization. Some features may be limited."
        );
      } else {
        if (this.config.enableDebug) {
          console.log(
            "[MusicSyncService] Spicetify.Player.getAudioData is available."
          );
        }
      }

      // Set up unified cache management
      this.setupCacheManagement();

      // Set up performance monitoring
      if (MUSIC_SYNC_CONFIG.performance.enableMetrics) {
        this.setupPerformanceMonitoring();
      }

      this.isInitialized = true;

      if (this.config.enableDebug) {
        console.log("🌟 MusicSyncService initialized successfully!");
      }
    } catch (error) {
      console.error("❌ MusicSyncService initialization failed:", error);
      this.metrics.errors++;
    }
  }

  // === SUBSCRIBER MANAGEMENT (Simplified from MusicAnalysisService) ===

  subscribe(systemInstance, systemName) {
    if (
      !systemInstance ||
      typeof systemInstance.updateFromMusicAnalysis !== "function"
    ) {
      console.warn(
        `[MusicSyncService] Invalid system or missing updateFromMusicAnalysis method: ${systemName}`
      );
      return;
    }

    if (this.subscribers.has(systemName)) {
      if (this.config.enableDebug) {
        console.warn(
          `[MusicSyncService] System ${systemName} already subscribed.`
        );
      }
      return;
    }

    this.subscribers.set(systemName, systemInstance);

    if (this.config.enableDebug) {
      console.log(`[MusicSyncService] System subscribed: ${systemName}`);
    }

    // If we have latest data, notify the new subscriber immediately
    if (this.latestProcessedData && systemInstance.initialized) {
      try {
        systemInstance.updateFromMusicAnalysis(
          this.latestProcessedData,
          null,
          this.currentTrackUri
        );
      } catch (error) {
        console.error(
          `[MusicSyncService] Error notifying new subscriber ${systemName}:`,
          error
        );
      }
    }
  }

  unsubscribe(systemName) {
    if (this.subscribers.has(systemName)) {
      this.subscribers.delete(systemName);
      if (this.config.enableDebug) {
        console.log(`[MusicSyncService] System unsubscribed: ${systemName}`);
      }
    }
  }

  notifySubscribers(processedData, rawFeatures, trackUri) {
    if (!this.isInitialized) {
      console.warn(
        "[MusicSyncService] Not initialized, cannot notify subscribers."
      );
      return;
    }

    this.latestProcessedData = processedData;

    if (
      this.config.enableDebug &&
      this.subscribers.size > 0 &&
      Math.random() < 0.05
    ) {
      console.log(
        `[MusicSyncService] Notifying ${this.subscribers.size} subscribers for track ${trackUri}`
      );
    }

    let notified = 0;
    let errors = 0;

    for (const [name, system] of this.subscribers) {
      try {
        if (
          system.initialized &&
          typeof system.updateFromMusicAnalysis === "function"
        ) {
          system.updateFromMusicAnalysis(processedData, rawFeatures, trackUri);
          notified++;
        }
      } catch (error) {
        console.error(
          `[MusicSyncService] Error updating system ${name}:`,
          error
        );
        errors++;
      }
    }

    if (this.config.enableDebug && errors > 0) {
      console.log(
        `[MusicSyncService] Notification result: ${notified} notified, ${errors} errors`
      );
    }
  }

  // === AUDIO DATA PROCESSING (From BMPHarmonyEngine) ===

  async fetchAudioData(options = {}) {
    const {
      retryDelay = MUSIC_SYNC_CONFIG.performance.retryDelay,
      maxRetries = MUSIC_SYNC_CONFIG.performance.maxRetries,
    } = options;

    const currentTrackUri = Spicetify.Player.data?.item?.uri;
    if (!currentTrackUri) {
      if (this.config.enableDebug) {
        console.warn(
          "[MusicSyncService] No current track URI to fetch audio data."
        );
      }
      return null;
    }

    const cacheKey = this.generateCacheKey(currentTrackUri, "audioData");
    const cached = this.getFromCache(cacheKey);
    if (cached?.audioData) {
      this.metrics.cacheHits++;
      return cached.audioData;
    }

    this.metrics.cacheMisses++;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const audioData = await Spicetify.Player.getAudioData();
        this.setInCache(cacheKey, { audioData });
        return audioData;
      } catch (error) {
        if (attempt < maxRetries - 1) {
          if (this.config.enableDebug) {
            console.log(
              `[MusicSyncService] Retrying audio data fetch (${
                attempt + 1
              }/${maxRetries})...`
            );
          }
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          if (this.config.enableDebug) {
            console.warn(
              `[MusicSyncService] Audio data fetch failed after ${maxRetries} attempts:`,
              error
            );
          }
          this.metrics.errors++;
          return null;
        }
      }
    }
    return null;
  }

  async getAudioFeatures() {
    try {
      const currentTrack = Spicetify.Player.data?.item;
      if (!currentTrack?.uri) return null;

      const trackId = currentTrack.uri.split(":")[2];
      const cacheKey = this.generateCacheKey(trackId, "features");

      const cached = this.getFromCache(cacheKey);
      if (cached?.audioFeatures) {
        this.metrics.cacheHits++;
        return cached.audioFeatures;
      }

      this.metrics.cacheMisses++;

      const response = await Spicetify.CosmosAsync.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`
      );

      const features = {
        danceability: response.danceability,
        energy: response.energy,
        valence: response.valence,
        acousticness: response.acousticness,
        instrumentalness: response.instrumentalness,
        tempo: response.tempo,
      };

      this.setInCache(cacheKey, { audioFeatures: features });
      return features;
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[MusicSyncService] Could not fetch audio features:",
          error
        );
      }
      return null;
    }
  }

  // === ENHANCED BPM CALCULATION (Best of both services) ===

  async calculateEnhancedBPM(audioData, options = {}) {
    const startTime = performance.now();

    try {
      if (!audioData?.track?.tempo) {
        if (this.config.enableDebug) {
          console.warn("[MusicSyncService] No BPM data available for track");
        }
        return this.getFallbackBPM();
      }

      const trackBPM = audioData.track.tempo;
      const config = { ...this.config.bpmCalculation, ...options };
      const audioFeatures = await this.getAudioFeatures();

      if (!audioFeatures) {
        if (this.config.enableDebug) {
          console.log("[MusicSyncService] Using basic BPM calculation");
        }
        return this.validateBPM(trackBPM);
      }

      const { danceability, energy, valence = 0.5 } = audioFeatures;

      if (this.config.enableDebug) {
        console.log(
          `[MusicSyncService] Audio features - Danceability: ${danceability}, Energy: ${energy}, Valence: ${valence}`
        );
      }

      const profile =
        this.genreProfileManager.getProfileForTrack(audioFeatures);

      const enhancedBPM = this.computeAdvancedBPM({
        trackBPM,
        danceability,
        energy,
        valence,
        config,
        profile,
      });

      const cacheKey = this.generateCacheKey(audioData.track.uri, "bpm");
      this.setInCache(cacheKey, {
        bpm: enhancedBPM,
        audioFeatures,
      });

      this.metrics.bpmCalculations++;
      this.trackPerformance(startTime);

      if (this.config.enableDebug) {
        console.log(
          `[MusicSyncService] Enhanced BPM: ${enhancedBPM} (original: ${trackBPM})`
        );
      }
      return enhancedBPM;
    } catch (error) {
      console.error("[MusicSyncService] BPM calculation failed:", error);
      this.metrics.errors++;
      return this.getFallbackBPM();
    }
  }

  computeAdvancedBPM({
    trackBPM,
    danceability,
    energy,
    valence,
    config,
    profile,
  }) {
    const {
      danceabilityWeight,
      energyWeight,
      bpmWeight,
      energyThreshold,
      danceabilityThreshold,
      bpmThreshold,
      maxBPM,
      minBPM,
    } = config;

    const normalizedBPM = Math.min(trackBPM / 100, 2.0);
    let adjustedDanceabilityWeight = danceabilityWeight;
    let adjustedEnergyWeight = energyWeight;
    let adjustedBpmWeight = bpmWeight;

    if (danceability < danceabilityThreshold) {
      adjustedDanceabilityWeight *= danceability;
    }
    if (energy < energyThreshold) {
      adjustedEnergyWeight *= energy;
    }
    if (normalizedBPM < bpmThreshold) {
      adjustedBpmWeight = 0.9;
    }

    const valenceInfluence = valence > 0.6 ? 1.1 : valence < 0.4 ? 0.9 : 1.0;
    const weightSum =
      adjustedDanceabilityWeight + adjustedEnergyWeight + adjustedBpmWeight;
    const weightedAverage =
      (danceability * adjustedDanceabilityWeight +
        energy * adjustedEnergyWeight +
        normalizedBPM * adjustedBpmWeight) /
      weightSum;

    let enhancedBPM = weightedAverage * maxBPM * valenceInfluence;

    if (enhancedBPM > trackBPM) {
      enhancedBPM = (enhancedBPM + trackBPM) / 2;
    }
    if (enhancedBPM < trackBPM) {
      enhancedBPM = Math.max(enhancedBPM, minBPM);
    }

    if (profile.beatEmphasis) {
      enhancedBPM *= profile.beatEmphasis;
    }

    return this.validateBPM(enhancedBPM);
  }

  // === AUDIO FEATURE ESTIMATION (From MusicAnalysisService) ===

  estimateDanceabilityFromTempo(tempo) {
    const config =
      this.config.musicVisualSync.enhancedBPM.danceabilityEstimation;

    if (tempo >= config.highDance.min && tempo <= config.highDance.max) {
      return config.highDance.value;
    }
    if (tempo >= config.mediumDance.min && tempo <= config.mediumDance.max) {
      return config.mediumDance.value;
    }
    if (
      tempo >= config.lowMediumDance.min &&
      tempo <= config.lowMediumDance.max
    ) {
      return config.lowMediumDance.value;
    }
    return config.lowDance.value;
  }

  estimateEnergyFromTempoLoudness(tempo, loudness) {
    const config = this.config.musicVisualSync.enhancedBPM.energyEstimation;

    const tempoFactor = Math.max(
      0,
      Math.min(
        1,
        (tempo - config.tempoRange.min) /
          (config.tempoRange.max - config.tempoRange.min)
      )
    );

    const loudnessFactor = Math.max(
      0,
      Math.min(
        1,
        (loudness - config.loudnessRange.min) /
          (config.loudnessRange.max - config.loudnessRange.min)
      )
    );

    return (
      tempoFactor * config.tempoWeight + loudnessFactor * config.loudnessWeight
    );
  }

  estimateValenceFromKey(key) {
    const majorKeys = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    return majorKeys.includes(key) ? 0.6 : 0.4;
  }

  // === MAIN PROCESSING PIPELINE (From MusicAnalysisService) ===

  async processAudioFeatures(
    rawSpicetifyAudioFeatures,
    trackUri,
    trackDurationMs
  ) {
    if (!this.isInitialized) {
      console.warn("[MusicSyncService] Not initialized, skipping processing.");
      return null;
    }

    this.currentTrackUri = trackUri;

    const cacheKey = this.generateCacheKey(trackUri, "processed");
    const cached = this.getFromCache(cacheKey);
    if (cached?.processedData) {
      this.notifySubscribers(cached.processedData);
      return cached.processedData;
    }

    try {
      // Get audio data and enhanced BPM
      let audioAnalysisData = rawSpicetifyAudioFeatures;
      if (!audioAnalysisData) {
        audioAnalysisData = await this.fetchAudioData();
      }

      let enhancedBPM;
      let tempo, loudness, key, timeSignature;
      let estimatedDanceability, estimatedEnergy, estimatedValence;

      if (audioAnalysisData) {
        enhancedBPM = await this.calculateEnhancedBPM(audioAnalysisData);
        const trackData = audioAnalysisData.track || {};

        tempo =
          trackData.tempo ||
          this.config.musicVisualSync.enhancedBPM.fallbacks.tempo;
        loudness =
          trackData.loudness ||
          this.config.musicVisualSync.enhancedBPM.fallbacks.loudness;
        key =
          trackData.key ||
          this.config.musicVisualSync.enhancedBPM.fallbacks.key;
        timeSignature =
          trackData.time_signature ||
          this.config.musicVisualSync.enhancedBPM.fallbacks.timeSignature;

        const audioFeatures = await this.getAudioFeatures();
        if (audioFeatures) {
          estimatedDanceability =
            audioFeatures.danceability ||
            this.estimateDanceabilityFromTempo(tempo);
          estimatedEnergy =
            audioFeatures.energy ||
            this.estimateEnergyFromTempoLoudness(tempo, loudness);
          estimatedValence =
            audioFeatures.valence || this.estimateValenceFromKey(key);
        } else {
          estimatedDanceability = this.estimateDanceabilityFromTempo(tempo);
          estimatedEnergy = this.estimateEnergyFromTempoLoudness(
            tempo,
            loudness
          );
          estimatedValence = this.estimateValenceFromKey(key);
        }
      } else {
        // Use fallback values
        const fallbacks = this.config.musicVisualSync.enhancedBPM.fallbacks;
        tempo = fallbacks.tempo;
        loudness = fallbacks.loudness;
        key = fallbacks.key;
        timeSignature = fallbacks.timeSignature;
        enhancedBPM = tempo;
        estimatedDanceability = this.estimateDanceabilityFromTempo(tempo);
        estimatedEnergy = this.estimateEnergyFromTempoLoudness(tempo, loudness);
        estimatedValence = this.estimateValenceFromKey(key);
      }

      // Get artistic multipliers
      let artisticMultipliers;
      try {
        if (typeof this.config.getCurrentMultipliers === "function") {
          artisticMultipliers = this.config.getCurrentMultipliers();
        } else {
          artisticMultipliers = this.config.artisticMultipliers || {
            musicEnergyBoost: 1.0,
            visualIntensityBase: 1.0,
          };
        }
      } catch (error) {
        console.error("[MusicSyncService] Error getting multipliers:", error);
        artisticMultipliers = {
          musicEnergyBoost: 1.0,
          visualIntensityBase: 1.0,
        };
      }

      // Process energy with cosmic sync
      let processedEnergy = estimatedEnergy;
      if (this.config.enableCosmicSync) {
        processedEnergy =
          estimatedEnergy * artisticMultipliers.musicEnergyBoost;
        processedEnergy = Math.max(0.1, Math.min(1.0, processedEnergy));
      }

      // Calculate visual intensity and mood
      const baseIntensity = estimatedEnergy * 0.6 + estimatedDanceability * 0.4;
      const visualIntensity =
        baseIntensity * (artisticMultipliers.visualIntensityBase || 1.0);

      let moodIdentifier = "neutral";
      if (estimatedValence > 0.6 && estimatedEnergy > 0.6) {
        moodIdentifier = "energetic-happy";
      } else if (estimatedValence > 0.6 && estimatedEnergy <= 0.6) {
        moodIdentifier = "calm-happy";
      } else if (estimatedValence <= 0.4 && estimatedEnergy > 0.6) {
        moodIdentifier = "intense-moody";
      } else if (estimatedValence <= 0.4 && estimatedEnergy <= 0.4) {
        moodIdentifier = "calm-melancholy";
      }

      const processedData = {
        trackUri,
        timestamp: Date.now(),

        // Real audio data
        tempo,
        loudness,
        key,
        timeSignature,
        duration: trackDurationMs,

        // Estimated features
        estimatedDanceability,
        estimatedEnergy,
        estimatedValence,

        // Processed values
        energy: estimatedEnergy,
        valence: estimatedValence,
        processedEnergy,
        visualIntensity,
        moodIdentifier,

        // Enhanced BPM
        baseBPM: tempo,
        enhancedBPM: enhancedBPM,
        bmpCalculationMethod: "unified-service",

        // Metadata
        dataSource: "unified-music-sync-service",
      };

      this.setInCache(cacheKey, { processedData });
      this.latestProcessedData = processedData;

      if (this.config.enableDebug) {
        console.log("🎵 [MusicSyncService] Processed music data:", {
          baseTempo: tempo,
          enhancedBPM,
          mood: moodIdentifier,
          energy: estimatedEnergy.toFixed(2),
          visualIntensity: visualIntensity.toFixed(2),
        });
      }

      this.notifySubscribers(processedData);
      return processedData;
    } catch (error) {
      console.error("[MusicSyncService] Processing failed:", error);
      this.metrics.errors++;

      const fallbackData = this.getFallbackProcessedData(trackUri);
      this.latestProcessedData = fallbackData;
      this.notifySubscribers(fallbackData);
      return fallbackData;
    }
  }

  // === UTILITY METHODS ===

  validateBPM(bpm) {
    const { minBPM, maxBPM } = this.config.bpmCalculation;
    return Math.max(minBPM, Math.min(maxBPM * 2, Math.round(bpm * 100) / 100));
  }

  getFallbackBPM() {
    return 75;
  }

  getFallbackProcessedData(trackUri) {
    const fallbacks = this.config.musicVisualSync.enhancedBPM.fallbacks;
    return {
      trackUri,
      timestamp: Date.now(),
      tempo: fallbacks.tempo,
      loudness: fallbacks.loudness,
      key: fallbacks.key,
      timeSignature: fallbacks.timeSignature,
      estimatedDanceability: this.estimateDanceabilityFromTempo(
        fallbacks.tempo
      ),
      estimatedEnergy: this.estimateEnergyFromTempoLoudness(
        fallbacks.tempo,
        fallbacks.loudness
      ),
      estimatedValence: 0.5,
      energy: 0.5,
      valence: 0.5,
      processedEnergy: 0.5,
      visualIntensity: 0.5,
      moodIdentifier: "neutral",
      baseBPM: fallbacks.tempo,
      enhancedBPM: fallbacks.tempo,
      bmpCalculationMethod: "fallback",
      dataSource: "fallback",
    };
  }

  // === CACHING SYSTEM (Unified) ===

  generateCacheKey(identifier, type = "default") {
    return `${type}_${
      identifier?.split?.(":").pop?.() || identifier || Date.now()
    }`;
  }

  getFromCache(key) {
    const cached = this.unifiedCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached;
    }
    if (cached) {
      this.unifiedCache.delete(key); // Remove expired entry
    }
    return null;
  }

  setInCache(key, data) {
    this.unifiedCache.set(key, {
      ...data,
      timestamp: Date.now(),
    });
  }

  setupCacheManagement() {
    if (this.cacheCleanupInterval) clearInterval(this.cacheCleanupInterval);

    this.cacheCleanupInterval = setInterval(() => {
      const now = Date.now();
      let prunedCount = 0;

      for (const [key, data] of this.unifiedCache.entries()) {
        if (now - data.timestamp > this.cacheTTL) {
          this.unifiedCache.delete(key);
          prunedCount++;
        }
      }

      if (prunedCount > 0 && this.config.enableDebug) {
        console.log(
          `[MusicSyncService] Pruned ${prunedCount} expired cache entries`
        );
      }

      // Size-based eviction
      const maxSize = MUSIC_SYNC_CONFIG.performance.cacheSize;
      if (this.unifiedCache.size > maxSize) {
        const keysToDelete = Array.from(this.unifiedCache.keys()).slice(
          0,
          this.unifiedCache.size - maxSize
        );
        keysToDelete.forEach((key) => this.unifiedCache.delete(key));
        if (this.config.enableDebug) {
          console.log(
            `[MusicSyncService] Evicted ${keysToDelete.length} cache entries to maintain size`
          );
        }
      }
    }, 60000); // Clean every minute
  }

  // === PERFORMANCE MONITORING ===

  setupPerformanceMonitoring() {
    if (this.performanceInterval) clearInterval(this.performanceInterval);

    this.performanceInterval = setInterval(() => {
      if (
        this.metrics.avgProcessingTime >
        this.config.performance.processingTimeTarget
      ) {
        if (this.config.enableDebug) {
          console.warn(
            `[MusicSyncService] Performance warning: Avg processing time ${this.metrics.avgProcessingTime}ms exceeds target ${this.config.performance.processingTimeTarget}ms`
          );
        }
      }
    }, 30000);
  }

  trackPerformance(startTime) {
    if (!this.config.performance.enableMetrics) return;

    const duration = performance.now() - startTime;
    this.metrics.performance.push(duration);

    if (this.metrics.performance.length > 100) {
      this.metrics.performance.shift();
    }

    this.metrics.avgProcessingTime =
      this.metrics.performance.reduce((a, b) => a + b, 0) /
      this.metrics.performance.length;
  }

  // === USER PREFERENCES ===

  loadUserPreferences() {
    try {
      const stored = Spicetify.LocalStorage.get("music-sync-preferences");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[MusicSyncService] Could not load user preferences:",
          error
        );
      }
      return {};
    }
  }

  saveUserPreferences() {
    try {
      Spicetify.LocalStorage.set(
        "music-sync-preferences",
        JSON.stringify(this.userPreferences)
      );
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[MusicSyncService] Could not save user preferences:",
          error
        );
      }
    }
  }

  // === PUBLIC API METHODS ===

  getLatestProcessedData() {
    return this.latestProcessedData;
  }

  async getEnhancedBPMForCurrentTrack(options = {}) {
    if (!this.isInitialized) {
      if (this.config.enableDebug) {
        console.warn("[MusicSyncService] Not initialized, cannot get BPM");
      }
      return this.getFallbackBPM();
    }

    const audioData = await this.fetchAudioData();
    if (!audioData) return this.getFallbackBPM();

    return this.calculateEnhancedBPM(audioData, options);
  }

  async calculatePlaybackRate(videoDefaultBPM = 135.48, options = {}) {
    try {
      if (!this.audioData) {
        this.audioData = await this.fetchAudioData();
      }

      if (!this.audioData?.track?.tempo) {
        if (this.config.enableDebug) {
          console.warn(
            "[MusicSyncService] No BPM data for playback rate, using default 1.0"
          );
        }
        return 1.0;
      }

      const enhancedBPM = await this.calculateEnhancedBPM(
        this.audioData,
        options
      );
      const playbackRate =
        videoDefaultBPM && videoDefaultBPM !== 0
          ? enhancedBPM / videoDefaultBPM
          : 1.0;
      const clampedRate = Math.max(0.5, Math.min(2.0, playbackRate));

      if (this.config.enableDebug) {
        console.log(
          `[MusicSyncService] Playback rate: ${clampedRate} (BPM: ${enhancedBPM}/${videoDefaultBPM})`
        );
      }
      return clampedRate;
    } catch (error) {
      console.error(
        "[MusicSyncService] Playback rate calculation failed:",
        error
      );
      this.metrics.errors++;
      return 1.0;
    }
  }

  clearCache() {
    this.unifiedCache.clear();
    if (this.config.enableDebug) {
      console.log("[MusicSyncService] Cache cleared");
    }
  }

  getReport() {
    return {
      isInitialized: this.isInitialized,
      subscriberCount: this.subscribers.size,
      cacheSize: this.unifiedCache.size,
      cacheTTL: this.cacheTTL,
      currentTrackUri: this.currentTrackUri,
      metrics: this.metrics,
      hasLatestData: !!this.latestProcessedData,
    };
  }

  destroy() {
    if (this.config.enableDebug) {
      console.log("[MusicSyncService] Destroying service...");
    }

    try {
      this.isInitialized = false;
      this.subscribers.clear();
      this.unifiedCache.clear();

      if (this.performanceInterval) {
        clearInterval(this.performanceInterval);
        this.performanceInterval = null;
      }

      if (this.cacheCleanupInterval) {
        clearInterval(this.cacheCleanupInterval);
        this.cacheCleanupInterval = null;
      }

      if (this.config.enableDebug) {
        console.log("[MusicSyncService] Destroyed successfully");
      }
    } catch (error) {
      console.error("[MusicSyncService] Error during destruction:", error);
    }
  }
}
