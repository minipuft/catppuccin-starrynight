/**
 * CSSGradientBackgroundSystem - CSS Fallback Visual Backend
 * 
 * Provides a pure CSS gradient background as the universal fallback for
 * the progressive enhancement ladder. Always available and performant.
 * 
 * @architecture Year3000System VisualBackplane
 * @performance Ultra-lightweight, no JavaScript animation
 * @accessibility Full support for prefers-reduced-motion
 */

import { 
  VisualBackplane, 
  IManagedSystem, 
  HealthCheckResult, 
  RGBStop, 
  MusicMetrics, 
  PerformanceConstraints, 
  BackendCapabilities 
} from '@/types/systems';
import { CSSVariableBatcher } from '@/core/performance/CSSVariableBatcher';

export interface CSSGradientConfig {
  enableMusicSync: boolean;
  enableAnimations: boolean;
  fadeTransitions: boolean;
  quality: 'low' | 'medium' | 'high';
}

/**
 * CSS Gradient Background System - Universal Fallback Backend
 */
export class CSSGradientBackgroundSystem implements VisualBackplane {
  public readonly backendId = 'css' as const;
  public readonly isReady = true; // CSS is always ready
  public initialized = false;
  
  public readonly capabilities: BackendCapabilities = {
    webgl: false,
    webgl2: false,
    highPerformance: false,
    maxTextureSize: 0,
    maxShaderComplexity: 'low'
  };
  
  private cssVariableBatcher: CSSVariableBatcher;
  private rootElement: HTMLElement | null = null;
  private backgroundElement: HTMLDivElement | null = null;
  
  private config: CSSGradientConfig;
  private constraints: PerformanceConstraints;
  private enabled = false;
  private currentPalette: RGBStop[] = [];
  private currentMusicMetrics: MusicMetrics | null = null;
  
  // Performance tracking
  private lastFrameTime = 0;
  private frameCount = 0;
  private memoryUsage = 0;
  
  constructor(
    cssVariableBatcher: CSSVariableBatcher,
    config: Partial<CSSGradientConfig> = {}
  ) {
    this.cssVariableBatcher = cssVariableBatcher;
    
    this.config = {
      enableMusicSync: true,
      enableAnimations: true,
      fadeTransitions: true,
      quality: 'medium',
      ...config
    };
    
    this.constraints = {
      targetFPS: 60,
      maxMemoryMB: 5, // Very low memory usage
      cpuBudgetPercent: 2, // Minimal CPU usage
      gpuBudgetPercent: 0, // No GPU usage
      qualityLevel: 'medium'
    };
  }
  
  /**
   * Initialize CSS gradient system
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // CSS is always \"ready\" - no async initialization needed
      this.initialized = true;
      
      console.log('[CSSGradientBackgroundSystem] Initialized (fallback backend)');
    } catch (error) {
      console.error('[CSSGradientBackgroundSystem] Initialization failed:', error);
      throw error;
    }
  }
  
  /**
   * Initialize with DOM element
   */
  async init(root: HTMLElement, constraints?: PerformanceConstraints): Promise<void> {
    this.rootElement = root;
    
    if (constraints) {
      this.constraints = { ...constraints };
    }
    
    await this.initialize();
    this.createBackgroundElement();
    this.setupAccessibilitySupport();
    
    console.log('[CSSGradientBackgroundSystem] Backend initialized with root element');
  }
  
