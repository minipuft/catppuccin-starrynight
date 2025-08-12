/**
 * BackgroundStrategySelector - Intelligent Strategy Selection for Background Systems
 *
 * Implements sophisticated strategy selection logic that considers device capabilities,
 * user preferences, music context, and consciousness levels to optimize background
 * processing strategies for the best performance and visual experience.
 *
 * Philosophy: "The right strategy at the right time - consciousness-aware selection
 * that adapts to the user's device, preferences, and musical journey."
 */

import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  ColorContext,
  IColorProcessor,
  StrategySelectionCriteria,
} from "@/types/colorStrategy";
import { settings } from "@/config";

// Import strategy implementations
import { DepthLayeredStrategy } from "./DepthLayeredStrategy";
import { DynamicCatppuccinStrategy } from "../color/ThemeColorController";
import { LivingGradientStrategy } from "./LivingGradientStrategy";
import { WebGLGradientStrategy } from "./WebGLGradientStrategy";

interface BackgroundStrategySelectionCriteria
  extends StrategySelectionCriteria {
  backgroundType?:
    | "dynamic-accent"
    | "living-gradient"
    | "webgl"
    | "depth-layered"
    | "auto";
  settingsContext: {
    dynamicAccentEnabled: boolean;
    gradientIntensity: string;
    webglEnabled: boolean;
    webglForceEnabled: boolean;
    visualGuideMode: string;
    depthLayersEnabled: boolean;
    consciousnessLevel: number;
    breathingAnimationEnabled: boolean;
  };
  musicContext?: {
    energy: number;
    tempo: number;
    genre: string;
    valence?: number;
  };
  deviceContext: {
    supportsWebGL: boolean;
    performanceLevel: "low" | "medium" | "high";
    memoryCapacity: number;
    isMobile: boolean;
  };
}

interface StrategyMetrics {
  name: string;
  priority: number;
  estimatedProcessingTime: number;
  memoryImpact: number;
  qualityScore: number;
  compatibilityScore: number;
}

export class BackgroundStrategySelector {
  private deviceDetector: DeviceCapabilityDetector;

  // Strategy instances (lazy-loaded)
  private strategyInstances = new Map<string, IColorProcessor>();

  // Strategy metadata for selection decisions
  private strategyMetadata = new Map<string, StrategyMetrics>();

  constructor() {
    this.deviceDetector = new DeviceCapabilityDetector();

    // Initialize strategy metadata
    this.initializeStrategyMetadata();

    Y3KDebug?.debug?.log(
      "BackgroundStrategySelector",
      "Strategy selector initialized"
    );
  }

  /**
   * Initialize metadata for all available strategies
   */
  private initializeStrategyMetadata(): void {
    this.strategyMetadata.set("dynamic-catppuccin", {
      name: "dynamic-catppuccin",
      priority: 10, // Highest priority - core accent system
      estimatedProcessingTime: 5,
      memoryImpact: 2,
      qualityScore: 9,
      compatibilityScore: 10, // Always compatible
    });

    this.strategyMetadata.set("living-gradient", {
      name: "living-gradient",
      priority: 8, // High priority - foundation layer
      estimatedProcessingTime: 8,
      memoryImpact: 3,
      qualityScore: 8,
      compatibilityScore: 9, // Compatible with most devices
    });

    this.strategyMetadata.set("webgl-gradient", {
      name: "webgl-gradient",
      priority: 6, // Medium-high priority - performance dependent
      estimatedProcessingTime: 12,
      memoryImpact: 7,
      qualityScore: 10,
      compatibilityScore: 6, // Requires WebGL support
    });

    this.strategyMetadata.set("webgl-gradient-degraded", {
      name: "webgl-gradient-degraded",
      priority: 5, // Medium priority - for low-end devices
      estimatedProcessingTime: 8,
      memoryImpact: 4,
      qualityScore: 6,
      compatibilityScore: 8, // Better compatibility for low-end devices
    });

    this.strategyMetadata.set("depth-layered", {
      name: "depth-layered",
      priority: 7, // Medium-high priority - consciousness enhancement
      estimatedProcessingTime: 15,
      memoryImpact: 5,
      qualityScore: 9,
      compatibilityScore: 7, // Requires moderate device capabilities
    });
  }

