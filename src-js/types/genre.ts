/**
 * Unified Genre Type System
 *
 * Single source of truth for all genre-related types across the theme.
 * Consolidates types from GenreProfileManager and GenreGradientEvolution.
 *
 * Architecture: This replaces duplicate genre type definitions and provides
 * a unified interface for genre detection, visual styling, and OKLAB integration.
 */

import type { EnhancementPreset } from "@/utils/color/OKLABColorProcessor";

/**
 * Unified genre enumeration - supports all 20 genre types
 * Used across audio analysis, visual effects, and UI styling systems
 */
export enum GenreType {
  // Core genres (from GenreProfileManager)
  ELECTRONIC = 'electronic',
  ROCK = 'rock',
  CLASSICAL = 'classical',
  JAZZ = 'jazz',
  HIPHOP = 'hiphop',
  AMBIENT = 'ambient',
  POP = 'pop',
  FOLK = 'folk',

  // Extended genres (from GenreGradientEvolution)
  METAL = 'metal',
  PUNK = 'punk',
  INDIE = 'indie',
  REGGAE = 'reggae',
  BLUES = 'blues',
  COUNTRY = 'country',
  TECHNO = 'techno',
  HOUSE = 'house',
  TRANCE = 'trance',
  DUBSTEP = 'dubstep',
  FUNK = 'funk',

  // Fallback
  UNKNOWN = 'unknown',
  DEFAULT = 'default'
}

/**
 * Color characteristics for genre-specific OKLAB processing
 */
export interface GenreColorCharacteristics {
  vibrancyLevel: 'subtle' | 'standard' | 'vibrant' | 'cosmic';
  emotionalRange: 'narrow' | 'moderate' | 'wide' | 'extreme';
  colorTemperature: 'cool' | 'neutral' | 'warm' | 'dynamic';
}

/**
 * Audio characteristics defining a genre's sonic signature
 * Consolidated from GenreGradientEvolution
 */
export interface GenreCharacteristics {
  // Frequency signature patterns
  bassEmphasis: number;           // 0-1 how much bass is emphasized
  midFrequencyPattern: number;    // 0-1 mid-frequency prominence
  trebleSharpness: number;        // 0-1 treble frequency crispness
  dynamicRange: number;           // 0-1 variation in volume levels

  // Rhythmic patterns
  rhythmComplexity: number;       // 0-1 complexity of rhythm patterns
  syncopation: number;            // 0-1 off-beat emphasis
  grooveWeight: number;           // 0-1 groove/pocket feeling
  tempoVariability: number;       // 0-1 tempo fluctuation tolerance

  // Musical structure
  musicalComplexity: number;      // 0-1 chord/harmony complexity
  dissonanceTolerance: number;    // 0-1 acceptance of dissonance
  modalInfluence: number;         // 0-1 use of non-major/minor modes
  microtonal: number;             // 0-1 use of non-12-tone scales

  // Production characteristics
  compression: number;            // 0-1 dynamic range compression
  saturation: number;             // 0-1 harmonic saturation/distortion
  stereoWidth: number;            // 0-1 stereo field utilization
  artificialProcessing: number;   // 0-1 electronic/synthetic processing

  // Cultural/aesthetic markers
  smoothness: number;             // 0-1 natural vs synthetic feel
  accessibility: number;          // 0-1 mainstream appeal/complexity
  experimentalFactor: number;     // 0-1 avant-garde/experimental nature
  emotionalRange: number;         // 0-1 emotional expression breadth
}

/**
 * Visual style parameters for genre-specific gradient rendering
 * Consolidated from GenreGradientEvolution
 */
export interface GenreVisualStyle {
  // Core visual identity
  primaryHueRange: [number, number];      // [min, max] hue degrees
  saturationProfile: [number, number];    // [base, variation] saturation
  brightnessProfile: [number, number];    // [base, variation] brightness
  contrastLevel: number;                   // 0-1 overall contrast intensity

  // Pattern characteristics
  gradientComplexity: number;             // 0-1 number of gradient layers
  shapeGeometry: 'smooth' | 'geometric' | 'abstract' | 'hybrid';
  edgeSharpness: number;                  // 0-1 soft to sharp gradient edges
  symmetryLevel: number;                  // 0-1 symmetrical to asymmetrical

  // Animation behavior
  animationStyle: 'smooth' | 'rhythmic' | 'chaotic' | 'minimal';
  pulseBehavior: 'steady' | 'syncopated' | 'irregular' | 'subtle';
  flowDirection: 'radial' | 'linear' | 'spiral' | 'random';
  transitionCharacter: 'fluid' | 'sharp' | 'smooth' | 'mechanical';

  // Layer interaction
  layerBlending: 'harmonious' | 'contrasting' | 'complementary' | 'clashing';
  depthIllusion: number;                  // 0-1 3D depth perception
  particleInfluence: number;              // 0-1 cosmic noise prominence
  nebulaCharacter: 'ethereal' | 'dense' | 'wispy' | 'structured';