  /**
   * Update color palette via CSS custom properties
   */
  setPalette(stops: RGBStop[], transition: number = 500): void {
    this.currentPalette = [...stops];
    
    if (stops.length === 0) return;
    
    // Convert RGBStops to CSS gradient
    const gradientStops = stops.map(stop => 
      `rgb(${Math.round(stop.r)}, ${Math.round(stop.g)}, ${Math.round(stop.b)}) ${Math.round(stop.position * 100)}%`
    ).join(', ');
    
    // Create multiple gradient variants for visual interest
    const primaryGradient = `linear-gradient(135deg, ${gradientStops})`;
    const secondaryGradient = `radial-gradient(ellipse at 30% 70%, ${gradientStops})`;
    const accentGradient = `conic-gradient(from 45deg at 50% 50%, ${gradientStops})`;
    
    // Update CSS variables with graceful transition
    this.cssVariableBatcher.setProperty('--sn.bg.css.primary-gradient', primaryGradient);
    this.cssVariableBatcher.setProperty('--sn.bg.css.secondary-gradient', secondaryGradient);
    this.cssVariableBatcher.setProperty('--sn.bg.css.accent-gradient', accentGradient);
    
    // Set transition duration
    if (this.config.fadeTransitions) {
      this.cssVariableBatcher.setProperty('--sn.bg.css.transition-duration', `${transition}ms`);
    }
    
    // Update background element directly for immediate visual feedback
    if (this.backgroundElement && this.enabled) {
      this.updateBackgroundElement();
    }
    
    console.log('[CSSGradientBackgroundSystem] Palette updated', {
      stops: stops.length,
      transition,
      enabled: this.enabled
    });
  }
  
  /**
   * Update music synchronization (minimal CPU impact)
   */
  setMusicMetrics(metrics: MusicMetrics): void {
    this.currentMusicMetrics = metrics;
    
    if (!this.config.enableMusicSync || !this.enabled) return;
    
    // Only update critical music variables for CSS animations
    if (metrics.beatIntensity !== undefined) {
      // Scale beat intensity for subtle CSS effects
      const scaledIntensity = Math.min(metrics.beatIntensity * 0.3, 0.3); // Max 30% intensity
      this.cssVariableBatcher.setProperty(
        '--sn.bg.css.beat-intensity', 
        scaledIntensity.toString()
      );
    }
    
    if (metrics.energy !== undefined) {
      // Use energy for gradient saturation
      const saturation = 0.8 + (metrics.energy * 0.4); // 0.8 to 1.2 range
      this.cssVariableBatcher.setProperty(
        '--sn.bg.css.energy-saturation', 
        saturation.toString()
      );
    }
    
    if (metrics.valence !== undefined) {
      // Use valence for gradient brightness
      const brightness = 0.9 + (metrics.valence * 0.2); // 0.9 to 1.1 range
      this.cssVariableBatcher.setProperty(
        '--sn.bg.css.valence-brightness', 
        brightness.toString()
      );
    }
  }
  
  /**
   * Update performance constraints
   */
  setPerformanceConstraints(constraints: PerformanceConstraints): void {
    this.constraints = { ...constraints };
    
    // Adjust quality based on constraints
    switch (constraints.qualityLevel) {
      case 'low':
        this.config.enableAnimations = false;
        this.config.enableMusicSync = false;
        break;
      case 'medium':
        this.config.enableAnimations = true;
        this.config.enableMusicSync = false;
        break;
      case 'high':
      case 'ultra':
        this.config.enableAnimations = true;
        this.config.enableMusicSync = true;
        break;
    }
    
    this.updateQualitySettings();
    
    console.log('[CSSGradientBackgroundSystem] Performance constraints updated', {
      quality: constraints.qualityLevel,
      animations: this.config.enableAnimations,
      musicSync: this.config.enableMusicSync
    });
  }
  
  /**
   * Enable/disable the CSS backend
   */
  setEnabled(enabled: boolean, fadeMs: number = 500): void {
    if (this.enabled === enabled) return;
    
    this.enabled = enabled;
    
    if (this.backgroundElement) {
      if (enabled) {
        // Fade in
        this.backgroundElement.style.transition = `opacity ${fadeMs}ms ease-in-out`;
        this.backgroundElement.style.opacity = '1';
        this.backgroundElement.style.pointerEvents = 'none';
        
        // Apply current palette
        if (this.currentPalette.length > 0) {
          this.updateBackgroundElement();
        }
      } else {
        // Fade out
        this.backgroundElement.style.transition = `opacity ${fadeMs}ms ease-in-out`;
        this.backgroundElement.style.opacity = '0';
        
        // Clean up after fade
        setTimeout(() => {
          if (!this.enabled && this.backgroundElement) {
            this.backgroundElement.style.pointerEvents = 'none';
          }
        }, fadeMs);
      }
    }
    
    // Update global CSS variable
    this.cssVariableBatcher.setProperty('--sn.bg.css.enabled', enabled ? '1' : '0');
    
    console.log(`[CSSGradientBackgroundSystem] ${enabled ? 'Enabled' : 'Disabled'} with ${fadeMs}ms fade`);
  }
  
