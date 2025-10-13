/**
 * ColorStateManager - Unified Color State Coordination
 *
 * Central component that manages the combination of Catppuccin flavor, brightness mode,
 * accent color selection, and dynamic album art colors. Provides the single source of truth
 * for all color decisions in the Year 3000 System.
 *
 * @architecture Year3000System integration with event-driven updates
 * @performance Efficient CSS variable batching with change detection
 */

import { settings } from "@/config";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import {
  CSSVariableWriter,
  getGlobalCSSVariableWriter,
} from "@/core/css/CSSVariableWriter";
import { DynamicPaletteIntegration } from "@/core/css/DynamicPaletteIntegration";
import { unifiedEventBus } from "@/core/events/EventBus";
import { DefaultServiceFactory } from "@/core/services/CoreServiceProviders";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import {
  getAccentColor,
  getBrightnessAdjustedBaseColor,
  getBrightnessAdjustedSurfaceColor,
  getDefaultAccentColor,
  paletteSystemManager,
  type UnifiedColor,
  type UnifiedColorName,
  type UnifiedFlavor,
  type UnifiedPalette,
} from "@/utils/color/PaletteSystemManager";

export interface ColorStateConfig {
  paletteSystemFlavor: UnifiedFlavor;
  brightnessMode: "bright" | "balanced" | "dark";
  accentColor: UnifiedColorName | "dynamic";
  dynamicAlbumColors?: {
    primary: UnifiedColor;
    secondary: UnifiedColor;
    accent: UnifiedColor;
  };
  preserveAlbumArt: boolean;
  enableTransitions: boolean;
}

export interface ColorStateResult {
  baseColor: UnifiedColor;
  surfaceColor: UnifiedColor;
  accentColor: UnifiedColor;
  textColor: UnifiedColor;
  effectiveConfig: ColorStateConfig;
  timestamp: number;
}

/**
 * Event types for color state changes
 */
