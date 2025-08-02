/**
 * 🌌 TRANSCENDENT COLOR CONSCIOUSNESS SYSTEM 🌌
 * 
 * Year 3000 design philosophy: Multi-dimensional consciousness-driven color systems
 * that respond to music with holographic depth, data streams, and cinematic atmosphere.
 * 
 * Based on visualGuide.png aesthetic: Volumetric lighting, Matrix-style data flows,
 * consciousness-aware atmospheric perspective, and transcendent visual experiences.
 */

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { RGB } from "@/types/colorStubs";

export interface ColorConsciousnessState {
  // === CORE CONSCIOUSNESS ===
  consciousnessResonance: number;          // 0-1 consciousness level
  multidimensionalAwareness: number;       // 0-1 awareness across dimensions
  transcendenceLevel: number;              // 0-1 transcendence beyond reality
  
  // === EMOTIONAL CONSCIOUSNESS ===
  dominantEmotionalTemperature: number;    // Color temperature (1000K-10000K)
  emotionalDepth: number;                  // 0-1 emotional depth layers
  emotionalComplexity: number;             // 0-1 emotional complexity index
  
  // === VISUAL CONSCIOUSNESS ===
  totalIntensity: number;                  // 0-1 overall intensity
  activeLayerCount: number;                // Number of active color layers
  volumetricDepth: number;                 // 0-1 volumetric atmosphere depth
  cinematicPerspective: number;            // 0-1 cinematic depth perspective
  
  // === HOLOGRAPHIC CONSCIOUSNESS ===
  holographicInfluence: number;            // 0-1 holographic effect influence
  dataStreamIntensity: number;             // 0-1 Matrix-style data stream flow
  interferencePatterns: number;            // 0-1 holographic interference
  projectionStability: number;             // 0-1 holographic projection stability
  
  // === TEMPORAL CONSCIOUSNESS ===
  temporalMemoryDepth: number;             // 0-1 temporal memory integration
  consciousnessEvolution: number;          // 0-1 consciousness evolution rate
  futureProjection: number;                // 0-1 future state projection
  
  // === PALETTE CONSCIOUSNESS ===
  catppuccinPreservationLevel: number;     // 0-1 Catppuccin color preservation
  currentPalette: TranscendentColorValue[];// Current consciousness palette
  paletteEvolution: PaletteEvolutionState; // Palette evolution tracking
  
  // === ATMOSPHERIC CONSCIOUSNESS ===
  atmosphericDensity: number;              // 0-1 atmospheric particle density
  cosmicResonance: number;                 // 0-1 cosmic frequency alignment
  quantumFluctuation: number;              // 0-1 quantum color fluctuations
  
  // === SYSTEM STATE ===
  lastBlendTime: number;                   // Last color blend timestamp
  consciousnessFrameRate: number;          // Current consciousness update rate
  systemHealthConsciousness: number;       // 0-1 system consciousness health
}

export interface TranscendentColorValue {
  rgb: RGB;
  oklab?: { L: number; a: number; b: number };
  xyz?: { x: number; y: number; z: number };        // CIE XYZ for cinema-grade color
  hsl?: { h: number; s: number; l: number };        // HSL for intuitive manipulation
  
  // === CONSCIOUSNESS PROPERTIES ===
  consciousnessLevel: number;                       // 0-1 color consciousness
  emotionalResonance: number;                       // 0-1 emotional connection
  transcendenceIndex: number;                       // 0-1 transcendence level
  
  // === TEMPORAL PROPERTIES ===
  temporalStability: number;                        // 0-1 stability over time
  evolutionRate: number;                            // 0-1 color evolution speed
  memoryImprint: number;                            // 0-1 temporal memory strength
  
  // === ATMOSPHERIC PROPERTIES ===
  volumetricPresence: number;                       // 0-1 volumetric space occupation
  holographicReflectance: number;                   // 0-1 holographic reflection
  cosmicFrequency: number;                          // Hz cosmic vibration
  
  // === METADATA ===
  colorSpace: 'rgb' | 'oklab' | 'xyz' | 'hsl' | 'consciousness';
  generationMethod: 'harmony' | 'consciousness' | 'temporal' | 'cosmic';
  timestamp: number;                                // Creation timestamp
}

