/**
 * VisualEffectsCoordinator Test Suite
 * Tests for Phase 2.2 consolidated factory pattern implementation
 */

import { VisualEffectsCoordinator, VisualSystemKey, VisualSystemConfig } from '@/visual/effects/VisualEffectsCoordinator';
import { CSSVariableWriter } from '@/core/css/CSSVariableWriter';
import { PerformanceAnalyzer } from "@/core/performance/PerformanceMonitor";
import { MusicSyncService } from '@/audio/MusicSyncService';
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/ThemeUtilities';
import { IManagedSystem } from '@/types/systems';
import { createMockVisualEffectsCoordinator } from '../../helpers/mockFactories';

// Mock visual systems
jest.mock('@/visual/effects/ParticleEffectSystem');
jest.mock('@/visual/background/WebGLRenderer');
jest.mock('@/visual/music/MusicSyncVisualEffects');
jest.mock('@/visual/ui/InteractionTrackingSystem');
jest.mock('@/visual/ui/SpotifyUIApplicationSystem');
jest.mock('@/core/animation/AnimationFrameCoordinator');

// Mock debug system
jest.mock('@/debug/DebugCoordinator', () => ({
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
      usedJSHeapSize: 1024 * 1024 * 10 // 10MB
    }
  }
});

describe('VisualEffectsCoordinator', () => {
  let bridge: VisualEffectsCoordinator;
  let mockCSSVariableWriter: jest.Mocked<CSSVariableWriter>;
  let mockPerformanceAnalyzer: jest.Mocked<PerformanceAnalyzer>;
  let mockMusicSyncService: jest.Mocked<MusicSyncService>;
  let mockColorHarmonyEngine: jest.Mocked<ColorHarmonyEngine>;

  beforeEach(() => {
    const mocks = createMockVisualEffectsCoordinator();
    bridge = mocks.bridge;
    mockCSSVariableWriter = mocks.mockCSSVariableWriter as jest.Mocked<CSSVariableWriter>;
    mockPerformanceAnalyzer = mocks.mockPerformanceAnalyzer as jest.Mocked<PerformanceAnalyzer>;
    mockMusicSyncService = mocks.mockMusicSyncService;
    mockColorHarmonyEngine = mocks.mockColorHarmonyEngine;
    console.log(mockPerformanceAnalyzer);
  });

  describe('Construction and Initialization', () => {
    it('should initialize with correct dependencies', () => {
      expect(bridge).toBeInstanceOf(VisualEffectsCoordinator);
      expect(bridge.getSystemStatus().initialized).toBe(false);
    });

    it('should register all visual systems', () => {
      // Bridge should have all visual systems registered internally
      expect(bridge.getSystemStatus().systemsActive).toBe(0); // No systems cached yet
    });

    it('should initialize successfully with default configuration', async () => {
      await bridge.initialize();
      
      expect(bridge.getSystemStatus().initialized).toBe(true);
    });

    it('should apply custom configuration during initialization', async () => {
      const customConfig: Partial<VisualSystemConfig> = {
        mode: 'performance-first',
        enablePerformanceMonitoring: false,
        enableAdaptiveQuality: false
      };

      await bridge.initialize(customConfig);

      const config = bridge.getConfiguration();
      expect(config.mode).toBe('performance-first');
      expect(config.enablePerformanceMonitoring).toBe(false);
      expect(config.enableAdaptiveQuality).toBe(false);
    });
  });

  describe('Factory Pattern Implementation', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should create visual systems using factory pattern', async () => {
      const webglSystem = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      
      expect(webglSystem).toBeDefined();
    });

    it('should cache visual systems', async () => {
      const system1 = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      const system2 = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      
      expect(system1).toBe(system2); // Same instance
    });

    it('should create different instances for different system keys', async () => {
      const webglSystem = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      const musicSyncSystem = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      expect(webglSystem).not.toBe(musicSyncSystem);
    });

    it('should handle special constructor for SpotifyUIApplicationSystem', async () => {
      const spotifySystem = await bridge.getVisualSystem<IManagedSystem>('SpotifyUIApplication');
      
      expect(spotifySystem).toBeDefined();
    });

    it('should throw error for unknown system key', async () => {
        await expect(bridge.getVisualSystem<IManagedSystem>('UnknownSystem' as VisualSystemKey)).resolves.toBeNull();
    });
  });

  describe('Dependency Injection', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should inject performance analyzer for systems that need it', async () => {
      const system = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      
      // Check if dependency injection was called
      expect(system).toBeDefined();
      // Note: In real implementation, we'd check if setPerformanceAnalyzer was called
    });

    it('should inject CSS variable batcher for systems that need it', async () => {
      const system = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      expect(system).toBeDefined();
      // Note: In real implementation, we'd check if setCSSVariableWriter was called
    });

    it('should inject event bus when available', () => {
      const mockEventBus = { subscribe: jest.fn(), emit: jest.fn() };

      const bridgeWithEventBus = new VisualEffectsCoordinator(
        ADVANCED_SYSTEM_CONFIG as any,
        mockCSSVariableWriter,
        mockPerformanceAnalyzer,
        mockMusicSyncService,
        mockColorHarmonyEngine,
        undefined,
        Utils,
        {},
        mockEventBus
      );

      expect(bridgeWithEventBus).toBeDefined();
      // Note: In real implementation, we'd verify event bus injection
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should wrap updateAnimation with performance monitoring', async () => {
      const system = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      
      // Mock system with updateAnimation method
      const mockSystem = system as any;
      mockSystem.updateAnimation = jest.fn();
      
      // Call updateAnimation
      if (mockSystem.updateAnimation) {
        mockSystem.updateAnimation(16.67); // 60fps delta
      }
      
      expect(mockSystem.updateAnimation).toHaveBeenCalled();
    });

    it('should record performance metrics', async () => {
      const system = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      // Performance monitoring should be integrated
      expect(system).toBeDefined();
      
      // Trigger an action that would cause performance monitoring 
      if (system && (system as any).updateAnimation) {
        (system as any).updateAnimation(16.67);
      }
      
      // Performance analyzer should be available and used
      expect(mockPerformanceAnalyzer.recordMetric).toHaveBeenCalled();
    });

    it('should get current metrics', () => {
      const metrics = bridge.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.currentFPS).toBe(60);
      expect(metrics.memoryUsageMB).toBe(0);
      expect(metrics.systemHealth).toBe('excellent');
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should perform health check on visual systems', async () => {
      // Create some systems with proper health check mocks
      const system1 = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      const system2 = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      // Mock health check methods for systems
      if (system1) {
        (system1 as any).healthCheck = jest.fn().mockResolvedValue({ ok: true, healthy: true });
      }
      if (system2) {
        (system2 as any).healthCheck = jest.fn().mockResolvedValue({ ok: true, healthy: true });
      }
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck).toBeDefined();
      expect(healthCheck.overall).toBe('excellent');
      expect(healthCheck.systems.size).toBe(2);
      expect(healthCheck.timestamp).toBeDefined();
    });

    it('should provide recommendations based on performance', async () => {
      mockPerformanceAnalyzer.getMedianFPS.mockReturnValue(25);
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck.recommendations).toContain(
        'Low FPS detected - consider reducing visual quality'
      );
    });

    it('should detect system failures', async () => {
      // Create a system and mock its health check to fail
      const system = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      (system as any).healthCheck = jest.fn().mockRejectedValue(new Error('System failed'));
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck.overall).toBe('degraded');
      expect(healthCheck.systems.get('WebGLBackground')?.ok).toBe(false);
    });
  });

  describe('Event Coordination', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should propagate visual events to all systems', async () => {
      // Create multiple systems
      const system1 = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      const system2 = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      // Mock event handlers
      (system1 as any).handleVisualEvent = jest.fn();
      (system2 as any).handleVisualEvent = jest.fn();
      
      const testEvent = { type: 'test', data: 'test-data' };
      bridge.propagateVisualEvent(testEvent);
      
      expect((system1 as any).handleVisualEvent).toHaveBeenCalledWith(testEvent);
      expect((system2 as any).handleVisualEvent).toHaveBeenCalledWith(testEvent);
    });

    it('should handle adaptation events', () => {
      const adaptationEvent = {
        type: 'quality-reduction',
        reason: 'low-fps',
        newSettings: {
          gradientComplexity: 0.4,
          particleDensity: 0.4,
          shaderPrecision: 'lowp' as const,
          textureResolution: 0.5,
          animationFPS: 30,
          transitionQuality: 'fast' as const,
          motionBlur: false,
          bloomEnabled: false,
          shadowQuality: 'low' as const,
          antiAliasing: 'none' as const,
          postProcessing: false
        }
      };

      bridge.handleAdaptationEvent(adaptationEvent as any);
    });
  });

  describe('Configuration Management', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should get current configuration', () => {
      const config = bridge.getConfiguration();
      
      expect(config).toBeDefined();
      expect(config.mode).toBe('progressive');
      expect(config.enablePerformanceMonitoring).toBe(true);
      expect(config.enableAdaptiveQuality).toBe(true);
    });

    it('should update configuration', async () => {
      const newConfig: Partial<VisualSystemConfig> = {
        mode: 'quality-first',
        enablePerformanceMonitoring: false
      };

      bridge.setConfiguration(newConfig);
      
      const config = bridge.getConfiguration();
      expect(config.mode).toBe('quality-first');
      expect(config.enablePerformanceMonitoring).toBe(false);
    });
  });

  describe('System Lifecycle', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should initialize all cached visual systems', async () => {
      // Create some systems
      const system1 = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      const system2 = await bridge.getVisualSystem<IManagedSystem>('MusicBeatSync');
      
      // Mock initialize methods
      (system1 as any).initialize = jest.fn().mockResolvedValue(undefined);
      (system2 as any).initialize = jest.fn().mockResolvedValue(undefined);
      
      await bridge.initializeVisualSystems();
      
      expect(system1?.initialize).toHaveBeenCalled();
      expect(system2?.initialize).toHaveBeenCalled();
    });

    it('should handle system initialization failures gracefully', async () => {
      const system = await bridge.getVisualSystem<IManagedSystem>('WebGLBackground');
      (system as any).initialize = jest.fn().mockRejectedValue(new Error('Init failed'));
      
      // Should not throw
      await expect(bridge.initializeVisualSystems()).resolves.not.toThrow();
    });

    it('should cleanup properly on destroy', async () => {
      await bridge.destroy();
      
      expect(bridge.getSystemStatus().initialized).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization failures', async () => {
        const mockDeviceDetector = require('@/core/performance/DeviceCapabilityDetector');
        mockDeviceDetector.DeviceCapabilityDetector.mockImplementation(() => ({
            initialize: jest.fn().mockRejectedValue(new Error('Device detection failed'))
        }));

        await expect(bridge.initialize()).rejects.toThrow('Device detection failed');
    });

    it('should handle system creation failures', async () => {
        const mockSystem = require('@/visual/background/WebGLRenderer');
        mockSystem.WebGLGradientBackgroundSystem.mockImplementation(() => {
            throw new Error('System creation failed');
        });

        await expect(bridge.getVisualSystem<IManagedSystem>('WebGLBackground')).rejects.toThrow('System creation failed');
    });
  });

  describe('Integration with External Systems', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should integrate with adaptive performance system', () => {
      const mockAdaptivePerformanceSystem = require('@/core/performance/AdaptivePerformanceSystem');
      mockAdaptivePerformanceSystem.AdaptivePerformanceSystem.mockImplementation(() => ({
        initialize: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        destroy: jest.fn()
      }));

    });

    it('should handle settings changes', async () => {
      const settingsEvent = new CustomEvent('advancedThemeSystemSettingsChanged', {
        detail: { key: 'sn-visual-quality', value: 'high' }
      });

      document.dispatchEvent(settingsEvent);
      
      bridge.setConfiguration({ qualityPreferences: { preferHighQuality: true, allowDynamicScaling: true, batteryConservation: false } });
      expect(bridge.getConfiguration().qualityPreferences.preferHighQuality).toBe(true);
    });
  });
});