import { HARMONIC_MODES } from "@/config/globalConfig";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { Year3000System } from "@/core/year3000System";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
import { echoPool } from "@/utils/echoPool";
import * as Year3000Utilities from "@/utils/Year3000Utilities";
import { BaseVisualSystem } from "../BaseVisualSystem";

// Interface for the music analysis data shape
interface ProcessedMusicData {
  segmentTransitionConfidence?: number;
  visualIntensity: number;
  energy: number;
  valence: number;
}

// Interface for the materialization state
interface MaterializationState {
  imminence: number;
  clarity: number;
  targetElement: HTMLElement | null;
}

// Interface for the artistic mode configuration
interface ModeConfig {
  enabled?: boolean;
  animations?: boolean;
  intensity?: number;
  systemEnabled: boolean;
  materializationAnimationsEnabled: boolean;
  intensityMultiplier: number;
}

// YEAR 3000 PREDICTIVE MATERIALIZATION SYSTEM
export class PredictiveMaterializationSystem extends BaseVisualSystem {
  // Time tracking for resonance triggers
  private _resonanceCooldownMs = 1200;
  private _timeSinceLastResonance = 0;

  // TODO[Y3K-PH3]: Allow external callers (e.g., Navigation system) to set the element that receives resonance
  public setTargetElement(el: HTMLElement | null): void {
    this.materializationState.targetElement = el;
  }

  // Frame-level animation hook used by MasterAnimationCoordinator
  public onAnimate(deltaMs: number): void {
    // Skip if system disabled or no target element
    if (!this.materializationState.targetElement) return;

    this._timeSinceLastResonance += deltaMs;

    // Basic heuristic: fire resonance when imminence + clarity exceed threshold and cooldown elapsed
    const imminence = this.materializationState.imminence;
    const clarity = this.materializationState.clarity;

    const threshold = 0.6; // later tweakable via config

    if (
      imminence * 0.7 + clarity * 0.3 > threshold &&
      this._timeSinceLastResonance >= this._resonanceCooldownMs
    ) {
      this._maybeTriggerResonance();
      this._timeSinceLastResonance = 0;
    }
  }

  private _maybeTriggerResonance(): void {
    const target = this.materializationState.targetElement;
    if (!target) return;

    // Ensure class isn't already active to avoid stacking animations
    if (target.classList.contains("sn-materialize-resonance")) return;

    target.classList.add(
      "sn-materialize-resonance",
      "sn-predict-materialize-glow"
    );

    const handleEnd = () => {
      target.classList.remove("sn-materialize-resonance");
      target.removeEventListener("animationend", handleEnd);
    };
    target.addEventListener("animationend", handleEnd, { once: true });

    // === Phase 1: Spawn mega echo when imminence high ===
    if (
      this.materializationState.imminence >= 0.7 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const tintHue = (this.materializationState.clarity ?? 0.5) * 360;
      echoPool.spawn(target, {
        tintHue,
        radius: 160, // Mega ripple radius (2× base ~80)
        intensity: 0.4,
      });
    }

    if (this.config?.enableDebug) {
      console.debug(
        `[${this.systemName}] Materialize resonance triggered on`,
        target,
        `imminence=${this.materializationState.imminence.toFixed(
          2
        )}, clarity=${this.materializationState.clarity.toFixed(2)}`
      );
    }
  }

  private materializationState: MaterializationState;
  private rootElement: HTMLElement;
  private modeConfig?: Partial<ModeConfig>;
  private materializationIntensity: number = 1.0;
  private materializationSpeed: number = 1.0;

  constructor(
    config: Year3000Config,
    utils: typeof Year3000Utilities,
    performanceMonitor: PerformanceAnalyzer | null,
    musicSyncService: MusicSyncService | null,
    settingsManager: SettingsManager | null,
    year3000System: Year3000System | null = null
  ) {
    super(
      config,
      utils,
      performanceMonitor ?? new PerformanceAnalyzer(),
      musicSyncService ??
        new MusicSyncService({
          YEAR3000_CONFIG: config,
          Year3000Utilities: utils,
          colorHarmonyEngine: null,
          settingsManager: settingsManager,
        }),
      settingsManager ?? new SettingsManager(config, HARMONIC_MODES, utils)
    );

    this.systemName = "PredictiveMaterializationSystem";
    this.materializationState = {
      imminence: 0,
      clarity: 0,
      targetElement: null,
    };
    this.rootElement = this.utils.getRootStyle();

    if (this.config?.enableDebug) {
      console.log(`[${this.systemName} Constructor] Initialized.`);
    }
  }

  public async initialize(): Promise<void> {
    await super.initialize();
    this._setInitialMaterializationCSS();
    if (this.config?.enableDebug) {
      console.log(
        `[${this.systemName}] Initialized and initial CSS variables set.`
      );
    }
  }

