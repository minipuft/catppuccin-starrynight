/**
 * Spicetify API Type Definitions
 * 
 * Minimal type definitions for Spicetify APIs used by the theme.
 * These types are based on the actual Spicetify API structure and
 * provide type safety without coupling our code to Spicetify internals.
 * 
 * @see https://spicetify.app/docs/development/api-wrapper
 * @architecture Separated from theme code for maintainability
 */

import type { SpicetifyAudioFeatures, SpicetifyAudioAnalysis, SpicetifyAudioData } from './systems';

// =============================================================================
// SPICETIFY CORE TYPES
// =============================================================================

declare namespace Spicetify {
  // Track metadata structure
  interface TrackMetadata {
    album_title?: string;
    artist_name?: string;
    duration_ms?: string;
    image_url?: string;
    image_xlarge_url?: string;
    [key: string]: unknown;
  }

  // Track object structure
  interface Track {
    uri: string;
    uid?: string;
    name?: string;
    artists?: Array<{ name: string; uri: string }>;
    album?: { name: string; uri: string };
    metadata?: TrackMetadata;
    image?: string;
    [key: string]: unknown;
  }

  // Player state and controls
  interface PlayerData {
    track: Track;
    context_uri?: string;
    duration?: number;
    position?: number;
    is_playing?: boolean;
    is_paused?: boolean;
    volume?: number;
    repeat?: number;
    shuffle?: boolean;
    [key: string]: unknown;
  }

  interface Player {
    data: PlayerData;
    next(): void;
    back(): void;
    play(): void;
    pause(): void;
    togglePlay(): void;
    toggleShuffle(): void;
    toggleRepeat(): void;
    seek(position: number): void;
    setVolume(volume: number): void;
    addEventListener(event: string, callback: Function): void;
    removeEventListener(event: string, callback: Function): void;
    [key: string]: unknown;
  }

  // Platform APIs
  interface Platform {
    getAudioData(uri: string): Promise<SpicetifyAudioAnalysis>;
    getAudioFeatures(uris: string[]): Promise<SpicetifyAudioFeatures[]>;
    History: {
      push(path: string): void;
      goBack(): void;
      goForward(): void;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }

  // URI utilities
  interface URI {
    isTrack(uri: string): boolean;
    isAlbum(uri: string): boolean;
    isPlaylist(uri: string): boolean;
    isArtist(uri: string): boolean;
    from(uri: string): any;
    [key: string]: unknown;
  }

  // React components (if used)
  interface ReactComponents {
    [componentName: string]: any;
  }

  // Settings/Local storage
  interface LocalStorage {
    get(key: string): string | null;
    set(key: string, value: string): void;
    remove(key: string): void;
    clear(): void;
    [key: string]: unknown;
  }

  // Color extractor function
  function colorExtractor(imageUrl: string): Promise<{
    colors: Array<{
      hex: string;
      rgb: [number, number, number];
      population: number;
    }>;
    [key: string]: unknown;
  }>;

  // Audio data function  
  function getAudioData(uri: string): Promise<SpicetifyAudioFeatures>;
}

// =============================================================================
// GLOBAL SPICETIFY OBJECT
// =============================================================================

declare global {
  const Spicetify: {
    Player: Spicetify.Player;
    Platform: Spicetify.Platform;
    URI: Spicetify.URI;
    ReactComponent: Spicetify.ReactComponents;
    LocalStorage: Spicetify.LocalStorage;
    colorExtractor: typeof Spicetify.colorExtractor;
    getAudioData: typeof Spicetify.getAudioData;
    [key: string]: unknown;
  };
}

// =============================================================================
// EXPORT FOR MODULE USAGE
// =============================================================================

export {}; // Make this a module