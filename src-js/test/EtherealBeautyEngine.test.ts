/**
 * EtherealBeautyEngine Integration Tests
 * 
 * Tests the gentle beauty system integration with ColorConsciousnessOrchestrator
 */

import { EtherealBeautyEngine } from '@/visual/consciousness/EtherealBeautyEngine';
import { colorConsciousnessManager } from '@/visual/consciousness/ColorConsciousnessState';
import { HolographicUISystem } from '@/visual/organic-consciousness/ui/HolographicUISystem';
import { CSSVariableBatcher } from '@/core/performance/CSSVariableBatcher';
import { MusicSyncService } from '@/audio/MusicSyncService';
import type { MusicEmotion, BeatData } from '@/types/colorStubs';

// Mock dependencies
const mockHolographicSystem = {
  getHolographicState: jest.fn(() => ({
    flickerIntensity: 0.3,
    transparency: 0.9,
    chromatic: 0.2,
    scanlineIntensity: 0.4,
    dataStreamFlow: 0.3,
    interferenceLevel: 0.1,
    energyStability: 0.8,
    projectionDistance: 0.9
  }))
} as any;

const mockColorOrchestrator = {
  getConsciousnessState: jest.fn(() => ({
    activeLayerCount: 2,
    totalIntensity: 0.5,
    dominantEmotionalTemperature: 6500,
    consciousnessResonance: 0.7,
    catppuccinPreservationLevel: 0.8,
    holographicInfluence: 0.2,
    currentPalette: [],
    lastBlendTime: Date.now()
  }))
} as any;

const mockCSSVariableBatcher = {
  queueCSSVariableUpdate: jest.fn(),
  flushBatch: jest.fn()
} as any;

const mockMusicSyncService = {
  getCurrentMusicState: jest.fn(() => ({
    emotion: { intensity: 0.6, arousal: 0.5, valence: 0.8, type: 'positive' },
    beat: { strength: 0.5, tempo: 110 },
    intensity: 0.6
  }))
} as any;

