// ===================================================================
// 📊 PERFORMANCE ANALYZER - Year 3000 Performance System
// ===================================================================
// Advanced performance analysis and health metrics generation
// Provides comprehensive system monitoring and optimization recommendations

interface AnalyzerConfig {
  enableDebug: boolean;
  monitoringInterval: number;
  retentionPeriod: number;
}

interface MemoryMetrics {
  used: number;
  total: number;
  limit: number;
  utilization: number;
  available: number;
}

interface TimingMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

interface FPSMetrics {
  current: number;
  average: number;
  min: number;
  max: number;
  isEstimate: boolean;
}

interface DOMMetrics {
  elements: number;
  styleSheets: number;
  images: number;
  scripts: number;
  links: number;
}

interface NetworkMetrics {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface PerformanceMetrics {
  timestamp: number;
  memory: MemoryMetrics;
  timing: TimingMetrics;
  fps: FPSMetrics;
  dom: DOMMetrics;
  network: NetworkMetrics;
}

// A simple FPS counter implementation
class FPSCounter {
  private frames = 0;
  private lastTime = performance.now();
  private rafHandle: number | null = null;

  public currentFPS = 0;
  public averageFPS = 0;
  public minFPS = Infinity;
  public maxFPS = 0;
  private history: number[] = [];

  constructor() {
    this.loop();
  }

  private loop = () => {
    this.frames++;
    const time = performance.now();

    if (time >= this.lastTime + 1000) {
      this.currentFPS = this.frames;
      this.history.push(this.currentFPS);
      if (this.history.length > 30) {
        this.history.shift();
      }
      this.averageFPS = Math.round(
        this.history.reduce((a, b) => a + b, 0) / this.history.length
      );
      this.minFPS = Math.min(this.minFPS, this.currentFPS);
      this.maxFPS = Math.max(this.maxFPS, this.currentFPS);

      this.frames = 0;
      this.lastTime = time;
    }

    this.rafHandle = requestAnimationFrame(this.loop);
  };

  public stop = () => {
    if (this.rafHandle) {
      cancelAnimationFrame(this.rafHandle);
    }
  };

  /** Returns copy of the last recorded FPS samples (1-sec granularity). */
  public getHistory(): number[] {
    return [...this.history];
  }
}

export class PerformanceAnalyzer {
  public initialized = false;
  private config: AnalyzerConfig;
  private performanceHistory: PerformanceMetrics[] = [];
  private metricsBuffer = new Map<number, PerformanceMetrics>();
  private isMonitoring = false;
  private monitoringTimer: NodeJS.Timeout | null = null;
  private _fpsCounter: FPSCounter | null = null;
  private timedOperations = new Map<string, number[]>();
  private _buckets: Map<string, number> = new Map();
  private static _isLowEndCache: boolean | null = null;

  // -------------------------------------------------------------------
  // Performance budgets and monitoring -------------------------------
  // -------------------------------------------------------------------

  // Performance budgets (in milliseconds)
  private performanceBudgets = {
    animationFrame: 16.67, // 60 FPS target
    cssVariableUpdate: 2,   // CSS variable batching
    domObservation: 5,      // DOM mutation handling
    audioAnalysis: 10,      // Audio processing
    visualEffects: 8,       // Visual system updates
    userInteraction: 100,   // User interaction response
    longTask: 50,          // Long task detection threshold
  };

  // Budget tracking
  private budgetViolations = new Map<string, number>();
  private budgetHistory = new Map<string, Array<{duration: number, timestamp: number}>>();
  
  // Auto quality reduction
  private qualityReductionEnabled = true;
  private qualityReductionThresholds = {
    minor: 0.7,      // 70% budget violation triggers minor reduction
    moderate: 0.5,   // 50% budget violation triggers moderate reduction  
    major: 0.3,      // 30% budget violation triggers major reduction
  };
  private currentQualityLevel: 'ultra' | 'high' | 'medium' | 'low' | 'minimal' = 'high';
  private lastQualityReduction = 0;
  private lastQualityIncrease = 0;
  private qualityRecoveryDelay = 5000; // 5 seconds before attempting quality recovery
  private qualityIncreaseDelay = 10000; // 10 seconds minimum between quality increases
  private qualityRecoveryAttempts = 0;
  private maxQualityRecoveryAttempts = 5; // Max recovery attempts before backing off
  private lastCleanupTime = 0;
  private cleanupInterval = 60000; // Clean up old records every 60 seconds
  private maxRecordAge = 300000; // Keep records for maximum 5 minutes
  
