/**
 * Unified Storage Manager for Catppuccin StarryNight Theme
 * Provides consistent storage operations using Spicetify.LocalStorage
 * with migration support for existing localStorage values
 */

declare const Spicetify: any;

// Legacy key mappings for migration
const LEGACY_KEY_MAPPINGS: Record<string, string> = {
  "sn-starDensity": "sn-star-density",
  "year3000-artistic-mode": "sn-artistic-mode",
  "MusicSyncService-prefs": "sn-music-sync-prefs",
};

// Valid key prefixes for validation
const VALID_KEY_PREFIXES = ["sn-", "catppuccin-"];

export class StorageManager {
  private static _migrationCompleted = false;
  private static _spicetifyAvailable: boolean | null = null;

  /**
   * Check if Spicetify.LocalStorage is available
   */
  static isSpicetifyStorageAvailable(): boolean {
    if (this._spicetifyAvailable !== null) {
      return this._spicetifyAvailable;
    }

    try {
      this._spicetifyAvailable =
        typeof Spicetify !== "undefined" &&
        typeof Spicetify.LocalStorage?.get === "function" &&
        typeof Spicetify.LocalStorage?.set === "function";

      if (this._spicetifyAvailable) {
        // Test with a dummy operation
        Spicetify.LocalStorage.get("__test__");
      }

      return this._spicetifyAvailable;
    } catch (error) {
      console.warn(
        "[StorageManager] Spicetify.LocalStorage not available:",
        error
      );
      this._spicetifyAvailable = false;
      return false;
    }
  }

  /**
   * Validate storage key follows theme conventions
   */
  static validateKey(key: string): boolean {
    if (!key || typeof key !== "string") return false;
    return VALID_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
  }

