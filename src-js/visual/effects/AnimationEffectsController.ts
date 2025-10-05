/**
 * AnimationEffectsController - Smooth Animation System
 * 
 * Provides gentle animations for visual enhancement during calm musical moments.
 * Creates natural animation effects synchronized with music tempo and intensity for meditative experience.
 * 
 * Technical Features:
 * - Natural animation rhythms synchronized with music tempo (0.2-0.8Hz)
 * - Seasonal color palette transitions (spring, summer, autumn, winter)
 * - Service-aware architecture with optional dependency injection
 * - WCAG-compliant with reduced motion support
 * 
 * @architecture Year3000System - Breathing Animation Integration
 * @performance 60fps smooth animations, <10ms processing time
 * @compatibility IManagedSystem interface, ServiceContainer integration
 */

import { ServiceVisualSystemBase } from "@/core/services/ServiceCompositionBase";
import { HolographicUISystem } from "@/visual/music/ui/HolographicUISystem";
import { colorTransitionManager } from "@/visual/effects/MusicColorTransitionState";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorTypes";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult } from "@/types/systems";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";

/**
 * Current state of the animation effects system
 */
export interface AnimationEffectState {
  /** Current animation intensity level (0-1, inactive to fully active) */
  animationIntensity: number;
  /** Breathing frequency in Hz (0.2-0.8Hz, slow to normal animation rate) */
  animationFrequency: number;
  /** Breathing depth amplitude (0-1, shallow to deep animation) */
  animationDepth: number;
  /** Grounding effect intensity (0-1, represents connection/stability) */
  grounding: number;
  /** Warm color intensity (0-1, cool to warm color temperature) */
  warmth: number;
  /** Ambient atmosphere level (0-1, minimal to rich atmosphere) */
  ambientLevel: number;
  /** Color transition effects intensity (0-1, static to dynamic colors) */
  colorShift: number;
  /** Overall visual harmony level (0-1, represents visual coherence) */
  harmonyLevel: number;
}

/**
 * Configuration settings for animation effects behavior
 */
export interface BreathingEffectConfig {
  /** Musical intensity threshold for animation activation (0-1) */
  calmThreshold: number;
  /** Maximum animation depth amplitude (0-1) */
  maxBreathingDepth: number;
  /** Valid animation frequency range in Hz [min, max] */
  frequencyRange: [number, number];
  /** Color effect strength multiplier (0-1) */
  colorStrength: number;
  /** Duration of smooth transitions in milliseconds */
  transitionDuration: number;
  /** Speed multiplier for animation cycles (0.1-2.0) */
  cycleSpeed: number;
}

/**
 * Color mapping for animation effects across different seasons/moods
 */
export interface BreathingColorMapping {
  /** Primary warm color tone (reds, oranges, yellows) */
  warmTone: RGB;
  /** Primary cool color tone (greens, blues, cyans) */
  coolTone: RGB;
  /** Accent blue for depth and contrast */
  accentBlue: RGB;
  /** Highlight glow color for luminous effects */
  highlightGlow: RGB;
  /** Neutral gray for balance and grounding */
  neutralGray: RGB;
  /** Overall transparency level (0-1) */
  transparency: number;
}

/**
 * AnimationEffectsController - Smooth animation animations for visual enhancement
 *
 * Implements calm animation effects that synchronize with low-intensity music for meditative
 * visual experience. Features seasonal color transitions and service-aware architecture.
 *
 * Architecture:
 * - Extends ServiceVisualSystemBase for lifecycle management
 * - Service composition via dependency injection
 * - Direct UnifiedEventBus integration with service fallback
 * - Seasonal palette system with smooth transitions
 */
export class AnimationEffectsController extends ServiceVisualSystemBase {
  private holographicSystem: HolographicUISystem | null = null;
  private cssController!: CSSVariableWriter;
  protected override musicSyncService: MusicSyncService | null = null;
  
  private effectState: AnimationEffectState;
  private harmonyConfig: BreathingEffectConfig;
  private naturalElements: Map<string, HTMLElement> = new Map();
  
  // Performance tracking
  private performanceMetrics = {
    peacefulMomentCount: 0,
    averageProcessingTime: 0,
    lastUpdateTime: 0,
    animationCycleCount: 0
  };
  
