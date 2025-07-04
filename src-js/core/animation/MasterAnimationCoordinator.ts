// ===================================================================
// 🎬 MASTER ANIMATION COORDINATOR - Year 3000 Performance System
// ===================================================================
// Replaces multiple concurrent requestAnimationFrame loops with single coordinated system
// Provides frame budgeting, priority-based scheduling, and automatic performance optimization

import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";

interface CoordinatorConfig {
  frameTimeBudget: number;
  maxBatchSize: number;
  enableDebug: boolean;
}

interface AnimationSystem {
  onAnimate(deltaMs: number): void;
  updateAnimation?(timestamp: number, deltaTime: number): void;
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
}

type SystemPriority = "critical" | "normal" | "background";

interface SystemConfig {
  system: AnimationSystem;
  priority: SystemPriority;
  targetFPS: number;
  lastUpdate: number;
  frameInterval: number;
  enabled: boolean;
  frameCount: number;
  totalTime: number;
  maxFrameTime: number;
  skippedFrames: number;
  recentFrameTimes: number[];
  overBudgetHits: number;
  lastAdjustment: number;
}

interface PerformanceMetrics {
  totalFrames: number;
  droppedFrames: number;
  averageFrameTime: number;
  maxFrameTime: number;
  systemStats: Map<string, any>;
  performanceMode: "auto" | "performance" | "quality";
  lastOptimization: number;
}

export class MasterAnimationCoordinator {
  private config: CoordinatorConfig;
  private _animationSystemRegistry = new Map<string, SystemConfig>();
  private _animationFrameId: number | null = null;
  private _animationPaused = false;
  private _frameTimeBudget: number;

  private _performanceMetrics: PerformanceMetrics;
  /** Optional capability gating helper injected by Year3000System */
  private _deviceCapabilityDetector: DeviceCapabilityDetector | null = null;

