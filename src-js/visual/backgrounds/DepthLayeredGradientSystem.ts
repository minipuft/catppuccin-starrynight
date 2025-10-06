/**
 * DepthLayeredGradientSystem - Infinite Space Illusion System
 * Part of the Year 3000 System visual pipeline
 *
 * Creates depth-layered gradients that give the illusion of infinite space behind the interface
 * - Multi-layer gradient system with parallax scrolling
 * - CSS transforms for 3D depth perception
 * - Performance-aware layering with automatic quality scaling
 * - Extends existing 6-layer visual effects system
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { EmotionalGradientMapper } from "@/audio/EmotionalGradientMapper";
import { GenreProfileManager } from "@/audio/GenreProfileManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { unifiedEventBus, type EventData } from "@/core/events/EventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import type { HealthCheckResult } from "@/types/systems";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type {
  VisualEffectsCoordinator,
  BackgroundSystemParticipant,
  VisualEffectState,
} from "../effects/VisualEffectsCoordinator";

interface DepthLayer {
  id: string;
  element: HTMLElement;
  depth: number;
  parallaxFactor: number;
  opacityRange: [number, number];
  scaleRange: [number, number];
  rotationSpeed: number;
  colorShift: number;
  blurAmount: number;
  animationPhase: number;
  enabled: boolean;

  // LERP smoothing properties for framerate-independent animations
  currentOffsetY: number;
  targetOffsetY: number;
  currentOpacity: number;
  targetOpacity: number;
  currentBlur: number;
  targetBlur: number;
  currentHueRotate: number;
  targetHueRotate: number;
  currentScale: number;
  targetScale: number;
}

interface MusicalVisualEffectsSettings {
  enabled: boolean;
  activityLevel: number; // 0-1 overall activity intensity
  temporalMemory: number; // 0-1 how much past colors influence current
  harmonicSensitivity: number; // 0-1 frequency response sensitivity
  flowDynamics: number; // 0-1 smooth flow pattern intensity
  stellarDensity: number; // 0-1 stellar phenomena density
  dimensionalDepth: number; // 1-5 layer depth perception level
}

interface DepthSettings {
  enabled: boolean;
  layerCount: number;
  maxDepth: number;
  parallaxStrength: number;
  depthFogIntensity: number;
  infiniteScrolling: boolean;
  qualityLevel: "low" | "medium" | "high";
  performanceMode: boolean;
  musicalVisualEffects: MusicalVisualEffectsSettings;
}

interface InfiniteSpaceMetrics {
  totalLayers: number;
  visibleLayers: number;
  averageDepth: number;
  parallaxRange: number;
  renderTime: number;
  memoryUsage: number;
}

/**
 * DepthLayeredGradientSystem creates infinite space illusion through depth layers
 * - Multiple parallax layers with varying depths
 * - Fog effect for depth perception
 * - Performance-optimized layer management
 * - Music-responsive depth animation
 */
