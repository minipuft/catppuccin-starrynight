(function () {
  "use strict";

  console.log("🌟 [Catppuccin StarryNight] Extension starting...");

  // Progressive API detection with timeout fallbacks
  async function waitForAPI(apiPath, timeout = 5000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        // Navigate API path safely
        const api = apiPath.split(".").reduce((obj, prop) => {
          if (prop.includes("(") && prop.includes(")")) {
            // Handle method calls like 'document.querySelector(".main-view-container")'
            const methodMatch = prop.match(/(\w+)\(([^)]*)\)/);
            if (methodMatch && obj) {
              const [, methodName, args] = methodMatch;
              const cleanArgs = args.replace(/['"]/g, "");
              return obj[methodName]?.(cleanArgs);
            }
          }
          return obj?.[prop];
        }, window);

        if (api) {
          console.log(`🌟 [Extension] API available: ${apiPath}`);
          return api;
        }
      } catch (e) {
        // Continue waiting - API not ready
      }

      // Non-blocking wait
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.warn(`🌟 [Extension] API timeout: ${apiPath} (${timeout}ms)`);
    return null;
  }

  // NEW: Wait until **all** required Spicetify core APIs are available (e.g., Player, Platform)
  async function waitForSpicetifyApis(
    required = ["Player", "Platform"],
    timeout = 15000
  ) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (window.Spicetify && required.every((key) => window.Spicetify[key])) {
        // Map the required keys to their actual objects for convenience
        const apiMap = {};
        required.forEach((key) => {
          apiMap[key] = window.Spicetify[key];
        });
        console.log(
          `🌟 [Extension] All required Spicetify APIs are ready: ${required.join(
            ", "
          )}`
        );
        return apiMap;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(
      `Required Spicetify APIs not available within ${timeout} ms: ${required.join(
        ", "
      )}`
    );
  }

  // Check for DOM elements with timeout
  async function waitForDOM(selector, timeout = 10000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`🌟 [Extension] DOM ready: ${selector}`);
        return element;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.warn(`🌟 [Extension] DOM timeout: ${selector} (${timeout}ms)`);
    return null;
  }

  // Progressive system initialization
  async function initializeYear3000Systems() {
    console.log(
      "🌟 [Catppuccin StarryNight] Beginning progressive initialization..."
    );

    // Step 1: Wait for basic Spotify UI (always needed)
    const mainContainer = await waitForDOM(".main-view-container", 10000);
    if (!mainContainer) {
      console.error("🌟 [Extension] Critical: Spotify UI not available");
      return;
    }

    // Step 2: Wait for *core* Spicetify APIs (Player & Platform) with an extended timeout
    console.log(
      "🌟 [Extension] Waiting for core Spicetify APIs (Player, Platform)..."
    );

    let playerAPI = null;
    let platformAPI = null;
    let degradedMode = false;

    try {
      const apis = await waitForSpicetifyApis(["Player", "Platform"], 15000);
      playerAPI = apis.Player;
      platformAPI = apis.Platform;
    } catch (err) {
      console.warn(
        "🌟 [Extension] Core Spicetify APIs not ready within 15 s – proceeding in degraded mode.",
        err
      );
      degradedMode = true;
      // Best-effort: still grab whatever APIs are available after timeout
      playerAPI = window.Spicetify?.Player || null;
      platformAPI = window.Spicetify?.Platform || null;
    }

    // Config API is optional for colour-scheme defaults; wait shorter
    const configAPI = await waitForAPI("Spicetify.Config", 5000);

    if (degradedMode) {
      console.log(
        "🌟 [Extension] Initializing in DEGRADED MODE (limited APIs available)"
      );
    } else {
      console.log(
        "🌟 [Extension] Initializing in FULL MODE (all APIs available)"
      );
    }

    // Step 4: Initialize Year3000System with available context
    try {
      // Import the compiled theme system
      if (typeof window.year3000System === "undefined") {
        console.warn(
          "🌟 [Extension] Year3000System not found in global scope, attempting dynamic load..."
        );

        // Try to initialize directly if the system exists
        const themeScript = document.querySelector('script[src*="theme.js"]');
        if (themeScript) {
          console.log(
            "🌟 [Extension] Found theme.js, waiting for system initialization..."
          );

          // Wait for the system to be available
          const system = await waitForAPI("year3000System", 5000);
          if (system) {
            window.year3000System = system;
          }
        }
      }

      if (
        window.year3000System &&
        typeof window.year3000System.initializeWithAvailableAPIs === "function"
      ) {
        await window.year3000System.initializeWithAvailableAPIs({
          player: playerAPI,
          platform: platformAPI,
          config: configAPI,
          degradedMode: degradedMode,
        });

        console.log("🌟 [Extension] Year3000System initialized successfully");
      } else {
        console.log(
          "🌟 [Extension] Year3000System not available, using CSS-only mode"
        );
        // Basic theme functionality through CSS variables only
        initializeBasicTheme(configAPI);
      }
    } catch (error) {
      console.error(
        "🌟 [Extension] Failed to initialize Year3000System:",
        error
      );
      console.log(
        "🌟 [Extension] Falling back to basic theme functionality..."
      );

      // Fallback to basic theme
      initializeBasicTheme(configAPI);
    }

    // Step 5: Set up progressive enhancement monitoring
    if (degradedMode) {
      setupProgressiveEnhancement();
    }

    console.log(
      "🌟 [Catppuccin StarryNight] Extension initialization complete"
    );
  }

  // Basic theme initialization (CSS variables only)
  function initializeBasicTheme(configAPI) {
    console.log("🌟 [Extension] Initializing basic theme (CSS variables only)");

    try {
      // Apply basic Catppuccin colors
      const colorScheme = configAPI?.color_scheme || "mocha";
      const root = document.documentElement;

      if (root) {
        // Set basic theme variables
        root.style.setProperty("--sn-theme-loaded", "1");
        root.style.setProperty("--sn-mode", "basic");
        root.style.setProperty("--sn-color-scheme", colorScheme);

        console.log("🌟 [Extension] Basic theme variables applied");
      }
    } catch (error) {
      console.error(
        "🌟 [Extension] Error in basic theme initialization:",
        error
      );
    }
  }

  // Monitor for API upgrades
  function setupProgressiveEnhancement() {
    console.log(
      "🌟 [Extension] Setting up progressive enhancement monitoring..."
    );

    let upgradeAttempts = 0;
    const maxUpgradeAttempts = 30; // 1 minute total

    const enhancementCheck = setInterval(() => {
      upgradeAttempts++;

      // Check if previously missing APIs are now available
      if (window.Spicetify?.Player && window.year3000System) {
        console.log(
          "🌟 [Extension] APIs now available! Upgrading to full mode..."
        );

        // Clear the interval
        clearInterval(enhancementCheck);

        // Attempt upgrade
        if (typeof window.year3000System.upgradeToFullMode === "function") {
          window.year3000System.upgradeToFullMode().catch((error) => {
            console.error("🌟 [Extension] Upgrade to full mode failed:", error);
          });
        } else {
          console.log("🌟 [Extension] Re-initializing with full APIs...");
          // Re-run initialization with full APIs
          initializeYear3000Systems();
        }
      }

      // Stop checking after max attempts
      if (upgradeAttempts >= maxUpgradeAttempts) {
        console.log(
          "🌟 [Extension] Progressive enhancement monitoring stopped (timeout)"
        );
        clearInterval(enhancementCheck);
      }
    }, 2000); // Check every 2 seconds
  }

  // Start the initialization process immediately
  console.log(
    "🌟 [Catppuccin StarryNight] Extension loaded, starting initialization..."
  );
  initializeYear3000Systems().catch((error) => {
    console.error("🌟 [Extension] Critical initialization error:", error);
  });
})();
