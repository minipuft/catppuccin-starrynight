/**
 * LoadingStateService
 *
 * Phase 8.5: Active loading state management system
 * Coordinates with unified shimmer system to provide sophisticated loading UX
 *
 * @implements {IManagedSystem}
 * @description Automatically detects Spotify loading indicators and applies
 *              context-aware loading states with Year3000 visual effects
 */

import { IManagedSystem, HealthCheckResult } from '@/types/systems';

export interface LoadingStateConfig {
  enableLoadingAnimations: boolean;
  enableGrainTexture: boolean;
  enableMusicSync: boolean;
  intensity: 'subtle' | 'normal' | 'intense';
  performanceMode: boolean;
}

interface LoadingContext {
  type: 'playlist' | 'artist' | 'search' | 'home' | 'default';
  element: Element;
  appliedAt: number;
}

export class LoadingStateService implements IManagedSystem {
  public initialized: boolean = false;

  private observer: MutationObserver | null = null;
  private loadingElements: WeakSet<Element> = new WeakSet();
  private activeContexts: Map<Element, LoadingContext> = new Map();

  private config: LoadingStateConfig = {
    enableLoadingAnimations: true,
    enableGrainTexture: true,
    enableMusicSync: false,
    intensity: 'normal',
    performanceMode: false
  };

  // Performance tracking
  private detectionCount: number = 0;
  private applicationCount: number = 0;
  private lastPerformanceCheck: number = Date.now();

  // Context detection selectors
  private readonly CONTEXT_SELECTORS = {
    playlist: [
      '.main-entityHeader-container[data-testid="playlist-header"]',
      '.main-trackList-trackListRow',
      '[data-testid="playlist-tracklist"]'
    ],
    artist: [
      '.main-entityHeader-container[data-testid="artist-header"]',
      '[data-testid="artist-page"]'
    ],
    search: [
      '[data-testid="search-page"]',
      '.main-searchSection-searchSection'
    ],
    home: [
      '[data-testid="home-page"]',
      '.main-home-content'
    ]
  };

  // Spotify loading indicator patterns
  private readonly LOADING_INDICATORS = [
    '[aria-busy="true"]',
    '.loading-indicator',
    '.skeleton-loader',
    '[data-testid*="loading"]',
    '.main-skeleton-skeletonLoader'
  ];

