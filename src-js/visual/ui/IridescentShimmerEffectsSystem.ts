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

import { ADVANCED_SYSTEM_CONFIG } from "@/config/globalConfig";
import { OptimizedCSSVariableManager, getGlobalOptimizedCSSController } from "@/core/performance/OptimizedCSSVariableManager";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import type {
  PerformanceMetrics,
  QualityCapability,
  QualityLevel,
  QualityScalingCapable,
} from "@/core/performance/SimplePerformanceCoordinator";
import type { HealthCheckResult } from "@/types/systems";
import { Y3KDebug } from "@/debug/UnifiedDebugManager";
import type { AdvancedSystemConfig, Year3000Config } from "@/types/models";
import { BaseVisualSystem } from "../base/BaseVisualSystem";

interface ShimmerElement {
  element: HTMLElement;
  shimmerLayer: HTMLElement;
  animationPhase: number;
  intensity: number;
  lastUpdate: number;
  isVisible: boolean;
  bounds: DOMRect;
  animation?: Animation; // Optional animation for playback rate control
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
  // Enhanced oil-on-water effects
  oilSlickIntensity: number;
  chromaticAberration: number;
  refractionStrength: number;
  interferencePattern: boolean;
  surfaceTension: number;
  // Performance optimization
  useGPUAcceleration: boolean;
  maxSimultaneousShimmers: number;
  adaptiveQuality: boolean;
  poolingEnabled: boolean;
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
export class IridescentShimmerEffectsSystem
  extends BaseVisualSystem
  implements QualityScalingCapable
{
  private shimmerSettings: ShimmerSettings;
  private shimmerElements: Map<Element, ShimmerElement>;
  private cssController: OptimizedCSSVariableManager;
  private intersectionObserver: IntersectionObserver | null = null;
  private animationFrameId: number | null = null;
  private lastAnimationTime = 0;
  private shimmerKeyframes: ShimmerKeyframes;
  private styleElement: HTMLStyleElement | null = null;
  private prefersReducedMotion = false;

  // Quality scaling properties
  private currentQualityLevel: QualityLevel | null = null;
  private qualityCapabilities: QualityCapability[] = [
    {
      name: "shimmer-effects",
      enabled: true,
      qualityLevel: "medium",
    },
    {
      name: "oil-slick-intensity",
      enabled: true,
      qualityLevel: "medium",
    },
    {
      name: "chromatic-aberration",
      enabled: true,
      qualityLevel: "low",
    },
    {
      name: "interference-patterns",
      enabled: true,
      qualityLevel: "low",
    },
    {
      name: "gpu-acceleration",
      enabled: true,
      qualityLevel: "medium",
    },
    { name: "element-pooling", enabled: true, qualityLevel: "low" },
  ];
  private qualityAdjustments: { [key: string]: number } = {};

  constructor(
    config: AdvancedSystemConfig | Year3000Config = ADVANCED_SYSTEM_CONFIG,
    utils: typeof import("@/utils/core/ThemeUtilities"),
    performanceMonitor: SimplePerformanceCoordinator
  ) {
    super(config, utils, performanceMonitor, null);

    this.shimmerElements = new Map();
    // Initialize CSS Controller - get from Year3000System or global instance
    try {
      this.cssController = getGlobalOptimizedCSSController();
    } catch (error) {
      Y3KDebug?.debug?.warn(
        "IridescentShimmerEffectsSystem",
        "OptimizedCSSVariableManager not available:",
        error
      );
      throw error;
    }

    // Initialize settings with enhanced oil-on-water effects
    // Phase 2.2: Unified .sn-card selector added (applied by CardDOMWatcher)
    this.shimmerSettings = {
      enabled: true,
      intensity: "balanced",
      targetSelectors: [
        ".main-entityHeader-container",
        ".sn-card", // Unified selector (CardDOMWatcher)
        ".main-card-card", // Legacy selector (kept for transition)
        ".main-playButton-PlayButton",
        ".main-actionBarRow-ActionBarRow",
        ".main-trackList-trackListRow",
        ".main-nowPlayingWidget-nowPlaying",
      ],
      animationSpeed: 0.5,
      colorShift: 30,
      opacityRange: [0.1, 0.3],
      scaleRange: [0.8, 1.2],
      rotationSpeed: 0.2,
      blurRadius: 8,
      saturationBoost: 1.5,
      // Enhanced oil-on-water effects
      oilSlickIntensity: 0.7,
      chromaticAberration: 2.0,
      refractionStrength: 1.5,
      interferencePattern: true,
      surfaceTension: 0.8,
      // Performance optimization
      useGPUAcceleration: true,
      maxSimultaneousShimmers: 12,
      adaptiveQuality: true,
      poolingEnabled: true,
    };

    // Initialize keyframes
    this.shimmerKeyframes = {
      shimmer: [
        {
          transform:
            "translateX(-100%) translateY(-100%) rotate(0deg) scale(0.8)",
          opacity: "0",
          filter: "hue-rotate(0deg) saturate(1)",
        },
        {
          transform: "translateX(0%) translateY(0%) rotate(45deg) scale(1.1)",
          opacity: "0.3",
          filter: "hue-rotate(120deg) saturate(1.8)",
        },
        {
          transform:
            "translateX(100%) translateY(100%) rotate(90deg) scale(1.2)",
          opacity: "0.1",
          filter: "hue-rotate(240deg) saturate(1.3)",
        },
        {
          transform:
            "translateX(200%) translateY(200%) rotate(180deg) scale(0.9)",
          opacity: "0",
          filter: "hue-rotate(360deg) saturate(1)",
        },
      ],
      prism: [
        {
          background:
            "linear-gradient(45deg, rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.1) 0%, rgba(var(--spice-rgb-shimmer-secondary, 0, 255, 255), 0.1) 50%, rgba(var(--spice-rgb-shimmer-tertiary, 255, 255, 0), 0.1) 100%)",
          transform: "rotate(0deg) scale(1)",
          mixBlendMode: "multiply",
        },
        {
          background:
            "linear-gradient(135deg, rgba(var(--spice-rgb-shimmer-secondary, 0, 255, 150), 0.12) 0%, rgba(var(--spice-rgb-shimmer-quaternary, 255, 0, 255), 0.12) 50%, rgba(var(--spice-rgb-shimmer-tertiary, 0, 150, 255), 0.12) 100%)",
          transform: "rotate(120deg) scale(1.1)",
          mixBlendMode: "overlay", // Changed from 'screen' to prevent white bleeding
        },
        {
          background:
            "linear-gradient(225deg, rgba(var(--spice-rgb-shimmer-tertiary, 255, 150, 0), 0.12) 0%, rgba(var(--spice-rgb-shimmer-quaternary, 150, 255, 0), 0.12) 50%, rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.12) 100%)",
          transform: "rotate(240deg) scale(0.9)",
          mixBlendMode: "overlay",
        },
        {
          background:
            "linear-gradient(315deg, rgba(var(--spice-rgb-shimmer-quaternary, 150, 0, 255), 0.08) 0%, rgba(var(--spice-rgb-shimmer-tertiary, 255, 255, 0), 0.08) 50%, rgba(var(--spice-rgb-shimmer-secondary, 0, 255, 150), 0.08) 100%)",
          transform: "rotate(360deg) scale(1)",
          mixBlendMode: "multiply",
        },
      ],
      oilSlick: [
        {
          backdropFilter: "blur(2px) hue-rotate(0deg) saturate(1.5)",
          transform: "scaleX(1) scaleY(1) rotate(0deg)",
          opacity: "0.8",
        },
        {
          backdropFilter: "blur(4px) hue-rotate(90deg) saturate(2.2)",
          transform: "scaleX(1.05) scaleY(0.95) rotate(2deg)",
          opacity: "0.6",
        },
        {
          backdropFilter: "blur(6px) hue-rotate(180deg) saturate(1.8)",
          transform: "scaleX(0.95) scaleY(1.05) rotate(-2deg)",
          opacity: "0.7",
        },
        {
          backdropFilter: "blur(3px) hue-rotate(270deg) saturate(1.3)",
          transform: "scaleX(1.02) scaleY(0.98) rotate(1deg)",
          opacity: "0.9",
        },
        {
          backdropFilter: "blur(2px) hue-rotate(360deg) saturate(1.5)",
          transform: "scaleX(1) scaleY(1) rotate(0deg)",
          opacity: "0.8",
        },
      ],
      rainbow: [
        { filter: "hue-rotate(0deg) saturate(1.2) brightness(1.1)" },
        { filter: "hue-rotate(60deg) saturate(1.8) brightness(1.2)" },
        { filter: "hue-rotate(120deg) saturate(1.5) brightness(1.1)" },
        { filter: "hue-rotate(180deg) saturate(1.9) brightness(1.3)" },
        { filter: "hue-rotate(240deg) saturate(1.4) brightness(1.1)" },
        { filter: "hue-rotate(300deg) saturate(1.6) brightness(1.2)" },
        { filter: "hue-rotate(360deg) saturate(1.2) brightness(1.1)" },
      ],
    };

    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Listen for settings changes
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", (e) => {
        this.prefersReducedMotion = e.matches;
        this.updateShimmerElements();
      });
  }

  public override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // CSS controller is already initialized in constructor
    // No additional coordination setup needed

    // Load settings
    this.loadSettings();

    // Create CSS styles
    this.createShimmerStyles();

    // Setup intersection observer for viewport optimization
    this.setupIntersectionObserver();

    // Find and setup shimmer elements
    this.setupShimmerElements();

    // No animation loop needed - using CSS-only animations

    Y3KDebug?.debug?.log(
      "IridescentShimmerEffectsSystem",
      "Iridescent shimmer system initialized"
    );
  }

  private loadSettings(): void {
    // NOTE: Shimmer settings (sn-shimmer-intensity, sn-shimmer-enabled) removed
    // Using default shimmer settings from constructor
    // Future: Could integrate with global settings if shimmer controls are added
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
    this.styleElement = document.createElement("style");
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
        opacity: calc(var(--shimmer-intensity, 0.3) * 0.6);
        will-change: transform, filter;
      }

      /* Single unified shimmer effect - replaces 3 separate layers */
      .sn-shimmer-unified {
        background:
          conic-gradient(
            from var(--shimmer-phase, 0deg) at 50% 50%,
            rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.08) 0%,
            rgba(var(--spice-rgb-shimmer-secondary, 0, 255, 255), 0.12) 25%,
            rgba(var(--spice-rgb-shimmer-tertiary, 255, 255, 0), 0.08) 50%,
            rgba(var(--spice-rgb-shimmer-quaternary, 150, 0, 255), 0.10) 75%,
            rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.08) 100%
          ),
          linear-gradient(
            45deg,
            rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.06) 0%,
            rgba(var(--spice-rgb-shimmer-secondary, 0, 255, 255), 0.04) 50%,
            rgba(var(--spice-rgb-shimmer-primary, 255, 0, 150), 0.06) 100%
          );
        backdrop-filter:
          blur(calc(var(--shimmer-intensity, 0.3) * 6px))
          saturate(calc(1 + var(--shimmer-intensity, 0.3) * 0.8));
        mix-blend-mode: overlay;
        animation:
          sn-shimmer-unified var(--shimmer-duration, 10s) ease-in-out infinite,
          sn-shimmer-rotation calc(var(--shimmer-duration, 10s) * 1.5) linear infinite;
        animation-delay: calc(var(--shimmer-phase, 0deg) / 360deg * var(--shimmer-duration, 10s));
      }

      @keyframes sn-shimmer-unified {
        0%, 100% {
          transform: scale(1) translateX(0%) translateY(0%);
          filter: hue-rotate(0deg) brightness(1.05);
        }
        25% {
          transform: scale(1.02) translateX(0.5%) translateY(-0.5%);
          filter: hue-rotate(90deg) brightness(1.15);
        }
        50% {
          transform: scale(0.98) translateX(-0.3%) translateY(0.3%);
          filter: hue-rotate(180deg) brightness(1.1);
        }
        75% {
          transform: scale(1.01) translateX(0.2%) translateY(-0.2%);
          filter: hue-rotate(270deg) brightness(1.08);
        }
      }

      @keyframes sn-shimmer-rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Performance optimization for reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .sn-shimmer-unified {
          animation: none;
          transform: none;
          filter: none;
          opacity: calc(var(--shimmer-intensity, 0.3) * 0.3);
        }
      }

      /* GPU acceleration hints */
      .sn-shimmer-unified {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `;

    document.head.appendChild(this.styleElement);
  }

  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
        rootMargin: "50px",
        threshold: 0.1,
      }
    );
  }

  private setupShimmerElements(): void {
    this.shimmerSettings.targetSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        this.addShimmerToElement(element as HTMLElement);
      });
    });

    // Setup mutation observer for dynamic elements
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.shimmerSettings.targetSelectors.forEach((selector) => {
              if (element.matches(selector)) {
                this.addShimmerToElement(element);
              }

              // Check child elements
              const childElements = element.querySelectorAll(selector);
              childElements.forEach((child) => {
                this.addShimmerToElement(child as HTMLElement);
              });
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private addShimmerToElement(element: HTMLElement): void {
    if (this.shimmerElements.has(element)) return;

    // Create single optimized shimmer layer with CSS-only animations
    const shimmerLayer = document.createElement("div");
    shimmerLayer.className = "sn-shimmer-layer sn-shimmer-unified";

    // Set CSS variables for per-element customization
    const intensity = this.getIntensityValue();
    const phase = Math.random() * 360; // Random phase offset for variety

    shimmerLayer.style.setProperty("--shimmer-intensity", intensity.toString());
    shimmerLayer.style.setProperty("--shimmer-phase", `${phase}deg`);
    shimmerLayer.style.setProperty(
      "--shimmer-duration",
      `${8 + Math.random() * 4}s`
    ); // Slight variation

    // Add container class to element with minimal DOM impact
    element.classList.add("sn-shimmer-container");

    // Use more efficient insertion method
    element.appendChild(shimmerLayer);

    // Create lightweight shimmer element data (removed unused properties)
    const shimmerElement: ShimmerElement = {
      element,
      shimmerLayer,
      animationPhase: phase,
      intensity,
      lastUpdate: 0,
      isVisible: false,
      bounds: element.getBoundingClientRect(),
    };

    // Store shimmer element
    this.shimmerElements.set(element, shimmerElement);

    // Observe for visibility
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }

    if (this.config.enableDebug) {
      Y3KDebug?.debug?.log(
        "IridescentShimmerEffectsSystem",
        `Added optimized shimmer to ${
          element.tagName
        }.${element.className.substring(0, 20)}`
      );
    }
  }

  private getIntensityValue(): number {
    const intensityMap = {
      minimal: 0.3,
      balanced: 0.6,
      intense: 1.0,
    };
    return intensityMap[this.shimmerSettings.intensity];
  }

  private activateShimmer(shimmerElement: ShimmerElement): void {
    if (this.prefersReducedMotion) {
      // Static shimmer for reduced motion - minimal opacity
      shimmerElement.shimmerLayer.style.setProperty(
        "--shimmer-intensity",
        "0.1"
      );
      shimmerElement.shimmerLayer.style.opacity = "0.1";
      return;
    }

    // CSS-only activation - set intensity and enable
    shimmerElement.shimmerLayer.style.setProperty(
      "--shimmer-intensity",
      shimmerElement.intensity.toString()
    );
    shimmerElement.shimmerLayer.style.opacity = "1";
    shimmerElement.shimmerLayer.style.animationPlayState = "running";
  }

  private deactivateShimmer(shimmerElement: ShimmerElement): void {
    // CSS-only deactivation - pause animations and fade out
    shimmerElement.shimmerLayer.style.opacity = "0";
    shimmerElement.shimmerLayer.style.animationPlayState = "paused";
  }

  /**
   * Update shimmer settings efficiently using CSS variables only
   */
  private updateShimmerElements(): void {
    if (!this.shimmerSettings.enabled) {
      this.disableAllShimmers();
      return;
    }

    // Update CSS variables globally for all shimmers using coordination
    const shimmerGlobalVariables = {
      "--sn-shimmer-global-intensity": this.getIntensityValue().toString(),
      "--sn-shimmer-global-speed": `${this.shimmerSettings.animationSpeed}s`,
      "--sn-shimmer-global-blur": `${this.shimmerSettings.blurRadius}px`
    };

    this.cssController.batchSetVariables(
      "IridescentShimmerEffectsSystem",
      shimmerGlobalVariables,
      "normal", // Normal priority for shimmer settings
      "shimmer-global-settings"
    );

    // Update individual shimmer elements if visibility changed
    this.shimmerElements.forEach((shimmerElement) => {
      if (shimmerElement.isVisible) {
        this.activateShimmer(shimmerElement);
      } else {
        this.deactivateShimmer(shimmerElement);
      }
    });
  }

  /**
   * Efficiently disable all shimmers
   */
  private disableAllShimmers(): void {
    this.shimmerElements.forEach((shimmerElement) => {
      this.deactivateShimmer(shimmerElement);
    });
  }

  public override updateAnimation(deltaTime: number): void {
    // No update needed - animations are handled by CSS only
  }

  public override async healthCheck(): Promise<HealthCheckResult> {
    const isHealthy = this.shimmerSettings.enabled && this.shimmerElements.size > 0;
    
    return {
      system: 'IridescentShimmerEffectsSystem',
      healthy: isHealthy,
      metrics: {
        enabled: this.shimmerSettings.enabled,
        elementCount: this.shimmerElements.size,
        intensity: this.shimmerSettings.intensity,
        initialized: this.initialized
      },
      issues: isHealthy ? [] : [
        ...(this.shimmerSettings.enabled ? [] : ['System disabled']),
        ...(this.shimmerElements.size > 0 ? [] : ['No shimmer elements found'])
      ]
    };
  }

  public override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // No animation loop cleanup needed - using CSS-only animations

    // Clean up intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Clean up shimmer elements
    this.shimmerElements.forEach((shimmerElement, element) => {
      element.classList.remove("sn-shimmer-container");
      if (shimmerElement.shimmerLayer.parentNode) {
        shimmerElement.shimmerLayer.parentNode.removeChild(
          shimmerElement.shimmerLayer
        );
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
  public setShimmerIntensity(
    intensity: "minimal" | "balanced" | "intense"
  ): void {
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
      elements.forEach((element) => {
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
      elements.forEach((element) => {
        const shimmerElement = this.shimmerElements.get(element);
        if (shimmerElement) {
          this.shimmerElements.delete(element);
          if (this.intersectionObserver) {
            this.intersectionObserver.unobserve(element);
          }
          element.classList.remove("sn-shimmer-container");
          if (shimmerElement.shimmerLayer.parentNode) {
            shimmerElement.shimmerLayer.parentNode.removeChild(
              shimmerElement.shimmerLayer
            );
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

  // ========================================================================
  // QUALITY SCALING INTERFACE IMPLEMENTATION
  // ========================================================================

  /**
   * Set quality level for shimmer effects
   */
  public setQualityLevel(level: QualityLevel): void {
    this.currentQualityLevel = level;

    // Adjust shimmer settings based on quality level
    switch (level) {
      case "low":
        this.shimmerSettings.enabled = true;
        this.shimmerSettings.intensity = "minimal";
        this.shimmerSettings.maxSimultaneousShimmers = 5;
        this.shimmerSettings.animationSpeed = 0.3;
        this.shimmerSettings.oilSlickIntensity = 0.4;
        this.shimmerSettings.chromaticAberration = 1.0;
        this.shimmerSettings.useGPUAcceleration = false;
        this.shimmerSettings.interferencePattern = false;
        break;

      case "medium":
        this.shimmerSettings.enabled = true;
        this.shimmerSettings.intensity = "balanced";
        this.shimmerSettings.maxSimultaneousShimmers = 8;
        this.shimmerSettings.animationSpeed = 0.5;
        this.shimmerSettings.oilSlickIntensity = 0.7;
        this.shimmerSettings.chromaticAberration = 2.0;
        this.shimmerSettings.useGPUAcceleration = true;
        this.shimmerSettings.interferencePattern = true;
        break;

      case "high":
        this.shimmerSettings.enabled = true;
        this.shimmerSettings.intensity = "intense";
        this.shimmerSettings.maxSimultaneousShimmers = 12;
        this.shimmerSettings.animationSpeed = 0.7;
        this.shimmerSettings.oilSlickIntensity = 0.9;
        this.shimmerSettings.chromaticAberration = 2.5;
        this.shimmerSettings.useGPUAcceleration = true;
        this.shimmerSettings.interferencePattern = true;
        break;

      case "high":
        this.shimmerSettings.enabled = true;
        this.shimmerSettings.intensity = "intense";
        this.shimmerSettings.maxSimultaneousShimmers = 16;
        this.shimmerSettings.animationSpeed = 1.0;
        this.shimmerSettings.oilSlickIntensity = 1.0;
        this.shimmerSettings.chromaticAberration = 3.0;
        this.shimmerSettings.useGPUAcceleration = true;
        this.shimmerSettings.interferencePattern = true;
        break;
    }

    // Update quality capabilities based on current level
    this.updateQualityCapabilities(level);

    // Apply quality changes to existing shimmer elements
    this.applyQualityToExistingElements();

    Y3KDebug?.debug?.log(
      "IridescentShimmerEffectsSystem",
      `Quality level set to: ${level}`,
      {
        maxShimmers: this.shimmerSettings.maxSimultaneousShimmers,
        oilSlickIntensity: this.shimmerSettings.oilSlickIntensity,
        gpuAcceleration: this.shimmerSettings.useGPUAcceleration,
      }
    );
  }

  /**
   * Get current performance impact metrics
   */
  public getPerformanceImpact(): PerformanceMetrics {
    const activeShimmers = Array.from(this.shimmerElements.values()).filter(
      (el) => el.isVisible
    ).length;
    const averageProcessingTime = this.calculateAverageProcessingTime();
    const memoryUsage = this.estimateMemoryUsage();

    return {
      fps: 60, // CSS-based animations typically maintain 60fps
      frameTime: averageProcessingTime,
      memoryUsage: memoryUsage,
      cpuUsage: this.estimateCPUUsage(activeShimmers),
    };
  }

  /**
   * Reduce quality by specified amount
   */
  public reduceQuality(amount: number): void {
    // Apply quality reduction adjustments
    this.qualityAdjustments["shimmer-reduction"] =
      (this.qualityAdjustments["shimmer-reduction"] || 0) + amount;
    this.qualityAdjustments["animation-reduction"] =
      (this.qualityAdjustments["animation-reduction"] || 0) + amount * 0.8;
    this.qualityAdjustments["effect-reduction"] =
      (this.qualityAdjustments["effect-reduction"] || 0) + amount * 0.6;

    // Apply reductions to current settings
    this.shimmerSettings.maxSimultaneousShimmers = Math.max(
      2,
      Math.floor(
        this.shimmerSettings.maxSimultaneousShimmers * (1 - amount * 0.5)
      )
    );
    this.shimmerSettings.animationSpeed = Math.max(
      0.1,
      this.shimmerSettings.animationSpeed * (1 - amount * 0.4)
    );
    this.shimmerSettings.oilSlickIntensity = Math.max(
      0.2,
      this.shimmerSettings.oilSlickIntensity * (1 - amount * 0.6)
    );
    this.shimmerSettings.chromaticAberration = Math.max(
      0.5,
      this.shimmerSettings.chromaticAberration * (1 - amount * 0.5)
    );

    // Disable GPU acceleration for significant reductions
    if (amount > 0.6) {
      this.shimmerSettings.useGPUAcceleration = false;
    }

    // Disable interference patterns for moderate reductions
    if (amount > 0.4) {
      this.shimmerSettings.interferencePattern = false;
    }

    // Apply changes to existing elements
    this.applyQualityToExistingElements();

    Y3KDebug?.debug?.log(
      "IridescentShimmerEffectsSystem",
      `Quality reduced by ${amount}`,
      this.shimmerSettings
    );
  }

  /**
   * Increase quality by specified amount
   */
  public increaseQuality(amount: number): void {
    // Remove previous reductions first
    Object.keys(this.qualityAdjustments).forEach((key) => {
      this.qualityAdjustments[key] = Math.max(
        0,
        (this.qualityAdjustments[key] || 0) - amount
      );
    });

    // Restore quality settings based on current level
    if (this.currentQualityLevel) {
      const baseSettings = this.getBaseSettingsForLevel(
        this.currentQualityLevel
      );

      // Gradually restore towards base settings
      this.shimmerSettings.maxSimultaneousShimmers = Math.min(
        baseSettings.maxSimultaneousShimmers ||
          this.shimmerSettings.maxSimultaneousShimmers,
        Math.floor(
          this.shimmerSettings.maxSimultaneousShimmers * (1 + amount * 0.3)
        )
      );
      this.shimmerSettings.animationSpeed = Math.min(
        baseSettings.animationSpeed || this.shimmerSettings.animationSpeed,
        this.shimmerSettings.animationSpeed * (1 + amount * 0.2)
      );
      this.shimmerSettings.oilSlickIntensity = Math.min(
        baseSettings.oilSlickIntensity ||
          this.shimmerSettings.oilSlickIntensity,
        this.shimmerSettings.oilSlickIntensity * (1 + amount * 0.3)
      );
      this.shimmerSettings.chromaticAberration = Math.min(
        baseSettings.chromaticAberration ||
          this.shimmerSettings.chromaticAberration,
        this.shimmerSettings.chromaticAberration * (1 + amount * 0.2)
      );

      // Re-enable features if quality is sufficient
      if (amount > 0.3) {
        this.shimmerSettings.interferencePattern =
          baseSettings.interferencePattern || false;
      }
      if (amount > 0.5) {
        this.shimmerSettings.useGPUAcceleration =
          baseSettings.useGPUAcceleration || false;
      }
    }

    // Apply changes to existing elements
    this.applyQualityToExistingElements();

    Y3KDebug?.debug?.log(
      "IridescentShimmerEffectsSystem",
      `Quality increased by ${amount}`,
      this.shimmerSettings
    );
  }

  /**
   * Get quality capabilities for this system
   */
  public getQualityCapabilities(): QualityCapability[] {
    return [...this.qualityCapabilities];
  }

  // ========================================================================
  // QUALITY SCALING HELPER METHODS
  // ========================================================================

  private updateQualityCapabilities(level: QualityLevel): void {
    // Update capability states based on quality level
    this.qualityCapabilities.forEach((capability) => {
      switch (capability.name) {
        case "shimmer-effects":
          capability.enabled = this.shimmerSettings.enabled;
          break;
        case "oil-slick-intensity":
          capability.enabled = this.shimmerSettings.oilSlickIntensity > 0.3;
          break;
        case "chromatic-aberration":
          capability.enabled = this.shimmerSettings.chromaticAberration > 1.0;
          break;
        case "interference-patterns":
          capability.enabled = this.shimmerSettings.interferencePattern;
          break;
        case "gpu-acceleration":
          capability.enabled = this.shimmerSettings.useGPUAcceleration;
          break;
        case "element-pooling":
          capability.enabled = this.shimmerSettings.poolingEnabled;
          break;
      }
    });
  }

  private getBaseSettingsForLevel(level: string): Partial<ShimmerSettings> {
    switch (level) {
      case "low":
        return {
          maxSimultaneousShimmers: 3,
          animationSpeed: 0.2,
          oilSlickIntensity: 0.3,
          chromaticAberration: 0.5,
          useGPUAcceleration: false,
          interferencePattern: false,
        };
        break;
      case "low":
        return {
          maxSimultaneousShimmers: 5,
          animationSpeed: 0.3,
          oilSlickIntensity: 0.4,
          chromaticAberration: 1.0,
          useGPUAcceleration: false,
          interferencePattern: false,
        };
      case "medium":
        return {
          maxSimultaneousShimmers: 8,
          animationSpeed: 0.5,
          oilSlickIntensity: 0.7,
          chromaticAberration: 2.0,
          useGPUAcceleration: true,
          interferencePattern: true,
        };
      case "high":
        return {
          maxSimultaneousShimmers: 16,
          animationSpeed: 1.0,
          oilSlickIntensity: 1.0,
          chromaticAberration: 3.0,
          useGPUAcceleration: true,
          interferencePattern: true,
        };
      default:
        return {};
    }
  }

  private applyQualityToExistingElements(): void {
    // Update existing shimmer elements with new quality settings
    this.shimmerElements.forEach((shimmerElement, element) => {
      // Update animation speed
      if (shimmerElement.animation) {
        shimmerElement.animation.playbackRate =
          this.shimmerSettings.animationSpeed;
      }

      // Update intensity
      shimmerElement.intensity = this.shimmerSettings.oilSlickIntensity;

      // Update CSS variables for the shimmer layer using coordination
      const qualityVariables = {
        "--sn-shimmer-intensity": this.shimmerSettings.oilSlickIntensity.toString(),
        "--sn-shimmer-chromatic": this.shimmerSettings.chromaticAberration.toString(),
        "--sn-shimmer-speed": this.shimmerSettings.animationSpeed.toString()
      };

      this.cssController.batchSetVariables(
        "IridescentShimmerEffectsSystem",
        qualityVariables,
        "normal", // Normal priority for quality adjustments
        "shimmer-quality-update"
      );
    });
  }

  private calculateAverageProcessingTime(): number {
    // Estimate processing time based on active shimmer count and complexity
    const activeShimmers = Array.from(this.shimmerElements.values()).filter(
      (el) => el.isVisible
    ).length;
    const baseTime = 2; // Base processing time in ms
    const complexityMultiplier =
      (this.shimmerSettings.oilSlickIntensity +
        this.shimmerSettings.chromaticAberration / 3 +
        this.shimmerSettings.animationSpeed) /
      3;

    return baseTime * activeShimmers * complexityMultiplier;
  }

  private estimateMemoryUsage(): number {
    const activeShimmers = Array.from(this.shimmerElements.values()).filter(
      (el) => el.isVisible
    ).length;
    const baseMemoryPerShimmer = 0.5; // MB per shimmer element
    const textureMemory = this.shimmerSettings.useGPUAcceleration ? 2 : 0; // GPU texture memory

    return baseMemoryPerShimmer * activeShimmers + textureMemory;
  }

  private estimateCPUUsage(activeShimmers: number): number {
    const baseUsage = 3; // Base CPU usage percentage
    const complexityFactor =
      (this.shimmerSettings.oilSlickIntensity +
        this.shimmerSettings.chromaticAberration / 3) /
      2;
    const gpuOffload = this.shimmerSettings.useGPUAcceleration ? 0.5 : 1.0; // GPU reduces CPU load

    return Math.min(
      40,
      baseUsage * activeShimmers * complexityFactor * gpuOffload
    );
  }

  /**
   * Adjust quality level for performance optimization (QualityScalingCapable interface)
   */
  public adjustQuality(level: import('@/core/performance/SimplePerformanceCoordinator').QualityLevel): void {
    this.currentQualityLevel = level;
    
    // Adjust shimmer settings based on performance tier
    switch (level) {
      case 'low':
        this.shimmerSettings.intensity = "minimal";
        this.shimmerSettings.oilSlickIntensity = 0.2;
        this.shimmerSettings.useGPUAcceleration = false;
        break;
      case 'medium':
        this.shimmerSettings.intensity = "balanced";
        this.shimmerSettings.oilSlickIntensity = 0.5;
        this.shimmerSettings.useGPUAcceleration = true;
        break;
      case 'high':
      default:
        this.shimmerSettings.intensity = "intense";
        this.shimmerSettings.oilSlickIntensity = 0.8;
        this.shimmerSettings.useGPUAcceleration = true;
        break;
    }
  }
}
