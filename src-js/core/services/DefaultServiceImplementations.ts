/**
 * Default Service Implementations
 * 
 * Provides concrete implementations of the system services.
 * These can be replaced with optimized versions or mocked for testing.
 * 
 * @architecture Dependency injection with default implementations
 * @performance Optimized for typical usage patterns
 */

import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import { createOptimizedCanvas, detectRenderingCapabilities, type CanvasResult, type CanvasContextType } from "@/utils/graphics/VisualCanvasFactory";
import type {
  SystemLifecycleService,
  PerformanceTrackingService,
  CSSVariableService,
  EventSubscriptionService,
  CanvasManagementService,
  CanvasOptions,
  ServiceContainer
} from "./SystemServices";

// =============================================================================
// SYSTEM LIFECYCLE SERVICE IMPLEMENTATION
// =============================================================================

export class DefaultSystemLifecycleService implements SystemLifecycleService {
  private systems = new Map<string, {
    initialized: boolean;
    initializationTime: number;
    lastInitialized: number;
    initializationCount: number;
  }>();

  async initializeSystem(
    systemName: string,
    config: AdvancedSystemConfig | Year3000Config,
    initFn: () => Promise<void>
  ): Promise<void> {
    const existing = this.systems.get(systemName);
    if (existing?.initialized) {
      Y3KDebug?.debug?.warn("SystemLifecycle", `System ${systemName} already initialized`);
      return;
    }

    const startTime = performance.now();
    
    try {
      Y3KDebug?.debug?.log("SystemLifecycle", `Initializing system: ${systemName}`);
      
      await initFn();
      
      const initializationTime = performance.now() - startTime;
      const now = Date.now();
      
      this.systems.set(systemName, {
        initialized: true,
        initializationTime,
        lastInitialized: now,
        initializationCount: (existing?.initializationCount || 0) + 1
      });
      
      Y3KDebug?.debug?.log("SystemLifecycle", 
        `System ${systemName} initialized in ${initializationTime.toFixed(2)}ms`);
        
    } catch (error) {
      Y3KDebug?.debug?.error("SystemLifecycle", 
        `Failed to initialize system ${systemName}:`, error);
      throw error;
    }
  }

  destroySystem(systemName: string, cleanupFn: () => void): void {
    const system = this.systems.get(systemName);
    if (!system?.initialized) {
      Y3KDebug?.debug?.warn("SystemLifecycle", `System ${systemName} not initialized`);
      return;
    }

    try {
      Y3KDebug?.debug?.log("SystemLifecycle", `Destroying system: ${systemName}`);
      
      cleanupFn();
      
      this.systems.set(systemName, {
        ...system,
        initialized: false
      });
      
    } catch (error) {
      Y3KDebug?.debug?.error("SystemLifecycle", 
        `Failed to destroy system ${systemName}:`, error);
    }
  }

  isSystemInitialized(systemName: string): boolean {
    return this.systems.get(systemName)?.initialized ?? false;
  }

  getSystemMetrics(systemName: string) {
    const system = this.systems.get(systemName);
    if (!system) return null;
    
    return {
      initializationTime: system.initializationTime,
      lastInitialized: system.lastInitialized,
      initializationCount: system.initializationCount
    };
  }
}

// =============================================================================
// PERFORMANCE TRACKING SERVICE IMPLEMENTATION
// =============================================================================

export class DefaultPerformanceTrackingService implements PerformanceTrackingService {
  private systemMetrics = new Map<string, {
    operationTimes: Record<string, number[]>;
    metrics: Record<string, number>;
  }>();

