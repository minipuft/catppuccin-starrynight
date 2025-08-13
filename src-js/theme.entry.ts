import { YEAR3000_CONFIG } from "./config/globalConfig";
import { Year3000System } from "./core/lifecycle/year3000System";
import { Y3KDebug } from "./debug/UnifiedDebugManager";
import * as Year3000Utilities from "./utils/core/Year3000Utilities";
import { waitForSpicetifyReady } from "./utils/platform/spicetifyReady";
import { initializeAberrationManager } from "./visual/ui/Aberration/AberrationManager"; // Re-enabled for hybrid CSS+WebGL approach
import { initializeAudioVisualController } from "./visual/ui/AudioVisualController";

// A placeholder for the settings UI function until it can be properly typed.
declare const initializeSettingsUI: (location: any) => void;

// A type guard to check for Spicetify.Platform.History
function isHistoryAvailable(platform: any): platform is { History: any } {
  return platform && typeof platform.History?.listen === "function";
}

// Enhanced progressive API detection with comprehensive error handling
async function waitForAPI(apiPath: string, timeout = 5000): Promise<any> {
  const start = Date.now();
  let lastError: Error | null = null;
  let attemptCount = 0;

  while (Date.now() - start < timeout) {
    attemptCount++;
    try {
      const api = apiPath
        .split(".")
        .reduce((obj: any, prop: string) => obj?.[prop], window as any);

      if (api) {
        console.log(
          `✅ [StarryNight] API ${apiPath} available after ${attemptCount} attempts (${
            Date.now() - start
          }ms)`
        );
        return api;
      }
    } catch (e) {
      lastError = e as Error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Enhanced error logging for debugging
  console.warn(
    `❌ [StarryNight] API ${apiPath} timeout after ${timeout}ms (${attemptCount} attempts)`
  );
  if (lastError) {
    console.warn(
      `❌ [StarryNight] Last error for ${apiPath}:`,
      lastError.message
    );
  }

  // Additional diagnostic information
  const pathParts = apiPath.split(".");
  let currentObj: any = window;
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (
      !part ||
      !currentObj ||
      typeof currentObj !== "object" ||
      currentObj[part] === undefined
    ) {
      console.warn(
        `❌ [StarryNight] API path ${apiPath} breaks at '${part}' (step ${
          i + 1
        }/${pathParts.length})`
      );
      break;
    }
    currentObj = currentObj[part];
  }

  return null;
}

// Enhanced DOM element waiting function
async function waitForDOMElement(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  const start = Date.now();
  let attemptCount = 0;

  while (Date.now() - start < timeout) {
    attemptCount++;
    try {
      const element = document.querySelector(selector);
      if (element) {
        console.log(
          `✅ [StarryNight] DOM element '${selector}' found after ${attemptCount} attempts (${
            Date.now() - start
          }ms)`
        );
        return element;
      }
    } catch (e) {
      console.warn(`❌ [StarryNight] DOM query error for '${selector}':`, e);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.warn(
    `❌ [StarryNight] DOM element '${selector}' not found after ${timeout}ms (${attemptCount} attempts)`
  );
  return null;
}

// 🔧 CRITICAL FIX: Wait for Catppuccin theme to be fully loaded
async function waitForCatppuccinTheme(timeout = 5000): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      const rootStyle = getComputedStyle(document.documentElement);

      // Check for key Catppuccin variables to ensure theme is loaded
      const baseColor = rootStyle.getPropertyValue("--spice-base").trim();
      const accentColor = rootStyle.getPropertyValue("--spice-accent").trim();
      const textColor = rootStyle.getPropertyValue("--spice-text").trim();

      // Ensure we have non-default, non-white colors
      const isValidColor = (color: string) => {
        const normalized = color.toLowerCase();
        return (
          color &&
          !normalized.includes("#ffffff") &&
          !normalized.includes("#fff") &&
          !normalized.includes("white") &&
          normalized.match(/^#[0-9a-f]{6}$/i)
        );
      };

      if (
        isValidColor(baseColor) &&
        isValidColor(accentColor) &&
        isValidColor(textColor)
      ) {
        console.log(
          `🎨 [StarryNight] Catppuccin theme loaded: base=${baseColor}, accent=${accentColor}, text=${textColor}`
        );
        return true;
      }

      // If colors are still default/white, continue waiting
      console.log(
        `🎨 [StarryNight] Waiting for Catppuccin theme... (base=${baseColor}, accent=${accentColor})`
      );
    } catch (e) {
      // Continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.warn(
    `🎨 [StarryNight] Catppuccin theme not fully loaded after ${timeout}ms - proceeding with fallbacks`
  );
  return false;
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
    console.error(
      "❌ [StarryNight] CRITICAL: Spicetify not fully ready after 10s – proceeding with degraded visual-only mode."
    );
    console.error("❌ [StarryNight] Available Spicetify objects:", {
      Spicetify: !!(window as any).Spicetify,
      showNotification: !!(window as any).Spicetify?.showNotification,
      Platform: !!(window as any).Spicetify?.Platform,
    });
  } else {
    console.log("✅ [StarryNight] Spicetify platform fully ready");
  }

  // 🔧 CRITICAL FIX: Wait for Catppuccin theme to be fully loaded before initializing color systems
  const themeReady = await waitForCatppuccinTheme(8000);
  if (!themeReady) {
    console.error(
      "❌ [StarryNight] CRITICAL: Catppuccin theme not fully loaded after 8s – may experience color issues"
    );
    // Additional diagnostic information
    const rootStyle = getComputedStyle(document.documentElement);
    console.error("❌ [StarryNight] Current CSS variables:", {
      base: rootStyle.getPropertyValue("--spice-base").trim(),
      accent: rootStyle.getPropertyValue("--spice-accent").trim(),
      text: rootStyle.getPropertyValue("--spice-text").trim(),
    });
  } else {
    console.log("✅ [StarryNight] Catppuccin theme fully loaded");
  }

  // Progressive API detection with reasonable timeouts
  const requiredAPIs = {
    player: await waitForAPI("Spicetify.Player", 3000),
    platform: await waitForAPI("Spicetify.Platform", 3000),
    menu: await waitForAPI("Spicetify.Menu", 2000),
    react: await waitForAPI("Spicetify.React", 2000),
    reactDOM: await waitForAPI("Spicetify.ReactDOM", 2000),
  };

  // Check for main UI container (optional for enhanced features, not required for core functionality)
  // Try multiple potential selectors for better compatibility across Spotify versions
  const mainContainerSelectors = [
    ".main-viewContainer-scrollNode",
    ".main-view-container__scroll-node-child",
    ".main-view-container",
    ".main-container",
    "#main",
    "[data-testid='main-container']",
  ];

  let mainContainer: Element | null = null;
  for (const selector of mainContainerSelectors) {
    mainContainer = await waitForDOMElement(selector, 1000); // Shorter timeout per selector
    if (mainContainer) {
      console.log(
        `✅ [StarryNight] Found main container using selector: ${selector}`
      );
      break;
    }
  }

  // Store main container reference for later use
  if (mainContainer) {
    console.log(
      "✅ [StarryNight] Enhanced UI features initialized with DOM container"
    );
  } else {
    console.warn(
      "⚠️ [StarryNight] No suitable main container found - enhanced UI features disabled"
    );
    console.warn(
      "⚠️ [StarryNight] Tried selectors:",
      mainContainerSelectors.join(", ")
    );
    console.warn(
      "⚠️ [StarryNight] Core functionality (music sync, color extraction) will still work"
    );
  }

  // Determine if we can run in full mode or degraded mode
  // Core functionality (music sync, color extraction) only requires Spicetify APIs
  const hasRequiredAPIs = requiredAPIs.player && requiredAPIs.platform;
  const degradedMode = !hasRequiredAPIs;

  if (degradedMode) {
    console.error(
      "❌ [StarryNight] DEGRADED MODE: Initializing with limited functionality due to missing APIs"
    );
    console.error("❌ [StarryNight] API availability status:", {
      player: !!requiredAPIs.player,
      platform: !!requiredAPIs.platform,
      menu: !!requiredAPIs.menu,
      react: !!requiredAPIs.react,
      reactDOM: !!requiredAPIs.reactDOM,
      mainContainer: !!mainContainer + " (optional)",
    });
    console.error("❌ [StarryNight] DEGRADED MODE limitations:");
    console.error("  - Music synchronization disabled");
    console.error("  - Advanced visual effects may not function");
    console.error("  - UI integration features disabled");
    console.error("  - Color extraction from album art disabled");
  } else {
    console.log(
      "✅ [StarryNight] FULL MODE: All required APIs available - initializing complete functionality"
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
  const year3000System = new Year3000System(YEAR3000_CONFIG);

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

      // Set up progressive enhancement to upgrade to full mode when APIs become available
      setupProgressiveEnhancement(year3000System, requiredAPIs);
    } else {
      // Full initialization if all APIs are available
      await year3000System.initializeAllSystems();
      year3000System.setupMusicAnalysisAndColorExtraction();

      console.log("🌟 [StarryNight] Full initialization complete");
      
      // Initialize UI controllers after Year3000System is fully initialized
      // (these require global CSS controller to be available)
      try {
        // 🎆 Initialize AudioVisualController (Phase 2)
        initializeAudioVisualController(year3000System);
        
        // 🌈 Adaptive Chromatic Aberration (Phase 2) - Hybrid CSS+WebGL approach
        initializeAberrationManager(year3000System);
        
        // 🌠 Enable Enhanced Drag Preview (Phase 2)
        import("./ui/interactions/DragPreviewManager").then((m) =>
          m.enableEnhancedDragPreview?.()
        );
        
        // 🎉 Enable Quick Add Radial Menu (Phase 2)
        import("./ui/interactions/PlaylistQuickAddMenu").then((m) =>
          m.enableQuickAddRadialMenu?.()
        );
        
        // ✨ Initialize Prismatic Scroll Sheen (requires global CSS controller)
        if (mainContainer) {
          import("./visual/ui/prismaticScrollSheen").then((m) =>
            m.initializePrismaticScrollSheen?.()
          );
        }
        
        console.log("🌟 [StarryNight] UI controllers initialized successfully");
      } catch (uiError) {
        console.error("[StarryNight] UI controller initialization failed:", uiError);
        // Continue without UI controllers
      }
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
        "./ui/components/StarryNightSettings"
      );
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
      debug: Y3KDebug.debug,
      health: year3000System.systemHealthMonitor,
      // Add degraded mode info
      mode: degradedMode ? "degraded" : "full",
      availableAPIs: requiredAPIs,
    };
  }

  // 3b. 🫧 Initialize Consolidated Sidebar System (All Sidebar Functionality United)
  try {
    const { SidebarVisualEffectsSystem } = await import(
      "./visual/ui/SidebarVisualEffectsSystem"
    );
    const { SidebarPerformanceCoordinator } = await import(
      "./visual/ui/SidebarPerformanceCoordinator"
    );

    if (year3000System.performanceAnalyzer) {
      // Initialize the coordinator first
      const coordinator = SidebarPerformanceCoordinator.getInstance({
        enableDebug: YEAR3000_CONFIG.enableDebug,
        performanceAnalyzer: year3000System.performanceAnalyzer,
        onFlushComplete: () => {
          year3000System.performanceAnalyzer?.emitTrace?.(
            "[SidebarPerformanceCoordinator] Flush completed"
          );
        },
      });

      // Initialize the consolidated sidebar visual effects system
      const sidebarSystem = new SidebarVisualEffectsSystem(
        YEAR3000_CONFIG,
        Year3000Utilities,
        year3000System.performanceAnalyzer,
        year3000System.musicSyncService as any,
        year3000System.settingsManager as any,
        year3000System
      );
      await sidebarSystem.initialize();
      (year3000System as any).sidebarVisualEffectsSystem = sidebarSystem;
      (year3000System as any).sidebarCoordinator = coordinator;
    }
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize Consolidated Sidebar System",
      err
    );
  }

  // 3c. 🌊 Initialize Depth Consciousness Controller (Phase 4.2e)
  try {
    const { DepthConsciousnessController } = await import(
      "./visual/effects/DepthLayerController"
    );

    const depthConsciousness = new DepthConsciousnessController(
      YEAR3000_CONFIG,
      Year3000Utilities,
      year3000System.performanceAnalyzer,
      year3000System.musicSyncService as any,
      year3000System.settingsManager as any
    );
    await depthConsciousness.initialize();
    (year3000System as any).depthConsciousnessController = depthConsciousness;

    console.log("🌊 [StarryNight] Depth Consciousness Controller awakened");
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize DepthConsciousnessController",
      err
    );
  }

  // 3d. 🎨 Initialize Dynamic Catppuccin Bridge (Phase 2.1)
  try {
    const { DynamicCatppuccinBridge } = await import(
      "./visual/effects/DynamicCatppuccinBridge"
    );

    const dynamicBridge = new DynamicCatppuccinBridge(
      YEAR3000_CONFIG,
      Year3000Utilities,
      year3000System.performanceAnalyzer,
      year3000System.musicSyncService as any,
      year3000System.settingsManager as any
    );
    await dynamicBridge.initialize();

    // Link with other consciousness systems
    if (year3000System.colorHarmonyEngine) {
      dynamicBridge.linkWithColorHarmonyEngine(
        year3000System.colorHarmonyEngine
      );
    }
    if ((year3000System as any).depthConsciousnessController) {
      dynamicBridge.linkWithDepthConsciousness(
        (year3000System as any).depthConsciousnessController
      );
    }

    year3000System.dynamicCatppuccinBridge = dynamicBridge;

    console.log("🎨 [StarryNight] Dynamic Catppuccin Bridge connected");
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize DynamicCatppuccinBridge",
      err
    );
  }

  // 3e. 🌊 Initialize Consolidated Living Gradient Strategy System (Phase 2.2 - Consolidated)
  try {
    const { LivingGradientStrategy } = await import(
      "./visual/strategies/LivingGradientStrategy"
    );

    const livingGradientSystem = new LivingGradientStrategy(
      YEAR3000_CONFIG,
      Year3000Utilities,
      year3000System.performanceAnalyzer,
      year3000System.musicSyncService as any,
      year3000System.settingsManager as any
    );
    await livingGradientSystem.initialize();

    // Link with other consciousness systems
    if ((year3000System as any).dynamicCatppuccinBridge) {
      // The living gradient system will listen to events from the dynamic bridge
      console.log(
        "🌊 [StarryNight] Consolidated Living Gradient System linked with Dynamic Catppuccin Bridge"
      );
    }
    if ((year3000System as any).depthConsciousnessController) {
      // The living gradient system coordinates with depth consciousness
      console.log(
        "🌊 [StarryNight] Consolidated Living Gradient System linked with Depth Consciousness"
      );
    }

    // Store as both visual system and color strategy for unified access
    (year3000System as any).livingGradientSystem = livingGradientSystem;
    (year3000System as any).livingGradientStrategy = livingGradientSystem; // Alias for color strategy access

    console.log(
      "🌊 [StarryNight] Consolidated Living Gradient Strategy System awakened - unified color processing and visual system lifecycle with performance optimizations"
    );
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize Consolidated Living Gradient Strategy System",
      err
    );
  }

  // -----------------------------------------------------------------------
  // 🌠 CDF Variable Bridge – start syncing canonical --sn-cdf-* props.
  // -----------------------------------------------------------------------
  try {
    const { CDFVariableBridge } = await import(
      "./core/performance/CDFVariableBridge"
    );
    if (year3000System.cssVariableController) {
      new CDFVariableBridge(year3000System.cssVariableController);
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

/**
 * Progressive Enhancement System - Upgrade from degraded mode to full mode
 * when Spicetify APIs become available
 */
function setupProgressiveEnhancement(
  year3000System: any,
  requiredAPIs: {
    player: any;
    platform: any;
    menu: any;
    react: any;
    reactDOM: any;
  }
): void {
  console.log(
    "🔄 [StarryNight] Setting up progressive enhancement monitoring..."
  );

  let upgradeAttempts = 0;
  const maxUpgradeAttempts = 30; // 5 minutes at 10-second intervals
  const upgradeCheckInterval = 10000; // 10 seconds

  const checkForUpgrade = () => {
    upgradeAttempts++;

    // Check if APIs are now available
    const currentAPIs = {
      player: (window as any).Spicetify?.Player,
      platform: (window as any).Spicetify?.Platform,
      menu: (window as any).Spicetify?.Menu,
      react: (window as any).Spicetify?.React,
      reactDOM: (window as any).Spicetify?.ReactDOM,
    };

    const hasRequiredAPIs = currentAPIs.player && currentAPIs.platform;

    if (hasRequiredAPIs) {
      console.log(
        "✅ [StarryNight] Required APIs now available - upgrading to full mode!"
      );

      // Clear the monitoring interval
      clearInterval(upgradeInterval);

      // Attempt to upgrade the system to full mode
      upgradeToFullMode(year3000System, currentAPIs)
        .then(() => {
          console.log(
            "🌟 [StarryNight] Successfully upgraded from degraded mode to full mode!"
          );

          // Update global debug object to reflect the mode change
          if ((window as any).Y3K) {
            (window as any).Y3K.mode = "full";
            (window as any).Y3K.availableAPIs = currentAPIs;
          }
        })
        .catch((error) => {
          console.error(
            "❌ [StarryNight] Failed to upgrade to full mode:",
            error
          );
          // Continue in degraded mode
        });

      return;
    }

    // Stop checking after max attempts
    if (upgradeAttempts >= maxUpgradeAttempts) {
      console.log(
        `⏰ [StarryNight] Progressive enhancement monitoring ended after ${upgradeAttempts} attempts (${
          (upgradeAttempts * upgradeCheckInterval) / 1000
        }s)`
      );
      clearInterval(upgradeInterval);
      return;
    }

    // Log progress every 5 attempts
    if (upgradeAttempts % 5 === 0) {
      console.log(
        `🔄 [StarryNight] Still monitoring for API availability... (attempt ${upgradeAttempts}/${maxUpgradeAttempts})`
      );
      console.log("🔄 [StarryNight] Current API status:", {
        player: !!currentAPIs.player,
        platform: !!currentAPIs.platform,
        menu: !!currentAPIs.menu,
        react: !!currentAPIs.react,
        reactDOM: !!currentAPIs.reactDOM,
      });
    }
  };

  // Start monitoring for API availability
  const upgradeInterval = setInterval(checkForUpgrade, upgradeCheckInterval);

  // Also listen for Spicetify events that might indicate the platform is ready
  const spicetifyReadyHandler = () => {
    console.log(
      "🎵 [StarryNight] Spicetify ready event detected - checking for upgrade..."
    );
    checkForUpgrade();
  };

  // Add event listeners for Spicetify ready events
  if ((window as any).Spicetify) {
    if ((window as any).Spicetify.Player) {
      (window as any).Spicetify.Player.addEventListener?.(
        "songchange",
        spicetifyReadyHandler
      );
    }
  }

  // Clean up event listeners when the interval ends
  setTimeout(() => {
    if ((window as any).Spicetify?.Player) {
      (window as any).Spicetify.Player.removeEventListener?.(
        "songchange",
        spicetifyReadyHandler
      );
    }
  }, maxUpgradeAttempts * upgradeCheckInterval);
}

/**
 * Upgrade the Year3000System from degraded mode to full mode
 */
async function upgradeToFullMode(
  year3000System: any,
  availableAPIs: {
    player: any;
    platform: any;
    menu: any;
    react: any;
    reactDOM: any;
  }
): Promise<void> {
  try {
    console.log("🚀 [StarryNight] Beginning upgrade to full mode...");

    // First, verify the system is actually in degraded mode
    if (!year3000System) {
      throw new Error("Year3000System instance not available");
    }

    // Check if the system has an upgrade method
    if (typeof year3000System.upgradeToFullMode === "function") {
      console.log("🔧 [StarryNight] Using system's built-in upgrade method...");
      await year3000System.upgradeToFullMode({
        player: availableAPIs.player,
        platform: availableAPIs.platform,
        config: (window as any).Spicetify?.Config,
        degradedMode: false,
      });
    } else {
      console.log(
        "🔧 [StarryNight] System upgrade method not available - attempting manual initialization..."
      );

      // Manually initialize systems that require Spicetify APIs
      if (year3000System.setupMusicAnalysisAndColorExtraction) {
        console.log(
          "🎵 [StarryNight] Setting up music analysis and color extraction..."
        );
        await year3000System.setupMusicAnalysisAndColorExtraction();
      }

      // Initialize settings UI if React APIs are available
      if (availableAPIs.react && availableAPIs.reactDOM) {
        try {
          console.log("⚙️ [StarryNight] Initializing settings UI...");
          const settingsUiModule = await import(
            "./ui/components/StarryNightSettings"
          );
          await (settingsUiModule as any).initializeStarryNightSettings?.();
          console.log("✅ [StarryNight] Settings UI initialized successfully");
        } catch (error) {
          console.warn(
            "⚠️ [StarryNight] Failed to initialize settings UI during upgrade:",
            error
          );
        }
      }
    }

    // Emit upgrade event
    if (year3000System.eventBus?.emitSync) {
      year3000System.eventBus.emitSync("system:upgraded-to-full-mode", {
        timestamp: Date.now(),
        availableAPIs: {
          player: !!availableAPIs.player,
          platform: !!availableAPIs.platform,
          menu: !!availableAPIs.menu,
          react: !!availableAPIs.react,
          reactDOM: !!availableAPIs.reactDOM,
        },
      });
    }

    console.log(
      "🌟 [StarryNight] Upgrade to full mode completed successfully!"
    );
  } catch (error) {
    console.error("❌ [StarryNight] Upgrade to full mode failed:", error);
    throw error;
  }
}
