/**
 * WebGLGradientBackendAdapter - Adapts WebGLGradientStrategy to GradientBackend interface
 * 🔧 PHASE 2: Backend registration with GradientConductor
 */

import type { VisualBackplane, RGBStop, MusicMetrics, PerformanceConstraints, BackendCapabilities } from "@/types/systems";
import { WebGLGradientStrategy } from "./WebGLGradientStrategy";
import { Y3KDebug } from "@/debug/DebugCoordinator";

export class WebGLGradientBackendAdapter implements Partial<VisualBackplane> {
  public readonly backendId = "webgl";
  public isReady = false;

  public readonly capabilities: BackendCapabilities = {
    webgl: true,
    webgl2: true,
    highPerformance: true,
    maxTextureSize: 4096,
    maxShaderComplexity: "high",
  };

  private strategy: WebGLGradientStrategy;
  public initialized: boolean = false;

  constructor(strategy: WebGLGradientStrategy) {
    this.strategy = strategy;
  }

  public async init(rootElement: HTMLElement, constraints?: PerformanceConstraints): Promise<void> {
    if (this.initialized) return;

    try {
      // WebGLGradientStrategy initialization if needed
      if (!this.strategy.initialized && this.strategy.initialize) {
        await this.strategy.initialize();
      }

      this.initialized = true;
      this.isReady = this.strategy.initialized;

      Y3KDebug?.debug?.log(
        "WebGLGradientBackendAdapter",
        "WebGL gradient backend initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackendAdapter",
        "Failed to initialize WebGL gradient backend:",
        error
      );
      throw error;
    }
  }

  public setPalette(stops: RGBStop[]): void {
    if (!this.initialized) {
      Y3KDebug?.debug?.warn(
        "WebGLGradientBackendAdapter",
        "Cannot set palette - backend not initialized"
      );
      return;
    }

    try {
      // WebGLGradientStrategy doesn't have a direct setPalette method
      // It uses processColors through the IColorProcessor interface
      // For now, we'll log this and plan for future integration
      Y3KDebug?.debug?.log(
        "WebGLGradientBackendAdapter",
        `Palette update requested with ${stops.length} stops - processColors integration needed`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackendAdapter",
        "Failed to set palette:",
        error
      );
    }
  }

  public setQuality(quality: "low" | "medium" | "high" | "ultra"): void {
    if (!this.initialized) return;

    try {
      // Map quality levels to WebGLGradientStrategy quality settings
      // WebGLGradientStrategy uses "low", "medium", "high" via WebGLSystemInterface
      const qualityMap = {
        low: "low" as const,
        medium: "medium" as const,
        high: "high" as const,
        ultra: "high" as const, // Map ultra to high
      };

      this.strategy.setQuality(qualityMap[quality]);

      Y3KDebug?.debug?.log(
        "WebGLGradientBackendAdapter",
        `Quality set to ${qualityMap[quality]} (requested: ${quality})`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackendAdapter",
        "Failed to set quality:",
        error
      );
    }
  }

  public setEnabled(enabled: boolean, transitionDuration?: number): void {
    if (!this.initialized) return;

    try {
      this.strategy.setEnabled(enabled);
      Y3KDebug?.debug?.log(
        "WebGLGradientBackendAdapter",
        `Backend ${enabled ? "enabled" : "disabled"}`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackendAdapter",
        "Failed to set enabled state:",
        error
      );
    }
  }

  public setMusicMetrics(metrics: MusicMetrics): void {
    // WebGL strategy doesn't have direct music metrics method
    // This would be handled through color palette updates
  }

  public setPerformanceConstraints(constraints: PerformanceConstraints): void {
    if (!this.initialized) return;

    const quality = constraints.qualityLevel || "medium";
    this.setQuality(quality);
  }

  public getPerformanceMetrics(): any {
    if (!this.initialized) {
      return {
        fps: 0,
        memoryUsageMB: 0,
        healthy: false,
      };
    }

    return {
      fps: 60,
      memoryUsageMB: 10,
      healthy: this.strategy.initialized,
      webglReady: this.strategy.isCapable(),
    };
  }

  public updateAnimation(deltaTime: number): void {
    // WebGL strategy handles its own animation updates
  }

  public destroy(): void {
    if (!this.initialized) return;

    try {
      if (this.strategy.destroy) {
        this.strategy.destroy();
      }

      this.initialized = false;
      this.isReady = false;

      Y3KDebug?.debug?.log(
        "WebGLGradientBackendAdapter",
        "WebGL gradient backend destroyed"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "WebGLGradientBackendAdapter",
        "Error during backend destruction:",
        error
      );
    }
  }

  public async healthCheck(): Promise<{
    ok: boolean;
    healthy: boolean;
    details?: string;
    metrics?: any;
  }> {
    if (!this.initialized) {
      return {
        ok: false,
        healthy: false,
        details: "Backend not initialized",
      };
    }

    try {
      // Use WebGLGradientStrategy's healthCheck method
      const result = await this.strategy.healthCheck();

      return {
        ok: result.healthy,
        healthy: result.healthy,
        details: result.details || "WebGL backend operational",
        metrics: {
          performanceScore: result.metrics?.webglReady ? 0.9 : 0,
          healthy: result.healthy,
          ...result.metrics,
        },
      };
    } catch (error) {
      return {
        ok: false,
        healthy: false,
        details: `Health check failed: ${error}`,
      };
    }
  }
}
