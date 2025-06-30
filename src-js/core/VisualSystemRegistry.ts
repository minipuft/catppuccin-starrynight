// ============================================================================
// 🌌 COSMIC DISCOVERY FRAMEWORK – VisualSystemRegistry (Phase 1)
// ----------------------------------------------------------------------------
// Central coordinator that samples shared UI signals (beat, scroll, tilt,
// perf-budget) once per animation-frame and dispatches the composed
// FrameContext to each registered IVisualSystem in priority order.
//
// NOTE: This registry purposefully lives **outside** the existing
// MasterAnimationCoordinator so that we can iterate without touching
// the mature scheduling logic.  In Phase 2 we may register the VSR itself
// as an AnimationSystem to MAC – for now it owns its own rAF loop.
//
// Author: Catppuccin StarryNight core team – June 2025
// ============================================================================

import { getScrollNode } from "@/utils/getScrollNode";
import { DeviceCapabilityDetector } from "./DeviceCapabilityDetector";
import { GlobalEventBus } from "./EventBus";
import { PerformanceAnalyzer } from "./PerformanceAnalyzer";

// ---------------------------------------------------------------------------
// Public Interfaces
// ---------------------------------------------------------------------------

export type VisualSystemPriority = "critical" | "normal" | "background";

export interface IVisualSystem {
  /** Unique descriptive name – used for debug & metrics. */
  systemName: string;
  /** Callback executed every animation tick. */
  onAnimate(deltaMs: number, context: FrameContext): void;
  /** Optional hook when the registry toggles performance modes. */
  onPerformanceModeChange?(mode: "performance" | "quality"): void;
  /** Cleanup hook – called when system is unregistered or registry destroyed. */
  destroy(): void;
}

export interface FrameContext {
  timestamp: number; // high-res time – performance.now()
  deltaMs: number; // time since previous tick (ms)
  performanceMode: "performance" | "quality";
  frameBudget: number; // current per-frame budget in ms
  // Shared cosmic signals (place-holders for now)
  beatIntensity?: number; // 0-1 – future integration with MusicSyncService
  scrollRatio?: number; // 0-1 – vertical scroll progress in current view
  tiltXY?: { x: number; y: number }; // device orientation normalised −1…1
}

interface SystemWrapper {
  system: IVisualSystem;
  priority: VisualSystemPriority;
  averageTime: number;
  lastExec: number;
}

// ---------------------------------------------------------------------------
// Helper constants
// ---------------------------------------------------------------------------
const PRIORITY_SORT: Record<VisualSystemPriority, number> = {
  critical: 0,
  normal: 1,
  background: 2,
};

const DEFAULT_FRAME_BUDGET_MS = 12; // fallback when PerformanceAnalyzer absent

// ---------------------------------------------------------------------------
// Main Class
// ---------------------------------------------------------------------------

export class VisualSystemRegistry {
  private systems: SystemWrapper[] = [];
  private rafHandle: number | null = null;
  private lastTimestamp = performance.now();
  private performanceMode: "performance" | "quality" = "quality";
  private frameBudgetMs: number;
  private orientation: { x: number; y: number } = { x: 0, y: 0 };
  private reduceMotion = false;

  // ---------------------------------------------------------------------
  // Event listener references for proper cleanup in destroy()
  // ---------------------------------------------------------------------
  private _orientationHandler: ((e: DeviceOrientationEvent) => void) | null =
    null;
  private _reduceMotionMQ: MediaQueryList | null = null;
  private _reduceMotionHandler:
    | ((e?: MediaQueryListEvent | MediaQueryList) => void)
    | null = null;
  private _reduceTransparencyMQ: MediaQueryList | null = null;
  private _reduceTransparencyHandler:
    | ((e?: MediaQueryListEvent | MediaQueryList) => void)
    | null = null;

