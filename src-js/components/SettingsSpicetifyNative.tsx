import { applyStarryNightSettings } from "@/effects/starryNightEffects";

// Use Spicetify's native React instead of external dependency
const React = Spicetify.React;
const ReactDOM = Spicetify.ReactDOM;

// Catppuccin accent colors (15 total)
const accentColors = [
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
  "text",
];

const intensityOptions = ["disabled", "minimal", "balanced", "intense"];

export function initializeSpicetifyNativeSettings() {
  try {
    // Migrate existing settings first
    migrateExistingSettings();

    // Create settings panel using Spicetify's native components
    createSettingsPanel();

    console.log("✨ [StarryNight] Spicetify native settings initialized");
  } catch (error) {
    console.error(
      "❌ [StarryNight] Error initializing native settings:",
      error
    );
  }
}

function createSettingsPanel() {
  // Find Spotify's settings container
  const settingsContainer = document.querySelector(
    ".main-view-container__scroll-node-child"
  );
  if (!settingsContainer) {
    console.warn("Settings container not found, retrying...");
    setTimeout(createSettingsPanel, 1000);
    return;
  }

  // Create our settings section
  const settingsSection = document.createElement("div");
  settingsSection.className = "main-settingsPage-section";
  settingsSection.innerHTML = `
    <h2 class="TypeElement-cello-textBase-type">Catppuccin StarryNight</h2>
    <div id="starrynight-settings-content"></div>
  `;

  // Insert into settings page (when user opens settings)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.querySelector?.(".main-settingsPage-section")) {
            const settingsPage = element.querySelector(
              ".main-settingsPage-section"
            )?.parentElement;
            if (
              settingsPage &&
              !settingsPage.querySelector("#starrynight-settings-content")
            ) {
              settingsPage.appendChild(settingsSection);
              renderSettingsContent();
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function renderSettingsContent() {
  const container = document.getElementById("starrynight-settings-content");
  if (!container) return;

  // Get current settings
  const year3000System = (globalThis as any).year3000System;
  const settingsManager = year3000System?.settingsManager;

  const currentAccent =
    settingsManager?.get("catppuccin-accentColor") || "blue";
  const currentGradient =
    settingsManager?.get("sn-gradient-intensity") || "balanced";
  const currentStars = settingsManager?.get("sn-star-density") || "balanced";
  const currentGlass =
    settingsManager?.get("sn-glassmorphism-level") || "moderate";

  // Create React component using Spicetify's components
  const SettingsComponent = () => {
    const [accentColor, setAccentColor] = React.useState(currentAccent);
    const [gradientIntensity, setGradientIntensity] =
      React.useState(currentGradient);
    const [starDensity, setStarDensity] = React.useState(currentStars);
    const [glassLevel, setGlassLevel] = React.useState(
      currentGlass === "moderate" ? "balanced" : currentGlass
    );

    const handleAccentChange = (newAccent: string) => {
      setAccentColor(newAccent);
      applyAccentColor(newAccent);
      if (settingsManager) {
        settingsManager.set("catppuccin-accentColor", newAccent);
      }
    };

    const handleGradientChange = (newIntensity: string) => {
      setGradientIntensity(newIntensity);
      applyGradientSettings(newIntensity, starDensity);
      if (settingsManager) {
        settingsManager.set("sn-gradient-intensity", newIntensity);
      }
    };

    const handleStarChange = (newDensity: string) => {
      setStarDensity(newDensity);
      applyStarSettings(newDensity, gradientIntensity);
      if (settingsManager) {
        settingsManager.set("sn-star-density", newDensity);
      }
    };

    const handleGlassChange = (newLevel: string) => {
      setGlassLevel(newLevel);
      applyGlassSettings(newLevel);
      if (settingsManager) {
        const mappedValue = newLevel === "balanced" ? "moderate" : newLevel;
        settingsManager.set("sn-glassmorphism-level", mappedValue);
      }
    };

    return React.createElement("div", { className: "starrynight-settings" }, [
      // Accent Color Dropdown
      React.createElement("div", { key: "accent", className: "setting-row" }, [
        React.createElement(
          "label",
          { key: "accent-label", className: "setting-label" },
          "Accent Color"
        ),
        React.createElement(
          "select",
          {
            key: "accent-select",
            className: "main-dropDown-dropDown",
            value: accentColor,
            onChange: (e: any) => handleAccentChange(e.target.value),
          },
          accentColors.map((color) =>
            React.createElement(
              "option",
              { key: color, value: color },
              color.charAt(0).toUpperCase() + color.slice(1)
            )
          )
        ),
      ]),

      // Gradient Intensity Dropdown
      React.createElement(
        "div",
        { key: "gradient", className: "setting-row" },
        [
          React.createElement(
            "label",
            { key: "gradient-label", className: "setting-label" },
            "Dynamic Gradient"
          ),
          React.createElement(
            "select",
            {
              key: "gradient-select",
              className: "main-dropDown-dropDown",
              value: gradientIntensity,
              onChange: (e: any) => handleGradientChange(e.target.value),
            },
            intensityOptions.map((option) =>
              React.createElement(
                "option",
                { key: option, value: option },
                option.charAt(0).toUpperCase() + option.slice(1)
              )
            )
          ),
        ]
      ),

      // Star Animation Dropdown
      React.createElement("div", { key: "stars", className: "setting-row" }, [
        React.createElement(
          "label",
          { key: "stars-label", className: "setting-label" },
          "Star Animation"
        ),
        React.createElement(
          "select",
          {
            key: "stars-select",
            className: "main-dropDown-dropDown",
            value: starDensity,
            onChange: (e: any) => handleStarChange(e.target.value),
          },
          intensityOptions.map((option) =>
            React.createElement(
              "option",
              { key: option, value: option },
              option.charAt(0).toUpperCase() + option.slice(1)
            )
          )
        ),
      ]),

      // Glass Effects Dropdown
      React.createElement("div", { key: "glass", className: "setting-row" }, [
        React.createElement(
          "label",
          { key: "glass-label", className: "setting-label" },
          "Glass Effects"
        ),
        React.createElement(
          "select",
          {
            key: "glass-select",
            className: "main-dropDown-dropDown",
            value: glassLevel,
            onChange: (e: any) => handleGlassChange(e.target.value),
          },
          intensityOptions.map((option) =>
            React.createElement(
              "option",
              { key: option, value: option },
              option.charAt(0).toUpperCase() + option.slice(1)
            )
          )
        ),
      ]),
    ]);
  };

  // Render using Spicetify's ReactDOM
  ReactDOM.render(React.createElement(SettingsComponent), container);
}

function migrateExistingSettings() {
  // Same migration logic as before
  try {
    const year3000System = (globalThis as any).year3000System;
    const settingsManager = year3000System?.settingsManager;

    if (settingsManager) {
      console.log("✨ [StarryNight] Settings migrated from Year3000System");
    }
  } catch (error) {
    console.warn("⚠️ [StarryNight] Settings migration failed:", error);
  }
}

function applyAccentColor(accent: string) {
  try {
    const colorScheme =
      (globalThis as any).Spicetify?.Config?.color_scheme || "mocha";
    const actualAccent = accent === "none" ? "text" : accent;

    document.documentElement.style.setProperty(
      "--spice-text",
      `var(--spice-${accent})`
    );
    document.documentElement.style.setProperty(
      "--spice-button-active",
      `var(--spice-${accent})`
    );
    document.documentElement.style.setProperty(
      "--spice-equalizer",
      `url('${colorScheme}/equalizer-animated-${actualAccent}.gif')`
    );

    console.log(`✨ [StarryNight] Accent color applied: ${accent}`);
  } catch (error) {
    console.error("❌ [StarryNight] Error applying accent color:", error);
  }
}

function applyGradientSettings(
  intensity: string,
  starDensity: string = "balanced"
) {
  try {
    applyStarryNightSettings(intensity as any, starDensity as any);
    console.log(`✨ [StarryNight] Gradient settings applied: ${intensity}`);
  } catch (error) {
    console.error("❌ [StarryNight] Error applying gradient settings:", error);
  }
}

function applyStarSettings(
  starDensity: string,
  gradientIntensity: string = "balanced"
) {
  try {
    applyStarryNightSettings(gradientIntensity as any, starDensity as any);
    console.log(`✨ [StarryNight] Star settings applied: ${starDensity}`);
  } catch (error) {
    console.error("❌ [StarryNight] Error applying star settings:", error);
  }
}

function applyGlassSettings(glassLevel: string) {
  try {
    const year3000System = (globalThis as any).year3000System;
    if (year3000System?.glassmorphismManager) {
      const mappedLevel = glassLevel === "balanced" ? "moderate" : glassLevel;
      year3000System.glassmorphismManager.applyGlassmorphismSettings(
        mappedLevel
      );
    }

    console.log(`✨ [StarryNight] Glass effects applied: ${glassLevel}`);
  } catch (error) {
    console.error("❌ [StarryNight] Error applying glass settings:", error);
  }
}
