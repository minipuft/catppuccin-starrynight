/**
 * RedEnergyBurstSystem - Phase 2.2 Implementation
 *
 * Red energy burst system with holographic interfaces for intense musical moments.
 * Creates Blade Runner-style CRT interference with consciousness-driven intensity.
 *
 * @architecture Year3000System - Cinematic Drama Integration
 * @performance <5ms latency, 60fps holographic rendering
 * @consciousness Red energy bursts that feel the music's soul
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import type { BeatData, RGB } from "@/types/colorStubs";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import { EmotionalTemperatureMapper } from "@/utils/color/EmotionalTemperatureMapper";
import {
  OKLABColorProcessor,
  type EnhancementPreset,
} from "@/utils/color/OKLABColorProcessor";
import {
  HolographicUISystem,
  type HolographicElement,
} from "@/visual/music-sync/ui/HolographicUISystem";

export interface EnergyBurstState {
  intensity: number; // 0-1 current burst intensity
  frequency: number; // Hz - energy burst frequency
  temperature: number; // Color temperature (red-amber spectrum)
  interferenceLevel: number; // 0-1 CRT interference strength
  scanlineVelocity: number; // Scanline animation speed
  holographicDepth: number; // Volumetric effect depth
  dramaticTension: number; // 0-1 dramatic moment intensity
  energyStability: number; // 0-1 stability vs chaos
}

export interface CinematicEffectConfig {
  redEnergyThreshold: number; // Musical intensity threshold for red energy
  holographicIntensityMax: number; // Maximum holographic effect intensity
  crFilteringStrength: number; // CRT artifact simulation strength
  bladeRunnerMode: boolean; // Authentic Blade Runner aesthetic
  energyBurstDuration: number; // Duration of energy bursts in ms
  scanlineFrequency: number; // Base scanline frequency
}

export interface CinematicHolographicMapping {
  dominantColor: RGB; // Primary red/amber color
  glowIntensity: number; // 0-1 holographic glow strength
  flickerRate: number; // Hz CRT flicker frequency
  scanlineColor: RGB; // Scanline color (red/amber)
  atmosphericDepth: number; // Volumetric depth effect
  interferencePattern: "noise" | "wave" | "dramatic" | "chaos";
}

/**
 * RedEnergyBurstSystem - Red energy bursts with holographic consciousness
 */
export class RedEnergyBurstSystem implements IManagedSystem {
  public initialized = false;

  private holographicSystem: HolographicUISystem;
  // Using shared colorConsciousnessManager instead of injected orchestrator
  private cssConsciousnessController: UnifiedCSSVariableManager;
  private musicSyncService: MusicSyncService;

  // OKLAB integration for perceptually uniform cinematic colors
  private oklabProcessor: OKLABColorProcessor;
  private emotionalMapper: EmotionalTemperatureMapper;
  private cinematicPreset: EnhancementPreset;

  private energyBurstState: EnergyBurstState;
  private cinematicConfig: CinematicEffectConfig;
  private dramaticElements: Map<string, HolographicElement> = new Map();

  // Performance tracking
  private performanceMetrics = {
    energyBurstCount: 0,
    averageProcessingTime: 0,
    lastUpdateTime: 0,
    cpuUsage: 0,
  };

  // Animation state
  private animationState = {
    energyPhase: 0,
    dramaticPhase: 0,
    interferencePhase: 0,
    lastFrameTime: 0,
    isAnimating: false,
  };

  // Cinematic color presets
  private cinematicPalettes = {
    "blade-runner": {
      primaryRed: { r: 255, g: 50, b: 50 },
      amberGlow: { r: 255, g: 140, b: 0 },
      deepBlue: { r: 0, g: 100, b: 200 },
      neonCyan: { r: 0, g: 255, b: 255 },
    },
    cyberpunk: {
      primaryRed: { r: 255, g: 0, b: 100 },
      amberGlow: { r: 255, g: 180, b: 0 },
      deepBlue: { r: 50, g: 50, b: 255 },
      neonCyan: { r: 100, g: 255, b: 255 },
    },
    "dramatic-noir": {
      primaryRed: { r: 200, g: 0, b: 0 },
      amberGlow: { r: 255, g: 120, b: 0 },
      deepBlue: { r: 0, g: 50, b: 150 },
      neonCyan: { r: 0, g: 200, b: 255 },
    },
  };

