import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import { SidebarPerformanceCoordinator } from './SidebarPerformanceCoordinator';
import type { HealthCheckResult } from '@/types/systems';
import type { Year3000Config } from '@/types/models';

interface BeatPayload {
  intensity: number; // 0‒1 range
  timestamp?: number;
}

interface EnergyPayload {
  energy: number; // 0‒1 range
  timestamp?: number;
}

/**
 * RightSidebarConsciousnessSystem - Unified Implementation
 * 
 * Migrated from BaseVisualSystem to UnifiedSystemBase architecture.
 * Provides real-time gradient animation for the right sidebar with:
 * - Music beat and energy synchronization
 * - Performance-optimized CSS variable batching
 * - Smooth lerp-based animations
 * - Health monitoring and diagnostics
 * 
 * @architecture Phase 1 migrated system
 * @performance Target <1ms per frame
 */
export class RightSidebarConsciousnessSystemUnified extends UnifiedSystemBase {
  private coordinator: SidebarPerformanceCoordinator;
  
  // Current → target state for smooth lerp
  private currentBeatIntensity = 0;
  private targetBeatIntensity = 0;
  private currentHueShift = 0; // degrees
  private targetHueShift = 0;
  
  // Lerp smoothing factors
  private readonly INTENSITY_LERP = 0.25;
  private readonly HUE_LERP = 0.05;
  
  // Performance tracking
  private lastTimestamp = performance.now();
  private animationFrameCount = 0;
  private totalAnimationTime = 0;
  
  constructor(config?: Year3000Config, coordinator?: SidebarPerformanceCoordinator) {
    super(config);
    
    // Initialize coordinator (injected or singleton)
    this.coordinator = coordinator || SidebarPerformanceCoordinator.getInstance({
      enableDebug: this.config.enableDebug,
      onFlushComplete: () => {
        this.performanceAnalyzer?.emitTrace?.(
          "[RightSidebarConsciousnessSystemUnified] Coordinator flush completed"
        );
      },
    });
  }
  
  /**
   * Initialize the system and subscribe to music events
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log('[RightSidebarConsciousnessSystemUnified] Initializing...');
    }
    
    // Register CSS variable groups with appropriate priorities
    this.registerCSSVariableGroup('ui-state', 'high');
    this.registerCSSVariableGroup('visual-effects', 'normal');
    
    // Subscribe to music events
    this.subscribeToEvent<BeatPayload>('music:beat', (payload) => this._handleBeat(payload));
    this.subscribeToEvent<EnergyPayload>('music:energy', (payload) => this._handleEnergy(payload));
    
    // Register with animation coordinator
    this.registerAnimation(60); // 60fps priority
    
    if (this.config.enableDebug) {
      console.log('[RightSidebarConsciousnessSystemUnified] Initialized successfully');
    }
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log('[RightSidebarConsciousnessSystemUnified] Destroying...');
    }
    
    // Event unsubscription is handled automatically by UnifiedSystemBase
    
    if (this.config.enableDebug) {
      console.log('[RightSidebarConsciousnessSystemUnified] Destroyed successfully');
    }
  }
  
  /**
   * Animation frame callback
   */
  onAnimate(deltaTime: number): void {
    this.trackPerformance('animate', () => {
      const startTime = performance.now();
      
      // Update animation state
      this._updateAnimationState(deltaTime);
      
      // Apply CSS variable updates
      this._applyCSSVariables();
      
      // Track performance
      const frameTime = performance.now() - startTime;
      this.totalAnimationTime += frameTime;
      this.animationFrameCount++;
      
      if (frameTime > 1.0 && this.config.enableDebug) {
        console.warn(`[RightSidebarConsciousnessSystemUnified] Frame took ${frameTime.toFixed(2)}ms (budget: 1ms)`);
      }
    });
  }
  
