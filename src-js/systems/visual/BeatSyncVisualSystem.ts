import { GlobalEventBus } from "@/core/EventBus";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { SettingsManager } from "@/managers/SettingsManager";
import { MusicSyncService } from "@/services/MusicSyncService";
import type {
  BeatFlashIntensity,
  BeatSyncModeConfig,
  HarmonicData,
  HarmonicSyncState,
} from "@/types/beatSync";
import type { Year3000Config } from "@/types/models";
import * as Year3000Utilities from "@/utils/Year3000Utilities";
import { Year3000System } from "../../core/year3000System";
import { sample as sampleNoise } from "../../utils/NoiseField";
import { BaseVisualSystem } from "../BaseVisualSystem";

interface AudioSegment {
  start: number;
  duration: number;
  loudness_max: number;
}

// YEAR 3000 BEATSYNC VISUAL SYSTEM
export class BeatSyncVisualSystem extends BaseVisualSystem {
  private year3000System: Year3000System | null;
  private beatFlashElement: HTMLElement | null = null;
  private crystallineOverlayElement: HTMLElement | null = null;
  public animationFrameId: number | null = null;
  private lastBeatTime: number = 0;
  private beatIntensity: number = 0;
  // === Temporal Echo Pool (shared logic with DataGlyphSystem) ===
  private echoPool: HTMLElement[] = [];
  private currentEchoCount: number = 0;
  private static readonly BASE_MAX_ECHOES = 6;
  private _elementsWithActiveEcho: WeakSet<HTMLElement> = new WeakSet();

  private currentBPM: number = 120;
  private enhancedBPM: number = 120;
  private beatInterval: number = 60000 / 120;
  private nextBeatTime: number = 0;
  private beatTimer: NodeJS.Timeout | null = null;
  private trackStartTime: number = Date.now();
  private isSyncActive: boolean = false;
  private beatCount: number = 0;

  private currentRhythmPhase: number = 0;
  private lastAnimationTime: number = performance.now();
  private performanceMetrics: {
    animationUpdates: number;
    cssVariableUpdates: number;
    memoryStartTime: number;
    memoryStartSize: number;
  };

  public isAnimating: boolean = false;

  private lastMemoryUsage: number = 0;
  private frameCount: number = 0;
  private performanceStartTime: number = Date.now();
  private errorCount: number = 0;

  private _performanceMode: boolean = false;
  private _reducedQualityMode: boolean = false;

  public currentEnergy: number = 0.5;
  public processedMusicData: any;
  public modeConfig: BeatSyncModeConfig | null = null;
  private harmonicSync: HarmonicSyncState | null = null;
  private harmonicSyncInitialized: boolean = false;
  private harmonicLoopId: number | null = null;
  private currentHarmonicData: HarmonicData | null = null;
  private beatFlashIntensity: BeatFlashIntensity | null = null;

  private analysis: any = null;
  private rafId: number = 0;
  private smoothedLoudness: number = 0;
  private readonly SMOOTHING_FACTOR: number = 0.1;

  constructor(
    config: Year3000Config,
    utils: typeof Year3000Utilities,
    performanceMonitor: PerformanceAnalyzer,
    musicSyncService: MusicSyncService,
    settingsManager: SettingsManager,
    year3000System: Year3000System | null = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);

    this.year3000System = year3000System;

    this.performanceMetrics = {
      animationUpdates: 0,
      cssVariableUpdates: 0,
      memoryStartTime: performance.now(),
      memoryStartSize: this._getMemoryUsage(),
    };

