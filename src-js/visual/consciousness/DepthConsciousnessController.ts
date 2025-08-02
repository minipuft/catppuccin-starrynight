/**
 * DepthConsciousnessController - Year 3000 Organic Intelligence
 * 
 * Manages content-aware consciousness effects that adapt to user behavior,
 * musical energy, and interface context for optimal readability and beauty.
 * 
 * Philosophy: "Consciousness that enhances human experience through intelligent,
 * beautiful interfaces that adapt to serve the user's current need."
 */

import { Y3K } from '@/debug/UnifiedDebugManager';
import type { HealthCheckResult } from '@/types/HealthCheck';
import { BaseVisualSystem } from '../base/BaseVisualSystem';
import { YEAR3000_CONFIG } from '@/config/globalConfig';
import * as Utils from '@/utils/core/Year3000Utilities';

interface ContentArea {
  element: Element;
  type: 'text' | 'interactive' | 'visual' | 'chrome';
  protectionLevel: number; // 0-1
  lastInteraction: number;
}

interface MusicalConsciousnessState {
  energy: number; // 0-1
  valence: number; // 0-1
  instrumental: boolean;
  tempo: number;
  genre?: string;
}

interface UserInteractionState {
  isScrolling: boolean;
  isHovering: boolean;
  lastInteractionTime: number;
  readingModeActive: boolean;
  interactionTarget: Element | null;
}

export class DepthConsciousnessController extends BaseVisualSystem {
  private contentAreas: Map<Element, ContentArea> = new Map();
  private chromeAreas: Set<Element> = new Set();
  private userState: UserInteractionState = {
    isScrolling: false,
    isHovering: false,
    lastInteractionTime: 0,
    readingModeActive: false,
    interactionTarget: null,
  };
  
  private musicalState: MusicalConsciousnessState = {
    energy: 0.5,
    valence: 0.5,
    instrumental: false,
    tempo: 120,
  };
  
  private readingModeTimer: number = 0;
  private interactionTimer: number = 0;
  private consciousnessUpdateInterval: number = 0;
  
  // Performance optimization
  private lastUpdate = 0;
  private updateThreshold = 100; // Max 10fps for consciousness updates
  
  constructor(
    config = YEAR3000_CONFIG,
    utils = Utils,
    performanceMonitor: any = null,
    musicSyncService: any = null,
    settingsManager: any = null
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    try {
      this.detectContentAndChromeAreas();
      this.setupInteractionListeners();
      this.initializeConsciousnessVariables();
      this.startConsciousnessUpdate();
      
      Y3K?.debug?.log('DepthConsciousnessController', 'Consciousness system awakened');
    } catch (error) {
      Y3K?.debug?.error('DepthConsciousnessController', 'Failed to initialize consciousness:', error);
    }
  }
  
