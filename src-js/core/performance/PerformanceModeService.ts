import { settings } from "@/config";
import type { 
  PerformanceMode, 
  WebGLQuality, 
  QualityLevel, 
  GradientIntensityLevel,
  GlassmorphismLevel 
} from "@/config/settingsSchema";
import type { CorridorEffectsMode, RenderingModePreference } from "@/types/renderingModes";
import { unifiedEventBus } from "@/core/events/EventBus";

/**
 * Performance override tracking interface
 * Tracks which settings have been manually overridden by the user
 */
export interface PerformanceOverrides {
  hasOverrides: boolean;
  overriddenSettings: Set<string>;
  baseMode: PerformanceMode;
}

/**
 * Performance preset definition
 * Contains all individual settings that make up a performance mode
 */
export interface PerformancePreset {
  // WebGL Configuration
  webglEnabled: boolean;
  webglQuality: WebGLQuality;

  // Animation Configuration
  animationQuality: QualityLevel;

  // Visual Effects Configuration
  gradientIntensity: GradientIntensityLevel;
  glassmorphismLevel: GlassmorphismLevel;

  // Advanced Features
  corridorEffectsMode: CorridorEffectsMode;
  renderingMode: RenderingModePreference;

  // Feature flags
  experimentalFeatures: boolean;
}

/**
 * Performance mode detection result
 */
export interface PerformanceModeDetection {
  recommendedMode: PerformanceMode;
  deviceCapabilities: {
    performanceTier: 'low' | 'medium' | 'high' | 'premium';
    memoryGB: number;
    cpuCores: number;
    supportsWebGL: boolean;
    isMobile: boolean;
  };
  reasoning: string[];
}

/**
 * Performance Mode Service
 * 
 * Central controller for unified performance management with intelligent override support.
 * This service implements the new architecture that resolves the dual-control conflicts
 * by establishing performance mode as the primary control with optional expert overrides.
 * 
 * Key Features:
 * - Preset Management: Define all 5 performance mode presets
 * - Synchronization Logic: Keep performance mode and individual settings in sync
 * - Override Tracking: Track user overrides separately from preset values
 * - Device Detection: Intelligent auto mode based on device capabilities
 * - Migration Support: Handle migration from old scattered settings
 * 
 * @architecture Phase 1 of Performance Settings Migration
 * @performance Target: <100ms settings application, <1MB memory footprint
 */
export class PerformanceModeService {
  private static instance: PerformanceModeService | null = null;
  
  // Performance presets for all 5 modes
  private readonly PERFORMANCE_PRESETS: Record<PerformanceMode, PerformancePreset> = {
    auto: {
      // Auto mode uses device detection, these are defaults that get overridden
      webglEnabled: true,
      webglQuality: 'medium',
      animationQuality: 'auto',
      gradientIntensity: 'balanced',
      glassmorphismLevel: 'moderate',
      corridorEffectsMode: 'auto',
      renderingMode: 'auto',
      experimentalFeatures: false,
    },
    
    performance: {
      webglEnabled: false,
      webglQuality: 'low',
      animationQuality: 'low',
      gradientIntensity: 'minimal',
      glassmorphismLevel: 'disabled',
      corridorEffectsMode: 'disabled',
      renderingMode: 'basic',
      experimentalFeatures: false,
    },
    
    balanced: {
      webglEnabled: true,
      webglQuality: 'medium',
      animationQuality: 'auto',
      gradientIntensity: 'balanced',
      glassmorphismLevel: 'moderate',
      corridorEffectsMode: 'auto',
      renderingMode: 'standard',
      experimentalFeatures: false,
    },
    
    quality: {
      webglEnabled: true,
      webglQuality: 'high',
      animationQuality: 'high',
      gradientIntensity: 'intense',
      glassmorphismLevel: 'intense',
      corridorEffectsMode: 'auto',
      renderingMode: 'enhanced',
      experimentalFeatures: false,
    },
    
    maximum: {
      webglEnabled: true,
      webglQuality: 'high',
      animationQuality: 'high',
      gradientIntensity: 'intense',
      glassmorphismLevel: 'intense',
      corridorEffectsMode: 'enabled',
      renderingMode: 'full',
      experimentalFeatures: true,
    },
  };

  // Override tracking
  private overrides: PerformanceOverrides = {
    hasOverrides: false,
    overriddenSettings: new Set(),
    baseMode: 'auto',
  };

  // Device capabilities cache
  private deviceCapabilities: PerformanceModeDetection['deviceCapabilities'] | null = null;
  
  // Event subscription cleanup
  private eventUnsubscribers: (() => void)[] = [];

  /**
   * Get or create singleton instance
   */
  public static getInstance(): PerformanceModeService {
    if (!PerformanceModeService.instance) {
      PerformanceModeService.instance = new PerformanceModeService();
    }
    return PerformanceModeService.instance;
  }

