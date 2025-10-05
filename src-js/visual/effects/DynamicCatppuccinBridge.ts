/**
 * DynamicCatppuccinBridge - Phase 2.1 Dynamic Color Integration
 *
 * Bridges ColorHarmonyEngine extracted colors to Catppuccin dynamic accent system
 * enabling real-time sync between album art extraction and visual effects.
 *
 * Philosophy: "Living color systems that pulse with musical awareness while
 * preserving Catppuccin's aesthetic harmony and ensuring dynamic accent functionality."
 */

import type { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import { settings } from "@/config";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import {
  calculateColorHarmonyAngle,
  COLOR_HARMONY_MODES,
} from "@/config/harmonicModes";
import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import {
  CSSVariableWriter,
  getGlobalCSSVariableWriter,
} from "@/core/css/CSSVariableWriter";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import * as Utils from "@/utils/core/ThemeUtilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import type { DepthVisualEffectsController } from "./DepthLayerController";

interface AlbumColors {
  VIBRANT?: string;
  DARK_VIBRANT?: string;
  LIGHT_VIBRANT?: string;
  PROMINENT?: string;
  PRIMARY?: string;
  SECONDARY?: string;
  VIBRANT_NON_ALARMING?: string;
  DESATURATED?: string;
}

interface DynamicColorState {
  currentAccentHex: string;
  currentAccentRgb: string;
  baseBackgroundHex: string;
  baseBackgroundRgb: string;
  lastUpdateTime: number;
  musicEnergy: number;
  transitionInProgress: boolean;
}

interface CatppuccinIntegrationConfig {
  accentUpdateEnabled: boolean;
  baseTransformationEnabled: boolean;
  visualIntegrationEnabled: boolean;
  smoothTransitionDuration: number; // ms
  energyResponseMultiplier: number; // 0-2
}

export class DynamicCatppuccinBridge extends BaseVisualSystem {
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private depthVisualController: DepthVisualEffectsController | null =
    null;

  private dynamicColorState: DynamicColorState = {
    currentAccentHex: "#675c8f", // Default Catppuccin Mocha mauve (proper fallback)
    currentAccentRgb: "203,166,247",
    baseBackgroundHex: "#0d1117", // Default StarryNight deep space black
    baseBackgroundRgb: "13,17,23",
    lastUpdateTime: 0,
    musicEnergy: 0.5,
    transitionInProgress: false,
  };

  private integrationConfig: CatppuccinIntegrationConfig = {
    accentUpdateEnabled: true,
    baseTransformationEnabled: true,
    visualIntegrationEnabled: true,
    smoothTransitionDuration: 800, // 0.8s smooth transitions
    energyResponseMultiplier: 1.2,
  };

  // Transition management - now handled by coordinator updateAnimation() loop
  private transitionTimer: number = 0;
  private lastTransitionStartTime: number = 0;
  private transitionFromAccent: string = "";
  private transitionToAccent: string = "";
  private transitionElapsedTime: number = 0;

  // CSS coordination system
  private cssController!: CSSVariableWriter;

  constructor(
    config = ADVANCED_SYSTEM_CONFIG,
    utils = Utils,
    performanceMonitor: any = null,
    musicSyncService: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService);
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    try {
      // Initialize CSS coordination - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController =
        year3000System?.cssController ||
        getGlobalCSSVariableWriter();

      // Always setup event listeners and settings monitoring
      this.setupColorExtractionListeners();
      this.setupSettingsListeners();

      // Initialize current state from existing variables
      this.initializeCurrentState();

      // Check if dynamic accent is currently enabled
      const isEnabled = this.checkDynamicAccentEnabled();
      this.integrationConfig.accentUpdateEnabled = isEnabled;

      if (isEnabled) {
        Y3KDebug?.debug?.log(
          "DynamicCatppuccinBridge",
          "Dynamic accent enabled - bridge active"
        );
      } else {
        Y3KDebug?.debug?.log(
          "DynamicCatppuccinBridge",
          "Dynamic accent disabled - bridge standby (will activate when enabled)"
        );
      }

      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        "Color Extension Facade initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicCatppuccinBridge",
        "Failed to initialize facade:",
        error
      );
    }
  }

  /**
   * Check if dynamic accent is enabled in settings
   */
  private checkDynamicAccentEnabled(): boolean {
    try {
      const accentSetting = settings.get("catppuccin-accentColor");
      // Cast to string since 'dynamic' might be a custom value not in the type definition
      const isDynamic = String(accentSetting) === "dynamic";

      if (this.config.enableDebug) {
        Y3KDebug?.debug?.log(
          "DynamicCatppuccinBridge",
          `Accent setting: ${accentSetting}, Dynamic: ${isDynamic}`
        );
      }

      return isDynamic;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicCatppuccinBridge",
        "Error checking dynamic accent setting:",
        error
      );
      return false;
    }
  }

  /**
   * Setup listeners for color extraction events
   * 🔧 CRITICAL FIX: Enhanced with UnifiedEventBus integration
   */
  private setupColorExtractionListeners(): void {
    // 🔧 CRITICAL FIX: Listen to UnifiedEventBus events for better integration
    unifiedEventBus.subscribe(
      "colors:extracted",
      (data) => {
        if (data.rawColors) {
          this.handleExtractedColors(data.rawColors);
        }
      },
      "DynamicCatppuccinBridge"
    );

    unifiedEventBus.subscribe(
      "colors:harmonized",
      (data) => {
        if (data.processedColors) {
          this.handleHarmonizedColors(data.processedColors);
        }
      },
      "DynamicCatppuccinBridge"
    );

    unifiedEventBus.subscribe(
      "colors:applied",
      (data) => {
        if (data.cssVariables && this.integrationConfig.accentUpdateEnabled) {
          this.handleCSSVariablesApplied(
            data.cssVariables,
            data.accentHex,
            data.accentRgb
          );
        }
      },
      "DynamicCatppuccinBridge"
    );

    // Listen for music state changes (not yet in UnifiedEventBus)
    document.addEventListener("music-state-change", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleMusicStateChange(customEvent.detail);
      }
    });

    // Listen for spice color update requests from other systems (not yet in UnifiedEventBus)
    document.addEventListener("spice-colors/update-request", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && this.integrationConfig.accentUpdateEnabled) {
        this.handleSpiceColorUpdateRequest(customEvent.detail);
      }
    });

    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Color extraction and coordination listeners setup complete via UnifiedEventBus"
    );
  }

  /**
   * Handle requests from other systems to update spice colors
   */
  private handleSpiceColorUpdateRequest(colorData: any): void {
    const { accentHex, primaryHex, secondaryHex, source } = colorData;

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        `Received spice color update request from ${source}:`,
        {
          accent: accentHex,
          primary: primaryHex,
          secondary: secondaryHex,
        }
      );
    }

    // Apply the new accent color if provided
    if (accentHex && accentHex !== this.dynamicColorState.currentAccentHex) {
      this.scheduleSmoothAccentTransition(accentHex);
    }

    // Apply background gradients if provided
    if (primaryHex) {
      this.updateLivingBaseBackground(primaryHex);
    }

    // Emit confirmation event
    document.dispatchEvent(
      new CustomEvent("spice-colors/updated", {
        detail: {
          source: "DynamicCatppuccinBridge",
          applied: {
            accent: accentHex,
            primary: primaryHex,
            secondary: secondaryHex,
          },
          timestamp: Date.now(),
        },
      })
    );
  }

  /**
   * Setup settings change listeners
   */
  private setupSettingsListeners(): void {
    document.addEventListener(
      "year3000SystemSettingsChanged",
      (event: Event) => {
        const customEvent = event as CustomEvent;
        const { key, value } = customEvent.detail || {};

        if (key === "catppuccin-accentColor") {
          // Cast to string since 'dynamic' might be a custom value not in the type definition
          const isDynamic = String(value) === "dynamic";
          this.integrationConfig.accentUpdateEnabled = isDynamic;

          if (isDynamic && !this.isActive) {
            // Re-enable bridge if dynamic accent was just selected
            this.initialize();
          } else if (!isDynamic && this.isActive) {
            // Disable bridge if switching away from dynamic
            this.destroy();
          }

          Y3KDebug?.debug?.log(
            "DynamicCatppuccinBridge",
            `Accent setting changed to: ${value}, Bridge active: ${this.isActive}`
          );
        }
      }
    );
  }

  /**
   * Initialize current state from existing CSS variables
   * Prioritizes ColorHarmonyEngine variables, then falls back to Catppuccin defaults
   */
  private initializeCurrentState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Get current accent with proper priority cascade
    // 1st: ColorHarmonyEngine processed colors (primary source)
    // 2nd: Our own dynamic accent variable
    // 3rd: Catppuccin cosmic default
    // 4th: Spicetify compatibility
    const currentAccent =
      computedStyle.getPropertyValue("--sn-accent-hex").trim() ||
      computedStyle
        .getPropertyValue("--sn-musical-harmony-primary-hex")
        .trim() ||
      computedStyle.getPropertyValue("--sn-dynamic-accent-hex").trim() ||
      computedStyle.getPropertyValue("--sn-cosmic-accent-hex").trim() ||
      computedStyle.getPropertyValue("--spice-accent").trim();

    if (currentAccent) {
      this.dynamicColorState.currentAccentHex = currentAccent;
      const rgb = this.utils.hexToRgb(currentAccent);
      if (rgb) {
        this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
      }
    }

    // Get current base background (cascading priority)
    const currentBase =
      computedStyle.getPropertyValue("--sn-cosmic-base-hex").trim() ||
      computedStyle.getPropertyValue("--spice-base").trim() ||
      "#0d1117"; // StarryNight cosmic default
    this.dynamicColorState.baseBackgroundHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.dynamicColorState.baseBackgroundRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }

    this.dynamicColorState.lastUpdateTime = Date.now();

    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Current state initialized:",
      {
        accent: this.dynamicColorState.currentAccentHex,
        base: this.dynamicColorState.baseBackgroundHex,
      }
    );
  }

  /**
   * Handle extracted colors from ColorHarmonyEngine
   */
  private handleExtractedColors(extractedColors: AlbumColors): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;

    try {
      const newAccentHex = this.selectBestAccentColor(extractedColors);

      if (
        newAccentHex &&
        newAccentHex !== this.dynamicColorState.currentAccentHex
      ) {
        this.scheduleSmoothAccentTransition(newAccentHex);
      }

      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        "Processed extracted colors:",
        {
          input: Object.keys(extractedColors),
          selectedAccent: newAccentHex,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicCatppuccinBridge",
        "Error handling extracted colors:",
        error
      );
    }
  }

  /**
   * Handle harmonized colors (post-processing)
   * Extract accent color from ColorHarmonyEngine and apply it immediately
   */
  private handleHarmonizedColors(harmonizedColors: AlbumColors): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;

    try {
      // Extract the best accent color from harmonized colors using the same priority as ColorHarmonyEngine
      const newAccentHex =
        harmonizedColors["VIBRANT"] ||
        harmonizedColors["PROMINENT"] ||
        harmonizedColors["VIBRANT_NON_ALARMING"] ||
        harmonizedColors["LIGHT_VIBRANT"] ||
        harmonizedColors["PRIMARY"] ||
        Object.values(harmonizedColors)[0]; // First available color

      if (
        newAccentHex &&
        newAccentHex !== this.dynamicColorState.currentAccentHex
      ) {
        if (this.config.enableDebug) {
          console.log(
            "🎨 [DynamicCatppuccinBridge] Applying harmonized accent color:",
            {
              from: this.dynamicColorState.currentAccentHex,
              to: newAccentHex,
              source: "ColorHarmonyEngine harmonized colors",
            }
          );
        }

        // Apply the accent color immediately with smooth transition
        this.scheduleSmoothAccentTransition(newAccentHex);
      }

      // Also apply to dynamic system for background effects
      this.applyHarmonizedColorsToDynamicSystem(harmonizedColors);
    } catch (error) {
      console.error(
        "🎨 [DynamicCatppuccinBridge] Error handling harmonized colors:",
        error
      );
    }
  }

  /**
   * Handle CSS variables applied event from ColorHarmonyEngine
   * 🔧 CRITICAL FIX: New handler for colors:applied events
   */
  private handleCSSVariablesApplied(
    cssVariables: Record<string, string>,
    accentHex: string,
    accentRgb: string
  ): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;

    try {
      // Update our internal state
      if (accentHex && accentHex !== this.dynamicColorState.currentAccentHex) {
        this.dynamicColorState.currentAccentHex = accentHex;
        this.dynamicColorState.currentAccentRgb = accentRgb;
        this.dynamicColorState.lastUpdateTime = Date.now();
      }

      // Ensure critical UI variables are properly applied
      const enhancedVariables: Record<string, string> = {};

      // Extract accent colors from CSS variables
      const accent =
        cssVariables["--sn-accent-hex"] ||
        cssVariables["--spice-accent"] ||
        accentHex;
      const accentRgbVar =
        cssVariables["--sn-accent-rgb"] ||
        cssVariables["--spice-rgb-accent"] ||
        accentRgb;

      if (accent && accentRgbVar) {
        // Ensure dynamic accent variables are set
        enhancedVariables["--sn-dynamic-accent-hex"] = accent;
        enhancedVariables["--sn-dynamic-accent-rgb"] = accentRgbVar;
        enhancedVariables["--sn-dynamic-primary-hex"] = accent;
        enhancedVariables["--sn-dynamic-primary-rgb"] = accentRgbVar;

        // Apply enhanced variables using coordination
        if (Object.keys(enhancedVariables).length > 0) {
          this.cssController.batchSetVariables(
            "DynamicCatppuccinBridge",
            enhancedVariables,
            "critical", // Critical priority for dynamic accent coordination
            "css-variables-applied-enhancement"
          );
        }
      }

      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        "Processed colors:applied event:",
        {
          accentHex: accent,
          accentRgb: accentRgbVar,
          variablesProcessed: Object.keys(cssVariables).length,
          enhancedVariables: Object.keys(enhancedVariables).length,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DynamicCatppuccinBridge",
        "Error handling CSS variables applied:",
        error
      );
    }
  }

  /**
   * Handle music state changes for energy-responsive effects
   */
  private handleMusicStateChange(musicState: any): void {
    if (musicState.energy !== undefined) {
      this.dynamicColorState.musicEnergy = musicState.energy;

      // Update visual intensity based on music energy
      if (this.integrationConfig.visualIntegrationEnabled) {
        this.updateVisualWithMusicEnergy(musicState.energy);
      }
    }
  }

  /**
   * Select best accent color from extracted colors
   */
  private selectBestAccentColor(colors: AlbumColors): string | null {
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
      const color = colors[key as keyof AlbumColors];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }

    return null;
  }

  /**
   * Schedule smooth transition between accent colors
   */
  private scheduleSmoothAccentTransition(newAccentHex: string): void {
    if (this.dynamicColorState.transitionInProgress) {
      // Update target mid-transition
      this.transitionToAccent = newAccentHex;
      return;
    }

    this.transitionFromAccent = this.dynamicColorState.currentAccentHex;
    this.transitionToAccent = newAccentHex;
    this.dynamicColorState.transitionInProgress = true;
    this.lastTransitionStartTime = Date.now();

    // Start transition animation
    this.animateAccentTransition();

    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      `Accent transition scheduled: ${this.transitionFromAccent} → ${newAccentHex}`
    );
  }

  /**
   * Animate smooth accent color transitions
   * MIGRATION NOTE: This method previously used standalone RAF loop.
   * Now transitions are driven by AnimationFrameCoordinator via updateAnimation().
   * The coordinator will call updateAnimation(deltaTime) which handles all transition logic.
   */
  private animateAccentTransition(): void {
    // Transition is now handled by updateAnimation() method called by coordinator
    // This method only initializes the transition state
  }

  /**
   * Interpolate between two hex colors
   */
  private interpolateColors(
    fromHex: string,
    toHex: string,
    progress: number
  ): string | null {
    const fromRgb = this.utils.hexToRgb(fromHex);
    const toRgb = this.utils.hexToRgb(toHex);

    if (!fromRgb || !toRgb) return null;

    const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress);
    const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress);
    const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress);

    return this.utils.rgbToHex(r, g, b);
  }

  /**
   * Calculate harmony colors (complementary, analogous, triadic) from base RGB
   * Uses OKLAB color harmony system for perceptually uniform relationships
   */
  private calculateHarmonyColors(baseRgb: string): {
    complementary: string;
    analogous: string;
    triadic: string;
  } {
    // Parse RGB string to individual values and validate
    const rgbValues = baseRgb.split(",").map((v) => parseInt(v.trim(), 10));
    const r = rgbValues[0] !== undefined && !isNaN(rgbValues[0]) ? rgbValues[0] : 128;
    const g = rgbValues[1] !== undefined && !isNaN(rgbValues[1]) ? rgbValues[1] : 128;
    const b = rgbValues[2] !== undefined && !isNaN(rgbValues[2]) ? rgbValues[2] : 128;

    // Convert to HSL for hue manipulation
    const hsl = Utils.rgbToHsl(r, g, b);
    const baseHue = hsl.h;
    const baseSat = hsl.s;
    const baseLum = hsl.l;

    // Calculate complementary color (180° hue shift)
    const complementaryMode = COLOR_HARMONY_MODES["complementary-yin-yang"];
    const complementaryHues = complementaryMode
      ? calculateColorHarmonyAngle(complementaryMode, baseHue)
      : [baseHue, (baseHue + 180) % 360];
    const complementaryHue = complementaryHues[1] ?? (baseHue + 180) % 360;
    const complementaryRgb = Utils.hslToRgb(
      complementaryHue % 360,
      baseSat,
      baseLum
    );

    // Calculate analogous color (30° hue shift)
    const analogousMode = COLOR_HARMONY_MODES["analogous-flow"];
    const analogousHues = analogousMode
      ? calculateColorHarmonyAngle(analogousMode, baseHue)
      : [baseHue, (baseHue + 30) % 360];
    const analogousHue = analogousHues[1] ?? (baseHue + 30) % 360;
    const analogousRgb = Utils.hslToRgb(analogousHue % 360, baseSat, baseLum);

    // Calculate triadic color (120° hue shift)
    const triadicMode = COLOR_HARMONY_MODES["triadic-trinity"];
    const triadicHues = triadicMode
      ? calculateColorHarmonyAngle(triadicMode, baseHue)
      : [baseHue, (baseHue + 120) % 360];
    const triadicHue = triadicHues[1] ?? (baseHue + 120) % 360;
    const triadicRgb = Utils.hslToRgb(triadicHue % 360, baseSat, baseLum);

    return {
      complementary: `${complementaryRgb.r},${complementaryRgb.g},${complementaryRgb.b}`,
      analogous: `${analogousRgb.r},${analogousRgb.g},${analogousRgb.b}`,
      triadic: `${triadicRgb.r},${triadicRgb.g},${triadicRgb.b}`,
    };
  }

  /**
   * Apply dynamic accent using Color Extension Facade
   * Updates both core Spicetify variables AND visualEffects extensions
   */
  private applyDynamicAccent(accentHex: string): void {
    // 🎨 CRITICAL: Log accent color being applied
    console.log("🎨 [DynamicCatppuccinBridge] Applying dynamic accent color:", {
      accentHex,
      previousAccent: this.dynamicColorState.currentAccentHex,
      timestamp: Date.now(),
    });

    const root = document.documentElement;
    const rgb = this.utils.hexToRgb(accentHex);

    if (!rgb) {
      console.error(
        "🎨 [DynamicCatppuccinBridge] Failed to convert accent hex to RGB:",
        accentHex
      );
      return;
    }

    const rgbString = `${rgb.r},${rgb.g},${rgb.b}`;

    // 🎨 Calculate OKLAB harmony colors for perceptually uniform relationships
    const harmonyColors = this.calculateHarmonyColors(rgbString);

    // 🎨 CRITICAL: Log all CSS variables being set
    const variablesToSet = {
      "--sn-dynamic-accent-hex": accentHex,
      "--sn-dynamic-accent-rgb": rgbString,
      "--sn-dynamic-primary-hex": accentHex,
      "--sn-dynamic-primary-rgb": rgbString,
      "--spice-accent": accentHex,
      "--spice-button": accentHex,
      "--spice-button-active": accentHex,
      "--spice-rgb-accent": rgbString,
      "--spice-rgb-button": rgbString,
      "--sn-color-extracted-primary-rgb": rgbString,
      "--sn-color-extracted-vibrant-rgb": rgbString,
      "--sn-color-extracted-dominant-rgb": rgbString,
      // OKLAB Harmony System - Dynamic color relationships from album art
      "--sn-color-harmony-complementary-rgb": harmonyColors.complementary,
      "--sn-color-harmony-analogous-rgb": harmonyColors.analogous,
      "--sn-color-harmony-triadic-rgb": harmonyColors.triadic,
    };

    console.log(
      "🎨 [DynamicCatppuccinBridge] Setting CSS variables:",
      variablesToSet
    );

    // Apply all dynamic accent variables using coordination
    this.cssController.batchSetVariables(
      "DynamicCatppuccinBridge",
      variablesToSet,
      "critical", // Critical priority for dynamic accent system - highest priority in cascade
      "dynamic-accent-application"
    );

    // 🔮 VISUAL INTEGRATION
    if (this.integrationConfig.visualIntegrationEnabled) {
      this.updateVisualWithAccent(accentHex, rgbString);
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        `Applied gradient colors: --sn-bg-gradient-primary=${accentHex}, --sn-bg-gradient-primary-rgb=${rgbString}`
      );
    }
  }

  /**
   * Apply harmonized colors to the dynamic system
   */
  private applyHarmonizedColorsToDynamicSystem(
    harmonizedColors: AlbumColors
  ): void {
    const primaryHex = harmonizedColors.VIBRANT || harmonizedColors.PRIMARY;

    if (primaryHex) {
      // Transform base background with living gradient integration
      if (this.integrationConfig.baseTransformationEnabled) {
        this.updateLivingBaseBackground(primaryHex);
      }
    }
  }

  /**
   * Update visual system with new accent awareness
   */
  private updateVisualWithAccent(
    accentHex: string,
    accentRgb: string
  ): void {
    const root = document.documentElement;

    // Update visual variables using coordination
    const visualAccentVariables = {
      "--sn-holographic-rgb": accentRgb,
      "--holographic-scanline-rgb": accentRgb,
      "--visual-intensity": `calc(0.5 + var(--musical-sync-intensity) * ${this.integrationConfig.energyResponseMultiplier}),`,
    };

    this.cssController.batchSetVariables(
      "DynamicCatppuccinBridge",
      visualAccentVariables,
      "high", // High priority for visual accent integration
      "visual-accent-update"
    );

    // Notify depth visual controller if available
    if (this.depthVisualController) {
      // Update visual system via public interface
      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        "Notifying depth visual controller of accent change"
      );
    }
  }

  /**
   * Update visual system with music energy
   */
  private updateVisualWithMusicEnergy(energy: number): void {
    const root = document.documentElement;
    const adjustedEnergy =
      energy * this.integrationConfig.energyResponseMultiplier;

    // Update musical energy variables using coordination
    const musicalEnergyVariables = {
      "--musical-sync-intensity": adjustedEnergy.toString(),
      "--holographic-music-flicker-intensity": adjustedEnergy.toString(),
    };

    this.cssController.batchSetVariables(
      "DynamicCatppuccinBridge",
      musicalEnergyVariables,
      "high", // High priority for musical energy synchronization
      "musical-energy-update"
    );

    // Update visual intensity based on energy using coordination
    const baseIntensity = 0.5;
    const visualIntensity = Math.max(
      0.1,
      Math.min(1.0, baseIntensity + adjustedEnergy * 0.3)
    );

    this.cssController.setVariable(
      "DynamicCatppuccinBridge",
      "--visual-intensity",
      visualIntensity.toString(),
      "high", // High priority for visual intensity - affects visual levels
      "visual-intensity-update"
    );
  }

  /**
   * Update living base background using Color Extension Facade
   * Preserves Spicetify base while adding visual layers
   */
  private updateLivingBaseBackground(primaryHex: string): void {
    const root = document.documentElement;
    const primaryRgb = this.utils.hexToRgb(primaryHex);

    if (!primaryRgb) return;

    const primaryRgbString = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;

    // Update secondary color variables using coordination
    const secondaryColorVariables = {
      "--sn-dynamic-secondary-hex": primaryHex,
      "--sn-dynamic-secondary-rgb": primaryRgbString,
      "--sn-color-extracted-secondary-rgb": primaryRgbString,
      "--sn-color-harmony-complementary-rgb": primaryRgbString,
    };

    this.cssController.batchSetVariables(
      "DynamicCatppuccinBridge",
      secondaryColorVariables,
      "high", // High priority for secondary color system
      "secondary-color-update"
    );

    // Create living gradient that ENHANCES Spicetify base (doesn't replace)
    const visualGradient = `
      linear-gradient(135deg,
        var(--spice-base) 0%,
        rgba(${primaryRgbString}, 0.08) 30%,
        var(--spice-base) 70%
      ),
      var(--spice-base)
    `;

    // Update living base gradient variables using coordination
    const livingGradientVariables = {
      "--living-base-gradient": visualGradient,
      "--visual-base-gradient": visualGradient,
    };

    this.cssController.batchSetVariables(
      "DynamicCatppuccinBridge",
      livingGradientVariables,
      "normal", // Normal priority for living gradient background effects
      "living-gradient-update"
    );

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        `Living base updated: --sn-bg-gradient-secondary=${primaryHex}, --sn-bg-gradient-secondary-rgb=${primaryRgbString}`
      );
    }
  }

  /**
   * Link with other visual systems
   */
  public linkWithColorHarmonyEngine(engine: ColorHarmonyEngine): void {
    this.colorHarmonyEngine = engine;
    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Linked with ColorHarmonyEngine"
    );
  }

  public linkWithDepthVisual(
    controller: DepthVisualEffectsController
  ): void {
    this.depthVisualController = controller;
    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Linked with DepthLayerController"
    );
  }

  /**
   * updateAnimation() - Called by AnimationFrameCoordinator at 60fps
   * Handles color transition animations that were previously in standalone RAF loop
   */
  public override updateAnimation(deltaTime: number): void {
    if (!this.dynamicColorState.transitionInProgress) return;

    // Accumulate elapsed time
    this.transitionElapsedTime += deltaTime;

    const progress = Math.min(
      this.transitionElapsedTime / this.integrationConfig.smoothTransitionDuration,
      1
    );

    // Smooth easing function
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

    // Interpolate colors
    const currentColor = this.interpolateColors(
      this.transitionFromAccent,
      this.transitionToAccent,
      easeProgress
    );

    if (currentColor) {
      this.applyDynamicAccent(currentColor);
    }

    if (progress >= 1) {
      // Transition complete
      this.dynamicColorState.transitionInProgress = false;
      this.dynamicColorState.currentAccentHex = this.transitionToAccent;
      this.dynamicColorState.lastUpdateTime = Date.now();
      this.transitionElapsedTime = 0;

      const rgb = this.utils.hexToRgb(this.transitionToAccent);
      if (rgb) {
        this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
      }

      Y3KDebug?.debug?.log(
        "DynamicCatppuccinBridge",
        `Accent transition complete: ${this.transitionToAccent}`
      );
    }
  }

  /**
   * Get current dynamic color state for debugging
   */
  public getDynamicColorState(): DynamicColorState {
    return { ...this.dynamicColorState };
  }

  /**
   * Debug utility: Get current facade variable values
   */
  public getFacadeVariableStatus(): any {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      // Core Spicetify Variables
      spicetifyVars: {
        accent: computedStyle.getPropertyValue("--spice-accent").trim(),
        button: computedStyle.getPropertyValue("--spice-button").trim(),
        rgbAccent: computedStyle.getPropertyValue("--spice-rgb-accent").trim(),
        base: computedStyle.getPropertyValue("--spice-base").trim(),
      },

      // Visual Extensions
      visualVars: {
        gradientPrimary: computedStyle
          .getPropertyValue("--sn-bg-gradient-primary-rgb")
          .trim(),
        accentHex: computedStyle
          .getPropertyValue("--sn-color-accent-hex")
          .trim(),
        accentRgb: computedStyle
          .getPropertyValue("--sn-color-accent-rgb")
          .trim(),
        extractedPrimary: computedStyle
          .getPropertyValue("--sn-color-extracted-primary-rgb")
          .trim(),
        livingBaseGradient: computedStyle
          .getPropertyValue("--living-base-gradient")
          .trim(),
      },

      // Configuration Status
      config: {
        dynamicAccentEnabled: this.checkDynamicAccentEnabled(),
        accentUpdateEnabled: this.integrationConfig.accentUpdateEnabled,
        visualEnabled:
          this.integrationConfig.visualIntegrationEnabled,
        isActive: this.isActive,
      },
    };
  }

  /**
   * Update integration configuration
   */
  public updateConfig(newConfig: Partial<CatppuccinIntegrationConfig>): void {
    this.integrationConfig = { ...this.integrationConfig, ...newConfig };
    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Configuration updated:",
      newConfig
    );
  }

  public override async healthCheck(): Promise<any> {
    const isDynamicEnabled = this.checkDynamicAccentEnabled();
    const hasRecentUpdate =
      Date.now() - this.dynamicColorState.lastUpdateTime < 30000; // 30s

    return {
      healthy: this.isActive && isDynamicEnabled,
      issues:
        this.isActive && !isDynamicEnabled
          ? ["Dynamic accent not enabled in settings"]
          : [],
      metrics: {
        dynamicAccentEnabled: isDynamicEnabled,
        currentAccent: this.dynamicColorState.currentAccentHex,
        lastUpdateAge: Date.now() - this.dynamicColorState.lastUpdateTime,
        hasRecentUpdate,
        transitionInProgress: this.dynamicColorState.transitionInProgress,
        musicEnergy: this.dynamicColorState.musicEnergy,
      },
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Clear any active transitions
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = 0;
    }

    this.dynamicColorState.transitionInProgress = false;

    // 🔧 CRITICAL FIX: Clean up UnifiedEventBus subscriptions
    unifiedEventBus.unsubscribeAll("DynamicCatppuccinBridge");

    Y3KDebug?.debug?.log(
      "DynamicCatppuccinBridge",
      "Dynamic Catppuccin bridge cleaned up (including UnifiedEventBus subscriptions)"
    );
  }
}
