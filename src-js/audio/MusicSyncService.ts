import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { ThemeLifecycleCoordinator, Year3000System } from "@/core/lifecycle/ThemeLifecycleCoordinator";
import type { ColorContext } from "@/types/colorStrategy";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { SpicetifyAudioFeatures, SpicetifyPlayerData } from "@/types/systems";

// Runtime utilities for safe Spicetify access
function safeGetSpicetify(): typeof Spicetify | null {
  return (typeof window !== 'undefined' && window.Spicetify) ? window.Spicetify : null;
}

function isCosmosAsyncAvailable(): boolean {
  const spicetify = safeGetSpicetify();
  return !!(spicetify?.CosmosAsync);
}
// NOTE: SettingsManager import removed - was dead code, never used
import * as Utils from "@/utils/core/ThemeUtilities";
import { SpicetifyCompat } from "@/utils/platform/SpicetifyCompat";
import { settings } from "@/config";
import { GenreProfileManager } from "./GenreProfileManager";
import { 
  OKLABColorProcessor, 
  type EnhancementPreset 
} from "@/utils/color/OKLABColorProcessor";
import { 
  EmotionalTemperatureMapper 
} from "@/utils/color/EmotionalTemperatureMapper";

// Interfaces
interface GenreProfile {
  intensityMultiplier?: number;
  precisionBoost?: number;
  smoothingFactor?: number;
  adaptiveVariation?: boolean;
  [key: string]: unknown;
}

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
    [key: string]: GenreProfile;
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

// Spicetify audio analysis structures
interface SpicetifyAudioBeat {
  start: number;
  duration: number;
  confidence: number;
}

interface SpicetifyAudioBar {
  start: number;
  duration: number;
  confidence: number;
}

interface SpicetifyAudioSection {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

interface SpicetifyAudioSegment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max_time: number;
  loudness_max: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}

interface SpicetifyAudioTatum {
  start: number;
  duration: number;
  confidence: number;
}

interface ProcessedMusicData {
  enhancedBPM: number;
  genre: string;
  mood?: string;
  energy: number;
  valence: number;
  adaptedColorTemp?: number;
  rhythmicIntensity?: number;
  [key: string]: unknown;
}

interface UserPreferences {
  enableMusicSync: boolean;
  audioAnalysisQuality: string;
  [key: string]: unknown;
}

interface MusicSyncDependencies {
  ADVANCED_SYSTEM_CONFIG?: Year3000Config;
  YEAR3000_CONFIG?: Year3000Config; // Legacy compatibility
  ThemeUtilities?: typeof Utils;
  // NOTE: settingsManager removed - was dead code, never used
  year3000System?: ThemeLifecycleCoordinator;
  genreProfileManager?: any;
  [key: string]: unknown;
}

