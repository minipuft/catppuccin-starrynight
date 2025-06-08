import {
  ARTISTIC_MODE_PROFILES,
  HARMONIC_MODES,
  YEAR3000_CONFIG,
} from "../config/globalConfig.js";
import {
  applyStarryNightSettings,
  startShootingStars,
} from "../effects/starryNightEffects.js";

// Note: Spicetify.React, Spicetify.ReactDOM, Spicetify.Config, Spicetify.Platform, Spicetify.Menu, Spicetify.showNotification
// are expected to be globally available Spicetify APIs.

const RawSectionComponent = () => {
  // Access crucial instances from globalThis.year3000System
  const settingsManager = globalThis.year3000System?.settingsManager;
  const glassmorphismManager = globalThis.year3000System?.glassmorphismManager;
  const card3DManager = globalThis.year3000System?.card3DManager;
  const year3000System = globalThis.year3000System;

  // Conditional rendering based on manager availability
  if (
    !settingsManager ||
    !glassmorphismManager ||
    !card3DManager ||
    !year3000System ||
    !YEAR3000_CONFIG ||
    !HARMONIC_MODES
  ) {
    if (YEAR3000_CONFIG?.enableDebug || !settingsManager) {
      // Log if debug mode or critical manager is missing
      console.warn(
        "[StarryNight Section] Essential managers/configs not yet available on globalThis.year3000System. UI will be minimal or delayed."
      );
    }
    return Spicetify.React.createElement("div", null, "Loading settings..."); // Placeholder UI
  }

  // Define option arrays for the settings UI, derived from settingsManager.validationSchemas
  // These are now DEFINED *AFTER* the guard clause to ensure settingsManager is available.
  const accents =
    settingsManager.validationSchemas?.["catppuccin-accentColor"]
      ?.allowedValues || [];

  const gradientIntensityOptions =
    settingsManager.validationSchemas?.[
      "sn-gradientIntensity"
    ]?.allowedValues.map((val) => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1),
    })) || [];

  const starDensityOptions =
    settingsManager.validationSchemas?.["sn-starDensity"]?.allowedValues.map(
      (val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1),
      })
    ) || [];

  const performanceOptions =
    settingsManager.validationSchemas?.[
      "sn-performanceQuality"
    ]?.allowedValues.map((val) => ({
      value: val,
      label:
        val === "auto"
          ? "Auto-Adjust"
          : val === "optimized"
          ? "Optimized Quality"
          : "High Fidelity",
    })) || [];

  const glassmorphismOptions =
    settingsManager.validationSchemas?.[
      "sn-glassmorphismIntensity"
    ]?.allowedValues.map((val) => ({
      value: val,
      label: val.charAt(0).toUpperCase() + val.slice(1),
    })) || [];

  const artisticModeOptions =
    settingsManager.validationSchemas?.["sn-artisticMode"]?.allowedValues.map(
      (val) => ({
        value: val,
        label:
          ARTISTIC_MODE_PROFILES[val]?.displayName ||
          val
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        profile: ARTISTIC_MODE_PROFILES[val],
      })
    ) || [];

  const morphing3DOptions =
    settingsManager.validationSchemas?.["sn-3dMorphingMode"]?.allowedValues.map(
      (val) => ({
        value: val,
        label: val.charAt(0).toUpperCase() + val.slice(1),
      })
    ) || [];

  const colorScheme = Spicetify.Config.color_scheme || "mocha";

  // Catppuccin settings with validation
  const initialAccent =
    settingsManager.get("catppuccin-accentColor") || accents[0];
  const [selectedAccent, setSelectedAccent] =
    Spicetify.React.useState(initialAccent);

  // StarryNight settings with validation
  const initialGradient =
    settingsManager.get("sn-gradientIntensity") ||
    gradientIntensityOptions[0]?.value;
  const initialStars =
    settingsManager.get("sn-starDensity") || starDensityOptions[0]?.value;
  const initialPerformance =
    settingsManager.get("sn-performanceQuality") ||
    performanceOptions[0]?.value;
  const [gradientIntensity, setGradientIntensity] =
    Spicetify.React.useState(initialGradient);
  const [starDensity, setStarDensity] = Spicetify.React.useState(initialStars);
  const [performanceQuality, setPerformanceQuality] =
    Spicetify.React.useState(initialPerformance);

  // PHASE 1: Glassmorphism settings with validation
  const initialGlass =
    settingsManager.get("sn-glassmorphismIntensity") ||
    glassmorphismOptions[0]?.value;
  const [glassmorphismIntensity, setGlassmorphismIntensity] =
    Spicetify.React.useState(initialGlass);

  // PHASE 3: 3D morphing settings with validation
  const initial3DMode =
    settingsManager.get("sn-3dMorphingMode") || morphing3DOptions[0]?.value;
  const [morphing3DMode, setMorphing3DMode] =
    Spicetify.React.useState(initial3DMode);

  // ADDED: State for Artistic Mode
  const initialArtisticMode =
    settingsManager.get(
      "sn-artisticMode",
      YEAR3000_CONFIG?.artisticMode || "artist-vision"
    ) || artisticModeOptions[0]?.value;
  const [artisticMode, setArtisticModeState] =
    Spicetify.React.useState(initialArtisticMode);

  // NEW: Harmonic System States
  const initialHarmonicModeKey = Object.keys(HARMONIC_MODES)[0]; // Default to the first key if not found
  const initialHarmonicMode =
    settingsManager.get("sn-currentHarmonicMode") || initialHarmonicModeKey;
  const [currentHarmonicMode, setCurrentHarmonicMode] =
    Spicetify.React.useState(initialHarmonicMode);

  const initialHarmonicIntensity = parseFloat(
    settingsManager.get("sn-harmonicIntensity") || "0.5"
  );
  const [harmonicIntensity, setHarmonicIntensity] = Spicetify.React.useState(
    initialHarmonicIntensity
  );

  const initialHarmonicEvolution =
    (settingsManager.get("sn-harmonicEvolution") || "true") === "true";
  const [harmonicEvolution, setHarmonicEvolution] = Spicetify.React.useState(
    initialHarmonicEvolution
  );

  // NEW: Manual Harmonic Base Color State
  const initialManualBaseColor =
    settingsManager.get("sn-harmonicManualBaseColor") || "";
  const [manualBaseColor, setManualBaseColor] = Spicetify.React.useState(
    initialManualBaseColor
  );

  // Apply Catppuccin accent colors with validation
  Spicetify.React.useEffect(() => {
    if (!settingsManager) return;
    try {
      const accent = selectedAccent === "none" ? "text" : selectedAccent;
      const properties = {
        "--spice-text": `var(--spice-${selectedAccent})`,
        "--spice-button-active": `var(--spice-${selectedAccent})`,
        "--spice-equalizer": document.querySelector(
          "body > script.marketplaceScript"
        )
          ? `url('https://github.com/catppuccin/spicetify/blob/main/catppuccin/assets/${colorScheme}/equalizer-animated-${accent}.gif?raw=true')`
          : `url('${colorScheme}/equalizer-animated-${accent}.gif')`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        if (value.includes("none")) {
          document.documentElement.style.removeProperty(property);
        } else {
          document.documentElement.style.setProperty(property, value);
        }
      });

      settingsManager.set("catppuccin-accentColor", selectedAccent);
    } catch (error) {
      console.error("StarryNight: Error applying accent color:", error);
    }
  }, [selectedAccent, colorScheme, settingsManager]);

  // Apply StarryNight settings with validation
  Spicetify.React.useEffect(() => {
    if (!settingsManager) return;
    try {
      applyStarryNightSettings(gradientIntensity, starDensity);
      settingsManager.set("sn-gradientIntensity", gradientIntensity);
      settingsManager.set("sn-starDensity", starDensity);
    } catch (error) {
      console.error("StarryNight: Error applying StarryNight settings:", error);
    }
  }, [gradientIntensity, starDensity, settingsManager]);

  // Apply performance quality settings with validation
  Spicetify.React.useEffect(() => {
    if (!settingsManager) return;
    try {
      settingsManager.set("sn-performanceQuality", performanceQuality);
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          `StarryNight: Performance quality set to ${performanceQuality}. (Note: old colorAnalyzer throttle logic removed)`
        );
      }
    } catch (error) {
      console.error("StarryNight: Error applying performance settings:", error);
    }
  }, [performanceQuality, settingsManager, YEAR3000_CONFIG]); // Added YEAR3000_CONFIG to dependency array

  // ADDED: useEffect for Artistic Mode - Enhanced with Year 3000 system
  Spicetify.React.useEffect(() => {
    if (!settingsManager || !YEAR3000_CONFIG || !year3000System) return;
    try {
      // Use the new unified switchArtisticMode method
      if (year3000System.switchArtisticMode) {
        year3000System.switchArtisticMode(artisticMode);
      } else {
        // Fallback to old method if new method not available
        if (typeof YEAR3000_CONFIG.setArtisticMode === "function") {
          YEAR3000_CONFIG.setArtisticMode(artisticMode);
        }
        settingsManager.set("sn-artisticMode", artisticMode);
        if (year3000System.setGradientParameters) {
          year3000System.setGradientParameters(document.documentElement);
        }
      }

      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          `🎨 [SettingsSection] Artistic mode changed to: ${artisticMode}`
        );
      }
    } catch (error) {
      console.error(
        "❌ [SettingsSection] Error applying artistic mode:",
        error
      );
    }
  }, [artisticMode, settingsManager, YEAR3000_CONFIG, year3000System]);

  // NEW: useEffect for Harmonic System Settings
  Spicetify.React.useEffect(() => {
    if (!settingsManager || !YEAR3000_CONFIG) return;
    try {
      settingsManager.set("sn-currentHarmonicMode", currentHarmonicMode);
      settingsManager.set("sn-harmonicIntensity", harmonicIntensity.toString());
      settingsManager.set("sn-harmonicEvolution", harmonicEvolution.toString());

      // Use Year3000System's safe configuration update method instead of direct mutation
      if (
        globalThis.year3000System &&
        typeof globalThis.year3000System.updateConfiguration === "function"
      ) {
        globalThis.year3000System.updateConfiguration(
          "currentHarmonicMode",
          currentHarmonicMode
        );
        globalThis.year3000System.updateConfiguration(
          "harmonicIntensity",
          harmonicIntensity
        );
        globalThis.year3000System.updateConfiguration(
          "harmonicEvolution",
          harmonicEvolution
        );
      } else {
        // Fallback for backward compatibility (but this indicates a system issue)
        console.warn(
          "[SettingsSection] Year3000System not available for safe configuration updates"
        );
        YEAR3000_CONFIG.currentHarmonicMode = currentHarmonicMode;
        YEAR3000_CONFIG.harmonicIntensity = harmonicIntensity;
        YEAR3000_CONFIG.harmonicEvolution = harmonicEvolution;
      }

      if (year3000System && year3000System.updateColorsFromCurrentTrack) {
        year3000System.updateColorsFromCurrentTrack();
      }

      if (
        year3000System &&
        year3000System.sidebarConsciousnessSystem &&
        year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay
      ) {
        year3000System.sidebarConsciousnessSystem.updateHarmonicModeDisplay(
          currentHarmonicMode
        );
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            `[StarryNight Section UI] SidebarConsciousnessSystem updated with mode: ${currentHarmonicMode}`
          );
        }
      }
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          `StarryNight: Harmonic settings updated - Mode: ${currentHarmonicMode}, Intensity: ${harmonicIntensity}, Evolution: ${harmonicEvolution}`
        );
      }
    } catch (error) {
      console.error(
        "StarryNight: Error applying Harmonic System settings from UI:",
        error
      );
    }
  }, [
    currentHarmonicMode,
    harmonicIntensity,
    harmonicEvolution,
    settingsManager,
    YEAR3000_CONFIG,
    year3000System,
  ]);

  // NEW: useEffect for Manual Harmonic Base Color
  Spicetify.React.useEffect(() => {
    if (!settingsManager || !YEAR3000_CONFIG) return;
    try {
      const hexRegex = /^(#?([0-9a-fA-F]{3}){1,2})$/i;
      let validatedColor = manualBaseColor.trim();
      let isValid = false;

      if (validatedColor === "") {
        isValid = true;
      } else if (hexRegex.test(validatedColor)) {
        isValid = true;
        if (!validatedColor.startsWith("#")) {
          validatedColor = "#" + validatedColor;
        }
        if (validatedColor.length === 4) {
          validatedColor = `#${validatedColor[1]}${validatedColor[1]}${validatedColor[2]}${validatedColor[2]}${validatedColor[3]}${validatedColor[3]}`;
        }
      }

      if (isValid) {
        settingsManager.set("sn-harmonicManualBaseColor", validatedColor);
        if (year3000System && year3000System.updateHarmonicBaseColor) {
          year3000System.updateHarmonicBaseColor(validatedColor);
        }
        if (YEAR3000_CONFIG.enableDebug || manualBaseColor !== validatedColor) {
          console.log(
            `StarryNight: Manual Harmonic Base Color processing. Input: "${manualBaseColor}", Applied: "${validatedColor}"`
          );
        }
      } else {
        if (YEAR3000_CONFIG.enableDebug) {
          console.warn(
            `StarryNight: Invalid manual base color input: "${manualBaseColor}". Not applied. Previous valid setting remains.`
          );
        }
      }
    } catch (error) {
      console.error(
        "StarryNight: Error applying Manual Harmonic Base Color from UI:",
        error
      );
    }
  }, [manualBaseColor, settingsManager, YEAR3000_CONFIG, year3000System]);

  // PHASE 1: Apply glassmorphism settings with validation
  Spicetify.React.useEffect(() => {
    if (
      !settingsManager ||
      !glassmorphismManager ||
      !card3DManager ||
      !YEAR3000_CONFIG
    )
      return;
    try {
      glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);
      settingsManager.set("sn-glassmorphismIntensity", glassmorphismIntensity);

      card3DManager.initialize();
      card3DManager.apply3DMode(morphing3DMode);
      glassmorphismManager.checkPerformanceAndAdjust();

      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          `StarryNight: Glassmorphism intensity set to ${glassmorphismIntensity}`
        );
      }
    } catch (error) {
      console.error(
        "StarryNight: Error applying glassmorphism settings:",
        error
      );
    }
  }, [
    glassmorphismIntensity,
    morphing3DMode,
    settingsManager,
    glassmorphismManager,
    card3DManager,
    YEAR3000_CONFIG,
  ]);

  // PHASE 3: Apply 3D morphing settings with validation
  Spicetify.React.useEffect(() => {
    if (!settingsManager || !card3DManager || !YEAR3000_CONFIG) return;
    try {
      card3DManager.apply3DMode(morphing3DMode);
      settingsManager.set("sn-3dMorphingMode", morphing3DMode);
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(`StarryNight: 3D morphing mode set to ${morphing3DMode}`);
      }
    } catch (error) {
      console.error("StarryNight: Error applying 3D morphing settings:", error);
    }
  }, [morphing3DMode, settingsManager, card3DManager, YEAR3000_CONFIG]);

  // Initialize StarryNight effects on component mount with proper cleanup and validation
  Spicetify.React.useEffect(() => {
    if (!settingsManager || !glassmorphismManager || !YEAR3000_CONFIG) return;
    let shootingStarsIntervalId = null;

    try {
      applyStarryNightSettings(gradientIntensity, starDensity);
      glassmorphismManager.applyGlassmorphismSettings(glassmorphismIntensity);

      if (settingsManager.get("sn-starDensity") !== "disabled") {
        setTimeout(() => {
          shootingStarsIntervalId = startShootingStars();
        }, 2000);
      }
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "StarryNight: Section component effects initialized (color extraction delegated to global Year 3000 system)"
        );
      }
    } catch (error) {
      console.error(
        "StarryNight: Error during Section component initialization:",
        error
      );
    }

    return () => {
      try {
        if (shootingStarsIntervalId) {
          clearInterval(shootingStarsIntervalId);
        }
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log("StarryNight: Section component cleanup completed");
        }
      } catch (error) {
        console.warn(
          "StarryNight: Error during Section component cleanup:",
          error
        );
      }
    };
  }, [
    gradientIntensity,
    starDensity,
    glassmorphismIntensity,
    settingsManager,
    glassmorphismManager,
    YEAR3000_CONFIG,
  ]);

  // Placeholder for component logic
  if (YEAR3000_CONFIG?.enableDebug) {
    console.log(
      "[StarryNight SettingsSection] Component rendering (placeholder)"
    );
  }
  return Spicetify.React.createElement(
    "div",
    { className: "x-settings-section" },
    [
      Spicetify.React.createElement(
        "h2",
        {
          "data-encore-id": "type",
          className:
            "TextElement-bodyMediumBold-textBase-text encore-text-body-medium-bold",
        },
        "Catppuccin StarryNight"
      ),

      // Accent Color Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Accent Color"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: selectedAccent,
                  onChange: (event) => setSelectedAccent(event.target.value),
                },
                accents.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option, value: option },
                    option
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // Gradient Intensity Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Dynamic Gradient"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: gradientIntensity,
                  onChange: (event) => setGradientIntensity(event.target.value),
                },
                gradientIntensityOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // Star Density Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Star Animation"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: starDensity,
                  onChange: (event) => setStarDensity(event.target.value),
                },
                starDensityOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // Performance Quality Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Performance Quality"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: performanceQuality,
                  onChange: (event) =>
                    setPerformanceQuality(event.target.value),
                },
                performanceOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // PHASE 1: Glassmorphism Intensity Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Glass Effects"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: glassmorphismIntensity,
                  onChange: (event) =>
                    setGlassmorphismIntensity(event.target.value),
                },
                glassmorphismOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // ADDED: Artistic Mode Setting (before 3D Morphing Mode) - Enhanced with Year 3000 descriptions
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Artistic Mode"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: artisticMode,
                  onChange: (event) => setArtisticModeState(event.target.value),
                },
                artisticModeOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // NEW: Artistic Mode Description - Year 3000 Philosophy Display
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          {
            className: "x-settings-description",
            style: {
              padding: "8px 12px",
              marginTop: "-8px",
              marginBottom: "8px",
              backgroundColor:
                "rgba(var(--spice-rgb-accent, 202,158,230), 0.06)",
              borderRadius: "6px",
              borderLeft: "3px solid var(--spice-accent, #ca9ee6)",
              fontSize: "0.8em",
              lineHeight: "1.4",
              gridColumn: "1 / -1",
            },
          },
          [
            // Current mode description
            Spicetify.React.createElement(
              "div",
              {
                style: {
                  fontWeight: "500",
                  color: "var(--spice-text)",
                  marginBottom: "4px",
                },
              },
              ARTISTIC_MODE_PROFILES[artisticMode]?.description ||
                "Standard artistic expression mode"
            ),
            // Current mode philosophy
            Spicetify.React.createElement(
              "div",
              {
                style: {
                  fontStyle: "italic",
                  color: "var(--spice-subtext)",
                  fontSize: "0.9em",
                },
              },
              ARTISTIC_MODE_PROFILES[artisticMode]?.philosophy ||
                "Enhances your listening experience with visual harmony."
            ),
          ]
        ),
      ]),

      // PHASE 3: 3D morphing mode setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "3D Morphing Mode"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: morphing3DMode,
                  onChange: (event) => setMorphing3DMode(event.target.value),
                },
                morphing3DOptions.map((option) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: option.value, value: option.value },
                    option.label
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // NEW: Chromatic Harmony Weaver Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
              },
              "Chromatic Harmony Mode"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("span", null, [
              Spicetify.React.createElement(
                "select",
                {
                  className: "main-dropDown-dropDown",
                  value: currentHarmonicMode,
                  onChange: (event) =>
                    setCurrentHarmonicMode(event.target.value),
                },
                Object.keys(HARMONIC_MODES).map((modeKey) =>
                  Spicetify.React.createElement(
                    "option",
                    { key: modeKey, value: modeKey },
                    HARMONIC_MODES[modeKey].description
                  )
                )
              ),
            ]),
          ]
        ),
      ]),

      // NEW: Harmonic Intensity Setting
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
                htmlFor: "sn-harmonic-intensity-slider",
              },
              `Harmonic Intensity: ${harmonicIntensity.toFixed(2)}`
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("input", {
              type: "range",
              id: "sn-harmonic-intensity-slider",
              className: "x-settings-slider sn-slider",
              min: "0",
              max: "1",
              step: "0.05",
              value: harmonicIntensity,
              onChange: (event) =>
                setHarmonicIntensity(parseFloat(event.target.value)),
            }),
          ]
        ),
      ]),

      // NEW: Harmonic Evolution Toggle
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
                htmlFor: "sn-harmonic-evolution-toggle",
              },
              "Evolve Harmonies with Music"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("input", {
              type: "checkbox",
              id: "sn-harmonic-evolution-toggle",
              className: "x-settings-checkbox sn-toggle",
              checked: harmonicEvolution,
              onChange: (event) => setHarmonicEvolution(event.target.checked),
            }),
          ]
        ),
      ]),

      // NEW: Manual Harmonic Base Color Input
      Spicetify.React.createElement("div", { className: "x-settings-row" }, [
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-firstColumn" },
          [
            Spicetify.React.createElement(
              "label",
              {
                className:
                  "TextElement-bodySmall-textSubdued-text encore-text-body-small",
                "data-encore-id": "type",
                htmlFor: "sn-manual-base-color-input",
              },
              "Harmonic Base Color Seed (Hex, empty for auto)"
            ),
          ]
        ),
        Spicetify.React.createElement(
          "div",
          { className: "x-settings-secondColumn" },
          [
            Spicetify.React.createElement("input", {
              type: "text",
              id: "sn-manual-base-color-input",
              className: "x-settings-input sn-text-input",
              placeholder: "#RRGGBB or RRGGBB",
              value: manualBaseColor,
              onChange: (event) => setManualBaseColor(event.target.value),
            }),
          ]
        ),
      ]),
    ]
  );
};

