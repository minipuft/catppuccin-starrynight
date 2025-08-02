/**
 * Musical LERP Orchestrator - Year 3000 System
 * 
 * Central intelligence for calculating music-aware LERP parameters that create
 * organic consciousness breathing and flowing with musical characteristics.
 * 
 * @philosophy "Interfaces are not built—they are grown, and they breathe with music"
 * @architecture Musical Consciousness replacing static smoothing
 * @performance Sub-millisecond calculations, 60fps target maintenance
 */

import type { MusicSyncService } from "@/audio/MusicSyncService";
import type { PerformanceContext, PerformanceAwareLerpParams } from "@/core/performance/PerformanceAwareLerpCoordinator";

// Musical context interface for consciousness calculations
export interface MusicalContext {
  tempo: number;                    // BPM (60-200+)
  energy: number;                   // 0-1 intensity level
  valence: number;                  // 0-1 emotional positivity
  danceability: number;             // 0-1 rhythmic flow quality
  emotionalTemperature: number;     // 1000K-20000K consciousness temperature
  beatPhase: 'attack' | 'sustain' | 'decay' | 'rest';
  beatConfidence: number;           // 0-1 beat detection confidence
  beatInterval: number;             // Milliseconds between beats
  timeSinceLastBeat: number;        // Milliseconds since last beat
}

// Animation type profiles for different consciousness aspects
export type AnimationType = 'pulse' | 'flow' | 'emotional' | 'organic' | 'crystalline';

// LERP calculation result with musical consciousness
export interface MusicalLerpResult {
  halfLife: number;                 // Calculated half-life in seconds
  attackMultiplier: number;         // Attack phase speed modifier
  decayMultiplier: number;          // Decay phase speed modifier
  fluidityFactor: number;           // Organic fluidity level
  consciousnessLevel: number;       // Overall consciousness awareness
  performanceOptimized: boolean;    // Whether performance optimizations were applied
  debugInfo?: {
    tempoFactor: number;
    energyFactor: number;
    danceabilityFactor: number;
    temperatureFactor: number;
    beatPhaseFactor: number;
    performanceMultiplier?: number;
    complexityReduction?: number;
  };
}

/**
 * Musical LERP Orchestrator - Consciousness-aware smoothing calculation engine
 */
export class MusicalLerpOrchestrator {
  // Base half-life values for different animation types
  private baseHalfLifeValues = {
    pulse: 0.08,        // Beat-synchronized effects
    flow: 0.15,         // Continuous movement (parallax, gradients)
    emotional: 0.25,    // Color and emotional transitions
    organic: 0.12,      // Particle and breathing effects
    crystalline: 0.06   // Precise, geometric animations
  };

  // Beat phase timing configuration (as percentage of beat interval)
  private beatPhaseConfig = {
    attack: { start: 0, end: 0.15, baseMultiplier: 0.3 },     // 0-15% of beat
    sustain: { start: 0.15, end: 0.50, baseMultiplier: 1.0 }, // 15-50% of beat
    decay: { start: 0.50, end: 0.85, baseMultiplier: 1.4 },   // 50-85% of beat
    rest: { start: 0.85, end: 1.0, baseMultiplier: 0.8 }      // 85-100% of beat
  };

  // Musical modulation ranges for consciousness calculation
  private modulationConfig = {
    tempo: {
      reference: 120,     // Reference BPM (120)
      minFactor: 0.6,     // Minimum tempo influence
      maxFactor: 1.8,     // Maximum tempo influence
      curve: 0.3          // Exponential curve factor
    },
    energy: {
      attackRange: 0.7,   // Energy influence on attack speed
      decayRange: 0.5,    // Energy influence on decay sustain
      baseline: 1.0       // Baseline multiplier
    },
    danceability: {
      fluidityMin: 0.5,   // Minimum fluidity factor
      fluidityMax: 1.0,   // Maximum fluidity factor
      organicThreshold: 0.6 // Threshold for organic behavior
    },
    temperature: {
      neutral: 4000,      // Neutral temperature (4000K)
      range: 16000,       // Temperature range for calculation
      warmthInfluence: 0.3, // Warm temperature flow influence
      coolPrecision: 0.4  // Cool temperature precision influence
    }
  };

  private debugMode: boolean = false;

  constructor(enableDebug: boolean = false) {
    this.debugMode = enableDebug;
  }

