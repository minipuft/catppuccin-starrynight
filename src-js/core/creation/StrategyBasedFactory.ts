/**
 * Strategy-Based Factory Implementation
 * 
 * Replaces hardcoded constructor logic with configurable creation strategies.
 * Eliminates "post-creation dependency linking" by using proper dependency
 * injection patterns at creation time.
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { globalSystemCreationRegistry } from "./SystemCreationStrategies";
import type {
  IStrategyBasedFactory,
  ISystemCreationStrategyRegistry,
  SystemCreationContext,
  SystemCreationResult,
  SystemCreationConfig,
  CreationStrategySelectionCriteria,
  SystemCreationError
} from "@/types/systemCreationStrategy";
import { StrategySelectionError } from "@/types/systemCreationStrategy";
import type { Year3000Config } from "@/types/models";
import * as Utils from "@/utils/core/Year3000Utilities";

// ============================================================================
// Strategy-Based Factory Implementation
// ============================================================================

/**
 * Factory that uses creation strategies to eliminate hardcoded constructor logic
 */
export class StrategyBasedFactory implements IStrategyBasedFactory {
  private strategyRegistry: ISystemCreationStrategyRegistry;
  private systemConfigs: Map<string, SystemCreationConfig> = new Map();
  private creationMetrics: {
    totalCreations: number;
    successfulCreations: number;
    averageCreationTime: number;
    strategyUsage: Record<string, number>;
  } = {
    totalCreations: 0,
    successfulCreations: 0,
    averageCreationTime: 0,
    strategyUsage: {}
  };

  constructor(strategyRegistry?: ISystemCreationStrategyRegistry) {
    this.strategyRegistry = strategyRegistry || globalSystemCreationRegistry;
    
    // System configurations are now managed by individual strategies
    // No need for duplicate registration here
    
    Y3K?.debug?.log("StrategyBasedFactory", "Factory initialized with strategy registry");
  }

