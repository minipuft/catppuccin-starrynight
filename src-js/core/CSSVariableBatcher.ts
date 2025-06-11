// ===================================================================
// 🎨 CSS VARIABLE BATCHING SYSTEM - Year 3000 Performance System
// ===================================================================
// Consolidates multiple CSS variable updates into batches
// Reduces DOM manipulation overhead for better performance

interface CSSVariableBatcherConfig {
  batchIntervalMs: number;
  maxBatchSize: number;
  enableDebug: boolean;
}

interface PerformanceMetrics {
  totalBatches: number;
  totalUpdates: number;
  totalBatchTime: number;
  maxBatchTime: number;
  averageBatchSize: number;
  overBudgetBatches: number;
}

interface PendingUpdate {
  element: HTMLElement;
  property: string;
  value: string;
  timestamp: number;
}

interface BatcherState {
  pendingUpdates: Map<string, PendingUpdate>;
  batchTimeout: NodeJS.Timeout | null;
  batchIntervalMs: number;
  maxBatchSize: number;
  totalUpdates: number;
  batchCount: number;
  enabled: boolean;
}

export class CSSVariableBatcher {
  private config: CSSVariableBatcherConfig;
  private _cssVariableBatcher: BatcherState;
  private _performanceMetrics: PerformanceMetrics;

