/**
 * WebGL Systems Integration
 *
 * Integrates the UnifiedWebGLController with existing WebGL systems
 * and the Year3000System architecture.
 *
 * 🔧 PHASE 2.2: WebGL gradient rendering is now managed via VisualEffectsCoordinator
 * using WebGLGradientStrategy (src-js/visual/strategies/WebGLGradientStrategy.ts).
 * This integration layer focuses on UnifiedWebGLController coordination and
 * potential future WebGL systems (particles, corridor effects, etc.).
 */

import { UnifiedWebGLController } from "./UnifiedWebGLController";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";

/**
 * WebGL Systems Coordinator
 *
 * Manages the integration between UnifiedWebGLController and all WebGL systems.
 * Replaces the complex ContinuousQualityManager approach with a simple,
 * unified management system.
 *
 * 🔧 PHASE 2.2: Now uses VisualEffectsCoordinator for WebGL gradient strategy access.
 */
export class WebGLSystemsIntegration implements IManagedSystem {
  public initialized = false;

  private controller: UnifiedWebGLController;
  private visualSystemCoordinator: any | null = null; // VisualEffectsCoordinator reference (Phase 2.2)

  constructor(
    deviceCapabilities: DeviceCapabilityDetector,
    visualSystemCoordinator?: any // VisualEffectsCoordinator for WebGL strategy access
  ) {
    this.controller = new UnifiedWebGLController(deviceCapabilities);
    this.visualSystemCoordinator = visualSystemCoordinator || null;

    Y3KDebug?.debug?.log("WebGLSystemsIntegration", "Created WebGL systems integration", {
      hasVisualCoordinator: !!visualSystemCoordinator
    });
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    // Initialize the unified controller
    await this.controller.initialize();
    
    // Register existing WebGL systems with the controller
    await this._registerWebGLSystems();
    
    this.initialized = true;
    
    Y3KDebug?.debug?.log("WebGLSystemsIntegration", "Integration initialized", {
      controllerState: this.controller.getState(),
      quality: this.controller.getQuality(),
      registeredSystems: this._getRegisteredSystemNames()
    });
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!this.initialized) {
      return {
        healthy: false,
        details: "Not initialized",
        system: "WebGLSystemsIntegration"
      };
    }

    // Check controller health
    const controllerHealth = await this.controller.healthCheck();
    if (!controllerHealth.healthy) {
      return {
        healthy: false,
        details: `Controller unhealthy: ${controllerHealth.details}`,
        system: "WebGLSystemsIntegration"
      };
    }

