/**
 * RenderingModeSelector - Intelligent rendering mode selection
 *
 * Determines the optimal rendering mode based on:
 * - Device capabilities (WebGL, shaders, performance tier)
 * - User preferences (rendering-mode, corridor-effects-mode settings)
 * - Graceful fallback chain when features unavailable
 */

import { Y3KDebug } from "@/debug/DebugCoordinator";
import { getSettings } from "@/config/settingsProvider";
import type { TypedSettingsManager } from "@/config/typedSettingsManager";
import type { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import type { WebGLGradientBackgroundSystem } from "../background/WebGLRenderer";
import {
  RenderingMode,
  type RenderingCapabilities,
  type ModeSelectionResult,
  type DeviceTier,
  type RenderingModePreference,
  type CorridorEffectsMode,
  requiresWebGL,
  requiresLiquidShader,
  requiresCorridorShader,
  getLowerMode,
} from "@/types/renderingModes";

export class RenderingModeSelector {
  private webglGradientSystem: WebGLGradientBackgroundSystem;
  private performanceCoordinator: SimplePerformanceCoordinator;
  private settingsManager: TypedSettingsManager;

  constructor(
    webglGradientSystem: WebGLGradientBackgroundSystem,
    performanceCoordinator: SimplePerformanceCoordinator
  ) {
    this.webglGradientSystem = webglGradientSystem;
    this.performanceCoordinator = performanceCoordinator;
    this.settingsManager = getSettings();
  }

  /**
   * Select the optimal rendering mode based on capabilities and user preferences
   */
  public selectMode(fluidGradientSystemInstance?: any): ModeSelectionResult {
    // Detect current capabilities
    const capabilities = this.detectCapabilities(fluidGradientSystemInstance);

    // Get user preferences from settings
    const renderingModePreference = this.settingsManager.get("sn-rendering-mode");
    const corridorEffectsMode = this.settingsManager.get("sn-corridor-effects-mode");

    Y3KDebug?.debug?.log(
      "RenderingModeSelector",
      "Starting mode selection",
      {
        capabilities,
        userPreferences: {
          renderingMode: renderingModePreference,
          corridorEffects: corridorEffectsMode,
        },
      }
    );

    // Select mode based on capabilities and preferences
    return this.selectModeFromCapabilities(
      capabilities,
      renderingModePreference,
      corridorEffectsMode
    );
  }

  /**
   * Detect current rendering capabilities
   */
  private detectCapabilities(fluidGradientSystemInstance?: any): RenderingCapabilities {
    const hasWebGL = this.hasWebGL();
    const hasLiquidShader = fluidGradientSystemInstance
      ? this.hasLiquidShader(fluidGradientSystemInstance)
      : false;
    const hasCorridorShader = this.hasCorridorShader();
    const deviceTier = this.getDeviceTier();

    // Get additional WebGL info if available
    let webglVersion: number | undefined;
    let gpuRenderer: string | undefined;

    if (hasWebGL) {
      const gl = (this.webglGradientSystem as any).gl;
      if (gl) {
        // Detect WebGL version (1 or 2)
        webglVersion = gl instanceof WebGL2RenderingContext ? 2 : 1;

        // Try to get GPU renderer info
        try {
          const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        } catch (error) {
          // GPU info not available, continue without it
        }
      }
    }

    const capabilities: RenderingCapabilities = {
      hasWebGL,
      hasLiquidShader,
      hasCorridorShader,
      deviceTier,
      ...(webglVersion !== undefined && { webglVersion }),
      ...(gpuRenderer !== undefined && { gpuRenderer }),
    };

    Y3KDebug?.debug?.log(
      "RenderingModeSelector",
      "Capabilities detected",
      capabilities
    );

    return capabilities;
  }

  /**
   * Check if WebGL is available
   */
  private hasWebGL(): boolean {
    const gl = (this.webglGradientSystem as any).gl;
    return gl !== null && gl !== undefined;
  }

  /**
   * Check if liquid shader compiled successfully
   */
  private hasLiquidShader(fluidGradientSystem: any): boolean {
    // Check if FluidGradientBackgroundSystem has compiled liquid shader
    const shaderProgram = fluidGradientSystem.shaderProgram;
    return shaderProgram !== null && shaderProgram !== undefined;
  }

  /**
   * Check if corridor shader compiled successfully
   */
  private hasCorridorShader(): boolean {
    const corridorShaderProgram = (this.webglGradientSystem as any).corridorShaderProgram;
    return corridorShaderProgram !== null && corridorShaderProgram !== undefined;
  }

  /**
   * Get device performance tier
   */
  private getDeviceTier(): DeviceTier {
    const tier = this.performanceCoordinator.getDeviceTier();
    // Map performance coordinator's tier to our DeviceTier type
    return tier as DeviceTier;
  }

  /**
   * Select rendering mode based on capabilities and user preferences
   */
  private selectModeFromCapabilities(
    capabilities: RenderingCapabilities,
    userRenderingPreference: RenderingModePreference,
    userCorridorPreference: CorridorEffectsMode
  ): ModeSelectionResult {
    let selectedMode: RenderingMode;
    let reason: string;
    let isFallback = false;

    // Determine maximum capable mode based on hardware
    const maxCapableMode = this.getMaxCapableMode(capabilities);

    // Determine desired mode based on user preferences
    let desiredMode: RenderingMode;

    if (userRenderingPreference !== "auto") {
      // User explicitly selected a rendering mode
      desiredMode = userRenderingPreference as RenderingMode;
      reason = `User explicitly requested ${desiredMode} mode`;
    } else {
      // Auto mode: Use corridor preference and device tier
      if (userCorridorPreference === "disabled") {
        // User disabled corridor effects, cap at Enhanced
        desiredMode = RenderingMode.Enhanced;
        reason = "User disabled corridor effects, selecting Enhanced mode";
      } else if (userCorridorPreference === "enabled") {
        // User wants corridor effects, try Full mode
        desiredMode = RenderingMode.Full;
        reason = "User enabled corridor effects, attempting Full mode";
      } else {
        // Auto corridor preference: Use device tier
        desiredMode = this.getModeFromDeviceTier(capabilities.deviceTier);
        reason = `Auto mode based on ${capabilities.deviceTier} device tier`;
      }
    }

    // Validate desired mode against capabilities
    selectedMode = this.validateModeAgainstCapabilities(
      desiredMode,
      maxCapableMode,
      capabilities
    );

    // Check if we had to fall back from desired mode
    if (selectedMode !== desiredMode) {
      isFallback = true;
      reason += ` → Fell back to ${selectedMode} (capability constraint: ${this.getFallbackReason(selectedMode, desiredMode, capabilities)})`;
    }

    Y3KDebug?.debug?.log(
      "RenderingModeSelector",
      "Mode selection complete",
      {
        desiredMode,
        selectedMode,
        maxCapableMode,
        isFallback,
        reason,
      }
    );

    return {
      mode: selectedMode,
      reason,
      isFallback,
      capabilities,
    };
  }

  /**
   * Get maximum capable mode based on hardware capabilities
   */
  private getMaxCapableMode(capabilities: RenderingCapabilities): RenderingMode {
    if (!capabilities.hasWebGL) {
      return RenderingMode.Basic;
    }

    if (!capabilities.hasLiquidShader) {
      return RenderingMode.Standard;
    }

    if (!capabilities.hasCorridorShader) {
      return RenderingMode.Enhanced;
    }

    // All shaders available, check device tier
    if (capabilities.deviceTier === "low") {
      return RenderingMode.Standard;
    }

    if (capabilities.deviceTier === "medium") {
      return RenderingMode.Enhanced;
    }

    // High tier with all capabilities
    return RenderingMode.Full;
  }

  /**
   * Get recommended mode based on device tier
   */
  private getModeFromDeviceTier(tier: DeviceTier): RenderingMode {
    switch (tier) {
      case "low":
        return RenderingMode.Standard;
      case "medium":
        return RenderingMode.Enhanced;
      case "high":
        return RenderingMode.Full;
      default:
        return RenderingMode.Standard;
    }
  }

  /**
   * Validate desired mode against capabilities, falling back if necessary
   */
  private validateModeAgainstCapabilities(
    desiredMode: RenderingMode,
    maxCapableMode: RenderingMode,
    capabilities: RenderingCapabilities
  ): RenderingMode {
    let currentMode = desiredMode;

    // Walk down the fallback chain until we find a compatible mode
    while (currentMode !== RenderingMode.Basic) {
      // Check if current mode is within capability ceiling
      if (this.getModeLevel(currentMode) <= this.getModeLevel(maxCapableMode)) {
        // Check specific requirements
        if (this.canSupportMode(currentMode, capabilities)) {
          return currentMode;
        }
      }

      // Try lower mode
      const lowerMode = getLowerMode(currentMode);
      if (lowerMode === null) {
        break;
      }
      currentMode = lowerMode;
    }

    // Fallback to Basic if nothing else works
    return RenderingMode.Basic;
  }

  /**
   * Check if capabilities support a specific mode
   */
  private canSupportMode(
    mode: RenderingMode,
    capabilities: RenderingCapabilities
  ): boolean {
    if (requiresWebGL(mode) && !capabilities.hasWebGL) {
      return false;
    }

    if (requiresLiquidShader(mode) && !capabilities.hasLiquidShader) {
      return false;
    }

    if (requiresCorridorShader(mode) && !capabilities.hasCorridorShader) {
      return false;
    }

    return true;
  }

  /**
   * Get numeric level for mode comparison
   */
  private getModeLevel(mode: RenderingMode): number {
    const levels = {
      [RenderingMode.Basic]: 1,
      [RenderingMode.Standard]: 2,
      [RenderingMode.Enhanced]: 3,
      [RenderingMode.Full]: 4,
    };
    return levels[mode];
  }

  /**
   * Get human-readable reason for fallback
   */
  private getFallbackReason(
    selectedMode: RenderingMode,
    desiredMode: RenderingMode,
    capabilities: RenderingCapabilities
  ): string {
    if (requiresCorridorShader(desiredMode) && !capabilities.hasCorridorShader) {
      return "corridor shader unavailable";
    }

    if (requiresLiquidShader(desiredMode) && !capabilities.hasLiquidShader) {
      return "liquid shader unavailable";
    }

    if (requiresWebGL(desiredMode) && !capabilities.hasWebGL) {
      return "WebGL unavailable";
    }

    if (capabilities.deviceTier === "low") {
      return "low-tier device";
    }

    return "capability mismatch";
  }
}
