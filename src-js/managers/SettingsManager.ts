import {
  ARTISTIC_MODE_PROFILES,
  YEAR3000_CONFIG as Config,
  HARMONIC_MODES as Modes,
} from "@/config/globalConfig";
import type { HarmonicMode } from "@/types/models";
import type { HealthCheckResult, IManagedSystem } from "@/types/systems";
import * as Utils from "@/utils/Year3000Utilities";

declare const Spicetify: any;

// Define the shape of our theme's settings
export interface ThemeSettings {
  "catppuccin-flavor": "mocha" | "latte" | "frappe" | "macchiato";
  "catppuccin-accentColor":
    | "rosewater"
    | "flamingo"
    | "pink"
    | "mauve"
    | "red"
    | "maroon"
    | "peach"
    | "yellow"
    | "green"
    | "teal"
    | "sky"
    | "sapphire"
    | "blue"
    | "lavender"
    | "text"
    | "none";
  "sn-star-density": "disabled" | "minimal" | "balanced" | "intense";
  "sn-gradient-intensity": "disabled" | "minimal" | "balanced" | "intense";
  "sn-glassmorphism-level": "disabled" | "minimal" | "moderate" | "intense";
  "sn-3d-effects-level": "full" | "minimal" | "disabled";
  "sn-artistic-mode": "corporate-safe" | "artist-vision" | "cosmic-maximum";
  "sn-current-harmonic-mode": keyof typeof Modes;
  "sn-harmonic-intensity": string; // Stored as string, parsed to float
  "sn-harmonic-evolution": string; // Stored as string, parsed to boolean
  "sn-harmonic-manual-base-color": string; // Hex color or empty
  "sn-enable-webgpu": "true" | "false"; // Enable or disable WebGPU acceleration
}

type ValidationSchema = {
  [K in keyof ThemeSettings]: {
    default: ThemeSettings[K];
    allowedValues?: ReadonlyArray<ThemeSettings[K]>;
  };
};

export class SettingsManager implements IManagedSystem {
  public initialized = false;
  private config: typeof Config;
  private harmonicModes: typeof Modes;
  private utils: typeof Utils;
  private defaults: ThemeSettings;
  private validationSchemas: ValidationSchema;

  constructor(
    config: typeof Config = Config,
    harmonicModes: typeof Modes = Modes,
    utils: typeof Utils = Utils
  ) {
    this.config = config;
    this.harmonicModes = harmonicModes;
    this.utils = utils;

    this.defaults = {
      "catppuccin-flavor": "mocha",
      "catppuccin-accentColor": "mauve",
      "sn-star-density": "balanced",
      "sn-gradient-intensity": "balanced",
      "sn-glassmorphism-level": "moderate",
      "sn-3d-effects-level": "full",
      "sn-artistic-mode": "artist-vision",
      "sn-current-harmonic-mode": "analogous-flow",
      "sn-harmonic-intensity": "0.7",
      "sn-harmonic-evolution": "true",
      "sn-harmonic-manual-base-color": "",
      "sn-enable-webgpu": "true",
    };

    this.validationSchemas = {
      "catppuccin-flavor": {
        default: "mocha",
        allowedValues: ["latte", "frappe", "macchiato", "mocha"],
      },
      "catppuccin-accentColor": {
        default: "mauve",
        allowedValues: [
          "rosewater",
          "flamingo",
          "pink",
          "mauve",
          "red",
          "maroon",
          "peach",
          "yellow",
          "green",
          "teal",
          "sky",
          "sapphire",
          "blue",
          "lavender",
          "text",
          "none",
        ],
      },
      "sn-star-density": {
        default: "balanced",
        allowedValues: ["disabled", "minimal", "balanced", "intense"],
      },
      "sn-gradient-intensity": {
        default: "balanced",
        allowedValues: ["disabled", "minimal", "balanced", "intense"],
      },
      "sn-glassmorphism-level": {
        default: "moderate",
        allowedValues: ["disabled", "minimal", "moderate", "intense"],
      },
      "sn-3d-effects-level": {
        default: "full",
        allowedValues: ["full", "minimal", "disabled"],
      },
      "sn-artistic-mode": {
        default: "artist-vision",
        allowedValues: Object.keys(ARTISTIC_MODE_PROFILES) as (
          | "corporate-safe"
          | "artist-vision"
          | "cosmic-maximum"
        )[],
      },
      "sn-current-harmonic-mode": {
        default: "analogous-flow",
        allowedValues: Object.keys(
          this.harmonicModes
        ) as (keyof typeof Modes)[],
      },
      "sn-harmonic-intensity": { default: "0.7" },
      "sn-harmonic-evolution": {
        default: "true",
        allowedValues: ["true", "false"],
      },
      "sn-harmonic-manual-base-color": { default: "" },
      "sn-enable-webgpu": {
        default: "true",
        allowedValues: ["true", "false"],
      },
    };

    this.validateAndRepair();
    this.initialized = true;
  }

