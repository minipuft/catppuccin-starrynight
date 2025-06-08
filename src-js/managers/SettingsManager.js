import {
  ARTISTIC_MODE_PROFILES,
  HARMONIC_MODES as GLOBAL_HARMONIC_MODES,
  YEAR3000_CONFIG as GLOBAL_YEAR3000_CONFIG,
} from "../config/globalConfig.js";

export class SettingsManager {
  constructor(config, harmonicModes, utils) {
    this.config = config || GLOBAL_YEAR3000_CONFIG;
    this.harmonicModes = harmonicModes || GLOBAL_HARMONIC_MODES;
    this.utils = utils;

    this.settingsKey = "catppuccinStarryNightSettings"; // Potentially unused if individual keys are preferred

    this.defaults = {
      "catppuccin-accentColor": "mauve",
      "sn-gradientIntensity": "balanced",
      "sn-starDensity": "balanced",
      "sn-performanceQuality": "auto",
      "sn-glassmorphismIntensity": "moderate",
      "sn-3dMorphingMode": "dynamic",
      "sn-artisticMode": "artist-vision",
      // NEW: Harmonic Defaults
      "sn-currentHarmonicMode": "analogous-flow",
      "sn-harmonicIntensity": "0.7", // Stored as string, parsed to float later
      "sn-harmonicEvolution": "true", // Stored as string, parsed to boolean later
      "sn-harmonicManualBaseColor": "", // NEW: Empty string means auto/album art
    };

    this.validationSchemas = {
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
      "sn-gradientIntensity": {
        default: "balanced",
        allowedValues: ["disabled", "minimal", "balanced", "intense"],
      },
      "sn-starDensity": {
        default: "balanced",
        allowedValues: ["disabled", "minimal", "balanced", "intense"],
      },
      "sn-performanceQuality": {
        default: "auto",
        allowedValues: ["auto", "optimized", "high-fidelity"],
      },
      "sn-glassmorphismIntensity": {
        default: "moderate",
        allowedValues: ["disabled", "minimal", "moderate", "intense"],
      },
      "sn-3dMorphingMode": {
        default: "dynamic",
        allowedValues: [
          "disabled",
          "minimal",
          "balanced",
          "floating",
          "intense",
          "dynamic",
        ],
      },
      "sn-artisticMode": {
        default: "artist-vision",
        // Use ARTISTIC_MODE_PROFILES for dynamic allowed values
        allowedValues: Object.keys(ARTISTIC_MODE_PROFILES),
      },
      // NEW: Harmonic Validation Schemas
      "sn-currentHarmonicMode": {
        default: "analogous-flow",
        allowedValues: Object.keys(this.harmonicModes), // Dynamically get allowed modes
      },
      "sn-harmonicIntensity": {
        default: "0.7",
        // For sliders, we validate range/type upon retrieval/use.
      },
      "sn-harmonicEvolution": {
        default: "true",
        allowedValues: ["true", "false"],
      },
      // NEW: Manual Base Color Validation
      "sn-harmonicManualBaseColor": {
        default: "", // Empty string for auto
        // Validation will be primarily by regex on input, here we just define it exists
        // Allowed values could be a regex, but for simplicity, direct validation on set/get is better.
      },
    };

    Object.keys(this.defaults).forEach((key) => {
      if (this.validationSchemas[key]) {
        if (this.validationSchemas[key].default !== this.defaults[key]) {
          console.warn(
            `StarryNight: SettingsManager constructor: Default for '${key}' mismatch. Schema: '${this.validationSchemas[key].default}', Defaults: '${this.defaults[key]}'. Using schema default.`
          );
          this.defaults[key] = this.validationSchemas[key].default;
        }
      } else {
        console.warn(
          `StarryNight: SettingsManager constructor: No validationSchema for default setting '${key}'.`
        );
      }
    });

    // YEAR3000_CONFIG.enableDebug is used implicitly by console.warn/error. No direct check needed in constructor.
    this.settings = this.loadSettings(); // settings property might be unused if get/set directly use localStorage
    this.validateAndRepair();
  }

  loadSettings() {
    // This method seems less relevant if get/set directly use localStorage and validationSchemas.
    // However, it can be used to populate an in-memory `this.settings` object if desired.
    const loadedSettings = {};
    Object.keys(this.validationSchemas).forEach((key) => {
      loadedSettings[key] = this.get(key); // Populate from validated localStorage
    });
    if (this.config.enableDebug) {
      console.log(
        "[StarryNight SettingsManager] All settings loaded into memory cache (this.settings)."
      );
    }
    return loadedSettings;
  }

