import type { TypedSettings } from "./settingsSchema";
import {
  SETTINGS_METADATA,
  validateSetting,
  parseSetting,
  serializeSetting,
  getDefaultValue,
  getAllSettingKeys,
  isValidSettingKey,
} from "./settingsSchema";

export type { TypedSettings };

/**
 * Storage interface abstraction
 * Allows different storage backends (Spicetify, localStorage, etc.)
 */
export interface StorageInterface {
  get(key: string): string | null;
  set(key: string, value: string): boolean;
  remove(key: string): boolean;
}

/**
 * Settings change event data
 */
export interface SettingsChangeEvent<K extends keyof TypedSettings = keyof TypedSettings> {
  settingKey: K;
  oldValue: TypedSettings[K] | null;
  newValue: TypedSettings[K];
  timestamp: number;
}

/**
 * Type-safe settings manager with automatic validation and conversion
 * Eliminates runtime string parsing errors and provides compile-time safety
 */
export class TypedSettingsManager {
  private storage: StorageInterface;
  private changeListeners: Set<(event: SettingsChangeEvent) => void> = new Set();
  private cache = new Map<keyof TypedSettings, any>();
  
  constructor(storage: StorageInterface) {
    this.storage = storage;
  }
  
  /**
   * Get a setting value with full type safety
   * Automatically parses and validates the stored value
   */
  get<K extends keyof TypedSettings>(key: K): TypedSettings[K] {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const metadata = SETTINGS_METADATA[key];
    const rawValue = this.storage.get(key);
    
    if (rawValue === null || rawValue === undefined) {
      // Return default if no stored value
      const defaultValue = metadata.defaultValue;
      this.cache.set(key, defaultValue);
      return defaultValue;
    }
    
    // Parse the stored string value
    const parsedValue = parseSetting(key, rawValue);
    
    if (parsedValue === null) {
      // Invalid stored value, return default
      console.warn(`[TypedSettingsManager] Invalid stored value for ${key}: "${rawValue}", using default`);
      const defaultValue = metadata.defaultValue;
      this.cache.set(key, defaultValue);
      return defaultValue;
    }
    
    // Cache and return the valid parsed value
    this.cache.set(key, parsedValue);
    return parsedValue;
  }
  
  /**
   * Set a setting value with type safety and validation
   * Automatically serializes and validates the value
   */
  set<K extends keyof TypedSettings>(
    key: K,
    value: TypedSettings[K]
  ): boolean {
    // Validate the value matches the expected type
    if (!validateSetting(key, value)) {
      console.error(`[TypedSettingsManager] Invalid value for ${key}:`, value);
      return false;
    }
    
    const oldValue = this.cache.get(key) ?? this.get(key);
    
    // Serialize for storage
    const serializedValue = serializeSetting(key, value);
    
    // Store the value
    const success = this.storage.set(key, serializedValue);
    
    if (success) {
      // Update cache
      this.cache.set(key, value);
      
      // Emit change event
      const changeEvent: SettingsChangeEvent<K> = {
        settingKey: key,
        oldValue,
        newValue: value,
        timestamp: Date.now(),
      };
      
      this.notifyChangeListeners(changeEvent);
    }
    
    return success;
  }
  
  /**
   * Get multiple settings at once
   */
  getMultiple<K extends keyof TypedSettings>(
    keys: readonly K[]
  ): Pick<TypedSettings, K> {
    const result = {} as Pick<TypedSettings, K>;
    
    for (const key of keys) {
      result[key] = this.get(key);
    }
    
    return result;
  }
  
  /**
   * Set multiple settings at once
   */
  setMultiple(
    settings: Partial<TypedSettings>
  ): { [K in keyof TypedSettings]?: boolean } {
    const results: { [K in keyof TypedSettings]?: boolean } = {};
    
    for (const [key, value] of Object.entries(settings)) {
      if (isValidSettingKey(key)) {
        results[key] = this.set(key, value);
      }
    }
    
    return results;
  }
  
