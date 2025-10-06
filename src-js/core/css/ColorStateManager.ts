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

import { settings } from '@/config';
import { unifiedEventBus } from '@/core/events/EventBus';
import { CSSVariableWriter, getGlobalCSSVariableWriter } from '@/core/css/CSSVariableWriter';
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

/**
 * 🔧 PHASE 3: CSS Color Controller - Single CSS Write Authority
 *
 * ARCHITECTURAL ROLE: CSS Authority - OWNS all CSS variable writes for color system
 * - Subscribes to: colors:harmonized, colors:extracted events
 * - Manages: Color state, brightness modes, flavor coordination
 * - OWNS: ALL CSS variable writes via CSSVariableWriter
 * - Coordinates: SpicetifyColorBridge for Spicetify integration
 * - Emits: colors:applied event after CSS application
 *
 * SINGLE RESPONSIBILITY: CSS variable management and color state coordination
 * - NO color processing (delegated to OKLABColorProcessor)
 * - NO event routing (delegated to ColorEventOrchestrator)
 * - Pure CSS write authority with state management
 *
 * @class CSSColorController
 * @implements {IManagedSystem}
 */
export class CSSColorController implements IManagedSystem {
  public initialized = false;
  private currentState: ColorStateResult | null = null;
  private isUpdating = false;

  // 🔧 PHASE 3: CSS Authority - Single Unified Controller
  private cssController!: CSSVariableWriter;

  // Performance tracking
  private updateCount = 0;
  private lastUpdateTime = 0;

