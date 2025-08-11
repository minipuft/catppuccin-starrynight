/**
 * NaturalHarmonyEngine - Phase 2.4 Implementation
 * 
 * Gentle color breathing for peaceful content.
 * Creates organic, earth-connected breathing rhythms that sync with natural frequencies.
 * 
 * @architecture Year3000System - Natural Harmony Integration
 * @performance 60fps organic breathing with nature-inspired timing
 * @consciousness Natural rhythms that breathe with musical serenity
 */

import { HolographicUISystem } from "@/visual/music-sync/ui/HolographicUISystem";
import { colorConsciousnessManager } from "@/visual/effects/ColorAnimationState";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorStubs";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";

export interface NaturalBreathingState {
  serenityLevel: number;         // 0-1 current serenity intensity
  breathingFrequency: number;    // Hz - natural breathing frequency (0.2-0.8Hz)
  organicDepth: number;          // 0-1 breathing depth amplitude
  earthConnection: number;       // 0-1 earth-connected feeling
  naturalWarmth: number;         // 0-1 warm, grounded color intensity
  forestAtmosphere: number;      // 0-1 forest-like ambiance
  seasonalShift: number;         // 0-1 seasonal color transitions
  harmonyResonance: number;      // 0-1 overall natural harmony
}

export interface NaturalHarmonyConfig {
  peacefulThreshold: number;        // Musical intensity threshold for natural activation
  maxBreathingDepth: number;        // Maximum breathing amplitude
  naturalFrequencyRange: [number, number]; // [min, max] breathing frequency in Hz
  earthyColorStrength: number;      // Strength of earthy color tints
  naturalTransitionDuration: number; // Duration of natural transitions in ms
  seasonalCycleSpeed: number;       // Speed of seasonal color cycles
}

export interface NaturalColorMapping {
  earthyWarm: RGB;                  // Warm earth tones (browns, ambers)
  forestGreen: RGB;                 // Forest green colors
  skyBlue: RGB;                     // Natural sky blue
  sunsetGlow: RGB;                  // Warm sunset colors
  stoneGray: RGB;                   // Natural stone gray
  organicTransparency: number;      // Overall natural transparency
}

/**
 * NaturalHarmonyEngine - Organic breathing rhythms for peaceful consciousness
 */
export class NaturalHarmonyEngine implements IManagedSystem {
  public initialized = false;
  
  private holographicSystem: HolographicUISystem;
  // Using shared colorConsciousnessManager instead of injected orchestrator
  private cssConsciousnessController: UnifiedCSSVariableManager;
  private musicSyncService: MusicSyncService;
  
  private breathingState: NaturalBreathingState;
  private harmonyConfig: NaturalHarmonyConfig;
  private naturalElements: Map<string, HTMLElement> = new Map();
  
  // Performance tracking
  private performanceMetrics = {
    peacefulMomentCount: 0,
    averageProcessingTime: 0,
    lastUpdateTime: 0,
    breathingCycleCount: 0
  };
  
  // Animation state
  private animationState = {
    breathingPhase: 0,           // Main breathing cycle phase
    seasonalPhase: 0,            // Seasonal transition phase
    organicPhase: 0,             // Organic variation phase
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
    cssConsciousnessController: UnifiedCSSVariableManager,
    musicSyncService: MusicSyncService
  ) {
    this.holographicSystem = holographicSystem;
    this.cssConsciousnessController = cssConsciousnessController;
    this.musicSyncService = musicSyncService;
    
    // Initialize natural breathing state
    this.breathingState = {
      serenityLevel: 0,
      breathingFrequency: 0.4,      // Natural resting frequency (0.4Hz = 24 breaths/min)
      organicDepth: 0.8,            // Deep, natural breathing
      earthConnection: 0,
      naturalWarmth: 0.7,           // Warm, grounded feeling
      forestAtmosphere: 0,
      seasonalShift: 0,
      harmonyResonance: 0
    };
    
    // Initialize natural harmony configuration
    this.harmonyConfig = {
      peacefulThreshold: 0.3,        // Activate on low intensity (peaceful music)
      maxBreathingDepth: 0.9,        // Deep natural breathing
      naturalFrequencyRange: [0.2, 0.8], // 0.2Hz (12 bpm) to 0.8Hz (48 bpm)
      earthyColorStrength: 0.6,      // Moderate earthy color influence
      naturalTransitionDuration: 3000, // 3-second natural transitions
      seasonalCycleSpeed: 0.1        // Very slow seasonal cycles
    };
  }

