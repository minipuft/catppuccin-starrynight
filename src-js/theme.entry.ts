import { ADVANCED_SYSTEM_CONFIG } from "./config/globalConfig";
import { settings } from "./config"; // TypedSettingsManager singleton
import { ThemeLifecycleCoordinator, Year3000System, AdvancedThemeSystem } from "./core/lifecycle/ThemeLifecycleCoordinator";
import { Y3KDebug } from "./debug/DebugCoordinator";
import * as ThemeUtilities from "./utils/core/ThemeUtilities";
import { waitForSpicetifyReady } from "./utils/platform/spicetifyReady";
import { initializeAberrationManager } from "./visual/ui/Aberration/AberrationManager"; // Re-enabled for hybrid CSS+WebGL approach
import { initializeAudioVisualController } from "./visual/ui/AudioVisualController";
import { startCardDOMWatcher } from "./utils/dom/CardDOMWatcher"; // Phase 2: Card normalization

// Progressive enhancement utilities
import {
  waitForAPI,
  waitForDOMElement,
  waitForCatppuccinTheme,
} from "./core/lifecycle/ProgressiveAPILoader";

// A placeholder for the settings UI function until it can be properly typed.
declare const initializeSettingsUI: (location: any) => void;

// A type guard to check for Spicetify.Platform.History
function isHistoryAvailable(platform: any): platform is { History: any } {
  return platform && typeof platform.History?.listen === "function";
}

