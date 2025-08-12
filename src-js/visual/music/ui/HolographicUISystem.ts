import type {
  PerformanceMetrics,
  QualityCapability,
  QualityLevel,
  QualityScalingCapable,
} from "@/core/performance/SimplePerformanceCoordinator";
import type {
  BeatData,
  VisualEffectsManager,
  CinematicPalette,
  MusicEmotion,
} from "@/types/colorStubs";

import { MusicSyncService } from "@/audio/MusicSyncService";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
// IManagedSystem interface (inline definition for now)
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
}

interface HealthCheckResult {
  healthy: boolean;
  message: string;
  details?: any;
}

// OKLAB integration for perceptually uniform holographic colors
import { GenreProfileManager } from "@/audio/GenreProfileManager";
import { EmotionalTemperatureMapper } from "@/utils/color/EmotionalTemperatureMapper";
import {
  OKLABColorProcessor,
  type EnhancementPreset,
} from "@/utils/color/OKLABColorProcessor";

export interface HolographicState {
  flickerIntensity: number; // 0-1 holographic flicker intensity
  transparency: number; // 0-1 overall transparency
  chromatic: number; // 0-1 chromatic aberration strength
  scanlineIntensity: number; // 0-1 scanline visibility
  dataStreamFlow: number; // 0-1 data stream animation speed
  interferenceLevel: number; // 0-1 interference pattern strength
  energyStability: number; // 0-1 energy stability (affects flicker)
  projectionDistance: number; // 0-1 perceived projection distance
}

export interface HolographicElement {
  id: string;
  element: HTMLElement;
  originalStyles: CSSStyleDeclaration;
  holographicType: HolographicType;
  intensity: number;
  isActive: boolean;
  lastUpdate: number;
  animation: Animation | null;
  consciousnessLevel: number; // 0-1 consciousness influence
  organicIntegration: boolean; // Whether element has organic integration
}

export type HolographicType =
  | "translucent_panel"
  | "data_stream"
  | "energy_barrier"
  | "consciousness_interface"
  | "organic_hologram"
  | "musical_visualization"
  | "scanline_overlay"
  | "chromatic_ghost";

export interface ScanlineEffect {
  frequency: number; // Scanlines per pixel
  opacity: number; // Scanline opacity
  animation: boolean; // Whether scanlines animate
  speed: number; // Animation speed
  organic: boolean; // Whether scanlines follow organic patterns
}

export interface ChromaticAberration {
  offsetX: number; // Horizontal chromatic offset
  offsetY: number; // Vertical chromatic offset
  redChannel: number; // Red channel shift
  greenChannel: number; // Green channel shift
  blueChannel: number; // Blue channel shift
  intensity: number; // Overall aberration intensity
}

export interface DataStream {
  characters: string[]; // Characters for data stream
  speed: number; // Stream speed
  density: number; // Character density
  organic: boolean; // Whether stream follows organic patterns
  consciousness: boolean; // Whether stream reflects consciousness
  musicalSync: boolean; // Whether stream syncs with music
}

export interface InterferencePattern {
  frequency: number; // Interference frequency
  amplitude: number; // Interference amplitude
  phase: number; // Current phase
  organic: boolean; // Whether interference follows organic patterns
  type: "wave" | "noise" | "grid" | "organic";
}

/**
 * HolographicUISystem - Translucent holographic interface elements
 *
 * This system creates futuristic holographic UI elements that:
 * - Transform regular UI elements into holographic projections
 * - Add scanlines, chromatic aberration, and interference patterns
 * - Create data streams and energy barriers
 * - Sync with music and consciousness for dynamic effects
 * - Maintain Star Wars and Blade Runner holographic aesthetics
 */
