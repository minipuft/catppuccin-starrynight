// ---------------------------------------------------------------------------
// Prismatic Scroll Sheen Effect – Year 3000 visual enhancement
// ---------------------------------------------------------------------------
// Applies a rainbow-sheen gradient that shifts hue based on the user's vertical
// scroll position inside Spotify's playlist/content viewport.  The effect is
// extremely lightweight (one scroll handler + a single CSS variable write) and
// auto-disables on low-end devices as reported by DeviceCapabilityDetector.
// ---------------------------------------------------------------------------

import year3000System from "@/core/year3000System";

// Default cycle length in pixels before the ratio loops back to 0.
// Designers can override at runtime via the CSS variable
//     --sn-scroll-cycle-px: <value>;
const DEFAULT_CYCLE_PX = 6000;

/**
 * Initialise the prismatic scroll sheen.  A CSS custom property
 * `--sn-scroll-ratio` (0-1) is updated in real-time and consumed by SCSS.
 *
 * @param selector CSS selector for the scroll container.  Defaults to
 *                 Spotify's `.main-view-container__scroll-node`.
 */
export function initializePrismaticScrollSheen(
  selector = ".main-view-container__scroll-node"
): void {
  // Graceful degradation when the system or container is missing.
  if (typeof document === "undefined") return;

  // Shutdown pathway for low-end devices.
  try {
    const detector = year3000System?.deviceCapabilityDetector;
    if (
      detector &&
      detector.deviceCapabilities?.overall &&
      detector.deviceCapabilities.overall === "low"
    ) {
      // Flag disabled via CSS variable so the gradient stays hidden.
      document.documentElement.style.setProperty(
        "--sn-scroll-sheen-enabled",
        "0"
      );
      return;
    }
  } catch (_e) {
    /* ignore detection errors – proceed */
  }

  document.documentElement.style.setProperty("--sn-scroll-sheen-enabled", "1");

  const attachListener = (container: HTMLElement) => {
    let previousTop = container.scrollTop;
    let cumulativePx = 0;

    // Determine cycle length – CSS variable beats default.
    const rootStyle = getComputedStyle(document.documentElement);
    const cssCyclePx = parseFloat(
      rootStyle.getPropertyValue("--sn-scroll-cycle-px") || ""
    );
    const cyclePx = isNaN(cssCyclePx) ? DEFAULT_CYCLE_PX : cssCyclePx;

    // Expose the effective cycle length so SCSS authors can read it.
    document.documentElement.style.setProperty(
      "--sn-scroll-cycle-px",
      cyclePx.toString()
    );

    const update = () => {
      const currentTop = container.scrollTop;
      const delta = Math.abs(currentTop - previousTop);
      previousTop = currentTop;

      // Accumulate distance and wrap at cycle boundary.
      cumulativePx = (cumulativePx + delta) % cyclePx;

      const ratio = cumulativePx / cyclePx; // 0-1 repeating value
      document.documentElement.style.setProperty(
        "--sn-scroll-ratio",
        ratio.toFixed(4)
      );
    };

    container.addEventListener("scroll", update, { passive: true });
    update(); // Initial seed
  };

  const maybeAttach = () => {
    const container = document.querySelector<HTMLElement>(selector);
    if (container) {
      attachListener(container);
      return true;
    }
    return false;
  };

  // Attempt immediate attach; if not found, retry a few times.
  if (!maybeAttach()) {
    const retryInterval = setInterval(() => {
      if (maybeAttach()) clearInterval(retryInterval);
    }, 500);
    // Stop trying after 20 seconds to avoid leaking.
    setTimeout(() => clearInterval(retryInterval), 20000);
  }
}
