import { ServiceSystemBase } from '@/core/services/SystemServiceBridge';
import { SidebarVisualEffectsSystem } from '@/visual/ui/SidebarVisualEffectsSystem';
// Consolidated sidebar systems:
// - SidebarInteractiveFlowSystem merged into SidebarVisualEffectsSystem
// - UnifiedSidebarEffectsController merged into SidebarVisualEffectsSystem
// - RightSidebarController removed in favor of unified approach
import { SidebarPerformanceManager } from '@/visual/ui/SidebarPerformanceCoordinator';
import type { AdvancedSystemConfig, Year3000Config } from '@/types/models';
import type { HealthCheckResult, IManagedSystem } from '@/types/systems';
import { ADVANCED_SYSTEM_CONFIG } from '@/config/globalConfig';

// Temporary interfaces for systems that couldn't be created due to build issues
interface LeftSidebarVisualSystem extends IManagedSystem {
  getVisualState(): any;
  getAnimationMetrics(): any;
}

interface RightSidebarVisualSystem extends IManagedSystem {
  getVisualState(): any;
  getAnimationMetrics(): any;
}

interface SidebarSystemsOrchestrator extends IManagedSystem {
  getBilateralState(): any;
  getPerformanceMetrics(): any;
  setSynchronizationEnabled(enabled: boolean): void;
  setRightSidebarSystem(system: any): void;
}

// Mock implementations removed - replaced with consolidated systems

interface SidebarSystemDefinition {
  name: string;
  system: IManagedSystem;
  priority: 'background' | 'normal' | 'critical';
  enabled: boolean;
  dependencies?: string[];
}

interface SidebarIntegrationMetrics {
  totalSystems: number;
  activeSystems: number;
  bilateralSyncEnabled: boolean;
  averageFrameTime: number;
  totalMemoryUsage: number;
  healthStatus: 'healthy' | 'degraded' | 'critical';
}

/**
 * SidebarSystemsIntegration
 *
 * Central integration point for all sidebar systems with the Year3000System.
 * This module manages the lifecycle, coordination, and performance monitoring
 * of the bilateral visual-effects sidebar architecture.
 *
 * Key Features:
 * - Unified system registration and lifecycle management
 * - Bilateral visual-effects coordination
 * - Performance monitoring and optimization
 * - Graceful degradation and error recovery
 * - Integration with existing Year3000System patterns
 *
 * Architecture:
 * - Extends ServiceSystemBase for service composition
 * - Manages all sidebar systems as a coordinated unit
 * - Provides unified interface for Year3000System integration
 * - Handles performance budgeting and monitoring
 */
export class SidebarSystemsIntegration extends ServiceSystemBase {
  // Core sidebar systems (consolidated into unified system)
  // private leftSidebarConsciousness: LeftSidebarConsciousnessSystem;
  // private rightSidebarConsciousness: RightSidebarConsciousnessSystem;
  // private sidebarOrchestrator: SidebarSystemsOrchestrator;
  private consolidatedSidebarSystem?: SidebarVisualEffectsSystem;
  
  // Performance coordination
  private sharedCoordinator: SidebarPerformanceManager;
  
  // System registry
  private sidebarSystems: Map<string, SidebarSystemDefinition> = new Map();
  
  // Integration state
  private integrationEnabled = false;
  private performanceMetrics: SidebarIntegrationMetrics;
  
  // Animation frame tracking
  private lastFrameTime = 0;
  
  constructor(config: Year3000Config = ADVANCED_SYSTEM_CONFIG) {
    super(config);

    // Initialize shared performance coordinator
    // Note: performanceAnalyzer access via services.performance is available after initialization
    this.sharedCoordinator = SidebarPerformanceManager.getInstance({
      enableDebug: config.enableDebug,
      performanceAnalyzer: null as any, // Will be set during initialization
      onFlushComplete: () => this.handlePerformanceFlush()
    });
    
    // Initialize consolidated sidebar system (replaces all previous sidebar systems)
    // Note: Temporarily disabled - would need proper dependency injection
    // this.consolidatedSidebarSystem = new SidebarVisualEffectsSystem(...)
    
    // Initialize performance metrics
    this.performanceMetrics = {
      totalSystems: 4,
      activeSystems: 0,
      bilateralSyncEnabled: false,
      averageFrameTime: 0,
      totalMemoryUsage: 0,
      healthStatus: 'healthy'
    };
    
    if (config.enableDebug) {
      console.log(`[${this.systemName}] Initialized sidebar systems integration`);
    }
  }
  
