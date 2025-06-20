import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import type { Year3000Config } from "@/types/models";
import { restartCssAnimation } from "@/utils/animationUtils";
import { Year3000System } from "../../core/year3000System";
import { MODERN_SELECTORS } from "../../debug/SpotifyDOMSelectors";
import { SettingsManager } from "../../managers/SettingsManager";
import { MusicSyncService } from "../../services/MusicSyncService";
import { sample as sampleNoise } from "../../utils/NoiseField";
import * as Year3000Utilities from "../../utils/Year3000Utilities";
import { BaseVisualSystem } from "../BaseVisualSystem";

// Type definitions
interface DeviceCapabilities {
  maxParticles: number;
  supportsCSSFilter: boolean;
  supportsWebGL: boolean;
  performanceLevel: "high" | "medium" | "low";
  reducedMotion: boolean;
}

interface PerformanceMetrics {
  glyphUpdates: number;
  echoEffects: number;
  memoryCleanups: number;
  cacheHits: number;
  cacheMisses: number;
  animationFrames: number;
  maxFrameTime: number;
  averageFrameTime: number;
  frameTimeHistory: number[];
  observedItemsCleanups: number;
}

interface MemoryOptimization {
  maxCacheSize: number;
  cleanupInterval: number;
  lastCleanup: number;
  maxEchoTimers: number;
  maxObservedItems: number;
  staleItemThreshold: number;
}

interface GlyphData {
  id: string;
  type: "track" | "album" | "artist" | "playlist";
  lastInteracted: number;
  intensity: number;
  kineticState: {
    velocity: { x: number; y: number };
    rotation: number;
    scale: number;
  };
  musicContext: any;
  attentionScore: number;
}

// YEAR 3000 DATA GLYPH SYSTEM
export class DataGlyphSystem extends BaseVisualSystem {
  private year3000System: Year3000System | null;
  private masterAnimationRegistered: boolean = false;
  public animationFrameId: number | null = null;
  private isUsingMasterAnimation: boolean = false;
  private itemObserver: MutationObserver | null = null;
  private observedItems: Map<Element, { removeListeners: () => void }>;
  private glyphDataCache: WeakMap<Element, GlyphData>;
  private itemInteractionData: Map<Element, any>;
  private activeEchoTimers: WeakMap<Element, NodeJS.Timeout>;
  private glyphElements: Map<Element, HTMLElement | null>;
  private interactionHistory: any[];
  private modeIntensity: number;
  public modeConfig: any;
  private lastHeavyUpdateTime: number;
  private heavyUpdateInterval: number;
  private memoryOptimization: MemoryOptimization;
  private performanceMetrics: PerformanceMetrics;
  private deviceCapabilities: DeviceCapabilities;
  private _eventListeners: any[];
  private _domEventListeners: any[];
  private hoverTimeouts: WeakMap<Element, NodeJS.Timeout> = new WeakMap();
  // Active echo elements tracked for the low-cost lifecycle maintenance loop.
  private activeEchoElements: Set<HTMLElement> = new Set();
  // Timestamp gate for throttling maintenance pass (ms since epoch) – avoids running heavy DOM ops every frame.
  private _lastEchoMaintenance = 0;
  private currentEchoCount = 0;
  // --- Phase4: recent echo timestamps per element for clustering -----------
  private recentEchoes: WeakMap<Element, number[]> = new WeakMap();
  // Tracks which elements currently host an active echo to avoid rapid re-spawning
  private _elementsWithActiveEcho: WeakSet<HTMLElement> = new WeakSet();
  // Pool of detached .sn-temporal-echo elements reused to cut GC churn.
  private echoPool: HTMLElement[] = [];
  private static readonly BASE_MAX_ECHOES = 6;
  // --- Phase4 -------------------------------------------------------------
  /** Flag toggled by MasterAnimationCoordinator – echo spawning is skipped
   *  entirely while in performance mode to preserve frame budget. */
  private _performanceMode = false;

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
    this.observedItems = new Map();
    this.glyphDataCache = new WeakMap();
    this.itemInteractionData = new Map();
    this.activeEchoTimers = new WeakMap();
    this.glyphElements = new Map();
    this.interactionHistory = [];
    this.modeIntensity = 0.5;
    this.lastHeavyUpdateTime = 0;
    this.heavyUpdateInterval = 1000;
    this._eventListeners = [];
    this._domEventListeners = [];

