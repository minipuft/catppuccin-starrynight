/**
 * SoftGlowEffectsManager - Phase 2.3 Implementation
 * 
 * Soft glows and flowing gradients for emotional musical moments.
 * Creates mystical, dreamy effects that expand during emotional peaks.
 * 
 * @architecture Year3000System - Ethereal Beauty Integration
 * @performance 60fps flowing animations with CSS-first approach
 * @consciousness Gentle beauty that breathes with musical soul
 */

import { HolographicUISystem } from "@/visual/music-sync/ui/HolographicUISystem";
import { colorConsciousnessManager } from "@/visual/effects/ColorAnimationState";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorStubs";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

export interface EtherealState {
  emotionalIntensity: number;    // 0-1 current emotional intensity
  beautyLevel: number;           // 0-1 ethereal beauty strength
  gentleness: number;            // 0-1 soft effect intensity
  mysticalShimmer: number;       // 0-1 mystical particle flow
  dreamyTranslucency: number;    // 0-1 dreamy transparency level
  flowingGradientPhase: number;  // 0-2π flowing gradient animation phase
  emotionalResonance: number;    // 0-1 emotional connection strength
  softnessFactor: number;        // 0-1 overall softness multiplier
  
  // Target values for LERP smoothing
  targetEmotionalIntensity: number;
  targetBeautyLevel: number;
  targetMysticalShimmer: number;
}

export interface EtherealEffectConfig {
  emotionalThreshold: number;        // Musical valence threshold for ethereal activation
  maxBeautyIntensity: number;        // Maximum ethereal effect intensity
  gentleTransitionDuration: number;  // Duration of gentle transitions in ms
  mysticalParticleCount: number;     // Number of mystical particles
  dreamyBlurRadius: number;          // Maximum blur radius for dreamy effects
  flowingGradientSpeed: number;      // Speed of flowing gradient animations
}

export interface EtherealColorMapping {
  primarySoft: RGB;               // Primary soft color (pastels)
  mysticalGlow: RGB;              // Mystical shimmer color
  dreamyMist: RGB;                // Dreamy mist background
  emotionalHeart: RGB;            // Emotional core color
  etherealHighlight: RGB;         // Ethereal accent color
  gentleTransparency: number;     // Overall transparency level
}

/**
 * SoftGlowEffectsManager - Soft mystical effects for emotional consciousness
 */
export class SoftGlowEffectsManager implements IManagedSystem {
  public initialized = false;
  
  private holographicSystem: HolographicUISystem;
  // Using shared colorConsciousnessManager instead of injected orchestrator
  private cssConsciousnessController: UnifiedCSSVariableManager;
  private musicSyncService: MusicSyncService;
  
  private etherealState: EtherealState;
  private etherealConfig: EtherealEffectConfig;
  private etherealElements: Map<string, HTMLElement> = new Map();
  
  // Performance tracking
  private performanceMetrics = {
    emotionalMomentCount: 0,
    averageProcessingTime: 0,
    lastUpdateTime: 0,
    gentleTransitionCount: 0
  };
  
  // Animation state
  private animationState = {
    mysticalPhase: 0,
    dreamyPhase: 0,
    flowingPhase: 0,
    emotionalPulsePhase: 0,
    lastFrameTime: 0,
    isAnimating: false
  };
  
  // LERP smoothing half-life values (in seconds) for framerate-independent decay
  private lerpHalfLifeValues = {
    emotionalIntensity: 0.25,    // Fast emotional response
    beautyLevel: 0.35,           // Moderate beauty transitions
    mysticalShimmer: 0.20        // Quick shimmer response
  };
  
