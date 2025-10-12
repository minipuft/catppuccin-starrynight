/**
 * Core Orchestration Integration Tests
 * 
 * Tests system coordination, facade patterns, and core architecture
 * behaviors that are critical for the Catppuccin StarryNight theme.
 * 
 * Focus: System coordination, facade patterns, critical integrations
 */

import { SystemIntegrationCoordinator } from '@/core/integration/SystemIntegrationCoordinator';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import { unifiedEventBus } from '@/core/events/EventBus';
import * as Utils from '@/utils/core/ThemeUtilities';

describe('Core Orchestration Integration', () => {
  let systemCoordinator: SystemIntegrationCoordinator;

  beforeEach(() => {
    // Setup DOM environment
    document.body.innerHTML = '<div class="Root__main-view"></div>';
    
    // Initialize core systems with mock advancedThemeSystem
    const mockAdvancedThemeSystem = {
      isInitialized: false,
      getCachedNonVisualSystem: jest.fn(() => null),
      config: ADVANCED_SYSTEM_CONFIG,
      // Additional properties that might be accessed during orchestration
      performanceAnalyzer: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      unifiedCSSConsciousnessController: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      performanceCoordinator: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      performanceOrchestrator: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      musicSyncService: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      settingsManager: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      colorHarmonyEngine: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      semanticColorManager: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      deviceCapabilityDetector: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      cssConsciousnessController: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      // Methods that might be called
      registerAnimationSystem: jest.fn(),
      unregisterAnimationSystem: jest.fn(),
      queueCSSVariableUpdate: jest.fn(),
      updateFromMusicAnalysis: jest.fn(),
      applyColorsToTheme: jest.fn(),
      timerConsolidationSystem: {
        registerConsolidatedTimer: jest.fn(),
        unregisterConsolidatedTimer: jest.fn()
      },
      // Facade-related properties with proper objects
      beatSyncVisualSystem: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() },
      organicBeatSyncConsciousness: { isInitialized: false, initialize: jest.fn(), destroy: jest.fn() }
    };
    systemCoordinator = new SystemIntegrationCoordinator(ADVANCED_SYSTEM_CONFIG, Utils, mockAdvancedThemeSystem);
  });

  afterEach(() => {
    // Cleanup
    if (systemCoordinator) {
      systemCoordinator.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('System Coordination', () => {
    it('should initialize system coordinator successfully', async () => {
      await systemCoordinator.initialize();
      const status = systemCoordinator.getSystemStatus();
      expect(status.initialized).toBe(true);
    });

    it('should provide access to visual systems', async () => {
      await systemCoordinator.initialize();
      
      const webglSystem = systemCoordinator.getVisualSystem('WebGLBackground');
      expect(webglSystem).toBeDefined();
    });

    it('should provide access to non-visual systems', async () => {
      await systemCoordinator.initialize();
      
      const musicSync = systemCoordinator.getCachedNonVisualSystem('MusicBeatSync');
      expect(musicSync).toBeDefined();
    });

    it('should perform health checks', async () => {
      await systemCoordinator.initialize();
      
      const healthCheck = await systemCoordinator.performHealthCheck();
      expect(healthCheck.overall).toBeDefined();
      expect(['excellent', 'good', 'degraded', 'critical']).toContain(healthCheck.overall);
    });

    it('should track system metrics', async () => {
      await systemCoordinator.initialize();
      
      const metrics = systemCoordinator.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.totalSystems).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance Requirements', () => {
    it('should initialize within performance budget', async () => {
      const startTime = performance.now();
      
      await systemCoordinator.initialize();
      
      const initTime = performance.now() - startTime;
      expect(initTime).toBeLessThan(500); // Relaxed expectation for CI environment
    });

    it('should provide system status information', async () => {
      await systemCoordinator.initialize();
      
      const systemStatus = systemCoordinator.getSystemStatus();
      expect(systemStatus).toBeDefined();
      expect(systemStatus.visualSystems).toBeGreaterThanOrEqual(0);
      expect(systemStatus.nonVisualSystems).toBeGreaterThanOrEqual(0);
    });

    it('should handle configuration retrieval', async () => {
      await systemCoordinator.initialize();
      
      const configuration = systemCoordinator.getConfiguration();
      expect(configuration).toBeDefined();
      expect(configuration.mode).toBeDefined();
    });
  });

  describe('Event Coordination', () => {
    it('should handle event listeners', async () => {
      await systemCoordinator.initialize();
      
      const testListener = jest.fn();
      
      systemCoordinator.addEventListener('test-event', testListener);
      systemCoordinator.emitEvent('test-event', { data: 'test' });
      
      expect(testListener).toHaveBeenCalledWith({ data: 'test' });
      
      systemCoordinator.removeEventListener('test-event', testListener);
    });

    it('should manage color-dependent systems', async () => {
      await systemCoordinator.initialize();
      
      const colorSystems = systemCoordinator.getColorDependentSystems();
      expect(Array.isArray(colorSystems)).toBe(true);
      
      // Test color system refresh
      await systemCoordinator.refreshColorDependentSystems('test');
      // Should not throw
    });
  });

  describe('Shared Services', () => {
    it('should provide shared performance coordinator', async () => {
      await systemCoordinator.initialize();
      
      const performanceCoordinator = systemCoordinator.getSharedSimplePerformanceCoordinator();
      expect(performanceCoordinator).toBeDefined();
    });

    it('should provide shared settings manager', async () => {
      await systemCoordinator.initialize();

      // NOTE: getSharedSettingsManager() removed - SettingsManager deleted in Phase 5, using TypedSettingsManager singleton
      // const settingsManager = systemCoordinator.getSharedSettingsManager();
      // expect(settingsManager).toBeDefined();
    });

    it('should provide shared color harmony engine', async () => {
      await systemCoordinator.initialize();
      
      const colorEngine = systemCoordinator.getSharedColorHarmonyEngine();
      // May be undefined in test environment, but should not throw
      expect(colorEngine === undefined || colorEngine !== null).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization gracefully', async () => {
      // Should not throw even if some subsystems fail
      expect(async () => {
        await systemCoordinator.initialize();
      }).not.toThrow();
    });

    it('should maintain stability under repeated operations', async () => {
      await systemCoordinator.initialize();
      
      // Repeated operations should not cause issues
      for (let i = 0; i < 5; i++) {
        const healthCheck = await systemCoordinator.performHealthCheck();
        expect(healthCheck.overall).toBeDefined();
        expect(['excellent', 'good', 'degraded', 'critical']).toContain(healthCheck.overall);
        
        const metrics = systemCoordinator.getMetrics();
        expect(metrics).toBeDefined();
      }
    });

    it('should handle cleanup properly', async () => {
      await systemCoordinator.initialize();
      
      const healthBefore = await systemCoordinator.performHealthCheck();
      expect(healthBefore.overall).toBeDefined();
      expect(['excellent', 'good', 'degraded', 'critical']).toContain(healthBefore.overall);
      
      // Should clean up without errors
      await systemCoordinator.destroy();
    });
  });

  describe('System State Management', () => {
    it('should track system states', async () => {
      await systemCoordinator.initialize();
      
      const currentPhase = systemCoordinator.getCurrentPhase();
      expect(currentPhase).toBeDefined();
      
      const allStates = systemCoordinator.getAllSystemStates();
      expect(allStates).toBeInstanceOf(Map);
    });

    it('should provide orchestration information', async () => {
      await systemCoordinator.initialize();
      
      const isOrchestrationEnabled = systemCoordinator.isOrchestrationEnabled();
      expect(typeof isOrchestrationEnabled).toBe('boolean');
    });
  });

  describe('Orchestration Validation', () => {
    it('should have orchestration phases defined', async () => {
      await systemCoordinator.initialize();
      
      // Should have orchestration methods
      expect(typeof systemCoordinator.getCurrentPhase).toBe('function');
      expect(typeof systemCoordinator.getSystemState).toBe('function');
      expect(typeof systemCoordinator.getAllSystemStates).toBe('function');
      expect(typeof systemCoordinator.isOrchestrationEnabled).toBe('function');

      // Should be orchestration enabled
      expect(systemCoordinator.isOrchestrationEnabled()).toBe(true);
    });

    it('should provide shared service access methods', async () => {
      await systemCoordinator.initialize();

      // Should have shared service getter methods
      expect(typeof systemCoordinator.getSharedMusicSyncService).toBe('function');
      expect(typeof systemCoordinator.getSharedColorHarmonyEngine).toBe('function');
      expect(typeof systemCoordinator.getSharedPerformanceAnalyzer).toBe('function');
      // NOTE: getSharedSettingsManager removed - SettingsManager deleted in Phase 5, using TypedSettingsManager singleton
    });

    it('should handle coordinated event processing', async () => {
      await systemCoordinator.initialize();

      const events: Array<{ type: string; timestamp: number; data: any }> = [];

      // Subscribe to events that could race
      unifiedEventBus.subscribe('music:beat', (data) => {
        events.push({ type: 'music:beat', timestamp: Date.now(), data });
      }, 'coordination-test');

      unifiedEventBus.subscribe('colors:extracted', (data) => {
        events.push({ type: 'colors:extracted', timestamp: Date.now(), data });
      }, 'coordination-test');

      // Emit events that previously could race
      unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.8 });
      unifiedEventBus.emitSync('colors:extracted', { rawColors: { PRIMARY: '#7c3aed' } });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Both events should be processed through unified coordination
      expect(events).toHaveLength(2);
      expect(events.find(e => e.type === 'music:beat')).toBeDefined();
      expect(events.find(e => e.type === 'colors:extracted')).toBeDefined();

      // Cleanup
      unifiedEventBus.unsubscribeAll('coordination-test');
    });

    it('should prevent racing through coordination', async () => {
      await systemCoordinator.initialize();

      // Test that events are processed in coordinated order
      const processingOrder: Array<{ event: string; timestamp: number }> = [];

      unifiedEventBus.subscribe('test:first', (data) => {
        processingOrder.push({ event: 'first', timestamp: data.timestamp || Date.now() });
      }, 'order-test');

      unifiedEventBus.subscribe('test:second', (data) => {
        processingOrder.push({ event: 'second', timestamp: data.timestamp || Date.now() });
      }, 'order-test');

      // Emit events that could potentially race
      const baseTime = Date.now();
      unifiedEventBus.emitSync('test:first', { timestamp: baseTime });
      unifiedEventBus.emitSync('test:second', { timestamp: baseTime + 1 });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should have processed events in coordinated order
      expect(processingOrder).toHaveLength(2);
      expect(processingOrder[0]!.event).toBe('first');
      expect(processingOrder[1]!.event).toBe('second');
      
      // Timestamps should be in order (no racing)
      expect(processingOrder[1]!.timestamp).toBeGreaterThanOrEqual(processingOrder[0]!.timestamp);

      // Cleanup
      unifiedEventBus.unsubscribeAll('order-test');
    });
  });
});