  /**
   * Select optimal strategies based on comprehensive criteria analysis
   */
  selectStrategies(
    context: ColorContext,
    criteria: BackgroundStrategySelectionCriteria
  ): IColorProcessor[] {
    const startTime = performance.now();
    const selectedStrategies: IColorProcessor[] = [];

    try {
      // Build device context if not provided
      const deviceContext = criteria.deviceContext || this.buildDeviceContext();

      // Build settings context if not provided
      const settingsContext =
        criteria.settingsContext || this.buildSettingsContext();

      // Enhanced logging for debugging WebGL gradient issues
      Y3KDebug?.debug?.log(
        "BackgroundStrategySelector",
        "🎯 Strategy Selection Debug - WebGL Gradient Analysis",
        {
          trackUri: context.trackUri,
          colorCount: Object.keys(context.rawColors).length,
          deviceContext: {
            supportsWebGL: deviceContext.supportsWebGL,
            performanceLevel: deviceContext.performanceLevel,
            memoryCapacity: deviceContext.memoryCapacity,
            isMobile: deviceContext.isMobile,
          },
          settingsContext: {
            webglEnabled: settingsContext.webglEnabled,
            webglForceEnabled: settingsContext.webglForceEnabled,
            gradientIntensity: settingsContext.gradientIntensity,
            consciousnessLevel: settingsContext.consciousnessLevel,
          },
        }
      );

      // Strategy selection logic
      const strategyDecisions = this.analyzeStrategyCompatibility(context, {
        ...criteria,
        deviceContext,
        settingsContext,
      });

      // Apply strategy selection rules with detailed logging
      for (const decision of strategyDecisions) {
        Y3KDebug?.debug?.log(
          "BackgroundStrategySelector",
          `Strategy decision: ${decision.strategyName}`,
          {
            shouldInclude: decision.shouldInclude,
            reason: decision.reason,
            score: decision.score,
          }
        );

        if (decision.shouldInclude) {
          const strategy = this.getOrCreateStrategy(decision.strategyName);
          if (strategy) {
            const canProcess = strategy.canProcess(context);
            Y3KDebug?.debug?.log(
              "BackgroundStrategySelector",
              `Strategy ${decision.strategyName} canProcess check`,
              {
                canProcess,
                strategyName: decision.strategyName,
                contextColors: Object.keys(context.rawColors).length,
              }
            );

            if (canProcess) {
              selectedStrategies.push(strategy);
              Y3KDebug?.debug?.log(
                "BackgroundStrategySelector",
                `✅ Selected strategy: ${decision.strategyName}`
              );
            } else {
              Y3KDebug?.debug?.warn(
                "BackgroundStrategySelector",
                `❌ Strategy rejected by canProcess(): ${decision.strategyName}`
              );
            }
          } else {
            Y3KDebug?.debug?.error(
              "BackgroundStrategySelector",
              `Failed to create strategy: ${decision.strategyName}`
            );
          }
        }
      }

      // Ensure we have at least one strategy (fallback to living gradient)
      if (selectedStrategies.length === 0) {
        const fallbackStrategy = this.getOrCreateStrategy("living-gradient");
        if (fallbackStrategy?.canProcess(context)) {
          selectedStrategies.push(fallbackStrategy);
        }
      }

      const processingTime = performance.now() - startTime;

      Y3KDebug?.debug?.log(
        "BackgroundStrategySelector",
        "🎯 Strategy selection completed",
        {
          selectedCount: selectedStrategies.length,
          strategies: selectedStrategies.map((s) => s.getStrategyName()),
          processingTime,
          deviceLevel: deviceContext.performanceLevel,
          visualGuideMode: settingsContext.visualGuideMode,
          webglEnabled: settingsContext.webglEnabled,
          webglForceEnabled: settingsContext.webglForceEnabled,
          supportsWebGL: deviceContext.supportsWebGL,
          totalDecisions: strategyDecisions.length,
          includedDecisions: strategyDecisions.filter(d => d.shouldInclude).length,
        }
      );

      return selectedStrategies;
    } catch (error) {
      Y3KDebug?.debug?.error(
        "BackgroundStrategySelector",
        "Strategy selection failed:",
        error
      );

      // Emergency fallback - return living gradient strategy
      const fallbackStrategy = this.getOrCreateStrategy("living-gradient");
      return fallbackStrategy ? [fallbackStrategy] : [];
    }
  }

