import { settings } from "@/config";
import type { PerformanceMode } from "@/config/settingsSchema";
import { Y3KDebug } from "@/debug/DebugCoordinator";

/**
 * Migrate old scattered settings to new performance mode
 *
 * This migration helper runs once on first load after upgrade to detect
 * user's previous quality preferences and map them to the appropriate
 * performance mode.
 *
 * @returns The inferred performance mode, or null if already migrated
 */
export function migrateToPerformanceMode(): PerformanceMode | null {
  const existingMode = settings.get("sn-performance-mode");

  // Already migrated
  if (existingMode) {
    return existingMode as PerformanceMode;
  }

  // Read old settings directly from localStorage (bypassing TypedSettings schema)
  // These settings are no longer in the schema, so we access localStorage directly
  const webglEnabled = (globalThis as any).Spicetify?.LocalStorage?.get("sn-webgl-enabled") === "true";
  const webglQuality = (globalThis as any).Spicetify?.LocalStorage?.get("sn-webgl-quality") as string | undefined;
  const animationQuality = (globalThis as any).Spicetify?.LocalStorage?.get("sn-animation-quality") as string | undefined;
  const gradientIntensity = settings.get("sn-gradient-intensity");

  // Determine best-fit mode based on old settings
  let inferredMode: PerformanceMode = "auto";

  // Check if user had performance-oriented settings
  if (
    webglEnabled === false ||
    gradientIntensity === "disabled" ||
    gradientIntensity === "minimal"
  ) {
    // User prefers performance
    inferredMode = "performance";
  }
  // Check if user had quality-oriented settings
  else if (
    webglQuality === "high" &&
    gradientIntensity === "intense"
  ) {
    // User wants maximum quality
    inferredMode = "quality";
  }
  // Check if user trusted auto-detection
  else if (animationQuality === "auto") {
    // User trusts auto-detection
    inferredMode = "auto";
  }
  // Default to balanced for everything else
  else {
    // Balanced for everything else
    inferredMode = "balanced";
  }

  // Save inferred mode
  settings.set("sn-performance-mode", inferredMode);

  Y3KDebug?.debug?.log(
    "PerformanceModeMigration",
    `Migrated old settings to performance mode: ${inferredMode}`,
    {
      webglEnabled,
      webglQuality,
      animationQuality,
      gradientIntensity,
    }
  );

  return inferredMode;
}
