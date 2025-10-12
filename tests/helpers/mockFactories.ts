import { PerformanceAnalyzer } from '@/core/performance/PerformanceMonitor';
import { CSSVariableWriter } from '@/core/css/CSSVariableWriter';
import { SystemIntegrationCoordinator } from '@/core/integration/SystemIntegrationCoordinator';
import { unifiedEventBus } from '@/core/events/EventBus';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import { VisualEffectsCoordinator } from '@/visual/effects/VisualEffectsCoordinator';
import * as Utils from '@/utils/core/ThemeUtilities';

/**
 * Standardized mock factory for PerformanceAnalyzer
 * Ensures type-safe, complete mock implementations
 */
export function createMockPerformanceAnalyzer(
  overrides?: Partial<PerformanceAnalyzer>
): PerformanceAnalyzer {
  console.log('Creating mock performance analyzer');
  const defaultMock: PerformanceAnalyzer = {
    initialized: true,
    initialize: jest.fn().mockResolvedValue(undefined),
    updateAnimation: jest.fn(),
    healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
    destroy: jest.fn(),
    recordMetric: jest.fn(),
    getMedianFPS: jest.fn().mockReturnValue(60),
    trackSubsystem: jest.fn(),
    getSystemHealth: jest.fn().mockReturnValue({
      overall: 'healthy',
      totalSubsystems: 0,
      healthySubsystems: 0,
      warningSubsystems: 0,
      criticalSubsystems: 0,
      subsystems: new Map(),
      recommendations: [],
      performanceScore: 100,
      lastUpdate: Date.now(),
    }),
    enableAdaptiveOptimization: jest.fn(),
    disableAdaptiveOptimization: jest.fn(),
    registerOptimizationStrategy: jest.fn(),
    triggerOptimization: jest.fn(),
    getMetrics: jest.fn().mockReturnValue({
        subsystems: new Map(),
        issues: new Map(),
        strategies: new Map(),
        adaptiveOptimizationEnabled: false,
    }),
    startMonitoring: jest.fn(),
    setPerformanceMode: jest.fn(),
    getDeviceCapabilities: jest.fn(() => ({
      performanceTier: 'high',
      memoryGB: 16,
      cpuCores: 8,
      gpuAcceleration: true,
      isMobile: false,
      supportsWebGL: true,
      supportsBackdropFilter: true,
      maxTextureSize: 4096,
      devicePixelRatio: 1,
    })),
    getThermalState: jest.fn(() => ({
      temperature: 'normal',
      throttleLevel: 0,
      cpuUsage: 0,
      gpuUsage: 0,
      memoryUsage: 0,
    })),
    getBatteryState: jest.fn(() => ({
      level: 1,
      charging: true,
    })),
    getCurrentPerformanceMode: jest.fn(() => ({
      name: 'performance',
      qualityLevel: 1,
      animationQuality: 1,
      effectQuality: 1,
      blurQuality: 1,
      shadowQuality: 1,
      frameRate: 60,
      optimizationLevel: 0,
    })),
    emitTrace: jest.fn(),
    calculateHealthScore: jest.fn().mockReturnValue(1),
    shouldReduceQuality: jest.fn().mockReturnValue(false),
    timeOperation: jest.fn((name, operation) => operation()),
    timeOperationAsync: jest.fn(async (name, operation) => operation()),
    getAverageTime: jest.fn().mockReturnValue(10),
    updateBudget: jest.fn(),
    startTiming: jest.fn().mockReturnValue('timing-id'),
    endTiming: jest.fn(),
    getWebGLStatus: jest.fn().mockReturnValue({
        state: 'webgl-active',
        quality: 'high',
        enabled: true,
    }),
    getPerformanceSummary: jest.fn().mockReturnValue({
        deviceTier: 'high',
        deviceDescription: 'mock-device',
        confidence: 1,
        reasoning: [],
        webglStatus: { state: 'webgl-active', quality: 'high', enabled: true },
        energyBoost: true,
        settings: {},
    }),
    getDeviceTier: jest.fn().mockReturnValue('high'),
    getDeviceDescription: jest.fn().mockReturnValue('mock-device'),
    hasEnergyBoost: jest.fn().mockReturnValue(true),
    getCurrentSettings: jest.fn().mockReturnValue({}),
  } as any;

  return { ...defaultMock, ...overrides };
}

