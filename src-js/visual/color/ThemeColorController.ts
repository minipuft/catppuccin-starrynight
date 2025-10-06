/**
 * DynamicAccentColorStrategy - Dynamic Accent Color Processing Strategy
 *
 * Pure strategy pattern implementation for OKLAB color processing.
 * Processes album art colors with OKLAB enhancement and returns metadata to
 * SpicetifyColorBridge for CSS variable application (single source of truth).
 *
 * **Multi-Palette Support**: Works with ANY palette system (Catppuccin, Year3000, etc.)
 * through PaletteSystemManager abstraction layer. This strategy dynamically adapts to
 * the active palette system configured in ADVANCED_SYSTEM_CONFIG.paletteSystem.
 *
 * **Activation**: Only activates when user selects "dynamic" accent mode in settings.
 * When inactive, static accent colors from the configured palette are used instead.
 *
 * **Architecture**:
 * - Uses PaletteSystemManager.getDefaultAccentColor() which routes to active palette
 * - Applies OKLAB perceptual color enhancement regardless of palette system
 * - Returns processed ColorResult with metadata for SpicetifyColorBridge to apply
 *
 * **Strategy Identifier**: Returns "dynamic-catppuccin" for backward compatibility with
 * existing settings and configuration (the identifier predates multi-palette support).
 *
 * Philosophy: "Pure strategy pattern - process colors, return metadata, let bridge apply."
 *
 * @see PaletteSystemManager for palette system abstraction
 * @see SpicetifyColorBridge for CSS variable application
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import {
  getGlobalCSSVariableWriter,
  CSSVariableWriter,
} from "@/core/css/CSSVariableWriter";
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
import { paletteSystemManager } from "@/utils/color/PaletteSystemManager";
import * as Utils from "@/utils/core/ThemeUtilities";

interface DynamicColorState {
  currentAccentHex: string;
  currentAccentRgb: string;
  baseBackgroundHex: string;
  baseBackgroundRgb: string;
  lastUpdateTime: number;
  musicEnergy: number;
  transitionInProgress: boolean;
}

interface DynamicColorConfig {
  accentUpdateEnabled: boolean;
  baseTransformationEnabled: boolean;
  visualEffectsIntegrationEnabled: boolean;
  oklabEnhancementEnabled: boolean;
  smoothTransitionDuration: number; // ms
  energyResponseMultiplier: number; // 0-2
  oklabPreset: string; // OKLAB enhancement preset name
}

export class DynamicAccentColorStrategy implements IColorProcessor {
  private cssController: CSSVariableWriter | null;
  private oklabProcessor: OKLABColorProcessor;
  private utils = Utils;
  private config = ADVANCED_SYSTEM_CONFIG;

  private dynamicColorState: DynamicColorState = this.getInitialColorState();

  private integrationConfig: DynamicColorConfig = {
    accentUpdateEnabled: true,
    baseTransformationEnabled: true,
    visualEffectsIntegrationEnabled: true,
    oklabEnhancementEnabled: true,
    smoothTransitionDuration: 800, // 0.8s smooth transitions
    energyResponseMultiplier: 1.2,
    oklabPreset: "VIBRANT", // Use vibrant OKLAB enhancement
  };

  // Transition management
  private transitionTimer: number = 0;
  private lastTransitionStartTime: number = 0;
  private transitionFromAccent: string = "";
  private transitionToAccent: string = "";

  /**
   * Get initial color state using current palette system
   */
  private getInitialColorState(): DynamicColorState {
    try {
      const defaultAccent = paletteSystemManager.getDefaultAccentColor();
      const baseColor = paletteSystemManager.getBrightnessAdjustedBaseColor();

      return {
        currentAccentHex: defaultAccent.hex,
        currentAccentRgb: defaultAccent.rgb,
        baseBackgroundHex: baseColor.hex,
        baseBackgroundRgb: baseColor.rgb,
        lastUpdateTime: 0,
        musicEnergy: 0.5,
        transitionInProgress: false,
      };
    } catch (error) {
      // Fallback to hardcoded values
      console.warn(
        "[DynamicAccentColorStrategy] Failed to get initial colors, using fallback:",
        error
      );
      return {
        currentAccentHex: "#7c3aed", // Fallback cosmic purple
        currentAccentRgb: "124,58,237",
        baseBackgroundHex: "#0d1117", // Fallback deep space black
        baseBackgroundRgb: "13,17,23",
        lastUpdateTime: 0,
        musicEnergy: 0.5,
        transitionInProgress: false,
      };
    }
  }

  constructor(cssController?: CSSVariableWriter) {
    this.cssController = cssController || getGlobalCSSVariableWriter();
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);

    // Initialize current state from existing variables
    this.initializeCurrentState();

    Y3KDebug?.debug?.log(
      "DynamicAccentColorStrategy",
      "Color strategy initialized with CSS coordinator and OKLAB processing"
    );
  }

  /**
   * IColorProcessor interface implementation
   */
  getStrategyName(): string {
    return "dynamic-catppuccin";
  }

  /**
   * Check if strategy can handle the given context
   */
  canProcess(context: ColorContext): boolean {
    // Only process when dynamic accent is enabled in settings
    return this.checkDynamicAccentEnabled();
  }

  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number {
    // Fast processing - mainly CSS variable updates
    return 5; // ~5ms estimated
  }

  /**
   * Process colors using Dynamic Catppuccin strategy with OKLAB enhancement
   */
  async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();

    try {
      // Select best accent color from extracted colors
      const newAccentHex = this.selectBestAccentColor(context.rawColors);

      if (!newAccentHex) {
        throw new Error("No suitable accent color found in extracted colors");
      }

      // Process color through OKLAB if enhancement is enabled
      let processedAccentHex = newAccentHex;
      let processedAccentRgb = this.utils.hexToRgb(newAccentHex);
      let oklabResult: OKLABProcessingResult | null = null;

      if (this.integrationConfig.oklabEnhancementEnabled) {
        const preset = OKLABColorProcessor.getPreset(
          this.integrationConfig.oklabPreset
        );
        oklabResult = this.oklabProcessor.processColor(newAccentHex, preset);
        processedAccentHex = oklabResult.enhancedHex;
        processedAccentRgb = oklabResult.enhancedRgb;

        Y3KDebug?.debug?.log(
          "DynamicAccentColorStrategy",
          "OKLAB color enhancement applied:",
          {
            original: newAccentHex,
            enhanced: processedAccentHex,
            preset: preset.name,
            processingTime: `${oklabResult.processingTime.toFixed(2)}ms`,
          }
        );
      }

      // 🔧 PHASE 7.1: PURE STRATEGY PATTERN - Strategy processes colors, doesn't apply them
      // CSS variable application is now handled by SpicetifyColorBridge
      // This ensures single source of truth for color application and eliminates race conditions

      // Update internal state with processed color for diagnostics
      this.dynamicColorState.currentAccentHex = processedAccentHex;
      if (processedAccentRgb) {
        this.dynamicColorState.currentAccentRgb = `${processedAccentRgb.r},${processedAccentRgb.g},${processedAccentRgb.b}`;
      }
      this.dynamicColorState.lastUpdateTime = Date.now();

      // Track music energy for diagnostics
      if (context.musicData?.energy !== undefined) {
        this.dynamicColorState.musicEnergy = context.musicData.energy;
      }

      const processingTime = performance.now() - startTime;

      // 🔧 PHASE 7.1: Enhanced ColorResult with complete OKLAB data for SpicetifyColorBridge
      const result: ColorResult = {
        processedColors: {
          accent: processedAccentHex,
          primary: processedAccentHex,
          originalAccent: newAccentHex, // Keep original for reference
          ...context.rawColors,
        },
        accentHex: processedAccentHex,
        accentRgb: this.dynamicColorState.currentAccentRgb,
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          cacheKey: `dynamic-catppuccin-${context.trackUri}`,
          harmonicIntensity: this.integrationConfig.energyResponseMultiplier,
          oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
          oklabPreset: this.integrationConfig.oklabPreset,
          // Music energy for visual effects coordination
          musicEnergy: this.dynamicColorState.musicEnergy,
          energyResponseMultiplier:
            this.integrationConfig.energyResponseMultiplier,
          // Configuration flags for bridge to apply correctly
          dynamicAccentEnabled: true,
          visualEffectsIntegrationEnabled:
            this.integrationConfig.visualEffectsIntegrationEnabled,
          baseTransformationEnabled:
            this.integrationConfig.baseTransformationEnabled,
          ...(oklabResult && {
            oklabMetadata: {
              originalHex: oklabResult.originalHex,
              originalRgb: oklabResult.originalRgb,
              enhancedHex: oklabResult.enhancedHex,
              enhancedRgb: oklabResult.enhancedRgb,
              shadowHex: oklabResult.shadowHex,
              shadowRgb: oklabResult.shadowRgb,
              oklabProcessingTime: oklabResult.processingTime,
              // OKLCH values for advanced CSS features
              oklchL: oklabResult.oklchEnhanced.L,
              oklchC: oklabResult.oklchEnhanced.C,
              oklchH: oklabResult.oklchEnhanced.H,
              // Complete OKLAB result for CSS variable generation
              fullOKLABResult: oklabResult,
            },
          }),
        },
        context,
      };

      Y3KDebug?.debug?.log(
        "DynamicAccentColorStrategy",
        "Color processing completed",
        {
          originalAccent: newAccentHex,
          processedAccent: processedAccentHex,
          oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
          processingTime,
          trackUri: context.trackUri,
        }
      );

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;

      Y3KDebug?.debug?.error(
        "DynamicAccentColorStrategy",
        "Color processing failed:",
        error
      );

      // Return fallback result
      return {
        processedColors: context.rawColors,
        accentHex: this.dynamicColorState.currentAccentHex,
        accentRgb: this.dynamicColorState.currentAccentRgb,
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
   * Check if dynamic accent is enabled in settings
   */
  private checkDynamicAccentEnabled(): boolean {
    try {
      const accentSetting = settings.get("catppuccin-accentColor");
      const isDynamic = String(accentSetting) === "dynamic";

      if (this.config.enableDebug) {
        Y3KDebug?.debug?.log(
          "DynamicAccentColorStrategy",
          `Accent setting: ${accentSetting}, Dynamic: ${isDynamic}`
        );
      }

      return isDynamic;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicAccentColorStrategy",
        "Error checking dynamic accent setting:",
        error
      );
      return false;
    }
  }

  /**
   * Initialize current state from existing CSS variables
   */
  private initializeCurrentState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Get current accent if available
    const currentAccent =
      computedStyle.getPropertyValue("--spice-accent").trim() ||
      computedStyle.getPropertyValue("--sn-color-accent-hex").trim();

    if (currentAccent) {
      this.dynamicColorState.currentAccentHex = currentAccent;
      const rgb = this.utils.hexToRgb(currentAccent);
      if (rgb) {
        this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
      }
    }

    // Get current base background
    const currentBase =
      computedStyle.getPropertyValue("--spice-base").trim() || "#1e1e2e";
    this.dynamicColorState.baseBackgroundHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.dynamicColorState.baseBackgroundRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }

    this.dynamicColorState.lastUpdateTime = Date.now();

    Y3KDebug?.debug?.log(
      "DynamicAccentColorStrategy",
      "Current state initialized:",
      {
        accent: this.dynamicColorState.currentAccentHex,
        base: this.dynamicColorState.baseBackgroundHex,
      }
    );
  }

  /**
   * Select best accent color from extracted colors
   */
  private selectBestAccentColor(colors: Record<string, string>): string | null {
    // Priority order for accent selection
    const priorities = [
      "VIBRANT_NON_ALARMING", // Best for UI - vibrant but not overwhelming
      "VIBRANT", // Strong and lively
      "LIGHT_VIBRANT", // Lighter variant
      "PROMINENT", // Most noticeable color
      "PRIMARY", // Primary extracted color
      "DARK_VIBRANT", // Darker variant as fallback
    ];

    for (const key of priorities) {
      const color = colors[key];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }

    return null;
  }

  // 🔧 PHASE 7.1: CSS application methods removed - now handled by SpicetifyColorBridge
  // The following methods have been deleted as part of pure strategy pattern implementation:
  // - applyColorFacade() - CSS variable application moved to SpicetifyColorBridge
  // - updateLivingBaseBackground() - Secondary color application moved to SpicetifyColorBridge
  // - updateVisualEffectsWithAccent() - Visual effects integration moved to SpicetifyColorBridge
  // - updateVisualEffectsWithMusicEnergy() - Music energy updates moved to SpicetifyColorBridge
  //
  // Strategy now focuses on:
  // ✅ Color processing (OKLAB enhancement, selection logic)
  // ✅ Returning enhanced ColorResult with full metadata
  // ✅ SpicetifyColorBridge applies all CSS variables based on ColorResult metadata

  /**
   * Get current dynamic color state for debugging
   */
  public getDynamicColorState(): DynamicColorState {
    return { ...this.dynamicColorState };
  }

  /**
   * Update integration configuration
   */
  public updateConfig(newConfig: Partial<DynamicColorConfig>): void {
    this.integrationConfig = { ...this.integrationConfig, ...newConfig };

    // Update OKLAB processor debug setting if configuration changed
    if ("oklabEnhancementEnabled" in newConfig || "oklabPreset" in newConfig) {
      this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    }

    Y3KDebug?.debug?.log(
      "DynamicAccentColorStrategy",
      "Configuration updated:",
      {
        ...newConfig,
        oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
        oklabPreset: this.integrationConfig.oklabPreset,
      }
    );
  }

  /**
   * Health check for strategy status
   */
  public async healthCheck(): Promise<any> {
    const isDynamicEnabled = this.checkDynamicAccentEnabled();
    const hasRecentUpdate =
      Date.now() - this.dynamicColorState.lastUpdateTime < 30000; // 30s

    return {
      healthy: isDynamicEnabled,
      canProcess: isDynamicEnabled,
      issues: !isDynamicEnabled
        ? ["Dynamic accent not enabled in settings"]
        : [],
      metrics: {
        dynamicAccentEnabled: isDynamicEnabled,
        currentAccent: this.dynamicColorState.currentAccentHex,
        lastUpdateAge: Date.now() - this.dynamicColorState.lastUpdateTime,
        hasRecentUpdate,
        transitionInProgress: this.dynamicColorState.transitionInProgress,
        musicEnergy: this.dynamicColorState.musicEnergy,
        oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
        oklabPreset: this.integrationConfig.oklabPreset,
        visualEffectsIntegration:
          this.integrationConfig.visualEffectsIntegrationEnabled,
      },
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    // Clear any active transitions
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = 0;
    }

    this.dynamicColorState.transitionInProgress = false;

    Y3KDebug?.debug?.log(
      "DynamicAccentColorStrategy",
      "Dynamic accent color strategy destroyed"
    );
  }
}