  /**
   * Initialize the Natural Harmony Engine
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('[NaturalHarmonyEngine] Awakening natural harmony consciousness...');
      
      // Register for ColorConsciousnessOrchestrator events
      this.subscribeToNaturalConsciousness();
      
      // Initialize natural UI elements
      await this.initializeNaturalElements();
      
      // Setup CSS variables for natural effects
      this.setupNaturalCSSVariables();
      
      // Start organic breathing animation
      this.startNaturalBreathing();
      
      this.initialized = true;
      
      console.log('[NaturalHarmonyEngine] 🌿 Ready for natural harmony breathing');
      
    } catch (error) {
      console.error('[NaturalHarmonyEngine] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Update animation frame for natural harmony effects
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;
    
    const deltaSeconds = deltaTime / 1000;
    
    // Update animation phases (natural, organic timing)
    this.animationState.breathingPhase += deltaSeconds * this.breathingState.breathingFrequency * 2 * Math.PI;
    this.animationState.seasonalPhase += deltaSeconds * this.harmonyConfig.seasonalCycleSpeed;
    this.animationState.organicPhase += deltaSeconds * 0.4; // Slow organic variation
    this.animationState.harmonyPhase += deltaSeconds * 0.6; // Natural harmony phase
    
    // Update natural state from music
    this.updateNaturalFromMusic();
    
    // Update organic breathing effects
    this.updateOrganicBreathing();
    
    // Update natural elements
    this.updateNaturalElements();
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }

  /**
   * Health check for natural harmony system
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && 
                     this.breathingState.serenityLevel >= 0 &&
                     this.performanceMetrics.averageProcessingTime < 10; // Gentle 10ms requirement
    
    return {
      system: 'NaturalHarmonyEngine',
      healthy: isHealthy,
      metrics: {
        peacefulMomentCount: this.performanceMetrics.peacefulMomentCount,
        processingTime: this.performanceMetrics.averageProcessingTime,
        naturalElementCount: this.naturalElements.size,
        breathingCycleCount: this.performanceMetrics.breathingCycleCount
      },
      issues: isHealthy ? [] : ['Performance degradation detected']
    };
  }

  /**
   * Subscribe to natural consciousness events
   */
  private subscribeToNaturalConsciousness(): void {
    unifiedEventBus.subscribe('emotionalColorContext:updated', (event) => {
      this.onColorConsciousnessUpdate(event);
    });
    
    unifiedEventBus.subscribe('emotion:analyzed', (event) => {
      this.onPeacefulMoment(event);
    });
    
    unifiedEventBus.subscribe('settings:visual-guide-changed', (event) => {
      this.onOrganicTransition(event);
    });
  }

  /**
   * Handle color consciousness updates
   */
  private onColorConsciousnessUpdate(event: any): void {
    const { palette, consciousnessLevel, emotionalTemperature } = event;
    
    // Map consciousness to natural harmony
    this.breathingState.harmonyResonance = consciousnessLevel * 0.8;
    
    // Adjust natural effects based on emotional temperature
    if (emotionalTemperature < 5000) {
      // Cool temperatures = winter/peaceful
      this.breathingState.earthConnection = consciousnessLevel * 0.6;
      this.breathingState.forestAtmosphere = consciousnessLevel * 0.4;
    } else {
      // Warm temperatures = summer/active
      this.breathingState.naturalWarmth = consciousnessLevel * 0.8;
      this.breathingState.seasonalShift = consciousnessLevel * 0.5;
    }
    
    // Update natural color mapping
    const naturalColors = this.generateNaturalColors(palette, emotionalTemperature);
    this.updateNaturalColors(naturalColors);
  }

  /**
   * Handle peaceful musical moments
   */
  private onPeacefulMoment(event: any): void {
    const { type, intensity, serenity } = event;
    
    // Trigger natural harmony breathing
    this.triggerNaturalBreathing(intensity, serenity);
  }

  /**
   * Handle organic transitions
   */
  private onOrganicTransition(event: any): void {
    const { fromSeason, toSeason, duration } = event;
    
    // Create organic seasonal transition
    this.createSeasonalTransition(fromSeason, toSeason, duration);
    this.performanceMetrics.breathingCycleCount++;
  }

