import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import type { IManagedSystem, HealthCheckResult } from "@/types/systems";
import * as ThemeUtilities from "@/utils/core/ThemeUtilities";
import { UnifiedCSSVariableManager, getGlobalUnifiedCSSManager } from "@/core/css/UnifiedCSSVariableManager";

interface FocusState {
  isFocusVisible: boolean;
  lastFocusTime: number;
  lastBlurTime: number;
  focusCount: number;
  hoverCount: number;
}

interface FocusManagerConfig {
  enableDebug?: boolean;
  debounceMs?: number;
  trackingEnabled?: boolean;
}

/**
 * FocusController subsystem for reliable --focus-visible CSS variable emission.
 * Tracks keyboard focus and pointer hover states with throttled writes for performance.
 * Integrates with Year3000System's UnifiedCSSVariableManager for optimal batching.
 */
export class FocusController implements IManagedSystem {
  public initialized: boolean = false;
  public readonly systemName = "FocusController";

  private config: FocusManagerConfig;
  private utils: typeof ThemeUtilities;
  private focusState: FocusState;
  private year3000System: any | null = null;
  private cssController!: UnifiedCSSVariableManager;

  // Event handlers (stored for cleanup)
  private boundFocusInHandler: ((event: FocusEvent) => void) | null = null;
  private boundFocusOutHandler: ((event: FocusEvent) => void) | null = null;
  private boundMouseOverHandler: ((event: MouseEvent) => void) | null = null;
  private boundMouseOutHandler: ((event: MouseEvent) => void) | null = null;
  private boundKeyDownHandler: ((event: KeyboardEvent) => void) | null = null;

  // Debounced update function
  private debouncedUpdate: (() => void) | null = null;

  constructor(
    config: AdvancedSystemConfig | Year3000Config,
    utils: typeof ThemeUtilities,
    year3000System: any | null = null
  ) {
    this.config = {
      enableDebug: config.enableDebug || false,
      debounceMs: 30, // ≤ 30ms as per spec
      trackingEnabled: true,
    };
    this.utils = utils;
    this.year3000System = year3000System;

    this.focusState = {
      isFocusVisible: false,
      lastFocusTime: 0,
      lastBlurTime: 0,
      focusCount: 0,
      hoverCount: 0,
    };

    // Create debounced update function
    this.debouncedUpdate = this.utils.debounce(
      () => this.writeFocusVariable(),
      this.config.debounceMs!
    );
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize CSS coordination - use globalThis to access Year3000System
      const year3000System = (globalThis as any).year3000System;
      this.cssController = year3000System?.cssController || this.year3000System?.cssController || getGlobalUnifiedCSSManager();

      this.setupEventListeners();
      this.initialized = true;

      if (this.config.enableDebug) {
        console.log("🎯 [FocusManager] Initialized successfully");
      }
    } catch (error) {
      console.error("[FocusManager] Initialization failed:", error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Bind handlers for proper cleanup
    this.boundFocusInHandler = this.handleFocusIn.bind(this);
    this.boundFocusOutHandler = this.handleFocusOut.bind(this);
    this.boundMouseOverHandler = this.handleMouseOver.bind(this);
    this.boundMouseOutHandler = this.handleMouseOut.bind(this);
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);

    // Listen for focus events (keyboard navigation)
    document.addEventListener("focusin", this.boundFocusInHandler, {
      passive: true,
      capture: true,
    });
    document.addEventListener("focusout", this.boundFocusOutHandler, {
      passive: true,
      capture: true,
    });

    // Listen for pointer events (mouse/touch interaction)
    document.addEventListener("mouseover", this.boundMouseOverHandler, {
      passive: true,
    });
    document.addEventListener("mouseout", this.boundMouseOutHandler, {
      passive: true,
    });

    // Listen for keyboard interaction to determine focus intent
    document.addEventListener("keydown", this.boundKeyDownHandler, {
      passive: true,
    });

    if (this.config.enableDebug) {
      console.log("🎯 [FocusManager] Event listeners setup complete");
    }
  }

  private handleFocusIn(event: FocusEvent): void {
    if (!this.config.trackingEnabled) return;

    const target = event.target as HTMLElement;
    if (!target || !this.isFocusableElement(target)) return;

    this.focusState.lastFocusTime = performance.now();
    this.focusState.focusCount++;
    this.updateFocusState(true);
  }

  private handleFocusOut(event: FocusEvent): void {
    if (!this.config.trackingEnabled) return;

    this.focusState.lastBlurTime = performance.now();
    this.updateFocusState(false);
  }

  private handleMouseOver(event: MouseEvent): void {
    if (!this.config.trackingEnabled) return;

    const target = event.target as HTMLElement;
    if (!target || !this.isInteractiveElement(target)) return;

    this.focusState.hoverCount++;
    this.updateFocusState(true);
  }

