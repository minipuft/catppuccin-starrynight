/**
 * ColorStateManager - Unified Color State Coordination
 * 
 * Central component that manages the combination of Catppuccin flavor, brightness mode,
 * accent color selection, and dynamic album art colors. Provides the single source of truth
 * for all color decisions in the Year 3000 System.
 * 
 * @architecture Year3000System integration with event-driven updates
 * @performance Efficient CSS variable batching with change detection
 */

import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from '@/core/performance/OptimizedCSSVariableManager';
import { SettingsManager } from '@/ui/managers/SettingsManager';
import type { IManagedSystem, HealthCheckResult } from '@/types/systems';
import {
  paletteSystemManager,
  getBrightnessAdjustedBaseColor,
  getBrightnessAdjustedSurfaceColor,
  getAccentColor,
  getDefaultAccentColor,
  type UnifiedFlavor,
  type UnifiedColorName,
  type UnifiedColor,
  type UnifiedPalette
} from '@/utils/color/PaletteSystemManager';

export interface ColorStateConfig {
  paletteSystemFlavor: UnifiedFlavor;
  brightnessMode: 'bright' | 'balanced' | 'dark';
  accentColor: UnifiedColorName | 'dynamic';
  dynamicAlbumColors?: {
    primary: UnifiedColor;
    secondary: UnifiedColor;
    accent: UnifiedColor;
  };
  preserveAlbumArt: boolean;
  enableTransitions: boolean;
}

export interface ColorStateResult {
  baseColor: UnifiedColor;
  surfaceColor: UnifiedColor;
  accentColor: UnifiedColor;
  textColor: UnifiedColor;
  effectiveConfig: ColorStateConfig;
  timestamp: number;
}

/**
 * Event types for color state changes
 */
