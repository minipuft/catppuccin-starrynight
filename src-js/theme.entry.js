// src-js/theme.entry.js

// MASTER DEBUG SWITCH
// Set this to true to enable all debug logs, artistic mode logging, and the debug UI panel.
// Set this to false to disable them, overriding individual settings in globalConfig.js.
const ENABLE_GLOBAL_DEBUGGING = true;

// Essential Clobal Configurations - Must be available early
import {
  HARMONIC_MODES as HARMONIC_MODES_IMPORTED,
  YEAR3000_CONFIG as YEAR3000_CONFIG_IMPORTED,
} from "./config/globalConfig.js";

if (!globalThis.HARMONIC_MODES) {
  globalThis.HARMONIC_MODES = HARMONIC_MODES_IMPORTED;
}
if (!globalThis.YEAR3000_CONFIG) {
  globalThis.YEAR3000_CONFIG = YEAR3000_CONFIG_IMPORTED;

  // Apply master debug switch
  if (typeof ENABLE_GLOBAL_DEBUGGING === "boolean") {
    console.log(
      `[StarryNight Theme] MASTER DEBUG SWITCH is ${
        ENABLE_GLOBAL_DEBUGGING ? "ON" : "OFF"
      }. Overriding config debug flags.`
    );
    globalThis.YEAR3000_CONFIG.enableDebug = ENABLE_GLOBAL_DEBUGGING;
    globalThis.YEAR3000_CONFIG.enableArtisticModeLogging =
      ENABLE_GLOBAL_DEBUGGING;
    globalThis.YEAR3000_CONFIG.enableDebugMode = ENABLE_GLOBAL_DEBUGGING; // For the debug UI component
  } else {
    console.warn(
      "[StarryNight Theme] Master debug switch (ENABLE_GLOBAL_DEBUGGING) is not a boolean. Using individual config flags."
    );
  }

  // Call loadArtisticPreference after the global YEAR3000_CONFIG is set
  // This ensures that settings for artistic mode multipliers are loaded before system uses them.
  if (typeof globalThis.YEAR3000_CONFIG.loadArtisticPreference === "function") {
    globalThis.YEAR3000_CONFIG.loadArtisticPreference();
  } else {
    console.warn(
      "[StarryNight Theme] YEAR3000_CONFIG.loadArtisticPreference() not found. Artistic preferences may not load correctly."
    );
  }
}

// Core System Orchestrator
import { Year3000System } from "./core/year3000System.js";

// UI and Effects - these are more about presentation and direct user interaction
import { insertOption as initializeSettingsUI } from "./components/SettingsSection.js";
import { Year3000Debug } from "./debug/SystemIntegrationTester.js";
import * as StarryNightEffects from "./effects/starryNightEffects.js"; // Import all exports as a namespace

// Main Initialization Logic (which now uses Year3000System)
import { main as runMainInitialization } from "./core/mainInitialization.js";

(async function catppuccinStarryNight() {
  console.log("🌟 Catppuccin StarryNight Theme: Main IIFE executing v2");

  if (
    !Spicetify ||
    !Spicetify.React ||
    !Spicetify.ReactDOM ||
    !Spicetify.Player ||
    !Spicetify.Platform
  ) {
    console.warn(
      "[StarryNight Theme] Spicetify APIs not fully available yet. Retrying in 100ms..."
    );
    setTimeout(catppuccinStarryNight, 100);
    return;
  }
  console.log("[StarryNight Theme] Spicetify APIs ready.");

  // 1. Instantiate and Expose Core Year3000 System
  // YEAR3000_CONFIG and HARMONIC_MODES are already on globalThis from outside the IIFE.
  console.log("🌟 [StarryNight Theme] Initializing Year3000 System Core...");
  const year3000SystemInstance = new Year3000System(
    globalThis.YEAR3000_CONFIG,
    globalThis.HARMONIC_MODES
  );
  globalThis.year3000System = year3000SystemInstance; // Expose the instance

  if (globalThis.YEAR3000_CONFIG.enableDebug) {
    console.log(
      "🌟 [StarryNight Theme] Year3000 System Core instance created:",
      globalThis.year3000System
    );
  }

  // 2. Expose Starry Night Effects globally (as they might be called by settings or debug console)
  globalThis.StarryNightEffects = StarryNightEffects;
  if (globalThis.YEAR3000_CONFIG.enableDebug) {
    console.log(
      "🌠 [StarryNight Theme] StarryNightEffects exposed on globalThis:",
      globalThis.StarryNightEffects
    );
  }

  // 3. Run Main Initialization (this will call year3000System.initializeAllSystems() and setup listeners)
  // This populates globalThis.year3000System with all its managers and services.
  if (globalThis.YEAR3000_CONFIG.enableDebug) {
    console.log(
      "🚀 [StarryNight Theme] Calling runMainInitialization (which calls year3000System.initializeAllSystems & setup listeners)..."
    );
  }
  await runMainInitialization(); // mainInitialization.js now calls methods on globalThis.year3000System
  if (globalThis.YEAR3000_CONFIG.enableDebug) {
    console.log(
      "✅ [StarryNight Theme] runMainInitialization completed. All systems should be go."
    );
  }

  // 4. Initialize Settings UI (depends on globalThis.year3000System being fully populated by runMainInitialization)
  if (Spicetify.Platform && Spicetify.Platform.History) {
    Spicetify.Platform.History.listen(initializeSettingsUI);
    initializeSettingsUI(Spicetify.Platform.History.location.pathname); // Initial call
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "[StarryNight Theme] Settings UI initialized and history listener attached."
      );
    }
  } else {
    console.error(
      "[StarryNight Theme] Spicetify.Platform.History not available. Settings UI cannot be initialized."
    );
  }

  // 5. Expose Debug Interface (depends on globalThis.year3000System for its methods)
  if (globalThis.YEAR3000_CONFIG.enableDebugMode) {
    // Use a specific config for debug UI if available, or just enableDebug
    globalThis.Year3000Debug = Year3000Debug;
    if (globalThis.YEAR3000_CONFIG.enableDebug) {
      console.log(
        "🛠️ [StarryNight Theme] Year3000Debug interface exposed on globalThis.Year3000Debug."
      );
    }
  } else if (globalThis.YEAR3000_CONFIG.enableDebug) {
    console.log(
      "[StarryNight Theme] Debug mode UI not explicitly enabled (YEAR3000_CONFIG.enableDebugMode), but debug logging is on. Debug object not exposed globally."
    );
  }

  // Final ready message
  console.log(
    "🌌 Catppuccin StarryNight Theme fully initialized and operational. Welcome to the future of sound!"
  );
  if (globalThis.YEAR3000_CONFIG.enableArtisticModeLogging) {
    console.log(
      `🎨 Current Artistic Mode: ${globalThis.YEAR3000_CONFIG.artisticMode}`
    );
  }
})();
