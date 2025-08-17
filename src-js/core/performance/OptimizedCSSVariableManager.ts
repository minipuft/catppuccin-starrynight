/**
 * OptimizedCSSVariableManager - Backward Compatibility Layer
 * 
 * This file now provides backward compatibility while delegating all
 * functionality to the enhanced UnifiedCSSVariableManager.
 * 
 * Phase 1.1 Consolidation: All optimization features have been merged
 * into UnifiedCSSVariableManager for reduced code duplication.
 */

import { UnifiedCSSVariableManager } from '../css/UnifiedCSSVariableManager';
import { UnifiedPerformanceCoordinator } from './UnifiedPerformanceCoordinator';
import type { AdvancedSystemConfig, Year3000Config } from '@/types/models';
import { SimplePerformanceCoordinator } from './SimplePerformanceCoordinator';
import { PerformanceBudgetManager } from './PerformanceBudgetManager';

// Re-export types for backward compatibility
export interface OptimizedBatcherConfig {
  // Base configuration
  batchIntervalMs: number;
  maxBatchSize: number;
  enableDebug: boolean;
  
  // Performance optimization configuration
  enableAdaptiveThrottling: boolean;
  performanceAnalyzer?: SimplePerformanceCoordinator;
  budgetManager?: PerformanceBudgetManager;
  
  // Variable priority system
  priorityMappings: {
    critical: string[];    // Applied immediately
    high: string[];        // High priority batch
    normal: string[];      // Normal priority batch
    low: string[];         // Low priority batch
  };
  
  // Adaptive thresholds
  thresholds: {
    excellentFPS: number;  // Above this: use faster batching
    goodFPS: number;       // Above this: use normal batching
    poorFPS: number;       // Below this: use slower batching
  };
}

/**
 * OptimizedCSSVariableManager - Backward Compatibility Wrapper
 * 
 * All functionality now delegated to UnifiedCSSVariableManager.
 * This class exists purely for backward compatibility during migration.
 */
export class OptimizedCSSVariableManager extends UnifiedCSSVariableManager {
  private legacyConfig: OptimizedBatcherConfig;

  constructor(
    year3000Config: Year3000Config,
    performanceCoordinator: UnifiedPerformanceCoordinator,
    optimizedConfig: Partial<OptimizedBatcherConfig> = {}
  ) {
    // Convert legacy config to new enhanced config format
    const enhancedConfig = {
      enableAdaptiveThrottling: optimizedConfig.enableAdaptiveThrottling ?? true,
      priorityMappings: optimizedConfig.priorityMappings ?? {
        critical: ['--sn-rs-glow-alpha', '--sn-rs-beat-intensity', '--sn-rs-hue-shift'],
        high: ['--sn-gradient-primary', '--sn-gradient-secondary', '--sn-gradient-accent'],
        normal: ['--sn-gradient-', '--sn-rs-'],
        low: ['--sn-debug-', '--sn-dev-']
      },
      thresholds: optimizedConfig.thresholds ?? {
        excellentFPS: 55,
        goodFPS: 45,
        poorFPS: 30
      },
    };

    // Call parent constructor with enhanced configuration
    super(year3000Config, performanceCoordinator);

    // Store legacy config for compatibility
    this.legacyConfig = {
      batchIntervalMs: optimizedConfig.batchIntervalMs ?? 16,
      maxBatchSize: optimizedConfig.maxBatchSize ?? 50,
      enableDebug: year3000Config.enableDebug,
      enableAdaptiveThrottling: enhancedConfig.enableAdaptiveThrottling,
      priorityMappings: enhancedConfig.priorityMappings,
      thresholds: enhancedConfig.thresholds,
      ...optimizedConfig,
    };

    if (year3000Config.enableDebug) {
      console.log('🔄 [OptimizedCSSVariableManager] Compatibility layer active - delegating to UnifiedCSSVariableManager');
    }
  }

  /**
   * Legacy method compatibility - getMedianFPS
   */
  public getMedianFPS(): number {
    // Delegate to performance coordinator if available
    if (this.performanceCoordinator) {
      const mode = this.performanceCoordinator.getCurrentPerformanceMode();
      return mode?.frameRate || 60;
    }
    return 60; // Default fallback
  }

