/**
 * DepthLayeredGradientSystem - Infinite Space Illusion System
 * Part of the Year 3000 System visual pipeline
 *
 * Creates depth-layered gradients that give the illusion of infinite space behind the interface
 * - Multi-layer gradient system with parallax scrolling
 * - CSS transforms for 3D depth perception
 * - Performance-aware layering with automatic quality scaling
 * - Extends existing 6-layer consciousness system
 */

import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { EmotionalGradientMapper } from "@/audio/EmotionalGradientMapper";
import { GenreGradientEvolution } from "@/audio/GenreGradientEvolution";
import { MusicSyncService } from "@/audio/MusicSyncService";
import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { unifiedEventBus, type EventData } from "@/core/events/UnifiedEventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type {
  BackgroundAnimationCoordinator,
  BackgroundSystemParticipant,
  ConsciousnessField,
} from "../effects/BackgroundAnimationCoordinator";

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

interface MusicalConsciousnessSettings {
  enabled: boolean;
  consciousnessLevel: number; // 0-1 overall consciousness intensity
  temporalMemory: number; // 0-1 how much past colors influence current
  harmonicSensitivity: number; // 0-1 frequency response sensitivity
  flowDynamics: number; // 0-1 organic flow pattern intensity
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
  musicalConsciousness: MusicalConsciousnessSettings;
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
  private consciousnessLayers: Map<string, HTMLDivElement>;
  private cssConsciousnessController: OptimizedCSSVariableManager | null;
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private emotionalGradientMapper: EmotionalGradientMapper | null = null;
  private genreGradientEvolution: GenreGradientEvolution | null = null;
  private containerElement: HTMLElement | null = null;
  private backgroundContainer: HTMLElement | null = null;
  
  // Musical consciousness spectral data
  private spectralData = {
    bassResponse: 0,
    midResponse: 0,
    trebleResponse: 0,
    vocalPresence: 0,
  };

  private animationFrameId: number | null = null;
  private lastAnimationTime = 0;
  private scrollY = 0;
  private scrollX = 0;
  private deviceCapabilities: DeviceCapabilityDetector;
  private performanceMetrics: InfiniteSpaceMetrics;

  private boundScrollHandler: ((event: Event) => void) | null = null;
  private boundResizeHandler: ((event: Event) => void) | null = null;
  private eventSubscriptionIds: string[] = [];

