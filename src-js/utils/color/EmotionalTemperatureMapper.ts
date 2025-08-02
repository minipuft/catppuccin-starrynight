// ████████████████████████████████████████████████████████████████████████████████
// EMOTIONAL TEMPERATURE MAPPER - Music Analysis to OKLAB Emotional State Integration
// ████████████████████████████████████████████████████████████████████████████████

import { 
  OKLABColorProcessor, 
  type EnhancementPreset, 
  type OKLABProcessingResult 
} from './OKLABColorProcessor';

export interface MusicAnalysisData {
  energy?: number; // 0-1
  valence?: number; // 0-1 (positive vs negative)
  danceability?: number; // 0-1
  tempo?: number; // BPM
  loudness?: number; // dB
  acousticness?: number; // 0-1
  instrumentalness?: number; // 0-1
  speechiness?: number; // 0-1
  mode?: number; // 0 = minor, 1 = major
  key?: number; // 0-11 pitch class
  genre?: string;
}

export interface EmotionalTemperatureResult {
  primaryEmotion: EmotionalState;
  secondaryEmotion?: EmotionalState;
  intensity: number; // 0-1
  temperature: number; // Kelvin (1000K-20000K) - Legacy compatibility
  blendRatio: number; // 0-1 for mixing primary/secondary
  cssClass: string;
  cssVariables: Record<string, string>;
  // OKLAB integration
  oklabPreset: EnhancementPreset;
  oklabResult?: OKLABProcessingResult | undefined;
  perceptualColorHex?: string | undefined;
}

export type EmotionalState = 
  | 'calm' 
  | 'melancholy' 
  | 'energetic' 
  | 'aggressive' 
  | 'happy' 
  | 'romantic' 
  | 'mysterious' 
  | 'epic' 
  | 'ambient';

