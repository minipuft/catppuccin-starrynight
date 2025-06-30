import { GlobalEventBus } from "@/core/EventBus";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import type { Year3000Config } from "@/types/models";
import { Year3000System } from "../../core/year3000System";
import { SettingsManager } from "../../managers/SettingsManager";
import { MusicSyncService } from "../../services/MusicSyncService";
import * as Year3000Utilities from "../../utils/Year3000Utilities";
import { BaseVisualSystem } from "../BaseVisualSystem";

// Type definitions
interface NexusState {
  complexity: number;
  coherence: number;
  volatility: number;
  timeDistortionFactor: number;
  currentNavigationScale: number;
  targetComplexity: number;
  targetCoherence: number;
  targetVolatility: number;
  targetTimeDistortionFactor: number;
  targetNavigationScale: number;
  userInfluence: number;
  lastEnergy: number;
  lastValence: number;
  lastVisualIntensity: number;
  lastMoodIdentifier: string;
  responsiveness: number;
  temporalSensitivity: number;
}

interface BiometricState {
  isMeditating: boolean;
  lastUserInteractionTime: number;
  meditationGracePeriod: number;
  interactionCooldown: number;
  lastMeditationUpdateTime: number | null;
  desaturation: number;
  slowdown: number;
  targetDesaturation: number;
  targetSlowdown: number;
}

interface SystemIntegrationMetrics {
  lastSystemsCheck: number;
  integrationHealth: "healthy" | "degraded" | "critical";
  crossSystemErrors: number;
  meditationTransitions: number;
  navigationScaleUpdates: number;
}

// YEAR 3000 DIMENSIONAL NEXUS SYSTEM - Performance Optimized
export class DimensionalNexusSystem extends BaseVisualSystem {
  /**
   * Frame callback invoked by the MasterAnimationCoordinator.
   * Delegates to the existing `updateAnimation` implementation which
   * contains the system's main per-frame logic (including internal
   * frame-skipping and heavy-update cadence).
   *
   * @param deltaMs  Milliseconds elapsed since the previous animation frame.
   */
  public override onAnimate(deltaMs: number): void {
    if (!this.initialized) return;

    // Use the established updateAnimation pathway to avoid duplicating logic.
    this.updateAnimation(performance.now(), deltaMs);
  }
  private year3000System: Year3000System | null;
  private nexusState: NexusState;
  private biometricState: BiometricState;
  private lastHeavyUpdateTime: number;
  private heavyUpdateInterval: number;
  private lastBiometricCheckTime: number;
  private biometricCheckInterval: number;
  private lastInteractionRecordTime: number;
  private interactionRecordInterval: number;
  private _animationRegistered: boolean;
  private _performanceMode: "auto" | "performance" | "quality";
  private _frameSkipCounter: number;
  private _maxFrameSkip: number;
  private systemIntegrationMetrics: SystemIntegrationMetrics;
  private rootElement: HTMLElement;
  private modalObserver: MutationObserver | null;
  private _lastScrollTime: number | null;
  private _lastScrollTop: number | null;
  private _scrollContainerElements: HTMLElement[] = [];
  // Stored throttled interaction handler for proper cleanup.
  private _interactionHandler: ((event: Event) => void) | null = null;

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

    this.nexusState = {
      complexity: 0.1,
      coherence: 0.8,
      volatility: 0.05,
      timeDistortionFactor: 1.0,
      currentNavigationScale: 1.0,
      targetComplexity: 0.1,
      targetCoherence: 0.8,
      targetVolatility: 0.05,
      targetTimeDistortionFactor: 1.0,
      targetNavigationScale: 1.0,
      userInfluence: 0,
      lastEnergy: 0.5,
      lastValence: 0.5,
      lastVisualIntensity: 0.5,
      lastMoodIdentifier: "neutral",
      responsiveness: 1.0,
      temporalSensitivity: 1.0,
    };

    this.biometricState = {
      isMeditating: false,
      lastUserInteractionTime: Date.now(),
      meditationGracePeriod: 5000,
      interactionCooldown: 1000,
      lastMeditationUpdateTime: null,
      desaturation: 0,
      slowdown: 1,
      targetDesaturation: 0,
      targetSlowdown: 1,
    };

    this.lastHeavyUpdateTime = 0;
    this.heavyUpdateInterval = 1000 / 10;
    this.lastBiometricCheckTime = 0;
    this.biometricCheckInterval = 1000;
    this.lastInteractionRecordTime = 0;
    this.interactionRecordInterval = 200;
    this._animationRegistered = false;
    this._performanceMode = "auto";
    this._frameSkipCounter = 0;
    this._maxFrameSkip = 2;

