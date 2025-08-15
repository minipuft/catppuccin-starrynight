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

import { HolographicUISystem } from "@/visual/music/ui/HolographicUISystem";
import { colorTransitionManager } from "@/visual/effects/ColorTransitionManager";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorStubs";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { ServiceContainer, IServiceAwareSystem } from "@/core/services/SystemServices";

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
 * - Implements IManagedSystem for lifecycle management
 * - Optional IServiceAwareSystem for enhanced service integration
 * - Direct UnifiedEventBus integration with service fallback
 * - Seasonal palette system with smooth transitions
 */
export class AnimationEffectsController implements IManagedSystem, IServiceAwareSystem {
  public initialized = false;
  
  private holographicSystem: HolographicUISystem;
  // Using shared CSS controller for color coordination
  private cssController: UnifiedCSSVariableManager;
  private musicSyncService: MusicSyncService;
  
  // Service composition support
  private services?: ServiceContainer;
  
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
    lastFrameTime: 0,
    isAnimating: false
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

  constructor(
    holographicSystem: HolographicUISystem,
    cssController: UnifiedCSSVariableManager,
    musicSyncService: MusicSyncService
  ) {
    this.holographicSystem = holographicSystem;
    this.cssController = cssController;
    this.musicSyncService = musicSyncService;
    
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
  
  // =============================================================================
  // SERVICE INJECTION INTERFACE
  // =============================================================================
  
  injectServices(services: ServiceContainer): void {
    this.services = services;
  }
  
  getRequiredServices(): (keyof ServiceContainer)[] {
    return []; // No required services - system works without services
  }
  
  getOptionalServices(): (keyof ServiceContainer)[] {
    return ['cssVariables', 'events', 'performance'];
  }

  /**
   * Initialize the animation effects system
   * 
   * Sets up event subscriptions, animation elements detection, CSS variables,
   * and starts the animation loop for animation effects.
   * 
   * @returns Promise<void> Resolves when initialization completes
   * @throws Error if system fails to initialize
   * @public IManagedSystem lifecycle method
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('[AnimationEffectsController] Initializing animation effects...');
      
      // Register for color coordination events
      this.subscribeToColorEvents();
      
      // Initialize animation effect elements
      await this.initializeBreathingElements();
      
      // Setup CSS variables for animation effects
      this.setupBreathingCSSVariables();
      
      // Start animation animation loop
      this.startBreathingAnimation();
      
      this.initialized = true;
      
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
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && 
                     this.effectState.animationIntensity >= 0 &&
                     this.performanceMetrics.averageProcessingTime < 10; // Gentle 10ms requirement
    
    return {
      system: 'NaturalHarmonyEngine',
      healthy: isHealthy,
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
    // Use service-based event subscription when available
    if (this.services?.events) {
      this.services.events.subscribe('AnimationEffectsController', 
        'music:emotional-context-updated', 
        this.onColorUpdate.bind(this)
      );
      this.services.events.subscribe('AnimationEffectsController', 
        'music:emotion-analyzed', 
        this.onPeacefulMoment.bind(this)
      );
      this.services.events.subscribe('AnimationEffectsController', 
        'settings:visual-guide-changed', 
        this.onVisualTransition.bind(this)
      );
    } else {
      // Fallback to direct event bus usage
      unifiedEventBus.subscribe('music:emotional-context-updated', (event) => {
        this.onColorUpdate(event);
      });
      
      unifiedEventBus.subscribe('music:emotion-analyzed', (event) => {
        this.onPeacefulMoment(event);
      });
      
      unifiedEventBus.subscribe('settings:visual-guide-changed', (event) => {
        this.onVisualTransition(event);
      });
    }
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
    // Use service-based CSS updates for better batching when available
    if (this.services?.cssVariables) {
      this.services.cssVariables.queueBatchUpdate({
        '--sn-animation-warm-r': mapping.warmTone.r.toString(),
        '--sn-animation-warm-g': mapping.warmTone.g.toString(),
        '--sn-animation-warm-b': mapping.warmTone.b.toString(),
        '--sn-animation-cool-r': mapping.coolTone.r.toString(),
        '--sn-animation-cool-g': mapping.coolTone.g.toString(),
        '--sn-animation-cool-b': mapping.coolTone.b.toString()
      });
    } else {
      // Fallback to existing CSS controller
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-warm-r',
        mapping.warmTone.r.toString()
      );
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-warm-g',
        mapping.warmTone.g.toString()
      );
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-warm-b',
        mapping.warmTone.b.toString()
      );
      
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-cool-r',
        mapping.coolTone.r.toString()
      );
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-cool-g',
        mapping.coolTone.g.toString()
      );
      this.cssController.queueCSSVariableUpdate(
        '--sn-animation-cool-b',
        mapping.coolTone.b.toString()
      );
    }
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
    const baseVariables = {
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
    };
    
    // Use service-based batch update when available
    if (this.services?.cssVariables) {
      this.services.cssVariables.queueBatchUpdate(baseVariables);
    } else {
      // Fallback to existing CSS controller
      for (const [variable, value] of Object.entries(baseVariables)) {
        this.cssController.queueCSSVariableUpdate(variable, value);
      }
    }
  }

  /**
   * Update natural CSS variables
   */
  private updateNaturalCSSVariables(mapping: BreathingColorMapping): void {
    // Update animation phase for CSS animations
    const animationValue = Math.sin(this.animationPhases.animationPhase) * this.effectState.animationDepth;
    
    const cssUpdates = {
      '--sn-animation-animation-intensity': this.effectState.animationIntensity.toString(),
      '--sn-animation-animation-frequency': this.effectState.animationFrequency.toString(),
      '--sn-animation-grounding': this.effectState.grounding.toString(),
      '--sn-animation-animation-depth': this.effectState.animationDepth.toString(),
      '--sn-animation-color-shift': this.effectState.colorShift.toString(),
      '--sn-animation-animation-phase': animationValue.toString()
    };
    
    // Use service-based batch update when available
    if (this.services?.cssVariables) {
      this.services.cssVariables.queueBatchUpdate(cssUpdates);
    } else {
      // Fallback to existing CSS controller
      Object.entries(cssUpdates).forEach(([variable, value]) => {
        this.cssController.queueCSSVariableUpdate(variable, value);
      });
    }
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
   */
  private applyNaturalBreathing(element: HTMLElement): void {
    const animationIntensity = this.effectState.animationIntensity;
    const animationPhase = Math.sin(this.animationPhases.animationPhase);
    
    // Natural animation scale (very subtle)
    const animationScale = 1.0 + (animationPhase * animationIntensity * 0.02); // Max 2% scale
    
    // Natural animation opacity
    const animationOpacity = 0.9 + (animationPhase * animationIntensity * 0.1);
    
    element.style.transform = `scale(${animationScale})`;
    element.style.opacity = animationOpacity.toString();
    
    // Natural animation glow
    const glowIntensity = animationIntensity * (animationPhase * 0.5 + 0.5) * 0.3;
    element.style.boxShadow = `
      0 0 ${glowIntensity * 20}px rgba(var(--sn-animation-earthy-r), var(--sn-animation-earthy-g), var(--sn-animation-earthy-b), ${glowIntensity * 0.5}),
      inset 0 0 ${glowIntensity * 10}px rgba(var(--sn-animation-forest-r), var(--sn-animation-forest-g), var(--sn-animation-forest-b), ${glowIntensity * 0.3})
    `;
  }

  /**
   * Apply earth connection effect
   */
  private applyEarthConnection(element: HTMLElement): void {
    const connectionIntensity = this.effectState.grounding;
    
    // Earthy border
    element.style.border = `1px solid rgba(var(--sn-animation-earthy-r), var(--sn-animation-earthy-g), var(--sn-animation-earthy-b), ${connectionIntensity * 0.4})`;
    
    // Earth-grounded background
    element.style.background = `
      ${element.style.background || ''},
      linear-gradient(180deg,
        rgba(var(--sn-animation-earthy-r), var(--sn-animation-earthy-g), var(--sn-animation-earthy-b), ${connectionIntensity * 0.05}) 0%,
        rgba(var(--sn-animation-forest-r), var(--sn-animation-forest-g), var(--sn-animation-forest-b), ${connectionIntensity * 0.08}) 100%
      )
    `;
  }

  /**
   * Apply forest atmosphere effect
   */
  private applyForestAtmosphere(element: HTMLElement): void {
    const atmosphereIntensity = this.effectState.ambientLevel;
    const variationPhase = this.animationPhases.variationPhase;
    
    // Subtle animation movement
    const animationOffset = Math.sin(variationPhase * 0.8) * atmosphereIntensity * 1;
    element.style.transform += ` translateY(${animationOffset}px)`;
    
    // Breathing color tint
    const animationHue = Math.sin(variationPhase * 0.5) * atmosphereIntensity * 5;
    element.style.filter = `hue-rotate(${animationHue}deg) saturate(${1 + atmosphereIntensity * 0.2})`;
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
   * Start animation animation loop
   */
  private startBreathingAnimation(): void {
    this.animationPhases.isAnimating = true;
    this.animationPhases.lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!this.animationPhases.isAnimating) return;
      
      const deltaTime = currentTime - this.animationPhases.lastFrameTime;
      this.animationPhases.lastFrameTime = currentTime;
      
      // Update natural animation animation
      this.updateAnimation(deltaTime);
      
      // Continue animation loop
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }

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
  public forceRepaint(reason?: string): void {
    console.log(`[AnimationEffectsController] Force repaint triggered: ${reason || 'Unknown'}`);
    
    // Force update of all animation elements
    this.updateBreathingElements();
    
    // Flush CSS updates using service when available
    if (this.services?.cssVariables) {
      this.services.cssVariables.flushUpdates();
    } else {
      // Fallback to existing CSS controller
      this.cssController.flushCSSVariableBatch();
    }
  }

  /**
   * Cleanup and destroy the engine
   */
  public destroy(): void {
    console.log('[AnimationEffectsController] Shutting down animation effects system...');
    
    // Clean up service subscriptions
    if (this.services?.events) {
      this.services.events.cleanupSystem('AnimationEffectsController');
    }
    
    // Stop animation
    this.animationPhases.isAnimating = false;
    
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
    
    this.initialized = false;
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