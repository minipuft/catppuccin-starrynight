/* ----------------------------------------------------------------------------
 * 🎞️ ANIMATION UTILITIES – Phase 4 (Echo & Animation Micro-tuning)
 * ----------------------------------------------------------------------------
 * This module centralises small Web-Animations helpers so visual systems can
 * avoid costly layout thrash patterns such as `void el.offsetWidth;` when they
 * need to restart a CSS animation.
 * ---------------------------------------------------------------------------- */

/**
 * Efficiently restarts the first animation on `el` using the Web-Animations API
 * where supported.  Falls back to the legacy style-toggle trick when
 * `Element.getAnimations` is unavailable.
 */
export function restartCssAnimation(el: HTMLElement): void {
  try {
    const anims = (el as any).getAnimations?.() as Animation[] | undefined;
    if (anims && anims.length) {
      anims.forEach((a) => {
        try {
          a.cancel();
          a.play();
        } catch {
          /* ignore individual animation errors */
        }
      });
      return;
    }
  } catch {
    /* ignore / fallback */
  }

  // Fallback – style-toggle method (no layout read, so cheaper than void
  // offsetWidth; thanks to requestAnimationFrame flush).
  const prev = el.style.animation;
  el.style.animation = "none";
  requestAnimationFrame(() => {
    el.style.animation = prev;
  });
}
