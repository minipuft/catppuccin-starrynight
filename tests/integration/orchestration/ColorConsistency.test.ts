/**
 * Color Consistency Integration Tests
 * 
 * Tests the complete color processing pipeline to ensure consistent color changes
 * and prevent the racing conditions that caused intermittent color updates.
 * 
 * This test suite validates:
 * 1. Color extraction → harmonization → application pipeline
 * 2. MusicSyncService → ColorHarmonyEngine coordination
 * 3. Consistent color updates without dropping or racing
 * 4. Performance under stress conditions
 */

import { jest } from '@jest/globals';
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import { MusicSyncService } from '@/audio/MusicSyncService';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
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
          uri: 'spotify:track:test123',
          metadata: {
            title: 'Test Song',
            artist_name: 'Test Artist'
          }
        }
      }
    }),
    getPlatform: () => ({
      getAudioData: jest.fn().mockResolvedValue({
        energy: 0.7,
        valence: 0.6,
        tempo: 128
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
}); }

describe('Color Consistency Integration Tests', () => {
  let colorHarmonyEngine: ColorHarmonyEngine;
  let musicSyncService: MusicSyncService;
  let systemCoordinator: SystemCoordinator;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Create fresh instances
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

    // Initialize through coordinator to ensure proper orchestration
    await systemCoordinator.initialize();
    
    // Get coordinated instances
    colorHarmonyEngine = systemCoordinator.getSharedColorHarmonyEngine();
    musicSyncService = systemCoordinator.getSharedMusicSyncService();
  });

  afterEach(async () => {
    if (systemCoordinator) {
      await systemCoordinator.destroy();
    }
    unifiedEventBus.destroy();
  });

  describe('1. Color Processing Pipeline Coordination', () => {
    test('should process colors through complete pipeline without racing', async () => {
      const pipelineSteps: string[] = [];
      const colorResults: any[] = [];

      // Track pipeline progression
      unifiedEventBus.subscribe('colors:extracted', (data) => {
        pipelineSteps.push('extracted');
        colorResults.push({ step: 'extracted', data });
      }, 'pipeline-test-extracted');

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        pipelineSteps.push('harmonized');
        colorResults.push({ step: 'harmonized', data });
      }, 'pipeline-test-harmonized');

      unifiedEventBus.subscribe('colors:applied', (data) => {
        pipelineSteps.push('applied');
        colorResults.push({ step: 'applied', data });
      }, 'pipeline-test-applied');

      // Emit color extraction (simulate album art processing)
      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: {
          PRIMARY: '#7c3aed',
          VIBRANT: '#a855f7',
          PROMINENT: '#8b5cf6',
          VIBRANT_NON_ALARMING: '#9333ea'
        },
        trackUri: 'spotify:track:test123',
        timestamp: Date.now(),
        musicData: {
          energy: 0.8,
          valence: 0.7,
          tempo: 128,
          genre: 'electronic'
        }
      });

      // Wait for pipeline to process
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should process through all pipeline steps in order
      expect(pipelineSteps).toEqual(['extracted', 'harmonized', 'applied']);
      expect(colorResults).toHaveLength(3);

      // Verify data flows correctly through pipeline
      const extractedData = colorResults.find(r => r.step === 'extracted').data;
      const harmonizedData = colorResults.find(r => r.step === 'harmonized').data;
      const appliedData = colorResults.find(r => r.step === 'applied').data;

      expect(extractedData.rawColors.PRIMARY).toBe('#7c3aed');
      expect(harmonizedData.accentHex).toBeDefined();
      expect(appliedData.cssVariables).toBeDefined();
    });

    test('should maintain color consistency under rapid track changes', async () => {
      const trackColors = [
        { trackUri: 'track:1', color: '#ff0000' },
        { trackUri: 'track:2', color: '#00ff00' },
        { trackUri: 'track:3', color: '#0000ff' },
        { trackUri: 'track:4', color: '#ffff00' },
        { trackUri: 'track:5', color: '#ff00ff' }
      ];

      const processedColors: Array<{ trackUri: string; color: string; timestamp: number }> = [];

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        processedColors.push({
          trackUri: data.trackUri,
          color: data.accentHex,
          timestamp: Date.now()
        });
      }, 'rapid-change-test');

      // Emit rapid track changes
      for (const track of trackColors) {
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: track.color },
          trackUri: track.trackUri,
          timestamp: Date.now()
        });
        
        // Small delay to simulate real track changes
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      // Wait for all processing to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should process all track changes without dropping any
      expect(processedColors).toHaveLength(trackColors.length);

      // Verify all tracks were processed in order
      const processedUris = processedColors.map(p => p.trackUri);
      const expectedUris = trackColors.map(t => t.trackUri);
      expect(processedUris).toEqual(expectedUris);

      // Verify timestamps are increasing (no out-of-order processing)
      const timestamps = processedColors.map(p => p.timestamp);
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
      }
    });

    test('should handle concurrent color extractions without conflicts', async () => {
      const concurrentColors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',
        '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
      ];

      const results: string[] = [];
      const processingTimes: number[] = [];

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        results.push(data.accentHex);
        processingTimes.push(data.metadata?.processingTime || 0);
      }, 'concurrent-test');

      // Emit all color extractions simultaneously
      const promises = concurrentColors.map(async (color, index) => {
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: color },
          trackUri: `concurrent:track:${index}`,
          timestamp: Date.now()
        });
      });

      await Promise.all(promises);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should process all colors without conflicts
      expect(results).toHaveLength(concurrentColors.length);

      // All processing times should be reasonable (no hanging)
      expect(processingTimes.every(time => time < 100)).toBe(true);

      // Should have unique results for each input
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1); // Should have some variation
    });
  });

  describe('2. Music-Color Coordination', () => {
    test('should coordinate music analysis with color processing', async () => {
      const coordinationEvents: string[] = [];
      let musicData: any = null;
      let colorData: any = null;

      // Track music events
      unifiedEventBus.subscribe('music:beat', (data) => {
        coordinationEvents.push('music:beat');
        musicData = data;
      }, 'music-coord-test');

      unifiedEventBus.subscribe('music:energy', (data) => {
        coordinationEvents.push('music:energy');
      }, 'music-energy-test');

      // Track color events
      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        coordinationEvents.push('colors:harmonized');
        colorData = data;
      }, 'color-coord-test');

      // Simulate track with music data
      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: { PRIMARY: '#7c3aed' },
        trackUri: 'spotify:track:coordination-test',
        timestamp: Date.now(),
        musicData: {
          energy: 0.9,
          valence: 0.8,
          tempo: 140,
          genre: 'dance'
        }
      });

      // Simulate music beat
      unifiedEventBus.emitSync('music:beat', {
        bpm: 140,
        intensity: 0.9,
        timestamp: Date.now(),
        confidence: 0.95
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should coordinate music and color processing
      expect(coordinationEvents).toContain('music:beat');
      expect(coordinationEvents).toContain('colors:harmonized');

      // Color processing should incorporate music data
      expect(colorData).toBeDefined();
      expect(colorData.metadata?.musicEnergy).toBeDefined();
      
      // Music data should be available
      expect(musicData).toBeDefined();
      expect(musicData.bpm).toBe(140);
      expect(musicData.intensity).toBe(0.9);
    });

    test('should maintain tempo-responsive color updates', async () => {
      const tempoChanges = [60, 80, 100, 120, 140, 160, 180];
      const colorResponses: Array<{ tempo: number; intensity: number; timestamp: number }> = [];

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        if (data.metadata?.musicEnergy) {
          colorResponses.push({
            tempo: data.metadata.musicTempo || 0,
            intensity: data.metadata.musicEnergy,
            timestamp: Date.now()
          });
        }
      }, 'tempo-test');

      // Emit tempo changes with corresponding color extractions
      for (const tempo of tempoChanges) {
        const intensity = Math.min(1.0, tempo / 180); // Higher tempo = higher intensity

        unifiedEventBus.emitSync('music:beat', {
          bpm: tempo,
          intensity,
          timestamp: Date.now(),
          confidence: 0.9
        });

        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: '#7c3aed' },
          trackUri: `tempo:test:${tempo}`,
          timestamp: Date.now(),
          musicData: {
            energy: intensity,
            valence: 0.7,
            tempo,
            genre: 'variable-tempo'
          }
        });

        await new Promise(resolve => setTimeout(resolve, 10));
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should respond to all tempo changes
      expect(colorResponses).toHaveLength(tempoChanges.length);

      // Intensity should generally increase with tempo
      const intensities = colorResponses.map(r => r.intensity);
      const isGenerallyIncreasing = intensities.slice(1).every((val, i) => val >= intensities[i] * 0.8);
      expect(isGenerallyIncreasing).toBe(true);
    });
  });

  describe('3. Error Recovery and Consistency', () => {
    test('should recover from color processing failures gracefully', async () => {
      const processedColors: string[] = [];
      const errorCount = { value: 0 };

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        processedColors.push(data.accentHex);
      }, 'error-recovery-test');

      unifiedEventBus.subscribe('system:error', () => {
        errorCount.value++;
      }, 'error-counter-test');

      // Emit mix of valid and invalid color data
      const testCases = [
        { valid: true, colors: { PRIMARY: '#ff0000' } },
        { valid: false, colors: null }, // Invalid data
        { valid: true, colors: { PRIMARY: '#00ff00' } },
        { valid: false, colors: 'invalid' }, // Invalid data type
        { valid: true, colors: { PRIMARY: '#0000ff' } },
        { valid: false, colors: {} }, // Empty colors
        { valid: true, colors: { PRIMARY: '#ffff00' } }
      ];

      for (const testCase of testCases) {
        try {
          unifiedEventBus.emitSync('colors:extracted', {
            rawColors: testCase.colors,
            trackUri: `error:test:${testCase.valid}`,
            timestamp: Date.now()
          });
        } catch (error) {
          // Should handle errors gracefully
        }
        
        await new Promise(resolve => setTimeout(resolve, 5));
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should process valid colors despite errors
      const validTestCases = testCases.filter(t => t.valid);
      expect(processedColors).toHaveLength(validTestCases.length);

      // Should not have excessive errors (robust error handling)
      expect(errorCount.value).toBeLessThan(testCases.length);
    });

    test('should maintain color consistency during system stress', async () => {
      const stressTestDuration = 1000; // 1 second stress test
      const startTime = Date.now();
      const processedColors: Array<{ color: string; timestamp: number }> = [];
      let totalEmitted = 0;

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        processedColors.push({
          color: data.accentHex,
          timestamp: Date.now()
        });
      }, 'stress-test');

      // Continuous high-frequency color updates
      const stressInterval = setInterval(() => {
        if (Date.now() - startTime > stressTestDuration) {
          clearInterval(stressInterval);
          return;
        }

        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: randomColor },
          trackUri: `stress:test:${totalEmitted}`,
          timestamp: Date.now(),
          musicData: {
            energy: Math.random(),
            valence: Math.random(),
            tempo: 60 + Math.random() * 120
          }
        });

        totalEmitted++;
      }, 10); // 100 Hz update rate

      // Wait for stress test to complete
      await new Promise(resolve => setTimeout(resolve, stressTestDuration + 200));

      // Should handle high frequency updates without significant drops
      const processingRate = processedColors.length / totalEmitted;
      expect(processingRate).toBeGreaterThan(0.8); // At least 80% processing rate

      // Should maintain temporal consistency
      const timestamps = processedColors.map(p => p.timestamp);
      const isTemporallyConsistent = timestamps.every((time, i) => 
        i === 0 || time >= timestamps[i - 1]
      );
      expect(isTemporallyConsistent).toBe(true);

      // Should not have duplicate processing
      const uniqueColors = new Set(processedColors.map(p => p.color));
      expect(uniqueColors.size).toBeGreaterThan(processedColors.length * 0.7); // Reasonable uniqueness
    });
  });

  describe('4. Performance Validation', () => {
    test('should meet color processing performance targets', async () => {
      const performanceMetrics: Array<{ processingTime: number; queueLength: number }> = [];

      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        performanceMetrics.push({
          processingTime: data.metadata?.processingTime || 0,
          queueLength: data.metadata?.queueLength || 0
        });
      }, 'performance-test');

      const testColors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',
        '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
      ];

      const startTime = performance.now();

      // Process test colors
      for (const color of testColors) {
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: color },
          trackUri: `perf:test:${color}`,
          timestamp: Date.now()
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const totalTime = performance.now() - startTime;

      // Should meet performance targets
      expect(totalTime).toBeLessThan(500); // Total processing under 500ms
      expect(performanceMetrics).toHaveLength(testColors.length);

      // Individual processing times should be reasonable
      const avgProcessingTime = performanceMetrics.reduce((sum, m) => sum + m.processingTime, 0) / performanceMetrics.length;
      expect(avgProcessingTime).toBeLessThan(50); // Average under 50ms per color

      // Queue should not build up significantly
      const maxQueueLength = Math.max(...performanceMetrics.map(m => m.queueLength));
      expect(maxQueueLength).toBeLessThan(5); // Queue stays manageable
    });

    test('should maintain memory efficiency during extended operation', async () => {
      const initialMemory = process.memoryUsage?.()?.heapUsed || 0;
      let processedCount = 0;

      unifiedEventBus.subscribe('colors:harmonized', () => {
        processedCount++;
      }, 'memory-test');

      // Extended operation simulation
      const operationDuration = 2000; // 2 seconds
      const startTime = Date.now();
      let emittedCount = 0;

      const memoryTestInterval = setInterval(() => {
        if (Date.now() - startTime > operationDuration) {
          clearInterval(memoryTestInterval);
          return;
        }

        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        
        unifiedEventBus.emitSync('colors:extracted', {
          rawColors: { PRIMARY: randomColor, VIBRANT: randomColor },
          trackUri: `memory:test:${emittedCount}`,
          timestamp: Date.now(),
          musicData: {
            energy: Math.random(),
            valence: Math.random(),
            tempo: 60 + Math.random() * 120,
            genre: 'test'
          }
        });

        emittedCount++;
      }, 50); // 20 Hz

      await new Promise(resolve => setTimeout(resolve, operationDuration + 500));

      const finalMemory = process.memoryUsage?.()?.heapUsed || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // Should process significant number of events
      expect(processedCount).toBeGreaterThan(30);
      expect(emittedCount).toBeGreaterThan(30);

      // Memory increase should be reasonable (under 10MB for extended operation)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      // Processing rate should remain high
      const processingRate = processedCount / emittedCount;
      expect(processingRate).toBeGreaterThan(0.9);
    });
  });

  describe('5. Integration with Visual Systems', () => {
    test('should provide consistent color data for visual system consumption', async () => {
      const visualSystemColors: Array<{ system: string; color: string; timestamp: number }> = [];

      // Simulate multiple visual systems subscribing to color updates
      const visualSystems = ['ParticleSystem', 'BackgroundSystem', 'UIEffectsSystem'];
      
      visualSystems.forEach(systemName => {
        unifiedEventBus.subscribe('colors:applied', (data) => {
          visualSystemColors.push({
            system: systemName,
            color: data.accentHex,
            timestamp: Date.now()
          });
        }, systemName);
      });

      // Emit color update
      unifiedEventBus.emitSync('colors:extracted', {
        rawColors: { PRIMARY: '#7c3aed', VIBRANT: '#a855f7' },
        trackUri: 'visual:integration:test',
        timestamp: Date.now(),
        musicData: {
          energy: 0.8,
          valence: 0.7,
          tempo: 128
        }
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      // All visual systems should receive the same color update
      expect(visualSystemColors).toHaveLength(visualSystems.length);
      
      const colors = visualSystemColors.map(v => v.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(1); // All systems get same color

      // All should receive updates at approximately same time
      const timestamps = visualSystemColors.map(v => v.timestamp);
      const maxTimestampDiff = Math.max(...timestamps) - Math.min(...timestamps);
      expect(maxTimestampDiff).toBeLessThan(50); // Within 50ms
    });
  });
});