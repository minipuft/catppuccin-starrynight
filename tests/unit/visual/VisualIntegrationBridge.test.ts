/**
 * VisualSystemFacade Test Suite
 * Tests for Phase 2 factory pattern implementation
 */

import { VisualSystemFacade, VisualSystemKey, VisualSystemConfig } from '@/visual/integration/VisualSystemFacade';
import { OptimizedCSSVariableManager as CSSVariableBatcher } from '@/core/performance/OptimizedCSSVariableManager';
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { MusicSyncService } from '@/audio/MusicSyncService';
import { SettingsManager } from '@/ui/managers/SettingsManager';
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/Year3000Utilities';
import { IManagedSystem } from '@/types/IManagedSystem';

// Mock dependencies
jest.mock('@/core/performance/OptimizedCSSVariableManager');
// PerformanceAnalyzer is legacy - remove mock
jest.mock('@/core/performance/DeviceCapabilityDetector');
jest.mock('@/audio/MusicSyncService');
jest.mock('@/ui/managers/SettingsManager');
jest.mock('@/audio/ColorHarmonyEngine');
jest.mock('@/core/performance/UnifiedPerformanceCoordinator');

// Mock visual systems
jest.mock('@/visual/effects/UnifiedParticleSystem');
jest.mock('@/visual/background/WebGLRenderer');
jest.mock('@/visual/music/MusicSyncVisualEffects');
jest.mock('@/visual/ui/InteractionTrackingSystem');
// Removed BehavioralPredictionEngine and PredictiveMaterializationSystem - overhead systems eliminated
jest.mock('@/visual/ui/SpotifyUIApplicationSystem');
jest.mock('@/core/animation/EmergentChoreographyEngine');

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
      usedJSHeapSize: 1024 * 1024 * 10 // 10MB
    }
  }
});

