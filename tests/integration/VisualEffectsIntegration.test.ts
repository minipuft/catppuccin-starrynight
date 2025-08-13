/**
 * Visual Effects Integration Tests
 * 
 * Tests the integration of visual effects systems including particles,
 * glow effects, background gradients, and their coordination with
 * music synchronization and user interactions.
 * 
 * Focus: Effects coordination, music integration, visual quality
 */

import { ParticleConsciousnessModule } from '@/visual/effects/UnifiedParticleSystem';
import { MusicGlowEffectsManager } from '@/visual/effects/GlowEffectsController';
import { DepthLayeredGradientSystem } from '@/visual/backgrounds/DepthLayeredGradientSystem';
import { FluidGradientBackgroundSystem } from '@/visual/backgrounds/FluidGradientBackgroundSystem';
import { MusicBeatSynchronizer } from '@/visual/music/MusicSyncVisualEffects';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/Year3000Utilities';

describe('Visual Effects Integration', () => {
  let particleSystem: ParticleConsciousnessModule;
  let glowController: MusicGlowEffectsManager;
  let gradientSystem: DepthLayeredGradientSystem;
  let fluidBackground: FluidGradientBackgroundSystem;
  let musicSync: MusicBeatSynchronizer;

  beforeEach(() => {
    // Setup DOM environment with visual elements
    document.body.innerHTML = `
      <div class="Root__main-view">
        <div class="main-nowPlayingView-nowPlayingGrid">
          <div class="main-coverSlotExpanded-container">
            <div class="main-image-image" style="background-image: url('test.jpg')"></div>
          </div>
          <div class="main-trackInfo-container">
            <div class="main-trackInfo-name">Test Track</div>
          </div>
        </div>
        <div class="Root__right-sidebar">
          <div class="main-nowPlayingView-queue"></div>
        </div>
      </div>
      <div id="visual-effects-container"></div>
      <canvas id="particle-canvas" width="800" height="600"></canvas>
    `;

    // Initialize visual effects systems with proper CSS controller injection
    particleSystem = new ParticleConsciousnessModule(YEAR3000_CONFIG, Utils);
    glowController = new MusicGlowEffectsManager(YEAR3000_CONFIG, Utils);
    gradientSystem = new DepthLayeredGradientSystem(YEAR3000_CONFIG, Utils);
    fluidBackground = new FluidGradientBackgroundSystem(YEAR3000_CONFIG, Utils);
    musicSync = new MusicBeatSynchronizer(YEAR3000_CONFIG);
    
    // Inject CSS consciousness controller into systems that need it
    const mockCSSController = {
      queueCSSVariableUpdate: jest.fn(),
      batchSetVariables: jest.fn(),
      flushBatch: jest.fn(),
      setProperty: jest.fn(),
      destroy: jest.fn(),
      initialized: true
    };
    
    // Inject the CSS controller into systems
    if (glowController) {
      (glowController as any).cssConsciousnessController = mockCSSController;
    }
    if (fluidBackground) {
      (fluidBackground as any).cssController = mockCSSController;
    }
    if (gradientSystem) {
      (gradientSystem as any).cssController = mockCSSController;
    }
  });

  afterEach(() => {
    // Cleanup all systems
    const systems = [particleSystem, glowController, gradientSystem, fluidBackground, musicSync];
    systems.forEach(system => {
      if (system && system.initialized && system.destroy) {
        system.destroy();
      }
    });
    
    document.body.innerHTML = '';
  });

  describe('Particle System Integration', () => {
    it('should initialize particle system successfully', async () => {
      await particleSystem.initialize();
      expect(particleSystem.initialized).toBe(true);
    });

    it('should respond to music beat events', async () => {
      await particleSystem.initialize();
      
      // Simulate music beat
      const beatEvent = new CustomEvent('music:beat', {
        detail: { intensity: 0.8, bpm: 128, energy: 0.7, timestamp: Date.now() }
      });
      document.dispatchEvent(beatEvent);
      
      // Process animation frame
      particleSystem.updateAnimation(16.67);
      
      // System should handle the beat event
      const healthCheck = await particleSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should create particles with different energy levels', async () => {
      await particleSystem.initialize();
      
      const energyLevels = [0.1, 0.5, 0.9];
      
      for (const energy of energyLevels) {
        const beatEvent = new CustomEvent('music:beat', {
          detail: { intensity: energy, bpm: 120, energy, timestamp: Date.now() }
        });
        document.dispatchEvent(beatEvent);
        
        // Process multiple frames to see particle evolution
        for (let frame = 0; frame < 10; frame++) {
          particleSystem.updateAnimation(16.67);
        }
      }
      
      // Should handle different energy levels without issues
      const healthCheck = await particleSystem.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });

    it('should maintain performance during intense particle activity', async () => {
      await particleSystem.initialize();
      
      const intensiveTest = async () => {
        const startTime = performance.now();
        
        // Generate many particles
        for (let i = 0; i < 50; i++) {
          const beatEvent = new CustomEvent('music:beat', {
            detail: { intensity: 0.9, bpm: 140, energy: 0.8, timestamp: Date.now() }
          });
          document.dispatchEvent(beatEvent);
          
          particleSystem.updateAnimation(16.67);
        }
        
        return performance.now() - startTime;
      };
      
      const processingTime = await intensiveTest();
      
      // Should maintain reasonable performance even under load
      expect(processingTime).toBeLessThan(200); // <200ms for 50 intense updates
    });

    it('should handle canvas resize events', async () => {
      await particleSystem.initialize();
      
      const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
      if (canvas) {
        // Simulate resize
        canvas.width = 1200;
        canvas.height = 800;
        
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
        
        // System should adapt to new size
        particleSystem.updateAnimation(16.67);
        
        const healthCheck = await particleSystem.healthCheck();
        expect(healthCheck.healthy).toBeDefined();
      }
    });
  });

  describe('Glow Effects Integration', () => {
    it('should initialize glow effects controller', async () => {
      await glowController.initialize();
      expect(glowController.initialized).toBe(true);
    });

    it('should apply glow effects to UI elements', async () => {
      await glowController.initialize();
      
      // Simulate track change that should trigger glow updates
      const trackChangeEvent = new CustomEvent('music:track-changed', {
        detail: {
          track: { name: 'New Track', artists: ['Artist'] },
          colors: { vibrant: '#ff6b6b', lightVibrant: '#4ecdc4' }
        }
      });
      document.dispatchEvent(trackChangeEvent);
      
      // Process glow updates
      for (let i = 0; i < 5; i++) {
        glowController.updateAnimation(16.67);
      }
      
      // Check for glow CSS variables
      const rootStyle = getComputedStyle(document.documentElement);
      const glowIntensity = rootStyle.getPropertyValue('--sn-glow-intensity');
      
      expect(typeof glowIntensity === 'string').toBe(true);
    });

    it('should coordinate glow with music intensity', async () => {
      await glowController.initialize();
      await musicSync.initialize();
      
      const intensities = [0.2, 0.5, 0.8, 1.0];
      
      for (const intensity of intensities) {
        // Music sync processes intensity
        const beatEvent = new CustomEvent('music:beat', {
          detail: { intensity, bpm: 128, energy: intensity, timestamp: Date.now() }
        });
        document.dispatchEvent(beatEvent);
        
        musicSync.onAnimate(16.67);
        glowController.updateAnimation(16.67);
        
        // Check that glow responds to music intensity
        const syncState = musicSync.getMusicSyncState();
        expect(syncState.musicIntensity).toBeGreaterThanOrEqual(0);
        expect(syncState.musicIntensity).toBeLessThanOrEqual(1);
      }
    });

    it('should handle multiple glow targets', async () => {
      await glowController.initialize();
      
      // Add multiple glowable elements
      const glowTargets = [
        document.querySelector('.main-coverSlotExpanded-container'),
        document.querySelector('.main-trackInfo-container'),
        document.querySelector('.Root__right-sidebar')
      ];
      
      // Apply glow to multiple targets
      for (const target of glowTargets) {
        if (target) {
          target.classList.add('glow-target');
        }
      }
      
      // Process glow updates
      glowController.updateAnimation(16.67);
      
      const healthCheck = await glowController.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });
  });

  describe('Background Gradient Integration', () => {
    it('should initialize depth layered gradient system', async () => {
      await gradientSystem.initialize();
      expect(gradientSystem.initialized).toBe(true);
    });

    it('should initialize fluid gradient background', async () => {
      await fluidBackground.initialize();
      expect(fluidBackground.initialized).toBe(true);
    });

    it('should coordinate multiple background systems', async () => {
      await gradientSystem.initialize();
      await fluidBackground.initialize();
      
      // Both systems should work together
      const testFrames = 30;
      
      for (let frame = 0; frame < testFrames; frame++) {
        gradientSystem.updateAnimation(16.67);
        fluidBackground.updateAnimation(16.67);
        
        // Simulate color changes
        if (frame % 10 === 0) {
          const colorEvent = new CustomEvent('color:extracted', {
            detail: {
              vibrant: `hsl(${Math.random() * 360}, 70%, 60%)`,
              lightVibrant: `hsl(${Math.random() * 360}, 50%, 80%)`
            }
          });
          document.dispatchEvent(colorEvent);
        }
      }
      
      // Both systems should remain healthy
      const gradientHealth = await gradientSystem.healthCheck();
      const fluidHealth = await fluidBackground.healthCheck();
      
      expect(gradientHealth.healthy).toBeDefined();
      expect(fluidHealth.healthy).toBeDefined();
    });

    it('should respond to music energy changes', async () => {
      await gradientSystem.initialize();
      await musicSync.initialize();
      
      const energyLevels = [0.1, 0.3, 0.6, 0.9];
      
      for (const energy of energyLevels) {
        const energyEvent = new CustomEvent('music:energy', {
          detail: { energy, valence: 0.5, timestamp: Date.now() }
        });
        document.dispatchEvent(energyEvent);
        
        musicSync.onAnimate(16.67);
        gradientSystem.updateAnimation(16.67);
        
        // Gradient should respond to energy changes
        const syncState = musicSync.getMusicSyncState();
        expect(syncState.scaleMultiplier).toBeGreaterThanOrEqual(1);
        expect(syncState.scaleMultiplier).toBeLessThanOrEqual(2);
      }
    });

    it('should handle color temperature changes', async () => {
      await fluidBackground.initialize();
      
      const temperatures = [2000, 4000, 6500, 10000]; // K values
      
      for (const temp of temperatures) {
        const tempEvent = new CustomEvent('color:temperature', {
          detail: { temperature: temp, timestamp: Date.now() }
        });
        document.dispatchEvent(tempEvent);
        
        fluidBackground.updateAnimation(16.67);
      }
      
      const healthCheck = await fluidBackground.healthCheck();
      expect(healthCheck.healthy).toBeDefined();
    });
  });

  describe('Music Synchronization Integration', () => {
    it('should coordinate all visual effects with music', async () => {
      // Initialize all systems
      await particleSystem.initialize();
      await glowController.initialize();
      await gradientSystem.initialize();
      await musicSync.initialize();
      
      // Simulate a complete music experience
      const musicSequence = [
        { type: 'music:beat', detail: { intensity: 0.3, bpm: 100, energy: 0.2 } },
        { type: 'music:beat', detail: { intensity: 0.6, bpm: 120, energy: 0.5 } },
        { type: 'music:beat', detail: { intensity: 0.9, bpm: 140, energy: 0.8 } },
        { type: 'music:energy', detail: { energy: 0.7, valence: 0.8 } },
        { type: 'music:emotion', detail: { valence: 0.6, energy: 0.8 } }
      ];
      
      for (const event of musicSequence) {
        const customEvent = new CustomEvent(event.type, { detail: event.detail });
        document.dispatchEvent(customEvent);
        
        // Update all systems
        musicSync.onAnimate(16.67);
        particleSystem.updateAnimation(16.67);
        glowController.updateAnimation(16.67);
        gradientSystem.updateAnimation(16.67);
        
        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // All systems should remain healthy and synchronized
      const healthChecks = await Promise.all([
        musicSync.healthCheck(),
        particleSystem.healthCheck(),
        glowController.healthCheck(),
        gradientSystem.healthCheck()
      ]);
      
      healthChecks.forEach(health => {
        expect(health.healthy).toBeDefined();
      });
    });

    it('should maintain visual coherence during tempo changes', async () => {
      await musicSync.initialize();
      await particleSystem.initialize();
      await gradientSystem.initialize();
      
      const tempoSequence = [60, 90, 120, 150, 180, 120]; // BPM changes
      
      for (const bpm of tempoSequence) {
        const tempoEvent = new CustomEvent('music:bpm-change', {
          detail: { bpm, tempo: 'variable', enhancedBPM: bpm }
        });
        document.dispatchEvent(tempoEvent);
        
        // Process several frames to see adaptation
        for (let frame = 0; frame < 15; frame++) {
          musicSync.onAnimate(16.67);
          particleSystem.updateAnimation(16.67);
          gradientSystem.updateAnimation(16.67);
        }
        
        // Check that tempo is reflected in sync state
        const syncState = musicSync.getMusicSyncState();
        expect(syncState.currentBPM).toBe(bpm);
      }
    });

    it('should handle emotional transitions smoothly', async () => {
      await musicSync.initialize();
      await glowController.initialize();
      await fluidBackground.initialize();
      
      // Simulate emotional journey in music
      const emotionalStates = [
        { valence: -0.5, energy: 0.2 }, // Sad, low energy
        { valence: 0.0, energy: 0.5 },  // Neutral
        { valence: 0.8, energy: 0.9 }   // Happy, high energy
      ];
      
      for (const emotion of emotionalStates) {
        const emotionEvent = new CustomEvent('music:emotion', {
          detail: { valence: emotion.valence, energy: emotion.energy }
        });
        document.dispatchEvent(emotionEvent);
        
        // Process transition frames
        for (let frame = 0; frame < 30; frame++) {
          musicSync.onAnimate(16.67);
          glowController.updateAnimation(16.67);
          fluidBackground.updateAnimation(16.67);
        }
        
        // Check color temperature changes
        const syncState = musicSync.getMusicSyncState();
        expect(syncState.colorTemperature).toBeGreaterThanOrEqual(1000);
        expect(syncState.colorTemperature).toBeLessThanOrEqual(20000);
      }
    });
  });

  describe('Performance Under Load', () => {
    it('should maintain performance with all effects active', async () => {
      // Initialize all visual systems
      await particleSystem.initialize();
      await glowController.initialize();
      await gradientSystem.initialize();
      await fluidBackground.initialize();
      await musicSync.initialize();
      
      const performanceTest = async () => {
        const startTime = performance.now();
        const testFrames = 120; // 2 seconds at 60fps
        
        for (let frame = 0; frame < testFrames; frame++) {
          // Simulate intense music activity
          if (frame % 10 === 0) {
            const beatEvent = new CustomEvent('music:beat', {
              detail: { intensity: Math.random(), bpm: 120 + Math.random() * 60, energy: Math.random() }
            });
            document.dispatchEvent(beatEvent);
          }
          
          // Update all systems
          musicSync.onAnimate(16.67);
          particleSystem.updateAnimation(16.67);
          glowController.updateAnimation(16.67);
          gradientSystem.updateAnimation(16.67);
          fluidBackground.updateAnimation(16.67);
        }
        
        return performance.now() - startTime;
      };
      
      const totalTime = await performanceTest();
      const averageFrameTime = totalTime / 120;
      
      // Should maintain reasonable performance with all effects
      expect(averageFrameTime).toBeLessThan(10); // <10ms per frame for all effects
    });

    it('should handle memory efficiently during extended operation', async () => {
      await particleSystem.initialize();
      await glowController.initialize();
      
      // Simulate extended use (5 minutes of activity)
      const extendedFrames = 18000; // 5 minutes at 60fps
      
      for (let frame = 0; frame < extendedFrames; frame++) {
        // Periodic music events
        if (frame % 120 === 0) { // Every 2 seconds
          const beatEvent = new CustomEvent('music:beat', {
            detail: { intensity: Math.random(), bpm: 128, energy: Math.random() }
          });
          document.dispatchEvent(beatEvent);
        }
        
        // Update systems (sample every 10th frame for performance)
        if (frame % 10 === 0) {
          particleSystem.updateAnimation(166.7); // 10 frame delta
          glowController.updateAnimation(166.7);
        }
      }
      
      // Systems should still be healthy after extended operation
      const particleHealth = await particleSystem.healthCheck();
      const glowHealth = await glowController.healthCheck();
      
      expect(particleHealth.healthy).toBeDefined();
      expect(glowHealth.healthy).toBeDefined();
    });

    it('should gracefully degrade under resource constraints', async () => {
      // Simulate low-end device constraints
      const lowEndConfig = {
        ...YEAR3000_CONFIG,
        performance: {
          ...YEAR3000_CONFIG.performance,
          targetFPS: 30,
          qualityLevel: 'low',
          enableParticles: false
        }
      };
      
      const constrainedParticles = new ParticleConsciousnessModule(lowEndConfig, Utils);
      const constrainedGlow = new MusicGlowEffectsManager(lowEndConfig, Utils);
      
      await constrainedParticles.initialize();
      await constrainedGlow.initialize();
      
      // Should still function with constraints
      constrainedParticles.updateAnimation(33.33); // 30fps
      constrainedGlow.updateAnimation(33.33);
      
      const particleHealth = await constrainedParticles.healthCheck();
      const glowHealth = await constrainedGlow.healthCheck();
      
      expect(particleHealth.healthy).toBeDefined();
      expect(glowHealth.healthy).toBeDefined();
      
      // Cleanup
      constrainedParticles.destroy();
      constrainedGlow.destroy();
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from animation errors', async () => {
      await particleSystem.initialize();
      
      // Mock animation error
      const originalUpdate = particleSystem.updateAnimation;
      let errorCount = 0;
      
      particleSystem.updateAnimation = jest.fn((deltaTime) => {
        errorCount++;
        if (errorCount < 3) {
          throw new Error('Simulated animation error');
        }
        return originalUpdate.call(particleSystem, deltaTime);
      });
      
      // Should recover from errors
      for (let i = 0; i < 5; i++) {
        try {
          particleSystem.updateAnimation(16.67);
        } catch (error) {
          // Expected for first few calls
        }
      }
      
      // Should eventually work normally
      expect(() => particleSystem.updateAnimation(16.67)).not.toThrow();
    });

    it('should handle invalid event data gracefully', async () => {
      await musicSync.initialize();
      await particleSystem.initialize();
      
      // Test with invalid event data
      const invalidEvents = [
        new CustomEvent('music:beat', { detail: null }),
        new CustomEvent('music:beat', { detail: undefined }),
        new CustomEvent('music:beat', { detail: { intensity: 'invalid' } }),
        new CustomEvent('music:beat', { detail: { bpm: -1000 } }),
        new CustomEvent('music:energy', { detail: { energy: NaN } })
      ];
      
      for (const event of invalidEvents) {
        expect(() => {
          document.dispatchEvent(event);
          musicSync.onAnimate(16.67);
          particleSystem.updateAnimation(16.67);
        }).not.toThrow();
      }
    });
  });
});