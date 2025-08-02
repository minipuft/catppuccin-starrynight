/**
 * FluxSpectralAnalyzer - Advanced Music Consciousness Analysis
 * Part of the Year 3000 Musical Gradient System
 *
 * Provides deep spectral analysis and temporal prediction for gradient consciousness:
 * - Frequency band analysis (Bass, Mid, Treble, Vocal)
 * - Harmonic resonance detection
 * - Emotional valence mapping
 * - Temporal phase prediction
 * - Musical structure analysis
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";

export interface SpectralData {
  // Frequency Band Analysis
  bassLevel: number;          // 0-1 bass frequency energy
  midLevel: number;           // 0-1 mid frequency energy
  trebleLevel: number;        // 0-1 treble frequency energy
  vocalLevel: number;         // 0-1 vocal frequency energy
  
  // Harmonic Analysis
  harmonicResonance: number;  // 0-1 harmonic complexity
  tonalCenterStrength: number; // 0-1 tonal center stability
  dissonanceLevel: number;    // 0-1 harmonic dissonance
  
  // Temporal Analysis
  temporalPhase: number;      // 0-1 position in song structure
  predictedBeatTime: number;  // ms to next predicted beat
  structuralPosition: number; // 0-1 verse/chorus/bridge position
  
  // Emotional Mapping
  emotionalValence: number;   // 0-1 sad to happy
  energyLevel: number;        // 0-1 calm to energetic
  tensionLevel: number;       // 0-1 relaxed to tense
  
  // Cosmic Properties
  stellarDrift: number;       // -30 to +30 degrees genre-based hue shift
  quantumCoherence: number;   // 0-1 quantum synchronization state
  consciousnessLevel: number; // 0-1 overall awareness intensity
}

export interface MusicalStructure {
  verse: { start: number; end: number }[];
  chorus: { start: number; end: number }[];
  bridge: { start: number; end: number }[];
  intro: { start: number; end: number }[];
  outro: { start: number; end: number }[];
}

export class FluxSpectralAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array | null = null;
  private cssConsciousnessController: UnifiedCSSConsciousnessController;
  private musicSyncService: MusicSyncService | null = null;
  
  private lastSpectralData: SpectralData | null = null;
  private temporalMemory: SpectralData[] = [];
  private maxMemorySize = 100; // Keep 100 frames of history
  
  private isActive = false;
  private analysisInterval: ReturnType<typeof setInterval> | null = null;
  private analysisRate = 60; // 60 FPS analysis
  
  // Genre-based stellar drift mapping
  private genreHueMap: { [key: string]: number } = {
    'electronic': 15,
    'rock': -5,
    'pop': 0,
    'classical': -10,
    'jazz': 10,
    'hip-hop': 20,
    'ambient': -15,
    'techno': 25,
    'indie': -8,
    'metal': -20
  };
  
  // Frequency band boundaries (Hz)
  private readonly BASS_RANGE = { min: 20, max: 250 };
  private readonly MID_RANGE = { min: 250, max: 4000 };
  private readonly TREBLE_RANGE = { min: 4000, max: 20000 };
  private readonly VOCAL_RANGE = { min: 85, max: 1100 };

  constructor(
    cssConsciousnessController: UnifiedCSSConsciousnessController,
    musicSyncService: MusicSyncService | null = null
  ) {
    this.cssConsciousnessController = cssConsciousnessController;
    this.musicSyncService = musicSyncService;
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Initialize frequency data array
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      
      // Try to connect to audio source
      await this.connectToAudioSource();
      
      Y3K?.debug?.log("FluxSpectralAnalyzer", "Audio analysis initialized");
      
    } catch (error) {
      Y3K?.debug?.error("FluxSpectralAnalyzer", "Failed to initialize audio analysis:", error);
      throw error;
    }
  }

  private async connectToAudioSource(): Promise<void> {
    try {
      // Try to get audio from media elements (Spotify audio/video elements)
      const audioElements = document.querySelectorAll('audio, video');
      
      for (const element of audioElements) {
        if (element instanceof HTMLAudioElement || element instanceof HTMLVideoElement) {
          try {
            const source = this.audioContext!.createMediaElementSource(element);
            source.connect(this.analyser!);
            this.analyser!.connect(this.audioContext!.destination);
            
            Y3K?.debug?.log("FluxSpectralAnalyzer", "Connected to audio element");
            return;
          } catch (error) {
            // Try next element
            continue;
          }
        }
      }
      
      // No microphone fallback - prioritize user privacy
      Y3K?.debug?.log("FluxSpectralAnalyzer", "No audio elements found, using synthetic data");
      
    } catch (error) {
      Y3K?.debug?.warn("FluxSpectralAnalyzer", "Could not connect to audio source:", error);
    }
    
    // Continue without audio connection - will use synthetic data for visualization
  }

  public start(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    
    // Start analysis loop
    this.analysisInterval = setInterval(() => {
      this.performAnalysis();
    }, 1000 / this.analysisRate);
    
    Y3K?.debug?.log("FluxSpectralAnalyzer", "Spectral analysis started");
  }

  public stop(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    Y3K?.debug?.log("FluxSpectralAnalyzer", "Spectral analysis stopped");
  }

  private performAnalysis(): void {
    if (!this.analyser || !this.frequencyData) {
      // Generate synthetic data for testing
      this.generateSyntheticData();
      return;
    }
    
    try {
      // Get frequency data
      this.analyser.getByteFrequencyData(this.frequencyData);
      
      // Perform spectral analysis
      const spectralData = this.analyzeSpectrum();
      
      // Add temporal prediction
      this.addTemporalPrediction(spectralData);
      
      // Add emotional mapping
      this.addEmotionalMapping(spectralData);
      
      // Add cosmic properties
      this.addCosmicProperties(spectralData);
      
      // Update CSS variables
      this.updateGradientVariables(spectralData);
      
      // Store in memory
      this.storeInMemory(spectralData);
      
      // Dispatch events
      this.dispatchSpectralEvents(spectralData);
      
      this.lastSpectralData = spectralData;
      
    } catch (error) {
      Y3K?.debug?.error("FluxSpectralAnalyzer", "Analysis error:", error);
    }
  }

  private analyzeSpectrum(): SpectralData {
    const sampleRate = this.audioContext?.sampleRate || 44100;
    const binCount = this.frequencyData!.length;
    const binWidth = sampleRate / (2 * binCount);
    
    let bassTotal = 0, bassCount = 0;
    let midTotal = 0, midCount = 0;
    let trebleTotal = 0, trebleCount = 0;
    let vocalTotal = 0, vocalCount = 0;
    
    // Analyze frequency bands
    for (let i = 0; i < binCount; i++) {
      const frequency = i * binWidth;
      const frequencyValue = this.frequencyData![i];
      
      // Add null/undefined check for array access
      if (frequencyValue === undefined) continue;
      
      const amplitude = frequencyValue / 255; // Normalize to 0-1
      
      if (frequency >= this.BASS_RANGE.min && frequency <= this.BASS_RANGE.max) {
        bassTotal += amplitude;
        bassCount++;
      }
      
      if (frequency >= this.MID_RANGE.min && frequency <= this.MID_RANGE.max) {
        midTotal += amplitude;
        midCount++;
      }
      
      if (frequency >= this.TREBLE_RANGE.min && frequency <= this.TREBLE_RANGE.max) {
        trebleTotal += amplitude;
        trebleCount++;
      }
      
      if (frequency >= this.VOCAL_RANGE.min && frequency <= this.VOCAL_RANGE.max) {
        vocalTotal += amplitude;
        vocalCount++;
      }
    }
    
    return {
      bassLevel: bassCount > 0 ? bassTotal / bassCount : 0,
      midLevel: midCount > 0 ? midTotal / midCount : 0,
      trebleLevel: trebleCount > 0 ? trebleTotal / trebleCount : 0,
      vocalLevel: vocalCount > 0 ? vocalTotal / vocalCount : 0,
      
      harmonicResonance: this.calculateHarmonicResonance(),
      tonalCenterStrength: this.calculateTonalCenterStrength(),
      dissonanceLevel: this.calculateDissonanceLevel(),
      
      temporalPhase: 0, // Will be set by temporal prediction
      predictedBeatTime: 0, // Will be set by temporal prediction
      structuralPosition: 0, // Will be set by temporal prediction
      
      emotionalValence: 0.5, // Will be set by emotional mapping
      energyLevel: 0.5, // Will be set by emotional mapping
      tensionLevel: 0.5, // Will be set by emotional mapping
      
      stellarDrift: 0, // Will be set by cosmic properties
      quantumCoherence: 0, // Will be set by cosmic properties
      consciousnessLevel: 0.7 // Will be set by cosmic properties
    };
  }

  private calculateHarmonicResonance(): number {
    // Simplified harmonic analysis - detect harmonic relationships
    if (!this.frequencyData) return 0;
    
    let harmonicStrength = 0;
    const fundamentalBin = 10; // Around 200Hz
    
    // Check for harmonic overtones
    for (let harmonic = 2; harmonic <= 8; harmonic++) {
      const harmonicBin = fundamentalBin * harmonic;
      if (harmonicBin < this.frequencyData.length) {
        const fundamentalLevel = this.frequencyData[fundamentalBin];
        const harmonicLevel = this.frequencyData[harmonicBin];
        
        // Add null/undefined checks for array access and ensure both values exist
        if (fundamentalLevel !== undefined && harmonicLevel !== undefined && fundamentalLevel > 0) {
          harmonicStrength += (harmonicLevel / fundamentalLevel) / harmonic;
        }
      }
    }
    
    return Math.min(harmonicStrength, 1.0);
  }

  private calculateTonalCenterStrength(): number {
    // Simplified tonal center detection
    if (!this.frequencyData) return 0;
    
    let maxBin = 0;
    let maxValue = 0;
    
    // Find the strongest frequency component
    for (let i = 0; i < this.frequencyData.length; i++) {
      const value = this.frequencyData[i];
      if (value !== undefined && value > maxValue) {
        maxValue = value;
        maxBin = i;
      }
    }
    
    // Measure how much stronger the peak is than surrounding bins
    const windowSize = 5;
    let surroundingAverage = 0;
    let count = 0;
    
    for (let i = Math.max(0, maxBin - windowSize); i <= Math.min(this.frequencyData.length - 1, maxBin + windowSize); i++) {
      if (i !== maxBin) {
        const value = this.frequencyData[i];
        if (value !== undefined) {
          surroundingAverage += value;
          count++;
        }
      }
    }
    
    if (count > 0) {
      surroundingAverage /= count;
      return Math.min((maxValue - surroundingAverage) / 255, 1.0);
    }
    
    return 0;
  }

  private calculateDissonanceLevel(): number {
    // Simplified dissonance calculation based on frequency conflicts
    if (!this.frequencyData) return 0;
    
    let conflicts = 0;
    const threshold = 100; // Minimum amplitude to consider
    
    for (let i = 1; i < this.frequencyData.length - 1; i++) {
      const current = this.frequencyData[i];
      const previous = this.frequencyData[i - 1];
      const next = this.frequencyData[i + 1];
      
      // Add null/undefined checks for array access
      if (current !== undefined && previous !== undefined && next !== undefined && current > threshold) {
        // Check for nearby conflicting frequencies
        const prevDiff = Math.abs(current - previous);
        const nextDiff = Math.abs(current - next);
        
        if (prevDiff > 50 || nextDiff > 50) {
          conflicts++;
        }
      }
    }
    
    return Math.min(conflicts / 100, 1.0);
  }

  private addTemporalPrediction(spectralData: SpectralData): void {
    // Use music sync service if available
    if (this.musicSyncService) {
      try {
        // Try to get processed data from the music sync service
        const processedData = this.musicSyncService.getLatestProcessedData();
        
        if (processedData) {
          // Use available data from the music sync service
          const currentTime = performance.now(); // Use performance.now() as fallback
          const estimatedDuration = 240000; // Assume 4-minute song as fallback
          
          spectralData.temporalPhase = (currentTime / estimatedDuration) % 1;
          
          // Use BPM from processed data if available
          const bpm = processedData.enhancedBPM || processedData.bpm || 120;
          const beatInterval = 60000 / bpm; // ms per beat
          const timeSinceLastBeat = currentTime % beatInterval;
          spectralData.predictedBeatTime = beatInterval - timeSinceLastBeat;
          
          // Estimate structural position
          spectralData.structuralPosition = this.estimateStructuralPosition(spectralData.temporalPhase);
        } else {
          // Music sync service exists but no data available
          this.generateFallbackTemporalData(spectralData);
        }
      } catch (error) {
        Y3K?.debug?.warn("FluxSpectralAnalyzer", "Error accessing music sync service:", error);
        this.generateFallbackTemporalData(spectralData);
      }
    } else {
      // No music sync service available
      this.generateFallbackTemporalData(spectralData);
    }
  }

  private generateFallbackTemporalData(spectralData: SpectralData): void {
    // Fallback to synthetic temporal data
    const now = performance.now();
    spectralData.temporalPhase = (now / 30000) % 1; // 30 second cycle
    spectralData.predictedBeatTime = 500; // 500ms to next beat
    spectralData.structuralPosition = 0.5;
  }

  private estimateStructuralPosition(temporalPhase: number): number {
    // Simple heuristic for song structure
    if (temporalPhase < 0.1) return 0.1; // Intro
    if (temporalPhase < 0.3) return 0.3; // Verse
    if (temporalPhase < 0.5) return 0.7; // Chorus
    if (temporalPhase < 0.7) return 0.4; // Verse
    if (temporalPhase < 0.9) return 0.8; // Chorus
    return 0.2; // Outro
  }

  private addEmotionalMapping(spectralData: SpectralData): void {
    // Map spectral features to emotional dimensions
    
    // Valence (sad to happy) - higher treble and mid suggest happiness
    spectralData.emotionalValence = (spectralData.trebleLevel * 0.6 + spectralData.midLevel * 0.4);
    
    // Energy (calm to energetic) - overall amplitude and bass
    spectralData.energyLevel = (spectralData.bassLevel * 0.5 + spectralData.midLevel * 0.3 + spectralData.trebleLevel * 0.2);
    
    // Tension (relaxed to tense) - dissonance and high frequencies
    spectralData.tensionLevel = (spectralData.dissonanceLevel * 0.6 + spectralData.trebleLevel * 0.4);
    
    // Clamp to 0-1 range
    spectralData.emotionalValence = Math.max(0, Math.min(1, spectralData.emotionalValence));
    spectralData.energyLevel = Math.max(0, Math.min(1, spectralData.energyLevel));
    spectralData.tensionLevel = Math.max(0, Math.min(1, spectralData.tensionLevel));
  }

  private addCosmicProperties(spectralData: SpectralData): void {
    // Stellar drift based on harmonic content
    const harmonicInfluence = spectralData.harmonicResonance * 30; // -30 to +30 degrees
    spectralData.stellarDrift = (spectralData.tonalCenterStrength - 0.5) * harmonicInfluence;
    
    // Quantum coherence based on temporal stability
    const temporalStability = this.calculateTemporalStability();
    spectralData.quantumCoherence = temporalStability * spectralData.harmonicResonance;
    
    // Consciousness level based on overall complexity
    const complexity = (spectralData.harmonicResonance + spectralData.dissonanceLevel + spectralData.energyLevel) / 3;
    spectralData.consciousnessLevel = 0.3 + complexity * 0.7; // 0.3 to 1.0 range
  }

  private calculateTemporalStability(): number {
    if (this.temporalMemory.length < 2) return 0.5;
    
    // Calculate stability based on recent changes
    let stability = 0;
    const recentFrames = Math.min(10, this.temporalMemory.length);
    
    for (let i = 1; i < recentFrames; i++) {
      const current = this.temporalMemory[this.temporalMemory.length - i];
      const previous = this.temporalMemory[this.temporalMemory.length - i - 1];
      
      // Add null/undefined checks for array access
      if (current && previous) {
        const energyDiff = Math.abs(current.energyLevel - previous.energyLevel);
        const valenceDiff = Math.abs(current.emotionalValence - previous.emotionalValence);
        
        stability += 1 - (energyDiff + valenceDiff) / 2;
      }
    }
    
    return stability / (recentFrames - 1);
  }

  private updateGradientVariables(spectralData: SpectralData): void {
    // Update CSS variables for gradient consciousness
    this.cssConsciousnessController.setProperty("--sn-gradient-bass-response", spectralData.bassLevel.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-mid-response", spectralData.midLevel.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-treble-response", spectralData.trebleLevel.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-vocal-presence", spectralData.vocalLevel.toString());
    
    this.cssConsciousnessController.setProperty("--sn-gradient-harmonic-resonance", spectralData.harmonicResonance.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-temporal-phase", spectralData.temporalPhase.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-emotional-valence", spectralData.emotionalValence.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-cosmic-energy", spectralData.energyLevel.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-stellar-drift", `${spectralData.stellarDrift}deg`);
    this.cssConsciousnessController.setProperty("--sn-gradient-quantum-coherence", spectralData.quantumCoherence.toString());
    this.cssConsciousnessController.setProperty("--sn-gradient-consciousness-level", spectralData.consciousnessLevel.toString());
  }

  private storeInMemory(spectralData: SpectralData): void {
    this.temporalMemory.push({ ...spectralData });
    
    // Keep memory size limited
    if (this.temporalMemory.length > this.maxMemorySize) {
      this.temporalMemory.shift();
    }
  }

  private dispatchSpectralEvents(spectralData: SpectralData): void {
    // Dispatch events for other systems to consume
    document.dispatchEvent(new CustomEvent("music-sync:spectral-data", {
      detail: spectralData
    }));
    
    // Dispatch beat event if predicted
    if (spectralData.predictedBeatTime < 50) { // Within 50ms of predicted beat
      document.dispatchEvent(new CustomEvent("music-sync:beat-detected", {
        detail: { intensity: spectralData.energyLevel }
      }));
    }
  }

  private generateSyntheticData(): void {
    // Generate synthetic spectral data for testing when no audio is available
    const now = performance.now();
    const baseFreq = 0.001; // Base frequency for synthetic waves
    
    const spectralData: SpectralData = {
      bassLevel: 0.3 + Math.sin(now * baseFreq) * 0.3,
      midLevel: 0.4 + Math.sin(now * baseFreq * 1.5) * 0.2,
      trebleLevel: 0.2 + Math.sin(now * baseFreq * 2) * 0.3,
      vocalLevel: 0.25 + Math.sin(now * baseFreq * 0.8) * 0.2,
      
      harmonicResonance: 0.6 + Math.sin(now * baseFreq * 0.5) * 0.2,
      tonalCenterStrength: 0.7 + Math.sin(now * baseFreq * 0.3) * 0.1,
      dissonanceLevel: 0.2 + Math.sin(now * baseFreq * 3) * 0.1,
      
      temporalPhase: (now / 30000) % 1,
      predictedBeatTime: 500 + Math.sin(now * baseFreq * 4) * 100,
      structuralPosition: 0.5 + Math.sin(now * baseFreq * 0.1) * 0.3,
      
      emotionalValence: 0.6 + Math.sin(now * baseFreq * 0.7) * 0.2,
      energyLevel: 0.5 + Math.sin(now * baseFreq * 1.2) * 0.3,
      tensionLevel: 0.3 + Math.sin(now * baseFreq * 2.5) * 0.2,
      
      stellarDrift: Math.sin(now * baseFreq * 0.2) * 15,
      quantumCoherence: 0.4 + Math.sin(now * baseFreq * 0.6) * 0.3,
      consciousnessLevel: 0.7 + Math.sin(now * baseFreq * 0.4) * 0.2
    };
    
    this.updateGradientVariables(spectralData);
    this.storeInMemory(spectralData);
    this.dispatchSpectralEvents(spectralData);
    
    this.lastSpectralData = spectralData;
  }

  public getLastSpectralData(): SpectralData | null {
    return this.lastSpectralData;
  }

  public getTemporalMemory(): SpectralData[] {
    return [...this.temporalMemory];
  }

  public setGenreHint(genre: string): void {
    // Update stellar drift based on genre
    const hueShift = this.genreHueMap[genre.toLowerCase()] || 0;
    this.cssConsciousnessController.setProperty("--sn-gradient-stellar-drift", `${hueShift}deg`);
  }

  public destroy(): void {
    this.stop();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.frequencyData = null;
    this.temporalMemory = [];
    this.lastSpectralData = null;
    
    Y3K?.debug?.log("FluxSpectralAnalyzer", "Destroyed");
  }
}