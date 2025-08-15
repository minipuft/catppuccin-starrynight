/**
 * Sidebar Performance Coordinator - Atomic CSS Variable Batching
 *
 * Atomically flushes all sidebar style updates at the next animation frame
 * to eliminate intra-frame skew and reduce visual jitter. Optimized for
 * sidebar element performance and extensible to multiple sidebar locations.
 */

import { unifiedEventBus } from "@/core/events/UnifiedEventBus";
import {
  OptimizedCSSVariableManager,
  getGlobalOptimizedCSSController,
} from "@/core/performance/OptimizedCSSVariableManager";
import { PerformanceBudgetManager } from "@/core/performance/PerformanceBudgetManager";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { MODERN_SELECTORS } from "@/debug/SpotifyDOMSelectors";

interface PendingUpdate {
  property: string;
  value: string;
  timestamp: number;
}

interface CoordinatorConfig {
  enableDebug?: boolean;
  maxBatchSize?: number;
  performanceAnalyzer?: SimplePerformanceCoordinator;
  onFlushComplete?: () => void;
}

export class SidebarPerformanceCoordinator {
  private static instance: SidebarPerformanceCoordinator | null = null;

  private pendingUpdates: Map<string, PendingUpdate> = new Map();
  private isFlushScheduled: boolean = false;
  private rafId: number | null = null;
  private config: CoordinatorConfig;
  private performanceAnalyzer: SimplePerformanceCoordinator | null = null;
  private cssController!: OptimizedCSSVariableManager;

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
  private budgetManager: PerformanceBudgetManager | null = null;

  // DOM observation for reactive refresh and temporal play
  private domObserver: MutationObserver | null = null;
  private sidebarElement: Element | null = null;
  private visibilityObserver: IntersectionObserver | null = null;
  private observationThrottleTimer: number | null = null;
  private lastObservationTime: number = 0;
  private readonly OBSERVATION_THROTTLE_MS = 200; // Throttle observations to 5 Hz for better performance
  private isFirstOpen: boolean = true;
  private lastScrollUpdate: number = 0;

  // Timeout tracking for proper cleanup
  private activeTimeouts: Set<NodeJS.Timeout> = new Set();
  private domObservationRetryTimeout: NodeJS.Timeout | null = null;

  // Event-driven coordination for music changes
  private musicChangeUnsubscribe: (() => void) | null = null;

  constructor(config: CoordinatorConfig = {}) {
    this.config = {
      enableDebug: config.enableDebug ?? false,
      maxBatchSize: config.maxBatchSize ?? 50,
      ...config,
    };

    this.performanceAnalyzer = config.performanceAnalyzer || null;

    // Initialize CSS coordination - use globalThis to access Year3000System
    const year3000System = (globalThis as any).year3000System;
    this.cssController = year3000System.getGlobalOptimizedCSSController();

    // Initialize budget manager if performance analyzer is available
    if (this.performanceAnalyzer) {
      this.budgetManager = PerformanceBudgetManager.getInstance(
        undefined,
        this.performanceAnalyzer
      );
    }

    if (this.config.enableDebug) {
      console.log(
        "🌌 [SidebarPerformanceCoordinator] Initialized with RAF-based batching"
      );
    }
  }

  /**
   * Singleton accessor for global coordination
   */
  public static getInstance(
    config?: CoordinatorConfig
  ): SidebarPerformanceCoordinator {
    if (!SidebarPerformanceCoordinator.instance) {
      SidebarPerformanceCoordinator.instance =
        new SidebarPerformanceCoordinator(config);
    }
    return SidebarPerformanceCoordinator.instance;
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
      // Critical variables are applied directly to the sidebar element
      this.applyCriticalUpdate(property, value);
      return;
    }

