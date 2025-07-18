import { PerformanceOptimizationManager, type DeviceCapabilities, type PerformanceMode } from '@/core/performance/PerformanceOptimizationManager';
import { UnifiedCSSVariableManager } from './UnifiedCSSVariableManager';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { Year3000Config } from '@/types/models';

export interface PerformanceCSSConfig {
  enableAdaptiveOptimization: boolean;
  enableThermalThrottling: boolean;
  enableBatteryOptimization: boolean;
  enableDeviceTierOptimization: boolean;
  debugPerformanceClasses: boolean;
}

/**
 * PerformanceCSSIntegration - Phase 3 Performance CSS Bridge
 * 
 * Bridges the PerformanceOptimizationManager with CSS performance mixins:
 * - Updates CSS variables based on performance optimization state
 * - Applies CSS classes for device tier and performance modes
 * - Coordinates CSS performance optimizations with TypeScript systems
 * - Provides dynamic performance adaptation through CSS variables
 * 
 * @architecture Phase 3 of CSS module refactoring
 * @performance Enables CSS-level performance optimization coordination
 */
export class PerformanceCSSIntegration {
  private static instance: PerformanceCSSIntegration | null = null;
  
  private config: Year3000Config;
  private cssConfig: PerformanceCSSConfig;
  private cssVariableManager: UnifiedCSSVariableManager;
  private performanceManager: PerformanceOptimizationManager;
  private eventBus: typeof GlobalEventBus;
  
  // Performance state tracking
  private currentDeviceCapabilities: DeviceCapabilities | null = null;
  private currentPerformanceMode: PerformanceMode | null = null;
  private lastCSSUpdate = 0;
  private cssUpdateThrottle = 100; // Update CSS at most every 100ms
  
  // CSS class management
  private appliedClasses: Set<string> = new Set();
  