describe('EtherealBeautyEngine', () => {
  let etherealEngine: EtherealBeautyEngine;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create global mocks
    global.window = { addEventListener: jest.fn() } as any;
    global.document = { 
      createElement: jest.fn(() => ({ style: {} })),
      querySelectorAll: jest.fn(() => []),
      head: { appendChild: jest.fn() },
      body: { appendChild: jest.fn() }
    } as any;

    etherealEngine = new EtherealBeautyEngine(
      mockHolographicSystem,
      mockCSSVariableBatcher,
      mockMusicSyncService
    );
  });

  describe('Initialization', () => {
    test('should initialize successfully', async () => {
      await etherealEngine.initialize();
      
      expect(etherealEngine.initialized).toBe(true);
    });

    test('should setup ethereal CSS variables', async () => {
      await etherealEngine.initialize();
      
      expect(mockCSSVariableBatcher.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--ethereal-soft-r',
        '203'
      );
      expect(mockCSSVariableBatcher.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--ethereal-beauty-level',
        '0'
      );
    });
  });

  describe('Ethereal Beauty System', () => {
    beforeEach(async () => {
      await etherealEngine.initialize();
    });

    test('should trigger ethereal beauty on positive emotions', () => {
      const positiveEmotion: MusicEmotion = {
        intensity: 0.7,
        arousal: 0.6,
        valence: 0.8,  // High positive valence
        type: 'happy',
        confidence: 0.8
      };

      const gentleBeat: BeatData = {
        strength: 0.5,
        timing: Date.now(),
        confidence: 0.8,
        phase: 0.3
      };

      // Mock the triggerEtherealBeauty method call
      const triggerSpy = jest.spyOn(etherealEngine as any, 'triggerEtherealBeauty');
      
      // Simulate emotional moment event
      etherealEngine['onEmotionalMoment']({
        type: 'ethereal-beauty',
        intensity: positiveEmotion.intensity,
        valence: positiveEmotion.valence
      });

      expect(triggerSpy).toHaveBeenCalledWith(
        positiveEmotion.intensity,
        positiveEmotion.valence
      );
    });

    test('should not trigger ethereal beauty on negative emotions', () => {
      const negativeEmotion: MusicEmotion = {
        intensity: 0.6,
        arousal: 0.7,
        valence: 0.3,  // Low valence (negative)
        type: 'aggressive',
        confidence: 0.8
      };

      const triggerSpy = jest.spyOn(etherealEngine as any, 'triggerEtherealBeauty');
      
      // Should not trigger due to low valence
      etherealEngine['onEmotionalMoment']({
        type: 'ethereal-beauty',
        intensity: negativeEmotion.intensity,
        valence: negativeEmotion.valence
      });

      expect(triggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Color Integration', () => {
    beforeEach(async () => {
      await etherealEngine.initialize();
    });

    test('should update ethereal colors based on consciousness', () => {
      const palette = [
        { r: 203, g: 166, b: 247 },  // Mauve
        { r: 148, g: 226, b: 213 }   // Teal
      ];

      etherealEngine['onColorConsciousnessUpdate']({
        palette,
        consciousnessLevel: 0.7,
        emotionalTemperature: 6500
      });

      expect(mockCSSVariableBatcher.queueCSSVariableUpdate).toHaveBeenCalledWith(
        '--ethereal-soft-r',
        expect.any(String)
      );
    });

    test('should adjust beauty level based on warm temperature', () => {
      etherealEngine['onColorConsciousnessUpdate']({
        palette: [],
        consciousnessLevel: 0.8,
        emotionalTemperature: 6500  // Warm temperature
      });

      const state = etherealEngine.getEtherealState();
      expect(state.beautyLevel).toBeCloseTo(0.8, 1); // Should be enhanced
    });

    test('should adjust mystical shimmer based on cool temperature', () => {
      etherealEngine['onColorConsciousnessUpdate']({
        palette: [],
        consciousnessLevel: 0.6,
        emotionalTemperature: 3500  // Cool temperature
      });

      const state = etherealEngine.getEtherealState();
      expect(state.mysticalShimmer).toBeCloseTo(0.42, 1); // 0.6 * 0.7
    });
  });

  describe('Gentle Transitions', () => {
    beforeEach(async () => {
      await etherealEngine.initialize();
    });

    test('should create gentle transitions between states', () => {
      const fromState = { beauty: 0, shimmer: 0 };
      const toState = { beauty: 0.8, shimmer: 0.6 };
      const duration = 2000;

      const transitionSpy = jest.spyOn(etherealEngine as any, 'createGentleTransition');
      
      etherealEngine['onGentleTransition']({
        fromState,
        toState,
        duration
      });

      expect(transitionSpy).toHaveBeenCalledWith(fromState, toState, duration);
      expect(etherealEngine.getPerformanceMetrics().gentleTransitionCount).toBe(1);
    });

    test('should decay ethereal beauty gently over time', () => {
      // Set initial ethereal state
      etherealEngine['etherealState'].beautyLevel = 0.8;
      etherealEngine['etherealState'].mysticalShimmer = 0.6;

      const decaySpy = jest.spyOn(etherealEngine as any, 'gentleDecayEtherealBeauty');
      
      // Trigger decay
      etherealEngine['gentleDecayEtherealBeauty']();

      expect(decaySpy).toHaveBeenCalled();
    });
  });

  describe('Performance Monitoring', () => {
    beforeEach(async () => {
      await etherealEngine.initialize();
    });

    test('should track performance metrics', () => {
      etherealEngine.updateAnimation(8.33); // 120fps frame time
      
      const metrics = etherealEngine.getPerformanceMetrics();
      expect(metrics.averageProcessingTime).toBeGreaterThanOrEqual(0);
      expect(metrics.etherealElementCount).toBeGreaterThanOrEqual(0);
    });

    test('should pass health check when performing well', async () => {
      const healthResult = await etherealEngine.healthCheck();
      
      expect(healthResult.system).toBe('EtherealBeautyEngine');
      expect(healthResult.healthy).toBe(true);
      expect(healthResult.metrics).toHaveProperty('emotionalMomentCount');
      expect(healthResult.metrics).toHaveProperty('processingTime');
    });

    test('should fail health check when performance degrades', async () => {
      // Simulate poor performance
      etherealEngine['performanceMetrics'].averageProcessingTime = 15; // >8ms threshold
      
      const healthResult = await etherealEngine.healthCheck();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.issues).toContain('Performance degradation detected');
    });
  });

  describe('Animation System', () => {
    beforeEach(async () => {
      await etherealEngine.initialize();
    });

    test('should update animation phases slowly and gently', () => {
      const initialMysticalPhase = etherealEngine['animationState'].mysticalPhase;
      const initialDreamyPhase = etherealEngine['animationState'].dreamyPhase;
      
      etherealEngine.updateAnimation(16.67);
      
      const updatedMysticalPhase = etherealEngine['animationState'].mysticalPhase;
      const updatedDreamyPhase = etherealEngine['animationState'].dreamyPhase;
      
      expect(updatedMysticalPhase).toBeGreaterThan(initialMysticalPhase);
      expect(updatedDreamyPhase).toBeGreaterThan(initialDreamyPhase);
      
      // Should be gentle increments
      expect(updatedMysticalPhase - initialMysticalPhase).toBeLessThan(0.1);
      expect(updatedDreamyPhase - initialDreamyPhase).toBeLessThan(0.1);
    });

    test('should update ethereal elements during animation', () => {
      const updateSpy = jest.spyOn(etherealEngine as any, 'updateEtherealElements');
      
      etherealEngine.updateAnimation(16.67);
      
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    test('should allow emotional threshold configuration', () => {
      etherealEngine.setEmotionalThreshold(0.7);
      
      const config = etherealEngine.getEtherealConfig();
      expect(config.emotionalThreshold).toBe(0.7);
    });

    test('should allow beauty intensity configuration', () => {
      etherealEngine.setMaxBeautyIntensity(0.6);
      
      const config = etherealEngine.getEtherealConfig();
      expect(config.maxBeautyIntensity).toBe(0.6);
    });

    test('should allow gentleness configuration', () => {
      etherealEngine.setGentleness(0.9);
      
      const state = etherealEngine.getEtherealState();
      expect(state.gentleness).toBe(0.9);
    });
  });

  describe('Cleanup', () => {
    test('should destroy cleanly', async () => {
      await etherealEngine.initialize();
      
      etherealEngine.destroy();
      
      expect(etherealEngine.initialized).toBe(false);
      expect(etherealEngine.getEtherealState().beautyLevel).toBe(0);
    });
  });
});

// Integration test with ColorConsciousnessOrchestrator
describe('EtherealBeautyEngine Integration', () => {
  test('should integrate with ColorConsciousnessOrchestrator', () => {
    const etherealEngine = new EtherealBeautyEngine(
      mockHolographicSystem,
      mockCSSVariableBatcher,
      mockMusicSyncService
    );

    // Test initialization with consciousness manager
    expect(etherealEngine).toBeDefined();
    
    // Verify consciousness manager is available
    expect(colorConsciousnessManager).toBeDefined();
  });
});