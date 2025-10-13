// Use Spicetify's provided React
const React = (window as any).Spicetify?.React;
const ReactDOM = (window as any).Spicetify?.ReactDOM;
const { useState, useEffect } = React || {};

import { SettingsSection } from "./SettingsSection";

const SETTINGS_ICON = `<svg width="16" height="16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.012 2.25c.734.008 1.465.093 2.182.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.927 1.116l1.401-.615a.75.75 0 0 1 .85.174 9.792 9.792 0 0 1 2.204 3.792.75.75 0 0 1-.271.825l-1.242.916a1.381 1.381 0 0 0 0 2.226l1.243.915a.75.75 0 0 1 .272.826 9.797 9.797 0 0 1-2.204 3.792.75.75 0 0 1-.848.175l-1.407-.617a1.38 1.38 0 0 0-1.926 1.114l-.169 1.526a.75.75 0 0 1-.572.647 9.518 9.518 0 0 1-4.406 0 .75.75 0 0 1-.572-.647l-.168-1.524a1.382 1.382 0 0 0-1.926-1.11l-1.406.616a.75.75 0 0 1-.849-.175 9.798 9.798 0 0 1-2.204-3.796.75.75 0 0 1 .272-.826l1.243-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.271-.826 9.793 9.793 0 0 1 2.204-3.792.75.75 0 0 1 .85-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.717-.159 1.45-.243 2.201-.252Zm0 1.5a9.135 9.135 0 0 0-1.354.117l-.109.977A2.886 2.886 0 0 1 6.525 7.17l-.898-.394a8.293 8.293 0 0 0-1.348 2.317l.798.587a2.881 2.881 0 0 1 0 4.643l-.799.588c.32.842.776 1.626 1.348 2.322l.905-.397a2.882 2.882 0 0 1 4.017 2.318l.11.984c.889.15 1.798.15 2.687 0l.11-.984a2.881 2.881 0 0 1 4.018-2.322l.905.396a8.296 8.296 0 0 0 1.347-2.318l-.798-.588a2.881 2.881 0 0 1 0-4.643l.796-.587a8.293 8.293 0 0 0-1.348-2.317l-.896.393a2.884 2.884 0 0 1-4.023-2.324l-.11-.976a8.988 8.988 0 0 0-1.333-.117ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm0 1.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" fill="currentColor"/></svg>`;

/**
 * Load Spotify's settings page CSS for consistent styling
 */
function loadSettingsCSS() {
  const linkHref = '/xpui-routes-desktop-settings.css';
  let linkElem = document.querySelector(`link[href="${linkHref}"]`) as HTMLLinkElement | null;

  if (!linkElem) {
    linkElem = document.createElement('link');
    linkElem.rel = 'stylesheet';
    linkElem.type = 'text/css';
    linkElem.href = linkHref;
    document.head.append(linkElem);
  }
}

/**
 * Open the StarryNight settings modal using Spicetify's PopupModal
 *
 * Features:
 * - Modal-based UI (isolated from Spotify's settings page)
 * - Hot-reload: Settings UI updates immediately when values change
 * - Reactive subscriptions to TypedSettingsManager onChange() events
 */
export async function openSettingsModal() {
  // Load settings CSS
  loadSettingsCSS();

  // Wait for PopupModal API
  const maxWait = 5000;
  const startTime = Date.now();

  while (!(window as any).Spicetify?.PopupModal) {
    if (Date.now() - startTime > maxWait) {
      console.error('[StarryNight] PopupModal API not available after 5s');
      return;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  const PopupModal = (window as any).Spicetify.PopupModal;

  // Get the settings section instance
  const section = await createSettingsSection();

  // Create modal content component
  const ModalContent = () => {
    const [nonce, setNonce] = (useState as any)(0);

    // Force rerender when needed
    section.setRerender = setNonce;

    // Subscribe to settings changes for hot-reload behavior
    (useEffect as any)(() => {
      const { settings } = require('@/config');

      // Listen to all settings changes and trigger re-render
      const listener = () => {
        setNonce((prev: number) => prev + 1);
      };

      settings.onChange(listener);

      // Cleanup subscription on unmount
      return () => {
        settings.offChange(listener);
      };
    }, []);

    return (
      <div className="starrynight-settings-modal" style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '16px'
      }}>
        <section.FieldsContainer />
      </div>
    );
  };

  // Display the modal
  PopupModal.display({
    title: 'StarryNight Theme Settings',
    content: <ModalContent />,
    isLarge: true,
  });
}

/**
 * Create the settings section with all field definitions
 */