  trackOperation<T>(systemName: string, operationName: string, operation: () => T): T {
    const startTime = performance.now();
    
    try {
      const result = operation();
      const duration = performance.now() - startTime;
      this.recordOperationTime(systemName, operationName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordOperationTime(systemName, operationName, duration);
      throw error;
    }
  }

  async trackOperationAsync<T>(
    systemName: string, 
    operationName: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      this.recordOperationTime(systemName, operationName, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordOperationTime(systemName, operationName, duration);
      throw error;
    }
  }

  recordMetric(systemName: string, metricName: string, value: number): void {
    const system = this.systemMetrics.get(systemName) || {
      operationTimes: {},
      metrics: {}
    };
    
    system.metrics[metricName] = value;
    this.systemMetrics.set(systemName, system);
  }

  private recordOperationTime(systemName: string, operationName: string, duration: number): void {
    const system = this.systemMetrics.get(systemName) || {
      operationTimes: {},
      metrics: {}
    };
    
    if (!system.operationTimes[operationName]) {
      system.operationTimes[operationName] = [];
    }
    
    // Keep only last 100 measurements
    system.operationTimes[operationName].push(duration);
    if (system.operationTimes[operationName].length > 100) {
      system.operationTimes[operationName].shift();
    }
    
    this.systemMetrics.set(systemName, system);
  }

  getMetrics(systemName: string) {
    const system = this.systemMetrics.get(systemName);
    if (!system) return null;
    
    const allTimes: number[] = [];
    Object.values(system.operationTimes).forEach(times => allTimes.push(...times));
    
    return {
      operationTimes: { ...system.operationTimes },
      metrics: { ...system.metrics },
      averageOperationTime: allTimes.length > 0 ? 
        allTimes.reduce((a, b) => a + b, 0) / allTimes.length : 0,
      lastOperationTime: allTimes[allTimes.length - 1] || 0
    };
  }
}

// =============================================================================
// CSS VARIABLE SERVICE IMPLEMENTATION
// =============================================================================

export class DefaultCSSVariableService implements CSSVariableService {
  private updateQueue = new Map<string, string>();
  private flushScheduled = false;
  private lastFlushTime = 0;

  queueUpdate(variable: string, value: string): void {
    this.updateQueue.set(variable, value);
    this.scheduleFlush();
  }

  queueBatchUpdate(updates: Record<string, string>): void {
    Object.entries(updates).forEach(([variable, value]) => {
      this.updateQueue.set(variable, value);
    });
    this.scheduleFlush();
  }

  flushUpdates(): void {
    if (this.updateQueue.size === 0) return;

    const root = document.documentElement;
    const startTime = performance.now();
    
    for (const [variable, value] of this.updateQueue) {
      root.style.setProperty(variable, value);
    }
    
    const flushTime = performance.now() - startTime;
    this.updateQueue.clear();
    this.lastFlushTime = Date.now();
    this.flushScheduled = false;
    
    Y3KDebug?.debug?.log("CSSVariableService", 
      `Flushed ${this.updateQueue.size} CSS updates in ${flushTime.toFixed(2)}ms`);
  }

  scheduleFlush(): void {
    if (this.flushScheduled) return;
    
    this.flushScheduled = true;
    requestAnimationFrame(() => {
      this.flushUpdates();
    });
  }

  getCurrentValue(variable: string): string | null {
    return getComputedStyle(document.documentElement).getPropertyValue(variable) || null;
  }

  getQueueStatus() {
    return {
      queueSize: this.updateQueue.size,
      lastFlushTime: this.lastFlushTime,
      pendingUpdates: Array.from(this.updateQueue.keys())
    };
  }
}

// =============================================================================
// EVENT SUBSCRIPTION SERVICE IMPLEMENTATION
// =============================================================================

export class DefaultEventSubscriptionService implements EventSubscriptionService {
  private systemSubscriptions = new Map<string, {
    eventUnsubscribers: (() => void)[];
    domUnsubscribers: (() => void)[];
  }>();

