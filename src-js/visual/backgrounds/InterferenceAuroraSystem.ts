import { ColorHarmonyEngine } from "@/audio/ColorHarmonyEngine";
import type { Year3000Config } from "@/types/models";
import { BaseVisualSystem } from "@/visual/base/BaseVisualSystem";

interface BassEvent {
  timestamp: number;
  intensity: number;
  loudness: number;
  energyDiff: number;
}

/**
 * Bass Sensitivity Manager - Tracks significant bass events and applies fatigue
 * to prevent overwhelming repetitive effects.
 */
class BassSensitivityManager {
  private recentBassEvents: BassEvent[] = [];
  private readonly fatigueDecayTime = 2000; // 2 seconds
  private readonly significanceThreshold = -8; // dB threshold
  private readonly maxEvents = 5; // Maximum events before full fatigue

  /**
   * Calculate bass significance with intelligent fatigue system.
   * @param loudness - Current loudness in dB
   * @param energy - Current energy level (0-1)
   * @returns Significance factor (0-1), where 1.0 = full effect, 0.0 = fatigued
   */
  calculateBassSignificance(loudness: number, energy: number): number {
    const now = Date.now();

    // Remove old events outside decay window
    this.recentBassEvents = this.recentBassEvents.filter(
      (event) => now - event.timestamp < this.fatigueDecayTime
    );

    // Calculate fatigue based on recent event density
    const eventCount = this.recentBassEvents.length;
    const fatigueFactor = Math.max(0, 1 - eventCount / this.maxEvents);

    // Determine if this is a significant bass event
    const isSignificant = loudness > this.significanceThreshold && energy > 0.6;

    if (isSignificant && fatigueFactor > 0.1) {
      // Record this event
      this.recentBassEvents.push({
        timestamp: now,
        intensity: fatigueFactor,
        loudness,
        energyDiff: energy,
      });

      return fatigueFactor;
    }

    return 0;
  }

  /**
   * Get current fatigue level for debugging.
   */
  getCurrentFatigue(): number {
    const eventCount = this.recentBassEvents.length;
    return Math.min(1, eventCount / this.maxEvents);
  }

  /**
   * Reset fatigue state (for testing or manual reset).
   */
  reset(): void {
    this.recentBassEvents = [];
  }
}

/**
 * Interference Aurora System - Creates wave interference patterns and aurora flows
 * that respond to significant bass events with analogous color harmonies.
 */
