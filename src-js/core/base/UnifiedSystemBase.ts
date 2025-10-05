import { SimplePerformanceCoordinator } from '@/core/performance/SimplePerformanceCoordinator';
import { getGlobalCSSVariableWriter, CSSVariableWriter } from '@/core/css/CSSVariableWriter';
import { unifiedEventBus, type EventName, type EventData } from '@/core/events/UnifiedEventBus';
import { AnimationFrameCoordinator } from '@/core/animation/EnhancedMasterAnimationCoordinator';
import { UnifiedPerformanceCoordinator, PerformanceAnalyzer } from '@/core/performance/UnifiedPerformanceCoordinator';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';
import type { HealthCheckResult } from '@/types/systems';
import type { AdvancedSystemConfig } from '@/types/models';

/**
 * UnifiedSystemBase - Single base class for all Year 3000 systems
 * 
 * This class unifies the IManagedSystem interface and BaseVisualSystem class
 * patterns into a single, optimized architecture. It provides:
 * - Unified lifecycle management
 * - Shared utility access (performance, CSS variables, events, animation)
 * - Consistent error handling and logging
 * - Performance monitoring integration
 * 
 * @architecture Phase 1 of system consolidation
 * @performance Target: 30-40% initialization time improvement
 */
export abstract class UnifiedSystemBase {
  // Core lifecycle state
  public initialized: boolean = false;
  protected destroyed: boolean = false;
  protected systemName: string;
  protected config: AdvancedSystemConfig;
  
  // Shared utility instances (lazy-loaded singletons)
  protected performanceAnalyzer!: SimplePerformanceCoordinator;
  protected cssController!: CSSVariableWriter | null;
  // Backward compatibility alias
  protected get cssConsciousnessController() { return this.cssController; }
  protected set cssConsciousnessController(value: CSSVariableWriter | null) { this.cssController = value; }
  protected eventBus!: typeof unifiedEventBus;
  protected animationCoordinator!: AnimationFrameCoordinator;
  protected unifiedCSSManager!: CSSVariableWriter | null;
  protected performanceCoordinator!: PerformanceAnalyzer;
  
  // Event management
  private eventUnsubscribers: (() => void)[] = [];
  
  // Performance tracking
  private initializationStartTime: number | null = null;
  private frameStartTime: number = 0;
  protected frameCount: number = 0;
  private lastFPSCalculation: number = 0;
  private currentFPS: number = 60;
  
