/**
 * 🎨 COLOR TRANSITION MANAGEMENT SYSTEM 🎨
 *
 * Music-responsive color transition system that manages smooth color changes
 * based on music analysis, with support for layered effects and atmospheric depth.
 *
 * Features: Smooth color transitions, music synchronization, layered color effects,
 * performance-optimized color processing, and atmospheric visual enhancements.
 */

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { RGB } from "@/types/colorTypes";

export interface ColorTransitionState {
  // === CORE COLOR STATE ===
  colorHarmony: number; // 0-1 overall color harmony level
  layerCoordination: number; // 0-1 coordination between color layers
  transitionIntensity: number; // 0-1 color transition intensity

  // === MUSIC INTEGRATION ===
  musicColorTemperature: number; // Color temperature (1000K-10000K)
  musicDepth: number; // 0-1 music analysis depth layers
  musicComplexity: number; // 0-1 musical complexity index

  // === VISUAL PARAMETERS ===
  totalIntensity: number; // 0-1 overall intensity
  activeLayerCount: number; // Number of active color layers
  atmosphericDepth: number; // 0-1 atmospheric depth
  depthPerspective: number; // 0-1 depth perspective effects

  // === EFFECT PARAMETERS ===
  effectInfluence: number; // 0-1 visual effect influence
  flowIntensity: number; // 0-1 color flow animation intensity
  patternComplexity: number; // 0-1 visual pattern complexity
  stabilityLevel: number; // 0-1 color stability level

  // === TEMPORAL TRACKING ===
  memoryDepth: number; // 0-1 color history integration
  evolutionRate: number; // 0-1 color evolution rate
  predictionLevel: number; // 0-1 color prediction level

  // === PALETTE MANAGEMENT ===
  catppuccinPreservationLevel: number; // 0-1 Catppuccin color preservation
  currentPalette: ColorTransitionValue[]; // Current color transition palette
  paletteEvolution: PaletteTransitionState; // Palette transition tracking

  // === ATMOSPHERIC EFFECTS ===
  atmosphericDensity: number; // 0-1 atmospheric effect density
  frequencyAlignment: number; // 0-1 color frequency alignment
  colorVariation: number; // 0-1 color variation effects

  // === SYSTEM STATE ===
  lastBlendTime: number; // Last color blend timestamp
  frameRate: number; // Current transition update rate
  systemHealth: number; // 0-1 system health status
}

export interface ColorTransitionValue {
  rgb: RGB;
  oklab?: { L: number; a: number; b: number };
  xyz?: { x: number; y: number; z: number }; // CIE XYZ for cinema-grade color
  hsl?: { h: number; s: number; l: number }; // HSL for intuitive manipulation

  // === TRANSITION PROPERTIES ===
  transitionLevel: number; // 0-1 color transition strength
  emotionalResonance: number; // 0-1 emotional connection
  transitionIntensity: number; // 0-1 transition intensity level

  // === TEMPORAL PROPERTIES ===
  temporalStability: number; // 0-1 stability over time
  evolutionRate: number; // 0-1 color evolution speed
  memoryImprint: number; // 0-1 temporal memory strength

  // === ATMOSPHERIC PROPERTIES ===
  volumetricPresence: number; // 0-1 volumetric space occupation
  reflectance: number; // 0-1 color reflection intensity
  frequency: number; // Hz color frequency

  // === METADATA ===
  colorSpace: "rgb" | "oklab" | "xyz" | "hsl" | "transition";
  generationMethod: "harmony" | "transition" | "temporal" | "gradient";
  timestamp: number; // Creation timestamp
}

export interface PaletteTransitionState {
  currentGeneration: number; // Current evolution generation
  totalEvolutions: number; // Total evolutions performed
  evolutionVelocity: number; // Current evolution speed
  adaptationRate: number; // How quickly palette adapts

  // === TEMPORAL MEMORY ===
  previousGenerations: ColorTransitionValue[][]; // Historical palettes
  futureProjections: ColorTransitionValue[][]; // Predicted future palettes
  temporalPatterns: TemporalColorPattern[]; // Identified patterns

  // === TRANSITION TRACKING ===
  transitionGrowth: number; // Transition development
  transitionProgress: number; // Transition evolution
  colorAlignment: number; // Color frequency sync
}

export interface TemporalColorPattern {
  patternId: string; // Unique pattern identifier
  frequency: number; // Pattern occurrence frequency
  strength: number; // Pattern strength (0-1)
  colorSequence: ColorTransitionValue[]; // Color sequence in pattern
  musicalCorrelation: number; // Correlation with music (0-1)
  transitionSignature: number; // Transition signature
}