// Emotional state definitions mapped to OKLAB color coordinates and presets
const EMOTIONAL_TEMPERATURE_MAP: Record<EmotionalState, {
  temperatureRange: [number, number]; // [min, max] in Kelvin - Legacy compatibility
  baseTemperature: number; // Legacy compatibility
  characteristics: {
    energy: [number, number]; // [min, max] typical energy range
    valence: [number, number]; // [min, max] typical valence range
    intensity: number; // Default intensity multiplier
  };
  cssClass: string;
  description: string;
  // OKLAB integration
  oklabBaseColor: string; // Base color in hex for OKLAB processing
  oklabPreset: string; // OKLAB enhancement preset name
  perceptualCharacteristics: {
    lightness: [number, number]; // [min, max] OKLAB lightness (0-1)
    chromaBoost: number; // Chroma enhancement multiplier
    hueShift: number; // Hue shift in OKLAB space (degrees)
  };
}> = {
  calm: {
    temperatureRange: [2700, 4000],
    baseTemperature: 3200,
    characteristics: {
      energy: [0.0, 0.3],
      valence: [0.4, 0.8],
      intensity: 0.6
    },
    cssClass: 'organic-emotion-calm',
    description: 'Warm, soothing, meditative states',
    oklabBaseColor: '#89b4fa', // Catppuccin blue - calming base
    oklabPreset: 'SUBTLE',
    perceptualCharacteristics: {
      lightness: [0.6, 0.8], // Moderate to high lightness for calming effect
      chromaBoost: 0.9, // Slightly reduced chroma for gentleness
      hueShift: 15 // Slight warm shift towards cyan-blue
    }
  },
  melancholy: {
    temperatureRange: [2200, 3500],
    baseTemperature: 2800,
    characteristics: {
      energy: [0.0, 0.4],
      valence: [0.0, 0.4],
      intensity: 0.8
    },
    cssClass: 'organic-emotion-melancholy',
    description: 'Deep, introspective, amber-golden tones',
    oklabBaseColor: '#f9e2af', // Catppuccin yellow - warm melancholic base
    oklabPreset: 'STANDARD',
    perceptualCharacteristics: {
      lightness: [0.4, 0.6], // Lower lightness for introspective mood
      chromaBoost: 1.1, // Enhanced warmth and saturation
      hueShift: -10 // Shift towards warmer amber tones
    }
  },
  energetic: {
    temperatureRange: [5500, 7500],
    baseTemperature: 6500,
    characteristics: {
      energy: [0.6, 1.0],
      valence: [0.5, 1.0],
      intensity: 1.0
    },
    cssClass: 'organic-emotion-energetic',
    description: 'Bright, vibrant, high-energy states',
    oklabBaseColor: '#a6e3a1', // Catppuccin green - vibrant energetic base
    oklabPreset: 'VIBRANT',
    perceptualCharacteristics: {
      lightness: [0.7, 0.9], // High lightness for energy
      chromaBoost: 1.3, // Maximum vibrancy
      hueShift: 5 // Slight shift towards more vibrant green
    }
  },
  aggressive: {
    temperatureRange: [8000, 12000],
    baseTemperature: 10000,
    characteristics: {
      energy: [0.7, 1.0],
      valence: [0.0, 0.6],
      intensity: 1.2
    },
    cssClass: 'organic-emotion-aggressive',
    description: 'Cool, intense, high-energy negative valence',
    oklabBaseColor: '#f38ba8', // Catppuccin red - intense aggressive base
    oklabPreset: 'COSMIC',
    perceptualCharacteristics: {
      lightness: [0.5, 0.7], // Moderate lightness with high intensity
      chromaBoost: 1.4, // Maximum chroma for intensity
      hueShift: -5 // Slight shift towards deeper red
    }
  },
  happy: {
    temperatureRange: [4500, 6500],
    baseTemperature: 5500,
    characteristics: {
      energy: [0.4, 0.8],
      valence: [0.6, 1.0],
      intensity: 0.9
    },
    cssClass: 'organic-emotion-happy',
    description: 'Balanced, joyful, warm-white tones',
    oklabBaseColor: '#fab387', // Catppuccin peach - warm happy base
    oklabPreset: 'STANDARD',
    perceptualCharacteristics: {
      lightness: [0.75, 0.85], // High lightness for joy
      chromaBoost: 1.15, // Enhanced warmth
      hueShift: 8 // Shift towards warmer orange
    }
  },
  romantic: {
    temperatureRange: [2500, 3500],
    baseTemperature: 3000,
    characteristics: {
      energy: [0.2, 0.6],
      valence: [0.5, 0.9],
      intensity: 0.7
    },
    cssClass: 'organic-emotion-romantic',
    description: 'Soft, intimate, warm tones with pink accent',
    oklabBaseColor: '#f5c2e7', // Catppuccin pink - romantic base
    oklabPreset: 'SUBTLE',
    perceptualCharacteristics: {
      lightness: [0.65, 0.8], // Soft, comfortable lightness
      chromaBoost: 1.0, // Natural saturation
      hueShift: 12 // Shift towards warmer pink
    }
  },
  mysterious: {
    temperatureRange: [1800, 2800],
    baseTemperature: 2300,
    characteristics: {
      energy: [0.1, 0.5],
      valence: [0.1, 0.5],
      intensity: 0.9
    },
    cssClass: 'organic-emotion-mysterious',
    description: 'Deep, enigmatic, low temperature with purple accent',
    oklabBaseColor: '#cba6f7', // Catppuccin mauve - mysterious base
    oklabPreset: 'VIBRANT',
    perceptualCharacteristics: {
      lightness: [0.3, 0.5], // Low lightness for mystery
      chromaBoost: 1.2, // Enhanced depth
      hueShift: -15 // Shift towards deeper purple
    }
  },
  epic: {
    temperatureRange: [7000, 15000],
    baseTemperature: 11000,
    characteristics: {
      energy: [0.6, 1.0],
      valence: [0.3, 0.8],
      intensity: 1.3
    },
    cssClass: 'organic-emotion-epic',
    description: 'Grand, cinematic, high contrast blue-gold',
    oklabBaseColor: '#74c7ec', // Catppuccin sapphire - epic base
    oklabPreset: 'COSMIC',
    perceptualCharacteristics: {
      lightness: [0.6, 0.9], // Wide lightness range for drama
      chromaBoost: 1.35, // Maximum cinematic impact
      hueShift: 20 // Shift towards more dramatic blue
    }
  },
  ambient: {
    temperatureRange: [3000, 5000],
    baseTemperature: 4000,
    characteristics: {
      energy: [0.1, 0.4],
      valence: [0.3, 0.7],
      intensity: 0.5
    },
    cssClass: 'organic-emotion-ambient',
    description: 'Atmospheric, floating, neutral temperature',
    oklabBaseColor: '#94e2d5', // Catppuccin teal - ambient base
    oklabPreset: 'SUBTLE',
    perceptualCharacteristics: {
      lightness: [0.5, 0.7], // Balanced lightness for atmosphere
      chromaBoost: 0.8, // Reduced chroma for subtlety
      hueShift: 0 // No hue shift for neutrality
    }
  }
};