  /**
   * Trigger natural harmony breathing effect
   */
  private triggerNaturalBreathing(intensity: number, serenity: number): void {
    const startTime = performance.now();
    
    // Set natural breathing parameters for peaceful moment
    this.breathingState.serenityLevel = serenity;
    this.breathingState.earthConnection = serenity * 0.7;
    this.breathingState.forestAtmosphere = serenity * 0.6;
    this.breathingState.naturalWarmth = 0.6 + (serenity * 0.3);
    
    // Adjust breathing frequency based on musical serenity
    const naturalFreq = this.harmonyConfig.naturalFrequencyRange;
    this.breathingState.breathingFrequency = naturalFreq[0] + (serenity * (naturalFreq[1] - naturalFreq[0]));
    
    // Schedule gentle decay
    setTimeout(() => {
      this.gentleDecayNaturalBreathing();
    }, this.harmonyConfig.naturalTransitionDuration);
    
    // Update performance metrics
    this.performanceMetrics.peacefulMomentCount++;
    this.performanceMetrics.lastUpdateTime = performance.now() - startTime;
    
    console.log(`[NaturalHarmonyEngine] 🌿 Natural breathing awakened! Serenity: ${serenity.toFixed(2)}, Frequency: ${this.breathingState.breathingFrequency.toFixed(2)}Hz`);
  }

  /**
   * Gentle decay of natural breathing over time
   */
  private gentleDecayNaturalBreathing(): void {
    const decayRate = 0.015; // Very gentle 1.5% per frame
    
    const decay = () => {
      this.breathingState.serenityLevel *= (1.0 - decayRate);
      this.breathingState.earthConnection *= (1.0 - decayRate * 0.8);
      this.breathingState.forestAtmosphere *= (1.0 - decayRate * 0.6);
      
      if (this.breathingState.serenityLevel > 0.05) {
        requestAnimationFrame(decay);
      } else {
        // Reset to natural baseline
        this.breathingState.serenityLevel = 0;
        this.breathingState.earthConnection = 0;
        this.breathingState.forestAtmosphere = 0;
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
    if (emotion && intensity < this.harmonyConfig.peacefulThreshold) {
      // Adjust forest atmosphere based on musical serenity
      this.breathingState.forestAtmosphere = Math.max(
        this.breathingState.forestAtmosphere,
        (1 - intensity) * 0.6  // Higher atmosphere for lower intensity
      );
      
      // Adjust breathing frequency based on tempo (slower for peaceful music)
      if (beat && beat.tempo) {
        const tempoMultiplier = Math.max(0.5, Math.min(1.2, 60 / beat.tempo)); // Normalize around 60 BPM
        this.breathingState.breathingFrequency = 0.4 * tempoMultiplier;
      }
    }
  }

  /**
   * Update organic breathing effects
   */
  private updateOrganicBreathing(): void {
    const currentSeason = this.getCurrentSeason();
    const palette = this.naturalPalettes[currentSeason];
    
    // Create natural color mapping
    const mapping: NaturalColorMapping = {
      earthyWarm: this.blendNaturalColors(
        palette.earthyWarm,
        palette.sunsetGlow,
        this.breathingState.naturalWarmth
      ),
      forestGreen: palette.forestGreen,
      skyBlue: palette.skyBlue,
      sunsetGlow: palette.sunsetGlow,
      stoneGray: palette.stoneGray,
      organicTransparency: 0.85 + (this.breathingState.serenityLevel * 0.15)
    };
    
    // Update CSS variables through batcher
    this.updateNaturalCSSVariables(mapping);
  }

  /**
   * Get current season based on seasonal phase
   */
  private getCurrentSeason(): keyof typeof this.naturalPalettes {
    const seasonPhase = this.animationState.seasonalPhase % (2 * Math.PI);
    const normalizedPhase = seasonPhase / (2 * Math.PI);
    
    if (normalizedPhase < 0.25) return 'spring-awakening';
    if (normalizedPhase < 0.5) return 'summer-warmth';
    if (normalizedPhase < 0.75) return 'autumn-grounding';
    return 'winter-peace';
  }

  /**
   * Blend natural colors for organic effects
   */
  private blendNaturalColors(natural: RGB, warm: RGB, blendFactor: number): RGB {
    const factor = Math.max(0, Math.min(1, blendFactor));
    
    return {
      r: Math.round(natural.r * (1 - factor) + warm.r * factor),
      g: Math.round(natural.g * (1 - factor) + warm.g * factor),
      b: Math.round(natural.b * (1 - factor) + warm.b * factor)
    };
  }

  /**
   * Generate natural colors from consciousness palette
   */
  private generateNaturalColors(palette: any[], emotionalTemperature: number): NaturalColorMapping {
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
      earthyWarm: selectedPalette.earthyWarm,
      forestGreen: selectedPalette.forestGreen,
      skyBlue: selectedPalette.skyBlue,
      sunsetGlow: selectedPalette.sunsetGlow,
      stoneGray: selectedPalette.stoneGray,
      organicTransparency: this.breathingState.harmonyResonance
    };
  }

  /**
   * Update natural colors in CSS
   */
  private updateNaturalColors(mapping: NaturalColorMapping): void {
    // Update natural color CSS variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-earthy-r',
      mapping.earthyWarm.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-earthy-g',
      mapping.earthyWarm.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-earthy-b',
      mapping.earthyWarm.b.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-forest-r',
      mapping.forestGreen.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-forest-g',
      mapping.forestGreen.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-forest-b',
      mapping.forestGreen.b.toString()
    );
  }

