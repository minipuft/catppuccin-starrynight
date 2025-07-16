/**
 * IridescentShimmerEffectsSystem - Oil-on-Water Aesthetic System
 * Part of the Year 3000 System visual pipeline
 * 
 * Creates iridescent shimmer effects that make elements look like oil on water
 * - CSS-first approach using backdrop-filter and blend modes
 * - Lightweight implementation avoiding canvas-based physics
 * - Viewport-optimized using Intersection Observer
 * - Performance-aware with configurable intensity
 */

import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { CSSVariableBatcher } from "@/core/performance/CSSVariableBatcher";
import { PerformanceAnalyzer } from "@/core/performance/PerformanceAnalyzer";
import { Y3K } from "@/debug/SystemHealthMonitor";
import type { Year3000Config } from "@/types/models";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { BaseVisualSystem } from "../base/BaseVisualSystem";

interface ShimmerElement {
  element: HTMLElement;
  shimmerLayer: HTMLElement;
  animationPhase: number;
  intensity: number;
  lastUpdate: number;
  isVisible: boolean;
  bounds: DOMRect;
}

interface ShimmerSettings {
  enabled: boolean;
  intensity: "minimal" | "balanced" | "intense";
  targetSelectors: string[];
  animationSpeed: number;
  colorShift: number;
  opacityRange: [number, number];
  scaleRange: [number, number];
  rotationSpeed: number;
  blurRadius: number;
  saturationBoost: number;
}

interface ShimmerKeyframes {
  shimmer: Keyframe[];
  prism: Keyframe[];
  oilSlick: Keyframe[];
  rainbow: Keyframe[];
}

/**
 * IridescentShimmerEffectsSystem creates oil-on-water shimmer effects
 * - Uses CSS-based animations for optimal performance
 * - Implements viewport-based optimization
 * - Provides configurable intensity levels
 * - Supports accessibility preferences
 */
export class IridescentShimmerEffectsSystem extends BaseVisualSystem {
  private shimmerSettings: ShimmerSettings;
  private shimmerElements: Map<Element, ShimmerElement>;
  private cssVariableBatcher: CSSVariableBatcher;
  private intersectionObserver: IntersectionObserver | null = null;
  private animationFrameId: number | null = null;
  private lastAnimationTime = 0;
  private shimmerKeyframes: ShimmerKeyframes;
  private styleElement: HTMLStyleElement | null = null;
  private prefersReducedMotion = false;
  
