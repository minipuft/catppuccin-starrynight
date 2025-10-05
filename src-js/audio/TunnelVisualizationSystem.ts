/**
 * TunnelVisualizationSystem - Music-Responsive Tunnel Visualization
 * Part of the Year 3000 System audio-visual pipeline
 *
 * Manages dynamic tunnel visual effects with music-responsive lighting
 * - Music-responsive tunnel dimensions and lighting intensity
 * - Advanced lighting calculations (shadows, edge highlights, depth illumination)
 * - Integration with ColorHarmonyEngine for color temperature effects
 * - Performance-optimized tunnel rendering with device-aware scaling
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { UnifiedCSSVariableManager, getGlobalUnifiedCSSManager } from "@/core/css/UnifiedCSSVariableManager";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import { BaseVisualSystem } from "../visual/base/BaseVisualSystem";

// Interfaces for tunnel visualization system
interface TunnelVisualizationSettings {
  enabled: boolean;
  tunnelEnabled: boolean;

  // Tunnel geometry
  tunnelWidth: number;
  tunnelDepth: number;
  tunnelSegmentCount: number;
  perspectiveFactor: number;
  
  // Lighting system
  lightingIntensity: number;
  ambientShadowLevel: number;
  edgeHighlightStrength: number;
  endLightIntensity: number;
  atmosphericHaze: number;
  
  // Color and atmosphere
  wallColor: [number, number, number];
  lightTemperatureRange: [number, number]; // Cold to warm
  surfaceShimmerStrength: number;
  
  // Music responsiveness
  musicResponseStrength: number;
  beatLightPulse: number;
  bassWidthModulation: number;
  energyColorShift: number;
  valenceTemperatureShift: number;
  
  // Performance settings
  qualityLevel: 'low' | 'medium' | 'high';
  enableAtmosphericEffects: boolean;
  enableComplexLighting: boolean;
}

interface CorridorLightingState {
  ambientShadow: number;
  edgeHighlight: number;
  endLightIntensity: number;
  colorTemperature: number; // 0-1 from cold to warm
  atmosphericHaze: number;
  surfaceShimmer: number;
  timestamp: number;
}

interface MusicAnalysisData {
  energy: number;
  valence: number;
  tempo: number;
  beatIntensity: number;
  bassResponse: number;
  spectralCentroid: number;
}

/**
 * TunnelVisualizationSystem manages music-responsive tunnel visualization effects
 * - Real-time lighting calculations based on music analysis
 * - Dynamic tunnel geometry responsive to music energy and bass
 * - Color temperature shifts based on musical mood (valence)
 * - Performance-optimized rendering with quality scaling
 */
export class TunnelVisualizationSystem extends BaseVisualSystem {
  private tunnelSettings: TunnelVisualizationSettings;
  private currentLightingState: CorridorLightingState;
  private cssController: UnifiedCSSVariableManager | null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;

  private lastBeatTime = 0;
  private lastLightingUpdate = 0;
  private lightingSmoothingBuffer: CorridorLightingState[] = [];
  private currentMusicAnalysis: MusicAnalysisData | null = null;

  private boundBeatHandler: ((event: Event) => void) | null = null;
  private boundEnergyHandler: ((event: Event) => void) | null = null;
  private boundSpectralHandler: ((event: Event) => void) | null = null;

  private updateThrottleInterval = 1000 / 30; // 30 FPS for smooth updates