  /**
   * Analyze strategy compatibility and selection logic
   */
  private analyzeStrategyCompatibility(
    context: ColorContext,
    criteria: BackgroundStrategySelectionCriteria
  ): Array<{
    strategyName: string;
    shouldInclude: boolean;
    reason: string;
    score: number;
  }> {
    const decisions: Array<{
      strategyName: string;
      shouldInclude: boolean;
      reason: string;
      score: number;
    }> = [];

    // Dynamic Catppuccin Strategy Analysis
    const dynamicScore = this.scoreDynamicCatppuccinStrategy(criteria);
    decisions.push({
      strategyName: "dynamic-catppuccin",
      shouldInclude:
        criteria.settingsContext.dynamicAccentEnabled && dynamicScore > 0.5,
      reason: criteria.settingsContext.dynamicAccentEnabled
        ? `Dynamic accent enabled (score: ${dynamicScore.toFixed(2)})`
        : "Dynamic accent disabled in settings",
      score: dynamicScore,
    });

    // Living Gradient Strategy Analysis
    const livingScore = this.scoreLivingGradientStrategy(criteria);
    decisions.push({
      strategyName: "living-gradient",
      shouldInclude: livingScore > 0.3, // Almost always include as foundation
      reason: `Living gradient foundation (score: ${livingScore.toFixed(2)})`,
      score: livingScore,
    });

    // WebGL Gradient Strategy Analysis (with degraded mode support)
    const webglScore = this.scoreWebGLGradientStrategy(criteria);
    const webglDegradedScore = this.scoreWebGLDegradedStrategy(criteria);
    
    // Full WebGL strategy (with force override)
    const canUseFullWebGL = criteria.settingsContext.webglEnabled &&
      criteria.deviceContext.supportsWebGL &&
      (criteria.deviceContext.performanceLevel !== "low" || criteria.settingsContext.webglForceEnabled) &&
      webglScore > 0.6;
      
    decisions.push({
      strategyName: "webgl-gradient",
      shouldInclude: canUseFullWebGL,
      reason: `WebGL full quality (score: ${webglScore.toFixed(2)}, device: ${
        criteria.deviceContext.performanceLevel
      }${criteria.settingsContext.webglForceEnabled ? ", FORCED" : ""})`,
      score: webglScore,
    });
    
    // Degraded WebGL strategy for low-end devices (only when not forcing full WebGL)
    decisions.push({
      strategyName: "webgl-gradient-degraded",
      shouldInclude:
        criteria.settingsContext.webglEnabled &&
        criteria.deviceContext.supportsWebGL &&
        criteria.deviceContext.performanceLevel === "low" &&
        !criteria.settingsContext.webglForceEnabled && // Don't use degraded if forcing full WebGL
        webglDegradedScore > 0.4,
      reason: `WebGL degraded mode (score: ${webglDegradedScore.toFixed(2)}, device: low${
        criteria.settingsContext.webglForceEnabled ? ", skipped due to force" : ""
      })`,
      score: webglDegradedScore,
    });

    // Depth Layered Strategy Analysis
    const depthScore = this.scoreDepthLayeredStrategy(criteria);
    decisions.push({
      strategyName: "depth-layered",
      shouldInclude:
        criteria.settingsContext.depthLayersEnabled &&
        criteria.settingsContext.consciousnessLevel > 0.4 &&
        criteria.deviceContext.performanceLevel !== "low" &&
        depthScore > 0.5,
      reason: `Depth consciousness (score: ${depthScore.toFixed(
        2
      )}, consciousness: ${criteria.settingsContext.consciousnessLevel})`,
      score: depthScore,
    });

    return decisions;
  }