  constructor(config?: Partial<LoadingStateConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Initialize the loading state service
   * Sets up DOM mutation observer and applies initial state detection
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Verify DOM is ready
      if (!document.body) {
        throw new Error('DOM not ready - cannot initialize LoadingStateService');
      }

      // Create mutation observer
      this.observer = new MutationObserver((mutations) => {
        this.handleMutations(mutations);
      });

      // Start observing
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-busy', 'class', 'data-testid']
      });

      // Initial scan for existing loading states
      this.performInitialScan();

      this.initialized = true;
      console.log('[LoadingStateService] Initialized successfully');
    } catch (error) {
      console.error('[LoadingStateService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Update animation states (called each frame by SystemIntegrationCoordinator)
   */
  public updateAnimation(deltaTime: number): void {
    if (!this.initialized || !this.config.enableLoadingAnimations) return;

    // Periodic cleanup of stale loading states (every 5 seconds)
    const now = Date.now();
    if (now - this.lastPerformanceCheck > 5000) {
      this.cleanupStaleStates();
      this.lastPerformanceCheck = now;
    }
  }

  /**
   * Perform health check on the service
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.initialized && this.observer !== null;

    const statusDetails = [
      `Initialized: ${this.initialized}`,
      `Observer active: ${this.observer !== null}`,
      `Active contexts: ${this.activeContexts.size}`,
      `Detection count: ${this.detectionCount}`,
      `Application count: ${this.applicationCount}`,
      `Config: ${JSON.stringify(this.config)}`
    ].join(', ');

    return {
      system: 'LoadingStateService',
      healthy: isHealthy,
      ok: isHealthy,
      details: statusDetails,
      metrics: {
        initialized: this.initialized,
        isActive: this.observer !== null,
        totalOperations: this.detectionCount + this.applicationCount,
        activeLoadingStates: this.activeContexts.size
      }
    };
  }

  /**
   * Cleanup and destroy the service
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove all applied loading states
    this.activeContexts.forEach((context, element) => {
      this.removeLoadingState(element);
    });

    this.activeContexts.clear();
    this.loadingElements = new WeakSet();
    this.initialized = false;

    console.log('[LoadingStateService] Destroyed');
  }

  /**
   * Update service configuration
   */
  public updateConfig(config: Partial<LoadingStateConfig>): void {
    this.config = { ...this.config, ...config };

    // If animations disabled, remove all current loading states
    if (!this.config.enableLoadingAnimations) {
      this.activeContexts.forEach((_, element) => {
        this.removeLoadingState(element);
      });
      this.activeContexts.clear();
    }
  }

  /**
   * Handle DOM mutations from MutationObserver
   */
  private handleMutations(mutations: MutationRecord[]): void {
    // Performance budget: limit processing to 10ms per frame
    const startTime = performance.now();
    const budget = this.config.performanceMode ? 5 : 10;

    for (const mutation of mutations) {
      // Check performance budget
      if (performance.now() - startTime > budget) break;

      if (mutation.type === 'attributes') {
        this.handleAttributeChange(mutation);
      } else if (mutation.type === 'childList') {
        this.handleChildListChange(mutation);
      }
    }

    this.detectionCount++;
  }

  /**
   * Handle attribute changes (aria-busy, class, data-testid)
   */
  private handleAttributeChange(mutation: MutationRecord): void {
    const element = mutation.target as Element;

    // Check for loading indicators
    const isLoading = this.isElementLoading(element);

    if (isLoading && !this.loadingElements.has(element)) {
      const context = this.detectContext(element);
      this.applyLoadingState(element, context);
    } else if (!isLoading && this.loadingElements.has(element)) {
      this.removeLoadingState(element);
    }
  }

  /**
   * Handle child list changes (new elements added)
   */
  private handleChildListChange(mutation: MutationRecord): void {
    // Check added nodes for loading indicators
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const element = node as Element;
      if (this.isElementLoading(element)) {
        const context = this.detectContext(element);
        this.applyLoadingState(element, context);
      }

      // Check child elements
      const loadingChildren = element.querySelectorAll(this.LOADING_INDICATORS.join(', '));
      loadingChildren.forEach((child) => {
        if (!this.loadingElements.has(child)) {
          const context = this.detectContext(child);
          this.applyLoadingState(child, context);
        }
      });
    });
  }

  /**
   * Perform initial scan of DOM for existing loading states
   */
  private performInitialScan(): void {
    const loadingElements = document.querySelectorAll(this.LOADING_INDICATORS.join(', '));

    loadingElements.forEach((element) => {
      const context = this.detectContext(element);
      this.applyLoadingState(element, context);
    });
  }

  /**
   * Check if element has loading indicators
   * CRITICAL: Only check for Spotify's native loading indicators, NOT our applied classes
   * to avoid circular logic that prevents cleanup
   */
  private isElementLoading(element: Element): boolean {
    // Check aria-busy attribute (Spotify's primary loading indicator)
    if (element.getAttribute('aria-busy') === 'true') return true;

    // Check for Spotify's native loading classes
    // IMPORTANT: Do NOT check for 'loading-state' class - that's what we apply!
    const classList = element.classList;
    if (classList.contains('skeleton-loader') ||
        classList.contains('loading-indicator') ||
        classList.contains('main-skeleton-skeletonLoader')) {
      return true;
    }

    // Check data-testid for Spotify's loading indicators
    const testId = element.getAttribute('data-testid');
    if (testId && testId.includes('loading')) return true;

    return false;
  }

  /**
   * Detect UI context for context-aware loading styles
   */
  private detectContext(element: Element): 'playlist' | 'artist' | 'search' | 'home' | 'default' {
    // Check element and ancestors for context indicators
    let current: Element | null = element;

    while (current && current !== document.body) {
      // Check playlist context
      if (this.CONTEXT_SELECTORS.playlist.some(sel => current!.matches(sel))) {
        return 'playlist';
      }

      // Check artist context
      if (this.CONTEXT_SELECTORS.artist.some(sel => current!.matches(sel))) {
        return 'artist';
      }

      // Check search context
      if (this.CONTEXT_SELECTORS.search.some(sel => current!.matches(sel))) {
        return 'search';
      }

      // Check home context
      if (this.CONTEXT_SELECTORS.home.some(sel => current!.matches(sel))) {
        return 'home';
      }

      current = current.parentElement;
    }

    return 'default';
  }

  /**
   * Apply loading state with context-aware styling
   */
  private applyLoadingState(element: Element, context: 'playlist' | 'artist' | 'search' | 'home' | 'default'): void {
    if (!this.config.enableLoadingAnimations) return;

    // Add loading state class
    element.classList.add('loading-state');

    // Add context-specific class
    element.classList.add(`loading-context-${context}`);

    // Add intensity class
    element.classList.add(`loading-intensity-${this.config.intensity}`);

    // Add optional feature classes
    if (this.config.enableGrainTexture) {
      element.classList.add('loading-grain-texture');
    }

    if (this.config.enableMusicSync) {
      element.classList.add('loading-music-sync');
    }

    // Track state
    this.loadingElements.add(element);
    this.activeContexts.set(element, {
      type: context,
      element: element,
      appliedAt: Date.now()
    });

    this.applicationCount++;
  }

  /**
   * Remove loading state from element
   */
  private removeLoadingState(element: Element): void {
    element.classList.remove(
      'loading-state',
      'loading-context-playlist',
      'loading-context-artist',
      'loading-context-search',
      'loading-context-home',
      'loading-context-default',
      'loading-intensity-subtle',
      'loading-intensity-normal',
      'loading-intensity-intense',
      'loading-grain-texture',
      'loading-music-sync'
    );

    this.activeContexts.delete(element);
  }

  /**
   * Cleanup stale loading states (elements removed from DOM or no longer loading)
   */
  private cleanupStaleStates(): void {
    const now = Date.now();
    const staleThreshold = 30000; // 30 seconds

    this.activeContexts.forEach((context, element) => {
      // Check if element still in DOM
      if (!document.body.contains(element)) {
        this.activeContexts.delete(element);
        return;
      }

      // Check if still loading
      if (!this.isElementLoading(element)) {
        this.removeLoadingState(element);
        return;
      }

      // Check for stale states (applied >30s ago)
      if (now - context.appliedAt > staleThreshold) {
        this.removeLoadingState(element);
      }
    });
  }

  /**
   * Get current service statistics
   */
  public getStatistics() {
    return {
      initialized: this.initialized,
      activeContexts: this.activeContexts.size,
      detectionCount: this.detectionCount,
      applicationCount: this.applicationCount,
      config: this.config
    };
  }
}