    this.memoryOptimization = {
      maxCacheSize: 100,
      cleanupInterval: 30000,
      lastCleanup: Date.now(),
      maxEchoTimers: 50,
      maxObservedItems: 200,
      staleItemThreshold: 300000,
    };

    this.performanceMetrics = {
      glyphUpdates: 0,
      echoEffects: 0,
      memoryCleanups: 0,
      cacheHits: 0,
      cacheMisses: 0,
      animationFrames: 0,
      maxFrameTime: 0,
      averageFrameTime: 0,
      frameTimeHistory: [],
      observedItemsCleanups: 0,
    };

    this.deviceCapabilities = {
      maxParticles: this._detectMaxParticles(),
      supportsCSSFilter: this._detectCSSFilterSupport(),
      supportsWebGL: this._detectWebGLSupport(),
      performanceLevel: this._detectPerformanceLevel(),
      reducedMotion: this._detectReducedMotion(),
    };

    const healthMonitor = this.utils.getHealthMonitor();
    if (healthMonitor) {
      healthMonitor.registerSystem("DataGlyphSystem", this);
    }
  }

  private _detectMaxParticles(): number {
    const memory = (navigator as any).deviceMemory || 4;
    const baseParticles = 50;
    return Math.min(200, Math.max(20, baseParticles * (memory / 4)));
  }

  private _detectCSSFilterSupport(): boolean {
    const testElement = document.createElement("div");
    testElement.style.filter = "blur(1px)";
    return testElement.style.filter === "blur(1px)";
  }

  private _detectWebGLSupport(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
  }

  private _detectPerformanceLevel(): "high" | "medium" | "low" {
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 2;
    if (memory >= 8 && cores >= 8) return "high";
    if (memory >= 4 && cores >= 4) return "medium";
    return "low";
  }

  private _detectReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async initialize() {
    await super.initialize();
    this._tryRegisterWithMasterAnimation();
    this.setupItemObserver();
  }

  private _tryRegisterWithMasterAnimation() {
    if (
      this.year3000System &&
      (this.year3000System as any).registerAnimationSystem
    ) {
      try {
        (this.year3000System as any).registerAnimationSystem(
          "DataGlyphSystem",
          this,
          "normal",
          this.deviceCapabilities.performanceLevel === "high" ? 60 : 30
        );
        this.masterAnimationRegistered = true;
        this.isUsingMasterAnimation = true;
      } catch (error) {
        this._startFallbackAnimationLoop();
      }
    } else {
      this._startFallbackAnimationLoop();
    }
  }

  private _startFallbackAnimationLoop() {
    this.isUsingMasterAnimation = false;
    const fallbackLoop = () => {
      if (!this.initialized) return;
      this.updateAnimation(performance.now(), 16.67);
      this.animationFrameId = requestAnimationFrame(fallbackLoop);
    };
    this.animationFrameId = requestAnimationFrame(fallbackLoop);
  }

  // Conforms to MasterAnimationCoordinator – delegates to updateAnimation
  public onAnimate(deltaMs: number): void {
    this.updateAnimation(performance.now(), deltaMs);
  }

  public updateAnimation(timestamp: number, deltaTime: number) {
    const frameStartTime = performance.now();
    try {
      const maxFrameTime =
        this.deviceCapabilities.performanceLevel === "high"
          ? 8
          : this.deviceCapabilities.performanceLevel === "medium"
          ? 12
          : 16;
      if (deltaTime > maxFrameTime * 2) {
        this.performanceMetrics.animationFrames++;
        return;
      }
      if (timestamp - this.lastHeavyUpdateTime > this.heavyUpdateInterval) {
        this.lastHeavyUpdateTime = timestamp;
        this._updateGlyphTargetsOptimized();
      }
      this.animateAllGlyphs();
      this.updateActiveEchoesAndResonance();
      if (
        timestamp - this.memoryOptimization.lastCleanup >
        this.memoryOptimization.cleanupInterval
      ) {
        this.performOptimizedCleanup();
      }
      const frameTime = performance.now() - frameStartTime;
      this.updatePerformanceMetrics(frameTime);
    } catch (error) {
      console.error(`[${this.systemName}] Animation update error:`, error);
    }
  }

  public onPerformanceModeChange(mode: "performance" | "quality") {
    if (mode === "performance") {
      this.heavyUpdateInterval = 1500;
      this.memoryOptimization.maxObservedItems = 100;
      this._performanceMode = true;
    } else {
      this.heavyUpdateInterval = 1000;
      this.memoryOptimization.maxObservedItems = 200;
      this._performanceMode = false;
    }
  }

  /**
   * Optimized maintenance pass executed at a relatively low frequency (default 1 s).
   * Responsibilities:
   *   1. Detach glyphs whose host elements have been removed from the DOM.
   *   2. Ensure we respect the `maxObservedItems` cap.
   *   3. NO full-document `querySelectorAll` – MutationObserver already attaches new glyphs.
   *
   *  This change aligns with the Year 3000 "Kinetic Verbs" ethos—moving lightly through the
   *  DOM constellation instead of flooding it with scans every 50 ms.
   */
  private _updateGlyphTargetsOptimized() {
    // 1. Clean up elements that are no longer connected to the document
    this.observedItems.forEach((_, itemElement) => {
      if (!document.contains(itemElement)) {
        const glyph = this.glyphElements.get(itemElement);
        if (glyph) {
          this.detachGlyph(itemElement, glyph);
        }
      }
    });

    // 2. If we still exceed the allowed budget, prune the oldest *off-screen* entries.
    //    This prevents visible / hovered items from losing their glyphs and being
    //    re-attached repeatedly (which looked like the element itself was being
    //    removed and re-added).
    if (this.observedItems.size > this.memoryOptimization.maxObservedItems) {
      const overflow =
        this.observedItems.size - this.memoryOptimization.maxObservedItems;
      const iterator = this.observedItems.keys();
      let pruned = 0;
      while (pruned < overflow) {
        const elem = iterator.next().value as Element | undefined;
        if (!elem) break;
        // Skip if element is currently visible in the viewport; defer its cleanup.
        if (this._isElementInViewport(elem)) continue;

        const glyph = this.glyphElements.get(elem);
        if (glyph) {
          this.detachGlyph(elem, glyph);
          pruned++;
        }
      }
    }
  }

  private _isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private setupItemObserver() {
    const observerCallback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // ELEMENT_NODE
              this._scanAndAttachGlyphs(node as Element);
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              this._scanAndDetachGlyphs(node as Element);
            }
          });
        }
      }
    };
    this.itemObserver = new MutationObserver(observerCallback);
    this.itemObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private _scanAndAttachGlyphs(rootElement: Element) {
    const selector = Object.values(MODERN_SELECTORS).join(", ");
    if (!selector) return;
    const items = rootElement.matches(selector)
      ? [rootElement]
      : Array.from(rootElement.querySelectorAll(selector));
    items.forEach((item) => this.attachGlyph(item as HTMLElement));
  }

  private _scanAndDetachGlyphs(rootElement: Element) {
    const selector = Object.values(MODERN_SELECTORS).join(", ");
    if (!selector) return;
    const items = rootElement.matches(selector)
      ? [rootElement]
      : Array.from(rootElement.querySelectorAll(selector));
    items.forEach((item) => {
      const glyph = this.glyphElements.get(item);
      if (glyph) this.detachGlyph(item, glyph);
    });
  }

  private attachGlyph(itemElement: HTMLElement) {
    if (
      this.glyphElements.has(itemElement) ||
      this.observedItems.size >= this.memoryOptimization.maxObservedItems
    )
      return;

    // We now render the glyph via ::after pseudo-element. Just tag the element.
    itemElement.setAttribute("data-sn-glyph", "");
    this.glyphElements.set(itemElement, null);

    const data = this.updateGlyphData(itemElement, {});
    this.glyphDataCache.set(itemElement, data);

    const boundHandleInteraction = (event: Event) =>
      this.handleItemInteraction(itemElement, event);
    itemElement.addEventListener("mouseenter", boundHandleInteraction);
    itemElement.addEventListener("mouseleave", boundHandleInteraction);
    const removeListeners = () => {
      itemElement.removeEventListener("mouseenter", boundHandleInteraction);
      itemElement.removeEventListener("mouseleave", boundHandleInteraction);
    };

    this.observedItems.set(itemElement, { removeListeners });
  }

  private detachGlyph(itemElement: Element, _glyphElement: HTMLElement | null) {
    // Remove attribute so pseudo-element disappears
    if (itemElement instanceof HTMLElement) {
      itemElement.removeAttribute("data-sn-glyph");
    }

    const observation = this.observedItems.get(itemElement);
    if (observation) {
      observation.removeListeners();
      this.observedItems.delete(itemElement);
    }

    this.glyphDataCache.delete(itemElement);
    this.itemInteractionData.delete(itemElement);
  }

  private animateAllGlyphs() {
    this.observedItems.forEach((_, itemElement) => {
      const itemData = this.glyphDataCache.get(itemElement);
      if (itemData) {
        this.updateGlyphVisuals(itemElement as HTMLElement, itemData);
      }
    });
  }

  private updateGlyphVisuals(itemElement: HTMLElement, itemData: GlyphData) {
    const targetEl =
      this.glyphElements.get(itemElement) ?? null
        ? this.glyphElements.get(itemElement)!
        : (itemElement as HTMLElement);

    const musicData = this.musicSyncService?.getLatestProcessedData();
    let intensity = 0;
    if (musicData) {
      intensity = musicData.energy * 0.5 + musicData.valence * 0.5;
    }
    intensity = (intensity + itemData.attentionScore) / 2;

    const applyCss = (prop: string, val: string, el: HTMLElement) => {
      if (
        this.year3000System &&
        (this.year3000System as any).queueCSSVariableUpdate
      ) {
        (this.year3000System as any).queueCSSVariableUpdate(prop, val, el);
      } else {
        el.style.setProperty(prop, val);
      }
    };

    applyCss("--glyph-intensity", `${intensity}`, targetEl);
    applyCss("--sn-glyph-opacity", `${(intensity * 0.8).toFixed(2)}`, targetEl);
  }

  private updateGlyphData(
    itemElement: HTMLElement,
    data: Partial<GlyphData>
  ): GlyphData {
    let glyphData = this.glyphDataCache.get(itemElement);
    if (!glyphData) {
      glyphData = {
        id: itemElement.getAttribute("data-uri") || `glyph-${Date.now()}`,
        type: "track",
        lastInteracted: 0,
        intensity: 0,
        kineticState: { velocity: { x: 0, y: 0 }, rotation: 0, scale: 1 },
        musicContext: {},
        attentionScore: 0,
      };
    }
    const updatedData = { ...glyphData, ...data };
    this.glyphDataCache.set(itemElement, updatedData);
    return updatedData;
  }

  private handleItemInteraction(itemElement: HTMLElement, event: Event) {
    const glyphData = this.updateGlyphData(itemElement, {
      lastInteracted: Date.now(),
      attentionScore: event.type === "mouseenter" ? 1 : 0,
    });
    if (event.type === "mouseenter") {
      // Start dwell-timer (120 ms) to avoid accidental flickers
      const dwell = setTimeout(() => {
        this.addTemporalEcho(itemElement);
      }, 120);
      this.hoverTimeouts.set(itemElement, dwell);
    } else if (event.type === "mouseleave") {
      // Clear pending echo if user leaves early
      const t = this.hoverTimeouts.get(itemElement);
      if (t) clearTimeout(t);
      this.hoverTimeouts.delete(itemElement);
    }
  }

  private updateActiveEchoesAndResonance() {
    // Lightweight per-frame echo maintenance.
    if (this.currentEchoCount === 0 || this.echoIntensitySetting === 0) return;

    // Honour reduced-motion preference.
    if (this.deviceCapabilities.reducedMotion) return;

    const now = Date.now();

    // Throttle heavy DOM iteration to once every 400 ms.
    if (now - this._lastEchoMaintenance < 400) return;
    this._lastEchoMaintenance = now;

    // Iterate through tracked echoes; cull stale ones (>1.6 s) or detached nodes.
    this.activeEchoElements.forEach((echo) => {
      const created = parseInt((echo.dataset as any).created ?? "0", 10);
      const stale = now - created > 1600;
      const disconnected = !document.contains(echo);

      if (stale || disconnected) {
        try {
          if (echo.parentElement) echo.parentElement.removeChild(echo);
        } catch (_) {
          /* ignore */
        }
        this.releaseEchoElement(echo);
        this.activeEchoElements.delete(echo);
        this.currentEchoCount = Math.max(0, this.currentEchoCount - 1);
      }
    });
  }

  public destroy() {
    super.destroy();
    if (this.itemObserver) this.itemObserver.disconnect();
    this.observedItems.forEach((val, key) =>
      this.detachGlyph(key, this.glyphElements.get(key)!)
    );
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private performOptimizedCleanup() {
    const now = Date.now();
    // Clean up old interaction data
    for (const [element, data] of this.itemInteractionData.entries()) {
      if (
        now - data.lastInteraction >
        this.memoryOptimization.staleItemThreshold
      ) {
        this.itemInteractionData.delete(element);
      }
    }
    // Clean up stale observed items
    if (this.observedItems.size > this.memoryOptimization.maxObservedItems) {
      for (const [element, data] of this.observedItems.entries()) {
        const glyphData = this.glyphDataCache.get(element);
        if (
          !glyphData ||
          now - glyphData.lastInteracted >
            this.memoryOptimization.staleItemThreshold
        ) {
          this.detachGlyph(element, this.glyphElements.get(element)!);
        }
        if (this.observedItems.size <= this.memoryOptimization.maxObservedItems)
          break;
      }
    }
    this.memoryOptimization.lastCleanup = now;
  }

  private updatePerformanceMetrics(frameTime: number) {
    this.performanceMetrics.animationFrames++;
    this.performanceMetrics.frameTimeHistory.push(frameTime);
    if (this.performanceMetrics.frameTimeHistory.length > 100) {
      this.performanceMetrics.frameTimeHistory.shift();
    }
    this.performanceMetrics.maxFrameTime = Math.max(
      this.performanceMetrics.maxFrameTime,
      frameTime
    );
    this.performanceMetrics.averageFrameTime =
      this.performanceMetrics.frameTimeHistory.reduce((a, b) => a + b, 0) /
      this.performanceMetrics.frameTimeHistory.length;
  }

  private calculateGlyphComplexity(): number {
    return this.observedItems.size;
  }

  private estimateMemoryUsage(): number {
    return this.observedItems.size * 5 + this.itemInteractionData.size * 2; // Rough estimation
  }

  public updateModeConfiguration(modeConfig: any) {
    super.updateModeConfiguration(modeConfig);
    if (modeConfig.glyphIntensity) {
      this.modeIntensity = modeConfig.glyphIntensity;
    }
    this.applyModeToExistingGlyphs();
  }

  private applyModeToExistingGlyphs() {
    this.observedItems.forEach((_, item) => {
      const glyph = this.glyphElements.get(item);
      if (glyph) {
        glyph.setAttribute(
          "data-glyph-mode",
          (this.modeConfig as any).activeMode || "default"
        );
      }
    });
  }

  private addTemporalEcho(element: HTMLElement) {
    // Accessibility: respect prefers-reduced-motion & global performance mode
    if (this.deviceCapabilities.reducedMotion) return;
    if (this._performanceMode) return;
    // Prevent spawning a new echo if one is already active on this element
    if (this._elementsWithActiveEcho.has(element)) return;
    // ---------------- Phase4: check for clustering -------------------------
    const now = Date.now();
    const bucket = this.recentEchoes.get(element) ?? [];
    // keep only last 300ms
    const filtered = bucket.filter((t) => now - t < 300);
    filtered.push(now);
    this.recentEchoes.set(element, filtered);

    const spawnMega = filtered.length >= 3;
    if (spawnMega) {
      // prevent further normal echoes in this window by clearing timestamps
      this.recentEchoes.set(element, []);
    }

    // Perf guard – cap simultaneous echoes
    if (this.currentEchoCount >= this.dynamicMaxEchoes) return;

    if (this.echoIntensitySetting === 0) return; // feature disabled

    // --- Phase3: Acquire pooled element or create new ---------------
    const echo = this.acquireEchoElement();

    // Inject music-aware CSS vars
    const musicData = this.musicSyncService?.getLatestProcessedData();
    const energy = musicData?.energy ?? 0;
    const valence = musicData?.valence ?? 0.5;

    const intensityFactor = 0.2 * this.echoIntensitySetting; // 0..0.6
    let radius = Math.min(1.6, 1 + energy * 0.4 + intensityFactor);
    const hueShift = ((valence - 0.5) * 40).toFixed(1);

    // Beat vector contributes directional drift -----------------------------
    const beatVec = this.musicSyncService?.getCurrentBeatVector?.();

    // --- Phase2: Noise-driven spatial offsets -----------------------
    let offsetX = 0,
      offsetY = 0,
      skewDeg = 0;
    try {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = Math.min(Math.max(centerX / window.innerWidth, 0), 1);
      const normY = Math.min(Math.max(centerY / window.innerHeight, 0), 1);

      const vec = sampleNoise(normX, normY);

      const intensityMult = this.echoIntensitySetting; // 1..3
      const offsetMagnitude = 6 + energy * 6 + intensityMult * 2; // px

      offsetX = vec.x * offsetMagnitude;
      offsetY = vec.y * offsetMagnitude;

      if (beatVec) {
        offsetX += beatVec.x * 10; // k = 10px per requirements
        offsetY += beatVec.y * 10;
      }
      skewDeg = vec.x * 6; // small rotational flavour
    } catch (e) {
      // Fallback to centered echo if sampling fails
    }

    // --- Phase4: Mega ripple adjustments -----------------------------------
    if (spawnMega) {
      radius = Math.min(radius * 1.6, 2.4); // limit growth
      echo.style.setProperty("--sn-kinetic-intensity", "0.4");

      // Promote burst into materialization resonance glow.
      try {
        const pmSystem = (this.year3000System as any)
          ?.predictiveMaterializationSystem;
        if (
          pmSystem &&
          typeof pmSystem.triggerAnticipatoryWarmth === "function"
        ) {
          pmSystem.triggerAnticipatoryWarmth(element, {
            hue: parseFloat(hueShift),
            intensity: 0.18,
            durationMs: 1200,
          });
        }
      } catch (err) {
        if (this.config?.enableDebug) {
          console.warn(
            `[${this.systemName}] Failed to trigger resonance:`,
            err
          );
        }
      }
    }

    // Rotation start angle (beat-aligned) ------------------------------------
    const baseAngle = (Math.random() * 360).toFixed(1);

    echo.style.setProperty("--sn-echo-radius-multiplier", radius.toFixed(2));
    echo.style.setProperty("--sn-echo-hue-shift", `${hueShift}deg`);

    echo.style.setProperty("--sn-echo-offset-x", `${offsetX.toFixed(1)}px`);
    echo.style.setProperty("--sn-echo-offset-y", `${offsetY.toFixed(1)}px`);
    echo.style.setProperty("--sn-echo-skew", `${skewDeg.toFixed(2)}deg`);
    echo.style.setProperty("--sn-echo-rotate", `${baseAngle}deg`);

    // Register echo for lifecycle maintenance.
    this.activeEchoElements.add(echo);
    (echo.dataset as any).created = `${Date.now()}`;

    element.appendChild(echo);
    this.currentEchoCount++;

    // mark element as having an active echo
    this._elementsWithActiveEcho.add(element);

    setTimeout(() => {
      if (echo.parentElement) echo.parentElement.removeChild(echo);
      this.currentEchoCount--;
      // Remove from active set to avoid double-handling
      this.activeEchoElements.delete(echo);
      this.releaseEchoElement(echo);
      this._elementsWithActiveEcho.delete(element);
    }, 1250); // slightly longer than longest layer duration
  }

  private get echoIntensitySetting(): number {
    const val = this.settingsManager?.get?.("sn-echo-intensity") ?? "2";
    const parsed = parseInt(val as string, 10);
    return isNaN(parsed) ? 2 : parsed;
  }

  private get dynamicMaxEchoes(): number {
    switch (this.echoIntensitySetting) {
      case 0:
        return 0; // disabled
      case 1:
        return Math.ceil(DataGlyphSystem.BASE_MAX_ECHOES / 2);
      case 3:
        return DataGlyphSystem.BASE_MAX_ECHOES * 2;
      default:
        return DataGlyphSystem.BASE_MAX_ECHOES;
    }
  }

  // --- Phase3 helper methods ---------------------------------------
  /** Obtain an echo element from pool or create */
  private acquireEchoElement(): HTMLElement {
    let el = this.echoPool.pop();
    if (el) {
      // Reset via Web-Animations API without triggering layout thrash
      restartCssAnimation(el);
    } else {
      el = document.createElement("div");
      el.className = "sn-temporal-echo";
    }
    return el;
  }

  /** Return echo element to pool (bounded) */
  private releaseEchoElement(el: HTMLElement) {
    this.echoPool.push(el);
    const limit = this.dynamicMaxEchoes + 2;
    if (this.echoPool.length > limit) {
      this.echoPool.shift(); // discard oldest to cap memory
    }
  }
}