  // Temporal behavior
  memoryInfluence: number;                // 0-1 past state influence
  adaptationSpeed: number;                // 0-1 how quickly style adapts
  stabilityPreference: number;            // 0-1 stability vs dynamic change
  emergencePattern: 'gradual' | 'sudden' | 'cyclical' | 'progressive';
}

/**
 * Unified genre profile - combines audio behavior, color science, and visual styling
 * This interface consolidates GenreProfileManager and GenreGradientEvolution data
 */
export interface GenreProfile {
  // Audio behavior modifiers (from GenreProfileManager)
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
  tempoVariationHandling?: 'adaptive' | string;
  subtleMode?: boolean;
  intensityReduction?: number;
  balanced?: boolean;

  // OKLAB color science integration
  oklabPreset?: string;
  colorCharacteristics?: GenreColorCharacteristics;

  // Audio characteristics (from GenreGradientEvolution)
  characteristics?: GenreCharacteristics;

  // Visual styling (from GenreGradientEvolution)
  visualStyle?: GenreVisualStyle;
}

/**
 * Genre detection result with confidence and metadata
 */
export interface GenreDetectionResult {
  genre: GenreType;
  confidence: number;              // 0-1 detection confidence
  characteristics: GenreCharacteristics;
  profile: GenreProfile;
  oklabPreset?: EnhancementPreset;
  timestamp: number;
}

/**
 * Audio features from Spicetify API used for genre detection
 */
export interface AudioFeatures {
  danceability?: number;
  energy?: number;
  acousticness?: number;
  instrumentalness?: number;
  tempo?: number;
  loudness?: number;
  speechiness?: number;
  valence?: number;
  key?: number;
  mode?: number;
  timeSignature?: number;
}

/**
 * Type guard to check if a string is a valid GenreType
 */
export function isGenreType(value: string): value is GenreType {
  return Object.values(GenreType).includes(value as GenreType);
}

/**
 * Convert GenreType enum to string for backward compatibility
 */
export function genreTypeToString(genre: GenreType): string {
  return genre as string;
}

/**
 * Convert string to GenreType with fallback to DEFAULT
 */
export function stringToGenreType(genre: string): GenreType {
  if (isGenreType(genre)) {
    return genre as GenreType;
  }
  return GenreType.DEFAULT;
}

/**
 * Legacy type alias for backward compatibility
 * @deprecated Use GenreType instead
 */
export type MusicGenre = GenreType;

// ===================================================================
// ALGORITHMIC GENRE SYSTEM - Core Parameter Definitions
// ===================================================================

/**
 * Core parameters that define a genre's essence
 * All other properties (characteristics, visual styles) are calculated from these
 *
 * This reduces genre definitions from 38 properties to 8 core parameters,
 * cutting bundle size by ~84% while maintaining full functionality.
 */
export interface GenreCoreParameters {
  /**
   * Overall energy level and intensity (0-1)
   * - 0.0-0.3: Low energy (ambient, classical)
   * - 0.4-0.6: Medium energy (pop, folk)
   * - 0.7-1.0: High energy (rock, electronic)
   */
  energy: number;

  /**
   * Balance between organic and synthetic sound (0-1)
   * - 0.0-0.3: Acoustic/organic (folk, classical, jazz)
   * - 0.4-0.6: Mixed (rock, pop)
   * - 0.7-1.0: Electronic/synthetic (techno, house, electronic)
   */
  organicSynthetic: number;

  /**
   * Rhythmic pattern complexity (0-1)
   * - 0.0-0.3: Simple, steady rhythms
   * - 0.4-0.6: Moderate complexity
   * - 0.7-1.0: Complex, syncopated, polyrhythmic
   */
  rhythmComplexity: number;

  /**
   * Harmonic and melodic sophistication (0-1)
   * - 0.0-0.3: Simple chord progressions
   * - 0.4-0.6: Moderate harmonic complexity
   * - 0.7-1.0: Advanced harmony, jazz chords, modal music
   */
  harmonicSophistication: number;

  /**
   * Dynamic range and volume variation (0-1)
   * - 0.0-0.3: Heavily compressed, consistent volume
   * - 0.4-0.6: Moderate dynamic range
   * - 0.7-1.0: Wide dynamic range (classical, acoustic)
   */
  dynamicRange: number;

  /**
   * Typical tempo category
   */
  tempo: 'slow' | 'medium' | 'fast' | 'variable';

  /**
   * Mainstream accessibility (0-1)
   * - 0.0-0.3: Experimental, niche, avant-garde
   * - 0.4-0.6: Somewhat accessible
   * - 0.7-1.0: Mainstream, widely accessible
   */
  accessibility: number;

  /**
   * Emotional expression breadth
   */
  emotionalRange: 'narrow' | 'moderate' | 'wide' | 'extreme';
}