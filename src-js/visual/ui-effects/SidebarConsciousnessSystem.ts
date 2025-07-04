import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { PerformanceProfile, Year3000Config } from "@/types/models";
import { HARMONIC_MODES } from "@/config/globalConfig";
import { Year3000System } from "@/core/lifecycle/year3000System";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { sample as sampleNoise } from "@/utils/graphics/NoiseField";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { BaseVisualSystem } from "../base/BaseVisualSystem";

// Type definitions
interface PerformanceMetrics {
  animationFrames: number;
  maxFrameTime: number;
  averageFrameTime: number;
  frameTimeHistory: number[];
  cssVariableUpdates: number;
  elementUpdates: number;
}

interface DeviceCapabilities {
  supportsCSSFilter: boolean;
  supportsTransforms: boolean;
  performanceLevel: "high" | "medium" | "low";
  reducedMotion: boolean;
}

interface AnimationState {
  lastPulse: number;
  pulseDirection: number;
  baseOpacity: number;
  currentScale: number;
  targetScale: number;
  smoothingFactor: number;
}

export class SidebarConsciousnessSystem extends BaseVisualSystem {
  // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
  public override onAnimate(deltaMs: number): void {
    // Basic implementation - can be enhanced in future phases
  }
  private year3000System: Year3000System | null;
  private masterAnimationRegistered: boolean;
  private isUsingMasterAnimation: boolean;
  private rootNavBar: HTMLElement | null = null;
  private overlayContainer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private consciousnessVisualizer: HTMLElement | null = null;
  private harmonicModeIndicator: HTMLElement | null = null;
  public consciousnessAnimationFrame: number | null = null;
  private currentHarmonicModeClass: string;
  private currentEnergyClass: string;
  private currentHarmonicModeKey: string;
  private nexusVariables: Record<string, any>;
  private performanceMetrics: PerformanceMetrics;
  private deviceCapabilities: DeviceCapabilities;
  private animationState: AnimationState;
  public modeConfig: any;

  // === Temporal Echo Pool ===
  private echoPool: HTMLElement[] = [];
  private currentEchoCount: number = 0;
  private static readonly BASE_MAX_ECHOES = 4;

  private _elementsWithActiveEcho: WeakSet<HTMLElement> = new WeakSet();
  // Stores nav interaction handler reference for clean removal.
  private _navInteractionHandler: ((evt: Event) => void) | null = null;
  /** Flag used to skip re-applying motion-disabled class when already set */
  private _lastMotionDisabled = false;

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
    this.masterAnimationRegistered = false;
    this.isUsingMasterAnimation = false;
    this.currentHarmonicModeClass = "";
    this.currentEnergyClass = "";
    this.currentHarmonicModeKey = "artist-vision";
    this.nexusVariables = {};

    this.performanceMetrics = {
      animationFrames: 0,
      maxFrameTime: 0,
      averageFrameTime: 0,
      frameTimeHistory: [],
      cssVariableUpdates: 0,
      elementUpdates: 0,
    };

    this.deviceCapabilities = {
      supportsCSSFilter: this._detectCSSFilterSupport(),
      supportsTransforms: this._detectTransformSupport(),
      performanceLevel: this._detectPerformanceLevel(),
      reducedMotion: this._detectReducedMotion(),
    };