export interface VisualDataStream {
  streamId: string; // Unique stream identifier
  intensity: number; // 0-1 stream intensity
  dataType: "transition" | "color" | "music" | "temporal" | "gradient";
  flowDirection: "ascending" | "descending" | "spiral" | "radial";
  characters: string[]; // Matrix-style characters
  updateFrequency: number; // Hz update frequency
  transparency: number; // 0-1 stream transparency
  glowIntensity: number; // 0-1 glow effect intensity
}

export interface CinematicDepthLayer {
  layerId: string; // Unique layer identifier
  depth: number; // 0-1 depth position (0=foreground)
  atmosphericPerspective: number; // 0-1 atmospheric perspective
  volumetricDensity: number; // 0-1 volumetric fog density
  colorInfluence: number; // 0-1 color influence on layer
  parallaxMultiplier: number; // Parallax movement multiplier
  transitionBinding: number; // 0-1 transition binding strength
}

/**
 * Enhanced Color Transition Manager
 * Preserves existing integration while adding transition capabilities
 */
export class ColorTransitionController {
  private transitionState: ColorTransitionState = {
    // === Existing Core State (preserved) ===
    colorHarmony: 0.7,
    layerCoordination: 0.8,
    transitionIntensity: 0.6,
    musicColorTemperature: 6500,
    musicDepth: 0.7,
    musicComplexity: 0.5,
    totalIntensity: 0.5,
    activeLayerCount: 3,
    atmosphericDepth: 0.4,
    depthPerspective: 0.6,
    effectInfluence: 0.2,
    flowIntensity: 0.3,
    patternComplexity: 0.1,
    stabilityLevel: 0.9,
    memoryDepth: 0.5,
    evolutionRate: 0.0,
    predictionLevel: 0.2,
    catppuccinPreservationLevel: 0.8,
    currentPalette: [],
    paletteEvolution: {
      currentGeneration: 0,
      totalEvolutions: 0,
      evolutionVelocity: 0.1,
      adaptationRate: 0.3,
      previousGenerations: [],
      futureProjections: [],
      temporalPatterns: [],
      transitionGrowth: 0.0,
      transitionProgress: 0.0,
      colorAlignment: 0.5,
    },
    atmosphericDensity: 0.3,
    frequencyAlignment: 0.5,
    colorVariation: 0.2,
    lastBlendTime: Date.now(),
    frameRate: 60.0,
    systemHealth: 1.0,
  };

  constructor() {
    unifiedEventBus.subscribe(
      "colors:harmonized",
      (data) => {
        this.handleUnifiedColorUpdate(data);
      },
      "ColorTransitionController"
    );
  }

  /**
   * Handle unified color events (New Method)
   * Processes colors:harmonized events from UnifiedEventBus
   */
  private handleUnifiedColorUpdate(data: any): void {
    const { processedColors, accentHex, accentRgb, coordinationMetrics } = data;

    // Extract music emotion and beat data from coordination metrics
    const musicEmotion = coordinationMetrics?.emotionalState || "neutral";
    const beatData = coordinationMetrics?.musicInfluenceStrength || 0.5;

    // Update transition state based on musical input
    this.updateTransitionFromMusic(musicEmotion, beatData);

    // Convert processed colors to transition format
    this.updatePaletteFromUnifiedColors(processedColors, accentHex, accentRgb);

    // Publish transition update for dependent systems
    this.publishTransitionUpdate();
  }

  /**
   * Handle color updates from our clean ColorOrchestrator (Legacy Method)
   * TODO: Remove after Phase 1 validation complete
   */
  private handleColorUpdate(event: any): void {
    const { palette, musicEmotion, beatData } = event.payload;

    // Update transition state based on musical input
    this.updateTransitionFromMusic(musicEmotion, beatData);

    // Convert ColorOrchestrator palette to transition format
    this.updatePaletteFromHarmony(palette);

    // Publish transition update for dependent systems
    this.publishTransitionUpdate();
  }

  /**
   * Update transition parameters from musical input
   * Enhanced with transition capabilities while preserving existing logic
   */
  private updateTransitionFromMusic(musicEmotion: any, beatData: any): void {
    if (musicEmotion) {
      // Existing transition mapping (preserved)
      this.transitionState.colorHarmony =
        (musicEmotion.valence + musicEmotion.intensity) * 0.5;

      this.transitionState.musicColorTemperature =
        4000 + musicEmotion.valence * 4000; // 4000K-8000K range

      this.transitionState.totalIntensity = musicEmotion.intensity || 0.5;

      // === Enhanced Transition Capabilities ===
      // Multi-dimensional coordination based on emotional complexity
      this.transitionState.layerCoordination = Math.min(
        1.0,
        (musicEmotion.valence + musicEmotion.arousal) * 0.6
      );

      // Musical depth from valence variance
      this.transitionState.musicDepth =
        Math.abs(musicEmotion.valence - 0.5) * 2; // 0-1 depth

      // Flow intensity for visual effects
      this.transitionState.flowIntensity = musicEmotion.intensity * 0.7;
    }

    if (beatData) {
      // Existing visual effect influence (preserved)
      this.transitionState.effectInfluence = Math.min(
        0.8,
        beatData.strength * 0.6
      );

      // === Enhanced Beat Processing ===
      // Temporal memory updates on strong beats
      if (beatData.strength > 0.7) {
        this.updateTemporalMemory(beatData);
      }

      // Atmospheric depth from beat dynamics
      this.transitionState.atmosphericDepth = Math.min(
        1.0,
        beatData.strength * 0.8
      );
    }
  }

