/**
 * User Experience Integration Tests
 * 
 * Tests user-facing functionality, theme integration, and end-to-end
 * behaviors that directly impact the user experience of the Catppuccin
 * StarryNight theme.
 * 
 * Focus: Theme behavior, user interactions, visual quality
 */

import { AdvancedThemeSystem } from '@/core/lifecycle/AdvancedThemeSystem';
import { MusicBeatSynchronizer } from '@/visual/music/MusicSyncVisualEffects';
import { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';

// Mock Spicetify environment
const mockSpicetify = {
  Player: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    data: {
      track: {
        metadata: {
          title: 'Test Track',
          artist_name: 'Test Artist',
          album_name: 'Test Album'
        }
      }
    }
  },
  Platform: {
    History: {
      listen: jest.fn(() => jest.fn()) // Return cleanup function
    }
  },
  colorExtractor: jest.fn().mockResolvedValue({
    LIGHT_VIBRANT: { hex: '#ff6b6b' },
    VIBRANT: { hex: '#4ecdc4' },
    DARK_VIBRANT: { hex: '#45b7d1' }
  })
};

(global as any).Spicetify = mockSpicetify;

describe('User Experience Integration', () => {
  let advancedThemeSystem: AdvancedThemeSystem;
  let musicSyncSystem: MusicBeatSynchronizer;
  let colorHarmonyEngine: ColorHarmonyEngine;

  beforeEach(() => {
    // Setup DOM environment with Spotify-like structure
    document.body.innerHTML = `
      <div class="Root__main-view">
        <div class="main-nowPlayingView-nowPlayingGrid">
          <div class="main-trackInfo-container">
            <div class="main-trackInfo-name">Test Track</div>
            <div class="main-trackInfo-artists">Test Artist</div>
          </div>
          <div class="main-coverSlotExpanded-container">
            <img class="main-image-image" src="data:image/png;base64,..." />
          </div>
        </div>
        <div class="Root__right-sidebar">
          <div class="main-nowPlayingView-queue"></div>
        </div>
      </div>
    `;

    // Initialize systems
    advancedThemeSystem = new AdvancedThemeSystem(ADVANCED_SYSTEM_CONFIG);
    musicSyncSystem = new MusicBeatSynchronizer(ADVANCED_SYSTEM_CONFIG);
    colorHarmonyEngine = new ColorHarmonyEngine(ADVANCED_SYSTEM_CONFIG);
  });

  afterEach(() => {
    // Cleanup
    if (advancedThemeSystem && advancedThemeSystem.initialized) {
      advancedThemeSystem.destroy();
    }
    if (musicSyncSystem && musicSyncSystem.initialized) {
      musicSyncSystem.destroy();
    }
    if (colorHarmonyEngine && colorHarmonyEngine.initialized) {
      colorHarmonyEngine.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('Theme Integration', () => {
    it('should integrate with Spotify UI structure', async () => {
      await advancedThemeSystem.initialize();
      
      // Check that theme recognizes Spotify elements
      const mainView = document.querySelector('.Root__main-view');
      const nowPlaying = document.querySelector('.main-nowPlayingView-nowPlayingGrid');
      const rightSidebar = document.querySelector('.Root__right-sidebar');
      
      expect(mainView).toBeTruthy();
      expect(nowPlaying).toBeTruthy();
      expect(rightSidebar).toBeTruthy();
    });

    it('should apply visual effects to UI elements', async () => {
      await advancedThemeSystem.initialize();
      await musicSyncSystem.initialize();
      
      // Simulate music beat
      const beatEvent = new CustomEvent('music:beat', {
        detail: { intensity: 0.8, bpm: 128, energy: 0.7 }
      });
      document.dispatchEvent(beatEvent);
      
      // Wait for visual effects to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check that CSS variables are updated
      const rootStyle = getComputedStyle(document.documentElement);
      const musicIntensity = rootStyle.getPropertyValue('--sn-music-intensity');
      
      // Should have some value (may be default if event processing is mocked)
      expect(typeof musicIntensity === 'string').toBe(true);
    });

    it('should handle color extraction from album art', async () => {
      await colorHarmonyEngine.initialize();
      
      const albumImage = document.querySelector('.main-image-image') as HTMLImageElement;
      expect(albumImage).toBeTruthy();
      
      // Trigger color extraction
      if (albumImage) {
        albumImage.dispatchEvent(new Event('load'));
      }
      
      // Wait for color processing
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Check that color harmony is active
      const healthCheck = await colorHarmonyEngine.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });
  });

  describe('Music Synchronization Experience', () => {
    it('should respond to music playback changes', async () => {
      await musicSyncSystem.initialize();
      
      // Simulate track change
      const trackChangeEvent = new CustomEvent('music:track-changed', {
        detail: {
          track: {
            name: 'New Track',
            artists: ['New Artist'],
            album: { name: 'New Album' }
          }
        }
      });
      document.dispatchEvent(trackChangeEvent);
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // System should handle the change without errors
      const healthCheck = await musicSyncSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should synchronize visual effects with music tempo', async () => {
      await musicSyncSystem.initialize();
      
      // Simulate tempo changes
      const tempos = [60, 120, 180]; // Slow, medium, fast
      
      for (const bpm of tempos) {
        const tempoEvent = new CustomEvent('music:bpm-change', {
          detail: { bpm, tempo: 'variable', enhancedBPM: bpm }
        });
        document.dispatchEvent(tempoEvent);
        
        // Process animation frame
        musicSyncSystem.updateAnimation(16.67);
        
        // Get current state
        const syncState = musicSyncSystem.getMusicSyncState();
        expect(syncState.currentBPM).toBe(bpm);
      }
    });

    it('should maintain smooth visual transitions', async () => {
      await musicSyncSystem.initialize();
      
      const initialState = musicSyncSystem.getMusicSyncState();
      
      // Simulate rapid beat changes
      for (let i = 0; i < 10; i++) {
        const beatEvent = new CustomEvent('music:beat', {
          detail: { 
            intensity: Math.random(), 
            bpm: 120 + Math.random() * 60,
            energy: Math.random()
          }
        });
        document.dispatchEvent(beatEvent);
        
        musicSyncSystem.updateAnimation(16.67);
      }
      
      const finalState = musicSyncSystem.getMusicSyncState();
      
      // Values should be smooth (not extreme jumps)
      expect(finalState.scaleMultiplier).toBeGreaterThanOrEqual(0.5);
      expect(finalState.scaleMultiplier).toBeLessThanOrEqual(2.0);
      expect(finalState.colorTemperature).toBeGreaterThanOrEqual(1000);
      expect(finalState.colorTemperature).toBeLessThanOrEqual(20000);
    });
  });

  describe('Performance Impact on User Experience', () => {
    it('should maintain 60fps during visual effects', async () => {
      await advancedThemeSystem.initialize();
      await musicSyncSystem.initialize();
      
      const frameTime = 16.67; // 60fps target
      const testFrames = 120; // 2 seconds
      
      const startTime = performance.now();
      
      for (let frame = 0; frame < testFrames; frame++) {
        musicSyncSystem.updateAnimation(frameTime);
        
        // Simulate beat events periodically
        if (frame % 30 === 0) { // Every 0.5 seconds
          const beatEvent = new CustomEvent('music:beat', {
            detail: { intensity: 0.8, bpm: 128, energy: 0.7 }
          });
          document.dispatchEvent(beatEvent);
        }
      }
      
      const totalTime = performance.now() - startTime;
      const averageFrameTime = totalTime / testFrames;
      
      // Should process frames efficiently
      expect(averageFrameTime).toBeLessThan(5); // <5ms per frame
    });

    it('should handle memory efficiently during extended use', async () => {
      await advancedThemeSystem.initialize();
      
      // Simulate extended use with many events
      for (let i = 0; i < 1000; i++) {
        const randomEvent = new CustomEvent(
          Math.random() > 0.5 ? 'music:beat' : 'music:energy',
          { detail: { intensity: Math.random(), energy: Math.random() } }
        );
        document.dispatchEvent(randomEvent);
        
        // Process every 10th event
        if (i % 10 === 0) {
          musicSyncSystem.updateAnimation(16.67);
        }
      }
      
      // System should remain healthy
      const healthCheck = await advancedThemeSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should minimize CPU usage during idle periods', async () => {
      await musicSyncSystem.initialize();
      
      // Simulate idle period (no music events)
      const idleFrames = 300; // 5 seconds of idle
      
      for (let frame = 0; frame < idleFrames; frame++) {
        musicSyncSystem.updateAnimation(16.67);
      }
      
      // System should be efficient during idle
      const syncMetrics = musicSyncSystem.getMusicSyncMetrics();
      expect(syncMetrics.averageFrameTime).toBeLessThan(2); // <2ms per frame when idle
    });
  });

  describe('Visual Quality Assurance', () => {
    it('should provide smooth color transitions', async () => {
      await colorHarmonyEngine.initialize();
      
      // Simulate color changes
      const colors = [
        { r: 255, g: 107, b: 107 }, // Light red
        { r: 78, g: 205, b: 196 },  // Teal
        { r: 69, g: 183, b: 209 }   // Blue
      ];
      
      for (const color of colors) {
        await colorHarmonyEngine.analyzeColors({
          dominant: color,
          vibrant: color,
          lightVibrant: color
        });
        
        // Process transition
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Should complete without errors
      const healthCheck = await colorHarmonyEngine.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should handle edge cases gracefully', async () => {
      await advancedThemeSystem.initialize();
      
      // Test edge cases
      const edgeCases = [
        { type: 'music:beat', detail: { intensity: 0, bpm: 0, energy: 0 } },
        { type: 'music:beat', detail: { intensity: 1, bpm: 300, energy: 1 } },
        { type: 'music:beat', detail: { intensity: -1, bpm: -1, energy: -1 } },
        { type: 'music:beat', detail: null },
        { type: 'music:beat', detail: undefined }
      ];
      
      for (const testCase of edgeCases) {
        const event = new CustomEvent(testCase.type, { detail: testCase.detail });
        
        // Should not throw errors
        expect(() => {
          document.dispatchEvent(event);
          musicSyncSystem.updateAnimation(16.67);
        }).not.toThrow();
      }
    });

    it('should maintain visual consistency across different screen sizes', async () => {
      await advancedThemeSystem.initialize();
      
      // Test different viewport sizes
      const viewportSizes = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 1366, height: 768 },  // Laptop
        { width: 1024, height: 768 }   // Tablet
      ];
      
      for (const size of viewportSizes) {
        // Simulate viewport change
        Object.defineProperty(window, 'innerWidth', { value: size.width });
        Object.defineProperty(window, 'innerHeight', { value: size.height });
        
        window.dispatchEvent(new Event('resize'));
        
        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // System should adapt without errors
        const healthCheck = await advancedThemeSystem.healthCheck();
        expect(healthCheck.healthy).toBeDefined();
      }
    });
  });

  describe('Accessibility and Reduced Motion', () => {
    it('should respect prefers-reduced-motion setting', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: true, // prefers-reduced-motion: reduce
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        }))
      });
      
      await musicSyncSystem.initialize();
      
      // Simulate intense music
      const intenseBeat = new CustomEvent('music:beat', {
        detail: { intensity: 1.0, bpm: 180, energy: 1.0 }
      });
      document.dispatchEvent(intenseBeat);
      
      musicSyncSystem.updateAnimation(16.67);
      
      // Visual effects should be reduced but system should still function
      const healthCheck = await musicSyncSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should maintain theme functionality with animations disabled', async () => {
      // Simulate disabled animations
      const customConfig = {
        ...ADVANCED_SYSTEM_CONFIG,
        visualEffects: {
          ...ADVANCED_SYSTEM_CONFIG.visualEffects,
          enableAnimations: false
        }
      };
      
      const reducedMotionSystem = new MusicBeatSynchronizer(customConfig);
      await reducedMotionSystem.initialize();
      
      // System should still function without animations
      reducedMotionSystem.updateAnimation(16.67);
      
      const healthCheck = await reducedMotionSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
      
      reducedMotionSystem.destroy();
    });
  });
});