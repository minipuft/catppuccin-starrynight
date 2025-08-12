/**
 * RedEnergyBurstSystem Integration Tests
 * 
 * Tests the red energy burst system integration with ColorConsciousnessOrchestrator
 */

import { RedEnergyBurstSystem } from '@/visual/effects/HighEnergyEffectsController';
import { colorConsciousnessManager } from '@/visual/effects/ColorAnimationState';
import { HolographicUISystem } from '@/visual/music/ui/HolographicUISystem';
import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';
import { MusicSyncService } from '@/audio/MusicSyncService';
import type { MusicEmotion, BeatData } from '@/types/colorStubs';

// Mock dependencies
const mockHolographicSystem = {
  getHolographicState: jest.fn(() => ({
    flickerIntensity: 0.5,
    transparency: 0.8,
    chromatic: 0.3,
    scanlineIntensity: 0.6,
    dataStreamFlow: 0.5,
    interferenceLevel: 0.2,
    energyStability: 0.7,
    projectionDistance: 0.8
  }))
} as any;

const mockColorOrchestrator = {
  getConsciousnessState: jest.fn(() => ({
    activeLayerCount: 3,
    totalIntensity: 0.7,
    dominantEmotionalTemperature: 6000,
    consciousnessResonance: 0.8,
    catppuccinPreservationLevel: 0.8,
    holographicInfluence: 0.3,
    currentPalette: [],
    lastBlendTime: Date.now()
  }))
} as any;

const mockUnifiedCSSVariableManager = {
  queueCSSVariableUpdate: jest.fn(),
  flushBatch: jest.fn()
} as any;

const mockMusicSyncService = {
  getCurrentMusicState: jest.fn(() => ({
    emotion: { intensity: 0.8, arousal: 0.7, valence: 0.6, type: 'energetic' },
    beat: { strength: 0.9, tempo: 140 },
    intensity: 0.8
  }))
} as any;

