/**
 * GradientDirectionalFlowSystem - Music-Responsive Gradient Flow Architecture
 * Part of the Year 3000 System audio pipeline
 * 
 * Handles real-time music sync for gradient directional flow patterns
 * - Beat-driven flow direction changes
 * - Genre-aware flow patterns (electronic = sharp, ambient = smooth)
 * - Spectral analysis for bass/treble flow differentiation
 * - Performance-optimized with event-driven updates
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { 
  Year3000Config
} from "@/types/models";

// Local interfaces for this system
interface AudioAnalysisData {
  energy: number;
  valence: number;
  tempo: number;
  loudness: number;
  danceability: number;
}

interface GenreClassification {
  genre: string;
  confidence: number;
  subgenres: string[];
}

interface SpectralAnalysisData {
  frequencies: number[];
  amplitudes: number[];
  dominantFrequency: number;
  bassEnergy: number;
  midEnergy: number;
  trebleEnergy: number;
  harmonicContent: number;
}
import { BaseVisualSystem } from "../visual/base/BaseVisualSystem";

interface FlowDirectionVector {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

interface GenreFlowPatterns {
  electronic: FlowDirectionVector;
  ambient: FlowDirectionVector;
  rock: FlowDirectionVector;
  pop: FlowDirectionVector;
  jazz: FlowDirectionVector;
  classical: FlowDirectionVector;
  default: FlowDirectionVector;
}

interface SpectralFlowMapping {
  bassFlow: FlowDirectionVector;
  midFlow: FlowDirectionVector;
  trebleFlow: FlowDirectionVector;
  harmonyFlow: FlowDirectionVector;
}

interface FlowSettings {
  enabled: boolean;
  flowSensitivity: number;
  beatResponseStrength: number;
  genreAdaptation: boolean;
  spectralSeparation: boolean;
  smoothingFactor: number;
  maxFlowIntensity: number;
}

/**
 * GradientDirectionalFlowSystem manages music-responsive gradient flow patterns
 * - Real-time beat analysis for flow direction
 * - Genre-specific flow characteristics
 * - Spectral frequency mapping to flow vectors
 * - Performance-optimized event-driven updates
 */
export class GradientDirectionalFlowSystem extends BaseVisualSystem {
  private flowSettings: FlowSettings;
  private currentFlowVector: FlowDirectionVector;
  private genreFlowPatterns: GenreFlowPatterns;
  private spectralFlowMapping: SpectralFlowMapping;
  
  private cssConsciousnessController: UnifiedCSSConsciousnessController | null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  
  private lastBeatTime = 0;
  private lastFlowUpdate = 0;
  private flowSmoothingBuffer: FlowDirectionVector[] = [];
  private currentGenre: GenreClassification | null = null;
  
  private boundBeatHandler: ((event: Event) => void) | null = null;
  private boundGenreHandler: ((event: Event) => void) | null = null;
  private boundSpectralHandler: ((event: Event) => void) | null = null;
  private boundEnergyHandler: ((event: Event) => void) | null = null;
  
  private updateThrottleInterval = 1000 / 30; // 30 FPS for smooth flow
  
  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    this.colorHarmonyEngine = null; // Initialize as null, will be set later
    // Initialize CSS Consciousness Controller if available
    const cssController = UnifiedCSSConsciousnessController.getInstance();
    if (cssController) {
      this.cssConsciousnessController = cssController;
    } else {
      Y3K?.debug?.warn("GradientDirectionalFlowSystem", "UnifiedCSSConsciousnessController not available, CSS consciousness disabled");
      this.cssConsciousnessController = null;
    }
    
    // Initialize flow settings
    this.flowSettings = {
      enabled: true,
      flowSensitivity: 0.8,
      beatResponseStrength: 0.9,
      genreAdaptation: true,
      spectralSeparation: true,
      smoothingFactor: 0.7,
      maxFlowIntensity: 1.0
    };
    
    // Initialize current flow vector
    this.currentFlowVector = {
      x: 0,
      y: 0,
      intensity: 0,
      timestamp: performance.now()
    };
    
    // Initialize genre flow patterns
    this.genreFlowPatterns = {
      electronic: { x: 1.0, y: 0.2, intensity: 0.9, timestamp: 0 },
      ambient: { x: 0.3, y: 0.8, intensity: 0.4, timestamp: 0 },
      rock: { x: 0.7, y: 0.5, intensity: 0.8, timestamp: 0 },
      pop: { x: 0.6, y: 0.6, intensity: 0.7, timestamp: 0 },
      jazz: { x: 0.4, y: 0.7, intensity: 0.6, timestamp: 0 },
      classical: { x: 0.2, y: 0.9, intensity: 0.5, timestamp: 0 },
      default: { x: 0.5, y: 0.5, intensity: 0.6, timestamp: 0 }
    };
    
