import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { HealthCheckResult } from '@/types/systems';
import { SystemMigrationHelper } from '@/core/migration/SystemMigrationHelper';

/**
 * Registry for managing all unified systems with dependency resolution
 * 
 * This registry provides:
 * - Dependency-aware initialization ordering
 * - Centralized system lifecycle management
 * - Health monitoring and reporting
 * - Migration assistance for existing systems
 * 
 * @architecture Phase 1 of system consolidation
 */
export class UnifiedSystemRegistry {
  private systems: Map<string, UnifiedSystemBase> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  private initializationOrder: string[] = [];
  private initialized: boolean = false;
  private config: {
    enableDebug: boolean;
    healthCheckInterval: number;
    maxInitializationTime: number;
  };
  
  private healthCheckTimer: number | null = null;
  
  constructor(config: {
    enableDebug?: boolean;
    healthCheckInterval?: number;
    maxInitializationTime?: number;
  } = {}) {
    this.config = {
      enableDebug: config.enableDebug || false,
      healthCheckInterval: config.healthCheckInterval || 30000, // 30 seconds
      maxInitializationTime: config.maxInitializationTime || 10000 // 10 seconds
    };
    
    if (this.config.enableDebug) {
      console.log('[UnifiedSystemRegistry] Created with config:', this.config);
    }
  }
  
