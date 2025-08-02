/**
 * LivingGradientStrategy - ColorOrchestrator Strategy Implementation
 *
 * Transforms static backgrounds into organic consciousness foundations through
 * the strategy pattern. Handles breathing animations, WebGL coordination, and
 * music-responsive gradient transformations.
 *
 * Philosophy: "The foundation itself becomes conscious - breathing with music,
 * flowing with extracted colors, creating a living substrate for all visual systems."
 */

import { YEAR3000_CONFIG } from "@/config/globalConfig";
import {
  CSSVariableCoordinator,
  globalCSSVariableCoordinator,
} from "@/core/css/CSSVariableCoordinator";
import { Y3K } from "@/debug/UnifiedDebugManager";
import type {
  ColorContext,
  ColorResult,
  IColorProcessor,
} from "@/types/colorStrategy";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import {
  OKLABColorProcessor,
  type OKLABProcessingResult,
} from "@/utils/color/OKLABColorProcessor";
import * as Utils from "@/utils/core/Year3000Utilities";

interface LivingBaseState {
  currentBaseHex: string;
  currentBaseRgb: string;
  currentPrimaryHex: string;
  currentPrimaryRgb: string;
  consciousnessIntensity: number;
  breathingPhase: number;
  musicEnergy: number;
  lastUpdateTime: number;
  webglIntegrationActive: boolean;
  oklabGradientStops: OKLABProcessingResult[];
}

interface LivingGradientConfig {
  baseTransformationEnabled: boolean;
  webglIntegrationEnabled: boolean;
  breathingAnimationEnabled: boolean;
  consciousnessLayerOpacity: number; // 0-1
  organicFlowIntensity: number; // 0-2
  musicResponsiveness: number; // 0-2
  oklabInterpolationEnabled: boolean;
  oklabPreset: string; // OKLAB enhancement preset name
  gradientSmoothness: number; // 0-1, controls gradient transition smoothness
}

export class LivingGradientStrategy implements IColorProcessor {
  private settingsManager: SettingsManager;
  private cssCoordinator: CSSVariableCoordinator;
  private oklabProcessor: OKLABColorProcessor;
  private utils = Utils;
  private config = YEAR3000_CONFIG;

  private livingBaseState: LivingBaseState = {
    currentBaseHex: "#1e1e2e", // Catppuccin base
    currentBaseRgb: "30,30,46",
    currentPrimaryHex: "#cba6f7", // Default mauve
    currentPrimaryRgb: "203,166,247",
    consciousnessIntensity: 0.5,
    breathingPhase: 0,
    musicEnergy: 0.5,
    lastUpdateTime: 0,
    webglIntegrationActive: false,
    oklabGradientStops: [],
  };

  private gradientConfig: LivingGradientConfig = {
    baseTransformationEnabled: true,
    webglIntegrationEnabled: true,
    breathingAnimationEnabled: true,
    consciousnessLayerOpacity: 0.08, // Subtle but visible
    organicFlowIntensity: 1.2,
    musicResponsiveness: 1.0,
    oklabInterpolationEnabled: true,
    oklabPreset: "STANDARD", // Use standard OKLAB enhancement for gradients
    gradientSmoothness: 0.8, // High smoothness for natural transitions
  };

  // Animation control
  private animationFrameId: number = 0;
  private breathingStartTime: number = 0;
  private isAnimating: boolean = false;

  constructor(
    settingsManager?: SettingsManager,
    cssCoordinator?: CSSVariableCoordinator
  ) {
    this.settingsManager = settingsManager || new SettingsManager();
    this.cssCoordinator = cssCoordinator || globalCSSVariableCoordinator;
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);

    // Initialize base state from existing variables
    this.initializeBaseState();

    Y3K?.debug?.log(
      "LivingGradientStrategy",
      "Living gradient strategy initialized with OKLAB interpolation"
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

        Y3K?.debug?.log(
          "LivingGradientStrategy",
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
      await this.updateLivingBaseState(
        processedPrimary,
        processedSecondary,
        context,
        oklabGradientStops
      );

      // Create and apply living consciousness gradients with OKLAB enhancement
      await this.applyLivingConsciousnessBase();

      // Start or update breathing animations
      this.updateBreathingAnimation();

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
          harmonicIntensity: this.gradientConfig.organicFlowIntensity,
          oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
          oklabPreset: this.gradientConfig.oklabPreset,
          gradientStopCount: oklabGradientStops.length,
          gradientSmoothness: this.gradientConfig.gradientSmoothness,
        },
        context,
      };

