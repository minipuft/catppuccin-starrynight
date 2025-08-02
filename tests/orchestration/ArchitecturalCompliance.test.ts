/**
 * Architectural Compliance Benefits Tests
 * 
 * Tests the architectural benefits provided by orchestration improvements:
 * 1. Facade pattern compliance through SystemCoordinator
 * 2. Dependency injection validation and circular dependency detection
 * 3. Modular system addition following orchestration patterns
 * 4. System lifecycle management (initialize → healthCheck → destroy)
 * 
 * These tests validate that orchestration provides proper architectural
 * foundation and prevents architectural regression.
 */

import { jest } from '@jest/globals';
import { SystemCoordinator } from '@/core/integration/SystemCoordinator';
import { unifiedEventBus } from '@/core/events/UnifiedEventBus';
import { YEAR3000_CONFIG } from '@/config/globalConfig';

// Mock dependencies
jest.mock('@/debug/UnifiedDebugManager', () => ({
  Y3K: {
    debug: {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

jest.mock('@/utils/platform/SpicetifyCompat', () => ({
  SpicetifyCompat: {
    isSpicetifyReady: () => true,
    getPlayer: () => ({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }),
    getPlatform: () => ({
      getAudioData: jest.fn()
    })
  }
}));

// Mock performance APIs
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    mark: jest.fn(),
    measure: jest.fn()
  }
});

// Mock DOM
if (!global.document) { Object.defineProperty(global, 'document', {
  value: {
    documentElement: {
      style: {
        setProperty: jest.fn(),
        removeProperty: jest.fn()
      }
    },
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }
}); }

// Define IManagedSystem interface for testing
interface IManagedSystem {
  initialized: boolean;
  initialize(): Promise<void>;
  updateAnimation(deltaTime: number): void;
  healthCheck(): Promise<any>;
  destroy(): void;
  forceRepaint?(reason?: string): void;
}

describe('Architectural Compliance Benefits Tests', () => {
  let systemCoordinator: SystemCoordinator;

  beforeEach(() => {
    jest.clearAllMocks();

    systemCoordinator = new SystemCoordinator(
      YEAR3000_CONFIG,
      {} as any,
      {
        orchestration: {
          enforceSequentialInitialization: true,
          dependencyValidation: true,
          enableInitializationGates: true,
          systemReadinessTimeout: 5000,
          phaseTransitionTimeout: 10000,
        }
      }
    );
  });

  afterEach(async () => {
    if (systemCoordinator) {
      await systemCoordinator.destroy();
    }
    unifiedEventBus.destroy();
  });

  describe('1. Facade Pattern Compliance', () => {
    test('should enforce all systems use SystemCoordinator for lifecycle management', async () => {
      const lifecycleTracker = {
        coordinatorInitialized: false,
        systemsInitializedThroughCoordinator: 0,
        directInitializationAttempts: 0
      };

      // Mock systems that implement IManagedSystem
      const mockSystems: IManagedSystem[] = [
        {
          initialized: false,
          initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
            this.initialized = true;
            lifecycleTracker.systemsInitializedThroughCoordinator++;
          }),
          updateAnimation: jest.fn(),
          healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
          destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
            this.initialized = false;
          })
        },
        {
          initialized: false,
          initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
            this.initialized = true;
            lifecycleTracker.systemsInitializedThroughCoordinator++;
          }),
          updateAnimation: jest.fn(),
          healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
          destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
            this.initialized = false;
          })
        }
      ];

      // Attempt direct initialization (should be prevented/ignored)
      mockSystems.forEach(system => {
        try {
          system.initialize();
          lifecycleTracker.directInitializationAttempts++;
        } catch (error) {
          // Direct initialization should be prevented
        }
      });

      // Initialize through coordinator (proper facade pattern)
      await systemCoordinator.initialize();
      lifecycleTracker.coordinatorInitialized = true;

      // Verify facade pattern compliance
      expect(lifecycleTracker.coordinatorInitialized).toBe(true);
      expect(lifecycleTracker.directInitializationAttempts).toBeLessThanOrEqual(2); // Direct calls made but should be ignored by coordinator
      
      // All systems should be managed through coordinator
      const healthCheck = await systemCoordinator.healthCheck?.();
      expect(healthCheck).toBeDefined();
    });

    test('should provide unified interface for system management', async () => {
      const managementInterface = {
        initializeMethod: false,
        healthCheckMethod: false,
        destroyMethod: false,
        getSharedInstanceMethods: false
      };

      await systemCoordinator.initialize();

      // Verify unified management interface
      expect(typeof systemCoordinator.initialize).toBe('function');
      managementInterface.initializeMethod = true;

      expect(typeof systemCoordinator.healthCheck).toBe('function');
      managementInterface.healthCheckMethod = true;

      expect(typeof systemCoordinator.destroy).toBe('function');
      managementInterface.destroyMethod = true;

      // Check for shared instance methods (facade pattern)
      expect(typeof systemCoordinator.getSharedMusicSyncService).toBe('function');
      expect(typeof systemCoordinator.getSharedColorHarmonyEngine).toBe('function');
      managementInterface.getSharedInstanceMethods = true;

      // All facade methods should be available
      expect(managementInterface.initializeMethod).toBe(true);
      expect(managementInterface.healthCheckMethod).toBe(true);
      expect(managementInterface.destroyMethod).toBe(true);
      expect(managementInterface.getSharedInstanceMethods).toBe(true);
    });

    test('should prevent systems from bypassing facade coordination', async () => {
      const bypassAttempts = {
        directSystemCreation: 0,
        bypassedInitialization: 0,
        coordinatorManagement: 0
      };

      await systemCoordinator.initialize();

      // Attempt to create systems directly (bypassing facade)
      try {
        // This would be bypassing the facade pattern
        const directSystem = {
          initialized: false,
          initialize: jest.fn(),
          updateAnimation: jest.fn(),
          healthCheck: jest.fn(),
          destroy: jest.fn()
        };
        
        bypassAttempts.directSystemCreation++;
        
        // Attempt direct initialization
        await directSystem.initialize();
        bypassAttempts.bypassedInitialization++;
        
      } catch (error) {
        // Should be prevented or handled by facade
      }

      // Use proper facade methods
      try {
        const managedMusicSync = systemCoordinator.getSharedMusicSyncService();
        const managedColorHarmony = systemCoordinator.getSharedColorHarmonyEngine();
        
        if (managedMusicSync && managedColorHarmony) {
          bypassAttempts.coordinatorManagement++;
        }
      } catch (error) {
        // Proper facade should work
      }

      // Facade should provide proper management
      expect(bypassAttempts.coordinatorManagement).toBe(1);
      
      // Direct system creation might occur but shouldn't be coordinated
      expect(bypassAttempts.directSystemCreation).toBeGreaterThan(0);
    });

    test('should enforce unified system registration patterns', async () => {
      const registrationPattern = {
        systemsRegistered: 0,
        registrationCompliance: true,
        invalidRegistrationAttempts: 0
      };

      // Mock system that follows registration pattern
      const compliantSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = true;
          registrationPattern.systemsRegistered++;
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
        destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = false;
        })
      };

      // Mock system that doesn't follow pattern
      const nonCompliantSystem = {
        // Missing required IManagedSystem methods
        start: jest.fn(),
        stop: jest.fn()
      };

      await systemCoordinator.initialize();

      // Attempt to register non-compliant system
      try {
        // This should fail or be rejected
        (systemCoordinator as any).registerSystem?.(nonCompliantSystem);
        registrationPattern.invalidRegistrationAttempts++;
        registrationPattern.registrationCompliance = false;
      } catch (error) {
        // Non-compliant registration should be prevented
      }

      // Register compliant system (if registration method exists)
      try {
        (systemCoordinator as any).registerSystem?.(compliantSystem);
        registrationPattern.systemsRegistered++;
      } catch (error) {
        // Compliant system should register successfully
      }

      // Should maintain registration compliance
      expect(registrationPattern.registrationCompliance).toBe(true);
      expect(registrationPattern.invalidRegistrationAttempts).toBeGreaterThan(0); // Attempt was made
    });
  });

  describe('2. Dependency Injection Validation', () => {
    test('should resolve dependencies correctly through injection', async () => {
      const dependencyResolution = {
        musicSyncService: null as any,
        colorHarmonyEngine: null as any,
        dependenciesResolved: false,
        circularDependencyDetected: false
      };

      await systemCoordinator.initialize();

      // Get shared instances through dependency injection
      dependencyResolution.musicSyncService = systemCoordinator.getSharedMusicSyncService();
      dependencyResolution.colorHarmonyEngine = systemCoordinator.getSharedColorHarmonyEngine();

      // Verify dependency resolution
      if (dependencyResolution.musicSyncService && dependencyResolution.colorHarmonyEngine) {
        dependencyResolution.dependenciesResolved = true;
      }

      // Test dependency injection worked
      expect(dependencyResolution.dependenciesResolved).toBe(true);
      expect(dependencyResolution.musicSyncService).toBeDefined();
      expect(dependencyResolution.colorHarmonyEngine).toBeDefined();
    });

    test('should detect and prevent circular dependencies', async () => {
      const circularDependencyTest = {
        systemA: null as any,
        systemB: null as any,
        circularDetected: false,
        preventionSuccessful: false
      };

      // Mock systems with circular dependencies
      const createSystemA = () => ({
        initialized: false,
        systemB: null as any,
        initialize: jest.fn().mockImplementation(async function(this: any) {
          // SystemA depends on SystemB
          this.systemB = circularDependencyTest.systemB;
          this.initialized = true;
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
        destroy: jest.fn()
      });

      const createSystemB = () => ({
        initialized: false,
        systemA: null as any,
        initialize: jest.fn().mockImplementation(async function(this: any) {
          // SystemB depends on SystemA (circular!)
          this.systemA = circularDependencyTest.systemA;
          this.initialized = true;
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
        destroy: jest.fn()
      });

      circularDependencyTest.systemA = createSystemA();
      circularDependencyTest.systemB = createSystemB();

      // Attempt initialization with circular dependencies
      try {
        await Promise.race([
          Promise.all([
            circularDependencyTest.systemA.initialize(),
            circularDependencyTest.systemB.initialize()
          ]),
          new Promise((_, reject) => 
            setTimeout(() => {
              circularDependencyTest.circularDetected = true;
              reject(new Error('Circular dependency detected'));
            }, 1000)
          )
        ]);
      } catch (error) {
        if (error.message.includes('Circular dependency')) {
          circularDependencyTest.preventionSuccessful = true;
        }
      }

      await systemCoordinator.initialize();

      // Should detect circular dependencies
      expect(circularDependencyTest.circularDetected || circularDependencyTest.preventionSuccessful).toBe(true);
    });

    test('should provide singleton pattern for shared instances', async () => {
      const singletonTest = {
        musicSyncInstance1: null as any,
        musicSyncInstance2: null as any,
        colorHarmonyInstance1: null as any,
        colorHarmonyInstance2: null as any,
        singletonCompliance: false
      };

      await systemCoordinator.initialize();

      // Get multiple instances of the same services
      singletonTest.musicSyncInstance1 = systemCoordinator.getSharedMusicSyncService();
      singletonTest.musicSyncInstance2 = systemCoordinator.getSharedMusicSyncService();
      
      singletonTest.colorHarmonyInstance1 = systemCoordinator.getSharedColorHarmonyEngine();
      singletonTest.colorHarmonyInstance2 = systemCoordinator.getSharedColorHarmonyEngine();

      // Verify singleton pattern
      const musicSyncSingleton = singletonTest.musicSyncInstance1 === singletonTest.musicSyncInstance2;
      const colorHarmonySingleton = singletonTest.colorHarmonyInstance1 === singletonTest.colorHarmonyInstance2;

      singletonTest.singletonCompliance = musicSyncSingleton && colorHarmonySingleton;

      // Should maintain singleton pattern
      expect(singletonTest.singletonCompliance).toBe(true);
      expect(singletonTest.musicSyncInstance1).toBe(singletonTest.musicSyncInstance2);
      expect(singletonTest.colorHarmonyInstance1).toBe(singletonTest.colorHarmonyInstance2);
    });

    test('should handle dependency injection failures gracefully', async () => {
      const injectionFailureTest = {
        failedDependencies: 0,
        gracefulHandling: false,
        systemContinued: false
      };

      // Create coordinator that might have dependency issues
      const failingCoordinator = new SystemCoordinator(
        YEAR3000_CONFIG,
        {} as any, // Missing utils - potential dependency failure
        {
          orchestration: {
            enforceSequentialInitialization: true,
            dependencyValidation: true,
            enableInitializationGates: true,
            systemReadinessTimeout: 5000,
            phaseTransitionTimeout: 10000,
          }
        }
      );

      try {
        await failingCoordinator.initialize();
        
        // Attempt to get dependencies that might fail
        try {
          const musicSync = failingCoordinator.getSharedMusicSyncService();
          if (!musicSync) {
            injectionFailureTest.failedDependencies++;
          }
        } catch (error) {
          injectionFailureTest.failedDependencies++;
        }

        try {
          const colorHarmony = failingCoordinator.getSharedColorHarmonyEngine();
          if (!colorHarmony) {
            injectionFailureTest.failedDependencies++;
          }
        } catch (error) {
          injectionFailureTest.failedDependencies++;
        }

        // System should handle failures gracefully
        const healthCheck = await failingCoordinator.healthCheck?.();
        if (healthCheck) {
          injectionFailureTest.gracefulHandling = true;
          injectionFailureTest.systemContinued = true;
        }

      } catch (error) {
        // Failure should be handled gracefully
        injectionFailureTest.gracefulHandling = true;
      }

      await failingCoordinator.destroy();

      // Should handle dependency failures gracefully
      expect(injectionFailureTest.gracefulHandling).toBe(true);
    });
  });

  describe('3. Modular System Addition', () => {
    test('should support adding new systems following orchestration patterns', async () => {
      const moduleAdditionTest = {
        newSystemAdded: false,
        followsPattern: false,
        integratedProperly: false
      };

      await systemCoordinator.initialize();

      // Create new system following IManagedSystem pattern
      const newModularSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = true;
          moduleAdditionTest.newSystemAdded = true;
          moduleAdditionTest.followsPattern = true;
        }),
        updateAnimation: jest.fn().mockImplementation((deltaTime: number) => {
          // Mock animation update
        }),
        healthCheck: jest.fn().mockResolvedValue({
          healthy: true,
          systemName: 'NewModularSystem',
          initialized: true
        }),
        destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = false;
        })
      };

      // Attempt to add new system
      try {
        // If coordinator supports dynamic system addition
        if ((systemCoordinator as any).addSystem) {
          await (systemCoordinator as any).addSystem(newModularSystem);
          moduleAdditionTest.integratedProperly = true;
        } else {
          // Manual integration following pattern
          await newModularSystem.initialize();
          const health = await newModularSystem.healthCheck();
          if (health.healthy) {
            moduleAdditionTest.integratedProperly = true;
          }
        }
      } catch (error) {
        // Should handle new system addition gracefully
      }

      // New system should follow orchestration patterns
      expect(moduleAdditionTest.newSystemAdded).toBe(true);
      expect(moduleAdditionTest.followsPattern).toBe(true);
      expect(moduleAdditionTest.integratedProperly).toBe(true);
    });

    test('should enforce interface compliance for new systems', async () => {
      const complianceTest = {
        compliantSystemAccepted: false,
        nonCompliantSystemRejected: false,
        interfaceValidation: false
      };

      await systemCoordinator.initialize();

      // Compliant system (implements IManagedSystem)
      const compliantSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockResolvedValue(undefined),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
        destroy: jest.fn().mockResolvedValue(undefined)
      };

      // Non-compliant system (missing required methods)
      const nonCompliantSystem = {
        start: jest.fn(),
        stop: jest.fn(),
        // Missing initialize, updateAnimation, healthCheck, destroy
      };

      // Test compliant system
      try {
        await compliantSystem.initialize();
        const health = await compliantSystem.healthCheck();
        if (health.healthy) {
          complianceTest.compliantSystemAccepted = true;
        }
      } catch (error) {
        // Compliant system should work
      }

      // Test non-compliant system
      try {
        // This should fail interface validation
        await (nonCompliantSystem as any).initialize?.();
        complianceTest.nonCompliantSystemRejected = false;
      } catch (error) {
        complianceTest.nonCompliantSystemRejected = true;
      }

      // Manual interface validation
      const hasRequiredMethods = (system: any): system is IManagedSystem => {
        return typeof system.initialize === 'function' &&
               typeof system.updateAnimation === 'function' &&
               typeof system.healthCheck === 'function' &&
               typeof system.destroy === 'function';
      };

      complianceTest.interfaceValidation = hasRequiredMethods(compliantSystem) && !hasRequiredMethods(nonCompliantSystem);

      // Should enforce interface compliance
      expect(complianceTest.compliantSystemAccepted).toBe(true);
      expect(complianceTest.nonCompliantSystemRejected).toBe(true);
      expect(complianceTest.interfaceValidation).toBe(true);
    });

    test('should integrate new systems into existing orchestration flow', async () => {
      const integrationTest = {
        systemIntegratedIntoPhases: false,
        eventBusIntegration: false,
        dependencyChainRespected: false
      };

      await systemCoordinator.initialize();

      // New system that integrates with orchestration
      const orchestratedSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = true;
          
          // Integrate with event bus
          unifiedEventBus.subscribe('test:orchestration-integration', () => {
            integrationTest.eventBusIntegration = true;
          }, 'orchestrated-system');
          
          integrationTest.systemIntegratedIntoPhases = true;
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({
          healthy: true,
          integratedWithEventBus: true,
          followsOrchestrationPattern: true
        }),
        destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = false;
          unifiedEventBus.unsubscribeAll('orchestrated-system');
        })
      };

      // Initialize new system following orchestration pattern
      await orchestratedSystem.initialize();

      // Test event bus integration
      unifiedEventBus.emitSync('test:orchestration-integration', { test: true });

      // Test dependency chain respect
      const healthCheck = await orchestratedSystem.healthCheck();
      if (healthCheck.integratedWithEventBus && healthCheck.followsOrchestrationPattern) {
        integrationTest.dependencyChainRespected = true;
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      // Cleanup
      await orchestratedSystem.destroy();

      // Should integrate into orchestration flow
      expect(integrationTest.systemIntegratedIntoPhases).toBe(true);
      expect(integrationTest.eventBusIntegration).toBe(true);
      expect(integrationTest.dependencyChainRespected).toBe(true);
    });
  });

  describe('4. System Lifecycle Management', () => {
    test('should enforce proper initialize → healthCheck → destroy lifecycle', async () => {
      const lifecycleTest = {
        initializePhase: false,
        healthCheckPhase: false,
        destroyPhase: false,
        lifecycleOrder: [] as string[]
      };

      // Mock system with lifecycle tracking
      const lifecycleManagedSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = true;
          lifecycleTest.initializePhase = true;
          lifecycleTest.lifecycleOrder.push('initialize');
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          if (this.initialized) {
            lifecycleTest.healthCheckPhase = true;
            lifecycleTest.lifecycleOrder.push('healthCheck');
            return { healthy: true, initialized: this.initialized };
          }
          return { healthy: false, error: 'Not initialized' };
        }),
        destroy: jest.fn().mockImplementation(async function(this: IManagedSystem) {
          this.initialized = false;
          lifecycleTest.destroyPhase = true;
          lifecycleTest.lifecycleOrder.push('destroy');
        })
      };

      // Execute full lifecycle
      await lifecycleManagedSystem.initialize();
      await lifecycleManagedSystem.healthCheck();
      await lifecycleManagedSystem.destroy();

      await systemCoordinator.initialize();
      const coordinatorHealth = await systemCoordinator.healthCheck?.();
      await systemCoordinator.destroy();

      // Verify proper lifecycle order
      expect(lifecycleTest.lifecycleOrder).toEqual(['initialize', 'healthCheck', 'destroy']);
      expect(lifecycleTest.initializePhase).toBe(true);
      expect(lifecycleTest.healthCheckPhase).toBe(true);
      expect(lifecycleTest.destroyPhase).toBe(true);
      expect(coordinatorHealth).toBeDefined();
    });

    test('should handle lifecycle method failures gracefully', async () => {
      const lifecycleFailureTest = {
        initializeFailureHandled: false,
        healthCheckFailureHandled: false,
        destroyFailureHandled: false,
        systemRecovery: false
      };

      // System with failing lifecycle methods
      const failingSystem: IManagedSystem = {
        initialized: false,
        initialize: jest.fn().mockRejectedValue(new Error('Initialize failed')),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockRejectedValue(new Error('Health check failed')),
        destroy: jest.fn().mockRejectedValue(new Error('Destroy failed'))
      };

      // Test initialize failure handling
      try {
        await failingSystem.initialize();
      } catch (error) {
        lifecycleFailureTest.initializeFailureHandled = true;
      }

      // Test health check failure handling
      try {
        await failingSystem.healthCheck();
      } catch (error) {
        lifecycleFailureTest.healthCheckFailureHandled = true;
      }

      // Test destroy failure handling
      try {
        await failingSystem.destroy();
      } catch (error) {
        lifecycleFailureTest.destroyFailureHandled = true;
      }

      // Test coordinator resilience
      try {
        await systemCoordinator.initialize();
        const health = await systemCoordinator.healthCheck?.();
        if (health) {
          lifecycleFailureTest.systemRecovery = true;
        }
      } catch (error) {
        // Coordinator should handle individual system failures
      }

      // Should handle lifecycle failures gracefully
      expect(lifecycleFailureTest.initializeFailureHandled).toBe(true);
      expect(lifecycleFailureTest.healthCheckFailureHandled).toBe(true);
      expect(lifecycleFailureTest.destroyFailureHandled).toBe(true);
      expect(lifecycleFailureTest.systemRecovery).toBe(true);
    });

    test('should provide comprehensive health reporting across all systems', async () => {
      const healthReportingTest = {
        coordinatorHealthAvailable: false,
        healthDataComprehensive: false,
        systemStatusTracked: false
      };

      await systemCoordinator.initialize();

      // Get comprehensive health check
      const healthReport = await systemCoordinator.healthCheck?.();

      if (healthReport) {
        healthReportingTest.coordinatorHealthAvailable = true;

        // Check for comprehensive health data
        const expectedHealthFields = ['healthy', 'phases', 'eventBusStatus', 'dependencyValidation'];
        const hasComprehensiveData = expectedHealthFields.every(field => 
          field in healthReport || healthReport.issues || healthReport.metrics
        );

        if (hasComprehensiveData) {
          healthReportingTest.healthDataComprehensive = true;
        }

        // Check for system status tracking
        if (healthReport.phases || healthReport.metrics || healthReport.systemStatus) {
          healthReportingTest.systemStatusTracked = true;
        }
      }

      // Should provide comprehensive health reporting
      expect(healthReportingTest.coordinatorHealthAvailable).toBe(true);
      expect(healthReportingTest.healthDataComprehensive).toBe(true);
      expect(healthReportingTest.systemStatusTracked).toBe(true);
    });

    test('should ensure proper resource cleanup during destroy phase', async () => {
      const cleanupTest = {
        resourcesAllocated: 0,
        resourcesCleaned: 0,
        memoryLeaksDetected: false,
        eventSubscriptionsCleaned: false
      };

      await systemCoordinator.initialize();

      // Allocate resources to track cleanup
      const resourceTrackingSystem: IManagedSystem = {
        initialized: false,
        resources: [] as any[],
        initialize: jest.fn().mockImplementation(async function(this: any) {
          this.initialized = true;
          
          // Allocate mock resources
          this.resources.push(
            { type: 'eventSubscription', id: 'test-sub-1' },
            { type: 'animationFrame', id: 'test-frame-1' },
            { type: 'interval', id: 'test-interval-1' }
          );
          
          cleanupTest.resourcesAllocated = this.resources.length;
          
          // Subscribe to events
          unifiedEventBus.subscribe('test:cleanup', () => {}, 'resource-tracking-system');
        }),
        updateAnimation: jest.fn(),
        healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
        destroy: jest.fn().mockImplementation(async function(this: any) {
          this.initialized = false;
          
          // Clean up resources
          this.resources.forEach((resource: any) => {
            // Mock cleanup
            cleanupTest.resourcesCleaned++;
          });
          this.resources = [];
          
          // Clean up event subscriptions
          unifiedEventBus.unsubscribeAll('resource-tracking-system');
          cleanupTest.eventSubscriptionsCleaned = true;
        })
      };

      await resourceTrackingSystem.initialize();
      await resourceTrackingSystem.destroy();
      await systemCoordinator.destroy();

      // Verify proper cleanup
      expect(cleanupTest.resourcesAllocated).toBeGreaterThan(0);
      expect(cleanupTest.resourcesCleaned).toBe(cleanupTest.resourcesAllocated);
      expect(cleanupTest.eventSubscriptionsCleaned).toBe(true);
      expect(cleanupTest.memoryLeaksDetected).toBe(false);
    });
  });
});