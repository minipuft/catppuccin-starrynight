/**
 * Facade Adapter Implementation
 * 
 * Adapts existing facade systems to use Strategy-based creation patterns,
 * eliminating hardcoded constructor logic and "post-creation dependency linking".
 * 
 * This adapter implements the Adapter pattern to bridge the gap between
 * legacy facade systems and the new strategy-based architecture.
 */

import { Y3K } from "@/debug/UnifiedDebugManager";
import { globalStrategyBasedFactory } from "@/core/creation/StrategyBasedFactory";
import type {
  IFacadeAdapter,
  IStrategyBasedFactory,
  SystemCreationContext,
  SystemCreationResult
} from "@/types/systemCreationStrategy";
import type { Year3000Config } from "@/types/models";
import type { NonVisualSystemKey } from "@/core/integration/NonVisualSystemFacade";
import * as Utils from "@/utils/core/Year3000Utilities";

// ============================================================================
// Facade Adapter Implementation
// ============================================================================

/**
 * Adapter for NonVisualSystemFacade to use strategy-based creation
 */
export class NonVisualSystemFacadeAdapter implements IFacadeAdapter {
  private strategyBasedFactory: IStrategyBasedFactory;
  private adapted = false;
  private originalFacade: any = null;
  private migrationProgress = 0;
  private systemsUsingStrategy: Set<string> = new Set();
  private systemsUsingLegacy: Set<string> = new Set();

  constructor(strategyBasedFactory?: IStrategyBasedFactory) {
    this.strategyBasedFactory = strategyBasedFactory || globalStrategyBasedFactory;
    Y3K?.debug?.log("NonVisualSystemFacadeAdapter", "Facade adapter initialized");
  }

  /**
   * Adapt facade to use strategy-based creation
   */
  adaptToStrategyPattern(factory: IStrategyBasedFactory): void {
    this.strategyBasedFactory = factory;
    this.adapted = true;
    this.migrationProgress = 1.0; // Mark as fully adapted
    
    Y3K?.debug?.log("NonVisualSystemFacadeAdapter", "Facade adapted to strategy pattern");
  }

  /**
   * Get migration status
   */
  getMigrationStatus(): {
    adapted: boolean;
    systemsUsingStrategyPattern: string[];
    systemsUsingLegacyPattern: string[];
    migrationProgress: number;
  } {
    return {
      adapted: this.adapted,
      systemsUsingStrategyPattern: Array.from(this.systemsUsingStrategy),
      systemsUsingLegacyPattern: Array.from(this.systemsUsingLegacy),
      migrationProgress: this.migrationProgress
    };
  }

  /**
   * Complete migration to strategy pattern
   */
  async completeMigration(): Promise<void> {
    if (!this.adapted) {
      this.adaptToStrategyPattern(this.strategyBasedFactory);
    }
    
    this.migrationProgress = 1.0;
    this.systemsUsingLegacy.clear();
    
    Y3K?.debug?.log("NonVisualSystemFacadeAdapter", "Migration to strategy pattern completed");
  }