    this.systemIntegrationMetrics = {
      lastSystemsCheck: Date.now(),
      integrationHealth: "healthy",
      crossSystemErrors: 0,
      meditationTransitions: 0,
      navigationScaleUpdates: 0,
    };

    const healthMonitor = this.utils.getHealthMonitor();
    if (healthMonitor) {
      healthMonitor.registerSystem("DimensionalNexusSystem", this);
    }

    this.rootElement = this.utils.getRootStyle() as HTMLElement;
    this.modalObserver = null;
    this._lastScrollTime = null;
    this._lastScrollTop = null;
  }

  public override async initialize() {
    await super.initialize();
    this.initializeOptimizedQuantumSpace();
    this.setupModalObserver();
    this.setupOptimizedInteractionListener();
    this._registerWithAnimationCoordinator();
  }

  private _registerWithAnimationCoordinator() {
    if (
      this.year3000System &&
      (this.year3000System as any).registerAnimationSystem
    ) {
      (this.year3000System as any).registerAnimationSystem(
        "DimensionalNexusSystem",
        this,
        "normal",
        30
      );
      this._animationRegistered = true;
    } else {
      this._startFallbackAnimationLoops();
    }
  }

  private initializeOptimizedQuantumSpace() {
    const root = this.utils.getRootStyle();
    if (!root) return;

    const safeSetProperty = (name: string, value: any) => {
      try {
        root.style.setProperty(name, value);
      } catch (e) {}
    };

    safeSetProperty("--sn-nexus-complexity", this.nexusState.complexity);
    safeSetProperty("--sn-nexus-coherence", this.nexusState.coherence);
    safeSetProperty("--sn-nexus-volatility", this.nexusState.volatility);
    safeSetProperty(
      "--sn-nexus-time-distortion",
      this.nexusState.timeDistortionFactor
    );
    safeSetProperty("--sn-nav-item-transform-scale", "1.0");
    safeSetProperty("--sn-sidebar-meditation-desaturation", "0");
    safeSetProperty("--sn-sidebar-meditation-slowdown", "1");
    safeSetProperty("--sn-nexus-pattern-complexity", "0.5");
    safeSetProperty("--sn-nexus-pattern-rotation", "0deg");
  }

  private recordUserInteraction(event: Event) {
    const eventType = event.type;

    // Phase 3 – Emit user:scroll with velocity/direction
    if (eventType === "scroll") {
      const target = event.target as HTMLElement | null;
      if (target) {
        const newTop = target.scrollTop;
        const now = performance.now();
        const velocity = this._lastScrollTime
          ? (newTop - (this._lastScrollTop ?? 0)) / (now - this._lastScrollTime)
          : 0;
        const direction = velocity < 0 ? "up" : "down";
        GlobalEventBus.publish("user:scroll", {
          velocity: velocity * 1000, // pixels per second
          direction,
        });
        this._lastScrollTop = newTop;
        this._lastScrollTime = now;
      }
    }

    const now = performance.now();

    if (now - this.lastInteractionRecordTime < this.interactionRecordInterval) {
      return;
    }
    this.lastInteractionRecordTime = now;
    this.nexusState.userInfluence += 0.005;
    this.nexusState.volatility = Math.min(1, this.nexusState.volatility + 0.01);
    this.nexusState.userInfluence = Math.min(
      0.5,
      this.nexusState.userInfluence
    );
    this.biometricState.lastUserInteractionTime = Date.now();
    this.biometricState.isMeditating = false;
  }

  private setupModalObserver() {
    const modalRoot = document.querySelector(".main-modal-container");
    if (!modalRoot) return;
    const observerCallback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const hasModal = modalRoot.children.length > 0;
          this.nexusState.timeDistortionFactor = hasModal ? 0.2 : 1.0;
          this.nexusState.coherence = hasModal ? 0.2 : 0.8;
        }
      }
    };
    this.modalObserver = new MutationObserver(observerCallback);
    this.modalObserver.observe(modalRoot, { childList: true });
  }

  private setupOptimizedInteractionListener() {
    this._interactionHandler = this.utils.throttle(
      (event: Event) => this.recordUserInteraction(event),
      100
    );

    // Attach generic interaction listeners to `document` (excluding scroll)
    const genericEvents = ["click", "mousemove", "keydown"] as const;
    genericEvents.forEach((eventType) => {
      document.addEventListener(
        eventType,
        this._interactionHandler as EventListener,
        { passive: true }
      );
    });

    // --- Scroll interaction binding -------------------------------------
    // Spotify scrolls an inner container (e.g. playlist page section) and
    // `scroll` does NOT bubble to `document`.  Bind directly to known
    // containers so velocity can be captured.
    const scrollSelectors = [
      ".main-view-container__scroll-node",
      ".main-view-container__scroll-node-child",
      "section[data-testid='playlist-page']",
    ];

    const foundContainers: HTMLElement[] = [];
    scrollSelectors.forEach((sel) => {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        foundContainers.push(el);
      });
    });

    // If no specific container found, fall back to document so behaviour
    // degrades gracefully on unexpected layouts.
    const targets = foundContainers.length ? foundContainers : [document];

    targets.forEach((el) => {
      el.addEventListener("scroll", this._interactionHandler as EventListener, {
        passive: true,
      });
    });

    // Keep reference for potential clean-up later.
    this._scrollContainerElements = foundContainers;
  }

  public override updateFromMusicAnalysis(
    processedMusicData: any,
    rawFeatures?: any,
    trackUri?: string | null
  ) {
    if (!this.initialized || !this.validateMusicData(processedMusicData)) {
      this.applySafeDefaults();
      return;
    }
    this.updateNexusTargets(processedMusicData);
  }

  private updateNexusTargets(processedMusicData: any) {
    const {
      energy,
      valence,
      visualIntensity,
      animationSpeedFactor,
      moodIdentifier,
    } = processedMusicData;

    this.nexusState.targetComplexity =
      (energy * 0.6 + visualIntensity * 0.4) * 0.9 + 0.1;
    this.nexusState.targetCoherence =
      1.0 - (energy * 0.5 + visualIntensity * 0.5) * 0.6;
    this.nexusState.targetVolatility =
      (1.0 - valence) * 0.1 + (energy - 0.5) * 0.05;
    this.nexusState.targetTimeDistortionFactor = animationSpeedFactor;
    this.nexusState.targetNavigationScale =
      this.calculateOptimizedNavigationScale(visualIntensity, moodIdentifier);
  }

  private updateDigitalMeditationState(processedMusicData: any) {
    const now = Date.now();
    if (now - this.lastBiometricCheckTime < this.biometricCheckInterval) {
      return;
    }
    this.lastBiometricCheckTime = now;
    const timeSinceLastInteraction =
      now - this.biometricState.lastUserInteractionTime;

    if (
      timeSinceLastInteraction > this.biometricState.meditationGracePeriod &&
      processedMusicData.energy < 0.3 &&
      processedMusicData.valence > 0.6
    ) {
      this.biometricState.isMeditating = true;
      this.biometricState.targetDesaturation = 0.6;
      this.biometricState.targetSlowdown = 0.5;
    } else {
      this.biometricState.isMeditating = false;
      this.biometricState.targetDesaturation = 0;
      this.biometricState.targetSlowdown = 1;
    }
  }

  public override updateAnimation(timestamp: number, deltaTime: number) {
    if (!this.initialized) return;
    this._frameSkipCounter++;
    if (this._frameSkipCounter < this._maxFrameSkip) {
      return;
    }
    this._frameSkipCounter = 0;
    this.animateOptimizedNexusFrame(deltaTime);
    if (timestamp - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
      const latestMusicData = this.musicSyncService?.getLatestProcessedData();
      if (latestMusicData) this.updateDigitalMeditationState(latestMusicData);
      this.updateIntegrationMetrics();
      this.lastHeavyUpdateTime = timestamp;
    }
  }

  public onPerformanceModeChange(mode: "auto" | "performance" | "quality") {
    this._performanceMode = mode;
    if (mode === "performance") {
      this.heavyUpdateInterval = 1000 / 5;
      this._maxFrameSkip = 3;
      this.interactionRecordInterval = 500;
    } else {
      this.heavyUpdateInterval = 1000 / 10;
      this._maxFrameSkip = 2;
      this.interactionRecordInterval = 200;
    }
  }

  private _startFallbackAnimationLoops() {
    const loop = () => {
      this.updateAnimation(performance.now(), 16.67);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private animateOptimizedNexusFrame(deltaTimeMs: number | null) {
    const lerpFactor = Math.min(((deltaTimeMs ?? 16.67) / 1000) * 5, 1);

    this.nexusState.complexity = this.utils.lerp(
      this.nexusState.complexity,
      this.nexusState.targetComplexity,
      lerpFactor
    );
    this.nexusState.coherence = this.utils.lerp(
      this.nexusState.coherence,
      this.nexusState.targetCoherence,
      lerpFactor
    );
    this.nexusState.volatility = this.utils.lerp(
      this.nexusState.volatility,
      this.nexusState.targetVolatility,
      lerpFactor
    );
    this.nexusState.currentNavigationScale = this.utils.lerp(
      this.nexusState.currentNavigationScale,
      this.nexusState.targetNavigationScale,
      lerpFactor
    );

    this.biometricState.desaturation = this.utils.lerp(
      this.biometricState.desaturation,
      this.biometricState.targetDesaturation,
      lerpFactor
    );
    this.biometricState.slowdown = this.utils.lerp(
      this.biometricState.slowdown,
      this.biometricState.targetSlowdown,
      lerpFactor
    );

    this.applyOptimizedStateToCSS();
  }

  private applyOptimizedStateToCSS() {
    const queueCSSUpdate = (property: string, value: any) => {
      if ((this.year3000System as any)?.queueCSSVariableUpdate) {
        (this.year3000System as any).queueCSSVariableUpdate(
          property,
          value.toString()
        );
      } else {
        this.rootElement.style.setProperty(property, value.toString());
      }
    };

    queueCSSUpdate(
      "--sn-nexus-complexity",
      this.nexusState.complexity.toFixed(3)
    );
    queueCSSUpdate(
      "--sn-nexus-coherence",
      this.nexusState.coherence.toFixed(3)
    );
    queueCSSUpdate(
      "--sn-nexus-volatility",
      this.nexusState.volatility.toFixed(3)
    );
    queueCSSUpdate(
      "--sn-nav-item-transform-scale",
      this.nexusState.currentNavigationScale.toFixed(3)
    );
    queueCSSUpdate(
      "--sn-sidebar-meditation-desaturation",
      this.biometricState.desaturation.toFixed(3)
    );
    queueCSSUpdate(
      "--sn-sidebar-meditation-slowdown",
      this.biometricState.slowdown.toFixed(3)
    );
  }

  private validateMusicData(data: any): boolean {
    return (
      data &&
      typeof data.energy === "number" &&
      typeof data.valence === "number" &&
      typeof data.visualIntensity === "number"
    );
  }

  private applySafeDefaults() {
    const safeSetProperty = (name: string, value: string) => {
      if (this.rootElement) this.rootElement.style.setProperty(name, value);
    };
    safeSetProperty("--sn-nexus-complexity", "0.1");
    safeSetProperty("--sn-nexus-coherence", "0.8");
  }

  private updateIntegrationMetrics() {
    // Logic for updating metrics
  }

  private calculateIntegrationComplexity(): number {
    let complexity = 0;
    complexity += this.nexusState.complexity * 10;
    if (this.biometricState.isMeditating) complexity += 5;
    return complexity;
  }

  public performCleanup() {
    if (this.nexusState.userInfluence > 0) {
      this.nexusState.userInfluence = Math.max(
        0,
        this.nexusState.userInfluence - 0.01
      );
    }
  }

  private calculateOptimizedNavigationScale(
    visualIntensity: number = 0.5,
    moodIdentifier: string = "neutral"
  ): number {
    let scale = 1.0;
    if (visualIntensity > 0.7) scale = 1.02;
    if (moodIdentifier === "energetic") scale *= 1.01;
    return scale;
  }

  public getNavigationScalingReport() {
    return {
      target: this.nexusState.targetNavigationScale,
      current: this.nexusState.currentNavigationScale,
      intensity: this.nexusState.lastVisualIntensity,
      mood: this.nexusState.lastMoodIdentifier,
    };
  }

  public getMeditationReport() {
    return {
      isMeditating: this.biometricState.isMeditating,
      timeSinceInteraction:
        (Date.now() - this.biometricState.lastUserInteractionTime) / 1000,
      desaturation: this.biometricState.desaturation,
      slowdown: this.biometricState.slowdown,
    };
  }

  public override destroy() {
    // Remove generic interaction listeners
    if (this._interactionHandler) {
      ["click", "mousemove", "keydown"].forEach((evt) => {
        document.removeEventListener(
          evt,
          this._interactionHandler as EventListener
        );
      });
      // Remove scroll listeners
      this._scrollContainerElements.forEach((el) => {
        el.removeEventListener(
          "scroll",
          this._interactionHandler as EventListener
        );
      });
      this._interactionHandler = null;
    }

    // Call parent cleanup
    super.destroy();
  }
}
