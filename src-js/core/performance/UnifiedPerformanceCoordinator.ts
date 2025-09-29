// Removed circular dependency - SimplePerformanceCoordinator now delegates to this class
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import type { AdvancedSystemConfig, Year3000Config } from '@/types/models';

// Performance analyzer interface to break circular dependency
export interface IPerformanceAnalyzer {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<any>;
  destroy(): void;
  recordMetric?(metric: string, value: number): void;
  getMedianFPS?(): number;
}

// Enhanced interfaces from PerformanceOptimizationManager integration
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

interface SubsystemMetrics {
  name: string;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  fps: number;
  lastUpdate: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
}

interface SystemHealthReport {
  overall: 'healthy' | 'warning' | 'critical';
  totalSubsystems: number;
  healthySubsystems: number;
  warningSubsystems: number;
  criticalSubsystems: number;
  subsystems: Map<string, SubsystemMetrics>;
  recommendations: string[];
  performanceScore: number; // 0-100
  lastUpdate: number;
}

interface PerformanceIssue {
  type: 'memory' | 'cpu' | 'fps' | 'render' | 'thermal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  subsystem: string;
  message: string;
  timestamp: number;
  resolved: boolean;
}

interface OptimizationStrategy {
  name: string;
  type: 'reduce_quality' | 'disable_feature' | 'throttle_updates' | 'memory_cleanup';
  priority: number;
  subsystem: string;
  action: (metrics: SubsystemMetrics) => void;
  condition: (metrics: SubsystemMetrics) => boolean;
  description: string;
}

interface IPerformanceMonitor {
  trackSubsystem(name: string, metrics: Partial<SubsystemMetrics>): void;
  getSystemHealth(): SystemHealthReport;
  enableAdaptiveOptimization(): void;
  disableAdaptiveOptimization(): void;
  registerOptimizationStrategy(strategy: OptimizationStrategy): void;
  triggerOptimization(issue: PerformanceIssue): void;
}

/**
 * PerformanceAnalyzer - Phase 3 System Consolidation
 * 
 * Consolidates all performance monitoring into a single unified interface:
 * - Centralizes performance tracking for all subsystems
 * - Provides unified health reporting and optimization strategies
 * - Coordinates adaptive performance optimization
 * - Integrates with existing PerformanceAnalyzer
 * 
 * @architecture Phase 3 of system consolidation
 * @performance Target: 20% reduction in performance monitoring overhead
 */
export class PerformanceAnalyzer implements IPerformanceMonitor {
  private static instance: PerformanceAnalyzer | null = null;
  
  private config: AdvancedSystemConfig | Year3000Config;
  private performanceAnalyzer: IPerformanceAnalyzer | null = null;
  private eventBus: typeof unifiedEventBus;
  
  // Subsystem tracking
  private subsystemMetrics: Map<string, SubsystemMetrics> = new Map();
  
  // Optimization management
  private optimizationStrategies: Map<string, OptimizationStrategy> = new Map();
  private adaptiveOptimizationEnabled: boolean = false;
  private optimizationInterval: NodeJS.Timeout | null = null;
  
  // Issue tracking
  private activeIssues: Map<string, PerformanceIssue> = new Map();
  private issueHistory: PerformanceIssue[] = [];
  
  // Health monitoring
  private lastHealthCheck: number = 0;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private readonly HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
  
  // Enhanced capabilities from PerformanceOptimizationManager consolidation
  private deviceCapabilities!: DeviceCapabilities; // Initialized in initializeDeviceCapabilities
  private thermalState!: ThermalState; // Initialized in initializeThermalMonitoring
  private batteryState: BatteryState | null = null;
  private currentPerformanceMode!: PerformanceMode; // Initialized in constructor
  private frameTimeHistory: number[] = [];
  private memoryUsageHistory: number[] = [];
  private lastOptimizationTime = 0;
  private optimizationCooldown = 5000; // 5 seconds
  
  // Performance thresholds
  private readonly PERFORMANCE_THRESHOLDS = {
    frameTime: {
      warning: 16.67, // 60fps
      critical: 33.33, // 30fps
    },
    memoryUsage: {
      warning: 50 * 1024 * 1024, // 50MB
      critical: 100 * 1024 * 1024, // 100MB
    },
    cpuUsage: {
      warning: 15, // 15%
      critical: 30, // 30%
    },
    fps: {
      warning: 50,
      critical: 30,
    },
  };
  
  // Performance modes configuration (from PerformanceOptimizationManager)
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
  