  constructor(config: Partial<CSSVariableBatcherConfig> = {}) {
    this.config = {
      batchIntervalMs: config.batchIntervalMs || 16, // ~60fps batch rate
      maxBatchSize: config.maxBatchSize || 50,
      enableDebug: config.enableDebug || false,
      ...config,
    };

    this._cssVariableBatcher = {
      pendingUpdates: new Map(),
      batchTimeout: null,
      batchIntervalMs: this.config.batchIntervalMs,
      maxBatchSize: this.config.maxBatchSize,
      totalUpdates: 0,
      batchCount: 0,
      enabled: true,
    };

    this._performanceMetrics = {
      totalBatches: 0,
      totalUpdates: 0,
      totalBatchTime: 0,
      maxBatchTime: 0,
      averageBatchSize: 0,
      overBudgetBatches: 0,
    };

    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Initialized");
    }
  }

  public queueCSSVariableUpdate(
    property: string,
    value: string,
    element: HTMLElement | null = null
  ): void {
    const target = element || document.documentElement;
    if (!this._cssVariableBatcher.enabled) {
      target.style.setProperty(property, value);
      return;
    }

    const elementKey = element
      ? `element_${element.id || element.className || "unnamed"}`
      : "root";
    const updateKey = `${elementKey}:${property}`;

    this._cssVariableBatcher.pendingUpdates.set(updateKey, {
      element: target,
      property,
      value,
      timestamp: performance.now(),
    });

    this._cssVariableBatcher.totalUpdates++;
    this._performanceMetrics.totalUpdates++;

    if (!this._cssVariableBatcher.batchTimeout) {
      this._cssVariableBatcher.batchTimeout = setTimeout(() => {
        this._processCSSVariableBatch();
      }, this._cssVariableBatcher.batchIntervalMs);
    }

    if (
      this._cssVariableBatcher.pendingUpdates.size >=
      this._cssVariableBatcher.maxBatchSize
    ) {
      this.flushCSSVariableBatch();
    }
  }

  private _processCSSVariableBatch(): void {
    if (this._cssVariableBatcher.pendingUpdates.size === 0) {
      return;
    }

    const startTime = performance.now();
    const updates = Array.from(
      this._cssVariableBatcher.pendingUpdates.values()
    );

    this._cssVariableBatcher.pendingUpdates.clear();
    if (this._cssVariableBatcher.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
      this._cssVariableBatcher.batchTimeout = null;
    }

    try {
      const updatesByElement = new Map<HTMLElement, PendingUpdate[]>();

      for (const update of updates) {
        if (!updatesByElement.has(update.element)) {
          updatesByElement.set(update.element, []);
        }
        updatesByElement.get(update.element)!.push(update);
      }

      for (const [element, elementUpdates] of updatesByElement.entries()) {
        if (elementUpdates.length > 3) {
          let cssText = element.style.cssText;
          for (const update of elementUpdates) {
            const propertyPattern = new RegExp(
              `${update.property.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              )}:[^;]*;?`,
              "g"
            );
            cssText = cssText.replace(propertyPattern, "");
            cssText += `${update.property}:${update.value};`;
          }
          element.style.cssText = cssText;
        } else {
          for (const update of elementUpdates) {
            element.style.setProperty(update.property, update.value);
          }
        }
      }

      this._cssVariableBatcher.batchCount++;
      this._performanceMetrics.totalBatches++;

      const batchTime = performance.now() - startTime;
      this._updatePerformanceMetrics(batchTime, updates.length);

      if (this.config.enableDebug && Math.random() < 0.1) {
        console.log(
          `🎨 [CSSVariableBatcher] Processed CSS batch: ${
            updates.length
          } updates in ${batchTime.toFixed(2)}ms`
        );
      }
    } catch (error) {
      console.error(
        "[CSSVariableBatcher] Error processing CSS variable batch:",
        error
      );
      for (const update of updates) {
        try {
          update.element.style.setProperty(update.property, update.value);
        } catch (e) {
          console.warn(
            `[CSSVariableBatcher] Failed to apply CSS property ${update.property}:`,
            e
          );
        }
      }
    }
  }

  private _updatePerformanceMetrics(
    batchTime: number,
    batchSize: number
  ): void {
    this._performanceMetrics.totalBatchTime += batchTime;
    this._performanceMetrics.maxBatchTime = Math.max(
      this._performanceMetrics.maxBatchTime,
      batchTime
    );
    this._performanceMetrics.averageBatchSize =
      (this._performanceMetrics.averageBatchSize *
        (this._performanceMetrics.totalBatches - 1) +
        batchSize) /
      this._performanceMetrics.totalBatches;

    if (batchTime > 8) {
      this._performanceMetrics.overBudgetBatches++;
      if (this.config.enableDebug) {
        console.warn(
          `[CSSVariableBatcher] CSS batch took ${batchTime.toFixed(
            2
          )}ms for ${batchSize} updates`
        );
      }
      if (batchTime > 16) {
        this.setBatchingEnabled(false);
        setTimeout(() => this.setBatchingEnabled(true), 5000);
      }
    }
  }

  public flushCSSVariableBatch(): void {
    if (this._cssVariableBatcher.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
      this._cssVariableBatcher.batchTimeout = null;
    }
    this._processCSSVariableBatch();
  }

  public setBatchingEnabled(enabled: boolean): void {
    this._cssVariableBatcher.enabled = enabled;
    if (!enabled) {
      this.flushCSSVariableBatch();
    }
    if (this.config.enableDebug) {
      console.log(
        `🎨 [CSSVariableBatcher] Batching ${enabled ? "enabled" : "disabled"}`
      );
    }
  }

  public updateConfig(newConfig: Partial<CSSVariableBatcherConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.batchIntervalMs) {
      this._cssVariableBatcher.batchIntervalMs = newConfig.batchIntervalMs;
    }
    if (newConfig.maxBatchSize) {
      this._cssVariableBatcher.maxBatchSize = newConfig.maxBatchSize;
    }
    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Configuration updated:", newConfig);
    }
  }

  public getPerformanceReport() {
    const averageBatchTime =
      this._performanceMetrics.totalBatches > 0
        ? this._performanceMetrics.totalBatchTime /
          this._performanceMetrics.totalBatches
        : 0;
    const estimatedSavings =
      this._performanceMetrics.totalUpdates > 0
        ? Math.round(
            ((this._performanceMetrics.totalUpdates -
              this._performanceMetrics.totalBatches) /
              this._performanceMetrics.totalUpdates) *
              100
          )
        : 0;

    return {
      enabled: this._cssVariableBatcher.enabled,
      pendingUpdates: this._cssVariableBatcher.pendingUpdates.size,
      totalUpdates: this._performanceMetrics.totalUpdates,
      totalBatches: this._performanceMetrics.totalBatches,
      averageBatchSize:
        Math.round(this._performanceMetrics.averageBatchSize * 10) / 10,
      averageBatchTime: Math.round(averageBatchTime * 100) / 100,
      maxBatchTime:
        Math.round(this._performanceMetrics.maxBatchTime * 100) / 100,
      overBudgetBatches: this._performanceMetrics.overBudgetBatches,
      batchInterval: this._cssVariableBatcher.batchIntervalMs,
      maxBatchSize: this._cssVariableBatcher.maxBatchSize,
      performance: {
        estimatedDomManipulationReduction: `${estimatedSavings}%`,
        efficiency: this._calculateEfficiency(),
      },
      recommendations: this._generateBatchingRecommendations(),
    };
  }

  private _calculateEfficiency(): "excellent" | "good" | "fair" | "poor" {
    if (this._performanceMetrics.totalBatches === 0) return "fair";
    const averageBatchSize = this._performanceMetrics.averageBatchSize;
    const overBudgetRate =
      this._performanceMetrics.overBudgetBatches /
      this._performanceMetrics.totalBatches;

    if (averageBatchSize > 10 && overBudgetRate < 0.1) return "excellent";
    if (averageBatchSize > 5 && overBudgetRate < 0.2) return "good";
    if (averageBatchSize > 2) return "fair";
    return "poor";
  }

  private _generateBatchingRecommendations() {
    const recommendations = [];
    if (this._performanceMetrics.averageBatchSize < 2) {
      recommendations.push({
        type: "batch_size",
        priority: "low",
        message:
          "Average batch size is small - consider increasing batch interval",
        action: "Increase batchIntervalMs to collect more updates per batch",
      });
    }
    if (
      this._performanceMetrics.overBudgetBatches >
      this._performanceMetrics.totalBatches * 0.2
    ) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        message: "Frequent over-budget batches detected",
        action: "Reduce maxBatchSize or optimize CSS property updates",
      });
    }
    return recommendations;
  }

  public resetMetrics(): void {
    this._performanceMetrics = {
      totalBatches: 0,
      totalUpdates: 0,
      totalBatchTime: 0,
      maxBatchTime: 0,
      averageBatchSize: 0,
      overBudgetBatches: 0,
    };
    this._cssVariableBatcher.totalUpdates = 0;
    this._cssVariableBatcher.batchCount = 0;
    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Performance metrics reset");
    }
  }

  public destroy(): void {
    this.flushCSSVariableBatch();
    if (this._cssVariableBatcher.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
    }
    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Destroyed");
    }
  }
}
