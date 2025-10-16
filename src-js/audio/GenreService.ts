import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { GenreProfileManager } from "@/audio/GenreProfileManager";
import {
  GenreType,
  type AudioFeatures,
  type GenreCharacteristics,
  type GenreColorCharacteristics,
  type GenreDetectionResult,
  type GenreVisualStyle,
  type MusicAnalysisProfile,
} from "@/types/genre";
import { EmotionalTemperatureMapper } from "@/utils/color/EmotionalTemperatureMapper";
import type { GenreSystemService } from "@/core/services/SystemServices";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";

interface GenreServiceDependencies {
  config?: AdvancedSystemConfig | Year3000Config;
  manager?: GenreProfileManager;
}

/**
 * GenreService - Service bridge for unified genre operations
 *
 * Wraps GenreProfileManager with lifecycle management and subscription-based
 * notifications so systems can consume genre data through the service
 * container instead of direct instantiation.
 */
export class GenreService implements IManagedSystem, GenreSystemService {
  public initialized = false;

  private readonly config: AdvancedSystemConfig | Year3000Config;
  private readonly manager: GenreProfileManager;
  private lastDetection: GenreDetectionResult | null = null;
  private subscribers = new Map<string, (result: GenreDetectionResult) => void>();
  private subscriberSeed = 0;
  // Phase 2.3: Caching & Performance
  private calculationCache = new Map<string, { value: unknown; expiresAt: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cacheHits = 0;
  private cacheMisses = 0;
  // Phase 4: Emotion consolidation
  private readonly emotionMapper = new EmotionalTemperatureMapper(false);
  private readonly useUnifiedEmotionAnalysis = true;

  constructor(dependencies: GenreServiceDependencies = {}) {
    this.config = dependencies.config ?? ADVANCED_SYSTEM_CONFIG;
    this.manager =
      dependencies.manager ??
      new GenreProfileManager({ ADVANCED_SYSTEM_CONFIG: this.config });
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
  }

  public updateAnimation(_deltaTime: number): void {
    // Genre detection does not require animation updates.
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      system: "GenreService",
      healthy: true,
      details: this.lastDetection
        ? `Last genre ${this.lastDetection.genre} (${(this.lastDetection.confidence * 100).toFixed(0)}% confidence)`
        : "No genre detections yet",
      metrics: {
        initialized: this.initialized,
        totalOperations: this.manager.getGenreHistory().length,
        cacheSize: this.calculationCache.size,
        cacheHits: this.cacheHits,
        cacheMisses: this.cacheMisses,
        ...(this.lastDetection
          ? { lastUpdate: this.lastDetection.timestamp }
          : {}),
      },
    };
  }

  public destroy(): void {
    this.initialized = false;
    this.subscribers.clear();
    this.lastDetection = null;
  }

  public getCurrentGenre(): GenreType {
    return this.manager.getCurrentGenre();
  }

  public getGenreConfidence(): number {
    return this.manager.getGenreConfidence();
  }

  public getGenreHistory(): Array<{
    genre: GenreType;
    confidence: number;
    timestamp: number;
  }> {
    return this.manager.getGenreHistory();
  }

  public detectGenre(features?: AudioFeatures): GenreDetectionResult {
    const genre = this.manager.detectGenre(features);

    // Phase 2: Use unified profile instead of legacy profile
    const profile = this.getMusicAnalysisProfile(features);

    const detection: GenreDetectionResult = {
      genre,
      confidence: profile.confidence,
      profile,  // ✅ Now MusicAnalysisProfile with all data
      timestamp: profile.timestamp,
    };

    this.lastDetection = detection;
    this.notifySubscribers(detection);
    return detection;
  }

  public getColorCharacteristicsForGenre(
    genre: GenreType
  ): GenreColorCharacteristics {
    return this.manager.getColorCharacteristicsForGenre(genre);
  }

  public getCharacteristics(genre: GenreType): GenreCharacteristics {
    return this.getCachedResult(`char:${genre}`, () => this.manager.getCharacteristics(genre));
  }

  public getVisualStyle(genre: GenreType): GenreVisualStyle {
    return this.getCachedResult(`vis:${genre}`, () => this.manager.getVisualStyle(genre));
  }

  public getLastDetection(): GenreDetectionResult | null {
    return this.lastDetection;
  }

  public subscribe(
    listener: (result: GenreDetectionResult) => void
  ): () => void {
    const id = `genre-listener-${this.subscriberSeed++}`;
    this.subscribers.set(id, listener);

    if (this.lastDetection) {
      try {
        listener(this.lastDetection);
      } catch (error) {
        console.warn("[GenreService] Subscriber threw during immediate replay", error);
      }
    }

    return () => {
      this.subscribers.delete(id);
    };
  }

  public getOKLABPresetForGenre(genre: GenreType) {
    return this.getCachedResult(`oklab:${genre}`, () => this.manager.getOKLABPresetForGenre(genre));
  }

  public getManager(): GenreProfileManager {
    return this.manager;
  }