  /**
   * Get value from storage with fallback to native localStorage
   */
  static get(key: string): string | null {
    try {
      if (this.isSpicetifyStorageAvailable()) {
        return Spicetify.LocalStorage.get(key);
      } else {
        // Fallback to native localStorage
        console.warn(
          `[StorageManager] Using fallback localStorage for key: ${key}`
        );
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error(`[StorageManager] Error reading key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in storage with fallback to native localStorage
   */
  static set(key: string, value: string): boolean {
    try {
      if (this.isSpicetifyStorageAvailable()) {
        Spicetify.LocalStorage.set(key, value);
        return true;
      } else {
        // Fallback to native localStorage
        console.warn(
          `[StorageManager] Using fallback localStorage for key: ${key}`
        );
        localStorage.setItem(key, value);
        return true;
      }
    } catch (error) {
      console.error(`[StorageManager] Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove value from storage
   */
  static remove(key: string): boolean {
    try {
      if (this.isSpicetifyStorageAvailable()) {
        Spicetify.LocalStorage.remove?.(key) ||
          Spicetify.LocalStorage.set(key, null);
        return true;
      } else {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error(`[StorageManager] Error removing key ${key}:`, error);
      return false;
    }
  }

  /**
   * Migrate values from native localStorage to Spicetify.LocalStorage
   */
  static migrateFromNativeLocalStorage(
    keyMappings: Record<string, string>
  ): void {
    if (!this.isSpicetifyStorageAvailable()) {
      console.warn(
        "[StorageManager] Cannot migrate - Spicetify.LocalStorage unavailable"
      );
      return;
    }

    let migratedCount = 0;
    for (const [oldKey, newKey] of Object.entries(keyMappings)) {
      try {
        const value = localStorage.getItem(oldKey);
        if (value !== null) {
          // Check if new key already exists (don't overwrite)
          const existingValue = Spicetify.LocalStorage.get(newKey);
          if (existingValue === null) {
            Spicetify.LocalStorage.set(newKey, value);
            migratedCount++;
            console.log(`[StorageManager] Migrated: ${oldKey} → ${newKey}`);
          }
        }
      } catch (error) {
        console.error(
          `[StorageManager] Migration failed for ${oldKey}:`,
          error
        );
      }
    }

    if (migratedCount > 0) {
      console.log(
        `[StorageManager] Migration completed: ${migratedCount} keys migrated`
      );
    }
  }

  /**
   * Migrate all known theme settings from localStorage
   */
  static migrateThemeSettings(): void {
    if (this._migrationCompleted) return;

    console.log("[StorageManager] Starting theme settings migration...");

    // Migrate known legacy keys
    this.migrateFromNativeLocalStorage(LEGACY_KEY_MAPPINGS);

    // Migrate any other sn- prefixed keys found in localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("sn-") &&
          !Object.values(LEGACY_KEY_MAPPINGS).includes(key)
        ) {
          const value = localStorage.getItem(key);
          if (value !== null && this.get(key) === null) {
            this.set(key, value);
            console.log(`[StorageManager] Auto-migrated legacy key: ${key}`);
          }
        }
      }
    } catch (error) {
      console.error("[StorageManager] Auto-migration error:", error);
    }

    this._migrationCompleted = true;
    console.log("[StorageManager] Theme settings migration completed");
  }

  /**
   * Get all keys with a specific prefix
   */
  static getKeysWithPrefix(prefix: string): string[] {
    const keys: string[] = [];

    if (this.isSpicetifyStorageAvailable()) {
      // Spicetify doesn't provide a way to enumerate keys, so we'll check known patterns
      const commonSuffixes = [
        "star-density",
        "gradient-intensity",
        "glassmorphism-level",
        "3d-effects-level",
        "artistic-mode",
        "current-harmonic-mode",
        "harmonic-intensity",
        "harmonic-evolution",
        "harmonic-manual-base-color",
      ];

      for (const suffix of commonSuffixes) {
        const key = `${prefix}${suffix}`;
        if (this.get(key) !== null) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  /**
   * Validate storage health and report issues
   */
  static validateStorageHealth(): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const result = {
      isHealthy: true,
      issues: [] as string[],
      recommendations: [] as string[],
    };

    // Check Spicetify availability
    if (!this.isSpicetifyStorageAvailable()) {
      result.isHealthy = false;
      result.issues.push("Spicetify.LocalStorage not available");
      result.recommendations.push(
        "Ensure theme is running in Spicetify environment"
      );
    }

    // Check for orphaned localStorage keys
    try {
      const orphanedKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("sn-") || key.startsWith("catppuccin-"))) {
          orphanedKeys.push(key);
        }
      }

      if (orphanedKeys.length > 0) {
        result.issues.push(
          `Found ${orphanedKeys.length} orphaned localStorage keys`
        );
        result.recommendations.push(
          "Run StorageManager.migrateThemeSettings() to migrate them"
        );
      }
    } catch (error) {
      result.issues.push("Cannot access localStorage for health check");
    }

    return result;
  }

  /**
   * Run comprehensive integration tests
   */
  static runIntegrationTests(): {
    storageAvailable: boolean;
    migrationWorking: boolean;
    settingsResponse: boolean;
    keyValidation: boolean;
    errorHandling: boolean;
    issues: string[];
    summary: string;
  } {
    const results = {
      storageAvailable: false,
      migrationWorking: false,
      settingsResponse: false,
      keyValidation: false,
      errorHandling: false,
      issues: [] as string[],
      summary: "",
    };

    console.log("[StorageManager] Running integration tests...");

    // Test 1: Storage availability
    try {
      results.storageAvailable = this.isSpicetifyStorageAvailable();
      if (!results.storageAvailable) {
        results.issues.push("Spicetify.LocalStorage not available");
      }
    } catch (error) {
      results.issues.push(`Storage availability test failed: ${error}`);
    }

    // Test 2: Key validation
    try {
      const validKey = this.validateKey("sn-test-key");
      const invalidKey = this.validateKey("invalid-key");
      results.keyValidation = validKey && !invalidKey;
      if (!results.keyValidation) {
        results.issues.push("Key validation not working correctly");
      }
    } catch (error) {
      results.issues.push(`Key validation test failed: ${error}`);
    }

    // Test 3: Basic set/get operations
    try {
      const testKey = "sn-integration-test";
      const testValue = "test-value-" + Date.now();

      const setSuccess = this.set(testKey, testValue);
      const getValue = this.get(testKey);
      const removeSuccess = this.remove(testKey);

      results.settingsResponse =
        setSuccess && getValue === testValue && removeSuccess;
      if (!results.settingsResponse) {
        results.issues.push("Basic set/get/remove operations failed");
      }
    } catch (error) {
      results.issues.push(`Settings response test failed: ${error}`);
    }

    // Test 4: Migration simulation
    try {
      // Simulate legacy data in localStorage
      const legacyKey = "test-legacy-key";
      const newKey = "sn-migrated-key";
      const testValue = "migration-test-" + Date.now();

      localStorage.setItem(legacyKey, testValue);
      this.migrateFromNativeLocalStorage({ [legacyKey]: newKey });

      const migratedValue = this.get(newKey);
      results.migrationWorking = migratedValue === testValue;

      // Cleanup
      localStorage.removeItem(legacyKey);
      this.remove(newKey);

      if (!results.migrationWorking) {
        results.issues.push("Migration functionality not working");
      }
    } catch (error) {
      results.issues.push(`Migration test failed: ${error}`);
    }

    // Test 5: Error handling
    try {
      // Test with invalid operations
      const nullResult = this.get("");
      const invalidSetResult = this.set("", "");

      results.errorHandling = nullResult === null && !invalidSetResult;
      if (!results.errorHandling) {
        results.issues.push("Error handling not working correctly");
      }
    } catch (error) {
      results.issues.push(`Error handling test failed: ${error}`);
    }

    // Generate summary
    const passedTests = [
      results.storageAvailable,
      results.migrationWorking,
      results.settingsResponse,
      results.keyValidation,
      results.errorHandling,
    ].filter(Boolean).length;

    results.summary = `${passedTests}/5 tests passed. ${results.issues.length} issues found.`;

    console.log("[StorageManager] Integration test results:", results);
    return results;
  }

  /**
   * Get diagnostic information for debugging
   */
  static getDiagnosticInfo(): {
    spicetifyAvailable: boolean;
    migrationCompleted: boolean;
    knownKeys: string[];
    legacyKeysFound: string[];
    storageHealth: any;
  } {
    const legacyKeys: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && Object.keys(LEGACY_KEY_MAPPINGS).includes(key)) {
          legacyKeys.push(key);
        }
      }
    } catch (error) {
      // localStorage access failed
    }

    return {
      spicetifyAvailable: this.isSpicetifyStorageAvailable(),
      migrationCompleted: this._migrationCompleted,
      knownKeys: this.getKeysWithPrefix("sn-"),
      legacyKeysFound: legacyKeys,
      storageHealth: this.validateStorageHealth(),
    };
  }
}

// Auto-migrate on module load if in Spicetify environment
if (typeof Spicetify !== "undefined") {
  // Delay migration slightly to ensure Spicetify is fully loaded
  setTimeout(() => {
    StorageManager.migrateThemeSettings();
  }, 100);
}