export interface ColorStateEvents {
  'colorState:changed': {
    oldState: ColorStateResult | null;
    newState: ColorStateResult;
    trigger: 'settings' | 'albumArt' | 'initialization' | 'brightness' | 'flavor' | 'accent';
  };
  'colorState:cssVariablesUpdated': {
    variablesCount: number;
    updateDuration: number;
    verificationPassed?: boolean;
  };
  'colorState:flavorChanged': {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
  'colorState:brightnessChanged': {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
  'colorState:accentChanged': {
    settingKey: string;
    newValue: any;
    oldValue: any;
    timestamp: number;
  };
}

export class ColorStateManager implements IManagedSystem {
  public initialized = false;
  private settingsManager: SettingsManager | null = null;
  private currentState: ColorStateResult | null = null;
  private isUpdating = false;
  
  // 🔧 PHASE 2: CSS Authority Consolidation - Single Optimized Controller
  private cssController!: OptimizedCSSVariableManager;
  
  // Performance tracking
  private updateCount = 0;
  private lastUpdateTime = 0;
  
  constructor(settingsManager?: SettingsManager) {
    this.settingsManager = settingsManager || null;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize CSS controller - use globalThis to access Year3000System
    const year3000System = (globalThis as any).year3000System;
    this.cssController = year3000System?.cssConsciousnessController || 
                        getGlobalOptimizedCSSController();

    // Listen for settings changes
    unifiedEventBus.subscribe('settings:changed', this.handleSettingsChange.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to all color processing events as single CSS authority
    unifiedEventBus.subscribe('colors:harmonized', this.handleProcessedColors.bind(this), 'ColorStateManager');
    unifiedEventBus.subscribe('colors:extracted', this.handleExtractedColors.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to consciousness and music events for dynamic CSS
    unifiedEventBus.subscribe('consciousness:updated', this.handleConsciousnessUpdate.bind(this), 'ColorStateManager');
    unifiedEventBus.subscribe('music:energy', this.handleMusicEnergyUpdate.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to CSS variable events from other systems
    unifiedEventBus.subscribe('system:css-variables' as any, this.handleSystemCSSVariables.bind(this), 'ColorStateManager');

    // Get settings manager if not provided
    if (!this.settingsManager) {
      this.settingsManager = (globalThis as any).__SN_settingsManager || 
                             (globalThis as any).Y3K?.system?.settingsManager;
    }

    if (this.settingsManager) {
      // Apply initial color state
      await this.applyInitialColorState();
    }

    this.initialized = true;
    console.log('🎨 [ColorStateManager] Initialized successfully');
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    if (!this.settingsManager) {
      issues.push('SettingsManager not available');
    }
    
    if (!this.currentState) {
      issues.push('No current color state');
    }

    if (this.updateCount === 0) {
      issues.push('No color updates performed yet');
    }

    const timeSinceLastUpdate = Date.now() - this.lastUpdateTime;
    if (timeSinceLastUpdate > 300000) { // 5 minutes
      issues.push(`Last update was ${Math.round(timeSinceLastUpdate / 1000)}s ago`);
    }

    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: `Color state manager - ${this.updateCount} updates performed`,
      issues,
      system: 'ColorStateManager'
    };
  }

  public updateAnimation(deltaTime: number): void {
    // No animation updates needed for color state management
  }

  public destroy(): void {
    unifiedEventBus.unsubscribeAll('ColorStateManager');
    
    // CSS controller cleanup is handled by the system coordinator
    
    this.currentState = null;
    this.initialized = false;
  }

  /**
   * Get current color state configuration from settings
   */
  private getCurrentConfig(): ColorStateConfig {
    if (!this.settingsManager) {
      // Fallback to safe defaults using current palette system
      const defaultFlavor = paletteSystemManager.getCurrentDefaultFlavor();
      return {
        paletteSystemFlavor: defaultFlavor,
        brightnessMode: 'dark', // Updated to use corrected default
        accentColor: 'mauve' as UnifiedColorName,
        preserveAlbumArt: true,
        enableTransitions: true
      };
    }

    // Get the current flavor from settings, or use palette system default
    const settingsFlavor = this.settingsManager.get('catppuccin-flavor');
    const currentFlavor = settingsFlavor as UnifiedFlavor || paletteSystemManager.getCurrentDefaultFlavor();

    return {
      paletteSystemFlavor: currentFlavor,
      brightnessMode: this.settingsManager.get('sn-brightness-mode') as 'bright' | 'balanced' | 'dark',
      accentColor: this.settingsManager.get('catppuccin-accentColor') as UnifiedColorName | 'dynamic',
      preserveAlbumArt: true, // TODO: Add setting for this
      enableTransitions: true
    };
  }

  /**
   * Calculate the effective color state based on current configuration
   */
  private calculateColorState(config: ColorStateConfig): ColorStateResult {
    const { paletteSystemFlavor, brightnessMode, accentColor, dynamicAlbumColors } = config;

    // Get brightness-adjusted base and surface colors using unified system
    const baseColor = getBrightnessAdjustedBaseColor(paletteSystemFlavor, brightnessMode);
    const surfaceColor = getBrightnessAdjustedSurfaceColor(paletteSystemFlavor, brightnessMode);

    // Determine accent color using unified system
    let effectiveAccentColor: UnifiedColor;
    if (accentColor === 'dynamic' && dynamicAlbumColors) {
      effectiveAccentColor = dynamicAlbumColors.accent;
    } else if (accentColor === 'dynamic') {
      effectiveAccentColor = getDefaultAccentColor(paletteSystemFlavor);
    } else {
      effectiveAccentColor = getAccentColor(accentColor, paletteSystemFlavor);
    }

    // Get appropriate text color from current palette system
    const currentPalette = paletteSystemManager.getCurrentPalette();
    const flavorPalette = currentPalette[paletteSystemFlavor];
    if (!flavorPalette) {
      throw new Error(`Flavor '${paletteSystemFlavor}' not found in current palette system`);
    }
    const textColor = flavorPalette['text' as keyof typeof flavorPalette] as UnifiedColor;

    return {
      baseColor,
      surfaceColor,
      accentColor: effectiveAccentColor,
      textColor,
      effectiveConfig: config,
      timestamp: Date.now()
    };
  }

  /**
   * 🔧 PHASE 2: Enhanced CSS application with batching and priority support
   * Apply color state to CSS variables with batching optimization
   */
  private async applyColorStateToCSSVariables(state: ColorStateResult): Promise<void> {
    const startTime = performance.now();
    
    const cssUpdates = {
      // === CRITICAL PRIORITY: Core color variables ===
      '--sn-cosmic-base-hex': state.baseColor.hex,
      '--sn-cosmic-accent-hex': state.accentColor.hex,
      '--spice-accent': state.accentColor.hex,
      '--spice-base': state.baseColor.hex,
      
      // === HIGH PRIORITY: Primary gradients and surfaces ===
      '--sn-color-base-hex': state.baseColor.hex,
      '--sn-color-base-rgb': state.baseColor.rgb,
      '--sn-color-surface-hex': state.surfaceColor.hex,
      '--sn-color-surface-rgb': state.surfaceColor.rgb,
      '--sn-color-accent-hex': state.accentColor.hex,
      '--sn-color-accent-rgb': state.accentColor.rgb,
      '--sn-dynamic-accent-hex': state.accentColor.hex,
      '--sn-dynamic-accent-rgb': state.accentColor.rgb,
      
      // === NORMAL PRIORITY: Extended color systems ===
      '--sn-cosmic-base-rgb': state.baseColor.rgb,
      '--sn-cosmic-surface-hex': state.surfaceColor.hex,
      '--sn-cosmic-surface-rgb': state.surfaceColor.rgb,
      '--sn-cosmic-accent-rgb': state.accentColor.rgb,
      '--sn-color-text-hex': state.textColor.hex,
      '--sn-color-text-rgb': state.textColor.rgb,
      '--sn-cosmic-text-hex': state.textColor.hex,
      '--sn-cosmic-text-rgb': state.textColor.rgb,
      
      // === NORMAL PRIORITY: Spicetify compatibility ===
      '--spice-surface1': state.surfaceColor.hex,
      '--spice-text': state.textColor.hex,
      '--spice-rgb-base': state.baseColor.rgb,
      '--spice-rgb-surface1': state.surfaceColor.rgb,
      '--spice-rgb-accent': state.accentColor.rgb,
      '--spice-rgb-text': state.textColor.rgb,
      
      // === NORMAL PRIORITY: Gradient system integration ===
      '--sn-bg-gradient-primary-rgb': state.accentColor.rgb,
      '--sn-bg-gradient-secondary-rgb': state.surfaceColor.rgb,
      '--sn-bg-gradient-accent-rgb': state.accentColor.rgb,
      
      // === LOW PRIORITY: Meta information for debugging ===
      '--sn-color-state-flavor': `"${state.effectiveConfig.paletteSystemFlavor}"`,
      '--sn-color-state-brightness': `"${state.effectiveConfig.brightnessMode}"`,
      '--sn-color-state-accent': `"${state.effectiveConfig.accentColor}"`,
      '--sn-color-state-palette-system': `"${paletteSystemManager.getCurrentPaletteSystem()}"`,
      '--sn-color-state-timestamp': state.timestamp.toString()
    };

    // Apply CSS variables through OptimizedCSSVariableManager with intelligent priority grouping
    await this.applyColorVariablesWithPriorities(cssUpdates);

    const endTime = performance.now();
    const updateDuration = endTime - startTime;

    console.log(`🎨 [ColorStateManager] Applied ${Object.keys(cssUpdates).length} CSS variables in ${updateDuration.toFixed(2)}ms (via OptimizedCSSVariableManager)`);
  }

  /**
   * Apply color variables through OptimizedCSSVariableManager with intelligent priority grouping
   */
  private async applyColorVariablesWithPriorities(cssUpdates: Record<string, string>): Promise<void> {
    // Group variables by priority for optimized coordination
    const criticalVars = ['--sn-cosmic-base-hex', '--sn-cosmic-accent-hex', '--spice-accent', '--spice-base'];
    const highPriorityVars = ['--sn-color-', '--sn-dynamic-accent-'];
    
    const criticalUpdates: Record<string, string> = {};
    const highPriorityUpdates: Record<string, string> = {};
    const normalUpdates: Record<string, string> = {};
    const lowPriorityUpdates: Record<string, string> = {};

    // Group variables by priority
    Object.entries(cssUpdates).forEach(([property, value]) => {
      if (criticalVars.some(prefix => property.includes(prefix))) {
        criticalUpdates[property] = value;
      } else if (highPriorityVars.some(prefix => property.includes(prefix))) {
        highPriorityUpdates[property] = value;
      } else if (property.includes('state-') || property.includes('timestamp')) {
        lowPriorityUpdates[property] = value;
      } else {
        normalUpdates[property] = value;
      }
    });

    // Apply updates in separate batches by priority using OptimizedCSSVariableManager
    if (Object.keys(criticalUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        criticalUpdates,
        "critical",
        "color-state-critical"
      );
    }

    if (Object.keys(highPriorityUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        highPriorityUpdates,
        "high",
        "color-state-high"
      );
    }

    if (Object.keys(normalUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        normalUpdates,
        "normal",
        "color-state-normal"
      );
    }

    if (Object.keys(lowPriorityUpdates).length > 0) {
      this.cssController.batchSetVariables(
        "ColorStateManager",
        lowPriorityUpdates,
        "low",
        "color-state-meta"
      );
    }
  }

  /**
   * 🔧 PHASE 2: Generic method for other systems to queue CSS updates through ColorStateManager using coordination
   * This makes ColorStateManager the single CSS authority for all color-related variables
   */
  public queueCSSVariableUpdate(property: string, value: string, priority: 'critical' | 'high' | 'normal' | 'low' = 'normal'): void {
    // Use coordination-first approach with proper priority mapping
    const mappedPriority: "low" | "normal" | "high" | "critical" = priority === 'critical' ? 'critical' : 
                                           priority === 'high' ? 'high' :
                                           priority === 'low' ? 'low' : 'normal';
    
    this.cssController.setVariable(
      "ColorStateManager",
      property,
      value,
      mappedPriority,
      "color-state-queue"
    );
  }

  // All CSS variable updates now handled directly through OptimizedCSSVariableManager

  /**
   * Verify that critical CSS variables were actually applied to the DOM
   */
  private async verifyCSSVariablesApplied(cssUpdates: Record<string, string>): Promise<boolean> {
    // Check a few critical variables to ensure they were applied
    const criticalVars = [
      '--sn-cosmic-base-hex',
      '--sn-cosmic-accent-hex',
      '--spice-base'
    ];

    for (const varName of criticalVars) {
      if (cssUpdates[varName]) {
        const computedValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        const expectedValue = cssUpdates[varName];
        
        if (computedValue !== expectedValue) {
          console.warn(`🎨 [ColorStateManager] Variable verification failed: ${varName} = "${computedValue}" (expected "${expectedValue}")`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Update color state with change detection
   */
  public async updateColorState(
    trigger: 'settings' | 'albumArt' | 'initialization' | 'brightness' | 'flavor' | 'accent' = 'settings'
  ): Promise<void> {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    try {
      const config = this.getCurrentConfig();
      const newState = this.calculateColorState(config);
      
      // Check if state actually changed
      const hasChanged = !this.currentState || 
        this.currentState.baseColor.hex !== newState.baseColor.hex ||
        this.currentState.surfaceColor.hex !== newState.surfaceColor.hex ||
        this.currentState.accentColor.hex !== newState.accentColor.hex ||
        this.currentState.effectiveConfig.paletteSystemFlavor !== newState.effectiveConfig.paletteSystemFlavor ||
        this.currentState.effectiveConfig.brightnessMode !== newState.effectiveConfig.brightnessMode;

      if (hasChanged) {
        const oldState = this.currentState;
        
        // Apply to CSS variables
        await this.applyColorStateToCSSVariables(newState);
        
        // Update state
        this.currentState = newState;
        this.updateCount++;
        this.lastUpdateTime = Date.now();
        
        // Emit change event
        unifiedEventBus.emit('colors:applied' as any, {
          oldState,
          newState,
          trigger,
          cssVariables: {
            '--sn-cosmic-base-hex': newState.baseColor.hex,
            '--sn-cosmic-accent-hex': newState.accentColor.hex
          },
          accentHex: newState.accentColor.hex,
          accentRgb: newState.accentColor.rgb,
          appliedAt: Date.now()
        });

        console.log(`🎨 [ColorStateManager] Color state updated (${trigger}):`, {
          flavor: newState.effectiveConfig.paletteSystemFlavor,
          brightness: newState.effectiveConfig.brightnessMode,
          accent: newState.effectiveConfig.accentColor,
          paletteSystem: paletteSystemManager.getCurrentPaletteSystem(),
          base: newState.baseColor.hex,
          surface: newState.surfaceColor.hex,
          accentHex: newState.accentColor.hex
        });
      }
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Apply initial color state during system initialization
   */
  public async applyInitialColorState(): Promise<void> {
    await this.updateColorState('initialization');
  }

  /**
   * Handle settings changes
   */
  private async handleSettingsChange(event: any): Promise<void> {
    const { settingKey, newValue, oldValue } = event;
    
    if (['catppuccin-flavor', 'sn-brightness-mode', 'catppuccin-accentColor'].includes(settingKey)) {
      let trigger: 'settings' | 'brightness' | 'flavor' | 'accent' = 'settings';
      
      if (settingKey === 'catppuccin-flavor') trigger = 'flavor';
      else if (settingKey === 'sn-brightness-mode') trigger = 'brightness';
      else if (settingKey === 'catppuccin-accentColor') trigger = 'accent';
      
      // Emit specific setting change events for targeted system updates
      unifiedEventBus.emit(`colorState:${trigger}Changed` as any, {
        settingKey,
        newValue,
        oldValue,
        timestamp: Date.now()
      });
      
      await this.updateColorState(trigger);
    }
  }

  /**
   * 🔧 PHASE 2: Handle processed color events from unified color processing
   * This replaces individual CSS application in ColorHarmonyEngine and orchestrators
   */
  private async handleProcessedColors(event: any): Promise<void> {
    const { processedColors, accentHex, accentRgb, strategies, coordinationMetrics } = event;
    
    // Apply processed colors to CSS variables through our batching system
    const colorVariables: Record<string, string> = {};
    
    // Convert processed colors to CSS variables
    Object.entries(processedColors as Record<string, string>).forEach(([key, value]) => {
      if (value) {
        const cssVar = key.startsWith('--') ? key : `--sn-${key.toLowerCase().replace(/_/g, '-')}`;
        colorVariables[cssVar] = value;
      }
    });
    
    // Add primary accent colors
    if (accentHex) {
      colorVariables['--sn-accent-hex'] = accentHex;
      colorVariables['--sn-processed-accent-hex'] = accentHex;
    }
    if (accentRgb) {
      colorVariables['--sn-accent-rgb'] = accentRgb;
      colorVariables['--sn-processed-accent-rgb'] = accentRgb;
    }
    
    // Add coordination metrics as CSS variables for debugging
    if (coordinationMetrics) {
      if (coordinationMetrics.emotionalState) {
        colorVariables['--sn-emotional-state'] = `"${coordinationMetrics.emotionalState}"`;
      }
      if (coordinationMetrics.musicInfluenceStrength !== undefined) {
        colorVariables['--sn-music-influence'] = coordinationMetrics.musicInfluenceStrength.toFixed(3);
      }
    }
    
    // Apply all color variables with appropriate priorities
    Object.entries(colorVariables).forEach(([property, value]) => {
      let priority: 'critical' | 'high' | 'normal' | 'low' = 'normal';
      
      if (property.includes('accent-hex') || property.includes('accent-rgb')) {
        priority = 'high';
      } else if (property.includes('debug') || property.includes('state') || property.includes('influence')) {
        priority = 'low';
      }
      
      this.queueCSSVariableUpdate(property, value, priority);
    });
    
    console.log(`🎨 [ColorStateManager] Applied ${Object.keys(colorVariables).length} processed color variables`);
  }

  /**
   * 🔧 PHASE 2: Handle extracted colors from album art
   */
  private async handleExtractedColors(event: any): Promise<void> {
    const { rawColors, trackUri, musicData } = event;
    
    // Apply raw colors as CSS variables for systems that need them
    const extractedVariables: Record<string, string> = {};
    
    Object.entries(rawColors as Record<string, string>).forEach(([key, value]) => {
      if (value) {
        extractedVariables[`--sn-extracted-${key.toLowerCase()}`] = value;
      }
    });
    
    // Add track information
    if (trackUri) {
      extractedVariables['--sn-current-track-id'] = `"${trackUri}"`;
    }
    
    // Apply with low priority since these are raw, unprocessed colors
    Object.entries(extractedVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, 'low');
    });
  }

  /**
   * 🔧 PHASE 2: Handle consciousness updates and apply consciousness CSS variables
   */
  private async handleConsciousnessUpdate(event: any): Promise<void> {
    const { payload } = event;
    
    if (!payload) return;
    
    const consciousnessVariables: Record<string, string> = {
      '--sn-consciousness-level': (payload.consciousnessLevel || 0).toFixed(3),
      '--sn-emotional-temperature': (payload.emotionalTemperature || 6500).toString(),
      '--sn-transcendence-level': (payload.transcendenceLevel || 0).toFixed(3),
      '--sn-volumetric-depth': (payload.volumetricDepth || 0).toFixed(3),
      '--sn-data-stream-intensity': (payload.dataStreamIntensity || 0).toFixed(3),
      '--sn-cosmic-resonance': (payload.cosmicResonance || 0).toFixed(3)
    };
    
    // Apply consciousness variables with normal priority
    Object.entries(consciousnessVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, 'normal');
    });
  }

  /**
   * 🔧 PHASE 2: Handle music energy updates for dynamic CSS variables
   */
  private async handleMusicEnergyUpdate(event: any): Promise<void> {
    const { energy, valence, tempo } = event;
    
    const musicVariables: Record<string, string> = {};
    
    if (energy !== undefined) {
      musicVariables['--sn-music-energy'] = energy.toFixed(3);
    }
    if (valence !== undefined) {
      musicVariables['--sn-music-valence'] = valence.toFixed(3);
    }
    if (tempo !== undefined) {
      musicVariables['--sn-music-tempo'] = tempo.toString();
    }
    
    // Apply music variables with high priority for responsive effects
    Object.entries(musicVariables).forEach(([property, value]) => {
      this.queueCSSVariableUpdate(property, value, 'high');
    });
  }

  /**
   * 🔧 PHASE 2: Handle CSS variable events from other systems (ColorHarmonyEngine, etc.)
   * This makes ColorStateManager the single CSS authority for all systems
   */
  private async handleSystemCSSVariables(event: any): Promise<void> {
    const { source, variables, timestamp } = event;
    
    if (!variables || typeof variables !== 'object') return;
    
    // Apply variables from other systems with appropriate priorities
    Object.entries(variables as Record<string, string>).forEach(([property, value]) => {
      let priority: 'critical' | 'high' | 'normal' | 'low' = 'normal';
      
      // Harmony and animation variables are high priority for smooth effects
      if (property.includes('harmony') || property.includes('glow') || property.includes('pulse')) {
        priority = 'high';
      } else if (property.includes('debug') || property.includes('breathing')) {
        priority = 'low';
      }
      
      this.queueCSSVariableUpdate(property, value, priority);
    });
    
    console.log(`🎨 [ColorStateManager] Applied ${Object.keys(variables).length} CSS variables from ${source}`);
  }

  /**
   * Get current color state (read-only)
   */
  public getCurrentState(): ColorStateResult | null {
    return this.currentState ? { ...this.currentState } : null;
  }

  /**
   * Force refresh of color state
   */
  public async refresh(): Promise<void> {
    await this.updateColorState('settings');
  }
}

// Global instance
export const globalColorStateManager = new ColorStateManager();