interface VisualSystemSubscriber {
  initialized: boolean;
  updateFromMusicAnalysis(
    processedData: ProcessedMusicData | null,
    rawFeatures: AudioData | null,
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
  beats?: SpicetifyAudioBeat[];
  bars?: SpicetifyAudioBar[];
  sections?: SpicetifyAudioSection[];
  segments?: SpicetifyAudioSegment[];
  tatums?: SpicetifyAudioTatum[];
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
  private config: AdvancedSystemConfig | Year3000Config;
  private utils: typeof Utils;
  // NOTE: settingsManager field removed - was dead code, never used
  private year3000System?: ThemeLifecycleCoordinator | null;
  private genreProfileManager: GenreProfileManager;
  
  // OKLAB integration for perceptually uniform color processing
  private oklabProcessor: OKLABColorProcessor;
  private emotionalTemperatureMapper: EmotionalTemperatureMapper;

  private isInitialized: boolean = false;
  private currentTrack: any = null;
  private audioData: AudioData | null = null;
  private currentTrackUri: string | null = null;
  private latestProcessedData: ProcessedMusicData | null = null;

  // High-precision beat scheduling
  private beatSchedulerTimer: NodeJS.Timeout | null = null;

  // Phase 1: Song Change Debouncing
  private songChangeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private nextBeatIndex: number = 0;
  private currentSongBeats: SpicetifyAudioBeat[] = [];
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

  private userPreferences: UserPreferences;
  private performanceInterval: NodeJS.Timeout | null = null;
  private cacheCleanupInterval: NodeJS.Timeout | null = null;

  // Increment this prefix whenever cache schema changes to avoid stale data
  private readonly CACHE_KEY_VERSION_PREFIX = "v3";

  // Phase 1: Event Processing State Tracking for Loop Prevention
  private eventProcessingState = {
    isProcessingEvent: false,
    eventChain: [] as string[],
    lastEventTime: 0,
    consecutiveEvents: 0
  };

  private readonly MAX_CONSECUTIVE_EVENTS = 5;
  private readonly EVENT_RESET_TIMEOUT = 3000;

  /** Current unit beat direction vector (updated each beat). */
  private currentBeatVector: { x: number; y: number } = { x: 0, y: 0 };

  constructor(dependencies: MusicSyncDependencies = {}) {
    this.config = dependencies.ADVANCED_SYSTEM_CONFIG || dependencies.YEAR3000_CONFIG || ADVANCED_SYSTEM_CONFIG;
    this.utils = dependencies.ThemeUtilities || Utils;
    // NOTE: settingsManager assignment removed - was dead code, never used
    this.year3000System = dependencies.year3000System || null;

    this.genreProfileManager =
      dependencies.genreProfileManager ||
      new GenreProfileManager({ ADVANCED_SYSTEM_CONFIG: this.config });

    // Initialize OKLAB integration for perceptually uniform color processing
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    this.emotionalTemperatureMapper = new EmotionalTemperatureMapper(this.config.enableDebug);

    this.cacheTTL = MUSIC_SYNC_CONFIG.performance.cacheTTL;
    this.userPreferences = this.loadUserPreferences();

    if (this.config.enableDebug) {
      console.log("🎵 MusicSyncService constructor called");
      console.log(
        "🎵 [MusicSyncService] Initialized with GenreProfileManager support"
      );
    }
  }

  /**
   * Public getter for initialization status (required for AdaptivePerformanceSystem dependency validation)
   */
  public get initialized(): boolean {
    return this.isInitialized;
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
    processedData: ProcessedMusicData | null,
    rawFeatures: AudioData | null,
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

    const spicetify = safeGetSpicetify();
    const currentTrackUri = (spicetify?.Player?.data?.item as SpicetifyPlayerData)?.uri;
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
        const spicetifyAudioData = await SpicetifyCompat.getAudioData();
        if (!spicetifyAudioData) continue;
        
        const audioData = this.convertSpicetifyToAudioData(spicetifyAudioData);

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
          // Return synthetic fallback so downstream visuals can still animate
          const fallback: AudioData = {
            tempo: 120,
            energy: 0.5,
            valence: 0.5,
            loudness: -10,
            key: 0,
            time_signature: 4,
            danceability: 0.5,
            acousticness: 0.5,
            instrumentalness: 0,
            speechiness: 0.05,
            liveness: 0.2,
            mode: 1,
          };
          if (this.config.enableDebug) {
            console.warn(
              `[MusicSyncService] All audio-data attempts failed – using fallback defaults`
            );
          }
          return fallback;
        }
      }