async function createSettingsSection(): Promise<SettingsSection> {
  const { SettingsSection } = await import("./SettingsSection");
  const { HARMONIC_MODES } = await import("@/config/globalConfig");
  const { settings } = await import("@/config");
  const { applyStarryNightSettings } = await import("@/visual/base/starryNightEffects");
  const { getGlobalCSSVariableWriter } = await import("@/core/css/CSSVariableWriter");
  const { DefaultServiceFactory } = await import("@/core/services/CoreServiceProviders");

  const section = new SettingsSection(
    "StarryNight Theme",
    "starrynight-settings"
  );

  // Helper to get CSS controller
  function getCSSController() {
    const services = DefaultServiceFactory.getServices();
    return services.themeLifecycle?.getCssController() || getGlobalCSSVariableWriter();
  }

  function getThemeService() {
    return DefaultServiceFactory.getServices().themeLifecycle || null;
  }

  // --- Accent colour ---
  const accentOptions = [
    "dynamic",
    "rosewater", "flamingo", "pink", "mauve", "red", "maroon",
    "peach", "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender",
  ];
  const currentAccent = settings.get("catppuccin-accentColor");

  section.addDropDown(
    "catppuccin-accentColor",
    "Accent colour (primary theme color)",
    accentOptions,
    Math.max(0, accentOptions.indexOf(currentAccent)),
    undefined,
    {
      onChange: (e: any) => {
        try {
          const grad = settings.get("sn-gradient-intensity");
          applyStarryNightSettings(grad as any, grad as any);
        } catch (err) {
          console.error("[StarryNight] Failed to update accent colour", err);
        }
      },
    }
  );

  // --- Master gradient intensity ---
  const intensityOptions = ["disabled", "minimal", "balanced", "intense"] as const;
  const currentGradient = settings.get("sn-gradient-intensity");

  section.addDropDown(
    "sn-gradient-intensity",
    "Background effects intensity (stars, nebula, flow gradients)",
    intensityOptions as unknown as string[],
    Math.max(0, intensityOptions.indexOf(currentGradient as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newGrad = intensityOptions[idx] ?? "balanced";
        applyStarryNightSettings(newGrad as any, newGrad as any);
      },
    }
  );

  // --- Brightness mode ---
  const brightnessOptions = ["bright", "balanced", "dark"] as const;
  const currentBrightness = settings.get("sn-brightness-mode") || "balanced";

  section.addDropDown(
    "sn-brightness-mode",
    "Brightness mode",
    brightnessOptions as unknown as string[],
    Math.max(0, brightnessOptions.indexOf(currentBrightness as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newBrightness = brightnessOptions[idx] ?? "bright";

        const cssController = getCSSController();
        const brightnessVariables = {
          "--sn-brightness-mode": `"${newBrightness}"`,
          "--sn-brightness-data-attr": newBrightness,
        };

        cssController.batchSetVariables(
          "StarryNightSettings",
          brightnessVariables,
          "high",
          "brightness-mode-change"
        );

        document.documentElement.setAttribute("data-sn-brightness", newBrightness);
        console.log(`[StarryNight] Brightness mode changed to: ${newBrightness}`);
      },
    }
  );

  // --- Catppuccin flavour ---
  const flavourOptions = ["latte", "frappe", "macchiato", "mocha", "aurora", "bioluminescent"] as const;
  const currentFlavor = settings.get("catppuccin-flavor");

  section.addDropDown(
    "catppuccin-flavor",
    "Catppuccin flavour (light/dark theme base)",
    flavourOptions as unknown as string[],
    Math.max(0, flavourOptions.indexOf(currentFlavor as any)),
    undefined
  );

  // --- Palette System ---
  const paletteOptions = ["catppuccin", "year3000"] as const;
  const paletteLabels = ["Catppuccin Classic", "Year 3000 Cinematic"];
  const currentPalette = settings.get("sn-palette-system");

  section.addDropDown(
    "sn-palette-system",
    "Palette system (color foundation vs enhancement)",
    paletteOptions as unknown as string[],
    Math.max(0, paletteOptions.indexOf(currentPalette as any)),
    undefined,
    undefined,
    paletteLabels
  );

  // --- Glassmorphism ---
  const glassOptions = ["disabled", "minimal", "moderate", "intense"] as const;
  const currentGlass = settings.get("sn-glassmorphism-level");

  section.addDropDown(
    "sn-glassmorphism-level",
    "Glassmorphism",
    glassOptions as unknown as string[],
    Math.max(0, glassOptions.indexOf(currentGlass as any)),
    undefined
  );

  // --- Artistic mode ---
  const artisticOptions = ["corporate-safe", "artist-vision", "cosmic-maximum"] as const;
  const currentArtistic = settings.get("sn-artistic-mode");

  section.addDropDown(
    "sn-artistic-mode",
    "Artistic mode",
    artisticOptions as unknown as string[],
    Math.max(0, artisticOptions.indexOf(currentArtistic as any)),
    undefined
  );

  // --- Harmonic mode ---
  const harmonicModes = Object.keys(HARMONIC_MODES) as string[];
  const currentHarmMode = settings.get("sn-current-harmonic-mode");

  if (harmonicModes.length) {
    section.addDropDown(
      "sn-current-harmonic-mode",
      "Harmonic colour mode",
      harmonicModes,
      Math.max(0, harmonicModes.indexOf(currentHarmMode as any)),
      undefined
    );
  }

  // --- Harmonic intensity ---
  const currentHarmInt = String(settings.get("sn-harmonic-intensity") || "0.7");
  section.addInput(
    "sn-harmonic-intensity",
    "Harmonic intensity (music-color sync strength 0-1)",
    currentHarmInt,
    "number"
  );

  // --- Harmonic evolution ---
  const currentEvolution = settings.get("sn-harmonic-evolution");
  section.addToggle(
    "sn-harmonic-evolution",
    "Allow harmonic evolution",
    currentEvolution
  );

  // --- Performance Mode ---
  const performanceModes = ["auto", "performance", "balanced", "quality", "maximum"] as const;
  const performanceModeLabels = [
    "Auto (detect device capabilities - recommended)",
    "Performance (faster, reduced effects - low-end devices)",
    "Balanced (standard quality for most devices)",
    "Quality (high quality with all features - powerful devices)",
    "Maximum (ultra quality + experimental features - enthusiasts)",
  ] as const;

  const currentPerformanceMode = settings.get("sn-performance-mode") || "auto";
  const currentModeIndex = Math.max(0, performanceModes.indexOf(currentPerformanceMode as any));

  section.addDropDown(
    "sn-performance-mode",
    "Performance mode (controls WebGL, animations, and effects quality)",
    performanceModes as unknown as string[],
    currentModeIndex,
    undefined,
    {
      onChange: async (e: any) => {
        try {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const mode = performanceModes[idx] ?? "auto";
          console.log(`[StarryNight] Performance mode changed to: ${mode} - ${performanceModeLabels[idx]}`);
        } catch (err) {
          console.error("[StarryNight] Failed to update performance mode", err);
        }
      },
    },
    performanceModeLabels as unknown as string[]
  );

  // --- Corridor effects ---
  const corridorOptions = ["auto", "enabled", "disabled"] as const;
  const corridorLabels = [
    "Auto (intelligent detection)",
    "Enabled (force on if supported)",
    "Disabled (never use corridor effects)"
  ] as const;
  const currentCorridor = settings.get("sn-corridor-effects-mode") || "auto";

  section.addDropDown(
    "sn-corridor-effects-mode",
    "Corridor effects (3D tunnel/depth effects)",
    corridorOptions as unknown as string[],
    Math.max(0, corridorOptions.indexOf(currentCorridor as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const val = corridorOptions[idx] ?? "auto";
        void getThemeService()?.applyInitialSettings();
        console.log(`[StarryNight] Corridor effects mode changed to: ${val}`);
      },
    },
    corridorLabels as unknown as string[]
  );

  // --- Rendering mode ---
  const renderingOptions = ["auto", "basic", "standard", "enhanced", "full"] as const;
  const renderingLabels = [
    "Auto (intelligent selection)",
    "Basic (CSS only, no WebGL)",
    "Standard (basic WebGL)",
    "Enhanced (liquid shader)",
    "Full (liquid + corridor effects)"
  ] as const;
  const currentRendering = settings.get("sn-rendering-mode") || "auto";

  section.addDropDown(
    "sn-rendering-mode",
    "Rendering mode (advanced: manual quality override)",
    renderingOptions as unknown as string[],
    Math.max(0, renderingOptions.indexOf(currentRendering as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const val = renderingOptions[idx] ?? "auto";
        void getThemeService()?.applyInitialSettings();
        console.log(`[StarryNight] Rendering mode changed to: ${val}`);
      },
    },
    renderingLabels as unknown as string[]
  );

  return section;
}

/**
 * Register settings access point (menu item or topbar button)
 */
export async function registerSettingsAccessPoint() {
  // Wait for required APIs
  const maxWait = 5000;
  const startTime = Date.now();

  while (!(window as any).Spicetify?.Menu?.Item) {
    if (Date.now() - startTime > maxWait) {
      console.error('[StarryNight] Menu.Item API not available');
      return;
    }
    await new Promise(r => setTimeout(r, 100));
  }

  try {
    const MenuItem = (window as any).Spicetify.Menu.Item;
    const settingsItem = new MenuItem(
      'StarryNight Settings',
      false,
      openSettingsModal,
      SETTINGS_ICON
    );
    settingsItem.register();

    console.log('✨ [StarryNight] Settings menu item registered');
  } catch (err) {
    console.error('[StarryNight] Failed to register settings menu item:', err);
  }
}