      Y3K?.debug?.log(
        "LivingGradientStrategy",
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

      Y3K?.debug?.error(
        "LivingGradientStrategy",
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

    // Get current primary color if available
    const currentPrimary = computedStyle
      .getPropertyValue("--sn-gradient-primary-rgb")
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

    Y3K?.debug?.log("LivingGradientStrategy", "Base state initialized:", {
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
  private async updateLivingBaseState(
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

      // Adjust consciousness intensity based on music energy
      const baseIntensity = this.gradientConfig.consciousnessLayerOpacity;
      const musicMultiplier =
        1 + context.musicData.energy * this.gradientConfig.musicResponsiveness;
      this.livingBaseState.consciousnessIntensity = Math.max(
        0.05,
        Math.min(1.0, baseIntensity * musicMultiplier)
      );
    }

    this.livingBaseState.lastUpdateTime = Date.now();
  }

  /**
   * Apply living consciousness base gradient using coordinated updates
   */
  private async applyLivingConsciousnessBase(): Promise<void> {
    // Create organic living gradient that enhances Catppuccin base with OKLAB smoothness
    const consciousnessGradient = this.createLivingGradient(
      this.livingBaseState.oklabGradientStops
    );

    // Calculate dynamic values
    const breathingMultiplier =
      1 + Math.sin(this.livingBaseState.breathingPhase) * 0.2;
    const finalOpacity =
      this.livingBaseState.consciousnessIntensity * breathingMultiplier;

    const flowX =
      Math.sin(this.livingBaseState.breathingPhase * 0.7) *
      this.gradientConfig.organicFlowIntensity;
    const flowY =
      Math.cos(this.livingBaseState.breathingPhase * 0.5) *
      this.gradientConfig.organicFlowIntensity;

    const baseDuration = 4000; // 4 seconds
    const energyMultiplier = 0.5 + this.livingBaseState.musicEnergy * 1.5; // 0.5x to 2x speed
    const breathingDuration = baseDuration / energyMultiplier;

    // Build coordinated variable updates
    const consciousnessBaseVariables: Record<string, string> = {
      "--living-base-gradient": consciousnessGradient,
      "--consciousness-base-gradient": consciousnessGradient,
      "--consciousness-layer-opacity": finalOpacity.toString(),
      "--consciousness-flow-x": `${flowX}%`,
      "--consciousness-flow-y": `${flowY}%`,
      "--consciousness-breathing-duration": `${breathingDuration}ms`,
    };

    // Apply all consciousness variables in a coordinated batch
    await this.cssCoordinator.batchSetVariables(
      "LivingGradientStrategy",
      consciousnessBaseVariables,
      "high", // High priority for consciousness animations
      "living-consciousness-base"
    );

    Y3K?.debug?.log(
      "LivingGradientStrategy",
      "Applied coordinated living consciousness base gradient"
    );
  }

  /**
   * Create living gradient based on current state with OKLAB enhancement
   */
  private createLivingGradient(
    oklabGradientStops: OKLABProcessingResult[] = []
  ): string {
    const primaryRgb = this.livingBaseState.currentPrimaryRgb;
    const baseRgb = this.livingBaseState.currentBaseRgb;

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
          return `rgba(${rgb}, calc(var(--consciousness-layer-opacity) * ${opacity})) ${percentage}%`;
        })
        .join(", ");

      return `
        radial-gradient(
          ellipse at calc(50% + var(--consciousness-flow-x)) calc(50% + var(--consciousness-flow-y)),
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
      }, calc(var(--consciousness-layer-opacity) * 0.4)) 0%,
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
      }, calc(var(--consciousness-layer-opacity) * 0.2)) 100%
        ),
        var(--spice-base)
      `;
    }

    // Fallback to standard gradient for backward compatibility
    return `
      radial-gradient(
        ellipse at calc(50% + var(--consciousness-flow-x)) calc(50% + var(--consciousness-flow-y)),
        rgba(${primaryRgb}, calc(var(--consciousness-layer-opacity) * 0.6)) 0%,
        rgba(${primaryRgb}, calc(var(--consciousness-layer-opacity) * 0.3)) 30%,
        rgba(${baseRgb}, calc(var(--consciousness-layer-opacity) * 0.1)) 60%,
        var(--spice-base) 100%
      ),
      linear-gradient(
        135deg,
        rgba(${primaryRgb}, calc(var(--consciousness-layer-opacity) * 0.4)) 0%,
        var(--spice-base) 50%,
        rgba(${primaryRgb}, calc(var(--consciousness-layer-opacity) * 0.2)) 100%
      ),
      var(--spice-base)
    `;
  }

