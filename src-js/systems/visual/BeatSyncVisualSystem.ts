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
import { BaseVisualSystem } from "../BaseVisualSystem";

// YEAR 3000 BEATSYNC VISUAL SYSTEM
export class BeatSyncVisualSystem extends BaseVisualSystem {
  private year3000System: Year3000System | null;
  private beatFlashElement: HTMLElement | null = null;
  public animationFrameId: number | null = null;
  private lastBeatTime: number = 0;
  private beatIntensity: number = 0;

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

  // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
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
        actualDeltaTime
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

      this.performanceMetrics.animationUpdates++;

      const frameTime = performance.now() - frameStart;
      this.updatePerformanceMetrics(frameTime);
    } catch (error) {
      this.errorCount++;
      console.warn(`[${this.systemName}] Animation update error:`, error);

      if (this.errorCount > 5) {
        console.warn(
          `[${this.systemName}] High error count, requesting performance mode`
        );

        if (
          this.year3000System &&
          (this.year3000System as any)._activatePerformanceMode
        ) {
          (this.year3000System as any)._activatePerformanceMode();
        }
      }
    }
  }

  public onPerformanceModeChange(mode: "performance" | "quality") {
    if (mode === "performance") {
      this._performanceMode = true;
      this._reducedQualityMode = true;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Switched to performance mode - reducing quality`
        );
      }
    } else if (mode === "quality") {
      this._performanceMode = false;
      this._reducedQualityMode = false;

      if (this.config?.enableDebug) {
        console.log(
          `🎬 [${this.systemName}] Switched to quality mode - full effects`
        );
      }
    }
  }

  private _startFallbackAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const loop = () => {
      this._animationLoop();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private _animationLoop() {
    if (!this.isAnimating || !this.initialized) return;

    const frameStart = performance.now();
    this.frameCount++;

    try {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastAnimationTime;
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
        deltaTime
      );

      if (this.isSyncActive && this.enhancedBPM > 0) {
        const now = Date.now();
        if (now >= this.nextBeatTime) {
          this._triggerBeat(now);
          this._scheduleNextBeat();
        }
      }

      if (this.beatIntensity > 0 && this.beatFlashElement) {
        this.beatIntensity -= 0.025;
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

      this.performanceMetrics.animationUpdates++;

      const frameTime = performance.now() - frameStart;
      this.updatePerformanceMetrics(frameTime);
    } catch (error) {
      this.errorCount++;
      console.warn(`[${this.systemName}] Animation loop error:`, error);

      if (this.errorCount > 5) {
        console.warn(
          `[${this.systemName}] High error count, throttling animations`
        );
        setTimeout(() => {
          if (this.isAnimating) {
            this.animationFrameId = requestAnimationFrame(() =>
              this._animationLoop()
            );
          }
        }, 100);
        return;
      }
    }
  }

  private _updateCSSVariables(
    breathingScale: number,
    rhythmPhase: number,
    deltaTime: number
  ) {
    if (deltaTime > 50) return;

    const rootStyle = Year3000Utilities.getRootStyle();
    if (!rootStyle) return;

    try {
      const queueCSSUpdate = (property: string, value: string) => {
        if (
          this.year3000System &&
          (this.year3000System as any).queueCSSVariableUpdate
        ) {
          (this.year3000System as any).queueCSSVariableUpdate(property, value);
        } else {
          rootStyle.style.setProperty(property, value);
        }
      };

      const clampedBreathingScale = Math.max(
        0.97,
        Math.min(1.02, breathingScale)
      );
      queueCSSUpdate("--sn-breathing-scale", clampedBreathingScale.toFixed(4));

      const normalizedPhase = rhythmPhase % (Math.PI * 2);
      queueCSSUpdate("--sn-rhythm-phase", normalizedPhase.toFixed(4));

      this.performanceMetrics.cssVariableUpdates++;
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] CSS variable update failed:`, error);
      }
    }
  }

  public getPerformanceReport() {
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.performanceMetrics.memoryStartTime;
    const currentMemory = this._getMemoryUsage();
    const memoryIncrease = Math.max(
      0,
      currentMemory - this.performanceMetrics.memoryStartSize
    );

    return {
      systemName: this.systemName,
      elapsedTime: elapsedTime.toFixed(1),
      animationUpdatesPerSecond: (
        this.performanceMetrics.animationUpdates /
        (elapsedTime / 1000)
      ).toFixed(1),
      cssUpdatesPerSecond: (
        this.performanceMetrics.cssVariableUpdates /
        (elapsedTime / 1000)
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
  }

  public destroy() {
    this.disableHarmonicSync();
    this._stopBeatSync();
    this._stopAnimationLoop();

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
}
