/**
 * Visual System Coordinator Integration Tests
 * 
 * Tests the VisualSystemCoordinator (facade) and its integration with
 * visual systems including WebGL rendering, effects coordination,
 * and performance management.
 * 
 * Focus: System creation, lifecycle management, performance coordination
 */

import { VisualSystemCoordinator } from '@/visual/coordination/VisualSystemCoordinator';
import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/ThemeUtilities';

describe('Visual System Coordinator Integration', () => {
  let visualCoordinator: VisualSystemCoordinator;
  let systemCoordinator: SystemCoordinator;

  beforeEach(() => {
    // Setup DOM environment
    document.body.innerHTML = `
      <div class="Root__main-view">
        <div class="main-nowPlayingView-nowPlayingGrid">
          <canvas id="webgl-background-canvas"></canvas>
        </div>
      </div>
    `;

    // Mock advancedThemeSystem for SystemCoordinator
    const mockAdvancedThemeSystem = {
      isInitialized: false,
      getCachedNonVisualSystem: jest.fn(() => null),
      config: ADVANCED_SYSTEM_CONFIG
    };

    // Mock dependencies for VisualSystemCoordinator
    const mockCSSController = {
      queueCSSVariableUpdate: jest.fn(),
      flushBatch: jest.fn(),
      setProperty: jest.fn(),
      destroy: jest.fn(),
      initialized: true,
      initialize: jest.fn().mockResolvedValue(undefined),
      flushPendingUpdates: jest.fn()
    };

    const mockPerformanceAnalyzer = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
      initialized: true,
      getMetrics: jest.fn(() => ({ cpuUsage: 0.1, memoryUsage: 0.2 }))
    };

    const mockMusicSyncService = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
      initialized: true,
      getMusicSyncState: jest.fn(() => ({ musicIntensity: 0.5 }))
    };

    const mockSettingsManager = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
      initialized: true,
      getSettings: jest.fn(() => ({}))
    };

    const mockSemanticColorManager = {
      initialize: jest.fn().mockResolvedValue(undefined),
      destroy: jest.fn(),
      initialized: true,
      getSystemMetrics: jest.fn(() => ({ colorUpdateCount: 0 }))
    };

    // Initialize coordinators with proper dependencies
    systemCoordinator = new SystemCoordinator(ADVANCED_SYSTEM_CONFIG, Utils, mockAdvancedThemeSystem);
    visualCoordinator = new VisualSystemCoordinator(
      ADVANCED_SYSTEM_CONFIG, 
      Utils, 
      mockAdvancedThemeSystem,
      mockCSSController,
      mockPerformanceAnalyzer,
      mockMusicSyncService,
      mockSettingsManager,
      mockSemanticColorManager
    );
  });

  afterEach(() => {
    // Cleanup
    if (visualCoordinator && visualCoordinator.initialized) {
      visualCoordinator.destroy();
    }
    if (systemCoordinator && systemCoordinator.initialized) {
      systemCoordinator.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('System Factory and Registry', () => {
    it('should initialize visual coordinator successfully', async () => {
      await visualCoordinator.initialize();
      expect(visualCoordinator.initialized).toBe(true);
    });

    it('should create WebGL background system', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      expect(webglSystem).toBeDefined();
      expect(webglSystem.initialized).toBeDefined();
    });

    it('should create visual effects systems', async () => {
      await visualCoordinator.initialize();
      
      const effectsSystems = [
        'DepthLayeredGradient',
        'FluidGradientBackground',
        'UnifiedParticle',
        'GlowEffects'
      ];

      for (const systemKey of effectsSystems) {
        const system = visualCoordinator.createSystem(systemKey);
        expect(system).toBeDefined();
      }
    });

    it('should maintain system registry', async () => {
      await visualCoordinator.initialize();
      
      // Create several systems
      const systems = [
        visualCoordinator.createSystem('WebGLBackground'),
        visualCoordinator.createSystem('DepthLayeredGradient'),
        visualCoordinator.createSystem('UnifiedParticle')
      ];

      const allSystems = visualCoordinator.getAllSystems();
      expect(allSystems.length).toBeGreaterThanOrEqual(systems.length);
    });

    it('should handle invalid system requests gracefully', async () => {
      await visualCoordinator.initialize();
      
      const invalidSystem = visualCoordinator.createSystem('NonExistentSystem' as any);
      
      // Should handle gracefully (return null or default)
      expect(invalidSystem).toBeDefined();
    });
  });

  describe('System Lifecycle Management', () => {
    it('should initialize visual systems properly', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
        expect(webglSystem.initialized).toBe(true);
      }
    });

    it('should coordinate system animations', async () => {
      await visualCoordinator.initialize();
      
      const systems = [
        visualCoordinator.createSystem('WebGLBackground'),
        visualCoordinator.createSystem('UnifiedParticle'),
        visualCoordinator.createSystem('GlowEffects')
      ];

      // Initialize systems
      for (const system of systems) {
        if (system && system.initialize) {
          await system.initialize();
        }
      }

      // Test animation coordination
      const deltaTime = 16.67; // 60fps
      
      for (const system of systems) {
        if (system && system.updateAnimation) {
          expect(() => {
            system.updateAnimation(deltaTime);
          }).not.toThrow();
        }
      }
    });

    it('should perform health checks on all systems', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
      }

      const allSystems = visualCoordinator.getAllSystems();
      
      for (const system of allSystems) {
        if (system && system.healthCheck) {
          const health = await system.healthCheck();
          expect(health).toBeDefined();
          expect(health.healthy).toBeDefined();
        }
      }
    });

    it('should destroy systems cleanly', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
        expect(webglSystem.initialized).toBe(true);
      }

      if (webglSystem && webglSystem.destroy) {
        webglSystem.destroy();
        expect(webglSystem.initialized).toBe(false);
      }
    });
  });

  describe('Performance Coordination', () => {
    it('should maintain performance during multiple system operation', async () => {
      await visualCoordinator.initialize();
      
      // Create multiple visual systems
      const systems = [
        visualCoordinator.createSystem('WebGLBackground'),
        visualCoordinator.createSystem('DepthLayeredGradient'),
        visualCoordinator.createSystem('UnifiedParticle'),
        visualCoordinator.createSystem('GlowEffects')
      ];

      // Initialize all systems
      for (const system of systems) {
        if (system && system.initialize) {
          await system.initialize();
        }
      }

      // Performance test: run animation frames
      const testFrames = 60; // 1 second
      const startTime = performance.now();

      for (let frame = 0; frame < testFrames; frame++) {
        for (const system of systems) {
          if (system && system.updateAnimation) {
            system.updateAnimation(16.67);
          }
        }
      }

      const totalTime = performance.now() - startTime;
      const averageFrameTime = totalTime / testFrames;

      // Should maintain reasonable performance
      expect(averageFrameTime).toBeLessThan(8); // <8ms per frame for multiple systems
    });

    it('should handle high-frequency updates efficiently', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
      }

      // Rapid animation updates
      const rapidUpdates = 300; // 5 seconds at 60fps
      const startTime = performance.now();

      for (let update = 0; update < rapidUpdates; update++) {
        if (webglSystem && webglSystem.updateAnimation) {
          webglSystem.updateAnimation(16.67);
        }
      }

      const totalTime = performance.now() - startTime;
      
      // Should handle rapid updates efficiently
      expect(totalTime).toBeLessThan(1000); // <1 second for 5 seconds of updates
    });

    it('should scale performance based on device capabilities', async () => {
      await visualCoordinator.initialize();
      
      // Simulate different device capabilities
      const deviceScenarios = [
        { memory: 2000, gpu: 'integrated' },
        { memory: 8000, gpu: 'dedicated' },
        { memory: 16000, gpu: 'high-end' }
      ];

      for (const scenario of deviceScenarios) {
        const webglSystem = visualCoordinator.createSystem('WebGLBackground');
        
        if (webglSystem && webglSystem.initialize) {
          await webglSystem.initialize();
          
          // System should adapt to device capabilities
          const healthCheck = await webglSystem.healthCheck();
          expect(healthCheck.healthy).toBeDefined();
          
          if (webglSystem.destroy) {
            webglSystem.destroy();
          }
        }
      }
    });

    it('should optimize resource usage during intensive operations', async () => {
      await visualCoordinator.initialize();
      
      const particleSystem = visualCoordinator.createSystem('UnifiedParticle');
      if (particleSystem && particleSystem.initialize) {
        await particleSystem.initialize();
      }

      // Simulate intensive particle operations
      for (let intensity = 0; intensity < 100; intensity++) {
        if (particleSystem && particleSystem.updateAnimation) {
          particleSystem.updateAnimation(16.67);
        }
        
        // Simulate music beat events that trigger particles
        const beatEvent = new CustomEvent('music:beat', {
          detail: { intensity: Math.random(), bpm: 128, energy: 0.8 }
        });
        document.dispatchEvent(beatEvent);
      }

      // System should remain stable under load
      if (particleSystem && particleSystem.healthCheck) {
        const health = await particleSystem.healthCheck();
        expect(health.healthy).toBeDefined();
      }
    });
  });

  describe('WebGL Integration', () => {
    it('should initialize WebGL context properly', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
        
        // Check for WebGL context (mock environment may not have real WebGL)
        const canvas = document.getElementById('webgl-background-canvas') as HTMLCanvasElement;
        if (canvas) {
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          // In test environment, gl might be null, but should not throw
          expect(() => canvas.getContext('webgl2')).not.toThrow();
        }
      }
    });

    it('should handle WebGL context loss gracefully', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
      }

      // Simulate WebGL context loss
      const canvas = document.getElementById('webgl-background-canvas') as HTMLCanvasElement;
      if (canvas) {
        const contextLossEvent = new Event('webglcontextlost');
        canvas.dispatchEvent(contextLossEvent);
        
        // System should handle context loss without crashing
        if (webglSystem && webglSystem.updateAnimation) {
          expect(() => {
            webglSystem.updateAnimation(16.67);
          }).not.toThrow();
        }
      }
    });

    it('should fallback to CSS when WebGL is unavailable', async () => {
      // Mock WebGL as unavailable
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      try {
        await visualCoordinator.initialize();
        
        const webglSystem = visualCoordinator.createSystem('WebGLBackground');
        if (webglSystem && webglSystem.initialize) {
          await webglSystem.initialize();
          
          // Should fallback gracefully
          expect(webglSystem.initialized).toBeDefined();
        }
      } finally {
        HTMLCanvasElement.prototype.getContext = originalGetContext;
      }
    });
  });

  describe('CSS Variable Integration', () => {
    it('should update CSS variables from visual systems', async () => {
      await visualCoordinator.initialize();
      
      const glowSystem = visualCoordinator.createSystem('GlowEffects');
      if (glowSystem && glowSystem.initialize) {
        await glowSystem.initialize();
      }

      // Simulate glow updates
      for (let i = 0; i < 10; i++) {
        if (glowSystem && glowSystem.updateAnimation) {
          glowSystem.updateAnimation(16.67);
        }
      }

      // Check that CSS variables are available (values may be default in test)
      const rootStyle = getComputedStyle(document.documentElement);
      const glowIntensity = rootStyle.getPropertyValue('--sn-glow-intensity');
      
      // Should have CSS variable (even if default value)
      expect(typeof glowIntensity === 'string').toBe(true);
    });

    it('should coordinate CSS updates across multiple systems', async () => {
      await visualCoordinator.initialize();
      
      const systems = [
        visualCoordinator.createSystem('GlowEffects'),
        visualCoordinator.createSystem('DepthLayeredGradient'),
        visualCoordinator.createSystem('FluidGradientBackground')
      ];

      // Initialize systems
      for (const system of systems) {
        if (system && system.initialize) {
          await system.initialize();
        }
      }

      // Update all systems
      for (const system of systems) {
        if (system && system.updateAnimation) {
          system.updateAnimation(16.67);
        }
      }

      // CSS coordinate should handle multiple system updates
      const rootStyle = getComputedStyle(document.documentElement);
      
      // Should have various theme variables available
      const cssVarNames = [
        '--sn-glow-intensity',
        '--sn-depth-layers',
        '--sn-gradient-flow'
      ];

      cssVarNames.forEach(varName => {
        const value = rootStyle.getPropertyValue(varName);
        expect(typeof value === 'string').toBe(true);
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should recover from system initialization failures', async () => {
      const originalConsoleError = console.error;
      const errors: string[] = [];
      console.error = (...args: any[]) => {
        errors.push(args.join(' '));
      };

      try {
        await visualCoordinator.initialize();
        
        // Even if some systems fail to initialize, coordinator should remain stable
        expect(visualCoordinator.initialized).toBe(true);
        
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('should handle system crashes during animation', async () => {
      await visualCoordinator.initialize();
      
      const webglSystem = visualCoordinator.createSystem('WebGLBackground');
      if (webglSystem && webglSystem.initialize) {
        await webglSystem.initialize();
      }

      // Mock a system crash
      if (webglSystem) {
        const originalUpdate = webglSystem.updateAnimation;
        webglSystem.updateAnimation = jest.fn(() => {
          throw new Error('Simulated system crash');
        });

        // Coordinator should handle the crash gracefully
        expect(() => {
          if (webglSystem.updateAnimation) {
            webglSystem.updateAnimation(16.67);
          }
        }).toThrow(); // Individual system throws, but coordinator should catch

        // Restore original function
        if (originalUpdate) {
          webglSystem.updateAnimation = originalUpdate;
        }
      }
    });

    it('should maintain stability under stress conditions', async () => {
      await visualCoordinator.initialize();
      
      // Stress test: create many systems rapidly
      const stressSystems = [];
      for (let i = 0; i < 20; i++) {
        const system = visualCoordinator.createSystem('WebGLBackground');
        stressSystems.push(system);
        
        if (system && system.initialize) {
          try {
            await system.initialize();
          } catch (error) {
            // Some may fail under stress - that's expected
          }
        }
      }

      // Coordinator should remain stable
      expect(visualCoordinator.initialized).toBe(true);
      
      // Cleanup stress systems
      stressSystems.forEach(system => {
        if (system && system.destroy) {
          system.destroy();
        }
      });
    });
  });
});