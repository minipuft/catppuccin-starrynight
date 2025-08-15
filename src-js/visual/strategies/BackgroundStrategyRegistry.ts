/**
 * BackgroundStrategyRegistry - Centralized Strategy Management
 *
 * Manages registration, discovery, and coordination of all background color
 * processing strategies. Provides a centralized registry for strategy
 * management with performance monitoring and health checking.
 *
 * Philosophy: "A technical library of transformation algorithms - each strategy
 * a unique expression of color visual-effects, waiting to be awakened."
 */

import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  IColorProcessor,
  IColorStrategyRegistry,
  StrategySelectionCriteria,
} from "@/types/colorStrategy";
import { settings } from "@/config";

interface StrategyRegistration {
  strategy: IColorProcessor;
  registrationTime: number;
  lastUsed: number;
  usageCount: number;
  errorCount: number;
  averageProcessingTime: number;
  isHealthy: boolean;
  metadata: {
    category: "foundation" | "enhancement" | "accent" | "effects";
    priority: number;
    memoryImpact: "low" | "medium" | "high";
    deviceRequirements: string[];
    tags: string[];
  };
}

interface RegistryMetrics {
  totalStrategies: number;
  healthyStrategies: number;
  averageResponseTime: number;
  totalUsageCount: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export class BackgroundStrategyRegistry implements IColorStrategyRegistry {
  private strategiesMap = new Map<string, StrategyRegistration>();

  // Performance monitoring
  private metrics: RegistryMetrics = {
    totalStrategies: 0,
    healthyStrategies: 0,
    averageResponseTime: 0,
    totalUsageCount: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
  };

  // Health monitoring
  private healthCheckInterval: number | null = null;
  private readonly HEALTH_CHECK_INTERVAL_MS = 30000; // 30 seconds

  constructor() {
    // Start health monitoring
    this.startHealthMonitoring();

    Y3KDebug?.debug?.log(
      "BackgroundStrategyRegistry",
      "Strategy registry initialized"
    );
  }

  /**
   * Register a color processing strategy
   */
  register(strategy: IColorProcessor): void {
    const strategyName = strategy.getStrategyName();

    if (this.strategiesMap.has(strategyName)) {
      Y3KDebug?.debug?.warn(
        "BackgroundStrategyRegistry",
        `Strategy ${strategyName} is already registered, replacing...`
      );
    }

    try {
      const registration: StrategyRegistration = {
        strategy,
        registrationTime: Date.now(),
        lastUsed: 0,
        usageCount: 0,
        errorCount: 0,
        averageProcessingTime: 0,
        isHealthy: true,
        metadata: this.inferStrategyMetadata(strategy),
      };

      this.strategiesMap.set(strategyName, registration);
      this.updateMetrics();

      Y3KDebug?.debug?.log(
        "BackgroundStrategyRegistry",
        `Registered strategy: ${strategyName}`,
        {
          category: registration.metadata.category,
          priority: registration.metadata.priority,
          memoryImpact: registration.metadata.memoryImpact,
        }
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "BackgroundStrategyRegistry",
        `Failed to register strategy ${strategyName}:`,
        error
      );
    }
  }

  /**
   * Select best strategy for given criteria
   */
  selectStrategy(criteria: StrategySelectionCriteria): IColorProcessor | null {
    const availableStrategies = Array.from(this.strategiesMap.values())
      .filter((reg) => reg.isHealthy)
      .sort(
        (a, b) =>
          this.scoreStrategy(b, criteria) - this.scoreStrategy(a, criteria)
      );

    if (availableStrategies.length === 0) {
      Y3KDebug?.debug?.warn(
        "BackgroundStrategyRegistry",
        "No healthy strategies available"
      );
      return null;
    }

    const selectedStrategy = availableStrategies[0];
    if (!selectedStrategy) {
      Y3KDebug?.debug?.warn(
        "BackgroundStrategyRegistry",
        "No strategies available after filtering"
      );
      return null;
    }

    this.recordStrategyUsage(selectedStrategy.strategy.getStrategyName());

    Y3KDebug?.debug?.log(
      "BackgroundStrategyRegistry",
      `Selected strategy: ${selectedStrategy.strategy.getStrategyName()}`,
      {
        score: this.scoreStrategy(selectedStrategy, criteria),
        totalAvailable: availableStrategies.length,
      }
    );

    return selectedStrategy.strategy;
  }

  /**
   * Get all registered strategies
   */
  getStrategies(): IColorProcessor[] {
    return Array.from(this.strategiesMap.values())
      .filter((reg) => reg.isHealthy)
      .map((reg) => reg.strategy);
  }

  /**
   * Get strategy by name
   */
  getStrategy(name: string): IColorProcessor | null {
    const registration = this.strategiesMap.get(name);
    return registration && registration.isHealthy
      ? registration.strategy
      : null;
  }

  /**
   * Get multiple strategies by criteria with intelligent selection
   */
  selectMultipleStrategies(
    criteria: StrategySelectionCriteria,
    maxStrategies: number = 4
  ): IColorProcessor[] {
    const scoredStrategies = Array.from(this.strategiesMap.values())
      .filter((reg) => reg.isHealthy)
      .map((reg) => ({
        registration: reg,
        score: this.scoreStrategy(reg, criteria),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxStrategies);

    // Record usage for all selected strategies
    scoredStrategies.forEach((scored) => {
      this.recordStrategyUsage(scored.registration.strategy.getStrategyName());
    });

    const selectedStrategies = scoredStrategies.map(
      (scored) => scored.registration.strategy
    );

    Y3KDebug?.debug?.log(
      "BackgroundStrategyRegistry",
      `Selected ${selectedStrategies.length} strategies`,
      {
        strategies: selectedStrategies.map((s) => s.getStrategyName()),
        scores: scoredStrategies.map((s) => s.score),
      }
    );

    return selectedStrategies;
  }

  /**
   * Score a strategy based on selection criteria
   */
  private scoreStrategy(
    registration: StrategyRegistration,
    criteria: StrategySelectionCriteria
  ): number {
    let score = 0;

    // Base priority score
    score += registration.metadata.priority * 10;

    // Performance criteria
    switch (criteria.performance) {
      case "high":
        if (registration.metadata.memoryImpact === "low") score += 20;
        if (registration.averageProcessingTime < 10) score += 15;
        break;
      case "medium":
        if (registration.metadata.memoryImpact !== "high") score += 10;
        if (registration.averageProcessingTime < 20) score += 10;
        break;
      case "low":
        // No penalties for low performance mode
        break;
    }

    // Quality criteria
    switch (criteria.quality) {
      case "premium":
        if (registration.metadata.category === "enhancement") score += 15;
        if (registration.metadata.tags.includes("webgl")) score += 10;
        break;
      case "enhanced":
        if (registration.metadata.category !== "effects") score += 10;
        break;
      case "basic":
        if (registration.metadata.category === "foundation") score += 15;
        break;
    }

    // Device capabilities
    if (criteria.deviceCapabilities) {
      if (
        criteria.deviceCapabilities.hasWebGL &&
        registration.metadata.tags.includes("webgl")
      ) {
        score += 15;
      }

      if (
        criteria.deviceCapabilities.isMobile &&
        registration.metadata.memoryImpact === "low"
      ) {
        score += 10;
      }

      if (
        criteria.deviceCapabilities.memoryMB &&
        criteria.deviceCapabilities.memoryMB < 4000
      ) {
        // Penalize high memory impact strategies on low-memory devices
        if (registration.metadata.memoryImpact === "high") score -= 20;
      }
    }

    // User preferences
    if (criteria.userPreferences) {
      if (
        criteria.userPreferences.enableAdvancedBlending &&
        registration.metadata.tags.includes("advanced-blending")
      ) {
        score += 12;
      }

      if (criteria.userPreferences.harmonicMode) {
        const mode = criteria.userPreferences.harmonicMode;
        if (registration.metadata.tags.includes(mode)) {
          score += 8;
        }
      }
    }

    // Health and reliability scoring
    const errorRate =
      registration.usageCount > 0
        ? registration.errorCount / registration.usageCount
        : 0;
    score -= errorRate * 30; // Penalize unreliable strategies

    // Recency bonus (prefer recently used strategies)
    const timeSinceLastUse = Date.now() - registration.lastUsed;
    if (timeSinceLastUse < 300000) {
      // 5 minutes
      score += 5;
    }

    return Math.max(0, score);
  }

  /**
   * Infer strategy metadata from strategy instance
   */
  private inferStrategyMetadata(
    strategy: IColorProcessor
  ): StrategyRegistration["metadata"] {
    const strategyName = strategy.getStrategyName();
    const tags: string[] = [];
    let category: "foundation" | "enhancement" | "accent" | "effects" =
      "enhancement";
    let priority = 5;
    let memoryImpact: "low" | "medium" | "high" = "medium";
    let deviceRequirements: string[] = [];

    // Analyze strategy name and type to infer metadata
    switch (strategyName) {
      case "dynamic-catppuccin":
        category = "accent";
        priority = 10;
        memoryImpact = "low";
        tags.push("catppuccin", "dynamic", "accent", "spicetify");
        break;

      case "living-gradient":
        category = "foundation";
        priority = 8;
        memoryImpact = "low";
        tags.push("gradient", "pulsing", "foundation", "css");
        break;

      case "webgl-gradient":
        category = "enhancement";
        priority = 6;
        memoryImpact = "high";
        deviceRequirements.push("webgl");
        tags.push("webgl", "gradient", "performance", "advanced-blending");
        break;

      case "depth-layered":
        category = "effects";
        priority = 7;
        memoryImpact = "medium";
        tags.push(
          "depth",
          "layers",
          "parallax",
          "visual-effects",
          "cosmic",
          "cinematic"
        );
        break;

      default:
        // Default metadata for unknown strategies
        break;
    }

    return {
      category,
      priority,
      memoryImpact,
      deviceRequirements,
      tags,
    };
  }

  /**
   * Record strategy usage for metrics
   */
  recordStrategyUsage(strategyName: string): void {
    const registration = this.strategiesMap.get(strategyName);
    if (registration) {
      registration.usageCount++;
      registration.lastUsed = Date.now();
    }
  }

  /**
   * Record strategy error for health monitoring
   */
  recordStrategyError(strategyName: string, error: Error): void {
    const registration = this.strategiesMap.get(strategyName);
    if (registration) {
      registration.errorCount++;

      // Mark as unhealthy if error rate is too high
      const errorRate =
        registration.errorCount / Math.max(1, registration.usageCount);
      if (errorRate > 0.5 && registration.usageCount > 5) {
        registration.isHealthy = false;
        Y3KDebug?.debug?.warn(
          "BackgroundStrategyRegistry",
          `Strategy ${strategyName} marked as unhealthy`,
          {
            errorRate,
            errorCount: registration.errorCount,
            usageCount: registration.usageCount,
          }
        );
      }
    }
  }

  /**
   * Record strategy processing time for performance tracking
   */
  recordStrategyProcessingTime(
    strategyName: string,
    processingTime: number
  ): void {
    const registration = this.strategiesMap.get(strategyName);
    if (registration) {
      // Calculate running average
      const totalTime =
        registration.averageProcessingTime * (registration.usageCount - 1) +
        processingTime;
      registration.averageProcessingTime = totalTime / registration.usageCount;
    }
  }

  /**
   * Start health monitoring for all registered strategies
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = window.setInterval(() => {
      this.performHealthChecks();
    }, this.HEALTH_CHECK_INTERVAL_MS);
  }

  /**
   * Perform health checks on all registered strategies
   */
  private async performHealthChecks(): Promise<void> {
    try {
      for (const [name, registration] of this.strategiesMap.entries()) {
        try {
          // Check if strategy has a health check method
          if (
            "healthCheck" in registration.strategy &&
            typeof registration.strategy.healthCheck === "function"
          ) {
            const healthResult = await (
              registration.strategy as any
            ).healthCheck();
            registration.isHealthy = healthResult?.healthy ?? true;

            if (!registration.isHealthy) {
              Y3KDebug?.debug?.warn(
                "BackgroundStrategyRegistry",
                `Strategy ${name} failed health check:`,
                healthResult
              );
            }
          }
        } catch (error) {
          registration.isHealthy = false;
          Y3KDebug?.debug?.error(
            "BackgroundStrategyRegistry",
            `Health check failed for strategy ${name}:`,
            error
          );
        }
      }

      this.updateMetrics();
    } catch (error) {
      Y3KDebug?.debug?.error(
        "BackgroundStrategyRegistry",
        "Health check monitoring failed:",
        error
      );
    }
  }

  /**
   * Update registry metrics
   */
  private updateMetrics(): void {
    const registrations = Array.from(this.strategiesMap.values());

    this.metrics.totalStrategies = registrations.length;
    this.metrics.healthyStrategies = registrations.filter(
      (r) => r.isHealthy
    ).length;
    this.metrics.totalUsageCount = registrations.reduce(
      (sum, r) => sum + r.usageCount,
      0
    );

    const processingTimes = registrations
      .filter((r) => r.averageProcessingTime > 0)
      .map((r) => r.averageProcessingTime);

    if (processingTimes.length > 0) {
      this.metrics.averageResponseTime =
        processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
    }

    // Estimate memory usage (rough calculation)
    this.metrics.memoryUsage = registrations.reduce((sum, r) => {
      const impact =
        r.metadata.memoryImpact === "high"
          ? 3
          : r.metadata.memoryImpact === "medium"
          ? 2
          : 1;
      return sum + impact;
    }, 0);
  }

  /**
   * Get registry metrics for monitoring
   */
  getRegistryMetrics(): RegistryMetrics {
    return { ...this.metrics };
  }

  /**
   * Get detailed strategy information
   */
  getStrategyInfo(strategyName: string): StrategyRegistration | null {
    const registration = this.strategiesMap.get(strategyName);
    return registration ? { ...registration } : null;
  }

  /**
   * Get all strategy information for debugging
   */
  getAllStrategyInfo(): Array<{
    name: string;
    registration: StrategyRegistration;
  }> {
    return Array.from(this.strategiesMap.entries()).map(
      ([name, registration]) => ({
        name,
        registration: { ...registration },
      })
    );
  }

  /**
   * Unregister a strategy
   */
  unregister(strategyName: string): boolean {
    const success = this.strategiesMap.delete(strategyName);
    if (success) {
      this.updateMetrics();
      Y3KDebug?.debug?.log(
        "BackgroundStrategyRegistry",
        `Unregistered strategy: ${strategyName}`
      );
    }
    return success;
  }

  /**
   * Clear all strategies
   */
  clear(): void {
    this.strategiesMap.clear();
    this.updateMetrics();
    Y3KDebug?.debug?.log(
      "BackgroundStrategyRegistry",
      "All strategies cleared from registry"
    );
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Stop health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    // Cleanup all strategies that support cleanup
    for (const [name, registration] of this.strategiesMap.entries()) {
      if (
        "destroy" in registration.strategy &&
        typeof registration.strategy.destroy === "function"
      ) {
        try {
          (registration.strategy as any).destroy();
        } catch (error) {
          Y3KDebug?.debug?.warn(
            "BackgroundStrategyRegistry",
            `Error destroying strategy ${name}:`,
            error
          );
        }
      }
    }

    this.clear();

    Y3KDebug?.debug?.log(
      "BackgroundStrategyRegistry",
      "Strategy registry destroyed"
    );
  }
}
