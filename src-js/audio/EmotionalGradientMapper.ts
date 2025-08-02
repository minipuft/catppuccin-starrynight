/**
 * EmotionalGradientMapper - Musical Emotion to Visual Gradient Translation
 * Part of the Year 3000 Flux Consciousness System
 *
 * Maps musical emotional content to gradient behaviors:
 * - Valence (sad ↔ happy) affects color warmth and brightness
 * - Energy (calm ↔ energetic) affects animation speed and intensity
 * - Arousal (relaxed ↔ exciting) affects contrast and saturation
 * - Tension (peaceful ↔ aggressive) affects color discord and movement
 * - Mode (major/minor) affects harmonic relationships
 * - Dynamics (soft ↔ loud) affects opacity and scale
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { FluxSpectralAnalyzer, SpectralData } from "@/audio/FluxSpectralAnalyzer";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { EmotionalTemperatureMapper, type MusicAnalysisData, type EmotionalTemperatureResult, type EmotionalState } from "@/utils/color/EmotionalTemperatureMapper";

export interface EmotionalProfile {
  // Core emotional dimensions (0-1 range)
  valence: number;        // 0=sad, 0.5=neutral, 1=happy
  energy: number;         // 0=calm, 1=energetic
  arousal: number;        // 0=relaxed, 1=exciting
  tension: number;        // 0=peaceful, 1=aggressive
  
  // Musical characteristics
  mode: "major" | "minor" | "neutral";  // Harmonic mode
  dynamics: number;       // 0=soft, 1=loud
  complexity: number;     // 0=simple, 1=complex
  
  // Temporal characteristics
  stability: number;      // 0=chaotic, 1=stable
  predictability: number; // 0=surprising, 1=predictable
  
  // Derived mood classification
  mood: MoodType;
  confidence: number;     // 0-1 confidence in mood detection
}

export type MoodType = 
  | "euphoric"      // High valence, high energy
  | "content"       // High valence, low energy  
  | "melancholic"   // Low valence, low energy
  | "aggressive"    // Low valence, high energy
  | "mysterious"    // Low valence, high tension
  | "peaceful"      // High valence, low tension
  | "dramatic"      // High tension, high complexity
  | "ambient"       // Low energy, high stability
  | "chaotic"       // Low stability, high complexity
  | "nostalgic"     // Medium valence, minor mode
  | "heroic"        // High energy, major mode
  | "contemplative" // Medium energy, high complexity
  | "neutral";      // Balanced across dimensions

export interface EmotionalGradientState {
  // Color transformation parameters
  hueShift: number;           // -180 to +180 degrees
  saturationMultiplier: number; // 0.5 to 2.0
  brightnessMultiplier: number; // 0.5 to 2.0
  contrastMultiplier: number;   // 0.5 to 2.0
  
  // Animation parameters
  animationSpeed: number;     // 0.1 to 3.0 multiplier
  pulseIntensity: number;     // 0-1 pulse strength
  flowDirection: number;      // 0-360 degrees
  
  // Layer behavior
  layerHarmony: number;       // 0-1 how well layers blend
  discordLevel: number;       // 0-1 intentional color conflicts
  depthPerception: number;    // 0-1 3D depth illusion
  
  // Transition behavior
  transitionSpeed: number;    // 0.1 to 5.0 multiplier
  smoothing: number;          // 0-1 temporal smoothing
  responsiveness: number;     // 0-1 how quickly to adapt
}

export class EmotionalGradientMapper {
  private cssConsciousnessController: UnifiedCSSConsciousnessController;
  private musicSyncService: MusicSyncService | null = null;
  private settingsManager: SettingsManager | null = null;
  
  private currentEmotionalProfile: EmotionalProfile | null = null;
  private currentGradientState: EmotionalGradientState;
  private emotionalHistory: EmotionalProfile[] = [];
  private maxHistorySize = 50; // Keep 50 frames of emotional history
  
  private isActive = false;
  private boundSpectralHandler: ((event: Event) => void) | null = null;
  private boundSettingsHandler: ((event: Event) => void) | null = null;
  
  // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION
  private emotionalTemperatureMapper: EmotionalTemperatureMapper;
  private currentEmotionalTemperature: EmotionalTemperatureResult | null = null;
  private moodToEmotionMap: Record<MoodType, EmotionalState>;
  
  // Mood-to-gradient mapping profiles
  private moodProfiles: { [key in MoodType]: Partial<EmotionalGradientState> } = {
    euphoric: {
      hueShift: 15,              // Warm yellows/oranges
      saturationMultiplier: 1.4,  // Vibrant colors
      brightnessMultiplier: 1.3,  // Bright
      contrastMultiplier: 1.2,    // High contrast
      animationSpeed: 1.5,        // Fast animations
      pulseIntensity: 0.8,        // Strong pulse
      layerHarmony: 0.9,          // Harmonious
      discordLevel: 0.1,          // Low discord
      transitionSpeed: 0.8        // Quick transitions
    },
    content: {
      hueShift: 5,               // Subtle warm shift
      saturationMultiplier: 1.1, // Slightly saturated
      brightnessMultiplier: 1.1, // Slightly bright
      contrastMultiplier: 1.0,   // Normal contrast
      animationSpeed: 0.8,       // Slower animations
      pulseIntensity: 0.4,       // Gentle pulse
      layerHarmony: 0.95,        // Very harmonious
      discordLevel: 0.05,        // Very low discord
      transitionSpeed: 1.5       // Smooth transitions
    },
    melancholic: {
      hueShift: -30,             // Cool blues/purples
      saturationMultiplier: 0.7, // Desaturated
      brightnessMultiplier: 0.8, // Darker
      contrastMultiplier: 0.9,   // Lower contrast
      animationSpeed: 0.6,       // Slow animations
      pulseIntensity: 0.3,       // Weak pulse
      layerHarmony: 0.8,         // Somewhat harmonious
      discordLevel: 0.2,         // Some discord
      transitionSpeed: 2.0       // Very smooth transitions
    },
    aggressive: {
      hueShift: -15,             // Reds/magentas
      saturationMultiplier: 1.6, // Very saturated
      brightnessMultiplier: 1.2, // Bright
      contrastMultiplier: 1.5,   // High contrast
      animationSpeed: 2.0,       // Very fast
      pulseIntensity: 1.0,       // Maximum pulse
      layerHarmony: 0.6,         // Less harmonious
      discordLevel: 0.4,         // Notable discord
      transitionSpeed: 0.5       // Sharp transitions
    },
    mysterious: {
      hueShift: -45,             // Deep purples/blues
      saturationMultiplier: 0.9, // Slightly desaturated
      brightnessMultiplier: 0.7, // Dark
      contrastMultiplier: 1.3,   // High contrast
      animationSpeed: 0.7,       // Medium-slow
      pulseIntensity: 0.6,       // Moderate pulse
      layerHarmony: 0.7,         // Somewhat mysterious
      discordLevel: 0.3,         // Moderate discord
      transitionSpeed: 1.8       // Gradual transitions
    },
    peaceful: {
      hueShift: 25,              // Soft greens/blues
      saturationMultiplier: 0.8, // Gentle saturation
      brightnessMultiplier: 1.0, // Natural brightness
      contrastMultiplier: 0.9,   // Soft contrast
      animationSpeed: 0.5,       // Very slow
      pulseIntensity: 0.2,       // Minimal pulse
      layerHarmony: 1.0,         // Perfect harmony
      discordLevel: 0.0,         // No discord
      transitionSpeed: 3.0       // Very smooth
    },
    dramatic: {
      hueShift: 0,               // Full spectrum
      saturationMultiplier: 1.3, // High saturation
      brightnessMultiplier: 1.1, // Bright
      contrastMultiplier: 1.4,   // High contrast
      animationSpeed: 1.2,       // Dynamic
      pulseIntensity: 0.9,       // Strong pulse
      layerHarmony: 0.6,         // Dynamic tension
      discordLevel: 0.4,         // Intentional discord
      transitionSpeed: 0.7       // Dramatic transitions
    },
    ambient: {
      hueShift: 10,              // Subtle shifts
      saturationMultiplier: 0.6, // Very desaturated
      brightnessMultiplier: 0.9, // Soft
      contrastMultiplier: 0.8,   // Low contrast
      animationSpeed: 0.3,       // Very slow
      pulseIntensity: 0.1,       // Barely perceptible
      layerHarmony: 0.9,         // Harmonious
      discordLevel: 0.1,         // Minimal discord
      transitionSpeed: 4.0       // Ultra-smooth
    },
    chaotic: {
      hueShift: 0,               // Full spectrum chaos
      saturationMultiplier: 1.5, // High saturation
      brightnessMultiplier: 1.2, // Bright
      contrastMultiplier: 1.6,   // Very high contrast
      animationSpeed: 2.5,       // Chaotic speed
      pulseIntensity: 0.9,       // Strong pulse
      layerHarmony: 0.3,         // Low harmony
      discordLevel: 0.7,         // High discord
      transitionSpeed: 0.3       // Rapid transitions
    },
    nostalgic: {
      hueShift: -10,             // Slight cool shift
      saturationMultiplier: 0.8, // Faded colors
      brightnessMultiplier: 0.95, // Slightly dimmed
      contrastMultiplier: 0.9,   // Soft contrast
      animationSpeed: 0.7,       // Reflective pace
      pulseIntensity: 0.4,       // Gentle pulse
      layerHarmony: 0.85,        // Mostly harmonious
      discordLevel: 0.15,        // Slight melancholy
      transitionSpeed: 2.2       // Smooth, flowing
    },
    heroic: {
      hueShift: 20,              // Warm, golden tones
      saturationMultiplier: 1.2, // Rich colors
      brightnessMultiplier: 1.25, // Bright and bold
      contrastMultiplier: 1.3,   // Strong contrast
      animationSpeed: 1.3,       // Bold movement
      pulseIntensity: 0.7,       // Strong pulse
      layerHarmony: 0.8,         // Confident harmony
      discordLevel: 0.2,         // Controlled tension
      transitionSpeed: 1.0       // Confident transitions
    },
    contemplative: {
      hueShift: -5,              // Neutral with slight cool
      saturationMultiplier: 0.9, // Thoughtful saturation
      brightnessMultiplier: 1.0, // Balanced brightness
      contrastMultiplier: 1.1,   // Clear contrast
      animationSpeed: 0.6,       // Thoughtful pace
      pulseIntensity: 0.3,       // Gentle reflection
      layerHarmony: 0.8,         // Balanced harmony
      discordLevel: 0.2,         // Contemplative tension
      transitionSpeed: 2.5       // Thoughtful transitions
    },
    neutral: {
      hueShift: 0,               // No shift
      saturationMultiplier: 1.0, // Natural saturation
      brightnessMultiplier: 1.0, // Natural brightness
      contrastMultiplier: 1.0,   // Natural contrast
      animationSpeed: 1.0,       // Normal speed
      pulseIntensity: 0.5,       // Moderate pulse
      layerHarmony: 0.75,        // Balanced
      discordLevel: 0.25,        // Balanced discord
      transitionSpeed: 1.5       // Moderate transitions
    }
  };

  constructor(
    cssConsciousnessController: UnifiedCSSConsciousnessController,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null
  ) {
    this.cssConsciousnessController = cssConsciousnessController;
    this.musicSyncService = musicSyncService;
    this.settingsManager = settingsManager;
    
    // Initialize with neutral gradient state
    this.currentGradientState = this.createNeutralGradientState();
    
    // 🌡️ Initialize emotional temperature mapper
    this.emotionalTemperatureMapper = new EmotionalTemperatureMapper(true); // Enable debug
    
    // Create mood-to-emotional-state mapping
    this.moodToEmotionMap = {
      euphoric: 'energetic',
      content: 'happy',
      melancholic: 'melancholy',
      aggressive: 'aggressive',
      mysterious: 'mysterious',
      peaceful: 'calm',
      dramatic: 'epic',
      ambient: 'ambient',
      chaotic: 'aggressive', // Map chaotic to aggressive for high energy
      nostalgic: 'melancholy',
      heroic: 'epic',
      contemplative: 'calm',
      neutral: 'ambient'
    };
    
    this.boundSpectralHandler = this.handleSpectralData.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);
  }

  public async initialize(): Promise<void> {
    // Subscribe to spectral analysis events
    if (this.boundSpectralHandler) {
      document.addEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.addEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }
    
    this.isActive = true;
    Y3K?.debug?.log("EmotionalGradientMapper", "Emotional mapping system initialized");
  }

  private createNeutralGradientState(): EmotionalGradientState {
    return {
      hueShift: 0,
      saturationMultiplier: 1.0,
      brightnessMultiplier: 1.0,
      contrastMultiplier: 1.0,
      animationSpeed: 1.0,
      pulseIntensity: 0.5,
      flowDirection: 0,
      layerHarmony: 0.75,
      discordLevel: 0.25,
      depthPerception: 0.5,
      transitionSpeed: 1.5,
      smoothing: 0.7,
      responsiveness: 0.8
    };
  }

  private handleSpectralData(event: Event): void {
    if (!this.isActive) return;
    
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail as SpectralData;
    
    if (!spectralData) return;
    
    // Analyze emotional content from spectral data
    const emotionalProfile = this.analyzeEmotionalContent(spectralData);
    
    // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION: Convert emotional profile to temperature result
    try {
      const musicAnalysisData: MusicAnalysisData = {
        energy: emotionalProfile.energy,
        valence: emotionalProfile.valence,
        danceability: emotionalProfile.arousal, // Map arousal to danceability
        tempo: 120, // Default, could be enhanced with actual tempo detection
        loudness: emotionalProfile.dynamics,
        acousticness: 1 - emotionalProfile.complexity, // Inverse relationship
        instrumentalness: 0.5, // Default
        speechiness: 0.1, // Default low
        mode: emotionalProfile.mode === 'major' ? 1 : 0,
        key: 0, // Default
        genre: this.inferGenreFromProfile(emotionalProfile)
      };
      
      this.currentEmotionalTemperature = this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(musicAnalysisData);
      
      // Apply emotional temperature CSS classes and variables to document
      this.applyEmotionalTemperatureToDocument(this.currentEmotionalTemperature);
      
      Y3K?.debug?.log("EmotionalGradientMapper", "🌡️ Applied emotional temperature:", {
        mood: emotionalProfile.mood,
        emotionalState: this.currentEmotionalTemperature.primaryEmotion,
        temperature: this.currentEmotionalTemperature.temperature,
        intensity: this.currentEmotionalTemperature.intensity
      });
      
    } catch (error) {
      Y3K?.debug?.warn("EmotionalGradientMapper", "🌡️ Failed to apply emotional temperature:", error);
    }
    
    // Store in history for temporal analysis
    this.storeEmotionalHistory(emotionalProfile);
    
    // Map emotion to gradient state (enhanced with temperature data)
    const newGradientState = this.mapEmotionToGradient(emotionalProfile);
    
    // Apply temporal smoothing
    this.currentGradientState = this.smoothGradientTransition(
      this.currentGradientState,
      newGradientState,
      emotionalProfile.stability
    );
    
    // Update CSS variables (now includes emotional temperature integration)
    this.updateGradientVariables();
    
    this.currentEmotionalProfile = emotionalProfile;
  }

  private analyzeEmotionalContent(spectralData: SpectralData): EmotionalProfile {
    // Extract emotional dimensions from spectral data
    const valence = this.calculateValence(spectralData);
    const energy = spectralData.energyLevel;
    const arousal = this.calculateArousal(spectralData);
    const tension = spectralData.tensionLevel;
    
    // Determine musical characteristics
    const mode = this.detectMode(spectralData);
    const dynamics = (spectralData.bassLevel + spectralData.midLevel + spectralData.trebleLevel) / 3;
    const complexity = spectralData.dissonanceLevel + (spectralData.harmonicResonance * 0.5);
    
    // Calculate temporal characteristics
    const stability = this.calculateStability();
    const predictability = this.calculatePredictability();
    
    // Classify mood
    const mood = this.classifyMood(valence, energy, arousal, tension, mode);
    const confidence = this.calculateMoodConfidence(valence, energy, arousal, tension);
    
    return {
      valence,
      energy,
      arousal,
      tension,
      mode,
      dynamics,
      complexity,
      stability,
      predictability,
      mood,
      confidence
    };
  }

  private calculateValence(spectralData: SpectralData): number {
    // Higher treble and harmonic content suggests more positive valence
    // Major-like harmonic relationships increase valence
    const trebleInfluence = spectralData.trebleLevel * 0.4;
    const harmonicInfluence = spectralData.harmonicResonance * 0.3;
    const tonalInfluence = spectralData.tonalCenterStrength * 0.2;
    const dissonanceReduction = (1 - spectralData.dissonanceLevel) * 0.1;
    
    return Math.max(0, Math.min(1, trebleInfluence + harmonicInfluence + tonalInfluence + dissonanceReduction));
  }

  private calculateArousal(spectralData: SpectralData): number {
    // High frequency content and dynamic range suggest arousal
    const trebleArousal = spectralData.trebleLevel * 0.5;
    const dynamicRange = (Math.max(spectralData.bassLevel, spectralData.midLevel, spectralData.trebleLevel) - 
                         Math.min(spectralData.bassLevel, spectralData.midLevel, spectralData.trebleLevel)) * 0.3;
    const dissonanceArousal = spectralData.dissonanceLevel * 0.2;
    
    return Math.max(0, Math.min(1, trebleArousal + dynamicRange + dissonanceArousal));
  }

  private detectMode(spectralData: SpectralData): "major" | "minor" | "neutral" {
    // Simplified mode detection based on harmonic content
    if (spectralData.harmonicResonance > 0.7 && spectralData.dissonanceLevel < 0.3) {
      return "major";
    } else if (spectralData.harmonicResonance < 0.4 || spectralData.dissonanceLevel > 0.6) {
      return "minor";
    }
    return "neutral";
  }

  private calculateStability(): number {
    if (this.emotionalHistory.length < 2) return 0.5;
    
    // Calculate variance in recent emotional profiles
    const recentFrames = Math.min(10, this.emotionalHistory.length);
    let variance = 0;
    
    for (let i = 1; i < recentFrames; i++) {
      const current = this.emotionalHistory[this.emotionalHistory.length - i];
      const previous = this.emotionalHistory[this.emotionalHistory.length - i - 1];
      
      // Add null/undefined checks for array access
      if (current && previous) {
        variance += Math.abs(current.valence - previous.valence);
        variance += Math.abs(current.energy - previous.energy);
        variance += Math.abs(current.arousal - previous.arousal);
      }
    }
    
    return Math.max(0, Math.min(1, 1 - (variance / (recentFrames * 3))));
  }

  private calculatePredictability(): number {
    // Simple pattern recognition in emotional progression
    if (this.emotionalHistory.length < 5) return 0.5;
    
    // Look for repeating patterns in the recent history
    const recent = this.emotionalHistory.slice(-5);
    let patterns = 0;
    
    // Check for trend consistency
    for (let i = 1; i < recent.length; i++) {
      const current = recent[i];
      const previous = recent[i-1];
      
      // Add null/undefined checks for array access
      if (current && previous) {
        const valenceTrend = current.valence - previous.valence;
        const energyTrend = current.energy - previous.energy;
        
        if (Math.abs(valenceTrend) < 0.1 && Math.abs(energyTrend) < 0.1) {
          patterns++;
        }
      }
    }
    
    return patterns / (recent.length - 1);
  }

  private classifyMood(valence: number, energy: number, arousal: number, tension: number, mode: string): MoodType {
    // Multi-dimensional mood classification
    if (valence > 0.7 && energy > 0.7) return "euphoric";
    if (valence > 0.7 && energy < 0.3) return "content";
    if (valence < 0.3 && energy < 0.3) return "melancholic";
    if (valence < 0.3 && energy > 0.7) return "aggressive";
    if (valence < 0.4 && tension > 0.6) return "mysterious";
    if (valence > 0.6 && tension < 0.3) return "peaceful";
    if (tension > 0.7 && arousal > 0.6) return "dramatic";
    if (energy < 0.4 && arousal < 0.4) return "ambient";
    if (tension > 0.6 && energy > 0.6) return "chaotic";
    if (mode === "minor" && valence > 0.3 && valence < 0.7) return "nostalgic";
    if (mode === "major" && energy > 0.6 && valence > 0.5) return "heroic";
    if (arousal < 0.5 && valence > 0.4 && valence < 0.6) return "contemplative";
    
    return "neutral";
  }

  private calculateMoodConfidence(valence: number, energy: number, arousal: number, tension: number): number {
    // Confidence based on how clearly defined the emotional dimensions are
    const clarity = [valence, energy, arousal, tension].map(value => 
      Math.abs(value - 0.5) * 2  // Distance from neutral
    );
    
    return clarity.reduce((sum, c) => sum + c, 0) / clarity.length;
  }

  private mapEmotionToGradient(emotionalProfile: EmotionalProfile): EmotionalGradientState {
    const baseMoodProfile = this.moodProfiles[emotionalProfile.mood];
    const baseState = { ...this.createNeutralGradientState(), ...baseMoodProfile };
    
    // Apply fine-tuning based on specific emotional dimensions
    return {
      ...baseState,
      hueShift: baseState.hueShift! + (emotionalProfile.valence - 0.5) * 20,
      saturationMultiplier: baseState.saturationMultiplier! * (0.5 + emotionalProfile.arousal * 0.5),
      brightnessMultiplier: baseState.brightnessMultiplier! * (0.7 + emotionalProfile.energy * 0.6),
      contrastMultiplier: baseState.contrastMultiplier! * (0.6 + emotionalProfile.tension * 0.8),
      animationSpeed: baseState.animationSpeed! * (0.3 + emotionalProfile.energy * 1.4),
      pulseIntensity: baseState.pulseIntensity! * emotionalProfile.arousal,
      flowDirection: emotionalProfile.valence * 360,
      layerHarmony: baseState.layerHarmony! * (0.3 + emotionalProfile.stability * 0.7),
      discordLevel: baseState.discordLevel! * (0.1 + emotionalProfile.tension * 0.9),
      depthPerception: 0.3 + emotionalProfile.complexity * 0.7,
      transitionSpeed: baseState.transitionSpeed! / (0.5 + emotionalProfile.predictability * 1.5),
      smoothing: 0.4 + emotionalProfile.stability * 0.6,
      responsiveness: 0.4 + emotionalProfile.confidence * 0.6
    };
  }

  private smoothGradientTransition(
    current: EmotionalGradientState,
    target: EmotionalGradientState,
    stability: number
  ): EmotionalGradientState {
    const smoothingFactor = 0.1 + stability * 0.4; // More stable = more smoothing
    
    return {
      hueShift: this.lerp(current.hueShift, target.hueShift, smoothingFactor),
      saturationMultiplier: this.lerp(current.saturationMultiplier, target.saturationMultiplier, smoothingFactor),
      brightnessMultiplier: this.lerp(current.brightnessMultiplier, target.brightnessMultiplier, smoothingFactor),
      contrastMultiplier: this.lerp(current.contrastMultiplier, target.contrastMultiplier, smoothingFactor),
      animationSpeed: this.lerp(current.animationSpeed, target.animationSpeed, smoothingFactor),
      pulseIntensity: this.lerp(current.pulseIntensity, target.pulseIntensity, smoothingFactor),
      flowDirection: this.lerp(current.flowDirection, target.flowDirection, smoothingFactor),
      layerHarmony: this.lerp(current.layerHarmony, target.layerHarmony, smoothingFactor),
      discordLevel: this.lerp(current.discordLevel, target.discordLevel, smoothingFactor),
      depthPerception: this.lerp(current.depthPerception, target.depthPerception, smoothingFactor),
      transitionSpeed: this.lerp(current.transitionSpeed, target.transitionSpeed, smoothingFactor * 0.5),
      smoothing: this.lerp(current.smoothing, target.smoothing, 0.1),
      responsiveness: this.lerp(current.responsiveness, target.responsiveness, 0.1)
    };
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  private updateGradientVariables(): void {
    const state = this.currentGradientState;
    
    // Update emotional gradient modifier variables
    this.cssConsciousnessController.setProperty("--sn-emotional-hue-shift", `${state.hueShift}deg`);
    this.cssConsciousnessController.setProperty("--sn-emotional-saturation-multiplier", state.saturationMultiplier.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-brightness-multiplier", state.brightnessMultiplier.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-contrast-multiplier", state.contrastMultiplier.toString());
    
    // Update animation parameters
    this.cssConsciousnessController.setProperty("--sn-emotional-animation-speed", state.animationSpeed.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-pulse-intensity", state.pulseIntensity.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-flow-direction", `${state.flowDirection}deg`);
    
    // Update layer behavior
    this.cssConsciousnessController.setProperty("--sn-emotional-layer-harmony", state.layerHarmony.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-discord-level", state.discordLevel.toString());
    this.cssConsciousnessController.setProperty("--sn-emotional-depth-perception", state.depthPerception.toString());
    
    // Update transition behavior
    this.cssConsciousnessController.setProperty("--sn-emotional-transition-speed", state.transitionSpeed.toString());
    
    // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION: Apply temperature-based CSS variables
    if (this.currentEmotionalTemperature) {
      // Apply all emotional temperature CSS variables
      Object.entries(this.currentEmotionalTemperature.cssVariables).forEach(([property, value]) => {
        this.cssConsciousnessController.setProperty(property, value);
      });
      
      // Set specific temperature-enhanced variables
      this.cssConsciousnessController.setProperty("--sn-emotional-temperature", this.currentEmotionalTemperature.temperature.toString());
      this.cssConsciousnessController.setProperty("--sn-emotional-temperature-intensity", this.currentEmotionalTemperature.intensity.toString());
      this.cssConsciousnessController.setProperty("--sn-emotional-temperature-class", this.currentEmotionalTemperature.cssClass);
      
      // Blend gradient state with temperature intensity
      const temperatureInfluence = this.currentEmotionalTemperature.intensity;
      this.cssConsciousnessController.setProperty("--sn-emotional-temperature-blend", temperatureInfluence.toString());
      
      Y3K?.debug?.log("EmotionalGradientMapper", "🌡️ Applied temperature CSS variables:", {
        temperature: this.currentEmotionalTemperature.temperature,
        intensity: this.currentEmotionalTemperature.intensity,
        cssClass: this.currentEmotionalTemperature.cssClass,
        variableCount: Object.keys(this.currentEmotionalTemperature.cssVariables).length
      });
    }
    
    // 🔧 CRITICAL ENHANCEMENT: Coordinate with consolidated gradient system
    // Apply emotional modifications to background gradient variables
    this.updateEmotionalGradientCoordination(state);
    
    // Update current mood information
    if (this.currentEmotionalProfile) {
      this.cssConsciousnessController.setProperty("--sn-current-mood", this.currentEmotionalProfile.mood);
      this.cssConsciousnessController.setProperty("--sn-mood-confidence", this.currentEmotionalProfile.confidence.toString());
      this.cssConsciousnessController.setProperty("--sn-emotional-valence", this.currentEmotionalProfile.valence.toString());
      this.cssConsciousnessController.setProperty("--sn-emotional-energy", this.currentEmotionalProfile.energy.toString());
    }
  }

  /**
   * Coordinate emotional modifications with the consolidated --sn-bg-gradient-* system
   */
  private updateEmotionalGradientCoordination(state: EmotionalGradientState): void {
    // Get current background gradient colors (set by ColorHarmonyEngine/Year3000System)
    const rootStyle = getComputedStyle(document.documentElement);
    const currentPrimary = rootStyle.getPropertyValue('--sn-bg-gradient-primary').trim();
    const currentSecondary = rootStyle.getPropertyValue('--sn-bg-gradient-secondary').trim();
    const currentAccent = rootStyle.getPropertyValue('--sn-bg-gradient-accent').trim();
    
    // Only proceed if we have base gradient colors to modify
    if (currentPrimary || currentSecondary || currentAccent) {
      // Set emotional gradient flow variables that CSS can use with the base colors
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-flow-x", (state.flowDirection! * 0.01).toString());
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-flow-y", (Math.sin(state.flowDirection! * Math.PI / 180) * 0.5).toString());
      
      // Set emotional opacity and blur modifiers
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-opacity", (0.8 * state.layerHarmony!).toString());
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-blur", `${120 * (1 + state.depthPerception! * 0.5)}px`);
      
      // Set emotional saturation and brightness modifiers
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-saturation", state.saturationMultiplier!.toString());
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-brightness", state.brightnessMultiplier!.toString());
      this.cssConsciousnessController.setProperty("--sn-bg-gradient-contrast", state.contrastMultiplier!.toString());
      
      Y3K?.debug?.log("EmotionalGradientMapper", `Coordinated emotional modifications with gradient system: flow=${state.flowDirection}°, opacity=${0.8 * state.layerHarmony!}`);
    }
  }

  private storeEmotionalHistory(profile: EmotionalProfile): void {
    this.emotionalHistory.push(profile);
    
    if (this.emotionalHistory.length > this.maxHistorySize) {
      this.emotionalHistory.shift();
    }
  }

  private handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;
    
    if (key.startsWith("sn-emotional-") || key.startsWith("sn-gradient-")) {
      // Reload emotional mapping sensitivity based on settings
      Y3K?.debug?.log("EmotionalGradientMapper", "Settings changed, updating emotional sensitivity");
    }
  }

  public getCurrentEmotionalProfile(): EmotionalProfile | null {
    return this.currentEmotionalProfile;
  }

  public getCurrentGradientState(): EmotionalGradientState {
    return { ...this.currentGradientState };
  }

  public getEmotionalHistory(): EmotionalProfile[] {
    return [...this.emotionalHistory];
  }

  public setMoodOverride(mood: MoodType, duration: number = 5000): void {
    // Temporarily override mood detection
    const overrideProfile = this.moodProfiles[mood];
    if (overrideProfile) {
      this.currentGradientState = { ...this.currentGradientState, ...overrideProfile };
      this.updateGradientVariables();
      
      // Reset after duration
      setTimeout(() => {
        Y3K?.debug?.log("EmotionalGradientMapper", "Mood override expired, returning to automatic detection");
      }, duration);
    }
  }

  /**
   * 🌡️ Apply emotional temperature CSS classes and variables to the document
   */
  private applyEmotionalTemperatureToDocument(emotionalTemperature: EmotionalTemperatureResult): void {
    // Remove existing emotional temperature classes from body
    const existingClasses = Array.from(document.body.classList).filter(cls => 
      cls.startsWith('organic-emotion-')
    );
    document.body.classList.remove(...existingClasses);
    
    // Apply primary emotional temperature class
    document.body.classList.add(emotionalTemperature.cssClass);
    
    // Apply secondary emotion blend class if present
    if (emotionalTemperature.secondaryEmotion) {
      document.body.classList.add(`organic-emotion-blend-${emotionalTemperature.secondaryEmotion}`);
    }
    
    // Apply CSS variables to document root
    Object.entries(emotionalTemperature.cssVariables).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    Y3K?.debug?.log("EmotionalGradientMapper", "🌡️ Applied emotional temperature to document:", {
      primaryClass: emotionalTemperature.cssClass,
      secondaryEmotion: emotionalTemperature.secondaryEmotion,
      cssVariableCount: Object.keys(emotionalTemperature.cssVariables).length
    });
  }
  
  /**
   * 🌡️ Infer genre from emotional profile for temperature mapping
   */
  private inferGenreFromProfile(profile: EmotionalProfile): string {
    const { mood, energy, valence, tension, arousal, mode } = profile;
    
    // Map mood and characteristics to likely genre
    if (mood === 'aggressive' || (energy > 0.8 && valence < 0.4)) {
      return tension > 0.7 ? 'metal' : 'hard-rock';
    }
    
    if (mood === 'euphoric' || (energy > 0.7 && valence > 0.7)) {
      return arousal > 0.8 ? 'edm' : 'pop';
    }
    
    if (mood === 'melancholic' || (energy < 0.4 && valence < 0.4)) {
      return mode === 'minor' ? 'blues' : 'folk';
    }
    
    if (mood === 'peaceful' || (energy < 0.3 && valence > 0.6)) {
      return 'ambient';
    }
    
    if (mood === 'dramatic' || (tension > 0.6 && energy > 0.5)) {
      return 'classical';
    }
    
    if (mood === 'mysterious' || (valence < 0.5 && tension > 0.5)) {
      return 'jazz';
    }
    
    if (mood === 'heroic' || (mode === 'major' && energy > 0.6)) {
      return 'soundtrack';
    }
    
    // Default to indie for neutral/contemplative moods
    return 'indie-pop';
  }
  
  /**
   * Get current emotional temperature result
   */
  public getCurrentEmotionalTemperature(): EmotionalTemperatureResult | null {
    return this.currentEmotionalTemperature;
  }
  
  /**
   * Set emotional temperature override (for testing or manual control)
   */
  public setEmotionalTemperatureOverride(emotionalState: EmotionalState, intensity: number = 1.0, duration: number = 5000): void {
    try {
      const mockMusicData: MusicAnalysisData = {
        energy: intensity,
        valence: intensity > 0.5 ? 0.7 : 0.3, // High intensity usually positive
        genre: 'override'
      };
      
      const overrideTemperature = this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(mockMusicData);
      
      // Force the primary emotion to the requested state
      overrideTemperature.primaryEmotion = emotionalState;
      overrideTemperature.intensity = intensity;
      overrideTemperature.cssClass = `organic-emotion-${emotionalState}`;
      
      this.currentEmotionalTemperature = overrideTemperature;
      this.applyEmotionalTemperatureToDocument(overrideTemperature);
      
      Y3K?.debug?.log("EmotionalGradientMapper", "🌡️ Applied emotional temperature override:", {
        emotion: emotionalState,
        intensity,
        duration
      });
      
      // Reset after duration
      setTimeout(() => {
        Y3K?.debug?.log("EmotionalGradientMapper", "🌡️ Emotional temperature override expired");
        // The next spectral data event will restore automatic detection
      }, duration);
      
    } catch (error) {
      Y3K?.debug?.warn("EmotionalGradientMapper", "🌡️ Failed to apply emotional temperature override:", error);
    }
  }

  public destroy(): void {
    this.isActive = false;
    
    if (this.boundSpectralHandler) {
      document.removeEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.removeEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }
    
    // Clean up emotional temperature classes from document
    if (this.currentEmotionalTemperature) {
      const existingClasses = Array.from(document.body.classList).filter(cls => 
        cls.startsWith('organic-emotion-')
      );
      document.body.classList.remove(...existingClasses);
    }
    
    this.emotionalHistory = [];
    this.currentEmotionalProfile = null;
    this.currentEmotionalTemperature = null;
    
    Y3K?.debug?.log("EmotionalGradientMapper", "Emotional mapping system destroyed");
  }
}