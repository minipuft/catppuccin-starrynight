/**
 * FluxConsciousnessLayers - Multi-dimensional gradient layer management
 * Part of the Year 3000 Gradient Consciousness System
 * 
 * Creates and manages the five-layer gradient consciousness system:
 * 1. Consciousness Layer (::before) - Base reality perception
 * 2. Temporal Layer (::after) - Time-flow perception  
 * 3. Harmonic Layer - Frequency resonance visualization
 * 4. Quantum Layer - Probability state visualization
 * 5. Stellar Layer - Cosmic phenomena visualization
 */

import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { EmotionalGradientMapper } from "@/audio/EmotionalGradientMapper";
import { GenreGradientEvolution } from "@/audio/GenreGradientEvolution";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";

export interface FluxConsciousnessSettings {
  enabled: boolean;
  consciousnessLevel: number;     // 0-1 overall consciousness intensity
  temporalMemory: number;         // 0-1 how much past colors influence current
  harmonicSensitivity: number;    // 0-1 frequency response sensitivity
  quantumCoherence: number;       // 0-1 quantum state synchronization
  stellarDensity: number;         // 0-1 stellar phenomena density
  dimensionalDepth: number;       // 1-5 layer depth perception level
}

export class FluxConsciousnessLayers extends BaseVisualSystem {
  private harmonicLayer: HTMLDivElement | null = null;
  private quantumLayer: HTMLDivElement | null = null;
  private waveDynamicsLayer: HTMLDivElement | null = null;
  private flowEffectsLayer: HTMLDivElement | null = null;
  private proceduralNebulaLayer: HTMLDivElement | null = null;
  private stellarLayer: HTMLDivElement | null = null;
  private cssVariableBatcher: CSSVariableBatcher;
  private emotionalGradientMapper: EmotionalGradientMapper;
  private genreGradientEvolution: GenreGradientEvolution;
  private boundMusicSyncHandler: ((event: Event) => void) | null = null;
  private boundSettingsHandler: ((event: Event) => void) | null = null;

  private settings: FluxConsciousnessSettings = {
    enabled: true,
    consciousnessLevel: 0.7,
    temporalMemory: 0.3,
    harmonicSensitivity: 0.6,
    quantumCoherence: 0.4,
    stellarDensity: 0.5,
    dimensionalDepth: 3
  };

  private spectralData = {
    bassResponse: 0,
    midResponse: 0,
    trebleResponse: 0,
    vocalPresence: 0
  };

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    
    this.cssVariableBatcher = new CSSVariableBatcher();
    this.emotionalGradientMapper = new EmotionalGradientMapper(this.cssVariableBatcher, musicSyncService, settingsManager);
    this.genreGradientEvolution = new GenreGradientEvolution(this.cssVariableBatcher, musicSyncService, this.emotionalGradientMapper, settingsManager);
    this.boundMusicSyncHandler = this.handleMusicSync.bind(this);
    this.boundSettingsHandler = this.handleSettingsChange.bind(this);
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Load settings
    this.loadSettings();

    // Performance check - disable if FPS is too low
    const currentFPS = (this.performanceMonitor as any)?.averageFPS || 60;
    const isLowEndDevice = PerformanceAnalyzer.isLowEndDevice();
    const shouldReduceQuality = this.performanceMonitor?.shouldReduceQuality?.() || false;

    if (currentFPS < 45 || isLowEndDevice || shouldReduceQuality) {
      this.settings.enabled = false;
      Y3K?.debug?.log("FluxConsciousnessLayers", `Performance mode activated - consciousness layers disabled (FPS: ${currentFPS})`);
    }

    if (!this.settings.enabled) {
      Y3K?.debug?.log("FluxConsciousnessLayers", "Consciousness layers disabled");
      return;
    }

    // Initialize emotional gradient mapper
    await this.emotionalGradientMapper.initialize();
    
    // Initialize genre gradient evolution
    await this.genreGradientEvolution.initialize();
    
    // Create the additional gradient layers
    this.createConsciousnessLayers();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Initialize CSS variables
    this.updateConsciousnessVariables();

    Y3K?.debug?.log("FluxConsciousnessLayers", "Multi-dimensional gradient consciousness with emotional mapping and genre evolution activated");
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      // Load consciousness settings from the settings manager
      const consciousnessMode = this.settingsManager.get("sn-gradient-intensity" as any);
      
