import { Year3000System } from '@/core/lifecycle/year3000System';
import { UnifiedSystemRegistry } from '@/core/registry/UnifiedSystemRegistry';
import { UnifiedSystemBase } from '@/core/base/UnifiedSystemBase';
import { SystemMigrationHelper } from '@/core/migration/SystemMigrationHelper';
import { RightSidebarConsciousnessSystemUnified } from '@/visual/ui-effects/RightSidebarConsciousnessSystemUnified';
import { BeatSyncVisualSystemUnified } from '@/visual/beat-sync/BeatSyncVisualSystemUnified';
import type { HealthCheckResult } from '@/types/systems';

/**
 * Integration layer between Year3000System and UnifiedSystemBase architecture
 * 
 * This class handles the transition from the existing Year3000System architecture
 * to the new unified system architecture, providing:
 * - Gradual migration path for existing systems
 * - Registry integration with Year3000System
 * - Health monitoring and reporting
 * - Performance optimization coordination
 * 
 * @architecture Phase 1 system consolidation integration
 */
export class UnifiedSystemIntegration {
  private year3000System: Year3000System;
  private unifiedRegistry: UnifiedSystemRegistry;
  private migrationQueue: Map<string, any> = new Map();
  private initialized = false;
  
  constructor(year3000System: Year3000System) {
    this.year3000System = year3000System;
    this.unifiedRegistry = new UnifiedSystemRegistry({
      enableDebug: year3000System.YEAR3000_CONFIG.enableDebug,
      healthCheckInterval: 60000, // 1 minute
      maxInitializationTime: 5000 // 5 seconds
    });
    
    if (year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Created integration layer');
    }
  }
  
  /**
   * Initialize the integration layer and begin migration
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[UnifiedSystemIntegration] Already initialized');
      return;
    }
    
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Starting integration initialization');
    }
    
    // Step 1: Migrate existing systems to unified architecture
    await this.migrateExistingSystems();
    
    // Step 2: Initialize unified registry
    const results = await this.unifiedRegistry.initializeAll();
    
    // Step 3: Replace systems in Year3000System with unified versions
    await this.replaceSystemsInYear3000();
    
    // Step 4: Set up health monitoring integration
    this.setupHealthMonitoring();
    
    this.initialized = true;
    
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Integration complete:', {
        success: results.success.length,
        failed: results.failed.length,
        skipped: results.skipped.length
      });
    }
  }
  
  /**
   * Migrate existing systems to unified architecture
   */
  private async migrateExistingSystems(): Promise<void> {
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Starting system migration');
    }
    
