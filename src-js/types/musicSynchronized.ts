/**
 * MusicSynchronized - Audio-Visual Synchronization Interface
 * 
 * This interface defines audio-visual synchronization capabilities for visual
 * systems. It handles music analysis, beat detection, emotional context, and
 * rhythm-based visual adaptations for the Year 3000 System architecture.
 * 
 * @architecture Phase 3 Interface Decomposition - Music Integration Focus
 * @responsibility Audio-visual sync, beat detection, emotion analysis, music context
 * @performance Real-time music analysis with <16ms response time
 */

import type { MusicMetrics } from './systems';

/**
 * Music synchronization interface for audio-responsive visual systems
 * 
 * Visual systems that implement this interface can respond to music analysis,
 * beat detection, and emotional context to create immersive audio-visual experiences.
 */
export interface MusicSynchronized {
  /**
   * Update music synchronization metrics
   * 
   * Called by the MusicSyncService for real-time audio-visual synchronization.
   * Implementations should update visual effects based on these metrics.
   * 
   * @param metrics - Current music analysis data
   */
  setMusicMetrics(metrics: MusicMetrics): void;
  
  /**
   * Set emotional state for context-aware rendering
   * 
   * Called by GradientConductor when emotion analysis is updated.
   * Backends can use this for emotion-driven visual effects.
   * 
   * @param emotion - Current emotional state from MusicEmotionAnalyzer
   */
  setEmotionalState?(emotion: EmotionalState): void;

  /**
   * Set emotional color context for advanced visual processing
   * 
   * Called by GradientConductor for detailed emotional color mapping.
   * Backends can use this for sophisticated context-aware visuals.
   * 
   * @param context - Detailed emotional color context
   */
  setEmotionalContext?(context: EmotionalColorContext): void;
  
  /**
   * Handle beat detection events
   * 
   * Called on each detected beat for immediate visual responses.
   * Should be lightweight for real-time performance.
   * 
   * @param beat - Beat detection data
   */
  onBeatDetected?(beat: BeatEvent): void;
  
  /**
   * Handle rhythm pattern changes
   * 
   * Called when the rhythm pattern or time signature changes.
   * Used for adapting visual patterns to match musical structure.
   * 
   * @param pattern - New rhythm pattern information
   */
  onRhythmPatternChange?(pattern: RhythmPattern): void;
  
  /**
   * Handle music genre/style changes
   * 
   * Called when the music genre or style is detected or changes.
   * Used for style-appropriate visual adaptations.
   * 
   * @param genre - Detected music genre and style information
   */
  onMusicGenreChange?(genre: MusicGenre): void;
}

/**
 * Emotional state from music analysis
 */
export interface EmotionalState {
  /** Primary emotion detected */
  primary: EmotionType;
  
  /** Secondary emotion (if applicable) */
  secondary?: EmotionType;
  
  /** Emotional intensity (0.0-1.0) */
  intensity: number;
  
  /** Confidence in emotion detection (0.0-1.0) */
  confidence: number;
  
  /** Valence: positive (1.0) to negative (-1.0) */
  valence: number;
  
  /** Arousal: calm (0.0) to energetic (1.0) */
  arousal: number;
  
  /** Dominance: submissive (0.0) to dominant (1.0) */
  dominance: number;
  
  /** Timestamp when emotion was detected */
  timestamp: number;
}

/**
 * Emotional color context for advanced visual processing
 */
export interface EmotionalColorContext {
  /** Primary emotion driving color choices */
  primaryEmotion: EmotionType;
  
  /** Emotional intensity affecting color saturation */
  emotionIntensity: number;
  
  /** Color temperature based on emotion (Kelvin) */
  colorTemperature: number;
  
  /** Valence affecting color warmth (-1.0 to 1.0) */
  valence: number;
  
  /** Arousal affecting color brightness (0.0 to 1.0) */
  arousal: number;
  
  /** Dominance affecting color contrast (0.0 to 1.0) */
  dominance: number;
  
  /** Smooth flow level for natural transitions (0.0 to 1.0) */
  smoothFlow: number;
  
  /** Cinematic depth for immersive effects (0.0 to 1.0) */
  cinematicDepth: number;
  
  /** Visual effects resonance for Year 3000 integration (0.0 to 1.0) */
  visualEffectsResonance: number;
  
  /** Suggested color palette based on emotional analysis */
  suggestedPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

/**
 * Supported emotion types
 */
export type EmotionType = 
  | 'joy' | 'happiness' | 'excitement' | 'energy'
  | 'calm' | 'peaceful' | 'serenity' | 'tranquil'
  | 'melancholy' | 'sadness' | 'nostalgia' | 'longing'
  | 'anger' | 'aggression' | 'intensity' | 'power'
  | 'fear' | 'tension' | 'suspense' | 'anxiety'
  | 'love' | 'romance' | 'warmth' | 'affection'
  | 'surprise' | 'wonder' | 'curiosity' | 'playfulness'
  | 'neutral' | 'ambiguous' | 'complex' | 'mixed';

/**
 * Beat detection event data
 */
export interface BeatEvent {
  /** Beat intensity (0.0-1.0) */
  intensity: number;
  