  /**
   *  Convert unified processed colors to transition format
   * Enhanced with transition color properties for UnifiedEventBus integration
   */
  private updatePaletteFromUnifiedColors(
    processedColors: Record<string, string>,
    accentHex: string,
    accentRgb: string
  ): void {
    // Convert processedColors object to palette array
    const paletteColors = [
      { hex: accentHex, rgb: this.hexToRgb(accentHex) },
      {
        hex: processedColors["primary"] || accentHex,
        rgb: this.hexToRgb(processedColors["primary"] || accentHex),
      },
      {
        hex: processedColors["secondary"] || accentHex,
        rgb: this.hexToRgb(processedColors["secondary"] || accentHex),
      },
    ].filter((color) => color.hex); // Remove any null/undefined colors

    // Use existing harmony processing logic
    this.updatePaletteFromHarmony(paletteColors);
  }

  /**
   * Helper method to convert hex to RGB
   */
  private hexToRgb(hex: string): RGB {
    // Remove # if present
    hex = hex.replace("#", "");

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  }

  /**
   * Convert color harmony palette to transition format
   * Enhanced with transition color properties
   */
  private updatePaletteFromHarmony(palette: any[]): void {
    // Store previous generation for temporal memory
    if (this.transitionState.currentPalette.length > 0) {
      this.transitionState.paletteEvolution.previousGenerations.push([
        ...this.transitionState.currentPalette,
      ]);

      // Keep only last 5 generations for performance
      if (
        this.transitionState.paletteEvolution.previousGenerations.length > 5
      ) {
        this.transitionState.paletteEvolution.previousGenerations.shift();
      }
    }

    // Convert to transition color values
    this.transitionState.currentPalette = palette.map(
      (color: any, index: number) => ({
        rgb: color.rgb || { r: color.r || 0, g: color.g || 0, b: color.b || 0 },
        oklab: color.oklab,
        hsl: color.hsl,
        xyz: color.xyz,

        // === Transition Properties ===
        transitionLevel: this.transitionState.colorHarmony,
        emotionalResonance: this.transitionState.musicDepth,
        transitionIntensity: this.transitionState.transitionIntensity,

        // === Temporal Properties ===
        temporalStability: Math.max(0.1, 1.0 - index * 0.1), // More stable colors first
        evolutionRate: this.transitionState.paletteEvolution.evolutionVelocity,
        memoryImprint: this.transitionState.memoryDepth,

        // === Atmospheric Properties ===
        volumetricPresence:
          this.transitionState.atmosphericDepth * (1.0 - index * 0.15),
        reflectance: this.transitionState.effectInfluence,
        frequency: 432 + index * 111, // Progressive color frequencies

        // === Metadata ===
        colorSpace: color.oklab ? "oklab" : ("rgb" as const),
        generationMethod: "harmony" as const,
        timestamp: Date.now(),
      })
    );

    // Update evolution state
    this.transitionState.activeLayerCount = palette.length;
    this.transitionState.lastBlendTime = Date.now();
    this.transitionState.paletteEvolution.currentGeneration++;
    this.transitionState.paletteEvolution.totalEvolutions++;
  }

  /**
   * Update temporal memory based on strong beats
   */
  private updateTemporalMemory(beatData: any): void {
    const currentTime = Date.now();

    // Create temporal pattern from current state
    const pattern: TemporalColorPattern = {
      patternId: `pattern-${currentTime}`,
      frequency: beatData.tempo || 120,
      strength: beatData.strength,
      colorSequence: [...this.transitionState.currentPalette],
      musicalCorrelation: beatData.strength,
      transitionSignature: this.transitionState.colorHarmony,
    };

    // Store pattern for recognition
    this.transitionState.paletteEvolution.temporalPatterns.push(pattern);

    // Keep only recent patterns
    if (this.transitionState.paletteEvolution.temporalPatterns.length > 10) {
      this.transitionState.paletteEvolution.temporalPatterns.shift();
    }

    // Update temporal memory depth
    this.transitionState.memoryDepth = Math.min(
      1.0,
      this.transitionState.memoryDepth + 0.1
    );
  }