export class HolographicUISystem
  implements QualityScalingCapable, IManagedSystem
{
  private manager: VisualEffectsManager;
  private holographicState: HolographicState;
  private holographicElements: Map<string, HolographicElement> = new Map();
  private interfaceContainer: HTMLElement | null = null;
  // Removed scanlineOverlay, chromaticCanvas and dataStreamCanvas - converted to CSS-only implementations
  private isInitialized = false;
  private isEnabled = true;
  private cssController!: OptimizedCSSVariableManager;

  // Holographic effects
  private scanlineEffect: ScanlineEffect;
  private chromaticAberration: ChromaticAberration;
  private dataStream: DataStream;
  private interferencePattern: InterferencePattern;

  // Performance metrics
  private performanceMetrics = {
    elementsProcessed: 0,
    effectsApplied: 0,
    averageProcessingTime: 0,
    memoryUsage: 0,
    lastUpdate: 0,
  };

  // Animation state
  private animationState = {
    lastFrameTime: 0,
    flickerPhase: 0,
    scanlinePhase: 0,
    chromaticPhase: 0,
    dataStreamPhase: 0,
    interferencePhase: 0,
    organicPhase: 0,
    isAnimating: false,
  };

  // Holographic presets
  private holographicPresets = {
    "star-wars": {
      flickerIntensity: 0.4,
      transparency: 0.8,
      chromatic: 0.3,
      scanlineIntensity: 0.6,
      dataStreamFlow: 0.5,
      interferenceLevel: 0.2,
      energyStability: 0.7,
      projectionDistance: 0.8,
    },
    "blade-runner": {
      flickerIntensity: 0.6,
      transparency: 0.7,
      chromatic: 0.5,
      scanlineIntensity: 0.8,
      dataStreamFlow: 0.8,
      interferenceLevel: 0.4,
      energyStability: 0.6,
      projectionDistance: 0.6,
    },
    "organic-consciousness": {
      flickerIntensity: 0.3,
      transparency: 0.9,
      chromatic: 0.2,
      scanlineIntensity: 0.4,
      dataStreamFlow: 0.6,
      interferenceLevel: 0.3,
      energyStability: 0.8,
      projectionDistance: 0.9,
    },
  };

  // OKLAB integration components
  private oklabProcessor: OKLABColorProcessor;
  private emotionalMapper: EmotionalTemperatureMapper;
  private genreManager: GenreProfileManager;
  private holographicPreset: EnhancementPreset;
  private lastMusicalContext: any = null;
  private eventSubscriptionIds: string[] = [];
  private settingsManager: SettingsManager;
  private musicSyncService: MusicSyncService;

  // User interaction tracking for content-aware effects
  private lastScrollPosition: number = 0;
  private lastMouseMovement: number = 0;
  private lastUIClick: number = 0;

  // Required by IManagedSystem
  public initialized: boolean = false;

  // Quality scaling properties
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [
    {
      name: "holographic-effects",
      enabled: true,
      qualityLevel: "medium",
    },
    { name: "scanline-overlay", enabled: true, qualityLevel: "low" },
    {
      name: "chromatic-aberration",
      enabled: true,
      qualityLevel: "low",
    },
    { name: "data-streams", enabled: true, qualityLevel: "medium" },
    {
      name: "interference-patterns",
      enabled: true,
      qualityLevel: "low",
    },
    {
      name: "organic-integration",
      enabled: true,
      qualityLevel: "high",
    },
  ];
  private qualityAdjustments: { [key: string]: number } = {};

  constructor(
    manager: VisualEffectsManager,
    settingsManager?: SettingsManager,
    musicSyncService?: MusicSyncService
  ) {
    this.manager = manager;
    this.settingsManager = settingsManager || new SettingsManager();
    this.musicSyncService = musicSyncService || new MusicSyncService();

    // Initialize OKLAB components
    this.oklabProcessor = new OKLABColorProcessor(true);
    this.emotionalMapper = new EmotionalTemperatureMapper(true);
    this.genreManager = new GenreProfileManager();
    this.holographicPreset = OKLABColorProcessor.getPreset("COSMIC"); // Default to cosmic preset

    // Initialize holographic state
    this.holographicState = {
      flickerIntensity: 0.4,
      transparency: 0.8,
      chromatic: 0.3,
      scanlineIntensity: 0.6,
      dataStreamFlow: 0.5,
      interferenceLevel: 0.2,
      energyStability: 0.7,
      projectionDistance: 0.8,
    };

    // Initialize effects
    this.scanlineEffect = {
      frequency: 4,
      opacity: 0.1,
      animation: true,
      speed: 0.5,
      organic: false,
    };

    this.chromaticAberration = {
      offsetX: 2,
      offsetY: 1,
      redChannel: 0.5,
      greenChannel: 0.0,
      blueChannel: -0.5,
      intensity: 0.3,
    };

    this.dataStream = {
      characters: [
        "0",
        "1",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      speed: 0.5,
      density: 0.3,
      organic: false,
      consciousness: true,
      musicalSync: true,
    };

    this.interferencePattern = {
      frequency: 0.1,
      amplitude: 0.05,
      phase: 0,
      organic: false,
      type: "wave",
    };
  }

  // Initialize holographic UI system
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize CSS coordination - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController = year3000System?.cssConsciousnessController || getGlobalOptimizedCSSController();

      // Create interface container
      await this.createInterfaceContainer();

      // Note: Scanline effects now applied directly to elements via CSS classes

      // Note: Chromatic and data stream effects now handled via CSS-only implementations

      // Initialize holographic elements
      await this.initializeHolographicElements();

      // Setup OKLAB event subscriptions
      this.setupOKLABEventSubscriptions();

      // Setup user interaction tracking for content-aware effects
      this.setupUserInteractionTracking();

      // Start holographic animation
      this.startHolographicAnimation();

      this.initialized = true;
      this.isInitialized = true;

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Initialized holographic interface system with OKLAB integration"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to initialize:",
        error
      );
      throw error;
    }
  }

  // Update holographic effects from music
  public async updateFromMusic(
    emotion: MusicEmotion,
    beat: BeatData,
    palette: CinematicPalette
  ): Promise<void> {
    if (!this.isInitialized || !this.isEnabled) return;

    const startTime = performance.now();

    try {
      // Update holographic state based on music
      this.updateHolographicState(emotion, beat);

      // Update holographic effects
      this.updateHolographicEffects(emotion, beat, palette);

      // Update element appearances
      await this.updateElementAppearances();

      // Update performance metrics
      const processingTime = performance.now() - startTime;
      this.updatePerformanceMetrics(processingTime);
    } catch (error) {
      console.error("[HolographicUISystem] Error updating from music:", error);
    }
  }

  // Update holographic state from music
  private updateHolographicState(emotion: MusicEmotion, beat: BeatData): void {
    // Update flicker intensity based on beat and emotion
    const targetFlicker = 0.2 + emotion.intensity * 0.5 + beat.strength * 0.3;
    this.holographicState.flickerIntensity = this.smoothTransition(
      this.holographicState.flickerIntensity,
      targetFlicker,
      0.1
    );

    // Update transparency based on valence
    const targetTransparency = 0.6 + emotion.valence * 0.4;
    this.holographicState.transparency = this.smoothTransition(
      this.holographicState.transparency,
      targetTransparency,
      0.05
    );

    // Update chromatic aberration based on arousal
    const targetChromatic = 0.1 + (emotion.arousal || 0.5) * 0.4;
    this.holographicState.chromatic = this.smoothTransition(
      this.holographicState.chromatic,
      targetChromatic,
      0.08
    );

    // Update scanline intensity based on energy
    const targetScanlines = 0.3 + emotion.intensity * 0.5;
    this.holographicState.scanlineIntensity = this.smoothTransition(
      this.holographicState.scanlineIntensity,
      targetScanlines,
      0.06
    );

    // Update data stream flow based on tempo
    const consciousnessState = this.manager.getConsciousnessState();
    const targetDataFlow = 0.3 + consciousnessState.symbioticResonance * 0.7;
    this.holographicState.dataStreamFlow = this.smoothTransition(
      this.holographicState.dataStreamFlow,
      targetDataFlow,
      0.04
    );

    // Update interference based on consciousness
    const targetInterference =
      0.1 + consciousnessState.membraneFluidityIndex * 0.3;
    this.holographicState.interferenceLevel = this.smoothTransition(
      this.holographicState.interferenceLevel,
      targetInterference,
      0.03
    );

    // Update energy stability (inverse of intensity for more chaos)
    const targetStability = 1.0 - emotion.intensity * 0.4;
    this.holographicState.energyStability = this.smoothTransition(
      this.holographicState.energyStability,
      targetStability,
      0.02
    );
  }

  // Update holographic effects
  private updateHolographicEffects(
    emotion: MusicEmotion,
    beat: BeatData,
    palette: CinematicPalette
  ): void {
    // Update scanline effect
    this.scanlineEffect.frequency =
      2 + this.holographicState.scanlineIntensity * 6;
    this.scanlineEffect.opacity =
      this.holographicState.scanlineIntensity * 0.15;
    this.scanlineEffect.speed =
      0.3 + this.holographicState.dataStreamFlow * 0.7;
    this.scanlineEffect.organic = this.holographicState.energyStability > 0.7;

    // Update chromatic aberration
    this.chromaticAberration.intensity = this.holographicState.chromatic;
    this.chromaticAberration.offsetX = this.holographicState.chromatic * 3;
    this.chromaticAberration.offsetY = this.holographicState.chromatic * 2;

    // Update data stream
    this.dataStream.speed = 0.2 + this.holographicState.dataStreamFlow * 0.8;
    this.dataStream.density = 0.2 + this.holographicState.dataStreamFlow * 0.6;
    this.dataStream.organic = this.holographicState.energyStability > 0.6;

    // Update interference pattern
    this.interferencePattern.frequency =
      0.05 + this.holographicState.interferenceLevel * 0.15;
    this.interferencePattern.amplitude =
      this.holographicState.interferenceLevel * 0.1;
    this.interferencePattern.organic =
      this.holographicState.energyStability > 0.5;

    // Update type based on emotion
    if (emotion.type === "ambient") {
      this.interferencePattern.type = "organic";
    } else if (emotion.intensity > 0.7) {
      this.interferencePattern.type = "noise";
    } else {
      this.interferencePattern.type = "wave";
    }
  }

  // Update element appearances
  private async updateElementAppearances(): Promise<void> {
    const updatePromises = [];

    for (const [id, element] of this.holographicElements) {
      if (element.isActive) {
        updatePromises.push(this.updateElementAppearance(element));
      }
    }

    await Promise.allSettled(updatePromises);
  }

  // Update single element appearance
  private async updateElementAppearance(
    holographicElement: HolographicElement
  ): Promise<void> {
    const {
      element,
      holographicType,
      intensity,
      consciousnessLevel,
      organicIntegration,
    } = holographicElement;

    try {
      // Apply holographic base effects
      this.applyHolographicBase(element, intensity);

      // Apply type-specific effects
      switch (holographicType) {
        case "translucent_panel":
          this.applyTranslucentPanel(element, intensity);
          break;
        case "data_stream":
          this.applyDataStream(element, intensity);
          break;
        case "energy_barrier":
          this.applyEnergyBarrier(element, intensity);
          break;
        case "consciousness_interface":
          this.applyConsciousnessInterface(
            element,
            intensity,
            consciousnessLevel
          );
          break;
        case "organic_hologram":
          this.applyOrganicHologram(element, intensity, organicIntegration);
          break;
        case "musical_visualization":
          this.applyMusicalVisualization(element, intensity);
          break;
        case "scanline_overlay":
          this.applyScanlineOverlay(element, intensity);
          break;
        case "chromatic_ghost":
          this.applyChromaticGhost(element, intensity);
          break;
      }

      // Apply consciousness and organic modifiers
      if (consciousnessLevel > 0.5) {
        this.applyConsciousnessModifiers(element, consciousnessLevel);
      }

      if (organicIntegration) {
        this.applyOrganicModifiers(element, intensity);
      }

      holographicElement.lastUpdate = performance.now();
    } catch (error) {
      console.warn(
        `[HolographicUISystem] Failed to update element ${holographicElement.id}:`,
        error
      );
    }
  }

  // Apply holographic base effects
  private applyHolographicBase(element: HTMLElement, intensity: number): void {
    const transparency = this.holographicState.transparency * intensity;
    const flicker = this.holographicState.flickerIntensity * intensity;
    const chromatic = this.holographicState.chromatic * intensity;

    // Base transparency
    element.style.opacity = transparency.toString();

    // Holographic flicker
    if (flicker > 0.3) {
      const flickerAmount =
        Math.sin(this.animationState.flickerPhase * 10) * flicker * 0.3;
      element.style.opacity = Math.max(
        0.1,
        transparency + flickerAmount
      ).toString();
    }

    // Chromatic aberration
    if (chromatic > 0.2) {
      const chromaticOffset = chromatic * 2;
      element.style.filter = `
        drop-shadow(${chromaticOffset}px 0 0 rgba(255, 0, 0, 0.5))
        drop-shadow(-${chromaticOffset}px 0 0 rgba(0, 255, 255, 0.5))
      `;
    }

    // Holographic glow
    const glowIntensity = intensity * 0.3;
    element.style.boxShadow = `
      0 0 ${
        glowIntensity * 20
      }px rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${glowIntensity}),
      inset 0 0 ${
        glowIntensity * 10
      }px rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
      glowIntensity * 0.5
    })
    `;
  }

  // Apply translucent panel effect
  private applyTranslucentPanel(element: HTMLElement, intensity: number): void {
    const transparency = this.holographicState.transparency * intensity;

    element.style.background = `
      rgba(var(--spice-rgb-holographic-primary, var(--organic-holographic-rgb, 100, 255, 200)), ${
        transparency * 0.1
      }),
      linear-gradient(45deg,
        transparent 0%,
        rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.05
        }) 50%,
        transparent 100%)
    `;
    // Reduce backdrop blur to prevent excessive visual interference
    element.style.backdropFilter = `blur(${Math.min(intensity * 2, 3)}px)`;
    element.style.border = `1px solid rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${
      transparency * 0.6
    })`;
  }

  // Apply data stream effect
  private applyDataStream(element: HTMLElement, intensity: number): void {
    const streamSpeed = this.dataStream.speed * intensity;
    const streamDensity = this.dataStream.density * intensity;

    // Create scrolling data stream background
    const streamGradient = this.generateDataStreamGradient(
      streamSpeed,
      streamDensity
    );
    element.style.background = streamGradient;
    element.style.backgroundSize = "100% 20px";
    element.style.animation = `dataStream ${2 / streamSpeed}s linear infinite`;

    // Add CSS animation if not exists
    if (!document.getElementById("dataStreamAnimation")) {
      const style = document.createElement("style");
      style.id = "dataStreamAnimation";
      style.textContent = `
        @keyframes dataStream {
          0% { background-position: 0 0; }
          100% { background-position: 0 20px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Apply energy barrier effect
  private applyEnergyBarrier(element: HTMLElement, intensity: number): void {
    const energyStability = this.holographicState.energyStability;
    const interference = this.holographicState.interferenceLevel * intensity;

    // Energy barrier shimmer
    const shimmerIntensity = (1.0 - energyStability) * intensity;
    element.style.background = `
      linear-gradient(90deg,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${
          shimmerIntensity * 0.3
        }) 0%,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${
          shimmerIntensity * 0.1
        }) 50%,
        rgba(var(--organic-neon-glow-rgb, 0, 255, 255), ${
          shimmerIntensity * 0.3
        }) 100%)
    `;
    element.style.backgroundSize = "200% 100%";
    element.style.animation = `energyBarrier ${
      1 / shimmerIntensity
    }s ease-in-out infinite`;

    // Add CSS animation if not exists
    if (!document.getElementById("energyBarrierAnimation")) {
      const style = document.createElement("style");
      style.id = "energyBarrierAnimation";
      style.textContent = `
        @keyframes energyBarrier {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Apply consciousness interface effect
  private applyConsciousnessInterface(
    element: HTMLElement,
    intensity: number,
    consciousnessLevel: number
  ): void {
    const consciousnessState = this.manager.getConsciousnessState();
    const resonance =
      consciousnessState.symbioticResonance * consciousnessLevel;

    // Consciousness-responsive glow
    const glowIntensity = resonance * intensity * 0.5;
    element.style.boxShadow = `
      0 0 ${
        glowIntensity * 30
      }px rgba(var(--organic-accent-rgb, 203, 166, 247), ${glowIntensity}),
      inset 0 0 ${
        glowIntensity * 15
      }px rgba(var(--organic-accent-rgb, 203, 166, 247), ${glowIntensity * 0.3})
    `;

    // Consciousness-responsive transparency
    const consciousnessTransparency = 0.7 + resonance * 0.3;
    element.style.opacity = consciousnessTransparency.toString();

    // Consciousness pulsing
    if (resonance > 0.6) {
      const pulsePhase = this.animationState.organicPhase * 2;
      const pulseIntensity = 1.0 + Math.sin(pulsePhase) * resonance * 0.2;
      element.style.transform = `scale(${pulseIntensity})`;
    }
  }

  // Apply organic hologram effect
  private applyOrganicHologram(
    element: HTMLElement,
    intensity: number,
    organicIntegration: boolean
  ): void {
    if (!organicIntegration) return;

    const organicPhase = this.animationState.organicPhase;
    const organicIntensity = this.holographicState.energyStability * intensity;

    // Organic morphing
    const morphX = Math.sin(organicPhase * 1.5) * organicIntensity * 2;
    const morphY = Math.cos(organicPhase * 2.0) * organicIntensity * 1.5;
    element.style.transform = `translate(${morphX}px, ${morphY}px)`;

    // Organic color shifting
    const colorPhase = organicPhase * 0.5;
    const hueShift = Math.sin(colorPhase) * organicIntensity * 30;
    element.style.filter = `hue-rotate(${hueShift}deg)`;

    // Organic breathing
    const breathingPhase = organicPhase * 0.8;
    const breathingScale =
      1.0 + Math.sin(breathingPhase) * organicIntensity * 0.05;
    element.style.transform += ` scale(${breathingScale})`;
  }

  // Apply musical visualization effect
  private applyMusicalVisualization(
    element: HTMLElement,
    intensity: number
  ): void {
    const consciousnessState = this.manager.getConsciousnessState();
    const musicalIntensity = consciousnessState.symbioticResonance * intensity;

    // Musical responsiveness
    const visualPhase = this.animationState.dataStreamPhase * 3;
    const visualIntensity = musicalIntensity * 0.8;

    // Musical bars visualization
    const barHeight = Math.sin(visualPhase) * visualIntensity * 20;
    element.style.background = `
      linear-gradient(0deg,
        rgba(var(--organic-primary-rgb, 205, 214, 244), ${
          visualIntensity * 0.8
        }) 0%,
        rgba(var(--organic-primary-rgb, 205, 214, 244), ${
          visualIntensity * 0.4
        }) ${50 + barHeight}%,
        transparent ${50 + barHeight}%)
    `;

    // Musical pulsing
    const pulseIntensity =
      1.0 + Math.sin(visualPhase * 2) * musicalIntensity * 0.1;
    element.style.transform = `scaleY(${pulseIntensity})`;
  }

  // Apply scanline overlay effect
  private applyScanlineOverlay(element: HTMLElement, intensity: number): void {
    const scanlineIntensity =
      this.holographicState.scanlineIntensity * intensity;
    const scanlineFrequency = this.scanlineEffect.frequency;

    // Scanline pattern
    element.style.background = `
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        transparent ${scanlineFrequency - 1}px,
        rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
          scanlineIntensity * 0.1
        }) ${scanlineFrequency}px,
        rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
          scanlineIntensity * 0.1
        }) ${scanlineFrequency}px
      )
    `;

    // Animated scanlines
    if (this.scanlineEffect.animation) {
      element.style.animation = `scanlines ${
        1 / this.scanlineEffect.speed
      }s linear infinite`;
    }

    // Add CSS animation if not exists
    if (!document.getElementById("scanlineAnimation")) {
      const style = document.createElement("style");
      style.id = "scanlineAnimation";
      style.textContent = `
        @keyframes scanlines {
          0% { background-position: 0 0; }
          100% { background-position: 0 ${scanlineFrequency}px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Apply chromatic ghost effect
  private applyChromaticGhost(element: HTMLElement, intensity: number): void {
    const chromaticIntensity = this.holographicState.chromatic * intensity;

    // Multiple chromatic ghosts
    const redOffset = chromaticIntensity * 3;
    const greenOffset = chromaticIntensity * 1.5;
    const blueOffset = chromaticIntensity * 2;

    element.style.filter = `
      drop-shadow(${redOffset}px 0 0 rgba(255, 0, 0, 0.4))
      drop-shadow(-${greenOffset}px 0 0 rgba(0, 255, 0, 0.4))
      drop-shadow(0 ${blueOffset}px 0 rgba(0, 0, 255, 0.4))
    `;

    // Chromatic animation
    const chromaticPhase = this.animationState.chromaticPhase;
    const offsetAnimation = Math.sin(chromaticPhase * 5) * chromaticIntensity;
    element.style.transform = `translate(${offsetAnimation}px, 0)`;
  }

  // Apply consciousness modifiers
  private applyConsciousnessModifiers(
    element: HTMLElement,
    consciousnessLevel: number
  ): void {
    const consciousnessState = this.manager.getConsciousnessState();
    const resonance =
      consciousnessState.symbioticResonance * consciousnessLevel;

    // Consciousness-based brightness
    const brightness = 1.0 + resonance * 0.3;
    element.style.filter =
      (element.style.filter || "") + ` brightness(${brightness})`;

    // Consciousness-based saturation
    const saturation = 1.0 + resonance * 0.5;
    element.style.filter =
      (element.style.filter || "") + ` saturate(${saturation})`;
  }

  // Apply organic modifiers
  private applyOrganicModifiers(element: HTMLElement, intensity: number): void {
    const organicPhase = this.animationState.organicPhase;
    const organicIntensity = this.holographicState.energyStability * intensity;

    // Organic blur breathing - consolidate with existing filters to prevent stacking
    const blurPhase = organicPhase * 1.2;
    const organicBlurAmount = Math.sin(blurPhase) * organicIntensity * 2;

    // Parse existing filter to avoid blur stacking
    const currentFilter = element.style.filter || "";
    const hasExistingBlur = currentFilter.includes("blur(");

    if (!hasExistingBlur && organicBlurAmount > 0) {
      element.style.filter =
        currentFilter + ` blur(${Math.max(0, organicBlurAmount)}px)`;
    }

    // Organic opacity pulsing
    const opacityPhase = organicPhase * 0.7;
    const opacityModifier =
      1.0 + Math.sin(opacityPhase) * organicIntensity * 0.2;
    const currentOpacity = parseFloat(element.style.opacity) || 1.0;
    element.style.opacity = Math.max(
      0.1,
      Math.min(1.0, currentOpacity * opacityModifier)
    ).toString();
  }

  // Generate data stream gradient
  private generateDataStreamGradient(speed: number, density: number): string {
    const characters = this.dataStream.characters;
    const characterCount = Math.floor(density * 20);

    let gradient = "linear-gradient(90deg, ";

    for (let i = 0; i < characterCount; i++) {
      const position = (i / characterCount) * 100;
      const character =
        characters[Math.floor(Math.random() * characters.length)];
      const opacity = 0.1 + Math.random() * 0.3;

      const streamColor = this.getOKLABEnhancedDataStreamColor(
        opacity,
        this.lastMusicalContext
      );
      gradient += `${streamColor} ${position}%, `;
    }

    gradient = gradient.slice(0, -2) + ")";
    return gradient;
  }

  // Create interface container
  private async createInterfaceContainer(): Promise<void> {
    this.interfaceContainer = document.createElement("div");
    this.interfaceContainer.id = "holographic-interface-container";
    this.interfaceContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      mix-blend-mode: normal;
    `;

    document.body.appendChild(this.interfaceContainer);
  }

  // Scanline overlay removed - effects now applied directly to elements via CSS classes

  // Canvas methods removed - effects now implemented via CSS-only approach for better text clarity

  // Initialize holographic elements
  private async initializeHolographicElements(): Promise<void> {
    const elementSelectors = [
      { selector: ".main-view-container", type: "translucent_panel" },
      { selector: ".Root__nav-bar", type: "data_stream" },
      { selector: ".Root__now-playing-bar", type: "consciousness_interface" },
      {
        selector: ".main-view-container__scroll-node",
        type: "organic_hologram",
      },
      { selector: ".root-now-playing-view", type: "energy_barrier" },
      {
        selector: ".main-view-container__scroll-node-child",
        type: "scanline_overlay",
      },
    ];

    for (const config of elementSelectors) {
      const elements = document.querySelectorAll(config.selector);

      for (const element of elements) {
        const holographicElement: HolographicElement = {
          id: `holographic-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          element: element as HTMLElement,
          originalStyles: getComputedStyle(element),
          holographicType: config.type as HolographicType,
          intensity: 0.7,
          isActive: true,
          lastUpdate: 0,
          animation: null,
          consciousnessLevel: 0.8,
          organicIntegration: true,
        };

        this.holographicElements.set(holographicElement.id, holographicElement);
      }
    }
  }

  // Update holographic animation
  public updateHolographicAnimation(deltaMs: number): void {
    if (!this.isInitialized || !this.isEnabled) return;

    const deltaSeconds = deltaMs / 1000;

    // Update animation phases
    this.animationState.flickerPhase += deltaSeconds * 2;
    this.animationState.scanlinePhase +=
      deltaSeconds * this.scanlineEffect.speed;
    this.animationState.chromaticPhase += deltaSeconds * 1.5;
    this.animationState.dataStreamPhase += deltaSeconds * this.dataStream.speed;
    this.animationState.interferencePhase +=
      deltaSeconds * this.interferencePattern.frequency;
    this.animationState.organicPhase += deltaSeconds * 0.5;

    // Note: Scanline effects now handled via CSS classes on individual elements

    // Note: Data stream effects now handled via CSS-only per-element implementation

    // Update performance metrics
    this.performanceMetrics.lastUpdate = performance.now();
  }

  // Scanline overlay update method removed - effects now applied via CSS classes to individual elements

  // Data stream canvas method removed - now implemented via CSS-only per-element effects

  // Start holographic animation
  private startHolographicAnimation(): void {
    this.animationState.isAnimating = true;
    this.animationState.lastFrameTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.animationState.isAnimating) return;

      const deltaTime = currentTime - this.animationState.lastFrameTime;
      this.animationState.lastFrameTime = currentTime;

      // Update holographic animation
      this.updateHolographicAnimation(deltaTime);

      // Continue animation loop
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  // Utility methods
  private smoothTransition(
    current: number,
    target: number,
    speed: number
  ): number {
    return current + (target - current) * speed;
  }

  // Update performance metrics
  private updatePerformanceMetrics(processingTime: number): void {
    this.performanceMetrics.averageProcessingTime =
      this.performanceMetrics.averageProcessingTime * 0.9 +
      processingTime * 0.1;

    this.performanceMetrics.elementsProcessed = this.holographicElements.size;
    this.performanceMetrics.memoryUsage = this.holographicElements.size * 256; // Approximate bytes per element
  }

  // Public API methods
  public getHolographicState(): HolographicState {
    return { ...this.holographicState };
  }

  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }

  public getElementCount(): number {
    return this.holographicElements.size;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;

    if (!enabled) {
      // Clear all holographic effects
      for (const [id, element] of this.holographicElements) {
        element.element.style.opacity = "1";
        element.element.style.filter = "";
        element.element.style.background = "";
        element.element.style.boxShadow = "";
        element.element.style.transform = "";
      }
    }
  }

  public setHolographicPreset(presetName: string): void {
    const preset =
      this.holographicPresets[
        presetName as keyof typeof this.holographicPresets
      ];
    if (preset) {
      this.holographicState = { ...preset };
    }
  }

  public setFlickerIntensity(intensity: number): void {
    this.holographicState.flickerIntensity = Math.max(
      0,
      Math.min(1, intensity)
    );
  }

  /**
   * Enable volumetric depth effects for 3D holographic consciousness
   */
  public enableVolumetricDepth(depthLevel: number = 0.8): void {
    const perspectiveDepth = 800 + depthLevel * 1200; // 800px-2000px range

    // Set global perspective for volumetric effects
    if (this.interfaceContainer) {
      this.interfaceContainer.style.perspective = `${perspectiveDepth}px`;
      this.interfaceContainer.style.transformStyle = "preserve-3d";
    }

    // Update all holographic elements with volumetric layers
    for (const [id, holographicElement] of this.holographicElements) {
      this.applyVolumetricLayers(
        holographicElement.element,
        depthLevel,
        holographicElement.intensity
      );
    }

    console.log(
      `[HolographicUISystem] 🌊 Volumetric depth enabled: ${perspectiveDepth}px perspective`
    );
  }

  /**
   * Update volumetric layers for 3D consciousness depth
   */
  public updateVolumetricLayers(
    consciousnessLevel: number,
    emotionalTemperature: number
  ): void {
    const depthIntensity = consciousnessLevel * 0.8;
    const temperatureDepth = (emotionalTemperature - 4000) / 4000; // Normalize 4000K-8000K to 0-1

    for (const [id, holographicElement] of this.holographicElements) {
      this.applyVolumetricLayers(
        holographicElement.element,
        depthIntensity,
        holographicElement.intensity,
        temperatureDepth
      );
    }
  }

  /**
   * Apply volumetric 3D layers to holographic element
   */
  private applyVolumetricLayers(
    element: HTMLElement,
    depthLevel: number,
    intensity: number,
    temperatureDepth: number = 0.5
  ): void {
    // Calculate depth offset based on consciousness and temperature
    const baseDepth = depthLevel * 100; // -100px to +100px range
    const temperatureOffset = temperatureDepth * 50; // Additional depth based on emotional temperature
    const finalDepth = baseDepth + temperatureOffset;

    // Apply 3D transform with consciousness-driven depth
    const currentTransform = element.style.transform || "";
    const volumetricTransform = `translateZ(${finalDepth}px)`;

    // Preserve existing transforms and add volumetric depth
    if (currentTransform.includes("translateZ")) {
      element.style.transform = currentTransform.replace(
        /translateZ\([^)]*\)/,
        volumetricTransform
      );
    } else {
      element.style.transform =
        `${currentTransform} ${volumetricTransform}`.trim();
    }

    // Add volumetric shadow effects based on depth
    const shadowIntensity = (Math.abs(finalDepth) / 100) * intensity;
    const shadowBlur = shadowIntensity * 30;
    const shadowOffset =
      finalDepth > 0 ? shadowIntensity * 5 : -shadowIntensity * 3;

    const existingShadow = element.style.boxShadow || "";
    const volumetricShadow = `0 ${shadowOffset}px ${shadowBlur}px rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${
      shadowIntensity * 0.3
    })`;

    if (existingShadow) {
      element.style.boxShadow = `${existingShadow}, ${volumetricShadow}`;
    } else {
      element.style.boxShadow = volumetricShadow;
    }

    // Add volumetric atmosphere for depth perception
    this.applyVolumetricAtmosphere(element, depthLevel, intensity);
  }

  /**
   * Apply volumetric atmosphere effects for depth perception
   */
  private applyVolumetricAtmosphere(
    element: HTMLElement,
    depthLevel: number,
    intensity: number
  ): void {
    // Create depth-based atmospheric effects
    const atmosphereIntensity = depthLevel * intensity;
    const blurAmount = Math.max(0, (depthLevel - 0.5) * 4); // Blur distant elements
    const brightnessAdjust = 1 + (depthLevel - 0.5) * 0.3; // Brighten near elements

    // Apply atmospheric filters - avoid blur stacking
    const currentFilter = element.style.filter || "";
    const hasExistingBlur = currentFilter.includes("blur(");

    const atmosphericFilters = [
      // Only add blur if no existing blur effect
      blurAmount > 0 && !hasExistingBlur ? `blur(${blurAmount}px)` : "",
      `brightness(${brightnessAdjust})`,
      `saturate(${1 + atmosphereIntensity * 0.2})`,
    ]
      .filter((f) => f)
      .join(" ");

    // Merge with existing filters, avoiding duplicate effects
    const hasBrightness = currentFilter.includes("brightness");
    const hasSaturate = currentFilter.includes("saturate");

    if (currentFilter && !hasBrightness && !hasSaturate) {
      element.style.filter = `${currentFilter} ${atmosphericFilters}`;
    } else if (!currentFilter) {
      element.style.filter = atmosphericFilters;
    }
    // Skip if filters already exist to prevent stacking

    // Add depth-based opacity scaling for atmospheric perspective
    const baseOpacity = parseFloat(element.style.opacity || "1");
    const atmosphericOpacity = Math.max(
      0.3,
      baseOpacity - (1 - depthLevel) * 0.3
    );
    element.style.opacity = atmosphericOpacity.toString();
  }

  /**
   * Consciousness data stream functionality converted to CSS-only implementation
   * Data is now integrated into element-native effects for better text clarity
   */

  // Canvas-based consciousness data stream methods removed - now handled via CSS-only implementations

  /**
   * Organic consciousness atmospheric effects system
   * Phase 4.2c: Advanced Atmospheric Enhancement - flowing, seamless, organic
   * Now updates CSS variables for element-native consciousness effects
   */
  public updateConsciousnessScanlines(
    consciousnessLevel: number,
    emotionalTemperature: number,
    musicalIntensity: number
  ): void {
    // Update CSS variables for element-native consciousness effects
    const consciousnessDensity = Math.max(0.2, consciousnessLevel * 1.5);
    const temperatureFrequency =
      this.mapTemperatureToFrequency(emotionalTemperature);
    const musicalPulse =
      Math.sin(performance.now() * 0.005 * musicalIntensity) * 0.3 + 0.7;

    // Update CSS variables using coordination for consciousness effects
    const consciousnessScanlineVariables = {
      "--consciousness-scanline-density": consciousnessDensity.toString(),
      "--consciousness-scanline-frequency": `${temperatureFrequency}px`,
      "--consciousness-scanline-opacity": (consciousnessLevel * 0.15).toString(),
      "--musical-scanline-pulse": musicalPulse.toString(),
      "--temperature-scanline-color-shift": `${((emotionalTemperature - 5000) / 3000) * 30}deg`
    };

    this.cssController.batchSetVariables(
      "HolographicUISystem",
      consciousnessScanlineVariables,
      "high", // High priority for consciousness scanline effects
      "consciousness-scanline-update"
    );
  }

  /**
   * Update enhanced aberration system CSS variables based on consciousness and musical data
   * Phase 4.2g: Enhanced CSS-Only Aberration Integration
   */
  public updateAberrationEffects(
    consciousnessLevel: number,
    emotionalTemperature: number,
    musicalIntensity: number,
    beatDetected: boolean = false
  ): void {
    const root = document.documentElement;

    // Base aberration intensity controlled by consciousness level
    const baseIntensity = Math.min(1, consciousnessLevel * 1.2);

    // Musical synchronization affects color separation and pulse
    const musicalSync = Math.min(1, musicalIntensity * 1.5);
    const colorSeparation = 2 + musicalSync * 3; // 2-5px range

    // Emotional temperature affects RGB channel shifts
    const tempNormalized = Math.max(3000, Math.min(8000, emotionalTemperature));
    const tempRatio = (tempNormalized - 5500) / 2500; // -1 to 1 range around neutral 5500K

    // Calculate individual channel shifts based on temperature
    const redShift = 1.5 + tempRatio * 2; // More red shift for warm temperatures
    const blueShift = -1.5 - tempRatio * 2; // More blue shift for cool temperatures
    const greenShift = tempRatio * 0.5; // Subtle green adjustment

    // Musical pulse calculation with beat detection enhancement
    const musicalPulse =
      Math.sin(performance.now() * 0.003 * musicalIntensity) * 0.4 + 0.6;
    const beatBoost = beatDetected ? 1.5 : 1.0;

    // Wave frequency affected by consciousness and music
    const waveFrequency =
      1000 + consciousnessLevel * 2000 + musicalIntensity * 1000; // 1-4s range

    // Update aberration CSS variables using coordination
    const aberrationEffectVariables = {
      "--aberration-intensity": (baseIntensity * beatBoost).toString(),
      "--aberration-color-separation": `${colorSeparation}px`,
      "--aberration-musical-sync": musicalSync.toString(),
      "--aberration-emotional-temperature": `${emotionalTemperature}K`,
      "--aberration-consciousness-level": consciousnessLevel.toString(),
      "--aberration-red-shift": `${redShift}px`,
      "--aberration-green-shift": `${greenShift}px`,
      "--aberration-blue-shift": `${blueShift}px`,
      "--aberration-wave-frequency": `${waveFrequency}ms`,
      "--aberration-pulse-intensity": (musicalPulse * beatBoost).toString()
    };

    this.cssController.batchSetVariables(
      "HolographicUISystem",
      aberrationEffectVariables,
      "high", // High priority for aberration effects - affects visual perception
      "aberration-effects-update"
    );

    // Reading mode integration (already handled by existing reading mode detection)
    const readingModeActive = parseFloat(
      root.style.getPropertyValue("--reading-mode-active") || "0"
    );
    const readingModeReduction = Math.min(0.8, readingModeActive * 0.6);
    
    this.cssController.setVariable(
      "HolographicUISystem",
      "--aberration-reading-mode-reduction",
      readingModeReduction.toString(),
      "critical", // Critical priority for reading mode accessibility
      "aberration-reading-mode-update"
    );
  }

  /**
   * Map emotional temperature to scanline frequency
   */
  private mapTemperatureToFrequency(temperature: number): number {
    // Cool temperatures (3000K-5000K) = slower, denser scanlines (2-4Hz)
    // Warm temperatures (5000K-7000K) = faster, sparser scanlines (4-8Hz)
    // Hot temperatures (7000K+) = rapid, energetic scanlines (8-12Hz)
    const normalizedTemp = Math.max(3000, Math.min(8000, temperature));
    const tempRatio = (normalizedTemp - 3000) / 5000; // 0-1 range
    return 2 + tempRatio * 10; // 2-12Hz range
  }

  // applySophisticatedScanlines method removed - converted to CSS-only implementation

  /**
   * Update CSS variables for scanline system integration
   */
  private updateScanlineCSSVariables(
    consciousnessLevel: number,
    emotionalTemperature: number,
    musicalIntensity: number
  ): void {
    // Base scanline consciousness variables
    const scanlineCoreVariables = {
      "--consciousness-scanline-density": consciousnessLevel.toString(),
      "--consciousness-scanline-frequency": `${this.scanlineEffect.frequency}px`,
      "--consciousness-scanline-opacity": this.scanlineEffect.opacity.toString(),
      "--consciousness-scanline-speed": `${this.scanlineEffect.speed}s`,
      "--temperature-scanline-color-shift": `${((emotionalTemperature - 5000) / 2000) * 30}deg`,
      "--musical-scanline-pulse": musicalIntensity.toString()
    };

    this.cssController.batchSetVariables(
      "HolographicUISystem",
      scanlineCoreVariables,
      "high", // High priority for scanline consciousness effects
      "scanline-consciousness-update"
    );

    // Advanced consciousness scanline effects based on consciousness level
    const advancedScanlineVariables = {
      "--consciousness-scanline-interference": consciousnessLevel > 0.7 ? "visible" : "none",
      "--consciousness-scanline-complexity": consciousnessLevel > 0.7 
        ? Math.min(1, (consciousnessLevel - 0.7) * 3.33).toString()
        : "0"
    };

    this.cssController.batchSetVariables(
      "HolographicUISystem",
      advancedScanlineVariables,
      "high", // High priority for advanced consciousness scanline effects
      "scanline-complexity-update"
    );
  }

  /**
   * Detect reading mode based on user activity and content area
   * Updates CSS variables for reading-mode-aware holographic effects
   */
  public detectReadingMode(): void {
    const root = document.documentElement;

    // Check if user is actively reading (scrolling, text selection, long hover)
    const isTextSelected = (window.getSelection()?.toString() || "").length > 0;
    const isUserScrolling = this.isUserCurrentlyScrolling();
    const isHoveringTextContent = this.isHoveringTextContent();

    // Calculate reading mode intensity (0-1)
    let readingModeActive = 0;

    if (isTextSelected) readingModeActive += 0.6;
    if (isUserScrolling) readingModeActive += 0.3;
    if (isHoveringTextContent) readingModeActive += 0.4;

    // Smooth reading mode transitions
    readingModeActive = Math.min(1, readingModeActive);

    // Update CSS variable for holographic effect intensity reduction during reading using coordination
    this.cssController.setVariable(
      "HolographicUISystem",
      "--reading-mode-active",
      readingModeActive.toString(),
      "critical", // Critical priority for reading mode - affects accessibility
      "reading-mode-detection-update"
    );
  }

  /**
   * Track user interaction patterns for content-aware holographic effects
   */
  public trackUserInteraction(): void {
    const root = document.documentElement;

    // Detect various interaction types
    const isMouseMoving = this.isMouseCurrentlyMoving();
    const isClickingUI = this.wasRecentUIClick();
    const isFocusedOnInput = this.isFocusedOnInputElement();

    // Calculate interaction intensity (0-1)
    let interactionIntensity = 0;

    if (isMouseMoving) interactionIntensity += 0.4;
    if (isClickingUI) interactionIntensity += 0.5;
    if (isFocusedOnInput) interactionIntensity += 0.6;

    // Smooth interaction intensity for natural holographic response
    interactionIntensity = Math.min(1, interactionIntensity);

    // Update CSS variable for interaction-aware holographic effects using coordination
    this.cssController.setVariable(
      "HolographicUISystem",
      "--user-interaction-detected",
      interactionIntensity.toString(),
      "high", // High priority for user interaction detection - affects responsiveness
      "user-interaction-update"
    );
  }

  /**
   * Check if user is currently scrolling (used for reading mode detection)
   */
  private isUserCurrentlyScrolling(): boolean {
    // Simple scroll detection - can be enhanced with more sophisticated timing
    const scrollContainer = document.querySelector(
      ".main-view-container__scroll-node"
    );
    if (!scrollContainer) return false;

    // Check if scroll position has changed recently
    const currentScrollTop = scrollContainer.scrollTop;
    const lastScrollTop = this.lastScrollPosition || 0;
    this.lastScrollPosition = currentScrollTop;

    return Math.abs(currentScrollTop - lastScrollTop) > 5;
  }

  /**
   * Check if user is hovering over text content
   */
  private isHoveringTextContent(): boolean {
    const hoveredElement = document.querySelector(":hover");
    if (!hoveredElement) return false;

    // Check if hovered element contains significant text content
    const textContent = hoveredElement.textContent?.trim() || "";
    return textContent.length > 20; // Threshold for "significant" text
  }

  /**
   * Check if mouse is currently moving
   */
  private isMouseCurrentlyMoving(): boolean {
    // Track mouse movement with simple timestamp check
    const now = performance.now();
    const lastMovement = this.lastMouseMovement || 0;
    return now - lastMovement < 2000; // Movement within last 2 seconds
  }

  /**
   * Check if there was a recent UI click
   */
  private wasRecentUIClick(): boolean {
    const now = performance.now();
    const lastClick = this.lastUIClick || 0;
    return now - lastClick < 1000; // Click within last 1 second
  }

  /**
   * Check if user is focused on an input element
   */
  private isFocusedOnInputElement(): boolean {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const inputElements = ["input", "textarea", "select"];
    return (
      inputElements.includes(activeElement.tagName.toLowerCase()) ||
      activeElement.getAttribute("contenteditable") === "true"
    );
  }

  public setTransparency(transparency: number): void {
    this.holographicState.transparency = Math.max(0, Math.min(1, transparency));
  }

  public setChromaticAberration(chromatic: number): void {
    this.holographicState.chromatic = Math.max(0, Math.min(1, chromatic));
  }

  // Cleanup
  public destroy(): void {
    console.log("[HolographicUISystem] Destroying holographic UI system...");

    // Stop animation
    this.animationState.isAnimating = false;

    // Clear holographic elements
    for (const [id, element] of this.holographicElements) {
      // Restore original styles
      element.element.style.opacity = "1";
      element.element.style.filter = "";
      element.element.style.background = "";
      element.element.style.boxShadow = "";
      element.element.style.transform = "";

      // Cancel animations
      if (element.animation) {
        element.animation.cancel();
      }
    }
    this.holographicElements.clear();

    // Remove interface container
    if (this.interfaceContainer && this.interfaceContainer.parentNode) {
      this.interfaceContainer.parentNode.removeChild(this.interfaceContainer);
    }

    // Remove CSS animations
    const animations = [
      "dataStreamAnimation",
      "energyBarrierAnimation",
      "scanlineAnimation",
    ];
    animations.forEach((animationId) => {
      const style = document.getElementById(animationId);
      if (style) {
        style.remove();
      }
    });

    this.isInitialized = false;
    this.initialized = false;

    // Cleanup OKLAB event subscriptions
    this.eventSubscriptionIds.forEach((id) => {
      unifiedEventBus.unsubscribe(id);
    });
    this.eventSubscriptionIds = [];
  }

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  /**
   * Set quality level for holographic effects
   */
  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;

    // Adjust holographic settings based on quality level
    switch (level) {
      case "low":
        this.holographicState.flickerIntensity = 0.1;
        this.holographicState.transparency = 0.9;
        this.holographicState.chromatic = 0.1;
        this.holographicState.scanlineIntensity = 0.2;
        this.holographicState.dataStreamFlow = 0.2;
        this.holographicState.interferenceLevel = 0.0;
        this.scanlineEffect.animation = false;
        break;

      case "low":
        this.holographicState.flickerIntensity = 0.2;
        this.holographicState.transparency = 0.85;
        this.holographicState.chromatic = 0.2;
        this.holographicState.scanlineIntensity = 0.3;
        this.holographicState.dataStreamFlow = 0.3;
        this.holographicState.interferenceLevel = 0.1;
        this.scanlineEffect.animation = true;
        this.scanlineEffect.speed = 0.3;
        break;

      case "medium":
        this.holographicState.flickerIntensity = 0.4;
        this.holographicState.transparency = 0.8;
        this.holographicState.chromatic = 0.3;
        this.holographicState.scanlineIntensity = 0.6;
        this.holographicState.dataStreamFlow = 0.5;
        this.holographicState.interferenceLevel = 0.2;
        this.scanlineEffect.animation = true;
        this.scanlineEffect.speed = 0.5;
        break;

      case "high":
        this.holographicState.flickerIntensity = 0.6;
        this.holographicState.transparency = 0.7;
        this.holographicState.chromatic = 0.5;
        this.holographicState.scanlineIntensity = 0.8;
        this.holographicState.dataStreamFlow = 0.8;
        this.holographicState.interferenceLevel = 0.4;
        this.scanlineEffect.animation = true;
        this.scanlineEffect.speed = 0.8;
        break;

      case "high":
        this.holographicState.flickerIntensity = 0.8;
        this.holographicState.transparency = 0.6;
        this.holographicState.chromatic = 0.7;
        this.holographicState.scanlineIntensity = 1.0;
        this.holographicState.dataStreamFlow = 1.0;
        this.holographicState.interferenceLevel = 0.6;
        this.scanlineEffect.animation = true;
        this.scanlineEffect.speed = 1.0;
        break;
    }

    // Update quality capabilities
    this.updateQualityCapabilities(level);
  }

  /**
   * Get current performance impact metrics
   */
  public getPerformanceImpact(): PerformanceMetrics {
    const activeElements = this.holographicElements.size;
    const averageProcessingTime = this.calculateProcessingTime();

    return {
      fps: 60, // Holographic effects typically maintain 60fps
      frameTime: averageProcessingTime,
      memoryUsage: this.estimateMemoryUsage(),
      cpuUsage: this.estimateCPUUsage(activeElements),
    };
  }

  /**
   * Reduce quality by specified amount
   */
  public reduceQuality(amount: number): void {
    // Apply quality reduction adjustments
    this.qualityAdjustments["flicker-reduction"] =
      (this.qualityAdjustments["flicker-reduction"] || 0) + amount;
    this.qualityAdjustments["effect-reduction"] =
      (this.qualityAdjustments["effect-reduction"] || 0) + amount * 0.8;

    // Apply reductions to current settings
    this.holographicState.flickerIntensity = Math.max(
      0.1,
      this.holographicState.flickerIntensity * (1 - amount * 0.8)
    );
    this.holographicState.chromatic = Math.max(
      0.0,
      this.holographicState.chromatic * (1 - amount)
    );
    this.holographicState.scanlineIntensity = Math.max(
      0.1,
      this.holographicState.scanlineIntensity * (1 - amount * 0.6)
    );
    this.holographicState.dataStreamFlow = Math.max(
      0.1,
      this.holographicState.dataStreamFlow * (1 - amount * 0.4)
    );
    this.holographicState.interferenceLevel = Math.max(
      0.0,
      this.holographicState.interferenceLevel * (1 - amount)
    );

    // Disable animation for significant reductions
    if (amount > 0.5) {
      this.scanlineEffect.animation = false;
    }
  }

  /**
   * Increase quality by specified amount
   */
  public increaseQuality(amount: number): void {
    // Remove previous reductions first
    Object.keys(this.qualityAdjustments).forEach((key) => {
      this.qualityAdjustments[key] = Math.max(
        0,
        (this.qualityAdjustments[key] || 0) - amount
      );
    });

    // Restore quality settings based on current level
    if (this.currentQualityLevel) {
      const preset = this.getPresetForLevel(this.currentQualityLevel);

      // Gradually restore towards preset settings
      this.holographicState.flickerIntensity = Math.min(
        preset.flickerIntensity,
        this.holographicState.flickerIntensity * (1 + amount * 0.3)
      );
      this.holographicState.chromatic = Math.min(
        preset.chromatic,
        this.holographicState.chromatic * (1 + amount * 0.4)
      );
      this.holographicState.scanlineIntensity = Math.min(
        preset.scanlineIntensity,
        this.holographicState.scanlineIntensity * (1 + amount * 0.2)
      );
      this.holographicState.dataStreamFlow = Math.min(
        preset.dataStreamFlow,
        this.holographicState.dataStreamFlow * (1 + amount * 0.2)
      );

      // Re-enable animation if quality is sufficient
      if (amount > 0.3) {
        this.scanlineEffect.animation = true;
      }
    }
  }

  /**
   * Get quality capabilities for this system
   */
  public getQualityCapabilities(): QualityCapability[] {
    return [...this.qualityCapabilities];
  }

  // ========================================================================
  // QUALITY SCALING HELPER METHODS
  // ========================================================================

  private updateQualityCapabilities(level: QualityLevel): void {
    this.qualityCapabilities.forEach((capability) => {
      switch (capability.name) {
        case "holographic-effects":
          capability.enabled = this.holographicState.flickerIntensity > 0.2;
          break;
        case "scanline-overlay":
          capability.enabled = this.holographicState.scanlineIntensity > 0.3;
          break;
        case "chromatic-aberration":
          capability.enabled = this.holographicState.chromatic > 0.2;
          break;
        case "data-streams":
          capability.enabled = this.holographicState.dataStreamFlow > 0.3;
          break;
        case "interference-patterns":
          capability.enabled = this.holographicState.interferenceLevel > 0.1;
          break;
        case "organic-integration":
          capability.enabled = level !== "low";
          break;
      }
    });
  }

  private getPresetForLevel(level: string): HolographicState {
    switch (level) {
      case "low":
        return this.holographicPresets["organic-consciousness"];
      case "medium":
        return this.holographicPresets["star-wars"];
      case "high":
        return this.holographicPresets["blade-runner"];
      default:
        return this.holographicPresets["star-wars"];
    }
  }

  private calculateProcessingTime(): number {
    const activeElements = this.holographicElements.size;
    const complexityFactor =
      (this.holographicState.flickerIntensity +
        this.holographicState.chromatic +
        this.holographicState.scanlineIntensity) /
      3;

    return Math.max(2, activeElements * complexityFactor * 0.5);
  }

  private estimateMemoryUsage(): number {
    const activeElements = this.holographicElements.size;
    const baseMemoryPerElement = 0.3; // MB per holographic element
    const canvasMemory = 0; // Canvas overlays removed - now using CSS-only approach

    return baseMemoryPerElement * activeElements + canvasMemory;
  }

  private estimateCPUUsage(activeElements: number): number {
    const baseUsage = 2; // Base CPU usage percentage
    const complexityFactor =
      (this.holographicState.flickerIntensity +
        this.holographicState.chromatic +
        this.holographicState.scanlineIntensity) /
      3;
    const animationMultiplier = this.scanlineEffect.animation ? 1.5 : 1.0;

    return Math.min(
      30,
      baseUsage * activeElements * complexityFactor * animationMultiplier
    );
  }

  /**
   * Convert hex color to RGB string for CSS variables
   */
  private hexToRgb(hex: string): string {
    try {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result && result[1] && result[2] && result[3]) {
        return `${parseInt(result[1], 16)}, ${parseInt(
          result[2],
          16
        )}, ${parseInt(result[3], 16)}`;
      }
      return "100, 255, 200"; // Fallback holographic cyan
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "HolographicUISystem",
        "Failed to convert hex to RGB:",
        error
      );
      return "100, 255, 200";
    }
  }

  /**
   * Setup OKLAB event subscriptions for holographic consciousness
   */
  private setupOKLABEventSubscriptions(): void {
    try {
      // Subscribe to unified OKLAB color events (with type assertion for now)
      const oklabColorId = unifiedEventBus.subscribe(
        "colors:oklab-enhanced" as any,
        this.handleOKLABColorEvent.bind(this),
        "HolographicUISystem"
      );
      this.eventSubscriptionIds.push(oklabColorId);

      // Subscribe to musical OKLAB coordination events (with type assertion for now)
      const musicalOklabId = unifiedEventBus.subscribe(
        "colors:musical-oklab-coordinated" as any,
        this.handleMusicalOKLABEvent.bind(this),
        "HolographicUISystem"
      );
      this.eventSubscriptionIds.push(musicalOklabId);

      // Subscribe to emotional temperature mapping events (with type assertion for now)
      const emotionalTempId = unifiedEventBus.subscribe(
        "colors:emotional-temperature-mapped" as any,
        this.handleEmotionalTemperatureEvent.bind(this),
        "HolographicUISystem"
      );
      this.eventSubscriptionIds.push(emotionalTempId);

      // Subscribe to genre detection events for preset adjustment (with type assertion for now)
      const genreDetectedId = unifiedEventBus.subscribe(
        "audio:genre-detected" as any,
        this.handleGenreDetectionEvent.bind(this),
        "HolographicUISystem"
      );
      this.eventSubscriptionIds.push(genreDetectedId);

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "OKLAB event subscriptions established",
        {
          subscriptionCount: this.eventSubscriptionIds.length,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to setup OKLAB event subscriptions:",
        error
      );
    }
  }

  /**
   * Setup user interaction tracking for content-aware holographic effects
   */
  private setupUserInteractionTracking(): void {
    try {
      // Track mouse movement for interaction awareness
      document.addEventListener(
        "mousemove",
        () => {
          this.lastMouseMovement = performance.now();
        },
        { passive: true }
      );

      // Track clicks for UI interaction detection
      document.addEventListener(
        "click",
        () => {
          this.lastUIClick = performance.now();
        },
        { passive: true }
      );

      // Setup periodic reading mode and interaction detection
      setInterval(() => {
        this.detectReadingMode();
        this.trackUserInteraction();
      }, 500); // Check every 500ms for smooth responsiveness

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "User interaction tracking initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to setup user interaction tracking:",
        error
      );
    }
  }

  /**
   * Handle unified OKLAB color events
   */
  private async handleOKLABColorEvent(data: any): Promise<void> {
    try {
      const { enhancedColors, oklabPreset, rawColors, trackUri } = data;

      // Update holographic preset based on OKLAB enhancement
      if (oklabPreset) {
        this.holographicPreset = oklabPreset;
      }

      // Extract perceptually uniform colors for holographic effects
      if (enhancedColors) {
        await this.updateHolographicColorsFromOKLAB(enhancedColors);
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Updated holographic colors from OKLAB event",
        {
          preset: oklabPreset?.name,
          trackUri,
          colorCount: Object.keys(enhancedColors || {}).length,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to handle OKLAB color event:",
        error
      );
    }
  }

  /**
   * Handle musical OKLAB coordination events
   */
  private async handleMusicalOKLABEvent(data: any): Promise<void> {
    try {
      const {
        coordinatedColors,
        detectedGenre,
        emotionalResult,
        oklabPreset,
        musicInfluenceStrength,
        coordinationStrategy,
      } = data;

      // Store musical context for holographic responsiveness
      this.lastMusicalContext = {
        genre: detectedGenre,
        emotion: emotionalResult?.primaryEmotion,
        preset: oklabPreset,
        influence: musicInfluenceStrength,
        strategy: coordinationStrategy,
        timestamp: Date.now(),
      };

      // Update holographic preset based on musical context
      if (oklabPreset) {
        this.holographicPreset = oklabPreset;
      }

      // Apply musical OKLAB colors to holographic system
      if (coordinatedColors) {
        await this.updateHolographicColorsFromMusicalOKLAB(
          coordinatedColors,
          this.lastMusicalContext
        );
      }

      // Update enhanced aberration effects with musical data
      if (emotionalResult && musicInfluenceStrength !== undefined) {
        const consciousnessLevel =
          this.holographicState.flickerIntensity || 0.5; // Use current holographic state
        const emotionalTemperature =
          emotionalResult.emotionalTemperature || 6000;
        const musicalIntensity = musicInfluenceStrength;
        const beatDetected = emotionalResult.beatDetected || false;

        this.updateAberrationEffects(
          consciousnessLevel,
          emotionalTemperature,
          musicalIntensity,
          beatDetected
        );
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Updated holographic effects from musical OKLAB coordination",
        {
          genre: detectedGenre,
          emotion: emotionalResult?.primaryEmotion,
          preset: oklabPreset?.name,
          influence: musicInfluenceStrength,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to handle musical OKLAB event:",
        error
      );
    }
  }

  /**
   * Handle emotional temperature mapping events
   */
  private async handleEmotionalTemperatureEvent(data: any): Promise<void> {
    try {
      const {
        emotionalTemperature,
        primaryEmotion,
        perceptualColorHex,
        oklabPreset,
        cssVariables,
      } = data;

      // Update holographic emotional responsiveness
      await this.updateHolographicEmotionalTemperature(
        emotionalTemperature,
        primaryEmotion
      );

      // Apply emotional OKLAB color
      if (perceptualColorHex) {
        await this.updateHolographicColorFromEmotionalOKLAB(
          perceptualColorHex,
          emotionalTemperature
        );
      }

      // Update aberration effects with emotional temperature data
      const consciousnessLevel = this.holographicState.flickerIntensity || 0.5;
      const musicalIntensity = this.lastMusicalContext?.influence || 0.5;
      this.updateAberrationEffects(
        consciousnessLevel,
        emotionalTemperature,
        musicalIntensity,
        false
      );

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Updated holographic emotional temperature",
        {
          temperature: emotionalTemperature,
          emotion: primaryEmotion,
          color: perceptualColorHex,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to handle emotional temperature event:",
        error
      );
    }
  }

  /**
   * Handle genre detection events for preset adjustment
   */
  private async handleGenreDetectionEvent(data: any): Promise<void> {
    try {
      const { detectedGenre, confidence, audioFeatures } = data;

      // Get genre-specific OKLAB preset
      const genrePreset =
        this.genreManager.getOKLABPresetForGenre(detectedGenre);
      if (genrePreset) {
        this.holographicPreset = genrePreset;

        // Adjust holographic effects based on genre characteristics
        await this.adjustHolographicEffectsForGenre(
          detectedGenre,
          audioFeatures
        );
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Adjusted holographic effects for detected genre",
        {
          genre: detectedGenre,
          confidence,
          preset: genrePreset?.name,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to handle genre detection event:",
        error
      );
    }
  }

  /**
   * Update holographic colors from OKLAB-enhanced colors
   */
  private async updateHolographicColorsFromOKLAB(
    enhancedColors: Record<string, string>
  ): Promise<void> {
    try {
      // Collect all OKLAB-enhanced holographic color variables
      const holographicColorVariables: Record<string, string> = {};

      // Process enhanced colors through OKLAB for perceptual uniformity
      Object.entries(enhancedColors).forEach(([key, hexColor]) => {
        if (hexColor && typeof hexColor === "string") {
          // Convert hex to OKLAB-enhanced CSS variables
          const oklabResult = this.oklabProcessor.processColor(
            hexColor,
            this.holographicPreset
          );

          if (oklabResult.enhancedHex) {
            // Collect holographic CSS variables with OKLAB-enhanced colors
            holographicColorVariables[`--holographic-${key.toLowerCase()}`] = oklabResult.enhancedHex;
            holographicColorVariables[`--holographic-${key.toLowerCase()}-rgb`] = this.hexToRgb(oklabResult.enhancedHex);

            // Add OKLAB-specific variables if available
            if (oklabResult.oklabEnhanced) {
              const { L, a, b } = oklabResult.oklabEnhanced;
              holographicColorVariables[`--holographic-${key.toLowerCase()}-oklab`] = 
                `${L.toFixed(3)} ${a.toFixed(3)} ${b.toFixed(3)}`;
            }
          }
        }
      });

      // Update primary holographic variables for backward compatibility
      if (enhancedColors["VIBRANT"] || enhancedColors["PRIMARY"]) {
        const primaryColor =
          enhancedColors["VIBRANT"] || enhancedColors["PRIMARY"];
        if (primaryColor) {
          const oklabResult = this.oklabProcessor.processColor(
            primaryColor,
            this.holographicPreset
          );

          if (oklabResult.enhancedHex) {
            holographicColorVariables["--organic-holographic-rgb"] = this.hexToRgb(oklabResult.enhancedHex);
            holographicColorVariables["--sn-holographic-primary"] = oklabResult.enhancedHex;
          }
        }
      }

      // Apply all holographic color variables using coordination
      if (Object.keys(holographicColorVariables).length > 0) {
        this.cssController.batchSetVariables(
          "HolographicUISystem",
          holographicColorVariables,
          "critical", // Critical priority for holographic color updates - affects visual perception
          "oklab-holographic-colors-update"
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to update holographic colors from OKLAB:",
        error
      );
    }
  }

  /**
   * Update holographic colors from musical OKLAB coordination
   */
  private async updateHolographicColorsFromMusicalOKLAB(
    coordinatedColors: Record<string, string>,
    musicalContext: any
  ): Promise<void> {
    try {
      // Apply coordinated colors with musical responsiveness
      await this.updateHolographicColorsFromOKLAB(coordinatedColors);

      // Adjust holographic intensity based on musical influence
      if (musicalContext.influence) {
        this.adjustHolographicIntensityFromMusicalInfluence(
          musicalContext.influence
        );
      }

      // Apply genre-specific holographic modifications
      if (musicalContext.genre) {
        await this.applyGenreSpecificHolographicEffects(
          musicalContext.genre,
          musicalContext.emotion
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to update holographic colors from musical OKLAB:",
        error
      );
    }
  }

  /**
   * Update holographic color from emotional OKLAB mapping
   */
  private async updateHolographicColorFromEmotionalOKLAB(
    perceptualColorHex: string,
    emotionalTemperature: number
  ): Promise<void> {
    try {
      const root = document.documentElement;

      // Process emotional color through OKLAB
      const oklabResult = this.oklabProcessor.processColor(
        perceptualColorHex,
        this.holographicPreset
      );

      if (oklabResult.enhancedHex) {
        // Set emotional OKLAB holographic color using coordination
        const emotionalHolographicVariables = {
          "--holographic-emotional-primary": oklabResult.enhancedHex,
          "--holographic-emotional-rgb": this.hexToRgb(oklabResult.enhancedHex),
          "--holographic-emotional-temperature": `${emotionalTemperature}K`
        };

        this.cssController.batchSetVariables(
          "HolographicUISystem",
          emotionalHolographicVariables,
          "critical", // Critical priority for emotional holographic colors - affects consciousness perception
          "emotional-oklab-holographic-update"
        );

        // Update holographic emotional temperature effects
        await this.updateHolographicEmotionalTemperature(
          emotionalTemperature,
          null
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to update holographic color from emotional OKLAB:",
        error
      );
    }
  }

  /**
   * Update holographic emotional temperature responsiveness
   */
  private async updateHolographicEmotionalTemperature(
    temperature: number,
    emotion: string | null
  ): Promise<void> {
    try {
      // Map temperature to holographic effects
      const temperatureNormalized = Math.max(3000, Math.min(8000, temperature));
      const tempRatio = (temperatureNormalized - 3000) / 5000; // 0-1 range

      // Adjust holographic state based on emotional temperature
      this.holographicState.flickerIntensity = 0.2 + tempRatio * 0.4; // Warmer = more flicker
      this.holographicState.chromatic = 0.1 + tempRatio * 0.3; // Warmer = more chromatic
      this.holographicState.energyStability = 1.0 - tempRatio * 0.3; // Warmer = less stable

      // Cool temperatures enhance transparency and flow
      if (tempRatio < 0.4) {
        this.holographicState.transparency = 0.9 + tempRatio * 0.1;
        this.holographicState.dataStreamFlow = 0.3 + tempRatio * 0.2;
      } else {
        // Warm temperatures enhance intensity and interference
        this.holographicState.transparency = 0.8 - (tempRatio - 0.4) * 0.2;
        this.holographicState.interferenceLevel = 0.1 + (tempRatio - 0.4) * 0.3;
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Updated holographic effects from emotional temperature",
        {
          temperature,
          tempRatio,
          flicker: this.holographicState.flickerIntensity,
          chromatic: this.holographicState.chromatic,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to update holographic emotional temperature:",
        error
      );
    }
  }

  /**
   * Adjust holographic effects for detected genre
   */
  private async adjustHolographicEffectsForGenre(
    genre: string,
    audioFeatures?: any
  ): Promise<void> {
    try {
      // Genre-specific holographic effect adjustments
      switch (genre.toLowerCase()) {
        case "electronic":
        case "techno":
        case "edm":
          this.holographicState.dataStreamFlow = 0.8;
          this.holographicState.scanlineIntensity = 0.7;
          this.holographicState.interferenceLevel = 0.4;
          this.scanlineEffect.speed = 0.8;
          break;

        case "classical":
        case "orchestral":
          this.holographicState.transparency = 0.9;
          this.holographicState.energyStability = 0.8;
          this.holographicState.flickerIntensity = 0.2;
          this.scanlineEffect.organic = true;
          break;

        case "rock":
        case "metal":
          this.holographicState.flickerIntensity = 0.6;
          this.holographicState.chromatic = 0.5;
          this.holographicState.interferenceLevel = 0.5;
          this.scanlineEffect.animation = true;
          break;

        case "ambient":
        case "atmospheric":
          this.holographicState.transparency = 0.95;
          this.holographicState.dataStreamFlow = 0.3;
          this.holographicState.energyStability = 0.9;
          this.scanlineEffect.organic = true;
          this.scanlineEffect.speed = 0.2;
          break;

        case "jazz":
        case "blues":
          this.holographicState.flickerIntensity = 0.4;
          this.holographicState.energyStability = 0.6;
          this.interferencePattern.type = "organic";
          this.scanlineEffect.organic = true;
          break;

        default:
          // Use balanced settings for unknown genres
          this.holographicState.flickerIntensity = 0.4;
          this.holographicState.transparency = 0.8;
          this.holographicState.chromatic = 0.3;
          break;
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Adjusted holographic effects for genre",
        {
          genre,
          flicker: this.holographicState.flickerIntensity,
          transparency: this.holographicState.transparency,
          dataFlow: this.holographicState.dataStreamFlow,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to adjust holographic effects for genre:",
        error
      );
    }
  }

  /**
   * Adjust holographic intensity from musical influence strength
   */
  private adjustHolographicIntensityFromMusicalInfluence(
    influenceStrength: number
  ): void {
    try {
      // Scale all holographic effects by musical influence (0-1)
      const influenceMultiplier = 0.5 + influenceStrength * 0.5; // 0.5-1.0 range

      this.holographicState.flickerIntensity *= influenceMultiplier;
      this.holographicState.chromatic *= influenceMultiplier;
      this.holographicState.scanlineIntensity *= influenceMultiplier;
      this.holographicState.dataStreamFlow *= influenceMultiplier;
      this.holographicState.interferenceLevel *= influenceMultiplier;

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Adjusted holographic intensity from musical influence",
        {
          influence: influenceStrength,
          multiplier: influenceMultiplier,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to adjust holographic intensity from musical influence:",
        error
      );
    }
  }

  /**
   * Apply genre-specific holographic effects
   */
  private async applyGenreSpecificHolographicEffects(
    genre: string,
    emotion?: string
  ): Promise<void> {
    try {
      // Combine genre and emotion for nuanced holographic effects
      const effectKey = `${genre.toLowerCase()}-${emotion || "neutral"}`;

      // Apply custom holographic presets based on genre-emotion combination
      if (genre === "electronic" && emotion === "energetic") {
        this.setHolographicPreset("blade-runner");
        this.holographicState.dataStreamFlow = 1.0;
        this.holographicState.interferenceLevel = 0.6;
      } else if (genre === "classical" && emotion === "calm") {
        this.setHolographicPreset("organic-consciousness");
        this.holographicState.transparency = 0.95;
        this.holographicState.energyStability = 0.9;
      } else if (genre === "rock" && emotion === "aggressive") {
        this.setHolographicPreset("star-wars");
        this.holographicState.flickerIntensity = 0.8;
        this.holographicState.chromatic = 0.6;
      }

      Y3KDebug?.debug?.log(
        "HolographicUISystem",
        "Applied genre-specific holographic effects",
        {
          genre,
          emotion,
          effectKey,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "HolographicUISystem",
        "Failed to apply genre-specific holographic effects:",
        error
      );
    }
  }

  /**
   * Update animation with delta time (IManagedSystem interface)
   */
  public updateAnimation(deltaTime: number): void {
    this.updateHolographicAnimation(deltaTime);
  }

  /**
   * Health check for holographic system (IManagedSystem interface)
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      const memoryUsage = this.estimateMemoryUsage();
      const cpuUsage = this.estimateCPUUsage(this.holographicElements.size);
      const activeElements = this.holographicElements.size;

      const isHealthy =
        this.initialized &&
        memoryUsage < 10 && // Less than 10MB
        cpuUsage < 25 && // Less than 25% CPU
        activeElements < 100; // Less than 100 active elements

      return {
        healthy: isHealthy,
        message: isHealthy
          ? "Holographic UI system operating normally"
          : "Holographic UI system performance degraded",
        details: {
          initialized: this.initialized,
          activeElements,
          memoryUsageMB: memoryUsage,
          cpuUsagePercent: cpuUsage,
          oklabIntegration: this.eventSubscriptionIds.length > 0,
          lastUpdate: this.performanceMetrics.lastUpdate,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Holographic UI system health check failed: ${error}`,
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  // ========================================================================
  // OKLAB COLOR HELPER METHODS
  // ========================================================================

  /**
   * Get OKLAB-enhanced glow color for holographic effects
   */
  private getOKLABEnhancedGlowColor(intensity: number): string {
    try {
      // Get current holographic color from CSS variables or use fallback
      const currentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sn-holographic-primary")
          ?.trim() || "#64ffcc";

      // Process through OKLAB for perceptual enhancement
      const oklabResult = this.oklabProcessor.processColor(
        currentColor,
        this.holographicPreset
      );

      if (oklabResult.enhancedHex) {
        // Convert to RGBA with intensity
        const rgb = this.hexToRgb(oklabResult.enhancedHex);
        return `rgba(${rgb}, ${intensity})`;
      }

      // Fallback to spice variables with organic variable as final fallback
      return `rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${intensity})`;
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "HolographicUISystem",
        "Failed to get OKLAB enhanced glow color:",
        error
      );
      return `rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${intensity})`;
    }
  }

  /**
   * Get OKLAB-enhanced panel colors for translucent effects
   */
  private getOKLABEnhancedPanelColor(transparency: number): {
    background: string;
    gradient: string;
    border: string;
  } {
    try {
      // Get current holographic color
      const currentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sn-holographic-primary")
          ?.trim() || "#64ffcc";

      // Process through OKLAB
      const oklabResult = this.oklabProcessor.processColor(
        currentColor,
        this.holographicPreset
      );

      if (oklabResult.enhancedHex) {
        const rgb = this.hexToRgb(oklabResult.enhancedHex);
        return {
          background: `rgba(${rgb}, ${transparency * 0.1})`,
          gradient: `rgba(${rgb}, ${transparency * 0.05})`,
          border: `rgba(${rgb}, ${transparency * 0.6})`,
        };
      }

      // Fallback to spice variables with organic variable as final fallback
      return {
        background: `rgba(var(--spice-rgb-holographic-primary, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.1
        })`,
        gradient: `rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.05
        })`,
        border: `rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.6
        })`,
      };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "HolographicUISystem",
        "Failed to get OKLAB enhanced panel color:",
        error
      );
      return {
        background: `rgba(var(--spice-rgb-holographic-primary, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.1
        })`,
        gradient: `rgba(var(--spice-rgb-holographic-accent, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.05
        })`,
        border: `rgba(var(--spice-rgb-holographic-glow, var(--organic-holographic-rgb, 100, 255, 200)), ${
          transparency * 0.6
        })`,
      };
    }
  }

  /**
   * Get OKLAB consciousness-responsive glow colors
   */
  private getOKLABConsciousnessGlow(
    intensity: number,
    resonance: number
  ): { outer: string; inner: string } {
    try {
      // Get consciousness accent color or fallback
      const accentColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sn-accent-hex")
          ?.trim() || "#cba6f7";

      // Process through OKLAB with consciousness enhancement
      const consciousnessPreset: EnhancementPreset = {
        ...this.holographicPreset,
        chromaBoost: this.holographicPreset.chromaBoost * (1 + resonance * 0.5),
        lightnessBoost:
          this.holographicPreset.lightnessBoost * (1 + resonance * 0.3),
      };

      const oklabResult = this.oklabProcessor.processColor(
        accentColor,
        consciousnessPreset
      );

      if (oklabResult.enhancedHex) {
        const rgb = this.hexToRgb(oklabResult.enhancedHex);
        return {
          outer: `rgba(${rgb}, ${intensity})`,
          inner: `rgba(${rgb}, ${intensity * 0.3})`,
        };
      }

      // Fallback
      return {
        outer: `rgba(var(--organic-accent-rgb, 203, 166, 247), ${intensity})`,
        inner: `rgba(var(--organic-accent-rgb, 203, 166, 247), ${
          intensity * 0.3
        })`,
      };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "HolographicUISystem",
        "Failed to get OKLAB consciousness glow:",
        error
      );
      return {
        outer: `rgba(var(--organic-accent-rgb, 203, 166, 247), ${intensity})`,
        inner: `rgba(var(--organic-accent-rgb, 203, 166, 247), ${
          intensity * 0.3
        })`,
      };
    }
  }

  /**
   * Get OKLAB-enhanced color for data streams with musical responsiveness
   */
  private getOKLABEnhancedDataStreamColor(
    intensity: number,
    musicalContext?: any
  ): string {
    try {
      let baseColor = "#64ffcc"; // Default holographic cyan

      // Use musical context if available
      if (musicalContext?.emotion) {
        const emotionalResult =
          this.emotionalMapper.mapMusicToEmotionalTemperature({
            energy: 0.5,
            valence: 0.5,
            tempo: 120,
            genre: musicalContext.genre || "default",
          });

        if (emotionalResult.perceptualColorHex) {
          baseColor = emotionalResult.perceptualColorHex;
        }
      }

      // Process through OKLAB
      const oklabResult = this.oklabProcessor.processColor(
        baseColor,
        this.holographicPreset
      );

      if (oklabResult.enhancedHex) {
        const rgb = this.hexToRgb(oklabResult.enhancedHex);
        return `rgba(${rgb}, ${intensity})`;
      }

      return `rgba(var(--spice-rgb-holographic-primary, var(--organic-holographic-rgb, 100, 255, 200)), ${intensity})`;
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "HolographicUISystem",
        "Failed to get OKLAB enhanced data stream color:",
        error
      );
      return `rgba(var(--spice-rgb-holographic-primary, var(--organic-holographic-rgb, 100, 255, 200)), ${intensity})`;
    }
  }

  /**
   * Adjust quality level for performance optimization (QualityScalingCapable interface)
   */
  public adjustQuality(level: import('@/core/performance/SimplePerformanceCoordinator').QualityLevel): void {
    // Adjust holographic effects intensity based on performance tier
    switch (level) {
      case 'low':
        this.holographicState.energyStability = 0.3;
        this.holographicState.scanlineIntensity = 0.2;
        this.holographicState.interferenceLevel = 0.1;
        break;
      case 'medium':
        this.holographicState.energyStability = 0.6;
        this.holographicState.scanlineIntensity = 0.5;
        this.holographicState.interferenceLevel = 0.3;
        break;
      case 'high':
      default:
        this.holographicState.energyStability = 1.0;
        this.holographicState.scanlineIntensity = 0.8;
        this.holographicState.interferenceLevel = 0.6;
        break;
    }
  }
}
