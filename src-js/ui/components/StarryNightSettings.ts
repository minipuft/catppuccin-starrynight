import { HARMONIC_MODES } from "@/config/globalConfig";
import {
  CSSVariableWriter,
  getGlobalCSSVariableWriter,
} from "@/core/css/CSSVariableWriter";
import { DefaultServiceFactory } from "@/core/services/CoreServiceProviders";
import { SettingsSection } from "@/ui/components/SettingsSection";
import { settings } from "@/config";
import { applyStarryNightSettings } from "@/visual/base/starryNightEffects";

// Helper to get CSS controller for coordination
function getCSSController(): CSSVariableWriter {
  const services = DefaultServiceFactory.getServices();
  return (
    services.themeLifecycle?.getCssController() ||
    getGlobalCSSVariableWriter()
  );
}

function getThemeService() {
  return DefaultServiceFactory.getServices().themeLifecycle || null;
}

/**
 * Set up the StarryNight section in Spotify Settings using the
 * `spcr-settings` helper. This implementation is purposely minimal – it
 * just mounts the section and hooks navigation so the panel reliably
 * appears whenever the user opens "settings". All existing logic that
 * reads saved values and applies them lives in `applyStarryNightSettings`.
 */
export async function initializeStarryNightSettings(): Promise<void> {
  const section = new SettingsSection(
    "StarryNight Theme",
    "starrynight-settings"
  );

  // --- Accent colour drop-down (example) -----------------------------------
  const accentOptions = [
    "dynamic", // 🎨 Album-based accent (Year 3000)
    "rosewater",
    "flamingo",
    "pink",
    "mauve",
    "red",
    "maroon",
    "peach",
    "yellow",
    "green",
    "teal",
    "sky",
    "sapphire",
    "blue",
    "lavender",
  ];

  // NOTE: Now using TypedSettingsManager singleton directly via typed settings
  const currentAccent = settings.get("catppuccin-accentColor");

  (section as any).addDropDown(
    "catppuccin-accentColor", // settings key (nameId)
    "Accent colour (primary theme color)", // user-visible label
    accentOptions, // option list
    Math.max(0, accentOptions.indexOf(currentAccent)), // default index
    undefined, // onSelect (unused – we use onChange)
    {
      onChange: (e: any) => {
        try {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const newAccent = accentOptions[idx] ?? "mauve";
          settings.set("catppuccin-accentColor", newAccent as any);

          const grad = settings.get("sn-gradient-intensity");
          applyStarryNightSettings(grad as any, grad as any); // Use grad for both params since star density is consolidated

          // Trigger the main Year3000System to re-apply accent colors selectively
          void getThemeService()?.applyInitialSettings("accent");
        } catch (err) {
          console.error("[StarryNight] Failed to update accent colour", err);
        }
      },
    }
  );

  // --- Master gradient intensity drop-down (consolidated control) ---------
  const intensityOptions = [
    "disabled",
    "minimal",
    "balanced",
    "intense",
  ] as const;

  const currentGradient = settings.get("sn-gradient-intensity");

  (section as any).addDropDown(
    "sn-gradient-intensity",
    "Background effects intensity (stars, nebula, flow gradients)",
    intensityOptions as unknown as string[],
    Math.max(0, intensityOptions.indexOf(currentGradient as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newGrad = intensityOptions[idx] ?? "balanced";
        settings.set("sn-gradient-intensity", newGrad as any);

        // Apply consolidated gradient intensity to all background effects
        applyStarryNightSettings(newGrad as any, newGrad as any);
      },
    }
  );

  // NOTE: sn-flow-gradient has been consolidated into sn-gradient-intensity master control

  // NOTE: sn-star-density has been consolidated into sn-gradient-intensity master control

  // NOTE: sn-nebula-intensity has been consolidated into sn-gradient-intensity master control

  // --- Brightness mode drop-down ------------------------------------------
  const brightnessOptions = ["bright", "balanced", "dark"] as const;
  const currentBrightness = settings.get("sn-brightness-mode") || "balanced";

  (section as any).addDropDown(
    "sn-brightness-mode",
    "Brightness mode",
    brightnessOptions as unknown as string[],
    Math.max(0, brightnessOptions.indexOf(currentBrightness as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newBrightness = brightnessOptions[idx] ?? "bright";
        settings.set("sn-brightness-mode", newBrightness as any);

        // Apply brightness mode via coordination
        const cssController = getCSSController();
        const brightnessVariables = {
          "--sn-brightness-mode": `"${newBrightness}"`,
          "--sn-brightness-data-attr": newBrightness,
        };

        cssController.batchSetVariables(
          "StarryNightSettings",
          brightnessVariables,
          "high", // High priority for brightness mode changes
          "brightness-mode-change"
        );

        // Set data attribute directly as it's not a CSS variable
        document.documentElement.setAttribute(
          "data-sn-brightness",
          newBrightness
        );

        // Trigger Year3000System to refresh brightness-dependent systems
        void getThemeService()?.applyInitialSettings("brightness");
        console.log(`[StarryNight] Brightness mode changed to: ${newBrightness}`);
      },
    }
  );

  // ---------------- Additional settings ------------------------------

  // Catppuccin flavour
  const flavourOptions = ["latte", "frappe", "macchiato", "mocha"] as const;
  const currentFlavor = settings.get("catppuccin-flavor");
  (section as any).addDropDown(
    "catppuccin-flavor",
    "Catppuccin flavour (light/dark theme base)",
    flavourOptions as unknown as string[],
    Math.max(0, flavourOptions.indexOf(currentFlavor as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settings.set("catppuccin-flavor", flavourOptions[idx] as any);
        // Trigger selective flavor update instead of full settings reload
        void getThemeService()?.applyInitialSettings("flavor");
      },
    }
  );

  // Palette System (Year 3000 Enhancement)
  const paletteOptions = ["catppuccin", "year3000"] as const;
  const paletteLabels = ["Catppuccin Classic", "Year 3000 Cinematic"];
  const currentPalette = settings.get("sn-palette-system");
  (section as any).addDropDown(
    "sn-palette-system",
    "Palette system (color foundation vs enhancement)",
    paletteOptions as unknown as string[],
    Math.max(0, paletteOptions.indexOf(currentPalette as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settings.set("sn-palette-system", paletteOptions[idx] as any);
        // Trigger Year3000System to refresh palette coordination
        void getThemeService()?.applyInitialSettings();
      },
    },
    paletteLabels // Pass user-friendly labels
  );

  // Glassmorphism level
  const glassOptions = ["disabled", "minimal", "moderate", "intense"] as const;
  const currentGlass = settings.get("sn-glassmorphism-level");
  (section as any).addDropDown(
    "sn-glassmorphism-level",
    "Glassmorphism",
    glassOptions as unknown as string[],
    Math.max(0, glassOptions.indexOf(currentGlass as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settings.set("sn-glassmorphism-level", glassOptions[idx] as any);
      },
    }
  );

  // NOTE: 3D effects level has been removed (niche setting)

  // Artistic mode
  const artisticOptions = [
    "corporate-safe",
    "artist-vision",
    "cosmic-maximum",
  ] as const;
  const currentArtistic = settings.get("sn-artistic-mode");
  (section as any).addDropDown(
    "sn-artistic-mode",
    "Artistic mode",
    artisticOptions as unknown as string[],
    Math.max(0, artisticOptions.indexOf(currentArtistic as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const mode = artisticOptions[idx];
        settings.set("sn-artistic-mode", mode as any);
        // TypedSettingsManager will automatically propagate to all systems via onChange listener
      },
    }
  );

  // Harmonic mode
  const harmonicModes = Object.keys(HARMONIC_MODES) as string[];
  const currentHarmMode = settings.get("sn-current-harmonic-mode");
  if (harmonicModes.length) {
    (section as any).addDropDown(
      "sn-current-harmonic-mode",
      "Harmonic colour mode",
      harmonicModes,
      Math.max(0, harmonicModes.indexOf(currentHarmMode as any)),
      undefined,
      {
        onChange: (e: any) => {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const modeKey = harmonicModes[idx];
          settings.set("sn-current-harmonic-mode", modeKey as any);
          void getThemeService()?.applyInitialSettings();
        },
      }
    );
  }

  // Harmonic intensity (number input 0-1 step 0.05)
  const currentHarmInt = settings.get("sn-harmonic-intensity") || "0.7";
  (section as any).addInput(
    "sn-harmonic-intensity",
    "Harmonic intensity (music-color sync strength 0-1)",
    currentHarmInt,
    "number",
    {
      onChange: (e: any) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        settings.set("sn-harmonic-intensity", val as any);
      },
    }
  );

  // Harmonic evolution toggle (TypedSettingsManager provides boolean type)
  const currentEvolution = settings.get("sn-harmonic-evolution");
  (section as any).addToggle(
    "sn-harmonic-evolution",
    "Allow harmonic evolution",
    currentEvolution,
    {
      onClick: (e: any) => {
        const checked = (e.currentTarget as HTMLInputElement).checked;
        settings.set(
          "sn-harmonic-evolution",
          checked
        );
      },
    }
  );


  // NOTE: Chromatic aberration toggle has been removed (technical/niche setting)

  // NOTE: Nebula aberration strength has been removed (technical/niche setting)

  // NOTE: Temporal echo intensity has been removed (technical/niche setting)

  // === Performance Controls ===============================================
  
  // Performance Mode - Master Quality Control (Consolidates WebGL, animation, gradient quality)
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

  (section as any).addDropDown(
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

          // Update settings
          settings.set("sn-performance-mode", mode as any);

          // Log the change
          console.log(`[StarryNight] Performance mode changed to: ${mode} - ${performanceModeLabels[idx]}`);

          // Settings change event will trigger SystemIntegrationCoordinator
          // to apply the mode through PerformanceAnalyzer (Phase 3 consolidation)

        } catch (err) {
          console.error("[StarryNight] Failed to update performance mode", err);
        }
      },
    },
    performanceModeLabels as unknown as string[]
  );

  // Corridor effects mode drop-down (user-friendly control)
  const corridorOptions = ["auto", "enabled", "disabled"] as const;
  const corridorLabels = [
    "Auto (intelligent detection)",
    "Enabled (force on if supported)",
    "Disabled (never use corridor effects)"
  ] as const;
  const currentCorridor = settings.get("sn-corridor-effects-mode") || "auto";
  (section as any).addDropDown(
    "sn-corridor-effects-mode",
    "Corridor effects (3D tunnel/depth effects)",
    corridorOptions as unknown as string[],
    Math.max(0, corridorOptions.indexOf(currentCorridor as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const val = corridorOptions[idx] ?? "auto";
        settings.set("sn-corridor-effects-mode", val as any);
        // Trigger full re-initialization to apply new corridor mode
        void getThemeService()?.applyInitialSettings();
        console.log(`[StarryNight] Corridor effects mode changed to: ${val}`);
      },
    },
    corridorLabels as unknown as string[] // Pass user-friendly labels
  );

  // Rendering mode drop-down (advanced control)
  const renderingOptions = ["auto", "basic", "standard", "enhanced", "full"] as const;
  const renderingLabels = [
    "Auto (intelligent selection)",
    "Basic (CSS only, no WebGL)",
    "Standard (basic WebGL)",
    "Enhanced (liquid shader)",
    "Full (liquid + corridor effects)"
  ] as const;
  const currentRendering = settings.get("sn-rendering-mode") || "auto";
  (section as any).addDropDown(
    "sn-rendering-mode",
    "Rendering mode (advanced: manual quality override)",
    renderingOptions as unknown as string[],
    Math.max(0, renderingOptions.indexOf(currentRendering as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const val = renderingOptions[idx] ?? "auto";
        settings.set("sn-rendering-mode", val as any);
        // Trigger full re-initialization to apply new rendering mode
        void getThemeService()?.applyInitialSettings();
        console.log(`[StarryNight] Rendering mode changed to: ${val}`);
      },
    },
    renderingLabels as unknown as string[] // Pass user-friendly labels
  );

  // === GLASS PULSE CONTROLS ===============================================

  // NOTE: Glass beat pulse has been removed (technical/niche setting)


  // Push the section into the DOM.
  await (section as any).pushSettings();
  console.log("✨ [StarryNight] spcr-settings panel initialised");

  // Initialize brightness mode on load using coordination
  const initialBrightness = settings.get("sn-brightness-mode") || "balanced";

  const cssController = getCSSController();
  const initialBrightnessVariables = {
    "--sn-brightness-mode": `"${initialBrightness}"`,
    "--sn-brightness-data-attr": initialBrightness,
  };

  cssController.batchSetVariables(
    "StarryNightSettings",
    initialBrightnessVariables,
    "high", // High priority for initial brightness setup
    "brightness-mode-init"
  );

  // Set data attribute directly as it's not a CSS variable
  document.documentElement.setAttribute(
    "data-sn-brightness",
    initialBrightness
  );
  console.log(
    `[StarryNight] Initial brightness mode set to: ${initialBrightness}`
  );

  // ---- Ensure the section renders when navigating to /settings ----------
  const rerender = () => (section as any).rerender();
  const history = (globalThis as any).Spicetify?.Platform?.History;
  try {
    if (history?.listen) {
      history.listen(({ location }: any) => {
        if (location?.pathname === "/settings") {
          setTimeout(rerender, 100);
        }
      });
    }
  } catch (err) {
    console.warn("[StarryNight] Could not hook navigation for settings", err);
  }

  // If extension loads while already on /settings`, force an initial render.
  if (window.location.pathname === "/settings") {
    setTimeout(rerender, 300);
  }
}
