/**
 * DynamicCatppuccinBridge - Phase 2.1 Dynamic Color Integration
 * 
 * Bridges ColorHarmonyEngine extracted colors to Catppuccin dynamic accent system
 * enabling real-time sync between album art extraction and consciousness effects.
 * 
 * Philosophy: "Living color systems that breathe with musical consciousness while
 * preserving Catppuccin's aesthetic harmony and ensuring dynamic accent functionality."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import type { ColorHarmonyEngine } from '@/audio/ColorHarmonyEngine';
import type { DepthConsciousnessController } from './DepthConsciousnessController';
import { BaseVisualSystem } from '../base/BaseVisualSystem';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/Year3000Utilities';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';

interface AlbumColors {
  VIBRANT?: string;
  DARK_VIBRANT?: string;
  LIGHT_VIBRANT?: string;
  PROMINENT?: string;
  PRIMARY?: string;
  SECONDARY?: string;
  VIBRANT_NON_ALARMING?: string;
  DESATURATED?: string;
}

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
  smoothTransitionDuration: number; // ms
  energyResponseMultiplier: number; // 0-2
}

export class DynamicCatppuccinBridge extends BaseVisualSystem {
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private depthConsciousnessController: DepthConsciousnessController | null = null;
  
  private dynamicColorState: DynamicColorState = {
    currentAccentHex: '#cba6f7', // Default Catppuccin Mocha mauve (proper fallback)
    currentAccentRgb: '203,166,247',
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
    smoothTransitionDuration: 800, // 0.8s smooth transitions
    energyResponseMultiplier: 1.2
  };
  
  // Transition management
  private transitionTimer: number = 0;
  private lastTransitionStartTime: number = 0;
  private transitionFromAccent: string = '';
  private transitionToAccent: string = '';
  
  constructor(
    config = YEAR3000_CONFIG,
    utils = Utils,
    performanceMonitor: any = null,
    musicSyncService: any = null,
    settingsManager: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    try {
      // Always setup event listeners and settings monitoring
      this.setupColorExtractionListeners();
      this.setupSettingsListeners();
      
      // Initialize current state from existing variables
      this.initializeCurrentState();
      
      // Check if dynamic accent is currently enabled
      const isEnabled = this.checkDynamicAccentEnabled();
      this.integrationConfig.accentUpdateEnabled = isEnabled;
      
      if (isEnabled) {
        Y3K?.debug?.log('DynamicCatppuccinBridge', 'Dynamic accent enabled - bridge active');
      } else {
        Y3K?.debug?.log('DynamicCatppuccinBridge', 'Dynamic accent disabled - bridge standby (will activate when enabled)');
      }
      
      Y3K?.debug?.log('DynamicCatppuccinBridge', 'Color Extension Facade initialized successfully');
    } catch (error) {
      Y3K?.debug?.error('DynamicCatppuccinBridge', 'Failed to initialize facade:', error);
    }
  }
  
  /**
   * Check if dynamic accent is enabled in settings
   */
  private checkDynamicAccentEnabled(): boolean {
    try {
      if (!this.settingsManager) return false;
      
      const accentSetting = this.settingsManager.get('catppuccin-accentColor');
      // Cast to string since 'dynamic' might be a custom value not in the type definition
      const isDynamic = String(accentSetting) === 'dynamic';
      
      if (this.config.enableDebug) {
        Y3K?.debug?.log('DynamicCatppuccinBridge', `Accent setting: ${accentSetting}, Dynamic: ${isDynamic}`);
      }
      
      return isDynamic;
    } catch (error) {
      Y3K?.debug?.error('DynamicCatppuccinBridge', 'Error checking dynamic accent setting:', error);
      return false;
    }
  }
  
  /**
   * Setup listeners for color extraction events
   * 🔧 CRITICAL FIX: Enhanced with UnifiedEventBus integration
   */
  private setupColorExtractionListeners(): void {
    // 🔧 CRITICAL FIX: Listen to UnifiedEventBus events for better integration
    unifiedEventBus.subscribe('colors:extracted', (data) => {
      if (data.rawColors) {
        this.handleExtractedColors(data.rawColors);
      }
    }, 'DynamicCatppuccinBridge');
    
    unifiedEventBus.subscribe('colors:harmonized', (data) => {
      if (data.processedColors) {
        this.handleHarmonizedColors(data.processedColors);
      }
    }, 'DynamicCatppuccinBridge');
    
    unifiedEventBus.subscribe('colors:applied', (data) => {
      if (data.cssVariables && this.integrationConfig.accentUpdateEnabled) {
        this.handleCSSVariablesApplied(data.cssVariables, data.accentHex, data.accentRgb);
      }
    }, 'DynamicCatppuccinBridge');
    
    // Keep legacy DOM event listeners for backward compatibility
    document.addEventListener('colors-extracted', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.extractedColors) {
        this.handleExtractedColors(customEvent.detail.extractedColors);
      }
    });
    
    // Listen for harmonized color events
    document.addEventListener('colors-harmonized', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.harmonizedColors) {
        this.handleHarmonizedColors(customEvent.detail.harmonizedColors);
      }
    });
    
    // Listen for music state changes
    document.addEventListener('music-state-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleMusicStateChange(customEvent.detail);
      }
    });
    
    // 🔧 CRITICAL ENHANCEMENT: Listen for spice color update requests from other systems
    document.addEventListener('spice-colors/update-request', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && this.integrationConfig.accentUpdateEnabled) {
        this.handleSpiceColorUpdateRequest(customEvent.detail);
      }
    });
    
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Enhanced color extraction and coordination listeners setup complete (UnifiedEventBus + DOM)');
  }

  /**
   * Handle requests from other systems to update spice colors
   */
  private handleSpiceColorUpdateRequest(colorData: any): void {
    const { accentHex, primaryHex, secondaryHex, source } = colorData;
    
    if (this.config.enableDebug) {
      Y3K?.debug?.log('DynamicCatppuccinBridge', `Received spice color update request from ${source}:`, {
        accent: accentHex,
        primary: primaryHex,
        secondary: secondaryHex
      });
    }
    
    // Apply the new accent color if provided
    if (accentHex && accentHex !== this.dynamicColorState.currentAccentHex) {
      this.scheduleSmoothAccentTransition(accentHex);
    }
    
    // Apply background gradients if provided
    if (primaryHex) {
      this.updateLivingBaseBackground(primaryHex);
    }
    
    // Emit confirmation event
    document.dispatchEvent(new CustomEvent('spice-colors/updated', {
      detail: {
        source: 'DynamicCatppuccinBridge',
        applied: {
          accent: accentHex,
          primary: primaryHex,
          secondary: secondaryHex
        },
        timestamp: Date.now()
      }
    }));
  }
  
  /**
   * Setup settings change listeners
   */
  private setupSettingsListeners(): void {
    document.addEventListener('year3000SystemSettingsChanged', (event: Event) => {
      const customEvent = event as CustomEvent;
      const { key, value } = customEvent.detail || {};
      
      if (key === 'catppuccin-accentColor') {
        // Cast to string since 'dynamic' might be a custom value not in the type definition
        const isDynamic = String(value) === 'dynamic';
        this.integrationConfig.accentUpdateEnabled = isDynamic;
        
        if (isDynamic && !this.isActive) {
          // Re-enable bridge if dynamic accent was just selected
          this.initialize();
        } else if (!isDynamic && this.isActive) {
          // Disable bridge if switching away from dynamic
          this.destroy();
        }
        
        Y3K?.debug?.log('DynamicCatppuccinBridge', `Accent setting changed to: ${value}, Bridge active: ${this.isActive}`);
      }
    });
  }
  
  /**
   * Initialize current state from existing CSS variables
   * Prioritizes ColorHarmonyEngine variables, then falls back to Catppuccin defaults
   */
  private initializeCurrentState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Get current accent with proper priority cascade
    // 1st: ColorHarmonyEngine processed colors (primary source)
    // 2nd: Our own dynamic accent variable  
    // 3rd: Catppuccin cosmic default
    // 4th: Spicetify compatibility
    const currentAccent = computedStyle.getPropertyValue('--sn-accent-hex').trim() ||
                          computedStyle.getPropertyValue('--sn-musical-harmony-primary-hex').trim() ||
                          computedStyle.getPropertyValue('--sn-dynamic-accent-hex').trim() ||
                          computedStyle.getPropertyValue('--sn-cosmic-accent-hex').trim() ||
                          computedStyle.getPropertyValue('--spice-accent').trim();
    
    if (currentAccent) {
      this.dynamicColorState.currentAccentHex = currentAccent;
      const rgb = this.utils.hexToRgb(currentAccent);
      if (rgb) {
        this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
      }
    }
    
    // Get current base background (cascading priority)
    const currentBase = computedStyle.getPropertyValue('--sn-cosmic-base-hex').trim() ||
                        computedStyle.getPropertyValue('--spice-base').trim() || 
                        '#0d1117'; // StarryNight cosmic default
    this.dynamicColorState.baseBackgroundHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.dynamicColorState.baseBackgroundRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }
    
    this.dynamicColorState.lastUpdateTime = Date.now();
    
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Current state initialized:', {
      accent: this.dynamicColorState.currentAccentHex,
      base: this.dynamicColorState.baseBackgroundHex
    });
  }
  
  /**
   * Handle extracted colors from ColorHarmonyEngine
   */
  private handleExtractedColors(extractedColors: AlbumColors): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;
    
    try {
      const newAccentHex = this.selectBestAccentColor(extractedColors);
      
      if (newAccentHex && newAccentHex !== this.dynamicColorState.currentAccentHex) {
        this.scheduleSmoothAccentTransition(newAccentHex);
      }
      
      Y3K?.debug?.log('DynamicCatppuccinBridge', 'Processed extracted colors:', {
        input: Object.keys(extractedColors),
        selectedAccent: newAccentHex
      });
    } catch (error) {
      Y3K?.debug?.error('DynamicCatppuccinBridge', 'Error handling extracted colors:', error);
    }
  }
  
  /**
   * Handle harmonized colors (post-processing)
   * Extract accent color from ColorHarmonyEngine and apply it immediately
   */
  private handleHarmonizedColors(harmonizedColors: AlbumColors): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;
    
    try {
      // Extract the best accent color from harmonized colors using the same priority as ColorHarmonyEngine
      const newAccentHex = harmonizedColors['VIBRANT'] || 
                           harmonizedColors['PROMINENT'] ||
                           harmonizedColors['VIBRANT_NON_ALARMING'] ||
                           harmonizedColors['LIGHT_VIBRANT'] ||
                           harmonizedColors['PRIMARY'] ||
                           Object.values(harmonizedColors)[0]; // First available color
      
      if (newAccentHex && newAccentHex !== this.dynamicColorState.currentAccentHex) {
        if (this.config.enableDebug) {
          console.log('🎨 [DynamicCatppuccinBridge] Applying harmonized accent color:', {
            from: this.dynamicColorState.currentAccentHex,
            to: newAccentHex,
            source: 'ColorHarmonyEngine harmonized colors'
          });
        }
        
        // Apply the accent color immediately with smooth transition
        this.scheduleSmoothAccentTransition(newAccentHex);
      }
      
      // Also apply to dynamic system for background effects
      this.applyHarmonizedColorsToDynamicSystem(harmonizedColors);
      
    } catch (error) {
      console.error('🎨 [DynamicCatppuccinBridge] Error handling harmonized colors:', error);
    }
  }

  /**
   * Handle CSS variables applied event from ColorHarmonyEngine
   * 🔧 CRITICAL FIX: New handler for colors:applied events
   */
  private handleCSSVariablesApplied(cssVariables: Record<string, string>, accentHex: string, accentRgb: string): void {
    if (!this.integrationConfig.accentUpdateEnabled) return;
    
    try {
      // Update our internal state
      if (accentHex && accentHex !== this.dynamicColorState.currentAccentHex) {
        this.dynamicColorState.currentAccentHex = accentHex;
        this.dynamicColorState.currentAccentRgb = accentRgb;
        this.dynamicColorState.lastUpdateTime = Date.now();
      }
      
      // Ensure critical UI variables are properly applied
      const enhancedVariables: Record<string, string> = {};
      
      // Extract accent colors from CSS variables
      const accent = cssVariables['--sn-accent-hex'] || cssVariables['--spice-accent'] || accentHex;
      const accentRgbVar = cssVariables['--sn-accent-rgb'] || cssVariables['--spice-rgb-accent'] || accentRgb;
      
      if (accent && accentRgbVar) {
        // Ensure dynamic accent variables are set
        enhancedVariables['--sn-dynamic-accent-hex'] = accent;
        enhancedVariables['--sn-dynamic-accent-rgb'] = accentRgbVar;
        enhancedVariables['--sn-dynamic-primary-hex'] = accent;
        enhancedVariables['--sn-dynamic-primary-rgb'] = accentRgbVar;
        
        // Apply to DOM if needed
        const root = document.documentElement;
        Object.entries(enhancedVariables).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      }
      
      Y3K?.debug?.log('DynamicCatppuccinBridge', 'Processed colors:applied event:', {
        accentHex: accent,
        accentRgb: accentRgbVar,
        variablesProcessed: Object.keys(cssVariables).length,
        enhancedVariables: Object.keys(enhancedVariables).length
      });
      
    } catch (error) {
      Y3K?.debug?.error('DynamicCatppuccinBridge', 'Error handling CSS variables applied:', error);
    }
  }
  
  /**
   * Handle music state changes for energy-responsive effects
   */
  private handleMusicStateChange(musicState: any): void {
    if (musicState.energy !== undefined) {
      this.dynamicColorState.musicEnergy = musicState.energy;
      
      // Update consciousness intensity based on music energy
      if (this.integrationConfig.consciousnessIntegrationEnabled) {
        this.updateConsciousnessWithMusicEnergy(musicState.energy);
      }
    }
  }
  
  /**
   * Select best accent color from extracted colors
   */
  private selectBestAccentColor(colors: AlbumColors): string | null {
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
      const color = colors[key as keyof AlbumColors];
      if (color && this.utils.hexToRgb(color)) {
        return color;
      }
    }
    
    return null;
  }
  
  /**
   * Schedule smooth transition between accent colors
   */
  private scheduleSmoothAccentTransition(newAccentHex: string): void {
    if (this.dynamicColorState.transitionInProgress) {
      // Update target mid-transition
      this.transitionToAccent = newAccentHex;
      return;
    }
    
    this.transitionFromAccent = this.dynamicColorState.currentAccentHex;
    this.transitionToAccent = newAccentHex;
    this.dynamicColorState.transitionInProgress = true;
    this.lastTransitionStartTime = Date.now();
    
    // Start transition animation
    this.animateAccentTransition();
    
    Y3K?.debug?.log('DynamicCatppuccinBridge', `Accent transition scheduled: ${this.transitionFromAccent} → ${newAccentHex}`);
  }
  
  /**
   * Animate smooth accent color transitions
   */
  private animateAccentTransition(): void {
    const animate = () => {
      if (!this.dynamicColorState.transitionInProgress) return;
      
      const elapsed = Date.now() - this.lastTransitionStartTime;
      const progress = Math.min(elapsed / this.integrationConfig.smoothTransitionDuration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      
      // Interpolate colors
      const currentColor = this.interpolateColors(
        this.transitionFromAccent,
        this.transitionToAccent,
        easeProgress
      );
      
      if (currentColor) {
        this.applyDynamicAccent(currentColor);
      }
      
      if (progress >= 1) {
        // Transition complete
        this.dynamicColorState.transitionInProgress = false;
        this.dynamicColorState.currentAccentHex = this.transitionToAccent;
        this.dynamicColorState.lastUpdateTime = Date.now();
        
        const rgb = this.utils.hexToRgb(this.transitionToAccent);
        if (rgb) {
          this.dynamicColorState.currentAccentRgb = `${rgb.r},${rgb.g},${rgb.b}`;
        }
        
        Y3K?.debug?.log('DynamicCatppuccinBridge', `Accent transition complete: ${this.transitionToAccent}`);
      } else {
        // Continue animation
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  /**
   * Interpolate between two hex colors
   */
  private interpolateColors(fromHex: string, toHex: string, progress: number): string | null {
    const fromRgb = this.utils.hexToRgb(fromHex);
    const toRgb = this.utils.hexToRgb(toHex);
    
    if (!fromRgb || !toRgb) return null;
    
    const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress);
    const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress);
    const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress);
    
    return this.utils.rgbToHex(r, g, b);
  }
  
  /**
   * Apply dynamic accent using Color Extension Facade
   * Updates both core Spicetify variables AND consciousness extensions
   */
  private applyDynamicAccent(accentHex: string): void {
    // 🎨 CRITICAL: Log accent color being applied
    console.log("🎨 [DynamicCatppuccinBridge] Applying dynamic accent color:", {
      accentHex,
      previousAccent: this.dynamicColorState.currentAccentHex,
      timestamp: Date.now()
    });

    const root = document.documentElement;
    const rgb = this.utils.hexToRgb(accentHex);
    
    if (!rgb) {
      console.error("🎨 [DynamicCatppuccinBridge] Failed to convert accent hex to RGB:", accentHex);
      return;
    }
    
    const rgbString = `${rgb.r},${rgb.g},${rgb.b}`;
    
    // 🎨 CRITICAL: Log all CSS variables being set
    const variablesToSet = {
      '--sn-dynamic-accent-hex': accentHex,
      '--sn-dynamic-accent-rgb': rgbString,
      '--sn-dynamic-primary-hex': accentHex,
      '--sn-dynamic-primary-rgb': rgbString,
      '--spice-accent': accentHex,
      '--spice-button': accentHex,
      '--spice-button-active': accentHex,
      '--spice-rgb-accent': rgbString,
      '--spice-rgb-button': rgbString,
      '--sn-color-extracted-primary-rgb': rgbString,
      '--sn-color-extracted-vibrant-rgb': rgbString,
      '--sn-color-extracted-dominant-rgb': rgbString
    };
    
    console.log("🎨 [DynamicCatppuccinBridge] Setting CSS variables:", variablesToSet);
    
    // 🎯 DYNAMIC COLOR VARIABLES (Highest Priority in Cascade)
    root.style.setProperty('--sn-dynamic-accent-hex', accentHex);
    root.style.setProperty('--sn-dynamic-accent-rgb', rgbString);
    root.style.setProperty('--sn-dynamic-primary-hex', accentHex);
    root.style.setProperty('--sn-dynamic-primary-rgb', rgbString);
    
    // 🔧 CORE SPICETIFY VARIABLES (Compatibility Layer)
    root.style.setProperty('--spice-accent', accentHex);
    root.style.setProperty('--spice-button', accentHex);
    root.style.setProperty('--spice-button-active', accentHex);
    root.style.setProperty('--spice-rgb-accent', rgbString);
    root.style.setProperty('--spice-rgb-button', rgbString);
    
    // 🎨 EXTRACTED COLOR VARIABLES for ColorHarmonyEngine
    root.style.setProperty('--sn-color-extracted-primary-rgb', rgbString);
    root.style.setProperty('--sn-color-extracted-vibrant-rgb', rgbString);
    root.style.setProperty('--sn-color-extracted-dominant-rgb', rgbString);
    
    // 🔮 CONSCIOUSNESS INTEGRATION
    if (this.integrationConfig.consciousnessIntegrationEnabled) {
      this.updateConsciousnessWithAccent(accentHex, rgbString);
    }
    
    if (this.config.enableDebug) {
      Y3K?.debug?.log('DynamicCatppuccinBridge', `Applied gradient colors: --sn-gradient-primary=${accentHex}, --sn-gradient-primary-rgb=${rgbString}`);
    }
  }
  
  /**
   * Apply harmonized colors to the dynamic system
   */
  private applyHarmonizedColorsToDynamicSystem(harmonizedColors: AlbumColors): void {
    const primaryHex = harmonizedColors.VIBRANT || harmonizedColors.PRIMARY;
    
    if (primaryHex) {
      // Transform base background with living gradient integration
      if (this.integrationConfig.baseTransformationEnabled) {
        this.updateLivingBaseBackground(primaryHex);
      }
    }
  }
  
  /**
   * Update consciousness system with new accent awareness
   */
  private updateConsciousnessWithAccent(accentHex: string, accentRgb: string): void {
    const root = document.documentElement;
    
    // Update holographic consciousness variables
    root.style.setProperty('--organic-holographic-rgb', accentRgb);
    root.style.setProperty('--holographic-scanline-rgb', accentRgb);
    
    // Update depth consciousness variables
    root.style.setProperty('--consciousness-intensity', 
      `calc(0.5 + var(--musical-sync-intensity) * ${this.integrationConfig.energyResponseMultiplier})`);
    
    // Notify depth consciousness controller if available
    if (this.depthConsciousnessController) {
      // Update consciousness system via public interface
      Y3K?.debug?.log('DynamicCatppuccinBridge', 'Notifying depth consciousness of accent change');
    }
  }
  
  /**
   * Update consciousness with music energy
   */
  private updateConsciousnessWithMusicEnergy(energy: number): void {
    const root = document.documentElement;
    const adjustedEnergy = energy * this.integrationConfig.energyResponseMultiplier;
    
    root.style.setProperty('--musical-sync-intensity', adjustedEnergy.toString());
    root.style.setProperty('--holographic-music-flicker-intensity', adjustedEnergy.toString());
    
    // Update consciousness intensity based on energy
    const baseIntensity = 0.5;
    const consciousnessIntensity = Math.max(0.1, Math.min(1.0, baseIntensity + adjustedEnergy * 0.3));
    root.style.setProperty('--consciousness-intensity', consciousnessIntensity.toString());
  }
  
  /**
   * Update living base background using Color Extension Facade
   * Preserves Spicetify base while adding consciousness layers
   */
  private updateLivingBaseBackground(primaryHex: string): void {
    const root = document.documentElement;
    const primaryRgb = this.utils.hexToRgb(primaryHex);
    
    if (!primaryRgb) return;
    
    const primaryRgbString = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;
    
    // 🔧 DYNAMIC SECONDARY COLOR VARIABLES
    root.style.setProperty('--sn-dynamic-secondary-hex', primaryHex);
    root.style.setProperty('--sn-dynamic-secondary-rgb', primaryRgbString);
    
    // Update extracted color system for consciousness effects
    root.style.setProperty('--sn-color-extracted-secondary-rgb', primaryRgbString);
    root.style.setProperty('--sn-color-harmony-complementary-rgb', primaryRgbString);
    
    // Create living gradient that ENHANCES Spicetify base (doesn't replace)
    const consciousnessGradient = `
      linear-gradient(135deg, 
        var(--spice-base) 0%,
        rgba(${primaryRgbString}, 0.08) 30%,
        var(--spice-base) 70%
      ),
      var(--spice-base)
    `;
    
    root.style.setProperty('--living-base-gradient', consciousnessGradient);
    
    // Update dynamic background coordination
    root.style.setProperty('--consciousness-base-gradient', consciousnessGradient);
    
    if (this.config.enableDebug) {
      Y3K?.debug?.log('DynamicCatppuccinBridge', `Living base updated: --sn-gradient-secondary=${primaryHex}, --sn-gradient-secondary-rgb=${primaryRgbString}`);
    }
  }
  
  /**
   * Link with other consciousness systems
   */
  public linkWithColorHarmonyEngine(engine: ColorHarmonyEngine): void {
    this.colorHarmonyEngine = engine;
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Linked with ColorHarmonyEngine');
  }
  
  public linkWithDepthConsciousness(controller: DepthConsciousnessController): void {
    this.depthConsciousnessController = controller;
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Linked with DepthConsciousnessController');
  }
  
  /**
   * Get current dynamic color state for debugging
   */
  public getDynamicColorState(): DynamicColorState {
    return { ...this.dynamicColorState };
  }
  
  /**
   * Debug utility: Get current facade variable values
   */
  public getFacadeVariableStatus(): any {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    return {
      // Core Spicetify Variables
      spicetifyVars: {
        accent: computedStyle.getPropertyValue('--spice-accent').trim(),
        button: computedStyle.getPropertyValue('--spice-button').trim(),
        rgbAccent: computedStyle.getPropertyValue('--spice-rgb-accent').trim(),
        base: computedStyle.getPropertyValue('--spice-base').trim(),
      },
      
      // Consciousness Extensions
      consciousnessVars: {
        gradientPrimary: computedStyle.getPropertyValue('--sn-gradient-primary-rgb').trim(),
        accentHex: computedStyle.getPropertyValue('--sn-color-accent-hex').trim(),
        accentRgb: computedStyle.getPropertyValue('--sn-color-accent-rgb').trim(),
        extractedPrimary: computedStyle.getPropertyValue('--sn-color-extracted-primary-rgb').trim(),
        livingBaseGradient: computedStyle.getPropertyValue('--living-base-gradient').trim(),
      },
      
      // Configuration Status
      config: {
        dynamicAccentEnabled: this.checkDynamicAccentEnabled(),
        accentUpdateEnabled: this.integrationConfig.accentUpdateEnabled,
        consciousnessEnabled: this.integrationConfig.consciousnessIntegrationEnabled,
        isActive: this.isActive,
      }
    };
  }
  
  /**
   * Update integration configuration
   */
  public updateConfig(newConfig: Partial<CatppuccinIntegrationConfig>): void {
    this.integrationConfig = { ...this.integrationConfig, ...newConfig };
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Configuration updated:', newConfig);
  }
  
  public async healthCheck(): Promise<any> {
    const isDynamicEnabled = this.checkDynamicAccentEnabled();
    const hasRecentUpdate = (Date.now() - this.dynamicColorState.lastUpdateTime) < 30000; // 30s
    
    return {
      healthy: this.isActive && isDynamicEnabled,
      issues: this.isActive && !isDynamicEnabled 
        ? ['Dynamic accent not enabled in settings']
        : [],
      metrics: {
        dynamicAccentEnabled: isDynamicEnabled,
        currentAccent: this.dynamicColorState.currentAccentHex,
        lastUpdateAge: Date.now() - this.dynamicColorState.lastUpdateTime,
        hasRecentUpdate,
        transitionInProgress: this.dynamicColorState.transitionInProgress,
        musicEnergy: this.dynamicColorState.musicEnergy
      }
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Clear any active transitions
    if (this.transitionTimer) {
      clearTimeout(this.transitionTimer);
      this.transitionTimer = 0;
    }
    
    this.dynamicColorState.transitionInProgress = false;
    
    // 🔧 CRITICAL FIX: Clean up UnifiedEventBus subscriptions
    unifiedEventBus.unsubscribeAll('DynamicCatppuccinBridge');
    
    Y3K?.debug?.log('DynamicCatppuccinBridge', 'Dynamic Catppuccin bridge cleaned up (including UnifiedEventBus subscriptions)');
  }
}