  constructor() {
    // No settingsManager needed - using typed settings
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize CSS controller - use globalThis to access Year3000System
    const year3000System = (globalThis as any).year3000System;
    this.cssController = year3000System?.cssController ||
                        getGlobalCSSVariableWriter();

    // Listen for settings changes
    unifiedEventBus.subscribe('settings:changed', this.handleSettingsChange.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to all color processing events as single CSS authority
    unifiedEventBus.subscribe('colors:harmonized', this.handleProcessedColors.bind(this), 'ColorStateManager');
    unifiedEventBus.subscribe('colors:extracted', this.handleExtractedColors.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to visual-effects and music events for dynamic CSS
    unifiedEventBus.subscribe('visual-effects:state-updated', this.handleVisualEffectsUpdate.bind(this), 'ColorStateManager');
    unifiedEventBus.subscribe('music:energy', this.handleMusicEnergyUpdate.bind(this), 'ColorStateManager');
    
    // 🔧 PHASE 2: Subscribe to CSS variable events from other systems
    unifiedEventBus.subscribe('system:css-variables' as any, this.handleSystemCSSVariables.bind(this), 'ColorStateManager');

    // Apply initial color state using typed settings
    await this.applyInitialColorState();

    this.initialized = true;
    console.log('🎨 [ColorStateManager] Initialized successfully');
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];

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
    // Get the current flavor from settings, or use palette system default
    const settingsFlavor = settings.get('catppuccin-flavor');
    const currentFlavor = settingsFlavor as UnifiedFlavor || paletteSystemManager.getCurrentDefaultFlavor();

    return {
      paletteSystemFlavor: currentFlavor,
      brightnessMode: settings.get('sn-brightness-mode') as 'bright' | 'balanced' | 'dark',
      accentColor: settings.get('catppuccin-accentColor') as UnifiedColorName | 'dynamic',
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

      // === HIGH PRIORITY: Brightness mode application ===
      '--sn-brightness-mode': `"${state.effectiveConfig.brightnessMode}"`,
      '--sn-brightness-data-attr': state.effectiveConfig.brightnessMode,

      // === LOW PRIORITY: Meta information for debugging ===
      '--sn-color-state-flavor': `"${state.effectiveConfig.paletteSystemFlavor}"`,
      '--sn-color-state-brightness': `"${state.effectiveConfig.brightnessMode}"`,
      '--sn-color-state-accent': `"${state.effectiveConfig.accentColor}"`,
      '--sn-color-state-palette-system': `"${paletteSystemManager.getCurrentPaletteSystem()}"`,
      '--sn-color-state-timestamp': state.timestamp.toString()
    };

    // Apply CSS variables through CSSVariableWriter with intelligent priority grouping
    await this.applyColorVariablesWithPriorities(cssUpdates);

    const endTime = performance.now();
    const updateDuration = endTime - startTime;

    console.log(`🎨 [ColorStateManager] Applied ${Object.keys(cssUpdates).length} CSS variables in ${updateDuration.toFixed(2)}ms (via CSSVariableWriter)`);
  }

  /**
   * Apply color variables through CSSVariableWriter with intelligent priority grouping
   */
  private async applyColorVariablesWithPriorities(cssUpdates: Record<string, string>): Promise<void> {
    // Group variables by priority for optimized coordination
    const criticalVars = ['--sn-cosmic-base-hex', '--sn-cosmic-accent-hex', '--spice-accent', '--spice-base'];
    const highPriorityVars = ['--sn-color-', '--sn-dynamic-accent-', '--sn-brightness-mode', '--sn-brightness-data-attr'];
    
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

    // Apply updates in separate batches by priority using CSSVariableWriter
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

  // All CSS variable updates now handled directly through CSSVariableWriter

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

        // Apply brightness mode overrides to ensure they take precedence over base colors
        await this.applyBrightnessModeOverrides(newState.effectiveConfig.brightnessMode);

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
   * Apply brightness mode specific CSS variables that take precedence over base colors
   */
  private async applyBrightnessModeOverrides(brightnessMode: 'bright' | 'balanced' | 'dark'): Promise<void> {
    // Get brightness-adjusted accent color using default accent for current brightness mode
    const config = this.getCurrentConfig();
    const defaultAccent = getDefaultAccentColor(config.paletteSystemFlavor);

    // Apply brightness adjustment to the accent color by modifying RGB values
    let adjustedAccentColor = defaultAccent;

    // For accent colors, we adjust saturation/brightness similarly to CSS multipliers
    if (brightnessMode === 'dark') {
      // Dark mode: reduce brightness/saturation for less bright colors
      const rgbValues = defaultAccent.rgb.split(', ').map(Number);
      if (rgbValues.length === 3 && rgbValues.every(val => !isNaN(val) && val !== undefined)) {
        const r = rgbValues[0]!;
        const g = rgbValues[1]!;
        const b = rgbValues[2]!;
        const darkR = Math.floor(r * 0.85);
        const darkG = Math.floor(g * 0.85);
        const darkB = Math.floor(b * 0.85);
        adjustedAccentColor = {
          ...defaultAccent,
          rgb: `${darkR}, ${darkG}, ${darkB}`,
          hex: `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`
        };
      }
    } else if (brightnessMode === 'bright') {
      // Bright mode: increase vibrancy but not raw brightness
      const rgbValues = defaultAccent.rgb.split(', ').map(Number);
      if (rgbValues.length === 3 && rgbValues.every(val => !isNaN(val) && val !== undefined)) {
        const r = rgbValues[0]!;
        const g = rgbValues[1]!;
        const b = rgbValues[2]!;
        const brightR = Math.min(255, Math.floor(r * 1.1));
        const brightG = Math.min(255, Math.floor(g * 1.1));
        const brightB = Math.min(255, Math.floor(b * 1.1));
        adjustedAccentColor = {
          ...defaultAccent,
          rgb: `${brightR}, ${brightG}, ${brightB}`,
          hex: `#${brightR.toString(16).padStart(2, '0')}${brightG.toString(16).padStart(2, '0')}${brightB.toString(16).padStart(2, '0')}`
        };
      }
    }
    // balanced mode uses default accent as-is

    // These CSS variables ensure the brightness mode affects all visual processing
    const brightnessOverrides = {
      // Core brightness mode state (highest priority)
      '--sn-brightness-mode': `"${brightnessMode}"`,
      '--sn-brightness-data-attr': brightnessMode,

      // Brightness-adjusted accent color (critical for proper color hierarchy)
      '--sn-brightness-adjusted-accent-hex': adjustedAccentColor.hex,
      '--sn-brightness-adjusted-accent-rgb': adjustedAccentColor.rgb,

      // CSS gradient adjustments based on brightness mode
      '--sn-bg-gradient-saturation': `var(--sn-brightness-${brightnessMode}-saturation)`,
      '--sn-bg-gradient-brightness': `var(--sn-brightness-${brightnessMode}-brightness)`,
      '--sn-bg-gradient-contrast': `var(--sn-brightness-${brightnessMode}-contrast)`,
      '--sn-bg-gradient-opacity': `var(--sn-brightness-${brightnessMode}-opacity)`,
    };

    // Apply brightness overrides with critical priority to ensure they take precedence
    this.cssController.batchSetVariables(
      "ColorStateManager",
      brightnessOverrides,
      "critical",
      "brightness-mode-overrides"
    );

    console.log(`🎨 [ColorStateManager] Applied brightness mode overrides: ${brightnessMode}`);
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
    const { processedColors, cssVariables, accentHex, accentRgb, strategies, coordinationMetrics, timestamp } = event;

    // 🔧 PHASE 2: CSS Authority Pattern
    // ColorStateManager is the SINGLE source of truth for ALL CSS variable writes
    const colorVariables: Record<string, string> = {};

    // 🔧 PHASE 2: Prefer pre-generated CSS variables from processor (OKLABColorProcessor)
    if (cssVariables && typeof cssVariables === 'object') {
      // Use complete CSS variable set from pure processor
      Object.assign(colorVariables, cssVariables);
    } else {
      // Fallback: Convert processed colors to CSS variables (legacy compatibility)
      Object.entries(processedColors as Record<string, string>).forEach(([key, value]) => {
        if (value) {
          const cssVar = key.startsWith('--') ? key : `--sn-${key.toLowerCase().replace(/_/g, '-')}`;
          colorVariables[cssVar] = value;
        }
      });
    }

    // Ensure primary accent colors are always set (critical for Year3000 system)
    if (accentHex) {
      colorVariables['--sn-accent-hex'] = accentHex;
      colorVariables['--sn-processed-accent-hex'] = accentHex;
      colorVariables['--sn-color-accent-hex'] = accentHex;
    }
    if (accentRgb) {
      colorVariables['--sn-accent-rgb'] = accentRgb;
      colorVariables['--sn-processed-accent-rgb'] = accentRgb;
      colorVariables['--sn-color-accent-rgb'] = accentRgb;
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

    // 🔧 PHASE 2: Emit colors:applied event for UI components needing immediate notification
    unifiedEventBus.emitSync('colors:applied', {
      cssVariables: colorVariables,
      accentHex: accentHex || colorVariables['--sn-accent-hex'],
      accentRgb: accentRgb || colorVariables['--sn-accent-rgb'],
      strategies: strategies || ['OKLABColorProcessor'],
      appliedAt: timestamp || Date.now()
    });

    console.log(`🎨 [ColorStateManager] Applied ${Object.keys(colorVariables).length} processed color variables from ${strategies?.join(', ') || 'OKLABColorProcessor'}`);
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
   * 🔧 PHASE 2: Handle visual-effects updates and apply visual-effects CSS variables
   */
  private async handleVisualEffectsUpdate(event: any): Promise<void> {
    const { payload } = event;
    
    if (!payload) return;
    
    const visualEffectsVariables: Record<string, string> = {
      '--sn-visual-effects-level': (payload.visualEffectsLevel || 0).toFixed(3),
      '--sn-emotional-temperature': (payload.emotionalTemperature || 6500).toString(),
      '--sn-transcendence-level': (payload.transcendenceLevel || 0).toFixed(3),
      '--sn-volumetric-depth': (payload.volumetricDepth || 0).toFixed(3),
      '--sn-data-stream-intensity': (payload.dataStreamIntensity || 0).toFixed(3),
      '--sn-cosmic-resonance': (payload.cosmicResonance || 0).toFixed(3)
    };
    
    // Apply visual-effects variables with normal priority
    Object.entries(visualEffectsVariables).forEach(([property, value]) => {
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
      } else if (property.includes('debug') || property.includes('animation')) {
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

// =============================================================================
// BACKWARD COMPATIBILITY ALIASES
// =============================================================================

/**
 * @deprecated Use CSSColorController instead. This alias is provided for backward compatibility.
 * Will be removed in a future version after all imports are updated.
 *
 * ColorStateManager has been renamed to CSSColorController to better reflect its role
 * as the single CSS write authority in the architecture.
 *
 * Migration path:
 * ```typescript
 * // Old (deprecated)
 * import { ColorStateManager } from '@/core/css/ColorStateManager';
 *
 * // New (recommended)
 * import { CSSColorController } from '@/core/css/ColorStateManager';
 * // or: import { CSSColorController as ColorStateManager } from '@/core/css/ColorStateManager';
 * ```
 */
export const ColorStateManager = CSSColorController;

/**
 * @deprecated Use CSSColorController type instead. This type alias is provided for backward compatibility.
 * Will be removed in a future version after all type annotations are updated.
 */
export type ColorStateManager = CSSColorController;

// Global instance
export const globalColorStateManager = new CSSColorController();