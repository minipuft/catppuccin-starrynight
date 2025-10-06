/**
 * Simple Tier-Based Performance System
 * 
 * Replaces complex continuous monitoring with simple tier detection:
 * - Most modern devices get full experience (medium tier)
 * - Only very budget/old devices get restrictions (low tier)  
 * - High-end devices get experimental extras (high tier)
 * - Optional song-energy boost for energetic tracks
 */

import { EnhancedDeviceTierDetector, type TierDetectionResult } from "./EnhancedDeviceTierDetector";
import type { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";
import type { WebGLQuality } from "@/core/webgl/UnifiedWebGLController";
import { unifiedEventBus } from "@/core/events/EventBus";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";

export type PerformanceTier = 'low' | 'medium' | 'high';

export interface TierSettings {
  webglQuality: WebGLQuality;
  animationDensity: number; // 0.0 - 1.0
  updateFrequency: number; // target FPS
  particleMultiplier: number; // 0.0 - 1.0
  corridorEffects: boolean;
  advancedFeatures: boolean;
  experimentalFeatures: boolean;
}

interface EnergyBoostSettings {
  animationBoost: number; // multiplier for animation intensity
  particleBoost: number; // multiplier for particle density
  duration: number; // how long boost lasts after song change (ms)
}

interface MusicAnalysis {
  energy: number; // 0-1
  valence: number; // 0-1  
  bpm: number;
  genre?: string;
  danceability?: number;
}

export class SimpleTierBasedPerformanceSystem implements IManagedSystem {
  public initialized = false;
  
  private enhancedDeviceTierDetector: EnhancedDeviceTierDetector;
  private webglIntegration: WebGLSystemsIntegration | null = null;
  
  // Performance state
  private deviceTier: PerformanceTier = 'medium';
  private tierDetectionResult: TierDetectionResult | null = null;
  private currentSettings: TierSettings;
  private energyBoostActive = false;
  private energyBoostTimeout: number | null = null;
  
  // Configuration
  private tierSettings: Record<PerformanceTier, TierSettings> = {
    low: {
      webglQuality: 'low',
      animationDensity: 0.6, // Still decent for budget devices
      updateFrequency: 45, // Smooth enough
      particleMultiplier: 0.4,
      corridorEffects: false, // Only restriction for low tier
      advancedFeatures: false,
      experimentalFeatures: false
    },
    medium: {
      webglQuality: 'high', // Full experience for standard devices
      animationDensity: 0.9, // Near maximum
      updateFrequency: 60, // Full smoothness
      particleMultiplier: 1.0, // Full particles
      corridorEffects: true, // Full corridor effects
      advancedFeatures: true, // All standard features
      experimentalFeatures: false
    },
    high: {
      webglQuality: 'high',
      animationDensity: 1.0, // Maximum
      updateFrequency: 60,
      particleMultiplier: 1.2, // Extra particles for high-end
      corridorEffects: true,
      advancedFeatures: true,
      experimentalFeatures: true // Experimental features for enthusiasts
    }
  };
  
  private energyBoostSettings: EnergyBoostSettings = {
    animationBoost: 1.3, // 30% boost during energetic songs
    particleBoost: 1.5, // 50% more particles
    duration: 10000 // 10 seconds after song change
  };

  constructor(enhancedDeviceTierDetector: EnhancedDeviceTierDetector) {
    this.enhancedDeviceTierDetector = enhancedDeviceTierDetector;
    this.currentSettings = this.tierSettings.medium; // Safe default
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "Initialized with tier-based performance management");
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Detect device tier once using enhanced detector
    // EnhancedDeviceTierDetector works immediately, no initialization needed
    this.tierDetectionResult = EnhancedDeviceTierDetector.detectTier();
    this.deviceTier = this.tierDetectionResult.tier;
    this.currentSettings = this.tierSettings[this.deviceTier];
    
    // Set up music analysis listener for energy-based adjustments
    this._setupMusicAnalysisListener();
    
    // Apply tier settings to all systems
    this._applyTierSettings();
    
    this.initialized = true;
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "Initialization complete", {
      deviceTier: this.deviceTier,
      confidence: this.tierDetectionResult.confidence,
      reasoning: this.tierDetectionResult.reasoning,
      deviceDescription: EnhancedDeviceTierDetector.getDeviceDescription(this.tierDetectionResult.capabilities),
      settings: this.currentSettings
    });
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "Not initialized",
        system: "SimpleTierBasedPerformanceSystem"
      };
    }
    
    return {
      healthy: true,
      details: `Performance tier: ${this.deviceTier}, Energy boost: ${this.energyBoostActive ? 'active' : 'inactive'}`,
      system: "SimpleTierBasedPerformanceSystem"
    };
  }

  public destroy(): void {
    // Clear energy boost timeout
    if (this.energyBoostTimeout) {
      clearTimeout(this.energyBoostTimeout);
      this.energyBoostTimeout = null;
    }
    
    // Unsubscribe from events
    unifiedEventBus.unsubscribe("colors:extracted");
    unifiedEventBus.unsubscribe("music:track-changed");
    
    this.initialized = false;
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "Destroyed");
  }

  public updateAnimation(deltaTime: number): void {
    // No continuous updates needed - tier-based system is set and forget
  }

  // =============================================================================
  // PUBLIC API
  // =============================================================================

  /**
   * Register WebGL integration for performance management
   */
  public registerWebGLIntegration(integration: WebGLSystemsIntegration): void {
    this.webglIntegration = integration;
    
    // Apply current settings
    if (this.initialized) {
      this._applyWebGLSettings();
    }
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "WebGL integration registered");
  }

  /**
   * Get detected device tier
   */
  public getDeviceTier(): PerformanceTier {
    return this.deviceTier;
  }

  /**
   * Get full tier detection result including reasoning and device capabilities
   */
  public getTierDetectionResult(): TierDetectionResult | null {
    return this.tierDetectionResult;
  }

  /**
   * Get human-readable device description
   */
  public getDeviceDescription(): string {
    return this.tierDetectionResult 
      ? EnhancedDeviceTierDetector.getDeviceDescription(this.tierDetectionResult.capabilities)
      : 'Unknown device';
  }

  /**
   * Get current tier settings
   */
  public getCurrentSettings(): TierSettings {
    return { ...this.currentSettings };
  }

  /**
   * Check if energy boost is currently active
   */
  public hasEnergyBoost(): boolean {
    return this.energyBoostActive;
  }

  /**
   * Get effective settings including energy boost
   */
  public getEffectiveSettings(): TierSettings & { energyBoosted: boolean } {
    const base = { ...this.currentSettings };
    
    if (this.energyBoostActive) {
      return {
        ...base,
        animationDensity: Math.min(1.0, base.animationDensity * this.energyBoostSettings.animationBoost),
        particleMultiplier: base.particleMultiplier * this.energyBoostSettings.particleBoost,
        energyBoosted: true
      };
    }
    
    return {
      ...base,
      energyBoosted: false
    };
  }

  /**
   * Force a specific tier (for testing/debugging)
   */
  public setTier(tier: PerformanceTier): void {
    this.deviceTier = tier;
    this.currentSettings = this.tierSettings[tier];
    this._applyTierSettings();
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", `Tier manually set to ${tier}`);
  }

  // =============================================================================
  // PRIVATE IMPLEMENTATION
  // =============================================================================


  private _setupMusicAnalysisListener(): void {
    // Listen for color extraction events which contain music data
    unifiedEventBus.subscribe("colors:extracted", (data) => {
      if (data.musicData) {
        this._handleMusicAnalysis({
          energy: data.musicData.energy || 0.5,
          valence: data.musicData.valence || 0.5,
          bpm: data.musicData.tempo || 120,
          genre: data.musicData.genre || 'unknown'
        });
      }
    });
    
    // Listen for music track changes
    unifiedEventBus.subscribe("music:track-changed", (data) => {
      this._handleSongChange(data);
    });
  }

  private _handleSongChange(data: any): void {
    // Song changed - check if we need energy boost
    if (data.analysis) {
      this._checkEnergyBoost(data.analysis);
    }
  }

  private _handleMusicAnalysis(analysis: MusicAnalysis): void {
    // Real-time analysis update - check for energy boost
    this._checkEnergyBoost(analysis);
  }

  private _checkEnergyBoost(analysis: MusicAnalysis): void {
    // Determine if this song needs an energy boost
    const isEnergeticSong = (
      analysis.energy > 0.7 && 
      analysis.bpm > 130 && 
      (analysis.danceability || 0) > 0.6
    );
    
    const shouldBoost = isEnergeticSong && !this.energyBoostActive;
    const shouldUnboost = !isEnergeticSong && this.energyBoostActive;
    
    if (shouldBoost) {
      this._activateEnergyBoost(analysis);
    } else if (shouldUnboost) {
      this._deactivateEnergyBoost();
    }
  }

  private _activateEnergyBoost(analysis: MusicAnalysis): void {
    this.energyBoostActive = true;
    
    // Clear any existing timeout
    if (this.energyBoostTimeout) {
      clearTimeout(this.energyBoostTimeout);
    }
    
    // Apply boosted settings
    this._applyTierSettings();
    
    // Set timeout to deactivate boost
    this.energyBoostTimeout = window.setTimeout(() => {
      this._deactivateEnergyBoost();
    }, this.energyBoostSettings.duration);
    
    // Emit performance tier change event
    unifiedEventBus.emit("performance:tier-changed", {
      tier: this.deviceTier as any, // Convert tier format
      previousTier: this.deviceTier as any,
      timestamp: Date.now()
    });
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "Energy boost activated", {
      bpm: analysis.bpm,
      energy: analysis.energy,
      danceability: analysis.danceability
    });
  }

  private _deactivateEnergyBoost(): void {
    if (!this.energyBoostActive) return;
    
    this.energyBoostActive = false;
    
    // Clear timeout
    if (this.energyBoostTimeout) {
      clearTimeout(this.energyBoostTimeout);
      this.energyBoostTimeout = null;
    }
    
    // Return to normal tier settings
    this._applyTierSettings();
    
    // Emit performance tier change event
    unifiedEventBus.emit("performance:tier-changed", {
      tier: this.deviceTier as any,
      previousTier: this.deviceTier as any,
      timestamp: Date.now()
    });
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "Energy boost deactivated");
  }

  private _applyTierSettings(): void {
    // Apply WebGL settings
    this._applyWebGLSettings();
    
    // Apply settings to other systems
    this._applySystemSettings();
    
    // Emit performance tier change event
    const effectiveSettings = this.getEffectiveSettings();
    unifiedEventBus.emit("performance:tier-changed", {
      tier: this.deviceTier as any,
      previousTier: this.deviceTier as any,
      timestamp: Date.now()
    });
  }

  private _applyWebGLSettings(): void {
    if (!this.webglIntegration) return;
    
    const effectiveSettings = this.getEffectiveSettings();
    
    // Set WebGL quality based on tier
    this.webglIntegration.setQuality(effectiveSettings.webglQuality);
    
    Y3KDebug?.debug?.log("SimpleTierBasedPerformanceSystem", "WebGL settings applied", {
      tier: this.deviceTier,
      quality: effectiveSettings.webglQuality,
      energyBoosted: effectiveSettings.energyBoosted
    });
  }

  private _applySystemSettings(): void {
    const effectiveSettings = this.getEffectiveSettings();
    
    // Apply settings to visual systems through performance frame event
    unifiedEventBus.emit("performance:frame", {
      deltaTime: 16, // Approximate 60fps
      fps: effectiveSettings.updateFrequency,
      memoryUsage: 0.5, // Placeholder
      timestamp: Date.now()
    });
  }
}