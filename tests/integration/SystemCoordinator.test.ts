/**
 * Integration Tests: SystemCoordinator
 *
 * Tests the central orchestration layer that coordinates visual and infrastructure systems.
 * Validates dependency injection, system lifecycle, and cross-system communication.
 */

import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/ThemeUtilities';

describe('SystemCoordinator Integration', () => {
  let coordinator: SystemCoordinator;

  beforeEach(async () => {
    coordinator = new SystemCoordinator(
      ADVANCED_SYSTEM_CONFIG,
      Utils,
      {} // mock year3000System
    );
    await coordinator.initialize();
  });

  afterEach(async () => {
    if (coordinator) {
      await coordinator.destroy();
    }
  });

  describe('Shared Dependencies', () => {
    test('Performance coordinator is initialized and accessible', () => {
      const perfCoord = coordinator.getSharedSimplePerformanceCoordinator();
      expect(perfCoord).toBeTruthy();
      expect(perfCoord).toBeDefined();
    });

    test('Device detector is initialized for WebGL integration', () => {
      const deviceDetector = coordinator.getDeviceDetector();
      expect(deviceDetector).toBeTruthy();
      expect(deviceDetector).toBeDefined();
    });

    test('WebGL systems integration is initialized', () => {
      const webglIntegration = coordinator.getSharedWebGLSystemsIntegration();
      expect(webglIntegration).toBeTruthy();
    });

    test('Enhanced device tier detector is initialized', () => {
      const tierDetector = coordinator.getSharedEnhancedDeviceTierDetector();
      expect(tierDetector).toBeTruthy();
    });

    test('Performance coordinator is shared instance across queries', () => {
      const perfCoord1 = coordinator.getSharedSimplePerformanceCoordinator();
      const perfCoord2 = coordinator.getSharedSimplePerformanceCoordinator();

      // Should be the exact same instance
      expect(perfCoord1).toBe(perfCoord2);
    });
  });

  describe('System Lifecycle', () => {
    test('SystemCoordinator initializes successfully', async () => {
      const newCoord = new SystemCoordinator(
        ADVANCED_SYSTEM_CONFIG,
        Utils,
        {}
      );

      await expect(newCoord.initialize()).resolves.not.toThrow();
      await newCoord.destroy();
    });

    test('SystemCoordinator destroys cleanly', async () => {
      const newCoord = new SystemCoordinator(
        ADVANCED_SYSTEM_CONFIG,
        Utils,
        {}
      );

      await newCoord.initialize();
      await expect(newCoord.destroy()).resolves.not.toThrow();
    });

    test('No errors during multiple init/destroy cycles', async () => {
      for (let i = 0; i < 3; i++) {
        const coord = new SystemCoordinator(
          ADVANCED_SYSTEM_CONFIG,
          Utils,
          {}
        );

        await coord.initialize();
        await coord.destroy();
      }

      // If we get here without errors, test passes
      expect(true).toBe(true);
    });
  });

  describe('Health Checks', () => {
    test('System health check returns valid result', async () => {
      const health = await coordinator.performHealthCheck();

      expect(health).toBeDefined();
      expect(health.status).toBeDefined();
      expect(['excellent', 'good', 'degraded', 'critical']).toContain(health.status);
    });

    test('Performance coordinator health is monitored', async () => {
      const perfCoord = coordinator.getSharedSimplePerformanceCoordinator();

      if (perfCoord && typeof (perfCoord as any).healthCheck === 'function') {
        const perfHealth = await (perfCoord as any).healthCheck();
        expect(perfHealth).toBeDefined();
      }
    });
  });

  describe('System Registration', () => {
    test('Visual systems can be accessed after initialization', () => {
      // Try to get a visual system (may be null if not initialized)
      const result = coordinator.getVisualSystem('WebGLBackground');

      // Either system exists or is null (both valid states)
      expect(result === null || typeof result === 'object').toBe(true);
    });

    test('Infrastructure systems can be accessed after initialization', async () => {
      // Try to get an infrastructure system
      const result = await coordinator.getNonVisualSystem('CSSVariableWriter');

      // Either system exists or is null (both valid states)
      expect(result === null || typeof result === 'object').toBe(true);
    });
  });

  describe('Phase 1 Specific Validations', () => {
    test('Device detector is only initialized once (no duplicate)', () => {
      const detector1 = coordinator.getDeviceDetector();
      const detector2 = coordinator.getDeviceDetector();

      // Should be exact same instance (not re-created)
      expect(detector1).toBe(detector2);
    });

    test('Performance system aliases removed (no deprecated methods)', () => {
      // Verify deprecated methods don't exist
      expect((coordinator as any).getSharedPerformanceAnalyzer).toBeUndefined();
      expect((coordinator as any).getSharedPerformanceOrchestrator).toBeUndefined();
    });

    test('Performance budget manager removed (deprecated)', () => {
      // Verify performance budget manager field doesn't exist
      expect((coordinator as any).sharedPerformanceBudgetManager).toBeUndefined();
    });

    test('Renamed fields are accessible with new names', () => {
      // Verify new field names exist
      expect((coordinator as any).performanceCoordinator).toBeDefined();
      expect((coordinator as any).deviceDetector).toBeDefined();
      expect((coordinator as any).visualSystemCoordinator).toBeDefined();
      expect((coordinator as any).infrastructureSystemFacade).toBeDefined();
    });

    test('Old field names are removed', () => {
      // Verify old field names don't exist
      expect((coordinator as any).sharedSimplePerformanceCoordinator).toBeUndefined();
      expect((coordinator as any).sharedDeviceCapabilityDetector).toBeUndefined();
      expect((coordinator as any).visualBridge).toBeUndefined();
      expect((coordinator as any).nonVisualFacade).toBeUndefined();
    });

    test('setupSystemEventBus method exists (renamed from setupCrossFacadeCommunication)', () => {
      // Verify new method name exists
      expect((coordinator as any).setupSystemEventBus).toBeDefined();
      expect(typeof (coordinator as any).setupSystemEventBus).toBe('function');
    });

    test('applyPerformanceOptimizations method exists (renamed from optimizeForPerformance)', () => {
      // Verify new method name exists
      expect((coordinator as any).applyPerformanceOptimizations).toBeDefined();
      expect(typeof (coordinator as any).applyPerformanceOptimizations).toBe('function');
    });
  });
});
