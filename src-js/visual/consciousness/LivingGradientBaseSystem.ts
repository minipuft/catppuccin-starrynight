/**
 * LivingGradientBaseSystem - Phase 2.2 Living Gradient Base Transformation
 * 
 * Transform static Catppuccin base (#1e1e2e) into organic consciousness foundation
 * that breathes with extracted album colors and integrates with WebGL systems.
 * 
 * Philosophy: "The foundation itself becomes conscious - breathing with music,
 * flowing with extracted colors, creating a living substrate for all visual systems."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import { BaseVisualSystem } from '../base/BaseVisualSystem';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/Year3000Utilities';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';

interface LivingBaseState {
  currentBaseHex: string;
  currentBaseRgb: string;
  currentPrimaryHex: string;
  currentPrimaryRgb: string;
  consciousnessIntensity: number;
  breathingPhase: number;
  musicEnergy: number;
  lastUpdateTime: number;
  webglIntegrationActive: boolean;
}

interface LivingGradientConfig {
  baseTransformationEnabled: boolean;
  webglIntegrationEnabled: boolean;
  breathingAnimationEnabled: boolean;
  consciousnessLayerOpacity: number; // 0-1
  organicFlowIntensity: number; // 0-2
  musicResponsiveness: number; // 0-2
}

export class LivingGradientBaseSystem extends BaseVisualSystem {
  private livingBaseState: LivingBaseState = {
    currentBaseHex: '#1e1e2e', // Catppuccin base
    currentBaseRgb: '30,30,46',
    currentPrimaryHex: '#cba6f7', // Default mauve
    currentPrimaryRgb: '203,166,247',
    consciousnessIntensity: 0.5,
    breathingPhase: 0,
    musicEnergy: 0.5,
    lastUpdateTime: 0,
    webglIntegrationActive: false
  };
  
  private gradientConfig: LivingGradientConfig = {
    baseTransformationEnabled: true,
    webglIntegrationEnabled: true,
    breathingAnimationEnabled: true,
    consciousnessLayerOpacity: 0.08, // Subtle but visible
    organicFlowIntensity: 1.2,
    musicResponsiveness: 1.0
  };
  
  // Animation control
  private animationFrameId: number = 0;
  private breathingStartTime: number = 0;
  
  // Performance throttling
  private lastFrameTime: number = 0;
  private frameThrottleMs: number = 16; // 60fps = 16.67ms
  private previousGradientValues = {
    breathingPhase: 0,
    consciousnessIntensity: 0,
    musicEnergy: 0,
    flowX: 0,
    flowY: 0,
    flowScale: 0
  };
  private gradientChangeThreshold = 0.01; // Minimum change for update
  
  // Event debouncing
  private musicEventDebounceTimers = {
    musicState: 0,
    harmonizedColors: 0,
    webglState: 0,
    consciousnessIntensity: 0
  };
  private eventDebounceMs = 100; // Increased from 33ms to 100ms for better performance
  
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
      // Setup consciousness event listeners
      this.setupConsciousnessListeners();
      
      // Setup WebGL integration listeners
      this.setupWebGLIntegrationListeners();
      
      // Initialize current base state
      this.initializeBaseState();
      
      // Start living gradient animations
      this.startLivingGradientAnimation();
      
      // Apply initial consciousness base gradient
      this.applyLivingConsciousnessBase();
      
      Y3K?.debug?.log('LivingGradientBaseSystem', 'Living gradient base system awakened');
    } catch (error) {
      Y3K?.debug?.error('LivingGradientBaseSystem', 'Failed to initialize living base system:', error);
    }
  }
  
  /**
   * Setup listeners for consciousness and dynamic color changes
   * Phase 2: Migrated from DOM events to UnifiedEventBus for proper facade coordination
   */
  private setupConsciousnessListeners(): void {
    // Phase 2: Listen for colors:harmonized events via UnifiedEventBus (no more DOM events)
    // This prevents the infinite loop that was caused by DOM event cascading
    if (typeof unifiedEventBus !== 'undefined') {
      unifiedEventBus.subscribe('colors:harmonized', (data: any) => {
        if (data && data.processedColors) {
          this.handleHarmonizedColorUpdate(data.processedColors);
        }
      }, 'LivingGradientBaseSystem');
    }
    
    // Listen for music state changes
    document.addEventListener('music-state-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleMusicStateChange(customEvent.detail);
      }
    });
    
    // Listen for consciousness intensity changes
    document.addEventListener('consciousness-intensity-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.intensity === 'number') {
        this.updateConsciousnessIntensity(customEvent.detail.intensity);
      }
    });
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Consciousness listeners established');
  }
  
  /**
   * Setup WebGL integration listeners
   */
  private setupWebGLIntegrationListeners(): void {
    // Listen for WebGL system state changes
    document.addEventListener('webgl-state-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.handleWebGLStateChange(customEvent.detail);
      }
    });
    
    // Listen for WebGL gradient updates
    document.addEventListener('webgl-gradient-update', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.coordinateWithWebGLGradient(customEvent.detail);
      }
    });
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'WebGL integration listeners established');
  }
  
  /**
   * Initialize current base state from CSS variables
   */
  private initializeBaseState(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Get current base color
    const currentBase = computedStyle.getPropertyValue('--spice-base').trim() || '#1e1e2e';
    this.livingBaseState.currentBaseHex = currentBase;
    const baseRgb = this.utils.hexToRgb(currentBase);
    if (baseRgb) {
      this.livingBaseState.currentBaseRgb = `${baseRgb.r},${baseRgb.g},${baseRgb.b}`;
    }
    
    // Get current primary color for consciousness integration
    const currentAccent = computedStyle.getPropertyValue('--sn-dynamic-accent').trim() ||
                          computedStyle.getPropertyValue('--spice-accent').trim() ||
                          '#cba6f7';
    this.livingBaseState.currentPrimaryHex = currentAccent;
    const accentRgb = this.utils.hexToRgb(currentAccent);
    if (accentRgb) {
      this.livingBaseState.currentPrimaryRgb = `${accentRgb.r},${accentRgb.g},${accentRgb.b}`;
    }
    
    this.livingBaseState.lastUpdateTime = Date.now();
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Base state initialized:', {
      base: this.livingBaseState.currentBaseHex,
      primary: this.livingBaseState.currentPrimaryHex
    });
  }
  
  /**
   * Handle harmonized color updates from Dynamic Catppuccin Bridge
   */
  private handleHarmonizedColorUpdate(harmonizedColors: any): void {
    this.debouncedEventHandler('harmonizedColors', () => {
      const primaryColor = harmonizedColors.VIBRANT || harmonizedColors.PRIMARY || harmonizedColors.PROMINENT;
      
      if (primaryColor && primaryColor !== this.livingBaseState.currentPrimaryHex) {
        this.livingBaseState.currentPrimaryHex = primaryColor;
        const primaryRgb = this.utils.hexToRgb(primaryColor);
        if (primaryRgb) {
          this.livingBaseState.currentPrimaryRgb = `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`;
        }
        
        // Update living consciousness base
        this.updateLivingConsciousnessBase();
        
        Y3K?.debug?.log('LivingGradientBaseSystem', 'Living base updated with harmonized colors:', primaryColor);
      }
    });
  }
  
  /**
   * Handle music state changes for energy-responsive base
   */
  private handleMusicStateChange(musicState: any): void {
    this.debouncedEventHandler('musicState', () => {
      if (musicState.energy !== undefined) {
        this.livingBaseState.musicEnergy = musicState.energy;
        
        // Update consciousness intensity based on music energy
        const baseIntensity = 0.5;
        const energyBoost = musicState.energy * this.gradientConfig.musicResponsiveness;
        this.livingBaseState.consciousnessIntensity = Math.max(0.1, Math.min(1.0, baseIntensity + energyBoost * 0.3));
        
        // Update CSS variables for real-time response
        this.updateMusicResponsiveVariables();
      }
    });
  }
  
  /**
   * Handle WebGL system state changes
   */
  private handleWebGLStateChange(webglState: any): void {
    this.debouncedEventHandler('webglState', () => {
      if (webglState.enabled !== undefined) {
        this.livingBaseState.webglIntegrationActive = webglState.enabled;
        
        // Adjust base system for WebGL coordination
        this.coordinateWithWebGLSystem(webglState.enabled);
        
        Y3K?.debug?.log('LivingGradientBaseSystem', `WebGL integration ${webglState.enabled ? 'activated' : 'deactivated'}`);
      }
    });
  }
  
  /**
   * Update consciousness intensity
   */
  private updateConsciousnessIntensity(intensity: number): void {
    this.debouncedEventHandler('consciousnessIntensity', () => {
      this.livingBaseState.consciousnessIntensity = Math.max(0, Math.min(1, intensity));
      this.updateConsciousnessVariables();
    });
  }
  
  /**
   * Start living gradient animation system
   */
  private startLivingGradientAnimation(): void {
    if (!this.gradientConfig.breathingAnimationEnabled) return;
    
    this.breathingStartTime = Date.now();
    
    const animate = () => {
      if (!this.isActive) return;
      
      const currentTime = performance.now();
      
      // Throttle to target framerate
      if (currentTime - this.lastFrameTime < this.frameThrottleMs) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = currentTime - this.breathingStartTime;
      
      // Breathing rhythm: 4-second cycle (inhale 2s, exhale 2s)
      const breathingCycle = 4000; // 4 seconds
      const phase = (elapsed % breathingCycle) / breathingCycle;
      
      // Sine wave for organic breathing
      const newBreathingPhase = Math.sin(phase * 2 * Math.PI);
      
      // Calculate current values for change detection
      const baseIntensity = this.gradientConfig.consciousnessLayerOpacity;
      const breathingMultiplier = 1 + (newBreathingPhase * 0.1);
      const musicMultiplier = 1 + (this.livingBaseState.musicEnergy * 0.2);
      const finalIntensity = baseIntensity * breathingMultiplier * musicMultiplier;
      
      const flowX = Math.sin(currentTime * 0.0005) * 2;
      const flowY = Math.cos(currentTime * 0.0003) * 1.5;
      const flowScale = 1 + (newBreathingPhase * 0.05);
      
      const currentValues = {
        breathingPhase: newBreathingPhase,
        consciousnessIntensity: finalIntensity,
        musicEnergy: this.livingBaseState.musicEnergy,
        flowX,
        flowY,
        flowScale
      };
      
      // Only update if values have changed significantly
      if (this.hasGradientChanged(currentValues)) {
        this.livingBaseState.breathingPhase = newBreathingPhase;
        this.updateLivingGradientFrame();
        this.updatePreviousGradientValues(currentValues);
      }
      
      this.lastFrameTime = currentTime;
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Living gradient animation started');
  }
  
  /**
   * Check if gradient values have changed significantly
   */
  private hasGradientChanged(currentValues: Record<string, number>): boolean {
    for (const [key, value] of Object.entries(currentValues)) {
      const previous = this.previousGradientValues[key as keyof typeof this.previousGradientValues];
      if (Math.abs(value - previous) >= this.gradientChangeThreshold) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Update previous gradient values for change detection
   */
  private updatePreviousGradientValues(currentValues: Record<string, number>): void {
    Object.assign(this.previousGradientValues, currentValues);
  }
  
  /**
   * Update living gradient for each animation frame
   */
  private updateLivingGradientFrame(): void {
    const root = document.documentElement;
    
    // Calculate dynamic consciousness intensity
    const baseIntensity = this.gradientConfig.consciousnessLayerOpacity;
    const breathingMultiplier = 1 + (this.livingBaseState.breathingPhase * 0.1); // ±10% breathing
    const musicMultiplier = 1 + (this.livingBaseState.musicEnergy * 0.2); // Up to +20% music boost
    const finalIntensity = baseIntensity * breathingMultiplier * musicMultiplier;
    
    // Batch CSS property updates to minimize DOM overhead
    const cssUpdates: Array<[string, string]> = [
      ['--consciousness-breathing-intensity', finalIntensity.toString()],
      ['--consciousness-breathing-phase', this.livingBaseState.breathingPhase.toString()]
    ];
    
    // Update organic flow variables for WebGL coordination
    if (this.gradientConfig.webglIntegrationEnabled) {
      const flowX = Math.sin(Date.now() * 0.0005) * 2; // Slow horizontal flow
      const flowY = Math.cos(Date.now() * 0.0003) * 1.5; // Slower vertical flow
      const flowScale = 1 + (this.livingBaseState.breathingPhase * 0.05); // Breathing scale
      
      cssUpdates.push(
        ['--consciousness-flow-x', `${flowX}%`],
        ['--consciousness-flow-y', `${flowY}%`],
        ['--consciousness-flow-scale', flowScale.toString()]
      );
    }
    
    // Apply all CSS updates in a single batch to minimize layout thrashing
    this.batchApplyCSSUpdates(root, cssUpdates);
  }
  
  /**
   * Apply CSS updates in batch to minimize DOM layout thrashing
   */
  private batchApplyCSSUpdates(element: HTMLElement, updates: Array<[string, string]>): void {
    // Apply all updates in a single batch to minimize layout recalculations
    for (const [property, value] of updates) {
      element.style.setProperty(property, value);
    }
  }
  
  /**
   * Debounced event handler to prevent excessive processing of high-frequency events
   */
  private debouncedEventHandler(
    eventType: keyof typeof this.musicEventDebounceTimers,
    handler: () => void
  ): void {
    const now = performance.now();
    if (now - this.musicEventDebounceTimers[eventType] >= this.eventDebounceMs) {
      handler();
      this.musicEventDebounceTimers[eventType] = now;
    }
  }
  
  /**
   * Apply living consciousness base to the system
   */
  private applyLivingConsciousnessBase(): void {
    const root = document.documentElement;
    
    // Create living base gradient that transforms static #1e1e2e
    const livingBaseGradient = this.createLivingBaseGradient();
    
    // Batch apply living base gradient variables
    const cssUpdates: Array<[string, string]> = [
      ['--living-base-gradient', livingBaseGradient],
      ['--consciousness-base-primary-rgb', this.livingBaseState.currentPrimaryRgb],
      ['--consciousness-base-rgb', this.livingBaseState.currentBaseRgb]
    ];
    
    this.batchApplyCSSUpdates(root, cssUpdates);
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Living consciousness base applied');
  }
  
  /**
   * Update living consciousness base when colors change
   */
  private updateLivingConsciousnessBase(): void {
    this.applyLivingConsciousnessBase();
    
    // Emit update event for other systems
    const updateEvent = new CustomEvent('living-base-update', {
      detail: {
        baseHex: this.livingBaseState.currentBaseHex,
        primaryHex: this.livingBaseState.currentPrimaryHex,
        consciousnessIntensity: this.livingBaseState.consciousnessIntensity,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(updateEvent);
  }
  
  /**
   * Create living base gradient that transforms static #1e1e2e
   */
  private createLivingBaseGradient(): string {
    const primaryRgb = this.livingBaseState.currentPrimaryRgb;
    const baseRgb = this.livingBaseState.currentBaseRgb;
    const intensity = this.livingBaseState.consciousnessIntensity;
    
    // Create organic consciousness gradient
    return `
      radial-gradient(
        ellipse at 50% 50%,
        rgba(${primaryRgb}, ${0.12 * intensity}) 0%,
        rgba(${primaryRgb}, ${0.08 * intensity}) 25%,
        rgba(${baseRgb}, 0.95) 50%,
        var(--spice-base) 100%
      ),
      linear-gradient(
        135deg,
        rgba(${primaryRgb}, ${0.06 * intensity}) 0%,
        transparent 30%,
        rgba(${primaryRgb}, ${0.04 * intensity}) 70%,
        transparent 100%
      ),
      var(--spice-base)
    `;
  }
  
  /**
   * Update music-responsive variables
   */
  private updateMusicResponsiveVariables(): void {
    const root = document.documentElement;
    
    // Update breathing speed based on music energy
    const baseCycle = 4000; // 4 seconds
    const energyMultiplier = 0.5 + (this.livingBaseState.musicEnergy * 1.5); // 0.5x to 2x speed
    const musicCycle = baseCycle / energyMultiplier;
    
    const cssUpdates: Array<[string, string]> = [
      ['--consciousness-music-energy', this.livingBaseState.musicEnergy.toString()],
      ['--consciousness-music-intensity', this.livingBaseState.consciousnessIntensity.toString()],
      ['--consciousness-breathing-duration', `${musicCycle}ms`]
    ];
    
    this.batchApplyCSSUpdates(root, cssUpdates);
  }
  
  /**
   * Update consciousness variables
   */
  private updateConsciousnessVariables(): void {
    const root = document.documentElement;
    
    const cssUpdates: Array<[string, string]> = [
      ['--consciousness-intensity-global', this.livingBaseState.consciousnessIntensity.toString()],
      ['--consciousness-layer-opacity', (this.gradientConfig.consciousnessLayerOpacity * this.livingBaseState.consciousnessIntensity).toString()]
    ];
    
    this.batchApplyCSSUpdates(root, cssUpdates);
  }
  
  /**
   * Coordinate with WebGL gradient system
   */
  private coordinateWithWebGLSystem(webglEnabled: boolean): void {
    const root = document.documentElement;
    
    const cssUpdates: Array<[string, string]> = webglEnabled ? [
      // Reduce CSS layer opacity to allow WebGL to dominate
      ['--consciousness-webgl-coordination', '0.7'],
      ['--consciousness-css-fallback', '0.3']
    ] : [
      // Full CSS consciousness when WebGL is disabled
      ['--consciousness-webgl-coordination', '0'],
      ['--consciousness-css-fallback', '1.0']
    ];
    
    this.batchApplyCSSUpdates(root, cssUpdates);
    
    Y3K?.debug?.log('LivingGradientBaseSystem', `WebGL coordination ${webglEnabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Coordinate with WebGL gradient updates
   */
  private coordinateWithWebGLGradient(webglData: any): void {
    if (!this.gradientConfig.webglIntegrationEnabled) return;
    
    // Update consciousness variables to match WebGL state
    if (webglData.flowState) {
      this.updateFlowStateFromWebGL(webglData.flowState);
    }
    
    if (webglData.colorState) {
      this.updateColorStateFromWebGL(webglData.colorState);
    }
  }
  
  /**
   * Update flow state from WebGL system
   */
  private updateFlowStateFromWebGL(flowState: any): void {
    const root = document.documentElement;
    
    // Collect WebGL flow variables that need updating
    const cssUpdates: Array<[string, string]> = [];
    
    if (flowState.flowX !== undefined) {
      cssUpdates.push(['--consciousness-webgl-flow-x', `${flowState.flowX}%`]);
    }
    if (flowState.flowY !== undefined) {
      cssUpdates.push(['--consciousness-webgl-flow-y', `${flowState.flowY}%`]);
    }
    if (flowState.flowScale !== undefined) {
      cssUpdates.push(['--consciousness-webgl-scale', flowState.flowScale.toString()]);
    }
    
    if (cssUpdates.length > 0) {
      this.batchApplyCSSUpdates(root, cssUpdates);
    }
  }
  
  /**
   * Update color state from WebGL system
   */
  private updateColorStateFromWebGL(colorState: any): void {
    // Sync color variables with WebGL for unified consciousness
    if (colorState.primaryColor) {
      // WebGL may have processed colors differently, sync them
      this.livingBaseState.currentPrimaryRgb = colorState.primaryColor;
      this.updateLivingConsciousnessBase();
    }
  }
  
  /**
   * Get current living base state for debugging
   */
  public getLivingBaseState(): LivingBaseState {
    return { ...this.livingBaseState };
  }
  
  /**
   * Update gradient configuration
   */
  public updateGradientConfig(newConfig: Partial<LivingGradientConfig>): void {
    this.gradientConfig = { ...this.gradientConfig, ...newConfig };
    
    // Apply configuration changes
    if (newConfig.breathingAnimationEnabled !== undefined) {
      if (newConfig.breathingAnimationEnabled && this.animationFrameId === 0) {
        this.startLivingGradientAnimation();
      } else if (!newConfig.breathingAnimationEnabled && this.animationFrameId !== 0) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = 0;
      }
    }
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Gradient configuration updated:', newConfig);
  }
  
  public async healthCheck(): Promise<any> {
    const hasRecentUpdate = (Date.now() - this.livingBaseState.lastUpdateTime) < 30000; // 30s
    const animationActive = this.animationFrameId !== 0;
    
    return {
      healthy: this.isActive && this.gradientConfig.baseTransformationEnabled,
      issues: this.isActive && !animationActive ? ['Animation system not running'] : [],
      metrics: {
        baseTransformationEnabled: this.gradientConfig.baseTransformationEnabled,
        webglIntegrationActive: this.livingBaseState.webglIntegrationActive,
        currentBase: this.livingBaseState.currentBaseHex,
        currentPrimary: this.livingBaseState.currentPrimaryHex,
        consciousnessIntensity: this.livingBaseState.consciousnessIntensity,
        breathingPhase: this.livingBaseState.breathingPhase,
        musicEnergy: this.livingBaseState.musicEnergy,
        hasRecentUpdate,
        animationActive
      }
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Stop animation
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
    
    Y3K?.debug?.log('LivingGradientBaseSystem', 'Living gradient base system cleaned up');
  }
}