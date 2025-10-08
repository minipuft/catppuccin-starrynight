/* =============================================================================
 * AberrationManager – lifecycle glue for Adaptive Chromatic Aberration Canvas
 * ----------------------------------------------------------------------------
 * Ensures the AberrationCanvas stays attached as users navigate across Spotify
 * routes.  Uses Spicetify.Platform.History (if available) plus the legacy
 * `spicetify:appchange` event.  Falls back to a short-lived MutationObserver on
 * first load when DOM may not be ready yet.
 * =============================================================================
 */

import { ThemeLifecycleCoordinator } from "@/core/lifecycle/ThemeLifecycleCoordinator";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { DefaultServiceFactory } from "@/core/services/CoreServiceProviders";
import { AberrationCanvas } from "./AberrationCanvas";
import { AberrationVisualSystem } from "./AberrationVisualSystem";
import { getScrollNode } from "@/utils/dom/getScrollNode";

let instance: AberrationCanvas | null = null;
let visualSystem: AberrationVisualSystem | null = null;

// Helper to get CSS coordinator for coordination
function getCSSController(y3k: ThemeLifecycleCoordinator | null): CSSVariableWriter {
  const services = DefaultServiceFactory.getServices();
  const themeService = services.themeLifecycle;
  const coordinator = y3k || themeService?.getCoordinator() || null;
  const coordinatorAny = coordinator as any;
  return (
    themeService?.getCssController() ||
    coordinatorAny?.cssController ||
    getGlobalCSSVariableWriter()
  );
}

// Helper to read current user preference without circular dep
// NOTE: Aberration setting has been removed in settings rationalization
function isAberrationEnabled(): boolean {
  // Aberration effects are now disabled by default as the setting was removed
  // as a technical/niche setting. The system can still function but won't
  // be exposed to users for configuration.
  return false; // Disabled by default after settings rationalization
}

function attach(y3k: ThemeLifecycleCoordinator | null): void {
  if (!isAberrationEnabled()) {
    // Ensure noise overlay and CSS effects are disabled if setting off
    setNebulaNoiseEnabled(false, y3k);
    setCSSAberrationEnabled(false, y3k);
    return;
  }

  const node = getScrollNode();
  if (!node) return;
  if (instance && (instance as any).parent === node) return; // already attached
  instance?.destroy();
  instance = new AberrationCanvas(node, y3k);
  if ((window as any).__SN_DEBUG_ABERRATION) {
    console.log("[AberrationManager] canvas attached", node);
  }

  // Enable noise overlay only when WebGL canvas is active
  setNebulaNoiseEnabled(true, y3k);

  // Enable CSS-based aberration effects to complement WebGL
  setCSSAberrationEnabled(true, y3k);

  // ----- Year 3000 Phase-1: register visual system -----
  if (y3k && instance) {
    visualSystem = new AberrationVisualSystem(
      instance,
      y3k.performanceAnalyzer || undefined
    );
    // Register with Cosmic Discovery Framework
    (y3k as any)?.registerVisualSystem?.(visualSystem, "critical");
    console.log("[AberrationManager] AberrationCanvas attached");
  }
}

/** Toggle Nebula noise overlay so that when Aberration fails we don't leave a bright wash using coordination. */
function setNebulaNoiseEnabled(
  enabled: boolean,
  y3k: ThemeLifecycleCoordinator | null
): void {
  const cssController = getCSSController(y3k);
  
  cssController.setVariable(
    "AberrationManager",
    "--sn-nebula-noise-opacity",
    enabled ? "0.03" : "0",
    "normal", // Normal priority for nebula noise overlay
    "nebula-noise-toggle"
  );
}

/** Enable CSS-based aberration effects to complement WebGL canvas aberration using coordination. */
function setCSSAberrationEnabled(
  enabled: boolean,
  y3k: ThemeLifecycleCoordinator | null
): void {
  const variables = {
    "--aberration-webgl-active": enabled ? "1" : "0",
    "--aberration-css-enabled": enabled ? "1" : "0",
    "--aberration-hybrid-mode": enabled ? "1" : "0"
  };

  const cssController = getCSSController(y3k);
  
  // Use batched coordination for performance
  cssController.batchSetVariables(
    "AberrationManager",
    variables,
    "normal", // Normal priority for CSS aberration effects
    "css-aberration-toggle"
  );
}

export function initializeAberrationManager(
  y3k: ThemeLifecycleCoordinator | null = null
): void {
  const services = DefaultServiceFactory.getServices();
  const coordinator = y3k || services.themeLifecycle?.getCoordinator() || null;

  // Immediate attempt (first page)
  attach(coordinator);

  // If attach failed (no instance), disable noise overlay and CSS effects to avoid bright wash
  if (!instance) {
    setNebulaNoiseEnabled(false, coordinator);
    setCSSAberrationEnabled(false, coordinator);
  }

  // React-Router style – newer Spotify builds
  const history = (window as any).Spicetify?.Platform?.History;
  if (history?.listen) {
    history.listen(() => setTimeout(() => attach(coordinator), 0));
  }

  // Legacy custom event fired by Spicetify when apps change
  document.addEventListener("spicetify:appchange", () => attach(coordinator));

  // First-load fallback – detach once canvas attaches
  const observer = new MutationObserver(() => {
    if (!instance) {
      attach(coordinator);
      if (!instance) {
        setNebulaNoiseEnabled(false, coordinator);
        setCSSAberrationEnabled(false, coordinator);
      }
    } else {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // NOTE: Runtime setting change listener removed - aberration settings (sn-enable-aberration,
  // sn-nebula-aberration-strength) were removed during settings rationalization (Phase 5).
  // Aberration system is now disabled by default (see isAberrationEnabled() on line 28).
  // If aberration settings are re-added in future, use settings.onChange() pattern instead
  // of DOM events for better type safety and performance.
}
