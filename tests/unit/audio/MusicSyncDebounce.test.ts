/**
 * Phase 1 Test: Song Change Debouncing
 * Verifies that rapid track changes are debounced to prevent visual inconsistencies
 */

import { MusicSyncService } from '@/audio/MusicSyncService';

// Mock Spicetify global
const mockSpicetify = {
  Player: {
    data: {
      item: {
        uri: 'spotify:track:initial',
        duration: { milliseconds: 180000 }
      }
    }
  },
  colorExtractor: jest.fn().mockResolvedValue({}),
  CosmosAsync: {
    get: jest.fn().mockResolvedValue({ audio_features: [{ tempo: 120, energy: 0.5, valence: 0.7 }] })
  }
};

// @ts-ignore
global.Spicetify = mockSpicetify;

describe('MusicSyncService Debouncing', () => {
  let musicSyncService: MusicSyncService;
  let processInternalSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    musicSyncService = new MusicSyncService({
      ADVANCED_SYSTEM_CONFIG: { enableDebug: false } as any,
      Year3000Utilities: {} as any,
      settingsManager: null,
      advancedThemeSystem: null,
    });

    // Spy on the internal method to count actual processing calls
    processInternalSpy = jest.spyOn(musicSyncService as any, '_processSongUpdateInternal')
      .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.useRealTimers();
    processInternalSpy.mockRestore();
  });

  test('should debounce rapid track changes', async () => {
    // Simulate 6 rapid track changes within 300ms
    const trackUris = [
      'spotify:track:1',
      'spotify:track:2', 
      'spotify:track:3',
      'spotify:track:4',
      'spotify:track:5',
      'spotify:track:6'
    ];

    // Fire all changes rapidly
    for (const uri of trackUris) {
      mockSpicetify.Player.data.item.uri = uri;
      musicSyncService.processSongUpdate();
      jest.advanceTimersByTime(50); // 50ms between each call
    }

    // Should not have processed anything yet (still within debounce window)
    expect(processInternalSpy).toHaveBeenCalledTimes(0);

    // Fast-forward past debounce period (200ms)
    jest.advanceTimersByTime(200);

    // Should have processed only once with the final track
    expect(processInternalSpy).toHaveBeenCalledTimes(1);
    expect(processInternalSpy).toHaveBeenCalledWith('spotify:track:6');
  });

  test('should bypass debouncing when force=true', async () => {
    mockSpicetify.Player.data.item.uri = 'spotify:track:force';

    // Call with force=true should execute immediately
    await musicSyncService.processSongUpdate(true);

    // Should process immediately without waiting for debounce
    expect(processInternalSpy).toHaveBeenCalledTimes(1);
    expect(processInternalSpy).toHaveBeenCalledWith('spotify:track:force');
  });

  test('should handle cleanup of debounce timer on destroy', () => {
    mockSpicetify.Player.data.item.uri = 'spotify:track:cleanup';
    
    // Start a debounced call
    musicSyncService.processSongUpdate();
    
    // Destroy service before debounce completes
    musicSyncService.destroy();
    
    // Fast-forward past debounce period
    jest.advanceTimersByTime(300);
    
    // Should not have processed due to cleanup
    expect(processInternalSpy).toHaveBeenCalledTimes(0);
  });
});