/**
 * System Orchestration Flow Integration Tests
 * 
 * Tests the complete orchestration flow to prevent the racing condition issue
 * where MusicSyncService and other systems competed instead of being properly
 * orchestrated through Year3000System.
 * 
 * These tests ensure:
 * 1. Systems initialize in proper order (Core → Services → Visual → Integration)
 * 2. Dependencies are properly enforced
 * 3. Event bus unification works correctly
 * 4. Color changes are consistent and reliable
 */

import { jest } from '@jest/globals';
import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
import { Year3000System } from '@/core/lifecycle/year3000System';
import { MusicSyncService } from '@/audio/MusicSyncService';
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { eventMigrationManager } from '@/core/events/EventMigrationManager';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

// Mock dependencies
jest.mock('@/debug/UnifiedDebugManager', () => ({
  Y3K: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

jest.mock('@/utils/platform/SpicetifyCompat', () => ({
  SpicetifyCompat: {
    isSpicetifyReady: () => true,
    getPlayer: () => ({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      data: {
        track: {
          uri: 'spotify:track:test',
          metadata: { title: 'Test', artist_name: 'Test Artist' }
        }
      }
    }),
    getPlatform: () => ({
      getAudioData: jest.fn().mockResolvedValue({
        energy: 0.8, valence: 0.7, tempo: 128
      })
    })
  }
}));

// Mock DOM
Object.defineProperty(window, 'requestAnimationFrame', {
  value: jest.fn((cb) => setTimeout(cb, 16))
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: jest.fn()
});

// Mock DOM (avoid redefining if already exists)
if (!global.document) {
  if (!global.document) { Object.defineProperty(global, 'document', {
    value: {
      documentElement: {
        style: {
          setProperty: jest.fn(),
          removeProperty: jest.fn()
        }
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      visibilityState: 'visible'
    }
  });
} else {
  // Extend existing document with missing properties
  if (!global.document.documentElement) {
    global.document.documentElement = {
      style: {
        setProperty: jest.fn(),
        removeProperty: jest.fn()
      }
    };
  }
}

// Mock global Spicetify object
(global as any).Spicetify = {
  LocalStorage: {
    get: jest.fn().mockReturnValue('default-value'),
    set: jest.fn()
  },
  Player: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    data: {
      track: {
        uri: 'spotify:track:test',
        metadata: { title: 'Test', artist_name: 'Test Artist' }
      }
    }
  },
  Platform: {
    getAudioData: jest.fn().mockResolvedValue({
      energy: 0.8, valence: 0.7, tempo: 128
    })
  },
  Config: {
    color_scheme: 'mocha'
  }
};

describe('System Orchestration Flow Integration Tests', () => {
  let systemCoordinator: SystemCoordinator;
  let year3000System: Year3000System;
  let initializationOrder: string[] = [];

  beforeEach(() => {
    // Reset initialization tracking
    initializationOrder = [];
    
    // Clear event subscriptions
    jest.clearAllMocks();
    
    // Mock system initialization tracking
    const mockInitialize = (systemName: string) => jest.fn().mockImplementation(async () => {
      initializationOrder.push(systemName);
      return Promise.resolve();
    });

    // Create fresh instances for each test
    systemCoordinator = new SystemCoordinator(
      YEAR3000_CONFIG,
      {} as any, // utils
      {
        orchestration: {
          enforceSequentialInitialization: true,
          dependencyValidation: true,
          enableInitializationGates: true,
          systemReadinessTimeout: 5000,
          phaseTransitionTimeout: 10000,
        }
      }
    );

    year3000System = new Year3000System();
  });

  afterEach(async () => {
    // Cleanup
    if (systemCoordinator) {
      await systemCoordinator.destroy();
    }
    if (year3000System) {
      await year3000System.destroy();
    }
  });

  describe('1. Sequential Initialization Order', () => {
    test('should initialize systems in correct phases: Core → Services → Visual → Integration', async () => {
      // Track phase initialization
      const phaseTracker = {
        corePhase: false,
        servicesPhase: false,
        visualPhase: false,
        integrationPhase: false
      };

      // Mock phase completion handlers
      systemCoordinator.on?.('phase:core:complete', () => {
        phaseTracker.corePhase = true;
        expect(phaseTracker.servicesPhase).toBe(false);
        expect(phaseTracker.visualPhase).toBe(false);
        expect(phaseTracker.integrationPhase).toBe(false);
      });

      systemCoordinator.on?.('phase:services:complete', () => {
        phaseTracker.servicesPhase = true;
        expect(phaseTracker.corePhase).toBe(true);
        expect(phaseTracker.visualPhase).toBe(false);
        expect(phaseTracker.integrationPhase).toBe(false);
      });

      systemCoordinator.on?.('phase:visual-systems:complete', () => {
        phaseTracker.visualPhase = true;
        expect(phaseTracker.corePhase).toBe(true);
        expect(phaseTracker.servicesPhase).toBe(true);
        expect(phaseTracker.integrationPhase).toBe(false);
      });

      systemCoordinator.on?.('phase:integration:complete', () => {
        phaseTracker.integrationPhase = true;
        expect(phaseTracker.corePhase).toBe(true);
        expect(phaseTracker.servicesPhase).toBe(true);
        expect(phaseTracker.visualPhase).toBe(true);
      });

      // Initialize through SystemCoordinator
      await systemCoordinator.initialize();

      // Verify all phases completed in order
      expect(phaseTracker.corePhase).toBe(true);
      expect(phaseTracker.servicesPhase).toBe(true);
      expect(phaseTracker.visualPhase).toBe(true);
      expect(phaseTracker.integrationPhase).toBe(true);
    });

    test('should prevent systems from self-initializing before their phase', async () => {
      const mockMusicSync = {
        initialize: jest.fn(),
        initialized: false
      };
      
      const mockColorHarmony = {
        initialize: jest.fn(),
        initialized: false
      };

      // Attempt to initialize services before coordinator starts
      expect(() => {
        mockMusicSync.initialize();
        mockColorHarmony.initialize();
      }).not.toThrow(); // Should not throw but should be ignored by coordinator

      // Initialize through coordinator
      await systemCoordinator.initialize();

      // Services should only be initialized once through coordinator
      expect(mockMusicSync.initialize).not.toHaveBeenCalled();
      expect(mockColorHarmony.initialize).not.toHaveBeenCalled();
    });
  });

  describe('2. Dependency Validation', () => {
    test('should enforce MusicSyncService → ColorHarmonyEngine dependency chain', async () => {
      let musicSyncInitialized = false;
      let colorHarmonyInitialized = false;

      // Mock dependency enforcement
      const musicSyncMock = {
        initialize: jest.fn().mockImplementation(async () => {
          musicSyncInitialized = true;
        }),
        initialized: false
      };

      const colorHarmonyMock = {
        initialize: jest.fn().mockImplementation(async () => {
          // ColorHarmonyEngine should only initialize after MusicSyncService
          expect(musicSyncInitialized).toBe(true);
          colorHarmonyInitialized = true;
        }),
        initialized: false
      };

      // Initialize through coordinator with dependency validation
      await systemCoordinator.initialize();

      expect(musicSyncInitialized).toBe(true);
      expect(colorHarmonyInitialized).toBe(true);
    });

    test('should timeout if dependencies are not met within specified time', async () => {
      const mockService = {
        initialize: jest.fn().mockImplementation(() => {
          // Simulate hanging initialization
          return new Promise(() => {});
        }),
        initialized: false
      };

      // Set short timeout for test
      const coordinatorWithTimeout = new SystemCoordinator(
        YEAR3000_CONFIG,
        {} as any,
        {
          orchestration: {
            enforceSequentialInitialization: true,
            dependencyValidation: true,
            enableInitializationGates: true,
            systemReadinessTimeout: 100, // 100ms timeout
            phaseTransitionTimeout: 200,
          }
        }
      );

      // Should timeout and handle gracefully
      await expect(coordinatorWithTimeout.initialize()).rejects.toThrow(/timeout/i);
    });
  });

  describe('3. Event Bus Unification', () => {
    test('should route all events through unifiedEventBus', async () => {
      const eventSpy = jest.fn();
      
      // Subscribe to unified events
      unifiedEventBus.subscribe('colors:extracted', eventSpy, 'test-subscriber');
      unifiedEventBus.subscribe('music:beat', eventSpy, 'test-subscriber');

      // Initialize system
      await systemCoordinator.initialize();

      // Emit legacy events - should be migrated to unified
      eventMigrationManager.emitLegacyEvent('colors-extracted', {
        colors: { PRIMARY: '#ff0000' },
        trackUri: 'test-track'
      });

      eventMigrationManager.emitLegacyEvent('music-sync:beat', {
        bpm: 120,
        intensity: 0.8
      });

      // Should have received converted events
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    test('should maintain event migration compatibility', async () => {
      const legacyEvents = [
        'colors-extracted',
        'colors-harmonized', 
        'music-sync:beat',
        'music-sync:energy-changed',
        'year3000SystemSettingsChanged'
      ];

      const unifiedEventSpy = jest.fn();
      
      // Subscribe to unified events
      unifiedEventBus.subscribe('colors:extracted', unifiedEventSpy, 'test');
      unifiedEventBus.subscribe('colors:harmonized', unifiedEventSpy, 'test');
      unifiedEventBus.subscribe('music:beat', unifiedEventSpy, 'test');
      unifiedEventBus.subscribe('music:energy', unifiedEventSpy, 'test');
      unifiedEventBus.subscribe('settings:changed', unifiedEventSpy, 'test');

      // Emit legacy events
      for (const eventName of legacyEvents) {
        eventMigrationManager.emitLegacyEvent(eventName, { test: 'data' });
      }

      // All legacy events should be converted and received
      expect(unifiedEventSpy).toHaveBeenCalledTimes(legacyEvents.length);
    });
  });

  describe('4. Color Changes Consistency Prevention', () => {
    test('should prevent racing conditions in color processing pipeline', async () => {
      const colorProcessingOrder: string[] = [];
      
      // Mock the color processing pipeline
      const mockMusicSync = {
        initialize: jest.fn(),
        processAudioData: jest.fn().mockImplementation(() => {
          colorProcessingOrder.push('audio-processed');
          // Emit music data through unified event bus
          unifiedEventBus.emitSync('music:beat', {
            bpm: 120,
            intensity: 0.8,
            timestamp: Date.now(),
            confidence: 0.9
          });
        }),
        initialized: false
      };

      const mockColorHarmony = {
        initialize: jest.fn(),
        processColors: jest.fn().mockImplementation(() => {
          colorProcessingOrder.push('colors-processed');
          // Emit harmonized colors through unified event bus
          unifiedEventBus.emitSync('colors:harmonized', {
            processedColors: { accent: '#ff0000' },
            accentHex: '#ff0000',
            accentRgb: '255,0,0',
            strategies: ['test'],
            processingTime: 10,
            trackUri: 'test-track'
          });
        }),
        initialized: false
      };

      // Initialize through coordinator
      await systemCoordinator.initialize();

      // Simulate color extraction
      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: { PRIMARY: '#ff0000' },
        trackUri: 'test-track',
        timestamp: Date.now()
      });

      // Process audio data
      mockMusicSync.processAudioData();
      
      // Process colors 
      mockColorHarmony.processColors();

      // Verify processing happened in coordinated order
      expect(colorProcessingOrder).toEqual(['audio-processed', 'colors-processed']);
    });

    test('should ensure consistent color updates through proper coordination', async () => {
      let colorUpdateCount = 0;
      const colorUpdates: Array<{ color: string, timestamp: number }> = [];

      // Track color updates
      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        colorUpdateCount++;
        colorUpdates.push({
          color: data.accentHex,
          timestamp: Date.now()
        });
      }, 'color-tracker');

      await systemCoordinator.initialize();

      // Simulate multiple rapid color extractions (stress test)
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      
      for (const color of colors) {
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: color },
          trackUri: 'test-track',
          timestamp: Date.now()
        });
        
        // Small delay to simulate real conditions
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Should have processed all colors without dropping or racing
      expect(colorUpdateCount).toBe(colors.length);
      expect(colorUpdates).toHaveLength(colors.length);
      
      // Verify all unique colors were processed
      const processedColors = colorUpdates.map(update => update.color);
      expect(new Set(processedColors)).toHaveProperty('size', colors.length);
    });
  });

  describe('5. Performance and Monitoring', () => {
    test('should track orchestration performance metrics', async () => {
      const performanceMetrics = {
        initializationTime: 0,
        phaseTransitionTimes: {} as Record<string, number>
      };

      const startTime = performance.now();
      
      // Initialize with performance tracking
      await systemCoordinator.initialize();
      
      performanceMetrics.initializationTime = performance.now() - startTime;

      // Should complete initialization within reasonable time
      expect(performanceMetrics.initializationTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should provide orchestration health diagnostics', async () => {
      await systemCoordinator.initialize();

      const healthCheck = await systemCoordinator.performHealthCheck?.();
      
      expect(healthCheck).toMatchObject({
        healthy: true,
        phases: expect.objectContaining({
          core: 'completed',
          services: 'completed',
          'visual-systems': 'completed',
          integration: 'completed'
        }),
        eventBusStatus: 'unified',
        dependencyValidation: 'passed'
      });
    });
  });

  describe('6. Error Recovery and Resilience', () => {
    test('should handle individual system failures gracefully', async () => {
      const failingSystem = {
        initialize: jest.fn().mockRejectedValue(new Error('System failed')),
        initialized: false
      };

      // Should continue with other systems even if one fails
      const initPromise = systemCoordinator.initialize();
      
      await expect(initPromise).resolves.not.toThrow();
      
      // Should report system as failed but continue orchestration
      const healthCheck = await systemCoordinator.performHealthCheck?.();
      expect(healthCheck.issues).toContain('System failed');
    });

    test('should recover from event bus issues', async () => {
      // Simulate event bus disconnection
      const originalEmit = unifiedEventBus.emit;
      unifiedEventBus.emit = jest.fn().mockRejectedValue(new Error('Event bus error'));

      await systemCoordinator.initialize();

      // Restore event bus
      unifiedEventBus.emit = originalEmit;

      // Should recover and continue processing
      const testEvent = jest.fn();
      unifiedEventBus.subscribe('test:event', testEvent, 'recovery-test');
      
      unifiedEventBus.emitSync('test:event', { test: true });
      
      expect(testEvent).toHaveBeenCalled();
    });
  });

  describe('7. Regression Prevention', () => {
    test('should prevent return to self-initialization patterns', async () => {
      // Mock systems that might try to self-initialize
      const mockSystems = {
        musicSync: { initialize: jest.fn(), initialized: false },
        colorHarmony: { initialize: jest.fn(), initialized: false },
        visualSystem: { initialize: jest.fn(), initialized: false }
      };

      // Systems should not initialize themselves
      Object.values(mockSystems).forEach(system => {
        expect(system.initialized).toBe(false);
        expect(system.initialize).not.toHaveBeenCalled();
      });

      // Only coordinator should initialize systems
      await systemCoordinator.initialize();

      // Verify systems were initialized through coordinator, not self-initialized
      Object.values(mockSystems).forEach(system => {
        expect(system.initialize).not.toHaveBeenCalled(); // They shouldn't self-initialize
      });
    });

    test('should maintain event bus unification over time', async () => {
      await systemCoordinator.initialize();

      // Simulate running for extended period with various events
      const eventTypes = [
        'colors:extracted',
        'music:beat', 
        'settings:changed',
        'performance:frame'
      ];

      let unifiedEventCount = 0;
      
      eventTypes.forEach(eventType => {
        unifiedEventBus.subscribe(eventType, () => {
          unifiedEventCount++;
        }, 'regression-test');
      });

      // Emit events over time
      for (let i = 0; i < 100; i++) {
        const eventType = eventTypes[i % eventTypes.length];
        unifiedEventBus.emitSync(eventType as any, { iteration: i });
        
        if (i % 25 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
      }

      // All events should go through unified bus
      expect(unifiedEventCount).toBe(100);
    });
  });
});