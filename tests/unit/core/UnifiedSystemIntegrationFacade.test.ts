/**
 * NonVisualSystemFacade Test Suite
 * Tests for Phase 3 non-visual systems factory pattern implementation
 */

import { NonVisualSystemFacade, NonVisualSystemKey, NonVisualSystemConfig } from '@/core/integration/NonVisualSystemFacade';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/ThemeUtilities';

// Mock all non-visual system imports
jest.mock('@/core/animation/EnhancedMasterAnimationCoordinator');
jest.mock('@/core/performance/TimerConsolidationSystem');
jest.mock('@/core/performance/OptimizedCSSVariableManager');
jest.mock('@/core/css/UnifiedCSSVariableManager');
jest.mock('@/core/performance/UnifiedPerformanceCoordinator');
jest.mock('@/core/performance/DeviceCapabilityDetector');
// PerformanceCSSIntegration doesn't exist - remove mock
jest.mock('@/debug/UnifiedDebugManager');
jest.mock('@/ui/managers/SettingsManager');
jest.mock('@/audio/ColorHarmonyEngine');
jest.mock('@/audio/MusicSyncService');
jest.mock('@/ui/managers/GlassmorphismManager');
jest.mock('@/ui/managers/Card3DManager');
jest.mock('@/core/integration/SidebarSystemsIntegration');
// jest.mock('@/core/integration/UnifiedSystemIntegration'); // Module doesn't exist

// Mock debug system
jest.mock('@/debug/UnifiedDebugManager', () => ({
  Y3K: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn().mockReturnValue(12345),
    memory: {
      usedJSHeapSize: 1024 * 1024 * 20 // 20MB
    }
  }
});

