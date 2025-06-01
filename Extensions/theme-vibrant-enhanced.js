// === Year 3000 Color Harmony Foundation System ===
// Phase 1: Harmony Engine | Phase 2: Organic Transitions | Phase 3: Contextual Intelligence

// Configuration
const YEAR3000_CONFIG = {
  enableDebug: true,
  enableContextualIntelligence: true,
  enableMusicAnalysis: true,
  musicModulationIntensity: 0.25,
  gentleMultipliers: {
    opacity: 0.08,
    saturation: 1.05,
    brightness: 1.02,
    contrast: 1.01,
  },
};

// Core Color Application System with RGB Support
const year3000System = {
  // Apply colors with proper RGB variable setting
  updateColorsFromCurrentTrack: async () => {
    try {
      const track =
        Spicetify.Player.data?.item || Spicetify.Player.state?.track;
      if (!track?.uri) return;

      const colors = await Spicetify.colorExtractor(track.uri);
      if (colors) {
        year3000System.applyColorsToTheme(colors);
      }
    } catch (error) {
      console.warn("Color extraction failed:", error);
    }
  },

  // Apply colors with proper RGB variable support for gradients
  applyColorsToTheme: (colors) => {
    const root = document.documentElement;

    // Select colors with intelligent fallbacks
    const primaryColor = colors.VIBRANT || colors.PROMINENT || "#ca9ee6";
    const secondaryColor =
      colors.DARK_VIBRANT || colors.DESATURATED || "#babbf1";
    const accentColor =
      colors.VIBRANT_NON_ALARMING || colors.LIGHT_VIBRANT || "#8caaee";

    // CRITICAL FIX: Set both hex AND RGB versions
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);
    const accentRgb = hexToRgb(accentColor);

    // Apply hex versions for gradient colors
    root.style.setProperty("--sn-gradient-primary", primaryColor);
    root.style.setProperty("--sn-gradient-secondary", secondaryColor);
    root.style.setProperty("--sn-gradient-accent", accentColor);

    // Apply RGB versions for gradients (THE MISSING PIECE!)
    if (primaryRgb) {
      root.style.setProperty(
        "--sn-gradient-primary-rgb",
        `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
      );
    }
    if (secondaryRgb) {
      root.style.setProperty(
        "--sn-gradient-secondary-rgb",
        `${secondaryRgb.r},${secondaryRgb.g},${secondaryRgb.b}`
      );
    }
    if (accentRgb) {
      root.style.setProperty(
        "--sn-gradient-accent-rgb",
        `${accentRgb.r},${accentRgb.g},${accentRgb.b}`
      );
    }

    // EXPANSION: Set ALL missing spice RGB variables that SCSS expects
    if (primaryRgb) {
      root.style.setProperty(
        "--spice-rgb-accent",
        `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
      );
      root.style.setProperty(
        "--spice-rgb-button",
        `${primaryRgb.r},${primaryRgb.g},${primaryRgb.b}`
      );
    }

    // Get base colors from current theme (read from CSS variables)
    const currentMain = getComputedStyle(root)
      .getPropertyValue("--spice-main")
      .trim();
    const currentPlayer = getComputedStyle(root)
      .getPropertyValue("--spice-player")
      .trim();
    const currentSidebar = getComputedStyle(root)
      .getPropertyValue("--spice-sidebar")
      .trim();
    const currentCard = getComputedStyle(root)
      .getPropertyValue("--spice-card")
      .trim();
    const currentSurface0 = getComputedStyle(root)
      .getPropertyValue("--surface0")
      .trim();
    const currentSurface1 = getComputedStyle(root)
      .getPropertyValue("--surface1")
      .trim();

    // Convert existing theme colors to RGB and set RGB variables
    const mainRgb = hexToRgb("#" + currentMain);
    const playerRgb = hexToRgb("#" + currentPlayer);
    const sidebarRgb = hexToRgb("#" + currentSidebar);
    const cardRgb = hexToRgb("#" + currentCard);
    const surface0Rgb = hexToRgb("#" + currentSurface0);
    const surface1Rgb = hexToRgb("#" + currentSurface1);

    if (mainRgb) {
      root.style.setProperty(
        "--spice-rgb-main",
        `${mainRgb.r},${mainRgb.g},${mainRgb.b}`
      );
      root.style.setProperty(
        "--spice-rgb-base",
        `${mainRgb.r},${mainRgb.g},${mainRgb.b}`
      );
    }
    if (playerRgb) {
      root.style.setProperty(
        "--spice-rgb-player",
        `${playerRgb.r},${playerRgb.g},${playerRgb.b}`
      );
    }
    if (sidebarRgb) {
      root.style.setProperty(
        "--spice-rgb-sidebar",
        `${sidebarRgb.r},${sidebarRgb.g},${sidebarRgb.b}`
      );
    }
    if (cardRgb) {
      root.style.setProperty(
        "--spice-rgb-card",
        `${cardRgb.r},${cardRgb.g},${cardRgb.b}`
      );
    }
    if (surface0Rgb) {
      root.style.setProperty(
        "--spice-rgb-surface0",
        `${surface0Rgb.r},${surface0Rgb.g},${surface0Rgb.b}`
      );
    }
    if (surface1Rgb) {
      root.style.setProperty(
        "--spice-rgb-surface1",
        `${surface1Rgb.r},${surface1Rgb.g},${surface1Rgb.b}`
      );
    }

    // Apply gradient parameters with all missing values
    root.style.setProperty(
      "--sn-gradient-opacity",
      YEAR3000_CONFIG.gentleMultipliers.opacity.toString()
    );
    root.style.setProperty(
      "--sn-gradient-saturation",
      YEAR3000_CONFIG.gentleMultipliers.saturation.toString()
    );
    root.style.setProperty(
      "--sn-gradient-brightness",
      YEAR3000_CONFIG.gentleMultipliers.brightness.toString()
    );
    root.style.setProperty(
      "--sn-gradient-contrast",
      YEAR3000_CONFIG.gentleMultipliers.contrast.toString()
    );
    root.style.setProperty("--sn-gradient-blur", "30px");
    root.style.setProperty(
      "--sn-gradient-transition",
      "2400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
    );

    // Update spice variables for compatibility
    root.style.setProperty("--spice-button", primaryColor);
    root.style.setProperty("--spice-button-active", accentColor);
    root.style.setProperty("--spice-highlight", secondaryColor);

    console.log("🎨 Applied colors with complete RGB variable support:", {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      rgbVariablesSet: [
        "--sn-gradient-primary-rgb",
        "--sn-gradient-secondary-rgb",
        "--sn-gradient-accent-rgb",
        "--spice-rgb-accent",
        "--spice-rgb-main",
        "--spice-rgb-base",
        "--spice-rgb-player",
        "--spice-rgb-sidebar",
        "--spice-rgb-card",
        "--spice-rgb-surface0",
        "--spice-rgb-surface1",
      ],
    });
  },

  resetToDefaults: () => {
    const root = document.documentElement;

    // Remove gradient hex variables
    root.style.removeProperty("--sn-gradient-primary");
    root.style.removeProperty("--sn-gradient-secondary");
    root.style.removeProperty("--sn-gradient-accent");

    // Remove gradient RGB variables
    root.style.removeProperty("--sn-gradient-primary-rgb");
    root.style.removeProperty("--sn-gradient-secondary-rgb");
    root.style.removeProperty("--sn-gradient-accent-rgb");

    // Remove spice RGB overrides (let theme defaults take over)
    root.style.removeProperty("--spice-rgb-accent");
    root.style.removeProperty("--spice-rgb-main");
    root.style.removeProperty("--spice-rgb-base");
    root.style.removeProperty("--spice-rgb-player");
    root.style.removeProperty("--spice-rgb-sidebar");
    root.style.removeProperty("--spice-rgb-card");
    root.style.removeProperty("--spice-rgb-surface0");
    root.style.removeProperty("--spice-rgb-surface1");
    root.style.removeProperty("--spice-rgb-button");

    // Remove gradient parameters (let SCSS defaults take over)
    root.style.removeProperty("--sn-gradient-opacity");
    root.style.removeProperty("--sn-gradient-saturation");
    root.style.removeProperty("--sn-gradient-brightness");
    root.style.removeProperty("--sn-gradient-contrast");
    root.style.removeProperty("--sn-gradient-blur");
    root.style.removeProperty("--sn-gradient-transition");

    console.log("🧹 Reset all dynamic color variables to theme defaults");
  },

  getSystemReport: () => ({
    status: "Year 3000 Color Harmony System Active",
    currentColors: {
      primary: getComputedStyle(document.documentElement).getPropertyValue(
        "--sn-gradient-primary"
      ),
      secondary: getComputedStyle(document.documentElement).getPropertyValue(
        "--sn-gradient-secondary"
      ),
      accent: getComputedStyle(document.documentElement).getPropertyValue(
        "--sn-gradient-accent"
      ),
    },
  }),
};