    // Priority 1: Sidebar systems are now handled by SidebarSystemsIntegration
    if (this.year3000System.sidebarSystemsIntegration) {
      try {
        const unifiedSidebarSystem = new RightSidebarConsciousnessSystemUnified(
          this.year3000System.YEAR3000_CONFIG
        );
        
        this.unifiedRegistry.register(
          'RightSidebarConsciousnessSystem',
          unifiedSidebarSystem,
          [] // No dependencies for now
        );
        
        // Queue for replacement
        this.migrationQueue.set('sidebarSystemsIntegration', unifiedSidebarSystem);
        
        if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
          console.log('[UnifiedSystemIntegration] ✓ Migrated SidebarConsciousnessSystem');
        }
      } catch (error) {
        console.error('[UnifiedSystemIntegration] Failed to migrate SidebarConsciousnessSystem:', error);
      }
    }
    
    // Priority 2: Migrate BeatSyncVisualSystem to unified version
    if (this.year3000System.beatSyncVisualSystem) {
      try {
        const unifiedBeatSyncSystem = new BeatSyncVisualSystemUnified(
          this.year3000System.YEAR3000_CONFIG
        );
        
        this.unifiedRegistry.register(
          'BeatSyncVisualSystem',
          unifiedBeatSyncSystem,
          [] // No dependencies for now
        );
        
        // Queue for replacement
        this.migrationQueue.set('beatSyncVisualSystem', unifiedBeatSyncSystem);
        
        if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
          console.log('[UnifiedSystemIntegration] ✓ Migrated BeatSyncVisualSystem');
        }
      } catch (error) {
        console.error('[UnifiedSystemIntegration] Failed to migrate BeatSyncVisualSystem:', error);
      }
    }
    
    // Priority 3: Migrate other systems using migration helper
    const systemsToMigrate = [
      {
        name: 'LightweightParticleSystem',
        system: this.year3000System.lightweightParticleSystem,
        property: 'lightweightParticleSystem',
        dependencies: ['BeatSyncVisualSystem']
      },
      {
        name: 'InteractionTrackingSystem',
        system: this.year3000System.interactionTrackingSystem,
        property: 'interactionTrackingSystem',
        dependencies: ['RightSidebarConsciousnessSystem']
      }
    ];
    
    for (const { name, system, property, dependencies } of systemsToMigrate) {
      if (system) {
        try {
          this.unifiedRegistry.registerLegacySystem(name, system, dependencies);
          this.migrationQueue.set(property, this.unifiedRegistry.getSystem(name));
          
          if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
            console.log(`[UnifiedSystemIntegration] ✓ Migrated ${name}`);
          }
        } catch (error) {
          console.error(`[UnifiedSystemIntegration] Failed to migrate ${name}:`, error);
        }
      }
    }
  }
  
  /**
   * Replace systems in Year3000System with unified versions
   */
  private async replaceSystemsInYear3000(): Promise<void> {
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Replacing systems in Year3000System');
    }
    
    // Replace systems with unified versions
    for (const [property, unifiedSystem] of this.migrationQueue) {
      try {
        // Destroy old system if it exists
        const oldSystem = (this.year3000System as any)[property];
        if (oldSystem && typeof oldSystem.destroy === 'function') {
          await oldSystem.destroy();
        }
        
        // Replace with unified system
        (this.year3000System as any)[property] = unifiedSystem;
        
        if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
          console.log(`[UnifiedSystemIntegration] ✓ Replaced ${property}`);
        }
      } catch (error) {
        console.error(`[UnifiedSystemIntegration] Failed to replace ${property}:`, error);
      }
    }
    
    // Update animation system registrations
    if (this.year3000System.enhancedMasterAnimationCoordinator) {
      await this.updateAnimationRegistrations();
    }
  }
  
  /**
   * Update animation system registrations for unified systems
   */
  private async updateAnimationRegistrations(): Promise<void> {
    if (!this.year3000System.enhancedMasterAnimationCoordinator) return;
    
    const animationSystems = [
      {
        name: 'BeatSyncVisualSystem',
        system: this.year3000System.beatSyncVisualSystem,
        priority: 'critical' as const,
        targetFPS: 60
      },
      {
        name: 'RightSidebarConsciousnessSystem',
        system: this.year3000System.sidebarSystemsIntegration,
        priority: 'normal' as const,
        targetFPS: 60
      },
      {
        name: 'LightweightParticleSystem',
        system: this.year3000System.lightweightParticleSystem,
        priority: 'background' as const,
        targetFPS: 30
      }
    ];
    
    for (const { name, system, priority, targetFPS } of animationSystems) {
      if (system && typeof system.onAnimate === 'function') {
        try {
          // Unregister old system if exists
          try {
            this.year3000System.enhancedMasterAnimationCoordinator.unregisterAnimationSystem(name);
          } catch (e) {
            // System might not be registered yet, continue
          }
          
          // Register unified system (cast to any to bypass type check)
          this.year3000System.enhancedMasterAnimationCoordinator.registerAnimationSystem(
            name,
            system as any,
            priority,
            targetFPS
          );
          
          if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
            console.log(`[UnifiedSystemIntegration] ✓ Re-registered ${name} with animation conductor`);
          }
        } catch (error) {
          console.error(`[UnifiedSystemIntegration] Failed to re-register ${name}:`, error);
        }
      }
    }
  }
  
  /**
   * Set up health monitoring integration
   */
  private setupHealthMonitoring(): void {
    if (!this.year3000System.systemHealthMonitor) {
      return;
    }
    
    // Create a unified health check that integrates with Year3000System
    const unifiedHealthCheck = async (): Promise<HealthCheckResult> => {
      const healthResult = await this.unifiedRegistry.performHealthCheck();
      
      const result: HealthCheckResult = {
        ok: healthResult.unhealthy.length === 0,
        details: `Unified systems: ${healthResult.healthy.length} healthy, ${healthResult.unhealthy.length} unhealthy`
      };
      
      if (healthResult.unhealthy.length > 0) {
        result.issues = healthResult.unhealthy;
      }
      
      return result;
    };
    
    // Register unified health check with Year3000System
    const healthCheckObject = {
      healthCheck: unifiedHealthCheck,
      initialized: true,
      systemName: 'UnifiedSystemRegistry',
      initialize: async () => { /* Already initialized */ },
      updateAnimation: () => { /* No animation needed */ },
      destroy: () => { /* Handled by integration */ }
    };
    
    try {
      this.year3000System.systemHealthMonitor.registerSystem(
        'UnifiedSystemRegistry',
        healthCheckObject
      );
      
      if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
        console.log('[UnifiedSystemIntegration] ✓ Health monitoring integration set up');
      }
    } catch (error) {
      console.error('[UnifiedSystemIntegration] Failed to set up health monitoring:', error);
    }
  }
  
  /**
   * Get the unified system registry
   */
  getRegistry(): UnifiedSystemRegistry {
    return this.unifiedRegistry;
  }
  
  /**
   * Get system by name from unified registry
   */
  getSystem<T extends UnifiedSystemBase = UnifiedSystemBase>(name: string): T | undefined {
    return this.unifiedRegistry.getSystem(name) as T;
  }
  
  /**
   * Get health status of all unified systems
   */
  async getHealthStatus(): Promise<{
    healthy: string[];
    unhealthy: string[];
    results: Map<string, HealthCheckResult>;
  }> {
    return await this.unifiedRegistry.performHealthCheck();
  }
  
  /**
   * Destroy the integration layer
   */
  async destroy(): Promise<void> {
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Destroying integration layer');
    }
    
    // Destroy unified registry
    this.unifiedRegistry.destroyAll();
    
    // Clear migration queue
    this.migrationQueue.clear();
    
    this.initialized = false;
    
    if (this.year3000System.YEAR3000_CONFIG.enableDebug) {
      console.log('[UnifiedSystemIntegration] Integration layer destroyed');
    }
  }
}