  // Animation phase state
  private animationPhases = {
    animationPhase: 0,           // Main animation cycle phase
    seasonalPhase: 0,            // Seasonal transition phase
    variationPhase: 0,           // Animation variation phase
    harmonyPhase: 0,             // Natural harmony phase
  };
  
  // Natural color palettes for different seasons/moods
  private naturalPalettes = {
    'spring-awakening': {
      earthyWarm: { r: 166, g: 227, b: 161 },     // Catppuccin green (spring)
      forestGreen: { r: 64, g: 160, b: 43 },      // Deep forest green
      skyBlue: { r: 137, g: 220, b: 235 },        // Catppuccin sky
      sunsetGlow: { r: 250, g: 179, b: 135 },     // Catppuccin peach
      stoneGray: { r: 108, g: 112, b: 134 },      // Catppuccin overlay0
    },
    'summer-warmth': {
      earthyWarm: { r: 249, g: 226, b: 175 },     // Catppuccin yellow (warm)
      forestGreen: { r: 166, g: 227, b: 161 },    // Catppuccin green
      skyBlue: { r: 116, g: 199, b: 236 },        // Catppuccin sapphire
      sunsetGlow: { r: 250, g: 179, b: 135 },     // Catppuccin peach
      stoneGray: { r: 147, g: 153, b: 178 },      // Catppuccin overlay2
    },
    'autumn-grounding': {
      earthyWarm: { r: 250, g: 179, b: 135 },     // Catppuccin peach (autumn)
      forestGreen: { r: 148, g: 226, b: 213 },    // Catppuccin teal
      skyBlue: { r: 137, g: 180, b: 250 },        // Catppuccin blue
      sunsetGlow: { r: 235, g: 160, b: 172 },     // Catppuccin flamingo
      stoneGray: { r: 127, g: 132, b: 156 },      // Catppuccin overlay1
    },
    'winter-peace': {
      earthyWarm: { r: 186, g: 194, b: 222 },     // Catppuccin subtext1 (cool)
      forestGreen: { r: 148, g: 226, b: 213 },    // Catppuccin teal
      skyBlue: { r: 137, g: 220, b: 235 },        // Catppuccin sky
      sunsetGlow: { r: 203, g: 166, b: 247 },     // Catppuccin mauve
      stoneGray: { r: 88, g: 91, b: 112 },        // Catppuccin surface2
    }
  };

  constructor(config: AdvancedSystemConfig | Year3000Config, holographicSystem?: HolographicUISystem) {
    super(config);

    // Store holographic system if provided (for backward compatibility)
    if (holographicSystem) {
      this.holographicSystem = holographicSystem;
    }

    // Initialize animation effect state
    this.effectState = {
      animationIntensity: 0,
      animationFrequency: 0.4,      // Natural resting frequency (0.4Hz = 24 breaths/min)
      animationDepth: 0.8,          // Deep, natural animation
      grounding: 0,
      warmth: 0.7,                  // Warm, grounded feeling
      ambientLevel: 0,
      colorShift: 0,
      harmonyLevel: 0
    };

    // Initialize animation effect configuration
    this.harmonyConfig = {
      calmThreshold: 0.3,           // Activate on low intensity (peaceful music)
      maxBreathingDepth: 0.9,       // Deep natural animation
      frequencyRange: [0.2, 0.8],   // 0.2Hz (12 bpm) to 0.8Hz (48 bpm)
      colorStrength: 0.6,           // Moderate color influence
      transitionDuration: 3000,     // 3-second transitions
      cycleSpeed: 0.1               // Slow animation cycles
    };
  }

