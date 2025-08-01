import { GlobalEventBus } from "@/core/events/EventBus";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Year3000System } from "@/core/lifecycle/year3000System";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";
import { SidebarPerformanceCoordinator } from "./SidebarPerformanceCoordinator";

interface BeatPayload {
  intensity: number; // 0‒1 range
  timestamp?: number;
}

interface EnergyPayload {
  energy: number; // 0‒1 range
  timestamp?: number;
}

/**
 * RightSidebarConsciousnessSystem
 * Phase-2 implementation that animates the right-sidebar gradient variables in
 * real-time, staying within <1 ms / frame budget.
 * – Subscribes to GlobalEventBus topics: `music:beat`, `music:energy`
 * – Uses SidebarPerformanceCoordinator for optimized CSS variable batching
 * – Registers with MasterAnimationCoordinator when available; otherwise falls
 *   back to its own rAF loop.
 */
export class RightSidebarConsciousnessSystem extends BaseVisualSystem {
  private year3000System: Year3000System | null;
  private coordinator: SidebarPerformanceCoordinator;
  // Current → target state for smooth lerp
  private currentBeatIntensity = 0;
  private targetBeatIntensity = 0;
  private currentHueShift = 0; // degrees
  private targetHueShift = 0;
  // Lerp smoothing factors
  private readonly INTENSITY_LERP = 0.25;
  private readonly HUE_LERP = 0.05;
  // Loop control
  private fallbackRafId: number | null = null;
  private lastTimestamp = performance.now();
  // Unsubscribe functions
  private unsubBeat: (() => void) | null = null;
  private unsubEnergy: (() => void) | null = null;

  constructor(
    config: Year3000Config,
    utils: typeof Year3000Utilities,
    perf: PerformanceAnalyzer,
    musicSync: MusicSyncService,
    settings: SettingsManager,
    year3000System: Year3000System | null = null,
    coordinator?: SidebarPerformanceCoordinator
  ) {
    super(config, utils, perf, musicSync, settings);
    this.year3000System = year3000System;

    // Initialize coordinator (injected or singleton)
    this.coordinator =
      coordinator ||
      SidebarPerformanceCoordinator.getInstance({
        enableDebug: config.enableDebug,
        performanceAnalyzer: perf,
        onFlushComplete: () => {
          // Emit performance trace after each flush
          perf?.emitTrace?.(
            "[RightSidebarConsciousnessSystem] Coordinator flush completed"
          );
        },
      });
  }

  /* ------------------------------------------------------------------ */
  /* Initialization                                                     */
  /* ------------------------------------------------------------------ */
  override async _performSystemSpecificInitialization(): Promise<void> {
    // Subscribe to music events once system is active.
    this.unsubBeat = GlobalEventBus.subscribe<BeatPayload>(
      "music:beat",
      (payload) => this._handleBeat(payload)
    );
    this.unsubEnergy = GlobalEventBus.subscribe<EnergyPayload>(
      "music:energy",
      (payload) => this._handleEnergy(payload)
    );

    // Attempt MasterAnimationCoordinator registration
    this._tryRegisterWithMasterAnimation();
  }

  private _tryRegisterWithMasterAnimation() {
    if (
      this.year3000System?.registerAnimationSystem &&
      this.year3000System.enhancedMasterAnimationCoordinator
    ) {
      const ok = this.year3000System.registerAnimationSystem(
        "RightSidebarConsciousnessSystem",
        this,
        "background",
        60
      );
      if (ok) return; // Success – MAC will drive onAnimate()
    }
    // Fallback rAF loop
    this._startFallbackLoop();
  }

  /* ------------------------------------------------------------------ */
  /* Event Handlers                                                     */
  /* ------------------------------------------------------------------ */
  private _handleBeat({ intensity }: BeatPayload) {
    // Clamp & store as target
    this.targetBeatIntensity = Math.min(Math.max(intensity, 0), 1);
  }

  private _handleEnergy({ energy }: EnergyPayload) {
    // Map energy 0‒1 → hue 0‒120deg shift for subtle effect
    const deg = Math.round(energy * 120);
    this.targetHueShift = deg;
  }

  /* ------------------------------------------------------------------ */
  /* Animation Loop                                                     */
  /* ------------------------------------------------------------------ */
  public override onAnimate(deltaMs: number): void {
    this._tick(deltaMs);
  }

  private _startFallbackLoop() {
    const loop = (ts: number) => {
      const delta = ts - this.lastTimestamp;
      this.lastTimestamp = ts;
      this._tick(delta);
      this.fallbackRafId = requestAnimationFrame(loop);
    };
    this.fallbackRafId = requestAnimationFrame(loop);
  }

  private _tick(_deltaMs: number) {
    // Lerp current values towards targets
    this.currentBeatIntensity = this._lerp(
      this.currentBeatIntensity,
      this.targetBeatIntensity,
      this.INTENSITY_LERP
    );
    this.currentHueShift = this._lerp(
      this.currentHueShift,
      this.targetHueShift,
      this.HUE_LERP
    );

    // Push CSS variables
    this._queueCssVar("--sn-rs-beat-intensity", this.currentBeatIntensity);
    // Map beat → bloom alpha between 0.15-0.6 for extra liveliness
    const glowAlpha = (0.15 + this.currentBeatIntensity * 0.45).toFixed(3);
    this._queueCssVar("--sn-rs-glow-alpha", glowAlpha);
    this._queueCssVar("--sn-rs-hue-shift", `${this.currentHueShift}deg`);
  }

  private _queueCssVar(property: string, value: number | string) {
    // Route through the right sidebar coordinator for optimized batching
    this.coordinator.queueUpdate(property, String(value));
  }

  private _lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
  }

  /* ------------------------------------------------------------------ */
  /* Cleanup                                                            */
  /* ------------------------------------------------------------------ */
  override destroy() {
    super.destroy();
    this.unsubBeat?.();
    this.unsubEnergy?.();
    if (this.fallbackRafId) cancelAnimationFrame(this.fallbackRafId);

    // Don't destroy the coordinator here as it might be shared
    // The coordinator will be destroyed by the Year3000System
  }
}