  constructor(
    private perfAnalyzer: PerformanceAnalyzer | null,
    private deviceDetector: DeviceCapabilityDetector | null
  ) {
    // Decide initial budget based on perf analyzer if available.
    this.frameBudgetMs = this._resolveFrameBudget();

    this._setupOrientationListeners();
    this._setupReducedMotionListener();
    this._startLoop();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  public registerSystem(
    system: IVisualSystem,
    priority: VisualSystemPriority = "normal"
  ): void {
    // Prevent duplicates
    if (this.systems.find((s) => s.system === system)) return;

    this.systems.push({
      system,
      priority,
      averageTime: 0,
      lastExec: 0,
    });

    // Keep list sorted by priority weight whenever we add.
    this.systems.sort(
      (a, b) => PRIORITY_SORT[a.priority] - PRIORITY_SORT[b.priority]
    );
  }

  public unregisterSystem(system: IVisualSystem): void {
    const idx = this.systems.findIndex((s) => s.system === system);
    if (idx !== -1) {
      try {
        this.systems[idx]?.system.destroy();
      } catch (err) {
        console.error("[VisualSystemRegistry] Error during destroy:", err);
      }
      this.systems.splice(idx, 1);
    }
  }

  public destroy(): void {
    if (this.rafHandle) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    this.systems.forEach((wrap) => wrap.system.destroy());
    this.systems = [];

    // Clean up orientation listener
    if (this._orientationHandler) {
      try {
        window.removeEventListener(
          "deviceorientation",
          this._orientationHandler
        );
      } catch {
        /* ignore */
      }
      this._orientationHandler = null;
    }

    // Clean up reduced-motion media query listener
    if (this._reduceMotionMQ && this._reduceMotionHandler) {
      try {
        this._reduceMotionMQ.removeEventListener(
          "change",
          this._reduceMotionHandler
        );
      } catch {
        // Safari fallback
        // @ts-ignore – legacy API
        this._reduceMotionMQ.removeListener(this._reduceMotionHandler);
      }
      this._reduceMotionHandler = null;
      this._reduceMotionMQ = null;
    }

    // Clean up reduced-transparency media query listener
    if (this._reduceTransparencyMQ && this._reduceTransparencyHandler) {
      try {
        this._reduceTransparencyMQ.removeEventListener(
          "change",
          this._reduceTransparencyHandler
        );
      } catch {
        // Safari fallback
        // @ts-ignore – legacy API
        this._reduceTransparencyMQ.removeListener(
          this._reduceTransparencyHandler
        );
      }
      this._reduceTransparencyHandler = null;
      this._reduceTransparencyMQ = null;
    }
  }

  // -------------------------------------------------------------------------
  // Internal loop & helpers
  // -------------------------------------------------------------------------

  private _startLoop(): void {
    const loop = (timestamp: number) => {
      const deltaMs = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;

      // Skip animations entirely when reduced-motion requested.
      if (this.reduceMotion) {
        this.rafHandle = requestAnimationFrame(loop);
        return;
      }

      // Sample shared signals once per frame.
      const context: FrameContext = {
        timestamp,
        deltaMs,
        performanceMode: this.performanceMode,
        frameBudget: this.frameBudgetMs,
        beatIntensity: 0, // TODO – Phase 2 integration
        scrollRatio: this._getScrollRatio(),
        tiltXY: this.orientation,
      };

      // Broadcast for passive listeners
      GlobalEventBus.publish("cdf:frameContext", context);

      // Execute registered systems respecting priority & budget.
      let remaining = this.frameBudgetMs;
      for (const wrapper of this.systems) {
        if (remaining <= 0 && wrapper.priority === "background") break;

        const start = performance.now();
        try {
          wrapper.system.onAnimate(deltaMs, context);
        } catch (err) {
          console.error(
            `[VisualSystemRegistry] Error in system ${wrapper.system.systemName}:`,
            err
          );
        }
        const execTime = performance.now() - start;
        remaining -= execTime;
        wrapper.lastExec = execTime;
        wrapper.averageTime =
          wrapper.averageTime === 0
            ? execTime
            : wrapper.averageTime * 0.9 + execTime * 0.1;
      }

      // Re-evaluate perf mode every second.
      if (timestamp % 1000 < deltaMs) {
        this._evaluatePerformanceMode();
      }

      this.rafHandle = requestAnimationFrame(loop);
    };
    this.rafHandle = requestAnimationFrame(loop);
  }

  private _evaluatePerformanceMode(): void {
    if (!this.perfAnalyzer) return;

    // Rule 1 – FPS median over last 5 seconds
    const medianFPS = this.perfAnalyzer.getMedianFPS(5);

    // Rule 2 – device tier from detector
    const deviceLow =
      this.deviceDetector?.deviceCapabilities?.overall === "low";

    let newMode: "performance" | "quality";
    if (medianFPS < 48 || deviceLow) {
      newMode = "performance";
    } else if (medianFPS > 56 && !deviceLow) {
      newMode = "quality";
    } else {
      // Keep current to avoid flapping
      newMode = this.performanceMode;
    }

    if (newMode !== this.performanceMode) {
      this.performanceMode = newMode;
      this.frameBudgetMs = this._resolveFrameBudget();
      this.systems.forEach((w) =>
        w.system.onPerformanceModeChange?.(this.performanceMode)
      );
      GlobalEventBus.publish(
        "cdf:performanceModeChanged",
        this.performanceMode
      );
    }
  }

  private _resolveFrameBudget(): number {
    if (!this.perfAnalyzer) return DEFAULT_FRAME_BUDGET_MS;
    // Simple rule: quality → 16 ms, performance → 12 ms
    return this.performanceMode === "performance" ? 12 : 16;
  }

  private _getScrollRatio(): number {
    try {
      const node = getScrollNode();
      if (!node) return 0;
      const max = node.scrollHeight - node.clientHeight;
      return max > 0 ? node.scrollTop / max : 0;
    } catch {
      return 0;
    }
  }

  private _setupOrientationListeners(): void {
    if (typeof window === "undefined" || !window.addEventListener) return;
    // Skip if device orientation unavailable or permission required but not granted.
    this._orientationHandler = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e; // beta: x axis, gamma: y axis
      if (typeof beta === "number" && typeof gamma === "number") {
        // Normalise roughly to −1…1 range (assuming ±45° practical tilt)
        this.orientation.x = Math.max(-1, Math.min(1, gamma / 45));
        this.orientation.y = Math.max(-1, Math.min(1, beta / 45));
      }
    };

    try {
      window.addEventListener(
        "deviceorientation",
        this._orientationHandler,
        false
      );
    } catch {
      /* ignore – API not supported */
    }
  }

