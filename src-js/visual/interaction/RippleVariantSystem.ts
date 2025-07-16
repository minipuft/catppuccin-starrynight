/**
 * Ripple Variant System - Manages different ripple behaviors and selection logic
 * Integrates with Year 3000 System for music-reactive and context-aware ripple variants
 */

import type { 
  RippleVariant, 
  RippleType, 
  RippleConfig, 
  RippleVariantConfig,
  HarmonicColorData,
  CoordinatePoint
} from './types';
import { OrganicRippleRenderer } from './OrganicRippleRenderer';

export class RippleVariantSystem {
  private lastBeatTime: number = 0;
  private beatIntensityHistory: number[] = [];
  private currentHarmonicMode: string = 'default';
  private performanceBudget: number = 16; // milliseconds per frame
  
  // Variant selection weights based on context
  private static readonly VARIANT_WEIGHTS: Record<RippleType, Record<RippleVariant, number>> = {
    click: {
      stardust: 0.3,
      constellation: 0.2,
      wave: 0.25,
      nebula: 0.15,
      aurora: 0.1,
      classic: 0.0
    },
    beat: {
      stardust: 0.4,
      constellation: 0.15,
      wave: 0.2,
      nebula: 0.15,
      aurora: 0.1,
      classic: 0.0
    },
    selection: {
      stardust: 0.2,
      constellation: 0.4,
      wave: 0.15,
      nebula: 0.15,
      aurora: 0.1,
      classic: 0.0
    }
  };

  // Music context modifiers
  private static readonly TEMPO_VARIANT_MODIFIERS: Record<string, Partial<Record<RippleVariant, number>>> = {
    slow: { // < 80 BPM
      nebula: 1.5,
      aurora: 1.3,
      wave: 0.8,
      stardust: 0.7
    },
    medium: { // 80-140 BPM
      stardust: 1.2,
      constellation: 1.1,
      wave: 1.0
    },
    fast: { // > 140 BPM
      stardust: 1.5,
      wave: 1.3,
      constellation: 1.1,
      nebula: 0.6
    }
  };

  constructor(performanceBudget: number = 16) {
    this.performanceBudget = performanceBudget;
  }

  /**
   * Select optimal ripple variant based on context
   */
  selectVariant(
    type: RippleType,
    musicContext?: {
      bpm?: number;
      intensity?: number;
      harmonicMode?: string;
      energy?: number;
    },
    performanceContext?: {
      currentLoad?: number;
      availableBudget?: number;
    }
  ): RippleVariant {
    // Start with base weights for the ripple type
    const weights = { ...this.VARIANT_WEIGHTS[type] };
    
    // Apply music context modifiers
    if (musicContext) {
      this.applyMusicModifiers(weights, musicContext);
    }
    
    // Apply performance constraints
    if (performanceContext) {
      this.applyPerformanceConstraints(weights, performanceContext);
    }
    
    // Apply harmonic mode preferences
    this.applyHarmonicModeModifiers(weights);
    
    // Select variant using weighted random selection
    return this.weightedRandomSelection(weights);
  }

  /**
   * Apply music context modifiers to variant weights
   */
  private applyMusicModifiers(
    weights: Record<RippleVariant, number>,
    musicContext: { bpm?: number; intensity?: number; harmonicMode?: string; energy?: number }
  ): void {
    // BPM-based modifiers
    if (musicContext.bpm) {
      const tempoCategory = this.categorizeTempo(musicContext.bpm);
      const modifiers = this.TEMPO_VARIANT_MODIFIERS[tempoCategory] || {};
      
      Object.entries(modifiers).forEach(([variant, modifier]) => {
        weights[variant as RippleVariant] *= modifier || 1;
      });
    }
    
    // Intensity-based modifiers
    if (musicContext.intensity !== undefined) {
      if (musicContext.intensity > 0.8) {
        // High intensity - prefer dramatic variants
        weights.aurora *= 1.4;
        weights.nebula *= 1.3;
        weights.stardust *= 1.2;
      } else if (musicContext.intensity < 0.3) {
        // Low intensity - prefer subtle variants
        weights.wave *= 1.3;
        weights.constellation *= 1.2;
        weights.stardust *= 0.8;
      }
    }
    
    // Energy-based modifiers
    if (musicContext.energy !== undefined) {
      if (musicContext.energy > 0.7) {
        weights.stardust *= 1.3;
        weights.wave *= 1.2;
      } else if (musicContext.energy < 0.4) {
        weights.nebula *= 1.2;
        weights.aurora *= 1.1;
      }
    }
  }