  public async initialize(): Promise<void> {
    // No async initialization needed for settings manager
    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    try {
      // A simple check to ensure localStorage is accessible
      Spicetify.LocalStorage.get("spicetify-exp-features");
      return { ok: true, details: "LocalStorage is accessible." };
    } catch (e: any) {
      return {
        ok: false,
        details: "Failed to access Spicetify.LocalStorage.",
        issues: [e.message],
      };
    }
  }

  public get<K extends keyof ThemeSettings>(key: K): ThemeSettings[K] {
    try {
      const value = Spicetify.LocalStorage.get(key);
      const schema = this.validationSchemas[key];

      if (!schema) {
        console.warn(`StarryNight: No validation schema for key: ${key}.`);
        return value as ThemeSettings[K];
      }

      if (
        value === null ||
        (schema.allowedValues && !schema.allowedValues.includes(value as any))
      ) {
        return schema.default;
      }
      return value as ThemeSettings[K];
    } catch (error) {
      console.error(`StarryNight: Error reading key ${key}:`, error);
      return this.validationSchemas[key]?.default;
    }
  }

  public getAllowedValues<K extends keyof ThemeSettings>(
    key: K
  ): ReadonlyArray<ThemeSettings[K]> | undefined {
    return this.validationSchemas[key]?.allowedValues;
  }

  public set<K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ): boolean {
    try {
      const schema = this.validationSchemas[key];

      if (!schema) {
        Spicetify.LocalStorage.set(key, value as string);
        return true;
      }

      if (key === "sn-harmonic-manual-base-color") {
        if (
          value !== "" &&
          !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value as string)
        ) {
          return false;
        }
      } else if (
        schema.allowedValues &&
        !schema.allowedValues.includes(value as any)
      ) {
        return false;
      }

      Spicetify.LocalStorage.set(key, value as string);

      document.dispatchEvent(
        new CustomEvent("year3000SystemSettingsChanged", {
          detail: { key, value },
        })
      );

      return true;
    } catch (error) {
      console.error(`StarryNight: Error setting key ${key}:`, error);
      return false;
    }
  }

  public getAllSettings(): ThemeSettings {
    const settings: Partial<ThemeSettings> = {};
    for (const key in this.validationSchemas) {
      (settings as any)[key] = this.get(key as keyof ThemeSettings);
    }
    return settings as ThemeSettings;
  }

  public validateAndRepair(): void {
    let repairedCount = 0;
    for (const key in this.validationSchemas) {
      const aKey = key as keyof ThemeSettings;
      const currentValue = Spicetify.LocalStorage.get(aKey);
      const validatedValue = this.get(aKey);

      if (currentValue !== validatedValue) {
        this.set(aKey, validatedValue);
        repairedCount++;
      }
    }
    if (repairedCount > 0) {
      console.log(`StarryNight: Repaired ${repairedCount} invalid settings.`);
    }
  }

  public resetAllToDefaults(): void {
    for (const key of Object.keys(this.defaults)) {
      this.set(
        key as keyof ThemeSettings,
        this.defaults[key as keyof ThemeSettings]
      );
    }
    console.log("StarryNight: All settings reset to defaults.");
  }

  // To satisfy the SystemHealthMonitor, which expects all registered systems
  // to have these lifecycle methods.
  public updateAnimation(): void {
    // SettingsManager does not perform any animations.
  }

  public destroy(): void {
    // No specific cleanup needed for SettingsManager.
    console.log("StarryNight: SettingsManager destroyed (no-op).");
  }

  // === NEW: Harmonic mode helpers ===========================================
  /**
   * Return the full HarmonicMode object for the currently selected mode.
   * Falls back to the default entry ("analogous-flow") if the key is missing.
   */
  public getCurrentHarmonicMode(): HarmonicMode {
    const key = this.get("sn-current-harmonic-mode");
    return (this.harmonicModes[key as keyof typeof Modes] ||
      this.harmonicModes["analogous-flow"]) as HarmonicMode;
  }

  /**
   * Retrieve a HarmonicMode definition by key, or undefined if not found.
   */
  public getHarmonicMode(key: string): HarmonicMode | undefined {
    return this.harmonicModes[key as keyof typeof Modes] as
      | HarmonicMode
      | undefined;
  }
}