  constructor(
    holographicSystem: HolographicUISystem,
    cssConsciousnessController: UnifiedCSSVariableManager,
    musicSyncService: MusicSyncService
  ) {
    this.holographicSystem = holographicSystem;
    this.cssConsciousnessController = cssConsciousnessController;
    this.musicSyncService = musicSyncService;

    // Initialize OKLAB color processing for cinematic effects
    this.oklabProcessor = new OKLABColorProcessor(true);
    this.emotionalMapper = new EmotionalTemperatureMapper(true);
    this.cinematicPreset = OKLABColorProcessor.getPreset("COSMIC"); // Use cosmic preset for dramatic effects

    // Initialize energy burst state
    this.energyBurstState = {
      intensity: 0,
      frequency: 0.5,
      temperature: 2500, // Red-amber temperature
      interferenceLevel: 0,
      scanlineVelocity: 1.0,
      holographicDepth: 0,
      dramaticTension: 0,
      energyStability: 1.0,
    };

    // Initialize cinematic configuration
    this.cinematicConfig = {
      redEnergyThreshold: 0.7, // Activate on high intensity
      holographicIntensityMax: 0.9, // Maximum effect strength
      crFilteringStrength: 0.8, // Strong CRT simulation
      bladeRunnerMode: true, // Authentic aesthetic
      energyBurstDuration: 1500, // 1.5 second bursts
      scanlineFrequency: 120, // 120Hz base scanlines
    };
  }

  /**
   * Initialize the Cinematic Drama Engine
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log(
        "[RedEnergyBurstSystem] Initializing red energy burst system..."
      );

      // Register for ColorConsciousnessOrchestrator events
      this.subscribeToColorConsciousness();

      // Subscribe to unified OKLAB color events
      this.subscribeToOKLABColorEvents();

      // Initialize dramatic UI elements
      await this.initializeDramaticElements();

      // Setup CSS variables for cinematic effects
      this.setupCinematicCSSVariables();

      // Start animation loop
      this.startCinematicAnimation();

      this.initialized = true;

      console.log(
        "[RedEnergyBurstSystem] ✅ Ready for dramatic consciousness moments"
      );
    } catch (error) {
      console.error("[RedEnergyBurstSystem] Failed to initialize:", error);
      throw error;
    }
  }

  /**
   * Update animation frame for cinematic effects
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized) return;

    const deltaSeconds = deltaTime / 1000;

    // Update animation phases
    this.animationState.energyPhase +=
      deltaSeconds * this.energyBurstState.frequency * 2;
    this.animationState.dramaticPhase += deltaSeconds * 0.8;
    this.animationState.interferencePhase += deltaSeconds * 3.0;

    // Update energy burst intensity based on music
    this.updateEnergyBurstFromMusic();

    // Update holographic effects
    this.updateHolographicMapping();

    // Update dramatic elements
    this.updateDramaticElements();

    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
  }

  /**
   * Health check for cinematic drama system
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy =
      this.initialized &&
      this.energyBurstState.intensity >= 0 &&
      this.performanceMetrics.averageProcessingTime < 5; // <5ms requirement

    return {
      system: "RedEnergyBurstSystem",
      healthy: isHealthy,
      metrics: {
        energyBurstCount: this.performanceMetrics.energyBurstCount,
        processingTime: this.performanceMetrics.averageProcessingTime,
        dramaticElementCount: this.dramaticElements.size,
        cpuUsage: this.performanceMetrics.cpuUsage,
      },
      issues: isHealthy ? [] : ["Performance degradation detected"],
    };
  }

  /**
   * Subscribe to ColorConsciousnessOrchestrator events
   */
  private subscribeToColorConsciousness(): void {
    unifiedEventBus.subscribe("emotionalColorContext:updated", (event) => {
      this.onColorConsciousnessUpdate(event);
    }, "RedEnergyBurstSystem");

    unifiedEventBus.subscribe("emotion:analyzed", (event) => {
      this.onMusicIntensitySpike(event);
    }, "RedEnergyBurstSystem");

    unifiedEventBus.subscribe("emotion:analyzed", (event) => {
      this.onDramaticMoment(event);
    }, "RedEnergyBurstSystem");
  }

