import { SidebarPerformanceCoordinator } from "@/visual/ui-effects/SidebarPerformanceCoordinator";

// Mock MODERN_SELECTORS
jest.mock("@/debug/SpotifyDOMSelectors", () => ({
  MODERN_SELECTORS: {
    rightSidebar: ".Root__right-sidebar",
  },
}));

// Mock DOM globals for Node environment
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock document
const mockElement = {
  style: {
    setProperty: jest.fn(),
    getPropertyValue: jest.fn(),
  },
  querySelector: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  hasAttribute: jest.fn(),
  addEventListener: jest.fn(),
};

global.document = {
  querySelector: jest.fn(() => mockElement),
  documentElement: mockElement,
} as any;

// Mock performance
global.performance = {
  now: jest.fn(() => Date.now()),
} as any;

// Mock window for requestIdleCallback
global.window = {
  requestIdleCallback: jest.fn((cb) => setTimeout(cb, 0)),
} as any;

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
})) as any;

// Mock MutationObserver
global.MutationObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
})) as any;

const mockPerformanceAnalyzer = {
  emitTrace: jest.fn(),
};

describe("SidebarPerformanceCoordinator", () => {
  let coordinator: SidebarPerformanceCoordinator;

  beforeEach(() => {
    jest.clearAllMocks();
    coordinator = new SidebarPerformanceCoordinator({
      enableDebug: false,
      performanceAnalyzer: mockPerformanceAnalyzer,
    });
  });

  afterEach(() => {
    coordinator.destroy();
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = SidebarPerformanceCoordinator.getInstance();
      const instance2 = SidebarPerformanceCoordinator.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("Configuration", () => {
    it("should initialize with default config", () => {
      const defaultCoordinator = new SidebarPerformanceCoordinator();
      const metrics = defaultCoordinator.getPerformanceMetrics();

      expect(metrics.flushCount).toBe(0);
      expect(metrics.averageFlushTime).toBe(0);
      expect(metrics.pendingUpdates).toBe(0);

      defaultCoordinator.destroy();
    });

    it("should initialize with custom config", () => {
      const customCoordinator = new SidebarPerformanceCoordinator({
        enableDebug: true,
        maxBatchSize: 25,
        performanceAnalyzer: mockPerformanceAnalyzer,
      });

      expect(customCoordinator).toBeDefined();
      customCoordinator.destroy();
    });
  });

  describe("Performance Metrics", () => {
    it("should track performance metrics", () => {
      const metrics = coordinator.getPerformanceMetrics();

      expect(metrics).toHaveProperty("flushCount");
      expect(metrics).toHaveProperty("averageFlushTime");
      expect(metrics).toHaveProperty("lastFlushTimestamp");
      expect(metrics).toHaveProperty("pendingUpdates");
    });

    it("should have performance monitoring capabilities", () => {
      // Test that the coordinator is monitoring performance
      coordinator.queueUpdate("--sn-rs-test", "value");
      coordinator.forceFlush();
      
      const metrics = coordinator.getPerformanceMetrics();
      expect(metrics.flushCount).toBeGreaterThan(0);
      expect(metrics.averageFlushTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Critical Variable Detection", () => {
    it("should identify critical variables", () => {
      // Mock querySelector to return the element
      (document.querySelector as jest.Mock).mockReturnValue(mockElement);

      coordinator.queueUpdate("--sn-rs-glow-alpha", "0.5");

      // Should call setProperty on the element (critical path)
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(
        "--sn-rs-glow-alpha",
        "0.5"
      );
    });

    it("should batch non-critical variables", () => {
      coordinator.queueUpdate("--sn-rs-custom-prop", "test-value");

      const metrics = coordinator.getPerformanceMetrics();
      expect(metrics.pendingUpdates).toBe(1);
    });
  });

  describe("Force Flush", () => {
    it("should immediately flush pending updates", () => {
      coordinator.queueUpdate("--sn-rs-test", "test-value");

      const metricsBefore = coordinator.getPerformanceMetrics();
      expect(metricsBefore.pendingUpdates).toBe(1);

      coordinator.forceFlush();

      const metricsAfter = coordinator.getPerformanceMetrics();
      expect(metricsAfter.pendingUpdates).toBe(0);
    });
  });

  describe("Cleanup", () => {
    it("should cleanup properly on destroy", () => {
      coordinator.queueUpdate("--sn-rs-test", "test-value");

      coordinator.destroy();

      const metrics = coordinator.getPerformanceMetrics();
      expect(metrics.pendingUpdates).toBe(0);
    });
  });
});