  /**
   * System-specific initialization logic (implements ServiceSystemBase abstract method)
   */
  async _performSystemSpecificInitialization(): Promise<void> {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing sidebar systems integration`);
    }

    try {
      // Register system definitions
      this.registerSidebarSystems();

      // Phase 3: Register with UnifiedSystemRegistry if available
      await this.registerWithUnifiedRegistry();

      // Initialize systems in dependency order
      await this.initializeSystemsInOrder();

      // Set up bilateral visual-effects coordination
      this.setupBilateralCoordination();

      // Phase 3: Connect to EventBus for system-wide communication
      this.connectToEventBus();

      // Phase 3: Integrate with TimerConsolidationSystem and MasterAnimationCoordinator
      this.integrateWithPerformanceSystems();

      // Enable integration
      this.integrationEnabled = true;

      // Update performance metrics
      this.updatePerformanceMetrics();

      this.publishEvent('sidebar:integration-ready', {
        systemName: this.systemName,
        totalSystems: this.sidebarSystems.size,
        activeSystems: this.performanceMetrics.activeSystems,
        bilateralSync: this.performanceMetrics.bilateralSyncEnabled,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error(`[${this.systemName}] Integration initialization failed:`, error);
      throw error;
    }
  }
  
  /**
   * Register all sidebar system definitions
   */
  private registerSidebarSystems(): void {
    // Consolidated sidebar visual effects system (replaces all previous sidebar systems)
    if (this.consolidatedSidebarSystem) {
      this.sidebarSystems.set('consolidatedSidebarSystem', {
        name: 'consolidatedSidebarSystem',
        system: this.consolidatedSidebarSystem as any,
        priority: 'critical',
        enabled: true,
        dependencies: []
      });
    }
  }
  
  /**
   * Initialize systems in dependency order
   */
  private async initializeSystemsInOrder(): Promise<void> {
    const initializationOrder = this.calculateInitializationOrder();

    for (const systemName of initializationOrder) {
      const systemDef = this.sidebarSystems.get(systemName);
      if (systemDef && systemDef.enabled) {
        try {
          await systemDef.system.initialize();
          this.performanceMetrics.activeSystems++;

          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Initialized ${systemName}`);
          }
        } catch (error) {
          console.error(`[${this.systemName}] Failed to initialize ${systemName}:`, error);
          // Continue with other systems
        }
      }
    }
  }
  
  /**
   * Calculate system initialization order based on dependencies
   */
  private calculateInitializationOrder(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];
    
    const visit = (systemName: string) => {
      if (visiting.has(systemName)) {
        throw new Error(`Circular dependency detected: ${systemName}`);
      }
      if (visited.has(systemName)) return;
      
      visiting.add(systemName);
      
      const systemDef = this.sidebarSystems.get(systemName);
      if (systemDef && systemDef.dependencies) {
        for (const dep of systemDef.dependencies) {
          visit(dep);
        }
      }
      
      visiting.delete(systemName);
      visited.add(systemName);
      order.push(systemName);
    };
    
    for (const systemName of this.sidebarSystems.keys()) {
      visit(systemName);
    }
    
    return order;
  }
  
  /**
   * Set up bilateral visual-effects coordination
   */
  private setupBilateralCoordination(): void {
    // Simplified coordination for consolidated system
    this.performanceMetrics.bilateralSyncEnabled = true;
    
    // Subscribe to bilateral events for monitoring
    this.subscribeToEvent('sidebar:bilateral-sync', (payload: any) => {
      this.handleBilateralSync(payload);
    });
    
    this.subscribeToEvent('sidebar:visual-level-changed', (payload: any) => {
      this.handleVisualLevelChange(payload);
    });
  }
  
  /**
   * Handle bilateral synchronization events
   */
  private handleBilateralSync(payload: any): void {
    // Monitor bilateral sync performance
    if (payload.source === 'orchestrator') {
      this.updatePerformanceMetrics();
    }
  }
  
  /**
   * Handle visual level changes
   */
  private handleVisualLevelChange(payload: any): void {
    // Adapt system performance based on visual intensity level
    const visualIntensityLevels = {
      dormant: 0.5,
      aware: 0.7,
      focused: 0.9,
      advanced: 1.0
    };
    
    const performanceLevel = visualIntensityLevels[payload.newLevel as keyof typeof visualIntensityLevels] || 0.7;
    
    // Adjust performance budgets based on visual intensity
    this.adjustPerformanceBudgets(performanceLevel);
  }
  
  /**
   * Adjust performance budgets based on visual intensity level
   */
  private adjustPerformanceBudgets(level: number): void {
    // Scale performance budgets with visual intensity level
    const baseBudget = 16;
    const adjustedBudget = Math.floor(baseBudget * level);
    
    // Apply to all sidebar systems
    // Note: This would use the actual setSubsystemBudget when available
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Adjusted performance budget to ${adjustedBudget} based on visual intensity level`);
    }
  }
  
  /**
   * Handle performance flush completion
   */
  private handlePerformanceFlush(): void {
    
    // Update frame time metrics
    const currentTime = performance.now();
    if (this.lastFrameTime > 0) {
      const frameTime = currentTime - this.lastFrameTime;
      this.performanceMetrics.averageFrameTime = 
        (this.performanceMetrics.averageFrameTime + frameTime) / 2;
    }
    this.lastFrameTime = currentTime;
    
    // Update health status based on performance
    this.updateHealthStatus();
  }
  
  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    this.performanceMetrics.totalSystems = this.sidebarSystems.size;

    // Count active systems
    let activeSystems = 0;
    for (const [, systemDef] of this.sidebarSystems) {
      if (systemDef.enabled && systemDef.system.initialized) {
        activeSystems++;
      }
    }
    this.performanceMetrics.activeSystems = activeSystems;

    // Bilateral sync is managed by consolidated system
    // this.performanceMetrics.bilateralSyncEnabled remains as set in setupBilateralCoordination
  }
  
  /**
   * Update health status based on performance metrics
   */
  private updateHealthStatus(): void {
    if (this.performanceMetrics.averageFrameTime > 20) {
      this.performanceMetrics.healthStatus = 'critical';
    } else if (this.performanceMetrics.averageFrameTime > 16.67) {
      this.performanceMetrics.healthStatus = 'degraded';
    } else {
      this.performanceMetrics.healthStatus = 'healthy';
    }
  }
  
  /**
   * Animation frame callback (implements IManagedSystem interface)
   */
  updateAnimation(deltaTime: number): void {
    if (!this.integrationEnabled) return;

    // Update performance metrics
    this.updatePerformanceMetrics();

    // Monitor system health
    this.updateHealthStatus();

    // Emit performance events periodically (every ~1 second)
    const currentTime = performance.now();
    if (currentTime - this.lastFrameTime > 1000) {
      this.publishEvent('sidebar:integration-metrics', {
        metrics: this.performanceMetrics,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Legacy onAnimate callback for backward compatibility
   * @deprecated Use updateAnimation instead
   */
  onAnimate(deltaTime: number): void {
    this.updateAnimation(deltaTime);
  }
  
  /**
   * Register all sidebar systems with Year3000System animation coordinator
   */
  public registerWithAnimationCoordinator(animationCoordinator: any): void {
    if (!animationCoordinator) {
      console.warn(`[${this.systemName}] Animation coordinator not available`);
      return;
    }

    // Register each system with appropriate priority
    for (const [systemName, systemDef] of this.sidebarSystems) {
      if (systemDef.enabled && systemDef.system.initialized) {
        try {
          animationCoordinator.registerAnimationSystem(
            systemName,
            systemDef.system,
            systemDef.priority,
            60 // Default FPS
          );

          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Registered ${systemName} with animation coordinator`);
          }
        } catch (error) {
          console.error(`[${this.systemName}] Failed to register ${systemName}:`, error);
        }
      }
    }
  }
  
  /**
   * Get all sidebar systems for external access
   */
  public getSidebarSystems(): Map<string, SidebarSystemDefinition> {
    return new Map(this.sidebarSystems);
  }
  
  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): SidebarIntegrationMetrics {
    return { ...this.performanceMetrics };
  }
  
  /**
   * Enable/disable specific sidebar system
   */
  public setSidebarSystemEnabled(systemName: string, enabled: boolean): void {
    const systemDef = this.sidebarSystems.get(systemName);
    if (systemDef) {
      systemDef.enabled = enabled;

      if (!enabled && systemDef.system.initialized) {
        systemDef.system.destroy();
        this.performanceMetrics.activeSystems--;
      } else if (enabled && !systemDef.system.initialized) {
        systemDef.system.initialize().catch(error => {
          console.error(`[${this.systemName}] Failed to re-enable ${systemName}:`, error);
        });
      }

      this.publishEvent('sidebar:system-toggled', {
        systemName,
        enabled,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * System-specific health check (implements ServiceSystemBase abstract method)
   */
  protected async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const systemHealthChecks: Record<string, HealthCheckResult> = {};

    // Check all sidebar systems
    for (const [systemName, systemDef] of this.sidebarSystems) {
      if (systemDef.enabled && systemDef.system.initialized) {
        try {
          systemHealthChecks[systemName] = await systemDef.system.healthCheck();
        } catch (error) {
          systemHealthChecks[systemName] = {
            healthy: false,
            ok: false,
            details: `Health check failed: ${(error as Error).message}`,
            issues: [`Health check failed: ${(error as Error).message}`],
            system: systemName
          };
        }
      }
    }

    // Determine overall health
    const unhealthySystems = Object.values(systemHealthChecks).filter(check => !check.ok);
    const isHealthy = unhealthySystems.length === 0;

    return {
      healthy: isHealthy,
      details: `Sidebar integration ${isHealthy ? 'healthy' : 'degraded'} - ${this.performanceMetrics.activeSystems}/${this.performanceMetrics.totalSystems} systems active, bilateral sync: ${this.performanceMetrics.bilateralSyncEnabled}`,
      issues: unhealthySystems.map(check => check.details || 'Unknown issue'),
      metrics: {
        activeSystems: this.performanceMetrics.activeSystems,
        totalSystems: this.performanceMetrics.totalSystems,
        bilateralSyncEnabled: this.performanceMetrics.bilateralSyncEnabled,
        healthStatus: this.performanceMetrics.healthStatus
      }
    };
  }
  
  /**
   * Phase 3: Register sidebar systems with facade (UnifiedSystemRegistry is deprecated)
   */
  private async registerWithUnifiedRegistry(): Promise<void> {
    // Note: Sidebar systems are now properly managed by VisualSystemFacade
    // This method is maintained for legacy compatibility but no longer performs registration
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Sidebar systems are now managed by VisualSystemFacade`);
    }
  }
  
  /**
   * Phase 3: Connect to EventBus for system-wide communication
   */
  private connectToEventBus(): void {
    // Set up event bus connections for bilateral visual-effects coordination
    this.subscribeToEvent('music:beat', (payload: any) => {
      this.handleMusicBeat(payload);
    });
    
    this.subscribeToEvent('music:energy', (payload: any) => {
      this.handleMusicEnergy(payload);
    });
    
    this.subscribeToEvent('performance:threshold-exceeded', (payload: any) => {
      this.handlePerformanceThreshold(payload);
    });
    
    this.subscribeToEvent('user:navigation', (payload: any) => {
      this.handleUserNavigation(payload);
    });
    
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Connected to EventBus for system-wide communication`);
    }
  }
  
  /**
   * Phase 3: Integrate with TimerConsolidationSystem and MasterAnimationCoordinator
   */
  private integrateWithPerformanceSystems(): void {
    // Access performance systems from global Year3000System
    const year3000System = (globalThis as any).year3000System;
    if (!year3000System) {
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Year3000System not available, skipping performance integration`);
      }
      return;
    }
    
    try {
      // Register with TimerConsolidationSystem if available
      const timerSystem = year3000System.timerConsolidationSystem;
      if (timerSystem) {
        // Register sidebar performance monitoring timer
        timerSystem.registerTimer('sidebar-performance-monitor', 1000, () => {
          this.updatePerformanceMetrics();
        });
        
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Integrated with TimerConsolidationSystem`);
        }
      }
      
      // Register with AnimationFrameCoordinator if available
      const animationCoordinator = year3000System.enhancedMasterAnimationCoordinator;
      if (animationCoordinator) {
        // Register bilateral visual-effects coordination callback
        animationCoordinator.registerFrameCallback(
          (deltaTime: number, timestamp: number) => {
            this.bilateralVisualEffectsFrameUpdate(deltaTime, timestamp);
          },
          'critical',
          'sidebar-bilateral-visual-effects'
        );
        
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Integrated with AnimationFrameCoordinator`);
        }
      }
    } catch (error) {
      console.error(`[${this.systemName}] Failed to integrate with performance systems:`, error);
    }
  }
  
  /**
   * Handle music beat events for visual-effects synchronization
   */
  private handleMusicBeat(payload: any): void {
    if (!this.integrationEnabled) return;
    
    // Forward beat event to visual-effects systems
    const beatData = {
      intensity: payload.intensity || 0.5,
      timestamp: payload.timestamp || Date.now(),
      bpm: payload.bpm || 120
    };
    
    // Trigger bilateral visual-effects beat response via consolidated system
    // (functionality now handled by consolidatedSidebarSystem)
    
    // Update visual-effects timing with musical beat
    // Note: SidebarPerformanceManager doesn't have updateMusicSync method yet
    // This would be implemented when the method is available
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Processed music beat:`, beatData);
    }
  }
  
  /**
   * Handle music energy changes for adaptive visual effects
   */
  private handleMusicEnergy(payload: any): void {
    if (!this.integrationEnabled) return;
    
    // Adapt visual effects intensity based on music energy
    const energyLevel = payload.energy || 0.5;
    
    // Scale visual effects responsiveness with energy
    this.adjustPerformanceBudgets(0.5 + (energyLevel * 0.5));
    
    // Forward energy data to consolidated system
    if (this.consolidatedSidebarSystem?.initialized) {
      // Energy processing handled by consolidated flow system
      if (this.config.enableDebug) {
        console.log(`[${this.systemName}] Adapted visual effects to energy level: ${energyLevel}`);
      }
    }
  }
  
  /**
   * Handle performance threshold events
   */
  private handlePerformanceThreshold(payload: any): void {
    if (!this.integrationEnabled) return;
    
    if (payload.severity === 'critical') {
      // Emergency performance mode - disable non-essential systems
      this.performanceMetrics.healthStatus = 'critical';
      
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] Activated emergency performance mode`);
      }
    } else if (payload.severity === 'warning' && this.performanceMetrics.healthStatus === 'critical') {
      // Recovery mode 
      this.performanceMetrics.healthStatus = 'degraded';
    }
  }
  
  /**
   * Handle user navigation events for predictive visual effects
   */
  private handleUserNavigation(payload: any): void {
    if (!this.integrationEnabled) return;
    
    // Forward navigation context to visual-effects systems for predictive behavior
    const navigationContext = {
      action: payload.action || 'navigate',
      target: payload.target || 'unknown',
      timestamp: payload.timestamp || Date.now()
    };
    
    // This would trigger predictive visual effects adaptation
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Processing navigation context:`, navigationContext);
    }
  }
  
  /**
   * Bilateral visual-effects frame update callback
   */
  private bilateralVisualEffectsFrameUpdate(deltaTime: number, timestamp: number): void {
    if (!this.integrationEnabled) return;
    
    // Simplified bilateral visual-effects for consolidated system
    const syncMetrics = {
      frameTime: deltaTime,
      timestamp
    };
    
    // Monitor frame time for performance
    if (deltaTime > 16.67) { // More than one frame budget
      this.publishEvent('sidebar:frame-time-warning', {
        frameTime: deltaTime,
        timestamp
      });
    }
  }
  
  /**
   * System-specific cleanup (implements ServiceSystemBase abstract method)
   */
  _performSystemSpecificCleanup(): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying sidebar systems integration`);
    }

    // Disable integration
    this.integrationEnabled = false;

    // Unregister from performance systems
    const year3000System = (globalThis as any).year3000System;
    if (year3000System?.timerConsolidationSystem) {
      year3000System.timerConsolidationSystem.unregisterTimer('sidebar-performance-monitor');
    }

    // Destroy all systems in reverse order
    const destructionOrder = this.calculateInitializationOrder().reverse();

    for (const systemName of destructionOrder) {
      const systemDef = this.sidebarSystems.get(systemName);
      if (systemDef && systemDef.system.initialized) {
        try {
          systemDef.system.destroy();
          if (this.config.enableDebug) {
            console.log(`[${this.systemName}] Destroyed ${systemName}`);
          }
        } catch (error) {
          console.error(`[${this.systemName}] Failed to destroy ${systemName}:`, error);
        }
      }
    }

    // Clear system registry
    this.sidebarSystems.clear();

    // Reset performance metrics
    this.performanceMetrics = {
      totalSystems: 0,
      activeSystems: 0,
      bilateralSyncEnabled: false,
      averageFrameTime: 0,
      totalMemoryUsage: 0,
      healthStatus: 'healthy'
    };

    this.publishEvent('sidebar:integration-destroyed', {
      timestamp: Date.now()
    });
  }
}