  private handleMouseOut(event: MouseEvent): void {
    if (!this.config.trackingEnabled) return;

    const target = event.target as HTMLElement;
    if (!target || !this.isInteractiveElement(target)) return;

    // Only update to false if no element is currently focused
    if (!document.activeElement || !this.isFocusableElement(document.activeElement as HTMLElement)) {
      this.updateFocusState(false);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.config.trackingEnabled) return;

    // Tab, arrow keys, etc. indicate keyboard navigation intent
    const navigationKeys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Space"];
    if (navigationKeys.includes(event.key)) {
      // Keyboard navigation detected - maintain focus state
      if (document.activeElement && this.isFocusableElement(document.activeElement as HTMLElement)) {
        this.updateFocusState(true);
      }
    }
  }

  private updateFocusState(shouldBeVisible: boolean): void {
    const previousState = this.focusState.isFocusVisible;
    this.focusState.isFocusVisible = shouldBeVisible;

    // Only trigger update if state changed
    if (previousState !== shouldBeVisible && this.debouncedUpdate) {
      this.debouncedUpdate();
    }
  }

  private writeFocusVariable(): void {
    const value = this.focusState.isFocusVisible ? "1" : "0";

    // Use coordination-first approach for focus visibility
    this.cssController.setVariable(
      "FocusManager",
      "--focus-visible",
      value,
      "high", // High priority for focus visibility - affects accessibility
      "focus-state-update"
    );

    if (this.config.enableDebug) {
      console.log(`🎯 [FocusManager] --focus-visible updated to: ${value}`);
    }
  }

  private isFocusableElement(element: HTMLElement): boolean {
    // Check if element can receive focus
    const focusableSelectors = [
      'button', 'input', 'select', 'textarea', 'a[href]',
      '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]'
    ];

    return focusableSelectors.some(selector => 
      element.matches(selector) && !element.hasAttribute('disabled')
    );
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    // Elements that should trigger hover states for focus visibility
    const interactiveSelectors = [
      'button', 'input', 'select', 'textarea', 'a',
      '.button', '.btn', '[role="button"]', '[role="menuitem"]',
      '.menu-item', '.nav-item', '.card', '.track-list-item'
    ];

    return interactiveSelectors.some(selector => element.matches(selector));
  }

  // Public API methods
  public isFocusVisible(): boolean {
    return this.focusState.isFocusVisible;
  }

  public getFocusMetrics(): {
    focusCount: number;
    hoverCount: number;
    lastFocusTime: number;
    lastBlurTime: number;
  } {
    return {
      focusCount: this.focusState.focusCount,
      hoverCount: this.focusState.hoverCount,
      lastFocusTime: this.focusState.lastFocusTime,
      lastBlurTime: this.focusState.lastBlurTime,
    };
  }

  public setTrackingEnabled(enabled: boolean): void {
    this.config.trackingEnabled = enabled;
    if (!enabled) {
      this.updateFocusState(false);
    }
  }

  // Health check for SystemHealthMonitor integration
  public async healthCheck(): Promise<HealthCheckResult> {
    const metrics = this.getFocusMetrics();
    const timeSinceLastFocus = performance.now() - this.focusState.lastFocusTime;
    const issues: string[] = [];

    if (!this.initialized) {
      issues.push("FocusManager not initialized");
    }
    if (!this.config.trackingEnabled) {
      issues.push("Focus tracking disabled");
    }

    const isHealthy = this.initialized && (this.config.trackingEnabled || false);
    return {
      healthy: isHealthy,
      ok: isHealthy,
      details: `Focus state: ${this.focusState.isFocusVisible ? 'visible' : 'hidden'}, Events: ${metrics.focusCount + metrics.hoverCount}`,
      issues: issues,
      system: 'FocusManager',
    };
  }

  public updateAnimation(deltaTime: number): void {
    // No per-frame updates needed - event-driven system
  }

  public forceRepaint?(reason?: string): void {
    if (reason === "settings-change" || reason === "accessibility-update") {
      this.writeFocusVariable();
    }
  }

  public destroy(): void {
    if (!this.initialized) return;

    // Remove all event listeners
    if (this.boundFocusInHandler) {
      document.removeEventListener("focusin", this.boundFocusInHandler, true);
    }
    if (this.boundFocusOutHandler) {
      document.removeEventListener("focusout", this.boundFocusOutHandler, true);
    }
    if (this.boundMouseOverHandler) {
      document.removeEventListener("mouseover", this.boundMouseOverHandler);
    }
    if (this.boundMouseOutHandler) {
      document.removeEventListener("mouseout", this.boundMouseOutHandler);
    }
    if (this.boundKeyDownHandler) {
      document.removeEventListener("keydown", this.boundKeyDownHandler);
    }

    // Clear references
    this.boundFocusInHandler = null;
    this.boundFocusOutHandler = null;
    this.boundMouseOverHandler = null;
    this.boundMouseOutHandler = null;
    this.boundKeyDownHandler = null;
    this.debouncedUpdate = null;

    this.initialized = false;

    if (this.config.enableDebug) {
      console.log("🎯 [FocusManager] Destroyed successfully");
    }
  }
}