  /**
   * Initialize the service
   */
  public async initialize(): Promise<void> {
    // Load existing overrides from storage
    this.loadOverrides();
    
    // Detect device capabilities for auto mode
    this.detectDeviceCapabilities();
    
    // Subscribe to settings changes to track overrides
    this.subscribeToSettingsChanges();
    
    // Apply current performance mode if no overrides exist
    if (!this.overrides.hasOverrides) {
      const currentMode = this.getCurrentPerformanceMode();
      await this.applyPerformanceMode(currentMode);
    }
    
    console.log('[PerformanceModeService] Initialized with unified performance management');
  }

  /**
   * Get preset for a specific performance mode
   */
  public getPresetForMode(mode: PerformanceMode): PerformancePreset {
    if (mode === 'auto') {
      // For auto mode, return device-optimized preset
      return this.getAutoModePreset();
    }
    
    return { ...this.PERFORMANCE_PRESETS[mode] };
  }

  /**
   * Apply performance mode with override awareness
   */
  public async applyPerformanceMode(mode: PerformanceMode, forceApply: boolean = false): Promise<void> {
    const preset = this.getPresetForMode(mode);
    const overrides = this.getOverrides();
    
    // Check if we have overrides and show confirmation if needed
    if (overrides.hasOverrides && !forceApply) {
      const shouldProceed = await this.confirmModeChange(mode, overrides);
      if (!shouldProceed) {
        return;
      }
    }

    // Apply preset for non-overridden settings
    await this.applyPresetWithOverrides(preset, overrides);
    
    // Update base mode in overrides
    this.updateBaseMode(mode);
    
    // Emit performance mode change event
    unifiedEventBus.emit("performance:mode-changed", {
      mode,
      preset,
      hasOverrides: overrides.hasOverrides,
      timestamp: Date.now()
    });

    console.log(`[PerformanceModeService] Applied performance mode: ${mode}`);
  }

  /**
   * Override a specific setting
   */
  public async overrideSetting(key: string, value: any): Promise<void> {
    const currentMode = this.getCurrentPerformanceMode();
    const preset = this.getPresetForMode(currentMode);
    
    // Check if this is actually an override
    const presetValue = (preset as any)[key];
    const isOverride = presetValue !== value;
    
    if (isOverride) {
      this.overrides.overriddenSettings.add(key);
      this.overrides.hasOverrides = true;
    } else {
      this.overrides.overriddenSettings.delete(key);
      this.overrides.hasOverrides = this.overrides.overriddenSettings.size > 0;
    }
    
    // Save the setting value
    settings.set(key as any, value);
    
    // Save overrides state
    this.saveOverrides();
    
    // Emit override change event
    unifiedEventBus.emit("performance:override-changed", {
      key,
      value,
      isOverride,
      hasOverrides: this.overrides.hasOverrides,
      timestamp: Date.now()
    });
  }

  /**
   * Reset all settings to current performance mode preset
   */
  public async resetToPreset(): Promise<void> {
    const currentMode = this.getCurrentPerformanceMode();
    const preset = this.getPresetForMode(currentMode);
    
    // Clear all overrides
    this.overrides.overriddenSettings.clear();
    this.overrides.hasOverrides = false;
    
    // Apply all preset values
    await this.applyPresetDirectly(preset);
    
    // Save cleared overrides
    this.saveOverrides();
    
    // Emit reset event
    unifiedEventBus.emit("performance:reset-to-preset", {
      mode: currentMode,
      preset,
      timestamp: Date.now()
    });

    console.log(`[PerformanceModeService] Reset all settings to ${currentMode} preset`);
  }

  /**
   * Get current performance mode
   */
  public getCurrentPerformanceMode(): PerformanceMode {
    return settings.get("sn-performance-mode") as PerformanceMode;
  }

  /**
   * Get current overrides
   */
  public getOverrides(): PerformanceOverrides {
    return {
      hasOverrides: this.overrides.hasOverrides,
      overriddenSettings: new Set(this.overrides.overriddenSettings),
      baseMode: this.overrides.baseMode,
    };
  }

  /**
   * Check if a setting is currently overridden
   */
  public isSettingOverridden(key: string): boolean {
    return this.overrides.overriddenSettings.has(key);
  }

  /**
   * Get effective value for a setting (preset or override)
   */
  public getEffectiveValue(key: string): any {
    if (this.isSettingOverridden(key)) {
      return settings.get(key as any);
    }
    
    const currentMode = this.getCurrentPerformanceMode();
    const preset = this.getPresetForMode(currentMode);
    return (preset as any)[key];
  }