  /**
   * Get performance metrics (minimal for CSS)
   */
  getPerformanceMetrics() {
    return {
      fps: 60, // CSS is always smooth
      memoryUsageMB: this.memoryUsage,
      cpuUsagePercent: this.config.enableAnimations ? 1 : 0,
      gpuUsagePercent: 0, // No GPU usage
      frameTimeMs: this.lastFrameTime
    };
  }
  
  /**
   * Handle resize events
   */
  resize(width: number, height: number): void {
    if (this.backgroundElement) {
      this.backgroundElement.style.width = `${width}px`;
      this.backgroundElement.style.height = `${height}px`;
    }
  }
  
  /**
   * Apply accessibility preferences
   */
  applyAccessibilityPreferences(preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    prefersTransparency: boolean;
  }): void {
    if (preferences.reducedMotion) {
      this.config.enableAnimations = false;
      this.config.enableMusicSync = false;
      
      // Disable all animations via CSS
      this.cssVariableBatcher.setProperty('--sn.bg.css.animations-enabled', '0');
    } else {
      this.config.enableAnimations = true;
      this.cssVariableBatcher.setProperty('--sn.bg.css.animations-enabled', '1');
    }
    
    if (preferences.highContrast) {
      // Increase contrast for accessibility
      this.cssVariableBatcher.setProperty('--sn.bg.css.contrast-boost', '1.3');
    } else {
      this.cssVariableBatcher.setProperty('--sn.bg.css.contrast-boost', '1.0');
    }
    
    if (preferences.prefersTransparency) {
      this.cssVariableBatcher.setProperty('--sn.bg.css.transparency-factor', '0.9');
    } else {
      this.cssVariableBatcher.setProperty('--sn.bg.css.transparency-factor', '1.0');
    }
    
    this.updateBackgroundElement();
  }
  
  /**
   * Animation update (minimal processing)
   */
  updateAnimation(deltaTime: number): void {
    this.lastFrameTime = deltaTime;
    this.frameCount++;
    
    // No heavy animation processing needed for CSS backend
    // CSS handles animations natively
  }
  
  /**
   * Health check (always healthy)
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const issues: string[] = [];
    
    // Check if DOM element exists
    if (!this.backgroundElement && this.initialized) {
      issues.push('Background element not created');
    }
    
    // Check if CSS variables are set
    if (this.currentPalette.length === 0) {
      issues.push('No color palette set');
    }
    
    return {
      healthy: issues.length === 0,
      ok: issues.length === 0,
      details: issues.length > 0 ? 'CSS backend has minor issues' : 'CSS backend healthy',
      issues,
      system: 'CSSGradientBackgroundSystem'
    };
  }
  
  /**
   * Cleanup resources
   */
  destroy(): void {
    // Remove DOM element
    if (this.backgroundElement) {
      this.backgroundElement.remove();
      this.backgroundElement = null;
    }
    
    this.rootElement = null;
    this.currentPalette = [];
    this.currentMusicMetrics = null;
    this.enabled = false;
    this.initialized = false;
    
    console.log('[CSSGradientBackgroundSystem] Destroyed');
  }
  
  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================
  
  private createBackgroundElement(): void {
    if (!this.rootElement) {
      console.warn('[CSSGradientBackgroundSystem] No root element provided');
      return;
    }
    
    // Create background container
    this.backgroundElement = document.createElement('div');
    this.backgroundElement.className = 'sn-css-gradient-background';
    this.backgroundElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: var(--sn.layout.z.background, -11);
      opacity: 0;
      pointer-events: none;
      transition: opacity 500ms ease-in-out;
      will-change: opacity;
    `;
    
    // Insert at the beginning of root element
    this.rootElement.insertBefore(this.backgroundElement, this.rootElement.firstChild);
    
    // Apply initial styles
    this.updateBackgroundElement();
    
    console.log('[CSSGradientBackgroundSystem] Background element created');
  }
  
  private updateBackgroundElement(): void {
    if (!this.backgroundElement) return;
    
    // Build CSS background based on quality settings
    let backgroundCSS = '';
    
    if (this.config.quality === 'low') {
      // Simple linear gradient
      backgroundCSS = `
        background: var(--sn.bg.css.primary-gradient, linear-gradient(135deg, #1e1e2e 0%, #313244 100%));
      `;
    } else if (this.config.quality === 'medium') {
      // Dual gradient blend
      backgroundCSS = `
        background: 
          var(--sn.bg.css.primary-gradient, linear-gradient(135deg, #1e1e2e 0%, #313244 100%)),
          var(--sn.bg.css.secondary-gradient, radial-gradient(ellipse at 30% 70%, #1e1e2e 0%, #313244 100%));
        background-blend-mode: overlay;
      `;
    } else {
      // Triple gradient blend with effects
      backgroundCSS = `
        background: 
          var(--sn.bg.css.primary-gradient, linear-gradient(135deg, #1e1e2e 0%, #313244 100%)),
          var(--sn.bg.css.secondary-gradient, radial-gradient(ellipse at 30% 70%, #1e1e2e 0%, #313244 100%)),
          var(--sn.bg.css.accent-gradient, conic-gradient(from 45deg, #1e1e2e 0%, #313244 100%));
        background-blend-mode: overlay, multiply;
        background-size: 100% 100%, 150% 150%, 200% 200%;
      `;
    }
    
    // Add music synchronization effects if enabled
    if (this.config.enableMusicSync && this.config.enableAnimations) {
      backgroundCSS += `
        filter: 
          saturate(var(--sn.bg.css.energy-saturation, 1.0))
          brightness(var(--sn.bg.css.valence-brightness, 1.0))
          contrast(var(--sn.bg.css.contrast-boost, 1.0));
        transform: scale(calc(1 + var(--sn.bg.css.beat-intensity, 0) * 0.02));
      `;
    }
    
    // Add transition properties
    if (this.config.fadeTransitions) {
      backgroundCSS += `
        transition: 
          background var(--sn.bg.css.transition-duration, 500ms) ease-in-out,
          filter 200ms ease-out,
          transform 100ms ease-out;
      `;
    }
    
    this.backgroundElement.style.cssText += backgroundCSS;
    
    // Update memory usage estimate
    this.memoryUsage = 0.5; // Minimal memory usage
  }
  
  private setupAccessibilitySupport(): void {
    // Listen for media query changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const updateAccessibility = () => {
      this.applyAccessibilityPreferences({
        reducedMotion: reducedMotionQuery.matches,
        highContrast: highContrastQuery.matches,
        prefersTransparency: false // No standard media query for this
      });
    };
    
    reducedMotionQuery.addEventListener('change', updateAccessibility);
    highContrastQuery.addEventListener('change', updateAccessibility);
    
    // Initial setup
    updateAccessibility();
  }
  
  private updateQualitySettings(): void {
    // Update CSS variables based on quality settings
    this.cssVariableBatcher.setProperty(
      '--sn.bg.css.quality-level', 
      this.constraints.qualityLevel
    );
    this.cssVariableBatcher.setProperty(
      '--sn.bg.css.animations-enabled', 
      this.config.enableAnimations ? '1' : '0'
    );
    this.cssVariableBatcher.setProperty(
      '--sn.bg.css.music-sync-enabled', 
      this.config.enableMusicSync ? '1' : '0'
    );
    
    // Update background element to reflect new settings
    this.updateBackgroundElement();
  }
}