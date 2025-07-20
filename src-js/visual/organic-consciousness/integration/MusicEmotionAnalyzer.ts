// ████████████████████████████████████████████████████████████████████████████████
// MUSIC EMOTION ANALYZER - Phase 3: Dynamic Color Pipeline
// ████████████████████████████████████████████████████████████████████████████████
//
// Analyzes Spotify audio features to extract emotional content for organic consciousness
// color temperature mapping and dynamic palette generation.
//
// Integration: MusicSyncService → MusicEmotionAnalyzer → DynamicColorPipeline
// Philosophy: Transform musical data into consciousness-aware emotional states
//
// ████████████████████████████████████████████████████████████████████████████████

import type { IManagedSystem } from '../../../core/interfaces/IManagedSystem';
import type { HealthCheckResult } from '../../../types/HealthCheck';

// AudioFeatures and AudioData interfaces (from MusicSyncService)
export interface AudioFeatures {
  tempo: number;
  key: number;
  mode: number;
  timeSignature: number;
  energy: number;
  danceability: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  loudness: number;
}

export interface AudioData {
  waveform?: Float32Array;
  frequencies?: Float32Array;
  bpm?: number;
  timestamp: number;
}

// ===== EMOTIONAL STATE DEFINITIONS =====

export interface EmotionalState {
  // Primary emotion classification
  primary: EmotionType;
  secondary: EmotionType[];
  
  // Emotion intensity and confidence
  intensity: number; // 0-1 overall emotional intensity
  confidence: number; // 0-1 confidence in emotion detection
  
  // Emotional characteristics
  valence: number; // 0-1 positive to negative emotion
  arousal: number; // 0-1 calm to energetic
  dominance: number; // 0-1 submissive to dominant
  
  // Color temperature mapping
  colorTemperature: number; // 1000K-20000K for emotional color mapping
  
  // Temporal context
  timestamp: number;
  duration: number; // Duration this emotion should persist (ms)
  
  // Musical context
  musicalCharacteristics: MusicalCharacteristics;
}

export type EmotionType = 
  | 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust' 
  | 'love' | 'serenity' | 'melancholy' | 'excitement' | 'nostalgia' 
  | 'transcendence' | 'consciousness' | 'organic-flow';

export interface MusicalCharacteristics {
  // Core musical features
  tempo: number; // BPM
  key: number; // Musical key (0-11)
  mode: number; // Major (1) or Minor (0)
  timeSignature: number; // Beat count per measure
  
  // Audio analysis features
  energy: number; // 0-1 energy level
  danceability: number; // 0-1 danceability
  acousticness: number; // 0-1 acoustic vs electronic
  instrumentalness: number; // 0-1 instrumental content
  liveness: number; // 0-1 live performance likelihood
  speechiness: number; // 0-1 spoken word content
  
  // Consciousness-specific metrics
  organicFlow: number; // 0-1 organic vs mechanical feeling
  cinematicDepth: number; // 0-1 cinematic atmosphere potential
  consciousnessResonance: number; // 0-1 consciousness awakening potential
}

export interface EmotionAnalysisConfig {
  // Analysis sensitivity
  emotionSensitivity: number; // 0-1 how sensitive to emotional changes
  confidenceThreshold: number; // 0-1 minimum confidence to accept emotion
  
  // Temporal smoothing
  smoothingFactor: number; // 0-1 how much to smooth emotion changes
  memoryDecay: number; // 0-1 how quickly to forget previous emotions
  
  // Consciousness integration
  consciousnessAwareness: boolean; // Enable consciousness-specific analysis
  organicFlowDetection: boolean; // Enable organic flow analysis
  cinematicAnalysis: boolean; // Enable cinematic depth analysis
  
  // Performance settings
  analysisInterval: number; // ms between analysis cycles
  cacheSize: number; // Number of emotion states to cache
}

// ===== EMOTION ANALYSIS ENGINE =====

export class MusicEmotionAnalyzer implements IManagedSystem {
  public initialized = false;
  
  private config: EmotionAnalysisConfig;
  private emotionHistory: EmotionalState[] = [];
  private currentEmotion: EmotionalState | null = null;
  private emotionCache = new Map<string, EmotionalState>();
  
