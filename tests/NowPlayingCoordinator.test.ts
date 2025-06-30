/**
 * Phase 3 Test: NowPlayingCoordinator Timing Hub
 * Verifies that CSS variables are updated atomically at animation frame boundaries
 */

import {
  NowPlayingCoordinator,
  getNowPlayingCoordinator,
} from "../src-js/systems/nowPlaying/NowPlayingCoordinator";

// Mock DOM and requestAnimationFrame
const mockRequestAnimationFrame = jest.fn();
const mockCancelAnimationFrame = jest.fn();
const mockSetProperty = jest.fn();

const mockElement = {
  style: {
    setProperty: mockSetProperty,
    getPropertyValue: jest.fn(),
  },
  querySelector: jest.fn(),
} as unknown as HTMLElement;

// @ts-ignore
global.requestAnimationFrame = mockRequestAnimationFrame;
// @ts-ignore
global.cancelAnimationFrame = mockCancelAnimationFrame;
// @ts-ignore
global.document = {
  documentElement: mockElement,
  querySelector: jest.fn().mockReturnValue(null),
};

describe("NowPlayingCoordinator", () => {
  let coordinator: NowPlayingCoordinator;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset singleton
    (NowPlayingCoordinator as any).instance = null;

    coordinator = new NowPlayingCoordinator({
      enableDebug: false,
      maxBatchSize: 10,
    });

    // Mock requestAnimationFrame to call callback immediately
    mockRequestAnimationFrame.mockImplementation((callback: () => void) => {
      callback();
      return 1;
    });
  });

  afterEach(() => {
    coordinator.destroy();
  });

  test("should queue non-critical variables for atomic updates", () => {
    coordinator.queueUpdate("--sn-rhythm-phase", "0.5");
    coordinator.queueUpdate("--sn-feed-bloom-intensity", "0.3");

    // Should have called requestAnimationFrame
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(2);

    // Should have applied both updates atomically
    expect(mockSetProperty).toHaveBeenCalledWith("--sn-rhythm-phase", "0.5");
    expect(mockSetProperty).toHaveBeenCalledWith(
      "--sn-feed-bloom-intensity",
      "0.3"
    );
    expect(mockSetProperty).toHaveBeenCalledTimes(2);
  });

  test("should skip critical variables that bypass coordination", () => {
    coordinator.queueUpdate("--sn-beat-pulse-intensity", "1.0");
    coordinator.queueUpdate("--sn-breathing-scale", "1.05");

    // Critical variables should bypass the coordinator entirely
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();
    expect(mockSetProperty).not.toHaveBeenCalled();
  });

  test("should batch multiple updates in single animation frame", () => {
    coordinator.queueUpdate("--sn-rhythm-phase", "0.1");
    coordinator.queueUpdate("--sn-rhythm-phase", "0.2"); // Should overwrite
    coordinator.queueUpdate("--sn-feed-bloom-intensity", "0.4");

    // Should request animation frames for batching
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(3);

    // Should apply the latest value for duplicated property
    expect(mockSetProperty).toHaveBeenCalledWith("--sn-rhythm-phase", "0.2");
    expect(mockSetProperty).toHaveBeenCalledWith(
      "--sn-feed-bloom-intensity",
      "0.4"
    );
    expect(mockSetProperty).toHaveBeenCalledTimes(2);
  });

  test("should provide performance metrics", () => {
    coordinator.queueUpdate("--sn-test-var", "1.0");

    const metrics = coordinator.getPerformanceMetrics();

    expect(metrics.flushCount).toBe(1);
    expect(metrics.averageFlushTime).toBeGreaterThanOrEqual(0);
    expect(metrics.pendingUpdates).toBe(0); // Should be flushed
  });

  test("should force immediate flush when requested", () => {
    mockRequestAnimationFrame.mockImplementation((callback: () => void) => {
      // Don't call callback automatically
      return 1;
    });

    coordinator.queueUpdate("--sn-test-var", "1.0");

    // Should have scheduled but not executed
    expect(mockSetProperty).not.toHaveBeenCalled();

    coordinator.forceFlush();

    // Should have executed immediately
    expect(mockSetProperty).toHaveBeenCalledWith("--sn-test-var", "1.0");
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  test("should handle large batches with warning", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    // Queue more than maxBatchSize (10)
    for (let i = 0; i < 15; i++) {
      coordinator.queueUpdate(`--sn-test-var-${i}`, `${i}`);
    }

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Large batch detected (15 updates)")
    );

    consoleSpy.mockRestore();
  });

  test("should cleanup properly on destroy", () => {
    coordinator.queueUpdate("--sn-test-var", "1.0");

    // Mock RAF to not execute immediately
    mockRequestAnimationFrame.mockImplementation(() => 42);

    coordinator.destroy();

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(42);

    const metrics = coordinator.getPerformanceMetrics();
    expect(metrics.pendingUpdates).toBe(0);
  });

  test("should maintain singleton pattern", () => {
    const instance1 = getNowPlayingCoordinator();
    const instance2 = getNowPlayingCoordinator();

    expect(instance1).toBe(instance2);

    instance1.destroy();

    const instance3 = getNowPlayingCoordinator();
    expect(instance3).not.toBe(instance1);
  });
});
