// ===================================================================
// ⏱️ TIMER CONSOLIDATION SYSTEM - Year 3000 Performance System
// ===================================================================
// Replaces multiple setInterval calls with single coordinated system
// Provides priority-based timer scheduling and performance monitoring

export class TimerConsolidationSystem {
  constructor(config = {}) {
    this.config = {
      timerIntervalMs: config.timerIntervalMs || 50, // 20Hz base frequency
      maxTimerBudget: config.maxTimerBudget || 10, // 10ms budget for timer operations
      enableDebug: config.enableDebug || false,
      ...config,
    };

    // Timer registry and control
    this._timerRegistry = new Map();
    this._timerMasterInterval = null;
    this._timerLastExecution = 0;
    this._timerExecutionCount = 0;

    // Performance tracking
    this._timerPerformanceMetrics = {
      totalExecutions: 0,
      totalTime: 0,
      maxExecutionTime: 0,
      averageExecutionTime: 0,
      skippedTimers: 0,
      timerCallbacks: new Map(), // timerId -> { calls: 0, totalTime: 0, maxTime: 0 }
    };

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Initialized");
    }
  }

  /**
   * Initialize the timer consolidation system
   */
  initialize() {
    if (this._timerMasterInterval) {
      console.warn("[TimerConsolidationSystem] Already initialized");
      return;
    }

    if (this.config.enableDebug) {
      console.log(
        "⏱️ [TimerConsolidationSystem] Timer consolidation initialized"
      );
    }
  }

  /**
   * Register a consolidated timer with the system
   * @param {string} timerId - Unique timer identifier
   * @param {Function} callback - Timer callback function
   * @param {number} intervalMs - Timer interval in milliseconds
   * @param {string} priority - Priority level: 'critical', 'normal', 'background'
   */
  registerConsolidatedTimer(
    timerId,
    callback,
    intervalMs,
    priority = "normal"
  ) {
    if (this._timerRegistry.has(timerId)) {
      console.warn(
        `[TimerConsolidationSystem] Timer ${timerId} already registered`
      );
      return;
    }

    const timerConfig = {
      callback,
      intervalMs,
      priority,
      lastExecution: 0,
      enabled: true,
      executionCount: 0,
      totalExecutionTime: 0,
      maxExecutionTime: 0,
      skippedExecutions: 0,
    };

    this._timerRegistry.set(timerId, timerConfig);
    this._timerPerformanceMetrics.timerCallbacks.set(timerId, {
      calls: 0,
      totalTime: 0,
      maxTime: 0,
    });

    if (this.config.enableDebug) {
      console.log(
        `⏱️ [TimerConsolidationSystem] Registered timer: ${timerId} (${intervalMs}ms, ${priority} priority)`
      );
    }

    // Start master timer if this is the first timer
    if (this._timerRegistry.size === 1 && !this._timerMasterInterval) {
      this._startMasterTimer();
    }
  }

  /**
   * Unregister a timer from the consolidation system
   * @param {string} timerId - Timer identifier to unregister
   */
  unregisterConsolidatedTimer(timerId) {
    if (this._timerRegistry.has(timerId)) {
      this._timerRegistry.delete(timerId);
      this._timerPerformanceMetrics.timerCallbacks.delete(timerId);

      if (this.config.enableDebug) {
        console.log(
          `⏱️ [TimerConsolidationSystem] Unregistered timer: ${timerId}`
        );
      }

      // Stop master timer if no timers remain
      if (this._timerRegistry.size === 0) {
        this._stopMasterTimer();
      }
    }
  }

  /**
   * Start the master timer loop
   */
  _startMasterTimer() {
    if (this._timerMasterInterval) return;

    this._timerMasterInterval = setInterval(() => {
      this._executeMasterTimerFrame();
    }, this.config.timerIntervalMs);

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Master timer started");
    }
  }

  /**
   * Stop the master timer loop
   */
  _stopMasterTimer() {
    if (this._timerMasterInterval) {
      clearInterval(this._timerMasterInterval);
      this._timerMasterInterval = null;
    }

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Master timer stopped");
    }
  }

  /**
   * Execute timer callbacks with budget management
   */
  _executeMasterTimerFrame() {
    const frameStartTime = performance.now();
    const currentTime = frameStartTime;
    let remainingBudget = this.config.maxTimerBudget;

    // Sort timers by priority (critical -> normal -> background)
    const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
      ([, a], [, b]) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    );

    for (const [timerId, config] of timersByPriority) {
      if (!config.enabled || remainingBudget <= 0) {
        if (remainingBudget <= 0 && config.priority === "background") {
          config.skippedExecutions++;
          continue; // Skip background timers when budget exhausted
        }
      }

      // Check if timer should execute based on interval
      const timeSinceLastExecution = currentTime - config.lastExecution;
      if (timeSinceLastExecution < config.intervalMs) {
        continue; // Skip execution for this timer
      }

      const timerStartTime = performance.now();

      try {
        // Execute timer callback
        config.callback();

        const timerExecutionTime = performance.now() - timerStartTime;

        // Update timer metrics
        config.executionCount++;
        config.totalExecutionTime += timerExecutionTime;
        config.maxExecutionTime = Math.max(
          config.maxExecutionTime,
          timerExecutionTime
        );
        config.lastExecution = currentTime;

        // Update performance metrics
        const stats = this._timerPerformanceMetrics.timerCallbacks.get(timerId);
        if (stats) {
          stats.calls++;
          stats.totalTime += timerExecutionTime;
          stats.maxTime = Math.max(stats.maxTime, timerExecutionTime);
        }

        remainingBudget -= timerExecutionTime;

        // Warn about expensive timers
        if (timerExecutionTime > 5) {
          if (this.config.enableDebug) {
            console.warn(
              `⏱️ [TimerConsolidationSystem] Timer ${timerId} took ${timerExecutionTime.toFixed(
                2
              )}ms`
            );
          }
        }
      } catch (error) {
        console.error(
          `[TimerConsolidationSystem] Error in timer ${timerId}:`,
          error
        );
        config.enabled = false; // Disable problematic timer
      }
    }

    // Update overall performance metrics
    const totalFrameTime = performance.now() - frameStartTime;
    this._updateTimerPerformanceMetrics(totalFrameTime);

    this._timerExecutionCount++;
  }

  /**
   * Update timer performance metrics
   * @param {number} frameTime - Time taken for current timer frame
   */
  _updateTimerPerformanceMetrics(frameTime) {
    const metrics = this._timerPerformanceMetrics;

    metrics.totalExecutions++;
    metrics.totalTime += frameTime;
    metrics.maxExecutionTime = Math.max(metrics.maxExecutionTime, frameTime);
    metrics.averageExecutionTime = metrics.totalTime / metrics.totalExecutions;

    // Track budget overruns
    if (frameTime > this.config.maxTimerBudget) {
      metrics.skippedTimers++;
    }
  }

  /**
   * Get timer consolidation performance report
   * @returns {Object} Timer performance metrics and recommendations
   */
  getPerformanceReport() {
    const metrics = this._timerPerformanceMetrics;
    const overBudgetRate =
      metrics.totalExecutions > 0
        ? metrics.skippedTimers / metrics.totalExecutions
        : 0;

    const timerReports = {};
    for (const [timerId, config] of this._timerRegistry) {
      timerReports[timerId] = {
        priority: config.priority,
        intervalMs: config.intervalMs,
        executionCount: config.executionCount,
        averageTime:
          config.executionCount > 0
            ? config.totalExecutionTime / config.executionCount
            : 0,
        maxExecutionTime: config.maxExecutionTime,
        skippedExecutions: config.skippedExecutions,
        enabled: config.enabled,
      };
    }

    return {
      isRunning: this._timerMasterInterval !== null,
      masterInterval: this.config.timerIntervalMs,
      timeBudget: this.config.maxTimerBudget,
      registeredTimers: this._timerRegistry.size,
      totalExecutions: metrics.totalExecutions,
      averageExecutionTime:
        Math.round(metrics.averageExecutionTime * 100) / 100,
      maxExecutionTime: Math.round(metrics.maxExecutionTime * 100) / 100,
      overBudgetRate: Math.round(overBudgetRate * 1000) / 10, // Percentage with 1 decimal
      timerReports,
      recommendations: this._generateTimerRecommendations(),
    };
  }

  /**
   * Generate timer optimization recommendations
   * @returns {Array} Array of recommendations
   */
  _generateTimerRecommendations() {
    const recommendations = [];
    const metrics = this._timerPerformanceMetrics;
    const overBudgetRate =
      metrics.totalExecutions > 0
        ? metrics.skippedTimers / metrics.totalExecutions
        : 0;

    if (overBudgetRate > 0.1) {
      recommendations.push({
        type: "performance",
        priority: "high",
        message: `Frequent timer budget overruns (${(
          overBudgetRate * 100
        ).toFixed(1)}%)`,
        action:
          "Consider reducing timer frequency or optimizing timer callbacks",
      });
    }

    if (metrics.averageExecutionTime > this.config.maxTimerBudget * 0.8) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        message: `High average timer execution time (${metrics.averageExecutionTime.toFixed(
          2
        )}ms)`,
        action: "Optimize timer callbacks or increase timer budget",
      });
    }

    // Check individual timer performance
    for (const [timerId, config] of this._timerRegistry) {
      const avgTime =
        config.executionCount > 0
          ? config.totalExecutionTime / config.executionCount
          : 0;

      if (avgTime > 3) {
        recommendations.push({
          type: "timer",
          priority: "medium",
          message: `Timer ${timerId} has high execution time (${avgTime.toFixed(
            2
          )}ms)`,
          action: `Optimize timer ${timerId} callback or increase its interval`,
        });
      }

      if (config.skippedExecutions > config.executionCount * 0.2) {
        recommendations.push({
          type: "timer",
          priority: "low",
          message: `Timer ${timerId} frequently skips executions`,
          action: "Consider increasing timer budget or optimizing other timers",
        });
      }
    }

    if (this._timerRegistry.size > 20) {
      recommendations.push({
        type: "architecture",
        priority: "low",
        message: `Many timers registered (${this._timerRegistry.size})`,
        action: "Consider consolidating or merging similar timer operations",
      });
    }

    // Check timer intervals
    const shortIntervalTimers = Array.from(
      this._timerRegistry.entries()
    ).filter(([, config]) => config.intervalMs < 100);

    if (shortIntervalTimers.length > 5) {
      recommendations.push({
        type: "efficiency",
        priority: "medium",
        message: `Many high-frequency timers (${shortIntervalTimers.length} under 100ms)`,
        action: "Consider increasing intervals or merging timer operations",
      });
    }

    return recommendations;
  }

  /**
   * Enable or disable a specific timer
   * @param {string} timerId - Timer to enable/disable
   * @param {boolean} enabled - Whether to enable the timer
   */
  setTimerEnabled(timerId, enabled) {
    const config = this._timerRegistry.get(timerId);
    if (config) {
      config.enabled = enabled;

      if (this.config.enableDebug) {
        console.log(
          `⏱️ [TimerConsolidationSystem] Timer ${timerId} ${
            enabled ? "enabled" : "disabled"
          }`
        );
      }
    }
  }

  /**
   * Update timer interval
   * @param {string} timerId - Timer to update
   * @param {number} newIntervalMs - New interval in milliseconds
   */
  updateTimerInterval(timerId, newIntervalMs) {
    const config = this._timerRegistry.get(timerId);
    if (config) {
      config.intervalMs = Math.max(10, newIntervalMs); // Minimum 10ms interval

      if (this.config.enableDebug) {
        console.log(
          `⏱️ [TimerConsolidationSystem] Timer ${timerId} interval updated to ${newIntervalMs}ms`
        );
      }
    }
  }

  /**
   * Update timer budget
   * @param {number} budget - New timer budget in milliseconds
   */
  setTimerBudget(budget) {
    this.config.maxTimerBudget = Math.max(5, Math.min(50, budget)); // Clamp between 5-50ms

    if (this.config.enableDebug) {
      console.log(
        `⏱️ [TimerConsolidationSystem] Timer budget set to ${this.config.maxTimerBudget}ms`
      );
    }
  }

  /**
   * Update master timer interval
   * @param {number} intervalMs - New master timer interval in milliseconds
   */
  setMasterInterval(intervalMs) {
    this.config.timerIntervalMs = Math.max(10, Math.min(1000, intervalMs)); // Clamp between 10ms-1s

    // Restart master timer with new interval
    if (this._timerMasterInterval) {
      this._stopMasterTimer();
      this._startMasterTimer();
    }

    if (this.config.enableDebug) {
      console.log(
        `⏱️ [TimerConsolidationSystem] Master interval set to ${this.config.timerIntervalMs}ms`
      );
    }
  }

  /**
   * Force execution of a specific timer
   * @param {string} timerId - Timer to execute immediately
   */
  executeTimer(timerId) {
    const config = this._timerRegistry.get(timerId);
    if (config && config.enabled) {
      try {
        const startTime = performance.now();
        config.callback();
        const executionTime = performance.now() - startTime;

        // Update metrics
        config.executionCount++;
        config.totalExecutionTime += executionTime;
        config.maxExecutionTime = Math.max(
          config.maxExecutionTime,
          executionTime
        );
        config.lastExecution = performance.now();

        if (this.config.enableDebug) {
          console.log(
            `⏱️ [TimerConsolidationSystem] Executed timer ${timerId} (${executionTime.toFixed(
              2
            )}ms)`
          );
        }
      } catch (error) {
        console.error(
          `[TimerConsolidationSystem] Error executing timer ${timerId}:`,
          error
        );
      }
    }
  }

  /**
   * Reset timer performance metrics
   */
  resetMetrics() {
    this._timerPerformanceMetrics = {
      totalExecutions: 0,
      totalTime: 0,
      maxExecutionTime: 0,
      averageExecutionTime: 0,
      skippedTimers: 0,
      timerCallbacks: new Map(),
    };

    // Reset timer-specific metrics
    for (const [timerId, config] of this._timerRegistry) {
      config.executionCount = 0;
      config.totalExecutionTime = 0;
      config.maxExecutionTime = 0;
      config.skippedExecutions = 0;
      config.lastExecution = 0;

      this._timerPerformanceMetrics.timerCallbacks.set(timerId, {
        calls: 0,
        totalTime: 0,
        maxTime: 0,
      });
    }

    this._timerExecutionCount = 0;

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Performance metrics reset");
    }
  }

  /**
   * Get list of all registered timers
   * @returns {Array} Array of timer information
   */
  getTimerList() {
    return Array.from(this._timerRegistry.entries()).map(
      ([timerId, config]) => ({
        id: timerId,
        intervalMs: config.intervalMs,
        priority: config.priority,
        enabled: config.enabled,
        executionCount: config.executionCount,
        lastExecution: config.lastExecution,
      })
    );
  }

  /**
   * Check if a timer is registered
   * @param {string} timerId - Timer ID to check
   * @returns {boolean} Whether the timer is registered
   */
  hasTimer(timerId) {
    return this._timerRegistry.has(timerId);
  }

  /**
   * Get timer configuration
   * @param {string} timerId - Timer ID to get configuration for
   * @returns {Object|null} Timer configuration or null if not found
   */
  getTimerConfig(timerId) {
    const config = this._timerRegistry.get(timerId);
    if (!config) return null;

    return {
      intervalMs: config.intervalMs,
      priority: config.priority,
      enabled: config.enabled,
      executionCount: config.executionCount,
      averageTime:
        config.executionCount > 0
          ? config.totalExecutionTime / config.executionCount
          : 0,
      maxExecutionTime: config.maxExecutionTime,
      skippedExecutions: config.skippedExecutions,
      lastExecution: config.lastExecution,
    };
  }

  /**
   * Clean up and destroy the timer consolidation system
   */
  destroy() {
    this._stopMasterTimer();
    this._timerRegistry.clear();
    this._timerPerformanceMetrics.timerCallbacks.clear();

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Destroyed");
    }
  }
}
