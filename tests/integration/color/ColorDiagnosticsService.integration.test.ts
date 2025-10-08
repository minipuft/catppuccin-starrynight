import { DefaultServiceFactory } from "@/core/services/CoreServiceProviders";
import type {
  ThemeLifecycleService,
  VisualCoordinatorService,
} from "@/core/services/SystemServices";
import type { CSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";

const createSentinel = () =>
  new Proxy(
    {},
    {
      get(_target, prop) {
        throw new Error(
          `Unexpected globalThis.year3000System access for property ${String(prop)}`
        );
      },
      set() {
        throw new Error("Unexpected globalThis.year3000System mutation");
      },
    }
  );

describe("Color diagnostics service integration", () => {
  let mockCssController: CSSVariableWriter;
  let mockThemeLifecycleService: ThemeLifecycleService;
  let mockVisualCoordinatorService: VisualCoordinatorService;
  let mockPerformanceCoordinator: SimplePerformanceCoordinator;
  let sentinel: any;
  let getCoordinatorMock: jest.Mock;
  let getFacadeCoordinatorMock: jest.Mock;
  let getCssControllerMock: jest.Mock;
  let getPerformanceCoordinatorMock: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    DefaultServiceFactory.resetServices();

    sentinel = createSentinel();
    (globalThis as any).year3000System = sentinel;

    mockCssController = {
      queueCSSVariableUpdate: jest.fn(),
      queueBatchUpdate: jest.fn(),
      flushUpdates: jest.fn(),
      setVariable: jest.fn(),
      batchSetVariables: jest.fn(),
      initialize: jest.fn(),
      destroy: jest.fn(),
      updateAnimation: jest.fn(),
      healthCheck: jest.fn(),
    } as unknown as CSSVariableWriter;

    mockPerformanceCoordinator = {
      initialize: jest.fn(),
    } as unknown as SimplePerformanceCoordinator;

    const mockCoordinator = {
      cssVariableController: mockCssController,
      colorHarmonyEngine: {},
      timerConsolidationSystem: {
        registerConsolidatedTimer: jest.fn(),
        unregisterConsolidatedTimer: jest.fn(),
      },
      enhancedMasterAnimationCoordinator: {
        registerFrameCallback: jest.fn(),
        unregisterFrameCallback: jest.fn(),
      },
      setGradientParameters: jest.fn(),
    } as any;

    const mockFacadeCoordinator = {
      getCachedNonVisualSystem: jest.fn(),
      getNonVisualSystem: jest.fn().mockResolvedValue(null),
      getVisualSystem: jest.fn().mockResolvedValue(null),
    } as any;

    const mockAnimationCoordinator = {
      registerVisualSystem: jest.fn(),
      unregisterVisualSystem: jest.fn(),
    } as any;

    const mockMusicSyncService = {} as any;

    getCoordinatorMock = jest.fn(() => mockCoordinator);
    getFacadeCoordinatorMock = jest.fn(() => mockFacadeCoordinator);
    getCssControllerMock = jest.fn(() => mockCssController);
    getPerformanceCoordinatorMock = jest.fn(
      () => mockPerformanceCoordinator
    );

    mockThemeLifecycleService = {
      getCoordinator: getCoordinatorMock,
      getFacadeCoordinator: getFacadeCoordinatorMock,
      getCssController: getCssControllerMock,
      getTimerConsolidationSystem: jest.fn(
        () => mockCoordinator.timerConsolidationSystem
      ),
      getAnimationCoordinator: jest.fn(() => mockAnimationCoordinator),
      getMusicSyncService: jest.fn(() => mockMusicSyncService),
      getPerformanceCoordinator: getPerformanceCoordinatorMock,
      applyInitialSettings: jest.fn().mockResolvedValue(undefined),
    } as unknown as ThemeLifecycleService;

    const mockCoordinatorInstance = {
      registerVisualEffectsParticipant: jest
        .fn()
        .mockReturnValue({ success: true }),
      unregisterVisualEffectsParticipant: jest.fn(),
      getCurrentVisualEffectsState: jest.fn(),
      getMetrics: jest.fn(),
      getVisualSystem: jest.fn().mockResolvedValue(null),
      getCachedVisualSystem: jest.fn().mockReturnValue(null),
    };

    mockVisualCoordinatorService = {
      getCoordinatorInstance: jest.fn(() => mockCoordinatorInstance),
      getVisualSystem: mockCoordinatorInstance.getVisualSystem,
      getCachedVisualSystem: mockCoordinatorInstance.getCachedVisualSystem,
      getCurrentVisualEffectsState: mockCoordinatorInstance.getCurrentVisualEffectsState,
      getMetrics: mockCoordinatorInstance.getMetrics,
      registerVisualEffectsParticipant: jest.fn(() => true),
      unregisterVisualEffectsParticipant: jest.fn(),
    } as unknown as VisualCoordinatorService;

    DefaultServiceFactory.registerOverrides({
      themeLifecycle: mockThemeLifecycleService,
      visualCoordinator: mockVisualCoordinatorService,
    });

    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    DefaultServiceFactory.resetServices();
    delete (globalThis as any).year3000System;
  });

  it("ColorEventRouter resolves performance coordinator through services", async () => {
    await jest.isolateModulesAsync(async () => {
      const { ColorEventRouter } = await import(
        "@/core/events/ColorEventRouter"
      );
      expect(() => ColorEventRouter.getInstance()).not.toThrow();
      expect((globalThis as any).year3000System).toBe(sentinel);
    });
  });

  it("CSSColorController initializes with service-provided CSS controller", async () => {
    await jest.isolateModulesAsync(async () => {
      const { CSSColorController } = await import(
        "@/core/css/ColorStateManager"
      );
      const controller = new CSSColorController();
      await controller.initialize();
      expect(mockCssController.batchSetVariables).toHaveBeenCalled();
      expect((globalThis as any).year3000System).toBe(sentinel);
      controller.destroy();
    });
  });

  it("ColorHarmonyEngine instantiates without touching legacy globals", async () => {
    await jest.isolateModulesAsync(async () => {
      const { ColorHarmonyEngine } = await import(
        "@/audio/ColorHarmonyEngine"
      );
      const engine = new ColorHarmonyEngine();
      expect(engine).toBeInstanceOf(ColorHarmonyEngine);
      expect((globalThis as any).year3000System).toBe(sentinel);
    });
  });

  it("DebugCoordinator health check relies on facade service", async () => {
    await jest.isolateModulesAsync(async () => {
      const { DebugCoordinator } = await import("@/debug/DebugCoordinator");
      const debug = DebugCoordinator.getInstance({
        enableConsoleReporting: false,
        verboseLogging: false,
      });
      debug.registerSystem("MockSystem", { initialized: true }, "visual");
      const report = await debug.performHealthCheck();
      expect(report.systemDetails.length).toBeGreaterThan(0);
      expect((globalThis as any).year3000System).toBe(sentinel);
    });
  });
});
