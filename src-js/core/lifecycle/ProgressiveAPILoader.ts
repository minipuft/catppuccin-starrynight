/**
 * ProgressiveAPILoader - Spicetify API Detection and Loading
 *
 * Handles progressive detection of Spicetify APIs that may load asynchronously.
 * Provides utilities for waiting on specific API paths, DOM elements, and theme readiness.
 *
 * This module enables graceful degradation when Spicetify APIs are not immediately
 * available, allowing the theme to initialize in a reduced-functionality mode
 * and upgrade to full mode when APIs become ready.
 *
 * @architecture Progressive enhancement utilities
 * @see DegradedModeCoordinator for upgrade orchestration
 */

export interface SpicetifyAPIs {
  player: any;
  platform: any;
  menu?: any;
  react?: any;
  reactDOM?: any;
  config?: any;
}

export interface APIWaitOptions {
  timeout?: number;
  interval?: number;
  enableDebug?: boolean;
}

/**
 * Wait for a Spicetify API to become available
 *
 * @param apiPath - Dot-notation path to API (e.g., "Spicetify.Player")
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise resolving to the API object or null if timeout
 */
export async function waitForAPI(
  apiPath: string,
  timeout = 5000
): Promise<any> {
  const start = Date.now();
  let lastError: Error | null = null;
  let attemptCount = 0;

  while (Date.now() - start < timeout) {
    attemptCount++;
    try {
      const api = apiPath
        .split(".")
        .reduce((obj: any, prop: string) => obj?.[prop], window as any);

      if (api) {
        console.log(
          `✅ [ProgressiveAPILoader] API ${apiPath} available after ${attemptCount} attempts (${
            Date.now() - start
          }ms)`
        );
        return api;
      }
    } catch (e) {
      lastError = e as Error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Enhanced error logging for debugging
  console.warn(
    `❌ [ProgressiveAPILoader] API ${apiPath} timeout after ${timeout}ms (${attemptCount} attempts)`
  );
  if (lastError) {
    console.warn(
      `❌ [ProgressiveAPILoader] Last error for ${apiPath}:`,
      lastError.message
    );
  }

  // Additional diagnostic information
  const pathParts = apiPath.split(".");
  let currentObj: any = window;
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (
      !part ||
      !currentObj ||
      typeof currentObj !== "object" ||
      currentObj[part] === undefined
    ) {
      console.warn(
        `❌ [ProgressiveAPILoader] API path ${apiPath} breaks at '${part}' (step ${
          i + 1
        }/${pathParts.length})`
      );
      break;
    }
    currentObj = currentObj[part];
  }

  return null;
}

/**
 * Wait for a DOM element to appear
 *
 * @param selector - CSS selector for element
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise resolving to the element or null if timeout
 */
export async function waitForDOMElement(
  selector: string,
  timeout = 5000
): Promise<Element | null> {
  const start = Date.now();
  let attemptCount = 0;

  while (Date.now() - start < timeout) {
    attemptCount++;
    try {
      const element = document.querySelector(selector);
      if (element) {
        console.log(
          `✅ [ProgressiveAPILoader] DOM element '${selector}' found after ${attemptCount} attempts (${
            Date.now() - start
          }ms)`
        );
        return element;
      }
    } catch (e) {
      console.warn(
        `❌ [ProgressiveAPILoader] DOM query error for '${selector}':`,
        e
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.warn(
    `❌ [ProgressiveAPILoader] DOM element '${selector}' not found after ${timeout}ms (${attemptCount} attempts)`
  );
  return null;
}

/**
 * Wait for Catppuccin theme to be fully loaded
 *
 * @param timeout - Maximum time to wait in milliseconds
 * @returns Promise resolving to true if theme loaded, false if timeout
 */
export async function waitForCatppuccinTheme(
  timeout = 5000
): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    try {
      // Check for Catppuccin CSS variables
      const rootStyles = getComputedStyle(document.documentElement);
      const baseColor = rootStyles.getPropertyValue("--ctp-base");

      if (baseColor && baseColor.trim() !== "") {
        console.log(
          `✅ [ProgressiveAPILoader] Catppuccin theme loaded (${
            Date.now() - start
          }ms)`
        );
        return true;
      }
    } catch (e) {
      console.warn(
        "❌ [ProgressiveAPILoader] Error checking Catppuccin theme:",
        e
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.warn(
    `❌ [ProgressiveAPILoader] Catppuccin theme not detected after ${timeout}ms`
  );
  return false;
}

/**
 * Wait for all required Spicetify APIs
 *
 * @param options - Timeout and debug options
 * @returns Promise resolving to object with API availability status
 */
export async function waitForRequiredAPIs(
  options: APIWaitOptions = {}
): Promise<{ apis: SpicetifyAPIs; allAvailable: boolean }> {
  const { timeout = 3000, enableDebug = false } = options;

  if (enableDebug) {
    console.log(
      `🔄 [ProgressiveAPILoader] Waiting for required Spicetify APIs (timeout: ${timeout}ms)...`
    );
  }

  const apis: SpicetifyAPIs = {
    player: await waitForAPI("Spicetify.Player", timeout),
    platform: await waitForAPI("Spicetify.Platform", timeout),
    menu: await waitForAPI("Spicetify.Menu", timeout - 1000),
    react: await waitForAPI("Spicetify.React", timeout - 1000),
    reactDOM: await waitForAPI("Spicetify.ReactDOM", timeout - 1000),
    config: (window as any).Spicetify?.Config,
  };

  const allAvailable = !!(apis.player && apis.platform);

  if (enableDebug) {
    console.log("🔄 [ProgressiveAPILoader] API availability check:", {
      player: !!apis.player,
      platform: !!apis.platform,
      menu: !!apis.menu,
      react: !!apis.react,
      reactDOM: !!apis.reactDOM,
      allAvailable,
    });
  }

  return { apis, allAvailable };
}

/**
 * Check if we're running in degraded mode (APIs not fully available)
 *
 * @returns True if in degraded mode, false if all required APIs present
 */
export function checkDegradedMode(): boolean {
  const hasPlayer = !!(window as any).Spicetify?.Player;
  const hasPlatform = !!(window as any).Spicetify?.Platform;

  return !(hasPlayer && hasPlatform);
}

/**
 * Get current API availability status
 *
 * @returns Object with current API status
 */
export function getCurrentAPIStatus(): {
  available: SpicetifyAPIs;
  degradedMode: boolean;
} {
  const available: SpicetifyAPIs = {
    player: (window as any).Spicetify?.Player,
    platform: (window as any).Spicetify?.Platform,
    menu: (window as any).Spicetify?.Menu,
    react: (window as any).Spicetify?.React,
    reactDOM: (window as any).Spicetify?.ReactDOM,
    config: (window as any).Spicetify?.Config,
  };

  const degradedMode = checkDegradedMode();

  return { available, degradedMode };
}
