import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { GenreProfileManager } from "@/audio/GenreProfileManager";
import {
  GenreType,
  type AudioFeatures,
  type GenreCharacteristics,
  type GenreDetectionResult,
  type GenreProfile,
  type GenreVisualStyle,
} from "@/types/genre";
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
    const profile = { ...this.manager.getProfileForTrack(features) };
    const characteristics = this.manager.getCharacteristics(genre);
    const visualStyle = this.manager.getVisualStyle(genre);
    const oklabPreset = this.manager.getOKLABPresetForGenre(genre);

    if (!profile.oklabPreset && oklabPreset) {
      profile.oklabPreset = oklabPreset.name;
    }

    profile.characteristics = characteristics;
    profile.visualStyle = visualStyle;

    const detection: GenreDetectionResult = {
      genre,
      confidence: this.manager.getGenreConfidence(),
      characteristics,
      profile,
      oklabPreset,
      timestamp: Date.now(),
    };

    this.lastDetection = detection;
    this.notifySubscribers(detection);
    return detection;
  }

  public getProfileForTrack(features?: AudioFeatures): GenreProfile {
    return this.manager.getProfileForTrack(features);
  }

  public getColorCharacteristicsForGenre(
    genre: GenreType
  ): NonNullable<GenreProfile["colorCharacteristics"]> {
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
}
