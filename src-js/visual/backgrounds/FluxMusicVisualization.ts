/**
 * FluxMusicVisualization - Modern CSS-Native Music Consciousness Visualization
 * Part of the Year 3000 Musical Gradient System
 *
 * Modern consciousness-aware music visualization system that integrates with:
 * - VisualSystemFacade for proper dependency injection
 * - BackgroundConsciousnessChoreographer for unified consciousness
 * - CSS-native effects through SCSS instead of DOM manipulation
 * - Unified event bus for music synchronization
 * - Performance monitoring and adaptive quality scaling
 *
 * @architecture Year 3000 System - Phase 4 Facade Integration
 * @replaces Legacy DOM manipulation with CSS consciousness variables
 */

import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult } from "@/types/systems";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";

// Consciousness integration imports
import type { BackgroundConsciousnessChoreographer } from "@/visual/consciousness/BackgroundConsciousnessChoreographer";
import type { 
  ConsciousnessField, 
  BackgroundSystemParticipant 
} from "@/visual/consciousness/BackgroundConsciousnessChoreographer";
import {
  ChoreographyEventResponder,
  MusicSyncUtilities
} from "@/visual/consciousness/SharedBackgroundConsciousnessUtilities";

export interface MusicVisualizationSettings {
  enabled: boolean;
  consciousnessMode: "dormant" | "aware" | "transcendent";
  temporalFlow: "linear" | "organic" | "quantum";
  harmonicSensitivity: "subtle" | "responsive" | "psychedelic";
  visualComplexity: number; // 0-1 overall complexity
  beatSyncIntensity: number; // 0-1 beat response strength
  spectralVisualization: boolean; // Show frequency bands
  emotionalMorphing: boolean; // Morph based on emotional content
}

export interface FluxVisualizationMetrics {
  isActive: boolean;
  consciousnessLevel: number;
  temporalProgress: number;
  harmonicResonance: number;
  spectralData: {
    bass: number;
    mid: number;
    treble: number;
    vocal: number;
  };
  emotionalState: {
    intensity: number;
    valence: number;
  };
}

export class FluxMusicVisualization extends BaseVisualSystem implements BackgroundSystemParticipant {
  // Required BackgroundSystemParticipant implementation
  public override readonly systemName: string = 'FluxMusicVisualization';
  public get systemPriority(): 'low' | 'normal' | 'high' | 'critical' {
    return 'low'; // Music visualization is low priority for performance
  }

  // Modern dependencies (injected through facade)
  private cssConsciousnessController: any = null; // Will be injected by facade
  private eventBus: any = null; // Will be injected by facade
  private consciousnessChoreographer: BackgroundConsciousnessChoreographer | null = null;
  private currentConsciousnessField: ConsciousnessField | null = null;
  
  // CSS class management
  private appliedCSSClasses: Set<string> = new Set();
  private targetElement: HTMLElement | null = null;

  private settings: MusicVisualizationSettings = {
    enabled: true,
    consciousnessMode: "aware",
    temporalFlow: "organic",
    harmonicSensitivity: "responsive",
    visualComplexity: 0.7,
    beatSyncIntensity: 0.8,
    spectralVisualization: true,
    emotionalMorphing: true
  };

  // Modern state management
  private currentMetrics: FluxVisualizationMetrics;
  private lastMusicUpdate = 0;
  private animationPhase = 0;
  public override isActive = false; // Override base class property
  
  // Performance tracking
  private updateCount = 0;
  private averageUpdateTime = 0;

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof Year3000Utilities,
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer = year3000System?.backgroundConsciousnessChoreographer || null;
    
    // Initialize current metrics
    this.currentMetrics = this.createInitialMetrics();
    
    // Find target element for CSS class application
    this.targetElement = document.body; // Fallback to body
    
    Y3K?.debug?.log('FluxMusicVisualization', 'Modern CSS-native music visualization initialized');
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Load settings
    this.loadSettings();

    if (!this.settings.enabled) {
      Y3K?.debug?.log("FluxMusicVisualization", "Music visualization disabled");
      return;
    }