  // Analysis components
  private valenceEnergyMapper: ValenceEnergyMapper;
  private audioFeatureAnalyzer: AudioFeatureAnalyzer;
  private temperatureCalculator: TemperatureCalculator;
  private consciousnessDetector: ConsciousnessDetector;
  
  // Subscribers for emotion updates
  private emotionSubscribers = new Set<(emotion: EmotionalState) => void>();
  
  constructor(config: Partial<EmotionAnalysisConfig> = {}) {
    this.config = {
      emotionSensitivity: 0.7,
      confidenceThreshold: 0.6,
      smoothingFactor: 0.3,
      memoryDecay: 0.1,
      consciousnessAwareness: true,
      organicFlowDetection: true,
      cinematicAnalysis: true,
      analysisInterval: 500, // 2Hz analysis rate
      cacheSize: 100,
      ...config
    };
    
    this.valenceEnergyMapper = new ValenceEnergyMapper();
    this.audioFeatureAnalyzer = new AudioFeatureAnalyzer();
    this.temperatureCalculator = new TemperatureCalculator();
    this.consciousnessDetector = new ConsciousnessDetector();
  }
  
  // ===== SYSTEM LIFECYCLE =====
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialize analysis components
      await this.valenceEnergyMapper.initialize();
      await this.audioFeatureAnalyzer.initialize();
      await this.temperatureCalculator.initialize();
      
      if (this.config.consciousnessAwareness) {
        await this.consciousnessDetector.initialize();
      }
      