  // Debug safeguards for infinite loop detection
  private qualityChangeHistory: Array<{action: 'increase' | 'decrease', level: string, timestamp: number}> = [];
  private maxQualityChangesPerMinute = 10; // Prevent more than 10 quality changes per minute

  // -------------------------------------------------------------------
  // Simple metric recorder for external systems -----------------------
  // -------------------------------------------------------------------

  /**
   * Lightweight metric recording helper used by visual systems.
   * Currently stores last value per metric name; can be expanded later.
   */
  private _externalMetrics: Map<string, number> = new Map();

  public recordMetric(name: string, value: number): void {
    this._externalMetrics.set(name, value);
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] metric '${name}' = ${value}`);
    }
  }

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      monitoringInterval: config.monitoringInterval || 5000,
      retentionPeriod: config.retentionPeriod || 300000,
      ...config,
    };

    try {
      this._fpsCounter = new FPSCounter();
      
      // Initialize advanced monitoring (marks and long task detection)
      this.initializeAdvancedMonitoring();
      
      this.initialized = true;
      if (this.config.enableDebug) {
        console.log("📊 [PerformanceAnalyzer] Initialized successfully with advanced monitoring.");
      }
    } catch (error) {
      this.initialized = false;
      console.error(
        "CRITICAL: PerformanceAnalyzer failed to initialize.",
        error
      );
    }

    this._buckets = new Map();
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.monitoringTimer = setInterval(() => {
      this._collectPerformanceMetrics();
    }, this.config.monitoringInterval);
    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Monitoring started");
    }
  }

  public stopMonitoring(): void {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }
    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Monitoring stopped");
    }
  }

  private _collectPerformanceMetrics(): void {
    const timestamp = performance.now();
    const metrics: PerformanceMetrics = {
      timestamp,
      memory: this._getMemoryMetrics(),
      timing: this._getTimingMetrics(),
      fps: this._getFPSMetrics(),
      dom: this._getDOMMetrics(),
      network: this._getNetworkMetrics(),
    };
    this.performanceHistory.push(metrics);
    const cutoff = timestamp - this.config.retentionPeriod;
    this.performanceHistory = this.performanceHistory.filter(
      (m) => m.timestamp > cutoff
    );
    this.metricsBuffer.set(timestamp, metrics);
    for (const key of this.metricsBuffer.keys()) {
      if (key < cutoff) {
        this.metricsBuffer.delete(key);
      }
    }
  }

  private _getMemoryMetrics(): MemoryMetrics {
    const memoryInfo = (performance as any).memory || {};
    return {
      used: memoryInfo.usedJSHeapSize || 0,
      total: memoryInfo.totalJSHeapSize || 0,
      limit: memoryInfo.jsHeapSizeLimit || 0,
      utilization: memoryInfo.totalJSHeapSize
        ? (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100
        : 0,
      available: memoryInfo.jsHeapSizeLimit
        ? memoryInfo.jsHeapSizeLimit - memoryInfo.usedJSHeapSize
        : 0,
    };
  }

  private _getTimingMetrics(): TimingMetrics {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      loadComplete: navigation?.loadEventEnd || 0,
      firstPaint: this._getFirstPaint(),
      firstContentfulPaint: this._getFirstContentfulPaint(),
      largestContentfulPaint: this._getLargestContentfulPaint(),
    };
  }

  private _getFPSMetrics(): FPSMetrics {
    if (this._fpsCounter) {
      return {
        current: this._fpsCounter.currentFPS,
        average: this._fpsCounter.averageFPS,
        min: this._fpsCounter.minFPS,
        max: this._fpsCounter.maxFPS,
        isEstimate: false,
      };
    }
    // Fallback for environments where FPS counting is not possible
    return { current: 60, average: 60, min: 60, max: 60, isEstimate: true };
  }

  private _getDOMMetrics(): DOMMetrics {
    return {
      elements: document.querySelectorAll("*").length,
      styleSheets: document.styleSheets.length,
      images: document.images.length,
      scripts: document.scripts.length,
      links: document.links.length,
    };
  }

  private _getNetworkMetrics(): NetworkMetrics {
    const connection = (navigator as any).connection || {};
    return {
      effectiveType: connection.effectiveType || "unknown",
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }

  private _getFirstPaint(): number {
    const firstPaint = performance
      .getEntriesByType("paint")
      .find((entry) => entry.name === "first-paint");
    return firstPaint ? firstPaint.startTime : 0;
  }

  private _getFirstContentfulPaint(): number {
    const fcp = performance
      .getEntriesByType("paint")
      .find((entry) => entry.name === "first-contentful-paint");
    return fcp ? fcp.startTime : 0;
  }

  private _getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    const lastEntry = lcpEntries[lcpEntries.length - 1];
    return lastEntry ? lastEntry.startTime : 0;
  }

  public calculateHealthScore(): number {
    const latestMetrics =
      this.performanceHistory[this.performanceHistory.length - 1];
    if (!latestMetrics) return 100;

    let score = 100;
    // Memory usage
    if (latestMetrics.memory.utilization > 80) score -= 20;
    // FPS
    if (latestMetrics.fps.average < 30) score -= 25;
    // LCP
    if (latestMetrics.timing.largestContentfulPaint > 2500) score -= 15;

    return Math.max(0, score);
  }

  public getHealthLevel(score: number): "stable" | "warning" | "critical" {
    if (score > 80) return "stable";
    if (score > 50) return "warning";
    return "critical";
  }

  // --- Start of methods migrated from PerformanceMonitor ---

  public startTiming(operation: string): number {
    return performance.now();
  }

  public endTiming(operation: string, startTime: number): void {
    const duration = performance.now() - startTime;
    if (!this.timedOperations.has(operation)) {
      this.timedOperations.set(operation, []);
    }
    const timings = this.timedOperations.get(operation)!;
    timings.push(duration);
    if (timings.length > 50) {
      // Keep last 50 timings
      timings.shift();
    }
  }

  public getAverageTime(operation: string): number {
    const timings = this.timedOperations.get(operation);
    if (!timings || timings.length === 0) {
      return 0;
    }
    return timings.reduce((a, b) => a + b, 0) / timings.length;
  }

  public detectMemoryPressure(): "high" | "normal" | "unknown" {
    const memory = (performance as any).memory;
    if (memory) {
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      return used / total > 0.8 ? "high" : "normal";
    }
    return "unknown";
  }

  public shouldReduceQuality(): boolean {
    const score = this.calculateHealthScore();
    return score < 60;
  }

  /**
   * Emit a trace message when debug mode is enabled.  This method provides a
   * single, centralized entry-point so callers can avoid sprinkling
   * `console.log` statements around.  In the future we might widen this to
   * support different channels (performance panel, remote telemetry, etc.).
   */
  public emitTrace(message: string, data?: unknown): void {
    if (!this.config.enableDebug) return;
    if (data !== undefined) {
      console.log(`📊 [PerformanceAnalyzer] ${message}`, data);
    } else {
      console.log(`📊 [PerformanceAnalyzer] ${message}`);
    }
  }

  /**
   * Throttle helper – returns true when the caller is allowed to perform an update
   * for the supplied bucket. Subsequent calls within `minIntervalMs` will return
   * false until the interval has elapsed. Useful for cheaply rate-limiting CSS
   * variable flushes, expensive observers, etc.
   *
   * @param bucket        Arbitrary string identifying the operation family
   * @param minIntervalMs Minimum time between allowed updates (default 16 ms)
   */
  public shouldUpdate(bucket: string, minIntervalMs = 16): boolean {
    const now = performance.now();
    const nextAllowed = this._buckets.get(bucket) ?? 0;
    if (now >= nextAllowed) {
      this._buckets.set(bucket, now + minIntervalMs);
      return true;
    }
    return false;
  }

  // --- Performance Budget Methods ---

  /**
   * Check if an operation is within performance budget
   */
  public isWithinBudget(operation: string, duration: number): boolean {
    const budget = this.performanceBudgets[operation as keyof typeof this.performanceBudgets];
    if (!budget) return true; // No budget defined, allow operation

    const withinBudget = duration <= budget;
    
    if (!withinBudget) {
      // Track budget violation
      this.budgetViolations.set(operation, (this.budgetViolations.get(operation) || 0) + 1);
      
      if (this.config.enableDebug) {
        console.warn(`📊 [PerformanceAnalyzer] Budget violation: ${operation} took ${duration.toFixed(2)}ms (budget: ${budget}ms)`);
      }
    }

    // Track performance history with timestamp
    const history = this.budgetHistory.get(operation) || [];
    history.push({
      duration,
      timestamp: performance.now()
    });
    if (history.length > 100) history.shift(); // Keep last 100 samples
    this.budgetHistory.set(operation, history);

    return withinBudget;
  }

  /**
   * Time an operation and check against budget
   */
  public timeOperation<T>(operation: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.isWithinBudget(operation, duration);
    return result;
  }

  /**
   * Time an async operation and check against budget
   */
  public async timeOperationAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.isWithinBudget(operation, duration);
    return result;
  }

  /**
   * Get performance budget violations
   */
  public getBudgetViolations(): Map<string, number> {
    return new Map(this.budgetViolations);
  }

  /**
   * Get performance budget statistics
   */
  public getBudgetStats(): Record<string, { budget: number; violations: number; averageTime: number; maxTime: number }> {
    const stats: Record<string, { budget: number; violations: number; averageTime: number; maxTime: number }> = {};
    
    for (const [operation, budget] of Object.entries(this.performanceBudgets)) {
      const violations = this.budgetViolations.get(operation) || 0;
      const history = this.budgetHistory.get(operation) || [];
      const durations = history.map(violation => violation.duration);
      const averageTime = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
      const maxTime = durations.length > 0 ? Math.max(...durations) : 0;
      
      stats[operation] = {
        budget,
        violations,
        averageTime,
        maxTime
      };
    }
    
    return stats;
  }

  /**
   * Update performance budget for an operation
   */
  public updateBudget(operation: string, budgetMs: number): void {
    (this.performanceBudgets as any)[operation] = budgetMs;
    
    if (this.config.enableDebug) {
      console.log(`📊 [PerformanceAnalyzer] Updated budget for ${operation}: ${budgetMs}ms`);
    }
  }

  /**
   * Clear budget violation history
   */
  public clearBudgetHistory(): void {
    this.budgetViolations.clear();
    this.budgetHistory.clear();
  }

  // --- End of migrated methods ---

  public destroy(): void {
    this.stopMonitoring();
    
    // Clean up FPS counter
    if (this._fpsCounter) {
      this._fpsCounter.stop();
    }
    
    // Clean up long task observer
    if (this.longTaskObserver) {
      this.longTaskObserver.disconnect();
      this.longTaskObserver = null;
    }
    
    // Clear all data structures
    this.performanceHistory = [];
    this.metricsBuffer.clear();
    this.timedOperations.clear();
    this.clearPerformanceTimeline();
    this.resetBudgetTracking();
    
    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Destroyed and cleaned up.");
    }
  }

  /**
   * Lightweight, synchronous heuristic to decide whether the current device
   * should be treated as "low-end". This avoids the async overhead of
   * `DeviceCapabilityDetector` while still giving callers a fast gate for
   * performance-heavy logic.
   *
   * The heuristic intentionally stays conservative: we only mark devices as
   * low-end when *multiple* indicators point in that direction to minimise
   * false-positives on mid-tier hardware.
   */
  public static isLowEndDevice(): boolean {
    // Return cached result if already computed – this helper can be called on
    // every animation frame.
    if (this._isLowEndCache !== null) {
      return this._isLowEndCache;
    }

    try {
      const deviceMemory = (navigator as any).deviceMemory ?? 4; // GB
      const cpuCores = navigator.hardwareConcurrency ?? 4;

      // Basic thresholds: < 4 GB RAM OR ≤ 2 cores → potential low-end.
      const memoryFlag = deviceMemory < 4;
      const coreFlag = cpuCores <= 2;

      // Network information as a secondary signal (helps on mobile).
      const connection = (navigator as any).connection || {};
      const effectiveType = connection.effectiveType as string | undefined;
      const slowNetworkFlag = ["slow-2g", "2g"].includes(effectiveType ?? "");

      // Final decision – require at least one strong flag and one secondary flag
      // to avoid misclassifying decent devices with a single weak metric.
      const isLowEnd =
        (memoryFlag && coreFlag) || (memoryFlag && slowNetworkFlag);

      this._isLowEndCache = isLowEnd;
      return isLowEnd;
    } catch {
      // If detection fails (e.g., non-browser env), presume not low-end.
      this._isLowEndCache = false;
      return false;
    }
  }

  /**
   * Returns median FPS using the most recent N one-second samples (default 5).
   * Falls back to current FPS when insufficient samples.
   */
  public getMedianFPS(sampleWindowSeconds = 5): number {
    if (!this._fpsCounter) return 60;
    const hist = (this._fpsCounter as any).getHistory?.() || [];
    const samples = hist.slice(-sampleWindowSeconds);
    if (!samples.length) return this._fpsCounter.currentFPS || 60;
    const sorted = [...samples].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Capture a one-off 60 s (or custom) performance baseline and trigger a JSON
   * download so developers can commit the artefact under
   * `docs/perf-baselines/`.
   *
   * Example (DevTools):
   *   await year3000System.performanceAnalyzer.startBaselineCapture("Home");
   */
  public async startBaselineCapture(
    viewName = "unknown",
    durationMs = 60_000
  ): Promise<PerformanceMetrics[]> {
    if (!this.isMonitoring) {
      this.startMonitoring();
    }

    const start = Date.now();
    if (this.config.enableDebug) {
      console.log(
        `📊 [PerformanceAnalyzer] Baseline capture for "${viewName}" started`
      );
    }

    await new Promise((r) => setTimeout(r, durationMs));

    if (this.config.enableDebug) {
      console.log(
        `📊 [PerformanceAnalyzer] Baseline capture complete – ${
          this.performanceHistory.length
        } samples in ${(Date.now() - start) / 1_000}s`
      );
    }

    const artefact = {
      view: viewName,
      capturedAt: new Date().toISOString(),
      durationMs,
      samples: this.performanceHistory,
    };

    try {
      const blob = new Blob([JSON.stringify(artefact, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${viewName}_${new Date()
        .toISOString()
        .slice(0, 10)}_baseline.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5_000);
    } catch (err) {
      console.warn(
        "[PerformanceAnalyzer] Unable to trigger baseline download",
        err
      );
    }

    return [...this.performanceHistory];
  }

  // --- End of static helpers ---

  // ===================================================================
  // PERFORMANCE MARKS AND LONG TASK DETECTION
  // ===================================================================

  // Long task detection
  private longTaskObserver: PerformanceObserver | null = null;
  private longTasks: PerformanceEntry[] = [];
  private performanceMarks = new Map<string, number>();
  private performanceMeasures = new Map<string, { start: number; end: number; duration: number }>();

  /**
   * Initialize performance monitoring with marks and long task detection
   */
  public initializeAdvancedMonitoring(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      // Initialize long task observer
      this.longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          this.longTasks.push(entry);
          
          // Track long tasks that affect our performance budget
          if (entry.duration > 50) { // Tasks longer than 50ms are problematic
            this.trackBudget('longTask', entry.duration);
            
            if (this.config.enableDebug) {
              console.warn(`🐌 [PerformanceAnalyzer] Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        }
        
