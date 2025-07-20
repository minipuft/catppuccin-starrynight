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
    
    // Register default system configurations
    this.registerDefaultSystemConfigs();
    
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
   * Build selection criteria based on system configuration and context
   */
  private buildSelectionCriteria(
    systemKey: string,
    systemConfig: SystemCreationConfig | null,
    context: SystemCreationContext
  ): CreationStrategySelectionCriteria {
    // Determine complexity based on dependencies
    let complexity: 'simple' | 'medium' | 'complex' = 'simple';
    const depCount = (systemConfig?.requiredDependencies.length || 0) + 
                    (systemConfig?.optionalDependencies.length || 0);
    
    if (depCount === 0) complexity = 'simple';
    else if (depCount <= 3) complexity = 'medium';
    else complexity = 'complex';
    
    // Determine dependency requirements
    let dependencyRequirements: 'none' | 'basic' | 'advanced' | 'event-driven' = 'basic';
    
    if (systemConfig?.creationPreferences.eventDriven) {
      dependencyRequirements = 'event-driven';
    } else if (systemConfig?.creationPreferences.builderPattern) {
      dependencyRequirements = 'advanced';
    } else if (depCount === 0) {
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
   */
  private registerDefaultSystemConfigs(): void {
    // Performance Systems
    this.registerSystemConfig({
      systemKey: 'PerformanceAnalyzer',
      requiredDependencies: [],
      optionalDependencies: [],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    this.registerSystemConfig({
      systemKey: 'CSSVariableBatcher',
      requiredDependencies: [],
      optionalDependencies: [],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    this.registerSystemConfig({
      systemKey: 'DeviceCapabilityDetector',
      requiredDependencies: [],
      optionalDependencies: [],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    // Settings and Core Services
    this.registerSystemConfig({
      systemKey: 'SettingsManager',
      requiredDependencies: [],
      optionalDependencies: [],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    // Event-driven systems
    this.registerSystemConfig({
      systemKey: 'ColorHarmonyEngine',
      requiredDependencies: ['config', 'utils', 'performanceAnalyzer', 'settingsManager'],
      optionalDependencies: [],
      eventSubscriptions: ['colors/extracted'],
      constructorMapping: {
        parameterNames: ['config', 'utils', 'performanceAnalyzer', 'settingsManager'],
        dependencyMapping: {
          'config': 'config',
          'utils': 'utils', 
          'performanceAnalyzer': 'performanceAnalyzer',
          'settingsManager': 'settingsManager'
        }
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false
      }
    });

    this.registerSystemConfig({
      systemKey: 'MusicSyncService',
      requiredDependencies: ['config', 'utils', 'settingsManager', 'year3000System'],
      optionalDependencies: [],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false
      }
    });

    // Complex systems with multiple dependencies
    this.registerSystemConfig({
      systemKey: 'EnhancedMasterAnimationCoordinator',
      requiredDependencies: ['config', 'performanceCoordinator'],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ['config', 'performanceCoordinator'],
        dependencyMapping: {
          'config': 'config',
          'performanceCoordinator': 'performanceCoordinator'
        }
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    this.registerSystemConfig({
      systemKey: 'UnifiedPerformanceCoordinator',
      requiredDependencies: ['config', 'performanceAnalyzer'],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ['config', 'performanceAnalyzer'],
        dependencyMapping: {
          'config': 'config',
          'performanceAnalyzer': 'performanceAnalyzer'
        }
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });

    // UI Managers
    this.registerSystemConfig({
      systemKey: 'GlassmorphismManager',
      requiredDependencies: ['cssVariableBatcher'],
      optionalDependencies: ['config', 'utils', 'performanceAnalyzer', 'settingsManager'],
      creationPreferences: {
        useSingleton: false,
        lazyInit: true,
        eventDriven: false,
        builderPattern: false
      }
    });

    this.registerSystemConfig({
      systemKey: 'Card3DManager',
      requiredDependencies: ['cssVariableBatcher'],
      optionalDependencies: ['config', 'utils', 'performanceAnalyzer', 'settingsManager'],
      creationPreferences: {
        useSingleton: false,
        lazyInit: true,
        eventDriven: false,
        builderPattern: false
      }
    });

    // Integration Systems
    this.registerSystemConfig({
      systemKey: 'UnifiedSystemIntegration',
      requiredDependencies: ['year3000System'],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ['year3000System'],
        dependencyMapping: {
          'year3000System': 'year3000System'
        }
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false
      }
    });
  }
}

// ============================================================================
// Global Factory Export
// ============================================================================

/**
 * Global strategy-based factory instance
 */
export const globalStrategyBasedFactory = new StrategyBasedFactory();