      // Delay before next retry
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    return null;
  }

  public async getAudioFeatures(): Promise<AudioFeatures | null> {
    try {
      const spicetify = safeGetSpicetify();
      const currentTrack = spicetify?.Player?.data?.item as SpicetifyPlayerData;
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

      // Safe CosmosAsync access with type checking
      const spicetifyForCosmos = safeGetSpicetify();
      if (!isCosmosAsyncAvailable() || !spicetifyForCosmos?.CosmosAsync) {
        throw new Error("CosmosAsync not available");
      }
      
      const response = await spicetifyForCosmos.CosmosAsync.get(
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
    options: Record<string, unknown> = {}
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const spicetify = safeGetSpicetify();
      const currentTrack = (spicetify?.Player?.data?.item || spicetify?.Player?.data) as SpicetifyPlayerData;
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

  // === OKLAB-ENHANCED COLOR PROCESSING ===

  /**
   * Create OKLAB-enhanced fallback colors based on music emotional context
   * Uses EmotionalTemperatureMapper to determine appropriate emotional state and OKLAB processing
   */
  private async createOKLABEnhancedFallbackColors(audioFeatures: any): Promise<Record<string, string>> {
    // Base Catppuccin fallback colors for OKLAB processing
    const baseFallbackColors = {
      VIBRANT: "#f2cdcd", // Catppuccin rosewater
      DARK_VIBRANT: "#cba6f7", // Catppuccin mauve  
      LIGHT_VIBRANT: "#f5c2e7", // Catppuccin pink
      PROMINENT: "#cba6f7", // Catppuccin mauve
      VIBRANT_NON_ALARMING: "#f2cdcd", // Catppuccin rosewater
      DESATURATED: "#9399b2", // Catppuccin overlay1
    };

    // If no audio features, process with standard preset
    if (!audioFeatures || typeof audioFeatures.energy !== 'number' || typeof audioFeatures.valence !== 'number') {
      const standardPreset = OKLABColorProcessor.getPreset('STANDARD');
      const processedColors: Record<string, string> = {};
      
      for (const [key, color] of Object.entries(baseFallbackColors)) {
        try {
          const oklabResult = this.oklabProcessor.processColor(color, standardPreset);
          processedColors[key] = oklabResult.enhancedHex;
        } catch (error) {
          if (this.config.enableDebug) {
            console.warn(`🎨 [MusicSyncService] OKLAB processing failed for ${key}:`, error);
          }
          processedColors[key] = color; // Fallback to original color
        }
      }
      
      return processedColors;
    }

    // Use EmotionalTemperatureMapper to determine emotional context
    const musicAnalysisData = {
      energy: audioFeatures.energy,
      valence: audioFeatures.valence,
      danceability: audioFeatures.danceability,
      tempo: audioFeatures.tempo,
      mode: audioFeatures.mode,
      genre: this.genreProfileManager.detectGenre(audioFeatures)
    };

    const emotionalResult = this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(musicAnalysisData);
    
    // Get optimal OKLAB preset based on emotional intensity
    let preset: EnhancementPreset;
    if (emotionalResult.intensity >= 1.0) {
      preset = OKLABColorProcessor.getPreset('COSMIC');
    } else if (emotionalResult.intensity >= 0.7) {
      preset = OKLABColorProcessor.getPreset('VIBRANT');
    } else if (emotionalResult.intensity >= 0.5) {
      preset = OKLABColorProcessor.getPreset('STANDARD');
    } else {
      preset = OKLABColorProcessor.getPreset('SUBTLE');
    }

    // Process base colors through OKLAB with emotional context
    const processedColors: Record<string, string> = {};
    
    for (const [key, color] of Object.entries(baseFallbackColors)) {
      try {
        const oklabResult = this.oklabProcessor.processColor(color, preset);
        processedColors[key] = oklabResult.enhancedHex;
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(`🎨 [MusicSyncService] OKLAB processing failed for ${key}:`, error);
        }
        processedColors[key] = color; // Fallback to original color
      }
    }

    // Add emotional temperature CSS variables to the color context
    processedColors['--sn-emotional-primary'] = emotionalResult.perceptualColorHex || emotionalResult.primaryEmotion;
    processedColors['--sn-emotional-intensity'] = emotionalResult.intensity.toString();
    processedColors['--sn-emotional-preset'] = preset.name;

    if (this.config.enableDebug) {
      console.log('🎨 [MusicSyncService] Created OKLAB-enhanced fallback colors:', {
        emotion: emotionalResult.primaryEmotion,
        intensity: emotionalResult.intensity,
        preset: preset.name,
        oklabCoordination: processedColors,
        musicContext: { energy: audioFeatures.energy, valence: audioFeatures.valence }
      });
    }

    return processedColors;
  }

  /**
   * Enhance successfully extracted colors with OKLAB processing based on music emotional context
   * Applies perceptually uniform color processing while preserving the original color relationships
   */
  private async enhanceExtractedColorsWithOKLAB(extractedColors: Record<string, string>, audioFeatures: any): Promise<Record<string, string>> {
    const enhancedColors: Record<string, string> = {};

    // Determine OKLAB preset based on music context
    let preset: EnhancementPreset = OKLABColorProcessor.getPreset('STANDARD'); // Default preset
    
    if (audioFeatures && typeof audioFeatures.energy === 'number' && typeof audioFeatures.valence === 'number') {
      // Use EmotionalTemperatureMapper to get contextual preset
      const musicAnalysisData = {
        energy: audioFeatures.energy,
        valence: audioFeatures.valence,
        danceability: audioFeatures.danceability,
        tempo: audioFeatures.tempo,
        mode: audioFeatures.mode,
        genre: this.genreProfileManager.detectGenre(audioFeatures)
      };

      const emotionalResult = this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(musicAnalysisData);
      
      // Select preset based on emotional intensity
      if (emotionalResult.intensity >= 1.0) {
        preset = OKLABColorProcessor.getPreset('COSMIC');
      } else if (emotionalResult.intensity >= 0.7) {
        preset = OKLABColorProcessor.getPreset('VIBRANT');
      } else if (emotionalResult.intensity >= 0.5) {
        preset = OKLABColorProcessor.getPreset('STANDARD');
      } else {
        preset = OKLABColorProcessor.getPreset('SUBTLE');
      }

      // Add emotional CSS variables
      enhancedColors['--sn-emotional-primary'] = emotionalResult.perceptualColorHex || `oklabColorProcessor-${emotionalResult.primaryEmotion}`;
      enhancedColors['--sn-emotional-intensity'] = emotionalResult.intensity.toString();
      enhancedColors['--sn-emotional-temperature'] = emotionalResult.temperature.toString();
      
      if (this.config.enableDebug) {
        console.log('🎨 [MusicSyncService] Applying OKLAB enhancement with emotional context:', {
          emotion: emotionalResult.primaryEmotion,
          intensity: emotionalResult.intensity,
          preset: preset.name,
          colorCount: Object.keys(extractedColors).length
        });
      }
    }

    // Process each extracted color through OKLAB
    for (const [key, color] of Object.entries(extractedColors)) {
      if (!color || typeof color !== 'string' || !color.startsWith('#')) {
        enhancedColors[key] = color; // Keep non-color values as-is
        continue;
      }

      try {
        const oklabResult = this.oklabProcessor.processColor(color, preset);
        enhancedColors[key] = oklabResult.enhancedHex;
        
        // Add OKLAB coordinates as additional CSS variables for advanced effects
        enhancedColors[`${key}-oklab-l`] = oklabResult.oklabEnhanced.L.toFixed(3);
        enhancedColors[`${key}-oklab-a`] = oklabResult.oklabEnhanced.a.toFixed(3);
        enhancedColors[`${key}-oklab-b`] = oklabResult.oklabEnhanced.b.toFixed(3);
        
        // Add OKLCH representation for hue-based animations
        enhancedColors[`${key}-oklch-c`] = oklabResult.oklchEnhanced.C.toFixed(3);
        enhancedColors[`${key}-oklch-h`] = oklabResult.oklchEnhanced.H.toFixed(1);
        
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(`🎨 [MusicSyncService] OKLAB processing failed for ${key} (${color}):`, error);
        }
        enhancedColors[key] = color; // Fallback to original color
      }
    }

    // Add OKLAB metadata
    enhancedColors['--sn-oklab-preset'] = preset.name;
    enhancedColors['--sn-oklab-enhanced'] = 'true';

    if (this.config.enableDebug) {
      console.log('🎨 [MusicSyncService] OKLAB color enhancement completed:', {
        originalCount: Object.keys(extractedColors).length,
        enhancedCount: Object.keys(enhancedColors).length,
        preset: preset.name,
        sampleEnhanced: {
          original: extractedColors.VIBRANT || extractedColors[Object.keys(extractedColors)[0] || ''],
          enhanced: enhancedColors.VIBRANT || enhancedColors[Object.keys(enhancedColors)[0] || '']
        }
      });
    }

    return enhancedColors;
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

      // Emit unified music events for modern systems
      unifiedEventBus.emitSync("music:beat", {
        bpm: processedData.enhancedBPM,
        intensity: processedData.visualIntensity,
        timestamp: performance.now(),
        confidence: 0.8
      });

      unifiedEventBus.emitSync("music:energy", {
        energy: processedData.energy || 0.5,
        valence: processedData.valence || 0.5,
        tempo: processedData.enhancedBPM,
        timestamp: performance.now()
      });

      // Emit performance frame data
      unifiedEventBus.emitSync("performance:frame", {
        deltaTime: 16, // Approximate frame time
        fps: 60,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        timestamp: performance.now()
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

  /**
   * Re-extract colours & (optionally) recompute beat analysis for the current
   * track.  When `force === true` the method runs even if the track URI hasn't
   * changed (used after live settings updates so gradients repaint instantly).
   */
  public async processSongUpdate(force: boolean = false): Promise<void> {
    const spicetify = safeGetSpicetify();
    const trackUri = (spicetify?.Player?.data?.item as SpicetifyPlayerData)?.uri;

    if (!trackUri) return;

    if (!force && trackUri === this.currentTrackUri) {
      // No change in track and caller didn't request a forced refresh – exit.
      return;
    }

    // Phase 1: Debounce rapid song changes
    if (this.songChangeDebounceTimer) {
      clearTimeout(this.songChangeDebounceTimer);
    }

    // If force is true, bypass debouncing for immediate settings updates
    if (force) {
      await this._processSongUpdateInternal(trackUri);
      return;
    }

    // Debounce normal song changes using existing config
    this.songChangeDebounceTimer = setTimeout(async () => {
      this.songChangeDebounceTimer = null;
      await this._processSongUpdateInternal(trackUri);
    }, MUSIC_SYNC_CONFIG.synchronization.debounceRapidChanges);
  }

  /**
   * Internal implementation of song processing, extracted for debouncing.
   * 🔧 PHASE 1: Enhanced with event loop prevention and chain tracking
   */
  private async _processSongUpdateInternal(trackUri: string): Promise<void> {
    // Phase 1: Loop Prevention - Check if already processing
    if (this.eventProcessingState.isProcessingEvent) {
      if (this.config.enableDebug) {
        console.warn("🔄 [MusicSyncService] Already processing song update - skipping to prevent recursion");
      }
      return;
    }

    // Phase 1: Set processing state and tracking
    this.eventProcessingState.isProcessingEvent = true;
    this.eventProcessingState.lastEventTime = Date.now();
    this.eventProcessingState.consecutiveEvents++;
    this.eventProcessingState.eventChain.push('_processSongUpdateInternal');

    // Phase 1: Check for consecutive event overflow (circuit breaker)
    if (this.eventProcessingState.consecutiveEvents > this.MAX_CONSECUTIVE_EVENTS) {
      console.error("🔄 [MusicSyncService] CRITICAL: Too many consecutive events - circuit breaker activated", {
        consecutiveEvents: this.eventProcessingState.consecutiveEvents,
        eventChain: this.eventProcessingState.eventChain
      });
      this._resetEventProcessingState();
      return;
    }

    // Phase 1: Set safety timeout for auto-reset
    const resetTimeout = setTimeout(() => {
      if (this.config.enableDebug) {
        console.warn("🔄 [MusicSyncService] Event processing timeout - resetting state");
      }
      this._resetEventProcessingState();
    }, this.EVENT_RESET_TIMEOUT);

    try {
      // New track detected – clear any stale cache entries for it
      this.invalidateTrackCaches(trackUri);
      const spicetify = safeGetSpicetify();
      const trackDuration =
        (spicetify?.Player?.data?.item as SpicetifyPlayerData)?.duration || 0;

      // Phase 1 – instant colour update + provisional BPM from audio-features
      // Use Promise.allSettled for graceful degradation - continue with partial success
      const results = await Promise.allSettled([
        this.getAudioFeatures(),
        this.robustColorExtraction(trackUri), // 🔧 IMPROVED: More robust color extraction
      ]);

      const audioFeatures =
        results[0].status === "fulfilled" ? results[0].value : null;
      const rawColors =
        results[1].status === "fulfilled" ? results[1].value : null;

      // Log warnings for failed strategies but continue processing
      if (results[0].status === "rejected") {
        if (this.config.enableDebug) {
          console.warn(
            "[MusicSyncService] Audio features retrieval failed, continuing without music analysis:",
            results[0].reason
          );
        }
      }
      if (results[1].status === "rejected") {
        if (this.config.enableDebug) {
          console.warn(
            "[MusicSyncService] Color extraction failed, continuing without color processing:",
            results[1].reason
          );
        }
      }

      // Log successful graceful degradation
      if (this.config.enableDebug) {
        const successCount = (audioFeatures ? 1 : 0) + (rawColors ? 1 : 0);
        if (successCount === 1) {
          console.log(
            `[MusicSyncService] Graceful degradation: Continuing with ${
              audioFeatures ? "audio features only" : "color extraction only"
            }`
          );
        } else if (successCount === 2) {
          console.log("[MusicSyncService] Full feature extraction successful");
        } else {
          console.warn(
            "[MusicSyncService] Both strategies failed, will use fallback data"
          );
        }
      }

      // 🎨 CRITICAL: Log raw colors before sanitization
      console.log("🎨 [MusicSyncService] Raw colors BEFORE sanitization:", {
        rawColors,
        rawColorType: typeof rawColors,
        rawColorKeys: rawColors ? Object.keys(rawColors) : [],
        rawColorEntries: rawColors ? Object.entries(rawColors) : []
      });

      // Sanitize extracted colours to remove undefined / malformed values
      const colors = this.utils.sanitizeColorMap(
        (rawColors as Record<string, string>) || {}
      );

      // 🎨 CRITICAL: Log colors after sanitization
      console.log("🎨 [MusicSyncService] Colors AFTER sanitization:", {
        sanitizedColors: colors,
        sanitizedColorType: typeof colors,
        sanitizedColorKeys: Object.keys(colors),
        sanitizedColorEntries: Object.entries(colors),
        colorCount: Object.keys(colors).length,
        droppedCount: rawColors ? Object.keys(rawColors).length - Object.keys(colors).length : 0
      });

      // 🎨 DEBUG: Color extraction pipeline logging
      if (this.config.enableDebug) {
        console.log("🎨 [MusicSyncService] Color extraction debug:", {
          trackUri,
          rawColorsReceived: rawColors,
          sanitizedColors: colors,
          colorCount: Object.keys(colors).length,
          colorExtractorFailed: results[1].status === "rejected",
        });
      }

      // 🎨 OKLAB ENHANCEMENT: Process successfully extracted colors through OKLAB for perceptual uniformity
      let finalColors = colors;
      let usingFallback = false;
      
      if (Object.keys(colors).length > 0) {
        try {
          // Apply OKLAB processing to extracted colors with emotional context
          finalColors = await this.enhanceExtractedColorsWithOKLAB(colors, audioFeatures);
          
          if (this.config.enableDebug) {
            console.log("🎨 [MusicSyncService] Successfully enhanced extracted colors with OKLAB processing");
          }
        } catch (oklabError) {
          if (this.config.enableDebug) {
            console.warn("🎨 [MusicSyncService] OKLAB enhancement failed, using original extracted colors:", oklabError);
          }
          // Continue with original colors if OKLAB processing fails
          finalColors = colors;
        }
      }

      if (Object.keys(colors).length === 0) {
        // 🎨 OKLAB-ENHANCED FALLBACK: Use OKLAB-processed Catppuccin colors with emotional context
        try {
          // Create OKLAB-enhanced fallback colors based on music emotional context
          const fallbackColors = await this.createOKLABEnhancedFallbackColors(audioFeatures);
          finalColors = fallbackColors;
          usingFallback = true;

          if (this.config.enableDebug) {
            console.warn(
              "🎨 [MusicSyncService] Color extraction failed, using OKLAB-enhanced Catppuccin fallback colors with emotional context"
            );
          }
        } catch (oklabError) {
          if (this.config.enableDebug) {
            console.warn("🎨 [MusicSyncService] OKLAB fallback processing failed, using static fallback colors:", oklabError);
          }
          // Static fallback as last resort
          finalColors = {
            VIBRANT: "#f2cdcd", // Catppuccin rosewater
            DARK_VIBRANT: "#cba6f7", // Catppuccin mauve
            LIGHT_VIBRANT: "#f5c2e7", // Catppuccin pink
            PROMINENT: "#cba6f7", // Catppuccin mauve
            VIBRANT_NON_ALARMING: "#f2cdcd", // Catppuccin rosewater
            DESATURATED: "#9399b2", // Catppuccin overlay1
          };
          usingFallback = true;
        }
      }

      const colorContext: ColorContext = {
        rawColors: finalColors,
        trackUri,
        timestamp: Date.now(),
        colorHarmonyMode: this.config.currentColorHarmonyMode || "catppuccin",
        harmonicMode: this.config.currentColorHarmonyMode || "catppuccin", // Legacy compatibility
        musicData: audioFeatures
          ? {
              energy: audioFeatures.energy,
              valence: audioFeatures.valence,
              tempo: audioFeatures.tempo,
              genre: this.genreProfileManager.detectGenre(audioFeatures),
            }
          : undefined,
        performanceHints: {
          preferLightweight: false,
          enableAdvancedBlending: true,
          maxProcessingTime: 100, // 100ms max for color processing
        },
      };

      // 🎨 CRITICAL: Log final colors before event emission
      console.log("🎨 [MusicSyncService] FINAL colors before event emission:", {
        finalColors,
        finalColorKeys: Object.keys(finalColors),
        finalColorEntries: Object.entries(finalColors),
        usingFallback,
        extractionFailed: Object.keys(colors).length === 0
      });

      // Always emit event for color processing via strategy pattern
      const eventData: any = {
        rawColors: colorContext.rawColors,
        trackUri: colorContext.trackUri,
        timestamp: Date.now()
      };
      
      if (colorContext.musicData) {
        eventData.musicData = colorContext.musicData;
      }
      
      // 🎨 CRITICAL: Log event data being emitted
      console.log("🎨 [MusicSyncService] Emitting colors:extracted event with data:", {
        eventData,
        rawColorKeys: eventData.rawColors ? Object.keys(eventData.rawColors) : [],
        rawColorEntries: eventData.rawColors ? Object.entries(eventData.rawColors) : []
      });
      
      unifiedEventBus.emitSync("colors:extracted", eventData);

      if (this.config.enableDebug) {
        console.log(
          "🎵 [MusicSyncService] Emitted colors:extracted event for strategy processing",
          {
            trackUri,
            colorCount: Object.keys(finalColors).length,
            usingFallback,
            extractionFailed: Object.keys(colors).length === 0,
          }
        );
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
    } finally {
      // Phase 1: Always clean up processing state and clear timeout
      clearTimeout(resetTimeout);
      this._resetEventProcessingState();
      
      // Phase 1: Remove from event chain
      const chainIndex = this.eventProcessingState.eventChain.indexOf('_processSongUpdateInternal');
      if (chainIndex > -1) {
        this.eventProcessingState.eventChain.splice(chainIndex, 1);
      }
    }
  }

  /**
   * Phase 1: Reset event processing state for loop prevention
   */
  private _resetEventProcessingState(): void {
    this.eventProcessingState.isProcessingEvent = false;
    this.eventProcessingState.eventChain = [];
    
    // Reset consecutive events counter with exponential backoff
    const now = Date.now();
    const timeSinceLastEvent = now - this.eventProcessingState.lastEventTime;
    
    if (timeSinceLastEvent > this.EVENT_RESET_TIMEOUT) {
      this.eventProcessingState.consecutiveEvents = 0;
    } else {
      // Gradual decay of consecutive count if events are spaced apart
      const decayFactor = Math.min(1, timeSinceLastEvent / this.EVENT_RESET_TIMEOUT);
      this.eventProcessingState.consecutiveEvents = Math.floor(
        this.eventProcessingState.consecutiveEvents * (1 - decayFactor)
      );
    }

    if (this.config.enableDebug && this.eventProcessingState.consecutiveEvents > 0) {
      console.log("🔄 [MusicSyncService] Event processing state reset", {
        consecutiveEvents: this.eventProcessingState.consecutiveEvents,
        timeSinceLastEvent
      });
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

  private loadUserPreferences(): UserPreferences {
    try {
      // Use individual settings from the typed system instead of a single JSON blob
      return {
        enableMusicSync: true, // Always enabled since no specific setting exists
        audioAnalysisQuality: settings.get("sn-webgl-quality") || "medium",
        gradientIntensity: settings.get("sn-gradient-intensity") || "balanced",
        artisticMode: settings.get("sn-artistic-mode") || "artist-vision",
      };
    } catch (e) {
      return {
        enableMusicSync: true,
        audioAnalysisQuality: "medium",
        gradientIntensity: "balanced",
        artisticMode: "artist-vision",
      };
    }
  }

  private saveUserPreferences(): void {
    try {
      // Music sync preferences are now managed by the core settings system
      // Individual settings are saved automatically by the settings provider
      if (this.config.enableDebug) {
        console.log("[MusicSyncService] User preferences updated via settings system");
      }
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
    // Clear debounce timer (Phase 1)
    if (this.songChangeDebounceTimer) {
      clearTimeout(this.songChangeDebounceTimer);
      this.songChangeDebounceTimer = null;
    }

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

  // Legacy method for backward compatibility - now uses event-driven pattern
  public setColorHarmonyEngine(engine: any) {
    if (this.config.enableDebug) {
      console.log(
        "🎵 [MusicSyncService] setColorHarmonyEngine called - now using event-driven pattern instead of direct dependency."
      );
    }
    // No-op: ColorHarmonyEngine integration now handled via unifiedEventBus
  }

  public getLatestProcessedData(): any {
    return this.latestProcessedData;
  }

  /**
   * Get the latest beat vector (unit direction) for visual systems that need
   * directional rhythm cues. Falls back to {0,0} when unavailable.
   */
  public getCurrentBeatVector(): { x: number; y: number } {
    return { ...this.currentBeatVector };
  }

  private stopBeatScheduler(): void {
    if (this.beatSchedulerTimer) {
      clearTimeout(this.beatSchedulerTimer);
      this.beatSchedulerTimer = null;
    }
  }

  private triggerBeatEvent(): void {
    // --- Update beat vector --------------------------------------------------
    // Generate a pseudo-random but temporally coherent direction. We rotate the
    // vector each beat by a golden-ratio increment so it never repeats in a
    // short cycle yet still feels smooth.
    const GOLDEN_RATIO = 0.61803398875;
    const angle = ((this.nextBeatIndex * GOLDEN_RATIO) % 1) * Math.PI * 2;
    this.currentBeatVector = { x: Math.cos(angle), y: Math.sin(angle) };

    if (this.latestProcessedData) {
      const beatUpdate = {
        ...this.latestProcessedData,
        beatOccurred: true,
        beatVector: this.currentBeatVector,
      };
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
    if (!nextBeat) {
      return; // No more beats available
    }
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
  
  /**
   * Convert SpicetifyAudioFeatures to internal AudioData format
   * Handles property name mapping and provides fallback values
   */
  private convertSpicetifyToAudioData(spicetifyData: SpicetifyAudioFeatures): AudioData {
    return {
      tempo: spicetifyData.tempo,
      energy: spicetifyData.energy,
      valence: spicetifyData.valence,
      loudness: spicetifyData.loudness,
      key: spicetifyData.key,
      time_signature: spicetifyData.time_signature || spicetifyData.timeSignature,
      danceability: spicetifyData.danceability,
      acousticness: spicetifyData.acousticness,
      instrumentalness: spicetifyData.instrumentalness,
      speechiness: spicetifyData.speechiness,
      liveness: spicetifyData.liveness,
      mode: spicetifyData.mode,
      // Optional arrays can be undefined for now
    };
  }

  /**
   * 🔧 IMPROVED: Robust color extraction with retry logic and fallbacks
   */
  private async robustColorExtraction(
    trackUri: string,
    maxRetries: number = 3
  ): Promise<Record<string, string> | null> {
    // 🎨 ENHANCED LOGGING: Track complete color extraction flow
    console.log("🎨 [MusicSyncService] Starting robust color extraction:", {
      trackUri,
      maxRetries,
      timestamp: Date.now()
    });

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!trackUri) {
          console.warn(
            "🎨 [MusicSyncService] Empty trackUri provided to color extraction"
          );
          return null;
        }

        // 🎨 CRITICAL: Log before Spicetify call
        console.log(`🎨 [MusicSyncService] Calling Spicetify.colorExtractor (attempt ${attempt})...`);
        
        const spicetify = safeGetSpicetify();
        if (!spicetify?.colorExtractor) {
          throw new Error("colorExtractor not available");
        }
        const colors = await spicetify.colorExtractor(trackUri);

        // 🎨 CRITICAL: Log raw extraction result
        console.log(
          `🎨 [MusicSyncService] Raw color extraction result (attempt ${attempt}):`,
          {
            trackUri,
            success: !!colors,
            colorsType: typeof colors,
            colorsIsNull: colors === null,
            colorsIsUndefined: colors === undefined,
            colorCount: colors ? Object.keys(colors).length : 0,
            rawColors: colors,
            colorKeys: colors ? Object.keys(colors) : [],
            colorValues: colors ? Object.values(colors) : []
          }
        );

        // Check if we got meaningful colors (not empty or null)
        if (
          colors &&
          typeof colors === "object" &&
          Object.keys(colors).length > 0
        ) {
          // 🎨 CRITICAL: Log each extracted color
          Object.entries(colors).forEach(([key, value]) => {
            console.log(`🎨 [MusicSyncService] Extracted color: ${key} = ${value}`);
          });
          
          return colors as Record<string, string>;
        } else {
          console.warn(`🎨 [MusicSyncService] Color extraction returned empty/invalid data on attempt ${attempt}`);
        }
      } catch (error) {
        console.error(
          `🎨 [MusicSyncService] Color extraction attempt ${attempt} failed with error:`,
          error,
          {
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined
          }
        );

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = 100 * attempt;
          console.log(`🎨 [MusicSyncService] Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }

    // All attempts failed
    console.error(
      `🎨 [MusicSyncService] CRITICAL: All color extraction attempts failed for ${trackUri}`
    );
    return null;
  }

  // -------------------------------------------------------------------
  // External adapter integration helpers ------------------------------
  // -------------------------------------------------------------------

  /**
   * Adapter-facing helper to push music metrics without relying on the
   * full processing pipeline.  Currently a no-op placeholder that may be
   * expanded in future phases.
   */
  public updateMetrics(metrics: any): void {
    // Intentionally lightweight; store latest metrics for retrieval.
    this.latestProcessedData = metrics;
  }

  /**
   * Get current music state for visual effects systems
   */
  public getCurrentMusicState(): {
    emotion: any;
    beat: any;
    intensity: number;
  } | null {
    if (!this.latestProcessedData || !this.audioData) {
      return null;
    }

    return {
      emotion: this.latestProcessedData.emotion || null,
      beat: {
        tempo: this.latestProcessedData.bpm || this.audioData.tempo || 120,
        energy: (this.latestProcessedData.energy as number) || this.audioData.energy || 0.5,
        timestamp: Date.now(),
      },
      intensity:
        (this.latestProcessedData.intensity as number) || this.audioData.energy || 0.5,
    };
  }

  /**
   * Health check method for system status reporting
   */
  public async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'critical'; message: string; details?: any }> {
    try {
      const isSpicetifyAvailable = SpicetifyCompat.isAvailable();
      const hasSubscribers = this.subscribers.size > 0;
      const hasRecentData = this.latestProcessedData !== null;
      const totalOperations = this.metrics.bpmCalculations + this.metrics.beatSyncs + this.metrics.cacheHits + this.metrics.cacheMisses;
      const errorRate = totalOperations > 0 ? this.metrics.errors / totalOperations : 0;

      // Determine health status
      if (!this.isInitialized) {
        return {
          status: 'critical',
          message: 'System not initialized',
          details: { initialized: this.isInitialized, spicetifyAvailable: isSpicetifyAvailable }
        };
      }

      if (!isSpicetifyAvailable) {
        return {
          status: 'degraded',
          message: 'Spicetify audio data API not available - running in limited mode',
          details: { 
            initialized: this.isInitialized, 
            spicetifyAvailable: isSpicetifyAvailable, 
            subscribers: hasSubscribers,
            recentData: hasRecentData,
            errorRate: errorRate
          }
        };
      }

      if (errorRate > 0.5) {
        return {
          status: 'degraded',
          message: `High error rate detected: ${(errorRate * 100).toFixed(1)}%`,
          details: { 
            initialized: this.isInitialized, 
            spicetifyAvailable: isSpicetifyAvailable, 
            subscribers: hasSubscribers,
            recentData: hasRecentData,
            errorRate: errorRate,
            errors: this.metrics.errors,
            totalOperations: totalOperations
          }
        };
      }

      return {
        status: 'healthy',
        message: 'Music sync service operational',
        details: { 
          initialized: this.isInitialized, 
          spicetifyAvailable: isSpicetifyAvailable, 
          subscribers: hasSubscribers,
          subscriberCount: this.subscribers.size,
          recentData: hasRecentData,
          errorRate: errorRate,
          bpmCalculations: this.metrics.bpmCalculations,
          beatSyncs: this.metrics.beatSyncs,
          cacheHits: this.metrics.cacheHits,
          cacheMisses: this.metrics.cacheMisses,
          avgProcessingTime: this.metrics.avgProcessingTime,
          errors: this.metrics.errors,
          updates: this.metrics.updates
        }
      };

    } catch (error) {
      return {
        status: 'critical',
        message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}
