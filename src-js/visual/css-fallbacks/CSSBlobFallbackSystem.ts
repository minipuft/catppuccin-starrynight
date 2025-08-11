/**
 * CSS Blob Fallback System - Year 3000 Vision
 * 
 * Creates DOM elements for CSS-only blob effects when WebGL is not available
 * Integrates with existing consciousness systems and provides beautiful fallback experience
 */

import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";

export interface CSSBlobSettings {
  enabled: boolean;
  blobCount: number;
  musicResponsive: boolean;
  performanceMode: boolean;
  debugMode: boolean;
  // Organic pattern enhancements
  organicFlow: boolean;
  membraneElasticity: number; // 0-1 membrane elasticity factor
  musicSync: boolean;
  emotionalTemperature: number; // 0-1 emotional temperature influence
  cellularGrowth: boolean;
  organicBreathing: boolean;
  fluidDynamics: boolean;
}

export class CSSBlobFallbackSystem extends BaseVisualSystem {
  public override readonly systemName: string = "CSSBlobFallbackSystem";
  
  private blobContainer: HTMLDivElement | null = null;
  private blobElements: HTMLDivElement[] = [];
  public override isActive = false;
  
  private settings: CSSBlobSettings = {
    enabled: true,
    blobCount: 6,
    musicResponsive: true,
    performanceMode: false,
    debugMode: false,
    // Enhanced organic pattern defaults
    organicFlow: true,
    membraneElasticity: 0.7,
    musicSync: true,
    emotionalTemperature: 0.5,
    cellularGrowth: true,
    organicBreathing: true,
    fluidDynamics: true,
  };

  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: any,
    musicSyncService: any = null,
    settingsManager: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Load settings from settings manager
    this.loadSettings();

    // Check if WebGL is available - only activate if WebGL is not available
    const webglAvailable = this.checkWebGLAvailability();
    
    if (webglAvailable && !this.settings.debugMode) {
      Y3KDebug?.debug?.log(
        "CSSBlobFallbackSystem",
        "WebGL available - CSS blob fallback not needed"
      );
      return;
    }

    if (!this.settings.enabled) {
      Y3KDebug?.debug?.log(
        "CSSBlobFallbackSystem",
        "CSS blob fallback disabled in settings"
      );
      return;
    }

    // Performance check
    const shouldReduceQuality = this.performanceMonitor?.shouldReduceQuality?.() || false;
    if (shouldReduceQuality) {
      this.settings.performanceMode = true;
      this.settings.blobCount = Math.min(this.settings.blobCount, 3);
    }