  get(key) {
    try {
      const value = Spicetify.LocalStorage.get(key);
      const schema = this.validationSchemas[key];

      if (!schema) {
        console.warn(
          `StarryNight: No validation schema for key: ${key}. Returning raw value or null.`
        );
        return value; // Return raw value if no schema, or null if not found
      }

      if (
        value === null ||
        (schema.allowedValues && !schema.allowedValues.includes(value))
      ) {
        if (value !== null && this.config.enableDebug) {
          // Log only if there was an invalid value, not if it was missing
          console.warn(
            `StarryNight: Invalid or missing value '${value}' for ${key}, using default '${schema.default}'`
          );
        }
        return schema.default;
      }
      return value;
    } catch (error) {
      console.error(
        `StarryNight: Error reading localStorage key ${key}:`,
        error,
        `Using default '${this.validationSchemas[key]?.default}'.`
      );
      return this.validationSchemas[key]?.default || null;
    }
  }

  set(key, value, skipSave = false) {
    // Added skipSave, though original didn't have it, good for batch ops
    try {
      const schema = this.validationSchemas[key];

      if (!schema) {
        console.warn(
          `StarryNight: No validation schema for key: ${key}. Setting raw value.`
        );
        Spicetify.LocalStorage.set(key, value);
        return true;
      }

      // Special handling for sn-harmonicManualBaseColor - it doesn't have allowedValues, but needs validation
      if (key === "sn-harmonicManualBaseColor") {
        if (value !== "" && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
          console.error(
            `StarryNight: Invalid hex color '${value}' for ${key}. Setting to default (empty string).`
          );
          Spicetify.LocalStorage.set(key, schema.default);
          return false;
        }
      } else if (
        schema.allowedValues &&
        !schema.allowedValues.includes(value)
      ) {
        console.error(
          `StarryNight: Cannot set invalid value '${value}' for ${key}. Allowed: ${schema.allowedValues.join(
            ", "
          )}.`
        );
        return false;
      }

      Spicetify.LocalStorage.set(key, value);
      if (this.config.enableDebug) {
        // console.log(`StarryNight: Settings updated - ${key}: ${value}`); // Optional: reduce logging
      }

      // Dispatch event
      document.dispatchEvent(
        new CustomEvent("year3000SystemSettingsChanged", {
          detail: { key, value },
        })
      );

      return true;
    } catch (error) {
      console.error(
        `StarryNight: Error setting localStorage key ${key}:`,
        error
      );
      return false;
    }
  }

  getAllSettings() {
    const settings = {};
    Object.keys(this.validationSchemas).forEach((key) => {
      settings[key] = this.get(key);
    });
    return settings;
  }

  validateAndRepair() {
    let repairedCount = 0;
    Object.keys(this.validationSchemas).forEach((key) => {
      const currentValue = Spicetify.LocalStorage.get(key); // Direct get from LS
      // const schema = this.validationSchemas[key]; // Already have schema via this.get()
      // Use this.get() to leverage its validation and default fallback logic
      const validatedValue = this.get(key); // This applies schema default if current is invalid/null

      if (currentValue !== validatedValue) {
        // If currentValue was null (and default applied by get) or if it was invalid.
        this.set(key, validatedValue); // Set the validated (or default) value back to localStorage.
        if (currentValue !== null) {
          // Only count as repaired if there was an actual invalid value being corrected.
          if (this.config.enableDebug) {
            console.log(
              `StarryNight: Repaired setting for '${key}'. Was '${currentValue}', set to '${validatedValue}'.`
            );
          }
          repairedCount++;
        }
      }
    });

    if (repairedCount > 0 && this.config.enableDebug) {
      console.log(
        `StarryNight: Repaired ${repairedCount} invalid settings in total.`
      );
    }
    return repairedCount;
  }

  resetAllToDefaults() {
    if (this.config.enableDebug) {
      console.log(
        "[StarryNight SettingsManager] Resetting all settings to their defaults."
      );
    }
    let resetCount = 0;
    Object.keys(this.validationSchemas).forEach((key) => {
      const schema = this.validationSchemas[key];
      if (schema && typeof schema.default !== "undefined") {
        const oldValue = Spicetify.LocalStorage.get(key);
        if (oldValue !== schema.default) {
          this.set(key, schema.default);
          if (this.config.enableDebug) {
            console.log(
              `[StarryNight SettingsManager] Reset '${key}' from '${oldValue}' to default '${schema.default}'.`
            );
          }
          resetCount++;
        }
      }
    });
    if (this.config.enableDebug) {
      console.log(
        `[StarryNight SettingsManager] Reset ${resetCount} settings to default values.`
      );
    }
  }
}
