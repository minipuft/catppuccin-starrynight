import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { PerformanceProfile, AdvancedSystemConfig } from "@/types/models";
import { HARMONIC_MODES } from "@/config/globalConfig";
import { ThemeLifecycleCoordinator } from "@/core/lifecycle/ThemeLifecycleCoordinator";
// NOTE: SettingsManager import removed - using TypedSettingsManager singleton via typed settings
import { sample as sampleNoise } from "@/utils/graphics/NoiseField";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
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

// === Visual Interaction System (simplified from complex flow physics) ===
interface VisualInteractionState {
  direction: 'horizontal' | 'vertical' | 'radial' | 'spiral';
  intensity: number; // 0-1 scale
  velocity: number; // pixels per second
  smoothing: number; // animation smoothing factor (0-1)
  effectPoints: EffectPoint[];
}

interface EffectPoint {
  x: number;
  y: number;
  magnitude: number;
  direction: number; // radians
  influence: number; // 0-1 radius of influence
}

interface InteractionPattern {
  id: string;
  type: 'hover' | 'click' | 'focus' | 'proximity' | 'gesture';
  response: VisualResponse;
  duration: number; // milliseconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'smooth';
  priority: number; // 0-10 for interaction priority
}

interface VisualResponse {
  intensityChange: number; // -1 to 1
  velocityChange: number; // -1 to 1
  smoothingChange: number; // -1 to 1
  visualEffects: VisualEffect[];
  rippleEffect: boolean;
  glowEffect: boolean;
}

interface VisualEffect {
  center: { x: number; y: number };
  radius: number;
  strength: number; // 0-1
  decay: number; // how fast it fades
  type: 'wave' | 'spiral' | 'pulse' | 'vortex';
}

interface UserInteractionState {
  globalIntensity: number;
  dominantDirection: number; // radians
  interactionCount: number;
  lastInteractionTime: number;
  proximityElements: Array<{
    element: HTMLElement;
    distance: number;
    influence: number;
  }>;
}

export class SidebarVisualEffectsSystem extends BaseVisualSystem {
  // TODO: Implement abstract onAnimate method for Year 3000 MasterAnimationCoordinator
  public override onAnimate(deltaMs: number): void {
    // Basic implementation - can be enhanced in future phases
  }
  private year3000System: ThemeLifecycleCoordinator | null;
  private masterAnimationRegistered: boolean;
  private isUsingMasterAnimation: boolean;
  private rootNavBar: HTMLElement | null = null;
  private overlayContainer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private visualEffectsElement: HTMLElement | null = null;
  private harmonicModeIndicator: HTMLElement | null = null;
  // ✅ RAF LOOP CONSOLIDATION: Removed visualEffectsAnimationFrame (coordinator manages animation)
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
  // Timer counter for unique timer IDs
  private echoTimerCounter: number = 0;
  /** Flag used to skip re-applying motion-disabled class when already set */
  private _lastMotionDisabled = false;

  // === Visual Interaction System (simplified interaction detection) ===
  private visualState: VisualInteractionState;
  private interactionPatterns: Map<string, InteractionPattern> = new Map();
  private userInteractionState: UserInteractionState;
  private proximityObserver: IntersectionObserver | null = null;
  private interactionElements: Map<string, HTMLElement> = new Map();
  private activeEffects: VisualEffect[] = [];
  
  // Animation state tracking
  private animationPhase = 0;
  private localFrameCount = 0;
  private musicBeatIntensity = 0;
  private musicEnergyLevel = 0;
  private cursorPosition = { x: 0, y: 0 };
  private cursorVelocity = { x: 0, y: 0 };
  private lastCursorUpdate = 0;
  
  // Performance parameters
  private readonly MAX_EFFECT_POINTS = 50;
  private readonly EFFECT_DECAY_RATE = 0.05;
  private readonly PROXIMITY_THRESHOLD = 100; // pixels
  private readonly INTERACTION_COOLDOWN = 16; // ms (~60fps)
  private readonly ANIMATION_LERP = 0.08;
  private readonly SMOOTHING_LERP = 0.12;
  private readonly INTENSITY_LERP = 0.15;

  constructor(
    config: AdvancedSystemConfig,
    utils: typeof ThemeUtilities,
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService,
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
    year3000System: ThemeLifecycleCoordinator | null = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService);
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

    // Initialize visual interaction system (simplified from complex flow physics)
    this.visualState = {
      direction: 'radial',
      intensity: 0.3,
      velocity: 50,
      smoothing: 0.7,
      effectPoints: []
    };
    