  private _setupReducedMotionListener(): void {
    if (typeof window === "undefined" || !window.matchMedia) return;
    this._reduceMotionMQ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    this._reduceMotionHandler = (e?: MediaQueryList | MediaQueryListEvent) => {
      this.reduceMotion = e
        ? (e as any).matches
        : this._reduceMotionMQ!.matches;
    };
    // Initial sync
    this._reduceMotionHandler?.();
    try {
      this._reduceMotionMQ.addEventListener(
        "change",
        this._reduceMotionHandler
      );
    } catch {
      // Safari fallback
      // @ts-ignore
      this._reduceMotionMQ.addListener(this._reduceMotionHandler);
    }

    // prefers-reduced-transparency (macOS) – treat same as motion for now
    this._reduceTransparencyMQ = window.matchMedia(
      "(prefers-reduced-transparency: reduce)"
    );
    this._reduceTransparencyHandler = (
      e?: MediaQueryList | MediaQueryListEvent
    ) => {
      if (e ? (e as any).matches : this._reduceTransparencyMQ!.matches) {
        this.reduceMotion = true;
      }
    };
    // Initial sync
    this._reduceTransparencyHandler?.();
    try {
      this._reduceTransparencyMQ.addEventListener(
        "change",
        this._reduceTransparencyHandler
      );
    } catch {
      // @ts-ignore
      this._reduceTransparencyMQ.addListener(this._reduceTransparencyHandler);
    }
  }
}