  private _setInitialMaterializationCSS(): void {
    const applyCss = (prop: string, val: string) => {
      try {
        if (
          (this as any).year3000System &&
          (this as any).year3000System.queueCSSVariableUpdate
        ) {
          (this as any).year3000System.queueCSSVariableUpdate(
            prop,
            val,
            this.rootElement
          );
        } else {
          this.rootElement.style.setProperty(prop, val);
        }
      } catch (e: any) {
        if (this.config?.enableDebug) {
          console.warn(
            `[${this.systemName}] Error setting CSS variable ${prop}:`,
            e.message
          );
        }
      }
    };
    applyCss("--sn-materialize-imminence", "0");
    applyCss("--sn-materialize-clarity", "0");
  }

  public updateFromMusicAnalysis(processedMusicData: ProcessedMusicData): void {
    if (!this.initialized || !processedMusicData) return;
    super.updateFromMusicAnalysis(processedMusicData);

    const { segmentTransitionConfidence, visualIntensity, energy, valence } =
      processedMusicData;

    let targetImminence =
      (segmentTransitionConfidence || 0) * 0.6 +
      energy * 0.3 +
      visualIntensity * 0.1;

    let targetClarity = valence * 0.5 + visualIntensity * 0.3 + energy * 0.2;

    this.materializationState.imminence = this.utils.lerpSmooth(
      this.materializationState.imminence,
      targetImminence,
      0.1,
      0.2
    );
    this.materializationState.clarity = this.utils.lerpSmooth(
      this.materializationState.clarity,
      targetClarity,
      0.1,
      0.25
    );

    this.materializationState.imminence = Math.max(
      0,
      Math.min(1, this.materializationState.imminence)
    );
    this.materializationState.clarity = Math.max(
      0,
      Math.min(1, this.materializationState.clarity)
    );

    const applyCss = (prop: string, val: string) => {
      try {
        if (
          (this as any).year3000System &&
          (this as any).year3000System.queueCSSVariableUpdate
        ) {
          (this as any).year3000System.queueCSSVariableUpdate(
            prop,
            val,
            this.rootElement
          );
        } else {
          this.rootElement.style.setProperty(prop, val);
        }
      } catch (e: any) {
        if (this.config?.enableDebug) {
          console.warn(
            `[${this.systemName}] Error setting CSS variable ${prop} during update:`,
            e.message
          );
        }
      }
    };

    applyCss(
      "--sn-materialize-imminence",
      `${this.materializationState.imminence.toFixed(3)}`
    );
    applyCss(
      "--sn-materialize-clarity",
      `${this.materializationState.clarity.toFixed(3)}`
    );
  }

  public updateModeConfiguration(modeConfig: Partial<ModeConfig>): void {
    if (!modeConfig) return;

    const { enabled, animations, intensity } = modeConfig;

    if (this.config?.enableDebug) {
      console.log(
        `🎨 [${this.systemName}] Updating mode configuration:`,
        modeConfig
      );
    }

    this.modeConfig = {
      ...this.modeConfig,
      systemEnabled: enabled !== false,
      materializationAnimationsEnabled: !!animations,
      intensityMultiplier: intensity || 1.0,
    };

    this.updateMaterializationForMode();
  }

  public updateMaterializationForMode(): void {
    if (!this.modeConfig) return;

    const baseIntensity = this.modeConfig.intensityMultiplier || 1.0;
    this.materializationIntensity = baseIntensity;
    this.materializationSpeed = this.modeConfig.materializationAnimationsEnabled
      ? baseIntensity * 1.3
      : baseIntensity * 0.8;

    if (this.config?.enableDebug) {
      console.log(
        `✨ [${this.systemName}] Updated materialization - Intensity: ${this.materializationIntensity}, Speed: ${this.materializationSpeed}`
      );
    }
  }

  public destroy(): void {
    super.destroy();
    if (this.config?.enableDebug) {
      console.log(`[${this.systemName}] Destroyed and cleaned up.`);
    }
  }

  // TODO[Y3K-PH2]: Public helper to trigger anticipatory shimmer on a target element.
  // This seeds two-way integration with BehavioralPredictionEngine while keeping
  // backward-compatibility (calling code can still add the CSS class directly).
  public triggerAnticipatoryWarmth(
    target: HTMLElement,
    {
      hue = 0,
      intensity = 0.18,
      durationMs = 1200,
    }: { hue?: number; intensity?: number; durationMs?: number } = {}
  ): void {
    if (!target) return;

    // Clamp intensity to [0,0.3] so we respect accessibility caps.
    const clamped = Math.max(0, Math.min(0.3, intensity));

    target.style.setProperty("--sn-anticipatory-intensity", clamped.toFixed(3));
    target.style.setProperty("--sn-anticipatory-hue", `${hue.toFixed(1)}deg`);

    target.classList.add("sn-anticipatory-warmth");

    // Auto-cleanup to avoid lingering classes/vars
    const handleEnd = () => {
      target.classList.remove("sn-anticipatory-warmth");
      target.removeEventListener("animationend", handleEnd);
    };
    target.addEventListener("animationend", handleEnd);

    if (this.config?.enableDebug) {
      console.debug(
        `[${this.systemName}] Anticipatory shimmer fired (hue=${hue}, intensity=${clamped}) on`,
        target
      );
    }
  }
}
