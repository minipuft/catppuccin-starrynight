/* =============================================================================
 * AberrationManager – lifecycle glue for Adaptive Chromatic Aberration Canvas
 * ----------------------------------------------------------------------------
 * Ensures the AberrationCanvas stays attached as users navigate across Spotify
 * routes.  Uses Spicetify.Platform.History (if available) plus the legacy
 * `spicetify:appchange` event.  Falls back to a short-lived MutationObserver on
 * first load when DOM may not be ready yet.
 * =============================================================================
 */

import { Year3000System } from "@/core/year3000System";
import { AberrationCanvas } from "@/effects/Aberration/AberrationCanvas";
import { AberrationVisualSystem } from "@/effects/Aberration/AberrationVisualSystem";
import { getScrollNode } from "@/utils/getScrollNode";

let instance: AberrationCanvas | null = null;
let visualSystem: AberrationVisualSystem | null = null;

// Helper to read current user preference without circular dep
function isAberrationEnabled(): boolean {
  try {
    const val = (window as any).Spicetify?.LocalStorage?.get?.(
      "sn-enable-aberration"
    );
    return val !== "false"; // default to true when missing
  } catch {
    return true;
  }
}

function attach(y3k: Year3000System | null): void {
  if (!isAberrationEnabled()) {
    // Ensure noise overlay is disabled if setting off
    setNebulaNoiseEnabled(false, y3k);
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

  // ----- Year 3000 Phase-1: register visual system -----
  if (y3k && instance) {
    visualSystem = new AberrationVisualSystem(
      instance,
      y3k.performanceAnalyzer || undefined
    );
    // Register with Cosmic Discovery Framework
    (y3k as any)?.registerVisualSystem?.(visualSystem, "critical");
    y3k.performanceAnalyzer?.emitTrace("AberrationCanvasAttached");
  }
}

/** Toggle Nebula noise overlay so that when Aberration fails we don't leave a bright wash. */
function setNebulaNoiseEnabled(
  enabled: boolean,
  y3k: Year3000System | null
): void {
  if (y3k) {
    y3k.queueCSSVariableUpdate(
      "--sn-nebula-noise-opacity",
      enabled ? "0.03" : "0"
    );
  } else {
    // Fallback when Year3000System not yet ready
    document.documentElement.style.setProperty(
      "--sn-nebula-noise-opacity",
      enabled ? "0.03" : "0"
    );
  }
}

export function initializeAberrationManager(y3k: Year3000System | null = null) {
  // Immediate attempt (first page)
  attach(y3k);

  // If attach failed (no instance), disable noise overlay to avoid bright wash
  if (!instance) setNebulaNoiseEnabled(false, y3k);

  // React-Router style – newer Spotify builds
  const history = (window as any).Spicetify?.Platform?.History;
  if (history?.listen) {
    history.listen(() => setTimeout(() => attach(y3k), 0));
  }

  // Legacy custom event fired by Spicetify when apps change
  document.addEventListener("spicetify:appchange", () => attach(y3k));

  // First-load fallback – detach once canvas attaches
  const observer = new MutationObserver(() => {
    if (!instance) {
      attach(y3k);
      if (!instance) setNebulaNoiseEnabled(false, y3k);
    } else {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // React to runtime setting changes
  document.addEventListener("year3000SystemSettingsChanged", (e: any) => {
    const { key, value } = e.detail || {};
    if (key === "sn-enable-aberration") {
      const enable = value === "true";
      if (enable && !instance) {
        attach(y3k);
      } else if (!enable && instance) {
        instance.destroy();
        instance = null;
        // Unregister and destroy visual system
        y3k?.unregisterAnimationSystem("AberrationCanvas");
        visualSystem?.destroy();
        visualSystem = null;
        y3k?.performanceAnalyzer?.emitTrace("AberrationCanvasDetached");
      }
      setNebulaNoiseEnabled(enable && !!instance, y3k);
    }
    // Phase-3: Live strength updates via SettingsManager
    if (key === "sn-nebula-aberration-strength") {
      const num = parseFloat(value);
      if (!Number.isNaN(num) && instance) {
        instance.setStrength(num);
      }
      // Ensure CSS variable reflects setting (batched)
      y3k?.queueCSSVariableUpdate(
        "--sn-nebula-aberration-strength",
        String(value)
      );
    }
  });
}