  constructor(
    config: Year3000Config = YEAR3000_CONFIG,
    utils: typeof import("@/utils/core/Year3000Utilities"),
    performanceMonitor: PerformanceAnalyzer,
    settingsManager: SettingsManager | null = null
  ) {
    super(config, utils, performanceMonitor, null, settingsManager);
    
    this.shimmerElements = new Map();
    this.cssVariableBatcher = new CSSVariableBatcher();
    
    // Initialize settings
    this.shimmerSettings = {
      enabled: true,
      intensity: "balanced",
      targetSelectors: [
        '.main-entityHeader-container',
        '.main-card-card',
        '.main-playButton-PlayButton',
        '.main-actionBarRow-ActionBarRow',
        '.main-trackList-trackListRow',
        '.main-nowPlayingWidget-nowPlaying'
      ],
      animationSpeed: 0.5,
      colorShift: 30,
      opacityRange: [0.1, 0.3],
      scaleRange: [0.8, 1.2],
      rotationSpeed: 0.2,
      blurRadius: 8,
      saturationBoost: 1.5
    };
    
    // Initialize keyframes
    this.shimmerKeyframes = {
      shimmer: [
        { 
          transform: 'translateX(-100%) translateY(-100%) rotate(0deg) scale(0.8)',
          opacity: '0',
          filter: 'hue-rotate(0deg) saturate(1)'
        },
        { 
          transform: 'translateX(0%) translateY(0%) rotate(45deg) scale(1.1)',
          opacity: '0.3',
          filter: 'hue-rotate(120deg) saturate(1.8)'
        },
        { 
          transform: 'translateX(100%) translateY(100%) rotate(90deg) scale(1.2)',
          opacity: '0.1',
          filter: 'hue-rotate(240deg) saturate(1.3)'
        },
        { 
          transform: 'translateX(200%) translateY(200%) rotate(180deg) scale(0.9)',
          opacity: '0',
          filter: 'hue-rotate(360deg) saturate(1)'
        }
      ],
      prism: [
        { 
          background: 'linear-gradient(45deg, rgba(255,0,150,0.1) 0%, rgba(0,255,255,0.1) 50%, rgba(255,255,0,0.1) 100%)',
          transform: 'rotate(0deg) scale(1)',
          mixBlendMode: 'multiply'
        },
        { 
          background: 'linear-gradient(135deg, rgba(0,255,150,0.15) 0%, rgba(255,0,255,0.15) 50%, rgba(0,150,255,0.15) 100%)',
          transform: 'rotate(120deg) scale(1.1)',
          mixBlendMode: 'screen'
        },
        { 
          background: 'linear-gradient(225deg, rgba(255,150,0,0.12) 0%, rgba(150,255,0,0.12) 50%, rgba(255,0,150,0.12) 100%)',
          transform: 'rotate(240deg) scale(0.9)',
          mixBlendMode: 'overlay'
        },
        { 
          background: 'linear-gradient(315deg, rgba(150,0,255,0.08) 0%, rgba(255,255,0,0.08) 50%, rgba(0,255,150,0.08) 100%)',
          transform: 'rotate(360deg) scale(1)',
          mixBlendMode: 'multiply'
        }
      ],
      oilSlick: [
        { 
          backdropFilter: 'blur(2px) hue-rotate(0deg) saturate(1.5)',
          transform: 'scaleX(1) scaleY(1) rotate(0deg)',
          opacity: '0.8'
        },
        { 
          backdropFilter: 'blur(4px) hue-rotate(90deg) saturate(2.2)',
          transform: 'scaleX(1.05) scaleY(0.95) rotate(2deg)',
          opacity: '0.6'
        },
        { 
          backdropFilter: 'blur(6px) hue-rotate(180deg) saturate(1.8)',
          transform: 'scaleX(0.95) scaleY(1.05) rotate(-2deg)',
          opacity: '0.7'
        },
        { 
          backdropFilter: 'blur(3px) hue-rotate(270deg) saturate(1.3)',
          transform: 'scaleX(1.02) scaleY(0.98) rotate(1deg)',
          opacity: '0.9'
        },
        { 
          backdropFilter: 'blur(2px) hue-rotate(360deg) saturate(1.5)',
          transform: 'scaleX(1) scaleY(1) rotate(0deg)',
          opacity: '0.8'
        }
      ],
      rainbow: [
        { filter: 'hue-rotate(0deg) saturate(1.2) brightness(1.1)' },
        { filter: 'hue-rotate(60deg) saturate(1.8) brightness(1.2)' },
        { filter: 'hue-rotate(120deg) saturate(1.5) brightness(1.1)' },
        { filter: 'hue-rotate(180deg) saturate(1.9) brightness(1.3)' },
        { filter: 'hue-rotate(240deg) saturate(1.4) brightness(1.1)' },
        { filter: 'hue-rotate(300deg) saturate(1.6) brightness(1.2)' },
        { filter: 'hue-rotate(360deg) saturate(1.2) brightness(1.1)' }
      ]
    };
    
    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Listen for settings changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      this.updateShimmerElements();
    });
  }
  
  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();
    
    // Load settings
    this.loadSettings();
    
    // Create CSS styles
    this.createShimmerStyles();
    
    // Setup intersection observer for viewport optimization
    this.setupIntersectionObserver();
    
    // Find and setup shimmer elements
    this.setupShimmerElements();
    
    // Start animation loop
    this.startAnimationLoop();
    
    Y3K?.debug?.log("IridescentShimmerEffectsSystem", "Iridescent shimmer system initialized");
  }
  
  private loadSettings(): void {
    if (!this.settingsManager) return;
    
    try {
      const intensitySetting = this.settingsManager.get('sn-shimmer-intensity' as any);
      if (intensitySetting) {
        this.shimmerSettings.intensity = intensitySetting;
        this.applyIntensitySettings();
      }
      
      const enabledSetting = this.settingsManager.get('sn-shimmer-enabled' as any);
      if (enabledSetting !== undefined) {
        this.shimmerSettings.enabled = enabledSetting;
      }
      
    } catch (error) {
      Y3K?.debug?.warn("IridescentShimmerEffectsSystem", "Failed to load settings:", error);
    }
  }
  
  private applyIntensitySettings(): void {
    switch (this.shimmerSettings.intensity) {
      case "minimal":
        this.shimmerSettings.animationSpeed = 0.3;
        this.shimmerSettings.opacityRange = [0.05, 0.15];
        this.shimmerSettings.colorShift = 15;
        this.shimmerSettings.blurRadius = 4;
        this.shimmerSettings.saturationBoost = 1.2;
        break;
        
      case "balanced":
        this.shimmerSettings.animationSpeed = 0.5;
        this.shimmerSettings.opacityRange = [0.1, 0.3];
        this.shimmerSettings.colorShift = 30;
        this.shimmerSettings.blurRadius = 8;
        this.shimmerSettings.saturationBoost = 1.5;
        break;
        
      case "intense":
        this.shimmerSettings.animationSpeed = 0.8;
        this.shimmerSettings.opacityRange = [0.15, 0.5];
        this.shimmerSettings.colorShift = 60;
        this.shimmerSettings.blurRadius = 12;
        this.shimmerSettings.saturationBoost = 2.0;
        break;
    }
  }
  
  private createShimmerStyles(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      .sn-shimmer-container {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }
      
      .sn-shimmer-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        mix-blend-mode: overlay;
        opacity: var(--sn-shimmer-opacity, 0.2);
      }
      
      .sn-shimmer-prism {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          rgba(255, 0, 150, 0.1) 0%,
          rgba(0, 255, 255, 0.1) 120%,
          rgba(255, 255, 0, 0.1) 240%,
          rgba(255, 0, 150, 0.1) 360%
        );
        animation: sn-shimmer-prism 8s linear infinite;
      }
      
      .sn-shimmer-oil {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(var(--sn-shimmer-blur, 4px)) saturate(var(--sn-shimmer-saturation, 1.5));
        animation: sn-shimmer-oil 12s ease-in-out infinite;
      }
      
      .sn-shimmer-rainbow {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          45deg,
          rgba(255, 0, 150, 0.05) 0%,
          rgba(0, 255, 255, 0.05) 16.66%,
          rgba(255, 255, 0, 0.05) 33.33%,
          rgba(255, 0, 150, 0.05) 50%,
          rgba(0, 255, 255, 0.05) 66.66%,
          rgba(255, 255, 0, 0.05) 83.33%,
          rgba(255, 0, 150, 0.05) 100%
        );
        animation: sn-shimmer-rainbow 6s linear infinite;
      }
      
      @keyframes sn-shimmer-prism {
        0% { transform: rotate(0deg) scale(1); opacity: 0.8; }
        25% { transform: rotate(90deg) scale(1.1); opacity: 0.6; }
        50% { transform: rotate(180deg) scale(0.9); opacity: 0.7; }
        75% { transform: rotate(270deg) scale(1.05); opacity: 0.5; }
        100% { transform: rotate(360deg) scale(1); opacity: 0.8; }
      }
      
      @keyframes sn-shimmer-oil {
        0% { 
          backdrop-filter: blur(2px) hue-rotate(0deg) saturate(1.5);
          transform: scaleX(1) scaleY(1) rotate(0deg);
        }
        25% { 
          backdrop-filter: blur(6px) hue-rotate(90deg) saturate(2.2);
          transform: scaleX(1.02) scaleY(0.98) rotate(1deg);
        }
        50% { 
          backdrop-filter: blur(8px) hue-rotate(180deg) saturate(1.8);
          transform: scaleX(0.98) scaleY(1.02) rotate(-1deg);
        }
        75% { 
          backdrop-filter: blur(4px) hue-rotate(270deg) saturate(1.3);
          transform: scaleX(1.01) scaleY(0.99) rotate(0.5deg);
        }
        100% { 
          backdrop-filter: blur(2px) hue-rotate(360deg) saturate(1.5);
          transform: scaleX(1) scaleY(1) rotate(0deg);
        }
      }
      
      @keyframes sn-shimmer-rainbow {
        0% { filter: hue-rotate(0deg) saturate(1.2) brightness(1.1); }
        16.66% { filter: hue-rotate(60deg) saturate(1.8) brightness(1.2); }
        33.33% { filter: hue-rotate(120deg) saturate(1.5) brightness(1.1); }
        50% { filter: hue-rotate(180deg) saturate(1.9) brightness(1.3); }
        66.66% { filter: hue-rotate(240deg) saturate(1.4) brightness(1.1); }
        83.33% { filter: hue-rotate(300deg) saturate(1.6) brightness(1.2); }
        100% { filter: hue-rotate(360deg) saturate(1.2) brightness(1.1); }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .sn-shimmer-prism,
        .sn-shimmer-oil,
        .sn-shimmer-rainbow {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }
  
  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const shimmerElement = this.shimmerElements.get(entry.target);
          if (shimmerElement) {
            shimmerElement.isVisible = entry.isIntersecting;
            shimmerElement.bounds = entry.boundingClientRect;
            
            // Update shimmer visibility
            if (shimmerElement.isVisible) {
              this.activateShimmer(shimmerElement);
            } else {
              this.deactivateShimmer(shimmerElement);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }
  
  private setupShimmerElements(): void {
    this.shimmerSettings.targetSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.addShimmerToElement(element as HTMLElement);
      });
    });
    
    // Setup mutation observer for dynamic elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.shimmerSettings.targetSelectors.forEach(selector => {
              if (element.matches(selector)) {
                this.addShimmerToElement(element);
              }
              
              // Check child elements
              const childElements = element.querySelectorAll(selector);
              childElements.forEach(child => {
                this.addShimmerToElement(child as HTMLElement);
              });
            });
          }
        });
      });
    });
    
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  private addShimmerToElement(element: HTMLElement): void {
    if (this.shimmerElements.has(element)) return;
    
    // Create shimmer layer
    const shimmerLayer = document.createElement('div');
    shimmerLayer.className = 'sn-shimmer-layer';
    
    // Create shimmer effects
    const prismEffect = document.createElement('div');
    prismEffect.className = 'sn-shimmer-prism';
    
    const oilEffect = document.createElement('div');
    oilEffect.className = 'sn-shimmer-oil';
    
    const rainbowEffect = document.createElement('div');
    rainbowEffect.className = 'sn-shimmer-rainbow';
    
    // Append effects to layer
    shimmerLayer.appendChild(prismEffect);
    shimmerLayer.appendChild(oilEffect);
    shimmerLayer.appendChild(rainbowEffect);
    
    // Add container class to element
    element.classList.add('sn-shimmer-container');
    
    // Insert shimmer layer
    element.appendChild(shimmerLayer);
    
    // Create shimmer element data
    const shimmerElement: ShimmerElement = {
      element,
      shimmerLayer,
      animationPhase: Math.random() * Math.PI * 2,
      intensity: this.getIntensityValue(),
      lastUpdate: 0,
      isVisible: false,
      bounds: element.getBoundingClientRect()
    };
    
    // Store shimmer element
    this.shimmerElements.set(element, shimmerElement);
    
    // Observe for visibility
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
    
    Y3K?.debug?.log("IridescentShimmerEffectsSystem", `Added shimmer to element: ${element.tagName}.${element.className}`);
  }
  
  private getIntensityValue(): number {
    const intensityMap = {
      minimal: 0.3,
      balanced: 0.6,
      intense: 1.0
    };
    return intensityMap[this.shimmerSettings.intensity];
  }
  
  private activateShimmer(shimmerElement: ShimmerElement): void {
    if (this.prefersReducedMotion) {
      // Static shimmer for reduced motion
      shimmerElement.shimmerLayer.style.opacity = '0.1';
      return;
    }
    
    shimmerElement.shimmerLayer.style.opacity = shimmerElement.intensity.toString();
    shimmerElement.lastUpdate = performance.now();
  }
  
  private deactivateShimmer(shimmerElement: ShimmerElement): void {
    shimmerElement.shimmerLayer.style.opacity = '0';
  }
  
  private startAnimationLoop(): void {
    const animate = () => {
      if (!this.isActive) return;
      
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastAnimationTime;
      
      // Throttle to 30 FPS for performance
      if (deltaTime < 33) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      this.lastAnimationTime = currentTime;
      
      // Update shimmer elements
      this.updateShimmerElements();
      
      // Continue animation
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  private updateShimmerElements(): void {
    if (!this.shimmerSettings.enabled || this.prefersReducedMotion) return;
    
    const currentTime = performance.now();
    
    this.shimmerElements.forEach((shimmerElement, element) => {
      if (!shimmerElement.isVisible) return;
      
      // Update animation phase
      shimmerElement.animationPhase += this.shimmerSettings.animationSpeed * 0.01;
      
      // Calculate shimmer properties
      const intensity = shimmerElement.intensity;
      const phase = shimmerElement.animationPhase;
      
      // Update CSS variables
      this.cssVariableBatcher.queueCSSVariableUpdate(
        '--sn-shimmer-opacity',
        (intensity * (0.5 + Math.sin(phase) * 0.3)).toFixed(3)
      );
      
      this.cssVariableBatcher.queueCSSVariableUpdate(
        '--sn-shimmer-blur',
        `${this.shimmerSettings.blurRadius + Math.sin(phase * 0.7) * 2}px`
      );
      
      this.cssVariableBatcher.queueCSSVariableUpdate(
        '--sn-shimmer-saturation',
        (this.shimmerSettings.saturationBoost + Math.cos(phase * 0.5) * 0.3).toFixed(2)
      );
      
      shimmerElement.lastUpdate = currentTime;
    });
  }
  
  public override updateAnimation(deltaTime: number): void {
    // Animation is handled by the animation loop
  }
  
  public async healthCheck(): Promise<{ ok: boolean; details: string }> {
    const elementCount = this.shimmerElements.size;
    const isHealthy = this.shimmerSettings.enabled && elementCount > 0;
    
    return {
      ok: isHealthy,
      details: isHealthy ? 
        `Shimmer system active with ${elementCount} elements` : 
        "Shimmer system inactive"
    };
  }
  
  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();
    
    // Stop animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Clean up intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    
    // Clean up shimmer elements
    this.shimmerElements.forEach((shimmerElement, element) => {
      element.classList.remove('sn-shimmer-container');
      if (shimmerElement.shimmerLayer.parentNode) {
        shimmerElement.shimmerLayer.parentNode.removeChild(shimmerElement.shimmerLayer);
      }
    });
    
    this.shimmerElements.clear();
    
    // Remove style element
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }
  
  // Public API
  public setShimmerIntensity(intensity: "minimal" | "balanced" | "intense"): void {
    this.shimmerSettings.intensity = intensity;
    this.applyIntensitySettings();
    this.updateShimmerElements();
  }
  
  public setShimmerEnabled(enabled: boolean): void {
    this.shimmerSettings.enabled = enabled;
    this.updateShimmerElements();
  }
  
  public addShimmerTarget(selector: string): void {
    if (!this.shimmerSettings.targetSelectors.includes(selector)) {
      this.shimmerSettings.targetSelectors.push(selector);
      
      // Setup shimmer for new target
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        this.addShimmerToElement(element as HTMLElement);
      });
    }
  }
  
  public removeShimmerTarget(selector: string): void {
    const index = this.shimmerSettings.targetSelectors.indexOf(selector);
    if (index > -1) {
      this.shimmerSettings.targetSelectors.splice(index, 1);
      
      // Remove shimmer from elements
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const shimmerElement = this.shimmerElements.get(element);
        if (shimmerElement) {
          this.shimmerElements.delete(element);
          if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(element);
          }
          element.classList.remove('sn-shimmer-container');
          if (shimmerElement.shimmerLayer.parentNode) {
            shimmerElement.shimmerLayer.parentNode.removeChild(shimmerElement.shimmerLayer);
          }
        }
      });
    }
  }
  
  public getShimmerSettings(): ShimmerSettings {
    return { ...this.shimmerSettings };
  }
  
  public getShimmerElementCount(): number {
    return this.shimmerElements.size;
  }
}