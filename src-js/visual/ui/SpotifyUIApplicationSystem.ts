/**
 * Spotify UI Application System
 *
 * The missing piece that takes the unified Year3000 state and applies it to Spotify UI elements.
 * This system discovers DOM elements and applies the existing --sn-* variables systematically.
 */

import type { Year3000System } from "../../core/lifecycle/AdvancedThemeSystem";
import type { HealthCheckResult, IManagedSystem } from "../../types/systems";

// Event-driven integration imports
import { unifiedEventBus } from "../../core/events/UnifiedEventBus";
import type { ColorHarmonizedEvent } from "../../types/colorStrategy";

interface SpotifyUITargets {
  nowPlaying: Element[];
  sidebar: Element[];
  mainContent: Element[];
  buttons: Element[];
  cards: Element[];
  headers: Element[];
  textElements: Element[];
  iconElements: Element[];
  playbackControls: Element[];
  trackRows: Element[];
}

interface EffectLayer {
  name: string;
  elements: Element[];
  priority: number;
  cssVariables: Record<string, string>;
  interactionEffects?: boolean;
}

/**
 * Discovers and applies unified aesthetic state to Spotify UI elements
 */
export class SpotifyUIApplicationSystem implements IManagedSystem {
  public systemName = "SpotifyUIApplicationSystem";
  public initialized = false;

  private targets: SpotifyUITargets;
  private effectLayers: EffectLayer[] = [];
  private observerRegistry: Map<string, MutationObserver> = new Map();
  
  // Performance optimization
  private lastDiscoveryLogTime: number = 0;
  private lastRefreshLogTime: number = 0;

  constructor(private year3000System: Year3000System) {
    this.targets = this.initializeEmptyTargets();
  }

  /**
   * Required by IManagedSystem - periodic animation updates
   */
  updateAnimation(deltaTime: number): void {
    // Update any time-based effects or animations
    // For now, this system is primarily reactive to external events
    // Future: Could add subtle background animations or transitions
  }

  /**
   * Required by IManagedSystem - health check
   */
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const targetStats = this.getTargetStats();
      const totalElements = Object.values(targetStats).reduce(
        (sum, count) => sum + count,
        0
      );

      const isHealthy = this.initialized && totalElements > 0;
      const issues: string[] = [];
      
      if (totalElements === 0) {
        issues.push("No UI elements discovered");
      }