/**
 * Maps music analysis data to emotional temperature states
 * Integrates with OKLAB color science for perceptually uniform emotional color processing
 */
export class EmotionalTemperatureMapper {
  private enableDebug: boolean;
  private oklabProcessor: OKLABColorProcessor;

  constructor(enableDebug: boolean = false) {
    this.enableDebug = enableDebug;
    this.oklabProcessor = new OKLABColorProcessor(enableDebug);
  }

  /**
   * Analyzes music data and returns the appropriate emotional temperature configuration
   */
  public mapMusicToEmotionalTemperature(musicData: MusicAnalysisData): EmotionalTemperatureResult {
    const { energy = 0.5, valence = 0.5, danceability = 0.5, tempo = 120, mode = 1 } = musicData;

    // Calculate emotional state based on energy-valence quadrants
    let primaryEmotion: EmotionalState;
    let secondaryEmotion: EmotionalState | undefined;
    let blendRatio = 1.0;

    // Primary emotion mapping using energy-valence space
    if (energy >= 0.6 && valence >= 0.6) {
      // High energy, positive valence
      primaryEmotion = danceability > 0.7 ? 'energetic' : 'happy';
      if (energy > 0.8 && valence > 0.8) {
        secondaryEmotion = 'epic';
        blendRatio = 0.7;
      }
    } else if (energy >= 0.6 && valence < 0.5) {
      // High energy, negative valence
      primaryEmotion = energy > 0.8 ? 'aggressive' : 'epic';
      if (valence < 0.3) {
        secondaryEmotion = 'mysterious';
        blendRatio = 0.8;
      }
    } else if (energy < 0.4 && valence >= 0.5) {
      // Low energy, positive valence
      primaryEmotion = valence > 0.7 ? 'calm' : 'romantic';
      if (energy < 0.2) {
        secondaryEmotion = 'ambient';
        blendRatio = 0.6;
      }
    } else {
      // Low energy, negative valence
      primaryEmotion = valence < 0.3 ? 'melancholy' : 'mysterious';
      if (energy < 0.2 && valence < 0.2) {
        secondaryEmotion = 'ambient';
        blendRatio = 0.8;
      }
    }

    // Apply genre-specific adjustments
    if (musicData.genre) {
      const genreAdjustment = this.getGenreEmotionalAdjustment(musicData.genre, primaryEmotion);
      if (genreAdjustment) {
        if (genreAdjustment.override) {
          primaryEmotion = genreAdjustment.override;
        }
        if (genreAdjustment.secondary) {
          secondaryEmotion = genreAdjustment.secondary;
          blendRatio = genreAdjustment.blendRatio || 0.7;
        }
      }
    }

    // Calculate intensity based on multiple factors
    const baseIntensity = EMOTIONAL_TEMPERATURE_MAP[primaryEmotion].characteristics.intensity;
    const energyBoost = energy * 0.3;
    const valenceInfluence = Math.abs(valence - 0.5) * 0.2; // Emotional extremes increase intensity
    const tempoInfluence = tempo > 140 ? 0.1 : tempo < 80 ? -0.1 : 0;
    
    const finalIntensity = Math.max(0.1, Math.min(1.5, 
      baseIntensity + energyBoost + valenceInfluence + tempoInfluence
    ));

    // Calculate temperature (legacy compatibility)
    const emotionData = EMOTIONAL_TEMPERATURE_MAP[primaryEmotion];
    const [minTemp, maxTemp] = emotionData.temperatureRange;
    const temperaturePosition = energy * 0.6 + valence * 0.4; // Weighted combination
    const temperature = minTemp + (maxTemp - minTemp) * temperaturePosition;

    // OKLAB processing for perceptual color accuracy
    const oklabPreset = OKLABColorProcessor.getPreset(emotionData.oklabPreset);
    let oklabResult: OKLABProcessingResult | undefined;
    let perceptualColorHex: string | undefined;

    try {
      // Process the emotional base color through OKLAB with context-aware adjustments
      const customPreset = this.createContextualOKLABPreset(
        emotionData, 
        finalIntensity, 
        energy, 
        valence
      );
      
      oklabResult = this.oklabProcessor.processColor(
        emotionData.oklabBaseColor, 
        customPreset
      );
      
      perceptualColorHex = oklabResult.enhancedHex;
      
      if (this.enableDebug) {
        console.log('🌡️ [EmotionalTemperatureMapper] OKLAB processing:', {
          emotion: primaryEmotion,
          baseColor: emotionData.oklabBaseColor,
          preset: customPreset.name,
          enhanced: perceptualColorHex,
          oklabCoords: oklabResult.oklabEnhanced
        });
      }
    } catch (error) {
      if (this.enableDebug) {
        console.warn('🌡️ [EmotionalTemperatureMapper] OKLAB processing failed:', error);
      }
      // Fallback to base color
      perceptualColorHex = emotionData.oklabBaseColor;
    }

    // Generate CSS variables for the emotional temperature system with OKLAB integration
    const cssVariables = this.generateEmotionalCSSVariables(
      primaryEmotion, 
      secondaryEmotion, 
      finalIntensity, 
      temperature,
      blendRatio,
      oklabResult,
      perceptualColorHex
    );

    const result: EmotionalTemperatureResult = {
      primaryEmotion,
      ...(secondaryEmotion && { secondaryEmotion }),
      intensity: finalIntensity,
      temperature: Math.round(temperature),
      blendRatio,
      cssClass: emotionData.cssClass,
      cssVariables,
      // OKLAB integration
      oklabPreset: oklabPreset,
      ...(oklabResult && { oklabResult }),
      ...(perceptualColorHex && { perceptualColorHex })
    };

    if (this.enableDebug) {
      console.log('🌡️ [EmotionalTemperatureMapper] Music analysis result:', {
        input: { energy, valence, genre: musicData.genre },
        output: result,
        reasoning: {
          energyValenceQuadrant: this.getEnergyValenceQuadrant(energy, valence),
          genreInfluence: musicData.genre,
          intensityFactors: { baseIntensity, energyBoost, valenceInfluence, tempoInfluence }
        }
      });
    }

    return result;
  }