export interface PaletteEvolutionState {
  currentGeneration: number;                        // Current evolution generation
  totalEvolutions: number;                          // Total evolutions performed
  evolutionVelocity: number;                        // Current evolution speed
  adaptationRate: number;                           // How quickly palette adapts
  
  // === TEMPORAL MEMORY ===
  previousGenerations: TranscendentColorValue[][];  // Historical palettes
  futureProjections: TranscendentColorValue[][];    // Predicted future palettes
  temporalPatterns: TemporalColorPattern[];         // Identified patterns
  
  // === CONSCIOUSNESS TRACKING ===
  consciousnessGrowth: number;                      // Consciousness development
  transcendenceProgress: number;                    // Transcendence evolution
  cosmicAlignment: number;                          // Cosmic frequency sync
}

export interface TemporalColorPattern {
  patternId: string;                                // Unique pattern identifier
  frequency: number;                                // Pattern occurrence frequency
  strength: number;                                 // Pattern strength (0-1)
  colorSequence: TranscendentColorValue[];          // Color sequence in pattern
  musicalCorrelation: number;                       // Correlation with music (0-1)
  consciousnessSignature: number;                   // Consciousness signature
}

export interface HolographicDataStream {
  streamId: string;                                 // Unique stream identifier
  intensity: number;                                // 0-1 stream intensity
  dataType: 'consciousness' | 'color' | 'music' | 'temporal' | 'cosmic';
  flowDirection: 'ascending' | 'descending' | 'spiral' | 'quantum';
  characters: string[];                             // Matrix-style characters
  updateFrequency: number;                          // Hz update frequency
  transparency: number;                             // 0-1 stream transparency
  glowIntensity: number;                            // 0-1 glow effect intensity
}

export interface CinematicDepthLayer {
  layerId: string;                                  // Unique layer identifier
  depth: number;                                    // 0-1 depth position (0=foreground)
  atmosphericPerspective: number;                   // 0-1 atmospheric perspective
  volumetricDensity: number;                        // 0-1 volumetric fog density
  colorInfluence: number;                           // 0-1 color influence on layer
  parallaxMultiplier: number;                       // Parallax movement multiplier
  consciousnessBinding: number;                     // 0-1 consciousness binding strength
}

/**
 * Enhanced Color Consciousness Manager
 * Preserves existing integration while adding transcendent capabilities
 */
