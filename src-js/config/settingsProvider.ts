import { TypedSettingsManager, type StorageInterface, type TypedSettings } from "./typedSettingsManager";
import { SpicetifyStorageAdapter, createSpicetifyStorage } from "./storage/spicetifyStorage";
import { BrowserStorageAdapter, createBrowserStorage } from "./storage/browserStorage";

/**
 * Settings provider with automatic storage detection
 * Provides dependency injection for settings management
 */
export class SettingsProvider {
  private settingsManager: TypedSettingsManager;
  private storageAdapter: StorageInterface;
  
  constructor(customStorage?: StorageInterface) {
    // Use custom storage or auto-detect best available
    this.storageAdapter = customStorage || this.detectBestStorage();
    this.settingsManager = new TypedSettingsManager(this.storageAdapter);
  }
  
  /**
   * Detect and return the best available storage adapter
   */
  private detectBestStorage(): StorageInterface {
    // Try Spicetify first (preferred in Spicetify environment)
    const spicetifyAdapter = createSpicetifyStorage();
    const spicetifyHealth = spicetifyAdapter.healthCheck();
    
    if (spicetifyHealth.available && spicetifyHealth.readable && spicetifyHealth.writable) {
      console.log("[SettingsProvider] Using Spicetify storage adapter");
      return spicetifyAdapter;
    }
    
    // Fall back to browser localStorage
    const browserAdapter = createBrowserStorage();
    console.log("[SettingsProvider] Using browser storage adapter (localStorage)");
    return browserAdapter;
  }
  
  /**
   * Get the typed settings manager
   */
  getSettings(): TypedSettingsManager {
    return this.settingsManager;
  }
  
  /**
   * Get the underlying storage adapter
   */
  getStorage(): StorageInterface {
    return this.storageAdapter;
  }
  
  /**
   * Get provider diagnostic information
   */
  getDiagnostics(): {
    storageType: string;
    storageHealth: any;
    settingsValidation: ReturnType<TypedSettingsManager["validateAllSettings"]>;
    totalSettings: number;
  } {
    const storageType = this.storageAdapter instanceof SpicetifyStorageAdapter ? "spicetify" :
                       this.storageAdapter instanceof BrowserStorageAdapter ? "browser" :
                       "unknown";
    
    let storageHealth = null;
    if (this.storageAdapter instanceof SpicetifyStorageAdapter) {
      storageHealth = this.storageAdapter.healthCheck();
    }
    
    return {
      storageType,
      storageHealth,
      settingsValidation: this.settingsManager.validateAllSettings(),
      totalSettings: Object.keys(this.settingsManager.getAllSettings()).length,
    };
  }
  
  /**
   * Migration helper: copy settings from legacy storage
   */
  async migrateFromLegacyStorage(legacySettings: Partial<TypedSettings>): Promise<{
    migrated: number;
    failed: Array<{ key: string; error: string }>;
  }> {
    console.log("[SettingsProvider] Starting legacy settings migration...");
    
    const result = this.settingsManager.import(legacySettings);
    
    if (result.imported > 0) {
      console.log(`[SettingsProvider] Successfully migrated ${result.imported} settings`);
    }
    
    if (result.failed.length > 0) {
      console.warn(`[SettingsProvider] Failed to migrate ${result.failed.length} settings:`, result.failed);
    }
    
    return {
      migrated: result.imported,
      failed: result.failed,
    };
  }
  
  /**
   * Health check for the entire settings system
   */
  healthCheck(): {
    overall: "healthy" | "degraded" | "unhealthy";
    storage: {
      type: string;
      available: boolean;
      issues: string[];
    };
    settings: {
      valid: number;
      invalid: number;
      missing: number;
    };
    recommendations: string[];
  } {
    const diagnostics = this.getDiagnostics();
    const validation = diagnostics.settingsValidation;
    
    const result = {
      overall: "healthy" as "healthy" | "degraded" | "unhealthy",
      storage: {
        type: diagnostics.storageType,
        available: true,
        issues: [] as string[],
      },
      settings: {
        valid: validation.valid,
        invalid: validation.invalid.length,
        missing: validation.missing.length,
      },
      recommendations: [] as string[],
    };
    
    // Analyze storage health
    if (diagnostics.storageHealth) {
      result.storage.available = diagnostics.storageHealth.available;
      if (diagnostics.storageHealth.issues) {
        result.storage.issues = diagnostics.storageHealth.issues;
      }
    }
    
    // Determine overall health
    if (!result.storage.available || result.storage.issues.length > 0) {
      result.overall = "unhealthy";
      result.recommendations.push("Storage system needs attention");
    } else if (result.settings.invalid > 0) {
      result.overall = "degraded";
      result.recommendations.push("Some settings have invalid values");
    } else if (result.settings.missing > 5) {
      result.overall = "degraded";
      result.recommendations.push("Many settings are using defaults");
    }
    
    // Add specific recommendations
    if (result.settings.invalid > 0) {
      result.recommendations.push("Run settings validation and repair");
    }
    
    if (diagnostics.storageType === "browser") {
      result.recommendations.push("Consider using in Spicetify environment for better integration");
    }
    
    return result;
  }
}

/**
 * Global settings provider instance
 * Can be overridden for testing or custom configurations
 */
let globalProvider: SettingsProvider | null = null;

/**
 * Get or create the global settings provider
 */
export function getSettingsProvider(): SettingsProvider {
  if (!globalProvider) {
    globalProvider = new SettingsProvider();
  }
  return globalProvider;
}

/**
 * Set a custom global settings provider
 */
export function setSettingsProvider(provider: SettingsProvider): void {
  globalProvider = provider;
}

/**
 * Reset the global settings provider (useful for testing)
 */
export function resetSettingsProvider(): void {
  globalProvider = null;
}

/**
 * Convenience function to get the settings manager directly
 */
export function getSettings(): TypedSettingsManager {
  return getSettingsProvider().getSettings();
}

/**
 * Convenience function for common settings operations
 */
export const settings = {
  get: <K extends keyof TypedSettings>(key: K) => getSettings().get(key),
  set: <K extends keyof TypedSettings>(key: K, value: TypedSettings[K]) => getSettings().set(key, value),
  reset: <K extends keyof TypedSettings>(key: K) => getSettings().reset(key),
  onChange: (listener: (event: any) => void) => getSettings().onChange(listener),
  export: () => getSettings().export(),
  import: (settings: Partial<TypedSettings>) => getSettings().import(settings),
};

// NOTE: legacySettings wrapper removed in Phase 6A - unused export that wrapped TypedSettingsManager legacy methods
// For legacy key access, TypedSettingsManager still provides getLegacy(), setLegacy() methods (deprecated)