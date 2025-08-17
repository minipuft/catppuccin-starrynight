/**
 * Theme-Specific Spicetify Type Extensions
 * 
 * Extends the base Spicetify namespace with theme-specific types without
 * modifying the core Spicetify type definitions. This ensures compatibility
 * with official Spicetify installations while providing type safety for
 * our theme-specific features.
 * 
 * @architecture Separated from core spicetify.d.ts for user compatibility
 * @compatibility Works with any Spicetify version without conflicts
 */

// =============================================================================
// THEME-SPECIFIC SPICETIFY NAMESPACE EXTENSIONS
// =============================================================================

declare global {
  // Extend the Window interface for safe Spicetify access
  interface Window {
    Spicetify?: typeof Spicetify;
  }
}

// Augment the existing Spicetify namespace with theme-specific types
declare global {
  namespace Spicetify {
  
  // =============================================================================
  // THEME-SPECIFIC ENUMS AND TYPES
  // =============================================================================
  
  /**
   * Theme-specific variant types for UI components
   * Used by our VariantText, NotificationManager, and other UI components
   */
  type Variant = 
    | "text"
    | "subtext" 
    | "main"
    | "accent"
    | "brightAccent"
    | "positive"
    | "negative"
    | "warning"
    | "information"
    | "glass"
    | "overlay"
    | "card"
    | string; // Allow custom variants

  /**
   * Theme-specific semantic color types
   * Used for consistent color application across components
   */
  type SemanticColor = 
    | "base"
    | "surface" 
    | "overlay"
    | "muted"
    | "subtle"
    | "text"
    | "subtext"
    | "accent"
    | "positive"
    | "negative"
    | "warning"
    | "information"
    | string; // Allow custom semantic colors

  // =============================================================================
  // COSMOS API TYPE EXTENSIONS
  // =============================================================================
  
  /**
   * CosmosAsync interface for async requests
   * Provides type safety for Spicetify.CosmosAsync operations
   */
  interface CosmosAsync {
    get(url: string, options?: any): Promise<any>;
    post(url: string, body?: any, options?: any): Promise<any>;
    put(url: string, body?: any, options?: any): Promise<any>;
    patch(url: string, body?: any, options?: any): Promise<any>;
    del(url: string, options?: any): Promise<any>;
    head(url: string, options?: any): Promise<any>;
    sub(url: string, callback: (data: any) => void): () => void;
    request(options: {
      url: string;
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    }): Promise<any>;
  }

  // =============================================================================
  // ENHANCED PLAYER DATA INTERFACE
  // =============================================================================
  
  /**
   * Enhanced Player data interface that extends base Spicetify Player
   * Provides additional type safety for commonly accessed properties
   */
  interface EnhancedPlayerData {
    /** Current track item with extended properties */
    item?: {
      uri: string;
      name?: string;
      duration?: number;
      artists?: Array<{
        name: string;
        uri: string;
      }>;
      album?: {
        name: string;
        uri: string;
      };
      // Allow additional properties from various Spicetify versions
      [key: string]: any;
    };
    /** Playback context */
    context?: {
      uri: string;
      name?: string;
      [key: string]: any;
    };
    /** Playback state */
    is_playing?: boolean;
    is_paused?: boolean;
    position?: number;
    duration?: number;
    repeat?: number;
    shuffle?: boolean;
    volume?: number;
    // Extensible for different Spicetify versions
    [key: string]: any;
  }
  
  } // End Spicetify namespace
}

// Augment the global Spicetify object with theme-specific properties
declare global {
  const Spicetify: {
    // Standard Spicetify properties (maintain compatibility)
    Player?: {
      data?: Spicetify.EnhancedPlayerData;
      addEventListener?(event: string, callback: Function): void;
      removeEventListener?(event: string, callback: Function): void;
      next?(): void;
      back?(): void;
      play?(): void;
      pause?(): void;
      togglePlay?(): void;
      seek?(position: number): void;
      [key: string]: any;
    };
    
    Platform?: {
      getAudioData?(uri: string): Promise<any>;
      getAudioFeatures?(uris: string[]): Promise<any[]>;
      History?: {
        push?(path: string): void;
        goBack?(): void;
        goForward?(): void;
        [key: string]: any;
      };
      [key: string]: any;
    };
    
    URI?: {
      isTrack?(uri: string): boolean;
      isAlbum?(uri: string): boolean;
      isPlaylist?(uri: string): boolean;
      isArtist?(uri: string): boolean;
      from?(uri: string): any;
      [key: string]: any;
    };
    
    ReactComponent?: {
      [componentName: string]: any;
    };
    
    LocalStorage?: {
      get?(key: string): string | null;
      set?(key: string, value: string): void;
      remove?(key: string): void;
      clear?(): void;
      [key: string]: any;
    };
    
    // Theme-specific additions
    CosmosAsync?: Spicetify.CosmosAsync;
    
    // Functions
    colorExtractor?: (imageUrl: string) => Promise<{
      colors: Array<{
        hex: string;
        rgb: [number, number, number];
        population: number;
      }>;
      [key: string]: any;
    }>;
    
    getAudioData?: (uri?: string) => Promise<any>;
    
    // Allow additional properties for different Spicetify versions
    [key: string]: any;
  } | undefined; // Make Spicetify optional for safe access
}

// =============================================================================
// TYPE GUARDS FOR SAFE SPICETIFY ACCESS
// =============================================================================

/**
 * Type guard to check if Spicetify is available
 */
export function isSpicetifyAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.Spicetify;
}

/**
 * Type guard to check if Spicetify Player is available
 */
export function isSpicetifyPlayerAvailable(): boolean {
  return isSpicetifyAvailable() && !!window.Spicetify?.Player;
}

/**
 * Type guard to check if Spicetify Platform is available
 */
export function isSpicetifyPlatformAvailable(): boolean {
  return isSpicetifyAvailable() && !!window.Spicetify?.Platform;
}

/**
 * Type guard to check if CosmosAsync is available
 */
export function isCosmosAsyncAvailable(): boolean {
  return isSpicetifyAvailable() && !!window.Spicetify?.CosmosAsync;
}

/**
 * Safe getter for Spicetify with fallback
 */
export function safeGetSpicetify(): typeof Spicetify | null {
  return isSpicetifyAvailable() ? window.Spicetify! : null;
}

// Export for module usage
export {};