  /**
   * Detect optimal performance mode based on device capabilities
   */
  public detectOptimalMode(): PerformanceModeDetection {
    if (!this.deviceCapabilities) {
      this.detectDeviceCapabilities();
    }
    
    const caps = this.deviceCapabilities!;
    let recommendedMode: PerformanceMode;
    const reasoning: string[] = [];
    
    // Determine recommended mode based on device capabilities
    if (caps.performanceTier === 'premium') {
      recommendedMode = 'maximum';
      reasoning.push('Premium device detected (8GB+ RAM, 8+ cores)');
    } else if (caps.performanceTier === 'high') {
      recommendedMode = 'quality';
      reasoning.push('High-end device detected (4-8GB RAM, 4-8 cores)');
    } else if (caps.performanceTier === 'medium') {
      recommendedMode = 'balanced';
      reasoning.push('Medium device detected (2-4GB RAM, 2-4 cores)');
    } else {
      recommendedMode = 'performance';
      reasoning.push('Low-end device detected (<2GB RAM or <2 cores)');
    }
    
    // Adjust for mobile
    if (caps.isMobile) {
      recommendedMode = 'performance';
      reasoning.push('Mobile device detected - prioritizing battery life');
    }
    
    // Adjust for WebGL support
    if (!caps.supportsWebGL) {
      recommendedMode = 'performance';
      reasoning.push('WebGL not supported - using performance mode');
    }
    
    return {
      recommendedMode,
      deviceCapabilities: caps,
      reasoning,
    };
  }

  /**
   * Get all available performance modes with descriptions
   */
  public getAvailableModes(): Array<{
    mode: PerformanceMode;
    name: string;
    description: string;
    isRecommended: boolean;
  }> {
    const detection = this.detectOptimalMode();
    const currentMode = this.getCurrentPerformanceMode();
    
    return [
      {
        mode: 'auto',
        name: 'Auto',
        description: `Automatically detect optimal settings (${detection.recommendedMode} detected for this device)`,
        isRecommended: currentMode === 'auto',
      },
      {
        mode: 'performance',
        name: 'Performance',
        description: 'Maximum speed with minimal effects (ideal for low-end devices)',
        isRecommended: detection.recommendedMode === 'performance',
      },
      {
        mode: 'balanced',
        name: 'Balanced',
        description: 'Good balance of quality and performance (recommended for most users)',
        isRecommended: detection.recommendedMode === 'balanced',
      },
      {
        mode: 'quality',
        name: 'Quality',
        description: 'High quality visuals with all features enabled (requires capable device)',
        isRecommended: detection.recommendedMode === 'quality',
      },
      {
        mode: 'maximum',
        name: 'Maximum',
        description: 'Ultra quality with experimental features (enthusiast mode)',
        isRecommended: detection.recommendedMode === 'maximum',
      },
    ];
  }

  /**
   * Destroy the service and clean up resources
   */
  public destroy(): void {
    // Unsubscribe from all events
    this.eventUnsubscribers.forEach(unsubscribe => unsubscribe());
    this.eventUnsubscribers = [];
    
    // Clear instance
    if (PerformanceModeService.instance === this) {
      PerformanceModeService.instance = null;
    }
    
    console.log('[PerformanceModeService] Destroyed');
  }

  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================

  /**
   * Get auto mode preset based on device detection
   */
  private getAutoModePreset(): PerformancePreset {
    const detection = this.detectOptimalMode();
    const recommendedPreset = this.PERFORMANCE_PRESETS[detection.recommendedMode];
    
    // For auto mode, we use the recommended preset but keep some intelligent defaults
    return {
      ...recommendedPreset,
      animationQuality: 'auto', // Always use auto for animation quality in auto mode
      corridorEffectsMode: 'auto', // Always use auto for corridor effects in auto mode
      renderingMode: 'auto', // Always use auto for rendering mode in auto mode
    };
  }

  /**
   * Apply preset with override awareness
   */
  private async applyPresetWithOverrides(preset: PerformancePreset, overrides: PerformanceOverrides): Promise<void> {
    const settingMappings = [
      ['sn-webgl-enabled', preset.webglEnabled],
      ['sn-webgl-quality', preset.webglQuality],
      ['sn-animation-quality', preset.animationQuality],
      ['sn-gradient-intensity', preset.gradientIntensity],
      ['sn-glassmorphism-level', preset.glassmorphismLevel],
      ['sn-corridor-effects-mode', preset.corridorEffectsMode],
      ['sn-rendering-mode', preset.renderingMode],
    ] as const;

    // Apply each setting if not overridden
    for (const [key, value] of settingMappings) {
      if (!overrides.overriddenSettings.has(key)) {
        settings.set(key, value);
      }
    }

    // Experimental features is a special case - not in settings schema yet
    // This would be handled by the performance monitor when it reads the preset
  }