    try {
      // Create blob container and elements
      this.createBlobContainer();
      this.createBlobElements();
      
      // Subscribe to events if music responsive
      if (this.settings.musicResponsive) {
        this.subscribeToEvents();
      }

      // Set CSS variables for coordination
      this.updateCSSVariables();

      this.isActive = true;

      Y3KDebug?.debug?.log(
        "CSSBlobFallbackSystem",
        `CSS blob fallback activated with ${this.settings.blobCount} blobs`,
        {
          performanceMode: this.settings.performanceMode,
          musicResponsive: this.settings.musicResponsive,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "CSSBlobFallbackSystem",
        "Failed to initialize:",
        error
      );
    }
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      // Load settings from settings manager
      const gradientIntensity = this.settingsManager?.get("sn-gradient-intensity" as any);
      const performanceMode = this.settingsManager?.get("sn-performance-mode" as any);

      switch (gradientIntensity) {
        case "disabled":
          this.settings.enabled = false;
          break;
        case "minimal":
          this.settings.blobCount = 3;
          this.settings.musicResponsive = false;
          break;
        case "balanced":
          this.settings.blobCount = 6;
          this.settings.musicResponsive = true;
          break;
        case "intense":
          this.settings.blobCount = 8;
          this.settings.musicResponsive = true;
          break;
      }

      if (performanceMode === "enabled") {
        this.settings.performanceMode = true;
        this.settings.blobCount = Math.min(this.settings.blobCount, 4);
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "CSSBlobFallbackSystem",
        "Failed to load settings:",
        error
      );
    }
  }

  private checkWebGLAvailability(): boolean {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  private createBlobContainer(): void {
    // Find target container
    const targetContainer = this.findTargetContainer();

    // Create main blob container
    this.blobContainer = document.createElement("div");
    this.blobContainer.className = "sn-css-blob-container";
    
    // Add debug class if enabled
    if (this.settings.debugMode) {
      this.blobContainer.classList.add("css-blob-debug");
    }

    // Add performance class if needed
    if (this.settings.performanceMode) {
      this.blobContainer.classList.add("css-blob-performance");
    }

    // Insert container
    targetContainer.appendChild(this.blobContainer);

    Y3KDebug?.debug?.log(
      "CSSBlobFallbackSystem",
      "Blob container created and inserted"
    );
  }

  private createBlobElements(): void {
    if (!this.blobContainer) return;

    // Clear existing blobs
    this.blobElements.forEach(blob => blob.remove());
    this.blobElements = [];

    // Create blob elements
    for (let i = 0; i < this.settings.blobCount; i++) {
      const blob = document.createElement("div");
      blob.className = "sn-css-blob";
      blob.setAttribute("data-blob-index", i.toString());

      // Add genre classes for variety
      const genreClasses = ["genre-electronic", "genre-ambient", "genre-classical"];
      const genreClass = genreClasses[i % genreClasses.length];
      if (genreClass) {
        blob.classList.add(genreClass);
      }

      this.blobContainer.appendChild(blob);
      this.blobElements.push(blob);
    }

    Y3KDebug?.debug?.log(
      "CSSBlobFallbackSystem",
      `Created ${this.settings.blobCount} blob elements`
    );
  }

  private findTargetContainer(): HTMLElement {
    const containers = [
      ".Root__main-view",
      ".main-view-container",
      ".Root__top-container",
      "body",
    ];

    for (const selector of containers) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        return element;
      }
    }

    return document.body;
  }

  private updateCSSVariables(): void {
    // Set CSS variables to coordinate with existing systems
    document.documentElement.style.setProperty("--css-blob-enabled", "1");
    document.documentElement.style.setProperty("--css-blob-count", this.settings.blobCount.toString());
    
    if (this.settings.performanceMode) {
      document.documentElement.style.setProperty("--css-blob-quality", "0");
      document.documentElement.style.setProperty("--css-blob-filter-quality", "0");
    }

    // Update existing consciousness variables with settings values
    document.documentElement.style.setProperty("--sn-consciousness-organic-mode", this.settings.organicFlow ? "1" : "0");
    document.documentElement.style.setProperty("--sn-consciousness-membrane-elasticity", this.settings.membraneElasticity.toString());
    document.documentElement.style.setProperty("--sn-consciousness-musical-emotion", this.settings.emotionalTemperature.toString());
    document.documentElement.style.setProperty("--sn-consciousness-cellular-growth", this.settings.cellularGrowth ? "1" : "0");
    document.documentElement.style.setProperty("--sn-consciousness-breathing-intensity", this.settings.organicBreathing ? "1" : "0");
    document.documentElement.style.setProperty("--sn-consciousness-viscosity", this.settings.fluidDynamics ? "0.4" : "0");

    // Coordinate with consciousness systems - use existing variables
    document.documentElement.style.setProperty("--sn-consciousness-css-fallback", "1.0");
    document.documentElement.style.setProperty("--sn-consciousness-webgl-coordination", "0");
  }

  private subscribeToEvents(): void {
    if (!this.settings.musicResponsive) return;

    // Subscribe to music sync events
    document.addEventListener("music-sync:beat-detected", this.handleBeatEvent);
    document.addEventListener("music-sync:energy-changed", this.handleEnergyChange);
    document.addEventListener("music-sync:genre-changed", this.handleGenreChange);

    // Subscribe to settings changes
    document.addEventListener("year3000SystemSettingsChanged", this.handleSettingsChange.bind(this));

    Y3KDebug?.debug?.log(
      "CSSBlobFallbackSystem",
      "Subscribed to music and settings events"
    );
  }

  private handleBeatEvent = (event: Event): void => {
    if (!this.isActive || !this.settings.musicResponsive) return;

    const customEvent = event as CustomEvent;
    const { intensity = 0.5 } = customEvent.detail || {};

    // Add beat active class to all blobs temporarily
    this.blobElements.forEach(blob => {
      blob.classList.add("sn-beat-active");
    });

    // Remove beat active class after animation
    setTimeout(() => {
      this.blobElements.forEach(blob => {
        blob.classList.remove("sn-beat-active");
      });
    }, 500);

    // Update CSS variables for beat response
    const beatScale = 1 + intensity * 0.15;
    document.documentElement.style.setProperty("--css-blob-beat-scale", beatScale.toString());
  }

  private handleEnergyChange = (event: Event): void => {
    if (!this.isActive || !this.settings.musicResponsive) return;

    const customEvent = event as CustomEvent;
    const { energy = 0.5 } = customEvent.detail || {};

    // Update CSS variables for energy response
    document.documentElement.style.setProperty("--css-blob-music-response", energy.toString());
    document.documentElement.style.setProperty("--css-blob-energy-opacity", (0.4 + energy * 0.4).toString());

    // Adjust animation speeds based on energy
    const speedMultiplier = 0.8 + energy * 0.4; // 0.8 to 1.2
    const movementSpeed = Math.round(8000 / speedMultiplier);
    const breathingSpeed = Math.round(4000 / speedMultiplier);

    document.documentElement.style.setProperty("--css-blob-movement-speed", `${movementSpeed}ms`);
    document.documentElement.style.setProperty("--css-blob-breathing-speed", `${breathingSpeed}ms`);
  }

  private handleGenreChange = (event: Event): void => {
    if (!this.isActive || !this.settings.musicResponsive) return;

    const customEvent = event as CustomEvent;
    const { genre = "unknown" } = customEvent.detail || {};

    // Update blob classes based on genre
    this.blobElements.forEach((blob, index) => {
      // Remove existing genre classes
      blob.classList.remove("genre-electronic", "genre-ambient", "genre-classical");
      
      // Add new genre class based on detected genre
      let genreClass = "genre-electronic"; // default
      
      if (genre.includes("ambient") || genre.includes("chill")) {
        genreClass = "genre-ambient";
      } else if (genre.includes("classical") || genre.includes("orchestral")) {
        genreClass = "genre-classical";
      } else if (genre.includes("electronic") || genre.includes("techno") || genre.includes("house")) {
        genreClass = "genre-electronic";
      }

      // Add some variety by using different genres for different blobs
      const genreVariations = ["genre-electronic", "genre-ambient", "genre-classical"];
      const variantIndex = (index + genreVariations.indexOf(genreClass)) % genreVariations.length;
      const selectedGenre = genreVariations[variantIndex];
      if (selectedGenre) {
        blob.classList.add(selectedGenre);
      }
    });

    Y3KDebug?.debug?.log(
      "CSSBlobFallbackSystem",
      `Updated blob genres for: ${genre}`
    );
  }

  public override handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key } = customEvent.detail || {};

    if (key.startsWith("sn-gradient-") || key.startsWith("sn-performance-")) {
      this.loadSettings();
      
      // Recreate blob elements if count changed
      if (this.isActive && this.blobContainer) {
        this.createBlobElements();
        this.updateCSSVariables();
      }
    }
  }

  public override updateAnimation(deltaTime: number): void {
    // CSS animations handle all the visual updates
    // This method is kept for compatibility with base class
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Remove event listeners
    if (this.settings.musicResponsive) {
      document.removeEventListener("music-sync:beat-detected", this.handleBeatEvent);
      document.removeEventListener("music-sync:energy-changed", this.handleEnergyChange);
      document.removeEventListener("music-sync:genre-changed", this.handleGenreChange);
      document.removeEventListener("year3000SystemSettingsChanged", this.handleSettingsChange.bind(this));
    }

    // Remove DOM elements
    this.blobElements.forEach(blob => blob.remove());
    this.blobElements = [];

    if (this.blobContainer && this.blobContainer.parentNode) {
      this.blobContainer.parentNode.removeChild(this.blobContainer);
    }
    this.blobContainer = null;

    // Reset CSS variables
    document.documentElement.style.removeProperty("--css-blob-enabled");
    document.documentElement.style.removeProperty("--css-blob-count");
    document.documentElement.style.removeProperty("--css-blob-quality");

    this.isActive = false;

    Y3KDebug?.debug?.log(
      "CSSBlobFallbackSystem",
      "CSS blob fallback system cleanup completed"
    );
  }

  // Public API methods

  /**
   * Enable or disable the CSS blob system
   */
  public setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    
    if (this.blobContainer) {
      this.blobContainer.style.display = enabled ? "" : "none";
    }

    document.documentElement.style.setProperty("--css-blob-enabled", enabled ? "1" : "0");
  }

  /**
   * Set performance mode
   */
  public setPerformanceMode(enabled: boolean): void {
    this.settings.performanceMode = enabled;
    
    if (this.blobContainer) {
      this.blobContainer.classList.toggle("css-blob-performance", enabled);
    }

    document.documentElement.style.setProperty("--css-blob-quality", enabled ? "0" : "1");
    document.documentElement.style.setProperty("--css-blob-filter-quality", enabled ? "0" : "1");
  }

  /**
   * Enhanced organic pattern control methods - using existing consciousness variables
   */
  public setOrganicFlow(enabled: boolean): void {
    this.settings.organicFlow = enabled;
    document.documentElement.style.setProperty("--sn-consciousness-organic-mode", enabled ? "1" : "0");
  }

  public setMembraneElasticity(elasticity: number): void {
    this.settings.membraneElasticity = Math.max(0, Math.min(1, elasticity));
    document.documentElement.style.setProperty("--sn-consciousness-membrane-elasticity", this.settings.membraneElasticity.toString());
  }

  public setConsciousnessSync(enabled: boolean): void {
    this.settings.musicSync = enabled;
    // Consciousness sync is inherent to the system - no separate variable needed
  }

  public setEmotionalTemperature(temperature: number): void {
    this.settings.emotionalTemperature = Math.max(0, Math.min(1, temperature));
    document.documentElement.style.setProperty("--sn-consciousness-musical-emotion", this.settings.emotionalTemperature.toString());
  }

  public setCellularGrowth(enabled: boolean): void {
    this.settings.cellularGrowth = enabled;
    document.documentElement.style.setProperty("--sn-consciousness-cellular-growth", enabled ? "1" : "0");
  }

  public setOrganicBreathing(enabled: boolean): void {
    this.settings.organicBreathing = enabled;
    document.documentElement.style.setProperty("--sn-consciousness-breathing-intensity", enabled ? "1" : "0");
  }

  public setFluidDynamics(enabled: boolean): void {
    this.settings.fluidDynamics = enabled;
    document.documentElement.style.setProperty("--sn-consciousness-viscosity", enabled ? "0.4" : "0");
  }

  /**
   * Get current system status
   */
  public getStatus() {
    return {
      isActive: this.isActive,
      settings: { ...this.settings },
      blobCount: this.blobElements.length,
      hasContainer: !!this.blobContainer,
    };
  }
}