  /**
   * Subscribe to unified OKLAB color events
   */
  private subscribeToOKLABColorEvents(): void {
    unifiedEventBus.subscribe(
      "colors:harmonized",
      (event) => {
        this.onOKLABColorsHarmonized(event);
      },
      "RedEnergyBurstSystem"
    );

    unifiedEventBus.subscribe(
      "colors:extracted",
      (event) => {
        this.onColorsExtracted(event);
      },
      "RedEnergyBurstSystem"
    );
  }

  /**
   * Handle color consciousness updates
   */
  private onColorConsciousnessUpdate(event: any): void {
    const { palette, consciousnessLevel, emotionalTemperature } = event;

    // Map consciousness to dramatic tension
    this.energyBurstState.dramaticTension = consciousnessLevel * 0.8;

    // Adjust energy burst temperature based on emotion
    if (emotionalTemperature < 3000) {
      // Cool = more blue-red
      this.energyBurstState.temperature = 2200;
    } else if (emotionalTemperature > 6000) {
      // Warm = more amber-red
      this.energyBurstState.temperature = 2800;
    } else {
      // Balanced red
      this.energyBurstState.temperature = 2500;
    }

    // Update holographic color mapping
    const dominantColor = this.extractDominantRedColor(palette);
    this.updateHolographicColors(dominantColor);
  }

  /**
   * Handle music intensity spikes
   */
  private onMusicIntensitySpike(event: any): void {
    const { intensity, beat } = event;

    if (intensity > this.cinematicConfig.redEnergyThreshold) {
      // Trigger red energy burst
      this.triggerEnergyBurst(intensity, beat);
    }
  }

  /**
   * Handle dramatic musical moments
   */
  private onDramaticMoment(event: any): void {
    const { type, intensity } = event;

    // Intensify dramatic effects
    this.energyBurstState.dramaticTension = Math.min(1.0, intensity * 1.2);

    // Increase interference for chaos
    this.energyBurstState.interferenceLevel = intensity * 0.6;

    // Destabilize energy for more dramatic flicker
    this.energyBurstState.energyStability = Math.max(
      0.3,
      1.0 - intensity * 0.7
    );
  }

  /**
   * Handle OKLAB harmonized colors for cinematic enhancement
   */
  private onOKLABColorsHarmonized(event: any): void {
    const { processedColors, coordinationMetrics } = event;

    // Extract cinematic colors from OKLAB-processed palette
    const cinematicColors = this.extractCinematicOKLABColors(processedColors);

    // Update cinematic palette with OKLAB-enhanced colors
    this.updateCinematicPaletteWithOKLAB(cinematicColors);

    // Adjust cinematic preset based on detected genre/emotion
    if (
      coordinationMetrics?.detectedGenre ||
      coordinationMetrics?.emotionalState
    ) {
      this.adjustCinematicPresetForContext(coordinationMetrics);
    }
  }

  /**
   * Handle color extraction for immediate cinematic response
   */
  private onColorsExtracted(event: any): void {
    const { rawColors, musicData } = event;

    // Use emotional mapper to determine cinematic intensity
    if (musicData) {
      const emotionalResult =
        this.emotionalMapper.mapMusicToEmotionalTemperature(musicData);

      // Adjust cinematic effects based on emotional state
      this.adjustCinematicEffectsForEmotion(emotionalResult);

      // Update preset based on emotional intensity
      if (emotionalResult.intensity > 0.7) {
        this.cinematicPreset = OKLABColorProcessor.getPreset("COSMIC");
      } else if (emotionalResult.intensity > 0.4) {
        this.cinematicPreset = OKLABColorProcessor.getPreset("VIBRANT");
      } else {
        this.cinematicPreset = OKLABColorProcessor.getPreset("STANDARD");
      }
    }
  }

