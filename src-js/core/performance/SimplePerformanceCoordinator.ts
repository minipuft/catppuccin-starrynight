/**
 * Simple Performance Coordinator
 * 
 * Replaces all complex performance monitoring systems with a simple
 * tier-based coordinator that integrates with UnifiedWebGLController.
 */

import { SimpleTierBasedPerformanceSystem } from "./SimpleTierBasedPerformanceSystem";
import { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";
import { EnhancedDeviceTierDetector } from "./EnhancedDeviceTierDetector";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";

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

/**
 * Simple Performance Coordinator
 * 
 * This replaces the complex ContinuousQualityManager, SimplePerformanceCoordinator,
 * and other complex monitoring systems with a simple tier-based approach.
 */
export class SimplePerformanceCoordinator implements IManagedSystem {
  public initialized = false;
  
  private performanceSystem: SimpleTierBasedPerformanceSystem;
  private webglIntegration: WebGLSystemsIntegration;
  private enhancedDeviceTierDetector: EnhancedDeviceTierDetector;

  constructor(
    enhancedDeviceTierDetector: EnhancedDeviceTierDetector,
    webglIntegration: WebGLSystemsIntegration
  ) {
    this.enhancedDeviceTierDetector = enhancedDeviceTierDetector;
    this.webglIntegration = webglIntegration;
    this.performanceSystem = new SimpleTierBasedPerformanceSystem(enhancedDeviceTierDetector);
    
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Created simple performance coordination");
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Initialize the tier-based performance system
    await this.performanceSystem.initialize();
    
    // Register WebGL integration with performance system
    this.performanceSystem.registerWebGLIntegration(this.webglIntegration);
    
    this.initialized = true;
    
    const tierResult = this.performanceSystem.getTierDetectionResult();
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Coordination established", {
      deviceTier: this.performanceSystem.getDeviceTier(),
      deviceDescription: this.performanceSystem.getDeviceDescription(),
      confidence: tierResult?.confidence,
      webglState: this.webglIntegration?.getWebGLState() || 'disabled'
    });
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "Not initialized",
        system: "SimplePerformanceCoordinator"
      };
    }
    
    // Check performance system health
    const performanceHealth = await this.performanceSystem.healthCheck();
    const webglHealth = this.webglIntegration 
      ? await this.webglIntegration.healthCheck()
      : { healthy: false, details: "WebGL integration not available" };
    
    const issues: string[] = [];
    
    if (!performanceHealth.healthy) {
      issues.push(`Performance: ${performanceHealth.details}`);
    }
    
    if (!webglHealth.healthy) {
      issues.push(`WebGL: ${webglHealth.details}`);
    }
    
    return {
      healthy: issues.length === 0,
      details: issues.length > 0 
        ? `Issues: ${issues.join(', ')}`
        : `Coordinating ${this.performanceSystem.getDeviceTier()} tier performance with ${this.webglIntegration?.getWebGLState() || 'disabled'} WebGL`,
      issues,
      system: "SimplePerformanceCoordinator"
    };
  }

  public destroy(): void {
    // Destroy performance system
    this.performanceSystem.destroy();
    
    this.initialized = false;
    
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Coordination destroyed");
  }

  public updateAnimation(deltaTime: number): void {
    // Forward to performance system (but it doesn't need animation updates)
    this.performanceSystem.updateAnimation(deltaTime);
  }

  // =============================================================================
  // PUBLIC API - Simplified Performance Management
  // =============================================================================

  /**
   * Get the performance system for direct access
   */
  public getPerformanceSystem(): SimpleTierBasedPerformanceSystem {
    return this.performanceSystem;
  }

  /**
   * Get current device performance tier
   */
  public getDeviceTier(): 'low' | 'medium' | 'high' {
    return this.performanceSystem.getDeviceTier();
  }

  /**
   * Get device description for debugging
   */
  public getDeviceDescription(): string {
    return this.performanceSystem.getDeviceDescription();
  }

  /**
   * Check if energy boost is currently active
   */
  public hasEnergyBoost(): boolean {
    return this.performanceSystem.hasEnergyBoost();
  }

  /**
   * Get current effective performance settings
   */
  public getCurrentSettings(): any {
    return this.performanceSystem.getEffectiveSettings();
  }

  /**
   * Get WebGL integration status
   */
  public getWebGLStatus(): {
    state: 'disabled' | 'css-fallback' | 'webgl-active';
    quality: 'low' | 'medium' | 'high';
    enabled: boolean;
  } {
    if (!this.webglIntegration) {
      return {
        state: 'disabled',
        quality: 'low',
        enabled: false
      };
    }
    
    return {
      state: this.webglIntegration.getWebGLState(),
      quality: this.webglIntegration.getQuality(),
      enabled: this.webglIntegration.isWebGLActive()
    };
  }

  /**
   * Get performance summary for debugging
   */
  public getPerformanceSummary(): {
    deviceTier: 'low' | 'medium' | 'high';
    deviceDescription: string;
    confidence: number;
    reasoning: string[];
    webglStatus: ReturnType<SimplePerformanceCoordinator['getWebGLStatus']>;
    energyBoost: boolean;
    settings: any;
  } {
    const tierResult = this.performanceSystem.getTierDetectionResult();
    
    return {
      deviceTier: this.getDeviceTier(),
      deviceDescription: this.getDeviceDescription(),
      confidence: tierResult?.confidence || 0,
      reasoning: tierResult?.reasoning || [],
      webglStatus: this.getWebGLStatus(),
      energyBoost: this.hasEnergyBoost(),
      settings: this.getCurrentSettings()
    };
  }

  // =============================================================================
  // REQUIRED INTERFACE COMPATIBILITY
  // =============================================================================

  /**
   * Start monitoring (required by Year3000System interface)
   */
  public startMonitoring(): void {
    // In the simple tier-based system, monitoring is handled automatically
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", "Monitoring started (tier-based system)");
  }

  // =============================================================================
  // ESSENTIAL LEGACY API METHODS (Still actively used)
  // =============================================================================

  public emitTrace(event: string, data?: any): void {
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `${event}`, data);
  }

  public recordMetric(name: string, value: number): void {
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Metric ${name}: ${value}`);
  }

  public getMedianFPS(): number {
    const tier = this.getDeviceTier();
    switch (tier) {
      case 'high': return 60;
      case 'medium': return 50;
      case 'low': return 30;
      default: return 30;
    }
  }

  public calculateHealthScore(): number {
    const tier = this.getDeviceTier();
    switch (tier) {
      case 'high': return 0.95;
      case 'medium': return 0.75;
      case 'low': return 0.50;
      default: return 0.50;
    }
  }

  public shouldReduceQuality(): boolean {
    return this.getDeviceTier() === 'low';
  }

  public timeOperation<T>(name: string, operation: () => T): T {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Operation ${name}: ${duration.toFixed(2)}ms`);
    return result;
  }

  public async timeOperationAsync<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Async operation ${name}: ${duration.toFixed(2)}ms`);
    return result;
  }

  public getAverageTime(name: string): number {
    const tier = this.getDeviceTier();
    switch (tier) {
      case 'high': return 5;
      case 'medium': return 15;
      case 'low': return 30;
      default: return 15;
    }
  }

  public updateBudget(name: string, value: number): void {
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Budget update ignored: ${name}=${value} (tier-based system)`);
  }

  public startTiming(name: string): string {
    const timingId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Timing started: ${name} (${timingId})`);
    return timingId;
  }

  public endTiming(timingId: string, context?: any): void {
    Y3KDebug?.debug?.log("SimplePerformanceCoordinator", `Timing ended: ${timingId}`, context);
  }
}