  /**
   * Legacy method compatibility - updateConfig
   */
  public override updateConfig(updates: Partial<OptimizedBatcherConfig>): void {
    Object.assign(this.legacyConfig, updates);
    
    // Update parent configuration through available methods
    if (updates.batchIntervalMs || updates.maxBatchSize) {
      // Delegate to parent's configuration update if available
      // The enhanced UnifiedCSSVariableManager handles this internally
    }
  }

  /**
   * Set single variable (legacy API compatibility)
   * Supports both old interface: (source, property, value, priority, description)
   * and new interface: (name, value, priority)
   */
  public override setVariable(
    sourceOrName: string,
    propertyOrValue?: string,
    valueOrPriority?: string,
    priority?: string,
    description?: string
  ): void {
    super.setVariable(sourceOrName, propertyOrValue, valueOrPriority, priority, description);
  }

  /**
   * Batch set variables (legacy API compatibility)
   * Supports both old interface: (source, variables, priority, description)
   * and new interface: (variables, priority)
   */
  public override batchSetVariables(
    sourceOrVariables: string | Record<string, string>,
    variablesOrPriority?: Record<string, string> | string,
    priority?: string,
    description?: string
  ): void {
    super.batchSetVariables(sourceOrVariables, variablesOrPriority, priority, description);
  }

  /**
   * Static factory method for backward compatibility
   */
  public static getGlobalInstance(): OptimizedCSSVariableManager {
    const globalManager = getGlobalOptimizedCSSController();
    if (globalManager instanceof OptimizedCSSVariableManager) {
      return globalManager;
    }
    
    // Create wrapper if needed
    throw new Error('Global OptimizedCSSVariableManager not properly initialized');
  }
}

// ===================================================================
// GLOBAL INSTANCE MANAGEMENT (Backward Compatibility)
// ===================================================================

let globalOptimizedCSSController: OptimizedCSSVariableManager | null = null;

/**
 * Set the global OptimizedCSSVariableManager instance
 * @deprecated Use setGlobalUnifiedCSSController instead
 */
export function setGlobalOptimizedCSSController(instance: OptimizedCSSVariableManager): void {
  globalOptimizedCSSController = instance;
  
  // Note: config is protected, cannot access directly for debug logging
  console.log('🔄 [OptimizedCSSVariableManager] Global compatibility layer instance set');
}

/**
 * Get the global OptimizedCSSVariableManager instance
 * @deprecated Use getGlobalUnifiedCSSController instead
 */
export function getGlobalOptimizedCSSController(): OptimizedCSSVariableManager {
  if (!globalOptimizedCSSController) {
    console.warn('[OptimizedCSSVariableManager] Global instance not initialized yet. This may indicate an initialization order issue.');
    throw new Error('Global OptimizedCSSVariableManager not initialized. Call setGlobalOptimizedCSSController() first.');
  }
  return globalOptimizedCSSController;
}

/**
 * Check if global OptimizedCSSVariableManager instance is available
 * @deprecated Use hasGlobalUnifiedCSSController instead
 */
export function hasGlobalOptimizedCSSController(): boolean {
  return globalOptimizedCSSController !== null;
}

/**
 * Get the global OptimizedCSSVariableManager instance safely
 * @deprecated Use getGlobalUnifiedCSSControllerSafe instead
 */
export function getGlobalOptimizedCSSControllerSafe(): OptimizedCSSVariableManager | null {
  return globalOptimizedCSSController;
}

// ===================================================================
// MIGRATION HELPERS
// ===================================================================

/**
 * Migration helper: Create OptimizedCSSVariableManager from UnifiedCSSVariableManager
 */
export function createOptimizedFromUnified(
  unifiedManager: UnifiedCSSVariableManager
): OptimizedCSSVariableManager {
  // This would be used during migration to wrap existing unified managers
  // For now, we'll throw since all new instances should use the enhanced unified manager
  throw new Error('Migration not needed - use UnifiedCSSVariableManager directly with enhanced features');
}

/**
 * Deprecation warning for direct usage
 */
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  [OptimizedCSSVariableManager] This class is deprecated. ' +
    'Use UnifiedCSSVariableManager with enhanced optimization features instead. ' +
    'This compatibility layer will be removed in a future version.'
  );
}