  /**
   * Trigger red energy burst effect
   */
  private triggerEnergyBurst(intensity: number, beat: BeatData): void {
    const startTime = performance.now();

    // Set energy burst parameters
    this.energyBurstState.intensity = Math.min(1.0, intensity * 1.1);
    this.energyBurstState.frequency = 1.0 + intensity * 2.0; // Up to 3Hz
    this.energyBurstState.holographicDepth = intensity * 0.8;

    // Calculate scanline velocity based on beat
    this.energyBurstState.scanlineVelocity = 1.0 + beat.strength * 2.0;

    // Schedule energy burst decay
    setTimeout(() => {
      this.decayEnergyBurst();
    }, this.cinematicConfig.energyBurstDuration);

    // Update performance metrics
    this.performanceMetrics.energyBurstCount++;
    this.performanceMetrics.lastUpdateTime = performance.now() - startTime;

    console.log(
      `[RedEnergyBurstSystem] 🔥 Red energy burst triggered! Intensity: ${intensity.toFixed(
        2
      )}`
    );
  }

  /**
   * Decay energy burst over time
   */
  private decayEnergyBurst(): void {
    const decayRate = 0.05; // 5% per frame

    const decay = () => {
      this.energyBurstState.intensity *= 1.0 - decayRate;
      this.energyBurstState.holographicDepth *= 1.0 - decayRate * 0.8;
      this.energyBurstState.interferenceLevel *= 1.0 - decayRate * 0.6;

      if (this.energyBurstState.intensity > 0.05) {
        requestAnimationFrame(decay);
      } else {
        // Reset to baseline
        this.energyBurstState.intensity = 0;
        this.energyBurstState.holographicDepth = 0;
        this.energyBurstState.interferenceLevel = 0;
      }
    };

    requestAnimationFrame(decay);
  }

  /**
   * Update energy burst from current music state
   */
  private updateEnergyBurstFromMusic(): void {
    // Get current music state
    const musicState = this.musicSyncService.getCurrentMusicState();
    if (!musicState) return;

    const { emotion, beat, intensity } = musicState;

    // Adjust energy frequency based on tempo
    if (beat && beat.tempo) {
      const tempoMultiplier = Math.max(0.5, Math.min(2.0, beat.tempo / 120)); // Normalize around 120 BPM
      this.energyBurstState.frequency =
        this.energyBurstState.frequency * tempoMultiplier;
    }

    // Adjust interference based on musical chaos
    if (emotion && emotion.arousal > 0.7) {
      this.energyBurstState.interferenceLevel = Math.max(
        this.energyBurstState.interferenceLevel,
        emotion.arousal * 0.5
      );
    }
  }

  /**
   * Update holographic color mapping for cinematic effects
   */
  private updateHolographicMapping(): void {
    const palette = this.cinematicPalettes["blade-runner"]; // Default to Blade Runner

    // Create cinematic holographic mapping
    const mapping: CinematicHolographicMapping = {
      dominantColor: this.blendRedColors(
        palette.primaryRed,
        palette.amberGlow,
        this.energyBurstState.temperature / 3000
      ),
      glowIntensity:
        this.energyBurstState.intensity *
        this.cinematicConfig.holographicIntensityMax,
      flickerRate: this.energyBurstState.frequency * 2.0,
      scanlineColor: palette.amberGlow,
      atmosphericDepth: this.energyBurstState.holographicDepth,
      interferencePattern: this.getInterferencePattern(),
    };

    // Update CSS variables through batcher
    this.updateCinematicCSSVariables(mapping);
  }

