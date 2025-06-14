import { GlobalEventBus } from "@/core/EventBus";
import type { Year3000Config } from "@/types/models";
import { YEAR3000_CONFIG } from "../config/globalConfig";
import { Year3000System } from "../core/year3000System";
import { SettingsManager } from "../managers/SettingsManager";
import { ColorHarmonyEngine } from "../systems/ColorHarmonyEngine";
import { SpicetifyCompat } from "../utils/SpicetifyCompat";
import { StorageManager } from "../utils/StorageManager";
import * as Utils from "../utils/Year3000Utilities";
import { GenreProfileManager } from "./GenreProfileManager";

// Interfaces
interface MusicSyncConfig {
  enableDebug: boolean;
  enableBeatSynchronization: boolean;
  enableGenreAnalysis: boolean;
  enableMoodAdaptation: boolean;
  bpmCalculation: {
    useEnhancedAlgorithm: boolean;
    danceabilityWeight: number;
    energyWeight: number;
    bpmWeight: number;
    energyThreshold: number;
    danceabilityThreshold: number;
    bpmThreshold: number;
    maxBPM: number;
    minBPM: number;
  };
  performance: {
    cacheSize: number;
    cacheTTL: number;
    maxRetries: number;
    retryDelay: number;
    enableMetrics: boolean;
    processingTimeTarget: number;
  };
  synchronization: {
    beatAccuracyTarget: number;
    maxSyncDelay: number;
    adaptiveQuality: boolean;
    predictiveCaching: boolean;
    debounceRapidChanges: number;
  };
  genreProfiles: {
    [key: string]: any;
  };
  musicVisualSync: {
    enhancedBPM: {
      fallbacks: {
        tempo: number;
        loudness: number;
        key: number;
        timeSignature: number;
      };
      danceabilityEstimation: {
        highDance: { min: number; max: number; value: number };
        mediumDance: { min: number; max: number; value: number };
        lowMediumDance: { min: number; max: number; value: number };
        lowDance: { value: number };
      };
      energyEstimation: {
        tempoRange: { min: number; max: number };
        loudnessRange: { min: number; max: number };
        tempoWeight: number;
        loudnessWeight: number;
      };
    };
  };
}

interface MusicSyncMetrics {
  bpmCalculations: number;
  beatSyncs: number;
  cacheHits: number;
  cacheMisses: number;
  avgProcessingTime: number;
  performance: number[];
  errors: number;
  updates: number;
}

interface BeatSyncState {
  lastBeatTime: number;
  nextBeatTime: number;
  beatInterval: number;
  confidence: number;
  isActive: boolean;
}

interface VisualSystemSubscriber {
  initialized: boolean;
  updateFromMusicAnalysis(
    processedData: any,
    rawFeatures: any,
    trackUri: string | null
  ): void;
}

interface AudioData {
  tempo: number;
  energy: number;
  valence: number;
  loudness: number;
  key: number;
  time_signature: number;
  danceability: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  mode: number;
  beats?: any[];
  bars?: any[];
  sections?: any[];
  segments?: any[];
  tatums?: any[];
}

