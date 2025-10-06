/**
 * ViewportAwareSystem - Base class for visual systems that should optimize based on viewport visibility
 * 
 * Extends the standard IManagedSystem interface with automatic viewport awareness.
 * Systems extending this class will automatically pause expensive operations when not visible.
 * Integrates with the existing UnifiedEventBus for optimal performance.
 */

import { ViewportManager, type VisibilityState, type ViewportOptions } from "@/utils/performance/ViewportAwarenessManager";
import { unifiedEventBus, type EventHandler } from "@/core/events/EventBus";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";

export interface ViewportSystemOptions extends ViewportOptions {
  /** Whether to automatically pause animations when not visible */
  pauseAnimationsWhenHidden?: boolean;
  /** Whether to automatically pause setting updates when not visible */
  pauseSettingsUpdatesWhenHidden?: boolean;
  /** Custom selector for the element to track (defaults to main container) */
  trackingSelector?: string;
  /** Delay before resuming operations after becoming visible (ms) */
  resumeDelay?: number;
}

/**
 * Abstract base class for viewport-aware visual systems
 */
export abstract class ViewportAwareSystem implements IManagedSystem {
  public initialized = false;
  protected isVisible = true; // Default to visible until we know otherwise
  protected visibilityState: VisibilityState | null = null;
  protected viewportOptions: ViewportSystemOptions;
  protected untrackViewport?: () => void;
  protected resumeTimeoutId?: number;
  protected settingsSubscriptionId?: string;
  
  private animationsPaused = false;
  private settingsUpdatesPaused = false;

  constructor(options: ViewportSystemOptions = {}) {
    this.viewportOptions = {
      visibilityThreshold: 0.1,
      rootMargin: '50px',
      pauseAnimationsWhenHidden: true,
      pauseSettingsUpdatesWhenHidden: true,
      resumeDelay: 100,
      ...options
    };
  }

  public async initialize(): Promise<void> {
    await this.initializeViewportTracking();
    await this.initializeEventSubscriptions();
    await this.initializeSystem();
    this.initialized = true;
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const systemHealth = await this.performHealthCheck();
    
    return {
      ...systemHealth,
      details: `${systemHealth.details} | Viewport: ${this.isVisible ? 'visible' : 'hidden'}`
    };
  }

  public updateAnimation(deltaTime: number): void {
    if (this.shouldSkipAnimationUpdate()) {
      return;
    }
    
    this.performAnimationUpdate(deltaTime);
  }

  public destroy(): void {
    this.cleanupViewportTracking();
    this.cleanupEventSubscriptions();
    this.performDestroy();
  }

  /**
   * Handle settings changes with viewport awareness
   */
  protected handleSettingsChange(event: Event): void {
    if (this.shouldSkipSettingsUpdate()) {
      return;
    }
    
    this.performSettingsUpdate(event);
  }

  /**
   * Force a repaint/update regardless of visibility
   */
  public forceRepaint?(reason?: string): void {
    this.performForceRepaint?.(reason);
  }

  // Abstract methods that subclasses must implement
  protected abstract initializeSystem(): Promise<void>;
  protected abstract performHealthCheck(): Promise<HealthCheckResult>;
  protected abstract performAnimationUpdate(deltaTime: number): void;
  protected abstract performDestroy(): void;
  protected abstract performSettingsUpdate(event: Event): void;
  protected performForceRepaint?(reason?: string): void;

  // Optional hooks for viewport awareness
  protected onVisibilityChanged(state: VisibilityState): void {
    // Override in subclasses for custom behavior
  }

  protected onBecomingVisible(): void {
    // Override in subclasses for custom behavior when becoming visible
  }

  protected onBecomingHidden(): void {
    // Override in subclasses for custom behavior when becoming hidden
  }

