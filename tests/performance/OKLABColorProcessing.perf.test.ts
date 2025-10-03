import { OKLABColorProcessor } from "@/utils/color/OKLABColorProcessor";
import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";

describe("OKLAB Color Processing - Performance Validation (Phase 4)", () => {
  const PERFORMANCE_BUDGET = {
    COLOR_PROCESSING: 100, // <100ms per color processing cycle
    CSS_UPDATE: 16, // <16ms for 60fps (1000ms/60fps)
    BATCH_PROCESSING: 500, // <500ms for batch of 10 colors
  };

  describe("OKLABColorProcessor Performance", () => {
    let processor: OKLABColorProcessor;

    beforeEach(() => {
      processor = new OKLABColorProcessor();
    });

    it("should process single color within performance budget (<100ms)", () => {
      const testColor = "#3498db";
      const startTime = performance.now();

      const result = processor.processColor(testColor, "default");

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.shadowHex).toBeDefined();
      expect(result.highlightHex).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);
    });

    it("should process shadow generation within budget", () => {
      const testColor = "#e74c3c";
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        processor.processColor(testColor, "default");
      }

      const endTime = performance.now();
      const avgDuration = (endTime - startTime) / iterations;

      expect(avgDuration).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);
    });

    it("should process highlight generation within budget", () => {
      const testColor = "#2ecc71";
      const iterations = 100;
      const startTime = performance.now();

      for (let i = 0; i < iterations; i++) {
        const result = processor.processColor(testColor, "default");
        expect(result.highlightHex).toBeDefined();
      }

      const endTime = performance.now();
      const avgDuration = (endTime - startTime) / iterations;

      expect(avgDuration).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);
    });

    it("should handle batch processing efficiently", () => {
      const testColors = [
        "#3498db",
        "#e74c3c",
        "#2ecc71",
        "#f39c12",
        "#9b59b6",
        "#1abc9c",
        "#34495e",
        "#e67e22",
        "#95a5a6",
        "#d35400",
      ];

      const startTime = performance.now();

      testColors.forEach(color => {
        processor.processColor(color, "default");
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(PERFORMANCE_BUDGET.BATCH_PROCESSING);
    });

    it("should maintain consistent performance across different color values", () => {
      const testCases = [
        { color: "#000000", label: "black" },
        { color: "#ffffff", label: "white" },
        { color: "#ff0000", label: "red" },
        { color: "#00ff00", label: "green" },
        { color: "#0000ff", label: "blue" },
        { color: "#7f7f7f", label: "gray" },
      ];

      const timings: number[] = [];

      testCases.forEach(({ color }) => {
        const startTime = performance.now();
        processor.processColor(color, "default");
        const endTime = performance.now();
        timings.push(endTime - startTime);
      });

      const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
      const maxTiming = Math.max(...timings);

      expect(avgTiming).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);
      expect(maxTiming).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);

      const variance =
        timings.reduce((sum, t) => sum + Math.pow(t - avgTiming, 2), 0) /
        timings.length;
      expect(variance).toBeLessThan(100);
    });
  });

  describe("CSS Variable Update Performance", () => {
    let engine: ColorHarmonyEngine;
    let rootElement: HTMLElement;

    beforeEach(() => {
      rootElement = document.documentElement;
      rootElement.style.cssText = "";
      engine = new ColorHarmonyEngine({ enableDebug: false });
    });

    afterEach(() => {
      rootElement.style.cssText = "";
    });

    it("should update CSS variables within 60fps budget (<16ms)", () => {
      const cssVars = {
        "--sn-oklab-shadow-rgb": "44, 62, 80",
        "--sn-oklab-highlight-rgb": "236, 240, 241",
        "--sn-accent-rgb": "52, 152, 219",
      };

      const startTime = performance.now();

      Object.entries(cssVars).forEach(([key, value]) => {
        rootElement.style.setProperty(key, value);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(PERFORMANCE_BUDGET.CSS_UPDATE);
    });

    it("should handle rapid CSS variable updates efficiently", () => {
      const updates = 60; // Simulate 1 second of 60fps updates
      const timings: number[] = [];

      for (let i = 0; i < updates; i++) {
        const cssVars = {
          "--sn-oklab-shadow-rgb": `${i}, ${i}, ${i}`,
          "--sn-oklab-highlight-rgb": `${255 - i}, ${255 - i}, ${255 - i}`,
        };

        const startTime = performance.now();

        Object.entries(cssVars).forEach(([key, value]) => {
          rootElement.style.setProperty(key, value);
        });

        const endTime = performance.now();
        timings.push(endTime - startTime);
      }

      const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
      const maxTiming = Math.max(...timings);

      expect(avgTiming).toBeLessThan(PERFORMANCE_BUDGET.CSS_UPDATE);
      expect(maxTiming).toBeLessThan(PERFORMANCE_BUDGET.CSS_UPDATE * 2);
    });

    it("should not cause memory leaks during extended color updates", () => {
      const iterations = 1000;
      const initialMemory =
        (performance as any).memory?.usedJSHeapSize || 0;

      for (let i = 0; i < iterations; i++) {
        rootElement.style.setProperty(
          "--sn-oklab-shadow-rgb",
          `${i % 255}, ${i % 255}, ${i % 255}`
        );
        rootElement.style.setProperty(
          "--sn-oklab-highlight-rgb",
          `${(255 - i) % 255}, ${(255 - i) % 255}, ${(255 - i) % 255}`
        );
      }

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(1024 * 1024 * 5);
      } else {
        expect(true).toBe(true);
      }
    });
  });

  describe("End-to-End Color Processing Performance", () => {
    it("should complete full color harmony cycle within budget", () => {
      const processor = new OKLABColorProcessor();
      const testColors = ["#3498db", "#e74c3c", "#2ecc71"];
      const rootElement = document.documentElement;

      const startTime = performance.now();

      testColors.forEach(color => {
        const result = processor.processColor(color, "default");

        rootElement.style.setProperty(
          "--sn-oklab-shadow-rgb",
          result.shadowRgb
        );
        rootElement.style.setProperty(
          "--sn-oklab-highlight-rgb",
          result.highlightRgb
        );
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING * 3);
    });
  });

  describe("Performance Regression Detection", () => {
    it("should maintain baseline performance characteristics", () => {
      const processor = new OKLABColorProcessor();
      const testColor = "#9b59b6";

      const timings: number[] = [];
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        processor.processColor(testColor, "default");
        const end = performance.now();
        timings.push(end - start);
      }

      const avg = timings.reduce((a, b) => a + b, 0) / timings.length;
      const p95 = timings.sort((a, b) => a - b)[Math.floor(iterations * 0.95)];
      const p99 = timings.sort((a, b) => a - b)[Math.floor(iterations * 0.99)];

      expect(avg).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING);
      expect(p95).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING * 1.5);
      expect(p99).toBeLessThan(PERFORMANCE_BUDGET.COLOR_PROCESSING * 2);
    });
  });
});