      return {
        healthy: isHealthy,
        ok: isHealthy,
        details: `UI Application System ${
          this.initialized ? "active" : "inactive"
        }, ${totalElements} elements enhanced`,
        issues: issues,
        system: 'SpotifyUIApplicationSystem',
      };
    } catch (error) {
      return {
        healthy: false,
        ok: false,
        details: "Health check failed",
        issues: [error instanceof Error ? error.message : "Unknown error"],
        system: 'SpotifyUIApplicationSystem',
      };
    }
  }

  /**
   * Force repaint - implements optional IManagedSystem method
   * Cascade Coordination - Ensures proper layering of effects
   */
  forceRepaint(reason?: string): void {
    console.log(`🎨 Force repaint requested: ${reason || "manual trigger"}`);
    this.forceEffectCascade();
  }

  private initializeEmptyTargets(): SpotifyUITargets {
    return {
      nowPlaying: [],
      sidebar: [],
      mainContent: [],
      buttons: [],
      cards: [],
      headers: [],
      textElements: [],
      iconElements: [],
      playbackControls: [],
      trackRows: [],
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Discover current Spotify UI structure
      await this.discoverUITargets();

      // Set up effect layers in cascade order
      this.setupEffectLayers();

      // Apply initial state from unified systems
      this.applyUnifiedState();

      // Set up DOM mutation observers for dynamic updates
      this.setupDOMObservers();

      // Register for updates from unified systems
      this.registerSystemCallbacks();

      this.initialized = true;
      console.log("✨ SpotifyUIApplicationSystem initialized successfully");
    } catch (error) {
      console.error("Failed to initialize SpotifyUIApplicationSystem", error);
      throw error;
    }
  }

  /**
   * DOM Intelligence Layer - Discovers current Spotify UI elements (OPTIMIZED)
   */
  private async discoverUITargets(): Promise<void> {
    const selectors = {
      nowPlaying: [
        '[data-testid="now-playing-widget"]',
        ".main-nowPlayingWidget-nowPlaying",
        ".Root__now-playing-bar",
      ],
      sidebar: [
        '[data-testid="nav-bar"]',
        ".main-navBar-navBar",
        ".Root__nav-bar",
      ],
      mainContent: [
        '[data-testid="main"]',
        ".main-view-container",
        ".Root__main-view",
      ],
      buttons: [
        'button[class*="Button"]',
        '[role="button"]',
        ".main-playButton-PlayButton",
      ],
      cards: [
        '[data-testid*="card"]',
        ".main-card-card",
        ".main-entityCard-container",
      ],
      headers: [
        "h1, h2, h3, h4, h5, h6",
        '[data-testid*="header"]',
        ".main-entityHeader-titleText",
      ],
      textElements: [
        '[data-testid="track-name"]',
        '[data-testid="artist-name"]',
        ".main-trackList-trackName",
        ".main-trackList-artistName",
      ],
      iconElements: [
        'svg[class*="Icon"]',
        '[data-testid*="icon"]',
        ".Svg-sc-ytk21e-0",
      ],
      playbackControls: [
        '[data-testid="control-button"]',
        ".main-playPauseButton-button",
        ".player-controls__buttons",
      ],
      trackRows: [
        '[data-testid="tracklist-row"]',
        ".main-trackList-trackListRow",
        ".main-rootlist-rootlistItem",
      ],
    };

    // Use combined selectors to minimize DOM queries (optimization)
    const combinedQueries: Record<string, string> = {};
    for (const [category, selectorArray] of Object.entries(selectors)) {
      combinedQueries[category] = selectorArray.join(', ');
    }

    // Execute all queries in a single pass to reduce DOM overhead
    const elementMap = new Map<Element, string[]>();
    
    for (const [category, combinedSelector] of Object.entries(combinedQueries)) {
      try {
        const found = document.querySelectorAll(combinedSelector);
        for (const element of found) {
          if (!elementMap.has(element)) {
            elementMap.set(element, []);
          }
          elementMap.get(element)!.push(category);
        }
      } catch (error) {
        // Invalid selector, skip
        continue;
      }
    }

    // Populate targets from elementMap
    this.targets = this.initializeEmptyTargets();
    for (const [element, categories] of elementMap) {
      for (const category of categories) {
        this.targets[category as keyof SpotifyUITargets].push(element);
      }
    }

    // Throttled debug logging (only every 5 seconds max)
    if (performance.now() - this.lastDiscoveryLogTime >= 5000) {
      console.log("🎯 UI targets discovered", {
        nowPlaying: this.targets.nowPlaying.length,
        sidebar: this.targets.sidebar.length,
        mainContent: this.targets.mainContent.length,
        buttons: this.targets.buttons.length,
        cards: this.targets.cards.length,
        headers: this.targets.headers.length,
        textElements: this.targets.textElements.length,
        iconElements: this.targets.iconElements.length,
        playbackControls: this.targets.playbackControls.length,
        trackRows: this.targets.trackRows.length,
      });
      this.lastDiscoveryLogTime = performance.now();
    }
  }

  /**
   * Effect Application Pipeline - Sets up cascade layers from background to foreground
   */
  private setupEffectLayers(): void {
    this.effectLayers = [
      // Layer 1: Background & Container Effects
      {
        name: "background-containers",
        elements: [...this.targets.mainContent, ...this.targets.sidebar],
        priority: 10,
        cssVariables: {
          "--sn-bg-primary": "var(--sn-accent-primary)",
          "--sn-bg-secondary": "var(--sn-accent-secondary)",
          "--sn-gradient-start": "var(--sn-gradient-primary-rgb)",
          "--sn-gradient-end": "var(--sn-gradient-secondary-rgb)",
        },
      },

      // Layer 2: Card & Content Effects
      {
        name: "ui-cards",
        elements: this.targets.cards,
        priority: 20,
        cssVariables: {
          "--sn-card-bg": "var(--sn-accent-primary)",
          "--sn-card-border": "var(--sn-accent-secondary)",
          "--sn-card-glow": "var(--sn-accent-tertiary)",
          "--sn-glassmorphism-intensity": "var(--sn-effect-intensity)",
        },
        interactionEffects: true,
      },

      // Layer 3: Interactive Elements
      {
        name: "interactive-elements",
        elements: [...this.targets.buttons, ...this.targets.playbackControls],
        priority: 30,
        cssVariables: {
          "--sn-button-bg": "var(--sn-accent-primary)",
          "--sn-button-hover": "var(--sn-accent-secondary)",
          "--sn-button-active": "var(--sn-accent-tertiary)",
          "--sn-beat-sync-intensity": "var(--sn-music-intensity)",
        },
        interactionEffects: true,
      },

      // Layer 4: Text & Icon Enhancement
      {
        name: "text-icon-effects",
        elements: [
          ...this.targets.textElements,
          ...this.targets.iconElements,
          ...this.targets.headers,
        ],
        priority: 40,
        cssVariables: {
          "--sn-text-primary": "var(--sn-accent-primary)",
          "--sn-text-secondary": "var(--sn-accent-secondary)",
          "--sn-text-glow": "var(--sn-accent-tertiary)",
          "--sn-icon-color": "var(--sn-accent-primary)",
          "--sn-icon-glow": "var(--sn-accent-secondary)",
        },
      },

      // Layer 5: Now Playing Special Effects
      {
        name: "now-playing-effects",
        elements: this.targets.nowPlaying,
        priority: 50,
        cssVariables: {
          "--sn-now-playing-bg": "var(--sn-accent-primary)",
          "--sn-now-playing-glow": "var(--sn-accent-secondary)",
          "--sn-beat-pulse": "var(--sn-music-intensity)",
          "--sn-track-progress": "var(--sn-accent-tertiary)",
        },
        interactionEffects: true,
      },
    ];
  }

  /**
   * Applies unified state from existing systems to discovered UI elements
   */
  private applyUnifiedState(): void {
    // Apply each effect layer in priority order
    this.effectLayers.forEach((layer) => {
      layer.elements.forEach((element) => {
        this.applyEffectToElement(element, layer);
      });
    });
  }

  /**
   * Helper method to safely call Year3000System's queueCSSVariableUpdate
   */
  private safeQueueCSSVariableUpdate(
    property: string,
    value: string,
    element?: HTMLElement
  ): void {
    if (this.year3000System?.queueCSSVariableUpdate) {
      this.year3000System.queueCSSVariableUpdate(property, value, element || null);
    } else {
      // Fallback: apply directly if Year3000System not available
      const target = element || document.documentElement;
      target.style.setProperty(property, value);
    }
  }

  private applyEffectToElement(element: Element, layer: EffectLayer): void {
    if (!(element instanceof HTMLElement)) return;

    // Apply CSS variables from the layer using Year3000System's unified batcher
    Object.entries(layer.cssVariables).forEach(([property, value]) => {
      this.safeQueueCSSVariableUpdate(property, value, element);
    });

    // Add CSS classes for effect coordination
    element.classList.add(`sn-${layer.name}`);
    element.classList.add("sn-ui-enhanced");

    // Add interaction effects if enabled
    if (layer.interactionEffects) {
      this.addInteractionEffects(element, layer);
    }

    // Add data attributes for identification
    element.setAttribute("data-sn-layer", layer.name);
    element.setAttribute("data-sn-priority", layer.priority.toString());
  }

  private addInteractionEffects(
    element: HTMLElement,
    layer: EffectLayer
  ): void {
    // Beat sync effects
    if (
      layer.name === "interactive-elements" ||
      layer.name === "now-playing-effects"
    ) {
      this.safeQueueCSSVariableUpdate(
        "--sn-beat-response",
        "var(--sn-music-intensity)",
        element
      );
      element.classList.add("sn-beat-responsive");
    }

    // Hover effects
    element.addEventListener("mouseenter", () => {
      this.safeQueueCSSVariableUpdate(
        "--sn-hover-intensity",
        "1",
        element
      );
      element.classList.add("sn-hover-active");
    });

    element.addEventListener("mouseleave", () => {
      this.safeQueueCSSVariableUpdate(
        "--sn-hover-intensity",
        "0",
        element
      );
      element.classList.remove("sn-hover-active");
    });

    // Click effects
    element.addEventListener("click", () => {
      this.safeQueueCSSVariableUpdate(
        "--sn-click-intensity",
        "1",
        element
      );
      element.classList.add("sn-click-active");

      setTimeout(() => {
        this.safeQueueCSSVariableUpdate(
          "--sn-click-intensity",
          "0",
          element
        );
        element.classList.remove("sn-click-active");
      }, 300);
    });
  }

  /**
   * Sets up DOM mutation observers for dynamic Spotify UI updates (OPTIMIZED)
   */
  private setupDOMObservers(): void {
    const observerConfig = {
      childList: true,
      subtree: false, // Reduced to immediate children only
      attributes: false, // Disabled attribute watching for performance
    };

    // Main content observer with more intelligent filtering
    const mainObserver = new MutationObserver((mutations) => {
      let significantChange = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Only refresh for significant DOM additions
          const hasSignificantNodes = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Look for elements that might contain our target selectors
              return element.matches('[data-testid*="card"], [data-testid*="track"], [data-testid*="header"], [role="button"]') ||
                     element.querySelector('[data-testid*="card"], [data-testid*="track"], [data-testid*="header"], [role="button"]');
            }
            return false;
          });
          
          if (hasSignificantNodes) {
            significantChange = true;
          }
        }
      });

      if (significantChange) {
        this.debounceRefresh();
      }
    });

    const mainElement =
      document.querySelector('[data-testid="main"]') || document.body;
    mainObserver.observe(mainElement, observerConfig);
    this.observerRegistry.set("main", mainObserver);
  }

  // Increased debounce time to reduce frequency
  private debounceRefresh = this.debounce(() => {
    this.refreshUITargets();
  }, 2000); // Increased from 500ms to 2000ms

  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private async refreshUITargets(): Promise<void> {
    try {
      // Calculate hash of current targets to avoid redundant refreshes
      const previousTargetHash = this.calculateTargetHash();
      
      // Rediscover targets
      await this.discoverUITargets();

      // Only reapply effects if targets actually changed
      const currentTargetHash = this.calculateTargetHash();
      if (previousTargetHash !== currentTargetHash) {
        this.applyUnifiedState();
        
        // Throttled refresh logging (only every 10 seconds)
        if (performance.now() - this.lastRefreshLogTime >= 10000) {
          console.log("🔄 UI targets refreshed");
          this.lastRefreshLogTime = performance.now();
        }
      }
    } catch (error) {
      console.error("Failed to refresh UI targets", error);
    }
  }
  
  private calculateTargetHash(): string {
    // Quick hash based on total elements found in each category
    const counts = Object.values(this.targets).map(arr => arr.length);
    return counts.join('-');
  }

  /**
   * Registers for updates from unified systems - connects to event-driven architecture
   */
  private registerSystemCallbacks(): void {
    // Listen for color harmony updates via event-driven pattern (NEW ARCHITECTURE)
    try {
      unifiedEventBus.subscribe('colors:harmonized', (data) => {
        this.handleColorHarmonizedEvent({
          type: 'colors/harmonized',
          payload: {
            processedColors: data.processedColors,
            accentHex: data.accentHex || '#cba6f7',
            accentRgb: data.accentRgb || '203,166,247',
            context: {
              rawColors: data.processedColors,
              trackUri: '',
              timestamp: Date.now()
            },
            cssVariables: {},
            metadata: {
              strategy: data.strategies[0] || 'unknown',
              accentHex: data.accentHex,
              processingTime: data.processingTime
            }
          }
        });
      }, 'SpotifyUIApplicationSystem');
      
      console.log("🎨 [SpotifyUIApplicationSystem] Subscribed to colors:harmonized events");
    } catch (error) {
      console.error("[SpotifyUIApplicationSystem] Failed to subscribe to colors:harmonized events:", error);
      
      // Fallback to legacy method interception for compatibility
      if (this.year3000System.colorHarmonyEngine) {
        const originalApplyColors = this.year3000System.applyColorsToTheme.bind(
          this.year3000System
        );
        this.year3000System.applyColorsToTheme = (extractedColors: any = {}) => {
          originalApplyColors(extractedColors);
          this.updateColorVariables(extractedColors);
        };
        
        console.warn("[SpotifyUIApplicationSystem] Using legacy color application hook as fallback");
      }
    }

    // Listen for music sync updates from existing MusicSyncService
    if (this.year3000System.musicSyncService) {
      const originalUpdateFromAnalysis =
        this.year3000System.updateFromMusicAnalysis.bind(this.year3000System);
      this.year3000System.updateFromMusicAnalysis = (
        processedData: any,
        rawFeatures?: any,
        trackUri?: string
      ) => {
        originalUpdateFromAnalysis(processedData, rawFeatures, trackUri);
        this.updateMusicIntensity(processedData);
      };
    }

    // Listen for beat detection from existing systems
    if (this.year3000System.beatSyncVisualSystem) {
      // Hook into beat sync system if it has beat detection
      // Use TimerConsolidationSystem if available, otherwise fall back to setInterval
      if (this.year3000System.timerConsolidationSystem) {
        this.year3000System.timerConsolidationSystem.registerConsolidatedTimer(
          "SpotifyUIApplicationSystem-beatEffects",
          () => {
            // Trigger beat effects periodically based on music intensity
            const intensity = this.getCurrentMusicIntensity();
            if (intensity > 0.5) {
              this.triggerBeatEffects({ intensity });
            }
          },
          200,
          "normal"
        );
      } else {
        setInterval(() => {
          // Trigger beat effects periodically based on music intensity
          const intensity = this.getCurrentMusicIntensity();
          if (intensity > 0.5) {
            this.triggerBeatEffects({ intensity });
          }
        }, 200);
      }
    }
  }

  private getCurrentMusicIntensity(): number {
    const root = document.documentElement;
    const intensity = getComputedStyle(root)
      .getPropertyValue("--sn-kinetic-energy")
      .trim();
    return parseFloat(intensity) || 0;
  }

  /**
   * Handle colors/harmonized event from ColorOrchestrator (Event-driven architecture)
   */
  private handleColorHarmonizedEvent(event: ColorHarmonizedEvent): void {
    if (event.type !== 'colors/harmonized') return;
    
    const { processedColors, cssVariables, metadata } = event.payload;
    
    console.log("🎨 [SpotifyUIApplicationSystem] Received harmonized colors via event-driven pattern", {
      strategy: metadata.strategy,
      colorsCount: Object.keys(processedColors).length,
      cssVariablesCount: Object.keys(cssVariables).length
    });
    
    try {
      // Update color variables for Spotify UI elements
      this.updateColorVariables(processedColors);
      
      // Apply CSS variables directly if provided (optimization)
      if (cssVariables && Object.keys(cssVariables).length > 0) {
        this.applyCSSVariablesToSpotifyUI(cssVariables);
      }
      
    } catch (error) {
      console.error("[SpotifyUIApplicationSystem] Failed to apply harmonized colors from event:", error);
      
      // Fallback to basic color application
      this.updateColorVariables(processedColors);
    }
  }

  /**
   * Apply CSS variables directly to Spotify UI elements (optimization for event-driven pattern)
   */
  private applyCSSVariablesToSpotifyUI(cssVariables: Record<string, string>): void {
    try {
      const root = document.documentElement;
      const enhancedElements = document.querySelectorAll(".sn-ui-enhanced");
      
      // Apply to root for global availability
      for (const [variable, value] of Object.entries(cssVariables)) {
        if (variable && value) {
          root.style.setProperty(variable, value);
        }
      }
      
      // Apply to enhanced Spotify UI elements
      enhancedElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          for (const [variable, value] of Object.entries(cssVariables)) {
            if (variable && value) {
              element.style.setProperty(variable, value);
            }
          }
        }
      });
      
      console.log("🎨 [SpotifyUIApplicationSystem] Applied CSS variables to Spotify UI", {
        variablesCount: Object.keys(cssVariables).length,
        enhancedElementsCount: enhancedElements.length
      });
      
    } catch (error) {
      console.error("[SpotifyUIApplicationSystem] Failed to apply CSS variables to Spotify UI:", error);
    }
  }

  private updateColorVariables(colorData: any): void {
    // Update CSS variables on all enhanced elements
    const enhancedElements = document.querySelectorAll(".sn-ui-enhanced");
    enhancedElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Use Year3000System's unified variable system
        this.safeQueueCSSVariableUpdate(
          "--sn-accent-primary",
          colorData.primary || "var(--spice-accent)",
          element
        );
        this.safeQueueCSSVariableUpdate(
          "--sn-accent-secondary",
          colorData.secondary || "var(--spice-accent)",
          element
        );
        this.safeQueueCSSVariableUpdate(
          "--sn-accent-tertiary",
          colorData.tertiary || "var(--spice-accent)",
          element
        );
      }
    });
  }

  private updateMusicIntensity(processedData: any): void {
    const intensity = processedData?.processedEnergy || 0;
    const intensityElements = document.querySelectorAll(".sn-beat-responsive");
    intensityElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        this.safeQueueCSSVariableUpdate(
          "--sn-music-intensity",
          intensity.toString(),
          element
        );
      }
    });
  }

  private triggerBeatEffects(beatData: any): void {
    const beatElements = document.querySelectorAll(".sn-beat-responsive");
    beatElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        this.safeQueueCSSVariableUpdate(
          "--sn-beat-pulse",
          "1",
          element
        );
        element.classList.add("sn-beat-active");

        setTimeout(() => {
          this.safeQueueCSSVariableUpdate(
            "--sn-beat-pulse",
            "0",
            element
          );
          element.classList.remove("sn-beat-active");
        }, 200);
      }
    });
  }

  /**
   * Cascade Coordination - Ensures proper layering of effects
   */
  public forceEffectCascade(): void {
    // Reapply all effects in proper order
    this.effectLayers
      .sort((a, b) => a.priority - b.priority)
      .forEach((layer) => {
        layer.elements.forEach((element) => {
          this.applyEffectToElement(element, layer);
        });
      });
  }

  async destroy(): Promise<void> {
    // Unregister timers from consolidation system
    if (this.year3000System?.timerConsolidationSystem) {
      this.year3000System.timerConsolidationSystem.unregisterConsolidatedTimer("SpotifyUIApplicationSystem-beatEffects");
    }

    // Clean up observers
    this.observerRegistry.forEach((observer) => {
      observer.disconnect();
    });
    this.observerRegistry.clear();

    // Clean up DOM modifications
    const enhancedElements = document.querySelectorAll(".sn-ui-enhanced");
    enhancedElements.forEach((element) => {
      element.classList.remove("sn-ui-enhanced");
      element.removeAttribute("data-sn-layer");
      element.removeAttribute("data-sn-priority");
    });

    this.initialized = false;
  }

  // Debug utility
  public getTargetStats(): Record<string, number> {
    return Object.fromEntries(
      Object.entries(this.targets).map(([key, elements]) => [
        key,
        elements.length,
      ])
    );
  }
}
