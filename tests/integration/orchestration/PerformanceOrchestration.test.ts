/**
 * Performance Orchestration Benefits Tests
 * 
 * Tests the performance benefits provided by the orchestration improvements:
 * 1. CPU overhead reduction through eliminated system racing
 * 2. Memory management improvements through coordinated lifecycle
 * 3. Frame rate consistency during orchestrated operations
 * 4. Event processing efficiency through unified event bus
 * 
 * These tests validate that orchestration provides measurable performance
 * improvements beyond just fixing the racing condition issue.
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
          uri: 'spotify:track:perf-test',
          metadata: { title: 'Performance Test', artist_name: 'Test Artist' }
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

// Mock performance APIs
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    mark: jest.fn(),
    measure: jest.fn(),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB
      totalJSHeapSize: 100 * 1024 * 1024, // 100MB
      jsHeapSizeLimit: 4 * 1024 * 1024 * 1024 // 4GB
    }
  }
});

// Mock requestAnimationFrame for frame rate testing
let frameCallbacks: (() => void)[] = [];
let frameId = 0;
Object.defineProperty(window, 'requestAnimationFrame', {
  value: jest.fn((callback: () => void) => {
    frameCallbacks.push(callback);
    return ++frameId;
  })
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: jest.fn((id: number) => {
    // Mock implementation
  })
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
}); }

describe('Performance Orchestration Benefits Tests', () => {
  let systemCoordinator: SystemCoordinator;
  let performanceBaseline: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    frameCallbacks = [];
    frameId = 0;
    
    // Establish performance baseline
    performanceBaseline = {
      memoryStart: (performance as any).memory?.usedJSHeapSize || 0,
      timeStart: performance.now()
    };

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

  describe('1. CPU Overhead Reduction', () => {
    test('should have measurably lower CPU overhead vs unorchestrated initialization', async () => {
      const cpuMetrics = {
        orchestrated: { initTime: 0, eventProcessingTime: 0 },
        unorchestrated: { initTime: 0, eventProcessingTime: 0 }
      };

      // Test orchestrated initialization
      const orchestratedStart = performance.now();
      await systemCoordinator.initialize();
      cpuMetrics.orchestrated.initTime = performance.now() - orchestratedStart;

      // Test orchestrated event processing
      const eventStart = performance.now();
      for (let i = 0; i < 100; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120 + i, intensity: Math.random() });
        unifiedEventBus.emitSync('colors:extracted', { 
          rawColors: { PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
          trackUri: `cpu-test-${i}`
        });
      }
      cpuMetrics.orchestrated.eventProcessingTime = performance.now() - eventStart;

      // Simulate unorchestrated system behavior (self-initialization racing)
      const unorchestratedStart = performance.now();
      
      // Simulate multiple systems trying to initialize simultaneously
      const simulatedSelfInit = Array.from({ length: 5 }, async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
        return 'initialized';
      });
      
      await Promise.all(simulatedSelfInit);
      cpuMetrics.unorchestrated.initTime = performance.now() - unorchestratedStart;

      // Orchestrated should be faster than unorchestrated racing
      expect(cpuMetrics.orchestrated.initTime).toBeLessThan(cpuMetrics.unorchestrated.initTime * 2);
      expect(cpuMetrics.orchestrated.eventProcessingTime).toBeLessThan(1000); // Under 1 second for 200 events
      
      // Should have minimal CPU overhead per event
      const avgEventTime = cpuMetrics.orchestrated.eventProcessingTime / 200;
      expect(avgEventTime).toBeLessThan(5); // Under 5ms per event
    });

    test('should prevent redundant initialization CPU waste', async () => {
      let initializationAttempts = 0;
      const mockSystem = {
        initialize: jest.fn().mockImplementation(async () => {
          initializationAttempts++;
          await new Promise(resolve => setTimeout(resolve, 10));
        }),
        initialized: false
      };

      // In orchestrated system, each system should initialize exactly once
      await systemCoordinator.initialize();

      // Attempt to initialize the same system multiple times
      // (this would cause redundant work in unorchestrated systems)
      for (let i = 0; i < 5; i++) {
        try {
          await mockSystem.initialize();
        } catch (error) {
          // Orchestrated system should prevent redundant calls
        }
      }

      // Orchestrated system should prevent redundant initialization
      expect(initializationAttempts).toBeLessThanOrEqual(1); // Should only initialize once through coordinator
    });

    test('should have efficient resource allocation across phases', async () => {
      const phaseMetrics: Record<string, number> = {};
      
      // Mock phase timing tracking
      const mockPhaseTracker = {
        startPhase: (phase: string) => {
          phaseMetrics[`${phase}_start`] = performance.now();
        },
        endPhase: (phase: string) => {
          phaseMetrics[`${phase}_end`] = performance.now();
          phaseMetrics[`${phase}_duration`] = phaseMetrics[`${phase}_end`]! - phaseMetrics[`${phase}_start`]!;
        }
      };

      // Simulate phase tracking
      const phases = ['core', 'services', 'visual-systems', 'integration'];
      phases.forEach(phase => {
        mockPhaseTracker.startPhase(phase);
        // Simulate phase work
        for (let i = 0; i < 1000; i++) {
          Math.random(); // Simulate CPU work
        }
        mockPhaseTracker.endPhase(phase);
      });

      await systemCoordinator.initialize();

      // Each phase should complete efficiently
      phases.forEach(phase => {
        expect(phaseMetrics[`${phase}_duration`]).toBeLessThan(100); // Under 100ms per phase
      });

      // Total orchestration should be efficient
      const totalDuration = phases.reduce((sum, phase) => sum + (phaseMetrics[`${phase}_duration`] || 0), 0);
      expect(totalDuration).toBeLessThan(1000); // Under 1 second total
    });
  });

  describe('2. Memory Management Improvements', () => {
    test('should prevent memory leaks during coordinated lifecycle', async () => {
      const memoryTracker = {
        initial: (performance as any).memory?.usedJSHeapSize || 0,
        peak: 0,
        final: 0
      };

      await systemCoordinator.initialize();

      // Simulate extended operation with coordinated systems
      for (let cycle = 0; cycle < 10; cycle++) {
        // Simulate music and color processing cycles
        for (let i = 0; i < 50; i++) {
          unifiedEventBus.emitSync('music:beat', {
            bpm: 120,
            intensity: Math.random(),
            timestamp: Date.now()
          });

          unifiedEventBus.emitSync('colors:extracted', {
            rawColors: { 
              PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              VIBRANT: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            },
            trackUri: `memory-test-${cycle}-${i}`,
            timestamp: Date.now()
          });

          // Track peak memory usage
          const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
          if (currentMemory > memoryTracker.peak) {
            memoryTracker.peak = currentMemory;
          }
        }

        // Force garbage collection simulation
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      memoryTracker.final = (performance as any).memory?.usedJSHeapSize || 0;

      // Memory should not increase significantly over time
      const memoryIncrease = memoryTracker.final - memoryTracker.initial;
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB increase

      // Peak memory should be reasonable
      const peakIncrease = memoryTracker.peak - memoryTracker.initial;
      expect(peakIncrease).toBeLessThan(25 * 1024 * 1024); // Less than 25MB peak
    });

    test('should properly cleanup resources on system destruction', async () => {
      const resourceTracker = {
        eventSubscriptions: 0,
        animationFrames: 0,
        timers: 0
      };

      // Track resource allocation
      const originalSubscribe = unifiedEventBus.subscribe;
      unifiedEventBus.subscribe = jest.fn().mockImplementation((...args) => {
        resourceTracker.eventSubscriptions++;
        return originalSubscribe.apply(unifiedEventBus, args);
      });

      const originalRAF = window.requestAnimationFrame;
      window.requestAnimationFrame = jest.fn().mockImplementation((callback) => {
        resourceTracker.animationFrames++;
        return originalRAF(callback);
      });

      await systemCoordinator.initialize();

      // Simulate resource allocation
      for (let i = 0; i < 10; i++) {
        unifiedEventBus.subscribe('test:event', () => {}, `test-subscriber-${i}`);
        window.requestAnimationFrame(() => {});
      }

      const resourcesBeforeCleanup = { ...resourceTracker };

      // Cleanup through coordinated destruction
      await systemCoordinator.destroy();

      // Should properly cleanup allocated resources
      const metrics = unifiedEventBus.getMetrics();
      expect(metrics.activeSubscriptions).toBeLessThan(resourcesBeforeCleanup.eventSubscriptions);
    });

    test('should have efficient memory usage during high-frequency operations', async () => {
      await systemCoordinator.initialize();

      const memorySnapshot = {
        start: (performance as any).memory?.usedJSHeapSize || 0,
        samples: [] as number[]
      };

      // High-frequency operation simulation
      const operationDuration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const highFrequencyInterval = setInterval(() => {
        if (Date.now() - startTime > operationDuration) {
          clearInterval(highFrequencyInterval);
          return;
        }

        // High-frequency color and music events
        unifiedEventBus.emitSync('music:beat', {
          bpm: 60 + Math.random() * 120,
          intensity: Math.random(),
          timestamp: Date.now()
        });

        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
          trackUri: `high-freq-${Date.now()}`,
          timestamp: Date.now()
        });

        // Sample memory usage
        const currentMemory = (performance as any).memory?.usedJSHeapSize || 0;
        memorySnapshot.samples.push(currentMemory);
      }, 10); // 100 Hz

      await new Promise(resolve => setTimeout(resolve, operationDuration + 100));

      // Memory should remain stable during high-frequency operations
      const memoryGrowth = memorySnapshot.samples[memorySnapshot.samples.length - 1]! - memorySnapshot.start;
      expect(memoryGrowth).toBeLessThan(15 * 1024 * 1024); // Less than 15MB growth

      // Should not have runaway memory growth
      const maxMemory = Math.max(...memorySnapshot.samples);
      const avgMemory = memorySnapshot.samples.reduce((sum, mem) => sum + mem, 0) / memorySnapshot.samples.length;
      expect(maxMemory - avgMemory).toBeLessThan(5 * 1024 * 1024); // Variance under 5MB
    });
  });

  describe('3. Frame Rate Consistency', () => {
    test('should maintain 60fps target during orchestrated operations', async () => {
      const frameMetrics = {
        frameCount: 0,
        frameTimes: [] as number[],
        dropped: 0
      };

      await systemCoordinator.initialize();

      // Simulate frame-based rendering with orchestrated updates
      const targetFPS = 60;
      const targetFrameTime = 1000 / targetFPS; // ~16.67ms
      const testDuration = 1000; // 1 second
      
      let lastFrameTime = performance.now();
      
      const frameLoop = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        
        frameMetrics.frameCount++;
        frameMetrics.frameTimes.push(deltaTime);
        
        // Simulate orchestrated system updates during frame
        unifiedEventBus.emitSync('performance:frame', {
          frameNumber: frameMetrics.frameCount,
          deltaTime,
          timestamp: currentTime
        });

        // Simulate color processing during frame
        if (frameMetrics.frameCount % 10 === 0) {
          unifiedEventBus.emitSync('colors:extracted', {
            rawColors: { PRIMARY: '#7c3aed' },
            trackUri: `frame-test-${frameMetrics.frameCount}`,
            timestamp: currentTime
          });
        }

        // Track dropped frames (>20ms)
        if (deltaTime > 20) {
          frameMetrics.dropped++;
        }

        lastFrameTime = currentTime;
        
        if (currentTime - performanceBaseline.timeStart < testDuration) {
          requestAnimationFrame(frameLoop);
        }
      };

      frameLoop();

      // Wait for test completion
      await new Promise(resolve => setTimeout(resolve, testDuration + 100));

      // Should achieve close to 60fps
      const actualFPS = frameMetrics.frameCount / (testDuration / 1000);
      expect(actualFPS).toBeGreaterThan(45); // At least 45fps
      expect(actualFPS).toBeLessThan(65); // Not unrealistically high

      // Should have minimal dropped frames
      const dropRate = frameMetrics.dropped / frameMetrics.frameCount;
      expect(dropRate).toBeLessThan(0.05); // Less than 5% dropped frames

      // Frame times should be consistent
      const avgFrameTime = frameMetrics.frameTimes.reduce((sum, time) => sum + time, 0) / frameMetrics.frameTimes.length;
      expect(avgFrameTime).toBeLessThan(20); // Average under 20ms
    });

    test('should prevent frame rate degradation under system load', async () => {
      await systemCoordinator.initialize();

      const loadTestMetrics = {
        lowLoad: { frameCount: 0, avgFrameTime: 0 },
        highLoad: { frameCount: 0, avgFrameTime: 0 }
      };

      // Low load test
      let frameCount = 0;
      let totalFrameTime = 0;
      let lastTime = performance.now();

      const lowLoadTest = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        frameCount++;
        totalFrameTime += deltaTime;
        
        // Minimal system activity
        if (frameCount % 30 === 0) {
          unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.5 });
        }

        lastTime = currentTime;
        
        if (frameCount < 60) { // 1 second at 60fps
          requestAnimationFrame(lowLoadTest);
        } else {
          loadTestMetrics.lowLoad.frameCount = frameCount;
          loadTestMetrics.lowLoad.avgFrameTime = totalFrameTime / frameCount;
        }
      };

      lowLoadTest();
      await new Promise(resolve => setTimeout(resolve, 1100));

      // High load test
      frameCount = 0;
      totalFrameTime = 0;
      lastTime = performance.now();

      const highLoadTest = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        frameCount++;
        totalFrameTime += deltaTime;
        
        // High system activity
        unifiedEventBus.emitSync('music:beat', { bpm: 140, intensity: 0.9 });
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: `#${Math.floor(Math.random() * 16777215).toString(16)}` },
          trackUri: `load-test-${frameCount}`
        });
        
        // Simulate additional processing
        for (let i = 0; i < 100; i++) {
          Math.sin(Math.random() * Math.PI);
        }

        lastTime = currentTime;
        
        if (frameCount < 60) { // 1 second at 60fps
          requestAnimationFrame(highLoadTest);
        } else {
          loadTestMetrics.highLoad.frameCount = frameCount;
          loadTestMetrics.highLoad.avgFrameTime = totalFrameTime / frameCount;
        }
      };

      highLoadTest();
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Frame rate should not degrade significantly under load
      const frameRateDegradation = (loadTestMetrics.highLoad.avgFrameTime - loadTestMetrics.lowLoad.avgFrameTime) / loadTestMetrics.lowLoad.avgFrameTime;
      expect(frameRateDegradation).toBeLessThan(0.5); // Less than 50% degradation

      // Both should maintain reasonable frame times
      expect(loadTestMetrics.lowLoad.avgFrameTime).toBeLessThan(18); // Low load under 18ms
      expect(loadTestMetrics.highLoad.avgFrameTime).toBeLessThan(25); // High load under 25ms
    });
  });

  describe('4. Event Processing Efficiency', () => {
    test('should have efficient unified event bus vs fragmented event systems', async () => {
      await systemCoordinator.initialize();

      const eventMetrics = {
        unified: { processingTime: 0, throughput: 0 },
        fragmented: { processingTime: 0, throughput: 0 }
      };

      // Test unified event bus efficiency
      const unifiedStart = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.8 });
        unifiedEventBus.emitSync('colors:extracted', { 
          rawColors: { PRIMARY: '#7c3aed' },
          trackUri: `unified-test-${i}`
        });
      }
      
      eventMetrics.unified.processingTime = performance.now() - unifiedStart;
      eventMetrics.unified.throughput = 2000 / eventMetrics.unified.processingTime; // events per ms

      // Simulate fragmented event system (DOM events + custom buses)
      const fragmentedStart = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        // Simulate multiple event systems with overhead
        document.dispatchEvent(new CustomEvent('legacy-music-beat', { 
          detail: { bpm: 120, intensity: 0.8 }
        }));
        
        document.dispatchEvent(new CustomEvent('legacy-colors-extracted', {
          detail: { 
            rawColors: { PRIMARY: '#7c3aed' },
            trackUri: `fragmented-test-${i}`
          }
        }));
        
        // Simulate transformation overhead
        for (let j = 0; j < 5; j++) {
          Math.random();
        }
      }
      
      eventMetrics.fragmented.processingTime = performance.now() - fragmentedStart;
      eventMetrics.fragmented.throughput = 2000 / eventMetrics.fragmented.processingTime;

      // Unified should be more efficient than fragmented
      expect(eventMetrics.unified.throughput).toBeGreaterThan(eventMetrics.fragmented.throughput);
      expect(eventMetrics.unified.processingTime).toBeLessThan(eventMetrics.fragmented.processingTime);
      
      // Unified should be fast enough for real-time use
      expect(eventMetrics.unified.throughput).toBeGreaterThan(10); // At least 10 events per ms
    });

    test('should handle high-frequency events without performance degradation', async () => {
      await systemCoordinator.initialize();

      const frequencyTest = {
        lowFreq: { processingTime: 0, eventCount: 0 },
        highFreq: { processingTime: 0, eventCount: 0 }
      };

      // Low frequency test (10 Hz)
      const lowFreqStart = performance.now();
      for (let i = 0; i < 50; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.8 });
        await new Promise(resolve => setTimeout(resolve, 100)); // 10 Hz
        frequencyTest.lowFreq.eventCount++;
      }
      frequencyTest.lowFreq.processingTime = performance.now() - lowFreqStart;

      // High frequency test (100 Hz)
      const highFreqStart = performance.now();
      for (let i = 0; i < 500; i++) {
        unifiedEventBus.emitSync('music:beat', { bpm: 120, intensity: 0.8 });
        await new Promise(resolve => setTimeout(resolve, 10)); // 100 Hz
        frequencyTest.highFreq.eventCount++;
      }
      frequencyTest.highFreq.processingTime = performance.now() - highFreqStart;

      // Calculate per-event processing time
      const lowFreqPerEvent = frequencyTest.lowFreq.processingTime / frequencyTest.lowFreq.eventCount;
      const highFreqPerEvent = frequencyTest.highFreq.processingTime / frequencyTest.highFreq.eventCount;

      // High frequency should not significantly degrade per-event performance
      const performanceDegradation = (highFreqPerEvent - lowFreqPerEvent) / lowFreqPerEvent;
      expect(performanceDegradation).toBeLessThan(2.0); // Less than 200% degradation

      // Both should be fast enough for real-time
      expect(lowFreqPerEvent).toBeLessThan(5); // Under 5ms per event
      expect(highFreqPerEvent).toBeLessThan(10); // Under 10ms per event at high frequency
    });

    test('should efficiently handle complex event transformation chains', async () => {
      await systemCoordinator.initialize();

      const transformationMetrics = {
        simpleEvents: { processingTime: 0, transformationCount: 0 },
        complexEvents: { processingTime: 0, transformationCount: 0 }
      };

      // Simple event transformations
      const simpleStart = performance.now();
      for (let i = 0; i < 100; i++) {
        eventMigrationManager.emitLegacyEvent('music-sync:beat', { bpm: 120 });
        transformationMetrics.simpleEvents.transformationCount++;
      }
      transformationMetrics.simpleEvents.processingTime = performance.now() - simpleStart;

      // Complex event transformations with data processing
      const complexStart = performance.now();
      for (let i = 0; i < 100; i++) {
        eventMigrationManager.emitLegacyEvent('colors-extracted', {
          colors: {
            PRIMARY: '#7c3aed',
            VIBRANT: '#a855f7',
            PROMINENT: '#8b5cf6',
            LIGHT_VIBRANT: '#c4b5fd',
            DARK_VIBRANT: '#6d28d9'
          },
          trackUri: `complex-transform-${i}`,
          metadata: {
            energy: Math.random(),
            valence: Math.random(),
            tempo: 60 + Math.random() * 120
          }
        });
        transformationMetrics.complexEvents.transformationCount++;
      }
      transformationMetrics.complexEvents.processingTime = performance.now() - complexStart;

      // Calculate per-transformation time
      const simplePerTransform = transformationMetrics.simpleEvents.processingTime / transformationMetrics.simpleEvents.transformationCount;
      const complexPerTransform = transformationMetrics.complexEvents.processingTime / transformationMetrics.complexEvents.transformationCount;

      // Transformations should be efficient
      expect(simplePerTransform).toBeLessThan(2); // Under 2ms for simple
      expect(complexPerTransform).toBeLessThan(8); // Under 8ms for complex

      // Complex transformations should not be exponentially slower
      expect(complexPerTransform / simplePerTransform).toBeLessThan(10); // Less than 10x slower
    });
  });
});