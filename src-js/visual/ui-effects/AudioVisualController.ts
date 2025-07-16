// ============================================================================
// 🎆 AUDIO VISUAL CONTROLLER – Phase 2 of Cosmic Mood Field
// ============================================================================
// Maps beat, genre, and scroll events to Nebula-related CSS custom properties.
// Keeps scripting cost low by batching variable writes via CSSVariableBatcher.
// ---------------------------------------------------------------------------
// BACKWARD-COMPATIBILITY CONTRACT:
//  • No existing public interfaces are modified.
//  • Controller registers via GlobalEventBus and can be safely omitted in
//    degraded builds.  If DeviceCapabilityDetector or Y3K system is missing,
//    it falls back to lightweight direct style writes.
// ---------------------------------------------------------------------------

import { NEBULA_INTENSITY_KEY } from "@/config/settingKeys";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { GlobalEventBus } from "@/core/events/EventBus";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Year3000System } from "@/core/lifecycle/year3000System";
import { UserGenreHistory } from "@/utils/platform/UserHistory";
import type { BeatPayload } from "@/types/systems";

// -----------------------------
// Payload typings (lightweight) – kept in-file to avoid tight coupling.
// -----------------------------

interface GenreChangePayload {
  genre: string;
  palette?: Record<string, string>;
}

interface ScrollPayload {
  velocity?: number; // px / frame (can be negative)
  direction?: "up" | "down";
}

// Median helper
function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[mid] ?? 0;
  }

  const lower = sorted[mid - 1] ?? 0;
  const upper = sorted[mid] ?? 0;
  return (lower + upper) / 2;
}

export class AudioVisualController {
  // TODO: Expand settings integration in Phase 4 (intensity toggle)
  private batcher: CSSVariableBatcher;
  private perf: PerformanceAnalyzer | null;
  private year3000System: Year3000System | null;
  private unsubscribers: (() => void)[] = [];
  private frameDurations: number[] = [];
  private static readonly FRAME_HISTORY = 120; // rolling window for medians
  private enabled = true;
  private intensitySetting: "disabled" | "minimal" | "balanced" | "intense" =
    "balanced";
  private intensityFactor = 1;
  private genreHistory = new UserGenreHistory();
  private activeGlowTimeout: ReturnType<typeof setTimeout> | null = null;
  private interactionOffHandler: (() => void) | null = null;

