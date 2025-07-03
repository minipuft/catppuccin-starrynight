/**
 * Right Sidebar Coordinator - Atomic CSS Variable Batching
 *
 * Atomically flushes all right-sidebar style updates at the next animation frame
 * to eliminate intra-frame skew and reduce visual jitter. Scoped to right sidebar
 * element for optimal performance.
 */

import { CSSVariableBatcher } from "@/core/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/PerformanceAnalyzer";
import { MODERN_SELECTORS } from "@/debug/SpotifyDOMSelectors";

interface PendingUpdate {
  property: string;
  value: string;
  timestamp: number;
}

interface CoordinatorConfig {
  enableDebug?: boolean;
  maxBatchSize?: number;
  performanceAnalyzer?: PerformanceAnalyzer;
  onFlushComplete?: () => void;
}

export class RightSidebarCoordinator {
  private static instance: RightSidebarCoordinator | null = null;

  private pendingUpdates: Map<string, PendingUpdate> = new Map();
  private isFlushScheduled: boolean = false;
  private rafId: number | null = null;
  private config: CoordinatorConfig;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;

  // Harmonic variable mapping for Year 3000 convergence
  private readonly harmonicVariableMap: Map<string, string> = new Map([
    ["--sn-rs-beat-intensity", "--sn-beat-pulse-intensity"],
    ["--sn-rs-glow-alpha", "--sn-rhythm-phase"],
    ["--sn-rs-hue-shift", "--sn-spectrum-phase"],
  ]);

  // Performance tracking
  private flushCount: number = 0;
  private totalFlushTime: number = 0;
  private lastFlushTimestamp: number = 0;

  // DOM observation for reactive refresh and temporal play
  private domObserver: MutationObserver | null = null;
  private rightSidebarElement: Element | null = null;
  private visibilityObserver: IntersectionObserver | null = null;
  private isFirstOpen: boolean = true;
  private lastScrollUpdate: number = 0;

  constructor(config: CoordinatorConfig = {}) {
    this.config = {
      enableDebug: config.enableDebug ?? false,
      maxBatchSize: config.maxBatchSize ?? 50,
      ...config,
    };

    this.performanceAnalyzer = config.performanceAnalyzer || null;

    if (this.config.enableDebug) {
      console.log(
        "🌌 [RightSidebarCoordinator] Initialized with RAF-based batching"
      );
    }
  }

  /**
   * Singleton accessor for global coordination
   */
  public static getInstance(
    config?: CoordinatorConfig
  ): RightSidebarCoordinator {
    if (!RightSidebarCoordinator.instance) {
      RightSidebarCoordinator.instance = new RightSidebarCoordinator(config);
    }
    return RightSidebarCoordinator.instance;
  }

  /**
   * Queue a CSS variable update for atomic application at next animation frame
   */
  public queueUpdate(property: string, value: string): void {
    // Check if this is a critical variable that should bypass coordination
    const criticalVars = [
      "--sn-rs-glow-alpha",
      "--sn-rs-beat-intensity",
      "--sn-rs-hue-shift",
    ];

    if (criticalVars.includes(property)) {
      // Critical variables are applied directly to the right sidebar element
      this.applyCriticalUpdate(property, value);
      return;
    }

    // Delegate non-critical vars to global CSSVariableBatcher for sync flush
    if (CSSVariableBatcher.instance) {
      CSSVariableBatcher.instance.queueCSSVariableUpdate(
        property,
        value,
        this.getRightSidebarElement() as HTMLElement
      );
    } else {
      this.pendingUpdates.set(property, {
        property,
        value,
        timestamp: performance.now(),
      });

      if (this.config.enableDebug && this.pendingUpdates.size === 1) {
        console.log(
          `🌌 [RightSidebarCoordinator] Queuing first update (fallback): ${property}`
        );
      }

      this.scheduleFlush();
    }
  }

  /**
   * Apply critical updates immediately to the right sidebar element
   */
  private applyCriticalUpdate(property: string, value: string): void {
    const sidebarElement = this.getRightSidebarElement();
    if (sidebarElement) {
      try {
        (sidebarElement as HTMLElement).style.setProperty(property, value);
      } catch (error) {
        console.error(
          `🌌 [RightSidebarCoordinator] Failed to apply critical ${property}:`,
          error
        );
      }
    }
  }

  /**
   * Get the right sidebar element with fallback to document root
   */
  private getRightSidebarElement(): Element {
    if (!this.rightSidebarElement) {
      this.rightSidebarElement = document.querySelector(
        MODERN_SELECTORS.rightSidebar as string
      );
    }

    // Fallback to document root if sidebar not found
    return this.rightSidebarElement || document.documentElement;
  }