  /**
   * Initialize natural UI elements
   */
  private async initializeNaturalElements(): Promise<void> {
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
   * Setup CSS variables for natural effects
   */
  private setupNaturalCSSVariables(): void {
    const baseVariables = {
      '--natural-earthy-r': '166',
      '--natural-earthy-g': '227',
      '--natural-earthy-b': '161',
      '--natural-forest-r': '64',
      '--natural-forest-g': '160',
      '--natural-forest-b': '43',
      '--natural-sky-r': '137',
      '--natural-sky-g': '220',
      '--natural-sky-b': '235',
      '--natural-serenity-level': '0',
      '--natural-breathing-frequency': '0.4',
      '--natural-earth-connection': '0',
      '--natural-breathing-depth': '0.8',
      '--natural-seasonal-shift': '0'
    };
    
    for (const [variable, value] of Object.entries(baseVariables)) {
      this.cssConsciousnessController.queueCSSVariableUpdate(variable, value);
    }
  }

  /**
   * Update natural CSS variables
   */
  private updateNaturalCSSVariables(mapping: NaturalColorMapping): void {
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-serenity-level',
      this.breathingState.serenityLevel.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-breathing-frequency',
      this.breathingState.breathingFrequency.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-earth-connection',
      this.breathingState.earthConnection.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-breathing-depth',
      this.breathingState.organicDepth.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-seasonal-shift',
      this.breathingState.seasonalShift.toString()
    );
    
    // Update breathing phase for CSS animations
    const breathingValue = Math.sin(this.animationState.breathingPhase) * this.breathingState.organicDepth;
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--natural-breathing-phase',
      breathingValue.toString()
    );
  }

  /**
   * Update natural elements
   */
  private updateNaturalElements(): void {
    for (const [id, element] of this.naturalElements) {
      this.updateNaturalElement(element);
    }
  }

  /**
   * Update single natural element
   */
  private updateNaturalElement(element: HTMLElement): void {
    // Apply natural breathing when serenity is active
    if (this.breathingState.serenityLevel > 0.1) {
      this.applyNaturalBreathing(element);
    }
    
    // Apply earth connection effects
    if (this.breathingState.earthConnection > 0.1) {
      this.applyEarthConnection(element);
    }
    
    // Apply forest atmosphere
    if (this.breathingState.forestAtmosphere > 0.1) {
      this.applyForestAtmosphere(element);
    }
  }

  /**
   * Apply natural breathing effect to element
   */
  private applyNaturalBreathing(element: HTMLElement): void {
    const breathingIntensity = this.breathingState.serenityLevel;
    const breathingPhase = Math.sin(this.animationState.breathingPhase);
    
    // Natural breathing scale (very subtle)
    const breathingScale = 1.0 + (breathingPhase * breathingIntensity * 0.02); // Max 2% scale
    
    // Natural breathing opacity
    const breathingOpacity = 0.9 + (breathingPhase * breathingIntensity * 0.1);
    
    element.style.transform = `scale(${breathingScale})`;
    element.style.opacity = breathingOpacity.toString();
    
    // Natural breathing glow
    const glowIntensity = breathingIntensity * (breathingPhase * 0.5 + 0.5) * 0.3;
    element.style.boxShadow = `
      0 0 ${glowIntensity * 20}px rgba(var(--natural-earthy-r), var(--natural-earthy-g), var(--natural-earthy-b), ${glowIntensity * 0.5}),
      inset 0 0 ${glowIntensity * 10}px rgba(var(--natural-forest-r), var(--natural-forest-g), var(--natural-forest-b), ${glowIntensity * 0.3})
    `;
  }

  /**
   * Apply earth connection effect
   */
  private applyEarthConnection(element: HTMLElement): void {
    const connectionIntensity = this.breathingState.earthConnection;
    
    // Earthy border
    element.style.border = `1px solid rgba(var(--natural-earthy-r), var(--natural-earthy-g), var(--natural-earthy-b), ${connectionIntensity * 0.4})`;
    
    // Earth-grounded background
    element.style.background = `
      ${element.style.background || ''},
      linear-gradient(180deg,
        rgba(var(--natural-earthy-r), var(--natural-earthy-g), var(--natural-earthy-b), ${connectionIntensity * 0.05}) 0%,
        rgba(var(--natural-forest-r), var(--natural-forest-g), var(--natural-forest-b), ${connectionIntensity * 0.08}) 100%
      )
    `;
  }

  /**
   * Apply forest atmosphere effect
   */
  private applyForestAtmosphere(element: HTMLElement): void {
    const atmosphereIntensity = this.breathingState.forestAtmosphere;
    const organicPhase = this.animationState.organicPhase;
    
    // Forest-like subtle movement
    const organicOffset = Math.sin(organicPhase * 0.8) * atmosphereIntensity * 1;
    element.style.transform += ` translateY(${organicOffset}px)`;
    
    // Forest color tint
    const forestHue = Math.sin(organicPhase * 0.5) * atmosphereIntensity * 5;
    element.style.filter = `hue-rotate(${forestHue}deg) saturate(${1 + atmosphereIntensity * 0.2})`;
  }

  /**
   * Create seasonal transition between natural states
   */
  private createSeasonalTransition(fromSeason: string, toSeason: string, duration: number): void {
    const startTime = performance.now();
    
    const transition = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Organic easing function (ease-in-out sine)
      const eased = 0.5 * (1 - Math.cos(progress * Math.PI));
      
      // Interpolate seasonal colors and states
      // This would interpolate between seasonal palettes
      this.breathingState.seasonalShift = eased;
      
      if (progress < 1) {
        requestAnimationFrame(transition);
      }
    };
    
    requestAnimationFrame(transition);
  }

  /**
   * Start natural breathing animation loop
   */
  private startNaturalBreathing(): void {
    this.animationState.isAnimating = true;
    this.animationState.lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!this.animationState.isAnimating) return;
      
      const deltaTime = currentTime - this.animationState.lastFrameTime;
      this.animationState.lastFrameTime = currentTime;
      
      // Update natural breathing animation
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
    console.log(`[NaturalHarmonyEngine] Force repaint triggered: ${reason || 'Unknown'}`);
    
    // Force update of all natural elements
    this.updateNaturalElements();
    
    // Trigger CSS variable batch flush
    this.cssConsciousnessController.flushCSSVariableBatch();
  }

  /**
   * Cleanup and destroy the engine
   */
  public destroy(): void {
    console.log('[NaturalHarmonyEngine] Returning to natural silence...');
    
    // Stop animation
    this.animationState.isAnimating = false;
    
    // Clear natural elements
    this.naturalElements.clear();
    
    // Reset breathing state
    this.breathingState = {
      serenityLevel: 0,
      breathingFrequency: 0.4,
      organicDepth: 0.8,
      earthConnection: 0,
      naturalWarmth: 0.7,
      forestAtmosphere: 0,
      seasonalShift: 0,
      harmonyResonance: 0
    };
    
    this.initialized = false;
  }

  // Public API methods
  public getBreathingState(): NaturalBreathingState {
    return { ...this.breathingState };
  }

  public getNaturalConfig(): NaturalHarmonyConfig {
    return { ...this.harmonyConfig };
  }

  public getPerformanceMetrics() {
    return { 
      ...this.performanceMetrics,
      naturalElementCount: this.naturalElements.size
    };
  }

  public setPeacefulThreshold(threshold: number): void {
    this.harmonyConfig.peacefulThreshold = Math.max(0, Math.min(1, threshold));
  }

  public setBreathingDepth(depth: number): void {
    this.breathingState.organicDepth = Math.max(0, Math.min(1, depth));
  }

  public setEarthyColorStrength(strength: number): void {
    this.harmonyConfig.earthyColorStrength = Math.max(0, Math.min(1, strength));
  }
}