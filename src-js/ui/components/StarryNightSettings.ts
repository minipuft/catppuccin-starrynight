/**
 * StarryNight Settings Integration
 *
 * Modal-based settings approach (migrated from inline integration)
 *
 * This uses Spicetify.PopupModal for a cleaner, more reliable settings experience
 * similar to spicetify-lucid's approach.
 */

import { openSettingsModal, registerSettingsAccessPoint } from "./SettingsModal";

/**
 * Initialize StarryNight settings using modal-based approach
 *
 * This replaces the old inline integration with a cleaner modal-based system.
 */
export async function initializeStarryNightSettings(): Promise<void> {
  try {
    await registerSettingsAccessPoint();
    console.log("✨ [StarryNight] Modal-based settings initialized");
  } catch (err) {
    console.error("[StarryNight] Failed to initialize settings:", err);
  }
}

// Export modal trigger for programmatic access
export { openSettingsModal };
