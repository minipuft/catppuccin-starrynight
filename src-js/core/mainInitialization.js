async function main() {
  try {
    console.log("🌟 [StarryNight] Starting YEAR 3000 main initialization...");

    // Initialize the year3000System which includes all core systems
    // year3000System is expected to be available on globalThis when this is called from theme.entry.js
    if (
      globalThis.year3000System &&
      typeof globalThis.year3000System.initializeAllSystems === "function"
    ) {
      await globalThis.year3000System.initializeAllSystems();
      console.log(
        "🌟 [StarryNight] year3000System.initializeAllSystems() completed successfully"
      );
    } else {
      console.error(
        "🔥 [StarryNight] year3000System.initializeAllSystems not available!"
      );
    }

    // Set up music analysis and color extraction
    if (
      globalThis.year3000System &&
      globalThis.year3000System.setupMusicAnalysisAndColorExtraction
    ) {
      globalThis.year3000System.setupMusicAnalysisAndColorExtraction();
      console.log(
        "🌟 [StarryNight] Music analysis and color extraction set up"
      );
    }

    console.log(
      "🌟 [StarryNight] YEAR 3000 main initialization completed successfully!"
    );
  } catch (error) {
    console.error("🔥 [StarryNight] Error during main initialization:", error);
  }
}

export { main };