  constructor(
    config: Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
  ) {
    super(config, utils, performanceMonitor, musicSyncService);

    // Initialize CSS Consciousness Controller
    const cssController = getGlobalUnifiedCSSManager();
    if (cssController) {
      this.cssController = cssController;
    } else {
      Y3KDebug?.debug?.warn(
        "TunnelVisualizationSystem",
        "UnifiedCSSVariableManager not available"
      );
      this.cssController = null;
    }

    // Initialize tunnel visualization settings
    this.tunnelSettings = {
      enabled: true,
      tunnelEnabled: true,
      
      // Corridor geometry
      tunnelWidth: 0.15,
      tunnelDepth: 0.4,
      tunnelSegmentCount: 4,
      perspectiveFactor: 2.0,
      
      // Lighting system
      lightingIntensity: 0.8,
      ambientShadowLevel: 0.15,
      edgeHighlightStrength: 0.8,
      endLightIntensity: 1.2,
      atmosphericHaze: 0.2,
      
      // Color and atmosphere
      wallColor: [0.1, 0.12, 0.15], // Dark stone
      lightTemperatureRange: [0.3, 0.9], // Cool blue to warm orange
      surfaceShimmerStrength: 0.05,
      
      // Music responsiveness
      musicResponseStrength: 0.8,
      beatLightPulse: 0.4,
      bassWidthModulation: 0.3,
      energyColorShift: 0.7,
      valenceTemperatureShift: 0.6,
      
      // Performance settings
      qualityLevel: 'high',
      enableAtmosphericEffects: true,
      enableComplexLighting: true,
    };

    // Initialize lighting state
    this.currentLightingState = {
      ambientShadow: this.tunnelSettings.ambientShadowLevel,
      edgeHighlight: this.tunnelSettings.edgeHighlightStrength,
      endLightIntensity: this.tunnelSettings.endLightIntensity,
      colorTemperature: 0.5,
      atmosphericHaze: this.tunnelSettings.atmosphericHaze,
      surfaceShimmer: this.tunnelSettings.surfaceShimmerStrength,
      timestamp: performance.now(),
    };

    // Bind event handlers
    this.boundBeatHandler = this.handleBeatEvent.bind(this);
    this.boundEnergyHandler = this.handleEnergyChange.bind(this);
    this.boundSpectralHandler = this.handleSpectralAnalysis.bind(this);

    // Initialize smoothing buffer
    this.lightingSmoothingBuffer = Array(3)
      .fill(null)
      .map(() => ({ ...this.currentLightingState }));
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    this.subscribeToMusicEvents();
    this.startTunnelUpdates();

    Y3KDebug?.debug?.log(
      "TunnelVisualizationSystem",
      "Tunnel tunnel system initialized"
    );
  }

  private subscribeToMusicEvents(): void {
    if (this.boundBeatHandler) {
      document.addEventListener("music-sync:beat", this.boundBeatHandler);
    }

    if (this.boundEnergyHandler) {
      document.addEventListener(
        "music-sync:energy-changed",
        this.boundEnergyHandler
      );
    }

    if (this.boundSpectralHandler) {
      document.addEventListener(
        "music-sync:spectral-analysis",
        this.boundSpectralHandler
      );
    }
  }

  private handleBeatEvent(event: Event): void {
    const currentTime = performance.now();

    // Throttle beat processing
    if (currentTime - this.lastBeatTime < 50) return;
    this.lastBeatTime = currentTime;

    const customEvent = event as CustomEvent;
    const { intensity, bpm, confidence } = customEvent.detail;

    // Calculate beat-driven lighting pulse
    this.updateBeatLighting(intensity, bpm, confidence);

    Y3KDebug?.debug?.log(
      "TunnelVisualizationSystem",
      `Beat lighting pulse: intensity ${intensity.toFixed(2)}, bpm ${bpm}`
    );
  }

  private handleEnergyChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { energy, valence } = customEvent.detail;

    // Update current music analysis
    this.currentMusicAnalysis = {
      energy,
      valence,
      tempo: 120, // Default
      beatIntensity: energy,
      bassResponse: energy * 0.8,
      spectralCentroid: 0.5,
    };