interface AudioFeatures {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  tempo: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface ProcessedAudioData {
  trackUri: string;
  timestamp: number;
  duration: number;
  energy: number;
  valence: number;
  baseBPM: number;
  enhancedBPM: number;
  beatInterval: number;
  processedEnergy: number;
  visualIntensity: number;
  moodIdentifier: string;
  animationSpeedFactor: number;
  dataSource: "cache" | "live" | "fallback";
  bpmCalculationMethod: "enhanced" | "basic" | "fallback";
}

const MUSIC_SYNC_CONFIG: MusicSyncConfig = {
  enableDebug: true,
  enableBeatSynchronization: true,
  enableGenreAnalysis: true,
  enableMoodAdaptation: true,
  bpmCalculation: {
    useEnhancedAlgorithm: true,
    danceabilityWeight: 0.9,
    energyWeight: 0.6,
    bpmWeight: 0.6,
    energyThreshold: 0.5,
    danceabilityThreshold: 0.5,
    bpmThreshold: 0.8,
    maxBPM: 180,
    minBPM: 60,
  },
  performance: {
    cacheSize: 100,
    cacheTTL: 300000,
    maxRetries: 10,
    retryDelay: 200,
    enableMetrics: true,
    processingTimeTarget: 50,
  },
  synchronization: {
    beatAccuracyTarget: 50,
    maxSyncDelay: 1000,
    adaptiveQuality: true,
    predictiveCaching: true,
    debounceRapidChanges: 200,
  },
  genreProfiles: {
    electronic: { intensityMultiplier: 1.2, precisionBoost: 1.1 },
    jazz: { smoothingFactor: 1.3, adaptiveVariation: true },
    classical: { gentleMode: true, tempoVariationHandling: "adaptive" },
    rock: { energyBoost: 1.15, consistentTiming: true },
    ambient: { subtleMode: true, intensityReduction: 0.7 },
    hiphop: { beatEmphasis: 1.25, rhythmPrecision: "high" },
    default: { balanced: true },
  },
  musicVisualSync: {
    enhancedBPM: {
      fallbacks: {
        tempo: 120,
        loudness: -5,
        key: 0,
        timeSignature: 4,
      },
      danceabilityEstimation: {
        highDance: { min: 125, max: 145, value: 0.8 },
        mediumDance: { min: 100, max: 124, value: 0.7 },
        lowMediumDance: { min: 80, max: 99, value: 0.6 },
        lowDance: { value: 0.5 },
      },
      energyEstimation: {
        tempoRange: { min: 80, max: 160 },
        loudnessRange: { min: -15, max: 0 },
        tempoWeight: 0.6,
        loudnessWeight: 0.4,
      },
    },
  },
};

export class MusicSyncService {
  private config: Year3000Config;
  private utils: typeof Utils;
  private colorHarmonyEngine?: ColorHarmonyEngine;
  private settingsManager?: SettingsManager;
  private year3000System?: Year3000System;
  private genreProfileManager: GenreProfileManager;

  private isInitialized: boolean = false;
  private currentTrack: any = null;
  private audioData: any = null;
  private currentTrackUri: string | null = null;
  private latestProcessedData: any = null;

  // High-precision beat scheduling
  private beatSchedulerTimer: NodeJS.Timeout | null = null;
  private nextBeatIndex: number = 0;
  private currentSongBeats: any[] = [];
  private songStartTimestamp: number = 0;

  private metrics: MusicSyncMetrics = {
    bpmCalculations: 0,
    beatSyncs: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgProcessingTime: 0,
    performance: [],
    errors: 0,
    updates: 0,
  };

  private unifiedCache: Map<string, CacheEntry<any>> = new Map();
  private cacheTTL: number;

  private subscribers: Map<string, VisualSystemSubscriber> = new Map();

  private beatSync: BeatSyncState = {
    lastBeatTime: 0,
    nextBeatTime: 0,
    beatInterval: 0,
    confidence: 0,
    isActive: false,
  };

  private userPreferences: any;
  private performanceInterval: NodeJS.Timeout | null = null;
  private cacheCleanupInterval: NodeJS.Timeout | null = null;

  // Increment this prefix whenever cache schema changes to avoid stale data
  private readonly CACHE_KEY_VERSION_PREFIX = "v3";

  constructor(dependencies: any = {}) {
    this.config = dependencies.YEAR3000_CONFIG || YEAR3000_CONFIG;
    this.utils = dependencies.Year3000Utilities || Utils;
    this.colorHarmonyEngine = dependencies.colorHarmonyEngine;
    this.settingsManager = dependencies.settingsManager;
    this.year3000System = dependencies.year3000System;

    this.genreProfileManager =
      dependencies.genreProfileManager ||
      new GenreProfileManager({ YEAR3000_CONFIG: this.config });

    this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;
    this.userPreferences = this.loadUserPreferences();

    if (this.config.enableDebug) {
      console.log("🎵 MusicSyncService constructor called");
      console.log(
        "🎵 [MusicSyncService] Initialized with GenreProfileManager support"
      );
    }
  }