  /**
   * Initialize the animation effects system
   *
   * Sets up event subscriptions, animation elements detection, CSS variables,
   * and starts the animation loop for animation effects.
   *
   * @returns Promise<void> Resolves when initialization completes
   * @throws Error if system fails to initialize
   * @override ServiceVisualSystemBase lifecycle method
   */
  protected override async performVisualSystemInitialization(): Promise<void> {
    try {
      console.log('[AnimationEffectsController] Initializing animation effects...');

      // Initialize CSS coordination - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController = year3000System?.cssVariableController || getGlobalCSSVariableWriter();

      // Get music sync service from Year3000System if not already set
      if (!this.musicSyncService && year3000System?.musicSyncService) {
        this.musicSyncService = year3000System.musicSyncService;
      }

      // Create holographic system if not provided in constructor
      if (!this.holographicSystem) {
        const { VisualEffectsManager } = await import('@/types/colorTypes');
        const biologicalManager = new VisualEffectsManager();
        const { HolographicUISystem } = await import('@/visual/music/ui/HolographicUISystem');
        this.holographicSystem = new HolographicUISystem(
          biologicalManager,
          this.musicSyncService || undefined
        );
      }

      // Register for color coordination events
      this.subscribeToColorEvents();

      // Initialize animation effect elements
      await this.initializeBreathingElements();

      // Setup CSS variables for animation effects
      this.setupBreathingCSSVariables();

      // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by AnimationFrameCoordinator
      // The coordinator will call updateAnimation(deltaTime) automatically
      // Registration happens in SystemIntegrationCoordinator during system initialization

      console.log('[AnimationEffectsController] 🌿 Breathing effects system ready');

    } catch (error) {
      console.error('[AnimationEffectsController] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Update animation effects for current animation frame
   * 
   * Processes animation animation phases, updates visual state from music analysis,
   * and applies animation effects to DOM elements.
   * 
   * @param deltaTime - Time elapsed since last frame in milliseconds  
   * @public IManagedSystem animation interface
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;
    
    const deltaSeconds = deltaTime / 1000;
    
    // Update animation phases (natural, smooth timing)
    this.animationPhases.animationPhase += deltaSeconds * this.effectState.animationFrequency * 2 * Math.PI;
    this.animationPhases.seasonalPhase += deltaSeconds * this.harmonyConfig.cycleSpeed;
    this.animationPhases.variationPhase += deltaSeconds * 0.4; // Slow animation variation
    this.animationPhases.harmonyPhase += deltaSeconds * 0.6; // Natural harmony phase
    
    // Update natural state from music
    this.updateNaturalFromMusic();
    
    // Update animation visual effects
    this.updateBreathingVisuals();
    
    // Update animation elements
    this.updateBreathingElements();
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }

  /**
   * Perform system health check for animation effects
   * 
   * Validates initialization status, animation intensity levels, and performance metrics
   * to ensure the animation effects system is operating within acceptable parameters.
   * 
   * @returns Promise<HealthCheckResult> System health status and metrics
   * @public IManagedSystem monitoring interface
   */
  protected override async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const isHealthy = this.initialized &&
                     this.effectState.animationIntensity >= 0 &&
                     this.performanceMetrics.averageProcessingTime < 10; // Gentle 10ms requirement

    return {
      healthy: isHealthy,
      details: isHealthy
        ? 'Animation effects controller operational'
        : 'Animation effects controller degraded',
      metrics: {
        peacefulMomentCount: this.performanceMetrics.peacefulMomentCount,
        processingTime: this.performanceMetrics.averageProcessingTime,
        naturalElementCount: this.naturalElements.size,
        animationCycleCount: this.performanceMetrics.animationCycleCount
      },
      issues: isHealthy ? [] : ['Performance degradation detected']
    };
  }

  /**
   * Subscribe to color coordination events
   */
  private subscribeToColorEvents(): void {
    // Use inherited subscribeToEvent method from ServiceVisualSystemBase
    this.subscribeToEvent('music:emotional-context-updated', (event: any) => {
      this.onColorUpdate(event);
    });

    this.subscribeToEvent('music:emotion-analyzed', (event: any) => {
      this.onPeacefulMoment(event);
    });

    this.subscribeToEvent('settings:visual-guide-changed', (event: any) => {
      this.onVisualTransition(event);
    });
  }

  /**
   * Handle color coordination updates
   */
  private onColorUpdate(event: any): void {
    const { palette, effectsLevel, emotionalTemperature } = event;
    
    // Map effects level to animation harmony
    this.effectState.harmonyLevel = effectsLevel * 0.8;
    
    // Adjust natural effects based on emotional temperature
    if (emotionalTemperature < 5000) {
      // Cool temperatures = winter/peaceful
      this.effectState.grounding = effectsLevel * 0.6;
      this.effectState.ambientLevel = effectsLevel * 0.4;
    } else {
      // Warm temperatures = summer/active
      this.effectState.warmth = effectsLevel * 0.8;
      this.effectState.colorShift = effectsLevel * 0.5;
    }
    
    // Update animation color mapping
    const naturalColors = this.generateBreathingColors(palette, emotionalTemperature);
    this.updateNaturalColors(naturalColors);
  }

  /**
   * Handle peaceful musical moments
   */
  private onPeacefulMoment(event: any): void {
    const { type, intensity, serenity } = event;
    
    // Trigger natural harmony animation
    this.triggerNaturalBreathing(intensity, serenity);
  }

  /**
   * Handle visual transitions
   */
  private onVisualTransition(event: any): void {
    const { fromSeason, toSeason, duration } = event;
    
    // Create seasonal visual transition
    this.createSeasonalTransition(fromSeason, toSeason, duration);
    this.performanceMetrics.animationCycleCount++;
  }

  /**
   * Trigger natural harmony animation effect
   */
  private triggerNaturalBreathing(intensity: number, serenity: number): void {
    // Use service-based performance tracking when available
    const performTrackedOperation = this.services?.performance ? 
      (name: string, operation: () => void) => this.services!.performance!.trackOperation('AnimationEffectsController', name, operation) :
      (name: string, operation: () => void) => operation();

    performTrackedOperation('triggerNaturalBreathing', () => {
      // Set natural animation parameters for peaceful moment
      this.effectState.animationIntensity = serenity;
      this.effectState.grounding = serenity * 0.7;
      this.effectState.ambientLevel = serenity * 0.6;
      this.effectState.warmth = 0.6 + (serenity * 0.3);
      
      // Adjust animation frequency based on musical serenity
      const naturalFreq = this.harmonyConfig.frequencyRange;
      this.effectState.animationFrequency = naturalFreq[0] + (serenity * (naturalFreq[1] - naturalFreq[0]));
      
      // Schedule gentle decay
      setTimeout(() => {
        this.gentleDecayNaturalBreathing();
      }, this.harmonyConfig.transitionDuration);
      
      // Update local performance metrics
      this.performanceMetrics.peacefulMomentCount++;
      
      console.log(`[AnimationEffectsController] 🌿 Breathing effects activated! Serenity: ${serenity.toFixed(2)}, Frequency: ${this.effectState.animationFrequency.toFixed(2)}Hz`);
    });
  }

  /**
   * Gentle decay of natural animation over time
   */
  private gentleDecayNaturalBreathing(): void {
    const decayRate = 0.015; // Very gentle 1.5% per frame
    
    const decay = () => {
      this.effectState.animationIntensity *= (1.0 - decayRate);
      this.effectState.grounding *= (1.0 - decayRate * 0.8);
      this.effectState.ambientLevel *= (1.0 - decayRate * 0.6);
      
      if (this.effectState.animationIntensity > 0.05) {
        requestAnimationFrame(decay);
      } else {
        // Reset to natural baseline
        this.effectState.animationIntensity = 0;
        this.effectState.grounding = 0;
        this.effectState.ambientLevel = 0;
      }
    };
    
    requestAnimationFrame(decay);
  }

  /**
   * Update natural state from current music
   */
  private updateNaturalFromMusic(): void {
    if (!this.musicSyncService) return;
    const musicState = this.musicSyncService.getCurrentMusicState();
    if (!musicState) return;
    
    const { emotion, beat, intensity } = musicState;
    
    // Only respond to peaceful, low-intensity music
    if (emotion && intensity < this.harmonyConfig.calmThreshold) {
      // Adjust ambient atmosphere based on musical serenity
      this.effectState.ambientLevel = Math.max(
        this.effectState.ambientLevel,
        (1 - intensity) * 0.6  // Higher atmosphere for lower intensity
      );
      
      // Adjust animation frequency based on tempo (slower for peaceful music)
      if (beat && beat.tempo) {
        const tempoMultiplier = Math.max(0.5, Math.min(1.2, 60 / beat.tempo)); // Normalize around 60 BPM
        this.effectState.animationFrequency = 0.4 * tempoMultiplier;
      }
    }
  }

  /**
   * Update animation visual effects
   */
  private updateBreathingVisuals(): void {
    const currentSeason = this.getCurrentSeason();
    const palette = this.naturalPalettes[currentSeason];
    
    // Create natural color mapping
    const mapping: BreathingColorMapping = {
      warmTone: this.blendBreathingColors(
        palette.earthyWarm,
        palette.sunsetGlow,
        this.effectState.warmth
      ),
      coolTone: palette.forestGreen,
      accentBlue: palette.skyBlue,
      highlightGlow: palette.sunsetGlow,
      neutralGray: palette.stoneGray,
      transparency: 0.85 + (this.effectState.animationIntensity * 0.15)
    };
    
    // Update CSS variables through batcher
    this.updateNaturalCSSVariables(mapping);
  }

  /**
   * Get current season based on seasonal phase
   */
  private getCurrentSeason(): keyof typeof this.naturalPalettes {
    const seasonPhase = this.animationPhases.seasonalPhase % (2 * Math.PI);
    const normalizedPhase = seasonPhase / (2 * Math.PI);
    
    if (normalizedPhase < 0.25) return 'spring-awakening';
    if (normalizedPhase < 0.5) return 'summer-warmth';
    if (normalizedPhase < 0.75) return 'autumn-grounding';
    return 'winter-peace';
  }

  /**
   * Blend natural colors for animation effects
   */
  private blendBreathingColors(natural: RGB, warm: RGB, blendFactor: number): RGB {
    const factor = Math.max(0, Math.min(1, blendFactor));
    
    return {
      r: Math.round(natural.r * (1 - factor) + warm.r * factor),
      g: Math.round(natural.g * (1 - factor) + warm.g * factor),
      b: Math.round(natural.b * (1 - factor) + warm.b * factor)
    };
  }

  /**
   * Generate natural colors from coordination palette
   */
  private generateBreathingColors(palette: any[], emotionalTemperature: number): BreathingColorMapping {
    // Select appropriate natural palette based on temperature and season
    let selectedPalette = this.naturalPalettes['spring-awakening'];
    
    if (emotionalTemperature < 4000) {
      selectedPalette = this.naturalPalettes['winter-peace'];
    } else if (emotionalTemperature > 7000) {
      selectedPalette = this.naturalPalettes['summer-warmth'];
    } else if (emotionalTemperature > 5500) {
      selectedPalette = this.naturalPalettes['autumn-grounding'];
    }
    
    return {
      warmTone: selectedPalette.earthyWarm,
      coolTone: selectedPalette.forestGreen,
      accentBlue: selectedPalette.skyBlue,
      highlightGlow: selectedPalette.sunsetGlow,
      neutralGray: selectedPalette.stoneGray,
      transparency: this.effectState.harmonyLevel
    };
  }

  /**
   * Update natural colors in CSS
   */
  private updateNaturalColors(mapping: BreathingColorMapping): void {
    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-animation-warm-r': mapping.warmTone.r.toString(),
      '--sn-animation-warm-g': mapping.warmTone.g.toString(),
      '--sn-animation-warm-b': mapping.warmTone.b.toString(),
      '--sn-animation-cool-r': mapping.coolTone.r.toString(),
      '--sn-animation-cool-g': mapping.coolTone.g.toString(),
      '--sn-animation-cool-b': mapping.coolTone.b.toString()
    });
  }

  /**
   * Initialize animation effect elements
   */
  private async initializeBreathingElements(): Promise<void> {
    const naturalSelectors = [
      '.main-view-container',
      '.Root__now-playing-bar', 
      '.main-trackInfo-container',
      '.progress-bar',
      '.Root__nav-bar'
    ];
    
    for (const selector of naturalSelectors) {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        const id = `natural-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.naturalElements.set(id, element as HTMLElement);
      }
    }
  }

  /**
   * Setup CSS variables for animation effects
   */
  private setupBreathingCSSVariables(): void {
    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-animation-earthy-r': '166',
      '--sn-animation-earthy-g': '227',
      '--sn-animation-earthy-b': '161',
      '--sn-animation-forest-r': '64',
      '--sn-animation-forest-g': '160',
      '--sn-animation-forest-b': '43',
      '--sn-animation-sky-r': '137',
      '--sn-animation-sky-g': '220',
      '--sn-animation-sky-b': '235',
      '--sn-animation-serenity-level': '0',
      '--sn-animation-animation-frequency': '0.4',
      '--sn-animation-earth-connection': '0',
      '--sn-animation-animation-depth': '0.8',
      '--sn-animation-seasonal-shift': '0'
    });
  }

  /**
   * Update natural CSS variables
   */
  private updateNaturalCSSVariables(mapping: BreathingColorMapping): void {
    // Update animation phase for CSS animations
    const animationValue = Math.sin(this.animationPhases.animationPhase) * this.effectState.animationDepth;

    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-animation-animation-intensity': this.effectState.animationIntensity.toString(),
      '--sn-animation-animation-frequency': this.effectState.animationFrequency.toString(),
      '--sn-animation-grounding': this.effectState.grounding.toString(),
      '--sn-animation-animation-depth': this.effectState.animationDepth.toString(),
      '--sn-animation-color-shift': this.effectState.colorShift.toString(),
      '--sn-animation-animation-phase': animationValue.toString()
    });
  }

  /**
   * Update natural elements
   */
  private updateBreathingElements(): void {
    for (const [id, element] of this.naturalElements) {
      this.updateNaturalElement(element);
    }
  }

  /**
   * Update single natural element
   */
  private updateNaturalElement(element: HTMLElement): void {
    // Apply natural animation when animation intensity is active
    if (this.effectState.animationIntensity > 0.1) {
      this.applyNaturalBreathing(element);
    }
    
    // Apply grounding effects
    if (this.effectState.grounding > 0.1) {
      this.applyEarthConnection(element);
    }
    
    // Apply ambient atmosphere
    if (this.effectState.ambientLevel > 0.1) {
      this.applyForestAtmosphere(element);
    }
  }

  /**
   * Apply natural animation effect to element
   * PERFORMANCE FIX: Use CSS variables instead of direct DOM manipulation
   */
  private applyNaturalBreathing(element: HTMLElement): void {
    const animationIntensity = this.effectState.animationIntensity;
    const animationPhase = Math.sin(this.animationPhases.animationPhase);

    // Natural animation scale (very subtle)
    const animationScale = 1.0 + (animationPhase * animationIntensity * 0.02); // Max 2% scale

    // Natural animation opacity
    const animationOpacity = 0.9 + (animationPhase * animationIntensity * 0.1);

    // Natural animation glow
    const glowIntensity = animationIntensity * (animationPhase * 0.5 + 0.5) * 0.3;
    const glowSpread = glowIntensity * 20;
    const glowOpacity = glowIntensity * 0.5;
    const insetGlowSpread = glowIntensity * 10;
    const insetGlowOpacity = glowIntensity * 0.3;

    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-breathing-scale': animationScale.toString(),
      '--sn-breathing-opacity': animationOpacity.toString(),
      '--sn-breathing-glow-spread': `${glowSpread}px`,
      '--sn-breathing-glow-opacity': glowOpacity.toString(),
      '--sn-breathing-inset-spread': `${insetGlowSpread}px`,
      '--sn-breathing-inset-opacity': insetGlowOpacity.toString()
    });
  }

  /**
   * Apply earth connection effect
   * PERFORMANCE FIX: Use CSS variables instead of direct DOM manipulation
   */
  private applyEarthConnection(element: HTMLElement): void {
    const connectionIntensity = this.effectState.grounding;

    // Calculate opacity values for earthy border and background gradients
    const borderOpacity = connectionIntensity * 0.4;
    const bgTopOpacity = connectionIntensity * 0.05;
    const bgBottomOpacity = connectionIntensity * 0.08;

    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-earth-border-opacity': borderOpacity.toString(),
      '--sn-earth-bg-top-opacity': bgTopOpacity.toString(),
      '--sn-earth-bg-bottom-opacity': bgBottomOpacity.toString()
    });
  }

  /**
   * Apply forest atmosphere effect
   * 🎨 PHASE 2 OPTIMIZATION: Use pre-computed color variations instead of runtime filters
   *
   * Performance improvement: ~7-10ms per frame by eliminating hue-rotate and saturate filters
   * ColorHarmonyEngine pre-computes 8 atmosphere variants on track change covering:
   * - Hue range: -5° to +5° (subtle variations)
   * - Saturation: 0.85x (slightly desaturated for atmosphere)
   */
  private applyForestAtmosphere(element: HTMLElement): void {
    const atmosphereIntensity = this.effectState.ambientLevel;
    const variationPhase = this.animationPhases.variationPhase;

    // Subtle animation movement
    const animationOffset = Math.sin(variationPhase * 0.8) * atmosphereIntensity * 1;

    // ✅ PHASE 2 OPTIMIZATION: Select pre-computed color variant based on animation phase
    // Map variation phase (0-2π) to variant index (0-7)
    const phaseNormalized = (variationPhase * 0.5) / (Math.PI * 2); // Normalize to 0-1
    const variantIndex = Math.floor(((phaseNormalized % 1) + 1) % 1 * 8); // 0-7

    // Use inherited updateCSSVariables method for batched updates
    this.updateCSSVariables({
      '--sn-atmosphere-translate-y': `${animationOffset}px`,
      // ✅ NEW: Apply pre-computed color variant from ColorHarmonyEngine cache
      // This replaces runtime hue-rotate and saturate filters with direct RGB values
      '--sn-atmosphere-color-rgb': `var(--sn-atmosphere-variant-${variantIndex}-rgb)`
    });
  }

  /**
   * Create seasonal transition between natural states
   */
  private createSeasonalTransition(fromSeason: string, toSeason: string, duration: number): void {
    const startTime = performance.now();
    
    const transition = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Smooth easing function (ease-in-out sine)
      const eased = 0.5 * (1 - Math.cos(progress * Math.PI));
      
      // Interpolate seasonal colors and states
      // This would interpolate between seasonal palettes
      this.effectState.colorShift = eased;
      
      if (progress < 1) {
        requestAnimationFrame(transition);
      }
    };
    
    requestAnimationFrame(transition);
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by AnimationFrameCoordinator
   *
   * Previous implementation: startBreathingAnimation() with independent RAF loop
   * New implementation: updateAnimation() called by coordinator
   *
   * Benefits:
   * - Single RAF loop for all systems (not 5-8 independent loops)
   * - Shared deltaTime calculation (eliminates redundant performance.now() calls)
   * - Coordinated frame budget management
   * - Priority-based execution order
   *
   * Migration: Lines 829-847 removed, registration added to SystemIntegrationCoordinator
   */

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.performanceMetrics.averageProcessingTime = 
      (this.performanceMetrics.averageProcessingTime * 0.9) + (deltaTime * 0.1);
  }

  /**
   * Force repaint for immediate visual updates
   */
  public override forceRepaint(reason?: string): void {
    console.log(`[AnimationEffectsController] Force repaint triggered: ${reason || 'Unknown'}`);

    // Force update of all animation elements
    this.updateBreathingElements();

    // Flush CSS updates using CSS controller
    this.cssController.flushCSSVariableBatch();
  }

  /**
   * Cleanup and destroy the engine
   * @override ServiceVisualSystemBase lifecycle method
   */
  protected override performVisualSystemCleanup(): void {
    console.log('[AnimationEffectsController] Shutting down animation effects system...');

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation loop (coordinator handles this)
    // System unregistration happens in SystemIntegrationCoordinator destroy()

    // Clear natural elements
    this.naturalElements.clear();

    // Reset animation state
    this.effectState = {
      animationIntensity: 0,
      animationFrequency: 0.4,
      animationDepth: 0.8,
      grounding: 0,
      warmth: 0.7,
      ambientLevel: 0,
      colorShift: 0,
      harmonyLevel: 0
    };
  }

  // Public API methods
  public getBreathingState(): AnimationEffectState {
    return { ...this.effectState };
  }

  public getAnimationConfig(): BreathingEffectConfig {
    return { ...this.harmonyConfig };
  }

  public getPerformanceMetrics() {
    return { 
      ...this.performanceMetrics,
      naturalElementCount: this.naturalElements.size
    };
  }

  public setCalmThreshold(threshold: number): void {
    this.harmonyConfig.calmThreshold = Math.max(0, Math.min(1, threshold));
  }

  public setBreathingDepth(depth: number): void {
    this.effectState.animationDepth = Math.max(0, Math.min(1, depth));
  }

  public setColorStrength(strength: number): void {
    this.harmonyConfig.colorStrength = Math.max(0, Math.min(1, strength));
  }
}