  /**
   * Calculate music-aware LERP parameters for consciousness smoothing
   */
  public calculateMusicalLerp(
    musicContext: MusicalContext,
    animationType: AnimationType = 'flow',
    baseHalfLife?: number
  ): MusicalLerpResult {
    return this.calculateMusicalLerpWithPerformance(
      musicContext,
      animationType,
      baseHalfLife,
      null // No performance context
    );
  }

  /**
   * Calculate performance-aware musical LERP parameters for consciousness smoothing
   */
  public calculateMusicalLerpWithPerformance(
    musicContext: MusicalContext,
    animationType: AnimationType = 'flow',
    baseHalfLife?: number,
    performanceContext?: PerformanceContext | null,
    performanceParams?: PerformanceAwareLerpParams | null
  ): MusicalLerpResult {
    const startTime = performance.now();

    // Use provided base half-life or get from type
    const baseHalf = baseHalfLife || this.baseHalfLifeValues[animationType];

    // Check if performance optimizations should be applied
    const usePerformanceOptimizations = performanceParams && performanceContext;
    let performanceOptimized = false;

    // Calculate individual modulation factors (with performance awareness)
    let tempoFactor = 1.0;
    let energyFactor = 1.0;
    let danceabilityFactor = 1.0;
    let temperatureFactor = 1.0;
    let beatPhaseFactor = 1.0;

    if (usePerformanceOptimizations && performanceParams) {
      // Apply performance-aware calculations
      performanceOptimized = true;

      // Reduced complexity calculations based on performance state
      if (!performanceParams.useSimplifiedCalculations) {
        tempoFactor = this.calculateTempoFactor(musicContext.tempo);
        if (performanceParams.enableEnergyModulation) {
          energyFactor = this.calculateEnergyFactor(musicContext.energy);
        }
        danceabilityFactor = this.calculateDanceabilityFactor(musicContext.danceability);
        if (performanceParams.enableTemperatureMapping) {
          temperatureFactor = this.calculateTemperatureFactor(musicContext.emotionalTemperature);
        }
        if (performanceParams.enableBeatPhase) {
          beatPhaseFactor = this.calculateBeatPhaseFactor(
            musicContext.beatPhase,
            musicContext.timeSinceLastBeat,
            musicContext.beatInterval
          );
        }
      } else {
        // Simplified calculations for performance
        tempoFactor = Math.max(0.7, Math.min(1.5, musicContext.tempo / 120));
        if (performanceParams.enableEnergyModulation) {
          energyFactor = 1.0 + (musicContext.energy * 0.2); // Simplified energy factor
        }
        danceabilityFactor = 0.8 + (musicContext.danceability * 0.4); // Simplified danceability
      }
    } else {
      // Full musical consciousness calculations (original behavior)
      tempoFactor = this.calculateTempoFactor(musicContext.tempo);
      energyFactor = this.calculateEnergyFactor(musicContext.energy);
      danceabilityFactor = this.calculateDanceabilityFactor(musicContext.danceability);
      temperatureFactor = this.calculateTemperatureFactor(musicContext.emotionalTemperature);
      beatPhaseFactor = this.calculateBeatPhaseFactor(
        musicContext.beatPhase,
        musicContext.timeSinceLastBeat,
        musicContext.beatInterval
      );
    }

    // Combine factors for final half-life calculation
    let combinedFactor = tempoFactor * energyFactor * danceabilityFactor * temperatureFactor * beatPhaseFactor;

    // Apply performance multiplier if available
    if (performanceParams?.performanceMultiplier) {
      combinedFactor *= performanceParams.performanceMultiplier;
    }

    // Apply complexity reduction if needed
    if (performanceParams?.complexityReduction && performanceParams.complexityReduction > 0) {
      // Reduce factor variation to make calculations more predictable
      const neutralFactor = 1.0;
      const reducedVariation = 1.0 - performanceParams.complexityReduction;
      combinedFactor = neutralFactor + ((combinedFactor - neutralFactor) * reducedVariation);
    }

    const finalHalfLife = baseHalf * combinedFactor;

    // Calculate attack and decay multipliers (with performance considerations)
    let attackMultiplier: number;
    let decayMultiplier: number;

    if (usePerformanceOptimizations && performanceParams?.useSimplifiedCalculations) {
      // Simplified attack/decay for performance
      attackMultiplier = musicContext.energy < 0.5 ? 1.2 : 0.8;
      decayMultiplier = musicContext.valence > 0.5 ? 1.3 : 1.0;
    } else {
      // Full attack/decay calculations
      attackMultiplier = this.calculateAttackMultiplier(musicContext.energy, musicContext.beatPhase);
      decayMultiplier = this.calculateDecayMultiplier(musicContext.energy, musicContext.valence);
    }

    // Calculate fluidity factor for organic movement
    const fluidityFactor = this.calculateFluidityFactor(musicContext.danceability, musicContext.emotionalTemperature);

    // Calculate overall consciousness level
    const consciousnessLevel = this.calculateConsciousnessLevel(musicContext);

    const result: MusicalLerpResult = {
      halfLife: Math.max(0.01, Math.min(2.0, finalHalfLife)), // Clamp to reasonable bounds
      attackMultiplier,
      decayMultiplier,
      fluidityFactor,
      consciousnessLevel,
      performanceOptimized
    };

    if (this.debugMode) {
      result.debugInfo = {
        tempoFactor,
        energyFactor,
        danceabilityFactor,
        temperatureFactor,
        beatPhaseFactor
      };

      // Add performance debug info only if available
      if (performanceParams?.performanceMultiplier !== undefined) {
        result.debugInfo.performanceMultiplier = performanceParams.performanceMultiplier;
      }
      if (performanceParams?.complexityReduction !== undefined) {
        result.debugInfo.complexityReduction = performanceParams.complexityReduction;
      }

      const processingTime = performance.now() - startTime;
      if (processingTime > 0.5) { // Log if calculation takes >0.5ms
        console.log(`🎵 [MusicalLerpOrchestrator] Calculation time: ${processingTime.toFixed(3)}ms (performance-optimized: ${performanceOptimized})`);
      }
    }

    return result;
  }

