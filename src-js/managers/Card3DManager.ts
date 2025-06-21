import { CARD_3D_LEVEL_KEY } from "@/config/settingKeys";
import type { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import type { SettingsManager } from "@/managers/SettingsManager";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import type * as Utils from "@/utils/Year3000Utilities";

// ===================================================================
// 🃏 3D CARD MANAGER - Year 3000 Visual System
// ===================================================================
// Manages 3D transformations and effects for interactive cards.

interface Card3DConfig {
  perspective: number;
  maxRotation: number;
  scale: number;
  transitionSpeed: string;
  glowOpacity: number;
  selector: string;
}

export class Card3DManager implements IManagedSystem {
  public initialized = false;
  private static instance: Card3DManager;
  private config: Card3DConfig;
  private performanceMonitor: PerformanceAnalyzer;
  private settingsManager: SettingsManager;
  private utils: typeof Utils;
  private cards: NodeListOf<HTMLElement>;
  private cardQuerySelector =
    ".main-card-card, .main-gridContainer-gridContainer.main-gridContainer-fixedWidth";
  private cardEventHandlers: WeakMap<
    HTMLElement,
    {
      move: EventListenerOrEventListenerObject;
      leave: EventListenerOrEventListenerObject;
    }
  > = new WeakMap();

  private boundHandleSettingsChange: (event: Event) => void;

  public constructor(
    performanceMonitor: PerformanceAnalyzer,
    settingsManager: SettingsManager,
    utils: typeof Utils
  ) {
    this.config = {
      perspective: 1000,
      maxRotation: 5,
      scale: 1.02,
      transitionSpeed: "200ms",
      glowOpacity: 0.8,
      selector:
        ".main-card-card, .main-grid-grid > *, .main-shelf-shelf > * > *",
    };
    this.performanceMonitor = performanceMonitor;
    this.settingsManager = settingsManager;
    this.utils = utils;
    this.cards = document.querySelectorAll(this.config.selector);

    // Bind event handler once
    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
  }

  public static getInstance(
    performanceMonitor: PerformanceAnalyzer,
    settingsManager: SettingsManager,
    utils: typeof Utils
  ): Card3DManager {
    if (!Card3DManager.instance) {
      Card3DManager.instance = new Card3DManager(
        performanceMonitor,
        settingsManager,
        utils
      );
    }
    return Card3DManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    const quality = this.performanceMonitor.shouldReduceQuality();
    if (quality) {
      if (this.settingsManager.get("sn-3d-effects-level") !== "disabled") {
        console.log(
          `[Card3DManager] Performance is low. 3D effects disabled. Current quality: ${quality}`
        );
        return;
      }
    }
    // Re-query cards because the DOM may have changed since construction
    this.cards = document.querySelectorAll(this.config.selector);

    await this.applyEventListeners();

    // Listen for live settings changes
    document.addEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );

    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const elements = document.querySelectorAll(this.cardQuerySelector);
    if (elements.length > 0) {
      return { ok: true, details: `Found ${elements.length} cards to manage.` };
    }
    return {
      ok: false,
      details: "No card elements found with the configured selector.",
    };
  }

  public updateAnimation(deltaTime: number): void {
    // All animations are handled by CSS transitions triggered by mouse events.
  }

  public apply3DMode(mode: string): void {
    // TODO: Implement logic for different 3D morphing modes
    console.log(`[Card3DManager] Applying 3D mode: ${mode}`);
    if (mode === "disabled") {
      this.destroy();
    } else {
      this.initialize();
    }
  }

  private get shouldEnable3DEffects(): boolean {
    const quality = this.performanceMonitor.shouldReduceQuality();
    const setting = this.settingsManager.get("sn-enable3dCards" as any);
    return !quality && setting !== "disabled";
  }

  private async applyEventListeners(): Promise<void> {
    this.cards.forEach((card) => {
      // Skip if handlers for this card are already registered
      if (this.cardEventHandlers.has(card)) return;

      const moveHandler = (e: Event) =>
        this.handleMouseMove(card, e as MouseEvent);
      const leaveHandler = () => this.handleMouseLeave(card);

      this.cardEventHandlers.set(card, {
        move: moveHandler,
        leave: leaveHandler,
      });

      card.addEventListener("mousemove", moveHandler);
      card.addEventListener("mouseleave", leaveHandler);
    });
  }

  private handleMouseMove(card: HTMLElement, e: MouseEvent): void {
    if (!this.shouldEnable3DEffects) return;

    const { clientX, clientY } = e;
    const { top, left, width, height } = card.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;

    const rotateX = (this.config.maxRotation * (y - height / 2)) / (height / 2);
    const rotateY = (-this.config.maxRotation * (x - width / 2)) / (width / 2);

    card.style.transform = `perspective(${this.config.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.config.scale}, ${this.config.scale}, ${this.config.scale})`;
    card.style.transition = `transform ${this.config.transitionSpeed} ease-out`;

    this.applyGlow(card, x, y, width, height);
  }

  private handleMouseLeave(card: HTMLElement): void {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 600ms ease-in-out";
    this.removeGlow(card);
  }

  private applyGlow(
    card: HTMLElement,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    let glowElement = card.querySelector(".card-glow") as HTMLElement;
    if (!glowElement) {
      glowElement = document.createElement("div");
      glowElement.className = "card-glow";
      card.appendChild(glowElement);
    }

    glowElement.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--spice-rgb-button), ${this.config.glowOpacity}) 0%, transparent 40%)`;
  }

  private removeGlow(card: HTMLElement): void {
    const glowElement = card.querySelector(".card-glow") as HTMLElement;
    if (glowElement) {
      glowElement.style.background = "transparent";
    }
  }

  public destroy(): void {
    this.cards.forEach((card) => {
      const handlers = this.cardEventHandlers.get(card);
      if (handlers) {
        card.removeEventListener("mousemove", handlers.move);
        card.removeEventListener("mouseleave", handlers.leave);
        this.cardEventHandlers.delete(card);
      }

      this.removeGlow(card);
      card.style.transform = "";
      card.style.transition = "";
    });
    this.initialized = false;

    // Remove global listener
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
  }

  private handleSettingsChange(event: Event): void {
    const { key, value } = (event as CustomEvent).detail || {};
    if (key === CARD_3D_LEVEL_KEY) {
      this.apply3DMode(value);
    }
  }
}