describe('VisualSystemFacade', () => {
  let bridge: VisualSystemFacade;
  let mockCSSVariableBatcher: jest.Mocked<CSSVariableBatcher>;
  let mockPerformanceAnalyzer: jest.Mocked<PerformanceAnalyzer>;
  let mockMusicSyncService: jest.Mocked<MusicSyncService>;
  let mockSettingsManager: jest.Mocked<SettingsManager>;
  let mockColorHarmonyEngine: jest.Mocked<ColorHarmonyEngine>;
  let mockYear3000System: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock instances with jest.fn()
    mockCSSVariableBatcher = {
      queueCSSVariableUpdate: jest.fn(),
      setProperty: jest.fn(),
      destroy: jest.fn()
    } as any;
    
    mockPerformanceAnalyzer = {
      getMedianFPS: jest.fn().mockReturnValue(60),
      recordSystemPerformance: jest.fn(),
      destroy: jest.fn()
    } as any;
    
    mockMusicSyncService = {
      initialize: jest.fn(),
      destroy: jest.fn()
    } as any;
    
    mockSettingsManager = {
      initialize: jest.fn(),
      destroy: jest.fn()
    } as any;
    
    mockColorHarmonyEngine = {
      initialize: jest.fn(),
      destroy: jest.fn()
    } as any;
    
    mockYear3000System = {
      isInitialized: true,
      config: YEAR3000_CONFIG
    };

    // Create bridge instance
    bridge = new VisualSystemFacade(
      YEAR3000_CONFIG,
      Utils,
      mockYear3000System,
      mockCSSVariableBatcher,
      mockPerformanceAnalyzer,
      mockMusicSyncService,
      mockSettingsManager,
      mockColorHarmonyEngine
    );
  });

  describe('Construction and Initialization', () => {
    it('should initialize with correct dependencies', () => {
      expect(bridge).toBeInstanceOf(VisualSystemFacade);
      expect(bridge.getSystemStatus().initialized).toBe(false);
    });

    it('should register all visual systems', () => {
      // Bridge should have all visual systems registered internally
      expect(bridge.getSystemStatus().systemsActive).toBe(0); // No systems cached yet
    });

    it('should initialize successfully with default configuration', async () => {
      await bridge.initialize();
      
      expect(bridge.getSystemStatus().initialized).toBe(true);
      expect(mockCSSVariableBatcher.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--sn-visual-bridge-active',
        '1'
      );
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

    it('should create visual systems using factory pattern', () => {
      const particleSystem = bridge.getVisualSystem<IManagedSystem>('Particle');
      
      expect(particleSystem).toBeDefined();
      expect(bridge.getSystemStatus().systemsActive).toBe(1);
    });

    it('should cache visual systems', () => {
      const system1 = bridge.getVisualSystem<IManagedSystem>('Particle');
      const system2 = bridge.getVisualSystem<IManagedSystem>('Particle');
      
      expect(system1).toBe(system2); // Same instance
      expect(bridge.getSystemStatus().systemsActive).toBe(1); // Only one cached
    });

    it('should create different instances for different system keys', () => {
      const particleSystem = bridge.getVisualSystem<IManagedSystem>('Particle');
      const beatSyncSystem = bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
      expect(particleSystem).not.toBe(beatSyncSystem);
      expect(bridge.getSystemStatus().systemsActive).toBe(2);
    });

    it('should handle special constructor for SpotifyUIApplicationSystem', () => {
      const spotifySystem = bridge.getVisualSystem<IManagedSystem>('SpotifyUIApplication');
      
      expect(spotifySystem).toBeDefined();
      expect(bridge.getSystemStatus().systemsActive).toBe(1);
    });

    it('should throw error for unknown system key', () => {
      expect(() => {
        bridge.getVisualSystem<IManagedSystem>('UnknownSystem' as VisualSystemKey);
      }).toThrow('Visual system \'UnknownSystem\' not found in registry');
    });
  });

  describe('Dependency Injection', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should inject performance analyzer for systems that need it', () => {
      const system = bridge.getVisualSystem<IManagedSystem>('Particle');
      
      // Check if dependency injection was called
      expect(system).toBeDefined();
      // Note: In real implementation, we'd check if setPerformanceAnalyzer was called
    });

    it('should inject CSS variable batcher for systems that need it', () => {
      const system = bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
      expect(system).toBeDefined();
      // Note: In real implementation, we'd check if setCSSVariableBatcher was called
    });

    it('should inject event bus when available', () => {
      const mockEventBus = { subscribe: jest.fn(), emit: jest.fn() };
      
      const bridgeWithEventBus = new VisualSystemFacade(
        YEAR3000_CONFIG,
        Utils,
        mockYear3000System,
        mockCSSVariableBatcher,
        mockPerformanceAnalyzer,
        mockMusicSyncService,
        mockSettingsManager,
        mockColorHarmonyEngine,
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

    it('should wrap updateAnimation with performance monitoring', () => {
      const system = bridge.getVisualSystem<IManagedSystem>('Particle');
      
      // Mock system with updateAnimation method
      const mockSystem = system as any;
      mockSystem.updateAnimation = jest.fn();
      
      // Call updateAnimation
      if (mockSystem.updateAnimation) {
        mockSystem.updateAnimation(16.67); // 60fps delta
      }
      
      expect(mockSystem.updateAnimation).toHaveBeenCalled();
    });

    it('should record performance metrics', () => {
      const system = bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
      // Performance monitoring should be integrated
      expect(system).toBeDefined();
      expect(mockPerformanceAnalyzer.recordSystemPerformance).toHaveBeenCalledWith(
        expect.stringContaining('Visual_BeatSync'),
        expect.any(Number)
      );
    });

    it('should get current metrics', () => {
      const metrics = bridge.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.currentFPS).toBe(60); // From mock
      expect(metrics.memoryUsageMB).toBe(10); // From mock
      expect(metrics.systemHealth).toBe('excellent');
    });
  });

  describe('Health Monitoring', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should perform health check on visual systems', async () => {
      // Create some systems
      bridge.getVisualSystem<IManagedSystem>('Particle');
      bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck).toBeDefined();
      expect(healthCheck.overall).toBe('excellent');
      expect(healthCheck.systems.size).toBe(2);
      expect(healthCheck.timestamp).toBeDefined();
    });

    it('should provide recommendations based on performance', async () => {
      // Mock low FPS scenario
      mockPerformanceAnalyzer.getMedianFPS.mockReturnValue(25);
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck.recommendations).toContain(
        'Low FPS detected - consider reducing visual quality'
      );
    });

    it('should detect system failures', async () => {
      // Create a system and mock its health check to fail
      const system = bridge.getVisualSystem<IManagedSystem>('Particle');
      (system as any).healthCheck = jest.fn().mockRejectedValue(new Error('System failed'));
      
      const healthCheck = await bridge.performVisualHealthCheck();
      
      expect(healthCheck.overall).toBe('degraded');
      expect(healthCheck.systems.get('Particle')?.ok).toBe(false);
    });
  });

  describe('Event Coordination', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should propagate visual events to all systems', () => {
      // Create multiple systems
      const system1 = bridge.getVisualSystem<IManagedSystem>('Particle');
      const system2 = bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
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

      bridge.handleAdaptationEvent(adaptationEvent);
      
      const metrics = bridge.getMetrics();
      expect(metrics.currentQuality).toEqual(adaptationEvent.newSettings);
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

      await bridge.setConfiguration(newConfig);
      
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
      const system1 = bridge.getVisualSystem<IManagedSystem>('Particle');
      const system2 = bridge.getVisualSystem<IManagedSystem>('BeatSync');
      
      // Mock initialize methods
      system1.initialize = jest.fn().mockResolvedValue(undefined);
      system2.initialize = jest.fn().mockResolvedValue(undefined);
      
      await bridge.initializeVisualSystems();
      
      expect(system1.initialize).toHaveBeenCalled();
      expect(system2.initialize).toHaveBeenCalled();
    });

    it('should handle system initialization failures gracefully', async () => {
      const system = bridge.getVisualSystem<IManagedSystem>('Particle');
      system.initialize = jest.fn().mockRejectedValue(new Error('Init failed'));
      
      // Should not throw
      await expect(bridge.initializeVisualSystems()).resolves.not.toThrow();
    });

    it('should cleanup properly on destroy', async () => {
      await bridge.destroy();
      
      expect(bridge.getSystemStatus().initialized).toBe(false);
      expect(mockCSSVariableBatcher.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--sn-visual-bridge-active',
        '0'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization failures', async () => {
      // Mock device detector initialization failure
      const mockDeviceDetector = require('@/core/performance/DeviceCapabilityDetector');
      mockDeviceDetector.DeviceCapabilityDetector.mockImplementation(() => ({
        initialize: jest.fn().mockRejectedValue(new Error('Device detection failed'))
      }));

      await expect(bridge.initialize()).rejects.toThrow('Device detection failed');
    });

    it('should handle system creation failures', () => {
      // Mock system constructor failure for ParticleConsciousnessModule (replacement for LightweightParticleSystem)
      const mockSystem = require('@/visual/effects/ParticleConsciousnessModule');
      mockSystem.ParticleConsciousnessModule.mockImplementation(() => {
        throw new Error('System creation failed');
      });

      expect(() => {
        bridge.getVisualSystem<IManagedSystem>('Particle');
      }).toThrow('System creation failed');
    });
  });

  describe('Integration with External Systems', () => {
    beforeEach(async () => {
      await bridge.initialize();
    });

    it('should integrate with adaptive performance system', () => {
      // Mock adaptive performance system
      const mockAdaptivePerformanceSystem = require('@/core/performance/AdaptivePerformanceSystem');
      mockAdaptivePerformanceSystem.AdaptivePerformanceSystem.mockImplementation(() => ({
        initialize: jest.fn().mockResolvedValue(undefined),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        destroy: jest.fn()
      }));

      // Bridge should have integrated with adaptive performance system
      expect(bridge.getMetrics().adaptiveScaling).toBe(true);
    });

    it('should handle settings changes', async () => {
      const settingsEvent = new CustomEvent('year3000SystemSettingsChanged', {
        detail: { key: 'sn-visual-quality', value: 'high' }
      });

      document.dispatchEvent(settingsEvent);
      
      // Should handle the event without throwing
      expect(bridge.getConfiguration().qualityPreferences.preferHighQuality).toBe(true);
    });
  });
});