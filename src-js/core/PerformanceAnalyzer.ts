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

  constructor(config: Partial<AnalyzerConfig> = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      monitoringInterval: config.monitoringInterval || 5000,
      retentionPeriod: config.retentionPeriod || 300000,
      ...config,
    };

    try {
      this._fpsCounter = new FPSCounter();
      this.initialized = true;
      if (this.config.enableDebug) {
        console.log("📊 [PerformanceAnalyzer] Initialized successfully.");
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

  // --- End of migrated methods ---

  public destroy(): void {
    this.stopMonitoring();
    if (this._fpsCounter) {
      this._fpsCounter.stop();
    }
    this.performanceHistory = [];
    this.metricsBuffer.clear();
    this.timedOperations.clear();
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
}
