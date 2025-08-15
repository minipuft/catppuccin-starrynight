import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';
import { EnhancedMasterAnimationCoordinator, type IVisualSystem, type FrameContext } from './EnhancedMasterAnimationCoordinator';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import type { Year3000Config, AdvancedSystemConfig } from '@/types/models';

export interface CSSAnimationConfig {
  name: string;
  duration: number;
  easing: string;
  iterations: number | 'infinite';
  fillMode: FillMode;
  playState: 'running' | 'paused';
  delay: number;
  direction: PlaybackDirection;
}

export interface KineticAnimationState {
  rippleActive: boolean;
  bloomActive: boolean;
  refractActive: boolean;
  oscillateActive: boolean;
  harmonizeActive: boolean;
  timeBasedEchoActive: boolean;
  gravityActive: boolean;
  beatSyncEnabled: boolean;
  intensityLevel: number;
  tempoMultiplier: number;
}

/**
 * CSSAnimationManager - Phase 2 CSS Module Integration
 * 
 * Bridges CSS animations with the unified animation system:
 * - Coordinates CSS keyframe animations with TypeScript systems
 * - Manages CSS animation variables through UnifiedCSSVariableManager
 * - Synchronizes CSS animations with music beat detection
 * - Provides performance-aware animation enabling/disabling
 * 
 * @architecture Phase 2 of CSS module refactoring
 * @performance Enables selective animation optimization based on performance mode
 */
export class CSSAnimationManager implements IVisualSystem {
  public readonly systemName = 'CSSAnimationManager';
  
  private config: Year3000Config;
  private cssVariableManager: UnifiedCSSVariableManager;
  private animationCoordinator: EnhancedMasterAnimationCoordinator;
  private eventBus: typeof unifiedEventBus;
  
  // Animation state tracking
  private animationStates: Map<string, KineticAnimationState> = new Map();
  private activeAnimations: Map<string, Animation> = new Map();
  private animationObservers: Map<string, (animation: Animation) => void> = new Map();
  
  // Performance tracking
  private frameCount = 0;
  private lastFrameTime = 0;
  private avgFrameTime = 0;
  private performanceMode: 'performance' | 'quality' = 'quality';
  
  // Beat sync state
  private beatSyncState = {
    intensity: 0,
    tempo: 120,
    phase: 0,
    lastBeatTime: 0,
    avgBeatInterval: 500,
  };
  
  // Visual effects animation state for Advanced Theme System integration with LERP smoothing
  private animationState = {
    currentType: 'gentle' as 'gentle' | 'energetic' | 'meditative' | 'cosmic',
    activeElements: new Set<Element>(),
    currentAnimation: null as Animation | null,
    lastEnergyLevel: 0.5,
    lastTempoChange: 0,
    // LERP smoothing for animation transitions
    targetEnergyLevel: 0.5,
    smoothedEnergyLevel: 0.5,
    targetTempo: 120,
    smoothedTempo: 120,
    lastFrameTime: 0,
    energyHalfLife: 0.3, // 300ms half-life for energy transitions
    tempoHalfLife: 0.8,  // 800ms half-life for tempo transitions
  };
  
