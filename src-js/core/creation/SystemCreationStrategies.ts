/**
 * System Creation Strategies Implementation
 *
 * Concrete implementations of creation strategies that eliminate
 * "post-creation dependency linking" by using proper dependency
 * injection patterns at creation time.
 */

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type {
  CreationStrategySelectionCriteria,
  IEventDrivenCreationStrategy,
  ISystemCreationStrategy,
  ISystemCreationStrategyRegistry,
  SystemCreationConfig,
  SystemCreationContext,
  SystemCreationResult,
} from "@/types/systemCreationStrategy";
import { DependencyValidationError } from "@/types/systemCreationStrategy";

// ============================================================================
// Base Creation Strategy
// ============================================================================

/**
 * Abstract base class for creation strategies
 */
export abstract class BaseCreationStrategy implements ISystemCreationStrategy {
  protected systemConfigs: Map<string, SystemCreationConfig> = new Map();

  abstract getStrategyName(): string;
  abstract canCreate(context: SystemCreationContext): boolean;
  abstract getEstimatedCreationTime(context: SystemCreationContext): number;
  abstract createSystem<T = any>(
    SystemClass: new (...args: any[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>>;

  /**
   * Validate dependencies before creation
   */
  validateDependencies(context: SystemCreationContext): {
    valid: boolean;
    missing: string[];
    warnings: string[];
  } {
    const required = this.getRequiredDependencies(context.systemKey);
    const optional = this.getOptionalDependencies(context.systemKey);

    const missing: string[] = [];
    const warnings: string[] = [];

    // Check required dependencies
    for (const dep of required) {
      if (
        !(dep in context.dependencies) ||
        !context.dependencies[dep as keyof typeof context.dependencies]
      ) {
        missing.push(dep);
      }
    }

    // Check optional dependencies
    for (const dep of optional) {
      if (
        !(dep in context.dependencies) ||
        !context.dependencies[dep as keyof typeof context.dependencies]
      ) {
        warnings.push(`Optional dependency missing: ${dep}`);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
      warnings,
    };
  }

  /**
   * Get required dependencies for system
   */
  getRequiredDependencies(systemKey: string): string[] {
    const config = this.systemConfigs.get(systemKey);
    return config?.requiredDependencies || [];
  }

  /**
   * Get optional dependencies for system
   */
  getOptionalDependencies(systemKey: string): string[] {
    const config = this.systemConfigs.get(systemKey);
    return config?.optionalDependencies || [];
  }

  /**
   * Register system configuration
   */
  registerSystemConfig(config: SystemCreationConfig): void {
    this.systemConfigs.set(config.systemKey, config);
  }

  /**
   * Create base result structure
   */
  protected createBaseResult<T>(
    system: T | null,
    context: SystemCreationContext,
    startTime: number,
    error?: Error | undefined
  ): SystemCreationResult<T> {
    const endTime = performance.now();
    const creationTime = endTime - startTime;

    return {
      system: system as T,
      success: !error && system !== null,
      creationTime,
      strategy: this.getStrategyName(),
      injectedDependencies: Object.keys(context.dependencies),
      warnings: [],
      error: error || undefined,
      metadata: {
        requiresInitialization: true,
        pendingDependencies: [],
        context,
      },
    };
  }
}

// ============================================================================
// Standard Constructor Strategy
// ============================================================================

/**
 * Standard constructor strategy for simple systems with known parameter patterns
 */
export class StandardConstructorStrategy extends BaseCreationStrategy {
  constructor() {
    super();

    // Register known system configurations
    this.registerKnownSystems();
  }

  getStrategyName(): string {
    return "StandardConstructor";
  }

  canCreate(context: SystemCreationContext): boolean {
    // Can create systems with standard constructor patterns
    const config = this.systemConfigs.get(context.systemKey);
    return config !== undefined && !config.creationPreferences.eventDriven;
  }

  getEstimatedCreationTime(context: SystemCreationContext): number {
    // Standard constructors are typically fast
    return 10; // 10ms estimate
  }

  async createSystem<T = any>(
    SystemClass: new (...args: any[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>> {
    const startTime = performance.now();

    try {
      // Validate dependencies
      const validation = this.validateDependencies(context);
      if (
        !validation.valid &&
        context.preferences.validateDependencies !== false
      ) {
        throw new DependencyValidationError(
          context.systemKey,
          this.getStrategyName(),
          validation.missing,
          context
        );
      }

      // Get constructor parameters
      const params = this.getConstructorParameters(context);

      // Create system instance
      const system = new SystemClass(...params);

      const result = this.createBaseResult(system, context, startTime);
      result.warnings = validation.warnings;

      Y3KDebug?.debug?.log(
        "StandardConstructorStrategy",
        `Created ${context.systemKey}`,
        {
          creationTime: result.creationTime,
          parametersUsed: params.length,
        }
      );

      return result;
    } catch (error) {
      const result = this.createBaseResult(
        null as any,
        context,
        startTime,
        error as Error
      );
      Y3KDebug?.debug?.error(
        "StandardConstructorStrategy",
        `Failed to create ${context.systemKey}:`,
        error
      );
      return result;
    }
  }

  /**
   * Get constructor parameters based on system configuration
   */
  private getConstructorParameters(context: SystemCreationContext): any[] {
    const config = this.systemConfigs.get(context.systemKey);
    if (!config?.constructorMapping) {
      // Fallback to standard parameter order
      return this.getStandardParameters(context);
    }

    const params: any[] = [];
    const { parameterNames, dependencyMapping } = config.constructorMapping;

    for (const paramName of parameterNames) {
      const depKey = dependencyMapping[paramName] || paramName;

      // Map dependencies to parameters
      switch (depKey) {
        case "config":
          params.push(context.config);
          break;
        case "utils":
          params.push(context.utils);
          break;
        case "performanceAnalyzer":
        case "simplePerformanceCoordinator":
          // Unified performance system - map both old and new dependency keys
          params.push(context.dependencies.simplePerformanceCoordinator || context.dependencies.performanceAnalyzer);
          break;
        case "settingsManager":
          params.push(context.dependencies.settingsManager);
          break;
        case "musicSyncService":
          params.push(context.dependencies.musicSyncService);
          break;
        case "year3000System":
          params.push(context.dependencies.year3000System);
          break;
        case "cssController":
        case "cssConsciousnessController": // Backward compatibility
          params.push(context.dependencies.cssController || context.dependencies.cssConsciousnessController);
          break;
        case "performanceCoordinator":
          params.push(context.dependencies.performanceCoordinator);
          break;
        case "enhancedDeviceTierDetector":
          params.push(context.dependencies.enhancedDeviceTierDetector);
          break;
        case "webglSystemsIntegration":
          params.push(context.dependencies.webglSystemsIntegration);
          break;
        case "deviceCapabilityDetector":
          params.push(context.dependencies.deviceCapabilityDetector);
          break;
        default:
          params.push(undefined);
      }
    }

    return params;
  }

  /**
   * Get standard parameters for systems without explicit configuration
   */
  private getStandardParameters(context: SystemCreationContext): any[] {
    // Default to most common parameter pattern - prefer simplified performance system
    return [
      context.config,
      context.utils,
      context.dependencies.simplePerformanceCoordinator || context.dependencies.performanceAnalyzer,
      context.dependencies.musicSyncService,
      context.dependencies.settingsManager,
      context.dependencies.year3000System,
    ];
  }

  /**
   * Register known system configurations
   */
  private registerKnownSystems(): void {
    // ColorHarmonyEngine - no MusicSyncService dependency (Strategy pattern)
    this.registerSystemConfig({
      systemKey: "ColorHarmonyEngine",
      requiredDependencies: [
        "config",
        "utils",
        "simplePerformanceCoordinator",
        "settingsManager",
      ],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [
          "config",
          "utils",
          "simplePerformanceCoordinator",
          "settingsManager",
        ],
        dependencyMapping: {
          config: "config",
          utils: "utils",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false,
      },
    });

    // EnhancedMasterAnimationCoordinator
    this.registerSystemConfig({
      systemKey: "EnhancedMasterAnimationCoordinator",
      requiredDependencies: ["config", "performanceCoordinator"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["config", "performanceCoordinator"],
        dependencyMapping: {
          config: "config",
          performanceCoordinator: "performanceCoordinator",
        },
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // UnifiedPerformanceCoordinator
    this.registerSystemConfig({
      systemKey: "UnifiedPerformanceCoordinator",
      requiredDependencies: ["config"],
      optionalDependencies: ["simplePerformanceCoordinator"],
      constructorMapping: {
        parameterNames: ["config", "simplePerformanceCoordinator"],
        dependencyMapping: {
          config: "config",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
        },
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // Simple systems with no parameters
    const simpleSystemKeys = [
      "DeviceCapabilityDetector",
      "SettingsManager",
      // NOTE: SimplePerformanceCoordinator removed - replaced with SimplePerformanceCoordinator (see below)
    ];

    for (const systemKey of simpleSystemKeys) {
      this.registerSystemConfig({
        systemKey,
        requiredDependencies: [],
        optionalDependencies: [],
        constructorMapping: {
          parameterNames: [],
          dependencyMapping: {},
        },
        creationPreferences: {
          useSingleton: false,
          lazyInit: false,
          eventDriven: false,
          builderPattern: false,
        },
      });
    }

    // TimerConsolidationSystem - simple system with no dependencies
    this.registerSystemConfig({
      systemKey: "TimerConsolidationSystem",
      requiredDependencies: [],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [],
        dependencyMapping: {},
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // GlassmorphismManager - requires cssController, simplePerformanceCoordinator, and settingsManager
    this.registerSystemConfig({
      systemKey: "GlassmorphismManager",
      requiredDependencies: [
        "config",
        "utils",
        "cssController",
        "simplePerformanceCoordinator",
        "settingsManager",
      ],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [
          "config",
          "utils",
          "cssController",
          "simplePerformanceCoordinator",
          "settingsManager",
        ],
        dependencyMapping: {
          config: "config",
          utils: "utils",
          cssController: "cssController",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // Card3DManager - requires simplePerformanceCoordinator and settingsManager
    this.registerSystemConfig({
      systemKey: "Card3DManager",
      requiredDependencies: ["simplePerformanceCoordinator", "settingsManager", "utils"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["simplePerformanceCoordinator", "settingsManager", "utils"],
        dependencyMapping: {
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
          utils: "utils",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // CSSVariableWriter - requires config and performanceCoordinator
    this.registerSystemConfig({
      systemKey: "CSSVariableWriter",
      requiredDependencies: ["config", "performanceCoordinator"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["config", "performanceCoordinator"],
        dependencyMapping: {
          config: "config",
          performanceCoordinator: "performanceCoordinator",
        },
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // SidebarSystemsIntegration - requires cssController
    this.registerSystemConfig({
      systemKey: "SidebarSystemsIntegration",
      requiredDependencies: ["cssController"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["cssController"],
        dependencyMapping: {
          cssController: "cssController",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // UnifiedSystemIntegration - requires year3000System
    this.registerSystemConfig({
      systemKey: "UnifiedSystemIntegration",
      requiredDependencies: ["year3000System"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["year3000System"],
        dependencyMapping: {
          year3000System: "year3000System",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // GenreGradientEvolution removed - functionality consolidated into GenreProfileManager
    // Genre detection now handled by GenreProfileManager (stateless, used via ColorHarmonyEngine)

    // MusicEmotionAnalyzer - requires config, utils, simplePerformanceCoordinator, settingsManager
    this.registerSystemConfig({
      systemKey: "MusicEmotionAnalyzer",
      requiredDependencies: [
        "config",
        "utils",
        "simplePerformanceCoordinator",
        "settingsManager",
      ],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [
          "config",
          "utils",
          "simplePerformanceCoordinator",
          "settingsManager",
        ],
        dependencyMapping: {
          config: "config",
          utils: "utils",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false,
      },
    });
    
    // New simplified performance systems
    this.registerNewSimplifiedSystems();
  }

  /**
   * Register new simplified performance system configurations
   */
  private registerNewSimplifiedSystems(): void {
    // SimplePerformanceCoordinator - main simplified performance system
    this.registerSystemConfig({
      systemKey: "SimplePerformanceCoordinator",
      requiredDependencies: ["enhancedDeviceTierDetector", "webglSystemsIntegration"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["enhancedDeviceTierDetector", "webglSystemsIntegration"],
        dependencyMapping: {
          enhancedDeviceTierDetector: "enhancedDeviceTierDetector",
          webglSystemsIntegration: "webglSystemsIntegration",
        },
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // SimpleTierBasedPerformanceSystem - tier-based performance logic
    this.registerSystemConfig({
      systemKey: "SimpleTierBasedPerformanceSystem",
      requiredDependencies: ["enhancedDeviceTierDetector"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["enhancedDeviceTierDetector"],
        dependencyMapping: {
          enhancedDeviceTierDetector: "enhancedDeviceTierDetector",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // EnhancedDeviceTierDetector - static class, no dependencies
    this.registerSystemConfig({
      systemKey: "EnhancedDeviceTierDetector",
      requiredDependencies: [],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [],
        dependencyMapping: {},
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });

    // WebGLSystemsIntegration - WebGL coordination
    this.registerSystemConfig({
      systemKey: "WebGLSystemsIntegration",
      requiredDependencies: ["deviceCapabilityDetector"],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: ["deviceCapabilityDetector"],
        dependencyMapping: {
          deviceCapabilityDetector: "deviceCapabilityDetector",
        },
      },
      creationPreferences: {
        useSingleton: true,
        lazyInit: false,
        eventDriven: false,
        builderPattern: false,
      },
    });
  }
}

// ============================================================================
// Event-Driven Creation Strategy
// ============================================================================

/**
 * Event-driven creation strategy for systems that require event coordination
 */
export class EventDrivenCreationStrategy
  extends BaseCreationStrategy
  implements IEventDrivenCreationStrategy
{
  constructor() {
    super();
    this.registerEventDrivenSystems();
  }

  getStrategyName(): string {
    return "EventDriven";
  }

  canCreate(context: SystemCreationContext): boolean {
    const config = this.systemConfigs.get(context.systemKey);
    return config?.creationPreferences.eventDriven === true;
  }

  getEstimatedCreationTime(context: SystemCreationContext): number {
    // Event-driven creation takes longer due to event setup
    return 50; // 50ms estimate
  }

  async createSystem<T = any>(
    SystemClass: new (...args: any[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>> {
    const startTime = performance.now();

    try {
      // Create system with standard parameters first
      const standardStrategy = new StandardConstructorStrategy();
      const standardResult = await standardStrategy.createSystem(
        SystemClass,
        context
      );

      if (!standardResult.success) {
        return standardResult;
      }

      // Setup event subscriptions
      this.setupEventSubscriptions(standardResult.system, context);

      const result = this.createBaseResult(
        standardResult.system,
        context,
        startTime
      );
      result.warnings = standardResult.warnings;

      Y3KDebug?.debug?.log(
        "EventDrivenCreationStrategy",
        `Created ${context.systemKey} with event subscriptions`
      );

      return result;
    } catch (error) {
      const result = this.createBaseResult(
        null as any,
        context,
        startTime,
        error as Error
      );
      Y3KDebug?.debug?.error(
        "EventDrivenCreationStrategy",
        `Failed to create ${context.systemKey}:`,
        error
      );
      return result;
    }
  }

  /**
   * Setup event subscriptions during creation
   */
  setupEventSubscriptions(system: any, context: SystemCreationContext): void {
    const eventSubscriptions = this.getEventSubscriptions(context.systemKey);

    for (const eventType of eventSubscriptions) {
      // Map old event types to new unified event types
      const mappedEventType = this.mapEventType(eventType);
      
      if (typeof system.handleEvent === "function") {
        unifiedEventBus.subscribe(mappedEventType as any, (event: any) => {
          system.handleEvent(event);
        }, `SystemCreation-${context.systemKey}`);
      } else if (
        typeof system.handleColorExtraction === "function" &&
        (eventType === "colors/extracted" || mappedEventType === "colors:extracted")
      ) {
        unifiedEventBus.subscribe(
          mappedEventType as any,
          system.handleColorExtraction.bind(system),
          `SystemCreation-${context.systemKey}`
        );
      }
    }

    Y3KDebug?.debug?.log(
      "EventDrivenCreationStrategy",
      `Setup event subscriptions for ${context.systemKey}:`,
      eventSubscriptions
    );
  }

  /**
   * Map old event types to new unified event types
   */
  private mapEventType(eventType: string): string {
    const eventMap: Record<string, string> = {
      'colors/extracted': 'colors:extracted',
      'colors/harmonized': 'colors:harmonized',
      'music/beat': 'music:beat',
      'music/energy': 'music:energy',
      'music/track-changed': 'music:track-changed',
      'performance/mode-changed': 'performance:tier-changed',
      'performance/thermal-warning': 'performance:frame',
      'settings/changed': 'settings:changed',
    };
    
    return eventMap[eventType] || eventType;
  }

  /**
   * Get events that system will subscribe to
   */
  getEventSubscriptions(systemKey: string): string[] {
    const eventSubscriptions: Record<string, string[]> = {
      ColorHarmonyEngine: ["colors:extracted", "music:track-changed"],
      MusicEmotionAnalyzer: ["music:beat", "music:energy", "music:track-changed"],
    };
    
    return eventSubscriptions[systemKey] || [];
  }

  /**
   * Register event-driven systems with their configurations
   */
  private registerEventDrivenSystems(): void {
    // ColorHarmonyEngine - event-driven system with color and music events
    this.registerSystemConfig({
      systemKey: "ColorHarmonyEngine",
      requiredDependencies: [
        "config",
        "utils",
        "simplePerformanceCoordinator",
        "settingsManager",
      ],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [
          "config",
          "utils",
          "simplePerformanceCoordinator",
          "settingsManager",
        ],
        dependencyMapping: {
          config: "config",
          utils: "utils",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false,
      },
    });

    // GenreGradientEvolution removed - functionality consolidated into GenreProfileManager

    // MusicEmotionAnalyzer - event-driven system with music events
    this.registerSystemConfig({
      systemKey: "MusicEmotionAnalyzer",
      requiredDependencies: [
        "config",
        "utils",
        "simplePerformanceCoordinator",
        "settingsManager",
      ],
      optionalDependencies: [],
      constructorMapping: {
        parameterNames: [
          "config",
          "utils",
          "simplePerformanceCoordinator",
          "settingsManager",
        ],
        dependencyMapping: {
          config: "config",
          utils: "utils",
          simplePerformanceCoordinator: "simplePerformanceCoordinator",
          settingsManager: "settingsManager",
        },
      },
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false,
      },
    });
  }
}

// ============================================================================
// Object Dependencies Creation Strategy
// ============================================================================

/**
 * Strategy for systems that use object-based dependency injection (like MusicSyncService)
 */
export class ObjectDependenciesStrategy extends BaseCreationStrategy {
  constructor() {
    super();
    this.registerObjectDependencySystems();
  }

  getStrategyName(): string {
    return "ObjectDependencies";
  }

  canCreate(context: SystemCreationContext): boolean {
    return context.systemKey === "MusicSyncService";
  }

  getEstimatedCreationTime(context: SystemCreationContext): number {
    return 30; // 30ms estimate for object dependency resolution
  }

  async createSystem<T = any>(
    SystemClass: new (...args: any[]) => T,
    context: SystemCreationContext
  ): Promise<SystemCreationResult<T>> {
    const startTime = performance.now();

    try {
      // Validate dependencies
      const validation = this.validateDependencies(context);
      if (
        !validation.valid &&
        context.preferences.validateDependencies !== false
      ) {
        throw new DependencyValidationError(
          context.systemKey,
          this.getStrategyName(),
          validation.missing,
          context
        );
      }

      // Create dependencies object for MusicSyncService
      const dependencies = {
        ADVANCED_SYSTEM_CONFIG: context.config,
        ThemeUtilities: context.utils,
        settingsManager: context.dependencies.settingsManager,
        year3000System: context.dependencies.year3000System,
        // NOTE: colorHarmonyEngine deliberately omitted - using event-driven pattern instead
      };

      // Create system instance with dependencies object
      const system = new SystemClass(dependencies);

      const result = this.createBaseResult(system, context, startTime);
      result.warnings = validation.warnings;
      result.metadata.pendingDependencies = []; // No pending dependencies with event-driven pattern

      Y3KDebug?.debug?.log(
        "ObjectDependenciesStrategy",
        `Created ${context.systemKey} with event-driven dependencies`
      );

      return result;
    } catch (error) {
      const result = this.createBaseResult(
        null as any,
        context,
        startTime,
        error as Error
      );
      Y3KDebug?.debug?.error(
        "ObjectDependenciesStrategy",
        `Failed to create ${context.systemKey}:`,
        error
      );
      return result;
    }
  }

  /**
   * Register systems that use object dependencies
   */
  private registerObjectDependencySystems(): void {
    this.registerSystemConfig({
      systemKey: "MusicSyncService",
      requiredDependencies: ["config", "utils"],
      optionalDependencies: ["settingsManager", "year3000System"],
      creationPreferences: {
        useSingleton: false,
        lazyInit: false,
        eventDriven: true,
        builderPattern: false,
      },
    });
  }
}

// ============================================================================
// Strategy Registry Implementation
// ============================================================================

/**
 * Registry for managing and selecting system creation strategies
 */
export class SystemCreationStrategyRegistry
  implements ISystemCreationStrategyRegistry
{
  private strategies: Map<string, ISystemCreationStrategy> = new Map();

  constructor() {
    // Register default strategies
    this.registerDefaultStrategies();
  }

  /**
   * Register a creation strategy
   */
  register(strategy: ISystemCreationStrategy): void {
    this.strategies.set(strategy.getStrategyName(), strategy);
    Y3KDebug?.debug?.log(
      "SystemCreationStrategyRegistry",
      `Registered strategy: ${strategy.getStrategyName()}`
    );
  }

  /**
   * Select best strategy for given criteria
   */
  selectStrategy(
    systemKey: string,
    criteria: CreationStrategySelectionCriteria
  ): ISystemCreationStrategy | null {
    // Get strategies that can create this system
    const candidateStrategies = this.getStrategiesForSystem(systemKey);

    if (candidateStrategies.length === 0) {
      return null;
    }

    // Apply selection criteria
    let bestStrategy = candidateStrategies[0];
    if (!bestStrategy) {
      return null;
    }

    let bestScore = this.scoreStrategy(bestStrategy, systemKey, criteria);

    for (let i = 1; i < candidateStrategies.length; i++) {
      const strategy = candidateStrategies[i];
      if (!strategy) continue;

      const score = this.scoreStrategy(strategy, systemKey, criteria);

      if (score > bestScore) {
        bestStrategy = strategy;
        bestScore = score;
      }
    }

    return bestStrategy;
  }

  /**
   * Get all registered strategies
   */
  getStrategies(): ISystemCreationStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Get strategy by name
   */
  getStrategy(name: string): ISystemCreationStrategy | null {
    return this.strategies.get(name) || null;
  }

  /**
   * Get strategies that can create a specific system
   */
  getStrategiesForSystem(systemKey: string): ISystemCreationStrategy[] {
    const context: SystemCreationContext = {
      systemKey,
      config: {} as any,
      utils: {} as any,
      dependencies: {},
      preferences: {},
      metadata: {
        timestamp: Date.now(),
        reason: "startup",
        priority: "medium",
      },
    };

    return this.getStrategies().filter((strategy) =>
      strategy.canCreate(context)
    );
  }

  /**
   * Score strategy based on selection criteria
   */
  private scoreStrategy(
    strategy: ISystemCreationStrategy,
    systemKey: string,
    criteria: CreationStrategySelectionCriteria
  ): number {
    let score = 0;

    // Base score for being able to create the system
    score += 10;

    // Prefer strategies that match dependency requirements
    if (criteria.dependencyRequirements === "event-driven") {
      if (strategy.getStrategyName() === "EventDriven") score += 20;
      if (strategy.getStrategyName() === "ObjectDependencies") score += 15;
    } else if (criteria.dependencyRequirements === "basic") {
      if (strategy.getStrategyName() === "StandardConstructor") score += 20;
    }

    // Performance preferences
    if (criteria.performance === "lightweight") {
      if (strategy.getStrategyName() === "StandardConstructor") score += 15;
    } else if (criteria.performance === "optimized") {
      if (strategy.getStrategyName() === "EventDriven") score += 10;
    }

    // Context preferences
    if (criteria.creationContext === "startup") {
      if (strategy.getStrategyName() === "StandardConstructor") score += 5;
    }

    return score;
  }

  /**
   * Register default strategies
   */
  private registerDefaultStrategies(): void {
    this.register(new StandardConstructorStrategy());
    this.register(new EventDrivenCreationStrategy());
    this.register(new ObjectDependenciesStrategy());
  }

  /**
   * Get registry status
   */
  getStatus(): {
    strategyCount: number;
    strategies: string[];
  } {
    return {
      strategyCount: this.strategies.size,
      strategies: Array.from(this.strategies.keys()),
    };
  }
}

// ============================================================================
// Global Registry Export
// ============================================================================

/**
 * Global system creation strategy registry
 */
export const globalSystemCreationRegistry =
  new SystemCreationStrategyRegistry();