  /**
   * Blend red colors based on temperature using OKLAB for perceptual accuracy
   */
  private blendRedColors(red: RGB, amber: RGB, blendFactor: number): RGB {
    const factor = Math.max(0, Math.min(1, blendFactor));

    try {
      // Convert RGB to hex for OKLAB processing
      const redHex = `#${red.r.toString(16).padStart(2, "0")}${red.g
        .toString(16)
        .padStart(2, "0")}${red.b.toString(16).padStart(2, "0")}`;
      const amberHex = `#${amber.r.toString(16).padStart(2, "0")}${amber.g
        .toString(16)
        .padStart(2, "0")}${amber.b.toString(16).padStart(2, "0")}`;

      // Use OKLAB interpolation for perceptually uniform blending
      const blendedResult = this.oklabProcessor.interpolateOKLAB(
        redHex,
        amberHex,
        factor,
        this.cinematicPreset
      );

      return blendedResult.enhancedRgb;
    } catch (error) {
      // Fallback to linear RGB blending if OKLAB fails
      return {
        r: Math.round(red.r * (1 - factor) + amber.r * factor),
        g: Math.round(red.g * (1 - factor) + amber.g * factor),
        b: Math.round(red.b * (1 - factor) + amber.b * factor),
      };
    }
  }

  /**
   * Get interference pattern based on current state
   */
  private getInterferencePattern(): "noise" | "wave" | "dramatic" | "chaos" {
    if (this.energyBurstState.energyStability < 0.4) {
      return "chaos";
    } else if (this.energyBurstState.dramaticTension > 0.7) {
      return "dramatic";
    } else if (this.energyBurstState.interferenceLevel > 0.5) {
      return "noise";
    } else {
      return "wave";
    }
  }

  /**
   * Extract dominant red color from palette
   */
  private extractDominantRedColor(palette: any[]): RGB {
    // Find the reddest color in the palette
    let redColor = { r: 255, g: 50, b: 50 }; // Default red

    if (palette && palette.length > 0) {
      const reds = palette.filter(
        (color) => color.r > color.g && color.r > color.b
      );

      if (reds.length > 0) {
        redColor = reds[0];
      }
    }

    return redColor;
  }

  /**
   * Extract cinematic colors from OKLAB-processed palette
   */
  private extractCinematicOKLABColors(
    processedColors: Record<string, string>
  ): {
    primaryRed: RGB;
    amberGlow: RGB;
    deepBlue: RGB;
    neonCyan: RGB;
  } {
    const defaultColors = this.cinematicPalettes["blade-runner"];

    // Process available colors through OKLAB for cinematic enhancement
    const enhancedColors = { ...defaultColors };

    // Look for vibrant colors to enhance
    if (processedColors.VIBRANT) {
      const vibrantResult = this.oklabProcessor.processColor(
        processedColors.VIBRANT,
        this.cinematicPreset
      );
      enhancedColors.primaryRed = vibrantResult.enhancedRgb;
    }

    if (processedColors.PROMINENT) {
      const prominentResult = this.oklabProcessor.processColor(
        processedColors.PROMINENT,
        this.cinematicPreset
      );
      enhancedColors.amberGlow = prominentResult.enhancedRgb;
    }

    // Generate complementary cinematic colors through OKLAB
    if (processedColors.DARK_VIBRANT) {
      const darkResult = this.oklabProcessor.processColor(
        processedColors.DARK_VIBRANT,
        this.cinematicPreset
      );
      enhancedColors.deepBlue = darkResult.enhancedRgb;
    }

    return enhancedColors;
  }