  private async initializeViewportTracking(): Promise<void> {
    let targetElement: Element | null = null;

    if (this.viewportOptions.trackingSelector) {
      targetElement = document.querySelector(this.viewportOptions.trackingSelector);
    }

    if (!targetElement) {
      // Use Spotify container tracking
      this.untrackViewport = ViewportManager.trackSpotifyContainer(
        (state) => this.handleVisibilityChange(state)
      );
    } else {
      this.untrackViewport = ViewportManager.trackElement(
        targetElement,
        (state) => this.handleVisibilityChange(state),
        this.viewportOptions
      );
    }
  }

  private async initializeEventSubscriptions(): Promise<void> {
    // Subscribe to settings changes using the type-safe UnifiedEventBus
    this.settingsSubscriptionId = unifiedEventBus.subscribe(
      'settings:changed',
      (data) => this.handleUnifiedSettingsChange(data),
      `ViewportAwareSystem-${this.constructor.name}`
    );
  }

  private cleanupEventSubscriptions(): void {
    if (this.settingsSubscriptionId) {
      unifiedEventBus.unsubscribe(this.settingsSubscriptionId);
      delete this.settingsSubscriptionId;
    }
  }

  private handleUnifiedSettingsChange(data: { settingKey: string; oldValue: any; newValue: any; timestamp: number }): void {
    if (this.shouldSkipSettingsUpdate()) {
      return;
    }
    
    // Convert to legacy event format for backward compatibility
    const legacyEvent = new CustomEvent('year3000SystemSettingsChanged', {
      detail: { key: data.settingKey, value: data.newValue }
    });
    
    this.performSettingsUpdate(legacyEvent);
  }

  private handleVisibilityChange(state: VisibilityState): void {
    const wasVisible = this.isVisible;
    this.isVisible = state.isVisible;
    this.visibilityState = state;

    // Handle visibility changes
    if (!wasVisible && this.isVisible) {
      this.handleBecomingVisible();
    } else if (wasVisible && !this.isVisible) {
      this.handleBecomingHidden();
    }

    // Call the hook
    this.onVisibilityChanged(state);
  }

  private handleBecomingVisible(): void {
    // Clear any pending resume timeout
    if (this.resumeTimeoutId) {
      clearTimeout(this.resumeTimeoutId);
    }

    // Resume operations after a short delay to avoid rapid on/off cycles
    this.resumeTimeoutId = window.setTimeout(() => {
      this.animationsPaused = false;
      this.settingsUpdatesPaused = false;
      this.onBecomingVisible();
    }, this.viewportOptions.resumeDelay || 100);
  }

  private handleBecomingHidden(): void {
    // Immediately pause operations
    if (this.viewportOptions.pauseAnimationsWhenHidden) {
      this.animationsPaused = true;
    }
    if (this.viewportOptions.pauseSettingsUpdatesWhenHidden) {
      this.settingsUpdatesPaused = true;
    }
    
    this.onBecomingHidden();
  }

  private shouldSkipAnimationUpdate(): boolean {
    return this.animationsPaused || (!this.isVisible && (this.viewportOptions.pauseAnimationsWhenHidden ?? true));
  }

  private shouldSkipSettingsUpdate(): boolean {
    return this.settingsUpdatesPaused || (!this.isVisible && (this.viewportOptions.pauseSettingsUpdatesWhenHidden ?? true));
  }

  private cleanupViewportTracking(): void {
    if (this.untrackViewport) {
      this.untrackViewport();
      delete this.untrackViewport;
    }

    if (this.resumeTimeoutId) {
      clearTimeout(this.resumeTimeoutId);
      delete this.resumeTimeoutId;
    }
  }

  /**
   * Get current visibility information for debugging
   */
  protected getVisibilityInfo(): {
    isVisible: boolean;
    animationsPaused: boolean;
    settingsUpdatesPaused: boolean;
    intersectionRatio?: number;
  } {
    return {
      isVisible: this.isVisible,
      animationsPaused: this.animationsPaused,
      settingsUpdatesPaused: this.settingsUpdatesPaused,
      ...(this.visibilityState?.intersectionRatio !== undefined && {
        intersectionRatio: this.visibilityState.intersectionRatio
      })
    };
  }
}