// Utility function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Initialize system and event listeners
(function () {
  if (!Spicetify?.colorExtractor) {
    console.warn("Spicetify colorExtractor not available");
    return;
  }

  // Listen for song changes
  Spicetify.Player.addEventListener("songchange", () => {
    setTimeout(() => year3000System.updateColorsFromCurrentTrack(), 100);
  });

  // Initial color extraction
  setTimeout(() => year3000System.updateColorsFromCurrentTrack(), 500);

  console.log(
    "🌟 Year 3000 Color Harmony System initialized with RGB gradient support"
  );
})();

// Debug interface for development (Phase 3: Enhanced with contextual intelligence)
if (YEAR3000_CONFIG.enableDebug) {
  window.Year3000Debug = {
    // Core system controls
    system: year3000System,
    extractColors: () => year3000System.updateColorsFromCurrentTrack(),
    resetColors: () => year3000System.resetToDefaults(),
    getReport: () => year3000System.getSystemReport(),

    // Quick gradient test
    testGradients: () => {
      console.log("🧪 Testing gradient application...");
      year3000System.updateColorsFromCurrentTrack();

      // Show current gradient variables
      const root = document.documentElement;
      const gradientVars = {
        primary: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-primary"
        ),
        secondary: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-secondary"
        ),
        accent: getComputedStyle(root).getPropertyValue("--sn-gradient-accent"),
        primaryRgb: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-primary-rgb"
        ),
        secondaryRgb: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-secondary-rgb"
        ),
        accentRgb: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-accent-rgb"
        ),
        opacity: getComputedStyle(root).getPropertyValue(
          "--sn-gradient-opacity"
        ),
        blur: getComputedStyle(root).getPropertyValue("--sn-gradient-blur"),
      };

      console.log("🎨 Current gradient variables:", gradientVars);
      return gradientVars;
    },

    // Phase 1: Harmony engine controls
    harmonyEngine: year3000System.colorExtractor.harmonyEngine,
    testHarmony: (hex, context = "general") =>
      year3000System.colorExtractor.harmonyEngine.validateColorHarmony(
        hex,
        context
      ),

    // Phase 2: Organic transition controls
    transitions: year3000System.organicTransitions,
    enableBreathing: (enabled) =>
      year3000System.organicTransitions.setBreathingEnabled(enabled),
    testTransition: (colors = null) => {
      const testColors = colors || {
        vibrant: "#ca9ee6",
        darkVibrant: "#babbf1",
        lightVibrant: "#8caaee",
      };
      return year3000System.organicTransitions.performOrganicTransition(
        testColors,
        "breathing"
      );
    },
    abortTransitions: () =>
      year3000System.organicTransitions.abortAllTransitions(),
    getTransitionReport: () =>
      year3000System.organicTransitions.getTransitionReport(),

    // Phase 3: Music analysis and contextual intelligence
    musicAnalyzer: year3000System.musicAnalyzer,
    contextualIntelligence: year3000System.contextualIntelligence,

    // Phase 3: Music analysis testing
    testMusicAnalysis: async (trackData = null) => {
      const currentTrack =
        trackData ||
        Spicetify.Player.data?.item ||
        Spicetify.Player.state?.track;
      if (!currentTrack) {
        console.warn("No track data available for analysis");
        return null;
      }
      return await year3000System.musicAnalyzer.analyzeTrack(currentTrack);
    },

    // Phase 3: Color role assignment testing
    testColorRoles: async (harmonizedColors = null, musicAnalysis = null) => {
      const colors = harmonizedColors || {
        vibrant: "#ca9ee6",
        darkVibrant: "#babbf1",
        lightVibrant: "#8caaee",
        prominent: "#ca9ee6",
        desaturated: "#8caaee",
        vibrantNonAlarming: "#babbf1",
      };

      const analysis =
        musicAnalysis ||
        (await year3000System.musicAnalyzer.analyzeTrack(
          Spicetify.Player.data?.item || Spicetify.Player.state?.track
        ));

      return await year3000System.contextualIntelligence.assignColorRoles(
        colors,
        analysis
      );
    },

    // Phase 3: Full contextual flow testing
    testContextualFlow: async () => {
      console.log("🧪 Testing full contextual intelligence flow...");

      const trackData =
        Spicetify.Player.data?.item || Spicetify.Player.state?.track;
      if (!trackData) {
        console.warn("No track data available");
        return null;
      }

      // Step 1: Music analysis
      const musicAnalysis = await year3000System.musicAnalyzer.analyzeTrack(
        trackData
      );
      console.log("🎵 Music Analysis:", musicAnalysis);

      // Step 2: Color extraction
      const contextualResult =
        await year3000System.colorExtractor.extractColorsWithContext(
          trackData.uri,
          trackData
        );
      console.log("🎨 Color Extraction:", contextualResult);

      // Step 3: Contextual color role assignment
      if (contextualResult?.harmonizedColors && musicAnalysis) {
        const colorRoles =
          await year3000System.contextualIntelligence.assignColorRoles(
            contextualResult.harmonizedColors,
            musicAnalysis
          );
        console.log("🧠 Color Role Assignment:", colorRoles);

        // Step 4: Apply to theme
        year3000System.applyContextualColorsToTheme(
          contextualResult.harmonizedColors,
          colorRoles,
          musicAnalysis
        );

        return { musicAnalysis, contextualResult, colorRoles };
      }

      return { musicAnalysis, contextualResult };
    },

    // Phase 3: Configuration controls
    enableContextualIntelligence: (enabled) => {
      YEAR3000_CONFIG.enableContextualIntelligence = enabled;
      console.log(
        `🧠 Contextual intelligence ${enabled ? "enabled" : "disabled"}`
      );
    },

    enableMusicAnalysis: (enabled) => {
      YEAR3000_CONFIG.enableMusicAnalysis = enabled;
      console.log(`🎵 Music analysis ${enabled ? "enabled" : "disabled"}`);
    },

    setMusicModulationIntensity: (intensity) => {
      YEAR3000_CONFIG.musicModulationIntensity = Math.max(
        0,
        Math.min(1, intensity)
      );
      console.log(
        `🎛️ Music modulation intensity set to ${YEAR3000_CONFIG.musicModulationIntensity}`
      );
    },

    // Phase 3: Cache management
    clearAllCaches: () => {
      year3000System.colorExtractor.colorCache.clear();
      year3000System.musicAnalyzer.clearCache();
      year3000System.contextualIntelligence.clearCache();
      console.log("🧹 All Phase 3 caches cleared");
    },

    // Phase 3: Performance analysis
    getPerformanceMetrics: () => {
      return {
        harmony:
          year3000System.colorExtractor.harmonyEngine.getPerformanceReport(),
        transitions: year3000System.organicTransitions.getTransitionReport(),
        musicAnalysis: year3000System.musicAnalyzer.getAnalysisReport(),
        contextualIntelligence:
          year3000System.contextualIntelligence.getAssignmentReport(),
      };
    },

    // Phase 3: Color simulation for different music moods
    simulateMoodColors: (mood) => {
      const moodConfigs = {
        energetic: {
          energy: 0.9,
          valence: 0.8,
          tempo: 140,
          genre: "electronic",
        },
        calm: { energy: 0.3, valence: 0.6, tempo: 80, genre: "ambient" },
        intense: { energy: 0.8, valence: 0.3, tempo: 130, genre: "rock" },
        ambient: { energy: 0.2, valence: 0.4, tempo: 70, genre: "ambient" },
      };

      const config = moodConfigs[mood];
      if (!config) {
        console.warn("Available moods: energetic, calm, intense, ambient");
        return;
      }

      // Create synthetic music analysis
      const syntheticAnalysis = {
        mood: mood,
        energy: config.energy,
        valence: config.valence,
        tempo: config.tempo,
        genre: config.genre,
        colorContext: {
          warmth: config.valence > 0.5 ? "warm" : "cool",
          intensity:
            config.energy > 0.6
              ? "high"
              : config.energy > 0.4
              ? "medium"
              : "low",
          saturation: config.energy > 0.6 ? "vibrant" : "muted",
        },
        modulationRange: {
          min: 0.1 * config.energy,
          max: 0.3 * config.energy,
          center: 0.2 * config.energy,
        },
      };

      console.log(`🎭 Simulating ${mood} mood colors...`);
      return this.testColorRoles(null, syntheticAnalysis);
    },
  };

  // Phase 3: Add helpful console shortcuts
  console.log(`
🌟 Year 3000 Color Harmony System (Phase 3) Debug Interface Ready!

Quick commands:
• Year3000Debug.getReport() - Full system status
• Year3000Debug.testGradients() - Test gradient RGB variables
• Year3000Debug.extractColors() - Extract colors from current track
• Year3000Debug.resetColors() - Reset to theme defaults
• Year3000Debug.testContextualFlow() - Test complete intelligence flow
• Year3000Debug.testMusicAnalysis() - Analyze current track
• Year3000Debug.simulateMoodColors('energetic') - Test mood-based colors
• Year3000Debug.clearAllCaches() - Clear all caches
• Year3000Debug.getPerformanceMetrics() - Performance analysis

Music mood simulation:
• Year3000Debug.simulateMoodColors('energetic')
• Year3000Debug.simulateMoodColors('calm')
• Year3000Debug.simulateMoodColors('intense')
• Year3000Debug.simulateMoodColors('ambient')
  `);
}