export class InterferenceAuroraSystem extends BaseVisualSystem {
  private bassSensitivity = new BassSensitivityManager();
  private colorHarmonyEngine: ColorHarmonyEngine | null = null;
  private analogousColors: { base: number; shift: number } = {
    base: 180,
    shift: 30,
  };
  private isAuroraActive = false;
  private auroraFadeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    config: Year3000Config,
    utils: any,
    performanceMonitor: any,
    musicSyncService: any,
    settingsManager: any,
    colorHarmonyEngine?: ColorHarmonyEngine
  ) {
    super(config, utils, performanceMonitor, musicSyncService, settingsManager);
    this.colorHarmonyEngine = colorHarmonyEngine || null;
  }

  override async _performSystemSpecificInitialization(): Promise<void> {
    await super._performSystemSpecificInitialization();

    // Initialize CSS custom properties for wave control
    this.initializeWaveVariables();

    // Create interference patterns in the DOM
    this.createInterferenceElements();

    if (this.config.enableDebug) {
      console.log(
        `[${this.systemName}] Interference Aurora System initialized`
      );
    }
  }

  private initializeWaveVariables(): void {
    const root = document.documentElement;

    // Wave control variables
    root.style.setProperty("--sn-wave-frequency-1", "0deg");
    root.style.setProperty("--sn-wave-frequency-2", "120deg");
    root.style.setProperty("--sn-wave-frequency-3", "240deg");
    root.style.setProperty("--sn-wave-amplitude", "0.5");
    root.style.setProperty("--sn-interference-opacity", "0.3");

    // Aurora control variables
    root.style.setProperty("--sn-aurora-intensity", "0");
    root.style.setProperty("--sn-aurora-flow-speed", "4s");

    // Analogous color variables
    root.style.setProperty("--sn-analogous-hue-base", "180deg");
    root.style.setProperty("--sn-analogous-hue-shift", "30deg");
  }

  private createInterferenceElements(): void {
    // Find the main view element
    const mainView = document.querySelector(".Root__main-view") as HTMLElement;
    if (!mainView) {
      if (this.config.enableDebug) {
        console.warn(`[${this.systemName}] Main view element not found`);
      }
      return;
    }

    // Add interference wave styles
    this.addInterferenceStyles();
  }

  private addInterferenceStyles(): void {
    // Create style element for interference patterns
    const styleId = "interference-aurora-styles";
    let existingStyle = document.getElementById(styleId);

    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Interference Wave Patterns - Coordinated with existing gradient system */
      .main-view-container__scroll-node::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: -1;
        pointer-events: none;

        background:
          conic-gradient(
            from calc(var(--sn-wave-frequency-1) * var(--sn-wave-amplitude)),
            transparent 0deg,
            hsla(calc(var(--sn-analogous-hue-base) - var(--sn-analogous-hue-shift)), 70%, 60%, 0.1) 90deg,
            transparent 180deg,
            hsla(calc(var(--sn-analogous-hue-base)), 70%, 65%, 0.1) 270deg,
            transparent 360deg
          ),
          conic-gradient(
            from calc(var(--sn-wave-frequency-2) * var(--sn-wave-amplitude)),
            transparent 0deg,
            hsla(calc(var(--sn-analogous-hue-base) + var(--sn-analogous-hue-shift)), 70%, 60%, 0.1) 120deg,
            transparent 240deg
          );

        opacity: var(--sn-interference-opacity);
        mix-blend-mode: overlay;
        animation: interference-pulse calc(60000ms / var(--sn-kinetic-bpm, 120)) ease-in-out infinite;
      }

      /* Aurora Flow Streams - Uses a dedicated wrapper to avoid conflicts */
      .main-view-container__scroll-node .sn-aurora-flow-layer {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: -2;
        pointer-events: none;

        background: linear-gradient(
          45deg,
          transparent 0%,
          hsla(calc(var(--sn-analogous-hue-base) - 15deg), 80%, 70%, 0.4) 25%,
          hsla(calc(var(--sn-analogous-hue-base) + 15deg), 80%, 75%, 0.5) 50%,
          hsla(calc(var(--sn-analogous-hue-base) + 45deg), 80%, 70%, 0.4) 75%,
          transparent 100%
        );

        clip-path: polygon(0% 20%, 30% 0%, 60% 40%, 100% 60%, 70% 100%, 40% 80%);
        opacity: calc(var(--sn-aurora-intensity) * 0.6);
        transform: translateX(calc(var(--sn-aurora-intensity) * -100%));
        transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

        animation: aurora-flow var(--sn-aurora-flow-speed) linear infinite;
      }

      /* Keyframe Animations */
      @keyframes interference-pulse {
        0%, 100% {
          transform: scale(1) rotate(0deg);
          opacity: var(--sn-interference-opacity);
        }
        50% {
          transform: scale(1.02) rotate(calc(var(--sn-wave-amplitude) * 5deg));
          opacity: calc(var(--sn-interference-opacity) * 1.2);
        }
      }

      @keyframes aurora-flow {
        0% {
          transform: translateX(-100%) translateY(-10%) scale(0.95);
          opacity: 0;
        }
        25% {
          opacity: calc(var(--sn-aurora-intensity) * 0.6);
        }
        75% {
          opacity: calc(var(--sn-aurora-intensity) * 0.4);
        }
        100% {
          transform: translateX(100%) translateY(10%) scale(1.05);
          opacity: 0;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        .main-view-container__scroll-node::before {
          animation: none;
          opacity: calc(var(--sn-interference-opacity) * 0.5);
        }

        .main-view-container__scroll-node .sn-aurora-flow-layer {
          animation: none;
          transition: opacity 300ms ease;
        }
      }

      /* Performance-conscious mobile optimization */
      @media (max-width: 768px) {
        .main-view-container__scroll-node::before,
        .main-view-container__scroll-node .sn-aurora-flow-layer {
          will-change: opacity;
          transform: translateZ(0); /* Force GPU layer */
        }
      }
    `;

    document.head.appendChild(style);
  }

  override updateFromMusicAnalysis(processedData: any): void {
    if (!this.initialized || !this.isActive) return;

    const { loudness, energy, enhancedBPM, beatOccurred } = processedData;

    // Update interference waves on beat
    if (beatOccurred) {
      this.updateInterferenceWaves(energy);
    }

    // Check for significant bass events
    const bassSignificance = this.bassSensitivity.calculateBassSignificance(
      loudness,
      energy
    );
    if (bassSignificance > 0) {
      this.triggerAuroraFlow(bassSignificance);
    }

    // Update analogous colors from ColorHarmonyEngine
    this.updateAnalogousColors();

    // Update BPM-based timing
    if (enhancedBPM && enhancedBPM > 0) {
      this.updateBPMTiming(enhancedBPM);
    }
  }

  private updateInterferenceWaves(energy: number): void {
    const amplitude = Math.min(1.0, energy * 1.2);
    const root = document.documentElement;

    // Update wave amplitude based on energy
    root.style.setProperty("--sn-wave-amplitude", amplitude.toString());

    // Rotate wave frequencies slightly on each beat
    const currentFreq1 =
      parseFloat(
        getComputedStyle(root).getPropertyValue("--sn-wave-frequency-1") || "0"
      ) || 0;
    const currentFreq2 =
      parseFloat(
        getComputedStyle(root).getPropertyValue("--sn-wave-frequency-2") ||
          "120"
      ) || 120;
    const currentFreq3 =
      parseFloat(
        getComputedStyle(root).getPropertyValue("--sn-wave-frequency-3") ||
          "240"
      ) || 240;

    root.style.setProperty(
      "--sn-wave-frequency-1",
      `${(currentFreq1 + energy * 10) % 360}deg`
    );
    root.style.setProperty(
      "--sn-wave-frequency-2",
      `${(currentFreq2 + energy * 15) % 360}deg`
    );
    root.style.setProperty(
      "--sn-wave-frequency-3",
      `${(currentFreq3 + energy * 12) % 360}deg`
    );
  }

  private triggerAuroraFlow(intensity: number): void {
    const root = document.documentElement;

    // Set aurora intensity
    root.style.setProperty("--sn-aurora-intensity", intensity.toString());
    this.isAuroraActive = true;

    // Clear existing fade timeout
    if (this.auroraFadeTimeout) {
      clearTimeout(this.auroraFadeTimeout);
    }

    // Auto-fade aurora after duration based on intensity
    const fadeDuration = Math.max(800, intensity * 1500);
    this.auroraFadeTimeout = setTimeout(() => {
      root.style.setProperty("--sn-aurora-intensity", "0");
      this.isAuroraActive = false;
      this.auroraFadeTimeout = null;
    }, fadeDuration);

    if (this.config.enableDebug) {
      console.log(
        `[${
          this.systemName
        }] Aurora triggered with intensity: ${intensity.toFixed(2)}`
      );
    }
  }

  private updateAnalogousColors(): void {
    try {
      // Get current accent color from CSS variables (canonical source)
      const root = document.documentElement;
      const accentHex = getComputedStyle(root)
        .getPropertyValue("--sn-accent-hex")
        .trim();

      if (accentHex) {
        // Parse hex color to RGB
        const rgb = this.hexToRgb(accentHex);
        if (rgb) {
          // Convert RGB to HSL to get hue
          const hue = this.rgbToHsl(rgb.r, rgb.g, rgb.b)[0];
          this.analogousColors.base = hue * 360; // Convert to degrees

          root.style.setProperty(
            "--sn-analogous-hue-base",
            `${this.analogousColors.base}deg`
          );

          if (this.config.enableDebug) {
            console.log(
              `[${this.systemName}] Updated analogous base hue: ${this.analogousColors.base}°`
            );
          }
        }
      }
    } catch (error) {
      if (this.config.enableDebug) {
        console.warn(
          `[${this.systemName}] Failed to update analogous colors:`,
          error
        );
      }
    }
  }

  private updateBPMTiming(bpm: number): void {
    const root = document.documentElement;
    const flowSpeed = Math.max(2, (60000 / bpm) * 4); // 4 beats per cycle
    root.style.setProperty("--sn-aurora-flow-speed", `${flowSpeed}ms`);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1] || "0", 16),
          g: parseInt(result[2] || "0", 16),
          b: parseInt(result[3] || "0", 16),
        }
      : null;
  }

  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  public override onAnimate(deltaMs: number): void {
    // Smooth any ongoing transitions
    if (this.isAuroraActive) {
      // Aurora is active, no additional animation needed
      // CSS handles the transitions
    }
  }

  override _performSystemSpecificCleanup(): void {
    super._performSystemSpecificCleanup();

    // Clear aurora fade timeout
    if (this.auroraFadeTimeout) {
      clearTimeout(this.auroraFadeTimeout);
      this.auroraFadeTimeout = null;
    }

    // Remove interference styles
    const styleElement = document.getElementById("interference-aurora-styles");
    if (styleElement) {
      styleElement.remove();
    }

    // Reset bass sensitivity state
    this.bassSensitivity.reset();

    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Cleanup completed`);
    }
  }

  /**
   * Get debug information about the current state.
   */
  public getDebugInfo(): any {
    return {
      systemName: this.systemName,
      isAuroraActive: this.isAuroraActive,
      bassFatigue: this.bassSensitivity.getCurrentFatigue(),
      analogousColors: this.analogousColors,
      initialized: this.initialized,
      isActive: this.isActive,
    };
  }
}