  /**
   * Schedule atomic flush at next animation frame
   */
  private scheduleFlush(): void {
    if (this.isFlushScheduled) {
      return;
    }

    this.isFlushScheduled = true;
    this.rafId = requestAnimationFrame(() => {
      this.flushUpdates();
    });
  }

  /**
   * Atomically apply all pending updates
   */
  private flushUpdates(): void {
    if (this.pendingUpdates.size === 0) {
      this.isFlushScheduled = false;
      return;
    }

    const startTime = performance.now();
    const targetElement = this.getRightSidebarElement();
    const updateCount = this.pendingUpdates.size;

    if (this.config.enableDebug) {
      console.log(
        `🌌 [RightSidebarCoordinator] Flushing ${updateCount} updates atomically`
      );
    }

    // Performance guard - if too many updates, batch them differently
    if (updateCount > (this.config.maxBatchSize || 50)) {
      console.warn(
        `🌌 [RightSidebarCoordinator] Large batch detected (${updateCount} updates), may impact performance`
      );
    }

    // Apply all updates atomically to the right sidebar element with harmonic mapping
    for (const update of this.pendingUpdates.values()) {
      try {
        // Apply the original variable to the sidebar element
        (targetElement as HTMLElement).style.setProperty(
          update.property,
          update.value
        );

        // Also apply to global harmonic if mapping exists
        const harmonicVar = this.harmonicVariableMap.get(update.property);
        if (harmonicVar) {
          document.documentElement.style.setProperty(harmonicVar, update.value);

          if (this.config.enableDebug) {
            console.log(
              `🌌 [RightSidebarCoordinator] Mapped ${update.property} → ${harmonicVar} = ${update.value}`
            );
          }
        }
      } catch (error) {
        console.error(
          `🌌 [RightSidebarCoordinator] Failed to apply ${update.property}:`,
          error
        );
      }
    }

    // Clear pending updates
    this.pendingUpdates.clear();
    this.isFlushScheduled = false;
    this.rafId = null;

    // Invoke callback after flush completion
    if (this.config.onFlushComplete) {
      try {
        this.config.onFlushComplete();
      } catch (error) {
        console.error(
          "🌌 [RightSidebarCoordinator] Error in flush completion callback:",
          error
        );
      }
    }

    // Track performance
    const endTime = performance.now();
    const flushTime = endTime - startTime;
    this.flushCount++;
    this.totalFlushTime += flushTime;
    this.lastFlushTimestamp = endTime;

    if (this.performanceAnalyzer) {
      this.performanceAnalyzer.emitTrace?.(
        `[RightSidebarCoordinator] Flushed ${updateCount} updates in ${flushTime.toFixed(
          2
        )}ms`
      );
    }

    // Performance validation as specified (warn if average flush > 3ms)
    const avgFlushTime =
      this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0;
    if (avgFlushTime > 3) {
      console.warn(
        `🌌 [RightSidebarCoordinator] Performance threshold exceeded: average ${avgFlushTime.toFixed(
          2
        )}ms per flush (target: <3ms)`
      );
    }

    if (this.config.enableDebug && flushTime > 4) {
      console.warn(
        `🌌 [RightSidebarCoordinator] Slow flush detected: ${flushTime.toFixed(
          2
        )}ms for ${updateCount} updates`
      );
    }
  }

  /**
   * Setup DOM observation for reactive refresh and temporal play
   */
  public setupDOMObservation(): void {
    if (this.domObserver) {
      return; // Already observing
    }

    this.rightSidebarElement = document.querySelector(
      MODERN_SELECTORS.rightSidebar as string
    );

    if (!this.rightSidebarElement) {
      if (this.config.enableDebug) {
        console.warn(
          "🌌 [RightSidebarCoordinator] Right sidebar not found, deferring DOM observation"
        );
      }

      // Retry after a short delay
      setTimeout(() => this.setupDOMObservation(), 1000);
      return;
    }

    // Mutation observer for structural changes
    this.domObserver = new MutationObserver((mutations) => {
      // Force refresh when DOM structure changes
      this.queueUpdate("--sn-rs-force-refresh", Date.now().toString());

      // Check for visibility changes (aria-hidden, style.display)
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "aria-hidden" ||
            mutation.attributeName === "style")
        ) {
          this.handleVisibilityChange();
        }
      }