  /**
   * Create system using best available strategy
   */
  async createSystem<T = any>(
    systemKey: string,
    SystemClass: new(...args: any[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>> {
    const startTime = performance.now();
    
    try {
      this.creationMetrics.totalCreations++;
      
      // Get system configuration
      const systemConfig = this.getSystemConfig(systemKey);
      
      // Determine selection criteria
      const criteria = this.buildSelectionCriteria(systemKey, systemConfig, context);
      
      // Select best strategy
      const strategy = this.strategyRegistry.selectStrategy(systemKey, criteria);
      if (!strategy) {
        throw new StrategySelectionError(systemKey, criteria);
      }
      
      // Update strategy usage metrics
      const strategyName = strategy.getStrategyName();
      this.creationMetrics.strategyUsage[strategyName] = 
        (this.creationMetrics.strategyUsage[strategyName] || 0) + 1;
      
      // Create system using selected strategy
      const result = await strategy.createSystem(SystemClass, context);
      
      // Update metrics
      if (result.success) {
        this.creationMetrics.successfulCreations++;
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      this.updateAverageCreationTime(totalTime);
      
      Y3K?.debug?.log("StrategyBasedFactory", `Created ${systemKey} using ${strategyName}`, {
        success: result.success,
        creationTime: result.creationTime,
        totalTime
      });
      
      return result;
      
    } catch (error) {
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      Y3K?.debug?.error("StrategyBasedFactory", `Failed to create ${systemKey}:`, error);
      
      // Return failed result
      return {
        system: null as any,
        success: false,
        creationTime: totalTime,
        strategy: 'unknown',
        injectedDependencies: [],
        warnings: [],
        error: error as Error,
        metadata: {
          requiresInitialization: false,
          pendingDependencies: [],
          context
        }
      };
    }
  }

  /**
   * Register system creation configuration
   */
  registerSystemConfig(config: SystemCreationConfig): void {
    this.systemConfigs.set(config.systemKey, config);
    Y3K?.debug?.log("StrategyBasedFactory", `Registered config for ${config.systemKey}`);
  }

  /**
   * Get system creation configuration
   */
  getSystemConfig(systemKey: string): SystemCreationConfig | null {
    return this.systemConfigs.get(systemKey) || null;
  }

  /**
   * Update creation strategy registry
   */
  setStrategyRegistry(registry: ISystemCreationStrategyRegistry): void {
    this.strategyRegistry = registry;
    Y3K?.debug?.log("StrategyBasedFactory", "Strategy registry updated");
  }

  /**
   * Get factory performance metrics
   */
  getMetrics(): typeof this.creationMetrics {
    return { ...this.creationMetrics };
  }

  /**
   * Reset performance metrics
   */
  resetMetrics(): void {
    this.creationMetrics = {
      totalCreations: 0,
      successfulCreations: 0,
      averageCreationTime: 0,
      strategyUsage: {}
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Build selection criteria based on system key and context
   * No longer relies on factory's own systemConfig - strategies manage their own configurations
   */
  private buildSelectionCriteria(
    systemKey: string,
    systemConfig: SystemCreationConfig | null,
    context: SystemCreationContext
  ): CreationStrategySelectionCriteria {
    // For system-specific selection criteria, rely on the strategies themselves
    // rather than trying to duplicate their configuration logic here
    
    // Determine complexity based on well-known system patterns
    let complexity: 'simple' | 'medium' | 'complex' = 'medium'; // Default to medium
    
    // Simple systems (no dependencies)
    const simpleSystems = [
      'DeviceCapabilityDetector',
      'PerformanceAnalyzer', 
      'UnifiedCSSConsciousnessController',
      'SettingsManager',
      'TimerConsolidationSystem'
    ];
    
    // Complex systems (multiple dependencies or special patterns)
    const complexSystems = [
      'GlassmorphismManager',
      'Card3DManager',
      'UnifiedCSSConsciousnessController',
      'EnhancedMasterAnimationCoordinator'
    ];
    
    if (simpleSystems.includes(systemKey)) {
      complexity = 'simple';
    } else if (complexSystems.includes(systemKey)) {
      complexity = 'complex';
    }
    
    // Determine dependency requirements based on known patterns
    let dependencyRequirements: 'none' | 'basic' | 'advanced' | 'event-driven' = 'basic';
    
    // Systems that use event-driven patterns
    if (systemKey === 'MusicSyncService' || systemKey === 'ColorHarmonyEngine') {
      dependencyRequirements = 'event-driven';
    } else if (simpleSystems.includes(systemKey)) {
      dependencyRequirements = 'none';
    }
    
    // Determine performance requirements
    let performance: 'standard' | 'optimized' | 'lightweight' = 'standard';
    
    if (context.metadata.priority === 'critical') {
      performance = 'optimized';
    } else if (context.preferences.monitorCreation) {
      performance = 'optimized';
    } else if (complexity === 'simple') {
      performance = 'lightweight';
    }
    
    return {
      complexity,
      dependencyRequirements,
      performance,
      resourceConstraints: {
        memoryLimited: context.metadata.resourceConstraints?.maxMemoryMB !== undefined,
        timeLimited: context.metadata.resourceConstraints?.maxInitTimeMs !== undefined,
        cpuLimited: context.metadata.priority === 'low'
      },
      creationContext: context.metadata.reason
    };
  }

  /**
   * Update running average creation time
   */
  private updateAverageCreationTime(newTime: number): void {
    const totalCreations = this.creationMetrics.totalCreations;
    const currentAverage = this.creationMetrics.averageCreationTime;
    
    this.creationMetrics.averageCreationTime = 
      ((currentAverage * (totalCreations - 1)) + newTime) / totalCreations;
  }

  /**
   * Register default system configurations for known systems
   * DEPRECATED: System configurations are now managed by individual strategies
   */
  private registerDefaultSystemConfigs(): void {
    // This method is no longer used - configurations are managed by individual strategies
    // in SystemCreationStrategies.ts to eliminate configuration duplication and conflicts
  }
}

// ============================================================================
// Global Factory Export
// ============================================================================

/**
 * Global strategy-based factory instance
 */
export const globalStrategyBasedFactory = new StrategyBasedFactory();