describe('RedEnergyBurstSystem', () => {
  let redEnergySystem: RedEnergyBurstSystem;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create global event bus mock
    global.window = { addEventListener: jest.fn() } as any;
    global.document = { 
      createElement: jest.fn(() => ({ style: {} })),
      querySelectorAll: jest.fn(() => []),
      head: { appendChild: jest.fn() },
      body: { appendChild: jest.fn() }
    } as any;

    redEnergySystem = new RedEnergyBurstSystem(
      mockHolographicSystem,
      mockUnifiedCSSVariableManager,
      mockMusicSyncService
    );
  });

  describe('Initialization', () => {
    test('should initialize successfully', async () => {
      await redEnergySystem.initialize();
      
      expect(redEnergySystem.initialized).toBe(true);
    });

    test('should setup red energy CSS variables', async () => {
      await redEnergySystem.initialize();
      
      expect(mockUnifiedCSSVariableManager.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--cinematic-red-r',
        '255'
      );
      expect(mockUnifiedCSSVariableManager.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--cinematic-glow-intensity',
        '0'
      );
    });
  });

  describe('Energy Burst System', () => {
    beforeEach(async () => {
      await redEnergySystem.initialize();
    });

    test('should trigger energy burst on high intensity', () => {
      const highIntensityEmotion: MusicEmotion = {
        intensity: 0.9,
        arousal: 0.8,
        valence: 0.6,
        type: 'energetic',
        confidence: 0.9
      };

      const strongBeat: BeatData = {
        strength: 0.8,
        timing: Date.now(),
        confidence: 0.9,
        phase: 0.5
      };

      // Mock the triggerEnergyBurst method call
      const triggerSpy = jest.spyOn(redEnergySystem as any, 'triggerEnergyBurst');
      
      // Simulate music intensity spike event
      redEnergySystem['onMusicIntensitySpike']({
        intensity: highIntensityEmotion.intensity,
        beat: strongBeat
      });

      expect(triggerSpy).toHaveBeenCalledWith(
        highIntensityEmotion.intensity,
        strongBeat
      );
    });

    test('should not trigger energy burst on low intensity', () => {
      const lowIntensityEmotion: MusicEmotion = {
        intensity: 0.3,
        arousal: 0.2,
        valence: 0.5,
        type: 'ambient',
        confidence: 0.8
      };

      const weakBeat: BeatData = {
        strength: 0.2,
        timing: Date.now(),
        phase: 0,
        confidence: 0.6
      };

      const triggerSpy = jest.spyOn(redEnergySystem as any, 'triggerEnergyBurst');
      
      // Should not trigger due to low intensity
      redEnergySystem['onMusicIntensitySpike']({
        intensity: lowIntensityEmotion.intensity,
        beat: weakBeat
      });

      expect(triggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Color Integration', () => {
    beforeEach(async () => {
      await redEnergySystem.initialize();
    });

    test('should update holographic colors based on consciousness', () => {
      const palette = [
        { r: 255, g: 100, b: 100 },
        { r: 200, g: 150, b: 50 }
      ];

      redEnergySystem['onColorConsciousnessUpdate']({
        palette,
        consciousnessLevel: 0.8,
        emotionalTemperature: 3000
      });

      expect(mockUnifiedCSSVariableManager.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--cinematic-red-r',
        expect.any(String)
      );
    });

    test('should adjust energy temperature based on emotion', () => {
      const state = redEnergySystem.getEnergyBurstState();
      
      // Test cool temperature
      redEnergySystem['onColorConsciousnessUpdate']({
        palette: [],
        consciousnessLevel: 0.5,
        emotionalTemperature: 2000
      });

      expect(redEnergySystem.getEnergyBurstState().temperature).toBe(2200);

      // Test warm temperature
      redEnergySystem['onColorConsciousnessUpdate']({
        palette: [],
        consciousnessLevel: 0.5,
        emotionalTemperature: 7000
      });

      expect(redEnergySystem.getEnergyBurstState().temperature).toBe(2800);
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await redEnergySystem.initialize();
    });

    test('should track performance metrics', () => {
      redEnergySystem.updateAnimation(16.67); // 60fps frame time
      
      const metrics = redEnergySystem.getPerformanceMetrics();
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);
      expect(metrics.cpuUsage).toBeGreaterThanOrEqual(0);
    });

    test('should pass health check when performing well', async () => {
      const healthResult = await redEnergySystem.healthCheck();
      
      expect(healthResult.system).toBe('RedEnergyBurstSystem');
      expect(healthResult.healthy).toBe(true);
      expect(healthResult.metrics).toHaveProperty('energyBurstCount');
      expect(healthResult.metrics).toHaveProperty('processingTime');
    });
  });

  describe('Animation System', () => {
    beforeEach(async () => {
      await redEnergySystem.initialize();
    });

    test('should update animation phases over time', () => {
      const initialPhase = redEnergySystem['animationState'].energyPhase;
      
      redEnergySystem.updateAnimation(16.67);
      
      const updatedPhase = redEnergySystem['animationState'].energyPhase;
      expect(updatedPhase).toBeGreaterThan(initialPhase);
    });

    test('should update dramatic elements during animation', () => {
      const updateSpy = jest.spyOn(redEnergySystem as any, 'updateDramaticElements');
      
      redEnergySystem.updateAnimation(16.67);
      
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    test('should allow configuration updates', () => {
      redEnergySystem.setRedEnergyThreshold(0.8);
      
      const config = redEnergySystem.getCinematicConfig();
      expect(config.redEnergyThreshold).toBe(0.8);
    });

    test('should enable Blade Runner mode', () => {
      redEnergySystem.setBladeRunnerMode(true);
      
      const config = redEnergySystem.getCinematicConfig();
      expect(config.bladeRunnerMode).toBe(true);
    });
  });

  describe('Cleanup', () => {
    test('should destroy cleanly', async () => {
      await redEnergySystem.initialize();
      
      redEnergySystem.destroy();
      
      expect(redEnergySystem.initialized).toBe(false);
      expect(redEnergySystem.getEnergyBurstState().intensity).toBe(0);
    });
  });
});

// Integration test with ColorConsciousnessManager
describe('RedEnergyBurstSystem Integration', () => {
  test('should integrate with ColorConsciousnessManager', () => {
    const redEnergySystem = new RedEnergyBurstSystem(
      mockHolographicSystem,
      mockUnifiedCSSVariableManager,
      mockMusicSyncService
    );

    // Test initialization with consciousness manager
    expect(redEnergySystem).toBeDefined();
    
    // Verify consciousness manager is available
    expect(colorConsciousnessManager).toBeDefined();
  });
});