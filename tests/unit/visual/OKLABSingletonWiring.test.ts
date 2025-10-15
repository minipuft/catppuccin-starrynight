import type { ColorContext } from "@/types/colorStrategy";

const mockProcessor = {
  processColor: jest.fn(() => ({
    originalHex: "#ffffff",
    originalRgb: { r: 255, g: 255, b: 255 },
    enhancedHex: "#ffffff",
    enhancedRgb: { r: 255, g: 255, b: 255 },
    shadowHex: "#000000",
    shadowRgb: { r: 0, g: 0, b: 0 },
    highlightHex: "#ffffff",
    highlightRgb: { r: 255, g: 255, b: 255 },
    oklabOriginal: { L: 1, a: 0, b: 0 },
    oklabEnhanced: { L: 1, a: 0, b: 0 },
    oklabShadow: { L: 0, a: 0, b: 0 },
    oklabHighlight: { L: 1, a: 0, b: 0 },
    oklchEnhanced: { L: 1, C: 0, H: 0 },
    processingTime: 0,
  })),
  generateOKLABGradient: jest.fn(() => []),
};

const mockMusicalProcessor = { processMusicalColors: jest.fn() };
const mockCssWriter = {
  batchSetVariables: jest.fn(),
  setVariable: jest.fn(),
};

describe("OKLAB processor singleton wiring", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  async function setupSingletonMocks() {
    const deviceModule = await import("@/core/performance/DeviceCapabilityDetector");
    const mockCapabilities = {
      overall: "high" as const,
      gpu: { supportsWebGL: true },
      memory: { level: "high" },
      cpu: { cores: 4 },
      display: { reducedMotion: false },
    };
    jest
      .spyOn(deviceModule, "DeviceCapabilityDetector")
      .mockImplementation(
        () =>
          ({
            isInitialized: true,
            initialize: jest.fn().mockResolvedValue(mockCapabilities),
            getCapabilities: jest.fn().mockReturnValue(mockCapabilities),
          }) as unknown as InstanceType<typeof deviceModule.DeviceCapabilityDetector>
      );

    const singletonModule = await import("@/utils/color/OKLABProcessorSingleton");
    const getStandardSpy = jest
      .spyOn(singletonModule, "getStandardOKLABProcessor")
      .mockReturnValue(mockProcessor as any);

    jest
      .spyOn(singletonModule, "getMusicalOKLABProcessor")
      .mockReturnValue(mockMusicalProcessor as any);

    return { getStandardSpy };
  }

  it("requests the shared processor once when ThemeColorController initializes", async () => {
    const { getStandardSpy } = await setupSingletonMocks();

    const { DynamicAccentColorStrategy } = await import(
      "@/visual/color/ThemeColorController"
    );

    new DynamicAccentColorStrategy(mockCssWriter as any);

    expect(getStandardSpy).toHaveBeenCalledTimes(1);
  });

  it("avoids redundant singleton requests during gradient processing", async () => {
    const { getStandardSpy } = await setupSingletonMocks();

    const { DynamicGradientStrategy } = await import(
      "@/visual/strategies/DynamicGradientStrategy"
    );

    const strategy = new DynamicGradientStrategy();
    expect(getStandardSpy).toHaveBeenCalledTimes(1);
    getStandardSpy.mockClear();

    const context = {
      rawColors: { PRIMARY: "#ffffff", SECONDARY: "#000000" },
      trackUri: "test:track",
      timestamp: Date.now(),
    } as unknown as ColorContext;

    await strategy.processColors(context);

    expect(getStandardSpy).not.toHaveBeenCalled();
  });
});