  constructor(
    y3k: Year3000System | null = null,
    batcher?: CSSVariableBatcher,
    perf?: PerformanceAnalyzer
  ) {
    this.year3000System = y3k;

    // Prefer caller-supplied batcher, else shared instance from Year3000System,
    // else fall back to an internal self-owned batcher.
    if (batcher) {
      this.batcher = batcher;
    } else {
      const sharedBatcher = y3k?.cssVariableBatcher;
      if (sharedBatcher) {
        this.batcher = sharedBatcher;
      } else {
        this.batcher = new CSSVariableBatcher({
          batchIntervalMs: 16,
          maxBatchSize: 40,
        });
      }
    }

    this.perf = perf ? perf : y3k?.performanceAnalyzer ?? null;

    // -------------------- Capability & Preference Checks --------------------
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const capabilityOverall =
      y3k?.deviceCapabilityDetector?.deviceCapabilities?.overall;

    // Read user setting if available
    const settings = y3k?.settingsManager;
    if (settings) {
      this.intensitySetting =
        (settings.get as any)(NEBULA_INTENSITY_KEY) ?? "balanced";
    }

    switch (this.intensitySetting) {
      case "disabled":
        this.enabled = false;
        break;
      case "minimal":
        this.intensityFactor = 0.6;
        break;
      case "balanced":
        this.intensityFactor = 1;
        break;
      case "intense":
        this.intensityFactor = 1.4;
        break;
    }

    if (prefersReducedMotion || capabilityOverall === "low") {
      this.enabled = false;
    }

    if (this.enabled) {
      this._subscribe();
    } else {
      // Ensure nebula vars stay neutral even when disabled
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          "--sn-nebula-beat-intensity",
          "0"
        );
      }
    }
  }

  private _subscribe(): void {
    this.unsubscribers.push(
      GlobalEventBus.subscribe<BeatPayload>("music:beat", (p) =>
        this._handleBeat(p)
      ),
      GlobalEventBus.subscribe<GenreChangePayload>("music:genre-change", (p) =>
        this._handleGenreChange(p)
      ),
      GlobalEventBus.subscribe<ScrollPayload>("user:scroll", (p) =>
        this._handleScroll(p)
      )
    );
  }

  // ---------------------------------------------------------------------------
  // Event Handlers – all lightweight calculations to stay under 2 ms median.
  // ---------------------------------------------------------------------------

  private _handleBeat(payload: BeatPayload): void {
    const t0 = performance.now();

    // Map energy (0-1) → beat intensity multiplier (0.8-1.4 range)
    const safeEnergy =
      typeof payload.energy === "number" ? payload.energy : 0.5;
    const intensity =
      (0.8 + Math.min(Math.max(safeEnergy, 0), 1) * 0.6) * this.intensityFactor;

    this._queueVar("--sn-nebula-beat-intensity", intensity.toFixed(3));

    // 🎨 Adaptive Chromatic Aberration – map beat energy to strength (0–0.6)
    const aberrationStrength = (safeEnergy * 0.6).toFixed(3);
    this._queueVar("--sn-nebula-aberration-strength", aberrationStrength);

    this._recordDuration(t0);
  }

  private _handleGenreChange(payload: GenreChangePayload): void {
    const t0 = performance.now();

    // Discovery cue only for new genres
    if (this.genreHistory.hasSeen(payload.genre)) {
      return;
    }

    this.genreHistory.markSeen(payload.genre);

    const cueOpacity = 0.18 * this.intensityFactor; // slightly stronger than phase2
    this._queueVar("--sn-nebula-layer-0-opacity", cueOpacity.toFixed(3));

    const clearCue = () => {
      // Clear timeout from either system
      if (this.year3000System?.timerConsolidationSystem) {
        this.year3000System.timerConsolidationSystem.unregisterConsolidatedTimer("AudioVisualController-glowTimeout");
      } else if (this.activeGlowTimeout) {
        clearTimeout(this.activeGlowTimeout);
        this.activeGlowTimeout = null;
      }
      this._queueVar("--sn-nebula-layer-0-opacity", "0.05");
      if (this.interactionOffHandler) {
        document.removeEventListener("pointerdown", this.interactionOffHandler);
        document.removeEventListener("keydown", this.interactionOffHandler);
        this.interactionOffHandler = null;
      }
    };

    // Auto-clear after 4 seconds
    // Use TimerConsolidationSystem if available, otherwise fall back to setTimeout
    if (this.year3000System?.timerConsolidationSystem) {
      this.year3000System.timerConsolidationSystem.registerConsolidatedTimer(
        "AudioVisualController-glowTimeout",
        clearCue,
        4000,
        "normal"
      );
      this.activeGlowTimeout = null; // Timer is managed by consolidation system
    } else {
      this.activeGlowTimeout = setTimeout(clearCue, 4000);
    }

    // Also clear on first user interaction
    this.interactionOffHandler = () => clearCue();
    document.addEventListener("pointerdown", this.interactionOffHandler, {
      once: true,
    });
    document.addEventListener("keydown", this.interactionOffHandler, {
      once: true,
    });

    // Trigger easing animation for smoother gradient stops (Phase 2)
    this._queueVar("--sn-nebula-ease-t", "1");

    this._recordDuration(t0);
  }

  private _handleScroll(payload: ScrollPayload): void {
    const t0 = performance.now();

    // Map scroll velocity magnitude → blur scale tweak on inner layers.
    const safeVel = typeof payload.velocity === "number" ? payload.velocity : 0;
    const vel = Math.min(Math.abs(safeVel), 50); // cap extremes
    const blurBoost = (vel / 50) * 2 * this.intensityFactor; // scaled

    this._queueVar(
      "--sn-nebula-layer-3-blur",
      `calc(var(--sn-depth-layer-3-blur) + ${blurBoost.toFixed(2)}px)`
    );

    // [Phase 1] Map scroll velocity (px/frame) → noise vertical scale.
    // Base scale is 150%; scroll up should slightly contract (down to 140%),
    // scroll down can expand up to 200%.  Values are clamped to avoid
    // excessive GPU cost.
    const baseScaleY = 150; // percentage
    let clampedVel = Math.max(Math.min(payload.velocity ?? 0, 50), -50); // -50..50
    const deltaScale = (clampedVel / 50) * 50; // -50..50
    const noiseScale = Math.max(140, Math.min(200, baseScaleY + deltaScale));
    // TODO(Phase-2): Profile GPU cost of color-dodge + large textures at >180%.
    this._queueVar("--sn-nebula-noise-scale-y", `${noiseScale.toFixed(1)}%`);

    this._recordDuration(t0);
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  private _queueVar(prop: string, value: string): void {
    if (!this.enabled) return;
    if (this.year3000System) {
      this.year3000System.queueCSSVariableUpdate(prop, value);
    } else {
      this.batcher.queueCSSVariableUpdate(prop, value);
    }
  }

  private _recordDuration(start: number): void {
    const duration = performance.now() - start;
    this.frameDurations.push(duration);
    if (this.frameDurations.length > AudioVisualController.FRAME_HISTORY) {
      this.frameDurations.shift();
    }

    if (this.frameDurations.length === AudioVisualController.FRAME_HISTORY) {
      const med = median(this.frameDurations);
      if (med > 2) {
        console.warn(
          `[AudioVisualController] Median scripting cost ${med.toFixed(
            2
          )} ms exceeds 2 ms budget.`
        );

        // 🚦 Performance guard: fallback blend mode to 'screen' to reduce GPU cost
        this._queueVar("--sn-nebula-blend-mode", "screen");
      }
    }

    // Emit to PerformanceAnalyzer bucket every ~60 fps
    this.perf?.shouldUpdate("nebulaCtr", 1000) &&
      this.perf?.endTiming("AudioVisualController", start);
  }

  public destroy(): void {
    // Unregister timer from consolidation system
    if (this.year3000System?.timerConsolidationSystem) {
      this.year3000System.timerConsolidationSystem.unregisterConsolidatedTimer("AudioVisualController-glowTimeout");
    }
    
    // Clear active timeout (fallback)
    if (this.activeGlowTimeout) {
      clearTimeout(this.activeGlowTimeout);
      this.activeGlowTimeout = null;
    }
    
    // Remove event listeners
    if (this.interactionOffHandler) {
      document.removeEventListener("pointerdown", this.interactionOffHandler);
      document.removeEventListener("keydown", this.interactionOffHandler);
      this.interactionOffHandler = null;
    }
    
    this.unsubscribers.forEach((u) => u());
    this.unsubscribers = [];
  }
}

// ---------------------------------------------------------------------------
// Convenience initializer – called by theme.entry.ts
// ---------------------------------------------------------------------------

export function initializeAudioVisualController(
  y3k: Year3000System | null = null
): AudioVisualController {
  // Singleton guard for hot-reloads.
  const g = globalThis as any;
  if (g.__SN_audioVisualController)
    return g.__SN_audioVisualController as AudioVisualController;

  const instance = new AudioVisualController(y3k);
  g.__SN_audioVisualController = instance;
  return instance;
}

// Backward compatibility aliases - TODO: Remove in future version
export const NebulaController = AudioVisualController;
export const initializeNebulaController = initializeAudioVisualController;
