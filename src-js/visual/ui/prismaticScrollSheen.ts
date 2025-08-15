// ---------------------------------------------------------------------------
// Prismatic Scroll Sheen Effect – Year 3000 visual enhancement
// ---------------------------------------------------------------------------
// Applies a rainbow-sheen gradient that shifts hue based on the user's vertical
// scroll position **provided by the Cosmic Discovery Framework**. The legacy
// scroll listener has been removed – we now rely on the shared `scrollRatio`
// from `FrameContext`, ensuring perfect sync between systems and zero extra
// event overhead.
// ---------------------------------------------------------------------------

import type { FrameContext, IVisualSystem } from "@/core/animation/EnhancedMasterAnimationCoordinator";
import year3000System from "@/core/lifecycle/AdvancedThemeSystem";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController
} from "@/core/performance/OptimizedCSSVariableManager";

// Default cycle length in pixels before the ratio loops back to 0.
// Designers can override at runtime via the CSS variable
//     --sn-scroll-cycle-px: <value>;
const DEFAULT_CYCLE_PX = 6000;

/**
 * Lightweight visual system that maps `frameContext.scrollRatio` (0-1) onto
 * a CSS custom property `--sn-cdf-scroll-ratio`.  All gradient animations in
 * SCSS reference this canonical var.  We optionally keep the legacy
 * `--sn-scroll-ratio` alias alive for backwards compatibility.
 */
export class PrismaticScrollSheenSystem implements IVisualSystem {
  public readonly systemName = "PrismaticScrollSheen";

  private _lastRatio = -1;
  private cssController: OptimizedCSSVariableManager;

  constructor(private cyclePx = DEFAULT_CYCLE_PX) {
    // Initialize CSS coordination - use globalThis to access Year3000System
    const year3000System = (globalThis as any).year3000System;
    this.cssController = year3000System?.cssConsciousnessController || getGlobalOptimizedCSSController();

    // Expose cycle length so SCSS authors can reference it using coordination
    this.cssController.setVariable(
      "PrismaticScrollSheenSystem",
      "--sn-scroll-cycle-px",
      String(cyclePx),
      "normal", // Normal priority for scroll cycle setup
      "scroll-cycle-init"
    );
  }

  /**
   * Called each animation frame by VisualSystemRegistry.
   */
  public onAnimate(_delta: number, context: FrameContext): void {
    const ratio = context.scrollRatio ?? 0;
    if (Math.abs(ratio - this._lastRatio) < 0.001) return; // avoid spam
    this._lastRatio = ratio;

    // Update canonical CDF var and legacy alias using coordination
    const scrollRatioVariables = {
      "--sn-cdf-scroll-ratio": ratio.toFixed(4),
      "--sn-scroll-ratio": ratio.toFixed(4)
    };

    this.cssController.batchSetVariables(
      "PrismaticScrollSheenSystem",
      scrollRatioVariables,
      "high", // High priority for scroll ratio updates - affects visual responsiveness
      "scroll-ratio-update"
    );
  }

  public onPerformanceModeChange(): void {
    // no-op – effect is negligible cost
  }

  public destroy(): void {
    // nothing to clean up
  }
}

// ---------------------------------------------------------------------------
// Backwards-compat helper – retain original function signature so existing
// calls in theme.entry.ts don't break.  Internally we just register the new
// visual system with CDF and do no more work here.
// ---------------------------------------------------------------------------

export function initializePrismaticScrollSheen(): void {
  try {
    const sys = new PrismaticScrollSheenSystem();
    (year3000System as any)?.registerVisualSystem?.(sys, "background");
  } catch (err) {
    console.error("[PrismaticScrollSheen] Failed to init:", err);
  }
}

// Auto-initialise if Year3000System global already available (hot-reload / tests)
if ((window as any).Y3K?.system?.registerVisualSystem) {
  initializePrismaticScrollSheen();
}