  /**
   * Score Dynamic Catppuccin Strategy compatibility
   */
  private scoreDynamicCatppuccinStrategy(
    criteria: BackgroundStrategySelectionCriteria
  ): number {
    let score = 0.8; // Base score

    // Settings boost
    if (criteria.settingsContext.dynamicAccentEnabled) score += 0.2;

    // Music responsiveness boost
    if (criteria.musicContext?.energy && criteria.musicContext.energy > 0.7) {
      score += 0.1;
    }

    // Visual guide mode compatibility
    const visualModes = ["cosmic", "cinematic", "ethereal", "natural"];
    if (visualModes.includes(criteria.settingsContext.visualGuideMode)) {
      score += 0.1;
    }

    // Device compatibility (always good)
    score += 0.1;

    return Math.min(1.0, score);
  }

  /**
   * Score Living Gradient Strategy compatibility
   */
  private scoreLivingGradientStrategy(
    criteria: BackgroundStrategySelectionCriteria
  ): number {
    let score = 0.9; // High base score - foundation layer

    // Breathing animation boost
    if (criteria.settingsContext.breathingAnimationEnabled) score += 0.1;

    // Consciousness level boost
    score += criteria.settingsContext.consciousnessLevel * 0.2;

    // Music context boost
    if (criteria.musicContext?.valence !== undefined) {
      score += 0.05; // Slight boost for music awareness
    }

    // Device compatibility
    if (criteria.deviceContext.performanceLevel === "high") score += 0.05;

    return Math.min(1.0, score);
  }