    // Initialize spectral flow mapping
    this.spectralFlowMapping = {
      bassFlow: { x: 0.8, y: 0.2, intensity: 0.7, timestamp: 0 },
      midFlow: { x: 0.5, y: 0.6, intensity: 0.6, timestamp: 0 },
      trebleFlow: { x: 0.3, y: 0.9, intensity: 0.5, timestamp: 0 },
      harmonyFlow: { x: 0.6, y: 0.4, intensity: 0.8, timestamp: 0 }
    };
    
    // Bind event handlers
    this.boundBeatHandler = this.handleBeatEvent.bind(this);
    this.boundGenreHandler = this.handleGenreChange.bind(this);
    this.boundSpectralHandler = this.handleSpectralAnalysis.bind(this);
    this.boundEnergyHandler = this.handleEnergyChange.bind(this);
    
    // Initialize smoothing buffer
    this.flowSmoothingBuffer = Array(5).fill(null).map(() => ({ ...this.currentFlowVector }));
  }
  
  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    this.subscribeToMusicEvents();
    this.startFlowUpdates();
    
    Y3K?.debug?.log("GradientDirectionalFlowSystem", "Gradient flow system initialized");
  }
  
  private subscribeToMusicEvents(): void {
    if (this.boundBeatHandler) {
      document.addEventListener('music-sync:beat', this.boundBeatHandler);
    }
    
    if (this.boundGenreHandler) {
      document.addEventListener('music-sync:genre-detected', this.boundGenreHandler);
    }
    
    if (this.boundSpectralHandler) {
      document.addEventListener('music-sync:spectral-analysis', this.boundSpectralHandler);
    }
    
    if (this.boundEnergyHandler) {
      document.addEventListener('music-sync:energy-changed', this.boundEnergyHandler);
    }
  }
  
  private handleBeatEvent(event: Event): void {
    const currentTime = performance.now();
    
    // Throttle beat processing to prevent overload
    if (currentTime - this.lastBeatTime < 50) return;
    this.lastBeatTime = currentTime;
    
    const customEvent = event as CustomEvent;
    const { intensity, bpm, confidence } = customEvent.detail;
    
    // Calculate beat-driven flow direction
    const beatFlowVector = this.calculateBeatFlow(intensity, bpm, confidence);
    
    // Apply genre-specific modifications
    const genreModifiedFlow = this.applyGenreModifications(beatFlowVector);
    
    // Update flow vector with smoothing
    this.updateFlowVector(genreModifiedFlow);
    
    Y3K?.debug?.log("GradientDirectionalFlowSystem", `Beat flow: ${beatFlowVector.x.toFixed(2)}, ${beatFlowVector.y.toFixed(2)}, intensity: ${beatFlowVector.intensity.toFixed(2)}`);
  }
  
  private handleGenreChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { genre, confidence } = customEvent.detail;
    
    this.currentGenre = genre;
    
    // Update genre flow patterns based on detection
    if (this.flowSettings.genreAdaptation && confidence > 0.7) {
      this.adaptFlowToGenre(genre);
    }
    
    Y3K?.debug?.log("GradientDirectionalFlowSystem", `Genre flow adaptation: ${genre} (confidence: ${confidence.toFixed(2)})`);
  }
  
  private handleSpectralAnalysis(event: Event): void {
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail as SpectralAnalysisData;
    
    if (!this.flowSettings.spectralSeparation) return;
    
    // Map spectral frequencies to flow vectors
    const spectralFlow = this.mapSpectralToFlow(spectralData);
    
    // Blend spectral flow with current flow
    const blendedFlow = this.blendSpectralFlow(spectralFlow);
    
    // Update flow vector
    this.updateFlowVector(blendedFlow);
  }
  
  private handleEnergyChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { energy, valence } = customEvent.detail;
    
    // Modulate flow intensity based on energy
    const energyModulation = energy * this.flowSettings.flowSensitivity;
    const valenceModulation = valence * 0.5;
    
    // Update flow intensity
    this.currentFlowVector.intensity = Math.min(
      this.flowSettings.maxFlowIntensity,
      energyModulation + valenceModulation
    );
  }
  
  private calculateBeatFlow(intensity: number, bpm: number, confidence: number): FlowDirectionVector {
    // Calculate flow direction based on beat characteristics
    const beatPhase = (performance.now() / 1000) * (bpm / 60);
    const flowAngle = beatPhase * Math.PI * 2;
    
    // Intensity affects flow magnitude
    const flowMagnitude = intensity * this.flowSettings.beatResponseStrength * confidence;
    
    // Convert to directional vector
    const flowX = Math.cos(flowAngle) * flowMagnitude;
    const flowY = Math.sin(flowAngle) * flowMagnitude;
    
    return {
      x: flowX,
      y: flowY,
      intensity: flowMagnitude,
      timestamp: performance.now()
    };
  }
  
  private applyGenreModifications(flowVector: FlowDirectionVector): FlowDirectionVector {
    if (!this.flowSettings.genreAdaptation || !this.currentGenre) {
      return flowVector;
    }
    
    // Get genre-specific flow pattern
    const genrePattern = this.genreFlowPatterns[this.currentGenre.genre as keyof GenreFlowPatterns] || 
                        this.genreFlowPatterns.default;
    
    // Blend beat flow with genre characteristics
    const blendFactor = 0.3; // 30% genre influence
    
    return {
      x: flowVector.x * (1 - blendFactor) + genrePattern.x * blendFactor,
      y: flowVector.y * (1 - blendFactor) + genrePattern.y * blendFactor,
      intensity: flowVector.intensity * (1 - blendFactor) + genrePattern.intensity * blendFactor,
      timestamp: performance.now()
    };
  }
  
  private mapSpectralToFlow(spectralData: SpectralAnalysisData): SpectralFlowMapping {
    const { bassEnergy, midEnergy, trebleEnergy, harmonicContent } = spectralData;
    
    // Map bass frequencies to horizontal flow
    this.spectralFlowMapping.bassFlow = {
      x: bassEnergy * 0.8,
      y: bassEnergy * 0.2,
      intensity: bassEnergy,
      timestamp: performance.now()
    };
    
    // Map mid frequencies to diagonal flow
    this.spectralFlowMapping.midFlow = {
      x: midEnergy * 0.6,
      y: midEnergy * 0.6,
      intensity: midEnergy,
      timestamp: performance.now()
    };
    
    // Map treble frequencies to vertical flow
    this.spectralFlowMapping.trebleFlow = {
      x: trebleEnergy * 0.2,
      y: trebleEnergy * 0.8,
      intensity: trebleEnergy,
      timestamp: performance.now()
    };
    
    // Map harmonics to complex flow patterns
    this.spectralFlowMapping.harmonyFlow = {
      x: harmonicContent * 0.5,
      y: harmonicContent * 0.7,
      intensity: harmonicContent,
      timestamp: performance.now()
    };
    
    return this.spectralFlowMapping;
  }
  
  private blendSpectralFlow(spectralFlow: SpectralFlowMapping): FlowDirectionVector {
    // Weighted blend of spectral components
    const weights = { bass: 0.4, mid: 0.3, treble: 0.2, harmony: 0.1 };
    
    const blendedX = 
      spectralFlow.bassFlow.x * weights.bass +
      spectralFlow.midFlow.x * weights.mid +
      spectralFlow.trebleFlow.x * weights.treble +
      spectralFlow.harmonyFlow.x * weights.harmony;
    
    const blendedY = 
      spectralFlow.bassFlow.y * weights.bass +
      spectralFlow.midFlow.y * weights.mid +
      spectralFlow.trebleFlow.y * weights.treble +
      spectralFlow.harmonyFlow.y * weights.harmony;
    
    const blendedIntensity = 
      spectralFlow.bassFlow.intensity * weights.bass +
      spectralFlow.midFlow.intensity * weights.mid +
      spectralFlow.trebleFlow.intensity * weights.treble +
      spectralFlow.harmonyFlow.intensity * weights.harmony;
    
    return {
      x: blendedX,
      y: blendedY,
      intensity: blendedIntensity,
      timestamp: performance.now()
    };
  }
  
  private updateFlowVector(newFlow: FlowDirectionVector): void {
    // Add to smoothing buffer
    this.flowSmoothingBuffer.push(newFlow);
    if (this.flowSmoothingBuffer.length > 5) {
      this.flowSmoothingBuffer.shift();
    }
    
    // Calculate smoothed flow
    const smoothedFlow = this.calculateSmoothedFlow();
    
    // Update current flow vector
    this.currentFlowVector = smoothedFlow;
    
    // Update CSS variables for gradient systems
    this.updateCSSVariables();
  }
  
  private calculateSmoothedFlow(): FlowDirectionVector {
    const buffer = this.flowSmoothingBuffer;
    const smoothingFactor = this.flowSettings.smoothingFactor;
    
    // Exponential smoothing
    let smoothedX = buffer[0]?.x || 0;
    let smoothedY = buffer[0]?.y || 0;
    let smoothedIntensity = buffer[0]?.intensity || 0;
    
    for (let i = 1; i < buffer.length; i++) {
      smoothedX = smoothedX * smoothingFactor + buffer[i]!.x * (1 - smoothingFactor);
      smoothedY = smoothedY * smoothingFactor + buffer[i]!.y * (1 - smoothingFactor);
      smoothedIntensity = smoothedIntensity * smoothingFactor + buffer[i]!.intensity * (1 - smoothingFactor);
    }
    
    return {
      x: smoothedX,
      y: smoothedY,
      intensity: smoothedIntensity,
      timestamp: performance.now()
    };
  }
  
  private updateCSSVariables(): void {
    const currentTime = performance.now();
    
    // Throttle CSS updates to 30 FPS
    if (currentTime - this.lastFlowUpdate < this.updateThrottleInterval) return;
    this.lastFlowUpdate = currentTime;
    
    // Update flow direction CSS variables (if controller is available)
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-direction-x',
        this.currentFlowVector.x.toFixed(3)
      );
      
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-direction-y',
        this.currentFlowVector.y.toFixed(3)
      );
      
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-intensity',
        this.currentFlowVector.intensity.toFixed(3)
      );
      
      // Update flow strength for WebGL systems
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-strength',
        (this.currentFlowVector.intensity * 0.8).toFixed(3)
      );
      
      // Update flow angle for CSS transforms
      const flowAngle = Math.atan2(this.currentFlowVector.y, this.currentFlowVector.x);
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-angle',
        `${(flowAngle * 180 / Math.PI).toFixed(1)}deg`
      );
    }
  }
  
  private adaptFlowToGenre(genre: GenreClassification): void {
    // Update genre-specific flow patterns
    const genrePattern = this.genreFlowPatterns[genre.genre as keyof GenreFlowPatterns] || 
                        this.genreFlowPatterns.default;
    
    // Emit genre flow adaptation event
    document.dispatchEvent(new CustomEvent('gradient-flow:genre-adapted', {
      detail: {
        genre,
        flowPattern: genrePattern,
        timestamp: performance.now()
      }
    }));
  }
  
  private startFlowUpdates(): void {
    const updateFlow = () => {
      if (!this.isActive) return;
      
      // Update flow animation phase
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFlowUpdate;
      
      // Animate flow patterns
      this.animateFlowPatterns(deltaTime);
      
      // Continue updates
      setTimeout(updateFlow, this.updateThrottleInterval);
    };
    
    updateFlow();
  }
  
  private animateFlowPatterns(deltaTime: number): void {
    // Add subtle animation to flow patterns
    const animationPhase = (performance.now() / 1000) * 0.1;
    
    // Animate flow direction with subtle circular motion
    const baseX = this.currentFlowVector.x;
    const baseY = this.currentFlowVector.y;
    
    const animatedX = baseX + Math.sin(animationPhase) * 0.05;
    const animatedY = baseY + Math.cos(animationPhase) * 0.05;
    
    // Update CSS variables with animation (if controller is available)
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-animated-x',
        animatedX.toFixed(3)
      );
      
      this.cssConsciousnessController.queueCSSVariableUpdate(
        '--sn-flow-animated-y',
        animatedY.toFixed(3)
      );
    }
  }
  
  public override updateAnimation(deltaTime: number): void {
    // Update flow animations
    this.animateFlowPatterns(deltaTime);
  }
  
  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    const isHealthy = this.flowSettings.enabled && 
                     this.currentFlowVector.timestamp > 0 &&
                     this.musicSyncService !== null;
    
    return {
      ok: isHealthy,
      details: isHealthy ? "Gradient flow system operational" : "Flow system inactive"
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Remove event listeners
    if (this.boundBeatHandler) {
      document.removeEventListener('music-sync:beat', this.boundBeatHandler);
    }
    
    if (this.boundGenreHandler) {
      document.removeEventListener('music-sync:genre-detected', this.boundGenreHandler);
    }
    
    if (this.boundSpectralHandler) {
      document.removeEventListener('music-sync:spectral-analysis', this.boundSpectralHandler);
    }
    
    if (this.boundEnergyHandler) {
      document.removeEventListener('music-sync:energy-changed', this.boundEnergyHandler);
    }
    
    // Clear event handlers
    this.boundBeatHandler = null;
    this.boundGenreHandler = null;
    this.boundSpectralHandler = null;
    this.boundEnergyHandler = null;
  }
  
  // Public API for flow control
  public setFlowSensitivity(sensitivity: number): void {
    this.flowSettings.flowSensitivity = Math.max(0, Math.min(1, sensitivity));
  }
  
  public setBeatResponseStrength(strength: number): void {
    this.flowSettings.beatResponseStrength = Math.max(0, Math.min(1, strength));
  }
  
  public setGenreAdaptation(enabled: boolean): void {
    this.flowSettings.genreAdaptation = enabled;
  }
  
  public setSpectralSeparation(enabled: boolean): void {
    this.flowSettings.spectralSeparation = enabled;
  }
  
  public getCurrentFlowVector(): FlowDirectionVector {
    return { ...this.currentFlowVector };
  }
  
  public getFlowSettings(): FlowSettings {
    return { ...this.flowSettings };
  }
  
  public getGenreFlowPatterns(): GenreFlowPatterns {
    return { ...this.genreFlowPatterns };
  }
}