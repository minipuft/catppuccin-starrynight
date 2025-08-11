import {
  HARMONIC_EVOLUTION_KEY,
  HARMONIC_INTENSITY_KEY,
} from "@/config/settingKeys";
// EmergentChoreographyEngine consolidated into EnhancedMasterAnimationCoordinator
import {
  GenreGradientEvolution,
  type GenreCharacteristics,
  type GenreVisualStyle,
  type MusicGenre,
} from "@/audio/GenreGradientEvolution";
import type { EnhancedMasterAnimationCoordinator } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  ColorContext,
  ColorResult,
  IColorProcessor,
} from "@/types/colorStrategy";
import type { Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import {
  EmotionalTemperatureMapper,
  type EmotionalTemperatureResult,
  type MusicAnalysisData,
} from "@/utils/color/EmotionalTemperatureMapper";
import {
  OKLABColorProcessor,
  type EnhancementPreset,
  type OKLABProcessingResult,
} from "@/utils/color/OKLABColorProcessor";
import { paletteSystemManager } from "@/utils/color/PaletteSystemManager";
import { PaletteExtensionManager } from "@/utils/core/PaletteExtensionManager";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { SemanticColorManager } from "@/utils/spicetify/SemanticColorManager";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";
import { globalColorOrchestrator } from "@/visual/integration/ColorOrchestrator";
import {
  MusicEmotionAnalyzer,
  type AudioData,
  type AudioFeatures,
  type EmotionalState,
} from "@/visual/music-sync/integration/MusicEmotionAnalyzer";
// TODO: Phase 4 - Import WebGL and Worker support for performance

// Type definitions for color structures
type RGBColor = { r: number; g: number; b: number };
type HSLColor = { h: number; s: number; l: number };
type HarmoniousAccent = {
  name: string;
  hex: string;
  rgb: RGBColor;
};
type AccentPalette = { [key: string]: string };
type NeutralPalette = { [key: string]: string };
type CatppuccinPalette = {
  accents: AccentPalette;
  neutrals: NeutralPalette;
};
type CatppuccinFlavors = {
  frappe: CatppuccinPalette;
  latte: CatppuccinPalette;
  macchiato: CatppuccinPalette;
  mocha: CatppuccinPalette;
};

type CatppuccinFlavor = keyof CatppuccinFlavors;

type ValidationResult = {
  isValid: boolean;
  contrastRatio: number;
  harmonyScore: number;
  meetsContrast: boolean;
  isHarmonious: boolean;
  artisticMode: string;
  adjustedRequirements: any;
  recommendations: any[];
  error?: string;
};

// =============================================================================
// YEAR 3000 COLOR HARMONY ENGINE - Enhanced Vibrancy Edition
// =============================================================================

export class ColorHarmonyEngine
  extends BaseVisualSystem
  implements IManagedSystem, IColorProcessor
{
  /**
   * Canonical accent CSS custom property names.
   *  – `--sn-accent-hex`  : Hex string (e.g. "#cba6f7")
   *  – `--sn-accent-rgb`  : Comma-separated R,G,B channels (e.g. "203,166,247")
   *
   * These are written by the Year3000System colour pipeline and are considered
   * the single source-of-truth accent accessed by SCSS and visual systems.
   */
  public static readonly CANONICAL_HEX_VAR = "--sn-accent-hex";
  public static readonly CANONICAL_RGB_VAR = "--sn-accent-rgb";

  private currentTheme: CatppuccinFlavor;
  private harmonyMetrics: {
    totalHarmonyCalculations: number;
    musicInfluencedAdjustments: number;
    temporalMemoryEvents: number;
    performance: number[];
  };

  private musicalMemory: {
    recentTracks: any[];
    userColorPreferences: Map<any, any>;
    energyHistory: any[];
    maxMemorySize: number;
  };

  private kineticState: {
    currentPulse: number;
    breathingPhase: number;
    lastBeatTime: number;
    visualMomentum: number;
    // TODO: Phase 2 - Extended properties for music-aware dynamics
    musicIntensityMultiplier?: number;
    beatPhase?: number;
    valenceGravity?: number;
    hueShift?: number;
  };

  private catppuccinPalettes: CatppuccinFlavors;
  private vibrancyConfig: any;
  private paletteExtensionManager: PaletteExtensionManager;
  private semanticColorManager: SemanticColorManager;
  private emergentEngine: EnhancedMasterAnimationCoordinator | null = null;
  private emotionalTemperatureMapper: EmotionalTemperatureMapper;
  private oklabProcessor: OKLABColorProcessor;
  private musicEmotionAnalyzer: MusicEmotionAnalyzer;
  private genreGradientEvolution: GenreGradientEvolution;

  // Enhanced OKLAB processing state
  private oklabState: {
    currentPreset: EnhancementPreset;
    processedPalette: Record<string, OKLABProcessingResult>;
    perceptualGradientCache: Map<string, OKLABProcessingResult[]>;
    colorHarmonyCache: Map<string, string[]>;
    lastProcessingTime: number;
  };

  // Musical emotion state for consciousness-aware color processing
  private emotionalState: {
    currentEmotion: EmotionalState | null;
    emotionHistory: EmotionalState[];
    lastEmotionUpdate: number;
    emotionInfluenceIntensity: number; // 0-1 how much emotion affects colors
  };

  // Musical genre state for aesthetic-aware color processing
  private genreState: {
    currentGenre: MusicGenre;
    genreConfidence: number;
    genreHistory: {
      genre: MusicGenre;
      confidence: number;
      timestamp: number;
    }[];
    lastGenreUpdate: number;
    genreInfluenceIntensity: number; // 0-1 how much genre affects visual aesthetics
  };

  // User-specified harmonic intensity (0-1). Multiplies defaultBlendRatio.
  private userIntensity: number = 0.7;
  private evolutionEnabled: boolean = true;
  private _boundSettingsChangeHandler: (e: Event) => void;
  private _boundArtisticModeHandler: (e: Event) => void;

  private _evolutionTimer: NodeJS.Timeout | null = null;

  // Timer ref for debounce
  private _pendingPaletteRefresh: NodeJS.Timeout | null = null;

  // Track last applied genre to avoid redundant palette refreshes
  private _lastGenre: string | null = null;

  constructor(
    config?: Year3000Config,
    utils?: typeof Year3000Utilities,
    performanceMonitor?: SimplePerformanceCoordinator,
    settingsManager?: SettingsManager
  ) {
    super(
      config,
      utils || Year3000Utilities,
      performanceMonitor!,
      null, // No direct music service dependency
      settingsManager || null
    );
    this.systemName = "ColorHarmonyEngine";

    this.paletteExtensionManager = new PaletteExtensionManager(
      this.config,
      this.utils
    );

    // Initialize SemanticColorManager for Spicetify integration
    this.semanticColorManager = new SemanticColorManager({
      enableDebug: this.config.enableDebug,
      fallbackToSpiceColors: true,
      cacheDuration: 5000,
    });

    this.currentTheme = this.detectCurrentTheme();

    // ------------------------------------------------------------------
    // Sync initial harmonic intensity from shared config so that user
    // preferences are respected as soon as the engine is instantiated.
    // ------------------------------------------------------------------
    if (
      config &&
      typeof (config as any).harmonicIntensity === "number" &&
      Number.isFinite((config as any).harmonicIntensity)
    ) {
      const clamped = Math.max(
        0,
        Math.min(1, (config as any).harmonicIntensity)
      );
      this.userIntensity = clamped;
    }

    this.harmonyMetrics = {
      totalHarmonyCalculations: 0,
      musicInfluencedAdjustments: 0,
      temporalMemoryEvents: 0,
      performance: [],
    };

    // 🌌 Year 3000 Quantum Empathy - Musical Memory System
    this.musicalMemory = {
      recentTracks: [],
      userColorPreferences: new Map(),
      energyHistory: [],
      maxMemorySize: 50,
    };

    // 🌊 Kinetic State for Visual Transformations
    this.kineticState = {
      currentPulse: 0,
      breathingPhase: 0,
      lastBeatTime: 0,
      visualMomentum: 0,
    };

    // Enhanced Catppuccin palette with cinematic gradient color enhancements
    this.catppuccinPalettes = {
      frappe: {
        accents: {
          rosewater: "#f2d5cf",
          flamingo: "#eebebe",
          pink: "#ff6b9d", // Enhanced magenta for gradient drama
          mauve: "#c77dff", // Intensified purple for depth
          red: "#ff4757", // Vivid red for cinematic contrast
          maroon: "#ea999c",
          peach: "#ff7675", // Warmer orange for gradient flows
          yellow: "#fdcb6e", // Golden yellow for luminance
          green: "#6c5ce7", // Purple-blue for unique gradients
          teal: "#00cec9", // Cyan for electric contrast
          sky: "#74b9ff", // Bright blue for sky gradients
          sapphire: "#0984e3", // Deep blue for depth
          blue: "#a29bfe", // Lavender-blue for softness
          lavender: "#fd79a8", // Pink-lavender for warmth
        },
        neutrals: {
          base: "#303446",
          surface0: "#414559",
          surface1: "#51576d",
          surface2: "#626880",
        },
      },
      latte: {
        accents: {
          rosewater: "#dc8a78",
          flamingo: "#dd7878",
          pink: "#e84393", // Vibrant magenta for light theme gradients
          mauve: "#a55eea", // Rich purple for contrast
          red: "#fd79a8", // Warm red-pink for luminous gradients
          maroon: "#e64553",
          peach: "#fd7f28", // Bright orange for warmth
          yellow: "#f39c12", // Golden amber for energy
          green: "#00b894", // Teal-green for balance
          teal: "#00cec9", // Cyan for freshness
          sky: "#0984e3", // Deep sky blue
          sapphire: "#6c5ce7", // Purple-blue for depth
          blue: "#74b9ff", // Light blue for airiness
          lavender: "#a29bfe", // Soft lavender for gentleness
        },
        neutrals: {
          base: "#eff1f5",
          surface0: "#e6e9ef",
          surface1: "#dce0e8",
          surface2: "#c5c9d1",
        },
      },
      macchiato: {
        accents: {
          rosewater: "#f4dbd6",
          flamingo: "#f0c6c6",
          pink: "#ff6b9d", // Enhanced magenta for gradient drama
          mauve: "#c77dff", // Intensified purple for depth
          red: "#ff4757", // Vivid red for cinematic contrast
          maroon: "#ee99a0",
          peach: "#ff7675", // Warmer orange for gradient flows
          yellow: "#fdcb6e", // Golden yellow for luminance
          green: "#6c5ce7", // Purple-blue for unique gradients
          teal: "#00cec9", // Cyan for electric contrast
          sky: "#74b9ff", // Bright blue for sky gradients
          sapphire: "#0984e3", // Deep blue for depth
          blue: "#a29bfe", // Lavender-blue for softness
          lavender: "#fd79a8", // Pink-lavender for warmth
        },
        neutrals: {
          base: "#24273a",
          surface0: "#363a4f",
          surface1: "#494d64",
          surface2: "#5b6078",
        },
      },
      mocha: {
        accents: {
          rosewater: "#f5e0dc",
          flamingo: "#f2cdcd",
          pink: "#ff6b9d", // Enhanced magenta for gradient drama
          mauve: "#c77dff", // Intensified purple for depth
          red: "#ff4757", // Vivid red for cinematic contrast
          maroon: "#eba0ac",
          peach: "#ff7675", // Warmer orange for gradient flows
          yellow: "#fdcb6e", // Golden yellow for luminance
          green: "#6c5ce7", // Purple-blue for unique gradients
          teal: "#00cec9", // Cyan for electric contrast
          sky: "#74b9ff", // Bright blue for sky gradients
          sapphire: "#0984e3", // Deep blue for depth
          blue: "#a29bfe", // Lavender-blue for softness
          lavender: "#fd79a8", // Pink-lavender for warmth
        },
        neutrals: {
          base: "#1e1e2e",
          surface0: "#313244",
          surface1: "#45475a",
          surface2: "#585b70",
        },
      },
    };

    // 🌌 REVOLUTIONARY BLENDING CONFIGURATION - Cinematic Gradient Aesthetics
    this.vibrancyConfig = {
      defaultBlendRatio: 0.75, // Dramatic extracted color dominance for cinematic gradients
      minimumSaturation: 0.6, // High saturation for vibrant gradient aesthetics
      maximumDesaturation: 0.1, // Minimal desaturation to maintain intensity
      contrastBoostIntensity: 1.4, // Enhanced contrast for dramatic depth
      harmonyTolerance: 0.3, // Tighter harmony for cohesive gradient flows

      // 🎨 Cinematic Gradient Enhancement Factors
      artisticSaturationBoost: 1.35, // Strong saturation for vibrant gradient aesthetics
      cosmicLuminanceBoost: 1.25, // Enhanced luminance for gradient depth
      energyResponsiveness: 0.8, // High energy responsiveness for dynamic gradients

      // 🌟 Cinematic Gradient Blending Based on Artistic Mode
      getBlendRatio(artisticMode: string = "artist-vision") {
        const ratios: { [key: string]: number } = {
          "corporate-safe": 0.6, // Moderate: 60% extracted for professional gradients
          "artist-vision": 0.75, // Cinematic: 75% extracted for balanced drama
          "cosmic-maximum": 0.85, // Maximum: 85% extracted for full intensity!
        };
        return ratios[artisticMode] || this.defaultBlendRatio;
      },
    };

    if (this.config.enableDebug) {
      console.log(
        "🎨 [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy"
      );
    }

    // Sync evolution flag from config
    if (config && typeof (config as any).harmonicEvolution === "boolean") {
      this.evolutionEnabled = (config as any).harmonicEvolution;
    }

    // Initialize emotional temperature mapper for music-to-emotion integration
    this.emotionalTemperatureMapper = new EmotionalTemperatureMapper(
      this.config.enableDebug
    );

    // Initialize OKLAB processor for advanced color science
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);

    // Initialize music emotion analyzer for consciousness-aware color processing
    this.musicEmotionAnalyzer = new MusicEmotionAnalyzer({
      emotionSensitivity: 0.7,
      confidenceThreshold: 0.6,
      consciousnessAwareness: true,
      organicFlowDetection: true,
      cinematicAnalysis: true,
      analysisInterval: 500, // 2Hz analysis rate
    });

    // Initialize GenreGradientEvolution for aesthetic intelligence
    this.genreGradientEvolution = new GenreGradientEvolution(
      undefined as any, // cssConsciousnessController will be set during initialize()
      null, // musicSyncService will be injected if available
      null, // emotionalGradientMapper will be injected if available
      this.settingsManager
    );

    // Initialize OKLAB processing state
    this.oklabState = {
      currentPreset: OKLABColorProcessor.PRESETS.STANDARD!,
      processedPalette: {},
      perceptualGradientCache: new Map(),
      colorHarmonyCache: new Map(),
      lastProcessingTime: 0,
    };

    // Initialize emotional state for consciousness-aware processing
    this.emotionalState = {
      currentEmotion: null,
      emotionHistory: [],
      lastEmotionUpdate: 0,
      emotionInfluenceIntensity: 0.8, // Strong emotion influence by default
    };

    // Initialize genre state for aesthetic-aware processing
    this.genreState = {
      currentGenre: "unknown" as MusicGenre,
      genreConfidence: 0.0,
      genreHistory: [],
      lastGenreUpdate: 0,
      genreInfluenceIntensity: 0.7, // Moderate genre influence by default
    };

    // Bind handlers once
    this._boundSettingsChangeHandler = this._handleSettingsChange.bind(this);
    this._boundArtisticModeHandler = this._handleArtisticModeChanged.bind(this);

    document.addEventListener(
      "year3000SystemSettingsChanged",
      this._boundSettingsChangeHandler
    );
    document.addEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );

    // Start evolution loop if allowed
    if (this.evolutionEnabled) {
      this._startEvolutionLoop();
    }
  }

  /**
   * Get current active palette from PaletteSystemManager
   * Falls back to hardcoded catppuccinPalettes for compatibility
   */
  private getCurrentActivePalette(): CatppuccinPalette {
    try {
      const paletteSystem = paletteSystemManager.getCurrentPaletteSystem();
      
      if (paletteSystem === 'year3000') {
        // Convert Year 3000 palette to legacy format for compatibility
        const year3000Palette = paletteSystemManager.getCurrentPalette();
        const currentFlavor = paletteSystemManager.getCurrentDefaultFlavor();
        const activePalette = year3000Palette[currentFlavor];
        
        if (!activePalette) {
          throw new Error(`No palette found for flavor: ${currentFlavor}`);
        }
        
        // Convert to legacy CatppuccinPalette format
        const accents: { [key: string]: string } = {};
        const neutrals: { [key: string]: string } = {};
        
        // Map Year 3000 colors to legacy format
        Object.entries(activePalette).forEach(([key, color]) => {
          if (['base', 'surface0', 'surface1', 'surface2', 'mantle', 'crust'].includes(key)) {
            neutrals[key] = color.hex;
          } else {
            accents[key] = color.hex;
          }
        });
        
        return { accents, neutrals } as CatppuccinPalette;
      } else {
        // Use hardcoded Catppuccin palettes
        return (this.catppuccinPalettes as any)[this.currentTheme];
      }
    } catch (error) {
      // Fallback to hardcoded palettes
      console.warn('[ColorHarmonyEngine] Failed to get active palette, using fallback:', error);
      return (this.catppuccinPalettes as any)[this.currentTheme];
    }
  }
  // TODO: Legacy interface method - delegates to new onAnimate
  // Overload signature for IManagedSystem (single-parameter)
  override updateAnimation(deltaTime: number): void;
  // Overload signature for BaseVisualSystem (two-parameter)
  override updateAnimation(timestamp: number, deltaTime: number): void;
  // Unified implementation
  override updateAnimation(
    timestampOrDelta: number,
    maybeDelta?: number
  ): void {
    const delta = maybeDelta ?? timestampOrDelta;
    this.onAnimate(delta);
  }

  // TODO: Implement proper onAnimate method for Year 3000 per-frame updates
  public override onAnimate(deltaMs: number): void {
    this._updateCSSVariables(deltaMs);
    this._calculateBeatPulse(deltaMs);

    // Emit performance frame event
    unifiedEventBus.emitSync("performance:frame", {
      deltaTime: deltaMs,
      fps: 60,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      timestamp: performance.now(),
    });
  }

  // 🔧 PHASE 2: Emit harmony state instead of applying CSS directly
  private _updateCSSVariables(deltaMs: number): void {
    // Prepare harmony variables for ColorStateManager
    const harmonyVariables: Record<string, string> = {
      "--sn-harmony-energy": this.kineticState.visualMomentum.toFixed(3),
      "--sn-harmony-pulse": this.kineticState.currentPulse.toFixed(3),
      "--sn-harmony-breathing-phase": (
        Math.sin(this.kineticState.breathingPhase) * 0.5 +
        0.5
      ).toFixed(3),
    };

    // Add music-aware dynamic variables if available
    if (this.kineticState.musicIntensityMultiplier !== undefined) {
      harmonyVariables["--sn-harmony-intensity"] =
        this.kineticState.musicIntensityMultiplier.toFixed(3);
    }
    if (this.kineticState.valenceGravity !== undefined) {
      harmonyVariables["--sn-harmony-valence"] =
        this.kineticState.valenceGravity.toFixed(3);
    }
    if (this.kineticState.beatPhase !== undefined) {
      harmonyVariables["--sn-harmony-beat-phase"] =
        this.kineticState.beatPhase.toFixed(3);
    }
    if (this.kineticState.hueShift !== undefined) {
      harmonyVariables[
        "--sn-harmony-hue-shift"
      ] = `${this.kineticState.hueShift.toFixed(1)}deg`;
    }

    // Dynamic text glow intensity
    const glow = Math.max(0, Math.min(1, this.kineticState.currentPulse * 1.2));
    harmonyVariables["--sn-text-glow-intensity"] = glow.toFixed(3);

    // 🔧 PHASE 2: Emit harmony CSS event for ColorStateManager to handle
    unifiedEventBus.emit("system:css-variables" as any, {
      source: "ColorHarmonyEngine",
      variables: harmonyVariables,
      timestamp: Date.now(),
    });
  }

  // TODO: Private method for calculating beat pulse effects
  private _calculateBeatPulse(deltaMs: number): void {
    // Decay current pulse
    this.kineticState.currentPulse *= Math.pow(0.95, deltaMs / 16.67); // Normalized to 60fps decay

    // Update breathing phase
    this.kineticState.breathingPhase += (deltaMs / 1000) * 0.5; // Slow breathing cycle
    if (this.kineticState.breathingPhase > 2 * Math.PI) {
      this.kineticState.breathingPhase -= 2 * Math.PI;
    }

    // Emit gradient breathing events for dimensional consciousness
    this._emitGradientBreathingEvents(deltaMs);
  }

  /**
   * Emit gradient breathing events for dimensional consciousness integration
   */
  private _emitGradientBreathingEvents(deltaMs: number): void {
    // Calculate current energy level from various sources
    const currentEnergy = this._calculateCurrentEnergyLevel();

    // Check for beat detection based on audio analysis
    const beatDetected = this._detectBeatFromAudioAnalysis();

    // Emit energy consciousness events
    if (Math.random() < 0.1) {
      // Throttle to ~6Hz (10% of 60fps)
      unifiedEventBus.emit("music:energy", {
        energy: currentEnergy.energy,
        valence: currentEnergy.valence,
        tempo: 120,
        timestamp: performance.now(),
      });
    }

    // Emit beat events when detected
    if (beatDetected.detected) {
      unifiedEventBus.emit("music:beat", {
        intensity: beatDetected.intensity,
        confidence: beatDetected.confidence,
        timestamp: performance.now(),
        bpm: 120, // Default BPM value
      });
    }
  }

  /**
   * Calculate current energy level from music analysis data
   */
  private _calculateCurrentEnergyLevel(): {
    energy: number;
    valence: number;
    arousal: number;
  } {
    // Fall back to kinetic state and breathing pattern for now
    // TODO: Integrate with actual music analysis data when available
    const breathingEnergy =
      0.5 + Math.sin(this.kineticState.breathingPhase) * 0.3;
    return {
      energy: Math.max(0.2, breathingEnergy),
      valence: 0.5 + this.kineticState.currentPulse * 0.3,
      arousal: 0.4 + this.kineticState.currentPulse * 0.4,
    };
  }

  /**
   * Detect beats from current audio analysis for gradient breathing
   */
  private _detectBeatFromAudioAnalysis(): {
    detected: boolean;
    intensity: number;
    confidence: number;
  } {
    // Use current pulse as beat indicator
    const pulseThreshold = 0.3;
    const currentPulse = this.kineticState.currentPulse;

    // Simple beat detection based on pulse strength
    if (currentPulse > pulseThreshold) {
      return {
        detected: true,
        intensity: Math.min(1.0, currentPulse * 1.5),
        confidence: Math.min(
          1.0,
          (currentPulse - pulseThreshold) / (1.0 - pulseThreshold)
        ),
      };
    }

    // Check for natural breathing beats (every 2 seconds roughly)
    const breathingBeat = Math.sin(this.kineticState.breathingPhase) > 0.8;
    if (breathingBeat) {
      return {
        detected: true,
        intensity: 0.4,
        confidence: 0.6,
      };
    }

    return { detected: false, intensity: 0, confidence: 0 };
  }

  public override async initialize(): Promise<void> {
    await super.initialize();

    // Initialize SemanticColorManager with UnifiedCSSVariableManager from parent system
    const cssConsciousnessController = this.performanceMonitor
      ? (this.performanceMonitor as any).cssConsciousnessController
      : undefined;
    this.semanticColorManager.initialize(cssConsciousnessController);

    // 🔧 CRITICAL FIX: Do NOT update semantic colors on initialization as it sets white/gray values
    // Initial semantic color setup - DISABLED to prevent color override
    // await this.semanticColorManager.updateSemanticColors();

    // Subscribe to color extraction events for strategy pattern
    unifiedEventBus.subscribe(
      "colors:extracted",
      this.handleColorExtraction.bind(this),
      "ColorHarmonyEngine"
    );

    // Register with ColorOrchestrator for strategy pattern coordination
    try {
      globalColorOrchestrator.registerStrategy(this);
      if (this.config.enableDebug) {
        console.log(
          "🎨 [ColorHarmonyEngine] Registered with ColorOrchestrator as strategy processor."
        );
      }
    } catch (error) {
      console.warn(
        "🎨 [ColorHarmonyEngine] Failed to register with ColorOrchestrator:",
        error
      );
    }

    // Initialize music emotion analyzer for consciousness-aware color processing
    try {
      await this.musicEmotionAnalyzer.initialize();

      // Subscribe to emotion updates for consciousness-aware color processing
      this.musicEmotionAnalyzer.onEmotionUpdate((emotion: EmotionalState) => {
        this.handleEmotionUpdate(emotion);
      });

      if (this.config.enableDebug) {
        console.log(
          "🎭 [ColorHarmonyEngine] MusicEmotionAnalyzer initialized with consciousness awareness"
        );
      }
    } catch (error) {
      console.warn(
        "🎭 [ColorHarmonyEngine] Failed to initialize MusicEmotionAnalyzer:",
        error
      );
    }

    // Initialize GenreGradientEvolution for aesthetic intelligence
    try {
      await this.genreGradientEvolution.initialize();

      if (this.config.enableDebug) {
        console.log(
          "🎶 [ColorHarmonyEngine] GenreGradientEvolution initialized with aesthetic intelligence"
        );
      }
    } catch (error) {
      console.warn(
        "🎶 [ColorHarmonyEngine] Failed to initialize GenreGradientEvolution:",
        error
      );
    }

    if (this.config.enableDebug) {
      console.log(
        "🎨 [ColorHarmonyEngine] Initialized with Year 3000 Quantum Empathy via BaseVisualSystem and SemanticColorManager."
      );
      console.log(
        "🎨 [ColorHarmonyEngine] Subscribed to 'colors/extracted' events for strategy pattern processing."
      );
    }
    this.initialized = true;
  }

  /**
   * Handle emotion updates from MusicEmotionAnalyzer
   * Updates emotional state and triggers consciousness-aware color processing
   */
  private handleEmotionUpdate(emotion: EmotionalState): void {
    if (!this.initialized) return;

    try {
      // Update emotional state
      this.emotionalState.currentEmotion = emotion;
      this.emotionalState.emotionHistory.push(emotion);
      this.emotionalState.lastEmotionUpdate = Date.now();

      // Limit emotion history size for performance
      if (this.emotionalState.emotionHistory.length > 50) {
        this.emotionalState.emotionHistory =
          this.emotionalState.emotionHistory.slice(-25);
      }

      // Emit emotion event for other systems (like GradientConductor)
      unifiedEventBus.emit("emotion:analyzed", {
        emotion,
        colorTemperature: emotion.colorTemperature,
        consciousnessLevel:
          emotion.musicalCharacteristics.consciousnessResonance,
        organicFlow: emotion.musicalCharacteristics.organicFlow,
        cinematicDepth: emotion.musicalCharacteristics.cinematicDepth,
        timestamp: emotion.timestamp,
      });

      if (this.config.enableDebug) {
        console.log(
          `🎭 [ColorHarmonyEngine] Emotion updated: ${
            emotion.primary
          } (intensity: ${emotion.intensity.toFixed(
            2
          )}, confidence: ${emotion.confidence.toFixed(2)})`
        );
      }

      // Trigger color harmony refresh with emotion influence
      this.triggerEmotionalColorUpdate(emotion);
    } catch (error) {
      console.error(
        "🎭 [ColorHarmonyEngine] Error handling emotion update:",
        error
      );
    }
  }

  /**
   * Trigger color update based on emotional state
   */
  private triggerEmotionalColorUpdate(emotion: EmotionalState): void {
    // Only trigger if emotion influence is enabled and confidence is high enough
    if (
      this.emotionalState.emotionInfluenceIntensity > 0 &&
      emotion.confidence > 0.6
    ) {
      // Use a debounced approach to avoid excessive updates
      if (this._pendingPaletteRefresh) {
        clearTimeout(this._pendingPaletteRefresh);
      }

      this._pendingPaletteRefresh = setTimeout(() => {
        this.refreshPaletteWithEmotion(emotion);
        this._pendingPaletteRefresh = null;
      }, 100); // 100ms debounce
    }
  }

  /**
   * Refresh palette with emotional influence
   */
  private async refreshPaletteWithEmotion(
    emotion: EmotionalState
  ): Promise<void> {
    try {
      // Create emotional color context based on current emotion
      const emotionalContext = {
        primaryEmotion: emotion.primary,
        emotionIntensity: emotion.intensity,
        colorTemperature: emotion.colorTemperature,
        valence: emotion.valence,
        arousal: emotion.arousal,
        dominance: emotion.dominance,
        organicFlow: emotion.musicalCharacteristics.organicFlow,
        cinematicDepth: emotion.musicalCharacteristics.cinematicDepth,
        consciousnessResonance:
          emotion.musicalCharacteristics.consciousnessResonance,
      };

      // Emit emotional color context for other systems
      unifiedEventBus.emit("emotionalColorContext:updated", emotionalContext);

      if (this.config.enableDebug) {
        console.log(
          `🎭 [ColorHarmonyEngine] Refreshing colors with ${emotion.primary} emotion influence`
        );
      }
    } catch (error) {
      console.error(
        "🎭 [ColorHarmonyEngine] Error refreshing palette with emotion:",
        error
      );
    }
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.getCurrentActivePalette()) {
      return {
        healthy: false,
        ok: false,
        details: `Current theme '${this.currentTheme}' not found in palettes.`,
        issues: [`Current theme '${this.currentTheme}' not found in palettes.`],
        system: "ColorHarmonyEngine",
      };
    }
    return {
      healthy: true,
      ok: true,
      details: "Palettes are loaded correctly.",
      issues: [],
      system: "ColorHarmonyEngine",
    };
  }

  // ============================================================================
  // IColorProcessor Strategy Pattern Implementation
  // ============================================================================

  /**
   * Process colors according to Catppuccin harmony strategy with enhanced OKLAB integration
   * Implements the Strategy pattern for color processing with comprehensive system utilization
   */
  public async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();

    try {
      // Extract relevant data from context
      const { rawColors, trackUri, musicData } = context;

      // 🔬 ENHANCED OKLAB PROCESSING: Determine optimal enhancement preset based on context
      const optimalPreset = this.determineOptimalOKLABPreset(context);
      this.oklabState.currentPreset = optimalPreset;

      // 🎶 GENRE AESTHETIC INTELLIGENCE: Detect and apply genre-specific visual characteristics
      const genreData = await this.analyzeGenreAesthetics(musicData, rawColors);

      // 🌡️ ADVANCED EMOTIONAL TEMPERATURE INTEGRATION: Get comprehensive emotional analysis
      // Enhanced with album art color psychology for multi-sensory emotion intelligence
      const emotionalTemperature = await this.getAdvancedEmotionalTemperature(
        musicData,
        rawColors
      );

      // 🎨 PERCEPTUAL COLOR PROCESSING: Use OKLAB-enhanced color blending with genre aesthetics
      const processedColors = await this.blendWithAdvancedOKLAB(
        rawColors,
        musicData,
        emotionalTemperature,
        genreData || undefined
      );

      // Extract primary accent color for event data
      const accentHex =
        processedColors["VIBRANT"] ||
        processedColors["PROMINENT"] ||
        Object.values(processedColors)[0] ||
        "#a6adc8"; // Catppuccin fallback

      // Convert to RGB for transparency support
      const rgb = this.utils.hexToRgb(accentHex);
      const accentRgb = rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "166,173,200";

      // 🔧 Phase 2: Proper UnifiedEventBus architecture - no DOM events
      try {
        // Emit colors:harmonized event through UnifiedEventBus only (no DOM events)
        const harmonizedEventData = {
          processedColors: processedColors,
          accentHex: accentHex,
          accentRgb: accentRgb,
          originalColors: rawColors,
          trackUri: trackUri,
          musicData: musicData,
          timestamp: Date.now(),
          strategies: ["ColorHarmonyEngine"],
          processingTime: performance.now() - startTime,
          coordinationMetrics: {
            detectedGenre: genreData?.genre || "unknown",
            genreConfidence: genreData?.confidence || 0.0,
            emotionalState:
              this.emotionalState.currentEmotion?.primary || "neutral",
            oklabPreset: optimalPreset?.name || "standard",
            coordinationStrategy: "genre-emotion-color-unified",
            musicInfluenceStrength: this.genreState.genreInfluenceIntensity,
          },
        };

        // Use UnifiedEventBus for proper facade coordination
        unifiedEventBus.emitSync("colors:harmonized", harmonizedEventData);

        if (this.config.enableDebug) {
          console.log(
            "🎨 [ColorHarmonyEngine] Emitted colors:harmonized via UnifiedEventBus (facade pattern):",
            {
              processedColors: Object.keys(processedColors),
              accentHex: accentHex,
              noDomEvents: "correct architecture",
            }
          );
        }
      } catch (eventError) {
        if (this.config.enableDebug) {
          console.warn(
            "[ColorHarmonyEngine] Failed to emit colors:harmonized event:",
            eventError
          );
        }
      }

      // Calculate processing time
      const processingTime = performance.now() - startTime;

      // Update metrics
      this.harmonyMetrics.totalHarmonyCalculations++;
      this.harmonyMetrics.performance.push(processingTime);

      const result: ColorResult = {
        processedColors,
        accentHex,
        accentRgb,
        metadata: {
          strategy: "CatppuccinHarmony",
          processingTime,
          cacheKey: `catppuccin-${trackUri}-${this.currentTheme}`,
          harmonicIntensity: this.userIntensity,
        },
        context,
      };

      // 🔬 COMPREHENSIVE OKLAB CSS GENERATION: Generate advanced OKLAB variables
      const cssVariables = this.generateAdvancedOKLABCSSVariables(result);
      this.applyCSSVariablesToDOM(cssVariables);

      // 🎯 PERCEPTUAL GRADIENT GENERATION: Generate OKLAB-based gradient data for WebGL systems
      this.generatePerceptualGradientData(result);

      // 📊 COLOR HARMONY ANALYSIS: Update harmony metrics with perceptual analysis
      this.updateAdvancedHarmonyMetrics(result, processingTime);

      // Emit processed result event
      unifiedEventBus.emitSync("colors:harmonized", {
        processedColors: result.processedColors,
        accentHex: result.accentHex,
        accentRgb: result.accentRgb,
        strategies: result.metadata?.strategy
          ? [result.metadata.strategy]
          : ["ColorHarmonyEngine"],
        processingTime: processingTime,
        trackUri: result.context.trackUri,
      });

      if (this.config.enableDebug) {
        console.log(
          `🎨 [ColorHarmonyEngine] Processed colors via strategy pattern in ${processingTime.toFixed(
            2
          )}ms`,
          {
            accentHex,
            strategy: "CatppuccinHarmony",
            cssVariablesCount: Object.keys(cssVariables).length,
          }
        );
      }

      return result;
    } catch (error) {
      console.error("[ColorHarmonyEngine] Strategy processing failed:", error);

      // Return fallback result
      return {
        processedColors: { VIBRANT: "#a6adc8" },
        accentHex: "#a6adc8",
        accentRgb: "166,173,200",
        metadata: {
          strategy: "CatppuccinHarmony",
          processingTime: performance.now() - startTime,
          error: String(error),
        },
        context,
      };
    }
  }

  /**
   * Get strategy name for identification
   */
  public getStrategyName(): string {
    return "CatppuccinHarmony";
  }

  /**
   * Check if this strategy can process the given context
   */
  public canProcess(context: ColorContext): boolean {
    // Can process any context with raw colors
    return (
      context && context.rawColors && Object.keys(context.rawColors).length > 0
    );
  }

  /**
   * Get estimated processing time for performance planning
   */
  public getEstimatedProcessingTime(context: ColorContext): number {
    // Base time + complexity factor
    const baseTime = 5; // ms
    const colorCount = Object.keys(context.rawColors || {}).length;
    const complexityFactor = Math.max(1, colorCount / 5);

    return baseTime * complexityFactor;
  }

  /**
   * Handle color extraction events from unifiedEventBus
   * Event-driven entry point for strategy pattern
   */
  private async handleColorExtraction(data: {
    rawColors: Record<string, string>;
    trackUri: string;
    timestamp: number;
    musicData?: {
      energy?: number;
      valence?: number;
      tempo?: number;
      genre?: string;
    };
  }): Promise<void> {
    try {
      if (!this.initialized) {
        if (this.config.enableDebug) {
          console.warn(
            "[ColorHarmonyEngine] Received color extraction event but not initialized"
          );
        }
        return;
      }

      // Convert unified event data to ColorContext
      const context: ColorContext = {
        rawColors: data.rawColors,
        trackUri: data.trackUri,
        timestamp: data.timestamp,
        harmonicMode: this.currentTheme,
        musicData: data.musicData,
        performanceHints: {
          preferLightweight: false,
          enableAdvancedBlending: true,
          maxProcessingTime: 100,
        },
      };

      if (this.canProcess(context)) {
        await this.processColors(context);
      } else {
        if (this.config.enableDebug) {
          console.warn(
            "[ColorHarmonyEngine] Cannot process color context:",
            context
          );
        }
      }
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Error handling color extraction event:",
        error
      );
    }
  }

  /**
   * Generate CSS variables from color result
   */
  private generateCSSVariables(result: ColorResult): Record<string, string> {
    const cssVars: Record<string, string> = {};

    // Core accent variables
    cssVars["--sn-accent-hex"] = result.accentHex;
    cssVars["--sn-accent-rgb"] = result.accentRgb;

    // Canonical accent variables
    cssVars[ColorHarmonyEngine.CANONICAL_HEX_VAR] = result.accentHex;
    cssVars[ColorHarmonyEngine.CANONICAL_RGB_VAR] = result.accentRgb;

    // 🔧 CRITICAL FIX: Removed --spice-* variable setting to prevent conflicts
    // DynamicCatppuccinBridge is now the sole owner of --spice-* variables
    // This prevents timing issues and ensures consistent color application

    // 🔧 CRITICAL FIX: Add gradient variables that CSS depends on
    // Extract secondary and tertiary colors from processedColors for gradients
    const processedColors = result.processedColors;
    const primaryColor =
      processedColors["VIBRANT"] ||
      processedColors["PROMINENT"] ||
      result.accentHex;
    const secondaryColor =
      processedColors["DARK_VIBRANT"] ||
      processedColors["DESATURATED"] ||
      primaryColor;
    const accentColor =
      processedColors["VIBRANT_NON_ALARMING"] ||
      processedColors["LIGHT_VIBRANT"] ||
      primaryColor;

    // 🔧 CRITICAL FIX: Set background gradient variables (source variables)
    // The CSS mapping automatically updates --sn-gradient-* from these --sn-bg-gradient-* variables
    cssVars["--sn-bg-gradient-primary"] = primaryColor;
    cssVars["--sn-bg-gradient-secondary"] = secondaryColor;
    cssVars["--sn-bg-gradient-accent"] = accentColor;

    // Set RGB variants for transparency support
    const primaryRgb = this.utils.hexToRgb(primaryColor);
    const secondaryRgb = this.utils.hexToRgb(secondaryColor);
    const accentRgb = this.utils.hexToRgb(accentColor);

    if (primaryRgb) {
      cssVars[
        "--sn-bg-gradient-primary-rgb"
      ] = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;
    }
    if (secondaryRgb) {
      cssVars[
        "--sn-bg-gradient-secondary-rgb"
      ] = `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`;
    }
    if (accentRgb) {
      cssVars[
        "--sn-bg-gradient-accent-rgb"
      ] = `${accentRgb.r},${accentRgb.g},${accentRgb.b}`;
    }

    // 🔧 OKLAB COLOR PROCESSING: Generate OKLAB-processed CSS variables
    // Process colors through OKLAB space for perceptually uniform color transitions
    this.generateOKLABVariables(cssVars, result);

    if (this.config.enableDebug) {
      console.log(
        "🔧 [ColorHarmonyEngine] Generated background gradient CSS variables:",
        {
          primary: `${primaryColor} -> ${cssVars["--sn-bg-gradient-primary-rgb"]}`,
          secondary: `${secondaryColor} -> ${cssVars["--sn-bg-gradient-secondary-rgb"]}`,
          accent: `${accentColor} -> ${cssVars["--sn-bg-gradient-accent-rgb"]}`,
          totalVariables: Object.keys(cssVars).length,
          note: "CSS mapping automatically updates --sn-gradient-* variables",
        }
      );
    }

    return cssVars;
  }

  /**
   * Generate OKLAB-processed CSS variables for perceptual color processing
   */
  private generateOKLABVariables(
    cssVars: Record<string, string>,
    result: ColorResult
  ): void {
    try {
      // Extract primary and accent colors for OKLAB processing
      const primaryHex = result.accentHex;
      const processedColors = result.processedColors;
      const secondaryHex =
        processedColors["DARK_VIBRANT"] ||
        processedColors["DESATURATED"] ||
        primaryHex;

      const primaryRgb = this.utils.hexToRgb(primaryHex);
      const secondaryRgb = this.utils.hexToRgb(secondaryHex);

      if (primaryRgb) {
        // Process primary color through OKLAB space for enhanced vibrancy
        const oklabPrimary = this.utils.rgbToOklab(
          primaryRgb.r,
          primaryRgb.g,
          primaryRgb.b
        );

        // Apply aesthetic enhancements in OKLAB space
        const enhancedOklab = {
          L: Math.min(1, oklabPrimary.L * 1.1), // Slight lightness boost
          a: oklabPrimary.a * 1.15, // Enhanced chroma for vibrancy
          b: oklabPrimary.b * 1.15,
        };

        const enhancedRgb = this.utils.oklabToRgb(
          enhancedOklab.L,
          enhancedOklab.a,
          enhancedOklab.b
        );

        // Set OKLAB processed variables that SCSS files expect
        cssVars[
          "--sn-color-oklab-bright-highlight-rgb"
        ] = `${enhancedRgb.r},${enhancedRgb.g},${enhancedRgb.b}`;

        // Individual RGB components for SCSS processing
        cssVars["--sn-color-oklab-primary-r"] = Math.round(
          enhancedRgb.r
        ).toString();
        cssVars["--sn-color-oklab-primary-g"] = Math.round(
          enhancedRgb.g
        ).toString();
        cssVars["--sn-color-oklab-primary-b"] = Math.round(
          enhancedRgb.b
        ).toString();
        cssVars["--sn-color-oklab-accent-r"] = Math.round(
          enhancedRgb.r
        ).toString();
        cssVars["--sn-color-oklab-accent-g"] = Math.round(
          enhancedRgb.g
        ).toString();
        cssVars["--sn-color-oklab-accent-b"] = Math.round(
          enhancedRgb.b
        ).toString();

        // OKLAB luminance values for contrast calculations
        cssVars["--sn-color-oklab-accent-luminance"] =
          enhancedOklab.L.toFixed(3);

        // OKLCH (LCH representation of OKLAB) for hue-based animations
        const oklch = this.convertOklabToOklch(enhancedOklab);
        cssVars["--sn-color-oklch-accent-l"] = oklch.L.toFixed(3);
        cssVars["--sn-color-oklch-accent-c"] = oklch.C.toFixed(3);
        cssVars["--sn-color-oklch-accent-h"] = oklch.H.toFixed(1);
        cssVars["--sn-color-oklch-primary-l"] = oklch.L.toFixed(3);
        cssVars["--sn-color-oklch-primary-c"] = oklch.C.toFixed(3);
        cssVars["--sn-color-oklch-primary-h"] = oklch.H.toFixed(1);
      }

      if (secondaryRgb) {
        // Process secondary color for shadow/depth effects
        const oklabSecondary = this.utils.rgbToOklab(
          secondaryRgb.r,
          secondaryRgb.g,
          secondaryRgb.b
        );

        // Create darker variant for shadows while preserving hue
        const shadowOklab = {
          L: Math.max(0.05, oklabSecondary.L * 0.3), // Much darker for shadow
          a: oklabSecondary.a * 0.8, // Slightly desaturated
          b: oklabSecondary.b * 0.8,
        };

        const shadowRgb = this.utils.oklabToRgb(
          shadowOklab.L,
          shadowOklab.a,
          shadowOklab.b
        );
        cssVars[
          "--sn-color-oklab-dynamic-shadow-rgb"
        ] = `${shadowRgb.r},${shadowRgb.g},${shadowRgb.b}`;
        cssVars["--sn-color-oklab-base-luminance"] = shadowOklab.L.toFixed(3);
      }

      if (this.config.enableDebug) {
        console.log(
          "🔬 [ColorHarmonyEngine] Generated OKLAB-processed variables:",
          {
            primaryColor: primaryHex,
            secondaryColor: secondaryHex,
            oklabVariablesCount: Object.keys(cssVars).filter((k) =>
              k.includes("oklab")
            ).length,
            oklchVariablesCount: Object.keys(cssVars).filter((k) =>
              k.includes("oklch")
            ).length,
          }
        );
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "🔬 [ColorHarmonyEngine] OKLAB processing failed, using fallbacks:",
          error
        );
      }

      // Fallback to primary color if OKLAB processing fails
      const fallbackRgb = this.utils.hexToRgb(result.accentHex);
      if (fallbackRgb) {
        cssVars[
          "--sn-color-oklab-bright-highlight-rgb"
        ] = `${fallbackRgb.r},${fallbackRgb.g},${fallbackRgb.b}`;
        cssVars["--sn-color-oklab-dynamic-shadow-rgb"] = `${Math.round(
          fallbackRgb.r * 0.3
        )},${Math.round(fallbackRgb.g * 0.3)},${Math.round(
          fallbackRgb.b * 0.3
        )}`;
      }
    }
  }

  /**
   * Convert OKLAB to OKLCH (cylindrical representation)
   */
  private convertOklabToOklch(oklab: { L: number; a: number; b: number }): {
    L: number;
    C: number;
    H: number;
  } {
    const L = oklab.L;
    const C = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b);
    let H = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI);

    // Normalize hue to 0-360 range
    if (H < 0) H += 360;

    return { L, C, H };
  }

  detectCurrentTheme(): CatppuccinFlavor {
    const rootElement = this.utils.getRootStyle();
    if (!rootElement) {
      console.warn(
        "[ColorHarmonyEngine detectCurrentTheme] Root element not found. Defaulting to mocha."
      );
      return "mocha";
    }
    const computedRootStyle = getComputedStyle(rootElement);
    const baseColorHex = computedRootStyle
      .getPropertyValue("--spice-main")
      .trim();

    const normalizedBaseColor = baseColorHex.startsWith("#")
      ? baseColorHex.substring(1).toUpperCase()
      : baseColorHex.toUpperCase();

    const themeMap: { [key: string]: CatppuccinFlavor } = {
      "303446": "frappe",
      EFF1F5: "latte",
      "24273A": "macchiato",
      "1E1E2E": "mocha",
    };

    // TODO: Phase 3 - Check for known Catppuccin themes first
    const knownTheme = themeMap[normalizedBaseColor];
    if (knownTheme) {
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Detected Catppuccin theme: ${knownTheme}`
        );
      }
      return knownTheme;
    }

    // TODO: Phase 3 - For unknown themes, attempt to generate fallback palette
    if (this.config.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] Unknown theme detected (${normalizedBaseColor}), attempting to generate fallback`
      );
    }

    // Generate a fallback palette name based on the base color
    const fallbackThemeName = `custom-${normalizedBaseColor.toLowerCase()}`;

    // Use PaletteExtensionManager to generate a fallback palette
    // This doesn't block the current method since we still return a valid CatppuccinFlavor
    try {
      const fallbackPalette =
        this.paletteExtensionManager.generateFallbackPalette(fallbackThemeName);
      if (this.config.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Generated fallback palette for theme: ${fallbackThemeName}`,
          fallbackPalette
        );
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[ColorHarmonyEngine] Failed to generate fallback palette:`,
          error
        );
      }
    }

    // Default to mocha for now, but log the attempt
    if (this.config.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] Falling back to mocha theme for unknown base color: ${normalizedBaseColor}`
      );
    }

    return "mocha";
  }

  // TODO: Phase 3 - New method to get genre-aware palette
  private async _getGenreAwarePalette(
    genre?: string
  ): Promise<CatppuccinPalette> {
    const basePalette = this.getCurrentActivePalette();

    if (!genre || !basePalette) {
      return basePalette;
    }

    try {
      // Convert CatppuccinPalette to CustomPalette format for processing
      const customPalette = {
        name: this.currentTheme,
        version: "1.0.0",
        accents: basePalette.accents,
        neutrals: basePalette.neutrals,
        metadata: {
          author: "Catppuccin",
          description: `${this.currentTheme} flavor`,
          temperature: "neutral" as const,
        },
      };

      // Apply genre-aware modifications
      const modifiedPalette =
        this.paletteExtensionManager.applyGenreAwareModifications(
          customPalette,
          genre
        );

      // Convert back to CatppuccinPalette format
      return {
        accents: modifiedPalette.accents,
        neutrals: modifiedPalette.neutrals,
      };
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[ColorHarmonyEngine] Failed to apply genre modifications for ${genre}:`,
          error
        );
      }
      return basePalette;
    }
  }

  getMusicIntensityMultiplier(
    energy: number = 0.5,
    valence: number = 0.5
  ): number {
    const baseMultiplier = (this.config.getCurrentMultipliers as any)()
      .musicEnergyBoost;
    const energyBoost = energy > 0.7 ? 1.3 : energy > 0.4 ? 1.0 : 0.8;
    const valenceBoost = valence > 0.6 ? 1.2 : valence < 0.4 ? 0.9 : 1.0;
    return baseMultiplier * energyBoost * valenceBoost;
  }

  validateColorHarmony(
    color: RGBColor,
    context: string = "general"
  ): ValidationResult {
    const startTime = performance.now();
    this.harmonyMetrics.totalHarmonyCalculations++;

    const contextRequirements: { [key: string]: any } = {
      general: {
        minContrast: 1.8,
        minHarmony: this.vibrancyConfig.harmonyTolerance,
      },
      search: { minContrast: 2.8, minHarmony: 0.4 },
      navigation: { minContrast: 2.5, minHarmony: 0.45 },
      text: { minContrast: 4.5, minHarmony: 0.6 },
      accent: { minContrast: 1.5, minHarmony: 0.3 },
    };

    const requirements =
      contextRequirements[context] || contextRequirements["general"];
    const currentPalette = this.getCurrentActivePalette();

    if (!currentPalette?.neutrals?.base) {
      const errorMsg = `[StarryNight] Catppuccin palette or base neutral not found for theme: ${this.currentTheme}`;
      console.error(errorMsg);
      return {
        isValid: false,
        error: "Palette configuration error.",
        contrastRatio: 0,
        harmonyScore: 0,
        meetsContrast: false,
        isHarmonious: false,
        artisticMode: this.config.artisticMode,
        adjustedRequirements: requirements,
        recommendations: [],
      };
    }

    const backgroundColor = currentPalette.neutrals.base;
    const colorHex = this.utils.rgbToHex(color.r, color.g, color.b);

    const contrastRatio = this.utils.calculateContrastRatio(
      colorHex,
      backgroundColor
    );
    const harmonyScore = this.calculateHarmonyScore(color, currentPalette);

    const currentMode = this.config.artisticMode;
    let adjustedRequirements = { ...requirements };

    if (currentMode === "cosmic-maximum") {
      adjustedRequirements.minContrast *= 0.7;
      adjustedRequirements.minHarmony *= 0.6;
    } else if (currentMode === "artist-vision") {
      adjustedRequirements.minContrast *= 0.85;
      adjustedRequirements.minHarmony *= 0.8;
    }

    const meetsContrast = contrastRatio >= adjustedRequirements.minContrast;
    const isHarmonious = harmonyScore >= adjustedRequirements.minHarmony;

    const endTime = performance.now();
    this.harmonyMetrics.performance.push(endTime - startTime);

    return {
      isValid: meetsContrast && isHarmonious,
      contrastRatio,
      harmonyScore,
      meetsContrast,
      isHarmonious,
      artisticMode: currentMode,
      adjustedRequirements,
      recommendations: this.generateRecommendations(
        color,
        contrastRatio,
        harmonyScore,
        adjustedRequirements
      ),
    };
  }

  calculateHarmonyScore(color: RGBColor, palette: CatppuccinPalette): number {
    const colorHsl = this.utils.rgbToHsl(color.r, color.g, color.b);

    let maxHarmony = 0;
    const accentColors = Object.values(palette.accents);
    for (const accentColor of accentColors) {
      const accentRgb = this.utils.hexToRgb(accentColor);
      if (!accentRgb) continue;

      const accentHsl = this.utils.rgbToHsl(
        accentRgb.r,
        accentRgb.g,
        accentRgb.b
      );
      const hueDiff = Math.abs(colorHsl.h - accentHsl.h);
      const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

      const harmoniousAngles = [
        0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330,
      ];
      const isHarmonious = harmoniousAngles.some(
        (angle) => Math.abs(normalizedHueDiff - angle) < 20
      );

      if (isHarmonious) {
        const harmonyStrength =
          1 -
          Math.min(
            ...harmoniousAngles.map((angle) =>
              Math.abs(normalizedHueDiff - angle)
            )
          ) /
            20;
        maxHarmony = Math.max(maxHarmony, harmonyStrength);
      }
    }

    return maxHarmony;
  }

  findBestHarmoniousAccent(
    rgb: RGBColor,
    palette: CatppuccinPalette
  ): HarmoniousAccent {
    let bestAccent: HarmoniousAccent = {
      name: "mauve",
      hex:
        this.utils
          .getRootStyle()
          ?.style.getPropertyValue("--sn-dynamic-accent")
          ?.trim() ||
        this.utils
          .getRootStyle()
          ?.style.getPropertyValue("--spice-accent")
          ?.trim() ||
        "#cba6f7", // Fallback to default mauve hex
      rgb: { r: 203, g: 166, b: 247 },
    };

    const accentPriority = [
      "mauve",
      "lavender",
      "blue",
      "sapphire",
      "sky",
      "pink",
      "peach",
      "teal",
    ];

    let bestScore = -1;

    const inputHsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);

    for (const accentName of accentPriority) {
      const accentHex = palette.accents[accentName];
      if (accentHex) {
        const accentRgb = this.utils.hexToRgb(accentHex);
        if (!accentRgb) continue;

        const accentHsl = this.utils.rgbToHsl(
          accentRgb.r,
          accentRgb.g,
          accentRgb.b
        );

        const hueDiff = Math.abs(inputHsl.h - accentHsl.h);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

        const harmonyScore = 1 - normalizedHueDiff / 180;
        const saturationBonus = accentHsl.s * 0.3;
        const totalScore = harmonyScore + saturationBonus;

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestAccent = {
            name: accentName,
            hex: accentHex,
            rgb: accentRgb,
          };
        }
      }
    }

    return bestAccent;
  }

  blendColors(
    rgb1: RGBColor,
    rgb2: RGBColor,
    ratio: number = this.vibrancyConfig.defaultBlendRatio
  ): RGBColor {
    // =============================
    // NEW  – Perceptual interpolation using Oklab
    // =============================
    // `ratio` expresses the dominance of `rgb1` (extracted colour).
    // We interpolate towards the Catppuccin accent in OKLab then convert
    // back to sRGB for downstream HSL-based aesthetic boosts.

    // Guard & clamp ratio to [0,1]
    const r = Math.max(0, Math.min(1, ratio));

    const oklab1 = this.utils.rgbToOklab(rgb1.r, rgb1.g, rgb1.b);
    const oklab2 = this.utils.rgbToOklab(rgb2.r, rgb2.g, rgb2.b);

    const lerp = (a: number, b: number): number => a * r + b * (1 - r);

    const blendedOklab = {
      L: lerp(oklab1.L, oklab2.L),
      a: lerp(oklab1.a, oklab2.a),
      b: lerp(oklab1.b, oklab2.b),
    } as const;

    const blendedRgb = this.utils.oklabToRgb(
      blendedOklab.L,
      blendedOklab.a,
      blendedOklab.b
    );

    // Convert to HSL **after** perceptual interpolation so we can apply
    // artistic saturation & luminance boosts in a familiar space.
    const blendedHsl = this.utils.rgbToHsl(
      blendedRgb.r,
      blendedRgb.g,
      blendedRgb.b
    );

    // Preserve previous boost behaviour
    const artisticMode = this.config?.artisticMode ?? "artist-vision";
    const emergentMultipliers =
      this.emergentEngine?.getCurrentMultipliers?.() || undefined;

    const shouldUseEmergent =
      artisticMode === "cosmic-maximum" && !!emergentMultipliers;

    const validMultipliers: any = emergentMultipliers || {};

    const saturationBoostFactor = shouldUseEmergent
      ? (validMultipliers.visualIntensityBase || 1) * 1.25 // Align with previous behaviour
      : this.vibrancyConfig.artisticSaturationBoost;

    const luminanceBoostFactor = shouldUseEmergent
      ? (validMultipliers.aestheticGravityStrength || 1) * 1.15
      : this.vibrancyConfig.cosmicLuminanceBoost;

    // Minimum saturation guard (uses configured threshold)
    blendedHsl.s = Math.max(
      blendedHsl.s,
      this.vibrancyConfig.minimumSaturation * 100
    );

    // Apply artistic boosts (mode-aware)
    blendedHsl.s = Math.min(100, blendedHsl.s * saturationBoostFactor);
    if (artisticMode !== "corporate-safe") {
      blendedHsl.l = Math.min(95, blendedHsl.l * luminanceBoostFactor);
    }

    const finalRgb = this.utils.hslToRgb(
      blendedHsl.h,
      blendedHsl.s,
      blendedHsl.l
    );

    return { r: finalRgb.r, g: finalRgb.g, b: finalRgb.b };
  }

  blendWithCatppuccin(
    extractedColors: { [key: string]: string },
    musicContext: any = null
  ): { [key: string]: string } {
    this.performanceMonitor?.emitTrace?.(
      "[ColorHarmonyEngine] Starting blendWithCatppuccin"
    );

    // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION: Map music analysis to emotional states
    let emotionalTemperature: EmotionalTemperatureResult | null = null;
    if (musicContext) {
      try {
        const musicAnalysis: MusicAnalysisData = {
          energy: musicContext.energy || 0.5,
          valence: musicContext.valence || 0.5,
          danceability: musicContext.danceability,
          tempo: musicContext.enhancedBPM || musicContext.tempo,
          loudness: musicContext.loudness,
          acousticness: musicContext.acousticness,
          instrumentalness: musicContext.instrumentalness,
          speechiness: musicContext.speechiness,
          mode: musicContext.mode,
          key: musicContext.key,
          genre: musicContext.genre,
        };

        emotionalTemperature =
          this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(
            musicAnalysis
          );

        // 🔧 PHASE 2: Emit emotional temperature CSS variables instead of applying directly
        if (emotionalTemperature) {
          // 🔧 PHASE 2: Emit CSS variables for ColorStateManager
          unifiedEventBus.emit("system:css-variables" as any, {
            source: "ColorHarmonyEngine",
            variables: emotionalTemperature.cssVariables,
            timestamp: Date.now(),
          });

          // Add emotional class to body for SCSS integration (keep direct DOM update for classes)
          document.body.classList.remove(
            ...Array.from(document.body.classList).filter((c) =>
              c.startsWith("organic-emotion-")
            )
          );
          document.body.classList.add(emotionalTemperature.cssClass);

          if (emotionalTemperature.secondaryEmotion) {
            document.body.classList.add(
              `organic-emotion-blend-${emotionalTemperature.secondaryEmotion}`
            );
          }
        }

        if (this.config.enableDebug) {
          console.log(
            "🌡️ [ColorHarmonyEngine] Applied emotional temperature:",
            emotionalTemperature
          );
        }
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            "🌡️ [ColorHarmonyEngine] Failed to apply emotional temperature:",
            error
          );
        }
      }
    }

    // 🎨 DEBUG: Log input colors and current config
    if (this.config.enableDebug) {
      console.log("🎨 [ColorHarmonyEngine] blendWithCatppuccin debug:", {
        extractedColors,
        musicContext,
        emotionalTemperature,
        currentTheme: this.currentTheme,
        vibrancyConfig: this.vibrancyConfig,
        userIntensity: this.userIntensity,
      });
    }

    const currentPalette = this.getCurrentActivePalette();
    if (!currentPalette) {
      console.error(
        `[StarryNight] Catppuccin palette not found for theme: ${this.currentTheme}`
      );
      return extractedColors;
    }

    const harmonizedColors: { [key: string]: string } = {};

    for (const [role, color] of Object.entries(extractedColors)) {
      if (!color) continue;

      const extractedRgb = this.utils.hexToRgb(color);
      if (!extractedRgb) {
        if (this.config.enableDebug) {
          console.warn(
            `🎨 [ColorHarmonyEngine] Failed to parse color for role ${role}: ${color}`
          );
        }
        harmonizedColors[role] = color;
        continue;
      }

      // 🎨 DEBUG: Check saturation thresholds
      const extractedHsl = this.utils.rgbToHsl(
        extractedRgb.r,
        extractedRgb.g,
        extractedRgb.b
      );
      const saturationCheck =
        extractedHsl.s >= this.vibrancyConfig.minimumSaturation * 100;

      if (this.config.enableDebug) {
        console.log(`🎨 [ColorHarmonyEngine] Processing color ${role}:`, {
          originalColor: color,
          rgb: extractedRgb,
          hsl: extractedHsl,
          saturationCheck,
          minimumSaturationRequired:
            this.vibrancyConfig.minimumSaturation * 100,
          actualSaturation: extractedHsl.s,
        });
      }

      const bestAccent = this.findBestHarmoniousAccent(
        extractedRgb,
        currentPalette
      );
      if (!bestAccent?.rgb) {
        console.warn(
          `[StarryNight] Could not find a valid harmonious accent for role: ${role}. Using original color.`
        );
        harmonizedColors[role] = color;
        continue;
      }

      let blendRatio = this.vibrancyConfig.getBlendRatio(
        this.config.artisticMode
      );

      // 🌡️ EMOTIONAL TEMPERATURE INTEGRATION: Use emotional intensity for blending
      if (emotionalTemperature) {
        // Use emotional temperature intensity instead of basic music intensity
        const emotionalIntensity = emotionalTemperature.intensity;
        blendRatio *= emotionalIntensity * this.userIntensity;

        // Apply temperature-based blend adjustment
        const temperatureInfluence = this.calculateTemperatureBlendInfluence(
          emotionalTemperature.temperature
        );
        blendRatio *= temperatureInfluence;

        // Clamp ratio to prevent inverse effects
        blendRatio = Math.max(0, Math.min(1, blendRatio));

        if (this.config.enableDebug) {
          console.log(
            "🌡️ [ColorHarmonyEngine] Emotional temperature blend adjustment:",
            {
              originalRatio: this.vibrancyConfig.getBlendRatio(
                this.config.artisticMode
              ),
              emotionalIntensity: emotionalIntensity,
              temperatureInfluence: temperatureInfluence,
              finalBlendRatio: blendRatio,
              temperature: emotionalTemperature.temperature,
            }
          );
        }
      } else if (musicContext) {
        // Fallback to basic music intensity if emotional temperature unavailable
        const musicIntensity = this.getMusicIntensityMultiplier(
          musicContext.energy,
          musicContext.valence
        );
        blendRatio *= musicIntensity * this.userIntensity;
        // Clamp ratio to prevent inverse effects
        blendRatio = Math.max(0, Math.min(1, blendRatio));
      }

      if (this.config.enableDebug) {
        console.log(`🎨 [ColorHarmonyEngine] Blending ${role}:`, {
          extractedRgb,
          bestAccent: bestAccent.hex,
          blendRatio,
          artisticMode: this.config.artisticMode,
        });
      }

      const finalRgb = this.blendColors(
        extractedRgb,
        bestAccent.rgb,
        blendRatio
      );
      const finalHex = this.utils.rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
      harmonizedColors[role] = finalHex;

      if (this.config.enableDebug) {
        console.log(
          `🎨 [ColorHarmonyEngine] Final color for ${role}: ${color} → ${finalHex}`
        );
      }
    }

    this.harmonyMetrics.musicInfluencedAdjustments++;

    this.performanceMonitor?.emitTrace?.(
      "[ColorHarmonyEngine] Completed blendWithCatppuccin"
    );

    // 🎨 DEBUG: Log final harmonized result
    if (this.config.enableDebug) {
      console.log("🎨 [ColorHarmonyEngine] Final harmonized result:", {
        inputColors: extractedColors,
        outputColors: harmonizedColors,
        colorCount: Object.keys(harmonizedColors).length,
      });
    }

    // Apply semantic color updates after blending
    this.updateSemanticColorsWithHarmonizedPalette(harmonizedColors);

    return harmonizedColors;
  }

  /**
   * Updates semantic colors using the harmonized palette
   * Integrates with Spicetify's semantic color system for consistent theming
   */
  private updateSemanticColorsWithHarmonizedPalette(harmonizedColors: {
    [key: string]: string;
  }): void {
    if (!this.semanticColorManager) {
      return;
    }

    try {
      // 🔧 CRITICAL FIX: Do NOT call updateSemanticColors() here as it overwrites our extracted colors
      // with Spicetify's semantic colors (which are often white/gray)
      // this.semanticColorManager.updateSemanticColors(); // DISABLED - causes white color override

      // 🎯 CRITICAL FIX: Directly update Spicetify variables with OKLAB-processed album colors
      // This bypasses CSS fallback chains and prevents Spotify overrides
      this.semanticColorManager.updateWithAlbumColors(harmonizedColors);

      // Apply harmonized colors to key semantic variables
      const primaryColor =
        harmonizedColors["VIBRANT"] || harmonizedColors["PRIMARY"];
      const secondaryColor =
        harmonizedColors["DARK_VIBRANT"] || harmonizedColors["SECONDARY"];
      const accentColor =
        harmonizedColors["VIBRANT_NON_ALARMING"] ||
        harmonizedColors["LIGHT_VIBRANT"];

      if (primaryColor) {
        this.semanticColorManager
          .getSemanticColor("essentialBrightAccent")
          .then((color) => {
            // Use the harmonized color as the base for semantic accent
            const blendedColor = this.blendWithSemanticColor(
              primaryColor,
              color,
              0.7
            );
            this.applyCSSVariable("--spice-accent", blendedColor);
            this.applyCSSVariable("--spice-button-active", blendedColor);
          });
      }

      if (secondaryColor) {
        this.semanticColorManager
          .getSemanticColor("backgroundElevatedHighlight")
          .then((color) => {
            const blendedColor = this.blendWithSemanticColor(
              secondaryColor,
              color,
              0.5
            );
            this.applyCSSVariable("--spice-highlight", blendedColor);
          });
      }

      if (accentColor) {
        this.semanticColorManager
          .getSemanticColor("textBrightAccent")
          .then((color) => {
            const blendedColor = this.blendWithSemanticColor(
              accentColor,
              color,
              0.6
            );
            this.applyCSSVariable("--spice-text-accent", blendedColor);
          });
      }

      // Flush all semantic color updates
      this.semanticColorManager.flushUpdates();
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          "[ColorHarmonyEngine] Failed to update semantic colors:",
          error
        );
      }
    }
  }

  /**
   * Blends a harmonized color with a semantic color for consistency
   */
  private blendWithSemanticColor(
    harmonizedHex: string,
    semanticHex: string,
    blendRatio: number
  ): string {
    const harmonizedRgb = this.utils.hexToRgb(harmonizedHex);
    const semanticRgb = this.utils.hexToRgb(semanticHex);

    if (!harmonizedRgb || !semanticRgb) {
      return harmonizedHex; // Fallback to harmonized color
    }

    const blendedRgb = this.blendColors(harmonizedRgb, semanticRgb, blendRatio);
    return this.utils.rgbToHex(blendedRgb.r, blendedRgb.g, blendedRgb.b);
  }

  /**
   * 🔧 PHASE 2: Emit CSS variable instead of applying directly
   */
  private applyCSSVariable(property: string, value: string): void {
    // 🔧 PHASE 2: Emit single CSS variable for ColorStateManager
    unifiedEventBus.emit("system:css-variables" as any, {
      source: "ColorHarmonyEngine",
      variables: { [property]: value },
      timestamp: Date.now(),
    });
  }

  /**
   * Apply multiple CSS variables to the DOM efficiently
   * Enhanced with comprehensive UI component support and robust fallbacks
   */
  private applyCSSVariablesToDOM(cssVariables: Record<string, string>): void {
    // 🔧 CRITICAL FIX: Enhanced cssConsciousnessController detection
    const year3000System = (globalThis as any).year3000System;
    const cssConsciousnessController =
      year3000System?.cssConsciousnessController ||
      (this.performanceMonitor as any)?.cssConsciousnessController ||
      year3000System?.facadeCoordinator?.getCachedNonVisualSystem?.(
        "UnifiedCSSVariableManager"
      );

    // 🔧 CRITICAL FIX: Add UI component-specific CSS variables for sidebar and now-playing
    const enhancedCssVariables =
      this.enhanceCSSVariablesForUIComponents(cssVariables);

    if (
      cssConsciousnessController &&
      typeof cssConsciousnessController.batchSetVariables === "function"
    ) {
      try {
        // Use batched CSS variable updates for better performance
        cssConsciousnessController.batchSetVariables(
          "ColorHarmonyEngine",
          enhancedCssVariables,
          "high", // High priority for color processing
          "color-harmony-oklab-processing"
        );

        if (this.config.enableDebug) {
          console.log(
            "🔧 [ColorHarmonyEngine] Applied CSS variables via cssConsciousnessController batcher"
          );
        }
      } catch (error) {
        if (this.config.enableDebug) {
          console.warn(
            "🔧 [ColorHarmonyEngine] cssConsciousnessController.batchSetVariables failed, using direct application:",
            error
          );
        }
        this.applyVariablesDirectly(enhancedCssVariables);
      }
    } else {
      if (this.config.enableDebug) {
        console.log(
          "🔧 [ColorHarmonyEngine] cssConsciousnessController not available, using direct DOM application"
        );
      }
      this.applyVariablesDirectly(enhancedCssVariables);
    }

    // 🔧 CRITICAL FIX: Emit colors:applied event for UI components that need immediate notification
    unifiedEventBus.emitSync("colors:applied", {
      cssVariables: enhancedCssVariables,
      accentHex: enhancedCssVariables["--sn-accent-hex"] || "#a6adc8",
      accentRgb: enhancedCssVariables["--sn-accent-rgb"] || "166,173,200",
      appliedAt: Date.now(),
    });

    if (this.config.enableDebug) {
      console.log(
        "🔬 [ColorHarmonyEngine] Applied enhanced CSS variables to DOM:",
        {
          totalVariables: Object.keys(enhancedCssVariables).length,
          oklabVariables: Object.keys(enhancedCssVariables).filter((k) =>
            k.includes("oklab")
          ).length,
          oklchVariables: Object.keys(enhancedCssVariables).filter((k) =>
            k.includes("oklch")
          ).length,
          gradientVariables: Object.keys(enhancedCssVariables).filter((k) =>
            k.includes("gradient")
          ).length,
          spiceVariables: Object.keys(enhancedCssVariables).filter((k) =>
            k.includes("spice")
          ).length,
          sidebarVariables: Object.keys(enhancedCssVariables).filter((k) =>
            k.includes("sidebar")
          ).length,
          cssConsciousnessControllerUsed: !!cssConsciousnessController,
        }
      );
    }
  }

  /**
   * Enhance CSS variables with UI component-specific mappings
   * Maps OKLAB-processed colors to variables that sidebar, now-playing, and other UI components expect
   */
  private enhanceCSSVariablesForUIComponents(
    cssVariables: Record<string, string>
  ): Record<string, string> {
    const enhanced = { ...cssVariables };

    // Extract primary colors for UI component mapping
    const accentHex =
      enhanced["--sn-accent-hex"] ||
      enhanced[ColorHarmonyEngine.CANONICAL_HEX_VAR];
    const accentRgb =
      enhanced["--sn-accent-rgb"] ||
      enhanced[ColorHarmonyEngine.CANONICAL_RGB_VAR];
    const primaryHex = enhanced["--sn-bg-gradient-primary"];
    const primaryRgb = enhanced["--sn-bg-gradient-primary-rgb"];
    const secondaryHex = enhanced["--sn-bg-gradient-secondary"];
    const secondaryRgb = enhanced["--sn-bg-gradient-secondary-rgb"];

    if (accentHex && accentRgb) {
      // 🎯 SPICETIFY CORE VARIABLES - Critical for all UI components
      enhanced["--spice-accent"] = accentHex;
      enhanced["--spice-button"] = accentHex;
      enhanced["--spice-button-active"] = accentHex;
      enhanced["--spice-rgb-accent"] = accentRgb;
      enhanced["--spice-rgb-button"] = accentRgb;
      enhanced["--spice-text-accent"] = accentHex;

      // 🎯 SIDEBAR-SPECIFIC VARIABLES
      enhanced["--sn-sidebar-entanglement-color-rgb"] = accentRgb;
      enhanced["--sn-sidebar-accent-color"] = accentHex;
      enhanced["--sn-sidebar-accent-rgb"] = accentRgb;
      enhanced["--sn-sidebar-dynamic-accent"] = accentHex;

      // 🎯 NOW-PLAYING SPECIFIC VARIABLES
      enhanced["--sn-nowplaying-accent-color"] = accentHex;
      enhanced["--sn-nowplaying-accent-rgb"] = accentRgb;
      enhanced["--sn-nowplaying-primary-color"] = accentHex;
      enhanced["--sn-nowplaying-primary-rgb"] = accentRgb;

      // 🎯 MAIN FEED / CONTENT VARIABLES
      enhanced["--sn-main-feed-accent-color"] = accentHex;
      enhanced["--sn-main-feed-accent-rgb"] = accentRgb;
      enhanced["--sn-content-accent-color"] = accentHex;
      enhanced["--sn-content-accent-rgb"] = accentRgb;
    }

    if (primaryHex && primaryRgb) {
      // 🎯 PRIMARY GRADIENT MAPPINGS for backgrounds
      enhanced["--sn-primary-gradient-color"] = primaryHex;
      enhanced["--sn-primary-gradient-rgb"] = primaryRgb;
      enhanced["--sn-main-feed-primary-color"] = primaryHex;
      enhanced["--sn-main-feed-primary-rgb"] = primaryRgb;
    }

    if (secondaryHex && secondaryRgb) {
      // 🎯 SECONDARY GRADIENT MAPPINGS for depth effects
      enhanced["--sn-secondary-gradient-color"] = secondaryHex;
      enhanced["--sn-secondary-gradient-rgb"] = secondaryRgb;
      enhanced["--sn-main-feed-secondary-color"] = secondaryHex;
      enhanced["--sn-main-feed-secondary-rgb"] = secondaryRgb;
    }

    // 🎯 OKLAB ENHANCED VARIABLES for consciousness effects
    const oklabBrightHighlight =
      enhanced["--sn-color-oklab-bright-highlight-rgb"];
    if (oklabBrightHighlight) {
      enhanced["--sn-consciousness-bright-accent-rgb"] = oklabBrightHighlight;
      enhanced["--sn-holographic-accent-rgb"] = oklabBrightHighlight;
      enhanced["--organic-holographic-rgb"] = oklabBrightHighlight;
    }

    const oklabDynamicShadow = enhanced["--sn-color-oklab-dynamic-shadow-rgb"];
    if (oklabDynamicShadow) {
      enhanced["--sn-consciousness-shadow-rgb"] = oklabDynamicShadow;
      enhanced["--sn-depth-shadow-rgb"] = oklabDynamicShadow;
    }

    return enhanced;
  }

  /**
   * 🔧 PHASE 2: Emit CSS variables instead of applying directly
   */
  private applyVariablesDirectly(cssVariables: Record<string, string>): void {
    // 🔧 PHASE 2: Emit CSS variables for ColorStateManager to handle
    unifiedEventBus.emit("system:css-variables" as any, {
      source: "ColorHarmonyEngine",
      variables: cssVariables,
      timestamp: Date.now(),
    });
  }

  generateRecommendations(
    color: RGBColor,
    contrastRatio: number,
    harmonyScore: number,
    requirements: any
  ): any[] {
    const recommendations = [];
    const currentPalette = this.getCurrentActivePalette();
    const baseRgb = this.utils.hexToRgb(currentPalette?.neutrals?.base || '#1e1e2e')!;

    if (!baseRgb) {
      return [];
    }

    if (contrastRatio < requirements.minContrast) {
      const targetL = this.utils.findRequiredLuminance(
        color,
        baseRgb,
        requirements.minContrast
      );
      const currentHsl = this.utils.rgbToHsl(color.r, color.g, color.b);
      const adjustedRgbArr = this.utils.hslToRgb(
        currentHsl.h,
        currentHsl.s,
        targetL
      );
      const adjustedRgb = {
        r: adjustedRgbArr.r,
        g: adjustedRgbArr.g,
        b: adjustedRgbArr.b,
      };
      recommendations.push({
        type: "contrast",
        suggestion: `Adjust luminance to meet contrast of ${requirements.minContrast}`,
        recommendedColor: this.utils.rgbToHex(
          adjustedRgb.r,
          adjustedRgb.g,
          adjustedRgb.b
        ),
      });
    }

    if (harmonyScore < requirements.minHarmony) {
      const harmoniousAccent = this.findBestHarmoniousAccent(
        color,
        currentPalette
      );
      const blendedColor = this.blendColors(color, harmoniousAccent.rgb, 0.5);
      recommendations.push({
        type: "harmony",
        suggestion: `Blend with harmonious accent color to improve score to at least ${requirements.minHarmony}`,
        recommendedColor: this.utils.rgbToHex(
          blendedColor.r,
          blendedColor.g,
          blendedColor.b
        ),
      });
    }

    return recommendations;
  }

  getPerformanceReport(): any {
    return {
      system: this.systemName,
      metrics: this.harmonyMetrics,
      kineticState: this.kineticState,
      musicalMemorySize: this.musicalMemory.recentTracks.length,
      currentTheme: this.currentTheme,
    };
  }

  public override updateFromMusicAnalysis(
    processedMusicData: any,
    rawFeatures: any,
    trackUri: string
  ): void {
    if (!processedMusicData) return;

    // Phase 3 – genre-aware palette morphing
    const g = processedMusicData.genre as string | undefined;
    if (g && g !== this._lastGenre) {
      this._applyGenrePalette(g).then(() => {
        this._lastGenre = g;
        // Nudge CSS variables repaint
        this._forcePaletteRepaint();
      });
    }

    this._updateMusicalMemory(processedMusicData, trackUri);
    this._updateKineticState(processedMusicData);
    this._applyAestheticGravity(processedMusicData);

    // TODO: Phase 2 - Calculate music-aware dynamic values
    this._calculateMusicAwareDynamics(processedMusicData);
  }

  // TODO: Phase 2 - New method for music-aware dynamic calculations
  private _calculateMusicAwareDynamics(musicData: any): void {
    const {
      energy = 0.5,
      valence = 0.5,
      enhancedBPM = 120,
      beatOccurred = false,
    } = musicData;

    // Calculate music intensity multiplier (combines energy + valence)
    const musicIntensityMultiplier = this._calculateMusicIntensityMultiplier(
      energy,
      valence
    );

    // Calculate beat phase (0-1 cycle based on beat timing)
    const beatPhase = this._calculateBeatPhase(enhancedBPM);

    // Calculate valence gravity (-1 to 1 for emotional color shifting)
    const valenceGravity = (valence - 0.5) * 2;

    // Calculate dynamic hue shift for beat-synchronized effects
    const hueShift = this._calculateHueShift(beatOccurred, energy, beatPhase);

    // Store these values for use in _updateCSSVariables
    this.kineticState = {
      ...this.kineticState,
      musicIntensityMultiplier,
      beatPhase,
      valenceGravity,
      hueShift,
    };
  }

  // TODO: Phase 2 - Calculate music intensity based on energy and valence
  private _calculateMusicIntensityMultiplier(
    energy: number,
    valence: number
  ): number {
    // Combine energy and valence into a single intensity metric
    // High energy + positive valence = maximum intensity
    // Low energy + negative valence = minimum intensity
    const baseIntensity = energy * 0.7 + valence * 0.3;
    const contrastBoost = Math.abs(valence - 0.5) * 0.4; // Boost for emotional extremes
    return Math.max(0.1, Math.min(2.0, baseIntensity + contrastBoost));
  }

  // TODO: Phase 2 - Calculate beat phase for cyclic effects
  private _calculateBeatPhase(enhancedBPM: number): number {
    const now = performance.now();
    const beatInterval = 60000 / enhancedBPM; // ms per beat
    const timeSinceStart = now % beatInterval;
    return timeSinceStart / beatInterval; // 0-1 cycle
  }

  // TODO: Phase 2 - Calculate dynamic hue shift for beat effects
  private _calculateHueShift(
    beatOccurred: boolean,
    energy: number,
    beatPhase: number
  ): number {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return 0;
    }

    const artisticMode = this.config.artisticMode;
    const baseAmplitude = artisticMode === "cosmic-maximum" ? 8 : 5; // stronger base swing in cosmic mode
    let hueShift = Math.sin(beatPhase * 2 * Math.PI) * baseAmplitude;

    // Boost on actual beats
    if (beatOccurred) {
      const beatBoost = artisticMode === "cosmic-maximum" ? 12 : 10;
      hueShift += energy * beatBoost; // larger boost for cosmic mode
    }

    const clampRange = artisticMode === "cosmic-maximum" ? 25 : 15;
    return Math.max(-clampRange, Math.min(clampRange, hueShift)); // Clamp depending on mode
  }

  private _updateMusicalMemory(musicData: any, trackUri: string): void {
    this.musicalMemory.recentTracks.unshift({
      trackUri,
      ...musicData,
      timestamp: Date.now(),
    });
    if (
      this.musicalMemory.recentTracks.length > this.musicalMemory.maxMemorySize
    ) {
      this.musicalMemory.recentTracks.pop();
    }

    this.musicalMemory.energyHistory.unshift(musicData.energy);
    if (this.musicalMemory.energyHistory.length > 20) {
      this.musicalMemory.energyHistory.pop();
    }
    this.harmonyMetrics.temporalMemoryEvents++;
  }

  private _updateKineticState(musicData: any): void {
    const { energy, enhancedBPM, beatOccurred } = musicData;
    const now = performance.now();

    if (beatOccurred) {
      this.kineticState.lastBeatTime = now;
      this.kineticState.currentPulse = 1.0;
    } else {
      this.kineticState.currentPulse *= 0.95;
    }

    const timeSinceLastBeat = now - this.kineticState.lastBeatTime;
    const beatInterval = 60000 / (enhancedBPM || 120);
    this.kineticState.breathingPhase =
      ((timeSinceLastBeat % beatInterval) / beatInterval) * 2 * Math.PI;

    this.kineticState.visualMomentum = this.utils.lerp(
      this.kineticState.visualMomentum,
      energy,
      0.1
    );
  }

  // 🔧 PHASE 2: Emit gravity variables instead of applying CSS directly
  private _applyAestheticGravity(musicData: any): void {
    const { visualIntensity, valence, energy } = musicData;

    const gravityX = (valence - 0.5) * 2; // -1 to 1
    const gravityY = (energy - 0.5) * 2; // -1 to 1
    const gravityStrength = visualIntensity;

    // 🔧 PHASE 2: Emit gravity CSS variables for ColorStateManager
    unifiedEventBus.emit("system:css-variables" as any, {
      source: "ColorHarmonyEngine",
      variables: {
        "--sn-gravity-x": gravityX.toFixed(3),
        "--sn-gravity-y": gravityY.toFixed(3),
        "--sn-gravity-strength": gravityStrength.toFixed(3),
      },
      timestamp: Date.now(),
    });
  }

  public generateHarmonicVariations(baseRgb: RGBColor): {
    darkVibrantHex: string;
    lightVibrantHex: string;
  } {
    // =============================
    // NEW  – OKLab-based light/dark variants
    // =============================
    const oklab = this.utils.rgbToOklab(baseRgb.r, baseRgb.g, baseRgb.b);

    // Dark variant – reduce lightness perceptually
    const darkOklabL = Math.max(0, Math.min(1, oklab.L * 0.75));
    const darkRgb = this.utils.oklabToRgb(darkOklabL, oklab.a, oklab.b);

    // Light variant – increase lightness perceptually
    const lightOklabL = Math.max(0, Math.min(1, oklab.L * 1.25));
    const lightRgb = this.utils.oklabToRgb(lightOklabL, oklab.a, oklab.b);

    return {
      darkVibrantHex: this.utils.rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
      lightVibrantHex: this.utils.rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
    };
  }

  /**
   * Get current gradient colors optimized for WebGL texture creation
   * Uses variable inheritance from OKLAB processed consciousness-aware colors
   * @param stopCount Number of gradient stops to generate (default: 5)
   * @returns Array of RGB color objects or null if unavailable
   */
  public getCurrentGradient(
    stopCount: number = 5
  ): Array<{ r: number; g: number; b: number }> | null {
    try {
      const currentPalette = this.getCurrentActivePalette();
      if (!currentPalette) {
        return null;
      }

      // 🎯 VARIABLE INHERITANCE: Use processed OKLAB variables instead of manual CSS reading
      const rootEl = this.utils.getRootStyle();
      if (!rootEl) {
        return this.generateFallbackGradient(stopCount);
      }

      const computedStyle = getComputedStyle(rootEl);

      // Inherit from sophisticated OKLAB processed variables (consciousness-aware)
      const inheritedColors = this.getInheritedGradientColors(computedStyle);

      if (!inheritedColors) {
        Y3KDebug?.debug?.warn(
          "ColorHarmonyEngine",
          "Failed to inherit processed gradient variables, using fallback"
        );
        return this.generateFallbackGradient(stopCount);
      }

      // Generate harmonious color variations using inherited consciousness data
      const gradientColors: Array<{ r: number; g: number; b: number }> = [];

      // Apply consciousness state for music-responsive dynamics
      const musicInfluence = this.kineticState.musicIntensityMultiplier || 1.0;
      const hueShift = this.kineticState.hueShift || 0;
      const valenceGravity = this.kineticState.valenceGravity || 0.5;
      const emotionalTemperature =
        this.emotionalState?.currentEmotion?.colorTemperature || 0.5;

      // 🌈 CONSCIOUSNESS-AWARE GRADIENT GENERATION: Use inherited OKLAB processed colors
      const { primary, secondary, accent, emotional, tertiary } =
        inheritedColors;

      // Create consciousness-aware color array for interpolation
      const baseColors = [
        primary, // Deep consciousness base
        secondary, // Harmonic transition
        accent, // Vibrational peak
        emotional, // Emotional resonance
        tertiary, // Transcendent highlight
      ];

      // Generate gradient stops using OKLAB interpolation
      for (let i = 0; i < stopCount; i++) {
        const position = i / (stopCount - 1); // 0 to 1

        // 🎨 OKLAB INTERPOLATION: Use perceptually uniform color interpolation
        let interpolatedColor: RGBColor;

        if (stopCount === 1) {
          interpolatedColor = accent; // Single color fallback
        } else {
          // Map position to inherited color array with consciousness influence
          const colorIndex = position * (baseColors.length - 1);
          const lowerIndex = Math.floor(colorIndex);
          const upperIndex = Math.min(lowerIndex + 1, baseColors.length - 1);
          const interpolationFactor = colorIndex - lowerIndex;

          // Apply emotional temperature influence to interpolation
          const temperatureInfluence =
            Math.sin(emotionalTemperature * Math.PI) * 0.3;
          const adjustedFactor = Math.max(
            0,
            Math.min(1, interpolationFactor + temperatureInfluence)
          );

          // Use simple RGB interpolation (OKLAB methods not available)
          const color1 = baseColors[lowerIndex];
          const color2 = baseColors[upperIndex];

          if (color1 && color2) {
            interpolatedColor = {
              r: color1.r + (color2.r - color1.r) * adjustedFactor,
              g: color1.g + (color2.g - color1.g) * adjustedFactor,
              b: color1.b + (color2.b - color1.b) * adjustedFactor,
            };
          } else {
            interpolatedColor = accent; // Fallback to accent color
          }
        }

        // Apply consciousness state modulation (preserves OKLAB processing)
        let finalColor = this._applyConsciousnessModulation(interpolatedColor, {
          musicInfluence,
          valenceGravity,
          hueShift,
          emotionalTemperature,
          position,
        });

        gradientColors.push({
          r: Math.round(Math.max(0, Math.min(255, finalColor.r))),
          g: Math.round(Math.max(0, Math.min(255, finalColor.g))),
          b: Math.round(Math.max(0, Math.min(255, finalColor.b))),
        });
      }

      if (this.config?.enableDebug) {
        console.log(
          `[ColorHarmonyEngine] Generated gradient with ${stopCount} stops:`,
          gradientColors
        );
      }

      return gradientColors;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorDetails = {
        method: "getCurrentGradient",
        stopCount,
        currentTheme: this.currentTheme,
        kineticState: this.kineticState,
        timestamp: Date.now(),
        error: errorMessage,
      };

      // Enhanced logging with Y3K debug system
      Y3KDebug?.debug?.error(
        "ColorHarmonyEngine",
        "Failed to generate gradient colors",
        errorDetails
      );

      // Emit system error event for monitoring
      unifiedEventBus.emit("system:error", {
        systemName: "ColorHarmonyEngine",
        error: `Gradient generation failed: ${errorMessage}`,
        severity: "error" as const,
        timestamp: Date.now(),
      });

      // Attempt to provide meaningful fallback colors
      try {
        const fallbackColors = this.generateFallbackGradient(stopCount);
        if (fallbackColors && fallbackColors.length > 0) {
          Y3KDebug?.debug?.warn(
            "ColorHarmonyEngine",
            "Using fallback gradient after error",
            { fallbackColorCount: fallbackColors.length }
          );
          return fallbackColors;
        }
      } catch (fallbackError) {
        Y3KDebug?.debug?.error(
          "ColorHarmonyEngine",
          "Fallback gradient generation also failed",
          fallbackError
        );
      }

      return null;
    }
  }

  /**
   * Get inherited gradient colors from processed OKLAB CSS variables
   * Uses variable inheritance instead of manual CSS reading
   */
  private getInheritedGradientColors(computedStyle: CSSStyleDeclaration): {
    primary: RGBColor;
    secondary: RGBColor;
    accent: RGBColor;
    emotional: RGBColor;
    tertiary: RGBColor;
  } | null {
    try {
      // Inherit from OKLAB processed variables (consciousness-aware hierarchy)
      const primaryRgb =
        this.parseRGBVariable(
          computedStyle,
          "--sn-oklab-processed-primary-rgb"
        ) ||
        this.parseRGBVariable(computedStyle, "--sn-bg-gradient-primary-rgb") ||
        this.parseRGBVariable(
          computedStyle,
          "--sn-musical-harmony-primary-rgb"
        );

      const secondaryRgb =
        this.parseRGBVariable(
          computedStyle,
          "--sn-oklab-processed-secondary-rgb"
        ) ||
        this.parseRGBVariable(computedStyle, "--sn-bg-gradient-secondary-rgb") ||
        this.parseRGBVariable(
          computedStyle,
          "--sn-musical-harmony-secondary-rgb"
        );

      const accentRgb =
        this.parseRGBVariable(
          computedStyle,
          "--sn-oklab-processed-accent-rgb"
        ) ||
        this.parseRGBVariable(computedStyle, "--sn-bg-gradient-accent-rgb") ||
        this.parseRGBVariable(computedStyle, "--sn-color-accent-rgb");

      const emotionalRgb =
        this.parseRGBVariable(
          computedStyle,
          "--sn-oklab-emotional-temperature-rgb"
        ) ||
        this.parseRGBVariable(
          computedStyle,
          "--sn-emotional-temperature-warm-rgb"
        ) ||
        accentRgb; // Fallback to accent

      const tertiaryRgb =
        this.parseRGBVariable(
          computedStyle,
          "--sn-oklab-processed-bright-highlight-rgb"
        ) ||
        this.parseRGBVariable(computedStyle, "--sn-consciousness-flow-rgb") ||
        this.parseRGBVariable(
          computedStyle,
          "--sn-musical-harmony-tertiary-rgb"
        );

      // Verify we have at least primary and accent colors
      if (!primaryRgb || !accentRgb) {
        Y3KDebug?.debug?.warn(
          "ColorHarmonyEngine",
          "Missing essential inherited colors",
          {
            hasPrimary: !!primaryRgb,
            hasAccent: !!accentRgb,
          }
        );
        return null;
      }

      return {
        primary: primaryRgb,
        secondary: secondaryRgb || primaryRgb,
        accent: accentRgb,
        emotional: emotionalRgb || accentRgb,
        tertiary: tertiaryRgb || accentRgb,
      };
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorHarmonyEngine",
        "Failed to inherit gradient colors:",
        error
      );
      return null;
    }
  }

  /**
   * Parse RGB variable from CSS computed style with fallback chain
   */
  private parseRGBVariable(
    computedStyle: CSSStyleDeclaration,
    variableName: string
  ): RGBColor | null {
    try {
      const value = computedStyle.getPropertyValue(variableName).trim();
      if (!value) return null;

      const rgbMatch = value.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
        return {
          r: parseInt(rgbMatch[1], 10),
          g: parseInt(rgbMatch[2], 10),
          b: parseInt(rgbMatch[3], 10),
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Interpolate between two colors using perceptually aware interpolation
   */
  private interpolateOKLABColors(
    color1: RGBColor,
    color2: RGBColor,
    factor: number
  ): RGBColor {
    // Simple RGB interpolation with gamma correction for better perceptual results
    const gamma = 2.2;

    // Apply gamma correction
    const r1 = Math.pow(color1.r / 255, gamma);
    const g1 = Math.pow(color1.g / 255, gamma);
    const b1 = Math.pow(color1.b / 255, gamma);

    const r2 = Math.pow(color2.r / 255, gamma);
    const g2 = Math.pow(color2.g / 255, gamma);
    const b2 = Math.pow(color2.b / 255, gamma);

    // Interpolate in gamma space
    const rInterp = r1 + (r2 - r1) * factor;
    const gInterp = g1 + (g2 - g1) * factor;
    const bInterp = b1 + (b2 - b1) * factor;

    // Convert back to sRGB
    return {
      r: Math.round(Math.pow(rInterp, 1 / gamma) * 255),
      g: Math.round(Math.pow(gInterp, 1 / gamma) * 255),
      b: Math.round(Math.pow(bInterp, 1 / gamma) * 255),
    };
  }

  /**
   * Apply consciousness modulation to color (preserves OKLAB processing)
   */
  private _applyConsciousnessModulation(
    color: RGBColor,
    modulation: {
      musicInfluence: number;
      valenceGravity: number;
      hueShift: number;
      emotionalTemperature: number;
      position: number;
    }
  ): RGBColor {
    try {
      // Convert to HSL for consciousness modulation
      const hsl = this.utils.rgbToHsl(color.r, color.g, color.b);

      // Apply consciousness influences
      let { h, s, l } = hsl;

      // Music influence affects saturation
      s = Math.max(0, Math.min(1, s * (0.7 + modulation.musicInfluence * 0.6)));

      // Emotional temperature affects hue (warm/cool shift)
      h =
        (h +
          modulation.hueShift +
          (modulation.emotionalTemperature - 0.5) * 60) %
        360;

      // Valence gravity affects lightness based on position
      const gravityEffect =
        modulation.valenceGravity *
        0.2 *
        Math.sin(modulation.position * Math.PI);
      l = Math.max(0.1, Math.min(0.9, l + gravityEffect));

      // Convert back to RGB
      const modulatedRgb = this.utils.hslToRgb(h, s, l);
      return {
        r: modulatedRgb.r,
        g: modulatedRgb.g,
        b: modulatedRgb.b,
      };
    } catch (error) {
      // Return original color on error
      return color;
    }
  }

  /**
   * Generate fallback gradient colors when primary generation fails
   * Uses safe Catppuccin colors to prevent complete gradient failure
   */
  private generateFallbackGradient(
    stopCount: number
  ): Array<{ r: number; g: number; b: number }> | null {
    try {
      // Use default Catppuccin Mocha colors as absolute fallback
      const fallbackHexColors = [
        "#1e1e2e", // Base
        "#313244", // Surface0
        "#45475a", // Surface1
        "#585b70", // Surface2
        "#cba6f7", // Mauve (primary accent)
        "#f5c2e7", // Pink
        "#fab387", // Peach
      ];

      if (stopCount < 2 || stopCount > fallbackHexColors.length) {
        Y3KDebug?.debug?.warn(
          "ColorHarmonyEngine",
          `Invalid fallback stopCount: ${stopCount}, using default`
        );
        stopCount = Math.min(Math.max(stopCount, 2), fallbackHexColors.length);
      }

      const fallbackColors: Array<{ r: number; g: number; b: number }> = [];

      // Select colors evenly distributed across available fallback colors
      for (let i = 0; i < stopCount; i++) {
        const colorIndex = Math.floor(
          (i / (stopCount - 1)) * (fallbackHexColors.length - 1)
        );
        const hex = fallbackHexColors[colorIndex];
        const rgb = hex ? this.utils.hexToRgb(hex) : null;

        if (rgb) {
          fallbackColors.push(rgb);
        } else {
          // If hex conversion fails, use safe RGB values
          fallbackColors.push({
            r: 203,
            g: 166,
            b: 247, // Mauve fallback
          });
        }
      }

      // Ensure we have at least 2 colors for a valid gradient
      if (fallbackColors.length < 2) {
        fallbackColors.push(
          { r: 30, g: 30, b: 46 }, // Base
          { r: 203, g: 166, b: 247 } // Mauve
        );
      }

      Y3KDebug?.debug?.log(
        "ColorHarmonyEngine",
        `Generated fallback gradient with ${fallbackColors.length} colors`,
        fallbackColors
      );

      return fallbackColors;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "ColorHarmonyEngine",
        "Critical error in fallback gradient generation",
        error
      );
      return null;
    }
  }

  /**
   * Analyze music and update emotional state for consciousness-aware color processing
   * This method connects the Music → Emotion → Color flow
   */
  public async analyzeMusicEmotion(
    audioFeatures: AudioFeatures,
    audioData?: AudioData
  ): Promise<EmotionalState | null> {
    if (!this.initialized || !this.musicEmotionAnalyzer) {
      if (this.config.enableDebug) {
        console.warn(
          "🎭 [ColorHarmonyEngine] Cannot analyze music emotion: not initialized"
        );
      }
      return null;
    }

    try {
      // Analyze emotion using MusicEmotionAnalyzer
      const emotion = await this.musicEmotionAnalyzer.analyzeEmotion(
        audioFeatures,
        audioData
      );

      if (this.config.enableDebug) {
        console.log(
          `🎭 [ColorHarmonyEngine] Analyzed music emotion: ${
            emotion.primary
          } (${emotion.intensity.toFixed(
            2
          )} intensity, ${emotion.confidence.toFixed(2)} confidence)`
        );
      }

      return emotion;
    } catch (error) {
      console.error(
        "🎭 [ColorHarmonyEngine] Error analyzing music emotion:",
        error
      );
      return null;
    }
  }

  /**
   * Get current emotional state
   */
  public getCurrentEmotion(): EmotionalState | null {
    return this.emotionalState?.currentEmotion || null;
  }

  /**
   * Get emotion history for consciousness flow analysis
   */
  public getEmotionHistory(limit: number = 10): EmotionalState[] {
    if (!this.emotionalState?.emotionHistory) return [];
    return this.emotionalState.emotionHistory.slice(-limit);
  }

  /**
   * Set emotion influence intensity (0-1) for color processing
   */
  public setEmotionInfluenceIntensity(intensity: number): void {
    if (this.emotionalState) {
      this.emotionalState.emotionInfluenceIntensity = Math.max(
        0,
        Math.min(1, intensity)
      );
      if (this.config.enableDebug) {
        console.log(
          `🎭 [ColorHarmonyEngine] Emotion influence intensity set to ${this.emotionalState.emotionInfluenceIntensity}`
        );
      }
    }
  }

  /**
   * Create a color variant with lightness, saturation, and hue adjustments
   */
  private _createVariant(
    baseColor: RGBColor,
    lightnessFactor: number,
    valenceGravity: number,
    hueShift: number
  ): RGBColor {
    // Convert to OKLab for perceptual adjustments
    const oklab = this.utils.rgbToOklab(baseColor.r, baseColor.g, baseColor.b);

    // Adjust lightness (-1 to 1 range)
    const newL = Math.max(0, Math.min(1, oklab.L + lightnessFactor * 0.2));

    // Apply music valence to chroma (saturation)
    const chromaScale = 0.8 + valenceGravity * 0.4; // 0.8 to 1.2 range
    const newA = oklab.a * chromaScale;
    const newB = oklab.b * chromaScale;

    // Apply subtle hue shift from music
    const hueAdjustment = hueShift * 0.1; // Subtle shift
    const adjustedA =
      newA * Math.cos(hueAdjustment) - newB * Math.sin(hueAdjustment);
    const adjustedB =
      newA * Math.sin(hueAdjustment) + newB * Math.cos(hueAdjustment);

    // Convert back to RGB
    return this.utils.oklabToRgb(newL, adjustedA, adjustedB);
  }

  /**
   * Apply music intensity influence to color
   */
  private _applyMusicInfluence(
    color: RGBColor,
    intensity: number,
    position: number
  ): RGBColor {
    // Scale intensity effect based on gradient position
    const positionEffect = 1 + Math.sin(position * Math.PI) * 0.2; // Boost middle colors
    const effectiveIntensity = Math.max(
      0.7,
      Math.min(1.3, intensity * positionEffect)
    );

    return {
      r: color.r * effectiveIntensity,
      g: color.g * effectiveIntensity,
      b: color.b * effectiveIntensity,
    };
  }

  // =========================
  // PUBLIC API – User Control
  // =========================
  /**
   * Update user-defined harmonic intensity (0–1). Values outside range are clamped.
   */
  public setIntensity(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.userIntensity = clamped;
    if (this.config?.enableDebug) {
      console.log(
        `[ColorHarmonyEngine] User harmonic intensity set to ${clamped}`
      );
    }
  }

  /**
   * External systems can push a pre-computed RGB palette to the engine.
   * Currently this simply triggers a palette refresh so all CSS variables
   * are recalculated.  Future phases may blend these colours directly.
   *
   * @param colors – Array of RGB objects ({ r,g,b }) representing the new palette
   */
  public updatePalette(
    colors: Array<{ r: number; g: number; b: number }>
  ): void {
    if (!colors?.length) return;
    // TODO: Phase-4 – incorporate provided colours into harmony pipeline
    if (this.config?.enableDebug) {
      console.log("[ColorHarmonyEngine] updatePalette invoked", {
        count: colors.length,
      });
    }
    // For now, simply force a repaint so downstream CSS vars refresh.
    this.forceRepaint("external-palette");
  }

  // ============================
  // Settings / Event Integration
  // ============================

  private _handleSettingsChange(event: Event): void {
    const { key, value } = (event as CustomEvent).detail || {};
    switch (key) {
      case HARMONIC_INTENSITY_KEY: {
        const num = parseFloat(value);
        if (!Number.isNaN(num)) {
          this.setIntensity(num);
        }
        break;
      }
      case HARMONIC_EVOLUTION_KEY: {
        const enabled = value === "true" || value === true;
        this._setEvolutionEnabled(enabled);
        break;
      }
    }
  }

  private _handleArtisticModeChanged(): void {
    // Artistic mode influences multipliers & contrast. Force a full palette
    // refresh so gradients & other CSS vars update instantly.
    this.currentTheme = this.detectCurrentTheme();
    // Debounced to avoid thrashing if multiple settings change quickly.
    if (!this._pendingPaletteRefresh) {
      this._pendingPaletteRefresh = setTimeout(() => {
        this._pendingPaletteRefresh = null;
        this.refreshPalette();
      }, 80); // ~1 animation frame
    }
  }

  private _forcePaletteRepaint(): void {
    // Simply bump kinetic hue shift to trigger _updateCSSVariables logic.
    this.kineticState.hueShift = (this.kineticState.hueShift || 0) + 0.01;
  }

  // Evolution helpers
  private _startEvolutionLoop(): void {
    if (this._evolutionTimer) return;
    // Period depends on intensity: stronger intensity → faster evolution
    const basePeriod = 30000; // 30s full cycle at intensity 1
    const period = basePeriod / Math.max(0.1, this.userIntensity);
    this._evolutionTimer = setInterval(() => {
      // Rotate hue slowly; we piggy-back on kineticState hueShift
      const step = 2 * this.userIntensity; // degrees per tick
      const current = this.kineticState.hueShift ?? 0;
      this.kineticState.hueShift = ((current + step + 360) % 360) - 180;
    }, period);
  }

  private _stopEvolutionLoop(): void {
    if (this._evolutionTimer) {
      clearInterval(this._evolutionTimer);
      this._evolutionTimer = null;
    }
  }

  private _setEvolutionEnabled(enabled: boolean): void {
    if (this.evolutionEnabled === enabled) return;
    this.evolutionEnabled = enabled;
    if (enabled) this._startEvolutionLoop();
    else this._stopEvolutionLoop();
  }

  // Clean up listeners when destroyed
  public override destroy(): void {
    this._stopEvolutionLoop();
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this._boundSettingsChangeHandler
    );
    document.removeEventListener(
      "year3000ArtisticModeChanged",
      this._boundArtisticModeHandler
    );

    // Clean up SemanticColorManager
    if (this.semanticColorManager) {
      this.semanticColorManager.destroy();
    }

    // Clean up MusicEmotionAnalyzer
    if (this.musicEmotionAnalyzer) {
      this.musicEmotionAnalyzer.destroy();
    }

    // Clear emotional state
    if (this.emotionalState) {
      this.emotionalState.currentEmotion = null;
      this.emotionalState.emotionHistory = [];
    }

    super.destroy?.();
  }

  /**
   * Public helper that triggers a colour rebake based on the current track.
   * Prefer calling the global Year3000System where available so the full
   * pipeline (extraction → harmonisation → CSS variable batch) is reused.
   */
  public async refreshPalette(): Promise<void> {
    try {
      const y3kSystem = (globalThis as any).year3000System;
      if (y3kSystem?.updateColorsFromCurrentTrack) {
        await y3kSystem.updateColorsFromCurrentTrack();
        return;
      }

      // 🔧 PHASE 2: Fallback - emit CSS variables instead of applying directly
      const root = this.utils.getRootStyle();
      if (!root) return;
      const styles = getComputedStyle(root);
      const primary = styles.getPropertyValue("--sn-gradient-primary").trim();
      if (primary) {
        // Recompute RGB variant using official gradient variables
        const rgb = this.utils.hexToRgb(primary);
        const variables: Record<string, string> = {
          "--sn-bg-gradient-primary": primary,
        };
        if (rgb) {
          variables["--sn-bg-gradient-primary-rgb"] = `${rgb.r},${rgb.g},${rgb.b}`;
        }

        // 🔧 PHASE 2: Emit for ColorStateManager
        unifiedEventBus.emit("system:css-variables" as any, {
          source: "ColorHarmonyEngine",
          variables,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      if (this.config.enableDebug) {
        console.warn("[ColorHarmonyEngine] refreshPalette failed", err);
      }
    }
  }

  /**
   * Swap Catppuccin palette accents & neutrals based on detected genre.
   * Executes asynchronously to avoid blocking audio thread.
   */
  private async _applyGenrePalette(genre: string): Promise<void> {
    try {
      const palette = await this._getGenreAwarePalette(genre);
      if (!palette) return;

      // Replace current flavour palette in-memory then refresh CSS vars
      // Note: This updates hardcoded palettes but getCurrentActivePalette() will use PaletteSystemManager when year3000 is active
      (this.catppuccinPalettes as any)[this.currentTheme] = palette;
      await this.refreshPalette();

      // Phase 3 – Genre change notification (handled by music events with genre data)
      // TODO: Consider adding dedicated settings:genre-changed event if needed
      if (this.config.enableDebug) {
        console.log(`🎨 [ColorHarmonyEngine] Genre changed to: ${genre}`);
      }
    } catch (err) {
      if (this.config.enableDebug) {
        console.warn("[ColorHarmonyEngine] _applyGenrePalette failed", err);
      }
    }
  }

  public setEmergentEngine(engine: EnhancedMasterAnimationCoordinator): void {
    this.emergentEngine = engine;
  }

  // ---------------------------------------------------------------------------
  // 🔄 SETTINGS-AWARE REPAINT IMPLEMENTATION
  // ---------------------------------------------------------------------------
  /**
   * Calculate temperature-based blend influence for emotional temperature integration
   * Maps color temperature (1000K-20000K) to blend ratio influence (0.7-1.3)
   */
  private calculateTemperatureBlendInfluence(temperature: number): number {
    // Normalize temperature to 0-1 range
    const normalized = Math.max(
      0,
      Math.min(1, (temperature - 1000) / (20000 - 1000))
    );

    // Create a curve that gives more intensity to extreme temperatures
    // Low temperatures (warm, 1000K-4000K): enhanced blending (1.0-1.3)
    // Mid temperatures (neutral, 4000K-8000K): normal blending (0.9-1.1)
    // High temperatures (cool, 8000K-20000K): enhanced blending (1.1-1.3)

    if (temperature <= 4000) {
      // Warm temperatures: linear increase from 1.0 to 1.3
      const warmFactor = (4000 - temperature) / (4000 - 1000); // 1 to 0
      return 1.0 + warmFactor * 0.3; // 1.0 to 1.3
    } else if (temperature >= 8000) {
      // Cool temperatures: linear increase from 1.1 to 1.3
      const coolFactor = (temperature - 8000) / (20000 - 8000); // 0 to 1
      return 1.1 + coolFactor * 0.2; // 1.1 to 1.3
    } else {
      // Mid-range temperatures: slight dip for neutral effect
      const midFactor = Math.abs(temperature - 6000) / 2000; // Distance from center
      return 0.9 + midFactor * 0.2; // 0.9 to 1.1
    }
  }

  /**
   * Re-apply the current palette immediately.  This is extremely lightweight
   * (just re-blends colours + sets CSS vars) so it can be called synchronously
   * from Year3000System after a relevant settings change.
   */
  public override forceRepaint(_reason: string = "settings-change"): void {
    // Debounced palette refresh is intentionally bypassed here—we want an
    // immediate update so UI responds in the same frame.
    this.refreshPalette?.();
  }

  // ============================================================================
  // 🌟 ENHANCED OKLAB INTEGRATION METHODS
  // ============================================================================

  /**
   * Determine optimal OKLAB enhancement preset based on musical and visual context
   */
  private determineOptimalOKLABPreset(
    context: ColorContext
  ): EnhancementPreset {
    const musicData = context.musicData;

    // Default to STANDARD preset
    let selectedPreset: EnhancementPreset =
      OKLABColorProcessor.PRESETS.STANDARD!;

    if (musicData) {
      const { energy = 0.5, valence = 0.5 } = musicData;

      // High energy + high valence = COSMIC (maximum enhancement for vibrant music)
      if (energy > 0.8 && valence > 0.7) {
        selectedPreset = OKLABColorProcessor.PRESETS.COSMIC!;
      }
      // High energy + low valence = VIBRANT (enhanced vibrancy for intense music)
      else if (energy > 0.7 && valence < 0.4) {
        selectedPreset = OKLABColorProcessor.PRESETS.VIBRANT!;
      }
      // Low energy = SUBTLE (gentle enhancement for calm music)
      else if (energy < 0.3) {
        selectedPreset = OKLABColorProcessor.PRESETS.SUBTLE!;
      }
      // Everything else = STANDARD
    }

    // Performance hints can override musical analysis
    if (context.performanceHints?.preferLightweight) {
      selectedPreset = OKLABColorProcessor.PRESETS.SUBTLE!;
    }

    if (this.config?.enableDebug) {
      console.log("🔬 [ColorHarmonyEngine] OKLAB preset selection:", {
        energy: musicData?.energy,
        valence: musicData?.valence,
        selectedPreset: selectedPreset.name,
        reason: this.getPresetSelectionReason(musicData, context),
      });
    }

    return selectedPreset;
  }

  /**
   * Get comprehensive emotional temperature analysis using EmotionalTemperatureMapper
   * Enhanced with album art color analysis for multi-sensory emotion intelligence
   */
  private async getAdvancedEmotionalTemperature(
    musicData: any,
    albumArtColors?: Record<string, string>
  ): Promise<EmotionalTemperatureResult | null> {
    if (!this.emotionalTemperatureMapper || !musicData) {
      return null;
    }

    try {
      // Convert music data to analysis format
      const analysisData: MusicAnalysisData = {
        energy: musicData.energy || 0.5,
        valence: musicData.valence || 0.5,
        danceability: musicData.danceability,
        tempo: musicData.tempo,
        loudness: musicData.loudness,
        acousticness: musicData.acousticness,
        instrumentalness: musicData.instrumentalness,
        speechiness: musicData.speechiness,
        mode: musicData.mode,
        key: musicData.key,
        genre: musicData.genre,
      };

      // 🎨 ALBUM ART ENHANCEMENT: Enhance emotion analysis with album art color psychology
      const enhancedAnalysisData = await this.enhanceWithAlbumArtPsychology(
        analysisData,
        albumArtColors
      );

      const emotionalResult =
        this.emotionalTemperatureMapper.mapMusicToEmotionalTemperature(
          enhancedAnalysisData
        );

      if (this.config?.enableDebug) {
        console.log(
          "🌡️ [ColorHarmonyEngine] Advanced emotional temperature with album art enhancement:",
          {
            input: analysisData,
            enhanced: enhancedAnalysisData,
            albumArtInfluence: albumArtColors
              ? Object.keys(albumArtColors).length + " colors"
              : "None",
            emotion: emotionalResult.primaryEmotion,
            secondaryEmotion: emotionalResult.secondaryEmotion,
            intensity: emotionalResult.intensity,
            temperature: emotionalResult.temperature,
            oklabPreset: emotionalResult.oklabPreset.name,
            perceptualColor: emotionalResult.perceptualColorHex,
          }
        );
      }

      return emotionalResult;
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Advanced emotional temperature analysis failed:",
        error
      );
      return null;
    }
  }

  /**
   * Enhance music emotion analysis with album art color psychology
   * Uses color theory and psychological associations to calibrate emotion detection
   * Creating a multi-sensory approach to artist consciousness recognition
   */
  private async enhanceWithAlbumArtPsychology(
    originalAnalysis: MusicAnalysisData,
    albumArtColors?: Record<string, string>
  ): Promise<MusicAnalysisData> {
    if (!albumArtColors || Object.keys(albumArtColors).length === 0) {
      return originalAnalysis;
    }

    try {
      // Analyze album art colors for psychological indicators
      const colorPsychology = this.analyzeAlbumArtPsychology(albumArtColors);

      // Create enhanced analysis data with color-informed adjustments
      const enhanced: MusicAnalysisData = { ...originalAnalysis };

      // Apply color psychology adjustments to emotion analysis with safe access
      const currentEnergy = enhanced.energy || 0.5;
      const currentValence = enhanced.valence || 0.5;

      // Warm colors (reds, oranges) typically increase energy and arousal
      if (colorPsychology.warmth > 0.6) {
        enhanced.energy = Math.min(
          1.0,
          currentEnergy * (1 + colorPsychology.warmth * 0.3)
        );
        enhanced.valence = Math.min(
          1.0,
          currentValence + colorPsychology.warmth * 0.2
        );
      }

      // Cool colors (blues, greens) typically create calming, reflective moods
      if (colorPsychology.coolness > 0.6) {
        enhanced.energy = Math.max(
          0.0,
          currentEnergy * (1 - colorPsychology.coolness * 0.2)
        );
        if (colorPsychology.saturation > 0.5) {
          enhanced.valence = Math.min(
            1.0,
            currentValence + colorPsychology.coolness * 0.15
          );
        }
      }

      // High saturation increases emotional intensity
      if (colorPsychology.saturation > 0.7) {
        enhanced.energy = Math.min(
          1.0,
          currentEnergy + colorPsychology.saturation * 0.2
        );
      }

      // Low saturation (desaturated/monochromatic) suggests introspection
      if (colorPsychology.saturation < 0.3) {
        enhanced.valence = Math.max(0.0, currentValence - 0.15);
        enhanced.energy = Math.max(0.0, currentEnergy - 0.1);
      }

      // Dark colors can indicate intensity, drama, or melancholy
      if (colorPsychology.darkness > 0.7) {
        const finalEnergy = enhanced.energy || currentEnergy;
        if (finalEnergy > 0.6) {
          // High energy + dark colors = intense/dramatic
          enhanced.energy = Math.min(1.0, finalEnergy + 0.1);
        } else {
          // Low energy + dark colors = melancholic
          enhanced.valence = Math.max(
            0.0,
            (enhanced.valence || currentValence) - 0.2
          );
        }
      }

      // Bright colors typically increase positive valence
      if (colorPsychology.brightness > 0.8) {
        enhanced.valence = Math.min(
          1.0,
          (enhanced.valence || currentValence) +
            colorPsychology.brightness * 0.2
        );
      }

      // Color harmony affects emotional stability and coherence
      if (colorPsychology.harmony > 0.8) {
        // Harmonious colors suggest stable, pleasant emotions
        enhanced.valence = Math.min(
          1.0,
          (enhanced.valence || currentValence) + 0.1
        );
      } else if (colorPsychology.harmony < 0.3) {
        // Disharmonious colors might suggest tension or experimental art
        enhanced.energy = Math.min(
          1.0,
          (enhanced.energy || currentEnergy) + 0.15
        );
      }

      if (this.config?.enableDebug) {
        console.log(
          "🎨 [ColorHarmonyEngine] Album art psychology enhancement:",
          {
            original: {
              energy: originalAnalysis.energy || 0.5,
              valence: originalAnalysis.valence || 0.5,
            },
            enhanced: {
              energy: enhanced.energy || 0.5,
              valence: enhanced.valence || 0.5,
            },
            colorPsychology,
            adjustments: {
              energyChange:
                (enhanced.energy || 0.5) - (originalAnalysis.energy || 0.5),
              valenceChange:
                (enhanced.valence || 0.5) - (originalAnalysis.valence || 0.5),
            },
          }
        );
      }

      return enhanced;
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Album art psychology enhancement failed:",
        error
      );
      return originalAnalysis;
    }
  }

  /**
   * Analyze album art colors for psychological and emotional indicators
   * 🎨 PHASE 2.3: Enhanced with genre indicators and artist consciousness recognition
   * Based on color psychology research and artist expression patterns
   */
  private analyzeAlbumArtPsychology(albumArtColors: Record<string, string>): {
    warmth: number; // 0-1: How warm the color palette is
    coolness: number; // 0-1: How cool the color palette is
    saturation: number; // 0-1: Average saturation level
    brightness: number; // 0-1: Average brightness level
    darkness: number; // 0-1: How dark the overall palette is
    harmony: number; // 0-1: How harmonious the color relationships are
    dominantHue: number; // 0-360: Primary hue in degrees
    emotionalIntensity: number; // 0-1: Overall emotional intensity
    // 🎨 PHASE 2.3: New genre and artist consciousness indicators
    genreIndicators: {
      electronicLikelihood: number; // 0-1: Likelihood of electronic/synthetic music
      organicLikelihood: number; // 0-1: Likelihood of organic/acoustic music
      metalHardcoreLikelihood: number; // 0-1: Likelihood of metal/hardcore music
      popCommercialLikelihood: number; // 0-1: Likelihood of pop/commercial music
      jazzClassicalLikelihood: number; // 0-1: Likelihood of jazz/classical music
      folkAcousticLikelihood: number; // 0-1: Likelihood of folk/acoustic music
    };
    artistConsciousness: {
      visualSophistication: number; // 0-1: How sophisticated the visual choices are
      artisticIntention: number; // 0-1: How intentional the color choices appear
      culturalIndicators: string[]; // Array of detected cultural/regional indicators
      emotionalDepth: number; // 0-1: Depth of emotional expression through colors
    };
  } {
    try {
      const colors = Object.values(albumArtColors);
      if (colors.length === 0) {
        // Return neutral values if no colors
        return {
          warmth: 0.5,
          coolness: 0.5,
          saturation: 0.5,
          brightness: 0.5,
          darkness: 0.5,
          harmony: 0.5,
          dominantHue: 180,
          emotionalIntensity: 0.5,
          genreIndicators: {
            electronicLikelihood: 0.5,
            organicLikelihood: 0.5,
            metalHardcoreLikelihood: 0.5,
            popCommercialLikelihood: 0.5,
            jazzClassicalLikelihood: 0.5,
            folkAcousticLikelihood: 0.5,
          },
          artistConsciousness: {
            visualSophistication: 0.5,
            artisticIntention: 0.5,
            culturalIndicators: [],
            emotionalDepth: 0.5,
          },
        };
      }

      let totalWarmth = 0,
        totalCoolness = 0,
        totalSaturation = 0;
      let totalBrightness = 0,
        totalDarkness = 0;
      const hues: number[] = [];

      for (const color of colors) {
        const rgb = this.utils.hexToRgb(color);
        if (!rgb) continue;

        const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const { h, s, l } = hsl;
        hues.push(h);

        // Calculate warmth/coolness based on hue
        // Warm: 0-60° (reds/oranges/yellows) and 300-360° (magentas/reds)
        // Cool: 120-240° (greens/cyans/blues)
        if ((h >= 0 && h <= 60) || (h >= 300 && h <= 360)) {
          totalWarmth += s * l; // Weight by saturation and lightness
        } else if (h >= 120 && h <= 240) {
          totalCoolness += s * l;
        }

        totalSaturation += s;
        totalBrightness += l;
        totalDarkness += 1 - l;
      }

      const count = colors.length;
      const avgWarmth = totalWarmth / count;
      const avgCoolness = totalCoolness / count;
      const avgSaturation = totalSaturation / count;
      const avgBrightness = totalBrightness / count;
      const avgDarkness = totalDarkness / count;

      // Calculate color harmony using hue relationships
      const harmony = this.calculateColorHarmony(hues);

      // Calculate dominant hue (most frequent hue range)
      const dominantHue = this.calculateDominantHue(hues);

      // Calculate emotional intensity based on saturation and brightness contrast
      const emotionalIntensity = Math.min(
        1.0,
        (avgSaturation + this.calculateContrast(colors)) / 2
      );

      // 🎨 PHASE 2.3: Analyze genre indicators from color psychology
      const genreIndicators = this._analyzeGenreIndicatorsFromColors({
        warmth: Math.min(1.0, avgWarmth),
        coolness: Math.min(1.0, avgCoolness),
        saturation: avgSaturation,
        brightness: avgBrightness,
        darkness: avgDarkness,
        harmony,
        dominantHue,
        emotionalIntensity,
      });

      // 🎨 PHASE 2.3: Analyze artist consciousness from color choices
      const artistConsciousness = this._analyzeArtistConsciousness(colors, {
        avgSaturation,
        avgBrightness,
        harmony,
        emotionalIntensity,
        colorCount: colors.length,
      });

      return {
        warmth: Math.min(1.0, avgWarmth),
        coolness: Math.min(1.0, avgCoolness),
        saturation: avgSaturation,
        brightness: avgBrightness,
        darkness: avgDarkness,
        harmony,
        dominantHue,
        emotionalIntensity,
        genreIndicators,
        artistConsciousness,
      };
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Album art psychology analysis failed:",
        error
      );
      return {
        warmth: 0.5,
        coolness: 0.5,
        saturation: 0.5,
        brightness: 0.5,
        darkness: 0.5,
        harmony: 0.5,
        dominantHue: 180,
        emotionalIntensity: 0.5,
        genreIndicators: {
          electronicLikelihood: 0.5,
          organicLikelihood: 0.5,
          metalHardcoreLikelihood: 0.5,
          popCommercialLikelihood: 0.5,
          jazzClassicalLikelihood: 0.5,
          folkAcousticLikelihood: 0.5,
        },
        artistConsciousness: {
          visualSophistication: 0.5,
          artisticIntention: 0.5,
          culturalIndicators: [],
          emotionalDepth: 0.5,
        },
      };
    }
  }

  /**
   * Calculate color harmony score based on hue relationships
   */
  private calculateColorHarmony(hues: number[]): number {
    if (hues.length <= 1) return 1.0;

    let harmonyScore = 0;
    const harmonyTypes = [
      60, // Complementary
      120, // Triadic
      30, // Analogous
      90, // Tetradic
    ];

    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const hue1 = hues[i];
        const hue2 = hues[j];
        if (hue1 === undefined || hue2 === undefined) continue;

        const diff = Math.abs(hue1 - hue2);
        const minDiff = Math.min(diff, 360 - diff);

        // Check if this difference is close to a harmonic relationship
        for (const harmonic of harmonyTypes) {
          if (Math.abs(minDiff - harmonic) <= 15) {
            harmonyScore += 1;
          }
        }
      }
    }

    // Normalize by maximum possible harmony relationships
    const maxPossible = (hues.length * (hues.length - 1)) / 2;
    return Math.min(1.0, harmonyScore / maxPossible);
  }

  /**
   * Calculate dominant hue from hue array
   */
  private calculateDominantHue(hues: number[]): number {
    if (hues.length === 0) return 180;

    // Group hues into 30-degree segments and find most frequent
    const segments = new Array(12).fill(0);

    for (const hue of hues) {
      const segment = Math.floor(hue / 30);
      segments[segment]++;
    }

    const maxSegment = segments.indexOf(Math.max(...segments));
    return maxSegment * 30 + 15; // Return middle of dominant segment
  }

  /**
   * Calculate contrast level between colors
   */
  private calculateContrast(colors: string[]): number {
    if (colors.length <= 1) return 0;

    let totalContrast = 0;
    let comparisons = 0;

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const color1 = colors[i];
        const color2 = colors[j];
        if (!color1 || !color2) continue;

        const rgb1 = this.utils.hexToRgb(color1);
        const rgb2 = this.utils.hexToRgb(color2);

        if (rgb1 && rgb2) {
          // Simple contrast calculation based on luminance difference
          const lum1 = (rgb1.r * 0.299 + rgb1.g * 0.587 + rgb1.b * 0.114) / 255;
          const lum2 = (rgb2.r * 0.299 + rgb2.g * 0.587 + rgb2.b * 0.114) / 255;
          totalContrast += Math.abs(lum1 - lum2);
          comparisons++;
        }
      }
    }

    return comparisons > 0 ? totalContrast / comparisons : 0;
  }

  /**
   * Blend colors using advanced OKLAB processing for perceptually uniform results
   */
  private async blendWithAdvancedOKLAB(
    rawColors: Record<string, string>,
    musicData: any,
    emotionalTemperature: EmotionalTemperatureResult | null,
    genreData?: {
      genre: MusicGenre;
      confidence: number;
      characteristics: GenreCharacteristics;
      visualStyle: GenreVisualStyle;
    }
  ): Promise<Record<string, string>> {
    const processedColors: Record<string, string> = { ...rawColors };

    try {
      // Use emotional temperature OKLAB preset if available, otherwise use determined preset
      const optimalPreset =
        emotionalTemperature?.oklabPreset || this.oklabState.currentPreset;

      // 🎶 GENRE AESTHETIC PROCESSING: Apply genre-specific color characteristics
      let genreAdjustedPreset = optimalPreset;
      if (
        genreData &&
        genreData.confidence > 0.5 &&
        this.genreState.genreInfluenceIntensity > 0
      ) {
        genreAdjustedPreset = this.applyGenreColorAesthetics(
          optimalPreset,
          genreData
        );
      }

      // Process primary colors through OKLAB for enhanced vibrancy and perceptual uniformity
      const colorPriorities = [
        "PRIMARY",
        "VIBRANT",
        "PROMINENT",
        "VIBRANT_NON_ALARMING",
        "LIGHT_VIBRANT",
      ];

      for (const colorKey of colorPriorities) {
        const colorHex = rawColors[colorKey];
        if (colorHex && this.isValidHex(colorHex)) {
          try {
            // Check cache first for performance (include genre in cache key for aesthetic variety)
            const genreKey = genreData ? `-${genreData.genre}` : "";
            const cacheKey = `${colorHex}-${genreAdjustedPreset.name}${genreKey}`;
            if (this.oklabState.processedPalette[cacheKey]) {
              processedColors[colorKey] =
                this.oklabState.processedPalette[cacheKey].enhancedHex;
              continue;
            }

            // Process through OKLAB with genre-adjusted aesthetics
            const oklabResult = this.oklabProcessor.processColor(
              colorHex,
              genreAdjustedPreset
            );
            processedColors[colorKey] = oklabResult.enhancedHex;

            // Cache result
            this.oklabState.processedPalette[cacheKey] = oklabResult;

            if (this.config?.enableDebug) {
              console.log(
                `🎨 [ColorHarmonyEngine] OKLAB enhanced ${colorKey}:`,
                {
                  original: colorHex,
                  enhanced: oklabResult.enhancedHex,
                  preset: optimalPreset.name,
                  processingTime: oklabResult.processingTime,
                }
              );
            }
          } catch (error) {
            console.warn(
              `[ColorHarmonyEngine] OKLAB processing failed for ${colorKey}:`,
              error
            );
            // Keep original color on error
          }
        }
      }

      // If emotional temperature provides a perceptual color, blend it with primary
      if (emotionalTemperature?.perceptualColorHex && processedColors.PRIMARY) {
        try {
          const blendResult = this.oklabProcessor.interpolateOKLAB(
            processedColors.PRIMARY,
            emotionalTemperature.perceptualColorHex,
            emotionalTemperature.intensity * 0.3, // Blend factor based on intensity
            optimalPreset
          );

          processedColors.EMOTIONAL_BLEND = blendResult.enhancedHex;

          if (this.config?.enableDebug) {
            console.log("🌡️ [ColorHarmonyEngine] Emotional color blending:", {
              primary: processedColors.PRIMARY,
              emotionalColor: emotionalTemperature.perceptualColorHex,
              blendFactor: emotionalTemperature.intensity * 0.3,
              result: blendResult.enhancedHex,
            });
          }
        } catch (error) {
          console.warn(
            "[ColorHarmonyEngine] Emotional color blending failed:",
            error
          );
        }
      }

      this.oklabState.lastProcessingTime = Date.now();

      // 🎨 PHASE 2.2: Direct Album Color Blending in OKLAB Processing
      // Add album art color influence directly to final colors with perceptual blending
      const albumArtInfluence = this.getAlbumArtInfluenceSetting(); // 0-1 user control

      if (
        albumArtInfluence > 0 &&
        rawColors &&
        Object.keys(rawColors).length > 0
      ) {
        try {
          const albumBlendedColors = await this._applyDirectAlbumColorBlending(
            processedColors,
            rawColors,
            albumArtInfluence,
            genreAdjustedPreset
          );

          // Replace processed colors with album-enhanced versions
          Object.assign(processedColors, albumBlendedColors);

          if (this.config?.enableDebug) {
            console.log(
              "🎨 [ColorHarmonyEngine] Applied direct album color blending:",
              {
                albumInfluence: (albumArtInfluence * 100).toFixed(1) + "%",
                blendedKeys: Object.keys(albumBlendedColors),
                note: "album colors now directly influence final UI colors",
              }
            );
          }
        } catch (error) {
          console.warn(
            "[ColorHarmonyEngine] Direct album color blending failed:",
            error
          );
        }
      }

      // 🎯 CRITICAL FIX: Apply comprehensive Spicetify variable updates with OKLAB-processed colors
      // This ensures the new strategy pattern also benefits from our enhanced override protection
      if (this.semanticColorManager) {
        try {
          this.semanticColorManager.updateWithAlbumColors(processedColors);

          if (this.config?.enableDebug) {
            console.log(
              "🎨 [ColorHarmonyEngine] Applied comprehensive Spicetify variable updates via strategy pattern:",
              {
                processedColorCount: Object.keys(processedColors).length,
                methodUsed: "blendWithAdvancedOKLAB",
              }
            );
          }
        } catch (error) {
          console.warn(
            "[ColorHarmonyEngine] Failed to update Spicetify variables via strategy pattern:",
            error
          );
        }
      }
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Advanced OKLAB blending failed:",
        error
      );
    }

    return processedColors;
  }

  /**
   * Generate advanced CSS variables with comprehensive OKLAB integration
   */
  private generateAdvancedOKLABCSSVariables(
    result: ColorResult
  ): Record<string, string> {
    const cssVariables: Record<string, string> = {};

    try {
      // Add basic processed color variables
      Object.entries(result.processedColors).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          cssVariables[`--sn-processed-${key.toLowerCase()}`] = value;
        }
      });

      // Add enhanced OKLAB variables from processed palette
      Object.entries(this.oklabState.processedPalette).forEach(
        ([cacheKey, oklabResult]) => {
          const [originalColor, presetName] = cacheKey.split("-");
          if (originalColor && presetName) {
            const prefix = `sn-oklab-${presetName.toLowerCase()}`;
            const oklabVars = this.oklabProcessor.generateCSSVariables(
              oklabResult,
              prefix
            );
            Object.assign(cssVariables, oklabVars);
          }
        }
      );

      // Add perceptual gradient variables if available
      if (this.oklabState.perceptualGradientCache.size > 0) {
        const gradientEntries = Array.from(
          this.oklabState.perceptualGradientCache.entries()
        );
        const [gradientKey, gradientStops] = gradientEntries[0] || [];

        if (gradientStops && gradientStops.length > 0) {
          // Create CSS gradient stop variables
          gradientStops.forEach((stop, index) => {
            const percentage = (index / (gradientStops.length - 1)) * 100;
            cssVariables[`--sn-oklab-gradient-stop-${index}`] =
              stop.enhancedHex;
            cssVariables[
              `--sn-oklab-gradient-stop-${index}-rgb`
            ] = `${stop.enhancedRgb.r},${stop.enhancedRgb.g},${stop.enhancedRgb.b}`;
            cssVariables[
              `--sn-oklab-gradient-stop-${index}-pos`
            ] = `${percentage}%`;
          });

          // Create complete gradient string
          const gradientString = gradientStops
            .map((stop, index) => {
              const percentage = (index / (gradientStops.length - 1)) * 100;
              return `${stop.enhancedHex} ${percentage}%`;
            })
            .join(", ");

          cssVariables[
            "--sn-oklab-perceptual-gradient"
          ] = `linear-gradient(135deg, ${gradientString})`;
          cssVariables["--sn-oklab-gradient-stop-count"] =
            gradientStops.length.toString();
        }
      }

      // Add consciousness layer variables for integration with other systems
      if (result.processedColors.EMOTIONAL_BLEND) {
        cssVariables["--sn-consciousness-emotional-color"] =
          result.processedColors.EMOTIONAL_BLEND;
        const emotionalRgb = Year3000Utilities.hexToRgb(
          result.processedColors.EMOTIONAL_BLEND
        );
        if (emotionalRgb) {
          cssVariables[
            "--sn-consciousness-emotional-rgb"
          ] = `${emotionalRgb.r},${emotionalRgb.g},${emotionalRgb.b}`;
        }
      }

      // Add current OKLAB processing state variables
      cssVariables["--sn-oklab-preset-active"] =
        this.oklabState.currentPreset.name;
      cssVariables["--sn-oklab-cache-size"] = Object.keys(
        this.oklabState.processedPalette
      ).length.toString();
      cssVariables["--sn-oklab-last-processing"] =
        this.oklabState.lastProcessingTime.toString();

      if (this.config?.enableDebug) {
        console.log(
          "🎨 [ColorHarmonyEngine] Generated advanced OKLAB CSS variables:",
          {
            totalVariables: Object.keys(cssVariables).length,
            gradientStops: this.oklabState.perceptualGradientCache.size,
            oklabProcessedColors: Object.keys(this.oklabState.processedPalette)
              .length,
          }
        );
      }
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Advanced OKLAB CSS variable generation failed:",
        error
      );
    }

    return cssVariables;
  }

  /**
   * Generate perceptual gradient data using OKLAB interpolation for smooth color transitions
   */
  private generatePerceptualGradientData(result: ColorResult): void {
    try {
      const primaryColor = result.processedColors.PRIMARY;
      const secondaryColor =
        result.processedColors.SECONDARY ||
        result.processedColors.EMOTIONAL_BLEND;

      if (!primaryColor || !this.isValidHex(primaryColor)) {
        return;
      }

      // Determine gradient endpoints
      const startColor = primaryColor;
      const endColor =
        secondaryColor && this.isValidHex(secondaryColor)
          ? secondaryColor
          : this.generateComplementaryColor(primaryColor);

      const gradientKey = `${startColor}-${endColor}-${this.oklabState.currentPreset.name}`;

      // Check cache first
      if (this.oklabState.perceptualGradientCache.has(gradientKey)) {
        return;
      }

      // Generate OKLAB gradient with optimal stop count
      const stopCount = 7; // Optimal for smooth transitions while maintaining performance
      const gradientStops = this.oklabProcessor.generateOKLABGradient(
        startColor,
        endColor,
        stopCount,
        this.oklabState.currentPreset
      );

      // Cache the gradient
      this.oklabState.perceptualGradientCache.set(gradientKey, gradientStops);

      // Limit cache size for memory management
      if (this.oklabState.perceptualGradientCache.size > 10) {
        const firstKey = this.oklabState.perceptualGradientCache
          .keys()
          .next().value;
        if (firstKey) {
          this.oklabState.perceptualGradientCache.delete(firstKey);
        }
      }

      if (this.config?.enableDebug) {
        console.log(
          "🌈 [ColorHarmonyEngine] Generated perceptual gradient data:",
          {
            startColor,
            endColor,
            stopCount,
            preset: this.oklabState.currentPreset.name,
            cacheKey: gradientKey,
            cacheSize: this.oklabState.perceptualGradientCache.size,
          }
        );
      }
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Perceptual gradient generation failed:",
        error
      );
    }
  }

  /**
   * Update advanced harmony metrics with comprehensive performance and quality tracking
   */
  private updateAdvancedHarmonyMetrics(
    result: ColorResult,
    processingTime: number
  ): void {
    try {
      // Color harmony quality metrics
      const primaryColor = result.processedColors.PRIMARY;
      const secondaryColor = result.processedColors.SECONDARY;

      let harmonyScore = 0.5; // Default neutral score

      if (primaryColor && this.isValidHex(primaryColor)) {
        const primaryRgb = Year3000Utilities.hexToRgb(primaryColor);
        if (primaryRgb) {
          // Calculate color vibrancy as a quality metric
          const vibrancy = this.calculateColorVibrancy(primaryRgb);
          harmonyScore = Math.min(1.0, vibrancy * 0.8 + 0.2);
        }
      }

      // Update internal metrics
      const metrics = {
        processingTime,
        harmonyScore,
        oklabProcessedColors: Object.keys(this.oklabState.processedPalette)
          .length,
        perceptualGradientsCached: this.oklabState.perceptualGradientCache.size,
        currentPreset: this.oklabState.currentPreset.name,
        lastUpdate: Date.now(),
      };

      // Store in metadata for external access
      if (result.metadata) {
        result.metadata.advancedHarmonyMetrics = metrics;
      }

      if (this.config?.enableDebug) {
        console.log(
          "📊 [ColorHarmonyEngine] Advanced harmony metrics updated:",
          metrics
        );
      }
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Advanced harmony metrics update failed:",
        error
      );
    }
  }

  // ============================================================================
  // 🔧 UTILITY METHODS FOR ENHANCED OKLAB INTEGRATION
  // ============================================================================

  /**
   * Get preset selection reasoning for debugging
   */
  private getPresetSelectionReason(
    musicData: any,
    context: ColorContext
  ): string {
    if (!musicData) return "No music data available";

    const { energy = 0.5, valence = 0.5 } = musicData;

    if (context.performanceHints?.preferLightweight)
      return "Performance optimization requested";
    if (energy > 0.8 && valence > 0.7) return "High energy + positive valence";
    if (energy > 0.7 && valence < 0.4) return "High energy + negative valence";
    if (energy < 0.3) return "Low energy music";

    return "Standard balanced processing";
  }

  /**
   * Generate complementary color for gradient endpoints
   */
  private generateComplementaryColor(hexColor: string): string {
    try {
      const rgb = Year3000Utilities.hexToRgb(hexColor);
      if (!rgb) return hexColor;

      // Convert to HSL for hue manipulation
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

      // Rotate hue by 180 degrees for complement
      const complementHue = (hsl.h + 180) % 360;

      // Convert back to RGB
      const complementRgb = this.hslToRgb(complementHue, hsl.s, hsl.l);

      return Year3000Utilities.rgbToHex(
        complementRgb.r,
        complementRgb.g,
        complementRgb.b
      );
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Complementary color generation failed:",
        error
      );
      return hexColor;
    }
  }

  /**
   * Calculate color vibrancy metric (0-1)
   */
  private calculateColorVibrancy(rgb: {
    r: number;
    g: number;
    b: number;
  }): number {
    // Calculate saturation and lightness components
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const delta = max - min;

    if (max === 0) return 0;

    const saturation = delta / max;
    const lightness = max / 255;

    // Vibrancy is high when saturation is high and lightness is moderate
    const lightnessFactor = 1 - Math.abs(lightness - 0.5) * 2; // Peak at 0.5 lightness

    return saturation * lightnessFactor;
  }

  /**
   * Validate hex color format
   */
  private isValidHex(hex: string): boolean {
    return /^#[0-9A-Fa-f]{6}$/.test(hex);
  }

  /**
   * Convert RGB to HSL color space
   */
  private rgbToHsl(
    r: number,
    g: number,
    b: number
  ): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s, l };
  }

  /**
   * Convert HSL to RGB color space
   */
  private hslToRgb(
    h: number,
    s: number,
    l: number
  ): { r: number; g: number; b: number } {
    h /= 360;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // ============================================================================
  // GENRE AESTHETIC INTELLIGENCE METHODS
  // ============================================================================

  /**
   * Analyze current music for genre-specific aesthetic characteristics
   */
  private async analyzeGenreAesthetics(
    musicData: any,
    albumArtColors?: Record<string, string>
  ): Promise<{
    genre: MusicGenre;
    confidence: number;
    characteristics: GenreCharacteristics;
    visualStyle: GenreVisualStyle;
  } | null> {
    try {
      if (!this.genreGradientEvolution) {
        return null;
      }

      // Get current genre from GenreGradientEvolution
      const currentGenre = this.genreGradientEvolution.getCurrentGenre();
      const genreConfidence = this.genreGradientEvolution.getGenreConfidence();

      // Only proceed if we have decent confidence
      if (genreConfidence < 0.3) {
        return null;
      }

      // Get genre characteristics and visual style
      const genreCharacteristics =
        this.genreGradientEvolution.getGenreCharacteristics(currentGenre);
      const genreVisualStyle =
        this.genreGradientEvolution.getGenreVisualStyle(currentGenre);

      // 🎨 PHASE 2.1: Album Color Enhancement - Use album colors to validate and enhance genre detection
      let albumGenreHarmonyScore = 1.0; // Default confidence multiplier
      let genreValidatedByAlbumColors = genreConfidence;

      if (albumArtColors && Object.keys(albumArtColors).length > 0) {
        try {
          // Analyze album color harmony with detected genre
          const albumColorAnalysis = this._analyzeAlbumGenreHarmony(
            albumArtColors,
            currentGenre,
            genreCharacteristics
          );
          albumGenreHarmonyScore = albumColorAnalysis.harmonyScore;

          // Adjust genre confidence based on album color validation
          genreValidatedByAlbumColors =
            genreConfidence * albumGenreHarmonyScore;

          if (this.config.enableDebug) {
            console.log(
              `🎨 [ColorHarmonyEngine] Album-Genre harmony analysis:`,
              {
                genre: currentGenre,
                originalConfidence: (genreConfidence * 100).toFixed(1) + "%",
                harmonyScore: (albumGenreHarmonyScore * 100).toFixed(1) + "%",
                validatedConfidence:
                  (genreValidatedByAlbumColors * 100).toFixed(1) + "%",
                albumColorCount: Object.keys(albumArtColors).length,
              }
            );
          }
        } catch (error) {
          console.warn(
            "[ColorHarmonyEngine] Album-genre harmony analysis failed:",
            error
          );
        }
      }

      // Update our internal genre state with album-validated confidence
      this.genreState.currentGenre = currentGenre;
      this.genreState.genreConfidence = genreValidatedByAlbumColors; // Use album-enhanced confidence
      this.genreState.lastGenreUpdate = Date.now();

      // Add to genre history with album-enhanced confidence
      this.genreState.genreHistory.unshift({
        genre: currentGenre,
        confidence: genreValidatedByAlbumColors, // Use album-enhanced confidence
        timestamp: Date.now(),
      });

      // Keep history manageable
      if (this.genreState.genreHistory.length > 10) {
        this.genreState.genreHistory = this.genreState.genreHistory.slice(
          0,
          10
        );
      }

      if (this.config.enableDebug) {
        console.log(
          `🎶 [ColorHarmonyEngine] Genre aesthetic analysis: ${currentGenre} (${(
            genreValidatedByAlbumColors * 100
          ).toFixed(1)}% album-validated confidence)`
        );
      }

      return {
        genre: currentGenre,
        confidence: genreValidatedByAlbumColors, // Return album-enhanced confidence
        characteristics: genreCharacteristics,
        visualStyle: genreVisualStyle,
      };
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Error analyzing genre aesthetics:",
        error
      );
      return null;
    }
  }

  /**
   * Apply genre-specific characteristics to OKLAB color preset
   */
  private applyGenreColorAesthetics(
    basePreset: EnhancementPreset,
    genreData: {
      genre: MusicGenre;
      confidence: number;
      characteristics: GenreCharacteristics;
      visualStyle: GenreVisualStyle;
    }
  ): EnhancementPreset {
    const { characteristics, visualStyle, confidence } = genreData;

    // Create a genre-adjusted preset based on the base preset
    const genreAdjustedPreset: EnhancementPreset = {
      ...basePreset,
      name: `${basePreset.name}-${genreData.genre}`,
      description: `${basePreset.description} with ${genreData.genre} aesthetic characteristics`,
    };

    // Apply genre influence based on confidence and user settings
    const genreInfluence = confidence * this.genreState.genreInfluenceIntensity;

    // Adjust chroma boost based on genre characteristics
    if (characteristics.saturation > 0.7) {
      // High saturation genres (electronic, pop) - boost chroma
      genreAdjustedPreset.chromaBoost = Math.min(
        2.0,
        basePreset.chromaBoost + 0.3 * genreInfluence
      );
    } else if (characteristics.saturation < 0.3) {
      // Low saturation genres (ambient, folk) - reduce chroma for natural feel
      genreAdjustedPreset.chromaBoost = Math.max(
        0.8,
        basePreset.chromaBoost - 0.2 * genreInfluence
      );
    }

    // Adjust vibrant threshold based on genre complexity
    if (characteristics.harmonicComplexity > 0.7) {
      // Complex genres (jazz, classical) - lower threshold for more vibrancy
      genreAdjustedPreset.vibrantThreshold = Math.max(
        0.05,
        basePreset.vibrantThreshold - 0.05 * genreInfluence
      );
    } else if (characteristics.harmonicComplexity < 0.3) {
      // Simple genres (pop, house) - higher threshold for cleaner colors
      genreAdjustedPreset.vibrantThreshold = Math.min(
        0.2,
        basePreset.vibrantThreshold + 0.03 * genreInfluence
      );
    }

    // Adjust lightness based on emotional range and energy
    if (
      characteristics.emotionalRange > 0.7 &&
      characteristics.organicness > 0.6
    ) {
      // Emotionally rich organic genres (folk, blues) - natural lightness
      genreAdjustedPreset.lightnessBoost = Math.max(
        0.9,
        basePreset.lightnessBoost - 0.1 * genreInfluence
      );
    } else if (characteristics.artificialProcessing > 0.7) {
      // Electronic genres - can handle higher lightness
      genreAdjustedPreset.lightnessBoost = Math.min(
        1.4,
        basePreset.lightnessBoost + 0.2 * genreInfluence
      );
    }

    // Adjust shadow reduction based on genre contrast preferences
    if (visualStyle.contrastLevel > 0.7) {
      // High contrast genres (metal, rock) - more pronounced shadows
      genreAdjustedPreset.shadowReduction = Math.max(
        0.1,
        basePreset.shadowReduction - 0.1 * genreInfluence
      );
    } else if (characteristics.organicness > 0.6) {
      // Organic genres (folk, acoustic) - softer shadows
      genreAdjustedPreset.shadowReduction = Math.min(
        0.5,
        basePreset.shadowReduction + 0.1 * genreInfluence
      );
    }

    if (this.config.enableDebug) {
      console.log(
        `🎨 [ColorHarmonyEngine] Applied ${genreData.genre} aesthetics to ${basePreset.name} preset:`,
        {
          chromaBoost: `${basePreset.chromaBoost} → ${genreAdjustedPreset.chromaBoost}`,
          lightnessBoost: `${basePreset.lightnessBoost} → ${genreAdjustedPreset.lightnessBoost}`,
          vibrantThreshold: `${basePreset.vibrantThreshold} → ${genreAdjustedPreset.vibrantThreshold}`,
          genreInfluence: `${(genreInfluence * 100).toFixed(1)}%`,
        }
      );
    }

    return genreAdjustedPreset;
  }

  /**
   * 🎨 PHASE 2.1: Analyze album color harmony with detected genre for enhanced validation
   */
  private _analyzeAlbumGenreHarmony(
    albumArtColors: Record<string, string>,
    genre: MusicGenre,
    genreCharacteristics: any
  ): { harmonyScore: number; explanation: string } {
    try {
      let harmonyScore = 1.0; // Default confidence multiplier
      let explanationParts: string[] = [];

      // Convert album colors to HSL for color psychology analysis
      const albumHslColors = Object.entries(albumArtColors)
        .map(([role, hex]) => {
          const rgb = this.utils.hexToRgb(hex);
          return rgb ? this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
        })
        .filter((hsl) => hsl !== null);

      if (albumHslColors.length === 0) {
        return {
          harmonyScore: 1.0,
          explanation: "No valid album colors found",
        };
      }

      // Analyze average saturation vs genre expectations
      const avgSaturation =
        albumHslColors.reduce((sum, hsl) => sum + hsl!.s, 0) /
        albumHslColors.length;
      const expectedSaturation = genreCharacteristics.saturation || 0.5;
      const saturationDiff = Math.abs(avgSaturation / 100 - expectedSaturation);

      if (saturationDiff < 0.2) {
        harmonyScore *= 1.1; // Boost confidence for matching saturation
        explanationParts.push(
          `album saturation matches genre (±${(saturationDiff * 100).toFixed(
            1
          )}%)`
        );
      } else if (saturationDiff > 0.4) {
        harmonyScore *= 0.85; // Reduce confidence for mismatched saturation
        explanationParts.push(
          `album saturation differs from genre expectations (${(
            saturationDiff * 100
          ).toFixed(1)}% diff)`
        );
      }

      // Analyze color temperature vs genre warmth
      const avgHue =
        albumHslColors.reduce((sum, hsl) => sum + hsl!.h, 0) /
        albumHslColors.length;
      const isWarmAlbum =
        (avgHue >= 15 && avgHue <= 45) || (avgHue >= 315 && avgHue <= 345); // Orange/red ranges
      const isCoolAlbum = avgHue >= 180 && avgHue <= 270; // Blue/cyan ranges

      const expectedWarmth = genreCharacteristics.energyLevel || 0.5;
      if (expectedWarmth > 0.6 && isWarmAlbum) {
        harmonyScore *= 1.15; // High-energy genre with warm album colors
        explanationParts.push("warm album colors match high-energy genre");
      } else if (expectedWarmth < 0.4 && isCoolAlbum) {
        harmonyScore *= 1.1; // Low-energy genre with cool album colors
        explanationParts.push("cool album colors match low-energy genre");
      } else if (
        (expectedWarmth > 0.6 && isCoolAlbum) ||
        (expectedWarmth < 0.4 && isWarmAlbum)
      ) {
        harmonyScore *= 0.9; // Color temperature mismatch
        explanationParts.push(
          "album color temperature differs from genre energy"
        );
      }

      // Analyze brightness vs genre characteristics
      const avgLightness =
        albumHslColors.reduce((sum, hsl) => sum + hsl!.l, 0) /
        albumHslColors.length;
      const isDarkAlbum = avgLightness < 40;
      const isBrightAlbum = avgLightness > 70;

      if (
        genre.includes("metal") ||
        genre.includes("goth") ||
        genre.includes("dark")
      ) {
        if (isDarkAlbum) {
          harmonyScore *= 1.2; // Dark album fits dark genre
          explanationParts.push("dark album aesthetic matches genre");
        } else if (isBrightAlbum) {
          harmonyScore *= 0.8; // Bright album conflicts with dark genre
          explanationParts.push(
            "bright album conflicts with dark genre aesthetic"
          );
        }
      } else if (
        genre.includes("pop") ||
        genre.includes("dance") ||
        genre.includes("electronic")
      ) {
        if (isBrightAlbum) {
          harmonyScore *= 1.15; // Bright album fits energetic genre
          explanationParts.push(
            "bright album aesthetic matches energetic genre"
          );
        }
      }

      // Analyze color diversity vs genre complexity
      const colorHues = albumHslColors.map((hsl) => hsl!.h);
      const hueSpread = Math.max(...colorHues) - Math.min(...colorHues);
      const isMonochromatic = hueSpread < 30;
      const isPolychromatic = hueSpread > 120;

      const expectedComplexity = genreCharacteristics.harmonicComplexity || 0.5;
      if (expectedComplexity > 0.7 && isPolychromatic) {
        harmonyScore *= 1.1; // Complex genre with diverse colors
        explanationParts.push("diverse album colors match complex genre");
      } else if (expectedComplexity < 0.3 && isMonochromatic) {
        harmonyScore *= 1.1; // Simple genre with unified colors
        explanationParts.push("unified album colors match simple genre");
      }

      // Clamp final score to reasonable range
      harmonyScore = Math.max(0.7, Math.min(1.3, harmonyScore));

      const explanation =
        explanationParts.length > 0
          ? explanationParts.join("; ")
          : "album colors analyzed for genre harmony";

      return {
        harmonyScore,
        explanation,
      };
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Album-genre harmony analysis error:",
        error
      );
      return {
        harmonyScore: 1.0,
        explanation: "harmony analysis failed, using default confidence",
      };
    }
  }

  /**
   * 🎨 PHASE 2.2: Get album art influence setting (0-1) for user control
   */
  private getAlbumArtInfluenceSetting(): number {
    // Default to 50% album influence (can be exposed to settings later)
    // For now, use a reasonable default that provides noticeable but not overwhelming album influence
    return 0.5; // TODO: Expose this in SettingsManager for user control
  }

  /**
   * 🎨 PHASE 2.2: Apply direct album color blending using OKLAB for perceptual uniformity
   */
  private async _applyDirectAlbumColorBlending(
    processedColors: Record<string, string>,
    albumArtColors: Record<string, string>,
    albumInfluence: number,
    oklabPreset: any
  ): Promise<Record<string, string>> {
    const blendedColors: Record<string, string> = {};

    try {
      // Get the dominant album colors for blending
      const albumDominantColors =
        this._extractDominantAlbumColors(albumArtColors);

      if (albumDominantColors.length === 0) {
        return {}; // No valid album colors to blend
      }

      // Apply album color blending to main color categories
      const blendTargets = [
        "PRIMARY",
        "VIBRANT",
        "PROMINENT",
        "VIBRANT_NON_ALARMING",
      ];

      for (const colorKey of blendTargets) {
        const processedColor = processedColors[colorKey];
        if (!processedColor || !this.isValidHex(processedColor)) {
          continue;
        }

        try {
          // Select the most harmonious album color for this processed color
          const bestAlbumColor = this._selectHarmoniousAlbumColor(
            processedColor,
            albumDominantColors
          );

          if (bestAlbumColor) {
            // Use OKLAB interpolation for perceptually uniform blending
            const blendResult = this.oklabProcessor.interpolateOKLAB(
              processedColor,
              bestAlbumColor,
              albumInfluence * 0.6, // Scale down for subtle but noticeable effect
              oklabPreset
            );

            blendedColors[colorKey] = blendResult.enhancedHex;

            if (this.config?.enableDebug) {
              console.log(
                `🎨 [ColorHarmonyEngine] Album-blended ${colorKey}:`,
                {
                  original: processedColor,
                  albumColor: bestAlbumColor,
                  blended: blendResult.enhancedHex,
                  blendFactor: (albumInfluence * 0.6).toFixed(2),
                }
              );
            }
          }
        } catch (error) {
          console.warn(
            `[ColorHarmonyEngine] Album blending failed for ${colorKey}:`,
            error
          );
        }
      }

      // Create additional album-influenced accent colors
      if (albumDominantColors.length > 0 && albumInfluence > 0.3) {
        try {
          // Create ALBUM_ACCENT color from the most vibrant album color
          const mostVibrantAlbum =
            this._selectMostVibrantColor(albumDominantColors);
          if (mostVibrantAlbum) {
            const albumAccentResult = this.oklabProcessor.processColor(
              mostVibrantAlbum,
              oklabPreset
            );
            blendedColors["ALBUM_ACCENT"] = albumAccentResult.enhancedHex;

            if (this.config?.enableDebug) {
              console.log("🎨 [ColorHarmonyEngine] Created ALBUM_ACCENT:", {
                source: mostVibrantAlbum,
                enhanced: albumAccentResult.enhancedHex,
              });
            }
          }
        } catch (error) {
          console.warn(
            "[ColorHarmonyEngine] Album accent creation failed:",
            error
          );
        }
      }

      return blendedColors;
    } catch (error) {
      console.error(
        "[ColorHarmonyEngine] Direct album color blending error:",
        error
      );
      return {};
    }
  }

  /**
   * 🎨 PHASE 2.2: Extract dominant colors from album art for blending
   */
  private _extractDominantAlbumColors(
    albumArtColors: Record<string, string>
  ): string[] {
    const dominantColors: string[] = [];

    // Priority order for album color extraction
    const colorPriorities = [
      "VIBRANT",
      "DOMINANT",
      "PRIMARY",
      "PROMINENT",
      "LIGHT_VIBRANT",
      "DARK_VIBRANT",
    ];

    for (const priority of colorPriorities) {
      const color = albumArtColors[priority];
      if (color && this.isValidHex(color)) {
        dominantColors.push(color);
      }
    }

    // Also include any other valid colors if we have few dominant ones
    if (dominantColors.length < 3) {
      Object.values(albumArtColors).forEach((color) => {
        if (
          color &&
          this.isValidHex(color) &&
          !dominantColors.includes(color)
        ) {
          dominantColors.push(color);
        }
      });
    }

    return dominantColors.slice(0, 5); // Limit to 5 colors for performance
  }

  /**
   * 🎨 PHASE 2.2: Select the most harmonious album color for blending with a processed color
   */
  private _selectHarmoniousAlbumColor(
    processedColor: string,
    albumColors: string[]
  ): string | null {
    if (albumColors.length === 0) return null;

    try {
      const processedRgb = this.utils.hexToRgb(processedColor);
      if (!processedRgb) return albumColors[0] || null; // Fallback to first album color

      const processedHsl = this.utils.rgbToHsl(
        processedRgb.r,
        processedRgb.g,
        processedRgb.b
      );
      let bestColor = albumColors[0] || null;
      let bestHarmonyScore = 0;

      for (const albumColor of albumColors) {
        const albumRgb = this.utils.hexToRgb(albumColor);
        if (!albumRgb) continue;

        const albumHsl = this.utils.rgbToHsl(
          albumRgb.r,
          albumRgb.g,
          albumRgb.b
        );

        // Calculate harmony based on complementary/analogous relationships
        const hueDiff = Math.abs(processedHsl.h - albumHsl.h);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);

        // Score based on color harmony rules
        let harmonyScore = 0;
        if (normalizedHueDiff < 30) {
          harmonyScore = 0.9; // Analogous colors
        } else if (normalizedHueDiff > 150 && normalizedHueDiff < 210) {
          harmonyScore = 0.8; // Complementary colors
        } else if (normalizedHueDiff > 90 && normalizedHueDiff < 150) {
          harmonyScore = 0.6; // Triadic colors
        } else {
          harmonyScore = 0.4; // Other relationships
        }

        // Bonus for similar saturation levels
        const saturationDiff = Math.abs(processedHsl.s - albumHsl.s);
        if (saturationDiff < 20) {
          harmonyScore += 0.1;
        }

        if (harmonyScore > bestHarmonyScore) {
          bestHarmonyScore = harmonyScore;
          bestColor = albumColor;
        }
      }

      return bestColor;
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Harmonious color selection failed:",
        error
      );
      return albumColors[0] || null; // Fallback to first album color
    }
  }

  /**
   * 🎨 PHASE 2.2: Select the most vibrant color from album colors
   */
  private _selectMostVibrantColor(albumColors: string[]): string | null {
    if (albumColors.length === 0) return null;

    try {
      let mostVibrant = albumColors[0] || null;
      let highestVibrancy = 0;

      for (const color of albumColors) {
        const rgb = this.utils.hexToRgb(color);
        if (!rgb) continue;

        const hsl = this.utils.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Calculate vibrancy as combination of saturation and lightness
        const vibrancy = (hsl.s / 100) * (1 - Math.abs(hsl.l - 50) / 50);

        if (vibrancy > highestVibrancy) {
          highestVibrancy = vibrancy;
          mostVibrant = color;
        }
      }

      return mostVibrant;
    } catch (error) {
      console.warn(
        "[ColorHarmonyEngine] Most vibrant color selection failed:",
        error
      );
      return albumColors[0] || null;
    }
  }

  /**
   * 🎨 PHASE 2.3: Analyze genre indicators from color psychology characteristics
   */
  private _analyzeGenreIndicatorsFromColors(colorPsychology: any): {
    electronicLikelihood: number;
    organicLikelihood: number;
    metalHardcoreLikelihood: number;
    popCommercialLikelihood: number;
    jazzClassicalLikelihood: number;
    folkAcousticLikelihood: number;
  } {
    const {
      warmth,
      coolness,
      saturation,
      brightness,
      darkness,
      harmony,
      dominantHue,
      emotionalIntensity,
    } = colorPsychology;

    // Electronic/Synthetic: High saturation, cool colors, artificial/bright palettes
    const electronicLikelihood = Math.min(
      1.0,
      saturation * 0.4 +
        coolness * 0.3 +
        (brightness > 0.7 || darkness < 0.3 ? 0.2 : 0) +
        (dominantHue >= 180 && dominantHue <= 270 ? 0.1 : 0) // Blues/cyans
    );

    // Organic/Acoustic: Natural colors, earth tones, moderate saturation
    const organicLikelihood = Math.min(
      1.0,
      (warmth > coolness ? warmth : 0) * 0.3 +
        (saturation >= 0.3 && saturation <= 0.7 ? 0.3 : 0) +
        (brightness >= 0.4 && brightness <= 0.7 ? 0.2 : 0) +
        harmony * 0.2 // Natural colors tend to be harmonious
    );

    // Metal/Hardcore: Dark colors, high contrast, reds/blacks
    const metalHardcoreLikelihood = Math.min(
      1.0,
      darkness * 0.4 +
        emotionalIntensity * 0.3 +
        ((dominantHue >= 0 && dominantHue <= 30) || dominantHue >= 330
          ? 0.2
          : 0) + // Reds
        (saturation > 0.6 || saturation < 0.2 ? 0.1 : 0) // High contrast
    );

    // Pop/Commercial: Bright, appealing colors, high saturation
    const popCommercialLikelihood = Math.min(
      1.0,
      (brightness > 0.6 ? brightness * 0.3 : 0) +
        saturation * 0.3 +
        (warmth > 0.5 ? warmth * 0.2 : 0) +
        (emotionalIntensity > 0.5 ? 0.2 : 0)
    );

    // Jazz/Classical: Sophisticated color choices, good harmony, moderate values
    const jazzClassicalLikelihood = Math.min(
      1.0,
      harmony * 0.4 +
        (saturation >= 0.4 && saturation <= 0.8 ? 0.3 : 0) +
        (brightness >= 0.3 && brightness <= 0.8 ? 0.2 : 0) +
        ((warmth + coolness) / 2) * 0.1 // Balanced temperature
    );

    // Folk/Acoustic: Earth tones, natural harmony, warm colors
    const folkAcousticLikelihood = Math.min(
      1.0,
      warmth * 0.4 +
        (saturation >= 0.2 && saturation <= 0.6 ? 0.3 : 0) +
        harmony * 0.2 +
        (dominantHue >= 15 && dominantHue <= 60 ? 0.1 : 0) // Earth tones (oranges/browns)
    );

    return {
      electronicLikelihood,
      organicLikelihood,
      metalHardcoreLikelihood,
      popCommercialLikelihood,
      jazzClassicalLikelihood,
      folkAcousticLikelihood,
    };
  }

  /**
   * 🎨 PHASE 2.3: Analyze artist consciousness through color sophistication and intention
   */
  private _analyzeArtistConsciousness(
    colors: string[],
    metrics: any
  ): {
    visualSophistication: number;
    artisticIntention: number;
    culturalIndicators: string[];
    emotionalDepth: number;
  } {
    const {
      avgSaturation,
      avgBrightness,
      harmony,
      emotionalIntensity,
      colorCount,
    } = metrics;

    // Visual Sophistication: Based on color harmony, complexity, and balance
    const visualSophistication = Math.min(
      1.0,
      harmony * 0.4 + // Good color relationships indicate sophistication
        (colorCount > 2 && colorCount <= 5 ? 0.3 : 0.1) + // Appropriate complexity
        (avgSaturation >= 0.3 && avgSaturation <= 0.8 ? 0.2 : 0) + // Balanced saturation
        (avgBrightness >= 0.2 && avgBrightness <= 0.8 ? 0.1 : 0) // Appropriate brightness range
    );

    // Artistic Intention: How deliberate the color choices appear
    const artisticIntention = Math.min(
      1.0,
      harmony * 0.5 + // Harmonious colors suggest intention
        emotionalIntensity * 0.3 + // Strong emotional content suggests purpose
        (colorCount >= 2 && colorCount <= 4 ? 0.2 : 0) // Focused palette suggests curation
    );

    // Cultural Indicators: Detect cultural/regional patterns
    const culturalIndicators: string[] = [];

    // Check for specific cultural color patterns
    if (avgSaturation > 0.8 && emotionalIntensity > 0.7) {
      culturalIndicators.push("high-energy-culture"); // Electronic, pop cultures
    }
    if (harmony > 0.7 && avgSaturation < 0.6) {
      culturalIndicators.push("minimalist-aesthetic"); // Nordic, Japanese aesthetics
    }
    if (avgBrightness < 0.3 && emotionalIntensity > 0.6) {
      culturalIndicators.push("dark-artistic"); // Gothic, metal, alternative
    }
    if (avgBrightness > 0.7 && avgSaturation > 0.6) {
      culturalIndicators.push("commercial-pop"); // Mainstream, commercial
    }

    // Emotional Depth: How much emotional expression is conveyed through colors
    const emotionalDepth = Math.min(
      1.0,
      emotionalIntensity * 0.5 +
        (avgSaturation > 0.4 ? 0.2 : 0) + // Saturated colors convey more emotion
        (harmony > 0.5 ? 0.2 : 0) + // Harmonious colors suggest emotional maturity
        (colorCount >= 3 ? 0.1 : 0) // Multiple colors allow for emotional complexity
    );

    return {
      visualSophistication,
      artisticIntention,
      culturalIndicators,
      emotionalDepth,
    };
  }
}