  /**
   * Update breathing animation
   */
  private updateBreathingAnimation(): void {
    if (!this.gradientConfig.breathingAnimationEnabled) return;

    if (!this.isAnimating) {
      this.startBreathingAnimation();
    }
  }

  /**
   * Start breathing animation loop
   */
  private startBreathingAnimation(): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.breathingStartTime = Date.now();

    const animate = () => {
      if (!this.isAnimating) return;

      const elapsed = Date.now() - this.breathingStartTime;
      const baseDuration = 4000; // 4 seconds
      const energyMultiplier = 0.5 + this.livingBaseState.musicEnergy * 1.5;
      const actualDuration = baseDuration / energyMultiplier;

      // Update breathing phase (0 to 2π)
      this.livingBaseState.breathingPhase =
        (elapsed / actualDuration) * Math.PI * 2;

      // Update consciousness base if animation is enabled
      if (this.gradientConfig.breathingAnimationEnabled) {
        this.applyLivingConsciousnessBase().catch((error) => {
          Y3K?.debug?.error(
            "LivingGradientStrategy",
            "Error applying consciousness base in animation:",
            error
          );
        });
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);

    Y3K?.debug?.log("LivingGradientStrategy", "Breathing animation started");
  }

  /**
   * Update WebGL integration variables using coordinated updates
   */
  private async updateWebGLIntegration(): Promise<void> {
    if (!this.gradientConfig.webglIntegrationEnabled) return;

    // Build WebGL integration variables
    const webglIntegrationVariables: Record<string, string> = {
      "--sn-gradient-primary-rgb": this.livingBaseState.currentPrimaryRgb,
      "--sn-bg-gradient-primary-rgb": this.livingBaseState.currentPrimaryRgb,
      "--sn-webgl-living-gradient-sync": "1",
      "--sn-gradient-consciousness-level":
        this.livingBaseState.consciousnessIntensity.toString(),
    };

    // Apply WebGL coordination variables
    await this.cssCoordinator.batchSetVariables(
      "LivingGradientStrategy",
      webglIntegrationVariables,
      "high", // High priority for WebGL coordination
      "webgl-living-gradient-integration"
    );

    this.livingBaseState.webglIntegrationActive = true;

    Y3K?.debug?.log("LivingGradientStrategy", "WebGL integration updated");
  }

  /**
   * Get current living base state for debugging
   */
  public getLivingBaseState(): LivingBaseState {
    return { ...this.livingBaseState };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<LivingGradientConfig>): void {
    this.gradientConfig = { ...this.gradientConfig, ...newConfig };

    // Update OKLAB processor debug setting if configuration changed
    if (
      "oklabInterpolationEnabled" in newConfig ||
      "oklabPreset" in newConfig
    ) {
      this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    }

    Y3K?.debug?.log("LivingGradientStrategy", "Configuration updated:", {
      ...newConfig,
      oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
      oklabPreset: this.gradientConfig.oklabPreset,
      gradientSmoothness: this.gradientConfig.gradientSmoothness,
    });
  }

  /**
   * Health check for strategy status
   */
  public async healthCheck(): Promise<any> {
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
        breathingAnimationEnabled:
          this.gradientConfig.breathingAnimationEnabled,
        webglIntegrationActive: this.livingBaseState.webglIntegrationActive,
        consciousnessIntensity: this.livingBaseState.consciousnessIntensity,
        musicEnergy: this.livingBaseState.musicEnergy,
        breathingPhase: this.livingBaseState.breathingPhase,
        hasRecentUpdate,
        isAnimating: this.isAnimating,
        oklabInterpolation: this.gradientConfig.oklabInterpolationEnabled,
        oklabPreset: this.gradientConfig.oklabPreset,
        gradientSmoothness: this.gradientConfig.gradientSmoothness,
        oklabGradientStops: this.livingBaseState.oklabGradientStops.length,
      },
    };
  }

  /**
   * Stop animations and cleanup
   */
  public destroy(): void {
    this.isAnimating = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }

    Y3K?.debug?.log(
      "LivingGradientStrategy",
      "Living gradient strategy destroyed"
    );
  }
}
