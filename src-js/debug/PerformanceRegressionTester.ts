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
  
  constructor(config: Partial<TestConfig> = {}) {
    this.config = {
      enableGPUMemoryTracking: true,
      enableCPUTracking: true,
      sampleInterval: 100,      // Sample every 100ms
      warmupDuration: 1000,     // 1 second warmup
      collectGCStats: true,
      screenshotOnFailure: true,
      autoRetry: true,
      retryCount: 3,
      ...config
    };
    
    this.setupPerformanceObserver();
    
    console.log('[PerformanceRegressionTester] Initialized', this.config);
  }
  
  /**
   * Register a performance test
   */
  registerTest(test: PerformanceTest): void {
    this.tests.set(test.id, test);
    console.log(`[PerformanceRegressionTester] Registered test: ${test.id}`);
  }
  
  /**
   * Run a specific performance test
   */
  async runTest(testId: string): Promise<PerformanceResults> {
    const test = this.tests.get(testId);
    if (!test) {
      throw new Error(`Test not found: ${testId}`);
    }
    
    if (this.isRunning) {
      throw new Error('A test is already running');
    }
    
    console.log(`[PerformanceRegressionTester] Starting test: ${test.name}`);
    
    let attempt = 0;
    let lastError: Error | null = null;
    
    while (attempt <= this.config.retryCount) {
      try {
        const result = await this.executeTest(test);
        
        // Store result
        this.results.push(result);
        
        console.log(`[PerformanceRegressionTester] Test completed: ${test.id}`, {
          passed: result.passed,
          regressions: result.regressions.length,
          improvements: result.improvements.length
        });
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        attempt++;
        
        if (attempt <= this.config.retryCount && this.config.autoRetry) {
          console.warn(`[PerformanceRegressionTester] Test failed (attempt ${attempt}), retrying:`, error);
          await this.delay(1000); // Wait 1 second before retry
        } else {
          throw lastError;
        }
      }
    }
    
    throw lastError || new Error('Test failed after all retries');
  }
  
  /**
   * Run all registered tests
   */
  async runAllTests(): Promise<PerformanceResults[]> {
    const results: PerformanceResults[] = [];
    
    for (const [testId, test] of this.tests) {
      try {
        const result = await this.runTest(testId);
        results.push(result);
      } catch (error) {
        console.error(`[PerformanceRegressionTester] Test failed: ${testId}`, error);
        
        // Create failed result
        results.push({
          testId,
          timestamp: Date.now(),
          passed: false,
          metrics: this.createEmptyMetrics(),
          regressions: [],
          improvements: [],
          rawData: {
            frameTimings: [],
            memorySnapshots: [],
            cpuSnapshots: []
          }
        });
      }
    }
    
    return results;
  }
  
  /**
   * Get test results for analysis
   */
  getResults(testId?: string): PerformanceResults[] {
    if (testId) {
      return this.results.filter(r => r.testId === testId);
    }
    return [...this.results];
  }
  
  /**
   * Get summary of all test results
   */
  getSummary(): {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalRegressions: number;
    criticalRegressions: number;
    averagePerformance: {
      fps: number;
      memory: number;
      cpu: number;
    };
  } {
    const recentResults = this.getRecentResults();
    
    const totalTests = recentResults.length;
    const passedTests = recentResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    const totalRegressions = recentResults.reduce((sum, r) => sum + r.regressions.length, 0);
    const criticalRegressions = recentResults.reduce(
      (sum, r) => sum + r.regressions.filter(reg => reg.severity === 'critical').length,
      0
    );
    
    const avgFps = recentResults.reduce((sum, r) => sum + r.metrics.fps.avg, 0) / totalTests || 0;
    const avgMemory = recentResults.reduce((sum, r) => sum + r.metrics.memory.heap, 0) / totalTests || 0;
    const avgCpu = recentResults.reduce((sum, r) => sum + r.metrics.cpu.average, 0) / totalTests || 0;
    
    return {
      totalTests,
      passedTests,
      failedTests,
      totalRegressions,
      criticalRegressions,
      averagePerformance: {
        fps: Math.round(avgFps * 10) / 10,
        memory: Math.round(avgMemory * 10) / 10,
        cpu: Math.round(avgCpu * 10) / 10
      }
    };
  }
  
  /**
   * Clear old test results
   */
  clearResults(olderThanMs?: number): void {
    const cutoff = Date.now() - (olderThanMs || 24 * 60 * 60 * 1000); // Default 24 hours
    this.results = this.results.filter(r => r.timestamp > cutoff);
    
    console.log(`[PerformanceRegressionTester] Cleared old results (${this.results.length} remaining)`);
  }
  
  /**
   * Export results for CI/CD integration
   */
  exportResults(format: 'json' | 'junit' | 'markdown' = 'json'): string {
    const summary = this.getSummary();
    const recentResults = this.getRecentResults();
    
    switch (format) {
      case 'json':
        return JSON.stringify({
          summary,
          results: recentResults,
          timestamp: Date.now()
        }, null, 2);
        
      case 'junit':
        return this.generateJUnitXML(recentResults);
        
      case 'markdown':
        return this.generateMarkdownReport(summary, recentResults);
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
  
  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================
  
  private async executeTest(test: PerformanceTest): Promise<PerformanceResults> {
    this.isRunning = true;
    this.currentTest = test;
    this.resetMetrics();
    
    try {
      // Setup
      if (test.setup) {
        await test.setup();
      }
      
      // Warmup period
      await this.delay(this.config.warmupDuration);
      
      // Start monitoring
      this.startMonitoring();
      this.testStartTime = performance.now();
      
      // Execute test actions
      if (test.actions) {
        for (const action of test.actions) {
          await this.delay(action.delay);
          await action.action();
        }
      }
      
      // Run for test duration
      const remainingTime = test.duration - (performance.now() - this.testStartTime);
      if (remainingTime > 0) {
        await this.delay(remainingTime);
      }
      
      // Stop monitoring
      this.stopMonitoring();
      
      // Analyze results
      const metrics = this.calculateMetrics();
      const regressions = this.detectRegressions(test.baseline, metrics, test.tolerance);
      const improvements = this.detectImprovements(test.baseline, metrics);
      
      const result: PerformanceResults = {
        testId: test.id,
        timestamp: Date.now(),
        passed: regressions.filter(r => r.severity !== 'minor').length === 0,
        metrics,
        regressions,
        improvements,
        rawData: {
          frameTimings: [...this.frameTimings],
          memorySnapshots: [...this.memorySnapshots],
          cpuSnapshots: [...this.cpuSnapshots]
        }
      };
      
      return result;
      
    } finally {
      // Cleanup
      this.stopMonitoring();
      
      if (test.teardown) {
        try {
          await test.teardown();
        } catch (error) {
          console.error('[PerformanceRegressionTester] Teardown failed:', error);
        }
      }
      
      this.isRunning = false;
      this.currentTest = null;
    }
  }
  
  private setupPerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('[PerformanceRegressionTester] PerformanceObserver not available');
      return;
    }
    
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      for (const entry of entries) {
        if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
          // Process performance entries
          if (this.isRunning) {
            this.frameTimings.push(entry.duration);
          }
        }
      }
    });
    
    try {
      this.performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('[PerformanceRegressionTester] PerformanceObserver setup failed:', error);
    }
  }
  
  private startMonitoring(): void {
    // Start frame timing collection
    const collectFrameTiming = () => {
      if (!this.isRunning) return;
      
      const frameStart = performance.now();
      
      requestAnimationFrame(() => {
        const frameTime = performance.now() - frameStart;
        this.frameTimings.push(frameTime);
        
        collectFrameTiming();
      });
    };
    
    collectFrameTiming();
    
    // Start memory and CPU sampling
    this.samplingInterval = window.setInterval(() => {
      if (!this.isRunning) return;
      
      const timestamp = performance.now() - this.testStartTime;
      
      // Memory snapshot
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.memorySnapshots.push({
          timestamp,
          heap: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
          dom: this.estimateDOMMemory()
        });
      }
      
      // CPU usage (approximation)
      if (this.config.enableCPUTracking) {
        this.cpuSnapshots.push({
          timestamp,
          usage: this.estimateCPUUsage()
        });
      }
    }, this.config.sampleInterval);
  }
  
  private stopMonitoring(): void {
    if (this.samplingInterval) {
      clearInterval(this.samplingInterval);
      this.samplingInterval = null;
    }
  }
  
  private resetMetrics(): void {
    this.frameTimings = [];
    this.memorySnapshots = [];
    this.cpuSnapshots = [];
  }
  
  private calculateMetrics(): PerformanceBaseline {
    // Calculate FPS metrics
    const frameRates = this.frameTimings.filter(t => t > 0).map(t => 1000 / t);
    const fps = {
      min: Math.min(...frameRates),
      avg: frameRates.reduce((sum, fps) => sum + fps, 0) / frameRates.length,
      p95: this.percentile(frameRates, 95)
    };
    
    // Calculate memory metrics
    const heapSizes = this.memorySnapshots.map(s => s.heap);
    const domSizes = this.memorySnapshots.map(s => s.dom);
    const memory = {
      heap: Math.max(...heapSizes),
      dom: Math.max(...domSizes)
    };
    
    // Calculate CPU metrics
    const cpuUsages = this.cpuSnapshots.map(s => s.usage);
    const cpu = {
      average: cpuUsages.reduce((sum, cpu) => sum + cpu, 0) / cpuUsages.length,
      peak: Math.max(...cpuUsages)
    };
    
    // Calculate frame time metrics
    const frameTime = {
      avg: this.frameTimings.reduce((sum, t) => sum + t, 0) / this.frameTimings.length,
      p95: this.percentile(this.frameTimings, 95),
      p99: this.percentile(this.frameTimings, 99)
    };
    
    return {
      fps,
      memory,
      cpu,
      frameTime,
      loadTime: {
        initialization: 0, // Would be measured in actual implementation
        firstFrame: 0,
        fullLoad: 0
      }
    };
  }
  
  private detectRegressions(
    baseline: PerformanceBaseline,
    actual: PerformanceBaseline,
    tolerance: PerformanceTest['tolerance']
  ): PerformanceResults['regressions'] {
    const regressions: PerformanceResults['regressions'] = [];
    
    // FPS regression
    const fpsDegradation = ((baseline.fps.avg - actual.fps.avg) / baseline.fps.avg) * 100;
    if (fpsDegradation > tolerance.fps) {
      regressions.push({
        metric: 'fps.avg',
        baseline: baseline.fps.avg,
        actual: actual.fps.avg,
        degradation: fpsDegradation,
        severity: fpsDegradation > tolerance.fps * 2 ? 'critical' : 'major'
      });
    }
    
    // Memory regression
    const memoryIncrease = ((actual.memory.heap - baseline.memory.heap) / baseline.memory.heap) * 100;
    if (memoryIncrease > tolerance.memory) {
      regressions.push({
        metric: 'memory.heap',
        baseline: baseline.memory.heap,
        actual: actual.memory.heap,
        degradation: memoryIncrease,
        severity: memoryIncrease > tolerance.memory * 2 ? 'critical' : 'major'
      });
    }
    
    // CPU regression
    const cpuIncrease = ((actual.cpu.average - baseline.cpu.average) / baseline.cpu.average) * 100;
    if (cpuIncrease > tolerance.cpu) {
      regressions.push({
        metric: 'cpu.average',
        baseline: baseline.cpu.average,
        actual: actual.cpu.average,
        degradation: cpuIncrease,
        severity: cpuIncrease > tolerance.cpu * 2 ? 'critical' : 'major'
      });
    }
    
    return regressions;
  }
  
  private detectImprovements(
    baseline: PerformanceBaseline,
    actual: PerformanceBaseline
  ): PerformanceResults['improvements'] {
    const improvements: PerformanceResults['improvements'] = [];
    
    // FPS improvement
    const fpsImprovement = ((actual.fps.avg - baseline.fps.avg) / baseline.fps.avg) * 100;
    if (fpsImprovement > 5) { // 5% threshold for reporting improvements
      improvements.push({
        metric: 'fps.avg',
        baseline: baseline.fps.avg,
        actual: actual.fps.avg,
        improvement: fpsImprovement
      });
    }
    
    // Memory improvement
    const memoryImprovement = ((baseline.memory.heap - actual.memory.heap) / baseline.memory.heap) * 100;
    if (memoryImprovement > 5) {
      improvements.push({
        metric: 'memory.heap',
        baseline: baseline.memory.heap,
        actual: actual.memory.heap,
        improvement: memoryImprovement
      });
    }
    
    return improvements;
  }
  
  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)] || 0;
  }
  
  private estimateDOMMemory(): number {
    // Rough estimate based on DOM node count
    const nodeCount = document.getElementsByTagName('*').length;
    return (nodeCount * 1.5) / 1024; // Estimate ~1.5KB per node, convert to MB
  }
  
  private estimateCPUUsage(): number {
    // This is a very rough approximation - in a real implementation,
    // you'd want to use the Performance Timeline API or other methods
    return Math.random() * 10; // Placeholder
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private createEmptyMetrics(): PerformanceBaseline {
    return {
      fps: { min: 0, avg: 0, p95: 0 },
      memory: { heap: 0, dom: 0 },
      cpu: { average: 0, peak: 0 },
      frameTime: { avg: 0, p95: 0, p99: 0 },
      loadTime: { initialization: 0, firstFrame: 0, fullLoad: 0 }
    };
  }
  
  private getRecentResults(): PerformanceResults[] {
    // Get most recent result for each test
    const latestResults = new Map<string, PerformanceResults>();
    
    for (const result of this.results) {
      const existing = latestResults.get(result.testId);
      if (!existing || result.timestamp > existing.timestamp) {
        latestResults.set(result.testId, result);
      }
    }
    
    return Array.from(latestResults.values());
  }
  
  private generateJUnitXML(results: PerformanceResults[]): string {
    const testSuites = results.map(result => {
      const regressions = result.regressions.filter(r => r.severity !== 'minor');
      const failed = !result.passed || regressions.length > 0;
      
      return `
    <testcase name=\"${result.testId}\" time=\"0.001\" classname=\"PerformanceTest\">
      ${failed ? `<failure message=\"Performance regression detected\">${regressions.map(r => r.metric + ': ' + r.degradation.toFixed(1) + '%').join(', ')}</failure>` : ''}
    </testcase>`;
    }).join('');
    
    return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<testsuite name=\"PerformanceTests\" tests=\"${results.length}\" failures=\"${results.filter(r => !r.passed).length}\" time=\"0.001\">${testSuites}
</testsuite>`;
  }
  
  private generateMarkdownReport(summary: ReturnType<typeof this.getSummary>, results: PerformanceResults[]): string {
    const timestamp = new Date().toISOString();
    
    let report = `# Performance Test Report\
\
`;
    report += `**Generated:** ${timestamp}\
\
`;
    
    report += `## Summary\
\
`;
    report += `- **Total Tests:** ${summary.totalTests}\
`;
    report += `- **Passed:** ${summary.passedTests}\
`;
    report += `- **Failed:** ${summary.failedTests}\
`;
    report += `- **Regressions:** ${summary.totalRegressions} (${summary.criticalRegressions} critical)\
\
`;
    
    report += `## Performance Metrics\
\
`;
    report += `- **Average FPS:** ${summary.averagePerformance.fps}\
`;
    report += `- **Average Memory:** ${summary.averagePerformance.memory}MB\
`;
    report += `- **Average CPU:** ${summary.averagePerformance.cpu}%\
\
`;
    
    if (results.some(r => r.regressions.length > 0)) {
      report += `## Regressions\
\
`;
      for (const result of results) {
        if (result.regressions.length > 0) {
          report += `### ${result.testId}\
\
`;
          for (const regression of result.regressions) {
            report += `- **${regression.metric}:** ${regression.degradation.toFixed(1)}% degradation (${regression.severity})\
`;
          }
          report += `\
`;
        }
      }
    }
    
    return report;
  }
}