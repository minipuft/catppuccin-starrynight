import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import type { IManagedSystem, HealthCheckResult } from '@/types/systems';
import { BaseVisualSystem } from '@/visual/base/BaseVisualSystem';
import type { Year3000Config } from '@/types/models';

/**
 * Migration utilities for transitioning existing systems to UnifiedSystemBase
 * 
 * This helper provides wrappers and utilities to migrate:
 * - IManagedSystem implementations to UnifiedSystemBase
 * - BaseVisualSystem extensions to UnifiedSystemBase
 * - Batch migration capabilities
 * 
 * @architecture Phase 1 of system consolidation
 */
export class SystemMigrationHelper {
  
  /**
   * Wrap an existing IManagedSystem implementation to work with UnifiedSystemBase
   * 
   * @param systemClass - The IManagedSystem class to wrap
   * @param args - Constructor arguments for the system
   * @returns A UnifiedSystemBase wrapper
   */
  static wrapIManagedSystem<T extends IManagedSystem>(
    systemClass: new (...args: any[]) => T,
    ...args: any[]
  ): UnifiedSystemBase {
    
    return new (class extends UnifiedSystemBase {
      private originalSystem: T;
      
      constructor() {
        super();
        this.originalSystem = new systemClass(...args);
        this.systemName = this.originalSystem.constructor.name;
      }
      
      override async initialize(): Promise<void> {
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Migrating IManagedSystem initialization`);
        }
        await this.originalSystem.initialize();
      }
      
      override destroy(): void {
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Migrating IManagedSystem destruction`);
        }
        this.originalSystem.destroy();
      }
      
      override onAnimate(deltaTime: number): void {
        // Map onAnimate to updateAnimation
        this.originalSystem.updateAnimation(deltaTime);
      }
      
      override async healthCheck(): Promise<HealthCheckResult> {
        return await this.originalSystem.healthCheck();
      }
      
      // Expose the original system for any needed access
      getOriginalSystem(): T {
        return this.originalSystem;
      }
      
      // Forward forceRepaint if it exists
      public override forceRepaint(reason?: string): void {
        if (this.originalSystem.forceRepaint) {
          this.originalSystem.forceRepaint(reason);
        } else {
          super.forceRepaint(reason);
        }
      }
    })();
  }
  
  /**
   * Wrap an existing BaseVisualSystem extension to work with UnifiedSystemBase
   * 
   * @param systemClass - The BaseVisualSystem class to wrap
   * @param args - Constructor arguments for the system
   * @returns A UnifiedSystemBase wrapper
   */
  static wrapBaseVisualSystem<T extends BaseVisualSystem>(
    systemClass: new (...args: any[]) => T,
    ...args: any[]
  ): UnifiedSystemBase {
    
    return new (class extends UnifiedSystemBase {
      private originalSystem: T;
      
      constructor() {
        super();
        this.originalSystem = new systemClass(...args);
        this.systemName = this.originalSystem.constructor.name;
      }
      
      override async initialize(): Promise<void> {
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Migrating BaseVisualSystem initialization`);
        }
        await this.originalSystem.initialize();
      }
      
      override destroy(): void {
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Migrating BaseVisualSystem destruction`);
        }
        this.originalSystem.destroy();
      }
      
      override onAnimate(deltaTime: number): void {
        // Map onAnimate to the BaseVisualSystem animation method
        this.originalSystem.onAnimate(deltaTime);
      }
      
      override async healthCheck(): Promise<HealthCheckResult> {
        const isDestroyed = 'isDestroyed' in this.originalSystem ? 
          (this.originalSystem as any).isDestroyed : false;
        const result: HealthCheckResult = {
          ok: this.originalSystem.initialized && !isDestroyed,
          details: `${this.systemName} health check`,
        };
        if (!this.originalSystem.initialized) {
          result.issues = ['System not initialized'];
        }
        return result;
      }
      
      // Expose the original system for any needed access
      getOriginalSystem(): T {
        return this.originalSystem;
      }
      
      // Forward forceRepaint if it exists
      public override forceRepaint(reason?: string): void {
        if (this.originalSystem.forceRepaint) {
          this.originalSystem.forceRepaint(reason);
        } else {
          super.forceRepaint(reason);
        }
      }
    })();
  }
  
  /**
   * Migrate a map of systems to UnifiedSystemBase
   * 
   * @param systems - Map of system name to system instance
   * @returns Map of system name to UnifiedSystemBase wrapper
   */
  static migrateSystemsMap(systems: Map<string, any>): Map<string, UnifiedSystemBase> {
    const migratedSystems = new Map<string, UnifiedSystemBase>();
    
    for (const [name, system] of systems) {
      let migratedSystem: UnifiedSystemBase;
      
      if (this.implementsIManagedSystem(system)) {
        migratedSystem = this.wrapIManagedSystem(system.constructor as any);
      } else if (this.extendsBaseVisualSystem(system)) {
        migratedSystem = this.wrapBaseVisualSystem(system.constructor as any);
      } else {
        console.warn(`[SystemMigrationHelper] Unknown system type for ${name}, skipping migration`);
        continue;
      }
      
      migratedSystems.set(name, migratedSystem);
    }
    
    return migratedSystems;
  }
  
  /**
   * Create a compatibility layer for systems that need gradual migration
   * 
   * @param originalSystem - The original system to wrap
   * @returns A UnifiedSystemBase wrapper with compatibility methods
   */
  static createCompatibilityLayer(originalSystem: any): UnifiedSystemBase {
    if (this.implementsIManagedSystem(originalSystem)) {
      return this.wrapIManagedSystem(originalSystem.constructor as any);
    } else if (this.extendsBaseVisualSystem(originalSystem)) {
      return this.wrapBaseVisualSystem(originalSystem.constructor as any);
    } else {
      throw new Error(`[SystemMigrationHelper] Unable to create compatibility layer for ${originalSystem.constructor.name}`);
    }
  }
  
  /**
   * Validate that a system migration was successful
   * 
   * @param originalSystem - The original system
   * @param migratedSystem - The migrated UnifiedSystemBase
   * @returns Validation result
   */
  static validateMigration(originalSystem: any, migratedSystem: UnifiedSystemBase): {
    success: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check that basic methods are available
    if (typeof migratedSystem.initialize !== 'function') {
      issues.push('Missing initialize method');
    }
    
    if (typeof migratedSystem.destroy !== 'function') {
      issues.push('Missing destroy method');
    }
    
    if (typeof migratedSystem.onAnimate !== 'function') {
      issues.push('Missing onAnimate method');
    }
    
    if (typeof migratedSystem.healthCheck !== 'function') {
      issues.push('Missing healthCheck method');
    }
    
    // Check that the system name is preserved
    if (migratedSystem.name !== originalSystem.constructor.name) {
      issues.push(`System name mismatch: expected ${originalSystem.constructor.name}, got ${migratedSystem.name}`);
    }
    
    return {
      success: issues.length === 0,
      issues
    };
  }
  
  // =========================================================================
  // PRIVATE UTILITY METHODS
  // =========================================================================
  
  /**
   * Check if an object implements the IManagedSystem interface
   */
  private static implementsIManagedSystem(obj: any): obj is IManagedSystem {
    return obj && 
           typeof obj.initialize === 'function' &&
           typeof obj.destroy === 'function' &&
           typeof obj.updateAnimation === 'function' &&
           typeof obj.healthCheck === 'function' &&
           typeof obj.initialized === 'boolean';
  }
  
  /**
   * Check if an object extends the BaseVisualSystem class
   */
  private static extendsBaseVisualSystem(obj: any): obj is BaseVisualSystem {
    return obj && 
           typeof obj.initialize === 'function' &&
           typeof obj.destroy === 'function' &&
           typeof obj.onAnimate === 'function' &&
           typeof obj.initialized === 'boolean';
  }
  
  /**
   * Generate a migration report for a collection of systems
   */
  static generateMigrationReport(systems: Map<string, any>): {
    totalSystems: number;
    migratable: number;
    imanagedSystems: number;
    baseVisualSystems: number;
    unknownSystems: number;
    systemDetails: Array<{
      name: string;
      type: 'IManagedSystem' | 'BaseVisualSystem' | 'Unknown';
      migratable: boolean;
    }>;
  } {
    const report = {
      totalSystems: systems.size,
      migratable: 0,
      imanagedSystems: 0,
      baseVisualSystems: 0,
      unknownSystems: 0,
      systemDetails: [] as Array<{
        name: string;
        type: 'IManagedSystem' | 'BaseVisualSystem' | 'Unknown';
        migratable: boolean;
      }>
    };
    
    for (const [name, system] of systems) {
      let type: 'IManagedSystem' | 'BaseVisualSystem' | 'Unknown' = 'Unknown';
      let migratable = false;
      
      if (this.implementsIManagedSystem(system)) {
        type = 'IManagedSystem';
        migratable = true;
        report.imanagedSystems++;
      } else if (this.extendsBaseVisualSystem(system)) {
        type = 'BaseVisualSystem';
        migratable = true;
        report.baseVisualSystems++;
      } else {
        type = 'Unknown';
        report.unknownSystems++;
      }
      
      if (migratable) {
        report.migratable++;
      }
      
      report.systemDetails.push({
        name,
        type,
        migratable
      });
    }
    
    return report;
  }
}