  /**
   * Health check implementation
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    // Check if coordinator is available
    if (!this.coordinator) {
      issues.push('SidebarPerformanceCoordinator not available');
    }
    
    // Check animation performance
    const avgFrameTime = this.animationFrameCount > 0 ? 
      this.totalAnimationTime / this.animationFrameCount : 0;
    
    if (avgFrameTime > 1.0) {
      issues.push(`Average frame time ${avgFrameTime.toFixed(2)}ms exceeds 1ms budget`);
    }
    
    // Check CSS variable system
    if (!this.cssVariableBatcher) {
      issues.push('CSS variable batcher not available');
    }
    
    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: `System health: ${issues.length === 0 ? 'healthy' : 'issues detected'}`,
      issues: issues,
      system: 'RightSidebarConsciousnessSystemUnified'
    };
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Handle beat events from music system
   */
  private _handleBeat(payload: BeatPayload): void {
    this.targetBeatIntensity = payload.intensity;
    
    if (this.config.enableDebug) {
      console.log(`[RightSidebarConsciousnessSystemUnified] Beat intensity: ${payload.intensity}`);
    }
  }
  
  /**
   * Handle energy events from music system
   */
  private _handleEnergy(payload: EnergyPayload): void {
    // Map energy to hue shift (0-360 degrees)
    this.targetHueShift = payload.energy * 360;
    
    if (this.config.enableDebug) {
      console.log(`[RightSidebarConsciousnessSystemUnified] Energy hue shift: ${this.targetHueShift.toFixed(1)}°`);
    }
  }
  
  /**
   * Update animation state with smooth lerping
   */
  private _updateAnimationState(deltaTime: number): void {
    // Smooth lerp towards target values
    this.currentBeatIntensity += (this.targetBeatIntensity - this.currentBeatIntensity) * this.INTENSITY_LERP;
    this.currentHueShift += (this.targetHueShift - this.currentHueShift) * this.HUE_LERP;
    
    // Clamp values to safe ranges
    this.currentBeatIntensity = Math.max(0, Math.min(1, this.currentBeatIntensity));
    this.currentHueShift = this.currentHueShift % 360;
    
    this.lastTimestamp = performance.now();
  }
  
  /**
   * Apply CSS variables using the unified system with priority-based groups
   */
  private _applyCSSVariables(): void {
    // High priority UI state variables
    this.updateCSSVariableGroup('ui-state', {
      '--sn-sidebar-beat-intensity': this.currentBeatIntensity.toFixed(3),
      '--sn-sidebar-consciousness-level': (this.currentBeatIntensity * 0.8 + 0.2).toFixed(3),
    });
    
    // Normal priority visual effects
    this.updateCSSVariableGroup('visual-effects', {
      '--sn-sidebar-hue-shift': `${this.currentHueShift.toFixed(1)}deg`,
      '--sn-sidebar-energy-pulse': Math.sin(this.currentBeatIntensity * Math.PI * 2).toFixed(3)
    });
    
    // Also update through the coordinator for compatibility
    this.coordinator.queueUpdate('--sn-sidebar-beat-intensity', this.currentBeatIntensity.toFixed(3));
    this.coordinator.queueUpdate('--sn-sidebar-hue-shift', `${this.currentHueShift.toFixed(1)}deg`);
  }
  
  /**
   * Get current system metrics for debugging
   */
  public getMetrics(): {
    beatIntensity: number;
    hueShift: number;
    averageFrameTime: number;
    frameCount: number;
  } {
    return {
      beatIntensity: this.currentBeatIntensity,
      hueShift: this.currentHueShift,
      averageFrameTime: this.animationFrameCount > 0 ? 
        this.totalAnimationTime / this.animationFrameCount : 0,
      frameCount: this.animationFrameCount
    };
  }
  
  /**
   * Force repaint for settings changes
   */
  public override forceRepaint(reason?: string): void {
    super.forceRepaint(reason);
    
    // Reset animation state
    this.currentBeatIntensity = 0;
    this.targetBeatIntensity = 0;
    this.currentHueShift = 0;
    this.targetHueShift = 0;
    
    // Force CSS update
    this._applyCSSVariables();
    
    if (this.config.enableDebug) {
      console.log(`[RightSidebarConsciousnessSystemUnified] Force repaint: ${reason}`);
    }
  }
}