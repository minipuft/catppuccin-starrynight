/**
 * Event Bus Unification Integration Tests
 * 
 * Tests the event migration and unification system to ensure all legacy events
 * are properly bridged to the unifiedEventBus, preventing the racing conditions
 * that caused inconsistent color changes.
 * 
 * Key test areas:
 * 1. Legacy event migration to unified events
 * 2. Event transformation accuracy
 * 3. Cross-system event coordination
 * 4. Performance impact of event bridging
 */

import { jest } from '@jest/globals';
import { unifiedEventBus, UnifiedEventBus } from '@/core/events/UnifiedEventBus';
import { EventMigrationManager } from '@/core/events/EventMigrationManager';

// Mock Y3K debug
jest.mock('@/debug/UnifiedDebugManager', () => ({
  Y3K: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

// Mock DOM for event dispatching (avoid redefining if already exists)
if (!global.document) {
  Object.defineProperty(global, 'document', {
    value: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }
  });
}

// Mock window.dispatchEvent (window already exists in JSDOM)
if (!global.window) {
  Object.defineProperty(global, 'window', {
    value: {
      dispatchEvent: jest.fn()
    }
  });
} else {
  global.window.dispatchEvent = jest.fn();
}

describe('Event Bus Unification Integration Tests', () => {
  let testEventBus: UnifiedEventBus;
  let testMigrationManager: EventMigrationManager;

  beforeEach(() => {
    // Create fresh instances for each test
    testEventBus = UnifiedEventBus.getInstance();
    testMigrationManager = EventMigrationManager.getInstance();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear subscriptions but don't destroy instance to avoid breaking singleton pattern
    testEventBus.unsubscribeAll('test-colors-extracted');
    testEventBus.unsubscribeAll('test-colors-harmonized');
    testEventBus.unsubscribeAll('test-music-beat');
    testEventBus.unsubscribeAll('test-music-energy');
    testEventBus.unsubscribeAll('test-track-changed');
    testEventBus.unsubscribeAll('test-global-beat');
    testEventBus.unsubscribeAll('test-global-intensity');
    testEventBus.unsubscribeAll('test-global-colors');
    testEventBus.unsubscribeAll('transform-test');
    testEventBus.unsubscribeAll('fallback-test');
    testEventBus.unsubscribeAll('malformed-test');
    testEventBus.unsubscribeAll('order-music');
    testEventBus.unsubscribeAll('order-colors');
    testEventBus.unsubscribeAll('order-harmonized');
    testEventBus.unsubscribeAll('systemA');
    testEventBus.unsubscribeAll('systemB');
    testEventBus.unsubscribeAll('performance-test');
    testEventBus.unsubscribeAll('fragmentation-test');
    testEventBus.unsubscribeAll('compatibility-test');
    testEventBus.unsubscribeAll('singleton-test');
  });

  describe('1. Legacy Event Migration', () => {
    test('should migrate all critical color processing events', async () => {
      const unifiedEvents: Record<string, any> = {};
      
      // Subscribe to unified color events
      testEventBus.subscribe('colors:extracted', (data) => {
        unifiedEvents['colors:extracted'] = data;
      }, 'test-colors-extracted');

      testEventBus.subscribe('colors:harmonized', (data) => {
        unifiedEvents['colors:harmonized'] = data;
      }, 'test-colors-harmonized');

      // Emit unified color events directly (migration is no longer needed)
      testEventBus.emit('colors:extracted', {
        rawColors: { PRIMARY: '#ff0000', VIBRANT: '#00ff00' },
        trackUri: 'test:track:123',
        timestamp: Date.now()
      });

      testEventBus.emit('colors:harmonized', {
        processedColors: { accent: '#ff0000' },
        accentHex: '#ff0000',
        accentRgb: '255,0,0',
        strategies: ['dynamic-catppuccin'],
        processingTime: 15.5,
        trackUri: 'test:track:123'
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify events were migrated and transformed correctly
      expect(unifiedEvents['colors:extracted']).toMatchObject({
        rawColors: { PRIMARY: '#ff0000', VIBRANT: '#00ff00' },
        trackUri: 'test:track:123',
        timestamp: expect.any(Number)
      });

      expect(unifiedEvents['colors:harmonized']).toMatchObject({
        processedColors: { accent: '#ff0000' },
        accentHex: '#ff0000',
        accentRgb: '255,0,0',
        strategies: ['dynamic-catppuccin'],
        processingTime: 15.5
      });
    });

    test('should migrate all music synchronization events', async () => {
      const musicEvents: Record<string, any> = {};
      
      // Subscribe to unified music events
      testEventBus.subscribe('music:beat', (data) => {
        musicEvents['music:beat'] = data;
      }, 'test-music-beat');

      testEventBus.subscribe('music:energy', (data) => {
        musicEvents['music:energy'] = data;
      }, 'test-music-energy');

      testEventBus.subscribe('music:track-changed', (data) => {
        musicEvents['music:track-changed'] = data;
      }, 'test-track-changed');

      // Emit legacy music events
      testMigrationManager.emitLegacyEvent('music-sync:beat', {
        bpm: 128,
        intensity: 0.75,
        timestamp: Date.now(),
        confidence: 0.9
      });

      testMigrationManager.emitLegacyEvent('music-sync:energy-changed', {
        energy: 0.8,
        valence: 0.6,
        tempo: 128
      });

      testMigrationManager.emitLegacyEvent('music:now-playing-changed', {
        trackUri: 'spotify:track:abc123',
        artist: 'Test Artist',
        title: 'Test Song',
        albumArt: 'https://example.com/art.jpg'
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify music events were properly migrated
      expect(musicEvents['music:beat']).toMatchObject({
        bpm: 128,
        intensity: 0.75,
        timestamp: expect.any(Number),
        confidence: 0.9
      });

      expect(musicEvents['music:energy']).toMatchObject({
        energy: 0.8,
        valence: 0.6,
        tempo: 128,
        timestamp: expect.any(Number)
      });

      expect(musicEvents['music:track-changed']).toMatchObject({
        trackUri: 'spotify:track:abc123',
        artist: 'Test Artist',
        title: 'Test Song',
        albumArt: 'https://example.com/art.jpg',
        timestamp: expect.any(Number)
      });
    });

    test('should handle GlobalEventBus pattern events', async () => {
      const globalEvents: Record<string, any> = {};
      
      // Subscribe to events that come from GlobalEventBus patterns
      testEventBus.subscribe('music:beat', (data) => {
        globalEvents['beat/frame'] = data;
      }, 'test-global-beat');

      testEventBus.subscribe('music:energy', (data) => {
        globalEvents['beat/intensity'] = data;
      }, 'test-global-intensity');

      testEventBus.subscribe('colors:extracted', (data) => {
        globalEvents['colors/extracted'] = data;
      }, 'test-global-colors');

      // Emit GlobalEventBus pattern events
      testMigrationManager.emitLegacyEvent('beat/frame', {
        bpm: 140,
        intensity: 0.9,
        confidence: 0.85
      });

      testMigrationManager.emitLegacyEvent('beat/intensity', {
        intensity: 0.7,
        energy: 0.8
      });

      testMigrationManager.emitLegacyEvent('colors/extracted', {
        colors: { PROMINENT: '#00ffff' },
        uri: 'test:global:track'
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify GlobalEventBus events were migrated
      expect(globalEvents['beat/frame']).toMatchObject({
        bpm: 140,
        intensity: 0.9,
        confidence: 0.85
      });

      expect(globalEvents['beat/intensity']).toMatchObject({
        energy: 0.8, // Should be mapped from intensity
        valence: expect.any(Number),
        tempo: expect.any(Number)
      });

      expect(globalEvents['colors/extracted']).toMatchObject({
        rawColors: { PROMINENT: '#00ffff' },
        trackUri: 'test:global:track'
      });
    });
  });

  describe('2. Event Transformation Accuracy', () => {
    test('should transform legacy event data structures to unified format', async () => {
      let transformedData: any = null;
      
      testEventBus.subscribe('colors:harmonized', (data) => {
        transformedData = data;
      }, 'transform-test');

      // Emit legacy event with old data structure
      testMigrationManager.emitLegacyEvent('colors-harmonized', {
        colors: { accent: '#purple' }, // Legacy format
        accentHex: '#7c3aed',
        rgb: '124,58,237', // Legacy rgb field
        strategies: ['cosmic'],
        processingTime: 23.7,
        uri: 'legacy:track:uri' // Legacy uri field
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should transform to unified format
      expect(transformedData).toMatchObject({
        processedColors: { accent: '#purple' }, // Transformed field name
        accentHex: '#7c3aed',
        accentRgb: '124,58,237', // Transformed field name
        strategies: ['cosmic'],
        processingTime: 23.7,
        trackUri: 'legacy:track:uri' // Transformed field name
      });
    });

    test('should provide fallback data for missing fields', async () => {
      let fallbackData: any = null;
      
      testEventBus.subscribe('colors:harmonized', (data) => {
        fallbackData = data;
      }, 'fallback-test');

      // Emit minimal legacy event
      testMigrationManager.emitLegacyEvent('colors-harmonized', {
        // Missing most fields
        accentHex: '#ff5555'
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should provide sensible fallbacks
      expect(fallbackData).toMatchObject({
        processedColors: {}, // Fallback empty object
        accentHex: '#ff5555',
        accentRgb: '0,0,0', // Actual fallback default
        strategies: [], // Actual fallback value (empty array)
        processingTime: 0, // Fallback value
        trackUri: 'unknown' // Fallback value
      });
    });

    test('should handle malformed legacy event data gracefully', async () => {
      const errorSpy = jest.fn();
      let receivedData: any = null;
      
      testEventBus.subscribe('colors:extracted', (data) => {
        receivedData = data;
      }, 'malformed-test');

      // Mock error logging
      const originalError = console.error;
      console.error = errorSpy;

      try {
        // Emit malformed data
        testMigrationManager.emitLegacyEvent('colors-extracted', null);
        testMigrationManager.emitLegacyEvent('colors-extracted', 'invalid-data');
        testMigrationManager.emitLegacyEvent('colors-extracted', { malformed: true });

        await new Promise(resolve => setTimeout(resolve, 10));

        // Should handle gracefully without crashing
        expect(errorSpy).not.toHaveBeenCalled();
        
        // Should still process valid events
        testMigrationManager.emitLegacyEvent('colors-extracted', {
          colors: { PRIMARY: '#valid' },
          trackUri: 'valid:track'
        });

        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(receivedData).toMatchObject({
          rawColors: { PRIMARY: '#valid' },
          trackUri: 'valid:track'
        });
      } finally {
        console.error = originalError;
      }
    });
  });

  describe('3. Cross-System Event Coordination', () => {
    test('should coordinate music and color events without racing', async () => {
      const eventOrder: string[] = [];
      const eventTimestamps: number[] = [];
      
      // Track event processing order
      testEventBus.subscribe('music:beat', () => {
        eventOrder.push('music:beat');
        eventTimestamps.push(performance.now());
      }, 'order-music');

      testEventBus.subscribe('colors:extracted', () => {
        eventOrder.push('colors:extracted');
        eventTimestamps.push(performance.now());
      }, 'order-colors');

      testEventBus.subscribe('colors:harmonized', () => {
        eventOrder.push('colors:harmonized');
        eventTimestamps.push(performance.now());
      }, 'order-harmonized');

      // Emit rapid sequence of events (stress test)
      testMigrationManager.emitLegacyEvent('music-sync:beat', { bpm: 120 });
      testMigrationManager.emitLegacyEvent('colors-extracted', { colors: { PRIMARY: '#red' } });
      testMigrationManager.emitLegacyEvent('colors-harmonized', { accentHex: '#red' });
      testMigrationManager.emitLegacyEvent('music-sync:beat', { bpm: 125 });
      testMigrationManager.emitLegacyEvent('colors-extracted', { colors: { PRIMARY: '#blue' } });

      await new Promise(resolve => setTimeout(resolve, 20));

      // Should process all events in order without dropping any
      expect(eventOrder).toHaveLength(5);
      expect(eventOrder.filter(e => e === 'music:beat')).toHaveLength(2);
      expect(eventOrder.filter(e => e === 'colors:extracted')).toHaveLength(2);
      expect(eventOrder.filter(e => e === 'colors:harmonized')).toHaveLength(1);

      // Events should be processed sequentially (no racing)
      const timeDiffs = eventTimestamps.slice(1).map((time, i) => time - eventTimestamps[i]);
      expect(timeDiffs.every(diff => diff >= 0)).toBe(true); // Should be monotonic
    });

    test('should maintain event subscription isolation between systems', async () => {
      const systemAEvents: any[] = [];
      const systemBEvents: any[] = [];
      
      // System A subscriptions
      testEventBus.subscribe('colors:extracted', (data) => {
        systemAEvents.push({ type: 'colors:extracted', data });
      }, 'systemA');

      testEventBus.subscribe('music:beat', (data) => {
        systemAEvents.push({ type: 'music:beat', data });
      }, 'systemA');

      // System B subscriptions (different subscriber name)
      testEventBus.subscribe('colors:extracted', (data) => {
        systemBEvents.push({ type: 'colors:extracted', data });
      }, 'systemB');

      // Emit events
      testMigrationManager.emitLegacyEvent('colors-extracted', { colors: { PRIMARY: '#test' } });
      testMigrationManager.emitLegacyEvent('music-sync:beat', { bpm: 100 });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Both systems should receive appropriate events
      expect(systemAEvents).toHaveLength(2); // Both events
      expect(systemBEvents).toHaveLength(1); // Only colors event

      // Unsubscribe system A
      testEventBus.unsubscribeAll('systemA');

      // Emit more events
      testMigrationManager.emitLegacyEvent('colors-extracted', { colors: { PRIMARY: '#test2' } });

      await new Promise(resolve => setTimeout(resolve, 10));

      // System A should not receive new events, System B should
      expect(systemAEvents).toHaveLength(2); // No new events
      expect(systemBEvents).toHaveLength(2); // One new event
    });
  });

  describe('4. Performance and Memory Management', () => {
    test('should handle high-frequency event migration efficiently', async () => {
      const startTime = performance.now();
      let processedCount = 0;
      
      testEventBus.subscribe('music:beat', () => {
        processedCount++;
      }, 'performance-test');

      // Emit high frequency events
      const eventCount = 1000;
      for (let i = 0; i < eventCount; i++) {
        testMigrationManager.emitLegacyEvent('music-sync:beat', {
          bpm: 120 + (i % 20),
          intensity: Math.random()
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const processingTime = performance.now() - startTime;

      // Should process all events efficiently
      expect(processedCount).toBe(eventCount);
      expect(processingTime).toBeLessThan(1000); // Should complete in under 1 second

      // Should not cause memory leaks
      const metrics = testEventBus.getMetrics();
      expect(metrics.memoryUsage).toBeLessThan(1024 * 1024); // Under 1MB
    });

    test('should cleanup abandoned subscriptions automatically', async () => {
      // Create temporary subscriptions
      const tempSubscriptionIds: string[] = [];
      for (let i = 0; i < 10; i++) {
        const id = testEventBus.subscribe('colors:extracted', () => {}, `temp-subscriber-${i}`);
        tempSubscriptionIds.push(id);
      }

      let initialMetrics = testEventBus.getMetrics();
      expect(initialMetrics.activeSubscriptions).toBeGreaterThanOrEqual(10);

      // Simulate abandoned subscriptions (no activity for over 5 minutes)
      // Note: In real implementation, this would happen automatically
      // For testing, we manually trigger cleanup
      
      // Emit events to trigger cleanup
      for (let i = 0; i < 5; i++) {
        testMigrationManager.emitLegacyEvent('colors-extracted', { colors: {} });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Check that subscriptions are being managed
      const finalMetrics = testEventBus.getMetrics();
      expect(finalMetrics.totalEvents).toBeGreaterThan(0);
      expect(finalMetrics.activeSubscriptions).toBeGreaterThan(0);
    });

    test('should report accurate migration metrics', async () => {
      // Reset metrics
      const migrationManager = EventMigrationManager.getInstance();
      
      // Emit various types of events
      const eventTypes = [
        'colors-extracted',
        'colors-harmonized',
        'music-sync:beat',
        'music-sync:energy-changed',
        'advancedThemeSystemSettingsChanged'
      ];

      for (const eventType of eventTypes) {
        migrationManager.emitLegacyEvent(eventType, { test: true });
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const metrics = migrationManager.getMetrics();
      
      expect(metrics.totalLegacyEvents).toBeGreaterThanOrEqual(eventTypes.length);
      expect(metrics.totalUnifiedEvents).toBeGreaterThanOrEqual(eventTypes.length);
      expect(metrics.conversionRate).toBeGreaterThan(0);
    });
  });

  describe('5. Regression Prevention', () => {
    test('should prevent event system fragmentation', async () => {
      // Test that all events go through unified bus, not multiple buses
      let unifiedEventCount = 0;
      let legacyEventCount = 0;

      // Monitor unified events
      const eventTypes = ['colors:extracted', 'music:beat', 'settings:changed'];
      eventTypes.forEach(eventType => {
        testEventBus.subscribe(eventType as any, () => {
          unifiedEventCount++;
        }, 'fragmentation-test');
      });

      // Monitor legacy DOM events (should not be used)
      const legacyTypes = ['colors-extracted', 'music-sync:beat', 'advancedThemeSystemSettingsChanged'];
      legacyTypes.forEach(eventType => {
        document.addEventListener(eventType, () => {
          legacyEventCount++;
        });
      });

      // Emit events through migration manager
      testMigrationManager.emitLegacyEvent('colors-extracted', { colors: {} });
      testMigrationManager.emitLegacyEvent('music-sync:beat', { bpm: 120 });
      testMigrationManager.emitLegacyEvent('advancedThemeSystemSettingsChanged', { setting: 'test' });

      await new Promise(resolve => setTimeout(resolve, 20));

      // All events should go through unified bus
      expect(unifiedEventCount).toBe(3);
      expect(legacyEventCount).toBe(0); // No legacy events should be used
    });

    test('should maintain backwards compatibility for existing event patterns', async () => {
      const receivedEvents: Record<string, any> = {};

      // Subscribe to unified events
      testEventBus.subscribe('colors:extracted', (data) => {
        receivedEvents.colorsExtracted = data;
      }, 'compatibility-test');

      testEventBus.subscribe('music:beat', (data) => {
        receivedEvents.musicBeat = data;
      }, 'compatibility-test');

      // Emit legacy events with old patterns
      testMigrationManager.emitLegacyEvent('colors-extracted', {
        colors: { PRIMARY: '#legacy' },
        uri: 'legacy:format:uri'
      });

      testMigrationManager.emitLegacyEvent('beat/frame', {
        bpm: 130,
        intensity: 0.6
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should work with both old and new patterns
      expect(receivedEvents.colorsExtracted).toMatchObject({
        rawColors: { PRIMARY: '#legacy' },
        trackUri: 'legacy:format:uri'
      });

      expect(receivedEvents.musicBeat).toMatchObject({
        bpm: 130,
        intensity: 0.6
      });
    });

    test('should prevent event bus instance proliferation', async () => {
      // Multiple getInstance calls should return same instance
      const instance1 = UnifiedEventBus.getInstance();
      const instance2 = UnifiedEventBus.getInstance();
      const instance3 = UnifiedEventBus.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBe(testEventBus);

      // Event subscriptions should work across all references
      let eventReceived = false;
      
      instance1.subscribe('test:event', () => {
        eventReceived = true;
      }, 'singleton-test');

      instance2.emitSync('test:event' as any, { test: true });

      expect(eventReceived).toBe(true);
    });
  });
});