/**
 * WebGL Systems Integration
 * 
 * Integrates the UnifiedWebGLController with existing WebGL systems
 * and the Year3000System architecture.
 */

import { UnifiedWebGLController } from "./UnifiedWebGLController";
import { WebGLGradientBackgroundSystem } from "@/visual/backgrounds/WebGLGradientBackgroundSystem";
import { WebGLGradientAdapter } from "@/visual/backgrounds/WebGLGradientAdapter";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";

/**
 * WebGL Systems Coordinator
 * 
 * Manages the integration between UnifiedWebGLController and all WebGL systems.
 * Replaces the complex ContinuousQualityManager approach with a simple,
 * unified management system.
 */
export class WebGLSystemsIntegration implements IManagedSystem {
  public initialized = false;
  
  private controller: UnifiedWebGLController;
  private webglGradientSystem: WebGLGradientBackgroundSystem | null = null;
  private webglGradientAdapter: WebGLGradientAdapter | null = null;

  constructor(deviceCapabilities: DeviceCapabilityDetector) {
    this.controller = new UnifiedWebGLController(deviceCapabilities);
    
    Y3KDebug?.debug?.log("WebGLSystemsIntegration", "Created WebGL systems integration");
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
    
    // Check individual system health
    const systemIssues: string[] = [];
    
    if (this.webglGradientSystem) {
      try {
        const gradientHealth = await this.webglGradientSystem.healthCheck();
        if (!gradientHealth.ok) {
          systemIssues.push(`WebGL Gradient: ${gradientHealth.details}`);
        }
      } catch (error) {
        systemIssues.push("WebGL Gradient: health check failed");
      }
    }
    
    return {
      healthy: true,
      details: systemIssues.length > 0 
        ? `Some system issues: ${systemIssues.join(', ')}`
        : "All WebGL systems healthy",
      issues: systemIssues,
      system: "WebGLSystemsIntegration"
    };
  }

  public destroy(): void {
    // Destroy all registered systems
    if (this.webglGradientSystem) {
      this.webglGradientSystem.destroy();
    }
    
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
      // Register WebGL Gradient Background System
      await this._registerWebGLGradientSystem();
      
      // TODO: Register other WebGL systems (corridor effects, particle systems, etc.)
      // await this._registerCorridorEffectsSystem();
      // await this._registerParticleSystem();
      
      Y3KDebug?.debug?.log("WebGLSystemsIntegration", "All WebGL systems registered successfully");
      
    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLSystemsIntegration", "Failed to register some WebGL systems:", error);
    }
  }

  private async _registerWebGLGradientSystem(): Promise<void> {
    try {
      // Get access to the global WebGL gradient system from Year3000System
      const year3000System = (globalThis as any).year3000System;
      if (!year3000System) {
        Y3KDebug?.debug?.warn("WebGLSystemsIntegration", "Year3000System not available");
        return;
      }
      
      // Find the WebGL gradient system - it might be registered under various names
      const possibleSystems = [
        'webglGradientBackgroundSystem',
        'flowingLiquidConsciousnessSystem',
        'webglBackgroundSystem'
      ];
      
      let foundSystem = null;
      for (const systemName of possibleSystems) {
        if (year3000System[systemName]) {
          foundSystem = year3000System[systemName];
          break;
        }
      }
      
      if (!foundSystem) {
        Y3KDebug?.debug?.warn("WebGLSystemsIntegration", "WebGL gradient system not found in Year3000System");
        return;
      }
      
      // Create adapter and register with controller
      this.webglGradientSystem = foundSystem;
      this.webglGradientAdapter = new WebGLGradientAdapter(this.webglGradientSystem!);
      
      this.controller.registerSystem(
        'webgl-gradient-background', 
        this.webglGradientAdapter, 
        100 // High priority
      );
      
      Y3KDebug?.debug?.log("WebGLSystemsIntegration", "WebGL gradient system registered");
      
    } catch (error) {
      Y3KDebug?.debug?.warn("WebGLSystemsIntegration", "Failed to register WebGL gradient system:", error);
    }
  }

  private _getRegisteredSystemNames(): string[] {
    // Get names of registered systems from controller
    const systemNames: string[] = [];
    
    if (this.webglGradientAdapter) {
      systemNames.push('WebGL Gradient Background');
    }
    
    return systemNames;
  }
}