    this.userInteractionState = {
      globalIntensity: 0,
      dominantDirection: 0,
      interactionCount: 0,
      lastInteractionTime: 0,
      proximityElements: []
    };
    
    // Initialize effect points for visual feedback
    this.setupEffectPoints();
    
    // Initialize interaction patterns for user feedback
    this.setupInteractionPatterns();

    if (config.enableDebug) {
      console.log(`[${this.systemName}] Enhanced with visual interaction system`);
    }
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
    this._createVisualEffectsElement();
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
    this.overlayContainer.id = "sidebar-visual-effects-overlay";
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
          "SidebarVisualEffectsSystem",
          this,
          "background",
          this.deviceCapabilities.performanceLevel === "high" ? 30 : 15
        );
        this.masterAnimationRegistered = true;
        this.isUsingMasterAnimation = true;
      } catch (error) {
        this._startFallbackVisualEffectsLoop();
      }
    } else {
      this._startFallbackVisualEffectsLoop();
    }
  }

  /**
   * ✅ RAF LOOP CONSOLIDATION: Fallback removed - now always uses coordinator
   * VisualEffectsCoordinator.registerAnimationSystems() handles registration automatically
   */
  private _startFallbackVisualEffectsLoop() {
    // No-op: Fallback no longer needed - coordinator registration is guaranteed
    this.isUsingMasterAnimation = true;
  }

  public override updateAnimation(deltaTime: number) {
    if (
      this.deviceCapabilities.reducedMotion ||
      !this.visualEffectsElement ||
      !this.rootNavBar
    )
      return;
    const timestamp = performance.now();
    const time = timestamp * 0.001;
    const pulse = Math.sin(time * 2) * 0.1 + 0.9;
    this.animationState.targetScale = pulse;
    this.animationState.currentScale +=
      (this.animationState.targetScale - this.animationState.currentScale) *
      this.animationState.smoothingFactor;

    this.visualEffectsElement.style.transform = `translateX(-50%) scale(${this.animationState.currentScale.toFixed(
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

  private _createVisualEffectsElement() {
    if (!this.overlayContainer) return;
    this.visualEffectsElement = document.createElement("div");
    this.visualEffectsElement.className = "sidebar-visual-effects-element";
    this.overlayContainer.appendChild(this.visualEffectsElement);
  }

  private createHarmonicModeDisplay() {
    if (!this.overlayContainer) return;
    this.harmonicModeIndicator = document.createElement("div");
    this.harmonicModeIndicator.className = "harmonic-mode-indicator";
    this.overlayContainer.appendChild(this.harmonicModeIndicator);
  }

  private updateColors() {
    if (
      !this.visualEffectsElement ||
      !this.harmonicModeIndicator ||
      !this.rootNavBar
    )
      return;
    const computedStyle = getComputedStyle(this.rootNavBar);
    const bgColor = computedStyle.getPropertyValue("--spice-sidebar");
    const textColor = computedStyle.getPropertyValue("--spice-text");

    this.visualEffectsElement.style.backgroundColor = bgColor;
    this.visualEffectsElement.style.borderColor = textColor;
    this.visualEffectsElement.style.borderWidth = "1px";
    this.visualEffectsElement.style.borderStyle = "solid";

    if (this.harmonicModeIndicator) {
      this.harmonicModeIndicator.style.backgroundColor = `rgba(${
        this.utils.hexToRgb(textColor)?.r
      }, ${this.utils.hexToRgb(textColor)?.g}, ${
        this.utils.hexToRgb(textColor)?.b
      }, 0.1)`;
      this.harmonicModeIndicator.style.color = textColor;
    }
  }

  /**
   * ✅ RAF LOOP REMOVED - Managed by AnimationFrameCoordinator
   *
   * Benefits:
   * - Single RAF loop for all systems
   * - Shared deltaTime calculation
   * - Priority-based execution order
   * - Automatic registration via VisualEffectsCoordinator
   *
   * Old method removed: startVisualEffectsLoop()
   * Replacement: updateAnimation(deltaTime) called by coordinator
   */

  /**
   * Mapping from HARMONIC_MODES keys to SCSS class names in _sn_advanced_visual_effects.scss
   * This ensures TypeScript applies the correct CSS classes that match the SCSS selectors
   */
  private readonly HARMONIC_MODE_TO_CSS_CLASS: Record<string, string> = {
    "analogous-flow": "sn-color-harmony-analogous-flow",
    "triadic-trinity": "sn-color-harmony-triadic-scheme",
    "complementary-yin-yang": "sn-color-harmony-complementary-contrast",
    "tetradic-advanced-cross": "sn-color-harmony-tetradic-cross",
    "tetradic-cosmic-cross": "sn-color-harmony-tetradic-cross",
    "split-complementary-spectrum": "sn-color-harmony-split-complementary-spectrum",
    "split-complementary-aurora": "sn-color-harmony-split-complementary-spectrum",
    "monochromatic-calm": "sn-color-harmony-monochromatic-calm",
    "monochromatic-meditation": "sn-color-harmony-monochromatic-calm",
  };

  public updateHarmonicModeDisplay(newModeKey: string) {
    this.currentHarmonicModeKey = newModeKey;
    if (this.rootNavBar) {
      // Remove any existing color harmony mode classes to prevent conflicts
      const classList = this.rootNavBar.classList;
      classList.forEach((className) => {
        if (className.startsWith("sn-color-harmony-")) {
          classList.remove(className);
        }
      });

      // Add the new class based on the mode key mapping to SCSS class names
      // This activates the corresponding styles in _sn_advanced_visual_effects.scss
      const mode = HARMONIC_MODES[newModeKey];
      const cssClassName = this.HARMONIC_MODE_TO_CSS_CLASS[newModeKey];
      if (mode && cssClassName) {
        this.rootNavBar.classList.add(cssClassName);
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
    this.updateVisualEffectsForMode();
    this.updateHarmonicModeDisplay(this.currentHarmonicModeKey);
  }

  private updateVisualEffectsForMode() {
    if (this.visualEffectsElement) {
      const intensity = (this.modeConfig as any)?.intensityMultiplier || 1.0;
      this.visualEffectsElement.style.opacity = `${0.1 * intensity}`;
    }
  }

  public override destroy() {
    // ✅ RAF LOOP CONSOLIDATION: No need to cancel animation frame - coordinator handles this

    // Clean up all pending echo timers
    if (this.year3000System?.timerConsolidationSystem) {
      for (let i = 0; i < this.echoTimerCounter; i++) {
        this.year3000System.timerConsolidationSystem.unregisterConsolidatedTimer(
          `SidebarVisualEffectsSystem-echo-${i}`
        );
      }
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
        "SidebarVisualEffectsSystem"
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
    // NOTE: Echo intensity setting has been removed - use default balanced value
    const val = "2"; // Default balanced echo intensity
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 2 : parsed;
  }

  private get dynamicMaxEchoes(): number {
    switch (this.echoIntensitySetting) {
      case 0:
        return 0;
      case 1:
        return Math.ceil(SidebarVisualEffectsSystem.BASE_MAX_ECHOES / 2);
      case 3:
        return SidebarVisualEffectsSystem.BASE_MAX_ECHOES * 2;
      default:
        return SidebarVisualEffectsSystem.BASE_MAX_ECHOES;
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

    // Use TimerConsolidationSystem if available, otherwise fall back to setTimeout
    const timerId = `SidebarVisualEffectsSystem-echo-${this.echoTimerCounter++}`;
    const cleanup = () => {
      if (echo.parentElement) echo.parentElement.removeChild(echo);
      this.currentEchoCount--;
      this._releaseEchoElement(echo);
      this._elementsWithActiveEcho.delete(element);
    };
    
    if (this.year3000System?.timerConsolidationSystem) {
      this.year3000System.timerConsolidationSystem.registerConsolidatedTimer(
        timerId,
        cleanup,
        1100,
        "background"
      );
    } else {
      setTimeout(cleanup, 1100);
    }
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

  // =========================================================================
  // FLOW PHYSICS SYSTEM (from SidebarInteractiveFlowSystem)
  // =========================================================================

  /**
   * Setup effect points for visual interaction feedback
   */
  private setupEffectPoints(): void {
    this.visualState.effectPoints = [];
    
    // Create a grid of effect points for visual feedback
    const gridSize = 8;
    const spacing = 20;
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const effectPoint: EffectPoint = {
          x: x * spacing,
          y: y * spacing,
          magnitude: 0.5 + Math.random() * 0.5,
          direction: Math.random() * Math.PI * 2,
          influence: 0.3 + Math.random() * 0.4
        };
        
        this.visualState.effectPoints.push(effectPoint);
      }
    }
  }

  /**
   * Setup interaction patterns for user feedback responses
   */
  private setupInteractionPatterns(): void {
    // Hover pattern - gentle visual feedback
    this.interactionPatterns.set('hover', {
      id: 'hover',
      type: 'hover',
      response: {
        intensityChange: 0.2,
        velocityChange: 0.1,
        smoothingChange: -0.1,
        visualEffects: [{
          center: { x: 0, y: 0 },
          radius: 30,
          strength: 0.3,
          decay: 0.05,
          type: 'wave'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 300,
      easing: 'smooth',
      priority: 3
    });
    
    // Click pattern - stronger visual response
    this.interactionPatterns.set('click', {
      id: 'click',
      type: 'click',
      response: {
        intensityChange: 0.5,
        velocityChange: 0.3,
        smoothingChange: -0.2,
        visualEffects: [{
          center: { x: 0, y: 0 },
          radius: 50,
          strength: 0.7,
          decay: 0.08,
          type: 'pulse'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 500,
      easing: 'smooth',
      priority: 8
    });
    
    // Focus pattern - sustained visual highlight
    this.interactionPatterns.set('focus', {
      id: 'focus',
      type: 'focus',
      response: {
        intensityChange: 0.3,
        velocityChange: 0.05,
        smoothingChange: 0.1,
        visualEffects: [{
          center: { x: 0, y: 0 },
          radius: 40,
          strength: 0.4,
          decay: 0.02,
          type: 'spiral'
        }],
        rippleEffect: false,
        glowEffect: true
      },
      duration: 1000,
      easing: 'smooth',
      priority: 6
    });
  }

  /**
   * Setup proximity detection using Intersection Observer
   */
  private setupProximityDetection(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.proximityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const element = entry.target as HTMLElement;
            const elementId = element.id || element.className;
            
            if (entry.isIntersecting) {
              this.interactionElements.set(elementId, element);
              this.handleProximityEnter(element);
            } else {
              this.interactionElements.delete(elementId);
              this.handleProximityExit(element);
            }
          });
        },
        {
          threshold: [0, 0.1, 0.5, 1.0],
          rootMargin: `${this.PROXIMITY_THRESHOLD}px`
        }
      );
    }
  }

  /**
   * Handle proximity enter for visual feedback
   */
  private handleProximityEnter(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    const distance = Math.sqrt(
      Math.pow(center.x - this.cursorPosition.x, 2) +
      Math.pow(center.y - this.cursorPosition.y, 2)
    );
    
    this.userInteractionState.proximityElements.push({
      element,
      distance,
      influence: Math.max(0, 1 - (distance / this.PROXIMITY_THRESHOLD))
    });
  }

  /**
   * Handle proximity exit for liquid visual effects
   */
  private handleProximityExit(element: HTMLElement): void {
    this.userInteractionState.proximityElements = 
      this.userInteractionState.proximityElements.filter(item => item.element !== element);
  }

  /**
   * Update visual effects processing
   */
  private updateVisualEffects(): void {
    this.activeEffects = this.activeEffects.filter(effect => {
      effect.strength *= (1 - effect.decay);
      return effect.strength > 0.01;
    });
    
    this.activeEffects.forEach(effect => {
      this.visualState.effectPoints.forEach(point => {
        const distance = Math.sqrt(
          Math.pow(point.x - effect.center.x, 2) +
          Math.pow(point.y - effect.center.y, 2)
        );
        
        if (distance < effect.radius) {
          const influence = effect.strength * (1 - distance / effect.radius);
          
          switch (effect.type) {
            case 'wave':
              point.magnitude += influence * 0.3;
              break;
            case 'spiral':
              point.direction += influence * 0.5;
              break;
            case 'pulse':
              point.magnitude += influence * 0.5;
              point.direction += influence * 0.2;
              break;
            case 'vortex':
              const angle = Math.atan2(
                point.y - effect.center.y,
                point.x - effect.center.x
              );
              point.direction = angle + influence * Math.PI * 0.5;
              break;
          }
        }
      });
    });
  }

  /**
   * Update music visual effects
   */
  private updateMusicVisualEffects(): void {
    const musicIntensity = this.musicBeatIntensity * 0.3;
    this.visualState.intensity = Math.max(this.visualState.intensity, musicIntensity);
    
    const musicVelocityBoost = this.musicEnergyLevel * 30;
    this.visualState.velocity = Math.min(200, this.visualState.velocity + musicVelocityBoost);
    
    const musicSmoothingAdjustment = (1 - this.musicEnergyLevel) * 0.2;
    this.visualState.smoothing = Math.max(0.1, this.visualState.smoothing - musicSmoothingAdjustment);
  }

  /**
   * Get current visual state for external access
   */
  public getVisualState(): VisualInteractionState {
    return { ...this.visualState };
  }

  /**
   * Get user interaction state for external access
   */
  public getUserInteractionState(): UserInteractionState {
    return { ...this.userInteractionState };
  }

  /**
   * Get active effects for external access
   */
  public getActiveEffects(): VisualEffect[] {
    return [...this.activeEffects];
  }
}