  /**
   * Update cinematic palette with OKLAB-enhanced colors
   */
  private updateCinematicPaletteWithOKLAB(cinematicColors: {
    primaryRed: RGB;
    amberGlow: RGB;
    deepBlue: RGB;
    neonCyan: RGB;
  }): void {
    // Update the blade-runner palette with OKLAB-enhanced colors
    this.cinematicPalettes["blade-runner"] = cinematicColors;

    // Update CSS variables with new OKLAB-processed colors
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-r",
      cinematicColors.primaryRed.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-g",
      cinematicColors.primaryRed.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-b",
      cinematicColors.primaryRed.b.toString()
    );

    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-amber-r",
      cinematicColors.amberGlow.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-amber-g",
      cinematicColors.amberGlow.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-amber-b",
      cinematicColors.amberGlow.b.toString()
    );
  }

  /**
   * Adjust cinematic preset based on detected genre/emotion context
   */
  private adjustCinematicPresetForContext(coordinationMetrics: any): void {
    const { detectedGenre, emotionalState, oklabPreset } = coordinationMetrics;

    // Adjust cinematic intensity based on genre
    if (detectedGenre) {
      switch (detectedGenre) {
        case "electronic":
        case "dance":
        case "techno":
          this.cinematicPreset = OKLABColorProcessor.getPreset("COSMIC");
          this.cinematicConfig.bladeRunnerMode = true;
          break;
        case "rock":
        case "metal":
          this.cinematicPreset = OKLABColorProcessor.getPreset("VIBRANT");
          this.cinematicConfig.redEnergyThreshold = 0.6; // Lower threshold for aggressive music
          break;
        case "ambient":
        case "classical":
          this.cinematicPreset = OKLABColorProcessor.getPreset("SUBTLE");
          this.cinematicConfig.redEnergyThreshold = 0.8; // Higher threshold for subtle music
          break;
        default:
          this.cinematicPreset = OKLABColorProcessor.getPreset("STANDARD");
      }
    }

    // Adjust effects based on emotional state
    if (emotionalState) {
      switch (emotionalState) {
        case "aggressive":
        case "energetic":
          this.energyBurstState.frequency *= 1.5;
          this.energyBurstState.interferenceLevel = Math.min(
            1.0,
            this.energyBurstState.interferenceLevel + 0.3
          );
          break;
        case "calm":
        case "ambient":
          this.energyBurstState.frequency *= 0.7;
          this.energyBurstState.energyStability = Math.min(
            1.0,
            this.energyBurstState.energyStability + 0.2
          );
          break;
        case "mysterious":
          this.cinematicConfig.bladeRunnerMode = true;
          this.energyBurstState.interferenceLevel = Math.min(
            1.0,
            this.energyBurstState.interferenceLevel + 0.2
          );
          break;
      }
    }
  }

  /**
   * Adjust cinematic effects based on emotional temperature result
   */
  private adjustCinematicEffectsForEmotion(emotionalResult: any): void {
    const { primaryEmotion, intensity, temperature } = emotionalResult;

    // Update energy burst state based on emotion
    this.energyBurstState.dramaticTension = intensity * 0.9;

    // Adjust color temperature for cinematic effect
    if (temperature < 3000) {
      // Cool emotions = more blue-red dramatic effect
      this.energyBurstState.temperature = 2200;
    } else if (temperature > 6000) {
      // Warm emotions = more amber-red dramatic effect
      this.energyBurstState.temperature = 2800;
    } else {
      // Balanced emotions = classic red
      this.energyBurstState.temperature = 2500;
    }

    // Apply emotion-specific effects
    switch (primaryEmotion) {
      case "aggressive":
        this.energyBurstState.interferenceLevel = Math.min(
          1.0,
          intensity * 0.8
        );
        this.energyBurstState.energyStability = Math.max(0.2, 1.0 - intensity);
        break;
      case "calm":
        this.energyBurstState.energyStability = Math.min(
          1.0,
          0.8 + intensity * 0.2
        );
        this.energyBurstState.interferenceLevel *= 0.5;
        break;
      case "mysterious":
        this.energyBurstState.interferenceLevel = intensity * 0.6;
        this.cinematicConfig.bladeRunnerMode = true;
        break;
      case "energetic":
        this.energyBurstState.frequency = Math.min(3.0, 1.0 + intensity * 2.0);
        break;
    }
  }

  /**
   * Update holographic colors
   */
  private updateHolographicColors(dominantColor: RGB): void {
    // Update CSS variables for holographic red
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-r",
      dominantColor.r.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-g",
      dominantColor.g.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-red-b",
      dominantColor.b.toString()
    );
  }

  /**
   * Initialize dramatic UI elements
   */
  private async initializeDramaticElements(): Promise<void> {
    const dramaticSelectors = [
      { selector: ".Root__now-playing-bar", type: "energy_barrier" },
      { selector: ".main-view-container", type: "cinematic_overlay" },
      { selector: ".Root__nav-bar", type: "data_stream_red" },
      { selector: ".player-controls", type: "dramatic_interface" },
    ];

    for (const config of dramaticSelectors) {
      const elements = document.querySelectorAll(config.selector);

      for (const element of elements) {
        const dramaticElement: HolographicElement = {
          id: `dramatic-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          element: element as HTMLElement,
          originalStyles: getComputedStyle(element),
          holographicType: config.type as any,
          intensity: 0.8,
          isActive: true,
          lastUpdate: 0,
          animation: null,
          consciousnessLevel: 0.9,
          organicIntegration: true,
        };

        this.dramaticElements.set(dramaticElement.id, dramaticElement);
      }
    }
  }

  /**
   * Setup CSS variables for cinematic effects
   */
  private setupCinematicCSSVariables(): void {
    const baseVariables = {
      "--cinematic-red-r": "255",
      "--cinematic-red-g": "50",
      "--cinematic-red-b": "50",
      "--cinematic-amber-r": "255",
      "--cinematic-amber-g": "140",
      "--cinematic-amber-b": "0",
      "--cinematic-glow-intensity": "0",
      "--cinematic-flicker-rate": "0.5",
      "--cinematic-scanline-speed": "1.0",
      "--cinematic-interference": "0",
      "--cinematic-depth": "0",
    };

    for (const [variable, value] of Object.entries(baseVariables)) {
      this.cssConsciousnessController.queueCSSVariableUpdate(variable, value);
    }
  }

  /**
   * Update cinematic CSS variables
   */
  private updateCinematicCSSVariables(
    mapping: CinematicHolographicMapping
  ): void {
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-glow-intensity",
      mapping.glowIntensity.toString()
    );

    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-flicker-rate",
      mapping.flickerRate.toString()
    );

    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-scanline-speed",
      this.energyBurstState.scanlineVelocity.toString()
    );

    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-interference",
      this.energyBurstState.interferenceLevel.toString()
    );

    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--cinematic-depth",
      mapping.atmosphericDepth.toString()
    );
  }

  /**
   * Update dramatic elements
   */
  private updateDramaticElements(): void {
    for (const [id, element] of this.dramaticElements) {
      if (element.isActive) {
        this.updateDramaticElement(element);
      }
    }
  }

  /**
   * Update single dramatic element
   */
  private updateDramaticElement(element: HolographicElement): void {
    const { element: htmlElement, intensity } = element;

    // Apply red energy burst effects
    if (this.energyBurstState.intensity > 0.1) {
      this.applyRedEnergyBurst(htmlElement, intensity);
    }

    // Apply CRT interference
    if (this.energyBurstState.interferenceLevel > 0.1) {
      this.applyCRTInterference(htmlElement, intensity);
    }

    // Apply dramatic scanlines
    this.applyDramaticScanlines(htmlElement, intensity);
  }

  /**
   * Apply red energy burst effect to element
   */
  private applyRedEnergyBurst(element: HTMLElement, intensity: number): void {
    const burstIntensity = this.energyBurstState.intensity * intensity;
    const dramaticPulse =
      Math.sin(this.animationState.energyPhase * 3) * 0.5 + 0.5;

    // Red energy glow
    const glowIntensity = burstIntensity * dramaticPulse * 0.8;
    element.style.boxShadow = `
      0 0 ${
        glowIntensity * 40
      }px rgba(var(--cinematic-red-r), var(--cinematic-red-g), var(--cinematic-red-b), ${glowIntensity}),
      inset 0 0 ${
        glowIntensity * 20
      }px rgba(var(--cinematic-amber-r), var(--cinematic-amber-g), var(--cinematic-amber-b), ${
      glowIntensity * 0.5
    })
    `;

    // Energy burst border
    if (burstIntensity > 0.3) {
      element.style.border = `1px solid rgba(var(--cinematic-red-r), var(--cinematic-red-g), var(--cinematic-red-b), ${burstIntensity})`;
    }
  }

  /**
   * Apply CRT interference effect
   */
  private applyCRTInterference(element: HTMLElement, intensity: number): void {
    const interferenceIntensity =
      this.energyBurstState.interferenceLevel * intensity;
    const interferencePhase = this.animationState.interferencePhase;

    // CRT chromatic aberration
    const chromaticOffset = interferenceIntensity * 3;
    const redOffset = Math.sin(interferencePhase * 2) * chromaticOffset;
    const blueOffset = Math.cos(interferencePhase * 2.5) * chromaticOffset;

    element.style.filter = `
      drop-shadow(${redOffset}px 0 0 rgba(var(--spice-rgb-cinematic-red, 255, 0, 0), ${
      interferenceIntensity * 0.6
    }))
      drop-shadow(${blueOffset}px 0 0 rgba(var(--spice-rgb-cinematic-cyan, 0, 255, 255), ${
      interferenceIntensity * 0.4
    }))
    `;

    // CRT noise distortion
    if (interferenceIntensity > 0.5) {
      const noiseOffset =
        Math.sin(interferencePhase * 10) * interferenceIntensity * 2;
      element.style.transform = `translateX(${noiseOffset}px)`;
    }
  }

  /**
   * Apply dramatic scanlines
   */
  private applyDramaticScanlines(
    element: HTMLElement,
    intensity: number
  ): void {
    const scanlineIntensity = this.energyBurstState.intensity * intensity * 0.6;

    if (scanlineIntensity > 0.1) {
      const scanlineFrequency = this.cinematicConfig.scanlineFrequency / 30; // Convert to CSS pixels

      element.style.background = `
        ${element.style.background || ""},
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent ${scanlineFrequency - 1}px,
          rgba(var(--cinematic-amber-r), var(--cinematic-amber-g), var(--cinematic-amber-b), ${
            scanlineIntensity * 0.15
          }) ${scanlineFrequency}px
        )
      `;
    }
  }

  /**
   * Start cinematic animation loop
   */
  private startCinematicAnimation(): void {
    this.animationState.isAnimating = true;
    this.animationState.lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.animationState.isAnimating) return;

      const deltaTime = currentTime - this.animationState.lastFrameTime;
      this.animationState.lastFrameTime = currentTime;

      // Update cinematic animation
      this.updateAnimation(deltaTime);

      // Continue animation loop
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    this.performanceMetrics.averageProcessingTime =
      this.performanceMetrics.averageProcessingTime * 0.9 + deltaTime * 0.1;

    // Estimate CPU usage based on processing time
    this.performanceMetrics.cpuUsage = Math.min(100, (deltaTime / 16.67) * 100); // Normalize to 60fps
  }

  /**
   * Force repaint for immediate visual updates
   */
  public forceRepaint(reason?: string): void {
    console.log(
      `[RedEnergyBurstSystem] Force repaint triggered: ${reason || "Unknown"}`
    );

    // Force update of all dramatic elements
    this.updateDramaticElements();

    // Trigger CSS variable batch flush
    this.cssConsciousnessController.flushCSSVariableBatch();
  }

  /**
   * Cleanup and destroy the engine
   */
  public destroy(): void {
    console.log("[RedEnergyBurstSystem] Destroying cinematic drama engine...");

    // Stop animation
    this.animationState.isAnimating = false;

    // Clear dramatic elements
    this.dramaticElements.clear();

    // Reset energy burst state
    this.energyBurstState = {
      intensity: 0,
      frequency: 0.5,
      temperature: 2500,
      interferenceLevel: 0,
      scanlineVelocity: 1.0,
      holographicDepth: 0,
      dramaticTension: 0,
      energyStability: 1.0,
    };

    this.initialized = false;
  }

  // Public API methods
  public getEnergyBurstState(): EnergyBurstState {
    return { ...this.energyBurstState };
  }

  public getCinematicConfig(): CinematicEffectConfig {
    return { ...this.cinematicConfig };
  }

  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }

  public setRedEnergyThreshold(threshold: number): void {
    this.cinematicConfig.redEnergyThreshold = Math.max(
      0,
      Math.min(1, threshold)
    );
  }

  public setBladeRunnerMode(enabled: boolean): void {
    this.cinematicConfig.bladeRunnerMode = enabled;
    if (enabled) {
      console.log("[RedEnergyBurstSystem] 🎬 Blade Runner mode activated");
    }
  }
}
