/**
 * Service Bridge - Compatibility layer for gradual migration
 *
 * Provides bridge implementations that maintain existing base class APIs
 * while internally using service composition. This enables zero-breaking-change
 * migration from inheritance to composition.
 *
 * @architecture Bridge pattern for gradual migration
 * @compatibility Maintains all existing base class APIs
 */

import { MusicSyncService } from "@/audio/MusicSyncService";
import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";

import type { CanvasResult } from "@/utils/graphics/VisualCanvasFactory";
import { DefaultServiceFactory } from "./CoreServiceProviders";
import type {
  CanvasOptions,
  IServiceAwareSystem,
  ServiceContainer,
} from "./SystemServices";

// =============================================================================
// BASE SYSTEM BRIDGE - Replaces ManagedSystemBase
// =============================================================================

/**
 * Service-based system foundation that provides the same API as ManagedSystemBase
 * but uses composition internally
 */
export abstract class ServiceSystemBase
  implements IManagedSystem, IServiceAwareSystem
{
  // IManagedSystem interface
  public initialized: boolean = false;

  // Legacy compatibility properties
  protected systemName: string;
  protected config: AdvancedSystemConfig | Year3000Config;
  protected destroyed: boolean = false;

  // Service container
  protected services: ServiceContainer;

  // Legacy-compatible property accessors that delegate to services
  protected get performanceAnalyzer(): SimplePerformanceCoordinator | null {
    return this._legacyPerformanceAnalyzer;
  }

  protected get cssConsciousnessController() {
    return this._legacyCSSController;
  }

  protected get eventBus() {
    return this._legacyEventBus;
  }

  // Internal legacy adapters
  protected _legacyPerformanceAnalyzer: SimplePerformanceCoordinator | null =
    null;
  private _legacyCSSController: any = null;
  private _legacyEventBus: any = null;

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG
  ) {
    this.config = config;
    this.systemName = this.constructor.name;
    this.services = DefaultServiceFactory.getServices();

    // Create legacy adapters
    this.setupLegacyAdapters();

    Y3KDebug?.debug?.log(
      "ServiceSystemBase",
      `Created ${this.systemName} with service composition`
    );
  }

  // =============================================================================
  // SERVICE INJECTION INTERFACE
  // =============================================================================

  injectServices(services: ServiceContainer): void {
    this.services = { ...this.services, ...services };
    this.setupLegacyAdapters();
  }

  getRequiredServices(): (keyof ServiceContainer)[] {
    return ["lifecycle", "performance"];
  }

  getOptionalServices(): (keyof ServiceContainer)[] {
    return ["cssVariables", "events", "canvas"];
  }

  // =============================================================================
  // LEGACY ADAPTER SETUP
  // =============================================================================

  private setupLegacyAdapters(): void {
    // Create legacy-compatible CSS controller
    if (this.services.cssVariables) {
      this._legacyCSSController = {
        queueCSSVariableUpdate: (variable: string, value: string) => {
          this.services.cssVariables!.queueUpdate(variable, value);
        },
        queueBatchUpdate: (updates: Record<string, string>) => {
          this.services.cssVariables!.queueBatchUpdate(updates);
        },
        flushPendingUpdates: () => {
          this.services.cssVariables!.flushUpdates();
        },
      };
    }

    // Create legacy-compatible event bus
    if (this.services.events) {
      this._legacyEventBus = {
        subscribe: (eventName: string, handler: (data: any) => void) => {
          this.services.events!.subscribe(this.systemName, eventName, handler);
        },
        emit: (eventName: string, data: any) => {
          // For emission, we'll use the global event bus if available
          const globalEventBus = (globalThis as any).unifiedEventBus;
          if (globalEventBus?.emit) {
            globalEventBus.emit(eventName, data);
          } else {
            // Fallback to custom events
            const event = new CustomEvent(eventName, { detail: data });
            document.dispatchEvent(event);
          }
        },
      };
    }
  }

  // =============================================================================
  // ABSTRACT METHODS - Must be implemented by subclasses
  // =============================================================================

  /**
   * System-specific initialization logic
   */
  abstract _performSystemSpecificInitialization(): Promise<void>;

  /**
   * System-specific cleanup logic
   */
  abstract _performSystemSpecificCleanup(): void;

  // =============================================================================
  // IMANAGEDYSTEM INTERFACE IMPLEMENTATION
  // =============================================================================

  async initialize(): Promise<void> {
    if (!this.services.lifecycle) {
      throw new Error(`${this.systemName}: Lifecycle service not available`);
    }

    await this.services.lifecycle.initializeSystem(
      this.systemName,
      this.config,
      async () => {
        await this._performSystemSpecificInitialization();
      }
    );

    this.initialized = true;
  }

  abstract updateAnimation(deltaTime: number): void;

  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const systemSpecificHealth = await this.performSystemHealthCheck();
      const isHealthy =
        this.initialized && !this.destroyed && systemSpecificHealth.healthy;

      return {
        healthy: isHealthy,
        ok: isHealthy,
        system: this.systemName,
        details:
          systemSpecificHealth.details ||
          `${this.systemName} system health check`,
        issues: systemSpecificHealth.issues || [],
        metrics: {
          initialized: this.initialized,
          destroyed: this.destroyed,
          ...systemSpecificHealth.metrics,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        ok: false,
        system: this.systemName,
        details: `Health check failed: ${error}`,
        issues: ["Health check exception"],
        metrics: { error: String(error) },
      };
    }
  }

  destroy(): void {
    if (!this.services.lifecycle) {
      Y3KDebug?.debug?.warn(
        "ServiceSystemBase",
        `${this.systemName}: Lifecycle service not available for cleanup`
      );
      return;
    }

    this.services.lifecycle.destroySystem(this.systemName, () => {
      this._performSystemSpecificCleanup();
    });

    // Clean up service subscriptions
    this.services.events?.cleanupSystem(this.systemName);
    this.services.canvas?.cleanupSystem(this.systemName);

    this.destroyed = true;
    this.initialized = false;
  }

  forceRepaint?(reason?: string): void {
    Y3KDebug?.debug?.log(
      "ServiceSystemBase",
      `${this.systemName} force repaint: ${reason || "no reason"}`
    );

    // Flush CSS updates
    this.services.cssVariables?.flushUpdates();

    // Call system-specific repaint logic
    this.performSystemRepaint?.(reason);
  }

  // =============================================================================
  // LEGACY UTILITY METHODS - Compatibility with existing systems
  // =============================================================================

  /**
   * Track operation performance (legacy compatible)
   */
  protected trackPerformance<T>(operationName: string, operation: () => T): T {
    if (!this.services.performance) return operation();

    return this.services.performance.trackOperation(
      this.systemName,
      operationName,
      operation
    );
  }

  /**
   * Track async operation performance (legacy compatible)
   */
  protected async trackPerformanceAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    if (!this.services.performance) return await operation();

    return await this.services.performance.trackOperationAsync(
      this.systemName,
      operationName,
      operation
    );
  }

  /**
   * Subscribe to events (legacy compatible)
   */
  protected subscribeToEvent<T>(
    eventName: string,
    handler: (data: T) => void
  ): void {
    this.services.events?.subscribe(this.systemName, eventName, handler);
  }

  /**
   * Publish event (legacy compatible)
   */
  protected publishEvent(eventName: string, data: any): void {
    // Use legacy event bus adapter
    this._legacyEventBus?.emit(eventName, data);
  }

  /**
   * Update CSS variable (legacy compatible)
   */
  protected updateCSSVariable(variable: string, value: string): void {
    this.services.cssVariables?.queueUpdate(variable, value);
  }

  /**
   * Update multiple CSS variables (legacy compatible)
   */
  protected updateCSSVariables(updates: Record<string, string>): void {
    this.services.cssVariables?.queueBatchUpdate(updates);
  }

  // =============================================================================
  // ABSTRACT METHODS FOR SUBCLASS EXTENSION
  // =============================================================================

  /**
   * System-specific health check implementation
   */
  protected abstract performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }>;

  /**
   * Optional system-specific repaint logic
   */
  protected performSystemRepaint?(reason?: string): void;
}

