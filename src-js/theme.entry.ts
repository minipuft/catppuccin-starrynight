import { HARMONIC_MODES, YEAR3000_CONFIG } from "./config/globalConfig";
import { Year3000System } from "./core/lifecycle/year3000System";
import { Year3000Debug } from "./debug/SystemIntegrationTester";
import { initializeAberrationManager } from "./visual/ui-effects/Aberration/AberrationManager";
import { initializeNebulaController } from "./visual/ui-effects/NebulaController";
import { waitForSpicetifyReady } from "./utils/platform/spicetifyReady";
import * as Year3000Utilities from "./utils/core/Year3000Utilities";

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

// -----------------------------------------------------------------------------
// React / ReactDOM shim for libraries bundled with CommonJS `require()` calls.
// Some third-party Spicetify-Creator plugins (e.g. `spcr-settings`) are built
// assuming `require("react")` or `require("react-dom")` is available. The
// Spotify environment injects React via `Spicetify.React` and has no Node-style
// module loader, so we patch a minimal shim **before** such code executes.
// -----------------------------------------------------------------------------

function patchReactRequire(): void {
  const g: any = globalThis as any;
  if (g.__STARLIGHT_REACT_SHIM__) return; // idempotent

  // Helper that hands back Spotify's React exports.
  const shim = (name: string) => {
    if (name === "react") return g.Spicetify?.React;
    if (name === "react-dom") return g.Spicetify?.ReactDOM;
    throw new Error(`[StarryNight shim] Module '${name}' not available`);
  };

  if (typeof g.require === "function") {
    const original = g.require.bind(g);
    g.require = (name: string) => {
      if (name === "react" || name === "react-dom") return shim(name);
      return original(name);
    };
  } else {
    g.require = shim;
  }

  g.__STARLIGHT_REACT_SHIM__ = true;
}

patchReactRequire();

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

  // Initialize light-weight prismatic scroll sheen once scroll node is confirmed.
  import("./visual/ui-effects/prismaticScrollSheen").then((m) =>
    m.initializePrismaticScrollSheen?.()
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
    // Activate Drag Cartography mapping in debug mode (Phase 1)
    import("./debug/DragCartographer").then((m) => {
      m.enableDragCartography?.();
      (window as any).getDragMap = m.getDragMap;
    });
  }

  // 1. Instantiate the main system. It will handle its own internal dependencies.
  const year3000System = new Year3000System(YEAR3000_CONFIG, HARMONIC_MODES);

  // 1a. 🎆 Initialise NebulaController (Phase 2)
  initializeNebulaController(year3000System);

  // 1a-b. 🌈 Initialise Adaptive Chromatic Aberration Canvas (Phase 2)
  initializeAberrationManager(year3000System);

  // 1b. 🌠 Enable Enhanced Drag Preview (Phase 2)
  import("./ui/interactions/EnhancedDragPreview").then((m) =>
    m.enableEnhancedDragPreview?.()
  );

  // 1c. 🎉 Enable Quick Add Radial Menu (Phase 2)
  import("./ui/interactions/QuickAddRadialMenu").then((m) =>
    m.enableQuickAddRadialMenu?.()
  );

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
      const settingsUiModule = await import("./ui/components/StarryNightSettings");
      await (settingsUiModule as any).initializeStarryNightSettings?.();
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

  // 3b. 🫧 Initialize Right Sidebar Consciousness System (Phase 2)
  try {
    const { RightSidebarConsciousnessSystem } = await import(
      "./visual/ui-effects/RightSidebarConsciousnessSystem"
    );
    const { RightSidebarCoordinator } = await import(
      "./visual/ui-effects/RightSidebarCoordinator"
    );
    
    if (year3000System.performanceAnalyzer) {
      // Initialize the coordinator first
      const coordinator = RightSidebarCoordinator.getInstance({
        enableDebug: YEAR3000_CONFIG.enableDebug,
        performanceAnalyzer: year3000System.performanceAnalyzer,
        onFlushComplete: () => {
          year3000System.performanceAnalyzer?.emitTrace?.(
            "[RightSidebarCoordinator] Flush completed"
          );
        }
      });

      // Setup DOM observation for the coordinator
      coordinator.setupDOMObservation();

      const rsSystem = new RightSidebarConsciousnessSystem(
        YEAR3000_CONFIG,
        Year3000Utilities,
        year3000System.performanceAnalyzer,
        year3000System.musicSyncService as any,
        year3000System.settingsManager as any,
        year3000System,
        coordinator
      );
      await rsSystem.initialize();
      (year3000System as any).rightSidebarConsciousnessSystem = rsSystem;
      (year3000System as any).rightSidebarCoordinator = coordinator;
    }
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize RightSidebarConsciousnessSystem",
      err
    );
  }

  // -----------------------------------------------------------------------
  // 🌠 CDF Variable Bridge – start syncing canonical --sn-cdf-* props.
  // -----------------------------------------------------------------------
  try {
    const { CDFVariableBridge } = await import("./core/performance/CDFVariableBridge");
    if (year3000System.cssVariableBatcher) {
      new CDFVariableBridge(year3000System.cssVariableBatcher);
    }
  } catch (err) {
    console.error("[StarryNight] Failed to initialize CDFVariableBridge", err);
  }

  const initTime = Date.now() - startTime;
  console.log(
    `🌌 Catppuccin StarryNight Theme initialized in ${initTime}ms (${
      degradedMode ? "degraded" : "full"
    } mode). Welcome to the future of sound!`
  );
})();
