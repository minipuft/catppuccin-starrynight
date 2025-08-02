import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { Year3000Config } from '@/types/models';
import type { HealthCheckResult } from '@/types/systems';
import * as Year3000Utilities from '@/utils/core/Year3000Utilities';
import { musicalLerpOrchestrator, type MusicalContext, type AnimationType } from '@/utils/core/MusicalLerpOrchestrator';
import type { MusicSyncService } from '@/audio/MusicSyncService';

/**
 * Organic BeatSync Consciousness System
 * 
 * Evolution from mechanical beat detection to organic consciousness that breathes 
 * with music. Implements Year 3000 philosophy of living, breathing interfaces that
 * experience music alongside users.
 * 
 * Core Behaviors:
 * - Cellular growth/shrink with music energy
 * - Breathing rhythms synchronized with tempo
 * - Emotional temperature color shifts
 * - Liquid membrane fluidity between elements
 * - Symbiotic listening experience
 * 
 * @philosophy "Interfaces are not built—they are grown"
 * @architecture Organic Consciousness replacing quantum mechanics
 * @performance 60fps, <75MB memory, <15% CPU targets
 */
export class OrganicBeatSyncConsciousness extends UnifiedSystemBase {
  // =========================================================================
  // ORGANIC CONSCIOUSNESS STATE
  // =========================================================================
  
  // Core organic properties (current values)
  private organicIntensity: number = 0;
  private cellularGrowth: number = 1;
  private breathingPhase: number = 0;
  private emotionalTemperature: number = 4000; // 1000K-20000K range
  private membraneFluidityLevel: number = 0.5;
  
  // Target values for smooth LERP interpolation
  private targetOrganicIntensity: number = 0;
  private targetCellularGrowth: number = 1;
  private targetEmotionalTemperature: number = 4000;
  private targetMembraneFluidityLevel: number = 0.5;
  
  // LERP smoothing half-life values (in seconds)
  private lerpHalfLifeValues = {
    intensityAttack: 0.05,    // Fast attack for beat response
    intensityDecay: 0.15,     // Smooth decay
    cellularGrowth: 0.08,     // Organic cellular response  
    emotionalTemperature: 0.3, // Gradual temperature shifts
    membraneFluidty: 0.12     // Fluid membrane transitions
  };
  
  // Timing and rhythm
  private lastBeatTime: number = 0;
  private currentBPM: number = 120;
  private breathingCycleDuration: number = 2000; // 2 seconds default
  
  // Breathing controller (CSS-based, performance optimized)
  private breathingController: any = null; // Will be injected by facade
  
  // Musical consciousness integration
  private musicSyncService: MusicSyncService | null = null;
  private currentMusicalContext: MusicalContext | null = null;
  private lastBeatPhaseUpdate: number = 0;
  
  // Performance metrics
  private performanceMetrics = {
    organicUpdates: 0,
    cellularGrowthEvents: 0,
    breathingCycles: 0,
    emotionalShifts: 0,
    averageFrameTime: 0,
    memoryUsage: 0
  };
  
  // Organic consciousness configuration
  private organicConfig = {
    cellularResponseSensitivity: 0.7,
    breathingRhythmIntensity: 0.8,
    emotionalTemperatureRange: { min: 1000, max: 20000 },
    membraneFluidityEnabled: true,
    atmosphericParticlesEnabled: true,
    cinematicEffectsEnabled: true
  };
  