    // Post-consolidation: Individual WebGL systems (like gradients) are managed
    // via VisualEffectsCoordinator, so we only check the controller health here
    return {
      healthy: true,
      details: "WebGL controller healthy",
      system: "WebGLSystemsIntegration"
    };
  }

  public destroy(): void {
    // Destroy the controller
    this.controller.destroy();

    this.initialized = false;

    Y3KDebug?.debug?.log("WebGLSystemsIntegration", "Integration destroyed");
  }

  public updateAnimation(deltaTime: number): void {
    if (this.initialized) {
      this.controller.updateAnimation(deltaTime);
    }
  }

  // =============================================================================
  // PUBLIC API - Simplified WebGL Management
  // =============================================================================

  /**
   * Get the unified WebGL controller for direct access
   */
  public getController(): UnifiedWebGLController {
    return this.controller;
  }

  /**
   * Enable all WebGL effects
   */
  public enableWebGL(): void {
    this.controller.enable();
  }

  /**
   * Disable all WebGL effects
   */
  public disableWebGL(): void {
    this.controller.disable();
  }

  /**
   * Set quality for all WebGL effects
   */
  public setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.controller.setQuality(quality);
  }

  /**
   * Check if WebGL is currently active
   */
  public isWebGLActive(): boolean {
    return this.controller.isEnabled();
  }

  /**
   * Get current WebGL state
   */
  public getWebGLState(): 'disabled' | 'css-fallback' | 'webgl-active' {
    return this.controller.getState();
  }

  /**
   * Get current quality level
   */
  public getQuality(): 'low' | 'medium' | 'high' {
    return this.controller.getQuality();
  }

  /**
   * Set VisualEffectsCoordinator reference (Phase 2.2 late binding)
   *
   * Allows SystemIntegrationCoordinator to provide the VisualEffectsCoordinator
   * reference after both systems are created, enabling WebGLGradientStrategy
   * registration.
   *
   * @param visualSystemCoordinator - VisualEffectsCoordinator instance
   */
  public setVisualSystemCoordinator(visualSystemCoordinator: any): void {
    this.visualSystemCoordinator = visualSystemCoordinator;

    // If already initialized, register WebGLGradientStrategy now
    if (this.initialized) {
      this._registerWebGLSystems().catch(error => {
        Y3KDebug?.debug?.warn(
          "WebGLSystemsIntegration",
          "Failed to register WebGLGradientStrategy after late binding:",
          error
        );
      });
    }

    Y3KDebug?.debug?.log(
      "WebGLSystemsIntegration",
      "VisualEffectsCoordinator reference set (Phase 2.2 late binding)"
    );
  }

  // =============================================================================
  // PERFORMANCE SYSTEM INTEGRATION
  // =============================================================================

  /**
   * Called by tier-based performance system to set quality level
   */
  public handlePerformanceQualityAdjustment(
    suggestedQuality: 'low' | 'medium' | 'high', 
    reason: string
  ): void {
    this.controller.suggestQualityAdjustment(suggestedQuality, reason);
  }

  /**
   * Called by performance system to temporarily disable WebGL
   */
  public handlePerformanceDisable(reason: string): void {
    this.controller.performanceDisable(reason);
  }

  /**
   * Called by performance system to re-enable WebGL
   */
  public handlePerformanceEnable(reason: string): void {
    this.controller.performanceEnable(reason);
  }

  /**
   * Set quality based on device tier (simplified approach)
   */
  public setQualityFromTier(tier: 'low' | 'medium' | 'high'): void {
    // Direct mapping from tier to WebGL quality
    this.controller.setQuality(tier);
    
    Y3KDebug?.debug?.log("WebGLSystemsIntegration", `Quality set from device tier: ${tier}`);
  }

  // =============================================================================
  // PRIVATE IMPLEMENTATION
  // =============================================================================

  private async _registerWebGLSystems(): Promise<void> {
    try {
      // Phase 3: Register WebGLGradientStrategy for direct quality scaling
      if (this.visualSystemCoordinator) {
        const webglGradient = this.visualSystemCoordinator.getWebGLGradientStrategy();

        if (webglGradient) {
          // Register with UnifiedWebGLController for quality scaling coordination
          this.controller.registerSystem("webgl-gradient", webglGradient, 100);

          Y3KDebug?.debug?.log(
            "WebGLSystemsIntegration",
            "✓ WebGLGradientStrategy registered with UnifiedWebGLController (Phase 3 direct quality scaling)",
            {
              systemName: webglGradient.getSystemName?.() || "WebGLGradientStrategy",
              isCapable: webglGradient.isCapable?.() || false,
              isEnabled: webglGradient.isEnabled?.() || false
            }
          );
        } else {
          Y3KDebug?.debug?.warn(
            "WebGLSystemsIntegration",
            "⚠ WebGLGradientStrategy not yet created by VisualEffectsCoordinator - will use lazy registration"
          );
        }
      } else {
        Y3KDebug?.debug?.warn(
          "WebGLSystemsIntegration",
          "⚠ VisualEffectsCoordinator not provided - WebGLGradientStrategy cannot be registered for quality scaling"
        );
      }

      // TODO: Register future WebGL systems here:
      // await this._registerCorridorEffectsSystem();
      // await this._registerParticleSystem();

      Y3KDebug?.debug?.log(
        "WebGLSystemsIntegration",
        "WebGL systems registration complete"
      );

    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLSystemsIntegration", "Failed to register some WebGL systems:", error);
    }
  }

  private _getRegisteredSystemNames(): string[] {
    // Post-consolidation: Gradient rendering is managed via VisualEffectsCoordinator
    // This will return names of future WebGL systems when registered
    const systemNames: string[] = [];

    // Future WebGL systems will be listed here

    return systemNames;
  }
}