      switch (consciousnessMode) {
        case "disabled":
          this.settings.enabled = false;
          break;
        case "minimal":
          this.settings.consciousnessLevel = 0.3;
          this.settings.temporalMemory = 0.1;
          this.settings.harmonicSensitivity = 0.2;
          this.settings.quantumCoherence = 0.1;
          this.settings.stellarDensity = 0.2;
          this.settings.dimensionalDepth = 2;
          break;
        case "balanced":
          this.settings.consciousnessLevel = 0.7;
          this.settings.temporalMemory = 0.3;
          this.settings.harmonicSensitivity = 0.6;
          this.settings.quantumCoherence = 0.4;
          this.settings.stellarDensity = 0.5;
          this.settings.dimensionalDepth = 3;
          break;
        case "intense":
          this.settings.consciousnessLevel = 1.0;
          this.settings.temporalMemory = 0.6;
          this.settings.harmonicSensitivity = 0.9;
          this.settings.quantumCoherence = 0.8;
          this.settings.stellarDensity = 0.8;
          this.settings.dimensionalDepth = 5;
          break;
      }
    } catch (error) {
      Y3K?.debug?.warn("FluxConsciousnessLayers", "Failed to load settings:", error);
    }
  }

  private createConsciousnessLayers(): void {
    const targetContainer = this.findSpotifyContainer();
    
    // Create Harmonic Layer
    this.harmonicLayer = document.createElement("div");
    this.harmonicLayer.className = "sn-harmonic-layer";
    this.harmonicLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -8;
      pointer-events: none;
      will-change: auto;
    `;
    
    // Create Quantum Layer
    this.quantumLayer = document.createElement("div");
    this.quantumLayer.className = "sn-quantum-layer";
    this.quantumLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -7;
      pointer-events: none;
      will-change: auto;
    `;
    
    // Create Wave Dynamics Layer
    this.waveDynamicsLayer = document.createElement("div");
    this.waveDynamicsLayer.className = "sn-wave-dynamics";
    this.waveDynamicsLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -5;
      pointer-events: none;
      will-change: transform, opacity, clip-path;
    `;
    
    // Create Flow Effects Layer
    this.flowEffectsLayer = document.createElement("div");
    this.flowEffectsLayer.className = "sn-flow-effects";
    this.flowEffectsLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -4;
      pointer-events: none;
      will-change: transform, opacity, clip-path;
    `;
    
    // Create Procedural Nebula Layer
    this.proceduralNebulaLayer = document.createElement("div");
    this.proceduralNebulaLayer.className = "sn-procedural-nebula";
    this.proceduralNebulaLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -3;
      pointer-events: none;
      will-change: transform, opacity, filter;
    `;
    
    // Create Stellar Layer
    this.stellarLayer = document.createElement("div");
    this.stellarLayer.className = "sn-stellar-layer";
    this.stellarLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -6;
      pointer-events: none;
      will-change: auto;
    `;

    // Insert layers in the correct order (highest z-index first)
    targetContainer.appendChild(this.harmonicLayer);
    targetContainer.appendChild(this.quantumLayer);
    targetContainer.appendChild(this.stellarLayer);
    targetContainer.appendChild(this.waveDynamicsLayer);
    targetContainer.appendChild(this.flowEffectsLayer);
    targetContainer.appendChild(this.proceduralNebulaLayer);

    Y3K?.debug?.log("FluxConsciousnessLayers", "All consciousness layers created and inserted");
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
    if (this.boundMusicSyncHandler) {
      document.addEventListener("music-sync:spectral-data", this.boundMusicSyncHandler);
      document.addEventListener("music-sync:beat-detected", this.boundMusicSyncHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.addEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }
  }

  private handleMusicSync(event: Event): void {
    const customEvent = event as CustomEvent;
    const { type, detail } = customEvent;

    if (type === "music-sync:spectral-data" && detail) {
      // Update spectral response data
      this.spectralData.bassResponse = detail.bassLevel || 0;
      this.spectralData.midResponse = detail.midLevel || 0;
      this.spectralData.trebleResponse = detail.trebleLevel || 0;
      this.spectralData.vocalPresence = detail.vocalLevel || 0;
      
      this.updateSpectralVariables();
    }

    if (type === "music-sync:beat-detected" && detail) {
      // Handle beat detection for quantum coherence
      this.updateQuantumCoherence(detail.intensity || 0);
    }
  }

  public override handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail;

    if (key === "sn-gradient-intensity") {
      this.loadSettings();
      this.updateConsciousnessVariables();
    }
  }

  private updateConsciousnessVariables(): void {
    if (!this.cssVariableBatcher) return;

    // Runtime performance check - disable if performance degrades
    const currentFPS = (this.performanceMonitor as any)?.currentFPS || 60;
    if (currentFPS < 40 && this.settings.enabled) {
      this.settings.enabled = false;
      this.destroyConsciousnessLayers();
      Y3K?.debug?.log("FluxConsciousnessLayers", `Runtime performance degradation detected - consciousness layers disabled (FPS: ${currentFPS})`);
      return;
    }

    if (!this.settings.enabled) return;

    // Batch all updates to reduce style recalculation
    const updates = [
      ["--sn-gradient-consciousness-level", this.settings.consciousnessLevel.toString()],
      ["--sn-gradient-temporal-memory", this.settings.temporalMemory.toString()],
      ["--sn-gradient-harmonic-resonance", this.settings.harmonicSensitivity.toString()],
      ["--sn-gradient-quantum-coherence", this.settings.quantumCoherence.toString()],
      ["--sn-gradient-nebula-density", this.settings.stellarDensity.toString()],
      ["--sn-gradient-dimensional-depth", this.settings.dimensionalDepth.toString()],
      
      // Pre-calculate derived values to reduce CPU overhead
      ["--sn-gradient-layer-consciousness", "1"],
      ["--sn-gradient-layer-temporal", "0.8"],
      ["--sn-gradient-layer-harmonic", (this.settings.harmonicSensitivity * 0.6).toString()],
      ["--sn-gradient-layer-quantum", (this.settings.quantumCoherence * 0.4).toString()],
      ["--sn-gradient-layer-stellar", (this.settings.stellarDensity * 0.2).toString()],
      
      // Wave dynamics (reduce precision to improve performance)
      ["--sn-gradient-wave-intensity", (Math.round(this.settings.consciousnessLevel * 40) / 100).toString()],
      ["--sn-gradient-flow-intensity", (Math.round(this.settings.harmonicSensitivity * 30) / 100).toString()],
      ["--sn-gradient-temporal-flow-speed", Math.max(0.5, Math.round(this.settings.temporalMemory * 100) / 100).toString()],
    ];

    // Apply updates in batch
    updates.forEach(([property, value]) => {
      if (property && value !== undefined) {
        this.cssVariableBatcher.setProperty(property, value);
      }
    });
  }

  private updateSpectralVariables(): void {
    if (!this.cssVariableBatcher) return;

    // Update spectral analysis variables
    this.cssVariableBatcher.setProperty("--sn-gradient-bass-response", this.spectralData.bassResponse.toString());
    this.cssVariableBatcher.setProperty("--sn-gradient-mid-response", this.spectralData.midResponse.toString());
    this.cssVariableBatcher.setProperty("--sn-gradient-treble-response", this.spectralData.trebleResponse.toString());
    this.cssVariableBatcher.setProperty("--sn-gradient-vocal-presence", this.spectralData.vocalPresence.toString());
  }

  private updateQuantumCoherence(beatIntensity: number): void {
    if (!this.cssVariableBatcher) return;

    // Quantum coherence increases with beat intensity
    const coherence = Math.min(this.settings.quantumCoherence + (beatIntensity * 0.3), 1.0);
    this.cssVariableBatcher.setProperty("--sn-gradient-quantum-coherence", coherence.toString());
    
    // Gradually decay back to base level
    setTimeout(() => {
      this.cssVariableBatcher.setProperty("--sn-gradient-quantum-coherence", this.settings.quantumCoherence.toString());
    }, 500);
  }

  public override updateAnimation(deltaTime: number): void {
    if (!this.settings.enabled) return;

    // Update temporal phase based on time
    const currentTime = performance.now();
    const temporalPhase = (currentTime / 10000) % 1; // 10 second cycle
    
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.setProperty("--sn-gradient-temporal-phase", temporalPhase.toString());
    }
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Cleanup emotional gradient mapper
    this.emotionalGradientMapper.destroy();
    
    // Cleanup genre gradient evolution
    this.genreGradientEvolution.destroy();

    // Remove event listeners
    if (this.boundMusicSyncHandler) {
      document.removeEventListener("music-sync:spectral-data", this.boundMusicSyncHandler);
      document.removeEventListener("music-sync:beat-detected", this.boundMusicSyncHandler);
    }
    
    if (this.boundSettingsHandler) {
      document.removeEventListener("year3000SystemSettingsChanged", this.boundSettingsHandler);
    }

    // Remove DOM elements
    if (this.harmonicLayer && this.harmonicLayer.parentNode) {
      this.harmonicLayer.parentNode.removeChild(this.harmonicLayer);
    }
    if (this.quantumLayer && this.quantumLayer.parentNode) {
      this.quantumLayer.parentNode.removeChild(this.quantumLayer);
    }
    if (this.waveDynamicsLayer && this.waveDynamicsLayer.parentNode) {
      this.waveDynamicsLayer.parentNode.removeChild(this.waveDynamicsLayer);
    }
    if (this.flowEffectsLayer && this.flowEffectsLayer.parentNode) {
      this.flowEffectsLayer.parentNode.removeChild(this.flowEffectsLayer);
    }
    if (this.proceduralNebulaLayer && this.proceduralNebulaLayer.parentNode) {
      this.proceduralNebulaLayer.parentNode.removeChild(this.proceduralNebulaLayer);
    }
    if (this.stellarLayer && this.stellarLayer.parentNode) {
      this.stellarLayer.parentNode.removeChild(this.stellarLayer);
    }

    this.harmonicLayer = null;
    this.quantumLayer = null;
    this.waveDynamicsLayer = null;
    this.flowEffectsLayer = null;
    this.proceduralNebulaLayer = null;
    this.stellarLayer = null;
  }

  private destroyConsciousnessLayers(): void {
    // Remove DOM elements immediately for performance
    if (this.harmonicLayer && this.harmonicLayer.parentNode) {
      this.harmonicLayer.parentNode.removeChild(this.harmonicLayer);
      this.harmonicLayer = null;
    }
    if (this.quantumLayer && this.quantumLayer.parentNode) {
      this.quantumLayer.parentNode.removeChild(this.quantumLayer);
      this.quantumLayer = null;
    }
    if (this.waveDynamicsLayer && this.waveDynamicsLayer.parentNode) {
      this.waveDynamicsLayer.parentNode.removeChild(this.waveDynamicsLayer);
      this.waveDynamicsLayer = null;
    }
    if (this.flowEffectsLayer && this.flowEffectsLayer.parentNode) {
      this.flowEffectsLayer.parentNode.removeChild(this.flowEffectsLayer);
      this.flowEffectsLayer = null;
    }
    if (this.proceduralNebulaLayer && this.proceduralNebulaLayer.parentNode) {
      this.proceduralNebulaLayer.parentNode.removeChild(this.proceduralNebulaLayer);
      this.proceduralNebulaLayer = null;
    }
    if (this.stellarLayer && this.stellarLayer.parentNode) {
      this.stellarLayer.parentNode.removeChild(this.stellarLayer);
      this.stellarLayer = null;
    }

    // Set all consciousness variables to disabled state
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.setProperty("--sn-gradient-consciousness-level", "0");
      this.cssVariableBatcher.setProperty("--sn-gradient-layer-consciousness", "0");
      this.cssVariableBatcher.setProperty("--sn-gradient-layer-temporal", "0");
      this.cssVariableBatcher.setProperty("--sn-gradient-layer-harmonic", "0");
      this.cssVariableBatcher.setProperty("--sn-gradient-layer-quantum", "0");
      this.cssVariableBatcher.setProperty("--sn-gradient-layer-stellar", "0");
    }
  }

  public setConsciousnessLevel(level: number): void {
    this.settings.consciousnessLevel = Math.max(0, Math.min(1, level));
    this.updateConsciousnessVariables();
  }

  public setTemporalMemory(memory: number): void {
    this.settings.temporalMemory = Math.max(0, Math.min(1, memory));
    this.updateConsciousnessVariables();
  }

  public setHarmonicSensitivity(sensitivity: number): void {
    this.settings.harmonicSensitivity = Math.max(0, Math.min(1, sensitivity));
    this.updateConsciousnessVariables();
  }

  public setStellarDrift(drift: number): void {
    if (this.cssVariableBatcher) {
      this.cssVariableBatcher.setProperty("--sn-gradient-stellar-drift", `${drift}deg`);
    }
  }

  public getConsciousnessMetrics() {
    return {
      consciousnessLevel: this.settings.consciousnessLevel,
      temporalMemory: this.settings.temporalMemory,
      harmonicSensitivity: this.settings.harmonicSensitivity,
      quantumCoherence: this.settings.quantumCoherence,
      stellarDensity: this.settings.stellarDensity,
      dimensionalDepth: this.settings.dimensionalDepth,
      spectralData: { ...this.spectralData },
      emotionalProfile: this.emotionalGradientMapper.getCurrentEmotionalProfile(),
      gradientState: this.emotionalGradientMapper.getCurrentGradientState(),
      currentGenre: this.genreGradientEvolution.getCurrentGenre(),
      genreConfidence: this.genreGradientEvolution.getGenreConfidence(),
      genreHistory: this.genreGradientEvolution.getGenreHistory()
    };
  }

  public getEmotionalGradientMapper(): EmotionalGradientMapper {
    return this.emotionalGradientMapper;
  }

  public getGenreGradientEvolution(): GenreGradientEvolution {
    return this.genreGradientEvolution;
  }
}