// Note: waitForAPI, waitForDOMElement, and waitForCatppuccinTheme are now imported from
// ProgressiveAPILoader module (Phase 2 refactoring)

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
    ADVANCED_SYSTEM_CONFIG.enableDebug = true;
    // Activate Drag Cartography mapping in debug mode (Phase 1)
    import("./debug/DragCartographer").then((m) => {
      m.enableDragCartography?.();
      (window as any).getDragMap = m.getDragMap;
    });
  }

  // 1. Instantiate the main system. It will handle its own internal dependencies.
  const year3000System = new ThemeLifecycleCoordinator(ADVANCED_SYSTEM_CONFIG);

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

      // Note: Progressive enhancement is now handled internally by ThemeLifecycleCoordinator
      // via DegradedModeCoordinator (Phase 2 refactoring)
    } else {
      // Full initialization if all APIs are available
      await year3000System.initializeAllSystems();
      year3000System.setupMusicAnalysisAndColorExtraction();

      console.log("🌟 [StarryNight] Full initialization complete");

      // 🌌 Enable Year3000 Stellar Navigation Mode (Dot Matrix Grid Effects)
      document.body.setAttribute('data-layout', 'navigation');
      console.log("🌌 [StarryNight] Stellar Navigation Mode activated - grid breathing enabled");

      // 🃏 Start CardDOMWatcher for unified card detection (Phase 2)
      const disposeCardWatcher = startCardDOMWatcher({
        enableDebug: ADVANCED_SYSTEM_CONFIG.enableDebug,
        onCardDiscovered: (card) => {
          if (ADVANCED_SYSTEM_CONFIG.enableDebug) {
            console.log('[CardDOMWatcher] New card discovered and normalized:', card.className);
          }
        }
      });
      // Store disposer for cleanup
      (year3000System as any).disposeCardWatcher = disposeCardWatcher;
      console.log("🃏 [StarryNight] CardDOMWatcher active - normalizing Spotify card variants");

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
  if (ADVANCED_SYSTEM_CONFIG.enableDebug) {
    (window as any).Y3K = {
      system: year3000System,
      // Expose internal modules for easier debugging
      music: year3000System.musicSyncService,
      settings: settings, // TypedSettingsManager singleton
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
        enableDebug: ADVANCED_SYSTEM_CONFIG.enableDebug,
        performanceAnalyzer: year3000System.performanceAnalyzer,
        onFlushComplete: () => {
          year3000System.performanceAnalyzer?.emitTrace?.(
            "[SidebarPerformanceCoordinator] Flush completed"
          );
        },
      });

      // Initialize the consolidated sidebar visual effects system
      const sidebarSystem = new SidebarVisualEffectsSystem(
        ADVANCED_SYSTEM_CONFIG,
        ThemeUtilities,
        year3000System.performanceAnalyzer,
        year3000System.musicSyncService as any,
        // NOTE: settingsManager argument removed - using TypedSettingsManager singleton
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

  // 3c. 🌊 Initialize Depth Visual Effects Controller (Phase 4.2e)
  try {
    const { DepthVisualEffectsController } = await import(
      "./visual/effects/DepthLayerController"
    );

    const depthController = new DepthVisualEffectsController(
      ADVANCED_SYSTEM_CONFIG,
      ThemeUtilities,
      year3000System.performanceAnalyzer,
      year3000System.musicSyncService as any
      // NOTE: settingsManager argument removed - using TypedSettingsManager singleton
    );
    await depthController.initialize();
    (year3000System as any).depthController = depthController;
    // Backward compatibility alias
    (year3000System as any).depthConsciousnessController = depthController;

    console.log("🌊 [StarryNight] Depth Visual Effects Controller initialized");
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize DepthVisualEffectsController",
      err
    );
  }

  // 3d. 💎 Initialize Atmospheric Crystals System (Phase 8.3)
  try {
    const { AtmosphericCrystalsSystem } = await import(
      "./visual/atmospheric/AtmosphericCrystalsSystem"
    );

    const atmosphericCrystals = new AtmosphericCrystalsSystem();
    await atmosphericCrystals.initialize();
    (year3000System as any).atmosphericCrystals = atmosphericCrystals;

    console.log("💎 [StarryNight] Atmospheric Crystals System activated - Year3000 depth rendering");
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize AtmosphericCrystalsSystem",
      err
    );
  }

  // 🔧 PHASE 7.3: DynamicCatppuccinBridge REMOVED (legacy duplicate system)
  // SpicetifyColorBridge now handles ALL CSS variable application including:
  // - Dynamic accent variables (--sn-dynamic-accent-*)
  // - OKLAB metadata (--sn-oklch-*, enhanced colors)
  // - Music energy variables (--sn-music-energy)
  // - Living gradient variables (--sn-living-base-*)
  // - Visual effects variables (--sn-visual-effects-*)
  //
  // DynamicCatppuccinBridge was a Phase 2.1 system that created race conditions
  // by applying the same CSS variables as SpicetifyColorBridge (last-writer-wins).
  // Removed in Phase 7.3 after SpicetifyColorBridge enhancement in Phase 7.2.

  // 3f. 🌊 Initialize Dynamic Gradient Strategy System (Phase 2.2 - Consolidated)
  try {
    const { DynamicGradientStrategy } = await import(
      "./visual/strategies/DynamicGradientStrategy"
    );

    const dynamicGradientSystem = new DynamicGradientStrategy(
      ADVANCED_SYSTEM_CONFIG,
      ThemeUtilities,
      year3000System.performanceAnalyzer,
      year3000System.musicSyncService as any
      // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
    );
    await dynamicGradientSystem.initialize();

    // 🔧 PHASE 7.3: DynamicCatppuccinBridge reference removed (legacy system)
    // Link with other visual-effects systems
    if ((year3000System as any).depthController) {
      // The living gradient system coordinates with depth visual-effects
      console.log(
        "🌊 [StarryNight] Consolidated Dynamic Gradient System linked with Depth Controller"
      );
    }

    // Store as both visual system and color strategy for unified access
    (year3000System as any).dynamicGradientSystem = dynamicGradientSystem;
    (year3000System as any).livingGradientStrategy = dynamicGradientSystem; // Alias for color strategy access

    console.log(
      "🌊 [StarryNight] Consolidated Dynamic Gradient Strategy System awakened - unified color processing and visual system lifecycle with performance optimizations"
    );
  } catch (err) {
    console.error(
      "[StarryNight] Failed to initialize Consolidated Dynamic Gradient Strategy System",
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
 * Progressive Enhancement System - Deprecated (Phase 2 Refactoring)
 *
 * Progressive enhancement is now handled internally by:
 * - DegradedModeCoordinator: Monitors for API availability
 * - ThemeLifecycleCoordinator: Orchestrates system upgrades
 *
 * This refactoring reduces code duplication and improves separation of concerns.
 */
