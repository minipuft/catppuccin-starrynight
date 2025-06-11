// ===================================================================
// ⏱️ TIMER CONSOLIDATION SYSTEM - Year 3000 Performance System
// ===================================================================
// Replaces multiple setInterval calls with single coordinated system
// Provides priority-based timer scheduling and performance monitoring

interface TimerConfig {
  timerIntervalMs: number;
  maxTimerBudget: number;
  enableDebug: boolean;
}

type TimerPriority = "critical" | "normal" | "background";

interface RegisteredTimer {
  callback: () => void;
  intervalMs: number;
  priority: TimerPriority;
  lastExecution: number;
  enabled: boolean;
  executionCount: number;
  totalExecutionTime: number;
  maxExecutionTime: number;
  skippedExecutions: number;
}

interface TimerPerformanceMetrics {
  totalExecutions: number;
  totalTime: number;
  maxExecutionTime: number;
  averageExecutionTime: number;
  skippedTimers: number;
  timerCallbacks: Map<string, any>;
}

export class TimerConsolidationSystem {
  private config: TimerConfig;
  private _timerRegistry = new Map<string, RegisteredTimer>();
  private _timerMasterInterval: NodeJS.Timeout | null = null;
  private _timerPerformanceMetrics: TimerPerformanceMetrics;

  constructor(config: Partial<TimerConfig> = {}) {
    this.config = {
      timerIntervalMs: config.timerIntervalMs || 50,
      maxTimerBudget: config.maxTimerBudget || 10,
      enableDebug: config.enableDebug || false,
      ...config,
    };

    this._timerPerformanceMetrics = {
      totalExecutions: 0,
      totalTime: 0,
      maxExecutionTime: 0,
      averageExecutionTime: 0,
      skippedTimers: 0,
      timerCallbacks: new Map(),
    };

    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Initialized");
    }
  }

  public initialize(): void {
    if (this.config.enableDebug) {
      console.log(
        "⏱️ [TimerConsolidationSystem] Timer consolidation initialized"
      );
    }
  }

  public registerConsolidatedTimer(
    timerId: string,
    callback: () => void,
    intervalMs: number,
    priority: TimerPriority = "normal"
  ): void {
    if (this._timerRegistry.has(timerId)) {
      console.warn(
        `[TimerConsolidationSystem] Timer ${timerId} already registered`
      );
      return;
    }

    const timerConfig: RegisteredTimer = {
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

    if (this._timerRegistry.size === 1 && !this._timerMasterInterval) {
      this._startMasterTimer();
    }
  }

  public unregisterConsolidatedTimer(timerId: string): void {
    if (this._timerRegistry.has(timerId)) {
      this._timerRegistry.delete(timerId);
      this._timerPerformanceMetrics.timerCallbacks.delete(timerId);
      if (this.config.enableDebug) {
        console.log(
          `⏱️ [TimerConsolidationSystem] Unregistered timer: ${timerId}`
        );
      }
      if (this._timerRegistry.size === 0) {
        this._stopMasterTimer();
      }
    }
  }

  private _startMasterTimer(): void {
    if (this._timerMasterInterval) return;
    this._timerMasterInterval = setInterval(() => {
      this._executeMasterTimerFrame();
    }, this.config.timerIntervalMs);
    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Master timer started");
    }
  }

  private _stopMasterTimer(): void {
    if (this._timerMasterInterval) {
      clearInterval(this._timerMasterInterval);
      this._timerMasterInterval = null;
    }
    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Master timer stopped");
    }
  }

  private _executeMasterTimerFrame(): void {
    const frameStartTime = performance.now();
    let remainingBudget = this.config.maxTimerBudget;

    const timersByPriority = Array.from(this._timerRegistry.entries()).sort(
      ([, a], [, b]) => {
        const priorityOrder = { critical: 0, normal: 1, background: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    );

    for (const [timerId, config] of timersByPriority) {
      if (
        !config.enabled ||
        (remainingBudget <= 0 && config.priority === "background")
      ) {
        if (remainingBudget <= 0) config.skippedExecutions++;
        continue;
      }

      const timeSinceLastExecution = frameStartTime - config.lastExecution;
      if (timeSinceLastExecution < config.intervalMs) {
        continue;
      }

      const timerStartTime = performance.now();
      try {
        config.callback();
        const timerExecutionTime = performance.now() - timerStartTime;

        config.executionCount++;
        config.totalExecutionTime += timerExecutionTime;
        config.maxExecutionTime = Math.max(
          config.maxExecutionTime,
          timerExecutionTime
        );
        config.lastExecution = frameStartTime;

        const stats = this._timerPerformanceMetrics.timerCallbacks.get(timerId);
        if (stats) {
          stats.calls++;
          stats.totalTime += timerExecutionTime;
          stats.maxTime = Math.max(stats.maxTime, timerExecutionTime);
        }
        remainingBudget -= timerExecutionTime;
      } catch (error) {
        console.error(
          `[TimerConsolidationSystem] Error in timer ${timerId}:`,
          error
        );
        config.enabled = false;
      }
    }
    const totalFrameTime = performance.now() - frameStartTime;
    this._updateTimerPerformanceMetrics(totalFrameTime);
  }

  private _updateTimerPerformanceMetrics(frameTime: number): void {
    const metrics = this._timerPerformanceMetrics;
    metrics.totalExecutions++;
    metrics.totalTime += frameTime;
    metrics.maxExecutionTime = Math.max(metrics.maxExecutionTime, frameTime);
    metrics.averageExecutionTime = metrics.totalTime / metrics.totalExecutions;
    if (frameTime > this.config.maxTimerBudget) {
      metrics.skippedTimers++;
    }
  }

  public destroy(): void {
    this._stopMasterTimer();
    this._timerRegistry.clear();
    if (this.config.enableDebug) {
      console.log("⏱️ [TimerConsolidationSystem] Destroyed");
    }
  }
}
