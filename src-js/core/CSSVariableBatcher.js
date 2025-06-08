// ===================================================================
// 🎨 CSS VARIABLE BATCHING SYSTEM - Year 3000 Performance System
// ===================================================================
// Consolidates multiple CSS variable updates into batches
// Reduces DOM manipulation overhead for better performance

export class CSSVariableBatcher {
  constructor(config = {}) {
    this.config = {
      batchIntervalMs: config.batchIntervalMs || 16, // ~60fps batch rate
      maxBatchSize: config.maxBatchSize || 50,
      enableDebug: config.enableDebug || false,
      ...config,
    };

    // Batching system state
    this._cssVariableBatcher = {
      pendingUpdates: new Map(),
      batchTimeout: null,
      batchIntervalMs: this.config.batchIntervalMs,
      maxBatchSize: this.config.maxBatchSize,
      totalUpdates: 0,
      batchCount: 0,
      enabled: true,
    };

    // Performance tracking
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

  /**
   * Queue a CSS variable update for batched application
   * @param {string} property - CSS property name
   * @param {string} value - CSS property value
   * @param {Element} element - Target element (defaults to document root)
   */
  queueCSSVariableUpdate(property, value, element = null) {
    if (!this._cssVariableBatcher.enabled) {
      // Batching disabled - apply immediately
      const target = element || document.documentElement;
      target.style.setProperty(property, value);
      return;
    }

    const target = element || document.documentElement;
    const elementKey = element
      ? `element_${element.id || element.className || "unnamed"}`
      : "root";
    const updateKey = `${elementKey}:${property}`;

    // Store the update
    this._cssVariableBatcher.pendingUpdates.set(updateKey, {
      element: target,
      property,
      value,
      timestamp: performance.now(),
    });

    this._cssVariableBatcher.totalUpdates++;
    this._performanceMetrics.totalUpdates++;

    // Schedule batch processing if not already scheduled
    if (!this._cssVariableBatcher.batchTimeout) {
      this._cssVariableBatcher.batchTimeout = setTimeout(() => {
        this._processCSSVariableBatch();
      }, this._cssVariableBatcher.batchIntervalMs);
    }

    // Emergency flush if batch gets too large
    if (
      this._cssVariableBatcher.pendingUpdates.size >=
      this._cssVariableBatcher.maxBatchSize
    ) {
      this._processCSSVariableBatch();
    }
  }

  /**
   * Process pending CSS variable updates in batch
   */
  _processCSSVariableBatch() {
    if (
      !this._cssVariableBatcher ||
      this._cssVariableBatcher.pendingUpdates.size === 0
    ) {
      return;
    }

    const startTime = performance.now();
    const updates = Array.from(
      this._cssVariableBatcher.pendingUpdates.values()
    );

    // Clear pending updates and timeout
    this._cssVariableBatcher.pendingUpdates.clear();
    if (this._cssVariableBatcher.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
      this._cssVariableBatcher.batchTimeout = null;
    }

    try {
      // Group updates by element for more efficient DOM manipulation
      const updatesByElement = new Map();

      updates.forEach((update) => {
        const elementKey =
          update.element === document.documentElement ? "root" : update.element;
        if (!updatesByElement.has(elementKey)) {
          updatesByElement.set(elementKey, []);
        }
        updatesByElement.get(elementKey).push(update);
      });

      // Apply updates element by element
      updatesByElement.forEach((elementUpdates, elementKey) => {
        const element = elementUpdates[0].element;

        // Use style.cssText for better performance when updating multiple properties
        if (elementUpdates.length > 3) {
          let cssText = element.style.cssText;
          elementUpdates.forEach((update) => {
            const propertyPattern = new RegExp(
              `${update.property.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
              )}:[^;]*;?`,
              "g"
            );
            cssText = cssText.replace(propertyPattern, "");
            cssText += `${update.property}:${update.value};`;
          });
          element.style.cssText = cssText;
        } else {
          // Use individual setProperty calls for smaller batches
          elementUpdates.forEach((update) => {
            element.style.setProperty(update.property, update.value);
          });
        }
      });

      this._cssVariableBatcher.batchCount++;
      this._performanceMetrics.totalBatches++;

      const batchTime = performance.now() - startTime;
      this._performanceMetrics.totalBatchTime += batchTime;
      this._performanceMetrics.maxBatchTime = Math.max(
        this._performanceMetrics.maxBatchTime,
        batchTime
      );
      this._performanceMetrics.averageBatchSize =
        this._performanceMetrics.totalUpdates /
        this._performanceMetrics.totalBatches;

      // Performance monitoring
      if (batchTime > 8) {
        // More than 8ms for CSS batch
        this._performanceMetrics.overBudgetBatches++;

        if (this.config.enableDebug) {
          console.warn(
            `[CSSVariableBatcher] CSS batch took ${batchTime.toFixed(
              2
            )}ms for ${updates.length} updates`
          );
        }

        // Temporarily disable batching if it's causing performance issues
        if (batchTime > 16) {
          this._cssVariableBatcher.enabled = false;
          setTimeout(() => {
            if (this._cssVariableBatcher) {
              this._cssVariableBatcher.enabled = true;
            }
          }, 5000); // Re-enable after 5 seconds
        }
      }

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

      // Fallback: apply updates individually
      updates.forEach((update) => {
        try {
          update.element.style.setProperty(update.property, update.value);
        } catch (e) {
          console.warn(
            `[CSSVariableBatcher] Failed to apply CSS property ${update.property}:`,
            e
          );
        }
      });
    }
  }

  /**
   * Force immediate processing of all pending CSS variable updates
   */
  flushCSSVariableBatch() {
    if (this._cssVariableBatcher?.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
      this._cssVariableBatcher.batchTimeout = null;
    }
    this._processCSSVariableBatch();
  }

  /**
   * Enable or disable CSS variable batching
   * @param {boolean} enabled - Whether to enable batching
   */
  setBatchingEnabled(enabled) {
    this._cssVariableBatcher.enabled = enabled;

    if (!enabled) {
      // Flush any pending updates before disabling
      this.flushCSSVariableBatch();
    }

    if (this.config.enableDebug) {
      console.log(
        `🎨 [CSSVariableBatcher] Batching ${enabled ? "enabled" : "disabled"}`
      );
    }
  }

  /**
   * Update batching configuration
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
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

  /**
   * Get CSS variable batching performance report
   * @returns {Object} Batching system metrics
   */
  getPerformanceReport() {
    if (!this._cssVariableBatcher) {
      return { enabled: false, reason: "CSS batching not initialized" };
    }

    const averageBatchTime =
      this._performanceMetrics.totalBatches > 0
        ? this._performanceMetrics.totalBatchTime /
          this._performanceMetrics.totalBatches
        : 0;

    const estimatedSavings =
      this._performanceMetrics.totalBatches > 0
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
        estimatedDomManipulationReduction: estimatedSavings,
        efficiency: this._calculateEfficiency(),
      },
      recommendations: this._generateBatchingRecommendations(),
    };
  }

  /**
   * Calculate batching efficiency
   * @returns {string} Efficiency rating
   */
  _calculateEfficiency() {
    if (this._performanceMetrics.totalBatches === 0) return "unknown";

    const averageBatchSize = this._performanceMetrics.averageBatchSize;
    const overBudgetRate =
      this._performanceMetrics.overBudgetBatches /
      this._performanceMetrics.totalBatches;

    if (averageBatchSize > 10 && overBudgetRate < 0.1) return "excellent";
    if (averageBatchSize > 5 && overBudgetRate < 0.2) return "good";
    if (averageBatchSize > 2 && overBudgetRate < 0.3) return "fair";
    return "poor";
  }

  /**
   * Generate batching optimization recommendations
   * @returns {Array} Array of recommendations
   */
  _generateBatchingRecommendations() {
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

    if (this._performanceMetrics.maxBatchTime > 16) {
      recommendations.push({
        type: "performance",
        priority: "high",
        message: `Maximum batch time is high (${this._performanceMetrics.maxBatchTime.toFixed(
          2
        )}ms)`,
        action: "Consider reducing batch size or optimizing CSS updates",
      });
    }

    if (
      this._performanceMetrics.totalUpdates > 1000 &&
      this._performanceMetrics.averageBatchSize < 5
    ) {
      recommendations.push({
        type: "efficiency",
        priority: "medium",
        message: "High update volume with small batches",
        action: "Tune batching parameters for better efficiency",
      });
    }

    return recommendations;
  }

  /**
   * Reset performance metrics
   */
  resetMetrics() {
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

  /**
   * Clean up and destroy the batcher
   */
  destroy() {
    // Flush any pending updates
    this.flushCSSVariableBatch();

    // Clear timeout if set
    if (this._cssVariableBatcher?.batchTimeout) {
      clearTimeout(this._cssVariableBatcher.batchTimeout);
    }

    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Destroyed");
    }
  }
}
