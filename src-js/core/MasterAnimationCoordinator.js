// ===================================================================
// 🎬 MASTER ANIMATION COORDINATOR - Year 3000 Performance System
// ===================================================================
// Replaces multiple concurrent requestAnimationFrame loops with single coordinated system
// Provides frame budgeting, priority-based scheduling, and automatic performance optimization

export class MasterAnimationCoordinator {
  constructor(config = {}) {
    this.config = {
      frameTimeBudget: config.frameTimeBudget || 16, // 16ms target for 60fps
      maxBatchSize: config.maxBatchSize || 50,
      enableDebug: config.enableDebug || false,
      ...config,
    };

    // Animation controller state
    this.masterAnimationController = null;
    this._animationSystemRegistry = new Map();
    this._animationFrameId = null;
    this._animationPaused = false;
    this._frameStartTime = 0;
    this._currentFrameTime = 0;
    this._frameTimeBudget = this.config.frameTimeBudget;

    // Performance metrics
    this._performanceMetrics = {
      totalFrames: 0,
      droppedFrames: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      systemStats: new Map(),
      performanceMode: "auto",
      lastOptimization: 0,
    };

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Initialized");
    }
  }

  /**
   * Initialize the master animation controller
   */
  initialize() {
    if (this.masterAnimationController) {
      console.warn("[MasterAnimationCoordinator] Already initialized");
      return;
    }

    this.masterAnimationController = {
      isRunning: false,
      registeredSystems: new Map(),
      frameStartTime: 0,
      lastFrameTime: 0,
      performanceMode: "auto", // auto, performance, quality
    };

    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master Animation Controller initialized"
      );
    }
  }

  /**
   * Register an animation system with the master coordinator
   * @param {string} systemName - Unique system identifier
   * @param {Object} system - System instance with updateAnimation method
   * @param {string} priority - Priority level: 'critical', 'normal', 'background'
   * @param {number} targetFPS - Target frame rate (optional, defaults to 60)
   */
  registerAnimationSystem(
    systemName,
    system,
    priority = "normal",
    targetFPS = 60
  ) {
    if (!this.masterAnimationController) {
      this.initialize();
    }

    const systemConfig = {
      system,
      priority,
      targetFPS,
      lastUpdate: 0,
      frameInterval: 1000 / targetFPS,
      enabled: true,
      frameCount: 0,
      totalTime: 0,
      maxFrameTime: 0,
      skippedFrames: 0,
    };

    this._animationSystemRegistry.set(systemName, systemConfig);
    this._performanceMetrics.systemStats.set(systemName, {
      averageTime: 0,
      maxTime: 0,
      calls: 0,
    });

    if (this.config.enableDebug) {
      console.log(
        `🎬 [MasterAnimationCoordinator] Registered animation system: ${systemName} (${priority} priority, ${targetFPS}fps)`
      );
    }

    // Start master loop if this is the first system
    if (
      this._animationSystemRegistry.size === 1 &&
      !this.masterAnimationController.isRunning
    ) {
      this.startMasterAnimationLoop();
    }
  }

  /**
   * Unregister an animation system
   * @param {string} systemName - System identifier to unregister
   */
  unregisterAnimationSystem(systemName) {
    if (this._animationSystemRegistry.has(systemName)) {
      this._animationSystemRegistry.delete(systemName);
      this._performanceMetrics.systemStats.delete(systemName);

      if (this.config.enableDebug) {
        console.log(
          `🎬 [MasterAnimationCoordinator] Unregistered animation system: ${systemName}`
        );
      }

      // Stop master loop if no systems remain
      if (this._animationSystemRegistry.size === 0) {
        this.stopMasterAnimationLoop();
      }
    }
  }

  /**
   * Start the master animation loop
   * Single requestAnimationFrame loop that coordinates all visual systems
   */
  startMasterAnimationLoop() {
    if (this.masterAnimationController?.isRunning) return;

    this.masterAnimationController.isRunning = true;
    this._animationPaused = false;

    const masterLoop = (timestamp) => {
      if (this._animationPaused || !this.masterAnimationController?.isRunning)
        return;

      this._frameStartTime = performance.now();
      const deltaTime =
        timestamp - (this.masterAnimationController.lastFrameTime || timestamp);
      this.masterAnimationController.lastFrameTime = timestamp;

      try {
        this._executeMasterAnimationFrame(timestamp, deltaTime);
      } catch (error) {
        console.error(
          "[MasterAnimationCoordinator] Master animation loop error:",
          error
        );
        this._performanceMetrics.droppedFrames++;
      }

      // Calculate frame time and update metrics
      this._currentFrameTime = performance.now() - this._frameStartTime;
      this._updatePerformanceMetrics(this._currentFrameTime);

      // Apply automatic performance adjustments
      this._applyPerformanceOptimizations();

      // Schedule next frame
      this._animationFrameId = requestAnimationFrame(masterLoop);
    };

    this._animationFrameId = requestAnimationFrame(masterLoop);

    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master animation loop started"
      );
    }
  }

  /**
   * Stop the master animation loop
   */
  stopMasterAnimationLoop() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    if (this.masterAnimationController) {
      this.masterAnimationController.isRunning = false;
    }

    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master animation loop stopped"
      );
    }
  }

  /**
   * Execute animation updates for all registered systems with frame budgeting
   * @param {number} timestamp - Current timestamp
   * @param {number} deltaTime - Time since last frame
   */
  _executeMasterAnimationFrame(timestamp, deltaTime) {
    const frameStartTime = performance.now();
    let remainingBudget = this._frameTimeBudget;

    // Sort systems by priority (critical -> normal -> background)
    const systemsByPriority = Array.from(
      this._animationSystemRegistry.entries()
    ).sort(([, a], [, b]) => {
      const priorityOrder = { critical: 0, normal: 1, background: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const [systemName, config] of systemsByPriority) {
      if (!config.enabled || remainingBudget <= 0) {
        if (remainingBudget <= 0 && config.priority === "background") {
          config.skippedFrames++;
          continue; // Skip background systems when budget exhausted
        }
      }

      // Check if system should update based on target FPS
      const timeSinceLastUpdate = timestamp - config.lastUpdate;
      if (timeSinceLastUpdate < config.frameInterval) {
        continue; // Skip frame for this system
      }

      const systemStartTime = performance.now();

      try {
        // Call system's animation update method
        if (
          config.system &&
          typeof config.system.updateAnimation === "function"
        ) {
          config.system.updateAnimation(timestamp, deltaTime);
        }

        const systemExecutionTime = performance.now() - systemStartTime;

        // Update system metrics
        config.frameCount++;
        config.totalTime += systemExecutionTime;
        config.maxFrameTime = Math.max(
          config.maxFrameTime,
          systemExecutionTime
        );
        config.lastUpdate = timestamp;

        // Update performance metrics
        const stats = this._performanceMetrics.systemStats.get(systemName);
        if (stats) {
          stats.calls++;
          stats.maxTime = Math.max(stats.maxTime, systemExecutionTime);
          stats.averageTime = config.totalTime / config.frameCount;
        }

        remainingBudget -= systemExecutionTime;

        // If system is taking too long, mark for optimization
        if (systemExecutionTime > 5) {
          if (this.config.enableDebug) {
            console.warn(
              `🎬 [MasterAnimationCoordinator] System ${systemName} took ${systemExecutionTime.toFixed(
                2
              )}ms`
            );
          }
        }
      } catch (error) {
        console.error(
          `[MasterAnimationCoordinator] Error in system ${systemName}:`,
          error
        );
        config.enabled = false; // Disable problematic system
      }
    }

    this._performanceMetrics.totalFrames++;
  }

  /**
   * Update performance metrics based on frame timing
   * @param {number} frameTime - Time taken for current frame
   */
  _updatePerformanceMetrics(frameTime) {
    const metrics = this._performanceMetrics;

    metrics.maxFrameTime = Math.max(metrics.maxFrameTime, frameTime);
    metrics.averageFrameTime =
      (metrics.averageFrameTime * (metrics.totalFrames - 1) + frameTime) /
      metrics.totalFrames;

    // Track dropped frames (frames taking longer than 16.67ms for 60fps)
    if (frameTime > 16.67) {
      metrics.droppedFrames++;
    }
  }

  /**
   * Apply automatic performance optimizations based on frame timing
   */
  _applyPerformanceOptimizations() {
    const now = performance.now();

    // Only optimize every 5 seconds to avoid thrashing
    if (now - this._performanceMetrics.lastOptimization < 5000) {
      return;
    }

    const frameDropRate =
      this._performanceMetrics.droppedFrames /
      this._performanceMetrics.totalFrames;
    const avgFrameTime = this._performanceMetrics.averageFrameTime;

    // Switch to performance mode if frame rate is suffering
    if (frameDropRate > 0.1 || avgFrameTime > 20) {
      this._activatePerformanceMode();
    } else if (frameDropRate < 0.02 && avgFrameTime < 10) {
      // Switch back to quality mode if performance is good
      this._activateQualityMode();
    }

    this._performanceMetrics.lastOptimization = now;
  }

  /**
   * Activate performance mode - reduce quality for better frame rate
   */
  _activatePerformanceMode() {
    if (this._performanceMetrics.performanceMode === "performance") return;

    this._performanceMetrics.performanceMode = "performance";
    this._frameTimeBudget = 12; // Tighter budget

    // Reduce target FPS for background systems
    for (const [systemName, config] of this._animationSystemRegistry) {
      if (config.priority === "background") {
        config.frameInterval = Math.max(config.frameInterval * 1.5, 33); // Max 30fps
      }
    }

    this._notifyPerformanceModeChange("performance");

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Activated performance mode");
    }
  }

  /**
   * Activate quality mode - prioritize visual quality
   */
  _activateQualityMode() {
    if (this._performanceMetrics.performanceMode === "quality") return;

    this._performanceMetrics.performanceMode = "quality";
    this._frameTimeBudget = 16; // Standard budget

    // Restore original frame intervals
    for (const [systemName, config] of this._animationSystemRegistry) {
      config.frameInterval = 1000 / config.targetFPS;
    }

    this._notifyPerformanceModeChange("quality");

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Activated quality mode");
    }
  }

  /**
   * Notify systems of performance mode changes
   * @param {string} mode - New performance mode
   */
  _notifyPerformanceModeChange(mode) {
    for (const [systemName, config] of this._animationSystemRegistry) {
      if (
        config.system &&
        typeof config.system.onPerformanceModeChange === "function"
      ) {
        try {
          config.system.onPerformanceModeChange(mode);
        } catch (error) {
          console.error(
            `[MasterAnimationCoordinator] Error notifying ${systemName} of mode change:`,
            error
          );
        }
      }
    }
  }

  /**
   * Get performance report for the master animation coordinator
   * @returns {Object} Performance metrics and recommendations
   */
  getPerformanceReport() {
    const metrics = this._performanceMetrics;
    const frameDropRate =
      metrics.totalFrames > 0 ? metrics.droppedFrames / metrics.totalFrames : 0;

    const systemReports = {};
    for (const [systemName, config] of this._animationSystemRegistry) {
      systemReports[systemName] = {
        priority: config.priority,
        targetFPS: config.targetFPS,
        frameCount: config.frameCount,
        averageTime:
          config.frameCount > 0 ? config.totalTime / config.frameCount : 0,
        maxFrameTime: config.maxFrameTime,
        skippedFrames: config.skippedFrames,
        enabled: config.enabled,
      };
    }

    return {
      isRunning: this.masterAnimationController?.isRunning || false,
      performanceMode: metrics.performanceMode,
      totalFrames: metrics.totalFrames,
      droppedFrames: metrics.droppedFrames,
      frameDropRate: Math.round(frameDropRate * 1000) / 10, // Percentage with 1 decimal
      averageFrameTime: Math.round(metrics.averageFrameTime * 100) / 100,
      maxFrameTime: Math.round(metrics.maxFrameTime * 100) / 100,
      frameTimeBudget: this._frameTimeBudget,
      registeredSystems: this._animationSystemRegistry.size,
      systemReports,
      recommendations: this._generatePerformanceRecommendations(),
    };
  }

  /**
   * Generate performance optimization recommendations
   * @returns {Array} Array of recommendations
   */
  _generatePerformanceRecommendations() {
    const recommendations = [];
    const metrics = this._performanceMetrics;
    const frameDropRate =
      metrics.totalFrames > 0 ? metrics.droppedFrames / metrics.totalFrames : 0;

    if (frameDropRate > 0.1) {
      recommendations.push({
        type: "performance",
        priority: "high",
        message: `High frame drop rate (${(frameDropRate * 100).toFixed(1)}%)`,
        action: "Consider reducing visual effects or enabling performance mode",
      });
    }

    if (metrics.averageFrameTime > 20) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        message: `High average frame time (${metrics.averageFrameTime.toFixed(
          2
        )}ms)`,
        action: "Optimize animation systems or reduce frame time budget",
      });
    }

    // Check individual system performance
    for (const [systemName, config] of this._animationSystemRegistry) {
      const avgTime =
        config.frameCount > 0 ? config.totalTime / config.frameCount : 0;

      if (avgTime > 8) {
        recommendations.push({
          type: "system",
          priority: "medium",
          message: `System ${systemName} has high execution time (${avgTime.toFixed(
            2
          )}ms)`,
          action: `Optimize ${systemName} or reduce its update frequency`,
        });
      }

      if (config.skippedFrames > config.frameCount * 0.2) {
        recommendations.push({
          type: "system",
          priority: "low",
          message: `System ${systemName} frequently skips frames`,
          action:
            "Consider increasing frame time budget or optimizing other systems",
        });
      }
    }

    if (this._animationSystemRegistry.size > 10) {
      recommendations.push({
        type: "architecture",
        priority: "low",
        message: `Many animation systems registered (${this._animationSystemRegistry.size})`,
        action: "Consider consolidating or merging similar animation systems",
      });
    }

    return recommendations;
  }

  /**
   * Pause all animations
   */
  pauseAnimations() {
    this._animationPaused = true;

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Animations paused");
    }
  }

  /**
   * Resume all animations
   */
  resumeAnimations() {
    this._animationPaused = false;

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Animations resumed");
    }
  }

  /**
   * Enable or disable a specific animation system
   * @param {string} systemName - System to enable/disable
   * @param {boolean} enabled - Whether to enable the system
   */
  setSystemEnabled(systemName, enabled) {
    const config = this._animationSystemRegistry.get(systemName);
    if (config) {
      config.enabled = enabled;

      if (this.config.enableDebug) {
        console.log(
          `🎬 [MasterAnimationCoordinator] System ${systemName} ${
            enabled ? "enabled" : "disabled"
          }`
        );
      }
    }
  }

  /**
   * Update frame time budget
   * @param {number} budget - New frame time budget in milliseconds
   */
  setFrameTimeBudget(budget) {
    this._frameTimeBudget = Math.max(8, Math.min(33, budget)); // Clamp between 8-33ms

    if (this.config.enableDebug) {
      console.log(
        `🎬 [MasterAnimationCoordinator] Frame time budget set to ${this._frameTimeBudget}ms`
      );
    }
  }

  /**
   * Reset performance metrics
   */
  resetMetrics() {
    this._performanceMetrics = {
      totalFrames: 0,
      droppedFrames: 0,
      averageFrameTime: 0,
      maxFrameTime: 0,
      systemStats: new Map(),
      performanceMode: "auto",
      lastOptimization: 0,
    };

    // Reset system-specific metrics
    for (const [systemName, config] of this._animationSystemRegistry) {
      config.frameCount = 0;
      config.totalTime = 0;
      config.maxFrameTime = 0;
      config.skippedFrames = 0;

      this._performanceMetrics.systemStats.set(systemName, {
        averageTime: 0,
        maxTime: 0,
        calls: 0,
      });
    }

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Performance metrics reset");
    }
  }

  /**
   * Clean up and destroy the coordinator
   */
  destroy() {
    this.stopMasterAnimationLoop();
    this._animationSystemRegistry.clear();
    this._performanceMetrics.systemStats.clear();
    this.masterAnimationController = null;

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Destroyed");
    }
  }
}
