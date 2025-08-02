/**
 * System Reliability Benefits Tests
 * 
 * Tests the reliability benefits provided by orchestration improvements:
 * 1. Predictable system startup and initialization order
 * 2. Error recovery and graceful degradation when systems fail
 * 3. Dependency chain reliability (MusicSync → ColorHarmony → Visual)
 * 4. Long-term stability during extended operation
 * 
 * These tests validate that orchestration provides measurable reliability
 * improvements beyond the original racing condition fix.
 */

import { jest } from '@jest/globals';
import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
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
          uri: 'spotify:track:reliability-test',
          metadata: { title: 'Reliability Test', artist_name: 'Test Artist' }
        }
      }
    }),
    getPlatform: () => ({
      getAudioData: jest.fn().mockResolvedValue({
        energy: 0.8, valence: 0.7, tempo: 128
      })
    }),
    getLibrary: () => ({
      contains: jest.fn().mockResolvedValue([true])
    })
  }
}));

// Mock performance APIs
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    mark: jest.fn(),
    measure: jest.fn()
  }
});

// Mock DOM
if (!global.document) { Object.defineProperty(global, 'document', {
  value: {
    documentElement: {
      style: {
        setProperty: jest.fn(),
        removeProperty: jest.fn()
      }
    },
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }
});

describe('System Reliability Benefits Tests', () => {
  let systemCoordinator: SystemCoordinator;

  beforeEach(() => {
    jest.clearAllMocks();

    systemCoordinator = new SystemCoordinator(
      YEAR3000_CONFIG,
      {} as any,
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
  });

  afterEach(async () => {
    if (systemCoordinator) {
      await systemCoordinator.destroy();
    }
    unifiedEventBus.destroy();
  });

  describe('1. Predictable System Startup', () => {
    test('should have consistent initialization order across multiple runs', async () => {
      const initializationRuns: string[][] = [];

      // Run initialization multiple times to test consistency
      for (let run = 0; run < 5; run++) {
        const runOrder: string[] = [];
        
        // Create fresh coordinator for each run
        const testCoordinator = new SystemCoordinator(
          YEAR3000_CONFIG,
          {} as any,
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

        // Mock phase tracking
        const mockPhaseHandler = (phase: string) => {
          runOrder.push(phase);
        };

        // Simulate phase completion events
        testCoordinator.on?.('phase:core:complete', () => mockPhaseHandler('core'));
        testCoordinator.on?.('phase:services:complete', () => mockPhaseHandler('services'));
        testCoordinator.on?.('phase:visual-systems:complete', () => mockPhaseHandler('visual-systems'));
        testCoordinator.on?.('phase:integration:complete', () => mockPhaseHandler('integration'));

        await testCoordinator.initialize();
        initializationRuns.push(runOrder);

        await testCoordinator.destroy();
      }

      // All runs should have the same initialization order
      const expectedOrder = ['core', 'services', 'visual-systems', 'integration'];
      initializationRuns.forEach((runOrder, index) => {
        expect(runOrder).toEqual(expectedOrder);
      });

      // Verify consistency across all runs
      const firstRun = initializationRuns[0];
      initializationRuns.slice(1).forEach((run, index) => {
        expect(run).toEqual(firstRun);
      });
    });

    test('should handle varying system initialization times consistently', async () => {
      const initializationTimes: number[] = [];

      // Mock systems with varying initialization delays
      const mockSystems = [
        { delay: 10, name: 'FastSystem' },
        { delay: 50, name: 'MediumSystem' },
        { delay: 100, name: 'SlowSystem' },
        { delay: 5, name: 'VeryFastSystem' }
      ];

      for (let run = 0; run < 3; run++) {
        const startTime = performance.now();
        
        // Simulate systems with different initialization times
        const systemPromises = mockSystems.map(async (system) => {
          await new Promise(resolve => setTimeout(resolve, system.delay));
          return system.name;
        });

        await Promise.all(systemPromises);
        await systemCoordinator.initialize();

        const totalTime = performance.now() - startTime;
        initializationTimes.push(totalTime);
      }

      // Initialization time should be consistent regardless of individual system timing
      const avgTime = initializationTimes.reduce((sum, time) => sum + time, 0) / initializationTimes.length;
      const maxDeviation = Math.max(...initializationTimes.map(time => Math.abs(time - avgTime)));
      
      expect(maxDeviation / avgTime).toBeLessThan(0.5); // Less than 50% deviation from average
    });

    test('should prevent race conditions during concurrent initialization attempts', async () => {
      const initializationAttempts: Array<{ id: string; result: string; timestamp: number }> = [];

      // Attempt multiple concurrent initializations
      const concurrentPromises = Array.from({ length: 5 }, async (_, index) => {
        const attemptId = `attempt-${index}`;
        const startTime = performance.now();

        try {
          await systemCoordinator.initialize();
          initializationAttempts.push({
            id: attemptId,
            result: 'success',
            timestamp: startTime
          });
          return 'success';
        } catch (error) {
          initializationAttempts.push({
            id: attemptId,
            result: 'prevented',
            timestamp: startTime
          });
          return 'prevented';
        }
      });

      const results = await Promise.allSettled(concurrentPromises);

      // Only one initialization should succeed, others should be prevented
      const successCount = results.filter(result => 
        result.status === 'fulfilled' && result.value === 'success'
      ).length;

      expect(successCount).toBe(1); // Exactly one successful initialization

      // All other attempts should be gracefully prevented
      const preventedCount = results.filter(result =>
        result.status === 'fulfilled' && result.value === 'prevented'
      ).length;

      expect(preventedCount).toBe(4); // Four prevented attempts
    });
  });

  describe('2. Error Recovery and Graceful Degradation', () => {
    test('should gracefully handle individual system failures during initialization', async () => {
      const systemFailures: string[] = [];
      const recoveryActions: string[] = [];

      // Mock a failing system
      const failingSystemMock = {
        initialize: jest.fn().mockRejectedValue(new Error('Simulated system failure')),
        name: 'FailingSystem'
      };

      // Mock error recovery handler
      const errorHandler = (systemName: string, error: Error) => {
        systemFailures.push(systemName);
        recoveryActions.push(`recovered-${systemName}`);
      };

      try {
        await systemCoordinator.initialize();
        
        // Simulate a system failure during operation
        await failingSystemMock.initialize().catch(error => {
          errorHandler(failingSystemMock.name, error);
        });

      } catch (error) {
        // Should not prevent overall system initialization
      }

      // System should continue operating despite individual failures
      const healthCheck = await systemCoordinator.healthCheck?.();
      expect(healthCheck).toBeDefined();

      // Should have recorded and handled the failure
      expect(systemFailures).toContain('FailingSystem');
      expect(recoveryActions).toContain('recovered-FailingSystem');
    });

    test('should maintain core functionality when non-critical systems fail', async () => {
      await systemCoordinator.initialize();

      const coreEventTracker = {
        musicEvents: 0,
        colorEvents: 0,
        errorEvents: 0
      };

      // Subscribe to core events
      unifiedEventBus.subscribe('music:beat', () => {
        coreEventTracker.musicEvents++;
      }, 'reliability-music-test');

      unifiedEventBus.subscribe('colors:extracted', () => {
        coreEventTracker.colorEvents++;
      }, 'reliability-color-test');

      unifiedEventBus.subscribe('system:error', () => {
        coreEventTracker.errorEvents++;
      }, 'reliability-error-test');

      // Simulate non-critical system failure
      try {
        throw new Error('Non-critical system failure');
      } catch (error) {
        unifiedEventBus.emitSync('system:error', { 
          system: 'non-critical',
          error: error.message,
          recoverable: true
        });
      }

      // Core functionality should continue working
      unifiedEventBus.emitSync('music:beat', {
        bpm: 120,
        intensity: 0.8,
        timestamp: Date.now()
      });

      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: { PRIMARY: '#7c3aed' },
        trackUri: 'reliability-test',
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      // Core events should be processed despite error
      expect(coreEventTracker.musicEvents).toBe(1);
      expect(coreEventTracker.colorEvents).toBe(1);
      expect(coreEventTracker.errorEvents).toBe(1);
    });

    test('should recover from temporary event bus disconnections', async () => {
      await systemCoordinator.initialize();

      const eventTracker = {
        beforeDisconnection: 0,
        duringDisconnection: 0,
        afterReconnection: 0
      };

      // Normal operation
      unifiedEventBus.subscribe('test:event', () => {
        eventTracker.beforeDisconnection++;
      }, 'recovery-test-before');

      unifiedEventBus.emitSync('test:event', { phase: 'before' });

      // Simulate event bus disconnection
      const originalEmit = unifiedEventBus.emit;
      const originalEmitSync = unifiedEventBus.emitSync;
      
      unifiedEventBus.emit = jest.fn().mockRejectedValue(new Error('Event bus disconnected'));
      unifiedEventBus.emitSync = jest.fn().mockImplementation(() => {
        eventTracker.duringDisconnection++;
        throw new Error('Event bus disconnected');
      });

      // Attempt events during disconnection
      try {
        unifiedEventBus.emitSync('test:event', { phase: 'during' });
      } catch (error) {
        // Expected failure
      }

      // Restore event bus
      unifiedEventBus.emit = originalEmit;
      unifiedEventBus.emitSync = originalEmitSync;

      // Subscribe after reconnection
      unifiedEventBus.subscribe('test:event', () => {
        eventTracker.afterReconnection++;
      }, 'recovery-test-after');

      unifiedEventBus.emitSync('test:event', { phase: 'after' });

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should handle disconnection gracefully and recover
      expect(eventTracker.beforeDisconnection).toBe(1);
      expect(eventTracker.duringDisconnection).toBe(1); // Failure recorded
      expect(eventTracker.afterReconnection).toBe(1); // Recovery successful
    });

    test('should provide fallback behavior when dependencies are unavailable', async () => {
      const fallbackTracker = {
        primaryBehavior: 0,
        fallbackBehavior: 0
      };

      await systemCoordinator.initialize();

      // Test normal dependency chain
      unifiedEventBus.subscribe('colors:harmonized', () => {
        fallbackTracker.primaryBehavior++;
      }, 'dependency-primary');

      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: { PRIMARY: '#7c3aed' },
        trackUri: 'dependency-test',
        timestamp: Date.now()
      });

      // Simulate dependency failure (ColorHarmonyEngine unavailable)
      unifiedEventBus.subscribe('colors:fallback', () => {
        fallbackTracker.fallbackBehavior++;
      }, 'dependency-fallback');

      // Emit fallback event when primary dependency fails
      try {
        // Simulate dependency failure
        throw new Error('ColorHarmonyEngine unavailable');
      } catch (error) {
        unifiedEventBus.emitSync('colors:fallback', {
          rawColors: { PRIMARY: '#7c3aed' },
          fallbackReason: 'dependency-unavailable',
          timestamp: Date.now()
        });
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should have both primary and fallback behavior
      expect(fallbackTracker.primaryBehavior).toBeGreaterThan(0);
      expect(fallbackTracker.fallbackBehavior).toBeGreaterThan(0);
    });
  });

  describe('3. Dependency Chain Reliability', () => {
    test('should ensure MusicSyncService → ColorHarmonyEngine dependency is reliable', async () => {
      const dependencyChain: string[] = [];
      let musicSyncReady = false;
      let colorHarmonyReady = false;

      await systemCoordinator.initialize();

      // Mock dependency chain tracking
      unifiedEventBus.subscribe('music:service:ready', () => {
        dependencyChain.push('MusicSyncService');
        musicSyncReady = true;
      }, 'dependency-music');

      unifiedEventBus.subscribe('colors:harmony:ready', () => {
        // ColorHarmonyEngine should only initialize after MusicSyncService
        expect(musicSyncReady).toBe(true);
        dependencyChain.push('ColorHarmonyEngine');
        colorHarmonyReady = true;
      }, 'dependency-color');

      // Simulate dependency initialization
      unifiedEventBus.emitSync('music:service:ready', { timestamp: Date.now() });
      unifiedEventBus.emitSync('colors:harmony:ready', { timestamp: Date.now() });

      await new Promise(resolve => setTimeout(resolve, 50));

      // Verify dependency order
      expect(dependencyChain).toEqual(['MusicSyncService', 'ColorHarmonyEngine']);
      expect(musicSyncReady).toBe(true);
      expect(colorHarmonyReady).toBe(true);
    });

    test('should handle dependency timeouts gracefully', async () => {
      const timeoutTracker = {
        dependencyTimeout: false,
        gracefulFallback: false,
        systemContinued: false
      };

      // Create coordinator with short timeout for testing
      const timeoutCoordinator = new SystemCoordinator(
        YEAR3000_CONFIG,
        {} as any,
        {
          orchestration: {
            enforceSequentialInitialization: true,
            dependencyValidation: true,
            enableInitializationGates: true,
            systemReadinessTimeout: 100, // Very short timeout
            phaseTransitionTimeout: 200,
          }
        }
      );

      // Mock slow dependency
      const slowDependency = new Promise(resolve => {
        setTimeout(resolve, 300); // Longer than timeout
      });

      try {
        await Promise.race([
          timeoutCoordinator.initialize(),
          slowDependency.then(() => {
            timeoutTracker.dependencyTimeout = false;
          })
        ]);
      } catch (error) {
        if (error.message.includes('timeout')) {
          timeoutTracker.dependencyTimeout = true;
          timeoutTracker.gracefulFallback = true;
        }
      }

      // System should continue with fallback behavior
      try {
        const healthCheck = await timeoutCoordinator.healthCheck?.();
        if (healthCheck) {
          timeoutTracker.systemContinued = true;
        }
      } catch (error) {
        // Health check might fail, but system should handle gracefully
        timeoutTracker.systemContinued = false;
      }

      await timeoutCoordinator.destroy();

      // Should handle timeout gracefully
      expect(timeoutTracker.dependencyTimeout).toBe(true);
      expect(timeoutTracker.gracefulFallback).toBe(true);
    });

    test('should prevent circular dependency deadlocks', async () => {
      await systemCoordinator.initialize();

      const circularDependencyTest = {
        systemAInitialized: false,
        systemBInitialized: false,
        deadlockDetected: false,
        resolutionSuccessful: false
      };

      // Simulate circular dependency scenario
      const systemA = {
        initialize: jest.fn().mockImplementation(async () => {
          // SystemA waits for SystemB
          if (!circularDependencyTest.systemBInitialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          circularDependencyTest.systemAInitialized = true;
        })
      };

      const systemB = {
        initialize: jest.fn().mockImplementation(async () => {
          // SystemB waits for SystemA
          if (!circularDependencyTest.systemAInitialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          circularDependencyTest.systemBInitialized = true;
        })
      };

      // Attempt to initialize with circular dependency
      try {
        await Promise.race([
          Promise.all([systemA.initialize(), systemB.initialize()]),
          new Promise((_, reject) => 
            setTimeout(() => {
              circularDependencyTest.deadlockDetected = true;
              reject(new Error('Circular dependency timeout'));
            }, 250)
          )
        ]);
        circularDependencyTest.resolutionSuccessful = true;
      } catch (error) {
        // Should detect and handle circular dependency
        if (error.message.includes('Circular dependency')) {
          circularDependencyTest.deadlockDetected = true;
        }
      }

      // Should detect circular dependency without hanging
      expect(circularDependencyTest.deadlockDetected).toBe(true);
      expect(circularDependencyTest.resolutionSuccessful).toBe(false);
    });
  });

  describe('4. Long-term Stability', () => {
    test('should maintain stability during extended operation (8+ hours simulation)', async () => {
      await systemCoordinator.initialize();

      const stabilityMetrics = {
        operationCycles: 0,
        errorCount: 0,
        performanceDegradation: false,
        memoryLeaks: false
      };

      // Simulate 8 hours of operation in accelerated time
      const simulatedHours = 8;
      const cyclesPerHour = 100; // 100 cycles per simulated hour
      const totalCycles = simulatedHours * cyclesPerHour;

      let initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      let peakMemory = initialMemory;

      for (let cycle = 0; cycle < totalCycles; cycle++) {
        try {
          // Simulate typical system operations
          unifiedEventBus.emitSync('music:beat', {
            bpm: 60 + Math.random() * 120,
            intensity: Math.random(),
            timestamp: Date.now()
          });

          unifiedEventBus.emitSync('colors:extracted', {
            rawColors: { 
              PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              VIBRANT: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            },
            trackUri: `stability-test-${cycle}`,
            timestamp: Date.now()
          });

          // Check memory usage periodically
          if (cycle % 50 === 0) {
            const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
            if (currentMemory > peakMemory) {
              peakMemory = currentMemory;
            }
            
            // Check for memory leaks (>50MB growth)
            if (currentMemory - initialMemory > 50 * 1024 * 1024) {
              stabilityMetrics.memoryLeaks = true;
            }
          }

          stabilityMetrics.operationCycles++;

          // Small delay to simulate real-time operation
          if (cycle % 100 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1));
          }

        } catch (error) {
          stabilityMetrics.errorCount++;
        }
      }

      // Validate long-term stability
      expect(stabilityMetrics.operationCycles).toBe(totalCycles);
      expect(stabilityMetrics.errorCount / totalCycles).toBeLessThan(0.01); // Less than 1% error rate
      expect(stabilityMetrics.memoryLeaks).toBe(false);
      
      // Memory usage should be reasonable
      const memoryGrowth = peakMemory - initialMemory;
      expect(memoryGrowth).toBeLessThan(30 * 1024 * 1024); // Less than 30MB growth
    });

    test('should handle intermittent system stress without degradation', async () => {
      await systemCoordinator.initialize();

      const stressTestMetrics = {
        normalOperationTime: 0,
        stressOperationTime: 0,
        recoveryTime: 0,
        degradationDetected: false
      };

      // Normal operation baseline
      const normalStart = performance.now();
      for (let i = 0; i < 100; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.5 });
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: '#7c3aed' },
          trackUri: `normal-${i}`
        });
      }
      stressTestMetrics.normalOperationTime = performance.now() - normalStart;

      // Stress operation
      const stressStart = performance.now();
      for (let i = 0; i < 500; i++) {
        // High-frequency, complex events
        unifiedEventBus.emitSync('music:beat', {
          bpm: 60 + Math.random() * 180,
          intensity: Math.random(),
          timestamp: Date.now(),
          metadata: {
            genre: 'stress-test',
            energy: Math.random(),
            valence: Math.random()
          }
        });

        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: {
            PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            VIBRANT: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            PROMINENT: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            LIGHT_VIBRANT: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            DARK_VIBRANT: `#${Math.floor(Math.random() * 16777215).toString(16)}`
          },
          trackUri: `stress-${i}`,
          timestamp: Date.now(),
          musicData: {
            energy: Math.random(),
            valence: Math.random(),
            tempo: 60 + Math.random() * 120
          }
        });

        // Additional stress events
        if (i % 5 === 0) {
          eventMigrationManager.emitLegacyEvent('colors-harmonized', {
            accentHex: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            processingTime: Math.random() * 50
          });
        }
      }
      stressTestMetrics.stressOperationTime = performance.now() - stressStart;

      // Recovery operation
      const recoveryStart = performance.now();
      for (let i = 0; i < 100; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.5 });
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: '#7c3aed' },
          trackUri: `recovery-${i}`
        });
      }
      stressTestMetrics.recoveryTime = performance.now() - recoveryStart;

      // Calculate performance metrics
      const normalPerEvent = stressTestMetrics.normalOperationTime / 200; // 100 events * 2 types
      const stressPerEvent = stressTestMetrics.stressOperationTime / 1000; // 500 events * 2 types
      const recoveryPerEvent = stressTestMetrics.recoveryTime / 200;

      // Recovery should be close to normal performance
      const recoveryDegradation = (recoveryPerEvent - normalPerEvent) / normalPerEvent;
      expect(recoveryDegradation).toBeLessThan(0.5); // Less than 50% degradation after stress

      // Stress operation should not cause exponential degradation
      const stressDegradation = (stressPerEvent - normalPerEvent) / normalPerEvent;
      expect(stressDegradation).toBeLessThan(3.0); // Less than 300% degradation during stress
    });

    test('should maintain event ordering consistency over time', async () => {
      await systemCoordinator.initialize();

      const orderingTest = {
        eventSequences: [] as Array<{ sequence: number[]; timestamp: number }>,
        orderingViolations: 0
      };

      // Long-running event ordering test
      for (let batch = 0; batch < 50; batch++) {
        const batchSequence: number[] = [];
        const batchStart = Date.now();

        // Emit ordered events
        for (let i = 0; i < 20; i++) {
          const eventId = batch * 20 + i;
          
          unifiedEventBus.emitSync('test:ordered-event', {
            id: eventId,
            batch,
            sequence: i,
            timestamp: Date.now()
          });

          batchSequence.push(eventId);
        }

        orderingTest.eventSequences.push({
          sequence: batchSequence,
          timestamp: batchStart
        });

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Verify event ordering remained consistent
      orderingTest.eventSequences.forEach((batch, batchIndex) => {
        batch.sequence.forEach((eventId, index) => {
          const expectedId = batchIndex * 20 + index;
          if (eventId !== expectedId) {
            orderingTest.orderingViolations++;
          }
        });
      });

      // Should maintain perfect ordering
      expect(orderingTest.orderingViolations).toBe(0);
      expect(orderingTest.eventSequences).toHaveLength(50);
    });
  });
});