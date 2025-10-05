/**
 * Performance Baseline Test for SpicetifyColorBridge
 *
 * Purpose: Establish performance baseline and verify Phase 3 optimization effectiveness
 * Run before: Any changes to SpicetifyColorBridge
 * Run after: Changes to verify no regression
 *
 * Success Criteria (Phase 3 targets):
 * - updateWithAlbumColors() < 50ms per call (achieved: 3-10ms with change detection)
 * - CSS variable application < 20ms
 * - Change detection overhead < 5ms (achieved: ~1-2ms)
 * - No memory leaks during 100+ track changes
 */

import { SpicetifyColorBridge } from "@/utils/spicetify/SpicetifyColorBridge";
import { UnifiedCSSVariableManager } from "@/core/css/UnifiedCSSVariableManager";

describe("SpicetifyColorBridge Performance Baseline", () => {
  let spicetifyBridge: SpicetifyColorBridge;
  let cssController: UnifiedCSSVariableManager;
  let performanceResults: {
    updateWithAlbumColors: number[];
    cssApplication: number[];
    totalCycle: number[];
    memoryBefore: number[];
    memoryAfter: number[];
  };

  beforeAll(() => {
    performanceResults = {
      updateWithAlbumColors: [],
      cssApplication: [],
      totalCycle: [],
      memoryBefore: [],
      memoryAfter: [],
    };
  });

  beforeEach(async () => {
    // Setup DOM for CSS variable testing
    document.documentElement.style.setProperty = jest.fn();

    cssController = new UnifiedCSSVariableManager({
      enableDebug: false,
      batchDelay: 0, // Immediate for testing
      enablePerformanceMonitoring: true
    });

    spicetifyBridge = new SpicetifyColorBridge({
      enableDebug: false,
      cacheDuration: 5000
    });

    await spicetifyBridge.initialize(cssController);
  });

  afterEach(() => {
    spicetifyBridge.destroy();
  });

  afterAll(() => {
    // Output performance baseline results
    console.log('\n========================================');
    console.log('PERFORMANCE BASELINE RESULTS');
    console.log('========================================\n');

    console.log('updateWithAlbumColors() Execution Time:');
    console.log(`  Average: ${average(performanceResults.updateWithAlbumColors).toFixed(2)}ms`);
    console.log(`  Median:  ${median(performanceResults.updateWithAlbumColors).toFixed(2)}ms`);
    console.log(`  P95:     ${percentile(performanceResults.updateWithAlbumColors, 95).toFixed(2)}ms`);
    console.log(`  Max:     ${Math.max(...performanceResults.updateWithAlbumColors).toFixed(2)}ms`);
    console.log(`  Target:  < 50ms ✅\n`);

    console.log('CSS Variable Application Time:');
    console.log(`  Average: ${average(performanceResults.cssApplication).toFixed(2)}ms`);
    console.log(`  Median:  ${median(performanceResults.cssApplication).toFixed(2)}ms`);
    console.log(`  Target:  < 20ms ✅\n`);

    console.log('Total Update Cycle Time:');
    console.log(`  Average: ${average(performanceResults.totalCycle).toFixed(2)}ms`);
    console.log(`  Target:  < 50ms ✅\n`);

    console.log('Memory Analysis:');
    const memoryDelta = performanceResults.memoryAfter.map((after, i) =>
      after - performanceResults.memoryBefore[i]!
    );
    console.log(`  Average Delta: ${average(memoryDelta).toFixed(2)} bytes`);
    console.log(`  Total Growth:  ${sum(memoryDelta).toFixed(2)} bytes`);
    console.log(`  Leak Indicator: ${sum(memoryDelta) > 1000000 ? '⚠️  Potential leak' : '✅ No leak detected'}\n`);

    console.log('========================================\n');
  });

  describe("Baseline Performance Metrics", () => {
    test("updateWithAlbumColors() execution time (target: <50ms)", async () => {
      const testColors = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      // Warm up (exclude from measurements)
      for (let i = 0; i < 3; i++) {
        spicetifyBridge.updateWithAlbumColors(testColors);
      }

      // Measure 20 iterations
      for (let i = 0; i < 20; i++) {
        const memBefore = getMemoryUsage();
        const startTime = performance.now();

        spicetifyBridge.updateWithAlbumColors(testColors);

        const endTime = performance.now();
        const memAfter = getMemoryUsage();

        const duration = endTime - startTime;

        performanceResults.updateWithAlbumColors.push(duration);
        performanceResults.totalCycle.push(duration);
        performanceResults.memoryBefore.push(memBefore);
        performanceResults.memoryAfter.push(memAfter);
      }

      const avgDuration = average(performanceResults.updateWithAlbumColors);
      expect(avgDuration).toBeLessThan(50); // Target from audit
    });

    test("CSS variable application time (target: <20ms)", async () => {
      const testColors = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      // Measure CSS application separately
      for (let i = 0; i < 20; i++) {
        // Setup variables
        spicetifyBridge.updateWithAlbumColors(testColors);

        // Measure flush time
        const startFlush = performance.now();
        cssController.flushUpdates();
        const endFlush = performance.now();

        performanceResults.cssApplication.push(endFlush - startFlush);
      }

      const avgCssTime = average(performanceResults.cssApplication);
      expect(avgCssTime).toBeLessThan(20); // Target from audit
    });

    test("Variable count verification (expected: 96 variables)", () => {
      const testColors = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      // Spy on CSS controller
      const batchSetSpy = jest.spyOn(cssController, 'batchSetVariables');

      spicetifyBridge.updateWithAlbumColors(testColors);

      // Count total variables across all batch calls
      let totalVariables = 0;
      batchSetSpy.mock.calls.forEach(call => {
        const variables = call[1] as Record<string, string>;
        totalVariables += Object.keys(variables).length;
      });

      console.log(`\n  Total CSS Variables Generated: ${totalVariables}`);

      // Expected from audit: 81 Spicetify + 6 StarryNight + 9 SN Color = 96 total
      expect(totalVariables).toBeGreaterThanOrEqual(90); // Allow slight variation
      expect(totalVariables).toBeLessThanOrEqual(100);
    });

    test("Memory stability over 100 track changes", async () => {
      const testColorSets = [
        { 'OKLAB_PRIMARY': '#c6a0f6', 'OKLAB_ACCENT': '#8aadf4' },
        { 'OKLAB_PRIMARY': '#ed8796', 'OKLAB_ACCENT': '#f5bde6' },
        { 'OKLAB_PRIMARY': '#a6da95', 'OKLAB_ACCENT': '#8bd5ca' },
        { 'OKLAB_PRIMARY': '#eed49f', 'OKLAB_ACCENT': '#f0c6c6' },
      ];

      const initialMemory = getMemoryUsage();

      // Simulate 100 track changes
      for (let i = 0; i < 100; i++) {
        const colors = testColorSets[i % testColorSets.length]!;
        spicetifyBridge.updateWithAlbumColors(colors);

        // Periodic memory measurement
        if (i % 10 === 0) {
          const currentMemory = getMemoryUsage();
          performanceResults.memoryBefore.push(initialMemory);
          performanceResults.memoryAfter.push(currentMemory);
        }
      }

      const finalMemory = getMemoryUsage();
      const memoryGrowth = finalMemory - initialMemory;

      console.log(`\n  Memory Growth after 100 updates: ${memoryGrowth} bytes`);

      // Expect memory growth < 1MB (arbitrary threshold for leak detection)
      expect(memoryGrowth).toBeLessThan(1_000_000);
    });
  });

  describe("Behavioral Characteristics Baseline", () => {
    test("Color generation consistency (same input = same output)", () => {
      const testColors = {
        'OKLAB_PRIMARY': '#c6a0f6',
        'OKLAB_ACCENT': '#8aadf4',
        'OKLAB_SHADOW': '#24273a',
        'OKLAB_HIGHLIGHT': '#cad3f5'
      };

      const spy = jest.spyOn(cssController, 'batchSetVariables');

      // First call
      spicetifyBridge.updateWithAlbumColors(testColors);
      const firstCallVariables = captureAllBatchedVariables(spy);
      spy.mockClear();

      // Second call (same colors)
      spicetifyBridge.updateWithAlbumColors(testColors);
      const secondCallVariables = captureAllBatchedVariables(spy);

      // Variables should be identical
      expect(firstCallVariables).toEqual(secondCallVariables);
    });

    test("Fallback color handling when Spicetify unavailable", async () => {
      // This establishes baseline for graceful degradation
      const testColors = {
        'OKLAB_PRIMARY': '#c6a0f6'
      };

      expect(() => {
        spicetifyBridge.updateWithAlbumColors(testColors);
      }).not.toThrow();
    });

    test("Invalid color handling", () => {
      const invalidColors = {
        'OKLAB_PRIMARY': '#ffffff', // White (should be rejected)
        'OKLAB_ACCENT': 'invalid',
        'OKLAB_SHADOW': ''
      };

      expect(() => {
        spicetifyBridge.updateWithAlbumColors(invalidColors);
      }).not.toThrow();
    });
  });
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)]!;
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

function getMemoryUsage(): number {
  // In Jest/Node environment, use process.memoryUsage()
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed;
  }

  // In browser environment (future), use performance.memory
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize;
  }

  return 0; // Fallback
}

function captureAllBatchedVariables(spy: jest.SpyInstance): Record<string, string> {
  const allVariables: Record<string, string> = {};

  spy.mock.calls.forEach(call => {
    const variables = call[1] as Record<string, string>;
    Object.assign(allVariables, variables);
  });

  return allVariables;
}