    // Update lighting based on energy and valence
    this.updateEnergyLighting(energy, valence);
  }

  private handleSpectralAnalysis(event: Event): void {
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail;

    if (this.currentMusicAnalysis) {
      this.currentMusicAnalysis.bassResponse = spectralData.bassEnergy || 0.5;
      this.currentMusicAnalysis.spectralCentroid = spectralData.harmonicContent || 0.5;
    }

    // Update tunnel width based on bass response
    this.updateCorridorGeometry(spectralData.bassEnergy || 0.5);
  }

  private updateBeatLighting(intensity: number, bpm: number, confidence: number): void {
    const beatPulse = intensity * this.tunnelSettings.beatLightPulse * confidence;

    // Update end light intensity with pulse
    const newLightingState = { ...this.currentLightingState };
    newLightingState.endLightIntensity = 
      this.tunnelSettings.endLightIntensity * (1.0 + beatPulse);

    // Update edge highlights with beat response
    newLightingState.edgeHighlight = 
      this.tunnelSettings.edgeHighlightStrength * (1.0 + beatPulse * 0.5);

    // Add to smoothing buffer and update
    this.updateLightingState(newLightingState);
  }

  private updateEnergyLighting(energy: number, valence: number): void {
    const newLightingState = { ...this.currentLightingState };

    // Energy affects overall lighting intensity
    const energyModifier = energy * this.tunnelSettings.musicResponseStrength;
    newLightingState.endLightIntensity = 
      this.tunnelSettings.lightingIntensity * (0.5 + energyModifier);

    // Valence affects color temperature (happy = warm, sad = cool)
    const temperatureRange = this.tunnelSettings.lightTemperatureRange;
    newLightingState.colorTemperature = 
      temperatureRange[0] + (valence * this.tunnelSettings.valenceTemperatureShift * 
      (temperatureRange[1] - temperatureRange[0]));

    // Energy affects magical shimmer
    newLightingState.surfaceShimmer = 
      this.tunnelSettings.surfaceShimmerStrength * (0.8 + energy * 0.4);

    this.updateLightingState(newLightingState);
  }

  private updateCorridorGeometry(bassResponse: number): void {
    // Bass response affects tunnel width
    const bassMod = bassResponse * this.tunnelSettings.bassWidthModulation;
    const newTunnelWidth = this.tunnelSettings.tunnelWidth * (1.0 + bassMod);

    // Update CSS variables for geometry
    if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(
        "--sn-tunnel-width",
        newTunnelWidth.toFixed(3)
      );
    }
  }

  private updateLightingState(newState: CorridorLightingState): void {
    newState.timestamp = performance.now();

    // Add to smoothing buffer
    this.lightingSmoothingBuffer.push(newState);
    if (this.lightingSmoothingBuffer.length > 3) {
      this.lightingSmoothingBuffer.shift();
    }

    // Calculate smoothed lighting
    this.currentLightingState = this.calculateSmoothedLighting();

    // Update CSS variables
    this.updateCSSVariables();
  }

  private calculateSmoothedLighting(): CorridorLightingState {
    const buffer = this.lightingSmoothingBuffer;
    const smoothingFactor = 0.7;

    if (buffer.length === 0) return this.currentLightingState;

    let smoothed = { ...buffer[0]! };

    for (let i = 1; i < buffer.length; i++) {
      const current = buffer[i]!;
      smoothed.ambientShadow = smoothed.ambientShadow * smoothingFactor + current.ambientShadow * (1 - smoothingFactor);
      smoothed.edgeHighlight = smoothed.edgeHighlight * smoothingFactor + current.edgeHighlight * (1 - smoothingFactor);
      smoothed.endLightIntensity = smoothed.endLightIntensity * smoothingFactor + current.endLightIntensity * (1 - smoothingFactor);
      smoothed.colorTemperature = smoothed.colorTemperature * smoothingFactor + current.colorTemperature * (1 - smoothingFactor);
      smoothed.atmosphericHaze = smoothed.atmosphericHaze * smoothingFactor + current.atmosphericHaze * (1 - smoothingFactor);
      smoothed.surfaceShimmer = smoothed.surfaceShimmer * smoothingFactor + current.surfaceShimmer * (1 - smoothingFactor);
    }

    smoothed.timestamp = performance.now();
    return smoothed;
  }

  private updateCSSVariables(): void {
    const currentTime = performance.now();

    // Throttle CSS updates to 30 FPS
    if (currentTime - this.lastLightingUpdate < this.updateThrottleInterval) return;
    this.lastLightingUpdate = currentTime;

    if (!this.cssController) return;

    const lighting = this.currentLightingState;

    // Tunnel tunnel control variables
    this.cssController.queueCSSVariableUpdate(
      "--sn-tunnel-enabled",
      this.tunnelSettings.tunnelEnabled ? "1" : "0"
    );

    // Lighting variables
    this.cssController.queueCSSVariableUpdate(
      "--sn-lighting-intensity",
      lighting.endLightIntensity.toFixed(3)
    );

    this.cssController.queueCSSVariableUpdate(
      "--sn-atmospheric-haze",
      lighting.atmosphericHaze.toFixed(3)
    );

    // Wall color
    const [r, g, b] = this.tunnelSettings.wallColor;
    this.cssController.queueCSSVariableUpdate(
      "--sn-wall-color-r",
      r.toFixed(3)
    );
    this.cssController.queueCSSVariableUpdate(
      "--sn-wall-color-g",
      g.toFixed(3)
    );
    this.cssController.queueCSSVariableUpdate(
      "--sn-wall-color-b",
      b.toFixed(3)
    );

    // Color temperature for lighting
    this.cssController.queueCSSVariableUpdate(
      "--sn-light-temperature",
      lighting.colorTemperature.toFixed(3)
    );

    // Tunnel geometry
    this.cssController.queueCSSVariableUpdate(
      "--sn-tunnel-depth",
      this.tunnelSettings.tunnelDepth.toFixed(3)
    );

    this.cssController.queueCSSVariableUpdate(
      "--sn-tunnel-count",
      this.tunnelSettings.tunnelSegmentCount.toString()
    );
  }

  private startTunnelUpdates(): void {
    const updateTunnel = () => {
      if (!this.isActive || !this.tunnelSettings.enabled) return;

      // Update magical shimmer animation
      const currentTime = performance.now();
      const shimmerPhase = (currentTime / 1000) * 0.5;
      const animatedShimmer = this.currentLightingState.surfaceShimmer * 
        (0.9 + Math.sin(shimmerPhase) * 0.1);

      if (this.cssController) {
        this.cssController.queueCSSVariableUpdate(
          "--sn-magical-shimmer",
          animatedShimmer.toFixed(3)
        );
      }

      // Continue updates
      setTimeout(updateTunnel, this.updateThrottleInterval);
    };

    updateTunnel();
  }

  public override updateAnimation(deltaTime: number): void {
    // Update tunnel tunnel animations
    if (this.tunnelSettings.enabled) {
      this.updateTunnelAnimation(deltaTime);
    }
  }

  private updateTunnelAnimation(deltaTime: number): void {
    // Animate atmospheric effects
    const currentTime = performance.now();
    const atmosphericPhase = (currentTime / 1000) * 0.1;
    
    // Subtle atmospheric haze animation
    const animatedHaze = this.currentLightingState.atmosphericHaze * 
      (0.95 + Math.sin(atmosphericPhase) * 0.05);

    if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(
        "--sn-animated-haze",
        animatedHaze.toFixed(3)
      );
    }
  }

  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy =
      this.tunnelSettings.enabled &&
      this.currentLightingState.timestamp > 0 &&
      this.musicSyncService !== null;

    return {
      system: 'TunnelVisualizationSystem',
      healthy: isHealthy,
      metrics: {
        enabled: this.tunnelSettings.enabled,
        lastUpdateTime: this.currentLightingState.timestamp,
        musicSyncConnected: !!this.musicSyncService,
        endLightIntensity: this.currentLightingState.endLightIntensity
      },
      issues: isHealthy ? [] : [
        ...(this.tunnelSettings.enabled ? [] : ['System disabled']),
        ...(this.currentLightingState.timestamp > 0 ? [] : ['No updates received']),
        ...(this.musicSyncService ? [] : ['Music sync disconnected'])
      ]
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Remove event listeners
    if (this.boundBeatHandler) {
      document.removeEventListener("music-sync:beat", this.boundBeatHandler);
    }

    if (this.boundEnergyHandler) {
      document.removeEventListener(
        "music-sync:energy-changed",
        this.boundEnergyHandler
      );
    }

    if (this.boundSpectralHandler) {
      document.removeEventListener(
        "music-sync:spectral-analysis",
        this.boundSpectralHandler
      );
    }

    // Clear event handlers
    this.boundBeatHandler = null;
    this.boundEnergyHandler = null;
    this.boundSpectralHandler = null;
  }

  // ========================================================================
  // PUBLIC API FOR DUNGEON CORRIDOR CONTROL
  // ========================================================================

  /**
   * Enable or disable tunnel tunnel effects
   */
  public setTunnelEnabled(enabled: boolean): void {
    this.tunnelSettings.tunnelEnabled = enabled;
    
    if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(
        "--sn-tunnel-enabled",
        enabled ? "1" : "0"
      );
    }

    Y3KDebug?.debug?.log(
      "TunnelVisualizationSystem",
      `Tunnel tunnels ${enabled ? 'enabled' : 'disabled'}`
    );
  }

  /**
   * Update tunnel tunnel settings
   */
  public updateTunnelSettings(settings: Partial<TunnelVisualizationSettings>): void {
    Object.assign(this.tunnelSettings, settings);
    
    Y3KDebug?.debug?.log(
      "TunnelVisualizationSystem",
      "Tunnel settings updated", settings
    );
  }

  /**
   * Get current lighting state
   */
  public getCurrentLightingState(): CorridorLightingState {
    return { ...this.currentLightingState };
  }

  /**
   * Get tunnel tunnel settings
   */
  public getTunnelSettings(): TunnelVisualizationSettings {
    return { ...this.tunnelSettings };
  }

  /**
   * Set lighting quality level for performance optimization
   */
  public setQualityLevel(level: 'low' | 'medium' | 'high'): void {
    this.tunnelSettings.qualityLevel = level;
    
    // Adjust settings based on quality
    switch (level) {
      case 'low':
        this.tunnelSettings.enableAtmosphericEffects = false;
        this.tunnelSettings.enableComplexLighting = false;
        this.tunnelSettings.tunnelSegmentCount = 2;
        break;
      case 'medium':
        this.tunnelSettings.enableAtmosphericEffects = true;
        this.tunnelSettings.enableComplexLighting = false;
        this.tunnelSettings.tunnelSegmentCount = 3;
        break;
      case 'high':
        this.tunnelSettings.enableAtmosphericEffects = true;
        this.tunnelSettings.enableComplexLighting = true;
        this.tunnelSettings.tunnelSegmentCount = 4;
        break;
    }

    Y3KDebug?.debug?.log(
      "TunnelVisualizationSystem",
      `Quality level set to ${level}`
    );
  }
}