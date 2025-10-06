/**
 * Event Bus Unification Integration Tests
 *
 * Tests the unified event bus system to ensure all events are properly
 * coordinated across systems, preventing race conditions that could
 * cause inconsistent color changes.
 *
 * Key test areas:
 * 1. Unified event emission and subscription
 * 2. Event type safety and data transformation
 * 3. Cross-system event coordination
 * 4. Performance and cleanup
 */

import { jest } from '@jest/globals';
import { unifiedEventBus, UnifiedEventBus } from '@/core/events/EventBus';

// Mock Y3K debug
jest.mock('@/debug/DebugCoordinator', () => ({
  Y3KDebug: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

describe('UnifiedEventBus Integration Tests', () => {
  let testEventBus: UnifiedEventBus;

  beforeEach(() => {
    // Get UnifiedEventBus singleton instance
    testEventBus = UnifiedEventBus.getInstance();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear test subscriptions
    testEventBus.unsubscribeAll('test-subscriber');
    testEventBus.unsubscribeAll('test-color-subscriber');
    testEventBus.unsubscribeAll('test-music-subscriber');
  });

  describe('1. Core Event System', () => {
    test('should emit and receive color processing events', async () => {
      const receivedEvents: Record<string, any> = {};

      // Subscribe to color events
      testEventBus.subscribe('colors:extracted', (data) => {
        receivedEvents['colors:extracted'] = data;
      }, 'test-color-subscriber');

      testEventBus.subscribe('colors:harmonized', (data) => {
        receivedEvents['colors:harmonized'] = data;
      }, 'test-color-subscriber');

      // Emit color events
      await testEventBus.emit('colors:extracted', {
        rawColors: { PRIMARY: '#ff0000', VIBRANT: '#00ff00' },
        trackUri: 'test:track:123',
        timestamp: Date.now()
      });

      await testEventBus.emit('colors:harmonized', {
        processedColors: { accent: '#ff0000' },
        accentHex: '#ff0000',
        accentRgb: '255,0,0',
        strategies: ['dynamic-catppuccin'],
        processingTime: 15.5,
        trackUri: 'test:track:123'
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify events were received
      expect(receivedEvents['colors:extracted']).toMatchObject({
        rawColors: { PRIMARY: '#ff0000', VIBRANT: '#00ff00' },
        trackUri: 'test:track:123',
        timestamp: expect.any(Number)
      });

      expect(receivedEvents['colors:harmonized']).toMatchObject({
        processedColors: { accent: '#ff0000' },
        accentHex: '#ff0000',
        accentRgb: '255,0,0',
        strategies: ['dynamic-catppuccin'],
        processingTime: 15.5
      });
    });

    test('should emit and receive music synchronization events', async () => {
      const receivedEvents: Record<string, any> = {};

      // Subscribe to music events
      testEventBus.subscribe('music:beat', (data) => {
        receivedEvents['music:beat'] = data;
      }, 'test-music-subscriber');

      testEventBus.subscribe('music:energy', (data) => {
        receivedEvents['music:energy'] = data;
      }, 'test-music-subscriber');

      testEventBus.subscribe('music:track-changed', (data) => {
        receivedEvents['music:track-changed'] = data;
      }, 'test-music-subscriber');

      // Emit music events
      await testEventBus.emit('music:beat', {
        bpm: 128,
        intensity: 0.75,
        timestamp: Date.now(),
        confidence: 0.9
      });

      await testEventBus.emit('music:energy', {
        energy: 0.8,
        valence: 0.6,
        tempo: 128,
        timestamp: Date.now()
      });

      await testEventBus.emit('music:track-changed', {
        trackUri: 'spotify:track:abc123',
        artist: 'Test Artist',
        title: 'Test Song',
        albumArt: 'https://example.com/art.jpg',
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify music events
      expect(receivedEvents['music:beat']).toMatchObject({
        bpm: 128,
        intensity: 0.75,
        confidence: 0.9
      });

      expect(receivedEvents['music:energy']).toMatchObject({
        energy: 0.8,
        valence: 0.6,
        tempo: 128
      });

      expect(receivedEvents['music:track-changed']).toMatchObject({
        trackUri: 'spotify:track:abc123',
        artist: 'Test Artist',
        title: 'Test Song'
      });
    });
  });

  describe('2. Event Coordination', () => {
    test('should coordinate events across multiple subscribers', async () => {
      let systemAReceived = 0;
      let systemBReceived = 0;

      testEventBus.subscribe('colors:extracted', () => {
        systemAReceived++;
      }, 'systemA');

      testEventBus.subscribe('colors:extracted', () => {
        systemBReceived++;
      }, 'systemB');

      // Emit multiple events
      await testEventBus.emit('colors:extracted', {
        rawColors: {},
        trackUri: 'test:1',
        timestamp: Date.now()
      });

      await testEventBus.emit('colors:extracted', {
        rawColors: {},
        trackUri: 'test:2',
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(systemAReceived).toBe(2);
      expect(systemBReceived).toBe(2);
    });

    test('should handle event subscription and unsubscription', () => {
      let eventCount = 0;

      const subscriptionId = testEventBus.subscribe('music:beat', () => {
        eventCount++;
      }, 'test-subscriber');

      testEventBus.emitSync('music:beat', {
        bpm: 120,
        intensity: 0.5,
        timestamp: Date.now(),
        confidence: 0.8
      });

      expect(eventCount).toBe(1);

      // Unsubscribe
      testEventBus.unsubscribe(subscriptionId);

      testEventBus.emitSync('music:beat', {
        bpm: 120,
        intensity: 0.5,
        timestamp: Date.now(),
        confidence: 0.8
      });

      // Should still be 1 since we unsubscribed
      expect(eventCount).toBe(1);
    });
  });

  describe('3. Performance and Cleanup', () => {
    test('should handle rapid event emissions', async () => {
      let receivedCount = 0;

      testEventBus.subscribe('music:beat', () => {
        receivedCount++;
      }, 'test-subscriber');

      // Emit many events rapidly
      const emitPromises = [];
      for (let i = 0; i < 100; i++) {
        emitPromises.push(testEventBus.emit('music:beat', {
          bpm: 120 + i,
          intensity: 0.5,
          timestamp: Date.now(),
          confidence: 0.8
        }));
      }

      await Promise.all(emitPromises);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(receivedCount).toBe(100);
    });

    test('should provide metrics about event system usage', () => {
      const subscriptionId = testEventBus.subscribe('colors:extracted', () => {}, 'test-subscriber');

      testEventBus.emitSync('colors:extracted', {
        rawColors: {},
        trackUri: 'test',
        timestamp: Date.now()
      });

      const metrics = testEventBus.getMetrics();

      expect(metrics.totalEvents).toBeGreaterThan(0);
      expect(metrics.activeSubscriptions).toBeGreaterThan(0);

      testEventBus.unsubscribe(subscriptionId);
    });
  });

  describe('4. Error Handling', () => {
    test('should handle subscriber errors gracefully', async () => {
      let successfulHandlerCalled = false;

      // Subscribe with an error-throwing handler
      testEventBus.subscribe('colors:extracted', () => {
        throw new Error('Test error');
      }, 'error-subscriber');

      // Subscribe with a successful handler
      testEventBus.subscribe('colors:extracted', () => {
        successfulHandlerCalled = true;
      }, 'success-subscriber');

      // Emit event
      await testEventBus.emit('colors:extracted', {
        rawColors: {},
        trackUri: 'test',
        timestamp: Date.now()
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Successful handler should still be called despite error in first handler
      expect(successfulHandlerCalled).toBe(true);

      // Cleanup
      testEventBus.unsubscribeAll('error-subscriber');
      testEventBus.unsubscribeAll('success-subscriber');
    });
  });
});