  /**
   * Calculate tempo influence on LERP responsiveness
   * Faster tempo = snappier response, slower tempo = flowing movement
   */
  private calculateTempoFactor(tempo: number): number {
    const { reference, minFactor, maxFactor, curve } = this.modulationConfig.tempo;
    const normalizedTempo = tempo / reference;
    const factor = Math.pow(normalizedTempo, curve);
    return Math.max(minFactor, Math.min(maxFactor, factor));
  }

  /**
   * Calculate energy influence on attack and decay characteristics
   * High energy = aggressive smoothing, low energy = gentle smoothing
   */
  private calculateEnergyFactor(energy: number): number {
    const { baseline } = this.modulationConfig.energy;
    // Energy affects overall responsiveness
    return baseline + (energy * 0.3); // 1.0 to 1.3 range
  }

  /**
   * Calculate danceability influence on organic fluidity
   * High danceability = organic fluid transitions, low = structured
   */
  private calculateDanceabilityFactor(danceability: number): number {
    const { fluidityMin, fluidityMax } = this.modulationConfig.danceability;
    return fluidityMin + (danceability * (fluidityMax - fluidityMin));
  }

  /**
   * Calculate emotional temperature influence on movement style
   * Warm temperatures = flowing, cool temperatures = crystalline precise
   */
  private calculateTemperatureFactor(emotionalTemperature: number): number {
    const { neutral, range, warmthInfluence } = this.modulationConfig.temperature;
    const temperatureRange = (emotionalTemperature - neutral) / range; // -0.25 to 1.0
    return 1.0 + (temperatureRange * warmthInfluence);
  }

  /**
   * Calculate beat phase influence for rhythmic consciousness
   * Different smoothing based on beat timing phases
   */
  private calculateBeatPhaseFactor(
    beatPhase: MusicalContext['beatPhase'],
    timeSinceLastBeat: number,
    beatInterval: number
  ): number {
    const phaseConfig = this.beatPhaseConfig[beatPhase];
    
    // Calculate precise position within beat cycle
    const beatPosition = Math.min(1.0, timeSinceLastBeat / beatInterval);
    
    // Apply phase-specific multiplier with smooth transitions
    let phaseFactor = phaseConfig.baseMultiplier;
    
    // Add smooth transitions between phases
    if (beatPhase === 'attack' && beatPosition > 0.10) {
      // Smooth transition out of attack phase
      const transitionFactor = (0.15 - beatPosition) / 0.05;
      phaseFactor = phaseConfig.baseMultiplier + (1.0 - phaseConfig.baseMultiplier) * (1 - transitionFactor);
    }
    
    return phaseFactor;
  }

