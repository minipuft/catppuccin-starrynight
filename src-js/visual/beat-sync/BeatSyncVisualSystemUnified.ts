import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import { GlobalEventBus } from '@/core/events/EventBus';
import type {
  BeatFlashIntensity,
  BeatSyncModeConfig,
  HarmonicData,
  HarmonicSyncState,
} from '@/types/beatSync';
import type { Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import * as Year3000Utilities from '@/utils/core/Year3000Utilities';
import { sample as sampleNoise } from '@/utils/graphics/NoiseField';

interface AudioSegment {
  start: number;
  duration: number;
  loudness_max: number;
}

interface BeatPayload {
  intensity: number;
  timestamp?: number;
  bpm?: number;
  energy?: number;
}

interface EnergyPayload {
  energy: number;
  timestamp?: number;
}

/**
 * BeatSyncVisualSystem - Unified Implementation
 * 
 * Migrated from BaseVisualSystem to UnifiedSystemBase architecture.
 * Provides real-time beat synchronization and visual effects with:
 * - Music beat and energy synchronization
 * - Performance-optimized CSS variable batching
 * - Crystalline overlay effects
 * - Temporal echo system integration
 * - Health monitoring and diagnostics
 * 
 * @architecture Phase 1 migrated system
 * @performance Target <2ms per frame, critical priority
 */
export class BeatSyncVisualSystemUnified extends UnifiedSystemBase {
  private beatFlashElement: HTMLElement | null = null;
  private crystallineOverlayElement: HTMLElement | null = null;
  public animationFrameId: number | null = null;
  private lastBeatTime: number = 0;
  private beatIntensity: number = 0;
  
  // === Temporal Echo Pool (shared logic with DataGlyphSystem) ===
  private echoPool: HTMLElement[] = [];
  private currentEchoCount: number = 0;
  private static readonly BASE_MAX_ECHOES = 6;
  private _elementsWithActiveEcho: WeakSet<HTMLElement> = new WeakSet();

  private currentBPM: number = 120;
  private enhancedBPM: number = 120;
  private beatInterval: number = 60000 / 120;
  private nextBeatTime: number = 0;
  private beatTimer: NodeJS.Timeout | null = null;
  private trackStartTime: number = Date.now();
  private isSyncActive: boolean = false;
  private beatCount: number = 0;

  private currentRhythmPhase: number = 0;
  private lastAnimationTime: number = performance.now();
  private performanceMetrics: {
    animationUpdates: number;
    cssVariableUpdates: number;
    beatFlashes: number;
    echoEffects: number;
    averageFrameTime: number;
  } = {
    animationUpdates: 0,
    cssVariableUpdates: 0,
    beatFlashes: 0,
    echoEffects: 0,
    averageFrameTime: 0,
  };

  // Beat sync configuration
  private beatSyncConfig: BeatSyncModeConfig = {
    systemEnabled: true,
    harmonicSyncEnabled: true,
    oscillateEnabled: true,
    intensityMultiplier: 0.7,
    temporalPlayEnabled: true,
  };

  // Harmonic sync state
  private harmonicSyncState: HarmonicSyncState = {
    masterFrequency: 440,
    harmonicLayers: [],
    subscribedSystems: new Set(),
    syncEventChannel: 'beat-sync',
  };

  // Custom beat sync properties
  private beatSyncIntensity: number = 0.7;
  private beatSyncMode: string = 'crystalline';
  private flashDuration: number = 200;
  private echoEnabled: boolean = true;
  private harmonicRatio: number = 1.618;
  private phaseOffset: number = 0;
  private amplitude: number = 0.5;
  private currentHarmonic: number = 1;

  constructor(config?: Year3000Config) {
    super(config);
    
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Constructor initialized');
    }
  }

  /**
   * Initialize the beat sync system
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Initializing...');
    }

    // Register CSS variable groups with appropriate priorities
    this.registerCSSVariableGroup('music-sync', 'critical');
    this.registerCSSVariableGroup('beat-effects', 'high');
    this.registerCSSVariableGroup('harmonic-sync', 'normal');

    // Create beat flash element
    this.createBeatFlashElement();
    
    // Create crystalline overlay
    this.createCrystallineOverlay();
    
    // Initialize echo pool
    this.initializeEchoPool();
    
    // Subscribe to music events
    this.subscribeToEvent<BeatPayload>('music:beat', (payload) => this._handleBeat(payload));
    this.subscribeToEvent<EnergyPayload>('music:energy', (payload) => this._handleEnergy(payload));
    this.subscribeToEvent<any>('music:bpm-change', (payload) => this._handleBPMChange(payload));
    
    // Subscribe to settings changes
    this.subscribeToEvent<any>('settings:beat-sync-mode', (payload) => this._handleBeatSyncModeChange(payload));
    this.subscribeToEvent<any>('settings:beat-sync-intensity', (payload) => this._handleBeatSyncIntensityChange(payload));
    
    // Register with animation coordinator (critical priority for beat sync)
    this.registerAnimation(60); // 60fps target
    
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Initialized successfully');
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Destroying...');
    }

    // Cancel beat timer
    if (this.beatTimer) {
      clearTimeout(this.beatTimer);
      this.beatTimer = null;
    }

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clean up DOM elements
    this.cleanupBeatFlashElement();
    this.cleanupCrystallineOverlay();
    this.cleanupEchoPool();

    // Event unsubscription is handled automatically by UnifiedSystemBase
    
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Destroyed successfully');
    }
  }

  /**
   * Animation frame callback
   */
  onAnimate(deltaTime: number): void {
    this.trackPerformance('animate', () => {
      const startTime = performance.now();
      
      // Update rhythm phase
      this._updateRhythmPhase(deltaTime);
      
      // Update beat intensity decay
      this._updateBeatIntensityDecay(deltaTime);
      
      // Update crystalline overlay
      this._updateCrystallineOverlay(deltaTime);
      
      // Update echo effects
      this._updateEchoEffects(deltaTime);
      
      // Apply CSS variables
      this._applyCSSVariables();
      
      // Track performance
      const frameTime = performance.now() - startTime;
      this.performanceMetrics.averageFrameTime = 
        (this.performanceMetrics.averageFrameTime * 0.9) + (frameTime * 0.1);
      this.performanceMetrics.animationUpdates++;
      
      if (frameTime > 2.0 && this.config.enableDebug) {
        console.warn(`[BeatSyncVisualSystemUnified] Frame took ${frameTime.toFixed(2)}ms (budget: 2ms)`);
      }
    });
  }

  /**
   * Health check implementation
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    // Check beat flash element
    if (!this.beatFlashElement) {
      issues.push('Beat flash element not available');
    }
    
    // Check crystalline overlay
    if (!this.crystallineOverlayElement) {
      issues.push('Crystalline overlay element not available');
    }
    
    // Check animation performance
    if (this.performanceMetrics.averageFrameTime > 2.0) {
      issues.push(`Average frame time ${this.performanceMetrics.averageFrameTime.toFixed(2)}ms exceeds 2ms budget`);
    }
    
    // Check beat sync activity
    if (this.isSyncActive && (Date.now() - this.lastBeatTime) > 10000) {
      issues.push('No beat activity detected in last 10 seconds');
    }
    
    // Check echo pool
    if (this.echoPool.length === 0) {
      issues.push('Echo pool not initialized');
    }
    
    const result: HealthCheckResult = {
      ok: issues.length === 0,
      details: `Beat sync health: ${issues.length === 0 ? 'healthy' : 'issues detected'}`
    };
    
    if (issues.length > 0) {
      result.issues = issues;
    }
    
    return result;
  }

  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================

  /**
   * Handle beat events from music system
   */
  private _handleBeat(payload: BeatPayload): void {
    this.beatIntensity = payload.intensity * this.beatSyncIntensity;
    this.lastBeatTime = Date.now();
    this.beatCount++;
    
    if (payload.bpm) {
      this.currentBPM = payload.bpm;
      this.beatInterval = 60000 / payload.bpm;
    }
    
    // Trigger beat flash effect
    this._triggerBeatFlash();
    
    // Trigger echo effect
    if (this.echoEnabled) {
      this._triggerEchoEffect();
    }
    
    // Update harmonic sync
    if (this.beatSyncConfig.harmonicSyncEnabled) {
      this._updateHarmonicSync();
    }
    
    this.performanceMetrics.beatFlashes++;
    
    if (this.config.enableDebug) {
      console.log(`[BeatSyncVisualSystemUnified] Beat: intensity=${payload.intensity}, bpm=${payload.bpm}`);
    }
  }

  /**
   * Handle energy events from music system
   */
  private _handleEnergy(payload: EnergyPayload): void {
    // Use energy to modulate beat sync intensity
    const energyModulation = 0.5 + (payload.energy * 0.5);
    this.beatSyncIntensity = Math.min(1.0, this.beatSyncIntensity * energyModulation);
    
    if (this.config.enableDebug) {
      console.log(`[BeatSyncVisualSystemUnified] Energy: ${payload.energy}, modulated intensity: ${this.beatSyncIntensity}`);
    }
  }

  /**
   * Handle BPM changes
   */
  private _handleBPMChange(payload: any): void {
    if (payload.bpm) {
      this.currentBPM = payload.bpm;
      this.enhancedBPM = payload.enhancedBPM || payload.bpm;
      this.beatInterval = 60000 / payload.bpm;
      
      if (this.config.enableDebug) {
        console.log(`[BeatSyncVisualSystemUnified] BPM changed to ${payload.bpm}`);
      }
    }
  }

  /**
   * Handle beat sync mode changes
   */
  private _handleBeatSyncModeChange(payload: any): void {
    if (payload.mode) {
      this.beatSyncMode = payload.mode;
      
      if (this.config.enableDebug) {
        console.log(`[BeatSyncVisualSystemUnified] Beat sync mode changed to ${payload.mode}`);
      }
    }
  }

  /**
   * Handle beat sync intensity changes
   */
  private _handleBeatSyncIntensityChange(payload: any): void {
    if (typeof payload.intensity === 'number') {
      this.beatSyncIntensity = Math.max(0, Math.min(1, payload.intensity));
      
      if (this.config.enableDebug) {
        console.log(`[BeatSyncVisualSystemUnified] Beat sync intensity changed to ${this.beatSyncIntensity}`);
      }
    }
  }

  /**
   * Create beat flash element
   */
  private createBeatFlashElement(): void {
    if (this.beatFlashElement) {
      return;
    }
    
    this.beatFlashElement = document.createElement('div');
    this.beatFlashElement.className = 'year3000-beat-flash';
    this.beatFlashElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.1s ease-out;
    `;
    
    document.body.appendChild(this.beatFlashElement);
  }

  /**
   * Create crystalline overlay
   */
  private createCrystallineOverlay(): void {
    if (this.crystallineOverlayElement) {
      return;
    }
    
    this.crystallineOverlayElement = document.createElement('div');
    this.crystallineOverlayElement.className = 'year3000-crystalline-overlay';
    this.crystallineOverlayElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999;
      background: linear-gradient(45deg, 
        transparent 0%, 
        rgba(var(--spice-rgb-accent, 168, 173, 200), 0.05) 50%, 
        transparent 100%);
      opacity: 0;
      transform: scale(1.1);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    `;
    
    document.body.appendChild(this.crystallineOverlayElement);
  }

  /**
   * Initialize echo pool
   */
  private initializeEchoPool(): void {
    this.echoPool = [];
    this.currentEchoCount = 0;
    
    for (let i = 0; i < BeatSyncVisualSystemUnified.BASE_MAX_ECHOES; i++) {
      const echo = document.createElement('div');
      echo.className = 'year3000-beat-echo';
      echo.style.cssText = `
        position: fixed;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: rgba(var(--spice-rgb-accent, 168, 173, 200), 0.1);
        pointer-events: none;
        z-index: 998;
        opacity: 0;
        transform: scale(0);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
      `;
      
      this.echoPool.push(echo);
      document.body.appendChild(echo);
    }
  }

  /**
   * Update rhythm phase
   */
  private _updateRhythmPhase(deltaTime: number): void {
    const bpmFactor = this.currentBPM / 120; // Normalized to 120 BPM
    const phaseIncrement = (deltaTime / 1000) * bpmFactor * 2 * Math.PI; // Radians per second
    
    this.currentRhythmPhase = (this.currentRhythmPhase + phaseIncrement) % (2 * Math.PI);
  }

  /**
   * Update beat intensity decay
   */
  private _updateBeatIntensityDecay(deltaTime: number): void {
    const decayRate = 0.002; // Decay per millisecond
    this.beatIntensity = Math.max(0, this.beatIntensity - (decayRate * deltaTime));
  }

  /**
   * Update crystalline overlay
   */
  private _updateCrystallineOverlay(deltaTime: number): void {
    if (!this.crystallineOverlayElement) return;
    
    const intensity = this.beatIntensity;
    const opacity = intensity * 0.3;
    const scale = 1.1 - (intensity * 0.1);
    
    this.crystallineOverlayElement.style.opacity = opacity.toString();
    this.crystallineOverlayElement.style.transform = `scale(${scale})`;
  }

  /**
   * Update echo effects
   */
  private _updateEchoEffects(deltaTime: number): void {
    // Echo effects are managed by CSS transitions
    // This method can be extended for more complex echo animations
  }

  /**
   * Trigger beat flash effect
   */
  private _triggerBeatFlash(): void {
    if (!this.beatFlashElement) return;
    
    const intensity = this.beatIntensity * this.beatSyncIntensity;
    
    // Flash effect
    this.beatFlashElement.style.opacity = intensity.toString();
    
    // Auto-fade after flash duration
    setTimeout(() => {
      if (this.beatFlashElement) {
        this.beatFlashElement.style.opacity = '0';
      }
    }, this.flashDuration);
  }

  /**
   * Trigger echo effect
   */
  private _triggerEchoEffect(): void {
    if (this.echoPool.length === 0) return;
    
    const echo = this.echoPool[this.currentEchoCount % this.echoPool.length];
    if (!echo) return;
    
    this.currentEchoCount++;
    
    // Position echo at random location
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    echo.style.left = `${x - 50}px`;
    echo.style.top = `${y - 50}px`;
    echo.style.opacity = (this.beatIntensity * 0.5).toString();
    echo.style.transform = 'scale(1)';
    
    // Auto-fade
    setTimeout(() => {
      if (echo) {
        echo.style.opacity = '0';
        echo.style.transform = 'scale(0)';
      }
    }, 500);
    
    this.performanceMetrics.echoEffects++;
  }

  /**
   * Update harmonic sync
   */
  private _updateHarmonicSync(): void {
    if (!this.beatSyncConfig.harmonicSyncEnabled) return;
    
    this.currentHarmonic = (this.currentHarmonic + 1) % 8;
    this.phaseOffset = (this.phaseOffset + (15 * Math.PI / 180)) % (2 * Math.PI);
    
    // Update harmonic frequency based on golden ratio
    const harmonicFreq = this.harmonicSyncState.masterFrequency * 
      Math.pow(this.harmonicRatio, this.currentHarmonic);
    
    // Use harmonic frequency to modulate visual effects
    const harmonicModulation = Math.sin((harmonicFreq / 1000) * Math.PI * 2);
    this.beatIntensity = Math.max(0, this.beatIntensity * (1 + harmonicModulation * 0.2));
  }

  /**
   * Apply CSS variables using the unified system with priority-based groups
   */
  private _applyCSSVariables(): void {
    // Critical music sync variables (highest priority)
    this.updateCSSVariableGroup('music-sync', {
      '--sn-beat-intensity': this.beatIntensity.toFixed(3),
      '--sn-beat-bpm': this.currentBPM.toString(),
      '--sn-beat-interval': `${this.beatInterval.toFixed(0)}ms`,
    });
    
    // High priority beat effects
    this.updateCSSVariableGroup('beat-effects', {
      '--sn-music-rhythm-phase': this.currentRhythmPhase.toFixed(4),
    });
    
    // Normal priority harmonic sync
    this.updateCSSVariableGroup('harmonic-sync', {
      '--sn-harmonic-phase': this.phaseOffset.toFixed(4),
      '--sn-harmonic-frequency': this.currentHarmonic.toString(),
    });
    
    this.performanceMetrics.cssVariableUpdates++;
  }

  /**
   * Clean up beat flash element
   */
  private cleanupBeatFlashElement(): void {
    if (this.beatFlashElement) {
      if (this.beatFlashElement.parentNode) {
        this.beatFlashElement.parentNode.removeChild(this.beatFlashElement);
      }
      this.beatFlashElement = null;
    }
  }

  /**
   * Clean up crystalline overlay
   */
  private cleanupCrystallineOverlay(): void {
    if (this.crystallineOverlayElement) {
      if (this.crystallineOverlayElement.parentNode) {
        this.crystallineOverlayElement.parentNode.removeChild(this.crystallineOverlayElement);
      }
      this.crystallineOverlayElement = null;
    }
  }

  /**
   * Clean up echo pool
   */
  private cleanupEchoPool(): void {
    this.echoPool.forEach(echo => {
      if (echo.parentNode) {
        echo.parentNode.removeChild(echo);
      }
    });
    this.echoPool = [];
    this.currentEchoCount = 0;
  }

  /**
   * Get current system metrics for debugging
   */
  public getMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get current beat sync configuration
   */
  public getBeatSyncConfig(): BeatSyncModeConfig {
    return { ...this.beatSyncConfig };
  }

  /**
   * Get current harmonic sync state
   */
  public getHarmonicSyncState(): HarmonicSyncState {
    return { ...this.harmonicSyncState };
  }

  /**
   * Update beat sync configuration
   */
  public updateBeatSyncConfig(config: Partial<BeatSyncModeConfig>): void {
    this.beatSyncConfig = { ...this.beatSyncConfig, ...config };
    
    if (this.config.enableDebug) {
      console.log('[BeatSyncVisualSystemUnified] Beat sync config updated:', this.beatSyncConfig);
    }
  }

  /**
   * Force repaint for settings changes
   */
  public override forceRepaint(reason?: string): void {
    super.forceRepaint(reason);
    
    // Reset beat sync state
    this.beatIntensity = 0;
    this.currentRhythmPhase = 0;
    this.lastBeatTime = 0;
    
    // Force CSS update
    this._applyCSSVariables();
    
    if (this.config.enableDebug) {
      console.log(`[BeatSyncVisualSystemUnified] Force repaint: ${reason}`);
    }
  }
}