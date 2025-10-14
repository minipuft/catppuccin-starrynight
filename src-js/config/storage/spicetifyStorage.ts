import type { StorageInterface } from "../typedSettingsManager";

/**
 * Spicetify LocalStorage adapter
 * Implements the StorageInterface for Spicetify environment
 */
export class SpicetifyStorageAdapter implements StorageInterface {
  private _available: boolean | null = null;
  private browserStorageSyncEnabled = true;

  /**
   * Check if Spicetify.LocalStorage is available
   */
  private isAvailable(): boolean {
    if (this._available !== null) {
      return this._available;
    }

    try {
      this._available =
        typeof Spicetify !== "undefined" &&
        !!Spicetify &&
        typeof Spicetify.LocalStorage?.get === "function" &&
        typeof Spicetify.LocalStorage?.set === "function";

      if (this._available) {
        // Test with a dummy operation
        (Spicetify!.LocalStorage!.get as ((key: string) => string | null))("__test__");
      }

      return this._available;
    } catch (error) {
      console.warn("[SpicetifyStorageAdapter] Spicetify.LocalStorage not available:", error);
      this._available = false;
      return false;
    }
  }
  
  /**
   * Get value from Spicetify.LocalStorage
   *
   * Enhanced with browser storage priority for reliability
   * Since we always write to both storages, browser storage is the most reliable source
   */
  get(key: string): string | null {
    // Try browser storage first (most reliable due to dual-write strategy)
    const browserValue = this.readFromBrowserStorage(key);
    if (browserValue !== null) {
      return browserValue;
    }

    // Fallback to Spicetify if browser storage empty
    if (!this.isAvailable()) {
      return null;
    }

    try {
      // Type assertion safe here due to isAvailable check
      const spicetifyValue = (Spicetify!.LocalStorage!.get as (key: string) => string | null)(key);

      // If found in Spicetify but not browser, sync to browser
      if (spicetifyValue !== null) {
        console.debug(`[SpicetifyStorageAdapter] Found ${key} in Spicetify but not browser, syncing`);
        this.writeToBrowserStorage(key, spicetifyValue);
      }

      return spicetifyValue;
    } catch (error) {
      console.error(`[SpicetifyStorageAdapter] Error reading key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Set value in Spicetify.LocalStorage
   *
   * Enhanced with persistence verification and dual-write strategy
   */
  set(key: string, value: string): boolean {
    let spicetifySuccess = false;
    let browserSuccess = false;

    // Try Spicetify first
    if (this.isAvailable()) {
      try {
        // Type assertion safe here due to isAvailable check
        (Spicetify!.LocalStorage!.set as ((key: string, value: string) => void))(key, value);

        // Verify write succeeded by immediately reading back
        const verifyRead = (Spicetify!.LocalStorage!.get as (key: string) => string | null)(key);
        if (verifyRead === value) {
          spicetifySuccess = true;
        } else {
          console.warn(`[SpicetifyStorageAdapter] Write verification failed for ${key}: expected "${value}", got "${verifyRead}"`);
        }
      } catch (error) {
        console.error(`[SpicetifyStorageAdapter] Error setting key ${key}:`, error);
      }
    }

    // Always write to browser storage as backup (critical for persistence)
    browserSuccess = this.writeToBrowserStorage(key, value);

    // Consider success if either storage succeeded
    const success = spicetifySuccess || browserSuccess;

    if (success) {
      console.debug(`[SpicetifyStorageAdapter] Saved ${key}: Spicetify=${spicetifySuccess}, Browser=${browserSuccess}`);
    } else {
      console.error(`[SpicetifyStorageAdapter] Failed to save ${key} to any storage backend`);
    }

    return success;
  }
  
  /**
   * Remove value from Spicetify.LocalStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn(`[SpicetifyStorageAdapter] Cannot remove ${key}: Spicetify not available`);
      return this.removeFromBrowserStorage(key);
    }

    try {
      // Type assertion safe here due to isAvailable check
      const storage = Spicetify!.LocalStorage!;

      // Some Spicetify versions may not have remove method
      if (typeof storage.remove === "function") {
        (storage.remove as ((key: string) => void))(key);
      } else {
        // Fallback: set to empty string
        (storage.set as ((key: string, value: string) => void))(key, "");
      }
      this.removeFromBrowserStorage(key);
      return true;
    } catch (error) {
      console.error(`[SpicetifyStorageAdapter] Error removing key ${key}:`, error);
      return this.removeFromBrowserStorage(key);
    }
  }

  private getBrowserStorage(): Storage | null {
    if (!this.browserStorageSyncEnabled) {
      return null;
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage;
      }
    } catch {
      // Accessing window may throw in non-browser environments
    }

    try {
      if (typeof globalThis !== "undefined" && (globalThis as any).localStorage) {
        return (globalThis as any).localStorage as Storage;
      }
    } catch {
      // Ignore if unavailable
    }

    return null;
  }

  private readFromBrowserStorage(key: string): string | null {
    const storage = this.getBrowserStorage();
    if (!storage) return null;

    try {
      return storage.getItem(key);
    } catch (error) {
      console.warn(`[SpicetifyStorageAdapter] Browser storage read failed for ${key}:`, error);
      this.browserStorageSyncEnabled = false;
      return null;
    }
  }

  private writeToBrowserStorage(key: string, value: string): boolean {
    const storage = this.getBrowserStorage();
    if (!storage) return false;

    try {
      storage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`[SpicetifyStorageAdapter] Browser storage write failed for ${key}:`, error);
      this.browserStorageSyncEnabled = false;
      return false;
    }
  }

  private removeFromBrowserStorage(key: string): boolean {
    const storage = this.getBrowserStorage();
    if (!storage) return false;

    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[SpicetifyStorageAdapter] Browser storage remove failed for ${key}:`, error);
      this.browserStorageSyncEnabled = false;
      return false;
    }
  }