// Global cleanup tracking
let checkHeaderInterval = null;
let mountedContainer = null;

function cleanupSettings() {
  if (checkHeaderInterval) {
    clearInterval(checkHeaderInterval);
    checkHeaderInterval = null;
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log("[StarryNight Settings] Cleared settings polling interval.");
    }
  }

  if (mountedContainer) {
    try {
      Spicetify.ReactDOM.unmountComponentAtNode(mountedContainer);
      mountedContainer.remove();
      mountedContainer = null;
      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "[StarryNight Settings] Unmounted React component and removed container."
        );
      }
    } catch (error) {
      console.warn("[StarryNight Settings] Error during cleanup:", error);
    }
  }
}

function insertOption(name) {
  // Check if we are on the settings page
  if (name?.pathname !== "/preferences") {
    cleanupSettings();
    return;
  }

  const containerId = "spicetify-starry-night-settings-container";

  // CRITICAL: Check if the container already exists. If so, do nothing.
  // This prevents React from re-rendering over itself on every history change.
  let container = document.getElementById(containerId);
  if (container) {
    if (YEAR3000_CONFIG?.enableDebug) {
      console.log(
        "[StarryNight Settings] Settings container already exists. Aborting re-render."
      );
    }
    return;
  }

  // Clear any existing polling interval before starting a new one
  if (checkHeaderInterval) {
    clearInterval(checkHeaderInterval);
  }

  // Use proven Catppuccin pattern: polling with documented stable selector
  checkHeaderInterval = setInterval(() => {
    const settingsPage = document.querySelector(
      "[data-testid='settings-page'] > div:first-of-type, .x-settings-headerContainer"
    );

    if (settingsPage) {
      clearInterval(checkHeaderInterval);
      checkHeaderInterval = null;

      if (YEAR3000_CONFIG?.enableDebug) {
        console.log(
          "[StarryNight Settings] Settings page found, mounting component."
        );
      }

      // Create and inject our container
      container = document.createElement("div");
      container.id = containerId;
      container.classList.add("starry-night-settings-section");
      mountedContainer = container;

      // Insert after the first settings section (like Catppuccin does)
      settingsPage.parentNode.insertBefore(container, settingsPage.nextSibling);

      // Render the React component into our container
      try {
        Spicetify.ReactDOM.render(
          Spicetify.React.createElement(RawSectionComponent),
          container
        );
        if (YEAR3000_CONFIG?.enableDebug) {
          console.log(
            "[StarryNight Settings] Successfully rendered settings UI."
          );
        }
      } catch (error) {
        console.error(
          "[StarryNight Settings] Failed to render React component:",
          error
        );
        container.textContent = "Error loading StarryNight settings.";
      }
    }
  }, 1); // 1ms polling like Catppuccin
}

export { insertOption, RawSectionComponent };