  /** Time of beat in milliseconds */
  timestamp: number;
  
  /** Beat position within measure (0-based) */
  beatPosition: number;
  
  /** Current tempo in BPM */
  tempo: number;
  
  /** Beat confidence (0.0-1.0) */
  confidence: number;
  
  /** Whether this is a strong beat (downbeat) */
  isStrongBeat: boolean;
  
  /** Beat type classification */
  beatType: 'kick' | 'snare' | 'hihat' | 'cymbal' | 'mixed' | 'unknown';
}

/**
 * Rhythm pattern information
 */
export interface RhythmPattern {
  /** Time signature (e.g., "4/4", "3/4", "6/8") */
  timeSignature: string;
  
  /** Rhythm complexity score (0.0-1.0) */
  complexity: number;
  
  /** Swing factor for jazz rhythms (0.0-1.0) */
  swing: number;
  
  /** Syncopation level (0.0-1.0) */
  syncopation: number;
  
  /** Rhythmic stability (0.0-1.0) */
  stability: number;
  
  /** Pattern change confidence (0.0-1.0) */
  confidence: number;
}

/**
 * Music genre and style information
 */
export interface MusicGenre {
  /** Primary genre */
  primary: string;
  
  /** Secondary genre (if applicable) */
  secondary?: string;
  
  /** Genre confidence (0.0-1.0) */
  confidence: number;
  
  /** Musical era or time period */
  era?: string;
  
  /** Cultural origin */
  origin?: string;
  
  /** Instrumental characteristics */
  instruments?: string[];
  
  /** Style characteristics */
  characteristics?: {
    acoustic: boolean;
    electronic: boolean;
    vocal: boolean;
    instrumental: boolean;
    live: boolean;
    studio: boolean;
  };
}

/**
 * Advanced music synchronization for systems with comprehensive audio analysis
 */
export interface AdvancedMusicSynchronized extends MusicSynchronized {
  /**
   * Handle detailed audio spectrum analysis
   * 
   * @param spectrum - Frequency spectrum analysis data
   */
  onSpectrumAnalysis?(spectrum: AudioSpectrum): void;
  
  /**
   * Handle harmonic analysis results
   * 
   * @param harmony - Musical harmony and chord progression analysis
   */
  onHarmonicAnalysis?(harmony: HarmonicAnalysis): void;
  
  /**
   * Configure music synchronization sensitivity
   * 
   * @param config - Sensitivity and response configuration
   */
  configureMusicSensitivity?(config: MusicSensitivityConfig): void;
  
  /**
   * Get music synchronization status and performance
   * 
   * @returns Current sync status and performance metrics
   */
  getMusicSyncStatus?(): MusicSyncStatus;
}

/**
 * Audio spectrum analysis data
 */
export interface AudioSpectrum {
  /** Frequency bins with amplitude values */
  frequencies: Float32Array;
  
  /** Sample rate of the audio */
  sampleRate: number;
  
  /** FFT size used for analysis */
  fftSize: number;
  
  /** Dominant frequency */
  dominantFrequency: number;
  
  /** Spectral centroid */
  spectralCentroid: number;
  
  /** Spectral rolloff */
  spectralRolloff: number;
  
  /** Zero crossing rate */
  zeroCrossingRate: number;
}

/**
 * Harmonic analysis results
 */
export interface HarmonicAnalysis {
  /** Detected key signature */
  key: string;
  
  /** Key detection confidence (0.0-1.0) */
  keyConfidence: number;
  
  /** Current chord (if detected) */
  currentChord?: string;
  
  /** Chord progression */
  chordProgression?: string[];
  
  /** Harmonic complexity (0.0-1.0) */
  complexity: number;
  
  /** Consonance level (0.0-1.0) */
  consonance: number;
}

/**
 * Music synchronization sensitivity configuration
 */
export interface MusicSensitivityConfig {
  /** Beat detection sensitivity (0.0-1.0) */
  beatSensitivity: number;
  
  /** Emotion detection sensitivity (0.0-1.0) */
  emotionSensitivity: number;
  
  /** Visual response intensity (0.0-1.0) */
  responseIntensity: number;
  
  /** Response smoothing factor (0.0-1.0) */
  smoothing: number;
  
  /** Frequency bands to emphasize */
  emphasizedBands: {
    bass: number;      // 20-250 Hz
    midrange: number;  // 250-4000 Hz
    treble: number;    // 4000-20000 Hz
  };
}

/**
 * Music synchronization status and performance
 */
export interface MusicSyncStatus {
  /** Whether music sync is currently active */
  active: boolean;
  
  /** Audio input availability */
  audioAvailable: boolean;
  
  /** Current sync quality (0.0-1.0) */
  syncQuality: number;
  
  /** Processing latency in milliseconds */
  latency: number;
  
  /** Beat detection accuracy (0.0-1.0) */
  beatAccuracy: number;
  
  /** Last successful analysis timestamp */
  lastAnalysis: number;
  
  /** Performance metrics */
  performance: {
    analysisTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}