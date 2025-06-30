/**
 * Phase 3: NowPlayingCoordinator - Timing Hub
 *
 * Atomically flushes all now-playing style updates at the next animation frame
 * to eliminate intra-frame skew and reduce visual jitter.
 */

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

export class NowPlayingCoordinator {
  private static instance: NowPlayingCoordinator | null = null;

  private pendingUpdates: Map<string, PendingUpdate> = new Map();
  private isFlushScheduled: boolean = false;
  private rafId: number | null = null;
  private config: CoordinatorConfig;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;

  // Performance tracking
  private flushCount: number = 0;
  private totalFlushTime: number = 0;
  private lastFlushTimestamp: number = 0;

  // DOM observation for reactive refresh (Phase 4)
  private domObserver: MutationObserver | null = null;
  private nowPlayingElement: Element | null = null;

  constructor(config: CoordinatorConfig = {}) {
    this.config = {
      enableDebug: config.enableDebug ?? false,
      maxBatchSize: config.maxBatchSize ?? 50,
      ...config,
    };

    this.performanceAnalyzer = config.performanceAnalyzer || null;

    if (this.config.enableDebug) {
      console.log(
        "🎵 [NowPlayingCoordinator] Initialized with RAF-based batching"
      );
    }
  }

  /**
   * Singleton accessor for global coordination
   */
  public static getInstance(config?: CoordinatorConfig): NowPlayingCoordinator {
    if (!NowPlayingCoordinator.instance) {
      NowPlayingCoordinator.instance = new NowPlayingCoordinator(config);
    }
    return NowPlayingCoordinator.instance;
  }

  /**
   * Queue a CSS variable update for atomic application at next animation frame
   */
  public queueUpdate(property: string, value: string): void {
    // Check if this is a critical variable that should bypass coordination
    const criticalVars = [
      "--sn-beat-pulse-intensity",
      "--sn-breathing-scale",
      "--sn-accent-hex",
      "--sn-accent-rgb",
    ];

    if (criticalVars.includes(property)) {
      // Critical variables are handled immediately by CSSVariableBatcher fast path
      return;
    }

    this.pendingUpdates.set(property, {
      property,
      value,
      timestamp: performance.now(),
    });

    if (this.config.enableDebug && this.pendingUpdates.size === 1) {
      console.log(
        `🎵 [NowPlayingCoordinator] Queuing first update: ${property}`
      );
    }

    this.scheduleFlush();
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
    const root = document.documentElement;
    const updateCount = this.pendingUpdates.size;

    if (this.config.enableDebug) {
      console.log(
        `🎵 [NowPlayingCoordinator] Flushing ${updateCount} updates atomically`
      );
    }

    // Performance guard - if too many updates, batch them differently
    if (updateCount > (this.config.maxBatchSize || 50)) {
      console.warn(
        `🎵 [NowPlayingCoordinator] Large batch detected (${updateCount} updates), may impact performance`
      );
    }

    // Apply all updates atomically
    for (const update of this.pendingUpdates.values()) {
      try {
        root.style.setProperty(update.property, update.value);
      } catch (error) {
        console.error(
          `🎵 [NowPlayingCoordinator] Failed to apply ${update.property}:`,
          error
        );
      }
    }

    // Clear pending updates
    this.pendingUpdates.clear();
    this.isFlushScheduled = false;
    this.rafId = null;

    // Invoke callback after flush completion (Phase 2: Glass Convergence)
    if (this.config.onFlushComplete) {
      try {
        this.config.onFlushComplete();
      } catch (error) {
        console.error(
          "🎵 [NowPlayingCoordinator] Error in flush completion callback:",
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
        `[NowPlayingCoordinator] Flushed ${updateCount} updates in ${flushTime.toFixed(
          2
        )}ms`
      );
    }

    if (this.config.enableDebug && flushTime > 5) {
      console.warn(
        `🎵 [NowPlayingCoordinator] Slow flush detected: ${flushTime.toFixed(
          2
        )}ms for ${updateCount} updates`
      );
    }
  }

  /**
   * Phase 4: Setup DOM observation for reactive refresh
   */
  public setupDOMObservation(): void {
    if (this.domObserver) {
      return; // Already observing
    }

    this.nowPlayingElement = document.querySelector(
      MODERN_SELECTORS["nowPlayingBar"] as string
    );

    if (!this.nowPlayingElement) {
      if (this.config.enableDebug) {
        console.warn(
          "🎵 [NowPlayingCoordinator] Now playing bar not found, deferring DOM observation"
        );
      }

      // Retry after a short delay
      setTimeout(() => this.setupDOMObservation(), 1000);
      return;
    }

    this.domObserver = new MutationObserver(() => {
      // Force refresh when DOM structure changes
      this.queueUpdate("--sn-force-refresh", Date.now().toString());

      if (this.config.enableDebug) {
        console.log(
          "🎵 [NowPlayingCoordinator] DOM change detected, forcing refresh"
        );
      }
    });

    this.domObserver.observe(this.nowPlayingElement, {
      childList: true,
      subtree: true,
      attributes: false, // Only watch structure changes, not style changes
    });

    if (this.config.enableDebug) {
      console.log(
        "🎵 [NowPlayingCoordinator] DOM observation active on now playing bar"
      );
    }
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

    this.pendingUpdates.clear();
    this.isFlushScheduled = false;
    this.nowPlayingElement = null;

    if (NowPlayingCoordinator.instance === this) {
      NowPlayingCoordinator.instance = null;
    }

    if (this.config.enableDebug) {
      const avgFlushTime =
        this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0;
      console.log(
        `🎵 [NowPlayingCoordinator] Destroyed. Performance: ${
          this.flushCount
        } flushes, ${avgFlushTime.toFixed(2)}ms avg`
      );
    }
  }
}

/**
 * Global helper function for easy access
 */
export function getNowPlayingCoordinator(
  config?: CoordinatorConfig
): NowPlayingCoordinator {
  return NowPlayingCoordinator.getInstance(config);
}
