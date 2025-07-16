/**
 * Canvas overlay system for rendering non-intrusive ripple effects
 */

import { RippleEffect } from './RippleEffect';
import { RippleVariantSystem } from './RippleVariantSystem';
import { RipplePhysicsEngine } from './RipplePhysicsEngine';
import type { 
  RippleConfig, 
  RippleCanvasOptions, 
  RippleType, 
  RippleTypeConfig,
  RippleVariant,
  CoordinatePoint,
  HarmonicColorData
} from './types';

export class RippleCanvas {
  private container: HTMLElement;
  private ripplePool: RippleEffect[];
  private activeRipples: Set<RippleEffect>;
  private options: RippleCanvasOptions;
  private trackListContainer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  
  // Organic ripple system components
  private variantSystem: RippleVariantSystem;
  private physicsEngine: RipplePhysicsEngine;
  private containerBounds: DOMRect | null = null;
  private lastMusicContext: { bpm?: number; intensity?: number; harmonicMode?: string } = {};
  private harmonicColors: HarmonicColorData | null = null;

  // Updated ripple type configurations with organic variants
  private readonly typeConfigs: Record<RippleType, RippleTypeConfig> = {
    click: {
      baseSize: 200, // Reduced from 300 to prevent edge overflow
      baseDuration: 600,
      intensityMultiplier: 1.0,
      colorSource: 'accent',
      zIndex: 12,
      defaultVariant: 'stardust',
      allowedVariants: ['stardust', 'wave', 'constellation', 'classic']
    },
    beat: {
      baseSize: 250, // Reduced from 500 to prevent edge overflow
      baseDuration: 800,
      intensityMultiplier: 0.7,
      colorSource: 'beat',
      zIndex: 10,
      defaultVariant: 'stardust',
      allowedVariants: ['stardust', 'wave', 'aurora', 'nebula']
    },
    selection: {
      baseSize: 220, // Reduced from 400 to prevent edge overflow
      baseDuration: 1000,
      intensityMultiplier: 0.8,
      colorSource: 'selection',
      zIndex: 11,
      defaultVariant: 'constellation',
      allowedVariants: ['constellation', 'stardust', 'aurora']
    }
  };

