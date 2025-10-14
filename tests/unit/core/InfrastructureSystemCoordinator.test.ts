/**
 * InfrastructureSystemCoordinator Tests (Modernized)
 *
 * Validates that the coordinator integrates with modern dependency injection
 * patterns and provides system metrics using standardized mock factories.
 */

import {
  InfrastructureSystemCoordinator,
  InfrastructureSystemKey,
} from "@/core/integration/InfrastructureSystemCoordinator";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import * as Utils from "@/utils/core/ThemeUtilities";
import { createMockPerformanceAnalyzer } from "../../helpers/mockFactories";

// Mock non-visual system dependencies
jest.mock("@/core/animation/AnimationFrameCoordinator", () => jest.fn());
jest.mock("@/core/performance/TimerConsolidationSystem", () => jest.fn());
jest.mock("@/core/performance/PerformanceMonitor", () => ({
  PerformanceAnalyzer: jest.fn(),
  UnifiedPerformanceCoordinator: jest.fn(),
}));
jest.mock("@/core/performance/DeviceCapabilityDetector", () => ({
  DeviceCapabilityDetector: jest.fn().mockImplementation(() => ({
    detect: jest.fn().mockResolvedValue({}),
    destroy: jest.fn(),
  })),
}));
jest.mock("@/debug/DebugCoordinator", () => ({
  Y3K: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  },
}));
jest.mock("@/audio/ColorHarmonyEngine", () => jest.fn());
jest.mock("@/audio/MusicSyncService", () => jest.fn());
jest.mock("@/ui/managers/GlassmorphismManager", () => jest.fn());
jest.mock("@/ui/managers/Card3DManager", () => jest.fn());
jest.mock("@/core/integration/SidebarSystemsIntegration", () => jest.fn());

jest.mock("@/core/css/CSSVariableWriter", () => {
  const CSSVariableWriter = jest.fn().mockImplementation(() => ({
    initialized: false,
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue({
      system: "CSSVariableWriter",
      healthy: true,
      ok: true,
    }),
    batchSetVariables: jest.fn(),
    queueCSSVariableUpdate: jest.fn(),
    flushBatch: jest.fn(),
    updateAnimation: jest.fn(),
  }));

  return {
    CSSVariableWriter,
    setGlobalCSSVariableWriter: jest.fn(),
  };
});

const { CSSVariableWriter: cssWriterConstructor } = require("@/core/css/CSSVariableWriter");

describe("InfrastructureSystemCoordinator", () => {
  let coordinator: InfrastructureSystemCoordinator;
  let performanceMock: ReturnType<typeof createMockPerformanceAnalyzer>;
  let mockYear3000System: any;

  beforeEach(() => {
    jest.clearAllMocks();
    performanceMock = createMockPerformanceAnalyzer();

    mockYear3000System = {
      isInitialized: true,
      config: ADVANCED_SYSTEM_CONFIG,
      getSharedDependency: jest.fn((dependency: string) => {
        if (dependency === "performanceCoordinator" || dependency === "performanceAnalyzer") {
          return performanceMock;
        }
        return null;
      }),
      unifiedPerformanceCoordinator: performanceMock,
      performanceAnalyzer: performanceMock,
    };

    coordinator = new InfrastructureSystemCoordinator(
      ADVANCED_SYSTEM_CONFIG,
      Utils,
      mockYear3000System
    );
  });

  it("initializes successfully with modern configuration", async () => {
    await coordinator.initialize();

    const status = coordinator.getSystemStatus();
    expect(status.initialized).toBe(true);
    expect(mockYear3000System.getSharedDependency).toHaveBeenCalled();
  });

  it("creates and caches non-visual systems", async () => {
    await coordinator.initialize();

    const first = await coordinator.getSystem("PerformanceAnalyzer");
    const second = await coordinator.getSystem("PerformanceAnalyzer");

    expect(first).toBe(second);
    expect(coordinator.getSystemStatus().systemsActive).toBeGreaterThanOrEqual(1);
  });

  it("injects performance coordinator into CSSVariableWriter", async () => {
    await coordinator.initialize();
    await coordinator.getSystem("CSSVariableWriter");

    expect(cssWriterConstructor).toHaveBeenCalledWith(expect.any(Object), performanceMock);
  });

  it("reports metrics after systems are initialized", async () => {
    await coordinator.initialize();
    await coordinator.getSystem("PerformanceAnalyzer");

    const metrics = coordinator.getMetrics();
    expect(metrics.systemCount).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(metrics.activeSystems)).toBe(true);
  });

  it("rejects unknown system keys", async () => {
    await expect(
      coordinator.getSystem("UnknownSystem" as InfrastructureSystemKey)
    ).rejects.toThrow("Non-visual system 'UnknownSystem' not found in registry");
  });
});