  constructor(
    config: Year3000Config,
    cssVariableManager: UnifiedCSSVariableManager,
    performanceManager: PerformanceOptimizationManager
  ) {
    this.config = config;
    this.cssVariableManager = cssVariableManager;
    this.performanceManager = performanceManager;
    this.eventBus = GlobalEventBus;
    
    // Initialize CSS configuration
    this.cssConfig = {
      enableAdaptiveOptimization: true,
      enableThermalThrottling: true,
      enableBatteryOptimization: true,
      enableDeviceTierOptimization: true,
      debugPerformanceClasses: this.config.enableDebug,
    };
    
    // Get initial device capabilities and performance mode
    this.currentDeviceCapabilities = this.performanceManager.getDeviceCapabilities();
    this.currentPerformanceMode = this.performanceManager.getCurrentPerformanceMode();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Apply initial CSS optimizations
    this.applyInitialOptimizations();
    
    if (this.config.enableDebug) {
      console.log('[PerformanceCSSIntegration] Initialized with device tier:', this.currentDeviceCapabilities.performanceTier);
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(
    config?: Year3000Config,
    cssVariableManager?: UnifiedCSSVariableManager,
    performanceManager?: PerformanceOptimizationManager
  ): PerformanceCSSIntegration {
    if (!PerformanceCSSIntegration.instance) {
      if (!config || !cssVariableManager || !performanceManager) {
        throw new Error('PerformanceCSSIntegration requires all dependencies for first initialization');
      }
      PerformanceCSSIntegration.instance = new PerformanceCSSIntegration(
        config,
        cssVariableManager,
        performanceManager
      );
    }
    return PerformanceCSSIntegration.instance;
  }
  
  /**
   * Update CSS optimization configuration
   */
  public updateConfig(newConfig: Partial<PerformanceCSSConfig>): void {
    this.cssConfig = { ...this.cssConfig, ...newConfig };
    
    // Reapply optimizations with new config
    this.applyCurrentOptimizations();
    
    if (this.config.enableDebug) {
      console.log('[PerformanceCSSIntegration] Configuration updated:', this.cssConfig);
    }
  }
  
  /**
   * Force CSS performance update
   */
  public forceUpdate(): void {
    this.lastCSSUpdate = 0; // Reset throttle
    this.updateCSSPerformanceVariables();
    this.applyCurrentOptimizations();
  }
  
  /**
   * Get current CSS configuration
   */
  public getConfig(): PerformanceCSSConfig {
    return { ...this.cssConfig };
  }
  
  /**
   * Apply device-specific CSS classes
   */
  public applyDeviceOptimizations(): void {
    if (!this.cssConfig.enableDeviceTierOptimization || !this.currentDeviceCapabilities) return;
    
    // Remove existing device tier classes
    this.removeClassesByPrefix('device-tier-');
    this.removeClassesByPrefix('device-mobile-');
    this.removeClassesByPrefix('device-gpu-');
    
    // Apply device tier class
    const tierClass = `device-tier-${this.currentDeviceCapabilities.performanceTier}`;
    this.addCSSClass(tierClass);
    
    // Apply mobile optimization class
    if (this.currentDeviceCapabilities.isMobile) {
      this.addCSSClass('device-mobile-optimized');
    }
    
    // Apply GPU acceleration class
    if (this.currentDeviceCapabilities.gpuAcceleration) {
      this.addCSSClass('device-gpu-accelerated');
    } else {
      this.addCSSClass('device-gpu-fallback');
    }
    
    // Apply memory tier class
    const memoryTier = this.getMemoryTier(this.currentDeviceCapabilities.memoryGB);
    this.addCSSClass(`device-memory-${memoryTier}`);
  }
  
  /**
   * Apply performance mode CSS classes
   */
  public applyPerformanceModeOptimizations(): void {
    if (!this.currentPerformanceMode) return;
    
    // Remove existing performance mode classes
    this.removeClassesByPrefix('performance-mode-');
    
    // Apply current performance mode class
    const modeClass = `performance-mode-${this.currentPerformanceMode.name}`;
    this.addCSSClass(modeClass);
    
    // Apply optimization level class
    const optimizationClass = `optimization-level-${this.currentPerformanceMode.optimizationLevel}`;
    this.addCSSClass(optimizationClass);
  }
  
  /**
   * Apply thermal state CSS classes
   */
  public applyThermalOptimizations(thermalState: string): void {
    if (!this.cssConfig.enableThermalThrottling) return;
    
    // Remove existing thermal classes
    this.removeClassesByPrefix('thermal-');
    
    // Apply current thermal state class
    const thermalClass = `thermal-${thermalState}`;
    this.addCSSClass(thermalClass);
  }
  
  /**
   * Apply battery state CSS classes
   */
  public applyBatteryOptimizations(batteryLevel: number, charging: boolean): void {
    if (!this.cssConfig.enableBatteryOptimization) return;
    
    // Remove existing battery classes
    this.removeClassesByPrefix('battery-');
    
    // Apply battery level classes
    if (batteryLevel < 0.2) {
      this.addCSSClass('battery-low');
    } else if (batteryLevel < 0.5) {
      this.addCSSClass('battery-medium');
    } else {
      this.addCSSClass('battery-high');
    }
    
    // Apply charging state
    if (charging) {
      this.addCSSClass('battery-charging');
    }
  }
  
  /**
   * Enable/disable debug performance classes
   */
  public setDebugMode(enabled: boolean): void {
    this.cssConfig.debugPerformanceClasses = enabled;
    
    if (enabled) {
      this.addCSSClass('debug-performance');
    } else {
      this.removeCSSClass('debug-performance');
    }
  }
  
  /**
   * Get applied CSS classes
   */
  public getAppliedClasses(): string[] {
    return Array.from(this.appliedClasses);
  }
  
  /**
   * Destroy the integration
   */
  public destroy(): void {
    // Remove all applied CSS classes
    for (const className of this.appliedClasses) {
      document.body.classList.remove(className);
    }
    this.appliedClasses.clear();
    
    if (PerformanceCSSIntegration.instance === this) {
      PerformanceCSSIntegration.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[PerformanceCSSIntegration] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Subscribe to performance events
   */
  private subscribeToEvents(): void {
    // Subscribe to performance mode changes
    this.eventBus.subscribe('performance:mode-changed', (payload: any) => {
      this.currentPerformanceMode = this.performanceManager.getCurrentPerformanceMode();
      this.applyPerformanceModeOptimizations();
      this.updateCSSPerformanceVariables();
    });
    
    // Subscribe to thermal warnings
    this.eventBus.subscribe('performance:thermal-warning', (payload: any) => {
      this.applyThermalOptimizations(payload.temperature);
    });
    
    // Subscribe to auto-optimization events
    this.eventBus.subscribe('performance:auto-optimized', (payload: any) => {
      this.currentPerformanceMode = this.performanceManager.getCurrentPerformanceMode();
      this.applyCurrentOptimizations();
      this.updateCSSPerformanceVariables();
    });
    
    // Subscribe to memory pressure events
    this.eventBus.subscribe('performance:memory-pressure', (payload: any) => {
      this.updateMemoryPressureClasses(payload.level);
    });
  }
  
  /**
   * Apply initial CSS optimizations
   */
  private applyInitialOptimizations(): void {
    this.applyDeviceOptimizations();
    this.applyPerformanceModeOptimizations();
    this.updateCSSPerformanceVariables();
    
    // Apply debug classes if enabled
    if (this.cssConfig.debugPerformanceClasses) {
      this.setDebugMode(true);
    }
  }
  
  /**
   * Apply current optimizations
   */
  private applyCurrentOptimizations(): void {
    this.applyDeviceOptimizations();
    this.applyPerformanceModeOptimizations();
    
    // Get current performance metrics and apply optimizations
    const metrics = this.performanceManager.getPerformanceMetrics();
    
    if (metrics.batteryState) {
      this.applyBatteryOptimizations(metrics.batteryState.level, metrics.batteryState.charging);
    }
    
    // Apply thermal state
    const thermalTemp = (metrics.thermalState as any).temperature || 'normal';
    this.applyThermalOptimizations(thermalTemp);
  }
  
  /**
   * Update CSS performance variables
   */
  private updateCSSPerformanceVariables(): void {
    const now = Date.now();
    if (now - this.lastCSSUpdate < this.cssUpdateThrottle) return;
    
    this.lastCSSUpdate = now;
    
    if (!this.currentPerformanceMode || !this.currentDeviceCapabilities) return;
    
    // Update performance mode variables
    this.cssVariableManager.updatePerformanceVariables({
      'mode': this.currentPerformanceMode.name,
      'quality.level': this.currentPerformanceMode.qualityLevel,
      'fps.target': this.currentPerformanceMode.frameRate,
      'frame.budget': 1000 / this.currentPerformanceMode.frameRate,
      'optimization.level': this.currentPerformanceMode.optimizationLevel,
    });
    
    // Update device capability variables
    this.cssVariableManager.updatePerformanceVariables({
      'device.tier': this.currentDeviceCapabilities.performanceTier,
      'device.memory': this.currentDeviceCapabilities.memoryGB,
      'device.gpu': this.currentDeviceCapabilities.gpuAcceleration ? 1 : 0,
      'device.mobile': this.currentDeviceCapabilities.isMobile ? 1 : 0,
    });
    
    // Update quality-specific variables
    this.cssVariableManager.updatePerformanceVariables({
      'blur.quality': this.currentPerformanceMode.blurQuality,
      'shadow.quality': this.currentPerformanceMode.shadowQuality,
      'animation.quality': this.currentPerformanceMode.animationQuality,
      'effect.quality': this.currentPerformanceMode.effectQuality,
    });
  }
  
  /**
   * Add CSS class to document body
   */
  private addCSSClass(className: string): void {
    if (!this.appliedClasses.has(className)) {
      document.body.classList.add(className);
      this.appliedClasses.add(className);
    }
  }
  
  /**
   * Remove CSS class from document body
   */
  private removeCSSClass(className: string): void {
    if (this.appliedClasses.has(className)) {
      document.body.classList.remove(className);
      this.appliedClasses.delete(className);
    }
  }
  
  /**
   * Remove all classes with a specific prefix
   */
  private removeClassesByPrefix(prefix: string): void {
    const classesToRemove = Array.from(this.appliedClasses).filter(className => 
      className.startsWith(prefix)
    );
    
    for (const className of classesToRemove) {
      this.removeCSSClass(className);
    }
  }
  
  /**
   * Get memory tier based on available memory
   */
  private getMemoryTier(memoryGB: number): string {
    if (memoryGB >= 16) return 'high';
    if (memoryGB >= 8) return 'medium';
    if (memoryGB >= 4) return 'low';
    return 'minimal';
  }
  
  /**
   * Update memory pressure CSS classes
   */
  private updateMemoryPressureClasses(level: string): void {
    this.removeClassesByPrefix('memory-pressure-');
    this.addCSSClass(`memory-pressure-${level}`);
  }
}