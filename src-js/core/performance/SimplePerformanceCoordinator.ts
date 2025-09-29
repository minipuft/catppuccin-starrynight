/**
 * Performance Manager - High-Level Performance System Management
 *
 * Provides high-level performance management functionality with backward
 * compatibility. This manager delegates to PerformanceAnalyzer
 * for detailed performance monitoring and analysis.
 *
 * Architecture: Manager (high-level) → Coordinator (cross-system) → Controller (direct control)
 */

import { PerformanceAnalyzer } from "./UnifiedPerformanceCoordinator";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type { Year3000Config } from "@/types/models";

// =============================================================================
// TYPE EXPORTS - Legacy Compatibility Types
// =============================================================================

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface QualityCapability {
  name: string;
  enabled: boolean;
  qualityLevel: QualityLevel;
}

export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualityScalingCapable {
  adjustQuality(level: QualityLevel): void;
}

// Re-export types for backward compatibility
export type { DeviceCapabilities, ThermalState, BatteryState, PerformanceMode } from './UnifiedPerformanceCoordinator';

/**
 * Performance Manager - High-Level Performance Management
 *
 * Provides high-level performance management with delegated functionality.
 * Main entry point for performance system management across the application.
 */
export class PerformanceManager implements IManagedSystem {
  public initialized = false;
  
  private unifiedCoordinator: PerformanceAnalyzer;
  private config: Year3000Config;

