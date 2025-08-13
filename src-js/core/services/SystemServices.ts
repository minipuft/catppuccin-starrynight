/**
 * System Services - Focused service interfaces for system management
 * 
 * Replaces heavy inheritance with composition-based services.
 * Each service has a single responsibility and can be injected as needed.
 * 
 * @architecture Service composition over inheritance
 * @performance Reduced bundle size through tree-shaking
 */

import type { HealthCheckResult } from "@/types/systems";
import type { Year3000Config } from "@/types/models";
import type { CanvasResult, CanvasContextType } from "@/utils/graphics/VisualCanvasFactory";

// =============================================================================
// SYSTEM LIFECYCLE SERVICE
// =============================================================================

export interface SystemLifecycleService {
  /**
   * Initialize a system with standard lifecycle management
   */
  initializeSystem(
    systemName: string,
    config: Year3000Config,
    initFn: () => Promise<void>
  ): Promise<void>;
  
  /**
   * Destroy a system with proper cleanup
   */
  destroySystem(
    systemName: string,
    cleanupFn: () => void
  ): void;
  
  /**
   * Check if a system is initialized
   */
  isSystemInitialized(systemName: string): boolean;
  
  /**
   * Get system initialization metrics
   */
  getSystemMetrics(systemName: string): {
    initializationTime: number;
    lastInitialized: number;
    initializationCount: number;
  } | null;
}

// =============================================================================
// PERFORMANCE TRACKING SERVICE
// =============================================================================

export interface PerformanceTrackingService {
  /**
   * Track operation performance
   */
  trackOperation<T>(
    systemName: string,
    operationName: string,
    operation: () => T
  ): T;
  
  /**
   * Track async operation performance
   */
  trackOperationAsync<T>(
    systemName: string,
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T>;
  
  /**
   * Record a metric value
   */
  recordMetric(
    systemName: string,
    metricName: string,
    value: number
  ): void;
  
  /**
   * Get performance metrics for a system
   */
  getMetrics(systemName: string): {
    operationTimes: Record<string, number[]>;
    metrics: Record<string, number>;
    averageOperationTime: number;
    lastOperationTime: number;
  } | null;
}

// =============================================================================
// CSS VARIABLE SERVICE
// =============================================================================

export interface CSSVariableService {
  /**
   * Queue a CSS variable update for batch processing
   */
  queueUpdate(variable: string, value: string): void;
  
  /**
   * Queue multiple CSS variable updates
   */
  queueBatchUpdate(updates: Record<string, string>): void;
  
  /**
   * Flush all queued updates immediately
   */
  flushUpdates(): void;
  
  /**
   * Schedule automatic flush (for performance)
   */
  scheduleFlush(): void;
  
  /**
   * Get current CSS variable value
   */
  getCurrentValue(variable: string): string | null;
  
  /**
   * Get update queue status
   */
  getQueueStatus(): {
    queueSize: number;
    lastFlushTime: number;
    pendingUpdates: string[];
  };
}

// =============================================================================
// EVENT SUBSCRIPTION SERVICE
// =============================================================================

export interface EventSubscriptionService {
  /**
   * Subscribe to an event with automatic cleanup tracking
   */
  subscribe<T = any>(
    systemName: string,
    eventName: string,
    handler: (data: T) => void
  ): void;
  
  /**
   * Subscribe to a DOM event with automatic cleanup tracking
   */
  subscribeToDOM(
    systemName: string,
    element: Element | Window | Document,
    eventType: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void;
  
  /**
   * Unsubscribe from a specific event
   */
  unsubscribe(systemName: string, eventName: string): void;
  
  /**
   * Clean up all subscriptions for a system
   */
  cleanupSystem(systemName: string): void;
  
  /**
   * Get subscription status for a system
   */
  getSubscriptionStatus(systemName: string): {
    eventSubscriptions: string[];
    domSubscriptions: number;
    totalSubscriptions: number;
  };
}

// =============================================================================
// CANVAS MANAGEMENT SERVICE
// =============================================================================

export interface CanvasOptions {
  contextType: CanvasContextType;
  width: number;
  height: number;
  alpha?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
}

export interface CanvasManagementService {
  /**
   * Create an optimized canvas with GPU acceleration if available
   */
  createCanvas(
    systemName: string,
    canvasId: string,
    options: CanvasOptions
  ): Promise<CanvasResult>;
  
  /**
   * Get an existing canvas for a system
   */
  getCanvas(systemName: string, canvasId: string): CanvasResult | null;
  
  /**
   * Resize a canvas and handle context restoration
   */
  resizeCanvas(
    systemName: string,
    canvasId: string,
    width: number,
    height: number
  ): boolean;
  
  /**
   * Destroy a canvas and clean up resources
   */
  destroyCanvas(systemName: string, canvasId: string): void;
  
  /**
   * Clean up all canvases for a system
   */
  cleanupSystem(systemName: string): void;
  
  /**
   * Get canvas capabilities for the current device
   */
  getCanvasCapabilities(): {
    webgl2: boolean;
    webgl: boolean;
    recommendedType: CanvasContextType;
    maxTextureSize: number;
    maxViewportDims: [number, number];
  };
  
  /**
   * Get canvas usage statistics
   */
  getCanvasStats(systemName: string): {
    activeCanvases: number;
    totalMemoryUsage: number;
    contexts: CanvasContextType[];
  } | null;
}

// =============================================================================
// SERVICE INJECTION INTERFACE
// =============================================================================

export interface ServiceContainer {
  lifecycle?: SystemLifecycleService;
  performance?: PerformanceTrackingService;
  cssVariables?: CSSVariableService;
  events?: EventSubscriptionService;
  canvas?: CanvasManagementService;
}

// =============================================================================
// ENHANCED IMANAGEDYSTEM WITH SERVICES
// =============================================================================

/**
 * Optional interface for systems that want service injection
 */
export interface IServiceAwareSystem {
  /**
   * Inject services into the system
   */
  injectServices?(services: ServiceContainer): void;
  
  /**
   * Get required services for this system
   */
  getRequiredServices?(): (keyof ServiceContainer)[];
  
  /**
   * Get optional services for this system
   */
  getOptionalServices?(): (keyof ServiceContainer)[];
}

/**
 * Extended interface combining IManagedSystem with service awareness
 */
export interface IManagedServiceSystem extends IServiceAwareSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<HealthCheckResult>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}