  /**
   * Create contextual OKLAB preset based on emotional characteristics and music data
   */
  private createContextualOKLABPreset(
    emotionData: any,
    intensity: number,
    energy: number,
    valence: number
  ): EnhancementPreset {
    const basePreset = OKLABColorProcessor.getPreset(emotionData.oklabPreset);
    const perceptualChars = emotionData.perceptualCharacteristics;
    
    // Adjust lightness based on energy and valence
    const lightnessFactor = energy * 0.5 + valence * 0.3 + 0.2; // 0.2 to 1.0
    const targetLightness = perceptualChars.lightness[0] + 
      (perceptualChars.lightness[1] - perceptualChars.lightness[0]) * lightnessFactor;
    
    // Adjust chroma based on intensity and energy
    const chromaMultiplier = perceptualChars.chromaBoost * intensity * (0.8 + energy * 0.4);
    
    // Create custom preset
    return OKLABColorProcessor.createCustomPreset(
      `${emotionData.cssClass}-contextual`,
      `Contextual ${basePreset.description} for ${emotionData.description}`,
      targetLightness / 0.5, // Convert to lightness boost multiplier
      chromaMultiplier,
      basePreset.shadowReduction,
      basePreset.vibrantThreshold
    );
  }

  /**
   * Get genre-specific emotional adjustments
   */
  private getGenreEmotionalAdjustment(genre: string, currentEmotion: EmotionalState): {
    override?: EmotionalState;
    secondary?: EmotionalState;
    blendRatio?: number;
  } | null {
    const genreMap: Record<string, {
      override?: EmotionalState;
      secondary?: EmotionalState;
      blendRatio?: number;
    }> = {
      // Electronic genres
      'edm': { secondary: 'energetic', blendRatio: 0.8 },
      'house': { secondary: 'energetic', blendRatio: 0.7 },
      'ambient': { override: 'ambient' },
      'downtempo': { override: 'calm', secondary: 'ambient', blendRatio: 0.6 },
      
      // Rock genres
      'metal': { override: 'aggressive' },
      'hard-rock': { secondary: 'aggressive', blendRatio: 0.8 },
      'alternative': { secondary: 'epic', blendRatio: 0.7 },
      
      // Classical and orchestral
      'classical': { override: 'epic', secondary: 'calm', blendRatio: 0.6 },
      'soundtrack': { override: 'epic' },
      'orchestral': { override: 'epic' },
      
      // Jazz and soul
      'jazz': { override: 'mysterious', secondary: 'romantic', blendRatio: 0.7 },
      'blues': { override: 'melancholy' },
      'soul': { secondary: 'romantic', blendRatio: 0.6 },
      
      // Folk and acoustic
      'folk': { override: 'calm', secondary: 'melancholy', blendRatio: 0.6 },
      'acoustic': { override: 'romantic', secondary: 'calm', blendRatio: 0.7 },
      
      // Hip-hop and urban
      'hip-hop': { secondary: 'aggressive', blendRatio: 0.8 },
      'trap': { secondary: 'aggressive', blendRatio: 0.9 },
      
      // Pop variations
      'pop': { secondary: 'happy', blendRatio: 0.7 },
      'indie-pop': { secondary: 'happy', blendRatio: 0.6 }
    };

    const normalizedGenre = genre.toLowerCase().replace(/[\s-_]/g, '-');
    return genreMap[normalizedGenre] || null;
  }

