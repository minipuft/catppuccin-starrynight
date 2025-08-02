/**
 * DynamicCatppuccinStrategy - ColorOrchestrator Strategy Implementation
 * 
 * Transforms the DynamicCatppuccinBridge into a proper IColorProcessor strategy
 * for the unified ColorOrchestrator architecture. Handles Spicetify variable 
 * updates and consciousness extensions through the Color Extension Facade pattern.
 * 
 * Philosophy: "Unified color processing through intelligent strategy coordination,
 * eliminating duplicate event handling while preserving dynamic accent functionality."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import { SettingsManager } from '@/ui/managers/SettingsManager';
import { UnifiedCSSConsciousnessController } from '@/core/css/UnifiedCSSConsciousnessController';
import * as Utils from '@/utils/core/Year3000Utilities';
import { 
  OKLABColorProcessor, 
  type EnhancementPreset, 
  type OKLABProcessingResult 
} from '@/utils/color/OKLABColorProcessor';
import type { 
  IColorProcessor, 
  ColorContext, 
  ColorResult 
} from '@/types/colorStrategy';

interface DynamicColorState {
  currentAccentHex: string;
  currentAccentRgb: string;
  baseBackgroundHex: string;
  baseBackgroundRgb: string;
  lastUpdateTime: number;
  musicEnergy: number;
  transitionInProgress: boolean;
}

interface CatppuccinIntegrationConfig {
  accentUpdateEnabled: boolean;
  baseTransformationEnabled: boolean;
  consciousnessIntegrationEnabled: boolean;
  oklabEnhancementEnabled: boolean;
  smoothTransitionDuration: number; // ms
  energyResponseMultiplier: number; // 0-2
  oklabPreset: string; // OKLAB enhancement preset name
}

export class DynamicCatppuccinStrategy implements IColorProcessor {
  private settingsManager: SettingsManager;
  private cssController: UnifiedCSSConsciousnessController | null;
  private oklabProcessor: OKLABColorProcessor;
  private utils = Utils;
  private config = YEAR3000_CONFIG;
  
  private dynamicColorState: DynamicColorState = {
    currentAccentHex: '#7c3aed', // Default StarryNight cosmic purple
    currentAccentRgb: '124,58,237',
    baseBackgroundHex: '#0d1117', // Default StarryNight deep space black
    baseBackgroundRgb: '13,17,23',
    lastUpdateTime: 0,
    musicEnergy: 0.5,
    transitionInProgress: false
  };
  
  private integrationConfig: CatppuccinIntegrationConfig = {
    accentUpdateEnabled: true,
    baseTransformationEnabled: true,
    consciousnessIntegrationEnabled: true,
    oklabEnhancementEnabled: true,
    smoothTransitionDuration: 800, // 0.8s smooth transitions
    energyResponseMultiplier: 1.2,
    oklabPreset: 'VIBRANT' // Use vibrant OKLAB enhancement
  };
  
  // Transition management
  private transitionTimer: number = 0;
  private lastTransitionStartTime: number = 0;
  private transitionFromAccent: string = '';
  private transitionToAccent: string = '';

  constructor(settingsManager?: SettingsManager, cssController?: UnifiedCSSConsciousnessController) {
    this.settingsManager = settingsManager || new SettingsManager();
    this.cssController = cssController || UnifiedCSSConsciousnessController.getInstance();
    this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    
    // Initialize current state from existing variables
    this.initializeCurrentState();
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Color strategy initialized with CSS coordinator and OKLAB processing');
  }

  /**
   * IColorProcessor interface implementation
   */
  getStrategyName(): string {
    return "dynamic-catppuccin";
  }

  /**
   * Check if strategy can handle the given context
   */
  canProcess(context: ColorContext): boolean {
    // Only process when dynamic accent is enabled in settings
    return this.checkDynamicAccentEnabled();
  }

  /**
   * Get estimated processing time for performance planning
   */
  getEstimatedProcessingTime(context: ColorContext): number {
    // Fast processing - mainly CSS variable updates
    return 5; // ~5ms estimated
  }

  /**
   * Process colors using Dynamic Catppuccin strategy with OKLAB enhancement
   */
  async processColors(context: ColorContext): Promise<ColorResult> {
    const startTime = performance.now();
    
    try {
      // Select best accent color from extracted colors
      const newAccentHex = this.selectBestAccentColor(context.rawColors);
      
      if (!newAccentHex) {
        throw new Error('No suitable accent color found in extracted colors');
      }
      
      // Process color through OKLAB if enhancement is enabled
      let processedAccentHex = newAccentHex;
      let processedAccentRgb = this.utils.hexToRgb(newAccentHex);
      let oklabResult: OKLABProcessingResult | null = null;
      
      if (this.integrationConfig.oklabEnhancementEnabled) {
        const preset = OKLABColorProcessor.getPreset(this.integrationConfig.oklabPreset);
        oklabResult = this.oklabProcessor.processColor(newAccentHex, preset);
        processedAccentHex = oklabResult.enhancedHex;
        processedAccentRgb = oklabResult.enhancedRgb;
        
        Y3K?.debug?.log('DynamicCatppuccinStrategy', 'OKLAB color enhancement applied:', {
          original: newAccentHex,
          enhanced: processedAccentHex,
          preset: preset.name,
          processingTime: `${oklabResult.processingTime.toFixed(2)}ms`
        });
      }
      
      // Apply colors using Color Extension Facade with OKLAB-enhanced color
      await this.applyColorFacade(processedAccentHex, context.rawColors, oklabResult);
      
      // Update internal state with processed color
      this.dynamicColorState.currentAccentHex = processedAccentHex;
      if (processedAccentRgb) {
        this.dynamicColorState.currentAccentRgb = `${processedAccentRgb.r},${processedAccentRgb.g},${processedAccentRgb.b}`;
      }
      this.dynamicColorState.lastUpdateTime = Date.now();
      
      // Handle music energy if available
      if (context.musicData?.energy !== undefined) {
        this.dynamicColorState.musicEnergy = context.musicData.energy;
        await this.updateConsciousnessWithMusicEnergy(context.musicData.energy);
      }
      
      const processingTime = performance.now() - startTime;
      
      const result: ColorResult = {
        processedColors: {
          accent: processedAccentHex,
          primary: processedAccentHex,
          originalAccent: newAccentHex, // Keep original for reference
          ...context.rawColors
        },
        accentHex: processedAccentHex,
        accentRgb: this.dynamicColorState.currentAccentRgb,
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          cacheKey: `dynamic-catppuccin-${context.trackUri}`,
          harmonicIntensity: this.integrationConfig.energyResponseMultiplier,
          oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
          oklabPreset: this.integrationConfig.oklabPreset,
          ...(oklabResult && { oklabMetadata: {
            originalHex: oklabResult.originalHex,
            enhancedHex: oklabResult.enhancedHex,
            shadowHex: oklabResult.shadowHex,
            oklabProcessingTime: oklabResult.processingTime
          }})
        },
        context
      };
      
      Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Color processing completed', {
        originalAccent: newAccentHex,
        processedAccent: processedAccentHex,
        oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
        processingTime,
        trackUri: context.trackUri
      });
      
      return result;
      
    } catch (error) {
      const processingTime = performance.now() - startTime;
      
      Y3K?.debug?.error('DynamicCatppuccinStrategy', 'Color processing failed:', error);
      
      // Return fallback result
      return {
        processedColors: context.rawColors,
        accentHex: this.dynamicColorState.currentAccentHex,
        accentRgb: this.dynamicColorState.currentAccentRgb,
        metadata: {
          strategy: this.getStrategyName(),
          processingTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        context
      };
    }
  }

  /**
   * Check if dynamic accent is enabled in settings
   */
  private checkDynamicAccentEnabled(): boolean {
    try {
      const accentSetting = this.settingsManager.get('catppuccin-accentColor');
      const isDynamic = String(accentSetting) === 'dynamic';
      
      if (this.config.enableDebug) {
        Y3K?.debug?.log('DynamicCatppuccinStrategy', `Accent setting: ${accentSetting}, Dynamic: ${isDynamic}`);
      }
      
      return isDynamic;
    } catch (error) {
      Y3K?.debug?.error('DynamicCatppuccinStrategy', 'Error checking dynamic accent setting:', error);
      return false;
    }
  }

  /**
   * Initialize current state from existing CSS variables
   */
  private initializeCurrentState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Get current accent if available
    const currentAccent = computedStyle.getPropertyValue('--spice-accent').trim() ||
                          computedStyle.getPropertyValue('--sn-color-accent-hex').trim();
    
    if (currentAccent) {
      this.dynamicColorState.currentAccentHex = currentAccent;
      const rgb = this.utils.hexToRgb(currentAccent);
      if (rgb) {
        this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
      }
    }
    
    // Get current base background
    const currentBase = computedStyle.getPropertyValue('--spice-base').trim() || '#1e1e2e';
    this.dynamicColorState.baseBackgroundHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.dynamicColorState.baseBackgroundRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }
    
    this.dynamicColorState.lastUpdateTime = Date.now();
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Current state initialized:', {
      accent: this.dynamicColorState.currentAccentHex,
      base: this.dynamicColorState.baseBackgroundHex
    });
  }

  /**
   * Select best accent color from extracted colors
   */
  private selectBestAccentColor(colors: Record<string, string>): string | null {
    // Priority order for accent selection
    const priorities = [
      'VIBRANT_NON_ALARMING', // Best for UI - vibrant but not overwhelming
      'VIBRANT',              // Strong and lively
      'LIGHT_VIBRANT',        // Lighter variant
      'PROMINENT',            // Most noticeable color
      'PRIMARY',              // Primary extracted color
      'DARK_VIBRANT'          // Darker variant as fallback
    ];
    
    for (const key of priorities) {
      const color = colors[key];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }
    
    return null;
  }

  /**
   * Apply colors using Color Extension Facade pattern with coordinated updates
   * Updates both core Spicetify variables AND consciousness extensions with OKLAB enhancement
   */
  private async applyColorFacade(
    accentHex: string, 
    rawColors: Record<string, string>, 
    oklabResult?: OKLABProcessingResult | null
  ): Promise<void> {
    const rgb = this.utils.hexToRgb(accentHex);
    
    if (!rgb) return;
    
    const rgbString = `${rgb.r},${rgb.g},${rgb.b}`;
    
    // 🎯 COORDINATED VARIABLE UPDATES - Dynamic > Cosmic > Spicetify cascade
    const variablesToUpdate: Record<string, string> = {
      // Dynamic color variables (highest priority) - updated by music systems
      '--sn-dynamic-accent-hex': accentHex,
      '--sn-dynamic-accent-rgb': rgbString,
      '--sn-dynamic-primary-hex': accentHex,
      '--sn-dynamic-primary-rgb': rgbString,
      
      // Core Spicetify variables for compatibility
      '--spice-accent': accentHex,
      '--spice-button': accentHex,
      '--spice-button-active': accentHex,
      '--spice-rgb-accent': rgbString,
      '--spice-rgb-button': rgbString,
      
      // Extracted color variables for ColorHarmonyEngine
      '--sn-color-extracted-primary-rgb': rgbString,
      '--sn-color-extracted-vibrant-rgb': rgbString,
      '--sn-color-extracted-dominant-rgb': rgbString
    };

    // 🔬 OKLAB ENHANCED VARIABLES - Add OKLAB-processed variables if available
    if (oklabResult && this.integrationConfig.oklabEnhancementEnabled) {
      const oklabCSSVars = this.oklabProcessor.generateCSSVariables(oklabResult, 'sn-oklab-accent');
      Object.assign(variablesToUpdate, {
        ...oklabCSSVars,
        // Enhanced shadow variables for depth effects
        '--sn-dynamic-shadow-hex': oklabResult.shadowHex,
        '--sn-dynamic-shadow-rgb': `${oklabResult.shadowRgb.r},${oklabResult.shadowRgb.g},${oklabResult.shadowRgb.b}`,
        // OKLCH variables for advanced CSS features
        '--sn-accent-oklch-l': oklabResult.oklchEnhanced.L.toFixed(3),
        '--sn-accent-oklch-c': oklabResult.oklchEnhanced.C.toFixed(3),
        '--sn-accent-oklch-h': oklabResult.oklchEnhanced.H.toFixed(1)
      });
      
      Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Added OKLAB-enhanced CSS variables:', {
        oklabVarsCount: Object.keys(oklabCSSVars).length,
        enhancedHex: oklabResult.enhancedHex,
        shadowHex: oklabResult.shadowHex
      });
    }

    // Apply all core variables in a coordinated batch
    if (this.cssController) {
      this.cssController.updateVariables(variablesToUpdate, 'high', 'core-spicetify-facade');
    }
    
    // Apply secondary colors if available
    const primaryColor = rawColors['PRIMARY'] || rawColors['VIBRANT'];
    if (primaryColor) {
      await this.updateLivingBaseBackground(primaryColor);
    }
    
    // 🔮 CONSCIOUSNESS INTEGRATION
    if (this.integrationConfig.consciousnessIntegrationEnabled) {
      await this.updateConsciousnessWithAccent(accentHex, rgbString);
    }
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', `Applied coordinated color facade - Spicetify: ${accentHex}, Consciousness extensions updated`, {
      oklabProcessing: !!oklabResult,
      variableCount: Object.keys(variablesToUpdate).length
    });
  }

  /**
   * Update living base background using coordinated variable updates
   * Preserves Spicetify base while adding consciousness layers
   */
  private async updateLivingBaseBackground(primaryHex: string): Promise<void> {
    const primaryRgb = this.utils.hexToRgb(primaryHex);
    
    if (!primaryRgb) return;
    
    const primaryRgbString = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;
    
    // Create living gradient that ENHANCES Spicetify base (doesn't replace)
    const consciousnessGradient = `
      linear-gradient(135deg, 
        var(--spice-base) 0%,
        rgba(${primaryRgbString}, 0.08) 30%,
        var(--spice-base) 70%
      ),
      var(--spice-base)
    `;
    
    // 🌊 COORDINATED CONSCIOUSNESS EXTENSIONS
    const livingBaseVariables: Record<string, string> = {
      // Dynamic secondary colors
      '--sn-dynamic-secondary-hex': primaryHex,
      '--sn-dynamic-secondary-rgb': primaryRgbString,
      
      // Extracted color system for consciousness effects
      '--sn-color-extracted-secondary-rgb': primaryRgbString,
      '--sn-color-harmony-complementary-rgb': primaryRgbString,
      
      // Living gradient enhancements
      '--living-base-gradient': consciousnessGradient,
      '--consciousness-base-gradient': consciousnessGradient
    };

    if (this.cssController) {
      this.cssController.updateVariables(livingBaseVariables, 'normal', 'living-base-background');
    }
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', `Coordinated living base facade updated - Primary: ${primaryHex}, preserving --spice-base`);
  }

  /**
   * Update consciousness system with new accent awareness using coordinated updates
   */
  private async updateConsciousnessWithAccent(accentHex: string, accentRgb: string): Promise<void> {
    const consciousnessVariables: Record<string, string> = {
      // Holographic consciousness variables
      '--organic-holographic-rgb': accentRgb,
      '--holographic-scanline-rgb': accentRgb,
      
      // Depth consciousness variables
      '--consciousness-intensity': `calc(0.5 + var(--musical-sync-intensity) * ${this.integrationConfig.energyResponseMultiplier})`
    };

    if (this.cssController) {
      this.cssController.updateVariables(consciousnessVariables, 'normal', 'consciousness-accent-integration');
    }
  }

  /**
   * Update consciousness with music energy using coordinated updates
   */
  private async updateConsciousnessWithMusicEnergy(energy: number): Promise<void> {
    const adjustedEnergy = energy * this.integrationConfig.energyResponseMultiplier;
    
    // Update consciousness intensity based on energy
    const baseIntensity = 0.5;
    const consciousnessIntensity = Math.max(0.1, Math.min(1.0, baseIntensity + adjustedEnergy * 0.3));
    
    const musicEnergyVariables: Record<string, string> = {
      '--musical-sync-intensity': adjustedEnergy.toString(),
      '--holographic-music-flicker-intensity': adjustedEnergy.toString(),
      '--consciousness-intensity': consciousnessIntensity.toString()
    };

    if (this.cssController) {
      this.cssController.updateVariables(musicEnergyVariables, 'high', 'consciousness-music-energy');
      
      // Also update consciousness intensity using the simplified coordination method
      this.cssController.updateConsciousnessIntensity(
        parseFloat(consciousnessIntensity.toString()),
        'DynamicCatppuccinStrategy',
        adjustedEnergy
      );
    }
  }

  /**
   * Get current dynamic color state for debugging
   */
  public getDynamicColorState(): DynamicColorState {
    return { ...this.dynamicColorState };
  }

  /**
   * Update integration configuration
   */
  public updateConfig(newConfig: Partial<CatppuccinIntegrationConfig>): void {
    this.integrationConfig = { ...this.integrationConfig, ...newConfig };
    
    // Update OKLAB processor debug setting if configuration changed
    if ('oklabEnhancementEnabled' in newConfig || 'oklabPreset' in newConfig) {
      this.oklabProcessor = new OKLABColorProcessor(this.config.enableDebug);
    }
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Configuration updated:', {
      ...newConfig,
      oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
      oklabPreset: this.integrationConfig.oklabPreset
    });
  }

  /**
   * Health check for strategy status
   */
  public async healthCheck(): Promise<any> {
    const isDynamicEnabled = this.checkDynamicAccentEnabled();
    const hasRecentUpdate = (Date.now() - this.dynamicColorState.lastUpdateTime) < 30000; // 30s
    
    return {
      healthy: isDynamicEnabled,
      canProcess: isDynamicEnabled,
      issues: !isDynamicEnabled 
        ? ['Dynamic accent not enabled in settings']
        : [],
      metrics: {
        dynamicAccentEnabled: isDynamicEnabled,
        currentAccent: this.dynamicColorState.currentAccentHex,
        lastUpdateAge: Date.now() - this.dynamicColorState.lastUpdateTime,
        hasRecentUpdate,
        transitionInProgress: this.dynamicColorState.transitionInProgress,
        musicEnergy: this.dynamicColorState.musicEnergy,
        oklabProcessing: this.integrationConfig.oklabEnhancementEnabled,
        oklabPreset: this.integrationConfig.oklabPreset,
        consciousnessIntegration: this.integrationConfig.consciousnessIntegrationEnabled
      }
    };
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    // Clear any active transitions
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = 0;
    }
    
    this.dynamicColorState.transitionInProgress = false;
    
    Y3K?.debug?.log('DynamicCatppuccinStrategy', 'Dynamic Catppuccin strategy destroyed');
  }
}