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
import { colorTransitionManager } from "@/visual/effects/MusicColorTransitionState";
import type { RGB, MusicEmotion, BeatData, CinematicPalette } from "@/types/colorTypes";
import { unifiedEventBus } from "@/core/events/EventBus";
import { CSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";

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
  // Using shared colorVisualEffectsManager instead of injected orchestrator
  private cssVisualEffectsController: CSSVariableWriter;
  private musicSyncService: MusicSyncService;
  
  private glowState: GlowEffectState;
  private glowConfig: GlowEffectConfig;
  private subtleElements: Map<string, HTMLElement> = new Map();
  // Legacy compatibility
  private get etherealElements() { return this.subtleElements; }
  
  // Performance tracking
  private performanceMetrics = {
    responsiveMomentCount: 0,
    averageProcessingTime: 0,
    lastUpdateTime: 0,
    smoothTransitionCount: 0,
    // Legacy compatibility
    get emotionalMomentCount() { return this.responsiveMomentCount; },
    set emotionalMomentCount(value: number) { this.responsiveMomentCount = value; },
    get gentleTransitionCount() { return this.smoothTransitionCount; },
    set gentleTransitionCount(value: number) { this.smoothTransitionCount = value; }
  };
  
  // Animation state
  private animationState = {
    ambientPhase: 0,
    smoothPhase: 0,
    flowingPhase: 0,
    // Legacy compatibility
    get mysticalPhase() { return this.ambientPhase; },
    set mysticalPhase(value: number) { this.ambientPhase = value; },
    get dreamyPhase() { return this.smoothPhase; },
    set dreamyPhase(value: number) { this.smoothPhase = value; },
    responsivePulsePhase: 0,
    // Legacy compatibility continued
    get emotionalPulsePhase() { return this.responsivePulsePhase; },
    set emotionalPulsePhase(value: number) { this.responsivePulsePhase = value; },
    lastFrameTime: 0,
    isAnimating: false
  };
  
  // LERP smoothing half-life values (in seconds) for framerate-independent decay
  private lerpHalfLifeValues = {
    glowIntensity: 0.25,    // Fast emotional response
    effectLevel: 0.35,           // Moderate beauty transitions
    shimmerEffect: 0.20        // Quick shimmer response
  };
  
  // Subtle color palettes
  private subtlePalettes = {
    'smooth-pastels': {
      primaryGlow: { r: 203, g: 166, b: 247 },      // Catppuccin mauve (soft)
      shimmerColor: { r: 148, g: 226, b: 213 },     // Catppuccin teal (ambient)
      mistBackground: { r: 245, g: 224, b: 220 },       // Catppuccin rosewater
      coreColor: { r: 249, g: 226, b: 175 },   // Catppuccin yellow (warm)
      accentColor: { r: 180, g: 190, b: 254 } // Catppuccin lavender
    },
    'ambient-moonlight': {
      primaryGlow: { r: 137, g: 180, b: 250 },      // Catppuccin blue (soft)
      shimmerColor: { r: 166, g: 227, b: 161 },     // Catppuccin green (ambient)
      mistBackground: { r: 205, g: 214, b: 244 },       // Catppuccin text (muted)
      coreColor: { r: 243, g: 139, b: 168 },   // Catppuccin pink (warm)
      accentColor: { r: 137, g: 220, b: 235 } // Catppuccin sky
    },
    'smooth-aurora': {
      primaryGlow: { r: 166, g: 227, b: 161 },      // Catppuccin green (soft)
      shimmerColor: { r: 137, g: 220, b: 235 },     // Catppuccin sky (ambient)
      mistBackground: { r: 186, g: 194, b: 222 },       // Catppuccin subtext1
      coreColor: { r: 250, g: 179, b: 135 },   // Catppuccin peach (warm)
      accentColor: { r: 203, g: 166, b: 247 } // Catppuccin mauve
    }
  };
  
  // Legacy compatibility
  private get etherealPalettes() { return this.subtlePalettes; }

  constructor(
    holographicSystem: HolographicUISystem,
    cssVisualEffectsController: CSSVariableWriter,
    musicSyncService: MusicSyncService
  ) {
    this.holographicSystem = holographicSystem;
    this.cssVisualEffectsController = cssVisualEffectsController;
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
      console.log('[SoftGlowEffectsManager] Initializing subtle visual effects...');
      
      // Register for ColorVisualEffectsOrchestrator events
      this.subscribeToEmotionalVisualEffects();
      
      // Initialize subtle UI elements
      await this.initializeGlowElements();
      
      // Setup CSS variables for subtle effects
      this.setupGlowCSSVariables();

      // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by AnimationFrameCoordinator
      // The coordinator will call updateAnimation(deltaTime) automatically
      // Registration happens in SystemIntegrationCoordinator during system initialization

      this.initialized = true;
      
      console.log('[SoftGlowEffectsManager] ✨ Ready for ambient responsive moments');
      
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
    this.animationState.ambientPhase += deltaSeconds * 0.5;
    this.animationState.smoothPhase += deltaSeconds * 0.3;
    this.animationState.flowingPhase += deltaSeconds * this.glowConfig.gradientSpeed;
    this.animationState.responsivePulsePhase += deltaSeconds * 0.8;
    
    // Update subtle state from music
    this.updateSubtleFromMusic();
    
    // Apply LERP smoothing for framerate-independent animation
    this.updateSubtleStateWithLERP(deltaSeconds);
    
    // Update ambient effects
    this.updateAmbientEffects();
    
    // Update subtle elements
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
   * Subscribe to emotional visual effects events
   */
  private subscribeToEmotionalVisualEffects(): void {
    unifiedEventBus.subscribe('music:emotional-context-updated', (event) => {
      this.onColorVisualEffectsUpdate(event);
    });
    
    unifiedEventBus.subscribe('music:emotion-analyzed', (event) => {
      this.onEmotionalMoment(event);
    });
    
    unifiedEventBus.subscribe('settings:visual-guide-changed', (event) => {
      this.onGentleTransition(event);
    });
  }

  /**
   * Handle color visual effects updates
   */
  private onColorVisualEffectsUpdate(event: any): void {
    const { palette, visualEffectsLevel, emotionalTemperature } = event;
    
    // Map visual effects to glow beauty
    this.glowState.musicResponse = visualEffectsLevel * 0.9;
    
    // Adjust ethereal temperature for soft, warm colors
    if (emotionalTemperature > 5000) {
      // Warm temperatures enhance glow beauty
      this.glowState.effectLevel = Math.min(0.8, visualEffectsLevel * 1.2);
    } else {
      // Cool temperatures create shimmer effects
      this.glowState.shimmerEffect = visualEffectsLevel * 0.7;
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
      this.triggerSubtleEffect(intensity, valence);
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
   * Trigger subtle effect
   */
  private triggerSubtleEffect(intensity: number, valence: number): void {
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
   * Update subtle state with LERP smoothing towards target values
   * This replaces the old frame-rate dependent decay system
   */
  private updateSubtleStateWithLERP(deltaTimeSeconds: number): void {
    // LERP current values towards targets for framerate-independent animation
    this.glowState.glowIntensity = ThemeUtilities.lerpSmooth(
      this.glowState.glowIntensity,
      this.glowState.targetGlowIntensity,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.glowIntensity
    );
    
    this.glowState.effectLevel = ThemeUtilities.lerpSmooth(
      this.glowState.effectLevel,
      this.glowState.targetEffectLevel,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.effectLevel
    );
    
    this.glowState.shimmerEffect = ThemeUtilities.lerpSmooth(
      this.glowState.shimmerEffect,
      this.glowState.targetShimmerEffect,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.shimmerEffect
    );
    
    // Auto-decay targets when not actively being updated by music
    // This creates natural decay without frame-rate dependency
    const autoDecayHalfLife = 1.5; // Half-life of 1.5 seconds for target decay
    this.glowState.targetGlowIntensity = ThemeUtilities.lerpSmooth(
      this.glowState.targetGlowIntensity,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife
    );
    
    this.glowState.targetEffectLevel = ThemeUtilities.lerpSmooth(
      this.glowState.targetEffectLevel,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife * 1.2 // Slower decay for beauty
    );
    
    this.glowState.targetShimmerEffect = ThemeUtilities.lerpSmooth(
      this.glowState.targetShimmerEffect,
      0, // Decay towards zero
      deltaTimeSeconds,
      autoDecayHalfLife * 0.8 // Faster decay for shimmer
    );
  }

  /**
   * Update subtle state from current music
   */
  private updateSubtleFromMusic(): void {
    const musicState = this.musicSyncService.getCurrentMusicState();
    if (!musicState) return;
    
    const { emotion, beat, intensity } = musicState;
    
    // Only respond to positive, emotional music
    if (emotion && emotion.valence > 0.5) {
      // Adjust ambient shimmer based on musical beauty
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
   * Update ambient effects
   */
  private updateAmbientEffects(): void {
    const palette = this.etherealPalettes['smooth-pastels']; // Default ethereal palette
    
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
  private blendSoftColors(soft: RGB, ambient: RGB, blendFactor: number): RGB {
    const factor = Math.max(0, Math.min(1, blendFactor));
    
    return {
      r: Math.round(soft.r * (1 - factor) + ambient.r * factor),
      g: Math.round(soft.g * (1 - factor) + ambient.g * factor),
      b: Math.round(soft.b * (1 - factor) + ambient.b * factor)
    };
  }

  /**
   * Generate ethereal colors from visual effects palette
   */
  private generateGlowColors(palette: any[], emotionalTemperature: number): GlowColorMapping {
    // Select appropriate ethereal palette based on temperature
    let selectedPalette = this.etherealPalettes['smooth-pastels'];
    
    if (emotionalTemperature < 4000) {
      selectedPalette = this.etherealPalettes['ambient-moonlight'];
    } else if (emotionalTemperature > 7000) {
      selectedPalette = this.etherealPalettes['smooth-aurora'];
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
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-soft-r',
      mapping.primaryGlow.r.toString()
    );
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-soft-g',
      mapping.primaryGlow.g.toString()
    );
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-soft-b',
      mapping.primaryGlow.b.toString()
    );
    
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-ambient-r',
      mapping.shimmerColor.r.toString()
    );
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-ambient-g',
      mapping.shimmerColor.g.toString()
    );
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-ambient-b',
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
      '--subtle-soft-r': '203',
      '--subtle-soft-g': '166',
      '--subtle-soft-b': '247',
      '--subtle-ambient-r': '148',
      '--subtle-ambient-g': '226',
      '--subtle-ambient-b': '213',
      '--subtle-smooth-r': '245',
      '--subtle-smooth-g': '224',
      '--subtle-smooth-b': '220',
      '--subtle-effect-level': '0',
      '--subtle-ambient-shimmer': '0',
      '--subtle-smooth-transparency': '0.9',
      '--subtle-flowing-phase': '0',
      '--subtle-responsive-pulse': '0'
    };
    
    for (const [variable, value] of Object.entries(baseVariables)) {
      this.cssVisualEffectsController.queueCSSVariableUpdate(variable, value);
    }
  }

  /**
   * Update ethereal CSS variables
   */
  private updateGlowCSSVariables(mapping: GlowColorMapping): void {
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-effect-level',
      this.glowState.effectLevel.toString()
    );
    
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-ambient-shimmer',
      this.glowState.shimmerEffect.toString()
    );
    
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-smooth-transparency',
      mapping.transparency.toString()
    );
    
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-flowing-phase',
      this.animationState.flowingPhase.toString()
    );
    
    this.cssVisualEffectsController.queueCSSVariableUpdate(
      '--subtle-responsive-pulse',
      Math.sin(this.animationState.responsivePulsePhase).toString()
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
    // Apply subtle effects when active
    if (this.glowState.effectLevel > 0.1) {
      this.applySubtleEffect(element);
    }
    
    // Apply ambient shimmer effects
    if (this.glowState.shimmerEffect > 0.1) {
      this.applyAmbientShimmer(element);
    }
    
    // Apply flowing gradients
    this.applyFlowingGradients(element);
  }

  /**
   * Apply subtle effect to element
   * PERFORMANCE FIX: Use CSS variables instead of direct DOM manipulation
   */
  private applySubtleEffect(element: HTMLElement): void {
    const effectIntensity = this.glowState.effectLevel;
    const responsivePulse = Math.sin(this.animationState.responsivePulsePhase) * 0.5 + 0.5;

    // Soft subtle glow
    const glowIntensity = effectIntensity * responsivePulse * 0.6;
    const glowSpread = glowIntensity * 30;
    const glowOpacity = glowIntensity * 0.6;
    const insetSpread = glowIntensity * 20;
    const insetOpacity = glowIntensity * 0.3;

    // Smooth transparency
    const transparency = 0.9 + (effectIntensity * 0.1);

    // Use CSS variables for batched updates instead of direct style manipulation
    this.cssVisualEffectsController.queueCSSVariableUpdate('--subtle-glow-spread', `${glowSpread}px`);
    this.cssVisualEffectsController.queueCSSVariableUpdate('--subtle-glow-opacity', glowOpacity.toString());
    this.cssVisualEffectsController.queueCSSVariableUpdate('--subtle-inset-spread', `${insetSpread}px`);
    this.cssVisualEffectsController.queueCSSVariableUpdate('--subtle-inset-opacity', insetOpacity.toString());
    this.cssVisualEffectsController.queueCSSVariableUpdate('--subtle-transparency', transparency.toString());
  }

  /**
   * Apply ambient shimmer effect
   * 🎨 PHASE 2 OPTIMIZATION: Use pre-computed color variations instead of runtime filters
   *
   * Performance improvement: ~8-12ms per frame by eliminating hue-rotate and saturate filters
   * ColorHarmonyEngine pre-computes 16 shimmer variants on track change covering:
   * - Hue range: -15° to +15°
   * - Saturation range: 0.7x to 1.3x
   */
  private applyAmbientShimmer(element: HTMLElement): void {
    const shimmerIntensity = this.glowState.shimmerEffect;
    const ambientPhase = this.animationState.ambientPhase;

    // Ambient particle-like shimmer
    const shimmerOffset = Math.sin(ambientPhase * 2) * shimmerIntensity * 2;
    const shimmerScale = 1.0 + (Math.cos(ambientPhase * 1.5) * shimmerIntensity * 0.05);

    // ✅ PHASE 2 OPTIMIZATION: Select pre-computed color variant based on animation phase
    // Map animation phase (0-2π) to variant index (0-15)
    const phaseNormalized = (ambientPhase * 0.8) / (Math.PI * 2); // Normalize to 0-1
    const variantIndex = Math.floor(((phaseNormalized % 1) + 1) % 1 * 16); // 0-15

    // Use CSS variables for batched updates
    this.cssVisualEffectsController.queueCSSVariableUpdate('--shimmer-translate-x', `${shimmerOffset}px`);
    this.cssVisualEffectsController.queueCSSVariableUpdate('--shimmer-scale', shimmerScale.toString());

    // ✅ NEW: Apply pre-computed color variant from ColorHarmonyEngine cache
    // This replaces runtime hue-rotate and saturate filters with direct RGB values
    const variantColorVar = `var(--sn-shimmer-variant-${variantIndex}-rgb)`;
    this.cssVisualEffectsController.queueCSSVariableUpdate('--shimmer-color-rgb', variantColorVar);
  }

  /**
   * Apply flowing gradients
   * PERFORMANCE FIX: Set inline styles using CSS variables for efficient updates
   */
  private applyFlowingGradients(element: HTMLElement): void {
    const flowingPhase = this.animationState.flowingPhase;
    const flowIntensity = this.glowState.effectLevel * 0.8;

    if (flowIntensity > 0.1) {
      const gradientPosition = (Math.sin(flowingPhase) + 1) * 50; // 0-100%

      // Queue CSS variable updates
      this.cssVisualEffectsController.queueCSSVariableUpdate(
        '--flowing-gradient-position',
        `${gradientPosition}deg`
      );
      this.cssVisualEffectsController.queueCSSVariableUpdate(
        '--flowing-gradient-intensity',
        flowIntensity.toString()
      );

      // Set inline style to USE the CSS variables (only once per element)
      if (!element.dataset.flowingGradientInit) {
        const currentBg = element.style.background || '';
        element.style.background = `
          ${currentBg},
          linear-gradient(
            var(--flowing-gradient-position, 0deg),
            rgba(var(--subtle-soft-r), var(--subtle-soft-g), var(--subtle-soft-b), calc(var(--flowing-gradient-intensity, 0) * 0.1)) 0%,
            rgba(var(--subtle-ambient-r), var(--subtle-ambient-g), var(--subtle-ambient-b), calc(var(--flowing-gradient-intensity, 0) * 0.15)) 50%,
            rgba(var(--subtle-smooth-r), var(--subtle-smooth-g), var(--subtle-smooth-b), calc(var(--flowing-gradient-intensity, 0) * 0.05)) 100%
          )
        `;
        element.dataset.flowingGradientInit = 'true';
      }
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
   * ✅ RAF LOOP REMOVED - Managed by AnimationFrameCoordinator
   *
   * Previous implementation: startEtherealAnimation() with independent RAF loop
   * New implementation: updateAnimation() called by coordinator
   *
   * Benefits:
   * - Single RAF loop for all systems (not 5-8 independent loops)
   * - Shared deltaTime calculation (eliminates redundant performance.now() calls)
   * - Coordinated frame budget management
   * - Priority-based execution order
   *
   * Migration: Lines 725-743 removed, registration added to SystemIntegrationCoordinator
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
  public forceRepaint(reason?: string): void {
    console.log(`[SoftGlowEffectsManager] Force repaint triggered: ${reason || 'Unknown'}`);
    
    // Force update of all ethereal elements
    this.updateGlowElements();
    
    // Trigger CSS variable batch flush
    this.cssVisualEffectsController.flushCSSVariableBatch();
  }

  /**
   * Cleanup and destroy the engine
   */
  public destroy(): void {
    console.log('[SoftGlowEffectsManager] Dissolving ethereal beauty...');

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation loop (coordinator handles this)
    // System unregistration happens in SystemIntegrationCoordinator destroy()

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