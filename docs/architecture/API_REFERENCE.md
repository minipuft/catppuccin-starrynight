# Unified System Architecture - API Reference

## Overview

Complete API reference for the unified system architecture components. This document provides detailed information about classes, interfaces, methods, and types.

**API Version**: 2.0.0  
**Last Updated**: July 2025

## Table of Contents

1. [UnifiedSystemBase](#unifiedsystembase)
2. [EnhancedMasterAnimationCoordinator](#enhancedmasteranimationcoordinator)
3. [UnifiedCSSVariableManager](#unifiedcssvariablemanager)
4. [UnifiedPerformanceCoordinator](#unifiedperformancecoordinator)
5. [UnifiedSystemRegistry](#unifiedsystemregistry)
6. [Types and Interfaces](#types-and-interfaces)
7. [Events](#events)
8. [Configuration](#configuration)

## UnifiedSystemBase

**Location**: `src-js/core/base/UnifiedSystemBase.ts`

Abstract base class that all unified systems extend. Provides consistent lifecycle management, performance monitoring, and integration patterns.

### Constructor

```typescript
constructor(config: Year3000Config = YEAR3000_CONFIG)
```

**Parameters**:
- `config`: Configuration object for the system

### Abstract Methods

These methods must be implemented by extending classes:

#### initialize()
```typescript
abstract initialize(): Promise<void>
```
Initialize the system. Called during system startup.

**Returns**: `Promise<void>`

#### onAnimate()
```typescript
abstract onAnimate(deltaTime: number): void
```
Animation frame callback. Called at the registered frame rate.

**Parameters**:
- `deltaTime`: Time since last frame in milliseconds

#### destroy()
```typescript
abstract destroy(): void
```
Clean up system resources. Called during system shutdown.

#### healthCheck()
```typescript
abstract healthCheck(): Promise<HealthCheckResult>
```
Check system health status.

**Returns**: `Promise<HealthCheckResult>`

### Properties

#### isInitialized
```typescript
readonly isInitialized: boolean
```
Whether the system has been initialized.

#### systemName
```typescript
readonly systemName: string
```
Unique system identifier.

#### config
```typescript
protected readonly config: Year3000Config
```
System configuration.

#### cssVariableManager
```typescript
protected cssVariableManager: UnifiedCSSVariableManager
```
CSS variable management instance.

#### performanceCoordinator
```typescript
protected performanceCoordinator: UnifiedPerformanceCoordinator
```
Performance monitoring instance.

#### animationCoordinator
```typescript
protected animationCoordinator: EnhancedMasterAnimationCoordinator
```
Animation coordination instance.

### Methods

#### registerAnimation()
```typescript
protected registerAnimation(targetFPS: number): void
```
Register system for animation callbacks.

**Parameters**:
- `targetFPS`: Target frames per second

#### subscribeToEvent()
```typescript
protected subscribeToEvent<T>(eventName: string, callback: (payload: T) => void): void
```
Subscribe to system events.

**Parameters**:
- `eventName`: Event name to subscribe to
- `callback`: Event handler function

#### publishEvent()
```typescript
protected publishEvent<T>(eventName: string, payload: T): void
```
Publish system event.

**Parameters**:
- `eventName`: Event name to publish
- `payload`: Event payload

#### unsubscribeFromAllEvents()
```typescript
protected unsubscribeFromAllEvents(): void
```
Unsubscribe from all events. Called automatically during destroy.

#### forceRepaint()
```typescript
forceRepaint?(reason?: string): void
```
Optional method to force system repaint.

**Parameters**:
- `reason`: Optional reason for repaint

#### onPerformanceModeChange()
```typescript
onPerformanceModeChange?(mode: "performance" | "quality"): void
```
Optional handler for performance mode changes.

**Parameters**:
- `mode`: New performance mode

### Example Usage

```typescript
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';

export class ExampleSystem extends UnifiedSystemBase {
  private isActive = false;
  
  async initialize(): Promise<void> {
    await super.initialize();
    
    this.subscribeToEvent('system:activate', () => {
      this.isActive = true;
    });
    
    this.registerAnimation(60);
  }
  
  onAnimate(deltaTime: number): void {
    if (this.isActive) {
      this.cssVariableManager.queueUpdate(
        '--example-time',
        Date.now().toString(),
        'normal'
      );
    }
  }
  
  async healthCheck(): Promise<HealthCheckResult> {
    return {
      ok: this.isInitialized,
      details: `System ${this.isInitialized ? 'healthy' : 'not initialized'}`
    };
  }
  
  destroy(): void {
    this.isActive = false;
    super.destroy();
  }
}
```

## EnhancedMasterAnimationCoordinator

**Location**: `src-js/core/animation/EnhancedMasterAnimationCoordinator.ts`

Unified animation coordination system that manages all animation callbacks and frame scheduling.

### Static Methods

#### getInstance()
```typescript
static getInstance(config?: Year3000Config): EnhancedMasterAnimationCoordinator
```
Get singleton instance.

**Parameters**:
- `config`: Optional configuration

**Returns**: `EnhancedMasterAnimationCoordinator`

### Methods

#### registerAnimationSystem()
```typescript
registerAnimationSystem(
  name: string,
  system: AnimationSystem | IVisualSystem,
  priority: 'critical' | 'normal' | 'background',
  targetFPS: number
): boolean
```
Register animation system.

**Parameters**:
- `name`: System name
- `system`: System instance
- `priority`: Animation priority
- `targetFPS`: Target frame rate

**Returns**: `boolean` - Registration success

#### unregisterAnimationSystem()
```typescript
unregisterAnimationSystem(name: string): boolean
```
Unregister animation system.

**Parameters**:
- `name`: System name

**Returns**: `boolean` - Unregistration success

#### registerFrameCallback()
```typescript
registerFrameCallback(
  callback: (deltaTime: number, timestamp: number) => void,
  priority: 'critical' | 'normal' | 'background',
  systemName?: string
): string
```
Register frame callback.

**Parameters**:
- `callback`: Callback function
- `priority`: Callback priority
- `systemName`: Optional system name

**Returns**: `string` - Callback ID

#### unregisterFrameCallback()
```typescript
unregisterFrameCallback(callbackId: string): boolean
```
Unregister frame callback.

**Parameters**:
- `callbackId`: Callback ID

**Returns**: `boolean` - Unregistration success

#### start()
```typescript
start(): void
```
Start animation loop.

#### stop()
```typescript
stop(): void
```
Stop animation loop.

#### pause()
```typescript
pause(): void
```
Pause animation loop.

#### resume()
```typescript
resume(): void
```
Resume animation loop.

#### setPerformanceMode()
```typescript
setPerformanceMode(mode: "performance" | "quality"): void
```
Set performance mode.

**Parameters**:
- `mode`: Performance mode

#### getMetrics()
```typescript
getMetrics(): ConsolidatedMetrics
```
Get animation metrics.

**Returns**: `ConsolidatedMetrics`

### Example Usage

```typescript
import { EnhancedMasterAnimationCoordinator } from '@/core/animation/EnhancedMasterAnimationCoordinator';

// Get singleton instance
const coordinator = EnhancedMasterAnimationCoordinator.getInstance();

// Register animation system
const registered = coordinator.registerAnimationSystem(
  'MySystem',
  mySystem,
  'normal',
  60
);

// Register frame callback
const callbackId = coordinator.registerFrameCallback(
  (deltaTime, timestamp) => {
    // Animation logic
  },
  'critical',
  'MyFrameCallback'
);

// Start animation loop
coordinator.start();

// Get metrics
const metrics = coordinator.getMetrics();
console.log('Animation metrics:', metrics);
```

## UnifiedCSSVariableManager

**Location**: `src-js/core/css/UnifiedCSSVariableManager.ts`

Centralized CSS variable management with priority-based updates and performance optimization.

### Static Methods

#### getInstance()
```typescript
static getInstance(): UnifiedCSSVariableManager
```
Get singleton instance.

**Returns**: `UnifiedCSSVariableManager`

### Methods

#### queueUpdate()
```typescript
queueUpdate(
  property: string,
  value: string,
  priority: 'critical' | 'normal' | 'background'
): void
```
Queue CSS variable update.

**Parameters**:
- `property`: CSS property name
- `value`: CSS property value
- `priority`: Update priority

#### queueBatch()
```typescript
queueBatch(
  updates: Record<string, string>,
  priority: 'critical' | 'normal' | 'background'
): void
```
Queue batch of CSS variable updates.

**Parameters**:
- `updates`: Object with property-value pairs
- `priority`: Update priority

#### queueGroupUpdate()
```typescript
queueGroupUpdate(
  groupName: string,
  updates: Record<string, string>,
  priority: 'critical' | 'normal' | 'background'
): void
```
Queue group of related CSS variable updates.

**Parameters**:
- `groupName`: Group identifier
- `updates`: Object with property-value pairs
- `priority`: Update priority

#### flush()
```typescript
flush(): void
```
Immediately flush all queued updates.

#### clearQueue()
```typescript
clearQueue(): void
```
Clear all queued updates.

#### getUpdateMetrics()
```typescript
getUpdateMetrics(): CSSUpdateMetrics
```
Get CSS update metrics.

**Returns**: `CSSUpdateMetrics`

### Example Usage

```typescript
import { UnifiedCSSVariableManager } from '@/core/css/UnifiedCSSVariableManager';

// Get singleton instance
const manager = UnifiedCSSVariableManager.getInstance();

// Single update
manager.queueUpdate('--primary-color', '#ff0000', 'critical');

// Batch updates
manager.queueBatch({
  '--secondary-color': '#00ff00',
  '--accent-color': '#0000ff',
  '--border-radius': '8px'
}, 'normal');

// Group updates
manager.queueGroupUpdate('theme-colors', {
  '--bg-primary': '#1a1a1a',
  '--bg-secondary': '#2a2a2a',
  '--text-primary': '#ffffff'
}, 'background');

// Get metrics
const metrics = manager.getUpdateMetrics();
console.log('CSS update metrics:', metrics);
```

## UnifiedPerformanceCoordinator

**Location**: `src-js/core/performance/UnifiedPerformanceCoordinator.ts`

Interface for unified performance monitoring and optimization.

### Methods

#### recordMetric()
```typescript
recordMetric(name: string, value: number, category: string): void
```
Record performance metric.

**Parameters**:
- `name`: Metric name
- `value`: Metric value
- `category`: Metric category

#### requestOptimization()
```typescript
requestOptimization(level: 'mild' | 'moderate' | 'aggressive'): void
```
Request performance optimization.

**Parameters**:
- `level`: Optimization level

#### getHealthStatus()
```typescript
getHealthStatus(): PerformanceHealthStatus
```
Get performance health status.

**Returns**: `PerformanceHealthStatus`

#### getMetrics()
```typescript
getMetrics(): PerformanceMetrics
```
Get performance metrics.

**Returns**: `PerformanceMetrics`

#### setPerformanceMode()
```typescript
setPerformanceMode(mode: "performance" | "quality"): void
```
Set performance mode.

**Parameters**:
- `mode`: Performance mode

### Example Usage

```typescript
// Record custom metric
performanceCoordinator.recordMetric('custom-metric', 42, 'system');

// Request optimization
performanceCoordinator.requestOptimization('moderate');

// Get health status
const health = performanceCoordinator.getHealthStatus();
console.log('Performance health:', health);
```

## UnifiedSystemRegistry

**Location**: `src-js/core/registry/UnifiedSystemRegistry.ts`

Dependency-aware system registration and lifecycle management.

### Constructor

```typescript
constructor(config: RegistryConfig)
```

**Parameters**:
- `config`: Registry configuration

### Methods

#### register()
```typescript
register(
  name: string,
  system: UnifiedSystemBase,
  dependencies: string[] = []
): void
```
Register system with dependencies.

**Parameters**:
- `name`: System name
- `system`: System instance
- `dependencies`: Array of dependency names

#### unregister()
```typescript
unregister(name: string): boolean
```
Unregister system.

**Parameters**:
- `name`: System name

**Returns**: `boolean` - Unregistration success

#### getSystem()
```typescript
getSystem<T extends UnifiedSystemBase>(name: string): T | undefined
```
Get registered system.

**Parameters**:
- `name`: System name

**Returns**: `T | undefined` - System instance or undefined

#### initializeAll()
```typescript
initializeAll(): Promise<InitializationResults>
```
Initialize all registered systems in dependency order.

**Returns**: `Promise<InitializationResults>`

#### destroyAll()
```typescript
destroyAll(): void
```
Destroy all registered systems.

#### performHealthCheck()
```typescript
performHealthCheck(): Promise<HealthCheckResults>
```
Perform health check on all systems.

**Returns**: `Promise<HealthCheckResults>`

### Example Usage

```typescript
import { UnifiedSystemRegistry } from '@/core/registry/UnifiedSystemRegistry';

// Create registry
const registry = new UnifiedSystemRegistry({
  enableDebug: true,
  healthCheckInterval: 60000
});

// Register systems with dependencies
registry.register('SystemA', systemA, []);
registry.register('SystemB', systemB, ['SystemA']);
registry.register('SystemC', systemC, ['SystemA', 'SystemB']);

// Initialize all systems
const results = await registry.initializeAll();
console.log('Initialization results:', results);

// Get system
const systemA = registry.getSystem<SystemA>('SystemA');

// Health check
const health = await registry.performHealthCheck();
console.log('Health check:', health);
```

## Types and Interfaces

### HealthCheckResult
```typescript
interface HealthCheckResult {
  ok: boolean;
  details: string;
  issues?: string[];
}
```

### Year3000Config
```typescript
interface Year3000Config {
  enableDebug: boolean;
  performanceMode: "performance" | "quality";
  maxMemoryUsage: number;
  targetFPS: number;
  // ... other config properties
}
```

### AnimationSystem
```typescript
interface AnimationSystem {
  onAnimate(deltaMs: number): void;
  updateAnimation?(timestamp: number, deltaTime: number): void;
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
}
```

### IVisualSystem
```typescript
interface IVisualSystem {
  systemName: string;
  onAnimate(deltaMs: number, context: FrameContext): void;
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
  destroy(): void;
}
```

### FrameContext
```typescript
interface FrameContext {
  timestamp: number;
  deltaMs: number;
  performanceMode: "performance" | "quality";
  frameBudget: number;
  beatIntensity?: number;
  scrollRatio?: number;
  tiltXY?: { x: number; y: number };
}
```

### VisualSystemPriority
```typescript
type VisualSystemPriority = "critical" | "normal" | "background";
```

### ConsolidatedMetrics
```typescript
interface ConsolidatedMetrics {
  totalFrames: number;
  droppedFrames: number;
  averageFrameTime: number;
  maxFrameTime: number;
  performanceMode: "performance" | "quality";
  activeAnimations: number;
  activeCallbacks: number;
  frameRate: number;
  lastOptimization: number;
}
```

### CSSUpdateMetrics
```typescript
interface CSSUpdateMetrics {
  totalUpdates: number;
  batchedUpdates: number;
  criticalUpdates: number;
  normalUpdates: number;
  backgroundUpdates: number;
  averageUpdateTime: number;
  maxUpdateTime: number;
  queueSize: number;
  lastFlush: number;
}
```

### PerformanceHealthStatus
```typescript
interface PerformanceHealthStatus {
  overall: "healthy" | "warning" | "critical";
  memory: {
    used: number;
    limit: number;
    status: "healthy" | "warning" | "critical";
  };
  cpu: {
    usage: number;
    status: "healthy" | "warning" | "critical";
  };
  frameRate: {
    current: number;
    target: number;
    status: "healthy" | "warning" | "critical";
  };
}
```

### InitializationResults
```typescript
interface InitializationResults {
  success: string[];
  failed: string[];
  skipped: string[];
  totalTime: number;
  errors: Record<string, Error>;
}
```

### HealthCheckResults
```typescript
interface HealthCheckResults {
  healthy: string[];
  unhealthy: string[];
  results: Map<string, HealthCheckResult>;
  timestamp: number;
}
```

## Events

### System Events

#### system:initialized
Fired when a system is initialized.

**Payload**:
```typescript
{
  systemName: string;
  timestamp: number;
  initializationTime: number;
}
```

#### system:destroyed
Fired when a system is destroyed.

**Payload**:
```typescript
{
  systemName: string;
  timestamp: number;
}
```

#### system:health-check
Fired when a system health check is performed.

**Payload**:
```typescript
{
  systemName: string;
  result: HealthCheckResult;
  timestamp: number;
}
```

### Performance Events

#### performance:mode-changed
Fired when performance mode changes.

**Payload**:
```typescript
{
  oldMode: "performance" | "quality";
  newMode: "performance" | "quality";
  reason: string;
  timestamp: number;
}
```

#### performance:optimization-requested
Fired when optimization is requested.

**Payload**:
```typescript
{
  level: "mild" | "moderate" | "aggressive";
  reason: string;
  timestamp: number;
}
```

#### performance:threshold-exceeded
Fired when performance thresholds are exceeded.

**Payload**:
```typescript
{
  metric: string;
  value: number;
  threshold: number;
  severity: "warning" | "critical";
  timestamp: number;
}
```

### Animation Events

#### animation:frame-dropped
Fired when animation frames are dropped.

**Payload**:
```typescript
{
  droppedFrames: number;
  totalFrames: number;
  timestamp: number;
}
```

#### animation:system-registered
Fired when animation system is registered.

**Payload**:
```typescript
{
  systemName: string;
  priority: VisualSystemPriority;
  targetFPS: number;
  timestamp: number;
}
```

## Configuration

### YEAR3000_CONFIG
Global configuration object for all systems.

```typescript
const YEAR3000_CONFIG: Year3000Config = {
  enableDebug: false,
  performanceMode: "quality",
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  targetFPS: 60,
  enableAnimations: true,
  enablePerformanceMonitoring: true,
  healthCheckInterval: 60000, // 1 minute
  maxInitializationTime: 5000, // 5 seconds
  // ... other config properties
};
```

### Registry Configuration
```typescript
interface RegistryConfig {
  enableDebug?: boolean;
  healthCheckInterval?: number;
  maxInitializationTime?: number;
  enableAutomaticCleanup?: boolean;
}
```

---

**API Version**: 2.0.0  
**Last Updated**: July 2025  
**Maintainer**: Catppuccin StarryNight Team