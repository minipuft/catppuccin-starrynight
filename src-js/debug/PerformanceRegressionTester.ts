/**
 * PerformanceRegressionTester - Automated performance validation
 * 
 * Provides automated testing for visual system performance to catch
 * regressions before they impact users. Integrates with CI/CD pipelines
 * to ensure performance standards are maintained.
 * 
 * @architecture Year3000System
 * @performance Target: 60fps, <50MB memory, <10% CPU
 * @testing Automated regression detection with configurable thresholds
 */

export interface PerformanceBaseline {
  fps: {
    min: number;
    avg: number;
    p95: number;
  };
  memory: {
    heap: number;      // MB
    dom: number;       // MB
    gpu?: number;      // MB (if available)
  };
  cpu: {
    average: number;   // Percentage
    peak: number;      // Percentage
  };
  frameTime: {
    avg: number;       // ms
    p95: number;       // ms
    p99: number;       // ms
  };
  loadTime: {
    initialization: number; // ms
    firstFrame: number;     // ms
    fullLoad: number;       // ms
  };
}

export interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  duration: number;        // ms
  baseline: PerformanceBaseline;
  tolerance: {
    fps: number;           // Allowed degradation %
    memory: number;        // Allowed increase %
    cpu: number;           // Allowed increase %
    frameTime: number;     // Allowed increase %
  };
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
  actions?: Array<{
    delay: number;         // ms from test start
    action: () => Promise<void>;
    description: string;
  }>;
}

export interface PerformanceResults {
  testId: string;
  timestamp: number;
  passed: boolean;
  metrics: PerformanceBaseline;
  regressions: Array<{
    metric: string;
    baseline: number;
    actual: number;
    degradation: number;   // Percentage
    severity: 'minor' | 'major' | 'critical';
  }>;
  improvements: Array<{
    metric: string;
    baseline: number;
    actual: number;
    improvement: number;   // Percentage
  }>;
  rawData: {
    frameTimings: number[];
    memorySnapshots: Array<{
      timestamp: number;
      heap: number;
      dom: number;
    }>;
    cpuSnapshots: Array<{
      timestamp: number;
      usage: number;
    }>;
  };
}

export interface TestConfig {
  enableGPUMemoryTracking: boolean;
  enableCPUTracking: boolean;
  sampleInterval: number;    // ms
  warmupDuration: number;    // ms
  collectGCStats: boolean;
  screenshotOnFailure: boolean;
  autoRetry: boolean;
  retryCount: number;
}

/**
 * Performance regression testing system
 */
export class PerformanceRegressionTester {
  private tests: Map<string, PerformanceTest> = new Map();
  private results: PerformanceResults[] = [];
  private config: TestConfig;
  
  private isRunning = false;
  private currentTest: PerformanceTest | null = null;
  private testStartTime = 0;
  private frameTimings: number[] = [];
  private memorySnapshots: Array<{ timestamp: number; heap: number; dom: number; }> = [];
  private cpuSnapshots: Array<{ timestamp: number; usage: number; }> = [];
  
  private performanceObserver: PerformanceObserver | null = null;
  private samplingInterval: number | null = null;
  private rafHandle: number | null = null;
  