  /**
   * Calculate attack multiplier based on energy and beat phase
   */
  private calculateAttackMultiplier(energy: number, beatPhase: MusicalContext['beatPhase']): number {
    const { attackRange, baseline } = this.modulationConfig.energy;
    let baseAttack = baseline - (energy * attackRange); // High energy = faster attack (lower multiplier)
    
    // Beat phase influences attack speed
    if (beatPhase === 'attack') {
      baseAttack *= 0.5; // Ultra-fast attack during beat attack phase
    }
    
    return Math.max(0.1, baseAttack);
  }

  /**
   * Calculate decay multiplier based on energy and emotional valence
   */
  private calculateDecayMultiplier(energy: number, valence: number): number {
    const { decayRange, baseline } = this.modulationConfig.energy;
    let baseDecay = baseline + (energy * decayRange); // High energy = slower decay (sustain effect)
    
    // Positive valence extends sustain for beautiful moments
    baseDecay += (valence * 0.3);
    
    return Math.max(0.8, Math.min(2.0, baseDecay));
  }

  /**
   * Calculate fluidity factor for organic movement quality
   */
  private calculateFluidityFactor(danceability: number, emotionalTemperature: number): number {
    const { fluidityMin, fluidityMax, organicThreshold } = this.modulationConfig.danceability;
    const { neutral, range } = this.modulationConfig.temperature;
    
    // Base fluidity from danceability
    let fluidity = fluidityMin + (danceability * (fluidityMax - fluidityMin));
    
    // Temperature modulation (warm = more fluid, cool = more structured)
    const temperatureNorm = (emotionalTemperature - neutral) / range;
    fluidity += temperatureNorm * 0.2;
    
    return Math.max(0.3, Math.min(1.2, fluidity));
  }

  /**
   * Calculate overall consciousness level for system-wide awareness
   */
  private calculateConsciousnessLevel(musicContext: MusicalContext): number {
    const { energy, valence, danceability, beatConfidence } = musicContext;
    
    // Combine factors for overall consciousness awareness
    const energyContribution = energy * 0.3;
    const valenceContribution = valence * 0.2;
    const danceabilityContribution = danceability * 0.25;
    const confidenceContribution = beatConfidence * 0.25;
    
    return Math.max(0.1, Math.min(1.0, 
      energyContribution + valenceContribution + danceabilityContribution + confidenceContribution
    ));
  }

  /**
   * Get current beat phase based on timing
   */
  public getCurrentBeatPhase(timeSinceLastBeat: number, beatInterval: number): MusicalContext['beatPhase'] {
    const beatPosition = Math.min(1.0, timeSinceLastBeat / beatInterval);
    
    if (beatPosition <= 0.15) return 'attack';
    if (beatPosition <= 0.50) return 'sustain';
    if (beatPosition <= 0.85) return 'decay';
    return 'rest';
  }

  /**
   * Create musical context from MusicSyncService data
   */
  public createMusicalContext(
    musicSyncService: MusicSyncService,
    lastBeatTime: number = 0
  ): MusicalContext | null {
    const musicState = musicSyncService.getCurrentMusicState();
    if (!musicState) return null;

    const { emotion, beat, intensity } = musicState;
    const now = Date.now();
    const timeSinceLastBeat = now - lastBeatTime;
    const beatInterval = beat?.tempo ? (60000 / beat.tempo) : 500; // Default 120 BPM
    
    return {
      tempo: beat?.tempo || 120,
      energy: beat?.energy || intensity || 0.5,
      valence: emotion?.valence || 0.5,
      danceability: emotion?.danceability || 0.5,
      emotionalTemperature: emotion?.temperature || 4000,
      beatPhase: this.getCurrentBeatPhase(timeSinceLastBeat, beatInterval),
      beatConfidence: beat?.confidence || 0.5,
      beatInterval,
      timeSinceLastBeat
    };
  }

  /**
   * Enable or disable debug mode
   */
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Get current configuration for inspection
   */
  public getConfiguration() {
    return {
      baseHalfLifeValues: { ...this.baseHalfLifeValues },
      beatPhaseConfig: { ...this.beatPhaseConfig },
      modulationConfig: { ...this.modulationConfig }
    };
  }
}

// Singleton instance for global access
export const musicalLerpOrchestrator = new MusicalLerpOrchestrator(false);