        // Keep only recent long tasks (last 30 seconds)
        const cutoff = performance.now() - 30000;
        this.longTasks = this.longTasks.filter(task => task.startTime > cutoff);
      });

      this.longTaskObserver.observe({ entryTypes: ['longtask'] });
      
      if (this.config.enableDebug) {
        console.log('📊 [PerformanceAnalyzer] Advanced monitoring initialized - long task detection active');
      }
    } catch (error) {
      console.warn('[PerformanceAnalyzer] Could not initialize long task observer:', error);
    }
  }

  /**
   * Mark the start of a performance-critical operation
   */
  public markStart(operation: string): void {
    const markName = `${operation}-start`;
    performance.mark(markName);
    this.performanceMarks.set(operation, performance.now());
    
    if (this.config.enableDebug) {
      console.log(`🎯 [PerformanceAnalyzer] Mark start: ${operation}`);
    }
  }

  /**
   * Mark the end of a performance-critical operation and measure duration
   */
  public markEnd(operation: string): number {
    const startTime = this.performanceMarks.get(operation);
    if (!startTime) {
      console.warn(`[PerformanceAnalyzer] No start mark found for operation: ${operation}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Create performance measure
    const startMarkName = `${operation}-start`;
    const endMarkName = `${operation}-end`;
    const measureName = `${operation}-duration`;
    
    try {
      performance.mark(endMarkName);
      performance.measure(measureName, startMarkName, endMarkName);
    } catch (error) {
      // Fallback if marks are not available
      if (this.config.enableDebug) {
        console.warn(`[PerformanceAnalyzer] Could not create measure for ${operation}:`, error);
      }
    }

    // Store measure data
    this.performanceMeasures.set(operation, {
      start: startTime,
      end: endTime,
      duration
    });

    // Track against budget
    this.trackBudget(operation, duration);

    // Clean up mark
    this.performanceMarks.delete(operation);

    if (this.config.enableDebug) {
      console.log(`🏁 [PerformanceAnalyzer] Mark end: ${operation} (${duration.toFixed(2)}ms)`);
    }

    return duration;
  }

  /**
   * Get recent long tasks that may be affecting performance
   */
  public getRecentLongTasks(timeframeMs: number = 10000): PerformanceEntry[] {
    const cutoff = performance.now() - timeframeMs;
    return this.longTasks.filter(task => task.startTime > cutoff);
  }

  /**
   * Get performance timeline with marks and measures
   */
  public getPerformanceTimeline(): {
    marks: Map<string, number>;
    measures: Map<string, { start: number; end: number; duration: number }>;
    longTasks: PerformanceEntry[];
  } {
    return {
      marks: new Map(this.performanceMarks),
      measures: new Map(this.performanceMeasures),
      longTasks: [...this.longTasks]
    };
  }

  /**
   * Create a performance timing wrapper for functions
   */
  public withTiming<T>(operation: string, fn: () => T): T {
    this.markStart(operation);
    try {
      const result = fn();
      return result;
    } finally {
      this.markEnd(operation);
    }
  }

  /**
   * Create a performance timing wrapper for async functions
   */
  public async withTimingAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    this.markStart(operation);
    try {
      const result = await fn();
      return result;
    } finally {
      this.markEnd(operation);
    }
  }

  /**
   * Get performance summary for debugging
   */
  public getPerformanceSummary(): {
    recentLongTasks: number;
    budgetViolations: Record<string, number>;
    currentQuality: string;
    averageFPS: number;
    memoryUsage: number;
  } {
    const recentLongTasks = this.getRecentLongTasks(5000).length;
    const budgetViolations: Record<string, number> = {};
    
    for (const [operation, count] of this.budgetViolations.entries()) {
      budgetViolations[operation] = count;
    }

    const memory = this._getMemoryMetrics();
    const fps = this._getFPSMetrics();

    return {
      recentLongTasks,
      budgetViolations,
      currentQuality: this.currentQualityLevel,
      averageFPS: fps.average,
      memoryUsage: memory.utilization
    };
  }

  /**
   * Clear performance timeline data
   */
  public clearPerformanceTimeline(): void {
    this.performanceMarks.clear();
    this.performanceMeasures.clear();
    this.longTasks = [];
    
    // Clear browser performance marks and measures
    try {
      performance.clearMarks();
      performance.clearMeasures();
    } catch (error) {
      // Ignore if not supported
    }
  }

  // ===================================================================
  // MEMORY MANAGEMENT AND CLEANUP
  // ===================================================================

  /**
   * Clean up old budget violation records to prevent memory leaks
   */
  private cleanupOldRecords(): void {
    const now = performance.now();
    if (now - this.lastCleanupTime < this.cleanupInterval) return;
    
    const cutoff = now - this.maxRecordAge;
    let totalRecordsRemoved = 0;
    
    for (const [operation, history] of this.budgetHistory.entries()) {
      const originalLength = history.length;
      const filteredHistory = history.filter(violation => violation.timestamp > cutoff);
      
      if (filteredHistory.length !== originalLength) {
        this.budgetHistory.set(operation, filteredHistory);
        totalRecordsRemoved += originalLength - filteredHistory.length;
      }
      
      // Remove empty entries
      if (filteredHistory.length === 0) {
        this.budgetHistory.delete(operation);
        this.budgetViolations.delete(operation);
      }
    }
    
    this.lastCleanupTime = now;
    
    if (this.config.enableDebug && totalRecordsRemoved > 0) {
      console.log(`[PerformanceAnalyzer] Cleaned up ${totalRecordsRemoved} old violation records`);
    }
  }

  /**
   * Detect potential infinite loops in quality changes
   */
  private detectInfiniteLoop(): boolean {
    const now = performance.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean up old quality change history
    this.qualityChangeHistory = this.qualityChangeHistory.filter(change => change.timestamp > oneMinuteAgo);
    
    // Check if we've exceeded the maximum quality changes per minute
    if (this.qualityChangeHistory.length >= this.maxQualityChangesPerMinute) {
      if (this.config.enableDebug) {
        console.error(`[PerformanceAnalyzer] INFINITE LOOP DETECTED: ${this.qualityChangeHistory.length} quality changes in the last minute. Disabling automatic quality adjustment.`);
        console.error('[PerformanceAnalyzer] Quality change history:', this.qualityChangeHistory);
      }
      
      // Disable quality reduction to prevent infinite loops
      this.qualityReductionEnabled = false;
      
      // Emit emergency event
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('performance:infinite-loop-detected', {
          detail: {
            changeCount: this.qualityChangeHistory.length,
            history: [...this.qualityChangeHistory],
            timestamp: Date.now()
          }
        }));
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Record quality change for infinite loop detection
   */
  private recordQualityChange(action: 'increase' | 'decrease', level: string): void {
    this.qualityChangeHistory.push({
      action,
      level,
      timestamp: performance.now()
    });
  }

  // ===================================================================
  // PERFORMANCE BUDGET AND QUALITY REDUCTION SYSTEM
  // ===================================================================

  /**
   * Track operation against performance budget
   */
  public trackBudget(operation: string, timeMs: number): void {
    const budget = this.performanceBudgets[operation as keyof typeof this.performanceBudgets];
    if (!budget) return;

    // Clean up old records periodically
    this.cleanupOldRecords();

    // Track violation
    if (timeMs > budget) {
      const violationCount = this.budgetViolations.get(operation) || 0;
      this.budgetViolations.set(operation, violationCount + 1);
      
      // Add to history with timestamp
      const history = this.budgetHistory.get(operation) || [];
      history.push({
        duration: timeMs,
        timestamp: performance.now()
      });
      if (history.length > 100) history.shift(); // Keep last 100 entries
      this.budgetHistory.set(operation, history);

      // Check if automatic quality reduction is needed
      if (this.qualityReductionEnabled) {
        this.checkQualityReduction(operation, timeMs, budget);
      }
    }
  }

  /**
   * Check if quality reduction is needed based on budget violations
   */
  private checkQualityReduction(operation: string, actualTime: number, budget: number): void {
    const violationRatio = actualTime / budget;
    const now = performance.now();
    
    // Don't reduce quality too frequently
    if (now - this.lastQualityReduction < 1000) return;

    let targetQuality: typeof this.currentQualityLevel | null = null;

    if (violationRatio > 3.0 && this.currentQualityLevel !== 'minimal') {
      // Major violation - reduce to minimal
      targetQuality = 'minimal';
    } else if (violationRatio > 2.0 && this.currentQualityLevel === 'ultra') {
      // Moderate violation - reduce from ultra
      targetQuality = 'high';
    } else if (violationRatio > 1.5 && ['ultra', 'high'].includes(this.currentQualityLevel)) {
      // Minor violation - reduce one level
      targetQuality = this.currentQualityLevel === 'ultra' ? 'high' : 'medium';
    }

    if (targetQuality && targetQuality !== this.currentQualityLevel) {
      this.reduceQuality(targetQuality, operation, violationRatio);
    }
  }

  /**
   * Reduce quality level and notify systems
   */
  private reduceQuality(newLevel: typeof this.currentQualityLevel, triggerOperation: string, violationRatio: number): void {
    const oldLevel = this.currentQualityLevel;
    this.currentQualityLevel = newLevel;
    this.lastQualityReduction = performance.now();
    
    // Reset recovery attempts when quality is reduced
    this.qualityRecoveryAttempts = 0;
    
    // Record quality change for infinite loop detection
    this.recordQualityChange('decrease', newLevel);

    // Emit quality reduction event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('performance:quality-reduced', {
        detail: {
          oldLevel,
          newLevel,
          triggerOperation,
          violationRatio,
          timestamp: Date.now()
        }
      }));
    }

    if (this.config.enableDebug) {
      console.warn(`[PerformanceAnalyzer] Quality reduced: ${oldLevel} → ${newLevel} (${triggerOperation}: ${violationRatio.toFixed(2)}x budget)`);
    }
  }

  /**
   * Attempt to recover quality if performance has improved
   */
  public checkQualityRecovery(): void {
    const now = performance.now();
    
    // Check for infinite loop before doing anything
    if (this.detectInfiniteLoop()) {
      return;
    }
    
    // Multiple safeguards to prevent infinite loops
    if (now - this.lastQualityReduction < this.qualityRecoveryDelay) return;
    if (now - this.lastQualityIncrease < this.qualityIncreaseDelay) return;
    if (this.currentQualityLevel === 'ultra') {
      // Reset recovery attempts when at max quality
      this.qualityRecoveryAttempts = 0;
      return;
    }
    
    // Exponential backoff for recovery attempts
    if (this.qualityRecoveryAttempts >= this.maxQualityRecoveryAttempts) {
      const backoffDelay = this.qualityIncreaseDelay * Math.pow(2, this.qualityRecoveryAttempts - this.maxQualityRecoveryAttempts);
      if (now - this.lastQualityIncrease < backoffDelay) {
        if (this.config.enableDebug) {
          console.log(`[PerformanceAnalyzer] Quality recovery in backoff mode. Next attempt in ${(backoffDelay - (now - this.lastQualityIncrease)).toFixed(0)}ms`);
        }
        return;
      }
    }

    // Check recent performance
    const recentViolations = this.getRecentBudgetViolations(2000); // Last 2 seconds
    const violationCount = Array.from(recentViolations.values()).reduce((sum, count) => sum + count, 0);

    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Quality recovery check: ${violationCount} recent violations, attempt ${this.qualityRecoveryAttempts + 1}/${this.maxQualityRecoveryAttempts}`);
    }

    // If no recent violations, try to increase quality
    if (violationCount === 0) {
      const newLevel = this.getNextQualityLevel(this.currentQualityLevel);
      if (newLevel !== this.currentQualityLevel) {
        this.qualityRecoveryAttempts++;
        this.increaseQuality(newLevel);
      }
    } else {
      // Reset recovery attempts if violations are still occurring
      this.qualityRecoveryAttempts = 0;
    }
  }

  /**
   * Get recent budget violations within timeframe
   */
  private getRecentBudgetViolations(timeframeMs: number): Map<string, number> {
    const cutoff = performance.now() - timeframeMs;
    const recentViolations = new Map<string, number>();

    for (const [operation, history] of this.budgetHistory.entries()) {
      // Filter by timestamp, not duration
      const recentCount = history.filter(violation => violation.timestamp > cutoff).length;
      if (recentCount > 0) {
        recentViolations.set(operation, recentCount);
      }
    }

    return recentViolations;
  }

  /**
   * Get next higher quality level
   */
  private getNextQualityLevel(current: typeof this.currentQualityLevel): typeof this.currentQualityLevel {
    const levels: Array<typeof this.currentQualityLevel> = ['minimal', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = levels.indexOf(current);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1]! : current;
  }

  /**
   * Increase quality level
   */
  private increaseQuality(newLevel: typeof this.currentQualityLevel): void {
    const oldLevel = this.currentQualityLevel;
    this.currentQualityLevel = newLevel;
    this.lastQualityIncrease = performance.now();

    // Reset recovery attempts on successful upgrade
    if (newLevel === 'ultra') {
      this.qualityRecoveryAttempts = 0;
    }
    
    // Record quality change for infinite loop detection
    this.recordQualityChange('increase', newLevel);

    // Emit quality increase event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('performance:quality-increased', {
        detail: {
          oldLevel,
          newLevel,
          recoveryAttempt: this.qualityRecoveryAttempts,
          timestamp: Date.now()
        }
      }));
    }

    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Quality increased: ${oldLevel} → ${newLevel} (attempt ${this.qualityRecoveryAttempts})`);
    }
  }

  /**
   * Get current quality level
   */
  public getCurrentQualityLevel(): typeof this.currentQualityLevel {
    return this.currentQualityLevel;
  }

  /**
   * Get budget violation summary
   */
  public getBudgetViolationSummary(): Map<string, number> {
    return new Map(this.budgetViolations);
  }

  /**
   * Reset budget tracking
   */
  public resetBudgetTracking(): void {
    this.budgetViolations.clear();
    this.budgetHistory.clear();
    this.lastCleanupTime = 0;
    this.qualityRecoveryAttempts = 0;
  }

  /**
   * Configure quality reduction system
   */
  public configureQualityReduction(enabled: boolean, thresholds?: Partial<typeof this.qualityReductionThresholds>): void {
    this.qualityReductionEnabled = enabled;
    if (thresholds) {
      this.qualityReductionThresholds = { ...this.qualityReductionThresholds, ...thresholds };
    }
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Quality reduction ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Reset quality system after fixing infinite loop issues
   */
  public resetQualitySystem(): void {
    this.qualityChangeHistory = [];
    this.qualityRecoveryAttempts = 0;
    this.lastQualityReduction = 0;
    this.lastQualityIncrease = 0;
    this.qualityReductionEnabled = true;
    this.currentQualityLevel = 'high'; // Reset to default
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Quality system reset - infinite loop protection cleared');
    }
  }
}