  constructor(config: Partial<TestConfig> = {}) {\n    this.config = {\n      enableGPUMemoryTracking: true,\n      enableCPUTracking: true,\n      sampleInterval: 100,      // Sample every 100ms\n      warmupDuration: 1000,     // 1 second warmup\n      collectGCStats: true,\n      screenshotOnFailure: true,\n      autoRetry: true,\n      retryCount: 3,\n      ...config\n    };\n    \n    this.setupPerformanceObserver();\n    \n    console.log('[PerformanceRegressionTester] Initialized', this.config);\n  }\n  \n  /**\n   * Register a performance test\n   */\n  registerTest(test: PerformanceTest): void {\n    this.tests.set(test.id, test);\n    console.log(`[PerformanceRegressionTester] Registered test: ${test.id}`);\n  }\n  \n  /**\n   * Run a specific performance test\n   */\n  async runTest(testId: string): Promise<PerformanceResults> {\n    const test = this.tests.get(testId);\n    if (!test) {\n      throw new Error(`Test not found: ${testId}`);\n    }\n    \n    if (this.isRunning) {\n      throw new Error('A test is already running');\n    }\n    \n    console.log(`[PerformanceRegressionTester] Starting test: ${test.name}`);\n    \n    let attempt = 0;\n    let lastError: Error | null = null;\n    \n    while (attempt <= this.config.retryCount) {\n      try {\n        const result = await this.executeTest(test);\n        \n        // Store result\n        this.results.push(result);\n        \n        console.log(`[PerformanceRegressionTester] Test completed: ${test.id}`, {\n          passed: result.passed,\n          regressions: result.regressions.length,\n          improvements: result.improvements.length\n        });\n        \n        return result;\n        \n      } catch (error) {\n        lastError = error as Error;\n        attempt++;\n        \n        if (attempt <= this.config.retryCount && this.config.autoRetry) {\n          console.warn(`[PerformanceRegressionTester] Test failed (attempt ${attempt}), retrying:`, error);\n          await this.delay(1000); // Wait 1 second before retry\n        } else {\n          throw lastError;\n        }\n      }\n    }\n    \n    throw lastError || new Error('Test failed after all retries');\n  }\n  \n  /**\n   * Run all registered tests\n   */\n  async runAllTests(): Promise<PerformanceResults[]> {\n    const results: PerformanceResults[] = [];\n    \n    for (const [testId, test] of this.tests) {\n      try {\n        const result = await this.runTest(testId);\n        results.push(result);\n      } catch (error) {\n        console.error(`[PerformanceRegressionTester] Test failed: ${testId}`, error);\n        \n        // Create failed result\n        results.push({\n          testId,\n          timestamp: Date.now(),\n          passed: false,\n          metrics: this.createEmptyMetrics(),\n          regressions: [],\n          improvements: [],\n          rawData: {\n            frameTimings: [],\n            memorySnapshots: [],\n            cpuSnapshots: []\n          }\n        });\n      }\n    }\n    \n    return results;\n  }\n  \n  /**\n   * Get test results for analysis\n   */\n  getResults(testId?: string): PerformanceResults[] {\n    if (testId) {\n      return this.results.filter(r => r.testId === testId);\n    }\n    return [...this.results];\n  }\n  \n  /**\n   * Get summary of all test results\n   */\n  getSummary(): {\n    totalTests: number;\n    passedTests: number;\n    failedTests: number;\n    totalRegressions: number;\n    criticalRegressions: number;\n    averagePerformance: {\n      fps: number;\n      memory: number;\n      cpu: number;\n    };\n  } {\n    const recentResults = this.getRecentResults();\n    \n    const totalTests = recentResults.length;\n    const passedTests = recentResults.filter(r => r.passed).length;\n    const failedTests = totalTests - passedTests;\n    \n    const totalRegressions = recentResults.reduce((sum, r) => sum + r.regressions.length, 0);\n    const criticalRegressions = recentResults.reduce(\n      (sum, r) => sum + r.regressions.filter(reg => reg.severity === 'critical').length,\n      0\n    );\n    \n    const avgFps = recentResults.reduce((sum, r) => sum + r.metrics.fps.avg, 0) / totalTests || 0;\n    const avgMemory = recentResults.reduce((sum, r) => sum + r.metrics.memory.heap, 0) / totalTests || 0;\n    const avgCpu = recentResults.reduce((sum, r) => sum + r.metrics.cpu.average, 0) / totalTests || 0;\n    \n    return {\n      totalTests,\n      passedTests,\n      failedTests,\n      totalRegressions,\n      criticalRegressions,\n      averagePerformance: {\n        fps: Math.round(avgFps * 10) / 10,\n        memory: Math.round(avgMemory * 10) / 10,\n        cpu: Math.round(avgCpu * 10) / 10\n      }\n    };\n  }\n  \n  /**\n   * Clear old test results\n   */\n  clearResults(olderThanMs?: number): void {\n    const cutoff = Date.now() - (olderThanMs || 24 * 60 * 60 * 1000); // Default 24 hours\n    this.results = this.results.filter(r => r.timestamp > cutoff);\n    \n    console.log(`[PerformanceRegressionTester] Cleared old results (${this.results.length} remaining)`);\n  }\n  \n  /**\n   * Export results for CI/CD integration\n   */\n  exportResults(format: 'json' | 'junit' | 'markdown' = 'json'): string {\n    const summary = this.getSummary();\n    const recentResults = this.getRecentResults();\n    \n    switch (format) {\n      case 'json':\n        return JSON.stringify({\n          summary,\n          results: recentResults,\n          timestamp: Date.now()\n        }, null, 2);\n        \n      case 'junit':\n        return this.generateJUnitXML(recentResults);\n        \n      case 'markdown':\n        return this.generateMarkdownReport(summary, recentResults);\n        \n      default:\n        throw new Error(`Unsupported format: ${format}`);\n    }\n  }\n  \n  // ========================================================================\n  // PRIVATE METHODS\n  // ========================================================================\n  \n  private async executeTest(test: PerformanceTest): Promise<PerformanceResults> {\n    this.isRunning = true;\n    this.currentTest = test;\n    this.resetMetrics();\n    \n    try {\n      // Setup\n      if (test.setup) {\n        await test.setup();\n      }\n      \n      // Warmup period\n      await this.delay(this.config.warmupDuration);\n      \n      // Start monitoring\n      this.startMonitoring();\n      this.testStartTime = performance.now();\n      \n      // Execute test actions\n      if (test.actions) {\n        for (const action of test.actions) {\n          await this.delay(action.delay);\n          await action.action();\n        }\n      }\n      \n      // Run for test duration\n      const remainingTime = test.duration - (performance.now() - this.testStartTime);\n      if (remainingTime > 0) {\n        await this.delay(remainingTime);\n      }\n      \n      // Stop monitoring\n      this.stopMonitoring();\n      \n      // Analyze results\n      const metrics = this.calculateMetrics();\n      const regressions = this.detectRegressions(test.baseline, metrics, test.tolerance);\n      const improvements = this.detectImprovements(test.baseline, metrics);\n      \n      const result: PerformanceResults = {\n        testId: test.id,\n        timestamp: Date.now(),\n        passed: regressions.filter(r => r.severity !== 'minor').length === 0,\n        metrics,\n        regressions,\n        improvements,\n        rawData: {\n          frameTimings: [...this.frameTimings],\n          memorySnapshots: [...this.memorySnapshots],\n          cpuSnapshots: [...this.cpuSnapshots]\n        }\n      };\n      \n      return result;\n      \n    } finally {\n      // Cleanup\n      this.stopMonitoring();\n      \n      if (test.teardown) {\n        try {\n          await test.teardown();\n        } catch (error) {\n          console.error('[PerformanceRegressionTester] Teardown failed:', error);\n        }\n      }\n      \n      this.isRunning = false;\n      this.currentTest = null;\n    }\n  }\n  \n  private setupPerformanceObserver(): void {\n    if (!('PerformanceObserver' in window)) {\n      console.warn('[PerformanceRegressionTester] PerformanceObserver not available');\n      return;\n    }\n    \n    this.performanceObserver = new PerformanceObserver((list) => {\n      const entries = list.getEntries();\n      \n      for (const entry of entries) {\n        if (entry.entryType === 'measure' || entry.entryType === 'navigation') {\n          // Process performance entries\n          if (this.isRunning) {\n            this.frameTimings.push(entry.duration);\n          }\n        }\n      }\n    });\n    \n    try {\n      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });\n    } catch (error) {\n      console.warn('[PerformanceRegressionTester] PerformanceObserver setup failed:', error);\n    }\n  }\n  \n  private startMonitoring(): void {\n    // Start frame timing collection\n    const collectFrameTiming = () => {\n      if (!this.isRunning) return;\n      \n      const frameStart = performance.now();\n      \n      requestAnimationFrame(() => {\n        const frameTime = performance.now() - frameStart;\n        this.frameTimings.push(frameTime);\n        \n        collectFrameTiming();\n      });\n    };\n    \n    collectFrameTiming();\n    \n    // Start memory and CPU sampling\n    this.samplingInterval = window.setInterval(() => {\n      if (!this.isRunning) return;\n      \n      const timestamp = performance.now() - this.testStartTime;\n      \n      // Memory snapshot\n      if ('memory' in performance) {\n        const memory = (performance as any).memory;\n        this.memorySnapshots.push({\n          timestamp,\n          heap: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB\n          dom: this.estimateDOMMemory()\n        });\n      }\n      \n      // CPU usage (approximation)\n      if (this.config.enableCPUTracking) {\n        this.cpuSnapshots.push({\n          timestamp,\n          usage: this.estimateCPUUsage()\n        });\n      }\n    }, this.config.sampleInterval);\n  }\n  \n  private stopMonitoring(): void {\n    if (this.samplingInterval) {\n      clearInterval(this.samplingInterval);\n      this.samplingInterval = null;\n    }\n  }\n  \n  private resetMetrics(): void {\n    this.frameTimings = [];\n    this.memorySnapshots = [];\n    this.cpuSnapshots = [];\n  }\n  \n  private calculateMetrics(): PerformanceBaseline {\n    // Calculate FPS metrics\n    const frameRates = this.frameTimings.filter(t => t > 0).map(t => 1000 / t);\n    const fps = {\n      min: Math.min(...frameRates),\n      avg: frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length,\n      p95: this.percentile(frameRates, 95)\n    };\n    \n    // Calculate memory metrics\n    const heapSizes = this.memorySnapshots.map(s => s.heap);\n    const domSizes = this.memorySnapshots.map(s => s.dom);\n    const memory = {\n      heap: Math.max(...heapSizes),\n      dom: Math.max(...domSizes)\n    };\n    \n    // Calculate CPU metrics\n    const cpuUsages = this.cpuSnapshots.map(s => s.usage);\n    const cpu = {\n      average: cpuUsages.reduce((sum, cpu) => sum + cpu, 0) / cpuUsages.length,\n      peak: Math.max(...cpuUsages)\n    };\n    \n    // Calculate frame time metrics\n    const frameTime = {\n      avg: this.frameTimings.reduce((sum, t) => sum + t, 0) / this.frameTimings.length,\n      p95: this.percentile(this.frameTimings, 95),\n      p99: this.percentile(this.frameTimings, 99)\n    };\n    \n    return {\n      fps,\n      memory,\n      cpu,\n      frameTime,\n      loadTime: {\n        initialization: 0, // Would be measured in actual implementation\n        firstFrame: 0,\n        fullLoad: 0\n      }\n    };\n  }\n  \n  private detectRegressions(\n    baseline: PerformanceBaseline,\n    actual: PerformanceBaseline,\n    tolerance: PerformanceTest['tolerance']\n  ): PerformanceResults['regressions'] {\n    const regressions: PerformanceResults['regressions'] = [];\n    \n    // FPS regression\n    const fpsDegradation = ((baseline.fps.avg - actual.fps.avg) / baseline.fps.avg) * 100;\n    if (fpsDegradation > tolerance.fps) {\n      regressions.push({\n        metric: 'fps.avg',\n        baseline: baseline.fps.avg,\n        actual: actual.fps.avg,\n        degradation: fpsDegradation,\n        severity: fpsDegradation > tolerance.fps * 2 ? 'critical' : 'major'\n      });\n    }\n    \n    // Memory regression\n    const memoryIncrease = ((actual.memory.heap - baseline.memory.heap) / baseline.memory.heap) * 100;\n    if (memoryIncrease > tolerance.memory) {\n      regressions.push({\n        metric: 'memory.heap',\n        baseline: baseline.memory.heap,\n        actual: actual.memory.heap,\n        degradation: memoryIncrease,\n        severity: memoryIncrease > tolerance.memory * 2 ? 'critical' : 'major'\n      });\n    }\n    \n    // CPU regression\n    const cpuIncrease = ((actual.cpu.average - baseline.cpu.average) / baseline.cpu.average) * 100;\n    if (cpuIncrease > tolerance.cpu) {\n      regressions.push({\n        metric: 'cpu.average',\n        baseline: baseline.cpu.average,\n        actual: actual.cpu.average,\n        degradation: cpuIncrease,\n        severity: cpuIncrease > tolerance.cpu * 2 ? 'critical' : 'major'\n      });\n    }\n    \n    return regressions;\n  }\n  \n  private detectImprovements(\n    baseline: PerformanceBaseline,\n    actual: PerformanceBaseline\n  ): PerformanceResults['improvements'] {\n    const improvements: PerformanceResults['improvements'] = [];\n    \n    // FPS improvement\n    const fpsImprovement = ((actual.fps.avg - baseline.fps.avg) / baseline.fps.avg) * 100;\n    if (fpsImprovement > 5) { // 5% threshold for reporting improvements\n      improvements.push({\n        metric: 'fps.avg',\n        baseline: baseline.fps.avg,\n        actual: actual.fps.avg,\n        improvement: fpsImprovement\n      });\n    }\n    \n    // Memory improvement\n    const memoryImprovement = ((baseline.memory.heap - actual.memory.heap) / baseline.memory.heap) * 100;\n    if (memoryImprovement > 5) {\n      improvements.push({\n        metric: 'memory.heap',\n        baseline: baseline.memory.heap,\n        actual: actual.memory.heap,\n        improvement: memoryImprovement\n      });\n    }\n    \n    return improvements;\n  }\n  \n  private percentile(values: number[], p: number): number {\n    const sorted = [...values].sort((a, b) => a - b);\n    const index = Math.ceil((p / 100) * sorted.length) - 1;\n    return sorted[Math.max(0, index)] || 0;\n  }\n  \n  private estimateDOMMemory(): number {\n    // Rough estimate based on DOM node count\n    const nodeCount = document.getElementsByTagName('*').length;\n    return (nodeCount * 1.5) / 1024; // Estimate ~1.5KB per node, convert to MB\n  }\n  \n  private estimateCPUUsage(): number {\n    // This is a very rough approximation - in a real implementation,\n    // you'd want to use the Performance Timeline API or other methods\n    return Math.random() * 10; // Placeholder\n  }\n  \n  private delay(ms: number): Promise<void> {\n    return new Promise(resolve => setTimeout(resolve, ms));\n  }\n  \n  private createEmptyMetrics(): PerformanceBaseline {\n    return {\n      fps: { min: 0, avg: 0, p95: 0 },\n      memory: { heap: 0, dom: 0 },\n      cpu: { average: 0, peak: 0 },\n      frameTime: { avg: 0, p95: 0, p99: 0 },\n      loadTime: { initialization: 0, firstFrame: 0, fullLoad: 0 }\n    };\n  }\n  \n  private getRecentResults(): PerformanceResults[] {\n    // Get most recent result for each test\n    const latestResults = new Map<string, PerformanceResults>();\n    \n    for (const result of this.results) {\n      const existing = latestResults.get(result.testId);\n      if (!existing || result.timestamp > existing.timestamp) {\n        latestResults.set(result.testId, result);\n      }\n    }\n    \n    return Array.from(latestResults.values());\n  }\n  \n  private generateJUnitXML(results: PerformanceResults[]): string {\n    const testSuites = results.map(result => {\n      const regressions = result.regressions.filter(r => r.severity !== 'minor');\n      const failed = !result.passed || regressions.length > 0;\n      \n      return `\n    <testcase name=\"${result.testId}\" time=\"0.001\" classname=\"PerformanceTest\">\n      ${failed ? `<failure message=\"Performance regression detected\">${regressions.map(r => r.metric + ': ' + r.degradation.toFixed(1) + '%').join(', ')}</failure>` : ''}\n    </testcase>`;\n    }).join('');\n    \n    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<testsuite name=\"PerformanceTests\" tests=\"${results.length}\" failures=\"${results.filter(r => !r.passed).length}\" time=\"0.001\">${testSuites}\n</testsuite>`;\n  }\n  \n  private generateMarkdownReport(summary: ReturnType<typeof this.getSummary>, results: PerformanceResults[]): string {\n    const timestamp = new Date().toISOString();\n    \n    let report = `# Performance Test Report\\n\\n`;\n    report += `**Generated:** ${timestamp}\\n\\n`;\n    \n    report += `## Summary\\n\\n`;\n    report += `- **Total Tests:** ${summary.totalTests}\\n`;\n    report += `- **Passed:** ${summary.passedTests}\\n`;\n    report += `- **Failed:** ${summary.failedTests}\\n`;\n    report += `- **Regressions:** ${summary.totalRegressions} (${summary.criticalRegressions} critical)\\n\\n`;\n    \n    report += `## Performance Metrics\\n\\n`;\n    report += `- **Average FPS:** ${summary.averagePerformance.fps}\\n`;\n    report += `- **Average Memory:** ${summary.averagePerformance.memory}MB\\n`;\n    report += `- **Average CPU:** ${summary.averagePerformance.cpu}%\\n\\n`;\n    \n    if (results.some(r => r.regressions.length > 0)) {\n      report += `## Regressions\\n\\n`;\n      for (const result of results) {\n        if (result.regressions.length > 0) {\n          report += `### ${result.testId}\\n\\n`;\n          for (const regression of result.regressions) {\n            report += `- **${regression.metric}:** ${regression.degradation.toFixed(1)}% degradation (${regression.severity})\\n`;\n          }\n          report += `\\n`;\n        }\n      }\n    }\n    \n    return report;\n  }\n}