export interface ColorStateEvents {
  "colorState:changed": {
    oldState: ColorStateResult | null;
    newState: ColorStateResult;
    trigger:
      | "settings"
      | "albumArt"
      | "initialization"
      | "brightness"
      | "flavor"
      | "accent";
  };
  "colorState:cssVariablesUpdated": {
    variablesCount: number;
    updateDuration: number;
    verificationPassed?: boolean;
  };
  "colorState:flavorChanged": {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
  "colorState:brightnessChanged": {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
  "colorState:accentChanged": {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
}

/**
 * 🔧 PHASE 3: CSS Color Controller - Single CSS Write Authority
 *
 * ARCHITECTURAL ROLE: CSS Authority - OWNS all CSS variable writes for color system
 * - Subscribes to: colors:harmonized, colors:extracted events
 * - Manages: Color state, brightness modes, flavor coordination
 * - OWNS: ALL CSS variable writes via CSSVariableWriter
 * - Coordinates: SpicetifyColorBridge for Spicetify integration
 * - Emits: colors:applied event after CSS application
 *
 * SINGLE RESPONSIBILITY: CSS variable management and color state coordination
 * - NO color processing (delegated to OKLABColorProcessor)
 * - NO event routing (delegated to ColorEventOrchestrator)
 * - Pure CSS write authority with state management
 *
 * @class CSSColorController
 * @implements {IManagedSystem}
 */
export class CSSColorController implements IManagedSystem {
  public initialized = false;
  private currentState: ColorStateResult | null = null;
  private isUpdating = false;

  // 🔧 PHASE 3: CSS Authority - Single Unified Controller
  private cssController!: CSSVariableWriter;

  // 🔧 PHASE 2: OKLCH Dynamic Palette Integration
  private dynamicPaletteIntegration: DynamicPaletteIntegration | null = null;

  // Performance tracking
  private updateCount = 0;
  private lastUpdateTime = 0;

  constructor() {
    // No settingsManager needed - using typed settings

    // Initialize dynamic palette integration
    if (ADVANCED_SYSTEM_CONFIG.useDynamicPalettes) {
      this.dynamicPaletteIntegration = new DynamicPaletteIntegration(
        ADVANCED_SYSTEM_CONFIG.enableDebug
      );
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    const services = DefaultServiceFactory.getServices();
    this.cssController =
      services.themeLifecycle?.getCssController() ||
      getGlobalCSSVariableWriter();

    // Listen for settings changes
    unifiedEventBus.subscribe(
      "settings:changed",
      this.handleSettingsChange.bind(this),
      "ColorStateManager"
    );

    // 🔧 PHASE 2: Subscribe to all color processing events as single CSS authority
    unifiedEventBus.subscribe(
      "colors:harmonized",
      this.handleProcessedColors.bind(this),
      "ColorStateManager"
    );
    unifiedEventBus.subscribe(
      "colors:extracted",
      this.handleExtractedColors.bind(this),
      "ColorStateManager"
    );

    // 🔧 PHASE 2: Subscribe to visual-effects and music events for dynamic CSS
    unifiedEventBus.subscribe(
      "visual-effects:state-updated",
      this.handleVisualEffectsUpdate.bind(this),
      "ColorStateManager"
    );
    unifiedEventBus.subscribe(
      "music:energy",
      this.handleMusicEnergyUpdate.bind(this),
      "ColorStateManager"
    );

    // 🔧 PHASE 2: Subscribe to CSS variable events from other systems
    unifiedEventBus.subscribe(
      "system:css-variables" as any,
      this.handleSystemCSSVariables.bind(this),
      "ColorStateManager"
    );

    // Apply initial color state using typed settings
    await this.applyInitialColorState();

    this.initialized = true;
    console.log("🎨 [ColorStateManager] Initialized successfully");
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];

    if (!this.currentState) {
      issues.push("No current color state");
    }

    if (this.updateCount === 0) {
      issues.push("No color updates performed yet");
    }

    const timeSinceLastUpdate = Date.now() - this.lastUpdateTime;
    if (timeSinceLastUpdate > 300000) {
      // 5 minutes
      issues.push(
        `Last update was ${Math.round(timeSinceLastUpdate / 1000)}s ago`
      );
    }

    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: `Color state manager - ${this.updateCount} updates performed`,
      issues,
      system: "ColorStateManager",
    };
  }

  public updateAnimation(deltaTime: number): void {
    // No animation updates needed for color state management
  }

  public destroy(): void {
    unifiedEventBus.unsubscribeAll("ColorStateManager");

    // CSS controller cleanup is handled by the system coordinator

    this.currentState = null;
    this.initialized = false;
  }

  /**
   * Get current color state configuration from settings
   */
  private getCurrentConfig(): ColorStateConfig {
    // Get the current flavor from settings, or use palette system default
    const settingsFlavor = settings.get("catppuccin-flavor");
    const currentFlavor =
      (settingsFlavor as UnifiedFlavor) ||
      paletteSystemManager.getCurrentDefaultFlavor();

    return {
      paletteSystemFlavor: currentFlavor,
      brightnessMode: settings.get("sn-brightness-mode") as
        | "bright"
        | "balanced"
        | "dark",
      accentColor: settings.get("catppuccin-accentColor") as
        | UnifiedColorName
        | "dynamic",
      preserveAlbumArt: true, // TODO: Add setting for this
      enableTransitions: true,
    };
  }

  /**
   * Calculate the effective color state based on current configuration
   */
  private calculateColorState(config: ColorStateConfig): ColorStateResult {
    const {
      paletteSystemFlavor,
      brightnessMode,
      accentColor,
      dynamicAlbumColors,
    } = config;

    // Get brightness-adjusted base and surface colors using unified system
    const baseColor = getBrightnessAdjustedBaseColor(
      paletteSystemFlavor,
      brightnessMode
    );
    const surfaceColor = getBrightnessAdjustedSurfaceColor(
      paletteSystemFlavor,
      brightnessMode
    );

    // Determine accent color using unified system
    let effectiveAccentColor: UnifiedColor;
    if (accentColor === "dynamic" && dynamicAlbumColors) {
      effectiveAccentColor = dynamicAlbumColors.accent;
    } else if (accentColor === "dynamic") {
      effectiveAccentColor = getDefaultAccentColor(paletteSystemFlavor);
    } else {
      effectiveAccentColor = getAccentColor(accentColor, paletteSystemFlavor);
    }

    // Get appropriate text color from current palette system
    const currentPalette = paletteSystemManager.getCurrentPalette();
    const flavorPalette = currentPalette[paletteSystemFlavor];
    if (!flavorPalette) {
      throw new Error(
        `Flavor '${paletteSystemFlavor}' not found in current palette system`
      );
    }
    const textColor = flavorPalette[
      "text" as keyof typeof flavorPalette
    ] as UnifiedColor;

    return {
      baseColor,
      surfaceColor,
      accentColor: effectiveAccentColor,
      textColor,
      effectiveConfig: config,
      timestamp: Date.now(),
    };
  }

  /**
   * 🔧 PHASE 2: Enhanced CSS application with batching and priority support
   * Apply color state to CSS variables with batching optimization
   */
  private async applyColorStateToCSSVariables(
    state: ColorStateResult
  ): Promise<void> {
    const startTime = performance.now();

    const cssUpdates = {
      // === CRITICAL PRIORITY: Core color variables ===
      "--sn-cosmic-base-hex": state.baseColor.hex,
      "--sn-cosmic-accent-hex": state.accentColor.hex,
      "--spice-accent": state.accentColor.hex,
      "--spice-base": state.baseColor.hex,

      // === HIGH PRIORITY: Primary gradients and surfaces ===
      "--sn-color-base-hex": state.baseColor.hex,
      "--sn-color-base-rgb": state.baseColor.rgb,
      "--sn-color-surface-hex": state.surfaceColor.hex,
      "--sn-color-surface-rgb": state.surfaceColor.rgb,
      "--sn-color-accent-hex": state.accentColor.hex,
      "--sn-color-accent-rgb": state.accentColor.rgb,
      "--sn-dynamic-accent-hex": state.accentColor.hex,
      "--sn-dynamic-accent-rgb": state.accentColor.rgb,

      // === NORMAL PRIORITY: Extended color systems ===
      "--sn-cosmic-base-rgb": state.baseColor.rgb,
      "--sn-cosmic-surface-hex": state.surfaceColor.hex,
      "--sn-cosmic-surface-rgb": state.surfaceColor.rgb,
      "--sn-cosmic-accent-rgb": state.accentColor.rgb,
      "--sn-color-text-hex": state.textColor.hex,
      "--sn-color-text-rgb": state.textColor.rgb,
      "--sn-cosmic-text-hex": state.textColor.hex,
      "--sn-cosmic-text-rgb": state.textColor.rgb,

      // === NORMAL PRIORITY: Spicetify compatibility ===
      "--spice-surface1": state.surfaceColor.hex,
      "--spice-text": state.textColor.hex,
      "--spice-rgb-base": state.baseColor.rgb,
      "--spice-rgb-surface1": state.surfaceColor.rgb,
      "--spice-rgb-accent": state.accentColor.rgb,
      "--spice-rgb-text": state.textColor.rgb,

      // === NORMAL PRIORITY: Gradient system integration ===
      "--sn-bg-gradient-primary-rgb": state.accentColor.rgb,
      "--sn-bg-gradient-secondary-rgb": state.surfaceColor.rgb,
      "--sn-bg-gradient-accent-rgb": state.accentColor.rgb,

      // === HIGH PRIORITY: Brightness mode application ===
      "--sn-brightness-mode": `"${state.effectiveConfig.brightnessMode}"`,
      "--sn-brightness-data-attr": state.effectiveConfig.brightnessMode,

      // === LOW PRIORITY: Meta information for debugging ===
      "--sn-color-state-flavor": `"${state.effectiveConfig.paletteSystemFlavor}"`,
      "--sn-color-state-brightness": `"${state.effectiveConfig.brightnessMode}"`,
      "--sn-color-state-accent": `"${state.effectiveConfig.accentColor}"`,
      "--sn-color-state-palette-system": `"${paletteSystemManager.getCurrentPaletteSystem()}"`,
      "--sn-color-state-timestamp": state.timestamp.toString(),
    };

    // Apply CSS variables through CSSVariableWriter with intelligent priority grouping
    await this.applyColorVariablesWithPriorities(cssUpdates);

    // PHASE 5: Write full palette themed colors for Year3000 mode
    await this.writePaletteColorsToCSS(state);

    const endTime = performance.now();
    const updateDuration = endTime - startTime;

    console.log(
      `🎨 [ColorStateManager] Applied ${
        Object.keys(cssUpdates).length
      } CSS variables in ${updateDuration.toFixed(2)}ms (via CSSVariableWriter)`
    );
  }

  /**
   * PHASE 5 STOPGAP: Write full palette themed colors to CSS variables
   *
   * Required for themed visual effects (ethereal glow, cinematic bursts, natural tones).
   * Catppuccin mode: Spicetify provides these variables, skip.
   * Year3000 mode: We must write the full palette since Spicetify doesn't provide Year3000 colors.
   *
   * NOTE: This is a temporary solution until OKLCH dynamic palette system is implemented.
   * See: plans/future/oklch-dynamic-palette-system.md
   */
  private async writePaletteColorsToCSS(
    state: ColorStateResult
  ): Promise<void> {
    const paletteSystem = paletteSystemManager.getCurrentPaletteSystem();

    // PHASE 2: Check if dynamic palette generation is enabled
    if (this.dynamicPaletteIntegration?.shouldUseDynamicGeneration()) {
      await this.writeDynamicPaletteColors(state, paletteSystem);
      return;
    }

    // Catppuccin mode: Spicetify provides these variables, skip
    if (paletteSystem === "catppuccin") {
      return;
    }

    // Year3000 mode: We must write the full palette
    const currentPalette = paletteSystemManager.getCurrentPalette();
    const flavorPalette = currentPalette[
      state.effectiveConfig.paletteSystemFlavor
    ] as UnifiedPalette | undefined;

    if (!flavorPalette) {
      console.warn(
        `[ColorStateManager] No palette found for flavor: ${state.effectiveConfig.paletteSystemFlavor}`
      );
      return;
    }

    // Extract the 11 themed colors used by SCSS for visual effects
    // These colors are referenced in src/design-tokens/tokens.scss for:
    // - Ethereal effects (mauve, teal, rosewater, lavender, yellow)
    // - Cinematic effects (red, blue, peach/amber, teal/cyan)
    // - Natural themes (green, sky, peach/sunset, overlay0/stone)
    const paletteVariables: Record<string, string> = {
      "--spice-rgb-blue": (flavorPalette as any).blue?.rgb || "137, 180, 250",
      "--spice-rgb-green": (flavorPalette as any).green?.rgb || "166, 227, 161",
      "--spice-rgb-lavender":
        (flavorPalette as any).lavender?.rgb || "180, 190, 254",
      "--spice-rgb-mauve": (flavorPalette as any).mauve?.rgb || "203, 166, 247",
      "--spice-rgb-overlay0":
        (flavorPalette as any).overlay0?.rgb || "108, 112, 134",
      "--spice-rgb-peach": (flavorPalette as any).peach?.rgb || "250, 179, 135",
      "--spice-rgb-red": (flavorPalette as any).red?.rgb || "243, 139, 168",
      "--spice-rgb-rosewater":
        (flavorPalette as any).rosewater?.rgb || "245, 224, 220",
      "--spice-rgb-sky": (flavorPalette as any).sky?.rgb || "137, 220, 235",
      "--spice-rgb-teal": (flavorPalette as any).teal?.rgb || "148, 226, 213",
      "--spice-rgb-yellow":
        (flavorPalette as any).yellow?.rgb || "249, 226, 175",
    };

    // Write through CSS controller with normal priority
    if (this.cssController?.batchSetVariables) {
      this.cssController.batchSetVariables(
        "Year3000Palette",
        paletteVariables,
        "normal",
        "palette-themed-colors"
      );
    } else {
      // Fallback: direct DOM write
      const root = document.documentElement;
      Object.entries(paletteVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    console.log(
      `🎨 [ColorStateManager] Applied Year3000 palette themed colors`,
      {
        flavor: state.effectiveConfig.paletteSystemFlavor,
        colors: Object.keys(paletteVariables).length,
      }
    );
  }

  /**
   * Apply color variables through CSSVariableWriter with intelligent priority grouping
   */
  private async applyColorVariablesWithPriorities(
    cssUpdates: Record<string, string>
  ): Promise<void> {
    // Group variables by priority for optimized coordination
    const criticalVars = [
      "--sn-cosmic-base-hex",
      "--sn-cosmic-accent-hex",
      "--spice-accent",
      "--spice-base",
    ];
    const highPriorityVars = [
      "--sn-color-",
      "--sn-dynamic-accent-",
      "--sn-brightness-mode",
      "--sn-brightness-data-attr",
    ];

    const criticalUpdates: Record<string, string> = {};
    const highPriorityUpdates: Record<string, string> = {};
    const normalUpdates: Record<string, string> = {};
    const lowPriorityUpdates: Record<string, string> = {};

    // Group variables by priority
    Object.entries(cssUpdates).forEach(([property, value]) => {
      if (criticalVars.some((prefix) => property.includes(prefix))) {
        criticalUpdates[property] = value;
      } else if (highPriorityVars.some((prefix) => property.includes(prefix))) {
        highPriorityUpdates[property] = value;
      } else if (
        property.includes("state-") ||
        property.includes("timestamp")
      ) {
        lowPriorityUpdates[property] = value;
      } else {
        normalUpdates[property] = value;
      }
    });

    // Apply updates in separate batches by priority using CSSVariableWriter
    if (Object.keys(criticalUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        criticalUpdates,
        "critical",
        "color-state-critical"
      );
    }

    if (Object.keys(highPriorityUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        highPriorityUpdates,
        "high",
        "color-state-high"
      );
    }

    if (Object.keys(normalUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        normalUpdates,
        "normal",
        "color-state-normal"
      );
    }

    if (Object.keys(lowPriorityUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        lowPriorityUpdates,
        "low",
        "color-state-meta"
      );
    }
  }

  /**
   * 🔧 PHASE 2: Generic method for other systems to queue CSS updates through ColorStateManager using coordination
   * This makes ColorStateManager the single CSS authority for all color-related variables
   */
  public queueCSSVariableUpdate(
    property: string,
    value: string,
    priority: "critical" | "high" | "normal" | "low" = "normal"
  ): void {
    // Use coordination-first approach with proper priority mapping
    const mappedPriority: "low" | "normal" | "high" | "critical" =
      priority === "critical"
        ? "critical"
        : priority === "high"
        ? "high"
        : priority === "low"
        ? "low"
        : "normal";

    this.cssController.setVariable(
      "ColorStateManager",
      property,
      value,
      mappedPriority,
      "color-state-queue"
    );
  }

  // All CSS variable updates now handled directly through CSSVariableWriter

  /**
   * Verify that critical CSS variables were actually applied to the DOM
   */
  private async verifyCSSVariablesApplied(
    cssUpdates: Record<string, string>
  ): Promise<boolean> {
    // Check a few critical variables to ensure they were applied
    const criticalVars = [
      "--sn-cosmic-base-hex",
      "--sn-cosmic-accent-hex",
      "--spice-base",
    ];

    for (const varName of criticalVars) {
      if (cssUpdates[varName]) {
        const computedValue = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
        const expectedValue = cssUpdates[varName];

        if (computedValue !== expectedValue) {
          console.warn(
            `🎨 [ColorStateManager] Variable verification failed: ${varName} = "${computedValue}" (expected "${expectedValue}")`
          );
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Update color state with change detection
   */
  public async updateColorState(
    trigger:
      | "settings"
      | "albumArt"
      | "initialization"
      | "brightness"
      | "flavor"
      | "accent" = "settings"
  ): Promise<void> {
    if (this.isUpdating) return;

    this.isUpdating = true;
    try {
      const config = this.getCurrentConfig();
      const newState = this.calculateColorState(config);

      // Check if state actually changed
      const hasChanged =
        !this.currentState ||
        this.currentState.baseColor.hex !== newState.baseColor.hex ||
        this.currentState.surfaceColor.hex !== newState.surfaceColor.hex ||
        this.currentState.accentColor.hex !== newState.accentColor.hex ||
        this.currentState.effectiveConfig.paletteSystemFlavor !==
          newState.effectiveConfig.paletteSystemFlavor ||
        this.currentState.effectiveConfig.brightnessMode !==
          newState.effectiveConfig.brightnessMode;

      if (hasChanged) {
        const oldState = this.currentState;

        // Apply to CSS variables
        await this.applyColorStateToCSSVariables(newState);

        // Apply brightness mode via data attribute (CSS handles all adjustments)
        this.applyBrightnessModeAttribute(
          newState.effectiveConfig.brightnessMode
        );

        // Update state
        this.currentState = newState;
        this.updateCount++;
        this.lastUpdateTime = Date.now();

        // Emit change event
        unifiedEventBus.emit("colors:applied" as any, {
          oldState,
          newState,
          trigger,
          cssVariables: {
            "--sn-cosmic-base-hex": newState.baseColor.hex,
            "--sn-cosmic-accent-hex": newState.accentColor.hex,
          },
          accentHex: newState.accentColor.hex,
          accentRgb: newState.accentColor.rgb,
          appliedAt: Date.now(),
        });

        console.log(
          `🎨 [ColorStateManager] Color state updated (${trigger}):`,
          {
            flavor: newState.effectiveConfig.paletteSystemFlavor,
            brightness: newState.effectiveConfig.brightnessMode,
            accent: newState.effectiveConfig.accentColor,
            paletteSystem: paletteSystemManager.getCurrentPaletteSystem(),
            base: newState.baseColor.hex,
            surface: newState.surfaceColor.hex,
            accentHex: newState.accentColor.hex,
          }
        );
      }
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Apply brightness mode via data attribute only
   * CSS handles all brightness adjustments via --sn-brightness-current-* variables
   *
   * This eliminates the double-darkening bug where JavaScript applied 0.85x darkening
   * on top of CSS brightness multipliers, causing colors to be 15% darker than intended.
   */
  private applyBrightnessModeAttribute(
    brightnessMode: "bright" | "balanced" | "dark"
  ): void {
    // Set data attribute - CSS will handle all brightness adjustments
    document.documentElement.setAttribute(
      "data-brightness-mode",
      brightnessMode
    );

    // Log for debugging
    console.log(
      `🎨 [ColorStateManager] Brightness mode set: ${brightnessMode} (CSS-only, no JS processing)`
    );
  }

  /**
   * Apply initial color state during system initialization
   */
  public async applyInitialColorState(): Promise<void> {
    await this.updateColorState("initialization");
  }

  /**
   * Handle settings changes
   */
  private async handleSettingsChange(event: any): Promise<void> {
    const { settingKey, newValue, oldValue } = event;

    if (
      [
        "catppuccin-flavor",
        "sn-brightness-mode",
        "catppuccin-accentColor",
      ].includes(settingKey)
    ) {
      let trigger: "settings" | "brightness" | "flavor" | "accent" = "settings";

      if (settingKey === "catppuccin-flavor") trigger = "flavor";
      else if (settingKey === "sn-brightness-mode") trigger = "brightness";
      else if (settingKey === "catppuccin-accentColor") trigger = "accent";

      // Emit specific setting change events for targeted system updates
      unifiedEventBus.emit(`colorState:${trigger}Changed` as any, {
        settingKey,
        newValue,
        oldValue,
        timestamp: Date.now(),
      });

      await this.updateColorState(trigger);
    }
  }

  /**
   * PHASE 4C: Helper method to convert hex color to RGB object
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1]!, 16),
          g: parseInt(result[2]!, 16),
          b: parseInt(result[3]!, 16),
        }
      : null;
  }

  /**
   * PHASE 4C: Convert processed colors to CSS variables with explicit naming for base vs OKLAB variants
   *
   * Input: processedColors with keys like 'blue', 'mauve', 'oklab-blue', 'oklab-mauve'
   * Output: CSS variables with correct prefixes: --sn-blue, --oklab-blue
   *
   * Features:
   * - Explicit handling for oklab- prefixed keys
   * - RGB variant generation for both base and OKLAB colors
   * - Tier 1-3 filtering (only output configured OKLAB variants)
   */
  private convertProcessedColorsToCSSVariables(
    processedColors: Record<string, string>
  ): Record<string, string> {
    const colorVariables: Record<string, string> = {};

    // Phase 4C: Tier configuration (from globalConfig.ts)
    const tier1Colors = [
      "blue",
      "mauve",
      "pink",
      "base",
      "text",
      "mantle",
      "crust",
      "overlay0",
    ];
    const tier2Colors = ["teal", "sapphire", "lavender", "surface1", "overlay1"];
    const tier3Colors = ["red", "yellow", "green"];

    const includeOKLABVariants = [
      ...tier1Colors,
      ...(ADVANCED_SYSTEM_CONFIG.enableTier2OKLABVariants ? tier2Colors : []),
      ...(ADVANCED_SYSTEM_CONFIG.enableTier3OKLABVariants ? tier3Colors : []),
    ];

    Object.entries(processedColors).forEach(([key, value]) => {
      if (!value) return;

      let cssVarName: string;
      let shouldGenerateRGB = false;

      if (key.startsWith("oklab-")) {
        // OKLAB variant: --oklab-blue, --oklab-mauve
        const baseColorName = key.replace("oklab-", "");

        // Only output OKLAB variants for configured tier colors
        if (!includeOKLABVariants.includes(baseColorName)) {
          return; // Skip non-tier OKLAB variants
        }

        cssVarName = `--${key}`; // Already has 'oklab-' prefix
        shouldGenerateRGB = true;
      } else if (key.startsWith("--")) {
        // Already formatted CSS variable
        cssVarName = key;
      } else {
        // Base palette color: --sn-blue, --sn-mauve
        cssVarName = `--sn-${key}`;
        shouldGenerateRGB = true;
      }

      // Set hex value
      colorVariables[cssVarName] = value;

      // Generate RGB variant
      if (shouldGenerateRGB) {
        try {
          const rgb = this.hexToRgb(value);
          if (rgb) {
            colorVariables[`${cssVarName}-rgb`] = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
          }
        } catch (error) {
          console.warn(
            `[ColorStateManager] Failed to convert ${key} to RGB:`,
            error
          );
        }
      }
    });

    return colorVariables;
  }

  /**
   * 🔧 PHASE 2: Handle processed color events from unified color processing
   * This replaces individual CSS application in ColorHarmonyEngine and orchestrators
   */
  private async handleProcessedColors(event: any): Promise<void> {
    const {
      processedColors,
      cssVariables,
      accentHex,
      accentRgb,
      strategies,
      coordinationMetrics,
      timestamp,
    } = event;

    // 🔧 PHASE 2: CSS Authority Pattern
    // ColorStateManager is the SINGLE source of truth for ALL CSS variable writes
    // 🔧 PHASE 4C: Use explicit color variable conversion with OKLAB tier filtering
    const colorVariables: Record<string, string> = {};

    // 🔧 PHASE 2: Prefer pre-generated CSS variables from processor (OKLABColorProcessor)
    if (cssVariables && typeof cssVariables === "object") {
      // Use complete CSS variable set from pure processor
      Object.assign(colorVariables, cssVariables);
    } else {
      // PHASE 4C: Convert processed colors to CSS variables with explicit oklab- handling
      const convertedVariables =
        this.convertProcessedColorsToCSSVariables(processedColors);
      Object.assign(colorVariables, convertedVariables);
    }

    // Ensure primary accent colors are always set (critical for Year3000 system)
    if (accentHex) {
      colorVariables["--sn-accent-hex"] = accentHex;
      colorVariables["--sn-processed-accent-hex"] = accentHex;
      colorVariables["--sn-color-accent-hex"] = accentHex;
    }
    if (accentRgb) {
      colorVariables["--sn-accent-rgb"] = accentRgb;
      colorVariables["--sn-processed-accent-rgb"] = accentRgb;
      colorVariables["--sn-color-accent-rgb"] = accentRgb;
    }

    // Add coordination metrics as CSS variables for debugging
    if (coordinationMetrics) {
      if (coordinationMetrics.emotionalState) {
        colorVariables[
          "--sn-emotional-state"
        ] = `"${coordinationMetrics.emotionalState}"`;
      }
      if (coordinationMetrics.musicInfluenceStrength !== undefined) {
        colorVariables["--sn-music-influence"] =
          coordinationMetrics.musicInfluenceStrength.toFixed(3);
      }
    }

    // Apply all color variables with appropriate priorities
    Object.entries(colorVariables).forEach(([property, value]) => {
      let priority: "critical" | "high" | "normal" | "low" = "normal";

      if (property.includes("accent-hex") || property.includes("accent-rgb")) {
        priority = "high";
      } else if (
        property.includes("debug") ||
        property.includes("state") ||
        property.includes("influence")
      ) {
        priority = "low";
      }

      this.queueCSSVariableUpdate(property, value, priority);
    });

    // 🔧 PHASE 2: Emit colors:applied event for UI components needing immediate notification
    unifiedEventBus.emitSync("colors:applied", {
      cssVariables: colorVariables,
      accentHex: accentHex || colorVariables["--sn-accent-hex"],
      accentRgb: accentRgb || colorVariables["--sn-accent-rgb"],
      strategies: strategies || ["OKLABColorProcessor"],
      appliedAt: timestamp || Date.now(),
    });

    console.log(
      `🎨 [ColorStateManager] Applied ${
        Object.keys(colorVariables).length
      } processed color variables from ${
        strategies?.join(", ") || "OKLABColorProcessor"
      }`
    );
  }

  /**
   * 🔧 PHASE 2: Handle extracted colors from album art
   */
  private async handleExtractedColors(event: any): Promise<void> {
    const { rawColors, trackUri, musicData } = event;

    // Apply raw colors as CSS variables for systems that need them
    const extractedVariables: Record<string, string> = {};

    Object.entries(rawColors as Record<string, string>).forEach(
      ([key, value]) => {
        if (value) {
          extractedVariables[`--sn-extracted-${key.toLowerCase()}`] = value;
        }
      }
    );

    // Add track information
    if (trackUri) {
      extractedVariables["--sn-current-track-id"] = `"${trackUri}"`;
    }

    // Apply with low priority since these are raw, unprocessed colors
    Object.entries(extractedVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, "low");
    });
  }

  /**
   * 🔧 PHASE 2: Handle visual-effects updates and apply visual-effects CSS variables
   */
  private async handleVisualEffectsUpdate(event: any): Promise<void> {
    const { payload } = event;

    if (!payload) return;

    const visualEffectsVariables: Record<string, string> = {
      "--sn-visual-effects-level": (payload.visualEffectsLevel || 0).toFixed(3),
      "--sn-emotional-temperature": (
        payload.emotionalTemperature || 6500
      ).toString(),
      "--sn-transcendence-level": (payload.transcendenceLevel || 0).toFixed(3),
      "--sn-volumetric-depth": (payload.volumetricDepth || 0).toFixed(3),
      "--sn-data-stream-intensity": (payload.dataStreamIntensity || 0).toFixed(
        3
      ),
      "--sn-cosmic-resonance": (payload.cosmicResonance || 0).toFixed(3),
    };

    // Apply visual-effects variables with normal priority
    Object.entries(visualEffectsVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, "normal");
    });
  }

  /**
   * 🔧 PHASE 2: Handle music energy updates for dynamic CSS variables
   */
  private async handleMusicEnergyUpdate(event: any): Promise<void> {
    const { energy, valence, tempo } = event;

    const musicVariables: Record<string, string> = {};

    if (energy !== undefined) {
      musicVariables["--sn-music-energy"] = energy.toFixed(3);
    }
    if (valence !== undefined) {
      musicVariables["--sn-music-valence"] = valence.toFixed(3);
    }
    if (tempo !== undefined) {
      musicVariables["--sn-music-tempo"] = tempo.toString();
    }

    // Apply music variables with high priority for responsive effects
    Object.entries(musicVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, "high");
    });
  }

  /**
   * 🔧 PHASE 2: Handle CSS variable events from other systems (ColorHarmonyEngine, etc.)
   * This makes ColorStateManager the single CSS authority for all systems
   */
  private async handleSystemCSSVariables(event: any): Promise<void> {
    const { source, variables, timestamp } = event;

    if (!variables || typeof variables !== "object") return;

    // Apply variables from other systems with appropriate priorities
    Object.entries(variables as Record<string, string>).forEach(
      ([property, value]) => {
        let priority: "critical" | "high" | "normal" | "low" = "normal";

        // Harmony and animation variables are high priority for smooth effects
        if (
          property.includes("harmony") ||
          property.includes("glow") ||
          property.includes("pulse")
        ) {
          priority = "high";
        } else if (
          property.includes("debug") ||
          property.includes("animation")
        ) {
          priority = "low";
        }

        this.queueCSSVariableUpdate(property, value, priority);
      }
    );

    console.log(
      `🎨 [ColorStateManager] Applied ${
        Object.keys(variables).length
      } CSS variables from ${source}`
    );
  }

  /**
   * Get current color state (read-only)
   */
  public getCurrentState(): ColorStateResult | null {
    return this.currentState ? { ...this.currentState } : null;
  }

  /**
   * Force refresh of color state
   */
  public async refresh(): Promise<void> {
    await this.updateColorState("settings");
  }

  /**
   * PHASE 2: Write palette colors using dynamic OKLCH generation
   */
  private async writeDynamicPaletteColors(
    state: ColorStateResult,
    paletteSystem: "catppuccin" | "year3000"
  ): Promise<void> {
    if (!this.dynamicPaletteIntegration) return;

    const brightnessMode =
      state.effectiveConfig.brightnessMode === "dark" ? "dark" : "light";

    try {
      const result = this.dynamicPaletteIntegration.generatePalette({
        baseColor: state.baseColor.hex,
        accentColor: state.accentColor.hex,
        brightnessMode,
        paletteSystem,
      });

      if (ADVANCED_SYSTEM_CONFIG.enableDebug) {
        console.log(`🎨 [ColorStateManager] Dynamic palette generated:`, {
          generationTimeMs: result.generationTimeMs.toFixed(2),
          cacheHit: result.cacheHit,
          colorCount: Object.keys(result.palette).length,
        });
      }

      // Write all CSS variables through CSS controller
      if (this.cssController?.batchSetVariables) {
        this.cssController.batchSetVariables(
          "DynamicPalette",
          result.cssVariables,
          "normal",
          "palette-dynamic-oklch"
        );
      } else {
        // Fallback: direct DOM write
        const root = document.documentElement;
        Object.entries(result.cssVariables).forEach(([key, value]) => {
          root.style.setProperty(key, value);
        });
      }
    } catch (error) {
      console.error(
        "[ColorStateManager] Dynamic palette generation failed:",
        error
      );
    }
  }
}

// =============================================================================
// BACKWARD COMPATIBILITY ALIASES
// =============================================================================

/**
 * @deprecated Use CSSColorController instead. This alias is provided for backward compatibility.
 * Will be removed in a future version after all imports are updated.
 *
 * ColorStateManager has been renamed to CSSColorController to better reflect its role
 * as the single CSS write authority in the architecture.
 *
 * Migration path:
 * ```typescript
 * // Old (deprecated)
 * import { ColorStateManager } from '@/core/css/ColorStateManager';
 *
 * // New (recommended)
 * import { CSSColorController } from '@/core/css/ColorStateManager';
 * // or: import { CSSColorController as ColorStateManager } from '@/core/css/ColorStateManager';
 * ```
 */
export const ColorStateManager = CSSColorController;

/**
 * @deprecated Use CSSColorController type instead. This type alias is provided for backward compatibility.
 * Will be removed in a future version after all type annotations are updated.
 */
export type ColorStateManager = CSSColorController;

// Global instance
export const globalColorStateManager = new CSSColorController();
