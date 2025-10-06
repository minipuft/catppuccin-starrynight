/**
 * GenreUIBridge - Connects Genre Detection to UI Styling
 *
 * Bridges the gap between GenreProfileManager's genre detection and
 * the SCSS genre-aware UI system by applying data-genre-active attributes.
 *
 * Functionality:
 * - Listens for genre changes from MusicSyncService
 * - Applies data-genre-active attributes to DOM elements
 * - Updates CSS variables for genre-specific visual styles
 * - Throttles updates to prevent excessive DOM manipulation
 */

import { GenreProfileManager } from "@/audio/GenreProfileManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { unifiedEventBus } from "@/core/events/EventBus";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";
import type { AdvancedSystemConfig } from "@/types/models";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";

export class GenreUIBridge implements IManagedSystem {
  public initialized = false;

  private config: AdvancedSystemConfig;
  private genreProfileManager: GenreProfileManager;
  private musicSyncService: MusicSyncService | null = null;

  private currentGenre: string | null = null;
  private lastUpdateTime: number = 0;
  private readonly throttleMs = 300; // Throttle DOM updates to 300ms

  // DOM selectors that should receive genre attributes
  private readonly genreAwareSelectors = [
    '.Root__main-view',
    '.Root__now-playing-bar',
    '.Root__nav-bar',
    '.main-playButton-PlayButton',
    '.player-controls',
    '.main-card',
    '.card',
    '.artist-card',
    '.playlist-card'
  ];

  constructor(
    genreProfileManager: GenreProfileManager,
    musicSyncService?: MusicSyncService,
    config?: AdvancedSystemConfig
  ) {
    this.genreProfileManager = genreProfileManager;
    this.musicSyncService = musicSyncService || null;
    this.config = config || ADVANCED_SYSTEM_CONFIG;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Subscribe to track changes
      unifiedEventBus.subscribe('music:track-changed', this.handleTrackChange.bind(this), 'GenreUIBridge');

      this.initialized = true;

      if (this.config.enableDebug) {
        console.log('🎨 [GenreUIBridge] Initialized - bridging genre detection to UI');
      }
    } catch (error) {
      console.error('[GenreUIBridge] Initialization failed:', error);
      throw error;
    }
  }

  public updateAnimation(_deltaTime: number): void {
    // No per-frame updates needed - we're event-driven
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      healthy: this.initialized && this.genreProfileManager !== null,
      metrics: {
        lastCheck: Date.now(),
        initialized: this.initialized,
        hasGenreManager: this.genreProfileManager !== null,
        currentGenre: this.currentGenre || 'none'
      }
    };
  }

  public destroy(): void {
    // Remove all genre attributes
    this.removeGenreAttributes();

    // Unsubscribe from events
    unifiedEventBus.unsubscribeAll('GenreUIBridge');

    this.initialized = false;

    if (this.config.enableDebug) {
      console.log('🎨 [GenreUIBridge] Destroyed');
    }
  }

  private handleTrackChange(data: { trackUri: string; albumArt?: string; artist: string; title: string; timestamp: number; audioFeatures?: any }): void {
    // Detect genre from track audio features if available
    const audioFeatures = data.audioFeatures;

    if (audioFeatures) {
      const detectedGenre = this.genreProfileManager.detectGenre(audioFeatures);
      this.updateGenreUI(detectedGenre);
    }
  }


  private updateGenreUI(genre: string): void {
    // Throttle updates
    const now = Date.now();
    if (now - this.lastUpdateTime < this.throttleMs) {
      return;
    }

    this.lastUpdateTime = now;

    // Skip if genre hasn't changed
    if (genre === this.currentGenre) {
      return;
    }

    this.currentGenre = genre;

    // Apply genre attributes to DOM
    this.applyGenreAttributes(genre);

    // Update CSS variables for visual style
    this.updateGenreVisualVariables(genre);

    if (this.config.enableDebug) {
      const confidence = this.genreProfileManager.getGenreConfidence();
      console.log(`🎨 [GenreUIBridge] Applied genre '${genre}' to UI (confidence: ${(confidence * 100).toFixed(0)}%)`);
    }
  }

  private applyGenreAttributes(genre: string): void {
    this.genreAwareSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.setAttribute('data-genre-active', genre);
      });
    });

    // Add genre-switching class for smooth transitions
    document.body.classList.add('genre-switching');
    setTimeout(() => {
      document.body.classList.remove('genre-switching');
    }, 600);
  }

  private removeGenreAttributes(): void {
    this.genreAwareSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.removeAttribute('data-genre-active');
      });
    });
  }

  private updateGenreVisualVariables(genre: string): void {
    // Get visual style from GenreProfileManager
    const visualStyle = this.genreProfileManager.getVisualStyle(genre);
    const characteristics = this.genreProfileManager.getCharacteristics(genre);

    // Apply CSS variables for genre-specific styling
    const root = document.documentElement;

    // Primary hue range
    root.style.setProperty('--genre-primary-hue-min', `${visualStyle.primaryHueRange[0]}`);
    root.style.setProperty('--genre-primary-hue-max', `${visualStyle.primaryHueRange[1]}`);

    // Saturation and brightness
    root.style.setProperty('--genre-saturation-base', `${visualStyle.saturationProfile[0]}`);
    root.style.setProperty('--genre-saturation-variation', `${visualStyle.saturationProfile[1]}`);
    root.style.setProperty('--genre-brightness-base', `${visualStyle.brightnessProfile[0]}`);
    root.style.setProperty('--genre-brightness-variation', `${visualStyle.brightnessProfile[1]}`);

    // Contrast and complexity
    root.style.setProperty('--genre-contrast-level', `${visualStyle.contrastLevel}`);
    root.style.setProperty('--genre-gradient-complexity', `${visualStyle.gradientComplexity}`);

    // Animation characteristics
    root.style.setProperty('--genre-animation-style', visualStyle.animationStyle);
    root.style.setProperty('--genre-pulse-behavior', visualStyle.pulseBehavior);

    // Audio characteristics (for reference)
    root.style.setProperty('--genre-bass-emphasis', `${characteristics.bassEmphasis}`);
    root.style.setProperty('--genre-energy-level', `${characteristics.dynamicRange}`);
  }

  /**
   * Manually trigger genre UI update (for testing or manual control)
   */
  public forceGenreUpdate(genre: string): void {
    this.updateGenreUI(genre);
  }

  /**
   * Get current genre applied to UI
   */
  public getCurrentGenre(): string | null {
    return this.currentGenre;
  }
}