import { CSSAnimationManager } from './CSSAnimationManager';
import { EnhancedMasterAnimationCoordinator } from './EnhancedMasterAnimationCoordinator';
import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import type { Year3000Config } from '@/types/models';

/**
 * CSSAnimationIntegration - Phase 2 CSS Animation Integration
 * 
 * Provides a unified interface for integrating CSS animations with the Year3000System:
 * - Manages CSSAnimationManager lifecycle
 * - Coordinates between CSS animations and TypeScript systems
 * - Provides convenient methods for triggering animations
 * - Handles performance optimization and degradation
 * 
 * @architecture Phase 2 of CSS module refactoring
 * @performance Optimizes CSS animation performance through unified coordination
 */
export class CSSAnimationIntegration {
  private static instance: CSSAnimationIntegration | null = null;
  
  private config: Year3000Config;
  private cssAnimationManager: CSSAnimationManager | null = null;
  private animationCoordinator: EnhancedMasterAnimationCoordinator | null = null;
  private cssConsciousnessController: UnifiedCSSVariableManager | null = null;
  private eventBus: typeof unifiedEventBus;
  
  private initialized = false;
  
  constructor(config: Year3000Config) {
    this.config = config;
    this.eventBus = unifiedEventBus;
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationIntegration] Created');
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: Year3000Config): CSSAnimationIntegration {
    if (!CSSAnimationIntegration.instance) {
      if (!config) {
        throw new Error('CSSAnimationIntegration requires config for first initialization');
      }
      CSSAnimationIntegration.instance = new CSSAnimationIntegration(config);
    }
    return CSSAnimationIntegration.instance;
  }
  
  /**
   * Initialize the CSS animation integration
   */
  public initialize(
    cssConsciousnessController: UnifiedCSSVariableManager,
    animationCoordinator: EnhancedMasterAnimationCoordinator
  ): void {
    if (this.initialized) return;
    
    this.cssConsciousnessController = cssConsciousnessController;
    this.animationCoordinator = animationCoordinator;
    
    // Create CSS animation manager
    this.cssAnimationManager = new CSSAnimationManager(
      this.config,
      this.cssConsciousnessController,
      this.animationCoordinator
    );
    
    // Set up event listeners
    this.setupEventListeners();
    
    this.initialized = true;
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationIntegration] Initialized with unified systems');
    }
  }
  
  /**
   * Trigger bloom animation on elements
   */
  public triggerBloom(elements: NodeListOf<Element> | Element[], intensity: number = 1): void {
    if (!this.cssAnimationManager) return;
    
    // Update bloom intensity
    this.cssConsciousnessController?.updateMusicVariables({
      'beat.pulse.intensity': intensity,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'bloom', {
      duration: Math.max(800, 1500 * intensity),
    });
  }
  
  /**
   * Trigger ripple animation on elements
   */
  public triggerRipple(elements: NodeListOf<Element> | Element[], options?: {
    intensity?: number;
    duration?: number;
  }): void {
    if (!this.cssAnimationManager) return;
    
    const intensity = options?.intensity || 1;
    const duration = options?.duration || 1200;
    
    // Update ripple variables
    this.cssConsciousnessController?.updateMusicVariables({
      'spectrum.phase': intensity * 30,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'ripple', {
      duration: duration * intensity,
    });
  }
  
  /**
   * Enable/disable beat synchronization
   */
  public setBeatSyncEnabled(enabled: boolean): void {
    if (!this.cssAnimationManager) return;
    
    this.cssAnimationManager.enableBeatSync(enabled);
    
    // Update CSS variables
    this.cssConsciousnessController?.updateUtilityVariables({
      'feature.music.sync.enabled': enabled,
    });
  }
  
  /**
   * Set global animation intensity
   */
  public setAnimationIntensity(intensity: number): void {
    if (!this.cssAnimationManager) return;
    
    this.cssAnimationManager.setAnimationIntensity(intensity);
    
    // Update performance variables
    this.cssConsciousnessController?.updatePerformanceVariables({
      'quality.level': intensity,
    });
  }
  
  /**
   * Enable/disable animations based on performance mode
   */
  public setPerformanceMode(mode: 'performance' | 'quality'): void {
    if (!this.cssAnimationManager) return;
    
    this.cssAnimationManager.onPerformanceModeChange(mode);
    
    // Update performance variables
    this.cssConsciousnessController?.updatePerformanceVariables({
      'mode': mode,
    });
  }
  
  /**
   * Trigger harmonize animation for breathing/flow effects
   */
  public triggerHarmonize(elements: NodeListOf<Element> | Element[], tempo: number = 120): void {
    if (!this.cssAnimationManager) return;
    
    // Update tempo-based variables
    const tempoMultiplier = tempo / 120;
    this.cssConsciousnessController?.updateMusicVariables({
      'tempo.bpm': tempo,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'harmonize', {
      duration: 8000 / tempoMultiplier,
    });
  }
  
  /**
   * Trigger refract animation for light-bending effects
   */
  public triggerRefract(elements: NodeListOf<Element> | Element[], intensity: number = 1): void {
    if (!this.cssAnimationManager) return;
    
    // Update refract variables
    this.cssConsciousnessController?.updateColorVariables({
      'shift.hue': intensity * 15,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'refract', {
      duration: 800 * intensity,
    });
  }
  
  /**
   * Trigger temporal echo animation
   */
  public triggerTemporalEcho(elements: NodeListOf<Element> | Element[], energy: number = 1): void {
    if (!this.cssAnimationManager) return;
    
    // Update echo variables
    this.cssConsciousnessController?.updateMusicVariables({
      'energy.level': energy,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'temporalEcho', {
      duration: 800 * energy,
    });
  }
  
  /**
   * Trigger gravity animation for attention flow
   */
  public triggerGravity(elements: NodeListOf<Element> | Element[], mouseX: number, mouseY: number): void {
    if (!this.cssAnimationManager) return;
    
    // Update gravity variables
    this.cssConsciousnessController?.updateConsciousnessVariables({
      'hover.pull': `${Math.abs(mouseX - 0.5) * 20}px`,
      'focus.pull': `${Math.abs(mouseY - 0.5) * 20}px`,
    });
    
    // Trigger animation
    this.cssAnimationManager.triggerKineticAnimation(elements, 'gravity');
  }
  
  /**
   * Pause all CSS animations
   */
  public pauseAllAnimations(): void {
    if (!this.cssAnimationManager) return;
    
    this.cssAnimationManager.pauseAllAnimations();
  }
  
  /**
   * Resume all CSS animations
   */
  public resumeAllAnimations(): void {
    if (!this.cssAnimationManager) return;
    
    this.cssAnimationManager.resumeAllAnimations();
  }
  
  /**
   * Get animation performance metrics
   */
  public getPerformanceMetrics(): any {
    if (!this.cssAnimationManager) return null;
    
    return this.cssAnimationManager.getPerformanceMetrics();
  }
  
  /**
   * Check if initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Destroy the integration
   */
  public destroy(): void {
    if (this.cssAnimationManager) {
      this.cssAnimationManager.destroy();
      this.cssAnimationManager = null;
    }
    
    this.initialized = false;
    
    if (CSSAnimationIntegration.instance === this) {
      CSSAnimationIntegration.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[CSSAnimationIntegration] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Set up event listeners for animation coordination
   */
  private setupEventListeners(): void {
    // Listen for beat events to trigger animations
    this.eventBus.subscribe('music:beat', (payload: any) => {
      if (payload.intensity > 0.7) {
        // Trigger bloom on high-intensity beats
        const activeElements = document.querySelectorAll('.sn-beat-responsive');
        if (activeElements.length > 0) {
          this.triggerBloom(activeElements, payload.intensity);
        }
      }
    }, 'CSSAnimationIntegration');
    
    // Listen for performance warnings
    this.eventBus.subscribe('performance:frame', () => {
      this.setPerformanceMode('performance');
    }, 'CSSAnimationIntegration');
    
    this.eventBus.subscribe('performance:frame', () => {
      this.setPerformanceMode('quality');
    }, 'CSSAnimationIntegration');
    
    // Listen for user interactions
    this.eventBus.subscribe('settings:changed', (payload: any) => {
      if (payload.element) {
        this.triggerGravity([payload.element], payload.mouseX || 0.5, payload.mouseY || 0.5);
      }
    }, 'CSSAnimationIntegration');
    
    this.eventBus.subscribe('settings:changed', (payload: any) => {
      if (payload.element) {
        this.triggerRipple([payload.element], { intensity: 0.8 });
      }
    }, 'CSSAnimationIntegration');
    
    // Listen for color changes
    this.eventBus.subscribe('colors:extracted', (payload: any) => {
      if (payload.rawColors) {
        // Trigger refract on color changes
        const colorElements = document.querySelectorAll('.sn-color-responsive');
        if (colorElements.length > 0) {
          this.triggerRefract(colorElements, 0.6);
        }
      }
    }, 'CSSAnimationIntegration');
    
    // Listen for consciousness field changes
    this.eventBus.subscribe('emotion:analyzed', (payload: any) => {
      if (payload.emotion && payload.emotion.intensity > 0.5) {
        // Trigger temporal echo on consciousness changes
        const consciousnessElements = document.querySelectorAll('.sn-consciousness-responsive');
        if (consciousnessElements.length > 0) {
          this.triggerTemporalEcho(consciousnessElements, payload.emotion.intensity);
        }
      }
    }, 'CSSAnimationIntegration');
  }
}