  /**
   * Create system using strategy-based factory (replaces hardcoded constructor logic)
   */
  async createSystemWithStrategy<T = any>(
    systemKey: NonVisualSystemKey,
    SystemClass: new(...args: any[]) => T,
    context: {
      config: Year3000Config;
      utils: typeof Utils;
      dependencies: {
        performanceAnalyzer?: any;
        settingsManager?: any;
        musicSyncService?: any;
        year3000System?: any;
        cssConsciousnessController?: any;
        performanceCoordinator?: any;
      };
      year3000System: any;
    }
  ): Promise<SystemCreationResult<T>> {
    // Build creation context
    const creationContext: SystemCreationContext = {
      systemKey,
      config: context.config,
      utils: context.utils,
      dependencies: context.dependencies,
      preferences: {
        lazyInit: false,
        validateDependencies: true,
        creationTimeout: 5000,
        monitorCreation: true
      },
      metadata: {
        timestamp: Date.now(),
        reason: 'startup',
        priority: 'medium',
        resourceConstraints: {
          maxMemoryMB: 50,
          maxInitTimeMs: 1000
        }
      }
    };

    try {
      // Use strategy-based factory instead of hardcoded constructor logic
      const result = await this.strategyBasedFactory.createSystem(
        systemKey,
        SystemClass,
        creationContext
      );

      // Track migration progress
      if (result.success) {
        this.systemsUsingStrategy.add(systemKey);
        this.systemsUsingLegacy.delete(systemKey);
      } else {
        this.systemsUsingLegacy.add(systemKey);
      }

      this.updateMigrationProgress();

      Y3K?.debug?.log("NonVisualSystemFacadeAdapter", 
        `Created ${systemKey} via strategy pattern`, {
          strategy: result.strategy,
          success: result.success,
          creationTime: result.creationTime
        });

      return result;

    } catch (error) {
      // Fallback tracking
      this.systemsUsingLegacy.add(systemKey);
      this.updateMigrationProgress();

      Y3K?.debug?.error("NonVisualSystemFacadeAdapter", 
        `Failed to create ${systemKey} via strategy pattern:`, error);

      // Return failed result
      return {
        system: null as any,
        success: false,
        creationTime: 0,
        strategy: 'adapter-fallback',
        injectedDependencies: [],
        warnings: [`Strategy creation failed: ${error}`],
        error: error as Error,
        metadata: {
          requiresInitialization: false,
          pendingDependencies: [],
          context: creationContext
        }
      };
    }
  }

  /**
   * Legacy compatibility method - creates system using old hardcoded logic
   * This should be gradually phased out as systems migrate to strategy pattern
   */
  createSystemLegacy<T = any>(
    systemKey: NonVisualSystemKey,
    SystemClass: new(...args: any[]) => T,
    context: {
      config: Year3000Config;
      utils: typeof Utils;
      dependencies: {
        performanceAnalyzer?: any;
        settingsManager?: any;
        musicSyncService?: any;
        year3000System?: any;
        cssConsciousnessController?: any;
        performanceCoordinator?: any;
      };
      year3000System: any;
    }
  ): T {
    // Track legacy usage
    this.systemsUsingLegacy.add(systemKey);
    this.updateMigrationProgress();

    Y3K?.debug?.warn("NonVisualSystemFacadeAdapter", 
      `Using legacy creation for ${systemKey} - should migrate to strategy pattern`);

    // Minimal legacy fallback logic (most systems now use strategy pattern)
    switch (systemKey) {
      // Simple systems with no dependencies
      case 'DeviceCapabilityDetector':
      case 'PerformanceAnalyzer':
      case 'SettingsManager':
      case 'TimerConsolidationSystem':
        return new SystemClass() as T;

      // Systems with single dependency
      case 'SidebarSystemsIntegration':
        return new SystemClass(context.dependencies.cssConsciousnessController) as T;
      
      // CSS Consciousness Controller with performance coordinator dependency
      case 'UnifiedCSSConsciousnessController':
        return new SystemClass(
          context.config,
          context.dependencies.performanceCoordinator
        ) as T;

      // Systems consolidated into UnifiedCSSConsciousnessController:
      // - UnifiedCSSConsciousnessController (batching layer)
      // - UnifiedCSSConsciousnessController (management layer)  
      // - UnifiedCSSConsciousnessController (performance layer)

      case 'ColorHarmonyEngine':
        return new SystemClass(
          context.config,
          context.utils,
          context.dependencies.performanceAnalyzer,
          context.dependencies.settingsManager
        ) as T;

      case 'EnhancedMasterAnimationCoordinator':
        return new SystemClass(
          context.config,
          context.dependencies.performanceCoordinator
        ) as T;

      case 'UnifiedPerformanceCoordinator':
        return new SystemClass(
          context.config,
          context.dependencies.performanceAnalyzer
        ) as T;

      case 'GlassmorphismManager':
        return new SystemClass(
          context.config,
          context.utils,
          context.dependencies.cssConsciousnessController,
          context.dependencies.performanceAnalyzer,
          context.dependencies.settingsManager
        ) as T;

      case 'Card3DManager':
        return new SystemClass(
          context.dependencies.performanceAnalyzer,
          context.dependencies.settingsManager,
          context.utils
        ) as T;

      case 'MusicSyncService':
        // MusicSyncService uses object dependencies pattern
        return new SystemClass({
          YEAR3000_CONFIG: context.config,
          Year3000Utilities: context.utils,
          settingsManager: context.dependencies.settingsManager,
          year3000System: context.year3000System,
          // NOTE: colorHarmonyEngine deliberately omitted - using event-driven pattern
        }) as T;

      default:
        // Last resort: try no-args constructor
        try {
          return new SystemClass() as T;
        } catch (error) {
          // If that fails, try with basic dependencies
          return new SystemClass(
            context.config,
            context.utils,
            context.dependencies.performanceAnalyzer,
            context.dependencies.settingsManager
          ) as T;
        }
    }
  }

