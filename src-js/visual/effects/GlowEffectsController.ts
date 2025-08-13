/**
 * MusicGlowEffectsManager - Phase 2.3 Implementation
 * 
 * Music-reactive glow effects and flowing gradients for visual enhancement.
 * Creates dynamic glow effects that respond to music intensity and emotional peaks.
 * 
 * @architecture Year3000System - Music-Reactive Glow Integration
 * @performance 60fps flowing animations with CSS-first approach
 * @features Dynamic glow effects synchronized with music analysis
 */

import { HolographicUISystem } from "@/visual/music/ui/HolographicUISystem";
import { colorTransitionManager } from "@/visual/effects/ColorTransitionManager";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorStubs";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

export interface GlowEffectState {
  glowIntensity: number;         // 0-1 current glow intensity
  effectLevel: number;           // 0-1 overall effect strength
  softness: number;              // 0-1 soft effect intensity
  shimmerEffect: number;         // 0-1 shimmer animation intensity
  transparency: number;          // 0-1 transparency level
  gradientPhase: number;         // 0-2π flowing gradient animation phase
  musicResponse: number;         // 0-1 music responsiveness strength
  smoothnessFactor: number;      // 0-1 overall smoothness multiplier
  
  // Target values for LERP smoothing
  targetGlowIntensity: number;
  targetEffectLevel: number;
  targetShimmerEffect: number;
}

export interface GlowEffectConfig {
  musicThreshold: number;            // Musical intensity threshold for glow activation
  maxGlowIntensity: number;          // Maximum glow effect intensity
  transitionDuration: number;        // Duration of smooth transitions in ms
  particleCount: number;             // Number of glow particles
  blurRadius: number;                // Maximum blur radius for glow effects
  gradientSpeed: number;             // Speed of flowing gradient animations
}

export interface GlowColorMapping {
  primaryGlow: RGB;               // Primary glow color
  shimmerColor: RGB;              // Shimmer effect color
  mistBackground: RGB;            // Background mist color
  coreColor: RGB;                 // Core glow color
  accentColor: RGB;               // Accent highlight color
  transparency: number;           // Overall transparency level
}

/**
 * MusicGlowEffectsManager - Music-reactive glow effects for visual enhancement
 */
export class MusicGlowEffectsManager implements IManagedSystem {
  public initialized = false;
  
  private holographicSystem: HolographicUISystem;
  // Using shared colorConsciousnessManager instead of injected orchestrator
  private cssConsciousnessController: UnifiedCSSVariableManager;
  private musicSyncService: MusicSyncService;
  
