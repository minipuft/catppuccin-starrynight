/**
 * Performance Mode Migration Utility
 *
 * Migrates legacy scattered performance settings to unified performance mode system.
 * This is a minimal implementation to unblock compilation - full migration logic deferred.
 *
 * @architecture Phase 7: Performance Settings Migration
 * @see PerformanceModeService for the unified performance management
 */

import { settings } from "@/config";
import type { PerformanceMode } from "@/config/settingsSchema";

/**
 * Migrate legacy performance settings to unified performance mode
 *
 * This function checks if the user has legacy performance settings and migrates
 * them to the new unified performance mode system.
 *
 * @returns The migrated performance mode, or null if no migration needed
 */
export function migrateToPerformanceMode(): PerformanceMode | null {
  try {
    // Check if performance mode is already set
    const currentMode = settings.get("sn-performance-mode");

    // If already set to a valid mode, no migration needed
    if (currentMode && ["auto", "performance", "balanced", "quality", "maximum"].includes(currentMode as string)) {
      console.log(`[Migration] Performance mode already set: ${currentMode}`);
      return currentMode as PerformanceMode;
    }

    // Default to 'auto' mode if no valid mode found
    // Full migration logic for legacy settings will be implemented in Phase 2
    const defaultMode: PerformanceMode = "auto";
    settings.set("sn-performance-mode", defaultMode);

    console.log(`[Migration] Initialized performance mode to: ${defaultMode}`);
    return defaultMode;
  } catch (error) {
    console.error("[Migration] Failed to migrate performance settings:", error);
    return null;
  }
}