    const healthMonitor = this.utils.getHealthMonitor();
    if (healthMonitor) {
      healthMonitor.registerSystem("BeatSyncVisualSystem", this);
    }

    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName} Constructor] Initialized with Master Animation Coordinator support.`
      );
    }

    this.onSongChange = this.onSongChange.bind(this);
    this.update = this.update.bind(this);
  }

  private _getMemoryUsage(): number {
    if (typeof performance !== "undefined" && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  async initialize() {
    await super.initialize();
    this._createBeatFlashElement();
    this._createCrystallineOverlay();
    this._startAnimationLoop();
    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Initialized and animation loop started.`
      );
    }
  }

  private _createBeatFlashElement() {
    this.beatFlashElement = document.createElement("div");
    this.beatFlashElement.id = "sn-beat-flash";
    this.beatFlashElement.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      background-color: rgba(255, 255, 255, 0);
      opacity: 0;
      z-index: 2;
      transition: background-color 150ms ease-out, opacity 250ms ease-out;
    `;
    document.body.appendChild(this.beatFlashElement);
  }

  private _createCrystallineOverlay() {
    this.crystallineOverlayElement = document.createElement("div");
    this.crystallineOverlayElement.className = "sn-crystalline-overlay";

    const crystals = ["a", "b", "c"];
    crystals.forEach((type) => {
      const crystalEl = document.createElement("div");
      crystalEl.className = `sn-crystal sn-crystal--${type}`;
      this.crystallineOverlayElement?.appendChild(crystalEl);
    });

    document.body.appendChild(this.crystallineOverlayElement);
  }

  private _startAnimationLoop() {
    // Try to register with Year3000System's MasterAnimationCoordinator first
    if (
      this.year3000System &&
      typeof this.year3000System.registerAnimationSystem === "function"
    ) {
      const registered = this.year3000System.registerAnimationSystem(
        "BeatSyncVisualSystem",
        this,
        "critical",
        60
      );

      if (registered) {
        if (this.config?.enableDebug) {
          console.log(
            `🎬 [${this.systemName}] Successfully registered with Master Animation Coordinator`
          );
        }
        return; // Don't start fallback loop if successfully registered
      }
    }

    // Fallback to individual animation loop only if registration failed
    console.warn(
      `[${this.systemName}] Master Animation Coordinator not available, using fallback loop`
    );
    this._startFallbackAnimationLoop();
  }

  private _stopAnimationLoop() {
    if (
      this.year3000System &&
      (this.year3000System as any).unregisterAnimationSystem
    ) {
      (this.year3000System as any).unregisterAnimationSystem(
        "BeatSyncVisualSystem"
      );

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Unregistered from Master Animation Coordinator`
        );
      }
    } else {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }

  public onAnimate(deltaMs: number): void {
    this.updateAnimation(performance.now(), deltaMs);
  }

  public updateAnimation(timestamp: number, deltaTime: number) {
    if (!this.isAnimating || !this.initialized) return;

    const frameStart = performance.now();
    this.frameCount++;

    try {
      const currentTime = performance.now();
      const actualDeltaTime = currentTime - this.lastAnimationTime;
      this.lastAnimationTime = currentTime;

      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      const processedEnergy = latestMusicData?.processedEnergy || 0.5;
      const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1.0;

      this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
        currentTime,
        animationSpeedFactor
      );

      const breathingScale = Year3000Utilities.calculateBreathingScale(
        this.currentRhythmPhase,
        processedEnergy
      );

      this._updateCSSVariables(
        breathingScale,
        this.currentRhythmPhase,
        actualDeltaTime,
        processedEnergy
      );

      if (this.isSyncActive && this.enhancedBPM > 0) {
        const now = Date.now();
        if (now >= this.nextBeatTime) {
          this._triggerBeat(now);
          this._scheduleNextBeat();
        }
      }

      if (this.beatIntensity > 0 && this.beatFlashElement) {
        this.beatIntensity -= 0.025; // Fade speed
        if (this.beatIntensity < 0) this.beatIntensity = 0;

        const rootStyle = Year3000Utilities.getRootStyle();
        const accentRgb =
          rootStyle.style.getPropertyValue("--sn-gradient-accent-rgb").trim() ||
          "140,170,238";

        this.beatFlashElement.style.backgroundColor = `rgba(${accentRgb}, ${
          this.beatIntensity * 0.25
        })`;
        this.beatFlashElement.style.opacity = `${this.beatIntensity * 0.85}`;
      } else if (this.beatFlashElement) {
        this.beatFlashElement.style.opacity = "0";
      }

      this.updatePerformanceMetrics(performance.now() - frameStart);
    } catch (error) {
      console.error(`[${this.systemName}] Error in animation loop:`, error);
      this.errorCount++;
      if (this.errorCount > 100) {
        this._stopAnimationLoop();
        console.error(
          `[${this.systemName}] Too many errors, stopping animation.`
        );
      }
    }
  }

  public onPerformanceModeChange(mode: "performance" | "quality") {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Performance mode changed to:`, mode);
    }

    if (mode === "performance") {
      this._performanceMode = true;
      this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
      // Let the master coordinator handle throttling
    } else {
      this._performanceMode = false;
      this._startAnimationLoop(); // Resume individual loop if needed
    }
  }

  private _startFallbackAnimationLoop() {
    const loop = () => {
      this.updateAnimation(performance.now(), 16.67); // Assume ~60fps
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private _animationLoop() {
    if (!this.isAnimating) return;

    const timestamp = performance.now();
    const deltaTime = timestamp - this.lastAnimationTime;
    this.lastAnimationTime = timestamp;

    const latestMusicData = this.musicSyncService?.getLatestProcessedData();
    const processedEnergy = latestMusicData?.processedEnergy || 0.5;
    const animationSpeedFactor = latestMusicData?.animationSpeedFactor || 1.0;

    this.currentRhythmPhase = Year3000Utilities.calculateRhythmPhase(
      timestamp,
      animationSpeedFactor
    );

    const breathingScale = Year3000Utilities.calculateBreathingScale(
      this.currentRhythmPhase,
      processedEnergy
    );

    this._updateCSSVariables(
      breathingScale,
      this.currentRhythmPhase,
      deltaTime,
      processedEnergy
    );

    this.animationFrameId = requestAnimationFrame(
      this._animationLoop.bind(this)
    );
  }

  private _updateCSSVariables(
    breathingScale: number,
    rhythmPhase: number,
    deltaTime: number,
    processedEnergy: number
  ) {
    // Skip if frame took too long – prevents cascaded jank on stalled tabs
    if (deltaTime > 50) return;

    const root = Year3000Utilities.getRootStyle();
    if (!root) return;

    // Helper: prefer central batcher when available
    const queueCSSUpdate = (property: string, value: string) => {
      if (
        (this.year3000System as any)?.queueCSSVariableUpdate &&
        typeof (this.year3000System as any).queueCSSVariableUpdate ===
          "function"
      ) {
        (this.year3000System as any).queueCSSVariableUpdate(property, value);
      } else {
        root.style.setProperty(property, value);
      }
    };

    queueCSSUpdate("--sn-breathing-scale", breathingScale.toFixed(4));
    queueCSSUpdate("--sn-rhythm-phase", rhythmPhase.toFixed(4));

    // Use local eased value instead of deprecated BeatFlashIntensity.intensity
    const beatPulseIntensity = this.beatIntensity;
    queueCSSUpdate("--sn-beat-pulse-intensity", beatPulseIntensity.toFixed(4));

    // Map music energy → feed bloom gradient
    const bloomIntensity = processedEnergy * 0.4;
    queueCSSUpdate("--sn-feed-bloom-intensity", bloomIntensity.toFixed(3));

    this.performanceMetrics.cssVariableUpdates++;
  }

  public getPerformanceReport() {
    const duration = (performance.now() - this.performanceStartTime) / 1000;
    const currentMemory = this._getMemoryUsage();
    const memoryIncrease = Math.max(
      0,
      currentMemory - this.performanceMetrics.memoryStartSize
    );

    return {
      systemName: this.systemName,
      elapsedTime: duration.toFixed(1),
      animationUpdatesPerSecond: (
        this.performanceMetrics.animationUpdates / duration
      ).toFixed(1),
      cssUpdatesPerSecond: (
        this.performanceMetrics.cssVariableUpdates / duration
      ).toFixed(1),
      memoryIncreaseKB: (memoryIncrease / 1024).toFixed(1),
      currentRhythmPhase: this.currentRhythmPhase.toFixed(3),
      isSyncActive: this.isSyncActive,
    };
  }

  private _triggerBeat(timestamp: number) {
    if (!this.initialized) return;

    const latestMusicData = this.musicSyncService?.getLatestProcessedData();
    const energy = latestMusicData?.energy || 0.5;
    const visualIntensity = latestMusicData?.visualIntensity || 0.5;

    this.onBeatDetected(timestamp, energy, visualIntensity);
  }

  private _scheduleNextBeat() {
    this.beatInterval = 60000 / this.enhancedBPM;
    this.nextBeatTime += this.beatInterval;
  }

  private _startBeatSync(bpm: number) {
    this.enhancedBPM = bpm;
    this.beatInterval = 60000 / bpm;
    this.trackStartTime = Date.now();
    this.nextBeatTime = this.trackStartTime + this.beatInterval;
    this.beatCount = 0;
    this.isSyncActive = true;

    if (this.config.enableDebug) {
      console.log(
        `🎵 [${this.systemName}] Beat sync started - Enhanced BPM: ${bpm}, ` +
          `Interval: ${this.beatInterval.toFixed(1)}ms`
      );
    }
  }

  private _stopBeatSync() {
    this.isSyncActive = false;
    if (this.beatTimer) {
      clearTimeout(this.beatTimer);
      this.beatTimer = null;
    }

    if (this.config.enableDebug) {
      console.log(`🛑 [${this.systemName}] Beat sync stopped`);
    }
  }

  public updateFromMusicAnalysis(processedMusicData: any) {
    if (!this.initialized || !processedMusicData || !this.isActive) return;
    super.updateFromMusicAnalysis(processedMusicData);

    const {
      enhancedBPM,
      baseBPM,
      tempo,
      bpmCalculationMethod,
      bpmMultiplier,
      estimatedEnergy,
      energy,
      visualIntensity,
      beats,
      beatOccurred,
    } = processedMusicData;

    // --- Start of merged logic ---
    const newBPM = enhancedBPM || baseBPM || tempo || 120;

    // Update energy for visual intensity
    this.currentEnergy = estimatedEnergy || energy || 0.5;

    // Start beat sync or update BPM
    if (newBPM !== this.currentBPM) {
      this.currentBPM = newBPM;
      this.beatInterval = this.utils.bpmToInterval(newBPM);
      this.lastBeatTime = performance.now();
      this.beatCount = 0;

      if (this.config.enableDebug) {
        const method = bpmCalculationMethod || "basic";
        const multiplier = bpmMultiplier || 1.0;
        console.log(
          `🎵 [BeatSyncVisualSystem] BPM updated: ${
            baseBPM || tempo
          } → ${newBPM} (method: ${method}, mult: ${multiplier.toFixed(2)})`
        );
      }
    }

    // Call _startBeatSync when enhancedBPM is available and changes
    if (enhancedBPM && enhancedBPM !== this.enhancedBPM) {
      this._startBeatSync(enhancedBPM);
    }

    // Use beat timing data if available for precision
    if (beats && beats.length > 0) {
      this.usePreciseBeatTiming(beats);
    }

    // Apply energy-based visual adjustments
    this.updateVisualIntensity();

    // Handle beat occurrence
    if (beatOccurred) {
      this.onBeatDetected(performance.now(), energy, visualIntensity);
    }
    // --- End of merged logic ---
  }

  public onBeatDetected(
    currentTime: number,
    energy: number,
    visualIntensity: number
  ) {
    this.lastBeatTime = currentTime;
    this.beatIntensity = Math.min(
      1,
      this.beatIntensity + (energy * 0.5 + visualIntensity * 0.5)
    );

    // === Spawn beat echo ==================================================
    try {
      this._spawnBeatEcho();
    } catch (_e) {
      /* silent */
    }

    // Phase 3 – Emit cross-system beat event for NebulaController, etc.
    try {
      GlobalEventBus.publish("music:beat", {
        energy,
        bpm: this.currentBPM,
        valence: (this.processedMusicData as any)?.valence ?? 0,
      });
    } catch (_e) {
      /* silent fail */
    }
  }

  public destroy() {
    this.disableHarmonicSync();
    this._stopBeatSync();
    this._stopAnimationLoop();

    if (
      this.crystallineOverlayElement &&
      this.crystallineOverlayElement.parentElement
    ) {
      this.crystallineOverlayElement.parentElement.removeChild(
        this.crystallineOverlayElement
      );
      this.crystallineOverlayElement = null;
    }

    const rootStyle = Year3000Utilities.getRootStyle();
    if (rootStyle) {
      rootStyle.style.setProperty("--sn-breathing-scale", "1");
      rootStyle.style.setProperty("--sn-rhythm-phase", "0");
    }

    if (this.beatFlashElement && this.beatFlashElement.parentElement) {
      this.beatFlashElement.parentElement.removeChild(this.beatFlashElement);
      this.beatFlashElement = null;
    }

    if (this.config.enableDebug) {
      const report = this.getPerformanceReport();
      console.log(`[${this.systemName}] Performance Report:`, report);
      console.log(`[${this.systemName}] Destroyed.`);
    }

    super.destroy();
  }

  public usePreciseBeatTiming(beats: any[]) {
    if (!beats || beats.length === 0) return;

    // Calculate average beat interval for more accurate BPM
    const intervals: number[] = [];
    for (let i = 1; i < Math.min(beats.length, 20); i++) {
      intervals.push(beats[i].start - beats[i - 1].start);
    }

    if (intervals.length > 0) {
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const preciseBPM = Math.round(60 / avgInterval);

      if (Math.abs(preciseBPM - this.currentBPM) > 2) {
        this.currentBPM = preciseBPM;
        this.beatInterval = avgInterval * 1000; // Convert to milliseconds

        if (this.config.enableDebug) {
          console.log(
            `🎵 [BeatSyncVisualSystem] Using precise beat timing: ${preciseBPM} BPM`
          );
        }
      }
    }
  }

  public updatePerformanceMetrics(frameTime: number) {
    if (this.frameCount % 60 === 0) {
      const memoryUsage = this._getMemoryUsage();
      const animationComplexity = this.calculateAnimationComplexity();

      const healthMonitor = this.utils.getHealthMonitor();
      if (healthMonitor) {
        healthMonitor.updateSystemMetrics("BeatSyncVisualSystem", {
          frameCount: this.frameCount,
          averageFrameTime: frameTime,
          memoryUsage: memoryUsage,
          errorCount: this.errorCount,
          animationComplexity: animationComplexity,
        });
      }
    }
  }

  public calculateAnimationComplexity(): number {
    let complexity = 0;
    if (this.isAnimating) complexity += 10;
    if (
      this.processedMusicData &&
      (this.processedMusicData as any).visualIntensity > 0.7
    )
      complexity += 20;
    return complexity;
  }

  public performCleanup() {
    this.errorCount = Math.max(0, this.errorCount - 1);

    if (this.frameCount > 10000) {
      this.frameCount = Math.floor(this.frameCount / 2);
    }
  }

  public updateModeConfiguration(modeConfig: any) {
    if (!modeConfig) return;

    const { enabled, animations, intensity, harmonicSync } = modeConfig;

    this.modeConfig = {
      systemEnabled: enabled !== false,
      harmonicSyncEnabled: harmonicSync || animations || false,
      oscillateEnabled: animations || false,
      intensityMultiplier: intensity || 1.0,
      temporalPlayEnabled: modeConfig.temporalPlay || false,
    };

    if (this.modeConfig.harmonicSyncEnabled) {
      this.initializeHarmonicSync();
    } else {
      this.disableHarmonicSync();
    }

    this.updateBeatFlashIntensity();
  }

  public initializeHarmonicSync() {
    if (this.harmonicSyncInitialized) return;

    this.harmonicSync = {
      masterFrequency: 1.0,
      harmonicLayers: [
        { frequency: 1.0, phase: 0, amplitude: 1.0, name: "fundamental" },
        { frequency: 0.5, phase: 0, amplitude: 0.7, name: "sub-harmonic" },
        {
          frequency: 2.0,
          phase: Math.PI / 4,
          amplitude: 0.5,
          name: "second-harmonic",
        },
        {
          frequency: 0.25,
          phase: Math.PI / 2,
          amplitude: 0.8,
          name: "deep-pulse",
        },
      ],
      subscribedSystems: new Set(),
      syncEventChannel: "year3000HarmonicSync",
    };

    this.startHarmonicLoop();
    this.harmonicSyncInitialized = true;

    if (this.config?.enableDebug) {
      console.log(
        `🎵 [${this.systemName}] Harmonic sync initialized with ${this.harmonicSync.harmonicLayers.length} layers`
      );
    }
  }

  public disableHarmonicSync() {
    if (!this.harmonicSyncInitialized) return;
    if (this.harmonicLoopId) {
      cancelAnimationFrame(this.harmonicLoopId);
      this.harmonicLoopId = null;
    }
    this.clearHarmonicVariables();
    this.harmonicSync = null;
    this.harmonicSyncInitialized = false;

    if (this.config?.enableDebug) {
      console.log(`🎵 [${this.systemName}] Harmonic sync disabled`);
    }
  }

  private startHarmonicLoop() {
    if (!this.harmonicSync) return;

    const harmonicLoop = (timestamp: number) => {
      if (!this.initialized || !this.harmonicSync || !this.modeConfig) return;

      this.updateHarmonicFrequencies();
      this.calculateHarmonicValues(timestamp);
      this.dispatchHarmonicSync(timestamp);

      this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
    };

    this.harmonicLoopId = requestAnimationFrame(harmonicLoop);
  }

  private updateHarmonicFrequencies() {
    if (!this.initialized || !this.harmonicSync || !this.modeConfig) return;
    const latestMusicData = this.musicSyncService?.getLatestProcessedData?.();
    if (!latestMusicData) return;

    const bpmFrequency = this.enhancedBPM / 60;
    this.harmonicSync.masterFrequency = bpmFrequency;

    const energy = latestMusicData?.processedEnergy || 0.5;
    const valence = latestMusicData?.valence || 0.5;

    this.harmonicSync.harmonicLayers.forEach((layer) => {
      switch (layer.name) {
        case "fundamental":
          layer.amplitude = 0.8 + energy * 0.4; // Energy drives fundamental
          break;
        case "sub-harmonic":
          layer.amplitude = 0.5 + valence * 0.3; // Valence drives sub-harmonic
          break;
        case "second-harmonic":
          layer.amplitude = 0.3 + energy * valence * 0.4; // Combined effect
          break;
        case "deep-pulse":
          layer.amplitude = 0.6 + (1 - valence) * 0.3; // Counter-valence
          break;
      }

      // Apply mode intensity multiplier
      if (this.modeConfig) {
        layer.amplitude *= this.modeConfig.intensityMultiplier || 1.0;
      }
    });
  }

  private calculateHarmonicValues(timestamp: number) {
    if (!this.harmonicSync) return;

    const timeInSeconds = timestamp / 1000;
    const harmonicData: HarmonicData = {
      timestamp: timestamp,
      masterFrequency: this.harmonicSync.masterFrequency,
      layers: {},
      composite: {
        oscillation: 0,
        pulse: 0,
        flow: 0,
      },
    };

    // Calculate each harmonic layer
    this.harmonicSync.harmonicLayers.forEach((layer) => {
      const omega =
        2 * Math.PI * layer.frequency * this.harmonicSync!.masterFrequency;
      const value =
        layer.amplitude * Math.sin(omega * timeInSeconds + layer.phase);

      harmonicData.layers[layer.name] = {
        frequency: layer.frequency * this.harmonicSync!.masterFrequency,
        amplitude: layer.amplitude,
        value: value,
        phase: layer.phase,
      };

      // Contribute to composite values
      switch (layer.name) {
        case "fundamental":
        case "second-harmonic":
          harmonicData.composite.oscillation += value * 0.5;
          break;
        case "sub-harmonic":
        case "deep-pulse":
          harmonicData.composite.pulse += value * 0.3;
          break;
      }
    });

    // Calculate flow as a combination of all layers
    harmonicData.composite.flow =
      harmonicData.composite.oscillation * 0.6 +
      harmonicData.composite.pulse * 0.4;

    // Normalize composite values
    harmonicData.composite.oscillation = Math.max(
      -1,
      Math.min(1, harmonicData.composite.oscillation)
    );
    harmonicData.composite.pulse = Math.max(
      -1,
      Math.min(1, harmonicData.composite.pulse)
    );
    harmonicData.composite.flow = Math.max(
      -1,
      Math.min(1, harmonicData.composite.flow)
    );

    // Store for other systems to access
    this.currentHarmonicData = harmonicData;

    // Update CSS variables for immediate use (implemented in Phase 3)
    this.updateHarmonicCSSVariables(harmonicData);
  }

  private updateHarmonicCSSVariables(harmonicData: HarmonicData) {
    const root = document.documentElement;

    // Master harmonic variables
    root.style.setProperty(
      "--sn-harmonic-master-freq",
      harmonicData.masterFrequency.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-oscillation",
      harmonicData.composite.oscillation.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-pulse",
      harmonicData.composite.pulse.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-flow",
      harmonicData.composite.flow.toFixed(3)
    );

    // Individual layer variables for advanced usage
    Object.entries(harmonicData.layers).forEach(([layerName, layerData]) => {
      root.style.setProperty(
        `--sn-harmonic-${layerName}`,
        layerData.value.toFixed(3)
      );
      root.style.setProperty(
        `--sn-harmonic-${layerName}-freq`,
        layerData.frequency.toFixed(3)
      );
    });

    // Derived kinetic variables
    const scalePulse = 1 + harmonicData.composite.pulse * 0.02; // Subtle scaling
    const rotationFlow = harmonicData.composite.flow * 0.5; // Gentle rotation
    const opacityOscillation = 0.8 + harmonicData.composite.oscillation * 0.1; // Opacity variation

    root.style.setProperty("--sn-harmonic-scale-pulse", scalePulse.toFixed(3));
    root.style.setProperty(
      "--sn-harmonic-rotation-flow",
      rotationFlow.toFixed(3)
    );
    root.style.setProperty(
      "--sn-harmonic-opacity-oscillation",
      opacityOscillation.toFixed(3)
    );
  }

  private dispatchHarmonicSync(timestamp: number) {
    if (!this.currentHarmonicData || !this.harmonicSync) return;

    // Create detailed sync event
    const syncEvent = new CustomEvent(this.harmonicSync.syncEventChannel, {
      detail: {
        ...this.currentHarmonicData,
        systemName: this.systemName,
        modeConfig: this.modeConfig,
      },
    });

    document.dispatchEvent(syncEvent);

    // Also set global harmonic state for direct access
    if (typeof window !== "undefined") {
      (window as any).Year3000HarmonicState = this.currentHarmonicData;
    }
  }

  private clearHarmonicVariables() {
    const root = document.documentElement;

    const harmonicVars = [
      "--sn-harmonic-master-freq",
      "--sn-harmonic-oscillation",
      "--sn-harmonic-pulse",
      "--sn-harmonic-flow",
      "--sn-harmonic-scale-pulse",
      "--sn-harmonic-rotation-flow",
      "--sn-harmonic-opacity-oscillation",
    ];

    // Clear individual layer variables
    this.harmonicSync?.harmonicLayers?.forEach((layer) => {
      harmonicVars.push(`--sn-harmonic-${layer.name}`);
      harmonicVars.push(`--sn-harmonic-${layer.name}-freq`);
    });

    harmonicVars.forEach((varName) => {
      root.style.removeProperty(varName);
    });
  }

  public updateBeatFlashIntensity() {
    if (!this.modeConfig) return;

    this.beatFlashIntensity = {
      base: 0.25 * (this.modeConfig.intensityMultiplier || 1.0),
      peak: 0.85 * (this.modeConfig.intensityMultiplier || 1.0),
      enabled:
        this.modeConfig.systemEnabled && this.modeConfig.oscillateEnabled,
    };

    if (this.config?.enableDebug) {
      console.log(
        `🔥 [${this.systemName}] Updated beat flash intensity:`,
        this.beatFlashIntensity
      );
    }
  }

  public getCurrentHarmonicData() {
    return this.currentHarmonicData || null;
  }

  public updateVisualIntensity() {
    // Placeholder for visual intensity update
  }

  public start(): void {
    Spicetify.Player.addEventListener("songchange", this.onSongChange);
    this.onSongChange(); // Initial call for the current song
  }

  public stop(): void {
    Spicetify.Player.removeEventListener("songchange", this.onSongChange);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private async onSongChange(): Promise<void> {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    const currentTrack = Spicetify.Player.data?.item;
    if (!currentTrack || !currentTrack.uri) {
      return;
    }

    try {
      this.analysis = await Spicetify.getAudioData(currentTrack.uri);
      if (this.analysis && this.analysis.segments) {
        this.update();
      }
    } catch (error) {
      console.error("StarryNight: Failed to get audio data", error);
      this.analysis = null;
    }
  }

  private update(): void {
    if (!this.analysis || !Spicetify.Player.isPlaying()) {
      this.smoothedLoudness = 0; // Reset when paused
      document.documentElement.style.setProperty(
        "--sn-feed-bloom-intensity",
        "0"
      );
      this.rafId = requestAnimationFrame(this.update);
      return;
    }

    const progress = Spicetify.Player.getProgress() / 1000; // in seconds
    const segment = this.analysis.segments.find(
      (s: AudioSegment) =>
        progress >= s.start && progress < s.start + s.duration
    );

    let currentLoudness = 0;
    if (segment) {
      // Normalize loudness from [-60, 0] dB to [0, 1]
      const normalizedLoudness = (segment.loudness_max + 60) / 60;
      currentLoudness = Math.max(0, Math.min(1, normalizedLoudness));
    }

    // Apply exponential smoothing
    this.smoothedLoudness =
      currentLoudness * this.SMOOTHING_FACTOR +
      this.smoothedLoudness * (1 - this.SMOOTHING_FACTOR);

    // Map smoothed loudness [0, 1] to bloom intensity [0, 0.4]
    const bloomIntensity = this.smoothedLoudness * 0.4;

    document.documentElement.style.setProperty(
      "--sn-feed-bloom-intensity",
      bloomIntensity.toFixed(3)
    );

    this.rafId = requestAnimationFrame(this.update);
  }

  // -------------------------------------------------------------------------
  // ⚡ TEMPORAL ECHO HELPERS
  // -------------------------------------------------------------------------

  /** Returns user-setting echo intensity (0–3). */
  private get echoIntensitySetting(): number {
    const val = this.settingsManager?.get?.("sn-echo-intensity") ?? "2";
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? 2 : parsed;
  }

  /** Calculates dynamic max echoes based on intensity. */
  private get dynamicMaxEchoes(): number {
    switch (this.echoIntensitySetting) {
      case 0:
        return 0;
      case 1:
        return Math.ceil(BeatSyncVisualSystem.BASE_MAX_ECHOES / 2);
      case 3:
        return BeatSyncVisualSystem.BASE_MAX_ECHOES * 2;
      default:
        return BeatSyncVisualSystem.BASE_MAX_ECHOES;
    }
  }

  /** Acquire pooled echo or create new element */
  private _acquireEchoElement(): HTMLElement {
    let el = this.echoPool.pop();
    if (el) {
      el.style.animation = "none";
      // Force reflow to restart animation
      void el.offsetWidth;
      el.style.animation = "";
    } else {
      el = document.createElement("div");
      el.className = "sn-temporal-echo";
    }
    return el;
  }

  /** Return echo element back to pool */
  private _releaseEchoElement(el: HTMLElement) {
    if (this.echoPool.length < 20) {
      this.echoPool.push(el);
    }
  }

  /** Spawns a temporal echo at the centre of crystalline overlay */
  private _spawnBeatEcho() {
    // Accessibility guard
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (this.currentEchoCount >= this.dynamicMaxEchoes) return;
    if (this.echoIntensitySetting === 0) return;

    const musicData = this.musicSyncService?.getLatestProcessedData() ?? {};
    const energy = musicData.energy ?? 0.5;
    const valence = musicData.valence ?? 0.5;

    const intensityFactor = 0.2 * this.echoIntensitySetting;
    const radius = Math.min(1.6, 1 + energy * 0.4 + intensityFactor);
    const hueShift = ((valence - 0.5) * 40).toFixed(1);

    // Use noise field & beat vector for subtle offset --------------------------------
    const vec = sampleNoise(Math.random(), Math.random());
    const beatVec = this.musicSyncService?.getCurrentBeatVector?.() ?? {
      x: 0,
      y: 0,
    };

    const offsetMagnitude = 8 + energy * 8;
    let offsetX = (vec.x + beatVec.x) * offsetMagnitude;
    let offsetY = (vec.y + beatVec.y) * offsetMagnitude;
    const skewDeg = vec.x * 6;

    const baseAngle = (Math.random() * 360).toFixed(1);

    const echo = this._acquireEchoElement();
    echo.style.setProperty("--sn-echo-radius-multiplier", radius.toFixed(2));
    echo.style.setProperty("--sn-echo-hue-shift", `${hueShift}deg`);
    echo.style.setProperty("--sn-echo-offset-x", `${offsetX.toFixed(1)}px`);
    echo.style.setProperty("--sn-echo-offset-y", `${offsetY.toFixed(1)}px`);
    echo.style.setProperty("--sn-echo-skew", `${skewDeg.toFixed(2)}deg`);
    echo.style.setProperty("--sn-echo-rotate", `${baseAngle}deg`);

    const host = this.crystallineOverlayElement ?? document.body;
    host.appendChild(echo);
    this.currentEchoCount++;

    setTimeout(() => {
      if (echo.parentElement) echo.parentElement.removeChild(echo);
      this.currentEchoCount--;
      this._releaseEchoElement(echo);
    }, 1250);
  }
}

export default BeatSyncVisualSystem;