  /**
   * Determine energy-valence quadrant for debugging
   */
  private getEnergyValenceQuadrant(energy: number, valence: number): string {
    if (energy >= 0.5 && valence >= 0.5) return 'High Energy + Positive';
    if (energy >= 0.5 && valence < 0.5) return 'High Energy + Negative';
    if (energy < 0.5 && valence >= 0.5) return 'Low Energy + Positive';
    return 'Low Energy + Negative';
  }

  /**
   * Generate CSS variables for emotional temperature integration with OKLAB enhancement
   */
  private generateEmotionalCSSVariables(
    primary: EmotionalState,
    secondary: EmotionalState | undefined,
    intensity: number,
    temperature: number,
    blendRatio: number,
    oklabResult?: OKLABProcessingResult,
    perceptualColorHex?: string
  ): Record<string, string> {
    const cssVars: Record<string, string> = {};

    // Core emotional temperature variables
    cssVars['--organic-current-emotion'] = primary;
    cssVars['--organic-emotional-intensity'] = intensity.toString();
    cssVars['--organic-current-temperature'] = temperature.toString();
    
    // Dynamic emotional state variables
    cssVars['--organic-emotion-primary'] = primary;
    if (secondary) {
      cssVars['--organic-emotion-secondary'] = secondary;
      cssVars['--organic-emotion-blend-ratio'] = blendRatio.toString();
    }

    // Intensity-based variables for mixins
    cssVars['--organic-emotional-saturation'] = Math.max(0.5, intensity).toString();
    cssVars['--organic-cinematic-contrast'] = Math.max(0.8, intensity * 1.2).toString();
    cssVars['--organic-warmth'] = this.calculateWarmth(temperature).toString();

    // Breathing and animation variables
    const breathingSpeed = this.calculateBreathingSpeed(primary, intensity);
    cssVars['--organic-breathing-cycle'] = `${breathingSpeed}s`;
    
    // Temperature-based filter adjustments
    const temperatureFilters = this.calculateTemperatureFilters(temperature, intensity);
    Object.assign(cssVars, temperatureFilters);

    // OKLAB enhanced variables for perceptual color processing
    if (oklabResult && perceptualColorHex) {
      // Core OKLAB color variables
      cssVars['--organic-emotion-oklab-hex'] = perceptualColorHex;
      cssVars['--organic-emotion-oklab-rgb'] = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
      
      // OKLAB space coordinates for advanced effects
      cssVars['--organic-emotion-oklab-l'] = oklabResult.oklabEnhanced.L.toFixed(3);
      cssVars['--organic-emotion-oklab-a'] = oklabResult.oklabEnhanced.a.toFixed(3);
      cssVars['--organic-emotion-oklab-b'] = oklabResult.oklabEnhanced.b.toFixed(3);
      
      // OKLCH representation for hue-based animations
      cssVars['--organic-emotion-oklch-l'] = oklabResult.oklchEnhanced.L.toFixed(3);
      cssVars['--organic-emotion-oklch-c'] = oklabResult.oklchEnhanced.C.toFixed(3);
      cssVars['--organic-emotion-oklch-h'] = oklabResult.oklchEnhanced.H.toFixed(1);
      
      // Shadow color for depth effects
      cssVars['--organic-emotion-oklab-shadow-hex'] = oklabResult.shadowHex;
      cssVars['--organic-emotion-oklab-shadow-rgb'] = `${oklabResult.shadowRgb.r},${oklabResult.shadowRgb.g},${oklabResult.shadowRgb.b}`;
      
      // Replace legacy temperature-based color with OKLAB-enhanced color
      cssVars['--organic-perceptual-emotion-color'] = perceptualColorHex;
      cssVars['--organic-perceptual-emotion-rgb'] = `${oklabResult.enhancedRgb.r},${oklabResult.enhancedRgb.g},${oklabResult.enhancedRgb.b}`;
      
      if (this.enableDebug) {
        console.log('🎨 [EmotionalTemperatureMapper] Generated OKLAB CSS variables:', {
          emotion: primary,
          perceptualColor: perceptualColorHex,
          oklabCoords: oklabResult.oklabEnhanced,
          oklchCoords: oklabResult.oklchEnhanced
        });
      }
    }

    return cssVars;
  }

