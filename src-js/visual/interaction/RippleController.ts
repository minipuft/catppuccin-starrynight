/**
 * Enhanced RippleController - Canvas-Based Outward Propagation System
 * 
 * Creates non-intrusive ripple effects that emanate from interaction points
 * rather than animating the source elements themselves. Provides comprehensive
 * visual feedback for clicks, beats, and selections.
 */

import { EventBus } from "@/core/events/EventBus";
import { TimerConsolidationSystem } from "@/core/performance/TimerConsolidationSystem";
import type { IManagedSystem } from "@/types/systems";
import type { BeatPayload } from "@/types/systems";
import { RippleCanvas } from "./RippleCanvas";
import type { RippleType } from "./types";

export class RippleController implements IManagedSystem {
  public initialized: boolean = false;
  private globalEventBus: EventBus;
  private timerConsolidation: TimerConsolidationSystem | null = null;
  private motionReducedQuery: MediaQueryList;
  private mutationObserver: MutationObserver | null = null;
  private cleanupTimerId: string | null = null;
  
  // Canvas-based ripple system
  private rippleCanvas: RippleCanvas;
  private trackListContainer: HTMLElement | null = null;
  
  constructor(
    globalEventBus: EventBus,
    timerConsolidationSystem?: TimerConsolidationSystem
  ) {
    this.globalEventBus = globalEventBus;
    this.timerConsolidation = timerConsolidationSystem || null;
    this.motionReducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Initialize organic canvas system
    this.rippleCanvas = new RippleCanvas({
      maxConcurrentRipples: 6, // Reduced for organic effects
      poolSize: 10,
      enableDebug: false, // TODO: Read from YEAR3000_CONFIG.enableDebug
      enablePhysics: true,
      enableVariants: true,
      performanceBudget: 16 // 60fps target
    });
  }

  async initialize(): Promise<void> {
    try {
      // Find and attach to track list container
      this.trackListContainer = document.querySelector('.main-trackList-trackListRowGrid') || 
                                document.querySelector('.main-rootlist-wrapper');
      
      if (!this.trackListContainer) {
        console.warn("[RippleController] Track list container not found, using fallback");
        this.trackListContainer = document.querySelector('.Root__main-view') || document.body;
      }

      // Attach canvas to track list
      this.rippleCanvas.attachToTrackList(this.trackListContainer);

      // Subscribe to enhanced music events from MusicSyncService
      this.globalEventBus.subscribe("beat/bpm", (payload: { bpm: number }) => {
        this.updateMusicContext({ bpm: payload.bpm });
      });

      this.globalEventBus.subscribe("beat/intensity", (payload: { intensity: number }) => {
        this.updateMusicContext({ intensity: payload.intensity });
        this.handleBeatTrigger({ intensity: payload.intensity } as BeatPayload);
      });

      // Subscribe to beat events (legacy support)
      this.globalEventBus.subscribe<BeatPayload>("music:beat", (payload) => {
        this.handleBeatTrigger(payload);
      });

      // Attach click listeners in capture phase
      document.addEventListener("pointerdown", this.handlePointerDown, { capture: true });
      document.addEventListener("click", this.handleClick, { capture: true });

      // Set up mutation observer for track selection changes
      this.setupTrackSelectionObserver();

      // Register critical-priority timer for cleanup
      if (this.timerConsolidation) {
        this.timerConsolidation.registerConsolidatedTimer(
          "RippleController-cleanup",
          this.performMaintenanceCleanup.bind(this),
          1000, // 1 second interval
          "critical"
        );
        this.cleanupTimerId = "RippleController-cleanup";
      }

      this.initialized = true;
    } catch (error) {
      console.error("[RippleController] Initialization failed:", error);
      throw error;
    }
  }

  destroy(): void {
    // Destroy canvas system
    this.rippleCanvas.destroy();

    // Remove click listeners
    document.removeEventListener("pointerdown", this.handlePointerDown, { capture: true });
    document.removeEventListener("click", this.handleClick, { capture: true });

    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Unregister timer
    if (this.cleanupTimerId && this.timerConsolidation) {
      this.timerConsolidation.unregisterConsolidatedTimer(this.cleanupTimerId);
      this.cleanupTimerId = null;
    }

    this.trackListContainer = null;
    this.initialized = false;
  }