  constructor(config: Partial<CoordinatorConfig> = {}) {
    this.config = {
      frameTimeBudget: config.frameTimeBudget || 16, // 16ms target for 60fps
      maxBatchSize: config.maxBatchSize || 50,
      enableDebug: config.enableDebug || false,
      ...config,
    };
    this._frameTimeBudget = this.config.frameTimeBudget;

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
  public initialize(): void {
    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master Animation Controller initialized"
      );
    }
  }

  public registerAnimationSystem(
    systemName: string,
    system: AnimationSystem,
    priority: SystemPriority = "normal",
    targetFPS = 60
  ): void {
    const systemConfig: SystemConfig = {
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
      recentFrameTimes: [],
      overBudgetHits: 0,
      lastAdjustment: 0,
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

    if (this._animationSystemRegistry.size === 1 && !this._animationFrameId) {
      this.startMasterAnimationLoop();
    }
  }

  public unregisterAnimationSystem(systemName: string): void {
    if (this._animationSystemRegistry.has(systemName)) {
      this._animationSystemRegistry.delete(systemName);
      this._performanceMetrics.systemStats.delete(systemName);
      if (this.config.enableDebug) {
        console.log(
          `🎬 [MasterAnimationCoordinator] Unregistered animation system: ${systemName}`
        );
      }
      if (this._animationSystemRegistry.size === 0) {
        this.stopMasterAnimationLoop();
      }
    }
  }

  public startMasterAnimationLoop(): void {
    if (this._animationFrameId) return;

    const masterLoop = (timestamp: number) => {
      if (this._animationPaused) {
        this._animationFrameId = requestAnimationFrame(masterLoop);
        return;
      }

      const frameStartTime = performance.now();
      const lastFrameTime =
        this._performanceMetrics.lastOptimization || timestamp;
      const deltaTime = timestamp - lastFrameTime;

      try {
        this._executeMasterAnimationFrame(timestamp, deltaTime);
      } catch (error) {
        console.error(
          "[MasterAnimationCoordinator] Master animation loop error:",
          error
        );
        this._performanceMetrics.droppedFrames++;
      }

      const frameTime = performance.now() - frameStartTime;
      this._updatePerformanceMetrics(frameTime);
      this._applyPerformanceOptimizations();

      this._animationFrameId = requestAnimationFrame(masterLoop);
    };
    this._animationFrameId = requestAnimationFrame(masterLoop);

    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master animation loop started"
      );
    }
  }

  public stopMasterAnimationLoop(): void {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    if (this.config.enableDebug) {
      console.log(
        "🎬 [MasterAnimationCoordinator] Master animation loop stopped"
      );
    }
  }

  /** Inject DeviceCapabilityDetector so MAC can auto-skip on low-end tiers */
  public setDeviceCapabilityDetector(detector: DeviceCapabilityDetector): void {
    this._deviceCapabilityDetector = detector;
  }

  private _executeMasterAnimationFrame(
    timestamp: number,
    deltaTime: number
  ): void {
    let remainingBudget = this._frameTimeBudget;

    const systemsByPriority = Array.from(
      this._animationSystemRegistry.entries()
    ).sort(([, a], [, b]) => {
      const priorityOrder = { critical: 0, normal: 1, background: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const [systemName, config] of systemsByPriority) {
      // ── Low-end gate: skip background systems entirely on "low" profiles
      if (
        this._deviceCapabilityDetector &&
        this._deviceCapabilityDetector.recommendPerformanceQuality() ===
          "low" &&
        config.priority === "background"
      ) {
        continue;
      }

      if (
        !config.enabled ||
        (remainingBudget <= 0 && config.priority === "background")
      ) {
        if (remainingBudget <= 0) config.skippedFrames++;
        continue;
      }

      const timeSinceLastUpdate = timestamp - config.lastUpdate;
      if (timeSinceLastUpdate < config.frameInterval) {
        continue;
      }

      const systemStartTime = performance.now();
      try {
        // Calculate deltaMs for the unified onAnimate hook
        const deltaMs = timeSinceLastUpdate;

        // Call the new unified animation hook
        if (typeof config.system.onAnimate === "function") {
          config.system.onAnimate(deltaMs);
        } else if (typeof config.system.updateAnimation === "function") {
          // Legacy fallback for systems that haven't migrated yet
          config.system.updateAnimation(timestamp, deltaTime);
        }

        const systemExecutionTime = performance.now() - systemStartTime;

        config.frameCount++;
        config.totalTime += systemExecutionTime;
        config.maxFrameTime = Math.max(
          config.maxFrameTime,
          systemExecutionTime
        );
        config.lastUpdate = timestamp;

        const stats = this._performanceMetrics.systemStats.get(systemName);
        if (stats) {
          stats.calls++;
          stats.maxTime = Math.max(stats.maxTime, systemExecutionTime);
          stats.averageTime = config.totalTime / config.frameCount;
        }

        remainingBudget -= systemExecutionTime;

        // -----------------------------------------------------------------
        // TODO[Phase1] Adaptive Frame Governance — evaluate performance of
        // each system and dynamically expand/contract its frameInterval.
        // -----------------------------------------------------------------
        {
          // 1️⃣ Maintain rolling execution-time buffer (20 samples ≈ 333 ms@60FPS)
          config.recentFrameTimes.push(systemExecutionTime);
          if (config.recentFrameTimes.length > 20) {
            config.recentFrameTimes.shift();
          }

          // 2️⃣ Track over-budget hits for the current 2 s observation window
          if (systemExecutionTime > config.frameInterval) {
            config.overBudgetHits++;
          }

          // 3️⃣ Every ~2 s decide whether we need to stretch or contract
          if (timestamp - config.lastAdjustment > 2000) {
            const avgExec =
              config.recentFrameTimes.reduce((a, b) => a + b, 0) /
              config.recentFrameTimes.length;

            // Expand slice when budget blown ≥ 3 × within window
            if (config.overBudgetHits >= 3 && config.frameInterval < 1000) {
              config.frameInterval = Math.min(config.frameInterval * 1.5, 1000);
              config.lastAdjustment = timestamp;
              config.overBudgetHits = 0;
              if (this.config.enableDebug) {
                console.warn(
                  `🎬 [MAC] Auto-expanded frameInterval for ${systemName} → ${config.frameInterval.toFixed(
                    1
                  )} ms`
                );
              }
            }

            // Contract slice when sustained head-room > 40 %
            const idealInterval = 1000 / config.targetFPS;
            const headroom = this._frameTimeBudget - avgExec;
            if (
              headroom > this._frameTimeBudget * 0.4 &&
              config.frameInterval > idealInterval + 0.5
            ) {
              config.frameInterval = Math.max(
                idealInterval,
                config.frameInterval * 0.8
              );
              config.lastAdjustment = timestamp;
              if (this.config.enableDebug) {
                console.info(
                  `🎬 [MAC] Contracted frameInterval for ${systemName} → ${config.frameInterval.toFixed(
                    1
                  )} ms`
                );
              }
            }

            // Reset over-budget counter every evaluation window regardless
            config.overBudgetHits = 0;
          }
        }

        if (systemExecutionTime > 5 && this.config.enableDebug) {
          console.warn(
            `🎬 [MasterAnimationCoordinator] System ${systemName} took ${systemExecutionTime.toFixed(
              2
            )}ms`
          );
        }
      } catch (error) {
        console.error(
          `[MasterAnimationCoordinator] Error in system ${systemName}:`,
          error
        );
        config.enabled = false;
      }
    }
    this._performanceMetrics.totalFrames++;

    // Ensure all queued CSS variable updates are committed this frame so
    // time-sensitive visuals (now-playing bar, right sidebar) stay in sync
    CSSVariableBatcher.instance?.flushCSSVariableBatch?.();
  }

  private _updatePerformanceMetrics(frameTime: number): void {
    const metrics = this._performanceMetrics;
    metrics.maxFrameTime = Math.max(metrics.maxFrameTime, frameTime);
    metrics.averageFrameTime =
      (metrics.averageFrameTime * (metrics.totalFrames - 1) + frameTime) /
      metrics.totalFrames;
    if (frameTime > 16.67) {
      metrics.droppedFrames++;
    }
  }

  private _applyPerformanceOptimizations(): void {
    const now = performance.now();
    if (now - this._performanceMetrics.lastOptimization < 5000) {
      return;
    }

    const frameDropRate =
      this._performanceMetrics.droppedFrames /
      this._performanceMetrics.totalFrames;
    const avgFrameTime = this._performanceMetrics.averageFrameTime;

    if (frameDropRate > 0.1 || avgFrameTime > 20) {
      this._activatePerformanceMode();
    } else if (frameDropRate < 0.02 && avgFrameTime < 10) {
      this._activateQualityMode();
    }
    this._performanceMetrics.lastOptimization = now;
  }

  private _activatePerformanceMode(): void {
    if (this._performanceMetrics.performanceMode === "performance") return;
    this._performanceMetrics.performanceMode = "performance";
    this._frameTimeBudget = 12;

    for (const [, config] of this._animationSystemRegistry) {
      if (config.priority === "background") {
        config.frameInterval = Math.max(config.frameInterval * 1.5, 33);
      }
    }
    this._notifyPerformanceModeChange("performance");

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Activated performance mode");
    }
  }

  private _activateQualityMode(): void {
    if (this._performanceMetrics.performanceMode === "quality") return;
    this._performanceMetrics.performanceMode = "quality";
    this._frameTimeBudget = 16;

    for (const [, config] of this._animationSystemRegistry) {
      config.frameInterval = 1000 / config.targetFPS;
    }
    this._notifyPerformanceModeChange("quality");

    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Activated quality mode");
    }
  }

  private _notifyPerformanceModeChange(mode: "performance" | "quality"): void {
    for (const [systemName, config] of this._animationSystemRegistry) {
      if (config.system.onPerformanceModeChange) {
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

  public destroy(): void {
    this.stopMasterAnimationLoop();
    this._animationSystemRegistry.clear();
    if (this.config.enableDebug) {
      console.log("🎬 [MasterAnimationCoordinator] Destroyed");
    }
  }

  // -----------------------------------------------------------------------
  // TODO[Phase1] Expose a shallow-cloned metrics report for external tooling
  // -----------------------------------------------------------------------
  public getPerformanceReport() {
    return JSON.parse(JSON.stringify(this._performanceMetrics));
  }

  public getCurrentPerformanceMode(): "auto" | "performance" | "quality" {
    return this._performanceMetrics.performanceMode;
  }

  public getFrameTimeBudget(): number {
    return this._frameTimeBudget;
  }
}
