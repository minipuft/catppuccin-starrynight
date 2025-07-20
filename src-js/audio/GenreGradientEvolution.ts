/**
 * GenreGradientEvolution - Musical Genre to Visual Style Evolution
 * Part of the Year 3000 Flux Consciousness System
 *
 * Creates distinct gradient visual styles for different music genres:
 * - Electronic: Synthetic, digital patterns with sharp edges
 * - Rock: Bold, high-energy gradients with strong contrast
 * - Classical: Elegant, sophisticated gradients with smooth transitions
 * - Jazz: Complex, improvisational gradients with organic movement
 * - Hip-Hop: Urban, rhythmic gradients with geometric patterns
 * - Ambient: Atmospheric, ethereal gradients with slow evolution
 * - Pop: Bright, accessible gradients with catchy visual hooks
 * - Metal: Intense, dark gradients with aggressive patterns
 * - Folk: Natural, organic gradients with earthy tones
 * - Funk: Groovy, rhythmic gradients with syncopated patterns
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { EmotionalGradientMapper, EmotionalProfile } from "@/audio/EmotionalGradientMapper";
import { FluxSpectralAnalyzer, SpectralData } from "@/audio/FluxSpectralAnalyzer";
import { SettingsManager } from "@/ui/managers/SettingsManager";

export type MusicGenre = 
  | "electronic" 
  | "rock" 
  | "classical" 
  | "jazz" 
  | "hip-hop" 
  | "ambient" 
  | "pop" 
  | "metal" 
  | "folk" 
  | "funk"
  | "indie"
  | "reggae"
  | "blues"
  | "country"
  | "techno"
  | "house"
  | "trance"
  | "dubstep"
  | "unknown";

export interface GenreCharacteristics {
  // Frequency signature patterns
  bassEmphasis: number;        // 0-1 how much bass is emphasized
  midFrequencyPattern: number; // 0-1 mid-frequency prominence
  trebleSharpness: number;     // 0-1 treble frequency crispness
  dynamicRange: number;        // 0-1 variation in volume levels
  
  // Rhythmic patterns
  rhythmComplexity: number;    // 0-1 complexity of rhythm patterns
  syncopation: number;         // 0-1 off-beat emphasis
  grooveWeight: number;        // 0-1 groove/pocket feeling
  tempoVariability: number;    // 0-1 tempo fluctuation tolerance
  
  // Harmonic structure
  harmonicComplexity: number;  // 0-1 chord/harmony complexity
  dissonanceTolerance: number; // 0-1 acceptance of dissonance
  modalInfluence: number;      // 0-1 use of non-major/minor modes
  microtonal: number;          // 0-1 use of non-12-tone scales
  
  // Production characteristics
  compression: number;         // 0-1 dynamic range compression
  saturation: number;          // 0-1 harmonic saturation/distortion
  stereoWidth: number;         // 0-1 stereo field utilization
  artificialProcessing: number; // 0-1 electronic/synthetic processing
  
  // Cultural/aesthetic markers
  organicness: number;         // 0-1 natural vs synthetic feel
  accessibility: number;       // 0-1 mainstream appeal/complexity
  experimentalFactor: number;  // 0-1 avant-garde/experimental nature
  emotionalRange: number;      // 0-1 emotional expression breadth
}

export interface GenreVisualStyle {
  // Core visual identity
  primaryHueRange: [number, number];    // [min, max] hue degrees
  saturationProfile: [number, number];  // [base, variation] saturation
  brightnessProfile: [number, number];  // [base, variation] brightness
  contrastLevel: number;                // 0-1 overall contrast intensity
  
  // Pattern characteristics
  gradientComplexity: number;           // 0-1 number of gradient layers
  shapeGeometry: "organic" | "geometric" | "abstract" | "hybrid";
  edgeSharpness: number;                // 0-1 soft to sharp gradient edges
  symmetryLevel: number;                // 0-1 symmetrical to asymmetrical
  
  // Animation behavior
  animationStyle: "smooth" | "rhythmic" | "chaotic" | "minimal";
  pulseBehavior: "steady" | "syncopated" | "irregular" | "subtle";
  flowDirection: "radial" | "linear" | "spiral" | "random";
  transitionCharacter: "fluid" | "sharp" | "organic" | "mechanical";
  
  // Layer interaction
  layerBlending: "harmonious" | "contrasting" | "complementary" | "clashing";
  depthIllusion: number;                // 0-1 3D depth perception
  particleInfluence: number;            // 0-1 cosmic noise prominence
  nebulaCharacter: "ethereal" | "dense" | "wispy" | "structured";
  
  // Temporal behavior
  memoryInfluence: number;              // 0-1 past state influence
  adaptationSpeed: number;              // 0-1 how quickly style adapts
  stabilityPreference: number;          // 0-1 stability vs dynamic change
  emergencePattern: "gradual" | "sudden" | "cyclical" | "progressive";
}

export class GenreGradientEvolution {
  private cssVariableBatcher: CSSVariableBatcher;
  private musicSyncService: MusicSyncService | null = null;
  private emotionalGradientMapper: EmotionalGradientMapper | null = null;
  private settingsManager: SettingsManager | null = null;
  
  private currentGenre: MusicGenre = "unknown";
  private genreConfidence = 0.0;
  private genreHistory: { genre: MusicGenre; confidence: number; timestamp: number }[] = [];
  private maxHistorySize = 30;
  
  private genreAnalysisBuffer: SpectralData[] = [];
  private bufferSize = 100; // Analyze 100 frames for genre detection
  
  private isActive = false;
  private boundSpectralHandler: ((event: Event) => void) | null = null;
  private boundEmotionalHandler: ((event: Event) => void) | null = null;
  
  // Genre characteristic profiles
  private genreProfiles: { [key in MusicGenre]: GenreCharacteristics } = {
    electronic: {
      bassEmphasis: 0.8, midFrequencyPattern: 0.6, trebleSharpness: 0.9, dynamicRange: 0.7,
      rhythmComplexity: 0.6, syncopation: 0.4, grooveWeight: 0.7, tempoVariability: 0.3,
      harmonicComplexity: 0.5, dissonanceTolerance: 0.6, modalInfluence: 0.4, microtonal: 0.2,
      compression: 0.8, saturation: 0.6, stereoWidth: 0.8, artificialProcessing: 0.9,
      organicness: 0.2, accessibility: 0.6, experimentalFactor: 0.7, emotionalRange: 0.6
    },
    rock: {
      bassEmphasis: 0.7, midFrequencyPattern: 0.8, trebleSharpness: 0.7, dynamicRange: 0.8,
      rhythmComplexity: 0.6, syncopation: 0.3, grooveWeight: 0.8, tempoVariability: 0.4,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.5, modalInfluence: 0.3, microtonal: 0.1,
      compression: 0.6, saturation: 0.7, stereoWidth: 0.7, artificialProcessing: 0.4,
      organicness: 0.6, accessibility: 0.8, experimentalFactor: 0.4, emotionalRange: 0.8
    },
    classical: {
      bassEmphasis: 0.5, midFrequencyPattern: 0.7, trebleSharpness: 0.6, dynamicRange: 0.9,
      rhythmComplexity: 0.8, syncopation: 0.2, grooveWeight: 0.4, tempoVariability: 0.7,
      harmonicComplexity: 0.9, dissonanceTolerance: 0.4, modalInfluence: 0.6, microtonal: 0.3,
      compression: 0.3, saturation: 0.2, stereoWidth: 0.8, artificialProcessing: 0.1,
      organicness: 0.9, accessibility: 0.4, experimentalFactor: 0.6, emotionalRange: 0.9
    },
    jazz: {
      bassEmphasis: 0.6, midFrequencyPattern: 0.8, trebleSharpness: 0.5, dynamicRange: 0.8,
      rhythmComplexity: 0.9, syncopation: 0.8, grooveWeight: 0.9, tempoVariability: 0.6,
      harmonicComplexity: 0.9, dissonanceTolerance: 0.7, modalInfluence: 0.8, microtonal: 0.4,
      compression: 0.4, saturation: 0.3, stereoWidth: 0.7, artificialProcessing: 0.2,
      organicness: 0.8, accessibility: 0.5, experimentalFactor: 0.8, emotionalRange: 0.8
    },
    "hip-hop": {
      bassEmphasis: 0.9, midFrequencyPattern: 0.7, trebleSharpness: 0.8, dynamicRange: 0.6,
      rhythmComplexity: 0.7, syncopation: 0.6, grooveWeight: 0.9, tempoVariability: 0.3,
      harmonicComplexity: 0.4, dissonanceTolerance: 0.5, modalInfluence: 0.3, microtonal: 0.1,
      compression: 0.8, saturation: 0.6, stereoWidth: 0.6, artificialProcessing: 0.7,
      organicness: 0.4, accessibility: 0.8, experimentalFactor: 0.5, emotionalRange: 0.7
    },
    ambient: {
      bassEmphasis: 0.4, midFrequencyPattern: 0.5, trebleSharpness: 0.3, dynamicRange: 0.9,
      rhythmComplexity: 0.2, syncopation: 0.1, grooveWeight: 0.2, tempoVariability: 0.8,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.6, modalInfluence: 0.7, microtonal: 0.5,
      compression: 0.5, saturation: 0.4, stereoWidth: 0.9, artificialProcessing: 0.6,
      organicness: 0.7, accessibility: 0.3, experimentalFactor: 0.8, emotionalRange: 0.6
    },
    pop: {
      bassEmphasis: 0.6, midFrequencyPattern: 0.8, trebleSharpness: 0.7, dynamicRange: 0.6,
      rhythmComplexity: 0.4, syncopation: 0.3, grooveWeight: 0.7, tempoVariability: 0.2,
      harmonicComplexity: 0.5, dissonanceTolerance: 0.3, modalInfluence: 0.2, microtonal: 0.1,
      compression: 0.8, saturation: 0.5, stereoWidth: 0.6, artificialProcessing: 0.5,
      organicness: 0.5, accessibility: 0.9, experimentalFactor: 0.2, emotionalRange: 0.7
    },
    metal: {
      bassEmphasis: 0.8, midFrequencyPattern: 0.7, trebleSharpness: 0.9, dynamicRange: 0.7,
      rhythmComplexity: 0.7, syncopation: 0.4, grooveWeight: 0.8, tempoVariability: 0.3,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.8, modalInfluence: 0.5, microtonal: 0.2,
      compression: 0.7, saturation: 0.9, stereoWidth: 0.7, artificialProcessing: 0.6,
      organicness: 0.4, accessibility: 0.6, experimentalFactor: 0.5, emotionalRange: 0.8
    },
    folk: {
      bassEmphasis: 0.4, midFrequencyPattern: 0.7, trebleSharpness: 0.5, dynamicRange: 0.7,
      rhythmComplexity: 0.4, syncopation: 0.2, grooveWeight: 0.6, tempoVariability: 0.5,
      harmonicComplexity: 0.5, dissonanceTolerance: 0.3, modalInfluence: 0.6, microtonal: 0.2,
      compression: 0.3, saturation: 0.2, stereoWidth: 0.5, artificialProcessing: 0.1,
      organicness: 0.9, accessibility: 0.7, experimentalFactor: 0.3, emotionalRange: 0.7
    },
    funk: {
      bassEmphasis: 0.9, midFrequencyPattern: 0.8, trebleSharpness: 0.6, dynamicRange: 0.7,
      rhythmComplexity: 0.8, syncopation: 0.9, grooveWeight: 1.0, tempoVariability: 0.4,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.5, modalInfluence: 0.4, microtonal: 0.2,
      compression: 0.6, saturation: 0.5, stereoWidth: 0.6, artificialProcessing: 0.3,
      organicness: 0.7, accessibility: 0.7, experimentalFactor: 0.4, emotionalRange: 0.6
    },
    indie: {
      bassEmphasis: 0.5, midFrequencyPattern: 0.7, trebleSharpness: 0.6, dynamicRange: 0.7,
      rhythmComplexity: 0.6, syncopation: 0.4, grooveWeight: 0.6, tempoVariability: 0.5,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.5, modalInfluence: 0.5, microtonal: 0.3,
      compression: 0.5, saturation: 0.4, stereoWidth: 0.7, artificialProcessing: 0.3,
      organicness: 0.7, accessibility: 0.6, experimentalFactor: 0.6, emotionalRange: 0.7
    },
    reggae: {
      bassEmphasis: 0.8, midFrequencyPattern: 0.6, trebleSharpness: 0.5, dynamicRange: 0.6,
      rhythmComplexity: 0.5, syncopation: 0.7, grooveWeight: 0.8, tempoVariability: 0.3,
      harmonicComplexity: 0.4, dissonanceTolerance: 0.3, modalInfluence: 0.4, microtonal: 0.2,
      compression: 0.6, saturation: 0.4, stereoWidth: 0.6, artificialProcessing: 0.3,
      organicness: 0.6, accessibility: 0.7, experimentalFactor: 0.3, emotionalRange: 0.6
    },
    blues: {
      bassEmphasis: 0.6, midFrequencyPattern: 0.8, trebleSharpness: 0.6, dynamicRange: 0.8,
      rhythmComplexity: 0.5, syncopation: 0.4, grooveWeight: 0.8, tempoVariability: 0.6,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.4, modalInfluence: 0.7, microtonal: 0.3,
      compression: 0.4, saturation: 0.5, stereoWidth: 0.5, artificialProcessing: 0.2,
      organicness: 0.8, accessibility: 0.7, experimentalFactor: 0.4, emotionalRange: 0.8
    },
    country: {
      bassEmphasis: 0.5, midFrequencyPattern: 0.7, trebleSharpness: 0.6, dynamicRange: 0.7,
      rhythmComplexity: 0.4, syncopation: 0.3, grooveWeight: 0.6, tempoVariability: 0.4,
      harmonicComplexity: 0.4, dissonanceTolerance: 0.2, modalInfluence: 0.3, microtonal: 0.1,
      compression: 0.5, saturation: 0.3, stereoWidth: 0.6, artificialProcessing: 0.2,
      organicness: 0.8, accessibility: 0.8, experimentalFactor: 0.2, emotionalRange: 0.7
    },
    techno: {
      bassEmphasis: 0.9, midFrequencyPattern: 0.5, trebleSharpness: 0.8, dynamicRange: 0.5,
      rhythmComplexity: 0.6, syncopation: 0.3, grooveWeight: 0.8, tempoVariability: 0.2,
      harmonicComplexity: 0.4, dissonanceTolerance: 0.6, modalInfluence: 0.3, microtonal: 0.3,
      compression: 0.9, saturation: 0.7, stereoWidth: 0.8, artificialProcessing: 1.0,
      organicness: 0.1, accessibility: 0.5, experimentalFactor: 0.6, emotionalRange: 0.5
    },
    house: {
      bassEmphasis: 0.8, midFrequencyPattern: 0.6, trebleSharpness: 0.7, dynamicRange: 0.6,
      rhythmComplexity: 0.5, syncopation: 0.4, grooveWeight: 0.9, tempoVariability: 0.2,
      harmonicComplexity: 0.5, dissonanceTolerance: 0.4, modalInfluence: 0.3, microtonal: 0.2,
      compression: 0.8, saturation: 0.6, stereoWidth: 0.7, artificialProcessing: 0.8,
      organicness: 0.3, accessibility: 0.8, experimentalFactor: 0.4, emotionalRange: 0.6
    },
    trance: {
      bassEmphasis: 0.7, midFrequencyPattern: 0.7, trebleSharpness: 0.8, dynamicRange: 0.8,
      rhythmComplexity: 0.5, syncopation: 0.2, grooveWeight: 0.7, tempoVariability: 0.3,
      harmonicComplexity: 0.6, dissonanceTolerance: 0.5, modalInfluence: 0.4, microtonal: 0.3,
      compression: 0.7, saturation: 0.5, stereoWidth: 0.9, artificialProcessing: 0.8,
      organicness: 0.2, accessibility: 0.6, experimentalFactor: 0.5, emotionalRange: 0.8
    },
    dubstep: {
      bassEmphasis: 1.0, midFrequencyPattern: 0.5, trebleSharpness: 0.9, dynamicRange: 0.9,
      rhythmComplexity: 0.7, syncopation: 0.6, grooveWeight: 0.8, tempoVariability: 0.4,
      harmonicComplexity: 0.4, dissonanceTolerance: 0.8, modalInfluence: 0.3, microtonal: 0.4,
      compression: 0.8, saturation: 0.8, stereoWidth: 0.8, artificialProcessing: 0.9,
      organicness: 0.1, accessibility: 0.4, experimentalFactor: 0.7, emotionalRange: 0.6
    },
    unknown: {
      bassEmphasis: 0.5, midFrequencyPattern: 0.5, trebleSharpness: 0.5, dynamicRange: 0.5,
      rhythmComplexity: 0.5, syncopation: 0.5, grooveWeight: 0.5, tempoVariability: 0.5,
      harmonicComplexity: 0.5, dissonanceTolerance: 0.5, modalInfluence: 0.5, microtonal: 0.5,
      compression: 0.5, saturation: 0.5, stereoWidth: 0.5, artificialProcessing: 0.5,
      organicness: 0.5, accessibility: 0.5, experimentalFactor: 0.5, emotionalRange: 0.5
    }
  };

  // Genre visual style profiles
  private genreVisualStyles: { [key in MusicGenre]: GenreVisualStyle } = {
    electronic: {
      primaryHueRange: [180, 270], saturationProfile: [0.8, 0.3], brightnessProfile: [1.1, 0.4], contrastLevel: 0.8,
      gradientComplexity: 0.8, shapeGeometry: "geometric", edgeSharpness: 0.9, symmetryLevel: 0.7,
      animationStyle: "rhythmic", pulseBehavior: "steady", flowDirection: "linear", transitionCharacter: "mechanical",
      layerBlending: "contrasting", depthIllusion: 0.6, particleInfluence: 0.8, nebulaCharacter: "structured",
      memoryInfluence: 0.3, adaptationSpeed: 0.8, stabilityPreference: 0.6, emergencePattern: "sudden"
    },
    rock: {
      primaryHueRange: [330, 30], saturationProfile: [1.2, 0.5], brightnessProfile: [1.2, 0.3], contrastLevel: 0.9,
      gradientComplexity: 0.7, shapeGeometry: "hybrid", edgeSharpness: 0.7, symmetryLevel: 0.5,
      animationStyle: "rhythmic", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "sharp",
      layerBlending: "harmonious", depthIllusion: 0.7, particleInfluence: 0.6, nebulaCharacter: "dense",
      memoryInfluence: 0.4, adaptationSpeed: 0.7, stabilityPreference: 0.7, emergencePattern: "gradual"
    },
    classical: {
      primaryHueRange: [45, 135], saturationProfile: [0.6, 0.4], brightnessProfile: [1.0, 0.5], contrastLevel: 0.6,
      gradientComplexity: 0.9, shapeGeometry: "organic", edgeSharpness: 0.3, symmetryLevel: 0.8,
      animationStyle: "smooth", pulseBehavior: "subtle", flowDirection: "spiral", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.9, particleInfluence: 0.4, nebulaCharacter: "ethereal",
      memoryInfluence: 0.8, adaptationSpeed: 0.3, stabilityPreference: 0.9, emergencePattern: "progressive"
    },
    jazz: {
      primaryHueRange: [30, 90], saturationProfile: [0.7, 0.6], brightnessProfile: [0.9, 0.6], contrastLevel: 0.7,
      gradientComplexity: 0.8, shapeGeometry: "abstract", edgeSharpness: 0.5, symmetryLevel: 0.3,
      animationStyle: "chaotic", pulseBehavior: "syncopated", flowDirection: "random", transitionCharacter: "organic",
      layerBlending: "complementary", depthIllusion: 0.8, particleInfluence: 0.7, nebulaCharacter: "wispy",
      memoryInfluence: 0.6, adaptationSpeed: 0.6, stabilityPreference: 0.4, emergencePattern: "cyclical"
    },
    "hip-hop": {
      primaryHueRange: [270, 330], saturationProfile: [1.0, 0.4], brightnessProfile: [1.1, 0.3], contrastLevel: 0.8,
      gradientComplexity: 0.6, shapeGeometry: "geometric", edgeSharpness: 0.8, symmetryLevel: 0.6,
      animationStyle: "rhythmic", pulseBehavior: "syncopated", flowDirection: "linear", transitionCharacter: "sharp",
      layerBlending: "contrasting", depthIllusion: 0.5, particleInfluence: 0.9, nebulaCharacter: "structured",
      memoryInfluence: 0.2, adaptationSpeed: 0.9, stabilityPreference: 0.5, emergencePattern: "sudden"
    },
    ambient: {
      primaryHueRange: [180, 240], saturationProfile: [0.4, 0.3], brightnessProfile: [0.8, 0.4], contrastLevel: 0.3,
      gradientComplexity: 0.9, shapeGeometry: "organic", edgeSharpness: 0.2, symmetryLevel: 0.4,
      animationStyle: "minimal", pulseBehavior: "subtle", flowDirection: "spiral", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.9, particleInfluence: 0.3, nebulaCharacter: "ethereal",
      memoryInfluence: 0.9, adaptationSpeed: 0.1, stabilityPreference: 0.9, emergencePattern: "gradual"
    },
    pop: {
      primaryHueRange: [300, 60], saturationProfile: [1.1, 0.3], brightnessProfile: [1.2, 0.2], contrastLevel: 0.7,
      gradientComplexity: 0.6, shapeGeometry: "hybrid", edgeSharpness: 0.6, symmetryLevel: 0.7,
      animationStyle: "rhythmic", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.6, particleInfluence: 0.5, nebulaCharacter: "dense",
      memoryInfluence: 0.5, adaptationSpeed: 0.7, stabilityPreference: 0.8, emergencePattern: "gradual"
    },
    metal: {
      primaryHueRange: [0, 30], saturationProfile: [0.9, 0.4], brightnessProfile: [0.7, 0.4], contrastLevel: 1.0,
      gradientComplexity: 0.7, shapeGeometry: "geometric", edgeSharpness: 0.9, symmetryLevel: 0.6,
      animationStyle: "chaotic", pulseBehavior: "irregular", flowDirection: "radial", transitionCharacter: "sharp",
      layerBlending: "clashing", depthIllusion: 0.8, particleInfluence: 0.7, nebulaCharacter: "dense",
      memoryInfluence: 0.3, adaptationSpeed: 0.8, stabilityPreference: 0.3, emergencePattern: "sudden"
    },
    folk: {
      primaryHueRange: [60, 120], saturationProfile: [0.6, 0.3], brightnessProfile: [0.9, 0.3], contrastLevel: 0.5,
      gradientComplexity: 0.5, shapeGeometry: "organic", edgeSharpness: 0.3, symmetryLevel: 0.5,
      animationStyle: "smooth", pulseBehavior: "subtle", flowDirection: "spiral", transitionCharacter: "organic",
      layerBlending: "harmonious", depthIllusion: 0.6, particleInfluence: 0.3, nebulaCharacter: "wispy",
      memoryInfluence: 0.7, adaptationSpeed: 0.4, stabilityPreference: 0.8, emergencePattern: "progressive"
    },
    funk: {
      primaryHueRange: [30, 90], saturationProfile: [1.0, 0.5], brightnessProfile: [1.0, 0.4], contrastLevel: 0.8,
      gradientComplexity: 0.7, shapeGeometry: "abstract", edgeSharpness: 0.6, symmetryLevel: 0.4,
      animationStyle: "rhythmic", pulseBehavior: "syncopated", flowDirection: "random", transitionCharacter: "organic",
      layerBlending: "complementary", depthIllusion: 0.7, particleInfluence: 0.8, nebulaCharacter: "wispy",
      memoryInfluence: 0.4, adaptationSpeed: 0.8, stabilityPreference: 0.5, emergencePattern: "cyclical"
    },
    indie: {
      primaryHueRange: [120, 240], saturationProfile: [0.7, 0.4], brightnessProfile: [0.9, 0.4], contrastLevel: 0.6,
      gradientComplexity: 0.7, shapeGeometry: "hybrid", edgeSharpness: 0.4, symmetryLevel: 0.5,
      animationStyle: "smooth", pulseBehavior: "steady", flowDirection: "spiral", transitionCharacter: "fluid",
      layerBlending: "complementary", depthIllusion: 0.7, particleInfluence: 0.5, nebulaCharacter: "wispy",
      memoryInfluence: 0.6, adaptationSpeed: 0.5, stabilityPreference: 0.7, emergencePattern: "progressive"
    },
    reggae: {
      primaryHueRange: [90, 150], saturationProfile: [0.8, 0.3], brightnessProfile: [1.0, 0.3], contrastLevel: 0.6,
      gradientComplexity: 0.5, shapeGeometry: "organic", edgeSharpness: 0.4, symmetryLevel: 0.6,
      animationStyle: "rhythmic", pulseBehavior: "syncopated", flowDirection: "linear", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.5, particleInfluence: 0.4, nebulaCharacter: "wispy",
      memoryInfluence: 0.6, adaptationSpeed: 0.5, stabilityPreference: 0.7, emergencePattern: "cyclical"
    },
    blues: {
      primaryHueRange: [200, 260], saturationProfile: [0.6, 0.4], brightnessProfile: [0.8, 0.4], contrastLevel: 0.6,
      gradientComplexity: 0.6, shapeGeometry: "organic", edgeSharpness: 0.4, symmetryLevel: 0.4,
      animationStyle: "smooth", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.7, particleInfluence: 0.4, nebulaCharacter: "ethereal",
      memoryInfluence: 0.7, adaptationSpeed: 0.4, stabilityPreference: 0.8, emergencePattern: "progressive"
    },
    country: {
      primaryHueRange: [30, 90], saturationProfile: [0.7, 0.3], brightnessProfile: [1.0, 0.3], contrastLevel: 0.5,
      gradientComplexity: 0.5, shapeGeometry: "organic", edgeSharpness: 0.3, symmetryLevel: 0.6,
      animationStyle: "smooth", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "organic",
      layerBlending: "harmonious", depthIllusion: 0.5, particleInfluence: 0.3, nebulaCharacter: "wispy",
      memoryInfluence: 0.7, adaptationSpeed: 0.4, stabilityPreference: 0.8, emergencePattern: "gradual"
    },
    techno: {
      primaryHueRange: [240, 300], saturationProfile: [1.0, 0.4], brightnessProfile: [1.1, 0.3], contrastLevel: 0.9,
      gradientComplexity: 0.6, shapeGeometry: "geometric", edgeSharpness: 1.0, symmetryLevel: 0.8,
      animationStyle: "rhythmic", pulseBehavior: "steady", flowDirection: "linear", transitionCharacter: "mechanical",
      layerBlending: "contrasting", depthIllusion: 0.5, particleInfluence: 0.9, nebulaCharacter: "structured",
      memoryInfluence: 0.2, adaptationSpeed: 0.9, stabilityPreference: 0.4, emergencePattern: "sudden"
    },
    house: {
      primaryHueRange: [300, 360], saturationProfile: [0.9, 0.3], brightnessProfile: [1.1, 0.3], contrastLevel: 0.7,
      gradientComplexity: 0.6, shapeGeometry: "hybrid", edgeSharpness: 0.7, symmetryLevel: 0.7,
      animationStyle: "rhythmic", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.6, particleInfluence: 0.7, nebulaCharacter: "dense",
      memoryInfluence: 0.4, adaptationSpeed: 0.7, stabilityPreference: 0.6, emergencePattern: "gradual"
    },
    trance: {
      primaryHueRange: [180, 270], saturationProfile: [0.8, 0.5], brightnessProfile: [1.0, 0.5], contrastLevel: 0.7,
      gradientComplexity: 0.8, shapeGeometry: "abstract", edgeSharpness: 0.5, symmetryLevel: 0.6,
      animationStyle: "smooth", pulseBehavior: "steady", flowDirection: "spiral", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.8, particleInfluence: 0.6, nebulaCharacter: "ethereal",
      memoryInfluence: 0.6, adaptationSpeed: 0.5, stabilityPreference: 0.7, emergencePattern: "progressive"
    },
    dubstep: {
      primaryHueRange: [120, 180], saturationProfile: [1.2, 0.6], brightnessProfile: [1.1, 0.6], contrastLevel: 1.0,
      gradientComplexity: 0.8, shapeGeometry: "geometric", edgeSharpness: 0.9, symmetryLevel: 0.5,
      animationStyle: "chaotic", pulseBehavior: "irregular", flowDirection: "random", transitionCharacter: "sharp",
      layerBlending: "clashing", depthIllusion: 0.7, particleInfluence: 1.0, nebulaCharacter: "structured",
      memoryInfluence: 0.2, adaptationSpeed: 1.0, stabilityPreference: 0.2, emergencePattern: "sudden"
    },
    unknown: {
      primaryHueRange: [0, 360], saturationProfile: [0.7, 0.3], brightnessProfile: [1.0, 0.3], contrastLevel: 0.6,
      gradientComplexity: 0.6, shapeGeometry: "hybrid", edgeSharpness: 0.5, symmetryLevel: 0.5,
      animationStyle: "smooth", pulseBehavior: "steady", flowDirection: "radial", transitionCharacter: "fluid",
      layerBlending: "harmonious", depthIllusion: 0.6, particleInfluence: 0.5, nebulaCharacter: "wispy",
      memoryInfluence: 0.5, adaptationSpeed: 0.5, stabilityPreference: 0.6, emergencePattern: "gradual"
    }
  };

  constructor(
    cssVariableBatcher: CSSVariableBatcher,
    musicSyncService: MusicSyncService | null = null,
    emotionalGradientMapper: EmotionalGradientMapper | null = null,
    settingsManager: SettingsManager | null = null
  ) {
    this.cssVariableBatcher = cssVariableBatcher;
    this.musicSyncService = musicSyncService;
    this.emotionalGradientMapper = emotionalGradientMapper;
    this.settingsManager = settingsManager;
    
    this.boundSpectralHandler = this.handleSpectralData.bind(this);
    this.boundEmotionalHandler = this.handleEmotionalData.bind(this);
  }

  public async initialize(): Promise<void> {
    // Subscribe to spectral analysis events
    if (this.boundSpectralHandler) {
      document.addEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    // Subscribe to emotional analysis events
    if (this.boundEmotionalHandler) {
      document.addEventListener("emotional-gradient:profile-updated", this.boundEmotionalHandler);
    }
    
    this.isActive = true;
    Y3K?.debug?.log("GenreGradientEvolution", "Genre-responsive gradient evolution system initialized");
  }

  private handleSpectralData(event: Event): void {
    if (!this.isActive) return;
    
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail as SpectralData;
    
    if (!spectralData) return;
    
    // Add to analysis buffer
    this.genreAnalysisBuffer.push(spectralData);
    
    if (this.genreAnalysisBuffer.length > this.bufferSize) {
      this.genreAnalysisBuffer.shift();
    }
    
    // Perform genre analysis when buffer is full
    if (this.genreAnalysisBuffer.length >= this.bufferSize) {
      this.analyzeGenre();
    }
  }

  private handleEmotionalData(event: Event): void {
    if (!this.isActive) return;
    
    // Combine genre and emotional data for enhanced visual evolution
    this.updateVisualEvolution();
  }

  private analyzeGenre(): void {
    if (this.genreAnalysisBuffer.length === 0) return;
    
    const avgSpectralData = this.calculateAverageSpectralData();
    const genreScores: { [key in MusicGenre]: number } = {} as any;
    
    // Calculate similarity scores for each genre
    for (const genre of Object.keys(this.genreProfiles) as MusicGenre[]) {
      genreScores[genre] = this.calculateGenreSimilarity(avgSpectralData, this.genreProfiles[genre]);
    }
    
    // Find the best matching genre
    const sortedGenres = Object.entries(genreScores).sort(([,a], [,b]) => b - a);
    const bestMatch = sortedGenres[0];
    
    // Add null/undefined check for array access
    if (bestMatch) {
      const [bestGenre, bestScore] = bestMatch;
      // Update genre with confidence based on score and consistency
      this.updateGenreDetection(bestGenre as MusicGenre, bestScore);
    }
  }

  private calculateAverageSpectralData(): SpectralData {
    const sum = this.genreAnalysisBuffer.reduce((acc, data) => ({
      bassLevel: acc.bassLevel + data.bassLevel,
      midLevel: acc.midLevel + data.midLevel,
      trebleLevel: acc.trebleLevel + data.trebleLevel,
      vocalLevel: acc.vocalLevel + data.vocalLevel,
      harmonicResonance: acc.harmonicResonance + data.harmonicResonance,
      tonalCenterStrength: acc.tonalCenterStrength + data.tonalCenterStrength,
      dissonanceLevel: acc.dissonanceLevel + data.dissonanceLevel,
      temporalPhase: acc.temporalPhase + data.temporalPhase,
      predictedBeatTime: acc.predictedBeatTime + data.predictedBeatTime,
      structuralPosition: acc.structuralPosition + data.structuralPosition,
      emotionalValence: acc.emotionalValence + data.emotionalValence,
      energyLevel: acc.energyLevel + data.energyLevel,
      tensionLevel: acc.tensionLevel + data.tensionLevel,
      stellarDrift: acc.stellarDrift + data.stellarDrift,
      quantumCoherence: acc.quantumCoherence + data.quantumCoherence,
      consciousnessLevel: acc.consciousnessLevel + data.consciousnessLevel
    }), {
      bassLevel: 0, midLevel: 0, trebleLevel: 0, vocalLevel: 0,
      harmonicResonance: 0, tonalCenterStrength: 0, dissonanceLevel: 0,
      temporalPhase: 0, predictedBeatTime: 0, structuralPosition: 0,
      emotionalValence: 0, energyLevel: 0, tensionLevel: 0,
      stellarDrift: 0, quantumCoherence: 0, consciousnessLevel: 0
    });
    
    const count = this.genreAnalysisBuffer.length;
    return {
      bassLevel: sum.bassLevel / count,
      midLevel: sum.midLevel / count,
      trebleLevel: sum.trebleLevel / count,
      vocalLevel: sum.vocalLevel / count,
      harmonicResonance: sum.harmonicResonance / count,
      tonalCenterStrength: sum.tonalCenterStrength / count,
      dissonanceLevel: sum.dissonanceLevel / count,
      temporalPhase: sum.temporalPhase / count,
      predictedBeatTime: sum.predictedBeatTime / count,
      structuralPosition: sum.structuralPosition / count,
      emotionalValence: sum.emotionalValence / count,
      energyLevel: sum.energyLevel / count,
      tensionLevel: sum.tensionLevel / count,
      stellarDrift: sum.stellarDrift / count,
      quantumCoherence: sum.quantumCoherence / count,
      consciousnessLevel: sum.consciousnessLevel / count
    };
  }

  private calculateGenreSimilarity(spectralData: SpectralData, genreProfile: GenreCharacteristics): number {
    // Weight different characteristics based on importance
    const weights = {
      frequency: 0.3,    // Bass, mid, treble patterns
      rhythm: 0.25,      // Complexity, syncopation, groove
      harmony: 0.2,      // Harmonic complexity, dissonance
      production: 0.15,  // Compression, saturation, processing
      cultural: 0.1      // Organicness, accessibility, experimental
    };
    
    // Frequency similarity
    const freqSimilarity = 1 - Math.abs(
      (spectralData.bassLevel - genreProfile.bassEmphasis) +
      (spectralData.midLevel - genreProfile.midFrequencyPattern) +
      (spectralData.trebleLevel - genreProfile.trebleSharpness)
    ) / 3;
    
    // Rhythm similarity (approximated from spectral data)
    const rhythmSimilarity = 1 - Math.abs(
      (spectralData.energyLevel - genreProfile.rhythmComplexity) +
      (spectralData.tensionLevel - genreProfile.syncopation)
    ) / 2;
    
    // Harmony similarity
    const harmonySimilarity = 1 - Math.abs(
      (spectralData.harmonicResonance - genreProfile.harmonicComplexity) +
      (spectralData.dissonanceLevel - genreProfile.dissonanceTolerance)
    ) / 2;
    
    // Production similarity (estimated)
    const productionSimilarity = 1 - Math.abs(
      (spectralData.energyLevel - genreProfile.compression) +
      (spectralData.tonalCenterStrength - genreProfile.saturation)
    ) / 2;
    
    // Cultural similarity (estimated from emotional content)
    const culturalSimilarity = 1 - Math.abs(
      (spectralData.emotionalValence - genreProfile.accessibility) +
      (spectralData.consciousnessLevel - genreProfile.experimentalFactor)
    ) / 2;
    
    // Weighted average
    return (
      freqSimilarity * weights.frequency +
      rhythmSimilarity * weights.rhythm +
      harmonySimilarity * weights.harmony +
      productionSimilarity * weights.production +
      culturalSimilarity * weights.cultural
    );
  }

  private updateGenreDetection(detectedGenre: MusicGenre, score: number): void {
    const timestamp = performance.now();
    
    // Add to history
    this.genreHistory.push({ genre: detectedGenre, confidence: score, timestamp });
    
    if (this.genreHistory.length > this.maxHistorySize) {
      this.genreHistory.shift();
    }
    
    // Calculate consensus from recent history
    const recentHistory = this.genreHistory.slice(-10);
    const genreConsensus = this.calculateGenreConsensus(recentHistory);
    
    // Update current genre if consensus is strong enough
    if (genreConsensus.confidence > 0.6 && 
        (genreConsensus.genre !== this.currentGenre || genreConsensus.confidence > this.genreConfidence)) {
      
      this.currentGenre = genreConsensus.genre;
      this.genreConfidence = genreConsensus.confidence;
      
      Y3K?.debug?.log("GenreGradientEvolution", `Genre detected: ${this.currentGenre} (confidence: ${this.genreConfidence.toFixed(2)})`);
      
      // Trigger visual evolution update
      this.updateVisualEvolution();
      
      // Dispatch genre change event
      document.dispatchEvent(new CustomEvent("genre-gradient:genre-detected", {
        detail: { genre: this.currentGenre, confidence: this.genreConfidence }
      }));
    }
  }

  private calculateGenreConsensus(history: { genre: MusicGenre; confidence: number; timestamp: number }[]): { genre: MusicGenre; confidence: number } {
    const genreWeights: { [key in MusicGenre]?: number } = {};
    
    // Weight recent detections more heavily
    history.forEach((entry, index) => {
      const timeWeight = (index + 1) / history.length; // More recent = higher weight
      const totalWeight = entry.confidence * timeWeight;
      
      genreWeights[entry.genre] = (genreWeights[entry.genre] || 0) + totalWeight;
    });
    
    // Find the genre with highest weighted score
    let bestGenre: MusicGenre = "unknown";
    let bestScore = 0;
    
    for (const [genre, weight] of Object.entries(genreWeights)) {
      if (weight !== undefined && weight > bestScore) {
        bestScore = weight;
        bestGenre = genre as MusicGenre;
      }
    }
    
    return { genre: bestGenre, confidence: bestScore / history.length };
  }

  private updateVisualEvolution(): void {
    if (this.currentGenre === "unknown") return;
    
    const genreStyle = this.genreVisualStyles[this.currentGenre];
    const emotionalProfile = this.emotionalGradientMapper?.getCurrentEmotionalProfile() || null;
    
    // Apply genre-specific visual parameters
    this.applyGenreVisualStyle(genreStyle, emotionalProfile);
  }

  private applyGenreVisualStyle(style: GenreVisualStyle, emotionalProfile: EmotionalProfile | null): void {
    // Apply genre-specific hue range
    const hueRange = style.primaryHueRange[1] - style.primaryHueRange[0];
    const baseHue = style.primaryHueRange[0] + (hueRange * 0.5);
    const emotionalHueShift = emotionalProfile ? (emotionalProfile.valence - 0.5) * hueRange * 0.3 : 0;
    
    this.cssVariableBatcher.setProperty("--sn-genre-base-hue", `${baseHue + emotionalHueShift}deg`);
    this.cssVariableBatcher.setProperty("--sn-genre-hue-range", `${hueRange}deg`);
    
    // Apply saturation and brightness profiles
    const emotionalSatBoost = emotionalProfile ? emotionalProfile.arousal * 0.3 : 0;
    const emotionalBrightBoost = emotionalProfile ? emotionalProfile.energy * 0.2 : 0;
    
    this.cssVariableBatcher.setProperty("--sn-genre-saturation-base", (style.saturationProfile[0] + emotionalSatBoost).toString());
    this.cssVariableBatcher.setProperty("--sn-genre-saturation-variation", style.saturationProfile[1].toString());
    this.cssVariableBatcher.setProperty("--sn-genre-brightness-base", (style.brightnessProfile[0] + emotionalBrightBoost).toString());
    this.cssVariableBatcher.setProperty("--sn-genre-brightness-variation", style.brightnessProfile[1].toString());
    
    // Apply contrast and geometry
    this.cssVariableBatcher.setProperty("--sn-genre-contrast-level", style.contrastLevel.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-edge-sharpness", style.edgeSharpness.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-gradient-complexity", style.gradientComplexity.toString());
    
    // Apply animation characteristics
    const emotionalSpeedMod = emotionalProfile ? 0.5 + emotionalProfile.energy : 1;
    this.cssVariableBatcher.setProperty("--sn-genre-animation-speed", emotionalSpeedMod.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-pulse-intensity", style.depthIllusion.toString());
    
    // Apply layer interaction
    const layerHarmony = this.mapLayerBlending(style.layerBlending);
    this.cssVariableBatcher.setProperty("--sn-genre-layer-harmony", layerHarmony.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-depth-illusion", style.depthIllusion.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-particle-influence", style.particleInfluence.toString());
    
    // Apply temporal behavior
    this.cssVariableBatcher.setProperty("--sn-genre-memory-influence", style.memoryInfluence.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-adaptation-speed", style.adaptationSpeed.toString());
    this.cssVariableBatcher.setProperty("--sn-genre-stability-preference", style.stabilityPreference.toString());
    
    // Update genre identity
    this.cssVariableBatcher.setProperty("--sn-current-genre", this.currentGenre);
    this.cssVariableBatcher.setProperty("--sn-genre-confidence", this.genreConfidence.toString());
  }

  private mapLayerBlending(blending: GenreVisualStyle["layerBlending"]): number {
    switch (blending) {
      case "harmonious": return 0.9;
      case "complementary": return 0.7;
      case "contrasting": return 0.5;
      case "clashing": return 0.3;
      default: return 0.7;
    }
  }

  public getCurrentGenre(): MusicGenre {
    return this.currentGenre;
  }

  public getGenreConfidence(): number {
    return this.genreConfidence;
  }

  public getGenreHistory(): { genre: MusicGenre; confidence: number; timestamp: number }[] {
    return [...this.genreHistory];
  }

  public setGenreOverride(genre: MusicGenre, duration: number = 10000): void {
    // Temporarily override genre detection
    this.currentGenre = genre;
    this.genreConfidence = 1.0;
    this.updateVisualEvolution();
    
    Y3K?.debug?.log("GenreGradientEvolution", `Genre override: ${genre} for ${duration}ms`);
    
    // Reset after duration
    setTimeout(() => {
      this.genreConfidence = 0;
      Y3K?.debug?.log("GenreGradientEvolution", "Genre override expired, returning to automatic detection");
    }, duration);
  }

  public getGenreCharacteristics(genre?: MusicGenre): GenreCharacteristics {
    return this.genreProfiles[genre || this.currentGenre];
  }

  public getGenreVisualStyle(genre?: MusicGenre): GenreVisualStyle {
    return this.genreVisualStyles[genre || this.currentGenre];
  }

  public destroy(): void {
    this.isActive = false;
    
    if (this.boundSpectralHandler) {
      document.removeEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    if (this.boundEmotionalHandler) {
      document.removeEventListener("emotional-gradient:profile-updated", this.boundEmotionalHandler);
    }
    
    this.genreAnalysisBuffer = [];
    this.genreHistory = [];
    
    Y3K?.debug?.log("GenreGradientEvolution", "Genre evolution system destroyed");
  }
}