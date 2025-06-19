// TODO[PHASE1-TEMPORAL-ECHO]: Add EchoPool utility to manage re-usable `.sn-temporal-echo` elements across systems
// This file intentionally keeps the implementation minimal for Phase 1 parity goals.
// Subsequent phases will refine pooling (e.g., requestAnimationFrame batching, off-main-thread heuristics).

export interface EchoOptions {
  /** CSS hue in degrees (0–360) */
  tintHue?: number;
  /** Radius in pixels (affects scale) */
  radius?: number;
  /** Positional offset multiplier applied to beat vector */
  offset?: number;
  /** Kinetic intensity (maps to --sn-kinetic-intensity) */
  intensity?: number;
}

/**
 * Singleton pool re-using `.sn-temporal-echo` elements to mitigate DOM churn.
 * Systems call `echoPool.spawn()` with either an HTMLElement target or raw x/y coords.
 */
class EchoPool {
  private readonly _maxSize = 32;
  private _pool: HTMLElement[] = [];

  /** Number of echo nodes currently in use (for debug / tests) */
  public activeCount(): number {
    return document.querySelectorAll<HTMLDivElement>(
      ".sn-temporal-echo:not(.sn-temporal-echo--pooled)"
    ).length;
  }

  /**
   * Acquire an echo element from the pool or create a new one.
   */
  private _acquire(): HTMLElement {
    const el = this._pool.pop() || this._create();
    el.classList.remove("sn-temporal-echo--pooled");
    return el;
  }

  /**
   * Return an element back to the pool.
   */
  private _release(el: HTMLElement) {
    el.classList.add("sn-temporal-echo--pooled");
    el.style.opacity = "0";
    if (this._pool.length < this._maxSize) {
      this._pool.push(el);
    } else {
      el.remove(); // Hard limit reached; drop element.
    }
  }

  /**
   * Spawn an echo either at a given coordinate or centered on a target element.
   */
  public spawn(
    target: HTMLElement | { x: number; y: number },
    opts: EchoOptions = {}
  ) {
    const el = this._acquire();

    // === Positioning ===
    let x: number, y: number;
    if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = target.x;
      y = target.y;
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // === Custom property mapping ===
    if (opts.tintHue !== undefined) {
      el.style.setProperty("--sn-echo-hue", `${opts.tintHue}`);
    }
    if (opts.intensity !== undefined) {
      el.style.setProperty("--sn-kinetic-intensity", `${opts.intensity}`);
    }
    if (opts.radius !== undefined) {
      // The SCSS scales echo size using scale() transform; convert radius to scale factor (~16px base)
      const scale = opts.radius / 16;
      el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    }

    // Reset animation by reflow
    void el.offsetWidth;

    // Activate animation class
    el.classList.add("sn-temporal-echo--active");

    // Auto-release after animation completes
    const handleEnd = () => {
      el.removeEventListener("animationend", handleEnd);
      el.classList.remove("sn-temporal-echo--active");
      this._release(el);
    };
    el.addEventListener("animationend", handleEnd, { once: true });

    // Append to body last to ensure correct stacking context
    document.body.appendChild(el);
  }

  /**
   * Convenience wrapper: spawn echo underneath a target element inside its parent.
   */
  public spawnBehind(target: HTMLElement, opts: EchoOptions = {}) {
    opts = { ...opts }; // shallow copy
    const el = this._acquire();
    const rect = target.getBoundingClientRect();
    el.style.position = "absolute";
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top + rect.height / 2}px`;

    if (opts.tintHue !== undefined) {
      el.style.setProperty("--sn-echo-hue", `${opts.tintHue}`);
    }
    if (opts.intensity !== undefined) {
      el.style.setProperty("--sn-kinetic-intensity", `${opts.intensity}`);
    }
    if (opts.radius !== undefined) {
      const scale = opts.radius / 16;
      el.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(2)})`;
    }

    // Insert behind target using z-index
    const parent = target.parentElement || document.body;
    parent.insertBefore(el, parent.firstChild);

    void el.offsetWidth;
    el.classList.add("sn-temporal-echo--active");
    const handleEnd = () => {
      el.removeEventListener("animationend", handleEnd);
      el.classList.remove("sn-temporal-echo--active");
      this._release(el);
    };
    el.addEventListener("animationend", handleEnd, { once: true });
  }

  /** Create a pristine echo DOM node */
  private _create(): HTMLElement {
    const el = document.createElement("div");
    el.className = "sn-temporal-echo sn-temporal-echo--pooled";
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.pointerEvents = "none";
    return el;
  }
}

/** Global singleton export */
export const echoPool = new EchoPool();