  /**
   * Force persistence of all settings
   *
   * Ensures all cached settings are flushed to storage
   * Call this before page unload or settings menu close
   */
  persist(): boolean {
    try {
      // Trigger browser storage sync if available
      const storage = this.getBrowserStorage();
      if (storage) {
        // Browser localStorage is synchronous and already persisted
        console.debug('[SpicetifyStorageAdapter] Browser storage persistence verified');
        return true;
      }

      console.warn('[SpicetifyStorageAdapter] No persistent storage available');
      return false;
    } catch (error) {
      console.error('[SpicetifyStorageAdapter] Error during persist:', error);
      return false;
    }
  }

  /**
   * Check storage health and connectivity
   */
  healthCheck(): {
    available: boolean;
    readable: boolean;
    writable: boolean;
    issues: string[];
  } {
    const result = {
      available: false,
      readable: false,
      writable: false,
      issues: [] as string[],
    };
    
    // Check availability
    result.available = this.isAvailable();
    if (!result.available) {
      result.issues.push("Spicetify.LocalStorage not available");
      return result;
    }
    
    // Test read operation
    try {
      this.get("__health_check_read__");
      result.readable = true;
    } catch (error) {
      result.issues.push(`Read test failed: ${error}`);
    }
    
    // Test write operation
    try {
      const testKey = "__health_check_write__";
      const testValue = "test_" + Date.now();
      
      const writeSuccess = this.set(testKey, testValue);
      if (writeSuccess) {
        const readValue = this.get(testKey);
        if (readValue === testValue) {
          result.writable = true;
          this.remove(testKey); // Cleanup
        } else {
          result.issues.push("Write-read consistency test failed");
        }
      } else {
        result.issues.push("Write operation failed");
      }
    } catch (error) {
      result.issues.push(`Write test failed: ${error}`);
    }
    
    return result;
  }
  
  /**
   * Get diagnostic information
   */
  getDiagnostics(): {
    spicetifyVersion?: string;
    apiMethods: string[];
    testResults: ReturnType<SpicetifyStorageAdapter["healthCheck"]>;
  } {
    const apiMethods: string[] = [];
    
    if (typeof Spicetify !== "undefined" && Spicetify.LocalStorage) {
      apiMethods.push(...Object.getOwnPropertyNames(Spicetify.LocalStorage));
    }
    
    return {
      spicetifyVersion: typeof Spicetify !== "undefined" ? Spicetify.version : undefined,
      apiMethods,
      testResults: this.healthCheck(),
    };
  }
}

/**
 * Create a Spicetify storage adapter instance
 */
export function createSpicetifyStorage(): SpicetifyStorageAdapter {
  return new SpicetifyStorageAdapter();
}
