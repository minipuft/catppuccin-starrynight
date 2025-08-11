import { YEAR3000_CONFIG } from "@/config/globalConfig";
import { DeviceCapabilityDetector } from "@/core/performance/DeviceCapabilityDetector";
import { SimplePerformanceCoordinator } from "@/core/performance/SimplePerformanceCoordinator";
import { SettingsManager } from "@/ui/managers/SettingsManager";
import { MusicSyncService } from "@/audio/MusicSyncService";
import type { Year3000Config } from "@/types/models";

import {
  CanvasContextType,
  CanvasResult,
  createOptimizedCanvas,
  detectRenderingCapabilities,
} from "@/utils/graphics/VisualCanvasFactory";
import * as Year3000Utilities from "@/utils/core/Year3000Utilities";
import { selectPerformanceProfile } from "@/utils/animation/visualPerformance";

// Extend the config type locally to include the missing property
type SystemConfig = Year3000Config & {
  performanceProfiles?: { [key: string]: any };
};

// Add SystemMetrics interface for strong typing of the metrics object.
interface SystemMetrics {
  initializationTime: number;
  updates: number;
  errors: number;
}

export abstract class BaseVisualSystem {
  protected config: SystemConfig;
  protected utils: typeof Year3000Utilities;
  protected performanceMonitor: SimplePerformanceCoordinator;
  protected musicSyncService: MusicSyncService | null;
  protected settingsManager: SettingsManager | null;
  protected systemName: string;
  public initialized: boolean;
  public isActive: boolean;
  protected currentPerformanceProfile: any; // Can be defined better later
  private boundHandleSettingsChange: (event: Event) => void;

  // Add missing properties from the original JS version for state management.
  protected metrics: SystemMetrics;
  private _resizeHandler: (() => void) | null;

  // GPU-accelerated canvas support
  protected canvasCapabilities: {
    webgl2: boolean;
    recommendedType: CanvasContextType;
  } | null = null;
  protected activeCanvasResults: Map<string, CanvasResult> = new Map();