  private glowState: GlowEffectState;
  private glowConfig: GlowEffectConfig;
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
    glowIntensity: 0.25,    // Fast emotional response
    effectLevel: 0.35,           // Moderate beauty transitions
    shimmerEffect: 0.20        // Quick shimmer response
  };
  
  // Ethereal color palettes
  private etherealPalettes = {
    'dreamy-pastels': {
      primaryGlow: { r: 203, g: 166, b: 247 },      // Catppuccin mauve (soft)
      shimmerColor: { r: 148, g: 226, b: 213 },     // Catppuccin teal (mystical)
      mistBackground: { r: 245, g: 224, b: 220 },       // Catppuccin rosewater
      coreColor: { r: 249, g: 226, b: 175 },   // Catppuccin yellow (warm)
      accentColor: { r: 180, g: 190, b: 254 } // Catppuccin lavender
    },
    'mystical-moonlight': {
      primaryGlow: { r: 137, g: 180, b: 250 },      // Catppuccin blue (soft)
      shimmerColor: { r: 166, g: 227, b: 161 },     // Catppuccin green (mystical)
      mistBackground: { r: 205, g: 214, b: 244 },       // Catppuccin text (muted)
      coreColor: { r: 243, g: 139, b: 168 },   // Catppuccin pink (warm)
      accentColor: { r: 137, g: 220, b: 235 } // Catppuccin sky
    },
    'gentle-aurora': {
      primaryGlow: { r: 166, g: 227, b: 161 },      // Catppuccin green (soft)
      shimmerColor: { r: 137, g: 220, b: 235 },     // Catppuccin sky (mystical)
      mistBackground: { r: 186, g: 194, b: 222 },       // Catppuccin subtext1
      coreColor: { r: 250, g: 179, b: 135 },   // Catppuccin peach (warm)
      accentColor: { r: 203, g: 166, b: 247 } // Catppuccin mauve
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
    
    // Initialize glow state with LERP target values
    this.glowState = {
      glowIntensity: 0,
      effectLevel: 0,
      softness: 0.8,               // High softness by default
      shimmerEffect: 0,
      transparency: 0.9,           // High transparency for dreamy effect
      gradientPhase: 0,
      musicResponse: 0,
      smoothnessFactor: 1.0,
      
      // Initialize target values to current values (no animation initially)
      targetGlowIntensity: 0,
      targetEffectLevel: 0,
      targetShimmerEffect: 0
    };
    
    // Initialize glow configuration
    this.glowConfig = {
      musicThreshold: 0.6,          // Activate on positive valence
      maxGlowIntensity: 0.8,        // Gentle maximum intensity
      transitionDuration: 2000,     // 2 second transitions
      particleCount: 15,            // Subtle particle count
      blurRadius: 8,                // Soft blur radius
      gradientSpeed: 0.3            // Slow, flowing animations
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
      await this.initializeGlowElements();
      
      // Setup CSS variables for ethereal effects
      this.setupGlowCSSVariables();
      
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
    this.animationState.flowingPhase += deltaSeconds * this.glowConfig.gradientSpeed;
    this.animationState.emotionalPulsePhase += deltaSeconds * 0.8;
    
    // Update ethereal state from music
    this.updateEtherealFromMusic();
    
    // Apply LERP smoothing for framerate-independent animation
    this.updateEtherealStateWithLERP(deltaSeconds);
    
    // Update mystical effects
    this.updateMysticalEffects();
    
    // Update ethereal elements
    this.updateGlowElements();
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }

  /**
   * Health check for ethereal beauty system
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && 
                     this.glowState.effectLevel >= 0 &&
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
    
    // Map consciousness to glow beauty
    this.glowState.musicResponse = consciousnessLevel * 0.9;
    
    // Adjust ethereal temperature for soft, warm colors
    if (emotionalTemperature > 5000) {
      // Warm temperatures enhance glow beauty
      this.glowState.effectLevel = Math.min(0.8, consciousnessLevel * 1.2);
    } else {
      // Cool temperatures create shimmer effects
      this.glowState.shimmerEffect = consciousnessLevel * 0.7;
    }
    
    // Update glow color mapping
    const glowColors = this.generateGlowColors(palette, emotionalTemperature);
    this.updateGlowColors(glowColors);
  }

  /**
   * Handle emotional musical moments
   */
  private onEmotionalMoment(event: any): void {
    const { type, intensity, valence } = event;
    
    // Only activate for positive emotional moments
    if (valence > this.glowConfig.musicThreshold) {
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
    
    // Set non-LERP glow parameters for emotional moment
    this.glowState.transparency = 0.8 + (valence * 0.2);
    
    // Update target values for LERP animation (replaces old decay scheduling)
    this.glowState.targetGlowIntensity = Math.max(
      this.glowState.targetGlowIntensity,
      intensity * 0.8
    );
    this.glowState.targetEffectLevel = Math.max(
      this.glowState.targetEffectLevel, 
      valence * 0.9
    );
    this.glowState.targetShimmerEffect = Math.max(
      this.glowState.targetShimmerEffect,
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
    this.glowState.glowIntensity = Year3000Utilities.lerpSmooth(
      this.glowState.glowIntensity,
      this.glowState.targetGlowIntensity,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.glowIntensity
    );
    
    this.glowState.effectLevel = Year3000Utilities.lerpSmooth(
      this.glowState.effectLevel,
      this.glowState.targetEffectLevel,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.effectLevel
    );
    
    this.glowState.shimmerEffect = Year3000Utilities.lerpSmooth(
      this.glowState.shimmerEffect,
      this.glowState.targetShimmerEffect,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.shimmerEffect
    );
    
    // Auto-decay targets when not actively being updated by music
    // This creates natural decay without frame-rate dependency
    const autoDecayHalfLife = 1.5; // Half-life of 1.5 seconds for target decay
    this.glowState.targetGlowIntensity = Year3000Utilities.lerpSmooth(
      this.glowState.targetGlowIntensity,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife
    );
    
    this.glowState.targetEffectLevel = Year3000Utilities.lerpSmooth(
      this.glowState.targetEffectLevel,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife * 1.2 // Slower decay for beauty
    );
    
    this.glowState.targetShimmerEffect = Year3000Utilities.lerpSmooth(
      this.glowState.targetShimmerEffect,
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
      this.glowState.shimmerEffect = Math.max(
        this.glowState.shimmerEffect,
        emotion.valence * intensity * 0.5
      );
      
      // Adjust gentle flowing based on tempo
      if (beat && beat.tempo) {
        const tempoMultiplier = Math.min(1.5, beat.tempo / 100); // Gentle tempo response
        this.glowConfig.gradientSpeed = 0.3 * tempoMultiplier;
      }
    }
  }

  /**
   * Update mystical effects
   */
  private updateMysticalEffects(): void {
    const palette = this.etherealPalettes['dreamy-pastels']; // Default ethereal palette
    
    // Create ethereal color mapping
    const mapping: GlowColorMapping = {
      primaryGlow: this.blendSoftColors(
        palette.primaryGlow,
        palette.shimmerColor,
        this.glowState.shimmerEffect
      ),
      shimmerColor: palette.shimmerColor,
      mistBackground: palette.mistBackground,
      coreColor: palette.coreColor,
      accentColor: palette.accentColor,
      transparency: this.glowState.transparency
    };
    
    // Update CSS variables through batcher
    this.updateGlowCSSVariables(mapping);
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
  private generateGlowColors(palette: any[], emotionalTemperature: number): GlowColorMapping {
    // Select appropriate ethereal palette based on temperature
    let selectedPalette = this.etherealPalettes['dreamy-pastels'];
    
    if (emotionalTemperature < 4000) {
      selectedPalette = this.etherealPalettes['mystical-moonlight'];
    } else if (emotionalTemperature > 7000) {
      selectedPalette = this.etherealPalettes['gentle-aurora'];
    }
    
    return {
      primaryGlow: selectedPalette.primaryGlow,
      shimmerColor: selectedPalette.shimmerColor,
      mistBackground: selectedPalette.mistBackground,
      coreColor: selectedPalette.coreColor,
      accentColor: selectedPalette.accentColor,
      transparency: this.glowState.transparency
    };
  }

  /**
   * Update ethereal colors in CSS
   */
  private updateGlowColors(mapping: GlowColorMapping): void {
    // Update ethereal color CSS variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-r',
      mapping.primaryGlow.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-g',
      mapping.primaryGlow.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-soft-b',
      mapping.primaryGlow.b.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-r',
      mapping.shimmerColor.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-g',
      mapping.shimmerColor.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-b',
      mapping.shimmerColor.b.toString()
    );
  }

  /**
   * Initialize ethereal UI elements
   */
  private async initializeGlowElements(): Promise<void> {
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
  private setupGlowCSSVariables(): void {
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
  private updateGlowCSSVariables(mapping: GlowColorMapping): void {
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-beauty-level',
      this.glowState.effectLevel.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-mystical-shimmer',
      this.glowState.shimmerEffect.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      '--ethereal-gentle-transparency',
      mapping.transparency.toString()
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
  private updateGlowElements(): void {
    for (const [id, element] of this.etherealElements) {
      this.updateEtherealElement(element);
    }
  }

  /**
   * Update single ethereal element
   */
  private updateEtherealElement(element: HTMLElement): void {
    // Apply ethereal beauty effects when active
    if (this.glowState.effectLevel > 0.1) {
      this.applyEtherealBeauty(element);
    }
    
    // Apply mystical shimmer effects
    if (this.glowState.shimmerEffect > 0.1) {
      this.applyMysticalShimmer(element);
    }
    
    // Apply flowing gradients
    this.applyFlowingGradients(element);
  }

  /**
   * Apply ethereal beauty effect to element
   */
  private applyEtherealBeauty(element: HTMLElement): void {
    const beautyIntensity = this.glowState.effectLevel;
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
    const shimmerIntensity = this.glowState.shimmerEffect;
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
    const flowIntensity = this.glowState.effectLevel * 0.8;
    
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
      this.glowState.effectLevel = fromState.beauty + (toState.beauty - fromState.beauty) * eased;
      this.glowState.shimmerEffect = fromState.shimmer + (toState.shimmer - fromState.shimmer) * eased;
      
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
    this.updateGlowElements();
    
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
    this.glowState = {
      glowIntensity: 0,
      effectLevel: 0,
      softness: 0.8,
      shimmerEffect: 0,
      transparency: 0.9,
      gradientPhase: 0,
      musicResponse: 0,
      smoothnessFactor: 1.0,
      
      // Reset target values too
      targetGlowIntensity: 0,
      targetEffectLevel: 0,
      targetShimmerEffect: 0
    };
    
    this.initialized = false;
  }

  // Public API methods
  public getGlowState(): GlowEffectState {
    return { ...this.glowState };
  }

  public getGlowConfig(): GlowEffectConfig {
    return { ...this.glowConfig };
  }

  public getPerformanceMetrics() {
    return { 
      ...this.performanceMetrics,
      etherealElementCount: this.etherealElements.size
    };
  }

  public setEmotionalThreshold(threshold: number): void {
    this.glowConfig.musicThreshold = Math.max(0, Math.min(1, threshold));
  }

  public setMaxBeautyIntensity(intensity: number): void {
    this.glowConfig.maxGlowIntensity = Math.max(0, Math.min(1, intensity));
  }

  public setGentleness(softness: number): void {
    this.glowState.softness = Math.max(0, Math.min(1, softness));
  }
}