  /**
   * Publish transition update for dependent systems
   * Enhanced with transition data
   * Migrated to UnifiedEventBus
   */
  private publishTransitionUpdate(): void {
    // Use UnifiedEventBus for transition updates
    unifiedEventBus.emit("colors:harmonized" as any, {
      type: "colorTransitionUpdate",
      payload: {
        // === Core Data (preserved for compatibility) ===
        palette: this.transitionState.currentPalette,
        transitionLevel: this.transitionState.colorHarmony,
        colorTemperature: this.transitionState.musicColorTemperature,

        // === Enhanced Transition Data ===
        layerCoordination: this.transitionState.layerCoordination,
        transitionIntensity: this.transitionState.transitionIntensity,
        atmosphericDepth: this.transitionState.atmosphericDepth,
        flowIntensity: this.transitionState.flowIntensity,
        memoryDepth: this.transitionState.memoryDepth,
        frequencyAlignment: this.transitionState.frequencyAlignment,

        // === Evolution State ===
        paletteGeneration:
          this.transitionState.paletteEvolution.currentGeneration,
        temporalPatternCount:
          this.transitionState.paletteEvolution.temporalPatterns.length,

        // === Full State (for advanced consumers) ===
        fullTransitionState: this.transitionState,
      },
    });

    // === Specialized Events for Transition Systems ===

    // Visual data stream update via UnifiedEventBus
    if (this.transitionState.flowIntensity > 0.5) {
      unifiedEventBus.emit("visual-effects:field-updated", {
        rhythmicPulse: this.transitionState.flowIntensity,
        musicalFlow: { x: this.transitionState.flowIntensity, y: 0 },
        energyResonance: this.transitionState.patternComplexity,
        depthPerception: this.transitionState.stabilityLevel,
        pulsingCycle: this.transitionState.flowIntensity,
      });
    }

    // Temporal pattern recognition via UnifiedEventBus
    if (this.transitionState.paletteEvolution.temporalPatterns.length > 3) {
      unifiedEventBus.emit("visual-effects:temporal-pattern", {
        type: "temporalPatternDetected",
        payload: {
          patterns: this.transitionState.paletteEvolution.temporalPatterns,
          memoryDepth: this.transitionState.memoryDepth,
        },
      });
    }

    // High transition level changes via UnifiedEventBus
    if (this.transitionState.transitionIntensity > 0.8) {
      unifiedEventBus.emit("visual-effects:transcendence-high", {
        type: "transitionIntensityHigh",
        payload: {
          level: this.transitionState.transitionIntensity,
          cosmicAlignment: this.transitionState.paletteEvolution.colorAlignment,
        },
      });
    }
  }

  /**
   * Get current transition state
   */
  public getTransitionState(): ColorTransitionState {
    return { ...this.transitionState };
  }

  /**
   * Set transition parameters manually
   * Enhanced with transition parameter support
   */
  public setTransition(level: number, temperature: number = 6500): void {
    this.transitionState.colorHarmony = Math.max(0, Math.min(1, level));
    this.transitionState.musicColorTemperature = Math.max(
      1000,
      Math.min(10000, temperature)
    );

    // Update transition parameters based on transition level
    this.transitionState.transitionIntensity = Math.min(1.0, level * 1.2);
    this.transitionState.layerCoordination = level * 0.9;

    this.publishTransitionUpdate();
  }

  /**
   * Get transition color palette with transition properties
   */
  public getTransitionPalette(): ColorTransitionValue[] {
    return [...this.transitionState.currentPalette];
  }

  /**
   * Get temporal patterns for pattern recognition systems
   */
  public getTemporalPatterns(): TemporalColorPattern[] {
    return [...this.transitionState.paletteEvolution.temporalPatterns];
  }

  /**
   * Get evolution state for temporal memory systems
   */
  public getPaletteEvolution(): PaletteTransitionState {
    return { ...this.transitionState.paletteEvolution };
  }

  /**
   * Set transition intensity manually for enhanced transitions
   */
  public setTransitionIntensity(level: number): void {
    this.transitionState.transitionIntensity = Math.max(0, Math.min(1, level));

    // Update related transition parameters
    this.transitionState.frequencyAlignment = level * 0.8;
    this.transitionState.paletteEvolution.transitionProgress = level;

    this.publishTransitionUpdate();
  }

  /**
   * Set flow intensity for visual effects
   */
  public setFlowIntensity(intensity: number): void {
    this.transitionState.flowIntensity = Math.max(0, Math.min(1, intensity));
    this.publishTransitionUpdate();
  }
}

// Export singleton instance
export const colorTransitionManager = new ColorTransitionController();

// Backward compatibility alias
export const ColorTransitionManager = ColorTransitionController;