  /**
   * Calculate warmth factor based on temperature (0-1)
   */
  private calculateWarmth(temperature: number): number {
    // Map temperature to warmth scale
    // Lower temperatures (1800K-4000K) = warmer (0.8-1.0)
    // Higher temperatures (7000K-15000K) = cooler (0.2-0.5)
    if (temperature <= 4000) {
      return 0.7 + (4000 - temperature) / (4000 - 1800) * 0.3; // 0.7-1.0
    } else if (temperature >= 7000) {
      return Math.max(0.2, 0.7 - (temperature - 7000) / (15000 - 7000) * 0.5); // 0.7-0.2
    } else {
      // Mid-range temperatures (4000K-7000K) = neutral (0.5-0.7)
      return 0.5 + (7000 - temperature) / (7000 - 4000) * 0.2; // 0.5-0.7
    }
  }

  /**
   * Calculate breathing animation speed based on emotion and intensity
   */
  private calculateBreathingSpeed(emotion: EmotionalState, intensity: number): number {
    const baseSpeed: Record<EmotionalState, number> = {
      calm: 6.0,
      melancholy: 8.0,
      energetic: 2.0,
      aggressive: 1.5,
      happy: 3.0,
      romantic: 5.0,
      mysterious: 7.0,
      epic: 2.5,
      ambient: 10.0
    };

    const base = baseSpeed[emotion];
    // Higher intensity = faster breathing
    const intensityFactor = Math.max(0.5, Math.min(2.0, 2.0 - intensity));
    return base * intensityFactor;
  }