  public async initialize(): Promise<void> {
    try {
      if (this.config.enableDebug) {
        console.log("🎵 Initializing unified MusicSyncService...");
      }

      if (!SpicetifyCompat.isAvailable()) {
        console.warn(
          "[MusicSyncService] Spicetify audio data API not available at initialization. Some features may be limited."
        );
      }

      this.setupCacheManagement();

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

  // === SUBSCRIBER MANAGEMENT ===
  public subscribe(
    systemInstance: VisualSystemSubscriber,
    systemName: string
  ): void {
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

  public unsubscribe(systemName: string): void {
    if (this.subscribers.has(systemName)) {
      this.subscribers.delete(systemName);
      if (this.config.enableDebug) {
        console.log(`[MusicSyncService] System unsubscribed: ${systemName}`);
      }
    }
  }

  public notifySubscribers(
    processedData: any,
    rawFeatures: any,
    trackUri: string | null
  ): void {
    if (!this.isInitialized) {
      console.warn(
        "[MusicSyncService] Not initialized, cannot notify subscribers."
      );
      return;
    }

    this.latestProcessedData = processedData;

    for (const [name, system] of this.subscribers) {
      try {
        if (
          system.initialized &&
          typeof system.updateFromMusicAnalysis === "function"
        ) {
          system.updateFromMusicAnalysis(processedData, rawFeatures, trackUri);
        }
      } catch (error) {
        console.error(
          `[MusicSyncService] Error notifying subscriber ${name}:`,
          error
        );
        this.metrics.errors++;
      }
    }
  }

  // === DATA FETCHING & CACHING ===
  public async fetchAudioData(
    options: {
      retryDelay?: number;
      maxRetries?: number;
    } = {}
  ): Promise<AudioData | null> {
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
    const cached = this.getFromCache<{ audioData: AudioData }>(cacheKey);
    if (cached?.audioData) {
      if (this.isValidAudioData(cached.audioData)) {
        this.metrics.cacheHits++;
        if (this.config.enableDebug) {
          console.log(
            `[MusicSyncService] Cache hit for audioData: ${cacheKey}`
          );
        }
        return cached.audioData;
      }
      // Invalid cached entry – purge and fall through to refetch
      this.unifiedCache.delete(cacheKey);
    }

    this.metrics.cacheMisses++;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const audioData = (await SpicetifyCompat.getAudioData()) as AudioData;

        if (this.isValidAudioData(audioData)) {
          this.setInCache(cacheKey, { audioData });
          return audioData;
        }

        // Invalid – wait and retry
        if (this.config.enableDebug) {
          console.log(
            `[MusicSyncService] Audio analysis unavailable (attempt ${
              attempt + 1
            }/${maxRetries}). Retrying…`
          );
        }
      } catch (error) {
        if (attempt === maxRetries - 1) {
          if (this.config.enableDebug) {
            console.warn(
              `[MusicSyncService] Audio data fetch error on final attempt:`,
              error
            );
          }
          this.metrics.errors++;
          return null;
        }
      }

      // Delay before next retry
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    return null;
  }

  public async getAudioFeatures(): Promise<AudioFeatures | null> {
    try {
      const currentTrack = Spicetify.Player.data?.item;
      if (!currentTrack?.uri) return null;

      const trackId = currentTrack.uri.split(":")[2] || "fallback";
      const cacheKey = this.generateCacheKey(trackId, "features");

      const cached = this.getFromCache<{ audioFeatures: AudioFeatures }>(
        cacheKey
      );
      if (cached?.audioFeatures) {
        this.metrics.cacheHits++;
        if (this.config.enableDebug) {
          console.log(
            `[MusicSyncService] Cache hit for audioFeatures: ${cacheKey}`
          );
        }
        return cached.audioFeatures;
      }

      this.metrics.cacheMisses++;

      const response = await Spicetify.CosmosAsync.get(
        `https://api.spotify.com/v1/audio-features/${trackId}`
      );

      const features: AudioFeatures = {
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

  private generateCacheKey(
    identifier: string,
    type: string = "default"
  ): string {
    // Example key: v2-spotify:track:abc-processed
    return `${this.CACHE_KEY_VERSION_PREFIX}-${identifier}-${type}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.unifiedCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }
    if (cached) {
      this.unifiedCache.delete(key); // Remove expired entry
    }
    return null;
  }

  private setInCache<T>(key: string, data: T): void {
    this.unifiedCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // === ENHANCED BPM CALCULATION ===

  public async calculateEnhancedBPM(
    audioData: AudioData,
    options: any = {}
  ): Promise<number> {
    const startTime = performance.now();

    try {
      if (!audioData?.tempo) {
        if (this.config.enableDebug) {
          console.warn("[MusicSyncService] No BPM data available for track");
        }
        return this.getFallbackBPM();
      }

      const trackBPM = audioData.tempo;
      const config = {
        ...MUSIC_SYNC_CONFIG.bpmCalculation,
        ...options,
      };
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

      const profile = this.genreProfileManager.getProfileForTrack(
        audioFeatures || undefined
      );
      const detectedGenre = this.genreProfileManager.detectGenre(
        audioFeatures || undefined
      );

      const enhancedBPM = this.computeAdvancedBPM({
        trackBPM,
        danceability,
        energy,
        valence,
        config,
        profile,
      });

      // Use current track URI for cache key instead of tempo
      const currentTrack = Spicetify.Player.data?.item || Spicetify.Player.data;
      const uriParts = currentTrack?.uri?.split(":") ?? [];
      const trackId =
        uriParts.length > 2 && uriParts[2] ? uriParts[2] : "fallback";
      const cacheKey = this.generateCacheKey(trackId, "bpm");
      this.setInCache(cacheKey, {
        bpm: enhancedBPM,
        audioFeatures,
      });

      this.metrics.bpmCalculations++;
      // A full performance tracking implementation would go here.

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

  private computeAdvancedBPM(params: {
    trackBPM: number;
    danceability: number;
    energy: number;
    valence: number;
    config: any;
    profile: any;
  }): number {
    const { trackBPM, danceability, energy, valence, config, profile } = params;
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

    // Normalise tempo relative to 120 BPM (common dance-music reference)
    const normalizedBPM = Math.min(trackBPM / 120, 2.0);
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

    // Reduce BPM slightly only for truly low-valence & low-energy tracks to avoid
    // halving high-tempo but "moody" songs.
    let valenceInfluence = 1.0;
    if (valence > 0.6) {
      valenceInfluence = 1.05;
    } else if (valence < 0.4 && energy < 0.5) {
      valenceInfluence = 0.95;
    }

    const weightSum =
      adjustedDanceabilityWeight + adjustedEnergyWeight + adjustedBpmWeight;
    const weightedAverage =
      (danceability * adjustedDanceabilityWeight +
        energy * adjustedEnergyWeight +
        normalizedBPM * adjustedBpmWeight) /
      weightSum;

    // Scale back to BPM domain and apply valence influence
    let enhancedBPM = weightedAverage * 120 * valenceInfluence;

    // Optional profile-specific emphasis
    if (profile.beatEmphasis) {
      enhancedBPM *= profile.beatEmphasis;
    }

    // Final clamping within configured bounds
    enhancedBPM = Math.max(minBPM, Math.min(maxBPM, enhancedBPM));

    return Math.round(enhancedBPM * 100) / 100; // two-decimal precision
  }

  private validateBPM(bpm: number): number {
    const { minBPM, maxBPM } = MUSIC_SYNC_CONFIG.bpmCalculation;
    return Math.max(minBPM, Math.min(maxBPM * 2, Math.round(bpm * 100) / 100));
  }

  private getFallbackBPM(): number {
    return 75;
  }

  // === FEATURE ESTIMATION & FALLBACKS ===
  private estimateDanceabilityFromTempo(tempo: number): number {
    const config =
      MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.danceabilityEstimation;

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

  private estimateEnergyFromTempoLoudness(
    tempo: number,
    loudness: number
  ): number {
    const config =
      MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.energyEstimation;

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

  private estimateValenceFromKey(key: number): number {
    const majorKeys = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    return majorKeys.includes(key) ? 0.6 : 0.4;
  }

  private getFallbackProcessedData(trackUri: string): any {
    const fallbacks = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks;
    const fallbackBeatInterval = 60000 / fallbacks.tempo;
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
      beatInterval: fallbackBeatInterval,
      bmpCalculationMethod: "fallback",
      dataSource: "fallback",
    };
  }

  // === MAIN PROCESSING PIPELINE ===
  public async processAudioFeatures(
    rawSpicetifyAudioFeatures: AudioData | null,
    trackUri: string,
    trackDurationMs: number
  ): Promise<void> {
    if (!this.isInitialized) {
      console.warn("[MusicSyncService] Not initialized, skipping processing.");
      return;
    }

    this.stopBeatScheduler();
    this.currentTrackUri = trackUri;

    const cacheKey = this.generateCacheKey(trackUri, "processed");
    const cached = this.getFromCache<{ processedData: any }>(cacheKey);
    if (cached?.processedData) {
      this.notifySubscribers(cached.processedData, null, trackUri);
      return;
    }

    try {
      let audioAnalysisData = rawSpicetifyAudioFeatures;
      if (!audioAnalysisData) {
        audioAnalysisData = await this.fetchAudioData();
      }

      if (!audioAnalysisData) {
        throw new Error("Failed to fetch or receive audio data.");
      }

      if (audioAnalysisData.beats && audioAnalysisData.beats.length > 0) {
        this.currentSongBeats = audioAnalysisData.beats;
        this.songStartTimestamp = Date.now();
        this.nextBeatIndex = 0;
        this.scheduleNextBeatEvent();
      }

      const enhancedBPM = await this.calculateEnhancedBPM(audioAnalysisData);
      const beatInterval = enhancedBPM > 0 ? 60000 / enhancedBPM : 0;
      const trackData = audioAnalysisData;

      const {
        tempo = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.tempo,
        loudness = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks
          .loudness,
        key = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks.key,
        time_signature: timeSignature = MUSIC_SYNC_CONFIG.musicVisualSync
          .enhancedBPM.fallbacks.timeSignature,
      } = trackData;

      const audioFeatures = await this.getAudioFeatures();
      const estimatedDanceability =
        audioFeatures?.danceability ??
        this.estimateDanceabilityFromTempo(tempo);
      const estimatedEnergy =
        audioFeatures?.energy ??
        this.estimateEnergyFromTempoLoudness(tempo, loudness);
      const estimatedValence =
        audioFeatures?.valence ?? this.estimateValenceFromKey(key);

      const artisticMultipliers = (
        this.config.getCurrentMultipliers as () => any
      )?.() || {
        musicEnergyBoost: 1.0,
        visualIntensityBase: 1.0,
      };

      const processedEnergy = Math.max(
        0.1,
        Math.min(
          1.0,
          estimatedEnergy * (artisticMultipliers.musicEnergyBoost || 1.0)
        )
      );

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

      const animationSpeedFactor = Math.max(0.5, 0.8 + visualIntensity * 0.4);

      const genreTag = this.genreProfileManager.detectGenre(
        audioFeatures || undefined
      );

      const processedData = {
        trackUri,
        timestamp: Date.now(),
        tempo,
        loudness,
        key,
        timeSignature,
        duration: trackDurationMs,
        estimatedDanceability,
        estimatedEnergy,
        estimatedValence,
        energy: estimatedEnergy,
        valence: estimatedValence,
        processedEnergy,
        visualIntensity,
        moodIdentifier,
        baseBPM: tempo,
        enhancedBPM: enhancedBPM,
        beatInterval: beatInterval,
        bmpCalculationMethod: "unified-service",
        dataSource: "unified-music-sync-service",
        beatOccurred: false,
        animationSpeedFactor,
        genre: genreTag,
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

      this.notifySubscribers(
        processedData,
        rawSpicetifyAudioFeatures,
        trackUri
      );

      // Publish beat/frame event for EmergentChoreographyEngine
      GlobalEventBus.publish("beat/frame", {
        timestamp: performance.now(),
        trackUri: trackUri,
        processedData: processedData,
        rawData: rawSpicetifyAudioFeatures,
      });

      // Publish more granular events for Phase 4
      GlobalEventBus.publish("beat/bpm", { bpm: processedData.enhancedBPM });
      GlobalEventBus.publish("beat/intensity", {
        intensity: processedData.visualIntensity,
      });

      if (this.config.enableDebug) {
        console.log(
          "[MusicSyncService] Successfully processed audio features.",
          {
            baseTempo: tempo,
            enhancedBPM,
            mood: moodIdentifier,
            energy: estimatedEnergy.toFixed(2),
            visualIntensity: visualIntensity.toFixed(2),
          }
        );
      }
    } catch (error) {
      console.error("[MusicSyncService] Processing failed:", error);
      this.metrics.errors++;

      const fallbackData = this.getFallbackProcessedData(trackUri);
      this.latestProcessedData = fallbackData;
      this.notifySubscribers(fallbackData, null, trackUri);
    }
  }

  public async processSongUpdate(): Promise<void> {
    const trackUri = Spicetify.Player.data?.item?.uri;
    if (!trackUri || trackUri === this.currentTrackUri) {
      return;
    }

    // New track detected – clear any stale cache entries for it
    this.invalidateTrackCaches(trackUri);

    try {
      const trackDuration =
        Spicetify.Player.data?.item?.duration?.milliseconds || 0;

      // Phase 1 – instant colour update + provisional BPM from audio-features
      const [audioFeatures, rawColors] = await Promise.all([
        this.getAudioFeatures(),
        Spicetify.colorExtractor(trackUri),
      ]);

      // Sanitize extracted colours to remove undefined / malformed values
      const colors = this.utils.sanitizeColorMap(
        (rawColors as Record<string, string>) || {}
      );

      if (
        this.colorHarmonyEngine &&
        this.year3000System &&
        Object.keys(colors).length > 0
      ) {
        const blendedColors =
          this.colorHarmonyEngine.blendWithCatppuccin(colors);
        this.year3000System.applyColorsToTheme(blendedColors);
      }

      if (audioFeatures) {
        const provisionalAudioData =
          this.convertFeaturesToAudioData(audioFeatures);
        await this.processAudioFeatures(
          provisionalAudioData,
          trackUri,
          trackDuration
        );
      }

      // Phase 2 – attempt to refine with full audio analysis (beat grid)
      (async () => {
        const fullAnalysis = await this.fetchAudioData();
        if (this.isValidAudioData(fullAnalysis)) {
          // Rerun full processing – this will schedule beats and may tweak BPM
          await this.processAudioFeatures(
            fullAnalysis,
            trackUri,
            trackDuration
          );
        }
      })();
    } catch (error) {
      console.error(
        `[MusicSyncService] Error processing song update for ${trackUri}:`,
        error
      );
      this.metrics.errors++;
    }
  }

  // === LIFECYCLE & HELPERS ===
  private setupCacheManagement(): void {
    this.cacheCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, cacheEntry] of this.unifiedCache.entries()) {
        if (now - cacheEntry.timestamp > this.cacheTTL) {
          this.unifiedCache.delete(key);
        }
      }
    }, this.cacheTTL);
  }

  private setupPerformanceMonitoring(): void {
    this.performanceInterval = setInterval(() => {
      if (this.metrics.performance.length > 0) {
        const avg =
          this.metrics.performance.reduce((a, b) => a + b, 0) /
          this.metrics.performance.length;
        this.metrics.avgProcessingTime = avg;
        this.metrics.performance = []; // Reset for next interval
      }
    }, 60000); // Monitor every minute
  }

  private loadUserPreferences(): any {
    try {
      const prefs = StorageManager.get("sn-music-sync-prefs");
      return prefs ? JSON.parse(prefs) : {};
    } catch (e) {
      return {};
    }
  }

  private saveUserPreferences(): void {
    try {
      StorageManager.set(
        "sn-music-sync-prefs",
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

  public updateConfiguration(newConfig: Partial<MusicSyncConfig>): void {
    const previousConfig = { ...MUSIC_SYNC_CONFIG };
    Object.assign(MUSIC_SYNC_CONFIG, newConfig);

    if (this.config.enableDebug) {
      console.log("🎵 [MusicSyncService] Configuration updated", {
        from: previousConfig,
        to: MUSIC_SYNC_CONFIG,
      });
    }

    // Re-apply any settings that depend on the configuration
    this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;

    if (
      previousConfig.performance.enableMetrics !==
      MUSIC_SYNC_CONFIG.performance.enableMetrics
    ) {
      if (MUSIC_SYNC_CONFIG.performance.enableMetrics) {
        this.setupPerformanceMonitoring();
      } else if (this.performanceInterval) {
        clearInterval(this.performanceInterval);
        this.performanceInterval = null;
      }
    }
  }

  public destroy(): void {
    this.stopBeatScheduler();
    if (this.performanceInterval) clearInterval(this.performanceInterval);
    if (this.cacheCleanupInterval) clearInterval(this.cacheCleanupInterval);
    this.subscribers.clear();
    this.unifiedCache.clear();
    this.isInitialized = false;
    this.latestProcessedData = null;

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

    this.cacheCleanupInterval = null;
  }

  public setColorHarmonyEngine(engine: ColorHarmonyEngine) {
    this.colorHarmonyEngine = engine;
    if (this.config.enableDebug) {
      console.log(
        "🎵 [MusicSyncService] ColorHarmonyEngine dependency injected."
      );
    }
  }

  public getLatestProcessedData(): any {
    return this.latestProcessedData;
  }

  private stopBeatScheduler(): void {
    if (this.beatSchedulerTimer) {
      clearTimeout(this.beatSchedulerTimer);
      this.beatSchedulerTimer = null;
    }
  }

  private triggerBeatEvent(): void {
    if (this.latestProcessedData) {
      const beatUpdate = { ...this.latestProcessedData, beatOccurred: true };
      this.notifySubscribers(beatUpdate, null, this.currentTrackUri);
    }
    this.nextBeatIndex++;
    this.scheduleNextBeatEvent();
  }

  private scheduleNextBeatEvent(): void {
    if (this.nextBeatIndex >= this.currentSongBeats.length) {
      return;
    }

    const nextBeat = this.currentSongBeats[this.nextBeatIndex];
    const timeSinceSongStart = Date.now() - this.songStartTimestamp;
    const delay = nextBeat.start * 1000 - timeSinceSongStart;

    if (delay >= 0) {
      this.beatSchedulerTimer = setTimeout(
        () => this.triggerBeatEvent(),
        delay
      );
    } else {
      this.nextBeatIndex++;
      this.scheduleNextBeatEvent();
    }
  }

  /**
   * Validate that the returned audio analysis object actually contains usable
   * information (primarily tempo). Spotify may return an empty object when the
   * analysis is not ready yet – treating that as valid poisons the cache.
   */
  private isValidAudioData(data: AudioData | null): data is AudioData {
    return !!data && typeof data.tempo === "number" && data.tempo > 0;
  }

  /**
   * Remove any cached entries (audioData, features, bpm, processed) belonging
   * to the provided track URI. Useful when switching tracks to ensure we do
   * not reuse stale or invalid data cached under the previous song.
   */
  private invalidateTrackCaches(trackUri: string): void {
    if (!trackUri) return;
    for (const key of this.unifiedCache.keys()) {
      if (key.includes(trackUri)) {
        this.unifiedCache.delete(key);
      }
    }
  }

  /**
   * Convert the lightweight `audio-features` payload into a pseudo `AudioData`
   * object so the rest of the pipeline (which expects full analysis) can work
   * immediately. Missing properties are filled with sensible defaults.
   */
  private convertFeaturesToAudioData(features: AudioFeatures): AudioData {
    const fb = MUSIC_SYNC_CONFIG.musicVisualSync.enhancedBPM.fallbacks;
    return {
      tempo: features.tempo,
      energy: features.energy,
      valence: features.valence,
      loudness: fb.loudness,
      key: fb.key,
      time_signature: fb.timeSignature,
      danceability: features.danceability,
      acousticness: features.acousticness,
      instrumentalness: features.instrumentalness,
      speechiness: 0,
      liveness: 0,
      mode: 0,
      // Optional arrays left undefined – beat grid will arrive later
    } as AudioData;
  }
}