  // Animation configuration
  private readonly ANIMATION_CONFIGS: Record<string, CSSAnimationConfig> = {
    // Visual effects animations for Advanced Theme System performance
    visualEffectsGentleBreathing: {
      name: 'visualEffects-gentle-animation',
      duration: 4000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    visualEffectsEnergeticBreathing: {
      name: 'visualEffects-energetic-animation',
      duration: 2500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    visualEffectsMeditativeBreathing: {
      name: 'visualEffects-meditative-animation',
      duration: 6000,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    visualEffectsCosmicBreathing: {
      name: 'visualEffects-cosmic-animation',
      duration: 3000,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    bloom: {
      name: 'advanced-bloom',
      duration: 1500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    ripple: {
      name: 'advanced-ripple',
      duration: 1200,
      easing: 'ease-out',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    oscillate: {
      name: 'advanced-oscillate',
      duration: 4000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    harmonize: {
      name: 'advanced-harmonize-flow',
      duration: 8000,
      easing: 'linear',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    refract: {
      name: 'advanced-refract',
      duration: 800,
      easing: 'ease-in-out',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    timeBasedEcho: {
      name: 'advanced-echo-core',
      duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    gravity: {
      name: 'advanced-gravity-pull',
      duration: 1000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
  };
  
  constructor(
    config: Year3000Config,
    cssVariableManager: UnifiedCSSVariableManager,
    animationCoordinator: EnhancedMasterAnimationCoordinator
  ) {
    this.config = config;
    this.cssVariableManager = cssVariableManager;
    this.animationCoordinator = animationCoordinator;
    this.eventBus = unifiedEventBus;
    
    // Initialize default animation state
    this.initializeDefaultState();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Register with animation coordinator
    this.animationCoordinator.registerVisualSystem(this, 'normal');
    
    // Initialize LERP smoothing timestamps
    this.animationState.lastFrameTime = performance.now();
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] Initialized with CSS animation coordination and LERP-smoothed animation transitions');
    }
  }
  
  /**
   * Update CSS animation variables based on beat sync
   */
  public onAnimate(deltaMs: number, context: FrameContext): void {
    this.frameCount++;
    this.lastFrameTime = deltaMs;
    this.avgFrameTime = this.avgFrameTime * 0.9 + deltaMs * 0.1;
    
    // Update performance mode
    this.updatePerformanceMode(context.performanceMode);
    
    // Update beat sync if available
    if (context.beatIntensity !== undefined) {
      this.updateBeatSyncState(context.beatIntensity, context.timestamp);
    }
    
    // Update LERP-smoothed animation values for seamless transitions
    const deltaTimeSeconds = deltaMs / 1000; // Convert to seconds for LERP
    this.updateBreathingLerpValues(deltaTimeSeconds);
    
    // Update animation variables
    this.updateAnimationVariables(context);
    
    // Update active animations
    this.updateActiveAnimations(context);
    
    // Performance tracking
    if (this.frameCount % 60 === 0) {
      this.reportPerformanceMetrics();
    }
  }
  
  /**
   * Handle performance mode changes
   */
  public onPerformanceModeChange(mode: 'performance' | 'quality'): void {
    this.performanceMode = mode;
    
    // Update animation quality based on performance mode
    this.updateAnimationQuality(mode);
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Performance mode changed to: ${mode}`);
    }
  }
  
  /**
   * Trigger a kinetic animation on elements
   */
  public triggerKineticAnimation(
    elements: NodeListOf<Element> | Element[],
    animationType: keyof typeof this.ANIMATION_CONFIGS,
    options?: Partial<CSSAnimationConfig>
  ): void {
    const config = { ...this.ANIMATION_CONFIGS[animationType], ...options };
    
    Array.from(elements).forEach((element, index) => {
      // Apply staggered delay for multiple elements
      const staggeredDelay = (config.delay || 0) + (index * 50);
      
      // Create CSS animation
      const animationOptions: KeyframeAnimationOptions = {
        duration: config.duration || 1000,
        easing: config.easing || 'ease-in-out',
        iterations: config.iterations === 'infinite' ? Infinity : (config.iterations || 1),
        fill: config.fillMode || 'forwards' as FillMode,
        delay: staggeredDelay,
        direction: config.direction || 'normal' as PlaybackDirection,
      };
      
      const animation = element.animate([], animationOptions);
      
      // Track animation
      const animationId = `${animationType}_${Date.now()}_${index}`;
      this.activeAnimations.set(animationId, animation);
      
      // Clean up when animation finishes
      animation.addEventListener('finish', () => {
        this.activeAnimations.delete(animationId);
        element.classList.remove(`sn-${animationType}-active`);
      });
      
      // Add CSS class for styling
      element.classList.add(`sn-${animationType}-active`);
    });
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Triggered ${animationType} animation on ${elements.length} elements`);
    }
  }
  
  /**
   * Enable beat-synchronized animations
   */
  public enableBeatSync(enable: boolean = true): void {
    // Update all animation states
    for (const [elementId, state] of this.animationStates) {
      state.beatSyncEnabled = enable;
      this.animationStates.set(elementId, state);
    }
    
    // Update CSS variables
    this.cssVariableManager.updateMusicVariables({
      'beat.pulse.intensity': enable ? this.beatSyncState.intensity : 0,
    });
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Beat sync ${enable ? 'enabled' : 'disabled'}`);
    }
  }
  
  /**
   * Set global animation intensity
   */
  public setAnimationIntensity(intensity: number): void {
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    // Update all animation states
    for (const [elementId, state] of this.animationStates) {
      state.intensityLevel = clampedIntensity;
      this.animationStates.set(elementId, state);
    }
    
    // Update CSS variables
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': clampedIntensity,
    });
    
    this.cssVariableManager.updateMusicVariables({
      'beat.pulse.intensity': clampedIntensity,
    });
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Animation intensity set to: ${clampedIntensity}`);
    }
  }
  
  /**
   * Pause all CSS animations
   */
  public pauseAllAnimations(): void {
    for (const animation of this.activeAnimations.values()) {
      animation.pause();
    }
    
    // Update CSS variables
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': 0,
    });
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] All animations paused');
    }
  }
  
  /**
   * Resume all CSS animations
   */
  public resumeAllAnimations(): void {
    for (const animation of this.activeAnimations.values()) {
      animation.play();
    }
    
    // Restore CSS variables
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': 1,
    });
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] All animations resumed');
    }
  }
  
  /**
   * LERP smoothing utility for framerate-independent animation transitions
   * Based on Rory Driscoll's frame rate independent damping using lerp
   */
  private lerpSmooth(current: number, target: number, deltaTime: number, halfLife: number): number {
    const EPSILON = 0.00001;
    if (halfLife <= EPSILON || deltaTime <= 0) {
      return target;
    }
    return target + (current - target) * Math.pow(2, -deltaTime / halfLife);
  }

  /**
   * Update LERP-smoothed animation values for seamless transitions
   */
  private updateBreathingLerpValues(deltaTime: number): void {
    // Apply LERP smoothing to energy level changes
    this.animationState.smoothedEnergyLevel = this.lerpSmooth(
      this.animationState.smoothedEnergyLevel,
      this.animationState.targetEnergyLevel,
      deltaTime,
      this.animationState.energyHalfLife
    );

    // Apply LERP smoothing to tempo changes
    this.animationState.smoothedTempo = this.lerpSmooth(
      this.animationState.smoothedTempo,
      this.animationState.targetTempo,
      deltaTime,
      this.animationState.tempoHalfLife
    );
  }

  /**
   * Trigger visual effects animation based on music energy
   * Advanced Theme System CSS-first animation with LERP smoothing
   */
  public triggerVisualEffectsAnimation(
    elements: NodeListOf<Element> | Element[],
    energyLevel: number = 0.5,
    tempo: number = 120
  ): void {
    // Update target values for LERP smoothing
    this.animationState.targetEnergyLevel = energyLevel;
    this.animationState.targetTempo = tempo;
    
    // Use smoothed values for animation type selection for natural transitions
    const smoothedEnergy = this.animationState.smoothedEnergyLevel;
    const smoothedTempo = this.animationState.smoothedTempo;
    const animationType = this.selectBreathingType(smoothedEnergy, smoothedTempo);
    
    // Stop current animation animation if active
    if (this.animationState.currentAnimation) {
      this.animationState.currentAnimation.cancel();
    }
    
    // Clear previous animation classes
    this.animationState.activeElements.forEach(element => {
      element.classList.remove(
        'visualEffects-gentle-animation',
        'visualEffects-energetic-animation', 
        'visualEffects-meditative-animation',
        'visualEffects-cosmic-animation'
      );
    });
    
    // Update animation state
    this.animationState.currentType = animationType;
    this.animationState.lastEnergyLevel = smoothedEnergy;
    this.animationState.lastTempoChange = Date.now();
    this.animationState.activeElements.clear();
    
    // Apply new animation animation
    Array.from(elements).forEach(element => {
      this.animationState.activeElements.add(element);
      element.classList.add(`visualEffects-${animationType}-animation`);
    });
    
    // Update CSS variables for animation synchronization using smoothed values
    this.updateBreathingVariables(animationType, smoothedEnergy, smoothedTempo);
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] LERP-smoothed visual effects: ${animationType} (raw: ${energyLevel.toFixed(2)}→${smoothedEnergy.toFixed(2)}, tempo: ${tempo}→${smoothedTempo.toFixed(1)})`);
    }
  }
  
  /**
   * Select animation type based on music energy and tempo
   */
  private selectBreathingType(energyLevel: number, tempo: number): 'gentle' | 'energetic' | 'meditative' | 'cosmic' {
    // Performance-aware animation type selection
    if (this.performanceMode === 'performance' && energyLevel > 0.7) {
      // Limit to gentle/meditative in performance mode for high energy
      return energyLevel > 0.8 ? 'gentle' : 'meditative';
    }
    
    // Energy-based selection with tempo influence
    if (energyLevel < 0.3) {
      return 'meditative'; // Low energy = calm animation
    } else if (energyLevel > 0.7 && tempo > 140) {
      return 'cosmic'; // High energy + fast tempo = cosmic animation  
    } else if (energyLevel > 0.6) {
      return 'energetic'; // High energy = energetic animation
    } else {
      return 'gentle'; // Default = gentle animation
    }
  }
  
  /**
   * Update CSS variables for animation coordination
   */
  private updateBreathingVariables(
    animationType: string, 
    energyLevel: number, 
    tempo: number
  ): void {
    const duration = this.calculateBreathingDuration(animationType, tempo);
    const intensity = Math.max(0.05, Math.min(1.0, energyLevel));
    
    // Update visualEffects animation variables
    this.cssVariableManager.updateVisualEffectsVariables({
      'animation.type': animationType,
      'animation.duration': `${duration}ms`,
      'animation.intensity': intensity,
      'animation.energy': energyLevel,
    });
    
    // Update music-responsive variables
    this.cssVariableManager.updateMusicVariables({
      'tempo.bpm': tempo,
      'energy.level': energyLevel,
      'animation.sync': 1, // Enable animation synchronization
    });
  }
  
  /**
   * Calculate animation duration based on type and tempo
   */
  private calculateBreathingDuration(animationType: string, tempo: number): number {
    const baseDurations = {
      gentle: 4000,
      energetic: 2500, 
      meditative: 6000,
      cosmic: 3000,
    };
    
    const baseDuration = baseDurations[animationType as keyof typeof baseDurations] || 4000;
    
    // Adjust duration based on tempo (faster tempo = faster animation)
    const tempoMultiplier = Math.max(0.5, Math.min(2.0, 120 / tempo));
    
    return Math.round(baseDuration * tempoMultiplier);
  }
  
  /**
   * Stop visual effects animations
   */
  public stopVisualEffectsAnimation(): void {
    if (this.animationState.currentAnimation) {
      this.animationState.currentAnimation.cancel();
      this.animationState.currentAnimation = null;
    }
    
    // Remove animation classes from all active elements
    this.animationState.activeElements.forEach(element => {
      element.classList.remove(
        'visualEffects-gentle-animation',
        'visualEffects-energetic-animation',
        'visualEffects-meditative-animation', 
        'visualEffects-cosmic-animation'
      );
    });
    
    this.animationState.activeElements.clear();
    
    // Reset CSS variables
    this.cssVariableManager.updateVisualEffectsVariables({
      'animation.sync': 0,
    });
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] Visual effects animation stopped');
    }
  }

  /**
   * Get animation performance metrics
   */
  public getPerformanceMetrics(): {
    frameCount: number;
    avgFrameTime: number;
    activeAnimations: number;
    performanceMode: string;
  } {
    return {
      frameCount: this.frameCount,
      avgFrameTime: this.avgFrameTime,
      activeAnimations: this.activeAnimations.size,
      performanceMode: this.performanceMode,
    };
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    // Cancel all active animations
    for (const animation of this.activeAnimations.values()) {
      animation.cancel();
    }
    
    this.activeAnimations.clear();
    this.animationStates.clear();
    this.animationObservers.clear();
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Initialize default animation state
   */
  private initializeDefaultState(): void {
    const defaultState: KineticAnimationState = {
      rippleActive: false,
      bloomActive: false,
      refractActive: false,
      oscillateActive: false,
      harmonizeActive: false,
      timeBasedEchoActive: false,
      gravityActive: false,
      beatSyncEnabled: true,
      intensityLevel: 1,
      tempoMultiplier: 1,
    };
    
    this.animationStates.set('default', defaultState);
  }
  
  /**
   * Subscribe to relevant events
   */
  private subscribeToEvents(): void {
    // Subscribe to beat events
    this.eventBus.subscribe('music:beat', (payload: { intensity?: number; phase?: number; energy?: number }) => {
      this.handleBeatEvent(payload);
    }, 'CSSAnimationManager');
    
    // Subscribe to music energy changes (includes tempo)
    this.eventBus.subscribe('music:energy', (payload: { energy: number; valence: number; tempo: number; timestamp: number }) => {
      this.handleTempoChange({ bpm: payload.tempo });
    }, 'CSSAnimationManager');
    
    // Subscribe to settings changes for animation quality
    this.eventBus.subscribe('settings:changed', (event: any) => {
      if (event.settingKey === 'sn-animation-quality') {
        this.handleAnimationQualityChange(event.newValue);
      }
    }, 'CSSAnimationManager');
    
    // Subscribe to performance events  
    this.eventBus.subscribe('performance:frame', (payload: { deltaTime: number; fps: number; memoryUsage: number; timestamp: number }) => {
      // Determine performance mode based on fps
      const mode = payload.fps < 45 ? 'performance' : 'quality';
      this.onPerformanceModeChange(mode);
    }, 'CSSAnimationManager');
  }
  
  /**
   * Handle beat events for synchronization
   */
  private handleBeatEvent(payload: { intensity?: number; phase?: number; energy?: number }): void {
    const currentTime = performance.now();
    const timeSinceLastBeat = currentTime - this.beatSyncState.lastBeatTime;
    
    // Update beat sync state
    this.beatSyncState.intensity = payload.intensity || 0;
    this.beatSyncState.phase = payload.phase || 0;
    this.beatSyncState.lastBeatTime = currentTime;
    
    // Calculate average beat interval
    if (timeSinceLastBeat > 0 && timeSinceLastBeat < 2000) {
      this.beatSyncState.avgBeatInterval = 
        this.beatSyncState.avgBeatInterval * 0.9 + timeSinceLastBeat * 0.1;
    }
    
    // Update CSS variables for beat sync
    this.cssVariableManager.updateMusicVariables({
      'beat.pulse.intensity': this.beatSyncState.intensity,
      'beat.phase': this.beatSyncState.phase,
    });
    
    // Trigger visual effects animation based on music energy (Advanced Theme System CSS-first integration)
    if (payload.energy !== undefined) {
      const energyLevel = payload.energy;
      const tempo = this.beatSyncState.tempo;
      
      // Only update animation if energy level changed significantly or tempo changed
      const energyDelta = Math.abs(energyLevel - this.animationState.lastEnergyLevel);
      const timeSinceTempoChange = currentTime - this.animationState.lastTempoChange;
      
      if (energyDelta > 0.15 || timeSinceTempoChange > 5000) { // 5 second tempo check interval
        const visualEffectsElements = document.querySelectorAll('.Root__main-view::before, .Root__main-view, [data-visualEffects-animation]');
        if (visualEffectsElements.length > 0) {
          this.triggerVisualEffectsAnimation(visualEffectsElements, energyLevel, tempo);
        }
      }
    }
  }
  
  /**
   * Handle tempo changes
   */
  private handleTempoChange(payload: { bpm?: number }): void {
    const newTempo = payload.bpm || 120;
    this.beatSyncState.tempo = newTempo;
    
    // Update tempo multiplier for animations
    const tempoMultiplier = newTempo / 120; // Normalize to 120 BPM
    
    // Update CSS variables
    this.cssVariableManager.updateMusicVariables({
      'tempo.bpm': newTempo,
    });
    
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': tempoMultiplier,
    });
    
    // Update all animation states
    for (const [elementId, state] of this.animationStates) {
      state.tempoMultiplier = tempoMultiplier;
      this.animationStates.set(elementId, state);
    }
  }
  
  /**
   * Update beat sync state
   */
  private updateBeatSyncState(intensity: number, timestamp: number): void {
    this.beatSyncState.intensity = intensity;
    this.beatSyncState.lastBeatTime = timestamp;
    
    // Update CSS variables for beat sync
    this.cssVariableManager.updateMusicVariables({
      'beat.pulse.intensity': intensity,
    });
  }
  
  /**
   * Update animation variables based on frame context
   */
  private updateAnimationVariables(context: FrameContext): void {
    // Update frame-based variables
    this.cssVariableManager.updateAnimationVariables({
      'frame.fps': Math.round(1000 / context.deltaMs),
      'frame.budget': `${context.frameBudget}ms`,
    });
    
    // Update visualEffects variables if available
    if (context.tiltXY) {
      this.cssVariableManager.updateVisualEffectsVariables({
        'hover.pull': `${Math.abs(context.tiltXY.x) + Math.abs(context.tiltXY.y)}px`,
      });
    }
  }
  
  /**
   * Update active animations based on context
   */
  private updateActiveAnimations(context: FrameContext): void {
    // Throttle updates for performance
    if (context.timestamp - this.lastFrameTime < 16) return;
    
    // Update animation playback rates based on performance mode
    const playbackRate = this.performanceMode === 'performance' ? 0.7 : 1.0;
    
    for (const animation of this.activeAnimations.values()) {
      if (animation.playbackRate !== playbackRate) {
        animation.playbackRate = playbackRate;
      }
    }
  }
  
  /**
   * Handle animation quality setting changes from user
   */
  private handleAnimationQualityChange(qualitySetting: 'auto' | 'low' | 'high'): void {
    let qualityLevel: number;
    
    // Map user setting to quality level following layered enhancement philosophy
    switch (qualitySetting) {
      case 'low':
        qualityLevel = 0.4; // Lower quality animations
        break;
      case 'high':
        qualityLevel = 1.0; // Full quality animations
        break;
      case 'auto':
      default:
        // Auto mode uses performance-based quality (existing behavior)
        qualityLevel = this.performanceMode === 'performance' ? 0.6 : 1.0;
        break;
    }
    
    this.applyQualityLevel(qualityLevel);
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Animation quality set to: ${qualitySetting} (level: ${qualityLevel})`);
    }
  }
  
  /**
   * Update animation quality based on performance mode (legacy method for auto mode)
   */
  private updateAnimationQuality(mode: 'performance' | 'quality'): void {
    // This method is now used only when in 'auto' mode
    const qualityLevel = mode === 'performance' ? 0.6 : 1.0;
    this.applyQualityLevel(qualityLevel);
  }
  
  /**
   * Apply quality level to animations (layered enhancement approach)
   */
  private applyQualityLevel(qualityLevel: number): void {
    // Determine effective performance mode based on quality level
    const effectiveMode = qualityLevel < 0.5 ? 'performance' : 'quality';
    
    // Update CSS variables
    this.cssVariableManager.updatePerformanceVariables({
      'quality.level': qualityLevel,
      'mode': effectiveMode,
    });
    
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': qualityLevel,
    });
    
    // Disable complex animations in low quality mode
    if (qualityLevel < 0.5) {
      this.cssVariableManager.updateUtilityVariables({
        'feature.animations.enabled': false,
      });
    } else {
      this.cssVariableManager.updateUtilityVariables({
        'feature.animations.enabled': true,
      });
    }
  }
  
  /**
   * Update performance mode
   */
  private updatePerformanceMode(mode: 'performance' | 'quality'): void {
    if (this.performanceMode !== mode) {
      this.performanceMode = mode;
      this.updateAnimationQuality(mode);
    }
  }
  
  /**
   * Report performance metrics
   */
  private reportPerformanceMetrics(): void {
    const metrics = this.getPerformanceMetrics();
    
    // Emit performance event
    this.eventBus.emit('performance:frame', {
      deltaTime: metrics.avgFrameTime,
      fps: Math.round(1000 / metrics.avgFrameTime),
      memoryUsage: 0, // Would need actual memory measurement
      timestamp: Date.now(),
    });
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Performance - FPS: ${Math.round(1000 / metrics.avgFrameTime)}, Active: ${metrics.activeAnimations}`);
    }
  }
  
  // =========================================================================
  // BACKWARD COMPATIBILITY METHODS
  // =========================================================================
  
  /**
   * @deprecated Use triggerVisualEffectsAnimation instead
   */
  public triggerConsciousnessBreathing(elements: NodeListOf<Element> | Element[], energyLevel: number = 0.5, tempo: number = 120): void {
    return this.triggerVisualEffectsAnimation(elements, energyLevel, tempo);
  }
  
  /**
   * @deprecated Use stopVisualEffectsAnimation instead
   */  
  public stopConsciousnessBreathing(): void {
    return this.stopVisualEffectsAnimation();
  }
}