  // Ethereal color palettes
  private etherealPalettes = {
    'dreamy-pastels': {
      primarySoft: { r: 203, g: 166, b: 247 },      // Catppuccin mauve (soft)
      mysticalGlow: { r: 148, g: 226, b: 213 },     // Catppuccin teal (mystical)
      dreamyMist: { r: 245, g: 224, b: 220 },       // Catppuccin rosewater
      emotionalHeart: { r: 249, g: 226, b: 175 },   // Catppuccin yellow (warm)
      etherealHighlight: { r: 180, g: 190, b: 254 } // Catppuccin lavender
    },
    'mystical-moonlight': {
      primarySoft: { r: 137, g: 180, b: 250 },      // Catppuccin blue (soft)
      mysticalGlow: { r: 166, g: 227, b: 161 },     // Catppuccin green (mystical)
      dreamyMist: { r: 205, g: 214, b: 244 },       // Catppuccin text (muted)
      emotionalHeart: { r: 243, g: 139, b: 168 },   // Catppuccin pink (warm)
      etherealHighlight: { r: 137, g: 220, b: 235 } // Catppuccin sky
    },
    'gentle-aurora': {
      primarySoft: { r: 166, g: 227, b: 161 },      // Catppuccin green (soft)
      mysticalGlow: { r: 137, g: 220, b: 235 },     // Catppuccin sky (mystical)
      dreamyMist: { r: 186, g: 194, b: 222 },       // Catppuccin subtext1
      emotionalHeart: { r: 250, g: 179, b: 135 },   // Catppuccin peach (warm)
      etherealHighlight: { r: 203, g: 166, b: 247 } // Catppuccin mauve
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
    
    // Initialize ethereal state with LERP target values
    this.etherealState = {
      emotionalIntensity: 0,
      beautyLevel: 0,
      gentleness: 0.8,          // High gentleness by default
      mysticalShimmer: 0,
      dreamyTranslucency: 0.9,  // High translucency for dreamy effect
      flowingGradientPhase: 0,
      emotionalResonance: 0,
      softnessFactor: 1.0,
      
      // Initialize target values to current values (no animation initially)
      targetEmotionalIntensity: 0,
      targetBeautyLevel: 0,
      targetMysticalShimmer: 0
    };
    
    // Initialize ethereal configuration
    this.etherealConfig = {
      emotionalThreshold: 0.6,        // Activate on positive valence
      maxBeautyIntensity: 0.8,        // Gentle maximum intensity
      gentleTransitionDuration: 2000, // 2 second gentle transitions
      mysticalParticleCount: 15,      // Subtle particle count
      dreamyBlurRadius: 8,            // Soft blur radius
      flowingGradientSpeed: 0.3       // Slow, flowing animations
    };
  }

  /**
   * Initialize the Ethereal Beauty Engine
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('[SoftGlowEffectsManager] Awakening ethereal beauty consciousness...');
      
      // Register for ColorConsciousnessOrchestrator events
      this.subscribeToEmotionalConsciousness();
      
      // Initialize ethereal UI elements
      await this.initializeEtherealElements();
      
      // Setup CSS variables for ethereal effects
      this.setupEtherealCSSVariables();
      
      // Start gentle animation loop
      this.startEtherealAnimation();
      
      this.initialized = true;
      
      console.log('[SoftGlowEffectsManager] ✨ Ready for mystical emotional moments');
      
    } catch (error) {
      console.error('[SoftGlowEffectsManager] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Update animation frame for ethereal effects
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;
    
    const deltaSeconds = deltaTime / 1000;
    
    // Update animation phases (slow, flowing)
    this.animationState.mysticalPhase += deltaSeconds * 0.5;
    this.animationState.dreamyPhase += deltaSeconds * 0.3;
    this.animationState.flowingPhase += deltaSeconds * this.etherealConfig.flowingGradientSpeed;
    this.animationState.emotionalPulsePhase += deltaSeconds * 0.8;
    
    // Update ethereal state from music
    this.updateEtherealFromMusic();
    
    // Apply LERP smoothing for framerate-independent animation
    this.updateEtherealStateWithLERP(deltaSeconds);
    
    // Update mystical effects
    this.updateMysticalEffects();
    
    // Update ethereal elements
    this.updateEtherealElements();
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }

  /**
   * Health check for ethereal beauty system
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && 
                     this.etherealState.beautyLevel >= 0 &&
                     this.performanceMetrics.averageProcessingTime < 8; // Gentle 8ms requirement
    
    return {
      system: 'SoftGlowEffectsManager',
      healthy: isHealthy,
      metrics: {
        emotionalMomentCount: this.performanceMetrics.emotionalMomentCount,
        processingTime: this.performanceMetrics.averageProcessingTime,
        etherealElementCount: this.etherealElements.size,
        gentleTransitionCount: this.performanceMetrics.gentleTransitionCount
      },
      issues: isHealthy ? [] : ['Performance degradation detected']
    };
  }

  /**
   * Subscribe to emotional consciousness events
   */
  private subscribeToEmotionalConsciousness(): void {
    unifiedEventBus.subscribe('emotionalColorContext:updated', (event) => {
      this.onColorConsciousnessUpdate(event);
    });
    
    unifiedEventBus.subscribe('emotion:analyzed', (event) => {
      this.onEmotionalMoment(event);
    });
    
    unifiedEventBus.subscribe('settings:visual-guide-changed', (event) => {
      this.onGentleTransition(event);
    });
  }

  /**
   * Handle color consciousness updates
   */
  private onColorConsciousnessUpdate(event: any): void {
    const { palette, consciousnessLevel, emotionalTemperature } = event;
    
    // Map consciousness to ethereal beauty
    this.etherealState.emotionalResonance = consciousnessLevel * 0.9;
    
    // Adjust ethereal temperature for soft, warm colors
    if (emotionalTemperature > 5000) {
      // Warm temperatures enhance ethereal beauty
      this.etherealState.beautyLevel = Math.min(0.8, consciousnessLevel * 1.2);
    } else {
      // Cool temperatures create mystical effects
      this.etherealState.mysticalShimmer = consciousnessLevel * 0.7;
    }
    
    // Update ethereal color mapping
    const etherealColors = this.generateEtherealColors(palette, emotionalTemperature);
    this.updateEtherealColors(etherealColors);
  }

  /**
   * Handle emotional musical moments
   */
  private onEmotionalMoment(event: any): void {
    const { type, intensity, valence } = event;
    
    // Only activate for positive emotional moments
    if (valence > this.etherealConfig.emotionalThreshold) {
      this.triggerEtherealBeauty(intensity, valence);
    }
  }

  /**
   * Handle gentle transitions
   */
  private onGentleTransition(event: any): void {
    const { fromState, toState, duration } = event;
    
    // Create gentle ethereal transition
    this.createGentleTransition(fromState, toState, duration);
    this.performanceMetrics.gentleTransitionCount++;
  }

  /**
   * Trigger ethereal beauty effect
   */
  private triggerEtherealBeauty(intensity: number, valence: number): void {
    const startTime = performance.now();
    
    // Set non-LERP ethereal parameters for emotional moment
    this.etherealState.dreamyTranslucency = 0.8 + (valence * 0.2);
    
    // Update target values for LERP animation (replaces old decay scheduling)
    this.etherealState.targetEmotionalIntensity = Math.max(
      this.etherealState.targetEmotionalIntensity,
      intensity * 0.8
    );
    this.etherealState.targetBeautyLevel = Math.max(
      this.etherealState.targetBeautyLevel, 
      valence * 0.9
    );
    this.etherealState.targetMysticalShimmer = Math.max(
      this.etherealState.targetMysticalShimmer,
      valence * 0.6
    );
    
    // Update performance metrics
    this.performanceMetrics.emotionalMomentCount++;
    this.performanceMetrics.lastUpdateTime = performance.now() - startTime;
    
    console.log(`[SoftGlowEffectsManager] ✨ Ethereal beauty awakened! Intensity: ${intensity.toFixed(2)}, Valence: ${valence.toFixed(2)}`);
  }

  /**
   * Update ethereal state with LERP smoothing towards target values
   * This replaces the old frame-rate dependent decay system
   */
  private updateEtherealStateWithLERP(deltaTimeSeconds: number): void {
    // LERP current values towards targets for framerate-independent animation
    this.etherealState.emotionalIntensity = Year3000Utilities.lerpSmooth(
      this.etherealState.emotionalIntensity,
      this.etherealState.targetEmotionalIntensity,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.emotionalIntensity
    );
    
    this.etherealState.beautyLevel = Year3000Utilities.lerpSmooth(
      this.etherealState.beautyLevel,
      this.etherealState.targetBeautyLevel,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.beautyLevel
    );
    
    this.etherealState.mysticalShimmer = Year3000Utilities.lerpSmooth(
      this.etherealState.mysticalShimmer,
      this.etherealState.targetMysticalShimmer,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.mysticalShimmer
    );
    
    // Auto-decay targets when not actively being updated by music
    // This creates natural decay without frame-rate dependency
    const autoDecayHalfLife = 1.5; // Half-life of 1.5 seconds for target decay
    this.etherealState.targetEmotionalIntensity = Year3000Utilities.lerpSmooth(
      this.etherealState.targetEmotionalIntensity,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife
    );
    
    this.etherealState.targetBeautyLevel = Year3000Utilities.lerpSmooth(
      this.etherealState.targetBeautyLevel,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife * 1.2 // Slower decay for beauty
    );
    
    this.etherealState.targetMysticalShimmer = Year3000Utilities.lerpSmooth(
      this.etherealState.targetMysticalShimmer,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife * 0.8 // Faster decay for shimmer
    );
  }

  /**
   * Update ethereal state from current music
   */
  private updateEtherealFromMusic(): void {
    const musicState = this.musicSyncService.getCurrentMusicState();
    if (!musicState) return;
    
    const { emotion, beat, intensity } = musicState;
    
    // Only respond to positive, emotional music
    if (emotion && emotion.valence > 0.5) {
      // Adjust mystical shimmer based on musical beauty
      this.etherealState.mysticalShimmer = Math.max(
        this.etherealState.mysticalShimmer,
        emotion.valence * intensity * 0.5
      );
      
      // Adjust gentle flowing based on tempo
      if (beat && beat.tempo) {
        const tempoMultiplier = Math.min(1.5, beat.tempo / 100); // Gentle tempo response
        this.etherealConfig.flowingGradientSpeed = 0.3 * tempoMultiplier;
      }
    }
  }

  /**
   * Update mystical effects
   */
  private updateMysticalEffects(): void {
    const palette = this.etherealPalettes['dreamy-pastels']; // Default ethereal palette
    
    // Create ethereal color mapping
    const mapping: EtherealColorMapping = {
      primarySoft: this.blendSoftColors(
        palette.primarySoft,
        palette.mysticalGlow,
        this.etherealState.mysticalShimmer
      ),
      mysticalGlow: palette.mysticalGlow,
      dreamyMist: palette.dreamyMist,
      emotionalHeart: palette.emotionalHeart,
      etherealHighlight: palette.etherealHighlight,
      gentleTransparency: this.etherealState.dreamyTranslucency
    };
    
    // Update CSS variables through batcher
    this.updateEtherealCSSVariables(mapping);
  }

  /**
   * Blend soft colors for ethereal effects
   */
  private blendSoftColors(soft: RGB, mystical: RGB, blendFactor: number): RGB {
    const factor = Math.max(0, Math.min(1, blendFactor));
    
    return {
      r: Math.round(soft.r * (1 - factor) + mystical.r * factor),
      g: Math.round(soft.g * (1 - factor) + mystical.g * factor),
      b: Math.round(soft.b * (1 - factor) + mystical.b * factor)
    };
  }

  /**
   * Generate ethereal colors from consciousness palette
   */
  private generateEtherealColors(palette: any[], emotionalTemperature: number): EtherealColorMapping {
    // Select appropriate ethereal palette based on temperature
    let selectedPalette = this.etherealPalettes['dreamy-pastels'];
    
    if (emotionalTemperature < 4000) {
      selectedPalette = this.etherealPalettes['mystical-moonlight'];
    } else if (emotionalTemperature > 7000) {
      selectedPalette = this.etherealPalettes['gentle-aurora'];
    }
    
    return {
      primarySoft: selectedPalette.primarySoft,
      mysticalGlow: selectedPalette.mysticalGlow,
      dreamyMist: selectedPalette.dreamyMist,
      emotionalHeart: selectedPalette.emotionalHeart,
      etherealHighlight: selectedPalette.etherealHighlight,
      gentleTransparency: this.etherealState.dreamyTranslucency
    };
  }

  /**
   * Update ethereal colors in CSS
   */
  private updateEtherealColors(mapping: EtherealColorMapping): void {
    // Update ethereal color CSS variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-r',
      mapping.primarySoft.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-g',
      mapping.primarySoft.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-b',
      mapping.primarySoft.b.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-r',
      mapping.mysticalGlow.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-g',
      mapping.mysticalGlow.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-b',
      mapping.mysticalGlow.b.toString()
    );
  }

