import type { StorageInterface } from "../typedSettingsManager";

/**
 * Spicetify LocalStorage adapter
 * Implements the StorageInterface for Spicetify environment
 */
export class SpicetifyStorageAdapter implements StorageInterface {
  private _available: boolean | null = null;
  
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
   */
  get(key: string): string | null {
    if (!this.isAvailable()) {
      console.warn(`[SpicetifyStorageAdapter] Cannot get ${key}: Spicetify not available`);
      return null;
    }

    try {
      // Type assertion safe here due to isAvailable check
      return (Spicetify!.LocalStorage!.get as ((key: string) => string | null))(key);
    } catch (error) {
      console.error(`[SpicetifyStorageAdapter] Error reading key ${key}:`, error);
      return null;
    }
  }
  
  /**
   * Set value in Spicetify.LocalStorage
   */
  set(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      console.warn(`[SpicetifyStorageAdapter] Cannot set ${key}: Spicetify not available`);
      return false;
    }

    try {
      // Type assertion safe here due to isAvailable check
      (Spicetify!.LocalStorage!.set as ((key: string, value: string) => void))(key, value);
      return true;
    } catch (error) {
      console.error(`[SpicetifyStorageAdapter] Error setting key ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Remove value from Spicetify.LocalStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn(`[SpicetifyStorageAdapter] Cannot remove ${key}: Spicetify not available`);
      return false;
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
      return true;
    } catch (error) {
      console.error(`[SpicetifyStorageAdapter] Error removing key ${key}:`, error);
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