/* ===================================================================
 * ABERRATION VISUAL SYSTEM – Year 3000 Performance Stack (Phase 1)
 * -------------------------------------------------------------------
 * Thin adaptor that lets AberrationCanvas render under the global
 * MasterAnimationCoordinator rather than a private requestAnimationFrame.
 * Implements the `onAnimate` hook so the effect participates in unified
 * frame budgeting & performance-mode toggles.
 * -------------------------------------------------------------------
 * TODO[Phase-2]: Respond to onPerformanceModeChange by lowering canvas
 *                resolution when performance mode is active.
 * =================================================================== */

import type {
  FrameContext,
  IVisualSystem,
} from "@/core/lifecycle/VisualSystemRegistry";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { AberrationCanvas } from "@/visual/ui-effects/Aberration/AberrationCanvas";

export class AberrationVisualSystem implements IVisualSystem {
  public readonly systemName = "AberrationCanvas";
  private _canvas: AberrationCanvas;
  private _elapsed = 0;
  private _perf: PerformanceAnalyzer | undefined;

  constructor(canvas: AberrationCanvas, perf?: PerformanceAnalyzer) {
    this._canvas = canvas;
    this._perf = perf;
  }

  /* --------------------------------------------------------------- */
  /* MasterAnimationCoordinator hooks                                */
  /* --------------------------------------------------------------- */

  /**
   * Called by the coordinator every frame (subject to frame budgeting).
   * @param deltaMs Time in milliseconds since last call.
   * @param _context Shared FrameContext from VisualSystemRegistry (unused for now).
   */
  public onAnimate(deltaMs: number, _context: FrameContext): void {
    this._elapsed += deltaMs;
    let start = 0;
    if (this._perf) start = this._perf.startTiming("AberrationVisualSystem");

    // Drive the canvas render
    this._canvas.render(this._elapsed);

    if (this._perf && start) {
      this._perf.endTiming("AberrationVisualSystem", start);
    }
  }

  /**
   * Optional hook – will be invoked when MAC toggles performance modes.
   * We keep it for future Phase-2 improvements (dynamic resolution scaling).
   */
  public onPerformanceModeChange?(mode: "performance" | "quality"): void {
    // Dynamically adapt to the coordinator's performance mode.
    if (mode === "performance") {
      this._canvas.setPixelSize(128); // half res
      this._canvas.setStrength(0.25);
    } else {
      this._canvas.setPixelSize(256); // default res
      this._canvas.setStrength(0.4);
    }
  }

  /* --------------------------------------------------------------- */
  /* Lifecycle helpers                                               */
  /* --------------------------------------------------------------- */
  public destroy(): void {
    this._canvas.destroy();
  }
}