  /**
   * Apply performance constraints to variant selection
   */
  private applyPerformanceConstraints(
    weights: Record<RippleVariant, number>,
    performanceContext: { currentLoad?: number; availableBudget?: number }
  ): void {
    const { currentLoad = 0, availableBudget = this.performanceBudget } = performanceContext;
    
    // If performance budget is tight, prefer less complex variants
    if (availableBudget < this.performanceBudget * 0.5 || currentLoad > 0.8) {
      weights.nebula *= 0.3; // Most expensive
      weights.aurora *= 0.5;
      weights.constellation *= 0.7;
      weights.wave *= 1.2; // Lightweight
      weights.classic *= 2.0; // Fallback
    }
    
    // If performance is excellent, allow complex variants
    if (availableBudget > this.performanceBudget * 1.5 && currentLoad < 0.3) {
      weights.nebula *= 1.5;
      weights.aurora *= 1.3;
      weights.stardust *= 1.2;
    }
  }

  /**
   * Apply harmonic mode preferences
   */
  private applyHarmonicModeModifiers(weights: Record<RippleVariant, number>): void {
    switch (this.currentHarmonicMode) {
      case 'monochromatic':
        weights.wave *= 1.3;
        weights.aurora *= 1.2;
        break;
      case 'complementary':
        weights.constellation *= 1.4;
        weights.stardust *= 1.2;
        break;
      case 'triadic':
        weights.stardust *= 1.3;
        weights.nebula *= 1.2;
        break;
      case 'analogous':
        weights.aurora *= 1.4;
        weights.nebula *= 1.2;
        break;
    }
  }

  /**
   * Weighted random selection from variant weights
   */
  private weightedRandomSelection(weights: Record<RippleVariant, number>): RippleVariant {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    if (totalWeight === 0) {
      return 'wave'; // Safe fallback
    }
    
    let random = Math.random() * totalWeight;
    
    for (const [variant, weight] of Object.entries(weights)) {
      random -= weight;
      if (random <= 0) {
        return variant as RippleVariant;
      }
    }
    
    return 'wave'; // Fallback
  }

  /**
   * Categorize tempo for variant selection
   */
  private categorizeTempo(bpm: number): string {
    if (bpm < 80) return 'slow';
    if (bpm > 140) return 'fast';
    return 'medium';
  }

  /**
   * Update beat context for variant selection
   */
  updateBeatContext(intensity: number): void {
    this.lastBeatTime = Date.now();
    this.beatIntensityHistory.push(intensity);
    
    // Keep only last 10 beats for analysis
    if (this.beatIntensityHistory.length > 10) {
      this.beatIntensityHistory.shift();
    }
  }

  /**
   * Update harmonic mode for variant preferences
   */
  updateHarmonicMode(mode: string): void {
    this.currentHarmonicMode = mode;
  }

  /**
   * Generate variant-specific configuration
   */
  generateVariantConfig(
    baseConfig: Partial<RippleConfig>,
    variant: RippleVariant,
    musicContext?: { harmonicColors?: HarmonicColorData }
  ): RippleConfig {
    const variantConfig = OrganicRippleRenderer.getVariantConfig(variant);
    
    // Base configuration with variant defaults
    const config: RippleConfig = {
      x: baseConfig.x || 0,
      y: baseConfig.y || 0,
      type: baseConfig.type || 'click',
      variant,
      size: this.calculateVariantSize(baseConfig.size || 200, variant),
      duration: this.calculateVariantDuration(baseConfig.duration || 800, variant),
      color: this.selectVariantColor(baseConfig.color || '#cba6f7', variant, musicContext?.harmonicColors),
      intensity: baseConfig.intensity || 0.7,
      timestamp: Date.now(),
      // Add physics properties based on variant
      velocity: this.generateVariantVelocity(variant),
      acceleration: this.generateVariantAcceleration(variant),
      rotation: this.generateVariantRotation(variant),
      opacity: this.calculateVariantOpacity(baseConfig.intensity || 0.7, variant)
    };
    
    return config;
  }