  subscribe<T = any>(systemName: string, eventName: string, handler: (data: T) => void): void {
    const system = this.systemSubscriptions.get(systemName) || {
      eventUnsubscribers: [],
      domUnsubscribers: []
    };
    
    // Assuming we have access to a global event bus
    const globalEventBus = (globalThis as any).unifiedEventBus;
    if (globalEventBus?.subscribe) {
      const unsubscriber = globalEventBus.subscribe(eventName, handler, systemName);
      system.eventUnsubscribers.push(() => unsubscriber());
    } else {
      // Fallback to custom event on document
      const wrappedHandler = (event: Event) => {
        const customEvent = event as CustomEvent<T>;
        handler(customEvent.detail);
      };
      
      document.addEventListener(eventName, wrappedHandler as EventListener);
      system.domUnsubscribers.push(() => {
        document.removeEventListener(eventName, wrappedHandler as EventListener);
      });
    }
    
    this.systemSubscriptions.set(systemName, system);
  }

  subscribeToDOM(
    systemName: string,
    element: Element | Window | Document,
    eventType: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    const system = this.systemSubscriptions.get(systemName) || {
      eventUnsubscribers: [],
      domUnsubscribers: []
    };
    
    element.addEventListener(eventType, handler, options);
    system.domUnsubscribers.push(() => {
      element.removeEventListener(eventType, handler, options);
    });
    
    this.systemSubscriptions.set(systemName, system);
  }

  unsubscribe(systemName: string, eventName: string): void {
    // For this implementation, we'll clean up the entire system
    // A more sophisticated implementation would track individual subscriptions
    this.cleanupSystem(systemName);
  }

  cleanupSystem(systemName: string): void {
    const system = this.systemSubscriptions.get(systemName);
    if (!system) return;
    
    system.eventUnsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        Y3KDebug?.debug?.warn("EventSubscriptionService", 
          `Error unsubscribing for ${systemName}:`, error);
      }
    });
    
    system.domUnsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        Y3KDebug?.debug?.warn("EventSubscriptionService", 
          `Error removing DOM listener for ${systemName}:`, error);
      }
    });
    
    this.systemSubscriptions.delete(systemName);
  }

  getSubscriptionStatus(systemName: string) {
    const system = this.systemSubscriptions.get(systemName);
    if (!system) {
      return { eventSubscriptions: [], domSubscriptions: 0, totalSubscriptions: 0 };
    }
    
    return {
      eventSubscriptions: [], // Would need more tracking to provide specific event names
      domSubscriptions: system.domUnsubscribers.length,
      totalSubscriptions: system.eventUnsubscribers.length + system.domUnsubscribers.length
    };
  }
}

// =============================================================================
// CANVAS MANAGEMENT SERVICE IMPLEMENTATION
// =============================================================================

export class DefaultCanvasManagementService implements CanvasManagementService {
  private systemCanvases = new Map<string, Map<string, CanvasResult>>();
  private capabilities = detectRenderingCapabilities();

  async createCanvas(
    systemName: string,
    canvasId: string,
    options: CanvasOptions
  ): Promise<CanvasResult> {
    const systemCanvasMap = this.systemCanvases.get(systemName) || new Map();
    
    // Check if canvas already exists
    const existing = systemCanvasMap.get(canvasId);
    if (existing) {
      Y3KDebug?.debug?.warn("CanvasManagement", 
        `Canvas ${canvasId} already exists for system ${systemName}`);
      return existing;
    }
    
    try {
      const canvasResult = await createOptimizedCanvas({
        id: canvasId,
        width: options.width || 800,
        height: options.height || 600,
        alpha: options.alpha ?? true,
        preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
        preferredType: options.contextType as CanvasContextType
      });
      
      systemCanvasMap.set(canvasId, canvasResult);
      this.systemCanvases.set(systemName, systemCanvasMap);
      
      Y3KDebug?.debug?.log("CanvasManagement", 
        `Created ${options.contextType} canvas ${canvasId} for system ${systemName} (${options.width}x${options.height})`);
      
      return canvasResult;
      
    } catch (error) {
      Y3KDebug?.debug?.error("CanvasManagement", 
        `Failed to create canvas ${canvasId} for system ${systemName}:`, error);
      throw error;
    }
  }