  /**
   * Get all settings with their current values
   */
  getAllSettings(): TypedSettings {
    const result = {} as TypedSettings;
    
    for (const key of getAllSettingKeys()) {
      (result as any)[key] = this.get(key);
    }
    
    return result;
  }
  
  /**
   * Reset a setting to its default value
   */
  reset<K extends keyof TypedSettings>(key: K): boolean {
    const defaultValue = getDefaultValue(key);
    return this.set(key, defaultValue);
  }
  
  /**
   * Reset all settings to their default values
   */
  resetAll(): { [K in keyof TypedSettings]: boolean } {
    const results = {} as { [K in keyof TypedSettings]: boolean };
    
    for (const key of getAllSettingKeys()) {
      results[key] = this.reset(key);
    }
    
    return results;
  }
  
  /**
   * Check if a setting exists in storage (has been set by user)
   */
  exists<K extends keyof TypedSettings>(key: K): boolean {
    return this.storage.get(key) !== null;
  }
  
  /**
   * Remove a setting from storage (will fall back to default)
   */
  remove<K extends keyof TypedSettings>(key: K): boolean {
    const success = this.storage.remove(key);
    if (success) {
      this.cache.delete(key);
    }
    return success;
  }
  
  /**
   * Clear the internal cache (forces re-reading from storage)
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Add a change listener
   */
  onChange(listener: (event: SettingsChangeEvent) => void): void {
    this.changeListeners.add(listener);
  }
  
  /**
   * Remove a change listener
   */
  offChange(listener: (event: SettingsChangeEvent) => void): void {
    this.changeListeners.delete(listener);
  }
  
  /**
   * Notify all change listeners
   */
  private notifyChangeListeners(event: SettingsChangeEvent): void {
    for (const listener of this.changeListeners) {
      try {
        listener(event);
      } catch (error) {
        console.error("[TypedSettingsManager] Error in change listener:", error);
      }
    }
  }
  
  /**
   * Validate all stored settings and report issues
   */
  validateAllSettings(): {
    valid: number;
    invalid: Array<{ key: string; value: string; error: string }>;
    missing: Array<{ key: string; usingDefault: any }>;
  } {
    const result = {
      valid: 0,
      invalid: [] as Array<{ key: string; value: string; error: string }>,
      missing: [] as Array<{ key: string; usingDefault: any }>,
    };
    
    for (const key of getAllSettingKeys()) {
      const rawValue = this.storage.get(key);
      
      if (rawValue === null) {
        result.missing.push({
          key,
          usingDefault: getDefaultValue(key),
        });
        continue;
      }
      
      const parsedValue = parseSetting(key, rawValue);
      
      if (parsedValue === null) {
        result.invalid.push({
          key,
          value: rawValue,
          error: "Failed to parse or validate value",
        });
      } else {
        result.valid++;
      }
    }
    
    return result;
  }
  
  /**
   * Export settings as a JSON object
   */
  export(): { [K in keyof TypedSettings]: TypedSettings[K] } {
    return this.getAllSettings();
  }
  
  /**
   * Import settings from a JSON object
   */
  import(settings: Partial<TypedSettings>): {
    imported: number;
    failed: Array<{ key: string; error: string }>;
  } {
    const result = {
      imported: 0,
      failed: [] as Array<{ key: string; error: string }>,
    };
    
    for (const [key, value] of Object.entries(settings)) {
      if (!isValidSettingKey(key)) {
        result.failed.push({ key, error: "Unknown setting key" });
        continue;
      }
      
      if (!validateSetting(key, value)) {
        result.failed.push({ key, error: "Invalid value for setting" });
        continue;
      }
      
      if (this.set(key, value)) {
        result.imported++;
      } else {
        result.failed.push({ key, error: "Failed to store setting" });
      }
    }
    
    return result;
  }
}