  /**
   * Score WebGL Gradient Strategy compatibility (full quality)
   */
  private scoreWebGLGradientStrategy(
    criteria: BackgroundStrategySelectionCriteria
  ): number {
    let score = 0.0;

    // WebGL support required
    if (!criteria.deviceContext.supportsWebGL) return 0.0;
    if (!criteria.settingsContext.webglEnabled) return 0.0;

    score = 0.6; // Base score for WebGL-capable devices

    // Force WebGL override - significant boost for forced mode
    if (criteria.settingsContext.webglForceEnabled) {
      score += 0.4; // Major boost when forced
      Y3KDebug?.debug?.log(
        "BackgroundStrategySelector",
        "WebGL force enabled - boosting score by 0.4"
      );
    }

    // Performance level boost (exclude low for full quality unless forced)
    switch (criteria.deviceContext.performanceLevel) {
      case "high":
        score += 0.3;
        break;
      case "medium":
        score += 0.2;
        break;
      case "low":
        if (!criteria.settingsContext.webglForceEnabled) {
          return 0.0; // Full quality WebGL not for low-end devices unless forced
        }
        // Low-end device with force enabled gets minimal boost but is allowed
        score += 0.1;
        break;
    }

    // Memory capacity consideration
    if (criteria.deviceContext.memoryCapacity > 4000) score += 0.1; // 4GB+
    if (criteria.deviceContext.memoryCapacity > 8000) score += 0.1; // 8GB+

    // High consciousness level boost
    if (criteria.settingsContext.consciousnessLevel > 0.7) score += 0.1;

    // High-energy music boost
    if (criteria.musicContext?.energy && criteria.musicContext.energy > 0.8) {
      score += 0.1;
    }

    // Mobile penalty
    if (criteria.deviceContext.isMobile) score -= 0.2;

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Score Degraded WebGL Strategy compatibility (for low-end devices)
   */
  private scoreWebGLDegradedStrategy(
    criteria: BackgroundStrategySelectionCriteria
  ): number {
    let score = 0.0;

    // WebGL support required
    if (!criteria.deviceContext.supportsWebGL) return 0.0;
    if (!criteria.settingsContext.webglEnabled) return 0.0;

    // Only for low-end devices
    if (criteria.deviceContext.performanceLevel !== "low") return 0.0;

    score = 0.5; // Base score for degraded WebGL

    // Prefer degraded WebGL over solid colors
    score += 0.3; // Significant preference over non-WebGL fallbacks

    // Consciousness level consideration (reduced impact)
    if (criteria.settingsContext.consciousnessLevel > 0.5) score += 0.1;

    // Music responsiveness (basic support)
    if (criteria.musicContext?.energy && criteria.musicContext.energy > 0.6) {
      score += 0.05;
    }

    // Mobile consideration (less penalty for degraded mode)
    if (criteria.deviceContext.isMobile) score -= 0.1;

    // Memory capacity (minimal requirements)
    if (criteria.deviceContext.memoryCapacity > 2000) score += 0.05; // 2GB+

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Score Depth Layered Strategy compatibility
   */
  private scoreDepthLayeredStrategy(
    criteria: BackgroundStrategySelectionCriteria
  ): number {
    let score = 0.0;

    // Depth layers must be enabled
    if (!criteria.settingsContext.depthLayersEnabled) return 0.0;

    score = 0.5; // Base score

    // Consciousness level is critical
    score += criteria.settingsContext.consciousnessLevel * 0.4;

    // Performance level consideration
    switch (criteria.deviceContext.performanceLevel) {
      case "high":
        score += 0.2;
        break;
      case "medium":
        score += 0.1;
        break;
      case "low":
        score = 0.0;
        return 0.0; // Don't use on low-end devices
    }

    // Visual guide mode boost
    if (
      ["cosmic", "cinematic"].includes(criteria.settingsContext.visualGuideMode)
    ) {
      score += 0.2;
    }

    // Music tempo consideration (slower music = better depth perception)
    if (criteria.musicContext?.tempo && criteria.musicContext.tempo < 100) {
      score += 0.1;
    }

    // Memory capacity
    if (criteria.deviceContext.memoryCapacity > 6000) score += 0.1; // 6GB+

    // Mobile penalty
    if (criteria.deviceContext.isMobile) score -= 0.15;

    return Math.min(1.0, Math.max(0.0, score));
  }

  /**
   * Build device context from current device capabilities
   */
  private buildDeviceContext(): BackgroundStrategySelectionCriteria["deviceContext"] {
    const memoryMB = (window.navigator as any).deviceMemory
      ? (window.navigator as any).deviceMemory * 1024
      : 4096; // Default 4GB
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    return {
      supportsWebGL: this.deviceDetector.hasWebGLSupport(),
      performanceLevel: this.deviceDetector.recommendPerformanceQuality() as
        | "low"
        | "medium"
        | "high",
      memoryCapacity: memoryMB,
      isMobile,
    };
  }

  /**
   * Build settings context from settings manager
   */
  private buildSettingsContext(): BackgroundStrategySelectionCriteria["settingsContext"] {
    try {
      return {
        dynamicAccentEnabled: true, // Always enabled for dynamic accent
        gradientIntensity: settings.get("sn-gradient-intensity"),
        webglEnabled: settings.get("sn-webgl-enabled"),
        webglForceEnabled: settings.get("sn-webgl-enabled"), // Use same setting
        visualGuideMode: settings.get("sn-artistic-mode") as string, // Use artistic mode as visual guide
        depthLayersEnabled: settings.get("sn-gradient-intensity") !== "disabled",
        consciousnessLevel: 0.8, // Fixed value for consciousness level
        breathingAnimationEnabled: true, // Always enabled
      };
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "BackgroundStrategySelector",
        "Failed to load settings, using defaults:",
        error
      );

      // Return safe defaults
      return {
        dynamicAccentEnabled: true,
        gradientIntensity: "balanced",
        webglEnabled: true,
        webglForceEnabled: false,
        visualGuideMode: "cosmic",
        depthLayersEnabled: true,
        consciousnessLevel: 0.8,
        breathingAnimationEnabled: true,
      };
    }
  }

  /**
   * Get or create strategy instance (lazy loading)
   */
  private getOrCreateStrategy(strategyName: string): IColorProcessor | null {
    // Check if we already have this strategy instance
    if (this.strategyInstances.has(strategyName)) {
      return this.strategyInstances.get(strategyName)!;
    }

    // Create new strategy instance
    let strategy: IColorProcessor | null = null;

    try {
      switch (strategyName) {
        case "dynamic-catppuccin":
          strategy = new DynamicCatppuccinStrategy();
          break;

        case "living-gradient":
          strategy = new LivingGradientStrategy();
          break;

        case "webgl-gradient":
          strategy = new WebGLGradientStrategy();
          break;

        case "webgl-gradient-degraded":
          // For degraded mode, use standard WebGL strategy (it will handle degradation internally based on device capabilities)
          strategy = new WebGLGradientStrategy();
          break;

        case "depth-layered":
          strategy = new DepthLayeredStrategy();
          break;

        default:
          Y3KDebug?.debug?.warn(
            "BackgroundStrategySelector",
            `Unknown strategy: ${strategyName}`
          );
          return null;
      }

      if (strategy) {
        this.strategyInstances.set(strategyName, strategy);
        Y3KDebug?.debug?.log(
          "BackgroundStrategySelector",
          `Created strategy instance: ${strategyName}`
        );
      }
    } catch (error) {
      Y3KDebug?.debug?.error(
        "BackgroundStrategySelector",
        `Failed to create strategy ${strategyName}:`,
        error
      );
      return null;
    }

    return strategy;
  }

  /**
   * Get estimated total processing time for selected strategies
   */
  getEstimatedProcessingTime(
    strategies: IColorProcessor[],
    context: ColorContext
  ): number {
    return strategies.reduce((total, strategy) => {
      return total + strategy.getEstimatedProcessingTime(context);
    }, 0);
  }

  /**
   * Get strategy metadata for debugging
   */
  getStrategyMetadata(strategyName: string): StrategyMetrics | null {
    return this.strategyMetadata.get(strategyName) || null;
  }

  /**
   * Get all available strategy names
   */
  getAvailableStrategyNames(): string[] {
    return Array.from(this.strategyMetadata.keys());
  }

  /**
   * Update strategy selection criteria (for runtime adjustments)
   */
  updateSelectionCriteria(
    updates: Partial<BackgroundStrategySelectionCriteria>
  ): void {
    // This would be used by the ColorOrchestrator to update selection criteria
    // based on runtime conditions, user preference changes, etc.
    Y3KDebug?.debug?.log(
      "BackgroundStrategySelector",
      "Strategy selection criteria updated:",
      updates
    );
  }

  /**
   * Cleanup strategy instances
   */
  destroy(): void {
    // Cleanup any strategy instances that support cleanup
    this.strategyInstances.forEach((strategy, name) => {
      if ("destroy" in strategy && typeof strategy.destroy === "function") {
        try {
          (strategy as any).destroy();
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "BackgroundStrategySelector",
            `Error destroying strategy ${name}:`,
            error
          );
        }
      }
    });

    this.strategyInstances.clear();
    this.strategyMetadata.clear();

    Y3KDebug?.debug?.log(
      "BackgroundStrategySelector",
      "Strategy selector destroyed"
    );
  }
}
