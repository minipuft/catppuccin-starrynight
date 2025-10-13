import { OKLABColorProcessor } from '@/audio/ColorHarmonyEngine';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import type { Year3000Config, ArtisticMode } from '@/types/models';

describe('ColorHarmonyEngine Settings Updates', () => {
  let engine: OKLABColorProcessor;
  let mockConfig: Year3000Config;

  beforeEach(() => {
    mockConfig = {
      ...ADVANCED_SYSTEM_CONFIG,
      enableDebug: false,
      artisticMode: 'artist-vision' as ArtisticMode,
      colorHarmonyIntensity: 0.7,
      colorHarmonyEvolution: true,
      currentColorHarmonyMode: 'analogous',
      colorHarmonyBaseColor: null,
    };

    engine = new OKLABColorProcessor(mockConfig);
  });

  afterEach(() => {
    if (engine) {
      engine.destroy();
    }
  });

  describe('applyUpdatedSettings', () => {
    it('should update artistic mode reactively', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('sn-artistic-mode', 'advanced-maximum');

      expect(mockConfig.artisticMode).toBe('advanced-maximum');
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should update harmonic intensity with clamping', () => {
      engine.applyUpdatedSettings('sn-harmonic-intensity', 1.5);
      expect(engine['userIntensity']).toBeLessThanOrEqual(1.0);

      engine.applyUpdatedSettings('sn-harmonic-intensity', -0.5);
      expect(engine['userIntensity']).toBeGreaterThanOrEqual(0.0);
    });

    it('should handle invalid intensity values gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const initialIntensity = engine['userIntensity'];

      engine.applyUpdatedSettings('sn-harmonic-intensity', 'invalid');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid intensity value')
      );
      expect(engine['userIntensity']).toBe(initialIntensity);

      consoleSpy.mockRestore();
    });

    it('should toggle evolution on/off', () => {
      engine.applyUpdatedSettings('sn-harmonic-evolution', true);
      expect(engine['evolutionEnabled']).toBe(true);
      expect(mockConfig.colorHarmonyEvolution).toBe(true);

      engine.applyUpdatedSettings('sn-harmonic-evolution', false);
      expect(engine['evolutionEnabled']).toBe(false);
      expect(mockConfig.colorHarmonyEvolution).toBe(false);
    });

    it('should handle evolution as string boolean', () => {
      engine.applyUpdatedSettings('sn-harmonic-evolution', 'true');
      expect(engine['evolutionEnabled']).toBe(true);

      engine.applyUpdatedSettings('sn-harmonic-evolution', 'false');
      expect(engine['evolutionEnabled']).toBe(false);
    });

    it('should switch harmonic mode', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('sn-current-harmonic-mode', 'complementary');

      expect(mockConfig.currentColorHarmonyMode).toBe('complementary');
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should update base color', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('sn-manual-base-color', '#ff0000');

      expect(mockConfig.colorHarmonyBaseColor).toBe('#ff0000');
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should update accent color', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('catppuccin-accentColor', '#cba6f7');

      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should ignore null or undefined values', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('sn-artistic-mode', null);
      engine.applyUpdatedSettings('sn-current-harmonic-mode', undefined);
      engine.applyUpdatedSettings('sn-manual-base-color', '');

      expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('should handle unknown setting keys gracefully', () => {
      expect(() => {
        engine.applyUpdatedSettings('unknown-setting', 'value');
      }).not.toThrow();
    });
  });

  describe('Evolution timer management', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start evolution timer when enabled', () => {
      const startEvolutionSpy = jest.spyOn(engine as any, '_startEvolution');

      engine.applyUpdatedSettings('sn-harmonic-evolution', true);

      expect(startEvolutionSpy).toHaveBeenCalled();
      expect(engine['_evolutionTimer']).not.toBeNull();
    });

    it('should stop evolution timer when disabled', () => {
      engine['_evolutionTimer'] = setInterval(() => {}, 1000);
      const stopEvolutionSpy = jest.spyOn(engine as any, '_stopEvolution');

      engine.applyUpdatedSettings('sn-harmonic-evolution', false);

      expect(stopEvolutionSpy).toHaveBeenCalled();
      expect(engine['_evolutionTimer']).toBeNull();
    });

    it('should call refreshPalette on evolution interval', () => {
      const refreshSpy = jest.spyOn(engine as any, 'refreshPalette');

      engine.applyUpdatedSettings('sn-harmonic-evolution', true);

      jest.advanceTimersByTime(3000);
      expect(refreshSpy).toHaveBeenCalled();

      jest.advanceTimersByTime(3000);
      expect(refreshSpy).toHaveBeenCalledTimes(2);
    });

    it('should not start duplicate evolution timers', () => {
      engine.applyUpdatedSettings('sn-harmonic-evolution', true);
      const firstTimer = engine['_evolutionTimer'];

      engine.applyUpdatedSettings('sn-harmonic-evolution', true);
      const secondTimer = engine['_evolutionTimer'];

      expect(firstTimer).toBe(secondTimer);
    });
  });

  describe('Integration with existing methods', () => {
    it('should use existing setIntensity for intensity updates', () => {
      const setIntensitySpy = jest.spyOn(engine, 'setIntensity');

      engine.applyUpdatedSettings('sn-harmonic-intensity', 0.8);

      expect(setIntensitySpy).toHaveBeenCalledWith(0.8);
    });

    it('should trigger forceRepaint for intensity changes', () => {
      const forceRepaintSpy = jest.spyOn(engine, 'forceRepaint');

      engine.applyUpdatedSettings('sn-harmonic-intensity', 0.9);

      expect(forceRepaintSpy).toHaveBeenCalledWith('intensity-change');
    });

    it('should update config values for consistency', () => {
      engine.applyUpdatedSettings('sn-harmonic-intensity', 0.75);

      expect(mockConfig.colorHarmonyIntensity).toBe(0.75);
      expect(engine['userIntensity']).toBe(0.75);
    });
  });
});