      this.initialized = true;
      console.log('🎵 MusicEmotionAnalyzer initialized with consciousness awareness');
      
    } catch (error) {
      console.error('❌ Failed to initialize MusicEmotionAnalyzer:', error);
      throw error;
    }
  }
  
  updateAnimation(_deltaTime: number): void {
    // Passive system - no frame-based updates needed
    // Analysis triggered by music data updates
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    if (!this.initialized) {
      issues.push('MusicEmotionAnalyzer not initialized');
    }
    
    if (this.emotionHistory.length === 0) {
      issues.push('No emotion analysis history available');
    }
    
    if (this.currentEmotion && this.currentEmotion.confidence < this.config.confidenceThreshold) {
      issues.push(`Low emotion confidence: ${this.currentEmotion.confidence.toFixed(2)}`);
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      metrics: {
        emotionHistorySize: this.emotionHistory.length,
        currentConfidence: this.currentEmotion?.confidence ?? 0,
        subscriberCount: this.emotionSubscribers.size,
        cacheSize: this.emotionCache.size
      }
    };
  }
  
  destroy(): void {
    this.emotionSubscribers.clear();
    this.emotionHistory = [];
    this.emotionCache.clear();
    this.currentEmotion = null;
    this.initialized = false;
  }
  
  // ===== PUBLIC API =====
  
  /**
   * Analyze audio features and extract emotional state
   */
  async analyzeEmotion(audioFeatures: AudioFeatures, audioData?: AudioData): Promise<EmotionalState> {
    if (!this.initialized) {
      throw new Error('MusicEmotionAnalyzer must be initialized before analysis');
    }
    
    try {
      // Create cache key for this analysis
      const cacheKey = this.createCacheKey(audioFeatures);
      
      // Check cache first
      if (this.emotionCache.has(cacheKey)) {
        const cachedEmotion = this.emotionCache.get(cacheKey);
        if (cachedEmotion) {
          this.updateCurrentEmotion(cachedEmotion);
          return cachedEmotion;
        }
      }
      
      // Perform fresh analysis
      const emotion = await this.performEmotionAnalysis(audioFeatures, audioData);
      
      // Cache the result
      this.cacheEmotion(cacheKey, emotion);
      
      // Update system state
      this.updateCurrentEmotion(emotion);
      
      // Notify subscribers
      this.notifyEmotionUpdate(emotion);
      
      return emotion;
      
    } catch (error) {
      console.error('❌ Error analyzing emotion:', error);
      
      // Return neutral fallback emotion
      return this.createNeutralEmotion(audioFeatures);
    }
  }
  
  /**
   * Get current emotional state
   */
  getCurrentEmotion(): EmotionalState | null {
    return this.currentEmotion;
  }
  
  /**
   * Get emotion analysis history
   */
  getEmotionHistory(limit?: number): EmotionalState[] {
    if (limit) {
      return this.emotionHistory.slice(-limit);
    }
    return [...this.emotionHistory];
  }
  
  /**
   * Subscribe to emotion updates
   */
  onEmotionUpdate(callback: (emotion: EmotionalState) => void): () => void {
    this.emotionSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.emotionSubscribers.delete(callback);
    };
  }
  
  /**
   * Update analysis configuration
   */
  updateConfig(newConfig: Partial<EmotionAnalysisConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  // ===== PRIVATE ANALYSIS METHODS =====
  
  private async performEmotionAnalysis(
    audioFeatures: AudioFeatures, 
    audioData?: AudioData
  ): Promise<EmotionalState> {
    // Extract musical characteristics
    const musicalCharacteristics = this.audioFeatureAnalyzer.extractCharacteristics(audioFeatures);
    
    // Map valence and energy to emotional space
    const baseEmotion = this.valenceEnergyMapper.mapToEmotion(
      audioFeatures.valence,
      audioFeatures.energy,
      musicalCharacteristics
    );
    
    // Calculate color temperature from emotion
    const colorTemperature = this.temperatureCalculator.calculateTemperature(
      baseEmotion,
      musicalCharacteristics
    );
    
    // Detect consciousness-specific characteristics
    let consciousnessMetrics: any = {};
    if (this.config.consciousnessAwareness) {
      consciousnessMetrics = await this.consciousnessDetector.analyze(
        audioFeatures,
        musicalCharacteristics,
        audioData
      );
    }
    
    // Apply temporal smoothing with previous emotions
    const smoothedEmotion = this.applyTemporalSmoothing(baseEmotion, musicalCharacteristics);
    
    // Create final emotional state
    const emotionalState: EmotionalState = {
      primary: smoothedEmotion.primary,
      secondary: smoothedEmotion.secondary,
      intensity: smoothedEmotion.intensity,
      confidence: smoothedEmotion.confidence,
      valence: audioFeatures.valence,
      arousal: audioFeatures.energy,
      dominance: this.calculateDominance(audioFeatures, musicalCharacteristics),
      colorTemperature,
      timestamp: Date.now(),
      duration: this.calculateEmotionDuration(smoothedEmotion, musicalCharacteristics),
      musicalCharacteristics: {
        ...musicalCharacteristics,
        organicFlow: consciousnessMetrics.organicFlow ?? musicalCharacteristics.organicFlow,
        cinematicDepth: consciousnessMetrics.cinematicDepth ?? musicalCharacteristics.cinematicDepth,
        consciousnessResonance: consciousnessMetrics.consciousnessResonance ?? 0.5
      }
    };
    
    return emotionalState;
  }
  
  private applyTemporalSmoothing(
    baseEmotion: { primary: EmotionType; secondary: EmotionType[]; intensity: number; confidence: number },
    musicalCharacteristics: MusicalCharacteristics
  ): { primary: EmotionType; secondary: EmotionType[]; intensity: number; confidence: number } {
    if (!this.currentEmotion || this.config.smoothingFactor === 0) {
      return baseEmotion;
    }
    
    const smoothingFactor = this.config.smoothingFactor;
    
    // Smooth intensity
    const smoothedIntensity = 
      (baseEmotion.intensity * (1 - smoothingFactor)) + 
      (this.currentEmotion.intensity * smoothingFactor);
    
    // Smooth confidence
    const smoothedConfidence = 
      (baseEmotion.confidence * (1 - smoothingFactor)) + 
      (this.currentEmotion.confidence * smoothingFactor);
    
    // Primary emotion changes only if confidence is high enough
    const primary = baseEmotion.confidence > this.config.confidenceThreshold ? 
      baseEmotion.primary : this.currentEmotion.primary;
    
    return {
      primary,
      secondary: baseEmotion.secondary,
      intensity: smoothedIntensity,
      confidence: smoothedConfidence
    };
  }
  
  private calculateDominance(audioFeatures: AudioFeatures, characteristics: MusicalCharacteristics): number {
    // Combine loudness, energy, and tempo for dominance calculation
    const tempoFactor = Math.min(characteristics.tempo / 140, 1); // Normalize around 140 BPM
    const energyFactor = audioFeatures.energy;
    const loudnessFactor = Math.min((audioFeatures.loudness + 60) / 60, 1); // Normalize loudness
    
    return (tempoFactor * 0.3 + energyFactor * 0.4 + loudnessFactor * 0.3);
  }
  
  private calculateEmotionDuration(
    emotion: { intensity: number; confidence: number },
    characteristics: MusicalCharacteristics
  ): number {
    // Base duration on tempo and emotion stability
    const baseDuration = 2000; // 2 seconds base
    const tempoMultiplier = 60000 / characteristics.tempo; // Beat duration
    const stabilityMultiplier = emotion.confidence * 2; // More stable = longer duration
    
    return Math.min(baseDuration * tempoMultiplier * stabilityMultiplier, 10000); // Max 10 seconds
  }
  
  private createCacheKey(audioFeatures: AudioFeatures): string {
    // Create a cache key based on rounded audio features
    const precision = 100; // Round to 2 decimal places
    return [
      Math.round(audioFeatures.valence * precision),
      Math.round(audioFeatures.energy * precision),
      Math.round(audioFeatures.danceability * precision),
      Math.round(audioFeatures.acousticness * precision),
      audioFeatures.key,
      audioFeatures.mode
    ].join('-');
  }
  
  private cacheEmotion(key: string, emotion: EmotionalState): void {
    // Manage cache size
    if (this.emotionCache.size >= this.config.cacheSize) {
      const firstKey = this.emotionCache.keys().next().value;
      if (firstKey !== undefined) {
        this.emotionCache.delete(firstKey);
      }
    }
    
    this.emotionCache.set(key, emotion);
  }
  
  private updateCurrentEmotion(emotion: EmotionalState): void {
    this.currentEmotion = emotion;
    
    // Add to history
    this.emotionHistory.push(emotion);
    
    // Manage history size
    if (this.emotionHistory.length > 1000) {
      this.emotionHistory = this.emotionHistory.slice(-500); // Keep last 500
    }
  }
  
  private notifyEmotionUpdate(emotion: EmotionalState): void {
    this.emotionSubscribers.forEach(callback => {
      try {
        callback(emotion);
      } catch (error) {
        console.error('❌ Error in emotion subscriber callback:', error);
      }
    });
  }
  
  private createNeutralEmotion(audioFeatures: AudioFeatures): EmotionalState {
    return {
      primary: 'serenity',
      secondary: [],
      intensity: 0.5,
      confidence: 0.3,
      valence: audioFeatures.valence ?? 0.5,
      arousal: audioFeatures.energy ?? 0.5,
      dominance: 0.5,
      colorTemperature: 6500, // Neutral daylight temperature
      timestamp: Date.now(),
      duration: 3000,
      musicalCharacteristics: this.audioFeatureAnalyzer.extractCharacteristics(audioFeatures)
    };
  }
}