  // Consciousness choreographer integration
  private consciousnessChoreographer: BackgroundAnimationCoordinator | null =
    null;
  private currentConsciousnessField: ConsciousnessField | null = null;

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
    // Large organic blob formations
    organicBubbles: {
      gradient:
        "radial-gradient(ellipse 45% 35% at 35% 40%, rgba(203, 166, 247, 0.4) 0%, rgba(203, 166, 247, 0.1) 60%, transparent 90%), radial-gradient(ellipse 35% 45% at 70% 65%, rgba(137, 180, 250, 0.35) 0%, rgba(137, 180, 250, 0.08) 65%, transparent 95%), radial-gradient(circle 25% at 25% 75%, rgba(245, 194, 231, 0.3) 0%, transparent 80%), radial-gradient(ellipse 20% 30% at 80% 20%, rgba(250, 179, 135, 0.25) 0%, transparent 75%)",
      animation: "organic-bubble-flow",
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
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null = null,
    settingsManager: SettingsManager | null = null,
    year3000System: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    this.colorHarmonyEngine = year3000System?.colorHarmonyEngine || null;

    // Get consciousness choreographer from year3000System if available
    this.consciousnessChoreographer =
      year3000System?.backgroundConsciousnessChoreographer || null;

    // CSS Consciousness Controller will be injected by VisualSystemFacade
    this.cssConsciousnessController = null;
    this.deviceCapabilities = new DeviceCapabilityDetector();
    this.depthLayers = new Map();
    this.consciousnessLayers = new Map();

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
      musicalConsciousness: {
        enabled: true,
        consciousnessLevel: 0.7,
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
   * Dependency injection setter for CSS Consciousness Controller
   * Called by VisualSystemFacade during system initialization
   */
  public setOptimizedCSSVariableManager(
    cssController: OptimizedCSSVariableManager
  ): void {
    this.cssConsciousnessController = cssController;
    
    // Initialize musical consciousness components after CSS controller is available
    this.initializeMusicalConsciousness();
  }

  /**
   * Initialize musical consciousness components (async version)
   */
  private async initializeMusicalConsciousnessAsync(): Promise<void> {
    this.initializeMusicalConsciousness();
    
    // Initialize the components asynchronously
    if (this.emotionalGradientMapper) {
      await this.emotionalGradientMapper.initialize();
    }
    
    if (this.genreGradientEvolution) {
      await this.genreGradientEvolution.initialize();
    }
  }

  /**
   * Initialize musical consciousness components
   */
  private initializeMusicalConsciousness(): void {
    if (!this.cssConsciousnessController) {
      Y3KDebug?.debug?.warn(
        "DepthLayeredGradientSystem",
        "CSS consciousness controller not available, musical consciousness disabled"
      );
      return;
    }

    try {
      // Initialize emotional gradient mapper
      this.emotionalGradientMapper = new EmotionalGradientMapper(
        this.cssConsciousnessController,
        this.musicSyncService,
        this.settingsManager
      );

      // Initialize genre gradient evolution
      this.genreGradientEvolution = new GenreGradientEvolution(
        this.cssConsciousnessController,
        this.musicSyncService,
        this.emotionalGradientMapper,
        this.settingsManager
      );

      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Musical consciousness components initialized"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Failed to initialize musical consciousness:",
        error
      );
      this.emotionalGradientMapper = null;
      this.genreGradientEvolution = null;
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

    // Initialize consciousness layers from FluxConsciousnessLayers
    this.initializeConsciousnessLayers();

    // Initialize musical consciousness components if CSS controller is available
    if (this.cssConsciousnessController) {
      await this.initializeMusicalConsciousnessAsync();
    }

    // Setup event listeners
    this.setupEventListeners();

    // Register with consciousness choreographer
    this.registerWithConsciousnessChoreographer();

    // Start animation loop
    this.startAnimationLoop();

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      "Depth-layered gradient system initialized"
    );
  }

  private loadSettings(): void {
    if (!this.settingsManager) return;

    try {
      const qualitySetting = this.settingsManager.get(
        "sn-depth-quality" as any
      );
      if (qualitySetting) {
        this.depthSettings.qualityLevel = qualitySetting;
        this.adjustQualitySettings();
      }

      const enabledSetting = this.settingsManager.get(
        "sn-depth-enabled" as any
      );
      if (enabledSetting !== undefined) {
        this.depthSettings.enabled = enabledSetting;
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "DepthLayeredGradientSystem",
        "Failed to load settings:",
        error
      );
    }
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

      @keyframes organic-bubble-flow {
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
   * Initialize consciousness layers from FluxConsciousnessLayers functionality
   */
  private initializeConsciousnessLayers(): void {
    if (!this.backgroundContainer || !this.depthSettings.musicalConsciousness.enabled) {
      return;
    }

    // Performance check - disable if FPS is too low
    const currentFPS = (this.performanceMonitor as any)?.averageFPS || 60;
    const isLowEndDevice = this.performanceMonitor?.getDeviceTier?.() === 'low' || false;
    const shouldReduceQuality = this.performanceMonitor?.shouldReduceQuality?.() || false;

    if (currentFPS < 45 || isLowEndDevice || shouldReduceQuality) {
      this.depthSettings.musicalConsciousness.enabled = false;
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        `Performance mode activated - consciousness layers disabled (FPS: ${currentFPS})`
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

    // Store consciousness layers
    this.consciousnessLayers.set("harmonic", harmonicLayer);
    this.consciousnessLayers.set("flowDynamics", flowDynamicsLayer);
    this.consciousnessLayers.set("waveDynamics", waveDynamicsLayer);
    this.consciousnessLayers.set("flowEffects", flowEffectsLayer);
    this.consciousnessLayers.set("proceduralNebula", proceduralNebulaLayer);
    this.consciousnessLayers.set("stellar", stellarLayer);

    // Insert layers in the correct order (highest z-index first)
    targetContainer.appendChild(harmonicLayer);
    targetContainer.appendChild(flowDynamicsLayer);
    targetContainer.appendChild(stellarLayer);
    targetContainer.appendChild(waveDynamicsLayer);
    targetContainer.appendChild(flowEffectsLayer);
    targetContainer.appendChild(proceduralNebulaLayer);

    Y3KDebug?.debug?.log(
      "DepthLayeredGradientSystem",
      `Initialized ${this.consciousnessLayers.size} consciousness layers`
    );
  }

  /**
   * Find Spotify container for consciousness layers
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
    
    // Handle musical consciousness beat
    this.handleMusicalConsciousnessBeat(data.intensity);

    Y3KDebug?.debug?.log("DepthLayeredGradientSystem", "Music beat processed", {
      bpm: data.bpm,
      intensity: data.intensity,
    });
  }

  private handleMusicEnergy(data: EventData<"music:energy">): void {
    this.updateDepthWithMusicEnergy(data.energy);
    
    // Handle musical consciousness spectral data simulation
    this.handleMusicalConsciousnessSpectralData({
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
   * Handle musical consciousness beat effects (from FluxConsciousnessLayers)
   */
  private handleMusicalConsciousnessBeat(intensity: number): void {
    if (!this.depthSettings.musicalConsciousness.enabled) return;
    
    // Handle beat detection for flow dynamics
    this.updateFlowDynamics(intensity);
  }

  /**
   * Handle musical consciousness spectral data (from FluxConsciousnessLayers)
   */
  private handleMusicalConsciousnessSpectralData(data: { energy: number; valence: number }): void {
    if (!this.depthSettings.musicalConsciousness.enabled) return;
    
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

      // Update transform
      const currentTransform = layer.element.style.transform;
      const newTransform = currentTransform.replace(
        /translate3d\([^)]*\)/,
        `translate3d(${parallaxX}px, ${parallaxY}px, ${-layer.depth}px)`
      );

      layer.element.style.transform = newTransform;
    });
  }

  private updateLayerDimensions(): void {
    this.depthLayers.forEach((layer) => {
      const depthFactor = layer.depth / this.depthSettings.maxDepth;
      const scale = 1 + depthFactor * 0.2;

      // Update scale in transform
      const currentTransform = layer.element.style.transform;
      const newTransform = currentTransform.replace(
        /scale\([^)]*\)/,
        `scale(${scale})`
      );

      layer.element.style.transform = newTransform;
    });
  }