      if (this.config.enableDebug) {
        console.log(
          "🌌 [RightSidebarCoordinator] DOM change detected, forcing refresh"
        );
      }
    });

    this.domObserver.observe(this.rightSidebarElement, {
      childList: true,
      subtree: true,
      attributes: true, // Watch for aria-hidden and style changes
      attributeFilter: ["aria-hidden", "style", "class"],
    });

    // Intersection observer for visibility changes
    this.setupVisibilityObserver();

    // Setup scroll throttling for queue lists
    this.setupScrollObservation();

    if (this.config.enableDebug) {
      console.log(
        "🌌 [RightSidebarCoordinator] DOM observation active on right sidebar"
      );
    }
  }

  /**
   * Setup visibility observer for temporal echo effects
   */
  private setupVisibilityObserver(): void {
    if (!this.rightSidebarElement || this.visibilityObserver) return;

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && this.isFirstOpen) {
          this.triggerTemporalEcho();
          this.isFirstOpen = false;
        }
      },
      { threshold: 0.1 }
    );

    this.visibilityObserver.observe(this.rightSidebarElement);
  }

  /**
   * Setup scroll observation with throttling for performance
   */
  private setupScrollObservation(): void {
    if (!this.rightSidebarElement) return;

    const queueElement = this.rightSidebarElement.querySelector(
      ".main-nowPlayingView-queue"
    );
    if (!queueElement) return;

    queueElement.addEventListener(
      "scroll",
      this.throttledScrollHandler.bind(this),
      {
        passive: true,
      }
    );
  }

  /**
   * Throttled scroll handler (≤30 Hz as specified)
   */
  private throttledScrollHandler(): void {
    const now = performance.now();
    if (now - this.lastScrollUpdate < 33) return; // 30 Hz limit

    this.lastScrollUpdate = now;

    // Use requestIdleCallback when available for better performance
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        this.queueUpdate("--sn-rs-scroll-ratio", Math.random().toString());
      });
    } else {
      this.queueUpdate("--sn-rs-scroll-ratio", Math.random().toString());
    }
  }

  /**
   * Handle visibility changes for temporal effects
   */
  private handleVisibilityChange(): void {
    if (!this.rightSidebarElement) return;

    const isVisible =
      !this.rightSidebarElement.hasAttribute("aria-hidden") &&
      !(this.rightSidebarElement as HTMLElement).style.display?.includes(
        "none"
      );

    if (isVisible && this.isFirstOpen) {
      this.triggerTemporalEcho();
      this.isFirstOpen = false;
    }

    if (this.config.enableDebug) {
      console.log(
        `🌌 [RightSidebarCoordinator] Visibility changed: ${
          isVisible ? "visible" : "hidden"
        }`
      );
    }
  }

  /**
   * Trigger one-time temporal echo effect
   */
  private triggerTemporalEcho(): void {
    if (!this.rightSidebarElement) return;

    // Add temporal echo class for 3-layer effect
    this.rightSidebarElement.classList.add("sn-future-preview");

    // Set temporal variables
    this.queueUpdate("--sn-kinetic-intensity", "1");
    this.queueUpdate("--sn-echo-hue-shift", "15deg");
    this.queueUpdate("--sn-echo-radius-multiplier", "1.2");

    if (this.config.enableDebug) {
      console.log(
        "🌌 [RightSidebarCoordinator] Triggering temporal echo effect"
      );
    }

    // Clean up after animation
    setTimeout(() => {
      this.rightSidebarElement?.classList.remove("sn-future-preview");
      this.queueUpdate("--sn-kinetic-intensity", "0");
    }, 2000);
  }

  /**
   * Get performance metrics for monitoring
   */
  public getPerformanceMetrics(): {
    flushCount: number;
    averageFlushTime: number;
    lastFlushTimestamp: number;
    pendingUpdates: number;
  } {
    return {
      flushCount: this.flushCount,
      averageFlushTime:
        this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0,
      lastFlushTimestamp: this.lastFlushTimestamp,
      pendingUpdates: this.pendingUpdates.size,
    };
  }

  /**
   * Force immediate flush for critical scenarios
   */
  public forceFlush(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.flushUpdates();
  }

  /**
   * Cleanup and destroy coordinator
   */
  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }

    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
      this.visibilityObserver = null;
    }

    this.pendingUpdates.clear();
    this.isFlushScheduled = false;
    this.rightSidebarElement = null;

    if (RightSidebarCoordinator.instance === this) {
      RightSidebarCoordinator.instance = null;
    }

    if (this.config.enableDebug) {
      const avgFlushTime =
        this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0;
      console.log(
        `🌌 [RightSidebarCoordinator] Destroyed. Performance: ${
          this.flushCount
        } flushes, ${avgFlushTime.toFixed(2)}ms avg`
      );
    }
  }
}

/**
 * Global helper function for easy access
 */
export function getRightSidebarCoordinator(
  config?: CoordinatorConfig
): RightSidebarCoordinator {
  return RightSidebarCoordinator.getInstance(config);
}