// ===== ANALYSIS COMPONENT CLASSES =====

class ValenceEnergyMapper {
  async initialize(): Promise<void> {
    // Initialization if needed
  }
  
  mapToEmotion(
    valence: number, 
    energy: number, 
    characteristics: MusicalCharacteristics
  ): { primary: EmotionType; secondary: EmotionType[]; intensity: number; confidence: number } {
    // Russell's Circumplex Model of Affect mapping
    // Valence (x-axis): negative to positive
    // Arousal/Energy (y-axis): low to high
    
    let primary: EmotionType;
    let secondary: EmotionType[] = [];
    let intensity: number;
    let confidence = 0.8;
    
    if (valence >= 0.6 && energy >= 0.6) {
      // High valence, high energy: Joy/Excitement
      primary = characteristics.danceability > 0.7 ? 'excitement' : 'joy';
      secondary = ['joy', 'excitement'];
      intensity = Math.min(valence + energy - 0.2, 1);
    } else if (valence >= 0.6 && energy < 0.4) {
      // High valence, low energy: Serenity/Love
      primary = characteristics.acousticness > 0.6 ? 'serenity' : 'love';
      secondary = ['serenity', 'love'];
      intensity = valence * 0.8;
    } else if (valence < 0.4 && energy >= 0.6) {
      // Low valence, high energy: Anger/Fear
      primary = characteristics.mode === 0 ? 'anger' : 'fear'; // Minor key = anger
      secondary = ['anger', 'fear'];
      intensity = energy;
    } else if (valence < 0.4 && energy < 0.4) {
      // Low valence, low energy: Sadness/Melancholy
      primary = characteristics.acousticness > 0.5 ? 'melancholy' : 'sadness';
      secondary = ['sadness', 'melancholy'];
      intensity = (1 - valence) * 0.8;
    } else {
      // Neutral zone: transition emotions
      if (characteristics.instrumentalness > 0.8) {
        primary = 'transcendence';
        secondary = ['transcendence', 'consciousness'];
      } else {
        primary = 'nostalgia';
        secondary = ['nostalgia'];
      }
      intensity = Math.abs(valence - 0.5) + Math.abs(energy - 0.5);
      confidence = 0.6; // Lower confidence for neutral emotions
    }
    
    // Special cases for consciousness and organic flow
    if (characteristics.organicFlow > 0.8) {
      secondary.push('organic-flow');
    }
    
    if (characteristics.consciousnessResonance > 0.7) {
      secondary.push('consciousness');
    }
    
    return { primary, secondary, intensity, confidence };
  }
}

