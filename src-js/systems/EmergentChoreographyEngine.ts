import { GlobalEventBus } from "@/core/EventBus";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { SettingsManager } from "@/managers/SettingsManager";
import { temporalMemoryService } from "@/services/TemporalMemoryService";
import type { MultiplierProfile, Year3000Config } from "@/types/models";
import type { PersonalAestheticSignature } from "@/types/signature";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Year3000Utilities from "@/utils/Year3000Utilities";
import { BaseVisualSystem } from "./BaseVisualSystem";

export class EmergentChoreographyEngine
  extends BaseVisualSystem
  implements IManagedSystem
{
  private eventSubscriptions: (() => void)[] = [];
  private signature: PersonalAestheticSignature | null = null;
  private saveInterval: NodeJS.Timeout | null = null;
  private currentMultipliers: MultiplierProfile;
  private currentBpm: number = 120;
  private currentIntensity: number = 0.5;

  constructor(
    config?: Year3000Config,
    utils?: typeof Year3000Utilities,
    performanceMonitor?: PerformanceAnalyzer,
    settingsManager?: SettingsManager
  ) {
    super(
      config,
      utils || Year3000Utilities,
      performanceMonitor!,
      null,
      settingsManager || null
    );
    this.systemName = "EmergentChoreographyEngine";
    this.currentMultipliers = this.config.cosmicMultipliers; // Start with defaults
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    if (!GlobalEventBus) {
      return { ok: false, details: "GlobalEventBus is not available." };
    }
    return {
      ok: true,
      details: "Emergent Choreography Engine is operational.",
    };
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing...`);
    }

    this.signature = await temporalMemoryService.getSignature();
    this.registerEventListeners();

    // Save signature every 30 seconds
    this.saveInterval = setInterval(() => {
      if (this.signature) {
        temporalMemoryService.saveSignature(this.signature);
      }
    }, 30000);

    this.initialized = true;
  }

  private registerEventListeners(): void {
    const beatFrameSub = GlobalEventBus.subscribe("beat/frame", (payload) =>
      this.handleBeatFrame(payload)
    );
    const harmonyFrameSub = GlobalEventBus.subscribe(
      "colorharmony/frame",
      (payload) => this.handleHarmonyFrame(payload)
    );
    const bpmSub = GlobalEventBus.subscribe(
      "beat/bpm",
      (payload: { bpm: number }) => {
        this.currentBpm = payload.bpm;
      }
    );
    const intensitySub = GlobalEventBus.subscribe(
      "beat/intensity",
      (payload: { intensity: number }) => {
        this.currentIntensity = payload.intensity;
      }
    );

    this.eventSubscriptions.push(
      beatFrameSub,
      harmonyFrameSub,
      bpmSub,
      intensitySub
    );
  }

  private handleBeatFrame(payload: any): void {
    if (!this.signature) return;
    // TODO: Process beat data and update signature in Phase 3
    this.signature.lastModified = Date.now();
  }

  private handleHarmonyFrame(payload: any): void {
    if (!this.signature) return;
    // TODO: Process color data and update signature in Phase 3
    const { kineticState } = payload;
    // Example of a simple update:
    // this.signature.colorMemories.set(...)
    this.signature.lastModified = Date.now();
  }

  private async _updateEvolutionaryTrajectory(): Promise<void> {
    if (!this.signature) return;

    const trends = await temporalMemoryService.getSignatureTrends(
      this.signature
    );
    if (!trends) return;

    const { avgEnergy, avgValence } = trends;

    // Example logic: Higher average energy might increase exploration
    const explorationFactor = 0.5 + (avgEnergy - 0.5) * 0.2; // modest influence
    this.signature.evolutionaryTrajectory.explorationFactor = Math.max(
      0.1,
      Math.min(0.9, explorationFactor)
    );

    // Example logic: More extreme valence (positive or negative) might increase adaptability
    const adaptability = 0.5 + (Math.abs(avgValence) - 0.2) * 0.3;
    this.signature.evolutionaryTrajectory.adaptability = Math.max(
      0.1,
      Math.min(0.9, adaptability)
    );

    this.signature.evolutionaryTrajectory.lastUpdate = Date.now();
  }

  private _calculateVisualPulse(deltaMs: number) {
    if (!this.initialized) return null;

    const beatInterval = 60000 / this.currentBpm; // ms per beat
    const phase = (performance.now() % beatInterval) / beatInterval; // 0-1 cycle

    // Example: Hue shift anticipates the beat. Peaks just before the beat hits.
    const hueShift =
      Math.sin(phase * 2 * Math.PI + Math.PI / 2) * 15 * this.currentIntensity;

    return {
      timestamp: performance.now(),
      bpm: this.currentBpm,
      intensity: this.currentIntensity,
      phase,
      hueShift,
    };
  }

  private _calculateAdaptiveCoefficients(): void {
    if (!this.signature) return;

    // TODO: Implement more sophisticated logic based on signature history
    const { adaptability, explorationFactor } =
      this.signature.evolutionaryTrajectory;

    // Example: Adaptability influences how quickly kinetic intensity responds
    const kineticIntensity = 0.5 + adaptability * 0.5; // Range [0.5, 1.0]

    // Example: Exploration factor influences the visual intensity
    const visualIntensityBase = 0.8 + explorationFactor * 0.4; // Range [0.8, 1.2]

    this.currentMultipliers = {
      ...this.config.cosmicMultipliers,
      kineticIntensity,
      visualIntensityBase,
    };

    GlobalEventBus.publish(
      "emergent/multipliersUpdated",
      this.currentMultipliers
    );
  }

  public getCurrentMultipliers(): MultiplierProfile {
    return this.currentMultipliers;
  }

  public updateAnimation(deltaTime: number): void {
    this.onTick(deltaTime);
  }

  public onTick(deltaMs: number): void {
    if (!this.initialized) return;

    // The main loop for the choreography engine
    this._calculateAdaptiveCoefficients(); // Update multipliers each frame

    // Periodically update the core learning parameters
    if (
      this.signature &&
      Date.now() - this.signature.evolutionaryTrajectory.lastUpdate > 60000
    ) {
      // Every minute
      this._updateEvolutionaryTrajectory();
    }

    const visualPulse = this._calculateVisualPulse(deltaMs);
    if (visualPulse) {
      GlobalEventBus.publish("visual/pulse", visualPulse);
    }

    const emergentPayload = {
      timestamp: performance.now(),
      deltaMs,
      // ...other emergent data to be calculated in later phases
    };
    GlobalEventBus.publish("emergent/frame", emergentPayload);
  }

  public destroy(): void {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying...`);
    }
    // Save signature one last time on destroy
    if (this.signature) {
      temporalMemoryService.saveSignature(this.signature);
    }
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }

    this.eventSubscriptions.forEach((unsubscribe) => unsubscribe());
    this.eventSubscriptions = [];
    super.destroy?.();
  }
}
