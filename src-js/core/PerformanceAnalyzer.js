// ===================================================================
// 📊 PERFORMANCE ANALYZER - Year 3000 Performance System
// ===================================================================
// Advanced performance analysis and health metrics generation
// Provides comprehensive system monitoring and optimization recommendations

export class PerformanceAnalyzer {
  constructor(config = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      monitoringInterval: config.monitoringInterval || 5000, // 5 seconds
      retentionPeriod: config.retentionPeriod || 300000, // 5 minutes
      ...config,
    };

    this.performanceHistory = [];
    this.metricsBuffer = new Map();
    this.isMonitoring = false;
    this.monitoringTimer = null;

    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Initialized");
    }
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitoringTimer = setInterval(() => {
      this._collectPerformanceMetrics();
    }, this.config.monitoringInterval);

    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Monitoring started");
    }
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }

    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Monitoring stopped");
    }
  }

  /**
   * Collect current performance metrics
   */
  _collectPerformanceMetrics() {
    const timestamp = performance.now();

    const metrics = {
      timestamp,
      memory: this._getMemoryMetrics(),
      timing: this._getTimingMetrics(),
      fps: this._getFPSMetrics(),
      dom: this._getDOMMetrics(),
      network: this._getNetworkMetrics(),
    };

    // Add to history
    this.performanceHistory.push(metrics);

    // Clean old metrics (retention period)
    const cutoff = timestamp - this.config.retentionPeriod;
    this.performanceHistory = this.performanceHistory.filter(
      (metric) => metric.timestamp > cutoff
    );

    // Store in buffer for analysis
    this.metricsBuffer.set(timestamp, metrics);

    // Clean old buffer entries
    for (const [key] of this.metricsBuffer) {
      if (key < cutoff) {
        this.metricsBuffer.delete(key);
      }
    }
  }

  /**
   * Get memory performance metrics
   */
  _getMemoryMetrics() {
    const memoryInfo = performance.memory || {};

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

  /**
   * Get timing performance metrics
   */
  _getTimingMetrics() {
    const navigation = performance.getEntriesByType("navigation")[0] || {};

    return {
      domContentLoaded: navigation.domContentLoadedEventEnd || 0,
      loadComplete: navigation.loadEventEnd || 0,
      firstPaint: this._getFirstPaint(),
      firstContentfulPaint: this._getFirstContentfulPaint(),
      largestContentfulPaint: this._getLargestContentfulPaint(),
    };
  }

  /**
   * Get FPS metrics using requestAnimationFrame
   */
  _getFPSMetrics() {
    // Use a simple FPS counter if available
    if (this._fpsCounter) {
      return {
        current: this._fpsCounter.currentFPS,
        average: this._fpsCounter.averageFPS,
        min: this._fpsCounter.minFPS,
        max: this._fpsCounter.maxFPS,
      };
    }

    return {
      current: 0,
      average: 0,
      min: 0,
      max: 0,
    };
  }

  /**
   * Get DOM performance metrics
   */
  _getDOMMetrics() {
    return {
      elements: document.querySelectorAll("*").length,
      styleSheets: document.styleSheets.length,
      images: document.images.length,
      scripts: document.scripts.length,
      links: document.links.length,
    };
  }

  /**
   * Get network performance metrics
   */
  _getNetworkMetrics() {
    const connection = navigator.connection || {};

    return {
      effectiveType: connection.effectiveType || "unknown",
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
      saveData: connection.saveData || false,
    };
  }

  /**
   * Get First Paint timing
   */
  _getFirstPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint"
    );
    return firstPaint ? firstPaint.startTime : 0;
  }

  /**
   * Get First Contentful Paint timing
   */
  _getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint"
    );
    return fcp ? fcp.startTime : 0;
  }

  /**
   * Get Largest Contentful Paint timing
   */
  _getLargestContentfulPaint() {
    const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
    return lcpEntries.length > 0
      ? lcpEntries[lcpEntries.length - 1].startTime
      : 0;
  }

  /**
   * Analyze component performance
   * @param {string} componentName - Name of the component to analyze
   * @param {Object} component - Component instance
   * @returns {Object} Performance analysis result
   */
  analyzeComponent(componentName, component) {
    const analysis = {
      name: componentName,
      status: "unknown",
      performance: "unknown",
      memory: "unknown",
      recommendations: [],
      metrics: {},
    };

    try {
      // Check if component exists and is functional
      if (!component) {
        analysis.status = "missing";
        analysis.recommendations.push("Component not initialized");
        return analysis;
      }

      analysis.status = "active";

      // Analyze component memory usage if possible
      if (component.getPerformanceReport) {
        const report = component.getPerformanceReport();
        analysis.metrics = report;

        // Analyze performance based on component-specific metrics
        analysis.performance = this._analyzeComponentPerformance(report);
        analysis.memory = this._analyzeComponentMemory(report);
        analysis.recommendations =
          this._generateComponentRecommendations(report);
      } else if (component.getMemoryUsage) {
        const memoryUsage = component.getMemoryUsage();
        analysis.memory = memoryUsage > 50 * 1024 * 1024 ? "high" : "normal"; // 50MB threshold
      }

      // Check for common component methods
      const hasUpdate = typeof component.update === "function";
      const hasDestroy = typeof component.destroy === "function";
      const hasReset = typeof component.reset === "function";

      analysis.capabilities = {
        updatable: hasUpdate,
        destroyable: hasDestroy,
        resettable: hasReset,
      };

      // Performance estimation based on capabilities
      if (!hasUpdate && !hasDestroy) {
        analysis.recommendations.push(
          "Consider implementing update() and destroy() methods"
        );
      }
    } catch (error) {
      analysis.status = "error";
      analysis.error = error.message;
      analysis.recommendations.push("Component threw error during analysis");
    }

    return analysis;
  }

  /**
   * Analyze component performance from report
   */
  _analyzeComponentPerformance(report) {
    if (report.averageExecutionTime) {
      if (report.averageExecutionTime > 16) return "poor";
      if (report.averageExecutionTime > 8) return "fair";
      return "good";
    }

    if (report.performance) {
      return report.performance.rating || "unknown";
    }

    return "unknown";
  }

  /**
   * Analyze component memory usage from report
   */
  _analyzeComponentMemory(report) {
    if (report.memoryUsage) {
      const usage = report.memoryUsage;
      if (usage > 100 * 1024 * 1024) return "high"; // 100MB
      if (usage > 50 * 1024 * 1024) return "medium"; // 50MB
      return "low";
    }

    if (report.memory) {
      return report.memory.level || "unknown";
    }

    return "unknown";
  }

  /**
   * Generate recommendations for component optimization
   */
  _generateComponentRecommendations(report) {
    const recommendations = [];

    if (report.averageExecutionTime > 16) {
      recommendations.push(
        "Optimize component update cycle - execution time too high"
      );
    }

    if (report.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push(
        "Consider memory optimization - high memory usage detected"
      );
    }

    if (report.errorCount > 0) {
      recommendations.push(
        `Fix component errors - ${report.errorCount} errors detected`
      );
    }

    if (report.performance?.efficiency === "poor") {
      recommendations.push(
        "Review component efficiency - poor performance detected"
      );
    }

    if (report.recommendations) {
      recommendations.push(
        ...report.recommendations.map((rec) => rec.message || rec)
      );
    }

    return recommendations;
  }

  /**
   * Generate comprehensive health report
   * @param {Object} systems - Object containing all system components
   * @returns {Object} Complete health analysis
   */
  generateHealthReport(systems = {}) {
    const report = {
      timestamp: Date.now(),
      overall: "unknown",
      performance: this._getOverallPerformance(),
      memory: this._getMemoryAnalysis(),
      components: {},
      recommendations: [],
      metrics: this._getSystemMetrics(),
    };

    // Analyze each component
    Object.entries(systems).forEach(([name, component]) => {
      if (component && name !== "config") {
        report.components[name] = this.analyzeComponent(name, component);
      }
    });

    // Calculate overall system health
    report.overall = this._calculateOverallHealth(report.components);

    // Generate system-wide recommendations
    report.recommendations = this._generateSystemRecommendations(report);

    return report;
  }

  /**
   * Get overall performance analysis
   */
  _getOverallPerformance() {
    if (this.performanceHistory.length < 2) {
      return {
        status: "insufficient_data",
        message: "Need more performance data",
      };
    }

    const recent = this.performanceHistory.slice(-5); // Last 5 measurements
    const averageMemoryUsage =
      recent.reduce((sum, m) => sum + m.memory.utilization, 0) / recent.length;
    const averageFPS =
      recent.reduce((sum, m) => sum + (m.fps.current || 0), 0) / recent.length;

    let status = "good";
    const issues = [];

    if (averageMemoryUsage > 80) {
      status = "poor";
      issues.push("High memory usage");
    } else if (averageMemoryUsage > 60) {
      status = "fair";
      issues.push("Elevated memory usage");
    }

    if (averageFPS > 0 && averageFPS < 30) {
      status = "poor";
      issues.push("Low frame rate");
    } else if (averageFPS > 0 && averageFPS < 45) {
      status = status === "good" ? "fair" : status;
      issues.push("Reduced frame rate");
    }

    return {
      status,
      averageMemoryUsage: Math.round(averageMemoryUsage),
      averageFPS: Math.round(averageFPS),
      issues,
    };
  }

  /**
   * Get memory analysis
   */
  _getMemoryAnalysis() {
    if (this.performanceHistory.length === 0) {
      return { status: "no_data" };
    }

    const latest = this.performanceHistory[this.performanceHistory.length - 1];
    const memory = latest.memory;

    return {
      current: {
        used: Math.round(memory.used / 1024 / 1024), // MB
        total: Math.round(memory.total / 1024 / 1024), // MB
        utilization: Math.round(memory.utilization),
      },
      trend: this._getMemoryTrend(),
      status:
        memory.utilization > 80
          ? "critical"
          : memory.utilization > 60
          ? "warning"
          : "good",
    };
  }

  /**
   * Get memory usage trend
   */
  _getMemoryTrend() {
    if (this.performanceHistory.length < 3) {
      return "unknown";
    }

    const recent = this.performanceHistory.slice(-3);
    const utilizationTrend = recent.map((m) => m.memory.utilization);

    const isIncreasing =
      utilizationTrend[2] > utilizationTrend[1] &&
      utilizationTrend[1] > utilizationTrend[0];
    const isDecreasing =
      utilizationTrend[2] < utilizationTrend[1] &&
      utilizationTrend[1] < utilizationTrend[0];

    if (isIncreasing) return "increasing";
    if (isDecreasing) return "decreasing";
    return "stable";
  }

  /**
   * Get system-wide metrics
   */
  _getSystemMetrics() {
    const latest = this.performanceHistory[this.performanceHistory.length - 1];

    if (!latest) {
      return { status: "no_data" };
    }

    return {
      performance: {
        fps: latest.fps,
        timing: latest.timing,
      },
      memory: latest.memory,
      dom: latest.dom,
      network: latest.network,
      timestamp: latest.timestamp,
    };
  }

  /**
   * Calculate overall system health
   */
  _calculateOverallHealth(components) {
    const componentStates = Object.values(components);

    if (componentStates.length === 0) {
      return "unknown";
    }

    const errorComponents = componentStates.filter(
      (c) => c.status === "error"
    ).length;
    const missingComponents = componentStates.filter(
      (c) => c.status === "missing"
    ).length;
    const poorPerformance = componentStates.filter(
      (c) => c.performance === "poor"
    ).length;

    const totalComponents = componentStates.length;
    const healthyRatio =
      (totalComponents - errorComponents - missingComponents) / totalComponents;

    if (errorComponents > 0 || missingComponents > totalComponents * 0.3) {
      return "critical";
    }

    if (poorPerformance > totalComponents * 0.5 || healthyRatio < 0.7) {
      return "warning";
    }

    if (healthyRatio > 0.9 && poorPerformance === 0) {
      return "excellent";
    }

    return "good";
  }

  /**
   * Generate system-wide recommendations
   */
  _generateSystemRecommendations(report) {
    const recommendations = [];

    // Performance recommendations
    if (report.performance.status === "poor") {
      recommendations.push({
        type: "performance",
        priority: "high",
        message: "System performance is poor",
        actions: [
          "Consider enabling performance mode",
          "Reduce visual effect intensity",
        ],
      });
    }

    // Memory recommendations
    if (report.memory.status === "critical") {
      recommendations.push({
        type: "memory",
        priority: "critical",
        message: "Critical memory usage detected",
        actions: [
          "Enable aggressive cleanup",
          "Restart components",
          "Reduce memory-intensive features",
        ],
      });
    }

    // Component recommendations
    const errorComponents = Object.entries(report.components)
      .filter(([, component]) => component.status === "error")
      .map(([name]) => name);

    if (errorComponents.length > 0) {
      recommendations.push({
        type: "components",
        priority: "high",
        message: `Component errors detected: ${errorComponents.join(", ")}`,
        actions: ["Review component logs", "Restart affected components"],
      });
    }

    return recommendations;
  }

  /**
   * Get performance history
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Performance history
   */
  getPerformanceHistory(limit = 100) {
    return this.performanceHistory.slice(-limit);
  }

  /**
   * Clear performance history
   */
  clearHistory() {
    this.performanceHistory = [];
    this.metricsBuffer.clear();

    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] History cleared");
    }
  }

  /**
   * Initialize FPS counter
   */
  initializeFPSCounter() {
    this._fpsCounter = {
      frames: 0,
      startTime: performance.now(),
      lastFrameTime: performance.now(),
      currentFPS: 0,
      averageFPS: 0,
      minFPS: Infinity,
      maxFPS: 0,
      frameHistory: [],
    };

    const updateFPS = () => {
      const now = performance.now();
      const deltaTime = now - this._fpsCounter.lastFrameTime;
      this._fpsCounter.lastFrameTime = now;
      this._fpsCounter.frames++;

      if (deltaTime > 0) {
        this._fpsCounter.currentFPS = 1000 / deltaTime;
        this._fpsCounter.frameHistory.push(this._fpsCounter.currentFPS);

        // Keep only last 60 frames
        if (this._fpsCounter.frameHistory.length > 60) {
          this._fpsCounter.frameHistory =
            this._fpsCounter.frameHistory.slice(-60);
        }

        // Calculate statistics
        this._fpsCounter.averageFPS =
          this._fpsCounter.frameHistory.reduce((a, b) => a + b, 0) /
          this._fpsCounter.frameHistory.length;
        this._fpsCounter.minFPS = Math.min(
          this._fpsCounter.minFPS,
          this._fpsCounter.currentFPS
        );
        this._fpsCounter.maxFPS = Math.max(
          this._fpsCounter.maxFPS,
          this._fpsCounter.currentFPS
        );
      }

      requestAnimationFrame(updateFPS);
    };

    requestAnimationFrame(updateFPS);
  }

  /**
   * Clean up and destroy the analyzer
   */
  destroy() {
    this.stopMonitoring();
    this.clearHistory();
    this._fpsCounter = null;

    if (this.config.enableDebug) {
      console.log("📊 [PerformanceAnalyzer] Destroyed");
    }
  }
}
