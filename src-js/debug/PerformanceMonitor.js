// src-js/core/PerformanceMonitor.js
// No direct imports needed for YEAR3000_CONFIG or Year3000Utilities based on the current class structure.
// If YEAR3000_CONFIG.enableDebug is needed for logging, it would be imported.

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      colorExtractionTime: [],
      memoryUsage: [], // This seems aspirational in the original, detectMemoryPressure uses performance.memory
      frameRate: [], // This also seems aspirational, not directly calculated in the provided snippet
    };
    // The original constructor also had this.lastFrameTime and this.frameCount, which are not used by other methods shown.
    // I'll include them for completeness from the original structure but they might be vestigial.
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    // Note: The constructor in the latest theme.js is simpler than some earlier stubs.
    // It doesn't use YEAR3000_CONFIG.performanceMonitor or Year3000Utilities.throttle directly in its constructor.
  }

  startTiming(operation) {
    return performance.now();
  }

  endTiming(operation, startTime) {
    const duration = performance.now() - startTime;
    if (this.metrics[operation]) {
      this.metrics[operation].push(duration);
      // Keep only last 10 measurements
      if (this.metrics[operation].length > 10) {
        this.metrics[operation].shift();
      }
    }
    return duration;
  }

  getAverageTime(operation) {
    const times = this.metrics[operation] || [];
    return times.length > 0
      ? times.reduce((a, b) => a + b, 0) / times.length
      : 0;
  }

  logMetrics() {
    // Consider importing YEAR3000_CONFIG here if conditional logging is desired.
    // For now, follows the original's direct console.log
    console.log("StarryNight Performance Metrics:", {
      avgColorExtraction: `${this.getAverageTime("colorExtractionTime").toFixed(
        2
      )}ms`,
      memoryPressure: this.detectMemoryPressure(),
      // avgFrameRate: this.getAverageTime("frameRate").toFixed(2) + "fps", // If frameRate was tracked
    });
  }

  detectMemoryPressure() {
    // Simple memory pressure detection
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      return used / total > 0.8 ? "high" : "normal"; // Threshold can be configured
    }
    return "unknown";
  }

  shouldReduceQuality() {
    // Auto-reduce quality if performance is poor
    // Thresholds can be configured (e.g., via YEAR3000_CONFIG if integrated later)
    return (
      this.getAverageTime("colorExtractionTime") > 300 || // Example threshold
      this.detectMemoryPressure() === "high"
    );
  }
}