  /**
   * Calculate temperature-based CSS filter adjustments
   */
  private calculateTemperatureFilters(temperature: number, intensity: number): Record<string, string> {
    const filters: Record<string, string> = {};

    // Hue rotation based on temperature
    const hueRotation = this.mapTemperatureToHue(temperature);
    filters['--organic-temperature-hue-shift'] = `${hueRotation}deg`;

    // Saturation based on temperature and intensity
    const saturation = Math.max(0.8, Math.min(1.5, 1.0 + (intensity - 0.5) * 0.4));
    filters['--organic-temperature-saturation'] = saturation.toString();

    // Brightness based on temperature
    const brightness = this.mapTemperatureToBrightness(temperature);
    filters['--organic-temperature-brightness'] = brightness.toString();

    return filters;
  }

  /**
   * Map temperature to hue rotation (-30 to +30 degrees)
   */
  private mapTemperatureToHue(temperature: number): number {
    // Warm temperatures (2000K-4000K) -> warmer hues (orange/red shift)
    // Cool temperatures (8000K-15000K) -> cooler hues (blue shift)
    if (temperature <= 4000) {
      return -15 + (4000 - temperature) / (4000 - 2000) * -15; // -15 to -30
    } else if (temperature >= 8000) {
      return 10 + (temperature - 8000) / (15000 - 8000) * 20; // +10 to +30
    } else {
      // Mid-range: slight warm shift
      return -5 + (temperature - 4000) / (8000 - 4000) * 15; // -5 to +10
    }
  }

  /**
   * Map temperature to brightness adjustment (0.8-1.2)
   */
  private mapTemperatureToBrightness(temperature: number): number {
    // Higher temperatures generally appear brighter
    const normalized = (temperature - 2000) / (15000 - 2000); // 0-1
    return 0.9 + normalized * 0.3; // 0.9-1.2
  }

  /**
   * Apply emotional temperature to an element via CSS class and variables
   */
  public applyEmotionalTemperature(
    element: HTMLElement, 
    result: EmotionalTemperatureResult
  ): void {
    // Remove existing emotion classes
    const existingClasses = Array.from(element.classList).filter(cls => 
      cls.startsWith('organic-emotion-')
    );
    element.classList.remove(...existingClasses);

    // Apply primary emotion class
    element.classList.add(result.cssClass);

    // Apply secondary emotion modifier if present
    if (result.secondaryEmotion) {
      element.classList.add(`organic-emotion-blend-${result.secondaryEmotion}`);
    }

    // Apply CSS variables
    Object.entries(result.cssVariables).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });

    if (this.enableDebug) {
      console.log('🎨 [EmotionalTemperatureMapper] Applied emotional temperature:', {
        element: element.tagName,
        emotion: result.primaryEmotion,
        secondary: result.secondaryEmotion,
        intensity: result.intensity,
        temperature: result.temperature
      });
    }
  }

  /**
   * Get all available emotional states
   */
  public static getAvailableEmotions(): EmotionalState[] {
    return Object.keys(EMOTIONAL_TEMPERATURE_MAP) as EmotionalState[];
  }

  /**
   * Get emotion characteristics for a specific state
   */
  public static getEmotionCharacteristics(emotion: EmotionalState) {
    return EMOTIONAL_TEMPERATURE_MAP[emotion];
  }
}