/**
 * PerformanceModeService Tests
 * 
 * Comprehensive test suite for the unified performance mode management system.
 * Tests preset management, override tracking, device detection, and migration logic.
 */

import { PerformanceModeService, getPerformanceModeService } from "@/core/performance/PerformanceModeService";
import { settings } from "@/config";
import type { PerformanceMode, PerformanceOverrides } from "@/config/settingsSchema";

// Mock dependencies
jest.mock('@/config', () => ({
  settings: {
    get: jest.fn(),
    set: jest.fn(),
    onChange: jest.fn(),
    offChange: jest.fn(),
  },
}));

jest.mock('@/core/events/EventBus', () => ({
  unifiedEventBus: {
    emit: jest.fn(),
    subscribe: jest.fn(),
  },
}));

describe('PerformanceModeService', () => {
  let service: PerformanceModeService;
  let mockSettings: jest.Mocked<typeof settings>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset singleton instance
    (PerformanceModeService as any).instance = null;
    
    // Mock settings
    mockSettings = settings as jest.Mocked<typeof settings>;
    mockSettings.get.mockImplementation((key: string) => {
      const defaults: Record<string, any> = {
        'sn-performance-mode': 'auto',
        'sn-performance-overrides': {
          hasOverrides: false,
          overriddenSettings: [],
          baseMode: 'auto',
        },
        'sn-webgl-enabled': true,
        'sn-webgl-quality': 'medium',
        'sn-animation-quality': 'auto',
        'sn-gradient-intensity': 'balanced',
        'sn-glassmorphism-level': 'moderate',
        'sn-corridor-effects-mode': 'auto',
        'sn-rendering-mode': 'auto',
      };
      return defaults[key];
    });
    
    service = PerformanceModeService.getInstance();
  });

  afterEach(() => {
    service.destroy();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const service1 = PerformanceModeService.getInstance();
      const service2 = PerformanceModeService.getInstance();
      expect(service1).toBe(service2);
    });

    it('should create new instance if none exists', () => {
      (PerformanceModeService as any).instance = null;
      const newService = PerformanceModeService.getInstance();
      expect(newService).toBeInstanceOf(PerformanceModeService);
    });
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await expect(service.initialize()).resolves.not.toThrow();
    });

    it('should load existing overrides from storage', async () => {
      const mockOverrides: PerformanceOverrides = {
        hasOverrides: true,
        overriddenSettings: ['sn-webgl-quality'],
        baseMode: 'quality',
      };
      
      mockSettings.get.mockImplementation((key: string) => {
        if (key === 'sn-performance-overrides') return mockOverrides;
        return 'auto';
      });

      await service.initialize();
      
      const overrides = service.getOverrides();
      expect(overrides.hasOverrides).toBe(true);
      expect(overrides.overriddenSettings).toContain('sn-webgl-quality');
      expect(overrides.baseMode).toBe('quality');
    });

    it('should handle missing overrides gracefully', async () => {
      mockSettings.get.mockImplementation((key: string) => {
        if (key === 'sn-performance-overrides') return null;
        return 'auto';
      });

      await expect(service.initialize()).resolves.not.toThrow();
      
      const overrides = service.getOverrides();
      expect(overrides.hasOverrides).toBe(false);
      expect(overrides.overriddenSettings).toHaveLength(0);
    });
  });

  describe('Preset Management', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should return correct preset for performance mode', () => {
      const preset = service.getPresetForMode('performance');
      
      expect(preset.webglEnabled).toBe(false);
      expect(preset.webglQuality).toBe('low');
      expect(preset.animationQuality).toBe('low');
      expect(preset.gradientIntensity).toBe('minimal');
      expect(preset.experimentalFeatures).toBe(false);
    });

    it('should return correct preset for quality mode', () => {
      const preset = service.getPresetForMode('quality');
      
      expect(preset.webglEnabled).toBe(true);
      expect(preset.webglQuality).toBe('high');
      expect(preset.animationQuality).toBe('high');
      expect(preset.gradientIntensity).toBe('intense');
      expect(preset.experimentalFeatures).toBe(false);
    });

    it('should return correct preset for maximum mode', () => {
      const preset = service.getPresetForMode('maximum');
      
      expect(preset.webglEnabled).toBe(true);
      expect(preset.webglQuality).toBe('high');
      expect(preset.animationQuality).toBe('high');
      expect(preset.gradientIntensity).toBe('intense');
      expect(preset.experimentalFeatures).toBe(true);
    });

    it('should return auto mode preset with device detection', () => {
      // Mock device detection
      const mockDetection = {
        recommendedMode: 'balanced',
        deviceCapabilities: {
          performanceTier: 'medium',
          memoryGB: 4,
          cpuCores: 4,
          supportsWebGL: true,
          isMobile: false,
        },
        reasoning: ['Medium device detected'],
      };
      
      jest.spyOn(service as any, 'detectDeviceCapabilities').mockReturnValue(mockDetection.deviceCapabilities);
      
      const preset = service.getPresetForMode('auto');
      
      expect(preset.animationQuality).toBe('auto');
      expect(preset.corridorEffectsMode).toBe('auto');
      expect(preset.renderingMode).toBe('auto');
    });
  });

  describe('Performance Mode Application', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should apply performance mode without overrides', async () => {
      mockSettings.get.mockReturnValue('auto');
      
      await service.applyPerformanceMode('performance');
      
      expect(mockSettings.set).toHaveBeenCalledWith('sn-webgl-enabled', false);
      expect(mockSettings.set).toHaveBeenCalledWith('sn-webgl-quality', 'low');
      expect(mockSettings.set).toHaveBeenCalledWith('sn-animation-quality', 'low');
    });

    it('should respect existing overrides when applying mode', async () => {
      // Setup existing overrides
      const overrides: PerformanceOverrides = {
        hasOverrides: true,
        overriddenSettings: new Set(['sn-webgl-quality']),
        baseMode: 'balanced',
      };
      
      jest.spyOn(service, 'getOverrides').mockReturnValue(overrides);
      
      await service.applyPerformanceMode('performance');
      
      // Should not set overridden settings
      expect(mockSettings.set).not.toHaveBeenCalledWith('sn-webgl-quality', 'low');
      // Should set non-overridden settings
      expect(mockSettings.set).toHaveBeenCalledWith('sn-webgl-enabled', false);
    });

    it('should emit performance mode change event', async () => {
      const { unifiedEventBus } = require('@/core/events/EventBus');
      
      await service.applyPerformanceMode('quality');
      
      expect(unifiedEventBus.emit).toHaveBeenCalledWith('performance:mode-changed', {
        mode: 'quality',
        preset: expect.any(Object),
        hasOverrides: false,
        timestamp: expect.any(Number),
      });
    });
  });

  describe('Override Management', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should track setting overrides correctly', async () => {
      await service.overrideSetting('sn-webgl-quality', 'high');
      
      const overrides = service.getOverrides();
      expect(overrides.hasOverrides).toBe(true);
      expect(overrides.overriddenSettings).toContain('sn-webgl-quality');
    });

    it('should remove override when setting matches preset', async () => {
      // First set an override
      await service.overrideSetting('sn-webgl-quality', 'high');
      
      // Then set it back to preset value
      await service.overrideSetting('sn-webgl-quality', 'medium'); // preset value for balanced mode
      
      const overrides = service.getOverrides();
      expect(overrides.hasOverrides).toBe(false);
      expect(overrides.overriddenSettings).not.toContain('sn-webgl-quality');
    });

    it('should check if setting is overridden', async () => {
      await service.overrideSetting('sn-webgl-enabled', false);
      
      expect(service.isSettingOverridden('sn-webgl-enabled')).toBe(true);
      expect(service.isSettingOverridden('sn-webgl-quality')).toBe(false);
    });

    it('should get effective value (preset or override)', async () => {
      mockSettings.get.mockReturnValue('auto');
      
      // Without override
      expect(service.getEffectiveValue('sn-webgl-enabled')).toBe(true); // preset value
      
      // With override
      await service.overrideSetting('sn-webgl-enabled', false);
      expect(service.getEffectiveValue('sn-webgl-enabled')).toBe(false); // override value
    });

    it('should reset all settings to preset', async () => {
      // Set some overrides
      await service.overrideSetting('sn-webgl-quality', 'high');
      await service.overrideSetting('sn-gradient-intensity', 'intense');
      
      // Reset to preset
      await service.resetToPreset();
      
      const overrides = service.getOverrides();
      expect(overrides.hasOverrides).toBe(false);
      expect(overrides.overriddenSettings).toHaveLength(0);
      
      expect(mockSettings.set).toHaveBeenCalledWith('sn-webgl-quality', 'medium');
      expect(mockSettings.set).toHaveBeenCalledWith('sn-gradient-intensity', 'balanced');
    });
  });

  describe('Device Detection', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should detect optimal performance mode for high-end device', () => {
      // Mock high-end device
      Object.defineProperty(window.navigator, 'hardwareConcurrency', {
        value: 8,
        configurable: true,
      });
      
      Object.defineProperty(performance, 'memory', {
        value: {
          jsHeapSizeLimit: 8 * 1024 * 1024 * 1024, // 8GB
        },
        configurable: true,
      });
      
      const detection = service.detectOptimalMode();
      
      expect(detection.recommendedMode).toBe('maximum');
      expect(detection.deviceCapabilities.performanceTier).toBe('premium');
      expect(detection.deviceCapabilities.memoryGB).toBe(8);
      expect(detection.deviceCapabilities.cpuCores).toBe(8);
    });

    it('should detect optimal performance mode for low-end device', () => {
      // Mock low-end device
      Object.defineProperty(window.navigator, 'hardwareConcurrency', {
        value: 2,
        configurable: true,
      });
      
      Object.defineProperty(performance, 'memory', {
        value: {
          jsHeapSizeLimit: 1 * 1024 * 1024 * 1024, // 1GB
        },
        configurable: true,
      });
      
      const detection = service.detectOptimalMode();
      
      expect(detection.recommendedMode).toBe('performance');
      expect(detection.deviceCapabilities.performanceTier).toBe('low');
    });

    it('should detect mobile device', () => {
      // Mock mobile device
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      
      const detection = service.detectOptimalMode();
      
      expect(detection.deviceCapabilities.isMobile).toBe(true);
      expect(detection.recommendedMode).toBe('performance'); // Mobile defaults to performance
    });
  });

  describe('Available Modes', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should return all available performance modes', () => {
      const modes = service.getAvailableModes();
      
      expect(modes).toHaveLength(5);
      expect(modes.map(m => m.mode)).toEqual(['auto', 'performance', 'balanced', 'quality', 'maximum']);
    });

    it('should include mode descriptions and recommendations', () => {
      const modes = service.getAvailableModes();
      
      modes.forEach(mode => {
        expect(mode.name).toBeDefined();
        expect(mode.description).toBeDefined();
        expect(typeof mode.isRecommended).toBe('boolean');
      });
    });
  });

  describe('Settings Change Tracking', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should subscribe to settings changes on initialization', () => {
      expect(mockSettings.onChange).toHaveBeenCalled();
    });

    it('should track overrides when settings change', async () => {
      // Get the onChange callback
      const onChangeCallback = mockSettings.onChange.mock.calls[0][0];
      
      // Simulate a settings change
      onChangeCallback('sn-webgl-quality', 'high');
      
      // Should have tracked the override
      expect(service.isSettingOverridden('sn-webgl-quality')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should handle settings errors gracefully', async () => {
      mockSettings.set.mockImplementation(() => {
        throw new Error('Settings error');
      });
      
      await expect(service.applyPerformanceMode('performance')).resolves.not.toThrow();
    });

    it('should handle device detection errors gracefully', () => {
      // Mock device detection error
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => {
          throw new Error('Detection error');
        },
        configurable: true,
      });
      
      expect(() => service.detectOptimalMode()).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should destroy service and clean up resources', async () => {
      await service.initialize();
      
      service.destroy();
      
      expect((PerformanceModeService as any).instance).toBeNull();
    });
  });
});

describe('getPerformanceModeService', () => {
  it('should return PerformanceModeService instance', () => {
    const service = getPerformanceModeService();
    expect(service).toBeInstanceOf(PerformanceModeService);
  });

  it('should return the same instance on multiple calls', () => {
    const service1 = getPerformanceModeService();
    const service2 = getPerformanceModeService();
    expect(service1).toBe(service2);
  });
});