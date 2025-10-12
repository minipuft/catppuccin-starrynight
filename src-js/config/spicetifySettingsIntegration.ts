/**
 * Spicetify Settings Integration
 *
 * Ensures TypedSettingsManager properly integrates with Spicetify.LocalStorage
 * and provides cross-tab synchronization for settings changes.
 *
 * @architecture Settings synchronization layer for Spicetify environment
 */

import { getSettingsProvider } from "./settingsProvider";

/**
 * Initialize Spicetify settings integration
 *
 * This sets up:
 * - Cross-tab synchronization via storage events
 * - Spicetify.LocalStorage health monitoring
 * - Automatic fallback to browser storage if Spicetify unavailable
 */
export function initializeSpicetifySettingsSync(): void {
  const provider = getSettingsProvider();
  const storage = provider.getStorage();

  // Check storage health
  const diagnostics = provider.getDiagnostics();

  if (diagnostics.storageType === "spicetify") {
    console.log("[SpicetifySettingsIntegration] Using Spicetify.LocalStorage");

    // Monitor storage health periodically
    const healthCheckInterval = setInterval(() => {
      const health = provider.healthCheck();

      if (health.overall === "unhealthy") {
        console.error(
          "[SpicetifySettingsIntegration] Storage unhealthy:",
          health.storage.issues
        );

        // Attempt recovery or fallback
        if (health.recommendations.length > 0) {
          console.warn(
            "[SpicetifySettingsIntegration] Recommendations:",
            health.recommendations
          );
        }
      }
    }, 60000); // Check every minute

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      clearInterval(healthCheckInterval);
    });

  } else if (diagnostics.storageType === "browser") {
    console.warn(
      "[SpicetifySettingsIntegration] Using browser localStorage (Spicetify unavailable)"
    );

    // Set up cross-tab synchronization for browser storage
    window.addEventListener("storage", (event) => {
      if (event.key && event.key.startsWith("sn-") || event.key?.startsWith("catppuccin-")) {
        console.log(
          `[SpicetifySettingsIntegration] Cross-tab sync: ${event.key} changed in another tab`
        );

        // Force cache clear to pick up new value
        const settings = provider.getSettings();
        settings.clearCache();
      }
    });
  } else {
    console.error(
      "[SpicetifySettingsIntegration] Unknown storage type:",
      diagnostics.storageType
    );
  }
}

/**
 * Get diagnostics for the current storage system
 * Useful for debugging settings issues
 */
export function getStorageDiagnostics() {
  const provider = getSettingsProvider();
  const diagnostics = provider.getDiagnostics();
  const health = provider.healthCheck();

  return {
    diagnostics,
    health,
    settings: provider.getSettings().export(),
  };
}

/**
 * Repair settings storage if issues detected
 * Attempts to fix invalid settings and migrate if needed
 */
export function repairSettingsStorage(): {
  repaired: number;
  failed: Array<{ key: string; error: string }>;
} {
  const provider = getSettingsProvider();
  const settings = provider.getSettings();
  const validation = settings.validateAllSettings();

  const repaired: string[] = [];
  const failed: Array<{ key: string; error: string }> = [];

  // Reset invalid settings to defaults
  for (const invalid of validation.invalid) {
    try {
      settings.reset(invalid.key as any);
      repaired.push(invalid.key);
      console.log(`[SpicetifySettingsIntegration] Repaired invalid setting: ${invalid.key}`);
    } catch (error) {
      failed.push({
        key: invalid.key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    repaired: repaired.length,
    failed,
  };
}