  /**
   * Calculate variant-specific size
   */
  private calculateVariantSize(baseSize: number, variant: RippleVariant): number {
    const multipliers: Record<RippleVariant, number> = {
      stardust: 0.8,
      constellation: 1.2,
      wave: 1.0,
      nebula: 1.4,
      aurora: 1.1,
      classic: 1.0
    };
    
    return baseSize * (multipliers[variant] || 1.0);
  }

  /**
   * Calculate variant-specific duration
   */
  private calculateVariantDuration(baseDuration: number, variant: RippleVariant): number {
    const multipliers: Record<RippleVariant, number> = {
      stardust: 1.2,
      constellation: 1.5,
      wave: 0.8,
      nebula: 2.0,
      aurora: 1.3,
      classic: 1.0
    };
    
    return baseDuration * (multipliers[variant] || 1.0);
  }

  /**
   * Select variant-appropriate color
   */
  private selectVariantColor(
    baseColor: string, 
    variant: RippleVariant, 
    harmonicColors?: HarmonicColorData
  ): string {
    if (!harmonicColors) {
      return baseColor;
    }
    
    // Use harmonic colors for different variants
    switch (variant) {
      case 'stardust':
        return harmonicColors.accent;
      case 'constellation':
        return harmonicColors.secondary;
      case 'aurora':
        return harmonicColors.primary;
      case 'nebula':
        return harmonicColors.primary;
      default:
        return baseColor;
    }
  }

  /**
   * Generate variant-specific physics properties
   */
  private generateVariantVelocity(variant: RippleVariant): CoordinatePoint | undefined {
    switch (variant) {
      case 'stardust':
        return {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20
        };
      case 'aurora':
        return {
          x: Math.sin(Date.now() * 0.001) * 10,
          y: Math.cos(Date.now() * 0.0012) * 5
        };
      default:
        return undefined;
    }
  }

  private generateVariantAcceleration(variant: RippleVariant): CoordinatePoint | undefined {
    switch (variant) {
      case 'stardust':
        return { x: 0, y: -2 }; // Slight upward drift
      case 'nebula':
        return {
          x: Math.sin(Date.now() * 0.0005) * 0.5,
          y: Math.cos(Date.now() * 0.0007) * 0.5
        };
      default:
        return undefined;
    }
  }

  private generateVariantRotation(variant: RippleVariant): number | undefined {
    switch (variant) {
      case 'constellation':
        return Math.random() * Math.PI * 2;
      case 'aurora':
        return Date.now() * 0.0001;
      default:
        return undefined;
    }
  }

  private calculateVariantOpacity(baseIntensity: number, variant: RippleVariant): number {
    const modifiers: Record<RippleVariant, number> = {
      stardust: 0.8,
      constellation: 0.9,
      wave: 1.0,
      nebula: 0.6,
      aurora: 0.7,
      classic: 1.0
    };
    
    return Math.min(1.0, baseIntensity * (modifiers[variant] || 1.0));
  }

  /**
   * Get average beat intensity for context
   */
  getAverageBeatIntensity(): number {
    if (this.beatIntensityHistory.length === 0) return 0.5;
    
    return this.beatIntensityHistory.reduce((sum, intensity) => sum + intensity, 0) / 
           this.beatIntensityHistory.length;
  }

  /**
   * Check if we're in a musical climax (for variant selection)
   */
  isMusicalClimax(): boolean {
    const recentBeats = this.beatIntensityHistory.slice(-5);
    if (recentBeats.length < 3) return false;
    
    const average = recentBeats.reduce((sum, intensity) => sum + intensity, 0) / recentBeats.length;
    return average > 0.8 && (Date.now() - this.lastBeatTime) < 2000;
  }

  /**
   * Update performance budget
   */
  updatePerformanceBudget(budget: number): void {
    this.performanceBudget = budget;
  }
}