  /**
   * Apply preset directly (for reset to preset)
   */
  private async applyPresetDirectly(preset: PerformancePreset): Promise<void> {
    const settingMappings = [
      ['sn-webgl-enabled', preset.webglEnabled],
      ['sn-webgl-quality', preset.webglQuality],
      ['sn-animation-quality', preset.animationQuality],
      ['sn-gradient-intensity', preset.gradientIntensity],
      ['sn-glassmorphism-level', preset.glassmorphismLevel],
      ['sn-corridor-effects-mode', preset.corridorEffectsMode],
      ['sn-rendering-mode', preset.renderingMode],
    ] as const;

    // Apply all settings
    for (const [key, value] of settingMappings) {
      settings.set(key, value);
    }
  }

  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): void {
    const nav = navigator as any;
    const memory = (performance as any).memory;
    
    // Detect WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const supportsWebGL = !!gl;
    
    // Estimate memory from available browser info
    const estimatedMemory = memory ? Math.round(memory.jsHeapSizeLimit / (1024 * 1024 * 1024)) : 4;
    
    // Determine performance tier
    let performanceTier: 'low' | 'medium' | 'high' | 'premium' = 'medium';
    if (estimatedMemory >= 8 && nav.hardwareConcurrency >= 8) {
      performanceTier = 'premium';
    } else if (estimatedMemory >= 4 && nav.hardwareConcurrency >= 4) {
      performanceTier = 'high';
    } else if (estimatedMemory >= 2 && nav.hardwareConcurrency >= 2) {
      performanceTier = 'medium';
    } else {
      performanceTier = 'low';
    }
    
    this.deviceCapabilities = {
      performanceTier,
      memoryGB: estimatedMemory,
      cpuCores: nav.hardwareConcurrency || 4,
      supportsWebGL,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent),
    };
  }

  /**
   * Subscribe to settings changes to track overrides
   */
  private subscribeToSettingsChanges(): void {
    const performanceSettings = [
      'sn-webgl-enabled',
      'sn-webgl-quality',
      'sn-animation-quality',
      'sn-gradient-intensity',
      'sn-glassmorphism-level',
      'sn-corridor-effects-mode',
      'sn-rendering-mode',
    ];

    const unsubscribe = settings.onChange((event) => {
      // Only track performance-related settings
      if (!performanceSettings.includes(event.settingKey)) return;

      // Skip if this is a programmatic change from our service
      // (We could add a flag to distinguish user vs programmatic changes)

      const currentMode = this.getCurrentPerformanceMode();
      const preset = this.getPresetForMode(currentMode);
      const presetValue = (preset as any)[event.settingKey];

      if (presetValue !== event.newValue) {
        this.overrides.overriddenSettings.add(event.settingKey);
        this.overrides.hasOverrides = true;
      } else {
        this.overrides.overriddenSettings.delete(event.settingKey);
        this.overrides.hasOverrides = this.overrides.overriddenSettings.size > 0;
      }

      this.saveOverrides();
    });

    this.eventUnsubscribers.push(unsubscribe);
  }

  /**
   * Load overrides from storage
   */
  private loadOverrides(): void {
    try {
      const stored = settings.get("sn-performance-overrides") as any;
      if (stored) {
        this.overrides = {
          hasOverrides: stored.hasOverrides || false,
          overriddenSettings: new Set(stored.overriddenSettings || []),
          baseMode: stored.baseMode || 'auto',
        };
      }
    } catch (error) {
      console.warn('[PerformanceModeService] Failed to load overrides:', error);
      // Start with clean overrides
      this.overrides = {
        hasOverrides: false,
        overriddenSettings: new Set(),
        baseMode: 'auto',
      };
    }
  }

  /**
   * Save overrides to storage
   */
  private saveOverrides(): void {
    try {
      const toStore = {
        hasOverrides: this.overrides.hasOverrides,
        overriddenSettings: Array.from(this.overrides.overriddenSettings),
        baseMode: this.overrides.baseMode,
      };
      settings.set("sn-performance-overrides", toStore);
    } catch (error) {
      console.error('[PerformanceModeService] Failed to save overrides:', error);
    }
  }

  /**
   * Update base mode in overrides
   */
  private updateBaseMode(mode: PerformanceMode): void {
    this.overrides.baseMode = mode;
    this.saveOverrides();
  }

  /**
   * Confirm mode change when overrides exist
   */
  private async confirmModeChange(newMode: PerformanceMode, overrides: PerformanceOverrides): Promise<boolean> {
    // In a real implementation, this would show a confirmation dialog
    // For now, we'll just log and proceed
    console.log(`[PerformanceModeService] Changing mode from ${overrides.baseMode} to ${newMode} with ${overrides.overriddenSettings.size} overrides`);
    
    // Return true to proceed with the change
    return true;
  }
}

// Export singleton instance getter
export const getPerformanceModeService = (): PerformanceModeService => {
  return PerformanceModeService.getInstance();
};