  /**
   * Detect content areas that need protection and chrome areas that can handle full effects
   */
  private detectContentAndChromeAreas(): void {
    // Content areas requiring protection
    const contentSelectors = [
      '.main-view-container__scroll-node',
      '.main-trackList-trackListRow',
      '[data-testid*="tracklist"]',
      '[data-testid*="playlist"]',
      '.main-entityHeader-titleText',
      '.main-entityHeader-subtitle',
      '.main-trackList-rowTitle',
      '.main-trackList-rowSubTitle',
      'h1, h2, h3, h4, h5, h6',
      'p',
      '.lyrics-lyricsContainer-container',
    ];
    
    // UI chrome areas that can handle enhanced effects
    const chromeSelectors = [
      '.Root__nav-bar',
      '.Root__top-bar', 
      '.Root__now-playing-bar',
      '.main-topBar-container',
      '.main-navBar-navBar',
      '.main-entityHeader-container',
      '.main-actionBar-container',
    ];
    
    // Detect and categorize content areas
    contentSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const contentArea: ContentArea = {
          element,
          type: this.determineContentType(element),
          protectionLevel: this.calculateProtectionLevel(element),
          lastInteraction: 0,
        };
        
        this.contentAreas.set(element, contentArea);
        element.classList.add('content-sanctuary');
        
        // Add content-aware data attributes
        element.setAttribute('data-consciousness-protected', 'true');
        element.setAttribute('data-content-type', contentArea.type);
      });
    });
    
    // Detect and mark chrome areas
    chromeSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        this.chromeAreas.add(element);
        element.classList.add('ui-chrome-area');
        element.setAttribute('data-consciousness-enhanced', 'true');
      });
    });
    
    Y3K?.debug?.log('DepthConsciousnessController', 
      `Detected ${this.contentAreas.size} content areas and ${this.chromeAreas.size} chrome areas`);
  }
  
  /**
   * Determine content type for appropriate protection level
   */
  private determineContentType(element: Element): ContentArea['type'] {
    if (element.matches('h1, h2, h3, h4, h5, h6, .main-entityHeader-titleText')) {
      return 'text';
    }
    
    if (element.matches('button, a, [role="button"], [tabindex], input, select')) {
      return 'interactive';
    }
    
    if (element.matches('.main-image-container, .main-entityHeader-image, .cover-art')) {
      return 'visual';
    }
    
    if (element.matches('.Root__nav-bar, .Root__top-bar, .main-topBar-container')) {
      return 'chrome';
    }
    
    return 'text'; // Default to text protection
  }
  
  /**
   * Calculate protection level based on content type and context
   */
  private calculateProtectionLevel(element: Element): number {
    const contentType = this.determineContentType(element);
    
    switch (contentType) {
      case 'text':
        return 0.95; // High protection for text
      case 'interactive':
        return 0.9; // High protection for interactive elements
      case 'visual':
        return 0.6; // Moderate protection for visual content
      case 'chrome':
        return 0.3; // Low protection for chrome (allow enhancement)
      default:
        return 0.85; // Safe default
    }
  }
  
  /**
   * Setup interaction listeners for consciousness awareness
   */
  private setupInteractionListeners(): void {
    // Scroll detection
    let scrollTimer: number;
    document.addEventListener('scroll', () => {
      this.userState.isScrolling = true;
      this.userState.lastInteractionTime = Date.now();
      
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        this.userState.isScrolling = false;
      }, 150);
      
      this.updateUserInteractionState();
    }, { passive: true });
    
    // Hover detection on content areas
    this.contentAreas.forEach((contentArea, element) => {
      element.addEventListener('mouseenter', () => {
        this.userState.isHovering = true;
        this.userState.interactionTarget = element;
        this.userState.lastInteractionTime = Date.now();
        
        // Update interaction time for this specific area
        contentArea.lastInteraction = Date.now();
        
        this.updateUserInteractionState();
      });
      
      element.addEventListener('mouseleave', () => {
        this.userState.isHovering = false;
        this.userState.interactionTarget = null;
        this.updateUserInteractionState();
      });
    });
    
    // Reading mode detection (user pauses on content)
    document.addEventListener('mousemove', () => {
      clearTimeout(this.readingModeTimer);
      this.userState.readingModeActive = false;
      
      // If user stops moving mouse for 2 seconds over content, activate reading mode
      this.readingModeTimer = window.setTimeout(() => {
        if (this.userState.interactionTarget && 
            this.contentAreas.has(this.userState.interactionTarget)) {
          this.userState.readingModeActive = true;
          this.updateUserInteractionState();
        }
      }, 2000);
    });
    
    // Musical consciousness sync
    document.addEventListener('music-state-change', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        this.syncWithMusic(customEvent.detail);
      }
    });
    
    // Beat detection for consciousness pulsing
    document.addEventListener('beat-detected', () => {
      this.handleBeatPulse();
    });
  }
  
  /**
   * Initialize CSS consciousness variables
   */
  private initializeConsciousnessVariables(): void {
    const root = document.documentElement;
    
    // Set initial consciousness state
    root.style.setProperty('--consciousness-system-active', '1');
    root.style.setProperty('--content-protection-level', '0.95');
    root.style.setProperty('--chrome-enhancement-level', '2.0');
    root.style.setProperty('--consciousness-breath-rate', '4s');
    root.style.setProperty('--musical-sync-intensity', '0.5');
    root.style.setProperty('--reading-mode-active', '0');
    root.style.setProperty('--user-interaction-detected', '0');
  }
  
  /**
   * Start consciousness update loop
   */
  private startConsciousnessUpdate(): void {
    const updateConsciousness = () => {
      if (!this.isActive) return;
      
      const now = performance.now();
      if (now - this.lastUpdate >= this.updateThreshold) {
        this.updateConsciousnessState();
        this.lastUpdate = now;
      }
      
      requestAnimationFrame(updateConsciousness);
    };
    
    updateConsciousness();
  }
  
  /**
   * Update consciousness state based on current conditions
   */
  private updateConsciousnessState(): void {
    const root = document.documentElement;
    
    // Calculate adaptive consciousness intensity
    const baseIntensity = 0.5;
    const musicalModifier = this.musicalState.energy * 0.3;
    const interactionModifier = this.userState.isHovering ? -0.2 : 0;
    const readingModifier = this.userState.readingModeActive ? -0.4 : 0;
    
    const consciousnessIntensity = Math.max(0.1, 
      baseIntensity + musicalModifier + interactionModifier + readingModifier
    );
    
    // Update CSS variables
    root.style.setProperty('--consciousness-intensity', consciousnessIntensity.toString());
    root.style.setProperty('--musical-sync-intensity', this.musicalState.energy.toString());
    root.style.setProperty('--reading-mode-active', this.userState.readingModeActive ? '1' : '0');
    root.style.setProperty('--user-interaction-detected', 
      (this.userState.isScrolling || this.userState.isHovering) ? '1' : '0');
    
    // Update music energy class
    root.classList.remove('music-energy-high', 'music-energy-calm');
    if (this.musicalState.energy > 0.7) {
      root.classList.add('music-energy-high');
    } else if (this.musicalState.energy < 0.3) {
      root.classList.add('music-energy-calm');
    }
    
    // Update user interaction attributes
    root.setAttribute('data-user-interacting', 
      (this.userState.isScrolling || this.userState.isHovering).toString());
    root.setAttribute('data-reading-mode', this.userState.readingModeActive.toString());
  }
  
  /**
   * Update user interaction state
   */
  private updateUserInteractionState(): void {
    // Immediate update for responsive consciousness
    this.updateConsciousnessState();
  }
  
  /**
   * Sync consciousness with musical state
   */
  private syncWithMusic(musicState: Partial<MusicalConsciousnessState>): void {
    Object.assign(this.musicalState, musicState);
    
    // Adjust consciousness breath rate based on tempo
    if (musicState.tempo) {
      const breathRate = Math.max(2, Math.min(8, 60 / (musicState.tempo / 60) * 4));
      document.documentElement.style.setProperty('--consciousness-breath-rate', `${breathRate}s`);
    }
    
    // Immediate consciousness update
    this.updateConsciousnessState();
    
    Y3K?.debug?.log('DepthConsciousnessController', 
      `Musical consciousness sync: energy=${musicState.energy}, tempo=${musicState.tempo}`);
  }
  
  /**
   * Handle beat pulse for consciousness effects
   */
  private handleBeatPulse(): void {
    if (this.userState.readingModeActive) return; // No pulses during reading
    
    // Brief consciousness pulse on beat
    const root = document.documentElement;
    const currentIntensity = parseFloat(root.style.getPropertyValue('--consciousness-intensity') || '0.5');
    const pulseIntensity = Math.min(1, currentIntensity + 0.1);
    
    root.style.setProperty('--consciousness-intensity', pulseIntensity.toString());
    
    // Return to normal after brief pulse
    setTimeout(() => {
      if (this.isActive) {
        this.updateConsciousnessState();
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
    };
    
    this.contentAreas.set(element, contentArea);
    element.classList.add('content-sanctuary');
    element.setAttribute('data-consciousness-protected', 'true');
    element.setAttribute('data-content-type', contentArea.type);
    
    Y3K?.debug?.log('DepthConsciousnessController', 
      `Protected new content element: ${element.tagName}.${element.className}`);
  }
  
  /**
   * Enhanced chrome area
   */
  public enhanceNewChrome(element: Element): void {
    if (this.chromeAreas.has(element)) return;
    
    this.chromeAreas.add(element);
    element.classList.add('ui-chrome-area');  
    element.setAttribute('data-consciousness-enhanced', 'true');
    
    Y3K?.debug?.log('DepthConsciousnessController', 
      `Enhanced new chrome element: ${element.tagName}.${element.className}`);
  }
  
  /**
   * Force reading mode for accessibility
   */
  public forceReadingMode(active: boolean): void {
    this.userState.readingModeActive = active;
    this.updateUserInteractionState();
    
    Y3K?.debug?.log('DepthConsciousnessController', 
      `Reading mode ${active ? 'activated' : 'deactivated'}`);
  }
  
  /**
   * Get consciousness metrics for monitoring
   */
  public getConsciousnessMetrics() {
    return {
      contentAreas: this.contentAreas.size,
      chromeAreas: this.chromeAreas.size,
      consciousnessIntensity: parseFloat(
        document.documentElement.style.getPropertyValue('--consciousness-intensity') || '0.5'
      ),
      readingModeActive: this.userState.readingModeActive,
      userInteracting: this.userState.isScrolling || this.userState.isHovering,
      musicalEnergy: this.musicalState.energy,
    };
  }
  
  public async healthCheck(): Promise<HealthCheckResult> {
    const metrics = this.getConsciousnessMetrics();
    const isHealthy = metrics.contentAreas > 0 && metrics.chromeAreas > 0;
    
    return {
      healthy: isHealthy,
      issues: isHealthy 
        ? []
        : ['Consciousness system not properly initialized'],
      metrics: {
        consciousnessLevel: metrics.contentAreas > 0 ? 1 : 0,
        protectedAreas: metrics.contentAreas,
        enhancedAreas: metrics.chromeAreas,
        musicalEnergy: metrics.musicalEnergy
      }
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Clear timers
    clearTimeout(this.readingModeTimer);
    clearTimeout(this.interactionTimer);
    
    // Remove consciousness classes and attributes
    this.contentAreas.forEach((_, element) => {
      element.classList.remove('content-sanctuary');
      element.removeAttribute('data-consciousness-protected');
      element.removeAttribute('data-content-type');
    });
    
    this.chromeAreas.forEach(element => {
      element.classList.remove('ui-chrome-area');
      element.removeAttribute('data-consciousness-enhanced');
    });
    
    // Reset CSS variables
    const root = document.documentElement;
    root.style.removeProperty('--consciousness-system-active');
    root.style.removeProperty('--consciousness-intensity');
    root.style.removeProperty('--reading-mode-active');
    root.style.removeProperty('--user-interaction-detected');
    
    root.classList.remove('music-energy-high', 'music-energy-calm');
    root.removeAttribute('data-user-interacting');
    root.removeAttribute('data-reading-mode');
    
    Y3K?.debug?.log('DepthConsciousnessController', 'Consciousness system deactivated');
  }
}