  constructor(config?: Year3000Config) {
    super(config);
    
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🌊 Organic consciousness awakening...');
    }
  }
  
  /**
   * Inject MusicSyncService for musical consciousness integration
   */
  public setMusicSyncService(musicSyncService: MusicSyncService): void {
    this.musicSyncService = musicSyncService;
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🎵 Musical consciousness integration activated');
    }
  }
  
  // =========================================================================
  // UNIFIED SYSTEM LIFECYCLE
  // =========================================================================
  
  /**
   * Initialize organic consciousness system
   */
  async initialize(): Promise<void> {
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🧬 Initializing organic consciousness...');
    }
    
    // Register CSS variable groups with appropriate priorities
    this.registerCSSVariableGroup('organic-core', 'critical');
    this.registerCSSVariableGroup('cellular-growth', 'high');
    this.registerCSSVariableGroup('breathing-rhythm', 'high');
    this.registerCSSVariableGroup('emotional-temperature', 'normal');
    this.registerCSSVariableGroup('membrane-fluidity', 'normal');
    
    // Breathing controller will be injected by facade pattern
    
    // Subscribe to music consciousness events
    this.subscribeToEvent('music:beat', (payload: any) => this.onBeatConsciousness(payload));
    this.subscribeToEvent('music:energy', (payload: any) => this.onEnergyConsciousness(payload));
    this.subscribeToEvent('music:emotion', (payload: any) => this.onEmotionalConsciousness(payload));
    this.subscribeToEvent('music:bpm-change', (payload: any) => this.onTempoConsciousness(payload));
    
    // Register with animation coordinator (critical priority for organic consciousness)
    this.registerAnimation(60); // 60fps target
    
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🌟 Organic consciousness fully awakened');
    }
  }
  
  /**
   * Clean up organic consciousness
   */
  destroy(): void {
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🍃 Dissolving organic consciousness...');
    }
    
    // Breathing controller cleanup handled by facade pattern
    
    // Reset consciousness state
    this.organicIntensity = 0;
    this.cellularGrowth = 1;
    this.breathingPhase = 0;
    this.emotionalTemperature = 4000;
    
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🌌 Organic consciousness peacefully dissolved');
    }
  }
  
  /**
   * Organic consciousness animation frame
   */
  onAnimate(deltaTime: number): void {
    const startTime = performance.now();
    
    // Update musical consciousness context
    this.updateMusicalContext();
    
    // Update organic consciousness state with musical awareness
    this.updateOrganicConsciousness(deltaTime);
    
    // Process cellular growth
    this.processCellularGrowth(deltaTime);
    
    // Update emotional temperature
    this.updateEmotionalTemperature(deltaTime);
    
    // Animate membrane fluidity
    this.animateMembraneFluidty(deltaTime);
    
    // Delegate breathing events to breathing controller
    this.delegateBreathingEvents();
    
    // Apply organic CSS variables
    this.applyOrganicCSSVariables();
    
    // Track performance
    const frameTime = performance.now() - startTime;
    this.performanceMetrics.averageFrameTime = 
      (this.performanceMetrics.averageFrameTime * 0.9) + (frameTime * 0.1);
    this.performanceMetrics.organicUpdates++;
    
    // Performance warning for organic consciousness
    if (frameTime > 2.0 && this.config.enableDebug) {
      console.warn(`[OrganicBeatSyncConsciousness] 🐌 Organic consciousness frame took ${frameTime.toFixed(2)}ms (target: <2ms)`);
    }
  }
  
  /**
   * Health check for organic consciousness
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    // Check breathing controller health
    if (!this.breathingController) {
      issues.push('Breathing controller not injected by facade');
    }
    
    // Check performance health
    if (this.performanceMetrics.averageFrameTime > 2.0) {
      issues.push(`Average frame time ${this.performanceMetrics.averageFrameTime.toFixed(2)}ms exceeds 2ms target`);
    }
    
    // Check consciousness activity
    if (this.organicIntensity === 0 && (Date.now() - this.lastBeatTime) > 10000) {
      issues.push('No organic consciousness activity detected in last 10 seconds');
    }
    
    // Check emotional temperature range
    if (this.emotionalTemperature < 1000 || this.emotionalTemperature > 20000) {
      issues.push(`Emotional temperature ${this.emotionalTemperature}K outside 1000K-20000K range`);
    }
    
    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: `Organic consciousness health: ${issues.length === 0 ? 'thriving' : 'needs attention'}`,
      issues: issues,
      system: 'OrganicBeatSyncConsciousness'
    };
  }
  
  // =========================================================================
  // ORGANIC CONSCIOUSNESS BEHAVIORS
  // =========================================================================
  
  /**
   * Handle beat consciousness - organic response to music beats
   */
  private onBeatConsciousness(payload: any): void {
    const { intensity, bpm, energy, timestamp } = payload;
    
    this.lastBeatTime = timestamp || Date.now();
    this.currentBPM = bpm || this.currentBPM;
    
    // Set target organic intensity for smooth LERP interpolation
    this.targetOrganicIntensity = Math.min(1, intensity * this.organicConfig.cellularResponseSensitivity);
    
    // Set target cellular growth based on energy
    this.targetCellularGrowth = 1 + ((energy || 0.5) * 0.3); // 1.0 to 1.3 scale
    
    // Synchronize breathing rhythm
    this.synchronizeBreathingRhythm(bpm || 120);
    
    this.performanceMetrics.cellularGrowthEvents++;
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] 🎵 Beat consciousness: intensity=${intensity}, energy=${energy}, bpm=${bpm}`);
    }
  }
  
  /**
   * Handle energy consciousness - organic response to music energy
   */
  private onEnergyConsciousness(payload: any): void {
    const { energy, valence, timestamp } = payload;
    
    // Set target cellular growth based on energy
    this.targetCellularGrowth = 1 + (energy * 0.3); // 1.0 to 1.3 scale
    
    // Set target membrane fluidity based on valence  
    this.targetMembraneFluidityLevel = 0.3 + (valence * 0.4); // 0.3 to 0.7 range
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] ⚡ Energy consciousness: energy=${energy}, valence=${valence}`);
    }
  }
  
  /**
   * Handle emotional consciousness - organic response to music emotion
   */
  private onEmotionalConsciousness(payload: any): void {
    const { emotion, valence, energy, arousal } = payload;
    
    // Calculate emotional temperature (1000K-20000K)
    const baseTemp = 4000; // Neutral temperature
    const energyModulation = (energy - 0.5) * 8000; // -4000 to +4000
    const valenceModulation = (valence - 0.5) * 6000; // -3000 to +3000
    
    this.targetEmotionalTemperature = Math.max(1000, Math.min(20000, 
      baseTemp + energyModulation + valenceModulation
    ));
    
    this.performanceMetrics.emotionalShifts++;
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] 🌈 Emotional consciousness: ${this.emotionalTemperature}K temperature`);
    }
  }
  
  /**
   * Handle tempo consciousness - organic response to BPM changes
   */
  private onTempoConsciousness(payload: any): void {
    const { bpm, tempo, enhancedBPM } = payload;
    
    this.currentBPM = enhancedBPM || bpm || tempo || 120;
    
    // Adjust breathing cycle duration based on BPM
    // Slow music = longer breathing cycles, fast music = shorter cycles
    const bpmFactor = Math.max(0.3, Math.min(3.0, this.currentBPM / 120));
    this.breathingCycleDuration = 2000 / bpmFactor; // 667ms to 6.67s range
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] 🎶 Tempo consciousness: ${this.currentBPM} BPM, ${this.breathingCycleDuration.toFixed(0)}ms breathing cycle`);
    }
  }
  
  // =========================================================================
  // BREATHING INTEGRATION METHODS
  // =========================================================================
  
  /**
   * Set breathing controller (injected by facade)
   */
  public setBreathingController(controller: any): void {
    this.breathingController = controller;
    
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🫁 Breathing controller injected');
    }
  }
  
  /**
   * Synchronize breathing rhythm (delegates to breathing controller)
   */
  private synchronizeBreathingRhythm(bpm: number): void {
    // Delegate breathing rhythm synchronization to the CSS-based controller
    if (this.breathingController?.onTempoConsciousness) {
      this.breathingController.onTempoConsciousness({ bpm, enhancedBPM: bpm });
    }
    
    this.performanceMetrics.breathingCycles++;
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] 🎶 Delegated breathing rhythm to controller: ${bpm} BPM`);
    }
  }
  
  /**
   * Delegate breathing events to controller
   */
  private delegateBreathingEvents(): void {
    if (!this.breathingController) return;
    
    // Delegate energy consciousness for breathing response
    if (this.breathingController.onEnergyConsciousness) {
      this.breathingController.onEnergyConsciousness({
        energy: this.cellularGrowth - 1, // Convert cellular growth back to energy
        valence: this.membraneFluidityLevel
      });
    }
    
    // Delegate emotional consciousness for breathing saturation
    if (this.breathingController.onEmotionalConsciousness) {
      this.breathingController.onEmotionalConsciousness({
        emotion: 'organic',
        valence: this.membraneFluidityLevel,
        energy: (this.cellularGrowth - 1) / 0.3, // Normalize back to 0-1
        arousal: this.organicIntensity
      });
    }
  }
  
  // =========================================================================
  // ANIMATION UPDATE METHODS
  // =========================================================================
  
  /**
   * Update organic consciousness state using framerate-independent LERP smoothing
   */
  private updateOrganicConsciousness(deltaTime: number): void {
    // Update breathing phase (keep existing - this is natural oscillation)
    this.breathingPhase += (deltaTime / this.breathingCycleDuration) * 2 * Math.PI;
    if (this.breathingPhase > 2 * Math.PI) {
      this.breathingPhase -= 2 * Math.PI;
    }
    
    // Smooth organic intensity using LERP with attack/decay
    const deltaTimeSeconds = deltaTime / 1000;
    const halfLife = this.targetOrganicIntensity > this.organicIntensity 
      ? this.lerpHalfLifeValues.intensityAttack  // Fast attack
      : this.lerpHalfLifeValues.intensityDecay;  // Smooth decay
      
    this.organicIntensity = Year3000Utilities.lerpSmooth(
      this.organicIntensity,
      this.targetOrganicIntensity,
      deltaTimeSeconds,
      halfLife
    );
    
    // Auto-decay target when no recent beats (organic decay)
    const timeSinceLastBeat = Date.now() - this.lastBeatTime;
    if (timeSinceLastBeat > 2000) { // 2 seconds
      this.targetOrganicIntensity = Year3000Utilities.lerpSmooth(
        this.targetOrganicIntensity,
        0, // Decay to zero
        deltaTimeSeconds,
        this.lerpHalfLifeValues.intensityDecay
      );
    }
  }
  
  /**
   * Process cellular growth using framerate-independent LERP smoothing
   */
  private processCellularGrowth(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth cellular growth towards target
    this.cellularGrowth = Year3000Utilities.lerpSmooth(
      this.cellularGrowth,
      this.targetCellularGrowth,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.cellularGrowth
    );
    
    // Auto-decay target cellular growth to baseline over time
    this.targetCellularGrowth = Year3000Utilities.lerpSmooth(
      this.targetCellularGrowth,
      1.0, // Baseline growth
      deltaTimeSeconds,
      this.lerpHalfLifeValues.cellularGrowth * 2 // Slower decay
    );
  }
  
  
  /**
   * Update emotional temperature using framerate-independent LERP smoothing
   */
  private updateEmotionalTemperature(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth emotional temperature towards target
    this.emotionalTemperature = Year3000Utilities.lerpSmooth(
      this.emotionalTemperature,
      this.targetEmotionalTemperature,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.emotionalTemperature
    );
    
    // Auto-decay target temperature toward neutral over time
    const neutral = 4000;
    this.targetEmotionalTemperature = Year3000Utilities.lerpSmooth(
      this.targetEmotionalTemperature,
      neutral,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.emotionalTemperature * 3 // Slower neutral decay
    );
  }
  
  /**
   * Animate membrane fluidity using framerate-independent LERP smoothing
   */
  private animateMembraneFluidty(deltaTime: number): void {
    if (!this.organicConfig.membraneFluidityEnabled) return;
    
    const deltaTimeSeconds = deltaTime / 1000;
    
    // Smooth membrane fluidity towards target
    this.membraneFluidityLevel = Year3000Utilities.lerpSmooth(
      this.membraneFluidityLevel,
      this.targetMembraneFluidityLevel,
      deltaTimeSeconds,
      this.lerpHalfLifeValues.membraneFluidty
    );
    
    // Add breathing wave on top of smoothed base (keep organic oscillation)
    const fluidityWave = Math.sin(this.breathingPhase * 0.5) * 0.1;
    const currentFluidity = this.membraneFluidityLevel + fluidityWave;
    
    // Membrane fluidity now handled through CSS variables only
  }
  
  /**
   * Apply organic CSS variables
   */
  private applyOrganicCSSVariables(): void {
    // Core organic consciousness variables
    this.updateCSSVariableGroup('organic-core', {
      '--organic-intensity': this.organicIntensity.toFixed(3),
      '--organic-bpm': this.currentBPM.toString(),
      '--organic-breathing-phase': this.breathingPhase.toFixed(4),
    });
    
    // Cellular growth variables
    this.updateCSSVariableGroup('cellular-growth', {
      '--cellular-growth-scale': this.cellularGrowth.toFixed(3),
      '--cellular-response-sensitivity': this.organicConfig.cellularResponseSensitivity.toFixed(2),
    });
    
    // Breathing rhythm variables
    this.updateCSSVariableGroup('breathing-rhythm', {
      '--breathing-cycle-duration': `${this.breathingCycleDuration.toFixed(0)}ms`,
      '--breathing-rhythm-intensity': this.organicConfig.breathingRhythmIntensity.toFixed(2),
    });
    
    // Emotional temperature variables
    this.updateCSSVariableGroup('emotional-temperature', {
      '--emotional-temperature': `${this.emotionalTemperature.toFixed(0)}K`,
      '--emotional-temperature-normalized': ((this.emotionalTemperature - 1000) / 19000).toFixed(3),
    });
    
    // Membrane fluidity variables
    this.updateCSSVariableGroup('membrane-fluidity', {
      '--membrane-fluidity-level': this.membraneFluidityLevel.toFixed(3),
      '--membrane-fluidity-enabled': this.organicConfig.membraneFluidityEnabled ? '1' : '0',
    });
  }
  
  // =========================================================================
  // CLEANUP METHODS
  // =========================================================================
  
  
  // =========================================================================
  // PUBLIC API METHODS
  // =========================================================================
  
  /**
   * Get organic consciousness metrics
   */
  public getOrganicMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }
  
  /**
   * Update organic consciousness configuration
   */
  public updateOrganicConfig(config: Partial<typeof this.organicConfig>): void {
    this.organicConfig = { ...this.organicConfig, ...config };
    
    if (this.config.enableDebug) {
      console.log('[OrganicBeatSyncConsciousness] 🔧 Organic configuration updated:', this.organicConfig);
    }
  }
  
  /**
   * Get current organic consciousness state
   */
  public getOrganicState(): {
    organicIntensity: number;
    cellularGrowth: number;
    breathingPhase: number;
    emotionalTemperature: number;
    membraneFluidityLevel: number;
    lastBeatTime: number;
    currentBPM: number;
  } {
    return {
      organicIntensity: this.organicIntensity,
      cellularGrowth: this.cellularGrowth,
      breathingPhase: this.breathingPhase,
      emotionalTemperature: this.emotionalTemperature,
      membraneFluidityLevel: this.membraneFluidityLevel,
      lastBeatTime: this.lastBeatTime,
      currentBPM: this.currentBPM,
    };
  }
  
  /**
   * Force organic consciousness repaint
   */
  public override forceRepaint(reason?: string): void {
    super.forceRepaint(reason);
    
    // Reset organic consciousness state
    this.organicIntensity = 0;
    this.cellularGrowth = 1;
    this.breathingPhase = 0;
    
    // Force organic CSS update
    this.applyOrganicCSSVariables();
    
    if (this.config.enableDebug) {
      console.log(`[OrganicBeatSyncConsciousness] 🔄 Organic consciousness repaint: ${reason}`);
    }
  }
  
  
  // =========================================================================
  // MUSICAL CONSCIOUSNESS INTEGRATION
  // =========================================================================
  
  /**
   * Update musical consciousness context for music-aware LERP calculations
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
      console.log(`[OrganicBeatSyncConsciousness] 🎵 Musical context: tempo=${ctx.tempo}, energy=${ctx.energy.toFixed(2)}, phase=${ctx.beatPhase}`);
    }
  }
}