export class DepthLayeredGradientSystem
  extends BaseVisualSystem
  implements BackgroundSystemParticipant
{
  private depthSettings: DepthSettings;
  private depthLayers: Map<string, DepthLayer>;
  private visualEffectsLayers: Map<string, HTMLDivElement>;
  private cssVariableController: CSSVariableWriter | null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private emotionalGradientMapper: EmotionalGradientMapper | null = null;
  private genreProfileManager: GenreProfileManager | null = null;
  private containerElement: HTMLElement | null = null;
  private backgroundContainer: HTMLElement | null = null;
  
  // Musical visual effects spectral data
  private spectralData = {
    bassResponse: 0,
    midResponse: 0,
    trebleResponse: 0,
    vocalPresence: 0,
  };

  // ✅ RAF LOOP CONSOLIDATION: Removed animationFrameId (coordinator manages animation)
  private lastAnimationTime = 0;
  private scrollY = 0;
  private scrollX = 0;
  private deviceCapabilities: DeviceCapabilityDetector;
  private performanceMetrics: InfiniteSpaceMetrics;

  private boundScrollHandler: ((event: Event) => void) | null = null;
  private boundResizeHandler: ((event: Event) => void) | null = null;
  private eventSubscriptionIds: string[] = [];

  // Visual effects coordinator integration
  private visualEffectsCoordinator: VisualEffectsCoordinator | null =
    null;
  private currentVisualEffectState: VisualEffectState | null = null;

  // LERP smoothing half-life values (in seconds) for framerate-independent animations
  private lerpHalfLifeValues = {
    parallaxOffset: 0.15, // Smooth parallax movement
    opacity: 0.2, // Gentle opacity transitions
    blur: 0.25, // Smooth blur changes
    hueRotate: 0.3, // Gradual color shifts
    scale: 0.18, // Smooth scale transitions
  };

  // Make systemName publicly accessible for the interface
  public override readonly systemName: string = "DepthLayeredGradientSystem";

  private layerTemplates = {
    // Enhanced cosmic blob with multiple bubble formations
    cosmic: {
      gradient:
        "radial-gradient(ellipse 60% 40% at 25% 30%, rgba(88, 91, 112, 0.9) 0%, rgba(49, 50, 68, 0.5) 40%, transparent 80%), radial-gradient(ellipse 40% 60% at 75% 70%, rgba(49, 50, 68, 0.7) 0%, rgba(30, 30, 46, 0.3) 50%, transparent 85%), radial-gradient(circle 30% at 50% 50%, rgba(88, 91, 112, 0.4) 0%, transparent 70%)",
      animation: "cosmic-drift",
      duration: "120s",
    },
    // Enhanced void with deep bubble patterns
    void: {
      gradient:
        "radial-gradient(ellipse 50% 35% at 40% 25%, rgba(30, 30, 46, 0.95) 0%, rgba(49, 50, 68, 0.7) 35%, transparent 90%), radial-gradient(ellipse 35% 50% at 65% 75%, rgba(49, 50, 68, 0.8) 0%, rgba(88, 91, 112, 0.4) 45%, transparent 85%), radial-gradient(circle 25% at 20% 80%, rgba(30, 30, 46, 0.6) 0%, transparent 80%)",
      animation: "void-expansion",
      duration: "480s",
    },
    // Multi-blob formation with dynamic positioning
    multiBlobPrimary: {
      gradient:
        "radial-gradient(circle 20% at 15% 20%, rgba(203, 166, 247, 0.6) 0%, rgba(203, 166, 247, 0.2) 50%, transparent 70%), radial-gradient(circle 25% at 45% 60%, rgba(245, 194, 231, 0.5) 0%, rgba(245, 194, 231, 0.15) 45%, transparent 75%), radial-gradient(circle 18% at 75% 35%, rgba(137, 180, 250, 0.55) 0%, rgba(137, 180, 250, 0.18) 48%, transparent 72%), radial-gradient(circle 15% at 85% 85%, rgba(203, 166, 247, 0.4) 0%, transparent 65%)",
      animation: "multi-blob-primary",
      duration: "200s",
    },
    // Multi-blob secondary layer with different positioning
    multiBlobSecondary: {
      gradient:
        "radial-gradient(circle 22% at 30% 75%, rgba(250, 179, 135, 0.5) 0%, rgba(250, 179, 135, 0.12) 50%, transparent 75%), radial-gradient(circle 28% at 70% 25%, rgba(166, 227, 161, 0.45) 0%, rgba(166, 227, 161, 0.1) 48%, transparent 78%), radial-gradient(circle 16% at 10% 50%, rgba(245, 194, 231, 0.52) 0%, rgba(245, 194, 231, 0.15) 46%, transparent 70%), radial-gradient(circle 20% at 90% 60%, rgba(137, 180, 250, 0.4) 0%, transparent 68%)",
      animation: "multi-blob-secondary",
      duration: "280s",
    },
    // Large smooth blob formations
    smoothBubbles: {
      gradient:
        "radial-gradient(ellipse 45% 35% at 35% 40%, rgba(203, 166, 247, 0.4) 0%, rgba(203, 166, 247, 0.1) 60%, transparent 90%), radial-gradient(ellipse 35% 45% at 70% 65%, rgba(137, 180, 250, 0.35) 0%, rgba(137, 180, 250, 0.08) 65%, transparent 95%), radial-gradient(circle 25% at 25% 75%, rgba(245, 194, 231, 0.3) 0%, transparent 80%), radial-gradient(ellipse 20% 30% at 80% 20%, rgba(250, 179, 135, 0.25) 0%, transparent 75%)",
      animation: "smooth-bubble-flow",
      duration: "320s",
    },
    // Nebula with enhanced blob-like structure
    nebula: {
      gradient:
        "conic-gradient(from 45deg, rgba(203, 166, 247, 0.3) 0%, rgba(245, 194, 231, 0.2) 25%, rgba(250, 179, 135, 0.1) 50%, rgba(166, 227, 161, 0.2) 75%, rgba(203, 166, 247, 0.3) 100%)",
      animation: "nebula-flow",
      duration: "180s",
    },
    // Stellar motion enhanced
    stellar: {
      gradient:
        "linear-gradient(45deg, rgba(137, 180, 250, 0.2) 0%, rgba(203, 166, 247, 0.1) 25%, rgba(245, 194, 231, 0.2) 50%, rgba(250, 179, 135, 0.1) 75%, rgba(166, 227, 161, 0.2) 100%)",
      animation: "stellar-motion",
      duration: "240s",
    },
    // Dimensional shift enhanced
    dimensional: {
      gradient:
        "linear-gradient(135deg, rgba(137, 180, 250, 0.1) 0%, rgba(203, 166, 247, 0.2) 20%, rgba(245, 194, 231, 0.1) 40%, rgba(250, 179, 135, 0.2) 60%, rgba(166, 227, 161, 0.1) 80%, rgba(137, 180, 250, 0.2) 100%)",
      animation: "dimensional-shift",
      duration: "360s",
    },
  };

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService);

    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;

    // Get visual effects coordinator from year3000System if available
    this.visualEffectsCoordinator =
      year3000System?.backgroundConsciousnessChoreographer || null;

    // CSS Variable Controller will be injected by VisualSystemFacade
    this.cssVariableController = null;
    this.deviceCapabilities = new DeviceCapabilityDetector();
    this.depthLayers = new Map();
    this.visualEffectsLayers = new Map();

    // Initialize settings
    this.depthSettings = {
      enabled: true,
      layerCount: 6,
      maxDepth: 1000,
      parallaxStrength: 0.5,
      depthFogIntensity: 0.7,
      infiniteScrolling: true,
      qualityLevel: "medium",
      performanceMode: false,
      musicalVisualEffects: {
        enabled: true,
        activityLevel: 0.7,
        temporalMemory: 0.3,
        harmonicSensitivity: 0.6,
        flowDynamics: 0.4,
        stellarDensity: 0.5,
        dimensionalDepth: 3,
      },
    };

    // Initialize performance metrics
    this.performanceMetrics = {
      totalLayers: 0,
      visibleLayers: 0,
      averageDepth: 0,
      parallaxRange: 0,
      renderTime: 0,
      memoryUsage: 0,
    };

    // Bind event handlers
    this.boundScrollHandler = this.handleScroll.bind(this);
    this.boundResizeHandler = this.handleResize.bind(this);

    // Adjust settings based on device capabilities
    this.adaptToDeviceCapabilities();
  }

  /**
   * Dependency injection setter for CSS Variable Controller
   * Called by VisualSystemFacade during system initialization
   */
  public setOptimizedCSSVariableManager(
    cssController: CSSVariableWriter
  ): void {
    this.cssVariableController = cssController;
    
    // Initialize musical visual effects components after CSS controller is available
    this.initializeMusicalVisualEffects();
  }

  /**
   * Initialize musical visual effects components (async version)
   */
  private async initializeMusicalVisualEffectsAsync(): Promise<void> {
    this.initializeMusicalVisualEffects();
    
    // Initialize the components asynchronously
    if (this.emotionalGradientMapper) {
      await this.emotionalGradientMapper.initialize();
    }

    // GenreProfileManager doesn't need initialization (stateless)
  }

  /**
   * Initialize musical visual effects components
   */
  private initializeMusicalVisualEffects(): void {
    if (!this.cssVariableController) {
      Y3KDebug?.debug?.warn(
        "DepthLayeredGradientSystem",
        "CSS variable controller not available, musical visual effects disabled"
      );
      return;
    }

    try {
      // Initialize emotional gradient mapper
      this.emotionalGradientMapper = new EmotionalGradientMapper(
        this.cssVariableController,
        this.musicSyncService
        // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
      );

      // Initialize genre profile manager for genre detection
      this.genreProfileManager = new GenreProfileManager();

      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Musical visual effects components initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Failed to initialize musical visual effects:",
        error
      );
      this.emotionalGradientMapper = null;
      this.genreProfileManager = null;
    }
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Load settings
    this.loadSettings();

    // Create container elements
    this.createContainerElements();

    // Create CSS animations
    this.createDepthAnimations();

    // Initialize depth layers
    this.initializeDepthLayers();

    // Initialize visual effects layers from FluxVisualEffectsLayers
    this.initializeVisualEffectsLayers();

    // Initialize musical visual effects components if CSS controller is available
    if (this.cssVariableController) {
      await this.initializeMusicalVisualEffectsAsync();
    }

    // Setup event listeners
    this.setupEventListeners();

    // Register with visual effects coordinator
    this.registerWithVisualEffectsCoordinator();

    // ✅ RAF LOOP CONSOLIDATION: Animation loop now managed by AnimationFrameCoordinator
    // The coordinator will call updateAnimation(deltaTime) automatically

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      "Depth-layered gradient system initialized"
    );
  }

  private loadSettings(): void {
    // NOTE: Depth settings (sn-depth-quality, sn-depth-enabled) removed
    // Using default depth settings from constructor
    // Quality level managed by performance coordinator
  }

  private adaptToDeviceCapabilities(): void {
    const recommendation =
      this.deviceCapabilities.recommendPerformanceQuality();

    switch (recommendation) {
      case "low":
        this.depthSettings.qualityLevel = "low";
        this.depthSettings.layerCount = 3;
        this.depthSettings.performanceMode = true;
        break;

      case "balanced":
        this.depthSettings.qualityLevel = "medium";
        this.depthSettings.layerCount = 6;
        this.depthSettings.performanceMode = false;
        break;

      case "high":
        this.depthSettings.qualityLevel = "high";
        this.depthSettings.layerCount = 9;
        this.depthSettings.performanceMode = false;
        break;
    }
  }

  private adjustQualitySettings(): void {
    switch (this.depthSettings.qualityLevel) {
      case "low":
        this.depthSettings.layerCount = 3;
        this.depthSettings.parallaxStrength = 0.3;
        this.depthSettings.depthFogIntensity = 0.5;
        break;

      case "medium":
        this.depthSettings.layerCount = 6;
        this.depthSettings.parallaxStrength = 0.5;
        this.depthSettings.depthFogIntensity = 0.7;
        break;

      case "high":
        this.depthSettings.layerCount = 9;
        this.depthSettings.parallaxStrength = 0.8;
        this.depthSettings.depthFogIntensity = 0.9;
        break;
    }
  }

  private createContainerElements(): void {
    // Find or create main container
    this.containerElement =
      (document.querySelector(".Root__main-view") as HTMLElement) ||
      (document.querySelector(".main-view-container") as HTMLElement) ||
      document.body;

    // Create background container
    this.backgroundContainer = document.createElement("div");
    this.backgroundContainer.className = "sn-depth-background-container";
    this.backgroundContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -20;
      pointer-events: none;
      overflow: hidden;
      perspective: 1000px;
      transform-style: preserve-3d;
    `;

    // Insert at the beginning of the container
    this.containerElement.insertBefore(
      this.backgroundContainer,
      this.containerElement.firstChild
    );
  }

  private createDepthAnimations(): void {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .sn-depth-layer {
        position: absolute;
        width: 120%;
        height: 120%;
        top: -10%;
        left: -10%;
        pointer-events: none;
        transform-style: preserve-3d;
        will-change: transform, opacity;
      }

      @keyframes cosmic-drift {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        25% { transform: translate3d(-2%, 1%, 0) rotate(0.5deg) scale(1.02); }
        50% { transform: translate3d(0, -1%, 0) rotate(0deg) scale(0.98); }
        75% { transform: translate3d(2%, 0.5%, 0) rotate(-0.5deg) scale(1.01); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
      }

      @keyframes nebula-flow {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        33% { transform: translate3d(1%, -1%, 0) rotate(1deg) scale(1.03); }
        66% { transform: translate3d(-1%, 1%, 0) rotate(-1deg) scale(0.97); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
      }

      @keyframes stellar-motion {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        20% { transform: translate3d(-1%, 0.5%, 0) rotate(0.3deg) scale(1.01); }
        40% { transform: translate3d(0.5%, -0.5%, 0) rotate(-0.3deg) scale(0.99); }
        60% { transform: translate3d(1%, 0.5%, 0) rotate(0.2deg) scale(1.02); }
        80% { transform: translate3d(-0.5%, 1%, 0) rotate(-0.2deg) scale(0.98); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
      }

      @keyframes quantum-field {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); filter: blur(0px); }
        25% { transform: translate3d(0.5%, -0.5%, 0) rotate(0.1deg) scale(1.01); filter: blur(0.5px); }
        50% { transform: translate3d(-0.5%, 0.5%, 0) rotate(-0.1deg) scale(0.99); filter: blur(1px); }
        75% { transform: translate3d(0.3%, 0.3%, 0) rotate(0.05deg) scale(1.005); filter: blur(0.3px); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); filter: blur(0px); }
      }

      @keyframes dimensional-shift {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
        16% { transform: translate3d(0.2%, -0.2%, 0) rotate(0.1deg) scale(1.005); }
        32% { transform: translate3d(-0.2%, 0.2%, 0) rotate(-0.1deg) scale(0.995); }
        48% { transform: translate3d(0.1%, 0.1%, 0) rotate(0.05deg) scale(1.002); }
        64% { transform: translate3d(-0.1%, -0.1%, 0) rotate(-0.05deg) scale(0.998); }
        80% { transform: translate3d(0.15%, 0%, 0) rotate(0.02deg) scale(1.001); }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
      }

      @keyframes void-expansion {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.9; }
        50% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1.1); opacity: 0.6; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.9; }
      }

      @keyframes multi-blob-primary {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.8; }
        20% { transform: translate3d(1%, -0.5%, 0) rotate(0.3deg) scale(1.03); opacity: 0.9; }
        40% { transform: translate3d(-0.5%, 1%, 0) rotate(-0.2deg) scale(0.97); opacity: 0.7; }
        60% { transform: translate3d(0.8%, 0.3%, 0) rotate(0.4deg) scale(1.05); opacity: 0.85; }
        80% { transform: translate3d(-0.3%, -0.8%, 0) rotate(-0.3deg) scale(0.98); opacity: 0.75; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.8; }
      }

      @keyframes multi-blob-secondary {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.7; }
        25% { transform: translate3d(-1.2%, 0.8%, 0) rotate(-0.4deg) scale(1.04); opacity: 0.85; }
        50% { transform: translate3d(0.6%, -0.6%, 0) rotate(0.3deg) scale(0.96); opacity: 0.6; }
        75% { transform: translate3d(0.3%, 1.1%, 0) rotate(-0.2deg) scale(1.02); opacity: 0.8; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.7; }
      }

      @keyframes smooth-bubble-flow {
        0% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.75; }
        12% { transform: translate3d(0.4%, -0.3%, 0) rotate(0.15deg) scale(1.02); opacity: 0.85; }
        24% { transform: translate3d(-0.3%, 0.6%, 0) rotate(-0.25deg) scale(0.98); opacity: 0.65; }
        36% { transform: translate3d(0.7%, 0.2%, 0) rotate(0.35deg) scale(1.04); opacity: 0.8; }
        48% { transform: translate3d(-0.2%, -0.5%, 0) rotate(-0.15deg) scale(0.99); opacity: 0.7; }
        60% { transform: translate3d(0.5%, 0.8%, 0) rotate(0.25deg) scale(1.03); opacity: 0.85; }
        72% { transform: translate3d(-0.6%, -0.1%, 0) rotate(-0.3deg) scale(0.97); opacity: 0.6; }
        84% { transform: translate3d(0.1%, -0.7%, 0) rotate(0.1deg) scale(1.01); opacity: 0.8; }
        100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); opacity: 0.75; }
      }

      @media (prefers-reduced-motion: reduce) {
        .sn-depth-layer {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styleElement);
  }

  private initializeDepthLayers(): void {
    if (!this.backgroundContainer) return;

    const layerTemplateKeys = Object.keys(this.layerTemplates);

    for (let i = 0; i < this.depthSettings.layerCount; i++) {
      const depth =
        (i + 1) * (this.depthSettings.maxDepth / this.depthSettings.layerCount);
      const templateKey = layerTemplateKeys[i % layerTemplateKeys.length];
      const template =
        this.layerTemplates[templateKey as keyof typeof this.layerTemplates];

      const layerElement = document.createElement("div");
      layerElement.className = "sn-depth-layer";
      layerElement.id = `sn-depth-layer-${i}`;

      // Calculate layer properties based on depth
      const depthFactor = depth / this.depthSettings.maxDepth;
      const parallaxFactor =
        1 - depthFactor * this.depthSettings.parallaxStrength;
      const opacity = 1 - depthFactor * this.depthSettings.depthFogIntensity;
      const scale = 1 + depthFactor * 0.2;
      const blur = depthFactor * 3;

      // Set initial styles
      layerElement.style.cssText = `
        background: ${template.gradient};
        transform: translate3d(0, 0, ${-depth}px) scale(${scale});
        opacity: ${opacity};
        filter: blur(${blur}px);
        animation: ${template.animation} ${
        template.duration
      } ease-in-out infinite;
        animation-delay: ${i * 0.5}s;
      `;

      // Create depth layer object with LERP smoothing properties
      const depthLayer: DepthLayer = {
        id: `depth-layer-${i}`,
        element: layerElement,
        depth,
        parallaxFactor,
        opacityRange: [opacity * 0.5, opacity],
        scaleRange: [scale * 0.95, scale * 1.05],
        rotationSpeed: 0.01 + i * 0.001,
        colorShift: i * 30,
        blurAmount: blur,
        animationPhase: (i * Math.PI) / 4,
        enabled: true,

        // Initialize LERP smoothing properties (current = target initially)
        currentOffsetY: 0,
        targetOffsetY: 0,
        currentOpacity: opacity,
        targetOpacity: opacity,
        currentBlur: blur,
        targetBlur: blur,
        currentHueRotate: 0,
        targetHueRotate: 0,
        currentScale: scale,
        targetScale: scale,
      };

      // Store layer
      this.depthLayers.set(depthLayer.id, depthLayer);

      // Add to container
      this.backgroundContainer.appendChild(layerElement);
    }

    // Update metrics
    this.updatePerformanceMetrics();

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      `Initialized ${this.depthLayers.size} depth layers`
    );
  }

  /**
   * Initialize visual effects layers from FluxVisualEffectsLayers functionality
   */
  private initializeVisualEffectsLayers(): void {
    if (!this.backgroundContainer || !this.depthSettings.musicalVisualEffects.enabled) {
      return;
    }

    // Performance check - disable if FPS is too low
    const currentFPS = (this.performanceMonitor as any)?.averageFPS || 60;
    const isLowEndDevice = this.performanceMonitor?.getDeviceTier?.() === 'low' || false;
    const shouldReduceQuality = this.performanceMonitor?.shouldReduceQuality?.() || false;

    if (currentFPS < 45 || isLowEndDevice || shouldReduceQuality) {
      this.depthSettings.musicalVisualEffects.enabled = false;
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        `Performance mode activated - visual effects layers disabled (FPS: ${currentFPS})`
      );
      return;
    }

    const targetContainer = this.findSpotifyContainer();

    // Create Harmonic Layer
    const harmonicLayer = document.createElement("div");
    harmonicLayer.className = "sn-harmonic-layer";
    harmonicLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -8;
      pointer-events: none;
      will-change: auto;
    `;

    // Create Flow Dynamics Layer  
    const flowDynamicsLayer = document.createElement("div");
    flowDynamicsLayer.className = "sn-flow-dynamics-primary";
    flowDynamicsLayer.style.cssText = `
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
    const waveDynamicsLayer = document.createElement("div");
    waveDynamicsLayer.className = "sn-wave-dynamics";
    waveDynamicsLayer.style.cssText = `
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
    const flowEffectsLayer = document.createElement("div");
    flowEffectsLayer.className = "sn-flow-effects";
    flowEffectsLayer.style.cssText = `
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
    const proceduralNebulaLayer = document.createElement("div");
    proceduralNebulaLayer.className = "sn-procedural-nebula";
    proceduralNebulaLayer.style.cssText = `
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
    const stellarLayer = document.createElement("div");
    stellarLayer.className = "sn-stellar-layer";
    stellarLayer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -6;
      pointer-events: none;
      will-change: auto;
    `;

    // Store visual effects layers
    this.visualEffectsLayers.set("harmonic", harmonicLayer);
    this.visualEffectsLayers.set("flowDynamics", flowDynamicsLayer);
    this.visualEffectsLayers.set("waveDynamics", waveDynamicsLayer);
    this.visualEffectsLayers.set("flowEffects", flowEffectsLayer);
    this.visualEffectsLayers.set("proceduralNebula", proceduralNebulaLayer);
    this.visualEffectsLayers.set("stellar", stellarLayer);

    // Insert layers in the correct order (highest z-index first)
    targetContainer.appendChild(harmonicLayer);
    targetContainer.appendChild(flowDynamicsLayer);
    targetContainer.appendChild(stellarLayer);
    targetContainer.appendChild(waveDynamicsLayer);
    targetContainer.appendChild(flowEffectsLayer);
    targetContainer.appendChild(proceduralNebulaLayer);

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      `Initialized ${this.visualEffectsLayers.size} visual effects layers`
    );
  }

  /**
   * Find Spotify container for visual effects layers
   */
  private findSpotifyContainer(): HTMLElement {
    const containers = [
      ".Root__main-view",
      ".main-view-container",
      ".main-gridContainer-gridContainer",
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

  private setupEventListeners(): void {
    // Standard browser events (keep as DOM events)
    if (this.boundScrollHandler) {
      window.addEventListener("scroll", this.boundScrollHandler, {
        passive: true,
      });
    }

    if (this.boundResizeHandler) {
      window.addEventListener("resize", this.boundResizeHandler, {
        passive: true,
      });
    }

    // Music events via unified event system
    const musicBeatSub = unifiedEventBus.subscribe(
      "music:beat",
      this.handleMusicBeat.bind(this),
      "DepthLayeredGradientSystem"
    );
    this.eventSubscriptionIds.push(musicBeatSub);

    const musicEnergySub = unifiedEventBus.subscribe(
      "music:energy",
      this.handleMusicEnergy.bind(this),
      "DepthLayeredGradientSystem"
    );
    this.eventSubscriptionIds.push(musicEnergySub);

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      "Event listeners set up",
      {
        unifiedEventSubscriptions: this.eventSubscriptionIds.length,
      }
    );
  }

  private handleScroll(event: Event): void {
    this.scrollY = window.scrollY;
    this.scrollX = window.scrollX;

    // Update parallax effects
    this.updateParallaxEffects();
  }

  private handleResize(event: Event): void {
    // Update layer dimensions
    this.updateLayerDimensions();
  }

  private handleMusicBeat(data: EventData<"music:beat">): void {
    this.pulseDepthLayers(data.intensity);
    
    // Handle musical visual effects beat
    this.handleMusicalVisualEffectsBeat(data.intensity);

    Y3KDebug?.debug?.log("DepthLayeredGradientSystem", "Music beat processed", {
      bpm: data.bpm,
      intensity: data.intensity,
    });
  }

  private handleMusicEnergy(data: EventData<"music:energy">): void {
    this.updateDepthWithMusicEnergy(data.energy);
    
    // Handle musical visual effects spectral data simulation
    this.handleMusicalVisualEffectsSpectralData({
      energy: data.energy,
      valence: data.valence,
    });

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      "Music energy processed",
      {
        energy: data.energy,
        valence: data.valence,
      }
    );
  }

  /**
   * Handle musical visual effects beat effects (from FluxVisualEffectsLayers)
   */
  private handleMusicalVisualEffectsBeat(intensity: number): void {
    if (!this.depthSettings.musicalVisualEffects.enabled) return;
    
    // Handle beat detection for flow dynamics
    this.updateFlowDynamics(intensity);
  }

  /**
   * Handle musical visual effects spectral data (from FluxVisualEffectsLayers)
   */
  private handleMusicalVisualEffectsSpectralData(data: { energy: number; valence: number }): void {
    if (!this.depthSettings.musicalVisualEffects.enabled) return;
    
    // Simulate spectral data from energy and valence
    // Map energy to different frequency ranges
    this.spectralData.bassResponse = data.energy * 0.8; // Bass tends to be high energy
    this.spectralData.midResponse = data.energy * 0.6; // Mid range
    this.spectralData.trebleResponse = data.energy * 0.4; // Treble
    this.spectralData.vocalPresence = data.valence * 0.7; // Vocal presence from valence
    
    this.updateSpectralVariables();
  }

  private updateParallaxEffects(): void {
    if (!this.depthSettings.infiniteScrolling) return;

    this.depthLayers.forEach((layer) => {
      const parallaxY = this.scrollY * layer.parallaxFactor;
      const parallaxX = this.scrollX * layer.parallaxFactor * 0.5;

      // ✅ PERFORMANCE FIX: Use CSS variables instead of direct transform manipulation
      // CSS applies transform using these variables, avoiding forced layout recalculation
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-x`, `${parallaxX}px`);
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-y`, `${parallaxY}px`);
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-z`, `${-layer.depth}px`);
      }
    });
  }

  private updateLayerDimensions(): void {
    this.depthLayers.forEach((layer) => {
      const depthFactor = layer.depth / this.depthSettings.maxDepth;
      const scale = 1 + depthFactor * 0.2;

      // ✅ PERFORMANCE FIX: Use CSS variables instead of direct transform manipulation
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-scale`, scale.toString());
      }
    });
  }

  private updateDepthWithMusicEnergy(energy: number): void {
    const energyModulation = energy * 0.3;

    this.depthLayers.forEach((layer) => {
      const baseOpacity = layer.opacityRange[0];
      const maxOpacity = layer.opacityRange[1];
      const newOpacity =
        baseOpacity + energyModulation * (maxOpacity - baseOpacity);

      // ✅ PERFORMANCE FIX: Use CSS variables instead of direct opacity manipulation
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-opacity`, newOpacity.toString());
      }
    });
  }

  private pulseDepthLayers(intensity: number): void {
    const pulseStrength = intensity * 0.1;

    this.depthLayers.forEach((layer) => {
      const baseScale = layer.scaleRange[0];
      const maxScale = layer.scaleRange[1];
      const pulseScale = baseScale + pulseStrength * (maxScale - baseScale);

      // ✅ PERFORMANCE FIX: Use CSS variables for pulse animation
      // Apply pulse scale via CSS variable
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-pulse-scale`, pulseScale.toString());

        // Reset after pulse using CSS variable (not direct DOM)
        setTimeout(() => {
          if (this.cssVariableController) {
            this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-pulse-scale`, baseScale.toString());
          }
        }, 200);
      }
    });
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by AnimationFrameCoordinator
   *
   * Benefits:
   * - Single RAF loop for all systems (not 5-8 independent loops)
   * - Shared deltaTime calculation (eliminates redundant performance.now() calls)
   * - Coordinated frame budget management
   * - Priority-based execution order
   * - Increased target from 30 FPS to 60 FPS (coordinator manages this)
   *
   * Old method removed: startAnimationLoop()
   * Replacement: updateAnimation(deltaTime) called by coordinator
   * Note: updateDepthAnimations() still called, now from updateAnimation()
   */

  private updateDepthAnimations(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000; // Convert to seconds for LERP

    this.depthLayers.forEach((layer) => {
      // Update animation phase for smooth animation patterns
      layer.animationPhase += layer.rotationSpeed * deltaTime * 0.001;

      // Calculate target values based on music and visual effects state
      this.updateLayerTargetsFromMusic(layer);

      // Apply LERP smoothing to all properties for framerate-independent animation
      layer.currentOffsetY = ThemeUtilities.lerpSmooth(
        layer.currentOffsetY,
        layer.targetOffsetY,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.parallaxOffset
      );

      layer.currentOpacity = ThemeUtilities.lerpSmooth(
        layer.currentOpacity,
        layer.targetOpacity,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.opacity
      );

      layer.currentBlur = ThemeUtilities.lerpSmooth(
        layer.currentBlur,
        layer.targetBlur,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.blur
      );

      layer.currentHueRotate = ThemeUtilities.lerpSmooth(
        layer.currentHueRotate,
        layer.targetHueRotate,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.hueRotate
      );

      layer.currentScale = ThemeUtilities.lerpSmooth(
        layer.currentScale,
        layer.targetScale,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.scale
      );

      // Apply the smoothed current values to CSS
      this.applyLayerProperties(layer);
    });
  }

  /**
   * Update layer target values based on music analysis and visual effects state
   */
  private updateLayerTargetsFromMusic(layer: DepthLayer): void {
    // Get music state for visual-effects-driven animation
    const musicState = this.musicSyncService?.getCurrentMusicState();

    if (musicState) {
      const { intensity, beat, emotion } = musicState;

      // Calculate smooth animation effect based on music
      const animationFactor = Math.sin(layer.animationPhase) * 0.05 * intensity;
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * 0.5;

      // Update target opacity with animation
      layer.targetOpacity = Math.max(
        0,
        Math.min(1, baseOpacity + animationFactor)
      );

      // Parallax offset based on scroll and music intensity
      layer.targetOffsetY =
        this.scrollY * layer.parallaxFactor +
        Math.sin(layer.animationPhase * 0.5) * intensity * 10;

      // Scale variations based on music energy
      const baseScale =
        layer.scaleRange[0] + (layer.scaleRange[1] - layer.scaleRange[0]) * 0.5;
      layer.targetScale = baseScale + intensity * 0.05;

      // Blur adjustments for depth perception
      layer.targetBlur = layer.blurAmount + intensity * 2;

      // Color temperature shifts based on emotion
      if (emotion) {
        // Map emotion to hue rotation (simplified emotional color mapping)
        const emotionHue =
          emotion === "energetic"
            ? 15
            : emotion === "calm"
            ? -10
            : emotion === "melancholy"
            ? -20
            : 0;
        layer.targetHueRotate = emotionHue + layer.colorShift * 0.1;
      }
    } else {
      // Fallback to gentle baseline animation when no music
      const animationFactor = Math.sin(layer.animationPhase) * 0.02;
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * 0.5;

      layer.targetOpacity = Math.max(
        0,
        Math.min(1, baseOpacity + animationFactor)
      );
      layer.targetOffsetY = this.scrollY * layer.parallaxFactor;
      layer.targetScale =
        layer.scaleRange[0] + (layer.scaleRange[1] - layer.scaleRange[0]) * 0.5;
      layer.targetBlur = layer.blurAmount;
      layer.targetHueRotate = 0;
    }
  }

  /**
   * Apply the current smoothed properties to the layer element
   */
  private applyLayerProperties(layer: DepthLayer): void {
    // ✅ PERFORMANCE FIX: Use CSS variables instead of direct style manipulation
    // This method is called every frame, so batching via CSS variables is critical
    if (this.cssVariableController) {
      // Transform components
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-offset-y`, `${layer.currentOffsetY}px`);
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-depth-z`, `${-layer.depth}px`);
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-scale`, layer.currentScale.toString());

      // Opacity
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-opacity`, layer.currentOpacity.toString());

      // Filter effects
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-blur`, `${layer.currentBlur}px`);
      this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-hue`, `${layer.currentHueRotate}deg`);
    }
  }

  private updatePerformanceMetrics(): void {
    this.performanceMetrics.totalLayers = this.depthLayers.size;
    // ✅ PERFORMANCE FIX: Use cached opacity value instead of reading from DOM
    this.performanceMetrics.visibleLayers = Array.from(
      this.depthLayers.values()
    ).filter((layer) => layer.currentOpacity > 0.01).length;

    this.performanceMetrics.averageDepth =
      Array.from(this.depthLayers.values()).reduce(
        (sum, layer) => sum + layer.depth,
        0
      ) / this.depthLayers.size;

    this.performanceMetrics.parallaxRange = this.depthSettings.parallaxStrength;
    this.performanceMetrics.renderTime =
      performance.now() - this.lastAnimationTime;

    // Update CSS variables for debugging (if controller is available)
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-layers-total",
        this.performanceMetrics.totalLayers.toString()
      );

      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-layers-visible",
        this.performanceMetrics.visibleLayers.toString()
      );
    }
  }

  /**
   * Update visual effects variables (from FluxVisualEffectsLayers)
   */
  private updateVisualEffectsVariables(): void {
    if (!this.cssVariableController || !this.depthSettings.musicalVisualEffects.enabled) return;

    // Runtime performance check - disable if performance degrades
    const currentFPS = (this.performanceMonitor as any)?.currentFPS || 60;
    if (currentFPS < 40 && this.depthSettings.musicalVisualEffects.enabled) {
      this.depthSettings.musicalVisualEffects.enabled = false;
      this.destroyVisualEffectsLayers();
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        `Runtime performance degradation detected - visual effects layers disabled (FPS: ${currentFPS})`
      );
      return;
    }

    const settings = this.depthSettings.musicalVisualEffects;

    // Batch all updates to reduce style recalculation
    const updates = [
      ["--sn-gradient-activity-level", settings.activityLevel.toString()],
      ["--sn-gradient-temporal-memory", settings.temporalMemory.toString()],
      ["--sn-gradient-harmonic-resonance", settings.harmonicSensitivity.toString()],
      ["--sn-gradient-flow-dynamics", settings.flowDynamics.toString()],
      ["--sn-gradient-nebula-density", settings.stellarDensity.toString()],
      ["--sn-gradient-dimensional-depth", settings.dimensionalDepth.toString()],

      // Pre-calculate derived values to reduce CPU overhead
      ["--sn-gradient-layer-activity", "1"],
      ["--sn-gradient-layer-temporal", "0.8"],
      ["--sn-gradient-layer-harmonic", (settings.harmonicSensitivity * 0.6).toString()],
      ["--sn-gradient-layer-flow", (settings.flowDynamics * 0.4).toString()],
      ["--sn-gradient-layer-stellar", (settings.stellarDensity * 0.2).toString()],

      // Wave dynamics (reduce precision to improve performance)
      ["--sn-gradient-wave-intensity", (Math.round(settings.activityLevel * 40) / 100).toString()],
      ["--sn-gradient-flow-intensity", (Math.round(settings.harmonicSensitivity * 30) / 100).toString()],
      ["--sn-gradient-temporal-flow-speed", Math.max(0.5, Math.round(settings.temporalMemory * 100) / 100).toString()],
    ];

    // Apply updates in batch
    updates.forEach(([property, value]) => {
      if (property && value !== undefined && this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(property, value);
      }
    });
  }

  /**
   * Update spectral variables (from FluxVisualEffectsLayers)
   */
  private updateSpectralVariables(): void {
    if (!this.cssVariableController) return;

    // Update spectral analysis variables
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-gradient-bass-response",
      this.spectralData.bassResponse.toString()
    );
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-gradient-mid-response",
      this.spectralData.midResponse.toString()
    );
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-gradient-treble-response",
      this.spectralData.trebleResponse.toString()
    );
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-gradient-vocal-presence",
      this.spectralData.vocalPresence.toString()
    );
  }

  /**
   * Update flow dynamics (from FluxVisualEffectsLayers)
   */
  private updateFlowDynamics(beatIntensity: number): void {
    if (!this.cssVariableController) return;

    // Flow dynamics increase with beat intensity for smooth movement
    const flowIntensity = Math.min(
      this.depthSettings.musicalVisualEffects.flowDynamics + beatIntensity * 0.3,
      1.0
    );
    this.cssVariableController.queueCSSVariableUpdate(
      "--sn-gradient-flow-dynamics",
      flowIntensity.toString()
    );

    // Gradually decay back to base level
    setTimeout(() => {
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(
          "--sn-gradient-flow-dynamics",
          this.depthSettings.musicalVisualEffects.flowDynamics.toString()
        );
      }
    }, 500);
  }

  /**
   * Destroy visual effects layers (from FluxVisualEffectsLayers)
   */
  private destroyVisualEffectsLayers(): void {
    // Remove DOM elements immediately for performance
    this.visualEffectsLayers.forEach((layer, key) => {
      if (layer.parentNode) {
        layer.parentNode.removeChild(layer);
      }
    });
    this.visualEffectsLayers.clear();

    // Set all visual effects variables to disabled state
    if (this.cssVariableController) {
      const resetVariables = [
        "--sn-gradient-activity-level",
        "--sn-gradient-layer-activity",
        "--sn-gradient-layer-temporal",
        "--sn-gradient-layer-harmonic",
        "--sn-gradient-layer-flow",
        "--sn-gradient-layer-stellar",
      ];

      resetVariables.forEach((variable) => {
        this.cssVariableController!.queueCSSVariableUpdate(variable, "0");
      });
    }
  }

  /**
   * ✅ RAF LOOP CONSOLIDATION: Now receives deltaTime from coordinator
   * Calls updateDepthAnimations() which was previously called from internal RAF loop
   */
  public override updateAnimation(deltaTime: number): void {
    if (!this.isActive) return;

    // Update depth layer animations (previously called from RAF loop)
    this.updateDepthAnimations(deltaTime);

    // Update performance metrics (previously called from RAF loop)
    this.updatePerformanceMetrics();

    // Update visual effects temporal phase
    if (this.depthSettings.musicalVisualEffects.enabled && this.cssVariableController) {
      const currentTime = performance.now();
      const temporalPhase = (currentTime / 10000) % 1; // 10 second cycle

      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-gradient-temporal-phase",
        temporalPhase.toString()
      );

      // Update visual effects variables periodically
      if (currentTime % 1000 < 16) { // Roughly every second
        this.updateVisualEffectsVariables();
      }
    }
  }

  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy =
      this.depthSettings.enabled &&
      this.depthLayers.size > 0 &&
      this.backgroundContainer !== null;

    return {
      system: 'DepthLayeredGradientSystem',
      healthy: isHealthy,
      metrics: {
        enabled: this.depthSettings.enabled,
        layerCount: this.depthLayers.size,
        hasContainer: !!this.backgroundContainer,
        layerSettings: this.depthSettings.layerCount
      },
      issues: isHealthy ? [] : [
        ...(this.depthSettings.enabled ? [] : ['System disabled']),
        ...(this.depthLayers.size > 0 ? [] : ['No active layers']),
        ...(this.backgroundContainer ? [] : ['Missing container element'])
      ]
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Unregister from visual effects coordinator
    if (this.visualEffectsCoordinator) {
      try {
        this.visualEffectsCoordinator.unregisterVisualEffectsParticipant(
          "DepthLayeredGradientSystem"
        );
        Y3KDebug?.debug?.log(
          "DepthLayeredGradientSystem",
          "Unregistered from visual effects coordinator"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "DepthLayeredGradientSystem",
          "Error unregistering from visual effects coordinator:",
          error
        );
      }
    }

    // ✅ RAF LOOP CONSOLIDATION: No need to stop animation - coordinator handles this
    // System will automatically stop receiving updateAnimation() calls when destroyed

    // Remove event listeners
    if (this.boundScrollHandler) {
      window.removeEventListener("scroll", this.boundScrollHandler);
    }

    if (this.boundResizeHandler) {
      window.removeEventListener("resize", this.boundResizeHandler);
    }

    // Clean up unified event subscriptions
    this.eventSubscriptionIds.forEach((subscriptionId) => {
      unifiedEventBus.unsubscribe(subscriptionId);
    });
    this.eventSubscriptionIds = [];

    // Clean up depth layers
    this.depthLayers.forEach((layer) => {
      if (layer.element.parentNode) {
        layer.element.parentNode.removeChild(layer.element);
      }
    });

    this.depthLayers.clear();

    // Clean up visual effects layers
    this.destroyVisualEffectsLayers();

    // Clean up musical visual effects components
    if (this.emotionalGradientMapper) {
      this.emotionalGradientMapper.destroy();
      this.emotionalGradientMapper = null;
    }

    // GenreProfileManager doesn't need cleanup (stateless)
    this.genreProfileManager = null;

    // Remove background container
    if (this.backgroundContainer && this.backgroundContainer.parentNode) {
      this.backgroundContainer.parentNode.removeChild(this.backgroundContainer);
      this.backgroundContainer = null;
    }

    // Clear bound handlers
    this.boundScrollHandler = null;
    this.boundResizeHandler = null;
  }

  // Public API
  public setDepthEnabled(enabled: boolean): void {
    this.depthSettings.enabled = enabled;

    if (this.backgroundContainer) {
      this.backgroundContainer.style.display = enabled ? "block" : "none";
    }
  }

  public setQualityLevel(quality: "low" | "medium" | "high"): void {
    this.depthSettings.qualityLevel = quality;
    this.adjustQualitySettings();

    // Reinitialize layers with new quality settings
    this.depthLayers.forEach((layer) => {
      if (layer.element.parentNode) {
        layer.element.parentNode.removeChild(layer.element);
      }
    });

    this.depthLayers.clear();
    this.initializeDepthLayers();
  }

  public setParallaxStrength(strength: number): void {
    this.depthSettings.parallaxStrength = Math.max(0, Math.min(1, strength));

    // Update parallax factors
    this.depthLayers.forEach((layer) => {
      const depthFactor = layer.depth / this.depthSettings.maxDepth;
      layer.parallaxFactor =
        1 - depthFactor * this.depthSettings.parallaxStrength;
    });
  }

  public setDepthFogIntensity(intensity: number): void {
    this.depthSettings.depthFogIntensity = Math.max(0, Math.min(1, intensity));

    // ✅ PERFORMANCE FIX: Use CSS variables for fog opacity updates
    this.depthLayers.forEach((layer) => {
      const depthFactor = layer.depth / this.depthSettings.maxDepth;
      const opacity = 1 - depthFactor * this.depthSettings.depthFogIntensity;

      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-fog-opacity`, opacity.toString());
      }

      // Update cached value for performance metrics
      layer.currentOpacity = opacity;
    });
  }

  public getDepthSettings(): DepthSettings {
    return { ...this.depthSettings };
  }

  public getPerformanceMetrics(): InfiniteSpaceMetrics {
    return { ...this.performanceMetrics };
  }

  public getDepthLayerCount(): number {
    return this.depthLayers.size;
  }

  public getVisibleLayerCount(): number {
    return this.performanceMetrics.visibleLayers;
  }

  // ===================================================================
  // MUSICAL VISUAL EFFECTS API (from FluxVisualEffectsLayers)
  // ===================================================================

  public setVisualEffectsLevel(level: number): void {
    this.depthSettings.musicalVisualEffects.activityLevel = Math.max(0, Math.min(1, level));
    this.updateVisualEffectsVariables();
  }

  public setTemporalMemory(memory: number): void {
    this.depthSettings.musicalVisualEffects.temporalMemory = Math.max(0, Math.min(1, memory));
    this.updateVisualEffectsVariables();
  }

  public setHarmonicSensitivity(sensitivity: number): void {
    this.depthSettings.musicalVisualEffects.harmonicSensitivity = Math.max(0, Math.min(1, sensitivity));
    this.updateVisualEffectsVariables();
  }

  public setStellarDrift(drift: number): void {
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-gradient-stellar-drift",
        `${drift}deg`
      );
    }
  }

  public getVisualEffectsMetrics() {
    return {
      activityLevel: this.depthSettings.musicalVisualEffects.activityLevel,
      temporalMemory: this.depthSettings.musicalVisualEffects.temporalMemory,
      harmonicSensitivity: this.depthSettings.musicalVisualEffects.harmonicSensitivity,
      flowDynamics: this.depthSettings.musicalVisualEffects.flowDynamics,
      stellarDensity: this.depthSettings.musicalVisualEffects.stellarDensity,
      dimensionalDepth: this.depthSettings.musicalVisualEffects.dimensionalDepth,
      spectralData: { ...this.spectralData },
      emotionalProfile:
        this.emotionalGradientMapper?.getCurrentEmotionalProfile() || null,
      gradientState:
        this.emotionalGradientMapper?.getCurrentGradientState() || null,
      currentGenre: this.genreProfileManager?.getCurrentGenre() || null,
      genreConfidence: this.genreProfileManager?.getGenreConfidence() || 0,
      genreHistory: this.genreProfileManager?.getGenreHistory() || [],
    };
  }

  public getEmotionalGradientMapper(): EmotionalGradientMapper | null {
    return this.emotionalGradientMapper;
  }

  public getGenreProfileManager(): GenreProfileManager | null {
    return this.genreProfileManager;
  }

  // ===================================================================
  // VISUAL EFFECTS COORDINATOR INTEGRATION
  // ===================================================================

  /**
   * Register this depth system as a visual effects participant
   */
  private registerWithVisualEffectsCoordinator(): void {
    if (!this.visualEffectsCoordinator) {
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Visual effects coordinator not available, skipping registration"
      );
      return;
    }

    try {
      this.visualEffectsCoordinator.registerVisualEffectsParticipant(this);
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Successfully registered with visual effects coordinator"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Failed to register with visual effects coordinator:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // Depth perception is high priority for spatial visual effects
  }

  public getVisualEffectsContribution(): any {
    return {
      depthPerception: this.depthSettings.maxDepth / 10, // Normalize to 0-1
      layerCount: this.depthLayers.size,
      parallaxStrength: this.depthSettings.parallaxStrength,
      fogDensity: this.depthSettings.depthFogIntensity,
      infinityPerception: this.depthSettings.infiniteScrolling ? 1.0 : 0.5,
      spatialAwareness:
        this.performanceMetrics.visibleLayers /
        this.performanceMetrics.totalLayers,
    };
  }

  public onVisualEffectsFieldUpdate(field: VisualEffectState): void {
    try {
      this.currentVisualEffectState = field;

      // Update depth layers based on visual effects field
      this.updateDepthFromVisualEffects(field);

      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Updated from visual effects field:",
        {
          rhythmicPulse: field.pulseRate,
          depthPerception: field.depthPerception,
          animationCycle: field.pulseRate,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Error updating from visual effects field:",
        error
      );
    }
  }


  /**
   * Update depth layers based on visual effects field
   */
  private updateDepthFromVisualEffects(field: VisualEffectState): void {
    // Modulate parallax strength with rhythmic pulse
    const visualEffectsParallax =
      this.depthSettings.parallaxStrength * (0.7 + field.pulseRate * 0.6);

    // Update layer properties based on visual effects
    for (const [layerId, layer] of this.depthLayers.entries()) {
      if (!layer.element) continue;

      // Modulate opacity with musical flow
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * field.flowDirection.x;
      const visualEffectsOpacity =
        baseOpacity * (0.8 + field.depthPerception * 0.4);

      // Modulate scale with animation cycle
      const animationScale =
        1.0 + Math.sin(field.pulseRate * Math.PI * 2) * 0.05;
      const baseScale =
        layer.scaleRange[0] +
        (layer.scaleRange[1] - layer.scaleRange[0]) * field.energyLevel;
      const visualEffectsScale = baseScale * animationScale;

      // ✅ PERFORMANCE FIX: Use CSS variables for visual effects transformations
      if (this.cssVariableController) {
        // Opacity
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-effect-opacity`, visualEffectsOpacity.toString());

        // Transform components
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-effect-scale`, visualEffectsScale.toString());
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-effect-translate-z`, `${layer.depth * visualEffectsParallax}px`);
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-effect-rotate`, `${layer.animationPhase * layer.rotationSpeed}deg`);

        // Update blur based on depth perception
        const visualEffectsBlur = layer.blurAmount * (1.0 + field.depthPerception * 0.5);
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-effect-blur`, `${visualEffectsBlur}px`);
      }

      // Update cached opacity for performance metrics
      layer.currentOpacity = visualEffectsOpacity;
    }

    // Apply visual effects-aware CSS variables for hybrid coordination
    if (this.cssVariableController) {
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-activity-parallax",
        visualEffectsParallax.toString()
      );
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-perception-intensity",
        field.depthPerception.toString()
      );
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-fog-intensity",
        this.depthSettings.depthFogIntensity.toString()
      );
      this.cssVariableController.queueCSSVariableUpdate(
        "--sn-depth-spatial-awareness",
        (
          this.performanceMetrics.visibleLayers /
          this.performanceMetrics.totalLayers
        ).toString()
      );
    }
  }

  /**
   * Update layer scales with animation pattern
   */
  private updateLayerScalesWithAnimation(animationPhase: number): void {
    const animationModulation = Math.sin(animationPhase * Math.PI * 2) * 0.03; // Subtle animation

    for (const layer of this.depthLayers.values()) {
      if (!layer.element) continue;

      const baseScale =
        layer.scaleRange[0] + (layer.scaleRange[1] - layer.scaleRange[0]) * 0.5;
      const animationScale = baseScale * (1.0 + animationModulation);

      // ✅ PERFORMANCE FIX: Use CSS variable for animation scale updates
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-anim-scale`, animationScale.toString());
      }
    }
  }

  /**
   * Update depth fog intensity across all layers
   */
  private updateDepthFogIntensity(): void {
    for (const layer of this.depthLayers.values()) {
      if (!layer.element) continue;

      // Calculate fog intensity based on depth
      const fogIntensity =
        (layer.depth / this.depthSettings.maxDepth) *
        this.depthSettings.depthFogIntensity;
      const fogOpacity = Math.max(0, Math.min(0.8, fogIntensity));
      const fogSpread = 50 * fogIntensity;

      // ✅ PERFORMANCE FIX: Use CSS variables for fog effect instead of direct boxShadow
      if (this.cssVariableController) {
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-fog-spread`, `${fogSpread}px`);
        this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-fog-opacity`, fogOpacity.toString());
      }
    }
  }

  /**
   * Update depth perception settings
   */
  private updateDepthPerception(): void {
    // Recalculate layer depths based on new max depth
    const layerArray = Array.from(this.depthLayers.values()).sort(
      (a, b) => a.depth - b.depth
    );

    layerArray.forEach((layer, index) => {
      const depthRatio = index / (layerArray.length - 1);
      layer.depth = depthRatio * this.depthSettings.maxDepth;

      if (layer.element) {
        // ✅ PERFORMANCE FIX: Use CSS variable for perspective transform update
        const translateZ = layer.depth * this.depthSettings.parallaxStrength;
        if (this.cssVariableController) {
          this.cssVariableController.queueCSSVariableUpdate(`--layer-${layer.depth}-translate-z`, `${translateZ}px`);
        }
      }
    });
  }

  // =========================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE
  // =========================================================================

  public onVisualStateUpdate(state: VisualEffectState): void {
    // Update visual effects based on shared state
    this.onVisualEffectsFieldUpdate(state);
  }

  public onVisualEffectEvent(eventType: string, payload: any): void {
    // Handle visual effect events from coordinator
    switch (eventType) {
      case "visual-effects:rhythm-shift":
        if (payload.intensity) {
          this.depthSettings.parallaxStrength = Math.min(10, payload.intensity * 5);
        }
        break;
      case "visual-effects:color-shift":
        this.forceRepaint?.("color-shift");
        break;
      case "visual-effects:energy-surge":
        if (payload.intensity > 0.6) {
          this.depthSettings.depthFogIntensity = Math.min(1, payload.intensity);
        }
        break;
    }
  }

  public getVisualContribution(): Partial<VisualEffectState> {
    return {
      depthPerception: this.depthSettings.parallaxStrength / 10,
      effectDepth: this.depthSettings.depthFogIntensity,
      visualCoherence: this.depthSettings.maxDepth / 100
    };
  }

  // ===================================================================
  // BACKWARD COMPATIBILITY ALIASES
  // ===================================================================

  /** @deprecated Use onVisualEffectsFieldUpdate */
  public onConsciousnessFieldUpdate(field: VisualEffectState): void {
    return this.onVisualEffectsFieldUpdate(field);
  }

  /** @deprecated Use getVisualEffectsContribution */
  public getConsciousnessContribution(): any {
    return this.getVisualEffectsContribution();
  }

  /** @deprecated Use setVisualEffectsLevel */
  public setConsciousnessLevel(level: number): void {
    return this.setVisualEffectsLevel(level);
  }

  /** @deprecated Use getVisualEffectsMetrics */
  public getConsciousnessMetrics() {
    return this.getVisualEffectsMetrics();
  }

  /** @deprecated Use onVisualEffectsEvent */
  public onChoreographyEvent(eventType: string, payload: any): void {
    return this.onVisualEffectEvent(eventType, payload);
  }
}