/**
 * Mock factory for CSSVariableWriter with proper dependencies
 */
export function createMockCSSVariableWriter(
  config?: Partial<any>,
  performanceCoordinator?: PerformanceAnalyzer
): CSSVariableWriter {
  const mockConfig = {
    enableDebug: false,
    ...config,
  };

  const mockPerf = performanceCoordinator || createMockPerformanceAnalyzer();

  return new CSSVariableWriter(mockConfig as any, mockPerf);
}

/**
 * Orchestration test factory - creates full system with mocks
 */
export function createTestOrchestration(
  options?: {
    mockLevel?: 'minimal' | 'standard' | 'full';
    overrides?: Partial<SystemIntegrationCoordinator>;
  }
): {
  coordinator: SystemIntegrationCoordinator;
  mocks: {
    performanceAnalyzer: PerformanceAnalyzer;
    cssWriter: CSSVariableWriter;
    eventBus: typeof unifiedEventBus;
  };
} {
  const mockLevel = options?.mockLevel || 'standard';

  const mocks = {
    performanceAnalyzer: createMockPerformanceAnalyzer(),
    cssWriter: createMockCSSVariableWriter(),
    eventBus: unifiedEventBus, // Use real event bus or mock based on level
  };

  // Create coordinator with proper dependency injection
  const coordinator = new SystemIntegrationCoordinator(
    ADVANCED_SYSTEM_CONFIG as any,
    null as any, // advancedThemeSystem (mock if needed)
    {
      orchestration: {
        enforceSequentialInitialization: true,
        dependencyValidation: mockLevel !== 'minimal',
        enableInitializationGates: mockLevel === 'full',
        systemReadinessTimeout: 5000,
        phaseTransitionTimeout: 10000,
      },
    }
  );

  return { coordinator, mocks };
}

/**
 * Mock factory for VisualEffectsCoordinator
 */
export function createMockVisualEffectsCoordinator() {
  const mockPerformanceAnalyzer = createMockPerformanceAnalyzer();
  const mockCSSVariableWriter = createMockCSSVariableWriter(undefined, mockPerformanceAnalyzer);
  
  // Create a mock MusicSyncService
  const mockMusicSyncService: any = {
    initialize: jest.fn().mockResolvedValue(undefined),
    subscribeToAudioData: jest.fn(),
    unsubscribeFromAudioData: jest.fn(),
    getCurrentBeatData: jest.fn().mockReturnValue({ intensity: 0.5, isBeat: false, frequency: 440 }),
    getAverageLoudness: jest.fn().mockReturnValue(0.5),
    destroy: jest.fn(),
    initialized: true,
    healthCheck: jest.fn().mockResolvedValue({ ok: true, healthy: true }),
    updateAnimation: jest.fn(),
  };

  // Create a mock ColorHarmonyEngine
  const mockColorHarmonyEngine: any = {
    initialize: jest.fn().mockResolvedValue(undefined),
    generateHarmony: jest.fn().mockReturnValue([]),
    getColorPalette: jest.fn().mockReturnValue({ primary: '#000000', secondary: '#FFFFFF' }),
    destroy: jest.fn(),
    initialized: true,
    healthCheck: jest.fn().mockResolvedValue({ ok: true, healthy: true }),
    updateAnimation: jest.fn(),
  };

  // Create the VisualEffectsCoordinator with mock dependencies
  const bridge = new VisualEffectsCoordinator(
    mockCSSVariableWriter,
    mockPerformanceAnalyzer,
    mockMusicSyncService,
    mockColorHarmonyEngine
  );

  return {
    bridge,
    mockCSSVariableWriter,
    mockPerformanceAnalyzer,
    mockMusicSyncService,
    mockColorHarmonyEngine
  };
}