  constructor(
    config: SystemConfig = YEAR3000_CONFIG,
    utils: typeof Year3000Utilities = Year3000Utilities,
    performanceMonitor: SimplePerformanceCoordinator,
    musicSyncService: MusicSyncService | null,
    settingsManager: SettingsManager | null
  ) {
    this.config = config;
    this.utils = utils;
    this.performanceMonitor = performanceMonitor;
    this.musicSyncService = musicSyncService;
    this.settingsManager = settingsManager;
    this.systemName = this.constructor.name;
    this.initialized = false;
    this.isActive = false;
    this.currentPerformanceProfile = {};

    // Initialize new properties in the constructor.
    this.metrics = {
      initializationTime: 0,
      updates: 0,
      errors: 0,
    };
    this._resizeHandler = null;

    this.boundHandleSettingsChange = this.handleSettingsChange.bind(this);

    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Constructor`);
    }
  }

  // Replace the current skeletal `initialize` method with this complete, multi-phase version.
  async initialize() {
    const initStartTime = this.config.enableDebug ? performance.now() : 0;
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Initializing...`);
    }

    // Phase 1: Set up settings manager and performance profile listener.
    if (this.settingsManager) {
      document.addEventListener(
        "year3000SystemSettingsChanged",
        this.boundHandleSettingsChange
      );
      // Determine an appropriate performance profile entirely via auto-detection.
      try {
        const detectorInstance = (globalThis as any).year3000System
          ?.deviceCapabilityDetector as DeviceCapabilityDetector;

        let quality: "low" | "balanced" | "high" = "balanced";
        if (detectorInstance?.isInitialized) {
          quality = detectorInstance.recommendPerformanceQuality();
        }

        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Auto-selected performance quality '${quality}' based on device capability.`);
        }

        this._applyPerformanceProfile(quality);
      } catch (e) {
        // Fall back to a balanced profile on error.
        this.performanceMonitor?.emitTrace?.(
          `[${this.systemName}] Device capability detection failed; defaulting to 'balanced'.`,
          e as any
        );
        this._applyPerformanceProfile("balanced");
      }
    }

    // Phase 2: Call the system-specific initialization hook for subclasses.
    await this._performSystemSpecificInitialization();

    // Phase 3: Mark as initialized before subscribing to prevent race conditions.
    this.initialized = true;
    this.isActive = true;

    // Phase 4: Subscribe to the MusicSyncService, validating dependencies first.
    if (this.musicSyncService) {
      if (this._validateDependenciesForSubscription()) {
        this.musicSyncService.subscribe(this, this.systemName);
        if (this.config.enableDebug) {
          console.log(`[${this.systemName}] Subscribed to MusicSyncService.`);
        }
      } else {
        console.warn(
          `[${this.systemName}] Dependency validation failed; subscription skipped.`
        );
      }
    }

    if (this.config.enableDebug) {
      const duration = performance.now() - initStartTime;
      console.log(`[${this.systemName}] Initialization complete in ${duration.toFixed(2)}ms`);
    }
  }

  // Add new virtual methods for subclass extension.
  // These provide safe hooks for custom initialization logic.
  async _performSystemSpecificInitialization(): Promise<void> {
    // Detect canvas capabilities during initialization
    this.canvasCapabilities = detectRenderingCapabilities();
    if (this.canvasCapabilities) {
      this.performanceMonitor?.emitTrace?.(
        `[${this.systemName}] Canvas capabilities detected: WebGL2=${this.canvasCapabilities.webgl2}, Recommended=${this.canvasCapabilities.recommendedType}`
      );
    }

    // Base implementation sets up GPU-accelerated canvas support.
    // Subclasses can override this to add specific initialization.
  }

  _validateDependenciesForSubscription(): boolean {
    if (typeof this.updateFromMusicAnalysis !== "function") {
      console.error(
        `[${this.systemName}] Missing updateFromMusicAnalysis method.`
      );
      return false;
    }
    if (!this.initialized) {
      console.warn(`[${this.systemName}] System not initialized.`);
      return false;
    }
    return this._performAdditionalDependencyValidation();
  }

  _performAdditionalDependencyValidation(): boolean {
    // Base implementation is a pass-through. Subclasses can add specific checks.
    return true;
  }

  // Replace the current skeletal `destroy` method with this complete version for proper cleanup.
  destroy() {
    if (this.config.enableDebug) {
      console.log(`[${this.systemName}] Destroying...`);
    }

    try {
      this.initialized = false;
      this.isActive = false;

      // Unsubscribe from services to prevent memory leaks.
      if (this.musicSyncService) {
        this.musicSyncService.unsubscribe(this.systemName);
      }

      // Remove event listeners.
      if (this.settingsManager && this.boundHandleSettingsChange) {
        document.removeEventListener(
          "year3000SystemSettingsChanged",
          this.boundHandleSettingsChange
        );
      }

      if (this._resizeHandler) {
        window.removeEventListener("resize", this._resizeHandler);
        this._resizeHandler = null;
      }

      // Call the system-specific cleanup hook.
      this._performSystemSpecificCleanup();
    } catch (error) {
      console.error(`[${this.systemName}] Error during destruction:`, error);
      this.metrics.errors++;
    }
  }

  // Add the virtual cleanup hook for subclasses.
  _performSystemSpecificCleanup(): void {
    // Clean up GPU-accelerated canvas resources
    for (const [id, canvasResult] of this.activeCanvasResults) {
      const canvas = canvasResult.canvas;
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }

      if (this.config.enableDebug) {
        console.log(
          `[${this.systemName}] Cleaned up canvas: ${id} (type: ${canvasResult.type})`
        );
      }
    }
    this.activeCanvasResults.clear();

    // Base implementation cleans up GPU resources. Subclasses can override this.
  }

  public updateFromMusicAnalysis(
    processedMusicData: any,
    ...args: any[]
  ): void {
    // Intentionally empty – override in subclasses that need music data.
  }

  /**
   * Unified animation hook called by MasterAnimationCoordinator.
   * Subclasses can override this method or implement updateAnimation for legacy support.
   *
   * @param deltaMs - Time in milliseconds since the last frame for this system
   */
  public onAnimate(deltaMs: number): void {
    if (typeof this.updateAnimation === "function") {
      // Preserve legacy signature (timestamp, deltaTime)
      this.updateAnimation(performance.now(), deltaMs);
    }

    // Subclasses that override onAnimate can add their own logic without
    // relying on updateAnimation.
  }

  /**
   * Legacy animation method for backward compatibility.
   * New systems should override onAnimate instead.
   */
  public updateAnimation?(timestamp: number, deltaTime: number): void;

  public updateModeConfiguration(modeConfig: any) {
    // Base implementation
  }

  /**
   * Base implementation of the settings-change hook. It is intentionally empty
   * now that the legacy `sn-performanceQuality` key has been removed. Subclasses
   * should override this method if they need to respond to other settings keys
   * and are still encouraged to call `super.handleSettingsChange(event)`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSettingsChange(event: Event) {
    // No-op in the base class.
  }

  _applyPerformanceProfile(quality: string) {
    if (!this.config?.performanceProfiles) {
      this.performanceMonitor?.emitTrace?.(
        `[${this.systemName}] Performance profiles not found in config.`
      );
      return;
    }

    const profile = selectPerformanceProfile(
      quality,
      this.config.performanceProfiles,
      {
        trace: (msg) => this.performanceMonitor?.emitTrace(msg),
      }
    );

    if (profile) {
      this.currentPerformanceProfile = profile;
      this.performanceMonitor?.emitTrace?.(
        `[BaseVisualSystem (${this.systemName})] Applied performance profile '${quality}'`,
        profile
      );
    } else {
      this.performanceMonitor?.emitTrace?.(
        `[${this.systemName}] Performance profile '${quality}' not found.`
      );
    }
  }

  public getCosmicState(): { [key: string]: number } {
    if (typeof document === "undefined") return {};

    const root = document.documentElement;
    const style = getComputedStyle(root);

    return {
      energy: parseFloat(style.getPropertyValue("--sn-kinetic-energy")) || 0.5,
      valence:
        parseFloat(style.getPropertyValue("--sn-kinetic-valence")) || 0.5,
      bpm: parseFloat(style.getPropertyValue("--sn-kinetic-bpm")) || 120,
      tempoMultiplier:
        parseFloat(style.getPropertyValue("--sn-kinetic-tempo-multiplier")) ||
        1.0,
      beatPhase:
        parseFloat(style.getPropertyValue("--sn-kinetic-beat-phase")) || 0,
      beatPulse:
        parseFloat(style.getPropertyValue("--sn-kinetic-beat-pulse")) || 0,
    };
  }

  /**
   * Create GPU-accelerated optimized canvas with kinetic styling.
   * This method prioritizes WebGL2 > 2D Canvas based on device capabilities.
   */
  protected async _createOptimizedKineticCanvas(
    id: string,
    zIndex = 5,
    blendMode = "screen",
    kineticMode = "pulse"
  ): Promise<CanvasResult> {
    // Remove existing canvas if present
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Determine preferred canvas type based on performance profile and capabilities
    let preferredType: CanvasContextType = "2d";
    if (this.canvasCapabilities && this.currentPerformanceProfile) {
      const quality = this.currentPerformanceProfile.quality || "balanced";

      if (quality !== "low" && this.canvasCapabilities.webgl2) {
        preferredType = "webgl2";
      }
    }

    // Create optimized canvas
    const canvasResult = await createOptimizedCanvas({
      id,
      width: window.innerWidth,
      height: window.innerHeight,
      alpha: true,
      antialias: true,
      preferredType,
    });

    // Apply kinetic styling
    const canvas = canvasResult.canvas;
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${zIndex};
      pointer-events: none;
      mix-blend-mode: ${blendMode};
    `;

    // Add kinetic classes and styling
    canvas.classList.add("year3000-kinetic-canvas");
    canvas.dataset.kineticMode = kineticMode;
    canvas.dataset.systemName = this.systemName;
    canvas.dataset.canvasType = canvasResult.type;

    const kineticStyles = this._getKineticStyles(kineticMode);
    Object.assign(canvas.style, kineticStyles);

    // Append to body
    document.body.appendChild(canvas);

    // Store canvas result for tracking and cleanup
    this.activeCanvasResults.set(id, canvasResult);

    // Set up resize handler for optimized canvas
    this._resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (typeof (this as any).handleResize === "function") {
        (this as any).handleResize();
      }
    };

    window.addEventListener("resize", this._resizeHandler);
    this._resizeHandler(); // Set initial size

    if (this.config.enableDebug) {
      console.log(
        `[BaseVisualSystem (${this.systemName})] Created optimized kinetic canvas: ${canvasResult.type} (mode: ${kineticMode})`
      );
    }

    return canvasResult;
  }

  /**
   * Get current canvas rendering capabilities.
   */
  public getCanvasCapabilities() {
    return this.canvasCapabilities;
  }

  /**
   * Check if GPU acceleration is available and active.
   */
  public hasGPUAcceleration(): boolean {
    return (
      this.canvasCapabilities?.webgl2 ||
      false
    );
  }

  protected _createKineticCanvas(
    id: string,
    zIndex = 5,
    blendMode = "screen",
    kineticMode = "pulse"
  ): HTMLCanvasElement {
    // This method leverages the existing canvas creation utility.
    const canvas = this._createCanvasElement(id, zIndex, blendMode);

    // It adds kinetic CSS classes and data attributes for styling and identification.
    canvas.classList.add("year3000-kinetic-canvas");
    canvas.dataset.kineticMode = kineticMode;
    canvas.dataset.systemName = this.systemName;

    // It applies CSS animations based on the selected kinetic mode.
    const kineticStyles = this._getKineticStyles(kineticMode);
    Object.assign(canvas.style, kineticStyles);

    if (this.config.enableDebug) {
      console.log(
        `[BaseVisualSystem (${this.systemName})] Created kinetic canvas with mode: ${kineticMode}`
      );
    }

    return canvas;
  }

  private _getKineticStyles(kineticMode: string): Partial<CSSStyleDeclaration> {
    const baseStyles: Partial<CSSStyleDeclaration> = {
      transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    switch (kineticMode) {
      case "pulse":
        return {
          ...baseStyles,
          animation:
            "year3000-pulse calc(var(--sn-kinetic-tempo-multiplier, 1) * 1s) ease-in-out infinite",
        };
      case "breathe":
        return {
          ...baseStyles,
          animation:
            "year3000-breathe calc(var(--sn-kinetic-tempo-multiplier, 1) * 4s) ease-in-out infinite",
        };
      case "flow":
        return {
          ...baseStyles,
          animation:
            "year3000-flow calc(var(--sn-kinetic-tempo-multiplier, 1) * 8s) linear infinite",
        };
      default:
        return baseStyles;
    }
  }

  protected _createCanvasElement(
    id: string,
    zIndex: number,
    blendMode: string
  ): HTMLCanvasElement {
    const existing = document.getElementById(id);
    if (existing) {
      // If a canvas with the same ID exists, remove it before creating a new one.
      existing.remove();
    }
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${zIndex};
      pointer-events: none;
      mix-blend-mode: ${blendMode};
    `;
    document.body.appendChild(canvas);

    // Define the resize handler.
    this._resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Check if a subclass has implemented a specific handleResize method.
      if (typeof (this as any).handleResize === "function") {
        (this as any).handleResize();
      }
    };

    // Attach the listener and call it once to set the initial size.
    window.addEventListener("resize", this._resizeHandler);
    this._resizeHandler(); // Set initial size

    return canvas;
  }

  /**
   * Apply a fully-resolved PerformanceProfile coming from Year3000System.
   * Sub-systems may override this to adjust internal parameters (particle
   * counts, throttle values, etc.). The base implementation simply stores the
   * profile so dependants can query `currentPerformanceProfile`.
   */
  public applyPerformanceSettings(
    profile: import("@/types/models").PerformanceProfile
  ): void {
    this.currentPerformanceProfile = profile;

    // Legacy path – if the system previously relied on quality tiers, convert
    // the object to a string key when possible.
    if (
      (profile as any).quality &&
      typeof this._applyPerformanceProfile === "function"
    ) {
      // Keep internal behaviour unchanged for older systems.
      this._applyPerformanceProfile?.((profile as any).quality);
    }

    if (this.config.enableDebug) {
      this.performanceMonitor?.emitTrace?.(
        `[BaseVisualSystem (${this.systemName})] Performance settings applied`,
        profile
      );
    }
  }

  /**
   * Centralised settings responder invoked by Year3000System.  The base
   * implementation simply adapts the parameters into a synthetic CustomEvent
   * so that legacy subclasses overriding `handleSettingsChange` continue to
   * work without modification.  Newer systems can override this directly for
   * efficiency.
   */
  public applyUpdatedSettings?(key: string, value: any): void {
    // Build a minimal CustomEvent identical to what SettingsManager used to
    // dispatch so that existing overrides (expecting event.detail.key/value)
    // still operate.
    const evt = new CustomEvent("year3000SystemSettingsChanged", {
      detail: { key, value },
    });
    try {
      this.handleSettingsChange(evt);
    } catch (err) {
      if (this.config.enableDebug) {
        console.warn(
          `[BaseVisualSystem] ${this.systemName} applyUpdatedSettings error`,
          err
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SETTINGS-AWARE REPAINT CONTRACT
  // ---------------------------------------------------------------------------
  /**
   * Default no-op implementation.  Subclasses that cache colours, shaders, or
   * other theme-dependent resources should override and perform a lightweight
   * refresh.
   */
  public forceRepaint(_reason: string = "generic"): void {
    /* no-op by default */
  }
}
