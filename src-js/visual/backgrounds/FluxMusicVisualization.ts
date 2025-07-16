/**
 * FluxMusicVisualization - CSS-Native Music Consciousness Visualization
 * Part of the Year 3000 Musical Gradient System
 *
 * Creates pure CSS music visualization effects that respond to spectral analysis:
 * - Consciousness-pulse animations synced to music
 * - Frequency-reactive visual elements
 * - Temporal flow visualization
 * - Harmonic resonance display
 * - Emotional gradient morphing
 */

import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
import { FluxSpectralAnalyzer, SpectralData } from "@/audio/FluxSpectralAnalyzer";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { Y3K } from "@/debug/SystemHealthMonitor";
import type { Year3000Config } from "@/types/models";

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

export class FluxMusicVisualization extends BaseVisualSystem {
  private spectralAnalyzer: FluxSpectralAnalyzer;
  private cssVariableBatcher: CSSVariableBatcher;
  private visualizationElements: HTMLElement[] = [];
  private boundSpectralHandler: ((event: Event) => void) | null = null;
  private boundBeatHandler: ((event: Event) => void) | null = null;
  private boundSettingsHandler: ((event: Event) => void) | null = null;
  
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

  private lastSpectralData: SpectralData | null = null;
  private animationFrameId: number | null = null;
  private isAnimating = false;

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    this.cssVariableBatcher = new CSSVariableBatcher();
    this.spectralAnalyzer = new FluxSpectralAnalyzer(this.cssVariableBatcher, musicSyncService);
    
