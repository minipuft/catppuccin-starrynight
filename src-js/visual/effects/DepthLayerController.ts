/**
 * DepthVisualEffectsController - Year 3000 Smooth Intelligence
 *
 * Manages content-aware visualEffects effects that adapt to user behavior,
 * musical energy, and interface context for optimal readability and beauty.
 *
 * Philosophy: "VisualEffects that enhances human experience through intelligent,
 * beautiful interfaces that adapt to serve the user's current need."
 */

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { CSSVariableWriter, getGlobalCSSVariableWriter } from "@/core/css/CSSVariableWriter";
import { DefaultServiceFactory } from "@/core/services/CoreServiceProviders";
import { Y3KDebug } from "@/debug/DebugCoordinator";
import type { HealthCheckResult } from "@/types/systems";
import * as Utils from "@/utils/core/ThemeUtilities";
import { ServiceVisualSystemBase } from "@/core/services/SystemServiceBridge";

interface ContentArea {
  element: Element;
  type: "text" | "interactive" | "visual" | "chrome" | "media" | "navigation";
  protectionLevel: number; // 0-1
  lastInteraction: number;
  visualEffectsLevel: number; // 0-1 current visualEffects adaptation level
  readingIntensity: number; // 0-1 detected reading engagement
  contextualImportance: number; // 0-1 importance in current context
  adaptiveProtection: number; // 0-1 dynamic protection based on behavior
}

interface MusicalVisualEffectsState {
  energy: number; // 0-1
  valence: number; // 0-1
  instrumental: boolean;
  tempo: number;
  genre?: string;
  
  // Enhanced musical visualEffects
  emotionalTemperature: number; // 0-1 warm to cool emotional range
  musicSyncStrength: number; // 0-1 how strongly visual effects should sync with music
  genreVisualEffectsProfile: {
    ambientLevel: number; // 0-1
    energyResponse: number; // 0-1
    visualComplexity: number; // 0-1
  };
  musicalMemoryPatterns: number; // 0-1 strength of musical memory effects
}

interface UserInteractionState {
  isScrolling: boolean;
  isHovering: boolean;
  lastInteractionTime: number;
  readingModeActive: boolean;
  interactionTarget: Element | null;
  
  // Enhanced interaction awareness
  currentMode: "reading" | "browsing" | "exploring" | "navigating" | "ambient";
  focusDepth: number; // 0-1 how deeply focused the user is
  scrollVelocity: number; // pixels per second
  dwellTime: number; // time spent in current area
  interactionPattern: "deliberate" | "casual" | "rapid" | "contemplative";
  contentEngagement: number; // 0-1 estimated content engagement level
}

/**
 * DepthVisualEffectsController - Content-aware visual effects system
 *
 * Migrated to ServiceVisualSystemBase for composition-based architecture.
 * Uses service injection pattern for better testability and maintainability.
 */
export class DepthVisualEffectsController extends ServiceVisualSystemBase {
  private cssController!: CSSVariableWriter;
  private contentAreas: Map<Element, ContentArea> = new Map();
  private chromeAreas: Set<Element> = new Set();
  private userState: UserInteractionState = {
    isScrolling: false,
    isHovering: false,
    lastInteractionTime: 0,
    readingModeActive: false,
    interactionTarget: null,
    
    // Enhanced interaction awareness defaults
    currentMode: "browsing",
    focusDepth: 0.3,
    scrollVelocity: 0,
    dwellTime: 0,
    interactionPattern: "casual",
    contentEngagement: 0.5,
  };

  private musicalState: MusicalVisualEffectsState = {
    energy: 0.5,
    valence: 0.5,
    instrumental: false,
    tempo: 120,
    
    // Enhanced musical visualEffects defaults
    emotionalTemperature: 0.5,
    musicSyncStrength: 0.7,
    genreVisualEffectsProfile: {
      ambientLevel: 0.5,
      energyResponse: 0.6,
      visualComplexity: 0.5,
    },
    musicalMemoryPatterns: 0.4,
  };

  private readingModeTimer: number = 0;
  private interactionTimer: number = 0;
  private visualEffectsUpdateInterval: number = 0;

  // Performance optimization and visualEffects timing
  private lastUpdate = 0;
  private updateThreshold = 100; // Max 10fps for visualEffects updates
  private visualEffectsIntensity = 0.7; // Overall visualEffects system intensity
  private adaptiveProtectionMap: Map<Element, number> = new Map(); // Dynamic protection levels
  private scrollVelocityHistory: number[] = []; // Track scroll patterns
  private dwellTimeTracker: Map<Element, number> = new Map(); // Track time spent in areas

  constructor(
    config = ADVANCED_SYSTEM_CONFIG,
    utils = Utils,
    performanceMonitor: any = null,
    musicSyncService: any = null
    // NOTE: settingsManager parameter removed - using TypedSettingsManager singleton
  ) {
    super(config, utils, performanceMonitor, musicSyncService);
  }