  constructor(config: AdvancedSystemConfig | Year3000Config, performanceAnalyzer?: IPerformanceAnalyzer) {
    this.config = config;
    this.performanceAnalyzer = performanceAnalyzer || null;
    this.eventBus = unifiedEventBus;
    
    // Initialize enhanced capabilities from PerformanceOptimizationManager
    this.initializeDeviceCapabilities();
    this.initializeThermalMonitoring();
    this.initializeBatteryMonitoring();
    this.currentPerformanceMode = this.PERFORMANCE_MODES.auto!;
    
    // Initialize default optimization strategies
    this.initializeDefaultStrategies();
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    // Subscribe to performance events
    this.subscribeToEvents();
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Initialized with enhanced device capabilities, thermal monitoring, and battery optimization');
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: Year3000Config, performanceAnalyzer?: IPerformanceAnalyzer): PerformanceAnalyzer {
    if (!PerformanceAnalyzer.instance) {
      if (!config || !performanceAnalyzer) {
        throw new Error('PerformanceAnalyzer requires config and performanceAnalyzer for first initialization');
      }
      PerformanceAnalyzer.instance = new PerformanceAnalyzer(config, performanceAnalyzer);
    }
    return PerformanceAnalyzer.instance;
  }
  
  /**
   * Track performance metrics for a subsystem
   */
  public trackSubsystem(name: string, metrics: Partial<SubsystemMetrics>): void {
    const currentTime = performance.now();
    
    // Get existing metrics or create new
    const existingMetrics = this.subsystemMetrics.get(name) || {
      name,
      frameTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      fps: 60,
      lastUpdate: currentTime,
      status: 'healthy' as const,
      issues: [],
    };
    
    // Update with new metrics
    const updatedMetrics: SubsystemMetrics = {
      ...existingMetrics,
      ...metrics,
      lastUpdate: currentTime,
    };
    
    // Determine health status
    updatedMetrics.status = this.calculateHealthStatus(updatedMetrics);
    
    // Update issues based on thresholds
    this.updateSubsystemIssues(updatedMetrics);
    
    // Store updated metrics
    this.subsystemMetrics.set(name, updatedMetrics);
    
    // Record with performance analyzer
    if (this.performanceAnalyzer) {
      this.performanceAnalyzer.recordMetric?.(`subsystem_${name}_frame_time`, updatedMetrics.frameTime);
      this.performanceAnalyzer.recordMetric?.(`subsystem_${name}_memory`, updatedMetrics.memoryUsage);
      this.performanceAnalyzer.recordMetric?.(`subsystem_${name}_fps`, updatedMetrics.fps);
    }
    
    // Trigger optimization if needed
    if (this.adaptiveOptimizationEnabled && updatedMetrics.status !== 'healthy') {
      this.checkAndTriggerOptimization(updatedMetrics);
    }
    
    if (this.config.enableDebug && updatedMetrics.status !== 'healthy') {
      console.warn(`[PerformanceAnalyzer] Subsystem ${name} status: ${updatedMetrics.status}`, updatedMetrics);
    }
  }
  
  /**
   * Get comprehensive system health report
   */
  public getSystemHealth(): SystemHealthReport {
    const currentTime = performance.now();
    const subsystems = new Map(this.subsystemMetrics);
    
    let healthyCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    
    // Count health statuses
    for (const metrics of subsystems.values()) {
      switch (metrics.status) {
        case 'healthy':
          healthyCount++;
          break;
        case 'warning':
          warningCount++;
          break;
        case 'critical':
          criticalCount++;
          break;
      }
    }
    
    // Calculate overall health
    const totalSubsystems = subsystems.size;
    let overall: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (criticalCount > 0) {
      overall = 'critical';
    } else if (warningCount > 0) {
      overall = 'warning';
    }
    
    // Calculate performance score (0-100)
    const performanceScore = this.calculatePerformanceScore(subsystems);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(subsystems);
    
    const healthReport: SystemHealthReport = {
      overall,
      totalSubsystems,
      healthySubsystems: healthyCount,
      warningSubsystems: warningCount,
      criticalSubsystems: criticalCount,
      subsystems,
      recommendations,
      performanceScore,
      lastUpdate: currentTime,
    };
    
    this.lastHealthCheck = currentTime;
    
    // Emit health report event
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.emit('performance:health-report', healthReport);
    
    return healthReport;
  }
  