class AudioFeatureAnalyzer {
  async initialize(): Promise<void> {
    // Initialization if needed
  }
  
  extractCharacteristics(audioFeatures: AudioFeatures): MusicalCharacteristics {
    return {
      tempo: audioFeatures.tempo,
      key: audioFeatures.key,
      mode: audioFeatures.mode,
      timeSignature: audioFeatures.timeSignature,
      energy: audioFeatures.energy,
      danceability: audioFeatures.danceability,
      acousticness: audioFeatures.acousticness,
      instrumentalness: audioFeatures.instrumentalness,
      liveness: audioFeatures.liveness,
      speechiness: audioFeatures.speechiness,
      
      // Calculate consciousness-specific metrics
      organicFlow: this.calculateOrganicFlow(audioFeatures),
      cinematicDepth: this.calculateCinematicDepth(audioFeatures),
      consciousnessResonance: this.calculateConsciousnessResonance(audioFeatures)
    };
  }
  
  private calculateOrganicFlow(features: AudioFeatures): number {
    // Organic flow is higher for acoustic, lower tempo, flowing music
    const acousticWeight = features.acousticness * 0.4;
    const tempoWeight = (1 - Math.min(features.tempo / 140, 1)) * 0.3; // Slower = more organic
    const energyWeight = (1 - features.energy) * 0.2; // Lower energy = more organic
    const danceWeight = features.danceability * 0.1; // Some rhythm helps flow
    
    return Math.min(acousticWeight + tempoWeight + energyWeight + danceWeight, 1);
  }
  
  private calculateCinematicDepth(features: AudioFeatures): number {
    // Cinematic depth combines instrumental, atmospheric qualities
    const instrumentalWeight = features.instrumentalness * 0.4;
    const liveWeight = (1 - features.liveness) * 0.2; // Studio production = more cinematic
    const speechWeight = (1 - features.speechiness) * 0.2; // Less speech = more cinematic
    const energyWeight = Math.abs(features.energy - 0.5) * 0.2; // Extreme energy = cinematic
    
    return Math.min(instrumentalWeight + liveWeight + speechWeight + energyWeight, 1);
  }
  
  private calculateConsciousnessResonance(features: AudioFeatures): number {
    // Consciousness resonance for transcendent, awareness-expanding music
    const valenceBalance = 1 - Math.abs(features.valence - 0.5) * 2; // Balanced valence
    const energyBalance = 1 - Math.abs(features.energy - 0.4) * 2; // Slightly lower energy
    const instrumentalWeight = features.instrumentalness * 0.3;
    const acousticWeight = features.acousticness * 0.2;
    
    return Math.max(0, (valenceBalance + energyBalance) * 0.5 + instrumentalWeight + acousticWeight);
  }
}

class TemperatureCalculator {
  async initialize(): Promise<void> {
    // Initialization if needed
  }
  
