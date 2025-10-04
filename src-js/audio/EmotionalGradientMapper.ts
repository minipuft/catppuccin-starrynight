/**
 * EmotionalGradientMapper - Musical Emotion to Visual Gradient Translation
 * Part of the Year 3000 Flux Visual Effects System
 *
 * Maps musical emotional content to gradient behaviors:
 * - Valence (sad ↔ happy) affects color warmth and brightness
 * - Energy (calm ↔ energetic) affects animation speed and intensity
 * - Arousal (relaxed ↔ exciting) affects contrast and saturation
 * - Tension (peaceful ↔ aggressive) affects color discord and movement
 * - Mode (major/minor) affects harmonic relationships
 * - Dynamics (soft ↔ loud) affects opacity and scale
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
// NOTE: SettingsManager import removed - was dead code, never used
import {
  EmotionalTemperatureMapper,
  type EmotionalState,
  type EmotionalTemperatureResult,
  type MusicAnalysisData,
} from "@/utils/color/EmotionalTemperatureMapper";

export interface EmotionalProfile {
  // Core emotional dimensions (0-1 range)
  valence: number; // 0=sad, 0.5=neutral, 1=happy
  energy: number; // 0=calm, 1=energetic
  arousal: number; // 0=relaxed, 1=exciting
  tension: number; // 0=peaceful, 1=aggressive

  // Musical characteristics
  mode: "major" | "minor" | "neutral"; // Harmonic mode
  dynamics: number; // 0=soft, 1=loud
  complexity: number; // 0=simple, 1=complex

  // Temporal characteristics
  stability: number; // 0=chaotic, 1=stable
  predictability: number; // 0=surprising, 1=predictable

  // Derived mood classification
  mood: MoodType;
  confidence: number; // 0-1 confidence in mood detection
}

export type MoodType =
  | "euphoric" // High valence, high energy
  | "content" // High valence, low energy
  | "melancholic" // Low valence, low energy
  | "aggressive" // Low valence, high energy
  | "mysterious" // Low valence, high tension
  | "peaceful" // High valence, low tension
  | "dramatic" // High tension, high complexity
  | "ambient" // Low energy, high stability
  | "chaotic" // Low stability, high complexity
  | "nostalgic" // Medium valence, minor mode
  | "heroic" // High energy, major mode
  | "contemplative" // Medium energy, high complexity
  | "neutral"; // Balanced across dimensions

export interface EmotionalGradientState {
  // Color transformation parameters
  hueShift: number; // -180 to +180 degrees
  saturationMultiplier: number; // 0.5 to 2.0
  brightnessMultiplier: number; // 0.5 to 2.0
  contrastMultiplier: number; // 0.5 to 2.0

  // Animation parameters
  animationSpeed: number; // 0.1 to 3.0 multiplier
  pulseIntensity: number; // 0-1 pulse strength
  flowDirection: number; // 0-360 degrees

  // Layer behavior
  layerHarmony: number; // 0-1 how well layers blend
  discordLevel: number; // 0-1 intentional color conflicts
  depthPerception: number; // 0-1 3D depth illusion

  // Transition behavior
  transitionSpeed: number; // 0.1 to 5.0 multiplier
  smoothing: number; // 0-1 temporal smoothing
  responsiveness: number; // 0-1 how quickly to adapt
}

export class EmotionalGradientMapper {
  private cssController!: OptimizedCSSVariableManager;
  private musicSyncService: MusicSyncService | null = null;
  // NOTE: settingsManager field removed - was dead code, never used

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
  private moodProfiles: { [key in MoodType]: Partial<EmotionalGradientState> } =
    {
      euphoric: {
        hueShift: 15, // Warm yellows/oranges
        saturationMultiplier: 1.3, // Vibrant colors (reduced from 1.4)
        brightnessMultiplier: 1.2, // Bright (reduced from 1.3)
        contrastMultiplier: 1.2, // High contrast
        animationSpeed: 1.5, // Fast animations
        pulseIntensity: 0.8, // Strong pulse
        layerHarmony: 0.9, // Harmonious
        discordLevel: 0.1, // Low discord
        transitionSpeed: 0.8, // Quick transitions
      },
      content: {
        hueShift: 5, // Subtle warm shift
        saturationMultiplier: 1.1, // Slightly saturated
        brightnessMultiplier: 1.1, // Slightly bright
        contrastMultiplier: 1.0, // Normal contrast
        animationSpeed: 0.8, // Slower animations
        pulseIntensity: 0.4, // Gentle pulse
        layerHarmony: 0.95, // Very harmonious
        discordLevel: 0.05, // Very low discord
        transitionSpeed: 1.5, // Smooth transitions
      },
      melancholic: {
        hueShift: -30, // Cool blues/purples
        saturationMultiplier: 0.8, // Desaturated (increased from 0.7)
        brightnessMultiplier: 0.8, // Darker
        contrastMultiplier: 0.9, // Lower contrast
        animationSpeed: 0.6, // Slow animations
        pulseIntensity: 0.3, // Weak pulse
        layerHarmony: 0.8, // Somewhat harmonious
        discordLevel: 0.2, // Some discord
        transitionSpeed: 2.0, // Very smooth transitions
      },
      aggressive: {
        hueShift: -15, // Reds/magentas
        saturationMultiplier: 1.3, // Very saturated (reduced from 1.6)
        brightnessMultiplier: 1.2, // Bright
        contrastMultiplier: 1.5, // High contrast
        animationSpeed: 2.0, // Very fast
        pulseIntensity: 1.0, // Maximum pulse
        layerHarmony: 0.6, // Less harmonious
        discordLevel: 0.4, // Notable discord
        transitionSpeed: 0.5, // Sharp transitions
      },
      mysterious: {
        hueShift: -45, // Deep purples/blues
        saturationMultiplier: 0.9, // Slightly desaturated
        brightnessMultiplier: 0.8, // Dark (increased from 0.7)
        contrastMultiplier: 1.3, // High contrast
        animationSpeed: 0.7, // Medium-slow
        pulseIntensity: 0.6, // Moderate pulse
        layerHarmony: 0.7, // Somewhat mysterious
        discordLevel: 0.3, // Moderate discord
        transitionSpeed: 1.8, // Gradual transitions
      },
      peaceful: {
        hueShift: 25, // Soft greens/blues
        saturationMultiplier: 0.8, // Gentle saturation
        brightnessMultiplier: 1.0, // Natural brightness
        contrastMultiplier: 0.9, // Soft contrast
        animationSpeed: 0.5, // Very slow
        pulseIntensity: 0.2, // Minimal pulse
        layerHarmony: 1.0, // Perfect harmony
        discordLevel: 0.0, // No discord
        transitionSpeed: 3.0, // Very smooth
      },
      dramatic: {
        hueShift: 0, // Full spectrum
        saturationMultiplier: 1.3, // High saturation
        brightnessMultiplier: 1.1, // Bright
        contrastMultiplier: 1.4, // High contrast
        animationSpeed: 1.2, // Dynamic
        pulseIntensity: 0.9, // Strong pulse
        layerHarmony: 0.6, // Dynamic tension
        discordLevel: 0.4, // Intentional discord
        transitionSpeed: 0.7, // Dramatic transitions
      },
      ambient: {
        hueShift: 10, // Subtle shifts
        saturationMultiplier: 0.8, // Very desaturated (increased from 0.6)
        brightnessMultiplier: 0.9, // Soft
        contrastMultiplier: 0.8, // Low contrast
        animationSpeed: 0.3, // Very slow
        pulseIntensity: 0.1, // Barely perceptible
        layerHarmony: 0.9, // Harmonious
        discordLevel: 0.1, // Minimal discord
        transitionSpeed: 4.0, // Ultra-smooth
      },
      chaotic: {
        hueShift: 0, // Full spectrum chaos
        saturationMultiplier: 1.3, // High saturation (reduced from 1.5)
        brightnessMultiplier: 1.2, // Bright
        contrastMultiplier: 1.6, // Very high contrast
        animationSpeed: 2.5, // Chaotic speed
        pulseIntensity: 0.9, // Strong pulse
        layerHarmony: 0.3, // Low harmony
        discordLevel: 0.7, // High discord
        transitionSpeed: 0.3, // Rapid transitions
      },
      nostalgic: {
        hueShift: -10, // Slight cool shift
        saturationMultiplier: 0.8, // Faded colors
        brightnessMultiplier: 0.95, // Slightly dimmed
        contrastMultiplier: 0.9, // Soft contrast
        animationSpeed: 0.7, // Reflective pace
        pulseIntensity: 0.4, // Gentle pulse
        layerHarmony: 0.85, // Mostly harmonious
        discordLevel: 0.15, // Slight melancholy
        transitionSpeed: 2.2, // Smooth, flowing
      },
      heroic: {
        hueShift: 20, // Warm, golden tones
        saturationMultiplier: 1.2, // Rich colors
        brightnessMultiplier: 1.2, // Bright and bold (reduced from 1.25)
        contrastMultiplier: 1.3, // Strong contrast
        animationSpeed: 1.3, // Bold movement
        pulseIntensity: 0.7, // Strong pulse
        layerHarmony: 0.8, // Confident harmony
        discordLevel: 0.2, // Controlled tension
        transitionSpeed: 1.0, // Confident transitions
      },
      contemplative: {
        hueShift: -5, // Neutral with slight cool
        saturationMultiplier: 0.9, // Thoughtful saturation
        brightnessMultiplier: 1.0, // Balanced brightness
        contrastMultiplier: 1.1, // Clear contrast
        animationSpeed: 0.6, // Thoughtful pace
        pulseIntensity: 0.3, // Gentle reflection
        layerHarmony: 0.8, // Balanced harmony
        discordLevel: 0.2, // Contemplative tension
        transitionSpeed: 2.5, // Thoughtful transitions
      },
      neutral: {
        hueShift: 0, // No shift
        saturationMultiplier: 1.0, // Natural saturation
        brightnessMultiplier: 1.0, // Natural brightness
        contrastMultiplier: 1.0, // Natural contrast
        animationSpeed: 1.0, // Normal speed
        pulseIntensity: 0.5, // Moderate pulse
        layerHarmony: 0.75, // Balanced
        discordLevel: 0.25, // Balanced discord
        transitionSpeed: 1.5, // Moderate transitions
      },
    };

  constructor(
    cssController?: OptimizedCSSVariableManager,
    musicSyncService: MusicSyncService | null = null
    // NOTE: settingsManager parameter removed - was dead code, never used
  ) {
    this.cssController = cssController || getGlobalOptimizedCSSController();
    this.musicSyncService = musicSyncService;
    // NOTE: settingsManager assignment removed - was dead code, never used

    // Initialize with neutral gradient state
    this.currentGradientState = this.createNeutralGradientState();

    // 🌡️ Initialize emotional temperature mapper
    this.emotionalTemperatureMapper = new EmotionalTemperatureMapper(true); // Enable debug

    // Create mood-to-emotional-state mapping
    this.moodToEmotionMap = {
      euphoric: "energetic",
      content: "happy",
      melancholic: "melancholy",
      aggressive: "aggressive",
      mysterious: "mysterious",
      peaceful: "calm",
      dramatic: "epic",
      ambient: "ambient",
      chaotic: "aggressive", // Map chaotic to aggressive for high energy
      nostalgic: "melancholy",
      heroic: "epic",
      contemplative: "calm",
      neutral: "ambient",
    };

    this.boundSpectralHandler = this.handleSpectralData.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);
  }

  public async initialize(): Promise<void> {
    // CSS controller is already initialized in constructor

    // Subscribe to music analysis events
    if (this.boundSpectralHandler) {
      document.addEventListener(
        "music-sync:data-updated",
        this.boundSpectralHandler
      );
    }

    if (this.boundSettingsHandler) {
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundSettingsHandler
      );
    }

    this.isActive = true;
    Y3KDebug?.debug?.log(
      "EmotionalGradientMapper",
      "Emotional mapping system initialized"
    );
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
      responsiveness: 0.8,
    };
  }

  private handleSpectralData(event: Event): void {
    if (!this.isActive) return;

    const customEvent = event as CustomEvent;
    const musicData = customEvent.detail as MusicAnalysisData;

    if (!musicData) return;

    // Analyze emotional content from music analysis data
    const emotionalProfile = this.analyzeEmotionalContent(musicData);

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
        mode: emotionalProfile.mode === "major" ? 1 : 0,
        key: 0, // Default
        genre: this.inferGenreFromProfile(emotionalProfile),
      };

      this.currentEmotionalTemperature =
        this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(
          musicAnalysisData
        );

      // Apply emotional temperature CSS classes and variables to document
      this.applyEmotionalTemperatureToDocument(
        this.currentEmotionalTemperature
      );

      Y3KDebug?.debug?.log(
        "EmotionalGradientMapper",
        "🌡️ Applied emotional temperature:",
        {
          mood: emotionalProfile.mood,
          emotionalState: this.currentEmotionalTemperature.primaryEmotion,
          temperature: this.currentEmotionalTemperature.temperature,
          intensity: this.currentEmotionalTemperature.intensity,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "EmotionalGradientMapper",
        "🌡️ Failed to apply emotional temperature:",
        error
      );
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

  private analyzeEmotionalContent(
    musicData: MusicAnalysisData
  ): EmotionalProfile {
    // Extract emotional dimensions from music analysis data
    const valence = musicData.valence || 0.5;
    const energy = musicData.energy || 0.5;
    const arousal = musicData.danceability || 0.5;
    const tension = this.calculateTension(musicData);

    // Determine musical characteristics
    const mode = this.detectMode(musicData);
    const dynamics = this.calculateDynamics(musicData);
    const complexity = this.calculateComplexity(musicData);

    // Calculate temporal characteristics
    const stability = this.calculateStability();
    const predictability = this.calculatePredictability();

    // Classify mood
    const mood = this.classifyMood(valence, energy, arousal, tension, mode);
    const confidence = this.calculateMoodConfidence(
      valence,
      energy,
      arousal,
      tension
    );

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
      confidence,
    };
  }

  private calculateTension(musicData: MusicAnalysisData): number {
    // Calculate tension from available music data
    const loudnessInfluence = Math.abs((musicData.loudness || 0) / -60); // Normalize loudness
    const tempoInfluence = musicData.tempo ? Math.min(1, (musicData.tempo - 60) / 140) : 0.5; // Normalize tempo
    const acousticnessReduction = 1 - (musicData.acousticness || 0.5); // Less acoustic = more tension
    const speechinessInfluence = musicData.speechiness || 0;

    return Math.max(
      0,
      Math.min(
        1,
        (loudnessInfluence * 0.4 + tempoInfluence * 0.3 + acousticnessReduction * 0.2 + speechinessInfluence * 0.1)
      )
    );
  }

  private calculateDynamics(musicData: MusicAnalysisData): number {
    // Calculate dynamics from loudness and energy
    const loudnessComponent = Math.abs((musicData.loudness || 0) / -60); // Normalize loudness
    const energyComponent = musicData.energy || 0.5;
    
    return Math.max(0, Math.min(1, (loudnessComponent + energyComponent) / 2));
  }

  private calculateComplexity(musicData: MusicAnalysisData): number {
    // Calculate complexity from instrumentalness, speechiness, and tempo variations
    const instrumentalComplexity = musicData.instrumentalness || 0.5;
    const speechComplexity = musicData.speechiness || 0;
    const acousticSimplicity = 1 - (musicData.acousticness || 0.5);
    
    return Math.max(0, Math.min(1, (instrumentalComplexity + speechComplexity + acousticSimplicity) / 3));
  }

  private detectMode(
    musicData: MusicAnalysisData
  ): "major" | "minor" | "neutral" {
    // Detect mode from Spotify's mode data and musical characteristics
    if (typeof musicData.mode === 'number') {
      return musicData.mode === 1 ? "major" : "minor";
    }
    
    // Fallback mode detection based on valence and acousticness
    const valence = musicData.valence || 0.5;
    const acousticness = musicData.acousticness || 0.5;
    
    if (valence > 0.6 && acousticness > 0.5) {
      return "major";
    } else if (valence < 0.4 || acousticness < 0.3) {
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
      const previous =
        this.emotionalHistory[this.emotionalHistory.length - i - 1];

      // Add null/undefined checks for array access
      if (current && previous) {
        variance += Math.abs(current.valence - previous.valence);
        variance += Math.abs(current.energy - previous.energy);
        variance += Math.abs(current.arousal - previous.arousal);
      }
    }

    return Math.max(0, Math.min(1, 1 - variance / (recentFrames * 3)));
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
      const previous = recent[i - 1];

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

  private classifyMood(
    valence: number,
    energy: number,
    arousal: number,
    tension: number,
    mode: string
  ): MoodType {
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

  private calculateMoodConfidence(
    valence: number,
    energy: number,
    arousal: number,
    tension: number
  ): number {
    // Confidence based on how clearly defined the emotional dimensions are
    const clarity = [valence, energy, arousal, tension].map(
      (value) => Math.abs(value - 0.5) * 2 // Distance from neutral
    );

    return clarity.reduce((sum, c) => sum + c, 0) / clarity.length;
  }

  private mapEmotionToGradient(
    emotionalProfile: EmotionalProfile
  ): EmotionalGradientState {
    const baseMoodProfile = this.moodProfiles[emotionalProfile.mood];
    const baseState = {
      ...this.createNeutralGradientState(),
      ...baseMoodProfile,
    };

    // Apply fine-tuning based on specific emotional dimensions
    return {
      ...baseState,
      hueShift: baseState.hueShift! + (emotionalProfile.valence - 0.5) * 20,
      saturationMultiplier:
        baseState.saturationMultiplier! *
        (0.5 + emotionalProfile.arousal * 0.5),
      brightnessMultiplier:
        baseState.brightnessMultiplier! * (0.7 + emotionalProfile.energy * 0.6),
      contrastMultiplier:
        baseState.contrastMultiplier! * (0.6 + emotionalProfile.tension * 0.8),
      animationSpeed:
        baseState.animationSpeed! * (0.3 + emotionalProfile.energy * 1.4),
      pulseIntensity: baseState.pulseIntensity! * emotionalProfile.arousal,
      flowDirection: emotionalProfile.valence * 360,
      layerHarmony:
        baseState.layerHarmony! * (0.3 + emotionalProfile.stability * 0.7),
      discordLevel:
        baseState.discordLevel! * (0.1 + emotionalProfile.tension * 0.9),
      depthPerception: 0.3 + emotionalProfile.complexity * 0.7,
      transitionSpeed:
        baseState.transitionSpeed! /
        (0.5 + emotionalProfile.predictability * 1.5),
      smoothing: 0.4 + emotionalProfile.stability * 0.6,
      responsiveness: 0.4 + emotionalProfile.confidence * 0.6,
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
      saturationMultiplier: this.lerp(
        current.saturationMultiplier,
        target.saturationMultiplier,
        smoothingFactor
      ),
      brightnessMultiplier: this.lerp(
        current.brightnessMultiplier,
        target.brightnessMultiplier,
        smoothingFactor
      ),
      contrastMultiplier: this.lerp(
        current.contrastMultiplier,
        target.contrastMultiplier,
        smoothingFactor
      ),
      animationSpeed: this.lerp(
        current.animationSpeed,
        target.animationSpeed,
        smoothingFactor
      ),
      pulseIntensity: this.lerp(
        current.pulseIntensity,
        target.pulseIntensity,
        smoothingFactor
      ),
      flowDirection: this.lerp(
        current.flowDirection,
        target.flowDirection,
        smoothingFactor
      ),
      layerHarmony: this.lerp(
        current.layerHarmony,
        target.layerHarmony,
        smoothingFactor
      ),
      discordLevel: this.lerp(
        current.discordLevel,
        target.discordLevel,
        smoothingFactor
      ),
      depthPerception: this.lerp(
        current.depthPerception,
        target.depthPerception,
        smoothingFactor
      ),
      transitionSpeed: this.lerp(
        current.transitionSpeed,
        target.transitionSpeed,
        smoothingFactor * 0.5
      ),
      smoothing: this.lerp(current.smoothing, target.smoothing, 0.1),
      responsiveness: this.lerp(
        current.responsiveness,
        target.responsiveness,
        0.1
      ),
    };
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  private updateGradientVariables(): void {
    const state = this.currentGradientState;

    // Batch update emotional gradient modifier variables using coordination
    const emotionalVariables = {
      "--sn-emotional-hue-shift": `${state.hueShift}deg`,
      "--sn-emotional-saturation-multiplier": state.saturationMultiplier.toString(),
      "--sn-emotional-brightness-multiplier": state.brightnessMultiplier.toString(),
      "--sn-emotional-contrast-multiplier": state.contrastMultiplier.toString(),
      "--sn-emotional-animation-speed": state.animationSpeed.toString(),
      "--sn-emotional-pulse-intensity": state.pulseIntensity.toString(),
      "--sn-emotional-flow-direction": `${state.flowDirection}deg`,
      "--sn-emotional-layer-harmony": state.layerHarmony.toString(),
      "--sn-emotional-discord-level": state.discordLevel.toString(),
      "--sn-emotional-depth-perception": state.depthPerception.toString(),
      "--sn-emotional-transition-speed": state.transitionSpeed.toString(),
    };

    this.cssController.batchSetVariables(
      "EmotionalGradientMapper",
      emotionalVariables,
      "normal", // Normal priority for emotional gradient updates
      "emotional-gradient-mapping"
    );

    // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION: Apply temperature-based CSS variables
    if (this.currentEmotionalTemperature) {
      // Prepare all emotional temperature CSS variables for batch update
      const temperatureVariables = {
        ...this.currentEmotionalTemperature.cssVariables,
        "--sn-emotional-temperature": this.currentEmotionalTemperature.temperature.toString(),
        "--sn-emotional-temperature-intensity": this.currentEmotionalTemperature.intensity.toString(),
        "--sn-emotional-temperature-class": this.currentEmotionalTemperature.cssClass,
        "--sn-emotional-temperature-blend": this.currentEmotionalTemperature.intensity.toString(),
      };

      this.cssController.batchSetVariables(
        "EmotionalGradientMapper",
        temperatureVariables,
        "high", // High priority for emotional temperature (affects perception)
        "emotional-temperature-mapping"
      );

      Y3KDebug?.debug?.log(
        "EmotionalGradientMapper",
        "🌡️ Applied temperature CSS variables:",
        {
          temperature: this.currentEmotionalTemperature.temperature,
          intensity: this.currentEmotionalTemperature.intensity,
          cssClass: this.currentEmotionalTemperature.cssClass,
          variableCount: Object.keys(
            this.currentEmotionalTemperature.cssVariables
          ).length,
        }
      );
    }

    // 🔧 CRITICAL ENHANCEMENT: Coordinate with consolidated gradient system
    // Apply emotional modifications to background gradient variables
    this.updateEmotionalGradientCoordination(state);

    // Update current mood information using coordination
    if (this.currentEmotionalProfile) {
      const moodVariables = {
        "--sn-current-mood": this.currentEmotionalProfile.mood,
        "--sn-mood-confidence": this.currentEmotionalProfile.confidence.toString(),
        "--sn-emotional-valence": this.currentEmotionalProfile.valence.toString(),
        "--sn-emotional-energy": this.currentEmotionalProfile.energy.toString(),
      };

      this.cssController.batchSetVariables(
        "EmotionalGradientMapper",
        moodVariables,
        "normal", // Normal priority for mood information
        "mood-state-tracking"
      );
    }
  }

  /**
   * Coordinate emotional modifications with the consolidated --sn-bg-gradient-* system
   */
  private updateEmotionalGradientCoordination(
    state: EmotionalGradientState
  ): void {
    // Get current background gradient colors (set by ColorHarmonyEngine/Year3000System)
    const rootStyle = getComputedStyle(document.documentElement);
    const currentPrimary = rootStyle
      .getPropertyValue("--sn-bg-gradient-primary")
      .trim();
    const currentSecondary = rootStyle
      .getPropertyValue("--sn-bg-gradient-secondary")
      .trim();
    const currentAccent = rootStyle
      .getPropertyValue("--sn-bg-gradient-accent")
      .trim();

    // Only proceed if we have base gradient colors to modify
    if (currentPrimary || currentSecondary || currentAccent) {
      // Batch update background gradient coordination variables
      const backgroundGradientVariables = {
        "--sn-bg-gradient-flow-x": (state.flowDirection! * 0.01).toString(),
        "--sn-bg-gradient-flow-y": (Math.sin((state.flowDirection! * Math.PI) / 180) * 0.5).toString(),
        "--sn-bg-gradient-opacity": (0.8 * state.layerHarmony!).toString(),
        "--sn-bg-gradient-blur": `${120 * (1 + state.depthPerception! * 0.5)}px`,
        "--sn-bg-gradient-saturation": state.saturationMultiplier!.toString(),
        "--sn-bg-gradient-brightness": state.brightnessMultiplier!.toString(),
        "--sn-bg-gradient-contrast": state.contrastMultiplier!.toString(),
      };

      this.cssController.batchSetVariables(
        "EmotionalGradientMapper",
        backgroundGradientVariables,
        "normal", // Normal priority for background gradient coordination
        "bg-gradient-coordination"
      );

      Y3KDebug?.debug?.log(
        "EmotionalGradientMapper",
        `Coordinated emotional modifications with gradient system: flow=${
          state.flowDirection
        }°, opacity=${0.8 * state.layerHarmony!}`
      );
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
      Y3KDebug?.debug?.log(
        "EmotionalGradientMapper",
        "Settings changed, updating emotional sensitivity"
      );
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
      this.currentGradientState = {
        ...this.currentGradientState,
        ...overrideProfile,
      };
      this.updateGradientVariables();

      // Reset after duration
      setTimeout(() => {
        Y3KDebug?.debug?.log(
          "EmotionalGradientMapper",
          "Mood override expired, returning to automatic detection"
        );
      }, duration);
    }
  }

  /**
   * 🌡️ Apply emotional temperature CSS classes and variables to the document
   */
  private applyEmotionalTemperatureToDocument(
    emotionalTemperature: EmotionalTemperatureResult
  ): void {
    // Remove existing emotional temperature classes from body
    const existingClasses = Array.from(document.body.classList).filter((cls) =>
      cls.startsWith("smooth-emotion-")
    );
    document.body.classList.remove(...existingClasses);

    // Apply primary emotional temperature class
    document.body.classList.add(emotionalTemperature.cssClass);

    // Apply secondary emotion blend class if present
    if (emotionalTemperature.secondaryEmotion) {
      document.body.classList.add(
        `smooth-emotion-blend-${emotionalTemperature.secondaryEmotion}`
      );
    }

    // Apply CSS variables to document root using coordination
    this.cssController.batchSetVariables(
      "EmotionalGradientMapper",
      emotionalTemperature.cssVariables,
      "high", // High priority for emotional temperature document updates
      "emotional-temperature-document"
    );

    Y3KDebug?.debug?.log(
      "EmotionalGradientMapper",
      "🌡️ Applied emotional temperature to document:",
      {
        primaryClass: emotionalTemperature.cssClass,
        secondaryEmotion: emotionalTemperature.secondaryEmotion,
        cssVariableCount: Object.keys(emotionalTemperature.cssVariables).length,
      }
    );
  }

  /**
   * 🌡️ Infer genre from emotional profile for temperature mapping
   */
  private inferGenreFromProfile(profile: EmotionalProfile): string {
    const { mood, energy, valence, tension, arousal, mode } = profile;

    // Map mood and characteristics to likely genre
    if (mood === "aggressive" || (energy > 0.8 && valence < 0.4)) {
      return tension > 0.7 ? "metal" : "hard-rock";
    }

    if (mood === "euphoric" || (energy > 0.7 && valence > 0.7)) {
      return arousal > 0.8 ? "edm" : "pop";
    }

    if (mood === "melancholic" || (energy < 0.4 && valence < 0.4)) {
      return mode === "minor" ? "blues" : "folk";
    }

    if (mood === "peaceful" || (energy < 0.3 && valence > 0.6)) {
      return "ambient";
    }

    if (mood === "dramatic" || (tension > 0.6 && energy > 0.5)) {
      return "classical";
    }

    if (mood === "mysterious" || (valence < 0.5 && tension > 0.5)) {
      return "jazz";
    }

    if (mood === "heroic" || (mode === "major" && energy > 0.6)) {
      return "soundtrack";
    }

    // Default to indie for neutral/contemplative moods
    return "indie-pop";
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
  public setEmotionalTemperatureOverride(
    emotionalState: EmotionalState,
    intensity: number = 1.0,
    duration: number = 5000
  ): void {
    try {
      const mockMusicData: MusicAnalysisData = {
        energy: intensity,
        valence: intensity > 0.5 ? 0.7 : 0.3, // High intensity usually positive
        genre: "override",
      };

      const overrideTemperature =
        this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(
          mockMusicData
        );

      // Force the primary emotion to the requested state
      overrideTemperature.primaryEmotion = emotionalState;
      overrideTemperature.intensity = intensity;
      overrideTemperature.cssClass = `smooth-emotion-${emotionalState}`;

      this.currentEmotionalTemperature = overrideTemperature;
      this.applyEmotionalTemperatureToDocument(overrideTemperature);

      Y3KDebug?.debug?.log(
        "EmotionalGradientMapper",
        "🌡️ Applied emotional temperature override:",
        {
          emotion: emotionalState,
          intensity,
          duration,
        }
      );

      // Reset after duration
      setTimeout(() => {
        Y3KDebug?.debug?.log(
          "EmotionalGradientMapper",
          "🌡️ Emotional temperature override expired"
        );
        // The next spectral data event will restore automatic detection
      }, duration);
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "EmotionalGradientMapper",
        "🌡️ Failed to apply emotional temperature override:",
        error
      );
    }
  }

  public destroy(): void {
    this.isActive = false;

    if (this.boundSpectralHandler) {
      document.removeEventListener(
        "music-sync:data-updated",
        this.boundSpectralHandler
      );
    }

    if (this.boundSettingsHandler) {
      document.removeEventListener(
        "year3000SystemSettingsChanged",
        this.boundSettingsHandler
      );
    }

    // Clean up emotional temperature classes from document
    if (this.currentEmotionalTemperature) {
      const existingClasses = Array.from(document.body.classList).filter(
        (cls) => cls.startsWith("smooth-emotion-")
      );
      document.body.classList.remove(...existingClasses);
    }

    this.emotionalHistory = [];
    this.currentEmotionalProfile = null;
    this.currentEmotionalTemperature = null;

    Y3KDebug?.debug?.log(
      "EmotionalGradientMapper",
      "Emotional mapping system destroyed"
    );
  }
}