  private handleBeatTrigger = (payload: BeatPayload): void => {
    if (this.motionReducedQuery.matches) {
      return; // Skip animations if reduced motion is preferred
    }

    // Find currently playing track row
    const currentTrackRow = document.querySelector('.main-trackList-trackListRow[aria-selected="true"]');
    if (currentTrackRow instanceof HTMLElement) {
      this.createBeatRipple(currentTrackRow, payload);
    }
  };

  private handlePointerDown = (event: PointerEvent): void => {
    this.handleUserInteraction(event);
  };

  private handleClick = (event: MouseEvent): void => {
    this.handleUserInteraction(event);
  };

  private handleUserInteraction(event: Event): void {
    if (this.motionReducedQuery.matches) {
      return; // Skip animations if reduced motion is preferred
    }

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.classList) {
      return;
    }

    // Only create ripples for track list interactions
    if (this.isTrackListElement(target)) {
      this.createClickRipple(event as PointerEvent | MouseEvent);
    }
  }

  private isTrackListElement(element: HTMLElement): boolean {
    return element.closest('.main-trackList-trackListRow') !== null ||
           element.closest('.main-trackList-trackListRowGrid') !== null ||
           element.closest('.main-rootlist-wrapper') !== null;
  }

  private setupTrackSelectionObserver(): void {
    // Throttle observer to 1 pass per 250ms
    let observerTimeout: number | null = null;
    
    this.mutationObserver = new MutationObserver((mutations) => {
      if (observerTimeout) {
        return; // Already scheduled
      }

      observerTimeout = window.setTimeout(() => {
        this.checkForSelectionChanges(mutations);
        observerTimeout = null;
      }, 250);
    });

    // Observe aria-selected changes on track list rows
    const trackList = document.querySelector('.main-trackList-indexable');
    if (trackList) {
      this.mutationObserver.observe(trackList, {
        attributes: true,
        attributeFilter: ['aria-selected'],
        subtree: true
      });
    }
  }

  private checkForSelectionChanges(mutations: MutationRecord[]): void {
    if (this.motionReducedQuery.matches) {
      return;
    }

    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected' &&
        mutation.target instanceof HTMLElement
      ) {
        const isSelected = mutation.target.getAttribute('aria-selected') === 'true';
        if (isSelected && mutation.target.classList.contains('main-trackList-trackListRow')) {
          this.createSelectionRipple(mutation.target);
        }
      }
    }
  }

  // Ripple creation methods for different types
  private createClickRipple(event: PointerEvent | MouseEvent): void {
    const coordinates = this.rippleCanvas.screenToCanvasCoordinates(event.clientX, event.clientY);
    if (!coordinates) return;

    this.rippleCanvas.createRipple({
      x: coordinates.x,
      y: coordinates.y,
      type: 'click',
      intensity: 0.8
    });
  }

  private createBeatRipple(trackElement: HTMLElement, payload: BeatPayload): void {
    const coordinates = this.rippleCanvas.getElementCenterCoordinates(trackElement);
    if (!coordinates) return;

    this.rippleCanvas.createRipple({
      x: coordinates.x,
      y: coordinates.y,
      type: 'beat',
      intensity: (payload as any).intensity || 0.7
    });
  }

  private createSelectionRipple(trackElement: HTMLElement): void {
    const coordinates = this.rippleCanvas.getElementCenterCoordinates(trackElement);
    if (!coordinates) return;

    this.rippleCanvas.createRipple({
      x: coordinates.x,
      y: coordinates.y,
      type: 'selection',
      intensity: 0.9
    });
  }

  private performMaintenanceCleanup(): void {
    // Canvas system handles its own cleanup, this is just for monitoring
    if (this.rippleCanvas.getPoolUtilization() > 0.8) {
      console.warn("[RippleController] High ripple pool utilization:", this.rippleCanvas.getPoolUtilization());
    }
  }

  /**
   * Update musical context for organic ripple selection
   */
  updateMusicContext(context: { 
    bpm?: number; 
    intensity?: number; 
    harmonicMode?: string; 
    energy?: number;
  }): void {
    this.rippleCanvas.updateMusicContext(context);
  }

  /**
   * Update harmonic colors from ColorHarmonyEngine
   */
  updateHarmonicColors(colors: {
    primary: string;
    secondary: string;
    accent: string;
    mode: string;
    intensity: number;
  }): void {
    this.rippleCanvas.updateHarmonicColors(colors);
  }

  /**
   * Update performance budget from PerformanceAnalyzer
   */
  updatePerformanceBudget(budget: number): void {
    this.rippleCanvas.updatePerformanceBudget(budget);
  }

  /**
   * Handle beat trigger with enhanced musical context
   */
  updateBeatContext(intensity: number, bpm?: number): void {
    if (bpm) {
      this.updateMusicContext({ bpm, intensity });
    }
  }

  /**
   * Integrate with Year 3000 System components
   */
  integrateWithYear3000System(
    colorHarmonyEngine?: any, 
    musicSyncService?: any, 
    performanceAnalyzer?: any
  ): void {
    // Integrate with ColorHarmonyEngine for dynamic colors
    if (colorHarmonyEngine && typeof colorHarmonyEngine.getCurrentHarmonicColors === 'function') {
      try {
        const harmonicColors = colorHarmonyEngine.getCurrentHarmonicColors();
        this.updateHarmonicColors(harmonicColors);
        
        // Set up periodic updates for harmonic colors
        setInterval(() => {
          try {
            const updatedColors = colorHarmonyEngine.getCurrentHarmonicColors();
            this.updateHarmonicColors(updatedColors);
            this.updateMusicContext({ 
              harmonicMode: updatedColors.mode,
              intensity: updatedColors.intensity 
            });
          } catch (error) {
            console.warn('[RippleController] Failed to update harmonic colors:', error);
          }
        }, 2000); // Update every 2 seconds
        
      } catch (error) {
        console.warn('[RippleController] Failed to integrate with ColorHarmonyEngine:', error);
      }
    }

    // Integrate with MusicSyncService for enhanced context
    if (musicSyncService) {
      try {
        if (typeof musicSyncService.getLatestProcessedData === 'function') {
          const musicData = musicSyncService.getLatestProcessedData();
          if (musicData) {
            this.updateMusicContext({
              bpm: musicData.enhancedBPM,
              intensity: musicData.visualIntensity,
              energy: musicData.energyLevel
            });
          }
        }
      } catch (error) {
        console.warn('[RippleController] Failed to integrate with MusicSyncService:', error);
      }
    }

    // Integrate with PerformanceAnalyzer for budget management
    if (performanceAnalyzer && typeof performanceAnalyzer.getFrameBudget === 'function') {
      try {
        const performanceBudget = performanceAnalyzer.getFrameBudget();
        this.updatePerformanceBudget(performanceBudget);
        
        // Set up periodic performance budget updates
        setInterval(() => {
          try {
            const budget = performanceAnalyzer.getFrameBudget();
            this.updatePerformanceBudget(budget);
          } catch (error) {
            console.warn('[RippleController] Failed to update performance budget:', error);
          }
        }, 1000); // Update every second
        
      } catch (error) {
        console.warn('[RippleController] Failed to integrate with PerformanceAnalyzer:', error);
      }
    }
  }

  // Required by IManagedSystem interface
  updateAnimation(deltaTime: number): void {
    // No animation updates needed - this is an event-driven system
  }

  async healthCheck(): Promise<{ ok: boolean; status: "healthy" | "degraded" | "critical"; details: string }> {
    if (!this.initialized) {
      return { ok: false, status: "critical", details: "RippleController not initialized" };
    }

    const activeCount = this.rippleCanvas.getActiveRippleCount();
    const utilization = this.rippleCanvas.getPoolUtilization();
    
    if (utilization > 0.9) {
      return { ok: false, status: "degraded", details: `High pool utilization: ${Math.round(utilization * 100)}%` };
    }

    if (activeCount > 6) {
      return { ok: false, status: "degraded", details: `Too many active ripples: ${activeCount}` };
    }

    return { ok: true, status: "healthy", details: `Active ripples: ${activeCount}, Pool utilization: ${Math.round(utilization * 100)}%` };
  }

  forceRepaint?(reason?: string): void {
    // Canvas system handles cleanup automatically
    this.performMaintenanceCleanup();
  }
}