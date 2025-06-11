import { HARMONIC_MODES } from "@/config/globalConfig";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { Year3000System } from "@/core/year3000System";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type { Year3000Config } from "@/types/models";
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
  // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
  public onAnimate(deltaMs: number): void {
    // Basic implementation - can be enhanced in future phases
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
    const safeSetProperty = (name: string, value: string) => {
      try {
        this.rootElement.style.setProperty(name, value);
      } catch (e: any) {
        if (this.config?.enableDebug) {
          console.warn(
            `[${this.systemName}] Error setting CSS variable ${name}:`,
            e.message
          );
        }
      }
    };
    safeSetProperty("--sn-materialize-imminence", "0");
    safeSetProperty("--sn-materialize-clarity", "0");
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

    const safeSetProperty = (name: string, value: string) => {
      try {
        this.rootElement.style.setProperty(name, value);
      } catch (e: any) {
        if (this.config?.enableDebug) {
          console.warn(
            `[${this.systemName}] Error setting CSS variable ${name} during update:`,
            e.message
          );
        }
      }
    };

    safeSetProperty(
      "--sn-materialize-imminence",
      `${this.materializationState.imminence.toFixed(3)}`
    );
    safeSetProperty(
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
}
