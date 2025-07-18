import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';
import { EnhancedMasterAnimationCoordinator } from '@/core/animation/EnhancedMasterAnimationCoordinator';
import { UnifiedPerformanceCoordinator } from './UnifiedPerformanceCoordinator';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { Year3000Config } from '@/types/models';

export interface DeviceCapabilities {
  performanceTier: 'low' | 'medium' | 'high' | 'premium';
  memoryGB: number;
  cpuCores: number;
  gpuAcceleration: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  supportsBackdropFilter: boolean;
  maxTextureSize: number;
  devicePixelRatio: number;
}

export interface ThermalState {
  temperature: 'normal' | 'warm' | 'hot' | 'critical';
  throttleLevel: number; // 0-1
  cpuUsage: number; // 0-1
  gpuUsage: number; // 0-1
  memoryUsage: number; // 0-1
}

export interface BatteryState {
  level: number; // 0-1
  charging: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

export interface PerformanceMode {
  name: 'battery' | 'balanced' | 'performance' | 'auto';
  qualityLevel: number; // 0-1
  animationQuality: number; // 0-1
  effectQuality: number; // 0-1
  blurQuality: number; // 0-1
  shadowQuality: number; // 0-1
  frameRate: number; // Target FPS
  optimizationLevel: number; // 0-3
}

export interface PerformanceOptimizationSettings {
  autoOptimization: boolean;
  thermalThrottling: boolean;
  batteryOptimization: boolean;
  frameSkipThreshold: number;
  memoryThreshold: number;
  cpuThreshold: number;
  adaptiveQuality: boolean;
  debugMode: boolean;
}

/**
 * PerformanceOptimizationManager - Phase 3 CSS Performance Integration
 * 
 * Unifies performance optimization strategies across the theme:
 * - Device capability detection and adaptive optimization
 * - Thermal throttling and battery-aware performance scaling
 * - Dynamic quality adjustment based on real-time performance metrics
 * - Integration with unified CSS variable system for performance variables
 * - Coordination with animation and visual systems for performance-aware rendering
 * 
 * @architecture Phase 3 of CSS module refactoring
 * @performance Enables intelligent performance optimization based on device capabilities and real-time metrics
 */
export class PerformanceOptimizationManager {
  private static instance: PerformanceOptimizationManager | null = null;
  
  private config: Year3000Config;
  private cssVariableManager: UnifiedCSSVariableManager;
  private animationCoordinator: EnhancedMasterAnimationCoordinator;
  private performanceCoordinator: UnifiedPerformanceCoordinator;
  private eventBus: typeof GlobalEventBus;
  
  // Device and system state
  private deviceCapabilities: DeviceCapabilities;
  private thermalState: ThermalState;
  private batteryState: BatteryState | null = null;
  private currentPerformanceMode: PerformanceMode;
  private settings: PerformanceOptimizationSettings;
  
  // Performance monitoring
  private frameTimeHistory: number[] = [];
  private memoryUsageHistory: number[] = [];
  private lastOptimizationTime = 0;
  private optimizationCooldown = 5000; // 5 seconds
  
  // Performance thresholds
  private readonly PERFORMANCE_THRESHOLDS = {
    FRAME_TIME_CRITICAL: 33.33, // 30fps
    FRAME_TIME_WARNING: 20, // 50fps
    MEMORY_CRITICAL: 0.9, // 90% memory usage
    MEMORY_WARNING: 0.7, // 70% memory usage
    CPU_CRITICAL: 0.8, // 80% CPU usage
    CPU_WARNING: 0.6, // 60% CPU usage
    THERMAL_THROTTLE: 0.7, // 70% thermal threshold
  };
  
