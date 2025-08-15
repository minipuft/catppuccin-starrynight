import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
// Removed: unused GlobalEventBus import
import type { AdvancedSystemConfig, Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import * as ThemeUtilities from '@/utils/core/ThemeUtilities';
import { musicalLerpOrchestrator, type MusicalContext } from '@/utils/core/MusicalLerpOrchestrator';
import type { MusicSyncService } from '@/audio/MusicSyncService';

/**
 * Music Beat Synchronizer System
 * 
 * Advanced music beat detection and synchronization system that creates
 * responsive visual effects based on audio analysis. Provides smooth
 * visual feedback synchronized with music tempo and energy.
 * 
 * Technical Features:
 * - Dynamic scaling with music energy levels
 * - Animation rhythms synchronized with tempo detection
 * - Color temperature shifts based on music emotional analysis
 * - Smooth transitions between visual elements using LERP interpolation
 * - Real-time audio-visual synchronization with <16ms latency
 * 
 * @architecture Year3000System - Music Synchronization Integration
 * @performance 60fps target, <75MB memory, <15% CPU usage
 * @compatibility Spicetify Player API, WebGL2, CSS Variables
 */
export class MusicBeatSynchronizer extends UnifiedSystemBase {
  // =========================================================================
  // MUSIC SYNCHRONIZATION STATE MANAGEMENT
  // =========================================================================
  
  // Current synchronization state (real-time values)
  private musicIntensity: number = 0;          // 0-1 current music intensity
  private scaleMultiplier: number = 1;         // Visual scale factor (1.0 = baseline)
  private animationPhase: number = 0;          // Animation phase in radians (0-2π)
  private colorTemperature: number = 4000;     // Color temperature 1000K-20000K
  private transitionFluidityLevel: number = 0.5; // Transition smoothness 0-1
  
  // Target values for smooth LERP interpolation (destination states)
  private targetMusicIntensity: number = 0;      // Target intensity for smooth transitions
  private targetScaleMultiplier: number = 1;     // Target scale for visual effects
  private targetColorTemperature: number = 4000; // Target temperature for color shifts
  private targetTransitionFluidityLevel: number = 0.5; // Target fluidity level
  
  // LERP smoothing configuration (framerate-independent timing)
  private lerpHalfLifeValues = {
    intensityAttack: 0.05,    // Fast attack for immediate beat response (50ms)
    intensityDecay: 0.15,     // Smooth decay for natural feel (150ms)
    scaleMultiplier: 0.08,    // Visual scaling response timing (80ms)
    colorTemperature: 0.3,    // Gradual temperature shifts (300ms)
    transitionFluidity: 0.12  // Fluid transition timing (120ms)
  };
  
  // Timing and rhythm tracking
  private lastBeatTime: number = 0;              // Timestamp of last detected beat
  private currentBPM: number = 120;              // Current beats per minute (60-200 range)
  private animationCycleDuration: number = 2000; // Animation cycle length in milliseconds
  
  // Music synchronization service integration
  
  // External service integration for music analysis
  private musicSyncService: MusicSyncService | null = null;  // Spicetify audio analysis service
  private currentMusicalContext: MusicalContext | null = null; // Current musical analysis context
  private lastBeatPhaseUpdate: number = 0;                    // Last context update timestamp
  
  // Real-time performance monitoring
  private performanceMetrics = {
    syncUpdates: 0,          // Total synchronization updates processed
    scaleEvents: 0,          // Number of visual scaling events
    animationCycles: 0,      // Completed animation cycles
    emotionalShifts: 0,      // Color temperature changes
    averageFrameTime: 0,     // Rolling average frame processing time (ms)
    memoryUsage: 0           // Current memory usage (bytes)
  };
  
  // System configuration for music synchronization
  private syncConfig = {
    responseSensitivity: 0.7,                        // Beat detection sensitivity (0-1)
    animationIntensity: 0.8,                         // Maximum animation effect strength
    colorTemperatureRange: { min: 1000, max: 20000 }, // Valid temperature range in Kelvin
    transitionFluidityEnabled: true,                 // Enable smooth transitions
    visualParticlesEnabled: true,                    // Enable particle effects
    cinematicEffectsEnabled: true                    // Enable cinematic visual effects
  };
  
  constructor(config?: Year3000Config) {
    super(config);
    
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🎵 Music beat synchronizer initializing...');
    }
  }
  
  /**
   * Inject MusicSyncService for real-time audio analysis integration
   * 
   * @param musicSyncService - Spicetify-based music analysis service
   * @public External dependency injection for music data
   */
  public setMusicSyncService(musicSyncService: MusicSyncService): void {
    this.musicSyncService = musicSyncService;
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🎵 Music synchronization service activated');
    }
  }
  
  // =========================================================================
  // SYSTEM LIFECYCLE MANAGEMENT (IManagedSystem Interface)
  // =========================================================================
  
  /**
   * Handle detected music beat events from audio analysis
   * 
   * @param payload - Beat detection data from MusicSyncService
   * @param payload.intensity - Beat intensity level (0-1)
   * @param payload.bpm - Beats per minute (60-200 typical range)
   * @param payload.energy - Music energy level (0-1)
   * @param payload.timestamp - Beat detection timestamp
   * @private Core music synchronization event handler
   */
  private onBeatDetected(payload: any): void {
    const { intensity, bpm, energy, timestamp } = payload;
    
    // Update timing tracking
    this.lastBeatTime = timestamp || Date.now();
    this.currentBPM = bpm || this.currentBPM;
    
    // Set target music intensity with sensitivity scaling
    this.targetMusicIntensity = Math.min(1, intensity * this.syncConfig.responseSensitivity);
    
    // Calculate visual scaling based on energy (baseline 1.0, max 1.3)
    this.targetScaleMultiplier = 1 + ((energy || 0.5) * 0.3);
    
    this.performanceMetrics.scaleEvents++;
    
    if (this.config.enableDebug) {
      console.log(`[MusicBeatSynchronizer] 🎵 Beat detected: intensity=${intensity}, energy=${energy}, bpm=${bpm}`);
    }
  }

  /**
   * Handle music energy level changes from audio analysis
   * 
   * @param payload - Energy analysis data
   * @param payload.energy - Music energy level (0-1, low to high intensity)
   * @param payload.valence - Musical valence (0-1, negative to positive emotion)
   * @private Updates visual scaling and transition fluidity based on energy
   */
  private onEnergyChanged(payload: any): void {
    const { energy, valence } = payload;
    
    // Update visual scaling based on energy intensity
    this.targetScaleMultiplier = 1 + (energy * 0.3); // Baseline 1.0, energetic 1.3
    
    // Adjust transition fluidity based on musical valence
    this.targetTransitionFluidityLevel = 0.3 + (valence * 0.4); // Range 0.3-0.7
    
    if (this.config.enableDebug) {
      console.log(`[MusicBeatSynchronizer] ⚡ Energy change: energy=${energy}, valence=${valence}`);
    }
  }

  /**
   * Handle detected music emotion changes for color temperature mapping
   * 
   * @param payload - Emotional analysis data
   * @param payload.valence - Emotional valence (-1 to 1, negative to positive)
   * @param payload.energy - Music energy level (0-1, calm to intense)
   * @private Maps musical emotion to color temperature for visual feedback
   */
  private onEmotionDetected(payload: any): void {
    const { valence, energy } = payload;
    
    // Calculate target color temperature using emotional mapping
    const baseTemp = 4000;                              // Neutral white temperature
    const energyModulation = (energy - 0.5) * 8000;     // Energy affects warmth (-4000 to +4000K)
    const valenceModulation = (valence - 0.5) * 6000;   // Valence affects tint (-3000 to +3000K)
    
    // Clamp result to valid color temperature range
    this.targetColorTemperature = Math.max(1000, Math.min(20000, 
      baseTemp + energyModulation + valenceModulation
    ));
    
    this.performanceMetrics.emotionalShifts++;
    
    if (this.config.enableDebug) {
      console.log(`[MusicBeatSynchronizer] 🌈 Emotion detected: ${this.colorTemperature}K temperature`);
    }
  }

  /**
   * Handle music tempo changes for animation timing synchronization
   * 
   * @param payload - Tempo analysis data
   * @param payload.bpm - Base beats per minute detection
   * @param payload.tempo - Tempo classification string
   * @param payload.enhancedBPM - Enhanced BPM with improved accuracy
   * @private Synchronizes animation cycles with musical tempo
   */
  private onTempoChanged(payload: any): void {
    const { bpm, tempo, enhancedBPM } = payload;
    
    // Use most accurate BPM value available
    this.currentBPM = enhancedBPM || bpm || tempo || 120;
    
    // Calculate animation cycle duration based on musical tempo
    // Normalize around 120 BPM baseline, clamp to reasonable range
    const bpmFactor = Math.max(0.3, Math.min(3.0, this.currentBPM / 120));
    this.animationCycleDuration = 2000 / bpmFactor; // 667ms-6.67s range
    
    if (this.config.enableDebug) {
      console.log(`[MusicBeatSynchronizer] 🎶 Tempo changed: ${this.currentBPM} BPM, ${this.animationCycleDuration.toFixed(0)}ms cycle`);
    }
  }

  /**
   * Initialize the music beat synchronizer system
   * 
   * Sets up event subscriptions, CSS variable groups, and animation coordination
   * for real-time music-visual synchronization.
   * 
   * @returns Promise<void> Resolves when initialization is complete
   * @throws Error if system fails to initialize properly
   * @public IManagedSystem lifecycle method
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🎵 Initializing music synchronization system...');
    }
    
    // Register CSS variable groups with appropriate priorities
    this.registerCSSVariableGroup('music-sync-core', 'critical');
    this.registerCSSVariableGroup('visual-scaling', 'high');
    // Removed: Breathing rhythm CSS variable group (pulsing animations completely removed)
    this.registerCSSVariableGroup('color-temperature', 'normal');
    this.registerCSSVariableGroup('transition-fluidity', 'normal');
    
    // Initialize music synchronization state
    this.musicIntensity = 0;
    this.scaleMultiplier = 1;
    this.animationPhase = 0;
    this.colorTemperature = 4000;
    this.transitionFluidityLevel = 0.5;
    
    // Subscribe to music synchronization events
    this.subscribeToEvent('music:beat', (payload: any) => this.onBeatDetected(payload));
    this.subscribeToEvent('music:energy', (payload: any) => this.onEnergyChanged(payload));
    this.subscribeToEvent('music:emotion', (payload: any) => this.onEmotionDetected(payload));
    this.subscribeToEvent('music:bpm-change', (payload: any) => this.onTempoChanged(payload));
    
    // Register with animation coordinator (critical priority for music sync)
    this.registerAnimation(60); // 60fps target
    
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🌟 Music synchronization system ready');
    }
  }
  
  /**
   * Clean up and shut down the music beat synchronizer system
   * 
   * Resets all synchronization state to baseline values and performs cleanup.
   * Called during system shutdown or when switching themes.
   * 
   * @public IManagedSystem lifecycle method
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🍃 Shutting down music synchronizer...');
    }
    
    // Music synchronization cleanup
    
    // Reset synchronization state
    this.musicIntensity = 0;
    this.scaleMultiplier = 1;
    this.animationPhase = 0;
    this.colorTemperature = 4000;
    this.transitionFluidityLevel = 0.5;
    
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🌌 Music synchronizer cleanly shut down');
    }
  }
  
  /**
   * Process music synchronization for current animation frame
   * 
   * Called by the master animation coordinator at 60fps. Updates all music-synchronized
   * visual properties using LERP interpolation for smooth transitions.
   * 
   * @param deltaTime - Time elapsed since last frame in milliseconds
   * @public IManagedSystem animation interface
   */
  onAnimate(deltaTime: number): void {
    const startTime = performance.now();
    
    // Update musical context
    this.updateMusicalContext();
    
    // Update music synchronization state
    this.updateMusicSyncState(deltaTime);
    
    // Process visual scaling
    this.processVisualScaling(deltaTime);
    
    // Update color temperature
    this.updateColorTemperature(deltaTime);
    
    // Animate transition fluidity
    this.animateTransitionFluidity(deltaTime);
    
    // Apply music sync CSS variables
    this.applyMusicSyncCSSVariables();
    
    // Track performance
    const frameTime = performance.now() - startTime;
    this.performanceMetrics.averageFrameTime = 
      (this.performanceMetrics.averageFrameTime * 0.9) + (frameTime * 0.1);
    this.performanceMetrics.syncUpdates++;
    
    // Performance warning for music synchronization
    if (frameTime > 2.0 && this.config.enableDebug) {
      console.warn(`[MusicBeatSynchronizer] 🐌 Music sync frame took ${frameTime.toFixed(2)}ms (target: <2ms)`);
    }
  }
  
  /**
   * Perform system health check for music synchronization
   * 
   * Validates EventBus connectivity, performance metrics, synchronization activity,
   * and color temperature ranges for system health monitoring.
   * 
   * @returns Promise<HealthCheckResult> System health status and diagnostic details
   * @public IManagedSystem monitoring interface
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    // Check EventBus connection for music coordination
    if (!this.eventBus) {
      issues.push('EventBus not connected for music coordination');
    }
    
    // Check performance health
    if (this.performanceMetrics.averageFrameTime > 2.0) {
      issues.push(`Average frame time ${this.performanceMetrics.averageFrameTime.toFixed(2)}ms exceeds 2ms target`);
    }
    
    // Check music synchronization activity
    if (this.musicIntensity === 0 && (Date.now() - this.lastBeatTime) > 10000) {
      issues.push('No music synchronization activity detected in last 10 seconds');
    }
    
    // Check color temperature range
    if (this.colorTemperature < 1000 || this.colorTemperature > 20000) {
      issues.push(`Color temperature ${this.colorTemperature}K outside 1000K-20000K range`);
    }
    
    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: `Music synchronization health: ${issues.length === 0 ? 'optimal' : 'needs attention'}`,
      issues: issues,
      system: 'MusicBeatSynchronizer'
    };
  }
  
  // =========================================================================
  // MUSIC SYNCHRONIZATION BEHAVIORS (LEGACY METHODS - TO BE REMOVED)
  // =========================================================================
  
  // NOTE: These methods are now handled by the main event handlers above
  // They remain for compatibility but should be phased out
  
  // =========================================================================
  // REMOVED: BREATHING INTEGRATION METHODS
  // =========================================================================
  
  
  // =========================================================================
  // ANIMATION UPDATE METHODS
  // =========================================================================
  
  /**
   * Update music synchronization state using framerate-independent LERP smoothing
   */
  private updateMusicSyncState(deltaTime: number): void {
    // Update animation phase (continuous oscillation)
    this.animationPhase += (deltaTime / this.animationCycleDuration) * 2 * Math.PI;
    if (this.animationPhase > 2 * Math.PI) {
      this.animationPhase -= 2 * Math.PI;
    }
    
    // Smooth music intensity using LERP with attack/decay
    const deltaTimeSeconds = deltaTime / 1000;
    const halfLife = this.targetMusicIntensity > this.musicIntensity 
      ? this.lerpHalfLifeValues.intensityAttack  // Fast attack
      : this.lerpHalfLifeValues.intensityDecay;  // Smooth decay
      
    this.musicIntensity = ThemeUtilities.lerpSmooth(
      this.musicIntensity,
      this.targetMusicIntensity,
      deltaTimeSeconds,
      halfLife
    );
    
    // Auto-decay target when no recent beats (natural decay)
    const timeSinceLastBeat = Date.now() - this.lastBeatTime;
    if (timeSinceLastBeat > 2000) { // 2 seconds
      this.targetMusicIntensity = ThemeUtilities.lerpSmooth(
        this.targetMusicIntensity,
        0, // Decay to zero
        deltaTimeSeconds,
        this.lerpHalfLifeValues.intensityDecay
      );
    }
  }
  
  /**
   * Process visual scaling using framerate-independent LERP smoothing
   */
  private processVisualScaling(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth scale multiplier towards target
    this.scaleMultiplier = ThemeUtilities.lerpSmooth(
      this.scaleMultiplier,
      this.targetScaleMultiplier,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.scaleMultiplier
    );
    
    // Auto-decay target scale multiplier to baseline over time
    this.targetScaleMultiplier = ThemeUtilities.lerpSmooth(
      this.targetScaleMultiplier,
      1.0, // Baseline scale
      deltaTimeSeconds,
      this.lerpHalfLifeValues.scaleMultiplier * 2 // Slower decay
    );
  }
  
  
  /**
   * Update color temperature using framerate-independent LERP smoothing
   */
  private updateColorTemperature(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth color temperature towards target
    this.colorTemperature = ThemeUtilities.lerpSmooth(
      this.colorTemperature,
      this.targetColorTemperature,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.colorTemperature
    );
    
    // Auto-decay target temperature toward neutral over time
    const neutral = 4000;
    this.targetColorTemperature = ThemeUtilities.lerpSmooth(
      this.targetColorTemperature,
      neutral,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.colorTemperature * 3 // Slower neutral decay
    );
  }
  
  /**
   * Animate transition fluidity using framerate-independent LERP smoothing
   */
  private animateTransitionFluidity(deltaTime: number): void {
    if (!this.syncConfig.transitionFluidityEnabled) return;
    
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth transition fluidity towards target
    this.transitionFluidityLevel = ThemeUtilities.lerpSmooth(
      this.transitionFluidityLevel,
      this.targetTransitionFluidityLevel,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.transitionFluidity
    );
    
    // Transition fluidity now handled through CSS variables only
  }
  
  /**
   * Apply music sync CSS variables
   */
  private applyMusicSyncCSSVariables(): void {
    // Core music synchronization variables
    this.updateCSSVariableGroup('music-sync-core', {
      '--sn-music-intensity': this.musicIntensity.toFixed(3),
      '--sn-music-bpm': this.currentBPM.toString(),
      '--sn-music-animation-phase': this.animationPhase.toFixed(4),
    });
    
    // Visual scaling variables
    this.updateCSSVariableGroup('visual-scaling', {
      '--sn-visual-scale': this.scaleMultiplier.toFixed(3),
      '--sn-visual-response-sensitivity': this.syncConfig.responseSensitivity.toFixed(2),
    });
    
    // Color temperature variables
    this.updateCSSVariableGroup('color-temperature', {
      '--sn-color-temperature': `${this.colorTemperature.toFixed(0)}K`,
      '--sn-color-temperature-normalized': ((this.colorTemperature - 1000) / 19000).toFixed(3),
    });
    
    // Transition fluidity variables
    this.updateCSSVariableGroup('transition-fluidity', {
      '--sn-transition-fluidity': this.transitionFluidityLevel.toFixed(3),
      '--sn-transition-fluidity-enabled': this.syncConfig.transitionFluidityEnabled ? '1' : '0',
    });
  }
  
  // =========================================================================
  // CLEANUP METHODS
  // =========================================================================
  
  
  // =========================================================================
  // PUBLIC API METHODS
  // =========================================================================
  
  /**
   * Get music synchronization metrics
   */
  public getMusicSyncMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }
  
  /**
   * Update music synchronization configuration
   */
  public updateSyncConfig(config: Partial<typeof this.syncConfig>): void {
    this.syncConfig = { ...this.syncConfig, ...config };
    
    if (this.config.enableDebug) {
      console.log('[MusicBeatSynchronizer] 🔧 Sync configuration updated:', this.syncConfig);
    }
  }
  
  /**
   * Get current music synchronization state
   */
  public getMusicSyncState(): {
    musicIntensity: number;
    scaleMultiplier: number;
    animationPhase: number;
    colorTemperature: number;
    transitionFluidityLevel: number;
    lastBeatTime: number;
    currentBPM: number;
  } {
    return {
      musicIntensity: this.musicIntensity,
      scaleMultiplier: this.scaleMultiplier,
      animationPhase: this.animationPhase,
      colorTemperature: this.colorTemperature,
      transitionFluidityLevel: this.transitionFluidityLevel,
      lastBeatTime: this.lastBeatTime,
      currentBPM: this.currentBPM,
    };
  }
  
  /**
   * Force music synchronization repaint
   */
  public override forceRepaint(reason?: string): void {
    super.forceRepaint(reason);
    
    // Reset music synchronization state
    this.musicIntensity = 0;
    this.scaleMultiplier = 1;
    this.animationPhase = 0;
    
    // Force music sync CSS update
    this.applyMusicSyncCSSVariables();
    
    if (this.config.enableDebug) {
      console.log(`[MusicBeatSynchronizer] 🔄 Music synchronization repaint: ${reason}`);
    }
  }
  
  
  // =========================================================================
  // MUSICAL CONTEXT INTEGRATION
  // =========================================================================
  
  /**
   * Update musical context for music-aware LERP calculations
   */
  private updateMusicalContext(): void {
    if (!this.musicSyncService) {
      this.currentMusicalContext = null;
      return;
    }
    
    // Only update context periodically to avoid excessive calculations
    const now = Date.now();
    if (now - this.lastBeatPhaseUpdate < 16) { // Update max 60fps
      return;
    }
    
    this.lastBeatPhaseUpdate = now;
    this.currentMusicalContext = musicalLerpOrchestrator.createMusicalContext(
      this.musicSyncService,
      this.lastBeatTime
    );
    
    if (this.config.enableDebug && this.currentMusicalContext) {
      const ctx = this.currentMusicalContext;
      console.log(`[MusicBeatSynchronizer] 🎵 Musical context: tempo=${ctx.tempo}, energy=${ctx.energy.toFixed(2)}, phase=${ctx.beatPhase}`);
    }
  }
}