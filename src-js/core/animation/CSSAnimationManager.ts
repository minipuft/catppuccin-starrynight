import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';
import { EnhancedMasterAnimationCoordinator, type IVisualSystem, type FrameContext } from './EnhancedMasterAnimationCoordinator';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { Year3000Config } from '@/types/models';

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
  temporalEchoActive: boolean;
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
  private eventBus: typeof GlobalEventBus;
  
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
  
  // Animation configuration
  private readonly ANIMATION_CONFIGS: Record<string, CSSAnimationConfig> = {
    bloom: {
      name: 'year3000-bloom',
      duration: 1500,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    ripple: {
      name: 'year3000-ripple',
      duration: 1200,
      easing: 'ease-out',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    oscillate: {
      name: 'year3000-oscillate',
      duration: 4000,
      easing: 'ease-in-out',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    harmonize: {
      name: 'year3000-harmonize-flow',
      duration: 8000,
      easing: 'linear',
      iterations: 'infinite',
      fillMode: 'none' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    refract: {
      name: 'year3000-refract',
      duration: 800,
      easing: 'ease-in-out',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    temporalEcho: {
      name: 'year3000-echo-core',
      duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      iterations: 1,
      fillMode: 'forwards' as FillMode,
      playState: 'running',
      delay: 0,
      direction: 'normal' as PlaybackDirection,
    },
    gravity: {
      name: 'year3000-gravity-pull',
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
    this.eventBus = GlobalEventBus;
    
    // Initialize default animation state
    this.initializeDefaultState();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Register with animation coordinator
    this.animationCoordinator.registerVisualSystem(this, 'normal');
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationManager] Initialized with CSS animation coordination');
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
      temporalEchoActive: false,
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
    this.eventBus.subscribe('music:beat', (payload: any) => {
      this.handleBeatEvent(payload);
    });
    
    // Subscribe to tempo changes
    this.eventBus.subscribe('music:tempo-change', (payload: any) => {
      this.handleTempoChange(payload);
    });
    
    // Subscribe to performance events
    this.eventBus.subscribe('performance:reduce-quality', () => {
      this.onPerformanceModeChange('performance');
    });
    
    this.eventBus.subscribe('performance:restore-quality', () => {
      this.onPerformanceModeChange('quality');
    });
  }
  
  /**
   * Handle beat events for synchronization
   */
  private handleBeatEvent(payload: any): void {
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
  }
  
  /**
   * Handle tempo changes
   */
  private handleTempoChange(payload: any): void {
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
    
    // Update consciousness variables if available
    if (context.tiltXY) {
      this.cssVariableManager.updateConsciousnessVariables({
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
   * Update animation quality based on performance mode
   */
  private updateAnimationQuality(mode: 'performance' | 'quality'): void {
    const qualityLevel = mode === 'performance' ? 0.6 : 1.0;
    
    // Update CSS variables
    this.cssVariableManager.updatePerformanceVariables({
      'quality.level': qualityLevel,
      'mode': mode,
    });
    
    this.cssVariableManager.updateAnimationVariables({
      'motion.scale': qualityLevel,
    });
    
    // Disable complex animations in performance mode
    if (mode === 'performance') {
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
    this.eventBus.publish('css-animation:performance-metrics', {
      ...metrics,
      timestamp: Date.now(),
    });
    
    if (this.config.enableDebug) {
      console.log(`[CSSAnimationManager] Performance - FPS: ${Math.round(1000 / metrics.avgFrameTime)}, Active: ${metrics.activeAnimations}`);
    }
  }
}