export class ColorConsciousnessManager {
  private consciousnessState: ColorConsciousnessState = {
    // === Existing Core State (preserved) ===
    consciousnessResonance: 0.7,
    multidimensionalAwareness: 0.8,
    transcendenceLevel: 0.6,
    dominantEmotionalTemperature: 6500,
    emotionalDepth: 0.7,
    emotionalComplexity: 0.5,
    totalIntensity: 0.5,
    activeLayerCount: 3,
    volumetricDepth: 0.4,
    cinematicPerspective: 0.6,
    holographicInfluence: 0.2,
    dataStreamIntensity: 0.3,
    interferencePatterns: 0.1,
    projectionStability: 0.9,
    temporalMemoryDepth: 0.5,
    consciousnessEvolution: 0.0,
    futureProjection: 0.2,
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
      consciousnessGrowth: 0.0,
      transcendenceProgress: 0.0,
      cosmicAlignment: 0.5
    },
    atmosphericDensity: 0.3,
    cosmicResonance: 0.5,
    quantumFluctuation: 0.2,
    lastBlendTime: Date.now(),
    consciousnessFrameRate: 60.0,
    systemHealthConsciousness: 1.0
  };

  constructor() {
    // 🔧 PHASE 1: Migrate to UnifiedEventBus for consciousness integration
    unifiedEventBus.subscribe('colors:harmonized', (data) => {
      this.handleUnifiedColorUpdate(data);
    }, 'ColorConsciousnessManager');
    
    // Legacy bridge: Keep GlobalEventBus temporarily during transition
    // TODO: Remove after Phase 1 validation complete
    // GlobalEventBus.subscribe('colors/harmonized', this.handleColorUpdate.bind(this));
  }

  /**
   * 🔧 PHASE 1: Handle unified color events (New Method)
   * Processes colors:harmonized events from UnifiedEventBus
   */
  private handleUnifiedColorUpdate(data: any): void {
    const { processedColors, accentHex, accentRgb, coordinationMetrics } = data;
    
    // Extract music emotion and beat data from coordination metrics
    const musicEmotion = coordinationMetrics?.emotionalState || 'neutral';
    const beatData = coordinationMetrics?.musicInfluenceStrength || 0.5;
    
    // Update consciousness state based on musical input
    this.updateConsciousnessFromMusic(musicEmotion, beatData);
    
    // Convert processed colors to consciousness format
    this.updatePaletteFromUnifiedColors(processedColors, accentHex, accentRgb);
    
    // Publish consciousness update for dependent systems
    this.publishConsciousnessUpdate();
  }

  /**
   * Handle color updates from our clean ColorOrchestrator (Legacy Method)
   * TODO: Remove after Phase 1 validation complete
   */
  private handleColorUpdate(event: any): void {
    const { palette, musicEmotion, beatData } = event.payload;
    
    // Update consciousness state based on musical input
    this.updateConsciousnessFromMusic(musicEmotion, beatData);
    
    // Convert ColorOrchestrator palette to consciousness format
    this.updatePaletteFromHarmony(palette);
    
    // Publish consciousness update for dependent systems
    this.publishConsciousnessUpdate();
  }

  /**
   * Update consciousness parameters from musical input
   * Enhanced with transcendent capabilities while preserving existing logic
   */
  private updateConsciousnessFromMusic(musicEmotion: any, beatData: any): void {
    if (musicEmotion) {
      // Existing consciousness mapping (preserved)
      this.consciousnessState.consciousnessResonance = 
        (musicEmotion.valence + musicEmotion.intensity) * 0.5;
      
      this.consciousnessState.dominantEmotionalTemperature = 
        4000 + (musicEmotion.valence * 4000); // 4000K-8000K range
      
      this.consciousnessState.totalIntensity = musicEmotion.intensity || 0.5;
      
      // === Enhanced Transcendent Capabilities ===
      // Multi-dimensional awareness based on emotional complexity
      this.consciousnessState.multidimensionalAwareness = 
        Math.min(1.0, (musicEmotion.valence + musicEmotion.arousal) * 0.6);
      
      // Emotional depth from valence variance
      this.consciousnessState.emotionalDepth = 
        Math.abs(musicEmotion.valence - 0.5) * 2; // 0-1 depth
      
      // Data stream intensity for visual effects
      this.consciousnessState.dataStreamIntensity = 
        musicEmotion.intensity * 0.7;
    }

    if (beatData) {
      // Existing holographic influence (preserved)
      this.consciousnessState.holographicInfluence = 
        Math.min(0.8, beatData.strength * 0.6);
      
      // === Enhanced Beat Processing ===
      // Temporal memory updates on strong beats
      if (beatData.strength > 0.7) {
        this.updateTemporalMemory(beatData);
      }
      
      // Volumetric depth from beat dynamics
      this.consciousnessState.volumetricDepth = 
        Math.min(1.0, beatData.strength * 0.8);
    }
  }

  /**
   * 🔧 PHASE 1: Convert unified processed colors to consciousness format
   * Enhanced with transcendent color properties for UnifiedEventBus integration
   */
  private updatePaletteFromUnifiedColors(processedColors: Record<string, string>, accentHex: string, accentRgb: string): void {
    // Convert processedColors object to palette array
    const paletteColors = [
      { hex: accentHex, rgb: this.hexToRgb(accentHex) },
      { hex: processedColors['primary'] || accentHex, rgb: this.hexToRgb(processedColors['primary'] || accentHex) },
      { hex: processedColors['secondary'] || accentHex, rgb: this.hexToRgb(processedColors['secondary'] || accentHex) }
    ].filter(color => color.hex); // Remove any null/undefined colors
    
    // Use existing harmony processing logic
    this.updatePaletteFromHarmony(paletteColors);
  }

  /**
   * 🔧 PHASE 1: Helper method to convert hex to RGB
   */
  private hexToRgb(hex: string): RGB {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  }

  /**
   * Convert color harmony palette to consciousness format
   * Enhanced with transcendent color properties
   */
  private updatePaletteFromHarmony(palette: any[]): void {
    // Store previous generation for temporal memory
    if (this.consciousnessState.currentPalette.length > 0) {
      this.consciousnessState.paletteEvolution.previousGenerations.push(
        [...this.consciousnessState.currentPalette]
      );
      
      // Keep only last 5 generations for performance
      if (this.consciousnessState.paletteEvolution.previousGenerations.length > 5) {
        this.consciousnessState.paletteEvolution.previousGenerations.shift();
      }
    }
    
    // Convert to transcendent color values
    this.consciousnessState.currentPalette = palette.map((color: any, index: number) => ({
      rgb: color.rgb || { r: color.r || 0, g: color.g || 0, b: color.b || 0 },
      oklab: color.oklab,
      hsl: color.hsl,
      xyz: color.xyz,
      
      // === Consciousness Properties ===
      consciousnessLevel: this.consciousnessState.consciousnessResonance,
      emotionalResonance: this.consciousnessState.emotionalDepth,
      transcendenceIndex: this.consciousnessState.transcendenceLevel,
      
      // === Temporal Properties ===
      temporalStability: Math.max(0.1, 1.0 - (index * 0.1)), // More stable colors first
      evolutionRate: this.consciousnessState.paletteEvolution.evolutionVelocity,
      memoryImprint: this.consciousnessState.temporalMemoryDepth,
      
      // === Atmospheric Properties ===
      volumetricPresence: this.consciousnessState.volumetricDepth * (1.0 - index * 0.15),
      holographicReflectance: this.consciousnessState.holographicInfluence,
      cosmicFrequency: 432 + (index * 111), // Progressive cosmic frequencies
      
      // === Metadata ===
      colorSpace: color.oklab ? 'oklab' : 'rgb' as const,
      generationMethod: 'harmony' as const,
      timestamp: Date.now()
    }));
    
    // Update evolution state
    this.consciousnessState.activeLayerCount = palette.length;
    this.consciousnessState.lastBlendTime = Date.now();
    this.consciousnessState.paletteEvolution.currentGeneration++;
    this.consciousnessState.paletteEvolution.totalEvolutions++;
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
      colorSequence: [...this.consciousnessState.currentPalette],
      musicalCorrelation: beatData.strength,
      consciousnessSignature: this.consciousnessState.consciousnessResonance
    };
    
    // Store pattern for recognition
    this.consciousnessState.paletteEvolution.temporalPatterns.push(pattern);
    
    // Keep only recent patterns
    if (this.consciousnessState.paletteEvolution.temporalPatterns.length > 10) {
      this.consciousnessState.paletteEvolution.temporalPatterns.shift();
    }
    
    // Update temporal memory depth
    this.consciousnessState.temporalMemoryDepth = Math.min(1.0, 
      this.consciousnessState.temporalMemoryDepth + 0.1);
  }

  /**
   * Publish consciousness update for dependent systems
   * Enhanced with transcendent consciousness data
   * 🔧 PHASE 1: Migrated to UnifiedEventBus
   */
  private publishConsciousnessUpdate(): void {
    // 🔧 PHASE 1: Use UnifiedEventBus for consciousness updates
    unifiedEventBus.emit('consciousness:updated', {
      type: 'colorConsciousnessUpdate',
      payload: {
        // === Core Data (preserved for compatibility) ===
        palette: this.consciousnessState.currentPalette,
        consciousnessLevel: this.consciousnessState.consciousnessResonance,
        emotionalTemperature: this.consciousnessState.dominantEmotionalTemperature,
        
        // === Enhanced Transcendent Data ===
        multidimensionalAwareness: this.consciousnessState.multidimensionalAwareness,
        transcendenceLevel: this.consciousnessState.transcendenceLevel,
        volumetricDepth: this.consciousnessState.volumetricDepth,
        dataStreamIntensity: this.consciousnessState.dataStreamIntensity,
        temporalMemoryDepth: this.consciousnessState.temporalMemoryDepth,
        cosmicResonance: this.consciousnessState.cosmicResonance,
        
        // === Evolution State ===
        paletteGeneration: this.consciousnessState.paletteEvolution.currentGeneration,
        temporalPatternCount: this.consciousnessState.paletteEvolution.temporalPatterns.length,
        
        // === Full State (for advanced consumers) ===
        fullConsciousnessState: this.consciousnessState
      }
    });
    
    // === Specialized Events for Transcendent Systems ===
    
    // 🔧 PHASE 1: Holographic data stream update via UnifiedEventBus
    if (this.consciousnessState.dataStreamIntensity > 0.5) {
      unifiedEventBus.emit('consciousness:holographic-stream', {
        type: 'holographicStreamUpdate',
        payload: {
          intensity: this.consciousnessState.dataStreamIntensity,
          interferencePatterns: this.consciousnessState.interferencePatterns,
          projectionStability: this.consciousnessState.projectionStability
        }
      });
    }
    
    // 🔧 PHASE 1: Temporal pattern recognition via UnifiedEventBus
    if (this.consciousnessState.paletteEvolution.temporalPatterns.length > 3) {
      unifiedEventBus.emit('consciousness:temporal-pattern', {
        type: 'temporalPatternDetected',
        payload: {
          patterns: this.consciousnessState.paletteEvolution.temporalPatterns,
          memoryDepth: this.consciousnessState.temporalMemoryDepth
        }
      });
    }
    
    // 🔧 PHASE 1: Transcendence level changes via UnifiedEventBus
    if (this.consciousnessState.transcendenceLevel > 0.8) {
      unifiedEventBus.emit('consciousness:transcendence-high', {
        type: 'transcendenceLevelHigh',
        payload: {
          level: this.consciousnessState.transcendenceLevel,
          cosmicAlignment: this.consciousnessState.paletteEvolution.cosmicAlignment
        }
      });
    }
  }

  /**
   * Get current consciousness state
   */
  public getConsciousnessState(): ColorConsciousnessState {
    return { ...this.consciousnessState };
  }

  /**
   * Set consciousness parameters manually
   * Enhanced with transcendent parameter support
   */
  public setConsciousness(level: number, temperature: number = 6500): void {
    this.consciousnessState.consciousnessResonance = Math.max(0, Math.min(1, level));
    this.consciousnessState.dominantEmotionalTemperature = Math.max(1000, Math.min(10000, temperature));
    
    // Update transcendent parameters based on consciousness level
    this.consciousnessState.transcendenceLevel = Math.min(1.0, level * 1.2);
    this.consciousnessState.multidimensionalAwareness = level * 0.9;
    
    this.publishConsciousnessUpdate();
  }
  
  /**
   * Get transcendent color palette with consciousness properties
   */
  public getTranscendentPalette(): TranscendentColorValue[] {
    return [...this.consciousnessState.currentPalette];
  }
  
  /**
   * Get temporal patterns for pattern recognition systems
   */
  public getTemporalPatterns(): TemporalColorPattern[] {
    return [...this.consciousnessState.paletteEvolution.temporalPatterns];
  }
  
  /**
   * Get evolution state for temporal memory systems
   */
  public getPaletteEvolution(): PaletteEvolutionState {
    return { ...this.consciousnessState.paletteEvolution };
  }
  
  /**
   * Set transcendence level manually for enhanced consciousness
   */
  public setTranscendence(level: number): void {
    this.consciousnessState.transcendenceLevel = Math.max(0, Math.min(1, level));
    
    // Update related consciousness parameters
    this.consciousnessState.cosmicResonance = level * 0.8;
    this.consciousnessState.paletteEvolution.transcendenceProgress = level;
    
    this.publishConsciousnessUpdate();
  }
  
  /**
   * Set data stream intensity for holographic effects
   */
  public setDataStreamIntensity(intensity: number): void {
    this.consciousnessState.dataStreamIntensity = Math.max(0, Math.min(1, intensity));
    this.publishConsciousnessUpdate();
  }
}

// Export singleton instance
export const colorConsciousnessManager = new ColorConsciousnessManager();