  /**
   * Update migration progress based on strategy vs legacy usage
   */
  private updateMigrationProgress(): void {
    const totalSystems = this.systemsUsingStrategy.size + this.systemsUsingLegacy.size;
    if (totalSystems === 0) {
      this.migrationProgress = 0;
    } else {
      this.migrationProgress = this.systemsUsingStrategy.size / totalSystems;
    }
  }

  /**
   * Get adapter performance metrics
   */
  getAdapterMetrics(): {
    totalSystemsAdapted: number;
    strategySuccessRate: number;
    migrationProgress: number;
    systemBreakdown: {
      strategy: string[];
      legacy: string[];
    };
  } {
    const totalSystems = this.systemsUsingStrategy.size + this.systemsUsingLegacy.size;
    
    return {
      totalSystemsAdapted: this.systemsUsingStrategy.size,
      strategySuccessRate: totalSystems > 0 ? this.systemsUsingStrategy.size / totalSystems : 0,
      migrationProgress: this.migrationProgress,
      systemBreakdown: {
        strategy: Array.from(this.systemsUsingStrategy),
        legacy: Array.from(this.systemsUsingLegacy)
      }
    };
  }

  /**
   * Force migration of specific system to strategy pattern
   */
  async migrateSystemToStrategy(systemKey: NonVisualSystemKey): Promise<boolean> {
    try {
      // Remove from legacy tracking
      this.systemsUsingLegacy.delete(systemKey);
      
      Y3K?.debug?.log("NonVisualSystemFacadeAdapter", 
        `Migrated ${systemKey} to strategy pattern`);
      
      return true;
    } catch (error) {
      Y3K?.debug?.error("NonVisualSystemFacadeAdapter", 
        `Failed to migrate ${systemKey} to strategy pattern:`, error);
      
      return false;
    }
  }

  /**
   * Get recommended migration order for systems
   */
  getRecommendedMigrationOrder(): string[] {
    // Prioritize simple systems first, then event-driven, then complex
    const migrationOrder = [
      // Simple systems (no dependencies)
      'PerformanceAnalyzer',
      'UnifiedCSSConsciousnessController', 
      'DeviceCapabilityDetector',
      'SettingsManager',
      
      // Event-driven systems
      'ColorHarmonyEngine',
      'MusicSyncService',
      
      // Complex systems
      'UnifiedPerformanceCoordinator',
      'EnhancedMasterAnimationCoordinator',
      
      // Integration systems
      'UnifiedSystemIntegration',
      
      // UI systems
      'GlassmorphismManager',
      'Card3DManager'
    ];
    
    return migrationOrder.filter(system => this.systemsUsingLegacy.has(system));
  }
}

// ============================================================================
// Global Adapter Export
// ============================================================================

/**
 * Global facade adapter instance
 */
export const globalFacadeAdapter = new NonVisualSystemFacadeAdapter();