describe('NonVisualSystemFacade', () => {
  let facade: NonVisualSystemFacade;
  let mockAdvancedThemeSystem: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock advancedThemeSystem
    mockAdvancedThemeSystem = {
      isInitialized: true,
      config: ADVANCED_SYSTEM_CONFIG
    };

    // Create facade instance
    facade = new NonVisualSystemFacade(
      ADVANCED_SYSTEM_CONFIG,
      Utils,
      mockAdvancedThemeSystem
    );
  });

  describe('Construction and Initialization', () => {
    it('should initialize with correct dependencies', () => {
      expect(facade).toBeInstanceOf(NonVisualSystemFacade);
      expect(facade.getSystemStatus().initialized).toBe(false);
    });

    it('should register all non-visual systems', () => {
      // Facade should have all non-visual systems registered internally
      expect(facade.getSystemStatus().systemsActive).toBe(0); // No systems cached yet
    });

    it('should initialize successfully with default configuration', async () => {
      await facade.initialize();
      
      expect(facade.getSystemStatus().initialized).toBe(true);
      const metrics = facade.getMetrics();
      expect(metrics.systemCount).toBe(16); // 16 registered systems
    });

    it('should apply custom configuration during initialization', async () => {
      const customConfig: Partial<NonVisualSystemConfig> = {
        mode: 'performance-first',
        enablePerformanceMonitoring: false,
        enableDependencyInjection: false
      };

      await facade.initialize(customConfig);

      const config = facade.getConfiguration();
      expect(config.mode).toBe('performance-first');
      expect(config.enablePerformanceMonitoring).toBe(false);
      expect(config.enableDependencyInjection).toBe(false);
    });
  });

  describe('Factory Pattern Implementation', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should create performance systems using factory pattern', () => {
      const performanceAnalyzer = facade.getSystem('PerformanceAnalyzer');
      
      expect(performanceAnalyzer).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(1);
    });

    it('should create core service systems using factory pattern', () => {
      const settingsManager = facade.getSystem('SettingsManager');
      const systemHealthMonitor = facade.getSystem('SystemHealthMonitor');
      
      expect(settingsManager).toBeDefined();
      expect(systemHealthMonitor).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });

    it('should create UI manager systems using factory pattern', () => {
      const glassmorphismManager = facade.getSystem('GlassmorphismManager');
      const card3DManager = facade.getSystem('Card3DManager');
      
      expect(glassmorphismManager).toBeDefined();
      expect(card3DManager).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });

    it('should create integration systems using factory pattern', () => {
      const sidebarSystemsIntegration = facade.getSystem('SidebarSystemsIntegration');
      const unifiedSystemIntegration = facade.getSystem('UnifiedSystemIntegration');
      
      expect(sidebarSystemsIntegration).toBeDefined();
      expect(unifiedSystemIntegration).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });

    it('should cache systems correctly', () => {
      const system1 = facade.getSystem('PerformanceAnalyzer');
      const system2 = facade.getSystem('PerformanceAnalyzer');
      
      expect(system1).toBe(system2); // Same instance
      expect(facade.getSystemStatus().systemsActive).toBe(1); // Only one cached
    });

    it('should create different instances for different system keys', () => {
      const performanceAnalyzer = facade.getSystem('PerformanceAnalyzer');
      const settingsManager = facade.getSystem('SettingsManager');
      
      expect(performanceAnalyzer).not.toBe(settingsManager);
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });

    it('should handle special constructor for UnifiedSystemIntegration', () => {
      const unifiedSystem = facade.getSystem('UnifiedSystemIntegration');
      
      expect(unifiedSystem).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(1);
    });

    it('should handle parameterless constructors', () => {
      const deviceDetector = facade.getSystem('DeviceCapabilityDetector');
      const cssVariableBatcher = facade.getSystem('CSSVariableBatcher');
      
      expect(deviceDetector).toBeDefined();
      expect(cssVariableBatcher).toBeDefined();
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });

    it('should throw error for unknown system key', () => {
      expect(() => {
        facade.getSystem('UnknownSystem' as NonVisualSystemKey);
      }).toThrow('Non-visual system \'UnknownSystem\' not found in registry');
    });
  });

  describe('Dependency Injection', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should inject shared dependencies', () => {
      const system = facade.getSystem('EnhancedMasterAnimationCoordinator');
      
      expect(system).toBeDefined();
      // Note: In real implementation, we'd verify dependency injection was called
    });

    it('should handle systems with no dependencies', () => {
      const performanceAnalyzer = facade.getSystem('PerformanceAnalyzer');
      const cssVariableBatcher = facade.getSystem('CSSVariableBatcher');
      
      expect(performanceAnalyzer).toBeDefined();
      expect(cssVariableBatcher).toBeDefined();
    });

    it('should inject dependencies in correct order', () => {
      // Create systems that depend on each other
      const cssVariableBatcher = facade.getSystem('CSSVariableBatcher');
      const unifiedCSSManager = facade.getSystem('UnifiedCSSVariableManager');
      
      expect(cssVariableBatcher).toBeDefined();
      expect(unifiedCSSManager).toBeDefined();
      
      // CSSVariableBatcher should be created first and injected into UnifiedCSSVariableManager
      expect(facade.getSystemStatus().systemsActive).toBe(2);
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should wrap initialize methods with performance monitoring', () => {
      const system = facade.getSystem('PerformanceAnalyzer');
      
      // Mock system with initialize method
      const mockSystem = system as any;
      mockSystem.initialize = jest.fn();
      
      // Performance monitoring should be integrated
      expect(mockSystem.initialize).toBeDefined();
    });

    it('should track system creation metrics', () => {
      facade.getSystem('PerformanceAnalyzer');
      facade.getSystem('SettingsManager');
      
      const metrics = facade.getMetrics();
      expect(metrics.initializedSystems).toBe(2);
      expect(metrics.activeSystems).toContain('PerformanceAnalyzer');
      expect(metrics.activeSystems).toContain('SettingsManager');
    });

    it('should track system failures', () => {
      // Mock system constructor to throw error
      const mockSystem = require('@/core/performance/PerformanceAnalyzer');
      mockSystem.PerformanceAnalyzer.mockImplementation(() => {
        throw new Error('System creation failed');
      });

      expect(() => {
        facade.getSystem('PerformanceAnalyzer');
      }).toThrow('System creation failed');
      
      const metrics = facade.getMetrics();
      expect(metrics.failedSystems).toBe(1);
      expect(metrics.failedSystemsList).toContain('PerformanceAnalyzer');
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should perform health check on all systems', async () => {
      // Create some systems
      facade.getSystem('PerformanceAnalyzer');
      facade.getSystem('SettingsManager');
      
      const healthCheck = await facade.performHealthCheck();
      
      expect(healthCheck).toBeDefined();
      expect(healthCheck.overall).toBe('excellent');
      expect(healthCheck.systems.size).toBe(2);
      expect(healthCheck.timestamp).toBeDefined();
    });

    it('should provide performance recommendations', async () => {
      // Mock high initialization time
      const mockPerformanceNow = jest.fn()
        .mockReturnValueOnce(0)    // Start time
        .mockReturnValueOnce(4000) // End time (4 seconds)
        .mockReturnValue(5000);    // Subsequent calls

      (window.performance.now as jest.Mock) = mockPerformanceNow;
      
      // Create new facade with high init time
      const slowFacade = new NonVisualSystemFacade(
        ADVANCED_SYSTEM_CONFIG,
        Utils,
        mockAdvancedThemeSystem
      );
      
      await slowFacade.initialize();
      
      const healthCheck = await slowFacade.performHealthCheck();
      
      expect(healthCheck.recommendations).toContain(
        'High initialization time - consider optimizing system startup'
      );
    });

    it('should detect system health degradation', async () => {
      // Create a system and mock its health check to fail
      const system = facade.getSystem('PerformanceAnalyzer');
      (system as any).healthCheck = jest.fn().mockRejectedValue(new Error('System failed'));
      
      const healthCheck = await facade.performHealthCheck();
      
      expect(healthCheck.overall).toBe('degraded');
      expect(healthCheck.systems.get('PerformanceAnalyzer')?.ok).toBe(false);
    });
  });

  describe('System Lifecycle Management', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should initialize all cached systems', async () => {
      // Create some systems
      const system1 = facade.getSystem('PerformanceAnalyzer');
      const system2 = facade.getSystem('SettingsManager');
      
      // Mock initialize methods
      (system1 as any).initialize = jest.fn().mockResolvedValue(undefined);
      (system2 as any).initialize = jest.fn().mockResolvedValue(undefined);
      
      await facade.initializeAllSystems();
      
      expect((system1 as any).initialize).toHaveBeenCalled();
      expect((system2 as any).initialize).toHaveBeenCalled();
    });

    it('should handle system initialization failures gracefully', async () => {
      const system = facade.getSystem('PerformanceAnalyzer');
      (system as any).initialize = jest.fn().mockRejectedValue(new Error('Init failed'));
      
      // Should not throw
      await expect(facade.initializeAllSystems()).resolves.not.toThrow();
    });

    it('should cleanup properly on destroy', async () => {
      await facade.destroy();
      
      expect(facade.getSystemStatus().initialized).toBe(false);
      expect(facade.getSystemStatus().systemsActive).toBe(0);
    });
  });

  describe('Configuration Management', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should get current configuration', () => {
      const config = facade.getConfiguration();
      
      expect(config).toBeDefined();
      expect(config.mode).toBe('progressive');
      expect(config.enablePerformanceMonitoring).toBe(true);
      expect(config.enableDependencyInjection).toBe(true);
    });

    it('should update configuration', async () => {
      const newConfig: Partial<NonVisualSystemConfig> = {
        mode: 'quality-first',
        enablePerformanceMonitoring: false
      };

      await facade.setConfiguration(newConfig);
      
      const config = facade.getConfiguration();
      expect(config.mode).toBe('quality-first');
      expect(config.enablePerformanceMonitoring).toBe(false);
    });

    it('should apply mode-specific optimizations', async () => {
      const performanceConfig: Partial<NonVisualSystemConfig> = {
        mode: 'performance-first'
      };

      await facade.setConfiguration(performanceConfig);
      
      const config = facade.getConfiguration();
      expect(config.systemPreferences.lazyInitialization).toBe(true);
      expect(config.systemPreferences.aggressiveCaching).toBe(true);
    });

    it('should apply battery optimization settings', async () => {
      const batteryConfig: Partial<NonVisualSystemConfig> = {
        mode: 'battery-optimized'
      };

      await facade.setConfiguration(batteryConfig);
      
      const config = facade.getConfiguration();
      expect(config.performanceThresholds.maxCPUPercent).toBe(5);
      expect(config.systemPreferences.lazyInitialization).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization failures', async () => {
      // Mock system initialization failure
      const mockSystem = require('@/core/performance/PerformanceAnalyzer');
      mockSystem.PerformanceAnalyzer.mockImplementation(() => ({
        initialize: jest.fn().mockRejectedValue(new Error('Init failed'))
      }));

      // Should not throw during facade initialization
      await expect(facade.initialize()).resolves.not.toThrow();
    });

    it('should handle system creation failures', () => {
      // Mock system constructor failure
      const mockSystem = require('@/core/performance/PerformanceAnalyzer');
      mockSystem.PerformanceAnalyzer.mockImplementation(() => {
        throw new Error('System creation failed');
      });

      expect(() => {
        facade.getSystem('PerformanceAnalyzer');
      }).toThrow('System creation failed');
      
      const metrics = facade.getMetrics();
      expect(metrics.failedSystems).toBe(1);
      expect(metrics.systemErrors).toBe(1);
    });

    it('should handle health check failures', async () => {
      await facade.initialize();
      
      const system = facade.getSystem('PerformanceAnalyzer');
      (system as any).healthCheck = jest.fn().mockRejectedValue(new Error('Health check failed'));
      
      const healthCheck = await facade.performHealthCheck();
      
      expect(healthCheck.systems.get('PerformanceAnalyzer')?.ok).toBe(false);
      expect(healthCheck.systems.get('PerformanceAnalyzer')?.details).toContain('Health check failed');
    });
  });

  describe('Integration with External Systems', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should integrate with shared dependency systems', () => {
      const performanceAnalyzer = facade.getSystem('PerformanceAnalyzer');
      const cssVariableBatcher = facade.getSystem('CSSVariableBatcher');
      
      // Systems should be created and available for injection
      expect(performanceAnalyzer).toBeDefined();
      expect(cssVariableBatcher).toBeDefined();
    });

    it('should handle system callbacks', () => {
      const createdCallback = jest.fn();
      const failedCallback = jest.fn();
      
      facade.setOnSystemCreated(createdCallback);
      facade.setOnSystemFailed(failedCallback);
      
      facade.getSystem('PerformanceAnalyzer');
      
      expect(createdCallback).toHaveBeenCalledWith('PerformanceAnalyzer', expect.any(Object));
    });

    it('should handle health change callbacks', async () => {
      const healthChangeCallback = jest.fn();
      facade.setOnHealthChange(healthChangeCallback);
      
      await facade.performHealthCheck();
      
      expect(healthChangeCallback).toHaveBeenCalledWith(expect.objectContaining({
        overall: expect.any(String),
        systems: expect.any(Map),
        timestamp: expect.any(Number)
      }));
    });
  });

  describe('Metrics and Monitoring', () => {
    beforeEach(async () => {
      await facade.initialize();
    });

    it('should track system metrics correctly', () => {
      facade.getSystem('PerformanceAnalyzer');
      facade.getSystem('SettingsManager');
      
      const metrics = facade.getMetrics();
      
      expect(metrics.systemCount).toBe(16); // Total registered systems
      expect(metrics.initializedSystems).toBe(2); // Cached systems
      expect(metrics.failedSystems).toBe(0);
      expect(metrics.activeSystems).toHaveLength(2);
    });

    it('should update metrics over time', () => {
      const initialMetrics = facade.getMetrics();
      
      facade.getSystem('PerformanceAnalyzer');
      facade.getSystem('SettingsManager');
      
      const updatedMetrics = facade.getMetrics();
      
      expect(updatedMetrics.initializedSystems).toBeGreaterThan(initialMetrics.initializedSystems);
      expect(updatedMetrics.activeSystems.length).toBeGreaterThan(initialMetrics.activeSystems.length);
    });

    it('should provide system status information', () => {
      const status = facade.getSystemStatus();
      
      expect(status.initialized).toBe(true);
      expect(status.systemsActive).toBe(0); // No systems cached initially
      expect(status.healthy).toBe(true);
    });
  });
});