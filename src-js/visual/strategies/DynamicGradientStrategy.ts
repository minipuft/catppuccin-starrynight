/**
 * DynamicGradientStrategy - ColorOrchestrator Strategy Implementation
 *
 * Transforms static backgrounds into dynamic visual foundations through
 * the strategy pattern. Handles responsive animations, WebGL coordination, and
 * music-responsive gradient transformations.
 *
 * Provides dynamic gradient processing with music synchronization,
 * color extraction integration, and performance-optimized visual effects.
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { unifiedEventBus, type UnifiedEventMap } from "@/core/events/EventBus";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type {
  ColorContext,
  ColorResult,
  IColorProcessor,
} from "@/types/colorStrategy";
import { settings } from "@/config";
import {
  OKLABColorProcessor,
  type OKLABProcessingResult,
} from "@/utils/color/OKLABColorProcessor";
import * as Utils from "@/utils/core/ThemeUtilities";
import { ServiceVisualSystemBase } from "@/core/services/SystemServiceBridge";
import type { ServiceContainer } from "@/core/services/SystemServices";

interface DynamicGradientState {
  currentBaseHex: string;
  currentBaseRgb: string;
  currentPrimaryHex: string;
  currentPrimaryRgb: string;
  visualEffectsIntensity: number;
  musicEnergy: number;
  lastUpdateTime: number;
  webglIntegrationActive: boolean;
  oklabGradientStops: OKLABProcessingResult[];
}

interface DynamicGradientConfig {
  baseTransformationEnabled: boolean;
  webglIntegrationEnabled: boolean;
  responsiveAnimationEnabled: boolean;
  visualEffectsLayerOpacity: number; // 0-1
  dynamicFlowIntensity: number; // 0-2
  musicResponsiveness: number; // 0-2
  oklabInterpolationEnabled: boolean;
  oklabPreset: string; // OKLAB enhancement preset name
  gradientSmoothness: number; // 0-1, controls gradient transition smoothness
  animationThrottleFps: number; // Target FPS for animation animation (default: 30)
  enablePerformanceBudget: boolean; // Enable 16ms frame budget enforcement
  maxFrameTimeMs: number; // Maximum allowed frame time in milliseconds
}

export class DynamicGradientStrategy
  extends ServiceVisualSystemBase
  implements IColorProcessor
{
  private cssController: CSSVariableWriter | null = null;
  private oklabProcessor: OKLABColorProcessor;
  private deviceDetector: DeviceCapabilityDetector;
  protected override utils = Utils;
  protected override config = ADVANCED_SYSTEM_CONFIG;

  private livingBaseState: DynamicGradientState = {
    currentBaseHex: "#1e1e2e", // Catppuccin base
    currentBaseRgb: "30,30,46",
    currentPrimaryHex: "var(--sn-brightness-adjusted-accent-hex, #cba6f7)", // Brightness-adjusted default
    currentPrimaryRgb: "var(--sn-brightness-adjusted-accent-rgb, 203, 166, 247)", // Brightness-adjusted default
    visualEffectsIntensity: 0.5,
    musicEnergy: 0.5,
    lastUpdateTime: 0,
    webglIntegrationActive: false,
    oklabGradientStops: [],
  };

  private gradientConfig: DynamicGradientConfig = {
    baseTransformationEnabled: true,
    webglIntegrationEnabled: true,
    responsiveAnimationEnabled: true,
    visualEffectsLayerOpacity: 0.08, // Subtle but visible
    dynamicFlowIntensity: 1.2,
    musicResponsiveness: 1.0,
    oklabInterpolationEnabled: true,
    oklabPreset: "STANDARD", // Use standard OKLAB enhancement for gradients
    gradientSmoothness: 0.8, // High smoothness for natural transitions
    animationThrottleFps: 30, // 30fps for smooth animation while conserving performance
    enablePerformanceBudget: true, // Enable frame budget enforcement
    maxFrameTimeMs: 16, // 16ms budget for 60fps main thread responsiveness
  };

  // CSS Animation Manager integration for Year 3000 performance revolution  
  private cssAnimationManager: any = null; // Will be injected (AnimationFrameCoordinator or interface)

  // OKLAB calculation caching
  private oklabCache = new Map<string, OKLABProcessingResult[]>();
  private gradientCache = new Map<string, string>();
  private cacheValidityMs: number = 5000; // Cache valid for 5 seconds
  private lastCacheCleanup: number = 0;
  private domEventCleanups: Array<() => void> = [];
  private busSubscriptionIds: string[] = [];

  constructor(
    config = ADVANCED_SYSTEM_CONFIG,
    utils = Utils,
    performanceMonitor: any = null,
    musicSyncService: any = null,
    cssController?: CSSVariableWriter,
    cssAnimationManager?: any
  ) {
    // Call BaseVisualSystem constructor
    super(
      config,
      utils,
      performanceMonitor,
      musicSyncService
    );

    const resolvedCssController =
      cssController ||
      (this.cssConsciousnessController as CSSVariableWriter | null) ||
      getGlobalCSSVariableWriter();

    if (resolvedCssController) {
      this.cssController = resolvedCssController;
    } else {
      Y3KDebug?.debug?.warn(
        "DynamicGradientStrategy",
        "CSSVariableWriter not available; CSS updates will fall back to direct DOM writes"
      );
    }
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    this.deviceDetector = new DeviceCapabilityDetector();
    this.cssAnimationManager = cssAnimationManager;

    // Initialize base state from existing variables
    this.initializeBaseState();

    // Apply device-aware performance settings (async - non-blocking)
    this.applyDeviceAwareSettings().catch((error) => {
      Y3KDebug?.debug?.warn(
        "DynamicGradientStrategy",
        "Failed to apply device-aware settings:",
        error
      );
    });

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "Living gradient strategy initialized with OKLAB interpolation and device-aware performance"
    );
  }

  public override injectServices(services: ServiceContainer): void {
    super.injectServices(services);

    if (!this.cssController) {
      const controller =
        (this.cssConsciousnessController as CSSVariableWriter | null) ||
        getGlobalCSSVariableWriter();

      if (controller) {
        this.cssController = controller;
      }
    }
  }

  private registerBusEvent<K extends keyof UnifiedEventMap>(
    eventName: K,
    handler: (data: UnifiedEventMap[K]) => void
  ): void {
    if (this.services.events) {
      this.services.events.subscribe(this.systemName, eventName, handler);
      return;
    }

    if (typeof unifiedEventBus !== "undefined") {
      const subscriptionId = unifiedEventBus.subscribe(
        eventName,
        handler,
        this.systemName
      );

      if (subscriptionId) {
        this.busSubscriptionIds.push(subscriptionId);
      }
    }
  }

  private registerDomEvent(
    eventName: string,
    handler: EventListener
  ): void {
    if (this.services.events) {
      this.services.events.subscribeToDOM(
        this.systemName,
        document,
        eventName,
        handler
      );
      return;
    }

    document.addEventListener(eventName, handler);
    this.domEventCleanups.push(() =>
      document.removeEventListener(eventName, handler)
    );
  }

  private async applyCssVariables(
    updates: Record<string, string>,
    options: {
      priority?: "low" | "normal" | "high" | "critical";
      source?: string;
    } = {}
  ): Promise<void> {
    if (this.services.cssVariables) {
      this.services.cssVariables.queueBatchUpdate(updates);
      this.services.cssVariables.flushUpdates();
      return;
    }

    if (this.cssController?.batchSetVariables) {
      await this.cssController.batchSetVariables(
        this.systemName,
        updates,
        options.priority ?? "normal",
        options.source ?? "dynamic-gradient"
      );
      return;
    }

    const root = document.documentElement;
    Object.entries(updates).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }

  /**
   * ServiceVisualSystemBase lifecycle implementation
   */
  protected override async performVisualSystemInitialization(): Promise<void> {
    try {
      // Setup visualEffects event listeners
      this.setupConsciousnessListeners();

      // Setup WebGL integration listeners
      this.setupWebGLIntegrationListeners();

      // Initialize current base state
      this.initializeBaseState();

      // Initialize CSS-first animation visualEffects (Year 3000 performance revolution)
      this.initializeConsciousnessBreathing();

      // Apply initial visualEffects base gradient
      await this.applyLivingConsciousnessBase();

      Y3KDebug?.debug?.log(
        "DynamicGradientStrategy",
        "Living gradient system awakened with visual system lifecycle"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Failed to initialize living gradient system:",
        error
      );
    }
  }

  /**
   * Setup listeners for visualEffects and dynamic color changes
   * Phase 2: Migrated from DOM events to UnifiedEventBus for proper facade coordination
   */
  private setupConsciousnessListeners(): void {
    const harmonizedHandler = (data: any) => {
      if (data && data.processedColors) {
        this.handleHarmonizedColorUpdate(data.processedColors);
      }
    };

    this.registerBusEvent("colors:harmonized", harmonizedHandler);

    const musicStateHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleMusicStateChange(customEvent.detail);
      }
    };

    this.registerDomEvent("music-state-change", musicStateHandler);

    const intensityHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (
        customEvent.detail &&
        typeof customEvent.detail.intensity === "number"
      ) {
        this.updateConsciousnessIntensity(customEvent.detail.intensity);
      }
    };

    this.registerDomEvent("visualEffects-intensity-change", intensityHandler);

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "Consciousness listeners established"
    );
  }

  /**
   * Setup WebGL integration listeners
   */
  private setupWebGLIntegrationListeners(): void {
    const stateChangeHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleWebGLStateChange(customEvent.detail);
      }
    };

    this.registerDomEvent("webgl-state-change", stateChangeHandler);

    const gradientUpdateHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.coordinateWithWebGLGradient(customEvent.detail);
      }
    };

    this.registerDomEvent("webgl-gradient-update", gradientUpdateHandler);

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "WebGL integration listeners established"
    );
  }

  /**
   * Handle harmonized color updates from Dynamic Catppuccin Bridge
   */
  private handleHarmonizedColorUpdate(harmonizedColors: any): void {
    this.debouncedEventHandler("harmonizedColors", () => {
      const primaryColor =
        harmonizedColors.VIBRANT ||
        harmonizedColors.PRIMARY ||
        harmonizedColors.PROMINENT;

      if (
        primaryColor &&
        primaryColor !== this.livingBaseState.currentPrimaryHex
      ) {
        this.livingBaseState.currentPrimaryHex = primaryColor;
        const primaryRgb = this.utils.hexToRgb(primaryColor);
        if (primaryRgb) {
          this.livingBaseState.currentPrimaryRgb = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;
        }

        // Update living visualEffects base and trigger CSS-first animation
        this.updateLivingConsciousnessBase();
        this.triggerConsciousnessBreathing();

        Y3KDebug?.debug?.log(
          "DynamicGradientStrategy",
          "Living base updated with harmonized colors:",
          primaryColor
        );
      }
    });
  }

  /**
   * Handle music state changes for energy-responsive base
   */
  private handleMusicStateChange(musicState: any): void {
    this.debouncedEventHandler("musicState", () => {
      if (musicState.energy !== undefined) {
        this.livingBaseState.musicEnergy = musicState.energy;

        // Update visualEffects intensity based on music energy
        const baseIntensity = 0.5;
        const energyBoost =
          musicState.energy * this.gradientConfig.musicResponsiveness;
        this.livingBaseState.visualEffectsIntensity = Math.max(
          0.1,
          Math.min(1.0, baseIntensity + energyBoost * 0.3)
        );

        // Update CSS variables for real-time response
        this.updateMusicResponsiveVariables();
      }
    });
  }

  /**
   * Handle WebGL system state changes
   */
  private handleWebGLStateChange(webglState: any): void {
    this.debouncedEventHandler("webglState", () => {
      if (webglState.enabled !== undefined) {
        this.livingBaseState.webglIntegrationActive = webglState.enabled;

        // Adjust base system for WebGL coordination
        this.coordinateWithWebGLSystem(webglState.enabled);

        Y3KDebug?.debug?.log(
          "DynamicGradientStrategy",
          `WebGL integration ${
            webglState.enabled ? "activated" : "deactivated"
          }`
        );
      }
    });
  }

  /**
   * Update visualEffects intensity
   */
  private updateConsciousnessIntensity(intensity: number): void {
    this.debouncedEventHandler("visualEffectsIntensity", () => {
      this.livingBaseState.visualEffectsIntensity = Math.max(
        0,
        Math.min(1, intensity)
      );
      this.updateConsciousnessVariables();
    });
  }

  /**
   * Debounced event handler to prevent excessive processing of high-frequency events
   */
  private musicEventDebounceTimers = {
    musicState: 0,
    harmonizedColors: 0,
    webglState: 0,
    visualEffectsIntensity: 0,
  };
  private eventDebounceMs = 100;

  private debouncedEventHandler(
    eventType: keyof typeof this.musicEventDebounceTimers,
    handler: () => void
  ): void {
    const now = performance.now();
    if (
      now - this.musicEventDebounceTimers[eventType] >=
      this.eventDebounceMs
    ) {
      handler();
      this.musicEventDebounceTimers[eventType] = now;
    }
  }

  /**
   * Initialize CSS-first visualEffects animation (Year 3000 performance revolution)
   */
  private initializeConsciousnessBreathing(): void {
    if (!this.gradientConfig.responsiveAnimationEnabled) return;
    if (!this.cssAnimationManager) {
      Y3KDebug?.debug?.warn(
        "DynamicGradientStrategy", 
        "CSSAnimationManager not available, falling back to basic visualEffects"
      );
      return;
    }

    // Trigger initial animation animation with current music state
    this.triggerConsciousnessBreathing();
    
    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "CSS-first visualEffects animation initialized"
    );
  }

  /**
   * Trigger visualEffects animation using CSSAnimationManager (Year 3000 CSS-first)
   */
  private triggerConsciousnessBreathing(): void {
    if (!this.cssAnimationManager || !this.gradientConfig.responsiveAnimationEnabled) return;

    // Get elements for visualEffects animation
    const visualEffectsElements = document.querySelectorAll(
      '.Root__main-view::before, .Root__main-view, [data-visualEffects-animation]'
    );
    
    if (visualEffectsElements.length === 0) {
      // Fallback: apply to main view if pseudo-elements aren't accessible
      const mainView = document.querySelector('.Root__main-view') || document.body;
      if (mainView) {
        mainView.setAttribute('data-visualEffects-animation', 'true');
        this.cssAnimationManager.triggerConsciousnessBreathing(
          [mainView],
          this.livingBaseState.musicEnergy,
          120 // Default tempo
        );
      }
    } else {
      this.cssAnimationManager.triggerConsciousnessBreathing(
        visualEffectsElements,
        this.livingBaseState.musicEnergy,
        120 // Will be updated by music events
      );
    }

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      `CSS-first visualEffects animation triggered for ${visualEffectsElements.length} elements`
    );
  }

  /**
   * Apply device-aware performance settings based on device capabilities
   */
  private async applyDeviceAwareSettings(): Promise<void> {
    // Initialize device detector if not already done
    if (!this.deviceDetector.isInitialized) {
      try {
        await this.deviceDetector.initialize();
      } catch (error) {
        Y3KDebug?.debug?.warn(
          "DynamicGradientStrategy",
          "Device detection failed, using default settings:",
          error
        );
        return;
      }
    }

    const capabilities = this.deviceDetector.getCapabilities();
    if (!capabilities) {
      Y3KDebug?.debug?.warn(
        "DynamicGradientStrategy",
        "No device capabilities available, using default settings"
      );
      return;
    }

    const overallTier = capabilities.overall;

    // Adjust settings based on overall device tier
    switch (overallTier) {
      case "high":
        // High-end devices: Full performance
        this.gradientConfig.animationThrottleFps = 30;
        this.gradientConfig.maxFrameTimeMs = 16;
        this.gradientConfig.enablePerformanceBudget = true;
        // CSS-first animation now handled by CSSAnimationManager
        break;

      case "medium":
        // Mid-range devices: Balanced performance
        this.gradientConfig.animationThrottleFps = 20;
        this.gradientConfig.maxFrameTimeMs = 20;
        this.gradientConfig.enablePerformanceBudget = true;
        // CSS-first animation now handled by CSSAnimationManager
        break;

      case "low":
        // Low-end devices: Performance mode
        this.gradientConfig.animationThrottleFps = 15;
        this.gradientConfig.maxFrameTimeMs = 33;
        this.gradientConfig.enablePerformanceBudget = true;
        // CSS-first animation now handled by CSSAnimationManager
        // Reduce visual effects for low-end devices
        this.gradientConfig.visualEffectsLayerOpacity *= 0.7;
        this.gradientConfig.dynamicFlowIntensity *= 0.8;
        // Disable expensive OKLAB processing on low-end devices
        this.gradientConfig.oklabInterpolationEnabled = false;
        break;

      default:
        // Default to mid-range settings for 'detecting' or unknown
        this.gradientConfig.animationThrottleFps = 20;
        this.gradientConfig.maxFrameTimeMs = 20;
        break;
    }

    // Additional adjustments based on specific capabilities
    if (!capabilities.gpu.supportsWebGL) {
      this.gradientConfig.webglIntegrationEnabled = false;
    }

    if (capabilities.memory.level === "low") {
      // Reduce cache size for memory-constrained devices
      this.cacheValidityMs = 2000; // Shorter cache validity
    }

    if (capabilities.cpu.cores <= 2) {
      // Further reduce performance for single/dual core devices
      this.gradientConfig.animationThrottleFps = Math.min(
        this.gradientConfig.animationThrottleFps,
        15
      );
      // CSS-first animation coordination now handled by CSSAnimationManager
    }

    // Respect user preference for reduced motion
    if (capabilities.display.reducedMotion) {
      this.gradientConfig.responsiveAnimationEnabled = false;
      Y3KDebug?.debug?.log(
        "DynamicGradientStrategy",
        "Breathing animation disabled due to reduced motion preference"
      );
    }

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      `Device-aware settings applied for ${overallTier}: ${this.gradientConfig.animationThrottleFps}fps, CSS-first animation coordination`
    );
  }

  /**
   * IColorProcessor interface implementation
   */
  getStrategyName(): string {
    return "living-gradient";
  }

  /**
   * Check if strategy can handle the given context
   */
  canProcess(context: ColorContext): boolean {
    // Always can process - living gradients enhance any color context
    return this.gradientConfig.baseTransformationEnabled;
  }

  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number {
    // Moderate processing - gradient calculations and CSS updates
    return 8; // ~8ms estimated
  }

  /**
   * Process colors using Living Gradient strategy with OKLAB interpolation
   */
  async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();

    try {
      // Extract primary and secondary colors for gradient creation
      const primaryColor = this.selectPrimaryColor(context.rawColors);
      const secondaryColor = this.selectSecondaryColor(context.rawColors);

      if (!primaryColor) {
        throw new Error("No suitable primary color found for living gradient");
      }

      // Process colors through OKLAB if interpolation is enabled
      let processedPrimary = primaryColor;
      let processedSecondary = secondaryColor;
      let oklabGradientStops: OKLABProcessingResult[] = [];

      if (this.gradientConfig.oklabInterpolationEnabled && primaryColor) {
        const preset = OKLABColorProcessor.getPreset(
          this.gradientConfig.oklabPreset
        );

        // Process primary color through OKLAB
        const primaryResult = this.oklabProcessor.processColor(
          primaryColor,
          preset
        );
        processedPrimary = primaryResult.enhancedHex;

        // Process secondary color if available, or create complement
        if (secondaryColor) {
          const secondaryResult = this.oklabProcessor.processColor(
            secondaryColor,
            preset
          );
          processedSecondary = secondaryResult.enhancedHex;

          // Generate OKLAB gradient stops for smooth transitions
          const stopCount =
            Math.ceil(5 * this.gradientConfig.gradientSmoothness) + 3; // 3-8 stops based on smoothness
          oklabGradientStops = this.oklabProcessor.generateOKLABGradient(
            processedPrimary,
            processedSecondary,
            stopCount,
            preset
          );
        } else {
          // Generate a subtle gradient using lightness variation
          const baseColor = this.livingBaseState.currentBaseHex;
          oklabGradientStops = this.oklabProcessor.generateOKLABGradient(
            processedPrimary,
            baseColor,
            5,
            preset
          );
          processedSecondary =
            oklabGradientStops[oklabGradientStops.length - 1]?.enhancedHex ||
            processedPrimary;
        }

        Y3KDebug?.debug?.log(
          "DynamicGradientStrategy",
          "OKLAB gradient processing applied:",
          {
            originalPrimary: primaryColor,
            processedPrimary,
            originalSecondary: secondaryColor,
            processedSecondary,
            gradientStops: oklabGradientStops.length,
            preset: preset.name,
          }
        );
      }

      // Update living base state with processed colors
      await this.updateDynamicGradientState(
        processedPrimary,
        processedSecondary,
        context,
        oklabGradientStops
      );

      // Create and apply living visualEffects gradients with OKLAB enhancement
      await this.applyLivingConsciousnessBase();

      // Trigger CSS-first visualEffects animation (Year 3000 performance revolution)
      this.triggerConsciousnessBreathing();

      // Update WebGL integration variables
      await this.updateWebGLIntegration();

      const processingTime = performance.now() - startTime;

      const result: ColorResult = {
        processedColors: {
          primary: processedPrimary,
          secondary: processedSecondary || processedPrimary,
          originalPrimary: primaryColor, // Keep original for reference
          ...(secondaryColor && { originalSecondary: secondaryColor }),
          livingBase: this.livingBaseState.currentBaseHex,
          ...context.rawColors,
        },
        accentHex: processedPrimary,
        accentRgb: this.livingBaseState.currentPrimaryRgb,
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          cacheKey: `living-gradient-${context.trackUri}`,
          harmonicIntensity: this.gradientConfig.dynamicFlowIntensity,
          oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
          oklabPreset: this.gradientConfig.oklabPreset,
          gradientStopCount: oklabGradientStops.length,
          gradientSmoothness: this.gradientConfig.gradientSmoothness,
        },
        context,
      };

      Y3KDebug?.debug?.log(
        "DynamicGradientStrategy",
        "Living gradient processing completed",
        {
          originalPrimary: primaryColor,
          processedPrimary,
          originalSecondary: secondaryColor,
          processedSecondary,
          oklabProcessing: this.gradientConfig.oklabInterpolationEnabled,
          gradientStops: oklabGradientStops.length,
          processingTime,
          trackUri: context.trackUri,
        }
      );

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;

      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Living gradient processing failed:",
        error
      );

      // Return fallback result with current state
      return {
        processedColors: context.rawColors,
        accentHex: this.livingBaseState.currentPrimaryHex,
        accentRgb: this.livingBaseState.currentPrimaryRgb,
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
   * Initialize base state from existing CSS variables
   */
  private initializeBaseState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Get current base background
    const currentBase =
      computedStyle.getPropertyValue("--spice-base").trim() || "#1e1e2e";
    this.livingBaseState.currentBaseHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.livingBaseState.currentBaseRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }

    // Get current primary color if available - use official gradient variable
    const currentPrimary = computedStyle
      .getPropertyValue("--sn-bg-gradient-primary-rgb")
      .trim();
    if (currentPrimary) {
      const rgbValues = currentPrimary
        .split(",")
        .map((v) => parseInt(v.trim()));
      if (rgbValues.length === 3) {
        this.livingBaseState.currentPrimaryRgb = currentPrimary;
        this.livingBaseState.currentPrimaryHex = this.utils.rgbToHex(
          rgbValues[0]!,
          rgbValues[1]!,
          rgbValues[2]!
        );
      }
    }

    this.livingBaseState.lastUpdateTime = Date.now();

    Y3KDebug?.debug?.log("DynamicGradientStrategy", "Base state initialized:", {
      base: this.livingBaseState.currentBaseHex,
      primary: this.livingBaseState.currentPrimaryHex,
    });
  }

  /**
   * Select primary color for living gradient
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
   * Select secondary color for gradient complexity
   */
  private selectSecondaryColor(colors: Record<string, string>): string | null {
    const priorities = [
      "SECONDARY",
      "DARK_VIBRANT",
      "DESATURATED",
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
   * Update living base state with new colors and context including OKLAB data
   */
  private async updateDynamicGradientState(
    primaryColor: string,
    secondaryColor: string | null,
    context: ColorContext,
    oklabGradientStops: OKLABProcessingResult[] = []
  ): Promise<void> {
    const primaryRgb = this.utils.hexToRgb(primaryColor);
    if (!primaryRgb) return;

    this.livingBaseState.currentPrimaryHex = primaryColor;
    this.livingBaseState.currentPrimaryRgb = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;

    // Store OKLAB gradient stops for enhanced gradient creation
    this.livingBaseState.oklabGradientStops = oklabGradientStops;

    // Update music energy if available
    if (context.musicData?.energy !== undefined) {
      this.livingBaseState.musicEnergy = context.musicData.energy;

      // Adjust visualEffects intensity based on music energy
      const baseIntensity = this.gradientConfig.visualEffectsLayerOpacity;
      const musicMultiplier =
        1 + context.musicData.energy * this.gradientConfig.musicResponsiveness;
      this.livingBaseState.visualEffectsIntensity = Math.max(
        0.05,
        Math.min(1.0, baseIntensity * musicMultiplier)
      );
    }

    this.livingBaseState.lastUpdateTime = Date.now();
  }

  /**
   * Apply living visualEffects base gradient using coordinated updates
   */
  private async applyLivingConsciousnessBase(): Promise<void> {
    // Create dynamic living gradient that enhances Catppuccin base with OKLAB smoothness
    const visualEffectsGradient = this.createLivingGradient(
      this.livingBaseState.oklabGradientStops
    );

    // Calculate dynamic values (CSS-first animation replaces JavaScript animation calculations)
    const currentTime = performance.now();
    const animationPhase = (currentTime / 4000) * Math.PI * 2; // 4-second cycle for reference
    const animationMultiplier =
      1 + Math.sin(animationPhase) * 0.2;
    const finalOpacity =
      this.livingBaseState.visualEffectsIntensity * animationMultiplier;

    const flowX =
      Math.sin(animationPhase * 0.7) *
      this.gradientConfig.dynamicFlowIntensity;
    const flowY =
      Math.cos(animationPhase * 0.5) *
      this.gradientConfig.dynamicFlowIntensity;

    const baseDuration = 4000; // 4 seconds
    const energyMultiplier = 0.5 + this.livingBaseState.musicEnergy * 1.5; // 0.5x to 2x speed
    const animationDuration = baseDuration / energyMultiplier;

    // Build coordinated variable updates
    const visualEffectsBaseVariables: Record<string, string> = {
      "--living-base-gradient": visualEffectsGradient,
      "--visualEffects-base-gradient": visualEffectsGradient,
      "--visualEffects-layer-opacity": finalOpacity.toString(),
      "--visualEffects-flow-x": `${flowX}%`,
      "--visualEffects-flow-y": `${flowY}%`,
      "--visualEffects-animation-duration": `${animationDuration}ms`,
    };

    // Apply all visualEffects variables in a coordinated batch
    await this.applyCssVariables(visualEffectsBaseVariables, {
      priority: "high",
      source: "living-visualEffects-base",
    });

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "Applied coordinated living visualEffects base gradient"
    );
  }

  /**
   * Create cached gradient key for OKLAB gradient generation
   */
  private createGradientCacheKey(
    primaryRgb: string,
    baseRgb: string,
    oklabGradientStops: OKLABProcessingResult[],
    animationPhase: number
  ): string {
    const stopKey = oklabGradientStops
      .map((stop, index) => `${stop.enhancedHex}-${index}`)
      .join("|");
    return `${primaryRgb}-${baseRgb}-${stopKey}-${Math.floor(
      animationPhase * 10
    )}`;
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();

    // Only clean up every 10 seconds to avoid overhead
    if (now - this.lastCacheCleanup < 10000) return;

    this.lastCacheCleanup = now;

    // Clear gradient cache (it's small and regenerates quickly)
    this.gradientCache.clear();

    // Keep OKLAB cache as it's more expensive to regenerate
    // Note: OKLAB cache is managed by the ColorOrchestrator/SettingsManager

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log("DynamicGradientStrategy", "Cache cleanup completed");
    }
  }

  /**
   * Create living gradient based on current state with OKLAB enhancement and caching
   */
  private createLivingGradient(
    oklabGradientStops: OKLABProcessingResult[] = []
  ): string {
    const primaryRgb = this.livingBaseState.currentPrimaryRgb;
    const baseRgb = this.livingBaseState.currentBaseRgb;

    // Check cache first for performance optimization
    // Use current time-based animation phase for cache key consistency  
    const currentTime = performance.now();
    const animationPhase = (currentTime / 4000) * Math.PI * 2; // 4-second cycle
    const cacheKey = this.createGradientCacheKey(
      primaryRgb,
      baseRgb,
      oklabGradientStops,
      animationPhase
    );

    const cachedGradient = this.gradientCache.get(cacheKey);
    if (cachedGradient) {
      // Periodically clean up cache
      this.cleanupCache();
      return cachedGradient;
    }

    // Generate gradient if not cached
    const gradient = this.generateLivingGradient(
      primaryRgb,
      baseRgb,
      oklabGradientStops
    );

    // Cache the result for future use
    this.gradientCache.set(cacheKey, gradient);

    return gradient;
  }

  /**
   * Generate the actual gradient (extracted for caching)
   */
  private generateLivingGradient(
    primaryRgb: string,
    baseRgb: string,
    oklabGradientStops: OKLABProcessingResult[]
  ): string {
    // Use OKLAB gradient stops if available for perceptually uniform transitions
    if (
      this.gradientConfig.oklabInterpolationEnabled &&
      oklabGradientStops.length > 0
    ) {
      // Create perceptually uniform gradient using OKLAB stops
      const gradientStops = oklabGradientStops
        .map((stop, index) => {
          const percentage = (index / (oklabGradientStops.length - 1)) * 100;
          const rgb = `${stop.enhancedRgb.r},${stop.enhancedRgb.g},${stop.enhancedRgb.b}`;
          const opacity = 0.6 * (1 - index / oklabGradientStops.length) + 0.1; // Fade from 0.6 to 0.1
          return `rgba(${rgb}, calc(var(--visualEffects-layer-opacity) * ${opacity})) ${percentage}%`;
        })
        .join(", ");

      return `
        radial-gradient(
          ellipse at calc(50% + var(--visualEffects-flow-x)) calc(50% + var(--visualEffects-flow-y)),
          ${gradientStops}
        ),
        linear-gradient(
          135deg,
          rgba(${
            oklabGradientStops[0]?.enhancedRgb.r || primaryRgb.split(",")[0]
          },${
        oklabGradientStops[0]?.enhancedRgb.g || primaryRgb.split(",")[1]
      },${
        oklabGradientStops[0]?.enhancedRgb.b || primaryRgb.split(",")[2]
      }, calc(var(--visualEffects-layer-opacity) * 0.4)) 0%,
          var(--spice-base) 50%,
          rgba(${
            oklabGradientStops[oklabGradientStops.length - 1]?.enhancedRgb.r ||
            primaryRgb.split(",")[0]
          },${
        oklabGradientStops[oklabGradientStops.length - 1]?.enhancedRgb.g ||
        primaryRgb.split(",")[1]
      },${
        oklabGradientStops[oklabGradientStops.length - 1]?.enhancedRgb.b ||
        primaryRgb.split(",")[2]
      }, calc(var(--visualEffects-layer-opacity) * 0.2)) 100%
        ),
        var(--spice-base)
      `;
    }

    // Fallback to standard gradient for backward compatibility
    return `
      radial-gradient(
        ellipse at calc(50% + var(--visualEffects-flow-x)) calc(50% + var(--visualEffects-flow-y)),
        rgba(${primaryRgb}, calc(var(--visualEffects-layer-opacity) * 0.6)) 0%,
        rgba(${primaryRgb}, calc(var(--visualEffects-layer-opacity) * 0.3)) 30%,
        rgba(${baseRgb}, calc(var(--visualEffects-layer-opacity) * 0.1)) 60%,
        var(--spice-base) 100%
      ),
      linear-gradient(
        135deg,
        rgba(${primaryRgb}, calc(var(--visualEffects-layer-opacity) * 0.4)) 0%,
        var(--spice-base) 50%,
        rgba(${primaryRgb}, calc(var(--visualEffects-layer-opacity) * 0.2)) 100%
      ),
      var(--spice-base)
    `;
  }

  /**
   * Update animation animation (Year 3000 CSS-first approach)
   */
  private updateBreathingAnimation(): void {
    // Replaced with CSS-first visualEffects animation via CSSAnimationManager
    this.triggerConsciousnessBreathing();
  }

  public override updateAnimation(_deltaTime: number): void {
    this.updateBreathingAnimation();
  }

  /**
   * Start animation animation (Year 3000 CSS-first approach)
   */
  private startBreathingAnimation(): void {
    // Year 3000 performance revolution: Replaced JavaScript RAF loop with CSS-first animation
    this.triggerConsciousnessBreathing();
    
    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "CSS-first visualEffects animation started - 90%+ JavaScript overhead eliminated"
    );
  }

  /**
   * Schedule debounced CSS updates (Year 3000 - No longer needed with CSS-first approach)
   */
  private scheduleDebouncedCssUpdate(): void {
    // Year 3000 performance revolution: CSS animations handle timing automatically
    // No more JavaScript debouncing needed - CSS keyframes manage their own timing
    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy", 
      "Debounced CSS updates eliminated - using CSS-first animation"
    );
  }

  /**
   * Update WebGL integration variables using coordinated updates
   */
  private async updateWebGLIntegration(): Promise<void> {
    if (!this.gradientConfig.webglIntegrationEnabled) return;

    // Build WebGL integration variables - use official gradient variables only
    const webglIntegrationVariables: Record<string, string> = {
      "--sn-bg-gradient-primary-rgb": this.livingBaseState.currentPrimaryRgb,
      "--sn-webgl-living-gradient-sync": "1",
      "--sn-gradient-visualEffects-level":
        this.livingBaseState.visualEffectsIntensity.toString(),
    };

    // Apply WebGL coordination variables
    await this.applyCssVariables(webglIntegrationVariables, {
      priority: "high",
      source: "webgl-living-gradient-integration",
    });

    this.livingBaseState.webglIntegrationActive = true;

    Y3KDebug?.debug?.log("DynamicGradientStrategy", "WebGL integration updated");
  }

  /**
   * Get current living base state for debugging
   */
  public getDynamicGradientState(): DynamicGradientState {
    return { ...this.livingBaseState };
  }

  /**
   * Update living visualEffects base when colors change
   */
  private updateLivingConsciousnessBase(): void {
    this.applyLivingConsciousnessBase().catch((error) => {
      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Failed to update living visualEffects base:",
        error
      );
    });

    // Emit update event for other systems
    const updateEvent = new CustomEvent("living-base-update", {
      detail: {
        baseHex: this.livingBaseState.currentBaseHex,
        primaryHex: this.livingBaseState.currentPrimaryHex,
        visualEffectsIntensity: this.livingBaseState.visualEffectsIntensity,
        timestamp: Date.now(),
      },
    });
    document.dispatchEvent(updateEvent);
  }

  /**
   * Update music-responsive variables
   */
  private updateMusicResponsiveVariables(): void {
    const musicResponsiveVariables: Record<string, string> = {
      "--visualEffects-music-energy":
        this.livingBaseState.musicEnergy.toString(),
      "--visualEffects-music-intensity":
        this.livingBaseState.visualEffectsIntensity.toString(),
    };

    this.applyCssVariables(musicResponsiveVariables, {
      priority: "normal",
      source: "music-responsive",
    }).catch((error) => {
      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Failed to update music responsive variables:",
        error
      );
    });
  }

  /**
   * Update visualEffects variables
   */
  private updateConsciousnessVariables(): void {
    const visualEffectsVariables: Record<string, string> = {
      "--visualEffects-intensity-global":
        this.livingBaseState.visualEffectsIntensity.toString(),
      "--visualEffects-layer-opacity": (
        this.gradientConfig.visualEffectsLayerOpacity *
        this.livingBaseState.visualEffectsIntensity
      ).toString(),
    };

    this.applyCssVariables(visualEffectsVariables, {
      priority: "normal",
      source: "visualEffects-vars",
    }).catch((error) => {
      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Failed to update visualEffects variables:",
        error
      );
    });
  }

  /**
   * Coordinate with WebGL gradient system
   */
  private coordinateWithWebGLSystem(webglEnabled: boolean): void {
    const webglCoordinationVariables: Record<string, string> = webglEnabled
      ? {
          // Reduce CSS layer opacity to allow WebGL to dominate
          "--visualEffects-webgl-coordination": "0.7",
          "--visualEffects-css-fallback": "0.3",
        }
      : {
          // Full CSS visualEffects when WebGL is disabled
          "--visualEffects-webgl-coordination": "0",
          "--visualEffects-css-fallback": "1.0",
        };

    this.applyCssVariables(webglCoordinationVariables, {
      priority: "high",
      source: "webgl-coordination",
    }).catch((error) => {
      Y3KDebug?.debug?.error(
        "DynamicGradientStrategy",
        "Failed to coordinate with WebGL system:",
        error
      );
    });

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      `WebGL coordination ${webglEnabled ? "enabled" : "disabled"}`
    );
  }

  /**
   * Coordinate with WebGL gradient updates
   */
  private coordinateWithWebGLGradient(webglData: any): void {
    if (!this.gradientConfig.webglIntegrationEnabled) return;

    // Update visualEffects variables to match WebGL state
    if (webglData.flowState) {
      this.updateFlowStateFromWebGL(webglData.flowState);
    }

    if (webglData.colorState) {
      this.updateColorStateFromWebGL(webglData.colorState);
    }
  }

  /**
   * Update flow state from WebGL system
   */
  private updateFlowStateFromWebGL(flowState: any): void {
    const flowVariables: Record<string, string> = {};

    if (flowState.flowX !== undefined) {
      flowVariables["--visualEffects-webgl-flow-x"] = `${flowState.flowX}%`;
    }
    if (flowState.flowY !== undefined) {
      flowVariables["--visualEffects-webgl-flow-y"] = `${flowState.flowY}%`;
    }
    if (flowState.flowScale !== undefined) {
      flowVariables["--visualEffects-webgl-scale"] =
        flowState.flowScale.toString();
    }

    if (Object.keys(flowVariables).length > 0) {
      this.applyCssVariables(flowVariables, {
        priority: "normal",
        source: "webgl-flow",
      }).catch((error) => {
        Y3KDebug?.debug?.error(
          "DynamicGradientStrategy",
          "Failed to update WebGL flow state:",
          error
        );
      });
    }
  }

  /**
   * Update color state from WebGL system
   */
  private updateColorStateFromWebGL(colorState: any): void {
    // Sync color variables with WebGL for unified visualEffects
    if (colorState.primaryColor) {
      // WebGL may have processed colors differently, sync them
      this.livingBaseState.currentPrimaryRgb = colorState.primaryColor;
      this.updateLivingConsciousnessBase();
    }
  }

  /**
   * Health check to include both strategy and visual system status
   */
  protected override async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const strategyHealth = await this.getStrategyHealthCheck();
    const issues = [...(strategyHealth.issues || [])];

    if (!this.isActive) {
      issues.push("Visual system inactive");
    }

    return {
      healthy: strategyHealth.healthy && this.isActive,
      details: "DynamicGradientStrategy health check",
      issues,
      metrics: {
        ...strategyHealth.metrics,
        canProcess: strategyHealth.canProcess,
        systemType: "consolidated-living-gradient",
        isVisualSystem: true,
        isColorProcessor: true,
        isActive: this.isActive,
        initialized: this.initialized,
      },
    };
  }

  /**
   * Get strategy-specific health check data
   */
  private async getStrategyHealthCheck(): Promise<any> {
    const hasRecentUpdate =
      Date.now() - this.livingBaseState.lastUpdateTime < 30000; // 30s

    return {
      healthy: this.gradientConfig.baseTransformationEnabled,
      canProcess: this.gradientConfig.baseTransformationEnabled,
      issues: !this.gradientConfig.baseTransformationEnabled
        ? ["Base transformation disabled in configuration"]
        : [],
      metrics: {
        baseTransformationEnabled:
          this.gradientConfig.baseTransformationEnabled,
        responsiveAnimationEnabled:
          this.gradientConfig.responsiveAnimationEnabled,
        webglIntegrationActive: this.livingBaseState.webglIntegrationActive,
        visualEffectsIntensity: this.livingBaseState.visualEffectsIntensity,
        musicEnergy: this.livingBaseState.musicEnergy,
        hasRecentUpdate,
        cssFirstBreathing: true, // CSS-first animation replaces JavaScript animation
        oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
        oklabPreset: this.gradientConfig.oklabPreset,
        gradientSmoothness: this.gradientConfig.gradientSmoothness,
        oklabGradientStops: this.livingBaseState.oklabGradientStops.length,
      },
    };
  }

  /**
   * Override destroy method to include both strategy and visual system cleanup
   */
  public override destroy(): void {
    // Year 3000 CSS-first cleanup: Stop visualEffects animation via CSSAnimationManager
    if (this.cssAnimationManager) {
      this.cssAnimationManager.stopConsciousnessBreathing();
    }

    // Clear caches
    this.oklabCache.clear();
    this.gradientCache.clear();

    // Call base system cleanup
    super.destroy();

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "Consolidated living gradient system destroyed with complete cleanup"
    );
  }

  /**
   * Cleanup hook for service-based lifecycle
   */
  protected override performVisualSystemCleanup(): void {
    if (!this.services.events) {
      for (const subscriptionId of this.busSubscriptionIds) {
        unifiedEventBus.unsubscribe(subscriptionId);
      }
      this.busSubscriptionIds = [];

      for (const cleanup of this.domEventCleanups) {
        cleanup();
      }
    }

    this.domEventCleanups = [];

    // CSS-first animation cleanup (no JavaScript animation frame to cancel)
    // Breathing animations are now handled entirely by CSS keyframes

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "Living gradient system cleaned up"
    );
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<DynamicGradientConfig>): void {
    this.gradientConfig = { ...this.gradientConfig, ...newConfig };

    // Update OKLAB processor debug setting if configuration changed
    if (
      "oklabInterpolationEnabled" in newConfig ||
      "oklabPreset" in newConfig
    ) {
      this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    }

    Y3KDebug?.debug?.log("DynamicGradientStrategy", "Configuration updated:", {
      ...newConfig,
      oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
      oklabPreset: this.gradientConfig.oklabPreset,
      gradientSmoothness: this.gradientConfig.gradientSmoothness,
    });
  }

  /**
   * Stop animation animation (Year 3000 CSS-first approach)
   */
  public stopBreathingAnimation(): void {
    // Year 3000 performance revolution: Delegate to CSSAnimationManager
    if (this.cssAnimationManager) {
      this.cssAnimationManager.stopConsciousnessBreathing();
    }

    Y3KDebug?.debug?.log(
      "DynamicGradientStrategy",
      "CSS-first visualEffects animation stopped"
    );
  }
}
