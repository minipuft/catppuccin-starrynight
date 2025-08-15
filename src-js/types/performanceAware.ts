/**
 * PerformanceAware - Performance Monitoring and Optimization Interface
 * 
 * This interface defines performance monitoring, constraint management, and quality
 * scaling operations for visual systems. It consolidates performance-related
 * functionality from multiple scattered interfaces into a cohesive contract.
 * 
 * @architecture Phase 3 Interface Decomposition - Performance Consolidation
 * @responsibility Performance monitoring, quality scaling, resource management
 * @performance Real-time metrics with automatic quality adaptation
 */

import type { PerformanceConstraints } from './systems';

/**
 * Performance monitoring and optimization interface
 * 
 * Visual systems that implement this interface can participate in automatic
 * quality scaling and performance optimization coordinated by the
 * PerformanceAnalyzer and GradientConductor.
 */
export interface PerformanceAware {
  /**
   * Update performance constraints and quality settings
   * 
   * Called by the PerformanceAnalyzer when automatic quality scaling is triggered
   * or user manually changes performance settings.
   * 
   * @param constraints - New performance constraints
   */
  setPerformanceConstraints(constraints: PerformanceConstraints): void;
  
  /**
   * Get current rendering statistics
   * 
   * Used by PerformanceAnalyzer for monitoring and automatic quality scaling.
   * Should return real-time performance metrics.
   * 
   * @returns Current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics;
  
  /**
   * Handle performance mode changes
   * 
   * Called when the system switches between performance and quality modes
   * based on hardware capabilities or user preferences.
   * 
   * @param mode - New performance mode
   */
  onPerformanceModeChange?(mode: 'performance' | 'quality'): void;
  
  /**
   * Get performance budget usage
   * 
   * Returns current resource usage as percentage of allocated budget.
   * Used for proactive quality scaling before performance degrades.
   * 
   * @returns Resource usage percentages
   */
  getResourceUsage?(): ResourceUsage;
  
  /**
   * Optimize for current performance constraints
   * 
   * Triggers immediate optimization pass to meet current performance budget.
   * Should be lightweight and non-blocking.
   * 
   * @param aggressive - Whether to use aggressive optimization strategies
   */
  optimizePerformance?(aggressive?: boolean): void;
  
  /**
   * Check if system can handle additional performance load
   * 
   * Used before adding expensive visual effects or increasing quality.
   * 
   * @param estimatedLoad - Estimated additional performance cost (0.0-1.0)
   * @returns Whether the system can handle the additional load
   */
  canHandleAdditionalLoad?(estimatedLoad: number): boolean;
}

/**
 * Real-time performance metrics
 */
export interface PerformanceMetrics {
  /** Current frames per second */
  fps: number;
  /** Memory usage in megabytes */
  memoryUsageMB: number;
  /** CPU usage as percentage (0-100) */
  cpuUsagePercent: number;
  /** GPU usage as percentage (0-100) */
  gpuUsagePercent: number;
  /** Frame time in milliseconds */
  frameTimeMs: number;
  /** Timestamp when metrics were captured */
  timestamp?: number;
}

/**
 * Resource usage as percentage of allocated budget
 */
export interface ResourceUsage {
  /** CPU usage as percentage of budget (0-100) */
  cpu: number;
  /** GPU usage as percentage of budget (0-100) */
  gpu: number;
  /** Memory usage as percentage of budget (0-100) */
  memory: number;
  /** Overall performance score (0-100, higher is better) */
  performanceScore: number;
}

/**
 * Performance adaptation strategies
 */
export interface PerformanceAdaptation {
  /** Strategy name for debugging */
  name: string;
  /** Quality level this strategy targets */
  targetQuality: 'low' | 'medium' | 'high' | 'ultra';
  /** Estimated performance improvement (0.0-1.0) */
  performanceGain: number;
  /** Visual quality impact (0.0-1.0, lower is less impact) */
  visualImpact: number;
  /** Whether this adaptation is currently active */
  active: boolean;
}

/**
 * Performance tier classification
 */
export type PerformanceTier = 'excellent' | 'good' | 'degraded' | 'poor';

/**
 * Performance constraints for different device tiers
 */
export interface TieredPerformanceConstraints {
  [key: string]: PerformanceConstraints;
  excellent: PerformanceConstraints;
  good: PerformanceConstraints;
  degraded: PerformanceConstraints;
  poor: PerformanceConstraints;
}

/**
 * Advanced performance monitoring for systems that support detailed metrics
 */
export interface AdvancedPerformanceAware extends PerformanceAware {
  /**
   * Get detailed performance breakdown by subsystem
   * 
   * @returns Performance metrics categorized by subsystem
   */
  getDetailedMetrics(): DetailedPerformanceMetrics;
  
  /**
   * Get available performance adaptations
   * 
   * @returns List of performance optimizations that can be applied
   */
  getAvailableAdaptations(): PerformanceAdaptation[];
  
  /**
   * Apply specific performance adaptation
   * 
   * @param adaptationName - Name of adaptation to apply
   * @returns Whether adaptation was successfully applied
   */
  applyAdaptation(adaptationName: string): boolean;
  
  /**
   * Remove performance adaptation
   * 
   * @param adaptationName - Name of adaptation to remove
   * @returns Whether adaptation was successfully removed
   */
  removeAdaptation(adaptationName: string): boolean;
}

/**
 * Detailed performance metrics by subsystem
 */
export interface DetailedPerformanceMetrics extends PerformanceMetrics {
  /** Breakdown by visual subsystem */
  subsystems: {
    [subsystemName: string]: {
      fps: number;
      frameTimeMs: number;
      memoryUsageMB: number;
      active: boolean;
    };
  };
  /** Performance adaptations currently active */
  activeAdaptations: string[];
  /** Overall performance tier */
  tier: PerformanceTier;
}