  constructor(options: Partial<RippleCanvasOptions> = {}) {
    this.options = {
      maxConcurrentRipples: 8,
      poolSize: 12,
      enableDebug: false,
      enablePhysics: true,
      enableVariants: true,
      performanceBudget: 16, // 16ms per frame for 60fps
      ...options
    };

    this.ripplePool = [];
    this.activeRipples = new Set();
    this.container = this.createContainer();
    
    // Initialize organic systems
    this.variantSystem = new RippleVariantSystem(this.options.performanceBudget);
    this.physicsEngine = new RipplePhysicsEngine();
    
    this.initializePool();
    this.setupEventListeners();
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'sn-ripple-canvas';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 5;
      overflow: hidden;
    `;
    return container;
  }

  private initializePool(): void {
    for (let i = 0; i < this.options.poolSize; i++) {
      const ripple = new RippleEffect();
      this.ripplePool.push(ripple);
      this.container.appendChild(ripple.getElement());
    }
  }

  private setupEventListeners(): void {
    // Set up resize observer for responsive positioning
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateCanvasPosition();
      });
    }
  }

  attachToTrackList(trackListContainer: HTMLElement): void {
    this.trackListContainer = trackListContainer;
    
    // Insert canvas as first child to ensure proper layering
    if (trackListContainer.firstChild) {
      trackListContainer.insertBefore(this.container, trackListContainer.firstChild);
    } else {
      trackListContainer.appendChild(this.container);
    }

    // Observe container for position changes
    if (this.resizeObserver) {
      this.resizeObserver.observe(trackListContainer);
    }

    this.updateCanvasPosition();
    this.updateContainerBounds();
  }

  private updateCanvasPosition(): void {
    if (!this.trackListContainer) return;

    const rect = this.trackListContainer.getBoundingClientRect();
    const parentRect = this.trackListContainer.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };
    
    // Position canvas relative to track list container
    this.container.style.width = `${rect.width}px`;
    this.container.style.height = `${rect.height}px`;
    
    // Update bounds for physics engine
    this.updateContainerBounds();
  }

  /**
   * Update container bounds for physics calculations and edge prevention
   */
  private updateContainerBounds(): void {
    if (!this.trackListContainer) return;
    
    this.containerBounds = this.trackListContainer.getBoundingClientRect();
    
    // Update physics engine with new bounds
    this.physicsEngine.updateContainerBounds(this.containerBounds);
    
    if (this.options.enableDebug) {
      console.log('[RippleCanvas] Updated container bounds:', this.containerBounds);
    }
  }

  createRipple(config: Partial<RippleConfig>): boolean {
    // Limit concurrent ripples for performance
    if (this.activeRipples.size >= this.options.maxConcurrentRipples) {
      if (this.options.enableDebug) {
        console.log('[RippleCanvas] Max concurrent ripples reached, skipping');
      }
      return false;
    }

    // Validate and clamp coordinates to prevent edge spawning
    const clampedConfig = this.validateAndClampCoordinates(config);
    if (!clampedConfig) {
      if (this.options.enableDebug) {
        console.warn('[RippleCanvas] Ripple coordinates outside valid bounds, skipping');
      }
      return false;
    }

    // Acquire ripple from pool
    const ripple = this.acquireRipple();
    if (!ripple) {
      if (this.options.enableDebug) {
        console.warn('[RippleCanvas] No available ripples in pool');
      }
      return false;
    }

    // Complete configuration with organic systems
    const fullConfig = this.completeOrganicConfig(clampedConfig);
    
    // Configure and animate ripple
    ripple.configure(fullConfig);
    this.activeRipples.add(ripple);

    ripple.animate().then(() => {
      this.releaseRipple(ripple);
    });

    return true;
  }

  private acquireRipple(): RippleEffect | null {
    return this.ripplePool.find(ripple => !ripple.getIsActive()) || null;
  }

  private releaseRipple(ripple: RippleEffect): void {
    this.activeRipples.delete(ripple);
    ripple.reset();
  }

  /**
   * Validate and clamp coordinates to prevent edge spawning
   */
  private validateAndClampCoordinates(config: Partial<RippleConfig>): Partial<RippleConfig> | null {
    if (!this.containerBounds || config.x === undefined || config.y === undefined) {
      return config; // Can't validate without bounds or coordinates
    }

    const type = config.type || 'click';
    const typeConfig = this.typeConfigs[type];
    const size = config.size || typeConfig.baseSize;
    const margin = size / 2 + 20; // Add extra margin to prevent edge effects

    const { left, top, right, bottom } = this.containerBounds;
    const relativeX = config.x;
    const relativeY = config.y;

    // Check if ripple would spawn outside safe bounds
    const minX = margin;
    const maxX = (right - left) - margin;
    const minY = margin;
    const maxY = (bottom - top) - margin;

    // If completely outside bounds, reject
    if (relativeX < 0 || relativeX > (right - left) || 
        relativeY < 0 || relativeY > (bottom - top)) {
      return null;
    }

    // Clamp to safe area to prevent edge spawning
    const clampedX = Math.max(minX, Math.min(maxX, relativeX));
    const clampedY = Math.max(minY, Math.min(maxY, relativeY));

    if (this.options.enableDebug && (clampedX !== relativeX || clampedY !== relativeY)) {
      console.log(`[RippleCanvas] Clamped coordinates from (${relativeX}, ${relativeY}) to (${clampedX}, ${clampedY})`);
    }

    return {
      ...config,
      x: clampedX,
      y: clampedY
    };
  }

  /**
   * Complete ripple configuration with organic variants and systems
   */
  private completeOrganicConfig(partial: Partial<RippleConfig>): RippleConfig {
    const type = partial.type || 'click';
    const typeConfig = this.typeConfigs[type];
    const intensity = partial.intensity || 0.7;

    // Select variant using organic system
    let variant: RippleVariant = partial.variant || typeConfig.defaultVariant;
    if (this.options.enableVariants) {
      variant = this.variantSystem.selectVariant(
        type,
        this.lastMusicContext,
        {
          currentLoad: this.activeRipples.size / this.options.maxConcurrentRipples,
          availableBudget: this.options.performanceBudget
        }
      );
    }

    // Generate complete config using variant system
    const baseConfig: Partial<RippleConfig> = {
      x: partial.x || 0,
      y: partial.y || 0,
      type,
      size: partial.size || this.calculateSize(typeConfig, intensity),
      duration: partial.duration || this.calculateDuration(typeConfig, intensity),
      color: partial.color || this.getColorForType(type),
      intensity
    };

    return this.variantSystem.generateVariantConfig(
      baseConfig,
      variant,
      { harmonicColors: this.harmonicColors }
    );
  }

  private completeConfig(partial: Partial<RippleConfig>): RippleConfig {
    // Legacy method - redirect to organic configuration
    return this.completeOrganicConfig(partial);
  }

  private calculateSize(typeConfig: RippleTypeConfig, intensity: number): number {
    return typeConfig.baseSize * (0.8 + intensity * typeConfig.intensityMultiplier * 0.4);
  }

  private calculateDuration(typeConfig: RippleTypeConfig, intensity: number): number {
    return typeConfig.baseDuration * (0.8 + intensity * 0.4);
  }

  private getColorForType(type: RippleType): string {
    const root = document.documentElement;
    const style = getComputedStyle(root);

    switch (type) {
      case 'beat':
        return style.getPropertyValue('--sn-accent-hex').trim() || '#cba6f7';
      case 'selection':
        return style.getPropertyValue('--spice-accent').trim() || '#cba6f7';
      case 'click':
      default:
        return style.getPropertyValue('--sn-accent-hex').trim() || '#cba6f7';
    }
  }

  // Convert screen coordinates to canvas coordinates with bounds checking
  screenToCanvasCoordinates(screenX: number, screenY: number): { x: number; y: number } | null {
    if (!this.trackListContainer) return null;

    const rect = this.trackListContainer.getBoundingClientRect();
    const canvasX = screenX - rect.left;
    const canvasY = screenY - rect.top;
    
    // Validate coordinates are within canvas bounds
    if (canvasX < 0 || canvasX > rect.width || canvasY < 0 || canvasY > rect.height) {
      if (this.options.enableDebug) {
        console.warn(`[RippleCanvas] Screen coordinates (${screenX}, ${screenY}) outside canvas bounds`);
      }
      return null;
    }

    return { x: canvasX, y: canvasY };
  }

  // Get center coordinates of a DOM element relative to canvas with bounds checking
  getElementCenterCoordinates(element: HTMLElement): { x: number; y: number } | null {
    if (!this.trackListContainer) return null;

    const containerRect = this.trackListContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const centerX = elementRect.left + elementRect.width / 2 - containerRect.left;
    const centerY = elementRect.top + elementRect.height / 2 - containerRect.top;
    
    // Validate element is within container bounds
    if (centerX < 0 || centerX > containerRect.width || centerY < 0 || centerY > containerRect.height) {
      if (this.options.enableDebug) {
        console.warn('[RippleCanvas] Element center coordinates outside container bounds');
      }
      
      // Clamp to container bounds
      return {
        x: Math.max(0, Math.min(containerRect.width, centerX)),
        y: Math.max(0, Math.min(containerRect.height, centerY))
      };
    }
    
    return { x: centerX, y: centerY };
  }

  /**
   * Update musical context for variant selection
   */
  updateMusicContext(context: { bpm?: number; intensity?: number; harmonicMode?: string; energy?: number }): void {
    this.lastMusicContext = { ...context };
    
    // Update variant system
    if (context.bpm !== undefined) {
      this.variantSystem.updateBeatContext(context.intensity || 0.5);
    }
    
    if (context.harmonicMode) {
      this.variantSystem.updateHarmonicMode(context.harmonicMode);
    }
    
    // Update physics engine
    this.physicsEngine.updateMusicalContext(context.bpm, context.intensity, context.energy);
    
    if (this.options.enableDebug) {
      console.log('[RippleCanvas] Updated music context:', context);
    }
  }

  /**
   * Update harmonic colors for organic ripples
   */
  updateHarmonicColors(colors: HarmonicColorData): void {
    this.harmonicColors = colors;
    
    if (this.options.enableDebug) {
      console.log('[RippleCanvas] Updated harmonic colors:', colors);
    }
  }

  /**
   * Update performance budget
   */
  updatePerformanceBudget(budget: number): void {
    this.options.performanceBudget = budget;
    this.variantSystem.updatePerformanceBudget(budget);
    
    if (this.options.enableDebug) {
      console.log(`[RippleCanvas] Updated performance budget: ${budget}ms`);
    }
  }

  destroy(): void {
    // Clear all active ripples
    this.activeRipples.forEach(ripple => ripple.reset());
    this.activeRipples.clear();

    // Destroy pool
    this.ripplePool.forEach(ripple => ripple.destroy());
    this.ripplePool = [];

    // Remove resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Remove from DOM
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  // Debug utilities
  getActiveRippleCount(): number {
    return this.activeRipples.size;
  }

  getPoolUtilization(): number {
    const activeCount = this.ripplePool.filter(ripple => ripple.getIsActive()).length;
    return activeCount / this.options.poolSize;
  }
}