    this.boundSpectralHandler = this.handleSpectralData.bind(this);
    this.boundBeatHandler = this.handleBeatDetection.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);
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
      // Initialize spectral analyzer
      await this.spectralAnalyzer.initialize();
      
      // Create visualization elements
      this.createVisualizationElements();
      
      // Subscribe to events
      this.subscribeToEvents();
      
      // Start spectral analysis
      this.spectralAnalyzer.start();
      
      // Start animation loop
      this.startAnimation();
      
      Y3K?.debug?.log("FluxMusicVisualization", "Music visualization system activated");
      
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

  private createVisualizationElements(): void {
    const targetContainer = this.findSpotifyContainer();
    
    // Create consciousness pulse element
    const consciousnessPulse = this.createConsciousnessPulse();
    targetContainer.appendChild(consciousnessPulse);
    this.visualizationElements.push(consciousnessPulse);
    
    // Create frequency band visualizers
    if (this.settings.spectralVisualization) {
      const frequencyBands = this.createFrequencyBands();
      frequencyBands.forEach(band => {
        targetContainer.appendChild(band);
        this.visualizationElements.push(band);
      });
    }
    
    // Create temporal flow visualizer
    const temporalFlow = this.createTemporalFlow();
    targetContainer.appendChild(temporalFlow);
    this.visualizationElements.push(temporalFlow);
    
    // Create harmonic resonance visualizer
    const harmonicResonance = this.createHarmonicResonance();
    targetContainer.appendChild(harmonicResonance);
    this.visualizationElements.push(harmonicResonance);
    
    Y3K?.debug?.log("FluxMusicVisualization", `Created ${this.visualizationElements.length} visualization elements`);
  }

  private createConsciousnessPulse(): HTMLElement {
    const pulse = document.createElement("div");
    pulse.className = "sn-consciousness-pulse";
    pulse.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      margin: -50px 0 0 -50px;
      border-radius: 50%;
      background: radial-gradient(circle, 
        rgba(var(--sn-gradient-primary-rgb), 0.1) 0%, 
        rgba(var(--sn-gradient-secondary-rgb), 0.05) 50%, 
        transparent 100%);
      z-index: -12;
      pointer-events: none;
      will-change: transform, opacity;
      transition: all 0.1s ease-out;
      opacity: 0;
    `;
    
    return pulse;
  }

  private createFrequencyBands(): HTMLElement[] {
    const bands: HTMLElement[] = [];
    const bandNames = ['bass', 'mid', 'treble', 'vocal'];
    
    bandNames.forEach((name, index) => {
      const band = document.createElement("div");
      band.className = `sn-frequency-band sn-frequency-${name}`;
      band.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: ${20 + index * 60}px;
        width: 50px;
        height: 200px;
        background: linear-gradient(to top, 
          rgba(var(--sn-gradient-primary-rgb), 0.8) 0%, 
          rgba(var(--sn-gradient-secondary-rgb), 0.4) 100%);
        z-index: -11;
        pointer-events: none;
        will-change: transform, opacity;
        transform: scaleY(0.1);
        transform-origin: bottom;
        transition: transform 0.1s ease-out;
        opacity: 0;
      `;
      
      bands.push(band);
    });
    
    return bands;
  }

  private createTemporalFlow(): HTMLElement {
    const flow = document.createElement("div");
    flow.className = "sn-temporal-flow";
    flow.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(to right, 
        rgba(var(--sn-gradient-primary-rgb), 0.6) 0%, 
        rgba(var(--sn-gradient-accent-rgb), 0.4) 100%);
      z-index: -10;
      pointer-events: none;
      will-change: transform;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.2s ease-out;
      opacity: 0;
    `;
    
    return flow;
  }

  private createHarmonicResonance(): HTMLElement {
    const resonance = document.createElement("div");
    resonance.className = "sn-harmonic-resonance";
    resonance.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 100px;
      height: 100px;
      background: conic-gradient(
        from 0deg,
        rgba(var(--sn-gradient-primary-rgb), 0.3) 0deg,
        rgba(var(--sn-gradient-secondary-rgb), 0.2) 120deg,
        rgba(var(--sn-gradient-accent-rgb), 0.1) 240deg,
        rgba(var(--sn-gradient-primary-rgb), 0.3) 360deg
      );
      border-radius: 50%;
      z-index: -11;
      pointer-events: none;
      will-change: transform, opacity;
      transform: scale(0.5) rotate(0deg);
      transition: transform 0.2s ease-out;
      opacity: 0;
    `;
    
    return resonance;
  }

  private findSpotifyContainer(): HTMLElement {
    const containers = [
      ".Root__main-view",
      ".main-view-container",
      ".main-gridContainer-gridContainer",
      ".Root__top-container",
      "body"
    ];

    for (const selector of containers) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
    }

    return document.body;
  }

  private subscribeToEvents(): void {
    if (this.boundSpectralHandler) {
      document.addEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    if (this.boundBeatHandler) {
      document.addEventListener("music-sync:beat-detected", this.boundBeatHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.addEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }
  }

  private handleSpectralData(event: Event): void {
    const customEvent = event as CustomEvent;
    const spectralData = customEvent.detail as SpectralData;
    
    if (!spectralData) return;
    
    this.lastSpectralData = spectralData;
    this.updateVisualization(spectralData);
  }

  private handleBeatDetection(event: Event): void {
    const customEvent = event as CustomEvent;
    const { intensity } = customEvent.detail;
    
    // Trigger beat-synchronized effects
    this.triggerBeatPulse(intensity);
  }

  public override handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;
    
    if (key.startsWith("sn-gradient-")) {
      this.loadSettings();
      this.updateVisualizationSettings();
    }
  }

  private updateVisualization(spectralData: SpectralData): void {
    // Update consciousness pulse
    this.updateConsciousnessPulse(spectralData);
    
    // Update frequency bands
    if (this.settings.spectralVisualization) {
      this.updateFrequencyBands(spectralData);
    }
    
    // Update temporal flow
    this.updateTemporalFlow(spectralData);
    
    // Update harmonic resonance
    this.updateHarmonicResonance(spectralData);
    
    // Update CSS variables for gradient consciousness
    this.updateCSSVariables(spectralData);
  }

  private updateConsciousnessPulse(spectralData: SpectralData): void {
    const pulse = this.visualizationElements.find(el => el.className === "sn-consciousness-pulse");
    if (!pulse) return;
    
    const intensity = spectralData.consciousnessLevel * this.settings.visualComplexity;
    const scale = 1 + (spectralData.energyLevel * 2);
    const opacity = intensity * 0.8;
    
    pulse.style.transform = `translate(-50%, -50%) scale(${scale})`;
    pulse.style.opacity = opacity.toString();
    
    // Add pulsing animation based on beat prediction
    if (spectralData.predictedBeatTime < 100) {
      pulse.style.animation = `consciousness-pulse 0.5s ease-out`;
      setTimeout(() => {
        pulse.style.animation = "";
      }, 500);
    }
  }

  private updateFrequencyBands(spectralData: SpectralData): void {
    const bands = ['bass', 'mid', 'treble', 'vocal'];
    const levels = [spectralData.bassLevel, spectralData.midLevel, spectralData.trebleLevel, spectralData.vocalLevel];
    
    bands.forEach((name, index) => {
      const band = this.visualizationElements.find(el => el.className.includes(`sn-frequency-${name}`));
      if (!band) return;
      
      const level = (levels[index] || 0) * this.settings.beatSyncIntensity;
      const scaleY = 0.1 + (level * 0.9);
      const opacity = level * 0.8;
      
      band.style.transform = `scaleY(${scaleY})`;
      band.style.opacity = opacity.toString();
    });
  }

  private updateTemporalFlow(spectralData: SpectralData): void {
    const flow = this.visualizationElements.find(el => el.className === "sn-temporal-flow");
    if (!flow) return;
    
    const progress = spectralData.temporalPhase;
    const opacity = spectralData.energyLevel * 0.6;
    
    flow.style.transform = `scaleX(${progress})`;
    flow.style.opacity = opacity.toString();
  }

  private updateHarmonicResonance(spectralData: SpectralData): void {
    const resonance = this.visualizationElements.find(el => el.className === "sn-harmonic-resonance");
    if (!resonance) return;
    
    const scale = 0.5 + (spectralData.harmonicResonance * 0.5);
    const rotation = spectralData.harmonicResonance * 180;
    const opacity = spectralData.harmonicResonance * 0.7;
    
    resonance.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    resonance.style.opacity = opacity.toString();
  }

  private updateCSSVariables(spectralData: SpectralData): void {
    // Update advanced CSS variables for gradient consciousness
    this.cssVariableBatcher.setProperty("--sn-gradient-consciousness-pulse", spectralData.consciousnessLevel.toString());
    this.cssVariableBatcher.setProperty("--sn-gradient-temporal-flow-speed", (spectralData.energyLevel * 2).toString());
    this.cssVariableBatcher.setProperty("--sn-gradient-harmonic-rotation", `${spectralData.harmonicResonance * 360}deg`);
    this.cssVariableBatcher.setProperty("--sn-gradient-emotional-intensity", spectralData.emotionalValence.toString());
    
    // Update consciousness mode multipliers
    const modeMultiplier = this.settings.visualComplexity;
    this.cssVariableBatcher.setProperty("--sn-gradient-consciousness-multiplier", modeMultiplier.toString());
    
    // Update beat sync intensity
    this.cssVariableBatcher.setProperty("--sn-gradient-beat-sync-intensity", this.settings.beatSyncIntensity.toString());
  }

  private triggerBeatPulse(intensity: number): void {
    // Trigger beat-synchronized effects on all visualization elements
    this.visualizationElements.forEach(element => {
      element.style.transform += ` scale(${1 + intensity * 0.1})`;
      
      // Reset after a short duration
      setTimeout(() => {
        element.style.transform = element.style.transform.replace(/ scale\([^)]*\)$/, "");
      }, 200);
    });
  }

  private updateVisualizationSettings(): void {
    // Update visualization complexity based on settings
    const complexityMultiplier = this.settings.visualComplexity;
    
    this.visualizationElements.forEach(element => {
      const currentOpacity = parseFloat(element.style.opacity) || 1;
      element.style.opacity = (currentOpacity * complexityMultiplier).toString();
    });
  }

  private startAnimation(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    const animate = () => {
      if (!this.isAnimating) return;
      
      // Update animation frame
      this.updateAnimation(performance.now());
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  public override updateAnimation(deltaTime: number): void {
    if (!this.isAnimating || !this.lastSpectralData) return;
    
    // Apply smooth interpolation to visualization elements
    this.visualizationElements.forEach(element => {
      // Add subtle breathing animation
      const breathingScale = 1 + Math.sin(deltaTime * 0.001) * 0.02;
      
      if (element.className === "sn-consciousness-pulse") {
        const currentTransform = element.style.transform;
        element.style.transform = currentTransform + ` scale(${breathingScale})`;
      }
    });
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Stop animation
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Stop spectral analyzer
    this.spectralAnalyzer.stop();
    this.spectralAnalyzer.destroy();
    
    // Remove event listeners
    if (this.boundSpectralHandler) {
      document.removeEventListener("music-sync:spectral-data", this.boundSpectralHandler);
    }
    
    if (this.boundBeatHandler) {
      document.removeEventListener("music-sync:beat-detected", this.boundBeatHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.removeEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }
    
    // Remove DOM elements
    this.visualizationElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    this.visualizationElements = [];
    this.lastSpectralData = null;
  }

  public setConsciousnessMode(mode: "dormant" | "aware" | "transcendent"): void {
    this.settings.consciousnessMode = mode;
    this.settings.visualComplexity = this.mapComplexity(mode);
    this.updateVisualizationSettings();
  }

  public setHarmonicSensitivity(sensitivity: "subtle" | "responsive" | "psychedelic"): void {
    this.settings.harmonicSensitivity = sensitivity;
    this.settings.beatSyncIntensity = this.mapSensitivity(sensitivity);
  }

  public toggleSpectralVisualization(enabled: boolean): void {
    this.settings.spectralVisualization = enabled;
    
    // Show/hide frequency bands
    this.visualizationElements.forEach(element => {
      if (element.className.includes("sn-frequency-")) {
        element.style.display = enabled ? "block" : "none";
      }
    });
  }

  public getVisualizationMetrics() {
    return {
      settings: { ...this.settings },
      lastSpectralData: this.lastSpectralData ? { ...this.lastSpectralData } : null,
      elementsCount: this.visualizationElements.length,
      isAnimating: this.isAnimating
    };
  }
}