  protected override async performVisualSystemInitialization(): Promise<void> {
    try {
      const themeService = DefaultServiceFactory.getServices().themeLifecycle;
      this.cssController =
        (themeService?.getCoordinator() as any)?.cssVisualEffectsController ||
        themeService?.getCssController() ||
        getGlobalCSSVariableWriter();

      this.detectContentAndChromeAreas();
      this.setupInteractionListeners();
      this.initializeVisualEffectsVariables();
      this.startVisualEffectsUpdate();

      Y3KDebug?.debug?.log(
        "DepthVisualEffectsController",
        "VisualEffects system awakened"
      );
    } catch (error) {
      Y3KDebug?.debug?.error(
        "DepthVisualEffectsController",
        "Failed to initialize visualEffects:",
        error
      );
    }
  }

  /**
   * Enhanced content detection with advanced awareness patterns
   */
  private detectContentAndChromeAreas(): void {
    // Content areas requiring intelligent protection
    const contentSelectors = {
      text: [
        ".main-view-container__scroll-node",
        ".main-trackList-trackListRow",
        '[data-testid*="tracklist"]',
        '[data-testid*="playlist"]',
        ".main-entityHeader-titleText",
        ".main-entityHeader-subtitle",
        ".main-trackList-rowTitle",
        ".main-trackList-rowSubTitle",
        "h1, h2, h3, h4, h5, h6",
        "p",
        ".lyrics-lyricsContainer-container",
        ".main-cardSubHeader-root",
        ".main-trackList-indexNumber",
        ".main-trackInfo-name",
        ".main-trackInfo-artists"
      ],
      interactive: [
        "button",
        "a[role='button']",
        "[tabindex='0']",
        ".main-playButton-button",
        ".main-addButton-button",
        ".main-moreButton-button",
        ".main-trackList-rowPlayPause",
        ".control-button",
        "input",
        "select"
      ],
      visual: [
        ".main-image-container",
        ".main-entityHeader-image",
        ".cover-art",
        ".main-coverSlot-container",
        ".main-image-image"
      ],
      media: [
        "video",
        "audio",
        ".main-nowPlayingWidget-trackInfo",
        ".main-coverSlot-container",
        ".main-nowPlayingView-coverArt"
      ],
      navigation: [
        ".main-navBar-navBarLink",
        ".main-rootlist-rootlistItem",
        ".main-collectionLinkText-text"
      ]
    };

    // UI chrome areas that can handle enhanced visualEffects effects
    const chromeSelectors = [
      ".Root__nav-bar",
      ".Root__top-bar",
      ".Root__now-playing-bar",
      ".main-topBar-container",
      ".main-navBar-navBar",
      ".main-entityHeader-container",
      ".main-actionBar-container",
      ".main-view-container",
      ".Root__main-view",
      ".main-rootlist-wrapper"
    ];

    // Detect and categorize content areas with enhanced awareness
    Object.entries(contentSelectors).forEach(([type, selectors]) => {
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          const contentArea: ContentArea = {
            element,
            type: type as ContentArea["type"],
            protectionLevel: this.calculateAdvancedProtectionLevel(element, type as ContentArea["type"]),
            lastInteraction: 0,
            visualEffectsLevel: this.calculateVisualEffectsLevel(element),
            readingIntensity: 0,
            contextualImportance: this.calculateContextualImportance(element),
            adaptiveProtection: this.calculateProtectionLevel(element),
          };

          this.contentAreas.set(element, contentArea);
          element.classList.add("content-sanctuary");
          element.classList.add(`content-${type}`);

          // Add enhanced content-aware data attributes
          element.setAttribute("data-visualEffects-protected", "true");
          element.setAttribute("data-content-type", contentArea.type);
          element.setAttribute("data-visualEffects-level", contentArea.visualEffectsLevel.toString());
          element.setAttribute("data-contextual-importance", contentArea.contextualImportance.toString());

          // Initialize adaptive protection tracking
          this.adaptiveProtectionMap.set(element, contentArea.adaptiveProtection);
          this.dwellTimeTracker.set(element, 0);
        });
      });
    });

    // Detect and mark chrome areas
    chromeSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        this.chromeAreas.add(element);
        element.classList.add("ui-chrome-area");
        element.setAttribute("data-visualEffects-enhanced", "true");
      });
    });

    // Analyze content distribution for visualEffects optimization
    const contentStats = this.analyzeContentDistribution();
    
    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      `Enhanced detection: ${this.contentAreas.size} content areas, ${this.chromeAreas.size} chrome areas`,
      contentStats
    );
  }

  /**
   * Determine content type for appropriate protection level
   */
  private determineContentType(element: Element): ContentArea["type"] {
    if (
      element.matches("h1, h2, h3, h4, h5, h6, .main-entityHeader-titleText")
    ) {
      return "text";
    }

    if (
      element.matches('button, a, [role="button"], [tabindex], input, select')
    ) {
      return "interactive";
    }

    if (
      element.matches(
        ".main-image-container, .main-entityHeader-image, .cover-art"
      )
    ) {
      return "visual";
    }

    if (
      element.matches(".Root__nav-bar, .Root__top-bar, .main-topBar-container")
    ) {
      return "chrome";
    }

    return "text"; // Default to text protection
  }

  /**
   * Calculate protection level based on content type and context
   */
  private calculateProtectionLevel(element: Element): number {
    const contentType = this.determineContentType(element);

    switch (contentType) {
      case "text":
        return 0.95; // High protection for text
      case "interactive":
        return 0.9; // High protection for interactive elements
      case "visual":
        return 0.6; // Moderate protection for visual content
      case "chrome":
        return 0.3; // Low protection for chrome (allow enhancement)
      case "media":
        return 0.5; // Medium protection for media elements
      case "navigation":
        return 0.7; // High protection for navigation clarity
      default:
        return 0.85; // Safe default
    }
  }

  /**
   * Advanced protection level calculation with visualEffects awareness
   */
  private calculateAdvancedProtectionLevel(element: Element, type: ContentArea["type"]): number {
    const baseProtection = this.calculateProtectionLevel(element);
    
    // Adjust protection based on element importance and context
    let adjustment = 0;
    
    // Check if element contains critical text content
    if (type === "text" && element.textContent && element.textContent.length > 50) {
      adjustment += 0.05; // Extra protection for substantial text
    }
    
    // Check viewport visibility and importance
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top >= 0 && rect.left >= 0 && 
                        rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    
    if (isInViewport) {
      adjustment += 0.02; // Slight boost for visible elements
    }
    
    // Check semantic importance
    if (element.matches('h1, h2, .main-entityHeader-titleText, [data-testid*="title"]')) {
      adjustment += 0.03; // Extra protection for important headings
    }
    
    return Math.min(baseProtection + adjustment, 0.98);
  }

  /**
   * Calculate visualEffects level - how much visualEffects effects should be applied
   */
  private calculateVisualEffectsLevel(element: Element): number {
    const rect = element.getBoundingClientRect();
    const elementArea = rect.width * rect.height;
    const viewportArea = window.innerWidth * window.innerHeight;
    const elementVisibilityRatio = elementArea / viewportArea;
    
    // Larger elements get more visualEffects attention
    let visualEffectsLevel = Math.min(elementVisibilityRatio * 2, 0.8);
    
    // Adjust based on element type
    if (element.matches('.Root__main-view, .main-view-container')) {
      visualEffectsLevel += 0.3; // Main content areas get more visualEffects
    }
    
    if (element.matches('.main-nowPlayingBar-container')) {
      visualEffectsLevel += 0.4; // Now playing bar is visualEffects-focal
    }
    
    return Math.min(visualEffectsLevel, 1.0);
  }

  /**
   * Calculate contextual importance based on user behavior and content significance
   */
  private calculateContextualImportance(element: Element): number {
    let importance = 0.5; // Base importance
    
    // Increase importance for interactive elements
    if (element.matches('button, a, [role="button"], [tabindex="0"]')) {
      importance += 0.2;
    }
    
    // Increase importance for main content areas
    if (element.matches('.main-view-container, .main-entityHeader, .main-trackList')) {
      importance += 0.3;
    }
    
    // Increase importance for currently playing content
    if (element.matches('.main-nowPlayingWidget, .main-nowPlayingBar')) {
      importance += 0.4;
    }
    
    // Check for user focus indicators
    if (element.matches(':focus, :focus-within, :hover')) {
      importance += 0.2;
    }
    
    return Math.min(importance, 1.0);
  }

  /**
   * Analyze content distribution for visualEffects optimization
   */
  private analyzeContentDistribution(): object {
    const stats = {
      totalAreas: this.contentAreas.size,
      textAreas: 0,
      interactiveAreas: 0,
      visualAreas: 0,
      mediaAreas: 0,
      navigationAreas: 0,
      chromeAreas: this.chromeAreas.size,
      averageProtection: 0,
      highProtectionAreas: 0,
    };
    
    let totalProtection = 0;
    
    this.contentAreas.forEach((area) => {
      switch (area.type) {
        case 'text': stats.textAreas++; break;
        case 'interactive': stats.interactiveAreas++; break;
        case 'visual': stats.visualAreas++; break;
        case 'media': stats.mediaAreas++; break;
        case 'navigation': stats.navigationAreas++; break;
      }
      
      totalProtection += area.protectionLevel;
      if (area.protectionLevel > 0.8) {
        stats.highProtectionAreas++;
      }
    });
    
    stats.averageProtection = totalProtection / this.contentAreas.size || 0;
    
    return stats;
  }

  /**
   * Analyze scrolling behavior patterns for visualEffects adaptation
   */
  private analyzeScrollingBehavior(): void {
    if (this.scrollVelocityHistory.length < 3) return;
    
    const avgVelocity = this.scrollVelocityHistory.reduce((a, b) => a + b, 0) / this.scrollVelocityHistory.length;
    const velocityVariance = this.scrollVelocityHistory.reduce((variance, velocity) => {
      return variance + Math.pow(velocity - avgVelocity, 2);
    }, 0) / this.scrollVelocityHistory.length;
    
    // Determine user engagement based on scroll patterns
    if (velocityVariance < 100 && avgVelocity < 300) {
      // Steady, slow scrolling = high engagement
      this.userState.contentEngagement = Math.min(this.userState.contentEngagement + 0.05, 1.0);
      this.userState.interactionPattern = "contemplative";
    } else if (avgVelocity > 1500 && velocityVariance > 500) {
      // Fast, erratic scrolling = low engagement, browsing mode
      this.userState.contentEngagement = Math.max(this.userState.contentEngagement - 0.1, 0.1);
      this.userState.interactionPattern = "rapid";
    } else {
      // Moderate scrolling = casual engagement
      this.userState.interactionPattern = "casual";
    }
    
    // Adjust visualEffects intensity based on engagement
    if (this.userState.contentEngagement > 0.7) {
      this.visualEffectsIntensity = Math.min(this.visualEffectsIntensity + 0.05, 0.9);
    } else if (this.userState.contentEngagement < 0.3) {
      this.visualEffectsIntensity = Math.max(this.visualEffectsIntensity - 0.1, 0.3);
    }
  }

  /**
   * Calculate interaction modifier for visualEffects intensity
   */
  private calculateInteractionModifier(): number {
    let modifier = 0;
    
    // Reading mode significantly reduces visualEffects effects
    if (this.userState.readingModeActive) {
      modifier -= 0.6;
    }
    
    // Hover reduces effects but less than reading mode
    if (this.userState.isHovering) {
      const contentArea = this.contentAreas.get(this.userState.interactionTarget!);
      if (contentArea) {
        // More reduction for text content, less for chrome/visual
        const reductionFactor = contentArea.type === "text" ? 0.4 : 
                                contentArea.type === "interactive" ? 0.3 :
                                contentArea.type === "chrome" ? 0.1 : 0.2;
        modifier -= reductionFactor;
      }
    }
    
    // Rapid scrolling slightly reduces effects for comfort
    if (this.userState.scrollVelocity > 1000) {
      modifier -= 0.2;
    }
    
    // High focus depth allows more visualEffects effects
    if (this.userState.focusDepth > 0.7 && !this.userState.readingModeActive) {
      modifier += 0.2;
    }
    
    return modifier;
  }

  /**
   * Calculate contextual modifier based on current application context
   */
  private calculateContextualModifier(): number {
    let modifier = 0;
    
    // Enhance visualEffects in music-focused areas
    if (this.userState.interactionTarget?.matches('.main-nowPlayingBar, .main-nowPlayingWidget')) {
      modifier += 0.3;
    }
    
    // Reduce visualEffects in text-heavy areas unless user is exploring
    if (this.userState.interactionTarget?.matches('.main-trackList, .main-entityHeader-subtitle')) {
      modifier -= this.userState.currentMode === "exploring" ? 0.1 : 0.3;
    }
    
    // Ambient mode allows more visualEffects effects
    if (this.userState.currentMode === "ambient") {
      modifier += 0.4;
    }
    
    // Navigation mode needs clear interface
    if (this.userState.currentMode === "navigating") {
      modifier -= 0.2;
    }
    
    return modifier;
  }

  /**
   * Convert interaction mode to numeric value for CSS
   */
  private getModeNumericValue(mode: UserInteractionState["currentMode"]): number {
    const modes = { "reading": 0, "browsing": 1, "exploring": 2, "navigating": 3, "ambient": 4 };
    return modes[mode] / 4; // Normalize to 0-1
  }

  /**
   * Convert interaction pattern to numeric value for CSS
   */
  private getPatternNumericValue(pattern: UserInteractionState["interactionPattern"]): number {
    const patterns = { "contemplative": 0, "casual": 1, "deliberate": 2, "rapid": 3 };
    return patterns[pattern] / 3; // Normalize to 0-1
  }

  /**
   * Calculate surface fluidity index based on user behavior and music
   */
  private calculateSurfaceFluidityIndex(): number {
    let fluidity = 0.5; // Base fluidity
    
    // Musical energy affects surface fluidity
    fluidity += this.musicalState.energy * 0.3;
    
    // User engagement affects surface responsiveness
    fluidity += this.userState.contentEngagement * 0.2;
    
    // Emotional temperature affects surface dynamics
    fluidity += this.musicalState.emotionalTemperature * 0.2;
    
    // Interaction pattern affects surface behavior
    if (this.userState.interactionPattern === "contemplative") {
      fluidity -= 0.2; // More stable surfaces for focused states
    } else if (this.userState.interactionPattern === "rapid") {
      fluidity += 0.3; // More fluid surfaces for active browsing
    }
    
    return Math.max(0.1, Math.min(1.0, fluidity));
  }

  /**
   * Calculate genre-specific visualEffects shifts
   */
  private calculateGenreVisualEffectsShift(): number {
    if (!this.musicalState.genre) return 0.5;
    
    // Genre-specific visualEffects adjustments
    const genreShifts: Record<string, number> = {
      "ambient": 0.8,     // High visualEffects for ambient music
      "electronic": 0.7, // Moderate-high for electronic
      "classical": 0.6,  // Moderate for classical
      "jazz": 0.5,       // Balanced for jazz
      "rock": 0.4,       // Moderate-low for rock
      "pop": 0.3,        // Lower for pop
      "hip-hop": 0.2,    // Low for hip-hop (focus on lyrics)
    };
    
    const baseShift = genreShifts[this.musicalState.genre.toLowerCase()] || 0.5;
    
    // Adjust based on valence and energy
    let adjustment = 0;
    if (this.musicalState.valence > 0.7) adjustment += 0.1; // Happy music can have more effects
    if (this.musicalState.energy > 0.8) adjustment += 0.1;  // High energy can have more effects
    
    return Math.max(0.1, Math.min(1.0, baseShift + adjustment));
  }

  /**
   * Enhanced interaction listeners with advanced visualEffects awareness
   */
  private setupInteractionListeners(): void {
    // Enhanced scroll detection with velocity tracking
    let scrollTimer: number;
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    
    document.addEventListener(
      "scroll",
      () => {
        const now = Date.now();
        const currentScrollY = window.scrollY;
        const timeDelta = now - lastScrollTime;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        // Calculate scroll velocity
        this.userState.scrollVelocity = timeDelta > 0 ? (scrollDelta / timeDelta) * 1000 : 0;
        
        // Track scroll velocity history for pattern recognition
        this.scrollVelocityHistory.push(this.userState.scrollVelocity);
        if (this.scrollVelocityHistory.length > 10) {
          this.scrollVelocityHistory.shift();
        }
        
        // Determine interaction pattern based on scroll behavior
        const avgVelocity = this.scrollVelocityHistory.reduce((a, b) => a + b, 0) / this.scrollVelocityHistory.length;
        if (avgVelocity > 2000) {
          this.userState.interactionPattern = "rapid";
          this.userState.currentMode = "browsing";
        } else if (avgVelocity > 500) {
          this.userState.interactionPattern = "deliberate";
          this.userState.currentMode = "exploring";
        } else {
          this.userState.interactionPattern = "contemplative";
        }
        
        this.userState.isScrolling = true;
        this.userState.lastInteractionTime = now;
        
        lastScrollY = currentScrollY;
        lastScrollTime = now;

        clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          this.userState.isScrolling = false;
          this.analyzeScrollingBehavior();
        }, 150);

        this.updateUserInteractionState();
      },
      { passive: true }
    );

    // Enhanced hover detection with dwell time tracking
    this.contentAreas.forEach((contentArea, element) => {
      let enterTime = 0;
      
      element.addEventListener("mouseenter", () => {
        enterTime = Date.now();
        this.userState.isHovering = true;
        this.userState.interactionTarget = element;
        this.userState.lastInteractionTime = enterTime;

        // Update interaction time for this specific area
        contentArea.lastInteraction = enterTime;
        
        // Start tracking dwell time
        this.dwellTimeTracker.set(element, enterTime);
        
        // Increase focus depth based on content type
        this.userState.focusDepth = Math.min(this.userState.focusDepth + 0.1, 1.0);
        if (contentArea.type === "text") {
          this.userState.focusDepth = Math.min(this.userState.focusDepth + 0.2, 1.0);
        }

        this.updateUserInteractionState();
      });

      element.addEventListener("mouseleave", () => {
        const leaveTime = Date.now();
        const dwellTime = leaveTime - enterTime;
        
        // Update dwell time tracking
        this.userState.dwellTime = dwellTime;
        contentArea.readingIntensity = Math.min(dwellTime / 5000, 1.0); // 5 seconds max
        
        // Calculate content engagement based on dwell time and content type
        if (contentArea.type === "text" && dwellTime > 1000) {
          this.userState.contentEngagement = Math.min(this.userState.contentEngagement + 0.1, 1.0);
          contentArea.contextualImportance = Math.min(contentArea.contextualImportance + 0.05, 1.0);
        }
        
        // Update adaptive protection based on engagement
        if (dwellTime > 3000) { // User spent significant time
          const currentProtection = this.adaptiveProtectionMap.get(element) || contentArea.protectionLevel;
          this.adaptiveProtectionMap.set(element, Math.min(currentProtection + 0.05, 0.98));
        }
        
        this.userState.isHovering = false;
        this.userState.interactionTarget = null;
        this.userState.focusDepth = Math.max(this.userState.focusDepth - 0.05, 0.1);
        
        this.updateUserInteractionState();
      });
    });

    // Enhanced reading mode detection with visualEffects adaptation
    document.addEventListener("mousemove", () => {
      clearTimeout(this.readingModeTimer);
      this.userState.readingModeActive = false;
      
      // Adjust current mode based on interaction patterns
      if (this.userState.focusDepth > 0.7) {
        this.userState.currentMode = "reading";
      } else if (this.userState.scrollVelocity > 1000) {
        this.userState.currentMode = "browsing";
      } else {
        this.userState.currentMode = "exploring";
      }

      // Adaptive reading mode detection based on content type and user behavior
      const detectionTime = this.userState.currentMode === "reading" ? 1500 : 2000;
      
      this.readingModeTimer = window.setTimeout(() => {
        if (
          this.userState.interactionTarget &&
          this.contentAreas.has(this.userState.interactionTarget)
        ) {
          this.userState.readingModeActive = true;
          this.userState.currentMode = "reading";
          this.userState.focusDepth = Math.min(this.userState.focusDepth + 0.3, 1.0);
          
          // Enhance protection for current reading area
          const contentArea = this.contentAreas.get(this.userState.interactionTarget);
          if (contentArea && contentArea.type === "text") {
            const currentProtection = this.adaptiveProtectionMap.get(this.userState.interactionTarget) || contentArea.protectionLevel;
            this.adaptiveProtectionMap.set(this.userState.interactionTarget, Math.min(currentProtection + 0.1, 0.98));
          }
          
          this.updateUserInteractionState();
        }
      }, detectionTime);
    });
    
    // Ambient mode detection (user inactive)
    let ambientTimer: number;
    const resetAmbientTimer = () => {
      clearTimeout(ambientTimer);
      ambientTimer = window.setTimeout(() => {
        this.userState.currentMode = "ambient";
        this.userState.focusDepth = Math.max(this.userState.focusDepth - 0.5, 0.1);
        this.updateUserInteractionState();
      }, 30000); // 30 seconds of inactivity
    };
    
    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, resetAmbientTimer, { passive: true });
    });
    
    resetAmbientTimer();

    // Musical visualEffects sync
    document.addEventListener("music-state-change", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.syncWithMusic(customEvent.detail);
      }
    });

    // Beat detection for visualEffects pulsing
    document.addEventListener("beat-detected", () => {
      this.handleBeatPulse();
    });
  }

  /**
   * Initialize CSS visualEffects variables
   */
  private initializeVisualEffectsVariables(): void {
    // Set initial visualEffects state using coordination
    const initialVariables = {
      "--sn-visual-effects-system-active": "1",
      "--sn-visual-effects-content-protection-level": "0.95",
      "--sn-visual-effects-chrome-enhancement-level": "2.0",
      "--sn-visual-effects-field-animation-rate": "4s",
      "--sn-music-energy-level": "0.5",
      "--sn-feature-reading-mode-active": "0",
      "--sn-visual-effects-user-interaction-detected": "0",
    };

    this.cssController.batchSetVariables(
      "DepthVisualEffectsController",
      initialVariables,
      "normal",
      "visualEffects-initialization"
    );
  }

  /**
   * Start visualEffects update loop
   */
  private startVisualEffectsUpdate(): void {
    const updateVisualEffects = () => {
      if (!this.isActive) return;

      const now = performance.now();
      if (now - this.lastUpdate >= this.updateThreshold) {
        this.updateVisualEffectsState();
        this.lastUpdate = now;
      }

      requestAnimationFrame(updateVisualEffects);
    };

    updateVisualEffects();
  }

  /**
   * Enhanced visualEffects state update with advanced awareness patterns
   */
  private updateVisualEffectsState(): void {
    const root = document.documentElement;

    // Advanced visualEffects intensity calculation
    const baseIntensity = this.visualEffectsIntensity;
    const musicalModifier = this.musicalState.energy * this.musicalState.musicSyncStrength * 0.3;
    const interactionModifier = this.calculateInteractionModifier();
    const contextualModifier = this.calculateContextualModifier();
    const emotionalModifier = this.musicalState.emotionalTemperature * 0.2;
    
    const finalVisualEffectsIntensity = Math.max(
      0.05,
      Math.min(1.0, baseIntensity + musicalModifier + interactionModifier + contextualModifier + emotionalModifier)
    );

    // Update enhanced CSS variables using coordination
    const visualEffectsVariables = {
      "--sn-visual-effects-field-intensity": finalVisualEffectsIntensity.toString(),
      "--sn-visual-effects-level": this.visualEffectsIntensity.toString(),
      "--sn-visual-effects-awareness-level": this.userState.focusDepth.toString(),
      "--sn-music-energy-level": this.musicalState.energy.toString(),
      "--sn-visual-effects-music-sync-strength": this.musicalState.musicSyncStrength.toString(),
      "--sn-color-shift-temperature": this.musicalState.emotionalTemperature.toString(),
      "--sn-feature-reading-mode-active": this.userState.readingModeActive ? "1" : "0",
      "--sn-visual-effects-user-interaction-detected": 
        this.userState.isScrolling || this.userState.isHovering ? "1" : "0",
      "--sn-visual-effects-interaction-mode": this.getModeNumericValue(this.userState.currentMode).toString(),
      "--sn-visual-effects-focus-depth": this.userState.focusDepth.toString(),
      "--sn-visual-effects-content-engagement": this.userState.contentEngagement.toString(),
      "--sn-visual-effects-scroll-velocity": Math.min(this.userState.scrollVelocity / 2000, 1.0).toString(),
      "--sn-visual-effects-dwell-time-factor": Math.min(this.userState.dwellTime / 5000, 1.0).toString(),
      "--sn-visual-effects-interaction-pattern": this.getPatternNumericValue(this.userState.interactionPattern).toString(),
      "--sn-visual-effects-temporal-flow-direction-x": (Math.sin(Date.now() * 0.0001) * 0.5 + 0.5).toString(),
      "--sn-visual-effects-temporal-flow-direction-y": (Math.cos(Date.now() * 0.0001) * 0.5 + 0.5).toString(),
      "--sn-visual-effects-memory-intensity": this.musicalState.musicalMemoryPatterns.toString(),
      "--sn-visual-effects-fluidity-index": this.calculateSurfaceFluidityIndex().toString(),
      "--sn-visual-effects-genre-shift": this.calculateGenreVisualEffectsShift().toString(),
    };

    this.cssController.batchSetVariables(
      "DepthVisualEffectsController",
      visualEffectsVariables,
      "normal",
      "visualEffects-state-update"
    );

    // Update music energy class (CSS classes need direct manipulation)
    root.classList.remove("music-energy-high", "music-energy-calm");
    if (this.musicalState.energy > 0.7) {
      root.classList.add("music-energy-high");
    } else if (this.musicalState.energy < 0.3) {
      root.classList.add("music-energy-calm");
    }

    // Update user interaction attributes (attributes need direct manipulation)
    root.setAttribute(
      "data-user-interacting",
      (this.userState.isScrolling || this.userState.isHovering).toString()
    );
    root.setAttribute(
      "data-reading-mode",
      this.userState.readingModeActive.toString()
    );
  }

  /**
   * Update user interaction state
   */
  private updateUserInteractionState(): void {
    // Immediate update for responsive visualEffects
    this.updateVisualEffectsState();
  }

  /**
   * Sync visualEffects with musical state
   */
  private syncWithMusic(musicState: Partial<MusicalVisualEffectsState>): void {
    Object.assign(this.musicalState, musicState);

    // Adjust visualEffects breath rate based on tempo
    if (musicState.tempo) {
      const breathRate = Math.max(
        2,
        Math.min(8, (60 / (musicState.tempo / 60)) * 4)
      );
      
      this.cssController.setVariable(
        "DepthVisualEffectsController",
        "--sn-visual-effects-field-animation-rate",
        `${breathRate}s`,
        "high", // High priority for musical sync
        "musical-tempo-sync"
      );
    }

    // Immediate visualEffects update
    this.updateVisualEffectsState();

    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      `Musical visualEffects sync: energy=${musicState.energy}, tempo=${musicState.tempo}`
    );
  }

  /**
   * Handle beat pulse for visualEffects effects
   */
  private handleBeatPulse(): void {
    if (this.userState.readingModeActive) return; // No pulses during reading

    // Brief visualEffects pulse on beat
    const root = document.documentElement;
    const currentIntensity = parseFloat(
      root.style.getPropertyValue("--sn-visual-effects-field-intensity") || "0.5"
    );
    const pulseIntensity = Math.min(1, currentIntensity + 0.1);

    // Use high priority for beat pulse (time-critical for musical sync)
    this.cssController.setVariable(
      "DepthVisualEffectsController",
      "--sn-visual-effects-field-intensity",
      pulseIntensity.toString(),
      "high",
      "beat-pulse"
    );

    // Return to normal after brief pulse
    setTimeout(() => {
      if (this.isActive) {
        this.updateVisualEffectsState();
      }
    }, 100);
  }

  /**
   * Dynamically add content protection to new elements
   */
  public protectNewContent(element: Element): void {
    if (this.contentAreas.has(element)) return;

    const contentArea: ContentArea = {
      element,
      type: this.determineContentType(element),
      protectionLevel: this.calculateProtectionLevel(element),
      lastInteraction: 0,
      visualEffectsLevel: 0.5, // Initial visualEffects adaptation level
      readingIntensity: 0, // No reading detected initially
      contextualImportance: this.calculateProtectionLevel(element), // Use protection level as initial importance
      adaptiveProtection: 0.5, // Start with moderate adaptive protection
    };

    this.contentAreas.set(element, contentArea);
    element.classList.add("content-sanctuary");
    element.setAttribute("data-visualEffects-protected", "true");
    element.setAttribute("data-content-type", contentArea.type);

    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      `Protected new content element: ${element.tagName}.${element.className}`
    );
  }

  /**
   * Enhanced chrome area
   */
  public enhanceNewChrome(element: Element): void {
    if (this.chromeAreas.has(element)) return;

    this.chromeAreas.add(element);
    element.classList.add("ui-chrome-area");
    element.setAttribute("data-visualEffects-enhanced", "true");

    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      `Enhanced new chrome element: ${element.tagName}.${element.className}`
    );
  }

  /**
   * Force reading mode for accessibility
   */
  public forceReadingMode(active: boolean): void {
    this.userState.readingModeActive = active;
    this.updateUserInteractionState();

    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      `Reading mode ${active ? "activated" : "deactivated"}`
    );
  }

  /**
   * Get visualEffects metrics for monitoring
   */
  public getVisualEffectsMetrics() {
    return {
      contentAreas: this.contentAreas.size,
      chromeAreas: this.chromeAreas.size,
      visualEffectsIntensity: parseFloat(
        document.documentElement.style.getPropertyValue(
          "--sn-visual-effects-field-intensity"
        ) || "0.5"
      ),
      readingModeActive: this.userState.readingModeActive,
      userInteracting: this.userState.isScrolling || this.userState.isHovering,
      musicalEnergy: this.musicalState.energy,
    };
  }

  public updateAnimation(deltaTime: number): void {
    // No animation frame updates needed - this system uses interval-based updates
    // via startVisualEffectsUpdate() which runs on its own timer
  }

  protected override async performSystemHealthCheck(): Promise<{
    healthy: boolean;
    details?: string;
    issues?: string[];
    metrics?: Record<string, any>;
  }> {
    const metrics = this.getVisualEffectsMetrics();
    const isHealthy = metrics.contentAreas > 0 && metrics.chromeAreas > 0;

    return {
      healthy: isHealthy,
      details: `DepthVisualEffectsController: ${metrics.contentAreas} content areas, ${metrics.chromeAreas} chrome areas`,
      issues: isHealthy
        ? []
        : ["VisualEffects system not properly initialized"],
      metrics: {
        visualEffectsLevel: metrics.contentAreas > 0 ? 1 : 0,
        protectedAreas: metrics.contentAreas,
        enhancedAreas: metrics.chromeAreas,
        musicalEnergy: metrics.musicalEnergy,
        initialized: this.initialized,
      },
    };
  }

  protected override performVisualSystemCleanup(): void {

    // Clear timers
    clearTimeout(this.readingModeTimer);
    clearTimeout(this.interactionTimer);

    // Remove visualEffects classes and attributes
    this.contentAreas.forEach((_, element) => {
      element.classList.remove("content-sanctuary");
      element.removeAttribute("data-visualEffects-protected");
      element.removeAttribute("data-content-type");
    });

    this.chromeAreas.forEach((element) => {
      element.classList.remove("ui-chrome-area");
      element.removeAttribute("data-visualEffects-enhanced");
    });

    // Reset CSS variables using coordination
    const resetVariables = {
      "--sn-visual-effects-system-active": "",
      "--sn-visual-effects-field-intensity": "",
      "--sn-feature-reading-mode-active": "",
      "--sn-visual-effects-user-interaction-detected": "",
      "--sn-visual-effects-field-animation-rate": "",
      "--sn-music-energy-level": "",
      "--sn-visual-effects-content-protection-level": "",
      "--sn-visual-effects-chrome-enhancement-level": "",
    };

    this.cssController.batchSetVariables(
      "DepthVisualEffectsController",
      resetVariables,
      "critical", // Critical priority for cleanup
      "system-cleanup"
    );

    // Clean up CSS classes and attributes (direct DOM manipulation required)
    const root = document.documentElement;
    root.classList.remove("music-energy-high", "music-energy-calm");
    root.removeAttribute("data-user-interacting");
    root.removeAttribute("data-reading-mode");

    Y3KDebug?.debug?.log(
      "DepthVisualEffectsController",
      "VisualEffects system deactivated"
    );
  }
}
