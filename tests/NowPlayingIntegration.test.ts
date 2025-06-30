/**
 * Integration Test: End-to-End Now Playing Bar Consistency
 * Validates that all phases work together for consistent theme updates
 */

import { MusicSyncService } from "../src-js/services/MusicSyncService";
import { NowPlayingCoordinator } from "../src-js/systems/nowPlaying/NowPlayingCoordinator";

// Mock globals
const mockSpicetify = {
  Player: {
    data: {
      item: {
        uri: "spotify:track:test",
        duration: { milliseconds: 180000 },
      },
    },
  },
  colorExtractor: jest.fn().mockResolvedValue({
    VIBRANT: "#ff0000",
    DARK_VIBRANT: "#800000",
  }),
  CosmosAsync: {
    get: jest.fn().mockResolvedValue({
      audio_features: [
        {
          tempo: 128,
          energy: 0.8,
          valence: 0.6,
          danceability: 0.7,
        },
      ],
    }),
  },
};

// @ts-ignore
global.Spicetify = mockSpicetify;

const mockSetProperty = jest.fn();
const mockRAF = jest.fn();

// @ts-ignore
global.document = {
  // @ts-ignore
  documentElement: { style: { setProperty: mockSetProperty } },
  querySelector: jest.fn().mockReturnValue(null),
};

// @ts-ignore
global.requestAnimationFrame = mockRAF;

describe("Now Playing Bar Integration", () => {
  let musicSyncService: MusicSyncService;
  let coordinator: NowPlayingCoordinator;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Reset singletons
    (NowPlayingCoordinator as any).instance = null;

    musicSyncService = new MusicSyncService({
      YEAR3000_CONFIG: { enableDebug: false } as any,
      Year3000Utilities: {} as any,
      settingsManager: null,
      year3000System: null,
    });

    coordinator = new NowPlayingCoordinator({ enableDebug: false });

    // Mock RAF to execute callbacks immediately
    mockRAF.mockImplementation((callback: () => void) => {
      callback();
      return 1;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    musicSyncService.destroy();
    coordinator.destroy();
  });

  test("rapid song changes should be debounced and CSS updates coordinated", async () => {
    const processSpy = jest
      .spyOn(musicSyncService as any, "_processSongUpdateInternal")
      .mockImplementation(() => Promise.resolve());

    // Simulate rapid track changes
    for (let i = 1; i <= 5; i++) {
      mockSpicetify.Player.data.item.uri = `spotify:track:${i}`;
      musicSyncService.processSongUpdate();
      jest.advanceTimersByTime(30); // 30ms between changes
    }

    // Should not have processed anything yet (within debounce window)
    expect(processSpy).toHaveBeenCalledTimes(0);

    // Advance past debounce period
    jest.advanceTimersByTime(200);

    // Should have processed only once with the final track
    expect(processSpy).toHaveBeenCalledTimes(1);
    expect(processSpy).toHaveBeenCalledWith("spotify:track:5");

    processSpy.mockRestore();
  });

  test("critical variables should bypass coordination while others are batched", () => {
    // Critical variables (handled by CSSVariableBatcher fast path)
    coordinator.queueUpdate("--sn-beat-pulse-intensity", "1.0");
    coordinator.queueUpdate("--sn-breathing-scale", "1.05");

    // Non-critical variables (handled by coordinator)
    coordinator.queueUpdate("--sn-rhythm-phase", "0.5");
    coordinator.queueUpdate("--sn-feed-bloom-intensity", "0.3");

    // Critical variables should not trigger RAF (they bypass coordination)
    // Non-critical variables should trigger RAF and be applied
    expect(mockRAF).toHaveBeenCalledTimes(2);
    expect(mockSetProperty).toHaveBeenCalledWith("--sn-rhythm-phase", "0.5");
    expect(mockSetProperty).toHaveBeenCalledWith(
      "--sn-feed-bloom-intensity",
      "0.3"
    );
    expect(mockSetProperty).toHaveBeenCalledTimes(2);
  });

  test("force flag should bypass debouncing for immediate settings updates", async () => {
    const processSpy = jest
      .spyOn(musicSyncService as any, "_processSongUpdateInternal")
      .mockImplementation(() => Promise.resolve());

    mockSpicetify.Player.data.item.uri = "spotify:track:force";

    // Force update should execute immediately
    await musicSyncService.processSongUpdate(true);

    expect(processSpy).toHaveBeenCalledTimes(1);
    expect(processSpy).toHaveBeenCalledWith("spotify:track:force");

    processSpy.mockRestore();
  });

  test("performance metrics should track coordination efficiency", () => {
    // Queue multiple updates
    coordinator.queueUpdate("--sn-test-1", "1");
    coordinator.queueUpdate("--sn-test-2", "2");
    coordinator.queueUpdate("--sn-test-3", "3");

    const metrics = coordinator.getPerformanceMetrics();

    expect(metrics.flushCount).toBe(3);
    expect(metrics.averageFlushTime).toBeGreaterThanOrEqual(0);
    expect(metrics.pendingUpdates).toBe(0);
    expect(typeof metrics.lastFlushTimestamp).toBe("number");
  });

  test("error handling should be robust during coordination", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock setProperty to throw
    mockSetProperty.mockImplementationOnce(() => {
      throw new Error("CSS property error");
    });

    coordinator.queueUpdate("--sn-test-error", "bad-value");

    // Should handle error gracefully
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to apply --sn-test-error"),
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