  /**
   * Initialize ethereal UI elements
   */
  private async initializeEtherealElements(): Promise<void> {
    const etherealSelectors = [
      '.main-view-container',
      '.Root__now-playing-bar',
      '.main-trackInfo-container',
      '.cover-art',
      '.player-controls'
    ];
    
    for (const selector of etherealSelectors) {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        const id = `ethereal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.etherealElements.set(id, element as HTMLElement);
      }
    }
  }

  /**
   * Setup CSS variables for ethereal effects
   */
  private setupEtherealCSSVariables(): void {
    const baseVariables = {
      '--ethereal-soft-r': '203',
      '--ethereal-soft-g': '166',
      '--ethereal-soft-b': '247',
      '--ethereal-mystical-r': '148',
      '--ethereal-mystical-g': '226',
      '--ethereal-mystical-b': '213',
      '--ethereal-dreamy-r': '245',
      '--ethereal-dreamy-g': '224',
      '--ethereal-dreamy-b': '220',
      '--ethereal-beauty-level': '0',
      '--ethereal-mystical-shimmer': '0',
      '--ethereal-gentle-transparency': '0.9',
      '--ethereal-flowing-phase': '0',
      '--ethereal-emotional-pulse': '0'
    };
    
    for (const [variable, value] of Object.entries(baseVariables)) {
      this.cssConsciousnessController.queueCSSVariableUpdate(variable, value);
    }
  }

  /**
   * Update ethereal CSS variables
   */
  private updateEtherealCSSVariables(mapping: EtherealColorMapping): void {
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-beauty-level',
      this.etherealState.beautyLevel.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-shimmer',
      this.etherealState.mysticalShimmer.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-gentle-transparency',
      mapping.gentleTransparency.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-flowing-phase',
      this.animationState.flowingPhase.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-emotional-pulse',
      Math.sin(this.animationState.emotionalPulsePhase).toString()
    );
  }

  /**
   * Update ethereal elements
   */
  private updateEtherealElements(): void {
    for (const [id, element] of this.etherealElements) {
      this.updateEtherealElement(element);
    }
  }

  /**
   * Update single ethereal element
   */
  private updateEtherealElement(element: HTMLElement): void {
    // Apply ethereal beauty effects when active
    if (this.etherealState.beautyLevel > 0.1) {
      this.applyEtherealBeauty(element);
    }
    
    // Apply mystical shimmer effects
    if (this.etherealState.mysticalShimmer > 0.1) {
      this.applyMysticalShimmer(element);
    }
    
    // Apply flowing gradients
    this.applyFlowingGradients(element);
  }

  /**
   * Apply ethereal beauty effect to element
   */
  private applyEtherealBeauty(element: HTMLElement): void {
    const beautyIntensity = this.etherealState.beautyLevel;
    const emotionalPulse = Math.sin(this.animationState.emotionalPulsePhase) * 0.5 + 0.5;
    
    // Soft ethereal glow
    const glowIntensity = beautyIntensity * emotionalPulse * 0.6;
    element.style.boxShadow = `
      0 0 ${glowIntensity * 30}px rgba(var(--ethereal-soft-r), var(--ethereal-soft-g), var(--ethereal-soft-b), ${glowIntensity * 0.6}),
      inset 0 0 ${glowIntensity * 20}px rgba(var(--ethereal-mystical-r), var(--ethereal-mystical-g), var(--ethereal-mystical-b), ${glowIntensity * 0.3})
    `;
    
    // Gentle transparency
    const transparency = 0.9 + (beautyIntensity * 0.1);
    element.style.opacity = transparency.toString();
  }

  /**
   * Apply mystical shimmer effect
   */
  private applyMysticalShimmer(element: HTMLElement): void {
    const shimmerIntensity = this.etherealState.mysticalShimmer;
    const mysticalPhase = this.animationState.mysticalPhase;
    
    // Mystical particle-like shimmer
    const shimmerOffset = Math.sin(mysticalPhase * 2) * shimmerIntensity * 2;
    const shimmerScale = 1.0 + (Math.cos(mysticalPhase * 1.5) * shimmerIntensity * 0.05);
    
    element.style.transform = `translate(${shimmerOffset}px, 0) scale(${shimmerScale})`;
    
    // Soft color shifting
    const hueShift = Math.sin(mysticalPhase * 0.8) * shimmerIntensity * 15;
    element.style.filter = `hue-rotate(${hueShift}deg) saturate(${1 + shimmerIntensity * 0.3})`;
  }

  /**
   * Apply flowing gradients
   */
  private applyFlowingGradients(element: HTMLElement): void {
    const flowingPhase = this.animationState.flowingPhase;
    const flowIntensity = this.etherealState.beautyLevel * 0.8;
    
    if (flowIntensity > 0.1) {
      const gradientPosition = (Math.sin(flowingPhase) + 1) * 50; // 0-100%
      
      element.style.background = `
        ${element.style.background || ''},
        linear-gradient(
          ${gradientPosition}deg,
          rgba(var(--ethereal-soft-r), var(--ethereal-soft-g), var(--ethereal-soft-b), ${flowIntensity * 0.1}) 0%,
          rgba(var(--ethereal-mystical-r), var(--ethereal-mystical-g), var(--ethereal-mystical-b), ${flowIntensity * 0.15}) 50%,
          rgba(var(--ethereal-dreamy-r), var(--ethereal-dreamy-g), var(--ethereal-dreamy-b), ${flowIntensity * 0.05}) 100%
        )
      `;
    }
  }

  /**
   * Create gentle transition between states
   */
  private createGentleTransition(fromState: any, toState: any, duration: number): void {
    const startTime = performance.now();
    
    const transition = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Gentle easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate ethereal states
      this.etherealState.beautyLevel = fromState.beauty + (toState.beauty - fromState.beauty) * eased;
      this.etherealState.mysticalShimmer = fromState.shimmer + (toState.shimmer - fromState.shimmer) * eased;
      
      if (progress < 1) {
        requestAnimationFrame(transition);
      }
    };
    
    requestAnimationFrame(transition);
  }

  /**
   * Start ethereal animation loop
   */
  private startEtherealAnimation(): void {
    this.animationState.isAnimating = true;
    this.animationState.lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!this.animationState.isAnimating) return;
      
      const deltaTime = currentTime - this.animationState.lastFrameTime;
      this.animationState.lastFrameTime = currentTime;
      
      // Update ethereal animation
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
    console.log(`[SoftGlowEffectsManager] Force repaint triggered: ${reason || 'Unknown'}`);
    
    // Force update of all ethereal elements
    this.updateEtherealElements();
    
    // Trigger CSS variable batch flush
    this.cssConsciousnessController.flushCSSVariableBatch();
  }

  /**
   * Cleanup and destroy the engine
   */
  public destroy(): void {
    console.log('[SoftGlowEffectsManager] Dissolving ethereal beauty...');
    
    // Stop animation
    this.animationState.isAnimating = false;
    
    // Clear ethereal elements
    this.etherealElements.clear();
    
    // Reset ethereal state
    this.etherealState = {
      emotionalIntensity: 0,
      beautyLevel: 0,
      gentleness: 0.8,
      mysticalShimmer: 0,
      dreamyTranslucency: 0.9,
      flowingGradientPhase: 0,
      emotionalResonance: 0,
      softnessFactor: 1.0,
      
      // Reset target values too
      targetEmotionalIntensity: 0,
      targetBeautyLevel: 0,
      targetMysticalShimmer: 0
    };
    
    this.initialized = false;
  }

  // Public API methods
  public getEtherealState(): EtherealState {
    return { ...this.etherealState };
  }

  public getEtherealConfig(): EtherealEffectConfig {
    return { ...this.etherealConfig };
  }

  public getPerformanceMetrics() {
    return { 
      ...this.performanceMetrics,
      etherealElementCount: this.etherealElements.size
    };
  }

  public setEmotionalThreshold(threshold: number): void {
    this.etherealConfig.emotionalThreshold = Math.max(0, Math.min(1, threshold));
  }

  public setMaxBeautyIntensity(intensity: number): void {
    this.etherealConfig.maxBeautyIntensity = Math.max(0, Math.min(1, intensity));
  }

  public setGentleness(gentleness: number): void {
    this.etherealState.gentleness = Math.max(0, Math.min(1, gentleness));
  }
}