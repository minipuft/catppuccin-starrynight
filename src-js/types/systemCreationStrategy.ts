/**
 * System Creation Strategy Interfaces
 * 
 * Implements Strategy + Builder patterns for system creation to eliminate
 * "post-creation dependency linking" architectural smell.
 * 
 * Replaces hardcoded constructor logic with configurable creation strategies
 * that properly handle dependency injection at creation time.
 */

import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
// NOTE: SettingsManager import removed - file deleted in Phase 5, using TypedSettingsManager singleton
import type { CSSVariableWriter } from "@/core/css/CSSVariableWriter";
import type { MusicSyncService } from "@/audio/MusicSyncService";
import type { Year3000System } from "@/core/lifecycle/AdvancedThemeSystem";
import type { EnhancedDeviceTierDetector } from "@/core/performance/EnhancedDeviceTierDetector";
import type { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import type { WebGLSystemsIntegration } from "@/core/webgl/WebGLSystemsIntegration";
import * as Utils from "@/utils/core/ThemeUtilities";

// ============================================================================
// Core Creation Strategy Interfaces
// ============================================================================

/**
 * Context for system creation strategies
 */
export interface SystemCreationContext {
  /** System key being created */
  systemKey: string;
  
  /** Year 3000 configuration */
  config: AdvancedSystemConfig | Year3000Config;
  
  /** Utility functions */
  utils: typeof Utils;
  
  /** Available dependencies */
  dependencies: {
    performanceAnalyzer?: SimplePerformanceCoordinator;
    /** @deprecated Use TypedSettingsManager singleton via `settings` import from @/config */
    settingsManager?: any; // Legacy type - SettingsManager deleted in Phase 5
    musicSyncService?: MusicSyncService;
    year3000System?: Year3000System;
    cssController?: CSSVariableWriter;
    // Backward compatibility alias
    cssConsciousnessController?: CSSVariableWriter;
    performanceCoordinator?: SimplePerformanceCoordinator;
    // New simplified performance system dependencies
    simplePerformanceCoordinator?: SimplePerformanceCoordinator;
    enhancedDeviceTierDetector?: EnhancedDeviceTierDetector;
    webglSystemsIntegration?: WebGLSystemsIntegration;
    deviceCapabilityDetector?: DeviceCapabilityDetector;
  };
  
  /** Creation preferences */
  preferences: {
    /** Enable lazy initialization */
    lazyInit?: boolean;
    
    /** Enable dependency validation */
    validateDependencies?: boolean;
    
    /** Creation timeout in ms */
    creationTimeout?: number;
    
    /** Enable performance monitoring for creation */
    monitorCreation?: boolean;
  };
  
  /** Metadata for creation decision making */
  metadata: {
    /** Creation timestamp */
    timestamp: number;
    
    /** Creation reason */
    reason: 'startup' | 'runtime' | 'recovery' | 'upgrade';
    
    /** Priority level */
    priority: 'low' | 'medium' | 'high' | 'critical';
    
    /** Resource constraints */
    resourceConstraints?: {
      maxMemoryMB?: number;
      maxInitTimeMs?: number;
    };
  };
}

/**
 * Result of system creation
 */
export interface SystemCreationResult<T = unknown> {
  /** Created system instance */
  system: T;
  
  /** Creation success status */
  success: boolean;
  
  /** Creation time in milliseconds */
  creationTime: number;
  
  /** Strategy used for creation */
  strategy: string;
  
  /** Dependencies that were injected */
  injectedDependencies: string[];
  
  /** Any warnings or issues during creation */
  warnings: string[];
  
  /** Error if creation failed */
  error?: Error | undefined;
  
  /** Metadata about the created system */
  metadata: {
    /** Memory usage estimate */
    estimatedMemoryMB?: number;
    
    /** Initialization requirements */
    requiresInitialization: boolean;
    
    /** Dependencies that still need to be linked */
    pendingDependencies: string[];
    
    /** Creation context used */
    context: SystemCreationContext;
  };
}

/**
 * Strategy interface for system creation
 */
export interface ISystemCreationStrategy {
  /**
   * Get strategy name for debugging and metrics
   */
  getStrategyName(): string;
  
  /**
   * Check if strategy can create the given system
   */
  canCreate(context: SystemCreationContext): boolean;
  
  /**
   * Get estimated creation time for planning
   */
  getEstimatedCreationTime(context: SystemCreationContext): number;
  
  /**
   * Create system instance using this strategy
   */
  createSystem<T = unknown>(
    SystemClass: new(...args: unknown[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>>;
  
  /**
   * Validate dependencies before creation
   */
  validateDependencies(context: SystemCreationContext): {
    valid: boolean;
    missing: string[];
    warnings: string[];
  };
  
  /**
   * Get required dependencies for this strategy
   */
  getRequiredDependencies(systemKey: string): string[];
  
  /**
   * Get optional dependencies for this strategy
   */
  getOptionalDependencies(systemKey: string): string[];
}

// ============================================================================
// System Creation Strategy Registry
// ============================================================================

/**
 * Strategy selection criteria for system creation
 */
export interface CreationStrategySelectionCriteria {
  /** System complexity level */
  complexity: 'simple' | 'medium' | 'complex';
  
  /** Dependency requirements */
  dependencyRequirements: 'none' | 'basic' | 'advanced' | 'event-driven';
  
  /** Performance requirements */
  performance: 'standard' | 'optimized' | 'lightweight';
  
  /** Resource constraints */
  resourceConstraints?: {
    memoryLimited?: boolean;
    timeLimited?: boolean;
    cpuLimited?: boolean;
  };
  
  /** Creation context */
  creationContext: 'startup' | 'runtime' | 'recovery' | 'upgrade';
}

/**
 * Registry for managing system creation strategies
 */
export interface ISystemCreationStrategyRegistry {
  /**
   * Register a creation strategy
   */
  register(strategy: ISystemCreationStrategy): void;
  
  /**
   * Select best strategy for given criteria
   */
  selectStrategy(
    systemKey: string,
    criteria: CreationStrategySelectionCriteria
  ): ISystemCreationStrategy | null;
  
  /**
   * Get all registered strategies
   */
  getStrategies(): ISystemCreationStrategy[];
  
  /**
   * Get strategy by name
   */
  getStrategy(name: string): ISystemCreationStrategy | null;
  
  /**
   * Get strategies that can create a specific system
   */
  getStrategiesForSystem(systemKey: string): ISystemCreationStrategy[];
}

// ============================================================================
// Specific Creation Strategy Types
// ============================================================================

/**
 * Standard constructor strategy for simple systems
 */
export interface IStandardConstructorStrategy extends ISystemCreationStrategy {
  /**
   * Define constructor parameter mapping
   */
  getConstructorParameters(context: SystemCreationContext): unknown[];
}

/**
 * Event-driven creation strategy for systems that use events
 */
export interface IEventDrivenCreationStrategy extends ISystemCreationStrategy {
  /**
   * Setup event subscriptions during creation
   */
  setupEventSubscriptions(system: unknown, context: SystemCreationContext): void;
  
  /**
   * Get events that system will subscribe to
   */
  getEventSubscriptions(systemKey: string): string[];
}

/**
 * Builder pattern strategy for complex systems
 */
export interface IBuilderCreationStrategy extends ISystemCreationStrategy {
  /**
   * Create system using builder pattern
   */
  createWithBuilder<T = unknown>(
    SystemClass: new(...args: unknown[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>>;
  
  /**
   * Configure builder based on context
   */
  configureBuilder(builder: unknown, context: SystemCreationContext): void;
}

/**
 * Singleton creation strategy for shared systems
 */
export interface ISingletonCreationStrategy extends ISystemCreationStrategy {
  /**
   * Get or create singleton instance
   */
  getInstance<T = unknown>(
    SystemClass: new(...args: unknown[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>>;
  
  /**
   * Check if singleton exists
   */
  hasInstance(systemKey: string): boolean;
  
  /**
   * Clear singleton instance
   */
  clearInstance(systemKey: string): void;
}

// ============================================================================
// System-Specific Creation Configurations
// ============================================================================

/**
 * Configuration for specific system creation
 */
export interface SystemCreationConfig {
  /** System key */
  systemKey: string;
  
  /** Preferred creation strategy */
  preferredStrategy?: string;
  
  /** Required dependencies */
  requiredDependencies: string[];
  
  /** Optional dependencies */
  optionalDependencies: string[];
  
  /** Constructor parameter mapping */
  constructorMapping?: {
    parameterNames: string[];
    dependencyMapping: Record<string, string>;
  };
  
  /** Event subscriptions */
  eventSubscriptions?: string[];
  
  /** Creation preferences */
  creationPreferences: {
    useSingleton?: boolean;
    lazyInit?: boolean;
    eventDriven?: boolean;
    builderPattern?: boolean;
  };
  
  /** Resource requirements */
  resourceRequirements?: {
    estimatedMemoryMB?: number;
    estimatedInitTimeMs?: number;
    requiresWebGL?: boolean;
    requiresAudio?: boolean;
  };
}

// ============================================================================
// Factory Integration Types
// ============================================================================

/**
 * Factory interface that uses creation strategies
 */
export interface IStrategyBasedFactory {
  /**
   * Create system using best available strategy
   */
  createSystem<T = unknown>(
    systemKey: string,
    SystemClass: new(...args: unknown[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>>;
  
  /**
   * Register system creation configuration
   */
  registerSystemConfig(config: SystemCreationConfig): void;
  
  /**
   * Get system creation configuration
   */
  getSystemConfig(systemKey: string): SystemCreationConfig | null;
  
  /**
   * Update creation strategy registry
   */
  setStrategyRegistry(registry: ISystemCreationStrategyRegistry): void;
}

/**
 * Adapter interface for existing facade systems
 */
export interface IFacadeAdapter {
  /**
   * Adapt facade to use strategy-based creation
   */
  adaptToStrategyPattern(factory: IStrategyBasedFactory): void;
  
  /**
   * Migration status
   */
  getMigrationStatus(): {
    adapted: boolean;
    systemsUsingStrategyPattern: string[];
    systemsUsingLegacyPattern: string[];
    migrationProgress: number; // 0-1
  };
  
  /**
   * Complete migration to strategy pattern
   */
  completeMigration(): Promise<void>;
}

// ============================================================================
// Error Handling and Validation
// ============================================================================

/**
 * Errors specific to system creation strategies
 */
export class SystemCreationError extends Error {
  constructor(
    message: string,
    public readonly systemKey: string,
    public readonly strategy: string,
    public readonly context: SystemCreationContext,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'SystemCreationError';
  }
}

export class DependencyValidationError extends SystemCreationError {
  constructor(
    systemKey: string,
    strategy: string,
    public readonly missingDependencies: string[],
    context: SystemCreationContext
  ) {
    super(
      `Missing required dependencies for ${systemKey}: ${missingDependencies.join(', ')}`,
      systemKey,
      strategy,
      context
    );
    this.name = 'DependencyValidationError';
  }
}

export class StrategySelectionError extends Error {
  constructor(
    public readonly systemKey: string,
    public readonly criteria: CreationStrategySelectionCriteria,
    message: string = `No suitable creation strategy found for system: ${systemKey}`
  ) {
    super(message);
    this.name = 'StrategySelectionError';
  }
}

// ============================================================================
// Performance and Metrics Types
// ============================================================================

/**
 * Performance metrics for system creation
 */
export interface SystemCreationMetrics {
  /** Total systems created */
  totalSystemsCreated: number;
  
  /** Average creation time */
  averageCreationTime: number;
  
  /** Strategy usage statistics */
  strategyUsage: Record<string, {
    timesUsed: number;
    averageTime: number;
    successRate: number;
  }>;
  
  /** Dependency resolution statistics */
  dependencyResolution: {
    totalResolutions: number;
    averageResolutionTime: number;
    failureRate: number;
  };
  
  /** Memory usage statistics */
  memoryUsage: {
    totalSystemsMemoryMB: number;
    averageSystemMemoryMB: number;
    peakMemoryMB: number;
  };
  
  /** Error statistics */
  errors: {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsBySystem: Record<string, number>;
  };
}

/**
 * Performance monitor for creation strategies
 */
export interface ICreationPerformanceMonitor {
  /**
   * Record system creation event
   */
  recordCreation(result: SystemCreationResult): void;
  
  /**
   * Get current metrics
   */
  getMetrics(): SystemCreationMetrics;
  
  /**
   * Reset metrics
   */
  resetMetrics(): void;
  
  /**
   * Get performance report
   */
  generatePerformanceReport(): {
    summary: string;
    recommendations: string[];
    inefficiencies: string[];
    optimizations: string[];
  };
}