    try {
      // Initialize CSS class management
      this.initializeCSSIntegration();
      
      // Subscribe to unified event bus
      this.subscribeToEvents();
      
      // Register with consciousness choreographer
      this.registerWithConsciousnessChoreographer();
      
      // Apply initial CSS state
      this.updateCSSState();
      
      this.isActive = true;
      
      Y3K?.debug?.log("FluxMusicVisualization", "Modern CSS-native visualization system activated");
      
    } catch (error) {
      Y3K?.debug?.error("FluxMusicVisualization", "Failed to initialize:", error);
    }
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      this.settings.consciousnessMode = this.settingsManager.get("sn-gradient-consciousness-mode" as any) || "aware";
      this.settings.temporalFlow = this.settingsManager.get("sn-gradient-temporal-flow" as any) || "organic";
      this.settings.harmonicSensitivity = this.settingsManager.get("sn-gradient-harmonic-sensitivity" as any) || "responsive";
      
      // Map settings to numeric values
      this.settings.visualComplexity = this.mapComplexity(this.settings.consciousnessMode);
      this.settings.beatSyncIntensity = this.mapSensitivity(this.settings.harmonicSensitivity);
      
    } catch (error) {
      Y3K?.debug?.warn("FluxMusicVisualization", "Failed to load settings:", error);
    }
  }

  /**
   * Initialize CSS integration and target element discovery
   */
  private initializeCSSIntegration(): void {
    // Find best target element for CSS class application
    const containers = [
      ".Root__main-view",
      ".main-view-container", 
      ".Root__top-container",
      "body"
    ];

    for (const selector of containers) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        this.targetElement = element;
        break;
      }
    }

    Y3K?.debug?.log("FluxMusicVisualization", `CSS target element: ${this.targetElement?.tagName || 'body'}`);
  }

  /**
   * Create initial metrics object
   */
  private createInitialMetrics(): FluxVisualizationMetrics {
    return {
      isActive: this.isActive,
      consciousnessLevel: 0,
      temporalProgress: 0,
      harmonicResonance: 0,
      spectralData: {
        bass: 0,
        mid: 0,
        treble: 0,
        vocal: 0
      },
      emotionalState: {
        intensity: 0.5,
        valence: 0.5
      }
    };
  }

  private mapComplexity(mode: "dormant" | "aware" | "transcendent"): number {
    switch (mode) {
      case "dormant": return 0.3;
      case "aware": return 0.7;
      case "transcendent": return 1.0;
      default: return 0.7;
    }
  }

  private mapSensitivity(sensitivity: "subtle" | "responsive" | "psychedelic"): number {
    switch (sensitivity) {
      case "subtle": return 0.4;
      case "responsive": return 0.8;
      case "psychedelic": return 1.0;
      default: return 0.8;
    }
  }

  /**
   * Register with consciousness choreographer for unified consciousness
   */
  private registerWithConsciousnessChoreographer(): void {
    if (!this.consciousnessChoreographer) {
      Y3K?.debug?.log('FluxMusicVisualization', 'Consciousness choreographer not available, skipping registration');
      return;
    }
    
    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3K?.debug?.log('FluxMusicVisualization', 'Successfully registered with consciousness choreographer');
    } catch (error) {
      Y3K?.debug?.error('FluxMusicVisualization', 'Failed to register with consciousness choreographer:', error);
    }
  }

  /**
   * Update CSS state and classes based on current settings and metrics
   */
  private updateCSSState(): void {
    if (!this.targetElement || !this.cssConsciousnessController) return;

    // Apply consciousness mode class
    this.applyCSSClass(`sn-consciousness-${this.settings.consciousnessMode}`);
    
    // Apply temporal flow class
    this.applyCSSClass(`sn-temporal-${this.settings.temporalFlow}`);
    
    // Apply harmonic sensitivity class
    this.applyCSSClass(`sn-harmonic-${this.settings.harmonicSensitivity}`);
    
    // Apply enabled/disabled state
    if (this.settings.enabled) {
      this.removeCSSClass('sn-flux-disabled');
    } else {
      this.applyCSSClass('sn-flux-disabled');
    }

    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Apply CSS class with tracking
   */
  private applyCSSClass(className: string): void {
    if (!this.targetElement || this.appliedCSSClasses.has(className)) return;
    
    this.targetElement.classList.add(className);
    this.appliedCSSClasses.add(className);
  }

  /**
   * Remove CSS class with tracking
   */
  private removeCSSClass(className: string): void {
    if (!this.targetElement || !this.appliedCSSClasses.has(className)) return;
    
    this.targetElement.classList.remove(className);
    this.appliedCSSClasses.delete(className);
  }

  /**
   * Update CSS variables for visualization effects
   */
  private updateCSSVariables(): void {
    if (!this.cssConsciousnessController) return;

    const metrics = this.currentMetrics;
    
    // Core visualization variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-consciousness-pulse", 
      metrics.consciousnessLevel.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-temporal-flow-progress", 
      metrics.temporalProgress.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-harmonic-rotation", 
      `${metrics.harmonicResonance * 360}deg`
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-harmonic-resonance", 
      metrics.harmonicResonance.toString()
    );
    
    // Spectral data variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-spectral-bass", 
      metrics.spectralData.bass.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-spectral-mid", 
      metrics.spectralData.mid.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-spectral-treble", 
      metrics.spectralData.treble.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-spectral-vocal", 
      metrics.spectralData.vocal.toString()
    );
    
    // Emotional state variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-emotional-intensity", 
      metrics.emotionalState.intensity.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-emotional-valence", 
      metrics.emotionalState.valence.toString()
    );
    
    // Settings-based variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-beat-intensity", 
      this.settings.beatSyncIntensity.toString()
    );
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-spectral-enabled", 
      this.settings.spectralVisualization ? "1" : "0"
    );
  }

  /**
   * Subscribe to unified event bus for music and consciousness events
   */
  private subscribeToEvents(): void {
    // Subscribe to music sync events through event bus
    if (this.eventBus) {
      this.eventBus.subscribe('music-sync:beat-detected', this.handleBeatEvent.bind(this));
      this.eventBus.subscribe('music-sync:energy-changed', this.handleEnergyChange.bind(this));
      this.eventBus.subscribe('music-sync:valence-changed', this.handleValenceChange.bind(this));
      this.eventBus.subscribe('music-sync:spectral-data', this.handleSpectralData.bind(this));
    } else {
      // Fallback to direct event listeners if event bus not available
      document.addEventListener('music-sync:beat-detected', this.handleBeatEvent.bind(this));
      document.addEventListener('music-sync:energy-changed', this.handleEnergyChange.bind(this));
      document.addEventListener('music-sync:valence-changed', this.handleValenceChange.bind(this));
      document.addEventListener('music-sync:spectral-data', this.handleSpectralData.bind(this));
    }
    
    // Subscribe to settings changes
    if (this.settingsManager) {
      document.addEventListener("year3000SystemSettingsChanged", this.handleSettingsChange.bind(this));
    }
    
    Y3K?.debug?.log("FluxMusicVisualization", "Subscribed to unified event system");
  }

  /**
   * Handle beat detection events with consciousness awareness
   */
  private handleBeatEvent(event: Event): void {
    const currentTime = performance.now();
    
    // Throttle beat updates for performance
    if (!MusicSyncUtilities.shouldUpdateMusic(this.lastMusicUpdate, 100)) return;
    this.lastMusicUpdate = currentTime;
    
    const customEvent = event as CustomEvent;
    const { intensity = 0.5 } = customEvent.detail || {};
    
    // Increment animation phase
    this.animationPhase = MusicSyncUtilities.incrementAnimationPhase(
      this.animationPhase, intensity, 0.1
    );
    
    // Update consciousness level based on beat intensity
    this.currentMetrics.consciousnessLevel = Math.min(1.0, intensity * this.settings.visualComplexity);
    
    // Apply beat pulse class temporarily
    this.applyCSSClass('sn-flux-beat-active');
    setTimeout(() => {
      this.removeCSSClass('sn-flux-beat-active');
    }, 500);
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Handle energy changes with consciousness adaptation
   */
  private handleEnergyChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { energy = 0 } = customEvent.detail || {};
    
    // Update temporal flow progress based on energy
    this.currentMetrics.temporalProgress = energy;
    this.currentMetrics.emotionalState.intensity = energy;
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Handle valence changes for emotional mapping
   */
  private handleValenceChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { valence = 0.5 } = customEvent.detail || {};
    
    // Update emotional valence and harmonic resonance
    this.currentMetrics.emotionalState.valence = valence;
    this.currentMetrics.harmonicResonance = valence;
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Handle spectral data for frequency visualization
   */
  private handleSpectralData(event: Event): void {
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail;
    
    if (!spectralData) return;
    
    // Map spectral data to metrics
    this.currentMetrics.spectralData = {
      bass: spectralData.bassLevel || 0,
      mid: spectralData.midLevel || 0,
      treble: spectralData.trebleLevel || 0,
      vocal: spectralData.vocalLevel || 0
    };
    
    // Update consciousness level based on overall energy
    const averageEnergy = (this.currentMetrics.spectralData.bass + 
                          this.currentMetrics.spectralData.mid + 
                          this.currentMetrics.spectralData.treble + 
                          this.currentMetrics.spectralData.vocal) / 4;
    
    this.currentMetrics.consciousnessLevel = averageEnergy * this.settings.visualComplexity;
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Set CSS consciousness controller (injected by facade)
   */
  public setUnifiedCSSConsciousnessController(controller: any): void {
    this.cssConsciousnessController = controller;
    Y3K?.debug?.log("FluxMusicVisualization", "CSS consciousness controller injected");
  }

  /**
   * Set event bus (injected by facade)
   */
  public setEventBus(eventBus: any): void {
    this.eventBus = eventBus;
    Y3K?.debug?.log("FluxMusicVisualization", "Event bus injected");
  }

  public override handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key } = customEvent.detail;
    
    if (key.startsWith("sn-gradient-")) {
      this.loadSettings();
      this.updateCSSState();
    }
  }

  public override updateAnimation(deltaTime: number): void {
    if (!this.isActive) return;
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
    
    // Apply organic breathing effects through CSS variables
    this.applyBreathingEffects(deltaTime);
  }

  /**
   * Update performance metrics for monitoring
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.updateCount++;
    
    // Track average update time
    this.averageUpdateTime = (this.averageUpdateTime * 0.9) + (deltaTime * 0.1);
    
    // Report performance metrics periodically
    if (this.updateCount % 300 === 0) { // Every ~5 seconds at 60fps
      this.performanceMonitor?.recordMetric(
        'FluxMusicVisualization_Update',
        this.averageUpdateTime
      );
    }
  }

  /**
   * Apply organic breathing effects through CSS variables
   */
  private applyBreathingEffects(deltaTime: number): void {
    if (!this.cssConsciousnessController || !this.currentConsciousnessField) return;
    
    // Calculate breathing modulation
    const breathingPhase = (deltaTime * 0.001) % (Math.PI * 2);
    const breathingScale = 1 + Math.sin(breathingPhase) * 0.02;
    
    // Apply breathing to energy level for subtle effects
    const energyWithBreathing = this.currentMetrics.emotionalState.intensity * breathingScale;
    
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-flux-energy-level", 
      energyWithBreathing.toString()
    );
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant('FluxMusicVisualization');
        Y3K?.debug?.log('FluxMusicVisualization', 'Unregistered from consciousness choreographer');
      } catch (error) {
        Y3K?.debug?.error('FluxMusicVisualization', 'Error unregistering from consciousness choreographer:', error);
      }
    }
    
    // Remove event listeners
    if (this.eventBus) {
      this.eventBus.unsubscribe('music-sync:beat-detected');
      this.eventBus.unsubscribe('music-sync:energy-changed');
      this.eventBus.unsubscribe('music-sync:valence-changed');
      this.eventBus.unsubscribe('music-sync:spectral-data');
    } else {
      // Clean up fallback direct listeners
      document.removeEventListener('music-sync:beat-detected', this.handleBeatEvent.bind(this));
      document.removeEventListener('music-sync:energy-changed', this.handleEnergyChange.bind(this));
      document.removeEventListener('music-sync:valence-changed', this.handleValenceChange.bind(this));
      document.removeEventListener('music-sync:spectral-data', this.handleSpectralData.bind(this));
    }
    
    document.removeEventListener("year3000SystemSettingsChanged", this.handleSettingsChange.bind(this));
    
    // Remove applied CSS classes
    if (this.targetElement) {
      this.appliedCSSClasses.forEach(className => {
        this.targetElement!.classList.remove(className);
      });
    }
    
    this.appliedCSSClasses.clear();
    this.isActive = false;
    
    Y3K?.debug?.log('FluxMusicVisualization', 'Modern CSS-native system cleanup completed');
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public getConsciousnessContribution(): any {
    return {
      visualizationIntensity: this.currentMetrics.consciousnessLevel,
      temporalFlow: this.currentMetrics.temporalProgress,
      harmonicResonance: this.currentMetrics.harmonicResonance,
      spectralContribution: this.currentMetrics.spectralData,
      emotionalContribution: this.currentMetrics.emotionalState,
      systemLoad: this.isActive ? 0.2 : 0 // Low load as it's CSS-native
    };
  }

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    try {
      this.currentConsciousnessField = field;
      
      // Update metrics based on consciousness field
      this.adaptToConsciousnessField(field);
      
      // Update CSS variables
      this.updateCSSVariables();
      
      Y3K?.debug?.log('FluxMusicVisualization', 'Updated from consciousness field:', {
        rhythmicPulse: field.rhythmicPulse,
        energyResonance: field.energyResonance,
        isActive: this.isActive
      });
    } catch (error) {
      Y3K?.debug?.error('FluxMusicVisualization', 'Error updating from consciousness field:', error);
    }
  }

  public onChoreographyEvent(eventType: string, payload: any): void {
    try {
      switch (eventType) {
        case 'choreography:rhythm-shift':
          this.handleRhythmShift(payload);
          break;
          
        case 'choreography:energy-surge':
          this.handleEnergySurge(payload);
          break;
          
        case 'consciousness:breathing-cycle':
          this.handleBreathingCycle(payload);
          break;
          
        case 'consciousness:performance-adapt':
          this.handlePerformanceAdapt(payload);
          break;
      }
      
      Y3K?.debug?.log('FluxMusicVisualization', `Handled choreography event: ${eventType}`, payload);
    } catch (error) {
      Y3K?.debug?.error('FluxMusicVisualization', `Error handling choreography event ${eventType}:`, error);
    }
  }

  /**
   * Adapt visualization to consciousness field changes
   */
  private adaptToConsciousnessField(field: ConsciousnessField): void {
    // Update consciousness level based on field energy
    this.currentMetrics.consciousnessLevel = Math.min(1.0, 
      field.energyResonance * this.settings.visualComplexity
    );
    
    // Update temporal flow based on musical flow
    const flowMagnitude = Math.sqrt(field.musicalFlow.x ** 2 + field.musicalFlow.y ** 2);
    this.currentMetrics.temporalProgress = Math.min(1.0, flowMagnitude);
    
    // Update harmonic resonance based on rhythmic pulse
    this.currentMetrics.harmonicResonance = field.rhythmicPulse;
    
    // Update emotional state based on consciousness field
    this.currentMetrics.emotionalState.intensity = field.energyResonance;
  }

  /**
   * Handle rhythm shift events
   */
  private handleRhythmShift(payload: any): void {
    const newBPM = payload.newRhythm?.bpm || 120;
    const rhythmMultiplier = ChoreographyEventResponder.handleRhythmShift(1.0, newBPM);
    
    // Adjust visualization intensity based on rhythm
    this.currentMetrics.consciousnessLevel *= rhythmMultiplier;
    this.updateCSSVariables();
  }

  /**
   * Handle energy surge events
   */
  private handleEnergySurge(payload: any): void {
    const surgeIntensity = payload.intensity || 1.0;
    
    // Enhance visualization during energy surges
    this.currentMetrics.consciousnessLevel = Math.min(1.0, 
      this.currentMetrics.consciousnessLevel + surgeIntensity * 0.3
    );
    
    this.currentMetrics.emotionalState.intensity = Math.min(1.0,
      this.currentMetrics.emotionalState.intensity + surgeIntensity * 0.2
    );
    
    this.updateCSSVariables();
  }

  /**
   * Handle breathing cycle events
   */
  private handleBreathingCycle(payload: any): void {
    const breathingPhase = payload.phase || 0;
    const breathingIntensity = payload.intensity || 0.5;
    
    // Apply breathing modulation to consciousness level
    const breathingEffect = ChoreographyEventResponder.handleBreathingCycle(
      1.0, breathingPhase, breathingIntensity
    );
    
    this.currentMetrics.consciousnessLevel *= breathingEffect;
    this.updateCSSVariables();
  }

  /**
   * Handle performance adaptation events
   */
  private handlePerformanceAdapt(payload: any): void {
    const newMode = payload.newMode;
    if (!newMode) return;
    
    // Adapt visualization complexity based on performance mode
    if (newMode.qualityLevel < 0.3) {
      this.settings.visualComplexity = 0.3;
      this.applyCSSClass('sn-performance-mode');
    } else if (newMode.qualityLevel < 0.7) {
      this.settings.visualComplexity = 0.6;
      this.removeCSSClass('sn-performance-mode');
    } else {
      this.settings.visualComplexity = 1.0;
      this.removeCSSClass('sn-performance-mode');
    }
    
    this.updateCSSVariables();
    
    Y3K?.debug?.log('FluxMusicVisualization', `Adapted to performance mode: ${newMode.name}`, {
      complexity: this.settings.visualComplexity
    });
  }

  // ===================================================================
  // PUBLIC API FOR COMPATIBILITY AND CONTROL
  // ===================================================================

  /**
   * Set consciousness mode and update CSS classes
   */
  public setConsciousnessMode(mode: "dormant" | "aware" | "transcendent"): void {
    // Remove old mode class
    this.removeCSSClass(`sn-consciousness-${this.settings.consciousnessMode}`);
    
    // Update settings
    this.settings.consciousnessMode = mode;
    this.settings.visualComplexity = this.mapComplexity(mode);
    
    // Apply new mode class
    this.applyCSSClass(`sn-consciousness-${mode}`);
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Set harmonic sensitivity and update CSS classes
   */
  public setHarmonicSensitivity(sensitivity: "subtle" | "responsive" | "psychedelic"): void {
    // Remove old sensitivity class
    this.removeCSSClass(`sn-harmonic-${this.settings.harmonicSensitivity}`);
    
    // Update settings
    this.settings.harmonicSensitivity = sensitivity;
    this.settings.beatSyncIntensity = this.mapSensitivity(sensitivity);
    
    // Apply new sensitivity class
    this.applyCSSClass(`sn-harmonic-${sensitivity}`);
    
    // Update CSS variables
    this.updateCSSVariables();
  }

  /**
   * Toggle spectral visualization
   */
  public toggleSpectralVisualization(enabled: boolean): void {
    this.settings.spectralVisualization = enabled;
    
    // Update CSS variable
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-flux-spectral-enabled", 
        enabled ? "1" : "0"
      );
    }
  }

  /**
   * Get current visualization metrics
   */
  public getVisualizationMetrics(): FluxVisualizationMetrics & {
    settings: MusicVisualizationSettings;
    updateCount: number;
    averageUpdateTime: number;
  } {
    return {
      ...this.currentMetrics,
      settings: { ...this.settings },
      updateCount: this.updateCount,
      averageUpdateTime: this.averageUpdateTime
    };
  }

  /**
   * Health check for system monitoring
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.isActive && 
                     this.targetElement !== null && 
                     this.cssConsciousnessController !== null &&
                     this.averageUpdateTime < 16.67; // 60fps target
    
    return {
      healthy: isHealthy,
      ok: isHealthy,
      details: `Active: ${this.isActive}, Updates: ${this.updateCount}, ` +
               `AvgTime: ${this.averageUpdateTime.toFixed(1)}ms, ` +
               `Consciousness: ${this.currentMetrics.consciousnessLevel.toFixed(2)}`,
      system: 'FluxMusicVisualization'
    };
  }
}