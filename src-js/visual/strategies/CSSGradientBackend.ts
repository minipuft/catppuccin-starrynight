/**
 * CSSGradientBackend - CSS-based gradient rendering fallback
 * 🔧 PHASE 2: Lightweight CSS backend for systems without WebGL
 */

import type { VisualBackplane, RGBStop, MusicMetrics, PerformanceConstraints, BackendCapabilities } from "@/types/systems";
import { CSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { Y3KDebug } from "@/debug/DebugCoordinator";

export class CSSGradientBackend implements Partial<VisualBackplane> {
  public readonly backendId = "css";
  public isReady = false;

  public readonly capabilities: BackendCapabilities = {
    webgl: false,
    webgl2: false,
    highPerformance: false,
    maxTextureSize: 0,
    maxShaderComplexity: "low",
  };

  private cssController: CSSVariableWriter;
  public initialized: boolean = false;
  private currentPalette: RGBStop[] = [];
  private currentQuality: "low" | "medium" | "high" | "ultra" = "medium";

  constructor(cssController: CSSVariableWriter) {
    this.cssController = cssController;
  }

  public async init(rootElement: HTMLElement, constraints?: PerformanceConstraints): Promise<void> {
    if (this.initialized) return;

    try {
      this.initialized = true;
      this.isReady = true;

      Y3KDebug?.debug?.log(
        "CSSGradientBackend",
        "CSS gradient backend initialized successfully"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "CSSGradientBackend",
        "Failed to initialize CSS gradient backend:",
        error
      );
      throw error;
    }
  }

  public setPalette(stops: RGBStop[]): void {
    if (!this.initialized) {
      Y3KDebug?.debug?.warn(
        "CSSGradientBackend",
        "Cannot set palette - backend not initialized"
      );
      return;
    }

    try {
      this.currentPalette = stops;

      // Convert RGBStop[] to CSS gradient string
      const gradientString = this.generateCSSGradient(stops);

      // Apply to CSS variables
      this.cssController.setVariable(
        "CSSGradientBackend",
        "--sn-gradient-background",
        gradientString,
        "normal",
        "gradient-palette"
      );

      Y3KDebug?.debug?.log(
        "CSSGradientBackend",
        `Applied ${stops.length} color stops to CSS gradient`
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "CSSGradientBackend",
        "Failed to set palette:",
        error
      );
    }
  }

  public setQuality(quality: "low" | "medium" | "high" | "ultra"): void {
    if (!this.initialized) return;

    this.currentQuality = quality;

    // CSS quality affects color stop count and blur
    const maxStops = quality === "low" ? 6 : quality === "medium" ? 8 : quality === "high" ? 10 : 12;

    // Re-apply current palette with quality adjustments
    if (this.currentPalette.length > 0) {
      const adjusted = this.currentPalette.slice(0, maxStops);
      this.setPalette(adjusted);
    }
  }

  public setEnabled(enabled: boolean, transitionDuration?: number): void {
    // CSS backend is always enabled when initialized
    if (this.initialized) {
      Y3KDebug?.debug?.log(
        "CSSGradientBackend",
        `Backend ${enabled ? "enabled" : "disabled"}`
      );
    }
  }

  public setMusicMetrics(metrics: MusicMetrics): void {
    // CSS backend doesn't use music metrics directly
  }

  public setPerformanceConstraints(constraints: PerformanceConstraints): void {
    // Adjust quality based on constraints
    const quality = constraints.qualityLevel || "medium";
    this.setQuality(quality);
  }

  public getPerformanceMetrics(): any {
    return {
      fps: 60,
      memoryUsageMB: 0,
      healthy: this.initialized,
    };
  }

  public updateAnimation(deltaTime: number): void {
    // CSS backend doesn't need animation updates
  }

  public async healthCheck(): Promise<{ ok: boolean; healthy: boolean; details?: string; metrics?: any }> {
    return {
      ok: this.initialized,
      healthy: this.initialized,
      details: this.initialized
        ? `CSS backend active with ${this.currentPalette.length} stops`
        : "Backend not initialized",
      metrics: {
        performanceScore: 0.6,
        healthy: this.initialized,
      },
    };
  }

  public destroy(): void {
    if (!this.initialized) return;

    try {
      // Clear CSS variables by setting empty value
      this.cssController.setProperty("--sn-gradient-background", "");

      this.initialized = false;
      this.isReady = false;
      this.currentPalette = [];

      Y3KDebug?.debug?.log(
        "CSSGradientBackend",
        "CSS gradient backend destroyed"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "CSSGradientBackend",
        "Error during backend destruction:",
        error
      );
    }
  }

  private generateCSSGradient(stops: RGBStop[]): string {
    const colorStrings = stops.map(stop => {
      const percent = Math.round(stop.position * 100);
      return `rgb(${stop.r}, ${stop.g}, ${stop.b}) ${percent}%`;
    });

    return `radial-gradient(ellipse at center, ${colorStrings.join(", ")})`;
  }
}
