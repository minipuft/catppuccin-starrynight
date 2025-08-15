/**
 * Settings Manager - Now powered by the new type-safe settings system
 * Maintains exact same API for backward compatibility while using new architecture
 */

import {
  ARTISTIC_MODE_PROFILES,
  ADVANCED_SYSTEM_CONFIG as Config,
  HARMONIC_MODES as Modes,
} from "@/config/globalConfig";
import type { HarmonicMode } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Utils from "@/utils/core/ThemeUtilities";
import { settings, type TypedSettings } from "@/config";

declare const Spicetify: any;

// Theme settings interface for compatibility
export interface ThemeSettings {
  [key: string]: any;
  artisticMode?: string;
  paletteSystem?: string;
  gradientIntensity?: string;
  webglEnabled?: boolean;
  animationQuality?: string;
}

/**
 * SettingsManager - Compatibility wrapper around new type-safe settings system  
 * Now uses the typed settings system directly for improved reliability
 */
export class SettingsManager implements IManagedSystem {
  public initialized = false;

  constructor(
    config: typeof Config = Config,
    harmonicModes: typeof Modes = Modes,
    utils: typeof Utils = Utils
  ) {
    this.initialized = true;
    
    if (config?.enableDebug) {
      console.log("[SettingsManager] Initialized with new type-safe backend");
    }
  }

  public forceRepaint?(reason?: string): void {
    // Force repaint implementation for compatibility
    if (typeof document !== "undefined") {
      document.documentElement.style.display = "none";
      document.documentElement.offsetHeight; // Trigger reflow
      document.documentElement.style.display = "";
    }
  }

  public async initialize(): Promise<void> {
    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      healthy: this.initialized,
      system: "SettingsManager",
      details: this.initialized ? "Settings manager operational" : "Settings manager not initialized",
    };
  }

  public updateAnimation(): void {}

  public destroy(): void {
    this.initialized = false;
  }

  // Settings operations using the new typed settings system
  public get<K extends keyof ThemeSettings>(key: K): ThemeSettings[K] {
    try {
      // Map common legacy keys to typed settings
      switch (key) {
        case "artisticMode":
          return settings.get("sn-artistic-mode") as any;
        case "paletteSystem":
          return settings.get("sn-palette-system") as any;
        case "gradientIntensity":
          return settings.get("sn-gradient-intensity") as any;
        case "webglEnabled":
          return settings.get("sn-webgl-enabled") as any;
        case "animationQuality":
          return settings.get("sn-animation-quality") as any;
        default:
          // Try to get the setting directly by key name (for compatibility)
          if (typeof key === "string" && key.startsWith("sn-")) {
            return (settings as any).get(key);
          }
          return undefined as any;
      }
    } catch (error) {
      console.warn(`[SettingsManager] Failed to get setting ${String(key)}:`, error);
      return undefined as any;
    }
  }

  public getAllowedValues<K extends keyof ThemeSettings>(
    key: K
  ): ReadonlyArray<ThemeSettings[K]> | undefined {
    // Return allowed values based on key type
    switch (key) {
      case "artisticMode":
        return Object.keys(ARTISTIC_MODE_PROFILES) as any[];
      case "paletteSystem":
        return ["catppuccin", "year3000"] as any[];
      case "gradientIntensity":
        return ["disabled", "minimal", "balanced", "intense"] as any[];
      case "webglEnabled":
        return [true, false] as any[];
      case "animationQuality":
        return ["auto", "low", "high"] as any[];
      default:
        return undefined;
    }
  }

  public set<K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ): boolean {
    try {
      // Map common legacy keys to typed settings
      switch (key) {
        case "artisticMode":
          return settings.set("sn-artistic-mode", value);
        case "paletteSystem":
          return settings.set("sn-palette-system", value);
        case "gradientIntensity":
          return settings.set("sn-gradient-intensity", value as any);
        case "webglEnabled":
          return settings.set("sn-webgl-enabled", Boolean(value));
        case "animationQuality":
          return settings.set("sn-animation-quality", value as any);
        default:
          // Try to set the setting directly by key name (for compatibility)
          if (typeof key === "string" && key.startsWith("sn-")) {
            return (settings as any).set(key, value);
          }
          console.warn(`[SettingsManager] Unknown setting key: ${String(key)}`);
          return false;
      }
    } catch (error) {
      console.warn(`[SettingsManager] Failed to set setting ${String(key)}:`, error);
      return false;
    }
  }

  public getAllSettings(): ThemeSettings {
    return {
      artisticMode: this.get("artisticMode") || "artist-vision",
      paletteSystem: this.get("paletteSystem") || "catppuccin",
      gradientIntensity: this.get("gradientIntensity") || "balanced",
      webglEnabled: this.get("webglEnabled") ?? true,
      animationQuality: this.get("animationQuality") || "auto",
    };
  }

  public validateAndRepair(): void {
    // Validation is handled by the typed settings system
    console.log("[SettingsManager] Settings validation handled by typed system");
  }

  public resetAllToDefaults(): void {
    try {
      settings.set("sn-artistic-mode", "artist-vision");
      settings.set("sn-palette-system", "catppuccin");
      settings.set("sn-gradient-intensity", "balanced");
      settings.set("sn-webgl-enabled", true);
      settings.set("sn-animation-quality", "auto");
      console.log("[SettingsManager] Reset all settings to defaults");
    } catch (error) {
      console.warn("[SettingsManager] Failed to reset settings:", error);
    }
  }

  // Harmonic mode helpers
  public getCurrentHarmonicMode(): HarmonicMode {
    // Use artistic mode as proxy for harmonic mode since harmonic-mode is not in schema
    const currentMode = settings.get("sn-artistic-mode") || "artist-vision";
    // Map artistic modes to harmonic modes
    const harmonicMapping: Record<string, string> = {
      "artist-vision": "analogous-flow",
      "cosmic-maximum": "triadic-balance", 
      "corporate-safe": "monochromatic-smooth",
    };
    const harmonicKey = harmonicMapping[String(currentMode)] || "analogous-flow";
    const harmonicMode = Modes[harmonicKey as keyof typeof Modes];
    return harmonicMode || (Modes["analogous-flow"] as HarmonicMode);
  }

  public getHarmonicMode(key: string): HarmonicMode | undefined {
    return Modes[key as keyof typeof Modes];
  }
}
