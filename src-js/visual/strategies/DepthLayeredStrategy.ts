/**
 * DepthLayeredStrategy - ColorOrchestrator Strategy Implementation
 *
 * Transforms the DepthLayeredGradientSystem into a proper IColorProcessor strategy
 * for the unified ColorOrchestrator architecture. Handles infinite space illusion
 * through depth-layered gradients with parallax effects and music synchronization.
 *
 * Philosophy: "Create infinite depth through visual effects layers—each gradient becomes
 * a dimensional portal extending the interface into limitless cosmic space."
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { getGlobalOptimizedCSSController, OptimizedCSSVariableManager } from "@/core/performance/OptimizedCSSVariableManager";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  ColorContext,
  ColorResult,
  IColorProcessor,
} from "@/types/colorStrategy";
import { settings } from "@/config";
import * as Utils from "@/utils/core/ThemeUtilities";

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
  gradientColors: string[];
}

interface DepthLayeredState {
  containerElement: HTMLElement | null;
  backgroundContainer: HTMLElement | null;
  depthLayers: Map<string, DepthLayer>;
  animationFrameId: number | null;
  lastAnimationTime: number;
  scrollY: number;
  scrollX: number;
  lastUpdateTime: number;
  isInitialized: boolean;
  stylesInjected: boolean;
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
  musicResponsiveness: number; // 0-2
}

interface DepthPerformanceMetrics {
  totalLayers: number;
  visibleLayers: number;
  averageDepth: number;
  parallaxRange: number;
  renderTime: number;
  memoryUsage: number;
}

export class DepthLayeredStrategy implements IColorProcessor {
  private utils = Utils;
  private config = ADVANCED_SYSTEM_CONFIG;
  private deviceDetector: DeviceCapabilityDetector;
  private cssController: OptimizedCSSVariableManager | null = null;

  private depthState: DepthLayeredState = {
    containerElement: null,
    backgroundContainer: null,
    depthLayers: new Map(),
    animationFrameId: null,
    lastAnimationTime: 0,
    scrollY: 0,
    scrollX: 0,
    lastUpdateTime: 0,
    isInitialized: false,
    stylesInjected: false,
  };

  private depthSettings: DepthSettings = {
    enabled: true,
    layerCount: 6,
    maxDepth: 1000,
    parallaxStrength: 0.5,
    depthFogIntensity: 0.7,
    infiniteScrolling: true,
    qualityLevel: "medium",
    performanceMode: false,
    musicResponsiveness: 1.0,
  };

  private performanceMetrics: DepthPerformanceMetrics = {
    totalLayers: 0,
    visibleLayers: 0,
    averageDepth: 0,
    parallaxRange: 0,
    renderTime: 0,
    memoryUsage: 0,
  };

  private layerTemplates = {
    cosmic: {
      animation: "cosmic-drift",
      duration: "120s",
      baseGradient:
        "radial-gradient(ellipse at center, {primary} 0%, {secondary} 50%, {base} 100%)",
    },
    nebula: {
      animation: "nebula-flow",
      duration: "180s",
      baseGradient:
        "conic-gradient(from 45deg, {primary} 0%, {secondary} 25%, {tertiary} 50%, {quaternary} 75%, {primary} 100%)",
    },
    stellar: {
      animation: "stellar-motion",
      duration: "240s",
      baseGradient:
        "linear-gradient(45deg, {primary} 0%, {secondary} 25%, {tertiary} 50%, {quaternary} 75%, {primary} 100%)",
    },
    quantum: {
      animation: "quantum-field",
      duration: "300s",
      baseGradient:
        "radial-gradient(circle at 30% 70%, {primary} 0%, transparent 50%), radial-gradient(circle at 70% 30%, {secondary} 0%, transparent 50%)",
    },
    dimensional: {
      animation: "dimensional-shift",
      duration: "360s",
      baseGradient:
        "linear-gradient(135deg, {primary} 0%, {secondary} 20%, {tertiary} 40%, {quaternary} 60%, {primary} 80%, {secondary} 100%)",
    },
    void: {
      animation: "void-expansion",
      duration: "480s",
      baseGradient:
        "radial-gradient(ellipse at center, {base} 0%, {secondary} 30%, {primary} 60%, transparent 100%)",
    },
  };

  // Event handlers
  private boundScrollHandler: ((event: Event) => void) | null = null;
  private boundResizeHandler: ((event: Event) => void) | null = null;

  constructor() {
    this.deviceDetector = new DeviceCapabilityDetector();

    // Get CSS visual effects controller
    this.cssController = getGlobalOptimizedCSSController();

    // Load settings and adapt to device capabilities
    this.loadDepthSettings();
    this.adaptToDeviceCapabilities();

    // Bind event handlers
    this.boundScrollHandler = this.handleScroll.bind(this);
    this.boundResizeHandler = this.handleResize.bind(this);

    Y3KDebug?.debug?.log(
      "DepthLayeredStrategy",
      "Depth layered strategy initialized",
      {
        layerCount: this.depthSettings.layerCount,
        qualityLevel: this.depthSettings.qualityLevel,
        deviceCapability: this.deviceDetector.recommendPerformanceQuality(),
      }
    );
  }

  /**
   * IColorProcessor interface implementation
   */
  getStrategyName(): string {
    return "depth-layered";
  }

  /**
   * Check if strategy can handle the given context
   */
  canProcess(context: ColorContext): boolean {
    // Always can process - depth layers enhance any color context
    return this.depthSettings.enabled;
  }

  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number {
    // Variable processing time based on layer count and quality
    const baseTime = 15; // ~15ms for depth processing
    const layerMultiplier = this.depthSettings.layerCount / 6; // Normalized to default 6 layers
    const qualityMultiplier =
      this.depthSettings.qualityLevel === "high"
        ? 1.3
        : this.depthSettings.qualityLevel === "low"
        ? 0.7
        : 1.0;

    return Math.round(baseTime * layerMultiplier * qualityMultiplier);
  }

  /**
   * Process colors using Depth Layered strategy
   */
  async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();

    try {
      // Initialize depth system if not already done
      if (!this.depthState.isInitialized) {
        await this.initializeDepthSystem();
      }

      // Extract and create depth-conscious color layers
      const depthColors = this.extractDepthColors(context.rawColors);
      await this.updateDepthLayers(depthColors);

      // Start animation if not running
      if (!this.depthState.animationFrameId) {
        this.startDepthAnimation();
      }

      // Update depth based on music data
      if (context.musicData?.energy !== undefined) {
        this.updateDepthWithMusicEnergy(context.musicData.energy);
      }

      // Update state
      this.depthState.lastUpdateTime = Date.now();
      this.updatePerformanceMetrics();

      const processingTime = performance.now() - startTime;

      const result: ColorResult = {
        processedColors: {
          depthLayers: this.depthState.depthLayers.size.toString(),
          depthEnabled: this.depthSettings.enabled.toString(),
          qualityLevel: this.depthSettings.qualityLevel,
          ...context.rawColors,
        },
        accentHex: this.selectPrimaryColor(context.rawColors) || "#cba6f7",
        accentRgb: this.convertToRgbString(
          this.selectPrimaryColor(context.rawColors) || "#cba6f7"
        ),
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          cacheKey: `depth-layered-${context.trackUri}`,
          harmonicIntensity: this.depthSettings.parallaxStrength,
          layerCount: this.depthState.depthLayers.size,
        },
        context,
      };

      Y3KDebug?.debug?.log(
        "DepthLayeredStrategy",
        "Depth layered processing completed",
        {
          layerCount: this.depthState.depthLayers.size,
          processingTime,
          trackUri: context.trackUri,
        }
      );

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;

      Y3KDebug?.debug?.error(
        "DepthLayeredStrategy",
        "Depth layered processing failed:",
        error
      );

      return {
        processedColors: context.rawColors,
        accentHex: this.selectPrimaryColor(context.rawColors) || "#cba6f7",
        accentRgb: this.convertToRgbString(
          this.selectPrimaryColor(context.rawColors) || "#cba6f7"
        ),
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        context,
      };
    }
  }

  /**
   * Load depth settings from settings manager
   */
  private loadDepthSettings(): void {
    try {
      // Use gradient intensity as proxy for depth quality since we don't have specific depth settings
      const gradientIntensity = settings.get("sn-gradient-intensity");
      
      if (gradientIntensity) {
        const qualityLevel = gradientIntensity === "intense" ? "high" : 
                           gradientIntensity === "balanced" ? "medium" : 
                           gradientIntensity === "minimal" ? "low" : "medium";
        this.depthSettings.qualityLevel = qualityLevel;
        this.adjustQualitySettings();
      }

      // Depth is enabled unless gradient intensity is disabled
      const enabledSetting = gradientIntensity !== "disabled";
      if (enabledSetting !== undefined) {
        this.depthSettings.enabled = enabledSetting;
      }
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "DepthLayeredStrategy",
        "Failed to load settings:",
        error
      );
    }
  }

  /**
   * Adapt settings to device capabilities
   */
  private adaptToDeviceCapabilities(): void {
    const recommendation = this.deviceDetector.recommendPerformanceQuality();

    switch (recommendation) {
      case "low":
        this.depthSettings.qualityLevel = "low";
        this.depthSettings.layerCount = 3;
        this.depthSettings.performanceMode = true;
        this.depthSettings.parallaxStrength = 0.3;
        this.depthSettings.depthFogIntensity = 0.5;
        break;

      case "balanced":
        this.depthSettings.qualityLevel = "medium";
        this.depthSettings.layerCount = 6;
        this.depthSettings.performanceMode = false;
        this.depthSettings.parallaxStrength = 0.5;
        this.depthSettings.depthFogIntensity = 0.7;
        break;

      case "high":
        this.depthSettings.qualityLevel = "high";
        this.depthSettings.layerCount = 9;
        this.depthSettings.performanceMode = false;
        this.depthSettings.parallaxStrength = 0.8;
        this.depthSettings.depthFogIntensity = 0.9;
        break;
    }
  }

  /**
   * Adjust quality settings based on selected level
   */
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

  /**
   * Initialize depth system
   */
  private async initializeDepthSystem(): Promise<void> {
    // Create container elements
    this.createContainerElements();

    // Inject CSS animations
    this.injectDepthAnimations();

    // Setup event listeners
    this.setupEventListeners();

    this.depthState.isInitialized = true;

    Y3KDebug?.debug?.log(
      "DepthLayeredStrategy",
      "Depth system initialized successfully"
    );
  }

  /**
   * Create container elements for depth layers
   */
  private createContainerElements(): void {
    // Find main container
    this.depthState.containerElement =
      (document.querySelector(".Root__main-view") as HTMLElement) ||
      (document.querySelector(".main-view-container") as HTMLElement) ||
      document.body;

    // Create background container
    this.depthState.backgroundContainer = document.createElement("div");
    this.depthState.backgroundContainer.className =
      "sn-depth-background-container";
    this.depthState.backgroundContainer.style.cssText = `
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
    this.depthState.containerElement.insertBefore(
      this.depthState.backgroundContainer,
      this.depthState.containerElement.firstChild
    );
  }

  /**
   * Inject CSS animations for depth layers
   */
  private injectDepthAnimations(): void {
    if (this.depthState.stylesInjected) return;

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

      @media (prefers-reduced-motion: reduce) {
        .sn-depth-layer {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styleElement);
    this.depthState.stylesInjected = true;
  }

  /**
   * Setup event listeners for depth system
   */
  private setupEventListeners(): void {
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
  }

  /**
   * Extract depth colors from color context
   */
  private extractDepthColors(colors: Record<string, string>): string[] {
    const priorities = [
      "PRIMARY",
      "VIBRANT",
      "LIGHT_VIBRANT",
      "DARK_VIBRANT",
      "VIBRANT_NON_ALARMING",
      "PROMINENT",
      "SECONDARY",
      "DESATURATED",
    ];

    const depthColors = [];
    const usedColors = new Set<string>();

    // Extract unique colors for depth layers
    for (const key of priorities) {
      const color = colors[key];
      if (color && !usedColors.has(color) && this.utils.hexToRgb(color)) {
        depthColors.push(color);
        usedColors.add(color);

        if (depthColors.length >= this.depthSettings.layerCount) break;
      }
    }

    // Fill remaining slots with variations if needed
    while (depthColors.length < this.depthSettings.layerCount) {
      const baseColor = depthColors[0] || "#cba6f7";
      const variation = this.createColorVariation(
        baseColor,
        depthColors.length
      );
      depthColors.push(variation);
    }

    return depthColors;
  }

  /**
   * Create color variation for depth layers
   */
  private createColorVariation(baseColor: string, index: number): string {
    const rgb = this.utils.hexToRgb(baseColor);
    if (!rgb) return baseColor;

    // Create subtle variations for depth
    const factor = 0.8 - index * 0.1; // Darken deeper layers
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);

    return this.utils.rgbToHex(r, g, b);
  }

  /**
   * Update depth layers with new colors
   */
  private async updateDepthLayers(depthColors: string[]): Promise<void> {
    if (!this.depthState.backgroundContainer) return;

    // Clear existing layers
    this.depthState.depthLayers.forEach((layer) => {
      if (layer.element.parentNode) {
        layer.element.parentNode.removeChild(layer.element);
      }
    });
    this.depthState.depthLayers.clear();

    // Create new layers
    const layerTemplateKeys = Object.keys(this.layerTemplates);

    for (let i = 0; i < this.depthSettings.layerCount; i++) {
      const depth =
        (i + 1) * (this.depthSettings.maxDepth / this.depthSettings.layerCount);
      const templateKey = layerTemplateKeys[i % layerTemplateKeys.length];
      const template =
        this.layerTemplates[templateKey as keyof typeof this.layerTemplates];

      // Create layer element
      const layerElement = document.createElement("div");
      layerElement.className = "sn-depth-layer";
      layerElement.id = `sn-depth-layer-${i}`;

      // Calculate layer properties
      const depthFactor = depth / this.depthSettings.maxDepth;
      const parallaxFactor =
        1 - depthFactor * this.depthSettings.parallaxStrength;
      const opacity = 1 - depthFactor * this.depthSettings.depthFogIntensity;
      const scale = 1 + depthFactor * 0.2;
      const blur = depthFactor * 3;

      // Create gradient with extracted colors
      const gradient = this.createDepthGradient(
        template.baseGradient,
        depthColors,
        i
      );

      // Set layer styles
      layerElement.style.cssText = `
        background: ${gradient};
        transform: translate3d(0, 0, ${-depth}px) scale(${scale});
        opacity: ${opacity};
        filter: blur(${blur}px);
        animation: ${template.animation} ${
        template.duration
      } ease-in-out infinite;
        animation-delay: ${i * 0.5}s;
      `;

      // Create depth layer object
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
        gradientColors: depthColors.slice(i, i + 4),
      };

      // Store layer
      this.depthState.depthLayers.set(depthLayer.id, depthLayer);

      // Add to container
      this.depthState.backgroundContainer.appendChild(layerElement);
    }

    Y3KDebug?.debug?.log(
      "DepthLayeredStrategy",
      `Updated ${this.depthState.depthLayers.size} depth layers with new colors`
    );
  }

  /**
   * Create depth gradient from template and colors
   */
  private createDepthGradient(
    template: string,
    colors: string[],
    layerIndex: number
  ): string {
    const colorCount = colors.length;
    const primaryIndex = layerIndex % colorCount;
    const secondaryIndex = (layerIndex + 1) % colorCount;
    const tertiaryIndex = (layerIndex + 2) % colorCount;
    const quaternaryIndex = (layerIndex + 3) % colorCount;

    // Convert colors to RGBA with appropriate opacity for depth
    const depthFactor = layerIndex / this.depthSettings.layerCount;
    const baseOpacity = 0.8 - depthFactor * 0.6; // Fade deeper layers

    const primary = this.convertToRgba(
      colors[primaryIndex] || "#cba6f7",
      baseOpacity
    );
    const secondary = this.convertToRgba(
      colors[secondaryIndex] || "#f5c2e7",
      baseOpacity * 0.7
    );
    const tertiary = this.convertToRgba(
      colors[tertiaryIndex] || "#fab387",
      baseOpacity * 0.5
    );
    const quaternary = this.convertToRgba(
      colors[quaternaryIndex] || "#a6e3a1",
      baseOpacity * 0.3
    );
    const base = this.convertToRgba("#1e1e2e", baseOpacity * 0.9);

    // Replace template placeholders
    return template
      .replace(/\{primary\}/g, primary)
      .replace(/\{secondary\}/g, secondary)
      .replace(/\{tertiary\}/g, tertiary)
      .replace(/\{quaternary\}/g, quaternary)
      .replace(/\{base\}/g, base);
  }

  /**
   * Convert hex color to RGBA string
   */
  private convertToRgba(hex: string, alpha: number): string {
    const rgb = this.utils.hexToRgb(hex);
    return rgb
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
      : `rgba(203, 166, 247, ${alpha})`;
  }

  /**
   * Start depth animation loop
   */
  private startDepthAnimation(): void {
    this.depthState.lastAnimationTime = performance.now();

    const animate = () => {
      if (!this.depthState.isInitialized) return;

      const currentTime = performance.now();
      const deltaTime = currentTime - this.depthState.lastAnimationTime;

      // Throttle to 30 FPS for depth layers
      if (deltaTime < 33) {
        this.depthState.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      this.depthState.lastAnimationTime = currentTime;

      // Update depth animations
      this.updateDepthAnimations(deltaTime);

      // Update performance metrics
      this.updatePerformanceMetrics();

      // Continue animation
      this.depthState.animationFrameId = requestAnimationFrame(animate);
    };

    this.depthState.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Update depth animations
   */
  private updateDepthAnimations(deltaTime: number): void {
    this.depthState.depthLayers.forEach((layer) => {
      // Update animation phase
      layer.animationPhase += layer.rotationSpeed * deltaTime * 0.001;

      // Apply subtle depth pulsing
      const pulsingFactor = Math.sin(layer.animationPhase) * 0.05;
      const currentOpacity = parseFloat(layer.element.style.opacity);
      const newOpacity = currentOpacity + pulsingFactor;

      layer.element.style.opacity = Math.max(
        0,
        Math.min(1, newOpacity)
      ).toString();
    });
  }

  /**
   * Update depth with music energy
   */
  private updateDepthWithMusicEnergy(energy: number): void {
    const energyModulation =
      energy * this.depthSettings.musicResponsiveness * 0.3;

    this.depthState.depthLayers.forEach((layer) => {
      const baseOpacity = layer.opacityRange[0];
      const maxOpacity = layer.opacityRange[1];
      const newOpacity =
        baseOpacity + energyModulation * (maxOpacity - baseOpacity);

      layer.element.style.opacity = Math.max(
        0,
        Math.min(1, newOpacity)
      ).toString();
    });
  }

  /**
   * Handle scroll events for parallax
   */
  private handleScroll(event: Event): void {
    if (!this.depthSettings.infiniteScrolling) return;

    this.depthState.scrollY = window.scrollY;
    this.depthState.scrollX = window.scrollX;

    // Update parallax effects
    this.updateParallaxEffects();
  }

  /**
   * Handle resize events
   */
  private handleResize(event: Event): void {
    // Update layer dimensions
    this.updateLayerDimensions();
  }

  /**
   * Update parallax effects
   */
  private updateParallaxEffects(): void {
    this.depthState.depthLayers.forEach((layer) => {
      const parallaxY = this.depthState.scrollY * layer.parallaxFactor;
      const parallaxX = this.depthState.scrollX * layer.parallaxFactor * 0.5;

      // Update transform
      const currentTransform = layer.element.style.transform;
      const newTransform = currentTransform.replace(
        /translate3d\([^)]*\)/,
        `translate3d(${parallaxX}px, ${parallaxY}px, ${-layer.depth}px)`
      );

      layer.element.style.transform = newTransform;
    });
  }

  /**
   * Update layer dimensions
   */
  private updateLayerDimensions(): void {
    this.depthState.depthLayers.forEach((layer) => {
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

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    this.performanceMetrics.totalLayers = this.depthState.depthLayers.size;
    this.performanceMetrics.visibleLayers = Array.from(
      this.depthState.depthLayers.values()
    ).filter((layer) => parseFloat(layer.element.style.opacity) > 0.01).length;

    this.performanceMetrics.averageDepth =
      Array.from(this.depthState.depthLayers.values()).reduce(
        (sum, layer) => sum + layer.depth,
        0
      ) / this.depthState.depthLayers.size;

    this.performanceMetrics.parallaxRange = this.depthSettings.parallaxStrength;
    this.performanceMetrics.renderTime =
      performance.now() - this.depthState.lastAnimationTime;

    // Update CSS variables for debugging
    if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(
        "--sn-depth-layers-total",
        this.performanceMetrics.totalLayers.toString()
      );

      this.cssController.queueCSSVariableUpdate(
        "--sn-depth-layers-visible",
        this.performanceMetrics.visibleLayers.toString()
      );
    }
  }

  /**
   * Select primary color from extracted colors
   */
  private selectPrimaryColor(colors: Record<string, string>): string | null {
    const priorities = [
      "PRIMARY",
      "VIBRANT",
      "PROMINENT",
      "VIBRANT_NON_ALARMING",
      "LIGHT_VIBRANT",
    ];

    for (const key of priorities) {
      const color = colors[key];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }

    return null;
  }

  /**
   * Convert hex color to RGB string
   */
  private convertToRgbString(hex: string): string {
    const rgb = this.utils.hexToRgb(hex);
    return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : "203,166,247";
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<DepthSettings>): void {
    this.depthSettings = { ...this.depthSettings, ...newConfig };

    // Apply configuration changes
    if (newConfig.qualityLevel) {
      this.adjustQualitySettings();
    }

    Y3KDebug?.debug?.log(
      "DepthLayeredStrategy",
      "Configuration updated:",
      newConfig
    );
  }

  /**
   * Health check for strategy status
   */
  public async healthCheck(): Promise<any> {
    const hasRecentUpdate = Date.now() - this.depthState.lastUpdateTime < 30000; // 30s

    return {
      healthy: this.depthState.isInitialized && this.depthSettings.enabled,
      canProcess: this.canProcess({} as ColorContext),
      issues: !this.depthState.isInitialized
        ? ["Depth system not initialized"]
        : !this.depthSettings.enabled
        ? ["Depth layers disabled in settings"]
        : [],
      metrics: {
        isInitialized: this.depthState.isInitialized,
        depthEnabled: this.depthSettings.enabled,
        layerCount: this.depthState.depthLayers.size,
        qualityLevel: this.depthSettings.qualityLevel,
        parallaxStrength: this.depthSettings.parallaxStrength,
        hasRecentUpdate,
        animationActive: this.depthState.animationFrameId !== null,
        performanceMetrics: this.performanceMetrics,
      },
    };
  }

  /**
   * Cleanup depth resources
   */
  public destroy(): void {
    // Stop animation
    if (this.depthState.animationFrameId) {
      cancelAnimationFrame(this.depthState.animationFrameId);
      this.depthState.animationFrameId = null;
    }

    // Remove event listeners
    if (this.boundScrollHandler) {
      window.removeEventListener("scroll", this.boundScrollHandler);
      this.boundScrollHandler = null;
    }

    if (this.boundResizeHandler) {
      window.removeEventListener("resize", this.boundResizeHandler);
      this.boundResizeHandler = null;
    }

    // Clean up depth layers
    this.depthState.depthLayers.forEach((layer) => {
      if (layer.element.parentNode) {
        layer.element.parentNode.removeChild(layer.element);
      }
    });
    this.depthState.depthLayers.clear();

    // Remove background container
    if (
      this.depthState.backgroundContainer &&
      this.depthState.backgroundContainer.parentNode
    ) {
      this.depthState.backgroundContainer.parentNode.removeChild(
        this.depthState.backgroundContainer
      );
      this.depthState.backgroundContainer = null;
    }

    // Reset state
    this.depthState.isInitialized = false;
    this.depthState.containerElement = null;

    Y3KDebug?.debug?.log(
      "DepthLayeredStrategy",
      "Depth layered strategy destroyed"
    );
  }
}