  calculateTemperature(
    emotion: { primary: EmotionType; intensity: number },
    characteristics: MusicalCharacteristics
  ): number {
    // Map emotions to color temperature (1000K-20000K)
    let baseTemperature: number;
    
    switch (emotion.primary) {
      case 'joy':
      case 'excitement':
        baseTemperature = 8000; // Bright, energetic warm
        break;
      case 'love':
      case 'serenity':
        baseTemperature = 3000; // Warm, cozy
        break;
      case 'anger':
        baseTemperature = 15000; // Very cold, harsh blue
        break;
      case 'fear':
        baseTemperature = 12000; // Cold, stark
        break;
      case 'sadness':
      case 'melancholy':
        baseTemperature = 2000; // Very warm, candlelight
        break;
      case 'nostalgia':
        baseTemperature = 2500; // Warm, golden hour
        break;
      case 'transcendence':
      case 'consciousness':
        baseTemperature = 6500; // Neutral, balanced
        break;
      case 'organic-flow':
        baseTemperature = 4000; // Natural, organic warmth
        break;
      default:
        baseTemperature = 6500; // Daylight neutral
    }
    
    // Adjust based on intensity
    const intensityAdjustment = (emotion.intensity - 0.5) * 2000; // ±2000K based on intensity
    
    // Adjust based on musical characteristics
    const tempoAdjustment = (characteristics.tempo - 120) * 10; // ±10K per BPM difference from 120
    const energyAdjustment = (characteristics.energy - 0.5) * 1000; // ±1000K based on energy
    
    const finalTemperature = baseTemperature + intensityAdjustment + tempoAdjustment + energyAdjustment;
    
    // Clamp to valid range
    return Math.max(1000, Math.min(20000, finalTemperature));
  }
}

class ConsciousnessDetector {
  async initialize(): Promise<void> {
    // Initialization if needed
  }
  
  async analyze(
    audioFeatures: AudioFeatures,
    characteristics: MusicalCharacteristics,
    audioData?: AudioData
  ): Promise<{
    organicFlow: number;
    cinematicDepth: number;
    consciousnessResonance: number;
  }> {
    // Enhanced consciousness detection using audio data if available
    let organicFlow = characteristics.organicFlow;
    let cinematicDepth = characteristics.cinematicDepth;
    let consciousnessResonance = characteristics.consciousnessResonance;
    
    // If we have audio data, analyze waveform patterns
    if (audioData?.waveform) {
      const waveformAnalysis = this.analyzeWaveformPatterns(audioData.waveform);
      
      // Enhance organic flow based on waveform smoothness
      organicFlow = Math.min(1, organicFlow + waveformAnalysis.smoothness * 0.2);
      
      // Enhance cinematic depth based on dynamic range
      cinematicDepth = Math.min(1, cinematicDepth + waveformAnalysis.dynamicRange * 0.3);
      
      // Enhance consciousness resonance based on harmonic complexity
      consciousnessResonance = Math.min(1, consciousnessResonance + waveformAnalysis.harmonicComplexity * 0.2);
    }
    
    return {
      organicFlow,
      cinematicDepth,
      consciousnessResonance
    };
  }
  
  private analyzeWaveformPatterns(waveform: Float32Array): {
    smoothness: number;
    dynamicRange: number;
    harmonicComplexity: number;
  } {
    // Simple waveform analysis for consciousness characteristics
    let smoothness = 0;
    let dynamicRange = 0;
    let harmonicComplexity = 0;
    
    if (waveform.length > 1) {
      // Calculate smoothness (inverse of variation)
      let totalVariation = 0;
      for (let i = 1; i < waveform.length; i++) {
        const current = waveform[i];
        const previous = waveform[i - 1];
        if (current !== undefined && previous !== undefined) {
          totalVariation += Math.abs(current - previous);
        }
      }
      smoothness = 1 - Math.min(totalVariation / waveform.length, 1);
      
      // Calculate dynamic range
      const max = Math.max(...waveform);
      const min = Math.min(...waveform);
      dynamicRange = max - min;
      
      // Simple harmonic complexity estimation
      harmonicComplexity = Math.min(this.estimateHarmonicContent(waveform), 1);
    }
    
    return { smoothness, dynamicRange, harmonicComplexity };
  }
  
  private estimateHarmonicContent(waveform: Float32Array): number {
    // Very simple harmonic estimation based on zero-crossing rate
    let zeroCrossings = 0;
    for (let i = 1; i < waveform.length; i++) {
      const current = waveform[i];
      const previous = waveform[i - 1];
      if (current !== undefined && previous !== undefined) {
        if ((current >= 0) !== (previous >= 0)) {
          zeroCrossings++;
        }
      }
    }
    
    // Normalize to a 0-1 range (more crossings = more complexity, to a point)
    return Math.min(zeroCrossings / (waveform.length * 0.1), 1);
  }
}

// ===== EXPORT =====

export { MusicEmotionAnalyzer as default };