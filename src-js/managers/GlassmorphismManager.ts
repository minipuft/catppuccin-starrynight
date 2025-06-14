import { YEAR3000_CONFIG as Config } from "@/config/globalConfig";
import { GLASS_LEVEL_KEY, GLASS_LEVEL_OLD_KEY } from "@/config/settingKeys";
import { CSSVariableBatcher } from "@/core/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import type { SettingsManager } from "@/managers/SettingsManager";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Utils from "@/utils/Year3000Utilities";

type GlassIntensity =
  | "disabled"
  | "minimal"
  | "balanced"
  | "intense"
  | "moderate";

declare const Spicetify: any;

export class GlassmorphismManager implements IManagedSystem {
  public initialized = false;
  private static instance: GlassmorphismManager;
  private config: typeof Config;
  private utils: typeof Utils;
  private cssBatcher: CSSVariableBatcher | null = null;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;
  private settingsManager: SettingsManager;
  private isSupported: boolean;
  private currentIntensity: GlassIntensity;
  private boundHandleSettingsChange: (event: Event) => void;
  private observers: MutationObserver[] = [];

  constructor(
    config: typeof Config = Config,
    utils: typeof Utils = Utils,
    cssBatcher: CSSVariableBatcher | null = null,
    performanceAnalyzer: PerformanceAnalyzer | null = null,
    settingsManager: SettingsManager
  ) {
    this.config = config;
    this.utils = utils;
    this.cssBatcher = cssBatcher;
    this.performanceAnalyzer = performanceAnalyzer;
    this.settingsManager = settingsManager;
    this.isSupported = this.detectBackdropFilterSupport();
    this.currentIntensity = "balanced";
    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);
    this.initialize();
  }

  public static getInstance(): GlassmorphismManager {
    if (!GlassmorphismManager.instance) {
      throw new Error("GlassmorphismManager instance not initialized");
    }
    return GlassmorphismManager.instance;
  }

  public async initialize(): Promise<void> {
    const initialIntensity = this.settingsManager.get("sn-glassmorphism-level");
    this.applyGlassmorphismSettings(initialIntensity);
    document.addEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return { ok: true, details: "GlassmorphismManager is operational." };
  }

  public updateAnimation(deltaTime: number): void {
    // This manager is driven by events, not animation frames.
  }

  public destroy(): void {
    document.removeEventListener(
      "year3000SystemSettingsChanged",
      this.boundHandleSettingsChange
    );
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.initialized = false;
  }

  private handleSettingsChange(event: Event): void {
    const customEvent = event as CustomEvent;
    const { key, value } = customEvent.detail || {};
    if (key === GLASS_LEVEL_KEY || key === GLASS_LEVEL_OLD_KEY) {
      this.applyGlassmorphismSettings(value);
    }
  }

  private detectBackdropFilterSupport(): boolean {
    try {
      return (
        CSS.supports("backdrop-filter", "blur(1px)") ||
        CSS.supports("-webkit-backdrop-filter", "blur(1px)")
      );
    } catch (error) {
      console.warn(
        "StarryNight: CSS.supports not available, assuming no backdrop-filter support",
        error
      );
      return false;
    }
  }

  public applyGlassmorphismSettings(intensity: GlassIntensity): void {
    const body = document.body;
    body.classList.remove(
      "sn-glass-disabled",
      "sn-glass-minimal",
      "sn-glass-balanced",
      "sn-glass-intense"
    );
    body.classList.add(`sn-glass-${intensity}`);
    this.currentIntensity = intensity;
    this.updateGlassVariables(intensity);
  }

  private updateGlassVariables(intensity: GlassIntensity): void {
    const root = document.documentElement;
    const shouldReduceQuality =
      this.performanceAnalyzer?.shouldReduceQuality() || false;

    let blurValue: string, opacityValue: string, saturationValue: string;

    switch (intensity) {
      case "disabled":
        root.style.removeProperty("--glass-blur");
        root.style.removeProperty("--glass-opacity");
        root.style.removeProperty("--glass-saturation");
        return;
      case "minimal":
        blurValue = shouldReduceQuality ? "8px" : "10px";
        opacityValue = "0.05";
        saturationValue = "1.05";
        break;
      case "intense":
        blurValue = shouldReduceQuality ? "20px" : "30px";
        opacityValue = "0.15";
        saturationValue = "1.4";
        break;
      case "balanced":
      default:
        blurValue = shouldReduceQuality ? "15px" : "20px";
        opacityValue = "0.1";
        saturationValue = "1.2";
        break;
    }

    root.style.setProperty("--glass-blur", blurValue);
    root.style.setProperty("--glass-opacity", opacityValue);
    root.style.setProperty("--glass-saturation", saturationValue);
  }

  public updateGlassColors(primaryColor: string, secondaryColor: string): void {
    if (this.currentIntensity === "disabled") return;

    const root = document.documentElement;
    const glassPrimary = this.convertToGlassColor(primaryColor, 0.1);
    const glassSecondary = this.convertToGlassColor(secondaryColor, 0.08);

    root.style.setProperty("--glass-background", glassPrimary);
    root.style.setProperty("--glass-border", glassSecondary);
  }

  private convertToGlassColor(color: string, opacity: number): string {
    try {
      if (typeof color !== "string") return `rgba(255, 255, 255, ${opacity})`;
      if (color.startsWith("rgb")) {
        const values = color.match(/\d+/g);
        if (values && values.length >= 3) {
          return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${opacity})`;
        }
      }
      if (color.startsWith("#")) {
        const hex = color.slice(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      }
      return `rgba(255, 255, 255, ${opacity})`;
    } catch (error) {
      return `rgba(255, 255, 255, ${opacity})`;
    }
  }

  public checkPerformanceAndAdjust(): void {
    if (this.performanceAnalyzer?.shouldReduceQuality() || false) {
      if (this.currentIntensity === "intense") {
        this.applyGlassmorphismSettings("balanced");
      } else if (
        this.currentIntensity === "balanced" ||
        this.currentIntensity === "moderate"
      ) {
        this.applyGlassmorphismSettings("minimal");
      }
    }
  }

  public applyGlassmorphism(
    level: "disabled" | "minimal" | "moderate" | "intense"
  ): void {
    const glassConfig = this.config.glassmorphism[level];
    if (!this.cssBatcher) return;

    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-display",
      level === "disabled" ? "none" : "block"
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-blur",
      `${glassConfig.blur}px`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-saturation",
      `${glassConfig.saturation}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-brightness",
      `${glassConfig.brightness}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-noise-opacity",
      `${glassConfig.noiseOpacity}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-border-opacity",
      `${glassConfig.borderOpacity}`
    );
    this.cssBatcher.queueCSSVariableUpdate(
      "--sn-glass-shadow-opacity",
      `${glassConfig.shadowOpacity}`
    );

    this.cssBatcher.flushCSSVariableBatch();
    if (this.config.enableDebug) {
      console.log(`💎 [GlassmorphismManager] Applied level: ${level}`);
    }
  }

  // --------------------------------------------------------------------
  // Year3000System central settings broadcast hook
  // --------------------------------------------------------------------
  public applyUpdatedSettings?(key: string, value: any): void {
    if (key === "sn-glassmorphism-level") {
      this.applyGlassmorphismSettings(value as any);
    }
  }
}