  /**
   * Start monitoring (required by Year3000System interface)
   */
  public startMonitoring(): void {
    // Enable adaptive optimization and health monitoring
    this.enableAdaptiveOptimization();
    
    // Start health monitoring if not already started
    if (!this.healthCheckInterval) {
      this.startHealthMonitoring();
    }
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Monitoring started');
    }
  }

  /**
   * Enable adaptive optimization
   */
  public enableAdaptiveOptimization(): void {
    if (this.adaptiveOptimizationEnabled) return;
    
    this.adaptiveOptimizationEnabled = true;
    
    // Start optimization monitoring
    this.optimizationInterval = setInterval(() => {
      this.performOptimizationCheck();
    }, 2000); // Check every 2 seconds
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Adaptive optimization enabled');
    }
    
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.emit('performance:optimization-enabled', {
    //   timestamp: Date.now(),
    //   strategies: Array.from(this.optimizationStrategies.keys()),
    // });
  }
  
  /**
   * Disable adaptive optimization
   */
  public disableAdaptiveOptimization(): void {
    if (!this.adaptiveOptimizationEnabled) return;
    
    this.adaptiveOptimizationEnabled = false;
    
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Adaptive optimization disabled');
    }
    
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.emit('performance:optimization-disabled', {
    //   timestamp: Date.now(),
    // });
  }
  
  /**
   * Register an optimization strategy
   */
  public registerOptimizationStrategy(strategy: OptimizationStrategy): void {
    this.optimizationStrategies.set(strategy.name, strategy);
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Registered optimization strategy: ${strategy.name}`);
    }
  }
  
  /**
   * Trigger optimization for a specific issue
   */
  public triggerOptimization(issue: PerformanceIssue): void {
    // Store the issue
    this.activeIssues.set(`${issue.subsystem}:${issue.type}`, issue);
    this.issueHistory.push(issue);
    
    // Keep issue history manageable
    if (this.issueHistory.length > 100) {
      this.issueHistory.shift();
    }
    
    // Find applicable strategies
    const applicableStrategies = Array.from(this.optimizationStrategies.values())
      .filter(strategy => strategy.subsystem === issue.subsystem || strategy.subsystem === '*')
      .sort((a, b) => b.priority - a.priority);
    
    // Apply strategies based on issue severity
    for (const strategy of applicableStrategies) {
      const subsystemMetrics = this.subsystemMetrics.get(issue.subsystem);
      if (subsystemMetrics && strategy.condition(subsystemMetrics)) {
        try {
          strategy.action(subsystemMetrics);
          
          if (this.config.enableDebug) {
            console.log(`[PerformanceAnalyzer] Applied optimization strategy: ${strategy.name} for ${issue.subsystem}`);
          }
          
          // Emit optimization event
          // TODO: Add performance events to UnifiedEventBus when needed
          // this.eventBus.emit('performance:optimization-applied', {
          //   issue,
          //   strategy: strategy.name,
          //   timestamp: Date.now(),
          // });
          
          break; // Only apply one strategy per issue
        } catch (error) {
          console.error(`[PerformanceAnalyzer] Error applying optimization strategy ${strategy.name}:`, error);
        }
      }
    }
  }
  
  /**
   * Get current performance metrics for debugging
   */
  public getMetrics(): {
    subsystems: Map<string, SubsystemMetrics>;
    issues: Map<string, PerformanceIssue>;
    strategies: Map<string, OptimizationStrategy>;
    adaptiveOptimizationEnabled: boolean;
  } {
    return {
      subsystems: new Map(this.subsystemMetrics),
      issues: new Map(this.activeIssues),
      strategies: new Map(this.optimizationStrategies),
      adaptiveOptimizationEnabled: this.adaptiveOptimizationEnabled,
    };
  }
  
  /**
   * Destroy the coordinator and clean up resources
   */
  public destroy(): void {
    this.disableAdaptiveOptimization();
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    this.subsystemMetrics.clear();
    this.optimizationStrategies.clear();
    this.activeIssues.clear();
    this.issueHistory = [];
    
    if (PerformanceAnalyzer.instance === this) {
      PerformanceAnalyzer.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Initialize default optimization strategies
   */
  private initializeDefaultStrategies(): void {
    // Memory cleanup strategy
    this.registerOptimizationStrategy({
      name: 'memory-cleanup',
      type: 'memory_cleanup',
      priority: 100,
      subsystem: '*',
      description: 'Trigger garbage collection and memory cleanup',
      condition: (metrics) => metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage.warning,
      action: (metrics) => {
        // Trigger memory cleanup
        // TODO: Add performance events to UnifiedEventBus when needed
        // this.eventBus.emit('performance:memory-cleanup', {
        //   subsystem: metrics.name,
        //   memoryUsage: metrics.memoryUsage,
        //   timestamp: Date.now(),
        // });
      },
    });
    
    // FPS optimization strategy
    this.registerOptimizationStrategy({
      name: 'fps-optimization',
      type: 'reduce_quality',
      priority: 80,
      subsystem: '*',
      description: 'Reduce quality settings to improve FPS',
      condition: (metrics) => metrics.fps < this.PERFORMANCE_THRESHOLDS.fps.warning,
      action: (metrics) => {
        // TODO: Add performance events to UnifiedEventBus when needed
        // this.eventBus.emit('performance:reduce-quality', {
        //   subsystem: metrics.name,
        //   fps: metrics.fps,
        //   timestamp: Date.now(),
        // });
      },
    });
    
    // CPU throttling strategy
    this.registerOptimizationStrategy({
      name: 'cpu-throttling',
      type: 'throttle_updates',
      priority: 70,
      subsystem: '*',
      description: 'Throttle update frequency to reduce CPU usage',
      condition: (metrics) => metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.cpuUsage.warning,
      action: (metrics) => {
        // TODO: Add performance events to UnifiedEventBus when needed
        // this.eventBus.emit('performance:throttle-updates', {
        //   subsystem: metrics.name,
        //   cpuUsage: metrics.cpuUsage,
        //   timestamp: Date.now(),
        // });
      },
    });
  }
  
  /**
   * Calculate health status for subsystem
   */
  private calculateHealthStatus(metrics: SubsystemMetrics): 'healthy' | 'warning' | 'critical' {
    const issues = [];
    
    // Check frame time
    if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.frameTime.critical) {
      issues.push('critical-frame-time');
    } else if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.frameTime.warning) {
      issues.push('warning-frame-time');
    }
    
    // Check memory usage
    if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage.critical) {
      issues.push('critical-memory');
    } else if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage.warning) {
      issues.push('warning-memory');
    }
    
    // Check CPU usage
    if (metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.cpuUsage.critical) {
      issues.push('critical-cpu');
    } else if (metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.cpuUsage.warning) {
      issues.push('warning-cpu');
    }
    
    // Check FPS
    if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps.critical) {
      issues.push('critical-fps');
    } else if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps.warning) {
      issues.push('warning-fps');
    }
    
    // Update issues array
    metrics.issues = issues;
    
    // Determine overall status
    if (issues.some(issue => issue.startsWith('critical'))) {
      return 'critical';
    } else if (issues.some(issue => issue.startsWith('warning'))) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }
  
  /**
   * Update subsystem issues based on thresholds
   */
  private updateSubsystemIssues(metrics: SubsystemMetrics): void {
    const issueKey = `${metrics.name}:performance`;
    
    if (metrics.status === 'healthy') {
      // Remove resolved issues
      if (this.activeIssues.has(issueKey)) {
        const issue = this.activeIssues.get(issueKey)!;
        issue.resolved = true;
        this.activeIssues.delete(issueKey);
      }
    } else {
      // Create or update performance issue
      const issue: PerformanceIssue = {
        type: 'render',
        severity: metrics.status === 'critical' ? 'critical' : 'medium',
        subsystem: metrics.name,
        message: `Performance degradation detected: ${metrics.issues.join(', ')}`,
        timestamp: Date.now(),
        resolved: false,
      };
      
      this.activeIssues.set(issueKey, issue);
    }
  }
  
  /**
   * Check and trigger optimization if needed
   */
  private checkAndTriggerOptimization(metrics: SubsystemMetrics): void {
    const issueKey = `${metrics.name}:performance`;
    const issue = this.activeIssues.get(issueKey);
    
    if (issue && !issue.resolved) {
      this.triggerOptimization(issue);
    }
  }
  
  /**
   * Perform periodic optimization check
   */
  private performOptimizationCheck(): void {
    const currentTime = performance.now();
    
    // Check each subsystem for optimization opportunities
    for (const [name, metrics] of this.subsystemMetrics) {
      // Skip if metrics are too old (no recent updates)
      if (currentTime - metrics.lastUpdate > 10000) {
        continue;
      }
      
      // Check if optimization is needed
      if (metrics.status !== 'healthy') {
        this.checkAndTriggerOptimization(metrics);
      }
    }
  }
  
  /**
   * Calculate overall performance score
   */
  private calculatePerformanceScore(subsystems: Map<string, SubsystemMetrics>): number {
    if (subsystems.size === 0) return 100;
    
    let totalScore = 0;
    
    for (const metrics of subsystems.values()) {
      let subsystemScore = 100;
      
      // Penalize based on frame time
      if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.frameTime.warning) {
        subsystemScore -= 20;
      }
      if (metrics.frameTime > this.PERFORMANCE_THRESHOLDS.frameTime.critical) {
        subsystemScore -= 30;
      }
      
      // Penalize based on memory usage
      if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage.warning) {
        subsystemScore -= 15;
      }
      if (metrics.memoryUsage > this.PERFORMANCE_THRESHOLDS.memoryUsage.critical) {
        subsystemScore -= 25;
      }
      
      // Penalize based on CPU usage
      if (metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.cpuUsage.warning) {
        subsystemScore -= 10;
      }
      if (metrics.cpuUsage > this.PERFORMANCE_THRESHOLDS.cpuUsage.critical) {
        subsystemScore -= 20;
      }
      
      // Penalize based on FPS
      if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps.warning) {
        subsystemScore -= 15;
      }
      if (metrics.fps < this.PERFORMANCE_THRESHOLDS.fps.critical) {
        subsystemScore -= 25;
      }
      
      totalScore += Math.max(0, subsystemScore);
    }
    
    return Math.round(totalScore / subsystems.size);
  }
  
  /**
   * Generate recommendations based on system health
   */
  private generateRecommendations(subsystems: Map<string, SubsystemMetrics>): string[] {
    const recommendations: string[] = [];
    
    // Analyze issues across all subsystems
    const allIssues = Array.from(subsystems.values()).flatMap(metrics => metrics.issues);
    const issueCounts = new Map<string, number>();
    
    for (const issue of allIssues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
    
    // Generate recommendations based on common issues
    for (const [issue, count] of issueCounts) {
      if (count >= 2) { // Multiple subsystems affected
        switch (issue) {
          case 'critical-frame-time':
          case 'warning-frame-time':
            recommendations.push('Consider reducing animation quality or frequency');
            break;
          case 'critical-memory':
          case 'warning-memory':
            recommendations.push('Memory cleanup needed - consider reducing cache sizes');
            break;
          case 'critical-cpu':
          case 'warning-cpu':
            recommendations.push('High CPU usage detected - consider throttling updates');
            break;
          case 'critical-fps':
          case 'warning-fps':
            recommendations.push('Low FPS detected - consider disabling non-essential effects');
            break;
        }
      }
    }
    
    // Add general recommendations
    if (recommendations.length === 0) {
      recommendations.push('System performance is optimal');
    }
    
    return recommendations;
  }
  
  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.getSystemHealth();
    }, this.HEALTH_CHECK_INTERVAL);
  }
  
  /**
   * Subscribe to performance events
   */
  private subscribeToEvents(): void {
    // Subscribe to system performance events
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.subscribe('performance:memory-warning', (payload: any) => {
    //   if (payload.subsystem) {
    //     this.triggerOptimization({
    //       type: 'memory',
    //       severity: 'high',
    //       subsystem: payload.subsystem,
    //       message: `Memory usage warning: ${payload.usage}MB`,
    //       timestamp: Date.now(),
    //       resolved: false,
    //     });
    //   }
    // });
    
    // this.eventBus.subscribe('performance:fps-drop', (payload: any) => {
    //   if (payload.subsystem) {
    //     this.triggerOptimization({
    //       type: 'fps',
    //       severity: 'medium',
    //       subsystem: payload.subsystem,
    //       message: `FPS drop detected: ${payload.fps}`,
    //       timestamp: Date.now(),
    //       resolved: false,
    //     });
    //   }
    // });
  }
  
  // ===============================================================================
  // ENHANCED CAPABILITIES FROM PERFORMANCEOPTIMIZATIONMANAGER CONSOLIDATION
  // ===============================================================================
  
  /**
   * Initialize device capabilities detection
   */
  private initializeDeviceCapabilities(): void {
    const nav = navigator as any;
    const memory = (performance as any).memory;
    
    // Detect device capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    let maxTextureSize = 2048; // Safe default
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048;
    }
    
    // Estimate memory from available browser info
    const estimatedMemory = memory ? Math.round(memory.jsHeapSizeLimit / (1024 * 1024 * 1024)) : 4;
    
    // Determine performance tier based on capabilities
    let performanceTier: 'low' | 'medium' | 'high' | 'premium' = 'medium';
    if (estimatedMemory >= 8 && nav.hardwareConcurrency >= 8 && maxTextureSize >= 4096) {
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
      gpuAcceleration: !!gl,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent),
      supportsWebGL: !!gl,
      supportsBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      maxTextureSize,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
    
    if (this.config.enableDebug) {
      console.log('[PerformanceAnalyzer] Device capabilities detected:', this.deviceCapabilities);
    }
  }
  
  /**
   * Initialize thermal state monitoring
   */
  private initializeThermalMonitoring(): void {
    this.thermalState = {
      temperature: 'normal',
      throttleLevel: 0,
      cpuUsage: 0,
      gpuUsage: 0,
      memoryUsage: 0,
    };
    
    // Monitor performance metrics to estimate thermal state
    setInterval(() => {
      this.updateThermalState();
    }, 10000); // Check every 10 seconds
  }
  
  /**
   * Initialize battery monitoring if available
   */
  private async initializeBatteryMonitoring(): Promise<void> {
    try {
      const nav = navigator as any;
      if ('getBattery' in nav) {
        const battery = await nav.getBattery();
        this.batteryState = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
        
        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          if (this.batteryState) {
            this.batteryState.level = battery.level;
            this.adjustPerformanceModeForBattery();
          }
        });
        
        battery.addEventListener('chargingchange', () => {
          if (this.batteryState) {
            this.batteryState.charging = battery.charging;
            this.adjustPerformanceModeForBattery();
          }
        });
        
        if (this.config.enableDebug) {
          console.log('[PerformanceAnalyzer] Battery monitoring initialized');
        }
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.log('[PerformanceAnalyzer] Battery API not available');
      }
    }
  }
  
  /**
   * Update thermal state based on performance metrics
   */
  private updateThermalState(): void {
    const currentFPS = this.performanceAnalyzer?.getMedianFPS?.() || 60;
    const memory = (performance as any).memory;
    const memoryUsage = memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;
    
    // Estimate thermal state from performance degradation
    let temperature: 'normal' | 'warm' | 'hot' | 'critical' = 'normal';
    let throttleLevel = 0;
    
    if (currentFPS < 30 || memoryUsage > 0.9) {
      temperature = 'critical';
      throttleLevel = 0.8;
    } else if (currentFPS < 45 || memoryUsage > 0.7) {
      temperature = 'hot';
      throttleLevel = 0.4;
    } else if (currentFPS < 55 || memoryUsage > 0.5) {
      temperature = 'warm';
      throttleLevel = 0.2;
    }
    
    this.thermalState = {
      temperature,
      throttleLevel,
      cpuUsage: Math.min(1 - (currentFPS / 60), 1),
      gpuUsage: 0, // TODO: Implement GPU usage detection
      memoryUsage,
    };
    
    // Adjust performance mode based on thermal state
    if (temperature === 'critical' && this.currentPerformanceMode.name !== 'battery') {
      this.setPerformanceMode('battery');
    } else if (temperature === 'normal' && this.currentPerformanceMode.name === 'battery') {
      this.setPerformanceMode('auto');
    }
  }
  
  /**
   * Adjust performance mode based on battery state
   */
  private adjustPerformanceModeForBattery(): void {
    if (!this.batteryState) return;
    
    if (!this.batteryState.charging && this.batteryState.level < 0.2) {
      // Low battery, switch to battery mode
      this.setPerformanceMode('battery');
    } else if (this.batteryState.charging && this.currentPerformanceMode.name === 'battery') {
      // Charging, switch back to auto mode
      this.setPerformanceMode('auto');
    }
  }
  
  /**
   * Set performance mode
   */
  public setPerformanceMode(modeName: 'battery' | 'balanced' | 'performance' | 'auto'): void {
    const mode = this.PERFORMANCE_MODES[modeName];
    if (!mode) return;
    
    this.currentPerformanceMode = mode;
    
    // Emit performance mode change event
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.emit('performance:mode-changed', {
    //   mode: modeName,
    //   qualityLevel: mode.qualityLevel,
    //   frameRate: mode.frameRate,
    // });
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Performance mode changed to: ${modeName}`);
    }
  }
  
  /**
   * Get current device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }
  
  /**
   * Get current thermal state
   */
  public getThermalState(): ThermalState {
    return { ...this.thermalState };
  }
  
  /**
   * Get current battery state
   */
  public getBatteryState(): BatteryState | null {
    return this.batteryState ? { ...this.batteryState } : null;
  }
  
  /**
   * Get current performance mode
   */
  public getCurrentPerformanceMode(): PerformanceMode {
    return { ...this.currentPerformanceMode };
  }

  // ===============================================================================
  // LEGACY API METHODS (from SimplePerformanceCoordinator consolidation)
  // ===============================================================================

  /**
   * Emit trace event (legacy API compatibility)
   */
  public emitTrace(event: string, data?: any): void {
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Trace: ${event}`, data);
    }
    
    // TODO: Add performance events to UnifiedEventBus when needed
    // this.eventBus.emit('performance:trace', { event, data, timestamp: Date.now() });
  }

  /**
   * Record metric (legacy API compatibility)
   */
  public recordMetric(name: string, value: number): void {
    // Track as subsystem metric if it follows subsystem pattern
    const subsystemMatch = name.match(/^subsystem_(.+)_(.+)$/);
    if (subsystemMatch && subsystemMatch.length >= 3) {
      const subsystemName = subsystemMatch[1] || 'unknown';
      const metricType = subsystemMatch[2] || 'unknown';
      const existing = this.subsystemMetrics.get(subsystemName) || {
        name: subsystemName,
        frameTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        fps: 60,
        lastUpdate: performance.now(),
        status: 'healthy' as const,
        issues: [],
      };

      // Update the specific metric
      switch (metricType) {
        case 'frame_time':
          existing.frameTime = value;
          break;
        case 'memory':
          existing.memoryUsage = value;
          break;
        case 'fps':
          existing.fps = value;
          break;
        case 'cpu':
          existing.cpuUsage = value;
          break;
      }

      this.trackSubsystem(subsystemName, existing);
    }

    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Metric: ${name}=${value}`);
    }
  }

  /**
   * Get median FPS (legacy API compatibility)
   */
  public getMedianFPS(): number {
    // Calculate from subsystem metrics
    const fpsValues = Array.from(this.subsystemMetrics.values()).map(m => m.fps);
    if (fpsValues.length > 0) {
      fpsValues.sort((a, b) => a - b);
      const mid = Math.floor(fpsValues.length / 2);
      return fpsValues.length % 2 === 0 
        ? ((fpsValues[mid - 1] || 0) + (fpsValues[mid] || 0)) / 2 
        : (fpsValues[mid] || 0);
    }

    // Fallback based on device tier
    const tier = this.deviceCapabilities.performanceTier;
    switch (tier) {
      case 'premium': return 60;
      case 'high': return 60;
      case 'medium': return 50;
      case 'low': return 30;
      default: return 30;
    }
  }

  /**
   * Calculate health score (legacy API compatibility)
   */
  public calculateHealthScore(): number {
    const healthReport = this.getSystemHealth();
    return healthReport.performanceScore / 100; // Convert 0-100 to 0-1
  }

  /**
   * Check if quality should be reduced (legacy API compatibility)
   */
  public shouldReduceQuality(): boolean {
    const tier = this.deviceCapabilities.performanceTier;
    const thermalState = this.thermalState.temperature;
    const healthScore = this.calculateHealthScore();
    
    return tier === 'low' || thermalState === 'hot' || thermalState === 'critical' || healthScore < 0.5;
  }

  /**
   * Time operation (legacy API compatibility)
   */
  public timeOperation<T>(name: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;
    
    this.recordMetric(`operation_${name}_duration`, duration);
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Operation ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  /**
   * Time async operation (legacy API compatibility)
   */
  public async timeOperationAsync<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;
    
    this.recordMetric(`async_operation_${name}_duration`, duration);
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Async operation ${name}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  /**
   * Get average time for operation (legacy API compatibility)
   */
  public getAverageTime(name: string): number {
    // Estimate based on device tier for legacy compatibility
    const tier = this.deviceCapabilities.performanceTier;
    switch (tier) {
      case 'premium': return 3;
      case 'high': return 5;
      case 'medium': return 15;
      case 'low': return 30;
      default: return 15;
    }
  }

  /**
   * Update budget (legacy API compatibility)
   */
  public updateBudget(name: string, value: number): void {
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Budget update ignored: ${name}=${value} (using adaptive optimization instead)`);
    }
  }

  /**
   * Start timing (legacy API compatibility)
   */
  public startTiming(name: string): string {
    const timingId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Timing started: ${name} (${timingId})`);
    }
    
    return timingId;
  }

  /**
   * End timing (legacy API compatibility)
   */
  public endTiming(timingId: string, context?: any): void {
    if (this.config.enableDebug) {
      console.log(`[PerformanceAnalyzer] Timing ended: ${timingId}`, context);
    }
  }

  // ===============================================================================
  // WEBGL INTEGRATION (from SimplePerformanceCoordinator consolidation)
  // ===============================================================================

  /**
   * Get WebGL status (legacy API compatibility)
   */
  public getWebGLStatus(): {
    state: 'disabled' | 'css-fallback' | 'webgl-active';
    quality: 'low' | 'medium' | 'high';
    enabled: boolean;
  } {
    const webglSupported = this.deviceCapabilities.supportsWebGL;
    const performanceTier = this.deviceCapabilities.performanceTier;
    
    if (!webglSupported) {
      return {
        state: 'disabled',
        quality: 'low',
        enabled: false,
      };
    }

    // Determine quality based on performance tier and thermal state
    let quality: 'low' | 'medium' | 'high' = 'medium';
    if (performanceTier === 'premium' || performanceTier === 'high') {
      quality = this.thermalState.temperature === 'normal' ? 'high' : 'medium';
    } else if (performanceTier === 'low' || this.thermalState.temperature === 'critical') {
      quality = 'low';
    }

    return {
      state: 'webgl-active',
      quality,
      enabled: true,
    };
  }

  /**
   * Get performance summary (legacy API compatibility)
   */
  public getPerformanceSummary(): {
    deviceTier: 'low' | 'medium' | 'high';
    deviceDescription: string;
    confidence: number;
    reasoning: string[];
    webglStatus: ReturnType<PerformanceAnalyzer['getWebGLStatus']>;
    energyBoost: boolean;
    settings: any;
  } {
    const webglStatus = this.getWebGLStatus();
    const healthReport = this.getSystemHealth();
    
    // Map premium tier to high for legacy compatibility
    const deviceTier = this.deviceCapabilities.performanceTier === 'premium' 
      ? 'high' 
      : this.deviceCapabilities.performanceTier as 'low' | 'medium' | 'high';

    // Generate device description
    const deviceDescription = `${this.deviceCapabilities.memoryGB}GB RAM, ${this.deviceCapabilities.cpuCores} cores, ${
      this.deviceCapabilities.supportsWebGL ? 'WebGL' : 'No WebGL'
    }${this.deviceCapabilities.isMobile ? ', Mobile' : ''}`;

    // Calculate confidence based on health score
    const confidence = healthReport.performanceScore / 100;

    // Generate reasoning based on device capabilities and current state
    const reasoning: string[] = [];
    reasoning.push(`Device tier: ${deviceTier} (${this.deviceCapabilities.performanceTier})`);
    reasoning.push(`Memory: ${this.deviceCapabilities.memoryGB}GB`);
    reasoning.push(`CPU cores: ${this.deviceCapabilities.cpuCores}`);
    if (this.deviceCapabilities.supportsWebGL) {
      reasoning.push(`WebGL supported (${this.deviceCapabilities.maxTextureSize}px max texture)`);
    }
    if (this.thermalState.temperature !== 'normal') {
      reasoning.push(`Thermal state: ${this.thermalState.temperature}`);
    }

    // Energy boost detection based on thermal and battery state
    const energyBoost = this.currentPerformanceMode.name === 'performance' && 
                       this.thermalState.temperature === 'normal' &&
                       (this.batteryState?.charging || (this.batteryState?.level || 0) > 0.5 || !this.batteryState);

    return {
      deviceTier,
      deviceDescription,
      confidence,
      reasoning,
      webglStatus,
      energyBoost,
      settings: this.currentPerformanceMode,
    };
  }

  /**
   * Get device tier (legacy API compatibility)
   */
  public getDeviceTier(): 'low' | 'medium' | 'high' {
    // Map premium to high for legacy compatibility
    return this.deviceCapabilities.performanceTier === 'premium' 
      ? 'high' 
      : this.deviceCapabilities.performanceTier as 'low' | 'medium' | 'high';
  }

  /**
   * Get device description (legacy API compatibility)
   */
  public getDeviceDescription(): string {
    return `${this.deviceCapabilities.memoryGB}GB RAM, ${this.deviceCapabilities.cpuCores} cores, ${
      this.deviceCapabilities.supportsWebGL ? 'WebGL' : 'No WebGL'
    }${this.deviceCapabilities.isMobile ? ', Mobile' : ''}`;
  }

  /**
   * Check if energy boost is active (legacy API compatibility)
   */
  public hasEnergyBoost(): boolean {
    return this.currentPerformanceMode.name === 'performance' && 
           this.thermalState.temperature === 'normal' &&
           (this.batteryState?.charging || (this.batteryState?.level || 0) > 0.5 || !this.batteryState);
  }

  /**
   * Get current effective settings (legacy API compatibility)
   */
  public getCurrentSettings(): any {
    return {
      performanceMode: this.currentPerformanceMode,
      deviceCapabilities: this.deviceCapabilities,
      thermalState: this.thermalState,
      batteryState: this.batteryState,
      webglStatus: this.getWebGLStatus(),
    };
  }
}

// Backward compatibility alias
export const UnifiedPerformanceCoordinator = PerformanceAnalyzer;