  private updateDepthWithMusicEnergy(energy: number): void {
    const energyModulation = energy * 0.3;

    this.depthLayers.forEach((layer) => {
      const baseOpacity = layer.opacityRange[0];
      const maxOpacity = layer.opacityRange[1];
      const newOpacity =
        baseOpacity + energyModulation * (maxOpacity - baseOpacity);

      layer.element.style.opacity = newOpacity.toString();
    });
  }

  private pulseDepthLayers(intensity: number): void {
    const pulseStrength = intensity * 0.1;

    this.depthLayers.forEach((layer) => {
      const baseScale = layer.scaleRange[0];
      const maxScale = layer.scaleRange[1];
      const pulseScale = baseScale + pulseStrength * (maxScale - baseScale);

      // Temporarily apply pulse scale
      const currentTransform = layer.element.style.transform;
      const newTransform = currentTransform.replace(
        /scale\([^)]*\)/,
        `scale(${pulseScale})`
      );

      layer.element.style.transform = newTransform;

      // Reset after pulse
      setTimeout(() => {
        const resetTransform = layer.element.style.transform.replace(
          /scale\([^)]*\)/,
          `scale(${baseScale})`
        );
        layer.element.style.transform = resetTransform;
      }, 200);
    });
  }

  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isActive) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastAnimationTime;

      // Throttle to 30 FPS for depth layers
      if (deltaTime < 33) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      this.lastAnimationTime = currentTime;

      // Update depth layer animations
      this.updateDepthAnimations(deltaTime);

      // Update performance metrics
      this.updatePerformanceMetrics();

      // Continue animation
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private updateDepthAnimations(deltaTime: number): void {
    const deltaTimeSeconds = deltaTime / 1000; // Convert to seconds for LERP

    this.depthLayers.forEach((layer) => {
      // Update animation phase for organic breathing patterns
      layer.animationPhase += layer.rotationSpeed * deltaTime * 0.001;

      // Calculate target values based on music and consciousness state
      this.updateLayerTargetsFromMusic(layer);

      // Apply LERP smoothing to all properties for framerate-independent animation
      layer.currentOffsetY = Year3000Utilities.lerpSmooth(
        layer.currentOffsetY,
        layer.targetOffsetY,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.parallaxOffset
      );

      layer.currentOpacity = Year3000Utilities.lerpSmooth(
        layer.currentOpacity,
        layer.targetOpacity,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.opacity
      );

      layer.currentBlur = Year3000Utilities.lerpSmooth(
        layer.currentBlur,
        layer.targetBlur,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.blur
      );

      layer.currentHueRotate = Year3000Utilities.lerpSmooth(
        layer.currentHueRotate,
        layer.targetHueRotate,
        deltaTimeSeconds,
        this.lerpHalfLifeValues.hueRotate
      );

      layer.currentScale = Year3000Utilities.lerpSmooth(
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
   * Update layer target values based on music analysis and consciousness state
   */
  private updateLayerTargetsFromMusic(layer: DepthLayer): void {
    // Get music state for consciousness-driven animation
    const musicState = this.musicSyncService?.getCurrentMusicState();

    if (musicState) {
      const { intensity, beat, emotion } = musicState;

      // Calculate organic breathing effect based on music
      const breathingFactor = Math.sin(layer.animationPhase) * 0.05 * intensity;
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * 0.5;

      // Update target opacity with breathing
      layer.targetOpacity = Math.max(
        0,
        Math.min(1, baseOpacity + breathingFactor)
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
      const breathingFactor = Math.sin(layer.animationPhase) * 0.02;
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * 0.5;

      layer.targetOpacity = Math.max(
        0,
        Math.min(1, baseOpacity + breathingFactor)
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
    // Apply transform with smooth values
    layer.element.style.transform =
      `translate3d(0, ${layer.currentOffsetY}px, ${-layer.depth}px) ` +
      `scale(${layer.currentScale})`;

    // Apply opacity
    layer.element.style.opacity = layer.currentOpacity.toString();

    // Apply filter effects
    layer.element.style.filter =
      `blur(${layer.currentBlur}px) ` +
      `hue-rotate(${layer.currentHueRotate}deg)`;
  }

  private updatePerformanceMetrics(): void {
    this.performanceMetrics.totalLayers = this.depthLayers.size;
    this.performanceMetrics.visibleLayers = Array.from(
      this.depthLayers.values()
    ).filter((layer) => parseFloat(layer.element.style.opacity) > 0.01).length;

    this.performanceMetrics.averageDepth =
      Array.from(this.depthLayers.values()).reduce(
        (sum, layer) => sum + layer.depth,
        0
      ) / this.depthLayers.size;

    this.performanceMetrics.parallaxRange = this.depthSettings.parallaxStrength;
    this.performanceMetrics.renderTime =
      performance.now() - this.lastAnimationTime;

    // Update CSS variables for debugging (if controller is available)
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-layers-total",
        this.performanceMetrics.totalLayers.toString()
      );

      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-layers-visible",
        this.performanceMetrics.visibleLayers.toString()
      );
    }
  }

  /**
   * Update consciousness variables (from FluxConsciousnessLayers)
   */
  private updateConsciousnessVariables(): void {
    if (!this.cssConsciousnessController || !this.depthSettings.musicalConsciousness.enabled) return;

    // Runtime performance check - disable if performance degrades
    const currentFPS = (this.performanceMonitor as any)?.currentFPS || 60;
    if (currentFPS < 40 && this.depthSettings.musicalConsciousness.enabled) {
      this.depthSettings.musicalConsciousness.enabled = false;
      this.destroyConsciousnessLayers();
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        `Runtime performance degradation detected - consciousness layers disabled (FPS: ${currentFPS})`
      );
      return;
    }

    const settings = this.depthSettings.musicalConsciousness;

    // Batch all updates to reduce style recalculation
    const updates = [
      ["--sn-gradient-consciousness-level", settings.consciousnessLevel.toString()],
      ["--sn-gradient-temporal-memory", settings.temporalMemory.toString()],
      ["--sn-gradient-harmonic-resonance", settings.harmonicSensitivity.toString()],
      ["--sn-gradient-flow-dynamics", settings.flowDynamics.toString()],
      ["--sn-gradient-nebula-density", settings.stellarDensity.toString()],
      ["--sn-gradient-dimensional-depth", settings.dimensionalDepth.toString()],

      // Pre-calculate derived values to reduce CPU overhead
      ["--sn-gradient-layer-consciousness", "1"],
      ["--sn-gradient-layer-temporal", "0.8"],
      ["--sn-gradient-layer-harmonic", (settings.harmonicSensitivity * 0.6).toString()],
      ["--sn-gradient-layer-flow", (settings.flowDynamics * 0.4).toString()],
      ["--sn-gradient-layer-stellar", (settings.stellarDensity * 0.2).toString()],

      // Wave dynamics (reduce precision to improve performance)
      ["--sn-gradient-wave-intensity", (Math.round(settings.consciousnessLevel * 40) / 100).toString()],
      ["--sn-gradient-flow-intensity", (Math.round(settings.harmonicSensitivity * 30) / 100).toString()],
      ["--sn-gradient-temporal-flow-speed", Math.max(0.5, Math.round(settings.temporalMemory * 100) / 100).toString()],
    ];

    // Apply updates in batch
    updates.forEach(([property, value]) => {
      if (property && value !== undefined && this.cssConsciousnessController) {
        this.cssConsciousnessController.queueCSSVariableUpdate(property, value);
      }
    });
  }

  /**
   * Update spectral variables (from FluxConsciousnessLayers)
   */
  private updateSpectralVariables(): void {
    if (!this.cssConsciousnessController) return;

    // Update spectral analysis variables
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-gradient-bass-response",
      this.spectralData.bassResponse.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-gradient-mid-response",
      this.spectralData.midResponse.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-gradient-treble-response",
      this.spectralData.trebleResponse.toString()
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-gradient-vocal-presence",
      this.spectralData.vocalPresence.toString()
    );
  }

  /**
   * Update flow dynamics (from FluxConsciousnessLayers)
   */
  private updateFlowDynamics(beatIntensity: number): void {
    if (!this.cssConsciousnessController) return;

    // Flow dynamics increase with beat intensity for organic movement
    const flowIntensity = Math.min(
      this.depthSettings.musicalConsciousness.flowDynamics + beatIntensity * 0.3,
      1.0
    );
    this.cssConsciousnessController.queueCSSVariableUpdate(
      "--sn-gradient-flow-dynamics",
      flowIntensity.toString()
    );

    // Gradually decay back to base level
    setTimeout(() => {
      if (this.cssConsciousnessController) {
        this.cssConsciousnessController.queueCSSVariableUpdate(
          "--sn-gradient-flow-dynamics",
          this.depthSettings.musicalConsciousness.flowDynamics.toString()
        );
      }
    }, 500);
  }

  /**
   * Destroy consciousness layers (from FluxConsciousnessLayers)
   */
  private destroyConsciousnessLayers(): void {
    // Remove DOM elements immediately for performance
    this.consciousnessLayers.forEach((layer, key) => {
      if (layer.parentNode) {
        layer.parentNode.removeChild(layer);
      }
    });
    this.consciousnessLayers.clear();

    // Set all consciousness variables to disabled state
    if (this.cssConsciousnessController) {
      const resetVariables = [
        "--sn-gradient-consciousness-level",
        "--sn-gradient-layer-consciousness",
        "--sn-gradient-layer-temporal",
        "--sn-gradient-layer-harmonic",
        "--sn-gradient-layer-flow",
        "--sn-gradient-layer-stellar",
      ];

      resetVariables.forEach((variable) => {
        this.cssConsciousnessController!.queueCSSVariableUpdate(variable, "0");
      });
    }
  }

  public override updateAnimation(deltaTime: number): void {
    // Animation is handled by the animation loop
    // Update consciousness temporal phase
    if (this.depthSettings.musicalConsciousness.enabled && this.cssConsciousnessController) {
      const currentTime = performance.now();
      const temporalPhase = (currentTime / 10000) % 1; // 10 second cycle
      
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-gradient-temporal-phase",
        temporalPhase.toString()
      );
      
      // Update consciousness variables periodically
      if (currentTime % 1000 < 16) { // Roughly every second
        this.updateConsciousnessVariables();
      }
    }
  }

  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    const isHealthy =
      this.depthSettings.enabled &&
      this.depthLayers.size > 0 &&
      this.backgroundContainer !== null;

    return {
      ok: isHealthy,
      details: isHealthy
        ? `Depth system active with ${this.depthLayers.size} layers`
        : "Depth system inactive",
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Unregister from consciousness choreographer
    if (this.consciousnessChoreographer) {
      try {
        this.consciousnessChoreographer.unregisterConsciousnessParticipant(
          "DepthLayeredGradientSystem"
        );
        Y3KDebug?.debug?.log(
          "DepthLayeredGradientSystem",
          "Unregistered from consciousness choreographer"
        );
      } catch (error) {
        Y3KDebug?.debug?.error(
          "DepthLayeredGradientSystem",
          "Error unregistering from consciousness choreographer:",
          error
        );
      }
    }

    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

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

    // Clean up consciousness layers
    this.destroyConsciousnessLayers();

    // Clean up musical consciousness components
    if (this.emotionalGradientMapper) {
      this.emotionalGradientMapper.destroy();
      this.emotionalGradientMapper = null;
    }

    if (this.genreGradientEvolution) {
      this.genreGradientEvolution.destroy();
      this.genreGradientEvolution = null;
    }

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

    // Update layer opacities
    this.depthLayers.forEach((layer) => {
      const depthFactor = layer.depth / this.depthSettings.maxDepth;
      const opacity = 1 - depthFactor * this.depthSettings.depthFogIntensity;
      layer.element.style.opacity = opacity.toString();
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
  // MUSICAL CONSCIOUSNESS API (from FluxConsciousnessLayers)
  // ===================================================================

  public setConsciousnessLevel(level: number): void {
    this.depthSettings.musicalConsciousness.consciousnessLevel = Math.max(0, Math.min(1, level));
    this.updateConsciousnessVariables();
  }

  public setTemporalMemory(memory: number): void {
    this.depthSettings.musicalConsciousness.temporalMemory = Math.max(0, Math.min(1, memory));
    this.updateConsciousnessVariables();
  }

  public setHarmonicSensitivity(sensitivity: number): void {
    this.depthSettings.musicalConsciousness.harmonicSensitivity = Math.max(0, Math.min(1, sensitivity));
    this.updateConsciousnessVariables();
  }

  public setStellarDrift(drift: number): void {
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-gradient-stellar-drift",
        `${drift}deg`
      );
    }
  }

  public getConsciousnessMetrics() {
    return {
      consciousnessLevel: this.depthSettings.musicalConsciousness.consciousnessLevel,
      temporalMemory: this.depthSettings.musicalConsciousness.temporalMemory,
      harmonicSensitivity: this.depthSettings.musicalConsciousness.harmonicSensitivity,
      flowDynamics: this.depthSettings.musicalConsciousness.flowDynamics,
      stellarDensity: this.depthSettings.musicalConsciousness.stellarDensity,
      dimensionalDepth: this.depthSettings.musicalConsciousness.dimensionalDepth,
      spectralData: { ...this.spectralData },
      emotionalProfile:
        this.emotionalGradientMapper?.getCurrentEmotionalProfile() || null,
      gradientState:
        this.emotionalGradientMapper?.getCurrentGradientState() || null,
      currentGenre: this.genreGradientEvolution?.getCurrentGenre() || null,
      genreConfidence: this.genreGradientEvolution?.getGenreConfidence() || 0,
      genreHistory: this.genreGradientEvolution?.getGenreHistory() || [],
    };
  }

  public getEmotionalGradientMapper(): EmotionalGradientMapper | null {
    return this.emotionalGradientMapper;
  }

  public getGenreGradientEvolution(): GenreGradientEvolution | null {
    return this.genreGradientEvolution;
  }

  // ===================================================================
  // CONSCIOUSNESS CHOREOGRAPHER INTEGRATION
  // ===================================================================

  /**
   * Register this depth system as a consciousness participant
   */
  private registerWithConsciousnessChoreographer(): void {
    if (!this.consciousnessChoreographer) {
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Consciousness choreographer not available, skipping registration"
      );
      return;
    }

    try {
      this.consciousnessChoreographer.registerConsciousnessParticipant(this);
      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Successfully registered with consciousness choreographer"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Failed to register with consciousness choreographer:",
        error
      );
    }
  }

  // ===================================================================
  // BACKGROUND SYSTEM PARTICIPANT INTERFACE IMPLEMENTATION
  // ===================================================================

  public get systemPriority(): "low" | "normal" | "high" | "critical" {
    return "high"; // Depth perception is high priority for spatial consciousness
  }

  public getConsciousnessContribution(): any {
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

  public onConsciousnessFieldUpdate(field: ConsciousnessField): void {
    try {
      this.currentConsciousnessField = field;

      // Update depth layers based on consciousness field
      this.updateDepthFromConsciousness(field);

      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        "Updated from consciousness field:",
        {
          rhythmicPulse: field.rhythmicPulse,
          depthPerception: field.depthPerception,
          breathingCycle: field.breathingCycle,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        "Error updating from consciousness field:",
        error
      );
    }
  }

  public onChoreographyEvent(eventType: string, payload: any): void {
    try {
      switch (eventType) {
        case "choreography:rhythm-shift":
          // Adjust parallax speed based on rhythm changes
          const newRhythm = payload.newRhythm?.bpm || 120;
          const rhythmFactor = Math.max(0.5, Math.min(2.0, newRhythm / 120));

          // Update all layers with new rhythm-based parallax
          for (const layer of this.depthLayers.values()) {
            layer.parallaxFactor = layer.parallaxFactor * rhythmFactor;
            layer.rotationSpeed = layer.rotationSpeed * rhythmFactor;
          }
          break;

        case "choreography:energy-surge":
          // Intensify depth fog during energy surges
          const surgeIntensity = payload.intensity || 1.0;
          this.depthSettings.depthFogIntensity = Math.min(
            1.0,
            this.depthSettings.depthFogIntensity * (1.0 + surgeIntensity * 0.3)
          );
          this.updateDepthFogIntensity();
          break;

        case "consciousness:breathing-cycle":
          // Synchronize layer scale with consciousness breathing
          const breathingPhase = payload.phase || 0;
          this.updateLayerScalesWithBreathing(breathingPhase);
          break;

        case "consciousness:cellular-growth":
          // Adjust depth perception during growth phases
          const growthRate = payload.growthRate || 1.0;
          this.depthSettings.maxDepth = Math.max(
            5,
            Math.min(20, this.depthSettings.maxDepth * growthRate)
          );
          this.updateDepthPerception();
          break;
      }

      Y3KDebug?.debug?.log(
        "DepthLayeredGradientSystem",
        `Handled choreography event: ${eventType}`,
        payload
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthLayeredGradientSystem",
        `Error handling choreography event ${eventType}:`,
        error
      );
    }
  }

  /**
   * Update depth layers based on consciousness field
   */
  private updateDepthFromConsciousness(field: ConsciousnessField): void {
    // Modulate parallax strength with rhythmic pulse
    const consciousParallax =
      this.depthSettings.parallaxStrength * (0.7 + field.rhythmicPulse * 0.6);

    // Update layer properties based on consciousness
    for (const [layerId, layer] of this.depthLayers.entries()) {
      if (!layer.element) continue;

      // Modulate opacity with musical flow
      const baseOpacity =
        layer.opacityRange[0] +
        (layer.opacityRange[1] - layer.opacityRange[0]) * field.musicalFlow.x;
      const consciousOpacity =
        baseOpacity * (0.8 + field.depthPerception * 0.4);

      // Modulate scale with breathing cycle
      const breathingScale =
        1.0 + Math.sin(field.breathingCycle * Math.PI * 2) * 0.05;
      const baseScale =
        layer.scaleRange[0] +
        (layer.scaleRange[1] - layer.scaleRange[0]) * field.energyResonance;
      const consciousScale = baseScale * breathingScale;

      // Apply transformations
      layer.element.style.opacity = consciousOpacity.toString();
      layer.element.style.transform = `
        scale(${consciousScale})
        translateZ(${layer.depth * consciousParallax}px)
        rotateZ(${layer.animationPhase * layer.rotationSpeed}deg)
      `;

      // Update blur based on depth perception
      const consciousBlur =
        layer.blurAmount * (1.0 + field.depthPerception * 0.5);
      layer.element.style.filter = `blur(${consciousBlur}px)`;
    }

    // Apply consciousness-aware CSS variables for hybrid coordination
    if (this.cssConsciousnessController) {
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-consciousness-parallax",
        consciousParallax.toString()
      );
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-perception-intensity",
        field.depthPerception.toString()
      );
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-fog-consciousness",
        this.depthSettings.depthFogIntensity.toString()
      );
      this.cssConsciousnessController.queueCSSVariableUpdate(
        "--sn-depth-spatial-awareness",
        (
          this.performanceMetrics.visibleLayers /
          this.performanceMetrics.totalLayers
        ).toString()
      );
    }
  }

  /**
   * Update layer scales with breathing pattern
   */
  private updateLayerScalesWithBreathing(breathingPhase: number): void {
    const breathingModulation = Math.sin(breathingPhase * Math.PI * 2) * 0.03; // Subtle breathing

    for (const layer of this.depthLayers.values()) {
      if (!layer.element) continue;

      const currentTransform = layer.element.style.transform;
      const baseScale =
        layer.scaleRange[0] + (layer.scaleRange[1] - layer.scaleRange[0]) * 0.5;
      const breathingScale = baseScale * (1.0 + breathingModulation);

      // Update only the scale part of the transform
      layer.element.style.transform = currentTransform.replace(
        /scale\([^)]+\)/,
        `scale(${breathingScale})`
      );
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

      // Apply fog effect as box-shadow
      layer.element.style.boxShadow = `inset 0 0 ${
        50 * fogIntensity
      }px rgba(30, 30, 46, ${fogOpacity})`;
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
        // Update perspective transform
        layer.element.style.transform = layer.element.style.transform.replace(
          /translateZ\([^)]+\)/,
          `translateZ(${layer.depth * this.depthSettings.parallaxStrength}px)`
        );
      }
    });
  }
}