  // Performance modes configuration
  private readonly PERFORMANCE_MODES: Record<string, PerformanceMode> = {
    battery: {
      name: 'battery',
      qualityLevel: 0.4,
      animationQuality: 0.3,
      effectQuality: 0.2,
      blurQuality: 0.3,
      shadowQuality: 0.2,
      frameRate: 30,
      optimizationLevel: 3,
    },
    balanced: {
      name: 'balanced',
      qualityLevel: 0.8,
      animationQuality: 0.8,
      effectQuality: 0.7,
      blurQuality: 0.8,
      shadowQuality: 0.7,
      frameRate: 60,
      optimizationLevel: 1,
    },
    performance: {
      name: 'performance',
      qualityLevel: 1.0,
      animationQuality: 1.0,
      effectQuality: 1.0,
      blurQuality: 1.0,
      shadowQuality: 1.0,
      frameRate: 60,
      optimizationLevel: 0,
    },
    auto: {
      name: 'auto',
      qualityLevel: 0.8, // Will be dynamically adjusted
      animationQuality: 0.8,
      effectQuality: 0.8,
      blurQuality: 0.8,
      shadowQuality: 0.8,
      frameRate: 60,
      optimizationLevel: 1,
    },
  };
  
  constructor(
    config: Year3000Config,
    cssVariableManager: UnifiedCSSVariableManager,
    animationCoordinator: EnhancedMasterAnimationCoordinator,
    performanceCoordinator: UnifiedPerformanceCoordinator
  ) {
    this.config = config;
    this.cssVariableManager = cssVariableManager;
    this.animationCoordinator = animationCoordinator;
    this.performanceCoordinator = performanceCoordinator;
    this.eventBus = GlobalEventBus;
    
    // Initialize default settings
    this.settings = {
      autoOptimization: true,
      thermalThrottling: true,
      batteryOptimization: true,
      frameSkipThreshold: 45,
      memoryThreshold: 0.8,
      cpuThreshold: 0.7,
      adaptiveQuality: true,
      debugMode: this.config.enableDebug,
    };
    
    // Initialize device capabilities
    this.deviceCapabilities = this.detectDeviceCapabilities();
    
    // Initialize thermal state
    this.thermalState = {
      temperature: 'normal',
      throttleLevel: 0,
      cpuUsage: 0,
      gpuUsage: 0,
      memoryUsage: 0,
    };
    
    // Set initial performance mode
    this.currentPerformanceMode = this.PERFORMANCE_MODES.auto as PerformanceMode;
    
    // Initialize battery monitoring
    this.initializeBatteryMonitoring();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    // Apply initial optimizations
    this.applyPerformanceMode(this.currentPerformanceMode);
    
    if (this.config.enableDebug) {
      console.log('[PerformanceOptimizationManager] Initialized with device capabilities:', this.deviceCapabilities);
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(
    config?: Year3000Config,
    cssVariableManager?: UnifiedCSSVariableManager,
    animationCoordinator?: EnhancedMasterAnimationCoordinator,
    performanceCoordinator?: UnifiedPerformanceCoordinator
  ): PerformanceOptimizationManager {
    if (!PerformanceOptimizationManager.instance) {
      if (!config || !cssVariableManager || !animationCoordinator || !performanceCoordinator) {
        throw new Error('PerformanceOptimizationManager requires all dependencies for first initialization');
      }
      PerformanceOptimizationManager.instance = new PerformanceOptimizationManager(
        config,
        cssVariableManager,
        animationCoordinator,
        performanceCoordinator
      );
    }
    return PerformanceOptimizationManager.instance;
  }
  
  /**
   * Set performance mode manually
   */
  public setPerformanceMode(mode: 'battery' | 'balanced' | 'performance' | 'auto'): void {
    const performanceMode = this.PERFORMANCE_MODES[mode];
    if (!performanceMode) {
      console.warn(`[PerformanceOptimizationManager] Unknown performance mode: ${mode}`);
      return;
    }
    
    this.currentPerformanceMode = performanceMode;
    this.applyPerformanceMode(performanceMode);
    
    // Emit mode change event
    this.eventBus.publish('performance:mode-changed', {
      mode: performanceMode.name,
      timestamp: Date.now(),
    });
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceOptimizationManager] Performance mode set to: ${mode}`);
    }
  }
  
  /**
   * Update performance metrics and trigger optimization if needed
   */
  public updatePerformanceMetrics(metrics: {
    frameTime: number;
    memoryUsage: number;
    cpuUsage: number;
    gpuUsage: number;
  }): void {
    // Update frame time history
    this.frameTimeHistory.push(metrics.frameTime);
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }
    
    // Update memory usage history
    this.memoryUsageHistory.push(metrics.memoryUsage);
    if (this.memoryUsageHistory.length > 60) {
      this.memoryUsageHistory.shift();
    }
    
    // Update thermal state
    this.thermalState.cpuUsage = metrics.cpuUsage;
    this.thermalState.gpuUsage = metrics.gpuUsage;
    this.thermalState.memoryUsage = metrics.memoryUsage;
    
    // Check if optimization is needed
    if (this.settings.autoOptimization && this.shouldOptimize(metrics)) {
      this.performAutoOptimization(metrics);
    }
    
    // Update CSS variables
    this.updatePerformanceVariables(metrics);
  }
  
  /**
   * Get current device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }
  
  /**
   * Get current performance mode
   */
  public getCurrentPerformanceMode(): PerformanceMode {
    return { ...this.currentPerformanceMode };
  }
  
  /**
   * Get performance optimization settings
   */
  public getSettings(): PerformanceOptimizationSettings {
    return { ...this.settings };
  }
  
  /**
   * Update performance optimization settings
   */
  public updateSettings(newSettings: Partial<PerformanceOptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.config.enableDebug) {
      console.log('[PerformanceOptimizationManager] Settings updated:', this.settings);
    }
  }
  
  /**
   * Force performance optimization
   */
  public forceOptimization(): void {
    const avgFrameTime = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
    const avgMemoryUsage = this.memoryUsageHistory.reduce((sum, usage) => sum + usage, 0) / this.memoryUsageHistory.length;
    
    this.performAutoOptimization({
      frameTime: avgFrameTime,
      memoryUsage: avgMemoryUsage,
      cpuUsage: this.thermalState.cpuUsage,
    });
  }
  
  /**
   * Get performance metrics summary
   */
  public getPerformanceMetrics(): {
    averageFrameTime: number;
    averageMemoryUsage: number;
    thermalState: ThermalState;
    batteryState: BatteryState | null;
    currentMode: string;
    optimizationLevel: number;
  } {
    const avgFrameTime = this.frameTimeHistory.length > 0 
      ? this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length 
      : 0;
    
    const avgMemoryUsage = this.memoryUsageHistory.length > 0
      ? this.memoryUsageHistory.reduce((sum, usage) => sum + usage, 0) / this.memoryUsageHistory.length
      : 0;
    
    return {
      averageFrameTime: avgFrameTime,
      averageMemoryUsage: avgMemoryUsage,
      thermalState: { ...this.thermalState },
      batteryState: this.batteryState ? { ...this.batteryState } : null,
      currentMode: this.currentPerformanceMode.name,
      optimizationLevel: this.currentPerformanceMode.optimizationLevel,
    };
  }
  
  /**
   * Destroy the manager
   */
  public destroy(): void {
    if (PerformanceOptimizationManager.instance === this) {
      PerformanceOptimizationManager.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[PerformanceOptimizationManager] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    // Detect performance tier based on various factors
    const memoryGB = (navigator as any).deviceMemory || 4; // Default to 4GB
    const cpuCores = navigator.hardwareConcurrency || 4; // Default to 4 cores
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Determine performance tier
    let performanceTier: DeviceCapabilities['performanceTier'] = 'medium';
    if (memoryGB >= 16 && cpuCores >= 8) {
      performanceTier = 'premium';
    } else if (memoryGB >= 8 && cpuCores >= 4) {
      performanceTier = 'high';
    } else if (memoryGB >= 4 && cpuCores >= 2) {
      performanceTier = 'medium';
    } else {
      performanceTier = 'low';
    }
    
    // Check mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    
    // WebGL capabilities
    const supportsWebGL = !!gl;
    const maxTextureSize = gl ? (gl as WebGLRenderingContext).getParameter((gl as WebGLRenderingContext).MAX_TEXTURE_SIZE) : 2048;
    
    // Backdrop filter support
    const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(1px)');
    
    return {
      performanceTier,
      memoryGB,
      cpuCores,
      gpuAcceleration: supportsWebGL,
      isMobile,
      supportsWebGL,
      supportsBackdropFilter,
      maxTextureSize,
      devicePixelRatio,
    };
  }
  
  /**
   * Initialize battery monitoring
   */
  private async initializeBatteryMonitoring(): Promise<void> {
    try {
      // @ts-ignore - Battery API is not in standard types
      const battery = await navigator.getBattery?.();
      if (battery) {
        this.batteryState = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
        
        // Listen for battery events
        battery.addEventListener('levelchange', () => {
          if (this.batteryState) {
            this.batteryState.level = battery.level;
            this.checkBatteryOptimization();
          }
        });
        
        battery.addEventListener('chargingchange', () => {
          if (this.batteryState) {
            this.batteryState.charging = battery.charging;
            this.checkBatteryOptimization();
          }
        });
      }
    } catch (error) {
      // Battery API not available
      if (this.config.enableDebug) {
        console.log('[PerformanceOptimizationManager] Battery API not available');
      }
    }
  }
  
  /**
   * Subscribe to performance events
   */
  private subscribeToEvents(): void {
    // Subscribe to performance coordinator events
    this.eventBus.subscribe('performance:metrics-updated', (payload: any) => {
      this.updatePerformanceMetrics(payload);
    });
    
    // Subscribe to thermal events
    this.eventBus.subscribe('performance:thermal-warning', (payload: any) => {
      this.handleThermalWarning(payload.temperature);
    });
    
    // Subscribe to memory pressure events
    this.eventBus.subscribe('performance:memory-pressure', (payload: any) => {
      this.handleMemoryPressure(payload.level);
    });
    
    // Subscribe to animation coordinator events
    this.eventBus.subscribe('animation:performance-metrics', (payload: any) => {
      this.updatePerformanceMetrics({
        frameTime: payload.avgFrameTime,
        memoryUsage: 0, // Not available from animation coordinator
        cpuUsage: payload.avgFrameTime > 16.67 ? 0.7 : 0.3,
        gpuUsage: 0.2,
      });
    });
  }
  
  /**
   * Apply performance mode settings
   */
  private applyPerformanceMode(mode: PerformanceMode): void {
    // Update CSS variables
    this.cssVariableManager.updatePerformanceVariables({
      'mode': mode.name,
      'quality.level': mode.qualityLevel,
      'fps.target': mode.frameRate,
      'frame.budget': 1000 / mode.frameRate,
    });
    
    // Update animation system
    this.animationCoordinator.setPerformanceMode(mode.qualityLevel > 0.7 ? 'quality' : 'performance');
    
    // Update CSS classes on document body
    document.body.className = document.body.className.replace(/performance-mode-\w+/g, '');
    document.body.classList.add(`performance-mode-${mode.name}`);
    
    // Update device tier class
    document.body.className = document.body.className.replace(/device-tier-\w+/g, '');
    document.body.classList.add(`device-tier-${this.deviceCapabilities.performanceTier}`);
    
    // Update thermal state class
    document.body.className = document.body.className.replace(/thermal-\w+/g, '');
    document.body.classList.add(`thermal-${this.thermalState.temperature}`);
    
    // Update battery state if available
    if (this.batteryState) {
      document.body.className = document.body.className.replace(/battery-\w+/g, '');
      if (this.batteryState.level < 0.2) {
        document.body.classList.add('battery-low');
      } else if (this.batteryState.charging) {
        document.body.classList.add('battery-charging');
      }
    }
  }
  
  /**
   * Check if optimization is needed
   */
  private shouldOptimize(metrics: { frameTime: number; memoryUsage: number; cpuUsage: number }): boolean {
    const now = Date.now();
    if (now - this.lastOptimizationTime < this.optimizationCooldown) {
      return false;
    }
    
    // Check frame time
    if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.FRAME_TIME_CRITICAL) {
      return true;
    }
    
    // Check memory usage
    if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL) {
      return true;
    }
    
    // Check CPU usage
    if (metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.CPU_CRITICAL) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Perform automatic optimization
   */
  private performAutoOptimization(metrics: { frameTime: number; memoryUsage: number; cpuUsage: number }): void {
    this.lastOptimizationTime = Date.now();
    
    let newMode = this.currentPerformanceMode;
    
    // Determine optimization level based on metrics
    if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.FRAME_TIME_CRITICAL ||
        metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL) {
      // Critical optimization needed
      newMode = this.PERFORMANCE_MODES.battery as PerformanceMode;
    } else if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.FRAME_TIME_WARNING ||
               metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
      // Moderate optimization needed
      newMode = this.PERFORMANCE_MODES.balanced as PerformanceMode;
    }
    
    // Apply battery optimization if enabled and battery is low
    if (this.settings.batteryOptimization && this.batteryState && 
        this.batteryState.level < 0.2 && !this.batteryState.charging) {
      newMode = this.PERFORMANCE_MODES.battery as PerformanceMode;
    }
    
    // Apply the optimized mode if it's different
    if (newMode.name !== this.currentPerformanceMode.name) {
      this.currentPerformanceMode = newMode;
      this.applyPerformanceMode(newMode);
      
      // Emit optimization event
      this.eventBus.publish('performance:auto-optimized', {
        mode: newMode.name,
        reason: 'performance-metrics',
        metrics,
        timestamp: Date.now(),
      });
      
      if (this.config.enableDebug) {
        console.log(`[PerformanceOptimizationManager] Auto-optimized to ${newMode.name} mode`);
      }
    }
  }
  
  /**
   * Update performance-related CSS variables
   */
  private updatePerformanceVariables(metrics: { frameTime: number; memoryUsage: number; cpuUsage: number; gpuUsage: number }): void {
    this.cssVariableManager.updatePerformanceVariables({
      'frame.budget': 1000 / this.currentPerformanceMode.frameRate,
      'fps.target': this.currentPerformanceMode.frameRate,
      'thermal.temperature': this.thermalState.cpuUsage,
      'thermal.throttle': this.thermalState.throttleLevel > 0,
    });
    
    if (this.batteryState) {
      this.cssVariableManager.updatePerformanceVariables({
        'battery.level': this.batteryState.level,
        'battery.charging': this.batteryState.charging,
        'battery.saver': this.batteryState.level < 0.2 && !this.batteryState.charging,
      });
    }
  }
  
  /**
   * Handle thermal warnings
   */
  private handleThermalWarning(temperature: 'warm' | 'hot' | 'critical'): void {
    this.thermalState.temperature = temperature;
    
    if (this.settings.thermalThrottling) {
      switch (temperature) {
        case 'warm':
          this.thermalState.throttleLevel = 0.2;
          break;
        case 'hot':
          this.thermalState.throttleLevel = 0.5;
          break;
        case 'critical':
          this.thermalState.throttleLevel = 1.0;
          // Force battery mode for critical thermal state
          this.setPerformanceMode('battery');
          break;
      }
      
      this.applyPerformanceMode(this.currentPerformanceMode);
    }
  }
  
  /**
   * Handle memory pressure
   */
  private handleMemoryPressure(level: 'low' | 'medium' | 'high'): void {
    if (level === 'high') {
      // Force optimization for high memory pressure
      this.setPerformanceMode('battery');
    } else if (level === 'medium') {
      this.setPerformanceMode('balanced');
    }
  }
  
  /**
   * Check battery optimization
   */
  private checkBatteryOptimization(): void {
    if (!this.settings.batteryOptimization || !this.batteryState) return;
    
    if (this.batteryState.level < 0.2 && !this.batteryState.charging) {
      // Low battery - switch to battery mode
      this.setPerformanceMode('battery');
    } else if (this.batteryState.charging && this.currentPerformanceMode.name === 'battery') {
      // Charging - can restore performance
      this.setPerformanceMode('balanced');
    }
  }
}