  constructor(config: AdvancedSystemConfig = ADVANCED_SYSTEM_CONFIG) {
    this.config = config;
    this.systemName = this.constructor.name;
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] UnifiedSystemBase constructor`);
    }
  }
  
  // =========================================================================
  // ABSTRACT METHODS - Must be implemented by subclasses
  // =========================================================================
  
  /**
   * Initialize the system - called once during startup
   */
  abstract initialize(): Promise<void>;
  
  /**
   * Clean up resources - called during shutdown
   */
  abstract destroy(): void;
  
  /**
   * Animation frame callback - called by animation coordinator
   * @param deltaTime - Time in milliseconds since last frame
   */
  abstract onAnimate(deltaTime: number): void;
  
  /**
   * Health check - verify system is functioning correctly
   */
  abstract healthCheck(): Promise<HealthCheckResult>;
  
  // =========================================================================
  // UNIFIED LIFECYCLE MANAGEMENT
  // =========================================================================
  
  /**
   * Base initialization - sets up shared utilities and calls system-specific init
   */
  async _baseInitialize(): Promise<void> {
    if (this.initialized) {
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] Already initialized`);
      }
      return;
    }
    
    try {
      this.initializationStartTime = performance.now();
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Starting unified initialization`);
      }
      
      // Initialize shared utilities
      // Get instances from global Year3000 system or create new ones
      const globalSystem = (globalThis as any).year3000System;
      
      if (globalSystem) {
        this.performanceAnalyzer = globalSystem.performanceAnalyzer ||
                                   globalSystem.facadeCoordinator?.getCachedNonVisualSystem?.('SimplePerformanceCoordinator') ||
                                   globalSystem.facadeCoordinator?.getCachedNonVisualSystem?.('PerformanceAnalyzer');
        this.cssController = globalSystem.cssController || globalSystem.cssConsciousnessController || getGlobalCSSVariableWriter();
        this.eventBus = unifiedEventBus; // Use the unified event bus singleton
        this.performanceCoordinator = globalSystem.performanceCoordinator || (this.performanceAnalyzer ? UnifiedPerformanceCoordinator.getInstance(this.config, this.performanceAnalyzer) : null);
        this.animationCoordinator = globalSystem.enhancedMasterAnimationCoordinator || (this.performanceCoordinator ? AnimationFrameCoordinator.getInstance(this.config, this.performanceCoordinator) : null);
        this.unifiedCSSManager = globalSystem.unifiedCSSManager || getGlobalCSSVariableWriter();
      } else {
        // Performance analyzer will be injected through factory pattern
        // Note: performanceAnalyzer will be set by dependency injection
        this.cssController = getGlobalCSSVariableWriter();
        this.eventBus = unifiedEventBus; // Use the unified event bus singleton
        this.performanceCoordinator = UnifiedPerformanceCoordinator.getInstance(this.config, this.performanceAnalyzer);
        this.animationCoordinator = AnimationFrameCoordinator.getInstance(this.config, this.performanceCoordinator);
        this.unifiedCSSManager = getGlobalCSSVariableWriter();
      }
      
      // Initialize unified CSS manager with performance analyzer
      if (this.unifiedCSSManager && this.performanceAnalyzer && this.cssController) {
        // CSSVariableWriter doesn't have an initialize method that takes these arguments
        // this.unifiedCSSManager.initialize(this.performanceAnalyzer, this.cssController);
      }
      
      // Register with performance monitoring (if available)
      if (this.performanceAnalyzer && typeof this.performanceAnalyzer.recordMetric === 'function') {
        this.performanceAnalyzer.recordMetric(`${this.systemName}_registered`, 1);
      }
      
      // Track initialization performance
      await this.trackPerformanceAsync('initialize', async () => {
        await this._performSystemSpecificInitialization();
      });
      
      this.initialized = true;
      
      // Emit initialization event
      this.publishEvent('system:initialized', {
        systemName: this.systemName,
        timestamp: Date.now(),
        metadata: {
          initializationTime: this.initializationStartTime ? 
            performance.now() - this.initializationStartTime : 0
        }
      });
      
      if (this.config.enableDebug) {
        const duration = this.initializationStartTime ? 
          performance.now() - this.initializationStartTime : 0;
        console.log(`[${this.systemName}] Unified initialization complete (${duration.toFixed(2)}ms)`);
      }
      
    } catch (error) {
      console.error(`[${this.systemName}] Initialization failed:`, error);
      this.publishEvent('system:initialization-failed', {
        systemName: this.systemName,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now()
      });
      throw error;
    }
  }
  
  /**
   * Base destruction - handles cleanup and calls system-specific destroy
   */
  _baseDestroy(): void {
    if (this.destroyed) {
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] Already destroyed`);
      }
      return;
    }
    
    try {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Starting unified destruction`);
      }
      
      // Unsubscribe from all events
      this.eventUnsubscribers.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.warn(`[${this.systemName}] Error during event unsubscription:`, error);
        }
      });
      this.eventUnsubscribers = [];
      
      // Unregister from performance monitoring (if available)
      if (this.performanceAnalyzer && typeof this.performanceAnalyzer.recordMetric === 'function') {
        this.performanceAnalyzer.recordMetric(`${this.systemName}_unregistered`, 1);
      }
      
      // Call system-specific cleanup
      this.destroy();
      
      this.destroyed = true;
      
      // Emit destruction event
      this.publishEvent('system:destroyed', {
        systemName: this.systemName,
        timestamp: Date.now()
      });
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Unified destruction complete`);
      }
      
    } catch (error) {
      console.error(`[${this.systemName}] Destruction failed:`, error);
    }
  }
  
  // =========================================================================
  // SHARED UTILITY METHODS
  // =========================================================================
  
  /**
   * Update a single CSS variable with priority support
   */
  protected updateCSSVariable(
    property: string, 
    value: string, 
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): void {
    if (this.unifiedCSSManager) {
      this.unifiedCSSManager.queueUpdate(property, value, priority, this.systemName);
    } else if (this.cssController) {
      this.cssController.queueCSSVariableUpdate(property, value);
    } else {
      console.warn(`[${this.systemName}] CSS variable management not initialized`);
    }
  }
  
  /**
   * Update multiple CSS variables efficiently with priority support
   */
  protected updateCSSVariables(
    updates: Record<string, string>,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): void {
    if (this.unifiedCSSManager) {
      this.unifiedCSSManager.queueTransaction(updates, priority, this.systemName);
    } else if (this.cssController) {
      Object.entries(updates).forEach(([property, value]) => {
        this.cssController!.queueCSSVariableUpdate(property, value);
      });
    } else {
      console.warn(`[${this.systemName}] CSS variable management not initialized`);
    }
  }
  
  /**
   * Subscribe to events with automatic cleanup and retry logic
   */
  protected subscribeToEvent<T = any>(event: string, callback: (payload: T) => void): () => void {
    if (!this.eventBus) {
      console.warn(`[${this.systemName}] Event bus not initialized - attempting to initialize`);
      
      // Try to get the event bus directly if not available through normal initialization
      try {
        this.eventBus = unifiedEventBus;
        if (!this.eventBus) {
          console.error(`[${this.systemName}] Failed to get unified event bus - event subscription deferred`);
          return () => {};
        }
      } catch (error) {
        console.error(`[${this.systemName}] Error accessing unified event bus:`, error);
        return () => {};
      }
    }
    
    try {
      const subscriptionId = this.eventBus.subscribe(event as any, callback as any, this.systemName);
      const unsubscribe = () => {
        this.eventBus.unsubscribe(subscriptionId);
      };
      this.eventUnsubscribers.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error(`[${this.systemName}] Failed to subscribe to event ${event}:`, error);
      return () => {};
    }
  }
  
  /**
   * Publish events to the global event bus
   */
  protected publishEvent<T = any>(event: string, payload: T): void {
    if (!this.eventBus) {
      console.warn(`[${this.systemName}] Event bus not initialized - attempting to initialize`);
      
      // Try to get the event bus directly if not available through normal initialization
      try {
        this.eventBus = unifiedEventBus;
        if (!this.eventBus) {
          console.error(`[${this.systemName}] Failed to get unified event bus - event publication skipped`);
          return;
        }
      } catch (error) {
        console.error(`[${this.systemName}] Error accessing unified event bus:`, error);
        return;
      }
    }
    
    try {
      this.eventBus.emitSync(event as any, payload as any);
    } catch (error) {
      console.error(`[${this.systemName}] Failed to publish event ${event}:`, error);
    }
  }
  
  /**
   * Track performance of synchronous operations
   */
  protected trackPerformance(operation: string, fn: () => void): void {
    const startTime = performance.now();
    
    try {
      fn();
    } finally {
      const endTime = performance.now();
      const frameTime = endTime - startTime;
      
      // Track with performance coordinator
      this.trackSystemPerformance(frameTime);
      
      // Legacy support
      if (this.performanceAnalyzer && typeof this.performanceAnalyzer.timeOperation === 'function') {
        this.performanceAnalyzer.recordMetric(`${this.systemName}_${operation}`, frameTime);
      }
    }
  }
  
  /**
   * Track performance of asynchronous operations
   */
  protected async trackPerformanceAsync(operation: string, fn: () => Promise<void>): Promise<void> {
    if (!this.performanceAnalyzer || typeof this.performanceAnalyzer.timeOperationAsync !== 'function') {
      await fn();
      return;
    }
    
    await this.performanceAnalyzer.timeOperationAsync(`${this.systemName}_${operation}`, fn);
  }
  
  /**
   * Track system performance metrics
   */
  protected trackSystemPerformance(frameTime: number): void {
    if (!this.performanceCoordinator) return;
    
    // Calculate FPS
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastFPSCalculation >= 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFPSCalculation = currentTime;
    }
    
    // Estimate memory usage (simplified)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Track metrics with performance coordinator
    this.performanceCoordinator.trackSubsystem(this.systemName, {
      frameTime,
      memoryUsage,
      fps: this.currentFPS,
      cpuUsage: frameTime > 16.67 ? Math.min(100, (frameTime / 16.67) * 5) : 0, // Rough estimate
    });
  }
  
  /**
   * Register with animation coordinator
   */
  protected registerAnimation(priority: number = 60): void {
    if (!this.animationCoordinator) {
      console.warn(`[${this.systemName}] Animation coordinator not initialized, attempting lazy initialization`);
      
      // Try to initialize animation coordinator if it's missing
      try {
        this.animationCoordinator = AnimationFrameCoordinator.getInstance(this.config, this.performanceCoordinator);
      } catch (error) {
        console.error(`[${this.systemName}] Failed to initialize animation coordinator:`, error);
        return;
      }
    }
    
    try {
      this.animationCoordinator.registerAnimationSystem(
        this.systemName,
        this,
        'normal',
        priority
      );
      
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Successfully registered with animation coordinator`);
      }
    } catch (error) {
      console.error(`[${this.systemName}] Failed to register with animation coordinator:`, error);
    }
  }
  
  /**
   * Force a repaint - useful for settings changes
   */
  public forceRepaint(reason?: string): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Force repaint: ${reason || 'unknown'}`);
    }
    
    // Force flush CSS variables first
    if (this.unifiedCSSManager) {
      this.unifiedCSSManager.forceFlush();
    }
    
    // Trigger a repaint using transform trick
    document.documentElement.style.transform = 'translateZ(0)';
    requestAnimationFrame(() => {
      document.documentElement.style.transform = '';
    });
  }
  
  // =========================================================================
  // UTILITY GETTERS AND STATUS
  // =========================================================================
  
  /**
   * Check if system is initialized
   */
  get isInitialized(): boolean {
    return this.initialized;
  }
  
  /**
   * Check if system is destroyed
   */
  get isDestroyed(): boolean {
    return this.destroyed;
  }
  
  /**
   * Get system name
   */
  get name(): string {
    return this.systemName;
  }
  
  /**
   * Get system configuration
   */
  get systemConfig(): AdvancedSystemConfig {
    return this.config;
  }
  
  /**
   * Register a CSS variable group for this system
   */
  protected registerCSSVariableGroup(
    groupName: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): void {
    if (this.unifiedCSSManager) {
      this.unifiedCSSManager.registerVariableGroup(`${this.systemName}-${groupName}`, priority);
    }
  }
  
  /**
   * Update variables in a CSS variable group
   */
  protected updateCSSVariableGroup(
    groupName: string,
    variables: Record<string, string>
  ): void {
    if (this.unifiedCSSManager) {
      this.unifiedCSSManager.updateVariableGroup(`${this.systemName}-${groupName}`, variables, this.systemName);
    } else {
      this.updateCSSVariables(variables);
    }
  }
  
  // =========================================================================
  // COMPATIBILITY METHODS
  // =========================================================================
  
  /**
   * Legacy compatibility method for IManagedSystem
   * @deprecated Use onAnimate instead
   */
  updateAnimation(deltaTime: number): void {
    this.onAnimate(deltaTime);
  }
  
  /**
   * Legacy compatibility method for BaseVisualSystem
   * @deprecated Override initialize() directly
   */
  async _performSystemSpecificInitialization(): Promise<void> {
    // Default implementation does nothing - subclasses can override
  }
  
  /**
   * Legacy compatibility method for BaseVisualSystem
   * @deprecated Override destroy() directly
   */
  _performSystemSpecificCleanup(): void {
    this.destroy();
  }
}