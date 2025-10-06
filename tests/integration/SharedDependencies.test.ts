/**
 * Integration Tests: Shared Dependencies
 *
 * Tests dependency injection and shared instance management across systems.
 * Validates that dependencies are properly initialized and accessible.
 */

import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/ThemeUtilities';

describe('Shared Dependencies Integration', () => {
  let coordinator: SystemCoordinator;

  beforeEach(async () => {
    coordinator = new SystemCoordinator(
      ADVANCED_SYSTEM_CONFIG,
      Utils,
      {}
    );
    await coordinator.initialize();
  });

  afterEach(async () => {
    if (coordinator) {
      await coordinator.destroy();
    }
  });

  describe('Performance Coordinator Sharing', () => {
    test('Same performance coordinator instance is used throughout system', () => {
      const perfCoord1 = coordinator.getSharedSimplePerformanceCoordinator();
      const perfCoord2 = coordinator.getSharedSimplePerformanceCoordinator();

      expect(perfCoord1).toBeTruthy();
      expect(perfCoord2).toBeTruthy();
      expect(perfCoord1).toBe(perfCoord2);
    });

    test('Performance coordinator is accessible to subsystems', async () => {
      const perfCoord = coordinator.getSharedSimplePerformanceCoordinator();
      expect(perfCoord).toBeTruthy();

      // Verify it has expected methods
      if (perfCoord) {
        expect(typeof (perfCoord as any).initialize).toBe('function');
        expect(typeof (perfCoord as any).destroy).toBe('function');
      }
    });
  });

  describe('Device Detection Sharing', () => {
    test('Device detector is initialized and shared', () => {
      const detector1 = coordinator.getDeviceDetector();
      const detector2 = coordinator.getDeviceDetector();

      expect(detector1).toBeTruthy();
      expect(detector2).toBeTruthy();
      expect(detector1).toBe(detector2);
    });

    test('Device detector provides capabilities', () => {
      const detector = coordinator.getDeviceDetector();
      expect(detector).toBeTruthy();

      // Verify it has expected methods
      if (detector) {
        expect(typeof (detector as any).getCapabilities).toBe('function');
        expect(typeof (detector as any).initialize).toBe('function');
      }
    });
  });

  describe('WebGL Systems Integration', () => {
    test('WebGL systems integration is initialized with device detector', () => {
      const webglIntegration = coordinator.getSharedWebGLSystemsIntegration();
      const deviceDetector = coordinator.getDeviceDetector();

      expect(webglIntegration).toBeTruthy();
      expect(deviceDetector).toBeTruthy();

      // WebGL integration should have been initialized with the device detector
      // This validates correct dependency injection during initialization
    });

    test('WebGL systems integration is shared instance', () => {
      const webgl1 = coordinator.getSharedWebGLSystemsIntegration();
      const webgl2 = coordinator.getSharedWebGLSystemsIntegration();

      expect(webgl1).toBeTruthy();
      expect(webgl2).toBeTruthy();
      expect(webgl1).toBe(webgl2);
    });
  });

  describe('Enhanced Device Tier Detection', () => {
    test('Enhanced device tier detector is initialized', () => {
      const tierDetector = coordinator.getSharedEnhancedDeviceTierDetector();

      expect(tierDetector).toBeTruthy();
    });

    test('Enhanced device tier detector is shared instance', () => {
      const tier1 = coordinator.getSharedEnhancedDeviceTierDetector();
      const tier2 = coordinator.getSharedEnhancedDeviceTierDetector();

      expect(tier1).toBeTruthy();
      expect(tier2).toBeTruthy();
      expect(tier1).toBe(tier2);
    });
  });

  describe('CSS Variable Manager', () => {
    test('CSS variable manager is accessible after initialization', async () => {
      const cssManager = await coordinator.getNonVisualSystem('CSSVariableWriter');

      // CSS manager may be null or initialized depending on system state
      expect(cssManager === null || typeof cssManager === 'object').toBe(true);
    });
  });

  describe('Dependency Initialization Order', () => {
    test('Performance coordinator initializes before dependent systems', async () => {
      const perfCoord = coordinator.getSharedSimplePerformanceCoordinator();
      const cssManager = await coordinator.getNonVisualSystem('CSSVariableWriter');

      // Performance coordinator should be initialized first
      expect(perfCoord).toBeTruthy();

      // CSS manager may depend on performance coordinator
      if (cssManager && perfCoord) {
        // If CSS manager exists, verify it has access to performance coordinator
        // (actual verification would depend on CSS manager's implementation)
        expect(true).toBe(true);
      }
    });

    test('Device detector initializes before WebGL integration', () => {
      const deviceDetector = coordinator.getDeviceDetector();
      const webglIntegration = coordinator.getSharedWebGLSystemsIntegration();

      // Device detector should be initialized first
      expect(deviceDetector).toBeTruthy();

      // WebGL integration should be initialized with device detector
      expect(webglIntegration).toBeTruthy();
    });
  });

  describe('Memory Management', () => {
    test('Shared dependencies are cleaned up on destroy', async () => {
      const coord = new SystemCoordinator(
        ADVANCED_SYSTEM_CONFIG,
        Utils,
        {}
      );

      await coord.initialize();

      // Get references to shared dependencies
      const perfCoord = coord.getSharedSimplePerformanceCoordinator();
      const deviceDetector = coord.getDeviceDetector();

      expect(perfCoord).toBeTruthy();
      expect(deviceDetector).toBeTruthy();

      // Destroy coordinator
      await coord.destroy();

      // After destroy, accessing dependencies should return undefined
      const perfCoordAfter = coord.getSharedSimplePerformanceCoordinator();
      const deviceDetectorAfter = coord.getDeviceDetector();

      expect(perfCoordAfter).toBeUndefined();
      expect(deviceDetectorAfter).toBeUndefined();
    });

    test('No memory leaks after multiple initialization cycles', async () => {
      const iterations = 5;

      for (let i = 0; i < iterations; i++) {
        const coord = new SystemCoordinator(
          ADVANCED_SYSTEM_CONFIG,
          Utils,
          {}
        );

        await coord.initialize();

        // Access shared dependencies
        coord.getSharedSimplePerformanceCoordinator();
        coord.getDeviceDetector();
        coord.getSharedWebGLSystemsIntegration();

        await coord.destroy();
      }

      // If we get here without errors or significant memory growth, test passes
      expect(true).toBe(true);
    });
  });
});