  constructor(
    enhancedDeviceTierDetector?: any, // Deprecated parameter for compatibility
    webglIntegration?: any // Deprecated parameter for compatibility
  ) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn(
        '⚠️  [PerformanceManager] Direct instantiation is deprecated. ' +
        'Use PerformanceManager.getInstance() instead. ' +
        'This ensures proper system-wide performance management.'
      );
    }

    // Use global config for unified coordinator
    this.config = ADVANCED_SYSTEM_CONFIG as Year3000Config;
    
    // Get or create unified coordinator instance
    // We'll create a simple mock coordinator if the real one doesn't exist
    try {
      this.unifiedCoordinator = PerformanceAnalyzer.getInstance(this.config, this);
    } catch {
      // Create with self-reference for compatibility
      this.unifiedCoordinator = new PerformanceAnalyzer(this.config, this);
    }
    
    Y3KDebug?.debug?.log("PerformanceManager", "High-level performance management - delegating to PerformanceAnalyzer");
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Delegate initialization to unified coordinator
    // Note: PerformanceAnalyzer initializes itself in constructor
    this.initialized = true;
    
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Compatibility layer initialized - delegating to PerformanceAnalyzer");
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "Not initialized",
        system: "SimplePerformanceCoordinator"
      };
    }
    
    // Delegate to unified coordinator but adapt the response
    const unifiedHealth = this.unifiedCoordinator.getSystemHealth();
    
    return {
      healthy: unifiedHealth.overall === 'healthy',
      details: unifiedHealth.overall === 'healthy' 
        ? `Performance monitoring active (${unifiedHealth.totalSubsystems} subsystems)`
        : `Performance issues detected: ${unifiedHealth.recommendations.join(', ')}`,
      system: "SimplePerformanceCoordinator"
    };
  }

  public destroy(): void {
    // Note: We don't destroy the unified coordinator as it may be used by other systems
    this.initialized = false;
    
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Compatibility layer destroyed");
  }

  public updateAnimation(deltaTime: number): void {
    // Unified coordinator doesn't need animation updates, but we maintain interface
    // The sophisticated monitoring in unified coordinator handles this internally
  }

  // =============================================================================
  // PUBLIC API - Delegated to PerformanceAnalyzer
  // =============================================================================

  /**
   * Get the performance system for direct access
   * @deprecated Use PerformanceAnalyzer directly instead
   */
  public getPerformanceSystem(): any {
    return this.unifiedCoordinator;
  }

  /**
   * Get current device performance tier
   */
  public getDeviceTier(): 'low' | 'medium' | 'high' {
    return this.unifiedCoordinator.getDeviceTier();
  }

  /**
   * Get device description for debugging
   */
  public getDeviceDescription(): string {
    return this.unifiedCoordinator.getDeviceDescription();
  }

  /**
   * Check if energy boost is currently active
   */
  public hasEnergyBoost(): boolean {
    return this.unifiedCoordinator.hasEnergyBoost();
  }

  /**
   * Get current effective performance settings
   */
  public getCurrentSettings(): any {
    return this.unifiedCoordinator.getCurrentSettings();
  }

  /**
   * Get WebGL integration status
   */
  public getWebGLStatus(): {
    state: 'disabled' | 'css-fallback' | 'webgl-active';
    quality: 'low' | 'medium' | 'high';
    enabled: boolean;
  } {
    return this.unifiedCoordinator.getWebGLStatus();
  }

  /**
   * Get performance summary for debugging
   */
  public getPerformanceSummary(): {
    deviceTier: 'low' | 'medium' | 'high';
    deviceDescription: string;
    confidence: number;
    reasoning: string[];
    webglStatus: ReturnType<PerformanceManager['getWebGLStatus']>;
    energyBoost: boolean;
    settings: any;
  } {
    return this.unifiedCoordinator.getPerformanceSummary();
  }

  // =============================================================================
  // REQUIRED INTERFACE COMPATIBILITY
  // =============================================================================

  /**
   * Start monitoring (required by Year3000System interface)
   */
  public startMonitoring(): void {
    this.unifiedCoordinator.startMonitoring();
    Y3KDebug?.debug?.log("PerformanceManager", "Monitoring started (delegated to PerformanceAnalyzer)");
  }

  // =============================================================================
  // ESSENTIAL LEGACY API METHODS (Delegated to PerformanceAnalyzer)
  // =============================================================================

  public emitTrace(event: string, data?: any): void {
    return this.unifiedCoordinator.emitTrace(event, data);
  }

  public recordMetric(name: string, value: number): void {
    return this.unifiedCoordinator.recordMetric(name, value);
  }

  public getMedianFPS(): number {
    return this.unifiedCoordinator.getMedianFPS();
  }

  public calculateHealthScore(): number {
    return this.unifiedCoordinator.calculateHealthScore();
  }

  public shouldReduceQuality(): boolean {
    return this.unifiedCoordinator.shouldReduceQuality();
  }

  public timeOperation<T>(name: string, operation: () => T): T {
    return this.unifiedCoordinator.timeOperation(name, operation);
  }

  public async timeOperationAsync<T>(name: string, operation: () => Promise<T>): Promise<T> {
    return this.unifiedCoordinator.timeOperationAsync(name, operation);
  }

  public getAverageTime(name: string): number {
    return this.unifiedCoordinator.getAverageTime(name);
  }

  public updateBudget(name: string, value: number): void {
    return this.unifiedCoordinator.updateBudget(name, value);
  }

  public startTiming(name: string): string {
    return this.unifiedCoordinator.startTiming(name);
  }

  public endTiming(timingId: string, context?: any): void {
    return this.unifiedCoordinator.endTiming(timingId, context);
  }
}

// ===================================================================
// MIGRATION HELPERS
// ===================================================================

// =============================================================================
// BACKWARD COMPATIBILITY EXPORTS
// =============================================================================

/**
 * @deprecated Use PerformanceManager instead
 * Backward compatibility alias for SimplePerformanceCoordinator
 */
export const SimplePerformanceCoordinator = PerformanceManager;
export type SimplePerformanceCoordinator = PerformanceManager;

/**
 * Migration helper: Create PerformanceManager instance
 */
export function createPerformanceManager(): PerformanceManager {
  return new PerformanceManager();
}

/**
 * @deprecated Use createPerformanceManager instead
 * Backward compatibility helper
 */
export function createSimplePerformanceCoordinator(): PerformanceManager {
  return new PerformanceManager();
}

/**
 * Deprecation warning for module usage
 */
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  [SimplePerformanceCoordinator] This module is deprecated. ' +
    'Use PerformanceManager from this same module instead. ' +
    'The SimplePerformanceCoordinator alias will be removed in a future version.'
  );
}