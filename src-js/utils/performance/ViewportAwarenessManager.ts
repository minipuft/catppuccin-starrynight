/**
 * ViewportAwarenessManager - Intelligent viewport detection and visibility optimization
 * 
 * Provides efficient viewport awareness for Year 3000 System components to avoid
 * unnecessary updates when elements are not visible. Uses Intersection Observer
 * with configurable thresholds for optimal performance.
 */

export interface ViewportOptions {
  /** Threshold for considering element "visible" (0-1) */
  visibilityThreshold?: number;
  /** Root margin for intersection detection */
  rootMargin?: string;
  /** Whether to track visibility of the root element itself */
  trackRootElement?: boolean;
  /** Custom root element selector (defaults to viewport) */
  rootSelector?: string;
}

export interface VisibilityState {
  isVisible: boolean;
  intersectionRatio: number;
  lastVisibilityChange: number;
  element: Element;
}

export type VisibilityChangeCallback = (state: VisibilityState) => void;

/**
 * Manages viewport awareness for performance optimization
 */
export class ViewportAwarenessManager {
  private static instance: ViewportAwarenessManager;
  private observers = new Map<string, IntersectionObserver>();
  private trackedElements = new Map<Element, {
    callback: VisibilityChangeCallback;
    options: ViewportOptions;
    state: VisibilityState;
  }>();
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof IntersectionObserver !== 'undefined';
    
    if (!this.isSupported) {
      console.warn('[ViewportAwarenessManager] IntersectionObserver not supported, falling back to always-visible behavior');
    }
  }

  public static getInstance(): ViewportAwarenessManager {
    if (!ViewportAwarenessManager.instance) {
      ViewportAwarenessManager.instance = new ViewportAwarenessManager();
    }
    return ViewportAwarenessManager.instance;
  }

  /**
   * Track an element's visibility with callback
   */
  public trackElement(
    element: Element,
    callback: VisibilityChangeCallback,
    options: ViewportOptions = {}
  ): () => void {
    if (!this.isSupported) {
      // Fallback: assume always visible
      const fallbackState: VisibilityState = {
        isVisible: true,
        intersectionRatio: 1,
        lastVisibilityChange: Date.now(),
        element
      };
      callback(fallbackState);
      return () => {}; // No-op unsubscribe
    }

    const opts = {
      visibilityThreshold: 0.1,
      rootMargin: '50px',
      trackRootElement: false,
      ...options
    };

    const observerKey = this.getObserverKey(opts);
    let observer = this.observers.get(observerKey);

    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => this.handleIntersectionChanges(entries),
        {
          threshold: opts.visibilityThreshold,
          rootMargin: opts.rootMargin,
          root: opts.rootSelector ? document.querySelector(opts.rootSelector) : null
        }
      );
      this.observers.set(observerKey, observer);
    }

    // Initialize visibility state
    const initialState: VisibilityState = {
      isVisible: false, // Will be updated by intersection callback
      intersectionRatio: 0,
      lastVisibilityChange: Date.now(),
      element
    };

    this.trackedElements.set(element, {
      callback,
      options: opts,
      state: initialState
    });

    observer.observe(element);

    // Return unsubscribe function
    return () => this.untrackElement(element);
  }

  /**
   * Check if an element is currently visible
   */
  public isElementVisible(element: Element): boolean {
    const tracked = this.trackedElements.get(element);
    return tracked?.state.isVisible ?? true; // Default to visible if not tracked
  }

  /**
   * Get current visibility state for an element
   */
  public getVisibilityState(element: Element): VisibilityState | null {
    return this.trackedElements.get(element)?.state ?? null;
  }

  /**
   * Stop tracking an element
   */
  public untrackElement(element: Element): void {
    const tracked = this.trackedElements.get(element);
    if (!tracked) return;

    // Find the observer that was tracking this element
    const observerKey = this.getObserverKey(tracked.options);
    const observer = this.observers.get(observerKey);
    
    if (observer) {
      observer.unobserve(element);
    }

    this.trackedElements.delete(element);
  }

  /**
   * Track viewport visibility of the main Spotify container
   */
  public trackSpotifyContainer(callback: VisibilityChangeCallback): () => void {
    const spotifySelectors = [
      '.Root__main-view',
      '[data-testid="topbar"]',
      '.main-view-container',
      '#main'
    ];

    let element: Element | null = null;
    for (const selector of spotifySelectors) {
      element = document.querySelector(selector);
      if (element) break;
    }

    if (!element) {
      console.warn('[ViewportAwarenessManager] Could not find Spotify main container, using document.body');
      element = document.body;
    }

    return this.trackElement(element, callback, {
      visibilityThreshold: 0.1,
      rootMargin: '0px',
      trackRootElement: true
    });
  }

  /**
   * Bulk check visibility of multiple elements
   */
  public checkBulkVisibility(elements: Element[]): Map<Element, boolean> {
    const results = new Map<Element, boolean>();
    
    for (const element of elements) {
      results.set(element, this.isElementVisible(element));
    }
    
    return results;
  }

  /**
   * Cleanup all observers and tracked elements
   */
  public destroy(): void {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.trackedElements.clear();
  }

  private handleIntersectionChanges(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      const tracked = this.trackedElements.get(entry.target);
      if (!tracked) continue;

      const wasVisible = tracked.state.isVisible;
      const isNowVisible = entry.isIntersecting;

      // Update state
      tracked.state = {
        isVisible: isNowVisible,
        intersectionRatio: entry.intersectionRatio,
        lastVisibilityChange: wasVisible !== isNowVisible ? Date.now() : tracked.state.lastVisibilityChange,
        element: entry.target
      };

      // Only trigger callback if visibility actually changed
      if (wasVisible !== isNowVisible) {
        try {
          tracked.callback(tracked.state);
        } catch (error) {
          console.error('[ViewportAwarenessManager] Error in visibility callback:', error);
        }
      }
    }
  }

  private getObserverKey(options: ViewportOptions): string {
    return `${options.visibilityThreshold}-${options.rootMargin}-${options.rootSelector || 'viewport'}`;
  }
}

// Export singleton instance
export const ViewportManager = ViewportAwarenessManager.getInstance();