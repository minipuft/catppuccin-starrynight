// ============================================================================
// 🛰️ CDFVariableBridge – Pipe frameContext → CSS variables (Phase 2)
// ----------------------------------------------------------------------------
// Listens for the `cdf:frameContext` event emitted by VisualSystemRegistry and
// writes canonical --sn-cdf-* variables each animation frame through the
// existing UnifiedCSSConsciousnessController to avoid excessive style recalculations.
// ============================================================================

import { GlobalEventBus } from "@/core/events/EventBus";
import type { FrameContext } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import { UnifiedCSSConsciousnessController } from "@/core/css/UnifiedCSSConsciousnessController";

export class CDFVariableBridge {
  private unsubscribe: () => void;
  private reduceMotionMQ: MediaQueryList | null = null;
  private _mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(private batcher: UnifiedCSSConsciousnessController) {
    // Subscribe to frame context broadcasts
    this.unsubscribe = GlobalEventBus.subscribe<FrameContext>(
      "cdf:frameContext",
      (ctx) => this._handleFrame(ctx)
    );

    // Initial reduced-motion sync + listener
    if (typeof window !== "undefined" && window.matchMedia) {
      this.reduceMotionMQ = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );
      this._syncReducedMotion(this.reduceMotionMQ.matches);
      this._mqHandler = (e: MediaQueryListEvent) => {
        this._syncReducedMotion(e.matches);
      };
      try {
        this.reduceMotionMQ.addEventListener("change", this._mqHandler);
      } catch {
        // Safari < 14 fallback
        // @ts-ignore
        this.reduceMotionMQ.addListener(this._mqHandler);
      }
    }
  }

  public destroy(): void {
    this.unsubscribe?.();
    if (this.reduceMotionMQ && this._mqHandler) {
      try {
        this.reduceMotionMQ.removeEventListener("change", this._mqHandler);
      } catch {
        // legacy browsers
        // @ts-ignore
        this.reduceMotionMQ.removeListener(this._mqHandler);
      }
    }
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private _handleFrame(ctx: FrameContext): void {
    // Scroll ratio
    if (typeof ctx.scrollRatio === "number") {
      this.batcher.queueCSSVariableUpdate(
        "--sn-cdf-scroll-ratio",
        ctx.scrollRatio.toFixed(3)
      );
      // Also feed legacy mapping for immediate benefit
      this.batcher.queueCSSVariableUpdate(
        "--sn-scroll-ratio",
        ctx.scrollRatio.toFixed(3)
      );
    }

    // Beat / energy envelope
    if (typeof ctx.beatIntensity === "number") {
      const val = ctx.beatIntensity.toFixed(3);
      this.batcher.queueCSSVariableUpdate("--sn-cdf-energy", val);
      this.batcher.queueCSSVariableUpdate("--sn-nebula-beat-intensity", val);
    }
  }

  private _syncReducedMotion(reduce: boolean): void {
    this.batcher.queueCSSVariableUpdate("--sn-cdf-enabled", reduce ? "0" : "1");
  }
}
