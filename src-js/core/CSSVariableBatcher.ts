// ===================================================================
// 🎨 CSS VARIABLE BATCHING SYSTEM - Year 3000 Performance System
// ===================================================================
// Consolidates multiple CSS variable updates into batches
// Reduces DOM manipulation overhead for better performance

interface CSSVariableBatcherConfig {
  /**
   * Minimum delay (ms) before a pending batch is flushed. A value of 16 ms
   * aligns with ~60 FPS.
   */
  batchIntervalMs: number;
  /** Maximum number of queued updates before an immediate flush. */
  maxBatchSize: number;
  /** Enables verbose logging. */
  enableDebug: boolean;
  /**
   * Legacy fast-path that rewrites the entire `cssText` string for batches
   * larger than three updates. This path is measurably faster in some very
   * old browsers but causes heavy style-recalc costs in modern engines.
   *
   * Default = false (safer). Set to `true` to restore the previous behaviour
   * for environments that still benefit from it.
   */
  useCssTextFastPath?: boolean;
  /** Automatically hijack CSSStyleDeclaration.setProperty for --sn- variables */
  autoHijack?: boolean;
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
  /** requestAnimationFrame handle when a flush is scheduled, otherwise null */
  rafHandle: number | null;
  /** Flag indicating a flush has been scheduled via queueMicrotask() */
  microtaskScheduled: boolean;
  /** Kept for backward-compat diagnostics but no longer used for scheduling */
  batchIntervalMs: number;
  maxBatchSize: number;
  totalUpdates: number;
  batchCount: number;
  enabled: boolean;
}

export class CSSVariableBatcher {
  // Singleton reference so the hijack can reach the live instance
  public static instance: CSSVariableBatcher | null = null;
  private static hijackEnabled = false;
  private config: CSSVariableBatcherConfig;
  private _cssVariableBatcher: BatcherState;
  private _performanceMetrics: PerformanceMetrics;

  constructor(config: Partial<CSSVariableBatcherConfig> = {}) {
    // Apply defaults first, then let the caller override.
    this.config = {
      batchIntervalMs: config.batchIntervalMs ?? 0, // 0 = coalesced; scheduling handled via rAF/microtask
      maxBatchSize: config.maxBatchSize ?? 50,
      enableDebug: config.enableDebug ?? false,
      useCssTextFastPath: config.useCssTextFastPath ?? false,
      autoHijack: config.autoHijack ?? true,
      ...config,
    } as CSSVariableBatcherConfig;

    this._cssVariableBatcher = {
      pendingUpdates: new Map(),
      rafHandle: null,
      microtaskScheduled: false,
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

    // Keep singleton reference
    CSSVariableBatcher.instance = this;

    if (this.config.autoHijack) {
      this._enableGlobalHijack();
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

    // Schedule a flush using the new micro-task + rAF strategy.
    this._scheduleFlush();

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
    if (this._cssVariableBatcher.rafHandle !== null) {
      cancelAnimationFrame(this._cssVariableBatcher.rafHandle);
      this._cssVariableBatcher.rafHandle = null;
    }
    this._cssVariableBatcher.microtaskScheduled = false;

    try {
      const updatesByElement = new Map<HTMLElement, PendingUpdate[]>();

      for (const update of updates) {
        if (!updatesByElement.has(update.element)) {
          updatesByElement.set(update.element, []);
        }
        updatesByElement.get(update.element)!.push(update);
      }

      for (const [element, elementUpdates] of updatesByElement.entries()) {
        // ----------------------------------------------
        // Fast-path VS safe-path decision
        // ----------------------------------------------
        // The previous implementation rewrote the *entire* cssText when more
        // than three updates targeted the same element. While marginally
        // faster for string concatenations, it incurs a huge style-recalc
        // cost because the browser treats it like a full style attribute
        // mutation.
        //
        // We now only take that branch when the new feature-flag
        // `useCssTextFastPath` is explicitly enabled.
        if (elementUpdates.length > 3 && this.config.useCssTextFastPath) {
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
    if (this._cssVariableBatcher.rafHandle !== null) {
      cancelAnimationFrame(this._cssVariableBatcher.rafHandle);
      this._cssVariableBatcher.rafHandle = null;
    }
    this._cssVariableBatcher.microtaskScheduled = false;
    this._processCSSVariableBatch();
  }

  /**
   * Alias for unit tests that need to synchronously flush the pending batch.
   */
  public flushNow(): void {
    this.flushCSSVariableBatch();
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
    if (this._cssVariableBatcher.rafHandle !== null) {
      cancelAnimationFrame(this._cssVariableBatcher.rafHandle);
    }
    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Destroyed");
    }
  }

  private _scheduleFlush(): void {
    // Avoid double-scheduling.
    if (
      this._cssVariableBatcher.rafHandle !== null ||
      this._cssVariableBatcher.microtaskScheduled
    ) {
      return;
    }

    const flushCallback = () => {
      // Reset scheduling flags *before* processing so new updates inside
      // _processCSSVariableBatch can schedule the next frame if required.
      this._cssVariableBatcher.rafHandle = null;
      this._cssVariableBatcher.microtaskScheduled = false;
      this._processCSSVariableBatch();
    };

    // Prefer micro-tasks when the page is hidden (background tab) to avoid
    // unnecessarily waking up the rendering pipeline.
    if (
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
    ) {
      this._cssVariableBatcher.microtaskScheduled = true;
      queueMicrotask(flushCallback);
    } else if (typeof requestAnimationFrame === "function") {
      this._cssVariableBatcher.rafHandle = requestAnimationFrame(() =>
        flushCallback()
      );
    } else {
      // Fallback (very old browsers / non-DOM env) — immediate flush.
      setTimeout(flushCallback, 0);
    }
  }

  /** Patch CSSStyleDeclaration.setProperty so legacy code is batched */
  private _enableGlobalHijack(): void {
    if (CSSVariableBatcher.hijackEnabled) return;
    const original = CSSStyleDeclaration.prototype.setProperty;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const batchInstance = this;
    // @ts-ignore
    CSSStyleDeclaration.prototype.setProperty = function (
      prop: string,
      value: string | null,
      priority?: string
    ) {
      if (prop && prop.startsWith("--sn-") && batchInstance) {
        batchInstance.queueCSSVariableUpdate(prop, String(value ?? ""));
      } else {
        // @ts-ignore
        original.call(this, prop, value, priority);
      }
    } as typeof CSSStyleDeclaration.prototype.setProperty;
    CSSVariableBatcher.hijackEnabled = true;
    if (this.config.enableDebug) {
      console.log("🎨 [CSSVariableBatcher] Global setProperty hijack enabled");
    }
  }
}