    // Delegate non-critical vars to global OptimizedCSSVariableManager for sync flush
    try {
      const cssController = getGlobalOptimizedCSSController();
      cssController.queueCSSVariableUpdate(
        property,
        value,
        this.getSidebarElement() as HTMLElement
      );
    } catch (error) {
      // Global CSS controller not available, use fallback
      this.pendingUpdates.set(property, {
        property,
        value,
        timestamp: performance.now(),
      });

      if (this.config.enableDebug && this.pendingUpdates.size === 1) {
        console.log(
          `🌌 [SidebarPerformanceCoordinator] Queuing first update (fallback): ${property}`
        );
      }

      this.scheduleFlush();
    }
  }

  /**
   * Apply critical updates immediately to the sidebar element
   */
  private applyCriticalUpdate(property: string, value: string): void {
    try {
      // Apply critical updates using coordination (high performance path)
      this.cssController.queueCSSVariableUpdate(
        property,
        value,
        null, // element (not needed for global variables)
        "critical", // Critical priority for performance-critical sidebar updates
        "sidebar-critical-update"
      );
    } catch (error) {
      console.error(
        `🌌 [SidebarPerformanceCoordinator] Failed to apply critical ${property}:`,
        error
      );
    }
  }

  /**
   * Get the sidebar element with fallback to document root
   * Extensible to support multiple sidebar locations in the future
   */
  private getSidebarElement(): Element {
    if (!this.sidebarElement) {
      // Try right sidebar first (current primary target)
      this.sidebarElement = document.querySelector(
        MODERN_SELECTORS.rightSidebar as string
      );

      // Could be extended in the future to support left sidebar:
      // if (!this.sidebarElement) {
      //   this.sidebarElement = document.querySelector(MODERN_SELECTORS.leftSidebar);
      // }
    }

    // Fallback to document root if sidebar not found
    return this.sidebarElement || document.documentElement;
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
    const targetElement = this.getSidebarElement();
    const updateCount = this.pendingUpdates.size;

    if (this.config.enableDebug) {
      console.log(
        `🌌 [SidebarPerformanceCoordinator] Flushing ${updateCount} updates atomically`
      );
    }

    // Performance guard - if too many updates, batch them differently
    if (updateCount > (this.config.maxBatchSize || 50)) {
      console.warn(
        `🌌 [SidebarPerformanceCoordinator] Large batch detected (${updateCount} updates), may impact performance`
      );
    }

    // Apply all updates atomically using coordination with harmonic mapping
    try {
      // Prepare batched variables for sidebar element
      const sidebarVariables: Record<string, string> = {};
      const globalHarmonicVariables: Record<string, string> = {};

      for (const update of this.pendingUpdates.values()) {
        // Add to sidebar batch
        sidebarVariables[update.property] = update.value;

        // Check for global harmonic mapping
        const harmonicVar = this.harmonicVariableMap.get(update.property);
        if (harmonicVar) {
          globalHarmonicVariables[harmonicVar] = update.value;

          if (this.config.enableDebug) {
            console.log(
              `🌌 [SidebarPerformanceCoordinator] Mapped ${update.property} → ${harmonicVar} = ${update.value}`
            );
          }
        }
      }

      // Apply sidebar variables directly to sidebar element (atomic batching requirement)
      if (Object.keys(sidebarVariables).length > 0) {
        const sidebarElement = targetElement as HTMLElement;
        for (const [property, value] of Object.entries(sidebarVariables)) {
          sidebarElement.style.setProperty(property, value);
        }
      }

      // Apply global harmonic variables using coordination (targeting document root)
      if (Object.keys(globalHarmonicVariables).length > 0) {
        this.cssController.batchSetVariables(
          "SidebarPerformanceCoordinator",
          globalHarmonicVariables,
          "high", // High priority for harmonic variable mapping
          "harmonic-variable-mapping"
        );
      }
    } catch (error) {
      console.error(
        `🌌 [SidebarPerformanceCoordinator] Failed to apply batched updates:`,
        error
      );
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
          "🌌 [SidebarPerformanceCoordinator] Error in flush completion callback:",
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
        `[SidebarPerformanceCoordinator] Flushed ${updateCount} updates in ${flushTime.toFixed(
          2
        )}ms`
      );
    }

    // Performance validation as specified (warn if average flush > 3ms)
    const avgFlushTime =
      this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0;
    if (avgFlushTime > 3) {
      console.warn(
        `🌌 [SidebarPerformanceCoordinator] Performance threshold exceeded: average ${avgFlushTime.toFixed(
          2
        )}ms per flush (target: <3ms)`
      );
    }

    if (this.config.enableDebug && flushTime > 4) {
      console.warn(
        `🌌 [SidebarPerformanceCoordinator] Slow flush detected: ${flushTime.toFixed(
          2
        )}ms for ${updateCount} updates`
      );
    }
  }

  /**
   * Setup event-driven music change coordination
   * This replaces pure DOM watching to prevent cascade loops
   */
  private setupMusicChangeCoordination(): void {
    if (this.musicChangeUnsubscribe) {
      return; // Already subscribed
    }

    this.musicChangeUnsubscribe = () => {
      unifiedEventBus.unsubscribeAll("SidebarPerformanceCoordinator");
    };

    unifiedEventBus.subscribe(
      "music:track-changed",
      (data) => {
        // Handle music change event without triggering DOM mutation cascades
        this.handleMusicChange({
          timestamp: data.timestamp,
          source: "track-changed",
          reason: "music:track-changed event",
        });
      },
      "SidebarPerformanceCoordinator"
    );

    if (this.config.enableDebug) {
      console.log(
        "🌌 [SidebarPerformanceCoordinator] Event-driven music coordination active"
      );
    }
  }

  /**
   * Handle music change events from the global event bus
   */
  private handleMusicChange(eventData: {
    timestamp: number;
    source: string;
    reason: string;
  }): void {
    // Process music change without causing DOM mutation cascade
    // Only trigger visibility check and smooth effects
    if (this.sidebarElement) {
      this.handleVisibilityChange();

      if (this.config.enableDebug) {
        console.log(
          "🌌 [SidebarPerformanceCoordinator] Music change coordinated via event",
          {
            source: eventData.source,
            reason: eventData.reason,
            timestamp: eventData.timestamp,
          }
        );
      }
    }
  }

  /**
   * Setup DOM observation for reactive refresh and temporal play
   */
  public setupDOMObservation(): void {
    if (this.domObserver) {
      return; // Already observing
    }

    // Setup event-driven music change coordination first
    this.setupMusicChangeCoordination();

    this.sidebarElement = document.querySelector(
      MODERN_SELECTORS.rightSidebar as string
    );

    if (!this.sidebarElement) {
      if (this.config.enableDebug) {
        console.warn(
          "🌌 [SidebarPerformanceCoordinator] Sidebar not found, deferring DOM observation"
        );
      }

      // Clear any existing retry timeout
      if (this.domObservationRetryTimeout) {
        clearTimeout(this.domObservationRetryTimeout);
        this.activeTimeouts.delete(this.domObservationRetryTimeout);
      }

      // Retry after a short delay
      this.domObservationRetryTimeout = setTimeout(() => {
        this.setupDOMObservation();
        this.domObservationRetryTimeout = null;
      }, 1000);
      this.activeTimeouts.add(this.domObservationRetryTimeout);
      return;
    }

    // Mutation observer for structural changes (throttled for performance)
    this.domObserver = new MutationObserver((mutations) => {
      // Filter mutations to only process relevant changes
      const relevantMutations = mutations.filter((mutation) =>
        this.isRelevantMutation(mutation)
      );

      if (relevantMutations.length === 0) {
        return; // Skip throttled update if no relevant changes
      }

      this.throttleObservationUpdate(() => {
        // Check for visibility changes (aria-hidden, style.display)
        for (const mutation of relevantMutations) {
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
            "🌌 [SidebarPerformanceCoordinator] Relevant DOM change detected - visibility/structure only",
            {
              mutationCount: relevantMutations.length,
              types: relevantMutations.map((m) => m.type),
            }
          );
        }
      });
    });

    this.domObserver.observe(this.sidebarElement, {
      childList: true,
      subtree: false, // Optimize: Only observe direct children to reduce mutation volume
      attributes: true, // Watch for visibility and style changes
      attributeFilter: ["aria-hidden", "style", "class"], // Only observe attributes we care about
      attributeOldValue: false, // Optimize: Don't observe attribute old values
      characterData: false, // Don't observe text changes
    });

    // Intersection observer for visibility changes
    this.setupVisibilityObserver();

    // Setup scroll throttling for queue lists
    this.setupScrollObservation();

    if (this.config.enableDebug) {
      console.log(
        "🌌 [SidebarPerformanceCoordinator] DOM observation active on sidebar"
      );
    }
  }

  /**
   * Setup visibility observer for temporal echo effects
   */
  private setupVisibilityObserver(): void {
    if (!this.sidebarElement || this.visibilityObserver) return;

    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && this.isFirstOpen) {
          // Use requestIdleCallback for non-critical visual effects
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              this.triggerTemporalEcho();
              this.isFirstOpen = false;
            });
          } else {
            // Fallback with setTimeout for older browsers
            setTimeout(() => {
              this.triggerTemporalEcho();
              this.isFirstOpen = false;
            }, 0);
          }
        }
      },
      { threshold: 0.1 }
    );

    this.visibilityObserver.observe(this.sidebarElement);
  }

  /**
   * Setup scroll observation with throttling for performance
   */
  private setupScrollObservation(): void {
    if (!this.sidebarElement) return;

    const queueElement = this.sidebarElement.querySelector(
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
      window.requestIdleCallback(
        () => {
          this.queueUpdate("--sn-rs-scroll-ratio", Math.random().toString());
        },
        { timeout: 100 }
      ); // Add timeout to ensure execution
    } else {
      this.queueUpdate("--sn-rs-scroll-ratio", Math.random().toString());
    }
  }

  /**
   * Filter mutations to only process changes that actually affect UI structure or visibility
   * Prevents cascade loops from CSS variable updates and other non-visual changes
   */
  private isRelevantMutation(mutation: MutationRecord): boolean {
    // Handle attribute changes - only care about visibility and layout attributes
    if (mutation.type === "attributes") {
      const attrName = mutation.attributeName;

      // Always respond to visibility changes
      if (attrName === "aria-hidden" || attrName === "style") {
        return true;
      }

      // Respond to class changes that might affect layout/visibility
      if (attrName === "class") {
        return true;
      }

      // Ignore CSS custom property changes (these cause cascade loops)
      if (attrName?.startsWith("--") || attrName === "data-style") {
        return false;
      }

      return false; // Ignore other attribute changes
    }

    // Handle structural changes - always relevant for sidebar content
    if (mutation.type === "childList") {
      // Check if actual elements were added/removed (not just text nodes)
      const hasElementChanges =
        (mutation.addedNodes &&
          Array.from(mutation.addedNodes).some(
            (node) => node.nodeType === Node.ELEMENT_NODE
          )) ||
        (mutation.removedNodes &&
          Array.from(mutation.removedNodes).some(
            (node) => node.nodeType === Node.ELEMENT_NODE
          ));

      return hasElementChanges;
    }

    return false; // Ignore other mutation types
  }

  /**
   * Throttle DOM observation updates to reduce CPU overhead
   */
  private throttleObservationUpdate(callback: () => void): void {
    const now = performance.now();
    if (now - this.lastObservationTime < this.OBSERVATION_THROTTLE_MS) {
      // Clear existing throttle timer
      if (this.observationThrottleTimer) {
        clearTimeout(this.observationThrottleTimer);
      }

      // Schedule update for later
      this.observationThrottleTimer = window.setTimeout(() => {
        callback();
        this.lastObservationTime = performance.now();
        this.observationThrottleTimer = null;
      }, this.OBSERVATION_THROTTLE_MS);
    } else {
      // Execute immediately
      callback();
      this.lastObservationTime = now;
    }
  }

  /**
   * Handle visibility changes for temporal effects
   */
  private handleVisibilityChange(): void {
    if (!this.sidebarElement) return;

    const isVisible =
      !this.sidebarElement.hasAttribute("aria-hidden") &&
      !(this.sidebarElement as HTMLElement).style.display?.includes("none");

    if (isVisible && this.isFirstOpen) {
      this.triggerTemporalEcho();
      this.isFirstOpen = false;
    }

    if (this.config.enableDebug) {
      console.log(
        `🌌 [SidebarPerformanceCoordinator] Visibility changed: ${
          isVisible ? "visible" : "hidden"
        }`
      );
    }
  }

  /**
   * Trigger one-time temporal echo effect
   */
  private triggerTemporalEcho(): void {
    if (!this.sidebarElement) return;

    // Add temporal echo class for 3-layer effect
    this.sidebarElement.classList.add("sn-future-preview");

    // Set temporal variables
    this.queueUpdate("--sn-kinetic-intensity", "1");
    this.queueUpdate("--sn-echo-hue-shift", "15deg");
    this.queueUpdate("--sn-echo-radius-multiplier", "1.2");

    if (this.config.enableDebug) {
      console.log(
        "🌌 [SidebarPerformanceCoordinator] Triggering temporal echo effect"
      );
    }

    // Clean up after animation
    const cleanupTimeout = setTimeout(() => {
      this.sidebarElement?.classList.remove("sn-future-preview");
      this.queueUpdate("--sn-kinetic-intensity", "0");
      this.activeTimeouts.delete(cleanupTimeout);
    }, 2000);
    this.activeTimeouts.add(cleanupTimeout);
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

    // Clear all active timeouts
    this.activeTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.activeTimeouts.clear();

    // Clear specific tracked timeouts
    if (this.domObservationRetryTimeout) {
      clearTimeout(this.domObservationRetryTimeout);
      this.domObservationRetryTimeout = null;
    }

    // Clear observation throttle timer
    if (this.observationThrottleTimer) {
      clearTimeout(this.observationThrottleTimer);
      this.observationThrottleTimer = null;
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }

    if (this.visibilityObserver) {
      this.visibilityObserver.disconnect();
      this.visibilityObserver = null;
    }

    // Clean up event subscription
    if (this.musicChangeUnsubscribe) {
      this.musicChangeUnsubscribe();
      this.musicChangeUnsubscribe = null;
    }

    this.pendingUpdates.clear();
    this.isFlushScheduled = false;
    this.sidebarElement = null;

    if (SidebarPerformanceCoordinator.instance === this) {
      SidebarPerformanceCoordinator.instance = null;
    }

    if (this.config.enableDebug) {
      const avgFlushTime =
        this.flushCount > 0 ? this.totalFlushTime / this.flushCount : 0;
      console.log(
        `🌌 [SidebarPerformanceCoordinator] Destroyed. Performance: ${
          this.flushCount
        } flushes, ${avgFlushTime.toFixed(2)}ms avg`
      );
    }
  }
}

/**
 * Global helper function for easy access
 */
export function getSidebarPerformanceCoordinator(
  config?: CoordinatorConfig
): SidebarPerformanceCoordinator {
  return SidebarPerformanceCoordinator.getInstance(config);
}