    this.animationState = {
      lastPulse: 0,
      pulseDirection: 1,
      baseOpacity: 0.7,
      currentScale: 1.0,
      targetScale: 1.0,
      smoothingFactor: 0.15,
    };
  }

  private _detectCSSFilterSupport(): boolean {
    const el = document.createElement("div");
    el.style.filter = "blur(1px)";
    return !!el.style.filter;
  }

  private _detectTransformSupport(): boolean {
    const el = document.createElement("div");
    el.style.transform = "scale(1.1)";
    return !!el.style.transform;
  }

  private _detectPerformanceLevel(): "high" | "medium" | "low" {
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    if (memory >= 8 && cores >= 8) return "high";
    if (memory >= 4 && cores >= 4) return "medium";
    return "low";
  }

  private _detectReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  public override async initialize() {
    await super.initialize();
    this.rootNavBar = document.querySelector(".Root__nav-bar");
    if (!this.rootNavBar) {
      this.initialized = false;
      return;
    }
    this._createOverlayContainer();
    this._createConsciousnessVisualizer();
    this.createHarmonicModeDisplay();
    this.updateColors();

    // Attach focus & hover listeners for nav items → spawn echo
    if (this.rootNavBar) {
      this._navInteractionHandler = (evt: Event) => {
        const el = evt.target as HTMLElement;
        if (!el || !(el instanceof HTMLElement)) return;
        if (el.matches("a, button, [role='link']")) {
          this._spawnNavEcho(el as HTMLElement);
        }
      };
      this.rootNavBar.addEventListener(
        "focusin",
        this._navInteractionHandler,
        true
      );
      this.rootNavBar.addEventListener(
        "pointerenter",
        this._navInteractionHandler,
        true
      );
    }

    this._tryRegisterWithMasterAnimation();
    this._setupResizeObserver();
  }

  private _createOverlayContainer() {
    this.overlayContainer = document.createElement("div");
    this.overlayContainer.id = "sidebar-consciousness-overlay";
    this.overlayContainer.style.position = "absolute";
    this.overlayContainer.style.pointerEvents = "none";
    this.overlayContainer.style.zIndex = "1000";
    document.body.appendChild(this.overlayContainer);
  }

  private _setupResizeObserver() {
    if (!this.rootNavBar || !this.overlayContainer) return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect;
        if (this.overlayContainer) {
          this.overlayContainer.style.left = `${left}px`;
          this.overlayContainer.style.top = `${top}px`;
          this.overlayContainer.style.width = `${width}px`;
          this.overlayContainer.style.height = `${height}px`;
        }
      }
    });

    this.resizeObserver.observe(this.rootNavBar);
  }

  private _tryRegisterWithMasterAnimation() {
    if (
      this.year3000System &&
      (this.year3000System as any).registerAnimationSystem
    ) {
      try {
        (this.year3000System as any).registerAnimationSystem(
          "SidebarConsciousnessSystem",
          this,
          "background",
          this.deviceCapabilities.performanceLevel === "high" ? 30 : 15
        );
        this.masterAnimationRegistered = true;
        this.isUsingMasterAnimation = true;
      } catch (error) {
        this._startFallbackConsciousnessLoop();
      }
    } else {
      this._startFallbackConsciousnessLoop();
    }
  }

  private _startFallbackConsciousnessLoop() {
    this.isUsingMasterAnimation = false;
    this.startConsciousnessLoop();
  }

  public override updateAnimation(timestamp: number, deltaTime: number) {
    if (
      this.deviceCapabilities.reducedMotion ||
      !this.consciousnessVisualizer ||
      !this.rootNavBar
    )
      return;
    const time = timestamp * 0.001;
    const pulse = Math.sin(time * 2) * 0.1 + 0.9;
    this.animationState.targetScale = pulse;
    this.animationState.currentScale +=
      (this.animationState.targetScale - this.animationState.currentScale) *
      this.animationState.smoothingFactor;

    this.consciousnessVisualizer.style.transform = `translateX(-50%) scale(${this.animationState.currentScale.toFixed(
      3
    )})`;

    if (this.harmonicModeIndicator) {
      const opacity = (Math.sin(time * 1.5) * 0.1 + 0.85).toFixed(2);
      this.harmonicModeIndicator.style.opacity = opacity;
    }
  }

  public onPerformanceModeChange(mode: "high" | "medium" | "low") {
    if (mode === "low") {
      this.animationState.smoothingFactor = 0.3;
    } else {
      this.animationState.smoothingFactor = 0.15;
    }
  }

  public override handleSettingsChange(event: CustomEvent) {
    super.handleSettingsChange(event);
    if (event.detail.key === "sn-harmonic-mode") {
      this.updateHarmonicModeDisplay(event.detail.value);
    }
  }

  private _createConsciousnessVisualizer() {
    if (!this.overlayContainer) return;
    this.consciousnessVisualizer = document.createElement("div");
    this.consciousnessVisualizer.className = "sidebar-consciousness-visualizer";
    this.overlayContainer.appendChild(this.consciousnessVisualizer);
  }

  private createHarmonicModeDisplay() {
    if (!this.overlayContainer) return;
    this.harmonicModeIndicator = document.createElement("div");
    this.harmonicModeIndicator.className = "harmonic-mode-indicator";
    this.overlayContainer.appendChild(this.harmonicModeIndicator);
  }

  private updateColors() {
    if (
      !this.consciousnessVisualizer ||
      !this.harmonicModeIndicator ||
      !this.rootNavBar
    )
      return;
    const computedStyle = getComputedStyle(this.rootNavBar);
    const bgColor = computedStyle.getPropertyValue("--spice-sidebar");
    const textColor = computedStyle.getPropertyValue("--spice-text");

    this.consciousnessVisualizer.style.backgroundColor = bgColor;
    this.consciousnessVisualizer.style.borderColor = textColor;
    this.consciousnessVisualizer.style.borderWidth = "1px";
    this.consciousnessVisualizer.style.borderStyle = "solid";

    if (this.harmonicModeIndicator) {
      this.harmonicModeIndicator.style.backgroundColor = `rgba(${
        this.utils.hexToRgb(textColor)?.r
      }, ${this.utils.hexToRgb(textColor)?.g}, ${
        this.utils.hexToRgb(textColor)?.b
      }, 0.1)`;
      this.harmonicModeIndicator.style.color = textColor;
    }
  }

  private startConsciousnessLoop() {
    if (this.consciousnessAnimationFrame)
      cancelAnimationFrame(this.consciousnessAnimationFrame);
    const animate = (timestamp: number) => {
      this.updateAnimation(timestamp, 16.67);
      this.consciousnessAnimationFrame = requestAnimationFrame(animate);
    };
    this.consciousnessAnimationFrame = requestAnimationFrame(animate);
  }

  public updateHarmonicModeDisplay(newModeKey: string) {
    this.currentHarmonicModeKey = newModeKey;
    if (this.rootNavBar) {
      // Remove any existing harmonic mode classes to prevent conflicts.
      const classList = this.rootNavBar.classList;
      classList.forEach((className) => {
        if (className.startsWith("sn-harmonic-")) {
          classList.remove(className);
        }
      });

      // Add the new class based on the mode key.
      // This will activate the corresponding styles in the SCSS.
      const mode = HARMONIC_MODES[newModeKey];
      if (mode) {
        this.rootNavBar.classList.add(`sn-harmonic-${newModeKey}`);
      }
    }
  }

  private _updateSidebarVariables(processedMusicData: any = {}) {
    if (!this.rootNavBar) return;
    const {
      visualIntensity = 0.5,
      moodIdentifier = "neutral",
      energyLevel = "low",
    } = processedMusicData;
    this.rootNavBar.classList.remove(
      "sn-music-low-energy",
      "sn-music-mid-energy",
      "sn-music-high-energy"
    );
    this.rootNavBar.classList.add(`sn-music-${energyLevel}-energy`);
    this.rootNavBar.setAttribute("data-mood", moodIdentifier);

    // === Year 3000 – Dynamic navigation glow & text energy ===
    // Map music‐derived visual intensity (0–1) onto sidebar nav CSS vars so
    // SCSS in _sidebar_dimensional_nexus.scss can render real-time glow.
    const glow = Math.max(0, Math.min(1, visualIntensity));
    const textOpacity = Math.min(0.5, glow * 0.6);

    const applyCss = (prop: string, val: string) => {
      if (
        this.year3000System &&
        (this.year3000System as any).queueCSSVariableUpdate
      ) {
        (this.year3000System as any).queueCSSVariableUpdate(
          prop,
          val,
          this.rootNavBar as HTMLElement
        );
      } else {
        (this.rootNavBar as HTMLElement).style.setProperty(prop, val);
      }
    };

    applyCss("--sn-nav-item-glow-intensity", `${glow}`);
    applyCss("--sn-nav-text-energy-opacity", `${textOpacity}`);
    applyCss("--sidebar-intensity", `${visualIntensity}`);
  }

  public override updateFromMusicAnalysis(
    processedMusicData: any,
    rawFeatures?: any,
    trackUri?: string | null
  ): void {
    if (!this.initialized) return;
    super.updateFromMusicAnalysis(processedMusicData);
    this._updateSidebarVariables(processedMusicData);
  }

  public override updateModeConfiguration(modeConfig: any) {
    super.updateModeConfiguration(modeConfig);
    this.currentHarmonicModeKey = modeConfig.activeMode || "artist-vision";
    this.updateConsciousnessForMode();
    this.updateHarmonicModeDisplay(this.currentHarmonicModeKey);
  }

  private updateConsciousnessForMode() {
    if (this.consciousnessVisualizer) {
      const intensity = (this.modeConfig as any)?.intensityMultiplier || 1.0;
      this.consciousnessVisualizer.style.opacity = `${0.1 * intensity}`;
    }
  }

  public override destroy() {
    if (this.consciousnessAnimationFrame) {
      cancelAnimationFrame(this.consciousnessAnimationFrame);
    }
    // Clean up nav interaction listener
    if (this.rootNavBar && this._navInteractionHandler) {
      this.rootNavBar.removeEventListener(
        "focusin",
        this._navInteractionHandler,
        true
      );
      this.rootNavBar.removeEventListener(
        "pointerenter",
        this._navInteractionHandler,
        true
      );
      this._navInteractionHandler = null;
    }
    if (
      this.year3000System &&
      (this.year3000System as any).unregisterAnimationSystem
    ) {
      (this.year3000System as any).unregisterAnimationSystem(
        "SidebarConsciousnessSystem"
      );
    }
    if (this.resizeObserver && this.rootNavBar) {
      this.resizeObserver.unobserve(this.rootNavBar);
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
      this.overlayContainer = null;
    }
    if (this.rootNavBar) {
      const classList = this.rootNavBar.classList;
      classList.forEach((className) => {
        if (className.startsWith("sn-")) {
          classList.remove(className);
        }
      });
    }
    super.destroy();
  }

  // -------------------------------------------------------------------------
  // ⚡ TEMPORAL ECHO HELPERS (shared with BeatSync/DataGlyph)
  // -------------------------------------------------------------------------

  private get echoIntensitySetting(): number {
    const val = this.settingsManager?.get?.("sn-echo-intensity") ?? "2";
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? 2 : parsed;
  }

  private get dynamicMaxEchoes(): number {
    switch (this.echoIntensitySetting) {
      case 0:
        return 0;
      case 1:
        return Math.ceil(SidebarConsciousnessSystem.BASE_MAX_ECHOES / 2);
      case 3:
        return SidebarConsciousnessSystem.BASE_MAX_ECHOES * 2;
      default:
        return SidebarConsciousnessSystem.BASE_MAX_ECHOES;
    }
  }

  private _acquireEchoElement(): HTMLElement {
    let el = this.echoPool.pop();
    if (el) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    } else {
      el = document.createElement("div");
      el.className = "sn-temporal-echo";
    }
    return el;
  }

  private _releaseEchoElement(el: HTMLElement) {
    if (this.echoPool.length < 20) this.echoPool.push(el);
  }

  private _spawnNavEcho(element: HTMLElement) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (this.currentEchoCount >= this.dynamicMaxEchoes) return;
    if (this.echoIntensitySetting === 0) return;

    if (this._elementsWithActiveEcho.has(element)) return;

    const musicData = this.musicSyncService?.getLatestProcessedData() ?? {};
    const energy = musicData.energy ?? 0.5;
    const valence = musicData.valence ?? 0.5;

    const radius = Math.min(1.4, 1 + energy * 0.4);
    const hueShift = ((valence - 0.5) * 40).toFixed(1);

    const rect = element.getBoundingClientRect();
    const normX = rect.left / window.innerWidth;
    const normY = rect.top / window.innerHeight;
    const vec = sampleNoise(normX, normY);

    const beatVec = this.musicSyncService?.getCurrentBeatVector?.() ?? {
      x: 0,
      y: 0,
    };

    const offsetMagnitude = 6 + energy * 6;
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

    element.appendChild(echo);
    this.currentEchoCount++;
    this._elementsWithActiveEcho.add(element);

    setTimeout(() => {
      if (echo.parentElement) echo.parentElement.removeChild(echo);
      this.currentEchoCount--;
      this._releaseEchoElement(echo);
      this._elementsWithActiveEcho.delete(element);
    }, 1100);
  }

  // ---------------------------------------------------------------------
  // 🏎️  Performance-Aware Animation Gate
  // ---------------------------------------------------------------------
  /**
   * Overrides the base implementation so we can toggle a lightweight
   * CSS class (`sn-motion-disabled`) on the sidebar element whenever the
   * active PerformanceProfile suggests a "low" tier or when reduced motion
   * should be respected.  This allows the SCSS layer to instantly pause
   * expensive keyframes (vibrations, pulses, hue-shifts) without touching
   * inline styles.
   */
  public override applyPerformanceSettings(profile: PerformanceProfile): void {
    // Preserve existing behaviour (store on `currentPerformanceProfile` etc.)
    super.applyPerformanceSettings(profile as any);

    const lowPerf =
      !profile.enableGPUAcceleration || profile.animationThrottle >= 24;
    const motionDisabled = lowPerf || profile.reducedMotion;

    if (this.rootNavBar) {
      if (motionDisabled !== this._lastMotionDisabled) {
        this.rootNavBar.classList.toggle("sn-motion-disabled", motionDisabled);
        this._lastMotionDisabled = motionDisabled;
      }
    }
  }
}
