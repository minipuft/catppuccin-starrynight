/**
 * HeaderConsciousnessController - Year 3000 Header Animation System
 * 
 * Connects header consciousness animations to the music system for
 * dynamic, music-responsive header effects that flow with the musical consciousness.
 * 
 * Philosophy: "Headers become windows to the musical soul - breathing, pulsing,
 * and harmonizing with the cosmic energy of sound."
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { UnifiedSystemBase } from "@/core/base/UnifiedSystemBase";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

interface HeaderConsciousnessState {
  // Music synchronization
  energy: number;          // 0-1, current music energy
  valence: number;         // 0-1, musical mood/emotion
  tempo: number;           // BPM
  harmonyHue: number;      // Hue rotation for musical harmony
  intensity: number;       // Overall header consciousness intensity
  
  // Animation state
  lastUpdateTime: number;
  animationActive: boolean;
  preferredMotion: boolean;
  
  // Performance
  frameRate: number;
  lastFrameTime: number;
}

export class HeaderConsciousnessController extends UnifiedSystemBase {
  private consciousnessState: HeaderConsciousnessState = {
    energy: 0.5,
    valence: 0.5,
    tempo: 120,
    harmonyHue: 0,
    intensity: 0.8,
    lastUpdateTime: 0,
    animationActive: true,
    preferredMotion: true,
    frameRate: 60,
    lastFrameTime: 0
  };
  
  private animationFrameId: number = 0;
  private updateInterval: number = 0;
  
  // Performance optimization
  private eventDebounceTimers = {
    musicEnergy: 0,
    colorHarmony: 0,
    beatSync: 0,
    cssUpdate: 0
  };
  private eventDebounceMs = 100; // Reduced from 33ms to 100ms for better performance
  private frameThrottleMs = 16; // 60fps target
  private lastCSSUpdateTime = 0;
  
  // Change detection for CSS variables
  private previousCSSValues = {
    energy: 0,
    valence: 0,
    harmonyHue: 0,
    intensity: 0,
    depth: 0
  };
  private cssChangeThreshold = 0.01;
  
  constructor(config: Year3000Config) {
    super(config);
  }
  
  // =========================================================================
  // PERFORMANCE OPTIMIZATION HELPERS
  // =========================================================================
  
  /**
   * Debounced event handler to prevent excessive processing
   */
  private debouncedEventHandler(
    eventType: keyof typeof this.eventDebounceTimers,
    handler: () => void
  ): void {
    const now = performance.now();
    if (now - this.eventDebounceTimers[eventType] >= this.eventDebounceMs) {
      handler();
      this.eventDebounceTimers[eventType] = now;
    }
  }
  
  /**
   * Check if CSS values have changed significantly
   */
  private hasSignificantCSSChange(): boolean {
    const state = this.consciousnessState;
    const depthMultiplier = 1 + state.energy * 0.5;
    
    const currentValues = {
      energy: state.energy,
      valence: state.valence,
      harmonyHue: state.harmonyHue,
      intensity: state.intensity,
      depth: depthMultiplier
    };
    
    for (const [key, value] of Object.entries(currentValues)) {
      const previous = this.previousCSSValues[key as keyof typeof this.previousCSSValues];
      if (Math.abs(value - previous) >= this.cssChangeThreshold) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Update previous CSS values for change detection
   */
  private updatePreviousCSSValues(): void {
    const state = this.consciousnessState;
    const depthMultiplier = 1 + state.energy * 0.5;
    
    this.previousCSSValues.energy = state.energy;
    this.previousCSSValues.valence = state.valence;
    this.previousCSSValues.harmonyHue = state.harmonyHue;
    this.previousCSSValues.intensity = state.intensity;
    this.previousCSSValues.depth = depthMultiplier;
  }
  
  /**
   * Batch apply CSS updates to minimize DOM layout thrashing
   */
  private batchApplyCSSUpdates(updates: Array<[string, string]>): void {
    for (const [property, value] of updates) {
      this.updateCSSVariableGroup('header-consciousness', {
        [property]: value
      });
    }
  }
  
  /**
   * Schedule consciousness variable update with change detection
   */
  private scheduleConsciousnessUpdate(): void {
    this.debouncedEventHandler('cssUpdate', () => {
      if (this.hasSignificantCSSChange()) {
        this.updateHeaderConsciousnessVariables();
        this.updatePreviousCSSValues();
      }
    });
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    try {
      // Check for reduced motion preference
      this.consciousnessState.preferredMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Setup music event listeners
      this.setupMusicEventListeners();
      
      // Setup color harmony listeners
      this.setupColorHarmonyListeners();
      
      // Initialize CSS variables
      this.updateHeaderConsciousnessVariables();
      
      // Start animation loop if motion is enabled
      if (this.consciousnessState.preferredMotion) {
        this.startAnimationLoop();
      }
      
      // Setup performance monitoring
      this.setupPerformanceMonitoring();
      
      Y3K?.debug?.log('HeaderConsciousnessController', 'Header consciousness initialization complete');
      
    } catch (error) {
      Y3K?.debug?.error('HeaderConsciousnessController', 'Initialization failed:', error);
    }
  }
  
  private setupMusicEventListeners(): void {
    // Listen for music energy changes (debounced)
    unifiedEventBus.subscribe('music:energy', (data) => {
      this.debouncedEventHandler('musicEnergy', () => {
        if (typeof data.energy === 'number') {
          this.consciousnessState.energy = Math.max(0, Math.min(1, data.energy));
          this.scheduleConsciousnessUpdate();
        }
        if (typeof data.tempo === 'number') {
          this.consciousnessState.tempo = Math.max(60, Math.min(200, data.tempo));
          this.updateAnimationSpeed();
        }
        if (typeof data.valence === 'number') {
          this.consciousnessState.valence = Math.max(0, Math.min(1, data.valence));
          this.scheduleConsciousnessUpdate();
        }
      });
    }, 'HeaderConsciousnessController');
    
    // Listen for consciousness beat sync events (debounced)
    unifiedEventBus.subscribe('consciousness:beat-sync', (data) => {
      this.debouncedEventHandler('beatSync', () => {
        if (this.consciousnessState.animationActive) {
          const intensity = data.beatPhase || 0.8;
          this.onBeatDetected(intensity);
        }
      });
    }, 'HeaderConsciousnessController');
    
    // Listen for music energy changes - alternative event (debounced)
    unifiedEventBus.subscribe('music:energy-changed', (data) => {
      this.debouncedEventHandler('musicEnergy', () => {
        if (typeof data.energy === 'number') {
          this.consciousnessState.energy = Math.max(0, Math.min(1, data.energy));
          this.scheduleConsciousnessUpdate();
        }
      });
    }, 'HeaderConsciousnessController');
  }
  
  private setupColorHarmonyListeners(): void {
    // Listen for color harmony changes from ColorHarmonyEngine (debounced)
    unifiedEventBus.subscribe('colors:harmonized', (data) => {
      this.debouncedEventHandler('colorHarmony', () => {
        if (data.coordinationMetrics?.coordinationStrategy) {
          this.updateHarmonyHue(data.coordinationMetrics.coordinationStrategy);
        }
      });
    }, 'HeaderConsciousnessController');
    
    // Listen for album color extractions (debounced)
    unifiedEventBus.subscribe('colors:extracted', (data) => {
      this.debouncedEventHandler('colorHarmony', () => {
        // Calculate hue from RGB values if musicData available
        if (data.musicData && typeof data.musicData.energy === 'number') {
          const hue = data.musicData.energy * 360; // Map energy to hue
          this.consciousnessState.harmonyHue = hue;
          this.scheduleConsciousnessUpdate();
        }
      });
    }, 'HeaderConsciousnessController');
  }
  
  private updateHarmonyHue(harmonicMode: string): void {
    // Map harmonic modes to hue rotations for header consciousness
    const harmonyHueMap: Record<string, number> = {
      'monochromatic': 0,
      'complementary': 180,
      'triadic': 120,
      'analogous': 30,
      'tetradic': 90,
      'split-complementary': 150
    };
    
    const baseHue = harmonyHueMap[harmonicMode] || 0;
    this.consciousnessState.harmonyHue = baseHue;
    this.scheduleConsciousnessUpdate();
  }
  
  private onBeatDetected(intensity: number): void {
    // Create temporary energy boost for beat-synchronized effects
    const beatEnergy = Math.min(1, this.consciousnessState.energy + intensity * 0.3);
    
    // Apply beat effect through batched CSS update
    this.batchApplyCSSUpdates([
      ['--header-consciousness-energy', beatEnergy.toString()]
    ]);
    
    // Schedule reset after beat effect duration using frame-based timing
    const resetTime = performance.now() + 150; // 150ms beat flash
    const resetBeatEffect = () => {
      if (performance.now() >= resetTime && this.initialized) {
        this.batchApplyCSSUpdates([
          ['--header-consciousness-energy', this.consciousnessState.energy.toString()]
        ]);
      } else if (this.initialized) {
        requestAnimationFrame(resetBeatEffect);
      }
    };
    requestAnimationFrame(resetBeatEffect);
  }
  
  private updateAnimationSpeed(): void {
    // Adjust animation speed based on tempo
    const tempoMultiplier = this.consciousnessState.tempo / 120; // 120 BPM as baseline
    const baseSpeed = 8; // 8 seconds baseline
    const newSpeed = baseSpeed / tempoMultiplier;
    
    this.batchApplyCSSUpdates([
      ['--header-consciousness-flow-speed', `${Math.max(2, Math.min(16, newSpeed))}s`]
    ]);
  }
  
  private updateHeaderConsciousnessVariables(): void {
    if (!this.initialized) return;
    
    const state = this.consciousnessState;
    
    // Calculate dynamic intensity based on valence and energy
    const dynamicIntensity = state.intensity * (0.6 + state.valence * 0.4) * (0.8 + state.energy * 0.2);
    const depthMultiplier = 1 + state.energy * 0.5;
    
    // Batch all CSS updates to minimize DOM layout thrashing
    this.batchApplyCSSUpdates([
      ['--header-consciousness-energy', state.energy.toString()],
      ['--header-consciousness-harmony', `${state.harmonyHue}deg`],
      ['--header-soul-intensity', dynamicIntensity.toString()],
      ['--header-consciousness-depth', depthMultiplier.toString()]
    ]);
    
    this.consciousnessState.lastUpdateTime = Date.now();
  }
  
  private startAnimationLoop(): void {
    const animate = (currentTime: number) => {
      if (!this.initialized || !this.consciousnessState.animationActive) return;
      
      // Throttle to target framerate
      if (currentTime - this.lastCSSUpdateTime < this.frameThrottleMs) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate frame rate
      const deltaTime = currentTime - this.consciousnessState.lastFrameTime;
      this.consciousnessState.frameRate = 1000 / deltaTime;
      this.consciousnessState.lastFrameTime = currentTime;
      
      // Update variables only if values have changed significantly
      if (currentTime - this.consciousnessState.lastUpdateTime > 100) { // 10fps for variable updates
        if (this.hasSignificantCSSChange()) {
          this.updateHeaderConsciousnessVariables();
          this.updatePreviousCSSValues();
        }
      }
      
      this.lastCSSUpdateTime = currentTime;
      
      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  private setupPerformanceMonitoring(): void {
    // Monitor performance and adjust if needed
    this.updateInterval = window.setInterval(() => {
      if (!this.initialized) return;
      
      // If frame rate drops below threshold, reduce update frequency
      if (this.consciousnessState.frameRate < 30) {
        Y3K?.debug?.warn('HeaderConsciousnessController', 'Performance degradation detected, reducing update frequency');
        // Could implement performance reduction logic here
      }
      
      // Update performance-related CSS variables
      const root = document.documentElement;
      root.style.setProperty('--header-consciousness-performance', 
        this.consciousnessState.frameRate > 50 ? '1' : '0.5');
        
    }, 2000); // Check every 2 seconds
  }
  
  /**
   * Manually update header consciousness intensity
   */
  public setConsciousnessIntensity(intensity: number): void {
    this.consciousnessState.intensity = Math.max(0, Math.min(1, intensity));
    this.updateHeaderConsciousnessVariables();
  }
  
  /**
   * Enable or disable header consciousness animations
   */
  public setAnimationActive(active: boolean): void {
    this.consciousnessState.animationActive = active;
    
    if (!active && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    } else if (active && this.consciousnessState.preferredMotion) {
      this.startAnimationLoop();
    }
  }
  
  /**
   * Get current consciousness state for debugging
   */
  public getConsciousnessState(): HeaderConsciousnessState {
    return { ...this.consciousnessState };
  }
  
  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && 
                     this.consciousnessState.frameRate > 20 &&
                     (Date.now() - this.consciousnessState.lastUpdateTime) < 5000;
    
    return {
      healthy: isHealthy,
      issues: isHealthy ? [] : [
        this.consciousnessState.frameRate <= 20 ? 'Low frame rate detected' : '',
        (Date.now() - this.consciousnessState.lastUpdateTime) >= 5000 ? 'No recent updates' : ''
      ].filter(issue => issue),
      metrics: {
        frameRate: this.consciousnessState.frameRate,
        energy: this.consciousnessState.energy,
        intensity: this.consciousnessState.intensity,
        animationActive: this.consciousnessState.animationActive,
        lastUpdate: this.consciousnessState.lastUpdateTime
      }
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
    
    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = 0;
    }
    
    // Unsubscribe from events
    unifiedEventBus.unsubscribeAll('HeaderConsciousnessController');
    
    Y3K?.debug?.log('HeaderConsciousnessController', 'Header consciousness system cleaned up');
  }

  // Required abstract method implementations
  public async initialize(): Promise<void> {
    return this._baseInitialize();
  }

  public async destroy(): Promise<void> {
    this._performSystemSpecificCleanup();
  }

  public onAnimate(deltaTime: number): void {
    // Animation handled through CSS and event system
    // Update consciousness state if needed
    if (this.consciousnessState.animationActive) {
      this.updateHeaderConsciousnessVariables();
    }
  }
}