  // ==============================
  // Phase 4 – Unified Emotion + Genre Profile
  // ==============================
  public getMusicAnalysisProfile(features: AudioFeatures = {}): MusicAnalysisProfile {
    // Phase 2: Directly detect genre without calling detectGenre() to avoid circular dependency
    const genre = this.manager.detectGenre(features);
    const characteristics = this.manager.getCharacteristics(genre);
    const visualStyle = this.manager.getVisualStyle(genre);
    const confidence = this.manager.getGenreConfidence();

    const key = `musicProfile:${genre}:${features.energy ?? 0}:${features.valence ?? 0}:${features.tempo ?? 0}`;
    return this.getCachedResult(key, () => {
      const emotion = this.calculateEmotionFromFeatures(features, genre);

      const smoothFlow = GenreService.clamp01(
        0.6 - (characteristics.rhythmComplexity ?? 0.5) * 0.3 + (features.danceability ?? 0.5) * 0.5
      );
      const cinematicDepth = GenreService.clamp01(
        ((visualStyle?.depthIllusion ?? 0.5) * 0.7) + ((visualStyle?.contrastLevel ?? 0.5) * 0.3)
      );
      const visualEffectsResonance = GenreService.clamp01(
        (features.energy ?? 0.5) * 0.6 + (features.danceability ?? 0.5) * 0.4
      );

      const profile: MusicAnalysisProfile = {
        timestamp: Date.now(),
        confidence: Math.min(1, Math.max(0, confidence)),
        genre,
        characteristics,
        visualStyle,
        emotion: {
          primary: emotion.primary,
          intensity: emotion.intensity,
          confidence: emotion.confidence,
          valence: features.valence ?? 0.5,
          arousal: features.energy ?? 0.5,
          mood: emotion.mood,
          temperatureK: emotion.temperatureK,
        },
        colorTemperature: emotion.temperatureK,
        visualMetrics: {
          smoothFlow,
          cinematicDepth,
          visualEffectsResonance,
          energy: features.energy ?? 0.5,
          danceability: features.danceability ?? 0.5,
        },
        rawFeatures: (() => {
          const rf: MusicAnalysisProfile["rawFeatures"] = {};
          if (typeof features.tempo === 'number') rf.tempo = features.tempo;
          if (typeof features.key === 'number') rf.key = features.key;
          if (typeof features.mode === 'number') rf.mode = features.mode;
          if (typeof features.loudness === 'number') rf.loudness = features.loudness;
          if (typeof features.danceability === 'number') rf.danceability = features.danceability;
          if (typeof features.energy === 'number') rf.energy = features.energy;
          if (typeof features.valence === 'number') rf.valence = features.valence;
          if (typeof features.acousticness === 'number') rf.acousticness = features.acousticness;
          if (typeof features.instrumentalness === 'number') rf.instrumentalness = features.instrumentalness;
          if (typeof features.speechiness === 'number') rf.speechiness = features.speechiness;
          return rf;
        })(),
      };

      return profile;
    });
  }

  public calculateEmotionFromFeatures(features: AudioFeatures = {}, genre?: GenreType): {
    primary: any; // EmotionType shape
    intensity: number;
    confidence: number;
    temperatureK: number;
    mood: string;
  } {
    if (!this.useUnifiedEmotionAnalysis) {
      // Fallback conservative defaults
      return {
        primary: 'calm',
        intensity: 0.6,
        confidence: 0.5,
        temperatureK: 4000,
        mood: 'neutral',
      };
    }

    const result = this.emotionMapper.mapMusicToEmotionalTemperature({
      energy: features.energy ?? 0.5,
      valence: features.valence ?? 0.5,
      danceability: features.danceability ?? 0.5,
      tempo: features.tempo ?? 120,
      mode: features.mode ?? 1,
      genre: genre ?? this.lastDetection?.genre ?? GenreType.DEFAULT,
    } as any);

    // Derive a confidence score from intensity bounded by feature presence
    const featureCompleteness = [
      features.energy,
      features.valence,
      features.danceability,
      features.tempo,
    ].filter((v) => typeof v === 'number').length / 4;

    const confidence = GenreService.clamp01(
      0.5 * featureCompleteness + 0.5 * Math.min(1, result.intensity)
    );

    const mood = (() => {
      const e = features.energy ?? 0.5;
      const v = features.valence ?? 0.5;
      if (e > 0.6 && v > 0.6) return 'energetic-happy';
      if (e > 0.6 && v <= 0.4) return 'intense-moody';
      if (e <= 0.4 && v > 0.6) return 'calm-happy';
      if (e <= 0.4 && v <= 0.4) return 'calm-melancholy';
      return 'neutral';
    })();

    return {
      primary: result.primaryEmotion as any,
      intensity: result.intensity,
      confidence,
      temperatureK: result.temperature,
      mood,
    };
  }

  private notifySubscribers(result: GenreDetectionResult): void {
    for (const listener of this.subscribers.values()) {
      try {
        listener(result);
      } catch (error) {
        console.warn("[GenreService] Subscriber handler failed", error);
      }
    }
  }

  // ==============================
  // Phase 2.3 - Cache helpers
  // ==============================
  private getCachedResult<T>(key: string, calculator: () => T): T {
    const now = Date.now();
    const cached = this.calculationCache.get(key);
    if (cached && cached.expiresAt > now) {
      this.cacheHits++;
      return cached.value as T;
    }
    this.cacheMisses++;
    const value = calculator();
    this.calculationCache.set(key, { value, expiresAt: now + this.cacheTimeout });
    return value;
  }

  public clearCache(): void {
    this.calculationCache.clear();
  }

  public setCacheTimeout(ms: number): void {
    this.cacheTimeout = Math.max(0, ms);
  }

  private static clamp01(n: number): number {
    return Math.max(0, Math.min(1, n));
  }
}
