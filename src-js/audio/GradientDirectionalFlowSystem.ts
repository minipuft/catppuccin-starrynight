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
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { OptimizedCSSVariableManager } from "@/core/performance/OptimizedCSSVariableManager";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import { BaseVisualSystem } from "../visual/base/BaseVisualSystem";

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

interface FlowDirectionVector {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
}

interface RadialFlowVector {
  angle: number; // Radial angle in radians
  radius: number; // Distance from center (0-1)
  intensity: number;
  inwardFlow: number; // Inward flow strength (0-1, for corridor effects)
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
  // Corridor-specific settings
  corridorFlowEnabled: boolean;
  radialFlowStrength: number;
  inwardFlowIntensity: number;
  corridorBeatResponse: number;
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
  private currentRadialFlow: RadialFlowVector;
  private genreFlowPatterns: GenreFlowPatterns;
  private spectralFlowMapping: SpectralFlowMapping;

  private cssVariableController: OptimizedCSSVariableManager | null;
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
    config: Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
  ) {
    super(config, utils, performanceMonitor, musicSyncService);

    this.colorHarmonyEngine = null; // Initialize as null, will be set later
    // Initialize CSS Consciousness Controller if available
    const cssController = OptimizedCSSVariableManager.getGlobalInstance();
    if (cssController) {
      this.cssVariableController = cssController;
    } else {
      Y3KDebug?.debug?.warn(
        "GradientDirectionalFlowSystem",
        "OptimizedCSSVariableManager not available, CSS integration disabled"
      );
      this.cssVariableController = null;
    }

    // Initialize flow settings
    this.flowSettings = {
      enabled: true,
      flowSensitivity: 0.8,
      beatResponseStrength: 0.9,
      genreAdaptation: true,
      spectralSeparation: true,
      smoothingFactor: 0.7,
      maxFlowIntensity: 1.0,
      // Corridor-specific settings
      corridorFlowEnabled: true, // Enable corridor flow for dual-layer effect
      radialFlowStrength: 0.8,
      inwardFlowIntensity: 0.7, // Slightly increased for better corridor visibility
      corridorBeatResponse: 1.3, // Enhanced beat response for corridor effects
    };

    // Initialize current flow vector
    this.currentFlowVector = {
      x: 0,
      y: 0,
      intensity: 0,
      timestamp: performance.now(),
    };

    // Initialize radial flow vector for corridor effects
    this.currentRadialFlow = {
      angle: 0,
      radius: 0.5,
      intensity: 0,
      inwardFlow: 0,
      timestamp: performance.now(),
    };

    // Initialize genre flow patterns
    this.genreFlowPatterns = {
      electronic: { x: 1.0, y: 0.2, intensity: 0.9, timestamp: 0 },
      ambient: { x: 0.3, y: 0.8, intensity: 0.4, timestamp: 0 },
      rock: { x: 0.7, y: 0.5, intensity: 0.8, timestamp: 0 },
      pop: { x: 0.6, y: 0.6, intensity: 0.7, timestamp: 0 },
      jazz: { x: 0.4, y: 0.7, intensity: 0.6, timestamp: 0 },
      classical: { x: 0.2, y: 0.9, intensity: 0.5, timestamp: 0 },
      default: { x: 0.5, y: 0.5, intensity: 0.6, timestamp: 0 },
    };

    // Initialize spectral flow mapping
    this.spectralFlowMapping = {
      bassFlow: { x: 0.8, y: 0.2, intensity: 0.7, timestamp: 0 },
      midFlow: { x: 0.5, y: 0.6, intensity: 0.6, timestamp: 0 },
      trebleFlow: { x: 0.3, y: 0.9, intensity: 0.5, timestamp: 0 },
      harmonyFlow: { x: 0.6, y: 0.4, intensity: 0.8, timestamp: 0 },
    };

    // Bind event handlers
    this.boundBeatHandler = this.handleBeatEvent.bind(this);
    this.boundGenreHandler = this.handleGenreChange.bind(this);
    this.boundSpectralHandler = this.handleSpectralAnalysis.bind(this);
    this.boundEnergyHandler = this.handleEnergyChange.bind(this);

    // Initialize smoothing buffer
    this.flowSmoothingBuffer = Array(5)
      .fill(null)
      .map(() => ({ ...this.currentFlowVector }));
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    this.subscribeToMusicEvents();
    this.startFlowUpdates();

    Y3KDebug?.debug?.log(
      "GradientDirectionalFlowSystem",
      "Gradient flow system initialized"
    );
  }

  private subscribeToMusicEvents(): void {
    if (this.boundBeatHandler) {
      document.addEventListener("music-sync:beat", this.boundBeatHandler);
    }

    if (this.boundGenreHandler) {
      document.addEventListener(
        "music-sync:genre-detected",
        this.boundGenreHandler
      );
    }

    if (this.boundSpectralHandler) {
      document.addEventListener(
        "music-sync:spectral-analysis",
        this.boundSpectralHandler
      );
    }

    if (this.boundEnergyHandler) {
      document.addEventListener(
        "music-sync:energy-changed",
        this.boundEnergyHandler
      );
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

    Y3KDebug?.debug?.log(
      "GradientDirectionalFlowSystem",
      `Beat flow: ${beatFlowVector.x.toFixed(2)}, ${beatFlowVector.y.toFixed(
        2
      )}, intensity: ${beatFlowVector.intensity.toFixed(2)}`
    );
  }

  private handleGenreChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { genre, confidence } = customEvent.detail;

    this.currentGenre = genre;

    // Update genre flow patterns based on detection
    if (this.flowSettings.genreAdaptation && confidence > 0.7) {
      this.adaptFlowToGenre(genre);
    }

    Y3KDebug?.debug?.log(
      "GradientDirectionalFlowSystem",
      `Genre flow adaptation: ${genre} (confidence: ${confidence.toFixed(2)})`
    );
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

  private calculateBeatFlow(
    intensity: number,
    bpm: number,
    confidence: number
  ): FlowDirectionVector {
    // Calculate flow direction based on beat characteristics
    const beatPhase = (performance.now() / 1000) * (bpm / 60);
    const flowAngle = beatPhase * Math.PI * 2;

    // Intensity affects flow magnitude
    const flowMagnitude =
      intensity * this.flowSettings.beatResponseStrength * confidence;

    // Convert to directional vector
    const flowX = Math.cos(flowAngle) * flowMagnitude;
    const flowY = Math.sin(flowAngle) * flowMagnitude;

    return {
      x: flowX,
      y: flowY,
      intensity: flowMagnitude,
      timestamp: performance.now(),
    };
  }

  private applyGenreModifications(
    flowVector: FlowDirectionVector
  ): FlowDirectionVector {
    if (!this.flowSettings.genreAdaptation || !this.currentGenre) {
      return flowVector;
    }

    // Get genre-specific flow pattern
    const genrePattern =
      this.genreFlowPatterns[
        this.currentGenre.genre as keyof GenreFlowPatterns
      ] || this.genreFlowPatterns.default;

    // Blend beat flow with genre characteristics
    const blendFactor = 0.3; // 30% genre influence

    return {
      x: flowVector.x * (1 - blendFactor) + genrePattern.x * blendFactor,
      y: flowVector.y * (1 - blendFactor) + genrePattern.y * blendFactor,
      intensity:
        flowVector.intensity * (1 - blendFactor) +
        genrePattern.intensity * blendFactor,
      timestamp: performance.now(),
    };
  }

  private mapSpectralToFlow(
    spectralData: SpectralAnalysisData
  ): SpectralFlowMapping {
    const { bassEnergy, midEnergy, trebleEnergy, harmonicContent } =
      spectralData;

    // Map bass frequencies to horizontal flow
    this.spectralFlowMapping.bassFlow = {
      x: bassEnergy * 0.8,
      y: bassEnergy * 0.2,
      intensity: bassEnergy,
      timestamp: performance.now(),
    };

    // Map mid frequencies to diagonal flow
    this.spectralFlowMapping.midFlow = {
      x: midEnergy * 0.6,
      y: midEnergy * 0.6,
      intensity: midEnergy,
      timestamp: performance.now(),
    };

    // Map treble frequencies to vertical flow
    this.spectralFlowMapping.trebleFlow = {
      x: trebleEnergy * 0.2,
      y: trebleEnergy * 0.8,
      intensity: trebleEnergy,
      timestamp: performance.now(),
    };

    // Map harmonics to complex flow patterns
    this.spectralFlowMapping.harmonyFlow = {
      x: harmonicContent * 0.5,
      y: harmonicContent * 0.7,
      intensity: harmonicContent,
      timestamp: performance.now(),
    };

    return this.spectralFlowMapping;
  }

  private blendSpectralFlow(
    spectralFlow: SpectralFlowMapping
  ): FlowDirectionVector {
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
      timestamp: performance.now(),
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

    // Calculate radial flow for corridor effects
    if (this.flowSettings.corridorFlowEnabled) {
      this.updateRadialFlow(smoothedFlow);
    }

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
      smoothedX =
        smoothedX * smoothingFactor + buffer[i]!.x * (1 - smoothingFactor);
      smoothedY =
        smoothedY * smoothingFactor + buffer[i]!.y * (1 - smoothingFactor);
      smoothedIntensity =
        smoothedIntensity * smoothingFactor +
        buffer[i]!.intensity * (1 - smoothingFactor);
    }

    return {
      x: smoothedX,
      y: smoothedY,
      intensity: smoothedIntensity,
      timestamp: performance.now(),
    };
  }

  private updateRadialFlow(linearFlow: FlowDirectionVector): void {
    // ===== TRUE INWARD FLOW CALCULATION =====
    // Instead of using linear flow direction, calculate true center-pointing vectors
    
    // For corridor effects, we want flow that points inward from all directions
    // This creates radial flow patterns that converge toward screen center
    const centerX = 0.5; // Screen center X (normalized coordinates)
    const centerY = 0.5; // Screen center Y (normalized coordinates)
    
    // Create radial sampling points around the center
    const currentTime = performance.now() / 1000;
    const rotationPhase = currentTime * 0.1; // Slow rotation for smooth movement
    
    // Calculate base angle from center outward (then invert for inward flow)
    const baseAngle = rotationPhase + (linearFlow.x * Math.PI * 2);
    
    // Create vectors that point toward center from various radial positions
    // This ensures inward flow regardless of starting position
    const inwardVectorX = -Math.cos(baseAngle); // Negative to point inward
    const inwardVectorY = -Math.sin(baseAngle); // Negative to point inward
    
    // Calculate distance from center for radial intensity
    const distanceFromCenter = Math.sqrt(
      (inwardVectorX * inwardVectorX) + (inwardVectorY * inwardVectorY)
    );
    
    // Normalize to ensure proper inward direction
    const normalizedInwardX = inwardVectorX / (distanceFromCenter || 1.0);
    const normalizedInwardY = inwardVectorY / (distanceFromCenter || 1.0);
    
    // Calculate inward flow strength based on beat and genre
    const baseInwardFlow = this.flowSettings.inwardFlowIntensity;
    const beatModifier = this.calculateBeatModifier();
    const genreModifier = this.calculateGenreInwardModifier();
    
    const inwardFlow = Math.min(1.0, 
      baseInwardFlow * beatModifier * genreModifier * this.flowSettings.corridorBeatResponse
    );

    // Update radial flow vector with true inward-pointing vectors
    this.currentRadialFlow = {
      angle: Math.atan2(normalizedInwardY, normalizedInwardX), // Angle of inward flow
      radius: Math.min(1.0, distanceFromCenter * this.flowSettings.radialFlowStrength),
      intensity: linearFlow.intensity,
      inwardFlow: inwardFlow,
      timestamp: performance.now(),
    };
    
    // ===== UPDATE INWARD VECTOR CSS VARIABLES =====
    // Provide true inward-pointing vectors for shader coordination
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-inward-vector-x",
        normalizedInwardX.toFixed(3)
      );
      
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-inward-vector-y", 
        normalizedInwardY.toFixed(3)
      );
      
      // Provide radial distance for corridor depth calculation
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-radial-distance",
        distanceFromCenter.toFixed(3)
      );
    }
  }

  private calculateBeatModifier(): number {
    // Get current music state for beat intensity
    if (!this.musicSyncService) return 1.0;
    
    const musicState = this.musicSyncService.getCurrentMusicState();
    if (!musicState) return 1.0;

    // Use beat energy as modifier, enhanced for recent beats
    const currentTime = performance.now();
    const timeSinceLastBeat = currentTime - this.lastBeatTime;
    const beatDecayTime = 500; // ms
    
    const beatDecay = Math.max(0, 1 - (timeSinceLastBeat / beatDecayTime));
    const beatEnergy = musicState.beat?.energy ?? 0.5;
    
    return 0.6 + (beatEnergy * 0.8) + (beatDecay * 0.4);
  }

  private calculateGenreInwardModifier(): number {
    if (!this.currentGenre) return 1.0;

    // Different genres have different inward flow characteristics
    const genreModifiers = {
      electronic: 1.2,    // Strong inward pull for electronic
      ambient: 0.8,       // Gentle for ambient
      rock: 1.0,          // Balanced for rock
      pop: 0.9,           // Slightly less for pop
      jazz: 0.7,          // Subtle for jazz
      classical: 0.6,     // Very subtle for classical
    };

    const genreKey = this.currentGenre.genre as keyof typeof genreModifiers;
    return genreModifiers[genreKey] ?? 1.0;
  }

  private updateCSSVariables(): void {
    const currentTime = performance.now();

    // Throttle CSS updates to 30 FPS
    if (currentTime - this.lastFlowUpdate < this.updateThrottleInterval) return;
    this.lastFlowUpdate = currentTime;

    // Update flow direction CSS variables (if controller is available)
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-direction-x",
        this.currentFlowVector.x.toFixed(3)
      );

      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-direction-y",
        this.currentFlowVector.y.toFixed(3)
      );

      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-intensity",
        this.currentFlowVector.intensity.toFixed(3)
      );

      // Update flow strength for WebGL systems
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-strength",
        (this.currentFlowVector.intensity * 0.8).toFixed(3)
      );

      // Update flow angle for CSS transforms
      const flowAngle = Math.atan2(
        this.currentFlowVector.y,
        this.currentFlowVector.x
      );
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-angle",
        `${((flowAngle * 180) / Math.PI).toFixed(1)}deg`
      );

      // Update corridor-specific flow variables
      if (this.flowSettings.corridorFlowEnabled) {
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-flow-angle",
          this.currentRadialFlow.angle.toFixed(3)
        );

        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-flow-radius",
          this.currentRadialFlow.radius.toFixed(3)
        );

        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-inward-flow",
          this.currentRadialFlow.inwardFlow.toFixed(3)
        );

        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-flow-intensity",
          this.currentRadialFlow.intensity.toFixed(3)
        );

        // Enable corridor flow for WebGL coordination
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-flow-enabled",
          "1"
        );
      } else {
        // Disable corridor flow
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-corridor-flow-enabled",
          "0"
        );
      }
    }
  }

  private adaptFlowToGenre(genre: GenreClassification): void {
    // Update genre-specific flow patterns
    const genrePattern =
      this.genreFlowPatterns[genre.genre as keyof GenreFlowPatterns] ||
      this.genreFlowPatterns.default;

    // Emit genre flow adaptation event
    document.dispatchEvent(
      new CustomEvent("gradient-flow:genre-adapted", {
        detail: {
          genre,
          flowPattern: genrePattern,
          timestamp: performance.now(),
        },
      })
    );
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
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-animated-x",
        animatedX.toFixed(3)
      );

      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-flow-animated-y",
        animatedY.toFixed(3)
      );
    }
  }

  public override updateAnimation(deltaTime: number): void {
    // Update flow animations
    this.animateFlowPatterns(deltaTime);
  }

  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy =
      this.flowSettings.enabled &&
      this.currentFlowVector.timestamp > 0 &&
      this.musicSyncService !== null;

    return {
      system: 'GradientDirectionalFlowSystem',
      healthy: isHealthy,
      metrics: {
        enabled: this.flowSettings.enabled,
        lastUpdateTime: this.currentFlowVector.timestamp,
        musicSyncConnected: !!this.musicSyncService,
        flowIntensity: this.currentFlowVector.intensity
      },
      issues: isHealthy ? [] : [
        ...(this.flowSettings.enabled ? [] : ['System disabled']),
        ...(this.currentFlowVector.timestamp > 0 ? [] : ['No flow updates']),
        ...(this.musicSyncService ? [] : ['Music sync disconnected'])
      ]
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Remove event listeners
    if (this.boundBeatHandler) {
      document.removeEventListener("music-sync:beat", this.boundBeatHandler);
    }

    if (this.boundGenreHandler) {
      document.removeEventListener(
        "music-sync:genre-detected",
        this.boundGenreHandler
      );
    }

    if (this.boundSpectralHandler) {
      document.removeEventListener(
        "music-sync:spectral-analysis",
        this.boundSpectralHandler
      );
    }

    if (this.boundEnergyHandler) {
      document.removeEventListener(
        "music-sync:energy-changed",
        this.boundEnergyHandler
      );
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

  // ========================================================================
  // PUBLIC CORRIDOR FLOW METHODS
  // ========================================================================

  /**
   * Enable or disable corridor flow effects
   * @param enabled Whether to enable corridor flow mapping
   */
  public setCorridorFlowEnabled(enabled: boolean): void {
    this.flowSettings.corridorFlowEnabled = enabled;
    
    // Update CSS variable for coordination with WebGL system
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-corridor-flow-enabled", 
        enabled ? "1" : "0"
      );
    }

    Y3KDebug?.debug?.log(
      "GradientDirectionalFlowSystem",
      `Corridor flow ${enabled ? 'enabled' : 'disabled'}`
    );
  }

  /**
   * Get current radial flow vector for corridor effects
   * @returns Current radial flow state
   */
  public getCurrentRadialFlow(): RadialFlowVector {
    return { ...this.currentRadialFlow };
  }

  /**
   * Update corridor flow settings
   * @param settings Partial corridor flow settings to update
   */
  public updateCorridorFlowSettings(settings: Partial<Pick<FlowSettings, 
    'radialFlowStrength' | 'inwardFlowIntensity' | 'corridorBeatResponse'>>): void {
    
    if (settings.radialFlowStrength !== undefined) {
      this.flowSettings.radialFlowStrength = Math.max(0.0, Math.min(2.0, settings.radialFlowStrength));
    }
    if (settings.inwardFlowIntensity !== undefined) {
      this.flowSettings.inwardFlowIntensity = Math.max(0.0, Math.min(1.0, settings.inwardFlowIntensity));
    }
    if (settings.corridorBeatResponse !== undefined) {
      this.flowSettings.corridorBeatResponse = Math.max(0.0, Math.min(3.0, settings.corridorBeatResponse));
    }

    Y3KDebug?.debug?.log(
      "GradientDirectionalFlowSystem",
      "Corridor flow settings updated", settings
    );
  }

  /**
   * Get corridor flow mapping for external systems
   * @returns Object containing both linear and radial flow data
   */
  public getCorridorFlowMapping(): {
    linearFlow: FlowDirectionVector;
    radialFlow: RadialFlowVector;
    enabled: boolean;
  } {
    return {
      linearFlow: { ...this.currentFlowVector },
      radialFlow: { ...this.currentRadialFlow },
      enabled: this.flowSettings.corridorFlowEnabled,
    };
  }

  /**
   * Calculate true inward vectors for any screen position
   * This method provides the mathematical foundation for corridor effects
   * by calculating vectors that point directly toward screen center from any position
   * 
   * @param screenX Normalized screen X coordinate (0.0 to 1.0)
   * @param screenY Normalized screen Y coordinate (0.0 to 1.0)
   * @returns Object containing inward vector components and distance from center
   */
  public calculateInwardVectorForPosition(screenX: number, screenY: number): {
    inwardX: number;
    inwardY: number;
    distanceFromCenter: number;
    flowIntensity: number;
  } {
    // Screen center coordinates (normalized)
    const centerX = 0.5;
    const centerY = 0.5;
    
    // Calculate vector from current position to center
    const deltaX = centerX - screenX;
    const deltaY = centerY - screenY;
    
    // Calculate distance from center
    const distanceFromCenter = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    
    // Normalize the inward vector (avoid division by zero)
    const normalizedInwardX = distanceFromCenter > 0.001 ? deltaX / distanceFromCenter : 0.0;
    const normalizedInwardY = distanceFromCenter > 0.001 ? deltaY / distanceFromCenter : 0.0;
    
    // Calculate flow intensity based on distance and current music state
    // Closer to center = less intensity (since flow is already converged)
    // Further from center = more intensity (stronger inward pull)
    const distanceBasedIntensity = Math.min(1.0, distanceFromCenter * 2.0);
    const musicBasedIntensity = this.currentFlowVector.intensity * this.flowSettings.inwardFlowIntensity;
    const beatEnhancement = this.calculateBeatModifier();
    
    const flowIntensity = distanceBasedIntensity * musicBasedIntensity * beatEnhancement;
    
    return {
      inwardX: normalizedInwardX,
      inwardY: normalizedInwardY,
      distanceFromCenter: distanceFromCenter,
      flowIntensity: Math.min(1.0, flowIntensity),
    };
  }

  /**
   * Get optimized inward flow vectors for corridor shader coordination
   * This provides pre-calculated inward vectors for common shader sampling points
   * @returns Array of inward vectors for shader efficiency
   */
  public getInwardFlowVectorsForShader(): Array<{
    angle: number;
    inwardX: number;
    inwardY: number;
    intensity: number;
  }> {
    const vectors = [];
    const vectorCount = 8; // 8 radial directions for shader efficiency
    
    for (let i = 0; i < vectorCount; i++) {
      const angle = (i / vectorCount) * Math.PI * 2;
      const radiusFromCenter = 0.4; // Sample at 40% radius from center
      
      // Calculate sampling position
      const sampleX = 0.5 + Math.cos(angle) * radiusFromCenter;
      const sampleY = 0.5 + Math.sin(angle) * radiusFromCenter;
      
      // Get inward vector for this position
      const inwardVector = this.calculateInwardVectorForPosition(sampleX, sampleY);
      
      vectors.push({
        angle: angle,
        inwardX: inwardVector.inwardX,
        inwardY: inwardVector.inwardY,
        intensity: inwardVector.flowIntensity,
      });
    }
    
    return vectors;
  }
}