  /**
   * Register a system with optional dependencies
   * 
   * @param name - Unique name for the system
   * @param system - UnifiedSystemBase instance
   * @param dependencies - Array of system names this system depends on
   */
  register(name: string, system: UnifiedSystemBase, dependencies: string[] = []): void {
    if (this.systems.has(name)) {
      console.warn(`[UnifiedSystemRegistry] System ${name} already registered, replacing`);
    }
    
    this.systems.set(name, system);
    this.dependencies.set(name, dependencies);
    
    // Recalculate initialization order
    this.calculateInitializationOrder();
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedSystemRegistry] Registered system: ${name}`, {
        dependencies,
        totalSystems: this.systems.size
      });
    }
  }
  
  /**
   * Register a legacy system using migration helper
   * 
   * @param name - Unique name for the system
   * @param legacySystem - Legacy system (IManagedSystem or BaseVisualSystem)
   * @param dependencies - Array of system names this system depends on
   */
  registerLegacySystem(name: string, legacySystem: any, dependencies: string[] = []): void {
    try {
      const migratedSystem = SystemMigrationHelper.createCompatibilityLayer(legacySystem);
      this.register(name, migratedSystem, dependencies);
      
      if (this.config.enableDebug) {
        console.log(`[UnifiedSystemRegistry] Migrated and registered legacy system: ${name}`);
      }
    } catch (error) {
      console.error(`[UnifiedSystemRegistry] Failed to migrate legacy system ${name}:`, error);
    }
  }
  
  /**
   * Unregister a system
   * 
   * @param name - System name to unregister
   */
  unregister(name: string): void {
    if (!this.systems.has(name)) {
      console.warn(`[UnifiedSystemRegistry] System ${name} not found for unregistration`);
      return;
    }
    
    const system = this.systems.get(name)!;
    
    // Destroy the system if it's still initialized
    if (system.isInitialized && !system.isDestroyed) {
      system._baseDestroy();
    }
    
    this.systems.delete(name);
    this.dependencies.delete(name);
    
    // Recalculate initialization order
    this.calculateInitializationOrder();
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedSystemRegistry] Unregistered system: ${name}`);
    }
  }
  
  /**
   * Initialize all registered systems in dependency order
   */
  async initializeAll(): Promise<{
    success: string[];
    failed: string[];
    skipped: string[];
  }> {
    if (this.initialized) {
      console.warn('[UnifiedSystemRegistry] Already initialized');
      return { success: [], failed: [], skipped: [] };
    }
    
    const startTime = performance.now();
    const results = {
      success: [] as string[],
      failed: [] as string[],
      skipped: [] as string[]
    };
    
    if (this.config.enableDebug) {
      console.log('[UnifiedSystemRegistry] Starting initialization of all systems');
      console.log('Initialization order:', this.initializationOrder);
    }
    
    for (const systemName of this.initializationOrder) {
      const system = this.systems.get(systemName);
      if (!system) {
        results.skipped.push(systemName);
        continue;
      }
      
      try {
        const initStartTime = performance.now();
        await system._baseInitialize();
        const initTime = performance.now() - initStartTime;
        
        results.success.push(systemName);
        
        if (this.config.enableDebug) {
          console.log(`[UnifiedSystemRegistry] ✓ ${systemName} initialized (${initTime.toFixed(2)}ms)`);
        }
        
        // Check if we're exceeding the maximum initialization time
        if (initTime > this.config.maxInitializationTime) {
          console.warn(`[UnifiedSystemRegistry] System ${systemName} took ${initTime.toFixed(2)}ms to initialize (threshold: ${this.config.maxInitializationTime}ms)`);
        }
        
      } catch (error) {
        console.error(`[UnifiedSystemRegistry] ✗ Failed to initialize ${systemName}:`, error);
        results.failed.push(systemName);
      }
    }
    
    this.initialized = true;
    
    // Start health monitoring
    this.startHealthMonitoring();
    
    const totalTime = performance.now() - startTime;
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedSystemRegistry] Initialization complete (${totalTime.toFixed(2)}ms)`, results);
    }
    
    return results;
  }
  
  /**
   * Destroy all systems in reverse initialization order
   */
  destroyAll(): void {
    if (!this.initialized) {
      console.warn('[UnifiedSystemRegistry] Not initialized, nothing to destroy');
      return;
    }
    
    // Stop health monitoring
    this.stopHealthMonitoring();
    
    // Destroy in reverse order
    const reverseOrder = [...this.initializationOrder].reverse();
    
    if (this.config.enableDebug) {
      console.log('[UnifiedSystemRegistry] Destroying all systems in reverse order');
    }
    
    for (const systemName of reverseOrder) {
      const system = this.systems.get(systemName);
      if (system && system.isInitialized && !system.isDestroyed) {
        try {
          system._baseDestroy();
          if (this.config.enableDebug) {
            console.log(`[UnifiedSystemRegistry] ✓ ${systemName} destroyed`);
          }
        } catch (error) {
          console.error(`[UnifiedSystemRegistry] ✗ Failed to destroy ${systemName}:`, error);
        }
      }
    }
    
    this.initialized = false;
    
    if (this.config.enableDebug) {
      console.log('[UnifiedSystemRegistry] All systems destroyed');
    }
  }
  
  /**
   * Get a system by name
   * 
   * @param name - System name
   * @returns System instance or undefined
   */
  getSystem(name: string): UnifiedSystemBase | undefined {
    return this.systems.get(name);
  }
  
  /**
   * Get all system names
   */
  getSystemNames(): string[] {
    return Array.from(this.systems.keys());
  }
  
  /**
   * Get initialization order
   */
  getInitializationOrder(): string[] {
    return [...this.initializationOrder];
  }
  
  /**
   * Check if a system is registered
   */
  hasSystem(name: string): boolean {
    return this.systems.has(name);
  }
  
  /**
   * Get system count
   */
  getSystemCount(): number {
    return this.systems.size;
  }
  
  /**
   * Perform health check on all systems
   */
  async performHealthCheck(): Promise<{
    healthy: string[];
    unhealthy: string[];
    results: Map<string, HealthCheckResult>;
  }> {
    const results = new Map<string, HealthCheckResult>();
    const healthy: string[] = [];
    const unhealthy: string[] = [];
    
    for (const [name, system] of this.systems) {
      if (!system.isInitialized || system.isDestroyed) {
        const result: HealthCheckResult = {
          healthy: false,
          ok: false,
          details: `System ${name} not initialized or destroyed`,
          issues: ['System not ready'],
          system: name
        };
        results.set(name, result);
        unhealthy.push(name);
        continue;
      }
      
      try {
        const healthResult = await system.healthCheck();
        results.set(name, healthResult);
        
        if (healthResult.ok) {
          healthy.push(name);
        } else {
          unhealthy.push(name);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const result: HealthCheckResult = {
          healthy: false,
          ok: false,
          details: `Health check failed: ${errorMessage}`,
          issues: [errorMessage],
          system: name
        };
        results.set(name, result);
        unhealthy.push(name);
      }
    }
    
    return { healthy, unhealthy, results };
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Calculate initialization order using topological sort
   */
  private calculateInitializationOrder(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];
    
    const visit = (systemName: string) => {
      if (visiting.has(systemName)) {
        throw new Error(`Circular dependency detected involving: ${systemName}`);
      }
      if (visited.has(systemName)) {
        return;
      }
      
      visiting.add(systemName);
      
      const deps = this.dependencies.get(systemName) || [];
      for (const dep of deps) {
        if (!this.systems.has(dep)) {
          console.warn(`[UnifiedSystemRegistry] Dependency ${dep} not found for system ${systemName}`);
          continue;
        }
        visit(dep);
      }
      
      visiting.delete(systemName);
      visited.add(systemName);
      order.push(systemName);
    };
    
    try {
      for (const systemName of this.systems.keys()) {
        visit(systemName);
      }
      
      this.initializationOrder = order;
      
      if (this.config.enableDebug) {
        console.log('[UnifiedSystemRegistry] Calculated initialization order:', order);
      }
    } catch (error) {
      console.error('[UnifiedSystemRegistry] Failed to calculate initialization order:', error);
      // Fallback to registration order
      this.initializationOrder = Array.from(this.systems.keys());
    }
  }
  
  /**
   * Start periodic health monitoring
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    this.healthCheckTimer = setInterval(async () => {
      const healthResult = await this.performHealthCheck();
      
      if (healthResult.unhealthy.length > 0) {
        console.warn('[UnifiedSystemRegistry] Unhealthy systems detected:', healthResult.unhealthy);
        
        if (this.config.enableDebug) {
          for (const unhealthySystem of healthResult.unhealthy) {
            const result = healthResult.results.get(unhealthySystem);
            console.warn(`[UnifiedSystemRegistry] ${unhealthySystem} health issues:`, result?.issues);
          }
        }
      }
    }, this.config.healthCheckInterval) as unknown as number;
  }
  
  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
  }
}