import { HARMONIC_MODES, YEAR3000_CONFIG } from "./config/globalConfig";
import { Year3000System } from "./core/year3000System";
import { Year3000Debug } from "./debug/SystemIntegrationTester";
import { waitForSpicetifyReady } from "./utils/spicetifyReady";

// A placeholder for the settings UI function until it can be properly typed.
declare const initializeSettingsUI: (location: any) => void;

// A type guard to check for Spicetify.Platform.History
function isHistoryAvailable(platform: any): platform is { History: any } {
  return platform && typeof platform.History?.listen === "function";
}

// Progressive API detection with timeout fallbacks
async function waitForAPI(apiPath: string, timeout = 5000): Promise<any> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const api = apiPath
        .split(".")
        .reduce((obj: any, prop: string) => obj?.[prop], window as any);
      if (api) return api;
    } catch (e) {
      // Continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

(async function catppuccinStarryNight() {
  const startTime = Date.now();

  console.log("🌟 [Catppuccin StarryNight] Theme entry point starting...");

  // 🚦 Wait until Spicetify signals that its registry is fully initialised
  const spicetifyReady = await waitForSpicetifyReady(10000);
  if (!spicetifyReady) {
    console.warn(
      "🌟 [StarryNight] Spicetify not fully ready after 10s – proceeding with degraded visual-only mode."
    );
  }

  // Progressive API detection with reasonable timeouts
  const requiredAPIs = {
    player: await waitForAPI("Spicetify.Player", 3000),
    platform: await waitForAPI("Spicetify.Platform", 3000),
    menu: await waitForAPI("Spicetify.Menu", 2000),
    react: await waitForAPI("Spicetify.React", 2000),
    reactDOM: await waitForAPI("Spicetify.ReactDOM", 2000),
  };

  // Check for main UI container with timeout
  const mainContainer = await waitForAPI(
    'document.querySelector(".main-viewContainer-scrollNode, .main-view-container__scroll-node-child")',
    10000
  );

  // Determine if we can run in full mode or degraded mode
  const hasRequiredAPIs =
    requiredAPIs.player && requiredAPIs.platform && mainContainer;
  const degradedMode = !hasRequiredAPIs;

  if (degradedMode) {
    console.log(
      "🌟 [StarryNight] Initializing in DEGRADED MODE due to missing APIs"
    );
    console.log("🌟 [StarryNight] Available APIs:", {
      player: !!requiredAPIs.player,
      platform: !!requiredAPIs.platform,
      menu: !!requiredAPIs.menu,
      react: !!requiredAPIs.react,
      reactDOM: !!requiredAPIs.reactDOM,
      mainContainer: !!mainContainer,
    });
  } else {
    console.log(
      "🌟 [StarryNight] All required APIs available - initializing in FULL MODE"
    );
  }

  const ENABLE_GLOBAL_DEBUGGING = true;
  if (ENABLE_GLOBAL_DEBUGGING) {
    YEAR3000_CONFIG.enableDebug = true;
  }

  // 1. Instantiate the main system. It will handle its own internal dependencies.
  const year3000System = new Year3000System(YEAR3000_CONFIG, HARMONIC_MODES);

  // 2. Initialize the system using progressive loading approach
  try {
    if (degradedMode) {
      // Use the new progressive initialization method
      await year3000System.initializeWithAvailableAPIs({
        player: requiredAPIs.player,
        platform: requiredAPIs.platform,
        config: (window as any).Spicetify?.Config,
        degradedMode: true,
      });

      console.log(
        "🌟 [StarryNight] Initialized in degraded mode - visual systems only"
      );
    } else {
      // Full initialization if all APIs are available
      await year3000System.initializeAllSystems();
      year3000System.setupMusicAnalysisAndColorExtraction();

      console.log("🌟 [StarryNight] Full initialization complete");
    }
  } catch (error) {
    console.error("[StarryNight] System initialization failed:", error);
    // Continue with basic theme functionality
  }

  // 3. Initialize Settings UI using Spicetify's native React components
  try {
    // Only initialize settings if React APIs are available
    if (requiredAPIs.react && requiredAPIs.reactDOM) {
      const settingsUiModule = await import(
        "./components/SettingsSpicetifyNative"
      );
      if (settingsUiModule.initializeSpicetifyNativeSettings) {
        await settingsUiModule.initializeSpicetifyNativeSettings();
      }
      console.log(
        "🌟 [StarryNight] Spicetify native settings with Year3000System integration initialized"
      );
    } else {
      console.warn(
        "🌟 [StarryNight] React APIs not available - continuing with CSS-only theme"
      );
    }
  } catch (e) {
    console.error("[StarryNight] Failed to initialize native settings:", e);
    console.warn(
      "🌟 [StarryNight] Continuing with CSS-only theme (no settings UI)"
    );
  }

  // 4. Expose for debugging
  if (YEAR3000_CONFIG.enableDebug) {
    (window as any).Y3K = {
      system: year3000System,
      // Expose internal modules for easier debugging
      music: year3000System.musicSyncService,
      settings: year3000System.settingsManager,
      // Expose the superior, specialized debug tools directly
      debug: Year3000Debug,
      health: year3000System.systemHealthMonitor,
      // Add degraded mode info
      mode: degradedMode ? "degraded" : "full",
      availableAPIs: requiredAPIs,
    };
  }

  const initTime = Date.now() - startTime;
  console.log(
    `🌌 Catppuccin StarryNight Theme initialized in ${initTime}ms (${
      degradedMode ? "degraded" : "full"
    } mode). Welcome to the future of sound!`
  );
})();
