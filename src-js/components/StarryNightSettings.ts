import { HARMONIC_MODES } from "@/config/globalConfig";
import { applyStarryNightSettings } from "@/effects/starryNightEffects";
import { SettingsManager } from "@/managers/SettingsManager";
import { SettingsSection } from "@/utils/SettingsSection";

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

  // Retrieve the shared SettingsManager (created by Year3000System) or fall back
  // to a local instance to guarantee the UI works even in degraded mode.
  function getSettingsManager(): SettingsManager {
    const existing = (window as any).Y3K?.system?.settingsManager as
      | SettingsManager
      | undefined;
    if (existing) return existing;

    const cached = (globalThis as any).__SN_settingsManager as
      | SettingsManager
      | undefined;
    if (cached) return cached;

    const manager = new SettingsManager();
    (globalThis as any).__SN_settingsManager = manager;
    return manager;
  }

  const settingsManager = getSettingsManager();
  const currentAccent = settingsManager.get("catppuccin-accentColor");

  (section as any).addDropDown(
    "catppuccin-accentColor", // settings key (nameId)
    "Accent colour", // user-visible label
    accentOptions, // option list
    Math.max(0, accentOptions.indexOf(currentAccent)), // default index
    undefined, // onSelect (unused – we use onChange)
    {
      onChange: (e: any) => {
        try {
          const idx = e?.currentTarget?.selectedIndex ?? 0;
          const newAccent = accentOptions[idx] ?? "mauve";
          settingsManager.set("catppuccin-accentColor", newAccent as any);

          const grad = settingsManager.get("sn-gradient-intensity");
          const stars = settingsManager.get("sn-star-density");
          applyStarryNightSettings(grad as any, stars as any);

          // Trigger the main Year3000System to re-apply colours so that the
          // accent variables (e.g. --spice-button-active) update instantly.
          try {
            (globalThis as any).Y3K?.system?.applyInitialSettings?.();
          } catch (applyErr) {
            console.warn(
              "[StarryNight] Unable to trigger Year3000System colour refresh",
              applyErr
            );
          }
        } catch (err) {
          console.error("[StarryNight] Failed to update accent colour", err);
        }
      },
    }
  );

  // --- Gradient intensity drop-down ---------------------------------------
  const intensityOptions = [
    "disabled",
    "minimal",
    "balanced",
    "intense",
  ] as const;

  const currentGradient = settingsManager.get("sn-gradient-intensity");

  (section as any).addDropDown(
    "sn-gradient-intensity",
    "Gradient intensity",
    intensityOptions as unknown as string[],
    Math.max(0, intensityOptions.indexOf(currentGradient as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newGrad = intensityOptions[idx] ?? "balanced";
        settingsManager.set("sn-gradient-intensity", newGrad as any);

        const stars = settingsManager.get("sn-star-density");
        applyStarryNightSettings(newGrad as any, stars as any);
      },
    }
  );

  // --- Star density drop-down ---------------------------------------------
  const currentStars = settingsManager.get("sn-star-density");

  (section as any).addDropDown(
    "sn-star-density",
    "Star density",
    intensityOptions as unknown as string[],
    Math.max(0, intensityOptions.indexOf(currentStars as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const newStars = intensityOptions[idx] ?? "balanced";
        settingsManager.set("sn-star-density", newStars as any);

        const grad = settingsManager.get("sn-gradient-intensity");
        applyStarryNightSettings(grad as any, newStars as any);
      },
    }
  );

  // ---------------- Additional settings ------------------------------

  // Catppuccin flavour
  const flavourOptions = ["latte", "frappe", "macchiato", "mocha"] as const;
  const currentFlavor = settingsManager.get("catppuccin-flavor");
  (section as any).addDropDown(
    "catppuccin-flavor",
    "Catppuccin flavour",
    flavourOptions as unknown as string[],
    Math.max(0, flavourOptions.indexOf(currentFlavor as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settingsManager.set("catppuccin-flavor", flavourOptions[idx] as any);
        (globalThis as any).Y3K?.system?.applyInitialSettings?.();
      },
    }
  );

  // Glassmorphism level
  const glassOptions = ["disabled", "minimal", "moderate", "intense"] as const;
  const currentGlass = settingsManager.get("sn-glassmorphism-level");
  (section as any).addDropDown(
    "sn-glassmorphism-level",
    "Glassmorphism",
    glassOptions as unknown as string[],
    Math.max(0, glassOptions.indexOf(currentGlass as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settingsManager.set("sn-glassmorphism-level", glassOptions[idx] as any);
      },
    }
  );

  // 3D effects level
  const fx3dOptions = ["full", "minimal", "disabled"] as const;
  const current3d = settingsManager.get("sn-3d-effects-level");
  (section as any).addDropDown(
    "sn-3d-effects-level",
    "3D card effects",
    fx3dOptions as unknown as string[],
    Math.max(0, fx3dOptions.indexOf(current3d as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        settingsManager.set("sn-3d-effects-level", fx3dOptions[idx] as any);
      },
    }
  );

  // Artistic mode
  const artisticOptions = [
    "corporate-safe",
    "artist-vision",
    "cosmic-maximum",
  ] as const;
  const currentArtistic = settingsManager.get("sn-artistic-mode");
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
        settingsManager.set("sn-artistic-mode", mode as any);
        // Forward the change to the live Year3000System instance so that all
        // subsystems (including ColorHarmonyEngine) receive the update via the
        // shared configuration object.
        (
          globalThis as any
        ).year3000System?.YEAR3000_CONFIG?.safeSetArtisticMode?.(mode);
      },
    }
  );

  // Harmonic mode
  const harmonicModes = Object.keys(HARMONIC_MODES) as string[];
  const currentHarmMode = settingsManager.get("sn-current-harmonic-mode");
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
          settingsManager.set("sn-current-harmonic-mode", modeKey as any);
          (globalThis as any).Y3K?.system?.evolveHarmonicSignature?.(modeKey);
        },
      }
    );
  }

  // Harmonic intensity (number input 0-1 step 0.05)
  const currentHarmInt = settingsManager.get("sn-harmonic-intensity") || "0.7";
  (section as any).addInput(
    "sn-harmonic-intensity",
    "Harmonic intensity (0-1)",
    currentHarmInt,
    "number",
    {
      onChange: (e: any) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        settingsManager.set("sn-harmonic-intensity", val as any);
      },
    }
  );

  // Harmonic evolution toggle
  const currentEvolution =
    settingsManager.get("sn-harmonic-evolution") === "true";
  (section as any).addToggle(
    "sn-harmonic-evolution",
    "Allow harmonic evolution",
    currentEvolution,
    {
      onClick: (e: any) => {
        const checked = (e.currentTarget as HTMLInputElement).checked;
        settingsManager.set(
          "sn-harmonic-evolution",
          (checked ? "true" : "false") as any
        );
      },
    }
  );

  // Manual base color input
  const currentManual =
    settingsManager.get("sn-harmonic-manual-base-color") || "#ffffff";
  (section as any).addInput(
    "sn-harmonic-manual-base-color",
    "Manual base colour",
    currentManual,
    "color",
    {
      onChange: (e: any) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        settingsManager.set("sn-harmonic-manual-base-color", val as any);
        (globalThis as any).Y3K?.system?.updateHarmonicBaseColor?.(val);
      },
    }
  );

  // WebGPU toggle
  const enableGpu = settingsManager.get("sn-enable-webgpu") === "true";
  (section as any).addToggle(
    "sn-enable-webgpu",
    "Enable WebGPU acceleration (experimental)",
    enableGpu,
    {
      onClick: (e: any) => {
        const checked = (e.currentTarget as HTMLInputElement).checked;
        settingsManager.set(
          "sn-enable-webgpu",
          (checked ? "true" : "false") as any
        );
        console.info("[StarryNight] WebGPU setting changed – reload required");
      },
    }
  );

  // Aberration toggle
  const enableAb = settingsManager.get("sn-enable-aberration") === "true";
  (section as any).addToggle(
    "sn-enable-aberration",
    "Chromatic aberration effect",
    enableAb,
    {
      onClick: (e: any) => {
        const checked = (e.currentTarget as HTMLInputElement).checked;
        settingsManager.set(
          "sn-enable-aberration",
          (checked ? "true" : "false") as any
        );
        // Notify AberrationManager via custom event already dispatched by SettingsManager.
      },
    }
  );

  // Temporal Echo Intensity (Phase 4)
  // TODO[PHASE4-UI]: Surfaced new echo intensity setting (0-3) so users can tweak visual loudness.
  const echoOptions = ["Off", "Subtle", "Balanced", "Intense"] as const;
  const currentEcho = settingsManager.get("sn-echo-intensity") ?? "2";
  (section as any).addDropDown(
    "sn-echo-intensity",
    "Temporal Echo Intensity",
    echoOptions as unknown as string[],
    Math.min(3, parseInt(currentEcho as string, 10)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 2;
        settingsManager.set("sn-echo-intensity", `${idx}` as any);
      },
    }
  );

  // === Phase 5 Controls ===============================================
  // Visual intensity (0-1 slider)
  const currentVisualInt = settingsManager.get("sn-visual-intensity") || "0.8";
  (section as any).addInput(
    "sn-visual-intensity",
    "Visual intensity (0-1)",
    currentVisualInt,
    "number",
    {
      attributes: { min: 0, max: 1, step: 0.05 },
      onChange: (e: any) => {
        const val = (e.currentTarget as HTMLInputElement).value;
        let num = parseFloat(val);
        if (isNaN(num)) num = 0.8;
        num = Math.max(0, Math.min(1, num));
        settingsManager.set("sn-visual-intensity", num.toFixed(2) as any);
      },
    }
  );

  // Animation quality drop-down
  const animQualityOptions = ["auto", "low", "high"] as const;
  const currentAnimQ = settingsManager.get("sn-animation-quality") || "auto";
  (section as any).addDropDown(
    "sn-animation-quality",
    "Animation quality",
    animQualityOptions as unknown as string[],
    Math.max(0, animQualityOptions.indexOf(currentAnimQ as any)),
    undefined,
    {
      onChange: (e: any) => {
        const idx = e?.currentTarget?.selectedIndex ?? 0;
        const val = animQualityOptions[idx] ?? "auto";
        settingsManager.set("sn-animation-quality", val as any);
      },
    }
  );

  // Push the section into the DOM.
  await (section as any).pushSettings();
  console.log("✨ [StarryNight] spcr-settings panel initialised");

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