// =============================================================================
// VISUAL SYSTEM BRIDGE - Replaces BaseVisualSystem
// =============================================================================

/**
 * Service-based visual system foundation with canvas management
 */
export abstract class ServiceVisualSystemBase extends ServiceSystemBase {
  // Legacy compatibility properties for canvas management
  protected activeCanvasResults: Map<string, CanvasResult> = new Map();
  protected canvasCapabilities: any = null;

  // Additional visual system properties
  protected utils: typeof ThemeUtilities = ThemeUtilities;
  protected musicSyncService: MusicSyncService | null = null;
  // NOTE: settingsManager field removed - using TypedSettingsManager singleton, events auto-fire
  protected isActive: boolean = false;

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof ThemeUtilities = ThemeUtilities,
    performanceMonitor?: SimplePerformanceCoordinator,
    musicSyncService?: MusicSyncService | null
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
  ) {
    super(config);

    this.utils = utils;
    this.musicSyncService = musicSyncService || null;
    // NOTE: settingsManager assignment removed - using TypedSettingsManager singleton

    if (performanceMonitor) {
      this._legacyPerformanceAnalyzer = performanceMonitor;
    }

    // Set canvas capabilities
    if (this.services.canvas) {
      this.canvasCapabilities = this.services.canvas.getCanvasCapabilities();
    }
  }

  override getRequiredServices(): (keyof ServiceContainer)[] {
    return [...super.getRequiredServices(), "canvas"];
  }

  // =============================================================================
  // CANVAS MANAGEMENT (Legacy compatible)
  // =============================================================================

  /**
   * Create optimized canvas (legacy compatible)
   */
  protected async createCanvas(
    canvasId: string,
    options: CanvasOptions
  ): Promise<CanvasResult> {
    if (!this.services.canvas) {
      throw new Error(`${this.systemName}: Canvas service not available`);
    }

    const canvasResult = await this.services.canvas.createCanvas(
      this.systemName,
      canvasId,
      options
    );

    // Maintain legacy map for compatibility
    this.activeCanvasResults.set(canvasId, canvasResult);

    return canvasResult;
  }

  /**
   * Get existing canvas (legacy compatible)
   */
  protected getCanvas(canvasId: string): CanvasResult | null {
    return this.services.canvas?.getCanvas(this.systemName, canvasId) || null;
  }

  /**
   * Resize canvas (legacy compatible)
   */
  protected resizeCanvas(
    canvasId: string,
    width: number,
    height: number
  ): boolean {
    return (
      this.services.canvas?.resizeCanvas(
        this.systemName,
        canvasId,
        width,
        height
      ) || false
    );
  }

  /**
   * Handle settings changes (legacy compatible)
   */
  protected handleSettingsChange(event: Event): void {
    // Default implementation - override in subclasses
    Y3KDebug?.debug?.log(
      "ServiceVisualSystemBase",
      `${this.systemName} received settings change event`
    );
  }

  // =============================================================================
  // LIFECYCLE OVERRIDES
  // =============================================================================

  async _performSystemSpecificInitialization(): Promise<void> {
    this.isActive = true;

    // Set up settings change listener (TypedSettingsManager fires events automatically)
    if (this.services.events) {
      this.services.events.subscribeToDOM(
        this.systemName,
        document,
        "year3000SystemSettingsChanged",
        this.handleSettingsChange.bind(this)
      );
    }

    // Call abstract method for subclass initialization
    await this.performVisualSystemInitialization();
  }

  _performSystemSpecificCleanup(): void {
    this.isActive = false;

    // Cleanup canvases
    this.services.canvas?.cleanupSystem(this.systemName);
    this.activeCanvasResults.clear();

    // Call abstract method for subclass cleanup
    this.performVisualSystemCleanup();
  }

  // =============================================================================
  // ABSTRACT METHODS FOR VISUAL SYSTEMS
  // =============================================================================

  /**
   * Visual system specific initialization
   */
  protected abstract performVisualSystemInitialization(): Promise<void>;

  /**
   * Visual system specific cleanup
   */
  protected abstract performVisualSystemCleanup(): void;
}