  getCanvas(systemName: string, canvasId: string): CanvasResult | null {
    return this.systemCanvases.get(systemName)?.get(canvasId) || null;
  }

  resizeCanvas(systemName: string, canvasId: string, width: number, height: number): boolean {
    const canvas = this.getCanvas(systemName, canvasId);
    if (!canvas) return false;
    
    try {
      canvas.canvas.width = width;
      canvas.canvas.height = height;
      
      // Update viewport for WebGL contexts
      if (canvas.ctx && 'viewport' in canvas.ctx) {
        (canvas.ctx as WebGLRenderingContext).viewport(0, 0, width, height);
      }
      
      return true;
    } catch (error) {
      Y3KDebug?.debug?.error("CanvasManagement", 
        `Failed to resize canvas ${canvasId} for system ${systemName}:`, error);
      return false;
    }
  }

  destroyCanvas(systemName: string, canvasId: string): void {
    const systemCanvasMap = this.systemCanvases.get(systemName);
    if (!systemCanvasMap) return;
    
    const canvas = systemCanvasMap.get(canvasId);
    if (canvas) {
      // Clean up WebGL resources
      if (canvas.ctx && 'getExtension' in canvas.ctx) {
        const gl = canvas.ctx as WebGLRenderingContext;
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
      
      // Remove from DOM if attached
      if (canvas.canvas.parentNode) {
        canvas.canvas.parentNode.removeChild(canvas.canvas);
      }
      
      systemCanvasMap.delete(canvasId);
      
      Y3KDebug?.debug?.log("CanvasManagement", 
        `Destroyed canvas ${canvasId} for system ${systemName}`);
    }
  }

  cleanupSystem(systemName: string): void {
    const systemCanvasMap = this.systemCanvases.get(systemName);
    if (!systemCanvasMap) return;
    
    for (const canvasId of systemCanvasMap.keys()) {
      this.destroyCanvas(systemName, canvasId);
    }
    
    this.systemCanvases.delete(systemName);
  }

  getCanvasCapabilities() {
    return {
      webgl2: this.capabilities.webgl2,
      webgl: false, // WebGL 1 support not tracked in current capabilities
      recommendedType: this.capabilities.recommendedType,
      maxTextureSize: 2048, // Default value since not tracked in current capabilities
      maxViewportDims: [2048, 2048] as [number, number] // Default value since not tracked in current capabilities
    };
  }

  getCanvasStats(systemName: string) {
    const systemCanvasMap = this.systemCanvases.get(systemName);
    if (!systemCanvasMap) return null;
    
    const contexts: CanvasContextType[] = [];
    let totalMemoryUsage = 0;
    
    for (const canvas of systemCanvasMap.values()) {
      contexts.push(canvas.type);
      // Rough memory estimation
      totalMemoryUsage += canvas.canvas.width * canvas.canvas.height * 4; // RGBA bytes
    }
    
    return {
      activeCanvases: systemCanvasMap.size,
      totalMemoryUsage,
      contexts
    };
  }
}

// =============================================================================
// SERVICE FACTORY
// =============================================================================

export class DefaultServiceFactory {
  private static services: ServiceContainer | null = null;
  
  static getServices(): ServiceContainer {
    if (!DefaultServiceFactory.services) {
      DefaultServiceFactory.services = {
        lifecycle: new DefaultSystemLifecycleService(),
        performance: new DefaultPerformanceTrackingService(),
        cssVariables: new DefaultCSSVariableService(),
        events: new DefaultEventSubscriptionService(),
        canvas: new DefaultCanvasManagementService()
      };
    }
    
    return DefaultServiceFactory.services!;
  }
  
  static resetServices(): void {
    DefaultServiceFactory.services = null;
  }
}